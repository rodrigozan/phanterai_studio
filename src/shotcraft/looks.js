// Tokens visuais por série. O Shotcraft entra com o movimento; a pele é sempre a nossa (princípio 2 do
// SKILL.md do Shotcraft: herdar só estrutura, ritmo e parâmetros dos cartões, e re-vestir com o produto).
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { colors as pantera } from "../theme";

const sora = loadSora("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] }).fontFamily;
const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
const poppins = loadPoppins("normal", { weights: ["700", "900"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const LOOKS = {
  // brand-profile/references/phanterai.md (o mesmo do ShortScion)
  phanterai: {
    title: { fontFamily: sora, fontWeight: 800, color: "#F8FAFC" },
    label: { fontFamily: mono, fontWeight: 700, color: "#F8FAFC", letterSpacing: "0.14em", textTransform: "uppercase" },
    accent: "#FF1FBF",
    accentGrad: "linear-gradient(90deg, #B0179F 0%, #FF1FBF 55%, #FF5BD6 100%)",
    scrim: "rgba(8,8,16,0.72)",
    flash: "rgba(255,91,214,0.55)",
    shadow: "0 6px 30px rgba(0,0,0,0.65)",
  },
  // canal Aprenda YouTube (src/theme.js: Poppins 900, violeta/dourado)
  pantera: {
    title: { fontFamily: poppins, fontWeight: 900, color: pantera.text },
    label: { fontFamily: poppins, fontWeight: 700, color: pantera.text, letterSpacing: "0.12em", textTransform: "uppercase" },
    accent: pantera.gold,
    accentGrad: `linear-gradient(90deg, ${pantera.violet} 0%, ${pantera.violetLight} 100%)`,
    scrim: "rgba(5,4,12,0.70)",
    flash: "rgba(245,243,255,0.75)",
    shadow: "0 6px 30px rgba(0,0,0,0.6)",
  },
  // anime-power-biblia: o render.mjs escreve com DejaVu Serif Bold branca, contorno preto e caixa preta 35%
  anime: {
    title: { fontFamily: "DejaVu Serif", fontWeight: 700, color: "#FFFFFF", WebkitTextStroke: "0px", textShadow: "0 0 3px #000, 0 0 3px #000, 0 3px 10px rgba(0,0,0,0.85)" },
    label: { fontFamily: "DejaVu Serif", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.16em", textTransform: "uppercase", textShadow: "0 0 3px #000, 0 2px 8px rgba(0,0,0,0.85)" },
    accent: "#FFFFFF",
    accentGrad: "linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.95), rgba(255,255,255,0.0))",
    scrim: "rgba(0,0,0,0.35)",
    flash: "rgba(255,248,235,0.95)",
    shadow: "0 3px 10px rgba(0,0,0,0.85)",
  },
};

export const getLook = (name) => {
  const look = LOOKS[name];
  if (!look) throw new Error(`ShotcraftFinish: look "${name}" não existe (use ${Object.keys(LOOKS).join(", ")})`);
  return look;
};
