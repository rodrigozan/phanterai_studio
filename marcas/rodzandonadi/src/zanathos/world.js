import { random } from "remotion";

export const C = {
  papel: "#E9D9B6",
  papelEscuro: "#CDB88C",
  tinta: "#2B1D14",
  ouro: "#F2B544",
  mata: "#3F6B3A",
  okhu: "#2E5C7A",
  forjas: "#8A3B1E",
  brasa: "#FF7A2A",
  chama: "#F4F1FF",
  halo: "#9FB8FF",
  cristal: "#9FE3E6",
  fundo: "#0B0710",
  borda: "#5B2A86",
  savana: "#C9A15A",
  violeta: "#B57BFF",
  ferro: "#6E6A72",
  canalRoxoEscuro: "#1F0526",
  canalRoxo: "#572173",
  canalAmarelo: "#F2CC45",
  canalCinza: "#DEDEDE",
};

export const FPS = 30;
export const f = (s) => Math.round(s * FPS);

export const T = {
  disse: 2.96,
  entao: 7.84,
  zanathos: 10.24,
  cosmos: 11.3,
  ozare: 12.64,
  ted: 16.24,
  mapa: 19.4,
  sete: 20.08,
  vertebras: 21.52,
  mata: 23.28,
  mar: 24.24,
  forjas: 25.12,
  savana: 25.92,
  altos: 27.04,
  coracao: 28.08,
  kasembe: 29.08,
  sobe: 30.6,
  fonte: 32.32,
  caiu: 33.32,
  queda: 34.16,
  lagos: 36.08,
  oceano: 37.44,
  ilhas: 39.28,
  afundados: 40.68,
  deserto: 41.7,
  partida: 42.2,
  fundo: 43.36,
  povos: 44.32,
  mitos: 47.16,
  biloko: 47.9,
  kishi: 49.12,
  tokoloshe: 50.4,
  anhanga: 51.84,
  mapinguari: 53.24,
  capitais: 55.04,
  mapaFinal: 58.04,
  proximo: 59.52,
  olhos: 60.1,
  card: 61.5,
  fim: 65.1,
};

const r = (s) => random(`zan-${s}`);

export const smooth = (pts, closed) => {
  const n = pts.length;
  const P = closed ? [pts[n - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[n - 1]];
  const fx = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  let d = `M${fx(pts[0])}`;
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${fx(c1)} ${fx(c2)} ${fx(p2)}`;
  }
  return closed ? `${d}Z` : d;
};

export const organic = (pts, seed, amp = 14, sub = 3, closed = true) => {
  const out = [];
  const last = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < last; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    for (let k = 0; k < sub; k++) {
      const t = k / sub;
      const o = k === 0 ? 0 : (r(`${seed}-${i}-${k}`) - 0.5) * 2 * amp;
      out.push([p[0] + dx * t + nx * o, p[1] + dy * t + ny * o]);
    }
  }
  if (!closed) out.push(pts[pts.length - 1]);
  return out;
};

export const blob = (cx, cy, rx, ry, seed, j = 0.16, n = 14) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r(`${seed}-b${i}`) - 0.5) * 2 * j;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smooth(pts, true);
};

export const CONTINENTE = smooth(
  organic(
    [
      [185, 640], [300, 602], [440, 618], [560, 596], [700, 612], [845, 632], [915, 700], [900, 820], [928, 935],
      [898, 1060], [915, 1180], [882, 1300], [835, 1420], [800, 1520], [770, 1615], [640, 1665], [450, 1668],
      [310, 1622], [270, 1520], [240, 1420], [190, 1320], [163, 1200], [150, 1080], [176, 960], [150, 840], [166, 722],
    ],
    "cont",
    16,
    3,
  ),
  true,
);

export const ILHAS = [
  { x: 540, y: 432, rx: 125, ry: 50, base: 560 },
  { x: 215, y: 402, rx: 64, ry: 28, base: 250 },
  { x: 870, y: 412, rx: 70, ry: 30, base: 830 },
  { x: 360, y: 505, rx: 52, ry: 24, base: 380 },
  { x: 735, y: 508, rx: 58, ry: 25, base: 720 },
  { x: 112, y: 505, rx: 40, ry: 19, base: 200 },
  { x: 975, y: 525, rx: 42, ry: 19, base: 880 },
].map((i, k) => ({ ...i, d: blob(0, 0, i.rx, i.ry, `ilha${k}`, 0.22, 12) }));

export const AFUNDADOS = [
  blob(380, 1760, 190, 60, "af1", 0.25, 14),
  blob(720, 1790, 160, 55, "af2", 0.25, 14),
  blob(560, 1850, 120, 30, "af3", 0.3, 12),
];

export const ESTRADA = smooth([[190, 1185], [285, 1105], [380, 1010], [500, 945], [610, 840], [760, 715]], false);

export const CIDADES = [
  { n: "Ondaré", x: 380, y: 1012, s: ["star"], t: 44.6, cap: true },
  { n: "Sanzala", x: 270, y: 1045, s: ["dot"], t: 44.75 },
  { n: "Porto Mbali", x: 192, y: 1186, s: ["diamond"], t: 44.9 },
  { n: "Kirimba", x: 605, y: 1012, s: ["tri"], t: 45.0 },
  { n: "Ndiwê", x: 330, y: 752, s: ["star"], t: 45.25, cap: true },
  { n: "Oká", x: 445, y: 900, s: ["tri"], t: 45.4 },
  { n: "Thwa-Kundu", x: 760, y: 712, s: ["star"], t: 45.7, cap: true },
  { n: "Mina de Brasa", x: 858, y: 878, s: ["diamond"], t: 45.85 },
  { n: "Okhutá", x: 78, y: 1100, s: ["star"], t: 46.2, cap: true, below: true },
  { n: "Farol de Sal", x: 205, y: 1332, s: ["diamond"], t: 46.35 },
  { n: "Ekoá", x: 450, y: 1560, s: ["star"], t: 46.7, cap: true },
  { n: "Biblioteca do Vento", x: 640, y: 1592, s: ["spark"], t: 46.85 },
  { n: "O Campanário", x: 250, y: 905, s: ["cross", "tri"], t: 47.9, hoste: true },
  { n: "Nzimbe", x: 682, y: 1090, s: ["cross", "star"], t: 49.12, hoste: true, cap: true },
  { n: "Ferrugem", x: 680, y: 905, s: ["cross", "dot"], t: 50.4, hoste: true },
  { n: "Chifre-Branco", x: 470, y: 1045, s: ["dot"], t: 51.84 },
  { n: "Olho-do-Céu", x: 540, y: 430, s: ["star"], t: 53.24, cap: true },
  { n: "A Afogada", x: 540, y: 1772, s: ["cross", "diamond"], t: 54.2, hoste: true },
  { n: "Ruínas do Coração Claro", x: 420, y: 1292, s: ["spark"], t: 54.4, below: true },
];

export const ANCESTRAIS = [
  { n: "TED Tage", x: 540, y: 975, t: T.vertebras, cor: C.ouro },
  { n: "Imbali", x: 330, y: 770, t: T.mata, cor: C.ouro },
  { n: "Okhu", x: 80, y: 1050, t: T.mar, cor: C.ouro },
  { n: "Zuri-Ndaba", x: 760, y: 720, t: T.forjas, cor: C.ouro },
  { n: "Ayana", x: 540, y: 1560, t: T.savana, cor: C.ouro },
  { n: "Mbeze", x: 540, y: 640, t: T.altos, cor: C.ouro },
  { n: "Kasembe", x: 540, y: 1180, t: T.coracao, cor: C.violeta },
];

export const CHIPS = [
  [T.disse - 0.1, "Ep. 1 · O Mundo"],
  [T.cosmos, null],
  [T.sete, "Os Sete Ancestrais"],
  [T.vertebras, "TED Tage · As Vértebras"],
  [T.mata, "Imbali · Mata-Mãe"],
  [T.mar, "Okhu · Mar de Okhu"],
  [T.forjas, "Zuri-Ndaba · As Forjas"],
  [T.savana, "Ayana · Savana dos Ecos"],
  [T.altos, "Mbeze · Os Altos Abertos"],
  [T.coracao, "Kasembe · O Coração Claro"],
  [T.kasembe, "Kasembe · guardião da centelha"],
  [T.caiu - 0.15, null],
  [T.lagos, "Lagos de Cristal"],
  [T.oceano, "Oceano de Chama Branca"],
  [T.ilhas, "Arquipélago Suspenso"],
  [T.afundados, "Continentes Afundados"],
  [T.deserto, "Deserto de Cinza-Ferro"],
  [T.partida, "A Vértebra Partida"],
  [T.fundo, "O Fundo"],
  [T.povos, "Os Povos de Zanathos"],
  [T.mitos, "Mitos africanos e brasileiros"],
  [T.kishi - 0.1, null],
  [T.capitais, "As Capitais"],
  [T.mapaFinal, null],
];

export const RACAS = [
  { t: T.kishi, mito: "Kishi · Angola", nome: "Kishimbe", desc: "Rosto de luz na frente, boca de hiena na nuca", alvo: { x: 650, y: 1120, s: 1.5 }, tipo: "kishi" },
  { t: T.tokoloshe, mito: "Tokoloshe · Zulu", nome: "Tikolo", desc: "Somem ao engolir uma pedra de ferro", alvo: { x: 720, y: 880, s: 1.6 }, tipo: "tikolo" },
  { t: T.anhanga, mito: "Anhangá · Tupi", nome: "Anhangás", desc: "Chifres, olhos em brasa e código de honra", alvo: { x: 500, y: 1030, s: 1.6 }, tipo: "anhanga" },
  { t: T.mapinguari, mito: "Mapinguari · Amazônia", nome: "Mapingos", desc: "Um olho só e uma boca no ventre", alvo: { x: 540, y: 470, s: 1.5 }, tipo: "mapingo" },
];
