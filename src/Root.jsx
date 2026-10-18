import { Composition, registerRoot } from "remotion";
import { Episode, calculateEpisodeMetadata } from "./Episode";

const RemotionRoot = () => (
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
);

registerRoot(RemotionRoot);
