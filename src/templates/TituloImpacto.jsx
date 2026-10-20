import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Badge } from "../components/Badge";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";
import { frameDe, progresso } from "../components/eventos";

// dados: { titulo, subtitulo?, destaque?, contexto? }
// destaque vira um selo dourado. Evento zoom-mascote aumenta a pantera.
export const TituloImpacto = ({ dados, pose = "surpresa", eventos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mascote = progresso(frame, fps, frameDe(eventos, "zoom-mascote"), { damping: 12 });

  return (
    <Stage>
      <Sfx name="riser" atFrame={0} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 28,
          padding: "0 160px 220px",
        }}
      >
        <Title size={96}>{dados.titulo}</Title>
        {dados.subtitulo ? <Badge context={dados.contexto}>{dados.subtitulo}</Badge> : null}
        {dados.destaque ? <Badge context="destaque">{dados.destaque}</Badge> : null}
      </AbsoluteFill>
      <Panther pose={pose} left="50%" top={`${82 - 4 * mascote}%`} width={360 * (1 + 0.3 * mascote)} />
    </Stage>
  );
};
