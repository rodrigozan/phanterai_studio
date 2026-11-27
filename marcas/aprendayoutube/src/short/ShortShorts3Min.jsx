import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 26/11/2026 17:00 — Mito vs. Realidade: "Short só pode ter 60 segundos".
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 26/11/2026):
// - support.google.com/youtube/answer/15424877 (en e pt-BR, "Como criar Shorts com até três minutos no YouTube"):
//   vídeos enviados a partir de 15/10/2024, quadrados ou verticais, com até 3 min, são categorizados como Shorts;
//   "Any Short that is over one minute in duration with an active copyright claim of any type, including manual claims,
//   will be blocked globally on YouTube. The video will not be playable or recommended on YouTube, and will not be
//   eligible for monetization. There are no penalties to your channel." / "Once the claim is resolved, your Short will
//   be viewable and eligible for monetization." / "use a wider aspect ratio such as 16:9 for long-form videos".
// Meme (só na fala e no texto animado, sem imagem/personagem): "nem os Power Rangers salvam".
// Tudo é interface recriada em motion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
export const S3M_SLUG = "aprendayoutube/episodes/shorts-reels-tiktok/yt-short-2026-11-26-1700-shorts-3-minutos";
export const S3M_FPS = 30;
const SCP_SLUG = S3M_SLUG, SCP_FPS = S3M_FPS;
const MUSIC = "aprendayoutube/music/Coding_at_Night.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = SCP_FPS;
const f = (p) => staticFile(`${SCP_SLUG}/${p}`);
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

export const calculateShorts3MinMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

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

// ---------- 0: gancho (Short só pode ter 60 s? MITO!) ----------
const Hook = ({ fr }) => {
  const dSes = at(4), dMito = at(6);
  const flash = [0, dSes, dMito].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const mito = fr >= dMito;
  const sec = mito ? 60 + (fr - dMito) * 2 : Math.min(59, Math.floor(59 * lin(fr, 0, dMito - 2)));
  const fall = lin(fr, dMito, dMito + 14);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: mito ? `rgba(255,92,122,${Math.min(0.45, flash)})` : PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={mito ? dMito : fr >= dSes ? dSes : 0} size={mito ? 170 : 150} top={120} rot={mito ? 4 : -2} bg={mito ? RED : PINK}>{mito ? "MITO!" : fr >= dSes ? "60 s?" : "Só 60 s?"}</Big>
      <div style={{ ...center, top: 390, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dMito, 16)}px)` }}>
        <div style={{ position: "relative" }}>
          <Tela fr={fr} t={fmt(Math.min(sec, 180))} prog={Math.min(1, sec / 60)} c={mito ? GREEN : sec >= 50 ? RED : PINK} glow label={mito ? "e passou! 😳" : "Short"} />
          <div style={{ position: "absolute", left: -110, right: -110, top: 640, height: 8, borderRadius: 4, background: RED, transform: `translateY(${fall * 500}px) rotate(${fall * 25}deg)`, opacity: 1 - fall }} />
          <div style={{ position: "absolute", right: -230, top: 600, opacity: 1 - fall }}><Pill c={RED} bg="rgba(255,92,122,0.15)" size={36}>limite?</Pill></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: até 3 min + pegadinha + 3 regras ----------
const Pegadinha = ({ fr }) => {
  const d0 = at(7), dTres = at(10), dPeg = at(15), dBlo = at(17), dMun = at(21), dRegras = at(23), dCen = at(27);
  const sec = 60 + Math.floor(120 * ease(lin(fr, dTres - 4, dTres + 26)));
  const regras = fr >= dRegras;
  const lockP = fr >= dBlo ? pop(fr, dBlo, 9) : 0;
  return (
    <AbsoluteFill>
      <Big fr={fr} d={regras ? dRegras : fr >= dPeg ? dPeg : fr >= dTres ? dTres : d0} size={140} top={150} rot={-2} bg={regras ? VIOLET : fr >= dPeg ? AMBER : GREEN}>{regras ? "3 regras" : fr >= dPeg ? "pegadinha 👀" : fr >= dTres ? "até 3 min!" : "Pode…"}</Big>
      <div style={{ ...center, top: 420 }}>
        {!regras ? <>
          <div style={{ display: "flex", alignItems: "center", gap: 50, transform: `translateX(${shake(fr, dPeg, 14)}px)` }}>
            <Tela fr={fr} w={380} h={675} t={fmt(sec)} prog={sec / 180} c={fr >= dBlo ? RED : GREEN} glow label={fr >= dBlo ? "bloqueado" : "Short ✓"} lock={lockP} />
            {fr >= dBlo && <In fr={fr} d={dMun - 4} dx={80} dy={0}><Globo fr={fr} size={300} locked /></In>}
          </div>
          <div style={{ marginTop: 40, height: 100 }}>{fr >= 135 && <In fr={fr} d={135}><Pill c={PINK} bg={PINKA(0.15)} size={44}>3 regras · a 3ª bloqueia 🚫</Pill></In>}</div>
        </> : <>
          <div style={{ marginTop: 40, display: "flex", gap: 34 }}>
            {[0, 1, 2].map((k) => {
              const d = dRegras + k * 5;
              const hot = k === 2;
              if (fr < d) return <div key={k} style={{ width: 260 }} />;
              const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
              return (
                <div key={k} style={{ width: 260, height: 340, borderRadius: 36, background: hot ? "rgba(255,92,122,0.2)" : WIN, border: `4px solid ${hot ? RED : VIOLET}`, transform: `perspective(800px) rotateY(${flip}deg) translateX(${hot ? shake(fr, d + 8, 10) : 0}px) scale(${hot ? 1.08 : 0.95})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 140, color: "#fff" }}>{k + 1}</span>
                  <span style={{ fontFamily: MONO, fontSize: 34, color: hot ? "#fff" : GREY }}>{["⏱️ tempo", "📐 formato", "🚫 bloqueio"][k]}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 60, height: 110 }}>{fr >= dCen - 6 && <In fr={fr} d={dCen - 6}><Pill c={CYAN} bg="rgba(94,234,212,0.12)" size={46}>📘 {typed("Central de Ajuda do YouTube", fr, dCen - 6, at(31))}</Pill></In>}</div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: Nº 1 até 3 minutos, desde 15/10/2024 ----------
const Item1 = ({ fr }) => {
  const d0 = at(32), dAte = at(34), dMin = at(36), dVale = at(37), dEnv = at(40), dQui = at(42), dOut = at(44), dAno = at(46), dFim = at(51);
  const sec = Math.floor(180 * ease(lin(fr, dAte, dMin + 12)));
  const cal = fr >= dVale;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="⏱️" t="Até 3 minutos" sub="por Short" />
      <div style={{ ...center, top: 520 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `scale(${cal ? 0.8 : 1})`, transition: "none" }}>
          <Digital txt={fmt(sec)} size={190} glow c={sec >= 180 ? GREEN : "#fff"} />
        </div>
        <div style={{ marginTop: 30, width: 900, position: "relative" }}>
          <Bar w={900} v={sec / 180} c={sec >= 180 ? GREEN : PINK} glow />
          {["1:00", "2:00", "3:00"].map((m, k) => <div key={m} style={{ position: "absolute", left: `${(k + 1) * 33.3 - 4}%`, top: 74, fontFamily: MONO, fontSize: 30, color: sec >= (k + 1) * 60 ? "#fff" : GREY }}>{m}</div>)}
        </div>
        <div style={{ marginTop: 100, height: 360 }}>
          {cal && <In fr={fr} d={dVale} dy={80}>
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <div style={{ width: 300, borderRadius: 30, overflow: "hidden", background: WIN, border: `3px solid ${VIOLET}`, textAlign: "center", boxShadow: `0 0 50px rgba(180,140,255,0.3)` }}>
                <div style={{ background: RED, fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", padding: "10px 0" }}>{fr >= dOut ? "OUT" : "···"}</div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1.15 }}>{fr >= dQui ? "15" : String((Math.floor(fr / 2) % 28) + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: fr >= dAno ? AMBER : GREY, paddingBottom: 14 }}>{fr >= dAno ? "2024" : "····"}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {fr >= dEnv && <In fr={fr} d={dEnv} dx={60} dy={0}><Pill c={CYAN} bg="rgba(94,234,212,0.12)" size={42}>⬆️ enviado</Pill></In>}
                {fr >= dFim && <In fr={fr} d={dFim} dx={60} dy={0}><Pill c={GREEN} size={42}>daí pra frente ✓</Pill></In>}
              </div>
            </div>
          </In>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: Nº 2 vertical ou quadrado; 16:9 vira longo ----------
const Item2 = ({ fr }) => {
  const d0 = at(52), dVer = at(54), dQua = at(56), dDei = at(57), dDez = at(60), dVira = at(63), dLon = at(65);
  const k1 = ease(lin(fr, dQua - 2, dQua + 8)), k2 = ease(lin(fr, dDei, dDei + 12));
  const w = interpolate(k1, [0, 1], [380, 560]) * (1 - k2) + 900 * k2;
  const h = interpolate(k1, [0, 1], [675, 560]) * (1 - k2) + 506 * k2;
  const longo = fr >= dVira;
  const lab = fr >= dDez ? "16:9" : fr >= dDei ? "deitado…" : fr >= dQua ? "1:1 ✓ Short" : "9:16 ✓ Short";
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="📐" t="Vertical ou quadrado" sub="9:16 ou 1:1" />
      <div style={{ ...center, top: 520, height: 760, justifyContent: "center" }}>
        <div style={{ transform: `translateX(${shake(fr, dVira, 14)}px) rotate(${(1 - k2) * 0 + Math.sin(fr / 6) * (k2 > 0 && k2 < 1 ? 6 : 0)}deg)` }}>
          <Tela fr={fr} w={w} h={h} t={longo ? "▶ 12:40" : fr >= dVer ? "▶" : ""} prog={lin(fr, d0, dLon + 20)} c={fr >= dDei ? RED : GREEN} glow label={lab} />
        </div>
      </div>
      <div style={{ ...center, top: 1180 }}>{longo && <Stamp fr={fr} d={dVira} c={RED} rot={-5} size={96}>VÍDEO LONGO</Stamp>}</div>
    </AbsoluteFill>
  );
};

// ---------- 4: Nº 3 a pegadinha (> 1 min + Content ID = bloqueado) ----------
const Item3 = ({ fr }) => {
  const d0 = at(66), dPas = at(70), dMin = at(73), dRei = at(76), dCid = at(78), dBlo = at(80), dMun = at(82), dNin = at(84), dRec = at(87), dMon = at(89), dNem = at(90), dPow = at(92), dSal = at(94);
  const sec = fr < dPas ? 45 + Math.floor(14 * lin(fr, d0, dPas)) : 59 + Math.floor(6 * lin(fr, dPas, dMin + 10));
  const passou = sec > 60;
  const lista = fr >= dNin;
  const rangers = fr >= dNem;
  const cores = [RED, "#3b82f6", AMBER, PINK, GREEN];
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="🚫" t="A pegadinha" sub="+ de 1 min com Content ID" />
      <div style={{ ...center, top: 500 }}>
        {!lista ? <>
          <div style={{ display: "flex", alignItems: "center", gap: 40, transform: `translateX(${shake(fr, dBlo, 16)}px)` }}>
            {fr < dBlo ? <Digital txt={fmt(sec)} size={170} glow c={passou ? AMBER : "#fff"} /> : <Globo fr={fr} size={280} locked />}
            {passou && fr < dBlo && <Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={44}>+ de 1 min</Pill>}
          </div>
          <div style={{ marginTop: 50, height: 160 }}>
            {fr >= dRei && <In fr={fr} d={dRei} dy={-60}>
              <div style={{ width: 900, padding: "24px 30px", borderRadius: 26, background: "rgba(255,92,122,0.14)", border: `3px solid ${RED}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24 }}>
                <span style={{ fontSize: 64 }}>⚠️</span>
                <div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>Reivindicação {fr >= dCid ? "do Content ID" : "…"}</div>
                  <div style={{ fontFamily: MONO, fontSize: 30, color: RED, marginTop: 6 }}>status: ativa</div>
                </div>
              </div>
            </In>}
          </div>
          <div style={{ marginTop: 30, height: 160 }}>{fr >= dBlo && <Stamp fr={fr} d={dBlo} c={RED} rot={-5} size={100}>{fr >= dMun ? "NO MUNDO TODO" : "BLOQUEADO"}</Stamp>}</div>
        </> : <>
          {!rangers ? <>
            <Linha fr={fr} d={dNin} icon="▶" t="ninguém assiste" x="❌" />
            <Linha fr={fr} d={dRec} icon="📈" t="não recomenda" x="❌" />
            <Linha fr={fr} d={dMon} icon="💰" t="não monetiza" x="❌" />
          </> : <>
            <div style={{ display: "flex", gap: 30, marginTop: 60 }}>
              {cores.map((c, k) => {
                const d = dNem + k * 3;
                if (fr < d) return <div key={k} style={{ width: 150 }} />;
                const drop = fr >= dSal ? ease(lin(fr, dSal + k * 2, dSal + k * 2 + 14)) : 0;
                return <div key={k} style={{ width: 150, height: 150, borderRadius: 75, background: drop > 0.3 ? "rgba(140,136,170,0.4)" : c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, transform: `scale(${pop(fr, d, 9)}) translateY(${drop * 220}px) rotate(${drop * 40}deg)`, boxShadow: drop > 0.3 ? "none" : `0 0 40px ${c}` }}>⚡</div>;
              })}
            </div>
            <div style={{ marginTop: 300 }}>{fr >= dPow && <In fr={fr} d={dPow}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={52}>{fr >= dSal ? "nem eles salvam 😅" : "hora de morfar?"}</Pill></In>}</div>
          </>}
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: boa notícia (sem penalidade; resolveu, volta) ----------
const Boa = ({ fr }) => {
  const d0 = at(95), dCan = at(99), dPen = at(102), dRes = at(103), dVol = at(108);
  const res = fr >= dRes, volta = fr >= dVol;
  return (
    <AbsoluteFill>
      <Big fr={fr} d={res ? dRes : d0} size={130} top={150} rot={-2} bg={GREEN}>{res ? "Resolveu?" : "Boa notícia!"}</Big>
      <div style={{ ...center, top: 430 }}>
        {!res ? <>
          <div style={{ width: 920, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dPen ? GREEN : LINE}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 28, opacity: lin(fr, dCan - 6, dCan) }}>
            <div style={{ width: 130, height: 130, borderRadius: 65, background: "linear-gradient(135deg, #7c3aed, #db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>📺</div>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>Seu canal</div>
              {fr >= dPen - 4 && <div style={{ marginTop: 12 }}><Pill c={GREEN} size={40} style={{ transform: `scale(${pop(fr, dPen - 4, 9)})` }}>✓ sem penalidade</Pill></div>}
            </div>
          </div>
          <div style={{ marginTop: 60, display: "flex", gap: 24 }}>
            {["strike?", "aviso?", "punição?"].map((t, k) => <In key={t} fr={fr} d={d0 + 6 + k * 5}><Chip t={t} c={RED} off={fr >= dPen} size={40} /></In>)}
          </div>
        </> : <>
          <div style={{ width: 900, padding: "24px 30px", borderRadius: 26, background: "rgba(52,211,153,0.14)", border: `3px solid ${GREEN}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24, transform: `scale(${pop(fr, dRes, 10)})` }}>
            <span style={{ fontSize: 64 }}>✅</span>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>Reivindicação resolvida</div>
          </div>
          <div style={{ marginTop: 30 }}><Bar w={900} h={40} v={lin(fr, dRes, dVol)} c={GREEN} glow /></div>
          <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 50 }}>
            <Tela fr={fr} w={340} h={604} t={volta ? "▶" : ""} lock={volta ? 0 : Math.max(0.01, 1 - 0.6 * lin(fr, dRes + 6, dVol))} prog={volta ? lin(fr, dVol, dVol + 30) : 0} c={volta ? GREEN : RED} glow={volta} label={volta ? "no ar ✓" : "bloqueado"} />
            {volta && <In fr={fr} d={dVol} dx={60} dy={0}><Globo fr={fr} size={260} ok /></In>}
          </div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(109), dTres = at(110), dTes = at(114), dLon = at(118);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 80, color: "#fff", whiteSpace: "nowrap" }}>{typed("TRÊS ⏱️", fr, dTres, dTres + 10)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 50 }}>
          <Tela fr={fr} w={300} h={533} t={fmt(Math.floor(180 * ease(lin(fr, dTes, dLon + 15))))} prog={lin(fr, dTes, dLon + 15)} c={GREEN} glow label="Short longo" />
        </div>
        {fr >= dTres && Array.from({ length: 12 }, (_, k) => { const t0 = dTres + k * 4; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 360 * Math.sin(k * 2.1), top: 1000 - t * 420, fontSize: 60, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "💬" : "⏱️"}</div>; })}
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
const KEY = new Set(["mito", "60s", "3min", "3", "pegadinha", "bloqueia", "bloqueado", "mundo", "regras", "central", "15/10/2024", "vertical", "quadrado", "deitado", "169", "longo", "1min", "content", "id", "power", "rangers", "penalidade", "volta", "comenta", "tres"]);
// números falados viram forma escrita na legenda
const FRASES = [
  [["sessenta", "segundos"], "60 s"],
  [["numero", "um"], "Nº 1"], [["numero", "dois"], "Nº 2"], [["numero", "tres"], "Nº 3"],
  [["tres", "minutos"], "3 min"],
  [["quinze", "de", "outubro", "de", "dois", "mil", "e", "vinte", "e", "quatro"], "15/10/2024"],
  [["dezesseis", "por", "nove"], "16:9"],
  [["um", "minuto"], "1 min"],
  [["tres"], "3"],
];

export const ShortShorts3Min = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(7), at(32), at(52), at(66), at(95), at(109), end];
  const scenes = [Hook, Pegadinha, Item1, Item2, Item3, Boa, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(7)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(69)} b={at(76)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(109)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.45, 15)}
      {S(at(4), "pop", 0.45, 12)}
      {S(at(6), "error", 0.55, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(10), "ding", 0.45)}{S(135, "pop", 0.4, 15)}
      {S(at(15), "error", 0.4, 15)}
      {S(at(17), "pop", 0.45, 15)}
      {[at(23), at(23) + 5, at(23) + 10].map((b) => S(b, "pop", 0.35, 15))}
      {S(at(34), "riser", 0.3, 40)}{S(at(36) + 12, "ding", 0.45)}
      {S(at(37), "whoosh", 0.35)}{S(at(42), "pop", 0.4, 15)}
      {S(at(56), "pop", 0.4, 15)}{S(at(57), "whoosh", 0.4)}
      {S(at(63), "error", 0.5, 15)}
      {S(at(73), "pop", 0.4, 15)}
      {S(at(76), "error", 0.4, 15)}
      {S(at(80), "error", 0.55, 15)}
      {[at(84), at(87), at(89)].map((b) => S(b + 4, "pop", 0.4, 15))}
      {[0, 1, 2, 3, 4].map((k) => S(at(90) + k * 3, "pop", 0.3, 12))}
      {S(at(94), "error", 0.35, 15)}
      {S(at(95), "ding", 0.45)}
      {S(at(103), "ding", 0.4)}{S(at(108), "coin", 0.3, 30)}
      {S(at(110), "pop", 0.4, 15)}
    </AbsoluteFill>
  );
};

export const CapaShorts3Min = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Short só 60 s?</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 130, color: "#fff", background: RED, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>é MITO</div>
    </div>
    <div style={{ position: "absolute", top: 760, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <Tela fr={10} w={360} h={640} t="3:00" prog={1} c={GREEN} glow label="Short ✓" />
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>Mito <span style={{ color: RED }}>vs.</span> Realidade</div>
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

