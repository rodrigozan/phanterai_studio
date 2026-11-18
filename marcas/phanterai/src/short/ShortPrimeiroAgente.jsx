import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 18/11/2026 18:00 — "Seu primeiro agente: escolha 1 tarefa da semana".
// Fontes primárias (só no texto do post): anthropic.com/engineering/building-effective-agents e
// anthropic.com/engineering/building-agents-with-the-claude-agent-sdk.
// Palco contínuo com interface recriada em motion; cada ação disparada pela palavra da fala
// (índices = posição da palavra em audio/words.orig.json; words.json guarda o índice em `i`).
// Nada de print, nada gerado por IA, nenhum crédito na tela.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SPA_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-18-1800-primeiro-agente-1-tarefa";
export const SPA_FPS = 30;
const FPS = SPA_FPS;
const f = (p) => staticFile(`${SPA_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Coding_at_Night.mp3";

export const calculatePrimeiroAgenteMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const end = wj.words[wj.words.length - 1].e;
  return { durationInFrames: Math.ceil((end + 0.8) * FPS), props: { words: wj.words, endSec: end + 0.8 } };
};

let W = {};
const at = (i) => { for (let k = i; k < i + 20; k++) if (W[k]) return Math.round(W[k].s * FPS); return 0; };
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span>;

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
      <div style={{ position: "absolute", left: 20, top: 260, width: 1040, height: 1040, borderRadius: "50%",
        background: `radial-gradient(circle, ${PINKA(0.22 + 0.05 * Math.sin(fr / 20))} 0%, transparent 65%)` }} />
      {dots}
    </AbsoluteFill>
  );
};

const Logo = ({ fr }) => (
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 150, 165) }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);

const Janela = ({ title = "claude code", children, w = 900, h = 760, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: "2px solid rgba(190,160,255,0.28)", boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.18)}`, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ height: 70, display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 26, color: GREY, marginLeft: 16 }}>{title}</div>
    </div>
    <div style={{ padding: 34, position: "relative", height: h - 70 }}>{children}</div>
  </div>
);

const Check = ({ fr, d }) => <span style={{ display: "inline-block", transform: `scale(${pop(fr, d, 10)})`, color: GREEN, fontWeight: 800, marginLeft: 14 }}>✓</span>;

const Chip = ({ n, titulo, sub, fr, d }) => {
  const p = pop(fr, d, 13);
  return (
    <div style={{ position: "absolute", top: 200, left: 90, right: 90, display: "flex", alignItems: "center", gap: 28, padding: "24px 34px", borderRadius: 28, background: "rgba(30,18,60,0.92)", border: `2px solid ${PINKA(0.6)}`, transform: `translateY(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`, opacity: p }}>
      <div style={{ width: 100, height: 100, borderRadius: 24, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{n}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", lineHeight: 1.05 }}>{titulo}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 34, color: BODY, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

const Cena = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};

const Palco = ({ children, top = 470 }) => {
  const fr = useCurrentFrame();
  return <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${Math.sin(fr / 18) * 10}px) rotate(${Math.sin(fr / 40) * 0.6}deg)` }}>{children}</div>;
};

// ---------- cenas ----------
const TAREFAS = ["e-mails", "roteiro", "planilha", "agenda", "posts", "edição", "vendas", "suporte", "relatório", "thumbnail", "SEO", "DMs"];
const Hook = ({ fr }) => {
  const punch = interpolate(fr, [0, 8], [1.15, 1], clamp);
  const fal = at(4), q = at(8), menor = at(11), quarto = at(16);
  const flash = Math.max(0, 1 - Math.abs(fr - fal) / 5) * 0.4;
  const falhou = fr >= fal;
  const shake = falhou && fr < q ? Math.sin(fr * 2.3) * 16 * Math.exp(-(fr - fal) / 18) : 0;
  const n = Math.min(TAREFAS.length, Math.floor(fr / 3) + 2);
  return (
    <>
      <AbsoluteFill style={{ background: falhou && fr < q ? `rgba(255,92,122,${flash})` : `rgba(222,64,200,${Math.max(0, 1 - Math.abs(fr - q) / 5) * 0.3})` }} />
      {fr < q && <>
        <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", transform: `scale(${punch})` }}>
          <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 170, color: "#fff", background: falhou ? RED : PINK, padding: "0 44px", borderRadius: 30, transform: `scale(${falhou ? 0.9 + 0.1 * pop(fr, fal, 8) : 1}) rotate(${falhou ? -3 : 0}deg)` }}>{falhou ? "falha" : "faz tudo"}</span>
        </div>
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateX(${shake}px)` }}>
          <div style={{ width: 860, padding: 36, borderRadius: 34, background: WIN, border: `3px solid ${falhou ? RED : "rgba(190,160,255,0.3)"}`, boxShadow: `0 0 70px ${falhou ? "rgba(255,92,122,0.4)" : PINKA(0.25)}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 24 }}>
              <div style={{ width: 90, height: 90, borderRadius: 24, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>🤖</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>meu agente</div>
              <div style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 40, color: falhou ? RED : "#fff" }}>{n} tarefas</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {TAREFAS.slice(0, n).map((t, k) => <div key={t} style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", padding: "12px 22px", borderRadius: 30, background: falhou ? "rgba(255,92,122,0.3)" : "rgba(120,90,255,0.35)", transform: `scale(${pop(fr, (k - 2) * 3, 10)}) rotate(${falhou ? Math.sin(fr / 2 + k) * 6 : 0}deg)` }}>{t}</div>)}
            </div>
            {falhou && <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 40, color: RED, transform: `scale(${pop(fr, fal + 3, 9)})` }}>✗ erro: travou no meio</div>}
          </div>
        </div>
      </>}
      {fr >= q && <>
        <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", transform: `scale(${pop(fr, q, 10)})` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 92, color: "#fff" }}>4 passos</div>
          {fr >= menor && <div style={{ display: "inline-block", marginTop: 16, fontFamily: lora, fontStyle: "italic", fontSize: 96, color: "#fff", background: PINK, padding: "0 34px", borderRadius: 22, transform: `scale(${pop(fr, menor, 9)})` }}>menor agente útil</div>}
        </div>
        <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
          {[1, 2, 3, 4].map((k) => {
            const lock = k === 4 && fr >= quarto;
            const pulse = lock ? 1 + 0.12 * Math.abs(Math.sin((fr - quarto) / 4)) : 1;
            return <div key={k} style={{ width: 190, height: 250, borderRadius: 28, background: lock ? PINKA(0.35) : WIN, border: `4px ${lock ? "dashed" : "solid"} ${lock ? PINK : "rgba(255,255,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, q + k * 3, 10) * pulse}) rotate(${lock ? Math.sin(fr / 3) * 4 : 0}deg)` }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 120, color: "#fff" }}>{k}</div>
              {lock && <div style={{ fontSize: 60 }}>🔒</div>}
            </div>;
          })}
        </div>
      </>}
    </>
  );
};

const Loop = ({ fr, nodes, a, r = 300, size = 760, active = -1 }) => {
  const ang = ((fr - a) * 4) % 360;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", left: size / 2 - r, top: size / 2 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `8px dashed ${PINKA(0.55)}`, transform: `rotate(${fr * 2}deg)` }} />
      <div style={{ position: "absolute", left: size / 2 - 20 + r * Math.cos((ang - 90) * Math.PI / 180), top: size / 2 - 20 + r * Math.sin((ang - 90) * Math.PI / 180), width: 40, height: 40, borderRadius: 20, background: "#fff", boxShadow: `0 0 30px ${PINK}` }} />
      {nodes.map(([t, d], k) => {
        const th = (k / nodes.length) * 2 * Math.PI - Math.PI / 2;
        const on = fr >= d, hot = k === active;
        return <div key={t} style={{ position: "absolute", left: size / 2 + r * Math.cos(th) - 180, top: size / 2 + r * Math.sin(th) - 55, width: 360, height: 110, whiteSpace: "nowrap", borderRadius: 26, background: hot ? PINK : on ? "rgba(45,25,90,0.97)" : WIN, border: `3px solid ${on ? PINK : "rgba(255,255,255,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: on ? "#fff" : GREY, transform: `scale(${on ? pop(fr, d, 9) * (hot ? 1.1 : 1) : 0.85})` }}>{t}</div>;
      })}
    </div>
  );
};

const Simples = ({ fr }) => {
  const s = at(28), ag = at(32), loop = at(39);
  const slider = interpolate(fr, [s, at(31)], [0.9, 0.08], clamp);
  return (
    <>
      {fr < ag && <Palco top={380}>
        <div style={{ width: 920, padding: 46, borderRadius: 34, background: WIN, border: "2px solid rgba(190,160,255,0.3)", boxShadow: `0 0 70px ${PINKA(0.25)}`, transform: `scale(${pop(fr, at(24), 12)})` }}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: GREY }}>recomendação da</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff" }}>{typed("Anthropic", fr, at(25), at(27))}{fr < at(27) && blink(fr)}</div>
          <div style={{ marginTop: 30, fontFamily: lora, fontStyle: "italic", fontSize: 64, color: "#fff", opacity: lin(fr, s - 4, s + 4) }}>“comece pelo mais simples”</div>
          <div style={{ marginTop: 60, position: "relative", height: 40, borderRadius: 20, background: "linear-gradient(90deg, #34D399, #febc2e, #ff5c7a)" }}>
            <div style={{ position: "absolute", left: `calc(${slider * 100}% - 40px)`, top: -20, width: 80, height: 80, borderRadius: 40, background: "#fff", border: `6px solid ${PINK}` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, fontFamily: inter, fontWeight: 800, fontSize: 40 }}>
            <span style={{ color: fr >= at(31) ? GREEN : GREY, transform: `scale(${fr >= at(31) ? pop(fr, at(31), 9) * 1.2 : 1})` }}>simples ✓</span>
            <span style={{ color: GREY }}>complexo</span>
          </div>
        </div>
      </Palco>}
      {fr >= ag && <>
        <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff", transform: `scale(${pop(fr, ag, 10)})` }}>agente =</div>
        <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          {[["🧠", "IA", at(33)], ["🛠️", "ferramentas", at(37)]].map(([ic, t, d], k) => fr >= d && <div key={t} style={{ display: "flex", alignItems: "center", gap: 30 }}>
            {k > 0 && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 90, color: PINK }}>+</div>}
            <div style={{ width: 360, height: 300, borderRadius: 30, background: WIN, border: `3px solid ${PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, d, 10)})` }}>
              <div style={{ fontSize: 120, transform: `rotate(${Math.sin(fr / 5 + k) * 8}deg)` }}>{ic}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{t}</div>
            </div>
          </div>)}
        </div>
        {fr >= loop && <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${pop(fr, loop, 10)})` }}>
          <div style={{ width: 340, height: 340, borderRadius: "50%", border: `14px solid ${PINK}`, borderTopColor: "transparent", transform: `rotate(${fr * 9}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }} />
          <div style={{ position: "absolute", top: 120, fontFamily: lora, fontStyle: "italic", fontSize: 90, color: "#fff" }}>em loop</div>
        </div>}
      </>}
    </>
  );
};

const DIAS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
const Item1 = ({ fr }) => {
  const sem = at(50), fim = at(54), tipo = at(56);
  return (
    <>
      <Chip n={1} titulo="Uma tarefa só" sub="repete toda semana" fr={fr} d={at(41)} />
      <Palco top={470}>
        <Janela w={940} h={860} title="calendário">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
            {DIAS.map((d, k) => <div key={d} style={{ textAlign: "center", fontFamily: MONO, fontSize: 28, color: k === 0 && fr >= at(58) ? PINK : GREY }}>{d}</div>)}
            {Array.from({ length: 21 }, (_, k) => {
              const mon = k % 7 === 0, row = Math.floor(k / 7);
              const lit = mon && fr >= sem + row * 4;
              return <div key={k} style={{ height: 100, borderRadius: 14, background: lit ? PINK : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, transform: `scale(${lit ? pop(fr, sem + row * 4, 9) : pop(fr, at(43) + k, 12)})` }}>{lit ? "🔁" : ""}</div>;
            })}
          </div>
          {fr >= fim && fr < tipo && <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 20, fontFamily: inter, fontWeight: 800, fontSize: 50, color: GREEN, transform: `scale(${pop(fr, fim, 9)})` }}>🏁 fim claro: pronto ou não?</div>}
          {fr >= tipo && <div style={{ marginTop: 30, padding: "24px 28px", borderRadius: 22, background: "rgba(45,25,90,0.97)", border: `3px solid ${PINK}`, transform: `translateY(${(1 - pop(fr, tipo)) * 120}px)` }}>
            <div style={{ fontFamily: MONO, fontSize: 30, color: PINK }}>{fr >= at(57) ? "toda segunda · 9h" : ""}</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", marginTop: 8 }}>{typed("resumir os comentários do canal", fr, at(59), at(63) + 6)}{fr < at(63) + 6 && blink(fr)}</div>
          </div>}
        </Janela>
      </Palco>
    </>
  );
};

const ARQS = ["seg-03.txt", "seg-10.txt", "seg-17.txt", "seg-24.txt"];
const Item2 = ({ fr }) => {
  const pasta = at(72), ferr = at(70), acesso = at(78), ler = at(80);
  return (
    <>
      <Chip n={2} titulo="Contexto + 1 ferramenta" sub="só o que a tarefa pede" fr={fr} d={at(64)} />
      <Palco top={470}>
        <div style={{ width: 940, height: 860, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 440, height: 520, borderRadius: 30, background: WIN, border: `3px solid ${fr >= pasta ? PINK : "rgba(190,160,255,0.3)"}`, padding: 30, transform: `scale(${pop(fr, at(66), 11)})` }}>
            <div style={{ fontSize: 90 }}>{fr >= pasta ? "📂" : "📁"}</div>
            <div style={{ fontFamily: MONO, fontSize: 32, color: "#fff", marginBottom: 16 }}>comentarios/</div>
            {ARQS.map((a, k) => fr >= pasta + k * 4 && <div key={a} style={{ fontFamily: MONO, fontSize: 30, color: BODY, padding: "8px 0", transform: `translateX(${(1 - pop(fr, pasta + k * 4, 11)) * -200}px)` }}>📄 {a}</div>)}
          </div>
          <div style={{ position: "absolute", right: 0, top: 0, width: 440, height: 520, borderRadius: 30, background: WIN, border: `3px solid ${fr >= ferr ? PINK : "rgba(190,160,255,0.3)"}`, padding: 30, opacity: fr >= ferr - 4 ? 1 : 0.3, transform: `scale(${fr >= ferr ? pop(fr, ferr, 11) : 0.9})` }}>
            <div style={{ fontSize: 90, transform: `rotate(${Math.sin(fr / 5) * 10}deg)` }}>🛠️</div>
            <div style={{ fontFamily: MONO, fontSize: 32, color: "#fff", marginBottom: 20 }}>ler_arquivo()</div>
            {[["ler", ler, true], ["apagar", ler + 6, false], ["enviar", ler + 12, false]].map(([t, d, ok]) => <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, opacity: fr >= acesso ? 1 : 0.3 }}>
              <div style={{ width: 90, height: 48, borderRadius: 24, background: fr >= d && ok ? GREEN : "rgba(255,255,255,0.15)", position: "relative" }}>
                <div style={{ position: "absolute", top: 6, left: fr >= d && ok ? 48 : 6, width: 36, height: 36, borderRadius: 18, background: "#fff" }} />
              </div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: ok ? "#fff" : GREY }}>{t}</div>
            </div>)}
          </div>
          {fr >= ferr + 6 && <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${pop(fr, ferr + 6, 10)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "26px 40px", borderRadius: 30, background: PINKA(0.3), border: `3px solid ${PINK}` }}>
              <div style={{ fontSize: 80 }}>🤖</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>agente</div>
              <div style={{ fontFamily: MONO, fontSize: 36, color: GREEN }}>{fr >= ler ? "● lendo…" : "● pronto"}</div>
            </div>
          </div>}
        </div>
      </Palco>
    </>
  );
};

const Item3 = ({ fr }) => {
  const nodes = [["busca contexto", at(88)], ["age", at(91)], ["confere", at(92)], ["repete", at(97)]];
  const act = fr >= at(97) ? Math.floor((fr - at(97)) / 8) % 4 : nodes.reduce((m, [, d], k) => (fr >= d ? k : m), -1);
  const volta = fr >= at(97) ? 1 + Math.floor((fr - at(97)) / 32) : 1;
  return (
    <>
      <Chip n={3} titulo="Roda o ciclo" sub="e confere o próprio trabalho" fr={fr} d={at(81)} />
      <Palco top={430}>
        <div style={{ position: "relative" }}>
          <Loop fr={fr} nodes={nodes} a={at(85)} active={act} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: MONO, fontSize: 44, color: "#fff", opacity: lin(fr, at(85), at(87)) }}>volta {volta}</div>
        </div>
      </Palco>
    </>
  );
};

const Item4 = ({ fr }) => {
  const lim = at(103), ponto = at(108), apr = at(111), sair = at(114);
  const voltas = Math.min(5, Math.floor(interpolate(fr, [lim + 4, at(106)], [0, 5.99], clamp)));
  const aprovado = fr >= sair;
  return (
    <>
      <Chip n={4} titulo="Põe um freio" sub="limite + sua aprovação" fr={fr} d={at(98)} />
      <Palco top={470}>
        <Janela w={940} h={860} title="agente · resumo semanal">
          {fr < lim && <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", transform: `scale(${pop(fr, at(98) + 8, 8) * (fr >= at(102) ? 1 + 0.15 * Math.max(0, 1 - (fr - at(102)) / 8) : 1)}) rotate(${Math.sin(fr / 3) * 5}deg)` }}>
            <div style={{ fontSize: 260 }}>🛑</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff" }}>{fr >= at(102) ? "FREIO" : "põe…"}</div>
          </div>}
          <div style={{ fontFamily: MONO, fontSize: 32, color: GREY, opacity: lin(fr, lim - 4, lim) }}>limite de voltas</div>
          <div style={{ display: "flex", gap: 14, marginTop: 14, opacity: lin(fr, lim - 4, lim) }}>
            {[1, 2, 3, 4, 5].map((k) => <div key={k} style={{ flex: 1, height: 70, borderRadius: 16, background: k <= voltas ? (k === 5 ? RED : PINK) : "rgba(255,255,255,0.08)", transform: `scale(${k <= voltas ? pop(fr, lim + 4 + k * 3, 9) : 1})` }} />)}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: voltas === 5 ? RED : "#fff", marginTop: 16, opacity: lin(fr, lim - 4, lim) }}>{voltas}/5 {voltas === 5 ? "· para aqui ✋" : ""}</div>
          {fr >= ponto && <div style={{ marginTop: 40, padding: 30, borderRadius: 26, background: "rgba(45,25,90,0.97)", border: `3px solid ${aprovado ? GREEN : PINK}`, transform: `translateY(${(1 - pop(fr, ponto)) * 140}px)` }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>✋ Enviar o resumo?</div>
            <div style={{ fontFamily: inter, fontSize: 34, color: BODY, marginTop: 10 }}>aguardando você</div>
            <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: aprovado ? "#fff" : "#140b2e", background: aprovado ? GREEN : "#fff", padding: "16px 36px", borderRadius: 18, transform: `scale(${fr >= apr && !aprovado ? 0.9 + 0.05 * Math.sin(fr) : 1})` }}>{aprovado ? "Aprovado ✓" : "Aprovar"}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: GREY, padding: "16px 36px", borderRadius: 18, border: "2px solid rgba(255,255,255,0.25)" }}>Revisar</div>
            </div>
          </div>}
          {fr >= apr && !aprovado && <div style={{ position: "absolute", left: 200, top: 640 + (1 - lin(fr, apr, apr + 8)) * 120, fontSize: 70 }}>👆</div>}
        </Janela>
      </Palco>
    </>
  );
};

const Virada = ({ fr }) => {
  const ok = at(115), seg = at(119);
  return (
    <>
      <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", transform: `scale(${pop(fr, ok, 10)})` }}>
        <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 24 }}>funcionou?</span>
      </div>
      <Palco top={540}>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          {[["tarefa 1", "resumo dos comentários", ok + 6, true], ["tarefa 2", "a próxima da semana", seg, false]].map(([t, s, d, done]) => fr >= d && <div key={t} style={{ width: 900, display: "flex", alignItems: "center", gap: 30, padding: "34px 40px", borderRadius: 30, background: WIN, border: `3px solid ${done ? GREEN : PINK}`, transform: `translateX(${(1 - pop(fr, d, 11)) * 700}px)` }}>
            <div style={{ width: 100, height: 100, borderRadius: 24, background: done ? GREEN : PINKA(0.35), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#140b2e" }}>{done ? "✓" : "+"}</div>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 54, color: "#fff" }}>{t}</div>
              <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 36, color: BODY }}>{s}</div>
            </div>
          </div>)}
        </div>
      </Palco>
    </>
  );
};

const CTA = ({ fr }) => {
  const seg = fr >= at(127);
  const bolhas = Array.from({ length: 10 }, (_, k) => {
    const st = at(124) + k * 7; if (fr < st) return null;
    const p = (fr - st) / 50; if (p > 1) return null;
    return <div key={k} style={{ position: "absolute", left: 120 + ((k * 173) % 760), top: 1350 - p * 900, opacity: 1 - p, fontSize: 64, transform: `rotate(${(k % 2 ? 1 : -1) * 12}deg)` }}>{k % 3 ? "💬" : "💜"}</div>;
  });
  return (
    <>
      {bolhas}
      <Palco top={420}>
        <div style={{ width: 900, padding: 44, borderRadius: 34, background: WIN, border: `2px solid ${PINKA(0.6)}`, transform: `scale(${pop(fr, at(123), 11)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 90, height: 90, borderRadius: 45, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>💬</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>Comente</div>
          </div>
          <div style={{ marginTop: 28, fontFamily: MONO, fontSize: 90, color: "#fff", border: `3px solid ${PINK}`, borderRadius: 20, padding: "14px 30px" }}>{typed("AGENTE", fr, at(124), at(124) + 10)}{blink(fr)}</div>
          <div style={{ marginTop: 34, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 44, color: seg ? "#fff" : "#140b2e", background: seg ? "rgba(255,255,255,0.12)" : "#fff", padding: "16px 40px", borderRadius: 18, transform: `scale(${seg ? 1 + 0.1 * Math.max(0, 1 - (fr - at(127)) / 8) : 1})` }}>{seg ? "Seguindo ✓" : "Seguir"}</div>
          {fr >= at(129) && <div style={{ marginTop: 34, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", opacity: lin(fr, at(129), at(129) + 6) }}>📘 guia oficial na legenda <span style={{ display: "inline-block", transform: `translateY(${Math.abs(Math.sin(fr / 5)) * 14}px)`, color: PINK }}>↓</span></div>}
        </div>
      </Palco>
    </>
  );
};

const Reacao = ({ fr, a, b, pose }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 340, right: 30 - (1 - pin) * 420 - pout * 420, top: 1150 }} />;
};

// ---------- legendas 1–3 palavras ----------
const KEY = new Set(["agente", "falhar", "tudo", "quatro", "passos", "menor", "util", "quarto", "ninguem", "anthropic", "simples", "ferramentas", "loop", "escolhe", "tarefa", "semana", "fim", "claro", "segunda", "resumir", "contexto", "ferramenta", "pasta", "ler", "ciclo", "busca", "age", "confere", "repete", "freio", "limite", "voltas", "aprovar", "funcionou", "segunda", "agente", "segue", "legenda", "guia"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4" };
const buildChunks = (words) => {
  const toks = [];
  words.forEach((x, k) => {
    const n = norm(x.w);
        if (n === "numero") { toks.push({ t: "Nº", s: x.s, e: x.e, key: true }); return; }
    toks.push({ t: x.w, s: x.s, e: x.e });
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
        const base = w.t.replace(/\.\.\.$/, "").replace(/[.,!?:;…]+$/g, "");
        const n = norm(base);
        const prevNum = i > 0 && chunk[i - 1].t === "Nº";
        const shown = prevNum && NUM[n] ? NUM[n] : base;
        const key = w.key || (prevNum && NUM[n]) || KEY.has(n);
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortPrimeiroAgente = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(24), at(41), at(64), at(81), at(98), at(115), at(123), end];
  const scenes = [Hook, Simples, Item1, Item2, Item3, Item4, Virada, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Cena key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      <Reacao fr={fr} a={at(4)} b={at(8)} pose="surpresa" />
      <Reacao fr={fr} a={at(100)} b={at(107)} pose="apontando" />
      <Reacao fr={fr} a={at(123)} b={end} pose="comemorando" />
      {fr >= at(8) && <Legendas chunks={chunks} fr={fr} />}
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} /></Sequence>
      <Sequence from={at(4)} durationInFrames={25}><Audio src={staticFile("sfx/error.mp3")} volume={0.5} /></Sequence>
      <Sequence from={at(8)} durationInFrames={20}><Audio src={staticFile("sfx/pop.mp3")} volume={0.4} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      {[at(100), at(123)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.3} /></Sequence>)}
      <Sequence from={at(114)} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

export const CapaPrimeiroAgente = () => {
  const fr = 40;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={999} />
      <div style={{ position: "absolute", top: 320, left: 70, right: 70, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 120, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Seu 1º agente</div>
        <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 130, color: "#fff", background: RED, padding: "0 36px", borderRadius: 24, marginTop: 20, transform: "rotate(-3deg)" }}>vai falhar</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 84, color: "#fff", lineHeight: 1.05, marginTop: 30 }}>se fizer tudo</div>
      </div>
      <div style={{ position: "absolute", top: 1000, left: 90, width: 600, padding: 30, borderRadius: 30, background: WIN, border: `3px solid ${RED}` }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {TAREFAS.slice(0, 9).map((t, k) => <div key={t} style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", padding: "10px 20px", borderRadius: 30, background: "rgba(255,92,122,0.3)", transform: `rotate(${Math.sin(k * 1.7) * 6}deg)` }}>{t}</div>)}
        </div>
        <div style={{ marginTop: 20, fontFamily: MONO, fontSize: 36, color: RED }}>✗ travou no meio</div>
      </div>
      <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 420, right: 40, top: 1160 }} />
    </AbsoluteFill>
  );
};
