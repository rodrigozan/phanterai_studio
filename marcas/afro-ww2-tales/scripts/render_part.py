#!/usr/bin/env python3
"""Renderiza um trecho do vídeo (só imagem) em P&B: Ken Burns + dissolução linear de 1,5 s,
acabamento (vinheta, grão, legenda fixa) por ffmpeg. uso: render_part.py <pasta> <img_dir> <parte> <n_partes>"""
import json, subprocess, sys, cv2, numpy as np
V, IMG, part, nparts = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
SC = json.load(open(f"{V}/scenes.json")); S = SC["scenes"]; T = SC["total"]; FPS = 30; XF = SC["transition_s"]
W, H = 1920, 1080; BW, BH = 2688, 1512
CROP = {"04.jpg":.04,"06.jpg":.04,"16.jpg":.04,"20_B.jpg":.04,"22.jpg":.04,"21.jpg":.03,"23.jpg":.03,"24.jpg":.03,"15.jpg":.03}
LEGENDA = "Imagens geradas por IA meramente ilustrativas"
NF = int(round(T * FPS)); per = (NF + nparts - 1) // nparts
f0, f1 = part * per, min(NF, (part + 1) * per)
cache = {}
def load(name):
    if name in cache: return cache[name]
    g = cv2.imread(f"{IMG}/{name}", cv2.IMREAD_GRAYSCALE); h, w = g.shape
    c = CROP.get(name, 0.0)
    if c: g = g[int(h*c):h-int(h*c), int(w*c):w-int(w*c)]
    h, w = g.shape
    # cobrir 16:9
    if w / h > W / H: nw = int(h * W / H); x = (w - nw) // 2; g = g[:, x:x+nw]
    else: nh = int(w * H / W); y = (h - nh) // 2; g = g[y:y+nh, :]
    g = cv2.resize(g, (BW, BH), interpolation=cv2.INTER_CUBIC if g.shape[1] < BW else cv2.INTER_AREA)
    cache[name] = g
    if len(cache) > 4: cache.pop(next(iter(cache)))
    return g
def scene_frame(i, t):
    s = S[i]; end = (S[i+1]["start"] + XF) if i + 1 < len(S) else T
    u = min(1.0, max(0.0, (t - s["start"]) / max(1e-6, end - s["start"])))
    z0, z1 = (1.0, 1.08) if s["motion"] == "zoom-in" else (1.08, 1.0)
    z = z0 + (z1 - z0) * u
    fx = {"left": .42, "right": .58}.get(s["focus"], .5)
    cx = fx * BW; cy = BH / 2
    if s["pan"]:
        amp = 0.04 * BW * (1 if s["pan"] == "right" else -1)
        cx += amp * (u - 0.5)
    cw, ch = BW / z, BH / z
    cx = min(max(cx, cw / 2), BW - cw / 2); cy = min(max(cy, ch / 2), BH - ch / 2)
    sc = W / cw
    M = np.array([[sc, 0, -(cx - cw / 2) * sc], [0, sc, -(cy - ch / 2) * sc]], dtype=np.float32)
    return cv2.warpAffine(load(s["image"]), M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
def idx(t):
    k = 0
    for j, s in enumerate(S):
        if t >= s["start"]: k = j
    return k
vf = ("vignette=angle=PI/7,noise=c0s=5:c0f=t,format=yuv420p,"
      f"drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='{LEGENDA}':fontcolor=white@0.6:fontsize=24:x=(w-text_w)/2:y=h-th-0.04*h")
out = f"{V}/work/parts/part{part}.mp4"
ff = subprocess.Popen(["ffmpeg","-y","-v","error","-f","rawvideo","-pix_fmt","gray","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
    "-vf",vf,"-c:v","libx264","-preset","fast","-crf","20","-threads","2","-g","60","-pix_fmt","yuv420p","-an",out], stdin=subprocess.PIPE)
for n in range(f0, f1):
    t = n / FPS; i = idx(t)
    fr = scene_frame(i, t)
    if i > 0 and t < S[i]["start"] + XF:
        a = (t - S[i]["start"]) / XF
        prev = scene_frame(i - 1, t)
        fr = cv2.addWeighted(prev, 1 - a, fr, a, 0)
    ff.stdin.write(fr.tobytes())
    if n % 600 == 0: print(f"part{part} {n-f0}/{f1-f0}", flush=True)
ff.stdin.close(); ff.wait(); print("part", part, "done", f1 - f0, "frames")
