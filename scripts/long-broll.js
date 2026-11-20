#!/usr/bin/env node
/**
 * long-broll.js - baixa a mídia real dos cortes de um vídeo longo (Pexels vídeo + foto, prints Playwright).
 *
 *     node scripts/long-broll.js <slug>
 *
 * Lê public/<marca>/episodes/long-videos/<slug>/broll.json:
 *   {
 *     "videos":   { "nome": "busca no Pexels", ... },      // N clipes por busca (campo "qtd", padrão 2)
 *     "fotos":    { "nome": "busca no Pexels", ... },
 *     "prints":   { "nome": "https://site", ... },          // Playwright 1920x1080 -> prints/<nome>.png
 *     "gatilhos": { "node": "prints/node.png", ... },       // palavra falada -> print que entra no corte
 *     "qtd": 2
 *   }
 * Grava em pexels/ e prints/, e registra autor/link em pexels-manifest.json (videos[] e fotos[]).
 * Já baixado não baixa de novo.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const MARCA = process.env.MARCA || "phanterai";
const PW = "/root/pw-tools/node_modules/playwright-core";
const CHROME = process.env.CHROME_BIN || path.join(process.env.HOME || "/root", ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome");

const existe = (p) => fs.access(p).then(() => true, () => false);

(async () => {
  const slug = process.argv[2];
  if (!slug) { console.error("uso: node scripts/long-broll.js <slug>"); process.exit(2); }
  const base = path.join(ROOT, "public", MARCA, "episodes", "long-videos", slug);
  const cfg = JSON.parse(await fs.readFile(path.join(base, "broll.json"), "utf8"));
  const envTxt = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const key = (envTxt.match(/^\s*PX_API_KEY\s*=\s*(.*?)\s*$/m) || [])[1]?.replace(/^(["'])(.*)\1$/, "$2");
  if (!key) throw new Error("PX_API_KEY ausente no .env");
  await fs.mkdir(path.join(base, "pexels"), { recursive: true });
  await fs.mkdir(path.join(base, "prints"), { recursive: true });
  const mfPath = path.join(base, "pexels-manifest.json");
  const mf = await fs.readFile(mfPath, "utf8").then(JSON.parse).catch(() => ({}));
  mf.videos ||= []; mf.fotos ||= [];
  const usados = new Set([...mf.videos, ...mf.fotos].map((x) => x.id));
  const qtd = cfg.qtd ?? 2;
  const api = async (rota, q, extra = {}) => {
    const u = new URL(`https://api.pexels.com/${rota}/search`);
    u.searchParams.set("query", q); u.searchParams.set("orientation", "landscape"); u.searchParams.set("per_page", "20");
    for (const [k, v] of Object.entries(extra)) u.searchParams.set(k, v);
    const r = await fetch(u, { headers: { Authorization: key } });
    if (!r.ok) throw new Error(`Pexels HTTP ${r.status} em '${q}'`);
    return r.json();
  };

  // ---- vídeos
  for (const [nome, termo] of Object.entries(cfg.videos ?? {})) {
    const { videos } = await api("videos", termo, { size: "medium" });
    let n = 0;
    for (const v of videos) {
      if (n >= qtd) break;
      if (usados.has(v.id) || v.duration < 5 || v.duration > 60) continue;
      const f = v.video_files.filter((x) => x.file_type === "video/mp4" && x.width >= 1280 && x.width <= 1920).sort((a, b) => a.width - b.width)[0];
      if (!f) continue;
      const arq = `${nome}-${n + 1}`;
      const dest = path.join(base, "pexels", `${arq}.mp4`);
      if (!(await existe(dest))) await fs.writeFile(dest, Buffer.from(await (await fetch(f.link)).arrayBuffer()));
      usados.add(v.id); n++;
      mf.videos = mf.videos.filter((x) => x.nome !== arq);
      mf.videos.push({ nome: arq, id: v.id, termo, duracao: v.duration, largura: f.width, autor: v.user?.name, pagina: v.url });
      console.log("video", arq, v.duration + "s", f.width + "px");
    }
    if (!n) console.log("SEM resultado:", nome, "=", termo);
  }

  // ---- fotos
  for (const [nome, termo] of Object.entries(cfg.fotos ?? {})) {
    const { photos } = await api("v1", termo).catch(async () => ({ photos: (await (await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(termo)}&orientation=landscape&per_page=20`, { headers: { Authorization: key } })).json()).photos }));
    let n = 0;
    for (const p of photos ?? []) {
      if (n >= qtd) break;
      if (usados.has(p.id) || p.width < 1920) continue;
      const arq = `${nome}-${n + 1}`;
      const dest = path.join(base, "pexels", `${arq}.jpg`);
      if (!(await existe(dest))) await fs.writeFile(dest, Buffer.from(await (await fetch(`${p.src.original}?auto=compress&cs=tinysrgb&w=1920`)).arrayBuffer()));
      usados.add(p.id); n++;
      mf.fotos = mf.fotos.filter((x) => x.nome !== arq);
      mf.fotos.push({ nome: arq, id: p.id, termo, autor: p.photographer, pagina: p.url });
      console.log("foto", arq);
    }
    if (!n) console.log("SEM resultado:", nome, "=", termo);
  }
  await fs.writeFile(mfPath, JSON.stringify(mf, null, 2) + "\n");

  // ---- prints (Playwright)
  const prints = Object.entries(cfg.prints ?? {});
  if (prints.length) {
    const { chromium } = require(PW);
    const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: "en-US" });
    for (const [nome, url] of prints) {
      const dest = path.join(base, "prints", `${nome}.png`);
      if (await existe(dest)) continue;
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.waitForTimeout(3500);
        for (const sel of ["button:has-text('Accept all')", "button:has-text('Accept')", "button:has-text('Got it')", "button:has-text('Reject all')"]) {
          await page.locator(sel).first().click({ timeout: 800 }).catch(() => {});
        }
        await page.screenshot({ path: dest });
        console.log("print", nome, url);
      } catch (e) { console.log("FALHOU print", nome, url, e.message.split("\n")[0]); }
      await page.close();
    }
    await browser.close();
  }
})().catch((e) => { console.error(e.message); process.exitCode = 1; });
