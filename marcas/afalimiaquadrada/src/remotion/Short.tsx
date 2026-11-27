import React, { useMemo } from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import type { EpisodeT, Timing } from "../schema/scenes";
import { BlockCharacter } from "./characters/BlockCharacter";
import { Camera } from "./camera/Camera";
import { Room } from "./scenery/Room";
import { AudioBed } from "./audio/AudioBed";
import { buildMusicPlan } from "../schema/music";
import { activeLineAt, buildPlan, castPositions, charStatesAt, focusPoint, heightOf, isTalking, segmentAt } from "./director";
import { FPS } from "./layout";

const { fontFamily } = loadFont("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });

export type ShortProps = { episode: EpisodeT | null; timing: Timing | null };

const stroke = "0 0 2px #000, 4px 4px 0 #000, -4px 4px 0 #000, 4px -4px 0 #000, -4px -4px 0 #000, 0 8px 0 #000";

const Hook: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", top: 150, left: 60, right: 60, textAlign: "center", fontFamily, fontSize: 84, lineHeight: 1.05, color: "#fff", textShadow: stroke, textTransform: "uppercase" }}>
    <span style={{ background: "#ff3d5a", padding: "6px 22px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", textShadow: "4px 4px 0 #000" }}>{text}</span>
  </div>
);

const DayBadge: React.FC<{ day: number; age: number }> = ({ day, age }) => {
  const k = spring({ frame: age, fps: FPS, config: { damping: 10, stiffness: 220 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${k}) rotate(-4deg)`, background: "#ffd23f", border: "8px solid #000", padding: "8px 40px", fontFamily, fontSize: 96, color: "#000" }}>DIA {day}</div>
    </div>
  );
};

const Captions: React.FC<{ words: { word: string; start: number; end: number }[]; t: number }> = ({ words, t }) => {
  const idx = words.findIndex((w) => t >= w.start - 0.03 && t < (words[words.indexOf(w) + 1]?.start ?? w.end + 0.25));
  if (idx < 0) return null;
  const g = Math.floor(idx / 3) * 3;
  const chunk = words.slice(g, g + 3);
  return (
    <div style={{ position: "absolute", bottom: 330, left: 40, right: 40, textAlign: "center", fontFamily, fontSize: 92, lineHeight: 1.1, textTransform: "uppercase", textShadow: stroke }}>
      {chunk.map((w, i) => (
        <span key={i} style={{ color: g + i === idx ? "#ffd23f" : "#ffffff", margin: "0 12px", display: "inline-block", transform: g + i === idx ? "scale(1.08)" : undefined }}>
          {w.word}
        </span>
      ))}
    </div>
  );
};

const Cta: React.FC<{ word: string; age: number }> = ({ word, age }) => {
  const k = spring({ frame: age, fps: FPS, config: { damping: 11, stiffness: 200 }, durationInFrames: 16 });
  return (
    <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${k})`, background: "#fff", border: "8px solid #000", borderRadius: 28, padding: "14px 36px", fontFamily, fontSize: 70, color: "#000", textAlign: "center" }}>
        COMENTA <span style={{ color: "#ff3d5a" }}>“{word}”</span>
      </div>
    </div>
  );
};

export const Short: React.FC<ShortProps> = ({ episode, timing }) => {
  const real = useCurrentFrame();
  const plan = useMemo(() => (episode && timing ? buildPlan(episode, timing) : null), [episode, timing]);
  const music = useMemo(() => (episode && timing && plan ? buildMusicPlan(episode.scenes, (id) => plan.segments.find((s) => s.sceneId === id)!.start, timing.durationInFrames, timing.fps) : null), [episode, timing, plan]);
  if (!episode || !timing || !plan || !music) return <AbsoluteFill style={{ background: "#222" }} />;

  const tailStart = timing.durationInFrames - timing.loopTailFrames;
  const frame = real >= tailStart ? 0 : real;
  const seg = segmentAt(plan, frame);
  const scene = plan.scenes.get(seg.sceneId)!;
  const cast = castPositions(episode, scene);
  const states = charStatesAt(plan, frame);
  const tl = activeLineAt(timing, frame);
  const activeLine = tl ? plan.lines.get(tl.id)!.line : null;
  const speaking = activeLine && !activeLine.voiceOver ? activeLine.characterId : null;
  const talking = isTalking(tl, frame, FPS);
  const focus = focusPoint(episode, scene, seg.focusId, seg.shot);
  const pans = seg.pans.map((p) => ({ frame: p.frame, to: focusPoint(episode, scene, p.toId, seg.shot) }));
  const sceneStart = plan.segments.find((s) => s.sceneId === scene.id)!.start;
  const firstLine = timing.lines[0];
  const lastLine = timing.lines[timing.lines.length - 1];
  const showHook = frame < firstLine.endFrame;
  const showCta = real < tailStart && frame >= lastLine.startFrame;
  const sfx = timing.events.filter((e) => e.kind === "sfx").map((e) => ({ frame: e.frame, file: e.value! }));

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Camera frame={frame} start={seg.start} shot={seg.shot} heightScale={heightOf(episode, seg.focusId)} focus={focus} pans={pans} punchIns={seg.punchIns} shakes={seg.shakes}>
        <Room setting={scene.setting} props={scene.props} frame={frame} />
        {cast.map((c) => {
          const st = states.get(c.id) ?? { expression: "neutral" as const, pose: "idle" as const };
          return <BlockCharacter key={c.id} frame={frame} x={c.x} look={c.look} expression={st.expression} pose={st.pose} item={st.item} talking={talking && speaking === c.id} seed={c.id} facing={c.facing} />;
        })}
      </Camera>
      {tl && !showHook && <Captions words={tl.words} t={(frame - tl.startFrame) / FPS} />}
      {showHook && <Hook text={episode.hook} />}
      {!showHook && !showCta && scene.day && frame - sceneStart < 90 && <DayBadge day={scene.day} age={frame - sceneStart} />}
      {showCta && <Cta word={episode.ctaComment} age={frame - lastLine.startFrame} />}
      <AudioBed timing={timing} music={music} sfx={sfx} />
    </AbsoluteFill>
  );
};

export const calculateShortMetadata = ({ props }: { props: ShortProps }) => ({
  durationInFrames: props.timing?.durationInFrames ?? 60,
  fps: FPS,
});
