// Biblioteca de capas (1280x720). Cada formato é uma composição DIFERENTE (layout, fundo, tipografia, com ou sem a assinatura do canal),
// tirada das thumbs que mais superaram a mediana do próprio canal (pesquisa de 27/11/2026, scripts/capa-pesquisa.py).
// Números, gráficos, posts e notificações: SÓ com dado real do vídeo. Documentação dos campos: docs/capas.md
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as playfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as marker } from "@remotion/google-fonts/PermanentMarker";
import { FONT, LARANJA, pasta } from "./base";
import { Logo, Play } from "../components/identidade";
import { DISPLAY, FAMILIA } from "../theme";

// Fontes do canal. Os nomes antigos ficam porque as capas livres os importam.
export const ANTON = DISPLAY;
export const INTER = FAMILIA;
export const SERIF = playfair("italic", { weights: ["900"] }).fontFamily;
export const MARKER = marker("normal", { weights: ["400"] }).fontFamily;

export const Faisca = ({ size = 220, cor = LARANJA, tile = true }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: tile ? "#fff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: tile ? "0 18px 40px rgba(0,0,0,0.45)" : "none" }}>
    <svg width={size * 0.72} height={size * 0.72} viewBox="-50 -50 100 100">
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x="-7" y={i % 2 ? -40 : -47} width="14" height={i % 2 ? 30 : 40} rx="7" fill={cor} transform={`rotate(${i * 30})`} />
      ))}
    </svg>
  </div>
);

// Tamanho de fonte que faz a maior linha caber na largura (k = largura média de um glifo / tamanho).
export const caber = (linhas, largura, max, k = 0.6) => Math.min(max, Math.floor(largura / (Math.max(...[].concat(linhas).map((l) => String(l).length), 1) * Math.max(k * 1.14, 0.62)))); // Lexend é bem mais larga que Anton
// No lugar do mascote: a assinatura do canal (forma amarela). Mantém o nome do slot; `pose` não se aplica aqui.
export const Pantera = ({ style = {} }) => {
  const { width = 460, filter, ...pos } = style;
  return <Logo largura={Math.round(width * 0.82)} coracao={false} style={{ position: "absolute", filter, ...pos }} />;
};
export const Foto = ({ slug, src, style }) => <Img src={pasta(slug, src)} style={{ objectFit: "cover", objectPosition: "top left", ...style }} />;
const abs = (s) => ({ position: "absolute", ...s });
const Linhas = ({ l, size, font = ANTON, style = {} }) => (
  <div style={{ fontFamily: font, fontSize: size, lineHeight: font === ANTON ? 1.08 : 1.02, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>
    {[].concat(l).map((x, i) => <div key={i}>{x}</div>)}
  </div>
);
const Seta = ({ d, style, cor = "#E11D2E", w = 14 }) => (
  <svg viewBox="0 0 200 200" width="200" height="200" style={abs(style)}>
    <path d={d || "M20 30 C 90 20, 150 70, 155 160 M155 160 L 118 128 M155 160 L 178 115"} fill="none" stroke={cor} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 1. Citação: frase entre aspas, um trecho grifado em vermelho, "rosto" à direita.
const Citacao = ({ slug, antes = [], destaque, pose = "pensando", fundo = "#9A015C" }) => {
  const s = caber([...antes, destaque], 700, 112, 0.58);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(100deg, ${fundo}, #4E002F)` }}>
      <Pantera slug={slug} pose={pose} style={{ right: -40, bottom: -90, width: 600, filter: "drop-shadow(0 0 3px #fff) drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }} />
      <div style={abs({ left: 70, top: 0, height: 720, display: "flex", flexDirection: "column", justifyContent: "center", fontFamily: INTER, fontWeight: 900, fontSize: s, lineHeight: 1.18, color: "#fff", whiteSpace: "nowrap" })}>
        {antes.map((l, i) => <div key={i}>{i === 0 ? <span style={{ marginLeft: -s * 0.45 }}>“</span> : null}{l}</div>)}
        <div><span style={{ background: "#DFD011", color: "#9A015C", padding: "0 18px" }}>{destaque}</span>”</div>
      </div>
    </AbsoluteFill>
  );
};

// 2. Versus: duas metades, dois números/estados.
const Versus = ({ esquerda, direita }) => (
  <AbsoluteFill style={{ flexDirection: "row" }}>
    {[[esquerda, "linear-gradient(160deg,#E6335D,#B51E45)", "#fff"], [direita, "#DFD011", "#9A015C"]].map(([d, bg, cor], i) => (
      <div key={i} style={{ width: 640, height: 720, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: cor }}>
        <Linhas l={d.topo} size={caber(d.topo, 560, 130, 0.52)} />
        <Linhas l={d.numero} size={caber(d.numero, 570, 260, 0.52)} />
        <Linhas l={d.base} size={caber(d.base, 560, 110, 0.52)} />
      </div>
    ))}
    <div style={abs({ left: 636, top: 0, width: 8, height: 720, background: "#fff" })} />
  </AbsoluteFill>
);

// 3. Post: cartão de publicação com a frase e um grifo de caneta.
const Post = ({ slug, autor, linhas, pose = "surpresa", fundo = "#DFD011" }) => {
  const s = caber(linhas, 710, 104, 0.57);
  return (
    <AbsoluteFill style={{ background: fundo }}>
      <div style={abs({ left: 40, top: 80, width: 800, height: 560, borderRadius: 34, background: "#fff", boxShadow: "0 30px 60px rgba(10,40,70,0.28)", padding: "44px 46px", boxSizing: "border-box", fontFamily: INTER, color: "#4E002F" })}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 38, fontWeight: 800 }}>
          <Play size={90} />
          {autor}
        </div>
        <div style={{ marginTop: 44, fontWeight: 900, fontSize: s, lineHeight: 1.12, whiteSpace: "nowrap" }}>{linhas.map((l, i) => <div key={i}>{l}</div>)}</div>
        <svg width="680" height="40" viewBox="0 0 680 40"><path d="M6 26 C 180 8, 440 8, 674 18" stroke="#E11D2E" strokeWidth="13" fill="none" strokeLinecap="round" /></svg>
      </div>
      <Pantera slug={slug} pose={pose} style={{ right: -50, bottom: -60, width: 500, filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.35))" }} />
    </AbsoluteFill>
  );
};

// 4. Escalada: três colunas que crescem (1K, 10K, 30K / dia 1, 7, 30).
const Escalada = ({ passos, titulo, cor = "#DFD011" }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#3A0023,#4E002F)" }}>
    <Linhas l={titulo} size={caber(titulo, 1180, 130, 0.5)} style={{ ...abs({ left: 0, top: 28, width: 1280 }), textAlign: "center", color: "#fff" }} />
    {passos.map((p, i) => (
      <div key={i} style={abs({ left: 70 + i * 400, bottom: 0, width: 340, height: 220 + i * 140, background: `linear-gradient(180deg, ${cor}, #6B6405)`, opacity: 0.55 + i * 0.22, borderRadius: "24px 24px 0 0", display: "flex", justifyContent: "center" })}>
        <Linhas l={p} size={caber(p, 300, 150, 0.52)} style={{ color: "#fff", marginTop: 28 }} />
      </div>
    ))}
  </AbsoluteFill>
);

// 5. Cartaz: a pantera segura uma placa com a tese.
const Cartaz = ({ slug, linhas, pose = "triste", fundo = "#4E002F" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 20%, #8A0A55, ${fundo} 70%)` }}>
    <Pantera slug={slug} pose={pose} style={{ left: 350, top: -20, width: 580, filter: "drop-shadow(0 0 4px #fff)" }} />
    <div style={abs({ left: 100, top: 380, width: 1080, height: 300, background: "#FDFCF7", borderRadius: 14, transform: "rotate(-2.2deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" })}>
      <Linhas l={linhas} size={caber(linhas, 990, linhas.length > 1 ? 122 : 200, 0.5)} style={{ color: "#111" }} />
    </div>
    {[250, 960].map((x) => <div key={x} style={abs({ left: x, top: x < 600 ? 386 : 356, width: 86, height: 70, borderRadius: 40, background: "#E6335D", border: "5px solid #fff" })} />)}
  </AbsoluteFill>
);

// 6. Métrica: cartão do analytics com o número real + palavra entre aspas.
const Metrica = ({ slug, rotulo, valor, sobe = false, palavra, pose = "triste" }) => (
  <AbsoluteFill style={{ background: "linear-gradient(120deg,#9A015C,#720144 60%,#4E002F)" }}>
    <Pantera slug={slug} pose={pose} style={{ left: -40, top: 10, width: 530 }} />
    <div style={abs({ right: 60, top: 70, width: 700, height: 340, background: "#fff", borderRadius: 18, padding: "36px 46px", boxSizing: "border-box", fontFamily: INTER, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" })}>
      <div style={{ fontSize: 46, fontWeight: 500, color: "#606060" }}>{rotulo}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 40 }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, border: `10px solid ${sobe ? "#16A34A" : "#D50000"}`, color: sobe ? "#16A34A" : "#D50000", fontSize: 70, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{sobe ? "↑" : "↓"}</div>
        <div style={{ fontSize: caber(valor, 440, 150, 0.62), fontWeight: 900, color: "#0F0F0F", whiteSpace: "nowrap" }}>{valor}</div>
      </div>
    </div>
    <Linhas l={`“${palavra}”`} size={caber(`“${palavra}”`, 1160, 220, 0.5)} style={{ ...abs({ left: 0, bottom: 20, width: 1280 }), textAlign: "center", color: "#fff", textShadow: "0 10px 30px rgba(0,0,0,0.7)" }} />
  </AbsoluteFill>
);

// 7. Gráfico: curva (pontos reais, 0 a 100) + anotação à mão com seta.
const Grafico = ({ pontos, anotacao, rotulo, marco }) => {
  const max = Math.max(...pontos), xy = pontos.map((v, i) => [20 + (i * 1240) / (pontos.length - 1), 660 - (v / max) * 560]);
  const m = xy[marco ?? Math.floor(pontos.length / 2)];
  return (
    <AbsoluteFill style={{ background: "#4E002F" }}>
      <svg width="1280" height="720" style={abs({ left: 0, top: 0 })}>
        {[160, 285, 410, 535, 660].map((y) => <line key={y} x1="0" x2="1280" y1={y} y2={y} stroke="#7A1C55" strokeWidth="2" />)}
        <polygon points={`20,720 ${xy.join(" ")} 1260,720`} fill="rgba(223,208,17,0.16)" />
        <polyline points={xy.join(" ")} fill="none" stroke="#DFD011" strokeWidth="11" strokeLinejoin="round" />
        <circle cx={m[0]} cy={m[1]} r="24" fill="#fff" stroke="#E11D2E" strokeWidth="10" />
      </svg>
      <Linhas l={anotacao} font={MARKER} size={caber(anotacao, 760, 130, 0.66)} style={{ ...abs({ left: 50, top: 60 }), color: "#fff", transform: "rotate(-5deg)" }} />
      {rotulo ? <div style={abs({ right: 40, top: 34, fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "#fff" })}>{rotulo}</div> : null}
      <Seta style={{ left: m[0] - 190, top: m[1] - 190 }} />
    </AbsoluteFill>
  );
};

// 8. Etapas: três telas reais em sequência (rascunho -> final).
const Etapas = ({ slug, comando, telas }) => (
  <AbsoluteFill style={{ background: "#3A0023" }}>
    <div style={{ ...abs({ left: 0, top: 50, width: 1280 }), textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: caber(comando, 1160, 90, 0.57), color: "#fff", whiteSpace: "nowrap" }}>{comando}</div>
    {telas.map((t, i) => (
      <div key={i} style={abs({ left: 30 + i * 415, top: 215, width: 390 })}>
        <Foto slug={slug} src={t.img} style={{ width: 390, height: 360, borderRadius: 14, border: `${i === 2 ? 8 : 3}px solid ${i === 2 ? "#DFD011" : "#555"}`, boxSizing: "border-box", filter: i === 0 ? "grayscale(1) brightness(0.8)" : "none" }} />
        <div style={{ margin: "26px auto 0", width: 260, textAlign: "center", borderRadius: 14, border: `3px solid ${i === 2 ? "#DFD011" : "#666"}`, padding: "10px 0", fontFamily: INTER, fontWeight: 800, fontSize: 36, color: "#fff" }}>{t.rotulo}</div>
      </div>
    ))}
    {[400, 815].map((x) => <Seta key={x} cor="#DFD011" w={16} d="M60 120 Q 100 60 140 120 M140 120 L 100 112 M140 120 L 146 80" style={{ left: x - 75, top: 105 }} />)}
  </AbsoluteFill>
);

// 9. Resultado: o que o vídeo produziu em tela cheia + título serifado.
const Resultado = ({ slug, img, titulo, selo, zoom = 1.04 }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Foto slug={slug} src={img} style={{ width: 1280, height: 720, objectPosition: "center", transform: `scale(${zoom})` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, transparent 48%)" }} />
    <div style={{ ...abs({ left: 0, top: 18, width: 1280 }), textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: caber(titulo, 1180, 190, 0.52), color: "#DFD011", whiteSpace: "nowrap", textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>{titulo}</div>
    {selo ? <div style={abs({ right: 36, bottom: 90, background: "#fff", color: "#111", fontFamily: INTER, fontWeight: 900, fontSize: 52, padding: "14px 30px", borderRadius: 16, transform: "rotate(-3deg)" })}>{selo}</div> : null}
  </AbsoluteFill>
);

// 10. Grade: fundo claro, blocos com ícone desenhado (número ou letra) e rótulo.
const Grade = ({ titulo, itens, rodape, cor = "#DFD011", faisca = false }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #FFFFFF, #F4EFD0)" }}>
    <div style={abs({ left: 0, top: 42, width: 1280, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 })}>
      {faisca ? <Faisca size={140} /> : null}
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: caber(titulo, 900, 150, 0.6), color: "#141414", whiteSpace: "nowrap" }}>{titulo}</div>
    </div>
    <div style={abs({ left: 30, top: 250, width: 1220, display: "flex", justifyContent: "center", gap: 20 })}>
      {itens.map((t, i) => (
        <div key={i} style={{ width: Math.min(290, 1220 / itens.length - 20), height: 270, borderRadius: 30, background: "#9A015C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: "0 22px 40px rgba(120,60,20,0.3)" }}>
          <div style={{ fontFamily: ANTON, fontSize: 120, color: cor, lineHeight: 1 }}>{t.icone}</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: caber(t.rotulo, 1220 / itens.length - 44, 40, 0.6), color: "#fff" }}>{t.rotulo}</div>
        </div>
      ))}
    </div>
    <div style={{ ...abs({ left: 0, bottom: 40, width: 1280 }), textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: caber(rodape, 1100, 96, 0.58), color: "#141414", whiteSpace: "nowrap" }}>{rodape}</div>
  </AbsoluteFill>
);

// 11. Gigante: uma palavra enorme ATRÁS do personagem.
const Gigante = ({ slug, palavra, selo, pose = "feliz", fundo = "#9A015C", faisca = false }) => (
  <AbsoluteFill style={{ background: `linear-gradient(135deg, #E6335D, ${fundo} 60%)` }}>
    <div style={{ ...abs({ left: 0, top: 10, width: 1280 }), textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: caber(palavra, 1100, 460, 0.55), color: "#fff", whiteSpace: "nowrap", textShadow: "0 10px 34px rgba(80,30,0,0.55)" }}>{palavra}</div>
    <Pantera slug={slug} pose={pose} style={{ right: -50, bottom: -130, width: 540, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }} />
    {faisca ? <div style={abs({ left: 70, bottom: 60 })}><Faisca size={170} /></div> : null}
    {selo ? <div style={abs({ left: faisca ? 280 : 60, bottom: 100, border: "5px solid #fff", background: "rgba(0,0,0,0.28)", borderRadius: 18, padding: "10px 28px", fontFamily: ANTON, fontSize: 66, color: "#fff" })}>{selo}</div> : null}
  </AbsoluteFill>
);

// 12. Marca-texto: título empilhado com a palavra-chave em caixa amarela + print real.
const Marcatexto = ({ slug, linha, destaque, img, fundo = "#9A015C" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 40%, ${fundo}, #4E002F 80%)` }}>
    <div style={abs({ left: 40, top: 0, height: 720, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 })}>
      <Linhas l={linha} size={caber(linha, 600, 190, 0.5)} style={{ color: "#fff" }} />
      <div style={{ background: "#DFD011", transform: "rotate(-3deg)", padding: "4px 26px", alignSelf: "flex-start" }}><Linhas l={destaque} size={caber(destaque, 560, 220, 0.5)} style={{ color: "#0A0A0A" }} /></div>
    </div>
    <Foto slug={slug} src={img} style={{ position: "absolute", right: -40, top: 110, width: 590, height: 500, borderRadius: 22, border: "8px solid #fff", boxSizing: "border-box", transform: "perspective(1400px) rotateY(-16deg)", boxShadow: "0 40px 70px rgba(0,0,0,0.6)" }} />
  </AbsoluteFill>
);

// 13. Velho x novo: fundo branco, o jeito antigo riscado.
const VelhoNovo = ({ slug, velho, novo, pose = "apontando" }) => (
  <AbsoluteFill style={{ background: "#fff" }}>
    {[[velho, 40, "#E11D2E", "ANTES"], [novo, 840, "#9A015C", "AGORA"]].map(([d, x, cor, tag], i) => (
      <div key={i} style={abs({ left: x, top: 50, width: 400, textAlign: "center" })}>
        <div style={{ display: "inline-block", background: cor, color: "#fff", fontFamily: ANTON, fontSize: 84, padding: "0 40px", borderRadius: 14 }}>{tag}</div>
        <div style={{ position: "relative", marginTop: 90, height: 300, borderRadius: 26, background: i ? "#DFD011" : "#EDEDED", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Linhas l={d} size={caber(d, 350, 120, 0.52)} style={{ color: i ? "#9A015C" : "#8a8a8a" }} />
          {i ? null : <div style={abs({ left: -10, top: 144, width: 420, height: 16, background: cor, transform: "rotate(-12deg)" })} />}
        </div>
      </div>
    ))}
    <Pantera slug={slug} pose={pose} style={{ left: 420, bottom: -40, width: 450 }} />
  </AbsoluteFill>
);

// 14. Notificação: avisos na tela de bloqueio (texto real/ilustrando o que o vídeo mostra).
const Notificacao = ({ avisos, chamada, faisca = false }) => (
  <AbsoluteFill style={{ background: "linear-gradient(160deg,#4E002F,#9A015C 60%,#E6335D)" }}>
    {avisos.slice(0, 3).map((a, i) => (
      <div key={i} style={abs({ left: 90 + i * 24, top: 36 + i * 148, width: 1052 - i * 0, height: 130, borderRadius: 32, background: "rgba(255,255,255,0.94)", display: "flex", alignItems: "center", gap: 28, padding: "0 32px", boxSizing: "border-box", boxShadow: "0 18px 40px rgba(0,0,0,0.35)", fontFamily: INTER })}>
        {faisca ? <Faisca size={82} /> : <div style={{ width: 82, height: 82, borderRadius: 20, background: "#E11D2E", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ borderLeft: "30px solid #fff", borderTop: "18px solid transparent", borderBottom: "18px solid transparent", marginLeft: 8 }} /></div>}
        <div style={{ fontWeight: 800, fontSize: caber(a, 860, 54, 0.58), color: "#111", whiteSpace: "nowrap" }}>{a}</div>
      </div>
    ))}
    <Linhas l={chamada} size={caber(chamada, 1180, 200, 0.5)} style={{ ...abs({ left: 0, bottom: 26, width: 1280 }), textAlign: "center", color: "#fff", textShadow: "0 10px 0 rgba(0,0,0,0.35)" }} />
  </AbsoluteFill>
);

// `tom` serve para as 3 capas de um vídeo não parecerem irmãs.
export const FORMATOS = {
  citacao: { C: Citacao, tom: "neutro" }, versus: { C: Versus, tom: "cor" }, post: { C: Post, tom: "claro" },
  escalada: { C: Escalada, tom: "escuro" }, cartaz: { C: Cartaz, tom: "escuro" }, metrica: { C: Metrica, tom: "neutro" },
  grafico: { C: Grafico, tom: "escuro" }, etapas: { C: Etapas, tom: "escuro" }, resultado: { C: Resultado, tom: "foto" },
  grade: { C: Grade, tom: "claro" }, gigante: { C: Gigante, tom: "cor" }, marcatexto: { C: Marcatexto, tom: "cor" },
  "velho-novo": { C: VelhoNovo, tom: "claro" }, notificacao: { C: Notificacao, tom: "cor" },
};
