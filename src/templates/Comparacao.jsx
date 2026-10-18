import { AbsoluteFill } from "remotion";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { colors } from "../theme";

// dados: { esquerda: { titulo, itens, contexto? }, direita: { titulo, itens, contexto? } }
const Coluna = ({ lado, offset }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "46%" }}>
    <Title size={44} color={colors.violetLight}>
      {lado.titulo}
    </Title>
    {lado.itens.map((texto, i) => (
      <Card key={i} context={lado.contexto} enterFrame={offset + i * 8}>
        {texto}
      </Card>
    ))}
  </div>
);

export const Comparacao = ({ dados }) => (
  <Stage>
    <AbsoluteFill
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "100px 130px",
      }}
    >
      <Coluna lado={dados.esquerda} offset={0} />
      <div
        style={{
          width: 2,
          alignSelf: "stretch",
          background: `linear-gradient(180deg, transparent, ${colors.violetLight}66, transparent)`,
        }}
      />
      <Coluna lado={dados.direita} offset={6} />
    </AbsoluteFill>
  </Stage>
);
