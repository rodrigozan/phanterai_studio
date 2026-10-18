import { AbsoluteFill } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { colors } from "../theme";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";

// dados: { titulo, subtitulo? }
export const Cta = ({ dados, pose = "comemorando" }) => (
  <Stage>
    <Sfx name="riser" atFrame={0} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 24, padding: "0 160px" }}>
      <Title size={80}>{dados.titulo}</Title>
      {dados.subtitulo ? (
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 38, color: colors.gold }}>
          {dados.subtitulo}
        </div>
      ) : null}
    </AbsoluteFill>
    <Panther pose={pose} left="50%" top="86%" width={400} />
  </Stage>
);
