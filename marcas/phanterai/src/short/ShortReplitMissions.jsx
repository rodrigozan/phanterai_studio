import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 25/11/2026 07:00 — "Um time de agentes que trabalha até bater a meta" (Replit Missions).
// Fatos conferidos na fonte primária (replit.com/blog/introducing-replit-missions, 17/11/2026, texto em fontes/fonte-1.txt):
// - "You define the outcome, and Replit coordinates a swarm of agents to plan, build, test, and iterate toward it within
//   the budget and boundaries you set"; "You can close your laptop and let the cloud agents work."
// - meta de exemplo "win our first 10 paying enterprise customers"; "During setup, Missions asks questions to define success".
// - "cap the mission's spending at $1,000 and require approval before the Agent contacts prospects, shares a proposal,
//   changes customer-facing sales materials".
// - "one agent researching buyers while another develops a demo"; NumPy, Auto (Max): 1 agente até 4×, 16 agentes 17×, 32 agentes 19×.
// - avisos "immediately, in a daily digest, or weekly"; "reaches out when it needs your input".
// - "An independent AI judge checks results against your agreed success criteria ... If the budget runs out first, work stops".
// - DataCat: "In 2 days, with a $3,000 budget"; "DataCat raised an alert in 38 seconds, beating our 60-second target".
// Tudo é interface recriada em motion no Remotion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
export const SRM_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-25-0700-replit-missions";
export const SRM_FPS = 30;
const MUSIC = "phanterai/music/CuriousFocus.mp3";
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
export const calculateReplitMissionsMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças ----------
const CYAN = "#5ee7ff";
const Prod = ({ name, c = PINK, size = 54, icon }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "18px 34px", borderRadius: 40, background: WIN, border: `4px solid ${c}`, boxShadow: `0 0 50px ${c}55` }}>
    <span style={{ width: 56, height: 56, borderRadius: 28, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#0b0618" }}>{icon}</span>
    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: size, color: "#fff" }}>{name}</span>
  </div>
);
const Composer = ({ children, w = 900, hot, c = PINK, right = "↑" }) => (
  <div style={{ width: w, padding: "22px 28px", borderRadius: 30, background: WIN, border: `3px solid ${hot ? c : LINE}`, display: "flex", alignItems: "center", gap: 18, boxSizing: "border-box", boxShadow: hot ? `0 0 50px ${c}55` : "none" }}>
    <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: "#fff", flex: 1, overflow: "hidden" }}>{children}</span>
    {right && <span style={{ width: 62, height: 62, borderRadius: 31, background: hot ? c : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#fff" }}>{right}</span>}
  </div>
);
// robozinho de agente (desenhado em CSS)
const Bot = ({ fr, c = PINK, s = 120, busy = true, k = 0 }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.28, background: WIN, border: `4px solid ${c}`, position: "relative", boxShadow: `0 0 30px ${c}55`, transform: `translateY(${busy ? Math.sin(fr / 4 + k) * 4 : 0}px)` }}>
    <div style={{ position: "absolute", left: "50%", top: -s * 0.2, width: 6, height: s * 0.2, background: c, marginLeft: -3 }} />
    <div style={{ position: "absolute", left: "50%", top: -s * 0.28, width: s * 0.14, height: s * 0.14, borderRadius: s, background: c, marginLeft: -s * 0.07, opacity: busy && (fr + k * 5) % 14 < 7 ? 1 : 0.4 }} />
    {[0.3, 0.7].map((x) => <div key={x} style={{ position: "absolute", left: `${x * 100}%`, top: "38%", width: s * 0.14, height: (fr + k * 7) % 50 < 3 ? 3 : s * 0.18, marginLeft: -s * 0.07, borderRadius: s, background: "#fff" }} />)}
    <div style={{ position: "absolute", left: "30%", right: "30%", top: "68%", height: 5, borderRadius: 3, background: c }} />
  </div>
);
const Laptop = ({ fr, close = 0, glow }) => (
  <div style={{ position: "relative", width: 620, height: 470, perspective: 900 }}>
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 50, height: 380, transformOrigin: "50% 100%", transform: `rotateX(${-close * 88}deg)`, borderRadius: "26px 26px 6px 6px", background: "#1a1236", border: `6px solid ${glow ? PINK : "#4a3f78"}`, boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 14, opacity: 1 - close }}>
        {[0.8, 0.55, 0.7, 0.4].map((w, k) => <div key={k} style={{ height: 22, width: `${w * 100}%`, borderRadius: 11, background: k === 1 ? PINKA(0.7) : "rgba(190,170,255,0.35)" }} />)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, height: 34, borderRadius: "6px 6px 30px 30px", background: "#2a2050", border: `4px solid ${glow ? PINK : "#4a3f78"}`, boxShadow: glow ? `0 0 60px ${PINKA(0.6)}` : "none" }} />
  </div>
);

// ---------- 0: gancho ----------
const AG = ["pesquisando", "testando", "codando", "revisando", "medindo", "planejando"];
const Hook = ({ fr }) => {
  const dAg = at(3), dCont = at(5), dRep = at(9), dMeta = at(14), dTeto = at(17), dCinco = at(21), dQuin = at(25), dDec = at(26);
  let big, bigD, size = 140, bg = PINK, rot = -3;
  if (fr < dCont) { big = "fechou?"; bigD = 0; size = 160; bg = RED; }
  else if (fr < dRep) { big = "continuam!"; bigD = dCont; rot = 2; }
  else if (fr < dCinco) { big = "Missions"; bigD = dRep; size = 130; }
  else if (fr < dQuin) { big = "5 passos"; bigD = dCinco; rot = 2; }
  else { big = "o 5º decide o fim"; bigD = dQuin; size = 96; }
  const flash = [dAg, dCont, dCont + 12, dRep, dCinco, dQuin].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const close = ease(lin(fr, 0, at(2) + 4));
  const showLaptop = fr < dRep;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {showLaptop ? (
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(fr, [0, 8], [1.18, 1], clamp)}) translateX(${shake(fr, at(2) + 4, 16)}px)` }}>
          <div style={{ position: "relative" }}>
            <div style={{ opacity: 1 - 0.6 * lin(fr, dAg, dAg + 8), transform: `scale(${1 - 0.35 * ease(lin(fr, dAg, dAg + 8))}) translateY(${280 * ease(lin(fr, dAg, dAg + 8))}px)` }}>
              <Laptop fr={fr} close={close} glow={fr >= at(2)} />
            </div>
            {fr >= at(2) + 4 && fr < dAg + 4 && <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center" }}><Stamp fr={fr} d={at(2) + 4} size={64} rot={-6} c={GREY}>💤 off</Stamp></div>}
          </div>
          {fr >= dCont + 12 && (
            <div style={{ position: "absolute", top: 560, left: -300, right: -300, display: "flex", justifyContent: "center" }}>
              <Stamp fr={fr} d={dCont + 12} size={64} rot={-3}>5 passos · o 5º decide o fim ❓</Stamp>
            </div>
          )}
          {fr >= dAg && (
            <div style={{ position: "absolute", top: 40, display: "grid", gridTemplateColumns: "repeat(3, 300px)", gap: 22 }}>
              {AG.map((t, k) => {
                const d = dAg + k * 2;
                return fr >= d && (
                  <In key={t} fr={fr} d={d} dy={260} damping={11}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "30px 10px 18px", borderRadius: 26, background: WIN, border: `3px solid ${fr >= dCont + k * 2 ? GREEN : LINE}` }}>
                      <Bot fr={fr} k={k} s={96} c={k % 2 ? CYAN : PINK} />
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: 28, color: "#fff" }}>{fr >= dCont + k * 2 ? <span style={{ color: GREEN }}>●</span> : <Spin fr={fr} s={24} />} {t}</div>
                    </div>
                  </In>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
          <In fr={fr} d={dRep}><Prod name="Replit Missions" icon="◎" c={PINK} size={62} /></In>
          <div style={{ display: "flex", gap: 16 }}>
            {AG.map((t, k) => <div key={t} style={{ transform: `translateY(${(1 - pop(fr, dRep + 2 + k * 2, 11)) * 300}px)`, opacity: fr >= dRep + 2 + k * 2 ? 1 : 0 }}><Bot fr={fr} k={k} s={84} c={k % 2 ? CYAN : PINK} /></div>)}
          </div>
          {fr < dCinco ? (
            <div style={{ display: "flex", gap: 26 }}>
              {fr >= dMeta - 3 && <In fr={fr} d={dMeta - 3} dx={-200} dy={0}>
                <div style={{ width: 400, padding: "30px 28px", borderRadius: 30, background: WIN, border: `4px solid ${GREEN}`, textAlign: "center" }}>
                  <div style={{ fontSize: 90 }}>🎯</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>a meta</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: GREEN, marginTop: 8 }}>você define</div>
                </div>
              </In>}
              {fr >= dTeto - 3 && <In fr={fr} d={dTeto - 3} dx={200} dy={0}>
                <div style={{ width: 400, padding: "30px 28px", borderRadius: 30, background: WIN, border: `4px solid ${AMBER}`, textAlign: "center" }}>
                  <div style={{ fontSize: 90 }}>💰</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>o teto</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: AMBER, marginTop: 8 }}>US$ {count(fr, dTeto, at(19) + 6, 0, 1000).toLocaleString("pt-BR")}</div>
                </div>
              </In>}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 18 }}>
              {["🎯", "💰", "🐝", "🔔", "⚖️"].map((ic, n) => {
                const d = dCinco + n * 3, last = n === 4, hot = last && fr >= dQuin;
                return (
                  <In key={n} fr={fr} d={d} dy={120}>
                    <div style={{ width: 168, height: 230, borderRadius: 28, background: hot ? PINKA(0.3) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `translateX(${hot ? shake(fr, dQuin, 14) : 0}px) scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#fff", lineHeight: 1 }}>{n + 1}</div>
                      <div style={{ fontSize: 50 }}>{last ? (fr >= dDec ? "🏁" : "❓") : ic}</div>
                    </div>
                  </In>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: a meta ----------
const Item1 = ({ fr }) => {
  const d0 = at(29), dTipo = at(33), dDez = at(35), dCli = at(37), dEle = at(39), dPerg = at(40), dConta = at(43), dSuc = at(45);
  const meta = "Ganhar os 10 primeiros clientes empresariais pagantes";
  const sent = fr >= dEle;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🎯" t="A meta" sub="você define o resultado" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 4}>
          <Janela title="Nova Mission" w={940} h={sent ? 300 : 360} glow={fr >= dDez && !sent}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY, marginBottom: 12 }}>Qual é o objetivo?</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff", lineHeight: 1.3 }}>{fr < dTipo ? "" : typed(meta, fr, dTipo, dCli + 10)}{!sent && blink(fr)}</div>
          </Janela>
        </In>
        {fr >= dDez && fr < dEle && (
          <In fr={fr} d={dDez} dy={40}>
            <div style={{ display: "flex", gap: 12 }}>
              {Array.from({ length: 10 }, (_, k) => <div key={k} style={{ width: 70, height: 70, borderRadius: 18, background: fr >= dDez + k * 2 ? PINKA(0.3) : "rgba(255,255,255,0.05)", border: `3px solid ${fr >= dDez + k * 2 ? PINK : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{fr >= dDez + k * 2 ? "🏢" : ""}</div>)}
            </div>
            <div style={{ textAlign: "center", marginTop: 16, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: PINK }}>0 / {count(fr, dDez, dDez + 20, 0, 10)} clientes</div>
          </In>
        )}
        {sent && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 880 }}>
            {[["O que conta como cliente empresarial?", dPerg], ["Piloto pago conta, ou só contrato anual?", dConta]].map(([q, d], k) => fr >= d && (
              <In key={q} fr={fr} d={d} dx={-160} dy={0}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <Bot fr={fr} s={70} k={k} />
                  <div style={{ flex: 1, padding: "18px 24px", borderRadius: "8px 26px 26px 26px", background: "#22183f", border: `3px solid ${CYAN}`, fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>{typed(q, fr, d, d + 14)}</div>
                </div>
              </In>
            ))}
            {fr >= dConta + 8 && (
              <In fr={fr} d={dConta + 8} dy={30}>
                <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
                  {["piloto pago ✓", "contrato anual"].map((t, k) => <Pill key={t} size={32} c={k === 0 && fr >= dSuc - 2 ? GREEN : GREY} bg={k === 0 && fr >= dSuc - 2 ? "rgba(52,211,153,0.16)" : "rgba(255,255,255,0.05)"}>{t}</Pill>)}
                </div>
              </In>
            )}
            {fr >= dSuc && <div style={{ textAlign: "center", marginTop: 6 }}><Stamp fr={fr} d={dSuc} size={64} rot={-4} c={GREEN}>sucesso definido ✓</Stamp></div>}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: o teto ----------
const APROV = ["Contatar clientes novos", "Enviar uma proposta", "Mudar o material de vendas"];
const Item2 = ({ fr }) => {
  const d0 = at(46), dTeto = at(49), dGasto = at(50), dTrav = at(51), dMil = at(53), dFalar = at(56), dSo = at(60), dAprov = at(64);
  const v = count(fr, dGasto, dMil + 8, 0, 1000);
  const locked = fr >= dTrav;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="💰" t="O teto" sub="gasto e limites" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 4}>
          <div style={{ width: 940, padding: "28px 34px", borderRadius: 30, background: WIN, border: `3px solid ${locked ? AMBER : LINE}`, boxSizing: "border-box", boxShadow: fr >= dMil ? `0 0 60px rgba(251,191,36,0.35)` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>
              <span>Limite de gasto</span>
              <span style={{ fontSize: 54, transform: `scale(${locked ? 0.7 + 0.3 * pop(fr, dTrav, 8) : 1}) rotate(${locked ? 0 : -15}deg)`, display: "inline-block" }}>{locked ? "🔒" : "🔓"}</span>
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 120, color: fr >= dMil ? AMBER : "#fff", margin: "6px 0 10px", transform: `scale(${fr >= dMil ? 1 + 0.08 * Math.max(0, 1 - (fr - dMil) / 10) : 1})`, transformOrigin: "left" }}>US$ {v.toLocaleString("pt-BR")}</div>
            <div style={{ height: 36, borderRadius: 18, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}><div style={{ height: "100%", width: `${(v / 1000) * 100}%`, background: `linear-gradient(90deg,#b7791f,${AMBER})`, borderRadius: 18 }} /></div>
          </div>
        </In>
        {fr >= dFalar - 4 && (
          <In fr={fr} d={dFalar - 4}>
            <Janela title="pedir sua aprovação antes de…" w={940} h={400} glow={fr >= dAprov}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {APROV.map((t, k) => {
                  const on = fr >= dFalar + k * 6;
                  return (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>
                      <div style={{ width: 96, height: 52, borderRadius: 26, background: on ? PINK : "rgba(255,255,255,0.12)", position: "relative" }}>
                        <div style={{ position: "absolute", top: 6, left: on ? 50 : 6, width: 40, height: 40, borderRadius: 20, background: "#fff", transition: "none" }} />
                      </div>
                      <span>{t}</span>
                    </div>
                  );
                })}
              </div>
            </Janela>
          </In>
        )}
        {fr >= dSo && (
          <In fr={fr} d={dSo} dy={60}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 28px", borderRadius: 26, background: "#22183f", border: `3px solid ${fr >= dAprov ? GREEN : PINK}` }}>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>Enviar mensagem ao cliente?</span>
              <span style={{ padding: "10px 22px", borderRadius: 16, background: fr >= dAprov + 4 ? GREEN : "rgba(52,211,153,0.2)", fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#0b0618", transform: `scale(${fr >= dAprov + 4 && fr < dAprov + 9 ? 0.88 : 1})` }}>Aprovar</span>
              {fr >= dSo + 6 && <Cursor x={760} y={60} fr={fr} click={dAprov + 4} />}
            </div>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: o enxame ----------
const Item3 = ({ fr }) => {
  const d0 = at(65), dEnx = at(68), dA = at(69), dPesq = at(71), dB = at(72), dDemo = at(75), dTeste = at(76), dSoz = at(80), dAcel = at(81), dQuatro = at(84), dTrinta = at(86), dJuntos = at(89), dDez = at(90);
  const chart = fr >= dTeste;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="🐝" t="O enxame" sub="agentes em paralelo" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {!chart ? (
          <div style={{ display: "flex", gap: 26 }}>
            {[["pesquisa compradores", dA, dPesq, CYAN, "🔎"], ["monta a demo", dB, dDemo, PINK, "🧩"]].map(([t, d, d2, c, ic], k) => fr >= d - 3 && (
              <In key={t} fr={fr} d={d - 3} dy={150}>
                <div style={{ width: 440, padding: "40px 24px 30px", borderRadius: 30, background: WIN, border: `4px solid ${c}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                  <Bot fr={fr} s={140} c={c} k={k} />
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", textAlign: "center" }}>{ic} {t}</div>
                  <div style={{ width: "100%", height: 30, borderRadius: 15, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}><div style={{ height: "100%", width: `${100 * (0.1 + 0.9 * lin(fr, d, d2 + 14))}%`, background: c }} /></div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: fr >= d2 + 14 ? GREEN : GREY }}>{fr >= d2 + 14 ? "✓ pronto" : "trabalhando…"}</div>
                </div>
              </In>
            ))}
          </div>
        ) : (
          <In fr={fr} d={dTeste}>
            <Janela title="teste · código acelerado" w={960} h={640} glow={fr >= dDez}>
              <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 10 }}>
                {fr >= dTeste + 4 && (
                  <In fr={fr} d={dTeste + 4} dx={-120} dy={0}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}><Bot fr={fr} s={64} c={CYAN} /><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>1 agente</span></div>
                    <Bar label="" lw={0} w={880} h={76} c={CYAN} v={(4 / 19) * lin(fr, dTeste + 8, dQuatro + 2)} right={fr >= dQuatro ? "4×" : `${Math.max(1, Math.round(4 * lin(fr, dTeste + 8, dQuatro + 2)))}×`} />
                  </In>
                )}
                {fr >= dTrinta - 4 && (
                  <In fr={fr} d={dTrinta - 4} dx={-120} dy={0}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap", width: 880 }}>
                      {Array.from({ length: 32 }, (_, k) => <div key={k} style={{ width: 20, height: 20, borderRadius: 6, background: fr >= dTrinta + k * 0.6 ? PINK : "rgba(255,255,255,0.1)" }} />)}
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", marginLeft: 10 }}>{count(fr, dTrinta, dJuntos, 1, 32)} agentes</span>
                    </div>
                    <Bar label="" lw={0} w={880} h={76} c={PINK} glow v={ease(lin(fr, dJuntos - 4, dDez + 4))} right={fr >= dDez ? "19×" : `${Math.max(1, Math.round(19 * ease(lin(fr, dJuntos - 4, dDez + 4))))}×`} />
                  </In>
                )}
                {fr >= dDez + 2 && <div style={{ textAlign: "center" }}><Stamp fr={fr} d={dDez + 2} size={110} rot={-5}>19×</Stamp></div>}
              </div>
            </Janela>
          </In>
        )}
        {!chart && fr >= dEnx && (
          <div style={{ display: "flex", gap: 12 }}>
            {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ transform: `translateY(${Math.sin(fr / 5 + k) * 10}px)`, opacity: lin(fr, dEnx + k, dEnx + k + 4) }}><Bot fr={fr} s={56} k={k} c={k % 2 ? CYAN : PINK} /></div>)}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: os avisos ----------
const Item4 = ({ fr }) => {
  const d0 = at(91), dAv = at(94), dHora = at(95), dDia = at(98), dSem = at(100), dChama = at(105), dPrec = at(107);
  const sel = fr >= dSem ? 2 : fr >= dDia ? 1 : fr >= dHora ? 0 : -1;
  const NOT = [["✅", "Progresso: 3 tarefas concluídas", dAv, GREEN], ["📊", "Resumo do dia: demo pronta", dDia + 6, CYAN], ["🙋", "Preciso de você: aprovar o envio?", dChama, PINK]];
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="🔔" t="Os avisos" sub="você escolhe quando" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <In fr={fr} d={d0 + 4}>
          <div style={{ display: "flex", padding: 10, borderRadius: 40, background: WIN, border: `3px solid ${LINE}` }}>
            {["Na hora", "Por dia", "Por semana"].map((t, k) => <div key={t} style={{ padding: "20px 34px", borderRadius: 32, background: sel === k ? PINK : "transparent", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", transform: `scale(${sel === k ? 1.05 : 1})` }}>{t}</div>)}
          </div>
        </In>
        <In fr={fr} d={d0 + 8}>
          <div style={{ width: 560, height: 700, borderRadius: 70, background: "#120c26", border: `8px solid ${fr >= dPrec ? PINK : "#4a3f78"}`, padding: "70px 26px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18, boxShadow: fr >= dPrec ? `0 0 70px ${PINKA(0.5)}` : "none", position: "relative" }}>
            <div style={{ position: "absolute", top: 22, left: "50%", marginLeft: -60, width: 120, height: 30, borderRadius: 15, background: "#000" }} />
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff", textAlign: "center", marginBottom: 10 }}>07:{String(12 + Math.floor((fr - dAv) / 6) % 40).padStart(2, "0")}</div>
            {NOT.map(([ic, t, d, c]) => fr >= d && (
              <In key={t} fr={fr} d={d} dy={-80}>
                <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "18px 18px", borderRadius: 24, background: "rgba(255,255,255,0.09)", border: `3px solid ${c}`, transform: `translateX(${d === dChama ? shake(fr, dPrec, 10) : 0}px)` }}>
                  <span style={{ fontSize: 44 }}>{ic}</span>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", lineHeight: 1.15 }}>{t}</span>
                </div>
              </In>
            ))}
          </div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: o juiz ----------
const Item5 = ({ fr }) => {
  const d0 = at(110), dJuiz = at(113), dIA = at(114), dConf = at(118), dRes = at(120), dMeta = at(124), dBat = at(125), dMis = at(126), dAcab = at(128), dOrc = at(130), dPara = at(131);
  const broke = fr >= dAcab;
  const clientes = count(fr, dConf, dBat, 0, 10);
  const verba = count(fr, dAcab, dPara, 1000, 0);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="5" icon="⚖️" t="O juiz" sub="uma IA independente" />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0 + 4}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "24px 36px", borderRadius: 30, background: WIN, border: `4px solid ${VIOLET}` }}>
            <div style={{ fontSize: 100, transform: `rotate(${Math.sin(fr / 6) * 8}deg)` }}>⚖️</div>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>Juiz de IA</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: fr >= dIA ? VIOLET : GREY }}>{fr >= dConf ? "conferindo…" : "independente"}</div>
            </div>
            {fr >= dConf && fr < dMis && <Spin fr={fr} c={VIOLET} s={52} />}
          </div>
        </In>
        {!broke ? (
          fr >= dIA + 2 && (
            <In fr={fr} d={dIA + 2}>
              <Janela title="critério de sucesso" w={940} h={420} glow={fr >= dMis}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>🎯 10 clientes empresariais pagantes</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 96, color: clientes >= 10 ? GREEN : "#fff", margin: "12px 0" }}>{clientes} / 10</div>
                <div style={{ height: 36, borderRadius: 18, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}><div style={{ height: "100%", width: `${clientes * 10}%`, background: `linear-gradient(90deg,#1f9e74,${GREEN})` }} /></div>
                {fr >= dRes && fr < dBat && <div style={{ marginTop: 18, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: VIOLET }}>{fr >= dMeta ? "resultado × meta…" : "lendo o resultado…"}</div>}
              </Janela>
            </In>
          )
        ) : (
          <In fr={fr} d={dAcab}>
            <Janela title="orçamento da mission" w={940} h={420} glow>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>💰 restante</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 96, color: verba <= 0 ? RED : AMBER, margin: "12px 0" }}>US$ {verba.toLocaleString("pt-BR")}</div>
              <div style={{ height: 36, borderRadius: 18, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}><div style={{ height: "100%", width: `${verba / 10}%`, background: verba < 300 ? RED : AMBER }} /></div>
            </Janela>
          </In>
        )}
        {fr >= dMis && fr < dAcab && <Stamp fr={fr} d={dMis} size={80} rot={-4} c={GREEN}>✓ missão completa</Stamp>}
        {fr >= dPara && <Stamp fr={fr} d={dPara} size={90} rot={-5} c={RED}>⏹ parou</Stamp>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: o teste da Replit ----------
const Item6 = ({ fr }) => {
  const d0 = at(133), dTest = at(136), dDias = at(137), dMil = at(139), dSaiu = at(143), dPlat = at(145), dBug = at(149), dTrinta = at(151), dSeg = at(154);
  const dash = fr >= dSaiu - 2;
  const sec = count(fr, dBug + 4, dSeg + 2, 0, 38);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <In fr={fr} d={d0}><Pill size={46} c={PINK} bg={PINKA(0.15)}>🧪 o teste da própria Replit</Pill></In>
      </div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", gap: 24 }}>
          {fr >= d0 + 6 && <In fr={fr} d={d0 + 6} dy={80}><div style={{ width: 400, padding: "22px", borderRadius: 28, background: WIN, border: `4px solid ${CYAN}`, textAlign: "center" }}><div style={{ fontSize: 60 }}>📅</div><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff" }}>{count(fr, d0 + 8, dDias + 6, 0, 2)} {count(fr, d0 + 8, dDias + 6, 0, 2) === 1 ? "dia" : "dias"}</div></div></In>}
          {fr >= dMil - 3 && <In fr={fr} d={dMil - 3} dy={80}><div style={{ width: 400, padding: "22px", borderRadius: 28, background: WIN, border: `4px solid ${AMBER}`, textAlign: "center" }}><div style={{ fontSize: 60 }}>💰</div><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff" }}>US$ {count(fr, dMil, dMil + 12, 0, 3000).toLocaleString("pt-BR")}</div></div></In>}
        </div>
        {dash && (
          <In fr={fr} d={dSaiu - 2}>
            <Janela title="DataCat · monitoramento" w={940} h={560} glow={fr >= dBug}>
              <div style={{ display: "flex", gap: 18 }}>
                {["painéis", "alertas", "rastreio"].map((t, k) => fr >= dPlat + k * 3 && <In key={t} fr={fr} d={dPlat + k * 3} dy={30}><Pill size={30} c={k === 1 && fr >= dBug ? RED : CYAN} bg="rgba(94,231,255,0.1)">{t} ✓</Pill></In>)}
              </div>
              <svg width={880} height={210} style={{ marginTop: 20 }}>
                {[0, 1].map((s) => {
                  const pts = Array.from({ length: 40 }, (_, x) => { const t = x + fr * 0.6; const bugK = s === 0 && fr >= dBug && x > 28 ? 70 : 0; return `${x * 22.5},${105 - Math.sin(t / 3 + s * 2) * 30 - Math.sin(t / 7) * 20 - bugK + s * 40}`; }).join(" ");
                  return <polyline key={s} points={pts} fill="none" stroke={s ? VIOLET : fr >= dBug ? RED : CYAN} strokeWidth={6} strokeLinejoin="round" />;
                })}
              </svg>
              {fr >= dBug && (
                <In fr={fr} d={dBug} dy={-40}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px", borderRadius: 22, background: "rgba(255,92,122,0.15)", border: `3px solid ${RED}`, transform: `translateX(${shake(fr, dBug, 12)}px)` }}>
                    <span style={{ fontSize: 50 }}>🐞</span>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>Alerta: bug no banco</span>
                    <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 52, color: fr >= dSeg ? GREEN : "#fff" }}>{sec} s</span>
                  </div>
                </In>
              )}
            </Janela>
          </In>
        )}
        {fr >= dTrinta && (
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <In fr={fr} d={dTrinta}><Pill size={36} c={GREY} bg="rgba(255,255,255,0.05)">meta: 60 s</Pill></In>
            {fr >= dSeg && <Stamp fr={fr} d={dSeg} size={70} rot={-4} c={GREEN}>38 s ✓</Stamp>}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(155), dTime = at(161), dCom = at(162), dK = at(163), dSeg = at(166);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 110, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>qual meta?</div></In>
        <div style={{ display: "flex", gap: 14 }}>
          {Array.from({ length: 6 }, (_, k) => <In key={k} fr={fr} d={d0 + 3 + k * 3}><Bot fr={fr} s={110} k={k} c={fr >= dTime && k % 2 ? GREEN : k % 2 ? CYAN : PINK} /></In>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 20, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 5; if (fr < t0) return null; const q = ((fr - t0) % 36) / 34; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : LINE}`, opacity: Math.max(0.35, lin(fr, d0 + 10, dCom)), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("MISSÃO", fr, dK - 2, dK + 8)}{blink(fr)}</span>
            {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: Math.max(0.35, lin(fr, dCom, dCom + 6)) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- legendas ----------
const KEY = new Set(["fechou", "notebook", "agentes", "trabalhando", "replit", "missions", "meta", "teto", "gasto", "5", "quinto", "acaba", "10", "clientes", "sucesso", "travado", "us1mil", "aprovacao", "enxame", "pesquisa", "demo", "4", "32", "19", "avisos", "hora", "dia", "semana", "chama", "juiz", "ia", "independente", "resultado", "bateu", "missao", "completa", "orcamento", "tudo", "2dias", "us3mil", "plataforma", "bug", "38s", "time", "segue"]);
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
    if (n === "tres" && nn(k + 1) === "mil" && nn(k + 2) === "dolares") { push("US$ 3 mil", k + 2); continue; }
    if (n === "mil" && nn(k + 1) === "dolares") { push("US$ 1 mil", k + 1); continue; }
    if (n === "trinta" && nn(k + 1) === "e" && nn(k + 2) === "dois") { push("32", k + 2); continue; }
    if (n === "trinta" && nn(k + 1) === "e" && nn(k + 2) === "oito" && nn(k + 3) === "segundos") { push("38 s", k + 3); continue; }
    if (n === "quatro" && nn(k + 1) === "vezes") { push("4×", k + 1); continue; }
    if (n === "dezenove") { push("19×", k); continue; }
    if (n === "dez") { push("10", k); continue; }
    if (n === "dois" && nn(k + 1) === "dias") { push("2 dias", k + 1); continue; }
    if (n === "i" && nn(k + 1) === "a") { push("IA", k + 1); continue; }
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

export const ShortReplitMissions = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(29), at(46), at(65), at(91), at(110), at(133), at(155), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, Item6, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(3)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(110)} b={at(117)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(163)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(2) + 4, "pop", 0.5, 15)}
      {[0, 2, 4, 6, 8, 10].map((o) => S(at(3) + o, "pop", 0.28, 15))}
      {S(at(5), "ding", 0.4, 20)}
      {S(at(5) + 12, "whoosh", 0.6, 30)}
      {S(at(9), "whoosh", 0.8, 30)}
      {S(at(14) - 3, "pop", 0.4, 15)}
      {S(at(17) - 3, "coin", 0.35, 15)}
      {[0, 3, 6, 9, 12].map((o) => S(at(21) + o, "pop", 0.3, 15))}
      {S(at(25), "riser", 0.35, 30)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(40), "pop", 0.35, 15)}
      {S(at(43), "pop", 0.35, 15)}
      {S(at(45), "ding", 0.4)}
      {S(at(51), "pop", 0.4, 15)}
      {S(at(53), "coin", 0.35, 15)}
      {S(at(64) + 4, "ding", 0.4)}
      {S(at(84), "pop", 0.35, 15)}
      {S(at(86), "riser", 0.3, 30)}
      {S(at(90) + 2, "ding", 0.45)}
      {[at(95), at(98), at(100), at(105)].map((b) => S(b, "pop", 0.32, 15))}
      {S(at(118), "riser", 0.25, 30)}
      {S(at(126), "ding", 0.45)}
      {S(at(131), "error", 0.4, 15)}
      {S(at(149), "error", 0.4, 15)}
      {S(at(154), "ding", 0.45)}
      {S(at(163) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaReplitMissions = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 92, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Fechou o notebook?</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>os agentes seguem</div>
    </div>
    <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 230px)", gap: 24 }}>
        {AG.map((t, k) => (
          <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "30px 8px 16px", borderRadius: 26, background: WIN, border: `3px solid ${k % 2 ? CYAN : PINK}` }}>
            <Bot fr={k * 3} k={k} s={90} c={k % 2 ? CYAN : PINK} busy={false} />
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#fff" }}>{t}</div>
          </div>
        ))}
      </div>
      <Prod name="Replit Missions" icon="◎" c={PINK} size={58} />
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>meta + teto de gasto</div>
    </div>
  </AbsoluteFill>
);
