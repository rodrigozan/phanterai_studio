#!/usr/bin/env python3
"""Cenas com tipo "reuso_narrador": usam o clipe do narrador (animado pelo Rod).

- img/sNNN.png recebe uma cópia do quadro-base (clips/narrador_base.png) para o manifest funcionar já.
- Cria clips/sNNN.mp4 apontando para o clipe da cena (o kenburns.py usa o clipe e repete/corta na
  duração de cada áudio). CLIPES_POR_ORDEM escolhe o clipe pela ordem entre as cenas de reuso
  (1 = primeira); as demais usam clips/narrador_base.mp4.
Uso: reuso.py <pasta_video> [--force]
"""
import argparse, os, shutil, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from common import resolve_video_dir, load_cenas, die

ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("--force", action="store_true")
a = ap.parse_args()
v = resolve_video_dir(a.video)
base_png, base_mp4 = v / "clips" / "narrador_base.png", v / "clips" / "narrador_base.mp4"
if not base_png.exists(): die("falta clips/narrador_base.png")
(v / "img").mkdir(exist_ok=True); (v / "clips").mkdir(exist_ok=True)
CLIPES_POR_ORDEM = {1: "narrador_base_01.mp4", 5: "narrador_base_01.mp4"}
n_img = n_clip = 0
faltando = set()
reuso = [c for c in load_cenas(v) if c.get("tipo") == "reuso_narrador"]
for ordem, c in enumerate(reuso, 1):
    img = v / "img" / f"{c['id']}.png"
    if a.force or not img.exists(): shutil.copyfile(base_png, img); n_img += 1
    origem = CLIPES_POR_ORDEM.get(ordem, base_mp4.name)
    if not (v / "clips" / origem).exists(): faltando.add(origem); continue
    clip = v / "clips" / f"{c['id']}.mp4"
    if a.force and clip.is_symlink(): clip.unlink()
    if not clip.exists() and not clip.is_symlink(): os.symlink(origem, clip); n_clip += 1
print(f"reuso: {n_img} quadros copiados, {n_clip} clipes ligados"
      + (f" (ainda não existe: {', '.join('clips/' + f for f in sorted(faltando))})" if faltando else ""))
