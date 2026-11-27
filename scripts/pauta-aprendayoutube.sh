#!/usr/bin/env bash
# pauta-aprendayoutube.sh - Pauta diária do Aprenda YouTube (@aprendayoutube). Só pesquisa: grava no vault Obsidian.
# Roda todo dia às 07:01 BRT (10:01 UTC) e gera a pauta do DIA SEGUINTE (a que as rodadas de Short/longo vão usar).
#   scripts/pauta-aprendayoutube.sh [--dry-run]     DATA_USO=AAAA-MM-DD simula outro dia
set -euo pipefail
export HOME=/root
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
VAULT=/root/obsidian/brainiac/pauta/aprendayoutube
LOGDIR=/root/phanterai_studio/out/aprendayoutube/agendador-pauta
DATA_USO="${DATA_USO:-$(TZ=America/Sao_Paulo date -d tomorrow +%F)}"
SAIDA="$VAULT/$DATA_USO.md"
LOG="$LOGDIR/aprendayoutube-$DATA_USO.log"
mkdir -p "$LOGDIR" "$VAULT"
log() { echo "[$(TZ=America/Sao_Paulo date '+%F %T')] $*" | tee -a "$LOG"; }
pronta() { [ -s "$SAIDA" ] && [ "$(wc -c <"$SAIDA")" -gt 3000 ]; }

PROMPT="Você está gerando a PAUTA DIÁRIA do canal Aprenda YouTube (@aprendayoutube, YouTube e Instagram) do Rod, da Phanter AI. Português, direto. Rodada agendada: ninguém está acompanhando, não faça perguntas, decida e registre. A pauta serve para a produção de $DATA_USO (AMANHÃ). Só pesquisa: não crie roteiro, imagem, áudio, vídeo, nem publique. Não use a ferramenta/MCP do vidIQ (só leia conteúdo público dele como fonte). Não chame APIs pagas.

1. DEDUP
Leia as pautas dos últimos 7 dias em $VAULT/ (30 dias para skills, MCPs e repositórios). Não repita nada.

2. O QUE ESTÁ FUNCIONANDO (skill yt-viral, obrigatória, antes de qualquer outra busca)
- Leia a lista de canais em $VAULT/canais.json (o Rod pode editar). Se não existir, crie com 10 a 15 canais do nicho de crescer, monetizar e gerenciar canais, de preferência gringos e grandes (ex.: Think Media, Matt Par, Paddy Galloway, vidIQ, Creator Insider, YouTube Creators) e confira o channel_id de cada um na web antes de gravar.
- Para cada canal, colete os vídeos recentes pelo feed https://www.youtube.com/feeds/videos.xml?channel_id=ID (título, views em media:statistics, URL, data). Mínimo de 4 vídeos por canal. yt-dlp NÃO está instalado; não tente instalar. Só listagens públicas.
- Monte collected.json no formato da skill e rode python3 /root/.claude/skills/yt-viral/swipe.py collected.json --min 2.0.
- Do resultado, traga os 5 melhores por múltiplo sobre a mediana do próprio canal, a fórmula de cada título, a estrutura que eles têm em comum, e qual dá para o Rod fazer esta semana. Diga que a fórmula é leitura do TÍTULO, não prova do motivo do sucesso.
- Estes vencedores são a base da pauta: o formato e o tema vêm do que superou o próprio canal. Não copie roteiro, texto nem imagem; só o padrão.

3. NOTÍCIAS E FONTES (WebSearch, WebFetch só nos finalistas; janela 24-48h; verifique na web todo número, data, nome e versão)
- Núcleo (maior peso): crescer (algoritmo, retenção, CTR, títulos e thumbnails, Shorts, SEO), monetizar (YPP, RPM, políticas, afiliados, produtos digitais) e gerenciar canal (Studio, analytics, testes A/B, rotina, calendário).
- Fontes: Help Center e blog oficial do YouTube, canal YouTube Creators, Creator Insider, blogs e vídeos recentes dos influencers gringos.
- Camada de IA: voz, vídeo, imagem, música, legendas, thumbnails e roteiro; skills, MCPs e repositórios do GitHub para YouTube; substitutos gratuitos de ferramentas pagas; canais dark (sem aparecer), com riscos de monetização.
- Se a busca não achar fonte oficial para um fato, marque ⚠️ e diga o que falta confirmar.

4. ENTREGA
a) 10 a 14 itens de pauta, pelo menos 6 do núcleo e pelo menos 3 vindos do yt-viral. Cada item: titulo, fato_central (verificado), fonte_url, formato (reel, post_unico, carrossel, short, video_longo), plataforma (youtube, instagram ou ambas; vídeo curto é sempre ambas, o mesmo arquivo), gancho, o_que_mostrar (URLs para print via Playwright), score 1-5.
b) 5 skills/MCPs de geração de conteúdo para YouTube, 5 de gestão de canal e 5 substitutos gratuitos de ferramentas pagas. Sem repetir nos últimos 30 dias.
c) 1 ideia de canal dark (nicho, formato, produção com IA, risco).
d) Fontes: [Título](URL) de tudo citado.
Itens fracos entram com score baixo. Não invente se não houver novidade.

Salve em $SAIDA. Salve collected.json e a saída do swipe.py na mesma pasta como $DATA_USO-yt-viral.json. No chat, responda só com o caminho e os 3 melhores itens."

if [ "${1:-}" = "--dry-run" ]; then echo "== $DATA_USO -> $SAIDA =="; echo "$PROMPT"; exit 0; fi
if pronta; then log "pauta de $DATA_USO já existe ($SAIDA); não refaço"; exit 0; fi
MAX=2
for T in $(seq 1 $MAX); do
  log "iniciando pauta $DATA_USO, tentativa $T/$MAX"
  P="$PROMPT"; [ "$T" -gt 1 ] && P="$PROMPT

ATENÇÃO: tentativa $T de $MAX. A anterior não gravou a pauta (ver $LOG). Reaproveite o que já foi coletado e termine."
  set +e; cd /root/phanterai_studio; timeout 40m /root/phanterai_studio/scripts/claude-roteado.sh claude "$P" antigravity >>"$LOG" 2>&1; RC=$?; set -e
  log "claude terminou com código $RC (tentativa $T)"
  if pronta; then log "pauta $DATA_USO ok ($(wc -c <"$SAIDA") bytes)"; exit 0; fi
done
log "pauta $DATA_USO NÃO foi gravada depois de $MAX tentativas"; exit 1
