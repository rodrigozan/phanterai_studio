import { Composition, Still } from "remotion";
import { ZANATHOS_FRAMES, ZanathosEp1 } from "./zanathos/Zanathos";
import { CAP1_FRAMES, ZanathosCap1 } from "./zanathos/cap1/Cap1";
import { EP2_FRAMES, ZanathosEp2 } from "./zanathos/Ep2";
import { LivroVideo, calculateLivroMetadata } from "./LivroVideo";
import { PersonagensVideo, calcularPersonagensMetadata } from "./personagens/PersonagensVideo";

export const ComposicoesRodZandonadi = () => (
  <>
  <Composition id="ZanathosEp1" component={ZanathosEp1} width={1080} height={1920} fps={30} durationInFrames={ZANATHOS_FRAMES} defaultProps={{ capa: false }} />
  {[1, 2, 3, 4].map((n) => (
    <Composition key={n} id={`ZanathosCap1P${n}`} component={ZanathosCap1} width={1080} height={1920} fps={30} durationInFrames={CAP1_FRAMES[n]} defaultProps={{ parte: n, capa: false }} />
  ))}
  <Composition id="ZanathosEp2" component={ZanathosEp2} width={1080} height={1920} fps={30} durationInFrames={EP2_FRAMES} />
  <Still id="ZanathosEp2Capa" component={ZanathosEp2} width={1080} height={1920} defaultProps={{ capa: true }} />
  <Still id="ZanathosEp1Capa" component={ZanathosEp1} width={1080} height={1920} defaultProps={{ capa: true }} />
  <Composition
    id="RodLivroIA"
    component={LivroVideo}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={150}
    defaultProps={{ slug: "escrever-livro-com-ia", plano: null }}
    calculateMetadata={calculateLivroMetadata}
  />
  <Composition
    id="RodPersonagensIA"
    component={PersonagensVideo}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={150}
    defaultProps={{ slug: "personagens-com-ia", plano: null }}
    calculateMetadata={calcularPersonagensMetadata}
  />
  </>
);
