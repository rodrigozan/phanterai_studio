import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 23/11/2026 20:00 — "3 ajustes do guia oficial que mudam o resultado do Claude".
// Fatos conferidos na fonte primária (platform.claude.com/docs/en/build-with-claude/prompt-engineering/
// claude-prompting-best-practices, texto capturado em fontes/ em 23/11/2026):
// - "Think of Claude as a brilliant but new employee who lacks context on your norms and workflows.
//    The more precisely you explain what you want, the better the result."
// - Contexto/motivo: "NEVER use ellipses" (menos eficaz) x "Your response will be read aloud by a text-to-speech
//    engine, so never use ellipses..." (mais eficaz). "Claude can generalize from the explanation."
// - Exemplos: "one of the most reliable ways to steer Claude's output format, tone, and structure";
//    relevantes, diversos, em <example>/<examples>; "Include 3–5 examples for best results."
// - Contexto longo (20k+ tokens): documentos no topo, pergunta no fim; "Queries at the end can improve response
//    quality by up to 30 percent in tests, especially with complex, multidocument inputs."
// - "Key test: Show your prompt to a colleague with minimal context ... If they'd be confused, Claude will be too."
// Tudo é interface recriada em motion no Remotion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SCA_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-23-2000-claude-melhor-que-99";
export const SCA_FPS = 30;
const FPS = SCA_FPS;
const f = (p) => staticFile(`${SCA_SLUG}/${p}`);
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
const MUSIC = "phanterai/music/CuriousFocus.mp3";
const TAIL = 1.0;

export const calculateClaudeAjustesMetadata = async () => {
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

// bloco de prompt (pergunta / documento) usado no gancho e no item 3
const BlocoPrompt = ({ kind, h = 150, w = 760, lines = 2, scroll = 0, glow }) => {
  const doc = kind === "doc";
  return (
    <div style={{ width: w, height: h, borderRadius: 24, background: doc ? "rgba(122,92,255,0.18)" : PINKA(0.2), border: `3px solid ${doc ? VIOLET : PINK}`, padding: "18px 26px", boxSizing: "border-box", overflow: "hidden", boxShadow: glow ? `0 0 50px ${doc ? "rgba(180,140,255,0.5)" : PINKA(0.5)}` : "none" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>{doc ? "📄 documento longo" : "❓ sua pergunta"}</div>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {Array.from({ length: lines }, (_, k) => <div key={k} style={{ height: 16, borderRadius: 8, marginTop: 16, width: `${60 + ((k * 37) % 38)}%`, background: doc ? "rgba(180,140,255,0.35)" : PINKA(0.45) }} />)}
      </div>
    </div>
  );
};

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dBaixo = at(6), dTres = at(7), dGuia = at(11), dAnt = at(14), dMudam = at(16), dTerc = at(22), dTrinta = at(26);
  let big, bigD, size = 128, bg = RED, rot = -3;
  if (fr < dTres) { big = "cabeça pra baixo 🙃"; bigD = 0; size = 84; }
  else if (fr < dTerc) { big = "3 ajustes"; bigD = dTres; bg = PINK; rot = -2; size = 140; }
  else { big = "até +30% 🤯"; bigD = dTerc; size = 128; rot = 2; }
  const flash = [dBaixo, dTres, dAnt, dTerc, dTrinta].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  // janela de prompt de cabeça pra baixo, girando desde o quadro 0
  const rotW = 180 + Math.sin(fr / 4) * 6 + shake(fr, dBaixo, 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={250} rot={rot} bg={bg}>{big}</Big>
      {fr < dTres ? (
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(fr, [0, 8], [1.2, 1], clamp)}) translateX(${shake(fr, dBaixo, 26)}px)` }}>
          <div style={{ transform: `rotate(${rotW}deg)` }}>
            <Janela title="prompt" w={860} h={560} glow>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <BlocoPrompt kind="q" w={800} h={150} />
                <BlocoPrompt kind="doc" w={800} h={260} lines={6} scroll={(fr * 3) % 40} />
              </div>
            </Janela>
          </div>
          <div style={{ marginTop: 40, transform: `scale(${fr >= dBaixo ? pop(fr, dBaixo, 8) : 0})` }}><Pill size={50} c="#fff" bg="rgba(255,92,122,0.85)" style={{ border: `2px solid ${RED}` }}>⚠ ordem errada</Pill></div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
            {[1, 2, 3].map((n, k) => {
              const d = dTres + k * 5;
              const third = n === 3;
              const lit = !third && fr >= dMudam + k * 4;
              const hot = third && fr >= dTerc;
              const sh = hot ? shake(fr, dTerc, 18) + Math.sin(fr * 1.7) * 4 : 0;
              const pct = count(fr, dTrinta - 4, at(28) + 6, 0, 30);
              return (
                <In key={n} fr={fr} d={d} dy={120}>
                  <div style={{ width: 290, height: 420, borderRadius: 34, background: hot ? "rgba(255,92,122,0.16)" : WIN, border: `4px solid ${hot ? RED : lit ? PINK : "rgba(190,160,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, transform: `translateX(${sh}px) scale(${hot ? 1.1 : 1})`, boxShadow: lit || hot ? `0 0 50px ${hot ? "rgba(255,92,122,0.5)" : PINKA(0.45)}` : "none" }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1 }}>{n}</div>
                    {hot && fr >= dTrinta - 4
                      ? <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 66, color: "#fff" }}>+{pct}%</div>
                      : <div style={{ fontSize: 80 }}>{third ? "❓" : lit ? "✅" : "⏳"}</div>}
                  </div>
                </In>
              );
            })}
          </div>
          <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            {fr >= dGuia && (
              <In fr={fr} d={dGuia}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 34px", borderRadius: 26, background: WIN, border: `3px solid ${fr >= dAnt ? PINK : LINE}`, transform: `scale(${fr >= dAnt ? 1 + 0.1 * Math.max(0, 1 - (fr - dAnt) / 6) : 1})` }}>
                  <span style={{ fontSize: 52 }}>📘</span>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>guia oficial{fr >= dAnt ? <span style={{ color: PINK }}> · Anthropic</span> : ""}</span>
                  {fr >= dAnt && <span style={{ fontSize: 46, color: GREEN, fontFamily: inter, fontWeight: 800, transform: `scale(${pop(fr, dAnt + 3, 9)})` }}>✓</span>}
                </div>
              </In>
            )}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: funcionário novo ----------
const CTX = [["📁", "seu projeto", 42], ["🎯", "seu objetivo", 43], ["👥", "seu público", 45]];
const Novo = ({ fr }) => {
  const d0 = at(31), dFunc = at(36), dGenial = at(37), dRecem = at(39), dNao = at(40), dCtx = at(45), dPrec = at(46), dMelhor = at(51), dRes = at(53);
  const prec = interpolate(fr, [dPrec, dMelhor + 6], [0.12, 1], { ...clamp, easing: ease });
  const res = interpolate(fr, [dPrec + 6, dRes + 10], [0.1, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={d0}>
          <div style={{ width: 820, borderRadius: 34, background: WIN, border: `3px solid ${fr >= dGenial ? PINK : LINE}`, padding: "28px 36px", display: "flex", alignItems: "center", gap: 30, boxSizing: "border-box", position: "relative", boxShadow: `0 0 50px ${PINKA(0.25)}` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: PINKA(0.3), border: `4px solid ${PINK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 86 }}>🤖</div>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY, letterSpacing: 3 }}>CRACHÁ</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff" }}>Claude</div>
              <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 38, color: BODY }}>{fr >= dFunc ? "funcionário" : "…"}</div>
              {fr >= dGenial && <div style={{ fontSize: 40, marginTop: 6, color: AMBER }}>{"★★★★★".slice(0, Math.min(5, 1 + Math.floor((fr - dGenial) / 3)))} <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: AMBER }}>genial</span></div>}
            </div>
            {fr >= dRecem && <div style={{ position: "absolute", right: 30, top: 34 }}><Stamp fr={fr} d={dRecem} size={50} rot={8} c={AMBER}>1º DIA</Stamp></div>}
          </div>
        </In>
        {fr >= dNao && fr < dPrec && (
          <In fr={fr} d={dNao}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 820 }}>
              {CTX.map(([ic, t, wi], k) => {
                const d = Math.min(at(wi), dNao + k * 5);
                if (fr < d) return null;
                const miss = fr >= dCtx;
                return (
                  <In key={t} fr={fr} d={d} dx={-120} dy={0}>
                    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 30px", borderRadius: 24, background: miss ? "rgba(255,92,122,0.12)" : "rgba(255,255,255,0.05)", border: `3px solid ${miss ? RED : LINE}`, transform: `translateX(${miss ? shake(fr, dCtx + k * 2, 10) : 0}px)` }}>
                      <span style={{ fontSize: 56 }}>{ic}</span>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{t}</span>
                      <span style={{ marginLeft: "auto", fontFamily: inter, fontWeight: 800, fontSize: 56, color: miss ? RED : GREY }}>{miss ? "?" : "…"}</span>
                    </div>
                  </In>
                );
              })}
            </div>
          </In>
        )}
        {fr >= dPrec && (
          <In fr={fr} d={dPrec}>
            <div style={{ display: "flex", flexDirection: "column", gap: 34, alignItems: "center", padding: "40px 30px", borderRadius: 30, background: WIN, border: `2px solid ${LINE}` }}>
              <Bar label="precisão" v={prec} c={`linear-gradient(90deg,#a02c90,${PINK})`} right={`${Math.round(prec * 100)}%`} glow />
              <Bar label="resultado" v={res} c={`linear-gradient(90deg,#1f9e74,${GREEN})`} right={fr >= dRes ? "✓" : ""} glow={fr >= dRes} />
            </div>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: diga o porquê ----------
const Item1 = ({ fr }) => {
  const d0 = at(54), dVez = at(59), dNunca = at(62), dEsc = at(65), dTexto = at(66), dVoz = at(73), dSem = at(76), dMotivo = at(78), dGen = at(83);
  const before = fr < dMotivo;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="💡" t="Diga o porquê" sub="o motivo por trás da regra" />
      <div style={{ position: "absolute", top: 500, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {before ? (
          <In fr={fr} d={d0 + 8}>
            <Janela title="prompt" w={920} h={760}>
              <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: fr >= dEsc ? 0.45 : 1 }}>
                  <div style={{ flex: 1, padding: "24px 28px", borderRadius: 24, background: "rgba(255,92,122,0.12)", border: `3px solid ${fr >= dNunca + 8 ? RED : LINE}`, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff", textDecoration: fr >= dEsc ? "line-through" : "none" }}>
                    {typed("NUNCA use reticências", fr, dNunca - 2, dNunca + 10)}{fr < dEsc && blink(fr)}
                  </div>
                  <div style={{ fontSize: 64, color: RED, fontFamily: inter, fontWeight: 800, transform: `scale(${fr >= dNunca + 12 ? pop(fr, dNunca + 12, 8) : 0})` }}>✗</div>
                </div>
                {fr >= dEsc && (
                  <In fr={fr} d={dEsc}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ flex: 1, padding: "24px 28px", borderRadius: 24, background: "rgba(52,211,153,0.10)", border: `3px solid ${fr >= dSem + 6 ? GREEN : LINE}`, fontFamily: MONO, fontWeight: 800, fontSize: 38, color: "#fff", lineHeight: 1.35 }}>
                        {typed("O texto vai ser lido por uma voz,", fr, dTexto, dVoz + 4)}
                        {fr >= dVoz + 4 && <><br /><span style={{ color: GREEN }}>{typed("por isso,", fr, dVoz + 4, at(75) + 4)}</span> {typed("sem reticências.", fr, at(75) + 4, dSem + 12)}</>}
                        {fr < dSem + 12 && blink(fr)}
                      </div>
                      <div style={{ fontSize: 64, color: GREEN, fontFamily: inter, fontWeight: 800, transform: `scale(${fr >= dSem + 12 ? pop(fr, dSem + 12, 8) : 0})` }}>✓</div>
                    </div>
                  </In>
                )}
                {fr >= dVoz && (
                  <In fr={fr} d={dVoz}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
                      {[0, 1, 2, 3, 4, 5, 6].map((k) => <div key={k} style={{ width: 22, height: 30 + 70 * Math.abs(Math.sin(fr / 4 + k * 0.9)), borderRadius: 11, background: PINK }} />)}
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: BODY, marginLeft: 16 }}>🔊 leitura em voz alta</span>
                    </div>
                  </In>
                )}
              </div>
            </Janela>
          </In>
        ) : (
          <>
            <In fr={fr} d={dMotivo}>
              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <Pill size={46} c="#fff" bg={PINKA(0.8)} style={{ border: `2px solid ${PINK}` }}>regra + motivo</Pill>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff" }}>→</span>
                <div style={{ width: 130, height: 130, borderRadius: 65, background: PINKA(0.3), border: `4px solid ${PINK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, transform: `scale(${1 + 0.06 * Math.sin(fr / 4)})` }}>🤖</div>
              </div>
            </In>
            <In fr={fr} d={at(82)}>
              <div style={{ width: 860, borderRadius: 30, background: WIN, border: `3px solid ${fr >= dGen ? PINK : LINE}`, padding: "30px 34px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: GREY, letterSpacing: 3 }}>O CLAUDE ENTENDE</div>
                <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 52, color: "#fff", lineHeight: 1.25 }}>“vai ser ouvido, não lido”</div>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  {fr >= dGen ? <span style={{ fontSize: 46, color: GREEN, fontFamily: inter, fontWeight: 800 }}>✓</span> : <Spin fr={fr} />}
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff" }}>aplica o motivo no resto</span>
                </div>
              </div>
            </In>
            <div style={{ height: 150, display: "flex", alignItems: "center" }}><Stamp fr={fr} d={dGen + 4} size={84} rot={-5}>generaliza sozinho</Stamp></div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: exemplos ----------
const EXS = [["📧", "e-mail curto", "#7ab8ff"], ["🧾", "resumo em tópicos", AMBER], ["💬", "resposta a cliente", GREEN], ["📝", "legenda de post", PINK], ["📊", "relatório", VIOLET]];
const Item2 = ({ fr }) => {
  const d0 = at(85), dMostre = at(87), dTres = at(90), dCinco = at(92), dVar = at(93), dTag = at(96), dEx = at(100), dConf = at(105), dFmt = at(110), dTom = at(113);
  const n = fr < dMostre + 6 ? 0 : fr < dTres ? 1 : fr < dCinco ? 3 : 5;
  const asTags = fr >= dTag;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🧩" t="Mostre exemplos" sub="de 3 a 5, variados" />
      <div style={{ position: "absolute", top: 500, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {fr < dConf ? (
          <In fr={fr} d={dMostre}>
            <Janela title={asTags ? "prompt · <examples>" : "exemplos"} w={920} h={800} glow={asTags}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {asTags && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: PINK }}>{typed("<examples>", fr, dTag, dTag + 8)}</div>}
                {EXS.map(([ic, t, c], k) => {
                  const show = k < n || (n === 0 && false);
                  const d = k === 0 ? Math.min(dTres, dMostre + 6) : (k < 3 ? dTres : dCinco) + (k % 3) * 3;
                  if (!show) return null;
                  const vary = fr >= dVar + k * 2;
                  return (
                    <In key={t} fr={fr} d={d} dx={140} dy={0}>
                      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 22px", marginLeft: asTags ? 30 : 0, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `3px solid ${vary ? c : LINE}` }}>
                        {asTags && <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: PINK }}>{"<example>"}</span>}
                        <span style={{ fontSize: 44 }}>{vary ? ic : "📄"}</span>
                        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>{vary ? t : `exemplo ${k + 1}`}</span>
                        {asTags && <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 28, color: PINK }}>{"</example>"}</span>}
                      </div>
                    </In>
                  );
                })}
                {asTags && fr >= dEx && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: PINK }}>{typed("</examples>", fr, dEx, dEx + 8)}</div>}
                {!asTags && n > 0 && <div style={{ alignSelf: "center", marginTop: 10, fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff" }}>{n} <span style={{ color: GREY, fontSize: 40 }}>/ 5</span></div>}
              </div>
            </Janela>
          </In>
        ) : (
          <>
            <In fr={fr} d={dConf}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREY, letterSpacing: 4 }}>RESULTADO</div>
            </In>
            <In fr={fr} d={dConf + 3}>
              <div style={{ display: "flex", flexDirection: "column", gap: 34, padding: "40px 30px", borderRadius: 30, background: WIN, border: `2px solid ${LINE}` }}>
                {[["formato", dFmt], ["tom", dTom], ["estrutura", dTom + 8]].map(([t, d]) => {
                  const v = interpolate(fr, [dConf + 3, d], [0.1, 1], { ...clamp, easing: ease });
                  return <Bar key={t} label={t} v={v} c={`linear-gradient(90deg,#1f9e74,${GREEN})`} right={fr >= d ? "✓" : `${Math.round(v * 100)}%`} glow={fr >= d} />;
                })}
              </div>
            </In>
            <div style={{ height: 150, display: "flex", alignItems: "center" }}><Stamp fr={fr} d={at(106)} size={84} rot={-5}>dos mais confiáveis</Stamp></div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: documento em cima ----------
const Item3 = ({ fr }) => {
  const d0 = at(114), dDoc = at(116), dCima = at(118), dPerg = at(119), dLongos = at(122), dFinal = at(127), dMelh = at(129), dTrinta = at(134), dTestes = at(138);
  const sw = ease(lin(fr, dCima, dPerg + 10)); // 0: pergunta em cima; 1: documento em cima
  const grow = interpolate(fr, [dLongos, dLongos + 14], [230, 360], { ...clamp, easing: ease });
  const docTop = 30 + (1 - sw) * 190, qTop = 30 + sw * (grow + 30);
  const pct = count(fr, at(133) - 2, at(136) + 4, 0, 30);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📄" t="Documento em cima" sub="e a pergunta no final" />
      <div style={{ position: "absolute", top: 500, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {fr < dMelh ? (
          <In fr={fr} d={dDoc - 2}>
            <Janela title="prompt" w={900} h={720} glow={sw > 0.95}>
              <div style={{ position: "relative", height: 620 }}>
                <div style={{ position: "absolute", left: 22, top: docTop }}><BlocoPrompt kind="doc" w={800} h={fr >= dLongos ? grow : 160} lines={14} scroll={fr >= dLongos ? (fr * 2) % 60 : 0} glow={sw > 0.95} /></div>
                <div style={{ position: "absolute", left: 22, top: qTop, transform: `rotate(${Math.sin(sw * Math.PI) * 6}deg)` }}><BlocoPrompt kind="q" w={800} h={150} glow={fr >= dFinal} /></div>
                {sw > 0.95 && <div style={{ position: "absolute", right: 34, top: 10, fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREEN, transform: `scale(${pop(fr, dPerg + 10, 8)})` }}>✓ ordem certa</div>}
              </div>
            </Janela>
          </In>
        ) : (
          <>
            <In fr={fr} d={dMelh}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREY, letterSpacing: 4 }}>QUALIDADE DA RESPOSTA</div>
            </In>
            <In fr={fr} d={dMelh + 2}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 110, height: 560 }}>
                {[["pergunta antes", 0, VIOLET], ["pergunta no fim", pct, PINK]].map(([n, v, c]) => (
                  <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: "#fff" }}>{v ? `+${v}%` : "base"}</div>
                    <div style={{ width: 240, height: 330 * (1 + v / 100), borderRadius: 26, background: c, boxShadow: `0 0 50px ${c}` }} />
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>{n}</div>
                  </div>
                ))}
              </div>
            </In>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
              <Stamp fr={fr} d={dTrinta} size={84} rot={-5}>até 30% melhor</Stamp>
              {fr >= dTestes && <In fr={fr} d={dTestes}><Pill size={38} c={BODY} bg="rgba(122,92,255,0.25)" style={{ border: `2px solid ${VIOLET}` }}>🧪 testes da Anthropic · textos longos</Pill></In>}
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: bônus, teste do colega ----------
const Bonus = ({ fr }) => {
  const d0 = at(141), dBonus = at(143), dTeste = at(145), dColega = at(147), dMostra = at(148), dSem = at(154), dPerd = at(158), dClaude = at(162), dFica = at(164);
  const fly = ease(lin(fr, dMostra, dMostra + 16));
  const lost = fr >= dPerd;
  const Card = ({ ic, t, sub, on, d }) => (
    <In fr={fr} d={d}>
      <div style={{ width: 400, height: 380, borderRadius: 34, background: on ? "rgba(255,92,122,0.14)" : WIN, border: `4px solid ${on ? RED : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateX(${on ? shake(fr, d, 12) : 0}px)` }}>
        <div style={{ fontSize: 110, transform: `rotate(${on ? Math.sin(fr / 3) * 10 : 0}deg)` }}>{on ? "😵‍💫" : ic}</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>{t}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 34, color: on ? RED : BODY }}>{on ? "???" : sub}</div>
      </div>
    </In>
  );
  return (
    <AbsoluteFill>
      <Big fr={fr} d={dBonus} size={120} top={280} rot={-2}>{fr < dTeste ? "bônus 🎁" : "teste do colega"}</Big>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ height: 160, position: "relative", width: 900 }}>
          {fr >= dMostra - 6 && (
            <div style={{ position: "absolute", left: 60 + fly * (fr >= dClaude ? 380 : 100), top: 10 + Math.sin(fly * Math.PI) * -40, transform: `rotate(${(1 - fly) * -8}deg) scale(${0.9 + 0.1 * fly})` }}>
              <div style={{ padding: "22px 30px", borderRadius: 24, background: PINKA(0.25), border: `3px solid ${PINK}`, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap" }}>📝 seu prompt →</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          <Card ic="🧑" t="colega" sub={fr >= dSem ? "sem contexto" : "lê o prompt"} on={lost} d={dColega} />
          {fr >= dClaude - 2 && <Card ic="🤖" t="Claude" sub="lê o prompt" on={fr >= dFica - 2} d={dClaude - 2} />}
        </div>
        {lost && <In fr={fr} d={dPerd}><Pill size={44} c="#fff" bg="rgba(255,92,122,0.85)" style={{ border: `2px solid ${RED}` }}>{fr >= dClaude ? "perdeu ele, perde o Claude" : "ficou perdido"}</Pill></In>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: CTA ----------
const AJ = [["💡", "diga o porquê", 167], ["🧩", "mostre exemplos", 168], ["📄", "pergunta no fim", 169]];
const CTA = ({ fr }) => {
  const d0 = at(165), dNao = at(170), dCom = at(172), dK = at(173), dSeg = at(176);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 100, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>qual falta?</div></In>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 780 }}>
          {AJ.map(([ic, t], k) => {
            const d = d0 + 3 + k * 4;
            const pend = k === 2 && fr >= dNao;
            const ok = fr >= d + 8 && !pend;
            return (
              <In key={t} fr={fr} d={d} dx={-120} dy={0}>
                <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 28px", borderRadius: 24, background: pend ? "rgba(255,92,122,0.14)" : WIN, border: `3px solid ${pend ? RED : ok ? GREEN : LINE}`, transform: `translateX(${pend ? Math.sin(fr / 2) * 5 : 0}px)` }}>
                  <span style={{ width: 52, height: 52, borderRadius: 12, border: `4px solid ${pend ? RED : ok ? GREEN : GREY}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 36, color: ok ? GREEN : RED }}>{ok ? "✓" : pend && fr % 20 < 12 ? "?" : ""}</span>
                  <span style={{ fontSize: 46 }}>{ic}</span>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>{t}</span>
                </div>
              </In>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 16, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 7; if (fr < t0) return null; const q = ((fr - t0) % 42) / 40; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : LINE}`, opacity: lin(fr, dCom - 6, dCom), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("CLAUDE", fr, dK - 2, dK + 8)}{blink(fr)}</span>
            {fr >= dK + 12 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 12, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dCom, dCom + 6) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
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
const KEY = new Set(["prompt", "cabeca", "baixo", "3", "ajustes", "guia", "oficial", "anthropic", "claude", "terceiro", "30", "genial", "recemchegado", "contexto", "preciso", "melhor", "1", "porque", "nunca", "voz", "motivo", "generaliza", "2", "exemplos", "5", "variados", "tag", "exemplo", "confiaveis", "formato", "tom", "documento", "cima", "pergunta", "embaixo", "final", "testes", "bonus", "colega", "perdida", "comenta", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "trinta" && nn(k + 1) === "por" && nn(k + 2) === "cento") { push("30%", k + 2); continue; }
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "claude" && words[k].w.startsWith("CLAUDE")) { push("CLAUDE", k); continue; }
    if (NUMS[n] && n !== "um") { push(NUMS[n], k); continue; }
    toks.push({ t: x.w.replace(/^"/, "").replace(/"([.,!?:;]?)$/, "$1"), s: x.s, e: x.e });
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
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortClaudeAjustes = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(31), at(54), at(85), at(114), at(141), at(165), end];
  const scenes = [Hook, Novo, Item1, Item2, Item3, Bonus, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(7)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(129)} b={at(140)} pose="apontando" top={1260} left />
      <Reacao fr={fr} a={at(173)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(6), "error", 0.45, 15)}
      {S(at(7), "whoosh", 0.8, 30)}
      {[at(7) + 5, at(7) + 10].map((b) => S(b, "pop", 0.4, 15))}
      {S(at(14), "ding", 0.4, 15)}
      {S(at(22), "error", 0.35, 15)}
      {S(at(26), "coin", 0.4, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {[at(37), at(39), at(45)].map((b) => S(b, "pop", 0.3, 15))}
      {[at(64), at(77)].map((b) => S(b + 12, "pop", 0.35, 15))}
      {[at(87), at(89), at(91)].map((b) => S(b, "pop", 0.28, 15))}
      {[at(88), at(120), at(134), at(164)].map((b) => S(b, "ding", 0.4))}
      {S(at(83) + 4, "ding", 0.4)}
      {S(at(119), "whoosh", 0.45)}
      {S(at(158), "error", 0.3, 15)}
      {S(at(173) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaClaudeAjustes = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Seu prompt tá</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff", background: RED, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 24 }}>de cabeça</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2, marginTop: 24 }}>pra baixo 🙃</div>
    </div>
    <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ transform: "rotate(180deg)" }}>
        <Janela title="prompt" w={760} h={400} glow>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <BlocoPrompt kind="q" w={700} h={120} lines={1} />
            <BlocoPrompt kind="doc" w={700} h={170} lines={3} />
          </div>
        </Janela>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 68, color: PINK, border: `8px solid ${PINK}`, borderRadius: 24, padding: "4px 30px", transform: "rotate(-4deg)", background: "rgba(10,6,24,0.85)" }}>3 ajustes · até +30%</div>
    </div>
  </AbsoluteFill>
);
