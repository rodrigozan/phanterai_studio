import { loadFont } from "@remotion/google-fonts/Montserrat";
import { colors, contextColor } from "../theme";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const Badge = ({ children, context = "neutro" }) => {
  const glow = contextColor(context);

  return (
    <span
      style={{
        fontFamily,
        fontWeight: 700,
        fontSize: 28,
        color: colors.text,
        padding: "8px 22px",
        borderRadius: 999,
        border: `2px solid ${glow}`,
        background: `${glow}22`,
        boxShadow: `0 0 24px ${glow}66`,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};
