#!/usr/bin/env node
// Renderiza um Reels 9:16 (1080x1920, 30 fps) a partir de um storyboard JSON, só com ffmpeg:
// movimento de câmera variado por cena, transições variadas, textura (grão, vinheta, brilho), cartela de texto,
// música e efeitos sonoros sintéticos. Um render por vez (o fluxo cuida da fila).
//   node render.mjs storyboard.json
// storyboard: { out, music?, musicVolume?, fadeOut?, scenes: [{ image, dur, effect, text?, fx?, transition?, audio? }] }
//   audio (opcional, por cena): narração da cena; a cena dura pelo menos a narração + 0,4 s e a voz entra no começo dela.
//   Com narração, a música cai para musicVolume (padrão 0.22); sem narração, 0.9.
//   effect: zoom-in zoom-out pan-left pan-right pan-up pan-down drift shake pulse sway dolly
//   terminal (opcional, por cena): { lines: ["$ comando digitado", {out:"saída"}], cps?, title? } painel de terminal sobre a imagem:
//     linhas string são digitadas caractere a caractere com cursor piscando; {out} aparece de uma vez, depois. A digitação acelera para caber na cena.
//   fx (lista): grain vignette flicker bloom flash shake-hit desat
//   transition (entrando nesta cena): fade fadeblack dissolve wipeleft wiperight slideup slidedown circleopen zoomin radial pixelize
import { readFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const W = 1080; const H = 1920; const FPS = 30; const XF = 0.7;
const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf';
const sbPath = process.argv[2];
if (!sbPath) { console.error('uso: render.mjs storyboard.json'); process.exit(2); }
const sb = JSON.parse(readFileSync(sbPath, 'utf8'));
if (!sb.out || !Array.isArray(sb.scenes) || !sb.scenes.length) { console.error('storyboard sem out ou scenes'); process.exit(2); }
for (const [i, s] of sb.scenes.entries()) if (!s.image || !existsSync(s.image)) { console.error(`cena ${i + 1}: imagem não existe: ${s.image}`); process.exit(2); }
mkdirSync(dirname(sb.out), { recursive: true });
const work = mkdtempSync(join(tmpdir(), 'anime-reel-'));

const run = (argv, label) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-threads', '2', ...argv], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(`ffmpeg falhou (${label}): ${r.stderr.slice(-800)}`); rmSync(work, { recursive: true, force: true }); process.exit(1); }
};

// Movimento de câmera (zoompan sobre a imagem ampliada). n = frames da cena; progresso p = on/n.
const CX = 'iw/2-(iw/zoom/2)'; const CY = 'ih/2-(ih/zoom/2)';
const motions = (n) => ({
  'zoom-in': { z: `1+0.28*on/${n}`, x: CX, y: CY },
  'zoom-out': { z: `1.28-0.28*on/${n}`, x: CX, y: CY },
  'pan-left': { z: '1.25', x: `(iw-iw/zoom)*(1-on/${n})`, y: CY },
  'pan-right': { z: '1.25', x: `(iw-iw/zoom)*on/${n}`, y: CY },
  'pan-up': { z: '1.25', x: CX, y: `(ih-ih/zoom)*(1-on/${n})` },
  'pan-down': { z: '1.25', x: CX, y: `(ih-ih/zoom)*on/${n}` },
  drift: { z: `1.12+0.1*on/${n}`, x: `(iw-iw/zoom)*(0.2+0.6*on/${n})`, y: `(ih-ih/zoom)*(0.7-0.5*on/${n})` },
  shake: { z: '1.1', x: `${CX}+sin(on*1.7)*14+sin(on*0.53)*9`, y: `${CY}+cos(on*2.1)*14+sin(on*0.41)*9` },
  pulse: { z: `1.1+0.05*sin(2*PI*on/${Math.max(24, Math.round(n / 2))})`, x: CX, y: CY },
  sway: { z: '1.2', x: `(iw-iw/zoom)*(0.5+0.4*sin(2*PI*on/${n}))`, y: CY },
  dolly: { z: `1+0.35*on/${n}`, x: `(iw-iw/zoom)*(0.3+0.4*on/${n})`, y: `(ih-ih/zoom)*(0.55-0.15*on/${n})` },
});
const EFFECTS = Object.keys(motions(30));

const escText = (t) => String(t).replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, '’').replace(/%/g, '\\%');
function textFilter(text, dur) {
  const lines = String(text).split('\n').filter(Boolean);
  const fs = 56; const lh = 78; const y0 = H - 574 - (lines.length - 1) * lh;
  const fade = `if(lt(t,0.5),t/0.5,if(gt(t,${(dur - 0.5).toFixed(2)}),(${dur.toFixed(2)}-t)/0.5,1))`;
  return lines.map((ln, i) => `drawtext=fontfile=${FONT}:text='${escText(ln)}':fontsize=${fs}:fontcolor=white:borderw=3:bordercolor=black@0.85:box=1:boxcolor=black@0.35:boxborderw=18:x=(w-text_w)/2:y=${y0 + i * lh}:alpha='${fade}'`).join(',');
}

// Terminal com digitação: painel escuro, monoespaçado (DejaVu Sans Mono), cursor piscando, saída após o comando.
const MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf';
function terminalFilter(term, dur) {
  const fs = 38; const cw = fs * 0.602; const lh = 56; const px = 70; const cols = Math.floor((W - 2 * px - 40) / cw);
  const wrap = (t) => { const o = []; for (let k = 0; k < t.length || !o.length; k += cols) o.push(t.slice(k, k + cols)); return o; };
  const rows = [];
  for (const l of term.lines || []) {
    const typed = typeof l === 'string';
    for (const part of wrap(typed ? l : String(l.out ?? ''))) rows.push({ typed, text: part });
  }
  if (!rows.length) return '';
  const chars = rows.filter((r) => r.typed).reduce((a, r) => a + r.text.length, 0);
  const outs = rows.filter((r) => !r.typed).length;
  const fixed = 0.5 + outs * 0.3 + rows.filter((r) => r.typed).length * 0.25 + 0.8;
  const cps = Math.max(Number(term.cps) || 22, chars / Math.max(0.5, dur - fixed));
  const top = Math.round(H / 2 - (rows.length * lh) / 2 - 60); const bh = rows.length * lh + 56 + 36 + lh + 10;
  const f = [`drawbox=x=${px - 30}:y=${top}:w=${W - 2 * px + 60}:h=${bh}:color=black@0.82:t=fill`, `drawbox=x=${px - 30}:y=${top}:w=${W - 2 * px + 60}:h=56:color=0x2b2b2b@0.95:t=fill`];
  ['0xff5f57', '0xfebc2e', '0x28c840'].forEach((c, k) => f.push(`drawbox=x=${px + k * 38}:y=${top + 18}:w=20:h=20:color=${c}:t=fill`));
  if (term.title) f.push(`drawtext=fontfile=${MONO}:text='${escText(term.title)}':fontsize=26:fontcolor=white@0.7:x=(w-text_w)/2:y=${top + 14}`);
  let t = 0.5; let cur = null;
  const y0 = top + 56 + 36;
  rows.forEach((r, ri) => {
    const y = y0 + ri * lh;
    if (r.typed) {
      const col = r.text.startsWith('$') || r.text.startsWith('>') ? '0x7CFC9A' : 'white';
      for (let k = 1; k <= r.text.length; k += 1) {
        const a = t + (k - 1) / cps; const b = k === r.text.length ? dur + 1 : t + k / cps;
        f.push(`drawtext=fontfile=${MONO}:text='${escText(r.text.slice(0, k))}':fontsize=${fs}:fontcolor=${col}:x=${px}:y=${y}:enable='between(t,${a.toFixed(3)},${b.toFixed(3)})'`);
      }
      const end = t + r.text.length / cps;
      cur = { y, x: px + r.text.length * cw, from: t, to: end };
      // cursor sólido enquanto digita; pisca até a próxima linha começar
      const next = end + 0.25;
      f.push(`drawtext=fontfile=${MONO}:text='█':fontsize=${fs}:fontcolor=white:x='${px}+${(r.text.length * cw).toFixed(1)}*clip((t-${t.toFixed(3)})*${cps.toFixed(3)}/${r.text.length},0,1)':y=${y}:enable='between(t,${t.toFixed(3)},${(next + 0.3).toFixed(3)})*(lt(t,${end.toFixed(3)})+lt(mod(t,0.8),0.4))'`);
      t = next;
    } else {
      const a = t + 0.05;
      f.push(`drawtext=fontfile=${MONO}:text='${escText(r.text)}':fontsize=${fs}:fontcolor=0xd0d0d0:x=${px}:y=${y}:enable='gte(t,${a.toFixed(3)})'`);
      t += 0.3;
    }
  });
  // cursor final piscando depois da última linha
  const last = rows[rows.length - 1]; const ly = y0 + (rows.length - 1) * lh;
  if (last.typed) f.push(`drawtext=fontfile=${MONO}:text='█':fontsize=${fs}:fontcolor=white:x=${px + last.text.length * cw}:y=${ly}:enable='gte(t,${t.toFixed(3)})*lt(mod(t,0.8),0.4)'`);
  else f.push(`drawtext=fontfile=${MONO}:text='█':fontsize=${fs}:fontcolor=white:x=${px}:y=${ly + lh}:enable='gte(t,${t.toFixed(3)})*lt(mod(t,0.8),0.4)'`);
  return f.join(',');
}

const clips = [];
const audioLen = (f) => Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout) || 0;
sb.scenes.forEach((s, i) => {
  if (s.audio && !existsSync(s.audio)) { console.error(`cena ${i + 1}: áudio não existe: ${s.audio}`); process.exit(2); }
  const dur = Math.max(Number(s.dur) || 6, s.audio ? audioLen(s.audio) + 0.4 : 0);
  const n = Math.round(dur * FPS);
  const effect = EFFECTS.includes(s.effect) ? s.effect : EFFECTS[i % EFFECTS.length];
  const m = motions(n)[effect];
  const fx = new Set(s.fx || []);
  const chain = [
    `scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2}`,
    `zoompan=z='${m.z}':x='${m.x}':y='${m.y}':d=${n}:s=${W}x${H}:fps=${FPS}`,
  ];
  if (effect === 'sway' || effect === 'shake') chain.push(`rotate=a='${effect === 'sway' ? 0.025 : 0.012}*sin(2*PI*t/${effect === 'sway' ? Math.max(3, dur) : 0.6})':c=black:ow=${W}:oh=${H}`);
  if (fx.has('desat')) chain.push('eq=saturation=0.55:contrast=1.1');
  if (fx.has('bloom')) chain.push('split[a][b];[b]gblur=sigma=28,eq=brightness=0.02[g];[a][g]blend=all_mode=screen:all_opacity=0.35');
  if (fx.has('flicker')) chain.push(`eq=brightness='0.035*sin(t*9)+0.02*sin(t*23)':eval=frame`);
  if (fx.has('vignette') || !s.fx) chain.push('vignette=PI/5');
  if (fx.has('grain') || !s.fx) chain.push('noise=alls=3:allf=t');
  if (fx.has('shake-hit')) chain.push(`crop=iw:ih:x='if(lt(t,0.4),sin(t*90)*16,0)':y='if(lt(t,0.4),cos(t*80)*16,0)'`);
  if (fx.has('flash')) chain.push('fade=t=in:st=0:d=0.35:color=white');
  if (s.terminal) { const tf = terminalFilter(s.terminal, dur); if (tf) chain.push(tf); }
  if (s.text) chain.push(textFilter(s.text, dur));
  chain.push('format=yuv420p');
  const file = join(work, `c${i}.mp4`);
  run(['-i', s.image, '-frames:v', String(n), '-vf', chain.join(','), '-r', String(FPS), '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', file], `cena ${i + 1} (${effect})`);
  console.error(`cena ${i + 1}/${sb.scenes.length}: ${effect} ${dur}s`);
  clips.push({ file, dur, transition: s.transition, audio: s.audio });
});

// Transições entre as cenas (xfade encadeado) e áudio.
const TRANS = ['fade', 'fadeblack', 'dissolve', 'wipeleft', 'slideup', 'circleopen', 'zoomin', 'wiperight', 'radial', 'slidedown', 'pixelize'];
const inputs = clips.flatMap((c) => ['-i', c.file]);
let vlabel = '[0:v]'; let acc = clips[0].dur; const filters = []; const cuts = [];
for (let i = 1; i < clips.length; i += 1) {
  const tr = TRANS.includes(clips[i].transition) ? clips[i].transition : TRANS[(i - 1) % TRANS.length];
  const offset = (acc - XF).toFixed(3);
  const next = i === clips.length - 1 ? '[vout]' : `[v${i}]`;
  filters.push(`${vlabel}[${i}:v]xfade=transition=${tr}:duration=${XF}:offset=${offset}${next}`);
  cuts.push(Number(offset));
  vlabel = next; acc += clips[i].dur - XF;
}
if (clips.length === 1) filters.push('[0:v]null[vout]');
const total = acc;

const audio = []; let aIdx = clips.length; const extra = [];
// Ruído de "whoosh" em cada transição, sintético e baixo.
cuts.forEach((t, k) => {
  extra.push('-f', 'lavfi', '-t', '1.2', '-i', 'anoisesrc=color=pink:amplitude=0.5');
  audio.push(`[${aIdx}:a]highpass=f=300,lowpass=f='2500',afade=t=in:d=0.4,afade=t=out:st=0.5:d=0.7,volume=0.18,adelay=${Math.round((t - 0.1) * 1000)}|${Math.round((t - 0.1) * 1000)}[w${k}]`);
  aIdx += 1;
});
const mix = [];
let starts = 0;
const hasVoice = clips.some((c) => c.audio);
clips.forEach((c, i) => {
  if (c.audio) {
    extra.push('-i', c.audio);
    const at = Math.round(starts * 1000);
    audio.push(`[${aIdx}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay=${at}|${at},volume=1.4[vz${i}]`);
    mix.push(`[vz${i}]`);
    aIdx += 1;
  }
  starts += c.dur - XF;
});
if (sb.music && existsSync(sb.music)) {
  extra.push('-stream_loop', '-1', '-i', sb.music);
  const fo = Number(sb.fadeOut) || 2.5;
  audio.push(`[${aIdx}:a]atrim=0:${total.toFixed(2)},afade=t=in:d=1.2,afade=t=out:st=${(total - fo).toFixed(2)}:d=${fo},volume=${Number(sb.musicVolume) || (hasVoice ? 0.22 : 0.9)}[mus]`);
  mix.push('[mus]');
}
cuts.forEach((_, k) => mix.push(`[w${k}]`));
if (!mix.length) { extra.push('-f', 'lavfi', '-t', total.toFixed(2), '-i', 'anullsrc=r=44100:cl=stereo'); mix.push(`[${aIdx}:a]`); }
audio.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:${total.toFixed(2)}[aout]`);

run([...inputs, ...extra, '-filter_complex', [...filters, ...audio].join(';'), '-map', '[vout]', '-map', '[aout]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-maxrate', '8M', '-bufsize', '16M', '-pix_fmt', 'yuv420p', '-ac', '2', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', sb.out], 'montagem final');
rmSync(work, { recursive: true, force: true });
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height', '-of', 'default=nw=1', sb.out], { encoding: 'utf8' });
console.log(`${sb.out}\n${probe.stdout.trim()}`);
