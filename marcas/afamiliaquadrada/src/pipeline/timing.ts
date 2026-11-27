import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { normalizeWord, type TimedEvent, type TimedLine, type TimedWord, type Timing } from "../schema/scenes";
import { FPS, HEIGHT, WIDTH } from "../remotion/layout";
import { loadEpisode, paths } from "./paths";
import type { AlignmentFile } from "./tts";

const GAP = 3;
const SCENE_GAP = 6;
const LOOP_TAIL = 2;
const LEAD = 0.03;
const TAIL = 0.08;
const VOICE_LUFS = -20;
const VOICE_PEAK = -1;

function levelVoice(src: string, dst: string) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" });
  const summary = r.stderr.slice(r.stderr.lastIndexOf("Summary:"));
  const lufs = Number(/I:\s+(-?[\d.]+) LUFS/.exec(summary)?.[1]);
  const peak = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(summary)?.[1]);
  if (!Number.isFinite(lufs) || !Number.isFinite(peak)) throw new Error(`não consegui medir o volume de ${src}`);
  const gain = Math.min(VOICE_LUFS - lufs, VOICE_PEAK - peak);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-af", `volume=${gain.toFixed(2)}dB`, "-ar", "44100", "-b:a", "192k", dst]);
  return { lufs, peak, gain };
}

export function probeDuration(file: string) {
  return Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());
}

function words(a: AlignmentFile["alignment"]): Omit<TimedWord, "norm">[] {
  const out: Omit<TimedWord, "norm">[] = [];
  let cur = "";
  let s = 0;
  let e = 0;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      if (cur) out.push({ word: cur, start: s, end: e });
      cur = "";
      return;
    }
    if (!cur) s = a.character_start_times_seconds[i];
    cur += ch;
    if (/[\p{L}\p{N}]/u.test(ch)) e = a.character_end_times_seconds[i];
  });
  if (cur) out.push({ word: cur, start: s, end: e });
  return out.filter((w) => normalizeWord(w.word));
}

export function runTiming(slug: string) {
  const ep = loadEpisode(slug);
  const p = paths(slug);
  const lines: TimedLine[] = [];
  const events: TimedEvent[] = [];
  let cursor = 0;
  let audioSeconds = 0;
  let gapFrames = 0;
  let prevScene = "";

  for (const scene of ep.scenes) {
    for (const line of scene.lines) {
      const js = path.join(p.audio, `${line.id}.json`);
      const mp3 = path.join(p.audio, `${line.id}.mp3`);
      if (!fs.existsSync(js) || !fs.existsSync(mp3)) throw new Error(`áudio da linha ${line.id} não existe; rode o tts`);
      const al = JSON.parse(fs.readFileSync(js, "utf8")) as AlignmentFile;
      const ws = words(al.alignment);
      if (!ws.length) throw new Error(`linha ${line.id} sem palavras no alinhamento`);
      const clip = probeDuration(mp3);
      levelVoice(mp3, path.join(p.audio, `${line.id}.voz.mp3`));
      const t0 = Math.max(0, ws[0].start - LEAD);
      const t1 = Math.min(clip, ws[ws.length - 1].end + TAIL);
      const durationFrames = Math.ceil((t1 - t0) * FPS);
      audioSeconds += durationFrames / FPS;
      if (lines.length) {
        const g = prevScene !== scene.id ? SCENE_GAP : GAP;
        cursor += g;
        gapFrames += g;
      }
      prevScene = scene.id;
      const startFrame = cursor;
      const tw: TimedWord[] = ws.map((w) => ({ word: w.word.replace(/[“”"]/g, ""), norm: normalizeWord(w.word), start: w.start - t0, end: w.end - t0 }));
      const at = (word: string) => {
        const n = normalizeWord(word);
        const w = tw.find((x) => x.norm === n) ?? tw.find((x) => x.norm.startsWith(n));
        if (!w) throw new Error(`linha ${line.id}: palavra "${word}" não achada no áudio (${tw.map((x) => x.norm).join(" ")})`);
        return startFrame + Math.round(w.start * FPS);
      };
      lines.push({
        id: line.id,
        sceneId: scene.id,
        characterId: line.characterId,
        focusCharacterId: line.focusCharacterId ?? line.characterId,
        startFrame,
        endFrame: startFrame + durationFrames,
        audioFile: p.staticAudio(line.id),
        trimBeforeFrames: Math.round(t0 * FPS),
        durationFrames,
        words: tw,
      });
      events.push({ frame: startFrame, lineId: line.id, kind: "lineStart" });
      if (line.cutOnWord) events.push({ frame: at(line.cutOnWord), lineId: line.id, kind: "cutOnWord" });
      for (const b of line.visualBeats) events.push({ frame: at(b.atWord), lineId: line.id, kind: b.type, value: b.value });
      for (const s of line.sfx ?? []) {
        if (!fs.existsSync(path.join(p.ep, "../../../sfx", `${s.file}.mp3`))) throw new Error(`sfx ${s.file}.mp3 não existe em public/sfx`);
        events.push({ frame: at(s.atWord), lineId: line.id, kind: "sfx", value: s.file });
      }
      cursor += durationFrames;
    }
  }
  events.sort((a, b) => a.frame - b.frame);
  const durationInFrames = cursor + LOOP_TAIL;
  const sumLineFrames = lines.reduce((a, l) => a + l.durationFrames, 0);
  const ok = sumLineFrames + gapFrames + LOOP_TAIL === durationInFrames && Math.abs(audioSeconds * FPS - sumLineFrames) < 1;
  const timing: Timing = {
    slug,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    durationInFrames,
    loopTailFrames: LOOP_TAIL,
    lines,
    events,
    check: { sumLineFrames, gapFrames, tailFrames: LOOP_TAIL, total: durationInFrames, audioSeconds: Number(audioSeconds.toFixed(3)), ok },
  };
  if (!ok) throw new Error(`timing inconsistente: ${JSON.stringify(timing.check)}`);
  fs.writeFileSync(p.timing, JSON.stringify(timing, null, 2));
  fs.writeFileSync(p.props, JSON.stringify({ episode: ep, timing }));
  console.log(`timing: ${lines.length} falas, ${events.length} eventos, ${(durationInFrames / FPS).toFixed(2)}s`);
  return timing;
}

if (process.argv[1]?.endsWith("timing.ts")) {
  try {
    runTiming(process.argv[2]);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
