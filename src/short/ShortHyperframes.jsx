import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { MUSIC_VOLUME } from "../theme";

const sora = loadSora("normal", { weights: ["800"] }).fontFamily;
const inter = loadInter("normal", { weights: ["400", "600"] }).fontFamily;
const mono = loadMono("normal", { weights: ["500"] }).fontFamily;

export const HF_SLUG = "short-hyperframes";
export const HF_FPS = 30;
export const HF_FRAMES = Math.round(50.3 * HF_FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const fr = (s) => Math.round(s * HF_FPS);

const M1 = "#B0179F";
const M2 = "#FF1FBF";
const M3 = "#FF5BD6";
const BG = "#080810";
const GRAD = { background: `linear-gradient(90deg, ${M1}, ${M2}, ${M3})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };

// Cenas pela duração real das falas (montagem-plano.md): [início s, duração s]
const CENAS = [
  [0.0, 4.88],
  [5.06, 11.33],
  [16.57, 9.0],
  [25.76, 11.97],
  [37.91, 7.57],
  [45.66, 4.61],
];

const Fundo = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", left: -380 + Math.sin(f / 55) * 100, top: 80 + Math.cos(f / 70) * 90, background: `radial-gradient(circle, ${M1}55 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", right: -320 - Math.sin(f / 60) * 80, bottom: 120 + Math.cos(f / 48) * 100, background: `radial-gradient(circle, ${M2}33 0%, transparent 70%)`, filter: "blur(70px)" }} />
    </AbsoluteFill>
  );
};

const Rodape = () => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: mono, fontSize: 30, color: "#ffffff88", letterSpacing: 1 }}>@phanteraicreative</div>
);

// Entrada blur-slide por palavra (cartão blur-slide do Shotcraft)
const Palavras = ({ texto, em = 0, size = 120, grad = false, cor = "#fff", passo = 5, style = {} }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: sora, fontWeight: 800, fontSize: size, lineHeight: 1.05, textAlign: "center", textTransform: "uppercase", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.28}px`, ...style }}>
      {texto.split(" ").map((w, i) => {
        const t = f - em - i * passo;
        const p = interpolate(t, [0, 14], [0, 1], clamp);
        const e = 1 - Math.pow(1 - p, 3);
        return (
          <span key={i} style={{ display: "inline-block", opacity: e, filter: `blur(${(1 - e) * 22}px)`, transform: `translateY(${(1 - e) * 46}px)`, ...(grad ? GRAD : { color: cor }) }}>{w}</span>
        );
      })}
    </div>
  );
};

const Rotulo = ({ children, em = 0, size = 40, cor = "#ffffffcc", style = {} }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - em, [0, 12], [0, 1], clamp);
  return <div style={{ fontFamily: inter, fontWeight: 600, fontSize: size, color: cor, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 24}px)`, ...style }}>{children}</div>;
};

// Corte entre cenas: fade curto na entrada e na saída
const Cena = ({ de, dur, children }) => (
  <Sequence from={fr(de)} durationInFrames={fr(dur)}>
    <FadeWrap>{children}</FadeWrap>
  </Sequence>
);
const FadeWrap = ({ children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 5], [0, 1], clamp), interpolate(f, [durationInFrames - 6, durationInFrames], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Centro = ({ children, gap = 40 }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px", display: "flex", flexDirection: "column", gap }}>{children}</AbsoluteFill>
);

// ---------- cenas ----------
const Cena1 = () => (
  <Centro gap={30}>
    <Palavras texto="REEL COM CLAUDE" em={2} size={128} />
    <Palavras texto="SEM CRÉDITO" em={18} size={150} grad />
    <Palavras texto="DE IA" em={30} size={128} />
  </Centro>
);

const CODIGO = `<div class="reel">
  <h1 class="titulo">Reel em código</h1>
  <p>Escrito pelo Claude</p>
</div>`;

const Cena2 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fimA = fr(5.2);
  if (f < fimA + 6) {
    const sai = interpolate(f, [fimA - 6, fimA + 6], [1, 0], clamp);
    return (
      <Centro gap={30}>
        <div style={{ opacity: sai, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <Palavras texto="NÃO É GERADO." em={2} size={124} />
          <Palavras texto="É CÓDIGO." em={30} size={150} grad />
        </div>
      </Centro>
    );
  }
  const t = f - fimA - 6;
  const chars = Math.round(interpolate(t, [4, 120], [0, CODIGO.length], clamp));
  const entrada = interpolate(t, [0, 12], [0, 1], clamp);
  const tSeta = t - 140;
  const seta = tSeta > 0 ? spring({ frame: tSeta, fps, config: { damping: 9, mass: 0.6, stiffness: 150 } }) : 0;
  const mp4 = tSeta > 14 ? spring({ frame: tSeta - 14, fps, config: { damping: 7, mass: 0.5, stiffness: 190 } } ) : 0;
  const zoom = 1 + (mp4 > 0 ? Math.max(0, 0.35 * (1 - Math.min(1, (tSeta - 14) / 10))) : 0);
  return (
    <Centro gap={60}>
      <div style={{ opacity: entrada, transform: `translateY(${(1 - entrada) * 40}px)`, width: 900, background: "#0f0f1d", border: `2px solid ${M1}`, borderRadius: 28, padding: "40px 44px", boxShadow: `0 0 60px ${M1}55` }}>
        <div style={{ fontFamily: mono, fontSize: 18, color: M3, marginBottom: 20, letterSpacing: 2 }}>reel.html</div>
        <pre style={{ margin: 0, fontFamily: mono, fontWeight: 500, fontSize: 34, lineHeight: 1.5, color: "#e9e7f5", whiteSpace: "pre-wrap" }}>{CODIGO.slice(0, chars)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: M2 }}>▌</span></pre>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 36, opacity: seta, transform: `scale(${0.8 + 0.2 * seta})` }}>
        <span style={{ fontFamily: sora, fontWeight: 800, fontSize: 120, color: "#fff" }}>HTML</span>
        <span style={{ fontFamily: sora, fontWeight: 800, fontSize: 110, ...GRAD }}>→</span>
        <span style={{ fontFamily: sora, fontWeight: 800, fontSize: 120, display: "inline-block", opacity: Math.min(1, mp4 * 1.5), transform: `scale(${zoom * (0.9 + 0.1 * Math.min(1, mp4))})`, ...GRAD }}>MP4</span>
      </div>
    </Centro>
  );
};

const Passo = ({ n, titulo, sub, em }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 12, mass: 0.7, stiffness: 130 } });
  return (
    <div style={{ width: 920, display: "flex", alignItems: "center", gap: 36, padding: "38px 44px", background: "#10101f", border: `2px solid ${M1}`, borderRadius: 32, opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 80}px) scale(${0.94 + 0.06 * s})`, boxShadow: `0 0 50px ${M1}44` }}>
      <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 110, minWidth: 100, ...GRAD }}>{n}</div>
      <div>
        <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 64, color: "#fff", textTransform: "uppercase" }}>{titulo}</div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 34, color: "#ffffffaa", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};
const Cena3 = () => (
  <Centro gap={44}>
    <Passo n="1" titulo="Você pede" sub="em português, do seu jeito" em={fr(0.3)} />
    <Passo n="2" titulo="Prévia" sub="o Claude mostra antes de gravar" em={fr(3.6)} />
    <Passo n="3" titulo="Seu ok → render" sub="só renderiza com a sua aprovação" em={fr(6.2)} />
  </Centro>
);

const Selo = ({ texto, sub, em }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 10, mass: 0.6, stiffness: 150 } });
  return (
    <div style={{ opacity: Math.min(1, s * 1.4), transform: `scale(${s}) rotate(${(1 - s) * -4}deg)`, textAlign: "center" }}>
      <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 92, lineHeight: 1.05, textTransform: "uppercase", ...GRAD }}>{texto}</div>
      {sub ? <div style={{ fontFamily: mono, fontSize: 34, color: "#ffffffaa", marginTop: 12 }}>{sub}</div> : null}
    </div>
  );
};
const Cena4 = () => (
  <Centro gap={70}>
    <Selo texto="CÓDIGO ABERTO" sub="Apache 2.0" em={fr(0.3)} />
    <Selo texto="1080×1920" sub="vertical, pronto pro Reels" em={fr(4.6)} />
    <Selo texto="SEM MARCA D'ÁGUA" sub="quantas vezes quiser" em={fr(8.0)} />
  </Centro>
);

const Cena5 = () => (
  <Centro gap={50}>
    <Palavras texto="AVISO" em={2} size={150} grad />
    <Palavras texto="HONESTO" em={8} size={150} />
    <Rotulo em={fr(2.4)} size={44} style={{ fontFamily: mono, fontWeight: 500 }}>Sem pessoa realista · usa o limite do seu plano</Rotulo>
  </Centro>
);

const Cena6 = () => (
  <Centro gap={40}>
    <Palavras texto="SALVA E" em={2} size={140} />
    <Palavras texto="MANDA" em={12} size={170} grad />
    <Rotulo em={fr(1.6)} size={32} style={{ fontFamily: mono, fontWeight: 500, color: "#ffffff88" }}>Fonte: guia Deploy Club · HyperFrames (HeyGen)</Rotulo>
    <Rotulo em={fr(2.4)} size={56} cor={M3} style={{ fontFamily: sora, fontWeight: 800 }}>@phanteraicreative</Rotulo>
  </Centro>
);

export const ShortHyperframes = ({ voz = `episodes/${HF_SLUG}/locucao.wav` }) => {
  const cenas = [Cena1, Cena2, Cena3, Cena4, Cena5, Cena6];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("music/CuriousFocus.mp3")} volume={MUSIC_VOLUME} />
      {voz ? <Audio src={staticFile(voz)} /> : null}
      <Fundo />
      {cenas.map((C, i) => (
        <Cena key={i} de={CENAS[i][0]} dur={CENAS[i][1]}>
          <C />
        </Cena>
      ))}
      <Rodape />
    </AbsoluteFill>
  );
};

export const calculateHyperframesMetadata = async ({ props }) => ({ durationInFrames: HF_FRAMES, fps: HF_FPS, props });
