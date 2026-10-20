import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { colors } from "../theme";
import { Sfx } from "./Sfx";
import { frameDe, progresso, sfxDaAcao } from "./eventos";

const { fontFamily } = loadFont("normal", { weights: ["900"] });

const Carimbo = ({ frame, fps, inicio, cor, texto }) => {
  const p = progresso(frame, fps, inicio, { damping: 10, mass: 0.6 });
  if (p === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 60,
        padding: "10px 32px",
        border: `8px solid ${cor}`,
        borderRadius: 22,
        color: cor,
        fontFamily,
        fontWeight: 900,
        fontSize: 76,
        textTransform: "uppercase",
        background: `${colors.bgOuter}aa`,
        boxShadow: `0 0 60px ${cor}88`,
        opacity: Math.min(1, p * 1.5),
        transform: `rotate(-12deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`,
      }}
    >
      {texto}
    </div>
  );
};

const Emoji = ({ frame, fps, inicio, children, girar = false }) => {
  const p = progresso(frame, fps, inicio);
  if (p === 0) return null;
  const rot = girar ? (frame - inicio) * 12 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 120,
        fontSize: 200,
        transform: `scale(${p}) rotate(${rot}deg)`,
        filter: `drop-shadow(0 0 40px ${colors.gold}88)`,
      }}
    >
      {children}
    </div>
  );
};

// Envolve toda cena (Episode.jsx). Toca o SFX de cada evento e aplica as ações que valem
// para qualquer template: carimbo-vermelho/verde, tremer, zoom-in, brilho, lupa,
// relogio-girando, sirene, riscar. Ações específicas (destacar-2, card-3, contar...)
// são tratadas pelo próprio template, que recebe os mesmos `eventos`.
export const Acoes = ({ eventos = [], children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tremer = frameDe(eventos, "tremer");
  const shakeT = tremer === null ? -1 : frame - tremer;
  const shake = shakeT >= 0 && shakeT < 14 ? Math.sin(shakeT * 2.4) * (14 - shakeT) * 1.6 : 0;

  const zoom = 1 + 0.12 * progresso(frame, fps, frameDe(eventos, "zoom-in"), { damping: 18 });

  const brilho = frameDe(eventos, "brilho");
  const flash =
    brilho === null || frame < brilho
      ? 0
      : interpolate(frame - brilho, [0, 3, 18], [0, 0.7, 0], { extrapolateRight: "clamp" });

  const sirene = frameDe(eventos, "sirene");
  const alerta = sirene !== null && frame >= sirene ? (Math.sin((frame - sirene) / 3) + 1) / 2 : 0;

  const riscar = progresso(frame, fps, frameDe(eventos, "riscar"), { damping: 20 });

  return (
    <AbsoluteFill>
      {eventos.map((e, i) => (
        <Sfx key={i} name={sfxDaAcao(e.acao)} atFrame={e.frame} />
      ))}
      <AbsoluteFill style={{ transform: `translateX(${shake}px) scale(${zoom})` }}>{children}</AbsoluteFill>

      {riscar > 0 ? (
        <div
          style={{
            position: "absolute",
            left: "18%",
            top: "47%",
            height: 18,
            width: `${64 * riscar}%`,
            borderRadius: 9,
            background: colors.red,
            boxShadow: `0 0 30px ${colors.red}`,
            transform: "rotate(-4deg)",
          }}
        />
      ) : null}
      <Carimbo frame={frame} fps={fps} inicio={frameDe(eventos, "carimbo-vermelho")} cor={colors.red} texto="✕ Não" />
      <Carimbo frame={frame} fps={fps} inicio={frameDe(eventos, "carimbo-verde")} cor={colors.green} texto="✓ Ok" />
      <Emoji frame={frame} fps={fps} inicio={frameDe(eventos, "lupa")}>🔍</Emoji>
      <Emoji frame={frame} fps={fps} inicio={frameDe(eventos, "relogio-girando")} girar>
        ⏰
      </Emoji>
      {alerta > 0 ? (
        <AbsoluteFill style={{ boxShadow: `inset 0 0 220px ${colors.red}`, opacity: alerta }} />
      ) : null}
      {flash > 0 ? (
        <AbsoluteFill
          style={{ background: `radial-gradient(circle, ${colors.gold}, transparent 70%)`, opacity: flash }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
