#!/usr/bin/env python3
"""captions.srt: texto do roteiro (grafia correta) com tempo das palavras da transcrição, na linha do tempo final.
uso: captions.py <pasta-do-video>"""
import json, re, sys, difflib
V = sys.argv[1]
t = json.load(open(f"{V}/sync/transcript.json"))["words"]
P = json.load(open(f"{V}/sync/paragraphs.json"))["paragraphs"]
TM = {c["chapter"]: c for c in json.load(open(f"{V}/sync/timeline-map.json"))["chapters"]}
txt = open(f"{V}/sync/roteiro.txt", encoding="utf-8-sig").read().split("\n")
paras = []; cur = 0
for l in txt:
    l = l.strip(); m = re.match(r"CHAPTER (\d+)", l)
    if m: cur = int(m.group(1)); continue
    if cur and len(l.split()) >= 8: paras.append(l)
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower().replace("’", "").replace("'", ""))
words = []  # (texto, início, fim) na linha final
for p, text in zip(P, paras):
    sh = TM[p["chapter"]]["shift"]
    tw = t[p["start_idx"]:(p["end_idx"] or len(t) - 1) + 1]
    sw = text.split()
    a = [norm(w["w"]) for w in tw]; b = [norm(w) for w in sw]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    st = [None] * len(sw); en = [None] * len(sw)
    for i, j, n in sm.get_matching_blocks():
        for k in range(n): st[j+k] = tw[i+k]["start"]; en[j+k] = tw[i+k]["end"]
    # interpolar
    known = [k for k in range(len(sw)) if st[k] is not None]
    if not known: continue
    for k in range(len(sw)):
        if st[k] is None:
            lo = max([x for x in known if x < k], default=None); hi = min([x for x in known if x > k], default=None)
            if lo is None: st[k] = en[k] = st[hi]
            elif hi is None: st[k] = en[k] = en[lo]
            else:
                f = (k - lo) / (hi - lo); st[k] = en[k] = en[lo] + (st[hi] - en[lo]) * f
    for k, w in enumerate(sw): words.append((w, st[k] + sh, max(en[k], st[k]) + sh))
cues = []; cur = []
def flush():
    global cur
    if cur: cues.append((cur[0][1], cur[-1][2], " ".join(w[0] for w in cur))); cur = []
for w in words:
    cur.append(w)
    txtlen = len(" ".join(x[0] for x in cur)); dur = cur[-1][2] - cur[0][1]
    end_punct = re.search(r"[.!?]$", w[0]); soft = re.search(r"[,;:]$", w[0])
    if (end_punct and txtlen > 30) or txtlen >= 84 or dur > 6.5 or (soft and txtlen > 60): flush()
flush()
def tc(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}"
def wrap(s):
    if len(s) <= 42: return s
    mid = len(s) // 2; sp = [i for i, c in enumerate(s) if c == " "]
    key = lambda i: abs(i - mid) - (8 if s[i-1] in ".,;:" else 0)
    best = min(sp, key=key); return s[:best] + "\n" + s[best+1:]
out = []
for i, (a, b, s) in enumerate(cues, 1):
    nxt = cues[i][0] if i < len(cues) else b + 1
    b = min(max(b, a + 1.0), nxt - 0.04)
    out.append(f"{i}\n{tc(a)} --> {tc(b)}\n{wrap(s)}\n")
open(f"{V}/captions.srt", "w", encoding="utf-8").write("\n".join(out))
print(len(cues), "cues")
