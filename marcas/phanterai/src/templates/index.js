import { TituloImpacto } from "./TituloImpacto";
import { ChecklistCards } from "./ChecklistCards";
import { Contador } from "./Contador";
import { GraficoBarras } from "./GraficoBarras";
import { StudioMockup } from "./StudioMockup";
import { Comparacao } from "./Comparacao";
import { ListaNumerada } from "./ListaNumerada";
import { Analogia } from "./Analogia";
import { Print } from "./Print";
import { GravacaoTela } from "./GravacaoTela";
import { Cta } from "./Cta";

// Nome do template no roteiro/timeline.json -> componente de cena.
// Template novo: adicione o arquivo em src/templates/ e registre aqui.
export const TEMPLATES = {
  "titulo-impacto": TituloImpacto,
  "checklist-cards": ChecklistCards,
  contador: Contador,
  "grafico-barras": GraficoBarras,
  "studio-mockup": StudioMockup,
  comparacao: Comparacao,
  "lista-numerada": ListaNumerada,
  analogia: Analogia,
  print: Print,
  "gravacao-tela": GravacaoTela,
  cta: Cta,
};
