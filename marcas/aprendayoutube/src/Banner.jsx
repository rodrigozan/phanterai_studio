// Reprodução do banner do canal (1291x201), para conferir a identidade lado a lado com
// identidade/banner-canal.png. O original escreve "detacar"; aqui é "destacar".
import { AbsoluteFill } from "remotion";
import { Coracao, Logo, Play } from "./components/identidade";
import { BRANCO, DISPLAY, FAMILIA, MAGENTA } from "./theme";

export const Banner = () => (
  <AbsoluteFill style={{ background: MAGENTA, overflow: "hidden" }}>
    <Coracao largura={250} giro={0} style={{ position: "absolute", left: 252, top: 10 }} />
    <Logo largura={215} coracao={false} style={{ position: "absolute", left: 325, top: 6 }} />
    <div style={{ position: "absolute", left: 557, top: 64, fontFamily: FAMILIA, fontWeight: 700, fontSize: 21.5, lineHeight: "28px", color: BRANCO, whiteSpace: "nowrap" }}>
      <div>- como planejar, criar, configurar</div>
      <div>- manter, se destacar,</div>
      <div>- e monetizar canais no youtube</div>
    </div>
    <Play size={50} style={{ position: "absolute", left: 951, top: 57 }} />
    <div style={{ position: "absolute", left: 880, width: 200, top: 112, textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, lineHeight: "21px", color: BRANCO, whiteSpace: "nowrap" }}>
      <div>Vídeos novos</div>
      <div>às Sextas</div>
    </div>
  </AbsoluteFill>
);
