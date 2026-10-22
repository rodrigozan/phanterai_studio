import { Composition, registerRoot } from "remotion";
import { Episode, calculateEpisodeMetadata } from "./Episode";
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
