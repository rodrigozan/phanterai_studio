import path from "path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const slug = process.argv[2];
const frames = process.argv.slice(3).map(Number);
const out = path.resolve("out", "rodzandonadi", slug, "stills");
const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.jsx"), publicDir: process.env.PUBLIC_DIR });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "RodLivroIA", inputProps: { slug } });
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: f, output: path.join(out, `f${String(f).padStart(5, "0")}.png`), inputProps: { slug }, scale: 0.5 });
  console.log("ok", f);
}
