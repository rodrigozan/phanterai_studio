import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { POSES } from "../theme";
import { Sfx } from "./Sfx";

// A pantera nunca é espelhada (o boné tem lado fixo). A pose "apontando" aponta
// para a esquerda, então o alvo de uma cena com essa pose deve ficar à esquerda dela.
export const Panther = ({ pose = "feliz", left = "50%", top = "62%", width = 520 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!POSES.includes(pose)) {
    throw new Error(`Pose "${pose}" não existe. Opções válidas: ${POSES.join(", ")}`);
  }

  const scale = spring({
    frame,
    fps,
    durationInFrames: 6,
    config: { damping: 12, mass: 0.6 },
  });

  return (
    <>
      <Sfx name="pop" atFrame={0} />
      <Img
        src={staticFile(`pantera/${pose}.png`)}
        style={{
          position: "absolute",
          left,
          top,
          width,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    </>
  );
};
