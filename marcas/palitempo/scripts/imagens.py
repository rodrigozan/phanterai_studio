#!/usr/bin/env python3
"""Gera img/sNNN.png por cena (Gemini, 16:9). Prompt sempre começa com o PROMPT DE ESTILO
e envia as imagens de elenco/ dos personagens da cena como referência.

Uso: imagens.py <pasta_video> [--force] [--only s001,s002] [--limit N] [--dry-run]
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import ROOT, load_config, resolve_video_dir, load_cenas, select, gemini_image, die  # noqa: E402


def montar_prompt(cfg, cena, refs_ids):
    partes = [cfg["estilo"]]
    if refs_ids:
        desc = "; ".join(f"{p}: {cfg['elenco'][p]}" for p in refs_ids if p in cfg["elenco"])
        ordem = ", ".join(refs_ids)
        partes.append(f"The attached reference images show the recurring characters, in this order: {ordem}. "
                      f"Keep each character's design, proportions and outfit exactly identical to its reference. "
                      f"Characters: {desc}")
    partes.append("Scene: " + cena["prompt"])
    return "\n\n".join(partes)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--only")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    cfg = load_config()
    vdir = resolve_video_dir(a.video)
    cenas = select(load_cenas(vdir), a.only, a.limit)
    (vdir / "img").mkdir(exist_ok=True)

    cenas = [c for c in cenas if c.get("tipo") != "reuso_narrador"]  # reuso: usa o clipe do narrador, sem gerar imagem
    pend = [c for c in cenas if a.force or not (vdir / "img" / f"{c['id']}.png").exists()]
    print(f"{len(cenas)} cena(s) selecionada(s); {len(pend)} a gerar. Modelo {cfg['imagem']['modelo']}.")

    for c in pend:
        ids = c.get("personagens", [])
        refs = []
        for p in ids:
            ref = ROOT / "elenco" / f"{p}.png"
            if not ref.exists():
                die(f"{c['id']}: falta elenco/{p}.png — rode scripts/elenco.py e aprove o elenco primeiro")
            refs.append(ref)
        prompt = montar_prompt(cfg, c, ids)
        if a.dry_run:
            print(f"--- {c['id']} (refs: {ids})\n{prompt}\n")
            continue
        png = gemini_image(cfg, prompt, refs)
        (vdir / "img" / f"{c['id']}.png").write_bytes(png)
        print(f"  ok {c['id']}  ({len(png)//1024} KB)", flush=True)
    print("pronto.")


if __name__ == "__main__":
    main()
