// Capa (miniatura 1280x720) de um vídeo longo. Texto curto e que NÃO repete o título.
import { AbsoluteFill, Img } from "remotion";
import { colors } from "../theme";
import { FONT, MONO, LARANJA, CIANO, pasta } from "./base";

export const LongCapa = ({ slug, bg = "pexels/capa-bg.jpg", linha1 = "R$ 0", linha2 = "SEM ASSINATURA", pose = "surpresa" }) => (
  <AbsoluteFill style={{ background: colors.bgOuter }}>
    <Img src={pasta(slug, bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,4,12,0.88) 0%, rgba(20,11,46,0.7) 55%, rgba(5,4,12,0.35) 100%)" }} />
    <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 96, color: LARANJA }}>✻</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 54, color: "#fff", background: "#0D1117", border: `3px solid ${CIANO}`, padding: "6px 24px", borderRadius: 16 }}>$ claude</div>
    </div>
    <div style={{ position: "absolute", left: 50, top: 190, ...FONT, textAlign: "left", fontSize: 330, color: colors.green, WebkitTextStroke: "10px #05040C", paintOrder: "stroke fill", textShadow: "0 14px 0 rgba(0,0,0,0.6)", lineHeight: 1 }}>{linha1}</div>
    <div style={{ position: "absolute", left: 40, top: 530, ...FONT, fontSize: 70, color: "#140B2E", background: colors.gold, padding: "10px 34px", borderRadius: 26, transform: "rotate(-2deg)", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>{linha2}</div>
    <Img src={pasta(slug, "../../../pantera/" + pose + ".png")} style={{ position: "absolute", right: -30, bottom: -30, width: 480 }} />
  </AbsoluteFill>
);
