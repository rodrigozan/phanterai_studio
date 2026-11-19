import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 19/11/2026 18:00 — "10 negócios de IA para tocar sem funcionário".
// Cada item é a capacidade de uma ferramenta, conferida na documentação oficial (fontes só no texto do post):
// 1 ElevenLabs TTS · 2 OpenAI Whisper (MIT) · 3 Canva AI · 4 OpusClip · 5 ElevenLabs Dubbing (voz + fundo
// preservados) · 6 v0 (landing pages, deploy em 1 clique) · 7 Claude (guia oficial de atendimento) ·
// 8 n8n AI Agent (o agente decide qual ferramenta chamar) · 9 ElevenLabs Agents + Twilio (chamadas) ·
// 10 Claude Code (edita arquivos e roda comandos). "Negócio sem funcionário" é leitura editorial.
// Palco contínuo com interface recriada em motion; cada ação disparada pela palavra da fala (índice em
// audio/words.json). Nada de print, nada gerado por IA, nenhum crédito na tela.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SDN_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-19-1800-10-negocios-ia";
export const SDN_FPS = 30;
const FPS = SDN_FPS;
const f = (p) => staticFile(`${SDN_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const YEL = "#febc2e";
const BLUE = "#60a5fa";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Daniel.mp3";
const TAIL = 0.6;

export const calculateDezNegociosMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

let W = {};
const at = (i) => (W[i] ? Math.round(W[i].s * FPS) : 0);
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0 }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);
const In = ({ fr, d, children, dy = 50, style = {}, damping = 13 }) => {
  const p = pop(fr, d, damping);
  if (fr < d) return null;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * dy}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};

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
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 255, 270) }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);

const Janela = ({ title = "", children, w = 900, h = 760, style = {}, border }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${border || "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.18)}`, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginLeft: 14, whiteSpace: "nowrap" }}>{title}</div>
    </div>
    <div style={{ padding: 30, position: "relative", height: h - 64 }}>{children}</div>
  </div>
);

const Chip = ({ n, icon, titulo, sub, fr, d }) => {
  const p = pop(fr, d, 13);
  return (
    <div style={{ position: "absolute", top: 190, left: 80, right: 80, display: "flex", alignItems: "center", gap: 26, padding: "20px 30px", borderRadius: 28, background: "rgba(30,18,60,0.92)", border: `2px solid ${PINKA(0.6)}`, transform: `translateY(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`, opacity: p }}>
      <div style={{ width: 100, height: 100, borderRadius: 24, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 60, color: "#fff", flexShrink: 0 }}>{n}</div>
      <div style={{ fontSize: 70 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1.05 }}>{titulo}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 36, color: BODY, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
};

const Cena = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};

const Palco = ({ children, top = 420 }) => {
  const fr = useCurrentFrame();
  return <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, transform: `translateY(${Math.sin(fr / 18) * 6}px)` }}>{children}</div>;
};

const Big = ({ children, fr, d, top = 220, bg = PINK, rot = 0, size = 150 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", transform: `scale(${d <= 0 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : pop(fr, d, 9)})` }}>
    <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: size, color: "#fff", background: bg, padding: "0 42px", borderRadius: 30, transform: `rotate(${rot}deg)` }}>{children}</span>
  </div>
);

const Seta = ({ fr, d }) => (
  <div style={{ fontSize: 70, color: PINK, opacity: lin(fr, d, d + 6), transform: `translateY(${Math.sin(fr / 4) * 6}px)` }}>⬇</div>
);

const Pill = ({ children, bg = "rgba(52,211,153,0.16)", c = GREEN, size = 40 }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, background: bg, border: `2px solid ${c}`, padding: "8px 26px", borderRadius: 40, whiteSpace: "nowrap" }}>{children}</span>
);

const Onda = ({ fr, n = 28, h = 120, w = 760, color = PINK, live = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, height: h, width: w, justifyContent: "center" }}>
    {Array.from({ length: n }, (_, k) => {
      const v = live ? 0.25 + 0.75 * Math.abs(Math.sin(fr / 3.2 + k * 0.9) * Math.cos(fr / 7 + k * 0.4)) : 0.12;
      return <div key={k} style={{ width: (w - n * 8) / n, height: h * v, borderRadius: 8, background: color }} />;
    })}
  </div>
);

// Régua do "mais fácil ao mais difícil": mostra em que item estamos.
const Regua = ({ fr, cur, d }) => (
  <div style={{ position: "absolute", top: 1395, left: 70, right: 70, opacity: lin(fr, d, d + 8) }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: lora, fontStyle: "italic", fontSize: 30, color: BODY, marginBottom: 8 }}><span>mais fácil</span><span>mais difícil</span></div>
    <div style={{ display: "flex", gap: 10 }}>
      {Array.from({ length: 10 }, (_, k) => {
        const done = k + 1 < cur, now = k + 1 === cur;
        return <div key={k} style={{ flex: 1, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 26,
          background: now ? PINK : done ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.07)", color: now || done ? "#fff" : GREY,
          transform: `scale(${now ? 1 + 0.12 * Math.abs(Math.sin(fr / 6)) : 1})`, border: now ? "2px solid #fff" : "2px solid transparent" }}>{done ? "✓" : k + 1}</div>;
      })}
    </div>
  </div>
);

const NEG = [["🎙️", "Locução"], ["💬", "Legendas"], ["🎨", "Posts"], ["✂️", "Cortes"], ["🌎", "Dublagem"], ["🌐", "Sites"], ["🤝", "Atendimento"], ["⚙️", "Automação"], ["📞", "Telefone"], ["📱", "App"]];

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const d3 = at(3), d5 = at(5), d8 = at(8), d14 = at(14);
  const staff = Math.max(0, 8 - Math.floor(fr / 5));
  const big = fr < d3 ? "ZERO" : fr < d8 ? "10 negócios" : fr < d14 ? "fácil → difícil" : "e o nº 10?";
  const bigD = fr < d3 ? 0 : fr < d8 ? d3 : fr < d14 ? d8 : d14;
  const flash = Math.max(0, 1 - Math.abs(fr - d14) / 5) + Math.max(0, 1 - Math.abs(fr - d3) / 5) * 0.7;
  return (
    <AbsoluteFill>
      <Big fr={fr} d={bigD} size={fr < d3 ? 190 : 130} top={fr < d3 ? 190 : 210} rot={fr < d3 ? -3 : 0}>{big}</Big>
      {fr < d3 ? (
        <Palco top={520}>
          <div style={{ transform: `translateX(${shake(fr, 0, 18)}px)` }}>
            <Janela title="equipe.xlsx" w={900} h={700} border={RED}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26, justifyItems: "center", marginTop: 10 }}>
                {Array.from({ length: 8 }, (_, k) => {
                  const gone = k >= staff;
                  return <div key={k} style={{ fontSize: 110, position: "relative", opacity: gone ? 0.25 : 1, transform: `scale(${gone ? 0.8 : 1})` }}>👤{gone && <span style={{ position: "absolute", left: 18, top: -6, fontSize: 120, color: RED, fontFamily: inter, fontWeight: 800 }}>✕</span>}</div>;
                })}
              </div>
              <div style={{ textAlign: "center", marginTop: 40, fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>funcionários: <span style={{ color: RED }}>{staff}</span></div>
            </Janela>
          </div>
        </Palco>
      ) : (
        <Palco top={440}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, width: 940 }}>
            {NEG.map(([ic, t], k) => {
              const d = d3 + k * 2;
              const p = pop(fr, d, 12);
              const run = fr >= d5 + k;
              const tenZoom = k === 9 && fr >= d14 ? pop(fr, d14, 10) : 0;
              const locked = k === 9 && fr >= d14;
              return (
                <div key={k} style={{ height: 250, borderRadius: 24, background: locked ? PINKA(0.35) : "rgba(30,18,60,0.92)", border: `2px solid ${run ? GREEN : "rgba(190,160,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative",
                  opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (1 + 0.25 * tenZoom)}) translateY(${-30 * tenZoom}px)`, zIndex: k === 9 ? 2 : 1 }}>
                  <div style={{ position: "absolute", top: 10, left: 14, fontFamily: inter, fontWeight: 800, fontSize: 26, color: GREY }}>{k + 1}</div>
                  <div style={{ fontSize: 96 }}>{locked ? "🔒" : ic}</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 24, color: "#fff", marginTop: 6 }}>{locked ? "???" : t}</div>
                  {run && !locked && <div style={{ position: "absolute", top: 12, right: 12, width: 18, height: 18, borderRadius: 9, background: GREEN, boxShadow: `0 0 ${10 + 8 * Math.sin(fr / 3 + k)}px ${GREEN}` }} />}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 30, alignItems: "center", marginTop: 10 }}>
            <Pill bg="rgba(255,92,122,0.15)" c={RED} size={44}>👤 0 funcionários</Pill>
            {fr >= d5 && <In fr={fr} d={d5}><Pill size={44}>● rodando com IA</Pill></In>}
          </div>
          {fr >= d8 && (
            <div style={{ width: 900, marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: lora, fontStyle: "italic", fontSize: 40, color: "#fff" }}><span>fácil</span><span>difícil</span></div>
              <div style={{ height: 34, borderRadius: 17, background: "rgba(255,255,255,0.1)", marginTop: 10, overflow: "hidden" }}>
                <div style={{ width: `${100 * ease(lin(fr, d8, at(13) + 6))}%`, height: "100%", background: `linear-gradient(90deg, ${GREEN}, ${YEL}, ${RED})` }} />
              </div>
            </div>
          )}
        </Palco>
      )}
      <AbsoluteFill style={{ background: PINK, opacity: flash * 0.35, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ---------- 1: locução (ElevenLabs) ----------
const Item1 = ({ fr }) => {
  const d0 = at(20), dT = at(20) + 5, dE = at(28), dN = at(29);
  return (
    <AbsoluteFill>
      <Chip n={1} icon="🎙️" titulo="Locução" sub="ElevenLabs" fr={fr} d={d0} />
      <Palco>
        <Janela title="texto.txt" w={880} h={250}>
          <div style={{ fontFamily: inter, fontSize: 44, color: "#fff", lineHeight: 1.3 }}>{fr >= dT ? typed("Bem-vindo à nossa loja! Hoje tem promoção…", fr, dT, at(27)) : <span style={{ color: GREY }}>cole seu texto</span>}{blink(fr)}</div>
        </Janela>
        <Seta fr={fr} d={dT} />
        <div style={{ width: 880, borderRadius: 30, background: WIN, border: `2px solid ${fr >= dN ? PINK : "rgba(190,160,255,0.28)"}`, padding: 30, display: "flex", alignItems: "center", gap: 24, opacity: 0.35 + 0.65 * lin(fr, dE - 4, dE + 4) }}>
          <div style={{ width: 110, height: 110, borderRadius: 55, background: fr >= dN ? PINK : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, color: "#fff", transform: `scale(${fr >= dE && fr < dE + 6 ? 0.85 : 1})` }}>{fr >= dN ? "❚❚" : "▶"}</div>
          <Onda fr={fr} n={22} h={110} w={660} live={fr >= dN} />
        </div>
        {fr >= dN + 6 && <In fr={fr} d={dN + 6}><Pill>🔊 narrado · 90+ idiomas</Pill></In>}
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 2: legendas (Whisper) ----------
const Item2 = ({ fr }) => {
  const d0 = at(30), dW = at(34), dT = at(35), dG = at(37);
  const lines = [["00:01", "Oi, gente!"], ["00:02", "Hoje eu vou mostrar"], ["00:04", "três dicas rápidas"]];
  const swing = Math.sin((fr - dG) / 5) * 14 * Math.exp(-Math.max(0, fr - dG) / 30);
  return (
    <AbsoluteFill>
      <Chip n={2} icon="💬" titulo="Legendas" sub="Whisper, da OpenAI" fr={fr} d={d0} />
      <Palco>
        <div style={{ width: 880, borderRadius: 30, background: WIN, border: "2px solid rgba(190,160,255,0.28)", padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 60 }}>🎧</div>
          <Onda fr={fr} n={24} h={90} w={700} color={BLUE} />
        </div>
        <Seta fr={fr} d={dW} />
        <Janela title="video.srt" w={880} h={420}>
          {lines.map(([ts, t], k) => {
            const d = dT + k * 9;
            if (fr < d) return null;
            return <div key={k} style={{ display: "flex", gap: 24, fontSize: 46, marginBottom: 22, opacity: lin(fr, d, d + 4) }}>
              <span style={{ fontFamily: MONO, color: PINK }}>{ts}</span>
              <span style={{ fontFamily: inter, fontWeight: 800, color: "#fff" }}>{typed(t, fr, d, d + 8)}</span>
            </div>;
          })}
        </Janela>
        {fr >= dG && (
          <div style={{ position: "absolute", top: 640, right: 70, transformOrigin: "50% 0%", transform: `rotate(${swing}deg) scale(${pop(fr, dG, 9)})` }}>
            <div style={{ width: 4, height: 50, background: "#fff", margin: "0 auto" }} />
            <div style={{ background: YEL, color: "#1a1030", fontFamily: inter, fontWeight: 800, fontSize: 64, padding: "12px 30px", borderRadius: 18, textAlign: "center" }}>R$ 0<div style={{ fontSize: 26 }}>código aberto</div></div>
          </div>
        )}
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 3: posts (Canva AI) ----------
const Item3 = ({ fr }) => {
  const d0 = at(38), dD = at(38) + 5, dC = at(46), dM = at(47);
  const el = (k) => pop(fr, dC + k * 4, 12);
  return (
    <AbsoluteFill>
      <Chip n={3} icon="🎨" titulo="Posts" sub="IA do Canva" fr={fr} d={d0} />
      <Palco>
        <div style={{ width: 880, borderRadius: 26, background: WIN, border: `2px solid ${PINKA(0.5)}`, padding: "22px 28px", fontFamily: inter, fontSize: 40, color: "#fff", display: "flex", gap: 18, alignItems: "center" }}>
          <span style={{ fontSize: 46 }}>✨</span>
          <span>{fr >= dD ? typed("post de promoção da padaria", fr, dD, at(43)) : <span style={{ color: GREY }}>descreva o que quer criar</span>}{blink(fr)}</span>
        </div>
        <div style={{ width: 600, height: 700, borderRadius: 26, background: "#fff7ec", position: "relative", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", border: fr >= dM ? `5px solid ${PINK}` : "5px dashed rgba(190,160,255,0.4)", opacity: lin(fr, dD, dD + 6) }}>
          {fr < dC && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#b9a" }}>gerando{".".repeat(1 + (Math.floor(fr / 6) % 3))}</div>}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 260, background: "#e8743b", transform: `translateY(${(1 - el(0)) * -260}px)` }} />
          <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontSize: 150, transform: `scale(${el(1)})` }}>🥐</div>
          <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#3b1d0e", lineHeight: 1, opacity: el(2), transform: `translateX(${(1 - el(2)) * 200}px)` }}>PÃO<br />QUENTINHO</div>
          <div style={{ position: "absolute", top: 470, width: "100%", textAlign: "center", fontFamily: lora, fontStyle: "italic", fontSize: 44, color: "#7a4a2a", opacity: el(3) }}>leve 10, pague 8</div>
          <div style={{ position: "absolute", top: 570, left: 150, right: 150, height: 80, borderRadius: 40, background: "#3b1d0e", color: "#fff", fontFamily: inter, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${el(4)})` }}>Peça já</div>
        </div>
        {fr >= dM + 8 && <In fr={fr} d={dM + 8} style={{ position: "absolute", top: 760, right: 60 }}><Pill>✓ com a cara da marca</Pill></In>}
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 4: cortes (OpusClip) ----------
const Item4 = ({ fr }) => {
  const d0 = at(48), dL = at(55), dX = at(51), dR = at(56);
  const cut = lin(fr, dX, dX + 8);
  return (
    <AbsoluteFill>
      <Chip n={4} icon="✂️" titulo="Cortes" sub="Opus Clip" fr={fr} d={d0} />
      <Palco>
        <div style={{ width: 900, borderRadius: 24, background: WIN, border: "2px solid rgba(190,160,255,0.28)", padding: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 28, color: GREY, marginBottom: 12 }}>video-longo.mp4 · 1:02:15</div>
          <div style={{ display: "flex", gap: 8 * cut * 3, height: 120 }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} style={{ flex: 1, borderRadius: 12, background: [1, 3].includes(k) || k === 0 ? `linear-gradient(135deg, ${PINKA(0.85)}, #6b3fd1)` : "rgba(255,255,255,0.12)", transform: `translateY(${[0, 1, 3].includes(k) ? -cut * 16 : 0}px)` }} />
            ))}
          </div>
          <div style={{ position: "relative", height: 10, marginTop: 14, background: "rgba(255,255,255,0.1)", borderRadius: 5 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 * ((fr - d0) % 60)) / 60}%`, background: PINK, borderRadius: 5 }} />
          </div>
        </div>
        <div style={{ fontSize: 80, transform: `rotate(${fr >= dX ? Math.sin(fr / 2) * 25 : 0}deg)`, opacity: lin(fr, dX - 6, dX) }}>✂️</div>
        <div style={{ display: "flex", gap: 36 }}>
          {[0, 1, 2].map((k) => {
            const d = dR - 10 + k * 5;
            const p = pop(fr, d, 12);
            return (
              <div key={k} style={{ width: 240, height: 420, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 30, border: "4px dashed rgba(190,160,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY, opacity: lin(fr, d0 + 4, d0 + 10) }}>9:16</div>
              <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "#120a2a", border: "4px solid #fff", overflow: "hidden", opacity: fr < d ? 0 : 1, transform: `translateY(${(1 - p) * -260}px) scale(${0.7 + 0.3 * p}) rotate(${(k - 1) * 4}deg)` }}>
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${PINKA(0.7)}, #3b1f8f)` }} />
                <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontSize: 80 }}>{["🔥", "💡", "😂"][k]}</div>
                <div style={{ position: "absolute", bottom: 70, left: 16, right: 16, background: "#fff", color: "#1a1030", fontFamily: inter, fontWeight: 800, fontSize: 26, textAlign: "center", borderRadius: 8, padding: "6px 0" }}>{["o segredo é", "faz assim", "ninguém fala"][k]}</div>
                <div style={{ position: "absolute", top: 14, right: 14, fontFamily: inter, fontWeight: 800, fontSize: 22, color: "#fff" }}>9:16</div>
              </div>
              </div>
            );
          })}
        </div>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 5: dublagem (ElevenLabs Dubbing) ----------
const Item5 = ({ fr }) => {
  const d0 = at(59), dO = at(62), dV = at(66), dM = at(69);
  const langs = ["Olá!", "Hello!", "¡Hola!", "Bonjour!"];
  const li = fr < dO ? 0 : 1 + (Math.floor((fr - dO) / 12) % 3);
  const flip = fr >= dO ? Math.abs(Math.cos(((fr - dO) % 12) / 12 * Math.PI)) : 1;
  return (
    <AbsoluteFill>
      <Chip n={5} icon="🌎" titulo="Dublagem" sub="ElevenLabs" fr={fr} d={d0} />
      <Palco>
        <div style={{ width: 880, height: 420, borderRadius: 30, background: "linear-gradient(160deg, #2b1a5e, #120a2a)", border: "2px solid rgba(190,160,255,0.28)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 90, top: 120, fontSize: 200 }}>🧑‍🍳</div>
          <div style={{ position: "absolute", left: 380, top: 90, background: "#fff", borderRadius: 30, padding: "24px 40px", fontFamily: inter, fontWeight: 800, fontSize: 72, color: "#1a1030", transform: `scaleY(${0.2 + 0.8 * flip})` }}>{langs[li]}</div>
          <div style={{ position: "absolute", left: 380, top: 260, fontFamily: MONO, fontSize: 34, color: "#fff", background: fr >= dO ? PINK : "rgba(255,255,255,0.15)", padding: "6px 18px", borderRadius: 12 }}>{["PT", "EN", "ES", "FR"][li]}</div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: "rgba(255,255,255,0.1)" }}><div style={{ width: `${(100 * ((fr - d0) % 90)) / 90}%`, height: "100%", background: PINK }} /></div>
        </div>
        {[["🎙️", "voz original", dV], ["🎵", "música de fundo", dM]].map(([ic, t, d], k) => (
          <div key={k} style={{ width: 880, display: "flex", alignItems: "center", gap: 20, padding: "16px 26px", borderRadius: 22, background: WIN, border: `2px solid ${fr >= d ? GREEN : "rgba(190,160,255,0.28)"}` }}>
            <span style={{ fontSize: 50 }}>{ic}</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff", width: 360 }}>{t}</span>
            <Onda fr={fr + k * 7} n={12} h={60} w={260} color={k ? BLUE : PINK} />
            <span style={{ fontSize: 54, color: GREEN, marginLeft: "auto", transform: `scale(${fr >= d ? pop(fr, d, 9) : 0})` }}>✓</span>
          </div>
        ))}
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 6: sites (v0) ----------
const Item6 = ({ fr }) => {
  const d0 = at(71), dP = at(71) + 5, dV = at(79), dPub = at(82);
  const s = (k) => pop(fr, dV + k * 4, 12);
  return (
    <AbsoluteFill>
      <Chip n={6} icon="🌐" titulo="Sites" sub="v0, da Vercel" fr={fr} d={d0} />
      <Palco>
        <div style={{ width: 880, borderRadius: 26, background: WIN, border: `2px solid ${PINKA(0.5)}`, padding: "22px 28px", fontFamily: inter, fontSize: 40, color: "#fff" }}>
          {fr >= dP ? typed("landing page da minha academia", fr, dP, at(77)) : <span style={{ color: GREY }}>o que vamos construir?</span>}{blink(fr)}
        </div>
        <div style={{ width: 880, height: 640, borderRadius: 24, background: "#f5f3ff", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", position: "relative" }}>
          <div style={{ height: 56, background: "#e4e0f5", display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
            <div style={{ marginLeft: 16, flex: 1, height: 34, borderRadius: 17, background: "#fff", fontFamily: MONO, fontSize: 22, color: "#555", display: "flex", alignItems: "center", padding: "0 16px" }}>{fr >= dPub ? "🔒 academia-forca.vercel.app" : "localhost"}</div>
          </div>
          <div style={{ height: 260, background: "linear-gradient(135deg,#111,#3b1f8f)", transform: `scaleY(${s(0)})`, transformOrigin: "50% 0%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", opacity: s(1) }}>💪 Academia Força</div>
            <div style={{ marginTop: 20, background: PINK, color: "#fff", fontFamily: inter, fontWeight: 800, fontSize: 32, padding: "12px 34px", borderRadius: 30, transform: `scale(${s(2)})` }}>Agende sua aula grátis</div>
          </div>
          <div style={{ display: "flex", gap: 20, padding: 26 }}>
            {["🏋️ Musculação", "🧘 Yoga", "🥊 Luta"].map((t, k) => <div key={k} style={{ flex: 1, height: 200, borderRadius: 18, background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 28, color: "#222", transform: `translateY(${(1 - s(3 + k)) * 120}px)`, opacity: s(3 + k) }}>{t}</div>)}
          </div>
          {fr < dV && <div style={{ position: "absolute", inset: 56, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 36, color: "#888" }}>{fr >= dP ? `gerando${".".repeat(1 + (Math.floor(fr / 6) % 3))}` : ""}</div>}
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: fr >= dPub ? GREEN : "#000", border: "2px solid #fff", padding: "12px 34px", borderRadius: 16, transform: `scale(${fr >= dPub && fr < dPub + 5 ? 0.9 : 1})` }}>{fr >= dPub ? "✓ publicado" : "Publicar"}</div>
          {fr >= dPub + 4 && <In fr={fr} d={dPub + 4}><Pill>● no ar</Pill></In>}
        </div>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 7: atendimento (Claude) ----------
const Item7 = ({ fr }) => {
  const d0 = at(83), dQ = at(83) + 6, dR = at(87), dQ2 = at(90) + 4;
  const msgs = [["c", "Vocês abrem domingo?", dQ], ["a", "Abrimos sim! Das 9h às 13h 😊", dR + 6], ["c", "Tem estacionamento?", dQ2 + 4], ["a", "Tem, gratuito pra clientes 🚗", dQ2 + 16]];
  const n = Math.min(37, Math.max(0, Math.floor((fr - dQ) / 3)));
  return (
    <AbsoluteFill>
      <Chip n={7} icon="🤝" titulo="Atendimento" sub="Claude no chat" fr={fr} d={d0} />
      <Palco>
        <Janela title="chat · loja" w={880} h={720}>
          {msgs.map(([who, t, d], k) => {
            if (fr < d) return null;
            const p = pop(fr, d, 13);
            return <div key={k} style={{ display: "flex", justifyContent: who === "c" ? "flex-end" : "flex-start", marginBottom: 22, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
              <div style={{ maxWidth: 620, padding: "18px 26px", borderRadius: 26, fontFamily: inter, fontWeight: who === "a" ? 800 : 400, fontSize: 40, color: "#fff", background: who === "c" ? "rgba(255,255,255,0.14)" : PINK }}>{who === "a" && <span style={{ fontSize: 30, opacity: 0.85 }}>✳ Claude<br /></span>}{t}</div>
            </div>;
          })}
          {fr >= dQ + 4 && fr < dR + 6 && <div style={{ fontFamily: inter, fontSize: 60, color: PINK, letterSpacing: 6 }}>{"•".repeat(1 + (Math.floor(fr / 5) % 3))}</div>}
        </Janela>
        <Pill bg="rgba(96,165,250,0.15)" c={BLUE}>clientes atendidos: {n}</Pill>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 8: automação (n8n AI Agent) ----------
const Item8 = ({ fr }) => {
  const d0 = at(93), dN = at(93) + 6, dA = at(95), dE = at(102), dS = at(105);
  const tools = [["📊", "Planilha", 120], ["✉️", "E-mail", 440], ["📅", "Agenda", 760]];
  const pick = fr >= dS ? 2 : fr >= dE + 6 ? 1 : -1;
  const Node = ({ x, y, ic, t, on, d, w = 230 }) => (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: 170, borderRadius: 26, background: WIN, border: `3px solid ${on ? GREEN : "rgba(190,160,255,0.35)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${fr >= d ? pop(fr, d, 12) : 0})`, boxShadow: on ? `0 0 40px ${GREEN}` : "none" }}>
      <div style={{ fontSize: 60 }}>{ic}</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>{t}</div>
    </div>
  );
  const pulse = (fr % 20) / 20;
  return (
    <AbsoluteFill>
      <Chip n={8} icon="⚙️" titulo="Automação" sub="agente no n8n" fr={fr} d={d0} />
      <div style={{ position: "absolute", top: 440, left: 80, width: 920, height: 900 }}>
        <svg width={920} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
          {fr >= dA && <line x1={460} y1={170} x2={460} y2={330} stroke={PINK} strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-fr * 2} />}
          {tools.map(([, , x], k) => fr >= dA + 4 && <line key={k} x1={460} y1={500} x2={x} y2={660} stroke={pick === k || (pick === 2 && k === 1) ? GREEN : "rgba(190,160,255,0.4)"} strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-fr * 2} />)}
        </svg>
        <Node x={460} y={0} ic="⚡" t="Novo pedido" on={fr >= dN} d={dN - 6} w={300} />
        <Node x={460} y={330} ic="🤖" t="Agente de IA" on={fr >= dA} d={dA} w={320} />
        {fr >= dE && fr < dS + 12 && <div style={{ position: "absolute", left: 460 - 20 + (tools[Math.max(0, pick)][2] - 460) * pulse, top: 500 + 160 * pulse, width: 40, height: 40, borderRadius: 20, background: GREEN, boxShadow: `0 0 20px ${GREEN}` }} />}
        {tools.map(([ic, t, x], k) => <Node key={k} x={x} y={660} ic={ic} t={t} on={pick === k || (pick === 2 && k === 1)} d={dA + 4 + k * 3} />)}
        {fr >= dE && <div style={{ position: "absolute", left: 640, top: 360, fontFamily: lora, fontStyle: "italic", fontSize: 40, color: "#fff", background: PINK, padding: "4px 20px", borderRadius: 14, transform: `scale(${pop(fr, dE, 10)})` }}>decide sozinho</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 9: telefone (ElevenLabs Agents + Twilio) ----------
const Item9 = ({ fr }) => {
  const d0 = at(106), dT = at(108), dA = at(115), dL = at(116);
  const on = fr >= dA;
  const secs = on ? Math.floor((fr - dA) / FPS * 3) : 0;
  return (
    <AbsoluteFill>
      <Chip n={9} icon="📞" titulo="Telefone" sub="agente de voz ElevenLabs" fr={fr} d={d0} />
      <Palco>
        {!on && fr >= dT - 10 && [0, 1, 2].map((k) => { const t = ((fr + k * 10) % 30) / 30; return <div key={k} style={{ position: "absolute", top: -200 * t, left: 290 - 200 * t, width: 500 + 400 * t, height: 860 + 400 * t, borderRadius: 80 + 100 * t, border: `4px solid ${GREEN}`, opacity: 0.6 * (1 - t) }} />; })}
        <div style={{ width: 500, height: 860, borderRadius: 60, background: "#0e0820", border: "6px solid #fff", position: "relative", overflow: "hidden", transform: `rotate(${!on && fr >= dT ? Math.sin(fr * 1.6) * 3 : 0}deg)` }}>
          <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: inter, fontSize: 34, color: GREY }}>{on ? "em chamada" : "chamada recebida"}</div>
          <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>(11) 9••••-4821</div>
          <div style={{ position: "absolute", top: 200, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 40, color: on ? GREEN : "transparent" }}>00:{String(secs).padStart(2, "0")}</div>
          <div style={{ position: "absolute", top: 270, left: 30, right: 30 }}>
            {on && <Onda fr={fr} n={14} h={90} w={440} color={GREEN} />}
          </div>
          {on && [["🧑", "Quero agendar um horário", dA + 4], ["🤖", "Marcado: amanhã, 10h ✓", dL + 8]].map(([ic, t, d], k) => fr >= d && (
            <div key={k} style={{ position: "absolute", top: 400 + k * 130, left: 24, right: 24, padding: "16px 20px", borderRadius: 22, background: k ? PINK : "rgba(255,255,255,0.14)", fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", transform: `scale(${pop(fr, d, 12)})` }}>{ic} {t}</div>
          ))}
          <div style={{ position: "absolute", bottom: 70, width: "100%", display: "flex", justifyContent: "space-around" }}>
            {!on && <div style={{ width: 120, height: 120, borderRadius: 60, background: RED, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</div>}
            <div style={{ width: 120, height: 120, borderRadius: 60, background: on ? RED : GREEN, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${!on ? 1 + 0.12 * Math.abs(Math.sin(fr / 4)) : 1})` }}>📞</div>
          </div>
        </div>
      </Palco>
      {on && <In fr={fr} d={dA + 2} style={{ position: "absolute", top: 560, left: 40 }}><Pill size={34}>🤖 atendeu</Pill></In>}
      {fr >= dL + 14 && <In fr={fr} d={dL + 14} style={{ position: "absolute", top: 1180, left: 40 }}><Pill size={34} c={BLUE} bg="rgba(96,165,250,0.15)">↗ também liga</Pill></In>}
    </AbsoluteFill>
  );
};

// ---------- 10: app (Claude Code) ----------
const Item10 = ({ fr }) => {
  const d0 = at(117), dP = at(117) + 6, dC = at(126), dE = at(128), dR = at(132);
  const files = ["app.jsx", "agenda.js", "api.js", "banco.sql", "estilo.css"];
  const prog = lin(fr, dR, dR + 30);
  const big = fr >= at(119) && fr < dC;
  return (
    <AbsoluteFill>
      <Chip n={10} icon="📱" titulo="Seu próprio app" sub="Claude Code" fr={fr} d={d0} />
      {big && <Big fr={fr} d={at(120)} top={440} size={120} rot={-2}>o mais absurdo</Big>}
      <Palco top={fr < dC ? 640 : 420}>
        <Janela title="~/meu-app — claude" w={900} h={fr < dC ? 300 : 660}>
          <div style={{ fontFamily: MONO, fontSize: 34, color: "#fff", lineHeight: 1.45 }}>
            <div><span style={{ color: PINK }}>&gt; </span>{typed("crie um app de agendamento", fr, dP, at(124))}{fr < dE && blink(fr)}</div>
            {fr >= dC && <div style={{ color: GREY }}>✳ Claude Code trabalhando…</div>}
            {files.map((x, k) => {
              const d = dE + k * 4;
              return fr >= d && <div key={k} style={{ color: GREEN, opacity: lin(fr, d, d + 3) }}>  ✓ escreveu <span style={{ color: "#fff" }}>{x}</span> <span style={{ color: GREY }}>+{[142, 88, 64, 31, 57][k]} linhas</span></div>;
            })}
            {fr >= dR && <div style={{ marginTop: 10 }}><span style={{ color: YEL }}>$ </span>{typed("npm install && npm run dev", fr, dR, dR + 12)}</div>}
            {fr >= dR + 6 && (
              <div style={{ marginTop: 14, height: 30, borderRadius: 15, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${100 * prog}%`, height: "100%", background: PINK }} />
              </div>
            )}
            {fr >= dR + 6 && <div style={{ color: prog >= 1 ? GREEN : "#fff" }}>{prog >= 1 ? "✓ pronto em localhost:3000" : `${Math.round(prog * 100)}%`}</div>}
          </div>
        </Janela>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(135), dC = at(138), dS = at(142);
  const hop = Math.floor((fr - d0) / 4) % 10;
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} top={220} size={84}>Qual você começaria?</Big>
      <Palco top={470}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, width: 940 }}>
          {NEG.map(([ic, t], k) => {
            const sel = fr >= dC + 10 ? k === 6 : k === hop;
            return <div key={k} style={{ height: 170, borderRadius: 22, background: sel ? PINK : "rgba(30,18,60,0.92)", border: `2px solid ${sel ? "#fff" : "rgba(190,160,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${sel ? 1.08 : 1})` }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff" }}>{k + 1}</div>
              <div style={{ fontSize: 58 }}>{ic}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 20, color: "#fff" }}>{t}</div>
            </div>;
          })}
        </div>
        <div style={{ width: 900, display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dC ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dC - 4, dC + 2) }}>
          <span style={{ fontSize: 50 }}>💬</span>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>{typed("eu começaria pelo 7!", fr, dC, dC + 16)}{blink(fr)}</span>
        </div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", background: fr >= dS + 6 ? "rgba(255,255,255,0.15)" : PINK, padding: "16px 60px", borderRadius: 20, transform: `scale(${fr >= dS + 6 ? pop(fr, dS + 6, 9) : 1})`, opacity: lin(fr, dS - 4, dS) }}>{fr >= dS + 6 ? "✓ Seguindo" : "Seguir"}</div>
      </Palco>
    </AbsoluteFill>
  );
};

const Reacao = ({ fr, a, b, pose, top = 1150 }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 340, right: 30 - (1 - pin) * 420 - pout * 420, top }} />;
};

// ---------- legendas (1–3 palavras, palavra-chave em Lora sobre rosa) ----------
const KEY = new Set(["zero", "funcionarios", "dez", "negocios", "ia", "facil", "dificil", "absurdo", "locucao", "texto", "elevenlabs", "narra", "legendas", "whisper", "graca", "posts", "descreve", "canva", "monta", "cortes", "opus", "clip", "reels", "dublagem", "lingua", "voz", "musica", "sites", "v0", "landing", "page", "publicada", "atendimento", "claude", "clientes", "chat", "automacao", "n8n", "agente", "sozinho", "telefone", "ligacoes", "twilio", "app", "code", "codigo", "comandos", "comecaria", "numero", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5", seis: "6", sete: "7", oito: "8", nove: "9", dez: "10" };
const buildChunks = (words) => {
  const toks = [];
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const nx = words[k + 1] && norm(words[k + 1].w), nx2 = words[k + 2] && norm(words[k + 2].w);
    const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
    if (n === "numero" && NUM[nx]) { toks.push({ t: "Nº " + NUM[nx] + tail(words[k + 1]), s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "dez" && nx === "negocios") { toks.push({ t: "10", s: x.s, e: x.e, key: true }); continue; }
    if (n === "ve" && nx === "zero") { toks.push({ t: "v0" + tail(words[k + 1]), s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "ene" && nx === "oito" && nx2 === "ene") { toks.push({ t: "n8n" + tail(words[k + 2]), s: x.s, e: words[k + 2].e, key: true }); k += 2; continue; }
    toks.push({ t: x.w, s: x.s, e: x.e });
  }
  const chunks = []; let cur = [];
  toks.forEach((tk) => {
    cur.push(tk);
    const len = cur.map((c) => c.t).join(" ").length;
    if (cur.length >= 3 || len > 14 || /[.,!?:;]$/.test(tk.t) || /\.\.\.$/.test(tk.t)) { chunks.push(cur); cur = []; }
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
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[.,!?:;…"]+$/g, "");
        const key = w.key || KEY.has(norm(shown));
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortDezNegocios = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(20), at(30), at(38), at(48), at(59), at(71), at(83), at(93), at(106), at(117), at(135), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, Item6, Item7, Item8, Item9, Item10, CTA];
  const chunks = buildChunks(words);
  let cur = 0; for (let k = 1; k <= 10; k++) if (fr >= B[k] - 2) cur = k;
  if (fr >= B[11]) cur = 11;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Cena key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      {cur >= 1 && cur <= 10 && <Regua fr={fr} cur={cur} d={B[1]} />}
      <Reacao fr={fr} a={at(14)} b={at(20) - 4} pose="surpresa" top={1120} />
      <Reacao fr={fr} a={at(117)} b={at(124)} pose="apontando" />
      <Reacao fr={fr} a={at(141)} b={end} pose="comemorando" />
      {fr >= at(2) && <Legendas chunks={chunks} fr={fr} />}
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={1} /></Sequence>
      <Sequence from={0} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(3)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(8)} durationInFrames={40}><Audio src={staticFile("sfx/riser.mp3")} volume={0.3} /></Sequence>
      <Sequence from={at(14)} durationInFrames={25}><Audio src={staticFile("sfx/ding.mp3")} volume={0.45} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      <Sequence from={at(37)} durationInFrames={30}><Audio src={staticFile("sfx/coin.mp3")} volume={0.3} /></Sequence>
      {[at(29), at(47), at(58), at(82), at(115), at(142) + 6].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.35} /></Sequence>)}
      {[at(70), at(105), at(132) + 36].map((b, k) => <Sequence key={"d" + k} from={b} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const CapaDezNegocios = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 60, right: 60, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 150, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)" }}>Zero funcionários</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, marginTop: 36, letterSpacing: -2 }}>10 negócios<br />rodando com IA</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 54, color: BODY, marginTop: 18 }}>do mais fácil ao mais difícil</div>
    </div>
    <div style={{ position: "absolute", top: 1070, left: 70, width: 940, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
      {NEG.map(([ic], k) => (
        <div key={k} style={{ height: 150, borderRadius: 22, background: k === 9 ? PINKA(0.4) : "rgba(30,18,60,0.92)", border: `2px solid ${k === 9 ? "#fff" : GREEN}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 26, color: GREY }}>{k + 1}</div>
          <div style={{ fontSize: 62 }}>{k === 9 ? "🔒" : ic}</div>
        </div>
      ))}
    </div>
    <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 360, right: 20, top: 1440 }} />
  </AbsoluteFill>
);
