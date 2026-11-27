#!/usr/bin/env python3
"""Gera legendas .srt com as durações reais dos mp3 (mesma linha do tempo do kenburns.py).

Uso: srt.py <pasta_video> [--saida out/legendas.srt] [--max-chars 42]
"""
import argparse
import sys
import textwrap
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import load_config, resolve_video_dir, load_cenas, duration, die  # noqa: E402


def ts(t):
    ms = round(t * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def pedacos(texto, max_chars):
    """Quebra em legendas de até 2 linhas, cortando preferencialmente em pontuação."""
    palavras = texto.split()
    blocos, atual = [], []
    for p in palavras:
        atual.append(p)
        if len(" ".join(atual)) >= max_chars * 2 - 8 or (p[-1] in ".!?;" and len(" ".join(atual)) > max_chars):
            blocos.append(" ".join(atual))
            atual = []
    if atual:
        blocos.append(" ".join(atual))
    return blocos


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--saida", default="out/legendas.srt")
    ap.add_argument("--max-chars", type=int, default=42)
    a = ap.parse_args()

    cfg = load_config()
    pad = cfg["render"]["respiro"]
    vdir = resolve_video_dir(a.video)
    t0, n, linhas = 0.0, 1, []
    for c in load_cenas(vdir):
        mp3 = vdir / "vo" / f"{c['id']}.mp3"
        if not mp3.exists():
            die(f"falta vo/{c['id']}.mp3 — rode o tts.py antes")
        d = duration(mp3)
        blocos = pedacos(c["texto"], a.max_chars)
        total_chars = sum(len(b) for b in blocos) or 1
        t = t0
        for b in blocos:
            dur = d * len(b) / total_chars
            corpo = "\n".join(textwrap.wrap(b, a.max_chars))
            linhas.append(f"{n}\n{ts(t)} --> {ts(t + dur)}\n{corpo}\n")
            n += 1
            t += dur
        t0 += d + pad
    out = vdir / a.saida
    out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(linhas), encoding="utf-8")
    print(f"{out}: {n-1} legendas, {t0/60:.1f} min")


if __name__ == "__main__":
    main()
