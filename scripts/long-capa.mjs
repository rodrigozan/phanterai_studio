#!/usr/bin/env node
// Capa de vídeo longo (JPEG 1280x720).  node scripts/long-capa.mjs <slug> [saida.jpg] [--linha1=...] [--linha2=...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const [slug, ...resto] = process.argv.slice(2);
const opt = (n) => (resto.find((a) => a.startsWith(`--${n}=`)) || "").split("=").slice(1).join("=") || undefined;
const saida = resto.find((a) => !a.startsWith("--")) || `out/phanterai/long-videos/${slug}-capa.jpg`;
const MARCA = process.env.MARCA || "phanterai";
fs.mkdirSync(path.dirname(saida), { recursive: true });
const pub = `/tmp/pub-capa-${slug}`;
fs.rmSync(pub, { recursive: true, force: true });
for (const rel of [`${MARCA}/pantera`, `${MARCA}/episodes/long-videos/${slug}`]) { fs.mkdirSync(path.dirname(`${pub}/${rel}`), { recursive: true }); fs.symlinkSync(path.resolve("public", rel), `${pub}/${rel}`); }
const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.jsx"), publicDir: pub });
const inputProps = { slug, ...(opt("linha1") && { linha1: opt("linha1") }), ...(opt("linha2") && { linha2: opt("linha2") }), ...(opt("size1") && { size1: opt("size1") }), ...(opt("pose") && { pose: opt("pose") }), ...(opt("antes") && { antes: opt("antes") }), ...(opt("depois") && { depois: opt("depois") }), ...(opt("shot") && { shot: opt("shot") }), ...(opt("prompt") && { prompt: opt("prompt") }) };
// --variantes=a,b,c renderiza as 3 versões de alto clique de uma vez (saida-a.jpg, saida-b.jpg, saida-c.jpg)
const variantes = (opt("variantes") || "").split(",").filter(Boolean);
for (const v of variantes.length ? variantes : [undefined]) {
  const props = v ? { ...inputProps, variante: v } : inputProps;
  const out = v ? saida.replace(/\.jpg$/, `-${v}.jpg`) : saida;
  const composition = await selectComposition({ serveUrl, id: "LongCapa", inputProps: props });
  await renderStill({ composition, serveUrl, output: out, inputProps: props, imageFormat: "jpeg", jpegQuality: 90 });
  console.log("capa:", out, (fs.statSync(out).size / 1e6).toFixed(2) + "MB");
}
