import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 18/11/2026 12:00 — "99 estilos de animação numa skill grátis" (Lemo-Opuscar, skill do Claude Code).
// Fonte primária: github.com/lemomo-ai/lemo-opuscar (README, styles/README.md, LICENSE) — só no texto do post.
// Palco contínuo com interface recriada em motion; cada ação disparada pela palavra da fala
// (índices = posição da palavra em audio/words.orig.json; words.json guarda o índice em `i`).
// Nada de print, nada gerado por IA, nenhum crédito na tela.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SOP_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-18-1200-99-estilos-animacao";
export const SOP_FPS = 30;
const FPS = SOP_FPS;
const f = (p) => staticFile(`${SOP_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Daniel.mp3";

export const calculateOpuscarMetadata = async () => {
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

// personagem de desenho simples (formas CSS), só para a mini-demo
const Bonequinho = ({ fr, color = "#fff", eye = "#140b2e", size = 120, style = {} }) => {
  const b = Math.abs(Math.sin(fr / 5)) * 18;
  return (
    <div style={{ position: "relative", width: size, height: size * 1.4, transform: `translateY(${-b}px)`, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: "50%", background: color, border: `5px solid ${eye}` }} />
      {[0.28, 0.58].map((x) => <div key={x} style={{ position: "absolute", left: size * x, top: size * 0.3, width: size * 0.16, height: size * 0.26, borderRadius: "50%", background: eye }} />)}
      <div style={{ position: "absolute", left: size * 0.3, top: size * 0.66, width: size * 0.4, height: size * 0.14, borderBottom: `6px solid ${eye}`, borderRadius: "0 0 50% 50%" }} />
      <div style={{ position: "absolute", left: size * 0.2, top: size * 1.02, width: size * 0.6, height: size * 0.34, borderRadius: 20, background: eye }} />
    </div>
  );
};

// ---------- cenas ----------
const Hook = ({ fr }) => {
  const n = Math.round(interpolate(fr, [0, 22], [0, 99], clamp));
  const punch = interpolate(fr, [0, 8], [1.15, 1], clamp);
  const z = at(7), sem = at(9), sem2 = at(13), q = at(18);
  const flash = Math.max(0, 1 - Math.abs(fr - z) / 5) * 0.35;
  const tag = fr >= z;
  const sw = tag ? Math.sin((fr - z) / 4) * 14 * Math.exp(-(fr - z) / 40) : 0;
  const showList = fr >= sem;
  return (
    <>
      <AbsoluteFill style={{ background: `rgba(222,64,200,${flash})` }} />
      <div style={{ position: "absolute", top: tag ? 170 : 300, width: "100%", textAlign: "center", transform: `scale(${punch * (tag ? 0.62 : 1)})`, transformOrigin: "50% 0%" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 330, color: "#fff", lineHeight: 1, textShadow: `0 0 70px ${PINKA(0.8)}` }}>{n}</div>
        <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 22, marginTop: 4, transform: `scale(${0.8 + 0.2 * pop(fr, 0, 10)})` }}>estilos</div>
      </div>
      {fr >= at(5) && fr < z && <div style={{ position: "absolute", top: 1000, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ width: 150, height: 210, borderRadius: 20, background: [PINKA(0.5), "rgba(120,90,255,0.5)", "rgba(52,211,153,0.45)", "rgba(254,188,46,0.5)", "rgba(255,92,122,0.5)"][k], border: "3px solid rgba(255,255,255,0.4)", transform: `scale(${pop(fr, at(5) + k * 2, 10)}) rotate(${(k - 2) * 5}deg)` }}><Bonequinho fr={fr + k * 7} size={90} style={{ margin: "30px auto 0" }} /></div>)}
      </div>}
      {tag && !showList && <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `rotate(${sw}deg) scale(${pop(fr, z, 9)})`, transformOrigin: "50% -80px", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: -80, width: 4, height: 80, background: BODY }} />
          <div style={{ padding: "30px 70px", borderRadius: 30, background: "#fff", fontFamily: inter, fontWeight: 800, fontSize: 200, color: "#140b2e", border: `8px solid ${PINK}` }}>R$ 0</div>
        </div>
      </div>}
      {showList && fr < q && <div style={{ position: "absolute", top: 720, left: 120, right: 120 }}>
        {[["✏️", "saber desenhar", sem], ["🎬", "gerador de vídeo", sem2]].map(([ic, t, d], k) => {
          const x = lin(fr, d + 8, d + 14);
          if (fr < d) return null;
          return <div key={k} style={{ position: "relative", display: "flex", alignItems: "center", gap: 30, padding: "30px 40px", marginBottom: 30, borderRadius: 26, background: WIN, border: `3px solid ${x > 0 ? RED : "rgba(255,255,255,0.25)"}`, transform: `translateX(${(1 - pop(fr, d, 12)) * 600}px)` }}>
            <div style={{ fontSize: 80 }}>{ic}</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{t}</div>
            <div style={{ position: "absolute", left: 30, top: "50%", height: 10, width: `${x * 90}%`, background: RED, borderRadius: 5, transform: "rotate(-3deg)" }} />
            {x >= 1 && <div style={{ position: "absolute", right: 30, fontSize: 80, color: RED, fontFamily: inter, fontWeight: 800 }}>✗</div>}
          </div>;
        })}
      </div>}
      {fr >= q && <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
        {[1, 2, 3, 4].map((k) => {
          const lock = k === 4 && fr >= at(22);
          const pulse = lock ? 1 + 0.12 * Math.abs(Math.sin((fr - at(22)) / 4)) : 1;
          return <div key={k} style={{ width: 190, height: 250, borderRadius: 28, background: lock ? PINKA(0.35) : WIN, border: `4px ${lock ? "dashed" : "solid"} ${lock ? PINK : "rgba(255,255,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, q + k * 3, 10) * pulse}) rotate(${lock ? Math.sin(fr / 3) * 4 : 0}deg)` }}>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 120, color: "#fff" }}>{k}</div>
            {lock && <div style={{ fontSize: 60 }}>🔒</div>}
          </div>;
        })}
      </div>}
    </>
  );
};

const Repo = ({ fr }) => {
  const stars = Math.round(interpolate(fr, [at(45), at(49)], [0, 18179], clamp));
  const name = typed("lemo-opuscar", fr, at(34), at(36));
  return (
    <>
      <Palco top={380}>
        <div style={{ width: 920, padding: 46, borderRadius: 34, background: WIN, border: "2px solid rgba(190,160,255,0.3)", boxShadow: `0 0 70px ${PINKA(0.25)}`, transform: `scale(${pop(fr, at(31), 12)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ width: 150, height: 150, borderRadius: 36, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, transform: `rotate(${Math.sin(fr / 6) * 6}deg)` }}>🎬</div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>lemomo-ai /</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{name}{fr < at(36) && blink(fr)}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 36, flexWrap: "wrap" }}>
            {[["skill", at(37), "rgba(120,90,255,0.35)"], ["grátis", at(38), "rgba(52,211,153,0.3)"], ["Claude Code", at(40), PINKA(0.35)]].map(([t, d, bg]) => fr >= d && (
              <div key={t} style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", padding: "12px 28px", borderRadius: 40, background: bg, transform: `scale(${pop(fr, d, 9)})` }}>{t}</div>
            ))}
          </div>
          <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 24, padding: "28px 34px", borderRadius: 24, background: "rgba(255,255,255,0.06)", opacity: lin(fr, at(43), at(45)) }}>
            <div style={{ fontSize: 90, color: "#febc2e", transform: `rotate(${fr >= at(45) ? (fr - at(45)) * 6 : 0}deg) scale(${1 + 0.1 * Math.sin(fr / 3)})` }}>★</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 120, color: "#fff" }}>{stars.toLocaleString("pt-BR")}</div>
          </div>
          {fr >= at(49) && <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 32, color: GREEN, transform: `scale(${pop(fr, at(49), 10)})` }}>● no GitHub</div>}
        </div>
      </Palco>
    </>
  );
};

const CATS = ["Documentário", "Pintura", "Esboço", "Artesanato", "Gravura", "Tipografia", "Diagramas", "Desenho animado", "Games", "Filme e fita", "Telas", "Luz e linhas", "3D e miniatura", "Instrumentos", "Dados e mapas"];
const TOONS = ["Rubber hose · anos 30", "Anime · anos 80", "Sitcom sci-fi", "Cartoon anos 50", "História cômica", "Mangá"];
const Item1 = ({ fr }) => {
  const g = at(56), six = at(59);
  const hl = fr >= at(70) ? 1 : fr >= at(65) ? 0 : -1;
  return (
    <>
      <Chip n={1} titulo="Escolhe o estilo" sub="99 estilos prontos" fr={fr} d={at(50)} />
      <Palco top={470}>
        <div style={{ width: 940, height: 860, position: "relative" }}>
          {fr < six + 6 && <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, opacity: 1 - lin(fr, six, six + 6) }}>
            {CATS.map((c, k) => {
              const on = k === 7;
              return <div key={c} style={{ height: 140, borderRadius: 20, background: on && fr >= six - 4 ? PINK : WIN, border: "2px solid rgba(190,160,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", padding: 10, transform: `scale(${pop(fr, g + k * 1.3, 11)})` }}>{c}</div>;
            })}
          </div>}
          {fr >= at(57) && fr < six + 6 && <div style={{ position: "absolute", right: -10, top: -60, width: 170, height: 170, borderRadius: 85, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#fff", transform: `scale(${pop(fr, at(57), 9)})` }}>15</div>}
          {fr >= six && <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22 }}>
            {TOONS.map((t, k) => {
              const act = k === hl;
              return <div key={t} style={{ height: 250, borderRadius: 26, background: act ? PINKA(0.35) : WIN, border: `3px solid ${act ? PINK : "rgba(190,160,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${pop(fr, six + k * 3, 11) * (act ? 1.06 : 1)})` }}>
                <Bonequinho fr={act ? fr : 0} size={act ? 110 : 80} color={["#fff", "#ffd2f1", "#c9f7e6", "#ffe7a8", "#d7d0ff", "#fff"][k]} />
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff" }}>{t}</div>
              </div>;
            })}
          </div>}
          {fr >= six && <div style={{ position: "absolute", right: -10, top: -60, width: 170, height: 170, borderRadius: 85, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 90, color: "#fff", transform: `scale(${pop(fr, six, 9)})` }}>6</div>}
        </div>
      </Palco>
    </>
  );
};

const Item2 = ({ fr }) => {
  const msg = "faz um filme nesse estilo sobre o meu canal";
  const sent = fr >= at(87) + 8;
  return (
    <>
      <Chip n={2} titulo="Pede numa frase" sub="em português mesmo" fr={fr} d={at(74)} />
      <Palco top={470}>
        <Janela w={940} h={860}>
          <div style={{ display: "flex", gap: 14, marginBottom: 30 }}>
            {["estilo:", "Rubber hose · anos 30"].map((t, k) => <div key={t} style={{ fontFamily: k ? inter : MONO, fontWeight: k ? 800 : 400, fontSize: 30, color: "#fff", padding: "10px 20px", borderRadius: 14, background: k ? PINK : "transparent", transform: `scale(${pop(fr, at(76) + k * 4, 10)})` }}>{t}</div>)}
          </div>
          {!sent && <div style={{ fontFamily: MONO, fontSize: 40, color: "#fff", lineHeight: 1.35, border: `2px solid ${fr >= at(79) ? PINK : "rgba(255,255,255,0.3)"}`, borderRadius: 18, padding: "24px 26px", minHeight: 200 }}>{"> "}{typed(msg, fr, at(79), at(87))}{blink(fr)}</div>}
          {sent && <div style={{ marginLeft: 120, fontFamily: inter, fontSize: 38, color: "#fff", background: PINKA(0.4), borderRadius: "26px 26px 6px 26px", padding: "24px 30px", transform: `translateY(${(1 - pop(fr, at(87) + 8)) * 80}px)` }}>{msg}</div>}
          {sent && <div style={{ marginTop: 30, fontFamily: MONO, fontSize: 32, color: GREEN, opacity: lin(fr, at(87) + 14, at(87) + 20) }}>{"✻✢✳✶"[Math.floor(fr / 4) % 4]} entendido, começando o filme…</div>}
          <div style={{ position: "absolute", right: 34, bottom: 40, width: 120, height: 120, borderRadius: 60, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, color: "#fff", transform: `scale(${fr >= at(87) && fr < at(87) + 8 ? 0.85 : 1 + 0.05 * Math.sin(fr / 4)})` }}>➤</div>
        </Janela>
      </Palco>
    </>
  );
};

const Item3 = ({ fr }) => {
  const steps = [["desenha", at(96)], ["compõe a trilha", at(97)], ["narra", at(100)], ["monta o vídeo", at(102)]];
  const prog = lin(fr, at(93), at(102) + 6);
  const mins = Math.round(interpolate(fr, [at(105), at(108)], [30, 60], clamp));
  return (
    <>
      <Chip n={3} titulo="O Claude faz tudo" sub="em código, quadro a quadro" fr={fr} d={at(88)} />
      <Palco top={470}>
        <Janela w={940} h={860} title="claude code · filme">
          {steps.map(([t, d], k) => {
            const done = fr >= d + 6;
            return <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: inter, fontWeight: 800, fontSize: 46, color: fr >= d ? "#fff" : GREY, marginBottom: 26, padding: "14px 22px", borderRadius: 18, background: fr >= d && !done ? PINKA(0.25) : "transparent" }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, border: `4px solid ${done ? GREEN : GREY}`, background: done ? GREEN : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#140b2e", transform: `scale(${done ? pop(fr, d + 6, 9) : 1})` }}>{done ? "✓" : ""}</div>
              {t}
              {fr >= d && !done && <span style={{ color: PINK }}>{"✻✢✳✶"[Math.floor(fr / 3) % 4]}</span>}
            </div>;
          })}
          <div style={{ marginTop: 14, height: 30, borderRadius: 15, background: "rgba(255,255,255,0.12)" }}><div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 15, background: PINK }} /></div>
          <div style={{ fontFamily: MONO, fontSize: 30, color: BODY, marginTop: 12 }}>render {Math.round(prog * 100)}%</div>
          {fr >= at(103) && <div style={{ position: "absolute", left: 34, right: 34, bottom: 40, display: "flex", alignItems: "center", gap: 26, padding: "22px 30px", borderRadius: 22, background: "rgba(45,25,90,0.97)", border: `2px solid ${PINK}`, transform: `translateY(${(1 - pop(fr, at(103))) * 120}px)` }}>
            <div style={{ fontSize: 70, transform: `rotate(${fr * 6}deg)` }}>⏱</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>30–{mins} min</div>
          </div>}
        </Janela>
      </Palco>
    </>
  );
};

const Item4 = ({ fr }) => {
  const cores = ["#de40c8", "#7a5cff", "#34d399", "#febc2e", "#140b2e"];
  const saved = fr >= at(128) + 6;
  return (
    <>
      <Chip n={4} titulo="Seu próprio estilo" sub="e fica guardado" fr={fr} d={at(109)} />
      <Palco top={470}>
        <Janela w={940} h={860} title="meu estilo · novo">
          <div style={{ fontFamily: MONO, fontSize: 30, color: GREY, marginBottom: 14 }}>cores</div>
          <div style={{ display: "flex", gap: 18, marginBottom: 34 }}>
            {cores.map((c, k) => <div key={c} style={{ width: 120, height: 120, borderRadius: 24, background: fr >= at(119) - 6 + k * 2 ? c : "rgba(255,255,255,0.06)", border: "3px solid rgba(255,255,255,0.35)", transform: `scale(${fr >= at(119) - 6 + k * 2 ? pop(fr, at(119) - 6 + k * 2, 9) : 1})` }} />)}
          </div>
          <div style={{ display: "flex", gap: 30, alignItems: "center", marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 30, color: GREY, marginBottom: 14 }}>logo</div>
              <div style={{ width: 380, height: 200, borderRadius: 24, border: "3px dashed rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {fr >= at(122) && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", transform: `scale(${pop(fr, at(122), 9)})` }}>Phanter<span style={{ color: PINK }}>AI</span></div>}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 30, color: GREY, marginBottom: 14 }}>personagens</div>
              <div style={{ width: 380, height: 200, borderRadius: 24, border: "3px dashed rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                {fr >= at(126) && [0, 1].map((k) => <div key={k} style={{ transform: `scale(${pop(fr, at(126) + k * 4, 10)})` }}><Bonequinho fr={fr + k * 9} size={70} color={k ? "#ffd2f1" : "#c9f7e6"} /></div>)}
              </div>
            </div>
          </div>
          <div style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 44, color: saved ? "#fff" : "#140b2e", background: saved ? GREEN : "#fff", padding: "18px 40px", borderRadius: 20, transform: `scale(${fr >= at(128) && !saved ? 0.9 : 1})` }}>{saved ? "Salvo ✓" : "Salvar estilo"}</div>
          {fr >= at(130) && <div style={{ display: "inline-block", marginLeft: 24, fontFamily: MONO, fontSize: 32, color: "#fff", padding: "16px 24px", borderRadius: 18, background: PINKA(0.3), border: `2px solid ${PINK}`, transform: `scale(${pop(fr, at(130), 10)})` }}>meus estilos (1)</div>}
        </Janela>
      </Palco>
    </>
  );
};

const Plugin = ({ fr }) => {
  const c1 = "claude plugin marketplace add lemomo-ai/lemo-opuscar";
  const c2 = "claude plugin install lemo-opuscar@lemolab";
  const ok = fr >= at(142) + 10;
  return (
    <>
      <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center", transform: `scale(${pop(fr, at(133), 10) * (fr >= at(137) ? 1 + 0.12 * Math.max(0, 1 - (fr - at(137)) / 8) : 1)})` }}>
        <span style={{ fontFamily: lora, fontStyle: "italic", fontSize: 110, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 24 }}>{fr >= at(137) ? "1 plugin" : "tudo isso"}</span>
      </div>
      <Palco top={500}>
        <Janela w={940} h={760} title="terminal">
          <div style={{ fontFamily: MONO, fontSize: 34, color: "#fff", lineHeight: 1.4 }}><span style={{ color: PINK }}>$ </span>{typed(c1, fr, at(134), at(141))}{fr < at(141) && blink(fr)}</div>
          {fr >= at(141) && <div style={{ fontFamily: MONO, fontSize: 34, color: "#fff", lineHeight: 1.4, marginTop: 30 }}><span style={{ color: PINK }}>$ </span>{typed(c2, fr, at(141), at(142) + 8)}{!ok && blink(fr)}</div>}
          {ok && <div style={{ marginTop: 40, fontFamily: inter, fontWeight: 800, fontSize: 56, color: GREEN, transform: `scale(${pop(fr, at(142) + 10, 9)})` }}>✓ 99 estilos instalados</div>}
          <div style={{ position: "absolute", right: 40, bottom: 40, fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff", background: PINKA(0.35), padding: "10px 26px", borderRadius: 16, opacity: lin(fr, at(141), at(141) + 6) }}>2 comandos</div>
        </Janela>
      </Palco>
    </>
  );
};

const CTA = ({ fr }) => {
  const seg = fr >= at(147);
  const bolhas = Array.from({ length: 10 }, (_, k) => {
    const st = at(144) + k * 9; if (fr < st) return null;
    const p = (fr - st) / 50; if (p > 1) return null;
    return <div key={k} style={{ position: "absolute", left: 120 + ((k * 173) % 760), top: 1350 - p * 900, opacity: 1 - p, fontSize: 64, transform: `rotate(${(k % 2 ? 1 : -1) * 12}deg)` }}>{k % 3 ? "💬" : "💜"}</div>;
  });
  return (
    <>
      {bolhas}
      <Palco top={420}>
        <div style={{ width: 900, padding: 44, borderRadius: 34, background: WIN, border: `2px solid ${PINKA(0.6)}`, transform: `scale(${pop(fr, at(143), 11)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 90, height: 90, borderRadius: 45, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>💬</div>
            <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>Comente</div>
          </div>
          <div style={{ marginTop: 28, fontFamily: MONO, fontSize: 90, color: "#fff", border: `3px solid ${PINK}`, borderRadius: 20, padding: "14px 30px" }}>{typed("ESTILO", fr, at(144), at(144) + 10)}{blink(fr)}</div>
          <div style={{ marginTop: 34, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 44, color: seg ? "#fff" : "#140b2e", background: seg ? "rgba(255,255,255,0.12)" : "#fff", padding: "16px 40px", borderRadius: 18, transform: `scale(${seg ? 1 + 0.1 * Math.max(0, 1 - (fr - at(147)) / 8) : 1})` }}>{seg ? "Seguindo ✓" : "Seguir"}</div>
          {fr >= at(149) && <div style={{ marginTop: 34, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", opacity: lin(fr, at(149), at(149) + 6) }}>🔗 link na legenda <span style={{ display: "inline-block", transform: `translateY(${Math.abs(Math.sin(fr / 5)) * 14}px)`, color: PINK }}>↓</span></div>}
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
const KEY = new Set(["noventa", "nove", "estilos", "zero", "reais", "desenhar", "gerador", "quatro", "quarto", "absurdo", "lemo", "opuscar", "skill", "gratis", "dezoito", "mil", "estrelas", "escolhe", "quinze", "seis", "desenho", "animado", "cartoon", "anime", "pede", "frase", "codigo", "desenha", "trilha", "narra", "monta", "trinta", "sessenta", "proprio", "cores", "logo", "personagens", "guarda", "plugin", "dois", "comandos", "estilo", "segue", "legenda"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4" };
const buildChunks = (words) => {
  const toks = [];
  words.forEach((x, k) => {
    const n = norm(x.w);
    // "Noventa e nove" -> "99"; "dezoito mil" -> "18 mil"
    if (n === "noventa" && words[k + 2] && norm(words[k + 2].w) === "nove") { toks.push({ t: "99", s: x.s, e: words[k + 2].e, key: true }); return; }
    if ((n === "e" || n === "nove") && k <= 2 && toks.length && toks[0].t === "99") return;
    if (n === "numero") { toks.push({ t: "Nº", s: x.s, e: x.e, key: true }); return; }
    toks.push({ t: x.w, s: x.s, e: x.e });
  });
  const chunks = []; let cur = [];
  toks.forEach((tk) => {
    cur.push(tk);
    const len = cur.map((c) => c.t).join(" ").length;
    if (cur.length >= 3 || len > 15 || /[.,!?:;]$/.test(tk.t) || /\.\.\.$/.test(tk.t) || tk.t === "99") { chunks.push(cur); cur = []; }
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

export const ShortOpuscar = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(31), at(50), at(74), at(88), at(109), at(132), at(143), end];
  const scenes = [Hook, Repo, Item1, Item2, Item3, Item4, Plugin, CTA];
  const chunks = buildChunks(words);
  // legenda some no hook enquanto a palavra gigante ocupa o palco (até "por zero reais")
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Cena key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      <Reacao fr={fr} a={at(6)} b={at(9)} pose="surpresa" />
      <Reacao fr={fr} a={at(111)} b={at(119)} pose="apontando" />
      <Reacao fr={fr} a={at(143)} b={end} pose="comemorando" />
      {fr >= at(6) && <Legendas chunks={chunks} fr={fr} />}
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} /></Sequence>
      <Sequence from={at(7)} durationInFrames={30}><Audio src={staticFile("sfx/coin.mp3")} volume={0.45} /></Sequence>
      <Sequence from={at(13) + 8} durationInFrames={20}><Audio src={staticFile("sfx/error.mp3")} volume={0.3} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      {[at(111), at(143)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const CapaOpuscar = () => {
  const fr = 40;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={999} />
      <div style={{ position: "absolute", top: 300, left: 70, right: 70, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 300, color: "#fff", lineHeight: 1, textShadow: `0 0 70px ${PINKA(0.8)}` }}>99</div>
        <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 110, color: "#fff", background: PINK, padding: "0 32px", borderRadius: 22 }}>estilos de animação</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", lineHeight: 1.05, marginTop: 24, letterSpacing: -2 }}>por zero reais</div>
      </div>
      <div style={{ position: "absolute", top: 1090, left: 100, display: "flex", gap: 18 }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ width: 170, height: 240, borderRadius: 22, background: [PINKA(0.5), "rgba(120,90,255,0.5)", "rgba(52,211,153,0.45)"][k], border: "3px solid rgba(255,255,255,0.4)", transform: `rotate(${(k - 1) * 6}deg)` }}><Bonequinho fr={k * 7} size={100} style={{ margin: "34px auto 0" }} /></div>)}
      </div>
      <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 420, right: 40, top: 1160 }} />
    </AbsoluteFill>
  );
};
