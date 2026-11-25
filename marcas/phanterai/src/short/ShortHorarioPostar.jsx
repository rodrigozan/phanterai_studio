import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 25/11/2026 10:00 — Mito vs. Realidade: "Existe horário mágico pra postar?".
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 25/11/2026):
// - support.google.com/youtube/answer/141805 (en e pt-BR, FAQ de desempenho):
//   "Publish time is not known to impact a video's long-term performance. Our recommendation system aims to deliver
//   the right videos to the right viewers, regardless of when that video was uploaded. However, publish time is
//   important for formats such as Live and Premiere videos." / "Publishing videos when your audience is most active
//   can be beneficial for early viewership, but isn't known to impact a video's long-term viewership."
//   "Do I need to upload daily or at least once a week? No, ... growth in views across uploads is not correlated with
//   time between uploads."
// - support.google.com/youtube/answer/9314416: Studio → Analytics → Público (Audience) → relatório
//   "Quando seus espectadores estão no YouTube" (últimos 28 dias; agendar Estreia ou planejar live).
// - Dado do canal (marcas/phanterai/dados-canal-2026-11-22.md): o relatório do Aprenda YouTube mostra "sem dados suficientes".
// Meme (só na fala e em texto animado, sem imagem do personagem): Doutor Estranho e os 14 milhões de futuros.
// Tudo é interface recriada em motion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
// Curvas e mapa de calor são ilustração do conceito (sem números), não dado de canal.
export const SHP_SLUG = "phanterai/episodes/shorts-reels-tiktok/yt-short-2026-11-25-1000-horario-de-postar";
export const SHP_FPS = 30;
const MUSIC = "phanterai/music/CuriousFocus.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = SHP_FPS;
const f = (p) => staticFile(`${SHP_SLUG}/${p}`);
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

export const calculateHorarioPostarMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};


// ---------- peças ----------
const Relogio = ({ fr, size = 300, speed = 0, h0 = 6, m0 = 0, ring, c = PINK }) => {
  const mins = m0 + speed * fr;
  const am = (mins % 60) * 6, ah = ((h0 % 12) + mins / 60) * 30;
  const hand = (deg, len, w, col) => <div style={{ position: "absolute", left: size / 2 - w / 2, top: size / 2 - len, width: w, height: len, borderRadius: w, background: col, transformOrigin: `50% ${len}px`, transform: `rotate(${deg}deg)` }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: WIN, border: `8px solid ${c}`, position: "relative", boxShadow: `0 0 60px ${PINKA(0.4)}`, transform: `rotate(${ring ? Math.sin(fr * 2.2) * 8 : 0}deg)` }}>
      {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: size / 2 - 4, top: 10, width: 8, height: 22, borderRadius: 4, background: k % 3 ? GREY : "#fff", transformOrigin: `4px ${size / 2 - 10}px`, transform: `rotate(${k * 30}deg)` }} />)}
      {hand(ah, size * 0.27, 14, "#fff")}
      {hand(am, size * 0.38, 9, c)}
      <div style={{ position: "absolute", left: size / 2 - 14, top: size / 2 - 14, width: 28, height: 28, borderRadius: 14, background: "#fff" }} />
    </div>
  );
};
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

// ---------- 0: gancho (0 -> "Mito") ----------
const Hook = ({ fr }) => {
  const dSeis = at(4), dNada = at(6);
  const sec = Math.min(60, 52 + Math.floor((fr * 8) / Math.max(1, dSeis)));
  const clock = sec >= 60 ? "18:00:00" : `17:59:${String(sec).padStart(2, "0")}`;
  const flash = [0, dSeis, dNada].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const after = fr >= dNada;
  const views = fr >= dSeis ? Math.min(3, Math.floor((fr - dSeis) / 10)) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: after ? `rgba(255,92,122,${Math.min(0.45, flash)})` : PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={fr < dNada ? 0 : dNada} size={fr < dNada ? 140 : 180} top={150} rot={fr < dNada ? -2 : 3} bg={fr < dNada ? PINK : RED}>{fr < dNada ? "esperando…" : "NADA!"}</Big>
      <div style={{ ...center, top: 420, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, transform: `translateX(${shake(fr, dSeis, 18)}px)` }}>
          <Relogio fr={fr} size={260} speed={fr < dSeis ? 1.2 : 0} h0={5} m0={fr < dSeis ? 20 : 60} ring={fr >= dSeis && fr < dNada} />
          <Digital txt={clock} size={92} glow={fr >= dSeis} c={sec >= 60 ? PINK : "#fff"} />
        </div>
        <div style={{ marginTop: 60, position: "relative" }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff", background: fr >= dSeis ? GREEN : PINK, padding: "24px 70px", borderRadius: 50, transform: `scale(${fr >= dSeis ? 0.92 + 0.08 * pop(fr, dSeis, 9) : 1 + 0.05 * Math.sin(fr / 3)})` }}>{fr >= dSeis ? "✓ Publicado às 18h" : "Publicar"}</div>
          <Cursor x={fr < dSeis ? interpolate(fr, [0, dSeis], [620, 360], clamp) : 360} y={fr < dSeis ? interpolate(fr, [0, dSeis], [200, 60], clamp) : 60} fr={fr} click={dSeis} />
        </div>
        <div style={{ marginTop: 60, width: 880, padding: "26px 34px", borderRadius: 30, background: WIN, border: `3px solid ${after ? RED : LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", opacity: lin(fr, dSeis - 4, dSeis + 2) }}>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: BODY }}>✨ horário mágico</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, color: after ? RED : "#fff" }}>{after ? "efeito? 🤔" : `+${views} views`}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: o mito (Mito ... gente) ----------
const Mito = ({ fr }) => {
  const d0 = at(7), dMag = at(10), dYT = at(13), dTres = at(18), dTer = at(22), dAli = at(23);
  const mito = "existe horário mágico pra postar";
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={160} top={150} rot={-2} bg={AMBER}>Mito?</Big>
      <div style={{ ...center, top: 430 }}>
        <div style={{ position: "relative", width: 960, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dMag ? AMBER : LINE}`, boxSizing: "border-box" }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 42, color: "#fff", whiteSpace: "nowrap" }}>“{typed(mito, fr, d0 + 4, at(12) + 6)}{fr < at(13) ? blink(fr) : "”"}</div>
          {fr >= dMag && [0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 300 + k * 90, top: -40 + ((fr * 3 + k * 25) % 60) * -1, fontSize: 44, opacity: 1 - ((fr * 3 + k * 25) % 60) / 60 }}>✨</div>)}
        </div>
        <div style={{ marginTop: 40, height: 90 }}>{fr >= Math.min(dYT, 135) && <In fr={fr} d={Math.min(dYT, 135)}><Pill c={PINK} bg={PINKA(0.15)} size={44}>{fr < dYT ? "3 pontos · o 3º alivia 👀" : "▶ YouTube responde: 3 pontos 👀"}</Pill></In>}</div>
        {fr < dTres && (
          <div style={{ marginTop: 10, position: "relative", transform: `scale(${fr >= dMag ? 1 + 0.12 * pop(fr, dMag, 7) : 0.7 + 0.3 * pop(fr, d0 + 2, 10)})` }}>
            <Relogio fr={fr} size={340} speed={fr >= dMag ? 9 : 3} h0={6} c={fr >= dMag ? AMBER : PINK} />
            {[0, 1, 2, 3, 4, 5].map((k) => { const a = (fr / 9 + (k * Math.PI) / 3); return <div key={k} style={{ position: "absolute", left: 150 + 210 * Math.cos(a), top: 150 + 210 * Math.sin(a), fontSize: 50, opacity: fr >= dMag ? 1 : 0.5 }}>✨</div>; })}
          </div>
        )}
        <div style={{ marginTop: 30, display: fr < dTres ? "none" : "flex", gap: 34 }}>
          {[0, 1, 2].map((k) => {
            const d = [dTres, dTres + 5, at(19)][k];
            const hot = k === 2 && fr >= dTer;
            if (fr < d) return <div key={k} style={{ width: 260 }} />;
            const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
            return (
              <div key={k} style={{ width: 260, height: 330, borderRadius: 36, background: hot ? PINKA(0.25) : WIN, border: `4px solid ${hot ? PINK : VIOLET}`, transform: `perspective(800px) rotateY(${flip}deg) translateY(${hot ? Math.sin(fr / 3) * 8 : 0}px) scale(${hot ? 1.08 + 0.17 * ease(lin(fr, dAli + 6, dAli + 36)) : 1 - 0.15 * ease(lin(fr, dAli + 6, dAli + 36))})`, opacity: !hot && fr >= dAli ? 1 - 0.5 * lin(fr, dAli + 6, dAli + 30) : 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: `0 0 50px ${hot ? PINKA(0.6) : "rgba(180,140,255,0.2)"}` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 140, color: "#fff" }}>{hot ? "?" : k + 1}</span>
                <span style={{ fontFamily: MONO, fontSize: 36, color: hot ? "#fff" : GREY }}>{hot ? "nº 3" : "ponto"}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 40 }}>{fr >= dAli && <Stamp fr={fr} d={dAli} c={GREEN} rot={-6} size={74}>o 3º alivia 😮‍💨</Stamp>}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: Nº 1 longo prazo (Número um ... prazo) ----------
const Item1 = ({ fr }) => {
  const d0 = at(26), dSeg = at(28), dHor = at(32), dNao = at(33), dDes = at(36), dLon = at(38);
  const marks = ["dia 1", "semana 1", "mês 1", "mês 6"];
  const prog = lin(fr, dDes, dLon + 20);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="⏰" t="O horário" sub="e o longo prazo" />
      <div style={{ ...center, top: 450 }}>
        <div style={{ height: 80 }}>{fr >= dSeg && <In fr={fr} d={dSeg}><Pill c={PINK} bg={PINKA(0.15)} size={42}>segundo o YouTube</Pill></In>}</div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ transform: `scale(${fr >= dHor ? 1 + 0.15 * pop(fr, dHor, 9) : 0.6 + 0.4 * pop(fr, d0 + 3, 10)}) translateX(${shake(fr, dNao, 14)}px)` }}>
            <Relogio fr={fr} size={280} speed={fr >= dHor ? 6 : 3} h0={10} c={fr >= dNao ? RED : PINK} />
          </div>
          <div style={{ width: 380 }}>{fr >= dNao && <Stamp fr={fr} d={at(34)} c={RED} rot={-6} size={78}>NÃO afeta</Stamp>}</div>
        </div>
        <div style={{ marginTop: 70, width: 940, opacity: lin(fr, dDes - 4, dDes + 4) }}>
          <div style={{ position: "relative", height: 300 }}>
            <div style={{ position: "absolute", left: 20, right: 20, top: 150, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ position: "absolute", left: 20, top: 150, height: 14, borderRadius: 7, width: `${prog * 900}px`, background: fr >= dLon ? GREEN : PINK, boxShadow: `0 0 30px ${fr >= dLon ? GREEN : PINK}` }} />
            {marks.map((m, k) => {
              const x = 20 + (k / 3) * 900, on = prog >= k / 3 - 0.001;
              return <div key={m} style={{ position: "absolute", left: x - 90, width: 180, top: 190, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 32, color: on ? "#fff" : GREY }}>
                <div style={{ position: "absolute", left: 78, top: -52, width: 24, height: 24, borderRadius: 12, background: on ? "#fff" : GREY }} />{m}</div>;
            })}
            <div style={{ position: "absolute", left: 20 + prog * 900 - 120, top: 0 }}><VideoCard fr={fr} w={240} glow={fr >= dLon} c={fr >= dLon ? GREEN : undefined} /></div>
          </div>
          <div style={{ textAlign: "center", marginTop: 10, height: 100 }}>{fr >= dLon && <In fr={fr} d={dLon}><Pill c={GREEN} size={54}>longo prazo: o horário não pesa</Pill></In>}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: o sistema + meme (O sistema ... mágico) ----------
const Explica = ({ fr }) => {
  const d0 = at(40), dLeva = at(42), dCerto = at(45), dCerta = at(48), dSeja = at(49), dNem = at(52), dCat = at(57), dFut = at(60), dAch = at(61), dMag = at(64);
  const P = ["🧑", "👩", "🧔"];
  const horas = ["07:00", "13:00", "22:00", "03:00"];
  const hi = Math.floor(Math.max(0, fr - dSeja) / 5) % 4;
  const futuros = Math.round(14000000 * (0.04 * lin(fr, dNem, dCat) + 0.96 * ease(lin(fr, dCat, dFut + 4))));
  return (
    <AbsoluteFill>
      <Fade fr={fr} a={d0} b={dNem - 6} style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><Pill c={VIOLET} bg="rgba(180,140,255,0.15)" size={46}>⚙️ o sistema de recomendação</Pill></In>
        <div style={{ marginTop: 50, transform: `scale(${fr >= dCerto ? 1 + 0.04 * pop(fr, dCerto, 8) : 1})` }}><VideoCard fr={fr} w={460} glow={fr >= dCerto} c={fr >= dCerto ? GREEN : undefined} /></div>
        <div style={{ position: "relative", width: 900, height: 160 }}>
          {[0, 1, 2].map((k) => {
            const x2 = 150 + k * 300, l = lin(fr, dLeva + k * 3, dLeva + k * 3 + 8);
            const dx = x2 - 450, len = Math.hypot(dx, 150) * l, ang = (Math.atan2(150, dx) * 180) / Math.PI - 90;
            return <div key={k} style={{ position: "absolute", left: 450, top: 0, width: 8, height: len, borderRadius: 4, background: k === 1 && fr >= dCerta ? GREEN : PINKA(0.7), transformOrigin: "4px 0", transform: `rotate(${ang}deg)` }} />;
          })}
        </div>
        <div style={{ display: "flex", gap: 120 }}>
          {P.map((p, k) => {
            const ok = k === 1 && fr >= dCerta;
            return <div key={k} style={{ width: 180, height: 180, borderRadius: 90, background: ok ? "rgba(52,211,153,0.2)" : WIN, border: `4px solid ${ok ? GREEN : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100, position: "relative", transform: `scale(${ok ? 1 + 0.1 * pop(fr, dCerta, 8) : 1}) translateY(${Math.sin((fr + k * 10) / 7) * 6}px)`, opacity: k === 1 || fr < dCerta ? 1 : 0.4 }}>
              {p}{ok && <div style={{ position: "absolute", right: -10, top: -10, fontSize: 60 }}>✅</div>}
            </div>;
          })}
        </div>
        <div style={{ marginTop: 50, height: 120 }}>{fr >= dSeja && <In fr={fr} d={dSeja}><Digital txt={horas[hi]} size={84} glow /></In>}</div>
      </Fade>
      <Fade fr={fr} a={dNem} style={{ ...center, top: 300 }}>
        <In fr={fr} d={dNem}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={48}>🔮 modo Doutor Estranho</Pill></In>
        <div style={{ marginTop: 40, position: "relative", width: 620, height: 620 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: "absolute", left: k * 70, top: k * 70, width: 620 - k * 140, height: 620 - k * 140, borderRadius: "50%", border: `6px dashed ${k === 1 ? PINK : AMBER}`, transform: `rotate(${(k % 2 ? -1 : 1) * fr * (2 + k)}deg)`, boxShadow: `0 0 40px ${k === 1 ? PINKA(0.4) : "rgba(251,191,36,0.3)"}` }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 84, color: "#fff" }}>{futuros.toLocaleString("pt-BR")}</div>
            <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 50, color: AMBER }}>futuros vistos</div>
          </div>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 24, alignItems: "center" }}>
          {fr >= dAch && <Stamp fr={fr} d={dAch} c={RED} rot={-5} size={70}>0 horários mágicos</Stamp>}
          {fr >= dMag && <In fr={fr} d={dMag}><div style={{ fontSize: 90 }}>🤷</div></In>}
        </div>
      </Fade>
    </AbsoluteFill>
  );
};

// ---------- 4: Nº 2 público online (Número dois ... Estreia) ----------
const Item2 = ({ fr }) => {
  const d0 = at(65), dOn = at(71), dAj = at(72), dSo = at(73), dPri = at(75), dOnde = at(77), dLive = at(83), dEst = at(86);
  // curva ilustrativa: público online ao longo de 24 h (sem números)
  const pts = Array.from({ length: 49 }, (_, k) => { const x = k * 18.75, y = 200 - 140 * Math.exp(-Math.pow((k - 34) / 8, 2)) - 30 * Math.exp(-Math.pow((k - 14) / 6, 2)); return [x, y]; });
  const path = "M" + pts.map(([x, y]) => `${x},${y}`).join(" L");
  const area = path + " L900,220 L0,220 Z";
  const dot = pts[Math.min(48, Math.floor(lin(fr, d0, dAj) * 34))];
  const showQ = fr >= dOnde;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="👥" t="Público online" sub="ajuda… no começo" />
      <div style={{ ...center, top: 460 }}>
        <Fade fr={fr} a={d0 + 4} b={dOnde - 2}>
          <div style={{ width: 960, padding: "24px 30px", borderRadius: 30, background: WIN, border: `3px solid ${LINE}`, boxSizing: "border-box" }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: BODY, marginBottom: 10 }}>👥 seu público online · 24 h</div>
            <svg width={900} height={230}>
              <path d={area} fill={fr >= dOn ? PINKA(0.35 * lin(fr, dOn, dOn + 8)) : "transparent"} />
              <path d={path} stroke={PINK} strokeWidth={8} fill="none" strokeDasharray={2000} strokeDashoffset={2000 * (1 - lin(fr, d0, d0 + 20))} />
              {dot && <circle cx={dot[0]} cy={dot[1]} r={16} fill="#fff" />}
            </svg>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 30, justifyContent: "center" }}>
            {fr >= dAj && <In fr={fr} d={dAj}><div style={{ width: 440, padding: 26, borderRadius: 28, background: "rgba(52,211,153,0.12)", border: `3px solid ${GREEN}`, boxSizing: "border-box" }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: GREEN }}>📈 primeiras views</div>
              <div style={{ marginTop: 16 }}><Bar w={380} v={0.15 + 0.75 * lin(fr, dAj, dPri + 6)} c={GREEN} glow /></div>
            </div></In>}
            {fr >= dPri && <In fr={fr} d={dPri}><div style={{ width: 440, padding: 26, borderRadius: 28, background: WIN, border: `3px solid ${GREY}`, boxSizing: "border-box" }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: BODY }}>🗓️ longo prazo</div>
              <div style={{ marginTop: 16, fontFamily: MONO, fontWeight: 800, fontSize: 48, color: GREY, textAlign: "center" }}>sem efeito</div>
            </div></In>}
          </div>
          <div style={{ marginTop: 30, textAlign: "center", height: 100 }}>{fr >= dSo && <Stamp fr={fr} d={dSo} c={AMBER} rot={-4} size={64}>SÓ no começo</Stamp>}</div>
        </Fade>
        {showQ && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <In fr={fr} d={dOnde}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 90, color: "#fff" }}>onde ele <span style={{ background: PINK, padding: "0 20px", borderRadius: 18 }}>manda?</span></div></In>
            <div style={{ marginTop: 60, display: "flex", gap: 40 }}>
              {fr >= dLive && <In fr={fr} d={dLive}><div style={{ width: 420, height: 420, borderRadius: 36, background: WIN, border: `4px solid ${RED}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, boxShadow: `0 0 60px rgba(255,92,122,0.4)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 34, height: 34, borderRadius: 17, background: RED, opacity: fr % 20 < 12 ? 1 : 0.3 }} /><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>AO VIVO</span></div>
                <span style={{ fontSize: 120 }}>🎙️</span>
              </div></In>}
              {fr >= dEst && <In fr={fr} d={dEst}><div style={{ width: 420, height: 420, borderRadius: 36, background: WIN, border: `4px solid ${PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, boxShadow: `0 0 60px ${PINKA(0.4)}` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>⏳ Estreia</span>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 90, color: PINK }}>00:{String(Math.max(0, 59 - Math.floor((fr - dEst) / 6))).padStart(2, "0")}</span>
              </div></In>}
            </div>
            <div style={{ marginTop: 40 }}>{fr >= dLive && <Stamp fr={fr} d={dLive + 4} c={GREEN} rot={-4} size={62}>aqui o horário importa</Stamp>}</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: o relatório (O relatório ... suficientes) ----------
const Relatorio = ({ fr }) => {
  const d0 = at(87), dStu = at(91), dAn = at(92), dPub = at(94), dMeu = at(95), dSem = at(99);
  const side = ["Painel", "Conteúdo", "Analytics", "Comentários"];
  const tabs = ["Visão geral", "Conteúdo", "Público"];
  const aOn = fr >= dAn, pOn = fr >= dPub, sem = fr >= dSem;
  const cx = fr < dAn ? interpolate(fr, [dStu, dAn], [700, 150], clamp) : fr < dPub ? interpolate(fr, [dAn, dPub], [150, 640], clamp) : 640;
  const cy = fr < dAn ? interpolate(fr, [dStu, dAn], [700, 300], clamp) : fr < dPub ? interpolate(fr, [dAn, dPub], [300, 110], clamp) : 110;
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><Janela title="studio.youtube.com" w={960} h={1000} glow={pOn}>
          <div style={{ display: "flex", gap: 24, height: "100%" }}>
            <div style={{ width: 230, display: "flex", flexDirection: "column", gap: 14 }}>
              {side.map((s, k) => <div key={s} style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, padding: "14px 16px", borderRadius: 14, color: k === 2 && aOn ? "#fff" : GREY, background: k === 2 && aOn ? PINKA(0.35) : "transparent", opacity: lin(fr, d0 + k * 2, d0 + k * 2 + 5) }}>{s}</div>)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 14, opacity: aOn ? 1 : 0.25 }}>
                {tabs.map((t, k) => <div key={t} style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, padding: "10px 18px", borderRadius: 12, color: k === 2 && pOn ? "#fff" : GREY, borderBottom: `5px solid ${k === 2 && pOn ? PINK : "transparent"}` }}>{t}</div>)}
              </div>
              {fr >= dStu && !aOn && <div style={{ marginTop: 120, display: "flex", justifyContent: "center" }}><Stamp fr={fr} d={dStu} c={PINK} rot={-4} size={60}>🎛️ YouTube Studio</Stamp></div>}
              {fr >= d0 + 4 && fr < dStu && <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 20 }}>{[0, 1, 2].map((k) => <div key={k} style={{ height: 40, borderRadius: 12, width: `${(60 + 30 * Math.sin(fr / 6 + k)) }%`, background: "rgba(255,255,255,0.08)" }} />)}<div style={{ fontFamily: MONO, fontSize: 34, color: GREY }}>carregando…</div></div>}
              {pOn && <In fr={fr} d={dPub + 2}><div style={{ marginTop: 30, padding: 22, borderRadius: 22, background: "rgba(255,255,255,0.04)", border: `2px solid ${sem ? AMBER : LINE}` }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", lineHeight: 1.2 }}>Quando seus espectadores estão no YouTube</div>
                <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(10, 46px)", gap: 8, position: "relative" }}>
                  {Array.from({ length: 70 }, (_, k) => {
                    const on = lin(fr, dPub + 4 + (k % 10), dPub + 10 + (k % 10));
                    const v = 0.15 + 0.6 * Math.abs(Math.sin(k * 1.7 + fr / 9));
                    return <div key={k} style={{ width: 46, height: 46, borderRadius: 8, background: sem ? "rgba(255,255,255,0.08)" : `rgba(222,64,200,${v * on})` }} />;
                  })}
                  {sem && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Stamp fr={fr} d={dSem} c={AMBER} rot={-6} size={52}>sem dados suficientes</Stamp></div>}
                </div>
              </div></In>}
              {fr >= dMeu && <In fr={fr} d={dMeu}><div style={{ marginTop: 22 }}><Pill c={VIOLET} bg="rgba(180,140,255,0.15)" size={34}>📍 Aprenda YouTube</Pill></div></In>}
            </div>
          </div>
          {fr >= dStu && fr < dSem + 6 && <Cursor x={cx} y={cy} fr={fr} click={fr < dPub ? dAn : dPub} />}
        </Janela></In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: Nº 3 todo dia (Número três ... outro) ----------
const Item3 = ({ fr }) => {
  const d0 = at(102), dNao = at(104), dTodo = at(107), dYT = at(109), dAum = at(114), dRel = at(117), dTem = at(122);
  const D = ["S", "T", "Q", "Q", "S", "S", "D"];
  const broken = fr >= dRel;
  const slider = 0.5 + 0.4 * Math.sin(fr / 7);
  const viewsV = 0.5 + 0.3 * Math.sin(fr / 4.3 + 1.3) * Math.cos(fr / 11);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📅" t="Todo dia?" sub="o alívio" />
      <div style={{ ...center, top: 460 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {D.map((d, k) => {
            const ck = fr >= d0 + 4 + k * 3;
            const fl = fr >= dTodo && fr < dTodo + 14;
            return <div key={k} style={{ width: 118, height: 150, borderRadius: 22, background: fl ? PINKA(0.4) : WIN, border: `3px solid ${ck ? (fr >= dNao ? GREY : PINK) : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: BODY }}>{d}</span>
              <span style={{ fontSize: 50, opacity: ck ? 1 : 0, filter: fr >= dNao ? "grayscale(1)" : "none" }}>📹</span>
            </div>;
          })}
        </div>
        <div style={{ marginTop: 30, height: 120 }}>{fr >= dNao && <Stamp fr={fr} d={dNao} c={GREEN} rot={-5} size={78}>NÃO precisa</Stamp>}</div>
        <div style={{ height: 90 }}>{fr >= dYT && <In fr={fr} d={dYT}><Pill c={PINK} bg={PINKA(0.15)} size={40}>análises do YouTube ao longo dos anos</Pill></In>}</div>
        {fr >= dAum - 6 && <In fr={fr} d={dAum - 6}><div style={{ marginTop: 30, width: 960, padding: 30, borderRadius: 30, background: WIN, border: `3px solid ${broken ? AMBER : LINE}`, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", opacity: lin(fr, dTem - 6, dTem) * 0.6 + 0.4 }}>⏱ tempo entre um envio e outro</div>
          <div style={{ position: "relative" }}><Bar w={900} v={slider} c={VIOLET} /></div>
          <div style={{ textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 70, color: broken ? AMBER : GREY, transform: `scale(${broken ? 1 + 0.1 * pop(fr, dRel, 8) : 1})` }}>{broken ? "≠  sem relação" : "🔗"}</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>📈 aumento de views</div>
          <Bar w={900} v={viewsV} c={GREEN} />
        </div></In>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(128), dH = at(130), dE = at(134), dSeg = at(136), dCob = at(138);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: "#fff", whiteSpace: "nowrap" }}>{typed("posto às __h ⏰", fr, d0 + 2, dH + 8)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 40, height: 270 }}>{fr >= dH && <In fr={fr} d={dH}><Relogio fr={fr} size={250} speed={8} h0={10} /></In>}</div>
        <div style={{ marginTop: 30, fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "24px 54px", borderRadius: 50, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dE - 2, dE + 4) }}>{fr >= dSeg + 2 ? "✓ Inscrito" : "Inscrever-se"}</div>
        <div style={{ marginTop: 40 }}>{fr >= dCob && <In fr={fr} d={dCob}><Pill c={GREEN} size={50}>🧪 próxima cobaia</Pill></In>}</div>
        {fr >= dH && Array.from({ length: 12 }, (_, k) => { const t0 = dH + k * 6; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 320 * Math.sin(k * 2.1), top: 1000 - t * 380, fontSize: 60, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "💬" : "⏰"}</div>; })}
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


const KEY = new Set(["nada", "mito", "magico", "youtube", "3", "terceiro", "alivia", "nao", "afeta", "longo", "certo", "certa", "doutor", "estranho", "futuros", "primeiras", "live", "estreia", "studio", "analytics", "publico", "suficientes", "todo", "relacao", "hora", "comenta", "cobaia"]);
// números e siglas faladas viram forma escrita na legenda
const FRASES = [
  [["as", "seis"], "às 18h"],
  [["catorze", "milhoes"], "14 milhões"],
  [["numero", "um"], "Nº 1"], [["numero", "dois"], "Nº 2"], [["numero", "tres"], "Nº 3"],
  [["tres"], "3"],
];

export const ShortHorarioPostar = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(7), at(26), at(40), at(65), at(87), at(102), at(128), end];
  const scenes = [Hook, Mito, Item1, Explica, Item2, Relatorio, Item3, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(7)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(99)} b={at(102) - 2} pose="triste" top={1290} left />
      <Reacao fr={fr} a={at(134)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.45, 15)}
      {[8, 16, 24].map((o) => S(o, "pop", 0.15, 10))}
      {S(at(4), "ding", 0.5)}
      {S(at(6), "error", 0.55, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(10), "coin", 0.3, 15)}
      {S(Math.min(at(13), 135), "pop", 0.4, 15)}
      {[at(18), at(18) + 5, at(19)].map((b) => S(b, "pop", 0.4, 15))}
      {S(at(22), "riser", 0.3, 30)}
      {S(at(23), "ding", 0.4)}
      {S(at(28), "pop", 0.35, 15)}
      {S(at(34), "error", 0.45, 15)}
      {S(at(38), "ding", 0.4)}
      {S(at(45), "pop", 0.35, 15)}
      {S(at(48), "ding", 0.4)}
      {S(at(52), "riser", 0.35, 30)}
      {S(at(61), "error", 0.45, 15)}
      {S(at(72), "pop", 0.35, 15)}
      {S(at(73), "error", 0.3, 15)}
      {S(at(77), "whoosh", 0.35, 25)}
      {S(at(83), "pop", 0.4, 15)}
      {S(at(86), "pop", 0.4, 15)}
      {S(at(92), "pop", 0.35, 15)}
      {S(at(94), "pop", 0.35, 15)}
      {S(at(99), "error", 0.45, 15)}
      {S(at(104), "ding", 0.4)}
      {S(at(107), "pop", 0.3, 15)}
      {S(at(117), "error", 0.4, 15)}
      {S(at(130), "pop", 0.4, 15)}
      {S(at(136) + 2, "ding", 0.45)}
      {S(at(138), "pop", 0.4, 15)}
    </AbsoluteFill>
  );
};

export const CapaHorarioPostar = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Esperou as 18h…</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 130, color: "#fff", background: RED, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>pra nada?</div>
    </div>
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <Relogio fr={0} size={300} h0={6} m0={0} />
        <Digital txt="18:00" size={120} glow c={PINK} />
      </div>
      <Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={50}>✨ horário mágico?</Pill>
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

