import { Composition } from "remotion";
import { Short, calculateShortMetadata } from "./remotion/Short";
import { TesteFamiliaQuadrada, TESTE_FRAMES } from "./remotion/TesteFamiliaQuadrada";
import { FPS, WIDTH, HEIGHT } from "./remotion/layout";

export const ComposicoesFamiliaQuadrada = () => (
  <>
    <Composition
      id="ShortFamiliaQuadrada"
      component={Short}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={60}
      defaultProps={{ episode: null, timing: null }}
      calculateMetadata={calculateShortMetadata}
    />
    <Composition id="TesteFamiliaQuadrada" component={TesteFamiliaQuadrada} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={TESTE_FRAMES} />
  </>
);
