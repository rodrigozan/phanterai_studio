# public/phanterai/episodes/

Duas pastas, por formato:

- `long-videos/<slug>/` — vídeos longos do Aprenda YouTube (16:9, 4 a 9 minutos).
- `shorts-reels-tiktok/<slug>/` — Shorts, Reels e TikTok (9:16).

## Vídeo longo: o que tem em `long-videos/<slug>/`

| Arquivo | O que é | Quem gera |
|---|---|---|
| `roteiro.json` | cenas: `id`, `tipo` (componente), `fala` (texto narrado), `dados` (visual) | a gente escreve |
| `voz/Cxx.mp3` + `Cxx.json` | narração de cada cena e o tempo de cada palavra | `scripts/long-voz.js` |
| `voz.mp3` | narração inteira, cenas coladas com respiro | `scripts/long-voz.js` |
| `pexels/` | vídeos e fotos do Pexels, com `pexels-manifest.json` (autor e link) | `scripts/fetch-pexels-video.js` |
| `prints/` | prints reais dos sites mostrados no vídeo | Playwright |
| `timeline.json` | frames de cada cena, palavras da legenda, música sorteada | `scripts/long-timeline.js` |

Padrões fixos do vídeo longo:

- Voz do Rod no ElevenLabs: `ELEVENLABS_ROD_VOICE_ID` do `.env`, modelo `eleven_v4`, stability 0.5.
- Música sorteada entre as de `public/phanterai/music/`, em loop até o fim, a 20% do volume original.
- Efeitos de `public/sfx/` (e `variants/`) nas entradas de cartões, cliques e avisos.
- Pexels em tela cheia em pelo menos 30% do vídeo; panterinha em cerca de 30 a 40%.
- Terminal sempre com o comando sendo digitado; download com site e barra de progresso;
  instalação com o instalador do Windows, arrastar para Aplicativos no Mac, terminal no Linux.

## Passo a passo

```bash
node scripts/long-voz.js <slug>                       # narração (só gera as cenas cujo texto mudou)
node scripts/fetch-pexels-video.js <slug> nome="busca" # b-roll
node scripts/long-timeline.js <slug>                  # timeline (use --nova-musica para sortear outra)
node scripts/long-stills.mjs <slug> <pasta> [C01 ...] # quadros de conferência
node scripts/long-render.mjs <slug> --scale=0.5       # rascunho; sem --scale sai em 1080p
```

Componentes: `marcas/phanterai/src/long/` (`LongVideo.jsx`, `base.jsx`, `cenas-a.jsx`, `cenas-b.jsx`).
Tipo de cena novo: crie o componente e registre em `cenas.jsx`.
