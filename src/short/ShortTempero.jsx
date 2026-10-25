import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { colors } from "../theme";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export const SHORT_SLUG = "short-tempero-60s";
export const SHORT_FPS = 30;
// Segundos de respiro antes da primeira palavra da narração (gancho em texto) e do fim da fala até o fim do vídeo.
const LEAD = 1.0;
const FIM_FALA = 57.3;
const CAUDA = 3.0;
export const SHORT_FRAMES = Math.round((LEAD + FIM_FALA + CAUDA) * SHORT_FPS);

// Tempo da narração (s) -> frame do vídeo.
const f = (a) => Math.round((a + LEAD) * SHORT_FPS);
const foto = (nome) => staticFile(`episodes/${SHORT_SLUG}/fotos/${nome}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

const FONT = { fontFamily, fontWeight: 900, textTransform: "uppercase", lineHeight: 1.05, textAlign: "center" };

// ---------- blocos básicos ----------

// Foto em tela cheia com Ken Burns (zoom + deslocamento lento), escurecida para o texto ler bem.
const Fundo = ({ src, escurecer = 0.45, zoom = [1.08, 1.28], dx = [0, -40], dy = [0, -30], blur = 0, tom }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: colors.bgOuter }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${interpolate(p, [0, 1], dx)}px, ${interpolate(p, [0, 1], dy)}px) scale(${interpolate(p, [0, 1], zoom)})`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      {tom ? <AbsoluteFill style={{ background: tom, mixBlendMode: "multiply" }} /> : null}
      <AbsoluteFill style={{ background: `rgba(5,4,12,${escurecer})` }} />
    </AbsoluteFill>
  );
};

// Fundo roxo da marca, com manchas de luz em movimento.
const FundoMarca = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${colors.bgInner} 0%, ${colors.bgOuter} 75%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", left: -300 + Math.sin(frame / 50) * 120, top: 100 + Math.cos(frame / 70) * 100, background: `radial-gradient(circle, ${colors.violet}66 0%, transparent 70%)`, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", right: -250 - Math.sin(frame / 60) * 100, bottom: 200 + Math.cos(frame / 45) * 120, background: `radial-gradient(circle, ${colors.gold}40 0%, transparent 70%)`, filter: "blur(60px)" }} />
    </AbsoluteFill>
  );
};

// Texto cinético: entra com mola no frame `em` (local da cena), com leve rotação.
const Texto = ({ children, em = 0, size = 120, color = colors.text, y = 400, rot = 0, fundo, saiEm, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 9, mass: 0.7, stiffness: 140 } });
  const sai = saiEm != null ? interpolate(frame, [saiEm, saiEm + 8], [1, 0], clamp) : 1;
  if (sai <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", justifyContent: "center", opacity: sai, transform: `scale(${s * (0.9 + 0.1 * sai)}) rotate(${rot * s}deg)` }}>
      <div
        style={{
          ...FONT,
          fontSize: size,
          color,
          padding: fundo ? "14px 36px" : 0,
          background: fundo,
          borderRadius: 28,
          textShadow: fundo ? "none" : "0 6px 0 rgba(0,0,0,0.55), 0 0 40px rgba(0,0,0,0.6)",
          boxShadow: fundo ? "0 14px 40px rgba(0,0,0,0.45)" : undefined,
          WebkitTextStroke: fundo ? undefined : "3px rgba(5,4,12,0.9)",
          paintOrder: "stroke fill",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Cartão de foto: borda branca, sombra, entra girando com mola.
const Foto = ({ src, em = 0, left = "50%", top = 700, w = 900, h, rot = 0, ken = true, borda = 12, flutua = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 11, mass: 0.8 } });
  const bob = flutua ? Math.sin((frame + em * 3) / 22) * 8 : 0;
  const zoom = ken ? 1 + Math.min(t, 200) / 900 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) translateY(${bob + (1 - s) * 260}px) rotate(${rot * s + (1 - s) * -14}deg) scale(${0.6 + 0.4 * s})`,
        opacity: Math.min(1, t / 4),
        border: `${borda}px solid #fff`,
        borderRadius: 26,
        boxShadow: "0 30px 70px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.15)",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
    </div>
  );
};

// Anel pulsante que chama atenção para um ponto do cartão (posição em % do cartão).
const Anel = ({ em, x, y, size = 190, rotulo, cor = colors.gold, cardLeft, cardTop, cardW, cardH, rotuloLado = "baixo" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 10 } });
  const pulso = 1 + Math.sin(t / 5) * 0.07;
  const cx = cardLeft + (x / 100 - 0.5) * cardW;
  const cy = cardTop + (y / 100 - 0.5) * cardH;
  return (
    <>
      <div style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, borderRadius: "50%", border: `10px solid ${cor}`, boxShadow: `0 0 40px ${cor}, inset 0 0 30px ${cor}66`, transform: `scale(${s * pulso})` }} />
      {rotulo ? (
        <div style={{ position: "absolute", left: cx, top: rotuloLado === "baixo" ? cy + size / 2 + 20 : cy - size / 2 - 90, transform: `translateX(-50%) scale(${s})`, ...FONT, fontSize: 52, color: "#140B2E", background: cor, padding: "6px 24px", borderRadius: 18, whiteSpace: "nowrap" }}>
          {rotulo}
        </div>
      ) : null}
    </>
  );
};

// Pantera com flutuação e leve balanço; entra com o pop do componente original.
const Pantera = ({ pose, left = "80%", top = 1500, width = 520, em = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < em) return null;
  return (
    <Sequence from={em} layout="none">
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${Math.sin(frame / 9) * 14}px) rotate(${Math.sin(frame / 14) * 3}deg)`, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.55))" }}>
        <Panther pose={pose} left={left} top={top} width={width} />
      </div>
    </Sequence>
  );
};

// Chuva de faíscas douradas/violeta subindo (determinística, mesma em todo render).
const Faiscas = ({ n = 26, cor = colors.gold }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`x${i}`) * 1080;
        const vel = 1.2 + random(`v${i}`) * 3;
        const tam = 6 + random(`s${i}`) * 16;
        const fase = random(`f${i}`) * 1920;
        const y = 1920 - ((frame * vel * 2 + fase) % 2100) + 90;
        const dx = Math.sin((frame + i * 17) / 20) * 40;
        const piscar = 0.35 + 0.65 * Math.abs(Math.sin((frame + i * 11) / 9));
        return <div key={i} style={{ position: "absolute", left: x + dx, top: y, width: tam, height: tam, borderRadius: "50%", background: i % 3 ? cor : colors.violetLight, opacity: piscar * 0.8, boxShadow: `0 0 ${tam * 2}px ${i % 3 ? cor : colors.violetLight}` }} />;
      })}
    </AbsoluteFill>
  );
};

// Cena: soco de entrada (zoom + clarão + tremida que some) e whoosh. Corta no tempo da narração.
const Cena = ({ de, ate, children, whoosh = true, flash = true, tremer = 14 }) => {
  const total = f(ate) - f(de);
  return (
    <Sequence from={f(de)} durationInFrames={total}>
      <CenaInterna whoosh={whoosh} flash={flash} tremer={tremer}>{children}</CenaInterna>
    </Sequence>
  );
};
const CenaInterna = ({ children, whoosh, flash, tremer }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 10], [1, 0], clamp);
  const sx = Math.sin(frame * 3.1) * tremer * punch;
  const sy = Math.cos(frame * 2.7) * tremer * punch;
  return (
    <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${1 + punch * 0.06})` }}>
      {whoosh ? <Sfx name="whoosh" atFrame={0} /> : null}
      {children}
      {flash ? <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, 6], [0.75, 0], clamp), pointerEvents: "none" }} /> : null}
    </AbsoluteFill>
  );
};

// ---------- legendas palavra por palavra ----------

const CORRECOES = { Nekolov: "Neko", Lo: "Lo-Fi", "-Fi": null };
const limpar = (palavras) =>
  palavras.flatMap((w) => {
    const t = Object.prototype.hasOwnProperty.call(CORRECOES, w.w) ? CORRECOES[w.w] : w.w;
    return t === null ? [] : [{ ...w, w: t }];
  });

const agrupar = (palavras) => {
  const grupos = [];
  let atual = [];
  palavras.forEach((w, i) => {
    atual.push(w);
    const prox = palavras[i + 1];
    const fecha = !prox || /[.?!]$/.test(w.w) || (/,$/.test(w.w) && atual.length >= 2) || atual.length >= 3 || prox.start - w.end > 0.45;
    if (fecha) {
      grupos.push(atual);
      atual = [];
    }
  });
  return grupos;
};

const Legendas = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - LEAD;
  const grupos = agrupar(limpar(palavras));
  const idx = grupos.findIndex((g, i) => t >= g[0].start - 0.02 && t < (grupos[i + 1] ? grupos[i + 1][0].start - 0.02 : g[g.length - 1].end + 0.4));
  if (idx < 0) return null;
  const g = grupos[idx];
  const inicio = Math.round((g[0].start + LEAD) * fps);
  const pop = spring({ frame: frame - inicio, fps, config: { damping: 12, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 1300, display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", transform: `scale(${0.85 + 0.15 * pop})` }}>
      {g.map((w, i) => {
        const ativa = t >= w.start - 0.02;
        const atual = ativa && t < w.end + 0.08;
        return (
          <span
            key={i}
            style={{
              ...FONT,
              fontSize: 92,
              color: atual ? colors.gold : "#fff",
              opacity: ativa ? 1 : 0.35,
              transform: atual ? "scale(1.12) rotate(-2deg)" : "none",
              WebkitTextStroke: "10px #05040C",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 rgba(5,4,12,0.8)",
            }}
          >
            {w.w.replace(/[.,?!]+$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// ---------- cenas ----------

const neko = (n) => foto(`neko-${n}.png`);

// Gancho em texto: aparece nos 2 primeiros segundos por cima de tudo e some com a saída para cima.
const Gancho = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10 } });
  const sai = interpolate(frame, [70, 84], [0, 1], clamp);
  if (sai >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 210, transform: `translateY(${-sai * 500}px) scale(${s})`, opacity: 1 - sai }}>
      <div style={{ ...FONT, fontSize: 98, color: "#fff", WebkitTextStroke: "8px #05040C", paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(5,4,12,0.8)" }}>
        Suas capas <span style={{ color: colors.gold }}>prometem</span> vídeos diferentes?
      </div>
    </div>
  );
};

const CenaTeste = () => {
  const frame = useCurrentFrame();
  // A cena começa no frame 0 do vídeo, então os tempos absolutos f(...) valem como frames locais.
  const posicoes = [
    { n: "coding", top: 620, rot: -7, em: f(2.0) },
    { n: "coffee", top: 720, rot: 5, em: f(2.4) },
    { n: "sunset", top: 820, rot: -4, em: f(2.8) },
    { n: "library", top: 920, rot: 6, em: f(3.2) },
    { n: "worship", top: 1020, rot: -3, em: f(3.6) },
  ];
  const print = f(0.88);
  return (
    <>
      <Fundo src={foto("criador.jpg")} blur={14} escurecer={0.55} tom="#6d3fd6" />
      <Faiscas n={18} />
      <Texto em={84} y={230} size={116} rot={-3}>Teste do print</Texto>
      {posicoes.map((p) => (
        <Foto key={p.n} src={neko(p.n)} em={p.em} top={p.top} w={640} h={360} rot={p.rot} ken={false} />
      ))}
      <Sfx name="ding" atFrame={print} />
      {posicoes.map((p) => <Sfx key={p.n} name="pop" atFrame={p.em} />)}
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [print, print + 6], [0.85, 0], clamp) * (frame >= print ? 1 : 0), pointerEvents: "none" }} />
    </>
  );
};

const CenaNeko = () => (
  <>
    <FundoMarca />
    <Faiscas n={22} />
    <Foto src={neko("coding")} top={800} w={1000} h={562} rot={-2} />
    <Texto em={8} y={250} size={92} fundo={colors.violet} rot={-2}>Neko Lofi Vibes</Texto>
    <Texto em={f(8.26) - f(4.6)} y={1150} size={70} fundo={colors.red} rot={2}>Parado há 8 meses</Texto>
    <Pantera pose="pensando" left="84%" top={1690} width={420} em={10} />
  </>
);

const CenaMarca = () => {
  const card = { cardLeft: 540, cardTop: 800, cardW: 1000, cardH: 562 };
  const base = f(9.28);
  return (
    <>
      <FundoMarca />
      <Faiscas n={22} />
      <Foto src={neko("coffee")} top={800} w={1000} h={562} rot={0} flutua={false} ken={false} />
      <Anel {...card} em={f(11.46) - base} x={59} y={58} size={210} rotulo="GATINHO" />
      <Anel {...card} em={f(12.56) - base} x={85} y={9} size={150} rotulo="SELO" cor={colors.violetLight} rotuloLado="baixo" />
      <Anel {...card} em={f(14.52) - base} x={47} y={22} size={280} rotulo="MESMA LETRA" cor={colors.green} rotuloLado="cima" />
      <Texto em={0} y={210} size={96}>O que se repete</Texto>
      <Texto em={f(16.08) - base} y={1130} size={130} color="#140B2E" fundo={colors.gold} rot={-4}>É marca</Texto>
      <Sfx name="ding" atFrame={f(16.08) - base} />
    </>
  );
};

const MUDA = [
  { de: 17.0, foto: "cafe.jpg", neko: "coffee", rotulo: "Cafeteria", rot: -4, tom: "#b45309" },
  { de: 19.78, foto: "sunset.jpg", neko: "sunset", rotulo: "Pôr do sol", rot: 4, tom: "#c2410c" },
  { de: 20.9, foto: "biblioteca.jpg", neko: "library", rotulo: "Biblioteca antiga", rot: -3, tom: "#78350f" },
  { de: 22.16, foto: "chuva.jpg", neko: "coding", rotulo: "Noite de chuva", rot: 3, tom: "#1e3a8a" },
];
const CenaMuda = () => (
  <>
    <FundoMarca />
    <Texto em={0} y={300} size={130} rot={-3}>O que muda</Texto>
    <Faiscas n={14} />
    <Pantera pose="surpresa" left="50%" top={980} width={640} em={4} />
    {MUDA.map((m, i) => {
      const ini = i === 0 ? f(18.5) : f(m.de);
      const fim = i === MUDA.length - 1 ? f(23.44) : f(MUDA[i + 1].de);
      return (
        <Sequence key={m.rotulo} from={ini - f(16.84)} durationInFrames={fim - ini}>
          <CenaInterna whoosh tremer={10} flash>
            <Fundo src={foto(m.foto)} escurecer={0.35} tom={m.tom} />
            <Foto src={neko(m.neko)} top={780} w={900} h={506} rot={m.rot} />
            <Texto em={3} y={1110} size={96} fundo={colors.violet} rot={-2}>{m.rotulo}</Texto>
          </CenaInterna>
        </Sequence>
      );
    })}
  </>
);

const CenaDiferente = () => {
  const frame = useCurrentFrame();
  const base = f(23.44);
  const troca = frame >= f(28.98) - base;
  const pos = [
    { n: "coffee", left: 270, top: 790 },
    { n: "sunset", left: 810, top: 790 },
    { n: "library", left: 270, top: 1070 },
    { n: "coding", left: 810, top: 1070 },
  ];
  const ordem = troca ? [1, 0, 3, 2] : [0, 1, 2, 3];
  return (
    <>
      <FundoMarca />
      <Faiscas n={20} />
      <Texto em={0} y={210} size={104} rot={-3}>Mesma marca</Texto>
      <Texto em={f(24.94) - base} y={340} size={104} color={colors.gold} rot={3}>Outra história</Texto>
      {pos.map((p, i) => {
        const alvo = pos[ordem[i]];
        return <Foto key={p.n} src={neko(p.n)} em={4 + i * 4} left={alvo.left} top={alvo.top} w={480} h={270} rot={i % 2 ? 3 : -3} ken={false} borda={8} />;
      })}
      <Texto em={f(28.08) - base} y={1215} size={54} fundo={colors.red}>Nenhuma substitui a outra</Texto>
      <Sfx name="pop" atFrame={f(28.98) - base} />
      <Pantera pose="feliz" left="84%" top={1690} width={400} em={6} />
    </>
  );
};

const CenaDono = () => {
  const base = f(30.2);
  const itens = [
    { t: "Roteiro original", em: f(34.0) - base },
    { t: "Uma opinião", em: f(35.74) - base },
    { t: "Uma história", em: f(36.82) - base },
  ];
  return (
    <>
      <Fundo src={foto("criador.jpg")} escurecer={0.6} blur={6} tom="#6d3fd6" />
      <Faiscas n={20} />
      <Texto em={0} y={250} size={118} rot={-3}>Ter um dono</Texto>
      <Texto em={f(32.06) - base} y={450} size={58} fundo={colors.violet}>Alguém pensou nesse vídeo</Texto>
      {itens.map((it, i) => (
        <Texto key={it.t} em={it.em} y={640 + i * 190} size={84} color="#140B2E" fundo={colors.gold} rot={i % 2 ? 2 : -2}>{it.t}</Texto>
      ))}
      <Texto em={f(37.46) - base} y={1200} size={58} color={colors.violetLight}>começo · meio · fim</Texto>
      {itens.map((it) => <Sfx key={it.t} name="coin" atFrame={it.em} />)}
      <Pantera pose="apontando" left="84%" top={1690} width={420} em={8} />
    </>
  );
};

const CenaCozinha = () => {
  const base = f(39.64);
  return (
    <>
      <Fundo src={foto("tempero.jpg")} escurecer={0.35} />
      <Faiscas n={16} />
      <Texto em={f(40.2) - base} y={300} size={96} fundo={colors.violet} rot={-2}>IA = ajudante de cozinha</Texto>
      <Texto em={f(41.74) - base} y={560} size={130} color="#140B2E" fundo={colors.gold} rot={3}>A receita é sua</Texto>
      <Pantera pose="comemorando" left="86%" top={1690} width={420} em={6} />
    </>
  );
};

const CenaChurrasco = () => {
  const base = f(43.76);
  return (
    <>
      <Fundo src={foto("churrasco.jpg")} escurecer={0.35} tom="#c2410c" />
      <Texto em={0} y={260} size={110} rot={-3}>Churrasco de domingo</Texto>
      <Sequence from={f(45.5) - base}>
        <CenaInterna whoosh tremer={12} flash>
          <Fundo src={foto("carne.jpg")} escurecer={0.4} />
          <Texto em={4} y={300} size={110} rot={2}>Mesmo açougue</Texto>
          <Texto em={f(46.76) - f(45.5)} y={1010} size={80} fundo={colors.red}>Todo mundo compra lá</Texto>
        </CenaInterna>
      </Sequence>
    </>
  );
};

const CenaTempero = () => {
  const base = f(47.78);
  const itens = [
    { n: "tempero.jpg", t: "Tempero", em: f(49.2) - base, top: 480, rot: -4 },
    { n: "churrasqueira.jpg", t: "Ponto", em: f(50.3) - base, top: 780, rot: 4 },
    { n: "churrasco.jpg", t: "História", em: f(51.22) - base, top: 1080, rot: -3 },
  ];
  return (
    <>
      <FundoMarca />
      <Faiscas n={22} />
      <Texto em={0} y={170} size={100} rot={-3}>Cada tio, um…</Texto>
      {itens.map((it) => (
        <div key={it.t}>
          <Foto src={foto(it.n)} em={it.em} left={540} top={it.top} w={780} h={290} rot={it.rot} />
          <Texto em={it.em + 3} y={it.top - 55} size={86} fundo={colors.gold} color="#140B2E" rot={it.rot}>{it.t}</Texto>
          <Sfx name="pop" atFrame={it.em} />
        </div>
      ))}
    </>
  );
};

const CenaAcougue = () => {
  const base = f(53.7);
  return (
    <>
      <Fundo src={foto("carne.jpg")} escurecer={0.4} />
      <Texto em={f(54.18) - base} y={300} size={120} fundo={colors.red} rot={-3}>A IA é o açougue</Texto>
      <Sequence from={f(55.26) - base}>
        <CenaInterna whoosh tremer={16} flash>
          <Fundo src={foto("churrasqueira.jpg")} escurecer={0.3} tom="#c2410c" />
          <Faiscas n={34} cor="#fb923c" />
          <Texto em={4} y={280} size={104} rot={2}>O churrasco</Texto>
          <Texto em={f(56.4) - f(55.26)} y={500} size={104} color="#140B2E" fundo={colors.gold} rot={-3}>tem a sua mão</Texto>
          <Sfx name="riser" atFrame={0} />
        </CenaInterna>
      </Sequence>
    </>
  );
};

const CenaFinal = () => (
  <>
    <FundoMarca />
    <Faiscas n={30} />
    <Texto em={4} y={300} size={118} rot={-3}>Qual é o seu</Texto>
    <Texto em={14} y={470} size={170} color="#140B2E" fundo={colors.gold} rot={3}>tempero?</Texto>
    <Texto em={30} y={880} size={58} color={colors.violetLight}>O que só você colocou nesse vídeo?</Texto>
    <Pantera pose="pensando" left="50%" top={1450} width={620} em={6} />
    <Sfx name="ding" atFrame={14} />
  </>
);

// ---------- composição ----------

const VOLUME_MUSICA = 0.1;

export const ShortTempero = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!palavras) return null;
  const musica = interpolate(frame, [0, 20, durationInFrames - 45, durationInFrames], [0, VOLUME_MUSICA, VOLUME_MUSICA, 0], clamp);
  return (
    <AbsoluteFill style={{ background: colors.bgOuter }}>
      <Audio src={staticFile("music/CuriousFocus.mp3")} volume={musica} />
      <Sequence from={Math.round(LEAD * SHORT_FPS)}>
        <Audio src={staticFile(`episodes/${SHORT_SLUG}/voz.mp3`)} />
      </Sequence>

      <Cena de={-LEAD} ate={4.6} whoosh={false} flash={false}><CenaTeste /></Cena>
      <Cena de={4.6} ate={9.28}><CenaNeko /></Cena>
      <Cena de={9.28} ate={16.84}><CenaMarca /></Cena>
      <Cena de={16.84} ate={23.44} whoosh={false}><CenaMuda /></Cena>
      <Cena de={23.44} ate={30.2}><CenaDiferente /></Cena>
      <Cena de={30.2} ate={39.64}><CenaDono /></Cena>
      <Cena de={39.64} ate={43.76}><CenaCozinha /></Cena>
      <Cena de={43.76} ate={47.78}><CenaChurrasco /></Cena>
      <Cena de={47.78} ate={53.7}><CenaTempero /></Cena>
      <Cena de={53.7} ate={FIM_FALA}><CenaAcougue /></Cena>
      <Cena de={FIM_FALA} ate={FIM_FALA + CAUDA}><CenaFinal /></Cena>

      <Gancho />
      <Legendas palavras={palavras} />
      {/* vinheta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,4,12,0.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const calculateShortMetadata = async ({ props }) => {
  const resp = await fetch(staticFile(`episodes/${SHORT_SLUG}/words.json`));
  const palavras = await resp.json();
  return { durationInFrames: SHORT_FRAMES, fps: SHORT_FPS, props: { ...props, palavras } };
};
