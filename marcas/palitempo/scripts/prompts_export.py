#!/usr/bin/env python3
"""Exporta o prompt COMPLETO de cada cena (o mesmo que o imagens.py manda à API): PROMPT DE ESTILO
+ referências/descrições dos personagens + cena + trava de estilo. Para colar no Gemini da web.

Uso: prompts_export.py <pasta_video>   ->  05_prompts_imagens.md e prompts_imagens.json
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from common import load_config, resolve_video_dir, load_cenas
from imagens import montar_prompt

cfg = load_config(); v = resolve_video_dir(sys.argv[1])
out = []
for c in load_cenas(v):
    if c.get("tipo") == "reuso_narrador": continue
    ids = c.get("personagens", [])
    out.append({"id": c["id"], "tipo": c.get("tipo", "imagem"), "texto": c["texto"],
                "refs": [f"{p}.png" for p in ids], "arquivo": f"img/{c['id']}.png",
                "prompt": montar_prompt(cfg, c, ids)})
(v / "prompts_imagens.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
L = ["# Prompts completos das imagens (gerado; não editar aqui)", "",
     f"{len(out)} cenas. Cada bloco é o prompt inteiro (estilo master + personagens + cena). Anexe as referências indicadas e salve como `img/<id>.png`.", ""]
for o in out:
    L += [f"## {o['id']} ({o['tipo']})", f"Narração: {o['texto']}", f"Anexar: {', '.join(o['refs']) or '(nenhuma referência)'}  |  Salvar: `{o['arquivo']}`", "```", o["prompt"], "```", ""]
(v / "05_prompts_imagens.md").write_text("\n".join(L), encoding="utf-8")
print(len(out), "prompts completos exportados")
