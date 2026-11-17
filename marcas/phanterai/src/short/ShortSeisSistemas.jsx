import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 17/11/2026 18:00 — 6 sistemas com o Claude (anthropics/claude-quickstarts). Visual de cada cena em tela cheia
// (Pexels, imagem oficial dos quickstarts/página do repositório ou motion graphic). Nenhum crédito/fonte na tela: tudo vai só no texto do post.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SSC_SLUG = "phanterai/episodes/reel-2026-11-17-1800-6-sistemas-claude";
export const SSC_FPS = 30;
const f = (p) => staticFile(`${SSC_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

const PINK = "rgb(222,64,200)";
const BODY = "rgb(205,202,222)";
const GREY = "rgb(150,150,175)";
const BG = "#08080D";
const TOTAL = 8;
const MUSIC = "phanterai/music/Coding_at_Night.mp3";

export const calculateSeisSistemasMetadata = async () => {
  const [scenes, wordsJson, times] = await Promise.all(
    ["data/scenes.json", "audio/words.json", "audio/scene-times.json"].map((p) => fetch(f(p)).then((r) => r.json()))
  );
  const end = wordsJson.words[wordsJson.words.length - 1].e;
  return {
    durationInFrames: Math.ceil((end + 0.6) * SSC_FPS),
    props: { scenes, words: wordsJson.words, times, endSec: end + 0.6 },
  };
};

const Fundo = () => (
  <AbsoluteFill style={{ background: BG }}>
    <div style={{ position: "absolute", width: 1200, height: 1200, right: -420, top: -420, borderRadius: "50%", background: "radial-gradient(circle, rgba(130,70,255,0.34) 0%, transparent 68%)" }} />
    <div style={{ position: "absolute", width: 1200, height: 1200, left: -480, bottom: -480, borderRadius: "50%", background: "radial-gradient(circle, rgba(222,64,200,0.28) 0%, transparent 68%)" }} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
  </AbsoluteFill>
);

// gradientes só nas bordas para o contador (topo) e as legendas (base) ficarem legíveis
const Vinheta = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 16%, transparent 62%, rgba(0,0,0,0.82) 76%, rgba(0,0,0,0.9) 100%)" }} />
);

const Topo = ({ n }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top: 78, display: "flex", justifyContent: "space-between", alignItems: "center", textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
    <div style={{ fontFamily: MONO, fontSize: 34, color: BODY, letterSpacing: 2 }}>
      <span style={{ color: "#fff" }}>{String(n).padStart(2, "0")}</span> / {TOTAL}
    </div>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -1 }}>
      Phanter<span style={{ color: PINK }}>AI</span>
    </div>
  </div>
);

// panterinha entra pelo canto com mola
const Panterinha = ({ pose, size = 330, right = 40, top = 1120, delay = 4 }) => {
  const fr = useCurrentFrame();
  const p = spring({ frame: fr - delay, fps: SSC_FPS, config: { damping: 13 } });
  return (
    <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: size, right: right - (1 - p) * (size + 80), top, transform: `rotate(${Math.sin(fr / 38) * 3}deg)`, transformOrigin: "50% 100%" }} />
  );
};

// ---------- legendas (tempo absoluto, nível raiz) ----------
const SUBS = [
  [["arroba", "phanter", "a", "i", "creative"], "@phanteraicreative"],
  [["seis"], "6"],
];
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const buildCaptions = (words) => {
  const toks = [];
  for (let i = 0; i < words.length; ) {
    let hit = null;
    for (const [seq, out] of SUBS) if (seq.every((s, k) => words[i + k] && norm(words[i + k].w) === s)) { hit = [seq, out]; break; }
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
  const t = useCurrentFrame() / SSC_FPS;
  let ci = -1;
  chunks.forEach((c, i) => { if (c[0].s <= t + 0.02) ci = i; });
  if (ci < 0) return null;
  const chunk = chunks[ci];
  const len = chunk.map((c) => c.t).join(" ").length;
  const fs = len > 28 ? 50 : len > 20 ? 60 : 72;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1520, height: 180, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: fs, lineHeight: 1.12, color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9)" }}>
        {chunk.map((w, i) => {
          const on = t >= w.s - 0.02 && t < (chunk[i + 1] ? chunk[i + 1].s : w.e + 0.4);
          return <span key={i} style={{ color: on ? PINK : "#fff", marginRight: i < chunk.length - 1 ? 18 : 0 }}>{w.t}</span>;
        })}
      </div>
    </div>
  );
};

// ---------- planos em tela cheia ----------
const Plano = ({ shot, dur, dir }) => {
  const fr = useCurrentFrame();
  const z = interpolate(fr, [0, dur], [1.04, 1.16], clamp);
  const x = interpolate(fr, [0, dur], [dir * -20, dir * 20], clamp);
  const ent = interpolate(fr, [0, 8], [1, 0], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const style = { width: "100%", height: "100%", objectFit: "cover", objectPosition: shot.pos || "50% 50%" };
  return (
    <AbsoluteFill style={{ transform: `translateX(${ent * dir * 140}px) scale(${z + ent * 0.08}) translateX(${x}px)`, opacity: 1 - ent * 0.4 }}>
      {shot.kind === "video" ? <OffthreadVideo src={f(shot.file)} muted style={style} /> : shot.scroll
        ? <Img src={f(shot.file)} style={{ width: "100%", position: "absolute", top: 0, transform: `translateY(${interpolate(fr, [0, dur], [0, -270], clamp)}px)` }} />
        : <Img src={f(shot.file)} style={style} />}
    </AbsoluteFill>
  );
};

const Planos = ({ shots, dur }) => {
  const each = Math.ceil(dur / shots.length);
  return shots.map((sh, i) => (
    <Sequence key={i} from={i * each} durationInFrames={i === shots.length - 1 ? dur - i * each : each}>
      <Plano shot={sh} dur={each} dir={i % 2 ? -1 : 1} />
    </Sequence>
  ));
};

// ---------- sobreposições de motion ----------
const pop = (fr, d) => spring({ frame: fr - d, fps: SSC_FPS, config: { damping: 14 } });

const Kinetic = ({ text }) => {
  const fr = useCurrentFrame();
  const [a, b] = text.split("|");
  return (
    <div style={{ position: "absolute", left: 50, top: 290, padding: "20px 36px 30px", borderRadius: 30, background: "rgba(8,8,13,0.78)", boxShadow: "0 10px 60px rgba(0,0,0,0.6)", textShadow: "0 6px 30px rgba(0,0,0,0.85)" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", letterSpacing: -3, opacity: pop(fr, 2), transform: `translateY(${(1 - pop(fr, 2)) * 50}px)` }}>{a}</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 150, color: PINK, lineHeight: 1, transform: `scale(${pop(fr, 12)})`, transformOrigin: "0% 50%" }}>{b}</div>
    </div>
  );
};

const Tag = ({ text, top = 300 }) => {
  const fr = useCurrentFrame();
  const p = pop(fr, 6);
  return (
    <div style={{ position: "absolute", left: 70, top, transform: `translateX(${(1 - p) * -600}px)`, fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", background: "rgba(10,8,18,0.72)", border: `3px solid ${PINK}`, borderRadius: 22, padding: "18px 34px", boxShadow: "0 0 40px rgba(222,64,200,0.45)" }}>{text}</div>
  );
};

const Badge = ({ text, delay = 22 }) => {
  const fr = useCurrentFrame();
  const p = pop(fr, delay);
  return (
    <div style={{ position: "absolute", left: 70, top: 1010, transform: `scale(${p})`, transformOrigin: "0% 50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, fontFamily: inter, fontWeight: 800, color: "#fff", background: PINK, borderRadius: 30, padding: "16px 40px 20px", boxShadow: "0 10px 50px rgba(222,64,200,0.6)", whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 34, letterSpacing: 3, opacity: 0.85 }}>QUEM COMPRA</span>
      <span style={{ fontSize: 62 }}>{text}</span>
    </div>
  );
};

const Lista = ({ items, no, top = 300 }) => {
  const fr = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 70, top, display: "flex", flexDirection: "column", gap: 20 }}>
      {items.map((t, i) => {
        const p = pop(fr, 4 + i * 12);
        return <div key={t} style={{ transform: `translateX(${(1 - p) * -700}px)`, fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", background: "rgba(10,8,18,0.72)", borderLeft: `10px solid ${PINK}`, borderRadius: 14, padding: "12px 30px", alignSelf: "flex-start" }}>{t}</div>;
      })}
      {no && <div style={{ transform: `scale(${pop(fr, 150)})`, transformOrigin: "0% 50%", fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", background: "rgba(200,30,60,0.85)", borderRadius: 14, padding: "12px 30px", alignSelf: "flex-start", marginTop: 16 }}>✕ {no}</div>}
    </div>
  );
};

const Troca = ({ a, b }) => {
  const fr = useCurrentFrame();
  const cut = interpolate(fr, [40, 52], [0, 1], clamp);
  const p = pop(fr, 56);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1110, textShadow: "0 6px 30px rgba(0,0,0,0.85)" }}>
      <div style={{ position: "relative", display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", opacity: pop(fr, 2) * (1 - cut * 0.45) }}>
        {a}
        <div style={{ position: "absolute", left: 0, top: "52%", height: 12, width: `${cut * 100}%`, background: PINK, borderRadius: 6 }} />
      </div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 160, color: PINK, lineHeight: 1.05, transform: `scale(${p})`, transformOrigin: "0% 50%" }}>{b}</div>
    </div>
  );
};

// cena 6: celular com o vídeo + chips de disponibilidade
const Celular = ({ shot, chips }) => {
  const fr = useCurrentFrame();
  const ent = pop(fr, 0);
  return (
    <AbsoluteFill>
      <Fundo />
      <div style={{ position: "absolute", left: 250, top: 300, width: 580, height: 1160, borderRadius: 80, background: "#000", border: "14px solid #1d1b26", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(130,70,255,0.35)", overflow: "hidden", transform: `translateY(${(1 - ent) * 900}px) rotate(${interpolate(fr, [0, 150], [-3, 2], clamp)}deg)` }}>
        <OffthreadVideo src={f(shot.file)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(fr, [0, 150], [1.05, 1.18], clamp)})` }} />
      </div>
      {chips.map((c, i) => {
        const p = pop(fr, 12 + i * 14);
        return <div key={c} style={{ position: "absolute", top: 520 + i * 220, [i % 2 ? "right" : "left"]: 60, transform: `scale(${p}) rotate(${i % 2 ? 4 : -4}deg)`, fontFamily: inter, fontWeight: 800, fontSize: 72, color: "#fff", background: PINK, borderRadius: 24, padding: "20px 40px", boxShadow: "0 10px 50px rgba(222,64,200,0.6)" }}>{c}</div>;
      })}
    </AbsoluteFill>
  );
};

const Cta = () => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 120, lineHeight: 1.02, color: "#fff", letterSpacing: -4, opacity: pop(fr, 2), transform: `translateY(${(1 - pop(fr, 2)) * 50}px)` }}>
          Qual você<br /><span style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, color: PINK }}>montaria</span>?
        </div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff", marginTop: 70, opacity: pop(fr, 30) }}>@phanteraicreative</div>
      </div>
      <Panterinha pose="comemorando" size={400} right={60} top={1060} delay={10} />
    </AbsoluteFill>
  );
};

const Cena = ({ s, dur }) => {
  if (s.motion === "phone") return (<><Celular shot={s.shots[0]} chips={s.chips} />{s.tag && <Tag text={s.tag} top={170} />}<Topo n={s.n} /></>);
  if (s.motion === "cta") return (<><Cta /><Topo n={s.n} /></>);
  return (
    <AbsoluteFill>
      <Planos shots={s.shots} dur={dur} />
      <Vinheta />
      {s.kinetic && <Kinetic text={s.kinetic} />}
      {s.tag && <Tag text={s.tag} />}
      {s.badge && <Badge text={s.badge} delay={Math.round(dur * 0.55)} />}
      {s.list && <Lista items={s.list} no={s.no} top={s.listTop || 300} />}
      {s.swap && <Troca a={s.swap[0]} b={s.swap[1]} />}
      {s.pose && <Panterinha pose={s.pose} size={300} right={30} top={1180} delay={s.n === 1 ? 20 : 30} />}
      <Topo n={s.n} />
    </AbsoluteFill>
  );
};

export const ShortSeisSistemas = ({ scenes, words, times, endSec }) => {
  if (!scenes) return null;
  const chunks = buildCaptions(words);
  const starts = times.map((t, i) => (i === 0 ? 0 : Math.round(t.s * SSC_FPS) - 3));
  const totalFrames = Math.ceil(endSec * SSC_FPS);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {scenes.map((s, i) => {
        const from = starts[i];
        const to = i + 1 < scenes.length ? starts[i + 1] : totalFrames;
        const dur = to - from;
        const nShots = s.motion ? 1 : s.shots.length;
        const each = Math.ceil(dur / nShots);
        return (
          <Sequence key={s.n} from={from} durationInFrames={dur}>
            <Cena s={s} dur={dur} />
            {Array.from({ length: nShots }).map((_, k) => (i > 0 || k > 0) && (
              <Sequence key={k} from={k * each} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.22} /></Sequence>
            ))}
          </Sequence>
        );
      })}
      <Legendas chunks={chunks} />
    </AbsoluteFill>
  );
};

// ---------- capa (still 1080x1920; zona segura do grid do IG: y 285–1635) ----------
export const CapaSeisSistemas = () => (
  <AbsoluteFill>
    <Fundo />
    <div style={{ position: "absolute", left: 80, right: 80, top: 78, display: "flex", justifyContent: "flex-end", fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -1 }}>
      Phanter<span style={{ color: PINK }}>AI</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: "#fff", background: "rgba(222,64,200,0.18)", border: `2px solid ${PINK}`, borderRadius: 999, padding: "14px 34px" }}>CÓDIGO OFICIAL DA ANTHROPIC</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 130, lineHeight: 1.02, color: "#fff", letterSpacing: -5, marginTop: 70 }}>
        6 sistemas<br />para montar<br />com o <span style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, color: PINK }}>Claude</span>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: BODY, marginTop: 40 }}>e <span style={{ color: PINK }}>quem compra</span> cada um</div>
    </div>
    <Img src={staticFile("phanterai/pantera/apontando.png")} style={{ position: "absolute", height: 380, right: 60, top: 1220 }} />
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 70, textAlign: "center", fontFamily: MONO, fontSize: 28, color: GREY }}>@phanteraicreative</div>
  </AbsoluteFill>
);
