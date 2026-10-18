#!/usr/bin/env node
/**
 * align.js - alinha roteiro.md + words.json em timeline.json (frames a 30fps).
 *
 *     node scripts/align.js <slug>
 *
 * Lê public/episodes/<slug>/roteiro.md e public/episodes/<slug>/words.json
 * (gerado por scripts/transcribe.py) e grava public/episodes/<slug>/timeline.json.
 *
 * FORMATO DE roteiro.md (um bloco "### Cxx" por cena):
 *
 *     musica: trilha-feliz.mp3        (opcional, uma vez no topo do arquivo)
 *
 *     ### C01
 *     template: titulo-impacto
 *     pose: feliz
 *     fala: Isso aqui vai mudar sua vida.
 *     ao.vida: riser
 *     dados.titulo: ISSO VAI MUDAR
 *     dados.subtitulo: sua vida
 *
 *     ### C02
 *     template: checklist-cards
 *     pose: pensando
 *     fala: Primeiro o título, depois a thumbnail.
 *     dados.itens.0.texto: Título
 *     dados.itens.0.feito: true
 *     dados.itens.1.texto: Thumbnail
 *     dados.itens.1.feito: false
 *
 * `dados.<caminho>` vira o objeto `dados` passado ao template (índices numéricos no
 * caminho criam arrays). `ao.<palavra>: <evento>` marca um evento ancorado numa palavra
 * da fala; o frame gravado é relativo ao início da cena.
 *
 * `fala:` é localizada dentro de words.json por correspondência aproximada (acentos e
 * pontuação normalizados). Se não for encontrada, o script para e informa a cena e o
 * trecho - nunca chuta tempo.
 */
const fs = require("fs");
const path = require("path");

const FPS = 30;

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function setPath(obj, segments, value) {
  let node = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    const nextSeg = segments[i + 1];
    const wantsArray = /^\d+$/.test(nextSeg);
    if (node[seg] === undefined) {
      node[seg] = wantsArray ? [] : {};
    }
    node = node[seg];
  }
  node[segments[segments.length - 1]] = value;
}

function coerce(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function parseRoteiro(markdown) {
  const musicaMatch = markdown.match(/^musica:\s*(.+)$/m);
  const musica = musicaMatch ? musicaMatch[1].trim() : null;

  const blocks = markdown.split(/^### /m).slice(1);
  const scenes = blocks.map((block) => {
    const lines = block.split("\n");
    const id = lines[0].trim();
    const scene = { id, template: null, pose: null, fala: null, dados: {}, aoEventos: [] };

    for (const rawLine of lines.slice(1)) {
      const line = rawLine.trim();
      if (!line || !line.includes(":")) continue;

      const idx = line.indexOf(":");
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();

      if (key === "template") scene.template = value;
      else if (key === "pose") scene.pose = value;
      else if (key === "fala") scene.fala = value;
      else if (key.startsWith("dados.")) setPath(scene, key.split("."), coerce(value));
      else if (key.startsWith("ao.")) scene.aoEventos.push({ palavra: key.slice(3), evento: value });
      else console.warn(`[align] cena ${id}: chave desconhecida "${key}" ignorada`);
    }

    return scene;
  });

  return { musica, scenes };
}

// Procura a janela de `words` (a partir de `cursor`) que melhor corresponde a `falaTokens`,
// permitindo pequenas diferenças da transcrição (ex.: palavra extra ou trocada).
function findFala(words, falaTokens, cursor) {
  const n = falaTokens.length;
  let best = { score: -1, start: -1 };

  for (let start = cursor; start <= words.length - 1; start++) {
    let score = 0;
    const end = Math.min(start + n, words.length);
    for (let i = start; i < end; i++) {
      if (words[i].norm === falaTokens[i - start]) score++;
    }
    const coverage = score / n;
    if (coverage > best.score) {
      best = { score: coverage, start, end: end - 1 };
    }
    if (coverage === 1) break;
  }

  return best.score >= 0.6 ? best : null;
}

function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("uso: node scripts/align.js <slug>");
    process.exit(1);
  }

  const episodeDir = path.join(process.cwd(), "public", "episodes", slug);
  const roteiroPath = path.join(episodeDir, "roteiro.md");
  const wordsPath = path.join(episodeDir, "words.json");
  const outPath = path.join(episodeDir, "timeline.json");

  for (const p of [roteiroPath, wordsPath]) {
    if (!fs.existsSync(p)) {
      console.error(`arquivo não encontrado: ${p}`);
      process.exit(1);
    }
  }

  const { musica, scenes } = parseRoteiro(fs.readFileSync(roteiroPath, "utf8"));
  const rawWords = JSON.parse(fs.readFileSync(wordsPath, "utf8"));
  const words = rawWords.map((w) => ({ ...w, norm: normalize(w.w)[0] ?? "" }));

  let cursor = 0;
  const resolved = [];

  for (const scene of scenes) {
    if (!scene.template) {
      console.error(`cena ${scene.id}: falta "template:"`);
      process.exit(1);
    }
    if (!scene.fala) {
      console.error(`cena ${scene.id}: falta "fala:"`);
      process.exit(1);
    }

    const falaTokens = normalize(scene.fala);
    const match = findFala(words, falaTokens, cursor);

    if (!match) {
      console.error(
        `cena ${scene.id}: fala não encontrada na transcrição a partir da palavra ${cursor}.\n` +
          `  fala: "${scene.fala}"`
      );
      process.exit(1);
    }

    resolved.push({ scene, match });
    cursor = match.end + 1;
  }

  const timeline = {
    fps: FPS,
    music: musica,
    scenes: resolved.map(({ scene, match }, i) => {
      const startFrame = Math.round(words[match.start].start * FPS);
      const next = resolved[i + 1];
      const endFrame = next
        ? Math.round(words[next.match.start].start * FPS)
        : Math.round(words[match.end].end * FPS) + FPS;

      const eventos = scene.aoEventos.map(({ palavra, evento }) => {
        const hit = words
          .slice(match.start, match.end + 1)
          .find((w) => w.norm === normalize(palavra)[0]);
        return {
          palavra,
          evento,
          frame: hit ? Math.round(hit.start * FPS) - startFrame : null,
        };
      });

      return {
        id: scene.id,
        template: scene.template,
        pose: scene.pose,
        startFrame,
        endFrame,
        dados: scene.dados,
        eventos,
      };
    }),
  };

  fs.writeFileSync(outPath, JSON.stringify(timeline, null, 2));
  console.log(`${timeline.scenes.length} cenas -> ${outPath}`);
}

main();
