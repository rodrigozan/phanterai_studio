import { createContext, useContext } from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/DarkerGrotesque";
import { colors, radii, shadows, spacing } from "./theme";
import { achar, resolver } from "./ancoras";

export { achar, resolver };

const loaded = loadFont("normal", { weights: ["500", "700", "800", "900"] });
export const FONT = `${loaded.fontFamily}, sans-serif`;

export const W = 1920;
export const H = 1080;
export const AREA = { x: 110, y: 150, w: 1700, h: 730 };
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export const pasta = (slug, rel) => staticFile(`rodzandonadi/episodes/long-videos/${slug}/${rel}`);
export const marca = (rel) => staticFile(`rodzandonadi/marca/${rel}`);

export const SlugCtx = createContext("");
export const useSlug = () => useContext(SlugCtx);

export const DIMS = {
  "152050": [886, 387], "152248": [1588, 937], "152304": [627, 413], "152420": [572, 475], "152508": [628, 466], "152519": [607, 333],
  "154203": [1350, 713], "154224": [1001, 474], "154256": [1000, 589], "154505": [997, 481], "155256": [872, 593], "155338": [477, 170],
  "155531": [1002, 609], "155538": [986, 484], "155816": [673, 438], "155823": [641, 560], "155828": [648, 310], "160414": [657, 341],
  "160420": [632, 386], "160556": [620, 559], "160600": [619, 288], "160623": [1584, 904], "162137": [639, 239], "162600": [614, 251],
  "162719": [677, 373], "162740": [662, 563], "163408": [683, 389], "163505": [650, 475], "164829": [680, 524],
};
export const VIDEOS = { planejamento: { w: 1416, h: 884, frames: 363, src: "clipes/planejamento.mp4" }, cena_1: { w: 1336, h: 818, frames: 346, src: "clipes/cena_1.mp4" } };

export const Palco = ({ children }) => {
  const frame = useCurrentFrame();
  const a = Math.sin(frame / 90) * 60;
  return (
    <AbsoluteFill style={{ background: colors.roxoEscuro, fontFamily: FONT, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at ${50 + a / 40}% 42%, ${colors.roxo}55 0%, transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${colors.roxo}18 2px, transparent 2px), linear-gradient(90deg, ${colors.roxo}18 2px, transparent 2px)`, backgroundSize: "96px 96px", opacity: 0.6 }} />
      {children}
    </AbsoluteFill>
  );
};

export const Entrada = ({ children, dur, sair = true }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 9, Math.max(10, dur - 7), dur], [0, 1, 1, sair ? 0 : 1], clamp);
  const y = interpolate(frame, [0, 12], [26, 0], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>;
};

const fitScale = (w, h, maxS) => Math.min((AREA.w * 0.9) / w, (AREA.h * 0.94) / h, maxS);

const autoFoco = (d, w, h) => {
  const px = Math.max(40, d.w * 0.12);
  const py = Math.max(60, d.h * 0.9);
  const x = Math.max(0, d.x - px);
  const y = Math.max(0, d.y - py);
  return { x, y, w: Math.min(w, d.x + d.w + px) - x, h: Math.min(h, d.y + d.h + py) - y };
};

const CLIP = `inset(${AREA.y - 24}px ${W - AREA.x - AREA.w - 24}px ${H - AREA.y - AREA.h - 24}px ${AREA.x - 24}px round 24px)`;

export const Camera = ({ w, h, foco, dest, children, maxZoom = 3.2, zoomIn = 18, pan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s0 = fitScale(w, h, 3.4);
  const auto = !foco && dest ? autoFoco(dest, w, h) : null;
  const alvo = foco ?? auto;
  const f = alvo ?? { x: 0, y: 0, w, h };
  const sF = alvo ? Math.min((AREA.w * 0.78) / f.w, (AREA.h * 0.78) / f.h, maxZoom) : s0;
  const p = alvo ? spring({ frame: frame - zoomIn, fps, config: { damping: 200 }, durationInFrames: 30 }) : 0;
  const s = s0 + (Math.max(sF, s0) - s0) * p;
  const cx = w / 2 + (f.x + f.w / 2 - w / 2) * p;
  const cy = h / 2 + (f.y + f.h / 2 - h / 2) * p + (pan ? pan(frame) : 0);
  const tx = AREA.x + AREA.w / 2 - cx * s;
  const ty = AREA.y + AREA.h / 2 - cy * s;
  return (
    <AbsoluteFill style={{ clipPath: CLIP }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 16 / s, overflow: "hidden", boxShadow: `0 ${24 / s}px ${70 / s}px rgba(0,0,0,0.55), 0 0 0 ${3 / s}px ${colors.roxo}` }}>
        {children}
        {dest && <Destaque r={dest} s={s} delay={zoomIn + 12} />}
      </div>
    </div>
    </AbsoluteFill>
  );
};

export const Destaque = ({ r, s, delay = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
  const pulso = 0.75 + 0.25 * Math.sin((frame - delay) / 6);
  const pad = 6 / s;
  return (
    <div style={{ position: "absolute", left: r.x - pad, top: r.y - pad, width: r.w + pad * 2, height: r.h + pad * 2, borderRadius: 10 / s, border: `${5 / s}px solid ${colors.amarelo}`, boxShadow: `0 0 0 9999px rgba(31,5,38,${0.5 * o}), 0 0 ${28 / s}px ${colors.amarelo}`, opacity: 0.55 + 0.45 * pulso * o }} />
  );
};

export const Captura = ({ img, foco, dest, rotulo, pan, maxZoom }) => {
  const slug = useSlug();
  const [w, h] = DIMS[img];
  return (
    <AbsoluteFill>
      <Camera w={w} h={h} foco={foco} dest={dest} pan={pan} maxZoom={maxZoom}>
        <Img src={pasta(slug, `capturas/${img}.png`)} style={{ width: w, height: h, display: "block" }} />
      </Camera>
      {rotulo && <Rotulo>{rotulo}</Rotulo>}
    </AbsoluteFill>
  );
};

export const Clip = ({ nome, foco, dest, dur, rotulo, taxa, ate, de = 0 }) => {
  const slug = useSlug();
  const v = VIDEOS[nome];
  const frame = useCurrentFrame();
  const rate = taxa ?? (ate ? (v.frames - de) / Math.max(30, ate) : Math.max(1, (v.frames - de) / Math.max(30, dur - 12)));
  const fim = Math.floor((v.frames - de) / rate);
  return (
    <AbsoluteFill>
      <Camera w={v.w} h={v.h} foco={foco} dest={dest} zoomIn={Math.max(0, fim - 40)} maxZoom={1.7}>
        {frame < fim ? (
          <OffthreadVideo src={pasta(slug, v.src)} muted playbackRate={rate} startFrom={de} style={{ width: v.w, height: v.h, display: "block" }} />
        ) : (
          <Freeze frame={fim - 1}>
            <OffthreadVideo src={pasta(slug, v.src)} muted playbackRate={rate} startFrom={de} style={{ width: v.w, height: v.h, display: "block" }} />
          </Freeze>
        )}
      </Camera>
      {rotulo && <Rotulo>{rotulo}</Rotulo>}
    </AbsoluteFill>
  );
};

export const Rotulo = ({ children, cor = colors.amarelo, fundo = colors.roxoEscuro, pos = "bl" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 16], [0, 1], clamp);
  const base = pos === "bl" ? { left: AREA.x } : { right: AREA.x };
  return (
    <div style={{ position: "absolute", top: 98, ...base, opacity: o, background: cor, color: fundo, fontWeight: 800, fontSize: 38, letterSpacing: 2, textTransform: "uppercase", padding: "6px 22px", borderRadius: radii.pill, transform: `translateY(${(1 - o) * 12}px)` }}>{children}</div>
  );
};

export const Titulo = ({ children, sub, y = 330, size = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: y }}>
      <div style={{ color: colors.branco, fontWeight: 900, fontSize: size, lineHeight: 0.95, textAlign: "center", textTransform: "uppercase", transform: `scale(${0.9 + sp * 0.1})`, opacity: sp, maxWidth: 1500 }}>{children}</div>
      {sub && <div style={{ marginTop: 34, color: colors.amarelo, fontWeight: 700, fontSize: 56, opacity: interpolate(frame, [14, 28], [0, 1], clamp), textAlign: "center", maxWidth: 1400 }}>{sub}</div>}
    </AbsoluteFill>
  );
};

export const Etiqueta = ({ fonte, dur = 150 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", right: 40, top: 100, opacity: o, transform: `translateX(${(1 - o) * 40}px)`, background: colors.cinza, color: colors.preto, borderRadius: radii.md, padding: "10px 24px 12px", boxShadow: shadows.suave, borderLeft: `10px solid ${colors.amarelo}`, maxWidth: 640 }}>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: colors.roxo }}>Fonte</div>
      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.05 }}>{fonte}</div>
    </div>
  );
};

export const ETAPAS = ["Preparar", "Skills", "Planejar", "Ajustar", "Escrever"];

export const BarraCapitulos = ({ ativa, progresso = 1, etapas = ETAPAS }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", justifyContent: "center", gap: 14, opacity: progresso }}>
    {etapas.map((e, i) => {
      const on = i === ativa;
      const feito = i < ativa;
      return (
        <div key={e} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 22px", borderRadius: radii.pill, background: on ? colors.amarelo : feito ? `${colors.roxo}` : "transparent", border: `3px solid ${on ? colors.amarelo : colors.roxo}`, color: on ? colors.roxoEscuro : feito ? colors.branco : `${colors.cinza}99`, fontWeight: 800, fontSize: 32, letterSpacing: 2, textTransform: "uppercase" }}>
          <span style={{ opacity: 0.8 }}>{i + 1}</span>{e}
        </div>
      );
    })}
  </div>
);

export const Legendas = ({ palavras }) => {
  const frame = useCurrentFrame();
  const grupos = [];
  let atual = [];
  palavras.forEach((p, i) => {
    atual.push(i);
    const fim = /[.!?:;]$/.test(p.w) || (/,$/.test(p.w) && atual.length >= 4) || atual.length >= 7;
    if (fim) { grupos.push(atual); atual = []; }
  });
  if (atual.length) grupos.push(atual);
  const g = grupos.find((gr) => frame >= palavras[gr[0]].s - 3 && frame <= palavras[gr[gr.length - 1]].e + 10);
  if (!g) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(31,5,38,0.86)", border: `3px solid ${colors.roxo}`, borderRadius: radii.lg, padding: "10px 40px 14px", fontWeight: 800, fontSize: 64, color: colors.branco, textAlign: "center", maxWidth: 1600, lineHeight: 1.05 }}>
        {g.map((i) => {
          const ativa = frame >= palavras[i].s - 1;
          const agora = ativa && frame <= palavras[i].e + 1;
          return <span key={i} style={{ color: agora ? colors.roxoEscuro : ativa ? colors.branco : `${colors.cinza}88`, background: agora ? colors.amarelo : "transparent", borderRadius: 8, padding: "0 6px", marginRight: 4 }}>{palavras[i].w}</span>;
        })}
      </div>
    </div>
  );
};

export const Cartao = ({ children, style }) => (
  <div style={{ background: `${colors.roxo}`, borderRadius: radii.lg, border: `4px solid ${colors.amarelo}`, boxShadow: shadows.suave, color: colors.branco, ...style }}>{children}</div>
);

export const aparece = (frame, de, dur = 14) => interpolate(frame, [de, de + dur], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });

export { Sequence, spacing };
