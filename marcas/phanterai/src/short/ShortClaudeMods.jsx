import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 18/11/2026 07:00 — "O Claude Code agora cria recursos para ele mesmo" (Mods do Claude Code).
// Fonte primária: code.claude.com/docs/en/plugins/mods/overview e /create (só no texto do post, nunca na tela).
// Palco contínuo: interface do Claude Code recriada em motion, cada ação disparada pela palavra da fala
// (índices = posição da palavra no words.orig.json; words.json guarda o índice em `i`).
// Nada de print, nada gerado por IA, nenhum crédito na tela.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SCM_SLUG = "phanterai/episodes/reel-2026-11-18-0700-claude-cria-recursos";
export const SCM_FPS = 30;
const FPS = SCM_FPS;
const f = (p) => staticFile(`${SCM_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/CuriousFocus.mp3";

export const calculateClaudeModsMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const end = wj.words[wj.words.length - 1].e;
  return { durationInFrames: Math.ceil((end + 0.7) * FPS), props: { words: wj.words, endSec: end + 0.7 } };
};

// ---------- tempo das palavras ----------
let W = {};
const at = (i) => { for (let k = i; k < i + 20; k++) if (W[k]) return Math.round(W[k].s * FPS); return 0; };
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));

// ---------- fundo vivo ----------
const Fundo = ({ fr }) => {
  const dots = Array.from({ length: 26 }, (_, k) => {
    const x = (k * 397) % 1080, y0 = (k * 613) % 1920;
    const y = (y0 - fr * (0.4 + (k % 5) * 0.15) + 1920 * 4) % 1920;
    return <div key={k} style={{ position: "absolute", left: x, top: y, width: 4 + (k % 3) * 2, height: 4 + (k % 3) * 2, borderRadius: 9, background: k % 4 ? "rgba(190,170,255,0.35)" : PINKA(0.5) }} />;
  });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1d0f3f 0%, #0b0618 60%, #05030c 100%)" }}>
      <div style={{ position: "absolute", left: -600, right: -600, top: 1050, height: 1100, transform: "perspective(700px) rotateX(62deg)", transformOrigin: "50% 0%",
        backgroundImage: "linear-gradient(rgba(170,130,255,0.18) 2px, transparent 2px), linear-gradient(90deg, rgba(170,130,255,0.18) 2px, transparent 2px)",
        backgroundSize: "90px 90px", backgroundPosition: `0px ${(fr * 1.5) % 90}px` }} />
      <div style={{ position: "absolute", left: 540 - 520, top: 780 - 520, width: 1040, height: 1040, borderRadius: "50%",
        background: `radial-gradient(circle, ${PINKA(0.22 + 0.05 * Math.sin(fr / 20))} 0%, transparent 65%)` }} />
      {dots}
    </AbsoluteFill>
  );
};

const Logo = () => (
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -1 }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);

// janela do Claude Code recriada
const Janela = ({ title = "claude", children, w = 900, h = 760, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid rgba(190,160,255,0.28)`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.18)}`, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ height: 70, display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 26, color: GREY, marginLeft: 16 }}>{title}</div>
    </div>
    <div style={{ padding: 34, position: "relative", height: h - 70 }}>{children}</div>
  </div>
);

const Linha = ({ fr, d, children, style = {} }) => {
  const p = pop(fr, d, 16);
  if (fr < d) return null;
  return <div style={{ opacity: p, transform: `translateX(${(1 - p) * -40}px)`, fontFamily: MONO, fontSize: 30, color: BODY, marginBottom: 18, ...style }}>{children}</div>;
};

const Check = ({ fr, d }) => {
  const p = pop(fr, d, 10);
  return <span style={{ display: "inline-block", transform: `scale(${p})`, color: GREEN, fontWeight: 800, marginLeft: 14 }}>✓</span>;
};

const Chip = ({ n, titulo, sub, fr, d }) => {
  const p = pop(fr, d, 13);
  return (
    <div style={{ position: "absolute", top: 210, left: 90, right: 90, display: "flex", alignItems: "center", gap: 28, padding: "24px 34px", borderRadius: 28, background: "rgba(30,18,60,0.92)", border: `2px solid ${PINKA(0.6)}`, transform: `translateY(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`, opacity: p }}>
      <div style={{ width: 100, height: 100, borderRadius: 24, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{n}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", lineHeight: 1.05 }}>{titulo}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 34, color: BODY, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

// cena = faixa de tempo [a, b) com entrada/saída deslizando
const Cena = ({ fr, a, b, children }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};

const Palco = ({ children, top = 400 }) => {
  const fr = useCurrentFrame();
  return <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${Math.sin(fr / 18) * 10}px) rotate(${Math.sin(fr / 40) * 0.6}deg)` }}>{children}</div>;
};

// ---------- cenas ----------
const Hook = ({ fr }) => {
  const n = Math.round(interpolate(fr, [4, 34], [0, 5], clamp));
  const pulse = 1 + 0.12 * Math.max(0, 1 - Math.abs(fr - at(16)) / 8);
  const code = ["export function register(on) {", "  on('tool.call', ...)", "}"];
  return (
    <>
      <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center", transform: `scale(${pulse})` }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 230, color: "#fff", lineHeight: 1, textShadow: `0 0 60px ${PINKA(0.7)}` }}>{n}</div>
        <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 60, color: "#fff", background: PINK, padding: "4px 26px", borderRadius: 14, marginTop: 6 }}>recursos novos</div>
      </div>
      <Palco top={700}>
        <Janela title="claude code" h={600} w={880} style={{ transform: `scale(${0.85 + 0.15 * pop(fr, 2)})` }}>
          <Linha fr={fr} d={at(3)}><span style={{ color: PINK }}>✻</span> novo recurso: <span style={{ color: "#fff" }}>{fr > at(5) ? "criando…" : ""}</span></Linha>
          <Linha fr={fr} d={at(9)} style={{ color: "#fff" }}>{"> "}{typed("faz um mod que…", fr, at(9), at(11))}</Linha>
          {code.map((l, k) => <Linha key={k} fr={fr} d={at(12) + k * 5} style={{ color: k === 1 ? PINK : BODY, fontSize: 28 }}>{l}</Linha>)}
          {fr > at(15) && <div style={{ display: "flex", gap: 16, marginTop: 10 }}>{[1, 2, 3, 4, 5].map((k) => {
            const p = pop(fr, at(16) + k * 3, 11);
            return <div key={k} style={{ width: 120, height: 80, borderRadius: 18, background: PINKA(0.25), border: `2px solid ${PINK}`, transform: `scale(${p})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{k}</div>;
          })}</div>}
        </Janela>
      </Palco>
    </>
  );
};

const OQueE = ({ fr }) => {
  const tree = ["first-mod/", "├── .claude-plugin/plugin.json", "├── hooks/hooks.json", "└── hooks/register.js"];
  const inside = ease(lin(fr, at(26), at(30)));
  const lock = fr >= at(39);
  return (
    <>
      <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center" }}>
        <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 24, display: "inline-block", transform: `scale(${pop(fr, at(25), 9)})` }}>mod</span>
      </div>
      <Palco top={500}>
        <div style={{ position: "relative", width: 900, height: 820 }}>
          <Janela title="claude code" w={900} h={820} style={{ boxShadow: fr > at(35) ? `0 0 ${60 + 30 * Math.sin(fr / 4)}px ${PINKA(0.6)}` : undefined }}>
            <div style={{ fontFamily: MONO, fontSize: 28, color: GREY }}>{fr > at(32) ? "interface: " : ""}<span style={{ color: PINK }}>{fr > at(35) ? "personalizada" : ""}</span>{fr > at(37) && <Check fr={fr} d={at(37)} />}</div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: GREY, marginTop: 14 }}>{fr > at(37) ? "comportamento: " : ""}<span style={{ color: PINK }}>{fr > at(37) ? "seu" : ""}</span></div>
            {lock && <div style={{ position: "absolute", right: 40, bottom: 50, width: 260, height: 260, borderRadius: 40, background: "rgba(30,18,60,0.95)", border: `3px dashed ${PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, at(39), 9)}) rotate(${Math.sin(fr / 5) * 3}deg)` }}>
              <div style={{ fontSize: 80 }}>🔒</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff" }}>Nº 5</div>
            </div>}
          </Janela>
          <div style={{ position: "absolute", left: 60 + inside * 0, top: interpolate(inside, [0, 1], [-260, 240]), width: 560, padding: 26, borderRadius: 22, background: "rgba(45,25,90,0.97)", border: `2px solid ${PINKA(0.7)}`, opacity: pop(fr, at(25)) }}>
            {tree.map((l, k) => <div key={k} style={{ fontFamily: MONO, fontSize: 27, color: k ? BODY : "#fff", marginBottom: 8, opacity: lin(fr, at(25) + k * 4, at(25) + k * 4 + 5) }}>{l}</div>)}
          </div>
        </div>
      </Palco>
    </>
  );
};

const Item1 = ({ fr }) => {
  const pane = ease(lin(fr, at(51), at(51) + 10));
  const tabs = ["Contexto", "Tokens", "Notas"];
  return (
    <>
      <Chip n={1} titulo="Painel seu" sub="ao lado da conversa" fr={fr} d={at(48)} />
      <Palco top={470}>
        <Janela w={940} h={860}>
          <div style={{ display: "flex", gap: 20, height: "100%" }}>
            <div style={{ flex: 1 }}>
              {["você: resume o projeto", "claude: pronto ✓", "você: e os testes?"].map((m, k) => (
                <div key={k} style={{ opacity: lin(fr, at(56) + k * 5, at(56) + k * 5 + 5), fontFamily: inter, fontSize: 26, color: "#fff", background: k % 2 ? PINKA(0.3) : "rgba(255,255,255,0.08)", padding: "14px 18px", borderRadius: 16, marginBottom: 16 }}>{m}</div>
              ))}
            </div>
            <div style={{ width: 440 * pane, overflow: "hidden", borderLeft: `3px solid ${PINK}`, paddingLeft: pane ? 20 : 0, background: "rgba(222,64,200,0.06)", borderRadius: 14 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 26, width: 420 }}>
                {tabs.map((t, k) => <div key={t} style={{ transform: `scale(${pop(fr, at(58) + k * 3, 11)})`, fontFamily: inter, fontWeight: 800, fontSize: 24, color: "#fff", padding: "10px 16px", borderRadius: 12, background: k === 0 ? PINK : "rgba(255,255,255,0.1)" }}>{t}</div>)}
              </div>
              <div style={{ display: "flex", gap: 14, width: 420, marginBottom: 28 }}>
                {["Gerar", "Limpar"].map((b, k) => <div key={b} style={{ transform: `scale(${pop(fr, at(59) + k * 4, 9)})`, fontFamily: inter, fontWeight: 800, fontSize: 26, color: k ? "#fff" : "#140b2e", background: k ? "transparent" : GREEN, border: `2px solid ${GREEN}`, padding: "12px 22px", borderRadius: 14 }}>{b}</div>)}
              </div>
              {fr > at(61) && <div style={{ width: 400, fontFamily: MONO, fontSize: 26, color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, padding: "14px 16px" }}>{typed("buscar…", fr, at(61), at(63) + 6)}<span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span></div>}
            </div>
          </div>
        </Janela>
      </Palco>
    </>
  );
};

const Item2 = ({ fr }) => {
  const sp = fr >= at(71), row = fr >= at(73), q = fr >= at(77);
  const glyph = "✻✢✳✶"[Math.floor(fr / 4) % 4];
  return (
    <>
      <Chip n={2} titulo="Redesenhar a interface" sub="a do próprio Claude Code" fr={fr} d={at(64)} />
      <Palco top={470}>
        <Janela w={940} h={860}>
          <div style={{ fontFamily: MONO, fontSize: 34, color: sp ? PINK : GREY, transform: `scale(${sp ? 1 + 0.08 * Math.max(0, 1 - (fr - at(71)) / 8) : 1})`, transformOrigin: "0 50%", marginBottom: 34 }}>
            {sp ? "🐾" : glyph} {sp ? "Pensando · do seu jeito…" : "Thinking…"}
          </div>
          {["Bash(ls)", "Read(app.js)", "Edit(app.js)"].map((t, k) => (
            <div key={t} style={{ fontFamily: MONO, fontSize: 30, marginBottom: 16, padding: "14px 20px", borderRadius: 14, transition: "none",
              background: row && fr >= at(73) + k * 4 ? PINKA(0.22) : "transparent", color: row && fr >= at(73) + k * 4 ? "#fff" : GREY,
              border: row && fr >= at(73) + k * 4 ? `2px solid ${PINK}` : "2px solid transparent" }}>
              {row && fr >= at(73) + k * 4 ? "▸ " : "⏺ "}{t}{row && fr >= at(73) + k * 4 + 3 && <Check fr={fr} d={at(73) + k * 4 + 3} />}
            </div>
          ))}
          {q && <div style={{ marginTop: 24, padding: 26, borderRadius: 20, background: "rgba(45,25,90,0.97)", border: `2px solid ${PINK}`, transform: `translateY(${(1 - pop(fr, at(77))) * 120}px)`, opacity: pop(fr, at(77)) }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", marginBottom: 16 }}>Qual banco de dados?</div>
            <div style={{ display: "flex", gap: 14 }}>{["Postgres", "SQLite"].map((o, k) => <div key={o} style={{ fontFamily: inter, fontSize: 28, color: "#fff", padding: "10px 20px", borderRadius: 12, background: k === Math.floor(fr / 12) % 2 ? PINK : "rgba(255,255,255,0.1)" }}>{o}</div>)}</div>
          </div>}
        </Janela>
      </Palco>
    </>
  );
};

const Item3 = ({ fr }) => {
  const run = fr >= at(88);
  const t = run ? Math.min(3, Math.floor((fr - at(88)) / 6)) : 0;
  return (
    <>
      <Chip n={3} titulo="Comando com barra" sub="roda o seu código na hora" fr={fr} d={at(81)} />
      <Palco top={470}>
        <Janela w={940} h={860}>
          <div style={{ fontFamily: MONO, fontSize: 40, color: "#fff", border: `2px solid ${fr >= at(84) ? PINK : "rgba(255,255,255,0.3)"}`, borderRadius: 16, padding: "20px 24px" }}>
            {"> "}<span style={{ color: PINK }}>{typed("/tally", fr, at(84), at(86) + 4)}</span><span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span>
          </div>
          {run && <div style={{ marginTop: 34, padding: 30, borderRadius: 20, background: "rgba(52,211,153,0.1)", border: `2px solid ${GREEN}`, transform: `scale(${pop(fr, at(88), 10)})` }}>
            <div style={{ fontFamily: MONO, fontSize: 30, color: GREEN }}>⚡ executado na hora</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff", marginTop: 10 }}>tool calls: {t}</div>
          </div>}
          {fr >= at(94) && <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 20, transform: `scale(${pop(fr, at(94), 10)})` }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>turnos do Claude:</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#140b2e", background: PINK === "" ? "" : "#fff", borderRadius: 18, padding: "0 26px" }}>0</div>
            {fr >= at(97) && <Check fr={fr} d={at(97)} />}
          </div>}
        </Janela>
      </Palco>
    </>
  );
};

const Item4 = ({ fr }) => {
  const c0 = at(107);
  const count = fr < c0 ? 0 : Math.min(3, 1 + Math.floor((fr - c0) / 9));
  const show = fr >= at(112);
  const box = (titulo, sub, act, k) => (
    <div style={{ width: 400, padding: 26, borderRadius: 22, background: "rgba(45,25,90,0.95)", border: `2px solid ${act ? PINK : "rgba(255,255,255,0.2)"}`, transform: `scale(${pop(fr, at(102) + k * 6)})` }}>
      <div style={{ fontFamily: MONO, fontSize: 26, color: PINK }}>{titulo}</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", marginTop: 10 }}>{sub}</div>
    </div>
  );
  return (
    <>
      <Chip n={4} titulo="Hooks que dividem dados" sub="um registra, o outro mostra" fr={fr} d={at(100)} />
      <Palco top={470}>
        <Janela w={940} h={860}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {box("on('tool.call')", "conta", fr >= c0, 0)}
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: PINK, opacity: lin(fr, at(105), at(105) + 6), transform: `translateX(${Math.sin(fr / 4) * 8}px)` }}>→</div>
            {box("spinner", "mostra", show, 1)}
          </div>
          <div style={{ marginTop: 40 }}>
            {[0, 1, 2].map((k) => fr >= c0 + k * 9 && <div key={k} style={{ fontFamily: MONO, fontSize: 28, color: BODY, marginBottom: 12, opacity: lin(fr, c0 + k * 9, c0 + k * 9 + 5) }}>⏺ {["Read(app.js)", "Bash(npm test)", "Edit(app.js)"][k]}  <span style={{ color: PINK }}>+1</span></div>)}
          </div>
          <div style={{ marginTop: 30, fontFamily: MONO, fontSize: 36, color: show ? "#fff" : GREY, padding: "18px 22px", borderRadius: 16, background: show ? PINKA(0.2) : "transparent", border: show ? `2px solid ${PINK}` : "2px solid transparent" }}>
            {"✻✢✳✶"[Math.floor(fr / 4) % 4]} Thinking{show ? <> · <span style={{ color: PINK, fontWeight: 800 }}>tool calls: {count}</span></> : ""}…
          </div>
        </Janela>
      </Palco>
    </>
  );
};

const Item5 = ({ fr }) => {
  const hold = fr >= at(127), ask = fr >= at(133), other = fr >= at(136);
  return (
    <>
      <Chip n={5} titulo="Entrar na ferramenta" sub="antes dela rodar" fr={fr} d={at(119)} />
      <Palco top={470}>
        <Janela w={940} h={860} title="claude code · Bash">
          <div style={{ fontFamily: MONO, fontSize: 40, color: "#fff" }}>$ <span style={{ color: "#ff6b8a" }}>{typed("rm -rf build/", fr, at(128), at(131) + 6)}</span></div>
          {hold && <div style={{ marginTop: 26, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#140b2e", background: "#febc2e", padding: "10px 24px", borderRadius: 14, transform: `scale(${pop(fr, at(127), 9)}) rotate(-3deg)` }}>⏸ SEGURADO</div>}
          {ask && !other && <div style={{ marginTop: 34, padding: 28, borderRadius: 20, background: "rgba(45,25,90,0.97)", border: `2px solid ${PINK}`, transform: `translateY(${(1 - pop(fr, at(133))) * 100}px)` }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", marginBottom: 18 }}>Apagar a pasta build/?</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", padding: "12px 26px", borderRadius: 14, background: "rgba(255,255,255,0.12)" }}>Prosseguir</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", padding: "12px 26px", borderRadius: 14, background: PINK, transform: `scale(${1 + 0.05 * Math.sin(fr / 3)})` }}>Cancelar</div>
            </div>
          </div>}
          {other && <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 24, transform: `scale(${pop(fr, at(136), 11)})` }}>
            <div style={{ padding: "22px 26px", borderRadius: 18, background: "rgba(255,255,255,0.08)", fontFamily: MONO, fontSize: 28, color: "#fff" }}>pedido</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: PINK, transform: `translateX(${interpolate(fr - at(136), [0, 15], [-30, 0], clamp)}px)` }}>⟶</div>
            <div style={{ padding: "22px 26px", borderRadius: 18, background: PINKA(0.3), border: `2px solid ${PINK}`, fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", transform: `scale(${1 + 0.06 * Math.sin((fr - at(136)) / 3)})` }}>outro modelo</div>
          </div>}
          {other && <div style={{ marginTop: 40, display: "flex", gap: 14 }}>{[0, 1, 2, 3, 4, 5].map((k) => {
            const on = fr - at(136) > 6 + k * 6;
            return <div key={k} style={{ flex: 1, height: 70, borderRadius: 14, background: on ? PINKA(0.35) : "rgba(255,255,255,0.06)", border: on ? `2px solid ${PINK}` : "2px solid transparent", fontFamily: MONO, fontSize: 22, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</div>;
          })}</div>}
        </Janela>
      </Palco>
    </>
  );
};

const ComoPedir = ({ fr }) => {
  const prompt = "faz um mod que mostra a branch do git acima do prompt";
  const files = ["~/.claude/dev-mods/<sessão>/git-branch/", "  .claude-plugin/plugin.json", "  hooks/register.js"];
  const prog = lin(fr, at(166), at(170));
  const done = fr >= at(168);
  return (
    <>
      <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center", transform: `scale(${pop(fr, at(143), 11)})` }}>
        <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 92, color: "#fff", background: PINK, padding: "0 34px", borderRadius: 20 }}>como pedir?</span>
      </div>
      <Palco top={430}>
        <Janela w={940} h={900}>
          <div style={{ fontFamily: MONO, fontSize: 31, color: "#fff", lineHeight: 1.35, minHeight: 130 }}>{"> "}{typed(prompt, fr, at(150), at(162) + 8)}<span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span></div>
          {fr >= at(164) && <div style={{ marginTop: 20, padding: 22, borderRadius: 18, background: "rgba(45,25,90,0.95)" }}>
            {files.map((l, k) => <div key={k} style={{ fontFamily: MONO, fontSize: 24, color: k ? BODY : PINK, marginBottom: 8, opacity: lin(fr, at(164) + k * 4, at(164) + k * 4 + 4) }}>{l}{fr >= at(164) + k * 4 + 5 && <Check fr={fr} d={at(164) + k * 4 + 5} />}</div>)}
          </div>}
          {fr >= at(166) && <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, color: "#fff", marginBottom: 10 }}>carregando mod… {Math.round(prog * 100)}%</div>
            <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.12)" }}><div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 11, background: PINK }} /></div>
          </div>}
          {done && <div style={{ position: "absolute", left: 34, right: 34, bottom: 40, transform: `translateY(${(1 - pop(fr, at(168))) * 80}px)` }}>
            <div style={{ fontFamily: MONO, fontSize: 30, color: GREEN, marginBottom: 10 }}>⎇ main</div>
            <div style={{ fontFamily: MONO, fontSize: 30, color: GREY, border: "2px solid rgba(255,255,255,0.3)", borderRadius: 14, padding: "16px 20px" }}>{">"} _</div>
          </div>}
        </Janela>
      </Palco>
    </>
  );
};

const CTA = ({ fr }) => {
  const seg = fr >= at(188);
  const bolhas = Array.from({ length: 10 }, (_, k) => {
    const st = at(186) + k * 9; if (fr < st) return null;
    const p = (fr - st) / 50; if (p > 1) return null;
    return <div key={k} style={{ position: "absolute", left: 120 + ((k * 173) % 760), top: 1350 - p * 900, opacity: 1 - p, fontSize: 64, transform: `rotate(${(k % 2 ? 1 : -1) * 12}deg)` }}>{k % 3 ? "💬" : "💜"}</div>;
  });
  return (
    <>
      {bolhas}
      <Palco top={420}>
        <div style={{ width: 900, padding: 44, borderRadius: 34, background: WIN, border: `2px solid ${PINKA(0.6)}`, transform: `scale(${pop(fr, at(185), 11)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 90, height: 90, borderRadius: 45, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>💬</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>Comente</div>
          </div>
          <div style={{ marginTop: 28, fontFamily: MONO, fontSize: 90, color: "#fff", border: `3px solid ${PINK}`, borderRadius: 20, padding: "14px 30px" }}>{typed("MOD", fr, at(186), at(186) + 9)}<span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span></div>
          <div style={{ marginTop: 34, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 44, color: seg ? "#fff" : "#140b2e", background: seg ? "rgba(255,255,255,0.12)" : "#fff", padding: "16px 40px", borderRadius: 18, transform: `scale(${seg ? 1 + 0.1 * Math.max(0, 1 - (fr - at(188)) / 8) : 1})` }}>{seg ? "Seguindo ✓" : "Seguir"}</div>
          {fr >= at(191) && <div style={{ marginTop: 34, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", opacity: lin(fr, at(191), at(191) + 6) }}>🔗 link na legenda <span style={{ display: "inline-block", transform: `translateY(${Math.abs(Math.sin(fr / 5)) * 14}px)`, color: PINK }}>↓</span></div>}
        </div>
      </Palco>
    </>
  );
};

// ---------- panterinha: só 3 reações ----------
const Reacao = ({ fr, a, b, pose }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 340, right: 30 - (1 - pin) * 420 - pout * 420, top: 1150 }} />;
};

// ---------- legendas 1–3 palavras ----------
const KEY = new Set(["cria", "recursos", "mesmo", "cinco", "mod", "painel", "interface", "spinner", "comando", "barra", "hora", "turno", "hooks", "dados", "total", "rm", "rf", "perguntar", "modelo", "pedir", "branch", "git", "carrega", "segue", "legenda", "dois", "tres", "quatro", "cinco", "descreve", "escreve", "abas", "botoes", "ferramenta"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const SUBS = { menos: "-", um: null };
const buildChunks = (words) => {
  const toks = [];
  words.forEach((x, k) => {
    let t = x.w;
    if (norm(t) === "menos" && words[k - 1] && norm(words[k - 1].w) === "rm") { toks[toks.length - 1].t = "rm -rf"; toks[toks.length - 1].e = words[k + 1].e; return; }
    if (norm(t) === "rf" && words[k - 1] && norm(words[k - 1].w) === "menos") return;
    if (norm(t) === "numero") t = "Nº";
    toks.push({ t, s: x.s, e: x.e });
  });
  const chunks = []; let cur = [];
  toks.forEach((tk) => {
    cur.push(tk);
    const len = cur.map((c) => c.t).join(" ").length;
    if (cur.length >= 3 || len > 15 || /[.,!?:;]$/.test(tk.t) || /\.\.\.$/.test(tk.t)) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  return chunks;
};
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const Legendas = ({ chunks, fr }) => {
  const t = fr / FPS;
  let ci = -1;
  chunks.forEach((c, i) => { if (c[0].s <= t + 0.02) ci = i; });
  if (ci < 0) return null;
  const chunk = chunks[ci];
  if (t > chunk[chunk.length - 1].e + 0.8) return null;
  const p = pop(fr, Math.round(chunk[0].s * FPS), 15);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1550, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, transform: `scale(${0.85 + 0.15 * p})` }}>
      {chunk.map((w, i) => {
        const base = w.t.replace(/[.,!?:;…]+$/g, "").replace(/\.\.\.$/, "");
        const n = norm(base);
        const prevNum = i > 0 && chunk[i - 1].t === "Nº";
        const shown = prevNum && NUM[n] ? NUM[n] : n === "cinco" ? "5" : base;
        const key = (prevNum && NUM[n]) || KEY.has(n) || base === "Nº" || base === "rm -rf" || base === "MOD";
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortClaudeMods = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(22), at(48), at(64), at(81), at(100), at(119), at(143), at(185), end];
  const scenes = [Hook, OQueE, Item1, Item2, Item3, Item4, Item5, ComoPedir, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo />
      {scenes.map((S, k) => <Cena key={k} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      <Reacao fr={fr} a={at(7)} b={at(15)} pose="surpresa" />
      <Reacao fr={fr} a={at(41)} b={at(47) + 10} pose="apontando" />
      <Reacao fr={fr} a={at(185)} b={end} pose="comemorando" />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      {[at(7), at(41), at(185)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const CapaClaudeMods = () => {
  const fr = 40;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo />
      <div style={{ position: "absolute", top: 330, left: 80, right: 80, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.04, letterSpacing: -2 }}>O Claude Code agora cria</div>
        <div style={{ display: "inline-block", marginTop: 22, fontFamily: lora, fontStyle: "italic", fontSize: 104, color: "#fff", background: PINK, padding: "0 30px", borderRadius: 22 }}>recursos</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.04, marginTop: 14, letterSpacing: -2 }}>para ele mesmo</div>
      </div>
      <div style={{ position: "absolute", top: 1010, left: 110 }}>
        <Janela w={640} h={430} title="claude code">
          <div style={{ fontFamily: MONO, fontSize: 28, color: "#fff", lineHeight: 1.4 }}>{"> faz um mod que…"}</div>
          {["painel", "comandos", "interface"].map((t, k) => <div key={t} style={{ fontFamily: MONO, fontSize: 28, color: BODY, marginTop: 14 }}><span style={{ color: GREEN }}>✓</span> {t}</div>)}
        </Janela>
      </div>
      <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 440, right: 40, top: 1150 }} />
    </AbsoluteFill>
  );
};
