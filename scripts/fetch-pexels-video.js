#!/usr/bin/env node
// Baixa vídeos horizontais do Pexels para um vídeo longo.
//   node scripts/fetch-pexels-video.js <slug> nome=termo de busca [nome=termo ...]
// Salva em public/<marca>/episodes/long-videos/<slug>/pexels/<nome>.mp4 e registra créditos em pexels-manifest.json.
const fs = require("node:fs/promises");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const MARCA = process.env.MARCA || "phanterai";
(async () => {
  const [slug, ...pares] = process.argv.slice(2);
  if (!slug || !pares.length) { console.error("uso: node scripts/fetch-pexels-video.js <slug> nome=termo ..."); process.exit(2); }
  const envTxt = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const key = (envTxt.match(/^\s*PX_API_KEY\s*=\s*(.*?)\s*$/m) || [])[1]?.replace(/^(["'])(.*)\1$/, "$2");
  if (!key) throw new Error("PX_API_KEY ausente no .env");
  const dir = path.join(ROOT, "public", MARCA, "episodes", "long-videos", slug, "pexels");
  await fs.mkdir(dir, { recursive: true });
  const manifestPath = path.join(path.dirname(dir), "pexels-manifest.json");
  const manifest = await fs.readFile(manifestPath, "utf8").then(JSON.parse).catch(() => ({ videos: [] }));
  const usados = new Set(manifest.videos.map((v) => v.id));
  for (const par of pares) {
    const [nome, ...q] = par.split("=");
    const termo = q.join("=");
    const url = new URL("https://api.pexels.com/videos/search");
    url.searchParams.set("query", termo); url.searchParams.set("orientation", "landscape"); url.searchParams.set("size", "medium"); url.searchParams.set("per_page", "15");
    const r = await fetch(url, { headers: { Authorization: key } });
    if (!r.ok) throw new Error(`Pexels HTTP ${r.status} em '${termo}'`);
    const { videos } = await r.json();
    const v = videos.find((x) => !usados.has(x.id) && x.duration >= 8 && x.duration <= 45 && x.video_files.some((f) => f.width >= 1280 && f.width <= 1920 && f.file_type === "video/mp4"));
    if (!v) { console.log(nome, "sem resultado para", termo); continue; }
    const f = v.video_files.filter((x) => x.width >= 1280 && x.width <= 1920 && x.file_type === "video/mp4").sort((a, b) => a.width - b.width)[0];
    const bin = Buffer.from(await (await fetch(f.link)).arrayBuffer());
    await fs.writeFile(path.join(dir, `${nome}.mp4`), bin);
    usados.add(v.id);
    manifest.videos.push({ nome, id: v.id, termo, duracao: v.duration, largura: f.width, autor: v.user?.name, pagina: v.url });
    console.log(nome, v.id, v.duration + "s", f.width + "px", (bin.length / 1e6).toFixed(1) + "MB");
  }
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
})().catch((e) => { console.error(e.message); process.exitCode = 1; });
