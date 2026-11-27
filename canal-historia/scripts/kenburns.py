#!/usr/bin/env python3
"""Monta o vídeo final com ffmpeg (sem CapCut), a partir do manifest.json.

- cada cena dura áudio + respiro (0,35s)
- efeitos: zoom_in, zoom_out, pan_left/right/up/down, static, auto (alterna sem repetir)
- zoom sutil (máx. zoom_max), upscale Nx antes do zoompan para não tremer
- se existir clips/sNNN.mp4 (campo "clipe"), usa o clipe no lugar da imagem
- música em loop (~0.12), sidechain ducking sob a narração, fade-out de 3s
- saída 1920x1080, 30fps, H.264 + AAC, faststart

Uso: kenburns.py <manifest.json> [--force] [--limit N] [--music arq.mp3] [--out arq.mp4] [--jobs N]
"""
import argparse
import json
import math
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import load_config, die  # noqa: E402

EFEITOS = {"zoom_in", "zoom_out", "pan_left", "pan_right", "pan_up", "pan_down", "static"}
CICLO_AUTO = ["zoom_in", "pan_right", "zoom_out", "pan_left", "pan_up", "pan_down"]
PAN_ZOOM = 1.12  # zoom fixo durante os pans (precisa ser > 1 para haver folga)


def resolver_efeitos(cenas):
    """Troca 'auto' por um efeito concreto, nunca repetindo o da cena anterior."""
    res, anterior, k = [], None, 0
    for n, c in enumerate(cenas):
        e = c.get("efeito", "auto")
        if e == "auto":
            seguinte = cenas[n + 1].get("efeito") if n + 1 < len(cenas) else None
            while True:  # evita repetir o efeito da cena anterior e o da próxima (se explícito)
                e = CICLO_AUTO[k % len(CICLO_AUTO)]
                k += 1
                if e != anterior and e != seguinte:
                    break
        elif e not in EFEITOS:
            die(f"{c['id']}: efeito desconhecido '{e}' (use {sorted(EFEITOS | {'auto'})})")
        res.append(e)
        anterior = e
    return res


def filtro_zoompan(efeito, frames, zmax, w, h, fps, up):
    n = max(frames - 1, 1)
    cx = "iw/2-(iw/zoom/2)"
    cy = "ih/2-(ih/zoom/2)"
    z, x, y = "1", cx, cy
    if efeito == "zoom_in":
        z = f"1+{zmax - 1:.4f}*on/{n}"
    elif efeito == "zoom_out":
        z = f"{zmax:.4f}-{zmax - 1:.4f}*on/{n}"
    elif efeito.startswith("pan_"):
        z = f"{PAN_ZOOM}"
        if efeito == "pan_right":
            x = f"(iw-iw/zoom)*on/{n}"
        elif efeito == "pan_left":
            x = f"(iw-iw/zoom)*(1-on/{n})"
        elif efeito == "pan_down":
            y = f"(ih-ih/zoom)*on/{n}"
        elif efeito == "pan_up":
            y = f"(ih-ih/zoom)*(1-on/{n})"
    # upscale antes do zoompan evita o tremido de arredondamento de pixel
    return (f"scale={w * up}:{h * up}:force_original_aspect_ratio=increase:flags=lanczos,"
            f"crop={w * up}:{h * up},setsar=1,"
            f"zoompan=z='{z}':x='{x}':y='{y}':d={frames}:s={w}x{h}:fps={fps},format=yuv420p")


def rodar(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        die("ffmpeg falhou:\n" + " ".join(cmd[:6]) + " ...\n" + r.stderr[-1500:])


def renderizar_segmento(base, cena, efeito, cfg, segdir, force):
    r = cfg["render"]
    w, h, fps = r["largura"], r["altura"], r["fps"]
    frames = math.ceil((cena["duracao_audio"] + cena["_respiro"]) * fps)
    dur = frames / fps
    destino = segdir / f"{cena['id']}.mp4"
    chave = segdir / f"{cena['id']}.key"
    usa_clipe = bool(cena.get("clipe")) and (base / cena["clipe"]).exists()
    assinatura = json.dumps([efeito, frames, w, h, fps, r["upscale"], r["zoom_max"], r["crf"], usa_clipe,
                             (base / cena["audio"]).stat().st_mtime_ns,
                             (base / (cena["clipe"] if usa_clipe else cena["imagem"])).stat().st_mtime_ns])
    if not force and destino.exists() and chave.exists() and chave.read_text() == assinatura:
        return cena["id"], dur, False

    audio = base / cena["audio"]
    if usa_clipe:
        entrada = ["-stream_loop", "-1", "-i", str(base / cena["clipe"])]
        vf = (f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},setsar=1,"
              f"fps={fps},format=yuv420p")
    else:
        entrada = ["-i", str(base / cena["imagem"])]
        vf = filtro_zoompan(efeito, frames, r["zoom_max"], w, h, fps, r["upscale"])
    cmd = ["ffmpeg", "-v", "error", "-y", *entrada, "-i", str(audio),
           "-map", "0:v:0", "-map", "1:a:0",
           "-vf", vf, "-af", "aresample=44100,aformat=channel_layouts=stereo,apad",
           "-t", f"{dur:.5f}",
           "-c:v", "libx264", "-preset", r["preset"], "-crf", str(r["crf"]), "-pix_fmt", "yuv420p", "-r", str(fps),
           "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2",
           str(destino)]
    rodar(cmd)
    chave.write_text(assinatura)
    return cena["id"], dur, True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("--force", action="store_true", help="refaz segmentos e a mixagem")
    ap.add_argument("--limit", type=int, help="só as N primeiras cenas (teste)")
    ap.add_argument("--music", help="sobrescreve a música do manifest")
    ap.add_argument("--out", help="arquivo de saída (padrão: manifest.saida; com --limit: out/teste_N.mp4)")
    ap.add_argument("--jobs", type=int, default=1, help="segmentos em paralelo")
    a = ap.parse_args()

    cfg = load_config()
    r = cfg["render"]
    mpath = Path(a.manifest).resolve()
    base = mpath.parent
    m = json.loads(mpath.read_text(encoding="utf-8"))
    cenas = m["cenas"][: a.limit] if a.limit else m["cenas"]
    if not cenas:
        die("manifest sem cenas")
    for c in cenas:
        c["_respiro"] = m.get("respiro", r["respiro"])
        if not (base / c["audio"]).exists():
            die(f"{c['id']}: áudio ausente ({c['audio']})")
        if not ((c.get("clipe") and (base / c["clipe"]).exists()) or (c.get("imagem") and (base / c["imagem"]).exists())):
            die(f"{c['id']}: sem imagem nem clipe")

    out = Path(a.out) if a.out else base / (f"out/teste_{a.limit}.mp4" if a.limit else m.get("saida", "out/video.mp4"))
    out = out if out.is_absolute() else base / out
    segdir = base / "out" / "segs"
    segdir.mkdir(parents=True, exist_ok=True)
    out.parent.mkdir(parents=True, exist_ok=True)

    efeitos = resolver_efeitos(cenas)
    print(f"{len(cenas)} cenas → {out.name}", flush=True)
    resultados = {}
    with ThreadPoolExecutor(max_workers=max(a.jobs, 1)) as ex:
        futs = [ex.submit(renderizar_segmento, base, c, e, cfg, segdir, a.force) for c, e in zip(cenas, efeitos)]
        for c, e, f in zip(cenas, efeitos, futs):
            cid, dur, novo = f.result()
            resultados[cid] = dur
            rotulo = "clipe" if (c.get("clipe") and (base / c["clipe"]).exists()) else e
            print(f"  {'render' if novo else 'cache '} {cid}  {rotulo:<9} {dur:5.2f}s", flush=True)
    total = sum(resultados.values())

    lista = base / "out" / ("concat_teste.txt" if a.limit else "concat.txt")
    lista.write_text("".join(f"file '{(segdir / (c['id'] + '.mp4')).as_posix()}'\n" for c in cenas))
    narr = base / "out" / ("_narracao_teste.mp4" if a.limit else "_narracao.mp4")
    rodar(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lista), "-c", "copy", str(narr)])

    music = a.music or m.get("musica")
    music = (base / music) if music and not Path(music).is_absolute() else (Path(music) if music else None)
    fade = r["fade_out"]
    fade_st = max(total - fade, 0)
    final = ["-map", "0:v", "-c:v", "copy", "-map", "[aout]", "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
             "-t", f"{total:.5f}", "-movflags", "+faststart", str(out)]
    if music and music.exists():
        fc = (f"[1:a]aresample=44100,aformat=channel_layouts=stereo,volume={r['musica_volume']}[m];"
              f"[0:a]asplit=2[n1][n2];"
              f"[m][n1]sidechaincompress=threshold=0.03:ratio=10:attack=15:release=400[duck];"
              f"[n2][duck]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[mix];"
              f"[mix]afade=t=out:st={fade_st:.3f}:d={fade}[aout]")
        rodar(["ffmpeg", "-v", "error", "-y", "-i", str(narr), "-stream_loop", "-1", "-i", str(music),
               "-filter_complex", fc, *final])
        print(f"música: {music.name} (vol {r['musica_volume']}, ducking, fade-out {fade}s)")
    else:
        print("AVISO: sem música (audio/musica.mp3 não encontrado) — só narração.")
        rodar(["ffmpeg", "-v", "error", "-y", "-i", str(narr),
               "-filter_complex", f"[0:a]afade=t=out:st={fade_st:.3f}:d={fade}[aout]", *final])
    print(f"pronto: {out}  ({total/60:.2f} min)")


if __name__ == "__main__":
    main()
