import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { colors } from "../theme";

// dados: { titulo?, barras: [{ label, valor }] }  valor em 0-100
export const GraficoBarras = ({ dados }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...dados.barras.map((b) => b.valor));

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", padding: "90px 180px", gap: 30 }}>
        {dados.titulo ? <Title size={56}>{dados.titulo}</Title> : null}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 48,
            height: 480,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {dados.barras.map((barra, i) => {
            const delay = i * fps * 0.15;
            const heightPct = interpolate(
              frame - delay,
              [0, fps * 0.8],
              [0, (barra.valor / max) * 100],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 120 }}>
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    borderRadius: 16,
                    background: `linear-gradient(180deg, ${colors.violetLight}, ${colors.violet})`,
                    boxShadow: `0 0 28px ${colors.violet}88`,
                  }}
                />
                <span style={{ color: colors.text, fontFamily: "Montserrat, sans-serif", fontSize: 26 }}>
                  {barra.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
