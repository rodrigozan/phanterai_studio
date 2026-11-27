import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Short do Aprenda YouTube 25/11/2026 17:00 — Mito vs. Realidade: "Tag faz o vídeo crescer?".
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 25/11/2026):
// - support.google.com/youtube/answer/146402 (en e pt-BR): "Your video's title, thumbnail, and description are more
//   important pieces of metadata for your video's discovery. These main pieces of info help viewers decide which videos
//   to watch." / "Tags can be useful if the content of your video is commonly misspelled. Otherwise, tags play a minimal
//   role in your video's discovery." Caminho: Studio → CRIAR → Enviar vídeo → Detalhes → MAIS OPÇÕES → tags.
// - support.google.com/youtube/answer/6390658: "If a video or playlist has more than 60 hashtags, we'll ignore each
//   hashtag on that content. Over-tagging may result in the removal of your video from your uploads or from search."
// Meme (só na fala e no texto animado, sem imagem do personagem): "Narruto" com dois erres.
// Tudo é interface recriada em motion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
// Balança e barras são ilustração do conceito (sem números), não dado de canal.
export const STQ_SLUG = "aprendayoutube/episodes/shorts-reels-tiktok/yt-short-2026-11-25-1700-tags-quase-nada";
export const STQ_FPS = 30;
const MUSIC = "aprendayoutube/music/Coding_at_Night.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = STQ_FPS;
const f = (p) => staticFile(`${STQ_SLUG}/${p}`);
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

export const calculateTagsQuaseNadaMetadata = async () => {
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

const Chip = ({ t, c = VIOLET, off, size = 34, style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: size, color: off ? GREY : "#fff", background: off ? "rgba(255,255,255,0.05)" : `${c}33`, border: `2px solid ${off ? "rgba(255,255,255,0.15)" : c}`, padding: "8px 18px", borderRadius: 14, whiteSpace: "nowrap", textDecoration: off ? "line-through" : "none", ...style }}>{t}<span style={{ opacity: 0.6 }}>×</span></span>
);
const TAGS = ["youtube", "como crescer", "viral", "tags", "2026", "algoritmo", "dicas", "shorts", "canal pequeno", "views", "sucesso", "top"];

// ---------- 0: gancho (0 -> "Mito") ----------
const Hook = ({ fr }) => {
  const dTags = at(3), dNada = at(6);
  const n = Math.min(TAGS.length, 3 + Math.floor(fr / 6));
  const mins = Math.min(30, Math.floor(fr * 30 / Math.max(1, dTags + 12)));
  const after = fr >= dNada;
  const flash = [0, dTags, dNada].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const desc = after ? 0.06 + 0.04 * (1 - lin(fr, dNada, dNada + 10)) : 0.1 + 0.15 * lin(fr, 0, dNada);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: after ? `rgba(255,92,122,${Math.min(0.45, flash)})` : PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={after ? dNada : fr >= dTags ? dTags : 0} size={after ? 150 : 170} top={130} rot={after ? 3 : -2} bg={after ? RED : PINK}>{after ? "quase NADA!" : fr >= dTags ? "TAGS…" : "30 min…"}</Big>
      <div style={{ ...center, top: 400, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dNada, 16)}px)` }}>
        <Janela title="Detalhes › Tags" w={940} h={560} glow={!after}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: BODY }}>🏷️ Tags</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: mins >= 30 ? AMBER : "#fff" }}>⏱ {String(mins).padStart(2, "0")}:00</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {TAGS.slice(0, n).map((t, k) => <span key={k} style={{ transform: `scale(${pop(fr, k < 3 ? 0 : (k - 2) * 6, 10)})` }}><Chip t={t} c={k % 2 ? VIOLET : PINK} off={after} /></span>)}
          </div>
          <Cursor x={120 + ((fr * 23) % 640)} y={260 + ((fr * 7) % 120)} fr={fr} />
        </Janela>
        <div style={{ marginTop: 50, width: 900 }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: BODY, marginBottom: 14 }}>peso na descoberta</div>
          <Bar w={900} v={desc} c={after ? RED : PINK} glow />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1: o mito (Mito ... busca) ----------
const Mito = ({ fr }) => {
  const d0 = at(7), dDes = at(16), dTres = at(18), dTer = at(22), dBus = at(27);
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={160} top={150} rot={-2} bg={fr >= dDes ? RED : AMBER}>{fr >= dDes ? "Desmente!" : "Mito?"}</Big>
      <div style={{ ...center, top: 430 }}>
        <div style={{ position: "relative", width: 960, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= dDes ? RED : AMBER}`, boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: "#fff", whiteSpace: "nowrap", textDecoration: fr >= dDes ? "line-through" : "none", textDecorationColor: RED }}>“{typed("tag faz o vídeo crescer", fr, d0 + 2, at(12) + 4)}{fr < at(13) ? blink(fr) : "”"}</div>
          <div style={{ fontSize: 70, transform: `translateY(${fr >= dDes ? 20 * lin(fr, dDes, dDes + 8) : -10 * Math.abs(Math.sin(fr / 4))}px) rotate(${fr >= dDes ? 180 * lin(fr, dDes, dDes + 8) : 0}deg)` }}>📈</div>
        </div>
        <div style={{ marginTop: 36, height: 90 }}>{fr >= Math.min(dTres, 135) && <In fr={fr} d={Math.min(dTres, 135)}><Pill c={PINK} bg={PINKA(0.15)} size={42}>3 pontos · o 3º tira da busca 👀</Pill></In>}</div>
        {fr < dTres && <div style={{ marginTop: 30, display: "flex", gap: 20, flexWrap: "wrap", width: 900, justifyContent: "center" }}>
          {TAGS.slice(0, 8).map((t, k) => <span key={k} style={{ transform: `translateY(${Math.sin(fr / 5 + k) * 14}px) scale(${pop(fr, d0 + 6 + k * 3, 11)})` }}><Chip t={t} c={k % 2 ? VIOLET : AMBER} size={38} /></span>)}
        </div>}
        <div style={{ marginTop: 50, display: fr < dTres ? "none" : "flex", gap: 34 }}>
          {[0, 1, 2].map((k) => {
            const d = [dTres, dTres + 5, at(20)][k];
            const hot = k === 2 && fr >= dTer;
            if (fr < d) return <div key={k} style={{ width: 260 }} />;
            const flip = interpolate(fr, [d, d + 8], [90, 0], clamp);
            return (
              <div key={k} style={{ width: 260, height: 330, borderRadius: 36, background: hot ? "rgba(255,92,122,0.2)" : WIN, border: `4px solid ${hot ? RED : VIOLET}`, transform: `perspective(800px) rotateY(${flip}deg) translateX(${hot && fr >= dBus ? shake(fr, dBus, 12) : 0}px) scale(${hot ? 1.1 : 0.95})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: `0 0 50px ${hot ? "rgba(255,92,122,0.5)" : "rgba(180,140,255,0.2)"}` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: hot && fr >= at(25) ? 110 : 140, color: "#fff" }}>{hot ? (fr >= at(25) ? "🔍❌" : "?") : k + 1}</span>
                <span style={{ fontFamily: MONO, fontSize: 34, color: hot ? "#fff" : GREY }}>{hot ? (fr >= at(25) ? "fora da busca" : "nº 3") : "ponto"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: Nº 1 papel mínimo (Número um ... vídeo) ----------
const Item1 = ({ fr }) => {
  const d0 = at(28), dYT = at(30), dTag = at(32), dMin = at(37), dDesc = at(39);
  const shrink = 1 - 0.6 * ease(lin(fr, dMin, dMin + 12));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🏷️" t="Papel mínimo" sub="segundo o próprio YouTube" />
      <div style={{ ...center, top: 520 }}>
        {fr >= dYT && <In fr={fr} d={dYT}><Pill c={VIOLET} bg="rgba(180,140,255,0.14)" size={40}>▶ Central de Ajuda do YouTube</Pill></In>}
        <div style={{ marginTop: 50, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {fr >= dTag && <div style={{ transform: `scale(${pop(fr, dTag, 10) * 2.2 * shrink}) rotate(${Math.sin(fr / 6) * 4}deg)` }}><Chip t="tag" c={PINK} size={50} /></div>}
        </div>
        <div style={{ height: 140 }}>{fr >= dMin && <Stamp fr={fr} d={dMin} c={RED} rot={-6} size={96}>MÍNIMO</Stamp>}</div>
        <div style={{ marginTop: 30, width: 900, opacity: lin(fr, dDesc - 4, dDesc + 2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: inter, fontWeight: 800, fontSize: 40, color: BODY, marginBottom: 14 }}>🔍 descoberta do vídeo</div>
          <Bar w={900} v={0.08 + 0.1 * (1 - lin(fr, dDesc, dDesc + 10))} c={RED} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: título, miniatura, descrição (Título ... assistir) ----------
const Pesam = ({ fr }) => {
  const dT = at(42), dM = at(43), dD = at(45), dMais = at(47), dPes = at(48), dDec = at(53), dAss = at(57);
  const tilt = 5 * ease(lin(fr, dMais, dMais + 12));
  const card = (d, ic, t, body, k) => fr >= d && (
    <In key={k} fr={fr} d={d}>
      <div style={{ width: 280, height: 250, borderRadius: 28, background: WIN, border: `3px solid ${fr >= dMais ? GREEN : VIOLET}`, padding: 20, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14, boxShadow: fr >= dMais ? `0 0 40px rgba(52,211,153,0.35)` : "none" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>{ic} {t}</div>
        {body}
      </div>
    </In>
  );
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <div style={{ display: "flex", gap: 24, transform: `translateY(${tilt * 4}px)` }}>
          {card(dT, "✍️", "Título", <div style={{ fontFamily: MONO, fontSize: 30, color: BODY }}>{typed("30 min em tags…", fr, dT, dT + 25)}</div>, 0)}
          {card(dM, "🖼️", "Miniatura", <VideoCard fr={fr} w={238} />, 1)}
          {card(dD, "📝", "Descrição", <div>{[1, 0.8, 0.9, 0.6].map((w, k) => <div key={k} style={{ height: 14, width: `${w * 100 * lin(fr, dD + k * 3, dD + k * 3 + 6)}%`, borderRadius: 7, background: "rgba(255,255,255,0.4)", marginBottom: 12 }} />)}</div>, 2)}
        </div>
        <div style={{ marginTop: 50, width: 900, height: 16, borderRadius: 8, background: VIOLET, transform: `rotate(${tilt}deg)`, opacity: lin(fr, dT, dT + 8) }} />
        <div style={{ marginTop: 10, width: 900, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: lin(fr, dT, dT + 8) }}>
          <Pill c={GREEN} size={44}>{fr >= dMais ? "pesam MAIS ⬇" : "título + capa + descrição"}</Pill>
          <div style={{ transform: `translateY(${-tilt * 8}px)` }}><Chip t="tags" c={GREY} off={fr >= dMais} size={36} /></div>
        </div>
        <div style={{ marginTop: 50, height: 360, position: "relative", width: 900 }}>
          {fr >= dPes && <In fr={fr} d={dPes}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
              <div style={{ fontSize: 150 }}>🧑</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <VideoCard fr={fr} w={300} glow={fr >= dAss} c={fr >= dAss ? GREEN : undefined} />
                <div style={{ opacity: fr >= dAss ? 0.35 : 1 }}><VideoCard fr={fr + 20} w={300} /></div>
              </div>
            </div>
            <Cursor x={interpolate(fr, [dDec, dAss], [700, 560], clamp)} y={interpolate(fr, [dDec, dAss], [300, 80], clamp)} fr={fr} click={dAss} />
          </In>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: Nº 2 erro de digitação (Número dois ... erres) ----------
const Item2 = ({ fr }) => {
  const d0 = at(58), dTag = at(61), dErr = at(69), dProc = at(72), dNar = at(73), dRR = at(75);
  const word = "Narruto";
  const shown = typed(word, fr, dNar - 4, dNar + 14);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="🔤" t="Erro de digitação" sub="o único caso em que a tag ajuda" />
      <div style={{ ...center, top: 540 }}>
        <div style={{ width: 920, padding: "26px 30px", borderRadius: 60, background: WIN, border: `3px solid ${fr >= dErr ? RED : LINE}`, display: "flex", alignItems: "center", gap: 20, boxSizing: "border-box", transform: `translateX(${shake(fr, dErr, 14)}px)` }}>
          <span style={{ fontSize: 50 }}>🔍</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 58, color: "#fff", whiteSpace: "nowrap" }}>
            {fr < dProc ? typed("asunto escrito erado", fr, dTag, dErr + 4) : <>{shown.slice(0, 3)}<span style={{ color: fr >= dRR ? "#fff" : "inherit", background: fr >= dRR ? RED : "transparent", borderRadius: 10, padding: fr >= dRR ? "0 6px" : 0 }}>{shown.slice(3, 5)}</span>{shown.slice(5)}</>}{blink(fr)}
          </span>
        </div>
        {fr < dProc && fr >= dErr && <div style={{ marginTop: 20 }}><In fr={fr} d={dErr}><Pill c={RED} bg="rgba(255,92,122,0.14)" size={44}>✍️ ERRADO</Pill></In></div>}
        {fr >= dNar + 6 && <In fr={fr} d={dNar + 6}>
          <div style={{ marginTop: 40, width: 920, padding: 26, borderRadius: 30, background: WIN, border: `3px solid ${GREEN}`, display: "flex", gap: 24, alignItems: "center", boxSizing: "border-box", boxShadow: "0 0 50px rgba(52,211,153,0.3)" }}>
            <VideoCard fr={fr} w={320} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>seu vídeo</div>
              <Chip t="narruto" c={GREEN} size={36} />
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: GREEN }}>✓ achou mesmo assim</div>
            </div>
          </div>
        </In>}
        <div style={{ marginTop: 40, height: 140 }}>{fr >= dRR && <Stamp fr={fr} d={dRR} c={AMBER} rot={5} size={80}>2 erres 🙃</Stamp>}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: onde fica (Onde ... OPÇÕES) ----------
const Onde = ({ fr }) => {
  const d0 = at(77), dEnv = at(80), dDet = at(82), dMais = at(85);
  const open = ease(lin(fr, dMais + 4, dMais + 14));
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={130} top={150} rot={-2}>Onde fica?</Big>
      <div style={{ ...center, top: 420 }}>
        <Janela title="YouTube Studio › Enviar vídeo" w={960} h={820} glow>
          <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
            {["Detalhes", "Elementos", "Verificações", "Visibilidade"].map((t, k) => <div key={k} style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: k === 0 && fr >= dDet ? "#fff" : GREY, background: k === 0 && fr >= dDet ? PINK : "rgba(255,255,255,0.05)", padding: "12px 20px", borderRadius: 30, transform: `scale(${k === 0 && fr >= dDet ? 0.9 + 0.1 * pop(fr, dDet, 9) : 1})` }}>{t}</div>)}
          </div>
          <div style={{ opacity: lin(fr, dEnv, dEnv + 6) }}>
            {["Título (obrigatório)", "Descrição"].map((t, k) => <div key={k} style={{ border: `2px solid ${LINE}`, borderRadius: 18, padding: "16px 20px", marginBottom: 18 }}><div style={{ fontFamily: inter, fontSize: 26, color: GREY }}>{t}</div><div style={{ height: 16, width: `${60 - k * 15}%`, marginTop: 12, borderRadius: 8, background: "rgba(255,255,255,0.35)" }} /></div>)}
          </div>
          <div style={{ marginTop: 10, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 34, color: fr >= dMais ? "#fff" : PINK, background: fr >= dMais ? PINK : "transparent", border: `3px solid ${PINK}`, padding: "12px 28px", borderRadius: 30, opacity: lin(fr, dDet, dDet + 6) }}>MAIS OPÇÕES {fr >= dMais ? "▲" : "▼"}</div>
          <div style={{ marginTop: 24, height: 200 * open, overflow: "hidden", border: open > 0 ? `3px solid ${GREEN}` : "none", borderRadius: 18, padding: open > 0 ? "16px 20px" : 0, boxSizing: "border-box" }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREEN, marginBottom: 14 }}>🏷️ Tags</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>{["narruto", "tags youtube"].map((t, k) => <span key={k} style={{ transform: `scale(${pop(fr, dMais + 8 + k * 5, 10)})` }}><Chip t={t} c={GREEN} size={32} /></span>)}</div>
          </div>
          <Cursor x={fr < dDet ? interpolate(fr, [d0, dDet], [700, 90], clamp) : interpolate(fr, [dDet, dMais], [90, 200], clamp)} y={fr < dDet ? interpolate(fr, [d0, dDet], [500, 30], clamp) : interpolate(fr, [dDet, dMais], [30, 320], clamp)} fr={fr} click={fr < dMais ? dDet : dMais} />
        </Janela>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: Nº 3 exagero (Número três ... busca) ----------
const Item3 = ({ fr }) => {
  const d0 = at(87), dEx = at(89), dMais = at(91), dSes = at(93), dIgn = at(98), dTod = at(99), dExc = at(102), dBus = at(109);
  const count = fr < dEx ? 0 : Math.min(61, Math.round(61 * ease(lin(fr, dEx, at(95)))));
  const ign = fr >= dTod;
  const out = ease(lin(fr, at(105), dBus + 4));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="🚫" t="Exagerou, perdeu" sub="limite oficial das hashtags" />
      <div style={{ ...center, top: 470 }}>
        {fr < dExc ? <>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Digital txt={`#${count}`} size={130} glow c={count > 60 ? RED : "#fff"} />
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: count > 60 ? RED : BODY }}>{count > 60 ? "> 60 hashtags" : "hashtags"}</div>
          </div>
          <div style={{ marginTop: 40, width: 940, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", transform: `translateX(${shake(fr, dIgn, 12)}px)` }}>
            {Array.from({ length: count }, (_, k) => <span key={k} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: ign ? GREY : "#fff", background: ign ? "rgba(255,255,255,0.05)" : k % 2 ? PINKA(0.3) : "rgba(180,140,255,0.3)", padding: "6px 12px", borderRadius: 10, textDecoration: ign ? "line-through" : "none" }}>#tag{k + 1}</span>)}
          </div>
          <div style={{ marginTop: 40 }}>{ign && <Stamp fr={fr} d={dTod} c={RED} rot={-7} size={100}>IGNORA TODAS</Stamp>}</div>
          {fr >= dEx && fr < dMais && <div style={{ marginTop: 30 }}><Stamp fr={fr} d={dEx} c={AMBER} rot={4} size={80}>exagerou?</Stamp></div>}
        </> : <>
          <Janela title="🔍 resultados da busca" w={940} h={760}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ display: "flex", gap: 22, alignItems: "center", marginBottom: 26, transform: k === 1 ? `translateX(${out * 1100}px) rotate(${out * 12}deg)` : "none", opacity: k === 1 ? 1 : 0.6 + 0.4 * lin(fr, dExc, dExc + 6) }}>
                <VideoCard fr={fr + k * 9} w={300} c={k === 1 ? RED : undefined} glow={k === 1} />
                <div>
                  <div style={{ height: 20, width: 380, borderRadius: 10, background: "rgba(255,255,255,0.5)", marginBottom: 14 }} />
                  {k === 1 ? <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: RED }}>#tag #tag #tag #tag…</span> : <div style={{ height: 16, width: 250, borderRadius: 8, background: "rgba(255,255,255,0.25)" }} />}
                </div>
              </div>
            ))}
          </Janela>
          <div style={{ marginTop: 40, height: 140 }}>{fr >= at(105) && <Stamp fr={fr} d={at(105)} c={RED} rot={-5} size={84}>fora da busca</Stamp>}</div>
        </>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(110), dQ = at(111), dE = at(115), dSeg = at(117), dCob = at(119);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <In fr={fr} d={d0}><div style={{ fontSize: 150, transform: `rotate(${Math.sin(fr / 5) * 6}deg)` }}>💬</div></In>
        <div style={{ marginTop: 30, width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, boxSizing: "border-box", boxShadow: `0 0 60px ${PINKA(0.35)}` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY, marginBottom: 14 }}>Adicione um comentário…</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: "#fff", whiteSpace: "nowrap" }}>{typed("uso __ tags 🏷️", fr, d0 + 2, dQ + 14)}{blink(fr)}</div>
        </div>
        <div style={{ marginTop: 40, height: 120, display: "flex", gap: 14 }}>{fr >= dQ && [0, 1, 2, 3].map((k) => <span key={k} style={{ transform: `scale(${pop(fr, dQ + k * 4, 10)}) translateY(${Math.sin(fr / 4 + k) * 8}px)` }}><Chip t={["0", "5", "15", "60?"][k]} c={k === 3 ? RED : VIOLET} size={44} /></span>)}</div>
        <div style={{ marginTop: 30, fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "24px 54px", borderRadius: 50, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dE - 2, dE + 4) }}>{fr >= dSeg + 2 ? "✓ Inscrito" : "Inscrever-se"}</div>
        <div style={{ marginTop: 40 }}>{fr >= dCob && <In fr={fr} d={dCob}><Pill c={GREEN} size={50}>🧪 próxima cobaia</Pill></In>}</div>
        {fr >= dQ && Array.from({ length: 12 }, (_, k) => { const t0 = dQ + k * 6; if (fr < t0) return null; const t = (fr - t0) / 45; return <div key={k} style={{ position: "absolute", left: 540 + 320 * Math.sin(k * 2.1), top: 1000 - t * 380, fontSize: 60, opacity: Math.max(0, 1 - t) }}>{k % 3 ? "💬" : "🏷️"}</div>; })}
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


const KEY = new Set(["tags", "nada", "mito", "youtube", "3", "terceiro", "busca", "minimo", "titulo", "miniatura", "descricao", "mais", "decide", "errado", "narruto", "detalhes", "opcoes", "exagerou", "perdeu", "ignora", "todas", "excesso", "comenta", "cobaia"]);
// números e siglas faladas viram forma escrita na legenda
const FRASES = [
  [["meia", "hora"], "30 min"],
  [["dois", "erres"], "2 erres"],
  [["sessenta"], "60"],
  [["numero", "um"], "Nº 1"], [["numero", "dois"], "Nº 2"], [["numero", "tres"], "Nº 3"],
  [["tres"], "3"],
];

export const ShortTagsQuaseNada = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(7), at(28), at(42), at(58), at(77), at(87), at(110), end];
  const scenes = [Hook, Mito, Item1, Pesam, Item2, Onde, Item3, CTA];
  const chunks = buildChunks2(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(7)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(46)} b={at(53) - 2} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(115)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.45, 15)}
      {[6, 12, 18, 24, 30, 36, 42, 48].map((o) => S(o, "pop", 0.12, 10))}
      {S(at(3), "ding", 0.45)}
      {S(at(6), "error", 0.55, 15)}
      {S(120, "pop", 0.35, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {S(at(16), "error", 0.45, 15)}
      {[at(18), at(18) + 5, at(20)].map((b) => S(b, "pop", 0.4, 15))}
      {S(at(25), "error", 0.4, 15)}
      {S(at(34), "pop", 0.4, 15)}
      {S(at(37), "error", 0.45, 15)}
      {[at(42), at(43), at(45)].map((b) => S(b, "pop", 0.35, 15))}
      {S(at(47), "ding", 0.4)}
      {S(at(57), "pop", 0.4, 15)}
      {S(at(69), "error", 0.4, 15)}
      {S(at(73) + 6, "ding", 0.4)}
      {S(at(75), "pop", 0.4, 15)}
      {S(at(82), "pop", 0.4, 15)}
      {S(at(85), "ding", 0.4)}
      {S(at(91), "riser", 0.35, 30)}
      {S(at(99), "error", 0.5, 15)}
      {S(at(105), "whoosh", 0.4, 25)}
      {S(at(111), "pop", 0.4, 15)}
      {S(at(117) + 2, "ding", 0.45)}
      {S(at(119), "pop", 0.4, 15)}
    </AbsoluteFill>
  );
};

export const CapaTagsQuaseNada = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Tag faz crescer?</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 116, color: "#fff", background: RED, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>papel mínimo</div>
    </div>
    <div style={{ position: "absolute", top: 820, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>{TAGS.slice(0, 7).map((t, k) => <Chip key={k} t={t} c={k % 2 ? VIOLET : PINK} off={k > 3} size={40} />)}</div>
      <Pill c={AMBER} bg="rgba(251,191,36,0.14)" size={50}>⏱ 30 min… pra quê?</Pill>
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

