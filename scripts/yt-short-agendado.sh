#!/usr/bin/env bash
# yt-short-agendado.sh - Shorts do canal Aprenda YouTube (SÓ YouTube). Regra do Rod, 23/11/2026:
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
1. DESTINO SÓ YOUTUBE (canal Aprenda YouTube). NÃO publique no Instagram: o IG @phanteraicreative é só de conteúdo de IA, feito por outro agendador.
2. TEMA (regra do Rod, 23/11/2026): só CRESCER NO YOUTUBE e GERENCIAR CANAIS DO YOUTUBE (com IA como aliada, mas abrangendo tudo de crescimento no YouTube, não só IA: nicho, título e capa, roteiro, retenção, SEO, Shorts, algoritmo, métricas, rotina e automação do canal, monetização). Pesquise os melhores temas nos MELHORES e MAIS FAMOSOS canais do nicho, de preferência gringos (skills yt-*, ex.: yt-viral e yt-shorts, sem vidIQ). O que originou o tema é só pista: não copie roteiro, texto nem imagem. Confira em $STUDIO/out/$MARCA/agendador-yt-shorts/ e nos Shorts já publicados do canal que o tema não se repete.
3. Confira cada fato e número em fonte primária (documentação oficial do YouTube, Creator Insider, dados do próprio canal). Se não confirmar, NÃO gere narração, NÃO renderize e NÃO publique: grave o motivo e encerre.
4. Siga a Direção visual da skill: interface recriada em motion graphics, algo mudando a cada 0,5 a 1 s, legendas de 1 a 3 palavras, panterinha em 2 ou 3 reações, 40 a 60 s, sem print, sem imagem/vídeo de IA, sem crédito escrito no vídeo. Roteiro com lista numerada e CTA de comentário. Narração ElevenLabs uma única vez (eleven_v4, stability 0.5, sem style/speed). Música aleatória conforme a skill.
5. Se faltar menos de 10 minutos para $PUBLISH_AT (ou já tiver passado), agende para 15 minutos depois do momento atual.
6. Nunca refaça nem republique o que já foi publicado ou agendado; confira na API do canal antes.
7. Depois do upload, capa e descrição (padrão: tags/keywords, 'Você também pode gostar de:', 5 hashtags no fim), execute python3 -I /root/phanterai_studio/scripts/blog-youtube.py --schedule VIDEO_ID (ID real) e leia docs/video-blog-handoff.md; registre blog_url, blog_status e description_linked, ou blog_pendente com o motivo.
8. Grave $FEITO com: slug, titulo_final, fontes, horario_agendado, id e link do YouTube e \"status\" (\"agendado\", \"publicado\" ou \"nao_publicado\" com o motivo), mesmo em caso de falha."

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
  set +e; IS_SANDBOX=1 timeout 40m claude -p "$P" --permission-mode bypassPermissions >>"$LOG" 2>&1; RC=$?; set -e
  log "claude terminou com código $RC (tentativa $T)"
  [ -e "$FEITO" ] || printf '{"slug": "%s", "status": "nao_publicado", "motivo": "o Claude encerrou (codigo %s) sem gravar resultado; ver %s"}\n' "$ID" "$RC" "$LOG" >"$FEITO"
  if ok; then log "short $ID ok"; exit 0; fi
  [ "$T" -lt "$MAX" ] && mv -f "$FEITO" "$FEITO.tentativa$T"
done
log "short $ID NÃO foi agendado depois de $MAX tentativas"; exit 1
