import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 26/11/2026 07:00 — "O Gemini novo entrou no top 3 das IAs" (Gemini 4 Neon).
// Fatos conferidos na fonte primária (Google, blog.google, 18/11/2026; trechos em fontes/fonte-1.txt):
// - #3 geral com 61 pontos no Artificial Analysis Intelligence Index (xhigh), "just behind larger, slower models";
// - #1 no Artificial Analysis Coding Agent Index (58.6);
// - janela de contexto de 1 milhão de tokens (planilhas, PDFs, gráficos, áudio, vídeo);
// - US$ 3 / milhão de tokens de entrada, US$ 15 / milhão de saída; no nível padrão (high) 32% menor custo por tarefa que o Carbon;
//   Carbon = "your hardest, long-horizon projects"; quatro níveis de raciocínio;
// - app Gemini (assinantes Pro e Ultra, seletor de modelo) e Gemini API no Google AI Studio (model=gemini-4-neon).
// Tudo é interface recriada em motion: nenhum print, nada gerado por IA, nenhum logo oficial, nenhum crédito na tela.
export const SGN_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-26-0700-gemini-4-neon";
export const SGN_FPS = 30;
const MUSIC = "phanterai/music/Coding_at_Night.mp3";
const SRM_SLUG = SGN_SLUG;
const SRM_FPS = SGN_FPS;
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
export const calculateGeminiNeonMetadata = async () => {
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

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dMundo = at(3), dNem = at(5), dMaior = at(8), dGem = at(11), dNeon = at(13), dQuatro = at(17), dQuarto = at(21), dBolso = at(25);
  let big, bigD, size = 170, bg = PINK, rot = -3;
  if (fr < dNem) { big = "TOP 3"; bigD = 0; size = 190; }
  else if (fr < dGem) { big = "nem é a maior!"; bigD = dNem; size = 120; bg = RED; rot = 2; }
  else if (fr < dQuatro) { big = "Gemini 4 Neon"; bigD = dGem; size = 120; }
  else if (fr < dQuarto) { big = "4 números"; bigD = dQuatro; size = 130; rot = 2; }
  else { big = "o 4º: seu bolso"; bigD = dQuarto; size = 110; }
  const flash = [dNem, dGem, dQuatro, dQuarto].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const rows = [
    { label: "modelo maior", v: 0.95 },
    { label: "modelo maior", v: 0.9 },
    { label: fr >= dNeon ? "Gemini 4 Neon" : fr >= dGem ? "Gemini…" : "???", v: 0.86, hot: true },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dQuatro && (
        <div style={{ position: "absolute", top: 470, left: 90, width: 900, height: 560 }}>
          <div style={{ position: "absolute", top: -6, left: 0, right: 0, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: BODY, opacity: lin(fr, dMundo - 3, dMundo + 3) }}>
            <span style={{ display: "inline-block", transform: `rotate(${fr * 4}deg)` }}>🌍</span> ranking mundial de IAs
          </div>
          {rows.map((r, k) => {
            const d = k * 3;
            const p = d === 0 ? 1 : pop(fr, d, 12);
            const v = r.v * ease(lin(fr, d, d + 14));
            const tag = k < 2 ? (fr >= dMaior ? "🐘 maior · mais lento" : null) : (fr >= dMaior + 4 ? "⚡ mais leve" : null);
            return (
              <div key={k} style={{ transform: `translateX(${(1 - p) * 900}px) translateX(${k === 2 ? shake(fr, dGem, 16) : 0}px)` }}>
                <RankRow fr={fr} pos={k + 1} top0={80} gap={150} label={r.label} v={v} hot={r.hot && fr >= dGem} right={tag && <span style={{ fontFamily: inter, fontSize: 30, color: k < 2 ? AMBER : GREEN, opacity: lin(fr, k < 2 ? dMaior : dMaior + 4, (k < 2 ? dMaior : dMaior + 4) + 5) }}>{tag}</span>} h={118} />
              </div>
            );
          })}
          {fr >= dNeon && <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}><Stamp fr={fr} d={dNeon} size={56} rot={-3} c={GOLD}>4 números · o 4º: seu bolso 💸</Stamp></div>}
          {fr >= dNem && fr < dGem && <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}><Stamp fr={fr} d={dNem + 2} size={58} rot={-4} c={RED}>o 3º lugar</Stamp></div>}
        </div>
      )}
      {fr >= dQuatro && (
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <div style={{ display: "flex", gap: 22 }}>
            {["🧠", "💻", "📚", "💸"].map((ic, n) => {
              const d = dQuatro + n * 3, last = n === 3, hot = last && fr >= dQuarto;
              return (
                <In key={n} fr={fr} d={d} dy={140}>
                  <div style={{ width: 200, height: 270, borderRadius: 30, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateX(${hot ? shake(fr, dBolso, 16) : 0}px) scale(${hot ? 1.15 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1 }}>{n + 1}</div>
                    <div style={{ fontSize: 64 }}>{last && fr < dBolso ? "❓" : ic}</div>
                  </div>
                </In>
              );
            })}
          </div>
          {fr >= dBolso && <Stamp fr={fr} d={dBolso} size={64} rot={-3} c={GOLD}>💸 o mais importante</Stamp>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: 61 pontos ----------
const Item1 = ({ fr }) => {
  const d0 = at(26), dSes = at(28), dPts = at(31), dInd = at(33), dAA = at(35), dTer = at(37), dGer = at(39), dAtr = at(40), dMai = at(44), dLen = at(47);
  const score = count(fr, dSes, dPts + 6, 0, 61);
  const ang = -180 + 180 * (score / 100);
  // Neon sobe da 6ª para a 3ª posição quando a fala diz "terceiro"
  const pos = interpolate(fr, [dTer - 8, dTer + 4], [5, 3], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🧠" t="61 pontos" sub="índice de inteligência" />
      <div style={{ position: "absolute", top: 410, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {fr < dInd + 2 ? (
          <In fr={fr} d={d0 + 4}>
            <div style={{ position: "relative", width: 640, height: 360 }}>
              <svg width={640} height={340} viewBox="0 0 640 340">
                <path d="M40 320 A280 280 0 0 1 600 320" stroke="rgba(255,255,255,0.1)" strokeWidth={46} fill="none" strokeLinecap="round" />
                <path d="M40 320 A280 280 0 0 1 600 320" stroke={PINK} strokeWidth={46} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - score / 100} />
                <line x1={320} y1={320} x2={320 + 230 * Math.cos((ang * Math.PI) / 180)} y2={320 + 230 * Math.sin((ang * Math.PI) / 180)} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
                <circle cx={320} cy={320} r={22} fill="#fff" />
              </svg>
              <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 150, color: "#fff", transform: `scale(${fr >= dPts ? 1 + 0.15 * Math.max(0, 1 - (fr - dPts) / 8) : 1})` }}>{score}</div>
            </div>
          </In>
        ) : (
          <In fr={fr} d={dInd + 2}>
            <Janela title="Intelligence Index · Artificial Analysis" w={960} h={800} glow={fr >= dTer}>
              <div style={{ position: "relative", height: 700 }}>
                {[1, 2, 3, 4].map((p, k) => {
                  const shown = fr >= dInd + 4 + k * 3;
                  const myPos = p + Math.min(1, Math.max(0, p + 1 - pos));
                  return shown && <div key={p} style={{ opacity: lin(fr, dInd + 4 + k * 3, dInd + 8 + k * 3) }}>
                    <RankRow fr={fr} pos={p <= 2 ? p : myPos} top0={10} gap={118} w={900} h={100} label={p <= 2 ? "modelo maior" : "outro modelo"} v={[0.96, 0.92, 0.8, 0.74][k]}
                      right={p <= 2 && fr >= dMai ? <span style={{ fontFamily: inter, fontSize: 30, color: AMBER, opacity: lin(fr, dMai, dMai + 5) }}>🐘 maior{fr >= dLen ? " · 🐢 lento" : ""}</span> : null} />
                  </div>;
                })}
                {fr >= dInd + 10 && <div style={{ transform: `translateX(${shake(fr, dTer + 4, 14)}px)` }}>
                  <RankRow fr={fr} pos={pos} top0={10} gap={118} w={900} h={100} hot label="Gemini 4 Neon" v={0.88} right={fr >= dTer ? "61" : null} />
                </div>}
                {fr >= dGer && <div style={{ position: "absolute", top: 600, width: "100%", textAlign: "center" }}><Stamp fr={fr} d={dGer} size={72} rot={-4}>#3 geral 🥉</Stamp></div>}
                {fr >= dAtr && fr < dMai && <div style={{ position: "absolute", left: 40, top: 30, fontSize: 70, transform: `translateY(${Math.sin(fr / 3) * 10}px)` }}>👆</div>}
              </div>
            </Janela>
          </In>
        )}
        {fr >= dAA - 4 && fr < dInd + 2 && <Pill size={40} c={CYAN} bg="rgba(94,231,255,0.1)">Artificial Analysis</Pill>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: 1º em código ----------
const CODE = ["def corrigir_bug(repo):", "  falhas = rodar_testes(repo)", "  for erro in falhas:", "    editar(erro.arquivo)", "  return rodar_testes(repo)"];
const Item2 = ({ fr }) => {
  const d0 = at(48), dPri = at(50), dCod = at(52), dRank = at(54), dAg = at(56), dProg = at(58), dNum = at(62), dUm = at(63);
  const pos = interpolate(fr, [dProg - 4, dNum + 2], [4, 1], { ...clamp, easing: ease });
  const hit = fr >= dNum + 2;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="💻" t="1º em código" sub="agentes de programação" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {fr < dRank ? (
          <In fr={fr} d={d0 + 4}>
            <Janela title="agente.py" w={960} h={520} glow={fr >= dCod}>
              {CODE.map((l, k) => {
                const a = d0 + 8 + k * 6;
                return fr >= a && <div key={k} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: k === 0 ? PINK : "#fff", lineHeight: 1.5, whiteSpace: "pre" }}>{typed(l, fr, a, a + 7)}</div>;
              })}
              {fr >= dCod && <div style={{ marginTop: 22, opacity: lin(fr, dCod, dCod + 4) }}><Pill size={36}>✓ 12 testes passando</Pill></div>}
            </Janela>
          </In>
        ) : (
          <In fr={fr} d={dRank}>
            <Janela title="Coding Agent Index · Artificial Analysis" w={960} h={680} glow={hit}>
              <div style={{ position: "relative", height: 590 }}>
                {[1, 2, 3].map((p, k) => fr >= dRank + 2 + k * 2 && <div key={p}><RankRow fr={fr} pos={p + Math.min(1, Math.max(0, p + 1 - pos))} top0={10} gap={118} w={900} h={100} label="outro agente" v={[0.9, 0.85, 0.8][k]} /></div>)}
                {fr >= dAg && <div style={{ transform: `translateX(${shake(fr, dNum + 2, 16)}px)` }}><RankRow fr={fr} pos={pos} top0={10} gap={118} w={900} h={100} hot label="Gemini 4 Neon" v={0.95} right={hit ? "58,6" : null} /></div>}
                {hit && <div style={{ position: "absolute", top: 480, width: "100%", textAlign: "center" }}><Stamp fr={fr} d={dNum + 2} size={84} rot={-4} c={GOLD}>🏆 Nº 1</Stamp></div>}
              </div>
            </Janela>
          </In>
        )}
        {fr >= dPri && fr < dRank && <In fr={fr} d={dPri}><Pill size={44} c={GOLD} bg="rgba(255,209,102,0.12)">🥇 primeiro lugar</Pill></In>}
      </div>
      <Confete fr={fr} d={dUm + 2} />
    </AbsoluteFill>
  );
};

// ---------- 3: 1 milhão de tokens ----------
const FILES = [["📊", "vendas.xlsx", 70], ["📄", "contrato.pdf", 71], ["🎧", "reuniao.mp3", 72], ["🎬", "aula.mp4", 74]];
const Item3 = ({ fr }) => {
  const d0 = at(64), dUm = at(66), dTok = at(69), dNuma = at(75), dConv = at(76), dSo = at(77);
  const n = count(fr, dUm - 2, dTok + 6, 0, 1000000);
  const fill = FILES.reduce((s, [, , i]) => s + 0.2 * ease(lin(fr, at(i), at(i) + 8)), 0.05);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📚" t="1 milhão de tokens" sub="numa conversa só" />
      <div style={{ position: "absolute", top: 410, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 3}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 104, color: "#fff", textAlign: "center", textShadow: fr >= dTok ? `0 0 ${30 + 20 * Math.sin(fr / 4)}px ${PINK}` : "none", transform: `scale(${fr >= dTok ? 1 + 0.12 * Math.max(0, 1 - (fr - dTok) / 8) + 0.03 * Math.sin(fr / 5) : 1})` }}>
            {n.toLocaleString("pt-BR")} <span style={{ fontSize: 44, color: PINK }}>tokens</span>
          </div>
        </In>
        <In fr={fr} d={d0 + 8}>
          <Janela title="Gemini 4 Neon · conversa" w={960} h={640} glow={fr >= dConv}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {FILES.map(([ic, nm, i]) => {
                const d = at(i) - 2;
                if (fr < d) return null;
                const p = pop(fr, d, 11);
                return <div key={nm} style={{ width: 430, display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: `2px solid ${LINE}`, boxSizing: "border-box", transform: `translate(${(1 - p) * 500}px, ${(1 - p) * -300}px) rotate(${(1 - p) * 30}deg)` }}>
                  <span style={{ fontSize: 56 }}>{ic}</span><span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, color: "#fff" }}>{nm}</span>
                  {fr >= d + 8 && <span style={{ marginLeft: "auto", color: GREEN, fontFamily: inter, fontWeight: 800, fontSize: 36 }}>✓</span>}
                </div>;
              })}
            </div>
            <div style={{ position: "absolute", left: 28, right: 28, bottom: 28 }}>
              {fr >= dNuma && <div style={{ alignSelf: "flex-end", marginLeft: "auto", width: "fit-content", maxWidth: 760, background: PINK, borderRadius: "28px 28px 6px 28px", padding: "18px 26px", fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", marginBottom: 20 }}>{typed("Resume tudo num relatório", fr, dNuma, dSo + 4)}{blink(fr)}</div>}
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: GREY, marginBottom: 8 }}>contexto usado</div>
              <Prog v={Math.min(1, fill)} w={904} />
            </div>
          </Janela>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: o preço ----------
const Item4 = ({ fr }) => {
  const d0 = at(78), dPre = at(81), dTres = at(82), dEnt = at(89), dQui = at(90), dSai = at(92), dModo = at(93), dPad = at(95), dTar = at(96), dTri = at(99), dCento = at(103), dBar = at(105), dCarb = at(108), dIrm = at(110), dProj = at(114), dDif = at(116);
  const phase2 = fr >= dModo - 2;
  const nv = interpolate(fr, [dTri - 2, dCento + 4], [1, 0.68], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="💸" t="O preço" sub="por milhão de tokens" />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {!phase2 ? (
          <div style={{ display: "flex", gap: 60, height: 560, alignItems: "flex-start" }}>
            {fr < dTres && <In fr={fr} d={dPre - 4}><div style={{ fontSize: 260, marginTop: 60, transform: `rotate(${Math.sin(fr / 4) * 8}deg)` }}>🏷️</div></In>}
            <Tag fr={fr} d={dTres} price="US$ 3" label="entrada" />
            <Tag fr={fr} d={dQui - 2} price="US$ 15" label="saída" c="#7c4dff" />
          </div>
        ) : (
          <>
            <In fr={fr} d={dModo - 2}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 22px", borderRadius: 26, background: WIN, border: `2px solid ${LINE}` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: BODY, marginRight: 6 }}>raciocínio</span>
                {[0, 1, 2, 3].map((k) => {
                  const on = k === 2 && fr >= dPad;
                  return <div key={k} style={{ height: 66, minWidth: on ? 230 : 66, borderRadius: 33, background: on ? PINK : "rgba(255,255,255,0.08)", border: `3px solid ${on ? PINK : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", transform: `scale(${on ? 0.8 + 0.2 * pop(fr, dPad, 9) : 1})` }}>{on ? "padrão ✓" : ""}</div>;
                })}
              </div>
            </In>
            {fr >= dTar - 2 && <In fr={fr} d={dTar - 2}>
              <Janela title="custo por tarefa" w={960} h={420} glow={fr >= dBar}>
                <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 20 }}>
                  <Bar label="Carbon" v={ease(lin(fr, dTar, dTar + 10))} c="rgba(190,170,255,0.6)" w={620} h={90} lw={230} glow={fr >= dCarb && fr < dIrm + 8} right="100%" />
                  <Bar label="Neon" v={ease(lin(fr, dTar + 4, dTar + 14)) * nv} c={PINK} w={620} h={90} lw={230} glow right={fr >= dTri ? `${Math.round(nv * 100)}%` : ""} />
                </div>
                {fr >= dBar && <div style={{ position: "absolute", right: 40, bottom: 20 }}><Stamp fr={fr} d={dBar} size={86} rot={-6} c={GREEN}>−32%</Stamp></div>}
              </Janela>
            </In>}
            {fr >= dIrm - 2 && <In fr={fr} d={dIrm - 2}>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ padding: "18px 26px", borderRadius: 26, background: WIN, border: `3px solid ${fr >= dProj ? AMBER : LINE}`, fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", transform: `scale(${fr >= dDif ? 1 + 0.06 * Math.max(0, 1 - (fr - dDif) / 8) : 1})` }}>🧗 Carbon <span style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, color: fr >= dProj ? AMBER : BODY }}>{fr >= dProj ? "projetos difíceis" : "irmão"}</span></div>
                <div style={{ padding: "18px 26px", borderRadius: 26, background: PINKA(0.2), border: `3px solid ${PINK}`, fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>⚡ Neon</div>
              </div>
            </In>}
          </>
        )}
        {!phase2 && fr >= dSai && <Stamp fr={fr} d={dSai} size={56} rot={-3} c={CYAN}>por milhão de tokens</Stamp>}
        {!phase2 && fr >= dEnt && fr < dSai && <Pill size={40} c={GREEN}>⬇ entrada · ⬆ saída</Pill>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: onde usar ----------
const Item5 = ({ fr }) => {
  const d0 = at(117), dApp = at(120), dGem = at(122), dAss = at(125), dPro = at(126), dUlt = at(128), dAI = at(131), dStu = at(132), dAPI = at(134);
  const open = fr >= dApp + 4;
  const pick = fr >= dGem + 6;
  const phone = fr < dAI - 2;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="?" icon="📍" t="Onde usar" sub="já disponível" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {phone ? (
          <In fr={fr} d={d0 + 4}>
            <div style={{ width: 520, height: 800, borderRadius: 64, background: "#0d0820", border: "10px solid #2a1f4a", position: "relative", boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.25)}`, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 18, left: 190, width: 120, height: 30, borderRadius: 15, background: "#000" }} />
              <div style={{ position: "absolute", top: 80, left: 30, right: 30, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>app Gemini</div>
              <div style={{ position: "absolute", top: 150, left: 30, right: 30, padding: "16px 20px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: `2px solid ${open ? PINK : LINE}`, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", display: "flex" }}>
                {pick ? "Gemini 4 Neon" : "escolher modelo"}<span style={{ marginLeft: "auto" }}>{open && !pick ? "▴" : "▾"}</span>
              </div>
              {open && !pick && ["Hydrogen", "Neon", "Carbon"].map((m, k) => (
                <div key={m} style={{ position: "absolute", top: 230 + k * 84, left: 30, right: 30, height: 72, borderRadius: 16, background: m === "Neon" && fr >= dGem ? PINKA(0.35) : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", paddingLeft: 20, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", opacity: lin(fr, dApp + 4 + k * 2, dApp + 8 + k * 2) }}>Gemini 4 {m}</div>
              ))}
              {open && !pick && <Cursor x={300} y={interpolate(fr, [dApp + 6, dGem], [600, 340], clamp)} fr={fr} click={dGem} />}
              {pick && <div style={{ position: "absolute", top: 260, left: 30, right: 30, display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ alignSelf: "flex-end", background: PINK, borderRadius: "26px 26px 6px 26px", padding: "16px 22px", fontFamily: inter, fontWeight: 800, fontSize: 28, color: "#fff" }}>{typed("Compara esses 3 orçamentos", fr, dGem + 8, dAss + 4)}</div>
                {fr >= dAss + 2 && <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "26px 26px 26px 6px", padding: "16px 22px", fontFamily: inter, fontWeight: 400, fontSize: 28, color: "#fff", display: "flex", gap: 12, alignItems: "center" }}><Spin fr={fr} c={PINK} s={28} /> analisando…</div>}
              </div>}
              <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
                {fr >= dPro && <In fr={fr} d={dPro}><Pill size={38}>Pro ✓</Pill></In>}
                {fr >= dUlt && <In fr={fr} d={dUlt}><Pill size={38}>Ultra ✓</Pill></In>}
              </div>
            </div>
          </In>
        ) : (
          <In fr={fr} d={dAI - 2}>
            <Janela title="AI Studio · Gemini API" w={960} h={520} glow={fr >= dAPI}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 38, color: "#fff", lineHeight: 1.6 }}>
                <div style={{ color: GREY }}>{typed("// escolha o modelo", fr, dAI, dAI + 6)}</div>
                <div>{typed('model: "gemini-4-neon"', fr, dAI + 4, dStu + 10)}{fr < dAPI && blink(fr)}</div>
              </div>
              {fr >= dAPI && <div style={{ marginTop: 30, display: "flex", gap: 20 }}><Pill size={44}>API ✓</Pill><Pill size={44} c={CYAN} bg="rgba(94,231,255,0.1)">1M tokens</Pill></div>}
            </Janela>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(135), dTro = at(136), dIA = at(139), dEle = at(141), dCom = at(142), dK = at(143), dSeg = at(146);
  const sw = ease(lin(fr, dEle - 2, dEle + 8));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 110, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>{fr >= dTro ? "você trocaria?" : "você…"}</div></In>
        <div style={{ position: "relative", width: 900, height: 200 }}>
          {[["🤖 sua IA", 0], ["⚡ Gemini 4 Neon", 1]].map(([t, k]) => {
            if (fr < dTro + k * 4) return null;
            const x = k === 0 ? 20 + sw * 440 : 480 - sw * 460;
            return <div key={t} style={{ position: "absolute", left: x, top: 40 + (k === 0 ? -1 : 1) * Math.sin(sw * Math.PI) * 50, padding: "26px 30px", borderRadius: 28, background: k ? PINKA(0.25) : WIN, border: `3px solid ${k ? PINK : LINE}`, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap", opacity: lin(fr, dTro + k * 4, dTro + k * 4 + 5) }}>{t}</div>;
          })}
          {fr >= dIA && <div style={{ position: "absolute", left: 410, top: 60, fontSize: 70, transform: `rotate(${sw * 180}deg)` }}>🔄</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 20, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 5; if (fr < t0) return null; const q = ((fr - t0) % 36) / 34; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : LINE}`, opacity: Math.max(0.35, lin(fr, d0 + 10, dCom)), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("NEON", fr, dK - 2, dK + 8)}{blink(fr)}</span>
            {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["top 3", "mundo", "maior", "gemini", "neon", "google", "4", "4º", "bolso", "61", "pontos", "indice", "artificial", "analysis", "terceiro", "geral", "maiores", "lentos", "primeiro", "codigo", "ranking", "agentes", "programacao", "1", "1 milhao", "tokens", "planilha", "pdf", "audio", "video", "conversa", "preco", "us$ 3", "us$ 15", "entrada", "saida", "padrao", "tarefa", "32%", "barata", "carbon", "dificeis", "usar", "app", "pro", "ultra", "ai", "studio", "api", "trocaria", "ia", "comenta", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/º%$ ]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "top" && nn(k + 1) === "tres") { push("Top 3", k + 1); continue; }
    if (n === "sessenta" && nn(k + 1) === "e" && nn(k + 2) === "um") { push("61", k + 2); continue; }
    if (n === "trinta" && nn(k + 1) === "e" && nn(k + 2) === "dois" && nn(k + 3) === "por" && nn(k + 4) === "cento") { push("32%", k + 4); continue; }
    if (n === "um" && nn(k + 1) === "milhao") { push("1 milhão", k + 1); continue; }
    if (n === "tres" && nn(k + 1) === "dolares") { push("US$ 3", k + 1); continue; }
    if (n === "quinze") { push("US$ 15", k); continue; }
    if (n === "quatro") { push("4", k); continue; }
    if (n === "quarto") { push("4º", k); continue; }
    if (n === "numero" && nn(k + 1) === "um") { push("Nº 1", k + 1); continue; }
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

export const ShortGeminiNeon = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(26), at(48), at(64), at(78), at(117), at(135), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(5)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(103)} b={at(110)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(143)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {[0, 3, 6].map((o) => S(o + 2, "pop", 0.3, 15))}
      {S(at(5), "error", 0.45, 15)}
      {S(at(8), "pop", 0.35, 15)}
      {S(at(11), "whoosh", 0.8, 30)}
      {S(at(13), "ding", 0.4, 20)}
      {[0, 3, 6, 9].map((o) => S(at(17) + o, "pop", 0.3, 15))}
      {S(at(21), "riser", 0.3, 30)}
      {S(at(25), "coin", 0.45, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(31), "ding", 0.35)}
      {S(at(37) + 4, "whoosh", 0.4, 30)}
      {S(at(39), "ding", 0.45)}
      {S(at(44), "pop", 0.3, 15)}
      {S(at(52), "ding", 0.35)}
      {S(at(56), "riser", 0.25, 30)}
      {S(at(62) + 2, "ding", 0.5)}
      {[70, 71, 72, 74].map((i) => S(at(i) - 2, "pop", 0.3, 15))}
      {S(at(82), "coin", 0.45, 15)}
      {S(at(90) - 2, "coin", 0.45, 15)}
      {S(at(95), "pop", 0.4, 15)}
      {S(at(105), "ding", 0.5)}
      {S(at(122), "pop", 0.4, 15)}
      {S(at(126), "pop", 0.35, 15)}
      {S(at(128), "pop", 0.35, 15)}
      {S(at(134), "ding", 0.4)}
      {S(at(141) - 2, "whoosh", 0.4, 30)}
      {S(at(143) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaGeminiNeon = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1, letterSpacing: -3 }}>TOP 3</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff", lineHeight: 1.05 }}>do mundo…</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 100, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>e nem é a maior</div>
    </div>
    <div style={{ position: "absolute", top: 860, left: 90, width: 900, height: 420 }}>
      <RankRow fr={0} pos={1} top0={0} gap={140} label="modelo maior" v={0.95} h={112} right={<span style={{ fontFamily: inter, fontSize: 30, color: AMBER }}>🐘 maior</span>} />
      <RankRow fr={0} pos={2} top0={0} gap={140} label="modelo maior" v={0.9} h={112} right={<span style={{ fontFamily: inter, fontSize: 30, color: AMBER }}>🐘 maior</span>} />
      <RankRow fr={0} pos={3} top0={0} gap={140} label="Gemini 4 Neon" v={0.86} h={112} hot right="61" />
    </div>
    <div style={{ position: "absolute", top: 1330, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>o Gemini novo, em 4 números</div>
  </AbsoluteFill>
);
