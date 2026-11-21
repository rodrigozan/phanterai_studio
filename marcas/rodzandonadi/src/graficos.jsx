import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, radii, shadows } from "./theme";
import { AREA, Cartao, FONT, Rotulo, aparece, clamp, marca } from "./base";
import { TRECHOS } from "./roteiro-dados.js";

const Titulinho = ({ children, y = 150 }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", color: colors.amarelo, fontWeight: 900, fontSize: 84, textTransform: "uppercase", letterSpacing: 3 }}>{children}</div>
);

const useSpring = (de, config = { damping: 16, stiffness: 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - de, fps, config });
};

export const Mapa = ({ marcas }) => {
  const frame = useCurrentFrame();
  const itens = [
    ["m1", "Preparar a pasta e o projeto"],
    ["m2", "Instalar duas skills"],
    ["m3", "Apresentar a ideia e gerar o planejamento"],
    ["m4", "Corrigir o que estiver errado"],
    ["m5", "Pedir a primeira cena"],
    ["m6", "O que falta para publicar"],
  ];
  return (
    <AbsoluteFill>
      <Titulinho y={150}>O caminho, passo a passo</Titulinho>
      <div style={{ position: "absolute", left: 160, right: 160, top: 290, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
        {itens.map(([k, txt], i) => {
          const t = marcas[k];
          const a = aparece(frame, t - 4, 16);
          const ativo = frame >= t && frame < (itens[i + 1] ? marcas[itens[i + 1][0]] : 1e9);
          return (
            <div key={k} style={{ opacity: a, transform: `translateY(${(1 - a) * 40}px) scale(${ativo ? 1.03 : 1})`, display: "flex", alignItems: "center", gap: 26, padding: "22px 32px", borderRadius: radii.lg, background: ativo ? colors.roxo : `${colors.roxo}77`, border: `4px solid ${ativo ? colors.amarelo : colors.roxo}`, boxShadow: ativo ? shadows.suave : "none" }}>
              <div style={{ minWidth: 84, height: 84, borderRadius: radii.pill, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 58, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <div style={{ color: colors.branco, fontWeight: 800, fontSize: 54, lineHeight: 1 }}>{txt}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Escritorio = ({ marcas }) => {
  const frame = useCurrentFrame();
  const a = useSpring(0);
  const linhas = [
    ["a", "Planejamento.md", "ficha, elenco e cenas"],
    ["b", "Capítulos/", "um arquivo por cena"],
    ["c", "Arquivos de apoio/", "pesquisa e referências"],
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Cartao style={{ width: 1280, padding: 0, overflow: "hidden", background: colors.preto, transform: `scale(${0.92 + a * 0.08})`, opacity: a }}>
        <div style={{ background: colors.roxo, padding: "18px 36px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 60, height: 44, background: colors.amarelo, borderRadius: "6px 14px 6px 6px" }} />
          <div style={{ color: colors.branco, fontWeight: 900, fontSize: 56 }}>Autopublicação com IA</div>
          <div style={{ marginLeft: "auto", color: colors.cinza, fontWeight: 700, fontSize: 36 }}>o escritório do livro</div>
        </div>
        <div style={{ padding: "26px 36px", minHeight: 400 }}>
          {linhas.map(([k, nome, desc]) => {
            const o = aparece(frame, marcas[k] - 4, 14);
            return (
              <div key={k} style={{ opacity: o, transform: `translateX(${(1 - o) * -60}px)`, display: "flex", alignItems: "center", gap: 28, padding: "22px 0", borderBottom: `3px solid ${colors.roxo}55` }}>
                <div style={{ width: 52, height: 64, background: nome.endsWith("/") ? colors.amarelo : colors.cinza, borderRadius: nome.endsWith("/") ? "6px 14px 6px 6px" : 8 }} />
                <div style={{ color: colors.branco, fontWeight: 900, fontSize: 64 }}>{nome}</div>
                <div style={{ marginLeft: "auto", color: colors.cinza, fontWeight: 700, fontSize: 42 }}>{desc}</div>
              </div>
            );
          })}
        </div>
      </Cartao>
    </AbsoluteFill>
  );
};

export const Beats = ({ marcas }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [marcas.a, marcas.a + 40], [0, 36], clamp));
  const aA = 0.25 + 0.75 * aparece(frame, marcas.a - 6);
  const aB = 0.25 + 0.75 * aparece(frame, marcas.b - 6);
  const aC = 0.25 + 0.75 * aparece(frame, marcas.c - 6);
  const cores = [colors.amarelo, colors.branco, colors.cinza];
  return (
    <AbsoluteFill>
      <Titulinho y={150}>Crucible</Titulinho>
      <div style={{ position: "absolute", left: 140, right: 140, top: 310, display: "flex", gap: 40 }}>
        <Cartao style={{ flex: 1, padding: "40px 30px", textAlign: "center", opacity: aA, transform: `translateY(${(1 - aA) * 40}px)` }}>
          <div style={{ fontSize: 260, fontWeight: 900, lineHeight: 0.9, color: colors.amarelo }}>{n}</div>
          <div style={{ fontSize: 72, fontWeight: 800, textTransform: "uppercase" }}>beats</div>
        </Cartao>
        <Cartao style={{ flex: 1, padding: "40px 30px", textAlign: "center", opacity: aB, transform: `translateY(${(1 - aB) * 40}px)` }}>
          <div style={{ fontSize: 260, fontWeight: 900, lineHeight: 0.9, color: colors.amarelo }}>3</div>
          <div style={{ fontSize: 72, fontWeight: 800, textTransform: "uppercase" }}>fios narrativos</div>
          <svg width="420" height="60" viewBox="0 0 420 60" style={{ marginTop: 14 }}>
            {cores.map((c, i) => <path key={i} d={`M0 ${14 + i * 16} C 100 ${i * 16 - 10}, 140 ${46 + i * 6}, 210 ${14 + i * 16} S 320 ${i * 16 - 6}, 420 ${14 + i * 16}`} stroke={c} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="460" strokeDashoffset={460 * (1 - aB)} />)}
          </svg>
        </Cartao>
        <Cartao style={{ flex: 1, padding: "40px 30px", textAlign: "center", opacity: aC, transform: `translateY(${(1 - aC) * 40}px)`, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
          <div style={{ fontSize: 96, fontWeight: 900, textTransform: "uppercase", lineHeight: 0.95 }}>Fantasia épica</div>
          <div style={{ fontSize: 50, fontWeight: 700, color: colors.cinza }}>os princípios servem a outros gêneros</div>
        </Cartao>
      </div>
    </AbsoluteFill>
  );
};

export const QuatroEmUm = ({ marcas }) => {
  const frame = useCurrentFrame();
  const m = spring({ frame: frame - 70, fps: 30, config: { damping: 20, stiffness: 90 } });
  const entra = aparece(frame, 0, 20);
  const skills = ["planner", "outliner", "writer", "editor"];
  const fora = ["scripts", "agentes de revisão", "hooks"];
  const oFora = aparece(frame, marcas.b - 4);
  const oTxt = aparece(frame, marcas.c - 4);
  return (
    <AbsoluteFill>
      <Titulinho y={150}>4 skills em 1</Titulinho>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, height: 260 }}>
        {skills.map((s, i) => {
          const xIni = 300 + i * 370;
          const x = xIni + (960 - 260 - xIni) * m;
          return (
            <Cartao key={s} style={{ position: "absolute", left: x, top: 20 + (1 - m) * 0, width: 520 - m * 260, padding: "30px 10px", textAlign: "center", fontWeight: 900, fontSize: 64, opacity: entra * (1 - m * 0.85), textTransform: "uppercase", borderColor: colors.cinza }}>{s}</Cartao>
          );
        })}
        <Cartao style={{ position: "absolute", left: 960 - 480, top: 10, width: 960, padding: "34px 20px", textAlign: "center", fontWeight: 900, fontSize: 80, background: colors.amarelo, color: colors.roxoEscuro, opacity: m, transform: `scale(${0.8 + m * 0.2})` }}>/crucible-writing-system</Cartao>
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 620, display: "flex", gap: 24, justifyContent: "center", opacity: oFora }}>
        <div style={{ color: colors.cinza, fontWeight: 800, fontSize: 52, alignSelf: "center" }}>Ficou de fora:</div>
        {fora.map((f) => <div key={f} style={{ background: `${colors.roxo}`, border: `3px dashed ${colors.cinza}`, borderRadius: radii.pill, padding: "10px 30px", color: colors.branco, fontWeight: 800, fontSize: 52, textDecoration: "line-through" }}>{f}</div>)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", color: colors.amarelo, fontWeight: 800, fontSize: 56, opacity: oTxt }}>O progresso passa a ser salvo em arquivos de texto</div>
    </AbsoluteFill>
  );
};

export const Anansi = ({ marcas }) => {
  const frame = useCurrentFrame();
  const colunas = [
    ["a", "Mito akan", "Anansi compra todas as histórias de Nyame, o deus do céu", colors.roxo],
    ["b", "O pagamento", "Criaturas difíceis de capturar: o leopardo Osebo e a Mmoatia", colors.roxo],
    ["c", "No conto", "Osebo vira o vilão que quer se vingar de Anansi", colors.amarelo],
  ];
  const oD = aparece(frame, marcas.d - 4);
  return (
    <AbsoluteFill>
      <Titulinho y={140}>Do mito ao conto</Titulinho>
      <div style={{ position: "absolute", left: 100, right: 100, top: 290, display: "flex", gap: 34, alignItems: "stretch" }}>
        {colunas.map(([k, titulo, txt, cor], i) => {
          const o = aparece(frame, marcas[k] - 4, 16);
          const claro = cor === colors.amarelo;
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
              <div style={{ flex: 1, background: cor, color: claro ? colors.roxoEscuro : colors.branco, borderRadius: radii.lg, padding: "34px 30px", minHeight: 420, border: `4px solid ${colors.amarelo}`, boxShadow: shadows.suave }}>
                <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: claro ? colors.roxo : colors.amarelo }}>{titulo}</div>
                <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 1, marginTop: 20, opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>{txt}</div>
              </div>
              {i < 2 && <div style={{ fontSize: 90, color: colors.amarelo, fontWeight: 900, opacity: 0.4 + 0.6 * o }}>›</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", color: colors.cinza, fontWeight: 800, fontSize: 54, opacity: oD }}>O mito entra na história sem ser copiado</div>
    </AbsoluteFill>
  );
};

export const Kalunga = ({ marcas }) => {
  const frame = useCurrentFrame();
  const aA = aparece(frame, marcas.a - 6);
  const aB = aparece(frame, marcas.b - 6);
  const aC = aparece(frame, marcas.c - 6);
  const onda = (off, cor, op) => (
    <svg width="1700" height="120" viewBox="0 0 1700 120" style={{ position: "absolute", left: 0, top: off }}>
      <path d={`M0 60 ${Array.from({ length: 17 }, (_, i) => `Q ${i * 100 + 50} ${60 + Math.sin(frame / 14 + i + off) * 36} ${i * 100 + 100} 60`).join(" ")} V120 H0 Z`} fill={cor} opacity={op} />
    </svg>
  );
  return (
    <AbsoluteFill>
      <Titulinho y={140}>Kalunga</Titulinho>
      <div style={{ position: "absolute", left: AREA.x, top: 260, width: 1700, height: 560 }}>
        <Cartao style={{ position: "absolute", left: 0, top: 0, width: 1700, height: 150, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, fontWeight: 900, textTransform: "uppercase", opacity: aA, background: colors.roxoEscuro, borderColor: colors.roxo }}>Mundo dos vivos</Cartao>
        <div style={{ position: "absolute", left: 0, top: 190, width: 1700, height: 180, opacity: aB }}>
          {onda(20, colors.roxo, 0.9)}
          {onda(50, colors.cinza, 0.22)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", color: colors.branco, fontWeight: 900, fontSize: 70, textTransform: "uppercase", letterSpacing: 6 }}>Fronteira de água</div>
        </div>
        <Cartao style={{ position: "absolute", left: 0, top: 410, width: 1700, height: 150, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, fontWeight: 900, textTransform: "uppercase", opacity: aA, background: colors.roxoEscuro, borderColor: colors.roxo }}>Mundo dos ancestrais</Cartao>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 815, textAlign: "center", color: colors.amarelo, fontWeight: 800, fontSize: 52, opacity: aC }}>Depois do tráfico de escravizados, associada ao oceano Atlântico</div>
    </AbsoluteFill>
  );
};

const LinhaEstrutura = ({ rotulo, txt, t, frame }) => {
  const o = aparece(frame, t - 4);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26 }}>
      <div style={{ background: colors.amarelo, color: colors.roxoEscuro, borderRadius: radii.md, fontWeight: 900, fontSize: 44, textTransform: "uppercase", padding: "6px 20px", minWidth: 250, textAlign: "center", opacity: 0.3 + 0.7 * o }}>{rotulo}</div>
      <div style={{ color: colors.branco, fontWeight: 800, fontSize: 52, lineHeight: 1, opacity: o, transform: `translateX(${(1 - o) * -40}px)` }}>{txt}</div>
    </div>
  );
};

export const Estrutura = ({ marcas }) => {
  const frame = useCurrentFrame();
  const a = aparece(frame, 0);
  const meia = (titulo, itens) => (
    <Cartao style={{ flex: 1, padding: "30px 34px", background: colors.roxoEscuro, minHeight: 560 }}>
      <div style={{ fontSize: 76, fontWeight: 900, color: colors.amarelo, textTransform: "uppercase", marginBottom: 30 }}>{titulo}</div>
      {itens.map(([r, txt, k]) => <LinhaEstrutura key={k} rotulo={r} txt={txt} t={marcas[k]} frame={frame} />)}
    </Cartao>
  );
  return (
    <AbsoluteFill>
      <Titulinho y={130}>Cena e sequência</Titulinho>
      <div style={{ position: "absolute", left: 80, right: 80, top: 260, display: "flex", gap: 30, opacity: a }}>
        {meia("Cena", [["Objetivo", "Pegar o xarope", "o"], ["Conflito", "O Lobisomem, que antes era o Seu Ademir", "c"], ["Desastre", "A lata de sardinha", "d"]])}
        {meia("Sequência", [["Reação", "Pânico e culpa", "r"], ["Dilema", "Entrar ou correr para o rio", "di"], ["Decisão", "Passar o xarope por baixo da porta e correr para o rio", "de"]])}
      </div>
    </AbsoluteFill>
  );
};

export const Texto = ({ trechos, modo, dur }) => {
  const frame = useCurrentFrame();
  const total = trechos.map((t) => TRECHOS[t]);
  const porTrecho = Math.floor((dur - 10) / total.length);
  const i = Math.min(total.length - 1, Math.floor(frame / porTrecho));
  const f = frame - i * porTrecho;
  const txt = total[i];
  const chars = Math.min(txt.length, Math.floor(f * Math.max(2.4, txt.length / Math.max(20, porTrecho - 26))));
  return (
    <AbsoluteFill>
      <Cartao style={{ position: "absolute", left: 200, right: 200, top: 250, padding: "50px 64px", background: colors.cinza, color: colors.preto, borderColor: colors.amarelo, minHeight: 440 }}>
        <div style={{ color: colors.roxo, fontWeight: 900, fontSize: 40, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Cena 1 · Lara</div>
        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.12 }}>{txt.slice(0, chars)}<span style={{ opacity: Math.sin(frame / 4) > 0 ? 1 : 0, color: colors.roxo }}>|</span></div>
      </Cartao>
      {modo === "depois" && <Rotulo>Depois</Rotulo>}
    </AbsoluteFill>
  );
};

export const Ciclo = ({ marcas }) => {
  const frame = useCurrentFrame();
  const nos = [["a", "Claude escreve"], ["b", "Eu leio"], ["c", "Eu corrijo"], ["d", "O plano acompanha"]];
  return (
    <AbsoluteFill>
      <Titulinho y={150}>O ciclo se repete</Titulinho>
      <div style={{ position: "absolute", left: 90, right: 90, top: 380, display: "flex", alignItems: "center", gap: 16 }}>
        {nos.map(([k, txt], i) => {
          const o = aparece(frame, marcas[k] - 4);
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
              <Cartao style={{ flex: 1, padding: "40px 16px", textAlign: "center", fontWeight: 900, fontSize: 64, lineHeight: 1, opacity: o, transform: `scale(${0.85 + o * 0.15})`, background: i === 3 ? colors.amarelo : colors.roxo, color: i === 3 ? colors.roxoEscuro : colors.branco }}>{txt}</Cartao>
              {i < 3 && <div style={{ color: colors.amarelo, fontSize: 84, fontWeight: 900, opacity: o }}>›</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", color: colors.amarelo, fontSize: 120, fontWeight: 900, opacity: aparece(frame, marcas.d + 10) }}>↻</div>
    </AbsoluteFill>
  );
};

export const Faltam = ({ marcas }) => {
  const frame = useCurrentFrame();
  const itens = [["a", "Diagramar"], ["b", "Capa"], ["c", "Publicar"], ["d", "Divulgar"], ["e", "Vender"]];
  return (
    <AbsoluteFill>
      <Titulinho y={150}>O que ainda falta</Titulinho>
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
        {itens.map(([k, txt]) => {
          const o = aparece(frame, marcas[k] - 4, 16);
          return (
            <Cartao key={k} style={{ width: 300, padding: "40px 10px", textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 50}px)` }}>
              <div style={{ width: 70, height: 70, margin: "0 auto 18px", border: `6px solid ${colors.amarelo}`, borderRadius: 14 }} />
              <div style={{ fontSize: 66, fontWeight: 900, textTransform: "uppercase" }}>{txt}</div>
            </Cartao>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Final = ({ marcas }) => {
  const frame = useCurrentFrame();
  const a = useSpring(0);
  const b = aparece(frame, marcas.a - 10, 18);
  const pulso = 1 + 0.03 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: colors.roxoEscuro }}>
      <div style={{ textAlign: "center", transform: `scale(${0.9 + a * 0.1})`, opacity: a, marginTop: -40 }}>
        <Img src={marca("simbolo-amarelo.png")} style={{ height: 330 }} />
        <div><Img src={marca("logotipo-amarelo.png")} style={{ height: 70, marginTop: 20 }} /></div>
        <div style={{ marginTop: 40, display: "inline-block", opacity: b, transform: `scale(${pulso})`, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 84, textTransform: "uppercase", padding: "12px 56px", borderRadius: radii.pill, fontFamily: FONT }}>Inscreva-se no canal</div>
        <div style={{ marginTop: 22, color: colors.cinza, fontWeight: 800, fontSize: 56, opacity: b }}>@rodzandonadi</div>
      </div>
    </AbsoluteFill>
  );
};
