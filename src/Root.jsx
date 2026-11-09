import { Composition, registerRoot } from "remotion";
import { Episode, calculateEpisodeMetadata } from "./Episode";
import { ShortTempero, SHORT_FPS, SHORT_FRAMES, calculateShortMetadata } from "./short/ShortTempero";
import { ShortMinecraft, MC_FPS, MC_FRAMES, calculateMinecraftMetadata } from "./short/ShortMinecraft";
import { ShortOllama, OL_FPS, OL_FRAMES, calculateOllamaMetadata } from "./short/ShortOllama";
import { ShortOrcamento, OR_FPS, OR_FRAMES, calculateOrcamentoMetadata } from "./short/ShortOrcamento";
import { ShortScion, ScionCapa, ScionThumb, SC_FPS, calculateScionMetadata } from "./short/ShortScion";
import { TesteSfx, TESTE_SFX_FRAMES } from "./TesteSfx";
import { ShotcraftFinish, calculateShotcraftMetadata } from "./shotcraft/ShotcraftFinish";

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
    id="ShortMinecraft"
    component={ShortMinecraft}
    width={1080}
    height={1920}
    fps={MC_FPS}
    durationInFrames={MC_FRAMES}
    defaultProps={{ palavras: null }}
    calculateMetadata={calculateMinecraftMetadata}
  />
  <Composition
    id="ShortOllama"
    component={ShortOllama}
    width={1080}
    height={1920}
    fps={OL_FPS}
    durationInFrames={OL_FRAMES}
    defaultProps={{ palavras: null }}
    calculateMetadata={calculateOllamaMetadata}
  />
  <Composition
    id="ShortOrcamento"
    component={ShortOrcamento}
    width={1080}
    height={1920}
    fps={OR_FPS}
    durationInFrames={OR_FRAMES}
    defaultProps={{ voz: null }}
    calculateMetadata={calculateOrcamentoMetadata}
  />
  <Composition
    id="ShortScion"
    component={ShortScion}
    width={1080}
    height={1920}
    fps={SC_FPS}
    durationInFrames={1500}
    defaultProps={{ voz: null }}
    calculateMetadata={calculateScionMetadata}
  />
  <Composition id="ScionCapa" component={ScionCapa} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition id="ScionThumb" component={ScionThumb} width={1280} height={720} fps={30} durationInFrames={1} />
  <Composition
    id="ShotcraftFinish"
    component={ShotcraftFinish}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ base: null, look: "phanterai", shots: [] }}
    calculateMetadata={calculateShotcraftMetadata}
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
