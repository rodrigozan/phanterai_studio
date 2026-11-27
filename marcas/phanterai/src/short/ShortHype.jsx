import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 27/11/2026 10:00 — Mito vs. Realidade: "o YouTube só ajuda canal grande" (Hype).
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 27/11/2026):
// - support.google.com/youtube/answer/15333273 (Hype a video): criadores do YPP com 500 a 500.000 inscritos;
//   vídeos longos enviados nos últimos 7 dias; 3 hypes por semana sem custo (renova segunda 0h); "for a channel with
//   500 subscribers, hyping once results in 7,500 points ... 500,000 subscribers, each hype results in 50 points";
//   Brasil na lista de países; ranking (leaderboard) igual para todos no mesmo país.
// - answer/15509925 (elegibilidade): YouTube Shorts não são elegíveis; answer/15334500: "you can't hype your own videos".
// 7.500 / 50 = 150 (conta refeita). Meme só na fala/texto: "modo Naruto" (sem imagem/personagem).
// Tudo é interface recriada em motion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
export const HYP_SLUG = "phanterai/episodes/shorts-reels-tiktok/yt-short-2026-11-27-1000-hype-canal-pequeno";
export const HYP_FPS = 30;
const SCP_FPS = HYP_FPS;
const MUSIC = "phanterai/music/CuriousFocus.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";
const FPS = SCP_FPS;
const f = (p) => staticFile(`${HYP_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const AMBER = "#fbbf24";
const VIOLET = "#b48cff";
const CYAN = "#5eead4";
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
const In = ({ fr, d, children, dy = 50, dx = 0, style = {}, damping = 13 }) => {
  const p = pop(fr, d, damping);
  if (fr < d) return null;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};
const center = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" };

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
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 165, 180) }}>
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
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", zIndex: 6, transform: `scale(${d <= 0 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : 0.55 + 0.45 * pop(fr, d, 9)}) translateX(${shake(fr, d, 16)}px)` }}>
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

const Bar = ({ v, c, w = 640, h = 60, glow }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(190,160,255,0.25)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, v)) * 100}%`, borderRadius: h / 2, background: c, boxShadow: glow ? `0 0 40px ${c}` : "none" }} />
  </div>
);

const Cursor = ({ x, y, fr, click, c = "#fff", s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 7, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    {click != null && fr >= click && fr < click + 12 && <div style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `5px solid ${PINK}`, transform: `scale(${0.4 + (fr - click) / 8})`, opacity: 1 - (fr - click) / 12 }} />}
    <div style={{ width: 0, height: 0, borderLeft: "22px solid " + c, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", transform: "rotate(-55deg) translate(-6px,-4px)", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.7))" }} />
  </div>
);

// ---------- peças ----------
const Digital = ({ txt, c = "#fff", size = 120, glow }) => (
  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, color: c, background: WIN, border: `3px solid ${glow ? PINK : LINE}`, borderRadius: 28, padding: "10px 40px", boxShadow: glow ? `0 0 60px ${PINKA(0.5)}` : "none", letterSpacing: 4 }}>{txt}</div>
);
const VideoCard = ({ fr, w = 420, glow, c }) => {
  const h = (w * 9) / 16;
  return (
    <div style={{ width: w, height: h, borderRadius: 22, position: "relative", overflow: "hidden", border: `4px solid ${c || (glow ? PINK : "rgba(255,255,255,0.2)")}`, background: "linear-gradient(135deg, hsl(285,70%,42%), hsl(250,70%,18%))", boxShadow: glow ? `0 0 60px ${c || PINK}` : "0 20px 50px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "absolute", left: w * 0.07, top: h * 0.18, width: w * 0.45, height: h * 0.12, borderRadius: 8, background: "rgba(255,255,255,0.9)" }} />
      <div style={{ position: "absolute", left: w * 0.07, top: h * 0.36, width: w * 0.3, height: h * 0.12, borderRadius: 8, background: "rgba(255,255,255,0.55)" }} />
      <div style={{ position: "absolute", right: w * 0.1, bottom: h * 0.14, width: h * 0.42, height: h * 0.42, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.05 * Math.sin(fr / 5)})` }}>
        <div style={{ width: 0, height: 0, borderLeft: `${h * 0.14}px solid #fff`, borderTop: `${h * 0.09}px solid transparent`, borderBottom: `${h * 0.09}px solid transparent`, marginLeft: h * 0.04 }} />
      </div>
    </div>
  );
};
const Fade = ({ fr, a, b = 1e9, children, style = {} }) => {
  if (fr < a - 1 || fr > b + 8) return null;
  const o = lin(fr, a - 1, a + 5) * (1 - lin(fr, b, b + 8));
  return <div style={{ opacity: o, ...style }}>{children}</div>;
};

const Chip = ({ t, c = VIOLET, off, size = 34, style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: size, color: off ? GREY : "#fff", background: off ? "rgba(255,255,255,0.05)" : `${c}33`, border: `2px solid ${off ? "rgba(255,255,255,0.15)" : c}`, padding: "8px 18px", borderRadius: 14, whiteSpace: "nowrap", textDecoration: off ? "line-through" : "none", ...style }}>{t}<span style={{ opacity: 0.6 }}>×</span></span>
);

// Player com barra de progresso dividida em capítulos (ou lisa, sem capítulos).
// segs: [{ w (0..1), c, label, off, blink }]
const Player = ({ fr, w = 940, segs = null, prog = 0.3, glow, label, style = {} }) => {
  const h = (w * 9) / 16;
  return (
    <div style={{ width: w, borderRadius: 30, background: WIN, border: `3px solid ${glow ? PINK : LINE}`, boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 50px ${PINKA(glow ? 0.4 : 0.15)}`, overflow: "hidden", ...style }}>
      <div style={{ height: h * 0.72, position: "relative", background: "linear-gradient(135deg, hsl(285,60%,30%), hsl(250,70%,12%))" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: 60, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.05 * Math.sin(fr / 5)})` }}>
          <div style={{ width: 0, height: 0, borderLeft: "40px solid #fff", borderTop: "26px solid transparent", borderBottom: "26px solid transparent", marginLeft: 10 }} />
        </div>
        {label && <div style={{ position: "absolute", left: 28, bottom: 24, fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", background: "rgba(0,0,0,0.55)", padding: "8px 20px", borderRadius: 14 }}>{label}</div>}
      </div>
      <div style={{ padding: "26px 28px 30px" }}>
        <div style={{ display: "flex", gap: segs ? 8 : 0, height: 22 }}>
          {(segs || [{ w: 1, c: "rgba(255,255,255,0.25)" }]).map((s, k) => {
            const cum = (segs || [{ w: 1 }]).slice(0, k).reduce((a, x) => a + x.w, 0);
            const fill = Math.max(0, Math.min(1, (prog - cum) / s.w));
            return (
              <div key={k} style={{ flex: s.w, position: "relative", borderRadius: 11, background: s.off ? "rgba(255,92,122,0.25)" : "rgba(255,255,255,0.2)", overflow: "hidden", opacity: s.blink ? 0.4 + 0.6 * Math.abs(Math.sin(fr / 3)) : 1, outline: s.off ? `3px solid ${RED}` : "none" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: s.c || PINK }} />
              </div>
            );
          })}
        </div>
        {segs && <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {segs.map((s, k) => <div key={k} style={{ flex: s.w, fontFamily: inter, fontWeight: 800, fontSize: 26, color: s.off ? RED : BODY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "clip" }}>{s.label}</div>)}
        </div>}
      </div>
    </div>
  );
};

// Caixa de descrição com marcações de tempo. lines: [{ t, title, c, off, d }]
const Descricao = ({ fr, lines, w = 940, glow, title = "Descrição", style = {} }) => (
  <div style={{ width: w, borderRadius: 26, background: WIN, border: `3px solid ${glow ? PINK : LINE}`, padding: "22px 30px", boxSizing: "border-box", ...style }}>
    <div style={{ fontFamily: inter, fontSize: 28, color: GREY, marginBottom: 14 }}>{title}</div>
    {lines.map((l, k) => {
      if (l.d != null && fr < l.d) return null;
      const p = l.d != null ? pop(fr, l.d, 12) : 1;
      return (
        <div key={l.key || k} style={{ display: "flex", gap: 22, alignItems: "center", marginBottom: 12, opacity: Math.min(1, p * 1.5) * (l.gone ? 0.25 : 1), transform: `translateX(${(1 - p) * 60}px) translateY(${l.dy || 0}px)` }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: l.size || 46, color: "#fff", background: l.off ? RED : l.c || "rgba(180,140,255,0.3)", padding: "2px 14px", borderRadius: 10, textDecoration: l.gone ? "line-through" : "none" }}>{l.t}</span>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: l.size ? l.size - 6 : 40, color: BODY, textDecoration: l.gone ? "line-through" : "none" }}>{l.title}</span>
          {l.mark && <span style={{ fontSize: 40 }}>{l.mark}</span>}
        </div>
      );
    })}
  </div>
);

// ---------- peças novas ----------
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
// Tela vertical de Short com cronômetro e barra de progresso. w/h podem animar (9:16, 1:1, 16:9).
const Tela = ({ fr, w = 400, h = 711, t = "0:00", prog = 0, c = PINK, label, lock, glow, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 34, position: "relative", overflow: "hidden", border: `5px solid ${c}`, background: "linear-gradient(160deg, hsl(285,60%,32%), hsl(250,70%,12%))", boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 ${glow ? 80 : 40}px ${c}`, boxSizing: "border-box", ...style }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: "38%", textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: Math.min(w, h) * 0.26, color: "#fff", letterSpacing: 2, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{t}</div>
    {label && <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center" }}><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "8px 20px", borderRadius: 14, whiteSpace: "nowrap" }}>{label}</span></div>}
    <div style={{ position: "absolute", left: 24, right: 24, bottom: 30, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.2)" }}>
      <div style={{ width: `${Math.max(0, Math.min(1, prog)) * 100}%`, height: "100%", borderRadius: 7, background: c }} />
    </div>
    {lock && <div style={{ position: "absolute", inset: 0, background: "rgba(20,0,10,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.min(w, h) * 0.42, transform: `scale(${lock})` }}>🔒</div>}
  </div>
);
const Globo = ({ fr, size = 300, locked, ok }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <div style={{ fontSize: size * 0.9, lineHeight: 1, transform: `rotate(${Math.sin(fr / 12) * 8}deg)`, filter: locked ? "grayscale(0.7) brightness(0.7)" : "none", textAlign: "center" }}>🌍</div>
    {locked && <div style={{ position: "absolute", right: -20, bottom: -10, fontSize: size * 0.45 }}>🔒</div>}
    {ok && <div style={{ position: "absolute", right: -20, bottom: -10, fontSize: size * 0.4 }}>✅</div>}
  </div>
);
const Linha = ({ fr, d, icon, t, x, c = RED }) => {
  if (fr < d) return <div style={{ height: 110 }} />;
  const p = pop(fr, d, 11);
  return (
    <div style={{ width: 860, height: 110, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", boxSizing: "border-box", borderRadius: 26, background: WIN, border: `3px solid ${c}`, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 120}px)` }}>
      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{icon} {t}</span>
      <span style={{ fontSize: 60, transform: `scale(${pop(fr, d + 4, 8)})` }}>{x}</span>
    </div>
  );
};

export const calculateHypeMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças novas ----------
const nf = (n) => Math.round(n).toLocaleString("pt-BR");
const Avatar = ({ size = 110, c1 = "#7c3aed", c2 = "#db2777", icon = "📺" }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: `linear-gradient(135deg, ${c1}, ${c2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>{icon}</div>
);
// Botão de hype recriado (estilo da marca, sem logo oficial)
const HypeBtn = ({ fr, on, off, size = 46, pulse }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: inter, fontWeight: 800, fontSize: size, color: off ? GREY : "#fff", background: off ? "rgba(255,255,255,0.06)" : on ? `linear-gradient(90deg, ${AMBER}, ${PINK})` : "rgba(255,255,255,0.12)", border: `3px solid ${off ? "rgba(255,255,255,0.15)" : on ? AMBER : "rgba(255,255,255,0.3)"}`, padding: "12px 34px", borderRadius: 60, whiteSpace: "nowrap", transform: `scale(${pulse ? 1 + 0.06 * Math.sin(fr / 3) : 1})`, boxShadow: on ? `0 0 50px ${AMBER}` : "none" }}>🔥 Hype</div>
);
// Card de canal com contador de pontos e barra
const CanalRow = ({ fr, d, subs, pts, max = 7500, a, b, c = PINK, glow, dim, w = 900 }) => {
  if (fr < d) return <div style={{ height: 200, marginBottom: 30 }} />;
  const p = pop(fr, d, 12);
  const v = pts * ease(lin(fr, a, b));
  return (
    <div style={{ width: w, height: 200, marginBottom: 30, borderRadius: 30, background: WIN, border: `3px solid ${glow ? c : LINE}`, boxShadow: glow ? `0 0 60px ${c}` : "none", padding: "22px 30px", boxSizing: "border-box", opacity: Math.min(1, p * 1.5) * (dim ? 0.45 : 1), transform: `translateX(${(1 - p) * 120}px) scale(${dim ? 0.92 : 1})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Avatar size={80} />
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", flex: 1 }}>{subs}</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, color: c }}>{fr >= a ? nf(v) : "0"} <span style={{ fontSize: 30, color: GREY }}>pts</span></div>
      </div>
      <div style={{ marginTop: 20 }}><Bar w={w - 60} h={34} v={v / max} c={c} glow={glow} /></div>
    </div>
  );
};
const Tag = ({ fr, d, txt }) => {
  if (fr < d) return null;
  const sw = Math.sin((fr - d) / 5) * 14 * Math.exp(-(fr - d) / 40);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `rotate(${sw}deg) scale(${pop(fr, d, 9)})`, transformOrigin: "50% 0%" }}>
      <div style={{ width: 4, height: 70, background: GREY }} />
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", background: GREEN, padding: "10px 46px", borderRadius: "24px 24px 24px 24px", boxShadow: `0 0 60px ${GREEN}` }}>{txt}</div>
    </div>
  );
};

// ---------- 0: gancho (canal pequeno vale 150x mais) ----------
const Hook = ({ fr }) => {
  const dVale = at(2), d150 = at(3), dMais = at(7);
  const flash = [0, d150, dMais].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const big = fr >= dMais ? "150x MAIS!" : fr >= d150 ? "150x" : "Canal pequeno";
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={fr >= dMais ? dMais : fr >= d150 ? d150 : 0} size={fr >= d150 ? 190 : 140} top={110} rot={fr >= d150 ? -3 : -1} bg={fr >= dMais ? AMBER : PINK}>{big}</Big>
      <div style={{ ...center, top: 400, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, d150, 16)}px)` }}>
        <CanalRow fr={fr} d={0} subs="500 inscritos" pts={7500} a={0} b={dMais} c={GREEN} glow={fr >= d150} />
        <CanalRow fr={fr} d={0} subs="500 mil inscritos" pts={50} a={0} b={dMais} c={GREY} dim={fr >= dMais} />
        <div style={{ height: 110 }}>{fr >= dVale && <In fr={fr} d={dVale}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={46}>por 1 hype 🔥</Pill></In>}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: é o Hype + 3 regras ----------
const Hype = ({ fr }) => {
  const d0 = at(8), dHype = at(10), dYT = at(12), dRegras = at(13), dTer = at(17), dPeg = at(20);
  const regras = fr >= dRegras;
  const cx = interpolate(fr, [d0, dHype], [900, 610], clamp), cy = interpolate(fr, [d0, dHype], [900, 590], clamp);
  return (
    <AbsoluteFill>
      <Big fr={fr} d={fr >= dPeg ? dPeg : regras ? dRegras : dHype} size={140} top={140} rot={-2} bg={fr >= dPeg ? RED : regras ? VIOLET : AMBER}>{fr >= dPeg ? "pegadinha 👀" : regras ? "3 regras" : fr >= dHype ? "HYPE 🔥" : "É o…"}</Big>
      <div style={{ ...center, top: 400 }}>
        {!regras ? <div style={{ position: "relative" }}>
          <Player fr={fr} w={900} label={fr >= dYT ? "vídeo novo · 2 dias" : "vídeo novo"} glow={fr >= dHype} />
          <div style={{ marginTop: 34, display: "flex", gap: 24, justifyContent: "center" }}>
            <Pill c={BODY} bg="rgba(255,255,255,0.06)" size={40}>👍 Gostei</Pill>
            <HypeBtn fr={fr} on={fr >= dHype} />
          </div>
          {fr >= dHype && <div style={{ position: "absolute", left: 560, top: 470 - 260 * ease(lin(fr, dHype, dHype + 20)), fontFamily: MONO, fontWeight: 800, fontSize: 64, color: AMBER, opacity: 1 - lin(fr, dHype + 14, dHype + 24) }}>+7.500</div>}
          <Cursor x={cx} y={cy} fr={fr} click={dHype} s={1.6} />
        </div> : <div style={{ marginTop: 40, display: "flex", gap: 34 }}>
          {[0, 1, 2].map((k) => {
            const d = dRegras + k * 5;
            const hot = k === 2 && fr >= dTer;
            if (fr < d) return <div key={k} style={{ width: 260 }} />;
            const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
            return (
              <div key={k} style={{ width: 260, height: 340, borderRadius: 36, background: hot ? "rgba(255,92,122,0.2)" : WIN, border: `4px solid ${hot ? RED : VIOLET}`, transform: `perspective(800px) rotateY(${flip}deg) translateX(${hot ? shake(fr, dTer, 10) : 0}px) scale(${hot ? 1.08 : 0.95})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 140, color: "#fff" }}>{k + 1}</span>
                <span style={{ fontFamily: MONO, fontSize: 32, color: hot ? "#fff" : GREY }}>{["🏆 placar", "🙋 quem dá", "⚠️ pegadinha"][k]}</span>
              </div>
            );
          })}
        </div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: Nº 1 o placar (7.500 x 50) + modo Naruto ----------
const Item1 = ({ fr }) => {
  const d0 = at(21), dQ = at(25), dSete = at(28), dHy = at(34), dCom = at(35), dMil = at(37), dSo = at(38), dCin = at(39), dModo = at(40), dFraco = at(44), dTurma = at(46), dBonus = at(48);
  const turma = fr >= dModo;
  const rows = [
    { t: "canal 500 mil", c: GREY },
    { t: "canal 50 mil", c: GREY },
    { t: "canal 5 mil", c: GREY },
    { t: "canal 500", c: GREEN, hero: true },
  ];
  const up = ease(lin(fr, dBonus - 6, dBonus + 10));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🏆" t="O placar" sub="pontos por 1 hype" />
      <div style={{ ...center, top: 470 }}>
        {!turma ? <>
          <CanalRow fr={fr} d={d0 + 6} subs="500 inscritos" pts={7500} a={dSete - 4} b={dHy} c={GREEN} glow={fr >= dSete} />
          <CanalRow fr={fr} d={dCom} subs="500 mil inscritos" pts={50} a={dSo} b={dCin + 8} c={RED} glow={fr >= dCin} />
          <div style={{ height: 150, display: "flex", alignItems: "center", gap: 30 }}>
            {fr >= dSete && <In fr={fr} d={dSete}><Pill c={GREEN} size={44}>🚀 7.500</Pill></In>}
            {fr >= dMil && <In fr={fr} d={dMil}><Pill c={RED} bg="rgba(255,92,122,0.14)" size={44}>{fr >= dCin ? "😬 só 50" : "500 mil?"}</Pill></In>}
          </div>
          <div style={{ height: 160 }}>{fr >= dCin + 6 && <Stamp fr={fr} d={dCin + 6} c={AMBER} rot={-6} size={96}>150x</Stamp>}</div>
        </> : <>
          <In fr={fr} d={dModo}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={50}>🍥 modo Naruto</Pill></In>
          <div style={{ marginTop: 40, position: "relative", width: 880, height: 4 * 135 }}>
            {rows.map((r, k) => {
              let y = k * 135;
              if (r.hero) y = interpolate(up, [0, 1], [3 * 135, 0]);
              else if (fr >= dBonus - 6) y = (k + up) * 135;
              const hot = r.hero && fr >= dFraco;
              const d = dModo + 3 + k * 3;
              return (
                <div key={k} style={{ position: "absolute", left: 0, top: y, width: 880, height: 115, borderRadius: 24, background: WIN, border: `3px solid ${hot ? (up > 0.5 ? GREEN : RED) : LINE}`, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", boxSizing: "border-box", opacity: lin(fr, d, d + 6), boxShadow: hot && up > 0.5 ? `0 0 50px ${GREEN}` : "none" }}>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: GREY, width: 60 }}>{r.hero ? (up > 0.5 ? "1º" : "4º") : `${k + 1 + (fr >= dBonus - 6 && up > 0.5 ? 1 : 0)}º`}</span>
                  <Avatar size={70} />
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff", flex: 1 }}>{r.t}</span>
                  {hot && <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: up > 0.5 ? GREEN : RED }}>{fr >= dBonus - 6 ? "+ bônus 🚀" : fr >= dTurma ? "o mais fraco" : "fraco?"}</span>}
                </div>
              );
            })}
          </div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: Nº 2 quem dá é o espectador, 3/semana, grátis, não no próprio ----------
const Item2 = ({ fr }) => {
  const d0 = at(49), dQuem = at(51), dHy = at(54), dEsp = at(57), dTres = at(58), dSem = at(60), dGra = at(61), dE = at(63), dPro = at(65), dNao = at(67);
  const proprio = fr >= dE;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🙋" t="Quem dá o hype" sub="o espectador" />
      <div style={{ ...center, top: 470 }}>
        {!proprio ? <>
          <div style={{ display: "flex", alignItems: "center", gap: 40, height: 260 }}>
            {fr >= d0 + 8 && <In fr={fr} d={d0 + 8} dx={-80} dy={0}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}><Avatar size={170} c1="#0ea5e9" c2="#22c55e" icon="🙋" /><Pill c={CYAN} bg="rgba(94,234,212,0.12)" size={36}>{fr >= dEsp ? "espectador ✓" : "quem?"}</Pill></div></In>}
            <div style={{ position: "relative" }}>
              <HypeBtn fr={fr} on={fr >= dHy} size={60} />
              {fr >= dHy - 8 && <Cursor x={interpolate(fr, [dHy - 8, dHy], [260, 160], clamp)} y={interpolate(fr, [dHy - 8, dHy], [160, 60], clamp)} fr={fr} click={dHy} s={1.5} />}
            </div>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 30, height: 170 }}>
            {[0, 1, 2].map((k) => fr >= dTres + k * 4 ? <div key={k} style={{ width: 150, height: 150, borderRadius: 75, background: "rgba(251,191,36,0.18)", border: `4px solid ${AMBER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, transform: `scale(${pop(fr, dTres + k * 4, 9)})` }}>🔥</div> : <div key={k} style={{ width: 150 }} />)}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 40, alignItems: "flex-start", height: 300 }}>
            {fr >= dSem && <In fr={fr} d={dSem}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={48}>3 por semana</Pill></In>}
            <Tag fr={fr} d={dGra} txt="R$ 0" />
          </div>
        </> : <>
          <div style={{ width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dNao ? RED : LINE}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 28, transform: `translateX(${shake(fr, dNao, 16)}px)` }}>
            <Avatar size={130} />
            <div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{fr >= dPro ? "Seu próprio vídeo" : "Seu vídeo"}</div>
              <div style={{ marginTop: 16 }}><HypeBtn fr={fr} off={fr >= dNao} size={42} /></div>
            </div>
          </div>
          <div style={{ marginTop: 80, height: 200 }}>{fr >= dNao && <Stamp fr={fr} d={dNao} c={RED} rot={-6} size={110}>NÃO VALE</Stamp>}</div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: Nº 3 pegadinha: só longo, 7 dias, Short não, YPP ----------
const Item3 = ({ fr }) => {
  const d0 = at(69), dPeg = at(72), dSo = at(73), dLon = at(76), dPri = at(78), dSete = at(79), dDias = at(80), dSho = at(81), dEnt = at(83), dE = at(84), dPre = at(87), dPro = at(90), dPar = at(92);
  const stage = fr >= dE ? 2 : fr >= dSho ? 1 : 0;
  const days = Math.min(7, Math.floor(7 * lin(fr, dPri, dDias + 6)));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="⚠️" t="A pegadinha" sub="nem todo vídeo entra" />
      <div style={{ ...center, top: 470 }}>
        {stage === 0 && <>
          <div style={{ opacity: lin(fr, d0 + 3, d0 + 10), transform: `translateX(${shake(fr, dPeg, 12)}px)` }}><Player fr={fr} w={860} label={fr >= dLon ? "vídeo LONGO ✓" : fr >= dPeg ? "qual vídeo? 🤔" : "vídeo…"} glow={fr >= dLon} /></div>
          <div style={{ marginTop: 30, display: "flex", gap: 20, height: 70 }}>
            {[["Short", RED], ["Live", GREY], ["Longo", GREEN]].map(([t, c], k) => {
              const d = dSo + k * 3;
              if (fr < d) return <div key={t} style={{ width: 170 }} />;
              const ok = t === "Longo" && fr >= dLon;
              return <span key={t} style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: ok ? "#fff" : BODY, background: ok ? GREEN : "rgba(255,255,255,0.06)", border: `3px solid ${ok ? GREEN : LINE}`, padding: "6px 26px", borderRadius: 40, transform: `scale(${pop(fr, d, 10) * (ok ? 1.12 : 1)})`, opacity: fr >= dLon && !ok ? 0.4 : 1 }}>{t}</span>;
            })}
          </div>
          <div style={{ marginTop: 30, display: "flex", gap: 14 }}>
            {Array.from({ length: 7 }, (_, k) => <div key={k} style={{ width: 104, height: 104, borderRadius: 20, background: k < days ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.05)", border: `3px solid ${k < days ? GREEN : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 42, color: k < days ? "#fff" : GREY }}>{k + 1}</div>)}
          </div>
          <div style={{ marginTop: 30, height: 100 }}>{fr >= dSete && <In fr={fr} d={dSete}><Pill c={GREEN} size={46}>⏳ primeiros 7 dias</Pill></In>}</div>
        </>}
        {stage === 1 && <>
          <div style={{ transform: `translateX(${shake(fr, dEnt, 16)}px)` }}><Tela fr={fr} w={360} h={640} t="▶" prog={0.4} c={RED} glow label="Short" lock={fr >= dEnt ? 0.01 + 0.99 * pop(fr, dEnt, 10) : 0} /></div>
          <div style={{ marginTop: -120 }}>{fr >= dEnt && <Stamp fr={fr} d={dEnt} c={RED} rot={-6} size={100}>NÃO ENTRA</Stamp>}</div>
        </>}
        {stage === 2 && <>
          <div style={{ width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dPar ? GREEN : LINE}`, boxSizing: "border-box", boxShadow: fr >= dPar ? `0 0 60px ${PINKA(0.3)}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <Avatar size={110} />
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>Seu canal</div>
            </div>
            {[["Programa de Parcerias", dPro], ["500 a 500 mil inscritos", dPar], ["vídeo longo, até 7 dias", dPar + 8]].map(([t, d], k) => (
              <div key={k} style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 20, opacity: lin(fr, dPre + k * 4, dPre + k * 4 + 6) }}>
                <div style={{ width: 60, height: 60, borderRadius: 14, border: `4px solid ${fr >= d ? GREEN : GREY}`, background: fr >= d ? GREEN : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#fff", transform: `scale(${fr >= d ? pop(fr, d, 8) : 1})` }}>{fr >= d ? "✓" : ""}</div>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: fr >= d ? "#fff" : GREY }}>{t}</span>
              </div>
            ))}
          </div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: ranking do país + Brasil ----------
const Ranking = ({ fr }) => {
  const d0 = at(93), dHyp = at(95), dSob = at(96), dRank = at(98), dPais = at(100), dBr = at(103), dLis = at(106);
  const up = ease(lin(fr, dSob, dSob + 16));
  const rows = ["vídeo A", "vídeo B", "vídeo C", "vídeo D"];
  const paises = ["Austrália", "Alemanha", "Brasil", "Canadá", "Espanha", "EUA", "Índia", "Japão", "México", "Portugal"];
  const showP = fr >= dPais;
  return (
    <AbsoluteFill>
      <Big fr={fr} d={fr >= dBr ? dBr : fr >= dRank ? dRank : d0} size={130} top={140} rot={-2} bg={fr >= dBr ? GREEN : VIOLET}>{fr >= dBr ? "Brasil ✓" : fr >= dRank ? "Ranking 🏆" : "Mais hypados"}</Big>
      <div style={{ ...center, top: 420 }}>
        {!showP ? <div style={{ position: "relative", width: 880, height: 4 * 130 }}>
          {rows.map((r, k) => {
            let y = k * 130;
            if (k === 3) y = interpolate(up, [0, 1], [3 * 130, 0]);
            else y = (k + up) * 130;
            const pts = [21000, 15000, 9000, 4000][k] + (k === 3 ? 26000 * up : 0) + (fr - d0) * (k === 3 ? 0 : 20);
            return (
              <div key={k} style={{ position: "absolute", top: y, width: 880, height: 112, borderRadius: 24, background: WIN, border: `3px solid ${k === 3 && up > 0.5 ? AMBER : LINE}`, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", boxSizing: "border-box", opacity: lin(fr, d0 + k * 3, d0 + k * 3 + 6), boxShadow: k === 3 && up > 0.5 ? `0 0 50px ${AMBER}` : "none" }}>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: GREY, width: 60 }}>{Math.round(y / 130) + 1}º</span>
                <div style={{ width: 150, height: 84, borderRadius: 12, background: `linear-gradient(135deg, hsl(${280 + k * 20},60%,40%), hsl(250,70%,15%))` }} />
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff", flex: 1 }}>{r}</span>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: AMBER }}>🔥 {nf(pts)}</span>
              </div>
            );
          })}
        </div> : <>
          <In fr={fr} d={dPais}><Pill c={CYAN} bg="rgba(94,234,212,0.12)" size={46}>🌎 um ranking por país</Pill></In>
          <div style={{ marginTop: 50, width: 900, display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
            {paises.map((p, k) => {
              const br = p === "Brasil";
              const d = dPais + 2 + k * 2;
              if (fr < d) return <div key={p} style={{ width: 0 }} />;
              const hot = br && fr >= dBr;
              return <span key={p} style={{ fontFamily: inter, fontWeight: 800, fontSize: hot ? 64 : 42, color: hot ? "#fff" : BODY, background: hot ? GREEN : "rgba(255,255,255,0.06)", border: `3px solid ${hot ? GREEN : LINE}`, padding: "10px 26px", borderRadius: 40, transform: `scale(${pop(fr, d, 10) * (hot ? 1 + 0.04 * Math.sin(fr / 4) : 1)})`, boxShadow: hot ? `0 0 50px ${GREEN}` : "none", opacity: !hot && fr >= dBr ? 0.5 : 1 }}>{p}</span>;
            })}
          </div>
          <div style={{ marginTop: 40, height: 140 }}>{fr >= dLis && <Stamp fr={fr} d={dLis} c={GREEN} rot={-5} size={90}>TÁ NA LISTA</Stamp>}</div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(107), dHy = at(108), dViu = at(112), dBot = at(114);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 280 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 90, color: "#fff", whiteSpace: "nowrap" }}>{typed("HYPE 🔥", fr, dHy, dHy + 10)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 70, height: 140 }}>{fr >= dViu - 4 && <In fr={fr} d={dViu - 4}><HypeBtn fr={fr} on={fr >= dBot} pulse size={64} /></In>}</div>
        {fr >= dHy && Array.from({ length: 12 }, (_, k) => { const t0 = dHy + k * 4; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 380 * Math.sin(k * 2.1), top: 1000 - t * 420, fontSize: 60, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "🔥" : "💬"}</div>; })}
      </div>
    </AbsoluteFill>
  );
};
const Bloco = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translate(${(1 - pin) * 160 - pout * 160}px, 110px)` }}>{children}</AbsoluteFill>;
};
const Reacao = ({ fr, a, b, pose, top = 1150, left }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  const x = 10 - (1 - pin) * 420 - pout * 420;
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 300, ...(left ? { left: x } : { right: x }), top, zIndex: 8 }} />;
};
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/]/g, "");
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
        const key = w.key === undefined ? KEY.has(norm(shown)) : w.key;
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};
const KEY = new Set(["150x", "150", "mais", "hype", "pegadinha", "regras", "terceira", "7500", "500", "500mil", "50", "naruto", "fraco", "bonus", "espectador", "3", "graca", "proprio", "longo", "7dias", "short", "parcerias", "ranking", "pais", "brasil", "lista", "comenta"]);
// números falados viram forma escrita na legenda
const FRASES = [
  [["cento", "e", "cinquenta", "vezes"], "150x"],
  [["sete", "mil", "e", "quinhentos"], "7.500"],
  [["quinhentos", "mil"], "500 mil"],
  [["quinhentos"], "500"],
  [["cinquenta"], "50"],
  [["numero", "um"], "Nº 1"], [["numero", "dois"], "Nº 2"], [["numero", "tres"], "Nº 3"],
  [["sete", "dias"], "7 dias"],
  [["tres"], "3"],
];

export const ShortHype = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(8), at(21), at(49), at(69), at(93), at(107), end];
  const scenes = [Hook, Hype, Item1, Item2, Item3, Ranking, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(72)} b={at(81)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(107)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "pop", 0.5, 12)}
      {S(at(3), "error", 0.55, 15)}
      {S(at(7), "ding", 0.5)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(10), "pop", 0.5, 15)}{S(at(10) + 2, "coin", 0.3, 30)}
      {[at(13), at(13) + 5, at(13) + 10].map((b) => S(b, "pop", 0.35, 15))}
      {S(at(20), "error", 0.4, 15)}
      {S(at(28) - 4, "riser", 0.3, 40)}{S(at(34), "ding", 0.45)}
      {S(at(39), "error", 0.4, 15)}{S(at(39) + 6, "pop", 0.45, 15)}
      {S(at(40), "whoosh", 0.4)}{S(at(48) - 6, "riser", 0.3, 30)}{S(at(48), "ding", 0.45)}
      {S(at(54), "pop", 0.45, 15)}
      {[0, 1, 2].map((k) => S(at(58) + k * 4, "pop", 0.3, 12))}
      {S(at(61), "coin", 0.35, 30)}
      {S(at(67), "error", 0.5, 15)}
      {S(at(76), "ding", 0.4)}
      {S(at(83), "error", 0.5, 15)}
      {S(at(90), "pop", 0.4, 15)}{S(at(92), "pop", 0.4, 15)}
      {S(at(96), "riser", 0.3, 30)}
      {S(at(103), "ding", 0.5)}{S(at(106), "pop", 0.45, 15)}
      {S(at(108), "pop", 0.4, 15)}{S(at(114), "coin", 0.3, 30)}
    </AbsoluteFill>
  );
};

export const CapaHype = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Canal pequeno</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 140, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>vale 150x</div>
    </div>
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <CanalRow fr={999} d={0} subs="500 inscritos" pts={7500} a={0} b={1} c={GREEN} glow />
      <CanalRow fr={999} d={0} subs="500 mil inscritos" pts={50} a={0} b={1} c={GREY} dim />
      <div style={{ marginTop: 20 }}><HypeBtn fr={0} on size={60} /></div>
      <div style={{ marginTop: 40, fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>Mito <span style={{ color: RED }}>vs.</span> Realidade</div>
    </div>
  </AbsoluteFill>
);
const buildChunks2 = (words) => {
  const toks = [];
  const tail = (w) => (/\.\.\.$/.test(w.w) ? "..." : /[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  for (let k = 0; k < words.length; k++) {
    let hit = null;
    for (const [seq, out] of FRASES) {
      if (seq.every((s, j) => words[k + j] && norm(words[k + j].w) === s)) { hit = [seq.length, out]; break; }
    }
    if (hit) { const j = k + hit[0] - 1; toks.push({ t: hit[1] + tail(words[j]), s: words[k].s, e: words[j].e, key: true }); k = j; continue; }
    toks.push({ t: words[k].w, s: words[k].s, e: words[k].e });
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
