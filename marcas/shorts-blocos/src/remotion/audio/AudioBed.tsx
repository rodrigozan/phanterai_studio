import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import type { Timing } from "../../schema/scenes";
import { TRACKS, trackGain, type MusicPlan, type MusicSegment } from "../../schema/music";

export const MUSIC_BASE = 0.62;
export const DUCK_DB = -10;
const ATTACK = 5;
const RELEASE = 15;

export function duckAt(timing: Timing, f: number) {
  let duck = 0;
  for (const l of timing.lines) {
    if (f < l.startFrame - ATTACK || f > l.endFrame + RELEASE) continue;
    for (const w of l.words) {
      const a = l.startFrame + w.start * timing.fps;
      const b = l.startFrame + w.end * timing.fps;
      if (f < a - ATTACK || f > b + RELEASE) continue;
      const k = interpolate(f, [a - ATTACK, a, b, b + RELEASE], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      duck = Math.max(duck, k);
    }
  }
  return interpolate(duck, [0, 1], [1, Math.pow(10, DUCK_DB / 20)]);
}

function segmentEnvelope(s: MusicSegment, f: number) {
  const len = s.to - s.from;
  const fin = s.fadeIn > 0 ? interpolate(f, [s.from, s.from + s.fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const fout = s.fadeOut > 0 && len > s.fadeOut ? interpolate(f, [s.to - s.fadeOut, s.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return fin * fout;
}

export function musicVolumeAt(timing: Timing, music: MusicPlan, f: number) {
  let v = 0;
  for (const s of music.segments) if (f >= s.from && f < s.to) v += MUSIC_BASE * trackGain(s.track) * segmentEnvelope(s, f);
  return v * duckAt(timing, f);
}

export const AudioBed: React.FC<{ timing: Timing; music: MusicPlan; sfx: { frame: number; file: string }[] }> = ({ timing, music, sfx }) => (
  <>
    {music.segments.map((s, i) => (
      <Sequence key={`music-${i}`} from={s.from} durationInFrames={s.to - s.from} layout="none">
        <Audio
          src={staticFile(`shorts-blocos/music/${TRACKS[s.track].file}`)}
          trimBefore={Math.round(s.offsetSeconds * timing.fps)}
          loop
          volume={(f) => MUSIC_BASE * trackGain(s.track) * segmentEnvelope(s, s.from + f) * duckAt(timing, s.from + f)}
        />
      </Sequence>
    ))}
    {timing.lines.map((l) => (
      <Sequence key={l.id} from={l.startFrame} durationInFrames={l.durationFrames} layout="none">
        <Audio src={staticFile(l.audioFile)} trimBefore={l.trimBeforeFrames} volume={1} />
      </Sequence>
    ))}
    {sfx.map((s, i) => (
      <Sequence key={`sfx-${i}`} from={s.frame} durationInFrames={90} layout="none">
        <Audio src={staticFile(`sfx/${s.file}.mp3`)} volume={0.55} />
      </Sequence>
    ))}
  </>
);
