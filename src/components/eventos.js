import { spring, staticFile } from "remotion";

// Eventos chegam do timeline.json como { ao, acao, frame }, com frame relativo ao início
// da cena (= frame local dentro da <Sequence> da cena).

// Frame do primeiro evento com essa acao; null se a cena não tiver esse evento.
export const frameDe = (eventos = [], acao) => {
  const evento = eventos.find((e) => e.acao === acao);
  return evento ? evento.frame : null;
};

// 0 antes do evento, spring 0 -> 1 a partir dele. Sem evento (inicio null): 0.
export const progresso = (frame, fps, inicio, config = { damping: 14 }) =>
  inicio === null || frame < inicio ? 0 : spring({ frame: frame - inicio, fps, config });

// Som tocado em cada evento. Toda ação visual tem SFX sincronizado, então o mapeamento
// fica aqui em vez de espalhado pelos templates.
export const sfxDaAcao = (acao) => {
  if (/^(carimbo-vermelho|riscar|tremer|sirene)/.test(acao)) return "error";
  if (/^(carimbo-verde|brilho|check-|destacar-)/.test(acao)) return "ding";
  if (acao === "contar") return "coin";
  if (acao === "relogio-girando") return "riser";
  if (/^(zoom-|embaralhar|multiplicar-|esvaziar|crescer-|entrar-thumbs|clonar-)/.test(acao)) return "whoosh";
  return "pop";
};

// Assets do episódio (prints, gravações) ficam em public/episodes/<slug>/.
export const arquivoDoEpisodio = (slug, nome) => staticFile(`episodes/${slug}/${nome}`);

// Números no padrão brasileiro: 20000000 -> "20.000.000".
export const numeroBR = (n) => Math.round(n).toLocaleString("pt-BR");
