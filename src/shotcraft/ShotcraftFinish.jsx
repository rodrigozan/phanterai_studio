// ShotcraftFinish — camada de acabamento do video-shotcraft sobre o corte da rodada.
// Entrada: o corte pronto (`base`, MP4 já com o estilo da série: ShortScion, Episode, render.mjs...) e o
// `shotcraft-plan.json` gerado por /root/phanterclaw/scripts/shotcraft/finish.mjs. O corte não é refeito:
// a camada só acrescenta os cartões do plano, com a pele da série (looks.js). Cartão desconhecido = erro;
// nada é ignorado em silêncio.
//
// Cartões implementados (fonte: /root/video-shotcraft/references/shots + demos):
//   blur-slide            (typography) — rótulo/kicker: opacidade, y e blur no mesmo p, EASE.out, 4f entre palavras
//   crash-zoom-punch      (camera)     — preparo 6f (-3%), soco 6f ease-in forte, rebote amortecido, devolve com mola
//   shot-transitions      (transition) — flash de exposição de 8f no quadro do impacto (FlashCut da lib)
//   title-demote-to-label (typography) — vinheta de capítulo: título sobe, segura 20f, rebaixa 26f para rótulo;
//                                        fundo opaco da série enquanto o título está no centro (chapter.js)
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, ramp, mix, velocity, SpeedBlur } from "./sc";
import { MOTION, motionSpring } from "./motionSpring";
import { getLook } from "./looks";
import { CHAPTER, assertOpaqueBackdrop, chapterBackdropOpacity } from "./chapter";

export const SHOTCRAFT_CARDS = ["blur-slide", "crash-zoom-punch", "shot-transitions", "title-demote-to-label"];

export const calculateShotcraftMetadata = ({ props }) => {
  if (!props?.base) return { durationInFrames: 30, fps: 30, width: 1080, height: 1920 };
  for (const s of props.shots || []) {
    if (!SHOTCRAFT_CARDS.includes(s.card)) throw new Error(`ShotcraftFinish: cartão "${s.card}" não implementado (${SHOTCRAFT_CARDS.join(", ")})`);
  }
  return { durationInFrames: props.durationInFrames, fps: props.fps, width: props.width, height: props.height };
};

// ---------- crash-zoom-punch: zoom da câmera sobre o corte ----------
const PREP = 6; // 34–40 da demo: preparo
const PUSH = 6; // 40–46: soco de 6f, pico de velocidade no quadro de chegada
const SETTLE = 12; // 46–58: rebote amortecido, uma volta visível
const punchState = (f, p, fps) => {
  const peak = p.peak ?? 1.12;
  const settled = 1 + (peak - 1) * 0.86; // a demo assenta 2.48→2.34 (≈ -6% do ganho); aqui -14% do ganho, porque o ganho é pequeno
  const hold = p.hold ?? 45;
  const t0 = p.at - PREP - PUSH;
  if (f < t0) return { z: 1, shake: 0 };
  if (f < p.at - PUSH) return { z: mix(1, 1, ramp(f, t0, PREP, EASE.smooth)), shake: 0 };
  if (f < p.at) return { z: mix(1, peak, ramp(f, p.at - PUSH, PUSH, EASE.exit)), shake: 0 };
  const t = f - p.at;
  if (t < SETTLE + hold) {
    const wob = Math.exp(-0.2 * t) * Math.cos(2 * Math.PI * 0.07 * t);
    return { z: settled + (peak - settled) * wob, shake: 0 };
  }
  // devolve ao enquadramento original com a mola padrão de UI (apple-design: sem overshoot)
  const s = motionSpring(t - SETTLE - hold, fps, MOTION.ui);
  return { z: mix(settled, 1, s), shake: 0 };
};

const Camera = ({ punches, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zAt = (f) => punches.reduce((acc, p) => acc * punchState(f, p, fps).z, 1);
  const shake = punches.reduce((acc, p) => acc + punchState(frame, p, fps).shake, 0);
  const z = zAt(frame);
  const v = Math.abs(velocity(zAt, frame)); // demo: motion blur só no soco; aqui blur proporcional à velocidade do zoom
  const blur = Math.min(6, v * 90);
  const focus = punches.find((p) => frame >= p.at - PREP - PUSH && frame < p.at + 120)?.focus || [0.5, 0.5];
  return (
    <AbsoluteFill style={{ transform: `translateY(${shake.toFixed(2)}px) scale(${z.toFixed(4)})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`, filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- shot-transitions (flash): curva do FlashCut da lib (0 → 0.85 em 40% → 0) ----------
const Flash = ({ look, dur = 8 }) => {
  const f = useCurrentFrame();
  const o = f < dur * 0.4 ? mix(0, 0.85, f / (dur * 0.4)) : mix(0.85, 0, Math.min(1, (f - dur * 0.4) / (dur * 0.6)));
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: o, background: `radial-gradient(ellipse at 50% 45%, ${look.flash}, transparent 80%)`, mixBlendMode: "screen" }} />;
};

// ---------- blur-slide: kicker ----------
const Words = ({ words, start, step, dur, dy, blur, style, gap }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "baseline", ...style }}>
      {words.map((w, i) => {
        const p = ramp(frame, start + i * step, dur, EASE.out);
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${((1 - p) * dy).toFixed(2)}px)`, filter: p >= 0.999 ? undefined : `blur(${((1 - p) * blur).toFixed(2)}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Kicker = ({ shot, look, W, H }) => {
  const frame = useCurrentFrame();
  const vertical = H > W;
  const size = shot.size ?? (vertical ? 62 : 54);
  const left = shot.left ?? (vertical ? 84 : 120);
  const top = shot.top ?? (vertical ? 250 : 96);
  const rule = ramp(frame, 0, 24, EASE.snappy);
  const out = ramp(frame, shot.dur - 12, 12, EASE.exit);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${(-14 * out).toFixed(2)}px)` }}>
      <div style={{ position: "absolute", left, top }}>
        <div style={{ height: 4, width: 220 * rule, background: look.accentGrad, marginBottom: 18, borderRadius: 2 }} />
        <Words words={String(shot.text).split(/\s+/)} start={4} step={4} dur={22} dy={64 * (size / 170)} blur={18 * (size / 170) + 6} gap="0.28em"
          style={{ ...look.title, fontSize: size, lineHeight: 1.05, textShadow: look.title.textShadow || look.shadow, maxWidth: W - left * 2 }} />
        {shot.sub ? (
          <Words words={String(shot.sub).split(/\s+/)} start={18} step={2.4} dur={20} dy={26 * (size / 170) + 4} blur={9 * (size / 170) + 3} gap="0.5em"
            style={{ ...look.label, fontSize: Math.round(size * 0.42), marginTop: 14, opacity: 0.92, textShadow: look.label.textShadow || look.shadow }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- title-demote-to-label: vinheta de capítulo ----------
const Chapter = ({ shot, look, W, H }) => {
  const frame = useCurrentFrame();
  const vertical = H > W;
  const size = shot.size ?? (vertical ? 92 : 104);
  const slot = { x: vertical ? 64 : 96, y: vertical ? 220 : 64 };
  const LABEL = 0.3;
  const demoteAt = CHAPTER.demoteAt;
  const dAt = (f) => ramp(f, demoteAt, CHAPTER.demoteDur, EASE.swift); // 26f, in-out assimétrico (Polish.EASE.swift)
  const d = dAt(frame);
  const vx = velocity((f) => mix(W / 2, slot.x, dAt(f)), frame);
  const vy = velocity((f) => mix(H / 2 - size, slot.y, dAt(f)), frame);
  const backdrop = chapterBackdropOpacity(frame, d);
  const push = 1 + 0.015 * ramp(frame, 16, 20, EASE.smooth);
  const eyebrow = ramp(frame, CHAPTER.textAt, 8, EASE.out) * (1 - ramp(frame, demoteAt, 6, EASE.out));
  const out = ramp(frame, shot.dur - 12, 12, EASE.exit);
  const num = String(shot.index ?? 1).padStart(2, "0");
  const labelIn = ramp(frame, demoteAt + 20, 10, EASE.out);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <AbsoluteFill style={{ background: look.chapterBackdrop, opacity: backdrop }} />
      <SpeedBlur vx={vx} vy={vy}>
        <div style={{ position: "absolute", left: mix(W / 2, slot.x, d), top: mix(H / 2 - size, slot.y, d), transform: `translateX(${mix(-50, 0, d)}%) scale(${mix(push, LABEL, d).toFixed(4)})`, transformOrigin: "left top", textAlign: d > 0.5 ? "left" : "center", whiteSpace: "nowrap" }}>
          <div style={{ ...look.label, fontSize: Math.round(size * 0.3), opacity: eyebrow, marginBottom: 18, textShadow: look.label.textShadow || look.shadow }}>
            {shot.eyebrow || `Capítulo ${num}`}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.3em" }}>
            <span style={{ ...look.label, fontSize: size * 0.9, opacity: labelIn, color: look.accent, letterSpacing: "0.02em" }}>{num} /</span>
            <Words words={String(shot.text).split(/\s+/)} start={CHAPTER.textAt} step={3} dur={16} dy={size * 0.38} blur={size * 0.1} gap="0.26em"
              style={{ ...look.title, fontSize: size, lineHeight: 1.05, flexWrap: "nowrap", textShadow: look.title.textShadow || look.shadow }} />
          </div>
        </div>
      </SpeedBlur>
    </AbsoluteFill>
  );
};

export const ShotcraftFinish = (props) => {
  const { width: W, height: H } = useVideoConfig();
  if (!props.base) {
    return <AbsoluteFill style={{ background: "#080810", color: "#F8FAFC", alignItems: "center", justifyContent: "center", fontSize: 40 }}>ShotcraftFinish: rode via scripts/shotcraft/finish.mjs</AbsoluteFill>;
  }
  const look = getLook(props.look);
  const shots = props.shots || [];
  if (shots.some((s) => s.card === "title-demote-to-label")) assertOpaqueBackdrop(props.look, look.chapterBackdrop);
  const punches = shots.filter((s) => s.card === "crash-zoom-punch");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Camera punches={punches}>
        <OffthreadVideo src={staticFile(props.base)} />
      </Camera>
      {shots.map((s, i) => {
        if (s.card === "blur-slide") return <Sequence key={i} from={s.at} durationInFrames={s.dur} name={`blur-slide ${s.text}`}><Kicker shot={s} look={look} W={W} H={H} /></Sequence>;
        if (s.card === "title-demote-to-label") return <Sequence key={i} from={s.at} durationInFrames={s.dur} name={`chapter ${s.index}`}><Chapter shot={s} look={look} W={W} H={H} /></Sequence>;
        if (s.card === "shot-transitions") return <Sequence key={i} from={s.at} durationInFrames={s.dur ?? 8} name="flash"><Flash look={look} dur={s.dur ?? 8} /></Sequence>;
        if (s.card === "crash-zoom-punch") return null; // aplicado na Camera
        throw new Error(`ShotcraftFinish: cartão "${s.card}" não implementado`);
      })}
    </AbsoluteFill>
  );
};
