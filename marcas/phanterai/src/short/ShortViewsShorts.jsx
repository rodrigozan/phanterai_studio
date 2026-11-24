import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 24/11/2026 10:00 — Mito vs. Realidade: "Tive 7,6 mil views. Só 2,9 mil ficaram".
// Fatos conferidos nas fontes primárias (texto capturado em fontes/ em 24/11/2026):
// - support.google.com/youtube/answer/10059070: "Starting 3/31/2025 ... Views will count the number of times a Short starts
//   to play or replay, with no minimum watch time requirement"; a métrica antiga virou "Engaged views" no YouTube Analytics;
//   YPP e receita de Shorts "based on Engaged Shorts views".
// - support.google.com/youtube/thread/333869549 (TeamYouTube, 26/03/2025): "engaged views" fica em YouTube Analytics > Advanced Mode.
// - support.google.com/youtube/answer/2991785: "YPP earnings will still be based on 'engaged views'".
// - support.google.com/youtube/answer/12220281: Engaged views = "How many times viewers stayed to watch past the initial seconds".
// - Números do canal: marcas/phanterai/dados-canal-2026-11-22.md (Studio, 28 dias até 22/11/2026): Shorts 7,6 mil views,
//   2,9 mil views engajadas, +22 dos +26 inscritos vindos dos Shorts.
// Tudo é interface recriada em motion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
export const SVS_SLUG = "phanterai/episodes/shorts-reels-tiktok/yt-short-2026-11-24-1000-views-de-shorts";
export const SVS_FPS = 30;
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = SVS_FPS;
const f = (p) => staticFile(`${SVS_SLUG}/${p}`);
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
export const calculateViewsShortsMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};
const fmt = (n) => n.toLocaleString("pt-BR");

// ---------- peças ----------
const Pessoa = ({ c = BODY, s = 1, q }) => (
  <div style={{ width: 70 * s, height: 96 * s, position: "relative" }}>
    <div style={{ position: "absolute", left: 17 * s, top: 0, width: 36 * s, height: 36 * s, borderRadius: 18 * s, background: c }} />
    <div style={{ position: "absolute", left: 4 * s, top: 42 * s, width: 62 * s, height: 54 * s, borderRadius: `${30 * s}px ${30 * s}px ${10 * s}px ${10 * s}px`, background: c }} />
    {q && <div style={{ position: "absolute", left: 0, right: 0, top: 2 * s, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 30 * s, color: "#0b0618" }}>?</div>}
  </div>
);
const Contador = ({ v, label = "views", icon = "👁", c = "#fff", w = 820, glow, sub }) => (
  <div style={{ width: w, padding: "30px 40px", borderRadius: 34, background: WIN, border: `3px solid ${glow ? PINK : LINE}`, boxShadow: `0 0 70px ${PINKA(glow ? 0.45 : 0.15)}`, display: "flex", alignItems: "center", gap: 30, boxSizing: "border-box" }}>
    <span style={{ fontSize: 96 }}>{icon}</span>
    <div>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 132, color: c, lineHeight: 1 }}>{v}</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY, marginTop: 6 }}>{label}{sub && <span style={{ color: PINK }}> {sub}</span>}</div>
    </div>
  </div>
);
// celular com um Short tocando (genérico, sem logo)
const Celular = ({ fr, play = 0, prog = 0, hue = 290, w = 420, h = 760, children, swipe = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: 56, background: "#07040f", border: "6px solid #3a2f66", boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.25)}`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 14, borderRadius: 44, overflow: "hidden", background: `linear-gradient(160deg, hsl(${hue},70%,38%), hsl(${(hue + 60) % 360},70%,18%))`, transform: `translateY(${-swipe * 100}%)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "40%", textAlign: "center", fontSize: 120, color: "#fff", opacity: play ? 0.25 : 0.95, transform: `scale(${1 + 0.06 * Math.sin(fr / 5)})` }}>▶</div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 30, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.25)" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 5, background: PINK }} />
      </div>
      {children}
    </div>
    <div style={{ position: "absolute", top: 22, left: "50%", width: 110, height: 26, marginLeft: -55, borderRadius: 13, background: "#07040f" }} />
  </div>
);
const Bracket = ({ children, c = PINK }) => <span style={{ color: c }}>{children}</span>;
const center = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" };

// ---------- 0: gancho (0 -> "Desde") ----------
const Hook = ({ fr }) => {
  const dMas = at(5), dMito = at(8), dTres = at(15), dNao = at(21), dTer = at(24), dDoi = at(25);
  let big, bigD, size = 150, bg = PINK, rot = -2;
  if (fr < dMas) { big = "7.600 views!"; bigD = 0; size = 128; }
  else if (fr < dMito) { big = "quem assistiu?"; bigD = dMas; size = 118; bg = RED; rot = 2; }
  else if (fr < dTres) { big = "Mito?"; bigD = dMito; size = 160; }
  else { big = "3 números"; bigD = dTres; size = 140; rot = 2; }
  const flash = [dMas, dMito, dTres, dNao, dDoi].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const v = count(fr, 0, dMas, 1250, 7600);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dMito && (
        <div style={{ ...center, top: 430, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dMas, 22)}px)` }}>
          <div style={{ transform: `scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(fr - at(4)) / 6)})` }}><Contador v={fmt(v)} label="views nos Shorts" glow /></div>
          <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "repeat(6, 110px)", gap: 26 }}>
            {Array.from({ length: 12 }, (_, k) => {
              const d = k * 5, q = fr >= dMas + k;
              if (fr < d) return <div key={k} />;
              return <div key={k} style={{ transform: `scale(${pop(fr, d, 11)}) translateY(${q ? Math.sin((fr + k * 7) / 4) * 6 : 0}px)`, opacity: q && k % 3 ? 0.35 : 1, display: "flex", justifyContent: "center" }}><Pessoa c={q ? GREY : k % 4 ? BODY : PINK} q={q} /></div>;
            })}
          </div>
        </div>
      )}
      {fr >= dMito && fr < dTres + 4 && (
        <div style={{ ...center, top: 520, opacity: 1 - lin(fr, dTres, dTres + 4) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <In fr={fr} d={dMito + 1} dx={-120} dy={0}><div style={{ width: 300, height: 300, borderRadius: 40, background: WIN, border: `3px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 130, color: PINK }}>▶</span><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>1 view</span></div></In>
            <In fr={fr} d={at(10)}><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 170, color: fr >= dNao ? RED : "#fff" }}>{fr >= dNao ? "≠" : "="}</span></In>
            <In fr={fr} d={at(13)} dx={120} dy={0}><div style={{ width: 300, height: 300, borderRadius: 40, background: WIN, border: `3px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}><Pessoa c={BODY} s={1.5} /><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>assistindo</span></div></In>
          </div>
          <div style={{ marginTop: 40 }}>{fr >= at(9) && <In fr={fr} d={at(9)}><Pill c={PINK} bg={PINKA(0.15)} size={44}>3 números do Studio · o 3º dói</Pill></In>}</div>
          <div style={{ marginTop: 40 }}><Stamp fr={fr} d={at(14)} c={AMBER} rot={-6} size={62}>conselho batido</Stamp></div>
        </div>
      )}
      {fr >= dTres && (
        <div style={{ ...center, top: 470 }}>
          <div style={{ display: "flex", gap: 34 }}>
            {[0, 1, 2].map((k) => {
              const d = [dTres, at(16), at(18)][k];
              const hot = k === 2 && fr >= dTer;
              if (fr < d) return <div key={k} style={{ width: 270 }} />;
              const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
              return (
                <div key={k} style={{ width: 270, height: 380, borderRadius: 36, background: hot ? "rgba(255,92,122,0.2)" : WIN, border: `4px solid ${hot ? RED : PINK}`, transform: `perspective(800px) rotateY(${flip}deg) translateX(${hot ? shake(fr, dDoi, 18) : 0}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: `0 0 50px ${hot ? "rgba(255,92,122,0.5)" : PINKA(0.25)}` }}>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, color: "#fff" }}>{k + 1}</span>
                  <span style={{ fontFamily: MONO, fontSize: 40, color: hot ? RED : GREY }}>{hot ? "ai!" : "Studio"}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 60, display: "flex", gap: 20, opacity: lin(fr, at(18), at(19)) }}>
            <Pill c={RED} bg="rgba(255,92,122,0.15)">view ≠ gente assistindo</Pill>
          </div>
          <div style={{ marginTop: 40 }}><Stamp fr={fr} d={dDoi} c={RED} rot={-7} size={80}>o 3º dói</Stamp></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: a regra (Desde ... mínimo) ----------
const Regra = ({ fr }) => {
  const d0 = at(26), dCinco = at(34), dYT = at(36), dComeca = at(42), dSem = at(45), dMin = at(47);
  const dia = Math.max(1, Math.min(31, Math.round(interpolate(fr, [d0 + 4, dCinco + 4], [1, 31], { ...clamp, easing: ease }))));
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 150 }}><Pill c={PINK} bg={PINKA(0.15)} size={46}>a regra do YouTube</Pill></div>
      {fr < dYT + 2 && (
        <div style={{ ...center, top: 330, opacity: 1 - lin(fr, dYT - 2, dYT + 2) }}>
          <div style={{ width: 600, borderRadius: 40, overflow: "hidden", background: WIN, border: `4px solid ${PINK}`, boxShadow: `0 0 70px ${PINKA(0.35)}` }}>
            <div style={{ background: PINK, padding: "20px 0", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{fr >= at(27) ? "MARÇO" : "…"} {fr >= at(29) ? count(fr, at(29), dCinco, 2019, 2025) : ""}</div>
            <div style={{ padding: "30px 0", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 300, color: "#fff", lineHeight: 1, transform: `rotateX(${(fr % 3) * (dia < 31 ? 12 : 0)}deg)` }}>{dia}</div>
          </div>
          {fr >= dCinco + 4 && <div style={{ marginTop: 40 }}><Stamp fr={fr} d={dCinco + 4} rot={-4} size={70}>31/03/2025</Stamp></div>}
        </div>
      )}
      {fr >= dYT && fr < dSem + 2 && (
        <div style={{ ...center, top: 300, opacity: 1 - lin(fr, dSem - 2, dSem + 2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <In fr={fr} d={dYT} dx={-100} dy={0}>
              <div style={{ position: "relative" }}>
                <Celular fr={fr} play={fr >= dComeca} prog={lin(fr, dComeca, dComeca + 60)} hue={300} />
                <Cursor x={250} y={interpolate(fr, [dYT, dComeca], [700, 360], clamp)} fr={fr} click={dComeca} s={2} />
              </div>
            </In>
            <In fr={fr} d={at(37)} dx={100} dy={0}>
              <div style={{ width: 380, padding: "30px 20px", borderRadius: 34, background: WIN, border: `3px solid ${fr >= dComeca + 2 ? GREEN : LINE}`, textAlign: "center" }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREY }}>views</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 200, color: fr >= dComeca + 2 ? GREEN : "#fff", transform: `scale(${fr >= dComeca + 2 ? 0.7 + 0.3 * pop(fr, dComeca + 2, 7) : 1})` }}>{fr >= dComeca + 2 ? 1 : 0}</div>
                <div style={{ fontFamily: MONO, fontSize: 34, color: BODY }}>{fr >= dComeca + 2 ? "+1 no play" : "esperando…"}</div>
              </div>
            </In>
          </div>
          <div style={{ marginTop: 50 }}>{fr >= dComeca && <Stamp fr={fr} d={dComeca} c={GREEN} rot={-5} size={80}>começou = contou</Stamp>}</div>
        </div>
      )}
      {fr >= dSem && (
        <div style={{ ...center, top: 330 }}>
          <div style={{ width: 440, height: 440, borderRadius: 220, background: WIN, border: `8px solid ${PINK}`, position: "relative", boxShadow: `0 0 80px ${PINKA(0.4)}`, transform: `scale(${pop(fr, dSem, 11)})` }}>
            <div style={{ position: "absolute", left: 212, top: 40, width: 16, height: 180, borderRadius: 8, background: "#fff", transformOrigin: "8px 180px", transform: `rotate(${(fr - dSem) * 2}deg)` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 70, color: "#fff" }}>0,0 s</div>
          </div>
          <div style={{ marginTop: 40, position: "relative", fontFamily: inter, fontWeight: 800, fontSize: 64, color: BODY }}>
            tempo mínimo
            {fr >= dMin && <div style={{ position: "absolute", left: -10, top: "50%", height: 10, borderRadius: 5, background: RED, width: `${110 * lin(fr, dMin, dMin + 5)}%` }} />}
          </div>
          <div style={{ marginTop: 30 }}><Stamp fr={fr} d={dMin + 2} c={RED} rot={-6} size={84}>nenhum!</Stamp></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 2: Nº 1 views ----------
const Item1 = ({ fr }) => {
  const d0 = at(48), dC = at(51), dCt = at(52);
  const t = Math.max(0, fr - d0 - 6);
  const n = Math.floor(t / 11);
  const sw = ease(Math.min(1, (t % 11) / 6));
  const v = 1 + n;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="▶" t="Views" sub="começou, contou" />
      <div style={{ ...center, top: 470 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ position: "relative", width: 420, height: 760, borderRadius: 56, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${-sw * 100}%)` }}><Celular fr={fr} play prog={0.1} hue={(n * 70) % 360} /></div>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - sw) * 100}%)` }}><Celular fr={fr} play prog={0.05} hue={((n + 1) * 70) % 360} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 190, color: GREEN, transform: `scale(${1 + 0.12 * (1 - Math.min(1, (t % 11) / 5))})` }}>{v}</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREY }}>views</div>
            <span style={{ fontSize: 80, transform: `translateY(${-Math.abs(Math.sin(fr / 4)) * 20}px)` }}>👆</span>
          </div>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 24 }}>
          {fr >= dC && <Stamp fr={fr} d={dC} c={GREEN} rot={-4} size={70}>começou</Stamp>}
          {fr >= dCt && <Stamp fr={fr} d={dCt} c={GREEN} rot={4} size={70}>+1</Stamp>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: Nº 2 views engajadas ----------
const DOTS = [{ stop: 0.12 }, { stop: 1 }, { stop: 0.2 }, { stop: 1 }, { stop: 1 }, { stop: 0.08 }];
const Item2 = ({ fr }) => {
  const d0 = at(53), dFic = at(59), dPrim = at(62), dDin = at(64), dPP = at(68), dCalc = at(72), dElas = at(74);
  const run = (k) => lin(fr, d0 + 8 + k * 7, d0 + 85 + k * 7);
  const MARK = 0.3;
  const eng = dFic && DOTS.filter((d, k) => d.stop > MARK && run(k) * d.stop > MARK).length;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="⏱" t="Views engajadas" sub="quem ficou" />
      {fr < dDin + 3 && (
        <div style={{ ...center, top: 480, opacity: 1 - lin(fr, dDin - 1, dDin + 3) }}>
          <div style={{ width: 920, height: 520, borderRadius: 34, background: WIN, border: `3px solid ${LINE}`, position: "relative" }}>
            <div style={{ position: "absolute", left: 60, right: 60, top: 260, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ position: "absolute", left: 60, width: 800 * MARK, top: 200, height: 130, borderRadius: 20, background: fr >= dPrim ? PINKA(0.25) : "rgba(255,255,255,0.05)", border: `3px dashed ${fr >= dPrim ? PINK : GREY}` }} />
            <div style={{ position: "absolute", left: 60, width: 800 * MARK, top: 345, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 30, color: fr >= dPrim ? PINK : GREY }}>primeiros segundos</div>
            <div style={{ position: "absolute", left: 60, top: 400, fontFamily: MONO, fontSize: 30, color: GREY }}>0 s</div>
            <div style={{ position: "absolute", right: 60, top: 400, fontFamily: MONO, fontSize: 30, color: GREY }}>fim</div>
            {DOTS.map((d, k) => {
              const p = run(k) * d.stop, gone = d.stop < MARK && run(k) >= 1;
              const ok = p > MARK;
              return <div key={k} style={{ position: "absolute", left: 60 + 800 * p - 28, top: 238 + (k - 2.5) * 14 - (gone ? lin(fr, d0 + 85 + k * 7, d0 + 95 + k * 7) * 160 : 0), width: 56, height: 56, borderRadius: 28, background: ok ? GREEN : gone ? RED : BODY, opacity: gone ? 1 - lin(fr, d0 + 87 + k * 7, d0 + 97 + k * 7) : 1, boxShadow: ok ? `0 0 30px ${GREEN}` : "none" }} />;
            })}
            <div style={{ position: "absolute", right: 40, top: 30, fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREEN }}>engajadas: <span style={{ fontFamily: MONO }}>{eng}</span></div>
            <div style={{ position: "absolute", left: 40, top: 30, fontFamily: inter, fontWeight: 800, fontSize: 36, color: RED, opacity: lin(fr, d0 + 88, d0 + 94) }}>↑ deslizou</div>
          </div>
          <div style={{ marginTop: 34, fontFamily: lora, fontStyle: "italic", fontSize: 40, color: BODY, opacity: lin(fr, d0 + 10, d0 + 20) }}>é a contagem antiga de views</div>
        </div>
      )}
      {fr >= dDin && (
        <div style={{ ...center, top: 470 }}>
          <In fr={fr} d={dDin}><div style={{ fontSize: 170, transform: `rotate(${Math.sin(fr / 5) * 8}deg)` }}>💰</div></In>
          <In fr={fr} d={dPP}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={50}>Programa de Parcerias</Pill></In>
          <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 28, alignItems: "center" }}>
            {fr >= dCalc && (
              <In fr={fr} d={dCalc}><div style={{ position: "relative", width: 760, padding: "24px 36px", borderRadius: 28, background: WIN, border: `3px solid ${LINE}`, fontFamily: inter, fontWeight: 800, fontSize: 54, color: GREY, boxSizing: "border-box" }}>
                views <span style={{ float: "right", color: RED }}>✗</span>
                <div style={{ position: "absolute", left: 30, top: "50%", height: 7, background: RED, borderRadius: 4, width: `${60 * lin(fr, dCalc + 4, dCalc + 10)}%` }} />
              </div></In>
            )}
            {fr >= dCalc + 6 && (
              <In fr={fr} d={dCalc + 6}><div style={{ width: 760, padding: "24px 36px", borderRadius: 28, background: "rgba(52,211,153,0.14)", border: `4px solid ${GREEN}`, fontFamily: inter, fontWeight: 800, fontSize: 54, color: "#fff", boxSizing: "border-box", boxShadow: fr >= dElas ? `0 0 60px ${GREEN}` : "none" }}>
                views engajadas <span style={{ float: "right", color: GREEN }}>✓</span>
              </div></In>
            )}
          </div>
          <div style={{ marginTop: 40 }}><Stamp fr={fr} d={dElas} c={GREEN} rot={-6} size={90}>ELAS</Stamp></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 4: Nº 3 a minha conta ----------
const Item3 = ({ fr }) => {
  const d0 = at(75), dV = at(80), dS = at(86), dSo = at(87), dE = at(92);
  const v = count(fr, d0 + 6, dS, 0, 7600), e = count(fr, dSo + 2, dE, 0, 2900);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📊" t="A minha conta" sub="Studio · 28 dias" />
      <div style={{ ...center, top: 480 }}>
        <In fr={fr} d={d0 + 3}>
          <div style={{ width: 960, padding: "40px 40px 50px", borderRadius: 34, background: WIN, border: `3px solid ${LINE}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.2)}` }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY, marginBottom: 40, display: "flex", alignItems: "center", gap: 20 }}>Shorts · Aprenda YouTube {fr < dS && <Spin fr={fr} c={PINK} />}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
              <div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", marginBottom: 14 }}>Views <span style={{ float: "right", fontFamily: MONO, color: "#fff" }}>{fmt(v)}</span></div>
                <Bar label="" lw={0} w={860} h={80} v={v / 7600} c={`linear-gradient(90deg, ${VIOLET}, ${PINK})`} />
              </div>
              <div style={{ opacity: fr >= dSo ? 1 : 0.25 }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREEN, marginBottom: 14 }}>Views engajadas <span style={{ float: "right", fontFamily: MONO }}>{fmt(e)}</span></div>
                <Bar label="" lw={0} w={860} h={80} v={e / 7600} c={GREEN} glow />
              </div>
            </div>
          </div>
        </In>
        <div style={{ marginTop: 50, display: "flex", gap: 30, alignItems: "center" }}>
          {fr >= dSo && <Stamp fr={fr} d={dSo} c={AMBER} rot={-5} size={74}>só</Stamp>}
          {fr >= dE && <Stamp fr={fr} d={dE} c={RED} rot={5} size={74}>2,9 mil ficaram</Stamp>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: moldura da conquista pequena ----------
const Moldura = ({ fr }) => {
  const d0 = at(93), dGr = at(98), dMas = at(102), d22 = at(108), d26 = at(113), dIns = at(116), dNoc = at(118);
  const ins = fr >= d26 ? count(fr, d26, d26 + 12, 22, 26) : count(fr, d22, d22 + 10, 0, 22);
  const frac = interpolate(fr, [d22, d22 + 12], [0, 22 / 26], clamp);
  return (
    <AbsoluteFill>
      {fr < dMas + 3 && (
        <div style={{ ...center, top: 380, opacity: 1 - lin(fr, dMas - 1, dMas + 3) }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 70 }}>
            <In fr={fr} d={d0}><div style={{ textAlign: "center" }}><div style={{ fontSize: 110 * (1 - 0.25 * lin(fr, d0, dGr)) }}>🐜</div><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>meu canal</div></div></In>
            <In fr={fr} d={dGr}><div style={{ textAlign: "center" }}><div style={{ fontSize: 330, transform: `rotate(${Math.sin(fr / 6) * 4}deg)` }}>🐘</div><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREY }}>canal grande</div></div></In>
          </div>
          <div style={{ marginTop: 50, fontFamily: lora, fontStyle: "italic", fontSize: 64, color: BODY, opacity: lin(fr, at(95), at(96)) }}>“não é grande coisa”</div>
          <div style={{ marginTop: 30, fontSize: 80, transform: `translateX(${Math.sin(fr / 4) * 140}px)` }}>🔍</div>
        </div>
      )}
      {fr >= dMas && (
        <div style={{ ...center, top: 330 }}>
          <In fr={fr} d={dMas}><Pill c={PINK} bg={PINKA(0.15)} size={46}>inscritos novos · 28 dias</Pill></In>
          <div style={{ marginTop: 40, width: 560, height: 560, borderRadius: 280, position: "relative", background: `conic-gradient(${PINK} 0 ${frac * 360}deg, rgba(255,255,255,0.08) ${frac * 360}deg 360deg)`, boxShadow: `0 0 80px ${PINKA(0.35)}`, transform: `scale(${0.8 + 0.2 * pop(fr, dMas, 12)})` }}>
            {fr < d22 + 10 && Array.from({ length: 6 }, (_, k) => { const ang = (k / 6) * Math.PI * 2 + (fr - dMas) / 9; const rr = 330 * (1 - ease(lin(fr, d22 - 2, d22 + 10))); return <div key={k} style={{ position: "absolute", left: 280 + Math.cos(ang) * rr - 34, top: 280 + Math.sin(ang) * rr - 34, width: 68, height: 68, borderRadius: 18, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#fff", opacity: Math.min(1, pop(fr, dMas + 4 + k * 3, 12)), zIndex: 3 }}>▶</div>; })}
            <div style={{ position: "absolute", inset: 70, borderRadius: 220, background: "#120a28", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 170, color: "#fff", lineHeight: 1 }}>+{ins}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: fr >= dIns ? "#fff" : GREY }}>{fr >= d26 ? "no total" : "dos Shorts"}</div>
            </div>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 24, alignItems: "center" }}>
            {fr >= d22 + 8 && <In fr={fr} d={d22 + 8}><Pill c={PINK} bg={PINKA(0.15)} size={44}>22 vieram dos Shorts</Pill></In>}
          </div>
          <div style={{ marginTop: 30 }}>{fr >= dNoc && <Stamp fr={fr} d={dNoc} c={GREEN} rot={-5} size={64}>+225% vs. 28 dias antes</Stamp>}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 6: como conferir ----------
const Como = ({ fr }) => {
  const d0 = at(121), dSt = at(123), dAv = at(126), dCmp = at(129);
  const on = fr >= dAv + 4;
  const cx = interpolate(fr, [d0 + 4, dSt, dAv - 6, dAv], [700, 150, 150, 760], clamp);
  const cy = interpolate(fr, [d0 + 4, dSt, dAv - 6, dAv], [700, 300, 300, 140], clamp);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 160 }}><Pill c={PINK} bg={PINKA(0.15)} size={46}>confere no seu canal</Pill></div>
      <div style={{ ...center, top: 330 }}>
        <In fr={fr} d={d0}>
          <div style={{ position: "relative" }}>
            <Janela title="Studio · Análises" w={960} h={900} glow={on}>
              <div style={{ display: "flex", gap: 26, height: "100%" }}>
                <div style={{ width: 230, display: "flex", flexDirection: "column", gap: 18 }}>
                  {["Painel", "Conteúdo", "Análises", "Comentários"].map((t, k) => (
                    <div key={t} style={{ padding: "16px 18px", borderRadius: 16, fontFamily: inter, fontWeight: 800, fontSize: 32, color: k === 2 && fr >= dSt ? "#fff" : GREY, background: k === 2 && fr >= dSt ? PINKA(0.35) : "transparent" }}>{t}</div>
                  ))}
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, fontFamily: inter, fontWeight: 800, fontSize: 32, color: on ? "#fff" : GREY }}>
                    Modo avançado
                    <div style={{ width: 100, height: 54, borderRadius: 27, background: on ? PINK : "rgba(255,255,255,0.15)", position: "relative" }}>
                      <div style={{ position: "absolute", top: 6, left: 6 + 46 * ease(lin(fr, dAv, dAv + 6)), width: 42, height: 42, borderRadius: 21, background: "#fff" }} />
                    </div>
                  </div>
                  {fr >= dSt && fr < dCmp && (
                    <div style={{ marginTop: 40, display: "flex", gap: 14, alignItems: "flex-end", height: 360 }}>
                      {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ flex: 1, height: `${20 + 70 * Math.abs(Math.sin(k * 1.3 + 1))}%`, borderRadius: 10, background: `linear-gradient(${VIOLET}, ${PINK})`, transform: `scaleY(${lin(fr, dSt + k, dSt + k + 8)})`, transformOrigin: "bottom" }} />)}
                    </div>
                  )}
                  {fr >= dCmp && (
                    <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 26 }}>
                      <In fr={fr} d={dCmp}><div style={{ display: "flex", justifyContent: "space-between", padding: "26px 28px", borderRadius: 20, background: "rgba(255,255,255,0.06)", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}><span>Views</span><span style={{ fontFamily: MONO }}>7,6 mil</span></div></In>
                      <In fr={fr} d={dCmp + 5}><div style={{ display: "flex", justifyContent: "space-between", padding: "26px 28px", borderRadius: 20, background: "rgba(52,211,153,0.14)", border: `3px solid ${GREEN}`, fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREEN }}><span>Views engajadas</span><span style={{ fontFamily: MONO }}>2,9 mil</span></div></In>
                      <In fr={fr} d={at(131)}><div style={{ textAlign: "center", fontFamily: lora, fontStyle: "italic", fontSize: 48, color: "#fff", marginTop: 10 }}>compara as duas ⇅</div></In>
                    </div>
                  )}
                </div>
              </div>
            </Janela>
            <Cursor x={cx} y={cy} fr={fr} click={fr < dAv - 3 ? dSt : dAv} s={2} />
          </div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(132), dQ = at(134), dF = at(137), dSeg = at(140), dCob = at(142);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 50, color: "#fff", whiteSpace: "nowrap" }}>{typed("das minhas, ficaram ___", fr, dQ - 4, dF + 4)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 50 }}>{fr >= dF && <Stamp fr={fr} d={dF} c={AMBER} rot={-5} size={80}>quantas ficaram?</Stamp>}</div>
        <div style={{ marginTop: 50, fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "24px 54px", borderRadius: 50, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, at(138), at(139)) }}>{fr >= dSeg + 2 ? "✓ Inscrito" : "Inscrever-se"}</div>
        <div style={{ marginTop: 40 }}>{fr >= dCob && <In fr={fr} d={dCob}><Pill c={GREEN} size={50}>🧪 próxima cobaia</Pill></In>}</div>
        {fr >= dF && Array.from({ length: 10 }, (_, k) => { const t0 = dF + k * 7; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 300 * Math.sin(k * 2.1), top: 560 - t * 420, fontSize: 64, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "❤️" : "👍"}</div>; })}
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

const KEY = new Set(["views", "assistiu", "mito", "3", "studio", "nao", "doi", "2025", "youtube", "comeca", "sem", "minimo", "contou", "engajadas", "ficou", "dinheiro", "parcerias", "elas", "minha", "7600", "2900", "so", "22", "26", "inscritos", "nocao", "avancado", "compara", "comenta", "ficaram", "segue", "cobaia"]);
// números falados por extenso viram dígitos na legenda
const FRASES = [
  [["sete", "mil", "e", "seiscentas"], "7.600"],
  [["duas", "mil", "e", "novecentas"], "2.900"],
  [["dois", "mil", "e", "vinte", "e", "cinco"], "2025"],
  [["vinte", "e", "dois"], "22"],
  [["vinte", "e", "seis"], "26"],
  [["numero", "um"], "Nº 1"], [["numero", "dois"], "Nº 2"], [["numero", "tres"], "Nº 3"],
  [["tres"], "3"],
];
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

export const ShortViewsShorts = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(26), at(48), at(53), at(75), at(93), at(121), at(132), end];
  const scenes = [Hook, Regra, Item1, Item2, Item3, Moldura, Como, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(87)} b={at(93) - 4} pose="triste" top={1250} left />
      <Reacao fr={fr} a={at(138)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.45, 15)}
      {[4, 10, 16, 22].map((o) => S(o, "pop", 0.2, 10))}
      {S(at(5), "error", 0.4, 15)}
      {S(at(8), "whoosh", 0.8, 30)}
      {S(at(9), "pop", 0.35, 15)}
      {S(at(13), "pop", 0.35, 15)}
      {S(at(14), "ding", 0.3, 15)}
      {[at(15), at(16), at(18)].map((b) => S(b, "pop", 0.4, 15))}
      {S(at(21), "error", 0.35, 15)}
      {S(at(25), "error", 0.5, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(34) + 4, "ding", 0.4)}
      {S(at(42) + 2, "coin", 0.35, 15)}
      {S(at(47) + 2, "error", 0.35, 15)}
      {S(at(52), "ding", 0.4)}
      {S(at(59), "pop", 0.3, 15)}
      {S(at(64), "coin", 0.4, 15)}
      {S(at(74), "ding", 0.45)}
      {S(at(80), "riser", 0.3, 30)}
      {S(at(87), "error", 0.35, 15)}
      {S(at(92), "pop", 0.4, 15)}
      {S(at(98), "pop", 0.35, 15)}
      {S(at(108), "riser", 0.3, 30)}
      {S(at(113), "ding", 0.4)}
      {S(at(118), "coin", 0.4, 15)}
      {S(at(123), "pop", 0.35, 15)}
      {S(at(126), "ding", 0.35)}
      {S(at(129), "pop", 0.3, 15)}
      {S(at(137), "pop", 0.4, 15)}
      {S(at(140) + 2, "ding", 0.45)}
      {S(at(142), "pop", 0.4, 15)}
    </AbsoluteFill>
  );
};

export const CapaViewsShorts = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>7.600 views…</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 116, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>quem assistiu?</div>
    </div>
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ width: 900, padding: "40px", borderRadius: 34, background: WIN, border: `3px solid ${LINE}`, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 34 }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>Views <span style={{ float: "right", fontFamily: MONO }}>7,6 mil</span></div>
        <Bar label="" lw={0} w={820} h={70} v={1} c={`linear-gradient(90deg, ${VIOLET}, ${PINK})`} />
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: GREEN }}>Engajadas <span style={{ float: "right", fontFamily: MONO }}>2,9 mil</span></div>
        <Bar label="" lw={0} w={820} h={70} v={2900 / 7600} c={GREEN} glow />
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff" }}>Mito <span style={{ color: RED }}>vs.</span> Realidade</div>
    </div>
  </AbsoluteFill>
);
