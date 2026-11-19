import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 19/11/2026 12:00 — "Seu Claude Code cria um jogo inteiro: 75 skills grátis".
// Fonte primária (só no texto do post): github.com/Donchitos/Claude-Code-Game-Studios (README, commit abc0de7):
// 75 skills (+3 nomes antigos), 49 agentes, MIT; /prototype → perguntas → resumo de 1 página → jogo no
// navegador → testado num navegador headless → muda pedindo, checkpoints, painel de ajuste; Godot/Unity/Unreal.
// O título de trabalho dizia 79; a fonte diz 75, então o vídeo diz 75.
// Palco contínuo com interface recriada em motion; cada ação disparada pela palavra da fala
// (índice `i` em audio/words.json). Nada de print, nada gerado por IA, nenhum crédito na tela.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SGS_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-19-1200-claude-code-79-habilidades-jogo";
export const SGS_FPS = 30;
const FPS = SGS_FPS;
const f = (p) => staticFile(`${SGS_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const YEL = "#febc2e";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const TAIL = 0.45;

export const calculateGameStudiosMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const end = wj.words[wj.words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words: wj.words, endSec: end + TAIL } };
};

let W = {};
const at = (i) => (W[i] ? Math.round(W[i].s * FPS) : 0);
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);

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
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 160, 175) }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);

const Janela = ({ title = "claude", children, w = 900, h = 760, style = {}, border, dashed }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `${dashed ? 4 : 2}px ${dashed ? "dashed" : "solid"} ${border || "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.18)}`, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginLeft: 14, whiteSpace: "nowrap" }}>{title}</div>
    </div>
    <div style={{ padding: 30, position: "relative", height: h - 64 }}>{children}</div>
  </div>
);

const Chip = ({ n, titulo, sub, fr, d }) => {
  const p = pop(fr, d, 13);
  return (
    <div style={{ position: "absolute", top: 190, left: 90, right: 90, display: "flex", alignItems: "center", gap: 28, padding: "22px 32px", borderRadius: 28, background: "rgba(30,18,60,0.92)", border: `2px solid ${PINKA(0.6)}`, transform: `translateY(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`, opacity: p }}>
      <div style={{ width: 96, height: 96, borderRadius: 24, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{n}</div>
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

const Palco = ({ children, top = 430 }) => {
  const fr = useCurrentFrame();
  return <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${Math.sin(fr / 18) * 8}px)` }}>{children}</div>;
};

const Big = ({ children, fr, d, top = 220, bg = PINK, rot = 0, size = 150 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", transform: `scale(${d <= 0 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : pop(fr, d, 9)})` }}>
    <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: size, color: "#fff", background: bg, padding: "0 42px", borderRadius: 30, transform: `rotate(${rot}deg)` }}>{children}</span>
  </div>
);

const Cursor = ({ x, y, click }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: 64, transform: `scale(${click ? 0.85 : 1})`, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.7))" }}>🖱️</div>
);

// Mini-jogo de pesca ao entardecer (o exemplo do próprio README), desenhado em divs, sempre em movimento.
const Pesca = ({ fr, w = 840, h = 520, speed = 1, score = true }) => {
  const t = fr * speed;
  const water = h * 0.55;
  const fish = [0, 1, 2, 3].map((k) => {
    const x = ((t * (2.2 + k * 0.7) + k * 260) % (w + 160)) - 80;
    const y = water + 40 + k * ((h - water - 90) / 4) + Math.sin(t / 9 + k) * 10;
    return <div key={k} style={{ position: "absolute", left: k % 2 ? w - x : x, top: y, fontSize: 54, transform: `scaleX(${k % 2 ? 1 : -1})` }}>{k === 2 ? "🐠" : "🐟"}</div>;
  });
  const lineX = w * 0.55, bob = Math.sin(t / 6) * 10;
  const n = Math.floor(t / 22) % 40;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 20, overflow: "hidden", background: "linear-gradient(#ff8a5c 0%, #c2457a 38%, #4b1f6e 55%)" }}>
      <div style={{ position: "absolute", left: w * 0.18, top: water - 90, width: 150, height: 150, borderRadius: 75, background: "#ffd27a", boxShadow: "0 0 80px #ffb36b" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: water, bottom: 0, background: "linear-gradient(#2a1d6b, #120a33)" }} />
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: ((t * 1.5 + k * 300) % (w + 200)) - 200, top: water + 6 + k * 18, width: 160, height: 4, borderRadius: 2, background: "rgba(255,210,150,0.35)" }} />)}
      <div style={{ position: "absolute", left: lineX - 120, top: water - 70 + bob * 0.4, fontSize: 90 }}>🛶</div>
      <div style={{ position: "absolute", left: lineX + 40, top: water - 40, width: 3, height: 90 + bob, background: "#fff" }} />
      <div style={{ position: "absolute", left: lineX + 30, top: water + 44 + bob, width: 22, height: 22, borderRadius: 11, background: RED, border: "3px solid #fff" }} />
      {fish}
      {score && <div style={{ position: "absolute", right: 18, top: 14, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#fff", background: "rgba(0,0,0,0.35)", padding: "4px 14px", borderRadius: 12 }}>🐟 {n}</div>}
    </div>
  );
};

// ---------- 0: gancho (0 → "É o") ----------
const Hook = ({ fr }) => {
  const jogo = at(5), roda = at(7), num = at(8), gratis = at(12), pacote = at(14), quatro = at(18), absurda = at(21);
  const flash = Math.max(0, 1 - Math.abs(fr - roda) / 5) * 0.4, flash2 = Math.max(0, 1 - Math.abs(fr - absurda) / 5) * 0.35;
  const prompt = "/prototype jogo de pesca ao entardecer";
  const count = Math.round(75 * ease(lin(fr, num, num + 26)));
  return (
    <>
      <AbsoluteFill style={{ background: `rgba(222,64,200,${flash})` }} />
      <AbsoluteFill style={{ background: `rgba(255,92,122,${flash2})` }} />
      {fr < num && <>
        <Big fr={fr} d={fr >= roda ? roda : 0} bg={fr >= roda ? GREEN : PINK} rot={fr >= roda ? -3 : 2}>{fr >= roda ? "já roda!" : "1 frase…"}</Big>
        <div style={{ position: "absolute", top: fr >= jogo ? 430 : 560, left: 70, right: 70, padding: "22px 26px", borderRadius: 26, background: WIN, border: `3px solid ${PINK}`, transform: `scale(${fr >= jogo ? 0.9 : interpolate(fr, [0, 8], [1.15, 1], clamp)})` }}>
          <div style={{ fontFamily: MONO, fontSize: 34, color: "#fff", whiteSpace: "nowrap" }}><span style={{ color: PINK }}>›</span> {typed(prompt, fr + 10, 0, jogo + 2)}{blink(fr)}</div>
        </div>
        {fr < jogo && <div style={{ position: "absolute", top: 700, left: 90, right: 90, height: 520, borderRadius: 30, border: `5px dashed ${PINKA(0.7)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp) * (1 + 0.03 * Math.sin(fr / 2))})` }}>
          <div style={{ fontSize: 170, transform: `rotate(${Math.sin(fr / 3) * 10}deg)` }}>🎮</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: "#fff", marginTop: 10 }}>gerando jogo… {Math.round(99 * lin(fr, 0, jogo))}%</div>
          <div style={{ marginTop: 24, width: 640, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}><div style={{ width: `${lin(fr, 0, jogo) * 100}%`, height: "100%", background: PINK }} /></div>
        </div>}
        {fr >= jogo && <div style={{ position: "absolute", top: 610, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${pop(fr, jogo, 11)}) translateY(${(1 - pop(fr, jogo, 11)) * 300}px)` }}>
          <Janela title="pesca/index.html" w={900} h={640} border={fr >= roda ? GREEN : PINKA(0.6)}>
            <Pesca fr={fr - jogo} w={840} h={520} speed={1.6} />
          </Janela>
        </div>}
        {fr >= roda && <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", transform: `scale(${pop(fr, roda, 9)})` }}>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#1a1030", background: GREEN, padding: "10px 28px", borderRadius: 30 }}>▶ rodando</span>
        </div>}
      </>}
      {fr >= num && fr < quatro && <>
        <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", transform: `scale(${pop(fr, num, 9)})` }}>
          <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 230, color: "#fff", background: PINK, padding: "0 50px", borderRadius: 34, lineHeight: 1.15 }}>{count}</span>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff", marginTop: 10 }}>skills</div>
        </div>
        <div style={{ position: "absolute", top: 640, left: 105, width: 870, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {Array.from({ length: 75 }, (_, k) => {
            const on = k < count;
            const inBox = fr >= pacote ? lin(fr, pacote + (k % 15), pacote + (k % 15) + 10) : 0;
            const tx = (435 - ((k % 15) * 58 + 24)) * inBox, ty = (520 - Math.floor(k / 15) * 58) * inBox;
            return <div key={k} style={{ width: 48, height: 48, borderRadius: 12, background: on ? (k % 5 === 3 ? PINK : "rgba(190,160,255,0.55)") : "rgba(255,255,255,0.08)", transform: `translate(${tx}px, ${ty}px) scale(${on ? 1 - 0.6 * inBox : 0.6})`, opacity: 1 - 0.9 * inBox }} />;
          })}
        </div>
        {fr >= gratis && <div style={{ position: "absolute", top: 560, right: 70, transformOrigin: "50% 0", transform: `rotate(${Math.sin((fr - gratis) / 5) * 14 * Math.exp(-(fr - gratis) / 40) + 6}deg) scale(${pop(fr, gratis, 9)})` }}>
          <div style={{ width: 4, height: 70, background: "#fff", margin: "0 auto" }} />
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 84, color: "#1a1030", background: YEL, padding: "14px 34px", borderRadius: 22, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>R$ 0</div>
        </div>}
        {fr >= pacote && <div style={{ position: "absolute", top: 1080, width: "100%", textAlign: "center", fontSize: 200, transform: `scale(${pop(fr, pacote + 6, 9)}) rotate(${Math.sin(fr / 4) * 4}deg)` }}>📦</div>}
      </>}
      {fr >= quatro && <>
        <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", transform: `scale(${pop(fr, quatro, 10)})` }}>a nº 4 é…</div>
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
          {[1, 2, 3, 4, 5].map((k) => {
            const hot = k === 4;
            const pulse = hot ? 1.18 + 0.08 * Math.abs(Math.sin((fr - quatro) / 4)) : 1;
            return <div key={k} style={{ width: 170, height: 250, borderRadius: 26, background: hot ? PINKA(0.4) : WIN, border: `4px ${hot ? "dashed" : "solid"} ${hot ? PINK : "rgba(255,255,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, quatro + k * 2, 10) * pulse}) rotate(${hot ? Math.sin(fr / 3) * 5 : 0}deg) translateX(${hot ? shake(fr, absurda, 16) : 0}px)` }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff" }}>{k}</div>
              {hot && <div style={{ fontSize: 64 }}>{fr >= absurda ? "🤯" : "❓"}</div>}
            </div>;
          })}
        </div>
        {fr >= absurda && <Big fr={fr} d={absurda} top={880} bg={RED} rot={-4} size={130}>absurda!</Big>}
      </>}
    </>
  );
};

// ---------- 1: nome + estrelas + 49 agentes ----------
const AGENTES = [["🎬", "diretor criativo"], ["🎮", "game designer"], ["🗺️", "level designer"], ["🎨", "diretor de arte"], ["🎧", "diretor de áudio"], ["✍️", "roteirista"], ["💻", "programador"], ["🧪", "testador"]];
const Nome = ({ fr }) => {
  const a = at(22), nome = at(24), mais = at(28), git = at(34), vira = at(35), q = at(39), ag = at(42), dir = at(44), test = at(47);
  const stars = Math.round(40097 * ease(lin(fr, mais, git + 8)));
  const nAg = Math.round(49 * ease(lin(fr, q, ag + 10)));
  return (
    <>
      {fr < vira && <Palco top={330}>
        <Janela title="github · repositório" w={940} h={820} border={PINKA(0.6)} style={{ transform: `scale(${pop(fr, a - 2, 12)})` }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>Donchitos /</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.1, marginTop: 6, minHeight: 150 }}>{typed("Claude Code Game Studios", fr, nome - 4, at(27) + 6)}{fr < at(27) + 6 && blink(fr)}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            {[["75 skills", PINK], ["49 agentes", "rgba(190,160,255,0.35)"], ["MIT", GREEN]].map(([t, c], k) => <div key={t} style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: k === 2 ? "#1a1030" : "#fff", background: c, padding: "10px 24px", borderRadius: 30, transform: `scale(${pop(fr, nome + 6 + k * 4, 10)})` }}>{t}</div>)}
          </div>
          <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 24, transform: `scale(${fr >= mais ? pop(fr, mais, 10) : 0})` }}>
            <div style={{ fontSize: 120, color: YEL, transform: `rotate(${fr * 3}deg)` }}>★</div>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 130, color: "#fff", lineHeight: 1 }}>{stars.toLocaleString("pt-BR")}</div>
              <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 44, color: BODY }}>estrelas {fr >= git && <span style={{ background: PINK, color: "#fff", padding: "0 14px", borderRadius: 12 }}>no GitHub</span>}</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 30, right: 30, bottom: 40, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ width: `${lin(fr, mais, git + 8) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${YEL}, ${PINK})` }} />
          </div>
        </Janela>
      </Palco>}
      {fr >= vira && <>
        <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", transform: `scale(${pop(fr, vira, 10)})` }}>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff" }}>🏢 seu estúdio: </span>
          <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 100, color: "#fff", background: PINK, padding: "0 24px", borderRadius: 20 }}>{nAg}</span>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: BODY, marginTop: 6 }}>agentes</div>
        </div>
        <div style={{ position: "absolute", top: 520, left: 90, width: 900, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {Array.from({ length: 49 }, (_, k) => {
            const on = k < nAg;
            return <div key={k} style={{ width: 88, height: 88, borderRadius: 44, background: on ? (k % 6 === 0 ? PINK : "rgba(190,160,255,0.5)") : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, transform: `scale(${on ? 1 : 0.5})` }}>{on ? AGENTES[k % 8][0] : ""}</div>;
          })}
        </div>
        {[[dir, 0, 0], [test, 7, 1]].map(([d, idx, k]) => fr >= d && (
          <div key={idx} style={{ position: "absolute", top: 1180, left: k ? 560 : 90, width: 430, padding: "22px 20px", borderRadius: 26, background: WIN, border: `4px solid ${k ? GREEN : PINK}`, display: "flex", alignItems: "center", gap: 16, transform: `scale(${pop(fr, d, 9)}) rotate(${k ? 3 : -3}deg)` }}>
            <div style={{ fontSize: 70 }}>{AGENTES[idx][0]}</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>{AGENTES[idx][1]}{k ? " ✓" : ""}</div>
          </div>
        ))}
      </>}
    </>
  );
};

// ---------- 2: barra prototype + fica até o fim ----------
const Comando = ({ fr }) => {
  const a = at(48), barra = at(50), ideia = at(52), fica = at(55), fim = at(58);
  return (
    <>
      <Palco top={330}>
        <Janela title="claude code · terminal" w={940} h={560} style={{ transform: `scale(${pop(fr, a - 2, 12)})` }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>✻ Claude Code</div>
          <div style={{ marginTop: 40, fontFamily: MONO, fontSize: 50, color: "#fff", lineHeight: 1.35 }}>
            <span style={{ color: PINK }}>›</span> <span style={{ color: YEL }}>{typed("/prototype", fr, barra - 4, barra + 10)}</span> {fr >= ideia - 2 && typed("um jogo de pesca ao entardecer", fr, ideia - 2, fica - 2)}{blink(fr)}
          </div>
          {fr >= barra && fr < ideia + 4 && <div style={{ marginTop: 26, width: 520, borderRadius: 16, background: "rgba(45,25,90,0.98)", border: `2px solid ${PINKA(0.6)}`, overflow: "hidden", transform: `scaleY(${pop(fr, barra, 12)})`, transformOrigin: "50% 0" }}>
            {["/prototype", "/start", "/brainstorm"].map((o, k) => <div key={o} style={{ padding: "12px 22px", fontFamily: MONO, fontSize: 32, color: "#fff", background: k === 0 ? PINKA(0.5) : "transparent" }}>{o}</div>)}
          </div>}
          {fr >= fica - 2 && <div style={{ position: "absolute", left: 600, top: 330, fontSize: 90, transform: `scale(${pop(fr, fica - 2, 9)})` }}>↵</div>}
        </Janela>
      </Palco>
      {fr >= fica && <div style={{ position: "absolute", top: 960, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        {[1, 2, 3, 4, 5].map((k) => <div key={k} style={{ width: 150, height: 150, borderRadius: 24, background: fr >= fim && k === 4 ? PINK : WIN, border: `3px solid ${PINKA(0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff", transform: `scale(${pop(fr, fica + k * 2, 10) * (fr >= fim && k === 4 ? 1.15 + 0.05 * Math.sin(fr / 3) : 1)})` }}>{k}</div>)}
      </div>}
      {fr >= fim && <div style={{ position: "absolute", top: 1170, left: 190, width: 700, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
        <div style={{ width: `${lin(fr, fim, fim + 14) * 100}%`, height: "100%", background: PINK }} />
      </div>}
    </>
  );
};

// ---------- item 1: perguntas ----------
const Item1 = ({ fr }) => {
  const a = at(59), perg = at(62), vis = at(64), dif = at(65), obj = at(66), nao = at(67), resp = at(69), esc = at(71);
  const rows = [["🎨", "visual", ["pixel", "desenho", "3D"], vis], ["🔥", "dificuldade", ["fácil", "médio", "difícil"], dif], ["🏆", "objetivo", ["peixe raro", "recorde", "história"], obj]];
  return (
    <>
      <Chip n="1" titulo="Ele pergunta antes" sub="uma rodada de perguntas" fr={fr} d={a} />
      <Palco top={430}>
        <Janela title="claude · /prototype" w={940} h={900} style={{ transform: `scale(${pop(fr, a + 3, 12)})` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", opacity: lin(fr, perg, perg + 6) }}>✦ Antes de construir, 3 perguntas:</div>
          {rows.map(([ic, t, ops, d], k) => {
            const auto = fr >= esc + 2;
            const sel = auto ? 1 : fr >= d + 12 ? (k === 1 ? 1 : 0) : -1;
            return fr >= d - 3 && <div key={t} style={{ marginTop: 34, transform: `translateX(${(1 - pop(fr, d - 3, 12)) * 300}px)`, opacity: pop(fr, d - 3, 12) }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: BODY }}>{ic} {t}?</div>
              <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                {ops.map((o, j) => <div key={o} style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", padding: "12px 26px", borderRadius: 20, background: sel === j ? (auto ? GREEN : PINK) : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", transform: `scale(${sel === j ? 1.08 : 1})` }}>{o}{sel === j && " ✓"}</div>)}
              </div>
            </div>;
          })}
          {fr >= nao && <div style={{ position: "absolute", left: 30, right: 30, bottom: 40, padding: 24, borderRadius: 24, background: "rgba(45,25,90,0.97)", border: `3px solid ${PINK}`, transform: `scale(${pop(fr, nao, 11)})` }}>
            <div style={{ fontFamily: MONO, fontSize: 40, color: "#fff" }}>› {fr < resp ? "🤷 não sei…" : typed("você escolhe", fr, resp, esc + 4)}{blink(fr)}</div>
          </div>}
        </Janela>
      </Palco>
    </>
  );
};

// ---------- item 2: resumo de uma página ----------
const SECOES = ["suas palavras", "o visual", "o primeiro minuto", "o desafio", "fica pra depois"];
const Item2 = ({ fr }) => {
  const a = at(72), res = at(75), pag = at(78), le = at(79), manda = at(82);
  const scan = lin(fr, le, manda);
  return (
    <>
      <Chip n="2" titulo="Resumo de 1 página" sub="game-brief.md" fr={fr} d={a} />
      <Palco top={420}>
        <div style={{ position: "relative", width: 760, height: 900, borderRadius: 24, background: "#f6f2ff", boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 70px ${PINKA(0.3)}`, padding: 44, transform: `scale(${pop(fr, a + 3, 12)}) rotate(${Math.sin(fr / 20) * 1.5}deg)` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#1a1030" }}>🎣 Pesca ao entardecer</div>
          <div style={{ fontFamily: MONO, fontSize: 24, color: "#7a6aa8", marginTop: 4 }}>design/game-brief.md · 1 página</div>
          {SECOES.map((s, k) => {
            const d = res + k * 5;
            return fr >= d && <div key={s} style={{ marginTop: 26, opacity: lin(fr, d, d + 5) }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: PINK }}>{s} {fr >= d + 8 && <span style={{ color: "#16a34a" }}>✓</span>}</div>
              <div style={{ height: 14, width: `${interpolate(lin(fr, d, d + 10), [0, 1], [0, 92 - k * 9])}%`, borderRadius: 7, background: "#cfc6ea", marginTop: 10 }} />
              <div style={{ height: 14, width: `${interpolate(lin(fr, d + 3, d + 12), [0, 1], [0, 70 - k * 5])}%`, borderRadius: 7, background: "#cfc6ea", marginTop: 8 }} />
            </div>;
          })}
          {fr >= le && fr < manda + 4 && <div style={{ position: "absolute", left: 20, right: 20, top: 150 + scan * 620, height: 70, borderRadius: 14, background: PINKA(0.18), border: `3px solid ${PINKA(0.6)}` }}>
            <div style={{ position: "absolute", right: -30, top: -20, fontSize: 70 }}>👀</div>
          </div>}
          {fr >= pag && fr < le && <div style={{ position: "absolute", right: -40, top: -30, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: PINK, padding: "10px 24px", borderRadius: 20, transform: `scale(${pop(fr, pag, 9)}) rotate(6deg)` }}>1 página</div>}
        </div>
      </Palco>
      {fr >= manda - 6 && <div style={{ position: "absolute", top: 1240, width: "100%", textAlign: "center", transform: `scale(${pop(fr, manda - 6, 10) * (fr >= manda + 4 && fr < manda + 9 ? 0.88 : 1)})` }}>
        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff", background: fr >= manda + 4 ? GREEN : PINK, padding: "18px 50px", borderRadius: 40, boxShadow: `0 0 50px ${PINKA(0.6)}` }}>{fr >= manda + 4 ? "construindo… ⚙️" : "construir ▶"}</span>
      </div>}
    </>
  );
};

// ---------- item 3: jogo pronto no navegador ----------
const Item3 = ({ fr }) => {
  const a = at(84), jogo = at(87), nav = at(90), abre = at(91), clq = at(94), duplo = at(95), sem = at(96), eng = at(97);
  const open = duplo + 4;
  const g = lin(fr, abre, clq);
  return (
    <>
      <Chip n="3" titulo="O jogo pronto" sub="direto no navegador" fr={fr} d={a} />
      {fr < open && <Palco top={460}>
        <div style={{ position: "relative", width: 940, height: 760 }}>
          <Janela title="prototypes/pesca/" w={940} h={560} style={{ transform: `scale(${pop(fr, a + 3, 12)})` }}>
            <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
              {[["📄", "index.html", a + 5], ["📁", "assets", a + 10], ["📝", "notas.md", a + 15]].map(([ic, t, d], k) => fr >= d && <div key={t} style={{ textAlign: "center", padding: 16, borderRadius: 20, background: k === 0 && fr >= clq ? PINKA(0.35) : "transparent", transform: `scale(${pop(fr, d, 10)})` }}>
                <div style={{ fontSize: 140 }}>{ic}</div>
                <div style={{ fontFamily: MONO, fontSize: 30, color: "#fff" }}>{t}</div>
              </div>)}
            </div>
            {fr >= nav && <div style={{ position: "absolute", left: 30, bottom: 40, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", opacity: lin(fr, nav, nav + 6) }}>🌐 abre no navegador</div>}
          </Janela>
          {fr >= abre && <Cursor x={interpolate(g, [0, 1], [700, 150])} y={interpolate(g, [0, 1], [700, 230])} click={(fr >= clq && fr < clq + 4) || (fr >= duplo && fr < duplo + 4)} />}
          {[clq, duplo].map((d, k) => fr >= d && fr < d + 12 && <div key={k} style={{ position: "absolute", left: 150 - 40 * lin(fr, d, d + 12), top: 230 - 40 * lin(fr, d, d + 12), width: 80 + 80 * lin(fr, d, d + 12), height: 80 + 80 * lin(fr, d, d + 12), borderRadius: "50%", border: `5px solid ${PINK}`, opacity: 1 - lin(fr, d, d + 12) }} />)}
          {fr >= clq && <div style={{ position: "absolute", left: 280, top: 620, fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff", transform: `scale(${pop(fr, clq, 9)})` }}>clique {fr >= duplo && <span style={{ background: PINK, padding: "0 14px", borderRadius: 12 }}>×2</span>}</div>}
        </div>
      </Palco>}
      {fr >= open && <Palco top={420}>
        <div style={{ position: "relative", transform: `scale(${pop(fr, open, 11)})` }}>
          <Janela title="🌐 pesca/index.html" w={940} h={700} border={GREEN}>
            <Pesca fr={fr - open} w={880} h={580} speed={1.4} />
          </Janela>
        </div>
      </Palco>}
      {fr >= sem && <div style={{ position: "absolute", top: 1180, width: "100%", textAlign: "center", transform: `scale(${pop(fr, sem, 9)}) rotate(-2deg)` }}>
        <span style={{ position: "relative", fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", background: "rgba(255,92,122,0.3)", padding: "12px 34px", borderRadius: 22 }}>
          instalar engine
          <span style={{ position: "absolute", left: 0, top: "50%", height: 8, background: RED, width: `${lin(fr, eng, eng + 10) * 100}%` }} />
        </span>
      </div>}
    </>
  );
};

// ---------- item 4: testa sozinho ----------
const CHECKS = [["abre sem erro", 0], ["responde às teclas", 1], ["texto legível", 2], ["tela não trava", 3]];
const Item4 = ({ fr }) => {
  const a = at(99), testa = at(104), so = at(105), aperta = at(106), teclas = at(108), invis = at(110), caca = at(112), erro = at(113), tela = at(115), corrige = at(118), entrega = at(122);
  const keys = ["←", "→", "␣", "↑"];
  const kOn = fr >= aperta ? Math.floor((fr - aperta) / 5) % 4 : -1;
  const fixed = (k) => fr >= corrige + k * 4;
  return (
    <>
      <Chip n="4" titulo="Ele testa sozinho" sub="antes de te entregar" fr={fr} d={a} />
      {fr < entrega - 2 && <Palco top={410}>
        <div style={{ position: "relative", width: 940, height: 900 }}>
          <div style={{ opacity: fr >= invis ? 0.55 + 0.1 * Math.sin(fr / 4) : 1, transform: `scale(${pop(fr, a + 3, 12)})` }}>
            <Janela title={fr >= invis ? "👻 navegador invisível (headless)" : "🌐 pesca/index.html"} w={940} h={520} dashed={fr >= invis} border={fr >= invis ? PINK : undefined}>
              <Pesca fr={fr} w={880} h={400} speed={fr >= aperta ? 2.4 : 1} />
              {fr >= erro && !fixed(0) && <div style={{ position: "absolute", left: 300, top: 120, fontSize: 110, transform: `scale(${pop(fr, erro, 9)})` }}>🐞</div>}
              {fr >= tela && !fixed(1) && <div style={{ position: "absolute", left: 30, top: 30, right: 30, bottom: 30, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 60, color: RED }}>⏸ travou</div>}
            </Janela>
          </div>
          {fr >= aperta && <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 26, transform: `scale(${pop(fr, aperta, 11)})` }}>
            {keys.map((k, j) => <div key={k} style={{ width: 110, height: 100, borderRadius: 18, background: kOn === j ? PINK : "rgba(255,255,255,0.12)", border: "3px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 52, color: "#fff", transform: `translateY(${kOn === j ? 8 : 0}px)` }}>{k}</div>)}
          </div>}
          {fr >= caca && <div style={{ position: "absolute", left: 30, right: 30, top: 680, padding: 22, borderRadius: 22, background: "rgba(10,6,24,0.97)", border: "2px solid rgba(190,160,255,0.3)", fontFamily: MONO, fontSize: 32, lineHeight: 1.5, transform: `scale(${pop(fr, caca, 11)})` }}>
            <div style={{ color: GREY }}>🔍 {typed("caçando problemas…", fr, caca, caca + 10)}</div>
            {fr >= erro && <div style={{ color: fixed(0) ? GREEN : RED }}>{fixed(0) ? "✓ erro corrigido" : "✗ TypeError: fish is undefined"}</div>}
            {fr >= tela && <div style={{ color: fixed(1) ? GREEN : RED }}>{fixed(1) ? "✓ tela destravada" : "✗ tela travada"}</div>}
          </div>}
          {fr >= caca && fr < erro + 6 && <div style={{ position: "absolute", left: interpolate(fr, [caca, erro], [700, 330], clamp), top: interpolate(fr, [caca, erro], [60, 160], clamp), fontSize: 120 }}>🔍</div>}
        </div>
      </Palco>}
      {fr >= at(102) && fr < so && <Big fr={fr} d={at(102)} top={1000} bg={RED} rot={-4} size={110}>absurda! 🤯</Big>}
      {fr >= so && fr < aperta && <div style={{ position: "absolute", top: 1000, width: "100%", textAlign: "center", transform: `scale(${pop(fr, so, 9)})` }}>
        <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 90, color: "#fff", background: PINK, padding: "0 30px", borderRadius: 20 }}>sozinho!</span>
      </div>}
      {fr >= entrega - 2 && <Palco top={430}>
        <div style={{ width: 900, padding: 40, borderRadius: 30, background: WIN, border: `4px solid ${GREEN}`, transform: `scale(${pop(fr, entrega - 2, 10)})` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>📋 cartão de entrega</div>
          {CHECKS.map(([t], k) => <div key={t} style={{ marginTop: 22, fontFamily: inter, fontWeight: 800, fontSize: 44, color: GREEN, transform: `translateX(${(1 - pop(fr, entrega + k * 3, 12)) * 200}px)`, opacity: pop(fr, entrega + k * 3, 12) }}>✓ <span style={{ color: "#fff" }}>{t}</span></div>)}
          <div style={{ marginTop: 26, fontFamily: lora, fontStyle: "italic", fontSize: 40, color: YEL, opacity: lin(fr, entrega + 14, entrega + 20) }}>“ainda não jogado por uma pessoa”</div>
        </div>
      </Palco>}
    </>
  );
};

// ---------- item 5: muda pedindo + painel ----------
const SLIDERS = [["velocidade do peixe", 0.3, 0.75], ["tempo da isca", 0.6, 0.35], ["chance do raro", 0.2, 0.55], ["dificuldade", 0.5, 0.8]];
const Item5 = ({ fr }) => {
  const a = at(123), muda = at(126), ped = at(128), cada = at(129), ponto = at(133), volta = at(135), aj = at(136), ganha = at(138), painel = at(140), ctrl = at(143), valor = at(146);
  return (
    <>
      <Chip n="5" titulo="Você muda pedindo" sub="e pode voltar atrás" fr={fr} d={a} />
      {fr < aj && <Palco top={430}>
        <div style={{ width: 940 }}>
          <div style={{ padding: 30, borderRadius: 28, background: WIN, border: `3px solid ${PINKA(0.6)}`, transform: `scale(${pop(fr, a + 3, 12)})` }}>
            <div style={{ fontFamily: MONO, fontSize: 44, color: "#fff" }}>› {typed("peixe raro mais rápido", fr, a + 4, ped + 6)}{blink(fr)}</div>
            {fr >= ped + 6 && <div style={{ marginTop: 18, fontFamily: inter, fontSize: 36, color: GREEN, opacity: lin(fr, ped + 6, ped + 10) }}>✦ feito · confere o que você pediu pra manter ✓</div>}
          </div>
          <div style={{ position: "relative", marginTop: 70, height: 260 }}>
            <div style={{ position: "absolute", left: 60, right: 60, top: 60, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.2)" }} />
            {["v1", "v2", "v3", "v4"].map((v, k) => {
              const d = cada + k * 5;
              const back = fr >= volta && k === 1;
              return fr >= d && <div key={v} style={{ position: "absolute", left: 30 + k * 260, top: 0, textAlign: "center", width: 130, transform: `scale(${pop(fr, d, 9) * (back ? 1.2 : 1)})` }}>
                <div style={{ width: 120, height: 120, margin: "0 auto", borderRadius: 60, background: back ? PINK : k === 3 && fr < volta ? GREEN : WIN, border: `4px solid ${back ? "#fff" : PINKA(0.7)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 38, color: "#fff" }}>{v}</div>
                {k === 1 && fr >= ponto && <div style={{ marginTop: 14, fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", whiteSpace: "nowrap", opacity: lin(fr, ponto, ponto + 6) }}>📍 checkpoint</div>}
              </div>;
            })}
            {fr >= volta && <div style={{ position: "absolute", left: 300, top: 190, fontFamily: inter, fontWeight: 800, fontSize: 44, color: PINK, transform: `scale(${pop(fr, volta, 9)})` }}>↺ voltar pra cá</div>}
          </div>
        </div>
      </Palco>}
      {fr >= aj && <Palco top={420}>
        <Janela title="🎛️ painel de ajuste" w={940} h={860} border={PINKA(0.7)} style={{ transform: `scale(${pop(fr, aj, 11)})` }}>
          <div style={{ fontFamily: MONO, fontSize: 38, color: "#fff" }}>› {typed("ajusta o jogo", fr, aj, ganha)}{blink(fr)}</div>
          {SLIDERS.map(([t, v0, v1], k) => {
            const d = ganha - 4 + k * 4;
            const mv = lin(fr, ctrl + k * 6, ctrl + k * 6 + 14);
            const wob = fr >= valor ? 0.06 * Math.sin((fr - valor) / 5 + k) : 0;
            const v = Math.max(0, Math.min(1, v0 + (v1 - v0) * mv + wob));
            return fr >= d && <div key={t} style={{ marginTop: 44, opacity: lin(fr, d, d + 5) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: inter, fontWeight: 800, fontSize: 38, color: BODY }}><span>{t}</span><span style={{ fontFamily: MONO, color: "#fff" }}>{(v * 10).toFixed(1)}</span></div>
              <div style={{ position: "relative", marginTop: 14, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.15)" }}>
                <div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 9, background: PINK }} />
                <div style={{ position: "absolute", left: `calc(${v * 100}% - 24px)`, top: -15, width: 48, height: 48, borderRadius: 24, background: "#fff", boxShadow: `0 0 20px ${PINK}` }} />
              </div>
            </div>;
          })}
        </Janela>
      </Palco>}
    </>
  );
};

// ---------- virada: engines + código aberto ----------
const Virada = ({ fr }) => {
  const a = at(147), god = at(150), uni = at(151), unr = at(153), cod = at(154), mit = at(156);
  return (
    <>
      <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 84, color: "#fff", transform: `scale(${pop(fr, a - 2, 10)})` }}>e ainda tem…</div>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
        {[["Godot", god, "#478cbf"], ["Unity", uni, "#e5e5e5"], ["Unreal", unr, "#b9a7ff"]].map(([t, d, c], k) => fr >= d && <div key={t} style={{ width: 290, height: 320, borderRadius: 30, background: WIN, border: `4px solid ${c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, d, 9)}) translateY(${Math.sin(fr / 7 + k) * 10}px)` }}>
          <div style={{ fontSize: 110 }}>{["🤖", "🧊", "🏔️"][k]}</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 54, color: "#fff", marginTop: 10 }}>{t}</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: GREEN }}>✓</div>
        </div>)}
      </div>
      {fr >= cod && <div style={{ position: "absolute", top: 860, width: "100%", textAlign: "center", transform: `scale(${pop(fr, cod, 9)})` }}>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: "#fff", background: "rgba(255,255,255,0.1)", border: `3px solid ${PINKA(0.7)}`, padding: "14px 40px", borderRadius: 24 }}>{"</>"} código aberto</span>
      </div>}
      {fr >= mit && <div style={{ position: "absolute", top: 1040, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#1a1030", background: GREEN, padding: "10px 46px", borderRadius: 24, transform: `scale(${interpolate(pop(fr, mit, 8), [0, 1], [2.2, 1])}) rotate(-6deg)`, opacity: lin(fr, mit, mit + 3) }}>MIT</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#1a1030", background: YEL, padding: "10px 46px", borderRadius: 24, transform: `scale(${pop(fr, mit + 6, 9)}) rotate(${4 + Math.sin(fr / 5) * 5}deg)` }}>R$ 0</div>
      </div>}
    </>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const a = at(158), seg = at(159), com = at(161), q = at(162), leg = at(164);
  const segOn = fr >= seg + 6;
  return (
    <Palco top={330}>
      <div style={{ width: 900, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `scale(${pop(fr, a - 2, 11)})` }}>
          <div style={{ width: 140, height: 140, borderRadius: 70, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>P<span style={{ fontSize: 30 }}>AI</span></div>
          <div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>@phanteraicreative</div>
            <div style={{ marginTop: 14, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", padding: "12px 40px", borderRadius: 18, background: segOn ? "rgba(255,255,255,0.15)" : PINK, transform: `scale(${fr >= seg && fr < seg + 6 ? 0.9 : 1})` }}>{segOn ? "Seguindo ✓" : "Seguir"}</div>
          </div>
        </div>
        <div style={{ marginTop: 60, width: 900, padding: 34, borderRadius: 30, background: WIN, border: `3px solid ${fr >= q ? PINK : "rgba(190,160,255,0.3)"}`, transform: `scale(${pop(fr, com - 4, 11)})` }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>💬 adicione um comentário…</div>
          <div style={{ marginTop: 16, fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff" }}>{typed("JOGO", fr, com + 2, q + 6)}{blink(fr)}</div>
        </div>
        {fr >= q + 6 && <div style={{ display: "flex", gap: 20, marginTop: 30 }}>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ fontSize: 60, transform: `translateY(${-Math.abs(Math.sin((fr - q) / 6 + k)) * 40}px) scale(${pop(fr, q + 6 + k * 3, 9)})` }}>{["🎮", "❤️", "🐟", "❤️", "🎮"][k]}</div>)}</div>}
        {fr >= leg && <div style={{ marginTop: 34, fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", opacity: lin(fr, leg, leg + 6) }}>🔗 link na legenda <span style={{ display: "inline-block", transform: `translateY(${Math.abs(Math.sin(fr / 5)) * 14}px)`, color: PINK }}>↓</span></div>}
      </div>
    </Palco>
  );
};

const Reacao = ({ fr, a, b, pose }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 340, right: 30 - (1 - pin) * 420 - pout * 420, top: 1150 }} />;
};

// ---------- legendas 1–3 palavras ----------
const KEY = new Set(["frase", "jogo", "roda", "setenta", "cinco", "skills", "gratis", "pacote", "quatro", "absurda", "claude", "code", "game", "studios", "quarenta", "mil", "estrelas", "github", "estudio", "nove", "agentes", "diretor", "testador", "barra", "prototype", "ideia", "fim", "pergunta", "visual", "dificuldade", "objetivo", "escolhe", "resumo", "pagina", "construir", "pronto", "navegador", "clique", "duplo", "engine", "testa", "sozinho", "teclas", "invisivel", "erro", "travada", "corrige", "entregar", "muda", "pedindo", "volta", "ajuste", "painel", "controle", "valor", "godot", "unity", "unreal", "aberto", "mit", "segue", "legenda"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const nx = words[k + 1] && norm(words[k + 1].w), nx2 = words[k + 2] && norm(words[k + 2].w);
    if (n === "numero" && NUM[nx]) { toks.push({ t: "Nº " + NUM[nx], s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "numero") { toks.push({ t: "Nº", s: x.s, e: x.e, key: true }); continue; }
    if (n === "setenta" && nx === "e" && nx2 === "cinco") { toks.push({ t: "75", s: x.s, e: words[k + 2].e, key: true }); k += 2; continue; }
    if (n === "quarenta" && nx === "mil") { toks.push({ t: "40 mil", s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "quarenta" && nx === "e" && nx2 === "nove") { toks.push({ t: "49", s: x.s, e: words[k + 2].e, key: true }); k += 2; continue; }
    if (n === "barra" && nx === "prototype") { toks.push({ t: "/prototype", s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "quatro" && k > 0 && norm(words[k - 1].w) === "numero") { toks.push({ t: "4", s: x.s, e: x.e, key: true }); continue; }
    toks.push({ t: x.w, s: x.s, e: x.e });
  }
  const chunks = []; let cur = [];
  toks.forEach((tk) => {
    cur.push(tk);
    const len = cur.map((c) => c.t).join(" ").length;
    if (cur.length >= 3 || len > 15 || /[.,!?:;"]$/.test(tk.t) || /\.\.\.$/.test(tk.t)) { chunks.push(cur); cur = []; }
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
        const base = w.t.replace(/\.\.\.$/, "").replace(/[.,!?:;…"]+$/g, "").replace(/^"/, "");
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

export const ShortGameStudios = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(22), at(48), at(59), at(72), at(84), at(99), at(123), at(147), at(158), end];
  const scenes = [Hook, Nome, Comando, Item1, Item2, Item3, Item4, Item5, Virada, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Cena key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      <Reacao fr={fr} a={at(7)} b={at(11)} pose="surpresa" />
      <Reacao fr={fr} a={at(100)} b={at(106)} pose="apontando" />
      <Reacao fr={fr} a={at(158)} b={end} pose="comemorando" />
      {fr >= at(8) && <Legendas chunks={chunks} fr={fr} />}
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={1} /></Sequence>
      <Sequence from={0} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.7} /></Sequence>
      <Sequence from={at(5)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.5} /></Sequence>
      <Sequence from={at(7)} durationInFrames={25}><Audio src={staticFile("sfx/ding.mp3")} volume={0.45} /></Sequence>
      <Sequence from={at(12)} durationInFrames={30}><Audio src={staticFile("sfx/coin.mp3")} volume={0.35} /></Sequence>
      <Sequence from={at(21)} durationInFrames={25}><Audio src={staticFile("sfx/error.mp3")} volume={0.45} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      {[at(82), at(95), at(156)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.35} /></Sequence>)}
      <Sequence from={at(113)} durationInFrames={20}><Audio src={staticFile("sfx/error.mp3")} volume={0.3} /></Sequence>
      <Sequence from={at(122)} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.35} /></Sequence>
      <Sequence from={at(162)} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

export const CapaGameStudios = () => {
  const fr = 40;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={999} />
      <div style={{ position: "absolute", top: 310, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 112, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Uma frase…</div>
        <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 132, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 24, marginTop: 16, transform: "rotate(-3deg)" }}>e o jogo roda</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 74, color: "#fff", lineHeight: 1.1, marginTop: 34 }}>75 skills <span style={{ color: "#1a1030", background: YEL, padding: "0 20px", borderRadius: 16 }}>grátis</span></div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 54, color: BODY, marginTop: 14 }}>no seu Claude Code</div>
      </div>
      <div style={{ position: "absolute", top: 1010, left: 70 }}>
        <Janela title="pesca/index.html" w={640} h={440} border={GREEN}>
          <Pesca fr={120} w={580} h={320} score={false} />
        </Janela>
      </div>
      <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 420, right: 20, top: 1180 }} />
    </AbsoluteFill>
  );
};
