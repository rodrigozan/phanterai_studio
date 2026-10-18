import { AbsoluteFill } from "remotion";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { colors } from "../theme";
import { Sfx } from "../components/Sfx";

// dados: { label, valor, prefixo?, sufixo?, contexto? }
export const Contador = ({ dados }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countFrames = fps * 1.5;

  const valorAtual = Math.round(
    interpolate(frame, [0, countFrames], [0, dados.valor], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <Stage>
      <Sfx name="coin" atFrame={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 900,
            fontSize: 180,
            color: colors.gold,
            textShadow: `0 0 60px ${colors.gold}aa`,
          }}
        >
          {dados.prefixo ?? ""}
          {valorAtual}
          {dados.sufixo ?? ""}
        </div>
        <Title size={44} color={colors.violetLight}>
          {dados.label}
        </Title>
      </AbsoluteFill>
    </Stage>
  );
};
