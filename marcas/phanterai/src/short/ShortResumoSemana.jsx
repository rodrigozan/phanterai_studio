import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 22/11/2026 18:00 — "Resumo da semana no Universo da IA" (16 a 22/11/2026).
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 22/11/2026):
// 1. microsoft.ai/news/microsoft-ignite-2026 (17/11): "a family of seven new world class models"; MAI Code 2 =
//    "96% of Claude Opus 5.5's performance at just 5% of the price"; "Try MAI Code 2 in GitHub Copilot today".
// 2. liquid.ai/blog/d1-2 (16/11): d1.2 e d1.2-ultra, modelos de decisão; áudio como entrada; d1.2-ultra 75 no
//    Artificial Analysis Decision Index v2.1, "two points ahead of the previous best" (73); exemplo da fatura
//    "How much is due?" -> "1 234,50 EUR"; probabilidade calibrada.
// 3. blog.google introducing-gemini-4-neon (18/11): US$ 3/M entrada, US$ 15/M saída, contexto de 1 milhão de tokens,
//    "#1 overall on the Artificial Analysis Coding Agent Index (58.6)".
// 4. openai.com/index/introducing-gpt-6-2-astra-sol: preços de tokens do Astra 20% menores que os do GPT-6 Astra
//    (US$ 8 entrada / US$ 40 saída por milhão); Agents' Last Exam: "5.5 points ahead of Claude Fable 5.2 at just 5% of the cost".
// 5. anthropic.com/news/anthropic-prices-initial-public-offering (18/11): US$ 83,00 por ação, 980.000.000 ações
//    (= US$ 81,34 bi), Nasdaq a partir de 19/11 (quinta) com o código "ANT"; página da ação ANT ativa na Nasdaq.
// Tudo é interface recriada em motion no Remotion (estilo PhanterAI): nenhum print, nada gerado por IA,
// nenhum logo oficial, nenhuma fonte escrita na tela.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SRS_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-22-1800-resumo-da-semana";
export const SRS_FPS = 30;
const FPS = SRS_FPS;
const f = (p) => staticFile(`${SRS_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const AMBER = "#fbbf24";
const BLUE = "#7ab8ff";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const TAIL = 0.9;

export const calculateResumoSemanaMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

let W = {};
const at = (i) => (W[i] ? Math.round(W[i].s * FPS) : 0);
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0, color: PINK }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);
const bob = (fr, k = 0, a = 6) => Math.sin(fr / 14 + k) * a;
const swing = (fr, d, a = 10) => (fr >= d ? Math.sin((fr - d) / 5) * a * Math.exp(-(fr - d) / 40) + Math.sin(fr / 18) * 2 : 0);
const fmt = (n, dec = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
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
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 165, 180) }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);

const Card = ({ children, w = 900, style = {}, glow }) => (
  <div style={{ width: w, borderRadius: 30, background: WIN, border: `3px solid ${glow ? PINK : "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(glow ? 0.45 : 0.15)}`, padding: 30, boxSizing: "border-box", position: "relative", ...style }}>{children}</div>
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
  <div style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 5 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 34px 16px 18px", borderRadius: 60, background: WIN, border: `2px solid ${PINKA(0.6)}`, transform: `scale(${0.6 + 0.4 * pop(fr, d, 10)})`, boxShadow: `0 0 50px ${PINKA(0.3)}` }}>
      <div style={{ width: 92, height: 92, borderRadius: 46, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>{n}</div>
      <div style={{ fontSize: 58 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff", lineHeight: 1, whiteSpace: "nowrap" }}>{t}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: BODY, marginTop: 6, whiteSpace: "nowrap" }}>{sub}</div>
      </div>
    </div>
  </div>
);

// barra que cresce até pct (0–100)
const Bar = ({ fr, d, pct, label, val, c = PINK, w = 820, dur = 18 }) => {
  const q = ease(lin(fr, d, d + dur));
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", marginBottom: 10 }}>
        <span>{label}</span><span style={{ color: c, opacity: lin(fr, d + dur - 6, d + dur) }}>{val}</span>
      </div>
      <div style={{ height: 46, borderRadius: 23, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${Math.max(0.5, pct * q)}%`, height: "100%", borderRadius: 23, background: c, boxShadow: `0 0 30px ${c}` }} />
      </div>
    </div>
  );
};

// etiqueta de preço pendurada, balançando
const Tag = ({ fr, d, children, sub, c = PINK, size = 120 }) => {
  if (fr < d) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transformOrigin: "50% 0%", transform: `rotate(${swing(fr, d, 12)}deg) scale(${0.5 + 0.5 * pop(fr, d, 9)})` }}>
      <div style={{ width: 6, height: 70, background: "rgba(255,255,255,0.5)" }} />
      <div style={{ padding: "18px 46px 22px", borderRadius: 26, background: c, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${c}`, textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 14, left: "50%", width: 22, height: 22, marginLeft: -11, borderRadius: 11, background: "#0b0618" }} />
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: size, color: "#fff", lineHeight: 1.1, marginTop: 20, whiteSpace: "nowrap" }}>{children}</div>
        {sub && <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 38, color: "#fff", whiteSpace: "nowrap" }}>{sub}</div>}
      </div>
    </div>
  );
};

const Stamp = ({ fr, d, children, c = GREEN, rot = -10, size = 64 }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 8);
  return <div style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, border: `7px solid ${c}`, borderRadius: 20, padding: "6px 28px", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.5), background: "rgba(10,6,24,0.75)", whiteSpace: "nowrap" }}>{children}</div>;
};

// pódio / ranking: linha destacada sobe do fundo para o topo
const Rank = ({ fr, d, rise, title, hi, hiVal, others, w = 860 }) => {
  const q = ease(lin(fr, rise, rise + 16));
  const n = others.length + 1;
  const rowH = 104;
  return (
    <Card w={w} glow={fr >= rise + 16}>
      <div style={{ fontFamily: MONO, fontSize: 28, color: GREY, marginBottom: 18 }}>🏆 {title}</div>
      <div style={{ position: "relative", height: n * rowH }}>
        {others.map((o, k) => {
          const pos = q < 1 ? k + q * 1 - (k + 1 - 1) * 0 : k + 1;
          const y = (k + (fr >= rise ? q : 0)) * rowH;
          return (
            <div key={k} style={{ position: "absolute", top: y, left: 0, right: 0, height: rowH - 16, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "2px solid rgba(190,160,255,0.2)" }}>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: GREY, width: 60 }}>{Math.round(k + 1 + (fr >= rise ? q : 0))}º</span>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: BODY }}>{o[0]}</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 38, color: BODY }}>{o[1]}</span>
            </div>
          );
        })}
        {fr >= d && (() => {
          const y = (others.length * (1 - (fr >= rise ? q : 0))) * rowH;
          const top1 = fr >= rise + 16;
          return (
            <div style={{ position: "absolute", top: y, left: 0, right: 0, height: rowH - 16, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", borderRadius: 18, background: PINKA(0.3), border: `3px solid ${PINK}`, boxShadow: `0 0 40px ${PINKA(0.5)}`, transform: `scale(${(0.7 + 0.3 * pop(fr, d, 11)) * (top1 ? 1 + 0.04 * Math.sin(fr / 4) : 1)})`, zIndex: 3 }}>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", width: 60 }}>{top1 ? "1º" : `${n}º`}</span>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap" }}>{hi}{top1 ? " 🥇" : ""}</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 44, color: "#fff" }}>{hiVal}</span>
            </div>
          );
        })()}
      </div>
    </Card>
  );
};

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dBi = at(3), dDol = at(5), dOf = at(6), dSo = at(8), dCinco = at(10), dSem = at(13), dN5 = at(20), dExp = at(22), dFica = at(25);
  const flash = [dBi, dOf, dSo, dCinco, dN5].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const val = interpolate(fr, [0, dBi + 4], [20, 81.3], clamp);
  let big, bigD = 0, size = 150, bg = PINK, rot = -3;
  if (fr < dOf) { big = `US$ ${fmt(val, 1)} bi`; size = 140; }
  else if (fr < dCinco) { big = "numa oferta só 😳"; bigD = dOf; size = 104; bg = RED; rot = 2; }
  else if (fr < dN5) { big = "5 notícias"; bigD = dCinco; size = 140; rot = -2; }
  else { big = "a nº 5 explica 🔒"; bigD = dN5; size = 104; bg = RED; rot = 2; }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={230} rot={rot} bg={bg}>{big}</Big>
      {fr < dCinco && (
        <div style={{ position: "absolute", top: 470, left: 0, right: 0, height: 900, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dSo, 24)}px)` }}>
          {/* pilha de dinheiro crescendo */}
          <div style={{ position: "absolute", left: 140, right: 140, bottom: 90, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 26 }}>
            {Array.from({ length: 6 }, (_, k) => {
              const h = interpolate(fr, [k * 3, dOf + k * 2], [40, 160 + k * 90], clamp);
              return (
                <div key={k} style={{ width: 100, height: h, borderRadius: 16, background: `repeating-linear-gradient(0deg, #1f7a52 0 22px, #34D399 22px 30px)`, border: "3px solid #8ef0c4", boxShadow: "0 0 30px rgba(52,211,153,0.5)", transform: `translateY(${bob(fr, k, 4)}px)` }} />
              );
            })}
          </div>
          {fr >= dBi && (
            <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center" }}>
              <In fr={fr} d={dBi}><Pill size={60} c="#fff" bg="rgba(52,211,153,0.35)" style={{ border: `3px solid ${GREEN}` }}>💰 bilhões de dólares</Pill></In>
            </div>
          )}
          {fr >= dDol && Array.from({ length: 10 }, (_, k) => {
            const t0 = dDol + k * 2; if (fr < t0) return null;
            const q = (fr - t0) / 30;
            return <div key={k} style={{ position: "absolute", left: 80 + ((k * 211) % 900), top: -80 + q * 900, fontSize: 70, opacity: Math.max(0, 1 - q * 0.8), transform: `rotate(${fr * 6 + k * 40}deg)` }}>💵</div>;
          })}
          {fr >= dOf && (
            <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
              <Stamp fr={fr} d={dOf} c={RED} size={120} rot={-8}>1 OFERTA</Stamp>
            </div>
          )}
        </div>
      )}
      {fr >= dCinco && (
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 30, padding: "0 90px", boxSizing: "border-box" }}>
          {[["1", "🪟"], ["2", "🎯"], ["3", "💎"], ["4", "✨"], ["5", "🔒"]].map(([n, ic], k) => {
            const q5 = k === 4 && fr >= dN5;
            return (
              <In key={k} fr={fr} d={dCinco + k * 4} dy={90}>
                <div style={{ width: k < 3 ? 270 : 400, height: 260, borderRadius: 30, background: q5 ? PINKA(0.25) : WIN, border: `4px solid ${q5 ? PINK : PINKA(0.45)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateX(${q5 ? shake(fr, dN5, 20) : 0}px) scale(${q5 ? 1 + 0.08 * pop(fr, dN5, 8) : 1}) translateY(${bob(fr, k, 6)}px)`, boxShadow: q5 ? `0 0 80px ${PINKA(0.7)}` : "none" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 70 }}>{k === 4 && fr < dN5 ? "❔" : ic}</div>
                </div>
              </In>
            );
          })}
          {fr >= dSem && (
            <div style={{ width: "100%", textAlign: "center", marginTop: 20 }}>
              <In fr={fr} d={dSem}><Pill size={44} c="#fff" bg={PINKA(0.85)} style={{ border: `2px solid ${PINK}` }}>semana 16 a 22/11 · IA</Pill></In>
            </div>
          )}
          {fr >= dCinco + 10 && (
            <div style={{ width: "100%", textAlign: "center", marginTop: 6 }}>
              <In fr={fr} d={dCinco + 10}><Pill size={fr >= dExp ? 50 : 44} c="#fff" bg="rgba(255,92,122,0.9)" style={{ border: `2px solid ${RED}`, transform: `scale(${1 + 0.05 * Math.sin(fr / 3)})` }}>a nº 5 explica os US$ 81 bi 🔒</Pill></In>
            </div>
          )}
          {fr >= dFica && (
            <div style={{ width: 860, marginTop: 14 }}>
              <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${20 + 80 * lin(fr, dFica, dFica + 12)}%`, height: "100%", background: PINK }} />
              </div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: BODY, textAlign: "right", marginTop: 6 }}>fica até o fim ⏩</div>
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: Microsoft ----------
const MAI = [["💻", "Code 2"], ["⚡", "Code 2 Flash"], ["🛡️", "Cyber 2 Flash"], ["🖼️", "Image 2.7"], ["🎙️", "Realtime 1"], ["📝", "Transcribe 2"], ["🧭", "Decision 1.1"]];
const Item1 = ({ fr }) => {
  const d0 = at(29), dMs = at(32), dSete = at(34), dVez = at(38), dCode = at(40), d96 = at(44), dOpus = at(50), dPor = at(55), d5 = at(56), dGit = at(65);
  const grid = fr < dCode;
  const t0 = dMs + 4, step = Math.max(3, Math.floor((dSete - t0) / 7));
  const nOn = Math.min(7, Math.max(0, Math.floor((fr - t0) / step) + 1));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🪟" t="Microsoft AI" sub="lançou de uma vez só" />
      {grid && (
        <div style={{ position: "absolute", top: 400, height: 1120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, transform: "scale(1.12)" }}>
          {fr >= dMs && <In fr={fr} d={dMs}><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1 }}>{fr >= t0 ? nOn : 0}<span style={{ fontSize: 60, color: BODY }}> modelos</span></div></In>}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22, width: 960 }}>
            {MAI.map(([ic, t], k) => {
              const on = fr >= t0 + k * step;
              return (
                <div key={t} style={{ width: 290, height: 150, borderRadius: 24, background: on ? (k === 0 ? PINKA(0.3) : WIN) : "rgba(255,255,255,0.03)", border: `3px solid ${on ? (k === 0 ? PINK : GREEN) : "rgba(190,160,255,0.18)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 0.8 + 0.2 * pop(fr, t0 + k * step, 10) : 0.8}) translateY(${bob(fr, k, 4)}px)`, opacity: on ? 1 : 0.35 }}>
                  <div style={{ fontSize: 52 }}>{on ? ic : "▢"}</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>MAI {t}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10 }}><Stamp fr={fr} d={dVez} c={GREEN} size={70}>7 DE UMA VEZ</Stamp></div>
        </div>
      )}
      {!grid && (
        <div style={{ position: "absolute", top: 400, height: 1120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34, transform: "scale(1.12)" }}>
          <In fr={fr} d={dCode}>
            <Card w={900} glow={fr >= d5}>
              <div style={{ fontFamily: MONO, fontSize: 30, color: GREY, marginBottom: 22 }}>{fr < dPor ? "⚖️ qualidade em código" : "💲 preço"}</div>
              {fr < dPor ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                  <Bar fr={fr} d={dOpus} pct={100} label="Claude Opus 5.5" val="100%" c={BLUE} />
                  <Bar fr={fr} d={d96} pct={96} label="MAI Code 2" val="96%" c={PINK} />
                  {fr >= at(52) && <div style={{ textAlign: "center" }}><Stamp fr={fr} d={at(52)} c={AMBER} size={58} rot={-4}>QUASE IGUAL 🤏</Stamp></div>}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                  <Bar fr={fr} d={dPor} pct={100} label="Claude Opus 5.5" val="100%" c={BLUE} dur={10} />
                  <Bar fr={fr} d={d5} pct={5} label="MAI Code 2" val="5% 🤯" c={GREEN} dur={10} />
                </div>
              )}
            </Card>
          </In>
          {fr >= d5 + 6 && <Tag fr={fr} d={d5 + 6} c={GREEN} size={110} sub="do preço">5%</Tag>}
          {fr >= dGit && (
            <div style={{ position: "absolute", top: 660 }}>
              <In fr={fr} d={dGit} dy={80}>
                <Card w={760} glow>
                  <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>GitHub Copilot ▸ modelo</div>
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderRadius: 18, background: PINKA(0.25), border: `3px solid ${PINK}` }}>
                    <span style={{ fontSize: 44 }}>💻</span>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>{typed("MAI Code 2", fr, dGit + 2, dGit + 12)}</span>
                    {fr >= dGit + 14 && <span style={{ marginLeft: "auto", fontSize: 48, transform: `scale(${pop(fr, dGit + 14, 9)})` }}>✅</span>}
                  </div>
                </Card>
              </In>
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 2: Liquid AI ----------
const Item2 = ({ fr }) => {
  const d0 = at(67), dLiq = at(70), dName = at(75), dMod = at(81), dDec = at(86), dPerg = at(88), dEsc = at(90), dChance = at(96), dAudio = at(102), dPrim = at(107), dIdx = at(109), dAA = at(113);
  const phase = fr < dPerg ? 0 : fr < dAudio ? 1 : fr < dPrim ? 2 : 3;
  const conf = ease(lin(fr, dChance, dChance + 20));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🎯" t="Liquid AI" sub="modelo de decisão" />
      <div style={{ position: "absolute", top: 400, height: 1120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, transform: "scale(1.12)" }}>
        {phase === 0 && (
          <>
            {fr >= dLiq && <In fr={fr} d={dLiq}><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: "#fff", background: WIN, border: `3px solid ${PINK}`, borderRadius: 30, padding: "16px 44px", boxShadow: `0 0 60px ${PINKA(0.5)}` }}>{fr >= dName ? typed("d1.2-ultra", fr, dName, dName + 14) : "d1.2"}{blink(fr)}</div></In>}
            {fr >= dMod && (
              <div style={{ display: "flex", gap: 40, alignItems: "center", marginTop: 30 }}>
                <In fr={fr} d={dMod}><div style={{ width: 300, height: 260, borderRadius: 30, background: WIN, border: `3px solid ${RED}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ fontSize: 100 }}>💬</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: BODY }}>conversa</div>
                  {fr >= at(83) && <div style={{ position: "absolute", fontSize: 200, color: RED, fontFamily: inter, fontWeight: 800, transform: `scale(${pop(fr, at(83), 8)})` }}>✕</div>}
                </div></In>
                {fr >= dDec && <In fr={fr} d={dDec} dx={120}><div style={{ width: 300, height: 260, borderRadius: 30, background: PINKA(0.25), border: `4px solid ${PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${PINKA(0.6)}` }}>
                  <div style={{ fontSize: 100, transform: `rotate(${Math.sin(fr / 3) * 10}deg)` }}>🎯</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>decide</div>
                </div></In>}
              </div>
            )}
          </>
        )}
        {phase === 1 && (
          <In fr={fr} d={dPerg}>
            <Card w={900}>
              <div style={{ fontFamily: MONO, fontSize: 28, color: GREY }}>🧾 fatura 2026-117 · ACME SA</div>
              <div style={{ marginTop: 18, alignSelf: "flex-end", display: "flex", justifyContent: "flex-end" }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", background: "rgba(122,184,255,0.25)", border: `2px solid ${BLUE}`, borderRadius: 26, padding: "16px 28px" }}>{typed("Quanto é devido?", fr, dPerg, dPerg + 14)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 26 }}>
                {[["1 234,50 EUR", true], ["não encontrado", false]].map(([t, ok], k) => {
                  const sel = ok && fr >= dEsc;
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderRadius: 20, border: `3px solid ${sel ? GREEN : "rgba(190,160,255,0.25)"}`, background: sel ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)", opacity: lin(fr, dPerg + 10 + k * 4, dPerg + 16 + k * 4), transform: `scale(${sel ? 1 + 0.03 * pop(fr, dEsc, 8) : 1})` }}>
                      <span style={{ fontSize: 40 }}>{sel ? "✅" : "⬜"}</span>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>{t}</span>
                    </div>
                  );
                })}
              </div>
              {fr >= dChance && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: BODY, marginBottom: 10 }}>chance de estar certo</div>
                  <div style={{ height: 40, borderRadius: 20, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${conf * 94}%`, height: "100%", background: `linear-gradient(90deg, ${AMBER}, ${GREEN})` }} />
                  </div>
                </div>
              )}
            </Card>
          </In>
        )}
        {phase === 2 && (
          <In fr={fr} d={dAudio}>
            <Card w={900} glow>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ fontSize: 90 }}>🎙️</span>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>entende áudio</span>
                {fr >= dAudio + 12 && <span style={{ marginLeft: "auto", fontSize: 60, transform: `scale(${pop(fr, dAudio + 12, 9)})` }}>✅</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, height: 200, marginTop: 20 }}>
                {Array.from({ length: 34 }, (_, k) => <div key={k} style={{ flex: 1, height: 20 + Math.abs(Math.sin(fr / 3 + k * 0.7) * Math.cos(k * 1.3 + fr / 7)) * 170, borderRadius: 8, background: k % 5 ? PINK : GREEN }} />)}
              </div>
            </Card>
          </In>
        )}
        {phase === 3 && (
          <In fr={fr} d={dPrim}>
            <Rank fr={fr} d={dPrim} rise={dIdx + 2} title={fr >= dAA ? "Artificial Analysis · Decision Index v2.1" : "índice de decisão"} hi="d1.2-ultra" hiVal="75" others={[["melhor anterior", "73"]]} />
          </In>
        )}
        {phase === 3 && fr >= dAA + 4 && <Stamp fr={fr} d={dAA + 4} c={GREEN} size={70}>+2 PONTOS</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: Google ----------
const Item3 = ({ fr }) => {
  const d0 = at(115), dGoo = at(118), dNeon = at(121), dTres = at(124), dMi = at(127), dEnt = at(131), dCtx = at(132), dPrim = at(139), dAg = at(144), dAA = at(148);
  const phase = fr < dTres ? 0 : fr < dCtx ? 1 : fr < dPrim ? 2 : 3;
  const tok = Math.round(interpolate(fr, [dCtx, at(137)], [0, 1000000], clamp));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="💎" t="Google" sub="Gemini 4 Neon" />
      <div style={{ position: "absolute", top: 400, height: 1120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, transform: "scale(1.12)" }}>
        {phase === 0 && fr >= dGoo && (
          <In fr={fr} d={dGoo}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 130, color: "#fff", textAlign: "center", lineHeight: 1.05, textShadow: fr >= dNeon ? `0 0 ${30 + 20 * Math.sin(fr / 2)}px ${PINK}, 0 0 80px ${BLUE}` : "none" }}>
              Gemini 4<br /><span style={{ color: fr >= dNeon ? PINK : GREY }}>{fr >= dNeon ? typed("Neon", fr, dNeon, dNeon + 8) : "…"}</span>
            </div>
          </In>
        )}
        {phase === 1 && (
          <>
            <Tag fr={fr} d={dTres} sub={fr >= dMi ? "por milhão de tokens" : " "}>US$ 3</Tag>
            {fr >= dEnt && <In fr={fr} d={dEnt}><Pill size={48} c="#fff" bg={PINKA(0.4)} style={{ border: `2px solid ${PINK}` }}>⬇️ entrada · saída US$ 15</Pill></In>}
          </>
        )}
        {phase === 2 && (
          <In fr={fr} d={dCtx}>
            <Card w={900} glow={tok >= 1000000}>
              <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>🧠 janela de contexto</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: "#fff", margin: "16px 0" }}>{fmt(tok)}</div>
              <div style={{ height: 46, borderRadius: 23, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${tok / 10000}%`, height: "100%", background: `linear-gradient(90deg, ${BLUE}, ${PINK})` }} />
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
                {["📄 PDFs", "📊 planilhas", "🎧 áudio", "🎬 vídeo"].map((t, k) => <In key={t} fr={fr} d={dCtx + 6 + k * 6}><Pill size={34} c={BODY} bg="rgba(255,255,255,0.06)" style={{ border: "2px solid rgba(190,160,255,0.3)" }}>{t}</Pill></In>)}
              </div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", marginTop: 16 }}>tokens</div>
            </Card>
          </In>
        )}
        {phase === 3 && (
          <>
            <In fr={fr} d={dPrim}>
              <Card w={880} glow={fr >= dAg}>
                <div style={{ fontFamily: MONO, fontSize: 28, color: GREY }}>🏆 {fr >= dAA ? "Artificial Analysis · Coding Agent Index" : "índice de agentes de código"}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 30, height: 480, marginTop: 20 }}>
                  {[[2, 300, "2º"], [1, 420, "1º"], [3, 220, "3º"]].map(([p, h, lab], k) => {
                    const hh = h * ease(lin(fr, dPrim + k * 4, dPrim + 16 + k * 4));
                    const me = p === 1;
                    return (
                      <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        {me && fr >= dAg && <div style={{ transform: `scale(${pop(fr, dAg, 9)}) translateY(${bob(fr, 0, 6)}px)`, textAlign: "center" }}>
                          <div style={{ fontSize: 70 }}>🥇</div>
                          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", background: PINK, borderRadius: 16, padding: "6px 18px", whiteSpace: "nowrap" }}>Gemini 4 Neon</div>
                          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 48, color: "#fff", marginTop: 6 }}>58,6</div>
                        </div>}
                        <div style={{ width: 210, height: hh, borderRadius: "20px 20px 0 0", background: me ? PINK : "rgba(255,255,255,0.12)", display: "flex", justifyContent: "center", paddingTop: 16, boxSizing: "border-box", fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>{hh > 80 ? lab : ""}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </In>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: OpenAI ----------
const Item4 = ({ fr }) => {
  const d0 = at(150), dOai = at(153), dAstra = at(156), dSol = at(162), dFic = at(166), d20 = at(167), dVelho = at(174), dTeste = at(178), dProf = at(182), dPass = at(183), dGast = at(190), d5 = at(192);
  const phase = fr < dFic ? 0 : fr < dTeste ? 1 : 2;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="✨" t="OpenAI" sub="GPT-6.2 Astra e Sol" />
      <div style={{ position: "absolute", top: 400, height: 1120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, transform: "scale(1.12)" }}>
        {phase === 0 && (
          <div style={{ display: "flex", gap: 36, marginTop: 40 }}>
            {[[dAstra, "🚀", "GPT-6.2 Astra", "projetos difíceis"], [dSol, "☀️", "GPT-6.2 Sol", "dia a dia"]].map(([d, ic, t, s], k) => fr >= Math.min(d, dOai + k * 6) && (
              <In key={k} fr={fr} d={Math.min(d, dOai + 6 + k * 6)} dy={90}>
                <div style={{ width: 420, height: 460, borderRadius: 34, background: fr >= d ? PINKA(0.22) : WIN, border: `4px solid ${fr >= d ? PINK : "rgba(190,160,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateY(${bob(fr, k * 2, 8)}px)`, boxShadow: fr >= d ? `0 0 60px ${PINKA(0.5)}` : "none" }}>
                  <div style={{ fontSize: 130, transform: `scale(${fr >= d ? 0.6 + 0.4 * pop(fr, d, 8) : 0.6})` }}>{fr >= d ? ic : "❔"}</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", whiteSpace: "nowrap" }}>{fr >= d ? t : "GPT-6.2"}</div>
                  <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 36, color: BODY, opacity: fr >= d ? 1 : 0 }}>{s}</div>
                </div>
              </In>
            ))}
          </div>
        )}
        {phase === 1 && (
          <>
            <div style={{ position: "relative" }}>
              <Tag fr={fr} d={dFic} sub="entrada · US$ 40 saída">US$ 8</Tag>
              {fr >= d20 && <div style={{ position: "absolute", right: -190, top: 60 }}><Stamp fr={fr} d={d20} c={GREEN} size={80} rot={12}>−20%</Stamp></div>}
            </div>
            {fr >= dVelho && (
              <In fr={fr} d={dVelho}>
                <Card w={760}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY }}>GPT-6 Astra</span>
                    <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 52, color: GREY, position: "relative" }}>
                      US$ 10
                      <span style={{ position: "absolute", left: -10, top: "50%", height: 7, width: `${(lin(fr, dVelho + 4, dVelho + 12)) * 120}%`, background: RED, borderRadius: 4 }} />
                    </span>
                  </div>
                </Card>
              </In>
            )}
          </>
        )}
        {phase === 2 && (
          <In fr={fr} d={dTeste}>
            <Card w={920} glow={fr >= dGast}>
              <div style={{ fontFamily: MONO, fontSize: 28, color: GREY, marginBottom: 20 }}>{fr < dGast ? "💼 Agents' Last Exam · trabalho profissional" : "💲 custo por tarefa"}</div>
              {fr < dGast ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                  <Bar fr={fr} d={dProf} pct={86} label="Claude Fable 5.2" val="" c={BLUE} />
                  <Bar fr={fr} d={dPass} pct={fr >= dPass ? 92 : 0} label="GPT-6.2 Astra" val="+5,5 pts" c={PINK} dur={22} />
                  {fr >= dPass + 22 && <div style={{ textAlign: "center" }}><Stamp fr={fr} d={dPass + 22} c={GREEN} size={60} rot={-4}>PASSOU ✓</Stamp></div>}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                  <Bar fr={fr} d={dGast} pct={100} label="Claude Fable 5.2" val="100%" c={BLUE} dur={10} />
                  <Bar fr={fr} d={d5} pct={5} label="GPT-6.2 Astra" val="5% 🤯" c={GREEN} dur={10} />
                </div>
              )}
            </Card>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: Anthropic ----------
const Item5 = ({ fr }) => {
  const d0 = at(197), dAnt = at(200), dCap = at(205), d83 = at(207), dAcoes = at(213), dMais = at(219), dBi = at(221), dQui = at(227), dNas = at(233), dCod = at(236), dA = at(237), dN = at(238), dT = at(239);
  const phase = fr < dMais ? 0 : fr < dQui ? 1 : 2;
  const preco = interpolate(fr, [d83, d83 + 24], [0, 83], clamp);
  const acoes = interpolate(fr, [dAcoes, dAcoes + 30], [0, 980], clamp);
  const flash = Math.max(0, 1 - Math.abs(fr - dBi) / 6) * 0.5;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(flash) }} />
      <Header fr={fr} d={d0} n="5" icon="🏛️" t="Anthropic" sub="a dona do Claude" />
      <div style={{ position: "absolute", top: 400, height: 1120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, transform: "scale(1.12)" }}>
        {phase === 0 && (
          <>
            {fr >= dAnt && (
              <In fr={fr} d={dAnt}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <span style={{ fontSize: 100, display: "inline-block", transform: `rotate(${fr >= dCap ? Math.sin((fr - dCap) * 1.4) * 25 * Math.exp(-(fr - dCap) / 20) : 0}deg)` }}>🔔</span>
                  <Pill size={56} c="#fff" bg={fr >= dCap ? PINK : WIN} style={{ border: `2px solid ${PINK}` }}>{fr >= dCap ? "abriu capital!" : "Anthropic"}</Pill>
                </div>
              </In>
            )}
            {fr < d83 && fr >= dAnt && (
              <In fr={fr} d={dAnt + 4}>
                <Card w={860}>
                  <div style={{ fontFamily: MONO, fontSize: 30, color: GREY, marginBottom: 16 }}>📋 IPO · Anthropic, PBC</div>
                  {[["empresa privada", dAnt + 6], ["Claude", at(204)], ["ações na bolsa", dCap]].map(([t, d], k) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 10px", opacity: fr >= d ? 1 : 0.35 }}>
                      <span style={{ fontSize: 50, transform: `scale(${fr >= d ? pop(fr, d, 9) : 1})` }}>{fr >= d ? (k === 2 ? "🔔" : k === 1 ? "🤖" : "🏢") : "⬜"}</span>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: k === 2 && fr >= d ? PINK : "#fff" }}>{t}</span>
                      {fr >= d && <span style={{ marginLeft: "auto", fontSize: 44 }}>{k === 0 ? "➡️" : "✅"}</span>}
                    </div>
                  ))}
                </Card>
              </In>
            )}
            {fr >= d83 && (
              <In fr={fr} d={d83}>
                <Card w={900} glow>
                  <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>preço por ação</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 130, color: "#fff" }}>US$ {fmt(preco, 2)}</div>
                  {fr >= dAcoes && (
                    <>
                      <div style={{ fontFamily: MONO, fontSize: 30, color: GREY, marginTop: 10 }}>ações na oferta</div>
                      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 100, color: PINK }}>{fmt(Math.round(acoes))} mi</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                        {Array.from({ length: 49 }, (_, k) => <div key={k} style={{ width: 22, height: 30, borderRadius: 4, background: k / 49 < acoes / 980 ? PINK : "rgba(255,255,255,0.08)" }} />)}
                      </div>
                    </>
                  )}
                </Card>
              </In>
            )}
          </>
        )}
        {phase === 1 && (
          <>
            <In fr={fr} d={dMais}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: BODY, textAlign: "center" }}>US$ 83 × 980 mi =</div>
            </In>
            {fr >= dBi && (
              <div style={{ transform: `scale(${0.5 + 0.5 * pop(fr, dBi, 8)}) rotate(-3deg)`, marginTop: 20 }}>
                <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 150, color: "#fff", background: PINK, padding: "0 46px", borderRadius: 30, boxShadow: `0 0 90px ${PINKA(0.8)}`, whiteSpace: "nowrap" }}>US$ 81,3 bi</span>
              </div>
            )}
            {fr >= dBi + 14 && <In fr={fr} d={dBi + 14}><Pill size={50} c="#fff" bg="rgba(52,211,153,0.35)" style={{ border: `2px solid ${GREEN}` }}>🔓 o número do começo</Pill></In>}
          </>
        )}
        {phase === 2 && (
          <In fr={fr} d={dQui}>
            <Card w={900} glow={fr >= dT}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{fr >= dNas ? "📈 Nasdaq" : "📅 desde quinta"}</span>
                <span style={{ fontFamily: MONO, fontSize: 32, color: GREEN }}>● negociando</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 32, color: GREY, marginTop: 12 }}>19/11/2026 · código da ação</div>
              <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 30 }}>
                {[["A", dA], ["N", dN], ["T", dT]].map(([l, d], k) => {
                  const on = fr >= d;
                  const flip = on ? lin(fr, d, d + 6) : 0;
                  return (
                    <div key={l} style={{ width: 190, height: 250, borderRadius: 24, background: on ? PINK : "rgba(255,255,255,0.06)", border: `3px solid ${on ? "#fff" : "rgba(190,160,255,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 170, color: "#fff", transform: `rotateX(${(1 - flip) * (on ? 90 : 0)}deg)`, opacity: fr >= dCod ? 1 : 0.4 }}>
                      {on ? l : "·"}
                    </div>
                  );
                })}
              </div>
            </Card>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(240), dSur = at(244), dCom = at(245), dNum = at(247), dSeg = at(249), dArr = at(251), dSem = at(260);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 92, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>qual te surpreendeu?</div></In>
        <div style={{ display: "flex", gap: 20 }}>
          {[["1", "🪟"], ["2", "🎯"], ["3", "💎"], ["4", "✨"], ["5", "🏛️"]].map(([n, ic], k) => (
            <In key={n} fr={fr} d={d0 + 4 + k * 3}>
              <div style={{ width: 160, height: 190, borderRadius: 24, background: WIN, border: `3px solid ${fr >= dSur && k === Math.floor((fr - dSur) / 5) % 5 ? PINK : PINKA(0.4)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateY(${bob(fr * 2, k, 10)}px)` }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: 50 }}>{ic}</div>
              </div>
            </In>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 20, position: "relative" }}>
          {fr >= dNum + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dNum + 8 + k * 5; if (fr < t0) return null; const q = (fr - t0) / 40; return <div key={k} style={{ position: "absolute", left: 600 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "🔥"}</div>; })}
          <div style={{ width: 760, display: "flex", alignItems: "center", gap: 18, padding: "22px 28px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dNum ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dCom - 6, dCom), boxSizing: "border-box" }}>
            <span style={{ fontSize: 50 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>{typed("o número 5!", fr, dCom, dNum + 6)}{blink(fr)}</span>
            {fr >= dNum + 10 && <span style={{ marginLeft: "auto", fontSize: 50, transform: `scale(${pop(fr, dNum + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: lin(fr, dSeg - 4, dSeg + 2) }}>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", opacity: lin(fr, dArr, dArr + 6) }}>@phanteraicreative</span>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", background: fr >= dSem ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 40px", borderRadius: 20, transform: `scale(${fr >= dSem ? pop(fr, dSem, 9) : 1 + 0.05 * Math.sin(fr / 4)})` }}>{fr >= dSem ? "✓ Seguindo" : "Seguir"}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Bloco = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};

const Reacao = ({ fr, a, b, pose, top = 1150, left }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  const x = 10 - (1 - pin) * 420 - pout * 420;
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 300, ...(left ? { left: x } : { right: x }), top, zIndex: 8 }} />;
};

// ---------- legendas ----------
const KEY = new Set(["oitenta", "bilhoes", "dolares", "oferta", "so", "noticias", "cinco", "5", "fim", "microsoft", "sete", "7", "mai", "code", "96", "opus", "preco", "copilot", "github", "liquid", "ultra", "decide", "chance", "audio", "primeiro", "google", "neon", "tres", "3", "milhao", "contexto", "openai", "astra", "sol", "20", "barato", "passou", "fable", "custo", "anthropic", "capital", "83", "980", "81", "nasdaq", "ant", "surpreendeu", "comenta", "numero", "segue", "1", "2", "4"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5", sete: "7" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "oitenta" && nn(k + 1) === "e" && nn(k + 2) === "um" && nn(k + 3) === "bilhoes") { push("81 bilhões", k + 3); continue; }
    if (n === "oitenta" && nn(k + 1) === "e" && nn(k + 2) === "tres") { push("83", k + 2); continue; }
    if (n === "novecentos" && nn(k + 1) === "e" && nn(k + 2) === "oitenta") { push("980", k + 2); continue; }
    if (n === "noventa" && nn(k + 1) === "e" && nn(k + 2) === "seis" && nn(k + 3) === "por" && nn(k + 4) === "cento") { push("96%", k + 4); continue; }
    if (NUMS[n] && nn(k + 1) === "por" && nn(k + 2) === "cento") { push(NUMS[n] + "%", k + 2); continue; }
    if (n === "vinte" && nn(k + 1) === "por" && nn(k + 2) === "cento") { push("20%", k + 2); continue; }
    if (n === "cinco" && nn(k + 1) === "ponto" && (nn(k + 2) === "cinco" || nn(k + 2) === "dois")) { push("5." + (nn(k + 2) === "cinco" ? "5" : "2"), k + 2); continue; }
    if (n === "seis" && nn(k + 1) === "ponto" && nn(k + 2) === "dois") { push("6.2", k + 2); continue; }
    if (n === "de" && nn(k + 1) === "um" && nn(k + 2) === "ponto" && nn(k + 3) === "dois" && nn(k + 4) === "ultra") { push("d1.2-ultra", k + 4); continue; }
    if (n === "a" && nn(k + 1) === "i") { push("AI", k + 1); continue; }
    if (n === "a" && nn(k + 1) === "n" && nn(k + 2) === "t") { push("ANT", k + 2); continue; }
    if (n === "arroba" && nn(k + 1) === "phanter") { let j = k + 1; while (j < words.length && nn(j) !== "creative") j++; push("@phanteraicreative", j); continue; }
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "mai" && nn(k + 1) === "code" && nn(k + 2) === "dois") { push("MAI Code 2", k + 2); continue; }
    if (n === "gpt" && nn(k + 1) === "seis" && nn(k + 2) !== "ponto") { push("GPT-6", k + 1, false); continue; }
    if (n === "gpt") { toks.push({ t: "GPT", s: x.s, e: x.e }); continue; }
    if (n === "quatro" && nn(k - 1) === "gemini") { push("4", k); continue; }
    if (NUMS[n] && n !== "um") { push(NUMS[n], k); continue; }
    if (n === "um" && nn(k + 1) === "milhao") { push("1 milhão", k + 1); continue; }
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
        const key = w.key || KEY.has(norm(shown));
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2, whiteSpace: "nowrap" }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortResumoSemana = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(29), at(67), at(115), at(150), at(197), at(240), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(9)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(219)} b={at(227)} pose="apontando" top={1230} left />
      <Reacao fr={fr} a={at(249)} b={end} pose="comemorando" top={1180} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "coin", 0.45, 25)}
      {S(0, "riser", 0.3)}
      {S(at(3), "pop", 0.7)}
      {S(at(5), "coin", 0.35, 20)}
      {S(at(8), "error", 0.5, 15)}
      {S(at(10), "whoosh", 0.8, 30)}
      {S(at(20), "pop", 0.55)}
      {S(at(10) + 10, "ding", 0.4, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.35))}
      {[at(34), at(38), at(40), at(52), at(83), at(86), at(102), at(121), at(124), at(156), at(162), at(205), at(237), at(238), at(239)].map((b) => S(b, "pop", 0.3, 15))}
      {[at(56) + 6, at(66), at(90), at(107) + 18, at(139) + 10, at(167), at(183) + 22, at(192) + 8].map((b) => S(b, "ding", 0.32))}
      {[at(132), at(219), at(233)].map((b) => S(b, "whoosh", 0.45))}
      {[at(207), at(213), at(221)].map((b) => S(b, "coin", 0.3, 20))}
      {S(at(247) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaResumoSemana = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 140, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)" }}>US$ 81 bi</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2, marginTop: 24 }}>numa oferta só</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 54, color: BODY, marginTop: 30 }}>5 notícias da semana na IA</div>
    </div>
    <div style={{ position: "absolute", top: 920, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 28, padding: "0 90px", boxSizing: "border-box" }}>
      {[["1", "🪟"], ["2", "🎯"], ["3", "💎"], ["4", "✨"], ["5", "🔒"]].map(([n, ic], k) => (
        <div key={k} style={{ width: k < 3 ? 270 : 400, height: 250, borderRadius: 30, background: k === 4 ? PINKA(0.25) : WIN, border: `4px solid ${k === 4 ? PINK : PINKA(0.45)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: k === 4 ? `0 0 80px ${PINKA(0.7)}` : "none" }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1 }}>{n}</div>
          <div style={{ fontSize: 70 }}>{ic}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
