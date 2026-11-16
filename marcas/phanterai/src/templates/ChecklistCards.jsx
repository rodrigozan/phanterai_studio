import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";
import { colors } from "../theme";
import { frameDe } from "../components/eventos";

const STAGGER_FRAMES = 10;

// dados: { titulo?, itens: (string | { texto, feito })[] }
// Eventos por item (N começa em 1): card-N entra o card, check-N marca ✓ verde,
// riscar-item-N risca em vermelho. Item sem card-N/check-N entra em cascata no início.
export const ChecklistCards = ({ dados, pose = "pensando", eventos }) => {
  const frame = useCurrentFrame();

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "90px 420px 90px 220px", gap: 24 }}>
        {dados.titulo ? <Title size={56} style={{ marginBottom: 20 }}>{dados.titulo}</Title> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
          {dados.itens.map((item, i) => {
            const n = i + 1;
            const texto = typeof item === "string" ? item : item.texto;
            const evCard = frameDe(eventos, `card-${n}`);
            const evCheck = frameDe(eventos, `check-${n}`);
            const evRiscar = frameDe(eventos, `riscar-item-${n}`);
            const entrada = evCard ?? evCheck ?? i * STAGGER_FRAMES;
            const semEvento = evCard === null && evCheck === null;

            const feito = typeof item === "object" ? item.feito : evCheck !== null && frame >= evCheck;
            const riscado = (typeof item === "object" && item.feito === false) || (evRiscar !== null && frame >= evRiscar);
            const contexto = riscado ? "ruim" : feito ? "sucesso" : "neutro";

            return (
              <div key={i}>
                {/* SFX de entrada só quando não há evento (com evento, Acoes já toca o som) */}
                {semEvento ? <Sfx name="pop" atFrame={entrada} /> : null}
                <Card context={contexto} enterFrame={entrada} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <span style={{ color: riscado ? colors.red : feito ? colors.green : colors.violetLight, fontWeight: 900 }}>
                    {riscado ? "✕" : feito ? "✓" : "•"}
                  </span>
                  <span style={{ textDecoration: riscado ? `line-through ${colors.red} 4px` : "none" }}>{texto}</span>
                </Card>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Panther pose={pose} left="86%" top="80%" width={300} />
    </Stage>
  );
};
