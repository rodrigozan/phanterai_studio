import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { colors } from "../theme";
import { Panther } from "../components/Panther";

// dados: { video, legenda? }  gravação de tela (screencast) com a pantera reagindo no canto
export const GravacaoTela = ({ dados, pose = "apontando" }) => (
  <AbsoluteFill style={{ background: colors.bgOuter }}>
    <OffthreadVideo src={staticFile(dados.video)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    {dados.legenda ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 40,
          textAlign: "center",
          color: colors.text,
          fontFamily: "Montserrat, sans-serif",
          fontSize: 32,
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        {dados.legenda}
      </div>
    ) : null}
    {/* pose "apontando" aponta para a esquerda: posicione a pantera à direita do que ela aponta */}
    <Panther pose={pose} left="14%" top="86%" width={260} />
  </AbsoluteFill>
);
