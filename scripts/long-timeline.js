#!/usr/bin/env node
/**
 * long-timeline.js - monta timeline.json de um vídeo longo (16:9, 30fps).
 *
 *     node scripts/long-timeline.js <slug> [--nova-musica]
 *
 * Lê public/<marca>/episodes/long-videos/<slug>/roteiro.json e voz/<id>.json (gerados por
 * scripts/long-voz.js) e grava timeline.json: cenas com frame inicial/final, palavras de cada cena
 * (segundos locais), palavras globais para a legenda e a música sorteada.
 *
 * Âncoras: em qualquer lugar de `dados`, um objeto com `ao: "palavra"` ganha `em` = frame local
 * (dentro da cena) em que essa palavra é falada. "palavra#2" pega a 2ª ocorrência. Palavra não
 * encontrada derruba o script com o nome da cena: nunca chuta tempo.
 *
 * Música: sorteada entre os mp3 de public/<marca>/music/ na primeira geração e mantida nas
 * seguintes (use --nova-musica para sortear de novo). Toca em loop até o fim, a 20% do volume.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MARCA = process.env.MARCA || "phanterai";
const FPS = 30;
const LEAD = 0.5; // respiro antes da primeira palavra (s)
const GAP = 0.35; // mesmo respiro que long-voz.js cola entre cenas (s)
const TAIL = 3.0; // sobra no fim, depois da última palavra (s)

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/long-timeline.js <slug> [--nova-musica]"); process.exit(2); }
const dir = path.join(ROOT, "public", MARCA, "episodes", "long-videos", slug);
const roteiro = JSON.parse(fs.readFileSync(path.join(dir, "roteiro.json"), "utf8"));

const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const resolver = (obj, words, cena) => {
  if (Array.isArray(obj)) return obj.map((o) => resolver(o, words, cena));
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = resolver(v, words, cena);
    if (typeof obj.ao === "string") {
      const [alvo, n = "1"] = obj.ao.split("#");
      let achou = 0, w = null;
      for (const x of words) if (norm(x.w) === norm(alvo) && ++achou === Number(n)) { w = x; break; }
      if (!w) throw new Error(`cena ${cena}: palavra "${obj.ao}" não aparece na fala`);
      out.em = Math.round(w.s * FPS);
    }
    return out;
  }
  return obj;
};

const manifest = (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, "pexels-manifest.json"), "utf8")); } catch { return { videos: [] }; } })();
// Vídeo de fundo: acrescenta a duração do clipe (Loop precisa dela) em dados.bgDur.
const comDuracao = (dados) => {
  if (typeof dados.bg === "string" && /\.mp4$/i.test(dados.bg)) {
    const nome = path.basename(dados.bg, ".mp4");
    const v = manifest.videos.find((x) => x.nome === nome);
    if (!v) throw new Error(`clipe ${dados.bg} não está no pexels-manifest.json`);
    return { ...dados, bgDur: v.duracao };
  }
  return dados;
};

let cursor = LEAD;
const cenas = [], globais = [];
roteiro.cenas.forEach((c, i) => {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "voz", `${c.id}.json`), "utf8"));
  const ultima = i === roteiro.cenas.length - 1;
  const ini = cursor;
  const fim = ini + meta.dur + (ultima ? TAIL : GAP); // a cena segura a imagem até a próxima começar
  cenas.push({
    id: c.id,
    tipo: c.tipo,
    pose: c.pose,
    pantera: c.pantera,
    fala: c.fala,
    dados: comDuracao(resolver(c.dados ?? {}, meta.words, c.id)),
    words: meta.words.map((w) => ({ w: w.w, s: +w.s.toFixed(3), e: +w.e.toFixed(3) })),
    startFrame: Math.round(ini * FPS),
    endFrame: Math.round(fim * FPS),
  });
  meta.words.forEach((w) => globais.push({ w: w.w, start: +(ini + w.s).toFixed(3), end: +(ini + w.e).toFixed(3) }));
  cursor = ini + meta.dur + GAP;
});

const tlPath = path.join(dir, "timeline.json");
let musica = null;
if (!process.argv.includes("--nova-musica") && fs.existsSync(tlPath)) musica = JSON.parse(fs.readFileSync(tlPath, "utf8")).musica;
if (!musica) {
  const faixas = fs.readdirSync(path.join(ROOT, "public", MARCA, "music")).filter((f) => /\.mp3$/i.test(f));
  musica = faixas[Math.floor(Math.random() * faixas.length)];
}

const totalFrames = cenas[cenas.length - 1].endFrame;
const seg = (f) => cenas.filter(f).reduce((n, c) => n + (c.endFrame - c.startFrame), 0) / totalFrames;
console.log(`pexels em tela cheia: ${(seg((c) => c.dados.bg) * 100).toFixed(0)}% | panterinha: ${(seg((c) => c.pantera !== false) * 100).toFixed(0)}% (por cena)`);
fs.writeFileSync(tlPath, JSON.stringify({ slug, fps: FPS, lead: LEAD, musica, musicaVolume: 0.2, totalFrames, scenes: cenas, words: globais }, null, 1));
console.log(`${cenas.length} cenas, ${(totalFrames / FPS / 60).toFixed(2)} min, música: ${musica}`);
