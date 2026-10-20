import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { Stage } from "../components/Stage";
import { Title } from "../components/Title";
import { Panther } from "../components/Panther";
import { Sfx } from "../components/Sfx";
import { colors } from "../theme";
import { frameDe, progresso } from "../components/eventos";

const { fontFamily } = loadFont("normal", { weights: ["900"] });

// dados: { titulo?, subtitulo?, botao?, pergunta? }
// Evento clicar-botao: um cursor vai até o botão e clica ("Inscrever-se" vira "Inscrito ✓").
// Evento balao-comentario: a pergunta aparece num balão de comentário (sem evento, já aparece).
export const Cta = ({ dados, pose = "comemorando", eventos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const evClique = frameDe(eventos, "clicar-botao");
  const evBalao = frameDe(eventos, "balao-comentario");

  // Cursor chega 12 frames antes do clique, que acontece no frame do evento.
  const chegada = evClique === null ? 0 : progresso(frame, fps, Math.max(0, evClique - 12), { damping: 20 });
  const clicado = evClique !== null && frame >= evClique;
  const aperto = clicado ? interpolate(frame - evClique, [0, 3, 8], [1, 0.9, 1], { extrapolateRight: "clamp" }) : 1;
  const inscricao = dados.botao && /inscrev/i.test(dados.botao);
  const textoBotao = clicado && inscricao ? "Inscrito ✓" : dados.botao;
  const balao = dados.pergunta ? (evBalao === null ? 1 : progresso(frame, fps, evBalao, { damping: 11 })) : 0;

  return (
    <Stage>
      <Sfx name="riser" atFrame={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 36, padding: "0 160px 240px" }}>
        {dados.titulo ? <Title size={80}>{dados.titulo}</Title> : null}
        {dados.subtitulo ? (
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 38, color: colors.gold }}>{dados.subtitulo}</div>
        ) : null}
        {dados.botao ? (
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 64,
                color: colors.text,
                padding: "26px 70px",
                borderRadius: 999,
                background: clicado && inscricao ? "#3a3350" : colors.red,
                boxShadow: `0 0 60px ${clicado && inscricao ? colors.violet : colors.red}88`,
                transform: `scale(${aperto})`,
              }}
            >
              {textoBotao}
            </div>
            {evClique !== null ? (
              <div
                style={{
                  position: "absolute",
                  fontSize: 90,
                  left: interpolate(chegada, [0, 1], [700, 180]),
                  top: interpolate(chegada, [0, 1], [320, 60]),
                  opacity: chegada,
                  transform: `scale(${aperto})`,
                }}
              >
                👆
              </div>
            ) : null}
          </div>
        ) : null}
        {balao > 0 ? (
          <div
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 48,
              color: colors.bgOuter,
              background: colors.text,
              padding: "26px 44px",
              borderRadius: "36px 36px 36px 6px",
              boxShadow: `0 0 50px ${colors.violetLight}88`,
              transform: `scale(${balao})`,
              transformOrigin: "left bottom",
            }}
          >
            💬 {dados.pergunta}
          </div>
        ) : null}
      </AbsoluteFill>
      <Panther pose={pose} left="50%" top="84%" width={380} />
    </Stage>
  );
};
