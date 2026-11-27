#!/usr/bin/env python3
"""Gera vo/sNNN.mp3 por cena com a ElevenLabs (sempre o mesmo voice_id e modelo do config).

Uso: tts.py <pasta_video> [--force] [--only s001,s002] [--limit N] [--dry-run]
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import load_config, resolve_video_dir, load_cenas, select, http_post, need_env, die  # noqa: E402
import os  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--force", action="store_true", help="refaz mesmo se o mp3 existir")
    ap.add_argument("--only", help="ids separados por vírgula")
    ap.add_argument("--limit", type=int, help="só as N primeiras cenas (teste)")
    ap.add_argument("--dry-run", action="store_true", help="mostra o plano e o nº de caracteres, sem chamar a API")
    a = ap.parse_args()

    cfg = load_config()
    t = cfg["tts"]
    vdir = resolve_video_dir(a.video)
    todas = load_cenas(vdir)
    cenas = select(todas, a.only, a.limit)
    (vdir / "vo").mkdir(exist_ok=True)

    voice_id = t.get("voice_id") or os.environ.get(t.get("voice_id_env", ""), "")
    if not voice_id:
        die("voice_id não definido (config.json tts.voice_id ou variável em tts.voice_id_env)")

    pend = [c for c in cenas if a.force or not (vdir / "vo" / f"{c['id']}.mp3").exists()]
    chars = sum(len(c["texto"]) for c in pend)
    print(f"{len(cenas)} cena(s) selecionada(s); {len(pend)} a gerar, {chars} caracteres. "
          f"Modelo {t['model_id']}.")
    if a.dry_run:
        return
    key = need_env("ELEVENLABS_API_KEY")

    idx = {c["id"]: i for i, c in enumerate(todas)}
    for c in pend:
        i = idx[c["id"]]
        body = {"text": c["texto"], "model_id": t["model_id"], "voice_settings": t["voice_settings"]}
        if t.get("language_code"):
            body["language_code"] = t["language_code"]
        if t.get("usar_contexto_vizinho"):
            if i > 0:
                body["previous_text"] = todas[i - 1]["texto"]
            if i < len(todas) - 1:
                body["next_text"] = todas[i + 1]["texto"]
        url = (f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
               f"?output_format={t['output_format']}")
        audio, _ = http_post(url, {"xi-api-key": key, "Accept": "audio/mpeg"}, body,
                             label=f"ElevenLabs {c['id']}")
        out = vdir / "vo" / f"{c['id']}.mp3"
        out.write_bytes(audio)
        print(f"  ok {c['id']}  ({len(audio)//1024} KB)", flush=True)
    print("pronto.")


if __name__ == "__main__":
    main()
