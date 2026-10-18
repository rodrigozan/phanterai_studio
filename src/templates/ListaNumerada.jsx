import { AbsoluteFill } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { colors } from "../theme";
import { Sfx } from "../components/Sfx";

const STAGGER_FRAMES = 12;

// dados: { titulo?, itens: string[] }
export const ListaNumerada = ({ dados }) => (
  <Stage>
    <AbsoluteFill style={{ padding: "90px 200px", gap: 22 }}>
      {dados.titulo ? <Title size={56} style={{ marginBottom: 20 }}>{dados.titulo}</Title> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {dados.itens.map((texto, i) => (
          <div key={i}>
            <Sfx name="whoosh" atFrame={i * STAGGER_FRAMES} />
            <Card enterFrame={i * STAGGER_FRAMES} style={{ display: "flex", gap: 22, alignItems: "center" }}>
              <span style={{ color: colors.gold, fontWeight: 900, fontSize: 40 }}>{i + 1}</span>
              <span>{texto}</span>
            </Card>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  </Stage>
);
