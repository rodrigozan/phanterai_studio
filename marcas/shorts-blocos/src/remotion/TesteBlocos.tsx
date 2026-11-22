import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { EXPRESSIONS, type ShotT } from "../schema/scenes";
import { BlockCharacter } from "./characters/BlockCharacter";
import { FAMILIA } from "./characters/familia";
import { Camera } from "./camera/Camera";
import { Room, type Setting } from "./scenery/Room";
import { chestCenter, headCenter, SLOTS } from "./layout";

const { fontFamily } = loadFont("normal", { weights: ["900"], subsets: ["latin"] });

export const TESTE_FRAMES = 600;

const IDS = ["leo", "neide", "carlos", "ze"] as const;
const SETTINGS: Setting[] = ["sala", "cozinha", "quarto-leo", "quintal", "estudio-mae", "estadio", "escola", "sala", "quintal", "cozinha"];
const SHOTS: ShotT[] = ["wide", "close", "medium", "close", "wide", "close", "medium", "close", "close", "medium"];
const POSES = ["idle", "wave", "hold", "point", "armsUp", "phone", "facepalm", "crossed", "idle", "hold"] as const;

export const TesteBlocos: React.FC = () => {
  const frame = useCurrentFrame();
  const seg = Math.min(9, Math.floor(frame / 60));
  const start = seg * 60;
  const expression = EXPRESSIONS[seg];
  const shot = SHOTS[seg];
  const xs = SLOTS[4];
  const fi = seg % 4;
  const f = FAMILIA[IDS[fi]];
  const focus = shot === "wide" ? { x: 540, y: 960 } : shot === "close" ? headCenter(xs[fi], f.look) : chestCenter(xs[fi], f.look);
  const punchIns = seg === 3 || seg === 7 ? [start + 30] : [];
  const shakes = seg === 5 ? [start + 20] : [];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Camera frame={frame} start={start} shot={shot} heightScale={f.look.height} focus={focus} pans={[]} punchIns={punchIns} shakes={shakes}>
        <Room setting={SETTINGS[seg]} props={seg === 4 ? ["ringlight", "camera"] : seg === 9 ? ["airfryer", "airfryer", "airfryer"] : []} frame={frame} />
        {IDS.map((id, i) => (
          <BlockCharacter key={id} frame={frame} x={xs[i]} look={FAMILIA[id].look} expression={expression} pose={i === fi ? POSES[seg] : "idle"} talking={i === fi && frame % 60 > 15} seed={id} facing={i < 2 ? 1 : -1} />
        ))}
      </Camera>
      <div style={{ position: "absolute", bottom: 200, width: "100%", textAlign: "center", fontFamily, fontSize: 72, color: "#fff", textShadow: "4px 4px 0 #000" }}>
        {expression.toUpperCase()} · {shot.toUpperCase()} · {SETTINGS[seg].toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};
