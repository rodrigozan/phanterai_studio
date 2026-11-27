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
 * seguintes (use --nova-musica para sortear de novo). Toca em loop até o fim, a 17% do volume (sem Daniel.mp3, exclusiva do anime bíblico).
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
  const fim = ini + meta.dur + (ultima ? (roteiro.cauda ?? TAIL) : GAP); // roteiro.cauda: segura o card final (ex.: completar 5 min) // a cena segura a imagem até a próxima começar
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

// ---------- cortes de mídia real (Pexels vídeo/foto + prints do Playwright) ----------
// Regra do Rod (20/11): 20 a 30% do vídeo em mídia baixada, nenhum corte > 2 s, nada de ficar só em motion.
// Prints entram na palavra falada (broll.json "gatilhos"); o resto é sorteado (semente = slug) e espaçado.
const CORTE_MAX = 2.0; // s
const mfAll = (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, "pexels-manifest.json"), "utf8")); } catch { return {}; } })();
const brollCfg = (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, "broll.json"), "utf8")); } catch { return null; } })();
const cortes = [];
if (brollCfg) {
  let seed = [...slug].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const lista = (d, ext) => (fs.existsSync(path.join(dir, d)) ? fs.readdirSync(path.join(dir, d)).filter((f) => ext.test(f)).sort() : []);
  const embaralha = (a) => a.map((x) => [rnd(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  const gatSrc = new Set(Object.values(brollCfg.gatilhos ?? {}));
  const pool = {
    video: embaralha(lista("pexels", /\.mp4$/i).map((f) => `pexels/${f}`)),
    foto: embaralha(lista("pexels", /\.jpe?g$/i).map((f) => `pexels/${f}`)),
    print: embaralha(lista("prints", /\.png$/i).map((f) => `prints/${f}`).filter((s) => !(brollCfg.somenteGatilho ?? true) || gatSrc.has(s) || true)),
  };
  const durVideo = (src) => (mfAll.videos ?? []).find((v) => `pexels/${v.nome}.mp4` === src)?.duracao ?? 8;
  const usos = {};
  // Regra do Rod (23/11): b-roll de pessoas SÓ em cena marcada "broll": "humano" no roteiro e cada clipe UMA vez no vídeo.
  // Prints (gatilhos) continuam entrando na palavra falada; o resto das cenas fica sem b-roll sorteado.
  const ordemTipos = ["video", "foto", "video", "video"];
  let ti = 0;
  const escolhe = () => {
    for (let k = 0; k < ordemTipos.length; k++) {
      const tipo = ordemTipos[ti++ % ordemTipos.length];
      const cand = pool[tipo].filter((s) => !usos[s]);
      if (!cand.length) continue;
      const src = cand[0];
      usos[src] = 1;
      return { tipo, src, from: 0 };
    }
    return null;
  };
  const gap0 = brollCfg.gap ?? 3.3; // s de motion entre cortes
  cenas.forEach((c) => {
    const bc = roteiro.cenas.find((x) => x.id === c.id).broll;
    if (bc === false) return;
    const humano = bc === "humano";
    const gap = gap0;
    const s0 = c.startFrame / FPS + 0.6, e0 = c.endFrame / FPS - 0.5;
    // gatilhos desta cena
    const fixos = [];
    for (const w of c.words) {
      const alvo = Object.keys(brollCfg.gatilhos ?? {}).find((k) => norm(k) === norm(w.w));
      if (!alvo) continue;
      const t = c.startFrame / FPS + w.s - 0.1;
      const src = brollCfg.gatilhos[alvo];
      if (t < s0 || t + 1.8 > e0 || fixos.some((f) => Math.abs(f.t - t) < 6)) continue;
      if (cortes.some((x) => x.src === src && Math.abs(x.startFrame / FPS - t) < 25)) continue;
      fixos.push({ t, dur: 1.9, tipo: "print", src, from: 0 });
    }
    let t = s0 + gap * (0.4 + rnd() * 0.5);
    const novos = [...fixos];
    while (humano && t + 1.4 < e0) {
      const dur = +(1.5 + rnd() * 0.4).toFixed(2);
      const conflita = fixos.find((f) => t < f.t + f.dur + 1.2 && t + dur > f.t - 1.2);
      if (conflita) { t = conflita.t + conflita.dur + gap * 0.8; continue; }
      const m = escolhe();
      if (!m) break;
      novos.push({ t, dur, ...m });
      t += dur + gap * (0.8 + rnd() * 0.4);
    }
    novos.sort((a, b) => a.t - b.t).forEach((n) => {
      const ini = Math.round(n.t * FPS);
      cortes.push({ id: `K${String(cortes.length + 1).padStart(3, "0")}`, cena: c.id, tipo: n.tipo, src: n.src, from: n.from, startFrame: ini, endFrame: ini + Math.round(Math.min(n.dur, CORTE_MAX) * FPS) });
    });
  });
  cortes.sort((a, b) => a.startFrame - b.startFrame);
  // validação: nenhum corte > 2 s; mídia entre 20 e 30%; maior trecho só de motion
  const total0 = cenas[cenas.length - 1].endFrame;
  const cobre = cortes.reduce((n, c) => n + (c.endFrame - c.startFrame), 0) / total0;
  let maiorMotion = 0, prev = 0;
  for (const c of cortes) { maiorMotion = Math.max(maiorMotion, c.startFrame - prev); prev = c.endFrame; }
  console.log(`cortes de mídia real: ${cortes.length} (${(cobre * 100).toFixed(0)}% do vídeo) | vídeo ${cortes.filter((c) => c.tipo === "video").length}, foto ${cortes.filter((c) => c.tipo === "foto").length}, print ${cortes.filter((c) => c.tipo === "print").length} | maior trecho só motion: ${(maiorMotion / FPS).toFixed(1)}s`);
  if (cortes.some((c) => (c.endFrame - c.startFrame) / FPS > CORTE_MAX + 0.01)) throw new Error("corte acima de 2 s");
  // sem meta de % nem aviso de trecho sem mídia: b-roll só onde a fala é sobre pessoas (regra 5 da skill)
  const repetidos = cortes.filter((c, i) => c.tipo !== "print" && cortes.findIndex((x) => x.src === c.src) !== i);
  if (repetidos.length) throw new Error(`clipe repetido: ${[...new Set(repetidos.map((c) => c.src))].join(", ")}`);
  const emTecnica = cortes.filter((c) => c.tipo !== "print" && roteiro.cenas.find((x) => x.id === c.cena).broll !== "humano");
  if (emTecnica.length) throw new Error(`b-roll de pessoas em cena não marcada "humano": ${emTecnica.map((c) => c.cena).join(", ")}`);
} else {
  console.warn("ATENÇÃO: sem broll.json: vídeo só com motion (o Rod reprova). Crie broll.json e rode long-broll.js.");
}

const tlPath = path.join(dir, "timeline.json");
let musica = null;
if (!process.argv.includes("--nova-musica") && fs.existsSync(tlPath)) musica = JSON.parse(fs.readFileSync(tlPath, "utf8")).musica;
if (!musica) {
  const faixas = fs.readdirSync(path.join(ROOT, "public", MARCA, "music")).filter((f) => /\.mp3$/i.test(f) && !/^daniel\.mp3$/i.test(f)); // Daniel é só do anime bíblico, nunca no Aprenda YouTube
  musica = faixas[Math.floor(Math.random() * faixas.length)];
}

const totalFrames = cenas[cenas.length - 1].endFrame;
const seg = (f) => cenas.filter(f).reduce((n, c) => n + (c.endFrame - c.startFrame), 0) / totalFrames;
console.log(`pexels em tela cheia: ${(seg((c) => c.dados.bg) * 100).toFixed(0)}%${MARCA === "phanterai" ? ` | panterinha: ${(seg((c) => c.pantera !== false) * 100).toFixed(0)}% (por cena)` : ""}`);
fs.writeFileSync(tlPath, JSON.stringify({ slug, fps: FPS, lead: LEAD, musica, musicaVolume: 0.17, totalFrames, scenes: cenas, cortes, words: globais }, null, 1));
console.log(`${cenas.length} cenas, ${(totalFrames / FPS / 60).toFixed(2)} min, música: ${musica}`);
