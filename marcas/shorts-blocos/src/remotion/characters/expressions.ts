import type { ExpressionT, PoseT } from "../../schema/scenes";

export type EyeShape = "open" | "wide" | "narrow" | "happy" | "closed" | "sleepy";
export type MouthShape = "flat" | "smile" | "frown" | "o" | "grin" | "smirk" | "wail" | "laugh" | "wavy";

export type Face = {
  eyes: EyeShape;
  pupilDx: number;
  pupilDy: number;
  browY: number;
  browL: number;
  browR: number;
  mouth: MouthShape;
  tears: boolean;
  blush: boolean;
  sweat: boolean;
};

const base: Face = { eyes: "open", pupilDx: 0, pupilDy: 0, browY: 0, browL: 0, browR: 0, mouth: "flat", tears: false, blush: false, sweat: false };

export const EXPRESSION_FACES: Record<ExpressionT, Face> = {
  neutral: base,
  happy: { ...base, eyes: "happy", browY: -5, browL: -6, browR: 6, mouth: "smile", blush: true },
  laughing: { ...base, eyes: "happy", browY: -9, browL: -12, browR: 12, mouth: "laugh", blush: true },
  angry: { ...base, eyes: "narrow", browY: 4, browL: 22, browR: -22, mouth: "frown" },
  shocked: { ...base, eyes: "wide", browY: -12, browL: -8, browR: 8, mouth: "o" },
  suspicious: { ...base, eyes: "narrow", pupilDx: 5, browL: 14, browR: -10, mouth: "smirk" },
  crying: { ...base, eyes: "closed", browY: -2, browL: -20, browR: 20, mouth: "wail", tears: true },
  "evil-smile": { ...base, eyes: "narrow", pupilDx: -3, browY: 3, browL: 26, browR: -26, mouth: "grin" },
  sleepy: { ...base, eyes: "sleepy", browY: 4, mouth: "flat" },
  embarrassed: { ...base, eyes: "open", pupilDy: 4, pupilDx: -4, browY: -4, browL: -14, browR: 14, mouth: "wavy", blush: true, sweat: true },
};

export type ArmPose = { r: number; l: number; swing: number; selfie?: boolean; crossed?: boolean };

export const POSE_ARMS: Record<PoseT, ArmPose> = {
  idle: { r: 0, l: 0, swing: 3 },
  wave: { r: -150, l: 0, swing: 22 },
  point: { r: -90, l: 0, swing: 2 },
  armsUp: { r: -160, l: 160, swing: 10 },
  facepalm: { r: 131, l: 0, swing: 1 },
  phone: { r: -140, l: 0, swing: 2, selfie: true },
  crossed: { r: 0, l: 0, swing: 0, crossed: true },
  hold: { r: -35, l: 0, swing: 3 },
};
