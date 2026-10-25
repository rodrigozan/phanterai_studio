#!/usr/bin/env node
// Fotos verticais do Pexels para Shorts: baixa a original e reduz para 1300 px de largura (ffmpeg).
// Uso: node scripts/fetch-pexels-vertical.js <slug> nome="termo de busca" [nome="termo" ...]
// Salva em public/episodes/<slug>/fotos/<nome>.jpg e registra autoria em fotos/creditos.json.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, ".env"), "utf8").split(/\r?\n/).flatMap((l) => {
    const m = l.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/);
    return m && !l.trim().startsWith("#") ? [[m[1], m[2].replace(/^(["'])(.*)\1$/, "$2")]] : [];
  })
);
const [slug, ...pares] = process.argv.slice(2);
if (!slug || !pares.length) { console.error('Uso: node scripts/fetch-pexels-vertical.js <slug> nome="termo" ...'); process.exit(2); }
if (!env.PX_API_KEY) { console.error("PX_API_KEY ausente no .env"); process.exit(1); }

const dir = path.join(ROOT, "public", "episodes", slug, "fotos");
fs.mkdirSync(dir, { recursive: true });
const creditosFile = path.join(dir, "creditos.json");
const creditos = fs.existsSync(creditosFile) ? JSON.parse(fs.readFileSync(creditosFile, "utf8")) : {};

(async () => {
  for (const par of pares) {
    const i = par.indexOf("=");
    const nome = par.slice(0, i), termo = par.slice(i + 1);
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", termo);
    url.searchParams.set("per_page", "5");
    url.searchParams.set("orientation", "portrait");
    const r = await fetch(url, { headers: { Authorization: env.PX_API_KEY } });
    if (!r.ok) throw new Error(`Pexels HTTP ${r.status} em '${termo}'`);
    const foto = (await r.json()).photos?.[0];
    if (!foto) { console.log(`${nome}: nada para '${termo}'`); continue; }
    const bruto = path.join(dir, `${nome}.orig`);
    const img = await fetch(foto.src.original);
    if (!img.ok) throw new Error(`download ${foto.id} HTTP ${img.status}`);
    fs.writeFileSync(bruto, Buffer.from(await img.arrayBuffer()));
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", bruto, "-vf", "scale='min(1300,iw)':-2", "-q:v", "3", path.join(dir, `${nome}.jpg`)]);
    fs.unlinkSync(bruto);
    creditos[nome] = { id: foto.id, fotografo: foto.photographer, pagina: foto.url, termo };
    console.log(`${nome}: ${foto.id} (${foto.photographer})`);
  }
  fs.writeFileSync(creditosFile, JSON.stringify(creditos, null, 2) + "\n");
})().catch((e) => { console.error(e.message); process.exit(1); });
