import { Composition } from "remotion";
import { LivroVideo, calculateLivroMetadata } from "./LivroVideo";

export const ComposicoesRodZandonadi = () => (
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
);
