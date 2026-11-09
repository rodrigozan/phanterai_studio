// Ponte para o video-shotcraft (/root/video-shotcraft, rev 43bd349). Nada aqui é cópia: os primitivos de
// tempo, as curvas calibradas e o motion blur vêm direto do código das demos e da lib do Shotcraft, para que
// os parâmetros "已知坑/命门" dos cartões não sejam reescritos à mão. O remotion.config.js do studio resolve
// `react`/`remotion` desses arquivos pelo node_modules do studio.
export { EASE, ramp, mix, velocity, SpeedBlur, bezier } from "../../../video-shotcraft/demos/_fixtures/Polish";
export { dampedSettle } from "../../../video-shotcraft/assets/lib/helpers/motion";
export { mulberry32 } from "../../../video-shotcraft/assets/lib/helpers/rand";

// Revisão do Shotcraft que estes imports esperam; o finish.mjs grava a revisão real no manifesto.
export const SHOTCRAFT_REV = "43bd349a136651865ecfa6ea1cf012f6e957d304";
