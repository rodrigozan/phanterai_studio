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
5. Agende no Instagram @phanteraicreative e no YouTube para {r['data']} {r['hora']} de Brasília. Se na hora de agendar faltar menos de 5 minutos para esse horário (ou ele já tiver passado), agende para 6 minutos depois do momento atual.
6. Nunca refaça nem republique o que já foi publicado ou agendado. Antes de agendar, confira nas APIs se este slug já existe.
Depois de concluir upload, capa e descrição do YouTube, execute python3 -I /root/phanterai_studio/scripts/blog-youtube.py --schedule VIDEO_ID (substitua pelo ID real). Leia docs/video-blog-handoff.md. Esse comando cria/confirma o artigo completo com embed e inclui seu link na descrição, com leitura de confirmação. Se o roteiro prometer links ou passo a passo na descrição, essa promessa deve apontar para o artigo desse mesmo vídeo. Inclua no resultado blog_url, blog_status e description_linked, usando o recibo do comando. Se falhar, registre blog_pendente e o motivo; preserve IDs e nunca reenvie um vídeo já agendado.
7. Ao terminar, grave {feito} com: slug, titulo_final, fontes (urls), horario_agendado, ids e links do Instagram e do YouTube, faixa de música usada, e "status" ("agendado", "publicado" ou "nao_publicado" com o motivo). Grave esse arquivo mesmo em caso de falha.
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

ATENÇÃO: esta é a tentativa $T de $MAX. A anterior falhou (ver $LOG e $FEITO.tentativa$((T-1))). Reaproveite o que já existe na pasta do reel, corrija a causa da falha e termine. Se este reel já estiver agendado no Instagram/YouTube, não suba outro: só grave o resultado. Se o tema não se confirmar em fonte primária, escolha outro tema de IA do calendário para este horário."; fi
  set +e
  IS_SANDBOX=1 timeout 40m claude -p "$P" --permission-mode bypassPermissions >>"$LOG" 2>&1
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
