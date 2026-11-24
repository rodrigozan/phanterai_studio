import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 24/11/2026 17:00 — Mito vs. Realidade: "A capa mais clicada pode perder o teste A/B".
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 24/11/2026):
// - support.google.com/youtube/answer/13861714 (en e pt-BR): "test and compare up to 3 different titles and thumbnails";
//   "the ... combination of title and thumbnail with the highest watch time will be shown to all viewers";
//   "we optimize tests for overall watch time over other metrics, like click-through-rate";
//   títulos e capas boas ajudam o espectador a "not waste their time clicking on the wrong videos";
//   "Desktop only ... YouTube Studio"; "Na caixa Título ou em Miniatura, clique em Teste A/B";
//   "Your test should be completed within two weeks"; "You are not able to A/B test Shorts";
//   "If a video's title or thumbnail is changed during the test, the test will automatically stop";
//   "we recommend testing older videos first".
// Tudo é interface recriada em motion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
// As barras de cliques/tempo são ilustração do critério (sem números), não dado de canal.
export const STA_SLUG = "phanterai/episodes/shorts-reels-tiktok/yt-short-2026-11-24-1700-teste-ab-capa";
export const STA_FPS = 30;
const MUSIC = "phanterai/music/Coding_at_Night.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = STA_FPS;
const f = (p) => staticFile(`${STA_SLUG}/${p}`);
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

export const calculateTesteABMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças ----------
// capa genérica 16:9 desenhada em código (sem imagem): letra + formas
const HUES = { A: 300, B: 200, C: 30 };
const Miniatura = ({ k = "A", w = 400, fr = 0, dim, glow, c }) => {
  const h = (w * 9) / 16, hue = HUES[k];
  return (
    <div style={{ width: w, height: h, borderRadius: 22, overflow: "hidden", position: "relative", border: `4px solid ${c || (glow ? PINK : "rgba(255,255,255,0.18)")}`, boxShadow: glow ? `0 0 60px ${c || PINK}` : "0 20px 50px rgba(0,0,0,0.5)", opacity: dim ? 0.45 : 1,
      background: `linear-gradient(135deg, hsl(${hue},75%,45%), hsl(${(hue + 50) % 360},70%,20%))` }}>
      <div style={{ position: "absolute", right: w * 0.08, top: h * 0.18, width: h * 0.62, height: h * 0.62, borderRadius: "50%", background: `hsla(${(hue + 180) % 360},90%,70%,0.85)`, transform: `scale(${1 + 0.04 * Math.sin(fr / 6)})` }} />
      <div style={{ position: "absolute", left: w * 0.07, top: h * 0.2, width: w * 0.42, height: h * 0.13, borderRadius: 8, background: "rgba(255,255,255,0.92)" }} />
      <div style={{ position: "absolute", left: w * 0.07, top: h * 0.4, width: w * 0.3, height: h * 0.13, borderRadius: 8, background: "rgba(255,255,255,0.6)" }} />
      <div style={{ position: "absolute", left: w * 0.06, bottom: h * 0.06, fontFamily: inter, fontWeight: 800, fontSize: h * 0.32, color: "#fff", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{k}</div>
    </div>
  );
};
const Coroa = ({ fr, d, top = -70 }) => (fr < d ? null : <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontSize: 90, transform: `scale(${pop(fr, d, 8)}) rotate(${Math.sin(fr / 6) * 6}deg)`, zIndex: 4 }}>👑</div>);

// ---------- 0: gancho (0 -> "Mito") ----------
const Hook = ({ fr }) => {
  const dPerd = at(6), dTeste = at(8), dCli = at(4);
  const big = fr < dPerd ? "clique!" : "PERDEU!";
  const flash = [0, dCli, dPerd, dTeste].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  // cliques chegando em A desde o quadro 0
  const clicks = [0, 6, 12, 17, 22, 28, 34, 40, 46, 52];
  const ca = clicks.filter((c) => fr >= c).length;
  const vA = Math.min(1, 0.25 + 0.075 * ca), vB = Math.min(0.62, 0.15 + 0.04 * ca);
  const tB = lin(fr, dPerd, dTeste + 6), tA = lin(fr, dPerd, dTeste + 6) * 0.35;
  const after = fr >= dPerd;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: after ? `rgba(255,92,122,${Math.min(0.45, flash)})` : PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={fr < dPerd ? 0 : dPerd} size={fr < dPerd ? 150 : 160} top={150} rot={fr < dPerd ? -2 : 2} bg={fr < dPerd ? PINK : RED}>{big}</Big>
      <div style={{ ...center, top: 430, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)})` }}>
        <div style={{ display: "flex", gap: 40 }}>
          {["A", "B"].map((k) => {
            const win = k === "B" && fr >= dTeste, lose = k === "A" && after;
            return (
              <div key={k} style={{ position: "relative", transform: `translateX(${k === "A" ? shake(fr, dPerd, 20) : 0}px) scale(${win ? 1 + 0.06 * pop(fr, dTeste, 8) : k === "A" && fr >= dCli && !after ? 1.1 - 0.06 * pop(fr, dCli, 8) : 1})` }}>
                <Coroa fr={fr} d={k === "B" ? dTeste : 1e9} />
                <Miniatura k={k} w={460} fr={fr} glow={win} c={win ? GREEN : lose ? RED : undefined} dim={lose && fr > dTeste} />
                {k === "A" && !after && clicks.map((c) => (fr >= c && fr < c + 12 ? <div key={c} style={{ position: "absolute", left: 140 + (c * 37) % 200, top: 60 + (c * 23) % 140, fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", opacity: 1 - (fr - c) / 12, transform: `translateY(${-(fr - c) * 4}px)` }}>👆</div> : null))}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 50, width: 960, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: after ? GREY : "#fff", textDecoration: fr >= dTeste ? "line-through" : "none" }}>👆 cliques</div>
          <div style={{ display: "flex", gap: 40 }}>
            <Bar w={460} v={vA} c={after ? GREY : PINK} glow={!after} />
            <Bar w={460} v={vB} c={GREY} />
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: after ? GREEN : GREY, opacity: 0.3 + 0.7 * lin(fr, dPerd - 3, dPerd + 3) }}>⏱ tempo assistindo</div>
          <div style={{ display: "flex", gap: 40 }}>
            <Bar w={460} v={0.1 + tA} c={RED} />
            <Bar w={460} v={0.1 + 0.8 * tB} c={GREEN} glow={fr >= dTeste} />
          </div>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 30 }}>
          {fr >= dCli && fr < dTeste && <Stamp fr={fr} d={dCli} c={PINK} rot={-5} size={72}>👆 A lidera</Stamp>}
          {fr >= dTeste && <Stamp fr={fr} d={dTeste} c={GREEN} rot={-5} size={72}>B venceu</Stamp>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: o mito (Mito ... surpreende) ----------
const Mito = ({ fr }) => {
  const d0 = at(9), dTA = at(10), dVence = at(11), dTres = at(19), dNao = at(25), dTer = at(28), dSur = at(29);
  const mito = "teste A/B: vence a mais clicada";
  return (
    <AbsoluteFill>
      <Big fr={fr} d={fr < dNao ? d0 : dNao} size={fr < dNao ? 160 : 150} top={150} rot={fr < dNao ? -2 : 2} bg={fr < dNao ? AMBER : RED}>{fr < dNao ? "Mito?" : "não!"}</Big>
      <div style={{ ...center, top: 440 }}>
        <In fr={fr} d={dTA}><Pill c={PINK} bg={PINKA(0.15)} size={50}>3 regras · a 3ª surpreende 👀</Pill></In>
        <div style={{ marginTop: 40, position: "relative", width: 940, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dNao ? RED : LINE}`, boxSizing: "border-box", opacity: fr >= d0 + 3 ? 1 : 0 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: "#fff", whiteSpace: "nowrap" }}>“{typed(mito, fr, dVence - 3, at(18) + 6)}{fr < dTres ? blink(fr) : "”"}</div>
          {fr >= dNao && <div style={{ position: "absolute", left: 24, top: "50%", height: 9, borderRadius: 5, background: RED, width: `${92 * lin(fr, dNao, dNao + 6)}%` }} />}
        </div>
        <div style={{ marginTop: 50, display: "flex", gap: 34 }}>
          {[0, 1, 2].map((k) => {
            const d = [dTres, at(20), at(22)][k];
            const hot = k === 2 && fr >= dTer;
            if (fr < d) return <div key={k} style={{ width: 260 }} />;
            const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
            return (
              <div key={k} style={{ width: 260, height: 340, borderRadius: 36, background: hot ? PINKA(0.25) : WIN, border: `4px solid ${hot ? PINK : VIOLET}`, transform: `perspective(800px) rotateY(${flip}deg) translateY(${hot ? Math.sin(fr / 3) * 8 : 0}px) scale(${hot ? 1.08 : 1})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: `0 0 50px ${hot ? PINKA(0.6) : "rgba(180,140,255,0.2)"}` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 140, color: "#fff" }}>{hot ? "?" : k + 1}</span>
                <span style={{ fontFamily: MONO, fontSize: 36, color: hot ? "#fff" : GREY }}>{hot ? "nº 3" : "regra"}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 40 }}>{fr >= dSur && <Stamp fr={fr} d={dSur} c={PINK} rot={-6} size={74}>a 3ª surpreende</Stamp>}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: até 3 títulos e capas (Você ... vídeo) ----------
const Tres = ({ fr }) => {
  const d0 = at(30), dTr = at(34), dTit = at(35), dCap = at(37), dMes = at(39);
  const n = fr >= at(36) ? 3 : fr >= dTit ? 2 : fr >= dTr ? 1 : 0;
  const TIT = ["Título A", "Título B", "Título C"];
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 160 }}><Pill c={PINK} bg={PINKA(0.15)} size={46}>até 3 opções · {n}/3</Pill></div>
      <div style={{ ...center, top: 320 }}>
        <In fr={fr} d={d0}>
          <Janela title="Studio · Teste A/B" w={960} h={960} glow={fr >= dMes}>
            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              {["A", "B", "C"].map((k, i) => {
                const d = [dTr, dTit, at(36)][i];
                const cap = fr >= dCap + i * 3;
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 26, padding: 18, borderRadius: 24, background: fr >= d ? "rgba(255,255,255,0.06)" : "transparent", border: `2px dashed ${fr >= d ? PINKA(0.6) : "rgba(255,255,255,0.12)"}`, opacity: fr >= d - 6 ? 1 : 0.35, transform: `translateX(${fr >= d ? 0 : 0}px) scale(${fr >= d ? 0.92 + 0.08 * pop(fr, d, 10) : 0.92})` }}>
                    <div style={{ width: 340, height: 191, borderRadius: 22, border: `3px dashed ${GREY}`, position: "relative", overflow: "hidden" }}>
                      {cap && <div style={{ position: "absolute", inset: -4, transform: `scale(${pop(fr, dCap + i * 3, 10)})` }}><Miniatura k={k} w={340} fr={fr} /></div>}
                      {!cap && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, color: GREY }}>＋</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#fff" }}>{fr >= d ? typed(TIT[i], fr, d, d + 10) : ""}{fr >= d && fr < d + 12 ? blink(fr) : ""}</div>
                      <div style={{ marginTop: 14, fontFamily: inter, fontWeight: 800, fontSize: 30, color: cap ? GREEN : GREY }}>{cap ? "✓ capa + título" : "aguardando…"}</div>
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 6, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: fr >= dMes ? "#fff" : GREY }}>
                ▶ {fr >= dMes ? <span style={{ color: PINK }}>no mesmo vídeo</span> : "1 vídeo"}
              </div>
            </div>
          </Janela>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: Nº 1 tempo de exibição (Número um ... clique) ----------
const Item1 = ({ fr }) => {
  const d0 = at(41), dTempo = at(47), dExib = at(49), dNao = at(50), dCli = at(53);
  const mode = fr >= dTempo ? 1 : 0;
  const t = lin(fr, dTempo, dExib + 10);
  const vals = { A: interpolate(t, [0, 1], [0.92, 0.3]), B: interpolate(t, [0, 1], [0.6, 0.95]), C: interpolate(t, [0, 1], [0.45, 0.5]) };
  const pre = lin(fr, d0 + 4, d0 + 16);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="⏱" t="Tempo de exibição" sub="é ele que decide" />
      <div style={{ ...center, top: 470 }}>
        <In fr={fr} d={d0 + 3}>
          <div style={{ width: 960, padding: "34px 40px 40px", borderRadius: 34, background: WIN, border: `3px solid ${mode ? GREEN : LINE}`, boxSizing: "border-box", boxShadow: `0 0 60px ${mode ? "rgba(52,211,153,0.3)" : PINKA(0.2)}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", marginBottom: 34 }}>
              <span style={{ color: mode ? GREY : PINK, textDecoration: mode ? "line-through" : "none" }}>Cliques</span>
              <div style={{ width: 110, height: 58, borderRadius: 29, background: mode ? GREEN : "rgba(255,255,255,0.15)", position: "relative" }}>
                <div style={{ position: "absolute", top: 7, left: 7 + 52 * ease(lin(fr, dTempo, dTempo + 6)), width: 44, height: 44, borderRadius: 22, background: "#fff" }} />
              </div>
              <span style={{ color: mode ? GREEN : GREY }}>Tempo de exibição</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {["A", "B", "C"].map((k) => {
                const win = k === "B" && fr >= dExib;
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 26, position: "relative" }}>
                    <Miniatura k={k} w={200} fr={fr} glow={win} c={win ? GREEN : undefined} />
                    <Bar w={600} h={64} v={vals[k] * pre} c={mode ? (win ? GREEN : `linear-gradient(90deg, ${VIOLET}, ${CYAN})`) : `linear-gradient(90deg, ${VIOLET}, ${PINK})`} glow={win} />
                    {win && <div style={{ position: "absolute", right: -10, top: -30, fontSize: 70, transform: `scale(${pop(fr, dExib, 8)})` }}>👑</div>}
                    {mode === 1 && <div style={{ position: "absolute", left: 220 + 600 * vals[k] - 50, top: 6, fontSize: 44, transform: `rotate(${fr * 12}deg)` }}>⏱</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </In>
        <div style={{ marginTop: 44, display: "flex", gap: 24 }}>
          {fr >= dNao && <Stamp fr={fr} d={dNao} c={RED} rot={-5} size={70}>CTR ✗</Stamp>}
          {fr >= dCli && <Stamp fr={fr} d={dCli} c={GREEN} rot={4} size={70}>tempo ✓</Stamp>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: o próprio YouTube explica (O próprio ... errado) ----------
const Explica = ({ fr }) => {
  const d0 = at(54), dExp = at(55), dCapa = at(54) + 4, dB = at(54) + 14, dEv = at(60), dCli = at(64), dErr = at(67);
  const clicked = fr >= dCli;
  const prog = clicked ? lin(fr, dCli + 2, dCli + 40) : 0;
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 160 }}><In fr={fr} d={d0}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={46}>📘 o próprio YouTube explica</Pill></In></div>
      <div style={{ ...center, top: 320 }}>
        <In fr={fr} d={dExp}>
          <div style={{ width: 940, padding: "26px 34px", borderRadius: 30, background: WIN, border: `3px solid ${LINE}`, boxSizing: "border-box", fontFamily: lora, fontStyle: "italic", fontSize: 46, color: "#fff", lineHeight: 1.25 }}>
            {typed("“capa boa ajuda a pessoa a não clicar no vídeo errado”", fr, dExp, dErr)}
          </div>
        </In>
        <div style={{ marginTop: 50, display: "flex", gap: 40, alignItems: "flex-start" }}>
          <In fr={fr} d={dCapa} dx={-100} dy={0}>
            <div style={{ position: "relative", textAlign: "center" }}>
              <Miniatura k="A" w={420} fr={fr} c={fr >= dErr ? RED : undefined} glow={fr >= dErr} />
              <div style={{ marginTop: 16, fontFamily: inter, fontWeight: 800, fontSize: 38, color: fr >= dEv ? RED : GREY }}>promete outra coisa</div>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}><Bar w={380} h={34} v={clicked ? 0.12 : 0} c={RED} /></div>
              {clicked && <div style={{ marginTop: 16, fontSize: 64, transform: `translateY(${-lin(fr, dCli + 6, dCli + 20) * 30}px)`, opacity: 1 - lin(fr, dCli + 26, dCli + 40) * 0.5 }}>🚪💨</div>}
              <Cursor x={interpolate(fr, [dCapa, dCli], [380, 220], clamp)} y={interpolate(fr, [dCapa, dCli], [300, 110], clamp)} fr={fr} click={dCli} s={1.8} />
            </div>
          </In>
          <In fr={fr} d={dB} dx={100} dy={0}>
            <div style={{ textAlign: "center" }}>
              <Miniatura k="B" w={420} fr={fr} c={fr >= dErr ? GREEN : undefined} glow={fr >= dErr} />
              <div style={{ marginTop: 16, fontFamily: inter, fontWeight: 800, fontSize: 38, color: fr >= dEv ? GREEN : GREY }}>mostra o vídeo</div>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}><Bar w={380} h={34} v={0.15 + 0.8 * prog} c={GREEN} glow /></div>
              {clicked && <div style={{ marginTop: 16, fontSize: 64 }}>🍿</div>}
            </div>
          </In>
        </div>
        <div style={{ marginTop: 30 }}>{fr >= dErr && <Stamp fr={fr} d={dErr} c={RED} rot={-5} size={72}>vídeo errado ✗</Stamp>}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: Nº 2 só no computador (Número dois ... semanas) ----------
const Item2 = ({ fr }) => {
  const d0 = at(68), dSo = at(70), dComp = at(72), dSt = at(74), dTe = at(78), dEsp = at(82), dDuas = at(84);
  const dia = Math.max(1, Math.round(interpolate(fr, [dEsp, dDuas + 8], [1, 14], { ...clamp, easing: ease })));
  const cx = interpolate(fr, [dSt, dTe - 2], [820, 690], clamp), cy = interpolate(fr, [dSt, dTe - 2], [700, 196], clamp);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="💻" t="Só no computador" sub="YouTube Studio" />
      {fr < dSt + 2 && (
        <div style={{ ...center, top: 500, opacity: 1 - lin(fr, dSt - 2, dSt + 2) }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 70 }}>
            <In fr={fr} d={dSo} dx={-80} dy={0}>
              <div style={{ position: "relative", width: 230, height: 420, borderRadius: 40, background: "#07040f", border: "6px solid #3a2f66", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${shake(fr, dComp, 14)}px)` }}>
                <span style={{ fontSize: 120, opacity: fr >= dComp ? 1 : 0.4 }}>🚫</span>
              </div>
              <div style={{ textAlign: "center", marginTop: 14, fontFamily: inter, fontWeight: 800, fontSize: 38, color: RED }}>celular</div>
            </In>
            <In fr={fr} d={dComp} dx={80} dy={0}>
              <div style={{ width: 560, height: 340, borderRadius: 24, background: WIN, border: `6px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 70px rgba(52,211,153,0.4)" }}>
                <span style={{ fontSize: 130, transform: `scale(${pop(fr, dComp + 2, 8)})` }}>✅</span>
              </div>
              <div style={{ width: 660, height: 30, marginLeft: -50, borderRadius: "0 0 30px 30px", background: "#3a2f66" }} />
              <div style={{ textAlign: "center", marginTop: 14, fontFamily: inter, fontWeight: 800, fontSize: 38, color: GREEN }}>computador</div>
            </In>
          </div>
        </div>
      )}
      {fr >= dSt && (
        <div style={{ ...center, top: 450 }}>
          <In fr={fr} d={dSt}>
            <div style={{ position: "relative" }}>
              <Janela title="Studio · Detalhes do vídeo" w={960} h={700} glow={fr >= dTe}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY }}>Título</div>
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1, padding: "18px 22px", borderRadius: 16, border: `2px solid ${LINE}`, fontFamily: MONO, fontSize: 34, color: "#fff" }}>Meu vídeo antigo</div>
                  <div style={{ padding: "18px 24px", borderRadius: 16, background: fr >= dTe ? PINK : "rgba(255,255,255,0.1)", fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", transform: `scale(${fr >= dTe ? 0.9 + 0.1 * pop(fr, dTe, 8) : 1})` }}>🧪 Teste A/B</div>
                </div>
                {fr >= dTe + 4 && fr < dEsp && (
                  <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 18 }}>
                    {["Somente título", "Somente miniatura", "Título e miniatura"].map((o, i) => (
                      <In key={o} fr={fr} d={dTe + 4 + i * 4}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px", borderRadius: 18, background: i === 2 && fr >= dTe + 20 ? PINKA(0.3) : "rgba(255,255,255,0.05)", fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>
                          <div style={{ width: 34, height: 34, borderRadius: 17, border: `4px solid ${PINK}`, background: i === 2 && fr >= dTe + 20 ? PINK : "transparent" }} />{o}
                        </div>
                      </In>
                    ))}
                  </div>
                )}
                {fr >= dEsp && (
                  <div style={{ marginTop: 40 }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", display: "flex", justifyContent: "space-between" }}><span>Teste em andamento</span><span style={{ fontFamily: MONO, color: AMBER }}>dia {dia}</span></div>
                    <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 14 }}>
                      {Array.from({ length: 14 }, (_, k) => <div key={k} style={{ height: 90, borderRadius: 16, background: k < dia ? `linear-gradient(${VIOLET}, ${PINK})` : "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#fff", transform: `scale(${k === dia - 1 ? 1.08 : 1})` }}>{k + 1}</div>)}
                    </div>
                  </div>
                )}
              </Janela>
              {fr < dEsp && <Cursor x={cx} y={cy} fr={fr} click={dTe} s={2} />}
            </div>
          </In>
          <div style={{ marginTop: 36 }}>{fr >= dDuas && <Stamp fr={fr} d={dDuas} c={AMBER} rot={-5} size={74}>até 2 semanas</Stamp>}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 6: Nº 3 Shorts não entram (Número três ... testar) ----------
const Item3 = ({ fr }) => {
  const d0 = at(86), dSh = at(86) + 6, dNao = at(89), dIsso = at(91), dEste = at(93), dTest = at(99);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📱" t="Shorts não entram" sub="só vídeo longo" />
      <div style={{ ...center, top: 470 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
          <In fr={fr} d={dSh} dx={-90} dy={0}>
            <div style={{ position: "relative", width: 360, height: 640, borderRadius: 50, background: "#07040f", border: `6px solid ${fr >= dNao ? RED : "#3a2f66"}`, overflow: "hidden", transform: `translateX(${shake(fr, dNao, 18)}px)`, boxShadow: fr >= dNao ? "0 0 60px rgba(255,92,122,0.4)" : "none" }}>
              <div style={{ position: "absolute", inset: 12, borderRadius: 40, background: `linear-gradient(160deg, hsl(${290 + (fr % 60)},70%,38%), hsl(220,70%,18%))` }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontSize: 110, color: "#fff", opacity: 0.85 }}>▶</div>
              <div style={{ position: "absolute", left: 30, right: 30, bottom: 50, padding: "16px 0", borderRadius: 18, background: "rgba(255,255,255,0.12)", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 32, color: fr >= dNao ? RED : "#fff" }}>{fr >= dNao ? "🔒 Teste A/B" : "🧪 Teste A/B"}</div>
            </div>
            <div style={{ textAlign: "center", marginTop: 14, fontFamily: inter, fontWeight: 800, fontSize: 38, color: RED }}>Short</div>
          </In>
          <In fr={fr} d={dNao + 4} dx={90} dy={0}>
            <div style={{ textAlign: "center" }}>
              <Miniatura k="B" w={420} fr={fr} c={GREEN} glow />
              <div style={{ marginTop: 14, fontFamily: inter, fontWeight: 800, fontSize: 38, color: GREEN }}>vídeo longo ✓</div>
            </div>
          </In>
        </div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          {fr >= dIsso && <Stamp fr={fr} d={dIsso} c={RED} rot={-4} size={72}>nem este aqui</Stamp>}
          {fr >= dEste && <div style={{ fontSize: 90, marginRight: 260, transform: `translateY(${Math.abs(Math.sin(fr / 4)) * 24}px)` }}>👇</div>}
          {fr >= dTest && <In fr={fr} d={dTest}><Pill c={RED} bg="rgba(255,92,122,0.15)" size={44}>Shorts: sem teste A/B</Pill></In>}
        </div>
      </div>
      {fr >= dEste && <div style={{ position: "absolute", inset: 18, borderRadius: 40, border: `8px dashed ${PINKA(0.4 + 0.4 * Math.abs(Math.sin(fr / 5)))}`, zIndex: 3 }} />}
    </AbsoluteFill>
  );
};

// ---------- 7: não mexe durante o teste (E não mexe ... sozinho) ----------
const Aviso = ({ fr }) => {
  const d0 = at(100), dMexe = at(102), dTit = at(104), dTeste = at(107), dPara = at(109), dSoz = at(110);
  const stopped = fr >= dPara;
  const prog = stopped ? 0.46 : 0.2 + 0.26 * lin(fr, d0, dPara);
  const old = "Meu vídeo antigo", neu = "Meu vídeo NOVO";
  const del = Math.round(old.length * (1 - lin(fr, dMexe, dTit + 4)) );
  const txt = fr < dTit + 4 ? old.slice(0, Math.max(10, del)) : old.slice(0, 10) + typed(neu.slice(10), fr, dTit + 4, dTeste);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 160 }}><In fr={fr} d={d0}><Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={46}>⚠️ durante o teste</Pill></In></div>
      <div style={{ ...center, top: 330 }}>
        <In fr={fr} d={d0 + 2}>
          <Janela title="Studio · Detalhes do vídeo" w={960} h={720} glow={!stopped} style={{ border: `3px solid ${stopped ? RED : PINK}` }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY }}>Título</div>
            <div style={{ marginTop: 10, padding: "18px 22px", borderRadius: 16, border: `3px solid ${fr >= dMexe ? AMBER : LINE}`, fontFamily: MONO, fontSize: 38, color: "#fff" }}>{txt}{fr >= dMexe && fr < dTeste + 6 ? blink(fr) : ""}</div>
            <div style={{ marginTop: 50, fontFamily: inter, fontWeight: 800, fontSize: 36, color: stopped ? RED : "#fff", display: "flex", alignItems: "center", gap: 18 }}>
              {stopped ? "⛔ Teste interrompido" : "🧪 Teste A/B em andamento"}
            </div>
            <div style={{ marginTop: 22 }}><Bar w={900} h={56} v={prog} c={stopped ? RED : `linear-gradient(90deg, ${VIOLET}, ${PINK})`} glow /></div>
            <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
              {["A", "B", "C"].map((k) => <div key={k} style={{ filter: stopped ? "grayscale(1)" : "none", transform: `translateY(${stopped ? 0 : Math.sin((fr + k.charCodeAt(0) * 9) / 6) * 6}px)` }}><Miniatura k={k} w={276} fr={fr} dim={stopped} /></div>)}
            </div>
          </Janela>
        </In>
        <div style={{ marginTop: 40, display: "flex", gap: 24 }}>
          {fr >= dPara && <Stamp fr={fr} d={dPara} c={RED} rot={-5} size={80}>PAROU</Stamp>}
          {fr >= dSoz && <Stamp fr={fr} d={dSoz} c={AMBER} rot={4} size={64}>recomeça do zero</Stamp>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(111), dT = at(112), dAnt = at(118), dSeg = at(121), dCob = at(124);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff", whiteSpace: "nowrap" }}>{typed("TESTE 🧪", fr, dT - 2, dT + 10)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 50 }}>{fr >= dAnt && <Stamp fr={fr} d={dAnt} c={AMBER} rot={-5} size={74}>comece por um antigo</Stamp>}</div>
        <div style={{ marginTop: 50, fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "24px 54px", borderRadius: 50, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, at(119), at(120)) }}>{fr >= dSeg + 2 ? "✓ Inscrito" : "Inscrever-se"}</div>
        <div style={{ marginTop: 40 }}>{fr >= dCob && <In fr={fr} d={dCob}><Pill c={GREEN} size={50}>🧪 próxima cobaia</Pill></In>}</div>
        {fr >= dT + 6 && Array.from({ length: 12 }, (_, k) => { const t0 = dT + 6 + k * 8; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 320 * Math.sin(k * 2.1), top: 1000 - t * 380, fontSize: 64, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "💬" : "👍"}</div>; })}
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

const KEY = new Set(["clique", "perdeu", "mito", "clicada", "youtube", "nao", "surpreende", "3", "titulos", "capas", "tempo", "exibicao", "explica", "errado", "computador", "studio", "shorts", "entram", "short", "titulo", "sozinho", "comenta", "teste", "antigo", "cobaia"]);
// números e siglas faladas viram forma escrita na legenda
const FRASES = [
  [["teste", "a", "b"], "teste A/B"],
  [["duas", "semanas"], "2 semanas"],
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

export const ShortTesteAB = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(9), at(30), at(41), at(54), at(68), at(86), at(100), at(111), end];
  const scenes = [Hook, Mito, Tres, Item1, Explica, Item2, Item3, Aviso, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(9)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(91)} b={at(100) - 4} pose="apontando" top={1300} />
      <Reacao fr={fr} a={at(119)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.45, 15)}
      {S(at(4), "pop", 0.5, 15)}
      {S(at(10), "ding", 0.35)}
      {[6, 17, 28, 40, 52].map((o) => S(o, "pop", 0.18, 10))}
      {S(at(6), "error", 0.5, 15)}
      {S(at(8), "ding", 0.45)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(11), "pop", 0.35, 15)}
      {[at(19), at(20), at(22)].map((b) => S(b, "pop", 0.4, 15))}
      {S(at(25), "error", 0.4, 15)}
      {S(at(29), "riser", 0.3, 30)}
      {[at(34), at(35), at(36)].map((b) => S(b, "pop", 0.35, 15))}
      {S(at(39), "ding", 0.35)}
      {S(at(47), "whoosh", 0.4, 30)}
      {S(at(49), "ding", 0.45)}
      {S(at(50), "error", 0.35, 15)}
      {S(at(64), "pop", 0.35, 15)}
      {S(at(67), "error", 0.35, 15)}
      {S(at(72), "ding", 0.4)}
      {S(at(78), "pop", 0.4, 15)}
      {S(at(84), "coin", 0.35, 15)}
      {S(at(89), "error", 0.45, 15)}
      {S(at(93), "pop", 0.35, 15)}
      {S(at(104), "pop", 0.3, 15)}
      {S(at(109), "error", 0.5, 15)}
      {S(at(112), "pop", 0.4, 15)}
      {S(at(121) + 2, "ding", 0.45)}
      {S(at(124), "pop", 0.4, 15)}
    </AbsoluteFill>
  );
};

export const CapaTesteAB = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Mais clique…</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 124, color: "#fff", background: RED, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>e perdeu?</div>
    </div>
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
      <div style={{ display: "flex", gap: 36 }}>
        <div style={{ position: "relative" }}><Miniatura k="A" w={440} fr={40} c={RED} dim /><div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 140, color: RED, fontFamily: inter, fontWeight: 800 }}>✗</div></div>
        <div style={{ position: "relative" }}><Coroa fr={99} d={0} top={-80} /><Miniatura k="B" w={440} fr={40} c={GREEN} glow /></div>
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        <Pill c={GREY} bg="rgba(255,255,255,0.06)" size={46} style={{ textDecoration: "line-through" }}>👆 cliques</Pill>
        <Pill c={GREEN} size={46}>⏱ tempo ✓</Pill>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff" }}>Mito <span style={{ color: RED }}>vs.</span> Realidade</div>
    </div>
  </AbsoluteFill>
);
