import { interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { colors } from "../theme";

const { fontFamily: MONO } = loadFont("normal", { weights: ["500", "700"] });
const CIANO = "#22D3EE";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PAUSA_APOS_COMANDO = 10;
const CICLO_CURSOR = 15;

// Comando em branco, flags (--x) em amarelo, nome de modelo (algo:cloud) em ciano.
const Colorido = ({ texto }) =>
  texto.split(/(\s+)/).map((p, i) => {
    const cor = p.startsWith("--") ? colors.gold : /:cloud$|-cloud$/.test(p) ? CIANO : "#fff";
    return <span key={i} style={{ color: cor }}>{p}</span>;
  });

// Agenda cada linha: comando digita (charsPerFrame), pausa de 10 frames, saída aparece sem digitar.
const agendar = (lines, charsPerFrame) => {
  let cursor = 0;
  return lines.map((l) => {
    const ini = cursor + (l.delay ?? 0);
    if (l.type === "command") {
      const dur = Math.ceil(l.text.length / charsPerFrame);
      cursor = ini + dur + PAUSA_APOS_COMANDO;
      return { ...l, ini, dur };
    }
    cursor = ini + 4;
    return { ...l, ini, dur: 0 };
  });
};

export const TerminalTypewriter = ({ lines, titulo = "bash — phanter", charsPerFrame = 1.5, startAt = 0, fontSize = 38, width = 940, style = {} }) => {
  const frame = useCurrentFrame() - startAt;
  const plano = agendar(lines, charsPerFrame);
  const visiveis = plano.filter((l) => frame >= l.ini);
  const ultima = visiveis[visiveis.length - 1];
  const entrada = interpolate(frame, [-6, 0], [0, 1], clamp);
  const piscaligado = Math.floor(frame / (CICLO_CURSOR / 2)) % 2 === 0;
  return (
    <div style={{ width, borderRadius: 28, background: "#0D1117", boxShadow: "0 30px 80px rgba(0,0,0,0.65), 0 0 0 2px #ffffff18", overflow: "hidden", opacity: entrada, transform: `translateY(${(1 - entrada) * 40}px)`, ...style }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", gap: 14, padding: "0 26px", background: "#161B22" }}>
        {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 20, height: 20, borderRadius: "50%", background: c }} />)}
        <div style={{ flex: 1, textAlign: "center", color: "#8B949E", fontFamily: MONO, fontSize: 24, marginRight: 80 }}>{titulo}</div>
      </div>
      <div style={{ padding: "34px 36px 40px", fontFamily: MONO, fontWeight: 500, fontSize, lineHeight: 1.45, minHeight: 330 }}>
        {visiveis.map((l, i) => {
          const eUltima = l === ultima;
          const cursor = eUltima && piscaligado ? <span style={{ display: "inline-block", width: fontSize * 0.55, height: fontSize * 1.05, background: "#fff", verticalAlign: "text-bottom", marginLeft: 4 }} /> : null;
          if (l.type === "command") {
            const n = Math.min(l.text.length, Math.floor((frame - l.ini) * charsPerFrame));
            return (
              <div key={i} style={{ overflowWrap: "anywhere", marginBottom: 6 }}>
                <span style={{ color: CIANO, fontWeight: 700 }}>$ </span>
                <Colorido texto={l.text.slice(0, n)} />
                {cursor}
              </div>
            );
          }
          return <div key={i} style={{ color: "#9AA4B2", overflowWrap: "anywhere", marginBottom: 6 }}>{l.text}{cursor}</div>;
        })}
      </div>
    </div>
  );
};
