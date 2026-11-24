# Zanathos Ep. 2: O Chamado de TED Tage (vídeo único, 72,6 s)

Refeito em 24/11 depois que a versão em 4 reels do `zanathos-cap1` foi reprovada pelo Rod (tela escura e vazia, ritmo lento, sem ligação com o Ep. 1). Esta versão usa a linguagem do Ep. 1: abre no mapa com os olhos no Fundo, conversa com o Claude, mapa em pergaminho, cartões e câmera sempre andando. Sem saudação; o gancho é o título "O mapa perfeito que causou a guerra".

- Narração: `narracao.md` (187 palavras). `node scripts/zanathos-ep2-voz.mjs` faz uma chamada ElevenLabs eleven_v4 na voz do Rod, +5% de velocidade, e escreve `words.json` (a chamada fica em cache em `raw.json`, não regera).
- Código: `marcas/rodzandonadi/src/zanathos/Ep2.jsx` (cenas ancoradas nas palavras por `W("palavra", n)`), reaproveita `Mapa.jsx`, `Zanathos.jsx` e `cap1/base.jsx`. Composição `ZanathosEp2`. Trilha do Ep. 1 e sons sintetizados do cap1.
- Render: `node scripts/zanathos-ep2-render.mjs 1 [--scale=0.5]`; stills: `still:3,8,15`. Saída em `out/rodzandonadi/zanathos-ep2/`.
- Memes: era comigo?, erro 404, ouvir a própria voz gravada.
- `zanathos-cap1` (4 reels) fica só como arquivo; não publicar.
