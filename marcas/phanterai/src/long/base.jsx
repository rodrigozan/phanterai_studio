// Blocos de vídeo longo (16:9, 1920x1080) no mesmo visual dos Shorts da PhanterAI:
// fundo roxo com luz em movimento, texto cinético, panterinha flutuando, faíscas, legenda palavra por palavra.
// Todos os tempos `em` são frames LOCAIS da cena (long-timeline.js resolve `ao: "palavra"` em `em`).
import { createContext, useContext } from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { colors } from "../theme";
import { Sfx } from "../components/Sfx";
import { FONT, FundoMarca, Pantera, Texto, CenaInterna } from "../short/ShortTempero";

export { FONT, FundoMarca, Pantera, Texto, CenaInterna, Sfx };

export const W = 1920;
export const H = 1080;
export const CIANO = "#22D3EE";
export const LARANJA = "#D97757"; // cor do Claude Code
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const { fontFamily: MONO } = loadFont("normal", { weights: ["500", "700"] });
export { MONO };

export const pasta = (slug, rel) => staticFile(`phanterai/episodes/long-videos/${slug}/${rel}`);

// ---------- fundos ----------

export const Faiscas169 = ({ n = 18, cor = colors.gold }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`x${i}`) * W;
        const vel = 1.2 + random(`v${i}`) * 2.6;
        const tam = 5 + random(`s${i}`) * 13;
        const fase = random(`f${i}`) * H * 2;
        const y = H + 60 - ((frame * vel * 1.6 + fase) % (H + 160));
        const dx = Math.sin((frame + i * 17) / 20) * 40;
        const piscar = 0.35 + 0.65 * Math.abs(Math.sin((frame + i * 11) / 9));
        const c = i % 3 ? cor : colors.violetLight;
        return <div key={i} style={{ position: "absolute", left: x + dx, top: y, width: tam, height: tam, borderRadius: "50%", background: c, opacity: piscar * 0.75, boxShadow: `0 0 ${tam * 2}px ${c}` }} />;
      })}
    </AbsoluteFill>
  );
};

// Vídeo ou foto do Pexels em tela cheia: escurecido, com zoom lento (foto) ou loop (vídeo).
// `src` = caminho relativo à pasta do vídeo (ex.: "pexels/codigo.mp4").
export const Fundo = ({ slug, src, dur, escurecer = 0.55, tom = colors.bgOuter }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const video = /\.mp4$/i.test(src);
  const z = interpolate(frame, [0, durationInFrames], [1.04, 1.16], clamp);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        {video ? (
          <Loop durationInFrames={Math.max(30, Math.floor((dur ?? 8) * fps) - 2)}><OffthreadVideo src={pasta(slug, src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Loop>
        ) : (
          <Img src={pasta(slug, src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tom}${Math.round(escurecer * 255).toString(16).padStart(2, "0")} 0%, ${tom}${Math.round(Math.min(1, escurecer + 0.25) * 255).toString(16).padStart(2, "0")} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 20%, ${colors.violet}33, transparent 60%)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// ---------- peças ----------

// Entra com mola no frame `em`; toca o som (pop por padrão, `sfx={null}` desliga).
export const Pop = ({ em = 0, children, style = {}, sfx = "pop", de = 0.0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 11, mass: 0.6, stiffness: 150 } });
  return (
    <div style={{ transform: `scale(${de + (1 - de) * s})`, opacity: Math.min(1, s * 1.4), ...style }}>
      {sfx ? <Sfx name={sfx} atFrame={em} /> : null}
      {children}
    </div>
  );
};

// Entra deslizando de um lado.
export const Desliza = ({ em = 0, de = "esq", dist = 160, children, style = {} }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - em, [0, 12], [0, 1], clamp);
  if (frame < em) return null;
  const e = 1 - Math.pow(1 - t, 3);
  const dx = de === "esq" ? -dist : de === "dir" ? dist : 0;
  const dy = de === "cima" ? -dist : de === "baixo" ? dist : 0;
  return <div style={{ opacity: e, transform: `translate(${dx * (1 - e)}px, ${dy * (1 - e)}px)`, ...style }}>{children}</div>;
};

export const Glitch = ({ children, size = 170, cor = "#fff" }) => {
  const frame = useCurrentFrame();
  const forte = frame < 26 || frame % 53 < 4;
  const dx = forte ? Math.sin(frame * 7.3) * 12 : 0;
  const base = { ...FONT, fontSize: size, position: "absolute", left: 0, right: 0, top: 0, transform: `translateX(${dx}px)` };
  return (
    <div style={{ position: "relative", height: size * 1.15, width: W }}>
      {forte ? <div style={{ ...base, color: CIANO, transform: `translateX(${dx - 10}px)`, mixBlendMode: "screen", opacity: 0.8 }}>{children}</div> : null}
      {forte ? <div style={{ ...base, color: colors.red, transform: `translateX(${dx + 10}px)`, mixBlendMode: "screen", opacity: 0.8 }}>{children}</div> : null}
      <div style={{ ...base, color: cor, WebkitTextStroke: "4px #05040C", paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(0,0,0,0.55)" }}>{children}</div>
    </div>
  );
};

// Cartão grande com título e subtítulo.
export const Cartao = ({ em = 0, cor = colors.violetLight, titulo, sub, w = 520, h = 200, size = 54, sfx = "pop", icone, style = {} }) => (
  <Pop em={em} sfx={sfx} style={{ width: w, minHeight: h, borderRadius: 34, background: `linear-gradient(135deg, ${cor}40, #140B2Eee)`, border: `4px solid ${cor}`, boxShadow: `0 0 50px ${cor}55`, padding: "22px 30px", display: "flex", alignItems: "center", gap: 24, ...style }}>
    {icone ? <div style={{ ...FONT, fontSize: size * 1.7, color: cor, minWidth: size * 1.3 }}>{icone}</div> : null}
    <div style={{ flex: 1 }}>
      <div style={{ ...FONT, textAlign: "left", textTransform: "none", fontSize: size, color: "#fff", lineHeight: 1.1 }}>{titulo}</div>
      {sub ? <div style={{ ...FONT, textAlign: "left", textTransform: "none", fontSize: size * 0.58, color: cor, fontWeight: 700, marginTop: 6 }}>{sub}</div> : null}
    </div>
  </Pop>
);

// Pantera de cena: pose + posição em px (nunca espelhada).
export const PanteraCtx = createContext(true);
export const Pant = ({ pose = "feliz", x = 1700, y = 780, w = 380, em = 6 }) => {
  const ligada = useContext(PanteraCtx);
  return ligada ? <Pantera pose={pose} left={x} top={y} width={w} em={em} /> : null;
};

// ---------- cursor do mouse ----------
// pontos: [{ f, x, y }] (frame local, px da cena); cliques: [frame, ...] com anel e som.
export const Cursor = ({ pontos, cliques = [], escala = 1.2 }) => {
  const frame = useCurrentFrame();
  const xs = pontos.map((p) => p.f);
  if (frame < xs[0]) return null;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  let i = pontos.findIndex((p, k) => k < pontos.length - 1 && frame >= p.f && frame < pontos[k + 1].f);
  let x, y;
  if (i < 0) { const u = pontos[pontos.length - 1]; x = u.x; y = u.y; }
  else { const a = pontos[i], b = pontos[i + 1]; const t = ease((frame - a.f) / (b.f - a.f)); x = a.x + (b.x - a.x) * t; y = a.y + (b.y - a.y) * t; }
  const apertou = cliques.some((c) => frame >= c && frame < c + 6);
  return (
    <>
      {cliques.map((c) => (frame >= c ? <Sfx key={c} name="pop" atFrame={c} /> : null))}
      {cliques.map((c) => {
        const t = frame - c;
        if (t < 0 || t > 16) return null;
        return <div key={c} style={{ position: "absolute", left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: "50%", border: `5px solid ${colors.gold}`, opacity: 1 - t / 16, transform: `scale(${0.3 + t / 10})` }} />;
      })}
      <svg width={40 * escala} height={40 * escala} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))", transform: apertou ? "scale(0.88)" : "none" }}>
        <path d="M4 2 L4 19 L8.5 15 L11.5 21.5 L14 20.4 L11 14 L17 14 Z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </>
  );
};

// ---------- terminal ----------
// linhas: { t: "cmd" | "out" | "err" | "ok" | "dim" | "pull", text, em, cpf?, dur? }
//   cmd  digita a partir de `em` (cpf = caracteres por frame, padrão 0.9)
//   out/err/ok/dim  aparecem em `em` (se faltar, logo depois da linha anterior)
//   pull  barra de download animada de `em` até `em + dur`: { nome, total (GB) }
const CORES = { out: "#9AA4B2", err: "#FB4B6B", ok: "#34D399", dim: "#6B7280" };
const colorir = (txt) => txt.split(/(\s+)/).map((p, i) => <span key={i} style={{ color: p.startsWith("--") || /^-[a-zA-Z]$/.test(p) ? colors.gold : /^(ollama|claude|curl|irm|export|cd)$/.test(p) ? "#fff" : "#E6EDF3", fontWeight: /^(ollama|claude)$/.test(p) ? 700 : 500 }}>{p}</span>);

export const Term = ({ linhas, titulo = "Terminal", prompt = "$ ", promptCor = CIANO, w = 1180, h = 560, size = 36, style = {}, em = 0, fundo = "#0D1117", barra = "#161B22" }) => {
  const frame = useCurrentFrame();
  const plano = [];
  let fim = 0;
  linhas.forEach((l) => {
    const ini = l.em ?? fim + 6;
    const cpf = l.cpf ?? 0.9;
    const dur = l.t === "cmd" ? Math.ceil(l.text.length / cpf) : l.t === "pull" ? l.dur ?? 120 : 0;
    plano.push({ ...l, ini, dur, cpf });
    fim = ini + dur + (l.t === "cmd" ? 10 : 4);
  });
  const vis = plano.filter((l) => frame >= l.ini);
  const ultima = vis[vis.length - 1];
  const ligado = Math.floor(frame / 8) % 2 === 0;
  const ent = interpolate(frame, [em, em + 8], [0, 1], clamp);
  const cur = (tam) => <span style={{ display: "inline-block", width: tam * 0.55, height: tam * 1.05, background: "#fff", verticalAlign: "text-bottom", marginLeft: 4 }} />;
  return (
    <div style={{ width: w, height: h, borderRadius: 26, background: fundo, boxShadow: "0 30px 80px rgba(0,0,0,0.65), 0 0 0 2px #ffffff18", overflow: "hidden", opacity: ent, transform: `translateY(${(1 - ent) * 30}px)`, display: "flex", flexDirection: "column", ...style }}>
      <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", background: barra, flexShrink: 0 }}>
        {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />)}
        <div style={{ flex: 1, textAlign: "center", color: "#8B949E", fontFamily: MONO, fontSize: 22, marginRight: 70 }}>{titulo}</div>
      </div>
      <div style={{ padding: "26px 32px", fontFamily: MONO, fontSize: size, lineHeight: 1.42, flex: 1, overflow: "hidden" }}>
        {vis.map((l, i) => {
          const eUlt = l === ultima;
          const c = eUlt && ligado ? cur(size) : null;
          if (l.t === "cmd") {
            const n = Math.min(l.text.length, Math.floor((frame - l.ini) * l.cpf));
            return <div key={i} style={{ overflowWrap: "anywhere", marginBottom: 4 }}><span style={{ color: l.promptCor ?? promptCor, fontWeight: 700 }}>{l.prompt ?? prompt}</span>{colorir(l.text.slice(0, n))}{c}</div>;
          }
          if (l.t === "pull") {
            const p = Math.min(1, Math.max(0, (frame - l.ini) / l.dur));
            const e = 1 - Math.pow(1 - p, 1.6);
            const larg = 18, cheio = Math.round(e * larg);
            const gb = (l.total * e).toFixed(1);
            return <div key={i} style={{ color: "#9AA4B2", whiteSpace: "pre", fontSize: size * 0.85, marginBottom: 4 }}>{`pulling ${l.nome}: ${String(Math.round(e * 100)).padStart(3)}% ▕${"█".repeat(cheio)}${" ".repeat(larg - cheio)}▏ ${gb} GB/${l.total} GB`}{p >= 1 ? c : null}</div>;
          }
          return <div key={i} style={{ color: CORES[l.t] ?? CORES.out, overflowWrap: "anywhere", marginBottom: 4, whiteSpace: "pre-wrap" }}>{l.text}{c}</div>;
        })}
      </div>
    </div>
  );
};

// ---------- tela do Claude Code ----------
export const ClaudeTela = ({ w = 1400, h = 620, modelo = "qwen3.5:9b · Ollama", pasta = "~/meu-projeto", children, size = 34, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 26, background: "#0D1117", border: `2px solid ${LARANJA}`, boxShadow: `0 30px 80px rgba(0,0,0,0.65), 0 0 60px ${LARANJA}44`, padding: "30px 40px", fontFamily: MONO, fontSize: size, color: "#E6EDF3", overflow: "hidden", ...style }}>
    <div style={{ border: `2px solid ${LARANJA}`, borderRadius: 14, padding: "14px 22px", display: "inline-block", marginBottom: 22 }}>
      <div style={{ color: LARANJA, fontWeight: 700 }}>✻ Welcome to Claude Code!</div>
      <div style={{ color: "#9AA4B2", fontSize: size * 0.8 }}>modelo: <span style={{ color: CIANO }}>{modelo}</span></div>
      <div style={{ color: "#9AA4B2", fontSize: size * 0.8 }}>pasta: {pasta}</div>
    </div>
    {children}
  </div>
);

// Texto que digita (frames locais) dentro de qualquer lugar.
export const Digita = ({ text, em = 0, cpf = 0.9, cor = "#fff" }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - em) * cpf)));
  return <span style={{ color: cor }}>{text.slice(0, n)}</span>;
};

// ---------- janela de navegador ----------
export const Navegador = ({ x = 150, y = 50, w = 1620, h = 820, url, children, em = 0 }) => {
  const frame = useCurrentFrame();
  const ent = interpolate(frame, [em, em + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - ent) * 40, width: w, height: h, borderRadius: 22, background: "#fff", overflow: "hidden", opacity: ent, boxShadow: "0 30px 90px rgba(0,0,0,0.6), 0 0 0 2px #ffffff22" }}>
      <div style={{ height: 76, background: "#DEE1E6", display: "flex", alignItems: "center", gap: 14, padding: "0 22px" }}>
        {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />)}
        <div style={{ flex: 1, marginLeft: 24, height: 46, borderRadius: 23, background: "#fff", display: "flex", alignItems: "center", padding: "0 24px", fontFamily: "Arial, sans-serif", fontSize: 26, color: "#202124" }}>
          <span style={{ width: 14, height: 18, borderRadius: 4, background: "#5F6368", marginRight: 14, display: "inline-block" }} />{url}
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", height: h - 76, overflow: "hidden", background: "#fff" }}>{children}</div>
    </div>
  );
};

// ---------- legenda palavra por palavra ----------
const LIGA = new Set(["o", "a", "os", "as", "ao", "aos", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "que", "e", "um", "uma", "com", "para", "por", "é", "se", "te", "me", "seu", "sua"]);
const agrupar = (palavras) => {
  const grupos = [];
  let atual = [];
  palavras.forEach((w, i) => {
    atual.push(w);
    const prox = palavras[i + 1];
    const chars = atual.reduce((s, x) => s + x.w.length, 0);
    const fecha = !prox || /[.?!:]$/.test(w.w) || (/,$/.test(w.w) && atual.length >= 2) || atual.length >= 4 || chars + prox.w.length > 26 || prox.start - w.end > 0.45;
    if (fecha) {
      const sobra = prox && atual.length > 1 && !/[.?!:,]$/.test(w.w) && LIGA.has(w.w.toLowerCase()) ? atual.pop() : null;
      grupos.push(atual);
      atual = sobra ? [sobra] : [];
    }
  });
  return grupos;
};

export const Legendas = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const grupos = agrupar(palavras);
  const idx = grupos.findIndex((g, i) => t >= g[0].start - 0.02 && t < (grupos[i + 1] ? grupos[i + 1][0].start - 0.02 : g[g.length - 1].end + 0.4));
  if (idx < 0) return null;
  const g = grupos[idx];
  const inicio = Math.round(g[0].start * fps);
  const pop = spring({ frame: frame - inicio, fps, config: { damping: 12, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", left: 200, right: 200, top: 930, display: "flex", justifyContent: "center", alignItems: "baseline", flexWrap: "wrap", transform: `scale(${0.88 + 0.12 * pop})` }}>
      {g.map((w, i) => {
        const ativa = t >= w.start - 0.02;
        const atual = ativa && t < w.end + 0.08;
        return (
          <span key={i} style={{ ...FONT, textTransform: "none", whiteSpace: "nowrap", margin: "0 14px", fontSize: 62, color: atual ? colors.gold : "#fff", opacity: ativa ? 1 : 0.35, transform: atual ? "scale(1.06) rotate(-1.5deg)" : "none", WebkitTextStroke: "8px #05040C", paintOrder: "stroke fill", textShadow: "0 6px 0 rgba(5,4,12,0.8)" }}>
            {w.w.replace(/[.,?!:]+$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// Logo do Ollama (recorte do print da página de download).
export const LogoOllama = ({ slug, h = 120, fundo = "transparent" }) => {
  const k = h / 54;
  return <div style={{ width: 46 * k, height: 54 * k, background: fundo, backgroundImage: `url(${pasta(slug, "prints/ollama-download.png")})`, backgroundSize: `${1600 * k}px ${900 * k}px`, backgroundPosition: `${-26 * k}px ${-12 * k}px`, backgroundRepeat: "no-repeat" }} />;
};

export const Cena = ({ children, whoosh = true, flash = true, tremer = 6 }) => <CenaInterna whoosh={whoosh} flash={flash} tremer={tremer}>{children}</CenaInterna>;
