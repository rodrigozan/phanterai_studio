import { loadFont } from "@remotion/google-fonts/Montserrat";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, contextColor } from "../theme";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

// Card de vidro em degradê com borda e glow da cor do contexto. `enterFrame` controla
// a entrada em cascata quando usado dentro de uma lista (ex.: checklist-cards).
export const Card = ({ children, context = "neutro", enterFrame = 0, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = contextColor(context);

  const progress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14 },
  });

  if (frame < enterFrame) {
    return null;
  }

  return (
    <div
      style={{
        fontFamily,
        fontSize: 32,
        color: colors.text,
        padding: "24px 32px",
        borderRadius: 24,
        border: `1px solid ${glow}55`,
        background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        boxShadow: `0 0 36px ${glow}44, inset 0 1px 0 rgba(255,255,255,0.15)`,
        backdropFilter: "blur(6px)",
        opacity: progress,
        transform: `translateY(${(1 - progress) * 40}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
