#!/usr/bin/env python3
"""transcribe.py - transcreve a voz do episódio com tempo por palavra.

    python3 scripts/transcribe.py public/episodes/<slug>/voz.mp3

Usa faster-whisper (modelo "medium", idioma "pt", word_timestamps=True) e grava
words.json na mesma pasta do áudio, no formato que scripts/align.js espera:

    [{ "w": "palavra", "start": 1.23, "end": 1.51 }, ...]
"""
import json
import sys
from pathlib import Path

MODEL_SIZE = "medium"
LANGUAGE = "pt"


def transcribe(audio_path: Path):
    from faster_whisper import WhisperModel

    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(str(audio_path), language=LANGUAGE, word_timestamps=True)

    words = []
    for segment in segments:
        for word in segment.words:
            words.append(
                {"w": word.word.strip(), "start": round(word.start, 3), "end": round(word.end, 3)}
            )
    return words


def main():
    if len(sys.argv) != 2:
        print("uso: python3 transcribe.py <episodes/slug/voz.mp3>", file=sys.stderr)
        sys.exit(1)

    audio_path = Path(sys.argv[1]).resolve()
    if not audio_path.exists():
        print(f"arquivo não encontrado: {audio_path}", file=sys.stderr)
        sys.exit(1)

    words = transcribe(audio_path)

    out_path = audio_path.parent / "words.json"
    out_path.write_text(json.dumps(words, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(words)} palavras -> {out_path}")


if __name__ == "__main__":
    main()
