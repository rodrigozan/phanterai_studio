import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 27/11/2026 07:00 — "Uma IA de voz que custa 1 centavo de dólar por minuto" (MAI Realtime 1, Microsoft AI).
// Fatos conferidos na fonte primária (microsoft.ai/news/introducing-mai-realtime-1, 17/11/2026; cópia em fontes/):
// - primeiro modelo speech-to-speech da Microsoft AI, a partir de US$ 0,01 por minuto de áudio; raciocínio à parte
//   (US$ 1 por milhão de tokens de entrada, US$ 5 por milhão de saída);
// - supera o GPT Realtime 2.1 em qualidade, velocidade e preço (avaliação da Microsoft); custo por hora no teste
//   Big Bench Audio: MAI Realtime 1 US$ 1,35 contra GPT-Realtime-2.1 High US$ 10,75;
// - lida com interrupção e sabe esperar a pessoa terminar; chama um motor de raciocínio mais forte sem pausa estranha;
//   entende com barulho ou outra pessoa falando; conecta a sistemas e ferramentas; compatível com a OpenAI Realtime API;
// - Agoda e Reservations.ai já testam; dá para experimentar no MAI Labs.
// Tudo é interface recriada em motion: nenhum print, nada gerado por IA, nenhum logo oficial, nenhum crédito na tela.
export const SVC_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-27-0700-voz-ia-1-centavo";
export const SVC_FPS = 30;
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const SRM_SLUG = SVC_SLUG;
const SRM_FPS = SVC_FPS;
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
export const calculateVozCentavoMetadata = async () => {
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
const Onda = ({ fr, n = 40, w = 820, h = 150, c = PINK, amp = 1, seed = 0, noise = 0 }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
    {Array.from({ length: n }, (_, k) => {
      const bw = w / n;
      const v = 0.25 + 0.75 * Math.abs(Math.sin(k * 1.31 + seed + fr / 3.2) * Math.cos(k * 0.47 + fr / 7 + seed));
      const jit = noise ? noise * Math.abs(Math.sin(k * 7.7 + fr * 1.9)) : 0;
      const a = Math.max(3, (v * amp + jit) * (h / 2 - 4));
      return <rect key={k} x={k * bw + bw * 0.2} y={h / 2 - a} width={bw * 0.6} height={a * 2} rx={bw * 0.3} fill={c} />;
    })}
  </svg>
);
const Bolha = ({ children, c = PINK, right, size = 46, style = {} }) => (
  <div style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start", ...style }}>
    <div style={{ background: c, borderRadius: right ? "34px 34px 8px 34px" : "34px 34px 34px 8px", padding: "18px 30px", fontFamily: inter, fontWeight: 800, fontSize: size, color: "#fff", maxWidth: 820 }}>{children}</div>
  </div>
);
const Linha = ({ who, c, children, glow }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 20px", borderRadius: 24, background: "rgba(255,255,255,0.05)", border: `2px solid ${glow ? c : LINE}`, marginBottom: 20 }}>
    <div style={{ width: 150, fontFamily: inter, fontWeight: 800, fontSize: 36, color: c }}>{who}</div>
    {children}
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dCv = at(3), dC = at(6), dUm = at(7), dDol = at(10), dMin = at(12), dBat = at(14), dGpt = at(16), dSao = at(18), dCin = at(19), dQui = at(23), dEsp = at(26);
  let big, bigD, size = 150, bg = PINK, rot = -3;
  if (fr < dDol) { big = "1 centavo?!"; bigD = 0; }
  else if (fr < dMin) { big = "de dólar"; bigD = dDol; rot = 2; bg = "#5b4a8a"; }
  else if (fr < dBat) { big = "por minuto"; bigD = dMin; }
  else if (fr < dSao) { big = fr >= dGpt ? "bate o GPT" : "e bate…"; bigD = fr >= dGpt ? dGpt : dBat; size = 120; rot = 2; }
  else { big = "5 truques"; bigD = dSao; size = 140; }
  const flash = [dCv, dC, dDol, dMin, dBat, dSao, dQui].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.45, 0);
  const mins = fr / 6;
  const mm = Math.floor(mins), ss = Math.floor((mins % 1) * 60);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.45, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dBat && (
        <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp) * (fr >= dCv ? 1 + 0.07 * Math.max(0, 1 - (fr - dCv) / 8) : 1)}) translateX(${shake(fr, dC, 12)}px)` }}>
            <Janela title="chamada com IA · ao vivo" w={960} h={560} glow>
              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <div style={{ width: 130, height: 130, borderRadius: 65, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, boxShadow: `0 0 ${30 + 20 * Math.sin(fr / 3)}px ${PINKA(0.8)}` }}>🎧</div>
                <div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff" }}>{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: GREEN }}>● conversando</div>
                </div>
              </div>
              <div style={{ marginTop: 26 }}><Onda fr={fr} w={904} h={150} /></div>
              <div style={{ marginTop: 20, display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: BODY }}>custo:</span>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: GOLD }}>US$ {(mm * 0.01).toFixed(2).replace(".", ",")}</span>
              </div>
            </Janela>
          </div>
          {fr >= dCv && fr < dUm - 2 && <div style={{ position: "absolute", top: 600, left: 70 }}><In fr={fr} d={dCv}><Bolha>Oi! Posso ajudar? 🎧</Bolha></In></div>}
          {fr >= dC - 2 && fr < dC + 14 && <div style={{ position: "absolute", left: 470, top: interpolate(fr, [dC - 2, dC + 8], [-300, 330], clamp), fontSize: 120, transform: `rotate(${fr * 20}deg)`, opacity: 1 - lin(fr, dC + 8, dC + 14) }}>🪙</div>}
          {fr >= dDol && <div style={{ position: "absolute", top: -95, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Stamp fr={fr} d={dDol} size={46} rot={-2} c={GOLD}>👀 5 truques · o 5º é o mais esperto</Stamp></div>}
          <div style={{ position: "absolute", top: 500, left: 70 }}><Tag fr={fr} d={dUm - 2} price="1¢" label="por minuto" /></div>
        </div>
      )}
      {fr >= dBat && fr < dSao && (
        <In fr={fr} d={dBat} style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `translateX(${shake(fr, dBat, 16)}px)` }}>
            <Janela title="custo por hora de áudio · teste" w={980} h={560} glow>
              <div style={{ display: "flex", flexDirection: "column", gap: 40, marginTop: 30 }}>
                <Bar label="MAI" lw={190} w={680} h={110} v={ease(lin(fr, dBat, dBat + 14)) * 1.35 / 10.75} c={`linear-gradient(90deg,#8a2a86,${PINK})`} glow right="US$ 1,35" />
                <Bar label="GPT" lw={190} w={680} h={110} v={ease(lin(fr, dGpt - 4, dGpt + 14))} c="rgba(255,92,122,0.7)" right={`US$ 10,75`} />
              </div>
              {fr >= dGpt + 8 && <div style={{ position: "absolute", right: 40, bottom: 34 }}><Stamp fr={fr} d={dGpt + 8} size={60} rot={-5} c={GREEN}>≈ 8x mais barato</Stamp></div>}
            </Janela>
          </div>
        </In>
      )}
      {fr >= dSao && (
        <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {["💬", "🧠", "🔊", "⚙️", "🔌"].map((ic, n) => {
              const d = dCin + n * 3, last = n === 4, hot = last && fr >= dQui;
              return (
                <In key={n} fr={fr} d={d} dy={140}>
                  <div style={{ width: 172, height: 250, borderRadius: 28, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateX(${hot ? shake(fr, dEsp, 16) : 0}px) scale(${hot ? 1.15 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1 }}>{n + 1}</div>
                    <div style={{ fontSize: 58 }}>{last ? "❓" : ic}</div>
                  </div>
                </In>
              );
            })}
          </div>
          <Stamp fr={fr} d={dQui + 2} size={58} rot={-3} c={GOLD}>o 5º é o mais esperto 🧠</Stamp>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- nome ----------
const Nome = ({ fr }) => {
  const d0 = at(28), dMai = at(30), dPri = at(34), dMs = at(37), dOuv = at(39), dRes = at(41), dVoz = at(43), dTem = at(45);
  const nodes = [["👂", "ouve", dOuv], ["🧠", "entende", Math.round((dOuv + dRes) / 2)], ["🗣️", "responde", dRes]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <In fr={fr} d={d0}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 40px", borderRadius: 36, background: WIN, border: `3px solid ${PINK}`, boxShadow: `0 0 60px ${PINKA(0.4)}` }}>
            <div style={{ width: 120, height: 120, borderRadius: 30, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, transform: `rotate(${Math.sin(fr / 6) * 6}deg)` }}>🎙️</div>
            <div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 76, color: "#fff", lineHeight: 1 }}>{typed("MAI Realtime 1", fr, dMai - 2, dMai + 14)}</div>
              <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 40, color: BODY, marginTop: 8, opacity: lin(fr, dMs, dMs + 5) }}>Microsoft AI</div>
            </div>
          </div>
        </In>
        <div style={{ height: 80 }}>{fr >= dPri && <In fr={fr} d={dPri}><Pill size={44} c={GOLD} bg="rgba(255,209,102,0.12)">1º modelo voz → voz</Pill></In>}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          {nodes.map(([ic, t, d], k) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 230, height: 230, borderRadius: 34, background: fr >= d ? PINKA(0.25) : WIN, border: `4px solid ${fr >= d ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${fr >= d ? 1 + 0.12 * Math.max(0, 1 - (fr - d) / 8) : 0.92})`, boxShadow: fr >= d ? `0 0 50px ${PINKA(0.5)}` : "none" }}>
                <div style={{ fontSize: 90 }}>{ic}</div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>{t}</div>
              </div>
              {k < 2 && <div style={{ width: 60, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${PINK} ${lin(fr, d, nodes[k + 1][2]) * 100}%, rgba(255,255,255,0.12) 0)` }} />}
            </div>
          ))}
        </div>
        <div style={{ opacity: fr >= dVoz - 4 ? 1 : 0.25 }}><Onda fr={fr} w={900} h={160} amp={fr >= dVoz - 4 ? 1 : 0.2} /></div>
        {fr >= dTem && <Stamp fr={fr} d={dTem} size={64} rot={-3} c={GREEN}>⚡ em tempo real</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: conversa de verdade ----------
const Item1 = ({ fr }) => {
  const d0 = at(47), dCon = at(49), dInt = at(53), dPar = at(56), dSab = at(57), dTer = at(60);
  const iaAmp = fr < dInt ? 1 : fr < dPar ? interpolate(fr, [dInt, dPar], [1, 0.4], clamp) : 0.04;
  const vcAmp = fr < dInt ? 0.05 : fr < dTer ? 1 : 0.04;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="💬" t="Conversa de verdade" sub="interrompe e ela para" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <In fr={fr} d={d0 + 4}>
          <Janela title="chamada · ao vivo" w={960} h={780} glow={fr >= dTer}>
            <Linha who="IA" c={PINK} glow={iaAmp > 0.5}><Onda fr={fr} w={660} h={120} amp={iaAmp} c={PINK} /></Linha>
            <Linha who="Você" c={CYAN} glow={vcAmp > 0.5}><Onda fr={fr} w={660} h={120} amp={vcAmp} c={CYAN} seed={3} /></Linha>
            <div style={{ height: 120 }}>
              {fr < dInt ? fr >= dCon && <Bolha>{typed("Claro! Seu pedido sai hoje e…", fr, dCon, dInt)}{blink(fr)}</Bolha>
                : fr < dSab ? <Bolha right c="#2a7f95">{fr >= dPar ? "espera, outra coisa…" : "espera…"}</Bolha>
                : <Bolha right c="#2a7f95">{typed("…e quero mudar o endereço", fr, dSab, dTer)}</Bolha>}
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 30, alignItems: "center", flexWrap: "wrap" }}>
              {fr >= dInt && <Stamp fr={fr} d={dInt} size={46} rot={-3} c={AMBER}>✋ interrompeu</Stamp>}
              {fr >= dPar && fr < dSab + 4 && <In fr={fr} d={dPar}><Pill size={40} c={PINK} bg={PINKA(0.15)}>⏸ parou na hora</Pill></In>}
              {fr >= dSab + 4 && fr < dTer && <In fr={fr} d={dSab + 4}><div style={{ display: "flex", gap: 14, alignItems: "center" }}><Spin fr={fr} c={PINK} s={44} /><Pill size={40} c={PINK} bg={PINKA(0.15)}>👂 ouvindo…</Pill></div></In>}
              {fr >= dTer && <In fr={fr} d={dTer}><Pill size={40}>✓ esperou você terminar</Pill></In>}
            </div>
          </Janela>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: pensa sem travar ----------
const Item2 = ({ fr }) => {
  const d0 = at(61), dTra = at(65), dPer = at(66), dCha = at(69), dRac = at(71), dFor = at(73), dSem = at(74), dEst = at(76);
  const on2 = fr >= dCha;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🧠" t="Pensa sem travar" sub="chama um raciocínio mais forte" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ width: 960, height: 110 }}>{fr >= dPer - 2 ? <In fr={fr} d={dPer - 2}><Bolha right c="#2a7f95">{typed("pergunta difícil 🤔", fr, dPer - 2, dPer + 10)}</Bolha></In> : fr >= dTra - 4 && <In fr={fr} d={dTra - 4}><Pill size={44}>✓ sem travar</Pill></In>}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <In fr={fr} d={d0 + 4}>
            <div style={{ width: 380, height: 330, borderRadius: 30, background: WIN, border: `4px solid ${!on2 || fr >= dEst ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ fontSize: 100, transform: `scale(${1 + 0.06 * Math.sin(fr / 3)})` }}>⚡</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>conversa rápida</div>
            </div>
          </In>
          <div style={{ width: 120, height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${PINK} ${lin(fr, dCha, dRac) * 100}%, rgba(255,255,255,0.12) 0)` }} />
          <In fr={fr} d={d0 + 8}>
            <div style={{ width: 380, height: 330, borderRadius: 30, background: on2 ? PINKA(0.25) : WIN, border: `4px solid ${on2 ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `scale(${fr >= dFor ? 1 + 0.1 * Math.max(0, 1 - (fr - dFor) / 8) : 1})`, boxShadow: on2 ? `0 0 60px ${PINKA(0.6)}` : "none", opacity: on2 ? 1 : 0.5 }}>
              <div style={{ fontSize: 100, transform: `rotate(${on2 ? Math.sin(fr / 2) * 8 : 0}deg)` }}>🧠</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>raciocínio forte</div>
              {fr >= dRac && fr < dSem && <Spin fr={fr} c={PINK} s={44} />}
            </div>
          </In>
        </div>
        <In fr={fr} d={d0 + 10}>
          <div style={{ width: 960, position: "relative" }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: BODY, marginBottom: 12 }}>a conversa</div>
            <div style={{ height: 90, borderRadius: 20, background: "rgba(255,255,255,0.06)", border: `2px solid ${LINE}`, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${lin(fr, d0 + 10, dEst + 6) * 100}%`, background: `linear-gradient(90deg,#8a2a86,${PINK})` }} />
            </div>
            {fr >= dSem && fr < dEst && <div style={{ position: "absolute", left: 360, top: 60 }}><In fr={fr} d={dSem}><Pill size={36} c={RED} bg="rgba(255,92,122,0.15)">⏳ pausa estranha</Pill><div style={{ position: "absolute", left: 40, top: -100 }}><Slash fr={fr} d={dSem + 4} size={260} /></div></In></div>}
            {fr >= dEst && <div style={{ position: "absolute", right: 0, top: 120 }}><Stamp fr={fr} d={dEst} size={56} rot={-4} c={GREEN}>✓ sem silêncio</Stamp></div>}
          </div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: entende no barulho ----------
const RUIDO = [["🚗", -330, 40], ["📢", 320, 10], ["🎵", -260, 300], ["🐶", 300, 290]];
const Item3 = ({ fr }) => {
  const d0 = at(77), dEnt = at(79), dBar = at(81), dOut = at(84), dFal = at(86);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="🔊" t="Entende no barulho" sub="até com outra pessoa falando" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <In fr={fr} d={d0 + 3}>
          <Janela title="microfone" w={960} h={780} glow={fr >= dFal}>
            <div style={{ position: "relative", height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {RUIDO.map(([ic, x, y], k) => { const d = d0 + 4 + k * 4; if (fr < d) return null; const p = pop(fr, d, 10); return <div key={k} style={{ position: "absolute", left: 420 + x * p, top: y + Math.sin(fr / 5 + k) * 14, fontSize: 80, opacity: fr >= dFal ? 0.3 : 1 }}>{ic}</div>; })}
              <div style={{ position: "absolute", top: 120, opacity: 0.55 }}><Onda fr={fr} w={880} h={190} c="rgba(160,150,190,0.8)" amp={fr >= dFal ? 0.15 : 0.5} noise={fr >= dFal ? 0 : 0.6} seed={5} /></div>
              <div style={{ position: "absolute", top: 120, opacity: fr >= dEnt ? 1 : 0 }}><Onda fr={fr} w={880} h={190} c={PINK} amp={0.8 * lin(fr, dEnt, dEnt + 8)} /></div>
              {fr >= dOut && <div style={{ position: "absolute", right: 10, top: 290 }}><In fr={fr} d={dOut}><div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 70 }}>👥</span><Bolha c="#5b4a8a" size={36}>blá blá blá</Bolha>{fr >= dFal && <div style={{ position: "absolute", left: 60, top: -60 }}><Slash fr={fr} d={dFal} size={220} /></div>}</div></In></div>}
            </div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {fr >= dBar && <In fr={fr} d={dBar}><Pill size={40} c={AMBER} bg="rgba(251,191,36,0.15)">🔊 barulho</Pill></In>}
              {fr >= dEnt + 2 && <In fr={fr} d={dEnt + 2}><Pill size={40} c={PINK} bg={PINKA(0.15)}>🎯 a sua voz</Pill></In>}
              {fr >= dFal + 4 && <In fr={fr} d={dFal + 4}><Pill size={40}>✓ entendeu</Pill></In>}
            </div>
          </Janela>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: ela faz ----------
const SAT = [["🗄️", "sistemas", -330, -40, 97], ["🛠️", "ferramentas", 330, -40, 99], ["📅", "agenda", -300, 270, 100], ["📦", "pedidos", 300, 270, 101], ["🎫", "chamados", 0, 360, 101]];
const Item4 = ({ fr }) => {
  const d0 = at(87), dNao = at(89), dResp = at(91), dFaz = at(93), dCon = at(95);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="⚙️" t="Ela faz" sub="não só responde" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", gap: 24, height: 110, alignItems: "center" }}>
          {fr >= dNao && <In fr={fr} d={dNao}><div style={{ position: "relative" }}><Pill size={44} c={GREY} bg="rgba(255,255,255,0.06)">💬 só responde</Pill>{fr >= dResp + 6 && <div style={{ position: "absolute", left: 90, top: -70 }}><Slash fr={fr} d={dResp + 6} size={220} /></div>}</div></In>}
          {fr >= dFaz && <Stamp fr={fr} d={dFaz} size={64} rot={-4} c={GREEN}>✓ ela FAZ</Stamp>}
        </div>
        <div style={{ position: "relative", width: 960, height: 760 }}>
          <svg width={960} height={760} style={{ position: "absolute", left: 0, top: 0 }}>
            {SAT.map(([, t, x, y, i]) => { const d = at(i) - 6; const p = ease(lin(fr, d, d + 8)); return fr >= dCon - 4 && <line key={t} x1={480} y1={250} x2={480 + x * p} y2={250 + y * p} stroke={fr >= d + 8 ? PINK : LINE} strokeWidth={8} strokeLinecap="round" strokeDasharray="18 12" strokeDashoffset={-fr * 3} />; })}
          </svg>
          <In fr={fr} d={d0 + 4} style={{ position: "absolute", left: 330, top: 150 }}>
            <div style={{ width: 300, height: 200, borderRadius: 34, background: PINK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${50 + 20 * Math.sin(fr / 4)}px ${PINKA(0.7)}` }}>
              <div style={{ fontSize: 80 }}>🎙️</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, color: "#fff" }}>MAI Realtime 1</div>
            </div>
          </In>
          {SAT.map(([ic, t, x, y, i]) => { const d = at(i) - 2; const ap = d0 + 6 + SAT.findIndex((q) => q[1] === t) * 3; if (fr < ap) return null; const on = fr >= d; return (
            <div key={t} style={{ position: "absolute", left: 480 + x - 105, top: 250 + y - 85, width: 210, height: 170, borderRadius: 28, background: on ? PINKA(0.22) : WIN, border: `3px solid ${on ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, transform: `scale(${0.6 + 0.4 * pop(fr, ap, 10)})`, opacity: on ? 1 : 0.55 }}>
              <div style={{ fontSize: 64 }}>{ic}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>{t}</div>
              {on && <div style={{ position: "absolute", top: -14, right: -14, width: 44, height: 44, borderRadius: 22, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 800 }}>✓</div>}
            </div>); })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: compatível ----------
const Item5 = ({ fr }) => {
  const d0 = at(102), dCom = at(105), dOpen = at(113), dQue = at(116), dApp = at(119), dMig = at(122), dFac = at(123);
  const plug = ease(lin(fr, dCom, dOpen + 2));
  const fase2 = fr >= dQue - 2;
  const mv = ease(lin(fr, dMig - 4, dMig + 8));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="5" icon="🔌" t="Compatível" sub="com a API Realtime da OpenAI" />
      <div style={{ position: "absolute", top: 460, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {!fase2 ? (
          <In fr={fr} d={d0 + 4}>
            <div style={{ position: "relative", width: 960, height: 620 }}>
              <div style={{ position: "absolute", left: 40, top: 150, width: 420, height: 320, borderRadius: 34, background: WIN, border: `4px solid ${fr >= dOpen + 2 ? GREEN : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: fr >= dOpen + 2 ? `0 0 60px rgba(52,211,153,0.5)` : "none" }}>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff", textAlign: "center", lineHeight: 1.25 }}>API Realtime<br /><span style={{ color: BODY }}>OpenAI</span></div>
                <div style={{ display: "flex", gap: 30 }}>{[0, 1].map((k) => <div key={k} style={{ width: 30, height: 70, borderRadius: 10, background: "#05030c", border: `3px solid ${LINE}` }} />)}</div>
              </div>
              <div style={{ position: "absolute", top: 210, left: interpolate(plug, [0, 1], [560, 420]), display: "flex", alignItems: "center", transform: `translateX(${fr >= dOpen + 2 ? shake(fr, dOpen + 2, 6) : 0}px)` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 40, marginRight: -4 }}>{[0, 1].map((k) => <div key={k} style={{ width: 70, height: 22, borderRadius: 6, background: GOLD }} />)}</div>
                <div style={{ width: 380, height: 200, borderRadius: 34, background: PINK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${PINKA(0.6)}` }}>
                  <div style={{ fontSize: 70 }}>🎙️</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#fff" }}>MAI Realtime 1</div>
                </div>
              </div>
              {fr >= dOpen + 2 && <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}><Stamp fr={fr} d={dOpen + 2} size={64} rot={-3} c={GREEN}>⚡ encaixa</Stamp></div>}
            </div>
          </In>
        ) : (
          <In fr={fr} d={dQue - 2}>
            <div style={{ position: "relative", width: 960, height: 640 }}>
              {[["GPT Realtime", 30, GREY], ["MAI Realtime 1", 510, PINK]].map(([t, x, c], k) => (
                <div key={t} style={{ position: "absolute", left: x, top: 60, width: 420, height: 420, borderRadius: 34, background: k && mv > 0.9 ? PINKA(0.2) : WIN, border: `4px solid ${k && mv > 0.5 ? PINK : LINE}`, boxSizing: "border-box", padding: 24 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: c, textAlign: "center" }}>{t}</div>
                </div>
              ))}
              {fr >= dApp - 4 && <div style={{ position: "absolute", top: 180, left: interpolate(mv, [0, 1], [80, 560]), transform: `scale(${0.6 + 0.4 * pop(fr, dApp - 4, 10)}) rotate(${Math.sin(mv * Math.PI) * -10}deg)` }}>
                <div style={{ width: 320, height: 240, borderRadius: 30, background: "#2a1d52", border: `3px solid ${CYAN}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{ fontSize: 90 }}>📱</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>seu app de voz</div>
                </div>
              </div>}
              {fr >= dMig - 4 && fr < dFac + 6 && <div style={{ position: "absolute", top: 500, left: 400, fontSize: 90, transform: `translateX(${Math.sin(fr / 3) * 14}px)` }}>➡️</div>}
              {fr >= dFac && <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}><Stamp fr={fr} d={dFac} size={68} rot={-3} c={GREEN}>✓ migra fácil</Stamp></div>}
            </div>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- testando + MAI Labs + preço ----------
const Final = ({ fr }) => {
  const d0 = at(124), dTes = at(127), dAgo = at(130), dExp = at(133), dLabs = at(136), dRac = at(139), dCob = at(141), dPar = at(143);
  const fase2 = fr >= dExp - 2;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {!fase2 ? (
          <In fr={fr} d={d0}>
            <Janela title="quem já está testando" w={960} h={640} glow={fr >= dAgo}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, marginTop: 30 }}>
                <div style={{ display: "flex", gap: 20 }}>{[0, 1, 2].map((k) => <div key={k} style={{ fontSize: 100, transform: `translateY(${Math.sin(fr / 4 + k) * 10}px)`, opacity: fr >= d0 + 3 + k * 3 ? 1 : 0 }}>🏢</div>)}</div>
                {fr >= dAgo - 2 ? <Stamp fr={fr} d={dAgo - 2} size={90} rot={-3} c={PINK}>✈️ Agoda</Stamp> : <div style={{ display: "flex", gap: 16, alignItems: "center" }}><Spin fr={fr} c={PINK} s={50} /><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: BODY }}>testando…</span></div>}
                <Prog v={ease(lin(fr, dTes, dExp))} w={860} />
              </div>
            </Janela>
          </In>
        ) : (
          <>
            <In fr={fr} d={dExp - 2}>
              <Janela title="labs.microsoft.ai" w={960} h={fr >= dRac - 2 ? 330 : 560} glow={fr >= dLabs}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, height: fr >= dRac - 2 ? 210 : 420 }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff" }}>MAI <span style={{ color: PINK }}>Labs</span></div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", background: fr >= dLabs ? GREEN : PINK, padding: "18px 36px", borderRadius: 22, transform: `scale(${fr >= dLabs ? 1 + 0.15 * Math.max(0, 1 - (fr - dLabs) / 8) : 1 + 0.04 * Math.sin(fr / 3)})` }}>{fr >= dLabs ? "🎙️ falando" : "▶ testar"}</div>
                </div>
                {fr < dRac - 2 && <Cursor x={interpolate(fr, [dExp, dLabs], [200, 700], clamp)} y={interpolate(fr, [dExp, dLabs], [420, 230], clamp)} fr={fr} click={dLabs} />}
              </Janela>
            </In>
            {fr >= dRac - 2 && <In fr={fr} d={dRac - 2}>
              <Janela title="preço" w={960} h={500} glow={fr >= dPar}>
                {[["🎙️ voz", "US$ 0,01/min", dRac - 2, GOLD], ["🧠 raciocínio", "cobrado à parte", dRac + 4, PINK], ["  entrada", "US$ 1 / 1 mi tokens", dCob, BODY], ["  saída", "US$ 5 / 1 mi tokens", dPar - 2, BODY]].map(([a, b, d, c]) => fr >= d && (
                  <div key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 10px", borderBottom: `2px dashed ${LINE}`, opacity: lin(fr, d, d + 4), transform: `translateX(${(1 - ease(lin(fr, d, d + 6))) * 200}px)` }}>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff", whiteSpace: "pre" }}>{a}</span>
                    <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: c }}>{b}</span>
                  </div>))}
              </Janela>
            </In>}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const Cta = ({ fr }) => {
  const d0 = at(144), dDei = at(145), dAte = at(148), dCli = at(150), dCom = at(151), dV = at(152), dSeg = at(155);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>{fr >= dDei ? "você deixaria?" : "e aí…"}</div></In>
        <In fr={fr} d={d0 + 4}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 30px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dAte ? PINK : LINE}` }}>
            <div style={{ fontSize: 70 }}>📞</div>
            <Onda fr={fr} w={340} h={90} amp={fr >= dAte ? 1 : 0.3} />
            <div style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map((k) => fr >= dCli - 4 + k * 3 && <div key={k} style={{ fontSize: 60, transform: `scale(${pop(fr, dCli - 4 + k * 3, 9)})` }}>👤</div>)}</div>
          </div>
        </In>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 20, position: "relative" }}>
          {fr >= dV + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dV + 8 + k * 5; if (fr < t0) return null; const q = ((fr - t0) % 36) / 34; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dV ? PINK : LINE}`, opacity: Math.max(0.35, lin(fr, dAte, dCom)), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("VOZ", fr, dV - 2, dV + 6)}{blink(fr)}</span>
            {fr >= dV + 8 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dV + 8, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg ? pop(fr, dSeg, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["ia", "conversa", "1 centavo", "centavo", "dolar", "minuto", "bate", "gpt realtime", "5 truques", "5º", "esperto", "mai realtime 1", "microsoft", "primeiro", "voz", "tempo", "real", "nº 1", "nº 2", "nº 3", "nº 4", "nº 5", "verdade", "interrompe", "para", "esperar", "travar", "dificil", "raciocinio", "forte", "pausa", "barulho", "outra", "pessoa", "faz", "conecta", "sistemas", "ferramentas", "compativel", "api realtime", "openai", "migra", "facil", "agoda", "mai labs", "parte", "clientes", "deixaria", "comenta", "segue"]);
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
    if (n === "um" && nn(k + 1) === "centavo") { push("1 centavo", k + 1); continue; }
    if (n === "cinco" && nn(k + 1) === "truques") { push("5 truques", k + 1); continue; }
    if (n === "quinto") { push("5º", k); continue; }
    if (n === "gpt" && nn(k + 1) === "riltaime") { push("GPT Realtime", k + 1); continue; }
    if (n === "mai" && nn(k + 1) === "riltaime") { push("MAI Realtime 1", k + 2); continue; }
    if (n === "a" && nn(k + 1) === "p" && nn(k + 2) === "i" && nn(k + 3) === "riltaime") { push("API Realtime", k + 3); continue; }
    if (n === "open" && nn(k + 1) === "ei") { push("OpenAI", k + 2); continue; }
    if (n === "mai" && nn(k + 1) === "lebs") { push("MAI Labs", k + 1); continue; }
    if (n === "voz" && x.w === "VOZ") { push("VOZ", k); continue; }
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

export const ShortVozCentavo = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(28), at(47), at(61), at(77), at(87), at(102), at(124), at(144), end];
  const scenes = [Hook, Nome, Item1, Item2, Item3, Item4, Item5, Final, Cta];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(13)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(102)} b={at(111)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(151)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "coin", 0.6, 15)}
      {S(at(3), "pop", 0.4, 15)}
      {S(at(6) - 2, "whoosh", 0.5, 20)}
      {S(at(6) + 6, "coin", 0.5, 15)}
      {S(at(7) - 2, "coin", 0.5, 15)}
      {S(at(10), "pop", 0.4, 15)}
      {S(at(12), "pop", 0.4, 15)}
      {S(at(14), "whoosh", 0.8, 30)}
      {S(at(14), "error", 0.45, 15)}
      {S(at(16) + 8, "ding", 0.45)}
      {S(at(18), "whoosh", 0.6, 30)}
      {[0, 3, 6, 9, 12].map((o) => S(at(19) + o, "pop", 0.3, 15))}
      {S(at(23), "riser", 0.3, 30)}
      {S(at(26), "ding", 0.4)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(34), "pop", 0.35, 15)}
      {[39, 41].map((i) => S(at(i), "pop", 0.35, 15))}
      {S(at(45), "ding", 0.4)}
      {S(at(53), "error", 0.4, 15)}
      {S(at(60), "ding", 0.4)}
      {S(at(69), "riser", 0.25, 30)}
      {S(at(74) + 4, "error", 0.35, 15)}
      {S(at(76), "ding", 0.4)}
      {S(at(86), "error", 0.35, 15)}
      {S(at(93), "ding", 0.45)}
      {SAT.map((_, k) => S(at(87) + 6 + k * 3, "pop", 0.2, 15))}
      {[97, 99, 100, 101].map((i) => S(at(i) - 2, "pop", 0.3, 15))}
      {S(at(113) + 2, "coin", 0.45, 15)}
      {S(at(123), "ding", 0.45)}
      {S(at(130) - 2, "pop", 0.4, 15)}
      {S(at(136), "pop", 0.4, 15)}
      {S(at(137), "coin", 0.4, 15)}
      {S(at(152) + 8, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaVozCentavo = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>IA que conversa</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>por</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 130, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 20 }}>1 centavo</div>
    </div>
    <div style={{ position: "absolute", top: 900, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <Janela title="chamada com IA · ao vivo" w={960} h={380} glow>
        <Onda fr={20} w={904} h={150} />
        <div style={{ marginTop: 24, display: "flex", gap: 16 }}><Pill size={38} c={GOLD} bg="rgba(255,209,102,0.12)">US$ 0,01/min</Pill><Pill size={38}>✓ tempo real</Pill></div>
      </Janela>
    </div>
    <div style={{ position: "absolute", top: 1340, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>de dólar por minuto · 5 truques</div>
  </AbsoluteFill>
);
