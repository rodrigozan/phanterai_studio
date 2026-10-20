#!/usr/bin/env node
/**
 * align.js - alinha roteiro.md + words.json em timeline.json (frames a 30fps).
 *
 *     node scripts/align.js <slug>
 *
 * Lê public/episodes/<slug>/roteiro.md e public/episodes/<slug>/words.json
 * (gerado por scripts/transcribe.py) e grava public/episodes/<slug>/timeline.json.
 *
 * FORMATO DE roteiro.md - o mesmo que a skill pauta-roteiro-aprenda-youtube entrega.
 * Só a seção "## CENAS" é lida; TEXTO_ELEVENLABS, ASSETS_DO_ROD e PUBLICACAO são ignorados.
 *
 *     musica: trilha.mp3              (opcional, uma linha solta; arquivo em public/music/, toca em
 *                                      loop o vídeo todo e sobe nas pausas da narração)
 *     musica_fim: 163.5               (opcional: segundo da faixa onde o loop volta ao início,
 *                                      antes de um fade out; as repetições entram em crossfade)
 *
 *     ## CENAS
 *
 *     ### C01 | template: titulo-impacto | pose: surpresa
 *     fala: "Primeiro de fevereiro de 2027. Anota essa data."
 *     dados: { titulo: "01/02/2027", subtitulo: "anota essa data" }
 *     eventos: [{ ao: "Anota", acao: "carimbo-vermelho" }]
 *
 *     ### C01b | template: print | pose: apontando
 *     fala: "O YouTube já escreveu, preto no branco,"
 *     dados: { arquivo: "print-09.png", legenda: "TechCrunch" }
 *
 * - Cabeçalho: "### <id> | template: <nome> | pose: <pose>". O id é qualquer texto sem "|"
 *   começando com C (C04, C04a, C55b...); a ordem das cenas é a ordem no arquivo.
 * - `fala:` trecho literal da narração, entre aspas duplas.
 * - `dados:` objeto em sintaxe de JS: chaves sem aspas, strings em aspas duplas, números,
 *   true/false/null, arrays e objetos aninhados. Vira o `dados` passado ao template. Opcional.
 * - `eventos:` array de { ao: "<palavra da fala>", acao: "<acao>" }. Opcional.
 *   Cada evento sai no timeline.json com `frame` relativo ao início da cena.
 *
 * `fala:` é localizada dentro de words.json por correspondência aproximada: acentos e
 * pontuação normalizados, e a maior sequência de palavras em comum (palavra transcrita junta,
 * separada ou trocada não desalinha o resto). Precisa bater pelo menos 60% da fala. Se uma
 * fala ou a palavra de um evento não for encontrada, o script para e informa a cena e o
 * trecho - nunca chuta tempo.
 */
const fs = require("fs");
const path = require("path");

const FPS = 30;
// Intervalo sem fala (entre palavras, antes da primeira e depois da última) a partir do qual a
// música de fundo sobe. Pausas curtas de respiração ficam abaixo disso.
const PAUSA_MIN_S = 0.7;

// Números por extenso que o Whisper costuma transcrever como algarismos. Aplicado aos dois
// lados (roteiro e transcrição), então "dois" e "2" viram o mesmo token.
const NUMEROS = {
  um: "1", uma: "1", dois: "2", duas: "2", tres: "3", quatro: "4", cinco: "5", seis: "6",
  sete: "7", oito: "8", nove: "9", dez: "10", onze: "11", doze: "12", quinze: "15",
  vinte: "20", trinta: "30", quarenta: "40", cinquenta: "50", sessenta: "60", setenta: "70",
  oitenta: "80", noventa: "90", cem: "100",
};

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => NUMEROS[t] ?? t);
}

// Lê um literal no estilo JS ({ chave: "valor", lista: [1, 2] }) - o formato de `dados:` e
// `eventos:` no roteiro. Não usa eval: só objetos, arrays, strings em aspas duplas,
// números, true/false/null e chaves sem aspas.
function parseLiteral(src, where) {
  let i = 0;
  const fail = (msg) => {
    throw new Error(`${where}: ${msg} (posição ${i}) em: ${src}`);
  };
  const ws = () => {
    while (i < src.length && /\s/.test(src[i])) i++;
  };
  const value = () => {
    ws();
    const c = src[i];
    if (c === "{") return object();
    if (c === "[") return array();
    if (c === '"') return string();
    const m = /^(-?\d+(\.\d+)?|true|false|null)\b/.exec(src.slice(i));
    if (!m) fail("valor inválido");
    i += m[0].length;
    return JSON.parse(m[0]);
  };
  const string = () => {
    const m = /^"(?:[^"\\]|\\.)*"/.exec(src.slice(i));
    if (!m) fail("string sem aspas de fechamento");
    i += m[0].length;
    return JSON.parse(m[0]);
  };
  const object = () => {
    const out = {};
    i++;
    ws();
    while (src[i] !== "}") {
      ws();
      let key;
      if (src[i] === '"') key = string();
      else {
        const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
        if (!m) fail("chave inválida");
        key = m[0];
        i += key.length;
      }
      ws();
      if (src[i] !== ":") fail('esperava ":"');
      i++;
      out[key] = value();
      ws();
      if (src[i] === ",") i++;
      else if (src[i] !== "}") fail('esperava "," ou "}"');
      ws();
    }
    i++;
    return out;
  };
  const array = () => {
    const out = [];
    i++;
    ws();
    while (src[i] !== "]") {
      out.push(value());
      ws();
      if (src[i] === ",") i++;
      else if (src[i] !== "]") fail('esperava "," ou "]"');
      ws();
    }
    i++;
    return out;
  };

  const result = value();
  ws();
  if (i !== src.length) fail("texto sobrando depois do valor");
  return result;
}

function parseRoteiro(markdown) {
  const musicaMatch = markdown.match(/^musica:\s*(.+)$/m);
  const musica = musicaMatch ? musicaMatch[1].trim() : null;
  const musicaFimMatch = markdown.match(/^musica_fim:\s*([\d.]+)\s*$/m);
  const musicaFim = musicaFimMatch ? Number(musicaFimMatch[1]) : null;

  // Só a seção ## CENAS (até o próximo "## " de nível 2).
  const cenasMatch = markdown.match(/^## CENAS\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!cenasMatch) {
    throw new Error('roteiro.md: seção "## CENAS" não encontrada');
  }

  const blocks = cenasMatch[1].split(/^### /m).slice(1);
  const scenes = blocks.map((block) => {
    const lines = block.split("\n");
    const [id, ...attrs] = lines[0].split("|").map((part) => part.trim());
    const scene = { id, template: null, pose: null, fala: null, dados: {}, eventos: [] };

    for (const attr of attrs) {
      const idx = attr.indexOf(":");
      const key = attr.slice(0, idx).trim();
      const value = attr.slice(idx + 1).trim();
      if (key === "template") scene.template = value;
      else if (key === "pose") scene.pose = value;
      else console.warn(`[align] cena ${id}: atributo desconhecido "${key}" no cabeçalho ignorado`);
    }

    for (const rawLine of lines.slice(1)) {
      const line = rawLine.trim();
      if (!line || !line.includes(":")) continue;

      const idx = line.indexOf(":");
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      const where = `cena ${id}, ${key}`;

      if (key === "fala") scene.fala = parseLiteral(value, where);
      else if (key === "dados") scene.dados = parseLiteral(value, where);
      else if (key === "eventos") scene.eventos = parseLiteral(value, where);
      else console.warn(`[align] cena ${id}: chave desconhecida "${key}" ignorada`);
    }

    return scene;
  });

  return { musica, musicaFim, scenes };
}

// Duas palavras normalizadas "batem" se forem iguais ou se uma for o começo da outra (mín. 3
// letras) - cobre transcrições como "Neko" -> "Nekolov".
function bate(a, b) {
  if (a === b) return true;
  const [curta, longa] = a.length <= b.length ? [a, b] : [b, a];
  return curta.length >= 3 && longa.startsWith(curta);
}

// Maior subsequência comum entre a fala e um trecho de words, devolvendo quantas palavras
// bateram e o índice (em words) da primeira e da última palavra casada.
function lcs(falaTokens, words, inicio, fim) {
  const n = falaTokens.length;
  const m = fim - inicio;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = bate(falaTokens[i - 1], words[inicio + j - 1].norm)
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // Volta pela tabela preferindo pular palavras da transcrição: em empate, casa com a
  // ocorrência mais cedo (senão "categoria" da fala seguinte pode ser puxada para esta).
  let i = n;
  let j = m;
  const pares = [];
  while (i > 0 && j > 0) {
    if (dp[i][j] === dp[i][j - 1]) j--;
    else if (dp[i][j] === dp[i - 1][j]) i--;
    else {
      pares.unshift({ fala: i - 1, word: inicio + j - 1 });
      i--;
      j--;
    }
  }
  const primeira = pares.length ? pares[0].word : -1;
  const ultima = pares.length ? pares[pares.length - 1].word : -1;
  return { casadas: dp[n][m], primeira, ultima, pares };
}

// Procura a fala em words a partir de `cursor`, tolerando palavras trocadas, a mais ou a menos
// na transcrição (ex.: "Neko Lofi" transcrito como "Nekolov"). A busca anda no máximo
// JANELA_BUSCA palavras à frente do cursor, para uma fala não casar com um trecho distante.
const JANELA_BUSCA = 80;
function findFala(words, falaTokens, cursor) {
  const n = falaTokens.length;
  const folga = Math.max(4, Math.ceil(n * 0.3));
  let best = null;

  for (let start = cursor; start < Math.min(words.length, cursor + JANELA_BUSCA); start++) {
    if (!bate(falaTokens[0], words[start].norm) && !bate(falaTokens[1] ?? "", words[start].norm)) continue;
    const r = lcs(falaTokens, words, start, Math.min(words.length, start + n + folga));
    const score = r.casadas / n;
    if (!best || score > best.score) best = { score, start: r.primeira, end: r.ultima, pares: r.pares };
    if (score === 1) break;
  }

  return best && best.score >= 0.6 ? best : null;
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

  let roteiro;
  try {
    roteiro = parseRoteiro(fs.readFileSync(roteiroPath, "utf8"));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const { musica, musicaFim, scenes } = roteiro;
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
    musicEnd: musicaFim,
    scenes: resolved.map(({ scene, match }, i) => {
      const startFrame = Math.round(words[match.start].start * FPS);
      const next = resolved[i + 1];
      const endFrame = next
        ? Math.round(words[next.match.start].start * FPS)
        : Math.round(words[match.end].end * FPS) + FPS;

      const falaTokens = normalize(scene.fala);
      const eventos = scene.eventos.map(({ ao, acao }) => {
        const alvo = normalize(String(ao))[0] ?? "";
        // Igualdade exata primeiro: em "tem o seu tempero", ao "tempero" não pode cair em "tem".
        let k = falaTokens.indexOf(alvo);
        if (k === -1) k = falaTokens.findIndex((t) => bate(t, alvo));
        let hit = null;
        if (k !== -1) {
          const par = match.pares.find((p) => p.fala === k);
          if (par) hit = words[par.word];
          else {
            // Palavra da fala que não casou (ex.: "trezentos" transcrito "300"): fica entre o
            // par casado anterior e o seguinte; usa a palavra transcrita nessa mesma posição.
            // Sem par de um dos lados (primeira/última palavra), conta posições a partir do outro.
            const antes = [...match.pares].reverse().find((p) => p.fala < k);
            const depois = match.pares.find((p) => p.fala > k);
            const pos = antes ? antes.word + (k - antes.fala) : depois.word - (depois.fala - k);
            const dentro = (!antes || pos > antes.word) && (!depois || pos < depois.word);
            if (dentro && pos >= 0 && pos < words.length) hit = words[pos];
          }
        }
        if (!hit) {
          console.error(
            `cena ${scene.id}: palavra do evento "${ao}" (acao "${acao}") não encontrada na fala transcrita.\n` +
              `  fala: "${scene.fala}"`
          );
          process.exit(1);
        }
        return { ao, acao, frame: Math.round(hit.start * FPS) - startFrame };
      });

      return {
        id: scene.id,
        template: scene.template,
        pose: scene.pose,
        fala: scene.fala,
        startFrame,
        endFrame,
        dados: scene.dados,
        eventos,
      };
    }),
  };

  const fimVideo = timeline.scenes[timeline.scenes.length - 1].endFrame / FPS;
  const marcos = [{ end: 0 }, ...rawWords, { start: fimVideo }];
  timeline.pausas = [];
  for (let i = 0; i < marcos.length - 1; i++) {
    const inicio = marcos[i].end;
    const fim = marcos[i + 1].start;
    if (fim - inicio >= PAUSA_MIN_S) {
      timeline.pausas.push({ startFrame: Math.round(inicio * FPS), endFrame: Math.round(fim * FPS) });
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(timeline, null, 2));
  console.log(`${timeline.scenes.length} cenas, ${timeline.pausas.length} pausas -> ${outPath}`);
}

main();
