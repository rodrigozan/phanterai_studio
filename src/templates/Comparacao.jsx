import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { Panther } from "../components/Panther";
import { colors } from "../theme";
import { frameDe, progresso } from "../components/eventos";

// dados: { esquerda: { titulo, valor?, itens?, contexto? }, direita: { ... } }
// O título de cada lado aparece logo; o valor entra no evento destacar-<lado> (ou em
// cascata, sem evento). Lado destacado brilha em dourado e o outro escurece.
// Lado com titulo e valor vazios vira um "?" esperando a próxima cena.
const Coluna = ({ lado, entrada, destaque, apagado }) => {
  const vazio = !lado.titulo && !lado.valor && !(lado.itens ?? []).length;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "44%",
        opacity: apagado ? 0.45 : 1,
        transform: `scale(${1 + 0.05 * destaque})`,
      }}
    >
      <Title size={48} color={vazio ? `${colors.text}55` : colors.violetLight}>
        {vazio ? "?" : lado.titulo}
      </Title>
      {lado.valor ? (
        <Card context={destaque > 0 ? "destaque" : lado.contexto} enterFrame={entrada} style={{ textAlign: "center" }}>
          <Title size={64} color={destaque > 0 ? colors.gold : colors.text}>
            {lado.valor}
          </Title>
        </Card>
      ) : null}
      {(lado.itens ?? []).map((texto, i) => (
        <Card key={i} context={lado.contexto} enterFrame={entrada + i * 8}>
          {texto}
        </Card>
      ))}
    </div>
  );
};

export const Comparacao = ({ dados, pose = "pensando", eventos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const evEsq = frameDe(eventos, "destacar-esquerda");
  const evDir = frameDe(eventos, "destacar-direita");
  const dEsq = progresso(frame, fps, evEsq);
  const dDir = progresso(frame, fps, evDir);
  // Só um lado em foco: o destacado mais recente.
  const focoDir = evDir !== null && frame >= evDir && (evEsq === null || evDir >= evEsq);
  const focoEsq = evEsq !== null && frame >= evEsq && !focoDir;

  return (
    <Stage>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "100px 300px 160px 130px",
        }}
      >
        <Coluna lado={dados.esquerda} entrada={evEsq ?? 0} destaque={focoEsq ? dEsq : 0} apagado={focoDir} />
        <div
          style={{
            width: 2,
            alignSelf: "stretch",
            background: `linear-gradient(180deg, transparent, ${colors.violetLight}66, transparent)`,
          }}
        />
        <Coluna lado={dados.direita} entrada={evDir ?? 6} destaque={focoDir ? dDir : 0} apagado={focoEsq} />
      </AbsoluteFill>
      <Panther pose={pose} left="90%" top="80%" width={280} />
    </Stage>
  );
};
