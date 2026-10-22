#!/usr/bin/env node
// Busca fotos em Pexels e salva cópias locais no episódio, sem imprimir a chave de API.
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const EPISODES = path.join(ROOT, "public", "episodes");

const readEnv = async () => {
  let text;
  try {
    text = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  } catch {
    return {};
  }
  return Object.fromEntries(
    text.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match || match[1].startsWith("#")) return [];
      return [[match[1], match[2].replace(/^(["'])(.*)\1$/, "$2")]];
    })
  );
};

const slug = process.argv[2];
if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error("Uso: node scripts/fetch-pexels.js <slug> [termo de busca ...]");
  process.exit(2);
}

(async () => {
  const episodeDir = path.join(EPISODES, slug);
  const queries = process.argv.slice(3).length
    ? process.argv.slice(3)
    : (await fs.readFile(path.join(episodeDir, "pexels-queries.txt"), "utf8"))
        .split(/\r?\n/).map((q) => q.trim()).filter((q) => q && !q.startsWith("#"));
  if (!queries.length) throw new Error("Adicione termos em pexels-queries.txt ou passe-os como argumentos.");

  const env = { ...await readEnv(), ...process.env };
  const apiKey = env.PX_API_KEY;
  if (!apiKey) throw new Error("PX_API_KEY não está configurada no .env.");

  const outputDir = path.join(episodeDir, "pexels");
  await fs.mkdir(outputDir, { recursive: true });
  const photos = [];
  const seen = new Set();
  for (const query of queries) {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "8");
    url.searchParams.set("orientation", "landscape");
    const response = await fetch(url, { headers: { Authorization: apiKey } });
    if (!response.ok) throw new Error(`Pexels respondeu HTTP ${response.status} para a busca '${query}'.`);
    const result = await response.json();
    for (const photo of result.photos ?? []) {
      if (seen.has(photo.id)) continue;
      seen.add(photo.id);
      const imageResponse = await fetch(photo.src.large);
      if (!imageResponse.ok) throw new Error(`Falha ao baixar a foto ${photo.id} (HTTP ${imageResponse.status}).`);
      const filename = `pexels-${String(photos.length + 1).padStart(2, "0")}.jpg`;
      await fs.writeFile(path.join(outputDir, filename), Buffer.from(await imageResponse.arrayBuffer()));
      photos.push({
        id: photo.id,
        query,
        file: `pexels/${filename}`,
        photographer: photo.photographer,
        page: photo.url,
        source: photo.src.large,
        alt: photo.alt,
      });
      if (photos.length >= 30) break;
      if (photos.filter((item) => item.query === query).length >= 5) break;
    }
    console.log(`${query}: ${photos.filter((item) => item.query === query).length} imagens`);
    if (photos.length >= 30) break;
  }

  await fs.writeFile(path.join(episodeDir, "pexels-manifest.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), photos }, null, 2)}\n`);
  console.log(`${photos.length} imagens salvas em public/episodes/${slug}/pexels/`);
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
