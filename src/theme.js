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

// Música de fundo a -24dB sob a voz (10^(-24/20) em amplitude linear).
export const MUSIC_VOLUME = 0.063;

export const POSES = [
  "feliz",
  "triste",
  "surpresa",
  "comemorando",
  "pensando",
  "apontando",
];

export const SFX = ["pop", "ding", "whoosh", "coin", "error", "riser"];
