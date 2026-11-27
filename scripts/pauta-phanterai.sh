#!/usr/bin/env bash
# pauta-phanterai.sh - Pauta diária do PhanterAI Creative (@phanteraicreative, só IA). Só pesquisa: grava no vault Obsidian.
# Conta do outro Claude (CLAUDE_CONFIG_DIR=/root/.claude-dev), como reel-agendado.sh e video-longo-phanteraicreative.sh.
# Roda todo dia às 07:11 BRT (10:11 UTC) e gera a pauta do DIA SEGUINTE.
#   scripts/pauta-phanterai.sh [--dry-run]     DATA_USO=AAAA-MM-DD simula outro dia
set -euo pipefail
export HOME=/root
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
export CLAUDE_CONFIG_DIR=/root/.claude-dev
VAULT=/root/obsidian/brainiac/pauta/phanterai
LOGDIR=/root/phanterai_studio/out/phanterai/agendador-pauta
DATA_USO="${DATA_USO:-$(TZ=America/Sao_Paulo date -d tomorrow +%F)}"
SAIDA="$VAULT/$DATA_USO.md"
LOG="$LOGDIR/phanterai-$DATA_USO.log"
mkdir -p "$LOGDIR" "$VAULT"
log() { echo "[$(TZ=America/Sao_Paulo date '+%F %T')] $*" | tee -a "$LOG"; }
pronta() { [ -s "$SAIDA" ] && [ "$(wc -c <"$SAIDA")" -gt 3000 ]; }

PROMPT="Você está gerando a PAUTA DIÁRIA do PhanterAI Creative (@phanteraicreative) do Rod, dono da Phanter AI. Português, direto, chamando-o de Rod. Rodada agendada: ninguém está acompanhando, não faça perguntas, decida e registre. A pauta serve para a produção de $DATA_USO (AMANHÃ). Só pesquisa: não crie roteiro, imagem, áudio, vídeo, nem publique. Não use a ferramenta/MCP do vidIQ. Não chame APIs pagas.

Regra de nicho: o Instagram do PhanterAI é só IA. Viral fora do nicho (golpe, consumidor, celebridade) não entra.

1. DEDUP
Leia as pautas dos últimos 7 dias em $VAULT/ e o índice \"Já usados\" do CLAUDE.md dessa pasta (30 dias para skills, MCPs e repositórios). Não repita nada.

2. O QUE ESTÁ FUNCIONANDO (skill yt-viral, obrigatória, antes de qualquer outra busca)
- Leia a lista de canais em $VAULT/canais.json (o Rod pode editar). Se não existir, crie com 10 a 15 canais gringos e grandes de IA aplicada, agentes, ferramentas de código, automação e skills (ex.: Fireship, Matt Wolfe, Matthew Berman, AI Explained, Greg Isenberg, Riley Brown, WorldofAI, Nate Herk) e confira o channel_id de cada um na web antes de gravar.
- Para cada canal, colete os vídeos recentes pelo feed https://www.youtube.com/feeds/videos.xml?channel_id=ID (título, views em media:statistics, URL, data). Mínimo de 4 vídeos por canal. yt-dlp NÃO está instalado; não tente instalar. Só listagens públicas.
- Monte collected.json no formato da skill e rode python3 /root/.claude-dev/skills/yt-viral/swipe.py collected.json --min 2.0.
- Do resultado, traga os 5 melhores por múltiplo sobre a mediana do próprio canal, a fórmula de cada título, a estrutura que têm em comum, e qual dá para o PhanterAI fazer esta semana. Diga que a fórmula é leitura do TÍTULO, não prova do motivo do sucesso.
- Estes vencedores indicam tema e formato. Não copie roteiro, texto nem imagem; só o padrão. Se o tema do vencedor for fora de IA, descarte.

3. NOTÍCIAS E FONTES (WebSearch, WebFetch só nos finalistas; janela 24-48h; verifique na web todo número, data, nome e versão; nunca use conhecimento próprio para fatos)
- Mercado de IA: modelos (Anthropic/Claude, OpenAI, Google/Gemini, Meta, xAI, DeepSeek, Qwen, Kimi, Alibaba, Mistral etc.), preços, benchmarks, investimentos, aquisições, regulação (inclusive Brasil)
- Agentes de IA: frameworks, protocolos (MCP etc.), novos agentes, casos de uso, automação de workflows
- Ferramentas de código: Claude Code, Codex, Gemini CLI, OpenCode, Cursor e similares
- Providers e infraestrutura: OpenRouter, Vercel AI Gateway, Hugging Face, Supabase, Vercel
- Repositórios em alta no GitHub (IA, agentes, automação, Node.js, React, Next.js) e que substituem gratuitamente software, plataforma ou serviço pago
- Geração de vídeo, imagem, voz e música com IA (ElevenLabs, Veo, Higgsfield, Suno etc.) e automação de canais de conteúdo
- Oportunidades para agências e clientes: atendimento, WhatsApp/Instagram, chatbots, marketing e anúncios com IA
- Se a busca não achar fonte oficial para um fato, marque ⚠️ e diga o que falta confirmar.

4. SKILLS (pauta principal, é o que mais engaja)
5 de geração de conteúdo (incluindo o fluxo de geração), 5 de gerenciamento de negócios, 5 de ADS (Google, Meta e TikTok) e 5 que substituem gratuitamente software, plataforma ou serviço pago. Sem repetir nos últimos 30 dias. Cada skill vira um item de pauta (o que faz, para quem serve, o que mostrar).

5. ENTREGA
a) 12 a 16 itens de pauta, pelo menos 3 vindos do yt-viral. Cada item: titulo, fato_central (verificado), fonte_url, formato (reel, post_unico, carrossel, short, video_longo; vídeo curto é o mesmo arquivo no Instagram e no YouTube), gancho, o_que_mostrar (URLs de repositório, plataforma ou site para print via Playwright), score 1-5.
b) Itens fracos entram com score baixo e podem virar post único ou carrossel. Não descarte.
c) Uma ação sugerida para o Rod testar ou aplicar.
d) Fontes: [Título](URL) de tudo citado.
Se não houver novidade em um tema, não invente. Não cite o nome \"ACTI\".

Salve em $SAIDA. Salve collected.json e a saída do swipe.py na mesma pasta como $DATA_USO-yt-viral.json. Atualize o índice \"Já usados\" do CLAUDE.md da pasta com as skills e repositórios novos. No chat, responda só com o caminho e os 3 melhores itens."

if [ "${1:-}" = "--dry-run" ]; then echo "== $DATA_USO -> $SAIDA =="; echo "$PROMPT"; exit 0; fi
if pronta; then log "pauta de $DATA_USO já existe ($SAIDA); não refaço"; exit 0; fi
MAX=2
for T in $(seq 1 $MAX); do
  log "iniciando pauta $DATA_USO, tentativa $T/$MAX"
  P="$PROMPT"; [ "$T" -gt 1 ] && P="$PROMPT

ATENÇÃO: tentativa $T de $MAX. A anterior não gravou a pauta (ver $LOG). Reaproveite o que já foi coletado e termine."
  set +e; cd /root/phanterai_studio; timeout 40m /root/phanterai_studio/scripts/claude-roteado.sh claude-dev "$P" antigravity >>"$LOG" 2>&1; RC=$?; set -e
  log "claude terminou com código $RC (tentativa $T)"
  if pronta; then log "pauta $DATA_USO ok ($(wc -c <"$SAIDA") bytes)"; exit 0; fi
done
log "pauta $DATA_USO NÃO foi gravada depois de $MAX tentativas"; exit 1
