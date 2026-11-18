#!/usr/bin/env bash
set -euo pipefail
export PATH="/root/.local/bin:/root/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin"
umask 077
STUDIO="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$STUDIO/out/phanterai/blog"
cd "$STUDIO"
exec /usr/bin/python3 -I "$STUDIO/scripts/blog-youtube.py" "$@" >> "$STUDIO/out/phanterai/blog/cron.log" 2>&1
