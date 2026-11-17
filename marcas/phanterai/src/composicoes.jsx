// Composições da marca PhanterAI (Instagram @phanteraicreative, YouTube Aprenda YouTube).
// Reel novo: crie o arquivo em ./short/ e registre a <Composition> aqui. O src/Root.jsx só junta as marcas.
import { Composition } from "remotion";
import { Episode, calculateEpisodeMetadata } from "./Episode";
import { ShortTempero, SHORT_FPS, SHORT_FRAMES, calculateShortMetadata } from "./short/ShortTempero";
import { ShortMinecraft, MC_FPS, MC_FRAMES, calculateMinecraftMetadata } from "./short/ShortMinecraft";
import { ShortOllama, OL_FPS, OL_FRAMES, calculateOllamaMetadata } from "./short/ShortOllama";
import { ShortOrcamento, OR_FPS, OR_FRAMES, calculateOrcamentoMetadata } from "./short/ShortOrcamento";
import { ShortHyperframes, HF_FPS, HF_FRAMES, calculateHyperframesMetadata } from "./short/ShortHyperframes";
import { ShortScion, ScionCapa, ScionThumb, SC_FPS, calculateScionMetadata } from "./short/ShortScion";
import { ShortSemanaIA, CapaSemanaIA, SIA_FPS, calculateSemanaIAMetadata } from "./short/ShortSemanaIA";
import { ShortSkillsClaude, CapaSkillsClaude, SKC_FPS, calculateSkillsClaudeMetadata } from "./short/ShortSkillsClaude";
import { ShortGoogleFlow, CapaGoogleFlow, GFL_FPS, calculateGoogleFlowMetadata } from "./short/ShortGoogleFlow";
import { ShortChatgptWallet, CapaChatgptWallet, CWL_FPS, calculateChatgptWalletMetadata } from "./short/ShortChatgptWallet";
import { ShortHeadOfContent, CapaHeadOfContent, HOC_FPS, calculateHeadOfContentMetadata } from "./short/ShortHeadOfContent";
import { ShortSeisSistemas, CapaSeisSistemas, SSC_FPS, calculateSeisSistemasMetadata } from "./short/ShortSeisSistemas";
import { TesteSfx, TESTE_SFX_FRAMES } from "./TesteSfx";

export const ComposicoesPhanterAI = () => (
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
    id="ShortHyperframes"
    component={ShortHyperframes}
    width={1080}
    height={1920}
    fps={HF_FPS}
    durationInFrames={HF_FRAMES}
    defaultProps={{ voz: "phanterai/episodes/short-hyperframes/locucao.wav" }}
    calculateMetadata={calculateHyperframesMetadata}
  />
  <Composition
    id="ShortSemanaIA"
    component={ShortSemanaIA}
    width={1080}
    height={1920}
    fps={SIA_FPS}
    durationInFrames={3700}
    defaultProps={{ scenes: null, words: [], times: [], endSec: 0 }}
    calculateMetadata={calculateSemanaIAMetadata}
  />
  <Composition id="CapaSemanaIA" component={CapaSemanaIA} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortSkillsClaude"
    component={ShortSkillsClaude}
    width={1080}
    height={1920}
    fps={SKC_FPS}
    durationInFrames={1800}
    defaultProps={{ scenes: null, words: [], times: [], endSec: 0 }}
    calculateMetadata={calculateSkillsClaudeMetadata}
  />
  <Composition id="CapaSkillsClaude" component={CapaSkillsClaude} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortGoogleFlow"
    component={ShortGoogleFlow}
    width={1080}
    height={1920}
    fps={GFL_FPS}
    durationInFrames={1800}
    defaultProps={{ scenes: null, words: [], times: [], endSec: 0 }}
    calculateMetadata={calculateGoogleFlowMetadata}
  />
  <Composition id="CapaGoogleFlow" component={CapaGoogleFlow} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortChatgptWallet"
    component={ShortChatgptWallet}
    width={1080}
    height={1920}
    fps={CWL_FPS}
    durationInFrames={1800}
    defaultProps={{ scenes: null, words: [], times: [], endSec: 0 }}
    calculateMetadata={calculateChatgptWalletMetadata}
  />
  <Composition id="CapaChatgptWallet" component={CapaChatgptWallet} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortHeadOfContent"
    component={ShortHeadOfContent}
    width={1080}
    height={1920}
    fps={HOC_FPS}
    durationInFrames={1800}
    defaultProps={{ scenes: null, words: [], times: [], endSec: 0 }}
    calculateMetadata={calculateHeadOfContentMetadata}
  />
  <Composition id="CapaHeadOfContent" component={CapaHeadOfContent} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortSeisSistemas"
    component={ShortSeisSistemas}
    width={1080}
    height={1920}
    fps={SSC_FPS}
    durationInFrames={1800}
    defaultProps={{ scenes: null, words: [], times: [], endSec: 0 }}
    calculateMetadata={calculateSeisSistemasMetadata}
  />
  <Composition id="CapaSeisSistemas" component={CapaSeisSistemas} width={1080} height={1920} fps={30} durationInFrames={1} />
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
    id="TesteSfx"
    component={TesteSfx}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={TESTE_SFX_FRAMES}
  />
  </>
);
