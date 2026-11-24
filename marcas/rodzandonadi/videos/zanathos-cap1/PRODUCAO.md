# Zanathos Cap. 1 (Ep. 2 da série): como foi produzido

Mesmo método do Ep. 1 (`zanathos-ep1`): voz do Rod no ElevenLabs `eleven_v4`, tudo em SVG animado no Remotion, legendas de 1 a 3 palavras com a palavra ativa em dourado, sem imagem gerada nem footage.

- Roteiro e pausas: `roteiro.json` (4 reels, cenas 1.1 a 4.5). Narração limpa: `narracao-zanathos-cap1.md`.
- Voz: `node scripts/zanathos-cap1-voz.mjs [parte]` gera uma chamada por cena (cache por hash em `public/rodzandonadi/episodes/zanathos-cap1/audio/cache`), monta `narracao-pN.mp3` com as pausas e escreve `words-pN.json` (tempo de cada palavra). Eco do reel 3: `eco-p3.mp3` (atraso 0,6 s, 3 semitons abaixo).
- Som: `node scripts/zanathos-cap1-som.mjs` sintetiza com ffmpeg (sem API): drone, batidas, cliques metálicos, tons, marimba, vento.
- Código: `marcas/rodzandonadi/src/zanathos/cap1/` (`base.jsx` fundo/figura/legendas/memes, `partes.jsx` cenas e cues por segundo, `Cap1.jsx` composição). Composições `ZanathosCap1P1` a `P4`.
- Render: `node scripts/zanathos-cap1-render.mjs <parte> [--scale=0.5]`; stills de conferência: `still:<parte>:<seg>,<seg>`. Saída em `out/rodzandonadi/zanathos-cap1/`.
- Memes (desenhados em código, 2 por reel): chefe "alguma dúvida?", "era comigo?", erro 404, na minha cabeça x no mundo, ouvir a própria voz, régua pediu demissão, sem Ctrl+Z, deixar um espacinho em branco.
- Pedidos do Rod para este cap.: abrir com "Fala Galera! Rod Zandonadi na área", um pouco mais de energia, humor leve, memes.
- Plantios do roteiro original preservados: eco atrasado (3.1), seis faltas coloridas (2.4), Desenho sem espaço em branco (4.2 a 4.4), ponto de luz central, mancha verde (4.5), frase "diferença entre um mundo e uma guerra".
