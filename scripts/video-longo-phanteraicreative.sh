#!/usr/bin/env bash
# video-longo-phanteraicreative.sh - disparado pelo cron seg/qua às 23:00 de Brasília (02:00 UTC do dia seguinte), no dia anterior à publicação (ter/qui). Canal PhanterAI Creative.
# Aciona o claude-dev (CLAUDE_CONFIG_DIR=/root/.claude-dev) para rodar a skill make-long-videos-phanterai do começo ao fim, direto em 1080p (sem rascunho),
# e subir o vídeo agendado (private + publishAt) para o dia seguinte às 12:16 de Brasília (15:16 UTC).
#
#   scripts/video-longo-phanteraicreative.sh             cria o vídeo longo que publica amanhã (Brasília)
#   scripts/video-longo-phanteraicreative.sh --dry-run   só mostra o prompt (não chama o Claude)
#   DATA=2026-11-20 scripts/video-longo-phanteraicreative.sh --dry-run
set -euo pipefail

export HOME=/root
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
STUDIO=/root/phanterai_studio
MARCA="${MARCA:-phanterai}"
CANAL=UCOpUYDXKoiQcfypbFD0CNjw   # PhanterAI Creative
LOGDIR="$STUDIO/out/$MARCA/agendador-longos-phanteraicreative"
REELDIR="$STUDIO/out/$MARCA/agendador"
DRY="${1:-}"
DATA="${DATA:-$(TZ=America/Sao_Paulo date -d tomorrow +%F)}"   # DATA = dia da publicação
HORA_BRT="12:16"
PUBLISH_AT="$(date -u -d "$DATA $HORA_BRT -03:00" +%Y-%m-%dT%H:%M:%SZ)"

DIA_SEMANA="$(TZ=America/Sao_Paulo date -d "$DATA" +%u)"   # 2 = terça, 4 = quinta
if [ "$DRY" != "--dry-run" ] && [ "$DIA_SEMANA" != 2 ] && [ "$DIA_SEMANA" != 4 ] && [ "${FORA_DA_GRADE:-}" != 1 ]; then echo "$DATA não é terça nem quinta; nada a fazer"; exit 0; fi

mkdir -p "$LOGDIR" "$REELDIR"
LOG="$LOGDIR/$DATA.log"
FEITO="$LOGDIR/$DATA.json"
ok() { [ -e "$FEITO" ] && python3 -I -c 'import json,sys; sys.exit(0 if json.load(open(sys.argv[1])).get("status") in ("agendado","publicado") else 1)' "$FEITO" 2>/dev/null; }
log() { echo "[$(TZ=America/Sao_Paulo date '+%F %T')] $*" | tee -a "$LOG"; }

PROMPT="Rodada agendada do vídeo longo do canal YouTube PhanterAI Creative. Ninguém está acompanhando: não faça perguntas, não espere aprovação de ninguém, decida e registre.

Use a skill make-long-videos-phanterai (versão do PhanterAI Creative, que tem a seção FOCO DO CANAL no topo) e siga o fluxo dela do começo ao fim para criar, renderizar e agendar UM vídeo longo.

Vídeo desta rodada (criado hoje às 23h, publicado no dia seguinte)
- Data de publicação (Brasília): $DATA
- Publicação: $DATA às $HORA_BRT de Brasília (UTC-3) = publishAt $PUBLISH_AT (sempre private + publishAt, canal PhanterAI Creative, channelId $CANAL)
- Slug: $DATA-<tema-curto>

Regras desta rodada (valem acima do que a skill diz sobre pedir aprovação)
1. Tema (regra do Rod, 24/11/2026): IA para GERAÇÃO DE CONTEÚDO e GESTÃO DE PEQUENOS NEGÓCIOS usando CLAUDE WEB e CLAUDE CODE NO CLAUDE DESKTOP, para dono de pequeno negócio e criador leigo. NÃO é sobre crescer ou gerenciar canal do YouTube (isso é do Aprenda YouTube). Escolha você mesmo, sem esperar aprovação, com as skills yt-viral e yt-script (sem vidIQ), e confira em $STUDIO/public/phanterai/episodes/long-videos/ e no canal que o tema não foi feito. Nunca repita tema. O vídeo mostra um resultado real na tela (um orçamento, uma proposta, uma semana de posts, uma planilha...) e prova com o que o Claude de fato entrega.
2. Valide o método na fonte oficial ANTES de escrever (passo 2 da skill: docs da Anthropic, planos e limites do Claude web/Desktop, preços). Se não der para confirmar em fonte primária, NÃO gere narração, NÃO renderize e NÃO publique: grave o motivo no arquivo de resultado e encerre.
3. NÃO faça rascunho. Pule o passo 11 (render a 0,5 e envio ao Rod). Depois dos stills conferidos e corrigidos, vá direto para a versão final em 1080p (passo 13), capa, pacote e upload agendado.
CAPAS (regra do Rod, 27/11/2026): siga $STUDIO/docs/capas.md à risca: pesquise thumbs virais do nicho e do tema com scripts/capa-pesquisa.py (método yt-viral) e OLHE as folhas, escreva capas.json com 3 ideias diferentes (uma delas livre, desenhada do zero para este vídeo), rode node scripts/long-capa.mjs <slug> out/phanterai/long-videos/<slug>/capa.jpg --canal=creative, confira capa-folha.jpg e commite marcas/phanterai/capas-historico.json e a capa livre. Suba a capa A (a ideia mais forte, nunca um modelo fixo). A conta tem miniatura personalizada liberada.
4. Siga todas as regras de tom, visual, áudio e sincronismo da skill (passos 3 a 10 e 12). Gaste crédito de voz uma vez só, depois de fechar o texto. Tom: positivo, claro, para leigo, sem jargão; a identidade do Aprenda YouTube (Cobaia Honesto) NÃO se aplica aqui.
5. Se na hora de subir faltar menos de 10 minutos para $PUBLISH_AT (ou já tiver passado), agende para 15 minutos depois do momento atual.
6. Nunca refaça nem republique o que já foi publicado ou agendado. Antes de subir, confira na API do canal se o slug/título já existe.
7. Memória do servidor: render sempre com a concorrência padrão do long-render.mjs, nunca rode dois renders ao mesmo tempo.
8. UPLOAD no canal PhanterAI Creative: use SÓ o operador do phantertools (cd /root/phantertools/phantertools_api && node tools/yt-upload.mjs upload <pasta> $CANAL <publishAtISO> e node tools/yt-upload.mjs thumb <videoId> $CANAL <capa.jpg>). NUNCA suba no Aprenda YouTube (UCYHsuiYTaYCV_bfuyvW86Kw) nem use o token do PhanterClaw.
9. ARTIGO NO BLOG (regra do Rod, 24/11/2026: todo vídeo vira artigo; cada Claude escreve os do próprio canal, ninguém mais gera por você). Depois do upload no YouTube, ESCREVA o artigo e grave em /root/phanterai_studio/out/phanterai/blog/VIDEO_ID/article.json, com o schema de scripts/blog-article.schema.json (title, excerpt de até 240 caracteres, content em HTML, tags): português do Brasil, no mínimo 500 palavras no corpo (alvo 600 a 1.200), só p, h2, h3, ul, ol, li, strong, em, a, pre, code, sem estilos, imagens nem iframes; um passo a passo em <ol> ou h2/h3 numerados (ou, para notícia, o que muda e como o leitor aproveita, em etapas), o link https://www.youtube.com/watch?v=VIDEO_ID num parágrafo, seção \"Links úteis\" com TODOS os links de fonte que estão na descrição do vídeo, sem inventar fato, comando ou número que a fonte (roteiro/narração/fontes) não traga. Depois rode python3 -I /root/phanterai_studio/scripts/blog-youtube.py --schedule VIDEO_ID (ID real; se falhar por corrida com o cron, espere uns segundos e rode de novo) e leia docs/video-blog-handoff.md. Registre blog_url, blog_status, post_id e description_linked no resultado, ou blog_pendente com o motivo.
10. Depois de agendar, confira na API e faça commit + push do código novo por nome de arquivo (nunca mídia nem renders).
11. Ao terminar, grave $FEITO com: slug, titulo_final, fontes (urls), horario_agendado, id e link do YouTube, blog_url, blog_status, description_linked (ou blog_pendente), e \"status\" (\"agendado\", \"publicado\" ou \"nao_publicado\" com o motivo). Grave esse arquivo mesmo em caso de falha."

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
  timeout 2h /root/phanterai_studio/scripts/claude-roteado.sh claude-dev "$P" >>"$LOG" 2>&1
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
