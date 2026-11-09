// Fundo da vinheta de capítulo (title-demote-to-label). Módulo puro: sem Remotion nem tema, testável em node.
//
// Causa do defeito do piloto horizontal (longo-r3, 2026-11-09): o título central entrava sobre um scrim
// translúcido (70%), e o texto do próprio corte (contador "100 DIAS ATÉ…") continuava legível por baixo,
// disputando a leitura com "Capítulo 02 / Receita". Regra: enquanto o título ocupa o centro, o fundo do
// capítulo é opaco, na cor de fundo da própria série (`chapterBackdrop` em looks.js); ele só some junto com
// o rebaixamento do título.
// fadeIn: o fundo entra em 4 quadros e o texto só começa depois (textAt), nunca sobre o corte visível.
// clearAt: fração do rebaixamento em que o título já saiu do centro; antes disso o fundo segue opaco.
export const CHAPTER = { fadeIn: 4, textAt: 4, demoteAt: 36, demoteDur: 26, clearAt: 0.5 };

// d = progresso do rebaixamento do título (0 no centro, 1 no canto).
export const chapterBackdropOpacity = (frame, d) => {
  const entry = Math.min(1, Math.max(0, frame / CHAPTER.fadeIn));
  const exit = d <= CHAPTER.clearAt ? 0 : Math.min(1, (d - CHAPTER.clearAt) / (1 - CHAPTER.clearAt));
  return entry * (1 - exit);
};

// Recusa fundo translúcido: cor com alfa, `transparent` ou gradiente com parada translúcida.
export const assertOpaqueBackdrop = (lookName, bg) => {
  if (typeof bg !== "string" || !bg.trim()) throw new Error(`ShotcraftFinish: look "${lookName}" sem chapterBackdrop`);
  if (/rgba|hsla|transparent|#[0-9a-f]{8}\b|#[0-9a-f]{4}\b|\/\s*0?\.\d/i.test(bg)) throw new Error(`ShotcraftFinish: chapterBackdrop de "${lookName}" precisa ser opaco (${bg})`);
  return bg;
};
