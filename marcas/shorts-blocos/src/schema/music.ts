export const MUSIC_TRACKS = ["tema", "travessura", "escalada", "brasil", "none"] as const;
export const MUSIC_TRANSITIONS = ["crossfade", "cut", "stop"] as const;

export type TrackId = Exclude<(typeof MUSIC_TRACKS)[number], "none">;
export type TrackOrNone = (typeof MUSIC_TRACKS)[number];
export type Transition = (typeof MUSIC_TRANSITIONS)[number];

export const TRACKS: Record<TrackId, { file: string; bpm: number; downbeat: number; lufs: number }> = {
  tema: { file: "nivelado/whistle-and-bounce.mp3", bpm: 115, downbeat: 1.386, lufs: -18.1 },
  travessura: { file: "nivelado/tiptoe-and-trouble.mp3", bpm: 110, downbeat: 0.09, lufs: -17.5 },
  escalada: { file: "nivelado/slapstick-dash.mp3", bpm: 130, downbeat: 0.022, lufs: -18.2 },
  brasil: { file: "nivelado/tamborzao-mischief.mp3", bpm: 125, downbeat: 0.409, lufs: -18.5 },
};

export const TARGET_LUFS = -18;
export const CROSSFADE_FRAMES = 8;
export const MICRO_FADE_FRAMES = 2;
export const TWIST_SILENCE_FRAMES = 30;
export const MAX_TRACKS = 3;

export const barSeconds = (t: TrackId) => (4 * 60) / TRACKS[t].bpm;
export const trackGain = (t: TrackId) => Math.pow(10, (TARGET_LUFS - TRACKS[t].lufs) / 20);

type SceneLike = { id: string; day?: number; music?: { track: TrackOrNone; transition: Transition } };

export type SceneMusic = { sceneId: string; track: TrackOrNone; transition: Transition; explicit: boolean };

export function resolveSceneMusic(scenes: SceneLike[]): SceneMusic[] {
  const out: SceneMusic[] = [];
  let prevTrack: TrackId = "tema";
  let prevDay: number | undefined;
  scenes.forEach((s, i) => {
    const last = i === scenes.length - 1;
    let track: TrackOrNone;
    let transition: Transition = "crossfade";
    if (s.music) {
      track = s.music.track;
      transition = s.music.transition;
    } else if (i === 0 || last) track = "tema";
    else if (s.day === 3 && prevDay !== 3) track = "travessura";
    else if (s.day === 4 && prevDay !== 4) track = prevTrack === "brasil" ? "brasil" : "escalada";
    else track = prevTrack;
    out.push({ sceneId: s.id, track, transition, explicit: !!s.music });
    if (track !== "none") prevTrack = track;
    prevDay = s.day;
  });
  return out;
}

export function musicIssues(scenes: SceneLike[]) {
  const issues: string[] = [];
  const res = resolveSceneMusic(scenes);
  const used = new Set(res.map((r) => r.track).filter((t) => t !== "none"));
  if (used.size > MAX_TRACKS) issues.push(`música: ${used.size} faixas no episódio (máximo ${MAX_TRACKS}): ${[...used].join(", ")}`);
  const nones = res.filter((r) => r.track === "none");
  if (nones.length > 1) issues.push(`música: silêncio em ${nones.length} cenas (${nones.map((n) => n.sceneId).join(", ")}); só a reviravolta pode ter "none"`);
  if (res[0]?.track === "none") issues.push(`música: a primeira cena ${res[0].sceneId} não pode ser "none"`);
  const last = res[res.length - 1];
  if (last && last.track !== "tema") issues.push(`música: a última cena ${last.sceneId} precisa ser "tema" (está "${last.track}")`);
  return issues;
}

export type MusicSegment = { track: TrackId; from: number; to: number; offsetSeconds: number; fadeIn: number; fadeOut: number };
export type MusicPlan = { segments: MusicSegment[]; silence: [number, number] | null; scenes: SceneMusic[] };

export function buildMusicPlan(scenes: SceneLike[], sceneStart: (id: string) => number, durationInFrames: number, fps: number): MusicPlan {
  const res = resolveSceneMusic(scenes);
  const segments: MusicSegment[] = [];
  let silence: [number, number] | null = null;
  let cur: MusicSegment | null = null;
  let lastTrack: TrackId = "tema";

  const close = (at: number, fade: number) => {
    if (!cur) return;
    cur.to = Math.min(durationInFrames, at + (fade === CROSSFADE_FRAMES ? fade : 0));
    cur.fadeOut = fade;
    segments.push(cur);
    cur = null;
  };
  const open = (track: TrackId, at: number, fadeIn: number) => {
    cur = { track, from: at, to: durationInFrames, offsetSeconds: TRACKS[track].downbeat, fadeIn, fadeOut: 0 };
    lastTrack = track;
  };

  res.forEach((r, i) => {
    const at = i === 0 ? 0 : sceneStart(r.sceneId);
    if (r.track === "none") {
      const end = Math.min(durationInFrames, at + TWIST_SILENCE_FRAMES);
      silence = [at, end];
      close(at, MICRO_FADE_FRAMES);
      open(lastTrack, end, MICRO_FADE_FRAMES);
      return;
    }
    if (cur && (cur as MusicSegment).track === r.track) return;
    if (!cur) {
      open(r.track, at, i === 0 ? 0 : MICRO_FADE_FRAMES);
      return;
    }
    const fade = r.transition === "crossfade" ? CROSSFADE_FRAMES : MICRO_FADE_FRAMES;
    close(at, fade);
    open(r.track, at, fade);
  });
  if (cur) {
    (cur as MusicSegment).to = durationInFrames;
    segments.push(cur);
  }

  const first = segments[0];
  const tail = segments[segments.length - 1];
  if (first && tail && first !== tail && first.track === "tema" && tail.track === "tema") {
    const elapsed = (tail.to - tail.from) / fps;
    first.offsetSeconds = TRACKS.tema.downbeat + (elapsed % barSeconds("tema"));
  }
  return { segments, silence, scenes: res };
}
