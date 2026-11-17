#!/usr/bin/env python3
"""Monta work/music-bed.wav (20%) na linha do tempo final. uso: music_bed.py <pasta-do-video>"""
import json, subprocess, sys, os
V = sys.argv[1]
TM = json.load(open(f"{V}/sync/timeline-map.json"))
P = json.load(open(f"{V}/sync/paragraphs.json"))["paragraphs"]
ch = {c["chapter"]: c for c in TM["chapters"]}
def dur(f): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]))
N = dur(f"{V}/sync/narration-norm.wav"); T = N + 4.0
G = {c: ch[c]["gap_start"] for c in range(2, 9)}
shift = lambda c: ch[c]["shift"]
Pk = P[50]["start"] + shift(6)   # parágrafo 51 (cap 6)
Qk = P[69]["start"] + shift(8)   # parágrafo 70 (cap 8)
Q = lambda n: f"{V}/work/musics-norm/{n}.wav"
tracks = {
 "Quiet": ["The Quiet Before (Modern Take)", "The Quiet Before (Retro Take)"],
 "Ordinary": ["Ordinary Streets, Changing Flags (Modern Take)", "Ordinary Streets, Changing Flags (Vintage Take)"],
 "Door": [f"The Door Closes (Take {i})" for i in (1,2)],
 "Paper": [f"Paper Walls (Take {i})" for i in (1,2)],
 "Whispers": [f"Whispers in the Stairwell (Take {i})" for i in (1,2)],
 "Night": [f"Night of Fire (Take {i})" for i in (1,2)],
 "Ashes": [f"Ashes at Dawn (Take {i})" for i in (1,2)],
 "Flag": [f"The Last Flag Falls (Take {i})" for i in (1,2)],
 "Road": [f"Long Road Home (Take {i})" for i in (1,2)],
 "Witness": [f"Witness (Take {i})" for i in (1,2,3)],
}
# (nome, faixa, início, fim, fade_in, fade_out, início_fade_out_relativo)
S = [
 ("s01","Quiet",0.0,G[2]+2,0,2),
 ("s02","Ordinary",G[2]+1,G[3]+2,2,2),
 ("s03","Door",G[3]+1,G[4]+2,2,2),
 ("s04","Paper",G[4]+1,G[5]+2,2,2),
 ("s05","Whispers",G[5]+1,G[6]+2,2,2),
 ("s06a","Night",G[6]+1,Pk+2,2,4),
 ("s06b","Ashes",Pk-2,G[7]+2,4,2),
 ("s07","Flag",G[7]+1,G[8]+2,2,2),
 ("s08a","Road",G[8]+1,Qk+2,2,4),
 ("s08b","Witness",Qk-2,T,4,4),
]
XF = 4.0
credits = []
for name, tr, a, b, fi, fo in S:
    D = b - a
    names = tracks[tr]; seq = []; tot = 0.0; i = 0
    while True:
        n = names[i % len(names)]; seq.append(n); d = dur(Q(n))
        tot += d - (XF if len(seq) > 1 else 0); i += 1
        if tot >= D + 0.5: break
    ins = []; fc = []
    for k, n in enumerate(seq): ins += ["-i", Q(n)]
    last = "[0:a]"
    for k in range(1, len(seq)):
        fc.append(f"{last}[{k}:a]acrossfade=d={XF}:c1=tri:c2=tri[x{k}]"); last = f"[x{k}]"
    chain = f"{last}atrim=0:{D:.4f},asetpts=PTS-STARTPTS"
    if fi: chain += f",afade=t=in:st=0:d={fi}:curve=qsin"
    chain += f",afade=t=out:st={D-fo:.4f}:d={fo}:curve=qsin,volume=0.20[o]"
    fc.append(chain)
    out = f"{V}/work/sections/{name}.wav"
    subprocess.check_call(["ffmpeg","-y","-v","error"]+ins+["-filter_complex",";".join(fc),"-map","[o]","-c:a","pcm_s16le",out])
    credits.append({"section":name,"track":tr,"takes":seq,"start":round(a,3),"end":round(b,3),"fade_in":fi,"fade_out":fo})
    print(name, round(a,2), round(b,2), len(seq), "takes", flush=True)
ins = []; fc = []; lab = ""
for k, (name, tr, a, b, fi, fo) in enumerate(S):
    ins += ["-i", f"{V}/work/sections/{name}.wav"]
    ms = int(round(a * 1000))
    fc.append(f"[{k}:a]adelay={ms}|{ms}[d{k}]"); lab += f"[d{k}]"
fc.append(f"{lab}amix=inputs={len(S)}:normalize=0:duration=longest,apad=whole_dur={T:.4f},atrim=0:{T:.4f}[m]")
subprocess.check_call(["ffmpeg","-y","-v","error"]+ins+["-filter_complex",";".join(fc),"-map","[m]","-c:a","pcm_s16le",f"{V}/work/music-bed.wav"])
json.dump({"narration_end":N,"total":T,"sections":credits}, open(f"{V}/work/music-sections.json","w"), indent=1)
print("music-bed ok", T)
