import { loadFont } from "@remotion/google-fonts/Poppins";
import { colors } from "../theme";

const { fontFamily } = loadFont("normal", { weights: ["900"] });

export const Title = ({ children, size = 72, color = colors.text, style = {} }) => (
  <div
    style={{
      fontFamily,
      fontWeight: 900,
      textTransform: "uppercase",
      fontSize: size,
      color,
      textAlign: "center",
      lineHeight: 1.1,
      textShadow: "0 4px 24px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);
