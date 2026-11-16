import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";
import { colors } from "../theme";
import { frameDe, progresso } from "../components/eventos";

const STAGGER_FRAMES = 8;

// dados: { titulo?, itens: string[], ativo? }
// ativo = número do item em foco (1, 2, 3...; 0 = nenhum). O foco acende no evento
// destacar-N (ou destacar-todos para todos); sem evento, já começa aceso.
export const ListaNumerada = ({ dados, pose = "apontando", eventos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const evTodos = frameDe(eventos, "destacar-todos");
  const ativo = dados.ativo ?? 0;
  const evAtivo = ativo ? frameDe(eventos, `destacar-${ativo}`) : null;
  const focoAtivo = ativo ? (evAtivo === null ? 1 : progresso(frame, fps, evAtivo)) : 0;
  const focoTodos = progresso(frame, fps, evTodos);

  return (
    <Stage>
      <AbsoluteFill style={{ justifyContent: "center", padding: "90px 420px 90px 200px", gap: 22 }}>
        {dados.titulo ? <Title size={56} style={{ marginBottom: 20 }}>{dados.titulo}</Title> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {dados.itens.map((texto, i) => {
            const n = i + 1;
            const foco = Math.max(n === ativo ? focoAtivo : 0, focoTodos);
            const apagado = focoAtivo > 0 && n !== ativo && focoTodos === 0;
            return (
              <div key={i} style={{ opacity: apagado ? 0.4 : 1, transform: `scale(${1 + 0.06 * foco})`, transformOrigin: "left center" }}>
                <Sfx name="whoosh" atFrame={i * STAGGER_FRAMES} />
                <Card
                  context={foco > 0.5 ? "destaque" : "neutro"}
                  enterFrame={i * STAGGER_FRAMES}
                  style={{ display: "flex", gap: 22, alignItems: "center", fontSize: 36 }}
                >
                  <span style={{ color: colors.gold, fontWeight: 900, fontSize: 44 }}>{n}</span>
                  <span>{texto}</span>
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
