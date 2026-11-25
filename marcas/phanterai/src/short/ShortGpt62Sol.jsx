import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 23/11/2026 15:00 — "GPT-6.2 Sol: a meio ponto do Astra por 1/5 do custo".
// Fatos conferidos na fonte primária (openai.com/index/introducing-gpt-6-2-astra-sol, texto capturado em fontes/ em 23/11/2026):
// - "In Cognition's FrontierCode 2.0, GPT-6.2 Sol comes within 0.5 points of GPT-6.2 Astra at about one-fifth the cost (both at max)."
// - API: Astra US$ 8 entrada / 0,40 cache / 40 saída por milhão de tokens; Sol mantém os preços do 6.1 Sol: US$ 2 / 0,10 / 10.
// - "On ... LifeVal ... GPT-6.2 Sol outscores GPT-6 Astra at about one-seventh the cost." (exemplo da página: escolher creche após mudança)
// - "Many employees at OpenAI use it as their default model"; Astra = "our new frontier model for your hardest projects".
// - Disponível para Plus, Pro, Enterprise e Edu no ChatGPT Work e no Codex; API gpt-6.2-sol.
// As barras de pontuação não mostram valores absolutos (a página não traz em texto); só a diferença de 0,5 ponto.
// Tudo é interface recriada em motion no Remotion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
// - code.claude.com/docs/en/changelog: limite de mensagens entre sessões subiu de 20 para 100.000 (não narrado).
// Tudo é interface recriada em motion no Remotion (genérica, estilo PhanterAI): nenhum print, nada gerado por IA,
// nenhum logo oficial. Nomes de sessão na tela (login, API, pagamentos...) são exemplos, como os da documentação.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const G62_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-23-1500-gpt-6-2-sol";
export const G62_FPS = 30;
const FPS = G62_FPS;
const f = (p) => staticFile(`${G62_SLUG}/${p}`);
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
const MUSIC = "phanterai/music/Coding_at_Night.mp3";
const TAIL = 0.9;

export const calculateGpt62SolMetadata = async () => {
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
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${glow ? PINK : "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(glow ? 0.45 : 0.18)}`, overflow: "hidden", position: "relative", boxSizing: "border-box", ...style }}>
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
  <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 5 }}>
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


// ---------- peças ----------
const Bar = ({ label, v, c, w = 760, h = 74, right, glow }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ width: 170, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", textAlign: "right" }}>{label}</div>
    <div style={{ width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(190,160,255,0.25)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, v)) * 100}%`, borderRadius: h / 2, background: c, boxShadow: glow ? `0 0 40px ${c}` : "none" }} />
      {right && <div style={{ position: "absolute", right: 22, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 800, fontSize: 36, color: "#fff" }}>{right}</div>}
    </div>
  </div>
);
const Stamp = ({ fr, d, children, c = PINK, rot = -8, size = 90, style = {} }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 8);
  return <div style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, border: `8px solid ${c}`, borderRadius: 24, padding: "4px 30px", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.6), background: "rgba(10,6,24,0.85)", whiteSpace: "nowrap", ...style }}>{children}</div>;
};
const Tag = ({ txt, c, fr, k = 0, size = 64 }) => (
  <div style={{ transformOrigin: "50% -40px", transform: `rotate(${Math.sin(fr / 7 + k) * 8}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: 4, height: 40, background: GREY }} />
    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, color: "#fff", background: c, padding: "14px 30px", borderRadius: 18, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>{txt}</div>
  </div>
);
const count = (fr, a, b, v0, v1) => Math.round(interpolate(fr, [a, b], [v0, v1], { ...clamp, easing: ease }));

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dCinco = at(5), dCaro = at(8), dTres = at(10), dBarato = at(16), dTopo = at(22), dTerc = at(25), dAbs = at(29);
  let big, bigD, size = 150, bg = PINK, rot = -3;
  if (fr < dCinco) { big = "MEIO PONTO"; bigD = 0; size = 124; }
  else if (fr < dTres) { big = "5x mais caro 💸"; bigD = dCinco; size = 120; bg = RED; rot = 2; }
  else if (fr < dTerc) { big = "3 provas"; bigD = dTres; rot = -2; }
  else { big = "a 3ª é absurda 🤯"; bigD = dTerc; size = 104; bg = RED; rot = 2; }
  const flash = [dCinco, dCaro, dTres, dTopo, dTerc].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  // placar: as duas barras correm desde o quadro 0 e param quase juntas
  const vA = interpolate(fr, [0, 40], [0.55, 0.93], { ...clamp, easing: ease });
  const vS = interpolate(fr, [0, 40], [0.5, 0.925], { ...clamp, easing: ease });
  const custoS = count(fr, dCinco, dCaro, 100, 20);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={220} rot={rot} bg={bg}>{big}</Big>
      {fr < dTres ? (
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 44, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dCaro, 22)}px)` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: GREY, letterSpacing: 4 }}>PONTUAÇÃO</div>
          <Bar label="Topo" v={vA} c="linear-gradient(90deg,#7a5cff,#b48cff)" />
          <Bar label="Barato" v={vS} c={`linear-gradient(90deg,#a02c90,${PINK})`} glow />
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: "#fff", marginTop: 6, transform: `scale(${fr < at(3) ? 0.9 : 1 + 0.35 * Math.max(0, 1 - (fr - at(3)) / 8)})` }}>diferença: <span style={{ color: PINK, background: fr >= at(3) ? PINKA(0.25) : "transparent", borderRadius: 12, padding: "0 10px" }}>−0,5</span></div>
          {fr >= dCinco && (
            <In fr={fr} d={dCinco}>
              <div style={{ display: "flex", gap: 120, marginTop: 10 }}>
                <Tag fr={fr} k={0} txt="$$$$$" c="rgba(122,92,255,0.95)" />
                <Tag fr={fr} k={2} txt={custoS === 20 ? "$" : "$".repeat(Math.max(1, Math.round(custoS / 20)))} c={PINK} />
              </div>
            </In>
          )}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
          {[1, 2, 3].map((n, k) => {
            const d = dTres + k * 5;
            const locked = n === 3;
            const sh = locked ? shake(fr, dTerc, 18) + (fr >= dTerc ? Math.sin(fr * 1.7) * 5 : 0) : 0;
            const lit = fr >= (n === 1 ? dBarato : n === 2 ? dTopo - 6 : dAbs);
            return (
              <In key={n} fr={fr} d={d} dy={120}>
                <div style={{ width: 290, height: 420, borderRadius: 34, background: WIN, border: `4px solid ${locked && fr >= dTerc ? RED : lit ? PINK : "rgba(190,160,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, transform: `translateX(${sh}px) scale(${locked && fr >= dTerc ? 1.08 : 1})`, boxShadow: lit ? `0 0 50px ${PINKA(0.45)}` : "none" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 80 }}>{locked ? (fr >= dTerc ? "🔒" : "❓") : lit ? "✅" : "⏳"}</div>
                </div>
              </In>
            );
          })}
        </div>
      )}
      {fr >= dBarato && fr < dTerc && (
        <div style={{ position: "absolute", top: 1080, left: 0, right: 0, textAlign: "center" }}>
          <In fr={fr} d={dBarato}><Pill size={50} c="#fff" bg={PINKA(0.85)} style={{ border: `2px solid ${PINK}` }}>{fr >= dTopo ? "modelo barato ≈ topo 🏆" : "modelo barato da OpenAI"}</Pill></In>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: nome ----------
const Nome = ({ fr }) => {
  const d0 = at(30), dGpt = at(34), dSol = at(38), dIrmao = at(40), dAstra = at(43), dPonta = at(47), dGente = at(51), dDentro = at(54), dPadrao = at(60);
  const on = fr >= dPadrao;
  const nLit = Math.max(0, Math.min(15, Math.floor((fr - dGente) / 2)));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {fr < dGente ? (
          <>
            <In fr={fr} d={d0}>
              <Janela title="modelo" w={900} h={260} glow={fr >= dSol}>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 84, color: "#fff" }}>{typed("gpt-6.2-sol", fr, dGpt, dSol)}{blink(fr)}</div>
                {fr >= dSol && <div style={{ position: "absolute", right: 30, top: 30, fontSize: 90, transform: `rotate(${fr * 3}deg) scale(${pop(fr, dSol, 9)})` }}>☀️</div>}
              </Janela>
            </In>
            {fr >= dIrmao && (
              <In fr={fr} d={dIrmao}>
                <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                  <div style={{ width: 400, padding: "30px 0", borderRadius: 30, background: PINKA(0.25), border: `3px solid ${PINK}`, textAlign: "center" }}>
                    <div style={{ fontSize: 70 }}>🪶</div>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>Sol</div>
                    <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 34, color: BODY }}>leve</div>
                  </div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: GREY }}>+</div>
                  {fr >= dAstra && (
                    <In fr={fr} d={dAstra} dx={200} dy={0}>
                      <div style={{ width: 400, padding: "30px 0", borderRadius: 30, background: "rgba(122,92,255,0.22)", border: `3px solid #b48cff`, textAlign: "center", position: "relative" }}>
                        <div style={{ fontSize: 70 }}>🚀</div>
                        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>Astra</div>
                        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 34, color: BODY }}>{fr >= dPonta ? "de ponta" : "irmão"}</div>
                        {fr >= dPonta && <div style={{ position: "absolute", top: -70, left: 0, right: 0, fontSize: 90, transform: `scale(${pop(fr, dPonta, 8)}) rotate(${Math.sin(fr / 5) * 8}deg)` }}>👑</div>}
                      </div>
                    </In>
                  )}
                </div>
              </In>
            )}
          </>
        ) : (
          <>
            <In fr={fr} d={dGente}><Pill size={48} c="#fff" bg="rgba(122,92,255,0.6)" style={{ border: "2px solid #b48cff" }}>🏢 lá dentro da OpenAI</Pill></In>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 22, marginTop: 10 }}>
              {Array.from({ length: 15 }, (_, k) => {
                const l = k < nLit;
                return <div key={k} style={{ height: 150, borderRadius: 75, background: l ? PINKA(0.35) : "rgba(255,255,255,0.05)", border: `4px solid ${l ? PINK : "rgba(190,160,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 66, transform: `scale(${0.85 + 0.15 * pop(fr, dGente + k, 12)})` }}>{l ? "🧑‍💻" : "👤"}</div>;
              })}
            </div>
            {fr >= dDentro && (
              <In fr={fr} d={dDentro}>
                <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "26px 40px", borderRadius: 30, background: WIN, border: `3px solid ${on ? PINK : "rgba(190,160,255,0.3)"}`, marginTop: 20 }}>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>modelo padrão: <span style={{ color: on ? PINK : GREY }}>{on ? "Sol" : "…"}</span></span>
                  <div style={{ width: 150, height: 80, borderRadius: 40, background: on ? PINK : "rgba(255,255,255,0.15)", position: "relative" }}>
                    <div style={{ position: "absolute", top: 8, left: 8 + 70 * ease(lin(fr, dPadrao, dPadrao + 6)), width: 64, height: 64, borderRadius: 32, background: "#fff" }} />
                  </div>
                </div>
              </In>
            )}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: código ----------
const DIFF = ["+ def checkout(cart):", "+   total = soma(cart)", "-   return None", "+   return total", "✓ testes passando"];
const Item1 = ({ fr }) => {
  const d0 = at(61), dCod = at(63), dFC = at(67), dSol = at(70), dMeio = at(73), dAstra = at(76), dCusto = at(77), dQuinto = at(79);
  const vA = interpolate(fr, [dFC, dMeio], [0.1, 0.9], { ...clamp, easing: ease });
  const vS = interpolate(fr, [dFC, dMeio], [0.08, 0.885], { ...clamp, easing: ease });
  const cS = interpolate(fr, [dCusto, dQuinto + 4], [1, 0.2], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="💻" t="Código de verdade" sub="FrontierCode 2.0" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {fr < dCusto ? (
          <>
            <In fr={fr} d={dCod}>
              <Janela title="pull request · repo real" w={900} h={330}>
                {DIFF.map((l, k) => {
                  const t0 = dCod + k * 7;
                  if (fr < t0) return null;
                  const c = l.startsWith("+") ? GREEN : l.startsWith("-") ? RED : PINK;
                  return <div key={k} style={{ fontFamily: MONO, fontSize: 36, color: c, lineHeight: 1.45, whiteSpace: "nowrap" }}>{typed(l, fr, t0, t0 + 6)}</div>;
                })}
              </Janela>
            </In>
            {fr >= dFC && (
              <In fr={fr} d={dFC}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", padding: "30px 20px", borderRadius: 30, background: WIN, border: "2px solid rgba(190,160,255,0.28)" }}>
                  <Bar label="Astra" v={vA} c="linear-gradient(90deg,#7a5cff,#b48cff)" w={640} />
                  <Bar label="Sol" v={vS} c={`linear-gradient(90deg,#a02c90,${PINK})`} w={640} glow={fr >= dSol} />
                  {fr >= dMeio && <Stamp fr={fr} d={dMeio} size={70} rot={-4}>só −0,5 ponto</Stamp>}
                </div>
              </In>
            )}
          </>
        ) : (
          <>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREY, letterSpacing: 4 }}>CUSTO POR TAREFA</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 120, height: 640 }}>
              {[["Astra", 1, "#b48cff"], ["Sol", cS, PINK]].map(([n, v, c]) => (
                <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: "#fff" }}>{n === "Sol" ? (fr >= dQuinto ? "1/5" : `${Math.round(v * 100)}%`) : "100%"}</div>
                  <div style={{ width: 230, height: 520 * v, borderRadius: 26, background: c, boxShadow: `0 0 50px ${c}` }} />
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{n}</div>
                </div>
              ))}
            </div>
            <Stamp fr={fr} d={dQuinto} size={92}>1/5 do custo</Stamp>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: preço ----------
const Item2 = ({ fr }) => {
  const d0 = at(80), dPreco = at(83), dMilhao = at(85), dEnt = at(89), dS2 = at(90), dA8 = at(94), dSai = at(97), dS10 = at(99), dA40 = at(101), dQuatro = at(102);
  const tokens = count(fr, dMilhao, dEnt, 0, 1000000);
  const Cell = ({ v, d, c }) => (
    <div style={{ width: 260, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 76, color: fr >= d ? c : "rgba(255,255,255,0.15)", transform: `scale(${fr >= d ? 0.7 + 0.3 * pop(fr, d, 9) : 1})` }}>{fr >= d ? `$${count(fr, d, d + 10, 0, v)}` : "$—"}</div>
  );
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="💲" t="O preço" sub="por milhão de tokens (API)" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={dPreco}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 36px", borderRadius: 26, background: WIN, border: `2px solid ${PINKA(0.5)}` }}>
            <span style={{ fontSize: 56 }}>🪙</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: "#fff" }}>{tokens.toLocaleString("pt-BR")}</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: GREY }}>tokens</span>
          </div>
        </In>
        <In fr={fr} d={dMilhao + 4}>
          <div style={{ width: 940, borderRadius: 30, background: WIN, border: "2px solid rgba(190,160,255,0.28)", padding: "20px 0" }}>
            <div style={{ display: "flex", padding: "0 30px", fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY }}>
              <div style={{ width: 360 }} /><div style={{ width: 260, textAlign: "center", color: PINK }}>Sol</div><div style={{ width: 260, textAlign: "center", color: "#b48cff" }}>Astra</div>
            </div>
            {[["⬇️ entrada", 2, dS2, 8, dA8, dEnt], ["⬆️ saída", 10, dS10, 40, dA40, dSai]].map(([n, s, ds, a, da, dr]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", padding: "26px 30px", borderTop: "2px solid rgba(190,160,255,0.12)", background: fr >= dr && fr < dr + 40 ? PINKA(0.12) : "transparent" }}>
                <div style={{ width: 360, fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{n}</div>
                <Cell v={s} d={ds} c={PINK} />
                <Cell v={a} d={da} c="#b48cff" />
              </div>
            ))}
          </div>
        </In>
        <div style={{ height: 160, display: "flex", alignItems: "center" }}>
          <Stamp fr={fr} d={dQuatro} size={96} rot={-6}>4x mais barato</Stamp>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: dia a dia ----------
const PASSOS = ["escolas perto da casa nova", "horário e distância", "lista final pronta"];
const Item3 = ({ fr }) => {
  const d0 = at(106), dTar = at(108), dLife = at(114), dPassou = at(117), dG6 = at(119), dTopo = at(123), dCusto = at(127), dSetimo = at(129);
  const swap = ease(lin(fr, dPassou, dPassou + 12));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="🏠" t="Dia a dia" sub="LifeVal" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {fr < dPassou ? (
          <In fr={fr} d={dTar}>
            <Janela title="chat" w={900} h={680}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ maxWidth: 640, background: PINK, borderRadius: "30px 30px 6px 30px", padding: "20px 28px", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{typed("Mudei de cidade. Acha uma creche pro meu filho?", fr, dTar, dTar + 22)}</div>
              </div>
              <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
                {PASSOS.map((p, k) => {
                  const t0 = dTar + 24 + k * 9;
                  if (fr < t0) return null;
                  const done = fr >= t0 + 7;
                  return (
                    <In key={p} fr={fr} d={t0} dx={-80} dy={0}>
                      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px", borderRadius: 22, background: done ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.05)", border: `2px solid ${done ? GREEN : "rgba(190,160,255,0.2)"}` }}>
                        {done ? <span style={{ fontSize: 44, color: GREEN, fontFamily: inter, fontWeight: 800 }}>✓</span> : <Spin fr={fr} />}
                        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{p}</span>
                      </div>
                    </In>
                  );
                })}
              </div>
            </Janela>
          </In>
        ) : (
          <>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREY, letterSpacing: 4 }}>RANKING · LIFEVAL</div>
            <div style={{ position: "relative", width: 900, height: 340 }}>
              {[["GPT-6.2 Sol", PINK, "🪶", 1], ["GPT-6 Astra", "#b48cff", "🚀", 0]].map(([n, c, ic, up]) => {
                const y = up ? 170 - 170 * swap : 170 * swap;
                return (
                  <div key={n} style={{ position: "absolute", top: y, left: 0, width: 900, height: 150, display: "flex", alignItems: "center", gap: 24, padding: "0 30px", borderRadius: 28, background: up ? PINKA(0.22) : WIN, border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: up && swap > 0.9 ? `0 0 50px ${PINKA(0.5)}` : "none" }}>
                    <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: "#fff", width: 70 }}>{(up ? swap > 0.5 : swap <= 0.5) ? "1º" : "2º"}</span>
                    <span style={{ fontSize: 60 }}>{ic}</span>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>{n}</span>
                    {!up && fr >= dTopo && <span style={{ marginLeft: "auto", fontFamily: lora, fontStyle: "italic", fontSize: 34, color: BODY }}>topo da geração passada</span>}
                    {up && swap > 0.9 && <span style={{ marginLeft: "auto", fontSize: 60, transform: `scale(${pop(fr, dPassou + 12, 8)})` }}>🏆</span>}
                  </div>
                );
              })}
            </div>
            {fr >= dCusto && (
              <In fr={fr} d={dCusto}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  {Array.from({ length: 7 }, (_, k) => {
                    const lit = k === 0 || fr < dSetimo;
                    return <div key={k} style={{ fontSize: 76, opacity: lit ? 1 : 0.18, transform: `scale(${k === 0 && fr >= dSetimo ? 1.25 : 1}) translateY(${k > 0 && fr >= dSetimo ? 30 * ease(lin(fr, dSetimo + k, dSetimo + k + 6)) : 0}px)` }}>💵</div>;
                  })}
                </div>
              </In>
            )}
            <Stamp fr={fr} d={dSetimo} size={92} rot={-5}>1/7 do custo</Stamp>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: onde usar ----------
const PLANOS = [["Plus", 145], ["Pro", 146], ["Enterprise", 147], ["Edu", 149]];
const Onde = ({ fr }) => {
  const d0 = at(130), dMelhor = at(132), dChat = at(137), dCodex = at(141), dAssina = at(144), dApi = at(153);
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={120} top={220} rot={-2}>{fr < dApi ? "já liberado ✅" : "e na API ⚡"}</Big>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {fr < dApi ? (
          <>
            <div style={{ display: "flex", gap: 30 }}>
              {[["💬", "ChatGPT Work", dChat], [">_", "Codex", dCodex]].map(([ic, n, d]) => {
                const l = fr >= d;
                return (
                  <In key={n} fr={fr} d={dMelhor + (n === "Codex" ? 4 : 0)}>
                    <div style={{ width: 430, height: 300, borderRadius: 34, background: l ? PINKA(0.22) : WIN, border: `4px solid ${l ? PINK : "rgba(190,160,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, transform: `scale(${l ? 1 + 0.08 * Math.max(0, 1 - (fr - d) / 8) : 0.95})`, boxShadow: l ? `0 0 60px ${PINKA(0.45)}` : "none" }}>
                      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 90, color: "#fff" }}>{ic}</div>
                      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{n}</div>
                      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: l ? GREEN : GREY }}>{l ? "✓ Sol disponível" : "…"}</div>
                    </div>
                  </In>
                );
              })}
            </div>
            {fr >= dAssina - 4 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 420px)", gap: 24, marginTop: 16 }}>
                {PLANOS.map(([p, i]) => {
                  const d = at(i);
                  const l = fr >= d;
                  return (
                    <In key={p} fr={fr} d={Math.min(d, dAssina)}>
                      <div style={{ height: 120, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, background: l ? "rgba(52,211,153,0.14)" : WIN, border: `3px solid ${l ? GREEN : "rgba(190,160,255,0.25)"}`, transform: `scale(${l ? 1 + 0.1 * Math.max(0, 1 - (fr - d) / 6) : 0.95})` }}>
                        <span style={{ fontSize: 46, color: l ? GREEN : GREY, fontFamily: inter, fontWeight: 800 }}>{l ? "✓" : "○"}</span>
                        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>{p}</span>
                      </div>
                    </In>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <In fr={fr} d={dApi}>
            <Janela title="terminal" w={940} h={420} glow>
              <div style={{ fontFamily: MONO, fontSize: 42, color: BODY, lineHeight: 1.6 }}>
                <div><span style={{ color: PINK }}>$</span> {typed('model: "gpt-6.2-sol"', fr, dApi, dApi + 14)}</div>
                {fr >= dApi + 16 && <div style={{ color: GREEN }}>✓ conectado</div>}
                {fr >= dApi + 20 && <div style={{ color: AMBER }}>$2 entrada · $10 saída</div>}
                {blink(fr)}
              </div>
            </Janela>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(156), dTroca = at(157), dSolQ = at(161), dCom = at(162), dK = at(163), dSeg = at(166);
  const on = ease(lin(fr, dSolQ, dSolQ + 8));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>trocaria?</div></In>
        <In fr={fr} d={dTroca}>
          <div style={{ display: "flex", alignItems: "center", gap: 34, padding: "28px 44px", borderRadius: 34, background: WIN, border: `3px solid ${PINKA(0.6)}` }}>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: on < 0.5 ? "#fff" : GREY }}>🚀 Astra</span>
            <div style={{ width: 170, height: 90, borderRadius: 45, background: on > 0.5 ? PINK : "rgba(122,92,255,0.6)", position: "relative" }}>
              <div style={{ position: "absolute", top: 10, left: 10 + 80 * on, width: 70, height: 70, borderRadius: 35, background: "#fff" }} />
            </div>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: on > 0.5 ? "#fff" : GREY, display: "inline-block", transform: `scale(${on > 0.5 ? 1 + 0.08 * Math.sin(fr / 4) : 1})` }}>Sol 🪶</span>
          </div>
        </In>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center", marginTop: 30, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 7; if (fr < t0) return null; const q = ((fr - t0) % 42) / 40; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "☀️"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "24px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dCom - 6, dCom), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{typed("SOL", fr, dK - 2, dK + 6)}{blink(fr)}</span>
            {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "24px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dCom, dCom + 6) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
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

const Spin = ({ fr, c = AMBER, s = 34 }) => (
  <div style={{ width: s, height: s, borderRadius: s, border: `5px solid rgba(255,255,255,0.15)`, borderTopColor: c, transform: `rotate(${fr * 18}deg)`, boxSizing: "border-box" }} />
);

// ---------- legendas ----------
const KEY = new Set(["meio", "ponto", "05", "5", "caro", "3", "provas", "barato", "topo", "terceira", "absurda", "sol", "astra", "gpt62", "gpt6", "leve", "ponta", "padrao", "1", "codigo", "frontiercode", "15", "2", "preco", "entrada", "saida", "8", "10", "40", "4", "dia", "lifeval", "passou", "17", "melhor", "codex", "api", "trocaria", "comenta", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5", oito: "8", dez: "10", quarenta: "40" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "a" && nn(k + 1) === "p" && nn(k + 2) === "i") { push("API", k + 2); continue; }
    if (n === "gpt" && nn(k + 1) === "seis" && nn(k + 2) === "ponto" && nn(k + 3) === "dois") { push("GPT-6.2", k + 3); continue; }
    if (n === "gpt" && nn(k + 1) === "seis") { push("GPT-6", k + 1); continue; }
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "um" && nn(k + 1) === "quinto") { push("1/5", k + 1); continue; }
    if (n === "um" && nn(k + 1) === "setimo") { push("1/7", k + 1); continue; }
    if (n === "um" && nn(k + 1) === "milhao") { push("1 milhão", k + 1); continue; }
    if (NUMS[n] && n !== "um") { push(NUMS[n], k); continue; }
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
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};


export const ShortGpt62Sol = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(30), at(61), at(80), at(106), at(130), at(156), end];
  const scenes = [Hook, Nome, Item1, Item2, Item3, Onde, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(117)} b={at(127)} pose="apontando" top={1260} left />
      <Reacao fr={fr} a={at(163)} b={end} pose="comemorando" top={1180} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(5), "coin", 0.4, 15)}
      {S(at(8), "error", 0.45, 15)}
      {S(at(10), "whoosh", 0.8, 30)}
      {[at(10) + 5, at(10) + 10].map((b) => S(b, "pop", 0.4, 15))}
      {S(at(22), "ding", 0.4, 15)}
      {S(at(25), "error", 0.35, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {[at(38), at(43), at(47), at(60)].map((b) => S(b, "pop", 0.3, 15))}
      {[at(73), at(79), at(102), at(129)].map((b) => S(b, "ding", 0.4))}
      {[at(90), at(94), at(99), at(101)].map((b) => S(b, "coin", 0.22, 15))}
      {S(at(117), "whoosh", 0.45)}
      {[at(137), at(141), at(145), at(146), at(147), at(149)].map((b) => S(b, "pop", 0.28, 15))}
      {S(at(163) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaGpt62Sol = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 310, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 140, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)" }}>Meio ponto</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1.05, letterSpacing: -2, marginTop: 30 }}>e 5x mais caro?</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 56, color: BODY, marginTop: 30 }}>GPT-6.2 Sol vs Astra</div>
    </div>
    <div style={{ position: "absolute", top: 930, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <Bar label="Astra" v={0.93} c="linear-gradient(90deg,#7a5cff,#b48cff)" w={700} right="$$$$$" />
      <Bar label="Sol" v={0.925} c={`linear-gradient(90deg,#a02c90,${PINK})`} w={700} glow right="$" />
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: PINK, border: `8px solid ${PINK}`, borderRadius: 24, padding: "4px 30px", transform: "rotate(-6deg)", marginTop: 40, background: "rgba(10,6,24,0.85)" }}>1/5 do custo</div>
    </div>
  </AbsoluteFill>
);
