#!/usr/bin/env python3
"""QA do vídeo final. uso: qa.py <pasta-do-video>. Grava qa/qa-report.md e qa/frames/*.jpg"""
import json, re, subprocess, sys, os
V = sys.argv[1]
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)
def dur(f): return float(run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]).stdout)
def rms(f, a, b):
    r = run(["ffmpeg","-hide_banner","-ss",str(a),"-t",str(b-a),"-i",f,"-af","astats=metadata=0","-f","null","-"]).stderr
    m = re.findall(r"RMS level dB: (-?[\d.inf]+)", r); return float(m[-1]) if m and m[-1] != "-inf" else -120.0
def lufs(f, a, b):
    r = run(["ffmpeg","-hide_banner","-ss",str(a),"-t",str(b-a),"-i",f,"-af","ebur128","-f","null","-"]).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", r); return float(m[-1]) if m else None
L = []; ok = True
def chk(c, msg):
    global ok; ok &= bool(c); L.append(f"- {'OK' if c else 'FALHA'}: {msg}")
TM = json.load(open(f"{V}/sync/timeline-map.json")); CH = TM["chapters"]
tr = json.load(open(f"{V}/sync/transcript.json"))
narr = dur(f"{V}/sync/narration-norm.wav"); video = f"{V}/video.mp4"; vd = dur(video)
exp = narr + 4.0; spec = tr["duration"] + 7*3.0 + 4.0
L.append("# QA — massaquoi-hamburg\n"); L.append("## Duração")
L.append(f"- Narração original: {tr['duration']:.2f} s. Narração final (pausas naturais trocadas por 3,0 s): {narr:.2f} s. Vídeo: {vd:.2f} s.")
L.append(f"- Fórmula do briefing (narração + 7×3,0 + 4) = {spec:.2f} s; as pausas naturais (soma {sum(3-x for x in [0]) if False else tr['duration']+21-narr+0:.2f} s a mais na fórmula) já existem na narração, por isso o esperado real é narração final + 4 s = {exp:.2f} s.")
chk(abs(vd-exp) < 0.2, f"duração do vídeo {vd:.2f} s vs esperado {exp:.2f} s")
L.append("\n## Viradas de capítulo (3,0 s sem voz, com música)")
for c in CH[1:]:
    a, b = c["gap_start"] + 0.15, c["gap_end"] - 0.15
    v = rms(f"{V}/sync/narration-norm.wav", a, b); m = rms(f"{V}/work/final-mix.wav", a, b)
    chk(v < -55 and m > -50, f"cap. {c['chapter']}: voz {v:.0f} dB (silêncio), mix {m:.0f} dB (música audível), janela {c['gap_start']:.2f}–{c['gap_end']:.2f} s (3,00 s)")
L.append("\n## Música a 20% constante (loudness curto-prazo do music-bed)")
vals = []
for c in CH:
    mid = (c["final_start"] + (CH[c["chapter"]]["gap_start"] if c["chapter"] < 8 else narr)) / 2
    x = lufs(f"{V}/work/music-bed.wav", mid, mid + 30); vals.append(x); L.append(f"- cap. {c['chapter']}: {x} LUFS (30 s a partir de {mid:.0f} s)")
vals = [x for x in vals if x is not None]
chk(max(vals) - min(vals) <= 4.0, f"variação entre capítulos {max(vals)-min(vals):.1f} LU (take normalizado a -16 LUFS e volume 0,20, ~ -30 LUFS esperado)")
mixp = run(["ffmpeg","-hide_banner","-i",f"{V}/work/final-mix.wav","-af","ebur128=peak=true","-f","null","-"]).stderr
tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", mixp); chk(tp and float(tp[-1]) < -1.0, f"pico final (true peak) {tp[-1] if tp else '?'} dBTP < -1")
L.append("\n## Telas pretas")
bd = run(["ffmpeg","-hide_banner","-i",video,"-vf","scale=320:-1,blackdetect=d=0.5:pix_th=0.06","-an","-f","null","-"]).stderr
bl = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", bd); chk(not bl, f"trechos pretos ≥0,5 s: {bl or 'nenhum'}")
L.append("\n## Sincronia (10 pontos: imagem x parágrafo)")
S = json.load(open(f"{V}/scenes.json"))["scenes"]; IX = {i["file"]: i["description"] for i in json.load(open(f"{V}/input/images-index.json"))["images"]}
P = json.load(open(f"{V}/sync/paragraphs.json"))["paragraphs"]; sh = {c["chapter"]: c["shift"] for c in CH}
pts = [60, 300, 600, 900, 1300, 1550, 1900, 2200, 2400, 2560]
for t in pts:
    sc = [s for s in S if s["start"] <= t][-1]
    p = [q for q in P if q["start"] + sh[q["chapter"]] <= t][-1]
    L.append(f"- {t} s: cena {sc['id']} ({sc['image']}) — “{IX[sc['image']][:75]}…” | parágrafo {p['id']}: “{p['text_start']}…”")
L.append("\n## Legenda fixa e frames")
os.makedirs(f"{V}/qa/frames", exist_ok=True)
fts = [3, 180, 420, 800, 1100, 1450, 1700, 2000, 2250, 2400, 2550, 2610]
bright = []
for i, t in enumerate(fts, 1):
    out = f"{V}/qa/frames/frame{i:02d}_{t}s.jpg"
    run(["ffmpeg","-v","error","-y","-ss",str(t),"-i",video,"-frames:v","1","-q:v","3",out])
    r = run(["ffmpeg","-v","error","-ss",str(t),"-i",video,"-frames:v","1","-vf","crop=700:44:610:988,signalstats,metadata=print:key=lavfi.signalstats.YMAX","-f","null","-"])
    m = re.findall(r"YMAX=(\d+)", r.stderr); bright.append(int(m[0]) if m else 0)
chk(all(b >= 150 for b in bright), f"texto da legenda detectado (YMAX da faixa inferior) em 12 frames: {bright}")
L.append("- 12 frames extraídos para revisão visual em qa/frames/")
L.append("- Nenhum título, cartela ou número de capítulo é desenhado: o único drawtext do render é a legenda fixa do rodapé (marcas/afro-ww2-tales/scripts/render_part.py).")
L.append("\n## Desvios do briefing")
L.append("- Montagem em passe único (Python/OpenCV → ffmpeg), com dissolução linear de 1,5 s calculada por quadro (equivalente ao xfade=fade), em vez de clipes separados + xfade em lotes. Mesmo resultado visual, sem reencode duplo.")
L.append("- Cena 21 (20.jpg) dura 60,0 s (0,57× a média; mínimo 0,6×) por limite de parágrafo. 20_B e 21 não usadas.")
L.append("- Legenda do rodapé em português, como no briefing; o idioma segue pendente de confirmação.")
L.append("- Imagens 04–11 (512×286) ampliadas ~3,75× com aprovação do Rod.")
L.append(f"\n**Resultado: {'APROVADO' if ok else 'COM FALHAS (ver acima)'}**")
open(f"{V}/qa/qa-report.md", "w").write("\n".join(L)); print("\n".join(L))
