#!/usr/bin/env python3
"""Gera uma imagem de referência por personagem em elenco/<id>.png, fundo branco, para aprovação.

Uso: elenco.py [--force] [--only farao,escriba] [--dry-run]
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import ROOT, load_config, gemini_image  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--only")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    cfg = load_config()
    ids = list(cfg["elenco"])
    if a.only:
        ids = [i for i in ids if i in {x.strip() for x in a.only.split(",")}]
    (ROOT / "elenco").mkdir(exist_ok=True)
    pend = [i for i in ids if a.force or not (ROOT / "elenco" / f"{i}.png").exists()]
    print(f"{len(ids)} personagem(ns); {len(pend)} a gerar. Modelo {cfg['imagem']['modelo']}.")

    for pid in pend:
        prompt = (f"{cfg['estilo']}\n\nCharacter reference sheet on a plain pure white background, "
                  f"single character, full body, front view, neutral standing pose, centered, no scenery, no shadow, "
                  f"no text.\nCharacter: {cfg['elenco'][pid]}")
        if a.dry_run:
            print(f"--- {pid}\n{prompt}\n")
            continue
        png = gemini_image(cfg, prompt, aspect=cfg["imagem"]["elenco_aspect_ratio"])
        (ROOT / "elenco" / f"{pid}.png").write_bytes(png)
        print(f"  ok {pid}  ({len(png)//1024} KB)", flush=True)
    print("pronto. Aprove as imagens em elenco/ antes de gerar as cenas.")


if __name__ == "__main__":
    main()
