# Anime Power Bíblia

Reels de cerca de 60 s com histórias bíblicas em estilo anime, sem narrador. Contas em `marca.json`.

O que já está aqui:

- `public/anime-power-biblia/episodes/`: metadados dos episódios antigos (inclusive `daniel-loes`).
- `public/anime-power-biblia/music/`: trilhas da marca (`Daniel.mp3`).
- `out/anime-power-biblia/`: rodadas antigas do phanterclaw em `rotina/`, `chaves/` e `gpu/`, e o
  vídeo-modelo de formato `daniel-loes.mp4`.

## Kit de scripts (`scripts/`)

- `gen-scenes.mjs cenas.json --out <rodada> [--only 3,7] [--dry-run]`: gera `ficha-<nome>.png` e `cena-NN.png`
  pelo OpenRouter, com a ficha de cada personagem como referência. Cada imagem é paga; `--dry-run` só mostra o plano.
- `gen-image.mjs --prompt "..." --out x.png [--ref ficha.png]`: uma imagem. Modelo em `marca.json` (`imagem.modelo`).
- `render.mjs storyboard.json`: monta o vídeo 1080x1920 só com ffmpeg (câmera, efeitos, transições, cartela, trilha).

Estilo e fichas: `PROMPTS.md`. Rodadas em `out/anime-power-biblia/rotina/<AAAA-MM-DD-HHMM>/`.

Ainda falta trazer do phanterclaw: o script de agendamento (Instagram e YouTube) e a skill com o passo a passo
(pesquisa, roteiro, SEO, validação). Até lá, esses passos seguem em `agents/workflows/anime-power-biblia/` do phanterclaw.
