// Regras de variedade das capas (Rod, 27/11/2026: "não dá para sempre gerar o mesmo modelo").
// Um histórico por marca (marcas/<marca>/capas-historico.json): cada canal tem projeto e identidade próprios.
import fs from "node:fs";
import { dirname } from "node:path";

export const FORMATOS = ["citacao", "versus", "post", "escalada", "cartaz", "metrica", "grafico", "etapas", "resultado", "grade", "gigante", "marcatexto", "velho-novo", "notificacao", "livre"];
const TOM = { citacao: "neutro", metrica: "neutro", versus: "cor", gigante: "cor", marcatexto: "cor", notificacao: "cor", post: "claro", grade: "claro", "velho-novo": "claro", escalada: "escuro", cartaz: "escuro", grafico: "escuro", etapas: "escuro", resultado: "foto" };
const JANELA_A = 6; // a capa que sobe (A) não repete o formato dos últimos 6 vídeos
const JANELA_BC = 2; // B e C não repetem nada dos últimos 2 vídeos

export const validar = (spec, historico, slug) => {
  if (!Array.isArray(spec) || spec.length !== 3) return ["capas.json precisa ser uma lista com exatamente 3 capas (A, B, C)"];
  const f = spec.map((c) => c.formato);
  const erros = f.filter((x) => !FORMATOS.includes(x)).map((x) => `formato desconhecido: ${x}`);
  if (new Set(f).size !== 3) erros.push("as 3 capas precisam de 3 formatos diferentes");
  if (!f.includes("livre")) erros.push(`uma das 3 tem que ser "livre": desenhada do zero para este vídeo em capas-livres/${slug}.jsx`);
  const toms = f.filter((x) => TOM[x]).map((x) => TOM[x]);
  if (new Set(toms).size !== toms.length) erros.push(`as capas da biblioteca precisam de fundos diferentes (vieram: ${toms.join(", ")})`);
  const antes = historico.filter((h) => h.slug !== slug);
  const recentesA = antes.slice(-JANELA_A).map((h) => h.formatos[0]);
  if (f[0] !== "livre" && recentesA.includes(f[0])) erros.push(`A = "${f[0]}" já foi capa principal recente. Recentes: ${recentesA.join(", ")}`);
  const recentes = new Set(antes.slice(-JANELA_BC).flatMap((h) => h.formatos));
  for (const x of f.slice(1)) if (x !== "livre" && recentes.has(x)) erros.push(`"${x}" apareceu num dos ${JANELA_BC} últimos vídeos; escolha outro`);
  return erros;
};

export const registrar = (arquivo, slug, canal, spec) => {
  const h = (fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, "utf8")) : []).filter((x) => x.slug !== slug);
  h.push({ slug, canal, formatos: spec.map((c) => c.formato) });
  fs.mkdirSync(dirname(arquivo), { recursive: true });
  fs.writeFileSync(arquivo, JSON.stringify(h, null, 1) + "\n");
};
