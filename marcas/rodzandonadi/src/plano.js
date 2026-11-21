import { CENAS } from "./roteiro-dados.js";

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

const achar = (words, frase, desde) => {
  const alvo = frase.split(/\s+/).map(norm);
  for (let i = 0; i < words.length; i++) {
    if (words[i].s < desde - 3) continue;
    if (alvo.every((a, k) => words[i + k] && norm(words[i + k].w) === a)) return i;
  }
  return -1;
};

const quando = (cena, frase, desde) => {
  const i = achar(cena.words, frase, desde);
  if (i < 0) throw new Error(`${cena.id}: âncora não encontrada: "${frase}" a partir do frame ${desde}`);
  return Math.max(0, cena.words[i].s - 3);
};

export const montarPlano = (timeline) => {
  const cenas = timeline.cenas;
  return CENAS.map((def) => {
    const cena = cenas.find((c) => c.id === def.id);
    if (!cena) throw new Error(`timeline sem a cena ${def.id}`);
    const dur = cena.end - cena.start;
    let cursor = 0;
    const starts = def.shots.map((s) => {
      const f = s.de === 0 ? 0 : quando(cena, s.de, cursor);
      cursor = f;
      return f;
    });
    const shots = def.shots.map((s, i) => {
      const fim = i < def.shots.length - 1 ? starts[i + 1] : dur;
      const marcas = {};
      Object.entries(s.marcas ?? {}).forEach(([k, frase]) => { marcas[k] = quando(cena, frase, starts[i]) - starts[i]; });
      const ate = s.ate ? quando(cena, s.ate, starts[i]) - starts[i] : undefined;
      return { ...s, inicio: starts[i], dur: fim - starts[i], marcas, ate };
    });
    const etiquetas = (def.etiquetas ?? []).map((e) => ({ ...e, inicio: quando(cena, e.de, 0) }));
    return { id: def.id, etapa: def.etapa, inicio: cena.start, dur, words: cena.words, shots, etiquetas };
  });
};
