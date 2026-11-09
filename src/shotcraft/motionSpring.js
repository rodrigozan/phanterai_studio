// Skills de motion (`motion` e `apple-design`) aplicadas ao Remotion.
// A skill `motion` define a mola por { visualDuration, bounce } (o mesmo contrato do `type: "spring"` do Motion);
// a `apple-design` fixa os valores: mola padrão de UI criticamente amortecida (bounce 0, resposta 0,3–0,4 s) e
// um pouco de bounce (~0,2, damping ~0,8) só quando o gesto carrega impulso. O Remotion não roda o Motion
// (é tempo real, não por quadro), então convertemos o contrato para massa/rigidez/amortecimento — uma aproximação por sistema amortecido
// dos parâmetros do Motion — e avaliamos com `spring()` do Remotion, que é puro por quadro (render determinístico).
import { spring } from "remotion";

export const MOTION = {
  // apple-design quick-reference: "Default UI spring | damping 1.0, response 0.3–0.4"
  ui: { visualDuration: 0.4, bounce: 0 },
  // apple-design: bounce só quando o gesto carregou impulso (o soco de câmera carrega)
  momentum: { visualDuration: 0.35, bounce: 0.2 },
};

export const springConfig = ({ visualDuration, bounce }) => {
  const root = (2 * Math.PI) / (visualDuration * 1.2);
  const stiffness = root * root;
  const dampingRatio = Math.min(1, Math.max(0.05, 1 - bounce));
  return { mass: 1, stiffness, damping: 2 * dampingRatio * Math.sqrt(stiffness), overshootClamping: false };
};

export const motionSpring = (frame, fps, preset = MOTION.ui, delay = 0) =>
  spring({ frame: frame - delay, fps, config: springConfig(preset) });
