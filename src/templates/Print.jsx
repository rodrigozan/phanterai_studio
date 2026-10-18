import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

// dados: { imagem, legenda? }  print cheio de tela, com leve zoom (ken burns)
export const Print = ({ dados }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: colors.bgOuter }}>
      <Img
        src={staticFile(dados.imagem)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
      />
      {dados.legenda ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 60,
            textAlign: "center",
            color: colors.text,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 34,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {dados.legenda}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
