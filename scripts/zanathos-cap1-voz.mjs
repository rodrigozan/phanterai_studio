#!/usr/bin/env node
// Zanathos Cap. 1: narração por cena na voz do Rod (ElevenLabs eleven_v4), cache por hash, pausas controladas.
// node scripts/zanathos-cap1-voz.mjs [parte ...]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).flatMap((l) => { const m = l.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/); return m && !l.trim().startsWith("#") ? [[m[1], m[2].replace(/^(["'])(.*)\1$/, "$2")]] : []; }));
const roteiro = JSON.parse(fs.readFileSync("marcas/rodzandonadi/videos/zanathos-cap1/roteiro.json", "utf8"));
const DIR = "public/rodzandonadi/episodes/zanathos-cap1/audio";
const CACHE = `${DIR}/cache`;
fs.mkdirSync(CACHE, { recursive: true });
const MODEL = "eleven_v4";
const SETTINGS = { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true };
const LEAD = 0.4;
const TAIL = 3.0;
const VEL = { 1: 1.06, 2: 1.06, 3: 1.02, 4: 1.0 };
const alvo = process.argv.slice(2).map(Number);
const ff = (...a) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...a]);
const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

const cena = async (texto) => {
  const h = crypto.createHash("sha1").update(`${MODEL}|${JSON.stringify(SETTINGS)}|${env.ELEVENLABS_ROD_VOICE_ID}|${texto}`).digest("hex").slice(0, 16);
  const mp3 = `${CACHE}/${h}.mp3`;
  const js = `${CACHE}/${h}.json`;
  if (fs.existsSync(mp3) && fs.existsSync(js)) return { mp3, words: JSON.parse(fs.readFileSync(js, "utf8")) };
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_ROD_VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: texto, model_id: MODEL, voice_settings: SETTINGS }),
  });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  fs.writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
  const a = j.alignment;
  const words = [];
  let cur = null;
  a.characters.forEach((c, i) => {
    if (/\s/.test(c)) { if (cur) { words.push(cur); cur = null; } return; }
    if (!cur) cur = { w: "", s: a.character_start_times_seconds[i], e: 0 };
    cur.w += c; cur.e = a.character_end_times_seconds[i];
  });
  if (cur) words.push(cur);
  fs.writeFileSync(js, JSON.stringify(words));
  return { mp3, words };
};

for (const p of roteiro.partes) {
  if (alvo.length && !alvo.includes(p.n)) continue;
  const pecas = [];
  const words = [];
  const cenas = [];
  const ecos = [];
  let cursor = LEAD;
  ff("-f", "lavfi", "-i", `anullsrc=r=44100:cl=mono`, "-t", String(LEAD), `${CACHE}/p${p.n}-lead.wav`);
  pecas.push(`${CACHE}/p${p.n}-lead.wav`);
  for (const c of p.cenas) {
    const { mp3, words: ws } = await cena(c.texto);
    const wav = mp3.replace(".mp3", `-v${VEL[p.n] || 1}.wav`);
    const vel = VEL[p.n] || 1;
    ff("-i", mp3, "-ar", "44100", "-ac", "1", "-af", `atempo=${vel}`, wav);
    const d = dur(wav);
    pecas.push(wav);
    ws.forEach((w) => words.push({ w: w.w, s: +(cursor + w.s / vel).toFixed(3), e: +(cursor + w.e / vel).toFixed(3), c: c.id }));
    cenas.push({ id: c.id, start: +cursor.toFixed(3), end: +(cursor + d).toFixed(3) });
    if (c.eco) ecos.push({ wav, start: cursor });
    cursor += d;
    if (c.pausaDepois > 0) {
      const sil = `${CACHE}/sil-${c.pausaDepois}.wav`;
      ff("-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(c.pausaDepois), sil);
      pecas.push(sil);
      cursor += c.pausaDepois;
    }
  }
  const lista = `${CACHE}/p${p.n}-lista.txt`;
  fs.writeFileSync(lista, pecas.map((f) => `file '${path.resolve(f)}'`).join("\n"));
  ff("-f", "concat", "-safe", "0", "-i", lista, "-c:a", "libmp3lame", "-b:a", "192k", `${DIR}/narracao-p${p.n}.mp3`);
  for (const e of ecos) {
    const ms = Math.round((e.start + 0.6) * 1000);
    ff("-i", e.wav, "-af", `asetrate=44100*0.8409,aresample=44100,atempo=1.18921,adelay=${ms},volume=0.8`, "-c:a", "libmp3lame", "-b:a", "128k", `${DIR}/eco-p${p.n}.mp3`);
  }
  const fim = cenas[cenas.length - 1].end;
  fs.writeFileSync(`${DIR}/words-p${p.n}.json`, JSON.stringify({ model: MODEL, settings: SETTINGS, fim: +fim.toFixed(3), dur: +(cursor + TAIL).toFixed(3), cenas, words }, null, 1));
  console.log(`parte ${p.n}: narração ${fim.toFixed(1)} s, vídeo ${(cursor + TAIL).toFixed(1)} s, ${words.length} palavras`);
}
