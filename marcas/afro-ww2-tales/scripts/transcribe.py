#!/usr/bin/env python3
"""Transcreve a narração (en) com timestamps por palavra.
uso: .venv/bin/python marcas/afro-ww2-tales/scripts/transcribe.py <audio.mp3> <saida.json> [modelo]
Saída: {"duration":s,"words":[{"w","start","end"}],"segments":[{"text","start","end"}]}"""
import json, sys
from faster_whisper import WhisperModel
audio, out = sys.argv[1], sys.argv[2]
size = sys.argv[3] if len(sys.argv) > 3 else "small"
model = WhisperModel(size, device="cpu", compute_type="int8", cpu_threads=4)
segs, info = model.transcribe(audio, language="en", word_timestamps=True, vad_filter=False, beam_size=5, condition_on_previous_text=False)
words, segments = [], []
for s in segs:
    segments.append({"text": s.text.strip(), "start": round(s.start, 3), "end": round(s.end, 3)})
    for w in s.words:
        words.append({"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
    print(f"{s.end:.0f}/{info.duration:.0f}s", flush=True)
json.dump({"duration": info.duration, "model": size, "words": words, "segments": segments}, open(out, "w"), ensure_ascii=False)
print("done", len(words))
