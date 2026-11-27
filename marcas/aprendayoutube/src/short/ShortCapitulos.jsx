import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 26/11/2026 10:00 — Mito vs. Realidade: "é só colar os minutos na descrição".
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 26/11/2026):
// - support.google.com/youtube/answer/9884579 (en e pt-BR, "Capítulos de vídeo"): "Make sure that the first timestamp
//   you list starts with 00:00." / "Your video should have at least three timestamps listed in ascending order." /
//   "The minimum length for video chapters is 10 seconds." / "If you don't yet have access to chapters, apply for access
//   to Advanced features." / "If the channel has any active strikes, or if the content may be inappropriate to some
//   viewers, the video chapters feature won't be available." Caminho: Studio → Conteúdo → vídeo → Descrição → SALVAR.
// Meme (só na fala e no texto animado, sem imagem do personagem): "mais rápido que o Flash".
// Tudo é interface recriada em motion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
// Os títulos/tempos de capítulo na tela são exemplo ilustrativo, não dado de canal.
export const SCP_SLUG = "aprendayoutube/episodes/shorts-reels-tiktok/yt-short-2026-11-26-1000-capitulos";
export const SCP_FPS = 30;
const MUSIC = "aprendayoutube/music/CuriousFocus.mp3";
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

export const calculateCapitulosMetadata = async () => {
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

// ---------- 0: gancho (0 -> "Mito") ----------
const Hook = ({ fr }) => {
  const dFal = at(4), dZero = at(6);
  const flash = [0, dFal, dZero].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const zero = fr >= dZero;
  const lines = [
    { t: zero ? (fr >= dZero + 6 ? "00:00" : "0:00") : "0:05", title: "Intro", off: fr >= dFal && fr < dZero + 6, c: zero && fr >= dZero + 6 ? "rgba(52,211,153,0.45)" : undefined },
    { t: "01:30", title: "O teste", d: 4 },
    { t: "03:10", title: "Resultado", d: 9 },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: fr >= dFal && fr < dZero ? `rgba(255,92,122,${Math.min(0.45, flash)})` : PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={zero ? dZero : fr >= dFal ? dFal : fr >= at(2) ? at(2) : 0} size={zero ? 150 : 140} top={120} rot={zero ? 3 : -2} bg={zero ? PINK : fr >= dFal ? RED : PINK}>{zero ? "um ZERO!" : fr >= dFal ? "Faltou…" : fr >= at(2) ? "sumiram?" : "Capítulos?"}</Big>
      <div style={{ ...center, top: 360, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dFal, 14)}px)` }}>
        <Player fr={fr} prog={0.05 + fr / 300} glow={!zero} label={zero ? "capítulos ✓" : "sem capítulos 😩"}
          segs={fr >= dZero + 8 ? [{ w: 0.3, label: "Intro" }, { w: 0.4, label: "O teste" }, { w: 0.3, label: "Resultado" }] : null} />
        <Descricao fr={fr} lines={lines} style={{ marginTop: 34 }} glow={fr >= dFal} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: mito x realidade (Mito ... todo mundo) ----------
const Mito = ({ fr }) => {
  const d0 = at(7), dCol = at(10), dMin = at(12), dReal = at(15), dTres = at(19), dTer = at(23), dEng = at(24);
  const real = fr >= dReal;
  return (
    <AbsoluteFill>
      <Big fr={fr} d={real ? dReal : d0} size={150} top={150} rot={-2} bg={real ? GREEN : AMBER}>{real ? "Realidade:" : "Mito?"}</Big>
      <div style={{ ...center, top: 420 }}>
        <div style={{ width: 960, padding: "26px 34px", borderRadius: 30, background: WIN, border: `3px solid ${real ? RED : AMBER}`, boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 42, color: "#fff", whiteSpace: "nowrap", textDecoration: real ? "line-through" : "none", textDecorationColor: RED }}>“{typed("é só colar os minutos", fr, d0 + 2, at(13))}{fr < at(14) ? blink(fr) : "”"}</div>
          <div style={{ fontSize: 64, transform: `rotate(${real ? 0 : Math.sin(fr / 4) * 10}deg)` }}>{real ? "❌" : "📋"}</div>
        </div>
        {!real && <div style={{ marginTop: 40, position: "relative" }}>
          {fr >= dCol && <div style={{ position: "absolute", right: 30, top: -24, zIndex: 3 }}><Pill c={PINK} bg={PINKA(0.2)} size={40} style={{ transform: `scale(${pop(fr, dCol, 9)})` }}>Ctrl + V</Pill></div>}
          <Descricao fr={fr} lines={[{ t: "2:10", title: "parte boa", d: dCol + 2 }, { t: "0:40", title: "começo", d: dMin }, { t: "5:00", title: "fim", d: dMin + 5 }]} glow={fr >= dCol} />
        </div>}
        {!real && fr >= 120 && <div style={{ marginTop: 40 }}><In fr={fr} d={120}><Pill c={PINK} bg={PINKA(0.15)} size={44}>3 regras · a 3ª engana 👀</Pill></In></div>}
        {real && <div style={{ marginTop: 60, display: "flex", gap: 34 }}>
          {[0, 1, 2].map((k) => {
            const d = [dTres, dTres + 5, dTer][k];
            const hot = k === 2 && fr >= dTer;
            if (fr < d) return <div key={k} style={{ width: 260 }} />;
            const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
            return (
              <div key={k} style={{ width: 260, height: 340, borderRadius: 36, background: hot ? "rgba(255,92,122,0.2)" : WIN, border: `4px solid ${hot ? RED : VIOLET}`, transform: `perspective(800px) rotateY(${flip}deg) translateX(${hot ? shake(fr, dEng, 12) : 0}px) scale(${hot ? 1.1 : 0.95})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: `0 0 50px ${hot ? "rgba(255,92,122,0.5)" : "rgba(180,140,255,0.2)"}` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 140, color: "#fff" }}>{hot && fr >= dEng ? "👀" : k + 1}</span>
                <span style={{ fontFamily: MONO, fontSize: 34, color: hot ? "#fff" : GREY }}>{hot ? (fr >= dEng ? "engana!" : "nº 3") : "regra"}</span>
              </div>
            );
          })}
        </div>}
        {real && fr < dTres && <div style={{ marginTop: -280, position: "relative", zIndex: 6 }}><Stamp fr={fr} d={at(16)} c={GREEN} rot={-4} size={120}>{fr >= at(18) ? "3 regras" : "YouTube:"}</Stamp></div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: Nº 1 começa em 00:00 (Número um ... Já era) ----------
const Item1 = ({ fr }) => {
  const d0 = at(27), dPri = at(30), dTem = at(32), dZ1 = at(35), dDp = at(37), dZ2 = at(39), dCom = at(41), dCin = at(43), dJa = at(44);
  const rnd = (k) => String((Math.floor(fr / 3) * (7 + k * 3) + k * 5) % (k === 2 ? 6 : 10));
  const txt = fr < dZ1 ? `${rnd(0)}${rnd(1)}:${rnd(2)}${rnd(3)}` : fr < dZ2 ? `00:${rnd(2)}${rnd(3)}` : "00:00";
  const colon = fr >= dDp;
  const ok = fr >= dZ2;
  const bad = fr >= dCom;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="⏱️" t="Começa em 00:00" sub="a primeira marcação" />
      <div style={{ ...center, top: 520 }}>
        {!bad ? <>
          <div style={{ transform: `scale(${fr >= dTem ? 1 + 0.08 * pop(fr, dTem, 8) * Math.exp(-(fr - dTem) / 10) : 1})` }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 230, color: ok ? GREEN : "#fff", background: WIN, border: `4px solid ${ok ? GREEN : PINK}`, borderRadius: 40, padding: "10px 60px", boxShadow: `0 0 70px ${ok ? "rgba(52,211,153,0.45)" : PINKA(0.45)}`, letterSpacing: 6 }}>
              {txt.split("").map((ch, k) => <span key={k} style={{ display: "inline-block", opacity: k === 2 ? (colon ? 1 : 0.25) : 1, transform: `translateY(${(k < 2 && fr >= dZ1 && fr < dZ1 + 6) || (k > 2 && fr >= dZ2 && fr < dZ2 + 6) ? -20 : 0}px)` }}>{ch}</span>)}
            </div>
          </div>
          <div style={{ marginTop: 40, height: 100, display: "flex", gap: 20 }}>
            {fr >= dPri && <In fr={fr} d={dPri}><Pill c={VIOLET} bg="rgba(180,140,255,0.14)" size={40}>1ª marcação da lista</Pill></In>}
            {ok && <In fr={fr} d={dZ2}><Pill c={GREEN} size={40}>✓ certo</Pill></In>}
          </div>
          <div style={{ marginTop: 20 }}><Player fr={fr} w={900} prog={lin(fr, d0, dCom)} segs={ok ? [{ w: 0.3, label: "Intro", c: GREEN }, { w: 0.4, label: "O teste" }, { w: 0.3, label: "Resultado" }] : null} /></div>
        </> : <>
          <Descricao fr={fr} lines={[{ t: "0:05", title: "Intro", off: fr >= dCin, d: dCom }, { t: "01:30", title: "O teste", d: dCom + 3 }, { t: "03:10", title: "Resultado", d: dCom + 6 }]} glow />
          <div style={{ marginTop: 40, transform: `translateX(${shake(fr, dJa, 14)}px)` }}>
            <Player fr={fr} w={900} prog={0.4} label={fr >= dJa ? "sem capítulos 😩" : undefined} />
          </div>
          <div style={{ marginTop: -330, height: 150, position: "relative", zIndex: 6 }}>{fr >= dJa && <Stamp fr={fr} d={dJa} c={RED} rot={-6} size={100}>JÁ ERA!</Stamp>}</div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: Nº 2 três marcações em ordem (Número dois ... nada feito) ----------
const Item2 = ({ fr }) => {
  const d0 = at(46), dMin = at(49), dTres = at(50), dOrd = at(53), dCre = at(54), dCom = at(55), dDuas = at(56), dNada = at(57);
  const two = fr >= dDuas;
  // em "ordem": a linha fora de ordem troca de lugar
  const sw = ease(lin(fr, dOrd, dCre + 8));
  const L = [
    { key: "a", t: "00:00", title: "Intro", d: dMin },
    { key: "b", t: "03:10", title: "Resultado", d: dTres + 4, dy: sw * 72, off: fr >= dOrd && sw < 1, gone: two },
    { key: "c", t: "01:30", title: "O teste", d: dTres + 8, dy: -sw * 72 },
  ];
  const n = two ? 2 : fr < dMin ? 0 : fr < dTres ? 1 : Math.min(3, 1 + Math.floor((fr - dTres) / 4));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="📑" t="3 marcações ou +" sub="em ordem crescente" />
      <div style={{ ...center, top: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 34 }}>
          <Digital txt={`${n}/3`} size={120} glow c={two ? RED : n >= 3 ? GREEN : "#fff"} />
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: two ? RED : BODY }}>{two ? "faltou 1" : fr >= dMin ? "no mínimo" : "marcações"}</div>
          {fr >= dOrd && !two && <div style={{ fontSize: 90, transform: `translateY(${-Math.abs(Math.sin(fr / 4)) * 20}px)` }}>⬆️</div>}
        </div>
        <Descricao fr={fr} lines={L} glow={!two} />
        <div style={{ marginTop: 40, transform: `translateX(${shake(fr, dNada, 14)}px)` }}>
          <Player fr={fr} w={900} prog={lin(fr, d0, dNada + 20)} segs={n >= 3 && sw >= 1 && !two ? [{ w: 0.3, label: "Intro" }, { w: 0.4, label: "O teste" }, { w: 0.3, label: "Resultado" }] : null} label={two ? "sem capítulos 😩" : undefined} />
        </div>
        <div style={{ marginTop: -330, height: 150, position: "relative", zIndex: 6 }}>{fr >= dNada && <Stamp fr={fr} d={dNada} c={RED} rot={5} size={90}>NADA FEITO</Stamp>}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: Nº 3 mínimo de 10 s (Número três ... invisível) ----------
const Item3 = ({ fr }) => {
  const d0 = at(59), dCada = at(61), dDez = at(66), dSeg = at(67), dCap3 = at(68), dTres = at(70), dMais = at(72), dFla = at(76), dInv = at(78);
  const secs = fr < dCada ? 0 : Math.min(10, Math.floor(10 * lin(fr, dCada, dDez + 4)));
  const ok = secs >= 10;
  const tiny = fr >= dCap3;
  const zip = lin(fr, dFla - 4, dFla + 10);
  const inv = fr >= dInv;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="⏳" t="Mínimo de 10 s" sub="por capítulo" />
      <div style={{ ...center, top: 500 }}>
        {!tiny ? <>
          <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
            <div style={{ fontSize: 130, transform: `rotate(${Math.sin(fr / 2) * 10}deg)` }}>⏱️</div>
            <Digital txt={`${String(secs).padStart(2, "0")} s`} size={170} glow c={ok ? GREEN : "#fff"} />
          </div>
          <div style={{ marginTop: 40, width: 900 }}><Bar w={900} v={secs / 10} c={ok ? GREEN : PINK} glow /></div>
          <div style={{ marginTop: 40, height: 110 }}>{ok && <In fr={fr} d={dSeg}><Pill c={GREEN} size={46}>✓ capítulo válido</Pill></In>}</div>
        </> : <>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Digital txt="03 s" size={150} glow c={RED} />
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: RED }}>{fr >= dTres ? "< 10 s" : "capítulo"}</div>
          </div>
          <div style={{ marginTop: 50, position: "relative" }}>
            <Player fr={fr} w={900} prog={0.55} segs={[{ w: 0.32, label: "Intro" }, { w: inv ? 0.001 : 0.05, label: inv ? "" : "3s", off: !inv, blink: !inv }, { w: 0.33, label: "O teste" }, { w: 0.3, label: "Resultado" }]} />
            {fr >= dFla - 4 && zip < 1 && <div style={{ position: "absolute", top: 120, left: -200 + zip * 1400, fontSize: 160, filter: "drop-shadow(0 0 30px #fbbf24)", transform: "rotate(15deg)" }}>⚡</div>}
            {fr >= dFla - 4 && zip < 1 && <div style={{ position: "absolute", top: 210, left: -900 + zip * 1400, width: 700, height: 14, borderRadius: 7, background: `linear-gradient(90deg, transparent, ${AMBER})` }} />}
          </div>
          <div style={{ marginTop: 40, height: 120 }}>{fr >= dMais && !inv && <In fr={fr} d={dMais}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={48}>⚡ zuuum…</Pill></In>}</div>
          <div style={{ marginTop: -420, height: 150, position: "relative", zIndex: 6 }}>{inv && <Stamp fr={fr} d={dInv} c={RED} rot={-6} size={100}>INVISÍVEL</Stamp>}</div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: e mais (aviso ativo, recursos avançados) ----------
const Extra = ({ fr }) => {
  const d0 = at(79), dCanal = at(81), dAviso = at(83), dSem = at(86), dAc = at(88), dPeca = at(91), dAv = at(93);
  const lock = fr >= dSem;
  const ac = fr >= dAc;
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={140} top={150} rot={-2} bg={ac ? VIOLET : AMBER}>{ac ? "Sem acesso?" : "E mais:"}</Big>
      <div style={{ ...center, top: 430 }}>
        {!ac ? <>
          <div style={{ width: 920, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dAviso ? RED : LINE}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 28, opacity: lin(fr, dCanal - 4, dCanal + 2), transform: `translateX(${shake(fr, dAviso, 12)}px)` }}>
            <div style={{ width: 130, height: 130, borderRadius: 65, background: "linear-gradient(135deg, #7c3aed, #db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>📺</div>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>Seu canal</div>
              {fr >= dAviso && <div style={{ marginTop: 12 }}><Pill c={RED} bg="rgba(255,92,122,0.15)" size={38} style={{ transform: `scale(${pop(fr, dAviso, 9)})` }}>⚠ aviso ativo</Pill></div>}
            </div>
          </div>
          <div style={{ marginTop: 40, position: "relative" }}>
            <Player fr={fr} w={900} prog={0.5} segs={lock ? null : [{ w: 0.3, label: "Intro" }, { w: 0.4, label: "O teste" }, { w: 0.3, label: "Resultado" }]} label={lock ? "🔒 sem capítulos" : undefined} />
          </div>
          <div style={{ marginTop: 40, height: 150 }}>{lock && <Stamp fr={fr} d={dSem} c={RED} rot={-5} size={90}>BLOQUEADO</Stamp>}</div>
        </> : <>
          <Janela title="YouTube Studio › Recursos" w={920} h={620} glow>
            {[["Recursos padrão", "✓ ativos", GREEN], ["Recursos intermediários", "✓ ativos", GREEN], ["Recursos avançados", fr >= dAv ? "solicitado ✓" : "solicitar acesso", fr >= dAv ? GREEN : PINK]].map(([t, b, c], k) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 10px", borderBottom: "2px solid rgba(190,160,255,0.12)", opacity: lin(fr, dAc + k * 4, dAc + k * 4 + 6) }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: k === 2 ? "#fff" : BODY }}>{t}</span>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: k === 2 && fr < dAv ? "#fff" : c, background: k === 2 && fr < dAv ? PINK : "transparent", border: `3px solid ${c}`, padding: "10px 22px", borderRadius: 30, transform: `scale(${k === 2 && fr >= dAv ? pop(fr, dAv, 9) : 1})` }}>{b}</span>
              </div>
            ))}
            <div style={{ marginTop: 30, fontFamily: inter, fontWeight: 800, fontSize: 34, color: BODY }}>📑 capítulos {fr >= dAv ? "a caminho" : "precisam disso"}</div>
            <Cursor x={interpolate(fr, [dAc, dPeca + 6], [300, 700], clamp)} y={interpolate(fr, [dAc, dPeca + 6], [430, 260], clamp)} fr={fr} click={dPeca + 6} />
          </Janela>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: onde fica (Tudo isso ... pronto) ----------
const Onde = ({ fr }) => {
  const d0 = at(95), dDesc = at(98), dStu = at(100), dArr = at(102), dSal = at(105), dPro = at(107);
  const saved = fr >= dSal;
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 260 }}>
        <Janela title="YouTube Studio › Conteúdo › Detalhes" w={960} h={700} glow>
          <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
            {["Conteúdo", "Detalhes"].map((t, k) => <div key={k} style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", background: k === 1 && fr >= dStu ? PINK : "rgba(255,255,255,0.08)", padding: "10px 20px", borderRadius: 30 }}>{t}</div>)}
          </div>
          <Descricao fr={fr} w={900} glow={fr >= dDesc && !saved} lines={[
            { t: typed("00:00", fr, d0, d0 + 8) || " ", title: fr >= d0 + 8 ? "Intro" : "", size: 40, c: saved ? "rgba(52,211,153,0.45)" : undefined },
            { t: "01:30", title: "O teste", size: 40, d: dDesc, c: saved ? "rgba(52,211,153,0.45)" : undefined },
            { t: "03:10", title: "Resultado", size: 40, d: dStu, c: saved ? "rgba(52,211,153,0.45)" : undefined },
          ]} />
          <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", background: saved ? GREEN : PINK, padding: "14px 40px", borderRadius: 30, transform: `scale(${saved ? 0.9 + 0.1 * pop(fr, dSal, 8) : 1 + 0.04 * Math.sin(fr / 4)})`, opacity: lin(fr, dArr - 6, dArr) }}>{saved ? "✓ SALVO" : "SALVAR"}</div>
          </div>
          <Cursor x={interpolate(fr, [dArr, dSal], [300, 780], clamp)} y={interpolate(fr, [dArr, dSal], [300, 590], clamp)} fr={fr} click={dSal} />
        </Janela>
        <div style={{ marginTop: 40 }}>
          <Player fr={fr} w={900} glow={fr >= dPro} prog={fr >= dPro ? lin(fr, dPro, dPro + 40) : 0.05} segs={fr >= dPro ? [{ w: 0.3, label: "Intro", c: GREEN }, { w: 0.4, label: "O teste", c: GREEN }, { w: 0.3, label: "Resultado", c: GREEN }] : null} label={fr >= dPro ? "capítulos ✓" : undefined} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(108), dCap = at(109), dGan = at(115), dInd = at(116);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: "#fff", whiteSpace: "nowrap" }}>{typed("CAPÍTULO 📑", fr, dCap, dCap + 14)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 50 }}>
          <Player fr={fr} w={900} prog={lin(fr, dGan, dGan + 45)} segs={fr >= dGan ? [{ w: 0.3, label: "Intro", c: GREEN }, { w: 0.4, label: "O teste", c: GREEN }, { w: 0.3, label: "Resultado", c: GREEN }] : null} label={fr >= dInd ? "índice ✓" : undefined} glow={fr >= dInd} />
        </div>
        {fr >= dCap && Array.from({ length: 12 }, (_, k) => { const t0 = dCap + k * 5; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 340 * Math.sin(k * 2.1), top: 1000 - t * 420, fontSize: 60, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "💬" : "📑"}</div>; })}
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

const KEY = new Set(["capitulos", "zero", "mito", "realidade", "3", "regras", "terceira", "engana", "00:00", "0000", "era", "5", "minimo", "crescente", "nada", "feito", "10", "3s", "flash", "invisivel", "aviso", "ativo", "avancados", "studio", "salvar", "pronto", "comenta", "capitulo", "indice"]);
// números falados viram forma escrita na legenda
const FRASES = [
  [["zero", "zero", "dois", "pontos", "zero", "zero"], "00:00"],
  [["tres", "segundos"], "3 s"],
  [["dez", "segundos"], "10 s"],
  [["numero", "um"], "Nº 1"], [["numero", "dois"], "Nº 2"], [["numero", "tres"], "Nº 3"],
  [["tres"], "3"], [["cinco"], "5"],
];

export const ShortCapitulos = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(7), at(27), at(46), at(59), at(79), at(95), at(108), end];
  const scenes = [Hook, Mito, Item1, Item2, Item3, Extra, Onde, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(7)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(23)} b={at(27) - 2} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(108)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.45, 15)}
      {S(4, "pop", 0.3, 10)}{S(9, "pop", 0.3, 10)}
      {S(at(4), "error", 0.5, 15)}
      {S(at(6), "ding", 0.5)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(10), "pop", 0.35, 15)}{S(120, "pop", 0.4, 15)}
      {S(at(15), "ding", 0.4)}
      {[at(19), at(19) + 5, at(23)].map((b) => S(b, "pop", 0.4, 15))}
      {S(at(24), "error", 0.4, 15)}
      {S(at(35), "pop", 0.4, 15)}{S(at(39), "ding", 0.45)}
      {S(at(44), "error", 0.5, 15)}
      {[at(50), at(50) + 4, at(50) + 8].map((b) => S(b, "pop", 0.35, 15))}
      {S(at(53), "whoosh", 0.35, 20)}
      {S(at(57), "error", 0.5, 15)}
      {S(at(61), "riser", 0.3, 40)}
      {S(at(66), "ding", 0.45)}
      {S(at(76) - 4, "whoosh", 0.6, 25)}
      {S(at(78), "error", 0.45, 15)}
      {S(at(83), "error", 0.4, 15)}
      {S(at(86), "pop", 0.4, 15)}
      {S(at(91) + 6, "pop", 0.4, 15)}
      {S(at(93), "ding", 0.4)}
      {S(at(105), "pop", 0.4, 15)}
      {S(at(107), "ding", 0.45)}
      {S(at(109), "pop", 0.4, 15)}
      {S(at(116), "coin", 0.3, 30)}
    </AbsoluteFill>
  );
};

export const CapaCapitulos = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Capítulo sumiu?</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 116, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>faltou um zero</div>
    </div>
    <div style={{ position: "absolute", top: 800, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <Player fr={10} w={900} prog={0.45} segs={[{ w: 0.3, label: "Intro", c: GREEN }, { w: 0.4, label: "O teste", c: GREEN }, { w: 0.3, label: "Resultado", c: GREEN }]} />
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: GREEN, background: WIN, border: `4px solid ${GREEN}`, borderRadius: 30, padding: "0 40px" }}>00:00</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff" }}>Mito <span style={{ color: RED }}>vs.</span> Realidade</div>
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

