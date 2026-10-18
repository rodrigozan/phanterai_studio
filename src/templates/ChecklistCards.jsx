import { AbsoluteFill } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";

const STAGGER_FRAMES = 10;

// dados: { titulo?, itens: [{ texto, feito }] }
export const ChecklistCards = ({ dados, pose = "pensando" }) => (
  <Stage>
    <AbsoluteFill style={{ alignItems: "center", padding: "90px 220px", gap: 24 }}>
      {dados.titulo ? <Title size={56} style={{ marginBottom: 20 }}>{dados.titulo}</Title> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
        {dados.itens.map((item, i) => (
          <div key={i}>
            <Sfx name={item.feito ? "ding" : "error"} atFrame={i * STAGGER_FRAMES} />
            <Card
              context={item.feito ? "sucesso" : "ruim"}
              enterFrame={i * STAGGER_FRAMES}
              style={{ display: "flex", alignItems: "center", gap: 20 }}
            >
              <span>{item.feito ? "✓" : "✕"}</span>
              <span>{item.texto}</span>
            </Card>
          </div>
        ))}
      </div>
    </AbsoluteFill>
    <Panther pose={pose} left="88%" top="85%" width={300} />
  </Stage>
);
