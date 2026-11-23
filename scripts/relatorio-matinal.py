#!/usr/bin/env python3
"""relatorio-matinal.py - cron 06:00 de Brasília (09:00 UTC).
Manda por WhatsApp (API do Bailey / wa-gateway, localhost:3100) os títulos e links dos vídeos
agendados do dia e avisa de qualquer falha.   --dry-run: só imprime.
Destino: WA_DEST (padrão 5512988358895)."""
import fcntl, json, os, sys, time, urllib.request, urllib.error
from datetime import datetime
from zoneinfo import ZoneInfo

STUDIO = "/root/phanterai_studio"; MARCA = os.environ.get("MARCA", "phanterai")
DEST = os.environ.get("WA_DEST", "5512988358895")
agora = datetime.now(ZoneInfo("America/Sao_Paulo"))
DATA = os.environ.get("DATA", agora.strftime("%F"))
dow = datetime.strptime(DATA, "%Y-%m-%d").weekday()  # 0=seg
REEL = f"{STUDIO}/out/{MARCA}/agendador"; LONGO = f"{STUDIO}/out/{MARCA}/agendador-longos"
OK = ("agendado", "publicado")

def ler(p):
    try: return json.load(open(p))
    except Exception: return None

def rodando():
    try:
        f = open(f"{REEL}/.lock", "a+"); fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB); return False
    except BlockingIOError: return True
    except Exception: return False

def linhas_item(rotulo, r, esperado):
    if r is None:
        return False, [f"⏳ {rotulo}: sem resultado ainda (não rodou ou ainda em andamento). Previsto: {esperado}"]
    st = r.get("status", "?"); t = r.get("titulo_final") or r.get("titulo") or r.get("slug", "?")
    if st not in OK:
        return False, [f"❌ {rotulo}: NÃO agendado ({st}). {str(r.get('motivo',''))[:300]}"]
    yt = r.get("youtube") or {}; ig = r.get("instagram") or {}
    quando = (r.get("horario_agendado") or esperado)[:16].replace("T", " ")
    l = [f"✅ {rotulo}: {t}", f"   🕒 {quando}"]
    if yt.get("link"): l.append(f"   ▶️ {yt['link']}")
    if ig.get("link"): l.append(f"   📸 {ig['link']}")
    elif ig.get("status"): l.append(f"   📸 Instagram {ig.get('conta','')}: {ig['status']}")
    return True, l

cal = ler(f"{STUDIO}/marcas/{MARCA}/calendario/reels.json") or {"reels": []}
itens, falhas = [], 0
# Desde 23/11/2026: dois reels por dia, todos os dias, 07:00 e 12:00.
hoje = sorted([x for x in cal["reels"] if x["data"] == DATA and x["hora"] in ("07:00", "12:00")], key=lambda x: x["hora"])
esperados = 2
if not hoje:
    itens.append(f"❌ Reels: nenhum reel no calendário para {DATA}"); falhas += 1
for x in hoje:
    ok, l = linhas_item(f"Reel {x['hora']}", ler(f"{REEL}/{DATA}-{x['hora'].replace(':','')}.json"), f"{DATA} {x['hora']}")
    itens += l; falhas += (not ok)
if len(hoje) < esperados and hoje:
    itens.append(f"⚠️ Só {len(hoje)} reel(s) no calendário de hoje (esperado {esperados})"); falhas += 1
YTS=f"{STUDIO}/out/{MARCA}/agendador-yt-shorts"
for h in ("10:00", "17:00"):
    ok, l = linhas_item(f"Short YouTube {h}", ler(f"{YTS}/{DATA}-{h.replace(':','')}.json"), f"{DATA} {h}")
    itens += l; falhas += (not ok)
if dow in (0, 2, 4):
    ok, l = linhas_item("Vídeo longo 12:16", ler(f"{LONGO}/{DATA}.json"), f"{DATA} 12:16")
    itens += l; falhas += (not ok)
if rodando(): itens.append("🔄 Ainda há um render em andamento neste momento.")

cab = (f"Bom dia! Relatório de {DATA}\n" +
       ("Tudo agendado, nenhuma falha." if not falhas else f"⚠️ ATENÇÃO: {falhas} problema(s). Detalhes abaixo."))
msg = cab + "\n\n" + "\n".join(itens)
if "--dry-run" in sys.argv: print(msg); sys.exit(0)

env = dict(l.strip().split("=", 1) for l in open("/etc/wa-gateway.env") if "=" in l and not l.startswith("#"))
token, port = env["API_TOKEN"], env.get("PORT", "3100")
partes = [msg[i:i+3800] for i in range(0, len(msg), 3800)]
for p in partes:
    for t in range(1, 7):   # 6 tentativas, 5 min entre elas
        try:
            req = urllib.request.Request(f"http://127.0.0.1:{port}/messages", json.dumps({"to": DEST, "text": p}).encode(),
                  {"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
            urllib.request.urlopen(req, timeout=30); print("enviado"); break
        except Exception as e:
            print(f"tentativa {t} falhou: {e}", file=sys.stderr)
            if t == 6: sys.exit(1)
            time.sleep(300)
