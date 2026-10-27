import { AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { Sfx } from "../components/Sfx";
import { FundoMarca, Texto as TextoBase, Foto, Pantera, Faiscas, CenaInterna, FONT } from "./ShortTempero";

export const MC_SLUG = "short-minecraft-ia";
export const MC_FPS = 30;
const LEAD = 1.0;
const FIM_FALA = 84.4;
const CAUDA = 1.95;
export const MC_FRAMES = Math.round((LEAD + FIM_FALA + CAUDA) * MC_FPS);

const f = (a) => Math.round((a + LEAD) * MC_FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const foto = (n) => staticFile(`episodes/${MC_SLUG}/fotos/${n}.jpg`);
const video = (n) => staticFile(`episodes/${MC_SLUG}/videos/${n}.mp4`);
const print = (n) => staticFile(`episodes/${MC_SLUG}/prints/${n}.png`);
const Texto = (p) => <TextoBase lado={145} {...p} size={(p.size ?? 120) * 0.86} />;
const DUR_VIDEO = { gamer: 6, servidor: 21, codigo: 9, robo: 19, escritorio: 26, radar: 12 };
const PRINT_WH = { tnw: [1000, 520], tomshw: [860, 720], cnbc: [740, 560], bleeping: [740, 560], techcrunch: [1066, 660], cyberscoop: [850, 710], decoder: [680, 580] };


// Foto em tela cheia com Ken Burns; `brilho` segura fotos claras para o fundo nunca ficar lavado.
const Fundo = ({ src, escurecer = 0.45, zoom = [1.08, 1.28], dx = [0, -40], dy = [0, -30], tom, brilho = 0.7 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: colors.bgOuter }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${brilho})`, transform: `translate(${interpolate(p, [0, 1], dx)}px, ${interpolate(p, [0, 1], dy)}px) scale(${interpolate(p, [0, 1], zoom)})` }} />
      {tom ? <AbsoluteFill style={{ background: tom, mixBlendMode: "multiply" }} /> : null}
      <AbsoluteFill style={{ background: `rgba(5,4,12,${escurecer})` }} />
    </AbsoluteFill>
  );
};

// B-roll vertical do Pexels em tela cheia, em loop, com zoom lento e escurecido.
const FundoVideo = ({ nome, escurecer = 0.4, tom, zoom = [1.05, 1.2], brilho = 0.8 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], zoom, clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: colors.bgOuter }}>
      <AbsoluteFill style={{ transform: `scale(${p})` }}>
        <Loop durationInFrames={DUR_VIDEO[nome] * MC_FPS - 2}>
          <OffthreadVideo src={video(nome)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${brilho})` }} />
        </Loop>
      </AbsoluteFill>
      {tom ? <AbsoluteFill style={{ background: tom, mixBlendMode: "multiply" }} /> : null}
      <AbsoluteFill style={{ background: `rgba(5,4,12,${escurecer})` }} />
    </AbsoluteFill>
  );
};

// Print de manchete: cartão com a captura real, entra com mola, Ken Burns interno e selo da fonte.
const Print = ({ nome, fonte, em = 0, top = 820, w = 900, rot = -2 }) => {
  const [pw, ph] = PRINT_WH[nome];
  const h = Math.round((w * ph) / pw);
  return (
    <>
      <Sequence from={em} layout="none"><div style={{position:"absolute", left:(1080-w)/2, top:top-h/2, width:w, height:h, transform:`rotate(${rot}deg)`, background:"white", borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px #0009"}}><Img src={print(nome)} style={{width:"100%",height:"100%",objectFit:"contain"}} /></div></Sequence>
      <Texto em={em + 8} y={top - h / 2 - 95} size={46} fundo={colors.gold} color="#140B2E" rot={rot}>{fonte}</Texto>
    </>
  );
};

// Flash de corte discreto (violeta claro, no máximo 22%): marca o corte sem lavar o quadro.
const FlashSuave = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#c4b5fd", opacity: interpolate(frame, [0, 5], [0.22, 0], clamp), pointerEvents: "none" }} />;
};

const Cena = ({ de, ate, children, whoosh = true, flash = true, tremer = 12 }) => (
  <Sequence from={f(de)} durationInFrames={f(ate) - f(de)}>
    <CenaInterna whoosh={whoosh} flash={false} tremer={tremer}>
      {children}
      {flash ? <FlashSuave /> : null}
    </CenaInterna>
  </Sequence>
);

// ---------- legendas: texto corrigido (words-corrigido.json), tempos do Whisper ----------
const LIGA = new Set(["o","a","os","as","ao","aos","de","da","do","das","dos","em","no","na","nos","nas","que","e","um","uma","com","para","por","é","se","te","me","seu","sua"]);
const agrupar = (palavras) => {
  const grupos = [];
  let atual = [];
  palavras.forEach((w, i) => {
    atual.push(w);
    const prox = palavras[i + 1];
    const chars = atual.reduce((s, x) => s + x.w.length, 0);
    const fecha = !prox || /[.?!:]$/.test(w.w) || (/,$/.test(w.w) && atual.length >= 2) || atual.length >= 3 || chars + prox.w.length > 20 || prox.start - w.end > 0.45;
    if (fecha) {
      const sobra = prox && atual.length > 1 && !/[.?!:,]$/.test(w.w) && LIGA.has(w.w.toLowerCase()) ? atual.pop() : null;
      grupos.push(atual);
      atual = sobra ? [sobra] : [];
    }
  });
  return grupos;
};

const Legendas = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - LEAD;
  const grupos = agrupar(palavras);
  const idx = grupos.findIndex((g, i) => t >= g[0].start - 0.02 && t < (grupos[i + 1] ? grupos[i + 1][0].start - 0.02 : g[g.length - 1].end + 0.4));
  if (idx < 0) return null;
  const g = grupos[idx];
  const inicio = Math.round((g[0].start + LEAD) * fps);
  const pop = spring({ frame: frame - inicio, fps, config: { damping: 12, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", left: 125, right: 125, top: 1490, display: "flex", justifyContent: "center", alignItems: "baseline", flexWrap: "wrap", rowGap: 6, transform: `scale(${0.85 + 0.15 * pop})` }}>
      {g.map((w, i) => {
        const ativa = t >= w.start - 0.02;
        const atual = ativa && t < w.end + 0.08;
        return (
          <span key={i} style={{ ...FONT, display: "inline-block", whiteSpace: "nowrap", margin: "0 18px", fontSize: 72, color: atual ? colors.gold : "#fff", opacity: ativa ? 1 : 0.35, transform: atual ? "scale(1.06) rotate(-2deg)" : "none", WebkitTextStroke: "8px #05040C", paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(5,4,12,0.8)" }}>
            {w.w.replace(/[.,?!:]+$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// ---------- cenas (tempos = segundos da narração, de words.json) ----------
const T = (s) => f(s); // frame absoluto
const loc = (s, base) => f(s) - f(base); // frame local da cena

const C1 = () => (
  <>
    <FundoVideo nome="gamer" escurecer={0.15} tom="#a78bfa" />
    <Faiscas n={14} />
    <Texto em={4} y={200} size={124} rot={-3}>IA zerou</Texto>
    <Texto em={loc(2.04, -1.0) + 0} y={370} size={124} color="#140B2E" fundo={colors.gold} rot={3}>Minecraft</Texto>
    <Texto em={loc(2.42, -1.0)} y={560} size={80} fundo={colors.violet} rot={-2}>sozinha</Texto>
    <Sfx name="ding" atFrame={loc(2.04, -1.0)} />
  </>
);
const C2 = () => (
  <>
    <FundoVideo nome="servidor" escurecer={0.3} tom="#7c3aed" />
    <Faiscas n={16} />
    <Texto em={0} y={220} size={80} rot={-2}>Do início ao fim</Texto>
    <Texto em={loc(5.18, 4.4)} y={430} size={190} color="#140B2E" fundo={colors.gold} rot={3}>27 horas</Texto>
    <Sfx name="coin" atFrame={loc(5.18, 4.4)} />
  </>
);
const C3 = () => (
  <>
    <Fundo src={foto("controle")} escurecer={0.45} tom="#6d3fd6" zoom={[1.1, 1.35]} brilho={0.6} />
    <Texto em={loc(6.86, 6.8) + 2} y={230} size={120} rot={-3}>Nenhum humano</Texto>
    <Texto em={loc(8.06, 6.8)} y={540} size={96} fundo={colors.red} rot={2}>tocou no controle</Texto>
    <Sfx name="error" atFrame={loc(8.06, 6.8)} />
  </>
);
const C4 = () => (
  <>
    <FundoVideo nome="robo" escurecer={0.3} tom="#6d3fd6" brilho={0.5} />
    <Faiscas n={14} />
    <Texto em={loc(9.02, 9.0)} y={210} size={150} rot={-3}>4 agentes</Texto>
    <Texto em={loc(10.18, 9.0)} y={410} size={104} color="#140B2E" fundo={colors.gold} rot={2}>Gemini 4 Argon</Texto>
    <Texto em={loc(11.38, 9.0)} y={600} size={64} fundo={colors.violet} rot={-2}>coletaram · construíram</Texto>
    <Sfx name="pop" atFrame={loc(10.18, 9.0)} />
  </>
);
const C5 = () => (
  <>
    <FundoVideo nome="codigo" escurecer={0.4} tom="#4f46e5" />
    <Print nome="tnw" fonte="THE NEXT WEB" em={1} top={760} w={920} />
    <Texto em={loc(14.72, 12.9)} y={1130} size={72} color="#140B2E" fundo={colors.gold} rot={-2}>Derrotaram o Ender Dragon</Texto>
    <Sfx name="ding" atFrame={loc(15.84, 12.9)} />
    <Sfx name="pop" atFrame={1} />
  </>
);
const C6 = () => (
  <>
    <FundoMarca />
    <Faiscas n={22} />
    <Texto em={0} y={300} size={110} rot={-3}>Impressionante, né?</Texto>
    <Pantera pose="surpresa" left="50%" top={1000} width={600} em={4} />
  </>
);
const C7 = () => (
  <>
    <Fundo src={foto("alerta")} escurecer={0.55} tom="#7f1d1d" zoom={[1.1, 1.3]} />
    <Texto em={loc(18.38, 18.1)} y={230} size={84} rot={-2}>Na mesma semana</Texto>
    <Texto em={loc(19.9, 18.1)} y={440} size={100} color="#140B2E" fundo={colors.gold} rot={3}>outra notícia</Texto>
    <Texto em={loc(20.64, 18.1)} y={650} size={68} fundo={colors.red} rot={-2}>quase despercebida</Texto>
  </>
);
const C8 = () => (
  <>
    <Fundo src={foto("datacenter")} escurecer={0.6} tom="#1e1b4b" zoom={[1.1, 1.3]} />
    <Print nome="cnbc" fonte="CNBC" em={1} top={740} w={920} rot={2} />
    <Texto em={loc(23.54, 22.3)} y={1160} size={64} fundo={colors.violet} rot={-2}>agentes da OpenAI</Texto>
    <Texto em={loc(25.12, 22.3)} y={1220} size={50} fundo={colors.red} rot={2}>desativaram o monitoramento</Texto>
    <Sfx name="error" atFrame={loc(24.08, 22.3)} />
  </>
);
const C9 = () => (
  <>
    <FundoVideo nome="radar" escurecer={0.55} tom="#7f1d1d" />
    <Print nome="bleeping" fonte="BLEEPINGCOMPUTER" em={1} top={780} w={920} rot={-2} />
    <Texto em={loc(28.84, 26.7)} y={1180} size={110} color="#140B2E" fundo={colors.gold} rot={3}>Um negou</Texto>
    <Sfx name="pop" atFrame={1} />
  </>
);
const C10 = () => (
  <>
    <FundoVideo nome="escritorio" escurecer={0.35} tom="#4f46e5" brilho={0.8} />
    <Texto em={0} y={190} size={80} rot={-2}>E não para por aí</Texto>
    <Print nome="techcrunch" fonte="TECHCRUNCH" em={loc(31.6, 30.3)} top={800} w={900} rot={2} />
    <Texto em={loc(31.76, 30.3) + 4} y={1160} size={96} fundo={colors.violet} rot={-2}>Microsoft</Texto>
    <Sfx name="pop" atFrame={loc(31.6, 30.3)} />
  </>
);
const C11 = () => (
  <>
    <Fundo src={foto("robo")} escurecer={0.4} tom="#4c1d95" zoom={[1.1, 1.35]} brilho={0.55} />
    <Faiscas n={14} />
    <Texto em={0} y={220} size={78} rot={-2}>Modelos de fronteira</Texto>
    <Texto em={loc(33.88, 34.0) + 2} y={390} size={96} fundo={colors.red} rot={3}>não são confiáveis</Texto>
    <Texto em={loc(35.78, 34.0)} y={770} size={90} color="#140B2E" fundo={colors.gold} rot={-2}>imprevisíveis</Texto>
    <Sfx name="error" atFrame={loc(35.78, 34.0)} />
  </>
);
const C12 = () => (
  <>
    <Fundo src={foto("datacenter")} escurecer={0.35} tom="#6d3fd6" zoom={[1.1, 1.3]} brilho={0.75} />
    <Faiscas n={20} />
    <Texto em={0} y={210} size={70} rot={-2}>Agentes de IA = </Texto>
    <Texto em={loc(39.2, 37.0)} y={370} size={150} color="#140B2E" fundo={colors.gold} rot={3}>insiders</Texto>
    <Texto em={loc(41.1, 37.0)} y={620} size={46} fundo={colors.violet} rot={-2}>cuidado de quem é de dentro</Texto>
    <Sfx name="ding" atFrame={loc(39.2, 37.0)} />
    <Pantera pose="apontando" left="62%" top={1100} width={390} em={8} />
  </>
);
const C13 = () => (
  <>
    <FundoVideo nome="codigo" escurecer={0.3} zoom={[1.15, 1.3]} />
    <Faiscas n={14} cor={colors.green} />
    <Texto em={0} y={200} size={80} rot={-2}>Ao mesmo tempo</Texto>
    <Texto em={loc(44.64, 43.4)} y={330} size={150} color="#140B2E" fundo={colors.green} rot={-3}>GPT-5.6</Texto>
    <Texto em={loc(46.08, 43.4)} y={560} size={84} rot={2}>ajudou a achar</Texto>
    <Texto em={loc(47.1, 43.4)} y={730} size={100} fundo={colors.red} rot={-2}>falha crítica</Texto>
    <Sfx name="ding" atFrame={loc(44.76, 43.4)} />
  </>
);
const C14 = () => (
  <>
    <FundoVideo nome="servidor" escurecer={0.6} tom="#312e81" />
    <Print nome="cyberscoop" fonte="CYBERSCOOP" em={1} top={740} w={880} rot={-2} />
    <Texto em={loc(48.02, 47.9)} y={1170} size={120} color="#140B2E" fundo={colors.gold} rot={2}>no PHP</Texto>
    <Sfx name="pop" atFrame={1} />
  </>
);
const C15 = () => (
  <>
    <Fundo src={foto("escritorio")} escurecer={0.4} tom="#4338ca" zoom={[1.1, 1.3]} brilho={0.6} />
    <Print nome="decoder" fonte="THE DECODER" em={1} top={760} w={780} rot={2} />
    <Texto em={loc(49.12, 50.9) + 0} y={1130} size={56} fundo={colors.violet} rot={-2}>linguagem muito usada</Texto>
    <Texto em={loc(51.92, 50.9)} y={1225} size={56} color="#140B2E" fundo={colors.green} rot={2}>antes dos atacantes</Texto>
    <Sfx name="ding" atFrame={loc(51.92, 50.9)} />
  </>
);
const C16 = () => (
  <>
    <Fundo src={foto("checagem")} escurecer={0.3} tom="#7c3aed" zoom={[1.1, 1.35]} brilho={0.85} />
    <Faiscas n={24} />
    <Texto em={0} y={210} size={104} rot={-3}>Qual é a verdade?</Texto>
    <Texto em={loc(55.62, 53.4)} y={470} size={130} color="#140B2E" fundo={colors.green} rot={3}>genial</Texto>
    <Texto em={loc(56.42, 53.4)} y={680} size={110} fundo={colors.red} rot={-3}>ou perigosa?</Texto>
    <Pantera pose="pensando" left="50%" top={1140} width={370} em={6} />
    <Sfx name="pop" atFrame={loc(55.62, 53.4)} />
    <Sfx name="pop" atFrame={loc(56.42, 53.4)} />
  </>
);
const C17 = () => (
  <>
    <FundoVideo nome="escritorio" escurecer={0.3} tom="#8b5cf6" brilho={0.95} />
    <Texto em={loc(57.84, 57.4)} y={230} size={120} color="#140B2E" fundo={colors.gold} rot={-3}>As duas coisas</Texto>
    <Texto em={loc(59.72, 57.4)} y={650} size={74} rot={2}>trabalho pesado</Texto>
    <Texto em={loc(60.94, 57.4)} y={820} size={96} fundo={colors.violet} rot={-2}>mais rápido</Texto>
    <Sfx name="coin" atFrame={loc(57.84, 57.4)} />
  </>
);
const C18 = () => (
  <>
    <Fundo src={foto("negocio")} escurecer={0.3} tom="#b45353" zoom={[1.12, 1.35]} brilho={0.8} />
    <Texto em={loc(63.24, 62.5)} y={230} size={74} rot={-2}>Agente rodando no negócio</Texto>
    <Texto em={loc(65.6, 62.5)} y={440} size={130} fundo={colors.red} rot={3}>sem revisão</Texto>
    <Texto em={loc(67.42, 62.5)} y={650} size={100} rot={-2}>no escuro</Texto>
    <Sfx name="error" atFrame={loc(65.6, 62.5)} />
  </>
);
const C19 = () => (
  <>
    <Fundo src={foto("revisao")} escurecer={0.3} tom="#8b5cf6" zoom={[1.1, 1.35]} brilho={0.7} />
    <Faiscas n={26} />
    <Texto em={loc(68.76, 68.3)} y={220} size={96} rot={-3}>Sem medo da IA</Texto>
    <Texto em={loc(70.96, 68.3)} y={430} size={100} color="#140B2E" fundo={colors.gold} rot={3}>Automação</Texto>
    <Texto em={loc(71.56, 68.3)} y={640} size={100} color="#140B2E" fundo={colors.green} rot={-3}>com checagem</Texto>
    <Sfx name="ding" atFrame={loc(71.84, 68.3)} />
  </>
);
const C20 = () => (
  <>
    <Fundo src={foto("equipe")} escurecer={0.3} tom="#7c3aed" zoom={[1.1, 1.35]} brilho={0.8} />
    <Faiscas n={24} />
    <Texto em={loc(73.1, 72.7)} y={210} size={130} rot={-3}>Phanter</Texto>
    <Texto em={loc(74.32, 72.7)} y={400} size={64} fundo={colors.violet} rot={2}>agentes de verdade</Texto>
    <Texto em={loc(76.42, 72.7)} y={620} size={96} color="#140B2E" fundo={colors.gold} rot={-2}>auditados</Texto>
    <Pantera pose="comemorando" left="50%" top={1010} width={520} em={6} />
    <Sfx name="pop" atFrame={loc(74.32, 72.7)} />
    <Sfx name="coin" atFrame={loc(76.42, 72.7)} />
  </>
);
const C21 = () => (
  <>
    <Fundo src={foto("mao")} escurecer={0.3} tom="#8b5cf6" zoom={[1.1, 1.35]} brilho={0.7} />
    <Faiscas n={32} />
    <Texto em={loc(78.44, 78.2)} y={220} size={86} rot={-3}>Comenta</Texto>
    <Texto em={loc(78.88, 78.2)} y={400} size={170} color="#140B2E" fundo={colors.gold} rot={3}>AGENTE</Texto>
    <Texto em={loc(82.6, 78.2)} y={760} size={70} rot={-2}>Você confiaria o seu negócio a ela?</Texto>
    <Pantera pose="apontando" left="60%" top={1180} width={360} em={6} />
    <Sfx name="riser" atFrame={0} />
    <Sfx name="ding" atFrame={loc(78.88, 78.2)} />
  </>
);

const VOLUME_MUSICA = 0.1;

export const ShortMinecraft = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!palavras) return null;
  const musica = interpolate(frame, [0, 20, durationInFrames - 45, durationInFrames], [0, VOLUME_MUSICA, VOLUME_MUSICA, 0], clamp);
  return (
    <AbsoluteFill style={{ background: colors.bgOuter }}>
      <Audio src={staticFile("music/CuriousFocus.mp3")} volume={musica} />
      <Sequence from={Math.round(LEAD * MC_FPS)}>
        <Audio src={staticFile(`episodes/${MC_SLUG}/voz.mp3`)} />
      </Sequence>
      <Cena de={-LEAD} ate={4.4} whoosh={false} flash={false}><C1 /></Cena>
      <Cena de={4.4} ate={6.8}><C2 /></Cena>
      <Cena de={6.8} ate={9.0}><C3 /></Cena>
      <Cena de={9.0} ate={12.9}><C4 /></Cena>
      <Cena de={12.9} ate={16.6}><C5 /></Cena>
      <Cena de={16.6} ate={18.1}><C6 /></Cena>
      <Cena de={18.1} ate={22.3}><C7 /></Cena>
      <Cena de={22.3} ate={26.7}><C8 /></Cena>
      <Cena de={26.7} ate={30.3}><C9 /></Cena>
      <Cena de={30.3} ate={34.0}><C10 /></Cena>
      <Cena de={34.0} ate={37.0}><C11 /></Cena>
      <Cena de={37.0} ate={43.4}><C12 /></Cena>
      <Cena de={43.4} ate={47.9}><C13 /></Cena>
      <Cena de={47.9} ate={50.9}><C14 /></Cena>
      <Cena de={50.9} ate={53.4}><C15 /></Cena>
      <Cena de={53.4} ate={57.4}><C16 /></Cena>
      <Cena de={57.4} ate={62.5}><C17 /></Cena>
      <Cena de={62.5} ate={68.3}><C18 /></Cena>
      <Cena de={68.3} ate={72.7}><C19 /></Cena>
      <Cena de={72.7} ate={78.2}><C20 /></Cena>
      <Cena de={78.2} ate={FIM_FALA + CAUDA}><C21 /></Cena>
      <Legendas palavras={palavras} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,4,12,0.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const calculateMinecraftMetadata = async ({ props }) => {
  const resp = await fetch(staticFile(`episodes/${MC_SLUG}/words-corrigido.json`));
  const palavras = await resp.json();
  return { durationInFrames: MC_FRAMES, fps: MC_FPS, props: { ...props, palavras } };
};
