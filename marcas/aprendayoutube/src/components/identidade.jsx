// Peças da identidade do Aprenda YouTube, desenhadas a partir do banner do canal.
// Forma amarela (APRENDA / youtube), coração listrado atrás dela, botão de play, fundo magenta e textos brancos.
import { useId } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../../phanterai/src/components/Sfx"; // efeito sonoro é infra comum (public/sfx), não é identidade
import { AMARELO, BRANCO, DISPLAY, FAMILIA, FONT, MAGENTA, PLAY, colors } from "../theme";

export { Sfx };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

// Contorno tirado do banner (coordenadas do arquivo original, caixa 325..540 x 6..206).
export const CAMINHO_FORMA =
  "M425 6 C452 6 478 21 495 36 C518 56 539 88 539 117 C539 143 528 160 508 176 C486 195 458 206 428 206 C396 206 366 192 346 176 C332 163 325 145 326 126 C327 108 333 90 342 68 C352 46 368 27 388 17 C399 10 411 6 425 6 Z";
const CAIXA_FORMA = { x: 325, y: 6, w: 215, h: 200 };

export const Forma = ({ largura = 430, cor = AMARELO, children, style = {} }) => {
  const altura = (largura * CAIXA_FORMA.h) / CAIXA_FORMA.w;
  return (
    <div style={{ position: "relative", width: largura, height: altura, ...style }}>
      <svg width={largura} height={altura} viewBox={`${CAIXA_FORMA.x} ${CAIXA_FORMA.y} ${CAIXA_FORMA.w} ${CAIXA_FORMA.h}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={CAMINHO_FORMA} fill={cor} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{children}</div>
    </div>
  );
};

// Coração com listras diagonais claras, esmaecendo para baixo.
export const Coracao = ({ largura = 260, opacidade = 1, giro = -18, desliza = 0, style = {} }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={largura} height={largura * 0.92} viewBox="0 0 100 92" style={{ opacity: opacidade, transform: `rotate(${giro}deg)`, ...style }}>
      <defs>
        <pattern id={`l${id}`} width="4.8" height="4.8" patternUnits="userSpaceOnUse" patternTransform={`rotate(-24) translate(${desliza} 0)`}>
          <rect width="2.1" height="4.8" fill={BRANCO} />
        </pattern>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.92" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`m${id}`}><rect width="100" height="92" fill={`url(#g${id})`} /></mask>
      </defs>
      <path d="M50 90 C20 70 1 52 1 29 C1 13 13 2 27 2 C37 2 46 8 50 17 C54 8 63 2 73 2 C87 2 99 13 99 29 C99 52 80 70 50 90 Z" fill={`url(#l${id})`} mask={`url(#m${id})`} />
    </svg>
  );
};

// Forma amarela com "APRENDA" entre duas linhas finas e "youtube" grande.
export const Logo = ({ largura = 430, coracao = true, style = {} }) => {
  const k = largura / CAIXA_FORMA.w;
  return (
    <div style={{ position: "relative", width: largura, ...style }}>
      {coracao ? <Coracao largura={250 * k} giro={0} style={{ position: "absolute", left: -73 * k, top: 4 * k }} /> : null}
      <Forma largura={largura}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 * k, width: "100%", marginTop: -14 * k }}>
          <div style={{ width: 52 * k, height: Math.max(1, 0.9 * k), background: BRANCO }} />
          <div style={{ fontFamily: FAMILIA, fontWeight: 800, fontSize: 8.2 * k, letterSpacing: "0.04em", color: MAGENTA }}>APRENDA</div>
          <div style={{ width: 52 * k, height: Math.max(1, 0.9 * k), background: BRANCO }} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 38 * k, lineHeight: 1.05, color: MAGENTA, letterSpacing: "-0.01em" }}>youtube</div>
      </Forma>
    </div>
  );
};

export const Play = ({ size = 100, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="50" cy="50" r="50" fill={PLAY} />
    <path d="M38 29 L73 50 L38 71 Z" fill={BRANCO} />
  </svg>
);

// Assinatura pequena para topo de vídeo e capas.
export const Selo = ({ largura = 220, style = {} }) => <Logo largura={largura} coracao={false} style={style} />;

// Fundo magenta chapado do banner, com o coração listrado e o play respirando nos cantos.
export const FundoAY = ({ enfeites = true, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const base = Math.min(width, height);
  return (
    <AbsoluteFill style={{ background: MAGENTA, overflow: "hidden" }}>
      {enfeites ? (
        <>
          <Coracao largura={base * 0.62} opacidade={0.22} desliza={frame / 9} style={{ position: "absolute", left: -base * 0.2 + Math.sin(frame / 55) * 24, top: -base * 0.08 }} />
          <Coracao largura={base * 0.48} opacidade={0.16} giro={16} desliza={-frame / 11} style={{ position: "absolute", right: -base * 0.14, bottom: base * 0.02 + Math.cos(frame / 48) * 24 }} />
          <div style={{ position: "absolute", width: base * 0.34, height: base * 0.34, right: -base * 0.08 + Math.cos(frame / 40) * 18, top: height * 0.12, opacity: 0.14 }}>
            <Forma largura={base * 0.34} />
          </div>
        </>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

// Texto cinético: entra com mola no frame `em` (local da cena). `fundo` vira caixa (amarela pede texto magenta).
export const Texto = ({ children, em = 0, size = 120, color = BRANCO, y = 400, rot = 0, fundo, saiEm, style = {}, lado = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 9, mass: 0.7, stiffness: 140 } });
  const sai = saiEm != null ? interpolate(frame, [saiEm, saiEm + 8], [1, 0], clamp) : 1;
  if (sai <= 0) return null;
  const cor = fundo === AMARELO ? MAGENTA : color;
  return (
    <div style={{ position: "absolute", left: lado, right: lado, top: y, display: "flex", justifyContent: "center", opacity: sai, transform: `scale(${s * (0.9 + 0.1 * sai)}) rotate(${rot * s}deg)` }}>
      <div style={{ ...FONT, fontSize: size, color: cor, padding: fundo ? "14px 40px" : 0, background: fundo, borderRadius: 44, textShadow: fundo ? "none" : `0 6px 0 ${colors.fundoEscuro}`, ...style }}>{children}</div>
    </div>
  );
};

// Cena com soco de entrada, whoosh e flash.
export const CenaInterna = ({ children, whoosh = true, flash = true, tremer = 6 }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 10], [1, 0], clamp);
  const sx = Math.sin(frame * 3.1) * tremer * punch;
  const sy = Math.cos(frame * 2.7) * tremer * punch;
  return (
    <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${1 + punch * 0.06})` }}>
      {whoosh ? <Sfx name="whoosh" atFrame={0} /> : null}
      {children}
      {flash ? <AbsoluteFill style={{ background: AMARELO, opacity: interpolate(frame, [0, 6], [0.6, 0], clamp), pointerEvents: "none" }} /> : null}
    </AbsoluteFill>
  );
};

// Legenda curta (Shorts): 1 a 3 palavras, a palavra atual na caixa amarela com letra magenta.
// palavras: [{ w, start, end }] em segundos.
export const LegendaCurta = ({ palavras = [], y = 1480, size = 84, max = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const grupos = [];
  let g = [];
  palavras.forEach((p, i) => {
    g.push(p);
    const prox = palavras[i + 1];
    if (!prox || g.length >= max || /[.?!:,]$/.test(p.w) || prox.start - p.end > 0.4) { grupos.push(g); g = []; }
  });
  const i = grupos.findIndex((x, k) => t >= x[0].start - 0.02 && t < (grupos[k + 1] ? grupos[k + 1][0].start - 0.02 : x[x.length - 1].end + 0.4));
  if (i < 0) return null;
  const pop = spring({ frame: frame - Math.round(grupos[i][0].start * fps), fps, config: { damping: 12, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, transform: `scale(${0.88 + 0.12 * pop})` }}>
      {grupos[i].map((p, k) => {
        const atual = t >= p.start - 0.02 && t < p.end + 0.08;
        return (
          <span key={k} style={{ ...FONT, fontSize: size, whiteSpace: "nowrap", padding: "0 18px", borderRadius: 26, background: atual ? AMARELO : "transparent", color: atual ? MAGENTA : BRANCO, textShadow: atual ? "none" : `0 5px 0 ${colors.fundoEscuro}` }}>
            {p.w.replace(/[.,?!:]+$/, "")}
          </span>
        );
      })}
    </div>
  );
};
