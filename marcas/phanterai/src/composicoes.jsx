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
import { ShortClaudeMods, CapaClaudeMods, SCM_FPS, calculateClaudeModsMetadata } from "./short/ShortClaudeMods";
import { ShortOpuscar, CapaOpuscar, SOP_FPS, calculateOpuscarMetadata } from "./short/ShortOpuscar";
import { ShortQuadroBranco, CapaQuadroBranco, SQB_FPS, calculateQuadroBrancoMetadata } from "./short/ShortQuadroBranco";
import { ShortGameStudios, CapaGameStudios, SGS_FPS, calculateGameStudiosMetadata } from "./short/ShortGameStudios";
import { ShortDezNegocios, CapaDezNegocios, SDN_FPS, calculateDezNegociosMetadata } from "./short/ShortDezNegocios";
import { ShortFable52, CapaFable52, SF52_FPS, calculateFable52Metadata } from "./short/ShortFable52";
import { ShortTirarDados, CapaTirarDados, STD_FPS, calculateTirarDadosMetadata } from "./short/ShortTirarDados";
import { ShortEstilosLuz, CapaEstilosLuz, SEL_FPS, calculateEstilosLuzMetadata } from "./short/ShortEstilosLuz";
import { ShortGrokBot, CapaGrokBot, SGB_FPS, calculateGrokBotMetadata } from "./short/ShortGrokBot";
import { ShortSeedance25, CapaSeedance25, SSD_FPS, calculateSeedance25Metadata } from "./short/ShortSeedance25";
import { ShortClaudeComanda, CapaClaudeComanda, SCC_FPS, calculateClaudeComandaMetadata } from "./short/ShortClaudeComanda";
import { ShortResumoSemana, CapaResumoSemana, SRS_FPS, calculateResumoSemanaMetadata } from "./short/ShortResumoSemana";
import { ShortGpt62Sol, CapaGpt62Sol, G62_FPS, calculateGpt62SolMetadata } from "./short/ShortGpt62Sol";
import { ShortGeminiMac, CapaGeminiMac, SGM_FPS, calculateGeminiMacMetadata } from "./short/ShortGeminiMac";
import { ShortCodigosSecretos, CapaCodigosSecretos, SCS_FPS, calculateCodigosSecretosMetadata } from "./short/ShortCodigosSecretos";
import { ShortClaudeAjustes, CapaClaudeAjustes, SCA_FPS, calculateClaudeAjustesMetadata } from "./short/ShortClaudeAjustes";
import { ShortPrimeiroAgente, CapaPrimeiroAgente, SPA_FPS, calculatePrimeiroAgenteMetadata } from "./short/ShortPrimeiroAgente";
import { TesteSfx, TESTE_SFX_FRAMES } from "./TesteSfx";
import { LongVideo, calculateLongMetadata } from "./long/LongVideo";
import { LongCapa } from "./long/Capa";

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
    id="LongVideo"
    component={LongVideo}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={150}
    defaultProps={{ slug: "" }}
    calculateMetadata={calculateLongMetadata}
  />
  <Composition id="LongCapa" component={LongCapa} width={1280} height={720} fps={30} durationInFrames={1} defaultProps={{ slug: "" }} />
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
    id="ShortClaudeMods"
    component={ShortClaudeMods}
    width={1080}
    height={1920}
    fps={SCM_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateClaudeModsMetadata}
  />
  <Composition id="CapaClaudeMods" component={CapaClaudeMods} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortOpuscar"
    component={ShortOpuscar}
    width={1080}
    height={1920}
    fps={SOP_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateOpuscarMetadata}
  />
  <Composition id="CapaOpuscar" component={CapaOpuscar} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortPrimeiroAgente"
    component={ShortPrimeiroAgente}
    width={1080}
    height={1920}
    fps={SPA_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculatePrimeiroAgenteMetadata}
  />
  <Composition id="CapaPrimeiroAgente" component={CapaPrimeiroAgente} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortQuadroBranco"
    component={ShortQuadroBranco}
    width={1080}
    height={1920}
    fps={SQB_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateQuadroBrancoMetadata}
  />
  <Composition id="CapaQuadroBranco" component={CapaQuadroBranco} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortGameStudios"
    component={ShortGameStudios}
    width={1080}
    height={1920}
    fps={SGS_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateGameStudiosMetadata}
  />
  <Composition id="CapaGameStudios" component={CapaGameStudios} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortDezNegocios"
    component={ShortDezNegocios}
    width={1080}
    height={1920}
    fps={SDN_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateDezNegociosMetadata}
  />
  <Composition id="CapaDezNegocios" component={CapaDezNegocios} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortFable52"
    component={ShortFable52}
    width={1080}
    height={1920}
    fps={SF52_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateFable52Metadata}
  />
  <Composition id="CapaFable52" component={CapaFable52} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortTirarDados"
    component={ShortTirarDados}
    width={1080}
    height={1920}
    fps={STD_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateTirarDadosMetadata}
  />
  <Composition id="CapaTirarDados" component={CapaTirarDados} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortEstilosLuz"
    component={ShortEstilosLuz}
    width={1080}
    height={1920}
    fps={SEL_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateEstilosLuzMetadata}
  />
  <Composition id="CapaEstilosLuz" component={CapaEstilosLuz} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortGrokBot"
    component={ShortGrokBot}
    width={1080}
    height={1920}
    fps={SGB_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateGrokBotMetadata}
  />
  <Composition id="CapaGrokBot" component={CapaGrokBot} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortSeedance25"
    component={ShortSeedance25}
    width={1080}
    height={1920}
    fps={SSD_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateSeedance25Metadata}
  />
  <Composition id="CapaSeedance25" component={CapaSeedance25} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortClaudeComanda"
    component={ShortClaudeComanda}
    width={1080}
    height={1920}
    fps={SCC_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateClaudeComandaMetadata}
  />
  <Composition id="CapaClaudeComanda" component={CapaClaudeComanda} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortGpt62Sol"
    component={ShortGpt62Sol}
    width={1080}
    height={1920}
    fps={G62_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateGpt62SolMetadata}
  />
  <Composition id="CapaGpt62Sol" component={CapaGpt62Sol} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortGeminiMac"
    component={ShortGeminiMac}
    width={1080}
    height={1920}
    fps={SGM_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateGeminiMacMetadata}
  />
  <Composition id="CapaGeminiMac" component={CapaGeminiMac} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortCodigosSecretos"
    component={ShortCodigosSecretos}
    width={1080}
    height={1920}
    fps={SCS_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateCodigosSecretosMetadata}
  />
  <Composition id="CapaCodigosSecretos" component={CapaCodigosSecretos} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortClaudeAjustes"
    component={ShortClaudeAjustes}
    width={1080}
    height={1920}
    fps={SCA_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateClaudeAjustesMetadata}
  />
  <Composition id="CapaClaudeAjustes" component={CapaClaudeAjustes} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortResumoSemana"
    component={ShortResumoSemana}
    width={1080}
    height={1920}
    fps={SRS_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateResumoSemanaMetadata}
  />
  <Composition id="CapaResumoSemana" component={CapaResumoSemana} width={1080} height={1920} fps={30} durationInFrames={1} />
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
