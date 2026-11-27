import { execFileSync } from "node:child_process";
import fs from "node:fs";
import type { Timing } from "../schema/scenes";
import { buildPlan } from "../remotion/director";
import { buildMusicPlan, musicIssues } from "../schema/music";
import { FPS, faceRatioAtClose } from "../remotion/layout";
import { loadEpisode, paths } from "./paths";
import { probeDuration } from "./timing";

export const METAS = {
  visualChangesPer10s: 13,
  closeShare: 0.33,
  firstFrameFace: [0.4, 0.5] as const,
  maxDropDb: 10,
  loopDiff: 0.02,
  maxSeconds: 60,
};

const VISUAL = new Set(["cutOnWord", "punchIn", "shake", "cut", "expression", "pan"]);

function frameGray(file: string, t: number) {
  return execFileSync("ffmpeg", ["-v", "error", "-ss", t.toFixed(4), "-i", file, "-frames:v", "1", "-vf", "scale=108:192", "-f", "rawvideo", "-pix_fmt", "gray", "-"], { maxBuffer: 1 << 24 });
}

function windowsDb(file: string, win = 0.25) {
  const rate = 16000;
  const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(rate), "-f", "s16le", "-"], { maxBuffer: 1 << 28 });
  const n = Math.floor(rate * win);
  const out: number[] = [];
  for (let o = 0; o + n * 2 <= pcm.length; o += n * 2) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      const v = pcm.readInt16LE(o + i * 2) / 32768;
      s += v * v;
    }
    out.push(10 * Math.log10(s / n + 1e-12));
  }
  return out;
}

export function runAudit(slug: string) {
  const ep = loadEpisode(slug);
  const p = paths(slug);
  const timing = JSON.parse(fs.readFileSync(p.timing, "utf8")) as Timing;
  if (!fs.existsSync(p.out)) throw new Error(`render não existe: ${p.out}`);
  const plan = buildPlan(ep, timing);
  const seconds = timing.durationInFrames / FPS;
  const linesWithCut = new Set(ep.scenes.flatMap((s) => s.lines).filter((l) => l.cutOnWord).map((l) => l.id));
  const changes = timing.events.filter((e) => VISUAL.has(e.kind) || (e.kind === "lineStart" && e.frame > 0 && !linesWithCut.has(e.lineId))).length;
  const per10 = changes / (seconds / 10);
  const closeFrames = plan.segments.filter((s) => s.shot === "close").reduce((a, s) => a + (s.end - s.start), 0);
  const closeShare = closeFrames / timing.durationInFrames;
  const first = plan.segments[0];
  const firstH = ep.characters.find((c) => c.id === first.focusId)?.look?.height ?? 1;
  const face = first.shot === "close" ? (faceRatioAtClose(firstH) / firstH) * 1.03 : 0;

  const music = buildMusicPlan(ep.scenes, (id) => plan.segments.find((s) => s.sceneId === id)!.start, timing.durationInFrames, FPS);
  const musicErrors = musicIssues(ep.scenes);
  const tolerated = [
    ...(music.silence ? [music.silence] : []),
    ...music.segments.filter((m) => m.track === "travessura").map((m) => [m.from, m.to] as [number, number]),
  ].map(([a, b]) => [a / FPS - 0.25, b / FPS + 0.25]);

  const db = windowsDb(p.out);
  const inner = db.slice(1, -1);
  const mean = inner.reduce((a, b) => a + b, 0) / inner.length;
  const minDb = Math.min(...inner);
  const drops = inner
    .map((v, i) => ({ t: Number(((i + 1) * 0.25).toFixed(2)), db: Number(v.toFixed(1)) }))
    .filter((x) => x.db < mean - METAS.maxDropDb)
    .filter((x) => tolerated.every(([a, b]) => x.t + 0.25 <= a || x.t >= b));

  const dur = probeDuration(p.out);
  const a = frameGray(p.out, 0);
  const b = frameGray(p.out, Math.max(0, Math.min(dur, timing.durationInFrames / FPS) - 1.5 / FPS));
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff += Math.abs(a[i] - b[i]);
  const loopDiff = diff / a.length / 255;

  const allLines = ep.scenes.flatMap((s) => s.lines);
  const subMid = allLines.slice(0, -1).filter((l) => /inscrev|sininho|ative o sino|ativa o sino/i.test(l.text)).map((l) => l.id);

  const metrics = {
    visualChangesPer10s: { value: Number(per10.toFixed(2)), meta: `>= ${METAS.visualChangesPer10s}`, pass: per10 >= METAS.visualChangesPer10s, detail: { changes, seconds: Number(seconds.toFixed(2)) } },
    closeShare: { value: Number(closeShare.toFixed(3)), meta: `>= ${METAS.closeShare}`, pass: closeShare >= METAS.closeShare },
    firstFrameFace: { value: Number(face.toFixed(3)), meta: "0.40-0.50 da altura", pass: face >= METAS.firstFrameFace[0] && face <= METAS.firstFrameFace[1], detail: { shot: first.shot, focus: first.focusId } },
    volumeDrops: { value: drops.length, meta: `nenhuma janela ${METAS.maxDropDb} dB abaixo da média (fora da travessura e do silêncio da reviravolta)`, pass: drops.length === 0, detail: { meanDb: Number(mean.toFixed(1)), minDb: Number(minDb.toFixed(1)), drops: drops.slice(0, 20) } },
    loop: { value: Number(loopDiff.toFixed(4)), meta: `< ${METAS.loopDiff}`, pass: loopDiff < METAS.loopDiff },
    duration: { value: Number(dur.toFixed(2)), meta: `<= ${METAS.maxSeconds}s`, pass: dur <= METAS.maxSeconds },
    music: {
      value: musicErrors.length,
      meta: "só as 4 faixas, no máximo 3, silêncio só na reviravolta, final em tema",
      pass: musicErrors.length === 0,
      detail: { errors: musicErrors, scenes: music.scenes.map((m) => `${m.sceneId}:${m.track}`), segments: music.segments.map((m) => `${m.track} ${m.from}-${m.to}`) },
    },
    subscribeCtaMidVideo: { value: subMid.length, meta: "proibido", pass: subMid.length === 0, detail: subMid },
  };
  // Métricas só de aviso: aparecem no relatório, mas não reprovam o episódio.
  const warnOnly = new Set<string>(["volumeDrops"]);
  const approved = Object.entries(metrics).every(([k, m]) => m.pass || warnOnly.has(k));
  const warnings = Object.entries(metrics).filter(([k, m]) => !m.pass && warnOnly.has(k)).map(([k]) => k);
  const report = { slug, approved, warnings, generatedAt: new Date().toISOString(), video: p.out, metrics };
  fs.writeFileSync(p.audit, JSON.stringify(report, null, 2));
  for (const [k, m] of Object.entries(metrics)) console.log(`${m.pass ? "OK  " : warnOnly.has(k) ? "AVISO" : "FAIL"} ${k}: ${m.value} (meta ${m.meta})`);
  console.log(approved ? (warnings.length ? `APROVADO com aviso: ${warnings.join(", ")}` : "APROVADO") : "REPROVADO");
  return report;
}

if (process.argv[1]?.endsWith("audit.ts")) {
  try {
    const r = runAudit(process.argv[2]);
    process.exit(r.approved ? 0 : 2);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
