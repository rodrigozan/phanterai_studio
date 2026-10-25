import { Composition, registerRoot } from "remotion";
import { Episode, calculateEpisodeMetadata } from "./Episode";
import { ShortTempero, SHORT_FPS, SHORT_FRAMES, calculateShortMetadata } from "./short/ShortTempero";
import { TesteSfx, TESTE_SFX_FRAMES } from "./TesteSfx";

const RemotionRoot = () => (
  <>
  <Composition
    id="Episode"
    component={Episode}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={150}
    defaultProps={{ slug: "" }}
    calculateMetadata={calculateEpisodeMetadata}
  />
  <Composition
    id="ShortTempero"
    component={ShortTempero}
    width={1080}
    height={1920}
    fps={SHORT_FPS}
    durationInFrames={SHORT_FRAMES}
    defaultProps={{ palavras: null }}
    calculateMetadata={calculateShortMetadata}
  />
  <Composition
    id="TesteSfx"
    component={TesteSfx}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={TESTE_SFX_FRAMES}
  />
  </>
);

registerRoot(RemotionRoot);
