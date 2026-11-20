// Capas de alto clique (1280x720), 3 variantes. Aprendido nas thumbs que mais bombaram no nicho (20/11/2026):
// 1 objeto/ rosto gigante com emoção, texto de 2 a 4 palavras bem grande, 1 ideia só, marca reconhecível (faísca laranja),
// seta/dedo apontando o resultado, contraste alto. Nada de texto miúdo.
import { AbsoluteFill, Img } from "remotion";
import { colors } from "../theme";
import { FONT, LARANJA, pasta } from "./base";

export const Faisca = ({ size = 220, cor = LARANJA, tile = true }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: tile ? "#fff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: tile ? "0 18px 40px rgba(0,0,0,0.45)" : "none" }}>
    <svg width={size * 0.72} height={size * 0.72} viewBox="-50 -50 100 100">
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x="-7" y={i % 2 ? -40 : -47} width="14" height={i % 2 ? 30 : 40} rx="7" fill={cor} transform={`rotate(${i * 30})`} />
      ))}
    </svg>
  </div>
);

const Txt = ({ children, size, cor = "#fff", style = {} }) => (
  <div style={{ ...FONT, fontSize: size, lineHeight: 0.95, color: cor, WebkitTextStroke: `${Math.round(size / 11)}px #05040C`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(0,0,0,0.55)", textTransform: "uppercase", ...style }}>{children}</div>
);
const Pill = ({ children, size = 58, style = {} }) => (
  <div style={{ ...FONT, fontSize: size, color: "#140B2E", background: colors.gold, padding: "6px 30px", borderRadius: 24, boxShadow: "0 12px 34px rgba(0,0,0,0.5)", ...style }}>{children}</div>
);
const Seta = ({ style = {}, rot = 0, size = 150, cor = "#FF3B30" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.5))", ...style }}>
    <path d="M10 62 C 30 20, 60 20, 78 50 L 70 54 L 92 66 L 90 40 L 82 46 C 60 6, 22 8, 6 58 Z" fill={cor} stroke="#05040C" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);
const Pant = ({ slug, pose, style }) => <Img src={pasta(slug, "../../../pantera/" + pose + ".png")} style={{ position: "absolute", ...style }} />;

// A: pantera GIGANTE com emoção + faísca + frase. (o "rosto" do canal)
const A = ({ slug, linha1, linha2, pose = "surpresa" }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 72% 55%, #FFB020 0%, #FF6A00 22%, #6D28D9 55%, #1B0B45 100%)" }}>
    <AbsoluteFill style={{ background: "repeating-conic-gradient(from 0deg at 72% 55%, rgba(255,255,255,0.07) 0deg 8deg, transparent 8deg 16deg)" }} />
    <Pant slug={slug} pose={pose} style={{ right: -60, bottom: -70, width: 680, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.55))" }} />
    <div style={{ position: "absolute", left: 40, top: 36 }}><Faisca size={170} /></div>
    <Txt size={160} style={{ position: "absolute", left: 36, top: 230, width: 600 }}>{linha1}</Txt>
    <Pill style={{ position: "absolute", left: 40, top: 600, transform: "rotate(-2deg)" }}>{linha2}</Pill>
  </AbsoluteFill>
);

// B: o PEDIDO no Claude Desktop (balão de conversa) + resultado. Se houver `shot`, mostra o quadro real.
const B = ({ slug, linha1, linha2, shot, prompt, pose = "apontando" }) => (
  <AbsoluteFill style={{ background: "linear-gradient(135deg, #12082E 0%, #2D1B69 100%)" }}>
    <Txt size={118} cor={colors.gold} style={{ position: "absolute", left: 36, top: 30, width: 560 }}>{linha1}</Txt>
    <Pill style={{ position: "absolute", left: 40, top: 300, transform: "rotate(-2deg)" }}>{linha2}</Pill>
    <div style={{ position: "absolute", left: 40, top: 450, width: 560, background: "#F5F0E8", borderRadius: 28, padding: "22px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.55)", display: "flex", gap: 18, alignItems: "flex-start" }}>
      <Faisca size={74} tile={false} />
      <div style={{ ...FONT, fontSize: 44, lineHeight: 1.1, color: "#2B2118", fontWeight: 800 }}>{prompt}</div>
    </div>
    {shot ? <Img src={pasta(slug, shot)} style={{ position: "absolute", right: 30, top: 60, width: 600, borderRadius: 22, border: `8px solid ${colors.green}`, boxShadow: "0 26px 70px rgba(0,0,0,0.65)", transform: "rotate(2deg)" }} /> : null}
    <Seta style={{ left: 560, top: 380 }} rot={-20} />
    <Pant slug={slug} pose={pose} style={{ right: -30, bottom: -60, width: 420 }} />
  </AbsoluteFill>
);

// C: ANTES x DEPOIS (contraste forte, diagonal).
const C = ({ slug, antes = "5 HORAS EDITANDO", depois = "1 PEDIDO" }) => (
  <AbsoluteFill style={{ background: "#0b0720" }}>
    <AbsoluteFill style={{ background: "linear-gradient(120deg, #3a3a44 0%, #1c1c24 52%, transparent 52.2%)", filter: "grayscale(1)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(120deg, transparent 52%, #FF6A00 52.2%, #FFB020 100%)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, clipPath: "polygon(52% 0, 54% 0, 40% 100%, 38% 100%)", background: "#fff" }} />
    <Pant slug={slug} pose="triste" style={{ left: -40, bottom: -50, width: 520, filter: "grayscale(0.8) brightness(0.8)" }} />
    <Pant slug={slug} pose="comemorando" style={{ right: -30, bottom: -50, width: 560 }} />
    <Txt size={96} cor="#C9C9D4" style={{ position: "absolute", left: 30, top: 40, width: 520 }}>{antes}</Txt>
    <Txt size={140} cor="#fff" style={{ position: "absolute", right: 30, top: 40, width: 560, textAlign: "right" }}>{depois}</Txt>
    <div style={{ position: "absolute", left: 520, top: 560 }}><Faisca size={140} /></div>
  </AbsoluteFill>
);

export const CapaV2 = ({ variante = "a", ...p }) => (variante === "b" ? <B {...p} /> : variante === "c" ? <C {...p} /> : <A {...p} />);
