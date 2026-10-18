import { AbsoluteFill } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Badge } from "../components/Badge";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";

// dados: { titulo, subtitulo?, contexto? }
export const TituloImpacto = ({ dados, pose = "surpresa" }) => (
  <Stage>
    <Sfx name="riser" atFrame={0} />
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        padding: "0 160px",
      }}
    >
      <Title size={96}>{dados.titulo}</Title>
      {dados.subtitulo ? <Badge context={dados.contexto}>{dados.subtitulo}</Badge> : null}
    </AbsoluteFill>
    <Panther pose={pose} left="50%" top="88%" width={360} />
  </Stage>
);
