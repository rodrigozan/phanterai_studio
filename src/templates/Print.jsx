import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Badge } from "../components/Badge";
import { Panther } from "../components/Panther";
import { Midia } from "../components/Midia";
import { arquivoDoEpisodio, frameDe, progresso } from "../components/eventos";

// dados: { arquivo, legenda?, recorte?, borrar?, foco? }
//   arquivo  nome do print em public/episodes/<slug>/ (aceita também `imagem`)
//   recorte  { x, y, w, h } em % - mostra só essa área do print
//   borrar   [{ x, y, w, h }] em % - áreas borradas
//   foco     { x, y } em % - origem do ken burns (padrão: centro)
// Print inteiro num card, com ken burns lento; evento zoom-print aproxima o card inteiro.
export const Print = ({ dados, pose = "apontando", eventos, slug }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // Ken burns leve no conteúdo; o zoom-print cresce a moldura inteira, sem cortar o print.
  const lento = interpolate(frame, [0, durationInFrames], [1, 1.03], { extrapolateRight: "clamp" });
  const punch = 1 + 0.1 * progresso(frame, fps, frameDe(eventos, "zoom-print"), { damping: 18 });

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 70, paddingRight: 200 }}>
        <div style={{ transform: `scale(${punch})` }}>
          <Midia
            src={arquivoDoEpisodio(slug, dados.arquivo ?? dados.imagem)}
            recorte={dados.recorte}
            borrar={dados.borrar}
            foco={dados.foco}
            maxW={1300}
            maxH={dados.legenda ? 720 : 800}
            escala={lento}
          />
        </div>
        {dados.legenda ? <Badge context="destaque">{dados.legenda}</Badge> : null}
      </AbsoluteFill>
      {/* "apontando" aponta para a esquerda: pantera à direita do print */}
      <Panther pose={pose} left="90%" top="80%" width={300} />
    </Stage>
  );
};
