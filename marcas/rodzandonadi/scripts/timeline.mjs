import fs from "fs";
import path from "path";

const slug = process.argv[2];
if (!slug) { console.error("uso: node marcas/rodzandonadi/scripts/timeline.mjs <slug>"); process.exit(2); }
const dir = path.join("public", "rodzandonadi", "episodes", "long-videos", slug);
const roteiro = JSON.parse(fs.readFileSync(path.join(dir, "roteiro.json"), "utf8"));
const FPS = 30, GAP = 0.35, TAIL = 4;
let t = 0;
const cenas = roteiro.cenas.map((c) => {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "voz", `${c.id}.json`), "utf8"));
  const start = Math.round(t * FPS);
  const end = Math.round((t + meta.dur) * FPS);
  const words = meta.words.map((w) => ({ w: w.w, s: Math.round((t + w.s) * FPS) - start, e: Math.round((t + w.e) * FPS) - start }));
  t += meta.dur + GAP;
  return { id: c.id, start, end, words };
});
const total = cenas[cenas.length - 1].end + TAIL * FPS;
cenas.forEach((c, i) => { if (i < cenas.length - 1) c.end = cenas[i + 1].start; else c.end = total; });
fs.writeFileSync(path.join(dir, "timeline.json"), JSON.stringify({ fps: FPS, total, cenas }));
console.log("frames", total, (total / FPS).toFixed(1) + "s");
