import type { EpisodeT, ExpressionT, ItemT, LineT, PoseT, SceneT, ShotT, Timing, TimedLine } from "../schema/scenes";
import { SLOTS, chestCenter, headCenter, WIDTH } from "./layout";
import type { Point } from "./camera/Camera";

export type Segment = {
  start: number;
  end: number;
  shot: ShotT;
  focusId: string;
  sceneId: string;
  lineId: string;
  pans: { frame: number; toId: string }[];
  punchIns: number[];
  shakes: number[];
};

export type CharState = { expression: ExpressionT; pose: PoseT; item?: ItemT };

export type Plan = {
  segments: Segment[];
  scenes: Map<string, SceneT>;
  lines: Map<string, { line: LineT; scene: SceneT }>;
  stateChanges: { frame: number; charId: string; expression?: ExpressionT; pose?: PoseT; item?: ItemT }[];
};

const otherShot = (s: ShotT): ShotT => (s === "close" ? "medium" : "close");

export function buildPlan(ep: EpisodeT, timing: Timing): Plan {
  const scenes = new Map(ep.scenes.map((s) => [s.id, s]));
  const lines = new Map<string, { line: LineT; scene: SceneT }>();
  for (const s of ep.scenes) for (const l of s.lines) lines.set(l.id, { line: l, scene: s });
  const segments: Segment[] = [];
  const stateChanges: Plan["stateChanges"] = [];
  const evs = [...timing.events].sort((a, b) => a.frame - b.frame);

  timing.lines.forEach((tl: TimedLine, i) => {
    const { line, scene } = lines.get(tl.id)!;
    const focusId = line.focusCharacterId ?? line.characterId;
    const lineEvs = evs.filter((e) => e.lineId === tl.id);
    const cutEv = lineEvs.find((e) => e.kind === "cutOnWord");
    const start = i === 0 ? 0 : cutEv ? cutEv.frame : tl.startFrame;
    let cur: Segment = { start, end: start, shot: line.shot, focusId, sceneId: scene.id, lineId: tl.id, pans: [], punchIns: [], shakes: [] };
    segments.push(cur);
    stateChanges.push({ frame: start, charId: focusId, expression: line.expression, pose: line.pose ?? "idle", item: line.item });
    for (const e of lineEvs) {
      if (e.kind === "cut") {
        const shot = (e.value as ShotT) || otherShot(cur.shot);
        const lastPan = cur.pans[cur.pans.length - 1];
        cur = { ...cur, start: e.frame, shot, focusId: lastPan ? lastPan.toId : cur.focusId, pans: [], punchIns: [], shakes: [] };
        segments.push(cur);
      } else if (e.kind === "pan" && e.value) cur.pans.push({ frame: e.frame, toId: e.value });
      else if (e.kind === "punchIn") cur.punchIns.push(e.frame);
      else if (e.kind === "shake") cur.shakes.push(e.frame);
      else if (e.kind === "expression" && e.value) {
        const [a, b] = e.value.includes(":") ? e.value.split(":") : [focusId, e.value];
        stateChanges.push({ frame: e.frame, charId: a, expression: b as ExpressionT });
      }
    }
  });
  segments.sort((a, b) => a.start - b.start);
  for (let i = 0; i < segments.length; i++) segments[i].end = i + 1 < segments.length ? segments[i + 1].start : timing.durationInFrames;
  stateChanges.sort((a, b) => a.frame - b.frame);
  return { segments, scenes, lines, stateChanges };
}

export function segmentAt(plan: Plan, frame: number) {
  let s = plan.segments[0];
  for (const x of plan.segments) {
    if (x.start <= frame) s = x;
    else break;
  }
  return s;
}

export function charStatesAt(plan: Plan, frame: number) {
  const m = new Map<string, CharState>();
  for (const c of plan.stateChanges) {
    if (c.frame > frame) break;
    const prev: CharState = m.get(c.charId) ?? { expression: "neutral", pose: "idle" };
    m.set(c.charId, { expression: c.expression ?? prev.expression, pose: c.pose ?? prev.pose, item: c.pose ? c.item : (c.item ?? prev.item) });
  }
  return m;
}

export function castPositions(ep: EpisodeT, scene: SceneT) {
  const slots = SLOTS[Math.min(scene.cast.length, 4)];
  return scene.cast.slice(0, 4).map((id, i) => {
    const c = ep.characters.find((x) => x.id === id)!;
    return { id, x: slots[i], look: c.look!, facing: (slots[i] < WIDTH / 2 ? 1 : -1) as 1 | -1 };
  });
}

export function focusPoint(ep: EpisodeT, scene: SceneT, id: string, shot: ShotT): Point {
  if (shot === "wide") return { x: WIDTH / 2, y: 960 };
  const p = castPositions(ep, scene).find((c) => c.id === id) ?? castPositions(ep, scene)[0];
  return shot === "close" ? headCenter(p.x, p.look) : chestCenter(p.x, p.look);
}

export function heightOf(ep: EpisodeT, id: string) {
  return ep.characters.find((c) => c.id === id)?.look?.height ?? 1;
}

export function activeLineAt(timing: Timing, frame: number) {
  return timing.lines.find((l) => frame >= l.startFrame && frame < l.endFrame);
}

export function isTalking(tl: TimedLine | undefined, frame: number, fps: number) {
  if (!tl) return false;
  const t = (frame - tl.startFrame) / fps;
  return tl.words.some((w) => t >= w.start - 0.02 && t <= w.end + 0.02);
}
