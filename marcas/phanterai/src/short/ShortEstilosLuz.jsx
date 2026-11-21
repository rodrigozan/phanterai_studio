import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 21/11/2026 12:00 — "9 estilos de luz para a IA parar de gerar imagem chapada".
// Título de trabalho dizia 34; a fonte primária lista 9. Fatos conferidos (capturados em fontes/ em 21/11/2026):
// - Adobe Firefly, ajuda oficial (web "Effects for generated images" e mobile "Set lighting for image generation"):
//   estilos de Lighting: Backlighting, Dramatic light, Golden hour, Harsh light, Long-time exposure, Low lighting,
//   Multiexposure, Studio light, Surreal lighting (9). Escolhidos como opção na seção Effects.
// - Google Cloud, "Prompt and image attribute guide" (Vertex AI/Imagen): "Lighting - natural, dramatic, warm, cold";
//   exemplo "studio photo of a modern arm chair, natural lighting" / "... dramatic lighting".
// A cena (esfera no pedestal) é desenhada em SVG no Remotion: nada gerado por IA, nenhum print. Fontes só no texto do post.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SEL_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-21-1200-34-estilos-de-luz";
export const SEL_FPS = 30;
const FPS = SEL_FPS;
const f = (p) => staticFile(`${SEL_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/CuriousFocus.mp3";
const TAIL = 0.7;

export const calculateEstilosLuzMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

let W = {};
const at = (i) => (W[i] ? Math.round(W[i].s * FPS) : 0);
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0, color: PINK }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);
const In = ({ fr, d, children, dy = 50, style = {}, damping = 13 }) => {
  const p = pop(fr, d, damping);
  if (fr < d) return null;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * dy}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};

// ---------- estilos (nomes exatos da ajuda do Firefly) ----------
const ESTILOS = [
  { id: "backlighting", nome: "Backlighting", pt: "luz por trás", icon: "🔆", rotulo: "luz atrás" },
  { id: "dramatic", nome: "Dramatic light", pt: "sombra de cinema", icon: "🎭", rotulo: "luz lateral" },
  { id: "golden", nome: "Golden hour", pt: "sol baixo, dourado", icon: "🌅", rotulo: "sol baixo" },
  { id: "harsh", nome: "Harsh light", pt: "luz dura", icon: "☀️", rotulo: "luz de cima" },
  { id: "longexp", nome: "Long-time exposure", pt: "rastros de luz", icon: "🌠", rotulo: "rastros" },
  { id: "low", nome: "Low lighting", pt: "pouca luz", icon: "🕯️", rotulo: "pouca luz" },
  { id: "multi", nome: "Multiexposure", pt: "duas imagens", icon: "🎞️", rotulo: "2 exposições" },
  { id: "studio", nome: "Studio light", pt: "luz controlada", icon: "💡", rotulo: "softbox" },
  { id: "surreal", nome: "Surreal lighting", pt: "cores que não existem", icon: "🌈", rotulo: "cores irreais" },
];
const PROMPT_BASE = "foto de uma escultura no pedestal, ";

// Parâmetros de cada luz: parede, chão, esfera (gradiente radial), sombra, extras.
const LOOK = {
  flat: { wall: ["#8f8b9d", "#8f8b9d"], floor: ["#827e90", "#827e90"], sph: ["#b2aec0", "#aca8ba", "#a6a2b4"], hi: [0.5, 0.5], ped: ["#9b97aa", "#9b97aa"], sh: null },
  backlighting: { wall: ["#120d24", "#1d1533"], floor: ["#1a1430", "#0c0918"], sph: ["#4a3f60", "#2a2240", "#141022"], hi: [0.5, 0.75], ped: ["#2a2240", "#1a1430"], sh: { dx: 0, dy: 120, rx: 170, ry: 26, op: 0.55, blur: 10 }, glow: "#fff1c9", rim: "#fff6dc" },
  dramatic: { wall: ["#0d0a16", "#08060e"], floor: ["#100c18", "#050308"], sph: ["#ffe6c8", "#8a5a46", "#0a0710"], stops: [0, 0.32, 0.62], hi: [0.22, 0.3], ped: ["#7a5a4a", "#07050a"], sh: { dx: 210, dy: 0, rx: 260, ry: 30, op: 0.9, blur: 4 }, beam: "left" },
  golden: { wall: ["#ff9c45", "#ffcf7a"], floor: ["#7a4220", "#3a1c0c"], sph: ["#ffe7a6", "#e48a3a", "#5a2810"], hi: [0.18, 0.45], ped: ["#e09a52", "#6a3214"], sh: { dx: 300, dy: 0, rx: 330, ry: 22, op: 0.6, blur: 6 }, sun: true },
  harsh: { wall: ["#f4f4f4", "#d6d6d6"], floor: ["#cfcfcf", "#b5b5b5"], sph: ["#ffffff", "#9a9a9a", "#141414"], stops: [0, 0.3, 0.55], hi: [0.5, 0.1], ped: ["#f0f0f0", "#9a9a9a"], sh: { dx: 0, dy: 0, rx: 150, ry: 34, op: 0.97, blur: 0 }, top: true },
  longexp: { wall: ["#04061a", "#0b0f2a"], floor: ["#0a0c1c", "#04050c"], sph: ["#7aa6ff", "#283a78", "#0a0f26"], hi: [0.3, 0.55], ped: ["#283a78", "#0a0f26"], sh: { dx: 0, dy: 0, rx: 150, ry: 20, op: 0.5, blur: 8 }, trails: true },
  low: { wall: ["#0c0a12", "#07060b"], floor: ["#0a080e", "#040306"], sph: ["#8a7660", "#2a2030", "#07060a"], stops: [0, 0.25, 0.6], hi: [0.28, 0.32], ped: ["#2a2030", "#050407"], sh: { dx: 90, dy: 0, rx: 200, ry: 24, op: 0.8, blur: 10 }, vign: true },
  multi: { wall: ["#ece6f4", "#d9d1e6"], floor: ["#d9d1e6", "#c4bad6"], sph: ["#ffffff", "#c9c0dc", "#8f86a6"], hi: [0.4, 0.3], ped: ["#e2dbee", "#b0a6c6"], sh: { dx: 0, dy: 0, rx: 160, ry: 20, op: 0.25, blur: 12 }, multi: true },
  studio: { wall: ["#fbfaff", "#e9e6f2"], floor: ["#e9e6f2", "#e2dfec"], sph: ["#ffffff", "#cfcadc", "#8a849c"], hi: [0.38, 0.28], ped: ["#ffffff", "#c9c4d6"], sh: { dx: 30, dy: 0, rx: 175, ry: 26, op: 0.32, blur: 16 }, soft: true, seamless: true },
  surreal: { wall: ["#3a0a5a", "#062a4a"], floor: ["#1a0630", "#041a30"], sph: ["#ffffff", "#ff3bd4", "#1a0a40"], hi: [0.3, 0.35], ped: ["#ff3bd4", "#22e6ff"], sh: { dx: -80, dy: 0, rx: 200, ry: 26, op: 0.6, blur: 8 }, neon: true },
};

// Cena desenhada: parede, chão, pedestal, esfera, sombra e a luz de cada estilo.
const Cena = ({ look = "flat", fr, uid, boost = 0, size = 800 }) => {
  const L = LOOK[look];
  const st = L.stops || [0, 0.45, 1];
  const k = 1 + 0.6 * boost;
  const sx = 410, sy = 330, r = 125;
  const hue = L.neon ? Math.sin(fr / 14) * 40 * (1 + boost) : 0;
  const flick = L.vign ? 0.85 + 0.15 * Math.sin(fr / 2.7) * Math.sin(fr / 5.3) : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 820 820" style={{ display: "block", filter: hue ? `hue-rotate(${hue}deg)` : undefined }}>
      <defs>
        <linearGradient id={`${uid}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={L.wall[0]} /><stop offset="1" stopColor={L.wall[1]} /></linearGradient>
        <linearGradient id={`${uid}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={L.floor[0]} /><stop offset="1" stopColor={L.floor[1]} /></linearGradient>
        <linearGradient id={`${uid}p`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={L.ped[0]} /><stop offset="1" stopColor={L.ped[1]} /></linearGradient>
        <radialGradient id={`${uid}s`} cx={L.hi[0]} cy={L.hi[1]} r="0.95">
          <stop offset={st[0]} stopColor={L.sph[0]} /><stop offset={st[1]} stopColor={L.sph[1]} /><stop offset={st[2]} stopColor={L.sph[2]} />
        </radialGradient>
        <radialGradient id={`${uid}g`}><stop offset="0" stopColor={L.glow || "#fff"} stopOpacity="1" /><stop offset="0.45" stopColor={L.glow || "#fff"} stopOpacity="0.35" /><stop offset="1" stopColor={L.glow || "#fff"} stopOpacity="0" /></radialGradient>
        <radialGradient id={`${uid}v`} cx="0.3" cy="0.4" r="0.8"><stop offset="0.2" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.92" /></radialGradient>
        <linearGradient id={`${uid}n`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ff3bd4" /><stop offset="1" stopColor="#22e6ff" /></linearGradient>
        <filter id={`${uid}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={L.sh ? L.sh.blur : 0} /></filter>
        <filter id={`${uid}r`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        <clipPath id={`${uid}c`}><circle cx={sx} cy={sy} r={r} /></clipPath>
      </defs>
      <rect x="0" y="0" width="820" height="820" fill={`url(#${uid}w)`} />
      {!L.seamless && <rect x="0" y="560" width="820" height="260" fill={`url(#${uid}f)`} />}
      {L.seamless && <rect x="0" y="480" width="820" height="340" fill={`url(#${uid}f)`} opacity="0.7" />}
      {L.sun && (
        <g>
          <circle cx="110" cy={545 - 8 * boost} r={170 * k} fill="#fff2b8" opacity="0.35" />
          <circle cx="110" cy={545 - 8 * boost} r="62" fill="#fff6cf" />
          <rect x="0" y="560" width="820" height="6" fill="#ffd27a" opacity="0.6" />
        </g>
      )}
      {L.glow && <circle cx={sx} cy={sy - 10} r={300 * (0.95 + 0.25 * boost + 0.03 * Math.sin(fr / 5))} fill={`url(#${uid}g)`} />}
      {L.top && <polygon points={`330,0 490,0 560,560 260,560`} fill="#ffffff" opacity={0.35 + 0.2 * boost} />}
      {L.beam === "left" && <polygon points={`0,120 0,420 ${300 + 60 * boost},${380} ${300 + 60 * boost},${240}`} fill="#ffe6c8" opacity={0.12 + 0.1 * boost} />}
      {L.soft && [[60, 40], [600, 40]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 20} y={y - 20} width="200" height="150" rx="18" fill="#fff" opacity={0.5 + 0.3 * boost} filter={`url(#${uid}r)`} />
          <rect x={x} y={y} width="160" height="110" rx="12" fill="#ffffff" stroke="#d8d4e4" strokeWidth="4" />
        </g>
      ))}
      {L.trails && Array.from({ length: 5 }, (_, i) => {
        const len = 1400, off = (len - ((fr * (14 + i * 3)) % len)) * (1 - 0.3 * boost);
        const c = ["#ff4d6d", "#ffd166", "#ffffff", "#ff4d6d", "#7ad7ff"][i];
        return <path key={i} d={`M -40 ${600 + i * 34} C 220 ${470 - i * 30}, 600 ${720 + i * 10}, 880 ${520 + i * 26}`} stroke={c} strokeWidth={6 + 2 * boost} fill="none" strokeLinecap="round" strokeDasharray={`${len * (0.5 + 0.4 * boost)} ${len}`} strokeDashoffset={off} opacity="0.9" />;
      })}
      {L.trails && Array.from({ length: 14 }, (_, i) => <circle key={"st" + i} cx={(i * 131) % 820} cy={(i * 71) % 260 + 20} r={i % 3 ? 2 : 3} fill="#fff" opacity={0.4 + 0.4 * Math.sin(fr / 6 + i)} />)}
      {L.sh && <ellipse cx={sx + L.sh.dx * (L.sh.dx ? k : 1) / 2} cy={472 + L.sh.dy} rx={L.sh.rx + Math.abs(L.sh.dx) * 0.3 * boost} ry={L.sh.ry} fill="#000" opacity={L.sh.op} filter={L.sh.blur ? `url(#${uid}b)` : undefined} />}
      <rect x="295" y="460" width="230" height="230" fill={`url(#${uid}p)`} />
      <rect x="285" y="450" width="250" height="22" rx="6" fill={L.ped[0]} opacity="0.95" />
      {L.multi && (
        <g style={{ mixBlendMode: "multiply" }}>
          <circle cx={sx - 70 - 30 * boost} cy={sy - 10} r={r} fill="#ff8bd8" opacity="0.55" />
          <circle cx={sx + 70 + 30 * boost} cy={sy + 10} r={r} fill="#7ab8ff" opacity="0.55" />
        </g>
      )}
      {L.rim && <circle cx={sx} cy={sy} r={r + 6} fill="none" stroke={L.rim} strokeWidth={14 + 10 * boost} opacity={0.75 + 0.25 * Math.sin(fr / 4) * boost} filter={`url(#${uid}r)`} />}
      {L.neon && <circle cx={sx} cy={sy} r={r + 8} fill="none" stroke={`url(#${uid}n)`} strokeWidth={14 + 8 * boost} filter={`url(#${uid}r)`} />}
      <circle cx={sx} cy={sy} r={r} fill={`url(#${uid}s)`} opacity={L.multi ? 0.8 : 1} />
      {L.neon && <circle cx={sx} cy={sy} r={r} fill={`url(#${uid}n)`} opacity="0.55" style={{ mixBlendMode: "screen" }} />}
      {L.multi && (
        <g clipPath={`url(#${uid}c)`} opacity={0.5 + 0.3 * boost}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={300 + i * 32} y={330 - ((i * 37) % 90)} width="26" height="200" fill="#4a3f70" />)}
        </g>
      )}
      {L.rim && <circle cx={sx} cy={sy} r={r} fill="none" stroke={L.rim} strokeWidth="4" opacity="0.95" />}
      {L.vign && <rect x="0" y="0" width="820" height="820" fill={`url(#${uid}v)`} opacity={(0.9 + 0.1 * boost) / flick} />}
      {L.vign && <circle cx="120" cy="640" r={40 * flick} fill="#ffb35c" opacity={0.35 * flick} filter={`url(#${uid}r)`} />}
    </svg>
  );
};

// Moldura com antes (chapada) e depois (estilo), revelado da esquerda para a direita.
const Quadro = ({ fr, look, p = 1, boost = 0, uid, size = 800, tag, tagOn, children, prev, pb = 0, scan = null }) => (
  <div style={{ position: "relative", width: size, height: size, borderRadius: 34, overflow: "hidden", border: `3px solid ${PINKA(0.55)}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 70px ${PINKA(0.25)}` }}>
    <Cena look="flat" fr={fr} uid={uid + "a"} size={size} />
    {prev && pb > 0 && p <= 0 && (
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${100 - 100 * pb}%)` }}><Cena look={prev} fr={fr} uid={uid + "q"} size={size} /></div>
    )}
    {scan !== null && <div style={{ position: "absolute", left: 0, right: 0, top: size * scan - 5, height: 10, background: PINK, opacity: 0.8, boxShadow: `0 0 30px ${PINK}` }} />}
    {p > 0 && (
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - 100 * p}% 0 0)` }}>
        <Cena look={look} fr={fr} uid={uid + "b"} boost={boost} size={size} />
      </div>
    )}
    {p > 0 && p < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${100 * p}%`, width: 8, marginLeft: -4, background: "#fff", boxShadow: `0 0 40px ${PINK}` }} />}
    {tag && <div style={{ position: "absolute", left: 24, top: 22, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", background: tagOn ? PINK : "rgba(0,0,0,0.55)", padding: "8px 20px", borderRadius: 16 }}>{tag}</div>}
    {children}
  </div>
);

const Fundo = ({ fr }) => {
  const dots = Array.from({ length: 26 }, (_, k) => {
    const x = (k * 397) % 1080, y0 = (k * 613) % 1920;
    const y = (y0 - fr * (0.4 + (k % 5) * 0.15) + 1920 * 4) % 1920;
    return <div key={k} style={{ position: "absolute", left: x, top: y, width: 4 + (k % 3) * 2, height: 4 + (k % 3) * 2, borderRadius: 9, background: k % 4 ? "rgba(190,170,255,0.35)" : PINKA(0.5) }} />;
  });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1d0f3f 0%, #0b0618 60%, #05030c 100%)" }}>
      <div style={{ position: "absolute", left: -600, right: -600, top: 1050, height: 1100, transform: "perspective(700px) rotateX(62deg)", transformOrigin: "50% 0%",
        backgroundImage: "linear-gradient(rgba(170,130,255,0.18) 2px, transparent 2px), linear-gradient(90deg, rgba(170,130,255,0.18) 2px, transparent 2px)",
        backgroundSize: "90px 90px", backgroundPosition: `0px ${(fr * 1.5) % 90}px` }} />
      <div style={{ position: "absolute", left: 20, top: 300, width: 1040, height: 1040, borderRadius: "50%",
        background: `radial-gradient(circle, ${PINKA(0.22 + 0.05 * Math.sin(fr / 20))} 0%, transparent 65%)` }} />
      {dots}
    </AbsoluteFill>
  );
};

const Logo = ({ fr }) => (
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 160, 175) }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);

const Janela = ({ title = "", children, w = 900, h = 760, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: "2px solid rgba(190,160,255,0.28)", boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.18)}`, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginLeft: 14, whiteSpace: "nowrap" }}>{title}</div>
    </div>
    <div style={{ padding: 30, position: "relative", height: h - 64 }}>{children}</div>
  </div>
);

const Big = ({ children, fr, d, top = 220, bg = PINK, rot = 0, size = 150 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", zIndex: 6, transform: `scale(${d <= 0 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : 0.55 + 0.45 * pop(fr, d, 9)})` }}>
    <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: size, color: "#fff", background: bg, padding: "0 42px", borderRadius: 30, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>{children}</span>
  </div>
);

const Pill = ({ children, bg = "rgba(52,211,153,0.16)", c = GREEN, size = 40 }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, background: bg, border: `2px solid ${c}`, padding: "8px 26px", borderRadius: 40, whiteSpace: "nowrap" }}>{children}</span>
);

// Barra de prompt: base fixa + termo de luz digitado em rosa.
const Prompt = ({ fr, base, term, a, b, w = 900, faltando, erase }) => (
  <div style={{ width: w, minHeight: 96, borderRadius: 26, background: WIN, border: `2px solid ${faltando ? RED : PINKA(0.6)}`, padding: "18px 26px", fontFamily: MONO, fontSize: 30, color: "#fff", lineHeight: 1.3, boxSizing: "border-box" }}>
    <span style={{ color: PINK }}>›</span> {base}
    {term && <span style={{ color: "#fff", background: PINKA(0.85), padding: "0 8px", borderRadius: 8 }}>{erase ? term.slice(0, Math.round(term.length * (1 - lin(fr, a, b)))) : typed(term, fr, a, b)}</span>}
    {faltando && <span style={{ color: RED, opacity: fr % 14 < 9 ? 1 : 0.3 }}>+ luz ?</span>}
    {blink(fr)}
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dCh = at(3), dErro = at(5), dLuz = at(8), dNove = at(9), dPr = at(13), dNona = at(17), dEst = at(23);
  let big, bigD, size = 150, bg = RED, rot = -3;
  if (fr < dErro) { big = "chapada?"; bigD = 0; }
  else if (fr < dLuz) { big = "o erro é…"; bigD = dErro; size = 130; rot = 2; }
  else if (fr < dNove) { big = "a luz!"; bigD = dLuz; size = 170; bg = PINK; rot = 0; }
  else if (fr < dNona) { big = "9 luzes"; bigD = dNove; size = 150; bg = PINK; rot = -2; }
  else { big = "e a nona?"; bigD = dNona; size = 130; bg = RED; rot = 2; }
  const dEst2 = at(22);
  const flash = [dCh, dErro, dLuz, dNove, dPr, dNona, dEst2].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const pW = lin(fr, dLuz, dLuz + 9);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={200} rot={rot} bg={bg}>{big}</Big>
      {fr < dNove ? (
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)})` }}>
          <Prompt fr={fr} base={typed(PROMPT_BASE.slice(0, -2), fr, -10, 14)} faltando={fr >= dErro && fr < dLuz} term={fr >= dLuz ? "dramatic light" : null} a={dLuz} b={dLuz + 6} />
          <div style={{ transform: `translateX(${shake(fr, dCh, 16) + shake(fr, dErro, 10)}px)` }}>
            <Quadro fr={fr} look="dramatic" p={pW} uid="hk" size={760} tag={pW >= 1 ? "✓ com luz" : fr < dCh ? `gerando ${Math.min(100, Math.round(100 * lin(fr, 0, dCh)))}%` : "sem luz"} tagOn={pW >= 1}>
              {fr < dCh && <div style={{ position: "absolute", left: 0, right: 0, top: 760 * lin(fr, 0, dCh) - 6, height: 12, background: PINK, boxShadow: `0 0 40px ${PINK}` }} />}
              {fr < dCh && <div style={{ position: "absolute", left: 0, right: 0, top: 760 * lin(fr, 0, dCh), bottom: 0, background: "rgba(10,6,24,0.85)" }} />}
              {fr >= dCh && fr < dLuz + 4 && (
                <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: 1 - lin(fr, dLuz, dLuz + 4) }}>
                  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 92, color: RED, border: `8px solid ${RED}`, borderRadius: 20, padding: "6px 30px", background: "rgba(255,255,255,0.75)", transform: `rotate(-12deg) scale(${interpolate(fr, [dCh, dCh + 6], [1.6, 1], clamp)})` }}>✗ CHAPADA</span>
                </div>
              )}
            </Quadro>
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 290px)", gap: 22 }}>
            {ESTILOS.map((e, k) => {
              const p = pop(fr, dNove + k * 2, 11);
              const nona = k === 8;
              const roll = fr >= dNona && fr < dEst2 ? Math.floor((fr - dNona) / 3) % 9 : -1;
              const dim = fr >= dEst2 && !nona;
              const big9 = nona && fr >= dEst2;
              const hot = roll === k;
              return (
                <div key={k} style={{ position: "relative", width: 290, height: 330, borderRadius: 24, overflow: "hidden", background: WIN, border: `${hot ? 7 : 3}px solid ${big9 ? RED : hot ? "#fff" : PINKA(0.5)}`, opacity: p * (dim ? 0.35 : 1), zIndex: big9 || hot ? 3 : 1,
                  transform: `scale(${(0.5 + 0.5 * p) * (big9 ? 1.12 + 0.04 * Math.sin(fr / 3) : hot ? 1.08 : 1)}) translateX(${big9 ? shake(fr, dEst2, 14) : 0}px)` }}>
                  {nona ? (
                    <div style={{ width: 290, height: 250, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${PINKA(0.5)}, rgba(34,230,255,0.25))` }}>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, color: "#fff", transform: `rotate(${Math.sin(fr / 5) * 8}deg)` }}>?</span>
                    </div>
                  ) : <Cena look={e.id} fr={fr} uid={"t" + k} size={290} />}
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", background: "rgba(10,6,24,0.9)" }}>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: PINK }}>{k + 1}</span>
                    <span style={{ fontFamily: MONO, fontSize: 21, color: "#fff", whiteSpace: "nowrap" }}>{nona ? "???" : typed(e.nome.toLowerCase(), fr, dPr - 6 + k * 2, dPr + 2 + k * 2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {fr >= dEst && <div style={{ position: "absolute", top: 1430, width: "100%", textAlign: "center" }}><In fr={fr} d={dEst}><Pill c={RED} bg="rgba(255,92,122,0.15)" size={42}>⚠ fica até o fim</Pill></In></div>}
    </AbsoluteFill>
  );
};

// ---------- 1: Firefly (botão) + guia do Google (prompt) ----------
const Botoes = ({ fr }) => {
  const d0 = at(24), dF = at(31), dB = at(34);
  return (
    <Janela title={typed("Adobe Firefly · Efeitos › Iluminação", fr, d0, dF + 6)} w={920} h={760}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {ESTILOS.map((e, k) => {
          const d = d0 + 4 + k * 3;
          if (fr < d) return <div key={k} />;
          const p = pop(fr, d, 12);
          const sel = k === 1 && fr >= dB + 4;
          const hov = fr >= d0 + 30 && fr < dB - 8 && Math.floor((fr - d0 - 30) / 5) % 9 === k;
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 18, background: sel ? PINK : hov ? PINKA(0.35) : "rgba(255,255,255,0.07)", border: `2px solid ${sel || hov ? "#fff" : "rgba(190,160,255,0.2)"}`, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${sel ? 1.04 : hov ? 1.05 : 1})`, gridColumn: k === 8 ? "1 / span 2" : undefined }}>
              <span style={{ fontSize: 40 }}>{e.icon}</span>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }}>{e.nome}</span>
            </div>
          );
        })}
      </div>
      {fr >= dB - 8 && <div style={{ position: "absolute", left: interpolate(fr, [dB - 8, dB], [700, 380], clamp), top: interpolate(fr, [dB - 8, dB], [760, 150], clamp), fontSize: 80, transform: `scale(${fr >= dB && fr < dB + 5 ? 0.85 : 1})`, zIndex: 3 }}>👆</div>}
      {fr >= dB + 4 && (
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 34, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ borderRadius: 18, overflow: "hidden", border: `3px solid ${PINK}`, transform: `scale(${pop(fr, dB + 4, 11)})` }}><Cena look="dramatic" fr={fr} uid="bt" size={260} /></div>
          <In fr={fr} d={dB + 8}><Pill size={40} c={PINK} bg={PINKA(0.15)}>1 clique ✓</Pill></In>
        </div>
      )}
    </Janela>
  );
};

const GuiaGoogle = ({ fr }) => {
  const d0 = at(35), dE = at(41), dL = at(43), dP = at(45);
  const txt = "studio photo of a modern arm chair, ";
  const word = fr < dP + 3 ? "natural" : "dramatic";
  return (
    <Janela title="Imagen (Google) · prompt" w={920} h={900}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ fontFamily: MONO, fontSize: 38, color: "#fff", lineHeight: 1.35 }}>
          <span style={{ color: PINK }}>›</span> {typed(txt, fr, d0 + 2, dE)}
          {fr >= dE && <span style={{ background: fr >= dL ? PINK : "transparent", padding: "0 8px", borderRadius: 8, display: "inline-block", transform: `rotateX(${fr >= dP && fr < dP + 6 ? (fr - dP) * 30 : 0}deg)` }}>{typed(word + " lighting", fr, fr < dP ? dE : dP + 3, fr < dP ? dE + 8 : dP + 9)}</span>}
          {blink(fr)}
        </div>
        <div style={{ display: "flex", gap: 22, justifyContent: "center", marginTop: 10 }}>
          {[["natural", "flat", "studio"], ["dramatic", "dramatic", "dramatic"]].map(([n, , lk], k) => {
            const d = k ? dP + 3 : dL;
            if (fr < d) return <div key={k} style={{ width: 380, height: 440, borderRadius: 22, border: "3px dashed rgba(190,160,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 30, color: GREY, background: `linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,${0.08 + 0.06 * Math.sin(fr / 4 + k)}), rgba(255,255,255,0.03))` }}>{k ? "dramatic ?" : "natural ?"}</div>;
            return (
              <div key={k} style={{ width: 380, borderRadius: 22, overflow: "hidden", border: `3px solid ${k ? PINK : "rgba(190,160,255,0.35)"}`, transform: `scale(${pop(fr, d, 11)})` }}>
                <Cena look={lk} fr={fr} uid={"gg" + k} size={380} />
                <div style={{ padding: "12px 18px", fontFamily: MONO, fontSize: 28, color: "#fff", background: k ? PINK : "rgba(255,255,255,0.08)" }}>{n} lighting</div>
              </div>
            );
          })}
        </div>
      </div>
    </Janela>
  );
};

const Intro = ({ fr }) => {
  const dG = at(35);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center" }}>
        <In fr={fr} d={fr < dG ? at(24) : dG} dy={-40}>
          <Pill size={44} c="#fff" bg={PINKA(0.3)}>{fr < dG ? "🖱 como botão" : "⌨ escrito no prompt"}</Pill>
        </In>
      </div>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {fr < dG ? <Botoes fr={fr} /> : <div style={{ transform: `scale(${pop(fr, dG, 13)})` }}><GuiaGoogle fr={fr} /></div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: os nove estilos, um palco só ----------
const ITENS = [[46, 48, 49, 52], [54, 56, 58, 60], [63, 65, 67, 69], [71, 73, 75, 77], [79, 81, 83, 85], [86, 88, 90, 92], [95, 97, 98, 100], [105, 107, 109, 111], [113, 116, 118, 120]];
const POS = { backlighting: [420, 230], dramatic: [40, 260], golden: [60, 470], harsh: [430, 90], longexp: [420, 600], low: [70, 600], multi: [430, 90], studio: [420, 230], surreal: [430, 560] };

const Lista = ({ fr }) => {
  let k = 0;
  ITENS.forEach((it, i) => { if (fr >= at(it[0]) - 2) k = i; });
  const [n0, t0, d1, d2] = ITENS[k].map(at);
  const e = ESTILOS[k];
  const p = ease(lin(fr, t0 + 10, t0 + 20));
  const prog = lin(fr, t0 + 6, t0 + 14);
  const boost = ease(lin(fr, d2, d2 + 10));
  const chipP = pop(fr, n0, 12);
  const [lx, ly] = POS[e.id];
  const nona = k === 8;
  return (
    <AbsoluteFill>
      {/* chip do item */}
      <div style={{ position: "absolute", top: 180, left: 70, right: 70, display: "flex", alignItems: "center", gap: 22, padding: "16px 26px", borderRadius: 28, background: "rgba(30,18,60,0.92)", border: `2px solid ${nona ? RED : PINKA(0.6)}`, transform: `translateY(${(1 - chipP) * -60}px) scale(${0.9 + 0.1 * chipP})`, opacity: chipP }}>
        <div style={{ width: 92, height: 92, borderRadius: 24, background: nona ? RED : PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 58, color: "#fff", flexShrink: 0 }}>{k + 1}</div>
        <div style={{ fontSize: 60 }}>{e.icon}</div>
        <div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff", lineHeight: 1.05, whiteSpace: "nowrap" }}>{e.nome}</div>
          <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 34, color: BODY, marginTop: 4 }}>{e.pt}</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 345, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Prompt fr={fr} base={PROMPT_BASE} term={fr >= t0 ? e.nome.toLowerCase() : k > 0 && fr < n0 + 8 ? ESTILOS[k - 1].nome.toLowerCase() : null} a={fr >= t0 ? t0 : n0} b={fr >= t0 ? t0 + 7 : n0 + 8} erase={fr < t0} w={760} />
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", background: fr >= t0 + 6 ? PINK : "rgba(255,255,255,0.12)", padding: "26px 24px", borderRadius: 22, transform: `scale(${fr >= t0 + 6 && fr < t0 + 10 ? 0.88 : 1})` }}>Gerar</div>
        </div>
        <div style={{ width: 900, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.1)", overflow: "hidden", opacity: prog > 0 && p < 1 ? 1 : 0.25 }}>
          <div style={{ width: `${100 * prog}%`, height: "100%", background: PINK }} />
        </div>
        <Quadro fr={fr} look={e.id} p={p} boost={boost} uid={"it" + k} size={800} prev={k > 0 ? ESTILOS[k - 1].id : null} pb={1 - ease(lin(fr, n0, n0 + 8))} scan={fr >= n0 + 6 && p <= 0 ? ((fr - n0 - 6) % 20) / 20 : null} tag={p >= 1 ? `✓ ${e.nome.toLowerCase()}` : fr < t0 ? "chapada" : `gerando ${Math.round(100 * prog)}%`} tagOn={p >= 1}>
          {fr >= d1 && (
            <div style={{ position: "absolute", left: lx, top: ly, transform: `scale(${pop(fr, d1, 9)}) translateY(${Math.sin(fr / 6) * 6}px)`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 64 }}>{e.icon}</span>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", background: "rgba(10,6,24,0.8)", border: `2px solid ${PINK}`, padding: "6px 16px", borderRadius: 14, whiteSpace: "nowrap" }}>{e.rotulo}</span>
            </div>
          )}
        </Quadro>
        {/* progresso da lista */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          {ESTILOS.map((_, i) => {
            const done = i < k || (i === k && fr >= d2);
            const cur = i === k && !done;
            return <div key={i} style={{ width: 54, height: 54, borderRadius: 27, background: done ? PINK : "rgba(255,255,255,0.1)", border: `3px solid ${cur ? PINK : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 26, color: "#fff",
              transform: `scale(${cur ? 1.1 + 0.08 * Math.sin(fr / 3) : i === k && done ? pop(fr, d2, 8) : 1})` }}>{done ? "✓" : i + 1}</div>;
          })}
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", marginLeft: 10 }}>{k + (fr >= d2 ? 1 : 0)}/9</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(122), dL = at(127), dS = at(129), dC = at(131);
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} top={190} size={100}>9 prompts</Big>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: 14 }}>
          {ESTILOS.map((e, k) => {
            const p = pop(fr, d0 + k * 2, 11);
            const hot = fr >= d0 + 24 && Math.floor((fr - d0 - 24) / 4) % 9 === k;
            return (
              <div key={k} style={{ position: "relative", width: 280, height: 200, borderRadius: 20, overflow: "hidden", border: `${hot ? 6 : 3}px solid ${hot ? "#fff" : PINKA(0.6)}`, opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (hot ? 1.06 : 1)})`, zIndex: hot ? 2 : 1 }}>
                <div style={{ marginTop: -40 }}><Cena look={e.id} fr={fr} uid={"c" + k} size={280} /></div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "6px 10px", fontFamily: MONO, fontSize: 19, color: "#fff", background: "rgba(10,6,24,0.88)", whiteSpace: "nowrap" }}>✓ {e.nome.toLowerCase()}</div>
              </div>
            );
          })}
        </div>
        {fr >= dL && <In fr={fr} d={dL}><Pill size={42} c={PINK} bg={PINKA(0.15)}>📝 os 9 na legenda ↓</Pill></In>}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <div style={{ width: 640, display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dC ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dS - 4, dS + 2) }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{typed("LUZ", fr, dC, dC + 8)}{blink(fr)}</span>
            {fr >= dC + 12 && <span style={{ marginLeft: "auto", fontSize: 48, transform: `scale(${pop(fr, dC + 12, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: fr >= dS + 6 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 34px", borderRadius: 20, transform: `scale(${fr >= dS + 6 ? pop(fr, dS + 6, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dS - 6, dS) }}>{fr >= dS + 6 ? "✓ Seguindo" : "Seguir"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Bloco = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};

const Reacao = ({ fr, a, b, pose, top = 1150, left }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  const x = 10 - (1 - pin) * 420 - pout * 420;
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 300, ...(left ? { left: x } : { right: x }), top, zIndex: 8 }} />;
};

// ---------- legendas ----------
const KEY = new Set(["chapada", "erro", "luz", "luzes", "nove", "9", "prompt", "prompts", "nona", "estranha", "firefly", "google", "botao", "escrever", "backlighting", "dramatic", "golden", "hour", "harsh", "longtime", "exposure", "low", "lighting", "multiexposure", "studio", "surreal", "light", "tras", "contorno", "cinema", "dourado", "dura", "recortada", "rastros", "suspense", "duas", "controlada", "cores", "existem", "legenda", "comenta", "segue", "adobe", "sombra"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5", seis: "6", sete: "7", oito: "8", nove: "9" };
const buildChunks = (words) => {
  const toks = [];
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const nx = words[k + 1] && norm(words[k + 1].w);
    const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
    if (n === "numero" && NUM[nx]) { toks.push({ t: "Nº " + NUM[nx] + tail(words[k + 1]), s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "nove" || n === "nona") { toks.push({ t: (n === "nove" ? "9" : "a 9ª") + tail(x), s: x.s, e: x.e, key: true, solo: n === "nona" }); continue; }
    toks.push({ t: x.w, s: x.s, e: x.e });
  }
  // "a" + "a 9ª" vira só "a 9ª"
  const t2 = [];
  toks.forEach((tk, i) => { if (toks[i + 1] && toks[i + 1].solo && norm(tk.t) === "a") { toks[i + 1].s = tk.s; return; } t2.push(tk); });
  const chunks = []; let cur = [];
  t2.forEach((tk) => {
    cur.push(tk);
    const len = cur.map((c) => c.t).join(" ").length;
    if (cur.length >= 3 || len > 14 || /[.,!?:;]$/.test(tk.t) || /\.\.\.$/.test(tk.t)) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  return chunks;
};

const Legendas = ({ chunks, fr }) => {
  const t = fr / FPS;
  let ci = -1;
  chunks.forEach((c, i) => { if (c[0].s <= t + 0.02) ci = i; });
  if (ci < 0) return null;
  const chunk = chunks[ci];
  if (t > chunk[chunk.length - 1].e + 0.8) return null;
  const p = pop(fr, Math.round(chunk[0].s * FPS), 15);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1560, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, transform: `scale(${0.85 + 0.15 * p})`, zIndex: 9 }}>
      {chunk.map((w, i) => {
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[,!?:;…"]+$/g, "").replace(/\.$/, "");
        const key = w.key || KEY.has(norm(shown));
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortEstilosLuz = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(24), at(46), at(122), end];
  const scenes = [Hook, Intro, Lista, CTA];
  const chunks = buildChunks(words);
  const itemT = ITENS.map((it) => at(it[1]));
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(4)} pose="surpresa" top={1180} />
      <Reacao fr={fr} a={at(116)} b={at(121)} pose="apontando" top={1200} />
      <Reacao fr={fr} a={at(129)} b={end} pose="comemorando" top={1150} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={1} /></Sequence>
      <Sequence from={0} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(5)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(8)} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.8} /></Sequence>
      <Sequence from={at(9)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(17)} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.45} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      {itemT.map((b, k) => <Sequence key={"w" + k} from={b + 10} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.22} /></Sequence>)}
      {ITENS.map((it, k) => <Sequence key={"p" + k} from={at(it[3])} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.3} /></Sequence>)}
      {[at(34), at(43), at(131) + 12].map((b, k) => <Sequence key={"d" + k} from={b} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const CapaEstilosLuz = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 92, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Imagem de IA</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 140, color: "#fff", background: RED, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 14 }}>chapada?</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 62, color: BODY, marginTop: 26 }}>9 luzes, com o prompt de cada</div>
    </div>
    <div style={{ position: "absolute", top: 830, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Quadro fr={40} look="dramatic" p={0.5} uid="cv" size={720} />
      <div style={{ position: "absolute", top: 20, left: 210, fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "8px 18px", borderRadius: 14 }}>com luz</div>
      <div style={{ position: "absolute", top: 20, right: 210, fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "8px 18px", borderRadius: 14 }}>chapada</div>
    </div>
  </AbsoluteFill>
);
