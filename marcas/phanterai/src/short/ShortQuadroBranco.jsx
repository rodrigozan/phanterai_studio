import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 19/11/2026 07:00 — "O Claude ganhou quadro branco e planilha".
// Fonte primária (só no texto do post): claude.com/blog/sheets-whiteboards-data (10/11/2026).
// Palco contínuo com interface recriada em motion; cada ação disparada pela palavra da fala
// (índices = posição da palavra em audio/words.orig.json; words.json guarda o índice em `i`).
// Nada de print, nada gerado por IA, nenhum crédito na tela.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SQB_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-19-0700-claude-quadro-branco";
export const SQB_FPS = 30;
const FPS = SQB_FPS;
const f = (p) => staticFile(`${SQB_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const YEL = "#febc2e";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/CuriousFocus.mp3";

export const calculateQuadroBrancoMetadata = async () => {
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

const Janela = ({ title = "claude", children, w = 900, h = 760, style = {}, border }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${border || "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(0.18)}`, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginLeft: 14 }}>{title}</div>
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

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const acabou = at(8), claude = at(9), quadro = at(12), plan = at(15), tres = at(16), terc = at(22), mata = at(23), fim = at(28);
  const n = Math.min(99, 3 + Math.floor(fr / 4));
  const cycle = 20, ph = (fr % cycle) / cycle;
  const bx = interpolate(ph, [0, 0.7], [180, 640], clamp), by = interpolate(ph, [0, 0.35, 0.7], [700, 560, 700], clamp);
  const flash = Math.max(0, 1 - Math.abs(fr - acabou) / 5) * 0.45, flash2 = Math.max(0, 1 - Math.abs(fr - at(3)) / 5) * 0.3;
  return (
    <>
      <AbsoluteFill style={{ background: `rgba(255,92,122,${flash})` }} />
      <AbsoluteFill style={{ background: `rgba(222,64,200,${flash2})` }} />
      {fr < claude && <>
        <Big fr={fr} d={fr >= acabou ? acabou : fr >= at(3) ? at(3) : 0} bg={fr >= acabou ? RED : PINK} rot={fr >= acabou ? -3 : fr >= at(3) ? 3 : 0}>{fr >= acabou ? "acabou!" : fr >= at(3) ? "e cola…" : "copia…"}</Big>
        <div style={{ position: "absolute", top: 520, left: 60, right: 60, display: "flex", justifyContent: "space-between", transform: `translateX(${fr >= acabou ? Math.sin(fr * 2.3) * 14 * Math.exp(-(fr - acabou) / 10) : 0}px)` }}>
          <Janela title="chat da IA" w={430} h={500}>
            {[0, 1, 2].map((k) => <div key={k} style={{ height: 34, width: `${90 - k * 18}%`, borderRadius: 17, background: k === 1 ? PINKA(0.6) : "rgba(190,160,255,0.25)", marginBottom: 24 }} />)}
            <div style={{ fontFamily: MONO, fontSize: 30, color: YEL, marginTop: 30 }}>Ctrl+C</div>
          </Janela>
          <Janela title="outro app" w={430} h={500}>
            {Array.from({ length: Math.min(8, Math.floor(fr / 6) + 1) }, (_, k) => <div key={k} style={{ height: 22, width: `${95 - (k % 3) * 20}%`, borderRadius: 11, background: "rgba(255,255,255,0.22)", marginBottom: 16 }} />)}
            <div style={{ fontFamily: MONO, fontSize: 30, color: YEL, marginTop: 10 }}>Ctrl+V</div>
          </Janela>
        </div>
        {fr < acabou && <div style={{ position: "absolute", left: bx, top: by, width: 260, height: 70, borderRadius: 35, background: PINK, boxShadow: `0 0 40px ${PINK}`, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin(fr / 2) * 6}deg)` }}>resposta</div>}
        <div style={{ position: "absolute", top: 1080, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 56, color: fr >= acabou ? RED : "#fff" }}>colado {n}x {fr >= acabou && "✗"}</div>
        {fr >= acabou && <div style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontSize: 360, color: RED, transform: `scale(${pop(fr, acabou, 8)})`, textShadow: "0 0 40px rgba(255,92,122,0.8)" }}>✗</div>}
      </>}
      {fr >= claude && fr < tres && <>
        <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", transform: `scale(${pop(fr, claude, 10)})` }}>o Claude ganhou</div>
        <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
          {[["🧑‍🏫", "quadro branco", quadro], ["📊", "planilha", plan]].map(([ic, t, d]) => fr < d ? (
            <div key={t} style={{ width: 430, height: 480, borderRadius: 34, border: `5px dashed ${PINKA(0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 200, color: PINKA(0.7), transform: `scale(${pop(fr, claude + 2, 10) * (1 + 0.05 * Math.sin(fr / 2))})` }}>?</div>
          ) : (
            <div key={t} style={{ width: 430, height: 480, borderRadius: 34, background: WIN, border: `4px solid ${PINK}`, boxShadow: `0 0 70px ${PINKA(0.4)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, d, 9)}) rotate(${Math.sin(fr / 8 + d) * 3}deg)` }}>
              <div style={{ fontSize: 190 }}>{ic}</div>
              <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 60, color: "#fff", marginTop: 10 }}>{t}</div>
            </div>
          ))}
        </div>
      </>}
      {fr >= tres && <>
        <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", transform: `scale(${pop(fr, tres, 10)})` }}>3 usos pra hoje</div>
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
          {[1, 2, 3].map((k) => {
            const hot = k === 3 && fr >= terc;
            const turn = !hot && fr < terc && Math.floor((fr - tres - 6) / 8) % 3 === k - 1 && fr > tres + 6;
            const pulse = hot ? 1 + 0.1 * Math.abs(Math.sin((fr - terc) / 4)) : 1;
            return <div key={k} style={{ width: 260, height: 340, borderRadius: 30, background: hot || turn ? PINKA(0.35) : WIN, border: `4px ${hot ? "dashed" : "solid"} ${hot || turn ? PINK : "rgba(255,255,255,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, tres + k * 3, 10) * pulse * (turn ? 1.12 : 1)}) rotate(${hot ? Math.sin(fr / 3) * 4 : 0}deg)` }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 150, color: "#fff" }}>{k}</div>
              {hot && <div style={{ fontSize: 70 }}>{fr >= mata ? "✂️" : "❓"}</div>}
            </div>;
          })}
        </div>
        {fr >= mata && <div style={{ position: "absolute", top: 940, width: "100%", textAlign: "center", transform: `scale(${pop(fr, mata, 9)})` }}>
          <span style={{ position: "relative", fontFamily: MONO, fontSize: 60, color: "#fff", padding: "10px 30px", borderRadius: 20, background: "rgba(255,92,122,0.3)" }}>
            Ctrl+C · Ctrl+V
            <span style={{ position: "absolute", left: 0, top: "50%", height: 8, background: RED, width: `${lin(fr, mata + 4, mata + 14) * 100}%` }} />
          </span>
        </div>}
        {fr >= fim && <div style={{ position: "absolute", top: 1110, left: 190, width: 700, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
          <div style={{ width: `${lin(fr, fim, fim + 16) * 100}%`, height: "100%", background: PINK }} />
        </div>}
      </>}
    </>
  );
};

// ---------- 1: quadro branco ----------
const NOTAS = [["gravar aula", YEL], ["editar", "#7dd3fc"], ["divulgar", "#f9a8d4"], ["lançar", "#86efac"]];
const DONOS = ["Ana", "Rod", "Bia", "Rod"];
const DATAS = ["02/12", "05/12", "09/12", "12/12"];
const Item1 = ({ fr }) => {
  const a = at(32), fala = at(37), monta = at(47), crono = at(50), resp = at(51), data = at(53), focar = at(54), arr = at(58), perg = at(63);
  const falaTxt = "lança o curso… grava, edita, divulga… a Ana grava, eu edito…";
  return (
    <>
      <Chip n="1" titulo="Quadro branco" sub="você fala, ele organiza" fr={fr} d={a} />
      {fr < monta && <Palco top={480}>
        <div style={{ width: 900, padding: 40, borderRadius: 34, background: WIN, border: "2px solid rgba(190,160,255,0.3)", transform: `scale(${pop(fr, a + 3, 12)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, transform: `scale(${1 + 0.08 * Math.sin(fr / 3)})` }}>🎙️</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, height: 120 }}>
              {Array.from({ length: 22 }, (_, k) => <div key={k} style={{ width: 14, borderRadius: 7, background: k % 3 ? "#fff" : PINK, height: 20 + Math.abs(Math.sin(fr / 2.2 + k * 0.9)) * 90 }} />)}
            </div>
          </div>
          <div style={{ marginTop: 34, fontFamily: lora, fontStyle: "italic", fontSize: 48, color: "#fff", minHeight: 200 }}>“{typed(falaTxt, fr, fala, monta - 4)}{blink(fr)}”</div>
          {fr >= at(40) && <div style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 36, color: RED, padding: "8px 20px", borderRadius: 16, background: "rgba(255,92,122,0.2)", transform: `scale(${pop(fr, at(40), 9)}) rotate(-3deg)` }}>bagunçado 😵</div>}
        </div>
      </Palco>}
      {fr >= monta && <Palco top={420}>
        <Janela title="quadro branco" w={940} h={900}>
          <div style={{ position: "relative", height: "100%" }}>
            {fr >= crono && <div style={{ position: "absolute", top: 30, left: 10, right: 10, height: 8, borderRadius: 4, background: PINK, transformOrigin: "0 50%", transform: `scaleX(${lin(fr, crono, crono + 12)})` }} />}
            {NOTAS.map(([t, c], k) => {
              const d = monta + k * 4, p = pop(fr, d, 11);
              const x = 20 + k * 215, y = 70;
              const sx = interpolate(p, [0, 1], [400, x]), sy = interpolate(p, [0, 1], [900, y]);
              const tgt = arr <= fr && k < 2;
              return <div key={t} style={{ position: "absolute", left: sx, top: sy, width: 190, height: 260, borderRadius: 14, background: c, padding: 16, boxShadow: tgt ? `0 0 0 6px ${PINK}` : "0 10px 30px rgba(0,0,0,0.5)", transform: `rotate(${(k % 2 ? 3 : -3) * (1 - 0.5 * p)}deg)` }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#1a1030", lineHeight: 1.1 }}>{t}</div>
                {fr >= resp && <div style={{ marginTop: 18, display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 26, color: "#fff", background: "#1a1030", padding: "6px 14px", borderRadius: 20, transform: `scale(${pop(fr, resp + k * 3, 10)})` }}>👤 {DONOS[k]}</div>}
                {fr >= data && <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 28, color: "#1a1030", fontWeight: 800, transform: `scale(${pop(fr, data + k * 3, 10)})` }}>📅 {DATAS[k]}</div>}
              </div>;
            })}
            {fr >= crono && <div style={{ position: "absolute", top: 360, left: 20, fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", opacity: lin(fr, crono, crono + 6) }}>cronograma ✓ {fr >= resp && "· responsável ✓"} {fr >= data && "· data ✓"}</div>}
            {fr >= arr && (() => {
              const g = lin(fr, arr, arr + 18);
              return <>
                <div style={{ position: "absolute", left: 6, top: 56, width: 20 + 420 * g, height: 20 + 270 * g, border: `5px dashed ${PINK}`, borderRadius: 16, background: PINKA(0.08) }} />
                <Cursor x={10 + 420 * g} y={60 + 270 * g} click={fr > arr + 18 && fr < arr + 24} />
              </>;
            })()}
            {fr >= perg - 4 && <div style={{ position: "absolute", left: 30, right: 30, top: 470, padding: 28, borderRadius: 26, background: "rgba(45,25,90,0.97)", border: `3px solid ${PINK}`, transform: `scale(${pop(fr, perg - 4, 11)})` }}>
              <div style={{ fontFamily: MONO, fontSize: 34, color: "#fff" }}>› {typed("o que falta nessas duas?", fr, perg - 2, perg + 16)}{blink(fr)}</div>
              {fr >= perg + 18 && <div style={{ marginTop: 18, fontFamily: inter, fontSize: 32, color: BODY, opacity: lin(fr, perg + 18, perg + 24) }}>✦ Claude: falta o roteiro antes de gravar</div>}
            </div>}
          </div>
        </Janela>
      </Palco>}
    </>
  );
};

// ---------- 2: planilha ----------
const LINHAS = [["Reels", "R$ 300", "ativo"], ["Shorts", "R$ 200", "ativo"], ["Stories", "R$ 150", "pausado"], ["Anúncio", "R$ 350", "ativo"]];
const Item2 = ({ fr }) => {
  const a = at(65), pede = at(68), cria = at(73), abas = at(75), form = at(76), fmt = at(77), lis = at(79), marca = at(82);
  const cellW = [300, 250, 250];
  return (
    <>
      <Chip n="2" titulo="Planilha" sub="um pedido, a planilha pronta" fr={fr} d={a} />
      {fr < cria && <Palco top={560}>
        <div style={{ width: 900, padding: 40, borderRadius: 34, background: WIN, border: `3px solid ${PINKA(0.6)}`, transform: `scale(${pop(fr, a + 3, 11)})` }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>você</div>
          <div style={{ fontFamily: MONO, fontSize: 56, color: "#fff", marginTop: 14 }}>› {typed("um controle de campanha", fr, pede, at(72) + 10)}{blink(fr)}</div>
          <div style={{ marginTop: 30, width: 200, height: 80, borderRadius: 40, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff", transform: `scale(${fr > cria - 6 ? 0.9 : 1})` }}>enviar ↵</div>
        </div>
      </Palco>}
      {fr >= cria && <Palco top={420}>
        <Janela title="planilha · controle de campanha" w={940} h={880}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: "#fff", padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.08)", marginBottom: 18, height: 52 }}>
            {fr >= form ? <>ƒx <span style={{ color: YEL }}>{typed("=SOMA(B2:B5)", fr, form, form + 12)}</span></> : "ƒx"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[["canal", "verba", "status"], ...LINHAS, ["total", fr >= form + 14 ? "R$ 1.000" : "", ""]].map((row, r) => (
              <div key={r} style={{ display: "flex", opacity: r === 0 ? 1 : lin(fr, cria + r * 3, cria + r * 3 + 5), transform: `translateY(${(1 - lin(fr, cria + r * 3, cria + r * 3 + 5)) * 30}px)` }}>
                {row.map((c, k) => {
                  const hdr = r === 0 && fr >= fmt;
                  const edited = fr >= marca + (r - 1) * 4 && r >= 1 && r <= 4 && k === 1;
                  const isDrop = k === 2 && r >= 1 && r <= 4;
                  return <div key={k} style={{ width: cellW[k], height: 86, borderRight: "2px solid rgba(255,255,255,0.12)", borderBottom: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: r === 0 ? inter : MONO, fontWeight: r === 0 || r === 5 ? 800 : 400, fontSize: 34, color: hdr ? "#fff" : r === 5 && k === 1 ? GREEN : "#fff", background: hdr ? PINK : r === 5 ? "rgba(52,211,153,0.12)" : "transparent", boxShadow: edited ? `inset 0 0 0 5px ${PINK}` : "none", position: "relative" }}>
                    {c}{isDrop && fr >= lis && <span style={{ marginLeft: "auto", color: GREY }}>▾</span>}
                  </div>;
                })}
              </div>
            ))}
          </div>
          {fr >= lis && fr < marca + 2 && <div style={{ position: "absolute", left: 590, top: 330, width: 260, borderRadius: 18, background: "rgba(45,25,90,0.98)", border: `3px solid ${PINK}`, overflow: "hidden", transform: `scaleY(${pop(fr, lis, 12)})`, transformOrigin: "50% 0" }}>
            {["ativo", "pausado", "encerrado"].map((o, k) => <div key={o} style={{ padding: "16px 22px", fontFamily: MONO, fontSize: 32, color: "#fff", background: Math.floor((fr - lis) / 8) % 3 === k ? PINKA(0.5) : "transparent" }}>{o}</div>)}
          </div>}
          {fr >= marca && <div style={{ position: "absolute", left: 340, top: 160 + Math.min(3, Math.floor((fr - marca) / 4)) * 86, fontFamily: inter, fontWeight: 800, fontSize: 24, color: "#fff", background: PINK, padding: "4px 12px", borderRadius: 10 }}>✦ editado pelo Claude</div>}
          <div style={{ position: "absolute", left: 30, bottom: 30, display: "flex", gap: 12 }}>
            {fr >= abas && ["Campanha", "Verba", "Resultados"].map((t, k) => <div key={t} style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", padding: "12px 24px", borderRadius: "14px 14px 0 0", background: k === 0 ? PINK : "rgba(255,255,255,0.12)", transform: `scale(${pop(fr, abas + k * 3, 10)})` }}>{t}</div>)}
          </div>
        </Janela>
      </Palco>}
    </>
  );
};

// ---------- 3: exportar ----------
const Item3 = ({ fr }) => {
  const a = at(87), term = at(89), vira = at(94), doc = at(95), apr = at(97), plan = at(98), xl = at(103), csv = at(105);
  const m = lin(fr, vira, vira + 14);
  return (
    <>
      <Chip n="3" titulo="Sai pronto" sub="sem copiar e colar" fr={fr} d={a} />
      {fr < plan && <Palco top={470}>
        <div style={{ position: "relative", width: 940, height: 800 }}>
          <div style={{ position: "absolute", left: 270, top: 40, width: 400, height: 300, borderRadius: 24, background: WIN, border: `3px solid ${PINK}`, padding: 20, transform: `scale(${pop(fr, a + 3, 11) * (1 - 0.35 * m)}) translateY(${-m * 40}px)` }}>
            <div style={{ fontFamily: MONO, fontSize: 24, color: GREY }}>quadro branco</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              {NOTAS.map(([t, c]) => <div key={t} style={{ width: 160, height: 90, borderRadius: 10, background: c, fontFamily: inter, fontWeight: 800, fontSize: 22, color: "#1a1030", padding: 10 }}>{t}</div>)}
            </div>
          </div>
          {fr >= term && fr < vira && <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: lora, fontStyle: "italic", fontSize: 72, color: "#fff", transform: `scale(${pop(fr, term, 10)})` }}>terminou? ✓</div>}
          {fr >= vira && <div style={{ position: "absolute", left: 470, top: 300, width: 8, height: 120 * m, background: PINK }} />}
          {[["📄", "documento", doc, 120], ["🖥️", "apresentação", apr, 520]].map(([ic, t, d, x]) => fr >= d && (
            <div key={t} style={{ position: "absolute", left: x, top: 440, width: 320, height: 330, borderRadius: 28, background: "rgba(45,25,90,0.97)", border: `4px solid ${PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, d, 9)}) translateY(${interpolate(pop(fr, d, 9), [0, 1], [-200, 0])}px)` }}>
              <div style={{ fontSize: 140 }}>{ic}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{t}</div>
            </div>
          ))}
        </div>
      </Palco>}
      {fr >= plan && <Palco top={460}>
        <div style={{ position: "relative", width: 940, height: 820 }}>
          <div style={{ position: "absolute", left: 220, top: 20, width: 500, height: 330, borderRadius: 24, background: WIN, border: `3px solid ${PINKA(0.6)}`, padding: 20, transform: `scale(${pop(fr, plan, 11)})` }}>
            <div style={{ fontFamily: MONO, fontSize: 24, color: GREY }}>📊 controle de campanha</div>
            {Array.from({ length: 4 }, (_, r) => <div key={r} style={{ display: "flex", marginTop: 14 }}>{[180, 130, 130].map((w, k) => <div key={k} style={{ width: w, height: 40, marginRight: 8, borderRadius: 6, background: r === 0 ? PINKA(0.7) : "rgba(255,255,255,0.14)" }} />)}</div>)}
          </div>
          {[[".xlsx", "Excel", xl, 60, GREEN], [".csv", "CSV", csv, 520, YEL]].map(([ext, t, d, x, c]) => fr >= d && (() => {
            const p = pop(fr, d, 10);
            return <div key={ext} style={{ position: "absolute", left: interpolate(p, [0, 1], [380, x]), top: interpolate(p, [0, 1], [180, 430]), width: 360, height: 300, borderRadius: 28, background: "rgba(20,14,40,0.97)", border: `4px solid ${c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${(x < 300 ? -4 : 4) * p}deg) scale(${0.5 + 0.5 * p})` }}>
              <div style={{ fontSize: 110 }}>📁</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: c }}>{ext}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>{t} ↓</div>
            </div>;
          })())}
        </div>
      </Palco>}
    </>
  );
};

// ---------- 4: virada ----------
const Virada = ({ fr }) => {
  const a = at(108), dentro = at(111), time = at(116), beta = at(119), pagos = at(123), nav = at(126), comp = at(128), cel = at(131);
  const cursors = [["Ana", "#7dd3fc"], ["Rod", YEL], ["Bia", "#86efac"]];
  return (
    <>
      <Palco top={260}>
        <Janela title="claude" w={940} h={700} border={PINKA(0.6)} style={{ transform: `scale(${pop(fr, a - 2, 12)})` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", textAlign: "center", marginBottom: 30 }}>tudo dentro do <span style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, background: PINK, padding: "0 18px", borderRadius: 14 }}>Claude</span></div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            {[["📄", "doc"], ["🧑‍🏫", "quadro"], ["📊", "planilha"]].map(([ic, t], k) => <div key={t} style={{ width: 240, height: 240, borderRadius: 28, background: "rgba(45,25,90,0.97)", border: `3px solid ${PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(fr, dentro + k * 4, 10)})` }}>
              <div style={{ fontSize: 100 }}>{ic}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff" }}>{t}</div>
            </div>)}
          </div>
          {fr >= time && cursors.map(([n, c], k) => {
            const x = 140 + k * 260 + Math.sin((fr - time) / 9 + k * 2) * 90, y = 200 + Math.cos((fr - time) / 11 + k) * 90;
            return <div key={n} style={{ position: "absolute", left: x, top: y, transform: `scale(${pop(fr, time + k * 3, 10)})` }}>
              <div style={{ fontSize: 46, color: c }}>➤</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 26, color: "#1a1030", background: c, padding: "2px 12px", borderRadius: 10 }}>{n}</div>
            </div>;
          })}
          {fr >= time && <div style={{ position: "absolute", bottom: 40, width: "100%", left: 0, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 38, color: GREEN, opacity: lin(fr, time + 4, time + 10) }}>● 3 editando agora</div>}
        </Janela>
      </Palco>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
        {fr >= beta && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#1a1030", background: YEL, padding: "14px 30px", borderRadius: 40, transform: `scale(${pop(fr, beta, 9)}) rotate(-4deg)` }}>BETA</div>}
        {fr >= pagos && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", background: PINK, padding: "14px 30px", borderRadius: 40, transform: `scale(${pop(fr, pagos, 9)}) rotate(3deg)` }}>planos pagos</div>}
      </div>
      <div style={{ position: "absolute", top: 1170, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        {[["🌐", "navegador", nav], ["💻", "computador", comp], ["📱", "celular", cel]].map(([ic, t, d]) => fr >= d && <div key={t} style={{ textAlign: "center", transform: `scale(${pop(fr, d, 9)})` }}>
          <div style={{ fontSize: 110 }}>{ic}</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff" }}>{t} <span style={{ color: GREEN }}>✓</span></div>
        </div>)}
      </div>
    </>
  );
};

// ---------- 5: CTA ----------
const CTA = ({ fr }) => {
  const a = at(132), seg = at(133), com = at(135), q = at(136), leg = at(137);
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
          <div style={{ marginTop: 16, fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff" }}>{typed("QUADRO", fr, com + 2, q + 8)}{blink(fr)}</div>
        </div>
        {fr >= q + 10 && <div style={{ display: "flex", gap: 20, marginTop: 30 }}>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ fontSize: 60, transform: `translateY(${-Math.abs(Math.sin((fr - q) / 6 + k)) * 40}px) scale(${pop(fr, q + 10 + k * 4, 9)})` }}>{k % 2 ? "💬" : "❤️"}</div>)}</div>}
        {fr >= leg && <div style={{ marginTop: 34, fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff", opacity: lin(fr, leg, leg + 6) }}>📣 anúncio oficial na legenda <span style={{ display: "inline-block", transform: `translateY(${Math.abs(Math.sin(fr / 5)) * 14}px)`, color: PINK }}>↓</span></div>}
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
const KEY = new Set(["copiando", "colando", "acabou", "claude", "quadro", "branco", "planilha", "tres", "terceiro", "mata", "fim", "baguncado", "monta", "cronograma", "responsavel", "data", "arrasta", "caixa", "pergunta", "campanha", "abas", "formulas", "formatacao", "listas", "suspensas", "celula", "brainstorm", "documento", "apresentacao", "excel", "c", "s", "v", "time", "junto", "beta", "pagos", "navegador", "computador", "celular", "segue", "legenda", "oficial"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3" };
const buildChunks = (words) => {
  const toks = [];
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    if (n === "numero") { toks.push({ t: "Nº", s: x.s, e: x.e, key: true }); continue; }
    if (n === "c" && words[k + 2] && norm(words[k + 1].w) === "s" && norm(words[k + 2].w) === "v") { toks.push({ t: "CSV.", s: x.s, e: words[k + 2].e, key: true }); k += 2; continue; }
    toks.push({ t: x.w, s: x.s, e: x.e });
  }
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

export const ShortQuadroBranco = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(32), at(65), at(87), at(108), at(132), end];
  const scenes = [Hook, Item1, Item2, Item3, Virada, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Cena key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      <Reacao fr={fr} a={at(8)} b={at(14)} pose="surpresa" />
      <Reacao fr={fr} a={at(94)} b={at(101)} pose="apontando" />
      <Reacao fr={fr} a={at(132)} b={end} pose="comemorando" />
      {fr >= at(9) && <Legendas chunks={chunks} fr={fr} />}
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} /></Sequence>
      <Sequence from={at(3)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.5} /></Sequence>
      <Sequence from={at(8)} durationInFrames={25}><Audio src={staticFile("sfx/error.mp3")} volume={0.55} /></Sequence>
      <Sequence from={at(12)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.4} /></Sequence>
      <Sequence from={at(15)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.4} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      {[at(103), at(105), at(132)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.3} /></Sequence>)}
      <Sequence from={at(136)} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

export const CapaQuadroBranco = () => {
  const fr = 40;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={999} />
      <div style={{ position: "absolute", top: 320, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 116, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Ainda copia</div>
        <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 140, color: "#fff", background: RED, padding: "0 36px", borderRadius: 24, marginTop: 16, transform: "rotate(-3deg)" }}>e cola?</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 70, color: "#fff", lineHeight: 1.1, marginTop: 34 }}>O Claude ganhou</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 76, color: "#fff", marginTop: 8 }}><span style={{ background: PINK, padding: "0 20px", borderRadius: 16 }}>quadro + planilha</span></div>
      </div>
      <div style={{ position: "absolute", top: 1040, left: 90, display: "flex", gap: 30 }}>
        {[["🧑‍🏫", "quadro"], ["📊", "planilha"]].map(([ic, t]) => <div key={t} style={{ width: 300, height: 320, borderRadius: 30, background: WIN, border: `4px solid ${PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 140 }}>{ic}</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{t}</div>
        </div>)}
      </div>
      <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 420, right: 30, top: 1160 }} />
    </AbsoluteFill>
  );
};
