import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { SFX, SFX_TRECHO } from "../theme";

const FADE_FRAMES = 6;

// Toca um efeito sonoro de public/sfx/<nome>.mp3 a partir do frame local `atFrame`.
// Usado em toda entrada de card, badge, número ou troca de pose da pantera. Toca só o
// trecho definido em SFX_TRECHO (theme.js), para arquivos longos não invadirem a narração.
export const Sfx = ({ name, atFrame = 0 }) => {
  const { fps } = useVideoConfig();

  if (!SFX.includes(name)) {
    throw new Error(
      `SFX "${name}" não existe. Opções válidas: ${SFX.join(", ")}`
    );
  }

  const trecho = SFX_TRECHO[name] ?? { inicio: 0, duracao: 1, volume: 1 };
  const duracao = Math.round(trecho.duracao * fps);

  return (
    <Sequence from={atFrame} durationInFrames={duracao} layout="none">
      <Audio
        src={staticFile(`sfx/${name}.mp3`)}
        trimBefore={Math.round(trecho.inicio * fps)}
        volume={(f) =>
          (trecho.volume ?? 1) *
          interpolate(f, [duracao - FADE_FRAMES, duracao], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </Sequence>
  );
};
