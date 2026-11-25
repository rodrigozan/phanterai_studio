import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 25/11/2026 12:00 — "Canal de vídeo de palitinho feito com IA" (Claude Code + Remotion).
// Fatos conferidos nas fontes primárias (texto em fontes/fonte-1..3.txt):
// - remotion.dev/docs/ai/coding-agents: "You can create videos from prompts"; Claude Code, Codex, Kimi Code, OpenCode;
//   pré-requisito Node.js + agente de código ("Most coding agents require a paid subscription");
//   `npx create-video --yes --blank my-video` (projeto Blank); `npx remotion skills add`; `npm run dev`;
//   "Open a separate terminal window and start your coding agent ... claude"; "You can now prompt a video!".
// - remotion.dev/docs/ai/skills: skills = "best practices for working in Remotion projects"; /remotion-render etc.
// - remotion.dev/docs/render: `npx remotion render`.
// O palitinho é desenhado em SVG (círculo + traços) aqui mesmo: nenhum print, nada gerado por IA, nenhum logo oficial.
export const SPA_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-25-1200-canal-de-palitinho-com-ia";
export const SPA_FPS = 30;
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const SRM_SLUG = SPA_SLUG;
const SRM_FPS = SPA_FPS;
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
export const calculatePalitinhoMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças ----------
const CYAN = "#5ee7ff";
// palitinho em SVG: círculo + traços. build 0..1 desenha em ordem (cabeça, corpo, braços, pernas).
const Palito = ({ fr, s = 1, build = 1, wave = false, walk = false, point = false, c = "#fff", k = 0, face = true }) => {
  const seg = (i) => Math.max(0, Math.min(1, build * 6 - i));
  const sw = walk ? Math.sin(fr / 3 + k) * 22 : 0;
  const wa = wave ? -60 + Math.sin(fr / 2.5 + k) * 28 : 0;
  const rArm = point ? [178, 112] : wave ? [100 + 75 * Math.cos((wa * Math.PI) / 180), 130 + 75 * Math.sin((wa * Math.PI) / 180)] : [145, 175];
  const L = (x1, y1, x2, y2, i) => <line x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - seg(i)} stroke={c} strokeWidth={11} strokeLinecap="round" />;
  const bob = walk ? Math.abs(Math.sin(fr / 3 + k)) * -8 : 0;
  return (
    <svg width={200 * s} height={300 * s} viewBox="0 0 200 300" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        <circle cx={100} cy={58} r={40} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - seg(0)} stroke={c} strokeWidth={11} />
        {face && seg(0) >= 1 && <g><circle cx={86} cy={52} r={5} fill={c} /><circle cx={114} cy={52} r={5} fill={c} /><path d="M84 70 Q100 82 116 70" stroke={c} strokeWidth={5} fill="none" strokeLinecap="round" /></g>}
        {L(100, 98, 100, 200, 1)}
        {L(100, 130, 55, 175, 2)}
        {L(100, 130, rArm[0], rArm[1], 3)}
        {L(100, 200, 65 + sw, 285, 4)}
        {L(100, 200, 135 - sw, 285, 5)}
      </g>
    </svg>
  );
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
const DIAS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
const Semana = ({ fr, d, step = 3, hot = -1, w = 128 }) => (
  <div style={{ display: "flex", gap: 12 }}>
    {DIAS.map((t, k) => {
      const on = fr >= d + k * step;
      return (
        <div key={t} style={{ width: w, height: w * 1.35, borderRadius: 22, background: on ? PINKA(0.25) : WIN, border: `3px solid ${k === hot ? AMBER : on ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${on ? 0.8 + 0.2 * pop(fr, d + k * step, 9) : 1})` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, color: GREY }}>{t}</div>
          <div style={{ fontSize: 50, opacity: on ? 1 : 0.15 }}>▶️</div>
        </div>
      );
    })}
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dZ2 = at(2), dCam = at(3), dVid = at(6), dDia = at(8), dPal = at(13), dIA = at(16), dCinco = at(19), dQuin = at(23), dPost = at(28);
  let big, bigD, size = 140, bg = RED, rot = -3;
  if (fr < dZ2) { big = "zero desenho"; bigD = 0; size = 130; }
  else if (fr < dVid) { big = "zero câmera"; bigD = dZ2; size = 130; rot = 2; }
  else if (fr < dPal) { big = "1 vídeo por dia"; bigD = dVid; size = 116; bg = PINK; }
  else if (fr < dCinco) { big = "palitinho"; bigD = dPal; bg = PINK; rot = 2; }
  else if (fr < dQuin) { big = "5 passos"; bigD = dCinco; bg = PINK; }
  else { big = "o 5º: todo dia"; bigD = dQuin; size = 110; bg = PINK; rot = 2; }
  const flash = [0, dZ2, dVid, dPal, dCinco, dQuin].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const icon = (emo, d0, d1, sl = 2) => fr >= d0 && fr < d1 && (
    <div style={{ position: "relative", width: 300, height: 300, transform: `scale(${d0 === 0 ? interpolate(fr, [0, 8], [1.2, 1], clamp) : 0.6 + 0.4 * pop(fr, d0, 9)}) translateX(${shake(fr, d0 + sl, 18)}px) rotate(${fr >= d0 + sl ? Math.sin(fr / 3) * 4 : 0}deg)` }}>
      <div style={{ width: 300, height: 300, borderRadius: 60, background: WIN, border: `4px solid ${RED}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 170 }}>{emo}</div>
      <Slash fr={fr} d={d0 + sl} />
    </div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {fr < dVid && <div style={{ display: "flex", gap: 40 }}>{icon("✏️", 0, dVid, 10)}{icon("🎥", dZ2, dVid, dCam - dZ2)}</div>}
        {fr >= dVid && fr < dPal && <In fr={fr} d={dVid}><Semana fr={fr} d={dVid + 2} step={2} /></In>}
        {fr >= dVid + 4 && fr < dPal && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 90, color: "#fff" }}>{Math.min(7, Math.max(0, Math.floor((fr - dVid - 2) / 2) + 1))} <span style={{ fontSize: 50, color: PINK }}>vídeos/semana</span></div>}
        {fr >= dDia + 4 && fr < dCinco && <Stamp fr={fr} d={dDia + 4} size={60} rot={-3}>5 passos · o 5º é o segredo ❓</Stamp>}
        {fr >= dPal && fr < dCinco && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ transform: `translateY(${(1 - pop(fr, dPal + k * 3, 11)) * 400}px)` }}><Palito fr={fr} k={k} s={k === 1 ? 1.5 : 1} build={lin(fr, dPal + k * 3, dPal + k * 3 + 10)} wave={k === 1} walk={k !== 1} c={k === 1 ? "#fff" : k ? CYAN : PINK} /></div>)}
          </div>
        )}
        {fr >= dIA && fr < dCinco && <In fr={fr} d={dIA}><Pill size={46} c={PINK} bg={PINKA(0.15)}>✨ feito com IA</Pill></In>}
        {fr >= dCinco && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
            <div style={{ display: "flex", gap: 18 }}>
              {["📁", "🧠", "👀", "💬", "🎬"].map((ic, n) => {
                const d = dCinco + n * 3, last = n === 4, hot = last && fr >= dQuin;
                return (
                  <In key={n} fr={fr} d={d} dy={120}>
                    <div style={{ width: 168, height: 230, borderRadius: 28, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `translateX(${hot ? shake(fr, dQuin, 14) : 0}px) scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#fff", lineHeight: 1 }}>{n + 1}</div>
                      <div style={{ fontSize: 50 }}>{last && fr < dPost ? "❓" : ic}</div>
                    </div>
                  </In>
                );
              })}
            </div>
            {fr >= dPost - 2 && <In fr={fr} d={dPost - 2}><Semana fr={fr} d={dPost} step={1} w={110} /></In>}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: o projeto ----------
const Item1 = ({ fr }) => {
  const d0 = at(31), dProj = at(34), dTerm = at(36), dCmd = at(38), dCre = at(40), dPronto = at(42), dBranco = at(46), dRem = at(48);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="📁" t="O projeto" sub="um comando só" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {fr < dTerm - 2 ? (
          <In fr={fr} d={d0 + 4}>
            <div style={{ fontSize: 260, transform: `scale(${fr >= dProj ? 1 + 0.12 * Math.max(0, 1 - (fr - dProj) / 8) : 1}) rotate(${Math.sin(fr / 6) * 4}deg)` }}>{fr >= dProj ? "📂" : "📁"}</div>
          </In>
        ) : (
          <In fr={fr} d={dTerm - 2}>
            <Term fr={fr} a={dCmd} b={dCre + 12} glow={fr >= dCre && fr < dPronto} cmd="npx create-video --yes --blank my-video" h={300}
              out={[["✓ Blank project criado", dPronto, GREEN], ["  em ./my-video", dPronto + 6]]} />
          </In>
        )}
        {fr >= dPronto + 4 && (
          <In fr={fr} d={dPronto + 4} dy={80}>
            <Janela title="my-video/" w={640} h={260} glow={fr >= dRem}>
              {[["📁 src/", 0], ["📄 package.json", 4], ["📁 public/", 8]].map(([t, o]) => fr >= dPronto + 8 + o && <div key={t} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: "#fff", marginBottom: 6, transform: `translateX(${(1 - pop(fr, dPronto + 8 + o, 12)) * -120}px)` }}>{t}</div>)}
            </Janela>
          </In>
        )}
        {fr >= dBranco && <Stamp fr={fr} d={dBranco} size={68} rot={-4} c={GREEN}>projeto em branco ✓</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: as skills ----------
const SK = ["/remotion-best-practices", "/remotion-markup", "/remotion-studio", "/remotion-render", "/remotion-captions"];
const Item2 = ({ fr }) => {
  const d0 = at(49), dMais = at(53), dCmd = at(56), dAg = at(59), dApr = at(62), dBoas = at(64), dRem = at(67);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🧠" t="As skills" sub="o agente aprende" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <In fr={fr} d={d0 + 4}>
          <Term fr={fr} a={d0 + 8} b={dCmd + 16} glow={fr >= dCmd && fr < dAg} cmd="npx remotion skills add" h={200} />
        </In>
        <div style={{ display: "flex", alignItems: "center", gap: 30, height: 400 }}>
          {fr >= dAg - 2 && (
            <In fr={fr} d={dAg - 2} dx={-160} dy={0}>
              <div style={{ width: 300, height: 360, borderRadius: 40, background: WIN, border: `4px solid ${fr >= dBoas ? GREEN : PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: `0 0 50px ${PINKA(0.35)}` }}>
                <div style={{ fontSize: 120, transform: `scale(${1 + 0.06 * Math.sin(fr / 4)})` }}>🤖</div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>agente</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: fr >= dBoas ? GREEN : AMBER }}>{fr >= dBoas ? "✓ aprendeu" : "aprendendo…"}</div>
              </div>
            </In>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SK.map((t, k) => {
              const d = dApr - 4 + k * 4;
              return fr >= d && <In key={t} fr={fr} d={d} dx={160} dy={0}><Pill size={32} c={k === 3 && fr >= dRem ? PINK : CYAN} bg="rgba(94,231,255,0.1)">{t}</Pill></In>;
            })}
          </div>
        </div>
        {fr >= dBoas + 4 && <Stamp fr={fr} d={dBoas + 4} size={64} rot={-4} c={GREEN}>boas práticas ✓</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: a prévia ----------
const Studio = ({ fr, d, play }) => {
  const t = play ? (fr - play) / 30 : 0;
  const px = play ? ((fr - play) * 9) % 520 : 0;
  return (
    <Janela title="Remotion Studio" w={960} h={620} glow={!!play}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 260, height: 390, borderRadius: 18, background: "#f4f1ea", position: "relative", overflow: "hidden", border: "3px solid #4a3f78" }}>
          <div style={{ position: "absolute", left: 20, right: 20, top: 26, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#1a1236", textAlign: "center" }}>Juros compostos</div>
          <div style={{ position: "absolute", left: play ? -60 + (px % 360) : 60, top: 110 }}><Palito fr={fr} s={0.85} walk={!!play} c="#1a1236" /></div>
        </div>
      </div>
      <div style={{ marginTop: 26, height: 80, borderRadius: 14, background: "rgba(255,255,255,0.06)", position: "relative" }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 20 + k * 280, top: 14, width: 260, height: 22, borderRadius: 8, background: [PINKA(0.6), CYAN + "99", VIOLET + "99"][k] }} />)}
        <div style={{ position: "absolute", left: 20, right: 20, top: 46, height: 20, borderRadius: 8, background: "rgba(52,211,153,0.4)" }} />
        <div style={{ position: "absolute", left: 20 + (play ? (t * 120) % 860 : 0), top: 0, bottom: 0, width: 5, background: PINK }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, display: "flex", justifyContent: "center", gap: 30, fontSize: 44 }}>
        <span>⏮</span><span style={{ color: play ? PINK : "#fff", transform: `scale(${play && fr < play + 8 ? 1.3 : 1})`, display: "inline-block" }}>{play ? "⏸" : "▶️"}</span><span>⏭</span>
      </div>
    </Janela>
  );
};
const Item3 = ({ fr }) => {
  const d0 = at(68), dNpm = at(72), dDev = at(76), dAbre = at(77), dAss = at(82), dMes = at(86);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="👀" t="A prévia" sub="o estúdio abre" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {fr < dAbre + 2 ? (
          <In fr={fr} d={d0 + 4}><Term fr={fr} a={d0 + 8} b={dDev + 6} glow={fr >= dDev} cmd="npm run dev" h={220} out={[["iniciando o Studio…", dDev + 4, AMBER]]} /></In>
        ) : (
          <In fr={fr} d={dAbre + 2} dy={120}><Studio fr={fr} play={fr >= dAss ? dAss : 0} /></In>
        )}
        {fr >= dMes && <Stamp fr={fr} d={dMes} size={64} rot={-4} c={GREEN}>prévia na hora ✓</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: o pedido ----------
const CODE = [["<circle r={40} />", 109, PINK], ["<line /> corpo", 111, CYAN], ["<line /> braços", 112, CYAN], ["<line /> pernas", 113, CYAN]];
const Item4 = ({ fr }) => {
  const d0 = at(87), dAbre = at(91), dCl = at(93), dOutro = at(96), dPede = at(99), dJur = at(103), dComp = at(104), dO = at(105), dCirc = at(109), dTraco = at(111), dCod = at(112), dSem = at(114), dImg = at(116);
  const prompt = "um palitinho explicando juros compostos";
  const build = lin(fr, dCirc - 6, dCod + 6);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="💬" t="O pedido" sub="você descreve" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {fr >= d0 + 4 && (
          <In fr={fr} d={d0 + 4}>
            <Janela title={fr >= dOutro ? "terminal 2 · claude" : "terminal 2"} w={960} h={260} glow={fr >= dPede && fr < dComp + 6}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: GREY }}><span style={{ color: GREEN }}>$ </span>{typed("claude", fr, d0 + 10, dCl + 6)}</div>
              {fr >= dOutro && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: CYAN, marginTop: 6 }}>✻ Claude Code</div>}
              {fr >= dPede - 2 && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 38, color: "#fff", marginTop: 14, lineHeight: 1.3 }}><span style={{ color: PINK }}>&gt; </span>{typed(prompt, fr, dPede, dComp + 6)}{fr < dO && blink(fr)}</div>}
            </Janela>
          </In>
        )}
        {fr >= dCl - 2 && fr < dComp + 4 && (
          <In fr={fr} d={dCl - 2} dy={140}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "22px 40px", borderRadius: 40, background: WIN, border: `4px solid ${fr >= dPede ? PINK : CYAN}`, boxShadow: `0 0 50px ${PINKA(0.35)}`, transform: `scale(${1 + 0.04 * Math.sin(fr / 4)})` }}>
                <span style={{ fontSize: 64, color: CYAN }}>✻</span><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>Claude Code</span>
              </div>
              {fr >= dOutro && <In fr={fr} d={dOutro} dy={40}><Pill size={36} c={AMBER} bg="rgba(251,191,36,0.12)">terminal 1: Studio · terminal 2: Claude</Pill></In>}
              {fr >= dPede && <In fr={fr} d={dPede} dy={40}><Palito fr={fr} s={0.9} build={lin(fr, dPede, dComp)} c="rgba(255,255,255,0.5)" face={false} /></In>}
            </div>
          </In>
        )}
        {fr >= dComp + 4 && (
          <div style={{ display: "flex", gap: 22 }}>
            <In fr={fr} d={dComp + 4} dx={-140} dy={0}>
              <Janela title="Palito.tsx" w={500} h={440} glow={fr >= dCod && fr < dSem}>
                {fr < dCirc - 4 && <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: AMBER }}><Spin fr={fr} s={30} /> escrevendo…</div>}
                {CODE.map(([t, i, c]) => fr >= at(i) - 4 && <div key={t} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: c, marginBottom: 16, transform: `translateX(${(1 - pop(fr, at(i) - 4, 12)) * -100}px)` }}>{t}</div>)}
                {fr >= dCod && <div style={{ marginTop: 10 }}><Pill size={30} c={GREEN}>código puro ✓</Pill></div>}
              </Janela>
            </In>
            <In fr={fr} d={dComp + 8} dx={140} dy={0}>
              <div style={{ width: 420, height: 440, borderRadius: 30, background: "#f4f1ea", border: `4px solid ${fr >= dCirc ? PINK : LINE}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 110, top: 40 }}><Palito fr={fr} s={1.0} build={build} point={fr >= dCod} c="#1a1236" /></div>
                {fr >= dCod && (
                  <div style={{ position: "absolute", left: 300, bottom: 70, display: "flex", alignItems: "flex-end", gap: 10 }}>
                    {[0.2, 0.35, 0.6, 1].map((h, k) => <div key={k} style={{ width: 22, height: 220 * h * ease(lin(fr, dCod + k * 2, dCod + k * 2 + 8)), borderRadius: 6, background: PINK }} />)}
                  </div>
                )}
              </div>
            </In>
          </div>
        )}
        {fr >= dSem && (
          <div style={{ position: "absolute", top: 660, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <In fr={fr} d={dSem} dy={50}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 30px", borderRadius: 26, background: "rgba(40,10,24,0.95)", border: `3px solid ${RED}`, transform: `translateX(${shake(fr, dImg, 12)}px)` }}>
              <span style={{ fontSize: 52, position: "relative" }}>🖼️<span style={{ position: "absolute", left: -6, top: 26, width: 76, height: 8, background: RED, transform: "rotate(-35deg)" }} /></span>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>sem gerar imagem</span>
            </div>
          </In>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: o render ----------
const Item5 = ({ fr }) => {
  const d0 = at(117), dCmd = at(121), dSai = at(123), dPronto = at(127), dAm = at(128), dTroca = at(129), dTexto = at(132), dRend = at(134), dNovo = at(136);
  const second = fr >= dAm;
  const v1 = ease(lin(fr, dSai - 2, dPronto));
  const v2 = ease(lin(fr, dRend, dNovo + 8));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="5" icon="🎬" t="O render" sub="sai o vídeo" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {!second ? (
          <>
            <In fr={fr} d={d0 + 4}><Term fr={fr} a={d0 + 8} b={dCmd + 10} glow={fr >= dCmd} cmd="npx remotion render" h={200} /></In>
            {fr >= dSai - 4 && <In fr={fr} d={dSai - 4}><Prog v={v1} /></In>}
            {fr >= dPronto && (
              <In fr={fr} d={dPronto} dy={100}>
                <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "26px 40px", borderRadius: 30, background: WIN, border: `4px solid ${GREEN}`, boxShadow: `0 0 60px rgba(52,211,153,0.4)` }}>
                  <span style={{ fontSize: 90 }}>🎞️</span>
                  <div><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: "#fff" }}>video.mp4</div><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREEN }}>✓ pronto</div></div>
                </div>
              </In>
            )}
          </>
        ) : (
          <>
            <In fr={fr} d={dAm}><Semana fr={fr} d={dAm - 30} step={0} hot={1} w={118} /></In>
            {fr >= dTroca - 2 && (
              <In fr={fr} d={dTroca - 2} dy={60}>
                <Janela title="roteiro do dia" w={900} h={210} glow={fr >= dTexto && fr < dRend}>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff" }}>
                    tema: {fr < dTexto - 4 ? <span style={{ textDecoration: fr >= dTroca + 6 ? "line-through" : "none", color: fr >= dTroca + 6 ? GREY : "#fff" }}>juros compostos</span> : <span style={{ color: PINK }}>{typed("inflação", fr, dTexto - 4, dTexto + 6)}</span>}{blink(fr)}
                  </div>
                </Janela>
              </In>
            )}
            {fr >= dRend - 2 && <In fr={fr} d={dRend - 2}><Prog v={v2} /></In>}
            {fr >= dNovo + 6 && <Stamp fr={fr} d={dNovo + 6} size={72} rot={-4} c={GREEN}>vídeo novo ✓</Stamp>}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- virada: o que precisa ----------
const AGENTES = ["Claude Code", "Codex", "Kimi Code", "OpenCode"];
const Item6 = ({ fr }) => {
  const d0 = at(137), dPrec = at(139), dNode = at(141), dAg = at(145), dCod = at(147), dMaio = at(149), dPaga = at(152);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <In fr={fr} d={d0}><Pill size={46} c={PINK} bg={PINKA(0.15)}>🧰 você só precisa de</Pill></In>
      </div>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={dPrec - 2}>
          <Janela title="checklist" w={900} h={300}>
            {[["Node.js", dNode], ["um agente de código", dAg]].map(([t, d]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26 }}>
                <div style={{ width: 66, height: 66, borderRadius: 16, border: `4px solid ${fr >= d ? GREEN : LINE}`, background: fr >= d ? GREEN : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: "#0b0618", fontWeight: 800, transform: `scale(${fr >= d ? 0.8 + 0.2 * pop(fr, d, 8) : 1})` }}>{fr >= d ? "✓" : ""}</div>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: fr >= d ? "#fff" : GREY }}>{t}</span>
              </div>
            ))}
          </Janela>
        </In>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 420px)", gap: 16 }}>
          {AGENTES.map((t, k) => fr >= dCod - 4 + k * 3 && <In key={t} fr={fr} d={dCod - 4 + k * 3} dy={60}><div style={{ padding: "20px", borderRadius: 22, background: WIN, border: `3px solid ${k === 0 ? PINK : LINE}`, fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", textAlign: "center" }}>{t}</div></In>)}
        </div>
        {fr >= dMaio && (
          <div style={{ transformOrigin: "50% 0", transform: `rotate(${Math.sin((fr - dMaio) / 4) * 10 * Math.exp(-(fr - dMaio) / 30)}deg)`, marginTop: 10 }}>
            <In fr={fr} d={dMaio} dy={-80}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 4, height: 50, background: GREY }} />
                <div style={{ padding: "18px 40px", borderRadius: 18, background: AMBER, fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#0b0618" }}>💳 {fr >= dPaga ? "a maioria é paga" : "assinatura"}</div>
              </div>
            </In>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(153), dPrim = at(156), dPal = at(160), dCom = at(161), dK = at(162), dSeg = at(165);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>{fr >= dPrim ? "o 1º vídeo?" : "qual seria…"}</div></In>
        <div style={{ display: "flex", gap: 30, alignItems: "flex-end", height: 330 }}>
          {[0, 1, 2].map((k) => fr >= d0 + 3 + k * 4 && <div key={k} style={{ transform: `translateY(${(1 - pop(fr, d0 + 3 + k * 4, 11)) * 300}px)` }}><Palito fr={fr} k={k * 2} s={k === 1 ? 1.1 : 0.85} wave={fr >= dPal || k === 1} c={k === 1 ? "#fff" : k ? CYAN : PINK} build={lin(fr, d0 + 3 + k * 4, d0 + 13 + k * 4)} /></div>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 20, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 5; if (fr < t0) return null; const q = ((fr - t0) % 36) / 34; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : LINE}`, opacity: Math.max(0.35, lin(fr, d0 + 10, dCom)), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("PALITO", fr, dK - 2, dK + 8)}{blink(fr)}</span>
            {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["zero", "desenho", "camera", "video", "dia", "palitinho", "ia", "5", "quinto", "postar", "projeto", "terminal", "comando", "create", "pronto", "branco", "remotion", "skills", "add", "agente", "aprende", "praticas", "previa", "npm", "dev", "estudio", "assiste", "pedido", "claude", "code", "pede", "juros", "compostos", "circulo", "traco", "codigo", "puro", "imagem", "render", "amanha", "texto", "renderiza", "novo", "node", "paga", "primeiro", "palito", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/º]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "i" && nn(k + 1) === "a") { push("IA", k + 1); continue; }
    if (n === "n" && nn(k + 1) === "p" && nn(k + 2) === "m") { push("npm", k + 2); continue; }
    if (n === "um" && nn(k + 1) === "video" && nn(k + 2) === "por") { push("1 vídeo", k + 1); continue; }
    if (n === "cinco") { push("5", k); continue; }
    if (n === "quinto") { push("5º", k); continue; }
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
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[,!?:;…"]+$/g, "").replace(/\.$/, "");
        const key = w.key === undefined ? KEY.has(norm(shown)) : w.key;
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortPalitinho = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(31), at(49), at(68), at(87), at(117), at(137), at(153), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, Item6, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(3)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(139)} b={at(147)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(162)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.55, 15)}
      {S(at(2), "error", 0.45, 15)}
      {S(at(6), "whoosh", 0.7, 30)}
      {[0, 2, 4, 6, 8, 10, 12].map((o) => S(at(6) + 2 + o, "pop", 0.25, 15))}
      {S(at(8) + 4, "ding", 0.35, 20)}
      {S(at(13), "whoosh", 0.8, 30)}
      {[0, 3, 6, 9, 12].map((o) => S(at(19) + o, "pop", 0.3, 15))}
      {S(at(23), "riser", 0.35, 30)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(42), "ding", 0.35)}
      {S(at(46), "pop", 0.4, 15)}
      {[0, 4, 8, 12, 16].map((o) => S(at(62) - 4 + o, "pop", 0.25, 15))}
      {S(at(77) + 2, "whoosh", 0.5, 30)}
      {S(at(86), "ding", 0.4)}
      {S(at(109), "pop", 0.35, 15)}
      {S(at(111), "pop", 0.35, 15)}
      {S(at(114), "error", 0.4, 15)}
      {S(at(123), "riser", 0.25, 30)}
      {S(at(127), "ding", 0.45)}
      {S(at(134), "riser", 0.25, 30)}
      {S(at(136) + 6, "ding", 0.45)}
      {S(at(141), "pop", 0.4, 15)}
      {S(at(145), "pop", 0.4, 15)}
      {S(at(149), "coin", 0.35, 15)}
      {S(at(162) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaPalitinho = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Zero desenho,<br />zero câmera</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>1 vídeo por dia</div>
    </div>
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
        <Palito fr={6} k={0} s={1.1} walk c={PINK} />
        <Palito fr={4} k={1} s={1.6} wave c="#fff" />
        <Palito fr={10} k={2} s={1.1} walk c={CYAN} />
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>canal de palitinho com IA</div>
    </div>
  </AbsoluteFill>
);
