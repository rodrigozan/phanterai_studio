import { Audio, Sequence, staticFile } from "remotion";
import { SFX } from "../theme";

// Toca um efeito sonoro de public/sfx/<nome>.mp3 a partir do frame local `atFrame`.
// Usado em toda entrada de card, badge, número ou troca de pose da pantera.
export const Sfx = ({ name, atFrame = 0 }) => {
  if (!SFX.includes(name)) {
    throw new Error(
      `SFX "${name}" não existe. Opções válidas: ${SFX.join(", ")}`
    );
  }

  return (
    <Sequence from={atFrame} layout="none">
      <Audio src={staticFile(`sfx/${name}.mp3`)} />
    </Sequence>
  );
};
