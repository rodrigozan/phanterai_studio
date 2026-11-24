# Rod Zandonadi

Projeto do YouTube e do Instagram @rodzandonadi no PhanterAI Studio.

- Contas e caminhos: `marca.json`.
- Identidade visual recebida: [guia](IDENTIDADE-VISUAL.md) e PDF original em `assets/`.
- Calendário de publicação: `calendario/`.
- Episódios e mídia: `public/rodzandonadi/episodes/<slug>/`.
- Trilhas: `public/rodzandonadi/music/`.
- Renderizações e arquivos temporários: `out/rodzandonadi/` (fora do Git).

## Definições pendentes

- Confirmar o handle do YouTube (cadastrado como @rodzandonadi conforme o pedido), o nome público do canal e seu channelId.
- Definir tema, público, objetivos e frequência de publicação.
- Obter arquivos individuais do símbolo e do logotipo para produção.
- Definir voz, trilhas e formatos para cada plataforma.

## Vídeos

- `escrever-livro-com-ia` — "Como escrever um livro com IA" (~9 min, 16:9). Roteiro em `videos/escrever-livro-com-ia/ROTEIRO.md`, pendências em `PENDENCIAS.md` na mesma pasta, mídia em `public/rodzandonadi/episodes/escrever-livro-com-ia/{audio,capturas,clipes,texto}`.
- `personagens-com-ia` — "Dando rosto aos personagens com IA" (ep. 2, ~8 min, 16:9, composição `RodPersonagensIA`). Passo a passo em `videos/personagens-com-ia/PRODUCAO.md`.
- Tema por tokens (cores e fonte da identidade): `src/theme.js`. Prints do canal/Instagram vão em `referencias/` e prevalecem sobre o tema.

O projeto ainda não tem composições Remotion nem publicações agendadas.
Quando houver um formato definido, o código ficará em `marcas/rodzandonadi/src/`
e suas composições serão registradas em `src/Root.jsx`.

Scripts compartilhados que aceitam a variável de marca devem ser executados com
`MARCA=rodzandonadi`.
