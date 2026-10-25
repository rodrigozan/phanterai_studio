#!/usr/bin/env python3
"""Monta o áudio de um Short a partir de trechos do voz.mp3 de um episódio e refaz o words.json.

Uso: python3 scripts/make-short-audio.py <slug-origem> <slug-destino> ini-fim [ini-fim ...]
Cada trecho em segundos do episódio de origem; os cortes devem cair entre frases.
"""
import json, subprocess, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "public" / "episodes"
src, dst, *cuts = sys.argv[1:]
segs = [tuple(map(float, c.split("-"))) for c in cuts]
words = json.loads((root / src / "words.json").read_text())

fade = 0.02
filters, labels = [], []
for i, (a, b) in enumerate(segs):
    d = b - a
    filters.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={d-fade:.3f}:d={fade}[s{i}]")
    labels.append(f"[s{i}]")
filters.append("".join(labels) + f"concat=n={len(segs)}:v=0:a=1[out]")
out = root / dst
out.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(root / src / "voz.mp3"), "-filter_complex", ";".join(filters),
                "-map", "[out]", "-ar", "44100", "-b:a", "192k", str(out / "voz.mp3")], check=True)

novo, offset = [], 0.0
for a, b in segs:
    for w in words:
        if w["start"] >= a - 0.01 and w["end"] <= b + 0.05:
            novo.append({"w": w["w"], "start": round(w["start"] - a + offset, 3), "end": round(w["end"] - a + offset, 3)})
    offset += b - a
(out / "words.json").write_text(json.dumps(novo, ensure_ascii=False, indent=1))
print(f"{offset:.2f}s, {len(novo)} palavras")
