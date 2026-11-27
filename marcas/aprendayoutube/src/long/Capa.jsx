// Capa (1280x720) de um vídeo longo. Escolhe um formato da biblioteca ou a capa "livre" desenhada para aquele vídeo
// (capas-livres/<slug>.jsx). Não existe formato padrão de propósito: ver docs/capas.md (a biblioteca daqui é a do Aprenda YouTube).
import { AbsoluteFill } from "remotion";
import { FORMATOS } from "./CapaFormatos";

const livres = require.context("./capas-livres", false, /\.jsx$/);

export const LongCapa = ({ slug, formato, dados = {} }) => {
  if (!formato) return <AbsoluteFill />;
  const C = formato === "livre" ? livres(`./${slug}.jsx`).default : FORMATOS[formato]?.C;
  if (!C) throw new Error(`formato de capa desconhecido: ${formato}`);
  return <AbsoluteFill style={{ overflow: "hidden" }}><C slug={slug} {...dados} /></AbsoluteFill>;
};
