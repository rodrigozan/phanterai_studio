import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { Sfx } from "../components/Sfx";
import { TerminalTypewriter } from "../components/TerminalTypewriter";
import { FundoMarca, Texto, Pantera, Faiscas, CenaInterna, FONT } from "./ShortTempero";

export const OL_SLUG = "ollama-claude-code";
export const OL_FPS = 30;
const LEAD = 0.6;
const FIM_FALA = 102.7;
const CAUDA = 2.0;
export const OL_FRAMES = Math.round((LEAD + FIM_FALA + CAUDA) * OL_FPS);
const CIANO = "#22D3EE";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

// Tempo da narração (s) -> frame do vídeo; `loc` = frame local dentro da cena que começa em `base`.
const f = (a) => Math.round((a + LEAD) * OL_FPS);
const loc = (s, base) => f(s) - f(base);

// ---------- legendas palavra por palavra (words-corrigido.json) ----------
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
    <div style={{ position: "absolute", left: 110, right: 110, top: 1490, display: "flex", justifyContent: "center", alignItems: "baseline", flexWrap: "wrap", rowGap: 6, transform: `scale(${0.85 + 0.15 * pop})` }}>
      {g.map((w, i) => {
        const ativa = t >= w.start - 0.02;
        const atual = ativa && t < w.end + 0.08;
        return (
          <span key={i} style={{ ...FONT, textTransform: "none", display: "inline-block", whiteSpace: "nowrap", margin: "0 16px", fontSize: 70, color: atual ? colors.gold : "#fff", opacity: ativa ? 1 : 0.35, transform: atual ? "scale(1.06) rotate(-2deg)" : "none", WebkitTextStroke: "8px #05040C", paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(5,4,12,0.8)" }}>
            {w.w.replace(/[.,?!:]+$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// ---------- blocos ----------
const Cena = ({ de, ate, children, whoosh = true, flash = true, tremer = 10 }) => (
  <Sequence from={f(de)} durationInFrames={f(ate) - f(de)}>
    <CenaInterna whoosh={whoosh} flash={flash} tremer={tremer}>{children}</CenaInterna>
  </Sequence>
);

// Entra com mola no frame local `em`.
const Pop = ({ em = 0, children, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - em;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 11, mass: 0.6, stiffness: 150 } });
  return <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 1.4), ...style }}>{children}</div>;
};

const Glitch = ({ children, size = 150 }) => {
  const frame = useCurrentFrame();
  const forte = frame < 24 || frame % 47 < 4;
  const dx = forte ? Math.sin(frame * 7.3) * 14 : 0;
  const base = { ...FONT, fontSize: size, position: "absolute", left: 40, right: 40, top: 0, transform: `translateX(${dx}px)` };
  return (
    <div style={{ position: "relative", height: size * 3.4 }}>
      {forte ? <div style={{ ...base, color: CIANO, transform: `translateX(${dx - 12}px)`, mixBlendMode: "screen", opacity: 0.8 }}>{children}</div> : null}
      {forte ? <div style={{ ...base, color: colors.red, transform: `translateX(${dx + 12}px)`, mixBlendMode: "screen", opacity: 0.8 }}>{children}</div> : null}
      <div style={{ ...base, color: "#fff", WebkitTextStroke: "3px #05040C", paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(0,0,0,0.55)" }}>{children}</div>
    </div>
  );
};

const Passo = ({ children, em = 0 }) => <Texto em={em} y={170} size={64} color="#140B2E" fundo={colors.gold} rot={-1.5} lado={50}>{children}</Texto>;

const Bloco = ({ em, titulo, sub, cor, y }) => (
  <Pop em={em} style={{ position: "absolute", left: 140, right: 140, top: y, height: 210, borderRadius: 36, background: `linear-gradient(135deg, ${cor}55, ${cor}18)`, border: `4px solid ${cor}`, boxShadow: `0 0 60px ${cor}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <div style={{ ...FONT, fontSize: 78, color: "#fff", textTransform: "none" }}>{titulo}</div>
    <div style={{ ...FONT, fontSize: 38, color: cor, textTransform: "none", fontWeight: 700 }}>{sub}</div>
  </Pop>
);

const Seta = ({ em, y }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - em, [0, 10], [0, 1], clamp);
  if (frame < em) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontSize: 120, lineHeight: 1, color: colors.gold, opacity: t, transform: `translateY(${(1 - t) * -30}px)` }}>↓</div>;
};

const Chip = ({ em, y, nome, uso, cor = CIANO }) => (
  <Pop em={em} style={{ position: "absolute", left: 90, right: 90, top: y, height: 92, borderRadius: 46, background: "#0D1117", border: `3px solid ${cor}`, boxShadow: `0 0 30px ${cor}55`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 40, color: cor }}>{nome}</span>
    <span style={{ ...FONT, textTransform: "none", fontSize: 36, color: "#fff", fontWeight: 700 }}>{uso}</span>
  </Pop>
);

const Criterio = ({ em, y, n, titulo, sub }) => (
  <Pop em={em} style={{ position: "absolute", left: 70, right: 70, top: y, height: 190, borderRadius: 32, background: "linear-gradient(135deg, #8B5CF633, #140B2Eee)", border: "3px solid #C084FC", boxShadow: "0 0 40px #8B5CF655", display: "flex", alignItems: "center", gap: 30, padding: "0 36px" }}>
    <div style={{ ...FONT, fontSize: 90, color: colors.gold, width: 90 }}>{n}</div>
    <div style={{ textAlign: "left" }}>
      <div style={{ ...FONT, textAlign: "left", fontSize: 52, color: "#fff", textTransform: "none" }}>{titulo}</div>
      <div style={{ ...FONT, textAlign: "left", fontSize: 34, color: "#C084FC", textTransform: "none", fontWeight: 700 }}>{sub}</div>
    </div>
  </Pop>
);

// Tela simulando o Claude Code aberto, com o modelo no cabeçalho (":cloud" pulsa em ciano).
const ClaudeAberto = ({ em }) => {
  const frame = useCurrentFrame();
  const pulso = 0.6 + 0.4 * Math.abs(Math.sin(frame / 7));
  return (
    <Pop em={em} style={{ width: 940, borderRadius: 28, background: "#0D1117", border: "2px solid #D97757", boxShadow: "0 30px 80px rgba(0,0,0,0.65), 0 0 60px #D9775755", padding: "40px 44px", fontFamily: "monospace" }}>
      <div style={{ color: "#D97757", fontSize: 44, fontWeight: 700 }}>✻ Claude Code</div>
      <div style={{ color: "#9AA4B2", fontSize: 36, marginTop: 14 }}>modelo:</div>
      <div style={{ fontSize: 56, fontWeight: 700, color: "#fff" }}>glm-5<span style={{ color: CIANO, textShadow: `0 0 ${30 * pulso}px ${CIANO}`, transform: `scale(${1 + 0.08 * pulso})`, display: "inline-block" }}>:cloud</span></div>
      <div style={{ color: "#9AA4B2", fontSize: 34, marginTop: 20 }}>~/meu-projeto</div>
      <div style={{ marginTop: 26, border: "2px solid #ffffff33", borderRadius: 16, padding: "18px 24px", color: "#fff", fontSize: 38 }}>&gt; <span style={{ color: "#6B7280" }}>pergunte qualquer coisa…</span></div>
    </Pop>
  );
};

// ---------- cenas (tempos = segundos da narração em words.json) ----------
const C1 = () => (
  <>
    <FundoMarca />
    <Faiscas n={16} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200 }}><Glitch size={150}>Claude Code de graça?</Glitch></div>
    <Texto em={loc(3.3, -LEAD)} y={760} size={96} color="#140B2E" fundo={colors.gold} rot={-3}>Sem GPU</Texto>
    <Texto em={loc(4.3, -LEAD)} y={900} size={96} color="#140B2E" fundo={colors.gold} rot={3}>Sem pagar API</Texto>
    <Texto em={loc(6.8, -LEAD)} y={1040} size={110} fundo={colors.violet} rot={-2}>Ollama</Texto>
    <Pantera pose="surpresa" left="87%" top={1180} width={330} em={6} />
    <Sfx name="whoosh" atFrame={0} />
    <Sfx name="riser" atFrame={4} />
    <Sfx name="ding" atFrame={loc(6.8, -LEAD)} />
  </>
);

const C2 = () => (
  <>
    <FundoMarca />
    <Faiscas n={12} />
    <Texto em={loc(8.1, 8.0)} y={150} size={92} rot={-2}>O Ollama faz a ponte</Texto>
    <Bloco em={loc(8.9, 8.0)} y={420} titulo="Claude Code" sub="a ferramenta" cor="#D97757" />
    <Seta em={loc(9.9, 8.0)} y={650} />
    <Bloco em={loc(10.3, 8.0)} y={800} titulo="Ollama" sub="a ponte" cor={CIANO} />
    <Seta em={loc(11.1, 8.0)} y={1030} />
    <Bloco em={loc(11.4, 8.0)} y={1160} titulo="LLM" sub="local ou nuvem" cor={colors.violetLight} />
    <Sfx name="pop" atFrame={loc(8.9, 8.0)} />
    <Sfx name="pop" atFrame={loc(10.3, 8.0)} />
    <Sfx name="pop" atFrame={loc(11.4, 8.0)} />
  </>
);

const C3 = () => (
  <>
    <FundoMarca />
    <Passo em={2}>1. Instale o Ollama</Passo>
    <Texto em={loc(17.0, 15.2)} y={290} size={52} color={CIANO}>v0.15 ou superior</Texto>
    <div style={{ position: "absolute", left: 70, top: 440 }}>
      <TerminalTypewriter startAt={14} titulo="Linux — instalar" lines={[
        { type: "command", text: "curl -fsSL https://ollama.com/install.sh | sh" },
        { type: "output", text: ">>> Install complete." },
        { type: "command", text: "ollama --version" },
        { type: "output", text: "ollama version is 0.15+" },
      ]} />
    </div>
    <Pop em={loc(19.3, 15.2)} style={{ position: "absolute", left: 70, right: 70, top: 1230, textAlign: "center" }}>
      <div style={{ ...FONT, textTransform: "none", fontSize: 44, color: "#fff", fontWeight: 700 }}>Windows e Mac: baixe em <span style={{ color: colors.gold }}>ollama.com</span></div>
    </Pop>
    <Sfx name="pop" atFrame={14} />
    <Sfx name="ding" atFrame={loc(19.3, 15.2)} />
  </>
);

const C4 = () => (
  <>
    <FundoMarca />
    <Passo em={2}>2. Entre na conta</Passo>
    <Texto em={loc(27.2, 24.1)} y={290} size={50} color={CIANO}>necessário para modelos :cloud</Texto>
    <div style={{ position: "absolute", left: 70, top: 480 }}>
      <TerminalTypewriter startAt={loc(25.0, 24.1)} titulo="bash — login" lines={[
        { type: "command", text: "ollama signin" },
        { type: "output", text: "Open the link in your browser to sign in..." },
      ]} />
    </div>
    <Pop em={loc(31.2, 24.1)} style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center" }}>
      <span style={{ ...FONT, textTransform: "none", fontSize: 90, color: "#140B2E", background: CIANO, padding: "10px 40px", borderRadius: 28 }}>:cloud</span>
    </Pop>
    <Sfx name="pop" atFrame={loc(25.0, 24.1)} />
    <Sfx name="ding" atFrame={loc(31.2, 24.1)} />
  </>
);

const C5 = () => (
  <>
    <FundoMarca />
    <Faiscas n={14} />
    <Passo em={2}>3. Um comando e pronto</Passo>
    <Sequence from={0} durationInFrames={loc(40.2, 32.7)} layout="none">
      <div style={{ position: "absolute", left: 70, top: 440 }}>
        <TerminalTypewriter startAt={loc(34.5, 32.7)} titulo="bash — launch" charsPerFrame={1.4} lines={[
          { type: "command", text: "ollama launch claude --model glm-5:cloud" },
          { type: "output", text: "Launching Claude Code with glm-5:cloud..." },
        ]} />
      </div>
    </Sequence>
    <Sequence from={loc(40.2, 32.7)} layout="none">
      <div style={{ position: "absolute", left: 70, top: 440 }}><ClaudeAberto em={0} /></div>
      <Sfx name="whoosh" atFrame={0} />
      <Sfx name="coin" atFrame={4} />
    </Sequence>
    <Sfx name="pop" atFrame={loc(34.5, 32.7)} />
  </>
);

const C6 = () => (
  <>
    <FundoMarca />
    <Texto em={2} y={130} size={100} color="#140B2E" fundo={colors.gold} rot={-2}>3 critérios</Texto>
    <Criterio em={loc(53.4, 48.8)} y={290} n="1" titulo="Contexto grande" sub="mínimo 64k tokens" />
    <Criterio em={loc(60.4, 48.8)} y={500} n="2" titulo="Feito para código" sub="e uso de ferramentas" />
    <Criterio em={loc(65.1, 48.8)} y={710} n="3" titulo="Limite do plano free" sub="teste e veja quanto rende" />
    <Chip em={loc(72.9, 48.8)} y={940} nome="glm-5:cloud" uso="projetos longos" />
    <Chip em={loc(75.3, 48.8)} y={1045} nome="qwen3-coder:480b-cloud" uso="código" cor="#C084FC" />
    <Chip em={loc(77.9, 48.8)} y={1150} nome="kimi-k2.5:cloud" uso="uso geral" cor={colors.gold} />
    <Chip em={loc(81.0, 48.8)} y={1255} nome="gpt-oss:120b-cloud" uso="alternativa" cor={colors.green} />
    {[53.4, 60.4, 65.1, 72.9, 75.3, 77.9, 81.0].map((s) => <Sfx key={s} name="pop" atFrame={loc(s, 48.8)} />)}
  </>
);

const C7 = () => (
  <>
    <FundoMarca />
    <Passo em={2}>Dica bônus</Passo>
    <Texto em={loc(85.9, 84.1)} y={290} size={42} color={CIANO}>troque de modelo sem reconfigurar</Texto>
    <div style={{ position: "absolute", left: 70, top: 440 }}>
      <TerminalTypewriter startAt={loc(88.8, 84.1)} titulo="bash — config" lines={[
        { type: "command", text: "ollama launch claude --config" },
        { type: "output", text: "Select a model..." },
      ]} />
    </div>
    <Pop em={loc(92.3, 84.1)} style={{ position: "absolute", left: 90, right: 90, top: 1130, borderRadius: 28, background: "#2A1020", border: `3px solid ${colors.red}`, padding: "22px 30px", textAlign: "center" }}>
      <div style={{ ...FONT, textTransform: "none", fontSize: 36, color: "#fff", fontWeight: 700 }}>⚠ Modelos na nuvem enviam seu código para servidores externos</div>
    </Pop>
    <Sfx name="pop" atFrame={loc(88.8, 84.1)} />
    <Sfx name="error" atFrame={loc(92.3, 84.1)} />
  </>
);

const C8 = () => {
  const frame = useCurrentFrame();
  const pulso = 1 + 0.05 * Math.sin(frame / 5);
  return (
    <>
      <FundoMarca />
      <Faiscas n={30} />
      <Texto em={2} y={200} size={80} color={colors.gold}>PHANTER AI</Texto>
      <Texto em={8} y={380} size={120} rot={-2}>Salva e segue</Texto>
      <Texto em={14} y={560} size={96} fundo={colors.violet} rot={2}>@phanterai</Texto>
      <Pop em={24} style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center" }}>
        <div style={{ ...FONT, textTransform: "none", fontSize: 64, color: "#fff", background: "#EF4444", padding: "22px 80px", borderRadius: 60, transform: `scale(${pulso})`, boxShadow: "0 0 50px #EF444488" }}>Seguir</div>
      </Pop>
      <Pantera pose="comemorando" left="50%" top={1200} width={520} em={4} />
      <Sfx name="whoosh" atFrame={0} />
      <Sfx name="coin" atFrame={24} />
      <Sfx name="riser" atFrame={2} />
    </>
  );
};

const VOLUME_MUSICA = 0.08;

export const ShortOllama = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!palavras) return null;
  const musica = interpolate(frame, [0, 20, durationInFrames - 45, durationInFrames], [0, VOLUME_MUSICA, VOLUME_MUSICA, 0], clamp);
  return (
    <AbsoluteFill style={{ background: colors.bgOuter }}>
      <Audio src={staticFile("music/Daniel.mp3")} volume={musica} />
      <Sequence from={Math.round(LEAD * OL_FPS)}>
        <Audio src={staticFile(`episodes/${OL_SLUG}/voz.mp3`)} />
      </Sequence>
      <Cena de={-LEAD} ate={8.0} whoosh={false} flash={false}><C1 /></Cena>
      <Cena de={8.0} ate={15.2}><C2 /></Cena>
      <Cena de={15.2} ate={24.1}><C3 /></Cena>
      <Cena de={24.1} ate={32.7}><C4 /></Cena>
      <Cena de={32.7} ate={48.8}><C5 /></Cena>
      <Cena de={48.8} ate={84.1}><C6 /></Cena>
      <Cena de={84.1} ate={99.2}><C7 /></Cena>
      <Cena de={99.2} ate={FIM_FALA + CAUDA}><C8 /></Cena>
      <Legendas palavras={palavras} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,4,12,0.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const calculateOllamaMetadata = async ({ props }) => {
  const resp = await fetch(staticFile(`episodes/${OL_SLUG}/words-corrigido.json`));
  const palavras = await resp.json();
  return { durationInFrames: OL_FRAMES, fps: OL_FPS, props: { ...props, palavras } };
};
