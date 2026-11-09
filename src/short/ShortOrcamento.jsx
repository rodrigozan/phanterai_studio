import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { colors, MUSIC_VOLUME } from "../theme";
import { Sfx } from "../components/Sfx";
import { FundoMarca, Texto, Pantera, Faiscas, CenaInterna, FONT } from "./ShortTempero";

const inter = loadInter("normal", { weights: ["400", "500", "600"] }).fontFamily;
const lora = loadLora("normal", { weights: ["400", "500"] }).fontFamily;

export const OR_SLUG = "short-orcamento-ia";
export const OR_FPS = 30;
export const OR_FRAMES = 32 * OR_FPS;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EP = (p) => staticFile(`episodes/${OR_SLUG}/${p}`);

// ---------- linha do tempo (s) ----------
// Ajustar aqui quando a locução da Dinah chegar (words.json define os tempos finais).
export const T = {
  hookFim: 3.4,
  digita: [3.8, 9.4],
  envia: 9.7,
  chat1: 10.2,
  resp1: [10.8, 14.4],
  bom: 13.9,
  falha: 16.7,
  chat2: 20.2,
  corr1: [20.4, 21.9],
  resp2: [22.2, 23.3],
  chat3: 23.6,
  corr2: [23.7, 24.5],
  resp3: [24.8, 26.2],
  final: 28.9,
};
const fr = (s) => Math.round(s * OR_FPS);

// ---------- texto REAL das capturas do Rod ----------
const PROMPT = `Você é assistente de um freelancer que faz sites. Monte um orçamento para enviar ao cliente, em texto claro e pronto para copiar.

Dados do exemplo:
- Serviço: site de uma página para uma barbearia
- Prazo: 7 dias úteis
- Valor: R$ 1.200 (valor de exemplo)
- Pagamento: 50% na entrada e 50% na entrega

Inclua: descrição do serviço, o que está incluso, prazo, valor, forma de pagamento e um fechamento cordial. Use só os dados acima. Não invente itens, descontos nem prazos.`;
const CORR1 = "O que está incluso deve falar das seções do site, redirecionamento para whatsapp ou serviço de agendamento, SEO e GEO.";
const CORR2 = "Tem que descrever as seções do site";

const cab = [
  { k: "t", kind: "p", bold: true, text: "Orçamento – Site de uma página para barbearia" },
  { k: "o", kind: "p", text: "Olá! Segue o orçamento para o seu projeto." },
  { k: "d1", kind: "p", bold: true, text: "Descrição do serviço", tight: true },
  { k: "d2", kind: "p", text: "Criação de um site de uma página (one page) para a sua barbearia." },
  { k: "i1", kind: "p", bold: true, text: "O que está incluso" },
];
const cauda = [
  { k: "pz1", kind: "p", bold: true, text: "Prazo", tight: true, gap: 22 },
  { k: "pz2", kind: "p", text: "7 dias úteis." },
  { k: "v1", kind: "p", bold: true, text: "Valor", tight: true },
  { k: "v2", kind: "p", text: "R$ 1.200,00" },
  { k: "f1", kind: "p", bold: true, text: "Forma de pagamento" },
  { k: "f2", kind: "b", text: "50% na entrada (R$ 600,00)" },
  { k: "f3", kind: "b", text: "50% na entrega (R$ 600,00)" },
  { k: "c1", kind: "p", text: "Fico à disposição para tirar qualquer dúvida. Se estiver tudo certo, é só me confirmar que já começamos!", gap: 22 },
  { k: "c2", kind: "p", text: "Atenciosamente,", tight: true },
  { k: "c3", kind: "p", text: "[Seu nome]" },
];
const V1 = [...cab, { k: "b1", kind: "b", text: "Desenvolvimento do site de uma página para a barbearia" }, ...cauda];
const V2 = [
  ...cab,
  { k: "b1", kind: "b", text: "Seções do site, organizadas em uma única página" },
  { k: "b2", kind: "b", text: "Redirecionamento para WhatsApp ou serviço de agendamento" },
  { k: "b3", kind: "b", text: "SEO (otimização para mecanismos de busca)" },
  { k: "b4", kind: "b", text: "GEO (otimização para mecanismos de busca com IA)" },
  ...cauda,
];
const V3 = [
  ...cab,
  { k: "s0", kind: "p", italic: true, text: "Seções do site:", tight: true },
  { k: "s1", kind: "bs", b: "Início:", text: " apresentação da barbearia com chamada principal para agendamento" },
  { k: "s2", kind: "bs", b: "Sobre:", text: " história e diferenciais da barbearia" },
  { k: "s3", kind: "bs", b: "Serviços:", text: " lista dos serviços oferecidos com seus valores" },
  { k: "s4", kind: "bs", b: "Galeria:", text: " fotos do espaço e dos trabalhos realizados" },
  { k: "s5", kind: "bs", b: "Depoimentos:", text: " avaliações de clientes" },
  { k: "s6", kind: "bs", b: "Localização e horários:", text: " endereço, mapa e horário de funcionamento" },
  { k: "s7", kind: "bs", b: "Contato:", text: " canais de atendimento e botão de agendamento" },
  { k: "r0", kind: "p", italic: true, text: "Recursos:", gap: 20, tight: true },
  { k: "r1", kind: "b", text: "Redirecionamento para WhatsApp ou serviço de agendamento" },
  { k: "r2", kind: "b", text: "SEO (otimização para mecanismos de busca)" },
  { k: "r3", kind: "b", text: "GEO (otimização para mecanismos de busca com IA)" },
  ...cauda,
];

// ---------- utilitários ----------
const lineText = (l) => (l.b ? l.b + l.text : l.text);
const Pop = ({ em = 0, children, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 11, mass: 0.6, stiffness: 150 } });
  return <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 1.4), ...style }}>{children}</div>;
};

const Caret = ({ frame }) => <span style={{ display: "inline-block", width: 3, height: "1em", background: "#e8e6e1", verticalAlign: "text-bottom", marginLeft: 2, opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }} />;

// Digita `texto` entre os frames [a, b] (frame do vídeo).
const digitado = (texto, frame, a, b) => texto.slice(0, Math.round(interpolate(frame, [a, b], [0, texto.length], clamp)));

// Resposta que "streama": revela caracteres no total das linhas, de a a b.
const Resposta = ({ linhas, frame, a, b, destaques = {} }) => {
  const total = linhas.reduce((n, l) => n + lineText(l).length, 0);
  let restante = Math.round(interpolate(frame, [fr(a), fr(b)], [0, total], clamp));
  return (
    <div style={{ fontFamily: inter, fontSize: 30, lineHeight: "42px", color: "#ece9e2" }}>
      {linhas.map((l) => {
        const full = lineText(l);
        const n = Math.max(0, Math.min(full.length, restante));
        restante -= full.length;
        if (n <= 0) return null;
        const shown = full.slice(0, n);
        const bold = l.b ? shown.slice(0, l.b.length) : "";
        const resto = l.b ? shown.slice(l.b.length) : shown;
        const d = destaques[l.k];
        const dentro = d && frame >= fr(d.de);
        const sweep = dentro ? interpolate(frame, [fr(d.de), fr(d.de) + 12], [0, 100], clamp) : 0;
        const badge = dentro && d.badge ? spring({ frame: frame - fr(d.de) - 6, fps: OR_FPS, config: { damping: 9, mass: 0.6 } }) : 0;
        return (
          <div key={l.k} style={{ position: "relative", marginTop: l.gap ?? (l.tight ? 0 : 18), paddingLeft: l.kind === "p" ? 0 : 42, fontWeight: l.bold ? 600 : 400, fontStyle: l.italic ? "italic" : "normal" }}>
            {l.kind !== "p" ? <span style={{ position: "absolute", left: 14, top: 0 }}>•</span> : null}
            {dentro ? <div style={{ position: "absolute", left: -10, right: -10, top: 3, bottom: 3, borderRadius: 10, background: `linear-gradient(90deg, ${d.cor}40 ${sweep}%, transparent ${sweep}%)`, borderLeft: `5px solid ${sweep > 20 ? d.cor : "transparent"}` }} /> : null}
            <span style={{ position: "relative" }}>
              {l.b ? <strong style={{ fontWeight: 600 }}>{bold}</strong> : null}
              {resto}
            </span>
            {d?.badge && badge > 0 ? (
              <div style={{ position: "absolute", right: -6, top: -6, transform: `scale(${badge}) rotate(${-4 * badge}deg)`, fontFamily: inter, fontWeight: 600, fontSize: 24, color: "#0d0d0d", background: d.cor, padding: "2px 14px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }}>
                {d.badge}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const Bolha = ({ children, w = 760, style = {} }) => (
  <div style={{ marginLeft: "auto", width: w, background: "#2b2b29", borderRadius: 26, padding: "20px 26px", fontFamily: inter, fontSize: 28, lineHeight: "38px", color: "#ece9e2", whiteSpace: "pre-wrap", ...style }}>{children}</div>
);

// ---------- janela do Claude ----------
const Janela = ({ frame }) => {
  const s = frame / OR_FPS;
  const enter = spring({ frame: frame - fr(T.hookFim), fps: OR_FPS, config: { damping: 13, mass: 0.8, stiffness: 110 } });
  const fase = s < T.chat1 ? 0 : s < T.chat2 ? 1 : s < T.chat3 ? 2 : 3;
  const faseIni = [T.hookFim, T.chat1, T.chat2, T.chat3][fase];
  const slide = interpolate(frame, [fr(faseIni), fr(faseIni) + 10], [50, 0], clamp);
  const fadeIn = interpolate(frame, [fr(faseIni), fr(faseIni) + 8], [0, 1], clamp);
  const sai = interpolate(frame, [fr(T.final) - 6, fr(T.final)], [1, 0], clamp);
  if (frame < fr(T.hookFim) || sai <= 0) return null;

  // estado do campo de resposta no rodapé (só "Responder" cinza, ou o texto sendo digitado)
  const corrAtual = fase === 1 ? [null, null] : fase === 2 ? T.corr1 : T.corr2;
  const textoCorr = fase === 2 ? CORR1 : fase === 3 ? CORR2 : "";
  const [ca, cb] = fase === 2 ? T.corr1 : T.corr2;
  const enviou = (fase === 2 && s >= cb + 0.15) || (fase === 3 && s >= cb + 0.15);
  const digitandoCorr = (fase === 2 || fase === 3) && s >= ca && !enviou;
  const campo = digitandoCorr ? digitado(textoCorr, frame, fr(ca), fr(cb)) : "";

  let corpo = null;
  if (fase === 0) {
    const [a, b] = T.digita;
    const txt = digitado(PROMPT, frame, fr(a), fr(b));
    const apertou = s >= T.envia - 0.15;
    corpo = (
      <div style={{ opacity: fadeIn, transform: `translateY(${slide}px)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 70, fontFamily: lora, fontSize: 62, color: "#f1efe9" }}>
          <span style={{ color: "#d97757", fontSize: 70, display: "inline-block", transform: `rotate(${frame * 2}deg)` }}>✺</span>
          Boa tarde, Rod
        </div>
        <div style={{ marginTop: 50, background: "#303030", borderRadius: 28, border: "1px solid #444", padding: "28px 30px 24px", minHeight: 520, boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
          <div style={{ fontFamily: inter, fontSize: 27, lineHeight: "38px", color: "#ece9e2", whiteSpace: "pre-wrap", minHeight: 440 }}>
            {txt}
            <Caret frame={frame} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#bdb9b0", fontFamily: inter, fontSize: 38 }}>
            <span>+</span>
            <span style={{ width: 62, height: 62, borderRadius: 16, background: apertou ? "#e8825f" : "#c6613f", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 38, transform: `scale(${apertou ? interpolate(frame, [fr(T.envia) - 5, fr(T.envia), fr(T.envia) + 6], [1, 0.82, 1.1], clamp) : 1})`, boxShadow: apertou ? "0 0 40px #e8825fcc" : "none" }}>↑</span>
          </div>
        </div>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 26, fontFamily: inter, fontSize: 24, color: "#bdb9b0" }}>
          <span>Sonnet 5.5 <span style={{ color: "#8d897f" }}>Médio</span></span>
          <span>Auto</span>
        </div>
      </div>
    );
  } else {
    // conteúdo da conversa (rola para o fim, como na captura)
    let rolagem = 0;
    let conteudo;
    if (fase === 1) {
      rolagem = interpolate(frame, [fr(T.resp1[0]), fr(T.resp1[1] + 1.5)], [0, 400], clamp);
      const D = {
        pz1: { de: T.bom, cor: colors.green },
        pz2: { de: T.bom, cor: colors.green },
        v1: { de: T.bom + 0.25, cor: colors.green },
        v2: { de: T.bom + 0.25, cor: colors.green },
        f2: { de: T.bom + 0.5, cor: colors.green },
        f3: { de: T.bom + 0.5, cor: colors.green, badge: "✓ certinho" },
        b1: { de: T.falha, cor: colors.red, badge: "só isso?" },
      };
      conteudo = (
        <>
          <Bolha w={800} style={{ fontSize: 26, lineHeight: "37px", padding: "18px 24px" }}>{PROMPT}</Bolha>
          <div style={{ marginTop: 56 }}><Resposta linhas={V1} frame={frame} a={T.resp1[0]} b={T.resp1[1]} destaques={D} /></div>
        </>
      );
    } else if (fase === 2) {
      conteudo = (
        <>
          {enviou ? <Bolha>{CORR1}</Bolha> : null}
          <div style={{ marginTop: 56 }}>
            <Resposta linhas={V2} frame={frame} a={T.resp2[0]} b={T.resp2[1]} destaques={{ b1: { de: T.resp2[1] + 0.1, cor: colors.gold }, b2: { de: T.resp2[1] + 0.1, cor: colors.gold }, b3: { de: T.resp2[1] + 0.2, cor: colors.gold }, b4: { de: T.resp2[1] + 0.2, cor: colors.gold, badge: "melhorou" } }} />
          </div>
        </>
      );
    } else {
      rolagem = interpolate(frame, [fr(T.resp3[0]), fr(T.resp3[1] + 1.2)], [0, 260], clamp);
      conteudo = (
        <>
          {enviou ? <Bolha w={560}>{CORR2}</Bolha> : null}
          <div style={{ marginTop: 56 }}>
            <Resposta linhas={V3} frame={frame} a={T.resp3[0]} b={T.resp3[1]} destaques={{ s0: { de: T.resp3[1] + 0.1, cor: colors.green, badge: "agora sim" } }} />
          </div>
        </>
      );
    }
    corpo = (
      <div style={{ opacity: fadeIn, transform: `translateY(${slide - rolagem}px)` }}>
        {conteudo}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", left: 50, top: 250, width: 980, height: 1220, opacity: sai, transform: `scale(${(0.6 + 0.4 * enter) * (0.97 + 0.03 * sai)}) rotate(${(1 - enter) * -6}deg)`, transformOrigin: "50% 60%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 38, background: "#1b1b1a", border: "1px solid #3b3b38", boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 6px rgba(139,92,246,0.25)", overflow: "hidden" }}>
        {/* barra de título */}
        <div style={{ height: 74, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", fontFamily: inter, fontSize: 26, color: "#d8d5cd", borderBottom: "1px solid #2a2a28" }}>
          <span style={{ letterSpacing: 10, color: "#9b978d" }}>≡ ▢ ‹ ›</span>
          <span style={{ opacity: fase === 0 ? 0 : 1 }}>Orçamento de site para barbearia ⌄</span>
          <span style={{ color: "#9b978d" }}>⇪ Compartilhar</span>
        </div>
        {/* área de rolagem */}
        <div style={{ position: "absolute", left: 38, right: 38, top: 74, height: 985, overflow: "hidden", paddingTop: fase === 0 ? 0 : 24 }}>{corpo}</div>
        {/* rodapé */}
        {fase !== 0 ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 24px 20px", background: "#1b1b1a" }}>
            <div style={{ background: "#2c2c2a", border: "1px solid #444", borderRadius: 26, minHeight: 74, padding: "20px 26px", fontFamily: inter, fontSize: 28, color: campo ? "#ece9e2" : "#8d897f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{campo || "Responder"}{campo ? <Caret frame={frame} /> : null}</span>
              <span style={{ color: "#bdb9b0" }}>↵</span>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontFamily: inter, fontSize: 21, color: "#8d897f" }}>
              <span>Claude é uma IA e pode cometer erros.</span>
              <span>Sonnet 5.5 Médio · Auto</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ---------- fundos com mídia do Pexels (sempre tratados: escurecidos, desfocados, em movimento) ----------
const Escuro = ({ a = 0.55 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(5,4,12,${a + 0.2}) 0%, rgba(20,11,46,${a}) 50%, rgba(5,4,12,${a + 0.25}) 100%)` }} />
);
const FotoFundo = ({ src, de, ate, blur = 14, zoom = [1.1, 1.3], dx = [0, -50] }) => {
  const frame = useCurrentFrame();
  if (frame < fr(de) - 6 || frame > fr(ate) + 6) return null;
  const p = interpolate(frame, [fr(de), fr(ate)], [0, 1], clamp);
  const o = interpolate(frame, [fr(de) - 6, fr(de), fr(ate), fr(ate) + 6], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) saturate(1.15)`, transform: `translateX(${interpolate(p, [0, 1], dx)}px) scale(${interpolate(p, [0, 1], zoom)})` }} />
    </AbsoluteFill>
  );
};
const VideoFundo = ({ src, de, ate, blur = 0, inicio = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < fr(de) - 6 || frame > fr(ate) + 6) return null;
  const o = interpolate(frame, [fr(de) - 6, fr(de), fr(ate), fr(ate) + 6], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <Sequence from={fr(de)} layout="none">
        <OffthreadVideo src={src} startFrom={Math.round(inicio * OR_FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) saturate(1.1)` }} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Cartões "polaroid" com foto do Pexels que pulam na tela quando a resposta fala das seções.
const Polaroid = ({ src, em, left, top, rot, rotulo, w = 250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - fr(em);
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 9, mass: 0.7, stiffness: 130 } });
  const sai = interpolate(frame, [fr(T.final) - 8, fr(T.final)], [1, 0], clamp);
  if (sai <= 0) return null;
  return (
    <>
      {t === 0 ? <Sfx name="pop" atFrame={0} /> : null}
      <div style={{ position: "absolute", left, top, width: w, padding: "12px 12px 44px", background: "#fff", borderRadius: 10, boxShadow: "0 18px 40px rgba(0,0,0,0.6)", transform: `scale(${s * sai}) rotate(${rot + (1 - s) * 18}deg) translateY(${Math.sin((frame + left) / 14) * 6}px)` }}>
        <Img src={src} style={{ width: "100%", height: w * 0.95, objectFit: "cover", borderRadius: 4 }} />
        <div style={{ ...FONT, fontFamily: inter, fontWeight: 600, textTransform: "none", position: "absolute", bottom: 8, left: 0, right: 0, fontSize: 24, color: "#140B2E" }}>{rotulo}</div>
      </div>
    </>
  );
};

const Selo = ({ children, em, cor = colors.gold, top = 130, size = 46 }) => (
  <Sequence from={fr(em)} layout="none">
    <Pop style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ ...FONT, fontSize: size, color: "#140B2E", background: cor, padding: "8px 30px", borderRadius: 20, boxShadow: "0 12px 34px rgba(0,0,0,0.5)", transform: "rotate(-2deg)" }}>{children}</div>
    </Pop>
  </Sequence>
);

export const ShortOrcamento = ({ voz = null }) => {
  const frame = useCurrentFrame();
  const barra = interpolate(frame, [0, OR_FRAMES], [0, 100], clamp);
  return (
    <AbsoluteFill style={{ background: colors.bgOuter }}>
      <FundoMarca />
      <Audio src={staticFile("music/CuriousFocus.mp3")} volume={MUSIC_VOLUME * 1.4} />
      {voz ? <Audio src={staticFile(voz)} /> : null}

      {/* fundos de mídia por cena */}
      <VideoFundo src={EP("videos/laptop.mp4")} de={0} ate={T.hookFim} inicio={4} />
      <FotoFundo src={EP("fotos/freelancer.jpg")} de={T.hookFim} ate={T.chat1 + 1} blur={18} />
      <VideoFundo src={EP("videos/mesa.mp4")} de={T.chat1} ate={T.chat2 + 0.5} blur={16} />
      <FotoFundo src={EP("fotos/barbeiro.jpg")} de={T.chat2} ate={T.final} blur={20} zoom={[1.15, 1.35]} dx={[0, 60]} />
      <Escuro a={frame < fr(T.hookFim) ? 0.35 : 0.62} />

      {/* 1 — gancho */}
      <Sequence from={0} durationInFrames={fr(T.hookFim)}>
        <CenaInterna whoosh={false} flash tremer={0}>
          <Texto em={2} size={132} y={600} color={colors.gold} rot={-3}>Orçamento</Texto>
          <Texto em={9} size={170} y={770} color="#fff" rot={2}>com IA</Texto>
          <Texto em={20} size={54} y={380} fundo={colors.violet} color="#fff">Pedi a uma IA</Texto>
          <Pantera pose="surpresa" left="78%" top={1450} width={560} em={12} />
          <Faiscas n={18} />
        </CenaInterna>
      </Sequence>

      {/* 2–4 — janela do Claude recriada, com as falas reais */}
      <Janela frame={frame} />
      <Selo em={T.hookFim + 0.3} top={120}>Valores de exemplo</Selo>

      <Sequence from={fr(T.hookFim)} durationInFrames={fr(T.bom - T.hookFim)} layout="none">
        <Sfx name="whoosh" atFrame={0} />
        <Pantera pose="pensando" left="86%" top={1620} width={380} em={fr(0.6)} />
      </Sequence>
      <Sequence from={fr(T.envia)} layout="none"><Sfx name="ding" atFrame={0} /></Sequence>
      <Sequence from={fr(T.bom)} durationInFrames={fr(T.falha - T.bom)} layout="none">
        <Pantera pose="feliz" left="86%" top={1620} width={380} em={0} />
        <Texto em={4} size={64} y={1560} lado={60} fundo={colors.green} color="#052e1b" rot={-2}>Texto claro</Texto>
      </Sequence>
      <Sequence from={fr(T.falha)} durationInFrames={fr(T.chat2 - T.falha)} layout="none">
        <Sfx name="error" atFrame={4} />
        <Pantera pose="apontando" left="86%" top={1620} width={380} em={0} />
        <Texto em={6} size={64} y={1560} lado={60} fundo={colors.red} color="#fff" rot={2}>Faltou conferir</Texto>
      </Sequence>
      <Sequence from={fr(T.chat2)} durationInFrames={fr(T.final - T.chat2)} layout="none">
        <Sfx name="whoosh" atFrame={0} />
        <Pantera pose="pensando" left="86%" top={1620} width={380} em={0} />
        <Texto em={fr(T.corr1[1] - T.chat2) + 6} size={58} y={1560} lado={60} fundo={colors.gold} color="#140B2E" rot={-2}>Corrigi 2 vezes</Texto>
      </Sequence>
      <Polaroid src={EP("fotos/barbearia-interior.jpg")} em={T.resp3[1] + 0.1} left={4} top={175} rot={-8} rotulo="Galeria" w={200} />
      <Polaroid src={EP("fotos/barbearia-cadeira.jpg")} em={T.resp3[1] + 0.4} left={870} top={175} rot={7} rotulo="Sobre" w={200} />
      <Sequence from={fr(T.resp3[1] + 0.2)} durationInFrames={fr(T.final - T.resp3[1] - 0.2)} layout="none">
        <Sfx name="coin" atFrame={0} />
      </Sequence>

      {/* 5 — cartela final */}
      <Sequence from={fr(T.final)}>
        <CenaInterna whoosh flash tremer={8}>
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <OffthreadVideo src={EP("videos/barbearia.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.1)" }} />
            <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,4,12,0.78), rgba(20,11,46,0.6) 55%, rgba(5,4,12,0.88))" }} />
          </AbsoluteFill>
          <Texto em={4} size={110} y={430} color="#fff" rot={-2}>Orçamento com IA</Texto>
          <Texto em={14} size={96} y={690} color={colors.gold} rot={2}>A IA rascunha,</Texto>
          <Texto em={24} size={96} y={850} color={colors.green} rot={-2}>você confere.</Texto>
          <Texto em={46} size={54} y={1120} fundo={colors.violet} color="#fff">O valor é sempre seu</Texto>
          <Pantera pose="comemorando" left="50%" top={1530} width={560} em={34} />
          <Faiscas n={30} />
        </CenaInterna>
      </Sequence>

      <div style={{ position: "absolute", bottom: 0, left: 0, height: 8, width: `${barra}%`, background: colors.gold }} />
    </AbsoluteFill>
  );
};

export const calculateOrcamentoMetadata = async ({ props }) => ({ durationInFrames: OR_FRAMES, fps: OR_FPS, props });
