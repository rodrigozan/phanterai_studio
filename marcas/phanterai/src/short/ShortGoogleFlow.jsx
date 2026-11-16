import { AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const GFL_SLUG = "phanterai/episodes/reel-2026-11-16-1800-google-flow-cenas-gratis";
export const GFL_FPS = 30;
const f = (p) => staticFile(`${GFL_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

const PINK = "rgb(222,64,200)";
const BODY = "rgb(205,202,222)";
const GREY = "rgb(150,150,175)";
const BG = "#08080D";
const TOTAL = 10;

export const calculateGoogleFlowMetadata = async () => {
  const [scenes, wordsJson, times] = await Promise.all(
    ["data/scenes.json", "audio/words.json", "audio/scene-times.json"].map((p) => fetch(f(p)).then((r) => r.json()))
  );
  const end = wordsJson.words[wordsJson.words.length - 1].e;
  return {
    durationInFrames: Math.ceil((end + 1.2) * GFL_FPS),
    props: { scenes, words: wordsJson.words, times, endSec: end + 1.2 },
  };
};

// ---------- fundo ----------
const Fundo = () => (
  <AbsoluteFill style={{ background: BG }}>
    <div style={{ position: "absolute", width: 1200, height: 1200, right: -420, top: -420, borderRadius: "50%", background: "radial-gradient(circle, rgba(130,70,255,0.34) 0%, transparent 68%)" }} />
    <div style={{ position: "absolute", width: 1200, height: 1200, left: -480, bottom: -480, borderRadius: "50%", background: "radial-gradient(circle, rgba(222,64,200,0.28) 0%, transparent 68%)" }} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
  </AbsoluteFill>
);

const BgVideo = ({ id }) => (
  <AbsoluteFill style={{ opacity: 0.35, filter: "blur(24px)", transform: "scale(1.2)" }}>
    <Loop durationInFrames={240}>
      <OffthreadVideo src={f(`bg/${id}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Loop>
  </AbsoluteFill>
);

// ---------- topo / rodapé ----------
const Topo = ({ n }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top: 78, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ fontFamily: MONO, fontSize: 34, color: GREY, letterSpacing: 2 }}>
      <span style={{ color: "#fff" }}>{String(n).padStart(2, "0")}</span> / {TOTAL}
    </div>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -1 }}>
      Phanter<span style={{ color: PINK }}>AI</span>
    </div>
  </div>
);

const Rodape = ({ pexels }) => (
  <div style={{ position: "absolute", left: 80, right: 80, bottom: 70, display: "flex", justifyContent: "center", fontFamily: MONO, fontSize: 28, color: GREY }}>
    <span>@phanteraicreative</span>
    {pexels && <span style={{ position: "absolute", right: 0, fontSize: 22 }}>vídeo: Pexels</span>}
  </div>
);

// ---------- panterinha ----------
const Panterinha = ({ pose, style, size = 300 }) => {
  const fr = useCurrentFrame();
  const rot = Math.sin(fr / 38) * 3;
  const dy = Math.sin(fr / 30 + 1) * 10;
  return (
    <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: size, transform: `translateY(${dy}px) rotate(${rot}deg)`, transformOrigin: "50% 100%", ...style }} />
  );
};

// ---------- legendas ----------
const SUBS = [
  [["arroba", "phanter", "a", "i", "creative"], "@phanteraicreative"],
  [["tres", "ponto", "um"], "3.1"],
  [["cinquenta"], "50"],
  [["oito"], "8"],
  [["dez"], "10"],
  [["cinco"], "5"],
  [["quatrocentas"], "400"],
  [["onze"], "11h"],
  [["duas", "da", "tarde"], "14h"],
];
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

const buildCaptions = (words) => {
  const toks = [];
  for (let i = 0; i < words.length; ) {
    let hit = null;
    for (const [seq, out] of SUBS) {
      if (seq.every((s, k) => words[i + k] && norm(words[i + k].w) === s)) { hit = [seq, out]; break; }
    }
    if (hit) {
      const last = words[i + hit[0].length - 1];
      const punct = last.w.match(/[.,!?:;]+$/)?.[0] || "";
      toks.push({ t: hit[1] + punct, s: words[i].s, e: last.e });
      i += hit[0].length;
    } else { toks.push({ t: words[i].w, s: words[i].s, e: words[i].e }); i++; }
  }
  const chunks = []; let cur = [];
  toks.forEach((tk) => {
    cur.push(tk);
    const len = cur.map((c) => c.t).join(" ").length;
    if (cur.length >= 4 || len > 22 || /[.,!?:;]$/.test(tk.t)) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  return chunks;
};

const Legendas = ({ chunks }) => {
  const fr = useCurrentFrame();
  const t = fr / GFL_FPS;
  let ci = -1;
  chunks.forEach((c, i) => { if (c[0].s <= t + 0.02) ci = i; });
  if (ci < 0) return null;
  const chunk = chunks[ci];
  const len = chunk.map((c) => c.t).join(" ").length;
  const fs = len > 28 ? 46 : len > 20 ? 58 : 72;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1500, height: 200, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: fs, lineHeight: 1.12, color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>
        {chunk.map((w, i) => {
          const cur = t >= w.s - 0.02 && t < (chunk[i + 1] ? chunk[i + 1].s : w.e + 0.4);
          return <span key={i} style={{ color: cur ? PINK : "#fff", marginRight: i < chunk.length - 1 ? 18 : 0 }}>{w.t}</span>;
        })}
      </div>
    </div>
  );
};

// ---------- peças da cena ----------
const Pilula = ({ pill, date }) => (
  <div style={{ position: "absolute", left: 80, top: 262, display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: "#fff", background: "rgba(222,64,200,0.18)", border: `2px solid ${PINK}`, borderRadius: 999, padding: "12px 28px" }}>{pill}</div>
    {date && <div style={{ fontFamily: MONO, fontSize: 28, color: BODY, border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "10px 16px" }}>{date}</div>}
  </div>
);

const CARD = { x: 80, y: 400, w: 920, h: 760 };

const CenterCard = ({ children, zoom }) => (
  <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 40, border: `3px solid ${PINK}`, background: "#0d0d15", boxShadow: "0 0 60px rgba(222,64,200,0.35), 0 30px 80px rgba(0,0,0,0.6)", overflow: "hidden", transform: `scale(${zoom})` }}>
    <div style={{ position: "absolute", inset: 14, borderRadius: 28, overflow: "hidden", background: "#050509" }}>{children}</div>
  </div>
);

const IW = CARD.w - 28, IH = CARD.h - 28; // área interna 892x732
const PrintCard = ({ id, box, dur }) => {
  const fr = useCurrentFrame();
  const s = IH / 900; // imagem 1200x900 -> cobre a altura
  const offX = (1200 * s - IW) / 2;
  const z = interpolate(fr, [0, dur], [1.0, 1.08], clamp);
  const hb = box && { x: box.x * s - offX - 14, y: box.y * s - 8, w: box.w * s + 28, h: box.h * s + 16 };
  const ok = hb && hb.x > -20 && hb.y > 0 && hb.y + hb.h < IH && hb.x + hb.w < IW + 20;
  const ox = ok ? hb.x + hb.w / 2 : IW / 2, oy = ok ? hb.y + hb.h / 2 : IH / 2;
  const p = interpolate(fr, [18, 36], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${ox}px ${oy}px` }}>
      <Img src={f(`prints/${id}.png`)} style={{ position: "absolute", height: IH, left: -offX, top: 0 }} />
      {ok && (
        <div style={{ position: "absolute", left: hb.x, top: hb.y, width: hb.w * p, height: hb.h, border: `5px solid ${PINK}`, borderRadius: 10, background: "rgba(222,64,200,0.14)", boxShadow: "0 0 24px rgba(222,64,200,0.9)", opacity: p }} />
      )}
    </div>
  );
};

const renderTitulo = (text, italic) =>
  text.split(" ").map((w, i) =>
    w === italic ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, color: PINK }}>{w} </span> : <span key={i}>{w} </span>
  );

const TextCard = ({ headline, italic, source }) => (
  <div style={{ position: "absolute", inset: 0, padding: 56, display: "flex", flexDirection: "column", justifyContent: "center", gap: 36, background: "linear-gradient(135deg,#12101c,#0a0a12)" }}>
    <div style={{ fontFamily: MONO, fontSize: 28, color: GREY }}>{source}</div>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: "#fff", letterSpacing: -1.5 }}>{renderTitulo(headline, italic)}</div>
    <div style={{ width: 160, height: 8, borderRadius: 4, background: PINK }} />
  </div>
);

const Metrica = ({ big, small, source }) => {
  const fr = useCurrentFrame();
  const p = spring({ frame: fr - 14, fps: GFL_FPS, config: { damping: 16 } });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1186, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: big.length > 20 ? 62 : 78, lineHeight: 1.05, color: PINK, letterSpacing: -2, textShadow: "0 0 40px rgba(222,64,200,0.45)" }}>{big}</div>
      {small && <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 36, color: BODY, marginTop: 8 }}>{small}</div>}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginTop: 14 }}>fonte: {source}</div>
    </div>
  );
};

const Lateral = ({ text }) => {
  const fr = useCurrentFrame();
  const p = spring({ frame: fr - 30, fps: GFL_FPS, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", right: 56, top: 1056, maxWidth: 520, transform: `rotate(-3deg) scale(${p})`, fontFamily: MONO, fontSize: 25, lineHeight: 1.3, color: "#fff", background: "#1a1226", border: `2px solid ${PINK}`, borderRadius: 16, padding: "14px 20px", boxShadow: "0 0 30px rgba(222,64,200,0.4)" }}>{text}</div>
  );
};

const Cena = ({ s, dur }) => {
  const fr = useCurrentFrame();
  const zoom = interpolate(fr, [0, 6], [0.94, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const op = interpolate(fr, [0, 6], [0.5, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fundo />
      {s.bg && <BgVideo id={s.id} />}
      <Topo n={s.n} />
      <Pilula pill={s.pill} date={s.date} />
      <Panterinha pose={s.pose} style={{ right: 96, top: CARD.y - 300 + 96 }} />
      <CenterCard zoom={zoom}>{s.print ? <PrintCard id={s.id} box={s.box} dur={dur} /> : <TextCard headline={s.headline} italic={s.italic} source={s.source} />}</CenterCard>
      <Metrica big={s.big} small={s.small} source={s.source} />
      {s.side && <Lateral text={s.side} />}
      <Rodape pexels={s.bg} />
    </AbsoluteFill>
  );
};

const Gancho = () => {
  const fr = useCurrentFrame();
  const p = (d) => spring({ frame: fr - d, fps: GFL_FPS, config: { damping: 14 } });
  const pant = spring({ frame: fr - 6, fps: GFL_FPS, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <Fundo />
      <Topo n={1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 40, color: BODY, letterSpacing: 4, opacity: p(2), border: "1px solid rgba(255,255,255,0.3)", display: "inline-block", padding: "10px 26px", borderRadius: 12 }}>GOOGLE FLOW · GRÁTIS</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 170, lineHeight: 0.98, color: "#fff", letterSpacing: -6, marginTop: 50, opacity: p(6), transform: `translateY(${(1 - p(6)) * 60}px)` }}>Cenas<br />de <span style={{ color: PINK }}>graça</span></div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 56, color: BODY, marginTop: 40, opacity: p(14) }}>com o <span style={{ fontFamily: lora, fontStyle: "italic", color: PINK }}>mesmo</span> estilo</div>
      </div>
      <Img src={staticFile("phanterai/pantera/feliz.png")} style={{ position: "absolute", height: 420, right: -420 + pant * 470, top: 1010, transform: `rotate(${Math.sin(fr / 38) * 3}deg)` }} />
      <Rodape />
    </AbsoluteFill>
  );
};

const Cta = () => {
  const fr = useCurrentFrame();
  const p = (d) => spring({ frame: fr - d, fps: GFL_FPS, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Fundo />
      <Topo n={10} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 170, lineHeight: 1, color: "#fff", letterSpacing: -5, opacity: p(2), transform: `translateY(${(1 - p(2)) * 50}px)` }}>
          <span style={{ color: PINK }}>Salva</span> e<br /><span style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500 }}>segue</span>
        </div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", marginTop: 60, opacity: p(14) }}>@phanteraicreative</div>
      </div>
      <Panterinha pose="comemorando" size={400} style={{ right: 50, top: 1060 }} />
      <Rodape />
    </AbsoluteFill>
  );
};

// ---------- composição ----------
export const ShortGoogleFlow = ({ scenes, words, times, endSec }) => {
  if (!scenes) return null;
  const chunks = buildCaptions(words);
  const starts = times.map((t, i) => (i === 0 ? 0 : Math.round(t.s * GFL_FPS) - 3));
  const totalFrames = Math.ceil(endSec * GFL_FPS);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile("phanterai/music/Code_and_Coffe.mp3")} loop volume={0.2} />
      {scenes.map((s, i) => {
        const from = starts[i];
        const to = i + 1 < scenes.length ? starts[i + 1] : totalFrames;
        const dur = to - from;
        return (
          <Sequence key={s.n} from={from} durationInFrames={dur}>
            {s.type === "hook" ? <Gancho /> : s.type === "cta" ? <Cta /> : <Cena s={s} dur={dur} />}
            {i > 0 && <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.22} />}
          </Sequence>
        );
      })}
      <Legendas chunks={chunks} />
    </AbsoluteFill>
  );
};


// ---------- capa (still 1080x1920; zona segura do grid do IG: y 285–1635) ----------
export const CapaGoogleFlow = () => (
  <AbsoluteFill>
    <Fundo />
    <CapaTopo />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center" }}>
      <div style={{ display: "inline-flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: "#fff", background: "rgba(222,64,200,0.18)", border: `2px solid ${PINK}`, borderRadius: 999, padding: "14px 34px" }}>GOOGLE FLOW</div>
        <div style={{ fontFamily: MONO, fontSize: 34, color: BODY, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "12px 20px" }}>grátis</div>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, lineHeight: 1, color: "#fff", letterSpacing: -5, marginTop: 70 }}>
        Cenas de<br /><span style={{ color: PINK }}>graça</span>, com o<br /><span style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, color: PINK }}>mesmo</span> estilo
      </div>
      <div style={{ fontFamily: MONO, fontSize: 32, color: GREY, marginTop: 50, letterSpacing: 1 }}>50 créditos por dia · Ingredients</div>
    </div>
    <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 400, right: 60, top: 1180 }} />
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 70, textAlign: "center", fontFamily: MONO, fontSize: 28, color: GREY }}>@phanteraicreative</div>
  </AbsoluteFill>
);
const CapaTopo = () => (
  <div style={{ position: "absolute", left: 80, right: 80, top: 78, display: "flex", justifyContent: "flex-end", fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -1 }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);
