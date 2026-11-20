import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 20/11/2026 07:00 — "Fable 5.2 é melhor. Mas não é para tudo".
// Fatos conferidos no anúncio da Anthropic (anthropic.com/claude-fable-and-mythos-5-2, 09/11/2026) e na
// página "What's new in Claude Fable 5.2" da documentação: até 30% mais rápido que o 5.1; US$ 8 / US$ 40
// por milhão de tokens; FrontierCode 2.0 (49,1% Xhigh, maior entre os modelos lançados testados; High
// 45,3% contra 45,5% do melhor Opus 5.5, por ~metade do custo); SO protótipo com 1.000+ subagentes em
// 8 dias, liga num notebook, tela de login e instalador; dois problemas em aberto sobre buracos negros;
// "para a maioria das tarefas, comece pelo Opus 5.5". Fontes só no texto do post.
// Palco contínuo com interface recriada em motion; ações disparadas pelo índice da palavra em words.json.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SF52_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-20-0700-fable-5-2";
export const SF52_FPS = 30;
const FPS = SF52_FPS;
const f = (p) => staticFile(`${SF52_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const YEL = "#febc2e";
const BLUE = "#60a5fa";
const ORANGE = "#e8a26b";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Coding_at_Night.mp3";
const TAIL = 0.7;

export const calculateFable52Metadata = async () => {
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
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);
const In = ({ fr, d, children, dy = 50, style = {}, damping = 13 }) => {
  const p = pop(fr, d, damping);
  if (fr < d) return null;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * dy}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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
      <div style={{ position: "absolute", left: 20, top: 260, width: 1040, height: 1040, borderRadius: "50%",
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

const Janela = ({ title = "", children, w = 900, h = 760, style = {}, border }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${border || "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.18)}`, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginLeft: 14, whiteSpace: "nowrap" }}>{title}</div>
    </div>
    <div style={{ padding: 30, position: "relative", height: h - 64 }}>{children}</div>
  </div>
);

const Chip = ({ n, icon, titulo, sub, fr, d, warn }) => {
  const p = pop(fr, d, 13);
  const c = warn ? RED : PINK;
  return (
    <div style={{ position: "absolute", top: 190, left: 80, right: 80, display: "flex", alignItems: "center", gap: 26, padding: "20px 30px", borderRadius: 28, background: "rgba(30,18,60,0.92)", border: `2px solid ${warn ? RED : PINKA(0.6)}`, transform: `translateY(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`, opacity: p }}>
      <div style={{ width: 100, height: 100, borderRadius: 24, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff", flexShrink: 0 }}>{n}</div>
      <div style={{ fontSize: 70 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1.05 }}>{titulo}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 36, color: BODY, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
};

const Cena = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};

const Palco = ({ children, top = 420 }) => {
  const fr = useCurrentFrame();
  return <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, transform: `translateY(${Math.sin(fr / 18) * 6}px)` }}>{children}</div>;
};

const Big = ({ children, fr, d, top = 220, bg = PINK, rot = 0, size = 150 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", transform: `scale(${d <= 0 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : pop(fr, d, 9)})` }}>
    <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: size, color: "#fff", background: bg, padding: "0 42px", borderRadius: 30, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap" }}>{children}</span>
  </div>
);

const Pill = ({ children, bg = "rgba(52,211,153,0.16)", c = GREEN, size = 40 }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, background: bg, border: `2px solid ${c}`, padding: "8px 26px", borderRadius: 40, whiteSpace: "nowrap" }}>{children}</span>
);

// Enxame de agentes: n quadradinhos acendendo (cada um = 10 agentes quando "1.000").
const Enxame = ({ fr, d, dur = 40, cols = 20, rows = 10, w = 860, color = PINK }) => {
  const lit = Math.floor(cols * rows * ease(lin(fr, d, d + dur)));
  const cell = w / cols;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell - 8}px)`, gap: 8, width: w }}>
      {Array.from({ length: cols * rows }, (_, k) => {
        const on = k < lit;
        const tw = on ? 0.65 + 0.35 * Math.abs(Math.sin(fr / 5 + k * 1.7)) : 0.12;
        return <div key={k} style={{ height: cell - 8, borderRadius: 6, background: on ? color : "rgba(255,255,255,0.12)", opacity: tw }} />;
      })}
    </div>
  );
};

const Notebook = ({ fr, children, w = 760 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: w, height: w * 0.6, borderRadius: 26, background: "#05030c", border: "10px solid #3a3150", position: "relative", overflow: "hidden", boxShadow: `0 0 60px ${PINKA(0.25)}` }}>{children}</div>
    <div style={{ width: w + 120, height: 34, borderRadius: "0 0 30px 30px", background: "#3a3150" }} />
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const d2 = at(2), d5 = at(5), d7 = at(7), d11 = at(11), d17 = at(17);
  const agents = fmt(120 + 880 * ease(lin(fr, 0, d2 - 2)));
  const day = Math.min(8, 1 + Math.floor(7 * lin(fr, d2, d5)));
  const boot = lin(fr, d5, d7);
  const flash = Math.max(0, 1 - Math.abs(fr - d2) / 5) * 0.7 + Math.max(0, 1 - Math.abs(fr - d5) / 5) * 0.7 + Math.max(0, 1 - Math.abs(fr - d7) / 5) * 0.6;
  let big, bigD, size = 150;
  if (fr < d2) { big = agents; bigD = 0; size = 220; }
  else if (fr < d5) { big = `dia ${day}/8`; bigD = d2; size = 190; }
  else if (fr < d7) { big = "um sistema!"; bigD = d5; size = 160; }
  else if (fr < d17) { big = fr < d11 ? "5 novidades" : "a 5ª é um aviso"; bigD = fr < d11 ? d7 : d11; size = 120; }
  else { big = "Claude Fable 5.2"; bigD = d17; size = 120; }
  return (
    <AbsoluteFill>
      <Big fr={fr} d={bigD} size={size} top={200} rot={fr < d2 ? -3 : 0} bg={fr >= d11 && fr < d17 ? RED : PINK}>{big}</Big>
      {fr < d2 && <div style={{ position: "absolute", top: 500, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff", letterSpacing: -1 }}>agentes</div>}
      {fr < d7 && (
        <Palco top={fr < d2 ? 640 : 560}>
          {fr < d5 ? (
            <div style={{ transform: `scale(${fr < 8 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : 1})` }}>
              <Enxame fr={fr} d={0} dur={Math.max(10, d2 - 2)} />
            </div>
          ) : (
            <Notebook fr={fr}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
                <div style={{ width: 130, height: 130, borderRadius: 65, border: `12px solid rgba(255,255,255,0.15)`, borderTopColor: PINK, transform: `rotate(${fr * 18}deg) scale(${pop(fr, d5, 10)})` }} />
                <div style={{ width: 460, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                  <div style={{ width: `${100 * boot}%`, height: "100%", background: PINK }} />
                </div>
                <div style={{ fontFamily: MONO, fontSize: 32, color: GREEN }}>iniciando…</div>
              </div>
            </Notebook>
          )}
          {fr >= d2 && fr < d5 && (
            <div style={{ display: "flex", gap: 14, transform: `translateX(${shake(fr, d2, 12)}px)` }}>
              {Array.from({ length: 8 }, (_, k) => (
                <div key={k} style={{ width: 96, height: 110, borderRadius: 18, background: k < day ? PINK : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, color: "#fff" }}>
                  <div style={{ fontSize: 22, opacity: 0.8 }}>dia</div>
                  <div style={{ fontSize: 46 }}>{k + 1}</div>
                </div>
              ))}
            </div>
          )}
        </Palco>
      )}
      {fr >= d7 && fr < d17 && (
        <Palco top={520}>
          <div style={{ display: "flex", gap: 22 }}>
            {[1, 2, 3, 4, 5].map((n, k) => {
              const p = pop(fr, d7 + k * 3, 11);
              const warn = n === 5 && fr >= d11;
              return (
                <div key={k} style={{ width: 160, height: 220, borderRadius: 26, background: warn ? "rgba(255,92,122,0.25)" : "rgba(30,18,60,0.92)", border: `3px solid ${warn ? RED : PINKA(0.6)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: p,
                  transform: `scale(${(0.6 + 0.4 * p) * (warn ? 1.12 + 0.05 * Math.sin(fr / 3) : 1)}) translateX(${warn ? shake(fr, d11, 10) : 0}px)` }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff" }}>{n}</div>
                  <div style={{ fontSize: 54 }}>{warn ? "⚠️" : "?"}</div>
                </div>
              );
            })}
          </div>
          {fr >= d11 + 6 && <In fr={fr} d={d11 + 6}><Pill c={RED} bg="rgba(255,92,122,0.15)" size={44}>⚠ fica até o fim</Pill></In>}
        </Palco>
      )}
      {fr >= d17 && (
        <Palco top={500}>
          <div style={{ width: 860, borderRadius: 34, background: WIN, border: `3px solid ${PINK}`, padding: "40px 44px", boxShadow: `0 0 ${50 + 20 * Math.sin(fr / 5)}px ${PINKA(0.45)}`, transform: `scale(${pop(fr, d17, 11)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ width: 120, height: 120, borderRadius: 30, background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#2a1608", transform: `rotate(${fr * 3}deg)` }}>✳</div>
              <div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff" }}>Claude Fable 5.2</div>
                <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>{typed("claude-fable-5-2", fr, d17 + 4, d17 + 18)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
              {["Anthropic", "09/11/2026", "novo"].map((t, k) => fr >= d17 + 6 + k * 4 && <In key={k} fr={fr} d={d17 + 6 + k * 4}><Pill size={32} c={k === 2 ? PINK : BLUE} bg={k === 2 ? PINKA(0.15) : "rgba(96,165,250,0.15)"}>{t}</Pill></In>)}
            </div>
          </div>
        </Palco>
      )}
      <AbsoluteFill style={{ background: PINK, opacity: flash * 0.35, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ---------- 1: velocidade e preço ----------
const Item1 = ({ fr }) => {
  const d0 = at(22), dR = at(24), dB = at(30), dP = at(33), dE = at(39);
  const race = lin(fr, dR, dR + 45);
  const swing = Math.sin((fr - dP) / 5) * 14 * Math.exp(-Math.max(0, fr - dP) / 30);
  const tok = Math.floor(1000000 * ease(lin(fr, dP + 4, dE + 10)));
  return (
    <AbsoluteFill>
      <Chip n={1} icon="⚡" titulo="Mais rápido e mais barato" sub="comparado ao Fable 5.1" fr={fr} d={d0} />
      <Palco>
        <Janela title="saída do modelo · tokens/s" w={900} h={360}>
          {[["Fable 5.1", 1 / 1.3, GREY], ["Fable 5.2", 1, PINK]].map(([t, sp, c], k) => {
            const pr = Math.min(1, race * sp);
            return (
              <div key={k} style={{ marginBottom: 34 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", marginBottom: 10 }}>
                  <span>{t}</span><span style={{ color: pr >= 1 ? GREEN : GREY }}>{pr >= 1 ? "✓ pronto" : `${Math.round(pr * 100)}%`}</span>
                </div>
                <div style={{ height: 44, borderRadius: 22, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${100 * pr}%`, height: "100%", background: c, borderRadius: 22 }} />
                </div>
              </div>
            );
          })}
        </Janela>
        {fr >= dR + 10 && <In fr={fr} d={dR + 10}><Pill size={48}>⚡ até 30% mais rápido</Pill></In>}
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start", opacity: lin(fr, dB - 4, dB + 2) }}>
          <div style={{ transformOrigin: "50% 0%", transform: `rotate(${fr >= dP ? swing : 0}deg) scale(${fr >= dP ? pop(fr, dP, 9) : 0.8})` }}>
            <div style={{ width: 4, height: 50, background: "#fff", margin: "0 auto" }} />
            <div style={{ background: YEL, color: "#1a1030", fontFamily: inter, fontWeight: 800, fontSize: 84, padding: "12px 36px", borderRadius: 20, textAlign: "center" }}>US$ 8<div style={{ fontSize: 26 }}>por milhão · entrada</div></div>
          </div>
          <div style={{ marginTop: 60, width: 380, borderRadius: 24, background: WIN, border: "2px solid rgba(190,160,255,0.28)", padding: 22, fontFamily: MONO, color: "#fff" }}>
            <div style={{ fontSize: 24, color: GREY }}>tokens de entrada</div>
            <div style={{ fontSize: 46, color: PINK }}>{fmt(tok)}</div>
            <div style={{ fontSize: 24, color: GREY, marginTop: 8 }}>saída: US$ 40/milhão</div>
          </div>
        </div>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 2: código (FrontierCode 2.0) ----------
const BARS = [["Fable 5.2", 49.1, PINK], ["Opus 5.5", 45.5, ORANGE], ["GPT-6 Astra", 42.8, BLUE], ["Gemini 4 Carbon", 41.1, GREEN], ["Fable 5.1", 32.4, GREY]];
const Item2 = ({ fr }) => {
  const d0 = at(41), dG = at(44), dM = at(52), dA = at(57), dC = at(66);
  const second = fr >= dA;
  const g = ease(lin(fr, dG, dG + 24));
  return (
    <AbsoluteFill>
      <Chip n={2} icon="💻" titulo="Código" sub="FrontierCode 2.0" fr={fr} d={d0} />
      {!second ? (
        <Palco>
          <Janela title="FrontierCode 2.0 · % de mudanças aceitas" w={920} h={740}>
            {BARS.map(([t, v, c], k) => {
              const crown = k === 0 && fr >= dM;
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
                  <div style={{ width: 270, fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }}>{t}</div>
                  <div style={{ flex: 1, height: 70, borderRadius: 16, background: "rgba(255,255,255,0.07)", position: "relative" }}>
                    <div style={{ width: `${(v / 55) * 100 * g}%`, height: "100%", borderRadius: 16, background: c, boxShadow: crown ? `0 0 ${30 + 14 * Math.sin(fr / 3)}px ${PINK}` : "none" }} />
                  </div>
                  <div style={{ width: 130, fontFamily: MONO, fontSize: 36, color: k === 0 ? PINK : "#fff" }}>{(v * g).toFixed(1)}%</div>
                  <div style={{ width: 60, fontSize: 52, transform: `scale(${crown ? pop(fr, dM, 9) : 0}) rotate(${Math.sin(fr / 4) * 10}deg)` }}>👑</div>
                </div>
              );
            })}
          </Janela>
          {fr >= dM && <In fr={fr} d={dM}><Pill size={44}>👑 o maior entre os testados</Pill></In>}
        </Palco>
      ) : (
        <Palco top={440}>
          <div style={{ display: "flex", gap: 30 }}>
            {[["Fable 5.2", "esforço alto", 45.3, PINK, 1], ["Opus 5.5", "esforço máximo", 45.5, ORANGE, 2]].map(([t, e, v, c, cost], k) => {
              const p = pop(fr, dA + k * 5, 12);
              const s = ease(lin(fr, dA + 4, dA + 24));
              return (
                <div key={k} style={{ width: 430, borderRadius: 30, background: WIN, border: `3px solid ${c}`, padding: 30, transform: `scale(${p})`, textAlign: "center" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>{t}</div>
                  <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: BODY }}>{e}</div>
                  <div style={{ fontFamily: MONO, fontSize: 92, color: c, marginTop: 16 }}>{(v * s).toFixed(1)}%</div>
                  <div style={{ fontFamily: inter, fontSize: 28, color: GREY, marginTop: 20 }}>custo por tarefa</div>
                  <div style={{ height: 40, borderRadius: 20, background: "rgba(255,255,255,0.1)", marginTop: 12, overflow: "hidden" }}>
                    <div style={{ width: `${100 * (cost / 2) * ease(lin(fr, at(62) + k * 6, dC + 8))}%`, height: "100%", background: c }} />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 40, color: "#fff", marginTop: 10 }}>{fr >= dC ? (cost === 1 ? "½" : "1×") : "…"}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 120, color: "#fff", transform: `scale(${pop(fr, dA + 20, 10) * (1 + 0.08 * Math.sin(fr / 4))})` }}>≈ <span style={{ fontSize: 56 }}>quase empata</span></div>
          {fr >= dC && <In fr={fr} d={dC}><Pill size={52}>✂ metade do custo</Pill></In>}
        </Palco>
      )}
    </AbsoluteFill>
  );
};

// ---------- 3: o sistema operacional ----------
const Item3 = ({ fr }) => {
  const d0 = at(70), dF = at(72), dS = at(76), dD = at(80), dL = at(83), dLog = at(90), dI = at(93);
  const phase = fr < dL ? 0 : 1;
  const day = Math.min(8, 1 + Math.floor(7 * lin(fr, dD, dL - 2)));
  const agents = fmt(1000 * ease(lin(fr, dS, dS + 28)));
  const inst = lin(fr, dI + 4, dI + 30);
  return (
    <AbsoluteFill>
      <Chip n={3} icon="🖥️" titulo="O sistema operacional" sub="um teste de um engenheiro" fr={fr} d={d0} />
      {phase === 0 ? (
        <Palco top={430}>
          <Janela title={fr < dS ? "~/so-prototipo" : `~/so-prototipo · ${agents} subagentes`} w={900} h={620}>
            {fr < dS ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: lin(fr, d0 + 2, d0 + 8) }}>
                <div style={{ fontSize: 150, transform: `translateY(${Math.sin(fr / 4) * 8}px)` }}>📁</div>
                <div style={{ fontFamily: MONO, fontSize: 40, color: GREY }}>{typed("pasta vazia (0 arquivos)", fr, d0 + 6, dF + 8)}</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                <Enxame fr={fr} d={dS} dur={28} cols={20} rows={9} w={830} />
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>+{agents} <span style={{ fontSize: 40, color: BODY }}>subagentes</span></div>
              </div>
            )}
          </Janela>
          {fr >= dD && (
            <div style={{ display: "flex", gap: 12 }}>
              {Array.from({ length: 8 }, (_, k) => (
                <div key={k} style={{ width: 92, height: 92, borderRadius: 18, background: k < day ? PINK : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", transform: `scale(${k === day - 1 ? 1.1 : 1})` }}>d{k + 1}</div>
              ))}
            </div>
          )}
        </Palco>
      ) : (
        <Palco top={440}>
          <Notebook fr={fr} w={820}>
            {fr < dLog ? (
              <div style={{ position: "absolute", inset: 0, padding: 30, fontFamily: MONO, fontSize: 26, color: GREEN, lineHeight: 1.5 }}>
                {["[ ok ] núcleo", "[ ok ] disco", "[ ok ] teclado", "[ ok ] rede", "[ ok ] arquivos", "[ ok ] janelas"].map((t, k) => fr >= dL + k * 4 && <div key={k}>{t}</div>)}
              </div>
            ) : fr < dI ? (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#2b1a5e,#120a2a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
                <div style={{ width: 110, height: 110, borderRadius: 55, background: "rgba(255,255,255,0.2)", fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, dLog, 10)})` }}>👤</div>
                <div style={{ width: 360, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.15)", fontFamily: MONO, fontSize: 34, color: "#fff", display: "flex", alignItems: "center", padding: "0 18px" }}>{"•".repeat(Math.min(8, Math.max(0, Math.floor((fr - dLog) / 2))))}{blink(fr)}</div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, color: "#fff", background: PINK, padding: "8px 28px", borderRadius: 12 }}>Entrar</div>
              </div>
            ) : (
              <div style={{ position: "absolute", inset: 0, background: "#120a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 600, borderRadius: 20, background: "#f5f3ff", padding: 26, transform: `scale(${pop(fr, dI, 11)})` }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#1a1030" }}>📦 Instalador</div>
                  <div style={{ height: 26, borderRadius: 13, background: "#ddd", marginTop: 20, overflow: "hidden" }}><div style={{ width: `${100 * inst}%`, height: "100%", background: PINK }} /></div>
                  <div style={{ fontFamily: MONO, fontSize: 26, color: "#444", marginTop: 10 }}>{inst >= 1 ? "✓ instalado" : `${Math.round(inst * 100)}%`}</div>
                </div>
              </div>
            )}
          </Notebook>
          <div style={{ display: "flex", gap: 20 }}>
            {[["✓ liga no notebook", dL + 4], ["✓ login", dLog], ["✓ instalador", dI]].map(([t, d], k) => fr >= d && <In key={k} fr={fr} d={d}><Pill size={36}>{t}</Pill></In>)}
          </div>
        </Palco>
      )}
    </AbsoluteFill>
  );
};

// ---------- 4: ciência (buracos negros) ----------
const Item4 = ({ fr }) => {
  const d0 = at(94), dR = at(98), dP = at(100), dB = at(104);
  return (
    <AbsoluteFill>
      <Chip n={4} icon="🔭" titulo="Ciência" sub="física teórica" fr={fr} d={d0} />
      <Palco top={430}>
        <div style={{ width: 560, height: 560, position: "relative", transform: `scale(${0.8 + 0.2 * pop(fr, d0 + 4, 12) + 0.08 * lin(fr, dB, dB + 20)})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${fr * 4}deg, ${ORANGE}, ${PINK}, #6b3fd1, ${ORANGE})`, filter: "blur(6px)", opacity: 0.9 }} />
          <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: `conic-gradient(from ${-fr * 6}deg, transparent, rgba(255,255,255,0.5), transparent 40%)` }} />
          <div style={{ position: "absolute", inset: 120, borderRadius: "50%", background: "#000", boxShadow: "0 0 80px #000" }} />
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          {[0, 1].map((k) => {
            const d = dP + k * 8;
            const solved = fr >= d + 6;
            return (
              <div key={k} style={{ width: 420, borderRadius: 26, background: WIN, border: `3px solid ${solved ? GREEN : "rgba(190,160,255,0.3)"}`, padding: 24, opacity: lin(fr, dR - 4 + k * 4, dR + 2 + k * 4) }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>Problema {k + 1}</div>
                <div style={{ marginTop: 10, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 30, color: solved ? GREEN : YEL }}>{solved ? "✓ resolvido" : "em aberto…"}</div>
              </div>
            );
          })}
        </div>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 5: o aviso ----------
const MODELS = [["Haiku 5.5", "rápido"], ["Sonnet 5.5", "equilíbrio"], ["Opus 5.5", "dia a dia"], ["Fable 5.2", "o mais forte"]];
const Item5 = ({ fr }) => {
  const d0 = at(106), dA = at(109), dT = at(111), dO = at(119), dF = at(124), dP = at(127);
  const hover = fr < dO ? Math.floor((fr - dT) / 6) % 4 : fr < dF ? 2 : 3;
  return (
    <AbsoluteFill>
      <Chip n={5} icon="⚠️" titulo="O aviso" sub="da própria Anthropic" fr={fr} d={d0} warn />
      <Palco top={430}>
        <Janela title="escolher modelo" w={880} h={700} border={fr >= dA && fr < dA + 20 ? RED : undefined}>
          {MODELS.map(([t, s], k) => {
            const sel = fr >= dT && hover === k;
            const start = k === 2 && fr >= dO;
            const heavy = k === 3 && fr >= dF;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 26px", marginBottom: 18, borderRadius: 22, background: start ? "rgba(232,162,107,0.2)" : heavy ? PINKA(0.2) : sel ? "rgba(255,255,255,0.1)" : "transparent", border: `3px solid ${start ? ORANGE : heavy ? PINK : "rgba(190,160,255,0.2)"}`, transform: `scale(${start && fr < dF ? 1.04 : heavy ? 1.04 : 1})` }}>
                <div style={{ fontSize: 46 }}>✳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff" }}>{t}</div>
                  <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 28, color: BODY }}>{s}</div>
                </div>
                {start && <In fr={fr} d={dO}><Pill size={30} c={ORANGE} bg="rgba(232,162,107,0.15)">✓ comece aqui</Pill></In>}
                {heavy && <In fr={fr} d={dF}><Pill size={30} c={PINK} bg={PINKA(0.15)}>⬆ só no pesado</Pill></In>}
              </div>
            );
          })}
          {fr >= dT && fr < dO + 6 && (
            <div style={{ position: "absolute", left: 700, top: 60 + hover * 140 + 50, fontSize: 60, transition: "none" }}>👆</div>
          )}
        </Janela>
        {fr >= dP && <In fr={fr} d={dP}><Pill size={42} c={YEL} bg="rgba(254,188,46,0.15)">🏋️ trabalho mais pesado</Pill></In>}
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(130), dM = at(132), dQ = at(137), dC = at(141), dS = at(144);
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} top={210} size={96}>{fr < dM ? "É melhor…" : "…mas não pra tudo"}</Big>
      <Palco top={480}>
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          <div style={{ width: 380, borderRadius: 26, background: WIN, border: `3px solid ${GREEN}`, padding: 26, textAlign: "center", transform: `scale(${pop(fr, d0, 11)})` }}>
            <div style={{ fontSize: 70 }}>🏋️</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>trabalho pesado</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: GREEN }}>✓ Fable</div>
          </div>
          <div style={{ width: 380, borderRadius: 26, background: WIN, border: `3px solid ${fr >= dM ? ORANGE : "rgba(190,160,255,0.3)"}`, padding: 26, textAlign: "center", transform: `scale(${fr >= dM ? pop(fr, dM, 11) : 0.9})`, opacity: lin(fr, dM - 4, dM) }}>
            <div style={{ fontSize: 70 }}>📋</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>dia a dia</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: ORANGE }}>✓ Opus</div>
          </div>
        </div>
        {fr >= dQ && <In fr={fr} d={dQ}><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff" }}>Você usaria pra quê?</div></In>}
        <div style={{ width: 900, display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dC ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dC - 6, dC) }}>
          <span style={{ fontSize: 50 }}>💬</span>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>{typed("FABLE", fr, dC, dC + 10)}{blink(fr)}</span>
          {fr >= dC + 14 && <span style={{ marginLeft: "auto", fontSize: 50, transform: `scale(${pop(fr, dC + 14, 9)})` }}>❤️</span>}
        </div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", background: fr >= dS + 6 ? "rgba(255,255,255,0.15)" : PINK, padding: "16px 60px", borderRadius: 20, transform: `scale(${fr >= dS + 6 ? pop(fr, dS + 6, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dS - 6, dS) }}>{fr >= dS + 6 ? "✓ Seguindo" : "Seguir"}</div>
      </Palco>
    </AbsoluteFill>
  );
};

const Reacao = ({ fr, a, b, pose, top = 1150 }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 330, right: 20 - (1 - pin) * 420 - pout * 420, top }} />;
};

// ---------- legendas ----------
const KEY = new Set(["mil", "agentes", "oito", "dias", "sistema", "operacional", "cinco", "novidades", "quinta", "aviso", "fable", "claude", "trinta", "rapido", "barato", "dolares", "tokens", "codigo", "frontiercode", "maior", "empata", "opus", "metade", "custo", "pasta", "vazia", "subagentes", "notebook", "login", "instalador", "ciencia", "resolveu", "buracos", "negros", "anthropic", "pesado", "melhor", "tudo", "comenta", "segue", "49", "30", "8", "52", "55"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const nx = words[k + 1] && norm(words[k + 1].w), nx2 = words[k + 2] && norm(words[k + 2].w), nx3 = words[k + 3] && norm(words[k + 3].w);
    const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
    if (n === "numero" && NUM[nx]) { toks.push({ t: "Nº " + NUM[nx] + tail(words[k + 1]), s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "mil" && nx === "agentes") { toks.push({ t: "1.000", s: x.s, e: x.e, key: true }); continue; }
    if (n === "mil" && nx === "subagentes") { toks.push({ t: "1.000", s: x.s, e: x.e, key: true }); continue; }
    if (n === "cinco" && nx === "ponto" && (nx2 === "dois" || nx2 === "cinco")) { toks.push({ t: "5." + (nx2 === "dois" ? "2" : "5") + tail(words[k + 2]), s: x.s, e: words[k + 2].e, key: true }); k += 2; continue; }
    if (n === "trinta" && nx === "por" && nx2 === "cento") { toks.push({ t: "30%", s: x.s, e: words[k + 2].e, key: true }); k += 2; continue; }
    if (n === "quarenta" && nx === "e" && nx2 === "nove" && nx3 === "por") { toks.push({ t: "49%", s: x.s, e: words[k + 4].e, key: true }); k += 4; continue; }
    if (n === "oito" && nx === "dolares") { toks.push({ t: "US$ 8", s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "oito") { toks.push({ t: "8", s: x.s, e: x.e, key: true }); continue; }
    if (n === "dois" && nx === "problemas") { toks.push({ t: "2", s: x.s, e: x.e, key: true }); continue; }
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
    <div style={{ position: "absolute", left: 50, right: 50, top: 1550, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, transform: `scale(${0.85 + 0.15 * p})` }}>
      {chunk.map((w, i) => {
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[,!?:;…"]+$/g, "").replace(/\.$/, "");
        const key = w.key || KEY.has(norm(shown));
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortFable52 = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(22), at(41), at(70), at(94), at(106), at(130), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Cena key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      <Reacao fr={fr} a={0} b={at(4)} pose="surpresa" top={1130} />
      <Reacao fr={fr} a={at(109)} b={at(118)} pose="apontando" top={1180} />
      <Reacao fr={fr} a={at(141)} b={end} pose="comemorando" top={1180} />
      {fr >= at(2) && <Legendas chunks={chunks} fr={fr} />}
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={1} /></Sequence>
      <Sequence from={0} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.7} /></Sequence>
      <Sequence from={at(2)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.55} /></Sequence>
      <Sequence from={at(5)} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(11)} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.5} /></Sequence>
      <Sequence from={at(17)} durationInFrames={25}><Audio src={staticFile("sfx/ding.mp3")} volume={0.45} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      <Sequence from={at(33)} durationInFrames={30}><Audio src={staticFile("sfx/coin.mp3")} volume={0.3} /></Sequence>
      <Sequence from={at(109)} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.35} /></Sequence>
      {[at(52), at(67), at(91), at(119), at(144) + 6].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.35} /></Sequence>)}
      {[at(87), at(106) - 10, at(98) + 14].map((b, k) => <Sequence key={"d" + k} from={b} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const CapaFable52 = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 50, right: 50, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 150, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)" }}>1.000 agentes</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1.05, marginTop: 36, letterSpacing: -2 }}>8 dias, um sistema<br />operacional</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 56, color: BODY, marginTop: 22 }}>Fable 5.2: melhor, mas não pra tudo</div>
    </div>
    <div style={{ position: "absolute", top: 1085, left: 110 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 35px)", gap: 8 }}>
        {Array.from({ length: 160 }, (_, k) => <div key={k} style={{ height: 35, borderRadius: 6, background: PINK, opacity: 0.55 + 0.45 * Math.abs(Math.sin(k * 1.7)) }} />)}
      </div>
    </div>
    <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 340, right: 20, top: 1320 }} />
  </AbsoluteFill>
);
