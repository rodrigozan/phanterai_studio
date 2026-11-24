#!/usr/bin/env node
// node scripts/zanathos-ep2-render.mjs <parte|still:parte:segundo[,segundo...]> [--scale=0.5]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const [alvo, ...resto] = process.argv.slice(2);
const scale = Number((resto.find((a) => a.startsWith("--scale=")) || "--scale=1").split("=")[1]);
const pub = "/tmp/pub-zanathos-ep2";
fs.rmSync(pub, { recursive: true, force: true });
for (const rel of ["sfx", "rodzandonadi/marca", "rodzandonadi/episodes/zanathos-ep2", "rodzandonadi/episodes/zanathos-ep1", "rodzandonadi/episodes/zanathos-cap1"]) {
  fs.mkdirSync(path.dirname(`${pub}/${rel}`), { recursive: true });
  fs.symlinkSync(path.resolve("public", rel), `${pub}/${rel}`);
}
const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.jsx"), publicDir: pub });
const out = "out/rodzandonadi/zanathos-ep2";
fs.mkdirSync(out, { recursive: true });
if (alvo.startsWith("still:")) {
  const [, secs] = alvo.split(":");
  const p = "";
  const comp = await selectComposition({ serveUrl, id: `ZanathosEp2` });
  for (const s of secs.split(",")) {
    await renderStill({ composition: comp, serveUrl, frame: Math.round(Number(s) * 30), output: `${out}/qa-${s}.png`, scale });
  }
  console.log("stills ok");
} else {
  const comp = await selectComposition({ serveUrl, id: `ZanathosEp2` });
  let ultimo = -1;
  const saida = `${out}/zanathos-ep2${scale < 1 ? "-rascunho" : ""}.mp4`;
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: saida, scale, concurrency: 2, crf: scale < 1 ? 26 : 18,
    onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p % 10 === 0 && p !== ultimo) { ultimo = p; console.log(`${p}%`); } } });
  console.log("pronto:", saida);
}
