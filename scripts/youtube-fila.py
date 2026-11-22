#!/usr/bin/env python3
"""youtube-fila.py - envia ao YouTube os vídeos aprovados que estão na fila, pela API do Phantertools.

Disparado pelo cron de hora em hora. Cada trabalho é um JSON em
out/shorts-blocos/fila-youtube/pendentes/<slug>.json:

  {"slug", "pasta" (com video.mp4 e packaging.json), "channelId", "publishAt" (ISO, futuro),
   "capa" (opcional), "naoAntesDe" (ISO, opcional)}

O packaging.json traz title_chosen, description, tags, channel_lang e "anterior": {videoId, title}.
Regra do canal: a descrição SEMPRE leva o link do episódio anterior. Antes de enviar, o script confere
no registro de publicações da API que esse videoId existe no mesmo canal, com result=success e o
mesmo título, e que o link está na descrição. Se não conferir, o trabalho falha e não envia.

Segurança contra vídeo duplicado:
  - antes do POST, procura no registro uma publicação de sucesso com o mesmo título e arquivo;
    se achar, só marca como feito;
  - cota esgotada (quota_exhausted) deixa o trabalho pendente para a próxima hora;
  - qualquer outro erro move o trabalho para falhou/ e NÃO tenta de novo.

Uso:
  python3 -I scripts/youtube-fila.py            processa a fila
  python3 -I scripts/youtube-fila.py --check    só valida os trabalhos (não envia nada)
"""
import json
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

FILA = Path("/root/phanterai_studio/out/shorts-blocos/fila-youtube")
API = "http://127.0.0.1:3930/api"
KEY_FILE = Path("/root/.config/phantertools/operator.key")
YT_UPLOAD = "/root/phantertools/phantertools_api/tools/yt-upload.mjs"
NODE = "/root/.nvm/versions/node/v22.23.3/bin/node"
CHECK = "--check" in sys.argv


def log(msg):
    agora = datetime.now(timezone.utc).astimezone().strftime("%F %T %Z")
    print(f"[{agora}] {msg}", flush=True)


def api(method, path, body=None, timeout=60):
    key = KEY_FILE.read_text().strip()
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{API}{path}", data=data, method=method,
                                 headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except ValueError:
            return e.code, {"error": raw.decode(errors="replace")[:500]}


def publicacoes(channel_id):
    st, d = api("GET", f"/youtube/publications?channelId={channel_id}&result=success&limit=50")
    if st != 200 or not isinstance(d.get("items"), list):
        raise RuntimeError(f"GET /youtube/publications falhou: {st} {d}")
    return [i for i in d["items"] if i.get("channelId") == channel_id and i.get("result") == "success"]


def mover(job_file, destino, job, **extra):
    job.update(extra)
    (FILA / destino).mkdir(parents=True, exist_ok=True)
    alvo = FILA / destino / job_file.name
    alvo.write_text(json.dumps(job, ensure_ascii=False, indent=2))
    job_file.unlink()
    return alvo


def validar(job):
    """Devolve (packaging, problemas)."""
    problemas = []
    pasta = Path(job["pasta"])
    video, pk_file = pasta / "video.mp4", pasta / "packaging.json"
    if not video.is_file():
        problemas.append(f"vídeo não existe: {video}")
    if not str(video).startswith("/root/phanterai_studio/out/"):
        problemas.append("o vídeo precisa estar em /root/phanterai_studio/out")
    pk = json.loads(pk_file.read_text()) if pk_file.is_file() else {}
    for campo in ("title_chosen", "description", "tags"):
        if not pk.get(campo):
            problemas.append(f"packaging.json sem {campo}")
    publish = datetime.fromisoformat(job["publishAt"].replace("Z", "+00:00"))
    if publish <= datetime.now(timezone.utc):
        problemas.append(f"publishAt {job['publishAt']} já passou")
    ant = pk.get("anterior") or {}
    if not ant.get("videoId") or not ant.get("title"):
        problemas.append("packaging.json sem anterior.videoId/anterior.title (link do episódio anterior é obrigatório)")
    else:
        link = f"https://youtube.com/shorts/{ant['videoId']}"
        if link not in pk.get("description", "") or ant["title"] not in pk.get("description", ""):
            problemas.append(f"a descrição não tem o título e o link do episódio anterior ({link})")
        regs = [i for i in publicacoes(job["channelId"]) if i.get("videoId") == ant["videoId"]]
        if not regs:
            problemas.append(f"episódio anterior {ant['videoId']} não está no registro de publicações do canal")
        elif regs[0].get("title") != ant["title"]:
            problemas.append(f"título do episódio anterior não confere: registro diz {regs[0].get('title')!r}")
    return pk, problemas


def processar(job_file):
    job = json.loads(job_file.read_text())
    slug = job["slug"]
    agora = datetime.now(timezone.utc)
    if job.get("naoAntesDe") and agora < datetime.fromisoformat(job["naoAntesDe"].replace("Z", "+00:00")) and not CHECK:
        log(f"{slug}: aguardando {job['naoAntesDe']}")
        return
    pk, problemas = validar(job)
    if problemas:
        log(f"{slug}: REPROVADO na validação: " + " | ".join(problemas))
        if not CHECK:
            mover(job_file, "falhou", job, erro=problemas, em=agora.isoformat())
        return
    if CHECK:
        log(f"{slug}: ok. Título {pk['title_chosen']!r}, publishAt {job['publishAt']}, "
            f"episódio anterior {pk['anterior']['title']!r} ({pk['anterior']['videoId']}), {len(pk['tags'])} tags")
        return

    video = str(Path(job["pasta"]) / "video.mp4")
    ja = [i for i in publicacoes(job["channelId"]) if i.get("title") == pk["title_chosen"] and i.get("videoPath") == video]
    if ja:
        log(f"{slug}: já enviado antes ({ja[0].get('videoId')}); marcando como feito sem reenviar")
        mover(job_file, "feitos", job, videoId=ja[0].get("videoId"), youtubeUrl=ja[0].get("youtubeUrl"), em=agora.isoformat())
        return

    body = {"videoDir": video, "title": pk["title_chosen"], "description": pk["description"], "tags": pk["tags"],
            "channelLang": pk.get("channel_lang", "pt-BR"), "channelId": job["channelId"],
            "status": "private", "publishAt": job["publishAt"]}
    log(f"{slug}: enviando {pk['title_chosen']!r} para {job['publishAt']}")
    st, resp = api("POST", "/youtube/upload", body, timeout=900)
    if resp.get("error") == "quota_exhausted":
        log(f"{slug}: cota do YouTube ainda esgotada (renova {resp.get('fields', {}).get('resetsAt')}); tento na próxima hora")
        return
    if st != 200 or not resp.get("videoId"):
        log(f"{slug}: ERRO no upload ({st}): {resp}. Não vou tentar de novo sozinho.")
        mover(job_file, "falhou", job, erro=resp, status=st, em=agora.isoformat())
        return
    vid = resp["videoId"]
    confere = [i for i in publicacoes(job["channelId"]) if i.get("videoId") == vid]
    log(f"{slug}: enviado, videoId {vid}, publishAt {resp.get('publishAt')}; registro de publicações "
        + ("confere" if confere else "NÃO confere"))
    capa = None
    if job.get("capa") and Path(job["capa"]).is_file():
        r = subprocess.run([NODE, YT_UPLOAD, "thumb", vid, job["channelId"], job["capa"]],
                           capture_output=True, text=True, timeout=300)
        capa = (r.stdout + r.stderr).strip()[:300]
        log(f"{slug}: capa: {capa}")
    mover(job_file, "feitos", job, videoId=vid, youtubeUrl=resp.get("link"), publishAtConfirmado=resp.get("publishAt"),
          registroConfere=bool(confere), capaResultado=capa, em=agora.isoformat())


def main():
    pendentes = sorted((FILA / "pendentes").glob("*.json"))
    if not pendentes:
        return
    for f in pendentes:
        try:
            processar(f)
        except Exception as e:  # erro de rede/API: deixa pendente, mas registra
            log(f"{f.stem}: erro inesperado, fica pendente: {e!r}")


if __name__ == "__main__":
    main()
