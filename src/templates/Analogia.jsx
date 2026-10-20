import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Panther } from "../components/Panther";
import { Midia } from "../components/Midia";
import { colors } from "../theme";
import { arquivoDoEpisodio, progresso } from "../components/eventos";

const { fontFamily } = loadFont("normal", { weights: ["900"] });

const normalizar = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

// dados: { imagem?, emoji?, titulo?, texto?, cena? }
//   imagem  ilustração da analogia em public/episodes/<slug>/ (o Rod fornece)
//   cena    descrição da ilustração desejada - não aparece na tela
// Sem imagem/titulo, a própria fala vira texto animado: cada palavra entra em sequência e
// a palavra de cada evento (`ao`) acende em dourado no momento em que é dita.
export const Analogia = ({ dados, pose = "pensando", eventos = [], fala = "", slug }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const temConteudo = dados.imagem || dados.emoji || dados.titulo || dados.texto;

  const gatilhos = eventos.map((e) => ({ palavra: normalizar(String(e.ao)), frame: e.frame }));
  const tamanhoFala = fala.length > 90 ? 58 : fala.length > 50 ? 68 : 80;

  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 28, padding: "200px 420px 120px 200px" }}>
        {dados.imagem ? (
          <Midia src={arquivoDoEpisodio(slug, dados.imagem)} maxW={1200} maxH={700} />
        ) : null}
        {dados.emoji ? <div style={{ fontSize: 160 }}>{dados.emoji}</div> : null}
        {dados.titulo ? <Title size={60}>{dados.titulo}</Title> : null}
        {dados.texto ? (
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 36, color: colors.text, textAlign: "center", opacity: 0.9 }}>
            {dados.texto}
          </div>
        ) : null}
        {!temConteudo ? (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 22px" }}>
            {fala.split(/\s+/).filter(Boolean).map((palavra, i) => {
              const entrada = progresso(frame, fps, i * 2, { damping: 16 });
              const gatilho = gatilhos.find((g) => g.palavra === normalizar(palavra));
              const aceso = gatilho ? progresso(frame, fps, gatilho.frame, { damping: 10 }) : 0;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily,
                    fontWeight: 900,
                    fontSize: tamanhoFala,
                    textTransform: "uppercase",
                    color: aceso > 0.5 ? colors.gold : colors.text,
                    textShadow: aceso > 0.5 ? `0 0 40px ${colors.gold}` : "0 4px 24px rgba(0,0,0,0.45)",
                    opacity: entrada,
                    transform: `translateY(${(1 - entrada) * 30}px) scale(${1 + 0.25 * aceso})`,
                    display: "inline-block",
                    margin: `0 ${14 * aceso}px`,
                  }}
                >
                  {palavra}
                </span>
              );
            })}
          </div>
        ) : null}
      </AbsoluteFill>
      <Panther pose={pose} left="88%" top="80%" width={300} />
    </Stage>
  );
};
