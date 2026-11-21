const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

export const achar = (words, frase, apos = -1, ate = words.length) => {
  const alvo = frase.split(/\s+/).map(norm);
  for (let i = apos + 1; i < ate; i++) {
    if (alvo.every((a, k) => words[i + k] && norm(words[i + k].w) === a)) return i;
  }
  return -1;
};

export const resolver = (words, ancora, dur) => {
  if (typeof ancora === "number") return Math.round(ancora * dur);
  const [frase, apos] = Array.isArray(ancora) ? ancora : [ancora, null];
  const base = apos ? achar(words, apos) : -1;
  const i = achar(words, frase, base);
  if (i < 0) throw new Error(`âncora não encontrada: "${frase}"${apos ? ` após "${apos}"` : ""}`);
  return Math.max(0, words[i].s - 3);
};
