import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Panther } from "../components/Panther";
import { colors } from "../theme";
import { frameDe, numeroBR } from "../components/eventos";

// dados: { de?, ate, rotulo, prefixo?, sufixo? }  (aceita também valor/label do formato antigo)
// Conta de `de` até `ate` (pode ser decrescente) a partir do evento "contar", ou do início.
export const Contador = ({ dados, pose = "surpresa", eventos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const de = dados.de ?? 0;
  const ate = dados.ate ?? dados.valor;
  const inicio = frameDe(eventos, "contar") ?? 0;

  const valor = interpolate(frame, [inicio, inicio + fps * 1.2], [de, ate], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chegou = frame >= inicio + fps * 1.2;
  const pulso = chegou ? 1 + 0.06 * Math.max(0, 1 - (frame - inicio - fps * 1.2) / 8) : 1;

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, paddingBottom: 120 }}>
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 900,
            fontSize: 180,
            color: colors.gold,
            textShadow: `0 0 60px ${colors.gold}aa`,
            transform: `scale(${pulso})`,
          }}
        >
          {dados.prefixo ?? ""}
          {numeroBR(valor)}
          {dados.sufixo ?? ""}
        </div>
        <Title size={44} color={colors.violetLight}>
          {dados.rotulo ?? dados.label}
        </Title>
      </AbsoluteFill>
      <Panther pose={pose} left="86%" top="82%" width={300} />
    </Stage>
  );
};
