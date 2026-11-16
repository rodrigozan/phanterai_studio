#!/usr/bin/env node
// Gera as fichas dos personagens e todas as cenas de um Reels, em sequência, com a ficha de cada
// personagem presente como referência.
//   node gen-scenes.mjs cenas.json --out <pasta da rodada> [--only 3,7] [--dry-run]
// cenas.json: { estilo?, fichas: [{ nome, descricao }], cenas: [{ n, personagens: [nome], prompt }] }
// Prompt final da cena = estilo + descrição de cada personagem presente + prompt (tudo em inglês).
// Saída: ficha-<nome>.png e cena-NN.png em --out. Arquivo que já existe é pulado: para retomar depois
// de uma falha, rode de novo; para refazer uma cena, apague o arquivo dela (ou use --only depois de apagar).
// --dry-run não chama a API: mostra quantas imagens seriam geradas (cada uma é paga).
// A última linha do stdout é um JSON { ok, modelo, geradas, puladas, falhas }.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gerarImagem, modeloPadrao } from './gen-image.mjs';

const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const outDir = opt('out');
const specFile = args.find((a, i) => !a.startsWith('--') && !['--out', '--only'].includes(args[i - 1]));
const fim = (resumo, codigo) => { console.log(JSON.stringify(resumo)); process.exit(codigo); };
if (!specFile || !outDir) { console.error('uso: gen-scenes.mjs cenas.json --out pasta [--only 3,7] [--dry-run]'); process.exit(2); }
let spec;
try { spec = JSON.parse(readFileSync(specFile, 'utf8')); } catch (err) { fim({ ok: false, erro: `cenas.json ilegível: ${err.message}` }, 2); }
const only = opt('only') ? opt('only').split(',').map((n) => Number(n.trim())).filter(Number.isInteger) : null;
const dry = args.includes('--dry-run');
const out = resolve(outDir);
mkdirSync(out, { recursive: true });
const fichas = spec.fichas || [];
const estilo = spec.estilo ? `${spec.estilo}\n\n` : '';
const fichaPath = (nome) => join(out, `ficha-${slug(nome)}.png`);

const jobs = [];
for (const f of fichas) jobs.push({ file: fichaPath(f.nome), prompt: `${estilo}Character reference sheet, full body, neutral plain background, front view. ${f.descricao}`, refs: [] });
for (const c of spec.cenas || []) {
  if (only && !only.includes(c.n)) continue;
  const quem = (c.personagens || []).map((n) => fichas.find((f) => slug(f.nome) === slug(n)));
  if (quem.includes(undefined)) fim({ ok: false, erro: `cena ${c.n}: personagem sem ficha em "fichas": ${c.personagens.join(', ')}` }, 2);
  jobs.push({ file: join(out, `cena-${String(c.n).padStart(2, '0')}.png`), prompt: `${estilo}${quem.map((f) => f.descricao).join('\n')}\n\n${c.prompt}`, refs: quem.map((f) => fichaPath(f.nome)) });
}
const resultado = { ok: true, modelo: modeloPadrao(), geradas: [], puladas: [], falhas: [] };
for (const j of jobs) {
  if (existsSync(j.file)) { resultado.puladas.push(j.file); continue; }
  if (dry) { resultado.geradas.push(`${j.file} (dry-run, ${j.refs.length} ref, prompt ${j.prompt.length} caracteres)`); continue; }
  try {
    await gerarImagem({ prompt: j.prompt, out: j.file, refs: j.refs.filter((r) => existsSync(r)) });
    resultado.geradas.push(j.file);
    console.error(`ok ${j.file}`);
  } catch (err) { resultado.falhas.push({ arquivo: j.file, erro: String(err.message).slice(-300) }); resultado.ok = false; console.error(`falhou ${j.file}: ${err.message}`); }
}
fim(resultado, resultado.ok ? 0 : 1);
