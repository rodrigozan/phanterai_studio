import React from "react";
import { random } from "remotion";
import type { ExpressionT, ItemT, LookT, PoseT } from "../../schema/scenes";
import { BODY_UNITS, FLOOR_Y, FPS, HEAD, TORSO_UNITS, UNIT } from "../layout";
import { EXPRESSION_FACES, POSE_ARMS, type Face } from "./expressions";

export type FamiliaQuadradaCharacterProps = {
  frame: number;
  x: number;
  look: LookT;
  expression: ExpressionT;
  pose: PoseT;
  item?: ItemT;
  talking: boolean;
  seed: string;
  facing?: 1 | -1;
};

export const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

export function isBlinking(frame: number, seed: string) {
  let t = Math.floor(random(`b0-${seed}`) * 120) + 30;
  let k = 0;
  while (t <= frame) {
    if (frame < t + 7) return true;
    t += Math.floor(FPS * 2 + random(`b-${seed}-${k}`) * FPS * 2);
    k++;
  }
  return false;
}

const INK = "#1b1b24";
const MOUTH = "#3a1620";
const TONGUE = "#e2566b";
const HW = 60;
const TW = 55;
const ARM_W = 34;

const Box: React.FC<{ x: number; y: number; w: number; h: number; fill: string; side?: number; sideFill?: string; top?: number }> = ({ x, y, w, h, fill, side = 0, sideFill, top = 0 }) => (
  <g>
    {top > 0 && <polygon points={`${x},${y} ${x + top},${y - top} ${x + w + top},${y - top} ${x + w},${y}`} fill={shade(fill, 1.15)} />}
    {side > 0 && <polygon points={`${x + w},${y} ${x + w + side},${y - side} ${x + w + side},${y + h - side} ${x + w},${y + h}`} fill={sideFill ?? shade(fill, 0.72)} />}
    <rect x={x} y={y} width={w} height={h} fill={fill} />
  </g>
);

const Eyes: React.FC<{ face: Face; blink: boolean; skin: string }> = ({ face, blink, skin }) => {
  const eye = (cx: number) => {
    if (blink || face.eyes === "closed") return <rect key={cx} x={cx - 11} y={62} width={22} height={4} fill={INK} />;
    if (face.eyes === "happy")
      return (
        <g key={cx}>
          <rect x={cx - 11} y={60} width={6} height={6} fill={INK} />
          <rect x={cx - 5} y={55} width={10} height={6} fill={INK} />
          <rect x={cx + 5} y={60} width={6} height={6} fill={INK} />
        </g>
      );
    if (face.eyes === "sleepy")
      return (
        <g key={cx}>
          <rect x={cx - 10} y={58} width={20} height={16} fill="#ffffff" />
          <rect x={cx - 5} y={64} width={10} height={10} fill={INK} />
          <rect x={cx - 11} y={54} width={22} height={11} fill={skin} />
          <rect x={cx - 11} y={63} width={22} height={4} fill={INK} />
        </g>
      );
    const h = face.eyes === "wide" ? 26 : face.eyes === "narrow" ? 10 : 20;
    const w = face.eyes === "wide" ? 24 : 20;
    const p = face.eyes === "wide" ? 7 : 10;
    const ph = Math.min(h, 12);
    return (
      <g key={cx}>
        <rect x={cx - w / 2} y={64 - h / 2} width={w} height={h} fill="#ffffff" />
        <rect x={cx - p / 2 + face.pupilDx} y={Math.min(64 - ph / 2 + face.pupilDy, 64 + h / 2 - ph)} width={p} height={ph} fill={INK} />
      </g>
    );
  };
  return <>{[-26, 26].map(eye)}</>;
};

const Brows: React.FC<{ face: Face; color: string; thick: number }> = ({ face, color, thick }) => (
  <>
    <rect x={-38} y={42 + face.browY} width={24} height={thick} fill={color} transform={`rotate(${face.browL} -26 ${45 + face.browY})`} />
    <rect x={14} y={42 + face.browY} width={24} height={thick} fill={color} transform={`rotate(${face.browR} 26 ${45 + face.browY})`} />
  </>
);

const Teeth: React.FC<{ x: number; y: number; w: number; gap: boolean }> = ({ x, y, w, gap }) => (
  <g>
    <rect x={x} y={y} width={w} height={6} fill="#ffffff" />
    {gap && <rect x={x + w * 0.62} y={y} width={8} height={6} fill={MOUTH} />}
  </g>
);

const Mouth: React.FC<{ face: Face; open: number; gap: boolean }> = ({ face, open: o, gap }) => {
  switch (face.mouth) {
    case "smile":
      return (
        <g>
          <rect x={-22} y={88} width={6} height={6} fill={MOUTH} />
          <rect x={16} y={88} width={6} height={6} fill={MOUTH} />
          <rect x={-16} y={93} width={32} height={6 + o * 12} fill={MOUTH} />
          {o > 0.3 && <rect x={-10} y={97 + o * 6} width={20} height={4} fill={TONGUE} />}
        </g>
      );
    case "laugh":
      return (
        <g>
          <rect x={-26} y={84} width={52} height={22 + o * 8} fill={MOUTH} />
          <Teeth x={-22} y={86} w={44} gap={gap} />
          <rect x={-14} y={96 + o * 8} width={28} height={8} fill={TONGUE} />
        </g>
      );
    case "grin":
      return (
        <g>
          <rect x={-30} y={86} width={60} height={14 + o * 8} fill={MOUTH} />
          <Teeth x={-26} y={88} w={52} gap={gap} />
          <rect x={-34} y={82} width={6} height={6} fill={MOUTH} />
          <rect x={28} y={82} width={6} height={6} fill={MOUTH} />
        </g>
      );
    case "frown":
      return (
        <g>
          <rect x={-16} y={90 - o * 6} width={32} height={6 + o * 10} fill={MOUTH} />
          <rect x={-22} y={96} width={6} height={6} fill={MOUTH} />
          <rect x={16} y={96} width={6} height={6} fill={MOUTH} />
        </g>
      );
    case "o":
      return <rect x={-10 - o * 3} y={84 - o * 3} width={20 + o * 6} height={22 + o * 6} fill={MOUTH} />;
    case "smirk":
      return (
        <g>
          <rect x={-6} y={92 - o * 4} width={26} height={6 + o * 8} fill={MOUTH} />
          <rect x={20} y={86} width={6} height={6} fill={MOUTH} />
        </g>
      );
    case "wail":
      return (
        <g>
          <rect x={-20} y={86} width={40} height={18 + o * 8} fill={MOUTH} />
          <rect x={-12} y={96 + o * 8} width={24} height={6} fill={TONGUE} />
        </g>
      );
    case "wavy":
      return (
        <g>
          <rect x={-18} y={94 - o * 4} width={9} height={5 + o * 6} fill={MOUTH} />
          <rect x={-9} y={90 - o * 4} width={9} height={5 + o * 6} fill={MOUTH} />
          <rect x={0} y={94 - o * 4} width={9} height={5 + o * 6} fill={MOUTH} />
          <rect x={9} y={90 - o * 4} width={9} height={5 + o * 6} fill={MOUTH} />
        </g>
      );
    default:
      return <rect x={-14} y={93 - o * 6} width={28} height={6 + o * 14} fill={MOUTH} />;
  }
};

const Tears: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {[-26, 26].map((cx) =>
      [0, 1, 2].map((k) => {
        const y = 70 + (((frame * 2.4 + k * 22) % 66) | 0);
        return <rect key={`${cx}-${k}`} x={cx - 4 + (cx > 0 ? 6 : -6)} y={y} width={8} height={12} fill="#5BC0EB" opacity={0.95} />;
      }),
    )}
  </>
);

const Hair: React.FC<{ look: LookT }> = ({ look }) => {
  const c = look.hairColor;
  if (look.hairStyle === "volume")
    return (
      <g>
        <rect x={-68} y={-16} width={136} height={42} fill={c} />
        <polygon points="-68,-16 -58,-26 78,-26 68,-16" fill={shade(c, 1.25)} />
        <rect x={-68} y={26} width={18} height={60} fill={c} />
        <rect x={50} y={26} width={18} height={60} fill={c} />
      </g>
    );
  if (look.hairStyle === "bald-sides")
    return (
      <g>
        <rect x={-HW} y={30} width={12} height={44} fill={c} />
        <rect x={HW - 12} y={30} width={12} height={44} fill={c} />
      </g>
    );
  return (
    <g>
      <rect x={-HW} y={0} width={120} height={26} fill={c} />
      <polygon points={`${-HW},0 ${-HW + 10},-10 ${HW + 10},-10 ${HW},0`} fill={shade(c, 1.15)} />
      <rect x={-HW} y={26} width={14} height={22} fill={c} />
      <rect x={HW - 14} y={26} width={14} height={14} fill={c} />
    </g>
  );
};

const HeadGear: React.FC<{ look: LookT }> = ({ look }) => {
  const out: React.ReactNode[] = [];
  if (look.accessory === "cap") {
    const cap = look.capColor ?? look.shirtColor;
    const brim = look.capBrimColor ?? shade(cap, 0.75);
    out.push(
      <g key="cap">
        <rect x={-62} y={-8} width={124} height={34} fill={cap} />
        <polygon points="-62,-8 -52,-18 72,-18 62,-8" fill={shade(cap, 1.15)} />
        <rect x={-62} y={22} width={150} height={10} fill={brim} />
        <rect x={-10} y={-2} width={20} height={14} fill="#FFFFFF" />
      </g>,
    );
  }
  if (look.accessory === "glasses") {
    const g = look.glassesColor ?? "#1A1A1A";
    out.push(
      <g key="gl" fill="none" stroke={g} strokeWidth={7}>
        <rect x={-44} y={49} width={36} height={30} />
        <rect x={8} y={49} width={36} height={30} />
        <line x1={-8} y1={60} x2={8} y2={60} />
      </g>,
    );
  }
  if (look.accessory === "round-glasses") {
    const g = look.glassesColor ?? "#D4AF37";
    out.push(
      <g key="rg" fill="none" stroke={g} strokeWidth={4}>
        <circle cx={-22} cy={74} r={13} />
        <circle cx={22} cy={74} r={13} />
        <line x1={-9} y1={74} x2={9} y2={74} />
      </g>,
    );
  }
  return <>{out}</>;
};

const Item: React.FC<{ kind: ItemT; x: number; y: number; floorY: number; color?: string }> = ({ kind, x, y, floorY, color }) => {
  switch (kind) {
    case "phone":
      return (
        <g>
          <rect x={x - 26} y={y - 20} width={52} height={86} rx={6} fill="#1d1f2b" />
          <rect x={x - 20} y={y - 12} width={40} height={66} fill={color ?? "#7AD7F0"} />
        </g>
      );
    case "remote":
      return (
        <g>
          <rect x={x - 12} y={y - 18} width={24} height={74} fill={color ?? "#15161c"} />
          <rect x={x - 6} y={y - 10} width={12} height={8} fill="#e0453a" />
          <rect x={x - 6} y={y + 6} width={5} height={5} fill="#6b6f86" />
          <rect x={x + 1} y={y + 6} width={5} height={5} fill="#6b6f86" />
          <rect x={x - 6} y={y + 16} width={5} height={5} fill="#6b6f86" />
          <rect x={x + 1} y={y + 16} width={5} height={5} fill="#6b6f86" />
        </g>
      );
    case "tongs":
      return (
        <g>
          <rect x={x - 10} y={y - 14} width={20} height={26} fill="#2a2a33" />
          <rect x={x - 10} y={y + 10} width={7} height={86} fill={color ?? "#c9ced6"} />
          <rect x={x + 3} y={y + 10} width={7} height={86} fill={color ?? "#c9ced6"} />
        </g>
      );
    case "cane":
      return (
        <g>
          <rect x={x - 7} y={y - 12} width={14} height={floorY - y + 12} fill={color ?? "#8B5A2B"} />
          <rect x={x - 7} y={y - 24} width={40} height={14} fill={color ?? "#8B5A2B"} />
        </g>
      );
    case "paper":
      return (
        <g>
          <rect x={x - 38} y={y - 10} width={76} height={96} fill="#ffffff" stroke="#c9c9c9" strokeWidth={3} />
          <rect x={x - 28} y={y + 4} width={56} height={10} fill="#f2c200" />
          <rect x={x - 28} y={y + 24} width={56} height={5} fill="#9aa0a8" />
          <rect x={x - 28} y={y + 36} width={40} height={5} fill="#9aa0a8" />
          <rect x={x - 28} y={y + 56} width={56} height={14} fill="#e0453a" />
        </g>
      );
    case "airfryer":
      return (
        <g>
          <rect x={x - 46} y={y - 6} width={92} height={104} rx={10} fill={color ?? "#1d1f26"} />
          <rect x={x - 36} y={y + 50} width={72} height={40} rx={6} fill="#2e313b" />
          <rect x={x - 14} y={y + 62} width={28} height={10} fill="#6b6f86" />
          <rect x={x - 22} y={y + 8} width={44} height={20} fill="#3fd18b" />
        </g>
      );
    default:
      return null;
  }
};

export const FamiliaQuadradaCharacter: React.FC<FamiliaQuadradaCharacterProps> = ({ frame, x, look, expression, pose, item, talking, seed, facing = 1 }) => {
  const face = EXPRESSION_FACES[expression];
  const arms = POSE_ARMS[pose];
  const held: ItemT = pose === "phone" ? "phone" : (item ?? look.item ?? "none");
  const blink = face.eyes !== "closed" && face.eyes !== "happy" && isBlinking(frame, seed);
  const phase = random(`ph-${seed}`) * Math.PI * 2;
  const breath = 1 + 0.015 * Math.sin((frame / FPS) * Math.PI * 2 * 0.35 + phase);
  const laughBounce = expression === "laughing" ? -Math.abs(Math.sin(frame * 0.45)) * 6 : 0;
  const bounce = (talking ? -Math.abs(Math.sin(frame * 0.32)) * 5 : 0) + laughBounce;
  const open = talking ? 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.85 + phase)) : expression === "laughing" ? 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.5)) : 0;
  const swing = Math.sin((frame / FPS) * Math.PI * 2 * (pose === "wave" ? 1.6 : 0.5) + phase) * arms.swing;

  const build = look.build ?? "adult";
  const H = BODY_UNITS[build];
  const T0 = HEAD;
  const TH = TORSO_UNITS[build];
  const T1 = T0 + TH;
  const legLen = H - T1;
  const s = UNIT * look.height;
  const skin = look.skinColor;
  const skinSide = look.skinSide ?? shade(skin, 0.75);
  const brow = look.browColor ?? shade(look.hairColor, 0.8);
  const sleeve = look.sleeveless ? skin : look.shirtColor;
  const shoe = look.shoeColor ?? shade(look.pantsColor, 0.45);
  const bw = look.belly ? TW * 1.1 : TW;
  const armLen = TH + 12;
  const handY = T0 + 10 + armLen;

  const arm = (side: 1 | -1) => {
    const rot = side === 1 ? arms.r + (arms.r !== 0 ? swing : swing * 0.4) : arms.l - (arms.l !== 0 ? swing * 0.5 : swing * 0.4);
    const sx = side * (TW + ARM_W / 2 + (look.belly ? 3 : 0));
    const sleeveLen = armLen * 0.55;
    return (
      <g transform={`rotate(${rot} ${sx} ${T0 + 12})`}>
        <Box x={sx - ARM_W / 2} y={T0 + 2} w={ARM_W} h={sleeveLen} fill={sleeve} side={side === 1 ? 9 : 0} sideFill={look.sleeveless ? skinSide : undefined} />
        <Box x={sx - ARM_W / 2} y={T0 + 2 + sleeveLen} w={ARM_W} h={armLen - sleeveLen + 8} fill={skin} side={side === 1 ? 9 : 0} sideFill={skinSide} />
        {side === 1 && held !== "none" && <Item kind={held} x={sx} y={handY} floorY={H} color={look.itemColor} />}
      </g>
    );
  };

  const torso = (
    <g>
      <polygon points={`${-TW},${T0} ${TW},${T0} ${bw},${T1} ${-bw},${T1}`} fill={look.shirtColor} />
      <polygon points={`${TW},${T0} ${TW + 12},${T0 - 12} ${bw + 12},${T1 - 12} ${bw},${T1}`} fill={shade(look.shirtColor, 0.72)} />
      {look.shirtLineColor && (
        <g fill={look.shirtLineColor} opacity={0.85}>
          {[-33, -11, 11, 33].map((lx) => (
            <rect key={`v${lx}`} x={lx - 2} y={T0} width={4} height={TH} />
          ))}
          {[T0 + 30, T0 + 64, T0 + 98, T0 + 132].filter((ly) => ly < T1).map((ly) => (
            <rect key={`h${ly}`} x={-bw} y={ly} width={bw * 2} height={4} />
          ))}
          {[T0 + 14, T0 + 46, T0 + 78, T0 + 110].filter((ly) => ly < T1).map((ly) => (
            <rect key={`b${ly}`} x={-4} y={ly} width={8} height={8} fill="#f1e6d0" />
          ))}
        </g>
      )}
      {look.sleeveless && (
        <g>
          <rect x={-TW + 14} y={T0} width={14} height={14} fill={skin} />
          <rect x={TW - 28} y={T0} width={14} height={14} fill={skin} />
          <rect x={-18} y={T0} width={36} height={16} fill={skin} />
        </g>
      )}
      {look.accessory === "apron" && (
        <g>
          <rect x={-40} y={T0 + 30} width={80} height={TH + 40} fill="#f6f2ea" />
          <rect x={-26} y={T0} width={8} height={32} fill="#f6f2ea" />
          <rect x={18} y={T0} width={8} height={32} fill="#f6f2ea" />
        </g>
      )}
    </g>
  );

  const legs = (
    <g>
      {[-1, 1].map((side) => {
        const lx = side === -1 ? -TW : 0;
        const pantsLen = look.shorts ? legLen * 0.42 : legLen - 18;
        const fill = side === -1 ? look.pantsColor : shade(look.pantsColor, 0.92);
        return (
          <g key={side}>
            <Box x={lx} y={T1} w={TW} h={pantsLen} fill={fill} side={side === 1 ? 10 : 0} />
            {look.shorts && <Box x={lx + 6} y={T1 + pantsLen} w={TW - 12} h={legLen - pantsLen - 18} fill={skin} side={side === 1 ? 8 : 0} sideFill={skinSide} />}
            <rect x={lx + (look.shorts ? 2 : 0)} y={H - 18} width={TW - (look.shorts ? 4 : 0)} height={18} fill={shoe} />
          </g>
        );
      })}
    </g>
  );

  const head = (
    <g>
      <Box x={-HW} y={0} w={HW * 2} h={HEAD} fill={skin} side={14} top={10} sideFill={skinSide} />
      <Hair look={look} />
      {(face.blush || look.blushColor) && (
        <>
          <rect x={-50} y={80} width={16} height={8} fill={look.blushColor ?? "#ff8a9a"} opacity={face.blush ? 0.9 : 0.7} />
          <rect x={34} y={80} width={16} height={8} fill={look.blushColor ?? "#ff8a9a"} opacity={face.blush ? 0.9 : 0.7} />
        </>
      )}
      <Eyes face={face} blink={blink} skin={skin} />
      <Brows face={face} color={brow} thick={look.browColor ? 9 : 7} />
      <Mouth face={face} open={open} gap={look.missingTooth} />
      {look.mustache && <rect x={-28} y={77} width={56} height={11} fill={look.hairColor} />}
      {face.tears && <Tears frame={frame} />}
      {face.sweat && <rect x={44} y={18} width={9} height={16} fill="#5BC0EB" />}
      <HeadGear look={look} />
    </g>
  );

  return (
    <svg
      width={320 * s}
      height={(H + 60) * s}
      viewBox={`-160 -40 320 ${H + 60}`}
      style={{ position: "absolute", left: x - 160 * s, top: FLOOR_Y - H * s - 40 * s, overflow: "visible" }}
    >
      <ellipse cx={0} cy={H - 2} rx={88} ry={12} fill="rgba(0,0,0,0.22)" />
      <g transform={`translate(0 ${bounce}) translate(0 ${H}) scale(${facing} ${breath}) translate(0 ${-H})`}>
        {legs}
        <g transform={look.stoop ? `rotate(5 0 ${T1})` : undefined}>
          {!arms.crossed && arm(-1)}
          {torso}
          {!arms.crossed && arm(1)}
          {arms.crossed && (
            <g>
              <rect x={-bw - 24} y={T0 + 46} width={(bw + 24) * 2} height={40} fill={shade(sleeve, 0.9)} />
              <rect x={-44} y={T0 + 50} width={36} height={32} fill={skin} />
              <rect x={8} y={T0 + 50} width={36} height={32} fill={skin} />
            </g>
          )}
          {head}
        </g>
      </g>
    </svg>
  );
};
