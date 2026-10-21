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
export const SFX_TRECHO = {
  pop: { inicio: 0.19, duracao: 0.4, volume: 0.8 },
  ding: { inicio: 0, duracao: 1.0, volume: 0.8 },
  whoosh: { inicio: 0, duracao: 0.5, volume: 0.8 },
  coin: { inicio: 3.28, duracao: 1.2, volume: 0.8 },
  error: { inicio: 0, duracao: 0.5, volume: 0.5 },
  riser: { inicio: 0.9, duracao: 1.5, volume: 0.8 },
};
