#!/usr/bin/env bash
# yt-short-agendado.sh - Shorts do Aprenda YouTube: o MESMO vídeo vai para o YouTube e para o Instagram @aprendayoutube (regra do Rod, 25/11/2026). Regra de tema do Rod, 23/11/2026:
# todo conteúdo do canal é sobre crescer no YouTube e gerenciar canais (IA como aliada, mas abrangendo tudo de crescimento).
# Dois Shorts por dia, 10:00 e 17:00 de Brasília. Tema escolhido pelo Claude, sem calendário.
#   scripts/yt-short-agendado.sh 10:00 [--dry-run]     DATA=AAAA-MM-DD simula outro dia
set -euo pipefail
export HOME=/root
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
STUDIO=/root/phanterai_studio
MARCA="${MARCA:-phanterai}"
LOGDIR="$STUDIO/out/$MARCA/agendador-yt-shorts"
REELDIR="$STUDIO/out/$MARCA/agendador"
HORA="${1:?informe o horário, ex.: 10:00}"
DRY="${2:-}"
DATA="${DATA:-$(TZ=America/Sao_Paulo date +%F)}"
case "$HORA" in 10:00|17:00) ;; *) echo "$HORA fora da grade (só 10:00 e 17:00)"; exit 0;; esac
mkdir -p "$LOGDIR"
ID="$DATA-${HORA/:/}"; LOG="$LOGDIR/$ID.log"; FEITO="$LOGDIR/$ID.json"
PUBLISH_AT="$(date -u -d "$DATA $HORA -03:00" +%Y-%m-%dT%H:%M:%SZ)"
ok() { [ -e "$FEITO" ] && python3 -I -c 'import json,sys; sys.exit(0 if json.load(open(sys.argv[1])).get("status") in ("agendado","publicado") else 1)' "$FEITO" 2>/dev/null; }
log() { echo "[$(TZ=America/Sao_Paulo date '+%F %T')] $*" | tee -a "$LOG"; }

PROMPT="Rodada agendada de Short do canal Aprenda YouTube. Ninguém está acompanhando: não faça perguntas, decida e registre.

Use a skill make-reels-phanterai (formato vertical, voz do Rod, motion graphics, legendas curtas, gancho forte nos 5 primeiros segundos) para criar, renderizar e agendar UM Short.

Short de hoje
- Publicação: $DATA às $HORA de Brasília (UTC-3) = publishAt $PUBLISH_AT, private + publishAt, canal Aprenda YouTube
- Slug: yt-short-$ID-<tema-curto>

Regras desta rodada
1. DESTINO (regra do Rod, 25/11/2026): o MESMO vídeo, criado uma vez, vai para o YouTube (canal Aprenda YouTube) E para o Instagram @aprendayoutube, no mesmo horário. NUNCA publique em @phanteraicreative nem em outra conta do Instagram: o @phanteraicreative é só de conteúdo de IA, feito por outro agendador. Veja o passo 7b.
2. TEMA (regra do Rod, 23/11/2026): só CRESCER NO YOUTUBE e GERENCIAR CANAIS DO YOUTUBE (com IA como aliada, mas abrangendo tudo de crescimento no YouTube, não só IA: nicho, título e capa, roteiro, retenção, SEO, Shorts, algoritmo, métricas, rotina e automação do canal, monetização). Pesquise os melhores temas nos MELHORES e MAIS FAMOSOS canais do nicho, de preferência gringos (skills yt-*, ex.: yt-viral e yt-shorts, sem vidIQ). O que originou o tema é só pista: não copie roteiro, texto nem imagem. Confira em $STUDIO/out/$MARCA/agendador-yt-shorts/ e nos Shorts já publicados do canal que o tema não se repete.
IDENTIDADE (obrigatória, definida pelo Rod em 23/11/2026): leia $STUDIO/marcas/phanterai/identidade-aprenda-youtube.md ANTES de escolher o tema e escrever. Tom do Cobaia Honesto, PRA FRENTE e com energia, narração em frases curtas com exclamações e a moldura da conquista pequena, mais HUMOR LEVE com piadas e memes de heróis, animes, desenhos e Power Rangers só na fala, texto e panterinha, sem usar cena ou áudio protegido (veja as seções Tom e energia e Humor e memes do arquivo) (leve, bem-humorado, autoironia, sem pose de guru), título curto com contraste, quadro fixo (Garimpo da Semana ou Mito vs. Realidade; Teste na Prática só com os números reais de $STUDIO/marcas/phanterai/dados-canal-2026-11-22.md, nunca invente nem arredonde resultado). Isso vale acima das regras de duração e tom da skill: longo de 5 a 7 min, Short de 30 a 50 s. Sobre a regra do público leigo/Claude Desktop: aplique só quando o vídeo usar uma ferramenta.
3. Confira cada fato e número em fonte primária (documentação oficial do YouTube, Creator Insider, dados do próprio canal). Se não confirmar, NÃO gere narração, NÃO renderize e NÃO publique: grave o motivo e encerre.
4. Siga a Direção visual da skill: interface recriada em motion graphics, algo mudando a cada 0,5 a 1 s, legendas de 1 a 3 palavras, panterinha em 2 ou 3 reações, 40 a 60 s, sem print, sem imagem/vídeo de IA, sem crédito escrito no vídeo. Roteiro com lista numerada e CTA de comentário. Narração ElevenLabs uma única vez (eleven_v4, stability 0.5, sem style/speed). Música aleatória conforme a skill.
5. Se faltar menos de 10 minutos para $PUBLISH_AT (ou já tiver passado), agende para 15 minutos depois do momento atual.
6. Nunca refaça nem republique o que já foi publicado ou agendado; confira na API do canal antes.
7. Depois do upload, capa e descrição (padrão: tags/keywords, 'Você também pode gostar de:', 5 hashtags no fim), ANTES, escreva o artigo e grave em /root/phanterai_studio/out/phanterai/blog/VIDEO_ID/article.json (o script não gera mais artigo; schema em scripts/blog-article.schema.json, regras em docs/video-blog-handoff.md: no mínimo 500 palavras, HTML simples, passo a passo, link do vídeo e todos os links de fonte da descrição, sem inventar). Depois execute python3 -I /root/phanterai_studio/scripts/blog-youtube.py --schedule VIDEO_ID (ID real) e leia docs/video-blog-handoff.md; registre blog_url, blog_status e description_linked, ou blog_pendente com o motivo.
7b. INSTAGRAM @aprendayoutube (mesmo vídeo do YouTube, não renderize outro). Autentique na API do phantertools (http://127.0.0.1:3930/api) com Authorization: Bearer <conteúdo de /root/.config/phantertools/operator.key> e liste GET /instagram/accounts. Use SOMENTE a conta com username \"aprendayoutube\" e status \"connected\". Se ela não existir ou não estiver conectada, NÃO use nenhuma outra conta: pule o Instagram, grave instagram_status \"nao_publicado\" com o motivo (\"conta @aprendayoutube nao conectada\") e siga; o YouTube não depende disso. Se existir: POST /media (vídeo), espere conversionStatus pronto, POST /media (capa JPEG), POST /posts com type reel, status scheduled, scheduledAt = $PUBLISH_AT, a mesma legenda do YouTube com as 5 hashtags no fim, seoTitle, seoKeywords e coverMediaId (fluxo da skill make-reels-phanterai, passo Publicar). Antes de criar, confira em GET /posts que este slug ainda não foi agendado nessa conta (não repita). Se faltar menos de 5 minutos para o horário, agende 6 minutos depois do momento atual, e o YouTube no mesmo instante.
8. Grave $FEITO com: slug, titulo_final, fontes, horario_agendado, id e link do YouTube, instagram_status (\"agendado\", \"publicado\" ou \"nao_publicado\" com o motivo), instagram_post_id e \"status\" (\"agendado\", \"publicado\" ou \"nao_publicado\" com o motivo; o status geral depende só do YouTube), mesmo em caso de falha."

if [ "$DRY" = "--dry-run" ]; then echo "== $ID =="; echo "$PROMPT"; exit 0; fi
if ok; then log "short $ID já agendado/publicado; não refaço"; exit 0; fi
mkdir -p "$REELDIR"; exec 9>"$REELDIR/.lock"
if ! flock -w 18000 9; then log "outro render ainda rodando depois de 5h; desisti de $ID"; exit 1; fi
MAX=3; cd "$STUDIO"
for T in $(seq 1 $MAX); do
  log "iniciando $ID, tentativa $T/$MAX"
  P="$PROMPT"
  [ "$T" -gt 1 ] && P="$PROMPT

ATENÇÃO: tentativa $T de $MAX. A anterior falhou (ver $LOG e $FEITO.tentativa$((T-1))). Reaproveite o que existe, corrija a causa e termine. Se já estiver agendado no YouTube, não suba outro: só grave o resultado."
  set +e; timeout 40m /root/phanterai_studio/scripts/claude-roteado.sh claude "$P" >>"$LOG" 2>&1; RC=$?; set -e
  log "claude terminou com código $RC (tentativa $T)"
  [ -e "$FEITO" ] || printf '{"slug": "%s", "status": "nao_publicado", "motivo": "o Claude encerrou (codigo %s) sem gravar resultado; ver %s"}\n' "$ID" "$RC" "$LOG" >"$FEITO"
  if ok; then log "short $ID ok"; exit 0; fi
  [ "$T" -lt "$MAX" ] && mv -f "$FEITO" "$FEITO.tentativa$T"
done
log "short $ID NÃO foi agendado depois de $MAX tentativas"; exit 1
