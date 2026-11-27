export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const UNIT = 1.6;
export const HEAD = 120;
export const FLOOR_Y = 1560;

export type Build = "adult" | "kid";
export const BODY_UNITS: Record<Build, number> = { adult: HEAD * 4, kid: HEAD * 3.5 };
export const TORSO_UNITS: Record<Build, number> = { adult: 150, kid: 130 };

export const CLOSE_FACE_RATIO = 0.45;
export const CLOSE_SCALE = (CLOSE_FACE_RATIO * HEIGHT) / (HEAD * UNIT);
export const MEDIUM_SCALE = 1.8;
export const WIDE_SCALE = 1.0;

export const SHOT_SCALE = { close: CLOSE_SCALE, medium: MEDIUM_SCALE, wide: WIDE_SCALE } as const;
export const SHOT_ANCHOR_Y = { close: 0.56, medium: 0.56, wide: 0.5 } as const;

export const SLOTS: Record<number, number[]> = {
  1: [540],
  2: [330, 750],
  3: [230, 540, 850],
  4: [160, 413, 667, 920],
};

type Sized = { height: number; build?: Build };

const units = (l: Sized) => BODY_UNITS[l.build ?? "adult"];

export function headCenter(x: number, l: Sized) {
  const h = units(l) * UNIT * l.height;
  const head = HEAD * UNIT * l.height;
  return { x, y: FLOOR_Y - h + head / 2 };
}

export function chestCenter(x: number, l: Sized) {
  const h = units(l) * UNIT * l.height;
  return { x, y: FLOOR_Y - h * 0.64 };
}

export function faceRatioAtClose(heightScale: number) {
  return (HEAD * UNIT * heightScale * CLOSE_SCALE) / HEIGHT;
}
