// Composições do Aprenda YouTube (YouTube e Instagram @aprendayoutube). Ids sempre únicos no studio:
// o que é novo começa com "AY". Short novo: crie em ./short/ a partir de ModeloShort.jsx e registre aqui.
import { Composition } from "remotion";
import { Banner } from "./Banner";
import { ModeloShort, CapaShort, AY_FPS } from "./short/ModeloShort";
import { LongVideo, calculateLongMetadata } from "./long/LongVideo";
import { LongCapa } from "./long/Capa";
// Shorts publicados antes de 27/11/2026 (visual antigo, guardados como registro: não re-renderizar).
import { ShortViewsShorts, CapaViewsShorts, SVS_FPS, calculateViewsShortsMetadata } from "./short/ShortViewsShorts";
import { ShortTesteAB, CapaTesteAB, STA_FPS, calculateTesteABMetadata } from "./short/ShortTesteAB";
import { ShortHorarioPostar, CapaHorarioPostar, SHP_FPS, calculateHorarioPostarMetadata } from "./short/ShortHorarioPostar";
import { ShortTagsQuaseNada, CapaTagsQuaseNada, STQ_FPS, calculateTagsQuaseNadaMetadata } from "./short/ShortTagsQuaseNada";
import { ShortCapitulos, CapaCapitulos, SCP_FPS, calculateCapitulosMetadata } from "./short/ShortCapitulos";
import { ShortShorts3Min, CapaShorts3Min, S3M_FPS, calculateShorts3MinMetadata } from "./short/ShortShorts3Min";
import { ShortHype, CapaHype, HYP_FPS, calculateHypeMetadata } from "./short/ShortHype";
import { ShortVideoRelacionado, CapaVideoRelacionado, VRL_FPS, calculateVideoRelacionadoMetadata } from "./short/ShortVideoRelacionado";
// Shorts no visual novo (identidade do banner, 27/11/2026 em diante).
import { ShortTelaFinal, CapaTelaFinal, TLF_FPS, calculateTelaFinalMetadata } from "./short/ShortTelaFinal";
import { ShortCapaDoShort, CapaCapaDoShort, CDS_FPS, calculateCapaDoShortMetadata } from "./short/ShortCapaDoShort";

export const ComposicoesAprendaYouTube = () => (
  <>
  <Composition id="AYBanner" component={Banner} width={1291} height={201} fps={30} durationInFrames={1} />
  <Composition id="AYModeloShort" component={ModeloShort} width={1080} height={1920} fps={AY_FPS} durationInFrames={AY_FPS * 9} />
  <Composition id="AYCapaShort" component={CapaShort} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition id="AYLongVideo" component={LongVideo} width={1920} height={1080} fps={30} durationInFrames={150} defaultProps={{ slug: "" }} calculateMetadata={calculateLongMetadata} />
  <Composition id="AYLongCapa" component={LongCapa} width={1280} height={720} fps={30} durationInFrames={1} defaultProps={{ slug: "" }} />
  <Composition
    id="ShortViewsShorts"
    component={ShortViewsShorts}
    width={1080}
    height={1920}
    fps={SVS_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateViewsShortsMetadata}
  />
  <Composition id="CapaViewsShorts" component={CapaViewsShorts} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortTesteAB"
    component={ShortTesteAB}
    width={1080}
    height={1920}
    fps={STA_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateTesteABMetadata}
  />
  <Composition id="CapaTesteAB" component={CapaTesteAB} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortHorarioPostar"
    component={ShortHorarioPostar}
    width={1080}
    height={1920}
    fps={SHP_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateHorarioPostarMetadata}
  />
  <Composition id="CapaHorarioPostar" component={CapaHorarioPostar} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortTagsQuaseNada"
    component={ShortTagsQuaseNada}
    width={1080}
    height={1920}
    fps={STQ_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateTagsQuaseNadaMetadata}
  />
  <Composition id="CapaTagsQuaseNada" component={CapaTagsQuaseNada} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortCapitulos"
    component={ShortCapitulos}
    width={1080}
    height={1920}
    fps={SCP_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateCapitulosMetadata}
  />
  <Composition id="CapaCapitulos" component={CapaCapitulos} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortShorts3Min"
    component={ShortShorts3Min}
    width={1080}
    height={1920}
    fps={S3M_FPS}
    durationInFrames={1800}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateShorts3MinMetadata}
  />
  <Composition id="CapaShorts3Min" component={CapaShorts3Min} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortHype"
    component={ShortHype}
    width={1080}
    height={1920}
    fps={HYP_FPS}
    durationInFrames={1300}
    defaultProps={{ words: [], endSec: 0 }}
    calculateMetadata={calculateHypeMetadata}
  />
  <Composition id="CapaHype" component={CapaHype} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition
    id="ShortVideoRelacionado"
    component={ShortVideoRelacionado}
    width={1080}
    height={1920}
    fps={VRL_FPS}
    durationInFrames={30 * 45}
    defaultProps={{ words: [], endSec: 45 }}
    calculateMetadata={calculateVideoRelacionadoMetadata}
  />
  <Composition id="CapaVideoRelacionado" component={CapaVideoRelacionado} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition id="AYTelaFinal" component={ShortTelaFinal} width={1080} height={1920} fps={TLF_FPS} durationInFrames={1800} defaultProps={{ words: [], endSec: 0 }} calculateMetadata={calculateTelaFinalMetadata} />
  <Composition id="AYCapaTelaFinal" component={CapaTelaFinal} width={1080} height={1920} fps={30} durationInFrames={1} />
  <Composition id="AYCapaDoShort" component={ShortCapaDoShort} width={1080} height={1920} fps={CDS_FPS} durationInFrames={1800} defaultProps={{ words: [], endSec: 0 }} calculateMetadata={calculateCapaDoShortMetadata} />
  <Composition id="AYCapaCapaDoShort" component={CapaCapaDoShort} width={1080} height={1920} fps={30} durationInFrames={1} />
  </>
);
