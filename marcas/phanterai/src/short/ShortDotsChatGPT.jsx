import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";


// Reel 28/11/2026 07:00 — "Os Dots do ChatGPT explicados em 1 minuto".
// Fatos conferidos na fonte primária (openai.com/index/introducing-dots, cópia em fontes/):
// agentes sempre ligados, GPT-6 Astra, computador próprio na nuvem, navegador próprio, 24/7, mais de 4.000 apps
// por plugins, ChatGPT/Slack/Teams + chamada de voz, seu computador fica separado e dá para abrir o do dot,
// exemplo do criador de conteúdo (transcrição → cortes, notas, posts para aprovar), testador que esqueceu a fatura,
// trocar senha fica com você, chegando em Pro e Business Premium.
// Tudo é interface recriada em motion: nenhum print, nenhum personagem oficial dos dots, nada gerado por IA, nenhum crédito na tela.
export const SDOT_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-28-0700-dots-do-chatgpt-1-minuto";
export const SDOT_FPS = 30;
const MUSIC = "phanterai/music/CuriousFocus.mp3";
const SRM_SLUG = SDOT_SLUG;
const SRM_FPS = SDOT_FPS;
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
export const calculateDotsMetadata = async () => {
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
const Navegador = ({ url = "cena-3d.html", w = 960, h = 700, glow, children }) => (
  <Janela title={url} w={w} h={h} glow={glow}>
    <div style={{ position: "absolute", left: 14, right: 14, top: 14, bottom: 14 }}>{children}</div>
  </Janela>
);
const Chat = ({ fr, a, b, txt, w = 960, h = 300, glow, enviado, title = "ChatGPT · seu dot", who = "Você" }) => (
  <Janela title={title} w={w} h={h} glow={glow}>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY, marginBottom: 12 }}>{who}</div>
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

// ---------- peças deste reel ----------
// "seu dot": orbe brilhante desenhado em CSS (não é o personagem oficial).
const Orbe = ({ fr, s = 220, on = 1, hot }) => (
  <div style={{ position: "relative", width: s, height: s }}>
    {[0, 1, 2].map((k) => {
      const t = ((fr + k * 20) % 60) / 60;
      return <div key={k} style={{ position: "absolute", inset: -s * 0.5 * t, borderRadius: "50%", border: `${Math.max(3, s * 0.02)}px solid ${PINKA((1 - t) * 0.55 * on)}` }} />;
    })}
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffd6f6 0%, ${PINK} 38%, #6b2bd9 80%)`, boxShadow: `0 0 ${s * (hot ? 0.6 : 0.35)}px ${PINKA(0.7 * on)}`, transform: `scale(${1 + 0.04 * Math.sin(fr / 6)})`, opacity: 0.4 + 0.6 * on }}>
      {[0.34, 0.6].map((x) => <div key={x} style={{ position: "absolute", left: s * x, top: s * 0.4, width: s * 0.08, height: s * (fr % 90 < 4 ? 0.02 : 0.14), borderRadius: s, background: "#1a0b33" }} />)}
    </div>
  </div>
);
const Check = ({ t, ok, fr, d, size = 38, c = GREEN }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: inter, fontWeight: 800, fontSize: size, color: "#fff", opacity: fr >= d ? 1 : 0.3 }}>
    <div style={{ width: size * 1.3, height: size * 1.3, borderRadius: size, flexShrink: 0, border: `4px solid ${fr >= ok ? c : LINE}`, background: fr >= ok ? c : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.8, transform: `scale(${fr >= ok ? 0.8 + 0.2 * pop(fr, ok, 9) : 1})` }}>{fr >= ok ? "✓" : fr >= d ? <Spin fr={fr} s={size} /> : ""}</div>
    <span style={{ whiteSpace: "nowrap" }}>{t}</span>
  </div>
);
const Relogio = ({ fr, a, b, w = 520 }) => {
  const h = count(fr, a, b, 0, 24 * 60);
  const hh = String(Math.floor(h / 60) % 24).padStart(2, "0"), mm = String(h % 60).padStart(2, "0");
  return <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 120, color: "#fff", width: w, textAlign: "center" }}>{h >= 24 * 60 ? "24h" : `${hh}:${mm}`}</div>;
};

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dEle = at(2), dTrab = at(4), dCin = at(5), dDot = at(9), dGpt = at(11), dSoz = at(13), dQui = at(16), dAnt = at(18), dPed = at(21);
  let big, bigD, size = 150, bg = PINK, rot = -3;
  if (fr < dEle) { big = "Você dorme"; bigD = 0; bg = "#5b4a8a"; }
  else if (fr < dCin) { big = "ele trabalha!"; bigD = dEle; rot = 2; }
  else if (fr < dQui) { big = "5 coisas"; bigD = dCin; size = 160; }
  else { big = fr >= dAnt ? "antes de pedir" : "a 5ª…"; bigD = fr >= dAnt ? dAnt : dQui; size = 110; rot = 2; }
  const flash = [dEle, dTrab, dCin, dDot, dQui, dAnt].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.45, 0);
  const zoom0 = interpolate(fr, [0, 8], [1.15, 1], clamp);
  const tarefas = [["investigar bug", dTrab], ["rascunhar posts", dTrab + 8], ["preparar fatura", dTrab + 16]];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.45, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dCin && (
        <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, transform: `scale(${zoom0})` }}>
          <Janela title={fr < dEle ? "você · offline 🌙" : "seu dot · trabalhando"} w={960} h={760} glow={fr >= dEle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 120, transform: `rotate(${Math.sin(fr / 8) * 8}deg)` }}>{fr < dEle ? "😴" : "🌙"}</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: "#fff" }}>03:{String(Math.floor(fr * 1.7) % 60).padStart(2, "0")}</div>
            </div>
            <div style={{ height: 4, background: LINE, margin: "26px 0" }} />
            {fr < dEle ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {["💤", "💤 💤", "💤 💤 💤"].map((z, k) => <div key={k} style={{ fontSize: 60, opacity: lin(fr, k * 6, k * 6 + 6), transform: `translateX(${Math.sin(fr / 5 + k) * 20}px)` }}>{z}</div>)}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
                <In fr={fr} d={dEle}><Orbe fr={fr} s={210} hot /></In>
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  {tarefas.map(([t, d]) => <Check key={t} t={t} fr={fr} d={d - 6} ok={d + 6} size={40} />)}
                </div>
              </div>
            )}
          </Janela>
        </div>
      )}
      {fr >= dCin && (
        <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {["🖥️", "🔌", "💬", "🎬", "⚡"].map((ic, n) => {
              const d = dCin + n * 3, last = n === 4, hot = last && fr >= dQui;
              return (
                <In key={n} fr={fr} d={d} dy={140}>
                  <div style={{ width: 172, height: 250, borderRadius: 28, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateX(${hot ? shake(fr, dAnt, 16) : 0}px) scale(${hot ? 1.15 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1 }}>{n + 1}</div>
                    <div style={{ fontSize: 58 }}>{last && fr < dAnt ? "❓" : ic}</div>
                  </div>
                </In>
              );
            })}
          </div>
          {fr >= dDot && (
            <In fr={fr} d={dDot}>
              <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "20px 40px", borderRadius: 40, background: WIN, border: `3px solid ${fr >= dSoz ? PINK : LINE}` }}>
                <Orbe fr={fr} s={140} hot={fr >= dSoz} />
                <div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>dot {fr >= dGpt && <span style={{ color: BODY, fontSize: 44 }}>· ChatGPT</span>}</div>
                  {fr >= dSoz && <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 44, color: PINK }}>{typed("faz sozinho…", fr, dSoz, dSoz + 10)}</div>}
                </div>
              </div>
            </In>
          )}
          {fr >= dDot + 6 && <Stamp fr={fr} d={dDot + 6} size={54} rot={-3} c={GOLD}>👀 o 5º vem antes de você pedir</Stamp>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- como funciona ----------
const Como = ({ fr }) => {
  const d0 = at(22), dAg = at(24), dOai = at(26), dTr = at(28), d24 = at(29), dHor = at(32), dCom = at(36), dSo = at(37), dDele = at(38);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, height: 230 }}>
          <Orbe fr={fr} s={200} hot={fr >= dAg} />
          <div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff" }}>{typed("agente", fr, dAg - 4, dAg + 4)}</div>
            {fr >= dOai && <In fr={fr} d={dOai}><Pill size={40} c={CYAN} bg="rgba(94,231,255,0.12)">da OpenAI · GPT-6 Astra</Pill></In>}
          </div>
        </div>
        {fr < dCom ? (
          <In fr={fr} d={dTr - 4}>
            <Janela title="sempre ligado" w={960} h={560} glow={fr >= dHor}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, marginTop: 20 }}>
                <Relogio fr={fr} a={dTr} b={dHor + 6} w={700} />
                <div style={{ display: "flex", gap: 8 }}>
                  {Array.from({ length: 24 }, (_, k) => <div key={k} style={{ width: 28, height: 90, borderRadius: 8, background: fr >= dTr + (k * (dHor + 6 - dTr)) / 24 ? (k < 7 || k > 20 ? "#6b2bd9" : PINK) : "rgba(255,255,255,0.08)" }} />)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: 860, fontFamily: inter, fontWeight: 800, fontSize: 36, color: BODY }}><span>🌙 noite</span><span>☀️ dia</span><span>🌙 noite</span></div>
                {fr >= d24 + 6 && <Stamp fr={fr} d={d24 + 6} size={60} rot={-3} c={GREEN}>24/7</Stamp>}
              </div>
            </Janela>
          </In>
        ) : (
          <In fr={fr} d={dCom}>
            <Janela title="☁️ computador do dot" w={960} h={560} glow={fr >= dDele}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                <div style={{ width: 600, height: 340, borderRadius: 20, border: `6px solid ${fr >= dSo ? PINK : LINE}`, background: "#120a26", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <Orbe fr={fr} s={150} />
                  <div style={{ position: "absolute", bottom: -40, width: 200, height: 30, borderRadius: 8, background: LINE }} />
                </div>
                {fr >= dSo && <div style={{ marginTop: 30 }}><Stamp fr={fr} d={dSo} size={60} rot={-3} c={PINK}>só dele</Stamp></div>}
              </div>
            </Janela>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: computador próprio ----------
const Item1 = ({ fr }) => {
  const d0 = at(39), dCom = at(42), dNav = at(44), dPro = at(45), dNb = at(47), dSep = at(49), dAbre = at(52), dDele = at(54), dConf = at(56);
  const aberto = fr >= dAbre + 4;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🖥️" t="Computador próprio" sub="e navegador também" />
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 3}>
          <div style={{ position: "relative", transform: `scale(${aberto ? 1 + 0.05 * Math.max(0, 1 - (fr - dAbre - 4) / 8) : 1})` }}>
            <Janela title={aberto ? "computador do dot · ao vivo" : "computador do dot"} w={960} h={aberto ? 720 : 460} glow={fr >= dPro}>
              {fr >= dNav ? (
                <div style={{ borderRadius: 16, border: `3px solid ${LINE}`, overflow: "hidden" }}>
                  <div style={{ display: "flex", gap: 10, padding: 12, background: "rgba(255,255,255,0.05)" }}>
                    {["planilha", "e-mail", "site"].map((t, k) => fr >= dNav + k * 4 && <div key={t} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: k === Math.floor(fr / 10) % 3 ? "#fff" : GREY, background: k === Math.floor(fr / 10) % 3 ? PINKA(0.3) : "transparent", padding: "6px 18px", borderRadius: 10 }}>{t}</div>)}
                  </div>
                  <div style={{ height: 230, position: "relative", padding: 20 }}>
                    {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 26, width: `${50 + ((k * 23 + Math.floor(fr / 6) * 7) % 45)}%`, borderRadius: 8, background: "rgba(255,255,255,0.1)", marginBottom: 20 }} />)}
                    <Cursor x={200 + Math.sin(fr / 9) * 300 + 300} y={60 + Math.cos(fr / 7) * 70 + 70} fr={fr} click={Math.floor(fr / 20) * 20} />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 330 }}><Orbe fr={fr} s={180} /></div>
              )}
              {aberto && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 24 }}>
                  <Check t="abriu 3 abas" fr={fr} d={dAbre + 4} ok={dAbre + 8} size={34} />
                  <Check t="leu a planilha" fr={fr} d={dAbre + 8} ok={dDele + 2} size={34} />
                  <Check t="tudo registrado" fr={fr} d={dDele + 2} ok={dConf} size={34} />
                </div>
              )}
            </Janela>
            {fr >= dAbre - 6 && fr < dAbre + 4 && <Cursor x={760} y={30} fr={fr} click={dAbre} />}
          </div>
        </In>
        {!aberto && fr >= dNb - 2 && (
          <In fr={fr} d={dNb - 2}>
            <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "22px 40px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dSep ? GREEN : LINE}`, transform: `translateX(${fr >= dSep ? 40 * ease(lin(fr, dSep, dSep + 8)) : 0}px)` }}>
              <span style={{ fontSize: 80 }}>💻</span>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>seu notebook</span>
              {fr >= dSep && <In fr={fr} d={dSep}><Pill size={38}>🔒 separado</Pill></In>}
            </div>
          </In>
        )}
        {fr >= dConf && <Stamp fr={fr} d={dConf} size={60} rot={-3} c={GREEN}>✓ você confere tudo</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: 4.000 apps ----------
const APPS = ["📧", "📅", "📊", "📁", "💬", "🗂️", "🧾", "📝", "🛒", "📈", "🎨", "🎵", "📷", "🗺️", "☎️", "💳", "📦", "🧠", "🔔", "🛠️", "📚", "🎬", "✈️", "🏷️"];
const Item2 = ({ fr }) => {
  const d0 = at(58), dCon = at(60), dMais = at(62), dMil = at(64), dApps = at(66);
  const n = count(fr, dCon, dApps + 4, 0, 4000);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🔌" t="4.000+ apps" sub="conectados por plugins" />
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 150, color: fr >= dApps ? GOLD : "#fff", transform: `scale(${fr >= dMil ? 1 + 0.12 * Math.max(0, 1 - (fr - dMil) / 8) : 1})` }}>{fr >= dMais ? "+" : ""}{n.toLocaleString("pt-BR")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 140px)", gap: 18, position: "relative" }}>
          {APPS.map((ic, k) => {
            const d = d0 + 4 + k * 2.2, on = fr >= d;
            return <div key={k} style={{ width: 140, height: 140, borderRadius: 32, background: on ? PINKA(0.22) : "rgba(255,255,255,0.05)", border: `3px solid ${on ? PINK : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, opacity: on ? 1 : 0.35, transform: `scale(${on ? 0.85 + 0.15 * pop(fr, d, 9) : 0.85})`, filter: on ? "none" : "grayscale(1)" }}>{ic}</div>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: onde fala ----------
const Item3 = ({ fr }) => {
  const d0 = at(67), dFala = at(69), dGpt = at(73), dSl = at(75), dTe = at(78), dOu = at(79), dLig = at(81);
  const canais = [["ChatGPT", "🟢", dGpt], ["Slack", "#", dSl], ["Teams", "👥", dTe]];
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="💬" t="Fala onde você está" sub="mensagem ou ligação" />
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {fr < dOu ? canais.map(([t, ic, d], k) => fr >= Math.min(d - 3, d0 + 3 + k * 5) && (
          <In key={t} fr={fr} d={Math.min(d - 3, d0 + 3 + k * 5)} dx={k % 2 ? 200 : -200} dy={0}>
            <div style={{ width: 960, display: "flex", alignItems: "center", gap: 24, padding: 26, borderRadius: 30, background: WIN, border: `3px solid ${fr >= d && fr < (canais[k + 1]?.[2] ?? dOu) ? PINK : LINE}`, boxSizing: "border-box" }}>
              <div style={{ width: 100, height: 100, borderRadius: 24, background: "#2a1b52", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>{ic}</div>
              <div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{t}</div>
                <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 34, color: BODY }}>{typed(["dot: terminei o relatório ✓", "dot: o bug já está corrigido", "dot: pode aprovar o rascunho?"][k], fr, d, d + 14)}</div>
              </div>
              <Orbe fr={fr} s={70} />
            </div>
          </In>
        )) : (
          <In fr={fr} d={dOu}>
            <div style={{ width: 560, height: 900, borderRadius: 70, background: "#0e0820", border: `6px solid ${fr >= dLig ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, boxShadow: `0 0 80px ${PINKA(0.4)}` }}>
              <Orbe fr={fr} s={240} hot />
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 54, color: "#fff" }}>seu dot</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: GREEN }}>{fr >= dLig + 8 ? `00:0${Math.floor((fr - dLig - 8) / 30)}` : "chamando…"}</div>
              <div style={{ width: 130, height: 130, borderRadius: 65, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, transform: `rotate(${Math.sin(fr / 2) * (fr < dLig + 8 ? 14 : 0)}deg)` }}>📞</div>
            </div>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: conteúdo ----------
const Item4 = ({ fr }) => {
  const d0 = at(82), dChe = at(84), dTra = at(86), dEnt = at(89), dAcha = at(91), dCor = at(93), dEsc = at(94), dNot = at(96), dRas = at(98), dPos = at(100);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="🎬" t="Faz o conteúdo" sub="você só aprova" />
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ height: 120 }}>
          {fr >= d0 + 3 && (
            <div style={{ transform: `translateY(${(1 - ease(lin(fr, d0 + 3, d0 + 13))) * -260}px) rotate(${(1 - ease(lin(fr, d0 + 3, d0 + 13))) * -12}deg)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 34px", borderRadius: 24, background: WIN, border: `3px solid ${fr >= dEnt ? CYAN : LINE}` }}>
                <span style={{ fontSize: 60 }}>📄</span>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff" }}>{fr >= dTra ? "entrevista-transcricao.txt" : "novo arquivo…"}</span>
              </div>
            </div>
          )}
        </div>
        <In fr={fr} d={d0 + 8}>
          <Janela title="dot · produzindo" w={960} h={300} glow={fr >= dCor && fr < dEsc}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: BODY, marginBottom: 16 }}>✂️ cortes</div>
            <div style={{ height: 90, borderRadius: 14, background: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
              {Array.from({ length: 40 }, (_, k) => <div key={k} style={{ position: "absolute", left: 10 + k * 22, bottom: 10, width: 12, height: 20 + ((k * 37) % 60), borderRadius: 4, background: "rgba(190,170,255,0.4)" }} />)}
              {[[120, 180], [420, 150], [700, 170]].map(([x, w], k) => fr >= dCor + k * 4 && <div key={k} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: w * ease(lin(fr, dCor + k * 4, dCor + k * 4 + 6)), background: PINKA(0.45), border: `3px solid ${PINK}`, borderRadius: 10 }} />)}
              <div style={{ position: "absolute", top: 0, bottom: 0, width: 4, background: "#fff", left: 10 + (Math.max(0, fr - dAcha) * 24) % 900 }} />
            </div>
          </Janela>
        </In>
        <div style={{ display: "flex", gap: 20 }}>
          <In fr={fr} d={dEsc - 2}>
            <Janela title="notas.md" w={470} h={330} glow={fr >= dNot && fr < dRas}>
              {["# Destaques", "- minuto 04: a virada", "- minuto 12: a dica", "- minuto 21: o fecho"].map((t, k) => fr >= dEsc + k * 4 && <div key={k} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: k ? "#fff" : PINK, lineHeight: 1.7, whiteSpace: "nowrap" }}>{typed(t, fr, dEsc + k * 4, dEsc + k * 4 + 8)}</div>)}
            </Janela>
          </In>
          <In fr={fr} d={dRas - 2}>
            <Janela title="posts · rascunho" w={470} h={330} glow={fr >= dPos}>
              {[0, 1, 2].map((k) => fr >= dRas + k * 4 && <div key={k} style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16, transform: `scale(${pop(fr, dRas + k * 4, 10)})`, transformOrigin: "0 50%" }}>
                <div style={{ width: 60, height: 60, borderRadius: 14, background: [PINK, CYAN, GOLD][k] }} />
                <div style={{ flex: 1 }}><div style={{ height: 14, width: "90%", borderRadius: 7, background: "rgba(255,255,255,0.2)", marginBottom: 10 }} /><div style={{ height: 14, width: "60%", borderRadius: 7, background: "rgba(255,255,255,0.12)" }} /></div>
              </div>)}
            </Janela>
          </In>
        </div>
        {fr >= dPos + 4 && <Stamp fr={fr} d={dPos + 4} size={56} rot={-3} c={AMBER}>⏳ aguardando sua aprovação</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: age antes de pedir ----------
const Item5 = ({ fr }) => {
  const d0 = at(101), dTes = at(104), dEsq = at(105), dFat = at(109), dDot = at(111), dPer = at(112), dPre = at(113), dEnv = at(117), dDep = at(118), dApr = at(121);
  const prep = lin(fr, dPre, dPre + 18);
  const aprovado = fr >= dApr;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="5" icon="⚡" t="Age antes de pedir" sub="e espera seu ok" />
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 3}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 36px", borderRadius: 30, background: fr >= dEsq && fr < dPer ? "rgba(255,92,122,0.18)" : WIN, border: `3px solid ${fr >= dEsq && fr < dPer ? RED : fr >= dPer ? GREEN : LINE}`, transform: `translateX(${shake(fr, dFat, 14)}px)` }}>
            <span style={{ fontSize: 64 }}>🧾</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>{fr >= dPer ? "fatura: dot percebeu 👀" : fr >= dEsq ? "fatura não emitida ⚠️" : "testador · fim do mês"}</span>
          </div>
        </In>
        <In fr={fr} d={d0 + 8}>
          <Janela title="fatura · rascunho do dot" w={960} h={560} glow={fr >= dEnv}>
            <div style={{ display: "flex", gap: 30 }}>
              <Orbe fr={fr} s={140} hot={fr >= dPer && fr < dEnv} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                {["cliente", "serviço", "valor", "vencimento"].map((t, k) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, width: 200 }}>{t}</span>
                    <div style={{ flex: 1, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.max(0, Math.min(1, prep * 4 - k)) * 100}%`, background: PINKA(0.7) }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 50, position: "relative" }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", background: aprovado ? GREEN : fr >= dEnv ? PINK : "rgba(255,255,255,0.12)", padding: "18px 40px", borderRadius: 20, transform: `scale(${aprovado ? 1 + 0.1 * Math.max(0, 1 - (fr - dApr) / 8) : fr >= dEnv ? 1 + 0.04 * Math.sin(fr / 3) : 1})` }}>{aprovado ? "✓ aprovada" : "Aprovar e enviar"}</div>
              {fr >= dEnv && !aprovado && <Pill size={34} c={AMBER} bg="rgba(251,191,36,0.15)">⏳ aguardando você</Pill>}
              {fr >= dDep && fr < dApr + 6 && <Cursor x={120} y={30} fr={fr} click={dApr - 2} />}
            </div>
          </Janela>
        </In>
        {aprovado && <Stamp fr={fr} d={dApr + 4} size={66} rot={-3} c={GREEN}>✓ fatura enviada</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const Cta = ({ fr }) => {
  const d0 = at(122), dPro = at(126), dBus = at(129), dDei = at(134), dDot = at(138), dCom = at(139), dD = at(140), dSeg = at(143);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", gap: 20, height: 100, alignItems: "center" }}>
          <In fr={fr} d={d0}><Pill size={42} c={AMBER} bg="rgba(251,191,36,0.15)">🚀 chegando</Pill></In>
          {fr >= dPro && <In fr={fr} d={dPro}><Pill size={42} c={CYAN} bg="rgba(94,231,255,0.12)">Pro</Pill></In>}
          {fr >= dBus && <In fr={fr} d={dBus}><Pill size={42} c={CYAN} bg="rgba(94,231,255,0.12)">Business Premium</Pill></In>}
        </div>
        <In fr={fr} d={Math.min(dDei - 6, d0 + 8)}><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 66, color: "#fff", textAlign: "center", lineHeight: 1.1 }}>O que você deixaria<br />com o seu <span style={{ fontFamily: lora, fontStyle: "italic", background: PINK, padding: "0 20px", borderRadius: 16 }}>dot?</span></div></In>
        <In fr={fr} d={d0 + 2}><Orbe fr={fr} s={190} hot={fr >= dD} /></In>
        <In fr={fr} d={dCom - 2}>
          <Janela title="comentários" w={960} h={220} glow={fr >= dD}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 40, background: "#5b4a8a" }} />
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{fr >= dD - 2 ? typed("DOT", fr, dD - 2, dD + 4) : ""}{fr < dD + 10 && blink(fr)}</div>
              {fr >= dD + 8 && <span style={{ marginLeft: "auto", fontSize: 64, transform: `scale(${pop(fr, dD + 8, 9)})` }}>❤️</span>}
            </div>
          </Janela>
        </In>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg ? pop(fr, dSeg, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["dorme", "trabalhando", "5 coisas", "dot", "chatgpt", "sozinho", "5ª", "antes", "pedir", "agente", "openai", "24 horas", "computador", "so", "dele", "nº 1", "nº 2", "nº 3", "nº 4", "nº 5", "navegador", "proprios", "notebook", "separado", "abre", "conferir", "conecta", "4 mil", "apps", "slack", "teams", "ligacao", "transcricao", "entrevista", "cortes", "notas", "posts", "testador", "esqueceu", "fatura", "percebeu", "preparou", "aprovou", "pro", "business", "premium", "deixaria", "comenta", "segue"]);
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
    if (n === "cinco" && nn(k + 1) === "coisas") { push("5 coisas", k + 1); continue; }
    if (n === "quinta") { push("5ª", k); continue; }
    if (n === "vinte" && nn(k + 1) === "e" && nn(k + 2) === "quatro" && nn(k + 3) === "horas") { push("24 horas", k + 3); continue; }
    if (n === "quatro" && nn(k + 1) === "mil") { push("4 mil", k + 1); continue; }
    if (n === "dot") { toks.push({ t: "dot" + tail(x), s: x.s, e: x.e, key: true }); continue; }
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

export const ShortDotsChatGPT = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(22), at(39), at(58), at(67), at(82), at(101), at(122), end];
  const scenes = [Hook, Como, Item1, Item2, Item3, Item4, Item5, Cta];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(4)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(104)} b={at(112)} pose="apontando" top={1330} left />
      <Reacao fr={fr} a={at(139)} b={end} pose="comemorando" top={1290} />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(2), "whoosh", 0.8, 30)}
      {[0, 8, 16].map((o) => S(at(4) + 6 + o, "pop", 0.3, 15))}
      {S(at(5), "whoosh", 0.7, 30)}
      {[0, 3, 6, 9, 12].map((o) => S(at(5) + o, "pop", 0.25, 15))}
      {S(at(9), "ding", 0.4)}
      {S(at(16), "riser", 0.3, 30)}
      {S(at(21), "ding", 0.45)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(26), "pop", 0.35, 15)}
      {S(at(35), "ding", 0.4)}
      {S(at(37), "pop", 0.4, 15)}
      {S(at(49), "pop", 0.35, 15)}
      {S(at(52), "pop", 0.4, 15)}
      {S(at(56), "ding", 0.4)}
      {S(at(60), "riser", 0.25, 30)}
      {S(at(66), "coin", 0.5, 15)}
      {[73, 75, 78].map((i) => S(at(i) - 3, "pop", 0.35, 15))}
      {S(at(81), "ding", 0.4)}
      {S(at(84), "whoosh", 0.4, 20)}
      {[93, 94, 98].map((i) => S(at(i), "pop", 0.35, 15))}
      {S(at(100) + 4, "ding", 0.4)}
      {S(at(105), "error", 0.4, 15)}
      {S(at(112), "pop", 0.4, 15)}
      {S(at(117), "riser", 0.25, 30)}
      {S(at(121), "ding", 0.5)}
      {S(at(140) + 4, "pop", 0.4, 15)}
      {S(at(143), "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaDotsChatGPT = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 112, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>Você dorme.</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 112, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>Ele</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 130, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 20 }}>trabalha 24h</div>
    </div>
    <div style={{ position: "absolute", top: 880, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Janela title="seu dot · trabalhando" w={900} h={400} glow>
        <div style={{ display: "flex", gap: 40, alignItems: "center", marginTop: 20 }}>
          <Orbe fr={20} s={220} hot />
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {["investigar bug", "rascunhar posts", "preparar fatura"].map((t) => <Check key={t} t={t} fr={99} d={0} ok={0} size={40} />)}
          </div>
        </div>
      </Janela>
    </div>
    <div style={{ position: "absolute", top: 1440, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>Dots do ChatGPT · em 1 minuto</div>
  </AbsoluteFill>
);
