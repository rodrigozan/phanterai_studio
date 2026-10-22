// Mede cada arquivo de SFX (início/fim do som audível e nível) e grava src/sfx-trechos.json.
// Uso: node scripts/measure-sfx.js   (precisa de ffmpeg). Rodar de novo ao trocar/adicionar arquivos.
const { execFileSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SFX_DIR = path.join(ROOT, "public", "sfx");
const OUT = path.join(ROOT, "src", "sfx-trechos.json");

// Duração máxima tocada por família (s) e nível-alvo (dB RMS do trecho) para igualar volume.
const MAX = { pop: 0.7, ding: 1.0, whoosh: 0.9, coin: 1.2, error: 0.8, riser: 1.8 };
const MIN = { pop: 0.25, ding: 0.4, whoosh: 0.3, coin: 0.35, error: 0.3, riser: 1.0 };
const GANHO_MAX_DB = 6;
const ALVO_DB = -20;
const SIL_DB = -40;
const SIL_MIN = 0.03;
const PRE_ROLL = 0.01;

const listar = () => {
  const out = [];
  for (const f of fs.readdirSync(SFX_DIR)) {
    if (f.endsWith(".mp3")) out.push({ familia: f.replace(".mp3", ""), rel: f });
  }
  const vdir = path.join(SFX_DIR, "variants");
  for (const fam of fs.readdirSync(vdir)) {
    for (const f of fs.readdirSync(path.join(vdir, fam))) {
      if (f.endsWith(".mp3")) out.push({ familia: fam, rel: `variants/${fam}/${f}` });
    }
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
};

const ff = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8" }).stderr;

const duracaoTotal = (file) =>
  parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }));

const medir = ({ familia, rel }) => {
  const file = path.join(SFX_DIR, rel);
  const total = duracaoTotal(file);
  const log = ff(["-i", file, "-af", `silencedetect=n=${SIL_DB}dB:d=${SIL_MIN}`, "-f", "null", "-"]);
  const silencios = [];
  let ini = null;
  for (const l of log.split("\n")) {
    const s = l.match(/silence_start: ([\d.]+)/);
    const e = l.match(/silence_end: ([\d.]+)/);
    if (s) ini = parseFloat(s[1]);
    if (e && ini !== null) { silencios.push([ini, parseFloat(e[1])]); ini = null; }
  }
  if (ini !== null) silencios.push([ini, total]);

  // início = fim do silêncio que começa em 0 (se houver)
  let inicio = 0;
  if (silencios.length && silencios[0][0] < 0.01) inicio = silencios[0][1];
  // fim = começo do primeiro silêncio >= 0.25s depois do início (ou fim do arquivo)
  let fim = total;
  for (const [a, b] of silencios) {
    if (a > inicio && b - a >= 0.25) { fim = a; break; }
  }
  inicio = Math.max(0, inicio - PRE_ROLL);
  const duracao = Math.min(total - inicio, Math.max(MIN[familia], Math.min(MAX[familia], fim - inicio)));

  const vd = ff(["-ss", String(inicio), "-t", String(duracao), "-i", file, "-af", "volumedetect", "-f", "null", "-"]);
  const mean = parseFloat((vd.match(/mean_volume: (-?[\d.]+) dB/) || [])[1]);
  const peak = parseFloat((vd.match(/max_volume: (-?[\d.]+) dB/) || [])[1]);
  // ganho para levar o trecho ao nível-alvo: no máx. +6 dB e sem passar de -3 dBFS de pico
  let gDb = ALVO_DB - mean;
  gDb = Math.min(gDb, -3 - peak, GANHO_MAX_DB);
  return {
    arquivo: rel,
    familia,
    inicio: +inicio.toFixed(3),
    duracao: +duracao.toFixed(3),
    ganho: +Math.pow(10, gDb / 20).toFixed(3),
    meanDb: mean,
    peakDb: peak,
    total: +total.toFixed(3),
  };
};

const itens = listar().map(medir);
const tabela = {};
for (const i of itens) tabela[i.arquivo] = { inicio: i.inicio, duracao: i.duracao, ganho: i.ganho };
fs.writeFileSync(OUT, JSON.stringify(tabela, null, 2) + "\n");
for (const i of itens) console.log(`${i.arquivo.padEnd(34)} ini=${i.inicio} dur=${i.duracao} mean=${i.meanDb} pico=${i.peakDb} ganho=${i.ganho}`);
