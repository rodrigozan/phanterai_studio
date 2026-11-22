import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 22/11/2026 07:00 — "Seedance 2.5 agora gera em 4K".
// Fatos conferidos nas fontes primárias (texto capturado em fontes/ em 22/11/2026):
// - seed.bytedance.com/en/blog/...introducing-seedance-2-5 (31/07/2026): 30 s por geração, várias rodadas de extensão,
//   até 30 imagens + 10 vídeos + 10 áudios de referência num pedido.
// - seed.bytedance.com/en/seedance2_5: "up to 30 seconds in a single generation, with the option to extend twice".
// - dreamina.capcut.com/seedance/seedance-2-5: "Explore Seedance 2.5 4K video creation—now live worldwide on Dreamina!"
// - docs.byteplus.com/en/docs/ModelArk/1544106 (preços ModelArk, entrada sem vídeo, 16:9, 5 s):
//   Seedance 2.5 480p US$0,103/s · 720p US$0,231/s · 1080p US$0,569/s · 4K US$0,914/s (US$4,568 o vídeo de 5 s);
//   "Draft videos at a fixed 480p resolution", mesmo preço do 480p; "only charged for successfully generated videos";
//   a versão Flash não suporta 1080p nem 4K.
// Tudo é interface recriada em motion no Remotion (genérica, estilo PhanterAI): nenhum print, nada gerado por IA,
// nenhum logo oficial.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SSD_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-22-0700-seedance-2-5-4k";
export const SSD_FPS = 30;
const FPS = SSD_FPS;
const f = (p) => staticFile(`${SSD_SLUG}/${p}`);
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
const MUSIC = "phanterai/music/CuriousFocus.mp3";
const TAIL = 0.9;

export const calculateSeedance25Metadata = async () => {
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
const usd = (v) => "US$ " + v.toFixed(2).replace(".", ",");
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
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${glow ? PINK : "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(glow ? 0.45 : 0.18)}`, overflow: "hidden", position: "relative", ...style }}>
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

// Quadro de vídeo genérico (claquete + cena desenhada em formas), não é imagem gerada.
const Clip = ({ fr, w = 820, h = 461, res = "4K", glow, children, k = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: 26, position: "relative", overflow: "hidden", border: `4px solid ${glow ? PINK : "rgba(190,160,255,0.35)"}`, boxShadow: glow ? `0 0 80px ${PINKA(0.5)}` : "0 20px 60px rgba(0,0,0,0.5)",
    background: `linear-gradient(${160 + Math.sin(fr / 30 + k) * 20}deg, #3b1d6e 0%, #8a2d8f 45%, #f0a050 100%)` }}>
    {/* sol + morros */}
    <div style={{ position: "absolute", left: w * 0.62 + Math.sin(fr / 25) * 20, top: h * 0.18, width: h * 0.28, height: h * 0.28, borderRadius: "50%", background: "#ffd27a", boxShadow: "0 0 60px #ffd27a" }} />
    <div style={{ position: "absolute", left: -w * 0.1, right: -w * 0.1, bottom: -h * 0.35, height: h * 0.75, borderRadius: "50%", background: "#24123f" }} />
    <div style={{ position: "absolute", left: w * 0.35, right: -w * 0.3, bottom: -h * 0.45, height: h * 0.7, borderRadius: "50%", background: "#160a2a" }} />
    <div style={{ position: "absolute", top: 16, left: 16, fontFamily: inter, fontWeight: 800, fontSize: h * 0.08, color: "#fff", background: "rgba(0,0,0,0.45)", borderRadius: 10, padding: "2px 12px" }}>🎬 {res}</div>
    {children}
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const d4k = at(7), dCinco = at(9), dQuatro = at(11), dSeed = at(16), d4kb = at(23), dTres = at(25), dCorta = at(34);
  let big, bigD, size = 150, bg = RED, rot = -3;
  if (fr < d4k) { big = "queimar 💸"; bigD = 0; }
  else if (fr < dQuatro) { big = "4K"; bigD = d4k; size = 210; bg = PINK; rot = 2; }
  else if (fr < dSeed) { big = "US$ 4,57"; bigD = dQuatro; size = 170; bg = RED; rot = -2; }
  else if (fr < dTres) { big = "agora em 4K"; bigD = dSeed; size = 130; bg = PINK; rot = 2; }
  else if (fr < dCorta) { big = "3 coisas"; bigD = dTres; size = 160; bg = PINK; rot = -2; }
  else { big = "o 3º corta ✂️"; bigD = dCorta; size = 130; bg = GREEN; rot = 2; }
  const flash = [d4k, dCinco, dQuatro, dSeed, dTres, dCorta].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  // medidor de gasto subindo desde o quadro 0 até US$ 4,57 no "quatro dólares e meio"
  const spent = interpolate(fr, [0, dQuatro + 8], [0, 4.568], clamp);
  const secs = interpolate(fr, [dCinco, dCinco + 18], [0, 5], clamp);
  const zoom = interpolate(fr, [0, 8], [1.12, 1], clamp);
  const part1 = fr < dSeed;
  const RES = ["480p", "720p", "1080p", "4K"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={210} rot={rot} bg={bg}>{big}</Big>
      {part1 ? (
        <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34, transform: `scale(${zoom}) translateX(${shake(fr, dQuatro, 18)}px)` }}>
          <Clip fr={fr} w={900} h={506} res={fr >= d4k ? "4K" : "…"} glow={fr >= d4k}>
            {/* barra de render */}
            <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 26, borderRadius: 13, background: "rgba(0,0,0,0.5)" }}>
              <div style={{ width: `${(fr < dCinco ? lin(fr, 0, dCinco) * 0.6 : 0.6 + 0.4 * secs / 5) * 100}%`, height: "100%", borderRadius: 13, background: PINK }} />
            </div>
            {fr >= dCinco && <div style={{ position: "absolute", right: 30, bottom: 70, fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#fff", textShadow: "0 4px 20px #000" }}>0:0{Math.floor(secs)}</div>}
            {/* notas queimando */}
            {[0, 1, 2, 3, 4].map((k) => { const q = ((fr + k * 9) % 45) / 45; return <div key={k} style={{ position: "absolute", left: 80 + k * 160, top: 380 - q * 330, fontSize: 64, opacity: 1 - q, transform: `rotate(${(k % 2 ? 1 : -1) * q * 40}deg)` }}>{k % 2 ? "💸" : "🔥"}</div>; })}
          </Clip>
          <div style={{ width: 900, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 40px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dQuatro ? RED : "rgba(190,160,255,0.3)"}`, boxSizing: "border-box", boxShadow: fr >= dQuatro ? `0 0 70px rgba(255,92,122,0.4)` : "none" }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY }}>gasto</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 96, color: fr >= dQuatro ? RED : "#fff" }}>{usd(spent)}</div>
          </div>
          {fr >= at(10) + 6 && <In fr={fr} d={at(10) + 6}><Pill size={46} c="#fff" bg={PINKA(0.85)} style={{ border: `2px solid ${PINK}`, transform: `scale(${1 + 0.04 * Math.sin(fr / 4)})` }}>3 coisas · a nº 3 corta esse custo ✂️</Pill></In>}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
          <In fr={fr} d={dSeed} dy={80}>
            <div style={{ width: 920, borderRadius: 32, background: WIN, border: `3px solid ${PINKA(0.6)}`, padding: "30px 36px", boxSizing: "border-box", transform: `translateY(${bob(fr)}px)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 96, height: 96, borderRadius: 26, background: "linear-gradient(145deg, #2b1d55, #120b26)", border: `3px solid ${PINK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>🎬</div>
                <div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", letterSpacing: -1 }}>Seedance 2.5</div>
                  <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: BODY }}>vídeo com áudio, da ByteDance</div>
                </div>
              </div>
              <div style={{ fontFamily: inter, fontSize: 30, color: GREY, marginTop: 26 }}>Resolução</div>
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                {RES.map((r, k) => {
                  const sel = fr >= d4kb ? k === 3 : k === Math.floor((fr - dSeed) / 5) % 3;
                  return <div key={r} style={{ flex: 1, textAlign: "center", padding: "20px 0", borderRadius: 18, fontFamily: inter, fontWeight: 800, fontSize: 40, color: sel ? "#fff" : GREY, background: sel ? (k === 3 ? PINK : "rgba(255,255,255,0.14)") : "rgba(255,255,255,0.05)", border: `3px solid ${sel ? PINK : "rgba(190,160,255,0.2)"}`, transform: `scale(${k === 3 && fr >= d4kb ? 1 + 0.1 * Math.max(0, 1 - (fr - d4kb) / 8) : 1})` }}>{r}</div>;
                })}
              </div>
            </div>
          </In>
          {fr >= dTres && (
            <div style={{ display: "flex", gap: 24 }}>
              {[["1", "⏱️"], ["2", "🧩"], ["3", "✂️"]].map(([n, ic], k) => {
                const terc = k === 2 && fr >= dCorta;
                return (
                  <In key={k} fr={fr} d={dTres + k * 4} dy={80}>
                    <div style={{ width: 270, height: 250, borderRadius: 30, background: terc ? "rgba(52,211,153,0.2)" : WIN, border: `4px solid ${terc ? GREEN : PINKA(0.5)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `translateX(${terc ? shake(fr, dCorta, 16) : 0}px) scale(${terc ? 1 + 0.08 * pop(fr, dCorta, 8) : 1})` }}>
                      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#fff" }}>{n}</div>
                      <div style={{ fontSize: 70 }}>{k === 2 || fr >= dTres + 14 ? ic : "?"}</div>
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

// ---------- 1: 30 segundos ----------
const Item1 = ({ fr }) => {
  const dH = at(37), dT = at(39), dCom = at(45), dVir = at(46), dFin = at(48), dEst = at(53);
  const s = interpolate(fr, [dT, dT + 24], [0, 30], clamp);
  const segs = [["começo", dCom, BLUE], ["virada", dVir, AMBER], ["final", dFin, GREEN]];
  return (
    <AbsoluteFill>
      <Header fr={fr} d={dH} n="1" icon="⏱️" t="30 segundos" sub="numa geração só" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={dH + 4}>
          <Clip fr={fr} w={900} h={506} res="30 s" glow={fr >= dFin} k={1}>
            <div style={{ position: "absolute", right: 30, bottom: 30, fontFamily: MONO, fontWeight: 800, fontSize: 90, color: "#fff", textShadow: "0 4px 20px #000" }}>0:{String(Math.floor(s)).padStart(2, "0")}</div>
            {/* personagem simples andando */}
            <div style={{ position: "absolute", left: 60 + (s / 30) * 600, bottom: 120, width: 50, height: 110, borderRadius: 25, background: "#fff", opacity: 0.9, transform: `translateY(${Math.abs(Math.sin(fr / 4)) * -10}px)` }} />
          </Clip>
        </In>
        <div style={{ width: 900, position: "relative" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {segs.map(([t, d, c], k) => (
              <div key={k} style={{ flex: 1, height: 110, borderRadius: 18, background: fr >= d ? `${c}33` : "rgba(255,255,255,0.05)", border: `3px solid ${fr >= d ? c : "rgba(190,160,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: fr >= d ? "#fff" : GREY, transform: `scale(${fr >= d ? 0.92 + 0.08 * pop(fr, d, 9) : 1})` }}>{fr >= d ? t : "…"}</div>
            ))}
          </div>
          <div style={{ position: "absolute", top: -14, left: `${(s / 30) * 100}%`, width: 6, height: 138, background: PINK, borderRadius: 3, boxShadow: `0 0 20px ${PINK}` }} />
        </div>
        {fr >= dEst && (
          <div style={{ display: "flex", gap: 20 }}>
            {["+ estender", "+ estender"].map((t, k) => <In key={k} fr={fr} d={dEst + k * 6} dx={400} dy={0}><Pill size={44} c={PINK} bg={PINKA(0.15)}>{t}</Pill></In>)}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: 50 referências ----------
const Item2 = ({ fr }) => {
  const dH = at(54), dN = at(56), dImg = at(61), dVid = at(63), dAud = at(66), dPed = at(69);
  const n = Math.round(interpolate(fr, [dN, dN + 18], [0, 50], clamp));
  const tiles = [];
  for (let k = 0; k < 50; k++) {
    const kind = k < 30 ? 0 : k < 40 ? 1 : 2;
    const d0 = [dImg, dVid, dAud][kind] + (kind === 0 ? k * 0.5 : (k - (kind === 1 ? 30 : 40)) * 1.2);
    tiles.push({ k, kind, d: Math.round(d0) });
  }
  const ICON = ["🖼️", "🎞️", "🎵"], COL = [BLUE, PINK, AMBER];
  const merged = fr >= dPed;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={dH} n="2" icon="🧩" t="50 referências" sub="de uma vez" />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={dH + 4}>
          <Janela title="referências · 1 pedido" w={960} h={780} glow={merged}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: n >= 50 ? PINK : "#fff" }}>{n}<span style={{ fontSize: 50, color: GREY }}>/50</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                {[["🖼️ 30 imagens", dImg, BLUE], ["🎞️ 10 vídeos", dVid, PINK], ["🎵 10 áudios", dAud, AMBER]].map(([t, d, c], k) => (
                  <div key={k} style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: fr >= d ? c : "rgba(140,136,170,0.4)", transform: `scale(${fr >= d ? 0.9 + 0.1 * pop(fr, d, 9) : 1})`, transformOrigin: "right center" }}>{t}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20, width: 900 }}>
              {tiles.map(({ k, kind, d }) => {
                const on = fr >= d;
                const p = on ? pop(fr, d, 10) : 0;
                return <div key={k} style={{ width: 80, height: 80, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: on ? `${COL[kind]}33` : "rgba(255,255,255,0.04)", border: `2px solid ${on ? COL[kind] : "rgba(190,160,255,0.15)"}`, transform: `scale(${on ? (merged ? 0.85 : 0.6 + 0.4 * p) : 1})` }}>{on ? ICON[kind] : ""}</div>;
              })}
            </div>
            {merged && (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center" }}>
                <In fr={fr} d={dPed}><Pill size={52}>✓ tudo no mesmo pedido</Pill></In>
              </div>
            )}
          </Janela>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: modo rascunho ----------
const Item3 = ({ fr }) => {
  const dH = at(71), dPrev = at(79), d480 = at(81), dNove = at(86), dBom = at(94), dFin = at(98);
  const showFinal = fr >= dBom;
  const prog = lin(fr, dFin, dFin + 22);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={dH} n="3" icon="📝" t="Modo rascunho" sub="prévia antes do final" />
      <div style={{ position: "absolute", top: 410, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {!showFinal ? (
          <>
            <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
              <In fr={fr} d={dH + 4} dx={-300} dy={0}>
                <div style={{ width: 420, borderRadius: 30, background: WIN, border: `3px solid ${fr >= d480 ? GREEN : PINKA(0.5)}`, padding: 26, boxSizing: "border-box", transform: `translateY(${bob(fr, 0)}px)` }}>
                  <Clip fr={fr} w={364} h={205} res={fr >= d480 ? "480p" : "rascunho"} k={2} />
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", marginTop: 16 }}>Rascunho</div>
                  {fr >= dPrev && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: GREEN, marginTop: 6 }}>{fr >= d480 ? "US$ 0,10/s" : typed("prévia…", fr, dPrev, dPrev + 8)}</div>}
                  <div style={{ height: 30, marginTop: 16, borderRadius: 10, background: GREEN, width: `${fr >= dNove ? 11 : 100}%`, transition: "none" }} />
                </div>
              </In>
              <In fr={fr} d={dH + 9} dx={300} dy={0}>
                <div style={{ width: 420, borderRadius: 30, background: WIN, border: `3px solid ${RED}`, padding: 26, boxSizing: "border-box", transform: `translateY(${bob(fr, 2)}px)` }}>
                  <Clip fr={fr} w={364} h={205} res="4K" k={3} />
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", marginTop: 16 }}>Final 4K</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: RED, marginTop: 6 }}>US$ 0,91/s</div>
                  <div style={{ height: 30, marginTop: 16, borderRadius: 10, background: RED, width: "100%" }} />
                </div>
              </In>
            </div>
            {fr >= dNove && (
              <In fr={fr} d={dNove}>
                <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff", background: GREEN, padding: "0 40px", borderRadius: 26, transform: `rotate(-3deg) scale(${1 + 0.06 * Math.sin(fr / 5)})` }}>≈ 9x menos</div>
              </In>
            )}
          </>
        ) : (
          <>
            <In fr={fr} d={dBom}>
              <div style={{ width: 900, borderRadius: 30, background: WIN, border: `3px solid ${GREEN}`, padding: 30, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 26 }}>
                <Clip fr={fr} w={300} h={169} res="480p" k={2} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>Ficou bom?</div>
                  <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#120b26", background: GREEN, borderRadius: 16, padding: "10px 22px", transform: `scale(${0.9 + 0.1 * pop(fr, dBom + 8, 8)})` }}>✓ aprovar</div>
                  </div>
                </div>
              </div>
            </In>
            <div style={{ fontSize: 80, transform: `translateY(${Math.sin(fr / 4) * 10}px)` }}>⬇️</div>
            {fr >= dFin - 4 && (
              <In fr={fr} d={dFin - 4}>
                <div style={{ width: 900, borderRadius: 30, background: WIN, border: `3px solid ${prog >= 1 ? PINK : "rgba(190,160,255,0.3)"}`, padding: 30, boxSizing: "border-box", boxShadow: prog >= 1 ? `0 0 80px ${PINKA(0.4)}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>
                    <span>🎬 gerando o final</span><span style={{ fontFamily: MONO, color: PINK }}>{Math.round(prog * 100)}%</span>
                  </div>
                  <div style={{ height: 34, marginTop: 20, borderRadius: 17, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 17, background: PINK }} />
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

// ---------- 4: onde e quanto ----------
const PINS = [[180, 150], [330, 110], [520, 170], [610, 300], [760, 140], [430, 330], [250, 300]];
const Preco = ({ fr }) => {
  const dDr = at(105), dMun = at(107), dApi = at(110), dSeg = at(125), d4k = at(114), d91 = at(119), d1080 = at(128), d57 = at(132), d720 = at(136), d23 = at(139), dCob = at(143), dCerto = at(148);
  const tabela = fr >= dApi;
  const ROWS = [["4K", 0.914, d4k, d91, RED], ["1080p", 0.569, d1080, d57, AMBER], ["720p", 0.231, d720, d23, GREEN]];
  const cobrar = fr >= dCob;
  return (
    <AbsoluteFill>
      {!tabela ? (
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <In fr={fr} d={at(101)}>
            <div style={{ width: 900, height: 520, borderRadius: 40, background: WIN, border: `3px solid ${PINKA(0.5)}`, position: "relative", overflow: "hidden" }}>
              {/* globo estilizado */}
              <div style={{ position: "absolute", left: 200, top: 30, width: 460, height: 460, borderRadius: "50%", border: `4px solid ${PINKA(0.5)}`, background: "radial-gradient(circle at 35% 35%, #3a2470, #120b26)" }} />
              {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 200 + 230 - (230 * Math.abs(Math.cos(fr / 30 + k))), top: 30, width: 460 * Math.abs(Math.cos(fr / 30 + k)), height: 460, borderRadius: "50%", border: "2px solid rgba(190,160,255,0.25)" }} />)}
              {PINS.map(([x, y], k) => { const d = dMun + k * 3; return fr >= d ? <div key={k} style={{ position: "absolute", left: x + 40, top: y, fontSize: 50, transform: `scale(${pop(fr, d, 8)}) translateY(${bob(fr, k, 5)}px)` }}>📍</div> : null; })}
            </div>
          </In>
          {fr >= dDr && <In fr={fr} d={dDr}><Pill size={56} c={PINK} bg={PINKA(0.15)}>no Dreamina ✓</Pill></In>}
          {fr >= dMun && <In fr={fr} d={dMun}><Pill size={48}>🌍 liberado no mundo todo</Pill></In>}
        </div>
      ) : !cobrar ? (
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <In fr={fr} d={dApi}>
            <Janela title="API · BytePlus · preço por segundo" w={960} h={880} glow={fr >= d91}>
              <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 10 }}>
                {ROWS.map(([r, v, d, dv, c], k) => {
                  const val = interpolate(fr, [dv, dv + 14], [0, v], clamp);
                  const on = fr >= d;
                  return (
                    <In key={k} fr={fr} d={dApi + 3 + k * 4} dx={-300} dy={0}>
                      <div style={{ opacity: on ? 1 : 0.45, transform: `scale(${on ? 1 + 0.04 * Math.max(0, 1 - (fr - d) / 8) : 0.96})`, height: 200, borderRadius: 24, background: "rgba(255,255,255,0.05)", border: `3px solid ${fr >= dv ? c : "rgba(190,160,255,0.2)"}`, padding: "22px 30px", boxSizing: "border-box" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 58, color: "#fff" }}>{r}</span>
                          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: c }}>{fr >= dv ? usd(val) : "US$ …"}</span>
                        </div>
                        <div style={{ height: 34, marginTop: 20, borderRadius: 17, background: "rgba(255,255,255,0.08)" }}>
                          <div style={{ width: `${(val / 0.914) * 100}%`, height: "100%", borderRadius: 17, background: c, position: "relative", overflow: "hidden" }}>
                            {fr >= dv && <div style={{ position: "absolute", top: 0, bottom: 0, width: 120, left: `${((fr - dv) * 3) % 130 - 15}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }} />}
                          </div>
                        </div>
                      </div>
                    </In>
                  );
                })}
              </div>
            </Janela>
          </In>
          {fr >= dSeg && fr < d1080 + 10 && <In fr={fr} d={dSeg}><Pill size={50} c={RED} bg="rgba(255,92,122,0.14)">⏱️ 5 s em 4K ≈ US$ 4,57</Pill></In>}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
          {[["✓ deu certo", GREEN, "cobra", dCob + 4], ["✕ falhou", RED, "US$ 0", dCerto - 4]].map(([t, c, p, d], k) => (
            <In key={k} fr={fr} d={dCob + k * 6} dx={k ? 400 : -400} dy={0}>
              <div style={{ width: 900, borderRadius: 30, background: WIN, border: `3px solid ${fr >= d ? c : "rgba(190,160,255,0.3)"}`, padding: 26, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 26, transform: `translateX(${k && fr >= d ? shake(fr, d, 12) : 0}px)` }}>
                <div style={{ filter: k ? "grayscale(1) brightness(0.5)" : "none" }}><Clip fr={fr} w={300} h={169} res="vídeo" k={k + 4} /></div>
                <div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: fr >= d ? c : GREY }}>{t}</div>
                  {fr >= d && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: "#fff", marginTop: 8, transform: `scale(${pop(fr, d, 9)})`, transformOrigin: "left center" }}>{p}</div>}
                </div>
              </div>
            </In>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 5: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(150), dCom = at(156), dK = at(157), dSeg = at(161);
  const items = [["1", "⏱️", "30 s numa geração"], ["2", "🧩", "50 referências"], ["3", "📝", "rascunho ≈ 9x menos"]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 100, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>você pagaria?</div></In>
        {items.map(([n, ic, t], k) => (
          <In key={k} fr={fr} d={d0 + 6 + k * 4} dx={-500} dy={0}>
            <div style={{ width: 900, display: "flex", alignItems: "center", gap: 24, padding: "22px 30px", borderRadius: 26, background: WIN, border: `3px solid ${PINKA(0.6)}`, boxSizing: "border-box" }}>
              <div style={{ width: 74, height: 74, borderRadius: 37, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 48 }}>{ic}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff" }}>{t}</div>
            </div>
          </In>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center", marginTop: 10, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 5; if (fr < t0) return null; const q = (fr - t0) / 40; return <div key={k} style={{ position: "absolute", left: 560 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "❤️"}</div>; })}
          <div style={{ width: 720, display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dCom - 6, dCom) }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{typed("4K", fr, dK - 2, dK + 4)}{blink(fr)}</span>
            {fr >= dK + 8 && <span style={{ marginLeft: "auto", fontSize: 48, transform: `scale(${pop(fr, dK + 8, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 34px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dCom, dCom + 6) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir"}</div>
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
const KEY = new Set(["queimar", "dinheiro", "4k", "seedance", "25", "3", "corta", "custo", "30", "geracao", "comeco", "virada", "final", "estender", "50", "referencias", "imagens", "videos", "audios", "pedido", "rascunho", "previa", "480p", "9x", "barata", "bom", "dreamina", "mundo", "api", "byteplus", "1080p", "720", "us091", "57", "23", "certo", "pagaria", "comenta", "segue", "us457", "10"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", cinco: "5", dez: "10", trinta: "30", cinquenta: "50", nove: "9" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "quatro" && nn(k + 1) === "k") { push("4K", k + 1); continue; }
    if (n === "quatro" && nn(k + 1) === "dolares") { push("US$ 4,57", k + 3); continue; }
    if (n === "dois" && nn(k + 1) === "ponto" && nn(k + 2) === "cinco") { push("2.5", k + 2); continue; }
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "quatrocentos" && nn(k + 2) === "oitenta") { push("480p", k + 3); continue; }
    if (n === "mil" && nn(k + 2) === "oitenta") { push("1080p", k + 3); continue; }
    if (n === "setecentos") { push("720p", k + 2); continue; }
    if (n === "noventa" && nn(k + 2) === "um") { push("US$ 0,91", k + 5); continue; }
    if (n === "cinquenta" && nn(k + 1) === "e" && nn(k + 2) === "sete") { push("US$ 0,57", k + 2); continue; }
    if (n === "vinte" && nn(k + 1) === "e" && nn(k + 2) === "tres") { push("US$ 0,23", k + 2); continue; }
    if (n === "nove" && nn(k + 1) === "vezes") { push("9x", k + 1); continue; }
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

export const ShortSeedance25 = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(37), at(54), at(71), at(101), at(150), end];
  const scenes = [Hook, Item1, Item2, Item3, Preco, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(9)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(71)} b={at(79)} pose="apontando" top={1230} left />
      <Reacao fr={fr} a={at(156)} b={end} pose="comemorando" top={1180} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={1} /></Sequence>
      <Sequence from={0} durationInFrames={20}><Audio src={staticFile("sfx/riser.mp3")} volume={0.35} /></Sequence>
      <Sequence from={at(7)} durationInFrames={20}><Audio src={staticFile("sfx/pop.mp3")} volume={0.7} /></Sequence>
      <Sequence from={at(11)} durationInFrames={30}><Audio src={staticFile("sfx/coin.mp3")} volume={0.45} /></Sequence>
      <Sequence from={at(16)} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.8} /></Sequence>
      <Sequence from={at(34)} durationInFrames={15}><Audio src={staticFile("sfx/ding.mp3")} volume={0.5} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.3} /></Sequence>)}
      {[at(45), at(46), at(48), at(61), at(63), at(66), at(115), at(128), at(136)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.28} /></Sequence>)}
      {[at(69), at(86), at(100), at(143), at(157)].map((b, k) => <Sequence key={"d" + k} from={b} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.32} /></Sequence>)}
      <Sequence from={at(148) - 4} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};

export const CapaSeedance25 = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Vídeo em 4K</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 124, color: "#fff", background: RED, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 16 }}>queima dinheiro?</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 54, color: BODY, marginTop: 30 }}>Seedance 2.5: o que faz e quanto custa</div>
    </div>
    <div style={{ position: "absolute", top: 920, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <Clip fr={20} w={860} h={484} res="4K" glow>
        <div style={{ position: "absolute", right: 30, bottom: 30, fontFamily: MONO, fontWeight: 800, fontSize: 80, color: "#fff", textShadow: "0 4px 20px #000" }}>0:05</div>
      </Clip>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: RED, textShadow: "0 0 40px rgba(255,92,122,0.6)" }}>US$ 4,57</div>
    </div>
  </AbsoluteFill>
);
