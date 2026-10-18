import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Fundo radial roxo/dourado com manchas de luz em movimento lento, spotlight e chão,
// conforme theme.js descrito na skill montagem-video-pantera.
export const Stage = ({ children }) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 90) * 60;
  const driftY = Math.cos(frame / 120) * 40;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${colors.bgInner} 0%, ${colors.bgOuter} 70%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: `calc(20% + ${driftX}px)`,
          top: `calc(10% + ${driftY}px)`,
          background: `radial-gradient(circle, ${colors.violet}33 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          right: `calc(10% - ${driftX}px)`,
          bottom: `calc(5% - ${driftY}px)`,
          background: `radial-gradient(circle, ${colors.gold}22 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 1100,
          height: 1100,
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at 50% 0%, ${colors.violetLight}1a 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "22%",
          background: `linear-gradient(to top, ${colors.bgOuter}cc 0%, transparent 100%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
