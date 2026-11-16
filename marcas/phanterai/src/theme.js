export const colors = {
  bgInner: "#140B2E",
  bgOuter: "#05040C",
  violet: "#8B5CF6",
  violetLight: "#C084FC",
  gold: "#FBBF24",
  red: "#FB4B6B",
  green: "#34D399",
  text: "#F5F3FF",
};

export const contextColor = (context) => {
  switch (context) {
    case "erro":
    case "ruim":
      return colors.red;
    case "sucesso":
    case "bom":
      return colors.green;
    case "destaque":
      return colors.gold;
    default:
      return colors.violet;
  }
};

export const fonts = {
  family: "Poppins",
  weight: "900",
};

// Música de fundo a -24dB sob a voz (10^(-24/20) em amplitude linear) e a -14dB nas pausas da
// narração (timeline.pausas, gerado pelo align.js).
export const MUSIC_VOLUME = 0.063;
export const MUSIC_VOLUME_PAUSA = 0.2;

export const POSES = [
  "feliz",
  "triste",
  "surpresa",
  "comemorando",
  "pensando",
  "apontando",
];

export const SFX = ["pop", "ding", "whoosh", "coin", "error", "riser"];

// Trecho de cada arquivo de public/sfx/ que toca, em segundos: começa em `inicio` (pula o
// silêncio inicial do arquivo) e dura no máximo `duracao`, com fade no fim. Medido nos
// arquivos atuais com ffmpeg silencedetect - trocou um arquivo, meça e ajuste aqui.
// `volume` é linear (1 = arquivo original): o error ficou alto demais sob a voz no preview.
// Cinco opções por família: original e quatro alternativas Mixkit.
// A escolha usa nome + frame do evento, então é variada e reproduzível no render.
export const SFX_VARIANTS = {
  pop: ["pop.mp3", "variants/pop/pop-02.mp3", "variants/pop/pop-03.mp3", "variants/pop/pop-04.mp3", "variants/pop/pop-05.mp3"],
  ding: ["ding.mp3", "variants/ding/ding-02.mp3", "variants/ding/ding-03.mp3", "variants/ding/ding-04.mp3", "variants/ding/ding-05.mp3"],
  whoosh: ["whoosh.mp3", "variants/whoosh/whoosh-02.mp3", "variants/whoosh/whoosh-03.mp3", "variants/whoosh/whoosh-04.mp3", "variants/whoosh/whoosh-05.mp3"],
  coin: ["coin.mp3", "variants/coin/coin-02.mp3", "variants/coin/coin-03.mp3", "variants/coin/coin-04.mp3", "variants/coin/coin-05.mp3"],
  error: ["error.mp3", "variants/error/error-02.mp3", "variants/error/error-03.mp3", "variants/error/error-04.mp3", "variants/error/error-05.mp3"],
  riser: ["riser.mp3", "variants/riser/riser-02.mp3", "variants/riser/riser-03.mp3", "variants/riser/riser-04.mp3", "variants/riser/riser-05.mp3"],
};

// Volume final de todo SFX (linear, 1 = nível de referência). Cada arquivo ainda recebe o
// `ganho` de sfx-trechos.json, que iguala o nível entre as opções (mesmo volume percebido).
export const SFX_VOLUME = 0.3;

// Início, duração e ganho de CADA arquivo (original e variações), medidos com ffmpeg por
// `node scripts/measure-sfx.js`. Trocou/adicionou arquivo em public/sfx? Rode o script de novo.
export { default as SFX_TRECHO } from "./sfx-trechos.json";
