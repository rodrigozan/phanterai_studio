// Cenas de Claude Desktop + programa conectado (público leigo: nada de terminal). Criadas no vídeo
// "Claude + Blender" (23/11/2026). Tudo vem do `dados` do roteiro.json; tempos `em` = frame local.
//   desktop-conectores   menu{ao} (Personalizar), diretorio{ao}, busca{ao} (digita "Blender"), achou{ao}, instalar{ao}, ok{ao}
//                        app (padrão "Blender"), appSub, autor
//   desktop-pedido       pedido, a{ao} (começa a digitar), perm{ao} + ok{ao} (pede permissão, clique em Permitir),
//                        acoes[{ ao, txt }] (linhas de ferramenta), fim{ ao, txt } (resposta), thumb (imagem do resultado)
//   blender-janela       modo "arrastar"  arrasta{ao}, pergunta{ao}, permitir{ao}, arrasta2{ao}, instala{ao}
//                        modo "preferencias" edit{ao}, addons{ao}, procura{ao}, start{ao}, ponte{ao}, toda{ao}
//                        modo "video"   video, videoDur, revela{ao}, itens[{ ao, t }] (outliner), ok{ ao, txt }
//                        modo "render"  video, videoDur, menu{ao}, anim{ao}, fim{ao}
//   instalador-sistemas  nome, baixa{ao}, win{ao}, winFim{ao}, mac{ao}, macArrasta{ao}, linux{ao}, linuxBusca{ao}, linuxInstala{ao}
// Telas recriadas (ilustrativas): a etiqueta "tela ilustrativa" aparece em todas.
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { CIANO, LARANJA, FONT, MONO, clamp, pasta, FundoMarca, Faiscas169, Pop, Pant, Sfx, Cursor, Digita } from "./base";
import { Faisca } from "./CapaV2";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
const fade = (f, em, d = 8) => interpolate(f - em, [0, d], [0, 1], clamp);
const Ilustrativa = ({ x = 1560, y = 1000 }) => <div style={{ position: "absolute", left: x, top: y, ...FONT, textTransform: "none", fontSize: 28, color: "#9AA4B2" }}>tela ilustrativa</div>;
const Selo = ({ em, x, y, cor = colors.green, children, sfx = "ding", size = 46 }) => (
  <Pop em={em} sfx={sfx} style={{ position: "absolute", left: x, top: y }}>
    <div style={{ ...FONT, textTransform: "none", fontSize: size, color: [colors.gold, colors.green, CIANO].includes(cor) ? "#140B2E" : "#fff", background: cor, padding: "10px 36px", borderRadius: 60, boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>{children}</div>
  </Pop>
);
// Ícone genérico de "programa 3D" (não é a marca registrada): anel laranja + núcleo azul.
export const Icone3D = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#fff" />
    <circle cx="54" cy="54" r="28" fill="none" stroke="#EA7600" strokeWidth="13" />
    <circle cx="54" cy="54" r="12" fill="#265787" />
    <path d="M12 40 L40 40" stroke="#EA7600" strokeWidth="10" strokeLinecap="round" />
  </svg>
);

// ---------- Claude Desktop ----------
const CD = { bg: "#FAF9F5", side: "#F0EEE6", borda: "#E3E0D6", txt: "#29261B", sub: "#6B6658" };
const ClaudeDesktop = ({ children, ativo, x = 110, y = 50, w = 1700, h = 860 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: CD.bg, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.55)", fontFamily: SANS, color: CD.txt }}>
    <div style={{ height: 46, background: CD.side, borderBottom: `1px solid ${CD.borda}`, display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
      {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 15, height: 15, borderRadius: "50%", background: c }} />)}
      <div style={{ flex: 1, textAlign: "center", fontSize: 20, color: CD.sub, marginRight: 60 }}>Claude</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 46, bottom: 0, width: 300, background: CD.side, borderRight: `1px solid ${CD.borda}`, padding: "22px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}><Faisca size={42} tile={false} /><span style={{ fontSize: 30, fontFamily: "Georgia, serif" }}>Claude</span></div>
      {["Nova conversa", "Conversas", "Projetos", "Personalizar"].map((t) => (
        <div key={t} style={{ fontSize: 24, padding: "12px 14px", borderRadius: 10, marginBottom: 4, background: ativo === t ? "#E4DFD1" : "transparent", fontWeight: ativo === t ? 700 : 400 }}>{t}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 300, top: 46, right: 0, bottom: 0 }}>{children}</div>
  </div>
);

export const DesktopConectores = ({ d, pose }) => {
  const f = useCurrentFrame();
  const app = d.app ?? "Blender";
  const abriu = f >= d.diretorio.em;
  const achou = f >= d.achou.em;
  const inst = f >= d.instalar.em;
  const prog = interpolate(f - d.instalar.em, [0, 24], [0, 1], clamp);
  const pronto = inst && prog >= 1;
  return (
    <>
      <FundoMarca />
      <ClaudeDesktop ativo={f >= d.menu.em ? "Personalizar" : "Nova conversa"}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 50, color: CD.txt, opacity: abriu ? 0.25 : 1 }}>Como posso ajudar hoje?</div>
        {abriu ? (
          <Pop em={d.diretorio.em} sfx="whoosh" de={0.85} style={{ position: "absolute", left: 90, top: 40, width: 1210, height: 740, borderRadius: 20, background: "#fff", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", border: `1px solid ${CD.borda}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 260, background: "#FBFAF7", borderRight: `1px solid ${CD.borda}`, padding: 26 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 34, marginBottom: 24 }}>Diretório</div>
              {["Skills", "Conectores", "Plugins"].map((t) => <div key={t} style={{ fontSize: 24, padding: "10px 14px", borderRadius: 10, background: t === "Conectores" ? "#EFEBE0" : "transparent", fontWeight: t === "Conectores" ? 700 : 400, marginBottom: 4 }}>{t}</div>)}
            </div>
            <div style={{ position: "absolute", left: 290, top: 30, right: 30 }}>
              <div style={{ border: `2px solid ${f >= d.busca.em - 6 ? LARANJA : CD.borda}`, borderRadius: 14, padding: "14px 20px", fontSize: 28, color: CD.txt, minHeight: 64, boxSizing: "border-box", lineHeight: "34px" }}>
                {f >= d.busca.em ? <Digita text={app} em={d.busca.em} cpf={0.35} cor={CD.txt} /> : <span style={{ color: "#A39E8F" }}>Buscar conectores…</span>}
              </div>
              {achou ? (
                <Pop em={d.achou.em} sfx="pop" style={{ marginTop: 30, border: `2px solid ${CD.borda}`, borderRadius: 18, padding: 26, display: "flex", alignItems: "center", gap: 24 }}>
                  <Icone3D size={96} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 34, fontWeight: 700 }}>{app} <span style={{ fontSize: 22, color: "#2F7D32" }}>✓ oficial</span></div>
                    <div style={{ fontSize: 22, color: CD.sub, marginTop: 6 }}>{d.appSub ?? "Interface em linguagem natural com a API Python"}</div>
                    <div style={{ fontSize: 22, color: CD.sub, marginTop: 4 }}>Feito por <b>{d.autor ?? "Blender Lab"}</b></div>
                  </div>
                  <div style={{ padding: "14px 34px", borderRadius: 12, background: pronto ? "#2F7D32" : "#1F1E1D", color: "#fff", fontSize: 26, fontWeight: 700, minWidth: 140, textAlign: "center" }}>{pronto ? "✓ Instalado" : inst ? "Instalando…" : "Instalar"}</div>
                </Pop>
              ) : null}
              {inst ? <div style={{ marginTop: 20, height: 10, borderRadius: 5, background: "#EEE", overflow: "hidden" }}><div style={{ width: `${prog * 100}%`, height: "100%", background: pronto ? "#2F7D32" : LARANJA }} /></div> : null}
              {pronto ? <Sfx name="ding" atFrame={d.instalar.em + 24} /> : null}
              {achou ? <div style={{ marginTop: 24, fontSize: 21, color: CD.sub, opacity: fade(f, d.achou.em + 10) }}>Um complemento é necessário dentro do {app}: siga as instruções do Blender Lab.</div> : null}
            </div>
          </Pop>
        ) : null}
      </ClaudeDesktop>
      <Cursor
        pontos={[{ f: 0, x: 1300, y: 700 }, { f: d.menu.em, x: 230, y: 330 }, { f: d.diretorio.em, x: 520, y: 330 }, { f: d.busca.em - 4, x: 900, y: 175 }, { f: d.achou.em + 4, x: 1500, y: 330 }, { f: d.instalar.em, x: 1700, y: 335 }, { f: d.instalar.em + 40, x: 1700, y: 335 }]}
        cliques={[d.menu.em, d.diretorio.em, d.busca.em - 2, d.instalar.em]}
      />
      {f >= d.ok.em ? <Selo em={d.ok.em} x={520} y={800}>{`Conector do ${app} instalado`}</Selo> : null}
      <Ilustrativa x={1580} y={1010} />
      <Pant pose={pose ?? "comemorando"} x={1760} y={820} w={240} em={d.ok.em} />
    </>
  );
};

export const DesktopPedido = ({ slug, d, pose }) => {
  const f = useCurrentFrame();
  const fimDigita = d.a.em + Math.ceil(d.pedido.length / 1.1);
  const enviado = f >= fimDigita + 4;
  const permitiu = d.ok && f >= d.ok.em;
  const primeiraAcao = d.acoes?.[0]?.em ?? 1e9;
  return (
    <>
      <FundoMarca />
      <ClaudeDesktop ativo="Conversas">
        <div style={{ position: "absolute", left: 140, right: 140, top: 40, bottom: 150 }}>
          {enviado ? (
            <Pop em={fimDigita + 4} sfx="whoosh" style={{ marginLeft: "auto", maxWidth: 900, background: "#EFEBE0", borderRadius: 22, padding: "20px 28px", fontSize: 30, lineHeight: 1.35 }}>{d.pedido}</Pop>
          ) : null}
          {enviado && f < Math.min(primeiraAcao, d.perm?.em ?? 1e9, d.fim?.em ?? 1e9) ? (
            <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: CD.sub }}><Faisca size={40} tile={false} />{"Pensando" + ".".repeat(1 + (Math.floor(f / 8) % 3))}</div>
          ) : null}
          {d.perm && f >= d.perm.em ? (
            <Pop em={d.perm.em} sfx="pop" style={{ marginTop: 26, width: 820, border: `2px solid ${permitiu ? "#2F7D32" : LARANJA}`, borderRadius: 18, padding: "22px 28px", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, fontWeight: 700 }}><Icone3D size={54} />O Claude quer usar o Blender</div>
              <div style={{ fontSize: 22, color: CD.sub, marginTop: 8 }}>Executar código Python na cena aberta</div>
              <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
                <div style={{ padding: "12px 28px", borderRadius: 12, background: permitiu ? "#2F7D32" : "#1F1E1D", color: "#fff", fontSize: 24, fontWeight: 700 }}>{permitiu ? "✓ Permitido" : "Permitir"}</div>
                <div style={{ padding: "12px 28px", borderRadius: 12, border: `2px solid ${CD.borda}`, fontSize: 24 }}>Negar</div>
              </div>
            </Pop>
          ) : null}
          {(d.acoes ?? []).map((a, i) => (f >= a.em + (permitiu ? 8 : 0) ? (
            <Pop key={i} em={a.em + (permitiu ? 8 : 0)} sfx={null} style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 14, border: `1px solid ${CD.borda}`, borderRadius: 12, padding: "12px 20px", fontSize: 24, background: "#fff" }}>
              <span style={{ color: LARANJA, fontSize: 26 }}>⚒</span>{a.txt}<span style={{ color: "#2F7D32" }}>{f >= a.em + 40 ? " ✓" : " …"}</span>
            </Pop>
          ) : null))}
          {d.fim && f >= d.fim.em ? (
            <Pop em={d.fim.em} sfx="ding" style={{ marginTop: 22, display: "flex", gap: 24, alignItems: "flex-start" }}>
              <Faisca size={44} tile={false} />
              <div style={{ fontSize: 28, lineHeight: 1.4, maxWidth: 640 }}>{d.fim.txt}</div>
              {d.thumb ? <Img src={pasta(slug, d.thumb)} style={{ width: 440, borderRadius: 14, border: `4px solid ${colors.green}`, boxShadow: "0 14px 40px rgba(0,0,0,0.25)" }} /> : null}
            </Pop>
          ) : null}
        </div>
        <div style={{ position: "absolute", left: 140, right: 140, bottom: 34, minHeight: 70, border: `2px solid ${f >= d.a.em && !enviado ? LARANJA : CD.borda}`, borderRadius: 22, background: "#fff", padding: "18px 26px", fontSize: 28, lineHeight: 1.35 }}>
          {f >= d.a.em && !enviado ? <Digita text={d.pedido} em={d.a.em} cpf={1.1} cor={CD.txt} /> : <span style={{ color: "#A39E8F" }}>Responder ao Claude…</span>}
        </div>
      </ClaudeDesktop>
      {d.perm ? <Cursor pontos={[{ f: d.perm.em, x: 1300, y: 760 }, { f: d.ok.em - 2, x: 620, y: 470 + 0 }, { f: d.ok.em + 30, x: 620, y: 470 }]} cliques={[d.ok.em]} /> : null}
      <Ilustrativa x={1580} y={1010} />
      <Pant pose={pose ?? "apontando"} x={1770} y={820} w={230} em={d.ok?.em ?? d.fim?.em ?? 10} />
    </>
  );
};

// ---------- Blender ----------
const BL = { top: "#1D1D1D", painel: "#2B2B2B", vp: "#3A3A3A", borda: "#151515", txt: "#D6D6D6", sub: "#8E8E8E", azul: "#4772B3" };
const Grade = () => (
  <AbsoluteFill style={{ background: BL.vp, backgroundImage: "linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: "62%", height: 2, background: "#B0403F88" }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, left: "48%", width: 2, background: "#6F9E2E88" }} />
  </AbsoluteFill>
);
const BlenderUI = ({ children, outliner = [], status, menuAberto, x = 60, y = 40, w = 1800, h = 900 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 12, overflow: "hidden", background: BL.borda, boxShadow: "0 40px 100px rgba(0,0,0,0.6)", fontFamily: SANS, color: BL.txt }}>
    <div style={{ height: 40, background: BL.top, display: "flex", alignItems: "center", gap: 26, padding: "0 16px", fontSize: 19 }}>
      <Icone3D size={26} />
      {["File", "Edit", "Render", "Window", "Help"].map((m) => <span key={m} style={{ padding: "4px 10px", borderRadius: 6, background: menuAberto === m ? BL.azul : "transparent", color: menuAberto === m ? "#fff" : BL.txt }}>{m}</span>)}
      <div style={{ display: "flex", gap: 6, marginLeft: 30 }}>{["Layout", "Modeling", "Sculpting", "Shading", "Animation", "Rendering"].map((t, i) => <span key={t} style={{ padding: "4px 12px", borderRadius: 6, background: i === 0 ? "#3D3D3D" : "transparent", color: i === 0 ? "#fff" : BL.sub }}>{t}</span>)}</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 40, width: 52, bottom: 34, background: BL.painel, borderRight: `2px solid ${BL.borda}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 14 }}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 6, background: i === 0 ? BL.azul : "#3C3C3C" }} />)}
    </div>
    <div style={{ position: "absolute", left: 54, top: 40, right: 362, bottom: 34, overflow: "hidden" }}>{children}</div>
    <div style={{ position: "absolute", right: 0, top: 40, width: 360, bottom: 34, background: BL.painel, borderLeft: `2px solid ${BL.borda}`, padding: 14, fontSize: 19 }}>
      <div style={{ color: BL.sub, marginBottom: 10 }}>Scene Collection</div>
      {outliner.map((o, i) => (o.visivel ? <div key={i} style={{ padding: "5px 10px", borderRadius: 5, background: o.novo ? "#4772B355" : "transparent", display: "flex", gap: 10 }}><span style={{ color: "#E8A33D" }}>▸</span>{o.t}</div> : null))}
      <div style={{ position: "absolute", left: 0, right: 0, top: "55%", borderTop: `2px solid ${BL.borda}`, padding: 14, color: BL.sub }}>Properties</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 34, background: BL.top, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: BL.sub, gap: 20 }}>
      <span>Blender 5.3</span>{status ? <span style={{ color: status.cor ?? "#9BD17A" }}>{status.txt}</span> : null}
    </div>
  </div>
);
const Dialogo = ({ em, titulo, sub, ok, okOn, x = 600, y = 330 }) => (
  <Pop em={em} sfx="pop" style={{ position: "absolute", left: x, top: y, width: 680, borderRadius: 12, background: "#303030", border: "1px solid #555", boxShadow: "0 30px 70px rgba(0,0,0,0.6)", padding: 26, fontFamily: SANS, color: BL.txt }}>
    <div style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{titulo}</div>
    <div style={{ fontSize: 21, color: BL.sub, marginTop: 10, lineHeight: 1.4 }}>{sub}</div>
    <div style={{ display: "flex", gap: 14, marginTop: 22, justifyContent: "flex-end" }}>
      <div style={{ padding: "10px 26px", borderRadius: 8, background: "#545454", fontSize: 21 }}>Cancelar</div>
      <div style={{ padding: "10px 26px", borderRadius: 8, background: okOn ? "#2F7D32" : BL.azul, color: "#fff", fontSize: 21, fontWeight: 700 }}>{ok}</div>
    </div>
  </Pop>
);

const VideoNaTela = ({ slug, src, durS = 5, style }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", overflow: "hidden", ...style }}>
      <Loop durationInFrames={Math.round(durS * fps) - 1}><OffthreadVideo src={pasta(slug, src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Loop>
    </div>
  );
};

const LinkArrastado = ({ ini, fim, de, ate }) => {
  const f = useCurrentFrame();
  if (f < ini || f > fim + 6) return null;
  const t = interpolate(f, [ini, fim], [0, 1], clamp);
  const e = t * t * (3 - 2 * t);
  const x = de.x + (ate.x - de.x) * e, y = de.y + (ate.y - de.y) * e - Math.sin(e * Math.PI) * 80;
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "10px 22px", borderRadius: 10, background: "#fff", color: "#1a5fb4", fontFamily: SANS, fontSize: 22, fontWeight: 700, boxShadow: "0 14px 30px rgba(0,0,0,0.45)", opacity: f > fim ? 1 - (f - fim) / 6 : 0.95, transform: "rotate(-3deg)" }}>↗ Instalar complemento</div>
  );
};

export const BlenderJanela = ({ slug, d, dur, pose }) => {
  const f = useCurrentFrame();
  if (d.modo === "arrastar") {
    const repo = f >= d.permitir.em;
    const instalado = f >= d.instala.em;
    const de = { x: 70, y: 420 }, ate = { x: 1050, y: 520 };
    return (
      <>
        <FundoMarca />
        <BlenderUI x={520} y={60} w={1340} h={840} outliner={[{ t: "Camera", visivel: true }, { t: "Cube", visivel: true }, { t: "Light", visivel: true }]} status={instalado ? { txt: "✓ Complemento BlenderMCP instalado" } : repo ? { txt: "Repositório do Blender Lab adicionado", cor: "#C9C9C9" } : null}>
          <Grade />
          <div style={{ position: "absolute", left: 300, top: 260, width: 180, height: 180, background: "linear-gradient(135deg,#bbb,#777)", transform: "rotate(18deg) skewX(-8deg)", boxShadow: "0 0 0 3px #E8A33D" }} />
        </BlenderUI>
        <div style={{ position: "absolute", left: 40, top: 200, width: 520, height: 520, borderRadius: 14, background: "#fff", boxShadow: "0 30px 70px rgba(0,0,0,0.5)", overflow: "hidden", fontFamily: SANS }}>
          <div style={{ height: 50, background: "#EEE", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 19, color: "#444" }}>lab.blender.org/mcp-server</div>
          <div style={{ padding: 30 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#222" }}>Blender MCP Server</div>
            <div style={{ fontSize: 20, color: "#666", marginTop: 12, lineHeight: 1.4 }}>Arraste o link de instalação para dentro do Blender.</div>
            <div style={{ marginTop: 40, display: "inline-block", padding: "12px 24px", borderRadius: 10, border: "2px dashed #1a5fb4", color: "#1a5fb4", fontSize: 22, fontWeight: 700 }}>↗ Instalar complemento</div>
          </div>
        </div>
        <LinkArrastado ini={d.arrasta.em} fim={d.arrasta.em + 34} de={de} ate={ate} />
        <LinkArrastado ini={d.arrasta2.em} fim={d.arrasta2.em + 34} de={de} ate={ate} />
        {f >= d.pergunta.em && !repo ? <Dialogo em={d.pergunta.em} x={880} y={300} titulo="Adicionar repositório de extensões?" sub="lab.blender.org quer adicionar o repositório do Blender Lab. Permitir acesso online?" ok="Permitir" /> : null}
        {repo && f < d.permitir.em + 10 ? <Dialogo em={d.pergunta.em} x={880} y={300} titulo="Adicionar repositório de extensões?" sub="lab.blender.org quer adicionar o repositório do Blender Lab. Permitir acesso online?" ok="✓ Permitido" okOn /> : null}
        {instalado ? <Selo em={d.instala.em} x={700} y={790}>Complemento instalado</Selo> : null}
        <Cursor
          pontos={[{ f: 0, x: 900, y: 700 }, { f: d.arrasta.em - 4, x: de.x + 40, y: de.y + 20 }, { f: d.arrasta.em + 34, x: ate.x + 40, y: ate.y + 20 }, { f: d.permitir.em - 2, x: 1440, y: 455 }, { f: d.arrasta2.em - 4, x: de.x + 40, y: de.y + 20 }, { f: d.arrasta2.em + 34, x: ate.x + 40, y: ate.y + 20 }]}
          cliques={[d.arrasta.em - 2, d.permitir.em, d.arrasta2.em - 2]}
        />
        <Ilustrativa x={1580} y={1010} />
      </>
    );
  }
  if (d.modo === "preferencias") {
    const prefs = f >= d.edit.em + 18;
    const naAba = f >= d.addons.em;
    const ligado = f >= d.start.em;
    return (
      <>
        <FundoMarca />
        <BlenderUI menuAberto={f >= d.edit.em && !prefs ? "Edit" : null} outliner={[{ t: "Camera", visivel: true }, { t: "Cube", visivel: true }, { t: "Light", visivel: true }]} status={ligado ? { txt: "● MCP Server ligado: aguardando o Claude" } : null}>
          <Grade />
        </BlenderUI>
        {f >= d.edit.em && !prefs ? (
          <Pop em={d.edit.em} sfx={null} style={{ position: "absolute", left: 176, top: 82, width: 300, background: "#262626", border: "1px solid #444", borderRadius: 8, padding: 8, fontFamily: SANS, fontSize: 21, color: BL.txt }}>
            {["Undo", "Redo", "Undo History", "Preferences…"].map((t) => <div key={t} style={{ padding: "8px 12px", borderRadius: 6, background: t === "Preferences…" && f >= d.edit.em + 8 ? BL.azul : "transparent" }}>{t}</div>)}
          </Pop>
        ) : null}
        {prefs ? (
          <Pop em={d.edit.em + 18} sfx="whoosh" de={0.9} style={{ position: "absolute", left: 300, top: 120, width: 1320, height: 760, borderRadius: 12, background: "#303030", border: "1px solid #555", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", overflow: "hidden", fontFamily: SANS, color: BL.txt }}>
            <div style={{ height: 44, background: BL.top, display: "flex", alignItems: "center", padding: "0 18px", fontSize: 20 }}>Blender Preferences</div>
            <div style={{ position: "absolute", left: 0, top: 44, bottom: 0, width: 260, background: "#2A2A2A", padding: 14 }}>
              {["Interface", "Themes", "Viewport", "Lights", "Editing", "Animation", "Get Extensions", "Add-ons", "Input", "System"].map((t) => (
                <div key={t} style={{ padding: "9px 14px", borderRadius: 6, fontSize: 21, background: t === "Add-ons" && naAba ? BL.azul : "transparent", color: t === "Add-ons" && naAba ? "#fff" : BL.txt }}>{t}</div>
              ))}
            </div>
            {naAba ? (
              <div style={{ position: "absolute", left: 290, top: 74, right: 30 }}>
                <div style={{ border: "1px solid #555", borderRadius: 8, padding: "10px 16px", fontSize: 22, background: "#232323", minHeight: 52, boxSizing: "border-box", lineHeight: "30px" }}>{f >= d.procura.em ? <Digita text="mcp" em={d.procura.em} cpf={0.3} cor="#fff" /> : <span style={{ color: BL.sub }}>Search add-ons</span>}</div>
                {f >= d.procura.em + 12 ? (
                  <Pop em={d.procura.em + 12} sfx="pop" style={{ marginTop: 24, border: "1px solid #4a4a4a", borderRadius: 10, padding: 22, background: "#383838" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: BL.azul, color: "#fff", fontSize: 22, textAlign: "center", lineHeight: "28px" }}>✓</div>
                      <b style={{ color: "#fff" }}>BlenderMCP</b><span style={{ color: BL.sub, fontSize: 20 }}>Blender Lab</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 22 }}>
                      <div style={{ padding: "12px 30px", borderRadius: 8, background: ligado ? "#2F7D32" : BL.azul, color: "#fff", fontSize: 24, fontWeight: 700 }}>{ligado ? "Stop MCP Server" : "Start MCP Server"}</div>
                      {ligado ? <span style={{ fontSize: 22, color: "#9BD17A" }}>● ligado</span> : null}
                    </div>
                  </Pop>
                ) : null}
              </div>
            ) : null}
          </Pop>
        ) : null}
        <Cursor
          pontos={[{ f: 0, x: 900, y: 700 }, { f: d.edit.em - 2, x: 205, y: 62 }, { f: d.edit.em + 8, x: 300, y: 232 }, { f: d.addons.em - 2, x: 400, y: 486 }, { f: d.procura.em - 4, x: 800, y: 210 }, { f: d.start.em - 2, x: 730, y: 375 }, { f: d.start.em + 40, x: 730, y: 375 }]}
          cliques={[d.edit.em, d.edit.em + 12, d.addons.em, d.start.em]}
        />
        {f >= d.ponte.em && f < d.toda.em ? <Selo em={d.ponte.em} x={300} y={800} cor={colors.green}>Ponte Blender + Claude ligada</Selo> : null}
        {f >= d.toda.em ? <Selo em={d.toda.em} x={300} y={800} cor={colors.gold} sfx="pop">Ligue toda vez que abrir</Selo> : null}
        <Ilustrativa x={1580} y={1010} />
      </>
    );
  }
  if (d.modo === "video") {
    const r = d.revela.em;
    const mascara = interpolate(f, [r, r + 40], [0, 100], clamp);
    const itens = (d.itens ?? []).map((it, i) => ({ t: it.t, visivel: f >= it.em, novo: f >= it.em && f < it.em + 20 }));
    return (
      <>
        <FundoMarca />
        <BlenderUI outliner={[...itens]} status={f >= r ? { txt: "Claude · executando código Python…", cor: "#E8A33D" } : null}>
          <Grade />
          {f >= r ? <VideoNaTela slug={slug} src={d.video} durS={d.videoDur ?? 5} style={{ inset: 0, clipPath: `circle(${mascara * 0.75}% at 50% 55%)` }} /> : null}
          {(d.itens ?? []).map((it, i) => (f >= it.em && f < it.em + 26 ? <Pop key={i} em={it.em} sfx="pop" style={{ position: "absolute", left: 40, top: 30 + (i % 4) * 0, padding: "8px 18px", borderRadius: 8, background: "#000000aa", color: "#fff", fontFamily: MONO, fontSize: 24 }}>{`+ ${it.t}`}</Pop> : null))}
        </BlenderUI>
        {d.ok && f >= d.ok.em ? <Selo em={d.ok.em} x={140} y={790}>{d.ok.txt}</Selo> : null}
        <div style={{ position: "absolute", left: 1330, top: 1000, ...FONT, textTransform: "none", fontSize: 28, color: "#9AA4B2" }}>cena 3D real, renderizada no Blender</div>
      </>
    );
  }
  // modo "render"
  const menu = f >= d.menu.em && f < d.anim.em + 10;
  const janela = f >= d.anim.em + 10;
  const quadro = Math.min(150, Math.max(1, Math.floor(interpolate(f, [d.anim.em + 10, d.fim.em], [1, 150], clamp))));
  return (
    <>
      <FundoMarca />
      <BlenderUI menuAberto={menu ? "Render" : null} outliner={[{ t: "Ilha", visivel: true }, { t: "Árvores", visivel: true }, { t: "Casinha", visivel: true }, { t: "Câmera", visivel: true }]} status={janela ? { txt: `Renderizando: quadro ${quadro} de 150` , cor: "#E8A33D" } : { txt: "Saída: vídeo MP4 (configurado pelo Claude)" }}>
        <Grade />
        <VideoNaTela slug={slug} src={d.video} durS={d.videoDur ?? 5} style={{ inset: 0, opacity: 0.85 }} />
      </BlenderUI>
      {menu ? (
        <Pop em={d.menu.em} sfx={null} style={{ position: "absolute", left: 238, top: 82, width: 380, background: "#262626", border: "1px solid #444", borderRadius: 8, padding: 8, fontFamily: SANS, fontSize: 22, color: BL.txt }}>
          {[["Render Image", "F12"], ["Render Animation", "Ctrl F12"], ["View Render", "F11"]].map(([t, k]) => <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderRadius: 6, background: t === "Render Animation" && f >= d.anim.em - 6 ? BL.azul : "transparent" }}><span>{t}</span><span style={{ color: BL.sub }}>{k}</span></div>)}
        </Pop>
      ) : null}
      {janela ? (
        <Pop em={d.anim.em + 10} sfx="whoosh" de={0.9} style={{ position: "absolute", left: 560, top: 170, width: 900, height: 560, borderRadius: 10, background: "#1a1a1a", border: "1px solid #555", boxShadow: "0 30px 80px rgba(0,0,0,0.65)", overflow: "hidden" }}>
          <div style={{ height: 38, background: BL.top, color: BL.txt, fontFamily: SANS, fontSize: 19, display: "flex", alignItems: "center", padding: "0 14px" }}>{`Blender Render · Frame ${quadro}`}</div>
          <VideoNaTela slug={slug} src={d.video} durS={d.videoDur ?? 5} style={{ left: 0, top: 38, right: 0, bottom: 0 }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${(quadro / 150) * 100}%`, background: "#E8A33D" }} />
        </Pop>
      ) : null}
      <Cursor pontos={[{ f: 0, x: 900, y: 700 }, { f: d.menu.em - 2, x: 270, y: 62 }, { f: d.anim.em - 4, x: 360, y: 150 }, { f: d.anim.em + 30, x: 360, y: 150 }]} cliques={[d.menu.em, d.anim.em]} />
      {f >= d.fim.em ? <Selo em={d.fim.em} x={600} y={760}>Vídeo pronto para postar</Selo> : null}
      <Ilustrativa x={1580} y={1010} />
    </>
  );
};

// ---------- instalar nos 3 sistemas (sem terminal) ----------
const ArquivoBaixando = ({ em, entra = em, nome, x, y, so }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - em, [0, 40], [0, 1], clamp);
  return (
    <Pop em={entra} sfx="whoosh" style={{ position: "absolute", left: x, top: y, width: 470, borderRadius: 20, background: "#fff", padding: "24px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", fontFamily: SANS }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#222" }}>{so}</div>
      <div style={{ fontSize: 21, color: "#555", marginTop: 6 }}>{nome}</div>
      <div style={{ marginTop: 14, height: 12, borderRadius: 6, background: "#e0e0e0", overflow: "hidden" }}><div style={{ width: `${p * 100}%`, height: "100%", background: p >= 1 ? "#1e8e3e" : "#1a73e8" }} /></div>
      <div style={{ fontSize: 19, color: "#5f6368", marginTop: 8 }}>{p >= 1 ? "✓ Download concluído" : `Baixando… ${Math.round(p * 100)}%`}</div>
    </Pop>
  );
};

export const InstaladorSistemas = ({ d, pose }) => {
  const f = useCurrentFrame();
  const nome = d.nome ?? "Blender";
  const fase = f >= d.linux.em ? "linux" : f >= d.mac.em ? "mac" : f >= d.win.em ? "win" : "baixa";
  const rot = { baixa: "Baixe no site oficial", win: "Windows", mac: "Mac", linux: "Linux" }[fase];
  return (
    <>
      <FundoMarca />
      <Faiscas169 n={8} />
      <Pop em={2} sfx={null} style={{ position: "absolute", left: 80, top: 40 }}>
        <div style={{ ...FONT, textTransform: "none", fontSize: 60, color: colors.gold }}>{`Passo 1: ${nome}`}<span style={{ color: "#fff", fontSize: 44 }}>{`  ·  ${rot}`}</span></div>
      </Pop>
      {fase === "baixa" ? (
        <>
          <div style={{ position: "absolute", left: 500, top: 190, ...FONT, textTransform: "none", fontSize: 40, color: "#fff" }}>blender.org/download</div>
          <ArquivoBaixando em={d.baixa.em} entra={8 + 0} so="Windows" nome="blender-5.3.0-windows-x64.msi" x={130} y={330} />
          <ArquivoBaixando em={d.baixa.em + 6} entra={8 + 8} so="Mac" nome="blender-5.3.0-macos-arm64.dmg" x={720} y={330} />
          <ArquivoBaixando em={d.baixa.em + 12} entra={8 + 16} so="Linux" nome="loja de aplicativos" x={1310} y={330} />
        </>
      ) : null}
      {fase === "win" ? (() => {
        const p = interpolate(f, [d.win.em + 20, d.winFim.em], [0, 1], clamp);
        const pronto = p >= 1;
        return (
          <>
            <Pop em={d.win.em} sfx="whoosh" style={{ position: "absolute", left: 460, top: 180, width: 1000, height: 600, borderRadius: 14, background: "#f3f3f3", boxShadow: "0 40px 100px rgba(0,0,0,0.55)", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
              <div style={{ height: 52, background: "#fff", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 24, color: "#222", borderBottom: "1px solid #ddd" }}>{`${nome} Setup`}</div>
              <div style={{ padding: "50px 60px", display: "flex", gap: 40, alignItems: "center" }}>
                <Icone3D size={170} />
                <div>
                  <div style={{ fontSize: 44, fontWeight: 700, color: "#111" }}>{pronto ? "Instalação concluída" : p > 0 ? "Instalando…" : `Instalar o ${nome}`}</div>
                  <div style={{ fontSize: 28, color: "#555", marginTop: 14 }}>{pronto ? "Pronto para usar." : "Clique em Next até o final."}</div>
                </div>
              </div>
              <div style={{ margin: "0 60px", height: 22, borderRadius: 11, background: "#d9d9d9", overflow: "hidden" }}><div style={{ width: `${p * 100}%`, height: "100%", background: "#0067c0" }} /></div>
              <div style={{ position: "absolute", right: 50, bottom: 40, padding: "16px 54px", borderRadius: 8, background: "#0067c0", color: "#fff", fontSize: 32, fontWeight: 700 }}>{pronto ? "Finish" : "Next"}</div>
            </Pop>
            <Cursor pontos={[{ f: d.win.em, x: 1500, y: 400 }, { f: d.win.em + 14, x: 1340, y: 735 }, { f: d.winFim.em + 20, x: 1340, y: 735 }]} cliques={[d.win.em + 16, d.win.em + 30, d.winFim.em]} />
            {pronto ? <Selo em={d.winFim.em} x={470} y={830}>Instalado no Windows</Selo> : null}
          </>
        );
      })() : null}
      {fase === "mac" ? (() => {
        const t = interpolate(f, [d.macArrasta.em, d.macArrasta.em + 36], [0, 1], clamp);
        const e = t * t * (3 - 2 * t);
        const copiou = t >= 1;
        return (
          <>
            <Pop em={d.mac.em} sfx="whoosh" style={{ position: "absolute", left: 360, top: 180, width: 1200, height: 560, borderRadius: 22, background: "rgba(246,246,246,0.97)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
              <div style={{ height: 56, background: "#e8e8e8", display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />)}
                <div style={{ flex: 1, textAlign: "center", fontSize: 24, color: "#444", marginRight: 70 }}>{nome}</div>
              </div>
              <div style={{ position: "absolute", left: 640, top: 250, fontFamily: MONO, fontSize: 90, color: "#999" }}>→</div>
              <div style={{ position: "absolute", left: 830, top: 170, width: 230, textAlign: "center" }}>
                <div style={{ width: 190, height: 150, margin: "0 auto", borderRadius: 18, background: "linear-gradient(180deg, #5fb4ff, #2f86e0)" }} />
                <div style={{ fontSize: 30, color: "#222", marginTop: 14 }}>Aplicativos</div>
              </div>
            </Pop>
            {!copiou ? <div style={{ position: "absolute", left: 620 + e * 570, top: 380, textAlign: "center" }}><Icone3D size={160} /><div style={{ fontFamily: "Arial, sans-serif", fontSize: 30, color: "#222" }}>{nome}</div></div> : null}
            <Cursor pontos={[{ f: d.mac.em, x: 1500, y: 300 }, { f: d.macArrasta.em - 2, x: 720, y: 450 }, { f: d.macArrasta.em + 36, x: 1290, y: 450 }, { f: d.macArrasta.em + 60, x: 1290, y: 450 }]} cliques={[d.macArrasta.em - 2]} />
            {copiou ? <Selo em={d.macArrasta.em + 36} x={1000} y={780}>Copiado para Aplicativos</Selo> : null}
          </>
        );
      })() : null}
      {fase === "linux" ? (() => {
        const inst = f >= d.linuxInstala.em;
        const p = interpolate(f, [d.linuxInstala.em, d.linuxInstala.em + 40], [0, 1], clamp);
        return (
          <>
            <Pop em={d.linux.em} sfx="whoosh" style={{ position: "absolute", left: 300, top: 170, width: 1320, height: 640, borderRadius: 16, background: "#FAFAFA", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", overflow: "hidden", fontFamily: SANS }}>
              <div style={{ height: 60, background: "#EBEBEB", display: "flex", alignItems: "center", padding: "0 24px", fontSize: 24, color: "#333", fontWeight: 700 }}>Loja de aplicativos</div>
              <div style={{ margin: "30px 40px", border: "2px solid #ccc", borderRadius: 12, padding: "14px 20px", fontSize: 28, minHeight: 66, boxSizing: "border-box", lineHeight: "36px", color: "#222" }}>{f >= d.linuxBusca.em ? <Digita text={nome} em={d.linuxBusca.em} cpf={0.35} cor="#222" /> : <span style={{ color: "#999" }}>Pesquisar</span>}</div>
              {f >= d.linuxBusca.em + 16 ? (
                <Pop em={d.linuxBusca.em + 16} sfx="pop" style={{ margin: "0 40px", border: "1px solid #ddd", borderRadius: 16, padding: 28, display: "flex", alignItems: "center", gap: 28, background: "#fff" }}>
                  <Icone3D size={110} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "#222" }}>{nome}</div>
                    <div style={{ fontSize: 22, color: "#666", marginTop: 6 }}>Criação 3D gratuita e de código aberto</div>
                    {inst ? <div style={{ marginTop: 16, height: 12, borderRadius: 6, background: "#e0e0e0", overflow: "hidden", width: 500 }}><div style={{ width: `${p * 100}%`, height: "100%", background: p >= 1 ? "#1e8e3e" : "#3584e4" }} /></div> : null}
                  </div>
                  <div style={{ padding: "14px 38px", borderRadius: 10, background: p >= 1 ? "#1e8e3e" : "#3584e4", color: "#fff", fontSize: 26, fontWeight: 700 }}>{p >= 1 ? "✓ Instalado" : inst ? "Instalando…" : "Instalar"}</div>
                </Pop>
              ) : null}
            </Pop>
            <Cursor pontos={[{ f: d.linux.em, x: 1500, y: 800 }, { f: d.linuxBusca.em - 4, x: 700, y: 290 }, { f: d.linuxInstala.em - 2, x: 1480, y: 440 }, { f: d.linuxInstala.em + 40, x: 1480, y: 440 }]} cliques={[d.linuxBusca.em - 2, d.linuxInstala.em]} />
            {p >= 1 ? <Selo em={d.linuxInstala.em + 40} x={320} y={830}>Instalado no Linux, sem terminal</Selo> : null}
          </>
        );
      })() : null}
      <Ilustrativa x={1580} y={1010} />
    </>
  );
};
