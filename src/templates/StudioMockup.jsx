import { AbsoluteFill, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { colors } from "../theme";

// dados: { imagem, legenda? }  (imagem = caminho relativo a public/episodes/<slug>/)
export const StudioMockup = ({ dados }) => (
  <Stage>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1320,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: `0 0 60px ${colors.violet}66`,
          border: `1px solid ${colors.violetLight}44`,
        }}
      >
        <div
          style={{
            height: 44,
            background: "#1C1230",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 18px",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.red }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.gold }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.green }} />
        </div>
        <Img src={staticFile(dados.imagem)} style={{ width: "100%", display: "block" }} />
      </div>
      {dados.legenda ? (
        <div style={{ marginTop: 30, color: colors.text, fontFamily: "Montserrat, sans-serif", fontSize: 32 }}>
          {dados.legenda}
        </div>
      ) : null}
    </AbsoluteFill>
  </Stage>
);
