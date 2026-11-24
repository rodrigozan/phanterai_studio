import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 24/11/2026 12:00 — "Códigos secretos para o ChatGPT e o Claude" (5 atalhos oficiais).
// Fatos conferidos nas fontes primárias (texto capturado em fontes/ em 24/11/2026):
// - code.claude.com/docs/en/model-config: "Include ultrathink anywhere in your prompt to request deeper reasoning on that
//   turn without changing your session effort setting"; "think", "think hard" = texto comum; no terminal a palavra fica
//   "in rainbow colors" quando pode elevar o turno.
// - developers.openai.com/codex/reference/slash-commands ("Reference for slash commands in the ChatGPT desktop app"):
//   /plan "Toggle plan mode for multi-step planning"; /goal "Set a persistent goal for ChatGPT to work toward" (trabalha
//   "until it finishes the task, pauses, or needs more input"; exemplo JS -> TypeScript); /side "temporary side chat
//   without interrupting the main chat".
// - code.claude.com/docs/en/commands: /btw "Ask a side question about the current session without adding to the conversation".
// - code.claude.com/docs/en/interactive-mode: "Esc + Esc ... When the input is empty, double Esc opens the rewind menu to
//   restore or summarize code and conversation from a previous point".
// Tudo é interface recriada em motion no Remotion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
export const SCS_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-24-1200-codigos-secretos-chatgpt-claude";
export const SCS_FPS = 30;
const MUSIC = "phanterai/music/Coding_at_Night.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = SCS_FPS;
const f = (p) => staticFile(`${SCS_SLUG}/${p}`);
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
export const calculateCodigosSecretosMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças ----------
const CYAN = "#5ee7ff";
const rainbow = (txt, fr, on = true) => txt.split("").map((ch, k) => (
  <span key={k} style={{ color: on ? `hsl(${(k * 38 + fr * 9) % 360},95%,68%)` : "#fff", textShadow: on ? `0 0 18px hsla(${(k * 38 + fr * 9) % 360},95%,60%,0.7)` : "none" }}>{ch}</span>
));
// chip neutro com o nome do produto (sem logo oficial)
const Prod = ({ name, c = PINK, size = 54, icon }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "18px 34px", borderRadius: 40, background: WIN, border: `4px solid ${c}`, boxShadow: `0 0 50px ${c}55` }}>
    <span style={{ width: 56, height: 56, borderRadius: 28, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#0b0618" }}>{icon}</span>
    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: size, color: "#fff" }}>{name}</span>
  </div>
);
const Key = ({ fr, d, label = "Esc", w = 230 }) => {
  const down = fr >= d && fr < d + 5;
  return (
    <div style={{ width: w, height: 190, borderRadius: 30, background: fr >= d ? PINKA(0.35) : "#2a2050", border: `5px solid ${fr >= d ? PINK : "#4a3f78"}`, boxShadow: down ? `0 4px 0 #120c26, 0 0 60px ${PINK}` : "0 16px 0 #120c26", transform: `translateY(${down ? 12 : 0}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 72, color: "#fff" }}>{label}</div>
  );
};
// caixa de prompt (composer)
const Composer = ({ children, w = 900, hot, c = PINK, right = "↑" }) => (
  <div style={{ width: w, padding: "22px 28px", borderRadius: 30, background: WIN, border: `3px solid ${hot ? c : LINE}`, display: "flex", alignItems: "center", gap: 18, boxSizing: "border-box", boxShadow: hot ? `0 0 50px ${c}55` : "none" }}>
    <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 38, color: "#fff", flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{children}</span>
    {right && <span style={{ width: 62, height: 62, borderRadius: 31, background: hot ? c : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#fff" }}>{right}</span>}
  </div>
);

// ---------- 0: gancho ----------
const WALL = ["Por favor, pense com muito cuidado,", "analise todos os detalhes possíveis,", "seja extremamente minucioso e", "revise tudo de novo antes de", "responder, considerando cada caso,", "e lembre de pensar passo a passo,", "sem esquecer nada importante…"];
const Hook = ({ fr }) => {
  const dCod = at(7), dCinco = at(9), dGpt = at(12), dCl = at(15), dNing = at(17), dQuin = at(22), dVolta = at(23);
  let big, bigD, size = 118, bg = RED, rot = -3;
  if (fr < dCod) { big = "desperdiçando"; bigD = 0; size = 132; }
  else if (fr < dNing) { big = "5 códigos"; bigD = dCod; size = 150; bg = PINK; rot = 2; }
  else if (fr < dQuin) { big = "quase ninguém usa"; bigD = dNing; size = 100; bg = PINK; }
  else { big = "o 5º volta no tempo"; bigD = dQuin; size = 92; bg = PINK; rot = -2; }
  const flash = [dCod, dCinco, dGpt, dCl, dNing, dVolta].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const lines = Math.min(WALL.length, Math.floor(fr / 5) + 2);
  const collapse = ease(lin(fr, dCod - 2, dCod + 6));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dCod + 6 ? (
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(fr, [0, 8], [1.2, 1], clamp) * (1 - 0.85 * collapse)}) translateX(${shake(fr, at(2), 20)}px)`, opacity: 1 - collapse }}>
          <Janela title="seu prompt" w={940} h={540} glow>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {WALL.slice(0, lines).map((t, k) => (
                <div key={k} style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 38, color: BODY, whiteSpace: "nowrap" }}>
                  {k === lines - 1 ? typed(t, fr, (lines - 2) * 5, (lines - 1) * 5) : t}{k === lines - 1 && blink(fr)}
                  {fr >= at(4) + k * 2 && <div style={{ position: "absolute", left: 0, top: "52%", height: 6, borderRadius: 3, background: RED, width: `${100 * lin(fr, at(4) + k * 2, at(4) + k * 2 + 6)}%` }} />}
                </div>
              ))}
            </div>
          </Janela>
          <div style={{ marginTop: 30 }}><Stamp fr={fr} d={at(4)} size={70} rot={-5} c={RED}>texto demais</Stamp></div>
        </div>
      ) : (
        <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", gap: 18 }}>
            {[1, 2, 3, 4, 5].map((n, k) => {
              const d = dCod + 2 + k * 3, last = k === 4, hot = last && fr >= dQuin;
              return (
                <In key={n} fr={fr} d={d} dy={120}>
                  <div style={{ width: 168, height: 230, borderRadius: 28, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : !last && fr >= dNing + k * 6 ? AMBER : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `translateX(${hot ? shake(fr, dQuin, 14) : 0}px) scale(${hot ? 1.12 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#fff", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: last ? PINK : GREY, transform: `scale(${!last && fr >= dNing + k * 6 ? 0.7 + 0.3 * pop(fr, dNing + k * 6, 8) : 1})` }}>{last ? (fr >= dVolta ? "⏪" : "❓") : fr >= dNing + k * 6 ? "🔒" : "/ ?"}</div>
                  </div>
                </In>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", width: 1000 }}>
            {fr >= dGpt && <In fr={fr} d={dGpt} dx={-160} dy={0}><Prod name="ChatGPT" icon="/" c={GREEN} /></In>}
            {fr >= dCl && <In fr={fr} d={dCl} dx={160} dy={0}><Prod name="Claude" icon="✱" c={AMBER} /></In>}
          </div>
          {fr >= dVolta && (
            <In fr={fr} d={dVolta}>
              <div style={{ width: 230, height: 230, borderRadius: 115, border: `8px solid ${PINK}`, position: "relative", background: WIN, boxShadow: `0 0 70px ${PINKA(0.6)}` }}>
                {[0, 1].map((h) => <div key={h} style={{ position: "absolute", left: 111, top: h ? 50 : 30, width: 8, height: h ? 65 : 85, background: h ? PINK : "#fff", borderRadius: 4, transformOrigin: `50% ${h ? 65 : 85}px`, transform: `rotate(${-(fr - dVolta) * (h ? 9 : 30)}deg)` }} />)}
              </div>
            </In>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: ultrathink ----------
const Item1 = ({ fr }) => {
  const d0 = at(26), dUlt = at(28), dEsc = at(29), dPal = at(31), dPensa = at(39), dFundo = at(41), dSo = at(42), dTerm = at(45), dCor = at(49), dArco = at(51);
  const prompt = "refatora o login ";
  const tPrompt = typed(prompt, fr, dEsc, dPal);
  const tWord = fr >= dPal ? typed("ultrathink", fr, dPal, dPal + 9) : "";
  const rb = fr >= dCor;
  const level = fr < dPensa ? 0.45 : 0.45 + 0.4 * ease(lin(fr, dPensa, dFundo + 6));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🧠" t="ultrathink" sub="no Claude Code" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {fr < dEsc ? (
          <In fr={fr} d={dUlt}><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 120, padding: "40px 60px", borderRadius: 40, background: WIN, border: `4px solid ${PINK}`, transform: `scale(${1 + 0.05 * Math.sin(fr / 3)})` }}>{rainbow("ultrathink", fr)}</div></In>
        ) : (
          <In fr={fr} d={dEsc}>
            <Janela title={fr >= dTerm ? "terminal · claude" : "Claude Code"} w={960} h={380} glow={rb}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, color: "#fff", whiteSpace: "nowrap" }}>
                <span style={{ color: PINK }}>&gt; </span>{tPrompt}<span style={{ background: fr >= dPal && fr < dCor ? PINKA(0.35) : "transparent", borderRadius: 8 }}>{rb ? rainbow(tWord, fr) : tWord}</span>{blink(fr)}
              </div>
              {fr >= dPal + 10 && <div style={{ marginTop: 34, display: "flex", gap: 16 }}><In fr={fr} d={dPal + 10} dy={30}><Pill size={34} c={PINK} bg={PINKA(0.15)}>palavra reconhecida ✓</Pill></In></div>}
            </Janela>
          </In>
        )}
        {fr >= dPal + 12 && (
          <In fr={fr} d={dPal + 12}>
            <div style={{ width: 940, padding: "26px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dPensa ? PINK : LINE}`, boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", marginBottom: 18 }}>
                <span>🧠 raciocínio</span><span style={{ color: fr >= dFundo ? PINK : GREY }}>{fr >= dFundo ? "mais fundo" : "normal"}</span>
              </div>
              <div style={{ height: 54, borderRadius: 27, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${level * 100}%`, borderRadius: 27, background: rb ? `linear-gradient(90deg, hsl(${fr * 9 % 360},90%,60%), hsl(${(fr * 9 + 120) % 360},90%,60%), hsl(${(fr * 9 + 240) % 360},90%,60%))` : `linear-gradient(90deg,#a02c90,${PINK})` }} />
              </div>
              {fr >= dSo && <div style={{ marginTop: 20, display: "flex", gap: 16, alignItems: "center" }}><In fr={fr} d={dSo} dx={-80} dy={0}><Pill size={34} c={AMBER} bg="rgba(251,191,36,0.14)">só nesta resposta</Pill></In>{fr >= dSo + 10 && <In fr={fr} d={dSo + 10} dx={-80} dy={0}><Pill size={30} c={GREY} bg="rgba(255,255,255,0.05)">sessão: igual</Pill></In>}</div>}
            </div>
          </In>
        )}
        {fr >= dPensa && fr < dArco + 4 && (
          <In fr={fr} d={dPensa}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, padding: "16px 26px", borderRadius: 20, background: WIN, border: `3px solid ${LINE}`, color: GREY, textDecoration: fr >= dTerm ? "line-through" : "none" }}>"think hard"</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: GREY }}>{fr >= dTerm ? "= texto comum" : "não é atalho"}</div>
            </div>
          </In>
        )}
        {fr >= dArco && <Stamp fr={fr} d={dArco} size={76} rot={-4}>🌈 arco-íris</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: /plan ----------
const CMDS = ["/plan", "/goal", "/side", "/review", "/model"];
const STEPS = ["ler o projeto", "listar o que muda", "editar os arquivos", "testar"];
const Item2 = ({ fr }) => {
  const d0 = at(52), dBarra = at(54), dPlan = at(55), dApp = at(57), dComp = at(61), dMonta = at(63), dEtapas = at(67), dAntes = at(68), dFaz = at(71);
  const menu = fr >= dBarra && fr < dPlan + 10;
  const sel = fr >= dPlan;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="📋" t="/plan" sub="no app do ChatGPT pro computador" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 4}>
          <div style={{ position: "relative" }}>
            <div style={{ height: 70, marginBottom: 12, display: "flex", justifyContent: "center" }}>{fr >= dApp && <In fr={fr} d={dApp} dy={20}><Pill size={32} c={GREEN} bg="rgba(52,211,153,0.12)">💻 ChatGPT · app pro computador</Pill></In>}</div>
            <Composer hot={fr >= dBarra} c={GREEN}>{fr < dBarra ? <span style={{ color: GREY }}>Peça qualquer coisa…</span> : sel ? <span><span style={{ color: GREEN }}>/plan</span> {typed("migrar o site", fr, dPlan + 8, dComp)}</span> : "/"}{blink(fr)}</Composer>
            {menu && (
              <div style={{ position: "absolute", top: 202, left: 0, width: 520, borderRadius: 24, background: "#1b1436", border: `3px solid ${GREEN}`, overflow: "hidden", zIndex: 4, transform: `scaleY(${pop(fr, dBarra, 12)})`, transformOrigin: "top" }}>
                {CMDS.map((c, k) => <div key={c} style={{ padding: "16px 26px", fontFamily: MONO, fontWeight: 800, fontSize: 38, color: "#fff", background: k === 0 && (sel || Math.floor((fr - dBarra) / 3) % 5 === 0) ? "rgba(52,211,153,0.35)" : Math.floor((fr - dBarra) / 3) % 5 === k ? "rgba(255,255,255,0.08)" : "transparent" }}>{c}</div>)}
              </div>
            )}
          </div>
        </In>
        {fr >= dPlan + 10 && (
          <In fr={fr} d={dPlan + 10}>
            <Janela title={fr >= dMonta ? "plano · em etapas" : "modo plano ● ligado"} w={900} h={500} glow={fr >= dEtapas}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {STEPS.map((t, k) => { const d = dPlan + 16 + k * 7; return fr >= d && (
                  <In key={t} fr={fr} d={d} dx={-120} dy={0}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 24px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `3px solid ${fr >= dEtapas + k * 2 ? GREEN : LINE}` }}>
                      <span style={{ width: 58, height: 58, borderRadius: 29, background: fr >= dEtapas + k * 2 ? GREEN : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#0b0618" }}>{k + 1}</span>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{t}</span>
                    </div>
                  </In>
                ); })}
              </div>
            </Janela>
          </In>
        )}
        {fr >= dAntes && (
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <In fr={fr} d={dAntes}><div style={{ padding: "18px 36px", borderRadius: 22, background: "rgba(255,255,255,0.08)", fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY, border: `3px solid ${LINE}` }}>🔒 executar</div></In>
            {fr >= dFaz && <Stamp fr={fr} d={dFaz} size={54} rot={-4} c={GREEN}>plano antes ✓</Stamp>}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: /goal ----------
const Item3 = ({ fr }) => {
  const d0 = at(72), dGoal = at(74), dObj = at(79), dFixo = at(80), dTrab = at(84), dTerm = at(87), dPausa = at(88), dPrec = at(90);
  const prog = fr < dTrab ? 0.04 : 0.04 + 0.9 * ease(lin(fr, dTrab, dTerm + 4));
  const paused = fr >= dPausa && fr < dPrec;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="🎯" t="/goal" sub="um objetivo que fica" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {fr >= dFixo && (
          <In fr={fr} d={dFixo}>
            <div style={{ width: 900, padding: "24px 30px", borderRadius: 28, background: WIN, border: `3px solid ${paused ? AMBER : fr >= dPrec ? PINK : GREEN}`, boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>
                <span>🎯 Goal</span>
                <span style={{ fontFamily: MONO, fontSize: 30, color: paused ? AMBER : fr >= dPrec ? PINK : GREEN }}>{fr >= dPrec ? "● precisa de você" : paused ? "⏸ pausado" : fr >= dTrab ? "● trabalhando" : "● ativo"}</span>
                <span style={{ marginLeft: "auto", display: "flex", gap: 10 }}>{["⏸", "✏️", "✕"].map((b, k) => <span key={b} style={{ width: 60, height: 60, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: k === 0 && paused ? AMBER : "rgba(255,255,255,0.08)", transform: `scale(${k === 0 && fr >= dPausa && fr < dPausa + 6 ? 0.85 : 1})` }}>{b}</span>)}</span>
              </div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, color: BODY, margin: "14px 0" }}>migrar o site de JavaScript pra TypeScript</div>
              <div style={{ height: 40, borderRadius: 20, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}><div style={{ height: "100%", width: `${prog * 100}%`, background: paused ? AMBER : `linear-gradient(90deg,#1f9e74,${GREEN})`, borderRadius: 20 }} /></div>
            </div>
          </In>
        )}
        {fr < dFixo && fr >= d0 + 6 && (
          <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <In fr={fr} d={d0 + 6}><div style={{ position: "relative", width: 360, height: 360 }}>
              {[0, 1, 2, 3].map((r) => <div key={r} style={{ position: "absolute", inset: r * 45, borderRadius: "50%", border: `16px solid ${r % 2 ? "#fff" : GREEN}`, transform: `scale(${1 + 0.04 * Math.sin(fr / 4 + r)})` }} />)}
              {fr >= dObj && <div style={{ position: "absolute", left: interpolate(fr, [dObj, dObj + 6], [700, 170], clamp), top: 150, fontSize: 90, transform: "rotate(-135deg)" }}>➶</div>}
            </div></In>
          </div>
        )}
        <In fr={fr} d={d0 + 4}>
          <Composer hot={fr >= dGoal && fr < dFixo + 4} c={GREEN} right={fr >= dFixo ? "↑" : "↑"}>{fr < dGoal ? <span style={{ color: GREY }}>Peça qualquer coisa…</span> : fr < dFixo ? <span><span style={{ color: GREEN }}>/goal</span> {typed("migrar o site pra TS", fr, dGoal + 4, dObj + 8)}</span> : <span style={{ color: GREY }}>Peça mudanças…</span>}{blink(fr)}</Composer>
        </In>
        {fr >= dTrab && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 900 }}>
            {[["src/app.js", "→ app.ts"], ["src/api.js", "→ api.ts"], ["src/ui.js", "→ ui.ts"]].map(([a, b], k) => { const d = dTrab + 4 + k * 6; return fr >= d && (
              <In key={a} fr={fr} d={d} dx={140} dy={0}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 24px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: `2px solid ${fr >= d + 8 ? GREEN : LINE}`, fontFamily: MONO, fontWeight: 800, fontSize: 32, color: "#fff" }}>
                  <span>📄 {a}</span><span style={{ color: GREEN }}>{fr >= d + 8 ? b : ""}</span><span style={{ marginLeft: "auto" }}>{fr >= d + 8 ? <span style={{ color: GREEN }}>✓</span> : <Spin fr={fr} c={GREEN} s={32} />}</span>
                </div>
              </In>
            ); })}
          </div>
        )}
        <div style={{ display: "flex", gap: 18 }}>
          {[["✅", "terminar", dTerm, GREEN], ["⏸", "pausar", dPausa, AMBER], ["🙋", "precisar de você", dPrec, PINK]].map(([ic, t, d, c]) => fr >= d && <In key={t} fr={fr} d={d} dy={60}><Pill size={34} c={c} bg={`${c}22`}>{ic} {t}</Pill></In>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: pergunta de lado ----------
const Item4 = ({ fr }) => {
  const d0 = at(93), dLado = at(95), dBtw = at(98), dCl = at(103), dSide = at(104), dGpt = at(107), dTira = at(108), dDuv = at(110), dSem = at(111), dPrin = at(114);
  const prog = 0.2 + 0.7 * lin(fr, d0, dPrin + 20);
  const q = "qual era aquele arquivo?";
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="💬" t="Pergunta de lado" sub="sem mexer na conversa" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <In fr={fr} d={d0 + 4}>
          <div style={{ position: "relative", width: 940, height: 620 }}>
            <Janela title="conversa principal" w={940} h={620} glow={fr >= dPrin}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: fr >= dLado && fr < dPrin ? 0.45 : 1 }}>
                {["Lendo os arquivos…", "Editando o login…", "Rodando os testes…"].map((t, k) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#fff" }}>
                    {prog > (k + 1) / 3.2 ? <span style={{ color: GREEN }}>✓</span> : <Spin fr={fr} c={PINK} s={34} />} {t}
                  </div>
                ))}
                <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.07)", overflow: "hidden", marginTop: 8 }}><div style={{ height: "100%", width: `${prog * 100}%`, background: `linear-gradient(90deg,#a02c90,${PINK})` }} /></div>
                {fr >= dPrin && <div style={{ marginTop: 14 }}><Pill size={34}>✓ continua de onde estava</Pill></div>}
              </div>
            </Janela>
            {fr >= dLado && fr < dPrin && (
              <div style={{ position: "absolute", right: -10, top: 210, transform: `translateX(${(1 - pop(fr, dLado, 12)) * 600}px)` }}>
                <div style={{ width: 620, padding: "24px 28px", borderRadius: 28, background: "#22183f", border: `4px solid ${fr >= dSide ? GREEN : AMBER}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", boxSizing: "border-box" }}>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff" }}>
                    <span style={{ color: fr >= dSide ? GREEN : AMBER }}>{fr >= dSide ? "/side" : fr >= dBtw ? typed("/btw", fr, dBtw, dBtw + 10) : "↪"}</span>
                  </div>
                  {fr >= dTira && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", marginTop: 14 }}>{typed(q, fr, dTira, dDuv + 6)}</div>}
                  {fr >= dSem && <In fr={fr} d={dSem} dy={20}><div style={{ marginTop: 14, padding: "12px 18px", borderRadius: 16, background: "rgba(255,255,255,0.08)", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: CYAN }}>→ config/auth.ts</div></In>}
                </div>
              </div>
            )}
          </div>
        </In>
        <div style={{ display: "flex", gap: 22 }}>
          {fr >= dCl - 6 && <In fr={fr} d={dCl - 6} dy={60}><Pill size={40} c={AMBER} bg="rgba(251,191,36,0.14)">Claude → /btw</Pill></In>}
          {fr >= dGpt - 6 && <In fr={fr} d={dGpt - 6} dy={60}><Pill size={40} c={GREEN} bg="rgba(52,211,153,0.14)">ChatGPT → /side</Pill></In>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: Esc Esc ----------
const MSGS = ["refatora o login", "agora troca o banco", "apaga a pasta antiga"];
const Item5 = ({ fr }) => {
  const d0 = at(116), dEsc = at(118), dDuas = at(119), dVez = at(120), dCaixa = at(123), dCl = at(126), dMenu = at(130), dVolta = at(132), dCod = at(134), dConv = at(137), dPonto = at(140);
  const showKeys = fr < dCaixa + 4;
  const pick = fr >= dVolta - 4;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="5" icon="⏪" t="Esc duas vezes" sub="no Claude Code" />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {showKeys ? (
          <>
            <div style={{ display: "flex", gap: 40, marginTop: 30 }}>
              <In fr={fr} d={dEsc - 3}><Key fr={fr} d={dEsc} /></In>
              {fr >= dDuas - 3 && <In fr={fr} d={dDuas - 3}><Key fr={fr} d={dDuas + 4} /></In>}
            </div>
            {fr >= dVez && <Stamp fr={fr} d={dVez} size={70} rot={-4}>× 2</Stamp>}
            {fr >= at(121) && <In fr={fr} d={at(121)}><Composer hot={fr >= dCaixa} c={AMBER} right={null}><span style={{ color: GREY }}>&gt; </span>{fr >= dCaixa ? <span style={{ color: AMBER, fontSize: 32 }}>(caixa vazia)</span> : ""}{blink(fr)}</Composer></In>}
          </>
        ) : (
          <In fr={fr} d={dCaixa + 4}>
            <Janela title="Rewind · voltar para…" w={940} h={480} glow={fr >= dMenu}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {MSGS.map((m, k) => {
                  const hot = pick ? k === 0 : Math.floor((fr - dMenu) / 5) % 3 === 2 - k;
                  const gone = fr >= dCod && k > 0;
                  return (
                    <In key={m} fr={fr} d={dCaixa + 6 + k * 4} dx={-100} dy={0}>
                      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 20, background: hot ? PINKA(0.25) : "rgba(255,255,255,0.05)", border: `3px solid ${hot ? PINK : LINE}`, opacity: gone ? 0.35 : 1 }}>
                        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: GREY }}>{["10:02", "10:09", "10:15"][k]}</span>
                        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", textDecoration: gone ? "line-through" : "none" }}>{m}</span>
                        {hot && <span style={{ marginLeft: "auto", color: PINK, fontFamily: inter, fontWeight: 800, fontSize: 36 }}>◀</span>}
                      </div>
                    </In>
                  );
                })}
                {fr >= dVolta && (
                  <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                    {[["📄 código", dCod], ["💬 conversa", dConv]].map(([t, d]) => <In key={t} fr={fr} d={d - 3} dy={40}><Pill size={36} c={fr >= d + 3 ? GREEN : GREY} bg={fr >= d + 3 ? "rgba(52,211,153,0.14)" : "rgba(255,255,255,0.05)"}>{t} {fr >= d + 3 ? "✓ restaurado" : "…"}</Pill></In>)}
                  </div>
                )}
              </div>
            </Janela>
          </In>
        )}
        {fr >= dPonto && <Stamp fr={fr} d={dPonto} size={70} rot={-4} c={GREEN}>⏪ voltou no tempo</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(142), dPrim = at(145), dCom = at(146), dK = at(147), dSeg = at(150);
  const hl = fr < dCom ? Math.floor((fr - d0) / 5) % 5 : 4;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 100, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>qual primeiro?</div></In>
        <div style={{ display: "flex", gap: 14 }}>
          {[["🧠", "ultrathink"], ["📋", "/plan"], ["🎯", "/goal"], ["💬", "/btw"], ["⏪", "Esc Esc"]].map(([ic, t], k) => (
            <In key={t} fr={fr} d={d0 + 2 + k * 2}>
              <div style={{ width: 186, height: 210, borderRadius: 26, background: hl === k ? PINKA(0.25) : WIN, border: `4px solid ${hl === k ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, transform: `scale(${hl === k ? 1.08 : 1})` }}>
                <span style={{ fontSize: 64 }}>{ic}</span>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#fff" }}>{t}</span>
              </div>
            </In>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 16, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 5; if (fr < t0) return null; const q = ((fr - t0) % 36) / 34; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : LINE}`, opacity: Math.max(0.35, lin(fr, dPrim, dCom)), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("CÓDIGO", fr, dK - 2, dK + 8)}{blink(fr)}</span>
            {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
        </div>
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

// ---------- legendas ----------
const KEY = new Set(["desperdicando", "prompts", "codigos", "5", "atalhos", "chatgpt", "claude", "ninguem", "quinto", "tempo", "ultrathink", "palavra", "fundo", "resposta", "terminal", "arcoiris", "colorida", "app", "computador", "plano", "etapas", "antes", "objetivo", "fixo", "terminar", "pausar", "precisar", "lado", "duvida", "principal", "esc", "vezes", "vazia", "menu", "volta", "codigo", "conversa", "anterior", "primeiro", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "barra" && nn(k + 1) === "b" && nn(k + 3) === "w") { push("/btw", k + 3); continue; }
    if (n === "barra" && words[k + 1]) { push("/" + norm(words[k + 1].w), k + 1); continue; }
    if (n === "cinco") { push("5", k); continue; }
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

export const ShortCodigosSecretos = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(26), at(52), at(72), at(93), at(116), at(142), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(117)} b={at(124)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(147)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(4), "error", 0.4, 15)}
      {S(at(7), "whoosh", 0.8, 30)}
      {S(at(7) + 2, "ding", 0.4, 15)}
      {[0, 3, 6, 9, 12].map((o) => S(at(9) + o, "pop", 0.3, 15))}
      {S(at(12), "pop", 0.4, 15)}
      {S(at(15), "pop", 0.4, 15)}
      {S(at(17), "error", 0.3, 15)}
      {[0, 6, 12, 18].map((o) => S(at(17) + o, "pop", 0.25, 15))}
      {S(at(23), "riser", 0.35, 30)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(31) + 10, "ding", 0.35)}
      {S(at(49), "coin", 0.3, 15)}
      {S(at(51), "ding", 0.4)}
      {S(at(54), "pop", 0.35, 15)}
      {S(at(55), "ding", 0.3)}
      {[0, 5, 10, 15].map((o) => S(at(63) + o, "pop", 0.28, 15))}
      {S(at(71), "ding", 0.4)}
      {S(at(80), "pop", 0.35, 15)}
      {[at(87), at(88), at(90)].map((b) => S(b, "pop", 0.32, 15))}
      {S(at(95), "whoosh", 0.4, 30)}
      {S(at(110), "pop", 0.3, 15)}
      {S(at(114), "ding", 0.38)}
      {S(at(118), "pop", 0.45, 15)}
      {S(at(119) + 4, "pop", 0.45, 15)}
      {S(at(130), "whoosh", 0.35, 30)}
      {S(at(132), "riser", 0.3, 30)}
      {S(at(140), "ding", 0.45)}
      {S(at(147) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaCodigosSecretos = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 84, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Desperdiçando prompts?</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 110, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>5 códigos secretos</div>
    </div>
    <div style={{ position: "absolute", top: 780, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <Janela title="terminal · claude" w={860} h={250} glow>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: "#fff" }}><span style={{ color: PINK }}>&gt; </span>{rainbow("ultrathink", 4)}</div>
      </Janela>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", width: 900 }}>
        {["/plan", "/goal", "/btw", "Esc Esc"].map((t) => <span key={t} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, color: "#fff", padding: "18px 30px", borderRadius: 24, background: WIN, border: `3px solid ${PINK}` }}>{t}</span>)}
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff", marginTop: 20 }}>no ChatGPT e no Claude</div>
    </div>
  </AbsoluteFill>
);
