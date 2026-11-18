#!/usr/bin/env node
/**
 * long-voz.js - narração de um vídeo longo na voz do Rod (ElevenLabs), uma cena por vez.
 *
 *     node scripts/long-voz.js <slug>
 *
 * Lê public/<marca>/episodes/long-videos/<slug>/roteiro.json (cenas[].fala), gera voz/<id>.mp3 e
 * voz/<id>.json (palavras com tempo) e cola tudo em voz.mp3. Cena cuja fala não mudou NÃO é
 * gerada de novo (cache pelo hash do texto): não gasta crédito à toa. Modelo eleven_v4,
 * stability 0.5, sem style e sem speed (ver memória feedback-voz-eleven-v4).
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const MARCA = process.env.MARCA || "phanterai";
const GAP = 0.35; // respiro entre cenas (s)
const MODEL = "eleven_v4";
const SETTINGS = { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true };

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/long-voz.js <slug>"); process.exit(2); }
const dir = path.join(ROOT, "public", MARCA, "episodes", "long-videos", slug);
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env"), "utf8").split(/\r?\n/).flatMap((l) => {
  const m = l.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/);
  return m && !l.trim().startsWith("#") ? [[m[1], m[2].replace(/^(["'])(.*)\1$/, "$2")]] : [];
}));
const KEY = env.ELEVENLABS_API_KEY, VOICE = env.ELEVENLABS_ROD_VOICE_ID;
if (!KEY || !VOICE) { console.error("ELEVENLABS_API_KEY / ELEVENLABS_ROD_VOICE_ID ausentes no .env"); process.exit(1); }
const hide = (s) => String(s).split(KEY).join("***");

const roteiro = JSON.parse(fs.readFileSync(path.join(dir, "roteiro.json"), "utf8"));
fs.mkdirSync(path.join(dir, "voz"), { recursive: true });

const palavrasDe = (a) => {
  const words = []; let cur = null;
  a.characters.forEach((c, i) => {
    if (/\s/.test(c)) { if (cur) { words.push(cur); cur = null; } return; }
    if (!cur) cur = { w: "", s: a.character_start_times_seconds[i], e: 0 };
    cur.w += c; cur.e = a.character_end_times_seconds[i];
  });
  if (cur) words.push(cur);
  return words;
};

(async () => {
  let gerou = 0;
  for (const c of roteiro.cenas) {
    const hash = crypto.createHash("sha1").update(`${MODEL}|${JSON.stringify(SETTINGS)}|${c.fala}`).digest("hex").slice(0, 12);
    const mp3 = path.join(dir, "voz", `${c.id}.mp3`), meta = path.join(dir, "voz", `${c.id}.json`);
    if (fs.existsSync(mp3) && fs.existsSync(meta) && JSON.parse(fs.readFileSync(meta, "utf8")).hash === hash) { console.log(c.id, "cache"); continue; }
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ text: c.fala, model_id: MODEL, voice_settings: SETTINGS, language_code: "pt" }),
    });
    if (!r.ok) { console.error(c.id, "HTTP", r.status, hide((await r.text()).slice(0, 300))); process.exit(1); }
    const j = await r.json();
    fs.writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
    const dur = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).toString());
    fs.writeFileSync(meta, JSON.stringify({ hash, dur, words: palavrasDe(j.alignment) }, null, 1));
    gerou++;
    console.log(c.id, "gerada", dur.toFixed(2) + "s");
  }

  // Decodifica cada cena para WAV (duração exata em amostras: mp3 solto tem atraso do codificador e
  // a soma das durações do ffprobe não bate com o áudio colado, o que atrasava a legenda cena a cena)
  // e cola tudo com um respiro entre as cenas. A duração real vai para voz/<id>.json (campo dur).
  const wav = (id) => path.join(dir, "voz", `${id}.wav`);
  const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
  const sil = path.join(dir, "voz", "_gap.wav");
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(GAP), "-c:a", "pcm_s16le", sil]);
  for (const c of roteiro.cenas) {
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", path.join(dir, "voz", `${c.id}.mp3`), "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", wav(c.id)]);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, "voz", `${c.id}.json`), "utf8"));
    meta.dur = dur(wav(c.id));
    fs.writeFileSync(path.join(dir, "voz", `${c.id}.json`), JSON.stringify(meta, null, 1));
  }
  const lista = roteiro.cenas.flatMap((c, i) => [`file '${wav(c.id)}'`, ...(i < roteiro.cenas.length - 1 ? [`file '${sil}'`] : [])]).join("\n");
  fs.writeFileSync(path.join(dir, "voz", "_lista.txt"), lista);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", path.join(dir, "voz", "_lista.txt"), "-ar", "44100", "-b:a", "192k", path.join(dir, "voz.mp3")]);
  for (const c of roteiro.cenas) fs.rmSync(wav(c.id), { force: true });
  fs.rmSync(sil, { force: true });
  console.log("voz.mp3 pronto; cenas novas:", gerou);
})();
