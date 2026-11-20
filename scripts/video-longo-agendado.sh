#!/usr/bin/env bash
# video-longo-agendado.sh - disparado pelo cron seg/qua/sex às 01:00 de Brasília (04:00 UTC).
# Aciona o Claude Code para rodar a skill make-long-videos-phanterai do começo ao fim, direto em 1080p (sem rascunho),
# e subir o vídeo agendado (private + publishAt) para o mesmo dia às 12:16 de Brasília (15:16 UTC).
#
#   scripts/video-longo-agendado.sh             roda o vídeo longo de hoje (Brasília)
#   scripts/video-longo-agendado.sh --dry-run   só mostra o prompt (não chama o Claude)
#   DATA=2026-11-20 scripts/video-longo-agendado.sh --dry-run
set -euo pipefail

export HOME=/root
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
STUDIO=/root/phanterai_studio
MARCA="${MARCA:-phanterai}"
LOGDIR="$STUDIO/out/$MARCA/agendador-longos"
REELDIR="$STUDIO/out/$MARCA/agendador"
DRY="${1:-}"
DATA="${DATA:-$(TZ=America/Sao_Paulo date +%F)}"
HORA_BRT="12:16"
PUBLISH_AT="$(date -u -d "$DATA $HORA_BRT -03:00" +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "$LOGDIR" "$REELDIR"
LOG="$LOGDIR/$DATA.log"
FEITO="$LOGDIR/$DATA.json"
ok() { [ -e "$FEITO" ] && python3 -I -c 'import json,sys; sys.exit(0 if json.load(open(sys.argv[1])).get("status") in ("agendado","publicado") else 1)' "$FEITO" 2>/dev/null; }
log() { echo "[$(TZ=America/Sao_Paulo date '+%F %T')] $*" | tee -a "$LOG"; }

PROMPT="Rodada agendada do vídeo longo da PhanterAI. Ninguém está acompanhando: não faça perguntas, não espere aprovação de ninguém, decida e registre.

Use a skill make-long-videos-phanterai e siga o fluxo dela do começo ao fim para criar, renderizar e agendar UM vídeo longo.

Vídeo de hoje
- Data (Brasília): $DATA
- Publicação: $DATA às $HORA_BRT de Brasília (UTC-3) = publishAt $PUBLISH_AT (sempre private + publishAt, canal Aprenda YouTube)
- Slug: $DATA-<tema-curto>

Regras desta rodada (valem acima do que a skill diz sobre pedir aprovação)
1. Tema: escolha você mesmo, sem esperar aprovação. Pesquise o que está viral na semana no YouTube gringo (passo 1 da skill, sem vidIQ, usando as skills yt-*), escolha o melhor candidato dentro do nicho de IA/ferramentas que ensinam o público a criar, e confira em $STUDIO/public/phanterai/episodes/long-videos/ que o tema ainda não foi feito. Nunca repita tema.
2. Valide o método na fonte oficial ANTES de escrever (passo 2 da skill). Se não der para confirmar em fonte primária, NÃO gere narração, NÃO renderize e NÃO publique: grave o motivo no arquivo de resultado e encerre.
3. NÃO faça rascunho. Pule o passo 11 (render a 0,5 e envio ao Rod). Depois dos stills conferidos e corrigidos, vá direto para a versão final em 1080p (passo 13), capa, pacote e upload agendado.
CAPAS (regra do Rod, 20/11/2026): gere 3 capas de alto clique com node scripts/long-capa.mjs <slug> out/phanterai/long-videos/<slug>/capa.jpg --variantes=a,b,c --linha1=... --linha2=... --prompt=... --shot=... --antes=... --depois=... (A = pantera gigante, B = o pedido no Claude Desktop + resultado, C = antes x depois; texto de 2 a 4 palavras, sem repetir o título). Olhe as 3 imagens. Suba a capa A no YouTube como padrão e envie as 3 para o WhatsApp do Rod com node scripts/enviar-whats.mjs \"Capas do vídeo <título>: A, B e C. Responda a letra\" capa-a.jpg capa-b.jpg capa-c.jpg. Se o Rod responder a letra, troque com yt-upload.mjs thumb. Vídeo para público leigo: Claude Desktop, sem terminal (ver regras inegociáveis da skill).
4. Siga todas as regras de tom, visual, áudio e sincronismo da skill (passos 3 a 10 e 12). Gaste crédito de voz uma vez só, depois de fechar o texto.
5. Se na hora de subir faltar menos de 10 minutos para $PUBLISH_AT (ou já tiver passado), agende para 15 minutos depois do momento atual.
6. Nunca refaça nem republique o que já foi publicado ou agendado. Antes de subir, confira na API do canal se o slug/título já existe.
7. Memória do servidor: render sempre com a concorrência padrão do long-render.mjs, nunca rode dois renders ao mesmo tempo.
8. Depois de agendar, confira na API e faça commit + push do código novo por nome de arquivo (nunca mídia nem renders).
Depois de concluir upload, capa e descrição do YouTube, execute python3 -I /root/phanterai_studio/scripts/blog-youtube.py --schedule VIDEO_ID (substitua pelo ID real). Leia docs/video-blog-handoff.md. Esse comando cria/confirma o artigo completo com embed e inclui seu link na descrição, com leitura de confirmação. Se o roteiro prometer links ou passo a passo na descrição, essa promessa deve apontar para o artigo desse mesmo vídeo. Inclua no resultado blog_url, blog_status e description_linked, usando o recibo do comando. Se falhar, registre blog_pendente e o motivo; preserve IDs e nunca reenvie um vídeo já agendado.
9. Ao terminar, grave $FEITO com: slug, titulo_final, fontes (urls), horario_agendado, id e link do YouTube, e \"status\" (\"agendado\", \"publicado\" ou \"nao_publicado\" com o motivo). Grave esse arquivo mesmo em caso de falha."

if [ "$DRY" = "--dry-run" ]; then
  echo "== $DATA =="; echo "$PROMPT"; exit 0
fi

if ok; then log "vídeo longo de $DATA já agendado/publicado ($FEITO); não refaço"; exit 0; fi

# Compartilha o lock dos reels: render pesado e reels não rodam juntos (3 processos já estouraram a memória).
exec 9>"$REELDIR/.lock"
if ! flock -w 3600 9; then log "outro render ainda rodando depois de 60 min; desisti de $DATA"; exit 1; fi

MAX=2   # tentativas seguidas, de até 2h cada
cd "$STUDIO"
RC=1
for T in $(seq 1 $MAX); do
  log "iniciando vídeo longo $DATA, tentativa $T/$MAX (publishAt $PUBLISH_AT)"
  P="$PROMPT"
  if [ "$T" -gt 1 ]; then P="$PROMPT

ATENÇÃO: esta é a tentativa $T de $MAX. A anterior falhou (ver $LOG e $FEITO.tentativa$((T-1))). Reaproveite o que já existe na pasta do episódio (roteiro, voz, prints), corrija a causa da falha e termine o processo. Se o vídeo deste dia já estiver agendado no YouTube, não suba outro: só grave o resultado."; fi
  set +e
  IS_SANDBOX=1 timeout 2h claude -p "$P" --permission-mode bypassPermissions >>"$LOG" 2>&1
  RC=$?
  set -e
  log "claude terminou com código $RC (tentativa $T)"
  if [ ! -e "$FEITO" ]; then
    printf '{"slug": "%s", "status": "nao_publicado", "motivo": "o Claude encerrou (codigo %s) sem gravar resultado; ver %s"}\n' "$DATA" "$RC" "$LOG" >"$FEITO"
  fi
  if ok; then log "vídeo longo $DATA ok"; exit 0; fi
  [ "$T" -lt "$MAX" ] && mv -f "$FEITO" "$FEITO.tentativa$T"
done
log "vídeo longo $DATA NÃO foi agendado depois de $MAX tentativas"
exit 1
