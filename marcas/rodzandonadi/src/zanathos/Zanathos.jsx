import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadCinzelDec } from "@remotion/google-fonts/CinzelDecorative";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadDarker } from "@remotion/google-fonts/DarkerGrotesque";
import palavras from "../../../../public/rodzandonadi/episodes/zanathos-ep1/audio/words.json";
import { ANCESTRAIS, C, CHIPS, CONTINENTE, FPS, RACAS, T, f } from "./world";
import { MapaZanathos, prog } from "./Mapa";

loadCinzelDec("normal", { weights: ["700", "900"] });
loadCinzel("normal", { weights: ["700", "900"] });
const darker = loadDarker("normal", { weights: ["700", "800", "900"] });
const DG = `${darker.fontFamily}, sans-serif`;
const CZD = "'Cinzel Decorative', serif";

export const ZANATHOS_FRAMES = f(T.fim);
const EP = (rel) => staticFile(`rodzandonadi/episodes/zanathos-ep1/${rel}`);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const easeIO = Easing.inOut(Easing.cubic);
const WORDS = palavras.words;

const CAM = [
  { t: 0, x: 540, y: 960, s: 1, d: 0 },
  { t: T.kasembe - 0.1, x: 540, y: 1100, s: 1.8, d: 1.1 },
  { t: T.queda, x: 540, y: 1000, s: 1, d: 1.2 },
  { t: T.povos, x: 540, y: 1020, s: 1.12, d: 1.0 },
  ...RACAS.map((r) => ({ t: r.t - 0.35, x: r.alvo.x, y: r.alvo.y, s: r.alvo.s, sy: 1200, d: 0.7 })),
  { t: T.capitais - 0.2, x: 540, y: 640, s: 1.35, sy: 960, d: 0.8 },
  { t: T.capitais + 0.6, x: 540, y: 1420, s: 1.35, d: 2.2 },
  { t: T.mapaFinal - 0.3, x: 540, y: 1000, s: 1.0, d: 0.9 },
  { t: T.proximo + 0.1, x: 540, y: 1182, s: 2.5, d: 1.2 },
];

const camera = (t) => {
  let st = { x: 540, y: 960, s: 1, sy: 960 };
  for (const k of CAM) {
    const p = k.d ? interpolate(t, [k.t, k.t + k.d], [0, 1], { ...cl, easing: easeIO }) : 1;
    if (p <= 0) break;
    const sy = k.sy ?? 960;
    st = { x: st.x + (k.x - st.x) * p, y: st.y + (k.y - st.y) * p, s: st.s + (k.s - st.s) * p, sy: st.sy + (sy - st.sy) * p };
  }
  return st;
};

const shake = (t, frame) => {
  const a = t >= T.caiu ? 6 * Math.exp(-(t - T.caiu) * 1.4) : 0;
  return [Math.sin(frame * 1.7) * a + Math.sin(frame * 3.1) * a * 0.5, Math.cos(frame * 2.3) * a];
};

const Papel = ({ op }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: op }}>
    <defs>
      <filter id="grao">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
        <feColorMatrix values="0 0 0 0 0.17  0 0 0 0 0.11  0 0 0 0 0.08  0 0 0 0.16 0" />
      </filter>
      <filter id="manchas">
        <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="3" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.16  0 0 0 0.45 -0.12" />
      </filter>
      <radialGradient id="vinheta" cx="50%" cy="50%" r="75%">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#3a2410" stopOpacity="0.55" />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={C.papel} />
    <rect width={1080} height={1920} filter="url(#manchas)" />
    <rect width={1080} height={1920} filter="url(#grao)" />
    <rect width={1080} height={1920} fill="url(#vinheta)" />
  </svg>
);

const BordaAfricana = ({ op, frame }) => {
  const tri = [];
  for (let i = 0; i < 46; i++) {
    const y = i * 42;
    tri.push(<polygon key={`l${i}`} points={`0,${y} 26,${y + 21} 0,${y + 42}`} fill={i % 2 ? C.tinta : C.forjas} />);
    tri.push(<polygon key={`r${i}`} points={`1080,${y} 1054,${y + 21} 1080,${y + 42}`} fill={i % 2 ? C.tinta : C.forjas} />);
  }
  for (let i = 0; i < 27; i++) {
    const x = i * 42;
    tri.push(<polygon key={`t${i}`} points={`${x},0 ${x + 21},22 ${x + 42},0`} fill={i % 2 ? C.forjas : C.tinta} />);
    tri.push(<polygon key={`b${i}`} points={`${x},1920 ${x + 21},1898 ${x + 42},1920`} fill={i % 2 ? C.forjas : C.tinta} />);
  }
  const brilho = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: op }}>
      {tri}
      <rect x={34} y={30} width={1012} height={1860} fill="none" stroke={C.tinta} strokeWidth={3} />
      <rect x={42} y={38} width={996} height={1844} fill="none" stroke={C.ouro} strokeWidth={2} opacity={0.5 + brilho * 0.5} strokeDasharray="24 8 4 8" />
    </svg>
  );
};

const Estrelas = ({ frame, op }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: op }}>
    {Array.from({ length: 140 }, (_, i) => {
      const x = random(`ex${i}`) * 1080;
      const y = random(`ey${i}`) * 1920;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / (10 + random(`et${i}`) * 20) + i));
      return <circle key={i} cx={x} cy={y} r={0.8 + random(`er${i}`) * 1.8} fill="#fff" opacity={tw * 0.8} />;
    })}
  </svg>
);

const FundoCanal = ({ frame, op }) => {
  const a = Math.sin(frame / 90) * 60;
  return (
    <AbsoluteFill style={{ opacity: op, background: C.canalRoxoEscuro }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at ${50 + a / 40}% 45%, ${C.canalRoxo}88 0%, transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.canalRoxo}26 2px, transparent 2px), linear-gradient(90deg, ${C.canalRoxo}26 2px, transparent 2px)`, backgroundSize: "96px 96px" }} />
    </AbsoluteFill>
  );
};

const Hook = ({ t, frame }) => {
  const imp = interpolate(frame, [0, 8], [1.18, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const out = interpolate(t, [T.disse - 0.2, T.disse + 0.2], [1, 0], cl);
  const draw = interpolate(frame, [0, 70], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const pisca = t > 0.5 && t < 1.4 ? (Math.sin(frame * 2.2) > -0.2 ? 1 : 0.25) : interpolate(t, [0, 0.5], [0, 1], cl);
  const hit2 = interpolate(t, [2.15, 2.3, 2.6], [1, 1.08, 1], cl);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glowH" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`translate(540 1180) scale(${0.78 * imp}) translate(-540 -1130)`}>
          <path d={CONTINENTE} fill="none" stroke={C.ouro} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} filter="url(#glowH)" />
          <circle cx={540} cy={1180} r={20 + 10 * Math.sin(frame / 4)} fill={C.ouro} opacity={draw * 0.8} filter="url(#glowH)" />
        </g>
        <text x={540} y={340} textAnchor="middle" fontFamily={CZD} fontWeight={900} fontSize={92} letterSpacing={10} fill={C.ouro} opacity={pisca} filter="url(#glowH)">
          ZANATHOS
        </text>
      </svg>
      <div style={{ position: "absolute", top: 430, width: "100%", textAlign: "center", transform: `scale(${imp * hit2})`, fontFamily: DG, lineHeight: 0.92 }}>
        <div style={{ fontSize: 96, fontWeight: 800, color: C.canalCinza }}>Ele criou um</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: C.canalAmarelo, textShadow: `0 0 40px ${C.canalAmarelo}66` }}>mundo inteiro.</div>
      </div>
    </AbsoluteFill>
  );
};

const MSGS = [
  { t: T.disse - 0.5, eu: true, txt: "Com Opus você consegue desenhar mapas?" },
  { t: T.disse + 0.2, eu: false, txt: "Sim! Mapas em SVG, até de fantasia. E dá pra virar vídeo só com código." },
  { t: T.entao, eu: true, txt: "Então bora criar um mundo original." },
  { t: T.zanathos - 0.1, eu: false, txt: "Zanathos.", grande: true },
];

const Chat = ({ t, frame }) => {
  const { fps } = useVideoConfig();
  const ent = spring({ frame: frame - f(T.disse - 0.7), fps, config: { damping: 16 } });
  const out = interpolate(t, [T.cosmos - 0.3, T.cosmos], [1, 0], cl);
  if (t < T.disse - 0.8 || t > T.cosmos + 0.1) return null;
  const vis = MSGS.filter((m) => t >= m.t - 0.6);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 400, height: 880, borderRadius: 36, background: "#2a0f33", border: `3px solid ${C.canalRoxo}`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", transform: `translateY(${(1 - ent) * 140}px) scale(${0.9 + ent * 0.1})`, opacity: ent, overflow: "hidden", fontFamily: DG }}>
        <div style={{ height: 96, display: "flex", alignItems: "center", gap: 18, padding: "0 34px", borderBottom: `2px solid ${C.canalRoxo}`, color: C.canalCinza, fontSize: 40, fontWeight: 800 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: C.canalAmarelo }} />
          Claude
          <div style={{ marginLeft: "auto", fontSize: 30, fontWeight: 700, opacity: 0.6 }}>worldbuilding</div>
        </div>
        <div style={{ padding: 34, display: "flex", flexDirection: "column", gap: 26, justifyContent: "flex-end", height: 784, boxSizing: "border-box" }}>
          {vis.map((m, i) => {
            const fr = frame - f(m.t);
            const s = spring({ frame: fr, fps, config: { damping: 14, stiffness: 160 } });
            const digitando = !m.eu && fr < 0;
            const nChars = m.eu ? Math.floor(interpolate(fr, [0, 18], [0, m.txt.length], cl)) : m.txt.length;
            return (
              <div key={i} style={{ alignSelf: m.eu ? "flex-end" : "flex-start", maxWidth: m.grande ? "100%" : "82%", transform: `scale(${digitando ? 1 : 0.85 + s * 0.15})`, transformOrigin: m.eu ? "right bottom" : "left bottom", opacity: digitando ? 1 : s }}>
                <div style={{ padding: m.grande ? "26px 44px" : "22px 30px", borderRadius: 28, background: m.eu ? C.canalAmarelo : "#f3ecf5", color: C.canalRoxoEscuro, fontSize: m.grande ? 110 : 44, fontWeight: m.grande ? 900 : 700, lineHeight: 1.08, fontFamily: m.grande ? CZD : DG, letterSpacing: m.grande ? 4 : 0, boxShadow: m.grande ? `0 0 ${40 + 20 * Math.sin(frame / 5)}px ${C.ouro}` : "none" }}>
                  {digitando ? (
                    <span style={{ letterSpacing: 6, fontSize: 44 }}>{"•••".slice(0, 1 + (Math.floor(frame / 5) % 3))}</span>
                  ) : (
                    m.txt.slice(0, nChars)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cosmos = ({ t, frame }) => {
  const op = interpolate(t, [T.cosmos - 0.2, T.cosmos + 0.3, T.mapa, T.mapa + 0.7], [0, 1, 1, 0], cl);
  if (op <= 0) return null;
  const pOz = prog(t, T.cosmos + 0.05, 0.9);
  const pTed = prog(t, T.ted - 0.2, 1.0);
  const pPlano = prog(t, T.ted + 0.6, 2.2);
  const raios = Array.from({ length: 16 }, (_, i) => i);
  const linhas = [
    "M540,1060 L180,1500", "M540,1060 L900,1500", "M180,1500 L900,1500", "M540,1060 L540,1650",
    "M300,1320 L780,1320", "M180,1500 A360,360 0 0 1 900,1500", "M260,1640 L820,1640", "M540,700 L540,1060",
  ];
  return (
    <AbsoluteFill style={{ opacity: op, background: `radial-gradient(ellipse 80% 50% at 50% 22%, #2a1840 0%, ${C.fundo} 65%)` }}>
      <Estrelas frame={frame} op={1} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="gOz">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.25" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id="glowC" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g opacity={pOz} transform={`translate(540 520) rotate(${frame * 0.15})`}>
          {raios.map((i) => (
            <rect key={i} x={-3} y={-430} width={6} height={300 + (i % 3) * 80} fill="#fff" opacity={0.18} transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle cx={540} cy={520} r={150 + 12 * Math.sin(frame / 10)} fill="url(#gOz)" opacity={pOz} />
        <g opacity={pTed} transform={`translate(0 ${(1 - pTed) * 40})`} filter="url(#glowC)">
          <circle cx={540} cy={930} r={52} fill="none" stroke={C.ouro} strokeWidth={5} />
          <polygon points="540,990 420,1260 660,1260" fill="none" stroke={C.ouro} strokeWidth={5} />
          <polygon points="540,1040 470,1200 610,1200" fill={C.ouro} opacity={0.25} />
          <path d="M470,1060 L330,1150 L300,1120" fill="none" stroke={C.ouro} strokeWidth={5} strokeLinecap="round" />
          <path d="M610,1060 L760,1000" fill="none" stroke={C.ouro} strokeWidth={5} strokeLinecap="round" />
          <path d={`M760,1000 L${760 + Math.cos(frame / 15) * 70},${1000 + 80} M760,1000 L${760 - 40},${1000 + 85}`} fill="none" stroke={C.ouro} strokeWidth={4} />
          <rect x={500} y={1260} width={14} height={110} fill={C.ouro} />
          <rect x={566} y={1260} width={14} height={110} fill={C.ouro} />
        </g>
        <g opacity={pTed * 0.75}>
          {linhas.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.ouro} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog(t, T.ted + 0.5 + i * 0.25, 0.8)} />
          ))}
          <path d={CONTINENTE} fill="none" stroke={C.ouro} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pPlano} transform="translate(540 1300) scale(0.32) translate(-540 -1130)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const Luzes = ({ t, frame }) => {
  const pAp = prog(t, T.sete, 0.5);
  if (pAp <= 0 || t > T.caiu + 0.1) return null;
  return (
    <g>
      {ANCESTRAIS.map((a, i) => {
        const ang = -Math.PI / 2 + (i / 7) * Math.PI * 2;
        const rx = 540 + Math.cos(ang) * 280;
        const ry = 1080 + Math.sin(ang) * 280;
        const voa = prog(t, a.t - 0.5, 0.5);
        const kas = a.n === "Kasembe";
        let x = rx + (a.x - rx) * voa;
        let y = ry + (a.y - ry) * voa;
        let r = 14 + 4 * Math.sin(frame / 6 + i);
        let op = pAp * (kas ? 1 : 1 - prog(t, a.t + 1.0, 0.6) * 0.75);
        if (kas) {
          const cresce = prog(t, T.kasembe, 1.2);
          const sobe = prog(t, T.sobe, 1.4);
          const brilha = prog(t, T.fonte - 0.3, 0.6);
          const cai = interpolate(t, [T.caiu - 0.25, T.caiu], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
          y = y - sobe * 420 + cai * 420;
          r = r + cresce * 18 + brilha * 34 + 6 * Math.sin(frame / 3) * brilha;
        }
        return (
          <g key={a.n} opacity={op}>
            <circle cx={x} cy={y} r={r * 3.2} fill={kas ? "url(#gViol)" : "url(#gLume)"} />
            <circle cx={x} cy={y} r={r * 0.55} fill="#fff" />
            {kas && t > T.caiu - 0.25 ? <line x1={x} y1={y - 380} x2={x} y2={y} stroke={C.violeta} strokeWidth={r * 0.8} strokeLinecap="round" opacity={0.6} /> : null}
            {kas && t > T.fonte + 0.3 ? (
              <path d={`M${x - r},${y - r * 0.4} L${x - r * 0.2},${y} L${x + r * 0.3},${y - r * 0.6} L${x + r},${y + r * 0.2}`} stroke={C.fundo} strokeWidth={4} fill="none" />
            ) : null}
            <text x={x} y={y - r - 20} textAnchor="middle" fontFamily="Cinzel" fontWeight={900} fontSize={kas ? 30 : 24} fill={kas ? "#4b2378" : C.tinta} stroke={C.papel} strokeWidth={6} paintOrder="stroke" opacity={prog(t, kas ? T.coracao : a.t - 0.2, 0.3) * (kas ? 1 - prog(t, T.sobe, 0.4) : 1 - prog(t, a.t + 1.0, 0.4))}>
              {a.n}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const Chip = ({ t }) => {
  let atual = null;
  let inicio = 0;
  for (const [ct, txt] of CHIPS) if (t >= ct) { atual = txt; inicio = ct; }
  if (!atual) return null;
  const p = interpolate(t, [inicio, inicio + 0.25], [0, 1], { ...cl, easing: Easing.out(Easing.back(2)) });
  const mapa = t >= T.mapa;
  return (
    <div style={{ position: "absolute", top: 268, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${(1 - p) * -20}px) scale(${0.9 + p * 0.1})`, opacity: p, padding: "14px 34px", borderRadius: 12, background: mapa ? "rgba(43,29,20,0.92)" : `${C.canalRoxo}ee`, border: `3px solid ${C.canalAmarelo}`, color: C.canalAmarelo, fontFamily: CZD, fontWeight: 900, fontSize: 44, letterSpacing: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>
        {atual}
      </div>
    </div>
  );
};

const AQueda = ({ t, frame }) => {
  const op = interpolate(t, [T.caiu, T.caiu + 0.15, T.lagos - 0.4, T.lagos - 0.1], [0, 1, 1, 0], cl);
  if (op <= 0) return null;
  const s = interpolate(t, [T.caiu, T.caiu + 0.25], [1.6, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", opacity: op, transform: `scale(${s})`, fontFamily: CZD, fontWeight: 900, fontSize: 150, color: C.chama, letterSpacing: 8, textShadow: `0 0 30px ${C.violeta}, 0 0 70px ${C.borda}, 0 6px 0 ${C.fundo}` }}>
      A Queda
    </div>
  );
};

const Flash = ({ t }) => {
  const op = interpolate(t, [T.caiu - 0.02, T.caiu + 0.05, T.caiu + 0.45], [0, 0.95, 0], cl);
  return op > 0 ? <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, #fff 0%, ${C.violeta} 60%, ${C.borda} 100%)`, opacity: op }} /> : null;
};

const Medalhao = ({ tipo, frame }) => {
  const facetas = Array.from({ length: 12 }, (_, i) => {
    const a0 = (i / 12) * Math.PI * 2;
    const a1 = ((i + 1) / 12) * Math.PI * 2;
    const cores = [C.forjas, C.okhu, C.mata, C.borda, C.savana, "#7a3a22"];
    return <polygon key={i} points={`120,120 ${120 + Math.cos(a0) * 108},${120 + Math.sin(a0) * 108} ${120 + Math.cos(a1) * 108},${120 + Math.sin(a1) * 108}`} fill={cores[i % 6]} opacity={0.7} stroke={C.ouro} strokeWidth={2} />;
  });
  const fig = {
    kishi: (
      <g>
        <path d="M66,232 L78,170 Q120,148 162,170 L174,232 Z" fill={C.tinta} />
        <circle cx={120} cy={112} r={46} fill={C.tinta} />
        <ellipse cx={104} cy={112} rx={24} ry={32} fill="#FFF3C4" />
        <circle cx={96} cy={104} r={4} fill={C.tinta} />
        <circle cx={112} cy={104} r={4} fill={C.tinta} />
        <path d="M98,126 Q105,131 112,126" stroke={C.tinta} strokeWidth={3} fill="none" />
        <path d="M156,88 L176,98 L160,106 L178,114 L160,122 L176,130 L156,140" stroke={C.chama} strokeWidth={5} fill="none" strokeLinejoin="round" />
      </g>
    ),
    tikolo: (
      <g>
        <polygon
          points={Array.from({ length: 28 }, (_, i) => {
            const a = (i / 28) * Math.PI * 2;
            const rad = i % 2 ? 50 : 64;
            return `${120 + Math.cos(a) * rad},${150 + Math.sin(a) * rad * 0.9}`;
          }).join(" ")}
          fill={C.tinta}
        />
        <circle cx={104} cy={132} r={9} fill={C.canalAmarelo} />
        <circle cx={136} cy={132} r={9} fill={C.canalAmarelo} />
        <circle cx={178} cy={186} r={16} fill={C.ferro} stroke={C.ouro} strokeWidth={3} />
      </g>
    ),
    anhanga: (
      <g>
        <path d="M104,96 L80,40 M88,60 L64,52 M84,50 L92,26 M136,96 L160,40 M152,60 L176,52 M156,50 L148,26" stroke={C.chama} strokeWidth={7} strokeLinecap="round" fill="none" />
        <path d="M120,226 L88,118 L120,90 L152,118 Z" fill={C.chama} stroke={C.tinta} strokeWidth={4} />
        <path d="M88,118 L66,104 L90,104 Z M152,118 L174,104 L150,104 Z" fill={C.chama} stroke={C.tinta} strokeWidth={3} />
        <ellipse cx={106} cy={130} rx={8} ry={6} fill="#FF5A2A" opacity={0.7 + 0.3 * Math.sin(frame / 3)} />
        <ellipse cx={134} cy={130} rx={8} ry={6} fill="#FF5A2A" opacity={0.7 + 0.3 * Math.sin(frame / 3)} />
      </g>
    ),
    mapingo: (
      <g>
        <path d="M66,232 Q56,120 120,58 Q184,120 174,232 Z" fill={C.tinta} />
        <path d="M66,160 L40,200 M174,160 L200,200" stroke={C.tinta} strokeWidth={16} strokeLinecap="round" />
        <circle cx={120} cy={104} r={17} fill={C.canalAmarelo} />
        <circle cx={120} cy={104} r={7} fill={C.tinta} />
        <path d="M92,170 L102,160 L111,172 L120,160 L129,172 L138,160 L148,170 L138,186 L129,176 L120,188 L111,176 L102,186 Z" fill={C.forjas} stroke={C.ouro} strokeWidth={2} />
      </g>
    ),
  }[tipo];
  return (
    <svg width={240} height={240} viewBox="0 0 240 240">
      <circle cx={120} cy={120} r={116} fill={C.fundo} stroke={C.ouro} strokeWidth={6} />
      {facetas}
      <circle cx={120} cy={120} r={108} fill="none" stroke={C.ouro} strokeWidth={3} strokeDasharray="6 6" />
      {fig}
    </svg>
  );
};

const CartaoRaca = ({ t, frame }) => {
  const { fps } = useVideoConfig();
  const atual = [...RACAS].reverse().find((r) => t >= r.t - 0.15);
  if (!atual || t > T.capitais - 0.2) return null;
  const idx = RACAS.indexOf(atual);
  const fim = idx === RACAS.length - 1 ? T.capitais - 0.2 : RACAS[idx + 1].t - 0.15;
  const s = spring({ frame: frame - f(atual.t - 0.15), fps, config: { damping: 15, stiffness: 140 } });
  const sai = interpolate(t, [fim - 0.15, fim], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 300, transform: `translateX(${(1 - s) * 900 - sai * 900}px)`, display: "flex", alignItems: "center", gap: 26, padding: "0 28px", borderRadius: 26, background: "rgba(20,10,28,0.93)", border: `3px solid ${C.ouro}`, boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
      <div style={{ transform: `rotate(${(1 - s) * -40}deg)` }}>
        <Medalhao tipo={atual.tipo} frame={frame} />
      </div>
      <div style={{ flex: 1, fontFamily: DG, color: C.canalCinza }}>
        <div style={{ fontSize: 38, fontWeight: 800, opacity: 0.85 }}>{atual.mito}</div>
        <div style={{ fontFamily: CZD, fontSize: 70, fontWeight: 900, color: C.canalAmarelo, lineHeight: 1.05 }}>→ {atual.nome}</div>
        <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05, marginTop: 6 }}>{atual.desc}</div>
      </div>
    </div>
  );
};

const RACAS_ANCESTRAIS = [
  { n: "Ntu", x: 380, y: 1050, t: 44.6 },
  { n: "Azizi", x: 330, y: 820, t: 45.25 },
  { n: "Abathwa", x: 760, y: 770, t: 45.7 },
  { n: "Mamiwá", x: 85, y: 1180, t: 46.2 },
  { n: "Bastai", x: 450, y: 1610, t: 46.7 },
  { n: "Biloko", x: 250, y: 960, t: T.biloko, hoste: true },
];

const PovosNoMapa = ({ t }) => (
  <g>
    {RACAS_ANCESTRAIS.map((r) => {
      const op = prog(t, r.t, 0.25) * (1 - prog(t, T.kishi - 0.4, 0.3));
      if (op <= 0) return null;
      const w = r.n.length * 22 + 40;
      return (
        <g key={r.n} opacity={op} transform={`translate(${r.x} ${r.y + (1 - op) * 15})`}>
          <rect x={-w / 2} y={-26} width={w} height={46} rx={23} fill={r.hoste ? C.borda : C.tinta} stroke={C.ouro} strokeWidth={2.5} />
          <text y={8} textAnchor="middle" fontFamily="Cinzel" fontWeight={900} fontSize={26} fill={C.canalAmarelo}>{r.n}</text>
        </g>
      );
    })}
  </g>
);

const CardFinal = ({ t, frame }) => {
  const { fps } = useVideoConfig();
  const op = interpolate(t, [T.card, T.card + 0.25], [0, 1], cl);
  if (op <= 0) return null;
  const s = spring({ frame: frame - f(T.card), fps, config: { damping: 14 } });
  const s2 = spring({ frame: frame - f(T.card + 0.35), fps, config: { damping: 12 } });
  const s3 = spring({ frame: frame - f(62.8), fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FundoCanal frame={frame} op={1} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
        <path d={CONTINENTE} fill="none" stroke={C.canalAmarelo} strokeWidth={4} transform="translate(540 1000) scale(0.9) translate(-540 -1130)" />
      </svg>
      <div style={{ position: "absolute", top: 330, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: DG }}>
        <Img src={staticFile("rodzandonadi/marca/simbolo-amarelo.png")} style={{ width: 190, transform: `scale(${s}) rotate(${(1 - s) * -90}deg)` }} />
        <div style={{ marginTop: 40, fontFamily: CZD, fontSize: 62, fontWeight: 900, color: C.canalCinza, letterSpacing: 6, opacity: s }}>ZANATHOS</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: C.canalAmarelo, lineHeight: 0.95, transform: `scale(${s2})`, textShadow: `0 0 40px ${C.canalAmarelo}55` }}>Ep. 2</div>
        <div style={{ fontSize: 76, fontWeight: 900, color: C.branco ?? "#fff", transform: `scale(${s2})` }}>em breve</div>
        <div style={{ fontSize: 46, fontWeight: 700, color: C.canalCinza, marginTop: 18, opacity: s2 }}>A primeira história desse mundo</div>
        <div style={{ marginTop: 50, padding: "18px 44px", borderRadius: 999, background: C.canalAmarelo, color: C.canalRoxoEscuro, fontSize: 58, fontWeight: 900, transform: `scale(${s3 * (1 + 0.04 * Math.sin(frame / 4))})` }}>Segue @rodzandonadi</div>
      </div>
    </AbsoluteFill>
  );
};

const chunks = (() => {
  const out = [];
  let cur = [];
  WORDS.forEach((w, i) => {
    cur.push({ ...w, i });
    const pont = /[.,:!?]$/.test(w.w);
    if (cur.length === 3 || pont) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out.map((c, k) => ({ words: c, s: c[0].s, e: out[k + 1] ? Math.min(c[c.length - 1].e + 0.35, out[k + 1][0].s) : c[c.length - 1].e + 0.6 }));
})();

const Legendas = ({ t }) => {
  const c = chunks.find((ch) => t >= ch.s - 0.05 && t < ch.e);
  if (!c || t > T.card - 0.05) return null;
  const p = interpolate(t, [c.s - 0.05, c.s + 0.08], [0.85, 1], cl);
  return (
    <div style={{ position: "absolute", top: 1300, width: "100%", display: "flex", justifyContent: "center", padding: "0 60px", boxSizing: "border-box" }}>
      <div style={{ transform: `scale(${p})`, display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", fontFamily: DG, fontWeight: 900, fontSize: 86, lineHeight: 1, textTransform: "uppercase" }}>
        {c.words.map((w) => {
          const ativa = t >= w.s - 0.03;
          return (
            <span key={w.i} style={{ color: ativa ? C.canalAmarelo : "#fff", WebkitTextStroke: "10px #120714", paintOrder: "stroke fill", textShadow: "0 6px 14px rgba(0,0,0,0.6)" }}>
              {w.w.replace(/[.,:!?]$/, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const proxPalavra = (t) => {
  let d = 9;
  for (const w of WORDS) {
    if (t >= w.s && t <= w.e) return 0;
    d = Math.min(d, Math.abs(t - w.s), Math.abs(t - w.e));
  }
  return d;
};

const Trilha = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <Audio
      src={EP("audio/trilha.mp3")}
      volume={(fr) => {
        const t = fr / FPS;
        const duck = interpolate(proxPalavra(t), [0.12, 0.45], [0.12, 0.25], cl);
        const fade = interpolate(fr, [0, 6, durationInFrames - 30, durationInFrames - 1], [0, 1, 1, 0], cl);
        return duck * fade;
      }}
    />
  );
};

const SFX = [
  { t: 0, src: staticFile("sfx/whoosh.mp3"), v: 0.7 },
  { t: 2.15, src: staticFile("sfx/whoosh.mp3"), v: 0.45 },
  { t: T.disse + 0.2, src: staticFile("sfx/pop.mp3"), v: 0.35 },
  { t: T.entao, src: staticFile("sfx/pop.mp3"), v: 0.35 },
  { t: T.zanathos - 0.1, src: staticFile("sfx/ding.mp3"), v: 0.4 },
  { t: T.cosmos - 0.2, src: staticFile("sfx/whoosh.mp3"), v: 0.5 },
  { t: T.mapa + 0.1, src: EP("audio/sfx-pena.mp3"), v: 0.55 },
  { t: T.vertebras, src: EP("audio/sfx-pena.mp3"), v: 0.4 },
  { t: T.sobe, src: staticFile("sfx/riser.mp3"), v: 0.4 },
  { t: T.caiu - 0.05, src: EP("audio/sfx-estrondo.mp3"), v: 0.95 },
  { t: T.lagos, src: EP("audio/sfx-cristal.mp3"), v: 0.55 },
  { t: T.biloko, src: EP("audio/sfx-sinos.mp3"), v: 0.45 },
  ...RACAS.map((r) => ({ t: r.t - 0.15, src: staticFile("sfx/whoosh.mp3"), v: 0.35 })),
  { t: T.mapaFinal - 0.2, src: staticFile("sfx/ding.mp3"), v: 0.35 },
  { t: T.card, src: staticFile("sfx/whoosh.mp3"), v: 0.5 },
];

const CapaTitulo = () => (
  <div style={{ position: "absolute", top: 1180, left: 60, right: 60, textAlign: "center", fontFamily: DG, lineHeight: 0.92 }}>
    <div style={{ display: "inline-block", padding: "26px 40px 34px", borderRadius: 28, background: "rgba(31,5,38,0.94)", border: `4px solid ${C.canalAmarelo}`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 70, fontWeight: 800, color: C.canalCinza }}>Criei um mundo</div>
      <div style={{ fontSize: 112, fontWeight: 900, color: C.canalAmarelo }}>com o Claude</div>
      <div style={{ fontSize: 46, fontWeight: 800, color: C.canalCinza, marginTop: 10 }}>Ep. 1 · Zanathos</div>
    </div>
  </div>
);

export const ZanathosEp1 = ({ capa = false }) => {
  const fr0 = useCurrentFrame();
  const frame = capa ? f(59.2) : fr0;
  const t = frame / FPS;
  const cam = camera(t);
  const [sx, sy] = shake(t, frame);
  const pMapa = interpolate(t, [T.mapa, T.mapa + 0.7], [0, 1], cl);
  const hitMapa = interpolate(t, [T.caiu, T.caiu + 0.3], [1.06, 1], cl);
  return (
    <AbsoluteFill style={{ background: C.fundo, overflow: "hidden" }}>
      <FundoCanal frame={frame} op={interpolate(t, [T.cosmos - 0.2, T.cosmos + 0.2], [1, 0], cl)} />
      <Hook t={t} frame={frame} />
      <Chat t={t} frame={frame} />
      <Cosmos t={t} frame={frame} />
      {pMapa > 0 ? (
        <AbsoluteFill style={{ opacity: pMapa, transform: `translate(${sx}px, ${sy}px) scale(${t >= T.caiu ? hitMapa : 1})` }}>
          <Papel op={1} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(${540 - cam.x * cam.s} ${cam.sy - cam.y * cam.s}) scale(${cam.s})`}>
              <MapaZanathos t={t} frame={frame} />
              <PovosNoMapa t={t} />
              <Luzes t={t} frame={frame} />
            </g>
          </svg>
          <BordaAfricana op={1} frame={frame} />
        </AbsoluteFill>
      ) : null}
      <Flash t={t} />
      <AQueda t={t} frame={frame} />
      {capa ? <CapaTitulo /> : <Chip t={t} />}
      <CartaoRaca t={t} frame={frame} />
      <CardFinal t={t} frame={frame} />
      {capa ? null : <Legendas t={t} />}
      {capa ? null : <Audio src={EP("audio/narracao.mp3")} volume={1} />}
      {capa ? null : <Trilha />}
      {capa ? null : SFX.map((s, i) => (
        <Sequence key={i} from={f(s.t)} layout="none">
          <Audio src={s.src} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
