#!/usr/bin/env python3
"""Gera manifest.json a partir de cenas.json + durações reais dos mp3.

Uso: manifest.py <pasta_video> [--musica audio/musica.mp3]
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import load_config, resolve_video_dir, load_cenas, duration, die  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--musica", default="audio/musica.mp3")
    a = ap.parse_args()

    cfg = load_config()
    r = cfg["render"]
    vdir = resolve_video_dir(a.video)
    cenas = load_cenas(vdir)

    falta = []
    saida = []
    for c in cenas:
        i = c["id"]
        mp3, img, clip = vdir / "vo" / f"{i}.mp3", vdir / "img" / f"{i}.png", vdir / "clips" / f"{i}.mp4"
        if not mp3.exists():
            falta.append(f"vo/{i}.mp3")
        if not img.exists() and not clip.exists():
            falta.append(f"img/{i}.png")
        if falta and (not mp3.exists() or (not img.exists() and not clip.exists())):
            continue
        saida.append({
            "id": i,
            "audio": f"vo/{i}.mp3",
            "imagem": f"img/{i}.png" if img.exists() else None,
            "clipe": f"clips/{i}.mp4" if clip.exists() else None,
            "duracao_audio": round(duration(mp3), 3),
            "efeito": c.get("efeito", "auto"),
        })
    if falta:
        die("arquivos faltando:\n  " + "\n  ".join(falta[:30]) + (f"\n  ... (+{len(falta)-30})" if len(falta) > 30 else ""))

    musica = a.musica if (vdir / a.musica).exists() else None
    m = {
        "largura": r["largura"], "altura": r["altura"], "fps": r["fps"], "respiro": r["respiro"],
        "musica": musica, "saida": "out/video.mp4", "cenas": saida,
    }
    (vdir / "manifest.json").write_text(json.dumps(m, indent=2, ensure_ascii=False), encoding="utf-8")
    total = sum(s["duracao_audio"] + r["respiro"] for s in saida)
    print(f"manifest.json: {len(saida)} cenas, {total/60:.1f} min. Música: {musica or 'NÃO ENCONTRADA (vídeo sairá sem música)'}")


if __name__ == "__main__":
    main()
