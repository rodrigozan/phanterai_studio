import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Panther } from "../components/Panther";
import { colors } from "../theme";
import { arquivoDoEpisodio, frameDe, progresso } from "../components/eventos";

// Janela de navegador estilo YouTube Studio.
// dados: { imagem, legenda? }  print dentro da janela, ou, sem imagem, uma grade desenhada:
// dados: { videos | thumbs, iguais?, layout?: "lado-a-lado", embaralhar? }
//   iguais/embaralhar  todas as thumbs com a mesma cara (o "canal fábrica")
// Eventos: clonar-cards (a primeira thumb se clona nas outras), entrar-thumbs (entram em
// cascata), embaralhar (as thumbs trocam de lugar).
const PALETAS = [
  [colors.violet, colors.gold],
  [colors.red, colors.violetLight],
  [colors.green, colors.violet],
  [colors.gold, colors.red],
  [colors.violetLight, colors.green],
  [colors.violet, colors.red],
];

const Thumb = ({ i, iguais, largura }) => {
  const [a, b] = iguais ? PALETAS[0] : PALETAS[i % PALETAS.length];
  return (
    <div style={{ width: largura, display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          height: largura * 0.5625,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${a}, ${b})`,
          boxShadow: `0 0 24px ${a}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: largura * 0.22,
        }}
      >
        {iguais ? "🤖" : ["☕", "🌅", "📚", "🌧️", "🎧", "🌙"][i % 6]}
      </div>
      <div style={{ height: 14, width: "90%", borderRadius: 7, background: `${colors.text}55` }} />
      <div style={{ height: 12, width: "60%", borderRadius: 6, background: `${colors.text}33` }} />
    </div>
  );
};

const Janela = ({ children }) => (
  <div
    style={{
      width: 1320,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: `0 0 60px ${colors.violet}66`,
      border: `1px solid ${colors.violetLight}44`,
      background: "#120A24",
    }}
  >
    <div style={{ height: 44, background: "#1C1230", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.red }} />
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.gold }} />
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.green }} />
    </div>
    {children}
  </div>
);

export const StudioMockup = ({ dados, pose = "pensando", eventos, slug }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (dados.imagem) {
    return (
      <Stage>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingRight: 200 }}>
          <Janela>
            <Img src={arquivoDoEpisodio(slug, dados.imagem)} style={{ width: "100%", display: "block" }} />
          </Janela>
        </AbsoluteFill>
        <Panther pose={pose} left="90%" top="80%" width={280} />
      </Stage>
    );
  }

  const total = dados.videos ?? dados.thumbs ?? 6;
  const iguais = Boolean(dados.iguais || dados.embaralhar);
  const umaLinha = dados.layout === "lado-a-lado";
  const colunas = umaLinha ? total : 3;
  const largura = umaLinha ? 220 : 360;
  const gap = 28;

  const evClonar = frameDe(eventos, "clonar-cards");
  const evEntrar = frameDe(eventos, "entrar-thumbs");
  const evEmbaralhar = frameDe(eventos, "embaralhar");

  // Ordem embaralhada fixa (determinística entre frames).
  const destino = Array.from({ length: total }, (_, i) => (i * 3 + 2) % total);
  const mistura = progresso(frame, fps, evEmbaralhar, { damping: 16 });

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingRight: 200 }}>
        <Janela>
          <div
            style={{
              position: "relative",
              height: Math.ceil(total / colunas) * (largura * 0.5625 + 60) + gap,
              margin: gap,
            }}
          >
            {Array.from({ length: total }, (_, i) => {
              const entrada =
                evEntrar !== null ? evEntrar + i * 5 : evClonar !== null && i > 0 ? evClonar + (i - 1) * 4 : i * 3;
              const p = progresso(frame, fps, entrada);
              const pos = (k) => ({ x: (k % colunas) * (largura + gap), y: Math.floor(k / colunas) * (largura * 0.5625 + 60) });
              const de = pos(i);
              const para = pos(destino[i]);
              const x = interpolate(mistura, [0, 1], [de.x, para.x]);
              const y = interpolate(mistura, [0, 1], [de.y, para.y]) - Math.sin(mistura * Math.PI) * 40;
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y, opacity: p, transform: `scale(${0.6 + 0.4 * p})` }}>
                  <Thumb i={i} iguais={iguais} largura={largura} />
                </div>
              );
            })}
          </div>
        </Janela>
      </AbsoluteFill>
      <Panther pose={pose} left="90%" top="80%" width={280} />
    </Stage>
  );
};
