#!/usr/bin/env python3
"""long-upload-adiado.py - termina um vídeo longo quando a cota do YouTube acabou na hora do upload.

    setsid nohup python3 -I scripts/long-upload-adiado.py <slug> <publishAtISO> [--nao-antes=ISO] [--artigo=script.py] &

Roda desacoplado (sobrevive ao timeout da rodada agendada) e, depois de `--nao-antes` (padrão: agora):
  1. trava /tmp/long-upload-<slug>.lock (um finalizador por vídeo, nunca dois);
  2. procura no canal um vídeo com o mesmo título (já enviado = não reenvia, só termina o resto);
  3. envia private + publishAt com tools/yt-upload.mjs; cota esgotada = espera 15 min e tenta de novo
     (até 24 h); se faltar menos de 10 min para o publishAt, agenda para agora + 15 min (regra do Rod);
  4. capa A no YouTube, as 3 capas no WhatsApp do Rod, artigo (--artigo=script.py <VIDEO_ID> <article.json>)
     e blog-youtube.py --schedule VIDEO_ID;
  5. confere na API e grava out/phanterai/agendador-longos/<data>.json (status agendado ou nao_publicado).
Lê out/phanterai/long-videos/<slug>/ (video.mp4, packaging.json, capa-a/b/c.jpg) e o roteiro (fontes).
Log: out/phanterai/long-videos/<slug>/upload-adiado.log. Nenhuma credencial é impressa.
"""
import fcntl
import json
import subprocess
import sys
import time
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

STUDIO = Path("/root/phanterai_studio")
CANAL = "UCYHsuiYTaYCV_bfuyvW86Kw"
API = "http://127.0.0.1:3930/api"
KEY = Path("/root/.config/phantertools/operator.key")
NODE = "/root/.nvm/versions/node/v22.23.3/bin/node"
YT = "/root/phantertools/phantertools_api/tools/yt-upload.mjs"

slug, publish_at = sys.argv[1], sys.argv[2]
nao_antes = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--nao-antes=")), None)
# --artigo=script.py: escreve out/phanterai/blog/<VIDEO_ID>/article.json (o blog-youtube.py não gera mais artigo)
artigo = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--artigo=")), None)
pasta = STUDIO / "out/phanterai/long-videos" / slug
logf = pasta / "upload-adiado.log"
data = slug[:10]
feito = STUDIO / "out/phanterai/agendador-longos" / f"{data}.json"
pk = json.loads((pasta / "packaging.json").read_text())
roteiro = json.loads((STUDIO / "public/phanterai/episodes/long-videos" / slug / "roteiro.json").read_text())


def agora():
    return datetime.now(timezone.utc)


def iso(d):
    return d.strftime("%Y-%m-%dT%H:%M:%SZ")


def log(msg):
    with logf.open("a") as f:
        f.write(f"[{iso(agora())}] {msg}\n")


def videos():
    req = urllib.request.Request(f"{API}/youtube/videos?channelId={CANAL}&limit=500",
                                 headers={"Authorization": f"Bearer {KEY.read_text().strip()}"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def no_canal():
    return [v for v in videos() if v.get("title") == pk["title_chosen"] and v.get("youtubeVideoId")]


def run(*cmd, timeout=1800, cwd=None):
    r = subprocess.run(list(cmd), capture_output=True, text=True, timeout=timeout, cwd=cwd)
    return r.returncode, (r.stdout + r.stderr).strip()


def gravar(extra):
    base = {"slug": slug, "titulo_final": pk["title_chosen"], "fontes": roteiro.get("fontes", [])}
    if feito.exists():
        try:
            antigo = json.loads(feito.read_text())
            base = {**antigo, **base}
        except ValueError:
            pass
    base.update(extra)
    if base.get("status") == "agendado":
        base.pop("motivo", None)
    feito.write_text(json.dumps(base, ensure_ascii=False, indent=2) + "\n")


lock = open(f"/tmp/long-upload-{slug}.lock", "w")
try:
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
except OSError:
    print("outro finalizador já está cuidando deste vídeo; saio sem fazer nada")
    sys.exit(0)

if nao_antes:
    alvo = datetime.fromisoformat(nao_antes.replace("Z", "+00:00"))
    log(f"esperando a cota renovar: não antes de {nao_antes}")
    while agora() < alvo:
        time.sleep(30)

limite = agora() + timedelta(hours=24)
vid = link = None
while True:
    ja = no_canal()
    if ja:
        vid, link = ja[0]["youtubeVideoId"], ja[0].get("youtubeUrl")
        publish_at = ja[0].get("publishAt") or publish_at
        log(f"já está no canal ({vid}); não reenvio")
        break
    pub = datetime.fromisoformat(publish_at.replace("Z", "+00:00"))
    if pub - agora() < timedelta(minutes=10):
        publish_at = iso(agora() + timedelta(minutes=15))
        log(f"faltavam menos de 10 min para o horário original; agendando para {publish_at}")
    log(f"enviando {pk['title_chosen']!r} para {publish_at}")
    rc, out = run(NODE, YT, "upload", str(pasta), CANAL, publish_at, cwd="/root/phantertools/phantertools_api")
    log(f"upload rc={rc}: {out[:400]}")
    if "quota_exhausted" in out:
        if agora() > limite:
            gravar({"status": "nao_publicado", "motivo": "cota do YouTube esgotada por 24 h seguidas; vídeo pronto em " + str(pasta)})
            sys.exit(1)
        time.sleep(900)
        continue
    try:
        resp = json.loads(out.split(" ", 1)[1])
    except (IndexError, ValueError):
        resp = {}
    if rc != 0 or not resp.get("videoId"):
        time.sleep(20)
        ja = no_canal()  # upload incerto: confere antes de qualquer outra coisa
        if ja:
            vid, link = ja[0]["youtubeVideoId"], ja[0].get("youtubeUrl")
            break
        gravar({"status": "nao_publicado", "motivo": f"upload falhou: {out[:300]}"})
        sys.exit(1)
    vid, link, publish_at = resp["videoId"], resp.get("link"), resp.get("publishAt") or publish_at
    break

rc, out = run(NODE, YT, "thumb", vid, CANAL, str(pasta / "capa-a.jpg"), cwd="/root/phantertools/phantertools_api")
capa = f"capa A enviada ({out[:3]})" if rc == 0 else f"capa falhou: {out[:200]}"
log(capa)

capas = [str(pasta / f"capa-{v}.jpg") for v in "abc"]
rc, out = run(NODE, str(STUDIO / "scripts/enviar-whats.mjs"), f"Capas do vídeo {pk['title_chosen']}: A, B e C. Responda a letra", *capas, cwd=str(STUDIO))
whats = "3 capas enviadas" if rc == 0 else f"falhou: {out[-200:]}"
log(f"whatsapp: {whats}")

if artigo:
    dest = STUDIO / "out/phanterai/blog" / vid / "article.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    rc, out = run("python3", "-I", artigo, vid, str(dest), cwd=str(STUDIO))
    log(f"artigo rc={rc}: {out[-200:]}")

rc, out = run("python3", "-I", str(STUDIO / "scripts/blog-youtube.py"), "--schedule", vid, timeout=3600, cwd=str(STUDIO))
log(f"blog rc={rc}: {out[-600:]}")
recibo = {}
for linha in reversed(out.splitlines()):
    try:
        recibo = json.loads(linha)
        break
    except ValueError:
        continue
if not recibo:
    try:
        recibo = json.loads(out[out.index("{"):])
    except ValueError:
        recibo = {}
blog_ok = rc == 0 and recibo.get("description_linked") is True
blog = {"blog_url": recibo.get("url"), "blog_status": recibo.get("status") if blog_ok else "blog_pendente",
        "blog_post_id": recibo.get("post_id"), "description_linked": bool(recibo.get("description_linked"))}
if not blog_ok:
    blog["blog_motivo"] = f"blog-youtube.py rc={rc}: {out[-300:]}"

v = next((x for x in videos() if x.get("youtubeVideoId") == vid), {})
conf = {"privacyStatus": v.get("privacyStatus"), "publishAt": v.get("publishAt"), "channelId": v.get("channelId"),
        "status": v.get("status"), "thumbnailStatus": v.get("thumbnailStatus")}
log(f"conferência na API: {conf}")
ok = v.get("privacyStatus") == "private" and v.get("publishAt")
gravar({
    "status": "agendado" if ok else "nao_publicado",
    **({} if ok else {"motivo": f"a API não confirmou private + publishAt: {conf}"}),
    "horario_agendado": f"{publish_at} (Brasília = UTC-3)",
    "youtube_id": vid, "youtube_link": link or f"https://youtube.com/watch?v={vid}",
    "conferencia_api": conf, "capa": capa, "capas_whatsapp": whats, **blog,
    "upload_adiado": f"cota do YouTube esgotada na rodada; enviado pelo finalizador em {iso(agora())}",
})
log("fim")
