# public/episodes/<slug>/

Uma pasta por episódio, criada ao receber o material do Rod (Etapa 1 da skill
`montagem-video-pantera`):

- `roteiro.md` — roteiro marcado, com blocos `### Cxx` e a seção `## ASSETS_DO_ROD`
- `voz.mp3` — áudio da voz gravado pelo Rod
- assets citados em `## ASSETS_DO_ROD` (prints, vídeos de tela, etc.)
- `words.json` — gerado por `scripts/transcribe.py` (transcrição com tempo por palavra)
- `timeline.json` — gerado por `scripts/align.js` (roteiro + words.json alinhados em frames)
- `props.json` — `{ "slug": "<slug>" }`, passado ao `remotion render`/`remotion studio`
