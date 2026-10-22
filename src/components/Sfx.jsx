import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { SFX, SFX_TRECHO, SFX_VARIANTS, SFX_VOLUME } from "../theme";

const FADE_FRAMES = 6;

// Escolhe a variação de forma determinística (nome + frame), reproduzível no render.
export const escolherVariacao = (name, atFrame) => {
  const opcoes = SFX_VARIANTS[name] ?? [`${name}.mp3`];
  const hash = [...`${name}:${atFrame}`].reduce((v, c) => (v * 31 + c.charCodeAt(0)) >>> 0, 7);
  return opcoes[hash % opcoes.length];
};

// Toca um efeito sonoro de public/sfx/<nome>.mp3 a partir do frame local `atFrame`.
// Usado em toda entrada de card, badge, número ou troca de pose da pantera. Toca só o
// trecho definido em SFX_TRECHO (theme.js), para arquivos longos não invadirem a narração.
export const Sfx = ({ name, atFrame = 0, variante }) => {
  const { fps } = useVideoConfig();

  if (!SFX.includes(name)) {
    throw new Error(
      `SFX "${name}" não existe. Opções válidas: ${SFX.join(", ")}`
    );
  }

  const arquivo = variante ?? escolherVariacao(name, atFrame);
  const trecho = SFX_TRECHO[arquivo];
  if (!trecho) {
    throw new Error(`SFX "${arquivo}" sem medição. Rode: node scripts/measure-sfx.js`);
  }
  const duracao = Math.max(2, Math.round(trecho.duracao * fps));
  const fade = Math.min(FADE_FRAMES, Math.floor(duracao / 2));
  const volume = Math.min(1, SFX_VOLUME * trecho.ganho);

  return (
    <Sequence from={atFrame} durationInFrames={duracao} layout="none">
      <Audio
        src={staticFile(`sfx/${arquivo}`)}
        trimBefore={Math.round(trecho.inicio * fps)}
        volume={(f) =>
          volume *
          interpolate(f, [duracao - fade, duracao], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </Sequence>
  );
};
