#!/usr/bin/env node
// Zanathos Ep. 2: narração única na voz do Rod (ElevenLabs eleven_v4), +5% de velocidade, words.json com tempos.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).flatMap((l) => { const m = l.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/); return m && !l.trim().startsWith("#") ? [[m[1], m[2].replace(/^(["'])(.*)\1$/, "$2")]] : []; }));
const DIR = "public/rodzandonadi/episodes/zanathos-ep2/audio";
const texto = fs.readFileSync("marcas/rodzandonadi/videos/zanathos-ep2/narracao.md", "utf8").trim().split(/\n\s*\n/).join("\n\n");
const VEL = 1.05;
const SETTINGS = { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true };
const raw = `${DIR}/narracao-raw.mp3`;
let j;
if (fs.existsSync(`${DIR}/raw.json`)) j = JSON.parse(fs.readFileSync(`${DIR}/raw.json`, "utf8"));
else {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_ROD_VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ text: texto, model_id: "eleven_v4", voice_settings: SETTINGS }) });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 200)}`);
  j = await r.json();
  fs.writeFileSync(raw, Buffer.from(j.audio_base64, "base64"));
  fs.writeFileSync(`${DIR}/raw.json`, JSON.stringify({ alignment: j.alignment }));
  j = { alignment: j.alignment };
}
const a = j.alignment;
const words = [];
let cur = null;
a.characters.forEach((c, i) => {
  if (/\s/.test(c)) { if (cur) { words.push(cur); cur = null; } return; }
  if (!cur) cur = { w: "", s: a.character_start_times_seconds[i] / VEL, e: 0 };
  cur.w += c; cur.e = a.character_end_times_seconds[i] / VEL;
});
if (cur) words.push(cur);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-af", `atempo=${VEL}`, "-c:a", "libmp3lame", "-b:a", "192k", `${DIR}/narracao.mp3`]);
const fim = words[words.length - 1].e;
fs.writeFileSync(`${DIR}/words.json`, JSON.stringify({ model: "eleven_v4", settings: SETTINGS, vel: VEL, fim, words }, null, 1));
console.log(`${words.length} palavras, narração ${fim.toFixed(1)} s`);
