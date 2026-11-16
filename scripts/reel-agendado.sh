#!/usr/bin/env bash
# reel-agendado.sh - disparado pelo cron 45 min antes de cada horário de publicação.
# Lê calendario/reels.json, acha o reel de hoje (Brasília) no horário pedido e aciona o
# Claude Code para rodar a skill make-reels-phanterai.
#
#   scripts/reel-agendado.sh 12:00            roda o reel de hoje das 12:00
#   scripts/reel-agendado.sh 12:00 --dry-run  só mostra o que rodaria (não chama o Claude)
#   DATA=2026-11-18 scripts/reel-agendado.sh 07:00 --dry-run
set -euo pipefail

export HOME=/root
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
STUDIO=/root/phanterai_studio
CAL="$STUDIO/calendario/reels.json"
LOGDIR="$STUDIO/out/agendador"
HORA="${1:?informe o horário, ex.: 12:00}"
DRY="${2:-}"
DATA="${DATA:-$(TZ=America/Sao_Paulo date +%F)}"

mkdir -p "$LOGDIR"
ID="$DATA-${HORA/:/}"
LOG="$LOGDIR/$ID.log"
FEITO="$LOGDIR/$ID.json"
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
if [ -e "$FEITO" ]; then log "reel $ID já tem resultado em $FEITO; não refaço"; exit 0; fi

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
4. Reel de um tema só, de 40 a 60 segundos (exceção: o "Resumo da semana" segue a duração da skill). Narração no ElevenLabs gerada uma única vez, depois de revisar o texto.
5. Agende no Instagram @phanteraicreative e no YouTube para {r['data']} {r['hora']} de Brasília. Se na hora de agendar faltar menos de 5 minutos para esse horário (ou ele já tiver passado), agende para 6 minutos depois do momento atual.
6. Nunca refaça nem republique o que já foi publicado ou agendado. Antes de agendar, confira nas APIs se este slug já existe.
7. Ao terminar, grave {feito} com: slug, titulo_final, fontes (urls), horario_agendado, ids e links do Instagram e do YouTube, faixa de música usada, e "status" ("agendado", "publicado" ou "nao_publicado" com o motivo). Grave esse arquivo mesmo em caso de falha.
""")
PY
)"

if [ "$DRY" = "--dry-run" ]; then
  echo "== $ID =="; echo "$PROMPT"; exit 0
fi

# Um reel por vez: se o anterior ainda estiver renderizando, espera até 40 min.
exec 9>"$LOGDIR/.lock"
if ! flock -w 2400 9; then log "outro reel ainda está rodando depois de 40 min; desisti de $ID"; exit 1; fi

log "iniciando $ID"
cd "$STUDIO"
set +e
IS_SANDBOX=1 timeout 90m claude -p "$PROMPT" --permission-mode bypassPermissions >>"$LOG" 2>&1
RC=$?
set -e
log "claude terminou com código $RC"
if [ ! -e "$FEITO" ]; then
  printf '{"slug": "%s", "status": "nao_publicado", "motivo": "o Claude encerrou (codigo %s) sem gravar resultado; ver %s"}\n' "$ID" "$RC" "$LOG" >"$FEITO"
fi
exit "$RC"
