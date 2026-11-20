#!/usr/bin/env node
// Envia imagem(ns) para o WhatsApp do Rod pelo wa-gateway local (127.0.0.1:3100).
//   node scripts/enviar-whats.mjs "legenda" arquivo1.jpg [arquivo2.jpg ...]
// Número e token vêm de /root/phanterclaw/.env (BAILEY_INBOX_READERS, BAILEY_API_TOKEN). Nunca imprime nenhum dos dois.
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync("/root/phanterclaw/.env", "utf8").split("\n").filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split("=")[0], l.slice(l.indexOf("=") + 1).trim().replace(/^(["'])(.*)\1$/, "$2")]));
const to = (env.BAILEY_INBOX_READERS || "").split(",")[0].replace(/\D/g, "");
const [legenda, ...arqs] = process.argv.slice(2);
if (!to || !env.BAILEY_API_TOKEN || !arqs.length) { console.error("uso: enviar-whats.mjs \"legenda\" img..."); process.exit(2); }
for (const [i, a] of arqs.entries()) {
  const r = await fetch(`${env.BAILEY_API_URL || "http://127.0.0.1:3100"}/media`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${env.BAILEY_API_TOKEN}` }, body: JSON.stringify({ to, caption: arqs.length > 1 ? `${legenda} (${i + 1}/${arqs.length})` : legenda, image: fs.readFileSync(a).toString("base64") }) });
  console.log(a, r.status);
  if (!r.ok) process.exitCode = 1;
}
