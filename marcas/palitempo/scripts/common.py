"""Utilidades compartilhadas do pipeline. Só stdlib. Nunca imprime chaves."""
import base64
import json
import os
import random
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # canal-historia/
CONFIG_PATH = ROOT / "config.json"


def load_config():
    cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    load_env(cfg)
    return cfg


def load_env(cfg):
    """Carrega só as variáveis permitidas do .env (sem sobrescrever o ambiente)."""
    env_file = (ROOT / cfg.get("env_file", "../.env")).resolve()
    prefixes = tuple(cfg.get("env_prefixes", []))
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip()
        if k.startswith("export "):
            k = k[7:].strip()
        v = v.strip().strip('"').strip("'")
        if v and k.startswith(prefixes) and k not in os.environ:
            os.environ[k] = v


def need_env(name):
    v = os.environ.get(name, "")
    if not v:
        sys.exit(f"ERRO: variável de ambiente {name} não encontrada (.env do phanterai_studio).")
    return v


def die(msg):
    sys.exit(f"ERRO: {msg}")


def resolve_video_dir(arg):
    p = Path(arg)
    if not p.is_absolute() and not p.exists():
        p = ROOT / arg
    p = p.resolve()
    if not (p / "cenas.json").exists():
        die(f"cenas.json não encontrado em {p}")
    return p


def load_cenas(video_dir):
    cenas = json.loads((video_dir / "cenas.json").read_text(encoding="utf-8"))
    ids = [c["id"] for c in cenas]
    if len(ids) != len(set(ids)):
        die("ids duplicados em cenas.json")
    return cenas


def select(cenas, only=None, limit=None):
    if only:
        want = {x.strip() for x in only.split(",")}
        cenas = [c for c in cenas if c["id"] in want]
    if limit:
        cenas = cenas[:limit]
    return cenas


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


def http_post(url, headers, body, retries=6, timeout=300, label="requisição"):
    """POST JSON com retry/backoff em 429, 5xx e erros de rede. Retorna (bytes, headers)."""
    data = json.dumps(body).encode()
    req_headers = {"Content-Type": "application/json", **headers}
    for tentativa in range(retries + 1):
        req = urllib.request.Request(url, data=data, headers=req_headers, method="POST")
        espera = None
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read(), r.headers
        except urllib.error.HTTPError as e:
            corpo = e.read()[:400].decode("utf-8", "ignore")
            if e.code == 429 or 500 <= e.code < 600:
                ra = e.headers.get("Retry-After")
                espera = float(ra) if ra and ra.replace(".", "").isdigit() else None
                erro = f"HTTP {e.code}"
            else:
                die(f"{label}: HTTP {e.code} — {corpo}")
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            erro = f"rede: {type(e).__name__}"
        if tentativa == retries:
            die(f"{label}: falhou após {retries + 1} tentativas ({erro})")
        if espera is None:
            espera = min(2 ** tentativa * 2, 60) + random.uniform(0, 1.5)
        print(f"  ! {label}: {erro}; nova tentativa em {espera:.0f}s ({tentativa + 1}/{retries})", flush=True)
        time.sleep(espera)


# ---------- Gemini (Interactions API) ----------

def _find_image(node):
    """Procura recursivamente o primeiro dict {type:'image', data:...} na resposta."""
    if isinstance(node, dict):
        if node.get("type") == "image" and node.get("data"):
            return node
        if isinstance(node.get("output_image"), dict) and node["output_image"].get("data"):
            return node["output_image"]
        for v in node.values():
            r = _find_image(v)
            if r:
                return r
    elif isinstance(node, list):
        for v in node:
            r = _find_image(v)
            if r:
                return r
    return None


def gemini_image(cfg, prompt, refs=(), aspect=None):
    """Gera uma imagem. refs = lista de Paths (png/jpg). Retorna bytes PNG."""
    ic = cfg["imagem"]
    key = need_env(ic["api_key_env"])
    entrada = [{"type": "text", "text": prompt}]
    for p in refs:
        mime = "image/jpeg" if str(p).lower().endswith((".jpg", ".jpeg")) else "image/png"
        entrada.append({"type": "image", "mime_type": mime,
                        "data": base64.b64encode(Path(p).read_bytes()).decode()})
    body = {
        "model": ic["modelo"],
        "input": entrada if refs else prompt,
        "response_format": {"type": "image", "mime_type": "image/png",
                            "aspect_ratio": aspect or ic["aspect_ratio"],
                            "image_size": ic["image_size"]},
    }
    raw, _ = http_post(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {"x-goog-api-key": key, "Api-Revision": ic["api_revision"]},
        body, label="Gemini imagem")
    resp = json.loads(raw)
    img = _find_image(resp)
    if not img:
        die(f"Gemini não devolveu imagem (campos: {list(resp)[:8]}) — possível bloqueio de conteúdo; ajuste o prompt.")
    png = base64.b64decode(img["data"])
    if png[:8] != b"\x89PNG\r\n\x1a\n":  # veio JPEG/WebP: converte via ffmpeg
        r = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-f", "image2", "-c:v", "png", "pipe:1"],
                           input=png, capture_output=True)
        if r.returncode != 0:
            die("falha convertendo imagem do Gemini para PNG")
        png = r.stdout
    return png
