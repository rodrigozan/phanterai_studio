import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 27/11/2026 17:00 — Mito vs. Realidade: "link no Short não dá clique" (vídeo relacionado).
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 27/11/2026):
// - support.google.com/youtube/answer/13748639 (Sharing links): "To reduce spam and scam attempts, URLs placed in
//   YouTube Shorts comments and Shorts descriptions are non-clickable"; "Related Videos in Shorts link" = clicável.
// - answer/14075157 (Add a related video): Studio > Conteúdo > clique no Short > escolha um vídeo relacionado do seu
//   canal > SALVAR; pode ser Vídeos, Shorts e Lives; só com acesso aos recursos avançados; o vídeo escolhido tem que
//   ser público ou não listado; o espectador vê um link clicável abaixo do identificador (@) do canal.
// Meme só na fala/texto: "Hora de morphar!" (sem imagem/personagem/áudio). Tudo é interface recriada em motion.
export const VRL_SLUG = "phanterai/episodes/shorts-reels-tiktok/yt-short-2026-11-27-1700-video-relacionado";
export const VRL_FPS = 30;
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";
const FPS = VRL_FPS;
const f = (p) => staticFile(`${VRL_SLUG}/${p}`);
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


export const calculateVideoRelacionadoMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças novas ----------
const Avatar = ({ size = 80, icon = "🐾" }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: `linear-gradient(135deg, #7c3aed, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>{icon}</div>
);
// Celular com um Short tocando (recriado). Children = sobreposições no rodapé (canal, link, descrição).
const Phone = ({ fr, w = 560, h = 1000, children, glow, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 60, padding: 16, background: "#0a0716", border: `4px solid ${glow ? PINK : "rgba(190,160,255,0.35)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 ${glow ? 80 : 40}px ${PINKA(glow ? 0.5 : 0.2)}`, boxSizing: "border-box", position: "relative", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", position: "relative", background: "linear-gradient(165deg, hsl(285,60%,34%), hsl(250,70%,12%) 70%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "26%", textAlign: "center", fontSize: 130, transform: `scale(${1 + 0.04 * Math.sin(fr / 6)})` }}>🎬</div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 22, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.2)" }}>
        <div style={{ width: `${(fr % 150) / 1.5}%`, height: "100%", borderRadius: 4, background: "#fff" }} />
      </div>
      <div style={{ position: "absolute", right: 18, top: "42%", display: "flex", flexDirection: "column", gap: 34, fontSize: 52, alignItems: "center" }}>
        <span>👍</span><span>💬</span><span>↗️</span>
      </div>
      <div style={{ position: "absolute", left: 24, right: 110, bottom: 28 }}>{children}</div>
    </div>
  </div>
);
const Handle = ({ glow }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
    <Avatar size={58} />
    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", background: glow ? PINKA(0.5) : "transparent", padding: "2px 10px", borderRadius: 10 }}>@seucanal</span>
    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 24, color: "#000", background: "#fff", padding: "6px 14px", borderRadius: 20 }}>Inscrever-se</span>
  </div>
);
const RelLink = ({ fr, d, glow, w = 400 }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 10);
  return (
    <div style={{ width: w, display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 16, background: glow ? PINK : "rgba(255,255,255,0.16)", border: `3px solid ${glow ? "#fff" : PINK}`, transform: `scale(${0.4 + 0.6 * p})`, transformOrigin: "0 50%", opacity: Math.min(1, p * 1.5), boxShadow: `0 0 ${30 + 20 * Math.sin(fr / 4)}px ${PINKA(0.6)}`, boxSizing: "border-box" }}>
      <span style={{ fontSize: 34 }}>▶️</span>
      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, color: "#fff", whiteSpace: "nowrap" }}>Vídeo completo · 8 min</span>
    </div>
  );
};
const Toggle = ({ on, size = 1 }) => (
  <div style={{ width: 150 * size, height: 80 * size, borderRadius: 40 * size, background: on ? GREEN : "rgba(255,255,255,0.15)", position: "relative", boxShadow: on ? `0 0 40px ${GREEN}` : "none", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 8 * size, left: on ? 78 * size : 8 * size, width: 64 * size, height: 64 * size, borderRadius: 32 * size, background: "#fff" }} />
  </div>
);
const Btn = ({ children, on, c = PINK, size = 44 }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: "#fff", background: on ? GREEN : c, padding: "16px 46px", borderRadius: 18, boxShadow: `0 0 40px ${on ? GREEN : c}` }}>{children}</span>
);

// ---------- 0: gancho (link na descrição não clica) ----------
const Hook = ({ fr }) => {
  const dShort = at(4), dNing = at(5), dCli = at(7);
  const flash = [0, dShort, dCli].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const taps = [0, 14, 30, 44, 58, 72, 86];
  const tap = taps.filter((t) => fr >= t).pop();
  const big = fr >= dCli ? "NÃO CLICA ✕" : fr >= dNing ? "Ninguém…" : "Link no Short?";
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: fr >= dCli ? `rgba(255,92,122,${Math.min(0.45, flash)})` : PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={fr >= dCli ? dCli : fr >= dShort ? dShort : 0} size={fr >= dCli ? 130 : 120} top={60} rot={fr >= dCli ? -3 : -1} bg={fr >= dCli ? RED : PINK}>{big}</Big>
      <div style={{ ...center, top: 290, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dShort, 14) + shake(fr, dCli, 20)}px)` }}>
        <div style={{ position: "relative" }}>
          <Phone fr={fr} w={600} h={1000} glow={fr >= dShort}>
            <Handle />
            <div style={{ fontFamily: inter, fontSize: 30, color: "#fff", marginBottom: 10 }}>Tutorial completo no link 👇</div>
            <div style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: fr >= dCli ? GREY : CYAN, textDecoration: fr >= dCli ? "line-through" : "underline", background: tap != null && fr - tap < 6 ? "rgba(94,234,212,0.25)" : "transparent", padding: "2px 6px", borderRadius: 8 }}>seusite.com/aula</div>
          </Phone>
          <Cursor x={330 + Math.sin(fr / 4) * 12} y={880 + Math.cos(fr / 5) * 6} fr={fr} click={tap} s={1.7} />
          {fr >= dNing && <div style={{ position: "absolute", left: 380, top: 790, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: RED, opacity: 1 - lin(fr, dNing + 18, dNing + 26) }}>nada…</div>}
          <div style={{ position: "absolute", left: -40, right: -40, top: 420, textAlign: "center" }}>{fr >= dCli && <Stamp fr={fr} d={dCli} c={RED} rot={-10} size={96}>NÃO CLICÁVEL</Stamp>}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: é de propósito (spam/golpe) + existe 1 link + passo 3 ----------
const Motivo = ({ fr }) => {
  const d0 = at(8), dProp = at(10), dSpam = at(13), dGolpe = at(15), dMas = at(16), dUm = at(18), dFun = at(21), dPasso = at(24), dTres = at(25), dTrava = at(26);
  const fase = fr >= dPasso ? 2 : fr >= dMas ? 1 : 0;
  const bigTxt = fase === 2 ? (fr >= dTrava ? "o 3 trava 👀" : "3 passos") : fase === 1 ? (fr >= dFun ? "1 link funciona ✅" : "Mas existe…") : fr >= dProp ? "De propósito 🛡️" : "É…";
  const bigD = fase === 2 ? (fr >= dTrava ? dTrava : dPasso) : fase === 1 ? (fr >= dFun ? dFun : dMas) : fr >= dProp ? dProp : d0;
  const bigBg = fase === 2 ? (fr >= dTrava ? RED : VIOLET) : fase === 1 ? (fr >= dFun ? GREEN : PINK) : AMBER;
  const proj = (d, side) => {
    if (fr < d) return null;
    const t = lin(fr, d, d + 10);
    const x = side * (420 - 300 * ease(t)) + (fr > d + 10 ? side * 160 * ease(lin(fr, d + 10, d + 20)) : 0);
    return { x, o: 1 - lin(fr, d + 14, d + 22), hit: fr >= d + 9 && fr < d + 14 };
  };
  const ps = [proj(dSpam, -1), proj(dGolpe, 1)];
  return (
    <AbsoluteFill>
      <Big fr={fr} d={bigD} size={fase === 1 && fr >= dFun ? 110 : 130} top={120} rot={-2} bg={bigBg}>{bigTxt}</Big>
      <div style={{ ...center, top: 420 }}>
        {fase === 0 && <div style={{ position: "relative", width: 1000, height: 700 }}>
          <div style={{ position: "absolute", left: 350, top: 120, fontSize: 300, transform: `scale(${1 + (ps.some((p) => p && p.hit) ? 0.12 : 0)}) rotate(${shake(fr, dSpam + 9, 6) + shake(fr, dGolpe + 9, 6)}deg)`, filter: `drop-shadow(0 0 40px ${PINK})` }}>🛡️</div>
          {ps.map((p, k) => p && <div key={k} style={{ position: "absolute", left: 400 + p.x, top: 260, opacity: p.o }}><Pill c={RED} bg="rgba(255,92,122,0.18)" size={50}>{k ? "🎣 golpe" : "🤖 spam"} ✕</Pill></div>)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 24 }}>
            <In fr={fr} d={dProp}><Chip t="link na descrição" c={RED} off={fr >= dSpam} size={34} /></In>
            <In fr={fr} d={dProp + 6}><Chip t="link no comentário" c={RED} off={fr >= dGolpe} size={34} /></In>
          </div>
        </div>}
        {fase === 1 && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", gap: 22 }}>
            {["descrição", "comentário"].map((t, k) => <In key={t} fr={fr} d={dMas + k * 3}><Pill c={GREY} bg="rgba(255,255,255,0.05)" size={42}>🔗 {t} ✕</Pill></In>)}
          </div>
          {fr >= dUm && <In fr={fr} d={dUm} damping={9}>
            <div style={{ width: 760, padding: "40px 40px", borderRadius: 36, background: WIN, border: `4px solid ${fr >= dFun ? GREEN : PINK}`, boxShadow: `0 0 ${60 + 20 * Math.sin(fr / 4)}px ${fr >= dFun ? GREEN : PINK}`, textAlign: "center" }}>
              <div style={{ fontSize: 140 }}>🔗</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff", marginTop: 10 }}>{fr >= dFun ? "CLICÁVEL ✓" : "???"}</div>
            </div>
          </In>}
        </div>}
        {fase === 2 && <div style={{ marginTop: 60, display: "flex", gap: 34 }}>
          {[0, 1, 2].map((k) => {
            const d = dPasso + k * 4;
            const hot = k === 2 && fr >= dTres;
            if (fr < d) return <div key={k} style={{ width: 260 }} />;
            const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
            return (
              <div key={k} style={{ width: 260, height: 340, borderRadius: 36, background: hot ? "rgba(255,92,122,0.2)" : WIN, border: `4px solid ${hot ? RED : VIOLET}`, transform: `perspective(800px) rotateY(${flip}deg) translateX(${hot ? shake(fr, dTrava, 12) : 0}px) scale(${hot ? 1.08 : 0.95})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 140, color: "#fff" }}>{k + 1}</span>
                <span style={{ fontSize: 60 }}>{["🎛️", "🔗", fr >= dTrava ? "🔒" : "❓"][k]}</span>
              </div>
            );
          })}
        </div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: é o vídeo relacionado (abaixo do @, clicável) ----------
const Relacionado = ({ fr }) => {
  const d0 = at(29), dRel = at(32), dAbx = at(36), dArr = at(38), dEsse = at(41), dCli = at(45);
  const opened = fr >= dCli + 8;
  const big = opened ? "abriu! ✅" : fr >= dArr ? "abaixo do @" : fr >= dRel ? "vídeo RELACIONADO" : "É o…";
  return (
    <AbsoluteFill>
      <Big fr={fr} d={opened ? dCli + 8 : fr >= dArr ? dArr : fr >= dRel ? dRel : d0} size={fr >= dRel && !opened && fr < dArr ? 100 : 120} top={60} rot={-2} bg={opened ? GREEN : fr >= dRel ? PINK : AMBER}>{big}</Big>
      <div style={{ ...center, top: 260 }}>
        <div style={{ position: "relative", transformOrigin: "50% 85%", transform: `scale(${opened ? 1 - 0.35 * ease(lin(fr, dCli + 8, dCli + 18)) : 1 + 0.3 * ease(lin(fr, dAbx, dAbx + 10)) * (1 - ease(lin(fr, dCli + 2, dCli + 10)))}) translateX(${opened ? -260 * ease(lin(fr, dCli + 8, dCli + 18)) : 0}px) rotate(${fr >= dRel && fr < dAbx ? Math.sin((fr - dRel) / 6) * 2 : 0}deg)` }}>
          <Phone fr={fr} w={600} h={1000} glow={fr >= dRel}>
            <Handle glow={fr >= dArr} />
            <div style={{ fontFamily: inter, fontSize: 28, color: BODY, marginBottom: 14 }}>3 truques de título #shorts</div>
            <RelLink fr={fr} d={dRel} glow={fr >= dCli && fr < dCli + 8} />
          </Phone>
          {fr >= dAbx && fr < dCli && <div style={{ position: "absolute", left: 470, top: 760, fontSize: 90, transform: `translateX(${Math.sin(fr / 3) * 14}px) rotate(180deg)`, opacity: lin(fr, dAbx, dAbx + 4) }}>➜</div>}
          {fr >= dEsse && fr < dCli + 12 && <Cursor x={interpolate(fr, [dEsse, dCli], [520, 230], clamp)} y={interpolate(fr, [dEsse, dCli], [1000, 935], clamp)} fr={fr} click={dCli} s={1.7} />}
        </div>
        {opened && <div style={{ position: "absolute", left: 560, top: 300, opacity: lin(fr, dCli + 10, dCli + 16), transform: `translateX(${(1 - ease(lin(fr, dCli + 10, dCli + 20))) * 200}px)` }}>
          <VideoCard fr={fr} w={470} glow />
          <div style={{ marginTop: 18, fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>Vídeo longo ▶</div>
        </div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: Nº 1 Studio > Conteúdo > clica no Short ----------
const MENU = [["📊", "Painel"], ["🎞️", "Conteúdo"], ["📈", "Análises"], ["💬", "Comentários"]];
const ROWS = [["▶", "Vídeo longo de ontem", "Vídeo"], ["📱", "3 truques de título", "Short"], ["📱", "Bastidores do canal", "Short"]];
const Item1 = ({ fr }) => {
  const d0 = at(46), dStu = at(49), dAbre = at(51), dCont = at(52), dCli = at(54), dShort = at(56);
  const sel = fr >= dCont ? 1 : -1;
  const cx = fr < dCont ? interpolate(fr, [dStu, dCont], [700, 210], clamp) : interpolate(fr, [dCont + 4, dCli + 6], [210, 640], clamp);
  const cy = fr < dCont ? interpolate(fr, [dStu, dCont], [700, 290], clamp) : interpolate(fr, [dCont + 4, dCli + 6], [290, 395], clamp);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🎛️" t="Abra o Short" sub="no YouTube Studio" />
      <div style={{ ...center, top: 520 }}>
        {fr >= d0 + 6 && <In fr={fr} d={d0 + 6}><div style={{ position: "relative" }}>
          <Janela title="studio.youtube.com" w={960} h={700} glow={fr >= dStu}>
            <div style={{ display: "flex", gap: 24, height: "100%" }}>
              <div style={{ width: 290, borderRight: "2px solid rgba(190,160,255,0.15)", paddingRight: 16 }}>
                {MENU.map(([ic, t], k) => (
                  <div key={t} style={{ display: "flex", gap: 14, alignItems: "center", padding: "18px 14px", marginBottom: 6, borderRadius: 14, background: k === sel ? PINKA(0.35) : "transparent", border: k === sel ? `2px solid ${PINK}` : "2px solid transparent", fontFamily: inter, fontWeight: 800, fontSize: 32, color: k === sel ? "#fff" : BODY, opacity: fr >= d0 + 8 + k * 3 ? 1 : 0 }}>{ic} {t}</div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                {fr < dCont ? <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY, marginTop: 30 }}>Painel do canal…<div style={{ marginTop: 30 }}><Bar v={lin(fr, dStu, dCont)} c={VIOLET} w={560} h={30} /></div></div>
                  : ROWS.map(([ic, t, tipo], k) => {
                    const d = dCont + 3 + k * 3, hot = k === 1 && fr >= dCli;
                    if (fr < d) return null;
                    const p = pop(fr, d, 12);
                    return (
                      <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 18px", marginBottom: 16, borderRadius: 18, background: hot ? PINKA(0.3) : "rgba(255,255,255,0.05)", border: `3px solid ${hot ? PINK : "rgba(255,255,255,0.1)"}`, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 80}px) scale(${hot ? 1.04 : 1})` }}>
                        <div style={{ width: tipo === "Short" ? 60 : 110, height: tipo === "Short" ? 100 : 62, borderRadius: 10, background: "linear-gradient(135deg, hsl(285,70%,42%), hsl(250,70%,18%))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{ic}</div>
                        <div style={{ flex: 1, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff" }}>{t}</div>
                        <span style={{ fontFamily: MONO, fontSize: 24, color: tipo === "Short" ? PINK : GREY }}>{tipo}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Janela>
          <Cursor x={cx} y={cy} fr={fr} click={fr >= dCli ? dCli + 6 : dCont} s={1.6} />
          {fr >= dShort && <div style={{ position: "absolute", right: -10, top: -40 }}><Stamp fr={fr} d={dShort} c={GREEN} rot={6} size={64}>✓ ABERTO</Stamp></div>}
        </div></In>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: Nº 2 escolhe o vídeo do SEU canal (longo, Short, live) + salvar ----------
const Item2 = ({ fr }) => {
  const d0 = at(57), dEsc = at(59), dRel = at(62), dSeu = at(64), dLongo = at(69), dShort = at(70), dLive = at(72), dSalva = at(73);
  const open = fr >= dEsc + 4;
  const opts = [["🎬", "Vídeo longo", dLongo], ["📱", "Short", dShort], ["🔴", "Live", dLive]];
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🔗" t="Escolha o vídeo" sub="do seu próprio canal" />
      <div style={{ ...center, top: 520 }}>
        {fr >= d0 + 6 && <In fr={fr} d={d0 + 6}>
          <Janela title="Editar Short" w={940} h={720} glow={fr >= dRel}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: BODY, marginBottom: 16 }}>Vídeo relacionado</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px", borderRadius: 18, border: `3px solid ${open ? PINK : LINE}`, background: "rgba(255,255,255,0.05)", fontFamily: inter, fontWeight: 800, fontSize: 36, color: fr >= dSalva ? "#fff" : GREY }}>
              <span>{fr >= dLongo ? "🎬 Vídeo completo · 8 min" : "Selecionar…"}</span><span style={{ transform: `rotate(${open ? 180 : 0}deg)` }}>▾</span>
            </div>
            {open && fr < dSalva && <div style={{ marginTop: 14, borderRadius: 18, border: `2px solid ${LINE}`, background: "rgba(10,6,24,0.9)", padding: "14px 20px" }}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: fr >= dSeu ? PINK : GREY, marginBottom: 12 }}>{fr >= dSeu ? "★ só do SEU canal" : "do seu canal"}</div>
              {opts.map(([ic, t, d]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", marginBottom: 8, borderRadius: 14, background: fr >= d ? "rgba(52,211,153,0.15)" : fr < dLongo && Math.floor((fr - dEsc) / 9) % 3 === opts.findIndex((o) => o[1] === t) ? PINKA(0.25) : "transparent", border: `2px solid ${fr >= d ? GREEN : fr < dLongo && Math.floor((fr - dEsc) / 9) % 3 === opts.findIndex((o) => o[1] === t) ? PINK : "transparent"}`, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>
                  <span>{ic} {t}</span><span style={{ transform: `scale(${pop(fr, d, 8)})` }}>{fr >= d ? "✅" : ""}</span>
                </div>
              ))}
            </div>}
            <div style={{ position: "absolute", right: 30, bottom: 30 }}><Btn on={fr >= dSalva + 4}>{fr >= dSalva + 4 ? "✓ SALVO" : "SALVAR"}</Btn></div>
          </Janela>
        </In>}
        {fr >= dSalva - 6 && <Cursor x={interpolate(fr, [dSalva - 6, dSalva], [500, 790], clamp)} y={interpolate(fr, [dSalva - 6, dSalva], [500, 690], clamp)} fr={fr} click={dSalva} s={1.6} />}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: Nº 3 a trava (recursos avançados) + público/não listado ----------
const Item3 = ({ fr }) => {
  const d0 = at(74), dTrava = at(77), dAv = at(83), dLib = at(84), dVid = at(85), dPub = at(91), dNL = at(93);
  const on = fr >= dLib;
  const vis = fr >= dVid;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon={on ? "🔓" : "🔒"} t="A trava" sub="recursos avançados" />
      <div style={{ ...center, top: 540 }}>
        <div style={{ position: "relative", transform: `translateY(${vis ? -60 * ease(lin(fr, dVid, dVid + 10)) : 0}px) scale(${vis ? 1 - 0.15 * ease(lin(fr, dVid, dVid + 10)) : 1})` }}>
          {fr >= d0 + 6 && <In fr={fr} d={d0 + 6}>
            <div style={{ width: 920, padding: "34px 40px", borderRadius: 32, background: WIN, border: `4px solid ${on ? GREEN : fr >= dTrava ? RED : LINE}`, boxShadow: `0 0 60px ${on ? GREEN : fr >= dTrava ? RED : "transparent"}`, display: "flex", alignItems: "center", gap: 30, transform: `translateX(${shake(fr, dTrava, 14)}px)` }}>
              <span style={{ fontSize: 100, transform: `scale(${on ? pop(fr, dLib, 8) : 1})` }}>{on ? "🔓" : "🔒"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>Recursos avançados</div>
                <div style={{ fontFamily: MONO, fontSize: 30, color: on ? GREEN : RED, marginTop: 8 }}>{on ? "liberado ✓" : fr >= dAv ? "precisa liberar…" : "bloqueado"}</div>
              </div>
              <Toggle on={on} />
            </div>
          </In>}
          {fr >= d0 + 10 && fr < dLib + 6 && <Cursor x={830 + Math.sin(fr / 5) * 6} y={100} fr={fr} click={[dTrava, dTrava + 14, dTrava + 28, dTrava + 42, dAv].filter((t) => fr >= t).pop()} s={1.6} />}
          {fr >= dTrava && fr < dLib && (fr - dTrava) % 14 < 6 && <div style={{ position: "absolute", left: 700, top: -30, fontFamily: inter, fontWeight: 800, fontSize: 60, color: RED }}>✕</div>}
          {fr >= dTrava + 6 && !vis && <div style={{ marginTop: 50, display: "flex", justifyContent: "center" }}><In fr={fr} d={dTrava + 6}><Pill c={on ? GREEN : RED} bg={on ? "rgba(52,211,153,0.15)" : "rgba(255,92,122,0.15)"} size={46}>{on ? "🔗 vídeo relacionado ✓" : "🔗 vídeo relacionado ✕"}</Pill></In></div>}
        </div>
        {vis && <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <In fr={fr} d={dVid}><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: BODY }}>O vídeo escolhido tem que ser:</div></In>
          {[["🌍", "Público", dPub, GREEN], ["🔗", "Não listado", dNL, GREEN], ["🔒", "Privado", dNL + 8, RED]].map(([ic, t, d, c]) => {
            if (fr < d) return <div key={t} style={{ height: 120 }} />;
            const p = pop(fr, d, 11);
            return (
              <div key={t} style={{ width: 760, height: 120, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 36px", boxSizing: "border-box", borderRadius: 26, background: WIN, border: `3px solid ${c}`, opacity: Math.min(1, p * 1.5) * (c === RED ? 0.7 : 1), transform: `translateX(${(1 - p) * 120}px)` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff", textDecoration: c === RED ? "line-through" : "none" }}>{ic} {t}</span>
                <span style={{ fontSize: 60 }}>{c === RED ? "✕" : "✅"}</span>
              </div>
            );
          })}
        </div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: Short vira ponte pro vídeo longo + hora de morphar ----------
const Ponte = ({ fr }) => {
  const d0 = at(95), dPonte = at(99), dLongo = at(102), dHora = at(103), dMor = at(105);
  const prog = ease(lin(fr, dPonte, dLongo + 6));
  const morph = fr >= dHora;
  const cols = [RED, "#3b82f6", AMBER, GREEN, PINK];
  return (
    <AbsoluteFill>
      {morph && <AbsoluteFill style={{ background: `${cols[Math.floor((fr - dHora) / 3) % 5]}`, opacity: 0.25 * (1 - lin(fr, dMor + 6, dMor + 20)) }} />}
      <Big fr={fr} d={morph ? dHora : fr >= dPonte ? dPonte : d0} size={morph ? 88 : 120} top={90} rot={-3} bg={morph ? cols[Math.floor((fr - dHora) / 4) % 5] : fr >= dPonte ? VIOLET : GREEN}>{morph ? "HORA DE MORPHAR ⚡" : fr >= dPonte ? "Short = ponte 🌉" : "Pronto ✅"}</Big>
      <div style={{ ...center, top: 430 }}>
        <div style={{ position: "relative", width: 1000, height: 820 }}>
          <div style={{ position: "absolute", left: 20, top: 80, transform: `scale(${morph ? 1 + 0.05 * Math.sin(fr / 2) : 1})` }}>
            <Phone fr={fr} w={330} h={590} glow><div style={{ transform: "scale(0.6)", transformOrigin: "0 100%" }}><RelLink fr={fr} d={d0} glow w={420} /></div></Phone>
          </div>
          <svg width="1000" height="820" style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M 330 380 Q 520 120 700 330" stroke={PINK} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - prog)} style={{ filter: `drop-shadow(0 0 16px ${PINK})` }} />
          </svg>
          {prog > 0.2 && Array.from({ length: 6 }, (_, k) => {
            const t = ((fr - dPonte) / 24 + k / 6) % 1;
            const x = (1 - t) * (1 - t) * 330 + 2 * (1 - t) * t * 520 + t * t * 700, y = (1 - t) * (1 - t) * 380 + 2 * (1 - t) * t * 120 + t * t * 330;
            return <div key={k} style={{ position: "absolute", left: x - 26, top: y - 26, fontSize: 44 }}>👤</div>;
          })}
          {fr >= dLongo - 4 && <div style={{ position: "absolute", left: 560, top: 340 }}><In fr={fr} d={dLongo - 4} damping={10}>
            <VideoCard fr={fr} w={420} glow={morph} c={morph ? cols[Math.floor((fr - dHora) / 4) % 5] : undefined} />
            <div style={{ marginTop: 16, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", textAlign: "center" }}>vídeo longo 🎬</div>
          </In></div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(106), dLink = at(107), dDesc = at(113);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 260 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 90, color: "#fff", whiteSpace: "nowrap" }}>{typed("LINK 🔗", fr, dLink, dLink + 10)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 60, height: 140 }}>{fr >= dDesc - 6 && <In fr={fr} d={dDesc - 6}><Chip t="link na descrição" c={RED} off size={44} /></In>}</div>
        {fr >= dLink && Array.from({ length: 12 }, (_, k) => { const t0 = dLink + k * 4; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 380 * Math.sin(k * 2.1), top: 1000 - t * 420, fontSize: 60, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "🔗" : "💬"}</div>; })}
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
const KEY = new Set(["link", "short", "clicar", "ninguem", "proposito", "spam", "golpe", "um", "funciona", "tres", "trava", "relacionado", "arroba", "clicar", "studio", "conteudo", "clica", "relacionado", "seu", "longo", "live", "salva", "avancados", "liberados", "publico", "listado", "ponte", "morphar", "comenta", "descricao"]);
// números falados viram forma escrita na legenda
const FRASES = [
  [["numero", "um"], "Nº 1"], [["numero", "dois"], "Nº 2"], [["numero", "tres"], "Nº 3"],
  [["youtube", "studio"], "YouTube Studio"],
  [["nao", "listado"], "não listado"],
  [["tres"], "3"],
];

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

export const ShortVideoRelacionado = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(8), at(29), at(46), at(57), at(74), at(95), at(106), end];
  const scenes = [Hook, Motivo, Relacionado, Item1, Item2, Item3, Ponte, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(77)} b={at(85)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(106)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "pop", 0.5, 12)}
      {S(at(4), "pop", 0.5, 12)}
      {S(at(7), "error", 0.6, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(13) + 9, "error", 0.35, 15)}{S(at(15) + 9, "error", 0.35, 15)}
      {S(at(18), "pop", 0.45, 15)}{S(at(21), "ding", 0.45)}
      {[0, 1, 2].map((k) => S(at(24) + k * 4, "pop", 0.3, 12))}
      {S(at(26), "error", 0.4, 15)}
      {S(at(32), "ding", 0.45)}{S(at(45), "pop", 0.5, 15)}{S(at(45) + 8, "whoosh", 0.35)}
      {S(at(52), "pop", 0.4, 12)}{S(at(54) + 6, "pop", 0.4, 12)}{S(at(56), "ding", 0.35)}
      {S(at(59), "pop", 0.35, 12)}
      {[at(69), at(70), at(72)].map((b) => S(b, "pop", 0.35, 12))}
      {S(at(73), "ding", 0.45)}
      {S(at(77), "error", 0.45, 15)}{S(at(84), "coin", 0.35, 30)}
      {S(at(91), "pop", 0.35, 12)}{S(at(93), "pop", 0.35, 12)}{S(at(93) + 8, "error", 0.3, 15)}
      {S(at(99), "riser", 0.3, 40)}{S(at(103), "whoosh", 0.5)}{S(at(105), "ding", 0.5)}
      {S(at(107), "pop", 0.4, 15)}{S(at(113), "error", 0.3, 15)}
    </AbsoluteFill>
  );
};

export const CapaVideoRelacionado = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>O único link</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 130, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 24 }}>que clica</div>
    </div>
    <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Phone fr={0} w={600} h={760} glow>
        <Handle glow />
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: GREY, textDecoration: "line-through", marginBottom: 12 }}>seusite.com/aula ✕</div>
        <RelLink fr={999} d={0} glow w={420} />
      </Phone>
      <div style={{ marginTop: 30, fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>Mito <span style={{ color: RED }}>vs.</span> Realidade</div>
    </div>
  </AbsoluteFill>
);
