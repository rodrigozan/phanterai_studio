import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { Episode, type EpisodeT } from "../schema/scenes";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../../..");
config({ path: path.join(ROOT, ".env"), quiet: true });

export const MARCA = "afamiliaquadrada";

export function paths(slug: string) {
  const ep = path.join(ROOT, "public", MARCA, "episodes", slug);
  return {
    ep,
    scenes: path.join(ep, "scenes.json"),
    audio: path.join(ep, "audio"),
    timing: path.join(ep, "timing.json"),
    props: path.join(ep, "props.json"),
    audit: path.join(ep, "audit.json"),
    out: path.join(ROOT, "out", MARCA, `${slug}.mp4`),
    staticAudio: (id: string) => `${MARCA}/episodes/${slug}/audio/${id}.voz.mp3`,
  };
}

export function loadEpisode(slug: string): EpisodeT {
  const raw = JSON.parse(fs.readFileSync(paths(slug).scenes, "utf8"));
  const r = Episode.safeParse(raw);
  if (!r.success) {
    const msg = r.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`scenes.json inválido (${slug}):\n${msg}`);
  }
  if (r.data.slug !== slug) throw new Error(`slug do scenes.json (${r.data.slug}) difere da pasta (${slug})`);
  return r.data;
}

export function resolveVoice(voiceId: string) {
  if (voiceId === "$NARRATOR") {
    const v = process.env.ELEVENLABS_NARRATOR_VOICE_ID || process.env.ELEVENLABS_STORY_NARRATOR_VOICE_ID;
    if (!v) throw new Error("ELEVENLABS_NARRATOR_VOICE_ID não definido no .env");
    return v;
  }
  return voiceId;
}
