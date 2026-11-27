import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 27/11/2026 12:00 — "O Claude faz uma animação 3D com um prompt".
// Fatos conferidos nas fontes primárias (cópias em fontes/):
// - three.js: "JavaScript 3D library", licença MIT, ~119,5 mil estrelas no GitHub (api.github.com, 27/11/2026);
//   o exemplo do README monta cena, câmera, objeto, renderer WebGL e o loop animate() que gira o objeto;
// - Claude Code docs (artifacts): a página pode carregar scripts de CDNs públicos (cdnjs, unpkg, jsDelivr);
//   exemplo oficial de pedir sliders para ajustar uma animação ao vivo;
// - Central de ajuda (artifacts): template Motion (beta) em Team e Enterprise exporta a animação em MP4.
// Tudo é interface recriada em motion: nenhum print, nada gerado por IA, nenhum logo oficial, nenhum crédito na tela.
export const S3D_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-27-1200-claude-animacao-3d-1-prompt";
export const S3D_FPS = 30;
const MUSIC = "phanterai/music/Coding_at_Night.mp3";
const SRM_SLUG = S3D_SLUG;
const SRM_FPS = S3D_FPS;
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
export const calculate3DMetadata = async () => {
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

// ---------- peças ----------
const CYAN = "#5ee7ff";
const GOLD = "#ffd166";
// linha de ranking: posição animada (pos pode ser fracionária para "subir" na lista)
const RankRow = ({ pos, label, sub, v, c = "rgba(190,170,255,0.45)", hot, right, fr, w = 900, h = 96, top0 = 0, gap = 112 }) => (
  <div style={{ position: "absolute", left: 0, top: top0 + (pos - 1) * gap, width: w, height: h, display: "flex", alignItems: "center", gap: 18, transform: `scale(${hot ? 1.04 : 1})`, transformOrigin: "50% 50%" }}>
    <div style={{ width: 84, height: 84, borderRadius: 42, background: hot ? PINK : "rgba(255,255,255,0.08)", border: `3px solid ${hot ? PINK : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", flexShrink: 0 }}>#{Math.round(pos)}</div>
    <div style={{ flex: 1, height: h, borderRadius: 24, background: hot ? PINKA(0.18) : WIN, border: `3px solid ${hot ? PINK : LINE}`, position: "relative", overflow: "hidden", boxShadow: hot ? `0 0 50px ${PINKA(0.5)}` : "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, v)) * 100}%`, background: hot ? `linear-gradient(90deg,#8a2a86,${PINK})` : c, opacity: hot ? 0.75 : 0.35 }} />
      {hot && <div style={{ position: "absolute", top: 0, bottom: 0, width: 160, left: ((fr * 14) % 1500) - 300, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", transform: "skewX(-20deg)" }} />}
      <div style={{ position: "absolute", left: 24, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap" }}>{label}</span>
        {sub && <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: BODY, whiteSpace: "nowrap" }}>{sub}</span>}
      </div>
      {right && <div style={{ position: "absolute", right: 24, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 800, fontSize: 42, color: "#fff" }}>{right}</div>}
    </div>
  </div>
);
const Tag = ({ fr, d, price, label, c = PINK }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 8);
  const sw = Math.sin((fr - d) / 6) * 10 * Math.exp(-(fr - d) / 50) + Math.sin(fr / 14) * 2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${(1 - p) * -300}px)` }}>
      <div style={{ width: 4, height: 70, background: "rgba(255,255,255,0.5)" }} />
      <div style={{ transformOrigin: "50% -70px", transform: `rotate(${sw}deg)` }}>
        <div style={{ width: 360, height: 300, borderRadius: "30px 30px 40px 40px", background: c, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", top: 22, width: 30, height: 30, borderRadius: 15, background: "#0b0618" }} />
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 120, color: "#fff", lineHeight: 1, marginTop: 30 }}>{price}</div>
          <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 40, color: "#fff", marginTop: 8 }}>{label}</div>
        </div>
      </div>
    </div>
  );
};
const Confete = ({ fr, d, n = 18 }) => fr >= d && fr < d + 45 && (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, k) => {
      const t = (fr - d) / 45, ang = (k / n) * Math.PI * 2;
      return <div key={k} style={{ position: "absolute", left: 540 + Math.cos(ang) * 520 * ease(t) - 9, top: 560 + Math.sin(ang) * 420 * ease(t) + 300 * t * t, width: 18, height: 28, borderRadius: 4, background: [PINK, GOLD, CYAN, GREEN][k % 4], transform: `rotate(${fr * 12 + k * 40}deg)`, opacity: 1 - t }} />;
    })}
  </AbsoluteFill>
);

// ---------- peças deste reel ----------
// Cena 3D desenhada em código (CSS 3D + gradientes): planeta, anel, cubo e estrelas.
const Estrelas = ({ fr, n = 40, w, h, on = 1 }) => Array.from({ length: n }, (_, k) => {
  const x = (k * 263) % w, y = (k * 151) % h, s = 3 + (k % 3) * 2;
  const tw = 0.35 + 0.65 * Math.abs(Math.sin(fr / 9 + k));
  return <div key={k} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: k % 5 ? "#fff" : GOLD, opacity: tw * on, transform: `scale(${on})` }} />;
});
const Planeta = ({ fr, size = 300, roxo = 1, spin = 1, luz = 1, hue = 0, speed = 1 }) => {
  const off = fr * 3 * spin * speed;
  const base = `hsl(${270 + hue}, ${30 + 40 * roxo}%, ${30 + 10 * roxo}%)`;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: -size * 0.25, borderRadius: "50%", background: `radial-gradient(circle, hsla(${310 + hue},75%,58%,${0.55 * luz}) 0%, transparent 62%)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: base,
        boxShadow: `inset -${size * 0.16}px -${size * 0.1}px ${size * 0.22}px rgba(0,0,0,0.75), inset ${size * 0.06}px ${size * 0.06}px ${size * 0.12}px hsla(${310 + hue},80%,70%,${0.9 * luz}), 0 0 ${size * 0.25 * luz}px hsla(${310 + hue},80%,60%,${0.7 * luz})` }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.55, backgroundImage: `repeating-linear-gradient(8deg, transparent 0 ${size * 0.08}px, hsla(${290 + hue},60%,70%,0.35) ${size * 0.08}px ${size * 0.13}px, transparent ${size * 0.13}px ${size * 0.2}px)`, backgroundSize: `${size * 2}px ${size}px`, backgroundPosition: `${off}px 0px` }} />
        <div style={{ position: "absolute", width: size * 0.22, height: size * 0.14, borderRadius: "50%", background: `hsla(${300 + hue},50%,22%,0.7)`, top: size * 0.55, left: ((size * 0.1 + off * 0.9) % (size * 1.6)) - size * 0.3 }} />
      </div>
      <div style={{ position: "absolute", left: -size * 0.35, top: size * 0.42, width: size * 1.7, height: size * 0.22, borderRadius: "50%", border: `${Math.max(4, size * 0.035)}px solid hsla(${320 + hue},80%,68%,0.85)`, transform: `rotate(-14deg)`, clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }} />
    </div>
  );
};
const Cubo = ({ fr, s = 160, speed = 1, hue = 0, rot }) => {
  const r = rot != null ? rot : fr * 2.2 * speed;
  const face = (tf, l) => <div style={{ position: "absolute", width: s, height: s, transform: `${tf} translateZ(${s / 2}px)`, background: `hsla(${300 + hue},70%,${l}%,0.92)`, border: `3px solid hsla(${310 + hue},90%,80%,0.9)`, boxSizing: "border-box" }} />;
  return (
    <div style={{ width: s, height: s, perspective: 900 }}>
      <div style={{ position: "relative", width: s, height: s, transformStyle: "preserve-3d", transform: `rotateX(${-20 + r * 0.6}deg) rotateY(${r}deg)` }}>
        {face("rotateY(0deg)", 55)}{face("rotateY(90deg)", 42)}{face("rotateY(180deg)", 35)}{face("rotateY(-90deg)", 48)}{face("rotateX(90deg)", 65)}{face("rotateX(-90deg)", 28)}
      </div>
    </div>
  );
};
const Cena3D = ({ fr, w = 900, h = 560, planeta = true, cubo = true, roxo = 1, spin = 1, luz = 1, estrelas = 1, hue = 0, speed = 1, size = 260 }) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 18, background: "radial-gradient(ellipse at 50% 60%, #1a0d36 0%, #07040f 75%)" }}>
    <Estrelas fr={fr} w={w} h={h} on={estrelas} />
    {planeta && <div style={{ position: "absolute", left: w / 2 - size / 2 - (cubo ? w * 0.12 : 0), top: h / 2 - size / 2 }}><Planeta fr={fr} size={size} roxo={roxo} spin={spin} luz={luz} hue={hue} speed={speed} /></div>}
    {cubo && <div style={{ position: "absolute", right: w * 0.1, top: h * 0.14 + Math.sin(fr / 10) * 14 }}><Cubo fr={fr} s={size * 0.42} speed={speed * spin} hue={hue} /></div>}
  </div>
);
const Navegador = ({ url = "cena-3d.html", w = 960, h = 700, glow, children }) => (
  <Janela title={url} w={w} h={h} glow={glow}>
    <div style={{ position: "absolute", left: 14, right: 14, top: 14, bottom: 14 }}>{children}</div>
  </Janela>
);
const Chat = ({ fr, a, b, txt, w = 960, h = 300, glow, enviado }) => (
  <Janela title="Claude · nova conversa" w={w} h={h} glow={glow}>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY, marginBottom: 12 }}>Você</div>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", lineHeight: 1.25 }}>{fr < a ? "" : typed(txt, fr, a, b)}{fr < b + 6 && blink(fr)}</div>
    {enviado != null && fr >= enviado && <div style={{ position: "absolute", right: 26, bottom: 22 }}><Pill size={34} c={PINK} bg={PINKA(0.15)}>enviado ↑</Pill></div>}
  </Janela>
);
const Codigo = ({ fr, linhas, w = 960, h = 520, title = "cena-3d.html", glow }) => (
  <Janela title={title} w={w} h={h} glow={glow}>
    {linhas.map(([t, d, c = "#fff", ok], k) => fr >= d && (
      <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 800, fontSize: 34, color: c, lineHeight: 1.55, whiteSpace: "nowrap" }}>
        <span style={{ color: GREY, width: 40 }}>{k + 1}</span>
        <span>{typed(t, fr, d, d + Math.max(6, t.length * 0.5))}</span>
        {ok != null && fr >= ok && <span style={{ marginLeft: "auto", width: 46, height: 46, borderRadius: 23, background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, transform: `scale(${pop(fr, ok, 9)})` }}>✓</span>}
      </div>
    ))}
  </Janela>
);
const Slider = ({ label, v, c = PINK, w = 860, right }) => (
  <div style={{ width: w }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", marginBottom: 14 }}><span>{label}</span><span style={{ fontFamily: MONO, color: c }}>{right}</span></div>
    <div style={{ position: "relative", height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v * 100}%`, borderRadius: 11, background: c }} />
      <div style={{ position: "absolute", left: `calc(${v * 100}% - 26px)`, top: -15, width: 52, height: 52, borderRadius: 26, background: "#fff", boxShadow: `0 0 24px ${c}` }} />
    </div>
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dBl = at(1), dZ2 = at(2), dAn = at(3), dSo = at(4), dFr = at(6), dSai = at(7), dCena = at(10), d3d = at(11), dAni = at(13), dSao = at(14), dCin = at(15), dQui = at(19), dVid = at(20);
  let big, bigD, size = 140, bg = PINK, rot = -3;
  if (fr < dZ2) { big = "Zero Blender"; bigD = 0; }
  else if (fr < dSo) { big = "Zero animador"; bigD = dZ2; rot = 2; bg = "#5b4a8a"; }
  else if (fr < dSai) { big = "1 frase!"; bigD = dSo; size = 160; }
  else if (fr < dSao) { big = fr >= d3d ? "cena 3D animada" : "e sai…"; bigD = fr >= d3d ? d3d : dSai; size = 100; rot = 2; }
  else { big = "5 passos"; bigD = dSao; size = 150; }
  const flash = [dBl, dZ2, dSo, dFr, dSai, d3d, dSao, dQui].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.45, 0);
  const zoom0 = interpolate(fr, [0, 8], [1.15, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.45, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dSo && (
        <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${zoom0}) translateX(${shake(fr, dBl, 14) + shake(fr, dAn, 14)}px)` }}>
          <div style={{ position: "relative" }}>
            <Janela title={fr < dZ2 ? "programa 3D · timeline" : "animador · orçamento"} w={960} h={620}>
              {fr < dZ2 ? (
                <div>
                  <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
                    <div style={{ width: 300, height: 260, borderRadius: 18, background: "#120a26", display: "flex", alignItems: "center", justifyContent: "center" }}><Cubo fr={fr} s={120} /></div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                      {["modelar", "texturizar", "iluminar", "animar", "renderizar"].map((t, k) => <div key={t} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: BODY, padding: "6px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>{k + 1}. {t}</div>)}
                    </div>
                  </div>
                  <div style={{ height: 150, borderRadius: 16, background: "rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                    {Array.from({ length: 16 }, (_, k) => <div key={k} style={{ position: "absolute", left: 30 + k * 56, top: 40 + (k % 3) * 30, width: 18, height: 18, background: AMBER, transform: "rotate(45deg)" }} />)}
                    <div style={{ position: "absolute", top: 0, bottom: 0, width: 4, background: PINK, left: 30 + ((fr * 18) % 880) }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, marginTop: 20 }}>
                  <div style={{ fontSize: 150 }}>🧑‍🎨</div>
                  <div style={{ display: "flex", gap: 16 }}>{["📅", "📅", "📅", "📅"].map((c, k) => <div key={k} style={{ fontSize: 80, opacity: fr >= dZ2 + k * 3 ? 1 : 0 }}>{c}</div>)}</div>
                  <Pill size={44} c={AMBER} bg="rgba(251,191,36,0.15)">⏳ aguardando entrega…</Pill>
                </div>
              )}
            </Janela>
            {fr >= dBl + 2 && fr < dZ2 && <div style={{ position: "absolute", left: 330, top: 160 }}><Slash fr={fr} d={dBl + 2} size={320} /></div>}
            {fr >= dAn + 4 && <div style={{ position: "absolute", left: 330, top: 160 }}><Slash fr={fr} d={dAn + 4} size={320} /></div>}
          </div>
        </div>
      )}
      {fr >= dSo && fr < dSao && (
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ transform: `scale(${fr < dSai ? 1 + 0.06 * Math.max(0, 1 - (fr - dSo) / 8) : 0.92})`, transformOrigin: "50% 0%" }}>
            <Chat fr={fr} a={dSo} b={dSai} txt="um planeta roxo girando, com luz rosa e estrelas" h={fr < dSai ? 330 : 250} glow={fr < dSai} enviado={dSai} />
          </div>
          {fr >= dSai && (
            <In fr={fr} d={dSai} dy={120}>
              <div style={{ transform: `translateX(${shake(fr, d3d, 12)}px)` }}>
                <Navegador w={960} h={fr >= dCena ? 640 : 560} glow={fr >= d3d}>
                  <Cena3D fr={fr} w={932} h={fr >= dCena ? 612 : 532} spin={fr >= dAni ? 1.8 : 1} luz={fr >= d3d ? 1 : 0.4} size={250} />
                </Navegador>
              </div>
            </In>
          )}
          {fr >= dFr + 2 && <div style={{ position: "absolute", top: fr >= dSai ? -98 : 380 }}><Stamp fr={fr} d={dFr + 2} size={46} rot={-2} c={GOLD}>👀 5 passos · o 5º vira vídeo</Stamp></div>}
        </div>
      )}
      {fr >= dSao && (
        <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {["💬", "📚", "📄", "🎚️", "🎬"].map((ic, n) => {
              const d = dCin + n * 3, last = n === 4, hot = last && fr >= dQui;
              return (
                <In key={n} fr={fr} d={d} dy={140}>
                  <div style={{ width: 172, height: 250, borderRadius: 28, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateX(${hot ? shake(fr, dVid, 16) : 0}px) scale(${hot ? 1.15 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1 }}>{n + 1}</div>
                    <div style={{ fontSize: 58 }}>{last && fr < dVid ? "❓" : ic}</div>
                  </div>
                </In>
              );
            })}
          </div>
          <Stamp fr={fr} d={dVid} size={58} rot={-3} c={GOLD}>o 5º vira vídeo 🎬</Stamp>
          <In fr={fr} d={dSao + 4}><div style={{ transform: `scale(0.9)` }}><Cubo fr={fr} s={130} speed={1.5} /></div></In>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- como funciona ----------
const Como = ({ fr }) => {
  const d0 = at(22), dCl = at(23), dEsc = at(24), dCod = at(28), dNav = at(31), dDes = at(32), d3d = at(34);
  const nodes = [["💬", "Claude", dCl], ["</>", "código", dCod], ["🌐", "navegador", dNav]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {nodes.map(([ic, t, d], k) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 240, height: 210, borderRadius: 34, background: fr >= d ? PINKA(0.25) : WIN, border: `4px solid ${fr >= d ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${fr >= d ? 1 + 0.12 * Math.max(0, 1 - (fr - d) / 8) : 0.92})`, boxShadow: fr >= d ? `0 0 50px ${PINKA(0.5)}` : "none" }}>
                <div style={{ fontSize: 80, fontFamily: MONO, fontWeight: 800, color: "#fff" }}>{ic}</div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>{t}</div>
              </div>
              {k < 2 && <div style={{ width: 50, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${PINK} ${lin(fr, d, nodes[k + 1][2]) * 100}%, rgba(255,255,255,0.12) 0)` }} />}
            </div>
          ))}
        </div>
        <div style={{ height: 760, position: "relative", width: 960 }}>
          {fr < dNav ? (
            <In fr={fr} d={dEsc - 2}>
              <Codigo fr={fr} h={700} linhas={[
                ["import * as THREE from 'three'", dEsc, CYAN],
                ["const scene = new THREE.Scene()", dEsc + 8],
                ["const camera = new THREE.", dCod - 4],
                ["  PerspectiveCamera(70)", dCod + 2],
                ["const planeta = new THREE.Mesh(", dCod + 6, PINK],
                ["  esfera, roxo)", dCod + 10, PINK],
                ["renderer.setAnimationLoop(", dCod + 13, GOLD],
                ["  girar)", dCod + 16, GOLD],
              ]} />
            </In>
          ) : (
            <In fr={fr} d={dNav}>
              <Navegador w={960} h={700} glow={fr >= dDes}>
                <Cena3D fr={fr} w={932} h={672} estrelas={lin(fr, dNav, dNav + 10)} luz={lin(fr, dDes, dDes + 8)} roxo={lin(fr, dDes - 4, dDes + 6)} size={280} />
              </Navegador>
              {fr >= d3d && <div style={{ position: "absolute", right: 20, top: 20 }}><Stamp fr={fr} d={d3d} size={64} rot={-4} c={GREEN}>✓ 3D</Stamp></div>}
            </In>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: descreve em português ----------
const Item1 = ({ fr }) => {
  const d0 = at(36), dDesc = at(38), dPt = at(40), dPla = at(42), dRox = at(43), dGir = at(44), dLuz = at(46), dRosa = at(47), dEst = at(49);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="💬" t="Descreve a cena" sub="em português mesmo" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <In fr={fr} d={d0 + 3}>
          <div style={{ position: "relative" }}>
            <Chat fr={fr} a={dDesc} b={dEst + 6} txt="Um planeta roxo girando, com luz rosa e estrelas" h={280} glow={fr >= dPt && fr < dPla} />
            {fr >= dPt && fr < dPla + 6 && <div style={{ position: "absolute", right: 24, top: 10 }}><In fr={fr} d={dPt}><Pill size={36}>🇧🇷 português</Pill></In></div>}
          </div>
        </In>
        <In fr={fr} d={d0 + 8}>
          <Navegador w={960} h={560} glow={fr >= dEst}>
            <Cena3D fr={fr} w={932} h={532} cubo={false} size={300} roxo={lin(fr, dRox, dRox + 6)} spin={fr >= dGir ? 1.6 : 0} luz={lin(fr, dRosa - 2, dRosa + 6)} estrelas={lin(fr, dEst, dEst + 10)} />
          </Navegador>
        </In>
        <div style={{ display: "flex", gap: 14, height: 80 }}>
          {[["🪐 planeta", dPla], ["🟣 roxo", dRox], ["🔄 girando", dGir], ["💡 luz rosa", dLuz], ["✨ estrelas", dEst]].map(([t, d]) => fr >= d && <In key={t} fr={fr} d={d}><Pill size={30} c={PINK} bg={PINKA(0.14)} style={{ padding: "6px 16px" }}>{t}</Pill></In>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: Three.js ----------
const Item2 = ({ fr }) => {
  const d0 = at(50), dNome = at(54), dBib = at(56), dTj = at(57), dGra = at(62), dAb = at(64), dCen = at(67), dGh = at(73);
  const est = count(fr, dCen - 4, dGh + 6, 0, 119500);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="📚" t="Fala o nome" sub="da biblioteca 3D" />
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={d0 + 3}>
          <Janela title="repositório · código aberto" w={960} h={560} glow={fr >= dTj}>
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ width: 150, height: 150, borderRadius: 30, background: "#120a26", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${LINE}` }}><Cubo fr={fr} s={80} speed={1.4} /></div>
              <div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 80, color: "#fff", lineHeight: 1 }}>{fr < dTj - 2 ? <span style={{ color: GREY }}>{typed("nome da biblioteca…", fr, d0 + 4, dBib + 8)}{blink(fr)}</span> : typed("three.js", fr, dTj - 2, dTj + 10)}</div>
                <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 40, color: BODY, marginTop: 10, opacity: lin(fr, dTj + 10, dTj + 16) }}>JavaScript 3D library</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 40, height: 80 }}>
              {fr >= dGra && <Stamp fr={fr} d={dGra} size={56} rot={-4} c={GREEN}>R$ 0</Stamp>}
              {fr >= dAb && <In fr={fr} d={dAb}><Pill size={44} c={CYAN} bg="rgba(94,231,255,0.12)">código aberto · MIT</Pill></In>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 40, opacity: fr >= dCen - 4 ? 1 : 0.3 }}>
              <span style={{ fontSize: 80, transform: `rotate(${fr >= dCen ? Math.sin(fr / 3) * 10 : 0}deg)` }}>⭐</span>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 100, color: GOLD }}>{est.toLocaleString("pt-BR")}</span>
            </div>
          </Janela>
        </In>
        {fr >= dGh && <Stamp fr={fr} d={dGh} size={64} rot={-3} c={GOLD}>≈ 120 mil estrelas no GitHub</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: uma página só ----------
const Item3 = ({ fr }) => {
  const d0 = at(74), dPag = at(78), dSo = at(79), dMon = at(82), dCena = at(84), dCam = at(86), dLuz = at(88), dLoop = at(91), dGir = at(95);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📄" t="Uma página só" sub="um arquivo, abre no navegador" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <In fr={fr} d={d0 + 3}>
          <div style={{ position: "relative" }}>
            <Codigo fr={fr} h={500} title={fr >= dSo ? "cena-3d.html · 1 arquivo" : "cena-3d.html"} glow={fr >= dGir} linhas={[
              ["<script src=…three…>", d0 + 6, CYAN],
              ["// cena", dMon, GREY, dCena],
              ["// câmera", dCena + 4, GREY, dCam],
              ["// luz", dCam + 4, GREY, dLuz],
              ["// loop: girar()", dLuz + 4, GOLD, dLoop],
            ]} />
            {fr >= dSo && fr < dMon + 4 && <div style={{ position: "absolute", right: 20, bottom: 20 }}><Stamp fr={fr} d={dSo} size={50} rot={-4} c={PINK}>1 arquivo</Stamp></div>}
          </div>
        </In>
        <In fr={fr} d={dCena - 2}>
          <Navegador w={960} h={440} glow={fr >= dGir}>
            <Cena3D fr={fr} w={932} h={412} size={220} estrelas={fr >= dCam ? 1 : 0} luz={lin(fr, dLuz, dLuz + 6)} spin={fr >= dLoop ? (fr >= dGir ? 2.4 : 1.2) : 0} />
          </Navegador>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: controles ----------
const Item4 = ({ fr }) => {
  const d0 = at(96), dPed = at(98), dCtl = at(99), dBar = at(101), dVel = at(103), dOut = at(104), dCor = at(106), dAj = at(109), dViv = at(111);
  const vel = interpolate(fr, [dVel - 2, dVel + 14, dOut, dOut + 8], [0.3, 0.95, 0.95, 0.7], clamp);
  const cor = interpolate(fr, [dCor - 2, dCor + 16, dAj + 4, dViv + 10], [0, 0.85, 0.85, 0.4], clamp);
  const hue = cor * 160;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="🎚️" t="Pede controles" sub="e ajusta ao vivo" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <In fr={fr} d={d0 + 3}>
          <Navegador w={960} h={500} glow={fr >= dViv}>
            <Cena3D fr={fr} w={932} h={472} size={240} speed={0.5 + vel * 2.5} hue={hue} />
          </Navegador>
        </In>
        <In fr={fr} d={dCtl - 2}>
          <Janela title="controles" w={960} h={fr >= dCor - 4 ? 330 : 200} glow={fr >= dBar && fr < dViv}>
            <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center", marginTop: 6 }}>
              <div style={{ opacity: fr >= dBar - 2 ? 1 : 0.35 }}><Slider label="velocidade" v={vel} right={`${(0.5 + vel * 2.5).toFixed(1)}x`} /></div>
              {fr >= dCor - 4 && <In fr={fr} d={dCor - 4}><Slider label="cor" v={cor} c={`hsl(${310 + hue},80%,62%)`} right={`${Math.round(hue)}°`} /></In>}
            </div>
            {fr < dBar && <div style={{ position: "absolute", left: 30, bottom: 30 }}>{blink(fr)}</div>}
          </Janela>
        </In>
        {fr >= dViv && <Stamp fr={fr} d={dViv} size={64} rot={-3} c={GREEN}>● ao vivo</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: vira vídeo ----------
const Item5 = ({ fr }) => {
  const d0 = at(112), dVid = at(115), dPla = at(117), dTeam = at(118), dMod = at(120), dMot = at(121), dBeta = at(124), dExp = at(125), dMp4 = at(129), dFim = at(131);
  const prog = ease(lin(fr, dExp, dFim + 6));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="5" icon="🎬" t="Vira vídeo" sub="exporta em MP4" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", gap: 16, height: 84, alignItems: "center" }}>
          {fr >= dPla && <In fr={fr} d={dPla}><Pill size={40} c={CYAN} bg="rgba(94,231,255,0.12)">plano {fr >= dTeam ? "Team" : "…"}</Pill></In>}
          {fr >= dMot && <In fr={fr} d={dMot}><Pill size={40} c={PINK} bg={PINKA(0.15)}>modelo Motion</Pill></In>}
          {fr >= dBeta && <In fr={fr} d={dBeta}><Pill size={40} c={AMBER} bg="rgba(251,191,36,0.15)">beta</Pill></In>}
        </div>
        <In fr={fr} d={d0 + 3}>
          <Janela title={fr >= dMod ? "Claude · Motion (beta)" : "Claude · artifact"} w={960} h={720} glow={fr >= dFim}>
            <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
              <Cena3D fr={fr} w={904} h={400} size={210} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: 18, padding: "0 20px" }}>
                <span style={{ fontSize: 34, color: "#fff" }}>{fr >= dVid ? "▶" : "⏸"}</span>
                <div style={{ flex: 1, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.2)" }}><div style={{ width: `${((fr * 0.6) % 100)}%`, height: "100%", borderRadius: 5, background: PINK }} /></div>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#fff" }}>00:{String(Math.floor(fr / 30) % 60).padStart(2, "0")}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30 }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff", background: fr >= dExp ? PINK : "rgba(255,255,255,0.12)", padding: "14px 34px", borderRadius: 18, transform: `scale(${fr >= dExp ? 1 + 0.1 * Math.max(0, 1 - (fr - dExp) / 8) : 1})` }}>Exportar</div>
              {fr >= dExp && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 38, color: BODY }}>{fr >= dMp4 ? "animacao.mp4" : "…"}</div>}
            </div>
            <div style={{ marginTop: 26, opacity: fr >= dExp ? 1 : 0.25 }}><Prog v={prog} w={904} /></div>
            {fr < dExp && fr >= dMod && <Cursor x={130} y={500} fr={fr} click={dExp - 2} />}
          </Janela>
        </In>
        {fr >= dFim && <Stamp fr={fr} d={dFim} size={70} rot={-3} c={GREEN}>✓ MP4 pronto</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const Cta = ({ fr }) => {
  const d0 = at(132), dPri = at(136), dCom = at(137), d3 = at(138), dSeg = at(142), dPr = at(144), dLeg = at(147);
  const ideias = [["🪐", "planeta"], ["🧊", "cubo"], ["🚀", "foguete"]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff", textAlign: "center" }}>Qual cena primeiro?</div></In>
        <div style={{ display: "flex", gap: 20 }}>
          {ideias.map(([ic, t], k) => {
            const d = d0 + 4 + k * 4, hot = fr >= dPri && k === Math.floor(fr / 8) % 3;
            return <In key={t} fr={fr} d={d} dy={120}><div style={{ width: 290, height: 260, borderRadius: 30, background: hot ? PINKA(0.25) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, transform: `scale(${hot ? 1.06 : 1})` }}><div style={{ fontSize: 110, transform: `rotate(${Math.sin(fr / 6 + k) * 10}deg)` }}>{ic}</div><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{t}</div></div></In>;
          })}
        </div>
        <In fr={fr} d={dCom - 2}>
          <Janela title="comentários" w={960} h={240} glow={fr >= d3}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 40, background: "#5b4a8a" }} />
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{fr >= d3 - 2 ? typed("3D", fr, d3 - 2, d3 + 4) : ""}{fr < d3 + 10 && blink(fr)}</div>
              {fr >= d3 + 8 && <span style={{ marginLeft: "auto", fontSize: 64, transform: `scale(${pop(fr, d3 + 8, 9)})` }}>❤️</span>}
            </div>
          </Janela>
        </In>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg ? pop(fr, dSeg, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
        {fr >= dPr && <Stamp fr={fr} d={dPr} size={54} rot={-3} c={GOLD}>prompt na legenda ↓</Stamp>}
              </div>
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["zero", "blender", "animador", "1 frase", "frase", "3d", "animada", "5 passos", "5º", "video", "claude", "codigo", "navegador", "desenha", "nº 1", "nº 2", "nº 3", "nº 4", "nº 5", "portugues", "planeta", "roxo", "girando", "rosa", "estrelas", "biblioteca", "threejs", "graca", "aberto", "120 mil", "github", "pagina", "so", "monta", "camera", "luz", "loop", "girar", "controles", "velocidade", "cor", "vivo", "team", "motion", "beta", "exporta", "mp4", "primeiro", "comenta", "segue", "prompt", "legenda"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/º%$ -]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) && !/\.\.\.$/.test(w.w) ? w.w.slice(-1) : /\.\.\.$/.test(w.w) ? "..." : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "tres" && nn(k + 1) === "de") { push("3D", k + 1); continue; }
    if (n === "uma" && nn(k + 1) === "frase") { push("1 frase", k + 1); continue; }
    if (n === "cinco" && nn(k + 1) === "passos") { push("5 passos", k + 1); continue; }
    if (n === "quinto") { push("5º", k); continue; }
    if (n === "tri" && nn(k + 1) === "jei") { push("Three.js", k + 2); continue; }
    if (n === "cento" && nn(k + 1) === "e" && nn(k + 2) === "vinte" && nn(k + 3) === "mil") { push("120 mil", k + 3); continue; }
    if (n === "eme" && nn(k + 1) === "pe") { push("MP4", k + 2); continue; }
    toks.push({ t: x.w, s: x.s, e: x.e });
  }
  const chunks = []; let cur = [];
  toks.forEach((tk) => {
    cur.push(tk);
    const len = cur.map((c) => c.t).join(" ").length;
    if (cur.length >= 3 || len > 14 || /[.,!?:;]$/.test(tk.t)) { chunks.push(cur); cur = []; }
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

export const ShortAnimacao3D = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(22), at(36), at(50), at(74), at(96), at(112), at(132), end];
  const scenes = [Hook, Como, Item1, Item2, Item3, Item4, Item5, Cta];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(6)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(57)} b={at(66)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(140)} b={end} pose="comemorando" top={1290} />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(1) + 2, "error", 0.45, 15)}
      {S(at(2), "whoosh", 0.6, 20)}
      {S(at(3) + 4, "error", 0.45, 15)}
      {S(at(4), "whoosh", 0.8, 30)}
      {S(at(6), "pop", 0.4, 15)}
      {S(at(7), "riser", 0.3, 30)}
      {S(at(11), "ding", 0.45)}
      {S(at(14), "whoosh", 0.6, 30)}
      {[0, 3, 6, 9, 12].map((o) => S(at(15) + o, "pop", 0.3, 15))}
      {S(at(20), "ding", 0.4)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {[23, 28, 31].map((i) => S(at(i), "pop", 0.35, 15))}
      {S(at(34), "ding", 0.4)}
      {[42, 43, 44, 47, 49].map((i) => S(at(i), "pop", 0.3, 15))}
      {S(at(57), "pop", 0.4, 15)}
      {S(at(62), "coin", 0.5, 15)}
      {S(at(67), "riser", 0.25, 30)}
      {S(at(73), "ding", 0.45)}
      {[84, 86, 88, 91].map((i) => S(at(i), "pop", 0.35, 15))}
      {S(at(95), "ding", 0.4)}
      {S(at(103), "whoosh", 0.35, 20)}
      {S(at(106), "whoosh", 0.35, 20)}
      {S(at(111), "ding", 0.4)}
      {[117, 121, 124].map((i) => S(at(i), "pop", 0.35, 15))}
      {S(at(125), "riser", 0.25, 30)}
      {S(at(131), "ding", 0.45)}
      {S(at(138) + 4, "pop", 0.4, 15)}
      {S(at(142), "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaAnimacao3D = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 112, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>Animação 3D</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 112, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>com</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 140, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 20 }}>1 frase</div>
    </div>
    <div style={{ position: "absolute", top: 860, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <Navegador w={960} h={520} glow>
        <Cena3D fr={30} w={932} h={492} size={260} />
      </Navegador>
    </div>
    <div style={{ position: "absolute", top: 1440, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>no Claude · 5 passos</div>
  </AbsoluteFill>
);
