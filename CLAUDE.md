# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Two things in one repo: a Claude Code **skills library** for Rodrigo's "Aprenda YouTube" (pantera)
channel (`.claude/skills/`), and the **Remotion video project** those skills operate on (`src/`,
`public/`, `scripts/` at the repo root). Yarn is Berry with `nodeLinker: node-modules` (see
`.yarnrc.yml`) — PnP does not work with Remotion's native compositor/Chrome-headless binaries, so
don't remove that override or re-add `.pnp.*`.

Commands:
- `yarn studio` — opens Remotion Studio (`remotion studio src/Root.jsx`) for interactive preview.
- `yarn remotion render src/Root.jsx Episode out/<slug>.mp4 --props=public/episodes/<slug>/props.json`
  — renders an episode; add `--scale=0.5` for a fast preview.
- `.venv/bin/python scripts/transcribe.py public/episodes/<slug>/voz.mp3` — venv created with
  `python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt` (faster-whisper).
- `node scripts/align.js <slug>` — no npm deps, pure Node.

## Skill structure

Each skill is a directory under `.claude/skills/<name>/` with a `SKILL.md` (YAML frontmatter with
`name` + `description`, then Markdown instructions) and, where the task is mechanical enough to not
leave to the model, a small stdlib-only Python 3 CLI script:

- `yt-chapters/chapters.py` — chapters from a timestamped transcript (`.srt`/`.vtt`/whisper `.json`)
- `yt-edit/deadair.py` — edit-decision list (dead air / filler / retakes) from a transcript
- `yt-package/title.py` — lints a title+thumbnail pairing (length truncation, duplication)
- `yt-retention/retention.py` — reads a YouTube Studio retention CSV export, finds drop-off points
- `yt-script/hookscore.py` — scores hook candidates against `hooks.json` (21 hook formulas)
- `yt-viral/swipe.py` — ranks competitor videos by multiple-of-own-channel-median, not raw views

These scripts take file paths or `--json`/flag args, print to stdout, and never touch media files or
call network APIs — they're pure, inspectable transforms the skill instructions call out to. Run any
of them directly with `python3 <script>.py <args>`, e.g. `python3 .claude/skills/yt-script/hookscore.py --hook "one line"`.

`yt-chapters/chapters.py` imports `deadair.py` from the sibling `yt-edit/` directory via a relative
`sys.path.insert` — the two skills share one timestamp-parsing implementation (`load`, `parse_ts`).
Keep that single source of truth if you touch either script; don't fork the parser.

The remaining skills (`yt-audit`, `yt-comment`, `yt-plan`, `yt-seo`, `yt-shorts`) are instructions-only
— no backing script, because the task doesn't reduce to a deterministic check.

## `montagem-video-pantera` pipeline

`.claude/skills/montagem-video-pantera/SKILL.md` is the recipe; the code it drives lives at the
repo root:

- `src/Root.jsx` — Remotion entry point, registers the single `Episode` composition and fetches
  `public/episodes/<slug>/timeline.json` in `calculateMetadata` to size the video (falls back to a
  placeholder frame when `slug` is empty or the timeline doesn't exist yet — don't make this throw).
- `src/Episode.jsx` — walks `timeline.json`'s `scenes[]`, renders each one in a `<Sequence>` using
  the component from `src/templates/index.js` matching `scene.template`, and layers `voz.mp3` +
  optional background music (`MUSIC_VOLUME` in `src/theme.js`, -24dB under the voice).
- `src/templates/*.jsx` — one file per scene template listed in the skill (`titulo-impacto`,
  `checklist-cards`, `contador`, `grafico-barras`, `studio-mockup`, `comparacao`, `lista-numerada`,
  `analogia`, `print`, `gravacao-tela`, `cta`). New template in a roteiro → add the file here *and*
  register it in `templates/index.js`, per the skill's own instruction.
- `src/components/` — shared building blocks (`Stage` background, `Card`, `Badge`, `Title`,
  `Panther`, `Sfx`). `Panther` never mirrors the mascot (fixed cap side) and always pops in with a
  short spring + `pop.mp3` — don't add a `flip` prop.
- `scripts/transcribe.py` — faster-whisper (`medium`, `pt`, word timestamps) → `words.json`.
- `scripts/align.js` — no dependencies. Parses `roteiro.md`'s `### Cxx` blocks against `words.json`
  by normalized approximate matching (never guesses a timestamp — it fails loudly with the scene id
  and excerpt instead) and writes `timeline.json`. **The `roteiro.md` grammar is defined in the
  comment header of this file** (`template:`, `pose:`, `fala:`, `dados.<path>:`, `ao.<palavra>:`) —
  it's not specified anywhere else, so that comment is the source of truth; keep it in sync with the
  parser.
- `public/pantera/`, `public/sfx/`, `public/music/` — binary assets Rod supplies; each has a
  `README.md` listing the exact filenames the components expect (poses, SFX names). Don't invent
  placeholder media here — if a file is missing, the skill's Etapa 1 says to stop and list what's
  missing, and `Episode.jsx`/`Panther`/`Sfx` throw a clear error if a pose/sfx name doesn't exist.
- `public/episodes/<slug>/` — one folder per episode (`roteiro.md`, `voz.mp3`, `props.json`, plus
  the generated `words.json`/`timeline.json`, gitignored). Not created yet for any real episode.

## Editing skills

- Keep each `SKILL.md`'s frontmatter `description` written as a trigger: concrete phrases a user
  would actually type ("plan my week", "why isn't my channel growing"), not a dry feature summary —
  that's what Claude Code's skill router matches against.
- Skill bodies are written in a terse, confident voice (short paragraphs explaining *why* a rule
  exists, e.g. YouTube's chapter-rendering rules or desktop/mobile title-truncation limits) — match
  that tone rather than writing generic instructions.
- Several `SKILL.md` files and scripts are bilingual by content: `montagem-video-pantera` is written
  in Portuguese (Rod's working language for that pipeline), the `yt-*` skills are in English. Keep
  each skill internally consistent in whichever language it already uses.
