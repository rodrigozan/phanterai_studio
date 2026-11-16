#!/usr/bin/env node
// Gera uma imagem pelo OpenRouter, com imagens de referência opcionais para manter o mesmo personagem
// entre as cenas. É a chamada direta que produziu os Reels de outubro/novembro de 2026 (sem JEV).
//   node gen-image.mjs --prompt "..." --out cena.png [--ref ficha.png]... [--aspect 9:16] [--model id]
// Modelo: --model, depois OPENROUTER_MODEL_IMAGE, depois marca.json (imagem.modelo).
// Chave: OPENROUTER_API_KEY no ambiente, no .env do studio ou no .env do phanterclaw. Nunca é impressa.
// CADA CHAMADA É PAGA. Use gen-scenes.mjs --dry-run para conferir o plano antes.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const MARCA = JSON.parse(readFileSync(join(AQUI, '..', 'marca.json'), 'utf8'));
const STUDIO = resolve(AQUI, '..', '..', '..');

function chave(nome) {
  if (process.env[nome]) return process.env[nome];
  for (const arquivo of [join(STUDIO, '.env'), '/root/phanterclaw/.env']) {
    if (!existsSync(arquivo)) continue;
    for (const linha of readFileSync(arquivo, 'utf8').split(/\r?\n/)) {
      const m = /^\s*([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/.exec(linha);
      if (m && m[1] === nome && !linha.trim().startsWith('#')) return m[2].replace(/^(["'])(.*)\1$/, '$2');
    }
  }
  return '';
}

export const modeloPadrao = () => process.env.OPENROUTER_MODEL_IMAGE || MARCA.imagem?.modelo || 'google/gemini-2.5-flash-image';
const mime = (f) => ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' })[extname(f).toLowerCase()] || 'image/png';

// Devolve o caminho gravado. Tenta até 3 vezes; lança erro com a mensagem real da API se não vier imagem.
export async function gerarImagem({ prompt, out, refs = [], aspect = '9:16', model = modeloPadrao() }) {
  const key = chave('OPENROUTER_API_KEY');
  if (!key) throw new Error('OPENROUTER_API_KEY ausente (ambiente, .env do studio ou /root/phanterclaw/.env)');
  const anexos = refs.map((f) => ({ type: 'image_url', image_url: { url: `data:${mime(f)};base64,${readFileSync(f).toString('base64')}` } }));
  const texto = anexos.length ? `${prompt}\n\nUse as imagens anexas como referência: mantenha exatamente o mesmo personagem (rosto, cabelo, barba, roupa, cores) e o mesmo estilo de arte.` : prompt;
  let ultimo = '';
  for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'X-Title': 'PhanterAI Studio' },
        body: JSON.stringify({ model, modalities: ['image', 'text'], messages: [{ role: 'user', content: [{ type: 'text', text: texto }, ...anexos] }], image_config: { aspect_ratio: aspect } }),
        signal: AbortSignal.timeout(180_000),
      });
      const json = await res.json();
      const uri = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      const m = /^data:[^;]+;base64,(.+)$/s.exec(uri || '');
      if (!m) throw new Error(json?.error?.message || `sem imagem na resposta (HTTP ${res.status})`);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, Buffer.from(m[1], 'base64'));
      return out;
    } catch (err) { ultimo = err.message; }
  }
  throw new Error(ultimo);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = (nome, todos = false) => {
    const achados = [];
    for (let i = 0; i < args.length; i += 1) if (args[i] === `--${nome}` && args[i + 1] !== undefined) achados.push(args[i + 1]);
    return todos ? achados : achados[0];
  };
  if (!opt('prompt') || !opt('out')) { console.error('uso: gen-image.mjs --prompt "..." --out arquivo.png [--ref imagem]... [--aspect 9:16] [--model id]'); process.exit(2); }
  try {
    console.log(await gerarImagem({ prompt: opt('prompt'), out: opt('out'), refs: opt('ref', true), aspect: opt('aspect') || '9:16', model: opt('model') || modeloPadrao() }));
  } catch (err) { console.error(`falhou: ${err.message}`); process.exit(1); }
}
