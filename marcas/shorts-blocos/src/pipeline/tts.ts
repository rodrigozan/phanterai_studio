import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadEpisode, paths, resolveVoice } from "./paths";

export const MODEL = "eleven_multilingual_v2";
const SETTINGS = { stability: 0.38, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.08 };

export type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };
export type AlignmentFile = { hash: string; voiceId: string; text: string; alignment: Alignment };

async function synth(voiceId: string, text: string) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY não definido no .env");
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "xi-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS, language_code: "pt" }),
    });
    if (res.ok) return (await res.json()) as { audio_base64: string; alignment: Alignment };
    const body = await res.text();
    if (res.status < 500 && res.status !== 429) throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 300)}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
  throw new Error("ElevenLabs falhou 3 vezes");
}

export async function runTts(slug: string) {
  const ep = loadEpisode(slug);
  const p = paths(slug);
  fs.mkdirSync(p.audio, { recursive: true });
  const all = ep.scenes.flatMap((s) => s.lines);
  const chars = new Map(ep.characters.map((c) => [c.id, c]));
  let made = 0;
  let cached = 0;
  const jobs = all.map((line) => async () => {
    const voiceId = resolveVoice(chars.get(line.characterId)!.voiceId);
    const hash = crypto.createHash("sha1").update(JSON.stringify([MODEL, SETTINGS, voiceId, line.text])).digest("hex");
    const mp3 = path.join(p.audio, `${line.id}.mp3`);
    const js = path.join(p.audio, `${line.id}.json`);
    if (fs.existsSync(mp3) && fs.existsSync(js)) {
      const old = JSON.parse(fs.readFileSync(js, "utf8")) as AlignmentFile;
      if (old.hash === hash) {
        cached++;
        return;
      }
    }
    const r = await synth(voiceId, line.text);
    fs.writeFileSync(mp3, Buffer.from(r.audio_base64, "base64"));
    fs.writeFileSync(js, JSON.stringify({ hash, voiceId, text: line.text, alignment: r.alignment } satisfies AlignmentFile));
    made++;
  });
  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: 3 }, async () => {
      while (queue.length) await queue.shift()!();
    }),
  );
  const keep = new Set(all.flatMap((l) => [`${l.id}.mp3`, `${l.id}.json`]));
  for (const f of fs.readdirSync(p.audio)) if (!keep.has(f)) fs.unlinkSync(path.join(p.audio, f));
  console.log(`tts: ${made} geradas, ${cached} do cache`);
}

if (process.argv[1]?.endsWith("tts.ts")) {
  runTts(process.argv[2]).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
