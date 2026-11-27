import { Composition } from "remotion";
import { Short, calculateShortMetadata } from "./remotion/Short";
import { TesteBlocos, TESTE_FRAMES } from "./remotion/TesteBlocos";
import { FPS, WIDTH, HEIGHT } from "./remotion/layout";

export const ComposicoesShortsBlocos = () => (
  <>
    <Composition
      id="ShortBlocos"
      component={Short}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={60}
      defaultProps={{ episode: null, timing: null }}
      calculateMetadata={calculateShortMetadata}
    />
    <Composition id="TesteBlocos" component={TesteBlocos} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={TESTE_FRAMES} />
  </>
);
