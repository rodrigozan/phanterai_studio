#!/usr/bin/env bash
# reel-agendado.sh - disparado pelo cron 45 min antes de cada horário de publicação.
# Lê marcas/<marca>/calendario/reels.json (MARCA, padrão phanterai), acha o reel de hoje (Brasília) no horário pedido e aciona o
# Claude Code para rodar a skill make-reels-phanterai.
#
#   scripts/reel-agendado.sh 12:00            roda o reel de hoje das 12:00
#   scripts/reel-agendado.sh 12:00 --dry-run  só mostra o que rodaria (não chama o Claude)
#   DATA=2026-11-18 scripts/reel-agendado.sh 07:00 --dry-run
set -euo pipefail

export HOME=/root
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
STUDIO=/root/phanterai_studio
MARCA="${MARCA:-phanterai}"
CAL="$STUDIO/marcas/$MARCA/calendario/reels.json"
LOGDIR="$STUDIO/out/$MARCA/agendador"
HORA="${1:?informe o horário, ex.: 12:00}"
DRY="${2:-}"
DATA="${DATA:-$(TZ=America/Sao_Paulo date +%F)}"

mkdir -p "$LOGDIR"
ID="$DATA-${HORA/:/}"
LOG="$LOGDIR/$ID.log"

# Regra desde 23/11/2026: só dois reels/shorts por dia, todos os dias, às 07:00 e às 12:00 (Brasília).
# Exceção pontual pedida pelo Rod (ex.: 23/11 às 15:00 e 20:00): rodar à mão com FORA_DA_GRADE=1.
case "$HORA" in
  07:00|12:00) ;;
  *) [ "${FORA_DA_GRADE:-}" = 1 ] || { echo "[$(TZ=America/Sao_Paulo date '+%F %T')] $HORA fora da grade (só 07:00 e 12:00); nada a fazer" | tee -a "$LOG"; exit 0; } ;;
esac
FEITO="$LOGDIR/$ID.json"
ok() { [ -e "$FEITO" ] && python3 -I -c 'import json,sys; sys.exit(0 if json.load(open(sys.argv[1])).get("status") in ("agendado","publicado") else 1)' "$FEITO" 2>/dev/null; }
log() { echo "[$(TZ=America/Sao_Paulo date '+%F %T')] $*" | tee -a "$LOG"; }

ITEM="$(python3 -I - "$CAL" "$DATA" "$HORA" <<'PY'
import json, sys
cal = json.load(open(sys.argv[1]))
for r in cal["reels"]:
    if r["data"] == sys.argv[2] and r["hora"] == sys.argv[3]:
        print(json.dumps(r, ensure_ascii=False)); break
PY
)"

if [ -z "$ITEM" ]; then log "sem reel no calendário para $DATA $HORA; nada a fazer"; exit 0; fi
STATUS="$(python3 -I -c 'import json,sys; print(json.loads(sys.argv[1])["status"])' "$ITEM")"
if [ "$STATUS" != "pendente" ]; then log "reel $ID com status '$STATUS'; pulando"; exit 0; fi
if ok; then log "reel $ID já agendado/publicado ($FEITO); não refaço"; exit 0; fi

PROMPT="$(python3 -I - "$ITEM" "$FEITO" <<'PY'
import json, sys
r = json.loads(sys.argv[1]); feito = sys.argv[2]
print(f"""Rodada agendada do calendário de reels da PhanterAI. Ninguém está acompanhando: não faça perguntas, decida e registre.

Use a skill make-reels-phanterai e siga o fluxo dela do começo ao fim para criar, renderizar e agendar UM reel.

Reel de hoje
- Data e horário de publicação: {r['data']} às {r['hora']} (Brasília, UTC-3)
- Slug do episódio: {r['slug']}
- Título de trabalho: {r['titulo']}
- Promessa: {r['promessa']}
- Sinal que originou o tema: {r['sinal']} ({r['referencia']})

Regras desta rodada
1. Só tema de IA. O sinal acima é só a pista do tema: não é fonte e não é para copiar roteiro, texto nem imagem de lá.
2. Ache a fonte primária (anúncio oficial, repositório, documentação) e confira cada fato e cada número antes de narrar. Se o número do título não bater com a fonte, ajuste o título para o que a fonte diz.
3. Se não der para confirmar o tema em fonte primária, NÃO gere narração, NÃO renderize e NÃO publique: grave o motivo no arquivo de resultado e encerre.
4. Visual: siga a seção "Direção visual" da skill (atualizada em 18/11 com os reels de referência). O visual principal é a interface recriada em motion graphics no Remotion (contadores, cards, terminal, chat, checklist, barras de progresso, grade de ícones), com algo mudando a cada 0,5 a 1 segundo no tempo das palavras-chave da fala; nada parado por mais de 1 segundo. Legendas de 1 a 3 palavras. Panterinha só em 2 ou 3 reações, sem ficar subindo e descendo. GANCHO FORTE nos 5 primeiros segundos, conforme a seção "Gancho dos 5 primeiros segundos" da skill (primeira frase de até 8 palavras que abre com tensão, nunca com o tema; promessa específica com loop aberto até 5 s; quadro 0 já com ação e palavra gigante; som de impacto; teste dos 5 segundos a 4 quadros por segundo antes de agendar). Roteiro com lista numerada, lista numerada com mini-demo por item e CTA de comentário. NÃO gere imagem nem vídeo por IA. Nada de print de site, README ou documentação na tela. Nada de "fonte" ou crédito escrito no vídeo: as fontes vão só no texto do post, depois das 5 hashtags. Confira o contact sheet a 2 quadros por segundo e corrija antes de agendar.
4b. Reel de um tema só, de 40 a 60 segundos (exceção: o "Resumo da semana" segue a duração da skill). Narração no ElevenLabs gerada uma única vez, depois de revisar o texto, com o script reference/tts-elevenlabs.cjs da skill (modelo eleven_v4, stability 0.5, sem style e sem speed). Não use eleven_multilingual_v2.
5. DESTINO: Instagram @phanteraicreative E YouTube PhanterAI Creative (regra do Rod, 24/11/2026; substitui a de 23/11 que era só Instagram). Todo reel publicado no IG também sai no canal de YouTube PhanterAI Creative, o que está conectado ao phantertools. Agende no Instagram para {r['data']} {r['hora']} de Brasília. Se na hora de agendar faltar menos de 5 minutos para esse horário (ou ele já tiver passado), agende para 6 minutos depois do momento atual. Depois de agendar o IG, suba o MESMO vídeo no YouTube: use o canal "PhanterAI Creative", channelId UCOpUYDXKoiQcfypbFD0CNjw (NÃO o Aprenda YouTube, que é só de crescer no YouTube). Autentique na API do phantertools (http://127.0.0.1:3930/api) com Authorization: Bearer <conteúdo de /root/.config/phantertools/operator.key> (mesmo que scripts/youtube-fila.py; o token de agente do PhanterClaw NÃO libera esse canal); POST /youtube/upload com status private + publishAt no MESMO instante do Instagram (em UTC), título curto e descrição com as 5 hashtags e as fontes, e tente a capa (python3 -I /root/phanterai_studio/scripts/youtube-fila.py usa tools/yt-upload.mjs thumb; se o YouTube responder 403 thumbnail_refused, o canal não tem miniatura personalizada: siga sem capa e registre). Ele é vertical e tem menos de 3 min, então vira Short. Se o upload falhar, NÃO suba em outro canal: grave youtube_status "nao_publicado" com o motivo.
5b. SEM ARTIGO NO BLOG (regra do Rod, 28/11/2026: só vídeo longo vira artigo; reel/Short fica sem artigo por enquanto). NÃO escreva article.json, NÃO rode blog-youtube.py --schedule e NÃO coloque link de artigo na descrição. Registre blog_status "dispensado" no resultado.
5c. TIKTOK (regra do Rod, 24/11/2026): SÓ no reel das 12:00 de TERÇA e QUINTA (a data de hoje é {r['data']}; confira o dia da semana em Brasília), depois de agendar o Instagram, agende o MESMO reel no TikTok da PhanterAI Creative às 18:00 de Brasília (publishAt 21:00Z desse dia) pelo Buffer: python3 -I /root/phanterai_studio/scripts/tiktok-buffer.py --slug {r['slug']} --video <mp4 final do reel> --ig-post-id <post_id do Instagram> --title "<título final>" --at <AAAA-MM-DD>T21:00:00Z --cover-ms <ms> . CAPA: o TikTok NÃO aceita imagem de capa, só um quadro do próprio vídeo; escolha em --cover-ms o instante (em ms) do quadro mais forte, com o título/promessa legível e a palavra-chave em destaque (veja o contact sheet; evite o quadro 0), e registre cover_ms. O script usa a BUFFER_API_KEY do .env do studio e o operador do phantertools, e é idempotente (recibo em out/phanterai/tiktok/). Se faltar menos de 10 minutos para as 18:00 ou já tiver passado, pule o TikTok e registre. Nos outros reels e dias NÃO publique no TikTok. Registre tiktok_status ("agendado", "pulado" com o motivo ou "nao_publicado" com o erro) e buffer_post_id.
6. Nunca refaça nem republique o que já foi publicado ou agendado. Antes de agendar, confira nas APIs se este slug já existe.
7. Ao terminar, grave {feito} com: slug, titulo_final, fontes (urls), horario_agendado, ids e link do Instagram, youtube_video_id, youtube_link, youtube_publishAt, youtube_status ("agendado", "publicado" ou "nao_publicado" com o motivo), faixa de música usada, e "status" ("agendado", "publicado" ou "nao_publicado" com o motivo). Grave esse arquivo mesmo em caso de falha.
""")
PY
)"

if [ "$DRY" = "--dry-run" ]; then
  echo "== $ID =="; echo "$PROMPT"; exit 0
fi

# Um reel por vez: se o anterior ainda estiver renderizando, espera até 5h.
exec 9>"$LOGDIR/.lock"
if ! flock -w 18000 9; then log "outro reel ainda está rodando depois de 5h; desisti de $ID"; exit 1; fi

MAX=3   # tentativas seguidas, de até 40 min cada
cd "$STUDIO"
RC=1
for T in $(seq 1 $MAX); do
  log "iniciando $ID, tentativa $T/$MAX"
  P="$PROMPT"
  if [ "$T" -gt 1 ]; then P="$PROMPT

ATENÇÃO: esta é a tentativa $T de $MAX. A anterior falhou (ver $LOG e $FEITO.tentativa$((T-1))). Reaproveite o que já existe na pasta do reel, corrija a causa da falha e termine. Se este reel já estiver agendado no Instagram ou no YouTube PhanterAI Creative, não suba outro (e se só um dos dois existir, suba apenas o que falta): só grave o resultado. Se o tema não se confirmar em fonte primária, escolha outro tema de IA do calendário para este horário."; fi
  set +e
  timeout 40m /root/phanterai_studio/scripts/claude-roteado.sh claude-dev "$P" >>"$LOG" 2>&1
  RC=$?
  set -e
  log "claude terminou com código $RC (tentativa $T)"
  if [ ! -e "$FEITO" ]; then
    printf '{"slug": "%s", "status": "nao_publicado", "motivo": "o Claude encerrou (codigo %s) sem gravar resultado; ver %s"}\n' "$ID" "$RC" "$LOG" >"$FEITO"
  fi
  if ok; then log "reel $ID ok"; exit 0; fi
  [ "$T" -lt "$MAX" ] && mv -f "$FEITO" "$FEITO.tentativa$T"
done
log "reel $ID NÃO foi agendado depois de $MAX tentativas"
exit 1
