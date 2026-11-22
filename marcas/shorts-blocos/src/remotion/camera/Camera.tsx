import React from "react";
import { interpolate, random, spring } from "remotion";
import type { ShotT } from "../../schema/scenes";
import { FPS, HEIGHT, SHOT_ANCHOR_Y, SHOT_SCALE, WIDTH } from "../layout";

export type Point = { x: number; y: number };

export type CameraProps = {
  frame: number;
  start: number;
  shot: ShotT;
  heightScale: number;
  focus: Point;
  pans: { frame: number; to: Point }[];
  punchIns: number[];
  shakes: number[];
  children: React.ReactNode;
};

export function cameraTransform({ frame, start, shot, heightScale, focus, pans, punchIns, shakes }: Omit<CameraProps, "children">) {
  let f = focus;
  for (const p of pans) {
    if (frame < p.frame) break;
    const k = spring({ frame: frame - p.frame, fps: FPS, config: { damping: 20, stiffness: 140, mass: 0.8 }, durationInFrames: 18 });
    f = { x: interpolate(k, [0, 1], [f.x, p.to.x]), y: interpolate(k, [0, 1], [f.y, p.to.y]) };
  }
  let zoom = 1;
  for (const p of punchIns) {
    if (frame < p) continue;
    const k = spring({ frame: frame - p, fps: FPS, config: { damping: 14, stiffness: 260 }, durationInFrames: 5 });
    zoom *= 1 + 0.12 * k;
  }
  let sx = 0;
  let sy = 0;
  for (const s of shakes) {
    const t = frame - s;
    if (t < 0 || t > 18) continue;
    const amp = 26 * (1 - t / 18);
    sx += (random(`sx-${s}-${t}`) - 0.5) * 2 * amp;
    sy += (random(`sy-${s}-${t}`) - 0.5) * 2 * amp;
  }
  const settle = shot === "wide" ? 1 : interpolate(frame - start, [0, 40], [1.03, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const base = shot === "close" ? SHOT_SCALE.close / heightScale : SHOT_SCALE[shot];
  const scale = base * zoom * settle;
  const ax = WIDTH / 2;
  const ay = HEIGHT * SHOT_ANCHOR_Y[shot];
  return { scale, tx: ax - f.x * scale + sx, ty: ay - f.y * scale + sy };
}

export const Camera: React.FC<CameraProps> = ({ children, ...p }) => {
  const { scale, tx, ty } = cameraTransform(p);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
};
