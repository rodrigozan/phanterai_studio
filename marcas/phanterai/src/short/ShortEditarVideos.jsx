import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 26/11/2026 12:00 — "Como editar seus vídeos com o Claude" (video-use, skill para o Claude Code).
// Fatos conferidos na fonte primária (github.com/browser-use/video-use, README e API do GitHub em 26/11/2026; cópia em fontes/):
// - "edit videos with Claude Code. 100% open source", licença MIT, 31.595 estrelas;
// - joga os vídeos brutos numa pasta, conversa com o Claude Code e recebe final.mp4 (em <pasta>/edit/);
// - "The LLM never watches the video. It reads it": transcrição com tempo por palavra; 30.000 quadros x 12 KB de texto;
// - propõe a estratégia e espera o OK; corta muletas ("umm", "uh"), começos errados e silêncio; legenda; correção de cor;
//   fade de áudio de 30 ms em cada corte; confere o vídeo renderizado em cada corte e corrige + renderiza de novo (máx. 3).
// Tudo é interface recriada em motion: nenhum print, nada gerado por IA, nenhum logo oficial, nenhum crédito na tela.
export const SEV_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-26-1200-editar-videos-com-claude";
export const SEV_FPS = 30;
const MUSIC = "phanterai/music/CuriousFocus.mp3";
const SRM_SLUG = SEV_SLUG;
const SRM_FPS = SEV_FPS;
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
export const calculateEditarVideosMetadata = async () => {
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
// trilha de vídeo: segmentos [largura, tipo]; tipo "ok" (fala boa) ou "lixo" (ãh/erro/silêncio)
const Trilha = ({ segs, fr, w = 900, h = 110, cutAt = {}, clean }) => {
  const tot = segs.reduce((s, [x, t, id]) => s + x * (t === "lixo" && cutAt[id] != null ? 1 - ease(lin(fr, cutAt[id], cutAt[id] + 8)) : 1), 0);
  return (
    <div style={{ width: w, height: h, borderRadius: 18, background: "rgba(255,255,255,0.05)", border: `2px solid ${LINE}`, display: "flex", overflow: "hidden", padding: 6, gap: 6, boxSizing: "border-box" }}>
      {segs.map(([x, t, id], k) => {
        const k2 = t === "lixo" && cutAt[id] != null ? 1 - ease(lin(fr, cutAt[id], cutAt[id] + 8)) : 1;
        const ww = ((x * k2) / tot) * (w - 12 - segs.length * 6);
        if (ww < 1) return null;
        const lixo = t === "lixo";
        return <div key={k} style={{ width: ww, flexShrink: 0, borderRadius: 10, background: lixo ? (cutAt[id] != null && fr >= cutAt[id] - 4 ? "rgba(255,92,122,0.55)" : "rgba(160,150,190,0.35)") : clean ? `linear-gradient(90deg,#8a2a86,${PINK})` : "rgba(190,170,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#fff", overflow: "hidden", whiteSpace: "nowrap" }}>{lixo && ww > 60 ? id : ""}</div>;
      })}
    </div>
  );
};
const Olho = ({ fr, d, size = 220 }) => (
  <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontSize: size * 0.7, transform: `scale(${1 + 0.05 * Math.sin(fr / 4)})` }}>👁️</div>
    {fr >= d && <Slash fr={fr} d={d} size={size} />}
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dEd = at(2), dVid = at(4), dSem = at(5), dNada = at(7), dBru = at(8), dCor = at(11), dPro = at(12), dCin = at(14), dQui = at(18), dEsp = at(22);
  let big, bigD, size = 150, bg = PINK, rot = -3;
  if (fr < dBru) { big = "sem assistir"; bigD = 0; size = 150; }
  else if (fr < dCin) { big = fr >= dPro ? "corte pronto ✓" : "vídeo bruto"; bigD = fr >= dPro ? dPro : dBru; size = 120; bg = fr >= dPro ? PINK : "#5b4a8a"; rot = 2; }
  else { big = "5 passos"; bigD = dCin; size = 140; }
  const flash = [dEd, dNada, dBru, dPro, dCin, dEsp].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.45, 0);
  const play = (fr * 9) % 820;
  const segs = [[3, "ok"], [1, "lixo", "ãh"], [4, "ok"], [2, "lixo", "erro"], [3, "ok"], [2, "lixo", "..."], [3, "ok"]];
  const cutAt = { "ãh": dCor - 6, erro: dCor, "...": dCor + 6 };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.45, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dCin && (
        <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ transform: `scale(${fr >= dEd && fr < dBru ? 1 + 0.08 * Math.max(0, 1 - (fr - dEd) / 8) : 1}) translateX(${shake(fr, dNada, 12)}px)` }}><Janela title={fr >= dBru ? "bruto.mp4 → final.mp4" : "seu-video.mp4"} w={960} h={560} glow={fr >= dPro || (fr >= dEd && fr < dBru)}>
            <div style={{ position: "relative", height: 300, borderRadius: 20, background: "linear-gradient(135deg,#2a1d52,#140c2c)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {fr < dBru ? <Olho fr={fr} d={dNada - 2} size={240} /> : <div style={{ fontSize: 150, transform: `rotate(${shake(fr, dBru, 6)}deg) scale(${fr >= dPro ? 1 + 0.1 * Math.max(0, 1 - (fr - dPro) / 8) : 1})` }}>{fr >= dPro ? "🎬" : "📼"}</div>}
              
            </div>
            <div style={{ marginTop: 26, position: "relative" }}>
              <Trilha segs={segs} fr={fr} w={904} h={96} cutAt={fr >= dBru ? cutAt : {}} clean={fr >= dPro} />
              {fr >= dVid && fr < dBru && <div style={{ position: "absolute", top: -60, left: interpolate(fr, [dVid, dBru], [0, 820], clamp), fontSize: 64, zIndex: 3, transform: `rotate(${-90 + Math.sin(fr) * 15}deg)` }}>✂️</div>}
              {fr < dEd && <div style={{ position: "absolute", top: -8, left: 6 + play, width: 6, height: 112, background: "#fff", borderRadius: 3 }} />}
            </div>
          </Janela></div>
          {fr >= dEd && fr < dBru && <In fr={fr} d={dEd}><div style={{ display: "flex", gap: 18, alignItems: "center" }}><Pill size={46} c={PINK} bg={PINKA(0.15)}>✂ editando</Pill><Spin fr={fr} c={PINK} s={50} />{fr >= dSem && <Stamp fr={fr} d={dSem} size={50} rot={-3} c={RED}>👁 0 s assistidos</Stamp>}</div></In>}
          {fr >= dPro && <Stamp fr={fr} d={dPro} size={64} rot={-3} c={GREEN}>✓ pronto, sem editor</Stamp>}
        </div>
      )}
      {fr >= dCin && (
        <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {["📂", "👁️", "📋", "✂️", "🧠"].map((ic, n) => {
              const d = dCin + n * 3, last = n === 4, hot = last && fr >= dQui;
              return (
                <In key={n} fr={fr} d={d} dy={140}>
                  <div style={{ width: 172, height: 250, borderRadius: 28, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateX(${hot ? shake(fr, dEsp, 16) : 0}px) scale(${hot ? 1.15 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1 }}>{n + 1}</div>
                    <div style={{ fontSize: 58 }}>{last && fr < dEsp ? "❓" : ic}</div>
                  </div>
                </In>
              );
            })}
          </div>
          <Stamp fr={fr} d={dCin + 8} size={58} rot={-3} c={GOLD}>o 5º é o mais esperto 🧠</Stamp>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- nome: video-use ----------
const Nome = ({ fr }) => {
  const d0 = at(23), dSk = at(28), dAb = at(30), dCl = at(34), dMais = at(36), dMil = at(41), dEst = at(42), dGit = at(44);
  const stars = count(fr, dMais, dEst + 6, 0, 31595);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={d0}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 40px", borderRadius: 36, background: WIN, border: `3px solid ${PINK}`, boxShadow: `0 0 60px ${PINKA(0.4)}` }}>
            <div style={{ width: 120, height: 120, borderRadius: 30, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, transform: `rotate(${Math.sin(fr / 6) * 6}deg)` }}>🎬</div>
            <div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 84, color: "#fff", lineHeight: 1 }}>{typed("video-use", fr, d0 + 2, d0 + 14)}</div>
              <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 40, color: BODY, marginTop: 8, opacity: lin(fr, dSk, dSk + 5) }}>skill de edição de vídeo</div>
            </div>
          </div>
        </In>
        {fr >= dSk - 3 && fr < dMais - 2 && <div style={{ position: "absolute", top: 40, left: 540, width: 0, height: 0 }}>
          {["✂️", "💬", "🎨", "🎞️"].map((ic, k) => { const a = fr / 10 + (k * Math.PI) / 2, p = pop(fr, dSk - 3 + k * 3, 10); return <div key={k} style={{ position: "absolute", left: Math.cos(a) * 470 * p - 40, top: 60 + Math.sin(a) * 120 * p - 40, fontSize: 70, opacity: p }}>{ic}</div>; })}
        </div>}
        <div style={{ display: "flex", gap: 20, height: 80 }}>
          {fr >= dAb && <In fr={fr} d={dAb}><Pill size={42}>🔓 código aberto</Pill></In>}
          {fr >= dAb + 6 && <In fr={fr} d={dAb + 6}><Pill size={42} c={CYAN} bg="rgba(94,231,255,0.1)">MIT</Pill></In>}
        </div>
        {fr < dMais - 2 ? (
          fr >= dCl - 4 && <In fr={fr} d={dCl - 4}>
            <Term title="Claude Code" cmd="edita os vídeos da pasta" fr={fr} a={dCl - 2} b={dCl + 12} w={940} h={300} glow out={[["✓ skill video-use carregada", dCl + 14, GREEN]]} />
          </In>
        ) : (
          <In fr={fr} d={dMais - 2}>
            <Janela title="github.com · browser-use/video-use" w={940} h={420} glow={fr >= dGit}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 40 }}>
                <div style={{ fontSize: 130, transform: `rotate(${fr * 5}deg) scale(${1 + 0.1 * Math.sin(fr / 3)})`, color: GOLD }}>★</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 130, color: "#fff", textShadow: fr >= dEst ? `0 0 40px ${GOLD}` : "none" }}>{stars.toLocaleString("pt-BR")}</div>
              </div>
              <div style={{ textAlign: "center", marginTop: 20, fontFamily: inter, fontWeight: 800, fontSize: 40, color: GOLD, opacity: lin(fr, dMil, dMil + 5) }}>estrelas no GitHub</div>
            </Janela>
          </In>
        )}
      </div>
      <Confete fr={fr} d={dGit} />
    </AbsoluteFill>
  );
};

// ---------- passo 1: pasta ----------
const TAKES = [["take_01.mp4", 50], ["take_02.mp4", 51], ["take_03.mp4", 53]];
const Passo1 = ({ fr }) => {
  const d0 = at(45), dJo = at(48), dPas = at(53), dPe = at(55), dEd = at(56);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="📂" t="Joga na pasta" sub="os vídeos brutos" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={d0 + 4}>
          <Janela title="~/videos/" w={960} h={fr >= dPe - 2 ? 440 : 600} glow={fr >= dPas}>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
              {TAKES.map(([nm, i]) => {
                const d = at(i) - 3;
                if (fr < d) return null;
                const p = pop(fr, d, 11);
                return <div key={nm} style={{ width: 270, height: 300, borderRadius: 22, background: "rgba(255,255,255,0.06)", border: `2px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, transform: `translate(${(1 - p) * 600}px, ${(1 - p) * -500}px) rotate(${(1 - p) * 40}deg)` }}>
                  <div style={{ fontSize: 110 }}>🎞️</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: "#fff" }}>{nm}</div>
                </div>;
              })}
              {fr < dJo - 2 && <div style={{ fontSize: 200, transform: `scale(${1 + 0.06 * Math.sin(fr / 3)})`, opacity: 0.8 }}>📂</div>}
              {fr >= dJo - 2 && fr < at(50) - 3 && <div style={{ fontSize: 160, transform: `translateY(${Math.sin(fr / 3) * 16}px)` }}>🫳</div>}
            </div>
          </Janela>
        </In>
        {fr >= dPe - 2 && <In fr={fr} d={dPe - 2}>
          <div style={{ width: 900, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: PINK, borderRadius: "34px 34px 8px 34px", padding: "24px 36px", fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", transform: `scale(${fr >= dEd + 8 ? 1 + 0.04 * Math.sin(fr / 4) : 1})` }}>{typed("edita isso ✂️", fr, dEd - 2, dEd + 8)}{fr < dEd + 8 && blink(fr)}</div>
          </div>
        </In>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- passo 2: lê, não assiste ----------
const LINHAS = [["00:01.2", "oi, hoje eu vou"], ["00:02.0", "ãh..."], ["00:03.4", "mostrar a receita"], ["00:05.1", "do bolo de cenoura"]];
const Passo2 = ({ fr }) => {
  const d0 = at(58), dLe = at(61), dAss = at(63), dTr = at(64), dPal = at(66), dTem = at(69), dTri = at(71), dQua = at(73), dVir = at(74), dTex = at(76), dPeq = at(77);
  const q = count(fr, dTri - 2, dQua + 4, 0, 30000);
  const shrink = ease(lin(fr, dVir, dTex + 4));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="📖" t="Lê, não assiste" sub="transcrição palavra a palavra" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {fr < dTr ? (
          <div style={{ display: "flex", gap: 60, alignItems: "center", height: 600 }}>
            <In fr={fr} d={d0 + 4}><Olho fr={fr} d={dAss} size={280} /></In>
            {fr >= dLe && <In fr={fr} d={dLe}><div style={{ fontSize: 240, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>📖</div></In>}
          </div>
        ) : fr < dTri - 2 ? (
          <In fr={fr} d={dTr}>
            <Janela title="transcricao.md" w={960} h={620} glow={fr >= dTem}>
              {LINHAS.map(([t, txt], k) => {
                const a = dTr + 2 + k * 7;
                if (fr < a) return null;
                return <div key={k} style={{ display: "flex", gap: 20, marginBottom: 22, opacity: lin(fr, a, a + 4) }}>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: fr >= dTem ? PINK : GREY, background: fr >= dTem ? PINKA(0.15) : "transparent", borderRadius: 10, padding: "0 8px" }}>[{t}]</span>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: k === 1 ? AMBER : "#fff" }}>{typed(txt, fr, a, a + 6)}</span>
                </div>;
              })}
              {fr >= dPal && <div style={{ position: "absolute", left: 28, bottom: 28 }}><Pill size={38}>⏱ tempo de cada palavra</Pill></div>}
            </Janela>
          </In>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <In fr={fr} d={dTri - 2}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: "#fff", textAlign: "center" }}>{q.toLocaleString("pt-BR")} <span style={{ fontSize: 46, color: PINK }}>quadros</span></div>
            </In>
            <div style={{ position: "relative", width: 960, height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 80px)", gap: 8, transform: `scale(${1 - 0.85 * shrink})`, opacity: 1 - shrink * 0.9 }}>
                {Array.from({ length: 50 }, (_, k) => <div key={k} style={{ width: 80, height: 80, borderRadius: 10, background: `hsl(${260 + ((k * 37) % 60)},45%,${28 + ((k * 13) % 20)}%)`, opacity: fr >= dTri + (k % 25) / 2 ? 1 : 0 }} />)}
              </div>
              {fr >= dTex - 2 && <div style={{ position: "absolute", transform: `scale(${0.4 + 0.6 * pop(fr, dTex - 2, 9)})` }}>
                <div style={{ width: 300, height: 360, borderRadius: 26, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: `0 0 70px ${PINKA(0.7)}` }}>
                  <div style={{ fontSize: 120 }}>📄</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: "#1a1033" }}>texto</div>
                  {[0, 1, 2].map((k) => <div key={k} style={{ width: 200 * lin(fr, dTex + k * 6, dTex + k * 6 + 10), height: 12, borderRadius: 6, background: "rgba(26,16,51,0.35)" }} />)}
                  {fr >= dPeq && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: PINK }}>12 KB</div>}
                </div>
              </div>}
              {fr >= dPeq + 6 && <div style={{ position: "absolute", right: 20, bottom: 10 }}><Stamp fr={fr} d={dPeq + 6} size={56} rot={-6} c={GREEN}>✓ leve e rápido</Stamp></div>}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- passo 3: plano + OK ----------
const PLANO = [["✂️", "cortar pausas e erros", 0], ["💬", "legenda", 1], ["🎨", "cor", 2]];
const Passo3 = ({ fr }) => {
  const d0 = at(78), dEsp = at(87), dOK = at(90);
  const ok = fr >= dOK;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📋" t="Plano do corte" sub="e espera o seu OK" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 4}>
          <Janela title="Claude Code · plano" w={960} h={760} glow={ok}>
            {PLANO.map(([ic, t, i], k) => {
              const d = d0 + 6 + i * 10;
              if (fr < d) return null;
              return <In key={t} fr={fr} d={d} dx={300} dy={0}>
                <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 24px", marginBottom: 18, borderRadius: 22, background: "rgba(255,255,255,0.06)", border: `2px solid ${ok ? GREEN : LINE}` }}>
                  <span style={{ fontSize: 56 }}>{ic}</span>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>{t}</span>
                  <span style={{ marginLeft: "auto", fontSize: 48, color: GREEN, opacity: ok ? lin(fr, dOK + k * 3, dOK + k * 3 + 4) : 0 }}>✓</span>
                </div>
              </In>;
            })}
            {fr >= dEsp - 2 && <div style={{ position: "absolute", left: 28, right: 28, bottom: 30, display: "flex", alignItems: "center", gap: 24 }}>
              {!ok && <><Spin fr={fr} c={AMBER} s={50} /><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: AMBER }}>aguardando você…</span></>}
              <div style={{ marginLeft: "auto", fontFamily: inter, fontWeight: 800, fontSize: 54, color: "#fff", background: ok ? GREEN : PINK, padding: "18px 44px", borderRadius: 22, transform: `scale(${ok ? pop(fr, dOK, 8) * 0.15 + 1 : 1 + 0.04 * Math.sin(fr / 3)})` }}>{ok ? "OK ✓" : "OK?"}</div>
            </div>}
            {fr >= dEsp && <Cursor x={interpolate(fr, [dEsp, dOK], [300, 780], clamp)} y={interpolate(fr, [dEsp, dOK], [400, 640], clamp)} fr={fr} click={dOK} />}
          </Janela>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- passo 4: corta e finaliza ----------
const Passo4 = ({ fr }) => {
  const d0 = at(91), dAh = at(95), dErr = at(97), dSil = at(100), dLeg = at(102), dCor = at(104), dFade = at(108), dTri = at(110), dMili = at(111), dSem = at(115);
  const segs = [[3, "ok"], [1.4, "lixo", "ãh"], [3, "ok"], [2, "lixo", "erro"], [3, "ok"], [2.2, "lixo", "silêncio"], [2, "ok"]];
  const cutAt = { "ãh": dAh + 4, erro: dErr + 4, "silêncio": dSil + 6 };
  const fase2 = fr >= dFade - 3;
  const grade = ease(lin(fr, dCor, dCor + 12));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="✂️" t="Corta e finaliza" sub="sem você mexer" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {!fase2 ? (
          <In fr={fr} d={d0 + 4}>
            <Janela title="timeline" w={960} h={780} glow={fr >= dSil + 8}>
              <div style={{ position: "relative", height: 380, borderRadius: 20, overflow: "hidden", background: `linear-gradient(135deg, hsl(${250 - 220 * grade},${10 + 50 * grade}%,${30 + 8 * grade}%), hsl(${260 - 230 * grade},${15 + 45 * grade}%,${14 + 6 * grade}%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 150 }}>🎙️</div>
                {fr >= dLeg && <div style={{ position: "absolute", bottom: 26, fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff", background: "rgba(0,0,0,0.55)", padding: "4px 22px", borderRadius: 12, transform: `scale(${pop(fr, dLeg, 9)})` }}>{fr % 24 < 12 ? "OI, HOJE" : "EU VOU"}</div>}
                {fr >= dCor && <div style={{ position: "absolute", top: 20, right: 20 }}><Pill size={34} c={AMBER} bg="rgba(251,191,36,0.15)">🎨 cor {Math.round(grade * 100)}%</Pill></div>}
              </div>
              <div style={{ marginTop: 34 }}><Trilha segs={segs} fr={fr} w={904} h={110} cutAt={cutAt} clean={fr >= dSil + 14} /></div>
              <div style={{ display: "flex", gap: 16, marginTop: 30, flexWrap: "wrap" }}>
                {[["✂ ãh", dAh], ["✂ erros", dErr], ["✂ silêncio", dSil]].map(([t, d]) => fr >= d && <In key={t} fr={fr} d={d}><Pill size={36} c={RED} bg="rgba(255,92,122,0.12)">{t}</Pill></In>)}
                {fr >= dLeg && <In fr={fr} d={dLeg}><Pill size={36}>💬 legenda</Pill></In>}
              </div>
            </Janela>
          </In>
        ) : (
          <In fr={fr} d={dFade - 3}>
            <Janela title="corte · áudio" w={960} h={700} glow={fr >= dSem}>
              <svg width={904} height={360} viewBox="0 0 904 360">
                {Array.from({ length: 60 }, (_, k) => {
                  const x = 10 + k * 15, mid = k >= 28 && k <= 31;
                  const fade = k < 28 ? Math.min(1, (28 - k) / 4) : k > 31 ? Math.min(1, (k - 31) / 4) : 0;
                  const amp = (40 + 90 * Math.abs(Math.sin(k * 1.7 + fr / 3))) * (fr >= dMili ? fade : 1) * (mid ? 0 : 1);
                  return <rect key={k} x={x} y={180 - amp} width={9} height={amp * 2} rx={4} fill={fr >= dMili && fade < 1 ? PINK : "rgba(190,170,255,0.7)"} />;
                })}
                <line x1={452} y1={10} x2={452} y2={350} stroke={RED} strokeWidth={6} strokeDasharray="14 10" />
              </svg>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 30 }}>
                {fr >= dTri && <In fr={fr} d={dTri}><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 96, color: "#fff" }}>{count(fr, dTri, dMili + 6, 0, 30)} ms</div></In>}
              </div>
              {fr >= dSem && <div style={{ position: "absolute", right: 40, bottom: 30 }}><Stamp fr={fr} d={dSem} size={70} rot={-5} c={GREEN}>🔇 sem estalo</Stamp></div>}
            </Janela>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- passo 5: confere sozinho ----------
const Passo5 = ({ fr }) => {
  const d0 = at(117), dCon = at(120), dCor = at(126), dAch = at(127), dErr = at(128), dCrg = at(129), dRen = at(131), dAte = at(134), dTres = at(135), dVez = at(136);
  const checks = [0, 1, 2, 3, 4];
  const bad = 2;
  const fixed = fr >= dRen + 10;
  const tent = fr >= dTres ? 3 : fr >= dRen ? 2 : 1;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="5" icon="🧠" t="Confere sozinho" sub="cada corte do vídeo pronto" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={d0 + 4}>
          <Janela title="revisão do render" w={960} h={520} glow={fixed}>
            <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
              {checks.map((k) => {
                const d = dCon + k * 9;
                const isBad = k === bad && fr >= dAch - 2 && !fixed;
                const done = fr >= d + 4;
                return <div key={k} style={{ flex: 1, height: 200, borderRadius: 18, background: `hsl(${270 - k * 10},40%,${22 + k * 3}%)`, border: `4px solid ${isBad ? RED : done ? GREEN : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, transform: `translateX(${isBad ? shake(fr, dAch - 2, 12) : 0}px)` }}>
                  {fr < d ? "" : isBad ? "❌" : done ? "✅" : <Spin fr={fr} c={PINK} s={50} />}
                </div>;
              })}
            </div>
            <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 20 }}>
              {fr >= dCrg && !fixed && <Spin fr={fr} c={PINK} s={46} />}
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: fixed ? GREEN : fr >= dAch - 2 ? RED : BODY }}>{fixed ? "corrigido ✓" : fr >= dCrg ? "corrigindo e renderizando…" : fr >= dAch - 2 ? "achou um erro!" : "conferindo cortes…"}</span>
            </div>
            {fr >= dCrg && <div style={{ marginTop: 22 }}><Prog v={ease(lin(fr, dCrg, dRen + 10))} w={904} /></div>}
          </Janela>
        </In>
        {fr >= dAte - 2 && <In fr={fr} d={dAte - 2}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: BODY }}>tentativas</span>
            {[1, 2, 3].map((n) => <div key={n} style={{ width: 96, height: 96, borderRadius: 48, background: n <= tent ? PINK : "rgba(255,255,255,0.08)", border: `3px solid ${n <= tent ? PINK : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", transform: `scale(${n === 3 && fr >= dTres ? 1 + 0.2 * Math.max(0, 1 - (fr - dTres) / 8) : 1})` }}>{n}</div>)}
            {fr >= dVez && <Stamp fr={fr} d={dVez} size={50} rot={-4} c={GOLD}>máx. 3</Stamp>}
          </div>
        </In>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- final + CTA ----------
const Final = ({ fr }) => {
  const d0 = at(137), dFin = at(141), dLado = at(147), dArq = at(150), dVoc = at(151), dEdi = at(152), dCom = at(154), dK = at(155), dSeg = at(158);
  const cta = fr >= dVoc - 2;
  return (
    <AbsoluteFill>
      {!cta ? (
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <In fr={fr} d={d0}>
            <Janela title="~/videos/" w={960} h={760} glow={fr >= dArq}>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
                {TAKES.map(([nm]) => <div key={nm} style={{ width: 270, height: 220, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `2px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: fr >= dLado ? 0.6 : 1, transform: `scale(${fr >= dLado ? 1 + 0.05 * Math.sin(fr / 3 + nm.length) : 1})` }}>
                  <div style={{ fontSize: 80 }}>🎞️</div><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#fff" }}>{nm}</div>
                </div>)}
              </div>
              {fr >= dFin - 4 && <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
                <div style={{ width: 600, height: 300, borderRadius: 26, background: PINKA(0.25), border: `4px solid ${PINK}`, display: "flex", alignItems: "center", gap: 26, padding: "0 36px", boxSizing: "border-box", boxShadow: `0 0 ${50 + 20 * Math.sin(fr / 4)}px ${PINKA(0.6)}`, transform: `translateY(${(1 - pop(fr, dFin - 4, 10)) * -600}px) rotate(${(1 - pop(fr, dFin - 4, 10)) * -20}deg)` }}>
                  <div style={{ fontSize: 130 }}>🎬</div>
                  <div>
                    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: BODY }}>edit/</div>
                    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: "#fff" }}>final.mp4</div>
                  </div>
                </div>
              </div>}
            </Janela>
          </In>
          {fr >= dLado && <Stamp fr={fr} d={dLado} size={60} rot={-3} c={GREEN}>✓ do lado dos seus arquivos</Stamp>}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
          <In fr={fr} d={dVoc - 2}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>{fr >= dEdi ? "editaria assim?" : "você…"}</div></In>
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <In fr={fr} d={dVoc}><div style={{ padding: "24px 30px", borderRadius: 26, background: WIN, border: `3px solid ${LINE}`, fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY, textDecoration: fr >= dEdi + 6 ? "line-through" : "none" }}>🎛️ editor</div></In>
            {fr >= dEdi && <div style={{ fontSize: 70, transform: `translateX(${Math.sin(fr / 3) * 10}px)` }}>➡️</div>}
            {fr >= dEdi + 4 && <In fr={fr} d={dEdi + 4}><div style={{ padding: "24px 30px", borderRadius: 26, background: PINKA(0.25), border: `3px solid ${PINK}`, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>💬 Claude Code</div></In>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 20, position: "relative" }}>
            {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 5; if (fr < t0) return null; const q = ((fr - t0) % 36) / 34; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
            <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : LINE}`, opacity: Math.max(0.35, lin(fr, dVoc, dCom)), boxSizing: "border-box" }}>
              <span style={{ fontSize: 54 }}>💬</span>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("EDITAR", fr, dK - 2, dK + 8)}{blink(fr)}</span>
              {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
            </div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["ia", "edita", "assistir", "nada", "bruto", "pronto", "5 passos", "5º", "esperto", "video-use", "skill", "codigo", "aberto", "claude", "code", "31 mil", "estrelas", "github", "passo 1", "passo 2", "passo 3", "passo 4", "passo 5", "pasta", "brutos", "edita isso", "le", "assiste", "transcreve", "palavra", "exato", "30 mil", "quadros", "texto", "pequeno", "plano", "ok", "corta", "ah", "erros", "silencio", "legenda", "cor", "fade", "30 ms", "estalo", "confere", "erro", "corrige", "renderiza", "3 vezes", "finalmp4", "arquivos", "editaria", "comenta", "editar", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/º%$ -]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) && !/\.\.\.$/.test(w.w) ? w.w.slice(-1) : /\.\.\.$/.test(w.w) ? "..." : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "passo" && NUMS[nn(k + 1)]) { push("Passo " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "cinco" && nn(k + 1) === "passos") { push("5 passos", k + 1); continue; }
    if (n === "quinto") { push("5º", k); continue; }
    if (n === "video" && nn(k + 1) === "ius") { push("video-use", k + 1); continue; }
    if (n === "trinta" && nn(k + 1) === "e" && nn(k + 2) === "um" && nn(k + 3) === "mil") { push("31 mil", k + 3); continue; }
    if (n === "trinta" && nn(k + 1) === "mil") { push("30 mil", k + 1); continue; }
    if (n === "trinta" && nn(k + 1) === "milissegundos") { push("30 ms", k + 1); continue; }
    if (n === "tres" && nn(k + 1) === "vezes") { push("3 vezes", k + 1); continue; }
    if (n === "edita" && nn(k + 1) === "isso") { push("edita isso", k + 1); continue; }
    if (n === "final" && nn(k + 1) === "ponto" && nn(k + 4) === "quatro") { push("final.mp4", k + 4); continue; }
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

export const ShortEditarVideos = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(23), at(45), at(58), at(78), at(91), at(117), at(137), end];
  const scenes = [Hook, Nome, Passo1, Passo2, Passo3, Passo4, Passo5, Final];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(117)} b={at(126)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(154)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(5) - 2, "error", 0.4, 15)}
      {S(at(8), "whoosh", 0.7, 30)}
      {[-6, 0, 6].map((o) => S(at(11) + o, "pop", 0.35, 15))}
      {S(at(12), "ding", 0.45)}
      {[0, 3, 6, 9, 12].map((o) => S(at(14) + o, "pop", 0.3, 15))}
      {S(at(18), "riser", 0.3, 30)}
      {S(at(22), "ding", 0.4)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(30), "pop", 0.35, 15)}
      {S(at(42), "coin", 0.4, 15)}
      {S(at(44), "ding", 0.45)}
      {TAKES.map(([, i]) => S(at(i) - 3, "pop", 0.35, 15))}
      {S(at(56), "pop", 0.4, 15)}
      {S(at(63), "error", 0.4, 15)}
      {S(at(69), "ding", 0.35)}
      {S(at(76) - 2, "whoosh", 0.5, 30)}
      {[0, 1, 2].map((i) => S(at(78) + 6 + i * 10, "pop", 0.3, 15))}
      {S(at(90), "ding", 0.5)}
      {[95, 97, 100].map((i) => S(at(i) + 4, "pop", 0.4, 15))}
      {S(at(102), "pop", 0.35, 15)}
      {S(at(111), "ding", 0.35)}
      {S(at(115), "ding", 0.45)}
      {S(at(127) - 2, "error", 0.45, 15)}
      {S(at(131) + 10, "ding", 0.45)}
      {S(at(135), "pop", 0.4, 15)}
      {S(at(141) - 4, "whoosh", 0.5, 30)}
      {S(at(141) + 4, "coin", 0.4, 15)}
      {S(at(155) + 8, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaEditarVideos = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>A IA edita</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>seu vídeo</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>sem assistir</div>
    </div>
    <div style={{ position: "absolute", top: 870, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <Janela title="bruto.mp4 → final.mp4" w={960} h={330} glow>
        <Trilha segs={[[3, "ok"], [1, "lixo", "ãh"], [4, "ok"], [2, "lixo", "erro"], [3, "ok"], [2, "lixo", "..."], [3, "ok"]]} fr={0} w={904} h={110} cutAt={{ "ãh": -100 }} />
        <div style={{ marginTop: 24, display: "flex", gap: 16 }}><Pill size={36} c={RED} bg="rgba(255,92,122,0.12)">✂ ãh</Pill><Pill size={36} c={RED} bg="rgba(255,92,122,0.12)">✂ erros</Pill><Pill size={36}>✓ final.mp4</Pill></div>
      </Janela>
    </div>
    <div style={{ position: "absolute", top: 1300, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>do bruto ao corte pronto, em 5 passos</div>
  </AbsoluteFill>
);
