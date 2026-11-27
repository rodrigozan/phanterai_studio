#!/usr/bin/env node
// 3 capas (JPEG 1280x720) de um vídeo longo a partir de episodes/long-videos/<slug>/capas.json. Regras em docs/capas.md.
//   node scripts/long-capa.mjs <slug> out/<marca>/long-videos/<slug>/capa.jpg --canal=aprenda|creative [--spec=arq.json] [--amostra]
// Saídas: capa-a.jpg, capa-b.jpg, capa-c.jpg e capa-folha.jpg (as 3 grandes + tamanho de celular, para conferir).
// --amostra: não aplica a regra de repetição nem grava no histórico.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { validar, registrar } from "./capa-regras.mjs";

const [slug, ...resto] = process.argv.slice(2);
const opt = (n) => (resto.find((a) => a.startsWith(`--${n}=`)) || "").split("=").slice(1).join("=") || undefined;
const amostra = resto.includes("--amostra");
const canal = opt("canal");
const MARCA = process.env.MARCA || "phanterai";
const saida = resto.find((a) => !a.startsWith("--")) || `out/${MARCA}/long-videos/${slug}/capa.jpg`;
const HIST = `marcas/${MARCA}/capas-historico.json`;
// cada canal tem o próprio projeto: capa do Aprenda YouTube só sai com a identidade dele
if (canal && (canal === "aprenda") !== (MARCA === "aprendayoutube")) throw new Error("--canal=aprenda exige MARCA=aprendayoutube (e --canal=creative, MARCA=phanterai)");
const ep = `${MARCA}/episodes/long-videos/${slug}`;
const spec = JSON.parse(fs.readFileSync(opt("spec") || `public/${ep}/capas.json`, "utf8"));
if (!amostra) {
  if (!["aprenda", "creative"].includes(canal)) throw new Error("informe --canal=aprenda ou --canal=creative");
  const erros = validar(spec, fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, "utf8")) : [], slug);
  if (erros.length) { console.error("capas recusadas:\n- " + erros.join("\n- ")); process.exit(1); }
}
fs.mkdirSync(path.dirname(saida), { recursive: true });
const pub = `/tmp/pub-capa-${slug}`;
fs.rmSync(pub, { recursive: true, force: true });
for (const rel of [`${MARCA}/pantera`, ep].filter((r) => fs.existsSync(path.resolve("public", r)))) { fs.mkdirSync(path.dirname(`${pub}/${rel}`), { recursive: true }); fs.symlinkSync(path.resolve("public", rel), `${pub}/${rel}`); }
const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.jsx"), publicDir: pub });
const arquivos = [];
for (const [i, capa] of spec.entries()) {
  const letra = "abc"[i];
  const inputProps = { slug, formato: capa.formato, dados: capa.dados || {} };
  const out = saida.replace(/\.jpg$/, `-${letra}.jpg`);
  const composition = await selectComposition({ serveUrl, id: MARCA === "aprendayoutube" ? "AYLongCapa" : "LongCapa", inputProps });
  await renderStill({ composition, serveUrl, output: out, inputProps, imageFormat: "jpeg", jpegQuality: 90 });
  arquivos.push(out);
  console.log(`capa ${letra}: ${capa.formato} -> ${out}`);
}
const folha = saida.replace(/\.jpg$/, "-folha.jpg");
execFileSync("ffmpeg", ["-v", "error", "-y", ...arquivos.flatMap((a) => ["-i", a]), "-filter_complex",
  "[0]split[a][a2];[1]split[b][b2];[2]split[c][c2];[a]scale=426:240[A];[b]scale=426:240[B];[c]scale=426:240[C];[A][B][C]hstack=3[g];[a2]scale=168:94,pad=426:110:129:8:white[x];[b2]scale=168:94,pad=426:110:129:8:white[y];[c2]scale=168:94,pad=426:110:129:8:white[z];[x][y][z]hstack=3[p];[g][p]vstack", "-frames:v", "1", folha]);
console.log("folha:", folha);
if (!amostra) registrar(HIST, slug, canal, spec);
