import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 24/11/2026 07:00 — "O Gemini agora mexe no seu Mac por você".
// Fatos conferidos na fonte primária (blog.google/innovation-and-ai/products/gemini-app/computer-use-mac/, 19/11/2026,
// texto capturado em fontes/ em 24/11/2026):
// - computer use no app Gemini para Mac: tarefas de várias etapas em arquivos locais, apps e web;
//   "Gemini handles the clicking, typing, menus, and forms for you"; "dozens of clicks".
// - "isolated background window with a live preview right in your chat. Your main screen and cursor remain completely free".
// - você escolhe os apps, assiste cada passo ao vivo, pausa a qualquer hora e aprova ações-chave antes.
// - 4 usos do anúncio: cor de fotos em lote no software de design; PDFs locais (peso, dimensões, endereços) → cotação de
//   frete com várias caixas; métricas de dashboards de várias regiões → apresentação no Google Slides; fotos de roupas
//   de uma pasta → pesquisa de preço → anúncios preparados em plataformas de revenda.
// - Nota 1: inglês, EUA; Mac Apple Silicon com macOS Sequoia 15.0+; contas pessoais 18+; Google AI Plus, Pro e Ultra.
// Tudo é interface recriada em motion no Remotion (estilo PhanterAI): nenhum print, nada gerado por IA, nenhum logo oficial.
export const SGM_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-24-0700-gemini-usa-seu-mac";
export const SGM_FPS = 30;
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

const FPS = SGM_FPS;
const f = (p) => staticFile(`${SGM_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const AMBER = "#fbbf24";
const VIOLET = "#b48cff";
const WIN = "rgba(20,14,40,0.94)";
const LINE = "rgba(190,160,255,0.28)";
const TAIL = 1.0;
let W = {};
const at = (i) => (W[i] ? Math.round(W[i].s * FPS) : 0);
const ease = (t) => 1 - Math.pow(1 - t, 3);
const pop = (fr, d, damping = 14) => spring({ frame: fr - d, fps: FPS, config: { damping } });
const lin = (fr, a, b) => interpolate(fr, [a, b], [0, 1], clamp);
const typed = (txt, fr, a, b) => txt.slice(0, Math.round(txt.length * lin(fr, a, b)));
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0, color: PINK }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);
const count = (fr, a, b, v0, v1) => Math.round(interpolate(fr, [a, b], [v0, v1], { ...clamp, easing: ease }));
const In = ({ fr, d, children, dy = 50, dx = 0, style = {}, damping = 13 }) => {
  const p = pop(fr, d, damping);
  if (fr < d) return null;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};

// ---------- base ----------
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
      <div style={{ position: "absolute", left: 20, top: 300, width: 1040, height: 1040, borderRadius: "50%",
        background: `radial-gradient(circle, ${PINKA(0.22 + 0.05 * Math.sin(fr / 20))} 0%, transparent 65%)` }} />
      {dots}
    </AbsoluteFill>
  );
};

const Logo = ({ fr }) => (
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 165, 180) }}>
    Phanter<span style={{ color: PINK }}>AI</span>
  </div>
);

const Janela = ({ title = "", children, w = 900, h = 760, style = {}, glow }) => (
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${glow ? PINK : LINE}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(glow ? 0.45 : 0.18)}`, overflow: "hidden", position: "relative", boxSizing: "border-box", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ fontFamily: MONO, fontSize: 24, color: GREY, marginLeft: 14, whiteSpace: "nowrap" }}>{title}</div>
    </div>
    <div style={{ padding: 28, position: "relative", height: h - 64, boxSizing: "border-box" }}>{children}</div>
  </div>
);

const Big = ({ children, fr, d, top = 220, bg = PINK, rot = 0, size = 150 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", zIndex: 6, transform: `scale(${d <= 0 ? interpolate(fr, [0, 8], [1.15, 1], clamp) : 0.55 + 0.45 * pop(fr, d, 9)})` }}>
    <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: size, color: "#fff", background: bg, padding: "0 42px", borderRadius: 30, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>{children}</span>
  </div>
);

const Pill = ({ children, bg = "rgba(52,211,153,0.16)", c = GREEN, size = 40, style = {} }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, background: bg, border: `2px solid ${c}`, padding: "8px 26px", borderRadius: 40, whiteSpace: "nowrap", ...style }}>{children}</span>
);

const Header = ({ fr, d, n, icon, t, sub }) => (
  <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 5 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 34px 16px 18px", borderRadius: 60, background: WIN, border: `2px solid ${PINKA(0.6)}`, transform: `scale(${0.6 + 0.4 * pop(fr, d, 10)})`, boxShadow: `0 0 50px ${PINKA(0.3)}` }}>
      <div style={{ width: 92, height: 92, borderRadius: 46, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>{n}</div>
      <div style={{ fontSize: 58 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1 }}>{t}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: BODY, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  </div>
);

const Stamp = ({ fr, d, children, c = PINK, rot = -8, size = 90, style = {} }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 8);
  return <div style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, border: `8px solid ${c}`, borderRadius: 24, padding: "4px 30px", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.6), background: "rgba(10,6,24,0.85)", whiteSpace: "nowrap", ...style }}>{children}</div>;
};

const Bar = ({ label, v, c, w = 640, h = 70, right, glow, lw = 220 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ width: lw, fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", textAlign: "right" }}>{label}</div>
    <div style={{ width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(190,160,255,0.25)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, v)) * 100}%`, borderRadius: h / 2, background: c, boxShadow: glow ? `0 0 40px ${c}` : "none" }} />
      {right && <div style={{ position: "absolute", right: 22, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#fff" }}>{right}</div>}
    </div>
  </div>
);

const Spin = ({ fr, c = AMBER, s = 34 }) => (
  <div style={{ width: s, height: s, borderRadius: s, border: `5px solid rgba(255,255,255,0.15)`, borderTopColor: c, transform: `rotate(${fr * 18}deg)`, boxSizing: "border-box" }} />
);

export const calculateGeminiMacMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w, i) => ({ ...w, i }));
  const end = words[words.length - 1].e;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças ----------
const BLUE = "#7ab8ff";
// estrela de 4 pontas desenhada em CSS (não é o logo oficial)
const Sparkle = ({ s = 60, fr = 0 }) => (
  <div style={{ width: s, height: s, position: "relative", transform: `rotate(${fr * 2}deg)` }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${BLUE}, ${PINK})`, clipPath: "polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)" }} />
  </div>
);
const Cursor = ({ x, y, fr, click, c = "#fff", s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 7, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    {click != null && fr >= click && fr < click + 12 && <div style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `5px solid ${PINK}`, transform: `scale(${0.4 + (fr - click) / 8})`, opacity: 1 - (fr - click) / 12 }} />}
    <div style={{ width: 0, height: 0, borderLeft: "22px solid " + c, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", transform: "rotate(-55deg) translate(-6px,-4px)", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.7))" }} />
  </div>
);
const Field = ({ label, val, ok, w = 380, hot }) => (
  <div style={{ width: w }}>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 26, color: GREY, marginBottom: 6 }}>{label}</div>
    <div style={{ height: 66, borderRadius: 16, border: `3px solid ${ok ? GREEN : hot ? PINK : LINE}`, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 18px", fontFamily: MONO, fontWeight: 800, fontSize: 32, color: "#fff", gap: 10 }}>
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{val}</span>{ok && <span style={{ color: GREEN }}>✓</span>}
    </div>
  </div>
);

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dNao = at(5), dNen = at(7), dGem = at(9), dMac = at(14), dQuatro = at(18), dUlt = at(22), dAnun = at(26);
  let big, bigD, size = 120, bg = PINK, rot = -3;
  if (fr < dNao) { big = "dezenas de cliques"; bigD = 0; size = 96; bg = RED; }
  else if (fr < dGem) { big = "você: 0 cliques"; bigD = dNao; size = 104; rot = 2; }
  else if (fr < dQuatro) { big = "no seu Mac"; bigD = dGem; size = 130; }
  else { big = "4 usos"; bigD = dQuatro; size = 140; rot = -2; }
  const flash = [dNen, dGem, dMac, dQuatro, dAnun].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const clicks = count(fr, 0, dNao, 3, 47);
  // cursores clicando por todo lado desde o quadro 0
  const CUR = Array.from({ length: 9 }, (_, k) => ({ x: 120 + ((k * 263) % 760), y: 140 + ((k * 151) % 380), c: 2 + k * 3 }));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={150} rot={rot} bg={bg}>{big}</Big>
      {fr < dGem ? (
        <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(fr, [0, 8], [1.2, 1], clamp)}) translateX(${shake(fr, dNen, 24)}px)` }}>
          <Janela title="formulário · 8 campos" w={900} h={640} glow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
              {Array.from({ length: 8 }, (_, k) => <Field key={k} w={400} label={["nome", "peso", "largura", "altura", "CEP", "cidade", "caixas", "valor"][k]} val={fr >= dNao ? "" : "▍".repeat(((fr + k * 3) % 9) > 4 ? 1 : 0)} hot={fr < dNao && (Math.floor(fr / 4) % 8) === k} />)}
            </div>
            {fr < dNao && CUR.map((c, k) => fr >= c.c && <Cursor key={k} fr={fr} click={c.c + (Math.floor((fr - c.c) / 14) * 14)} x={c.x + Math.sin(fr / 5 + k) * 20} y={c.y + Math.cos(fr / 6 + k) * 14} />)}
          </Janela>
          <div style={{ marginTop: 34, display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: fr >= dNao ? GREY : "#fff", textDecoration: fr >= dNao ? "line-through" : "none" }}>🖱 {clicks} cliques</div>
            {fr >= dNen && <Stamp fr={fr} d={dNen} size={64} rot={-6} c={GREEN}>0 seus</Stamp>}
          </div>
        </div>
      ) : fr < dQuatro ? (
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
          <In fr={fr} d={dGem}>
            <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 44px", borderRadius: 40, background: WIN, border: `3px solid ${PINK}`, boxShadow: `0 0 60px ${PINKA(0.4)}` }}>
              <Sparkle s={90} fr={fr} />
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 84, color: "#fff" }}>Gemini</span>
              {fr >= at(11) && <Pill size={40} c="#fff" bg={PINKA(0.8)} style={{ border: `2px solid ${PINK}` }}>{typed("mexe sozinho", fr, at(11), at(11) + 10)}</Pill>}
            </div>
          </In>
          {fr >= dGem + 6 && (
            <In fr={fr} d={dGem + 6} dy={140}>
              <div style={{ width: 860, height: 440, borderRadius: 30, border: `10px solid #3a3358`, background: "#120c26", position: "relative", overflow: "hidden" }}>
                <div style={{ height: 40, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 26, padding: "0 20px", fontFamily: inter, fontWeight: 800, fontSize: 22, color: BODY }}><span>Mac</span><span>Arquivo</span><span>Editar</span><span>Janela</span></div>
                {[0, 1, 2].map((k) => { const d = Math.min(dMac, dGem + 12) + k * 5; return fr >= d && <div key={k} style={{ position: "absolute", left: 50 + k * 260, top: 80 + k * 40, width: 260, height: 220, borderRadius: 16, background: WIN, border: `2px solid ${k === 2 ? PINK : LINE}`, transform: `scale(${pop(fr, d, 10)})` }}><div style={{ height: 30, background: "rgba(255,255,255,0.06)" }} /><div style={{ fontSize: 70, textAlign: "center", marginTop: 34 }}>{["📁", "🌐", "📝"][k]}</div></div>; })}
                <Cursor fr={fr} click={dMac + 6} x={interpolate(fr, [dGem + 6, dMac + 6], [100, 640], clamp)} y={interpolate(fr, [dGem + 6, dMac + 6], [380, 210], clamp)} />
              </div>
            </In>
          )}
          {fr >= dGem + 20 && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {[1, 2, 3, 4].map((n, k) => <In key={n} fr={fr} d={dGem + 20 + k * 3} dy={60}><div style={{ width: 110, height: 110, borderRadius: 24, background: k === 3 ? PINKA(0.3) : WIN, border: `4px solid ${k === 3 ? PINK : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff", transform: `rotate(${k === 3 ? Math.sin(fr / 3) * 8 : 0}deg)` }}>{k === 3 ? "❓" : n}</div></In>)}
              {fr >= dGem + 32 && <In fr={fr} d={dGem + 32} dx={80} dy={0}><Pill size={40} c="#fff" bg={PINKA(0.85)} style={{ border: `2px solid ${PINK}`, marginLeft: 10 }}>4 usos · o último 🤯</Pill></In>}
            </div>
          )}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 460, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26, flexWrap: "wrap", width: 1080 }}>
          {[["🎨", "fotos"], ["📦", "frete"], ["📊", "slides"], ["🏷️", "anúncios"]].map(([ic, t], k) => {
            const d = dQuatro + k * 4;
            const last = k === 3, hot = last && fr >= dUlt, open = last && fr >= dAnun;
            const sh = hot ? shake(fr, dUlt, 16) + Math.sin(fr * 1.5) * 3 : 0;
            return (
              <In key={k} fr={fr} d={d} dy={120}>
                <div style={{ width: 230, height: 380, borderRadius: 30, background: open ? PINKA(0.22) : WIN, border: `4px solid ${hot ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, transform: `translateX(${sh}px) scale(${hot ? 1.1 : 1})`, boxShadow: hot ? `0 0 60px ${PINKA(0.6)}` : "none" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 110, color: "#fff", lineHeight: 1 }}>{k + 1}</div>
                  <div style={{ fontSize: 70 }}>{last && !open ? "❓" : ic}</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: last && !open ? GREY : "#fff" }}>{last && !open ? "???" : t}</div>
                </div>
              </In>
            );
          })}
          {fr >= dAnun && <div style={{ marginTop: 40 }}><Stamp fr={fr} d={dAnun} size={70} rot={-4}>anúncio pronto 🏷️</Stamp></div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: como funciona ----------
const Como = ({ fr }) => {
  const d0 = at(29), dDesc = at(30), dClica = at(34), dDig = at(35), dMenu = at(36), dPre = at(40), dForm = at(42), dJan = at(44), dParte = at(47), dTela = at(48), dMouse = at(51), dLiv = at(54);
  const prompt = "preenche a cotação com o PDF";
  const split = fr >= dJan;
  const sp = ease(lin(fr, dJan, dJan + 14));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <In fr={fr} d={d0}>
          <div style={{ width: 900, padding: "22px 30px", borderRadius: 30, background: WIN, border: `3px solid ${fr >= at(32) ? PINK : LINE}`, display: "flex", alignItems: "center", gap: 20, boxSizing: "border-box" }}>
            <Sparkle s={56} fr={fr} />
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: "#fff", flex: 1 }}>{typed(prompt, fr, dDesc, at(32) + 6)}{fr < at(33) && blink(fr)}</span>
            <span style={{ width: 64, height: 64, borderRadius: 32, background: fr >= at(32) + 6 ? PINK : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff" }}>↑</span>
          </div>
        </In>
        {fr >= dDesc + 6 && (
          <div style={{ position: "relative", width: 900, height: 820 }}>
            {/* tela principal do usuário (aparece na divisão) */}
            {split && (
              <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 820, borderRadius: 30, background: "rgba(255,255,255,0.03)", border: `3px dashed ${fr >= dTela ? GREEN : LINE}`, opacity: sp }}>
                <div style={{ position: "absolute", left: 40, top: 30, fontFamily: inter, fontWeight: 800, fontSize: 34, color: fr >= dTela ? GREEN : GREY }}>💻 sua tela</div>
                {fr >= dTela && <div style={{ position: "absolute", left: 40, top: 470, width: 820, display: "flex", flexDirection: "column", gap: 18 }}>
                  {["você continua trabalhando", "seu mouse é seu"].map((t, k) => fr >= (k ? dMouse : dTela) && <In key={t} fr={fr} d={k ? dMouse : dTela} dx={-100} dy={0}><Pill size={40} style={{ display: "inline-block" }}>{t} {fr >= dLiv - 2 ? "✓" : ""}</Pill></In>)}
                </div>}
                {fr >= dTela && <Cursor fr={fr} c={GREEN} s={1.6} click={dMouse + 6} x={300 + Math.sin(fr / 7) * 220} y={700 + Math.cos(fr / 9) * 60} />}
                {fr >= dLiv && <div style={{ position: "absolute", right: 30, bottom: 30 }}><Stamp fr={fr} d={dLiv} size={56} rot={-5} c={GREEN}>livre</Stamp></div>}
              </div>
            )}
            {/* janela à parte, em segundo plano */}
            <div style={{ position: "absolute", left: split ? interpolate(sp, [0, 1], [0, 330]) : 0, top: split ? interpolate(sp, [0, 1], [0, 90]) : 0, transform: `scale(${split ? interpolate(sp, [0, 1], [1, 0.62]) : pop(fr, dDesc + 6, 12)})`, transformOrigin: "0 0" }}>
              <Janela title={split ? "janela à parte · ● ao vivo" : "Gemini trabalhando…"} w={900} h={620} glow={fr >= dParte}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
                  <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                    <div style={{ padding: "14px 26px", borderRadius: 16, background: fr >= dClica + 6 ? PINK : "rgba(255,255,255,0.08)", fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", transform: `scale(${fr >= dClica + 6 && fr < dClica + 12 ? 0.92 : 1})` }}>Abrir PDF</div>
                    <div style={{ position: "relative" }}>
                      <div style={{ padding: "14px 26px", borderRadius: 16, background: "rgba(255,255,255,0.08)", border: `2px solid ${fr >= dMenu ? PINK : "transparent"}`, fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>Serviço ▾</div>
                      {fr >= dMenu + 3 && fr < dPre + 4 && <div style={{ position: "absolute", top: 76, left: 0, width: 260, borderRadius: 16, background: "#22183f", border: `2px solid ${PINK}`, zIndex: 3, overflow: "hidden", transform: `scaleY(${pop(fr, dMenu + 3, 12)})`, transformOrigin: "top" }}>
                        {["Econômico", "Expresso", "Agendado"].map((t, k) => <div key={t} style={{ padding: "12px 20px", fontFamily: inter, fontWeight: 800, fontSize: 28, color: "#fff", background: k === 1 && fr >= at(38) + 6 ? PINKA(0.5) : "transparent" }}>{t}</div>)}
                      </div>}
                    </div>
                  </div>
                  <Field w={840} label="destinatário" val={typed("Rua das Flores, 120", fr, dDig, dDig + 14)} ok={fr >= dDig + 16} hot={fr >= dDig} />
                  <div style={{ display: "flex", gap: 20 }}>
                    <Field w={260} label="peso" val={fr >= dPre ? typed("12 kg", fr, dPre, dPre + 6) : ""} ok={fr >= dPre + 8} hot={fr >= dPre} />
                    <Field w={260} label="caixas" val={fr >= dPre + 4 ? typed("3", fr, dPre + 4, dPre + 6) : ""} ok={fr >= dPre + 10} hot={fr >= dPre + 4} />
                    <Field w={280} label="serviço" val={fr >= at(38) + 8 ? "Expresso" : ""} ok={fr >= dForm} hot={fr >= dMenu} />
                  </div>
                  {fr >= dForm && <div style={{ alignSelf: "center", marginTop: 10 }}><Pill size={40}>{"✓ formulário preenchido"}</Pill></div>}
                  {!split && <Cursor fr={fr} click={[dClica + 6, dDig, dMenu + 3, at(38) + 6, dPre].filter((c) => fr >= c).pop()}
                    x={fr < dDig ? 120 : fr < dMenu ? 300 : fr < at(38) + 4 ? 420 : fr < dPre ? 400 : 160}
                    y={fr < dDig ? 40 : fr < dMenu ? 150 : fr < at(38) + 4 ? 40 : fr < dPre ? 150 : 280} />}
                </div>
              </Janela>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2: fotos em lote ----------
const HUES = [20, 200, 320, 90, 260, 40];
const Item1 = ({ fr }) => {
  const d0 = at(55), dFotos = at(57), dLote = at(59), dAcerta = at(61), dCor = at(63), dVar = at(65), dProg = at(69);
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="🎨" t="Fotos em lote" sub="no seu programa de design" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={dFotos}>
          <Janela title={fr >= dProg ? "editor de fotos · lote" : "fotos/"} w={920} h={700} glow={fr >= dProg}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
              {HUES.map((h, k) => {
                const d = (fr >= dLote ? dLote : dFotos) + k * 2;
                const done = fr >= dCor + k * 4;
                const scan = !done && fr >= dAcerta && fr >= dCor + (k - 1) * 4;
                return fr >= d && (
                  <In key={k} fr={fr} d={d} dy={30}>
                    <div style={{ width: 260, height: 190, borderRadius: 18, overflow: "hidden", position: "relative", border: `4px solid ${done ? GREEN : scan ? PINK : LINE}`,
                      background: `linear-gradient(160deg, hsl(${h},${done ? 75 : 8}%,${done ? 60 : 38}%), hsl(${h + 40},${done ? 80 : 6}%,${done ? 30 : 22}%))` }}>
                      <div style={{ position: "absolute", left: 30, bottom: 26, width: 90, height: 90, borderRadius: 45, background: `hsla(${h + 180},${done ? 70 : 5}%,${done ? 75 : 50}%,0.8)` }} />
                      {scan && <div style={{ position: "absolute", left: 0, right: 0, top: ((fr * 12) % 190), height: 6, background: PINK, boxShadow: `0 0 20px ${PINK}` }} />}
                      {done && <div style={{ position: "absolute", right: 12, top: 8, fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREEN }}>✓</div>}
                    </div>
                  </In>
                );
              })}
              {fr >= dVar && (
                <div style={{ width: 840, marginTop: 10, display: "flex", flexDirection: "column", gap: 14 }}>
                  {["cor", "exposição"].map((t, k) => <Bar key={t} label={t} lw={190} w={560} h={46} v={0.3 + 0.4 * ease(lin(fr, dVar + k * 4, dProg + k * 4)) + 0.05 * Math.sin(fr / 5 + k)} c={`linear-gradient(90deg,#a02c90,${PINK})`} />)}
                </div>
              )}
            </div>
          </Janela>
        </In>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: "#fff" }}>{Math.min(6, Math.max(0, Math.floor((fr - dCor) / 4) + 1))}<span style={{ color: GREY }}> / 6 fotos</span></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: formulário sem digitar ----------
const Item2 = ({ fr }) => {
  const d0 = at(72), dForm = at(74), dSem = at(75), dTira = at(78), dPeso = at(79), dMed = at(80), dEnd = at(82), dPdf = at(85), dPre = at(87), dCot = at(89), dFrete = at(91);
  const DATA = [["peso", "12 kg", dPeso], ["medidas", "40×30×25 cm", dMed], ["endereço", "Rua das Flores, 120", dEnd]];
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="📦" t="Formulário sem digitar" sub="dos seus PDFs pro frete" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <In fr={fr} d={d0 + 6} dx={-120} dy={0}>
            <div style={{ width: 330, height: 520, borderRadius: 24, background: "#f3eefc", padding: 24, boxSizing: "border-box", position: "relative", transform: `rotate(-2deg)` }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#3a2a66" }}>📄 pedido.pdf</div>
              {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ height: 14, borderRadius: 7, marginTop: 22, width: `${55 + (k * 29) % 40}%`, background: DATA.some(([, , d], j) => fr >= d && j * 3 + 1 === k) ? PINK : "rgba(58,42,102,0.25)" }} />)}
              {fr >= dTira && fr < dPre + 10 && <div style={{ position: "absolute", left: 0, right: 0, top: 60 + ((fr - dTira) * 14) % 440, height: 6, background: PINK, boxShadow: `0 0 24px ${PINK}` }} />}
              {fr >= dPdf && <div style={{ position: "absolute", bottom: 20, left: 24, right: 24, textAlign: "center" }}><Pill size={28} c="#3a2a66" bg="rgba(58,42,102,0.12)" style={{ border: "2px solid #3a2a66" }}>PDFs lidos ✓</Pill></div>}
            </div>
          </In>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 10 }}>
            {DATA.map(([t, v, d], k) => fr >= d && (
              <In key={t} fr={fr} d={d} dx={-160} dy={0}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderRadius: 20, background: PINKA(0.2), border: `3px solid ${PINK}`, width: 520, boxSizing: "border-box" }}>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: BODY, width: 150 }}>{t}</span>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }}>{v}</span>
                </div>
              </In>
            ))}
            {fr < dPeso && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: fr >= dSem ? RED : GREY, width: 520, textAlign: "center", marginTop: 60 }}>⌨️ {fr >= dSem ? "teclado: 0" : "…"}</div>}
          </div>
        </div>
        {fr >= dPre - 4 && (
          <In fr={fr} d={dPre - 4}>
            <Janela title="cotação de frete · 3 caixas" w={900} h={330} glow={fr >= dFrete}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                {DATA.map(([t, v], k) => <Field key={t} w={k === 2 ? 820 : 400} label={t} val={typed(v, fr, dPre + k * 5, dPre + k * 5 + 8)} ok={fr >= dCot + k * 3} hot={fr >= dPre + k * 5} />)}
              </div>
            </Janela>
          </In>
        )}
      </div>
      {fr >= dFrete && <div style={{ position: "absolute", top: 1140, left: 0, right: 0, textAlign: "center" }}><Stamp fr={fr} d={dFrete} size={70} rot={-4} c={GREEN}>cotação pronta</Stamp></div>}
    </AbsoluteFill>
  );
};

// ---------- 4: painel vira apresentação ----------
const REG = [["região A", 1284, BLUE], ["região B", 932, AMBER], ["região C", 2410, GREEN]];
const Item3 = ({ fr }) => {
  const d0 = at(92), dPainel = at(94), dVira = at(95), dPuxa = at(98), dNum = at(100), dMonta = at(105), dSlides = at(107), dGoogle = at(109);
  const fly = ease(lin(fr, dNum, dMonta));
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="📊" t="Painel vira apresentação" sub="direto no Google Slides" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={dPainel}>
          <Janela title="painel · ao vivo" w={920} h={360} glow={fr >= dPuxa && fr < dMonta}>
            <div style={{ display: "flex", gap: 20 }}>
              {REG.map(([t, v, c], k) => (
                <div key={t} style={{ flex: 1, height: 230, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `3px solid ${fr >= dPuxa + k * 3 ? c : LINE}`, padding: 18, boxSizing: "border-box", position: "relative" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, color: GREY }}>{t}</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, color: "#fff" }}>{count(fr, dPainel, dVira + 10, 0, v) + (fr > dVira + 10 ? Math.floor((fr % 30) / 10) : 0)}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, marginTop: 8 }}>{[0, 1, 2, 3, 4, 5].map((b) => <div key={b} style={{ flex: 1, height: 20 + 55 * Math.abs(Math.sin(fr / 9 + b + k)), background: c, borderRadius: 4 }} />)}</div>
                </div>
              ))}
            </div>
          </Janela>
        </In>
        <div style={{ position: "relative", width: 920, height: 520 }}>
          {fr >= dNum && fr < dMonta + 6 && REG.map(([t, v, c], k) => (
            <div key={t} style={{ position: "absolute", left: 90 + k * 290, top: -60 + fly * 260, transform: `scale(${1 - 0.4 * fly})`, fontFamily: MONO, fontWeight: 800, fontSize: 46, color: c, opacity: 1 - lin(fr, dMonta, dMonta + 6) }}>{v}</div>
          ))}
          {fr >= dVira && fr < dMonta && <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontSize: 90, transform: `translateY(${Math.sin(fr / 4) * 10}px)` }}>⬇️</div>}
          {fr >= dMonta && [0, 1, 2, 3].map((k) => {
            const d = dMonta + k * 4;
            return fr >= d && (
              <div key={k} style={{ position: "absolute", left: 120 + k * 50, top: 40 + k * 40, transform: `scale(${pop(fr, d, 11)}) rotate(${(k - 1.5) * 2}deg)` }}>
                <div style={{ width: 560, height: 315, borderRadius: 18, background: "#fbf8ff", border: `4px solid ${k === 3 ? PINK : "#d8ccf2"}`, padding: 26, boxSizing: "border-box", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#2a1f4d" }}>{["Resumo", "Região A", "Região B", "Região C"][k]}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 160, marginTop: 20 }}>{[0, 1, 2, 3].map((b) => <div key={b} style={{ flex: 1, height: 40 + ((b * 37 + k * 23) % 110), background: [BLUE, AMBER, GREEN, PINK][(b + k) % 4], borderRadius: 6 }} />)}</div>
                </div>
              </div>
            );
          })}
          {fr >= dGoogle && <div style={{ position: "absolute", right: 30, bottom: 0 }}><Stamp fr={fr} d={dGoogle} size={56} rot={-5}>slides prontos ✓</Stamp></div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: vender roupa usada ----------
const ROUPAS = [["👕", "camiseta", "R$ 35"], ["👖", "calça jeans", "R$ 60"], ["🧥", "jaqueta", "R$ 120"], ["👟", "tênis", "R$ 90"]];
const Item4 = ({ fr }) => {
  const d0 = at(111), dVend = at(113), dAnal = at(117), dPasta = at(121), dPesq = at(122), dPreco = at(124), dDeixa = at(126), dAnun = at(128), dPront = at(129);
  const listing = fr >= dAnun - 2;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="🏷️" t="Vender roupa usada" sub="anúncios prontos pra revisar" />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <In fr={fr} d={dVend}>
          <Janela title={listing ? "revenda · anúncios" : fr >= dPesq ? "pesquisando preço…" : "fotos/roupas"} w={920} h={780} glow={listing}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center" }}>
              {ROUPAS.map(([ic, t, p], k) => {
                const seen = fr >= dAnal + k * 4, priced = fr >= dPreco + k * 3;
                return (
                  <In key={t} fr={fr} d={dVend + 4 + k * 3} dy={40}>
                    <div style={{ width: 400, height: 320, borderRadius: 24, background: listing ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)", border: `3px solid ${listing && fr >= dAnun + k * 3 ? GREEN : seen ? PINK : LINE}`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <div style={{ fontSize: listing ? 100 : 130, transform: `rotate(${Math.sin(fr / 6 + k) * 4}deg)` }}>{ic}</div>
                      {seen && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff" }}>{t}</div>}
                      {fr >= dAnal + k * 4 - 6 && !seen && <div style={{ position: "absolute", left: 0, right: 0, top: ((fr * 16) % 320), height: 6, background: PINK, boxShadow: `0 0 20px ${PINK}` }} />}
                      {fr >= dPesq && !priced && seen && <div style={{ position: "absolute", top: 16, right: 16 }}><Spin fr={fr} /></div>}
                      {priced && <div style={{ position: "absolute", top: 14, right: 14, transform: `rotate(${8 + Math.sin(fr / 4 + k) * 6}deg) scale(${pop(fr, dPreco + k * 3, 8)})`, transformOrigin: "50% 0%" }}><Pill size={34} c="#fff" bg={PINKA(0.9)} style={{ border: `2px solid ${PINK}` }}>{p}</Pill></div>}
                      {listing && fr >= dAnun + k * 3 && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, color: GREEN }}>✓ anúncio pronto</div>}
                    </div>
                  </In>
                );
              })}
            </div>
          </Janela>
        </In>
      </div>
      {fr >= dPront + 6 && <div style={{ position: "absolute", top: 1160, left: 0, right: 0, textAlign: "center" }}><Stamp fr={fr} d={dPront + 6} size={64} rot={-4} c={GREEN}>você só revisa</Stamp></div>}
    </AbsoluteFill>
  );
};

// ---------- 6: quem manda é você ----------
const Controle = ({ fr }) => {
  const d0 = at(130), dManda = at(132), dApps = at(135), dAss = at(138), dPausa = at(141), dApr = at(145), dImp = at(148);
  const ROWS = [["🔐", "você escolhe os apps", dApps], ["👁", "assiste cada passo", dAss], ["⏸", "pausa quando quiser", dPausa], ["✅", "aprova o que importa", dApr]];
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={104} top={150} rot={-2}>quem manda é você</Big>
      {fr < dApps - 2 && <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center" }}><In fr={fr} d={d0 + 3}><div style={{ display: "flex", alignItems: "center", gap: 26, padding: "30px 50px", borderRadius: 40, background: WIN, border: `4px solid ${PINK}`, boxShadow: `0 0 60px ${PINKA(0.45)}`, transform: `rotate(${Math.sin(fr / 4) * 3}deg)` }}><span style={{ fontSize: 110 }}>🕹️</span><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>{fr >= dManda ? "você no controle" : "e o controle?"}</span></div></In></div>}
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {ROWS.map(([ic, t, d], k) => {
          const on = fr >= d + 6;
          return fr >= d - 2 && (
            <In key={t} fr={fr} d={d - 2} dx={-140} dy={0}>
              <div style={{ width: 880, display: "flex", alignItems: "center", gap: 22, padding: "20px 28px", borderRadius: 26, background: WIN, border: `3px solid ${on ? GREEN : LINE}`, boxSizing: "border-box" }}>
                <span style={{ fontSize: 52 }}>{ic}</span>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", flex: 1 }}>{t}</span>
                {k === 0 && <div style={{ display: "flex", gap: 10 }}>{["📁", "🎨", "🌐"].map((a, j) => <span key={a} style={{ fontSize: 40, padding: 6, borderRadius: 12, border: `3px solid ${fr >= d + 4 + j * 3 ? (j === 1 ? RED : GREEN) : LINE}`, opacity: fr >= d + 4 + j * 3 && j === 1 ? 0.4 : 1 }}>{a}</span>)}</div>}
                {k === 1 && <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: RED, opacity: fr % 20 < 12 ? 1 : 0.3 }}>● ao vivo</span>}
                {k === 2 && <span style={{ width: 120, height: 64, borderRadius: 32, background: on ? AMBER : "rgba(255,255,255,0.15)", position: "relative" }}><span style={{ position: "absolute", top: 6, left: on ? 62 : 6, width: 52, height: 52, borderRadius: 26, background: "#fff" }} /></span>}
                {k === 3 && <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: on ? GREEN : GREY }}>{on ? "✓" : "…"}</span>}
              </div>
            </In>
          );
        })}
        {fr >= dApr + 2 && (
          <In fr={fr} d={dApr + 2}>
            <div style={{ position: "relative", width: 640, padding: "26px 30px", borderRadius: 28, background: "#22183f", border: `3px solid ${PINK}`, boxShadow: `0 0 60px ${PINKA(0.45)}`, marginTop: 10 }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>Enviar a cotação?</div>
              <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
                <span style={{ padding: "12px 28px", borderRadius: 16, background: "rgba(255,255,255,0.1)", fontFamily: inter, fontWeight: 800, fontSize: 32, color: BODY }}>Cancelar</span>
                <span style={{ padding: "12px 28px", borderRadius: 16, background: fr >= dImp ? GREEN : PINK, fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", transform: `scale(${fr >= dImp && fr < dImp + 6 ? 0.9 : 1})` }}>{fr >= dImp ? "✓ Aprovado" : "Aprovar"}</span>
              </div>
              <Cursor fr={fr} click={dImp} x={interpolate(fr, [dApr + 2, dImp], [560, 360], clamp)} y={interpolate(fr, [dApr + 2, dImp], [30, 120], clamp)} />
            </div>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7: por enquanto ----------
const Requisitos = ({ fr }) => {
  const d0 = at(149), dIng = at(153), dEua = at(155), dMac = at(158), dChip = at(160), dPlan = at(165), dPagos = at(166);
  const ROWS = [["🗣️", "em inglês", "", dIng], ["🇺🇸", "nos EUA", "", dEua], ["💻", "Mac com chip Apple", "macOS 15 ou mais novo", dMac], ["💳", "planos pagos", "AI Plus, Pro e Ultra", dPlan]];
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={110} top={150} rot={2} bg={AMBER}>por enquanto…</Big>
      {fr < dIng - 3 && <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center" }}><In fr={fr} d={d0 + 3}><div style={{ display: "flex", alignItems: "center", gap: 26, padding: "30px 50px", borderRadius: 40, background: WIN, border: `4px solid ${AMBER}`, transform: `translateX(${shake(fr, d0 + 3, 12)}px)` }}><span style={{ fontSize: 100 }}>⚠️</span><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>tem condição</span></div></In></div>}
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {ROWS.map(([ic, t, sub, d], k) => fr >= d - 3 && (
          <In key={t} fr={fr} d={d - 3} dx={140} dy={0}>
            <div style={{ width: 880, display: "flex", alignItems: "center", gap: 24, padding: "20px 30px", borderRadius: 26, background: WIN, border: `3px solid ${fr >= d + 6 ? AMBER : LINE}`, boxSizing: "border-box" }}>
              <span style={{ fontSize: 56 }}>{ic}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff" }}>{t}</div>
                {sub && <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: BODY }}>{sub}</div>}
              </div>
              <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: AMBER, transform: `scale(${fr >= d + 6 ? pop(fr, d + 6, 9) : 0})` }}>!</span>
            </div>
          </In>
        ))}
        {fr >= dPagos + 4 && <In fr={fr} d={dPagos + 4}><div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 20, padding: "16px 34px", borderRadius: 40, border: `3px solid ${RED}`, background: "rgba(255,92,122,0.15)", transform: `translateX(${Math.sin(fr / 3) * 4}px)` }}><span style={{ fontSize: 50 }}>🇧🇷</span><span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff" }}>Brasil: ainda não</span></div></In>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(167), dPrim = at(171), dCom = at(172), dK = at(173), dSeg = at(176), dBr = at(182);
  const hl = fr < dCom ? Math.floor((fr - d0) / 6) % 4 : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 100, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>qual primeiro?</div></In>
        <div style={{ display: "flex", gap: 20 }}>
          {[["🎨", "fotos"], ["📦", "frete"], ["📊", "slides"], ["🏷️", "anúncios"]].map(([ic, t], k) => (
            <In key={t} fr={fr} d={d0 + 3 + k * 3}>
              <div style={{ width: 200, height: 220, borderRadius: 26, background: hl === k ? PINKA(0.25) : WIN, border: `4px solid ${hl === k ? PINK : LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, transform: `scale(${hl === k ? 1.08 : 1})` }}>
                <span style={{ fontSize: 70 }}>{ic}</span>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>{t}</span>
              </div>
            </In>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 16, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 7; if (fr < t0) return null; const q = ((fr - t0) % 42) / 40; return <div key={k} style={{ position: "absolute", left: 620 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "✨"}</div>; })}
          <div style={{ width: 780, display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : LINE}`, opacity: lin(fr, dPrim, dCom), boxSizing: "border-box" }}>
            <span style={{ fontSize: 54 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 62, color: "#fff" }}>{typed("MAC", fr, dK - 2, dK + 6)}{blink(fr)}</span>
            {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 54, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 44px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dCom, dCom + 6) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir @phanteraicreative"}</div>
          {fr >= at(178) && <In fr={fr} d={at(178)}><Pill size={40} c="#fff" bg={fr >= dBr ? "rgba(52,211,153,0.3)" : "rgba(122,92,255,0.25)"} style={{ border: `2px solid ${fr >= dBr ? GREEN : VIOLET}` }}>🔔 aviso quando chegar 🇧🇷</Pill></In>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Bloco = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translate(${(1 - pin) * 160 - pout * 160}px, 110px)` }}>{children}</AbsoluteFill>;
};

const Reacao = ({ fr, a, b, pose, top = 1150, left }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  const x = 10 - (1 - pin) * 420 - pout * 420;
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 300, ...(left ? { left: x } : { right: x }), top, zIndex: 8 }} />;
};

// ---------- legendas ----------
const KEY = new Set(["dezenas", "cliques", "nenhum", "gemini", "mac", "4", "usos", "ultimo", "anuncios", "venda", "descreve", "clica", "digita", "menus", "formulario", "janela", "parte", "livres", "fotos", "lote", "cor", "design", "digitar", "peso", "medidas", "endereco", "pdfs", "frete", "painel", "apresentacao", "numeros", "slides", "google", "roupa", "usada", "preco", "prontos", "manda", "voce", "apps", "passo", "pausa", "aprova", "importantes", "enquanto", "ingles", "unidos", "chip", "apple", "pagos", "primeiro", "segue", "brasil"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (n === "quatro") { push("4", k); continue; }
    toks.push({ t: x.w, s: x.s, e: x.e, key: n === "voce" ? k > 120 : undefined });
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
    <div style={{ position: "absolute", left: 50, right: 50, top: 1560, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, transform: `scale(${0.85 + 0.15 * p})`, zIndex: 9 }}>
      {chunk.map((w, i) => {
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[,!?:;…"]+$/g, "").replace(/\.$/, "");
        const key = w.key === undefined ? KEY.has(norm(shown)) && norm(shown) !== "voce" : w.key;
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortGeminiMac = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(29), at(55), at(72), at(92), at(111), at(130), at(149), at(167), end];
  const scenes = [Hook, Como, Item1, Item2, Item3, Item4, Controle, Requisitos, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(111)} b={at(118)} pose="apontando" top={1250} left />
      <Reacao fr={fr} a={at(173)} b={end} pose="comemorando" top={1250} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.17} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "error", 0.5, 15)}
      {S(at(7), "error", 0.45, 15)}
      {S(at(7) + 4, "coin", 0.35, 15)}
      {S(at(9), "whoosh", 0.8, 30)}
      {S(at(14), "pop", 0.4, 15)}
      {[0, 4, 8, 12].map((o) => S(at(18) + o, "pop", 0.32, 15))}
      {S(at(22), "error", 0.3, 15)}
      {S(at(26), "ding", 0.45, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {[at(34) + 6, at(35), at(36) + 3, at(40)].map((b) => S(b, "pop", 0.28, 15))}
      {[at(42), at(54), at(71), at(91), at(109), at(129), at(148)].map((b) => S(b, "ding", 0.38))}
      {[at(79), at(80), at(82)].map((b) => S(b, "pop", 0.3, 15))}
      {[0, 4, 8, 12].map((o) => S(at(105) + o, "pop", 0.28, 15))}
      {[0, 3, 6, 9].map((o) => S(at(124) + o, "coin", 0.25, 15))}
      {[at(153), at(155), at(158), at(165)].map((b) => S(b + 6, "pop", 0.3, 15))}
      {S(at(166) + 4, "error", 0.28, 15)}
      {S(at(173) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaGeminiMac = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Dezenas de cliques</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 118, color: "#fff", background: PINK, padding: "0 36px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 28 }}>e você: zero</div>
    </div>
    <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
      <Janela title="janela à parte · ● ao vivo" w={820} h={480} glow>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
          <Field w={760} label="destinatário" val="Rua das Flores, 120" ok />
          <div style={{ display: "flex", gap: 20 }}><Field w={370} label="peso" val="12 kg" ok /><Field w={370} label="caixas" val="3" ok /></div>
          <Cursor fr={0} x={520} y={150} s={1.6} />
        </div>
      </Janela>
      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 40px", borderRadius: 40, background: WIN, border: `3px solid ${PINK}` }}>
        <Sparkle s={70} />
        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff" }}>Gemini mexe no seu Mac</span>
      </div>
    </div>
  </AbsoluteFill>
);
