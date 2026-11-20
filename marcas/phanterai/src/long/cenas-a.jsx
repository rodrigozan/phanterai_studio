// Cenas de conceito, motivação e fechamento (fundo roxo da marca ou b-roll do Pexels).
// Cada cena recebe { slug, d, pose, dur }: `d` é o `dados` do roteiro.json já com `em` (frame local) nas âncoras.
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import {
  CIANO, LARANJA, FONT, MONO, W, H, clamp, FundoMarca, Fundo, Faiscas169, Pop, Desliza, Glitch, Cartao, Pant, Texto, Term, Sfx, Cursor, Digita,
} from "./base";

const Linha = ({ children, y, x = 0, w = W, style = {} }) => <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", justifyContent: "center", ...style }}>{children}</div>;

const Pilula = ({ children, cor = colors.gold, texto = "#140B2E", size = 56, rot = 0, style = {} }) => (
  <div style={{ ...FONT, textTransform: "none", fontSize: size, color: texto, background: cor, padding: "10px 40px", borderRadius: 60, transform: `rotate(${rot}deg)`, boxShadow: "0 12px 40px rgba(0,0,0,0.45)", ...style }}>{children}</div>
);

// ---------- 1. gancho ----------
export const Gancho = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.5} />
    <Faiscas169 n={22} />
    <Linha y={70}><Glitch size={190}>Claude Code</Glitch></Linha>
    <Texto em={14} y={290} size={200} color="#140B2E" fundo={colors.gold} rot={-2} lado={300}>de graça</Texto>
    <Pop em={d.a.em} sfx="coin" style={{ position: "absolute", left: 150, top: 580 }}><Pilula cor={colors.green} size={110} rot={-3}>R$ 0</Pilula></Pop>
    <Pop em={d.b.em} style={{ position: "absolute", left: 560, top: 600 }}><Pilula cor={colors.violet} texto="#fff" size={80} rot={2}>10 minutos</Pilula></Pop>
    <Pop em={d.c.em} style={{ position: "absolute", left: 150, top: 790 }}>
      <Pilula cor="#0D1117" texto="#fff" size={52} rot={-1} style={{ border: `3px solid ${CIANO}` }}>Windows · Mac · Linux</Pilula>
    </Pop>
    <Pant pose={pose ?? "surpresa"} x={1640} y={690} w={470} em={8} />
    <Sfx name="riser" atFrame={4} />
  </>
);

// ---------- 2. o que o Claude Code faz ----------
export const OQueFaz = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const riscar = interpolate(frame - d.pago.em - 20, [0, 18], [0, 100], clamp);
  return (
    <>
      <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.72} />
      <Faiscas169 n={10} />
      <Linha y={40}><Texto em={2} y={0} size={86} rot={-1}>O que ele faz</Texto></Linha>
      <div style={{ position: "absolute", left: 130, top: 220, display: "grid", gridTemplateColumns: "560px 560px", gap: 34 }}>
        {d.itens.map((it, i) => <Cartao key={i} em={it.em} titulo={it.titulo} sub={it.sub} cor={[CIANO, colors.gold, colors.green, colors.violetLight][i]} w={560} h={170} size={52} />)}
      </div>
      <Pop em={d.pago.em} sfx="error" style={{ position: "absolute", left: 150, top: 640 }}>
        <div style={{ position: "relative" }}>
          <Pilula cor={colors.red} texto="#fff" size={78} rot={-2}>Assinatura paga</Pilula>
          <div style={{ position: "absolute", left: 20, top: "52%", height: 10, width: `${riscar}%`, background: "#fff", transform: "rotate(-2deg)", borderRadius: 5 }} />
        </div>
      </Pop>
      <Pant pose={pose ?? "pensando"} x={1640} y={720} w={440} em={10} />
    </>
  );
};

// ---------- 3. promessa (3 sistemas) ----------
const IconeWin = () => <svg width="120" height="120" viewBox="0 0 24 24"><path fill={CIANO} d="M2 4.5 11 3v8H2zM12 2.8 22 1.3V11H12zM2 12.5h9V21L2 19.5zM12 12.5h10v9.8L12 21z" /></svg>;
const IconeMac = () => <div style={{ ...FONT, fontSize: 110, color: "#fff", fontFamily: MONO }}>⌘</div>;
const IconeLinux = () => <div style={{ ...FONT, fontSize: 96, color: colors.green, fontFamily: MONO }}>&gt;_</div>;
export const Promessa = ({ d, pose }) => (
  <>
    <FundoMarca />
    <Faiscas169 n={16} />
    <Linha y={50}><Texto em={2} y={0} size={96} rot={-1} fundo={colors.violet}>Passo a passo, tela por tela</Texto></Linha>
    {[
      { a: d.win, nome: "Windows", ic: <IconeWin />, cor: CIANO, x: 150 },
      { a: d.mac, nome: "macOS", ic: <IconeMac />, cor: "#fff", x: 690 },
      { a: d.linux, nome: "Linux", ic: <IconeLinux />, cor: colors.green, x: 1230 },
    ].map((c) => (
      <Pop key={c.nome} em={c.a.em} style={{ position: "absolute", left: c.x, top: 290, width: 500, height: 330, borderRadius: 40, background: `linear-gradient(160deg, ${c.cor}30, #140B2Eee)`, border: `4px solid ${c.cor}`, boxShadow: `0 0 60px ${c.cor}55`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        {c.ic}
        <div style={{ ...FONT, textTransform: "none", fontSize: 64, color: "#fff" }}>{c.nome}</div>
      </Pop>
    ))}
    <Pop em={d.lim.em} sfx="error" style={{ position: "absolute", left: 270, top: 700 }}>
      <Pilula cor="#2A1020" texto="#fff" size={50} style={{ border: `4px solid ${colors.red}` }}>No final: como escolher o seu modelo</Pilula>
    </Pop>
    <Pant pose={pose ?? "comemorando"} x={1700} y={820} w={330} em={6} />
  </>
);

// ---------- 4. terminal: conceito ----------
export const TerminalConceito = ({ d, pose }) => (
  <>
    <FundoMarca />
    <Faiscas169 n={10} />
    <div style={{ position: "absolute", left: 90, top: 90 }}>
      <Term titulo="terminal" w={1050} h={640} size={34} linhas={[
        { t: "cmd", text: "cd meu-projeto", em: d.t1.em },
        { t: "cmd", text: "claude", em: d.t1.em + 40 },
        { t: "ok", text: "✻ Claude Code iniciado" },
        { t: "cmd", text: "crie uma tela de login", prompt: "> ", promptCor: "#D97757", em: d.t2.em },
        { t: "dim", text: "● lendo arquivos…", em: d.t3.em },
        { t: "dim", text: "● editando login.html…", em: d.t3.em + 40 },
        { t: "dim", text: "● rodando comando…", em: d.t3.em + 80 },
      ]} />
    </div>
    {d.passos.map((p, i) => (
      <Desliza key={i} em={p.em} de="dir" style={{ position: "absolute", left: 1210, top: 90 + i * 190 }}>
        <Cartao em={p.em} titulo={p.titulo} sub={p.sub} cor={[CIANO, colors.gold, colors.green][i]} w={620} h={170} size={46} icone={String(i + 1)} />
      </Desliza>
    ))}
    <Pant pose={pose ?? "pensando"} x={1740} y={860} w={280} em={8} />
  </>
);

// ---------- 5. diagrama: ferramenta + cérebro ----------
const Cerebro = ({ cor, girar = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width="170" height="170" viewBox="0 0 100 100" style={{ transform: `rotate(${girar}deg) scale(${1 + 0.04 * Math.sin(frame / 6)})` }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={cor} strokeWidth="4" strokeDasharray="6 5" />
      <circle cx="50" cy="50" r="24" fill={`${cor}33`} stroke={cor} strokeWidth="4" />
      <path d="M38 50 Q44 38 50 50 T62 50" fill="none" stroke={cor} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

export const DiagramaCerebro = ({ d, pose }) => {
  const frame = useCurrentFrame();
  const troca = interpolate(frame - d.c.em, [0, 40], [0, 360], clamp);
  const pulso = (frame / 14) % 1;
  return (
    <>
      <FundoMarca />
      <Faiscas169 n={12} />
      <Linha y={60}><Texto em={2} y={0} size={84} rot={-1}>A ferramenta e o cérebro</Texto></Linha>
      <Pop em={d.a.em} style={{ position: "absolute", left: 180, top: 300, width: 600, height: 400, borderRadius: 44, background: `linear-gradient(145deg, ${LARANJA}44, #140B2Eee)`, border: `5px solid ${LARANJA}`, boxShadow: `0 0 70px ${LARANJA}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 110, color: LARANJA }}>✻</div>
        <div style={{ ...FONT, textTransform: "none", fontSize: 66, color: "#fff" }}>Claude Code</div>
        <div style={{ ...FONT, textTransform: "none", fontSize: 38, color: LARANJA }}>a ferramenta</div>
      </Pop>
      <div style={{ position: "absolute", left: 790, top: 490, width: 340, height: 20, borderRadius: 10, background: "#ffffff22", opacity: frame >= d.a.em + 10 ? 1 : 0 }}>
        <div style={{ position: "absolute", left: `${pulso * 90}%`, top: -6, width: 34, height: 32, borderRadius: 16, background: colors.gold, boxShadow: `0 0 20px ${colors.gold}` }} />
      </div>
      <Pop em={d.b.em} style={{ position: "absolute", left: 1140, top: 300, width: 600, height: 400, borderRadius: 44, background: `linear-gradient(145deg, ${colors.violetLight}44, #140B2Eee)`, border: `5px solid ${colors.violetLight}`, boxShadow: `0 0 70px ${colors.violetLight}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Cerebro cor={colors.violetLight} girar={troca} />
        <div style={{ ...FONT, textTransform: "none", fontSize: 62, color: "#fff" }}>Modelo de IA</div>
        <div style={{ ...FONT, textTransform: "none", fontSize: 38, color: colors.violetLight }}>o cérebro</div>
      </Pop>
      <Pop em={d.c.em} sfx="whoosh" style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
        <Pilula cor={colors.gold} size={64} rot={-2}>⟲ esse cérebro pode ser trocado</Pilula>
      </Pop>
      <Pant pose={pose ?? "pensando"} x={110} y={850} w={260} em={8} />
    </>
  );
};

// ---------- 6. diagrama: troca pelo modelo gratuito ----------
export const DiagramaTroca = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const encaixa = spring({ frame: frame - d.b.em, fps: 30, config: { damping: 10, mass: 0.7 } });
  return (
    <>
      <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.55} />
      <Linha y={60}><Texto em={2} y={0} size={86} rot={-1}>Troque o cérebro</Texto></Linha>
      <Pop em={d.a.em} style={{ position: "absolute", left: 120, top: 300, width: 560, height: 360, borderRadius: 44, background: `linear-gradient(145deg, ${LARANJA}55, #140B2Eee)`, border: `5px solid ${LARANJA}`, boxShadow: `0 0 70px ${LARANJA}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 100, color: LARANJA }}>✻</div>
        <div style={{ ...FONT, textTransform: "none", fontSize: 64, color: "#fff" }}>Claude Code</div>
      </Pop>
      <div style={{ position: "absolute", left: 780 + (1 - encaixa) * 400, top: 300, width: 560, height: 360, borderRadius: 44, background: `linear-gradient(145deg, ${colors.green}55, #140B2Eee)`, border: `5px solid ${colors.green}`, boxShadow: `0 0 70px ${colors.green}77`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: frame >= d.b.em ? 1 : 0 }}>
        {frame >= d.b.em ? <Sfx name="coin" atFrame={d.b.em} /> : null}
        <div style={{ ...FONT, textTransform: "none", fontSize: 40, color: colors.green }}>cérebro novo</div>
        <div style={{ ...FONT, textTransform: "none", fontSize: 64, color: "#fff" }}>Modelo gratuito</div>
        <div style={{ ...FONT, textTransform: "none", fontSize: 46, color: colors.gold }}>R$ 0</div>
      </div>
      <Pop em={d.c.em} style={{ position: "absolute", left: 160, top: 740 }}><Pilula cor="#0D1117" texto="#fff" size={52} style={{ border: `3px solid ${CIANO}` }}>roda no seu computador</Pilula></Pop>
      <Pop em={d.d.em} style={{ position: "absolute", left: 900, top: 740 }}><Pilula cor="#0D1117" texto="#fff" size={52} style={{ border: `3px solid ${colors.gold}` }}>até sem internet</Pilula></Pop>
      <Pant pose={pose ?? "feliz"} x={1700} y={640} w={380} em={8} />
    </>
  );
};

// ---------- 7. aviso honesto ----------
export const AvisoHonesto = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.7} />
    <Linha y={50}><Texto em={2} y={0} size={86} rot={-1} color="#fff" fundo={colors.red}>Não é o Claude</Texto></Linha>
    <Desliza em={d.a.em} de="esq" style={{ position: "absolute", left: 130, top: 230 }}>
      <Pilula cor="#0D1117" texto="#fff" size={50} style={{ border: `3px solid ${colors.gold}` }}>Menor, erra mais</Pilula>
    </Desliza>
    <div style={{ position: "absolute", left: 130, top: 360 }}>
      {d.bom.map((b, i) => <Cartao key={i} em={b.em} titulo={b.t} cor={colors.green} icone="✓" w={900} h={110} size={50} style={{ marginBottom: 22 }} />)}
    </div>
    <Pop em={d.nao.em} sfx="error" style={{ position: "absolute", left: 130, top: 780 }}>
      <Cartao em={d.nao.em} sfx={null} titulo="Resultado de modelo premium" cor={colors.red} icone="✕" w={900} h={110} size={50} />
    </Pop>
    <Pant pose={pose ?? "pensando"} x={1560} y={640} w={480} em={10} />
  </>
);

// ---------- 8 e 34. CTA (inscreva-se / like) ----------
const IconeLike = ({ cor }) => <svg width="64" height="64" viewBox="0 0 24 24"><path fill={cor} d="M2 10h4v11H2zM8 10l4-8c1.5 0 2.5 1 2.2 2.6L13.5 8H20c1 0 2 1 1.8 2.2l-1.4 8.6c-.2 1.2-1.2 2.2-2.4 2.2H8z" /></svg>;
export const Cta = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const apertaLike = frame >= d.like.em;
  const apertaSub = frame >= d.sub.em;
  const sLike = spring({ frame: frame - d.like.em, fps, config: { damping: 6, mass: 0.5 } });
  const sSub = spring({ frame: frame - d.sub.em, fps, config: { damping: 8, mass: 0.6 } });
  const sino = apertaSub ? Math.sin((frame - d.sub.em) / 2.2) * 18 * Math.max(0, 1 - (frame - d.sub.em) / 50) : 0;
  return (
    <>
      <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.62} />
      <Faiscas169 n={apertaSub ? 36 : 14} />
      <Linha y={70}><Texto em={2} y={0} size={110} rot={-1}>Aprenda YouTube</Texto></Linha>
      <Linha y={250}><div style={{ ...FONT, textTransform: "none", fontSize: 44, color: colors.violetLight }}>tutorial de IA passo a passo</div></Linha>
      <div style={{ position: "absolute", left: 230, top: 400, display: "flex", gap: 50, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 54px", borderRadius: 70, background: apertaLike ? "#3EA6FF" : "#272727", transform: `scale(${apertaLike ? 0.9 + 0.1 * sLike + 0.12 * (1 - Math.abs(1 - sLike)) : 1})`, boxShadow: apertaLike ? "0 0 60px #3EA6FF99" : "0 12px 40px rgba(0,0,0,0.5)" }}>
          <IconeLike cor="#fff" />
          <span style={{ ...FONT, textTransform: "none", fontSize: 58, color: "#fff" }}>Gostei</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 64px", borderRadius: 70, background: apertaSub ? "#3a3a3a" : "#FF0000", transform: `scale(${apertaSub ? 0.92 + 0.08 * sSub : 1})`, boxShadow: apertaSub ? "none" : "0 0 50px #FF000088" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" style={{ transform: `rotate(${sino}deg)` }}><path fill="#fff" d="M12 22a2.4 2.4 0 0 0 2.4-2.4h-4.8A2.4 2.4 0 0 0 12 22zm7-6.4V11c0-3.5-1.9-6.4-5-7.2V3a2 2 0 0 0-4 0v.8C6.9 4.6 5 7.5 5 11v4.6l-2 2V19h18v-1.4z" /></svg>
          <span style={{ ...FONT, textTransform: "none", fontSize: 58, color: "#fff" }}>{apertaSub ? "Inscrito" : "Inscrever-se"}</span>
        </div>
      </div>
      {frame >= d.like.em ? <Sfx name="coin" atFrame={d.like.em} /> : null}
      {frame >= d.sub.em ? <Sfx name="ding" atFrame={d.sub.em} /> : null}
      <Cursor pontos={[{ f: d.like.em - 30, x: 900, y: 800 }, { f: d.like.em, x: 400, y: 470 }, { f: d.sub.em - 4, x: 400, y: 470 }, { f: d.sub.em + 4, x: 960, y: 470 }]} cliques={[d.like.em + 2, d.sub.em + 6]} />
      {d.guia ? (
        <Pop em={d.guia.em} sfx="coin" style={{ position: "absolute", left: 250, top: 600 }}>
          <div style={{ background: colors.gold, color: "#140B2E", borderRadius: 40, padding: "18px 44px", ...FONT, textTransform: "none", fontSize: 54, boxShadow: "0 14px 40px rgba(0,0,0,0.45)" }}>{d.guiaTxt ?? "Comente: Guia Completo"}</div>
        </Pop>
      ) : null}
      {d.q ? (
        <Pop em={d.q.em} style={{ position: "absolute", left: 250, top: 750 }}>
          <div style={{ background: "#fff", color: "#140B2E", borderRadius: 40, padding: "18px 44px", ...FONT, textTransform: "none", fontSize: 46, maxWidth: 1000, boxShadow: "0 14px 40px rgba(0,0,0,0.45)" }}>{d.qTxt ?? "Qual projeto você vai criar primeiro?"}</div>
        </Pop>
      ) : null}
      <Pant pose={pose ?? "comemorando"} x={1620} y={730} w={470} em={6} />
    </>
  );
};

// ---------- 9. plano em três passos ----------
export const PlanoTresPassos = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.72} />
    <Linha y={40}><Texto em={2} y={0} size={90} rot={-1} fundo={colors.violet}>O plano em 3 passos</Texto></Linha>
    {d.passos.map((p, i) => (
      <Desliza key={i} em={p.em} de="esq" style={{ position: "absolute", left: 140, top: 210 + i * 230 }}>
        <Cartao em={p.em} titulo={p.titulo} sub={p.sub} cor={[CIANO, LARANJA, colors.green][i]} icone={String(i + 1)} w={1250} h={190} size={62} />
      </Desliza>
    ))}
    <Pant pose={pose ?? "apontando"} x={1680} y={560} w={420} em={10} />
  </>
);

// ---------- 10. requisitos ----------
export const Requisitos = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.74} />
    <Linha y={40}><Texto em={2} y={0} size={86} rot={-1}>O que você precisa</Texto></Linha>
    <div style={{ position: "absolute", left: 110, top: 200 }}>
      <Desliza em={d.itens[0].em - 6} style={{ ...FONT, textAlign: "left", fontSize: 44, color: colors.gold, marginBottom: 14 }}>SISTEMA</Desliza>
      {d.sistemas.map((s, i) => <Cartao key={i} em={d.itens[i].em} titulo={s.t} sub={s.sub} cor={[CIANO, "#fff", colors.green][i]} w={820} h={130} size={50} style={{ marginBottom: 22 }} />)}
    </div>
    <div style={{ position: "absolute", left: 990, top: 200 }}>
      <Desliza em={d.itens[3].em - 6} style={{ ...FONT, textAlign: "left", fontSize: 44, color: colors.gold, marginBottom: 14 }}>MEMÓRIA E PLACA</Desliza>
      {d.memoria.map((s, i) => <Cartao key={i} em={d.itens[3 + i].em} titulo={s.t} sub={s.sub} cor={[LARANJA, colors.violetLight, colors.gold][i]} w={820} h={130} size={50} style={{ marginBottom: 22 }} />)}
    </div>
    <Pant pose={pose ?? "pensando"} x={1730} y={800} w={300} em={10} />
  </>
);

// ---------- escolha do cérebro (positivo: você escolhe) ----------
export const EscolhaCerebro = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.72} />
    <Faiscas169 n={14} />
    <Linha y={40}><Texto em={2} y={0} size={86} rot={-1}>Você escolhe o cérebro</Texto></Linha>
    <Desliza em={d.o.em} de="esq" style={{ position: "absolute", left: 120, top: 230 }}><Cartao em={d.o.em} titulo="Ollama" sub="modelos de vários tamanhos, até os grandes" cor={CIANO} w={1180} h={170} size={64} /></Desliza>
    <Desliza em={d.r.em} de="esq" style={{ position: "absolute", left: 120, top: 430 }}><Cartao em={d.r.em} titulo="OpenRouter" sub="um monte de opções boas, várias grátis" cor={colors.violetLight} w={1180} h={170} size={64} /></Desliza>
    <Desliza em={d.m.em} de="esq" style={{ position: "absolute", left: 120, top: 630 }}><Cartao em={d.m.em} sfx="coin" titulo="Sua máquina" sub="quanto mais potente, mais longe você vai" cor={colors.gold} w={1180} h={170} size={64} /></Desliza>
    <Pant pose={pose ?? "comemorando"} x={1620} y={620} w={460} em={10} />
  </>
);

// ---------- terminal ou Claude Desktop ----------
export const TerminalOuDesktop = ({ d }) => {
  const frame = useCurrentFrame();
  const aba = frame >= d.code.em;
  return (
    <>
      <FundoMarca />
      <Faiscas169 n={14} />
      <Linha y={40}><Texto em={2} y={0} size={86} rot={-1}>Duas formas de usar</Texto></Linha>
      <Pop em={d.t.em} style={{ position: "absolute", left: 100, top: 230, width: 740, height: 560, borderRadius: 34, background: "#0D1117", border: `4px solid ${CIANO}`, boxShadow: `0 0 50px ${CIANO}55`, overflow: "hidden" }}>
        <div style={{ ...FONT, textTransform: "none", fontSize: 54, color: CIANO, padding: "24px 34px" }}>Terminal</div>
        <div style={{ fontFamily: MONO, fontSize: 38, color: "#E6EDF3", padding: "10px 34px" }}><span style={{ color: CIANO }}>$ </span><Digita text="claude" em={d.t.em + 8} cpf={0.3} /></div>
        <div style={{ fontFamily: MONO, fontSize: 30, color: "#6B7280", padding: "20px 34px" }}>para quem gosta de comando</div>
      </Pop>
      <div style={{ position: "absolute", left: 850, top: 470, ...FONT, fontSize: 54, color: colors.gold, width: 150 }}>ou</div>
      <Pop em={d.desk.em} style={{ position: "absolute", left: 1010, top: 230, width: 810, height: 560, borderRadius: 34, background: "#1b1a22", border: `4px solid ${LARANJA}`, boxShadow: `0 0 50px ${LARANJA}55`, overflow: "hidden" }}>
        <div style={{ ...FONT, textTransform: "none", fontSize: 54, color: LARANJA, padding: "24px 34px" }}>Claude Desktop</div>
        <div style={{ display: "flex", gap: 14, padding: "0 34px" }}>
          {["Chat", "Cowork", "Code"].map((t) => {
            const ativa = t === "Code" && aba;
            return <div key={t} style={{ ...FONT, textTransform: "none", fontSize: 40, padding: "10px 30px", borderRadius: 16, background: ativa ? LARANJA : "#2a2933", color: ativa ? "#fff" : "#9AA4B2", transform: ativa ? "scale(1.08)" : "none" }}>{t}</div>;
          })}
        </div>
        {aba ? <Pop em={d.gui.em} sfx="ding" style={{ margin: "34px 34px 0", border: "2px solid #ffffff22", borderRadius: 16, padding: "20px 26px", fontFamily: MONO, fontSize: 30, color: "#E6EDF3" }}>Interface gráfica: sem digitar comando</Pop> : null}
      </Pop>
    </>
  );
};

// ---------- o que dá para criar ----------
export const OQueCriar = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.7} />
    <Faiscas169 n={16} />
    <Linha y={30}><Texto em={2} y={0} size={86} rot={-1} fundo={colors.violet}>O que dá pra criar</Texto></Linha>
    <div style={{ position: "absolute", left: 130, top: 190, display: "grid", gridTemplateColumns: "700px 700px", gap: 30 }}>
      {d.itens.map((it, i) => <Cartao key={i} em={it.em} titulo={it.t} sub={it.sub} cor={[CIANO, colors.green, colors.violetLight, colors.gold][i]} w={700} h={170} size={58} />)}
    </div>
    <Pop em={d.guia.em} sfx="coin" style={{ position: "absolute", left: 130, top: 600 }}>
      <div style={{ background: "#fff", borderRadius: 30, padding: "20px 34px", width: 1100, display: "flex", alignItems: "center", gap: 24, boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: colors.violet }} />
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 44, color: "#111" }}>Comente: <b style={{ color: "#c2410c" }}>Guia Completo</b></div>
      </div>
    </Pop>
    <Pant pose={pose ?? "comemorando"} x={1700} y={780} w={380} em={10} />
  </>
);
