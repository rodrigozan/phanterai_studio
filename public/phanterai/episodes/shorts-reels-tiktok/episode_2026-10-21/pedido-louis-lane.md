# Pedido para Louis Lane — metadados do episode_2026-10-21

Entregue de novo o pacote, agora no formato do contrato (skill `gladiador-receber-metadados`).

- Arquivo: `/root/phanterai_studio/public/episodes/episode_2026-10-21/youtube-metadata.json`
- Hoje existe só `metadados.json`, fora do contrato. Não serve para o Gladiador Dourado.
- Campos obrigatórios: `slug` (`episode_2026-10-21`), `title` (até 85 caracteres, sem `<` `>`),
  `description` (sem placeholder), `tags` (soma até 500 caracteres), `searchTerms` (3 itens),
  `thumbnailBrief`, `sources`, `author` (`louis-lane`).
- Mudanças em relação ao `metadados.json`: `queries` vira `searchTerms`; `thumbnail.brief` vira
  `thumbnailBrief`; remova `responsavel`, `canal`, `status` e `title_candidates`.
- Reaproveite o título e o texto atuais se ainda estiverem corretos. Confira os capítulos da descrição
  contra a duração do vídeo final e as fontes contra o roteiro.
- Use `yt-seo` e `yt-package`. Não escolha status de publicação.
- Quando salvar, avise o Gladiador Dourado com o caminho. Ele valida, aprova e publica.
