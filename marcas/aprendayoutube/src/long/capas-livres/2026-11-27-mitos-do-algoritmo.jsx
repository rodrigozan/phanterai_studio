// Capa livre de 27/11 (algoritmo não odeia seu canal): placa de "PROCURADO" do vilão, carimbada de INOCENTE.
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { SERIF } from "../CapaFormatos";

// Capa já publicada (27/11/2026): guarda a fonte original, senão o texto estoura a placa.
const ANTON = loadFont("normal", { weights: ["400"] }).fontFamily;

export default () => (
  <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg,#4a2c17 0 150px,#3d2312 150px 156px)" }}>
    <div style={{ position: "absolute", left: 300, top: 18, width: 680, height: 684, background: "#EBD9AE", transform: "rotate(-1.5deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.65)", textAlign: "center", color: "#2B1B0E" }}>
      <div style={{ fontFamily: ANTON, fontSize: 140, lineHeight: 1.12 }}>PROCURADO</div>
      <div style={{ fontFamily: ANTON, fontSize: 90, lineHeight: 1.2 }}>O ALGORITMO</div>
      <div style={{ margin: "0 auto", width: 460, height: 330, border: "8px solid #2B1B0E", background: "#cdb682", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 330, lineHeight: 1 }}>?</div>
    </div>
    <div style={{ position: "absolute", left: 560, top: 465, transform: "rotate(-14deg)", border: "16px solid #C8102E", borderRadius: 24, padding: "0 40px", fontFamily: ANTON, fontSize: 150, color: "#C8102E", background: "rgba(255,246,235,0.9)" }}>INOCENTE</div>
  </AbsoluteFill>
);
