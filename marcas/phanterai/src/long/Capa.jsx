// Capa (miniatura 1280x720) de um vídeo longo. Texto curto e que NÃO repete o título.
import { AbsoluteFill, Img } from "remotion";
import { colors } from "../theme";
import { CapaV2 } from "./CapaV2";
import { FONT, MONO, LARANJA, CIANO, pasta } from "./base";

// Modo resultado: `shot` = quadro REAL do que o vídeo produz (sem foto de banco de imagem), ao lado da frase digitada.
const CapaResultado = ({ slug, shot, prompt, linha1, linha2, pose }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 70% 40%, #2a1466 0%, #0b0720 70%)" }}>
    <div style={{ position: "absolute", left: 40, top: 40, width: 470, ...{ fontFamily: MONO, fontWeight: 700 }, fontSize: 38, lineHeight: 1.3, color: "#fff", background: "#0D1117", border: `4px solid ${CIANO}`, borderRadius: 22, padding: "22px 26px" }}>
      <span style={{ color: LARANJA }}>&gt; </span>{prompt}<span style={{ color: CIANO }}>▌</span>
    </div>
    <div style={{ position: "absolute", left: 230, top: 245, ...FONT, fontSize: 110, color: colors.gold, WebkitTextStroke: "8px #05040C", paintOrder: "stroke fill", transform: "rotate(90deg)" }}>➜</div>
    <Img src={pasta(slug, shot)} style={{ position: "absolute", right: 40, top: 70, width: 700, borderRadius: 24, border: `8px solid ${colors.green}`, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }} />
    <div style={{ position: "absolute", left: 40, top: 430, ...FONT, fontSize: 190, color: colors.green, WebkitTextStroke: "10px #05040C", paintOrder: "stroke fill", textShadow: "0 12px 0 rgba(0,0,0,0.6)", lineHeight: 1 }}>{linha1}</div>
    <div style={{ position: "absolute", left: 40, top: 620, ...FONT, fontSize: 60, color: "#140B2E", background: colors.gold, padding: "6px 30px", borderRadius: 24, transform: "rotate(-2deg)", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>{linha2}</div>
    <Img src={pasta(slug, "../../../pantera/" + pose + ".png")} style={{ position: "absolute", right: -20, bottom: -40, width: 400 }} />
  </AbsoluteFill>
);

export const LongCapa = ({ variante, antes, depois, slug, bg = "pexels/capa-bg.jpg", linha1 = "R$ 0", linha2 = "SEM ASSINATURA", pose = "surpresa", size1 = 330, shot, prompt = "faz um vídeo pra mim" }) => variante ? <CapaV2 variante={variante} slug={slug} linha1={linha1} linha2={linha2} shot={shot} prompt={prompt} antes={antes} depois={depois} pose={opt_pose(variante, pose)} /> : shot ? <CapaResultado slug={slug} shot={shot} prompt={prompt} linha1={linha1} linha2={linha2} pose={pose} /> : (
  <AbsoluteFill style={{ background: colors.bgOuter }}>
    <Img src={pasta(slug, bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,4,12,0.88) 0%, rgba(20,11,46,0.7) 55%, rgba(5,4,12,0.35) 100%)" }} />
    <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 96, color: LARANJA }}>✻</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 54, color: "#fff", background: "#0D1117", border: `3px solid ${CIANO}`, padding: "6px 24px", borderRadius: 16 }}>$ claude</div>
    </div>
    <div style={{ position: "absolute", left: 50, top: 190, ...FONT, textAlign: "left", fontSize: Number(size1), color: colors.green, WebkitTextStroke: "10px #05040C", paintOrder: "stroke fill", textShadow: "0 14px 0 rgba(0,0,0,0.6)", lineHeight: 1 }}>{linha1}</div>
    <div style={{ position: "absolute", left: 40, top: 530, ...FONT, fontSize: 70, color: "#140B2E", background: colors.gold, padding: "10px 34px", borderRadius: 26, transform: "rotate(-2deg)", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>{linha2}</div>
    <Img src={pasta(slug, "../../../pantera/" + pose + ".png")} style={{ position: "absolute", right: -30, bottom: -30, width: 480 }} />
  </AbsoluteFill>
);

const opt_pose = (v, pose) => (pose === "surpresa" ? (v === "b" ? "apontando" : "surpresa") : pose);
