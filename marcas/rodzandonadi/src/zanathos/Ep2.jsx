import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "../../../../public/rodzandonadi/episodes/zanathos-ep2/audio/words.json";
import { C, CONTINENTE, f } from "./world";
import { MapaZanathos, prog } from "./Mapa";
import { BordaAfricana, CZD, DG, Estrelas, FundoCanal, Papel } from "./Zanathos";
import { FALTAS, Figura, K, Meme, Pic, Ponto, Legendas, chunksDe } from "./cap1/base";
import { CRD, CRG, CSP, Ondas, RD, RG, SP, acumula, poliAte, str } from "./cap1/partes";

const FPS = 30;
const WORDS = palavras.words;
const FIM = palavras.fim;
export const EP2_FRAMES = f(FIM + 4.2);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const easeIO = Easing.inOut(Easing.cubic);
const A = (rel) => staticFile(`rodzandonadi/episodes/zanathos-ep2/audio/${rel}`);
const SOM = (n) => staticFile(`rodzandonadi/episodes/zanathos-cap1/audio/som/${n}.mp3`);
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const W = (p, n = 1) => {
  let c = 0;
  for (const w of WORDS) if (norm(w.w) === norm(p) && ++c === n) return w.s;
  throw new Error(`palavra não achada: ${p}#${n}`);
};
const win = (t, a, b, d = 0.25) => interpolate(t, [a, a + d, b - d, b], [0, 1, 1, 0], cl);
const ramp = (t, a, d, e = easeIO) => interpolate(t, [a, a + d], [0, 1], { ...cl, easing: e });
const pulse = (t, a, d) => interpolate(t, [a, a + d * 0.2, a + d], [0, 1, 0], cl);

const T = {
  pedi: W("Pedi"), hist: W("Ela"), ozare: W("Ozaré"), bate: W("bate"), batida: W("batida"), comigo: W("comigo"), setima: W("sétima"), ted: W("TED"), medir: W("medir"),
  marca: W("Marca"), some: W("some"), estica: W("Estica"), cai: W("cai"), erro: W("Erro"), percebe: W("percebe"),
  mexer: W("mexer"), crescer: W("crescer"), endurecer: W("endurecer"), lembrar: W("lembrar"), alto: W("alto"), luz: W("luz"),
  ai: W("Aí"), sabe: W("Sabe"), alguem: W("alguém"), antes: W("Antes", 2), traco: W("traço"), control: W("Control"), regioes: W("regiões"), ponto3: W("ponto", 3),
  perfeito: W("Perfeito", 2), branco: W("branco"), cantinho: W("cantinho"), guerra: W("guerra", 2), dobra: W("dobra"), imbali: W("Imbali"), segue: W("Segue"),
};
const CARD = FIM + 0.7;
const CHUNKS = chunksDe(WORDS);
const FOLD = T.dobra;

const Chip = ({ t, itens, top = 268, claro = false }) => {
  let atual = null;
  let ini = 0;
  for (const [ct, txt] of itens) if (t >= ct) { atual = txt; ini = ct; }
  if (!atual) return null;
  const p = interpolate(t, [ini, ini + 0.25], [0, 1], { ...cl, easing: Easing.out(Easing.back(2)) });
  return (
    <div style={{ position: "absolute", top, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${(1 - p) * -20}px) scale(${0.9 + p * 0.1})`, opacity: p, padding: "14px 34px", borderRadius: 12, background: claro ? "rgba(43,29,20,0.92)" : `${C.canalRoxo}ee`, border: `3px solid ${C.canalAmarelo}`, color: C.canalAmarelo, fontFamily: CZD, fontWeight: 900, fontSize: 44, letterSpacing: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>{atual}</div>
    </div>
  );
};

const camMapa = (cam) => `translate(${540 - cam.x * cam.s} ${cam.sy - cam.y * cam.s}) scale(${cam.s})`;

/* A: gancho, o mapa do Ep. 1 com os olhos no Fundo */
const CenaA = ({ t, frame }) => {
  const op = win(t, -1, T.pedi + 0.15, 0.3);
  if (op <= 0) return null;
  const p = ramp(t, 0, 5.6, Easing.inOut(Easing.quad));
  const cam = { x: 540, y: 960 + 222 * p, s: 1 + 1.35 * p, sy: 960 + 240 * p };
  const imp = interpolate(frame, [0, 8], [1.18, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const out = interpolate(t, [T.pedi - 0.5, T.pedi - 0.05], [1, 0], cl);
  const hit = interpolate(t, [3.9, 4.05, 4.4], [1, 1.1, 1], cl);
  const flash = pulse(t, 5.3, 0.7);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Papel op={1} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={camMapa(cam)}><MapaZanathos t={61.2} frame={frame} /></g>
      </svg>
      <BordaAfricana op={1} frame={frame} />
      <AbsoluteFill style={{ background: "rgba(14,4,22,0.28)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 62%, #fff 0%, ${C.violeta} 55%, transparent 80%)`, opacity: flash * 0.7 }} />
      <div style={{ position: "absolute", top: 330, left: 50, right: 50, textAlign: "center", opacity: out, transform: `scale(${imp * hit})`, fontFamily: DG, lineHeight: 0.92 }}>
        <div style={{ display: "inline-block", padding: "26px 44px 34px", borderRadius: 28, background: "rgba(31,5,38,0.94)", border: `4px solid ${C.canalAmarelo}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ fontSize: 88, fontWeight: 800, color: C.canalCinza }}>O mapa perfeito</div>
          <div style={{ fontSize: 104, fontWeight: 900, color: C.canalAmarelo, whiteSpace: "nowrap", textShadow: `0 0 40px ${C.canalAmarelo}66` }}>que causou a guerra.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* B: conversa com o Claude */
const CenaB = ({ t, frame }) => {
  const { fps } = useVideoConfig();
  const a = T.pedi - 0.1;
  const b = T.ozare - 0.3;
  const op = win(t, a, b, 0.3);
  if (op <= 0) return null;
  const msgs = [
    { t: T.pedi + 0.1, eu: true, txt: "Claude, qual é a primeira história de Zanathos?" },
    { t: T.hist - 0.15, eu: false, txt: "Antes do mundo, alguém bateu sete vezes." },
  ];
  const ent = spring({ frame: frame - f(a), fps, config: { damping: 16 } });
  const zoom = 1 + ramp(t, a, b - a) * 0.06;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FundoCanal frame={frame} op={1} />
      <Chip t={t} itens={[[a, "EP. 2 · O CHAMADO"]]} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 400, height: 880, borderRadius: 36, background: "#2a0f33", border: `3px solid ${C.canalRoxo}`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", transform: `translateY(${(1 - ent) * 140}px) scale(${(0.9 + ent * 0.1) * zoom})`, opacity: ent, overflow: "hidden", fontFamily: DG }}>
        <div style={{ height: 96, display: "flex", alignItems: "center", gap: 18, padding: "0 34px", borderBottom: `2px solid ${C.canalRoxo}`, color: C.canalCinza, fontSize: 40, fontWeight: 800 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: C.canalAmarelo }} />Claude
          <div style={{ marginLeft: "auto", fontSize: 30, fontWeight: 700, opacity: 0.6 }}>worldbuilding</div>
        </div>
        <div style={{ padding: 34, display: "flex", flexDirection: "column", gap: 26, justifyContent: "flex-end", height: 784, boxSizing: "border-box" }}>
          {msgs.filter((m) => t >= m.t - 0.6).map((m, i) => {
            const fr = frame - f(m.t);
            const s = spring({ frame: fr, fps, config: { damping: 14, stiffness: 160 } });
            const digitando = !m.eu && fr < 0;
            const n = m.eu ? Math.floor(interpolate(fr, [0, 26], [0, m.txt.length], cl)) : m.txt.length;
            return (
              <div key={i} style={{ alignSelf: m.eu ? "flex-end" : "flex-start", maxWidth: "86%", transform: `scale(${digitando ? 1 : 0.85 + s * 0.15})`, opacity: digitando ? 1 : s }}>
                <div style={{ padding: "22px 30px", borderRadius: 28, background: m.eu ? C.canalAmarelo : "#f3ecf5", color: C.canalRoxoEscuro, fontSize: 46, fontWeight: 700, lineHeight: 1.08 }}>
                  {digitando ? <span style={{ letterSpacing: 6 }}>{"•••".slice(0, 1 + (Math.floor(frame / 5) % 3))}</span> : m.txt.slice(0, n)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* C: o Vão, as sete batidas, TED Tage */
const ORBS = [K.agua, K.verde, K.brasa, K.terra, K.ceu, K.luz].map((cor, i) => {
  const a = -Math.PI / 2 + ((i + 0.5) / 6) * Math.PI * 2;
  return { cor, x: 540 + Math.cos(a) * 330, y: 1060 + Math.sin(a) * 300 };
});
const CenaC = ({ t, frame }) => {
  const a = T.ozare - 0.35;
  const b = T.marca - 0.15;
  const op = win(t, a, b, 0.3);
  if (op <= 0) return null;
  const zoom = 1 + ramp(t, a, b - a, Easing.linear) * 0.12;
  const beats = Array.from({ length: 7 }, (_, k) => T.bate + 0.05 + k * 0.23);
  const rays = Array.from({ length: 16 }, (_, i) => i);
  const nBeat = beats.filter((x) => t >= x).length;
  const sete = ramp(t, T.setima, 0.5);
  const tedP = ramp(t, T.ted, 0.9);
  const plano = ramp(t, T.medir, 1.8);
  return (
    <AbsoluteFill style={{ opacity: op, background: `radial-gradient(ellipse 80% 50% at 50% 22%, #2a1840 0%, ${C.fundo} 65%)` }}>
      <Estrelas frame={frame} op={1} />
      <Chip t={t} itens={[[T.ozare, "OZARÉ · O ALTÍSSIMO"], [T.bate + 1.7, "SETE VONTADES SEM ROSTO"], [T.setima, "A SÉTIMA OUVE TODAS"], [T.ted, "TED TAGE · O ARQUITETO"]]} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
        <defs>
          <radialGradient id="gOz2"><stop offset="0" stopColor="#fff" /><stop offset="0.25" stopColor="#fff" stopOpacity="0.85" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <filter id="glowC2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g opacity={ramp(t, T.ozare, 0.9)} transform={`translate(540 520) rotate(${frame * 0.25})`}>
          {rays.map((i) => <rect key={i} x={-3} y={-430} width={6} height={300 + (i % 3) * 80} fill="#fff" opacity={0.18} transform={`rotate(${i * 22.5})`} />)}
        </g>
        <circle cx={540} cy={520} r={150 + 12 * Math.sin(frame / 10) + beats.reduce((m, x) => Math.max(m, pulse(t, x, 0.25)), 0) * 40} fill="url(#gOz2)" opacity={ramp(t, T.ozare, 0.9)} />
        {beats.map((x, k) => {
          const age = t - x;
          if (age < 0 || age > 1.6) return null;
          return <circle key={k} cx={540} cy={520} r={age * 900 + 30} fill="none" stroke={C.ouro} strokeWidth={Math.max(2, 14 - age * 8)} opacity={(1 - age / 1.6) * 0.85} />;
        })}
        {ORBS.map((o, i) => {
          const ap = ramp(t, T.bate + 0.3 + i * 0.1, 0.5);
          const luz = pulse(t, T.bate + 1.95 + i * 0.28, 0.9);
          const keep = ramp(t, T.bate + 1.95 + i * 0.28, 0.4);
          const fade = 1 - ramp(t, T.ted - 0.3, 0.8) * 0.6;
          const r = 16 + luz * 10 + Math.sin(frame / 12 + i) * 2;
          return <g key={i} opacity={ap * fade}>
            {luz > 0 ? <circle cx={o.x} cy={o.y} r={40 + (1 - luz) * 130} fill="none" stroke={o.cor} strokeWidth={5} opacity={luz * 0.8} /> : null}
            <Ponto x={o.x} y={o.y} r={r} cor={o.cor} brilho={0.6 + keep * 1.2} op={0.55 + keep * 0.45} />
          </g>;
        })}
        {nBeat > 0 && t < T.setima + 3.5 ? <text x={540} y={760} textAnchor="middle" fontFamily={CZD} fontWeight={900} fontSize={110} fill={C.ouro} opacity={0.9 * (1 - ramp(t, T.ted - 0.2, 0.5))} filter="url(#glowC2)">{t > T.setima ? "×7" : nBeat}</text> : null}
        <g opacity={sete * (1 - tedP)}>
          <Ponto x={540} y={1060} r={22 + pulse(t, T.setima + 0.6, 1.2) * 14} brilho={2} />
        </g>
        <g opacity={tedP} transform={`translate(0 ${(1 - tedP) * 40})`} filter="url(#glowC2)">
          <g transform="translate(540 1090) scale(0.62) translate(-540 -1095)">
            <circle cx={540} cy={930} r={52} fill="none" stroke={C.ouro} strokeWidth={6} />
            <polygon points="540,990 420,1260 660,1260" fill="none" stroke={C.ouro} strokeWidth={6} />
            <polygon points="540,1040 470,1200 610,1200" fill={C.ouro} opacity={0.25} />
            <path d="M470,1060 L330,1150 L300,1120" fill="none" stroke={C.ouro} strokeWidth={6} strokeLinecap="round" />
            <path d="M610,1060 L760,1000" fill="none" stroke={C.ouro} strokeWidth={6} strokeLinecap="round" />
            <rect x={500} y={1260} width={14} height={110} fill={C.ouro} /><rect x={566} y={1260} width={14} height={110} fill={C.ouro} />
          </g>
        </g>
        <g opacity={tedP * 0.8}>
          {["M540,760 L540,1050", "M300,1000 L780,1000", "M340,1250 L740,1250", "M300,880 A260,260 0 0 1 780,880"].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.ouro} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog(t, T.medir + i * 0.25, 0.8)} transform={`translate(0 ${plano * 0})`} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* D: TED Tage tenta, falha, e as seis faltas */
const FALTAS_INFO = [
  { t: T.mexer, k: "mexer", quem: "Okhu · as águas" },
  { t: T.crescer, k: "crescer", quem: "Imbali · a vida verde" },
  { t: T.endurecer, k: "endurecer", quem: "Zuri-Ndaba · ferro e fogo" },
  { t: T.lembrar, k: "lembrar", quem: "Ayana · a memória" },
  { t: T.alto, k: "o alto", quem: "Mbeze · o céu" },
  { t: T.luz, k: "luz", quem: "Kasembe · a centelha" },
];
const Icone = ({ i, frame }) => {
  const c = FALTAS[i];
  const st = { fill: "none", stroke: c, strokeWidth: 8, strokeLinecap: "round" };
  return [
    <path key={0} d={`M-70,0 Q-35,-${34 + Math.sin(frame / 4) * 6} 0,0 T70,0`} {...st} />,
    <path key={1} d="M0,60 C-60,20 -50,-50 0,-70 C50,-50 60,20 0,60 M0,60 L0,-40" {...st} />,
    <g key={2}>{Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${Math.cos(k * 0.785) * 22},${Math.sin(k * 0.785) * 22} L${Math.cos(k * 0.785) * (50 + (k % 2) * 14)},${Math.sin(k * 0.785) * (50 + (k % 2) * 14)}`} {...st} />)}<circle r={14} fill={c} /></g>,
    <g key={3}>{[0, 1, 2].map((k) => <path key={k} d={`M${-20 + k * 24},-${30 + k * 14} A${40 + k * 26},${40 + k * 26} 0 0 1 ${-20 + k * 24},${30 + k * 14}`} {...st} opacity={1 - k * 0.25} />)}</g>,
    <g key={4}><path d="M-80,30 L80,30" {...st} /><path d="M-50,10 L-30,-10 L-10,10 M10,-6 L30,-26 L50,-6" {...st} strokeWidth={5} /></g>,
    <g key={5}><circle r={20} fill={c} />{Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${Math.cos(k * 0.785) * 36},${Math.sin(k * 0.785) * 36} L${Math.cos(k * 0.785) * 62},${Math.sin(k * 0.785) * 62}`} {...st} />)}</g>,
  ][i];
};
const CartaFalta = ({ t, frame }) => {
  const { fps } = useVideoConfig();
  const idx = FALTAS_INFO.map((x) => x.t).filter((x) => t >= x - 0.05).length - 1;
  if (idx < 0) return null;
  const it = FALTAS_INFO[idx];
  const s = spring({ frame: frame - f(it.t - 0.05), fps, config: { damping: 14, stiffness: 150 } });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 560, height: 360, transform: `translateX(${(1 - s) * 900}px) rotate(${(1 - s) * 6}deg)`, display: "flex", alignItems: "center", gap: 30, padding: "0 34px", borderRadius: 30, background: "rgba(20,10,28,0.95)", border: `4px solid ${FALTAS[idx]}`, boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 50px ${FALTAS[idx]}55` }}>
      <svg width={220} height={220} viewBox="-110 -110 220 220"><circle r={104} fill={C.fundo} stroke={FALTAS[idx]} strokeWidth={5} /><Icone i={idx} frame={frame} /></svg>
      <div style={{ fontFamily: DG, color: C.canalCinza }}>
        <div style={{ fontSize: 50, fontWeight: 800, opacity: 0.85 }}>Faltava</div>
        <div style={{ fontFamily: CZD, fontSize: 86, fontWeight: 900, color: C.canalAmarelo, lineHeight: 1 }}>{it.k}</div>
        <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8, color: FALTAS[idx] }}>{it.quem}</div>
      </div>
    </div>
  );
};
const CenaD = ({ t, frame }) => {
  const a = T.marca - 0.25;
  const b = T.ai - 0.1;
  const op = win(t, a, b, 0.3);
  if (op <= 0) return null;
  const veu = ramp(t, T.percebe - 0.2, 0.7);
  const zoom = 1 + ramp(t, a, b - a, Easing.linear) * 0.1;
  const dt = Math.max(0, t - T.cai);
  const slide = ramp(t, T.some - 0.5, 0.6, Easing.in(Easing.cubic));
  const ink = "#2B1D14";
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <Papel op={1} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {t > T.marca && t < T.some + 0.6 ? <g opacity={1 - ramp(t, T.some + 0.1, 0.4)} transform={`translate(${-slide * 700} ${slide * 60})`}><circle cx={400 + 0} cy={760} r={16 * ramp(t, T.marca, 0.25, Easing.out(Easing.back(3)))} fill={ink} /><circle cx={400} cy={760} r={40 * ramp(t, T.marca, 0.4)} fill="none" stroke={ink} strokeWidth={3} opacity={0.4} /></g> : null}
          {t > T.estica && t < T.cai + 1.4 ? <line x1={140} y1={1000} x2={140 + 800 * ramp(t, T.estica, 0.6)} y2={1000} stroke={ink} strokeWidth={9} strokeLinecap="round" transform={t > T.cai ? `translate(0 ${1500 * dt * dt}) rotate(${dt * 50} 140 1000)` : undefined} /> : null}
        </svg>
        <BordaAfricana op={1} frame={frame} />
      </div>
      <AbsoluteFill style={{ background: `rgba(11,7,16,${veu * 0.88})` }} />
      <Chip t={t} claro itens={[[a + 0.1, "TED TAGE TENTA SOZINHO"], [T.erro, "ERRO 404"], [T.percebe, "AS SEIS FALTAS"]]} />
      <CartaFalta t={t} frame={frame} />
    </AbsoluteFill>
  );
};

/* E: a voz atrasada */
const CenaE = ({ t, frame }) => {
  const a = T.ai - 0.15;
  const b = T.antes - 0.2;
  const op = win(t, a, b, 0.3);
  if (op <= 0) return null;
  const zoom = 1 + ramp(t, a, b - a, Easing.linear) * 0.1;
  const ev = [T.ai + 0.15, T.ai + 0.75, W("própria"), W("atrasada")];
  const cabY = 940 - 218 * 1.15;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FundoCanal frame={frame} op={1} />
      <Chip t={t} itens={[[a + 0.1, "A VOZ ATRASADA"], [T.alguem, "ALGUÉM NO ESCURO"]]} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
        <Figura x={540} y={940} s={1.15} pose={t > T.ai + 0.9 && t < T.sabe + 2 ? "garganta" : "stand"} draw={ramp(t, a, 0.6)} frame={frame} />
        {ev.map((e, i) => <Ondas key={`o${i}`} t={t} t0={e} y={cabY} cor={K.ouro} />)}
        {ev.map((e, i) => <Ondas key={`e${i}`} t={t} t0={e + 0.6} y={cabY} eco cor={K.ouro} />)}
        <Ondas t={t} t0={T.alguem} y={cabY} eco cor={K.terra} />
        <Ondas t={t} t0={T.alguem + 0.5} y={cabY} eco cor={K.terra} />
        {t > T.alguem ? <g opacity={ramp(t, T.alguem + 0.3, 0.6)}><ellipse cx={400} cy={1380} rx={26} ry={16} fill={K.terra} opacity={0.9} /><ellipse cx={680} cy={1380} rx={26} ry={16} fill={K.terra} opacity={0.9} /><circle cx={400} cy={1380} r={7} fill="#0B0710" /><circle cx={680} cy={1380} r={7} fill="#0B0710" /></g> : null}
      </svg>
    </AbsoluteFill>
  );
};

/* F: o Desenho */
const Mao = ({ x, y, r = 0, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(1.8)`} opacity={op} fill="none" stroke="#2B1D14" strokeWidth={2.6} strokeDasharray="3 6" strokeLinecap="round">
    <rect x={-30} y={0} width={60} height={55} rx={14} />
    {[-24, -8, 8, 24].map((fx, i) => <rect key={i} x={fx - 6} y={-44 + Math.abs(fx) * 0.35} width={12} height={46 - Math.abs(fx) * 0.35} rx={6} />)}
    <path d="M-30,30 L-56,6 C-62,-2 -50,-8 -44,0 L-30,16" />
  </g>
);
const CenaF = ({ t, frame }) => {
  const a = T.antes - 0.25;
  const b = FOLD + 1.0;
  const op = win(t, a, b, 0.3);
  if (op <= 0) return null;
  const pS = ramp(t, T.traco - 0.1, T.control - T.traco + 0.3);
  const pR = ramp(t, T.regioes - 0.1, 1.9);
  const pD = ramp(t, T.regioes + 1.2, 1.5);
  const pa = poliAte(SP, CSP, pS);
  const pb = pR > 0 ? poliAte(RG, CRG, pR) : null;
  const pc = pD > 0 ? poliAte(RD, CRD, pD) : null;
  const cabeca = pc && pD < 1 && pD > 0 ? pc.cabeca : pb && pR < 1 && pR > 0 ? pb.cabeca : pa.cabeca;
  const zoom = 1 + 0.06 * ramp(t, a, 8, Easing.linear) + 0.22 * ramp(t, T.perfeito, T.guerra - T.perfeito, Easing.linear);
  const dobra = ramp(t, FOLD - 0.3, 0.9);
  const penOp = pD >= 1 ? 1 - ramp(t, T.perfeito - 0.2, 0.5) : 1;
  const brilho = ramp(t, T.ponto3, 1.2) * (1 + pulse(t, T.perfeito, 1.2));
  const rach = ramp(t, T.guerra - 0.1, 0.35, Easing.out(Easing.cubic));
  const tinta = "#2B1D14";
  const sh = pulse(t, T.guerra - 0.1, 0.9) * 10;
  const fio = [[540, 150], [575, 420], [505, 640], [585, 860], [520, 1060], [590, 1280], [530, 1500], [560, 1760]];
  const maos = [[T.branco + 0.45, 170, 520, 20], [T.cantinho + 0.1, 940, 1380, -15]];
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translate(${Math.sin(frame * 2.1) * sh}px, ${Math.cos(frame * 2.7) * sh}px)` }}>
      <Papel op={1} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 960) rotate(${-6 * dobra}) scale(${zoom * (1 - 0.86 * dobra)}) translate(-540 -960)`} opacity={1 - ramp(t, FOLD + 0.6, 0.3)}>
          <polyline points={str(pa.pts)} fill="none" stroke={tinta} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          {pb ? <polyline points={str(pb.pts)} fill="none" stroke={tinta} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
          {pc ? <polyline points={str(pc.pts)} fill="none" stroke={tinta} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /> : null}
          {brilho > 0 ? <><circle cx={540} cy={960} r={300 * brilho} fill={C.ouro} opacity={0.35} /><Ponto x={540} y={960} r={22 * Math.min(1, brilho * 2)} cor={C.ouro} brilho={2} /></> : null}
          {penOp > 0 && t < T.perfeito ? <circle cx={cabeca[0]} cy={cabeca[1]} r={10} fill={C.ouro} stroke={tinta} strokeWidth={3} opacity={penOp} /> : null}
          {rach > 0 ? <polyline points={str(fio.slice(0, Math.ceil(fio.length * rach)))} fill="none" stroke={C.violeta} strokeWidth={10} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 16px ${C.violeta})` }} /> : null}
        </g>
        {maos.map(([t0, hx, hy, rot], i) => {
          const k = t - t0;
          if (k < 0 || k > 1.9) return null;
          const entra = ramp(t, t0, 0.6);
          const sai = ramp(t, t0 + 1.3, 0.55);
          const x = hx + (i ? 300 : -300) * (1 - entra) + Math.sin(frame * 1.9) * 7 * entra * (1 - sai) + sai * (i ? 260 : -260);
          const y = hy - 130 * (1 - entra) + Math.cos(frame * 2.3) * 5 * entra - sai * 50;
          return <Mao key={i} x={x} y={y} r={rot} op={Math.min(entra * 1.3, 1) * (1 - sai)} />;
        })}
      </svg>
      <BordaAfricana op={1} frame={frame} />
      <Chip t={t} claro itens={[[T.antes, "ELE DESENHA O MUNDO"], [T.traco, "UM TRAÇO SÓ"], [T.control, "SEM CONTROL Z"], [T.regioes, "SEIS REGIÕES NA RÉGUA"], [T.ponto3, "PONTO DE LUZ"], [T.perfeito, "PERFEITO"], [T.branco - 0.3, "NENHUM ESPAÇO EM BRANCO"], [T.guerra - 0.2, "UM MUNDO OU UMA GUERRA"]]} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, #fff 0%, ${C.violeta} 55%, transparent 85%)`, opacity: pulse(t, T.guerra - 0.1, 0.5) * 0.85 }} />
    </AbsoluteFill>
  );
};

/* G: dobra o mapa e parte para Imbali */
const CenaG = ({ t, frame }) => {
  const a = FOLD - 0.4;
  const b = CARD + 0.3;
  const op = win(t, a, b, 0.4);
  if (op <= 0) return null;
  const p = ramp(t, a, T.imbali - a + 0.6, Easing.inOut(Easing.quad));
  const cam = { x: 540 + (330 - 540) * p, y: 1000 + (770 - 1000) * p, s: 1.15 + 1.05 * p, sy: 960 };
  const k = t - FOLD;
  const x = 150 + Math.max(0, k) * 78;
  const passo = Math.max(0, k) * 0.9;
  const fim = 1 - ramp(t, T.imbali - 0.2, 0.7);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Papel op={1} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={camMapa(cam)}><MapaZanathos t={28.4} frame={frame} /></g>
        <g opacity={fim}>
          <Figura x={x} y={1330} s={0.8} pose="andando" draw={1} passo={passo} frame={frame} cor="#2B1D14" />
          <g transform={`translate(${x + 56} ${1250 + Math.abs(Math.sin(passo * 6.283)) * 3})`} opacity={ramp(t, FOLD + 0.3, 0.5)}>
            <rect x={-46} y={-46} width={92} height={92} rx={8} fill="#E9D9B6" stroke="#2B1D14" strokeWidth={5} />
            <path d="M-34,0 L34,0 M-34,-24 L34,-24 M-34,24 L34,24 M0,-34 L0,34" stroke="#2B1D14" strokeWidth={3} />
            <circle r={8} fill={C.ouro} />
          </g>
        </g>
        <g opacity={pulse(t, T.imbali, 2.2)}><circle cx={540} cy={800} r={300} fill={C.mata} opacity={0.25} style={{ filter: "blur(30px)" }} /></g>
      </svg>
      <BordaAfricana op={1} frame={frame} />
      <Chip t={t} claro itens={[[FOLD, "O MAPA NO BRAÇO"], [T.imbali - 0.05, "IMBALI · MATA-MÃE"]]} />
    </AbsoluteFill>
  );
};

const Card = ({ t, frame }) => {
  const { fps } = useVideoConfig();
  const op = interpolate(t, [CARD, CARD + 0.3], [0, 1], cl);
  if (op <= 0) return null;
  const s = spring({ frame: frame - f(CARD), fps, config: { damping: 14 } });
  const s2 = spring({ frame: frame - f(CARD + 0.35), fps, config: { damping: 12 } });
  const s3 = spring({ frame: frame - f(CARD + 1.4), fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FundoCanal frame={frame} op={1} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.22 }}><path d={CONTINENTE} fill="none" stroke={C.canalAmarelo} strokeWidth={4} transform="translate(540 1000) scale(0.9) translate(-540 -1130)" /></svg>
      <div style={{ position: "absolute", top: 330, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: DG }}>
        <Img src={staticFile("rodzandonadi/marca/simbolo-amarelo.png")} style={{ width: 190, transform: `scale(${s}) rotate(${(1 - s) * -90}deg)` }} />
        <div style={{ marginTop: 40, fontFamily: CZD, fontSize: 62, fontWeight: 900, color: C.canalCinza, letterSpacing: 6, opacity: s }}>ZANATHOS</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: C.canalAmarelo, lineHeight: 0.95, transform: `scale(${s2})`, textShadow: `0 0 40px ${C.canalAmarelo}55` }}>Ep. 3</div>
        <div style={{ fontSize: 76, fontWeight: 900, color: "#fff", transform: `scale(${s2})` }}>em breve</div>
        <div style={{ fontSize: 46, fontWeight: 700, color: C.canalCinza, marginTop: 18, opacity: s2 }}>A primeira ofensa de Imbali</div>
        <div style={{ marginTop: 50, padding: "18px 44px", borderRadius: 999, background: C.canalAmarelo, color: C.canalRoxoEscuro, fontSize: 58, fontWeight: 900, transform: `scale(${s3 * (1 + 0.04 * Math.sin(frame / 4))})` }}>Segue @rodzandonadi</div>
      </div>
    </AbsoluteFill>
  );
};

const proxPalavra = (t) => {
  let d = 9;
  for (const w of WORDS) { if (t >= w.s && t <= w.e) return 0; d = Math.min(d, Math.abs(t - w.s), Math.abs(t - w.e)); }
  return d;
};
const TRILHA = 66.06;
const Trilha = () => {
  const { durationInFrames } = useVideoConfig();
  const vol = (off) => (fr) => {
    const t = fr / FPS + off;
    const duck = interpolate(proxPalavra(t), [0.12, 0.45], [0.11, 0.24], cl);
    return duck * interpolate(fr + off * FPS, [0, 6, durationInFrames - 30, durationInFrames - 1], [0, 1, 1, 0], cl) * (off ? interpolate(fr, [0, 30], [0, 1], cl) : 1);
  };
  return (
    <>
      <Audio src={staticFile("rodzandonadi/episodes/zanathos-ep1/audio/trilha.mp3")} volume={vol(0)} />
      <Sequence from={f(TRILHA - 1)} layout="none"><Audio src={staticFile("rodzandonadi/episodes/zanathos-ep1/audio/trilha.mp3")} volume={vol(TRILHA - 1)} /></Sequence>
    </>
  );
};

const POP = staticFile("sfx/pop.mp3");
const WH = staticFile("sfx/whoosh.mp3");
const SFX = [
  { t: 0, src: WH, v: 0.7 },
  { t: 5.4, src: staticFile("rodzandonadi/episodes/zanathos-ep1/audio/sfx-estrondo.mp3"), v: 0.55 },
  { t: T.pedi - 0.1, src: WH, v: 0.5 },
  { t: T.pedi + 0.1, src: POP, v: 0.35 },
  { t: T.hist - 0.15, src: POP, v: 0.4 },
  { t: T.ozare - 0.4, src: WH, v: 0.5 },
  ...Array.from({ length: 7 }, (_, k) => ({ t: T.bate + 0.05 + k * 0.23 - 0.03, src: SOM("batida"), v: 0.85 })),
  ...Array.from({ length: 6 }, (_, i) => ({ t: T.bate + 1.95 + i * 0.28, src: SOM(`tom${i + 1}`), v: 0.4 })),
  { t: T.comigo - 0.05, src: POP, v: 0.4 },
  { t: T.ted, src: staticFile("sfx/ding.mp3"), v: 0.4 },
  { t: T.marca - 0.35, src: WH, v: 0.45 },
  { t: T.marca, src: SOM("clique"), v: 0.8 },
  { t: T.some, src: SOM("oco"), v: 0.9 },
  { t: T.cai, src: SOM("clique-seco"), v: 0.9 },
  { t: T.erro, src: POP, v: 0.4 },
  ...FALTAS_INFO.map((x, i) => ({ t: x.t - 0.05, src: SOM(`tom${i + 2}`), v: 0.55 })),
  { t: T.ai - 0.2, src: WH, v: 0.45 },
  { t: T.sabe, src: POP, v: 0.4 },
  { t: T.antes - 0.3, src: WH, v: 0.5 },
  ...[[T.traco, 1], [T.regioes, 3], [T.regioes + 0.7, 2], [T.regioes + 1.4, 4], [T.ponto3, 5]].map(([t, n]) => ({ t, src: SOM(`mar${n}`), v: 0.5 })),
  { t: T.perfeito, src: staticFile("sfx/ding.mp3"), v: 0.5 },
  { t: T.guerra - 0.1, src: staticFile("rodzandonadi/episodes/zanathos-ep1/audio/sfx-estrondo.mp3"), v: 0.95 },
  { t: FOLD - 0.4, src: WH, v: 0.5 },
  ...[0, 1, 2, 3].map((k) => ({ t: FOLD + 0.6 + k * 1.1, src: SOM("oco"), v: 0.2 })),
  { t: CARD, src: WH, v: 0.5 },
];

const MEMES = (t) => [
  <Meme key="a" t={t} ini={T.comigo - 0.15} fim={T.comigo + 1.6} topo="Seis vontades:" base="Era comigo?">{Pic.eracomigo}</Meme>,
  <Meme key="b" t={t} ini={T.erro} fim={T.erro + 2.1} topo="Erro 404" base="Mundo não encontrado">{Pic.quatrocentos}</Meme>,
  <Meme key="c" t={t} ini={T.sabe} fim={W("sua", 2) + 0.3} topo="Ouvir a própria voz gravada:" base="Essa não sou eu">{Pic.voz}</Meme>,
];

export const ZanathosEp2 = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: C.fundo, overflow: "hidden" }}>
      <CenaA t={t} frame={frame} />
      <CenaB t={t} frame={frame} />
      <CenaC t={t} frame={frame} />
      <CenaD t={t} frame={frame} />
      <CenaE t={t} frame={frame} />
      <CenaF t={t} frame={frame} />
      <CenaG t={t} frame={frame} />
      <Card t={t} frame={frame} />
      {MEMES(t)}
      <Legendas t={t} chunks={CHUNKS} fim={FIM} top={1300} corAtiva={C.canalAmarelo} corBase="#fff" />
      <Audio src={A("narracao.mp3")} volume={1} />
      <Trilha />
      {SFX.map((s, i) => (
        <Sequence key={i} from={f(s.t)} layout="none"><Audio src={s.src} volume={s.v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
