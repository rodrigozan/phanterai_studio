// Cenas genéricas, guiadas só pelo `dados` do roteiro.json (texto, itens e comandos vêm do roteiro, nada
// preso a um episódio). Criadas no vídeo "Crie vídeos com o Claude Code + Remotion" (20/11/2026).
//   gancho-video          l1, l2, pilulas[{ ao, txt, cor }], bg, esc (escurecimento do fundo, padrão 0.5)
//   cartoes               titulo, itens[{ ao, t, sub, icone, cor }], cols 1|2, w, numerar, check, mono, pilula{ ao, txt, cor, sfx }, bg
//   fluxo                 titulo, etapas[{ ao, t, sub }] (setas com pulso entre as etapas)
//   navegador-print       url, digitar{ao}, telas[{ ao, arq }], destaque{ ao, x, y, w, h }, cliques[{ ao, x, y, chip }], zoom{ z, vx, vy }
//   instalador-assistente nome, titulo, sub, b{ao} (Next), c{ao} (fim), selo
//   terminal              titulo, rotulo, linhas[{ t, text, ao, cpf }], selo{ ao, txt }, size, h
//   claude-pedido         pedido, a{ao}, acoes[{ ao, txt }], perm{ ao, pergunta }, ok{ ao, txt }
//   studio-preview        titulo{ao}, frases[{ ao, txt }], botao{ao}, fim{ao}  (Remotion Studio com a prévia tocando)
// Coordenadas de print (x, y) são do PNG de 1600x900 tirado com o Playwright.
import { AbsoluteFill, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import {
  CIANO, LARANJA, FONT, MONO, W, clamp, pasta, FundoMarca, Fundo, Faiscas169, Pop, Desliza, Glitch, Cartao, Pant, Texto, Term, Sfx, Cursor, Digita,
  Navegador, ClaudeTela,
} from "./base";

const COR = { verde: colors.green, violeta: colors.violetLight, roxo: colors.violet, ouro: colors.gold, ciano: CIANO, laranja: LARANJA, vermelho: colors.red, branco: "#fff", escuro: "#0D1117" };
const cor = (c, padrao = colors.violetLight) => COR[c] ?? c ?? padrao;
const CICLO = [CIANO, colors.green, colors.violetLight, colors.gold];

const Linha = ({ children, y, style = {} }) => <div style={{ position: "absolute", left: 0, top: y, width: W, display: "flex", justifyContent: "center", ...style }}>{children}</div>;
const Pilula = ({ children, fundo = colors.gold, size = 54, rot = 0, style = {} }) => {
  const claro = [colors.gold, colors.green, "#fff", CIANO].includes(fundo);
  return (
    <div style={{ ...FONT, textTransform: "none", fontSize: size, color: claro ? "#140B2E" : "#fff", background: fundo, padding: "10px 40px", borderRadius: 60, transform: `rotate(${rot}deg)`, boxShadow: "0 12px 40px rgba(0,0,0,0.45)", border: fundo === "#0D1117" ? `3px solid ${CIANO}` : "none", ...style }}>{children}</div>
  );
};
const Fundo2 = ({ slug, d, esc = 0.72 }) => (d.bg ? <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={esc} /> : <FundoMarca />);

// ---------- gancho ----------
export const GanchoVideo = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={d.esc ?? 0.5} />
    <Faiscas169 n={22} />
    <Linha y={60}><Glitch size={170}>{d.l1}</Glitch></Linha>
    <Texto em={14} y={260} size={112} color="#140B2E" fundo={colors.gold} rot={-2} lado={200}>{d.l2}</Texto>
    {d.pilulas.map((p, i) => (
      <Pop key={i} em={p.em} sfx={i === 0 ? "coin" : "pop"} style={{ position: "absolute", left: 140 + (i % 2) * 90, top: 480 + i * 125 }}>
        <Pilula fundo={cor(p.cor)} size={i === 0 ? 70 : 54} rot={i % 2 ? 1.5 : -2}>{p.txt}</Pilula>
      </Pop>
    ))}
    <Pant pose={pose ?? "surpresa"} x={1640} y={690} w={470} em={8} />
    <Sfx name="riser" atFrame={4} />
  </>
);

// ---------- cartões (lista ou grade) ----------
export const Cartoes = ({ slug, d, pose }) => {
  const cols = d.cols ?? 1;
  const n = d.itens.length;
  const w = d.w ?? (cols === 1 ? 1300 : 700);
  const h = cols === 1 ? (n >= 4 ? 136 : 150) : 160;
  const gap = cols === 1 ? (n >= 4 ? 18 : 26) : 28;
  const size = cols === 1 ? (n >= 4 ? 52 : 56) : 50;
  const linhas = Math.ceil(n / cols);
  const fimItens = 200 + linhas * (h + gap);
  return (
    <>
      <Fundo2 slug={slug} d={d} />
      <Faiscas169 n={10} />
      <Linha y={36}><Texto em={2} y={0} size={86} rot={-1} fundo={d.bg ? undefined : colors.violet}>{d.titulo}</Texto></Linha>
      <div style={{ position: "absolute", left: 120, top: 200, display: "grid", gridTemplateColumns: `repeat(${cols}, ${w}px)`, gap }}>
        {d.itens.map((it, i) => (
          <Desliza key={i} em={it.em} de={cols === 1 ? "esq" : i % 2 ? "dir" : "esq"}>
            <Cartao
              em={it.em}
              titulo={d.mono ? <span style={{ fontFamily: MONO, fontWeight: 700 }}>{it.t}</span> : it.t}
              sub={it.sub}
              cor={cor(it.cor, CICLO[i % 4])}
              icone={d.numerar ? String(i + 1) : d.check ? "✓" : it.icone}
              w={w}
              h={it.sub ? h : h - 30}
              size={size}
              sfx={d.check ? "ding" : "pop"}
            />
          </Desliza>
        ))}
      </div>
      {d.pilula ? (
        <Pop em={d.pilula.em} sfx={d.pilula.sfx ?? "pop"} style={{ position: "absolute", left: 120, top: Math.min(800, fimItens + 14) }}>
          <Pilula fundo={cor(d.pilula.cor, colors.gold)} size={54} rot={-1.5}>{d.pilula.txt}</Pilula>
        </Pop>
      ) : null}
      <Pant pose={pose ?? "feliz"} x={1700} y={760} w={380} em={10} />
    </>
  );
};

// ---------- fluxo em etapas ----------
export const Fluxo = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const n = d.etapas.length;
  const bw = 360, gap = 90, x0 = (W - (n * bw + (n - 1) * gap)) / 2;
  return (
    <>
      <Fundo2 slug={slug} d={d} />
      <Faiscas169 n={12} />
      <Linha y={50}><Texto em={2} y={0} size={90} rot={-1} fundo={colors.violet}>{d.titulo}</Texto></Linha>
      {d.etapas.map((e, i) => {
        const c = CICLO[i % 4];
        const x = x0 + i * (bw + gap);
        const prox = d.etapas[i + 1];
        const pulso = prox && frame >= prox.em - 12 ? ((frame - prox.em + 12) / 18) % 1 : null;
        return (
          <div key={i}>
            <Pop em={e.em} sfx={i === n - 1 ? "ding" : "pop"} style={{ position: "absolute", left: x, top: 300, width: bw, height: 330, borderRadius: 40, background: `linear-gradient(160deg, ${c}40, #140B2Eee)`, border: `5px solid ${c}`, boxShadow: `0 0 60px ${c}55`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 20 }}>
              <div style={{ ...FONT, fontSize: 90, color: c }}>{i + 1}</div>
              <div style={{ ...FONT, textTransform: "none", fontSize: 54, color: "#fff", textAlign: "center", lineHeight: 1.05 }}>{e.t}</div>
              <div style={{ ...FONT, textTransform: "none", fontSize: 32, color: c, textAlign: "center" }}>{e.sub}</div>
            </Pop>
            {prox && frame >= prox.em - 12 ? (
              <div style={{ position: "absolute", left: x + bw + 8, top: 455, width: gap - 16, height: 16, borderRadius: 8, background: "#ffffff33" }}>
                <div style={{ position: "absolute", left: `${pulso * 80}%`, top: -8, width: 30, height: 32, borderRadius: 16, background: colors.gold, boxShadow: `0 0 20px ${colors.gold}` }} />
              </div>
            ) : null}
          </div>
        );
      })}
      <Pant pose={pose ?? "pensando"} x={1700} y={720} w={330} em={10} />
    </>
  );
};

// ---------- navegador com print real ----------
const NAV = { x: 150, y: 50, w: 1620, h: 820 };
const K = NAV.w / 1600;
const ChipDownload = ({ nome, em }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - em, [0, 45], [0, 1], clamp);
  return (
    <Pop em={em} sfx="whoosh" style={{ position: "absolute", left: 1180, top: 140, width: 560, borderRadius: 18, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", padding: "20px 26px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ fontSize: 26, color: "#202124", fontWeight: 700 }}>{p >= 1 ? "✓ " : ""}{nome}</div>
      <div style={{ marginTop: 12, height: 12, borderRadius: 6, background: "#e0e0e0", overflow: "hidden" }}><div style={{ width: `${p * 100}%`, height: "100%", background: p >= 1 ? "#1e8e3e" : "#1a73e8" }} /></div>
      <div style={{ marginTop: 8, fontSize: 22, color: "#5f6368" }}>{p >= 1 ? "Download concluído" : `Baixando… ${Math.round(p * 100)}%`}</div>
      {p >= 1 ? <Sfx name="ding" atFrame={em + 45} /> : null}
    </Pop>
  );
};

export const NavegadorPrint = ({ slug, d, dur }) => {
  const frame = useCurrentFrame();
  const z0 = d.zoom ?? { z: 1, vx: 0, vy: 0 };
  const cliques = d.cliques ?? [];
  // antes do 1º clique, a câmera desce até o botão (y do clique fica a 65% da janela)
  const vista = 744 / (z0.z * K);
  const vyClique = cliques.length ? Math.max(z0.vy, Math.min(900 - vista, cliques[0].y - vista * 0.65)) : z0.vy;
  const tPan = cliques.length ? cliques[0].em - 40 : 1e9;
  const vy = interpolate(frame, [tPan, tPan + 22], [z0.vy, vyClique], clamp);
  const z = { ...z0, vy };
  const naTela = (sx, sy, vyFinal = vy) => ({ x: NAV.x + (sx - z.vx) * z.z * K, y: NAV.y + 76 + (sy - vyFinal) * z.z * K });
  const carregou = frame >= (d.digitar?.em ?? 0) + 40;
  const tela = [...(d.telas ?? [])].reverse().find((t) => frame >= (t.em ?? 0)) ?? d.telas?.[0];
  const kb = interpolate(frame, [0, dur], [1, 1.04], clamp);
  const pontos = [{ f: 0, x: 1500, y: 700 }];
  if (d.destaque) { const p = naTela(d.destaque.x + d.destaque.w / 2, d.destaque.y + d.destaque.h, z0.vy); pontos.push({ f: d.destaque.em, x: p.x, y: p.y }); }
  cliques.forEach((c) => { const p = naTela(c.x, c.y, vyClique); pontos.push({ f: c.em - 8, x: p.x + 10, y: p.y + 4 }, { f: c.em, x: p.x, y: p.y }, { f: c.em + 30, x: p.x, y: p.y }); });
  pontos.sort((a, b) => a.f - b.f);
  const hl = d.destaque && frame >= d.destaque.em ? naTela(d.destaque.x, d.destaque.y) : null;
  return (
    <>
      <FundoMarca />
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>
        <Navegador x={NAV.x} y={NAV.y} w={NAV.w} h={NAV.h} url={<Digita text={d.url} em={d.digitar?.em ?? 0} cpf={0.55} cor="#202124" />} em={0}>
          {carregou && tela ? (
            <Img src={pasta(slug, `prints/${tela.arq}`)} style={{ position: "absolute", left: -z.vx * z.z * K, top: -z.vy * z.z * K, width: 1600 * z.z * K, opacity: interpolate(frame - (d.digitar?.em ?? 0) - 40, [0, 12], [0, 1], clamp) }} />
          ) : null}
        </Navegador>
        {hl ? (
          <div style={{ position: "absolute", left: hl.x - 10, top: hl.y - 10, width: d.destaque.w * z.z * K + 20, height: d.destaque.h * z.z * K + 20, borderRadius: 14, border: `6px solid ${colors.gold}`, boxShadow: `0 0 30px ${colors.gold}`, opacity: interpolate(frame - d.destaque.em, [0, 6], [0, 1], clamp) }} />
        ) : null}
        {cliques.length ? <Cursor pontos={pontos} cliques={cliques.map((c) => c.em)} /> : null}
        {cliques.map((c, i) => {
          const fim = cliques[i + 1]?.em ?? dur;
          return c.chip ? <Sequence key={i} from={c.em + 4} durationInFrames={Math.max(10, fim - c.em - 4)} layout="none"><ChipDownload em={0} nome={c.chip} /></Sequence> : null;
        })}
      </AbsoluteFill>
      {d.selo ? <Pop em={4} sfx={null} style={{ position: "absolute", left: 60, top: 880 }}><Pilula fundo={colors.violet} size={38}>{d.selo}</Pilula></Pop> : null}
    </>
  );
};

// ---------- instalador (assistente Next → Install → Finish) ----------
export const InstaladorAssistente = ({ d, pose }) => {
  const frame = useCurrentFrame();
  const ini = d.b.em + 14;
  const p = interpolate(frame, [ini, ini + 75], [0, 1], clamp);
  const pronto = p >= 1;
  const btn = { x: 1270, y: 690 };
  const etapa = pronto ? "Finish" : frame >= ini ? "Install" : "Next";
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(135deg, #0a3d91 0%, #1c7ed6 55%, #74c0fc 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "rgba(20,24,38,0.92)" }} />
      <Pop em={4} sfx="whoosh" style={{ position: "absolute", left: 460, top: 150, width: 1000, height: 600, borderRadius: 14, background: "#f3f3f3", boxShadow: "0 40px 100px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        <div style={{ height: 52, background: "#fff", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: "Arial, sans-serif", fontSize: 24, color: "#222", borderBottom: "1px solid #ddd" }}>{d.nome}</div>
        <div style={{ padding: "50px 60px", display: "flex", gap: 40, alignItems: "center" }}>
          <svg width="170" height="190" viewBox="0 0 24 27"><path d="M12 0.8 23 7.2v12.6L12 26.2 1 19.8V7.2z" fill="#5FA04E" /><text x="12" y="16.8" textAnchor="middle" fontSize="7.4" fontFamily="Arial" fontWeight="700" fill="#fff">JS</text></svg>
          <div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 44, fontWeight: 700, color: "#111" }}>{pronto ? "Instalação concluída" : frame >= ini ? "Instalando…" : d.titulo}</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 28, color: "#555", marginTop: 14, maxWidth: 600 }}>{pronto ? "Pronto para usar." : d.sub}</div>
          </div>
        </div>
        <div style={{ margin: "0 60px", height: 22, borderRadius: 11, background: "#d9d9d9", overflow: "hidden", opacity: frame >= ini ? 1 : 0 }}><div style={{ width: `${p * 100}%`, height: "100%", background: "#0067c0" }} /></div>
        <div style={{ position: "absolute", right: 50, bottom: 40, padding: "16px 54px", borderRadius: 8, background: frame >= ini && !pronto ? "#b8b8b8" : "#0067c0", color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 32, fontWeight: 700 }}>{etapa}</div>
      </Pop>
      <Cursor pontos={[{ f: 10, x: 1500, y: 300 }, { f: d.b.em - 10, x: btn.x + 30, y: btn.y + 6 }, { f: d.b.em, x: btn.x + 40, y: btn.y + 14 }, { f: ini + 80, x: btn.x + 50, y: btn.y + 14 }]} cliques={[d.b.em, d.b.em + 10]} />
      {pronto ? <Pop em={ini + 76} sfx="ding" style={{ position: "absolute", left: 470, top: 790 }}><Pilula fundo={colors.green} size={44}>{d.selo}</Pilula></Pop> : null}
      <Pant pose={pose ?? "comemorando"} x={120} y={760} w={300} em={d.c.em} />
    </>
  );
};

// ---------- terminal genérico ----------
export const Terminal = ({ slug, d, pose }) => {
  const linhas = d.linhas.map(({ ao, ...l }) => l);
  const temSelo = !!d.selo;
  return (
    <>
      <Fundo2 slug={slug} d={d} />
      <Faiscas169 n={8} />
      {d.rotulo ? <Desliza em={2} de="cima" style={{ position: "absolute", left: 120, top: 40, ...FONT, fontSize: 52, color: colors.gold }}>{d.rotulo}</Desliza> : null}
      <div style={{ position: "absolute", left: 120, top: d.rotulo ? 130 : 90 }}>
        <Term titulo={d.titulo ?? "Terminal"} w={1460} h={d.h ?? (temSelo ? 560 : 660)} size={d.size ?? 36} linhas={linhas} />
      </div>
      {temSelo ? <Pop em={d.selo.em} sfx="ding" style={{ position: "absolute", left: 120, top: (d.rotulo ? 130 : 90) + (d.h ?? 560) + 30 }}><Pilula fundo={colors.green} size={46}>{d.selo.txt}</Pilula></Pop> : null}
      <Pant pose={pose ?? "feliz"} x={1700} y={760} w={330} em={10} />
    </>
  );
};

// ---------- pedido no Claude Code ----------
export const ClaudePedido = ({ d, pose }) => {
  const frame = useCurrentFrame();
  const sel = d.ok && frame >= d.ok.em;
  const fimDigita = d.a.em + Math.ceil(d.pedido.length / 0.9);
  return (
    <>
      <FundoMarca />
      <div style={{ position: "absolute", left: 110, top: 60 }}>
        <ClaudeTela w={1700} h={830} size={32} modelo="Claude · plano Pro" pasta="~/meu-video">
          <div style={{ border: "2px solid #ffffff33", borderRadius: 12, padding: "14px 20px", lineHeight: 1.35 }}><span style={{ color: LARANJA }}>&gt; </span><Digita text={d.pedido} em={d.a.em} cpf={0.9} /></div>
          {frame >= fimDigita + 6 && frame < (d.acoes?.[0]?.em ?? 1e9) ? <div style={{ marginTop: 18, color: "#9AA4B2" }}>{"✻ Pensando" + ".".repeat(1 + (Math.floor(frame / 8) % 3))}</div> : null}
          {(d.acoes ?? []).map((a, i) => (frame >= a.em ? <Pop key={i} em={a.em} sfx={null} style={{ marginTop: 18, color: "#E6EDF3" }}>{a.txt}</Pop> : null))}
          {d.perm && frame >= d.perm.em ? (
            <Pop em={d.perm.em} sfx="pop" style={{ marginTop: 22, border: `2px solid ${colors.gold}`, borderRadius: 14, padding: "16px 26px" }}>
              <div style={{ color: colors.gold, fontWeight: 700 }}>{d.perm.pergunta}</div>
              <div style={{ marginTop: 8, color: sel ? colors.green : "#fff", fontWeight: sel ? 700 : 500 }}>{sel ? "❯ 1. Yes" : "  1. Yes"}</div>
              <div style={{ color: "#9AA4B2" }}>{"  "}2. Yes, allow all edits this session</div>
              <div style={{ color: "#9AA4B2" }}>{"  "}3. No</div>
            </Pop>
          ) : null}
          {sel ? <Sfx name="ding" atFrame={d.ok.em} /> : null}
          {sel ? <Pop em={d.ok.em + 8} sfx={null} style={{ marginTop: 18, color: colors.green }}>{d.ok.txt}</Pop> : null}
        </ClaudeTela>
      </div>
      <div style={{ position: "absolute", left: 1500, top: 900, ...FONT, textTransform: "none", fontSize: 28, color: "#9AA4B2" }}>tela ilustrativa</div>
      <Pant pose={pose ?? "apontando"} x={1760} y={800} w={260} em={d.perm?.em ?? d.ok?.em ?? 10} />
    </>
  );
};

// ---------- Remotion Studio com a prévia tocando ----------
const PreviaVideo = ({ d, base }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sT = spring({ frame: frame - d.titulo.em, fps, config: { damping: 10, mass: 0.6 } });
  const sB = spring({ frame: frame - d.botao.em, fps, config: { damping: 7, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${50 + 20 * Math.sin(frame / 40)}% 30%, #8B5CF6, #140B2E 70%)`, overflow: "hidden" }}>
      {frame >= d.titulo.em ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...FONT, fontSize: 92, color: "#fff", transform: `scale(${sT}) rotate(${(1 - sT) * -8}deg)` }}>Aprenda YouTube</div>
      ) : null}
      {d.frases.map((f, i) => {
        const t = interpolate(frame - f.em, [0, 10], [0, 1], clamp);
        return frame >= f.em ? (
          <div key={i} style={{ position: "absolute", left: 120, top: 220 + i * 78, opacity: t, transform: `translateX(${(1 - t) * -80}px)`, ...FONT, textTransform: "none", fontSize: 50, color: CICLO[i % 4] }}>{"▸ " + f.txt}</div>
        ) : null;
      })}
      {frame >= d.botao.em ? (
        <div style={{ position: "absolute", right: 90, bottom: 60, padding: "16px 44px", borderRadius: 40, background: "#FF0000", ...FONT, textTransform: "none", fontSize: 46, color: "#fff", transform: `scale(${sB})`, boxShadow: "0 0 40px #FF000099" }}>Inscreva-se</div>
      ) : null}
      {frame >= d.botao.em ? <Sfx name="ding" atFrame={d.botao.em} /> : null}
      <div style={{ position: "absolute", left: 16, top: 12, fontFamily: MONO, fontSize: 20, color: "#ffffffaa" }}>{base}</div>
    </div>
  );
};

export const StudioPreview = ({ d, dur }) => {
  const frame = useCurrentFrame();
  const play = Math.min(1, frame / Math.max(1, dur - 10));
  const seg = (s) => `00:${String(Math.floor(s)).padStart(2, "0")}.${String(Math.floor((s % 1) * 30)).padStart(2, "0")}`;
  return (
    <>
      <FundoMarca />
      <Navegador x={90} y={40} w={1740} h={860} url="localhost:3000" em={0}>
        <div style={{ position: "absolute", inset: 0, background: "#1f1f1f", display: "flex" }}>
          <div style={{ width: 300, background: "#262626", borderRight: "1px solid #333", padding: 20, fontFamily: MONO, fontSize: 22, color: "#bbb" }}>
            <div style={{ color: "#888", marginBottom: 14 }}>Compositions</div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "#0b84f3", color: "#fff" }}>Apresentacao</div>
            <div style={{ padding: "8px 12px", color: "#888" }}>MyComp</div>
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ position: "absolute", left: 170, top: 30, width: 1040, height: 585, borderRadius: 6, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
              <PreviaVideo d={d} base="1920×1080 · 30 fps" />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "#181818", borderTop: "1px solid #333", padding: "16px 30px", fontFamily: MONO, color: "#ccc", fontSize: 22 }}>
              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <span style={{ color: "#fff", fontSize: 28 }}>▶</span><span>{seg(play * 15)} / 00:15.00</span>
              </div>
              <div style={{ marginTop: 18, height: 10, borderRadius: 5, background: "#333", position: "relative" }}>
                <div style={{ width: `${play * 100}%`, height: "100%", borderRadius: 5, background: "#0b84f3" }} />
                <div style={{ position: "absolute", left: `${play * 100}%`, top: -10, width: 4, height: 30, background: "#fff" }} />
              </div>
            </div>
          </div>
        </div>
      </Navegador>
      <div style={{ position: "absolute", left: 1560, top: 905, ...FONT, textTransform: "none", fontSize: 28, color: "#9AA4B2" }}>prévia ilustrativa</div>
    </>
  );
};

// ---------- CTA final de uma ação só: assistir o próximo vídeo (regra 7 do Rod, 23/11) ----------
//   cta-proximo  titulo, bg, seta{ao} (moldura do próximo vídeo pisca), clique{ao} (cursor clica na moldura)
export const CtaProximo = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const emS = d.seta?.em ?? 10;
  const emC = d.clique?.em ?? emS + 40;
  const s = spring({ frame: frame - emS, fps, config: { damping: 9, mass: 0.6 } });
  const pulso = frame >= emS ? 1 + 0.03 * Math.sin((frame - emS) / 4) : 1;
  const apertou = frame >= emC;
  return (
    <>
      <Fundo2 slug={slug} d={d} esc={0.7} />
      <Faiscas169 n={apertou ? 30 : 12} />
      <Linha y={60}><Texto em={2} y={0} size={92} rot={-1}>{d.titulo ?? "Próximo vídeo"}</Texto></Linha>
      <div style={{ position: "absolute", left: 150, top: 250, width: 1060, height: 596, borderRadius: 28, border: `8px solid ${apertou ? colors.gold : "#fff"}`, background: "rgba(13,17,23,0.72)", transform: `scale(${(0.85 + 0.15 * s) * pulso})`, opacity: interpolate(frame - emS, [0, 8], [0, 1], clamp), boxShadow: `0 0 ${apertou ? 70 : 30}px ${apertou ? colors.gold : "#ffffff55"}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <svg width="190" height="190" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={apertou ? colors.gold : "#FF0000"} /><path d="M9.5 7.5v9l7-4.5z" fill="#fff" /></svg>
        <div style={{ ...FONT, textTransform: "none", fontSize: 64, color: "#fff" }}>Próximo vídeo</div>
      </div>
      {frame >= emS ? <Sfx name="whoosh" atFrame={emS} /> : null}
      {apertou ? <Sfx name="ding" atFrame={emC} /> : null}
      <Cursor pontos={[{ f: emC - 40, x: 1500, y: 900 }, { f: emC, x: 700, y: 560 }, { f: emC + 60, x: 700, y: 560 }]} cliques={[emC + 2]} />
      <Pant pose={pose ?? "apontando"} x={1600} y={720} w={480} em={6} />
    </>
  );
};
