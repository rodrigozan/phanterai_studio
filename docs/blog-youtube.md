# Vídeo público → artigo do blog

`scripts/blog-youtube-cron.sh` roda a cada minuto no VPS. O detector lê o canal
`UCYHsuiYTaYCV_bfuyvW86Kw` diretamente no YouTube usando a conexão OAuth já
armazenada no Phantertools. Nenhum status de vídeo é alterado. Longos e Shorts
entram na mesma fila ao ficarem públicos.

O detector e o publicador têm locks separados: gerar um artigo não impede a
detecção do próximo vídeo. A fila SQLite persiste reinícios e só marca publicado
depois da leitura pública do artigo. Falhas ficam na fila com novas tentativas
de 1 minuto a 1 hora; os artigos gerados são reaproveitados.

O roteiro é associado primeiro pelo caminho real do arquivo enviado ao YouTube;
como alternativa, por título exato nos metadados locais. Sem associação inequívoca,
a tarefa fica pendente. A descrição do YouTube complementa o roteiro, mas não o
substitui. O Codex CLI gera JSON em modo de leitura. O publicador valida HTML,
link do vídeo e pelo menos 500 palavras visíveis, e confere novamente o status
público no YouTube imediatamente antes de enviar ao blog.

O slug `youtube-<videoId em minúsculas>` é fixo, e o banco do blog já exige slug
único. Uma resposta perdida do POST é recuperada lendo esse slug antes de tentar
novamente. Um artigo existente nunca é sobrescrito automaticamente. O link do
vídeo original é validado também na recuperação, impedindo associação incorreta.

## Configuração privada

Arquivo `/root/.config/phanterai-blog/config.json`, modo 0600:

```json
{
  "start_at": "2026-11-18T20:12:00Z",
  "blog_url": "https://phanterai.com",
  "blog_email": "<usuário autorizado do blog>",
  "blog_password": "<senha armazenada apenas neste arquivo>",
  "category_id": "<id de uma categoria existente>"
}
```

`start_at` evita publicar retroativamente todo o histórico na primeira execução.
Depois disso, uma transição observada de privado/não listado para público também
entra na fila, mesmo para vídeos antigos. `category_id` é opcional apenas se já
existir categoria com slug `inteligencia-artificial`, `ia` ou `ai`.

O adaptador depende dos módulos compilados e das dependências do Phantertools em
`/root/phantertools/phantertools_api` (`PHANTERTOOLS_ROOT` permite outro caminho).
Não copia tokens OAuth. A descoberta da playlist completa ocorre a cada hora;
a página dos 20 uploads mais recentes e o status desses vídeos e de todos os
privados/não listados conhecidos são lidos a cada minuto. Vídeos públicos mais
antigos são reconciliados na varredura horária. Até 50 IDs acompanhados usam
aproximadamente 2.900 unidades diárias da Data API, além das chamadas extras do
publicador e de outros consumidores. A conexão compartilhada tem cota finita.
A geração leva alguns minutos após a detecção; cron não oferece disparo instantâneo.

## Instalação e operação

Arquivo `/etc/cron.d/phanterai-blog`, root:root, modo 0644:

```cron
SHELL=/bin/bash
PATH=/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin
* * * * * root /bin/bash /root/phanterai_studio/scripts/blog-youtube-cron.sh
```

O cron recarrega esse arquivo automaticamente; não precisa reiniciar vídeos ou APIs.

```bash
python3 -I scripts/blog-youtube.py --scan
python3 -I scripts/blog-youtube.py --work
python3 -I scripts/blog-youtube.py --prepare CvBU1nv7W7w
python3 -m unittest discover -s scripts -p test_blog_youtube.py -v
```

Resultados privados em `out/phanterai/blog/`: `jobs.sqlite`, `scan-health.json`,
`videos.json`, `cron.log` e uma pasta por vídeo com artigo, prompt, validação e
log do Codex. Esses arquivos não vão para o Git.

## Estado da publicação em 18/11/2026

O teste confirmou o vídeo `CvBU1nv7W7w` público e encontrou
`public/phanterai/episodes/long-videos/2026-11-18-claude-code-gratis/roteiro.json`.
O artigo foi gerado e validado localmente.

A hospedagem de `phanterai.com` está configurada como Vite estático: o build
publica apenas `dist`, não inicia o servidor Express presente no código. Não há
variáveis de ambiente Node configuradas. `/blog` retorna o frontend, mas
`/api/posts` e `/api/categories` retornam HTTP 404. O publicador precisa que o
backend do blog esteja ativo e que os dados de acesso/categoria sejam configurados.
Enquanto isso, mantém a fila e o artigo sem alegar publicação concluída.
