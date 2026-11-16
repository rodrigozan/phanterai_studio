import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sfx } from "./components/Sfx";
import { SFX, SFX_TRECHO, SFX_VARIANTS, SFX_VOLUME, colors, fonts } from "./theme";

// Vídeo de teste dos SFX: toca as 30 opções (6 famílias x 5), uma por vez, 2 s cada, sem voz
// nem música. Roteiro de validação em docs/roteiro-teste-sfx.md.
export const SLOT_SEGUNDOS = 2;
const ATRASO_FRAMES = 6;

const FILA = SFX.flatMap((familia) =>
  SFX_VARIANTS[familia].map((arquivo, i) => ({ familia, arquivo, opcao: i + 1 }))
);

export const TESTE_SFX_FRAMES = FILA.length * SLOT_SEGUNDOS * 30;

export const TesteSfx = () => {
  const frame = useCurrentFrame();
  const slot = SLOT_SEGUNDOS * 30;
  const atual = Math.min(FILA.length - 1, Math.floor(frame / slot));
  const item = FILA[atual];
  const trecho = SFX_TRECHO[item.arquivo];
  const local = frame - atual * slot;
  const pulso = interpolate(local, [ATRASO_FRAMES, ATRASO_FRAMES + 4, ATRASO_FRAMES + 18], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle, ${colors.bgInner}, ${colors.bgOuter})`,
        color: colors.text,
        fontFamily: fonts.family,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {FILA.map((f, i) => (
        <Sfx key={f.arquivo} name={f.familia} variante={f.arquivo} atFrame={i * slot + ATRASO_FRAMES} />
      ))}
      <div style={{ fontSize: 44, color: colors.violetLight, letterSpacing: 6 }}>
        TESTE DE SFX · {atual + 1}/{FILA.length}
      </div>
      <div
        style={{
          fontSize: 190,
          fontWeight: 900,
          textTransform: "uppercase",
          color: colors.gold,
          transform: `scale(${0.9 + pulso * 0.15})`,
        }}
      >
        {item.familia}
      </div>
      <div style={{ fontSize: 64 }}>
        opção {item.opcao} de {SFX_VARIANTS[item.familia].length}
      </div>
      <div style={{ fontSize: 34, marginTop: 36, color: colors.violetLight }}>{item.arquivo}</div>
      <div style={{ fontSize: 30, marginTop: 10, opacity: 0.8 }}>
        trecho: {trecho.inicio.toFixed(2)}s + {trecho.duracao.toFixed(2)}s · ganho {trecho.ganho.toFixed(2)} ·
        volume final {Math.round(Math.min(1, SFX_VOLUME * trecho.ganho) * 100)}%
      </div>
    </AbsoluteFill>
  );
};
