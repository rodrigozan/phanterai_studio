#!/usr/bin/env node
// node scripts/zanathos-cap1-render.mjs <parte|still:parte:segundo[,segundo...]> [--scale=0.5]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const [alvo, ...resto] = process.argv.slice(2);
const scale = Number((resto.find((a) => a.startsWith("--scale=")) || "--scale=1").split("=")[1]);
const pub = "/tmp/pub-zanathos-cap1";
fs.rmSync(pub, { recursive: true, force: true });
for (const rel of ["sfx", "rodzandonadi/marca", "rodzandonadi/episodes/zanathos-cap1"]) {
  fs.mkdirSync(path.dirname(`${pub}/${rel}`), { recursive: true });
  fs.symlinkSync(path.resolve("public", rel), `${pub}/${rel}`);
}
const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.jsx"), publicDir: pub });
const out = "out/rodzandonadi/zanathos-cap1";
fs.mkdirSync(out, { recursive: true });
if (alvo.startsWith("still:")) {
  const [, p, secs] = alvo.split(":");
  const comp = await selectComposition({ serveUrl, id: `ZanathosCap1P${p}` });
  for (const s of secs.split(",")) {
    await renderStill({ composition: comp, serveUrl, frame: Math.round(Number(s) * 30), output: `${out}/qa-p${p}-${s}.png`, scale });
  }
  console.log("stills ok");
} else {
  const comp = await selectComposition({ serveUrl, id: `ZanathosCap1P${alvo}` });
  let ultimo = -1;
  const saida = `${out}/zanathos-cap1-parte${alvo}${scale < 1 ? "-rascunho" : ""}.mp4`;
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: saida, scale, concurrency: 2, crf: scale < 1 ? 26 : 18,
    onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p % 10 === 0 && p !== ultimo) { ultimo = p; console.log(`${p}%`); } } });
  console.log("pronto:", saida);
}
