#!/usr/bin/env node
// Quadros de conferência de um vídeo longo: um still por cena (ou só as listadas).
//   node scripts/long-stills.mjs <slug> <pasta-de-saida> [C01 C07 ...] [--pos=0.7]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const [slug, out, ...resto] = process.argv.slice(2);
const pos = Number((resto.find((a) => a.startsWith("--pos=")) || "--pos=0.7").split("=")[1]);
const ids = resto.filter((a) => /^C\d/.test(a));
const MARCA = process.env.MARCA || "phanterai";
const COMP = MARCA === "aprendayoutube" ? "AYLongVideo" : "LongVideo"; // cada marca tem a própria composição e identidade
const tl = JSON.parse(fs.readFileSync(`public/${MARCA}/episodes/long-videos/${slug}/timeline.json`, "utf8"));
fs.mkdirSync(out, { recursive: true });
// Pasta pública mínima (só o que o vídeo usa): bundle rápido e sem os arquivos de outros episódios.
const pub = `/tmp/pub-long-${slug}`;
fs.rmSync(pub, { recursive: true, force: true });
for (const rel of ["sfx", `${MARCA}/music`, `${MARCA}/pantera`, `${MARCA}/episodes/long-videos/${slug}`].filter((r) => fs.existsSync(path.resolve("public", r)))) {
  fs.mkdirSync(path.dirname(`${pub}/${rel}`), { recursive: true });
  fs.symlinkSync(path.resolve("public", rel), `${pub}/${rel}`);
}
const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.jsx"), publicDir: pub });
const comp = await selectComposition({ serveUrl, id: COMP, inputProps: { slug } });
for (const c of tl.scenes) {
  if (ids.length && !ids.includes(c.id)) continue;
  const frame = Math.min(comp.durationInFrames - 1, Math.round(c.startFrame + (c.endFrame - c.startFrame) * pos));
  await renderStill({ composition: comp, serveUrl, output: `${out}/${c.id}.png`, frame, inputProps: { slug }, scale: 0.5 });
  console.log(c.id, frame);
}
