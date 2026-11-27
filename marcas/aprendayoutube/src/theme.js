// Identidade do Aprenda YouTube: a do banner do canal (marcas/aprendayoutube/identidade/banner-canal.png).
// Cores amostradas do próprio arquivo. Nada daqui é compartilhado com a PhanterAI.
import { loadFont as loadOpenSans } from "@remotion/google-fonts/OpenSans";
import { loadFont as loadLexend } from "@remotion/google-fonts/Lexend";

export const MAGENTA = "#9A015C"; // fundo
export const AMARELO = "#DFD011"; // forma orgânica e destaques
export const PLAY = "#E6335D"; // botão de play
export const BRANCO = "#FFFFFF";

export const colors = {
  fundo: MAGENTA,
  fundoEscuro: "#4E002F", // magenta escurecido: contorno de texto, vinheta, base de cartão
  cartao: "#720144",
  brilho: "#C1127A",
  amarelo: AMARELO,
  play: PLAY,
  verde: "#5BE3A0", // só semântico (certo/sucesso)
  text: BRANCO,
};

// Sans em negrito dos textos do banner.
export const FAMILIA = loadOpenSans("normal", { weights: ["600", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
// Palavra "youtube" e "Vídeos novos às Sextas": sans geométrica larga em negrito.
export const DISPLAY = loadLexend("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const FONT = { fontFamily: FAMILIA, fontWeight: 800, lineHeight: 1.08, textAlign: "center" };

// Mesmas faixas de música do studio, em cópia própria: public/aprendayoutube/music/. Volume 17%.
export const MUSIC_VOLUME = 0.17;
