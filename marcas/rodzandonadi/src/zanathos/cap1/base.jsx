import { cloneElement } from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDarker } from "@remotion/google-fonts/DarkerGrotesque";

const darker = loadDarker("normal", { weights: ["700", "800", "900"] });
export const DG = `${darker.fontFamily}, sans-serif`;
export const FPS = 30;
export const f = (s) => Math.round(s * FPS);
export const K = {
  vao: "#0B0F1A",
  ouro: "#D9A441",
  osso: "#EDE6D6",
  verde: "#4FA36B",
  agua: "#3FB6C9",
  brasa: "#FF7A2A",
  terra: "#B5563A",
  ceu: "#6FB3F2",
  luz: "#FFFFFF",
};
export const FALTAS = [K.agua, K.verde, K.brasa, K.terra, K.ceu, K.luz];
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
export const ramp = (t, a, d, e = Easing.inOut(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...cl, easing: e });
export const pulse = (t, a, d) => interpolate(t, [a, a + d * 0.2, a + d], [0, 1, 0], cl);

export const Fundo = ({ frame, brilho = 1 }) => {
  const resp = 0.5 + 0.5 * Math.sin(frame / 48);
  const seed = Math.floor(frame / 3) % 6;
  return (
    <AbsoluteFill style={{ background: K.vao }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 42% at 50% 46%, rgba(217,164,65,${(0.05 + resp * 0.05) * brilho}) 0%, rgba(40,50,90,${(0.2 + resp * 0.12) * brilho}) 38%, transparent 75%)` }} />
      <svg width={1080} height={1920} viewBox="0 0 540 960" style={{ position: "absolute", inset: 0, opacity: 0.14 }}>
        <filter id="grao" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.85  0 0 0 0 0.9  0 0 0 0.9 -0.3" />
        </filter>
        <rect width={540} height={960} filter="url(#grao)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const ln = (d, c, w = 3, extra = {}) => ({ d, fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round", ...extra });

export const Figura = ({ x, y, s = 1, draw = 1, pose = "stand", tremor = 0, cor = K.ouro, frame = 0, op = 1, passo = 0 }) => {
  const tx = tremor ? Math.sin(frame * 2.9) * tremor : 0;
  const ty = tremor ? Math.cos(frame * 3.7) * tremor : 0;
  const respira = Math.sin(frame / 20) * 2;
  let corpo, bracoE, bracoD, pernaE, pernaD, dy = 0;
  corpo = "M-58,-165 L58,-165 L40,-30 L-40,-30 Z";
  bracoE = "M-58,-160 L-80,-90 L-72,-20";
  bracoD = "M58,-160 L80,-90 L72,-20";
  pernaE = "M-24,-30 L-30,70 L-34,160";
  pernaD = "M24,-30 L30,70 L34,160";
  if (pose === "garganta") bracoD = "M58,-160 L105,-115 L14,-176";
  if (pose === "mao") bracoD = "M58,-160 L108,-235 L118,-320";
  if (pose === "sentado") {
    dy = 95;
    pernaE = "M-24,-30 L90,-26 L96,90";
    pernaD = "M24,-30 L130,-22 L136,90";
    bracoE = "M-58,-160 L-78,-95 L10,-60";
    bracoD = "M58,-160 L84,-100 L36,-52";
  }
  if (pose === "andando") {
    const a = Math.sin(passo * Math.PI * 2);
    pernaE = `M-24,-30 L${-30 + a * 55},70 L${-34 + a * 90},160`;
    pernaD = `M24,-30 L${30 - a * 55},70 L${34 - a * 90},160`;
    bracoE = `M-58,-160 L${-80 - a * 30},-90 L${-72 - a * 40},-20`;
    bracoD = `M58,-160 L${80 + a * 30},-100 L${40},-70`;
  }
  const els = [
    <circle key="h" cx={0} cy={-218 + respira * 0.5} r={38} />,
    <path key="p" d="M0,-180 L0,-165" />,
    <path key="c" d={corpo} />,
    <path key="be" d={bracoE} />,
    <path key="bd" d={bracoD} />,
    <path key="pe" d={pernaE} />,
    <path key="pd" d={pernaD} />,
  ];
  return (
    <g opacity={op} transform={`translate(${x + tx} ${y + ty + dy * s}) scale(${s})`} style={{ filter: `drop-shadow(0 0 10px ${cor}aa)` }}>
      <g fill="none" stroke={cor} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
        {els.map((e) => cloneElement(e, { pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - draw }))}
      </g>
    </g>
  );
};

export const Ponto = ({ x, y, r = 14, cor = K.ouro, op = 1, brilho = 1 }) => (
  <g opacity={op}>
    <circle cx={x} cy={y} r={r * 3.4} fill={cor} opacity={0.14 * brilho} />
    <circle cx={x} cy={y} r={r * 1.8} fill={cor} opacity={0.3 * brilho} />
    <circle cx={x} cy={y} r={r} fill={cor} />
    <circle cx={x} cy={y} r={r * 0.45} fill="#fff" opacity={0.85} />
  </g>
);

export const Gancho = ({ t, texto, destaque }) => {
  const s = interpolate(t, [0, 0.25], [1.15, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const op = interpolate(t, [0, 0.15, 2.7, 3.2], [0, 1, 1, 0], cl);
  if (op <= 0) return null;
  const partes = texto.split(destaque);
  return (
    <div style={{ position: "absolute", top: 250, left: 70, right: 70, textAlign: "center", fontFamily: DG, fontWeight: 900, fontSize: 104, lineHeight: 0.98, color: K.osso, opacity: op, transform: `scale(${s})`, textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
      {partes[0]}
      <span style={{ color: K.ouro, textShadow: `0 0 40px ${K.ouro}77` }}>{destaque}</span>
      {partes[1]}
    </div>
  );
};

export const Fecho = ({ t, ini, texto }) => {
  const op = interpolate(t, [ini, ini + 0.35], [0, 1], cl);
  if (op <= 0) return null;
  const s = interpolate(t, [ini, ini + 0.4], [0.92, 1], { ...cl, easing: Easing.out(Easing.back(1.6)) });
  const [a, ...b] = texto.split(": ");
  return (
    <div style={{ position: "absolute", top: 760, left: 80, right: 80, textAlign: "center", fontFamily: DG, opacity: op, transform: `scale(${s})` }}>
      <div style={{ fontSize: 56, fontWeight: 800, color: K.ouro, letterSpacing: 4, textTransform: "uppercase" }}>{a}</div>
      <div style={{ width: 140, height: 4, background: K.ouro, margin: "22px auto 26px", borderRadius: 2 }} />
      <div style={{ fontSize: 108, fontWeight: 900, color: K.osso, lineHeight: 0.98 }}>{b.join(": ")}</div>
    </div>
  );
};

const chunksDe = (words) => {
  const out = [];
  let cur = [];
  words.forEach((w, i) => {
    cur.push({ ...w, i });
    if (cur.length === 3 || /[.,:!?]$/.test(w.w)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out.map((c, k) => ({ words: c, s: c[0].s, e: out[k + 1] ? Math.min(c[c.length - 1].e + 0.3, out[k + 1][0].s) : c[c.length - 1].e + 0.5 }));
};

export const Legendas = ({ t, chunks, fim }) => {
  const c = chunks.find((ch) => t >= ch.s - 0.05 && t < ch.e);
  if (!c || t > fim + 0.3) return null;
  const p = interpolate(t, [c.s - 0.05, c.s + 0.08], [0.88, 1], cl);
  return (
    <div style={{ position: "absolute", top: 1440, width: "100%", display: "flex", justifyContent: "center", padding: "0 60px", boxSizing: "border-box" }}>
      <div style={{ transform: `scale(${p})`, display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", fontFamily: DG, fontWeight: 900, fontSize: 88, lineHeight: 1, textTransform: "uppercase" }}>
        {c.words.map((w) => (
          <span key={w.i} style={{ color: t >= w.s - 0.03 ? K.ouro : K.osso, WebkitTextStroke: "11px #05070d", paintOrder: "stroke fill", textShadow: "0 6px 14px rgba(0,0,0,0.6)" }}>
            {w.w.replace(/[.,:!?]$/, "")}
          </span>
        ))}
      </div>
    </div>
  );
};
export { chunksDe };

export const Meme = ({ t, ini, fim, topo, base, children }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  if (t < ini || t > fim + 0.3) return null;
  const e = spring({ frame: frame - f(ini), fps, config: { damping: 13, stiffness: 150 } });
  const sai = interpolate(t, [fim, fim + 0.25], [1, 0], cl);
  const txt = { position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: DG, fontWeight: 900, fontSize: 64, lineHeight: 0.95, textTransform: "uppercase", color: "#fff", WebkitTextStroke: "10px #05070d", paintOrder: "stroke fill", padding: "0 24px", boxSizing: "border-box" };
  return (
    <div style={{ position: "absolute", left: 90, top: 380, width: 900, height: 880, opacity: sai, transform: `scale(${(0.7 + e * 0.3) * (0.96 + sai * 0.04)}) rotate(${(1 - e) * -6 - 1.5}deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: K.osso, border: `7px solid ${K.ouro}`, boxShadow: "0 30px 90px rgba(0,0,0,0.7)", overflow: "hidden" }}>
        <svg viewBox="0 0 800 780" width={886} height={866} style={{ position: "absolute", left: 0, top: 0 }}>{children(frame)}</svg>
        <div style={{ ...txt, top: 18 }}>{topo}</div>
        <div style={{ ...txt, bottom: 18 }}>{base}</div>
      </div>
    </div>
  );
};

const I = "#14182a";
const cara = (cx, cy, r, olhos = 1, boca = "reta", pupX = 0) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#fff6dd" stroke={I} strokeWidth={6} />
    <circle cx={cx - r * 0.36} cy={cy - r * 0.1} r={r * 0.2 * olhos} fill="#fff" stroke={I} strokeWidth={4} />
    <circle cx={cx + r * 0.36} cy={cy - r * 0.1} r={r * 0.2 * olhos} fill="#fff" stroke={I} strokeWidth={4} />
    <circle cx={cx - r * 0.36 + pupX} cy={cy - r * 0.1} r={r * 0.08} fill={I} />
    <circle cx={cx + r * 0.36 + pupX} cy={cy - r * 0.1} r={r * 0.08} fill={I} />
    {boca === "reta" ? <path d={`M${cx - r * 0.3},${cy + r * 0.45} L${cx + r * 0.3},${cy + r * 0.45}`} stroke={I} strokeWidth={5} strokeLinecap="round" /> : null}
    {boca === "o" ? <ellipse cx={cx} cy={cy + r * 0.5} rx={r * 0.17} ry={r * 0.24} fill={I} /> : null}
    {boca === "triste" ? <path d={`M${cx - r * 0.3},${cy + r * 0.6} Q${cx},${cy + r * 0.3} ${cx + r * 0.3},${cy + r * 0.6}`} stroke={I} strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
    {boca === "sorri" ? <path d={`M${cx - r * 0.4},${cy + r * 0.3} Q${cx},${cy + r * 0.8} ${cx + r * 0.4},${cy + r * 0.3}`} stroke={I} strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
  </g>
);

export const Pic = {
  reuniao: (fr) => (
    <g transform="translate(0 40)">
      <rect x={0} y={560} width={800} height={160} fill="#d4c9ae" />
      {[110, 260, 410, 560, 700].map((x, i) => (
        <g key={i} transform={`translate(0 ${Math.sin(fr / 14 + i) * 2})`}>
          {cara(x, 400, 62, 1.25, "reta")}
          <path d={`M${x - 90},640 Q${x},470 ${x + 90},640 Z`} fill={i % 2 ? "#6a4c93" : "#3f6fa0"} stroke={I} strokeWidth={6} />
          <path d={`M${x + 56},352 Q${x + 70},384 ${x + 56},392 Q${x + 42},384 ${x + 56},352 Z`} fill="#9fd8ff" stroke={I} strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(fr / 5 + i)} />
        </g>
      ))}
      <text x={400} y={250} textAnchor="middle" fontFamily={DG} fontSize={80} fontWeight={900} fill={I} opacity={0.75}>. . .</text>
    </g>
  ),
  eracomigo: (fr) => {
    const px = Math.sin(fr / 5) * 11;
    return (
      <g transform="translate(0 40)">
        {[[200, 520, "#3FB6C9"], [400, 560, "#4FA36B"], [600, 520, "#FF7A2A"], [300, 360, "#B5563A"], [500, 340, "#6FB3F2"], [400, 200, "#bbb"]].map(([x, y, c], i) => (
          <g key={i} transform={`translate(0 ${Math.sin(fr / 18 + i) * 6})`}>
            <circle cx={x} cy={y} r={78} fill={c} stroke={I} strokeWidth={6} opacity={0.9} />
            <circle cx={x - 26} cy={y - 8} r={20} fill="#fff" stroke={I} strokeWidth={4} />
            <circle cx={x + 26} cy={y - 8} r={20} fill="#fff" stroke={I} strokeWidth={4} />
            <circle cx={x - 26 + px} cy={y - 8} r={8} fill={I} />
            <circle cx={x + 26 + px} cy={y - 8} r={8} fill={I} />
          </g>
        ))}
      </g>
    );
  },
  quatrocentos: (fr) => (
    <g transform="translate(0 30)">
      <rect x={90} y={200} width={620} height={440} rx={22} fill="#fff" stroke={I} strokeWidth={7} />
      <rect x={90} y={200} width={620} height={64} rx={22} fill="#cfd6e6" stroke={I} strokeWidth={7} />
      {[130, 168, 206].map((x, i) => <circle key={i} cx={x} cy={232} r={11} fill={["#ff6b6b", "#ffd166", "#4FA36B"][i]} stroke={I} strokeWidth={3} />)}
      <text x={400} y={470} textAnchor="middle" fontFamily={DG} fontSize={190} fontWeight={900} fill={I} transform={`rotate(${Math.sin(fr / 6) * 1.5} 400 430)`}>404</text>
      {cara(400, 560, 48, 1, "triste")}
    </g>
  ),
  expectativa: (fr) => {
    const emaranhado = Array.from({ length: 22 }, (_, i) => `${i ? "L" : "M"}${390 + 160 + random(`e${i}x`) * 300 * 0.9},${300 + random(`e${i}y`) * 330}`).join(" ");
    return (
      <g transform="translate(0 40)">
        <rect x={20} y={170} width={370} height={470} rx={16} fill="#fff" stroke={I} strokeWidth={6} />
        <rect x={410} y={170} width={370} height={470} rx={16} fill="#fff" stroke={I} strokeWidth={6} />
        <text x={205} y={220} textAnchor="middle" fontFamily={DG} fontSize={38} fontWeight={900} fill={I}>NA CABEÇA</text>
        <text x={595} y={220} textAnchor="middle" fontFamily={DG} fontSize={38} fontWeight={900} fill={I}>NO MUNDO</text>
        {[0, 1, 2, 3].map((i) => <path key={`a${i}`} d={`M60,${290 + i * 80} L350,${290 + i * 80} M${90 + i * 80},260 L${90 + i * 80},620`} stroke="#3f6fa0" strokeWidth={5} />)}
        <path d={emaranhado} stroke="#b5563a" strokeWidth={5} fill="none" strokeLinejoin="round" transform={`translate(${Math.sin(fr / 4) * 1.5} 0)`} />
        <path d="M420,260 L760,260" stroke="#b5563a" strokeWidth={4} strokeDasharray="10 16" />
      </g>
    );
  },
  voz: (fr) => (
    <g transform="translate(0 30)">
      <rect x={470} y={170} width={260} height={470} rx={36} fill="#2a2f45" stroke={I} strokeWidth={7} />
      <rect x={490} y={215} width={220} height={350} rx={10} fill="#e9eefc" />
      {Array.from({ length: 11 }, (_, i) => {
        const h = 24 + Math.abs(Math.sin(fr / 4 + i * 1.3)) * 120;
        return <rect key={i} x={502 + i * 19} y={390 - h / 2} width={11} height={h} rx={5} fill="#d9a441" />;
      })}
      <circle cx={600} cy={598} r={14} fill="#cfd6e6" />
      {cara(230, 390, 118, 1.5, "o")}
      <path d="M170,274 Q230,238 290,274" stroke={I} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M120,520 Q150,470 190,470 M340,520 Q310,470 270,470" stroke={I} strokeWidth={7} fill="none" strokeLinecap="round" />
      <rect x={100} y={500} width={260} height={150} rx={50} fill="#6a4c93" stroke={I} strokeWidth={6} />
    </g>
  ),
  regua: (fr) => (
    <g transform="translate(0 30)">
      <g transform={`rotate(${-12 + Math.sin(fr / 10) * 1} 260 400)`}>
        <rect x={60} y={340} width={380} height={86} fill="#e8c46a" stroke={I} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${90 + i * 30},340 L${90 + i * 30},${i % 2 ? 372 : 392}`} stroke={I} strokeWidth={4} />)}
        <path d="M440,340 L400,380 L440,400 L410,426" stroke={I} strokeWidth={6} fill="none" />
      </g>
      <g transform={`rotate(${14 + Math.sin(fr / 9) * 1.2} 560 440)`}>
        <rect x={430} y={410} width={320} height={86} fill="#e8c46a" stroke={I} strokeWidth={6} />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${460 + i * 30},410 L${460 + i * 30},${i % 2 ? 442 : 462}`} stroke={I} strokeWidth={4} />)}
      </g>
      <g transform="translate(250 540) rotate(-4)">
        <rect width={300} height={150} fill="#fff" stroke={I} strokeWidth={5} />
        <text x={150} y={46} textAnchor="middle" fontFamily={DG} fontSize={32} fontWeight={900} fill={I}>PEDIDO DE</text>
        <text x={150} y={84} textAnchor="middle" fontFamily={DG} fontSize={32} fontWeight={900} fill={I}>DEMISSÃO</text>
        <path d="M40,116 L260,116" stroke={I} strokeWidth={4} />
      </g>
    </g>
  ),
  ctrlz: (fr) => (
    <g transform="translate(0 40)">
      {[["CTRL", 100, 300], ["Z", 470, 300]].map(([l, x, w], i) => (
        <g key={l} transform={`translate(${x} ${240 + Math.sin(fr / 6 + i * 2) * 4})`}>
          <rect x={0} y={20} width={w - 40 > 0 ? 250 : 250} height={250} rx={36} fill="#2a2f45" stroke={I} strokeWidth={7} />
          <rect x={0} y={0} width={250} height={240} rx={36} fill="#e7ecf8" stroke={I} strokeWidth={7} />
          <text x={125} y={150} textAnchor="middle" fontFamily={DG} fontSize={l === "Z" ? 170 : 90} fontWeight={900} fill={I}>{l}</text>
        </g>
      ))}
      <path d="M60,200 L740,560 M740,200 L60,560" stroke="#e03b3b" strokeWidth={26} strokeLinecap="round" opacity={0.9} />
    </g>
  ),
  aprovado: (fr) => (
    <g transform="translate(0 30)">
      <g>
        <rect x={20} y={130} width={760} height={260} rx={20} fill="#f6efe0" stroke={I} strokeWidth={6} />
        {cara(150, 262, 80, 1, "triste", -10)}
        <path d="M60,310 Q150,340 240,310" stroke="none" fill="none" />
        <text x={500} y={236} textAnchor="middle" fontFamily={DG} fontSize={46} fontWeight={900} fill={I}>deixar um cantinho</text>
        <text x={500} y={290} textAnchor="middle" fontFamily={DG} fontSize={46} fontWeight={900} fill={I}>em branco</text>
        <path d="M660,170 L740,250 M740,170 L660,250" stroke="#e03b3b" strokeWidth={14} strokeLinecap="round" />
      </g>
      <g>
        <rect x={20} y={410} width={760} height={260} rx={20} fill="#f6efe0" stroke={I} strokeWidth={6} />
        {cara(150, 542, 80, 1, "sorri")}
        <text x={500} y={516} textAnchor="middle" fontFamily={DG} fontSize={46} fontWeight={900} fill={I}>plano perfeito,</text>
        <text x={500} y={570} textAnchor="middle" fontFamily={DG} fontSize={46} fontWeight={900} fill={I}>sem folga nenhuma</text>
        <path d="M650,500 L690,545 L760,455" stroke="#2f9a55" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),
};
