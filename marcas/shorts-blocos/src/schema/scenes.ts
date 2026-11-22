import { z } from "zod";
import { MUSIC_TRACKS, MUSIC_TRANSITIONS, musicIssues } from "./music";

export const EXPRESSIONS = ["neutral", "happy", "laughing", "angry", "shocked", "suspicious", "crying", "evil-smile", "sleepy", "embarrassed"] as const;
export const SHOTS = ["close", "medium", "wide"] as const;
export const POSES = ["idle", "wave", "point", "armsUp", "facepalm", "phone", "crossed", "hold"] as const;
export const ACCESSORIES = ["none", "glasses", "round-glasses", "apron", "cap"] as const;
export const ITEMS = ["none", "phone", "remote", "tongs", "cane", "paper", "airfryer"] as const;
export const SETTINGS = ["sala", "cozinha", "quarto", "quarto-leo", "escola", "quintal", "estudio-mae", "estadio"] as const;
export const PROPS = ["ringlight", "camera", "plantas", "caixas", "airfryer"] as const;
export const BEAT_TYPES = ["punchIn", "shake", "cut", "expression", "pan"] as const;

export const Expression = z.enum(EXPRESSIONS);
export const Shot = z.enum(SHOTS);
export const Pose = z.enum(POSES);

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const Look = z.object({
  skinColor: hex,
  shirtColor: hex,
  pantsColor: hex,
  hairColor: hex,
  accessory: z.enum(ACCESSORIES).default("none"),
  height: z.number().min(0.6).max(1.2).default(1),
  build: z.enum(["adult", "kid"]).default("adult"),
  skinSide: hex.optional(),
  shoeColor: hex.optional(),
  browColor: hex.optional(),
  hairStyle: z.enum(["short", "volume", "bald-sides"]).default("short"),
  capColor: hex.optional(),
  capBrimColor: hex.optional(),
  mustache: z.boolean().default(false),
  belly: z.boolean().default(false),
  sleeveless: z.boolean().default(false),
  shorts: z.boolean().default(false),
  stoop: z.boolean().default(false),
  missingTooth: z.boolean().default(false),
  blushColor: hex.optional(),
  shirtLineColor: hex.optional(),
  glassesColor: hex.optional(),
  item: z.enum(ITEMS).default("none"),
  itemColor: hex.optional(),
});

export const Character = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  voiceId: z.string().min(1),
  narrator: z.boolean().default(false),
  look: Look.optional(),
});

export const VisualBeat = z.object({
  atWord: z.string().min(1),
  type: z.enum(BEAT_TYPES),
  value: z.string().optional(),
});

export const Sfx = z.object({
  atWord: z.string().min(1),
  file: z.string().min(1),
});

export const Line = z.object({
  id: z.string().min(1),
  characterId: z.string().min(1),
  focusCharacterId: z.string().optional(),
  text: z.string().min(1),
  expression: Expression,
  pose: Pose.optional(),
  item: z.enum(ITEMS).optional(),
  voiceOver: z.boolean().default(false),
  shot: Shot,
  cutOnWord: z.string().optional(),
  caption: z.string().optional(),
  visualBeats: z.array(VisualBeat).default([]),
  sfx: z.array(Sfx).optional(),
});

export const Scene = z.object({
  id: z.string().min(1),
  day: z.number().int().min(1).max(9).optional(),
  setting: z.enum(SETTINGS),
  props: z.array(z.enum(PROPS)).default([]),
  cast: z.array(z.string()).min(1),
  lines: z.array(Line).min(1),
  music: z.object({ track: z.enum(MUSIC_TRACKS), transition: z.enum(MUSIC_TRANSITIONS).default("crossfade") }).optional(),
});

export const Episode = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    hook: z.string().min(1),
    characters: z.array(Character).min(1),
    scenes: z.array(Scene).min(1),
    loop: z.object({ lastSceneId: z.string(), firstSceneId: z.string() }),
    ctaComment: z.string().regex(/^\S+$/, "ctaComment precisa ser uma palavra só"),
  })
  .superRefine((ep, ctx) => {
    const chars = new Map(ep.characters.map((c) => [c.id, c]));
    const sceneIds = new Set(ep.scenes.map((s) => s.id));
    if (!sceneIds.has(ep.loop.firstSceneId)) ctx.addIssue({ code: "custom", message: `loop.firstSceneId ${ep.loop.firstSceneId} não existe` });
    if (!sceneIds.has(ep.loop.lastSceneId)) ctx.addIssue({ code: "custom", message: `loop.lastSceneId ${ep.loop.lastSceneId} não existe` });
    if (ep.scenes[0].id !== ep.loop.firstSceneId) ctx.addIssue({ code: "custom", message: "loop.firstSceneId precisa ser a primeira cena" });
    if (ep.scenes[ep.scenes.length - 1].id !== ep.loop.lastSceneId) ctx.addIssue({ code: "custom", message: "loop.lastSceneId precisa ser a última cena" });
    for (const m of musicIssues(ep.scenes)) ctx.addIssue({ code: "custom", message: m });
    const lineIds = new Set<string>();
    for (const scene of ep.scenes) {
      for (const id of scene.cast) {
        const c = chars.get(id);
        if (!c) ctx.addIssue({ code: "custom", message: `cena ${scene.id}: cast ${id} não existe` });
        else if (!c.look) ctx.addIssue({ code: "custom", message: `cena ${scene.id}: ${id} não tem look e não pode aparecer` });
      }
      for (const line of scene.lines) {
        if (lineIds.has(line.id)) ctx.addIssue({ code: "custom", message: `linha ${line.id} duplicada` });
        lineIds.add(line.id);
        const c = chars.get(line.characterId);
        if (!c) {
          ctx.addIssue({ code: "custom", message: `linha ${line.id}: personagem ${line.characterId} não existe` });
          continue;
        }
        const focus = line.focusCharacterId ?? line.characterId;
        if (!scene.cast.includes(focus)) ctx.addIssue({ code: "custom", message: `linha ${line.id}: foco ${focus} não está no cast da cena ${scene.id}` });
        const words = tokenize(line.text);
        const refs = [line.cutOnWord, ...line.visualBeats.map((b) => b.atWord), ...(line.sfx ?? []).map((s) => s.atWord)].filter(Boolean) as string[];
        for (const w of refs) {
          if (!words.some((x) => x === normalizeWord(w))) ctx.addIssue({ code: "custom", message: `linha ${line.id}: palavra "${w}" não está no texto` });
        }
        for (const b of line.visualBeats) {
          if (b.type === "cut" && b.value && !SHOTS.includes(b.value as never)) ctx.addIssue({ code: "custom", message: `linha ${line.id}: cut com plano inválido ${b.value}` });
          if (b.type === "expression") {
            const expr = b.value?.includes(":") ? b.value.split(":")[1] : b.value;
            if (!expr || !EXPRESSIONS.includes(expr as never)) ctx.addIssue({ code: "custom", message: `linha ${line.id}: expressão inválida ${b.value}` });
          }
          if (b.type === "pan" && b.value && !scene.cast.includes(b.value)) ctx.addIssue({ code: "custom", message: `linha ${line.id}: pan para ${b.value} fora do cast` });
        }
        if (/inscrev|se inscreva|ativa o sininho|ative o sino/i.test(line.text) && !isLastLine(ep, line.id)) {
          ctx.addIssue({ code: "custom", message: `linha ${line.id}: pedido de inscrição no meio do vídeo é proibido` });
        }
      }
    }
  });

function isLastLine(ep: { scenes: { lines: { id: string }[] }[] }, id: string) {
  const last = ep.scenes[ep.scenes.length - 1].lines;
  return last[last.length - 1].id === id;
}

export function normalizeWord(w: string) {
  return w
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function tokenize(text: string) {
  return text.split(/\s+/).map(normalizeWord).filter(Boolean);
}

export type EpisodeT = z.infer<typeof Episode>;
export type SceneT = z.infer<typeof Scene>;
export type LineT = z.infer<typeof Line>;
export type CharacterT = z.infer<typeof Character>;
export type LookT = z.infer<typeof Look>;
export type ExpressionT = z.infer<typeof Expression>;
export type ShotT = z.infer<typeof Shot>;
export type PoseT = z.infer<typeof Pose>;
export type ItemT = (typeof ITEMS)[number];

export type TimedWord = { word: string; norm: string; start: number; end: number };
export type TimedLine = {
  id: string;
  sceneId: string;
  characterId: string;
  focusCharacterId: string;
  startFrame: number;
  endFrame: number;
  audioFile: string;
  trimBeforeFrames: number;
  durationFrames: number;
  words: TimedWord[];
};
export type TimedEvent = {
  frame: number;
  lineId: string;
  kind: "lineStart" | "cutOnWord" | "punchIn" | "shake" | "cut" | "expression" | "pan" | "sfx";
  value?: string;
};
export type Timing = {
  slug: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  loopTailFrames: number;
  lines: TimedLine[];
  events: TimedEvent[];
  check: { sumLineFrames: number; gapFrames: number; tailFrames: number; total: number; audioSeconds: number; ok: boolean };
};
