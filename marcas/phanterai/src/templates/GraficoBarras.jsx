import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Panther } from "../components/Panther";
import { colors } from "../theme";
import { frameDe, numeroBR } from "../components/eventos";

// dados: { titulo?, barras: [{ rotulo, valor }] }  (aceita também `label` no lugar de `rotulo`)
// Altura proporcional ao maior valor. Barra N cresce no evento crescer-barra-N
// (N começa em 1); sem evento, cresce em cascata no início.
export const GraficoBarras = ({ dados, pose = "apontando", eventos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...dados.barras.map((b) => b.valor));

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "90px 400px 90px 180px", gap: 30 }}>
        {dados.titulo ? <Title size={56}>{dados.titulo}</Title> : null}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 90, height: 600, justifyContent: "center" }}>
          {dados.barras.map((barra, i) => {
            const inicio = frameDe(eventos, `crescer-barra-${i + 1}`) ?? i * fps * 0.15;
            const fracao = interpolate(frame, [inicio, inicio + fps * 0.8], [0, barra.valor / max], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 240, height: "100%", justifyContent: "flex-end" }}>
                <span style={{ color: colors.gold, fontFamily: "Poppins, sans-serif", fontWeight: 900, fontSize: 44, opacity: fracao > 0 ? 1 : 0 }}>
                  {numeroBR(fracao * max)}
                </span>
                <div
                  style={{
                    width: "100%",
                    height: `${fracao * 80}%`,
                    borderRadius: 16,
                    background: `linear-gradient(180deg, ${colors.violetLight}, ${colors.violet})`,
                    boxShadow: `0 0 28px ${colors.violet}88`,
                  }}
                />
                <span style={{ color: colors.text, fontFamily: "Montserrat, sans-serif", fontSize: 30, textAlign: "center" }}>
                  {barra.rotulo ?? barra.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Panther pose={pose} left="88%" top="80%" width={300} />
    </Stage>
  );
};
