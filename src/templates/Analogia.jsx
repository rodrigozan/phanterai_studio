import { AbsoluteFill } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { colors } from "../theme";
import { Panther } from "../components/Panther";

// dados: { emoji?, titulo, texto }
export const Analogia = ({ dados, pose = "pensando" }) => (
  <Stage>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 28, padding: "0 220px" }}>
      {dados.emoji ? <div style={{ fontSize: 160 }}>{dados.emoji}</div> : null}
      <Title size={60}>{dados.titulo}</Title>
      <div
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 36,
          color: colors.text,
          textAlign: "center",
          opacity: 0.9,
        }}
      >
        {dados.texto}
      </div>
    </AbsoluteFill>
    <Panther pose={pose} left="88%" top="88%" width={280} />
  </Stage>
);
