import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 28/11/2026 12:00 — "Ângulos de câmera para a IA parar de gerar imagem sem graça".
// Fatos conferidos nos guias oficiais do Google (cópia em fontes/google-guias-camera.md):
// Vertex AI/Imagen "Prompt and image attribute guide" (Camera Proximity: close-up; Camera Position: aerial, from below;
// prompts "A close-up photo of coffee beans", "aerial photo of urban city with skyscrapers",
// "A photo of a forest canopy with blue skies from below"), Veo prompt guide (top-down shot, POV shot,
// "A POV shot from a vintage car driving in the rain, Canada at night, cinematic.") e Gemini/Nano Banana
// (molde "Shot from a [camera angle] with a [lens type]").
// Tudo é interface recriada em motion (visor de câmera, prompt, diagramas desenhados em CSS/SVG):
// nenhum print, nenhuma imagem gerada por IA, nenhum crédito na tela.
export const SANG_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-28-1200-angulos-de-camera-ia";
export const SANG_FPS = 30;
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const SRM_SLUG = SANG_SLUG;
const SRM_FPS = SANG_FPS;
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = SRM_FPS;
const f = (p) => staticFile(`${SRM_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const AMBER = "#fbbf24";
const VIOLET = "#b48cff";
const WIN = "rgba(20,14,40,0.94)";
const LINE = "rgba(190,160,255,0.28)";
const TAIL = 1.0;
let W = {};
const at = (i) => (W[i] ? Math.round(W[i].s * FPS) : 0);
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0, color: PINK }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);
const count = (fr, a, b, v0, v1) => Math.round(interpolate(fr, [a, b], [v0, v1], { ...clamp, easing: ease }));
const In = ({ fr, d, children, dy = 50, dx = 0, style = {}, damping = 13 }) => {
  const p = pop(fr, d, damping);
  if (fr < d) return null;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};

// ---------- base ----------
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

const Janela = ({ title = "", children, w = 900, h = 760, style = {}, glow }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${glow ? PINK : LINE}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(glow ? 0.45 : 0.18)}`, overflow: "hidden", position: "relative", boxSizing: "border-box", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginLeft: 14, whiteSpace: "nowrap" }}>{title}</div>
    </div>
    <div style={{ padding: 28, position: "relative", height: h - 64, boxSizing: "border-box" }}>{children}</div>
  </div>
);

const Big = ({ children, fr, d, top = 220, bg = PINK, rot = 0, size = 150 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", zIndex: 6, transform: `scale(${d <= 0 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : 0.55 + 0.45 * pop(fr, d, 9)})` }}>
    <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: size, color: "#fff", background: bg, padding: "0 42px", borderRadius: 30, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>{children}</span>
  </div>
);

const Pill = ({ children, bg = "rgba(52,211,153,0.16)", c = GREEN, size = 40, style = {} }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, background: bg, border: `2px solid ${c}`, padding: "8px 26px", borderRadius: 40, whiteSpace: "nowrap", ...style }}>{children}</span>
);

const Header = ({ fr, d, n, icon, t, sub }) => (
  <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 5 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 34px 16px 18px", borderRadius: 60, background: WIN, border: `2px solid ${PINKA(0.6)}`, transform: `scale(${0.6 + 0.4 * pop(fr, d, 10)})`, boxShadow: `0 0 50px ${PINKA(0.3)}` }}>
      <div style={{ width: 92, height: 92, borderRadius: 46, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>{n}</div>
      <div style={{ fontSize: 58 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1 }}>{t}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: BODY, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  </div>
);

const Stamp = ({ fr, d, children, c = PINK, rot = -8, size = 90, style = {} }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 8);
  return <div style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, border: `8px solid ${c}`, borderRadius: 24, padding: "4px 30px", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.6), background: "rgba(10,6,24,0.85)", whiteSpace: "nowrap", ...style }}>{children}</div>;
};

const Bar = ({ label, v, c, w = 640, h = 70, right, glow, lw = 220 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ width: lw, fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", textAlign: "right" }}>{label}</div>
    <div style={{ width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(190,160,255,0.25)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, v)) * 100}%`, borderRadius: h / 2, background: c, boxShadow: glow ? `0 0 40px ${c}` : "none" }} />
      {right && <div style={{ position: "absolute", right: 22, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#fff" }}>{right}</div>}
    </div>
  </div>
);

const Spin = ({ fr, c = AMBER, s = 34 }) => (
  <div style={{ width: s, height: s, borderRadius: s, border: `5px solid rgba(255,255,255,0.15)`, borderTopColor: c, transform: `rotate(${fr * 18}deg)`, boxSizing: "border-box" }} />
);

const Cursor = ({ x, y, fr, click, c = "#fff", s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 7, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    {click != null && fr >= click && fr < click + 12 && <div style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `5px solid ${PINK}`, transform: `scale(${0.4 + (fr - click) / 8})`, opacity: 1 - (fr - click) / 12 }} />}
    <div style={{ width: 0, height: 0, borderLeft: "22px solid " + c, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", transform: "rotate(-55deg) translate(-6px,-4px)", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.7))" }} />
  </div>
);
const Bloco = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translate(${(1 - pin) * 160 - pout * 160}px, 200px) scale(1.04)`, transformOrigin: "50% 250px" }}>{children}</AbsoluteFill>;
};
const Reacao = ({ fr, a, b, pose, top = 1150, left }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  const x = 10 - (1 - pin) * 420 - pout * 420;
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 300, ...(left ? { left: x } : { right: x }), top, zIndex: 8 }} />;
};
export const calculateAngulosMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};
const Term = ({ title = "terminal", cmd, fr, a, b, w = 940, h = 230, glow, out = [] }) => (
  <Janela title={title} w={w} h={h} glow={glow}>
    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: "#fff", lineHeight: 1.35, wordBreak: "break-all" }}>
      <span style={{ color: GREEN }}>$ </span>{fr < a ? "" : typed(cmd, fr, a, b)}{fr < b + 4 && blink(fr)}
    </div>
    {out.map(([t, d, c = GREY]) => fr >= d && <div key={t} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: c, marginTop: 8, opacity: lin(fr, d, d + 4) }}>{t}</div>)}
  </Janela>
);
const Slash = ({ fr, d, size = 300 }) => (
  <svg width={size} height={size} style={{ position: "absolute", left: 0, top: 0 }}>
    <line x1={size * 0.1} y1={size * 0.1} x2={size * 0.1 + size * 0.8 * ease(lin(fr, d, d + 6))} y2={size * 0.1 + size * 0.8 * ease(lin(fr, d, d + 6))} stroke={RED} strokeWidth={26} strokeLinecap="round" />
  </svg>
);
const Prog = ({ v, w = 880, c = PINK }) => (
  <div style={{ width: w, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.07)", overflow: "hidden", position: "relative" }}>
    <div style={{ height: "100%", width: `${v * 100}%`, background: `linear-gradient(90deg,#8a2a86,${c})`, borderRadius: 22 }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#fff" }}>{Math.round(v * 100)}%</div>
  </div>
);


// ---------- peças deste reel ----------
const CYAN = "#5ee7ff";
const GOLD = "#ffd166";
const SKY = "#4fa8ff";
const Palco = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};
const Flash = ({ fr, d, c = PINKA(0.55), len = 7 }) => (fr >= d && fr < d + len ? <AbsoluteFill style={{ background: c, opacity: 1 - (fr - d) / len, zIndex: 20 }} /> : null);
const Centro = ({ top, children, gap = 30, style = {} }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap, ...style }}>{children}</div>
);

// caixa de prompt: digita o texto e acende a palavra-chave em rosa
const Prompt = ({ fr, a, b, txt, k, w = 960, h = 170, glow, title = "prompt" }) => {
  const shown = fr < a ? "" : typed(txt, fr, a, b);
  const i = k ? txt.indexOf(k) : -1;
  const done = fr >= b;
  let body = shown;
  if (i >= 0 && shown.length > i) {
    const pre = shown.slice(0, i), mid = shown.slice(i, Math.min(shown.length, i + k.length)), pos = shown.slice(i + k.length);
    body = <>{pre}<span style={{ color: "#fff", background: done ? PINK : PINKA(0.35), borderRadius: 10, padding: "0 8px" }}>{mid}</span>{pos}</>;
  }
  return (
    <Janela title={title} w={w} h={h} glow={glow || done}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: BODY, lineHeight: 1.4, marginTop: -6 }}>
        <span style={{ color: GREEN }}>› </span>{body}{fr < b + 8 && blink(fr)}
      </div>
    </Janela>
  );
};

// visor de câmera: moldura, REC, mira e leitura no canto
const Visor = ({ fr, w = 940, h = 700, label, read, children, hot, bg = "#120c26" }) => (
  <div style={{ width: w, height: h, borderRadius: 26, position: "relative", overflow: "hidden", background: bg, border: `3px solid ${hot ? PINK : LINE}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 70px ${PINKA(hot ? 0.45 : 0.15)}` }}>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => (
      <div key={`${x}${y}`} style={{ position: "absolute", width: 70, height: 70, [x ? "right" : "left"]: 26, [y ? "bottom" : "top"]: 26, borderColor: "rgba(255,255,255,0.85)", borderStyle: "solid", borderWidth: `${y ? 0 : 5}px ${x ? 5 : 0}px ${y ? 5 : 0}px ${x ? 0 : 5}px` }} />
    ))}
    <div style={{ position: "absolute", left: "50%", top: "50%", width: 60, height: 60, marginLeft: -30, marginTop: -30, border: "3px solid rgba(255,255,255,0.35)", borderRadius: 30 }} />
    <div style={{ position: "absolute", top: 40, left: 110, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontWeight: 800, fontSize: 28, color: "#fff", textShadow: "0 2px 8px #000" }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: RED, opacity: fr % 30 < 18 ? 1 : 0.2 }} />REC {label && <span style={{ color: GOLD, marginLeft: 10 }}>{label}</span>}
    </div>
    {read && <div style={{ position: "absolute", bottom: 38, right: 110, fontFamily: MONO, fontWeight: 800, fontSize: 32, color: "#fff", background: "rgba(0,0,0,0.55)", padding: "6px 16px", borderRadius: 12 }}>{read}</div>}
  </div>
);

const Chip = ({ children, hot, c = PINK, size = 34, style = {} }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: "#fff", background: hot ? c : WIN, border: `3px solid ${hot ? c : LINE}`, padding: "10px 22px", borderRadius: 18, whiteSpace: "nowrap", boxShadow: hot ? `0 0 40px ${PINKA(0.5)}` : "none", ...style }}>{children}</span>
);
const Etiqueta = ({ fr, d, x, y, children, c = GOLD }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 10);
  return <div style={{ position: "absolute", left: x, top: y, transform: `scale(${p})`, transformOrigin: "0 100%", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#0b0618", background: c, padding: "6px 20px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>{children}</div>;
};

// ---------- desenhos dentro do visor (CSS/SVG, nada gerado por IA) ----------
const GRAOS = Array.from({ length: 22 }, (_, k) => ({ x: (k * 173) % 900 + 20, y: (k * 241) % 660 + 20, r: (k * 47) % 180, s: 0.8 + ((k * 13) % 5) / 10 }));
const Grao = ({ x, y, r, s, hot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 110 * s, height: 76 * s, borderRadius: "50%", transform: `rotate(${r}deg)`,
    background: "radial-gradient(ellipse at 35% 30%, #a0673b 0%, #5c3317 55%, #2e170a 100%)", boxShadow: hot ? `0 0 0 6px ${GOLD}, 0 0 40px ${GOLD}` : "0 8px 14px rgba(0,0,0,0.6)" }}>
    <div style={{ position: "absolute", left: "8%", right: "8%", top: "46%", height: 6, borderRadius: 6, background: "#1c0d05", transform: "rotate(-8deg)" }} />
  </div>
);
const Cafe = ({ fr, z, hotGrao }) => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, #3a2416 0%, #1a0f08 100%)" }}>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${z}) translate(${Math.sin(fr / 30) * 6}px, ${Math.cos(fr / 34) * 5}px)`, transformOrigin: "470px 350px" }}>
      {GRAOS.map((g, k) => <Grao key={k} {...g} hot={hotGrao && k === 9} />)}
    </div>
  </div>
);
const PREDIOS = Array.from({ length: 64 }, (_, k) => ({ c: k % 7 === 0 ? PINKA(0.85) : k % 5 === 0 ? "#3a7bd5" : `hsl(255, 30%, ${22 + ((k * 37) % 30)}%)`, h: 10 + ((k * 53) % 40) }));
const Cidade = ({ fr, rx, sc, ruas }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0d1230, #1a1440)", perspective: 900, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -230, top: -350, width: 1400, height: 1400, transform: `scale(${sc}) rotateX(${rx}deg) rotateZ(${fr * 0.2}deg)`, transformOrigin: "50% 50%",
      display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 26, padding: 26, boxSizing: "border-box", background: ruas ? "#2b2f4a" : "#20223a", borderRadius: 20 }}>
      {PREDIOS.map((p, k) => <div key={k} style={{ background: p.c, borderRadius: 10, boxShadow: `${p.h * 0.4}px ${p.h * 0.6}px 0 rgba(0,0,0,0.45)`, border: "2px solid rgba(255,255,255,0.12)" }} />)}
    </div>
  </div>
);
const Floresta = ({ fr, g, azul, giro }) => {
  const N = 11;
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${azul > 0.5 ? "#9fd6ff" : "#7d8fb0"} 0%, ${azul > 0.5 ? SKY : "#4d5a78"} 30%, #0f2a1c 75%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 470, top: 350, transform: `rotate(${giro}deg) scale(${g})` }}>
        {Array.from({ length: N }, (_, k) => (
          <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transform: `rotate(${(k * 360) / N}deg)` }}>
            <div style={{ position: "absolute", left: -60, top: 120, width: 120, height: 620, clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)", background: "linear-gradient(#3b2a1e, #6b4a32)" }} />
            <div style={{ position: "absolute", left: -110, top: 60, width: 220, height: 170, borderRadius: "50%", background: k % 2 ? "#1f6b3a" : "#2e8a4a", opacity: 0.92 }} />
          </div>
        ))}
      </div>
      {azul > 0.5 && <div style={{ position: "absolute", left: 420 + Math.sin(fr / 20) * 20, top: 310, fontSize: 70, opacity: Math.min(1, azul) }}>☁️</div>}
    </div>
  );
};
const Mesa = ({ fr, rx, hotPrato }) => (
  <div style={{ position: "absolute", inset: 0, background: "#1a1020", perspective: 1000, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -60, top: -120, width: 1060, height: 940, transform: `rotateX(${rx}deg) rotateZ(${Math.sin(fr / 40) * 2}deg)`, transformOrigin: "50% 60%",
      background: "repeating-linear-gradient(90deg, #7a4b2a 0 90px, #6a3f22 90px 96px)", borderRadius: 20 }}>
      <div style={{ position: "absolute", left: 300, top: 260, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, #fff 0 52%, #e6e1f0 53% 100%)", boxShadow: hotPrato ? `0 0 0 10px ${GOLD}, 0 0 60px ${GOLD}` : "0 14px 30px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "absolute", left: 120, top: 110, width: 110, height: 110, borderRadius: "50%", background: "#e85d3c" }} />
        <div style={{ position: "absolute", left: 215, top: 170, width: 100, height: 100, borderRadius: "50%", background: "#5fbf5a" }} />
        <div style={{ position: "absolute", left: 150, top: 230, width: 90, height: 70, borderRadius: "50%", background: "#f2c14e" }} />
      </div>
      <div style={{ position: "absolute", left: 230, top: 270, width: 26, height: 420, borderRadius: 13, background: "#c9c6d6" }} />
      <div style={{ position: "absolute", left: 790, top: 270, width: 26, height: 420, borderRadius: 13, background: "#c9c6d6" }} />
      <div style={{ position: "absolute", left: 800, top: 90, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, #3b1f10 0 55%, #f1eefa 56%)" }} />
    </div>
  </div>
);
const Estrada = ({ fr, vel, chuva, noite }) => {
  const off = (fr * vel) % 1;
  const gotas = Array.from({ length: Math.round(20 + 50 * chuva) }, (_, k) => {
    const x = (k * 137 + fr * 9) % 980 - 20, y = (k * 211 + fr * (38 + (k % 4) * 6)) % 760 - 40;
    return <div key={k} style={{ position: "absolute", left: x, top: y, width: 4, height: 46, background: "rgba(200,220,255,0.55)", transform: "rotate(14deg)", borderRadius: 2 }} />;
  });
  const lim = fr % 60 < 30 ? (fr % 60) / 30 : 1 - ((fr % 60) - 30) / 30;
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${noite ? "#050816" : "#1c2448"}, ${noite ? "#141a38" : "#3a4570"} 45%, #0b0c14 46%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 322, height: 380, clipPath: "polygon(47% 0, 53% 0, 100% 100%, 0 100%)", background: "#22242e" }} />
      {noite && <div style={{ position: "absolute", left: 0, right: 0, top: 322, height: 380, clipPath: "polygon(48% 0, 52% 0, 85% 100%, 15% 100%)", background: "linear-gradient(rgba(255,240,180,0.05), rgba(255,240,180,0.35))" }} />}
      {Array.from({ length: 6 }, (_, k) => {
        const t = ((k + off) / 6), y = 322 + Math.pow(t, 2.2) * 380, hh = 6 + t * 60, ww = 4 + t * 22;
        return <div key={k} style={{ position: "absolute", left: 470 - ww / 2, top: y, width: ww, height: hh, background: "#f5d76e", borderRadius: 4 }} />;
      })}
      {[180, 760].map((x, k) => <div key={k} style={{ position: "absolute", left: x + (k ? -1 : 1) * Math.sin(fr / 6) * 2, top: 250, width: 16, height: 16, borderRadius: 8, background: k ? RED : "#ffe9a8", boxShadow: `0 0 26px ${k ? RED : "#ffe9a8"}` }} />)}
      {gotas}
      <div style={{ position: "absolute", left: 470, top: 700, width: 900, height: 8, background: "#111", transformOrigin: "0 50%", transform: `rotate(${-180 + lim * 150}deg)` }} />
      <div style={{ position: "absolute", left: -100, right: -100, top: 560, height: 400, borderRadius: "50% 50% 0 0", background: "#07060c", borderTop: "4px solid #2a2440" }} />
      <div style={{ position: "absolute", left: 300, top: 520, width: 340, height: 340, borderRadius: "50%", border: "34px solid #1b1828", boxSizing: "border-box", transform: `rotate(${Math.sin(fr / 18) * 8}deg)` }}>
        <div style={{ position: "absolute", left: 120, top: 40, width: 30, height: 230, background: "#1b1828" }} />
      </div>
      <div style={{ position: "absolute", left: 700, top: 610, fontFamily: MONO, fontWeight: 800, fontSize: 34, color: CYAN }}>{Math.round(vel * 140)} km/h</div>
    </div>
  );
};

// ---------- cenas ----------
const Hook = ({ fr }) => {
  const dIA = at(3), dGr = at(6), dFal = at(7), dCam = at(11), dCin = at(12) - 16, dQui = at(20), dVoc = at(22);
  const fase = fr < dFal ? 0 : fr < dCam ? 1 : 2;
  const cor = fase === 2 ? 1 : 0;
  return (
    <AbsoluteFill>
      {fase === 0 && <Big fr={fr} d={0} top={250} size={150}>sem graça?</Big>}
      {fase === 1 && <Big fr={fr} d={dFal} top={250} size={150} bg={RED} rot={-2}>falta algo…</Big>}
      {fase === 2 && <Big fr={fr} d={dCam} top={250} size={150} rot={-2}>📷 a câmera!</Big>}
      {fr < dCin + 6 && (
        <Centro top={500} gap={26} style={{ opacity: 1 - lin(fr, dCin, dCin + 6) }}>
          <div style={{ transform: `translateX(${shake(fr, dGr, 18)}px)` }}>
            <Visor fr={fr} w={900} h={560} label={cor ? "close-up" : "imagem_ia.png"} read={cor ? "📷 ângulo ✓" : "📷 ???"} hot={cor}>
              {cor ? <Cafe fr={fr} z={interpolate(fr, [dCam, dCam + 12], [1, 2.4], { ...clamp, easing: ease })} />
                : <div style={{ position: "absolute", inset: 0, background: "#55536a", filter: "grayscale(1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 240, height: 200, borderRadius: "0 0 60px 60px", background: "#77758a", position: "relative", transform: `translateY(${Math.sin(fr / 10) * 4}px)` }}>
                      <div style={{ position: "absolute", right: -70, top: 40, width: 80, height: 100, border: "22px solid #77758a", borderLeft: 0, borderRadius: "0 50px 50px 0" }} />
                    </div>
                  </div>}
            </Visor>
          </div>
          {fase === 0 && fr >= at(5) && <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 4 }}><Stamp fr={fr} d={at(5)} size={70} rot={-8} c={RED}>😐 GENÉRICA</Stamp></div>}
          <div style={{ display: "flex", gap: 20, height: 80 }}>
            {fr >= dIA && fase === 0 && <In fr={fr} d={dIA}><Pill c={GREY} bg="rgba(140,136,170,0.15)" size={40}>😴 0 curtidas</Pill></In>}
            {fase === 1 && <In fr={fr} d={dFal}><Pill c={RED} bg="rgba(255,92,122,0.15)" size={40}>⚠ prompt sem câmera</Pill></In>}
            {fase === 2 && <In fr={fr} d={dCam}><Pill size={40}>✓ câmera no prompt</Pill></In>}
          </div>
        </Centro>
      )}
      {fr >= dCin && (
        <Centro top={520} gap={50}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, width: 980 }}>
            {["close-up", "aerial", "from below", "top-down", "5º ?"].map((t, n) => {
              const last = n === 4, hot = last && fr >= dQui;
              return (
                <In key={t} fr={fr} d={dCin + n * 3} dy={120}>
                  <div style={{ transform: `translateX(${last ? shake(fr, dQui, 16) : 0}px) scale(${hot ? 1.15 : 1})` }}>
                    <Chip size={54} hot={hot || (!last && fr >= dCin + n * 3 + 6 && fr < dCin + n * 3 + 14) || (!last && fr >= dCin + 20 && fr < dQui && Math.floor((fr - dCin - 20) / 7) % 4 === n)}><span style={{ color: hot ? "#fff" : PINK, marginRight: 12 }}>{n + 1}</span>{last ? (fr >= dVoc ? "🔒 👀" : "🔒 ?") : t}</Chip>
                  </div>
                </In>
              );
            })}
          </div>
          <In fr={fr} d={dCin + 18}><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", textAlign: "center" }}>ângulos pra colar<br />no <span style={{ fontFamily: lora, fontStyle: "italic", background: PINK, padding: "0 18px", borderRadius: 14 }}>prompt</span></div></In>
          {fr >= dCin + 8 && <Stamp fr={fr} d={dCin + 8} size={44} rot={-3} c={GOLD}>👀 o 5º te põe dentro da cena</Stamp>}
        </Centro>
      )}
    </AbsoluteFill>
  );
};

const Guia = ({ fr }) => {
  const d0 = at(26), dOf = at(28), dPr = at(30), dGo = at(32), dMa = at(33), dCa = at(37), dAn = at(39), dAi = at(40);
  const rows = [["🧍", "assunto", dPr], ["🏙️", "contexto", dGo], ["🎨", "estilo", dMa]];
  return (
    <AbsoluteFill>
      <Centro top={300} gap={36}>
        <In fr={fr} d={d0}>
          <Janela title="guia de prompt · Google" w={940} h={640} glow={fr >= dCa}>
            <div style={{ position: "absolute", right: 30, top: 24 }}>{fr >= dOf && <Stamp fr={fr} d={dOf} size={40} rot={6} c={CYAN}>OFICIAL</Stamp>}</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", marginBottom: 30 }}>um bom prompt tem:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {rows.map(([ic, t, d]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, opacity: fr >= d ? 1 : 0.25, transform: `translateX(${fr >= d ? 0 : -20}px)` }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, border: `4px solid ${fr >= d ? GREEN : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREEN }}>{fr >= d ? "✓" : ""}</div>
                  <span style={{ fontSize: 46 }}>{ic}</span>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{t}</span>
                </div>
              ))}
              {fr >= dCa - 4 && (
                <In fr={fr} d={dCa - 4} dx={-200} dy={0}>
                  <div style={{ display: "flex", alignItems: "center", gap: 22, background: PINKA(0.22), border: `3px solid ${PINK}`, borderRadius: 20, padding: "10px 16px", transform: `translateX(${shake(fr, dCa, 12)}px)` }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>+</div>
                    <span style={{ fontSize: 50 }}>📷</span>
                    <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 58, color: "#fff" }}>onde a câmera está</span>
                  </div>
                </In>
              )}
            </div>
          </Janela>
        </In>
        {fr >= dAn && (
          <In fr={fr} d={dAn}>
            <Janela title="notas.txt" w={940} h={230}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff" }}>✏️ {typed("5 ângulos de câmera:", fr, dAn, dAi + 6)}{blink(fr)}</div>
              <div style={{ display: "flex", gap: 14, marginTop: 20 }}>{[1, 2, 3, 4, 5].map((n) => <Chip key={n} size={34} hot={fr >= dAi + n * 2}>{n}</Chip>)}</div>
            </Janela>
          </In>
        )}
      </Centro>
    </AbsoluteFill>
  );
};

// molde comum dos itens: chip no topo + prompt + visor
const Item = ({ fr, d0, n, icon, t, sub, prompt, k, pa, pb, visor, extra }) => (
  <AbsoluteFill>
    <Header fr={fr} d={d0} n={n} icon={icon} t={t} sub={sub} />
    <Centro top={420} gap={26}>
      <In fr={fr} d={pa - 4}><Prompt fr={fr} a={pa} b={pb} txt={prompt} k={k} /></In>
      <In fr={fr} d={d0 + 3} dy={80}>{visor}</In>
    </Centro>
    {extra}
  </AbsoluteFill>
);

const Item1 = ({ fr }) => {
  const d0 = at(41), dCl = at(43), dCa = at(45), dPe = at(47), dTx = at(50), dDe = at(51), dGr = at(53), dCf = at(55);
  const z = interpolate(fr, [d0, dCa, dPe + 8, dGr, dGr + 20], [1, 1.1, 2.4, 2.6, 3.4], { ...clamp, easing: ease });
  return (
    <Item fr={fr} d0={d0} n={1} icon="🔍" t="Close-up" sub="a câmera chega perto" prompt="A close-up photo of coffee beans" k="close-up" pa={dCl} pb={dCl + 22}
      visor={
        <div style={{ position: "relative" }}>
          <Visor fr={fr} w={940} h={680} label="close-up" read={`zoom ${z.toFixed(1)}x`} hot={fr >= dPe}>
            <Cafe fr={fr} z={z} hotGrao={fr >= dGr} />
          </Visor>
          <Etiqueta fr={fr} d={dTx} x={80} y={140}>✦ textura</Etiqueta>
          <Etiqueta fr={fr} d={dDe} x={560} y={500} c={CYAN}>✦ detalhe</Etiqueta>
          <Etiqueta fr={fr} d={dGr} x={340} y={240} c={PINK}>1 grão ☕</Etiqueta>
          {fr >= dCf && <div style={{ position: "absolute", right: 40, top: 110 }}><Stamp fr={fr} d={dCf} size={50} rot={8} c={GREEN}>NÍTIDO</Stamp></div>}
        </div>
      } />
  );
};

const Item2 = ({ fr }) => {
  const d0 = at(56), dAe = at(58), dFo = at(60), dCi = at(64), dCid = at(66), dMa = at(70);
  const rx = interpolate(fr, [d0, dFo, dCi + 10], [72, 70, 0], { ...clamp, easing: ease });
  const sc = interpolate(fr, [d0, dFo, dCi + 10, dMa + 20], [1.6, 1.55, 0.78, 0.7], { ...clamp, easing: ease });
  const alt = count(fr, dFo, dCi + 10, 2, 500);
  return (
    <Item fr={fr} d0={d0} n={2} icon="🚁" t="Aerial photo" sub="foto aérea, lá de cima" prompt="aerial photo of urban city with skyscrapers" k="aerial photo" pa={dAe - 4} pb={dAe + 22}
      visor={
        <div style={{ position: "relative" }}>
          <Visor fr={fr} w={940} h={680} label="aerial" read={`altitude ${alt} m`} hot={fr >= dCi}>
            <Cidade fr={fr} rx={rx} sc={sc} ruas={fr >= dCid} />
          </Visor>
          {[[200, 180], [610, 300], [380, 470]].map(([x, y], q) => fr >= dMa - 8 + q * 3 && (
            <div key={q} style={{ position: "absolute", left: x, top: y - (1 - pop(fr, dMa - 8 + q * 3, 9)) * 120, fontSize: 70 }}>📍</div>
          ))}
          {fr >= dMa && <div style={{ position: "absolute", right: 40, top: 110 }}><Stamp fr={fr} d={dMa} size={60} rot={-7} c={GOLD}>VIROU MAPA</Stamp></div>}
        </div>
      } />
  );
};

const Item3 = ({ fr }) => {
  const d0 = at(71), dFr = at(73), dCa = at(75), dCh = at(77), dOl = at(78), dCi = at(80), dFl = at(82), dGi = at(84), dCe = at(87), dAz = at(88);
  const ang = count(fr, dOl, dCi + 10, 0, 90);
  const g = interpolate(fr, [d0, dFl, dGi + 10], [0.55, 0.7, 1.3], { ...clamp, easing: ease });
  const camY = interpolate(fr, [dCa, dCh + 6], [0, 150], { ...clamp, easing: ease });
  return (
    <Item fr={fr} d0={d0} n={3} icon="⬆️" t="From below" sub="câmera no chão" prompt="A photo of a forest canopy with blue skies from below" k="from below" pa={dFr - 8} pb={dFr + 20}
      visor={
        <div style={{ position: "relative" }}>
          <Visor fr={fr} w={940} h={680} label="from below" read={`olhando ↑ ${ang}°`} hot={fr >= dGi}>
            <Floresta fr={fr} g={g} azul={fr >= dCe ? lin(fr, dCe, dAz + 6) * 1.5 : 0} giro={fr * 0.25} />
            <div style={{ position: "absolute", right: 30, top: 100, width: 220, height: 250, borderRadius: 18, background: "rgba(10,6,24,0.85)", border: `2px solid ${LINE}` }}>
              <div style={{ position: "absolute", left: 120, top: 30, width: 18, height: 180, background: "#6b4a32" }} />
              <div style={{ position: "absolute", left: 85, top: 12, width: 90, height: 70, borderRadius: "50%", background: "#2e8a4a" }} />
              <div style={{ position: "absolute", left: 10, right: 10, top: 212, height: 4, background: GREY }} />
              <div style={{ position: "absolute", left: 30, top: 40 + camY, fontSize: 40, transform: `rotate(${-ang}deg)` }}>📷</div>
            </div>
          </Visor>
          {fr >= dGi && <div style={{ position: "absolute", left: 60, top: 520 }}><Stamp fr={fr} d={dGi} size={60} rot={-6} c={GREEN}>GIGANTE</Stamp></div>}
        </div>
      } />
  );
};

const Item4 = ({ fr }) => {
  const d0 = at(91), dTo = at(93), dRe = at(95), dBa = at(99), dFo = at(102), dPr = at(104), dMe = at(106);
  const rx = interpolate(fr, [d0, dRe, dBa + 8], [64, 60, 0], { ...clamp, easing: ease });
  return (
    <Item fr={fr} d0={d0} n={4} icon="⬇️" t="Top-down shot" sub="reto, de cima pra baixo" prompt="top-down shot of a plate on a wooden table" k="top-down shot" pa={dTo - 4} pb={dTo + 22}
      visor={
        <div style={{ position: "relative" }}>
          <Visor fr={fr} w={940} h={680} label="top-down" read={`câmera ${Math.round(90 - rx * 1.0)}° ↓`} hot={fr >= dBa}>
            <Mesa fr={fr} rx={rx} hotPrato={fr >= dPr} />
            <Flash fr={fr} d={dFo} c="rgba(255,255,255,0.9)" len={8} />
          </Visor>
          {fr >= dFo && <Etiqueta fr={fr} d={dFo} x={70} y={130} c={CYAN}>📸 clique</Etiqueta>}
          {fr >= dMe && <div style={{ position: "absolute", right: 40, top: 110 }}><Stamp fr={fr} d={dMe} size={56} rot={7} c={GOLD}>90° CRAVADO</Stamp></div>}
        </div>
      } />
  );
};

const Item5 = ({ fr }) => {
  const d0 = at(107), dP = at(109), dVo = at(113), dOl = at(116), dCe = at(121), dDi = at(123), dCh = at(125), dNo = at(127);
  const vel = interpolate(fr, [d0, dDi, dDi + 20], [0.25, 0.3, 0.6], { ...clamp, easing: ease });
  return (
    <Item fr={fr} d0={d0} n={5} icon="👀" t="POV shot" sub="pelos olhos de quem está na cena" prompt="A POV shot from a vintage car driving in the rain, Canada at night, cinematic." k="POV shot" pa={dP - 4} pb={dP + 34}
      visor={
        <div style={{ position: "relative" }}>
          <Visor fr={fr} w={940} h={680} label="POV" read={fr >= dVo ? "1ª pessoa" : "POV"} hot={fr >= dCe}>
            <Estrada fr={fr} vel={vel} chuva={fr >= dCh ? 1 : 0.2} noite={fr >= dNo} />
          </Visor>
          {fr >= dOl && <Etiqueta fr={fr} d={dOl} x={70} y={140} c={PINK}>👀 você está aqui</Etiqueta>}
          {fr >= dCh && <Etiqueta fr={fr} d={dCh} x={600} y={140} c={CYAN}>🌧️ chuva</Etiqueta>}
          {fr >= dNo && <Etiqueta fr={fr} d={dNo} x={620} y={230} c={GOLD}>🌙 à noite</Etiqueta>}
        </div>
      } />
  );
};

const Cta = ({ fr }) => {
  const d0 = at(128), dGo = at(133), dMo = at(136), dSh = at(137), dAn = at(140), dWi = at(141), dLe = at(143), dCom = at(144), dCam = at(145), dSeg = at(148);
  const angs = ["close-up", "aerial", "from below", "top-down", "POV"];
  const ang = fr < dAn ? "[ângulo]" : fr < dAn + 20 ? angs[Math.floor((fr - dAn) / 4) % 5] : "a low angle";
  const lente = fr < dLe ? "[lente]" : "a 35mm lens";
  const slot = (txt, on) => <span style={{ color: "#fff", background: on ? PINK : "rgba(255,255,255,0.08)", border: `3px dashed ${on ? PINK : LINE}`, borderRadius: 14, padding: "0 12px" }}>{txt}</span>;
  return (
    <AbsoluteFill>
      <Centro top={290} gap={34}>
        <In fr={fr} d={d0}>
          <Janela title={fr >= dGo ? "molde · guia do Google" : "molde"} w={960} h={520} glow={fr >= dLe}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: BODY, lineHeight: 1.75 }}>
              <div>A photo of {slot(fr >= at(130) ? "coffee beans" : "[assunto]", fr >= at(130))},</div>
              <div style={{ opacity: fr >= dSh - 4 ? 1 : 0.3, transform: `scale(${fr >= dSh && fr < dSh + 10 ? 1.05 : 1})`, transformOrigin: "0 50%" }}><span style={{ color: fr >= dSh ? GOLD : BODY }}>shot from</span> {slot(ang, fr >= dAn)}</div>
              <div style={{ opacity: fr >= dWi - 4 ? 1 : 0.3 }}><span style={{ color: fr >= dWi ? GOLD : BODY }}>with</span> {slot(lente, fr >= dLe)}.</div>
            </div>
            {fr >= dMo && fr < dSh && <div style={{ position: "absolute", right: 30, bottom: 30 }}><Pill size={36} c={CYAN} bg="rgba(94,231,255,0.12)">📐 molde</Pill></div>}
            {fr >= dLe + 6 && <div style={{ position: "absolute", right: 30, bottom: 30 }}><Stamp fr={fr} d={dLe + 6} size={46} rot={-5} c={GREEN}>PRONTO ✓</Stamp></div>}
          </Janela>
        </In>
        {fr >= dCom - 2 && (
          <In fr={fr} d={dCom - 2}>
            <Janela title="comentários" w={960} h={200} glow={fr >= dCam}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 80, height: 80, borderRadius: 40, background: "#5b4a8a" }} />
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{fr >= dCam - 2 ? typed("CÂMERA", fr, dCam - 2, dCam + 8) : ""}{fr < dCam + 12 && blink(fr)}</div>
                {fr >= dCam + 10 && <span style={{ marginLeft: "auto", fontSize: 64, transform: `scale(${pop(fr, dCam + 10, 9)})` }}>❤️</span>}
              </div>
            </Janela>
          </In>
        )}
        {fr >= dSeg + 4 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, width: 980 }}>
            {angs.map((t, n) => <In key={t} fr={fr} d={dSeg + 4 + n * 2} dy={60}><Chip size={38} hot={Math.floor((fr - dSeg - 14) / 6) % 5 === n}>{t}</Chip></In>)}
          </div>
        )}
        {fr >= dCom && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg ? pop(fr, dSeg, 9) : 1 + 0.05 * Math.sin(fr / 4)})` }}>{fr >= dSeg ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>}
      </Centro>
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["graca", "camera", "5 angulos", "prompt", "5º", "dentro", "cena", "guia", "oficial", "google", "anota", "nº 1", "nº 2", "nº 3", "nº 4", "nº 5", "close-up", "perto", "textura", "detalhe", "grao", "cafe", "aerial photo", "aerea", "cidade", "mapa", "from below", "chao", "gigante", "azul", "top-down shot", "reto", "prato", "pov shot", "olhos", "chuva", "noite", "molde", "shot from", "angulo", "with", "lente", "comenta", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/ºª%$ -]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) && !/\.\.\.$/.test(w.w) ? w.w.slice(-1) : /\.\.\.$/.test(w.w) ? "..." : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "cinco" && nn(k + 1) === "angulos") { push("5 ângulos", k + 1); continue; }
    if (n === "quinto") { push("5º", k); continue; }
    if (n === "aerial" && nn(k + 1) === "photo") { push("aerial photo", k + 1); continue; }
    if (n === "from" && nn(k + 1) === "below") { push("from below", k + 1); continue; }
    if (n === "top-down" && nn(k + 1) === "shot") { push("top-down shot", k + 1); continue; }
    if (n === "p" && nn(k + 1) === "o" && nn(k + 2) === "v") { push("POV shot", k + 3); continue; }
    if (n === "shot" && nn(k + 1) === "from") { push("shot from", k + 1); continue; }
    toks.push({ t: x.w, s: x.s, e: x.e });
  }
  const chunks = []; let cur = [];
  toks.forEach((tk) => {
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
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[,!?:;…"]+$/g, "").replace(/^"/, "").replace(/\.$/, "");
        const key = w.key === undefined ? KEY.has(norm(shown).replace(/\./g, "")) : w.key;
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortAngulosCamera = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(26), at(41), at(56), at(71), at(91), at(107), at(128), end];
  const scenes = [Hook, Guia, Item1, Item2, Item3, Item4, Item5, Cta];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Palco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Palco>)}
      <Flash fr={fr} d={at(7)} />
      <Flash fr={fr} d={at(11)} c="rgba(255,255,255,0.6)" />
      <Flash fr={fr} d={at(12) - 16} />
      <Reacao fr={fr} a={0} b={at(6)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(108)} b={at(114)} pose="apontando" top={1300} left />
      <Reacao fr={fr} a={at(145)} b={end} pose="comemorando" top={1290} />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(6), "error", 0.3, 15)}
      {S(at(7), "whoosh", 0.8, 30)}
      {S(at(11), "whoosh", 1, 30)}
      {S(at(11) + 2, "ding", 0.5)}
      {[0, 3, 6, 9, 12].map((o) => S(at(12) - 16 + o, "pop", 0.25, 15))}
      {S(at(12) - 8, "coin", 0.35, 15)}
      {S(at(20), "riser", 0.25, 30)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.35))}
      {S(at(28), "pop", 0.4, 15)}
      {[30, 32, 33].map((i) => S(at(i), "pop", 0.3, 15))}
      {S(at(37) - 4, "ding", 0.45)}
      {S(at(39), "pop", 0.3, 15)}
      {S(at(47), "ding", 0.35)}
      {[50, 51, 53].map((i) => S(at(i), "pop", 0.35, 15))}
      {S(at(55), "ding", 0.4)}
      {S(at(60), "riser", 0.25, 30)}
      {[67, 68, 69].map((i) => S(at(i), "pop", 0.3, 15))}
      {S(at(70), "ding", 0.45)}
      {S(at(75), "whoosh", 0.4, 20)}
      {S(at(84), "coin", 0.4, 15)}
      {S(at(87), "pop", 0.3, 15)}
      {S(at(95), "whoosh", 0.4, 20)}
      {S(at(102), "pop", 0.5, 15)}
      {S(at(104), "ding", 0.35)}
      {S(at(106), "pop", 0.4, 15)}
      {S(at(116), "pop", 0.35, 15)}
      {S(at(125), "pop", 0.3, 15)}
      {S(at(127), "pop", 0.3, 15)}
      {S(at(137), "pop", 0.35, 15)}
      {[0, 4, 8, 12, 16].map((o) => S(at(140) + o, "pop", 0.2, 10))}
      {S(at(143), "ding", 0.45)}
      {S(at(145), "pop", 0.4, 15)}
      {S(at(148), "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaAngulosCamera = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 108, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>Imagem de IA</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 140, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 18 }}>sem graça?</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 76, color: "#fff", marginTop: 26 }}>📷 Falta a câmera</div>
    </div>
    <div style={{ position: "absolute", top: 860, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Visor fr={10} w={900} h={470} label="close-up" read="zoom 2.4x" hot>
        <Cafe fr={0} z={2.2} />
      </Visor>
    </div>
    <div style={{ position: "absolute", top: 1380, left: 40, right: 40, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
      {["close-up", "aerial", "from below", "top-down", "POV"].map((t, n) => <Chip key={t} size={40} hot={n === 4}><span style={{ marginRight: 10, color: n === 4 ? "#fff" : PINK }}>{n + 1}</span>{t}</Chip>)}
    </div>
    <div style={{ position: "absolute", top: 1530, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>5 ângulos pra colar no prompt</div>
  </AbsoluteFill>
);
