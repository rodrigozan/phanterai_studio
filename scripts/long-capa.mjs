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
const inputProps = { slug, ...(opt("linha1") && { linha1: opt("linha1") }), ...(opt("linha2") && { linha2: opt("linha2") }), ...(opt("size1") && { size1: opt("size1") }), ...(opt("pose") && { pose: opt("pose") }), ...(opt("shot") && { shot: opt("shot") }), ...(opt("prompt") && { prompt: opt("prompt") }) };
const composition = await selectComposition({ serveUrl, id: "LongCapa", inputProps });
await renderStill({ composition, serveUrl, output: saida, inputProps, imageFormat: "jpeg", jpegQuality: 88 });
console.log("capa:", saida, (fs.statSync(saida).size / 1e6).toFixed(2) + "MB");
