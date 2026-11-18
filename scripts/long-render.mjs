#!/usr/bin/env node
// Renderiza um vídeo longo.   node scripts/long-render.mjs <slug> [--scale=0.5] [--saida=arquivo.mp4]
// Usa uma pasta pública mínima (só o que o vídeo usa) para o bundle ser rápido.
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const [slug, ...resto] = process.argv.slice(2);
const opt = (n, d) => (resto.find((a) => a.startsWith(`--${n}=`)) || `--${n}=${d}`).split("=")[1];
const scale = Number(opt("scale", 1));
const MARCA = process.env.MARCA || "phanterai";
const saida = opt("saida", `out/${MARCA}/long-videos/${slug}${scale < 1 ? "-rascunho" : ""}.mp4`);
fs.mkdirSync(path.dirname(saida), { recursive: true });
const pub = `/tmp/pub-long-${slug}`;
fs.rmSync(pub, { recursive: true, force: true });
for (const rel of ["sfx", `${MARCA}/music`, `${MARCA}/pantera`, `${MARCA}/episodes/long-videos/${slug}`]) {
  fs.mkdirSync(path.dirname(`${pub}/${rel}`), { recursive: true });
  fs.symlinkSync(path.resolve("public", rel), `${pub}/${rel}`);
}
const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.jsx"), publicDir: pub });
const comp = await selectComposition({ serveUrl, id: "LongVideo", inputProps: { slug } });
let ultimo = -1;
await renderMedia({
  composition: comp, serveUrl, codec: "h264", outputLocation: saida, inputProps: { slug }, scale, concurrency: 2, offthreadVideoCacheSizeInBytes: 200 * 1024 * 1024, crf: scale < 1 ? 26 : 20,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p % 5 === 0 && p !== ultimo) { ultimo = p; console.log(`${p}%`); } },
});
console.log("pronto:", saida);
