import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Badge } from "../components/Badge";
import { Panther } from "../components/Panther";
import { Midia } from "../components/Midia";
import { arquivoDoEpisodio, frameDe, progresso } from "../components/eventos";

// dados: { arquivo, legenda?, recorte?, borrar?, foco?, inicio?, velocidade? }  (aceita também `video` no lugar de `arquivo`)
// Mesmos campos do print, mais inicio (segundo da gravação onde a cena começa) e velocidade
// (0.75 = mais lento, para um trecho curto cobrir a fala inteira). O áudio da gravação fica mudo (a voz é o voz.mp3).
// As áreas de `borrar` são fixas: se a tela rolar durante a gravação, o conteúdo sai de baixo delas.
export const GravacaoTela = ({ dados, pose = "apontando", eventos, slug }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // zoom-tela cresce a moldura inteira, sem cortar a gravação.
  const zoom = 1 + 0.1 * progresso(frame, fps, frameDe(eventos, "zoom-tela"), { damping: 18 });

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 70, paddingRight: 200 }}>
        <div style={{ transform: `scale(${zoom})` }}>
        <Midia
          tipo="video"
          src={arquivoDoEpisodio(slug, dados.arquivo ?? dados.video)}
          recorte={dados.recorte}
          borrar={dados.borrar}
          foco={dados.foco}
          maxW={1300}
          maxH={dados.legenda ? 720 : 800}
          inicio={dados.inicio}
          velocidade={dados.velocidade}
        />
        </div>
        {dados.legenda ? <Badge context="destaque">{dados.legenda}</Badge> : null}
      </AbsoluteFill>
      {/* "apontando" aponta para a esquerda: pantera à direita da gravação */}
      <Panther pose={pose} left="90%" top="80%" width={300} />
    </Stage>
  );
};
