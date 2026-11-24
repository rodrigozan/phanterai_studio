import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AREA, FONT, clamp, pasta, useSlug } from "../base";
import { colors, radii } from "../theme";

const MONO = "'DejaVu Sans Mono', 'Menlo', monospace";
const UI = "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const digitado = (texto, frame, inicio, fim) => {
  const p = interpolate(frame, [inicio, fim], [0, 1], clamp);
  return texto.slice(0, Math.round(texto.length * p));
};

const Cursor = ({ cor = "#111" }) => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 3, height: "1em", background: cor, marginLeft: 2, verticalAlign: "-0.15em", opacity: Math.floor(frame / 15) % 2 ? 0 : 1 }} />;
};

const Janela = ({ children, escuro = false, aba, url, urlDigitada, mostraCursor }) => (
  <div style={{ position: "absolute", left: AREA.x, top: AREA.y - 20, width: AREA.w, height: AREA.h + 20, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", border: `3px solid ${colors.roxo}`, background: escuro ? "#0d1117" : "#fff", display: "flex", flexDirection: "column", fontFamily: UI }}>
    <div style={{ height: 96, background: "#dee1e6", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 44, display: "flex", alignItems: "flex-end", paddingLeft: 18, gap: 10 }}>
        <div style={{ display: "flex", gap: 9, alignSelf: "center" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 15, height: 15, borderRadius: 8, background: c }} />)}
        </div>
        <div style={{ marginLeft: 20, background: "#fff", borderRadius: "10px 10px 0 0", padding: "8px 22px", fontSize: 19, color: "#333", minWidth: 280, maxWidth: 520, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{aba}</div>
      </div>
      <div style={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", padding: "0 18px", gap: 16 }}>
        <div style={{ color: "#777", fontSize: 24 }}>←  →  ⟳</div>
        <div style={{ flex: 1, background: "#f1f3f4", borderRadius: 22, padding: "8px 22px", fontSize: 24, color: "#202124", fontFamily: UI }}>
          {urlDigitada ?? url}{mostraCursor && <Cursor />}
        </div>
      </div>
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

export const Navegador = ({ url, aba, dur, escuro, children }) => {
  const frame = useCurrentFrame();
  const fimDig = Math.min(40, dur * 0.3);
  const urlD = digitado(url, frame, 4, fimDig);
  const carregado = frame > fimDig + 14;
  const barra = interpolate(frame, [fimDig + 2, fimDig + 14], [0, 1], clamp);
  const o = interpolate(frame, [fimDig + 10, fimDig + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Janela url={url} urlDigitada={urlD} mostraCursor={frame < fimDig + 6} aba={carregado ? aba : "Nova guia"} escuro={escuro}>
        {barra > 0 && barra < 1 && <div style={{ position: "absolute", top: 0, left: 0, height: 5, width: `${barra * 100}%`, background: "#1a73e8", zIndex: 5 }} />}
        <AbsoluteFill style={{ opacity: o, background: escuro ? "#0d1117" : "#fff" }}>{carregado && children}</AbsoluteFill>
      </Janela>
    </AbsoluteFill>
  );
};

export const PaginaImagem = ({ img, w, h }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 200], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
      <Img src={pasta(slug, img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `scale(${z})` }} />
    </AbsoluteFill>
  );
};

const GH = { fundo: "#0d1117", borda: "#30363d", texto: "#e6edf3", fraco: "#8d96a0", link: "#4493f8", verde: "#238636" };

const ARQUIVOS = [
  { nome: "Cena 01 - Lara.md", commit: "Cena 01", quando: "5 dias atrás" },
  { nome: "Planejamento - O Rasgo de Kalunga.md", commit: "Correções da cena 01", quando: "5 dias atrás" },
];
const COMMITS = [
  { msg: "Correções da cena 01", hora: "16:36", id: "1b0646b" },
  { msg: "Cena 01", hora: "16:35", id: "2b608e7" },
  { msg: "Initial Commit", hora: "16:12", id: "3b62417" },
];

const Topo = () => (
  <div style={{ borderBottom: `1px solid ${GH.borda}`, padding: "22px 40px 0", background: "#010409" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 38, color: GH.texto }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>RZ</div>
      <span style={{ color: GH.texto }}>rodrigozan</span><span style={{ color: GH.fraco }}>/</span><b>o-rasgo-de-kalunga</b>
      <span style={{ marginLeft: 12, fontSize: 18, border: `1px solid ${GH.borda}`, borderRadius: 14, padding: "2px 12px", color: GH.fraco }}>Public</span>
    </div>
    <div style={{ display: "flex", gap: 40, marginTop: 20, fontSize: 28, color: GH.texto }}>
      {["Code", "Issues", "Pull requests", "Actions", "Insights"].map((t, i) => (
        <div key={t} style={{ paddingBottom: 12, borderBottom: i === 0 ? "3px solid #f78166" : "3px solid transparent" }}>{t}</div>
      ))}
    </div>
  </div>
);

export const GitHubArquivos = ({ dest }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: GH.fundo, color: GH.texto, fontFamily: UI }}>
      <Topo />
      <div style={{ padding: "30px 60px", display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <div style={{ border: `1px solid ${GH.borda}`, borderRadius: 8, padding: "8px 18px", fontSize: 22 }}>⑂ main</div>
            <div style={{ flex: 1 }} />
            <div style={{ background: GH.verde, borderRadius: 8, padding: "8px 22px", fontSize: 22, fontWeight: 600 }}>Code ▾</div>
          </div>
          <div style={{ border: `1px solid ${GH.borda}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "#161b22", padding: "18px 26px", display: "flex", fontSize: 27, gap: 14, alignItems: "center" }}>
              <b>rodrigozan</b><span style={{ color: GH.fraco }}>Correções da cena 01</span><div style={{ flex: 1 }} />
              <span style={{ color: GH.fraco, outline: dest === "commits" ? `4px solid ${colors.amarelo}` : "none", outlineOffset: 6, borderRadius: 6 }}>🕘 3 Commits</span>
            </div>
            {ARQUIVOS.map((a, i) => {
              const o = interpolate(frame, [8 + i * 8, 20 + i * 8], [0, 1], clamp);
              const on = dest === "arquivos";
              return (
                <div key={a.nome} style={{ opacity: o, display: "flex", padding: "22px 26px", borderTop: `1px solid ${GH.borda}`, fontSize: 31, background: on ? "rgba(242,204,69,0.12)" : "transparent" }}>
                  <span style={{ width: 640 }}>📄 {a.nome}</span>
                  <span style={{ flex: 1, color: GH.fraco }}>{a.commit}</span>
                  <span style={{ color: GH.fraco }}>{a.quando}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24, border: `1px solid ${GH.borda}`, borderRadius: 10, padding: "20px 28px", opacity: interpolate(frame, [30, 44], [0, 1], clamp) }}>
            <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 10 }}>O Rasgo de Kalunga — Planejamento do Conto</div>
            <div style={{ fontSize: 26, color: GH.fraco, lineHeight: 1.45 }}>Ficha · Premissa · Regras do universo · <span style={{ color: colors.amarelo }}>Personagens</span> · Estrutura (6 cenas) · Temas · Fontes</div>
          </div>
        </div>
        <div style={{ width: 360, fontSize: 26, color: GH.fraco, lineHeight: 1.45 }}>
          <div style={{ color: GH.texto, fontWeight: 700, fontSize: 30, marginBottom: 10 }}>About</div>
          Conto de apocalipse folclórico: mitos africanos e brasileiros em Santa Branca.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GitHubHistorico = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: GH.fundo, color: GH.texto, fontFamily: UI }}>
      <Topo />
      <div style={{ padding: "30px 60px" }}>
        <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 18 }}>Commits</div>
        <div style={{ fontSize: 22, color: GH.fraco, marginBottom: 12 }}>◯ Commits on Nov 19, 2026</div>
        <div style={{ border: `1px solid ${GH.borda}`, borderRadius: 10, overflow: "hidden" }}>
          {COMMITS.map((c, i) => {
            const o = interpolate(frame, [6 + i * 10, 18 + i * 10], [0, 1], clamp);
            const x = interpolate(frame, [6 + i * 10, 18 + i * 10], [30, 0], clamp);
            return (
              <div key={c.id} style={{ opacity: o, transform: `translateX(${x}px)`, display: "flex", alignItems: "center", padding: "22px 26px", borderTop: i ? `1px solid ${GH.borda}` : "none", fontSize: 27 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.msg}</div>
                  <div style={{ fontSize: 20, color: GH.fraco, marginTop: 6 }}>rodrigozan committed · 19 nov. 2026, {c.hora}</div>
                </div>
                <span style={{ fontFamily: MONO, fontSize: 20, color: GH.fraco, border: `1px solid ${GH.borda}`, borderRadius: 6, padding: "4px 12px" }}>{c.id}</span>
                <span style={{ marginLeft: 18, fontSize: 20, color: GH.link }}>&lt;&gt; ver esta versão</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CL = { fundo: "#faf9f5", texto: "#29261b", fraco: "#87867f", balao: "#f0eee6", borda: "#e6e3da", acento: "#c96442" };

const Linha = ({ t, o }) => {
  const partes = t.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div style={{ opacity: o, marginBottom: 12, display: "flex", gap: 12 }}>
      {t.startsWith("- ") && <span style={{ color: CL.fraco }}>•</span>}
      <span>{partes.map((p, i) => (p.startsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : <span key={i}>{i === 0 && t.startsWith("- ") ? p.slice(2) : p}</span>))}</span>
    </div>
  );
};

export const ChatClaude = ({ pedido, resposta = [], ferramenta, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fimDig = Math.min(Math.max(45, pedido.length * 0.55), dur * 0.4);
  const enviado = frame >= fimDig + 8;
  const sobe = spring({ frame: frame - fimDig - 8, fps, config: { damping: 200 }, durationInFrames: 14 });
  const iniResp = fimDig + 24;
  const passo = Math.max(5, Math.min(16, (dur - iniResp - 30) / Math.max(1, resposta.length)));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: AREA.x, top: AREA.y - 20, width: AREA.w, height: AREA.h + 20, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", border: `3px solid ${colors.roxo}`, background: CL.fundo, fontFamily: UI, color: CL.texto, display: "flex" }}>
        <div style={{ width: 250, background: "#f3f1ea", borderRight: `1px solid ${CL.borda}`, padding: "26px 22px", fontSize: 19, color: CL.fraco }}>
          <div style={{ fontWeight: 700, color: CL.texto, fontSize: 24, marginBottom: 26 }}>Claude</div>
          <div style={{ marginBottom: 14 }}>+ Nova conversa</div>
          <div style={{ marginBottom: 14 }}>Projetos</div>
          <div style={{ color: CL.texto, background: "#e9e6dc", borderRadius: 8, padding: "8px 10px" }}>O Rasgo de Kalunga</div>
        </div>
        <div style={{ flex: 1, position: "relative", padding: "34px 120px 150px" }}>
          {enviado && (
            <div style={{ display: "flex", justifyContent: "flex-end", opacity: sobe, transform: `translateY(${(1 - sobe) * 60}px)` }}>
              <div style={{ background: CL.balao, borderRadius: 18, padding: "16px 26px", fontSize: 28, maxWidth: 900, lineHeight: 1.3 }}>{pedido}</div>
            </div>
          )}
          {enviado && ferramenta && frame > iniResp - 12 && (
            <div style={{ marginTop: 28, fontSize: 22, color: CL.fraco, opacity: interpolate(frame, [iniResp - 12, iniResp], [0, 1], clamp) }}>{ferramenta} ›</div>
          )}
          <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.35 }}>
            {resposta.map((t, i) => {
              const ini = iniResp + i * passo;
              if (frame < ini) return null;
              return <Linha key={i} t={t} o={interpolate(frame, [ini, ini + 8], [0, 1], clamp)} />;
            })}
          </div>
          <div style={{ position: "absolute", left: 120, right: 120, bottom: 30, background: "#fff", border: `1px solid ${CL.borda}`, borderRadius: 20, padding: "18px 24px 54px", fontSize: 27, boxShadow: "0 4px 18px rgba(0,0,0,0.06)", minHeight: 70 }}>
            {!enviado ? (
              <span>{digitado(pedido, frame, 6, fimDig)}<Cursor /></span>
            ) : (
              <span style={{ color: CL.fraco }}>Responder…</span>
            )}
            <div style={{ position: "absolute", right: 16, bottom: 12, width: 40, height: 40, borderRadius: 10, background: frame > fimDig && frame < fimDig + 10 ? "#a24d32" : CL.acento, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>↑</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FL = { fundo: "#0e0e10", painel: "#1c1c20", borda: "#2e2e34", texto: "#e8e8ea", fraco: "#9a9aa3" };

export const FlowGerar = ({ prompt, img, dur }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const fimDig = Math.min(80, dur * 0.35);
  const clique = fimDig + 10;
  const fimGera = clique + Math.min(45, dur * 0.2);
  const texto = digitado(prompt, frame, 4, fimDig);
  const gerando = frame >= clique && frame < fimGera;
  const pronto = frame >= fimGera;
  const oImg = interpolate(frame, [fimGera, fimGera + 14], [0, 1], clamp);
  const z = interpolate(frame, [fimGera, dur], [1.04, 1], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: AREA.x, top: AREA.y - 20, width: AREA.w, height: AREA.h + 20, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", border: `3px solid ${colors.roxo}`, background: FL.fundo, fontFamily: UI, color: FL.texto }}>
        <div style={{ height: 70, display: "flex", alignItems: "center", padding: "0 30px", borderBottom: `1px solid ${FL.borda}`, fontSize: 26, gap: 20 }}>
          <b>Google Flow</b><span style={{ color: FL.fraco, fontSize: 20 }}>O Rasgo de Kalunga · personagens</span>
        </div>
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, bottom: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {gerando && (
            <div style={{ width: 700, height: 390, borderRadius: 16, background: `linear-gradient(100deg, #222 ${((frame - clique) * 4) % 140 - 40}%, #3a3a42 ${((frame - clique) * 4) % 140 - 20}%, #222 ${((frame - clique) * 4) % 140}%)`, display: "flex", alignItems: "flex-end", padding: 20, fontSize: 22, color: FL.fraco }}>Gerando 1 imagem…</div>
          )}
          {pronto && (
            <div style={{ height: "100%", aspectRatio: "1376 / 768", borderRadius: 16, overflow: "hidden", opacity: oImg, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
              <Img src={pasta(slug, img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: 220, right: 220, bottom: 26, height: 190, background: FL.painel, border: `1px solid ${FL.borda}`, borderRadius: 22, padding: "16px 24px", overflow: "hidden" }}>
          <div style={{ fontSize: 21, color: FL.fraco, marginBottom: 8 }}>✦ O que vamos criar hoje?</div>
          <div style={{ fontSize: 25, lineHeight: 1.35, height: 100, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div>{frame < clique ? texto : prompt}{frame < clique && <Cursor cor="#fff" />}</div>
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 14, width: 46, height: 46, borderRadius: 23, background: frame >= clique - 4 && frame < clique + 6 ? colors.amarelo : "#fff", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, transform: `scale(${frame >= clique - 4 && frame < clique + 6 ? 0.85 : 1})` }}>→</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Documento = ({ nome, linhas, dur }) => {
  const frame = useCurrentFrame();
  const total = linhas.reduce((t, l) => t + Math.max(1, Math.ceil(l.length / 78)) * 34 + (l.startsWith("#") ? 30 : 10), 0);
  const desce = interpolate(frame, [20, dur - 20], [0, Math.max(0, total - 560)], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: AREA.x + 120, top: AREA.y - 20, width: AREA.w - 240, height: AREA.h + 20, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", border: `3px solid ${colors.roxo}`, background: "#16161c", fontFamily: UI, color: "#e8e6ef" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 28px", background: "#1f1f27", borderBottom: "1px solid #33333d", fontSize: 24, gap: 14 }}>
          <span style={{ color: colors.amarelo }}>MD</span>{nome}
        </div>
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 26, left: 48, right: 48, transform: `translateY(${-desce}px)` }}>
          {linhas.map((l, i) => {
            const h1 = l.startsWith("# ");
            const h2 = l.startsWith("## ");
            const t = l.replace(/^#+ /, "").replace(/^- /, "• ").replace(/\*\*/g, "");
            return <div key={i} style={{ fontSize: h1 ? 40 : h2 ? 34 : 25, fontWeight: h1 || h2 ? 800 : 400, color: h2 ? colors.amarelo : "#e8e6ef", lineHeight: 1.3, marginBottom: 10, marginTop: h2 ? 18 : 0 }}>{t}</div>;
          })}
        </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { FONT, radii };
