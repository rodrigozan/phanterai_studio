#!/usr/bin/env bash
# Roda um agendamento na conta indicada e, se ela bater o limite, passa para a próxima.
# Uso: claude-roteado.sh claude|claude-dev "prompt" [antigravity]
#   o 3º argumento só para rodadas de pesquisa (as skills de render/publicação só existem no Claude).
set -uo pipefail
PRIMEIRO="$1"; PROMPT="$2"; EXTRA="${3:-}"
ORDEM=(claude claude-dev); [ "$PRIMEIRO" = claude-dev ] && ORDEM=(claude-dev claude)
[ -n "$EXTRA" ] && ORDEM+=("$EXTRA")
SAIDA="$(mktemp)"; trap 'rm -f "$SAIDA"' EXIT
P="$PROMPT"; RC=1
for A in "${ORDEM[@]}"; do
  echo "[roteado] executando em $A"
  case "$A" in
    claude)      env -u CLAUDE_CONFIG_DIR IS_SANDBOX=1 claude -p "$P" --permission-mode bypassPermissions </dev/null 2>&1 | tee "$SAIDA" ;;
    claude-dev)  CLAUDE_CONFIG_DIR=/root/.claude-dev IS_SANDBOX=1 claude -p "$P" --permission-mode bypassPermissions </dev/null 2>&1 | tee "$SAIDA" ;;
    antigravity) agy --dangerously-skip-permissions --print-timeout 35m -p "$P" </dev/null 2>&1 | tee "$SAIDA" ;;
  esac
  RC=${PIPESTATUS[0]}
  [ "$RC" -eq 0 ] && exit 0
  # só o fim da saída: a própria pauta de IA pode falar em "rate limit"
  tail -n 5 "$SAIDA" | grep -qiE "hit your .{0,20}limit|usage limit reached|RESOURCE_EXHAUSTED|quota exceeded" || exit "$RC"
  echo "[roteado] $A no limite"
  P="$PROMPT

ATENÇÃO: outra conta começou esta rodada e parou no limite de uso. Reaproveite o que já existe em disco e NUNCA republique nem reagende o que já foi publicado ou agendado."
done
exit "$RC"
