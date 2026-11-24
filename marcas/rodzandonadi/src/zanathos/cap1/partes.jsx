import { Easing, interpolate, random } from "remotion";
import { FALTAS, K, Figura, Meme, Pic, Ponto, cl, f, pulse, ramp } from "./base";

const sfx = (nome) => `rodzandonadi/episodes/zanathos-cap1/audio/som/${nome}.mp3`;
const ease = Easing.inOut(Easing.cubic);
const POP = "sfx/pop.mp3";

const marca = (t, a, d = 0.5) => ramp(t, a, d, Easing.out(Easing.back(2)));

const poliAte = (pts, comp, p) => {
  const total = comp[comp.length - 1];
  const alvo = total * Math.min(1, Math.max(0, p));
  const out = [pts[0]];
  let cabeca = pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (comp[i] <= alvo) { out.push(pts[i]); cabeca = pts[i]; continue; }
    const k = (alvo - comp[i - 1]) / (comp[i] - comp[i - 1]);
    cabeca = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
    out.push(cabeca);
    break;
  }
  return { pts: out, cabeca };
};
const acumula = (pts) => pts.reduce((a, p, i) => { a.push(i ? a[i - 1] + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0); return a; }, []);
const str = (pts) => pts.map((p) => p.join(",")).join(" ");

/* ---------- Parte 1 ---------- */
const CX = 540;
const CY = 820;
const ORB = [K.agua, K.verde, K.brasa, K.terra, K.ceu, K.luz, K.ouro].map((cor, i) => ({
  cor,
  a0: (i / 7) * Math.PI * 2 + 0.4,
  rx: 250 + (i % 3) * 55,
  ry: 340 + (i % 4) * 40,
  sp: (i % 2 ? 1 : -1) * (0.05 + i * 0.012),
  ap: 34.95 + i * 0.45,
}));
const BATIDAS = [59.55, 60.45, 61.45, 62.55, 63.45, 64.35, 65.25];
const orbPos = (o, t) => [CX + Math.cos(o.a0 + o.sp * t) * o.rx, CY + Math.sin(o.a0 + o.sp * t) * o.ry * 0.9];

const P1Cena = ({ t, frame }) => {
  if (t > 91.15) return null;
  const sepOuro = ramp(t, 46.4, 1.3);
  const fase13 = ramp(t, 58.2, 0.8) * (1 - ramp(t, 66.3, 0.6));
  const orbs = ORB.map((o, i) => {
    let [x, y] = orbPos(o, t);
    const ouro = i === 6;
    if (ouro) {
      const a = t * 2.2;
      const gx = CX + Math.cos(a) * 130;
      const gy = CY + Math.sin(a) * 130;
      const ctr = ramp(t, 58.0, 1.0);
      x = (x + (gx - x) * sepOuro) * (1 - ctr) + CX * ctr;
      y = (y + (gy - y) * sepOuro) * (1 - ctr) + CY * ctr;
    }
    const entra = ramp(t, o.ap, 0.5);
    let op = entra * (0.5 + 0.1 * Math.sin(frame / 15 + i));
    let r = 15;
    let brilho = 0.7;
    if (!ouro) {
      op *= 1 - fase13 * 0.55;
      const bat = pulse(t, 67.9 + i * 0.55, 0.8);
      r += bat * 8;
      op += bat * 0.35;
      const acende = ramp(t, 75.65 + i * 0.3, 0.4);
      const vis = ramp(t, 80.95 + i * 0.22, 0.3) * (1 - ramp(t, 82.0 + i * 0.22, 0.9)) * 0.7;
      op = Math.min(1, op + acende * 0.5 + vis);
      brilho = 0.7 + acende * 1.6 + vis * 2;
      r += acende * 6;
    } else {
      op = entra * (0.95 - fase13 * 0.05);
      brilho = 1.2 + fase13 * 1.2 + ramp(t, 81.2, 1.2) * 1.6;
      r = 17 + ramp(t, 81.0, 1.0) * 9 + (t > 58 && t < 66.4 ? 8 : 0);
    }
    return <Ponto key={i} x={x} y={y} r={r} cor={o.cor} op={Math.min(1, op)} brilho={brilho} />;
  });
  const aneis = BATIDAS.map((b, i) => {
    const age = t - b;
    if (age < 0 || age > 2.0) return null;
    const r = age * 1100 + 20;
    return <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke={K.ouro} strokeWidth={Math.max(1, 14 - age * 6)} opacity={(1 - age / 2) * 0.9} />;
  });
  const n = BATIDAS.filter((b) => t >= b).length;
  const fio = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = 80.95 + i * 0.22;
    const k = ramp(t, a, 0.25) * (1 - ramp(t, a + 0.3, 0.5));
    if (k <= 0) return null;
    const [x, y] = orbPos(ORB[i], t);
    return <line key={i} x1={CX} y1={CY} x2={CX + (x - CX) * ramp(t, a, 0.25)} y2={CY + (y - CY) * ramp(t, a, 0.25)} stroke={ORB[i].cor} strokeWidth={4} opacity={k} />;
  });
  const fim = pulse(t, 89.4, 3);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {aneis}
      {fio}
      {orbs}
      {fim > 0 ? <circle cx={CX} cy={CY} r={60 + (t - 89.4) * 120} fill="none" stroke={K.ouro} strokeWidth={4} opacity={fim * 0.7} /> : null}
      {n > 0 && t < 67 ? (
        <text x={CX + 62} y={CY - 52} fontFamily="Darker Grotesque, sans-serif" fontWeight={900} fontSize={54} fill={K.ouro} opacity={0.85 * fase13 + 0.0}>{n}</text>
      ) : null}
    </svg>
  );
};

const P1 = {
  gancho: ["Antes do mundo, alguém bateu sete vezes.", "sete vezes"],
  fecho: "Próxima: o arquiteto falha",
  Cena: P1Cena,
  corte: 91.15,
  brilho: (t) => {
    if (t < 24.7) return 1;
    const v = ramp(t, 24.75, 3.4, Easing.out(Easing.quad));
    return t < 24.9 ? 0.02 : 0.02 + 0.98 * v;
  },
  veu: (t) => (t >= 24.7 && t < 28.5 ? 0.9 * (1 - ramp(t, 24.8, 3.4, Easing.out(Easing.quad))) : 0),
  drone: (t) => (t > 91.15 ? 0 : t > 66.2 && t < 66.9 ? 0.08 : 0.3),
  memes: (t) => [
    <Meme key="a" t={t} ini={25.9} fim={30.1} topo="Chefe: alguma dúvida?" base="Todo mundo:">{Pic.reuniao}</Meme>,
    <Meme key="b" t={t} ini={73.7} fim={77.3} topo="Seis inquietações:" base="Era comigo?">{Pic.eracomigo}</Meme>,
  ],
  sfx: [
    { t: 0.0, src: sfx("vento"), v: 0.6 },
    ...ORB.map((o, i) => ({ t: o.ap, src: sfx(`tom${i + 1}`), v: 0.45 })),
    ...BATIDAS.map((b) => ({ t: b - 0.04, src: sfx("batida"), v: 0.95 })),
    ...[0, 1, 2, 3, 4, 5].map((i) => ({ t: 67.9 + i * 0.55, src: sfx("batida"), v: 0.3 })),
    ...[0, 1, 2, 3, 4, 5].map((i) => ({ t: 75.65 + i * 0.3, src: sfx(`tom${i + 1}`), v: 0.35 })),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ t: 80.95 + i * 0.22, src: sfx(`tom${i + 1}`), v: 0.4 })),
    { t: 89.4, src: sfx("batida-longa"), v: 1 },
    { t: 25.9, src: POP, v: 0.4 },
    { t: 73.7, src: POP, v: 0.4 },
  ],
};

/* ---------- Parte 2 ---------- */
const P2Cena = ({ t, frame }) => {
  const els = [];
  const dotR = 14 + ramp(t, 0.6, 10.5) * 46;
  const dotOp = t < 11.5 ? 1 : 1 - ramp(t, 11.5, 1.5);
  const figDraw = ramp(t, 11.3, 5.5);
  const mover = ramp(t, 18.6, 1.4);
  const figX = 540 - 310 * mover;
  const figY = 900 + 360 * mover;
  const figS = 1.15 - 0.62 * mover;
  const figOp = t < 40 ? 1 : 1 - ramp(t, 40, 1.5);
  if (t < 67.9) {
    els.push(<Ponto key="d" x={540} y={820} r={dotR} op={dotOp} brilho={1 + ramp(t, 8, 3)} />);
    if (t > 11.2) els.push(<Figura key="fig" x={figX} y={figY} s={figS} draw={figDraw} frame={frame} op={figOp} />);
  }
  // 2.2
  if (t > 19 && t < 42) {
    const p1m = marca(t, 20.4);
    const p2m = marca(t, 22.5);
    const slide = ramp(t, 24.5, 1.5, Easing.in(Easing.cubic));
    const p1x = 420 - 470 * slide;
    const p1y = 640 + 20 * slide;
    const p1op = (1 - ramp(t, 25.5, 0.6)) * p1m;
    const p2 = [720, 900];
    const livre = ramp(t, 26.0, 0.5);
    const tre = (t > 26 ? 1 : 0.2) * Math.sin(frame * 1.3) * 5;
    const fim = [p2[0] - 270 + tre * 2, p2[1] - 250 + livre * 150 + Math.abs(tre) * 3];
    const fadeL = 1 - ramp(t, 39.5, 2);
    if (p2m > 0.1 && p1m > 0.1) {
      const x1 = t < 26 ? p1x : fim[0];
      const y1 = t < 26 ? p1y : fim[1];
      els.push(<line key="l" x1={p2[0]} y1={p2[1]} x2={x1} y2={y1} stroke={K.ouro} strokeWidth={3} strokeDasharray={t > 26 ? "10 12" : "0"} opacity={0.85 * fadeL * ramp(t, 22.9, 0.4)} />);
    }
    els.push(<g key="p1" opacity={fadeL}><Ponto x={p1x} y={p1y} r={13 * p1m} op={p1op} /></g>);
    els.push(<g key="p2" opacity={fadeL}><Ponto x={p2[0]} y={p2[1]} r={13 * p2m} op={p2m} /></g>);
  }
  // 2.3
  if (t > 44.3 && t < 58.5) {
    const a = ramp(t, 44.8, 0.8);
    const dt = Math.max(0, t - 46.0);
    const cai = 1300 * dt * dt;
    const opA = (1 - ramp(t, 46.7, 0.6));
    els.push(<line key="A" x1={160} y1={720} x2={160 + 760 * a} y2={720 + (t > 46 ? cai * 0.15 * (a) : 0)} stroke={K.ouro} strokeWidth={5} strokeLinecap="round" opacity={opA} transform={t > 46 ? `translate(0 ${cai}) rotate(${dt * 40} 160 720)` : undefined} />);
    const n = 40;
    const pts = Array.from({ length: n + 1 }, (_, i) => {
      const ang = (i / n) * Math.PI * 2 * 0.93 - Math.PI / 2;
      return [540 + Math.cos(ang) * 230 + Math.sin(i * 1.3) * 6, 820 + Math.sin(ang) * 270];
    });
    const draw = ramp(t, 47.0, 1.7);
    const k = Math.floor(n * draw);
    const abre = ramp(t, 48.8, 0.7);
    const sh = pts.slice(0, k + 1).map(([x, y], i) => [x + (i > k - 6 ? abre * 22 : 0) * Math.sin(frame / 4), y]);
    const opB = ramp(t, 46.9, 0.2) * (1 - ramp(t, 49.7, 0.6));
    if (opB > 0) els.push(<polyline key="B" points={str(sh)} fill="none" stroke={K.ouro} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={opB} />);
    const opC = ramp(t, 50.0, 0.5) * (1 - ramp(t, 56.4, 1.2));
    if (opC > 0) {
      const flashes = [51.6, 52.65, 53.45, 54.2];
      const blur = ramp(t, 54.4, 1.4) * 16;
      els.push(
        <g key="C" opacity={opC} style={{ filter: `blur(${blur}px)` }} transform={`translate(540 820) scale(${1 + ramp(t, 54.4, 1.8) * 0.12})`}>
          <circle r={200} fill="none" stroke={K.ouro} strokeWidth={2} opacity={0.35} />
          {Array.from({ length: 12 }, (_, i) => {
            const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const vis = ramp(t, 50.3 + i * 0.07, 0.2);
            const fl = i === 0 ? flashes.reduce((m, ft) => Math.max(m, pulse(t, ft, 0.5)), 0) : 0;
            return <circle key={i} cx={Math.cos(ang) * 200} cy={Math.sin(ang) * 200} r={(10 + fl * 18) * vis} fill={K.ouro} opacity={0.8 + fl * 0.2} />;
          })}
          <path d={`M0,0 L0,-150`} stroke={K.ouro} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(t - 50.5) * 5})`} />
        </g>,
      );
    }
  }
  // 2.4
  if (t > 69) {
    const base = ramp(t, 71.6, 1.5);
    els.push(<Ponto key="g" x={540} y={820} r={9 + base * 3 + pulse(t, 89.4, 0.7) * 26} op={0.45 * base + pulse(t, 89.4, 0.7) * 0.6 + (t > 90 ? 0.3 : 0)} brilho={1 + pulse(t, 89.4, 0.7) * 3} />);
    const v = (a, d = 1.0) => ({ k: ramp(t, a, 0.15) * (1 - ramp(t, a + d * 0.55, d * 0.45)), q: (t - a) });
    let c = v(75.8);
    if (c.k > 0) {
      const pts = Array.from({ length: 60 }, (_, i) => [140 + i * 13.3, 780 + Math.sin(i / 5 - c.q * 6) * 55]);
      els.push(<polyline key="a" points={str(pts.slice(0, Math.floor(60 * ramp(t, 75.8, 0.35)) + 1))} fill="none" stroke={K.agua} strokeWidth={9} strokeLinecap="round" opacity={c.k} style={{ filter: `drop-shadow(0 0 14px ${K.agua})` }} />);
    }
    c = v(77.15);
    if (c.k > 0) {
      const s = 0.3 + ramp(t, 77.15, 0.4, Easing.out(Easing.back(1.5))) * 0.9;
      els.push(<g key="v" transform={`translate(540 880) rotate(-25) scale(${s})`} opacity={c.k} style={{ filter: `drop-shadow(0 0 14px ${K.verde})` }}><path d="M0,0 C-130,-80 -110,-250 0,-340 C110,-250 130,-80 0,0 Z" fill={K.verde} opacity={0.9} /><path d="M0,0 L0,-300" stroke="#0B0F1A" strokeWidth={5} /></g>);
    }
    c = v(78.75);
    if (c.k > 0) {
      els.push(<g key="b" opacity={c.k} transform="translate(540 800)" style={{ filter: `drop-shadow(0 0 20px ${K.brasa})` }}>
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={Math.cos((i / 10) * 6.283) * 30} y1={Math.sin((i / 10) * 6.283) * 30} x2={Math.cos((i / 10) * 6.283) * (50 + c.q * 260 * (0.6 + 0.4 * random(`sp${i}`)))} y2={Math.sin((i / 10) * 6.283) * (50 + c.q * 260 * (0.6 + 0.4 * random(`sp${i}`)))} stroke={K.brasa} strokeWidth={7} strokeLinecap="round" />)}
        <circle r={24 + Math.sin(frame) * 4} fill={K.brasa} />
      </g>);
    }
    c = v(80.3, 1.2);
    if (c.k > 0) {
      els.push(<g key="t" opacity={c.k} transform="translate(540 820)">
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-70 - i * 55},-${60 + i * 30} A${90 + i * 60},${90 + i * 60} 0 0 0 ${-70 - i * 55},${60 + i * 30}`} fill="none" stroke={K.terra} strokeWidth={8} strokeLinecap="round" opacity={Math.max(0, 1 - i * 0.22 - c.q * 0.3)} transform={`translate(${c.q * 40 * (i + 1)} 0)`} />)}
      </g>);
    }
    c = v(81.8);
    if (c.k > 0) {
      const w = ramp(t, 81.8, 0.4) * 540;
      els.push(<g key="s" opacity={c.k} style={{ filter: `drop-shadow(0 0 16px ${K.ceu})` }}><line x1={540 - w} y1={900} x2={540 + w} y2={900} stroke={K.ceu} strokeWidth={6} strokeLinecap="round" /><rect x={540 - w} y={640} width={w * 2} height={260} fill={K.ceu} opacity={0.14} /></g>);
    }
    c = v(83.0, 1.0);
    if (c.k > 0) {
      els.push(<g key="l" opacity={c.k}><circle cx={540} cy={820} r={30 + c.q * 700} fill="#fff" opacity={0.5} /><circle cx={540} cy={820} r={14 + c.q * 160} fill="#fff" /></g>);
    }
  }
  return <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{els}</svg>;
};

const P2 = {
  gancho: ["O melhor medidor do mundo não conseguia medir nada.", "não conseguia medir nada."],
  fecho: "Próxima: a voz no escuro",
  Cena: P2Cena,
  corte: 999,
  brilho: (t) => (t > 69 ? 1 - 0.85 * ramp(t, 69.0, 1.5) : 1),
  veu: () => 0,
  drone: (t) => (t > 88.4 ? 0 : t > 69 ? 0.18 : 0.3),
  memes: (t) => [
    <Meme key="a" t={t} ini={35.4} fim={39.2} topo="Erro 404" base="Mundo não encontrado">{Pic.quatrocentos}</Meme>,
    <Meme key="b" t={t} ini={63.9} fim={67.4} topo="Na minha cabeça" base="tava lindo">{Pic.expectativa}</Meme>,
  ],
  sfx: [
    { t: 20.4, src: sfx("clique"), v: 0.8 },
    { t: 22.5, src: sfx("clique"), v: 0.8 },
    { t: 26.05, src: sfx("oco"), v: 0.9 },
    { t: 46.1, src: sfx("clique"), v: 0.8 },
    { t: 49.0, src: sfx("clique-seco"), v: 0.9 },
    { t: 55.4, src: sfx("clique-seco"), v: 1 },
    ...[75.8, 77.15, 78.75, 80.3, 81.8, 83.0].map((t, i) => ({ t, src: sfx(`tom${i + 2}`), v: 0.55 })),
    { t: 83.0, src: sfx("clarao"), v: 0.4 },
    { t: 35.4, src: POP, v: 0.4 },
    { t: 63.9, src: POP, v: 0.4 },
  ],
};

/* ---------- Parte 3 ---------- */
const Ondas = ({ t, t0, y, eco, cor }) => {
  const age = t - t0;
  if (age < 0 || age > 2.4) return null;
  const arcs = [0, 1, 2].map((k) => {
    const a = age - k * 0.16;
    if (a < 0) return null;
    const r = 70 + a * 330 * (eco ? 1.08 : 1);
    const ang = 0.62;
    const op = (1 - a / 2.3) * (eco ? 0.38 : 0.9);
    const cy = y + (eco ? 70 : 0);
    const d = (s) => `M${540 + s * r * Math.cos(ang)},${cy - r * Math.sin(ang)} A${r},${r} 0 0 ${s > 0 ? 1 : 0} ${540 + s * r * Math.cos(ang)},${cy + r * Math.sin(ang)}`;
    return <g key={k} opacity={Math.max(0, op)}><path d={d(1)} fill="none" stroke={cor} strokeWidth={eco ? 4 : 6} strokeLinecap="round" /><path d={d(-1)} fill="none" stroke={cor} strokeWidth={eco ? 4 : 6} strokeLinecap="round" /></g>;
  });
  return <g>{arcs}</g>;
};

const HOLES = [
  { x: 205, y: 640, n: 72.6 },
  { x: 875, y: 640, n: 73.7 },
  { x: 150, y: 930, n: 74.8 },
  { x: 930, y: 930, n: 75.9 },
  { x: 240, y: 1230, n: 76.9 },
  { x: 840, y: 1230, n: 78.1 },
  { x: 540, y: 470, n: 79.2 },
];
const Sil = ({ i, p, cor }) => {
  const st = { fill: "none", stroke: cor, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - p };
  return [
    <path key={0} d="M-60,0 C-40,-50 -20,-50 0,0 S40,50 60,0" {...st} />,
    <path key={1} d="M0,60 C-60,20 -50,-50 0,-70 C50,-50 60,20 0,60 M0,60 L0,-40" {...st} />,
    <path key={2} d="M0,70 C-50,50 -50,0 -10,-20 C-10,-40 10,-60 10,-80 C40,-40 50,20 40,45 C30,65 15,70 0,70 Z" {...st} />,
    <path key={3} d="M-60,5 C-30,-30 -10,-25 0,-18 C10,-25 30,-30 60,5 C30,40 -30,40 -60,5 Z M-60,5 L60,5" {...st} />,
    <path key={4} d="M-75,50 L-25,-40 L5,10 L35,-60 L80,50 Z" {...st} />,
    <g key={5}><circle r={22} {...st} />{Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${Math.cos(k * 0.785) * 40},${Math.sin(k * 0.785) * 40} L${Math.cos(k * 0.785) * 62},${Math.sin(k * 0.785) * 62}`} {...st} />)}</g>,
    <g key={6}><rect x={-14} y={-70} width={28} height={140} {...st} />{[-50, -30, -10, 10, 30, 50].map((y) => <path key={y} d={`M-14,${y} L${y % 20 ? 2 : 6},${y}`} {...st} />)}</g>,
  ][i];
};

const P3Cena = ({ t, frame }) => {
  const els = [];
  let pose = "stand";
  let s = 1.15;
  let y = 940;
  let tre = 0;
  let op = 1;
  if (t < 27.6) {
    pose = t > 17.9 && t < 24 ? "garganta" : "stand";
    s = 1.15;
  } else if (t < 47.6) {
    s = 1.15 - 0.09 * ramp(t, 29.3, 1.6);
    tre = 3 * pulse(t, 34.4, 1.2);
  } else if (t < 63.7) {
    pose = "sentado";
    s = 1.06;
    op = 0.88;
  } else {
    s = 1.06;
  }
  els.push(<Figura key="fig" x={540} y={y} s={s} pose={pose} draw={ramp(t, 0.1, 0.5)} tremor={tre} frame={frame} op={op} />);
  if (t < 27.6) {
    const cabY = y - 218 * s;
    [4.8, 5.4, 5.85, 20.2].forEach((t0, i) => els.push(<Ondas key={`o${i}`} t={t} t0={t0} y={cabY} cor={K.ouro} />));
    [4.8, 5.4, 5.85, 20.2].forEach((t0, i) => els.push(<Ondas key={`e${i}`} t={t} t0={t0 + 0.6} y={cabY} eco cor={K.ouro} />));
    els.push(<Ondas key="et" t={t} t0={23.4} y={cabY} eco cor={K.terra} />);
    const mud = pulse(t, 23.2, 1.4);
    if (mud > 0) els.push(<circle key="mud" cx={540} cy={cabY + 70} r={120 + mud * 30} fill="none" stroke={K.terra} strokeWidth={5} opacity={mud * 0.7} />);
  }
  if (t > 37.2 && t < 49) {
    const ap = ramp(t, 37.2, 0.5);
    const medir = ramp(t, 38.0, 6.3, Easing.inOut(Easing.quad));
    const rx = 735;
    const quebra = t > 45.3;
    const dt = Math.max(0, t - 45.3);
    const topo = y - 270 * s;
    const alt = 430;
    const marcaY = topo + medir * 360;
    els.push(
      <g key="r" opacity={ap * (1 - ramp(t, 47.2, 0.8))}>
        {[0, 1].map((h) => (
          <g key={h} transform={quebra ? `translate(${(h ? 1 : -1) * dt * 90} ${(h ? 1 : -1) * dt * 40 + dt * dt * 200}) rotate(${(h ? 1 : -1) * dt * 55} ${rx} ${topo + alt / 2})` : undefined}>
            <rect x={rx - 18} y={h ? topo + alt / 2 : topo} width={36} height={alt / 2} fill={K.ouro} opacity={0.9} />
            {Array.from({ length: 9 }, (_, i) => <line key={i} x1={rx - 18} x2={rx - (i % 2 ? 4 : 10)} y1={(h ? topo + alt / 2 : topo) + 12 + i * 22} y2={(h ? topo + alt / 2 : topo) + 12 + i * 22} stroke="#0B0F1A" strokeWidth={3} />)}
          </g>
        ))}
        {!quebra ? <g><line x1={rx - 40} y1={marcaY} x2={540} y2={marcaY} stroke={K.ouro} strokeWidth={2} strokeDasharray="6 8" /><circle cx={rx - 40} cy={marcaY} r={7} fill={K.ouro} /></g> : null}
      </g>,
    );
    if (quebra && dt < 0.4) els.push(<circle key="fl" cx={rx} cy={topo + alt / 2} r={dt * 600} fill="none" stroke={K.ouro} strokeWidth={4} opacity={1 - dt / 0.4} />);
  }
  if (t > 67.3) {
    HOLES.forEach((h, i) => {
      const ab = ramp(t, 67.9 + i * 0.13, 0.7, Easing.out(Easing.back(1.4)));
      const pr = ramp(t, h.n, 0.7);
      const pl = pulse(t, h.n, 1.2);
      els.push(
        <g key={`h${i}`} transform={`translate(${h.x} ${h.y})`} opacity={ab}>
          <ellipse rx={105 * ab} ry={135 * ab} fill="#03050a" stroke={K.osso} strokeWidth={3} opacity={0.95} strokeDasharray="14 10" />
          <g transform={`scale(${1 + pl * 0.15})`} style={{ filter: `drop-shadow(0 0 ${6 + pl * 14}px ${i === 6 ? K.ouro : K.osso})` }}>
            <Sil i={i} p={pr} cor={i === 6 ? K.ouro : K.osso} />
          </g>
        </g>,
      );
    });
  }
  return <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{els}</svg>;
};

const P3 = {
  gancho: ["Alguém repetiu a voz dele, e ele não percebeu.", "ele não percebeu."],
  fecho: "Próxima: o plano perfeito",
  Cena: P3Cena,
  corte: 999,
  brilho: () => 1,
  veu: () => 0,
  drone: (t) => (t < 27.4 ? 0 : t < 28.2 ? 0.3 * ramp(t, 27.4, 0.8) : t > 47.2 && t < 63.4 ? 0.07 : 0.3),
  memes: (t) => [
    <Meme key="a" t={t} ini={11.5} fim={16.6} topo="Ouvir a própria voz gravada:" base="Essa não sou eu">{Pic.voz}</Meme>,
    <Meme key="b" t={t} ini={46.3} fim={48.2} topo="Régua:" base="Pedi demissão">{Pic.regua}</Meme>,
  ],
  sfx: [
    { t: 45.3, src: sfx("clique-seco"), v: 1 },
    ...HOLES.map((h) => ({ t: h.n, src: sfx("pulso"), v: 0.85 })),
    { t: 11.5, src: POP, v: 0.4 },
    { t: 46.3, src: POP, v: 0.4 },
  ],
  eco: "rodzandonadi/episodes/zanathos-cap1/audio/eco-p3.mp3",
};

/* ---------- Parte 4 ---------- */
const SP = [[70, 960], [1010, 960]];
const RG = [[1010, 960], [1010, 560], [697, 560], [697, 960], [697, 560], [383, 560], [383, 960], [383, 560], [70, 560], [70, 960], [70, 1360], [383, 1360], [383, 960], [383, 1360], [697, 1360], [697, 960], [697, 1360], [1010, 1360], [1010, 960]];
const CS = [[226, 760], [540, 760], [853, 760], [226, 1160], [540, 1160], [853, 1160]];
const RD = [[1010, 960], [540, 960], ...[2, 5, 4, 3, 0, 1].flatMap((k) => [CS[k], [540, 960]])];
const CSP = acumula(SP);
const CRG = acumula(RG);
const CRD = acumula(RD);

const Mao = ({ x, y, r = 0, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(1.7)`} opacity={op} fill="none" stroke={K.osso} strokeWidth={2.4} strokeDasharray="3 6" strokeLinecap="round">
    <rect x={-30} y={0} width={60} height={55} rx={14} />
    {[-24, -8, 8, 24].map((fx, i) => <rect key={i} x={fx - 6} y={-44 + Math.abs(fx) * 0.35} width={12} height={46 - Math.abs(fx) * 0.35} rx={6} />)}
    <path d="M-30,30 L-56,6 C-62,-2 -50,-8 -44,0 L-30,16" />
  </g>
);

const P4Cena = ({ t, frame }) => {
  const els = [];
  if (t < 5.25) {
    els.push(<Figura key="f" x={540} y={1000} s={1.2} pose={t > 3.8 ? "mao" : "stand"} draw={ramp(t, 0, 0.6)} frame={frame} />);
  }
  if (t > 6.9 && t < 62.5) {
    const zoom = 1 + 0.12 * ramp(t, 36.4, 4.6) + 0.1 * ramp(t, 41.3, 20);
    const dobra = ramp(t, 62.2, 1.8);
    const pS = ramp(t, 17.3, 3.1);
    const pR = ramp(t, 20.7, 5.5);
    const pD = ramp(t, 26.6, 4.6);
    const a = poliAte(SP, CSP, pS);
    const b = pR > 0 ? poliAte(RG, CRG, pR) : null;
    const c = pD > 0 ? poliAte(RD, CRD, pD) : null;
    const cabeca = c && pD > 0 && pD < 1 ? c.cabeca : b && pR < 1 && pR > 0 ? b.cabeca : a.cabeca;
    const penOp = t < 17 ? ramp(t, 16.2, 0.8) : (pD >= 1 ? 1 - ramp(t, 31.4, 0.8) : 1);
    const halo = ramp(t, 27.4, 3) * (1 + 0.5 * ramp(t, 36.4, 2));
    els.push(
      <g key="d" transform={`translate(540 960) rotate(${-8 * dobra}) scale(${zoom * (1 - 0.84 * dobra)}) translate(-540 -960)`}>
        {t > 27.3 ? <><defs><radialGradient id="halo"><stop offset="0" stopColor={K.ouro} stopOpacity="0.28" /><stop offset="1" stopColor={K.ouro} stopOpacity="0" /></radialGradient></defs><circle cx={540} cy={960} r={560 * halo} fill="url(#halo)" opacity={Math.min(1, halo)} /></> : null}
        <polyline points={str(a.pts)} fill="none" stroke={K.osso} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {b ? <polyline points={str(b.pts)} fill="none" stroke={K.osso} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" /> : null}
        {c ? <polyline points={str(c.pts)} fill="none" stroke={K.osso} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} /> : null}
        {t > 27.3 ? <Ponto x={540} y={960} r={20 * ramp(t, 27.3, 0.8)} brilho={1.5} op={ramp(t, 27.3, 0.8)} /> : null}
        {penOp > 0 ? <circle cx={cabeca[0]} cy={cabeca[1]} r={9} fill={K.ouro} opacity={penOp} style={{ filter: `drop-shadow(0 0 12px ${K.ouro})` }} /> : null}
      </g>,
    );
    const maos = [[48.2, 140, 470, 20], [50.9, 950, 1420, -15], [53.5, 545, 1390, 5]];
    maos.forEach(([t0, hx, hy, rot], i) => {
      const k = t - t0;
      if (k < 0 || k > 2.6) return;
      const entra = ramp(t, t0, 0.8);
      const sai = ramp(t, t0 + 1.9, 0.7);
      const sx = hx + (i % 2 ? 380 : -380);
      const x = sx + (hx - sx) * entra + sai * (i % 2 ? 300 : -300) + (entra >= 1 ? Math.sin(frame * 1.9) * 7 * (1 - sai) : 0);
      const y = hy - 140 + 140 * entra - sai * 60 + (entra >= 1 ? Math.cos(frame * 2.3) * 5 : 0);
      els.push(<Mao key={`m${i}`} x={x} y={y} r={rot} op={Math.min(entra * 1.2, 1) * (1 - sai)} />);
    });
  }
  if (t > 62 && t < 77.5) {
    const k = t - 64.2;
    const x = 230 + Math.max(0, k) * 72;
    const sx = x;
    const op = ramp(t, 62.1, 0.6) * (1 - ramp(t, 75.5, 1.5));
    const passo = Math.max(0, k) * 0.9;
    els.push(<Figura key="w" x={sx} y={1250} s={0.75} pose={k > 0 ? "andando" : "stand"} draw={1} passo={passo} frame={frame} op={op} />);
    const dobra = ramp(t, 62.2, 1.8);
    els.push(
      <g key="q" transform={`translate(${sx + 52} ${1180 + Math.abs(Math.sin(passo * 6.283)) * 3})`} opacity={dobra * op}>
        <rect x={-46} y={-46} width={92} height={92} rx={8} fill="#13182a" stroke={K.osso} strokeWidth={4} />
        <path d="M-34,0 L34,0 M-34,-24 L34,-24 M-34,24 L34,24 M0,-34 L0,34" stroke={K.osso} strokeWidth={3} />
        <circle r={7} fill={K.ouro} />
      </g>,
    );
    const m = pulse(t, 68.0, 1.9);
    if (m > 0) els.push(<ellipse key="g" cx={880} cy={640} rx={70} ry={46} fill={K.verde} opacity={m * 0.42} style={{ filter: "blur(18px)" }} />);
  }
  return <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{els}</svg>;
};

const NOTAS = [[17.4, 1], [19.0, 3], [20.9, 2], [22.4, 4], [24.0, 3], [25.6, 5], [27.7, 4], [29.5, 6], [31.5, 5], [33.6, 4], [35.4, 6]];
const P4 = {
  gancho: ["Ele cometeu um erro lindo.", "erro lindo."],
  fecho: "Próxima história: uma coisa crescia onde ninguém plantou",
  Cena: P4Cena,
  corte: 5.25,
  brilho: (t) => (t > 5.25 && t < 16 ? 0.15 : t < 5.25 ? 1 : 0.6),
  veu: () => 0,
  drone: (t) => (t < 6.9 ? 0 : t < 16.8 ? 0.06 : t < 37 ? 0.06 + 0.3 * ramp(t, 16.8, 20) : t < 41.3 ? 0.4 : t < 62 ? 0.1 : t < 76 ? 0.08 : 0),
  memes: (t) => [
    <Meme key="a" t={t} ini={12.1} fim={15.0} topo="Sem Ctrl+Z" base="Tipo prova de caneta">{Pic.ctrlz}</Meme>,
    <Meme key="b" t={t} ini={51.6} fim={55.7} topo="Deixar um espacinho?" base="Nem pensar">{Pic.aprovado}</Meme>,
  ],
  sfx: [
    ...NOTAS.map(([t, n]) => ({ t, src: sfx(`mar${n}`), v: 0.3 + 0.35 * ramp(t, 17, 20) })),
    ...[1, 3, 5].map((n) => ({ t: 36.8, src: sfx(`mar${n}`), v: 0.6 })),
    ...[2, 4, 6].map((n) => ({ t: 38.6, src: sfx(`mar${n}`), v: 0.6 })),
    ...[65.2, 66.3, 67.4, 68.5, 69.6, 70.7, 71.8, 72.9, 74.0].map((t) => ({ t, src: sfx("oco"), v: 0.22 })),
    { t: 12.1, src: POP, v: 0.4 },
    { t: 51.6, src: POP, v: 0.4 },
  ],
};

export const PARTES = { 1: P1, 2: P2, 3: P3, 4: P4 };
