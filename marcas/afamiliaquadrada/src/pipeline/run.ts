import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { loadEpisode, paths, ROOT } from "./paths";
import { runTts } from "./tts";
import { runTiming } from "./timing";
import { runAudit } from "./audit";

const [slug, ...flags] = process.argv.slice(2);
const has = (f: string) => flags.includes(f);

async function main() {
  if (!slug) throw new Error("uso: yarn familiaquadrada <slug> [--validate] [--no-render] [--preview]");
  const ep = loadEpisode(slug);
  console.log(`scenes.json ok: ${ep.scenes.length} cenas, ${ep.scenes.flatMap((s) => s.lines).length} falas`);
  if (has("--validate")) return;
  await runTts(slug);
  runTiming(slug);
  if (has("--no-render")) return;
  const p = paths(slug);
  fs.mkdirSync(path.dirname(p.out), { recursive: true });
  const args = ["remotion", "render", "src/Root.jsx", "ShortFamiliaQuadrada", p.out, `--props=${p.props}`, "--log=error", "--concurrency=3"];
  if (has("--preview")) args.push("--scale=0.5");
  const r = spawnSync("yarn", args, { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) throw new Error("render falhou");
  const audit = runAudit(slug);
  process.exitCode = audit.approved ? 0 : 2;
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
