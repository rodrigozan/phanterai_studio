import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 22/11/2026 12:00 — "Uma conversa do Claude comanda todas as outras".
// Fatos conferidos na fonte primária (texto capturado em fontes/ em 22/11/2026):
// - code.claude.com/docs/en/desktop, "Work across sessions": Claude pode listar as outras sessões da aba Code,
//   ler o que cada uma fez e mandar mensagens entre elas, pedindo em linguagem natural ("what did the API session
//   conclude?", "tell the payments session the schema changed"); também renomear ou arquivar ("archive the sessions
//   whose PRs have merged"). Só vê sessões que o app roda (local, SSH, WSL); não vê nuvem, CLI no terminal nem VS Code;
//   por padrão as 20 mais recentes, sem as arquivadas. Mensagem chega como card com o título da sessão que mandou e
//   link de volta; se a sessão está no meio de uma tarefa, a mensagem espera ela terminar; a resposta volta.
//   Cartão de aprovação antes de arquivar, exceto nos modos Auto e Bypass.
// - code.claude.com/docs/en/changelog: limite de mensagens entre sessões subiu de 20 para 100.000 (não narrado).
// Tudo é interface recriada em motion no Remotion (genérica, estilo PhanterAI): nenhum print, nada gerado por IA,
// nenhum logo oficial. Nomes de sessão na tela (login, API, pagamentos...) são exemplos, como os da documentação.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SCC_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-22-1200-claude-comanda-conversas";
export const SCC_FPS = 30;
const FPS = SCC_FPS;
const f = (p) => staticFile(`${SCC_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const AMBER = "#fbbf24";
const BLUE = "#7ab8ff";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Daniel.mp3";
const TAIL = 0.9;

export const calculateClaudeComandaMetadata = async () => {
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
const blink = (fr) => <span style={{ opacity: fr % 16 < 8 ? 1 : 0, color: PINK }}>▍</span>;
const shake = (fr, d, amp = 14) => (fr >= d ? Math.sin(fr * 2.3) * amp * Math.exp(-(fr - d) / 8) : 0);
const bob = (fr, k = 0, a = 6) => Math.sin(fr / 14 + k) * a;
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
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${glow ? PINK : "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(glow ? 0.45 : 0.18)}`, overflow: "hidden", position: "relative", boxSizing: "border-box", ...style }}>
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
  <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 5 }}>
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

// status de sessão: pronto / rodando / esperando você / arquivada
const ST = {
  pronto: ["✓ pronto", GREEN],
  rodando: ["⏳ rodando", AMBER],
  esperando: ["✋ espera você", PINK],
  ocupada: ["⏳ ocupada", AMBER],
  mesclado: ["PR mesclado", "#b48cff"],
  aberto: ["PR aberto", BLUE],
};
const Spin = ({ fr, c = AMBER, s = 34 }) => (
  <div style={{ width: s, height: s, borderRadius: s, border: `5px solid rgba(255,255,255,0.15)`, borderTopColor: c, transform: `rotate(${fr * 18}deg)`, boxSizing: "border-box" }} />
);
const Row = ({ fr, title, st, glow, w = 840, icon = "💬", extra, style = {} }) => {
  const [lab, c] = ST[st] || ["", GREY];
  return (
    <div style={{ width: w, display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 22, background: glow ? PINKA(0.22) : "rgba(255,255,255,0.05)", border: `3px solid ${glow ? PINK : "rgba(190,160,255,0.2)"}`, boxSizing: "border-box", boxShadow: glow ? `0 0 40px ${PINKA(0.4)}` : "none", ...style }}>
      <div style={{ fontSize: 40 }}>{icon}</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {extra}
        {st === "rodando" || st === "ocupada" ? <Spin fr={fr} c={c} /> : null}
        {lab && <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: c, border: `2px solid ${c}`, borderRadius: 30, padding: "4px 16px", whiteSpace: "nowrap" }}>{lab}</span>}
      </div>
    </div>
  );
};

const Envelope = ({ fr, d, x0, x1, y, dur = 12, back }) => {
  if (fr < d || fr > d + dur + 4) return null;
  const q = ease(lin(fr, d, d + dur));
  const x = x0 + (x1 - x0) * q, yy = y - Math.sin(q * Math.PI) * 140;
  return <div style={{ position: "absolute", left: x, top: yy, fontSize: 90, zIndex: 7, transform: `rotate(${(back ? -1 : 1) * (q * 30 - 15)}deg)`, filter: `drop-shadow(0 0 20px ${PINKA(0.8)})` }}>✉️</div>;
};

// ---------- 0: gancho ----------
const HOOK_TABS = ["login", "API", "pagamentos", "landing", "docs", "e-mail", "FAQ", "testes", "deploy", "SEO", "vendas", "bugs"];
const Hook = ({ fr }) => {
  const dChat = at(5), dChat2 = at(7), dAgora = at(8), dClaude = at(12), dManda = at(13), dQuatro = at(18), dN4 = at(26), dNing = at(28);
  let big, bigD, size = 140, bg = RED, rot = -3;
  if (fr < dChat) { big = "perdendo tempo ⏳"; bigD = 0; size = 98; }
  else if (fr < dAgora) { big = "chat por chat 😩"; bigD = dChat; size = 108; rot = 2; }
  else if (fr < dManda) { big = "1 conversa"; bigD = dAgora; bg = PINK; rot = -2; }
  else if (fr < dQuatro) { big = "manda em todas 👑"; bigD = dManda; size = 100; bg = PINK; rot = 2; }
  else if (fr < dNing) { big = "4 coisas"; bigD = dQuatro; size = 150; bg = PINK; rot = -2; }
  else { big = "ninguém conta 🤫"; bigD = dNing; size = 100; bg = RED; rot = 2; }
  const flash = [dChat, dChat2, dAgora, dManda, dQuatro, dN4].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  const nTabs = Math.min(12, 2 + Math.floor(fr / 6));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={210} rot={rot} bg={bg}>{big}</Big>
      {fr < dAgora && (
        <div style={{ position: "absolute", top: 430, left: 0, right: 0, height: 900, transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)}) translateX(${shake(fr, dChat2, 22)}px)` }}>
          {/* contador de abas abertas + relógio correndo */}
          <div style={{ position: "absolute", top: 0, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 30px", borderRadius: 26, background: WIN, border: `3px solid ${fr >= dChat2 ? RED : "rgba(190,160,255,0.3)"}`, zIndex: 3 }}>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY }}>chats abertos</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 80, color: fr >= dChat2 ? RED : "#fff" }}>{nTabs}</span>
            <span style={{ fontSize: 64, display: "inline-block", transform: `rotate(${fr * 24}deg)` }}>⏱️</span>
          </div>
          {fr >= dChat && (
            <div style={{ position: "absolute", top: 1000, left: 0, right: 0, textAlign: "center", zIndex: 20 }}>
              <In fr={fr} d={dChat}><Pill size={46} c="#fff" bg="rgba(255,92,122,0.9)" style={{ border: `2px solid ${RED}`, transform: `scale(${1 + 0.05 * Math.sin(fr / 3)})` }}>⚠️ {Math.min(4, 1 + Math.floor((fr - dChat) / 6))} esperando você</Pill></In>
            </div>
          )}
          {HOOK_TABS.slice(0, nTabs).map((t, k) => {
            const d = k < 2 ? 0 : (k - 1) * 6;
            const p = k < 2 ? 1 : pop(fr, d, 11);
            const x = 70 + (k % 3) * 300 + (k % 2) * 20, y = 150 + Math.floor(k / 3) * 205 + (k % 3) * 16;
            return (
              <div key={t} style={{ position: "absolute", left: x, top: y, transform: `scale(${0.4 + 0.6 * p}) rotate(${(k % 2 ? 3 : -3) + Math.sin(fr / 6 + k) * 1.5}deg)`, opacity: Math.min(1, p * 1.5), zIndex: 2 + k }}>
                <div style={{ width: 300, height: 210, borderRadius: 22, background: WIN, border: `3px solid ${k === nTabs - 1 ? PINK : "rgba(190,160,255,0.35)"}`, boxShadow: "0 18px 40px rgba(0,0,0,0.6)", overflow: "hidden" }}>
                  <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderBottom: "2px solid rgba(190,160,255,0.15)" }}>
                    {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
                    <span style={{ fontFamily: MONO, fontSize: 22, color: BODY, marginLeft: 8 }}>{t}</span>
                  </div>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    {[0.9, 0.6, 0.75].map((wd, j) => <div key={j} style={{ width: `${wd * 100}%`, height: 16, borderRadius: 8, background: j === 1 ? PINKA(0.5) : "rgba(255,255,255,0.14)" }} />)}
                    {k % 3 === 1 && <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 24, color: AMBER }}>⏳ esperando…</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {fr >= dAgora && fr < dQuatro && (() => {
        const sats = ["login", "API", "pagamentos", "landing", "docs", "testes"];
        const cx = 540, cy = 860, R = 330;
        return (
          <div style={{ position: "absolute", inset: 0 }}>
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
              {sats.map((s, k) => {
                const a = (k / sats.length) * Math.PI * 2 + fr / 80;
                const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.8;
                const on = fr >= dManda + k * 2;
                const q = lin(fr, dAgora + k * 2, dAgora + 8 + k * 2);
                return <line key={s} x1={cx} y1={cy} x2={cx + (x - cx) * q} y2={cy + (y - cy) * q} stroke={on ? PINK : "rgba(190,160,255,0.45)"} strokeWidth={on ? 7 : 4} strokeDasharray="18 12" strokeDashoffset={-fr * 3} />;
              })}
            </svg>
            {sats.map((s, k) => {
              const a = (k / sats.length) * Math.PI * 2 + fr / 80;
              const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.8;
              const on = fr >= dManda + k * 2;
              return (
                <div key={s} style={{ position: "absolute", left: x - 120, top: y - 50, width: 240, transform: `scale(${pop(fr, dAgora + k * 2, 12)})` }}>
                  <div style={{ padding: "16px 10px", borderRadius: 20, background: WIN, border: `3px solid ${on ? GREEN : "rgba(190,160,255,0.35)"}`, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>
                    {on ? "✓ " : "💬 "}{s}
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: cx - 170, top: cy - 120, width: 340, height: 240, borderRadius: 34, background: "linear-gradient(145deg, #3a1d6e, #1a0d33)", border: `4px solid ${PINK}`, boxShadow: `0 0 ${60 + 30 * Math.sin(fr / 4)}px ${PINKA(0.6)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * pop(fr, dAgora, 10)})` }}>
              <div style={{ fontSize: 86 }}>👑</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>sessão chefe</div>
              {fr >= dClaude && <div style={{ fontFamily: MONO, fontSize: 26, color: BODY, marginTop: 6 }}>Claude · aba Code</div>}
            </div>
            {fr >= dManda + 4 && (
              <div style={{ position: "absolute", top: 1290, left: 0, right: 0, textAlign: "center" }}>
                <In fr={fr} d={dManda + 4}><Pill size={44} c="#fff" bg={PINKA(0.85)} style={{ border: `2px solid ${PINK}`, transform: `scale(${1 + 0.04 * Math.sin(fr / 4)})` }}>4 coisas · a nº 4 quase ninguém conta 🔒</Pill></In>
              </div>
            )}
          </div>
        );
      })()}
      {fr >= dQuatro && (
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 30, width: 1080, padding: "0 110px", boxSizing: "border-box" }}>
          {[["1", "📋", "ler"], ["2", "✉️", "recado"], ["3", "🗂️", "arquivar"], ["4", "🔒", "?"]].map(([n, ic, t], k) => {
            const q4 = k === 3 && fr >= dN4;
            return (
              <In key={k} fr={fr} d={dQuatro + k * 4} dy={80}>
                <div style={{ width: 380, height: 300, borderRadius: 30, background: q4 ? PINKA(0.25) : WIN, border: `4px solid ${q4 ? PINK : PINKA(0.45)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, transform: `translateX(${q4 ? shake(fr, dN4, 18) : 0}px) scale(${q4 ? 1 + 0.08 * pop(fr, dN4, 8) : 1}) translateY(${bob(fr, k, 5)}px)`, boxShadow: q4 ? `0 0 70px ${PINKA(0.6)}` : "none" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 76 }}>{k === 3 && fr < dN4 ? "❔" : ic}</div>
                  <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 40, color: BODY }}>{t}</div>
                </div>
              </In>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: como ligar ----------
const Ligar = ({ fr }) => {
  const d0 = at(30), dNao = at(32), dAtu = at(35), dAbre = at(42), dCode = at(45), dPede = at(47), dSess = at(52);
  let big, bigD, bg = PINK, rot = -2, size = 120;
  if (fr < dNao) { big = "como ligar? 🤔"; bigD = d0; }
  else if (fr < dAtu) { big = "sem botão 🚫"; bigD = dNao; bg = RED; rot = 2; }
  else if (fr < dAbre) { big = "atualiza ⬇️"; bigD = dAtu; }
  else if (fr < dPede) { big = "aba Code"; bigD = dAbre; rot = 2; }
  else { big = "em português 🇧🇷"; bigD = dPede; size = 104; }
  const bar = lin(fr, dAtu + 4, dAbre - 4);
  const steps = [
    ["Atualizar o app do Claude", fr >= dAbre - 4],
    ["Abrir a aba Code", fr >= dCode + 4],
    ["Pedir em qualquer sessão", fr >= dSess],
  ];
  const q = "qual sessão mexeu no login?";
  return (
    <AbsoluteFill>
      <Big fr={fr} d={bigD} size={size} top={210} rot={rot} bg={bg}>{big}</Big>
      {fr < dAtu ? (
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          {/* interruptor que não existe */}
          <In fr={fr} d={d0 + 2}>
            <div style={{ position: "relative", width: 420, height: 210, borderRadius: 105, background: "rgba(255,255,255,0.08)", border: `5px solid ${fr >= dNao ? RED : "rgba(190,160,255,0.4)"}`, transform: `translateX(${shake(fr, dNao, 20)}px)` }}>
              <div style={{ position: "absolute", top: 20, left: 20 + 210 * (0.5 + 0.5 * Math.sin(fr / 3)) * (fr < dNao ? 1 : 0), width: 160, height: 160, borderRadius: 80, background: fr >= dNao ? GREY : PINK }} />
              {fr >= dNao && <div style={{ position: "absolute", inset: -30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 230, color: RED, transform: `scale(${pop(fr, dNao, 8)})` }}>✕</div>}
            </div>
          </In>
          {fr >= dNao + 6 && <In fr={fr} d={dNao + 6}><Pill size={46} c="#fff" bg="rgba(255,255,255,0.08)" style={{ border: `2px solid ${PINK}` }}>já vem em toda sessão da aba Code</Pill></In>}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <In fr={fr} d={dAtu}>
            <Janela title="Claude · app no computador" w={920} h={420} glow={fr >= dCode}>
              {fr < dAbre ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 30 }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{bar < 1 ? "⬇️ Atualizando…" : "✓ Atualizado"}</div>
                  <div style={{ height: 40, borderRadius: 20, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ width: `${bar * 100}%`, height: "100%", borderRadius: 20, background: bar < 1 ? PINK : GREEN }} />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 56, color: bar < 1 ? "#fff" : GREEN, textAlign: "right" }}>{Math.round(bar * 100)}%</div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {["Home", "Code"].map((t, k) => {
                      const sel = k === 1 ? fr >= dCode : fr < dCode;
                      return <div key={t} style={{ flex: 1, textAlign: "center", padding: "20px 0", borderRadius: 20, fontFamily: inter, fontWeight: 800, fontSize: 46, color: sel ? "#fff" : GREY, background: sel ? PINK : "rgba(255,255,255,0.06)", transform: `scale(${k === 1 && fr >= dCode ? 1 + 0.08 * Math.max(0, 1 - (fr - dCode) / 8) : 1})` }}>{t}</div>;
                    })}
                  </div>
                  {fr >= dCode && (
                    <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 18, padding: "20px 24px", borderRadius: 22, border: `2px solid ${fr >= dPede ? PINK : "rgba(190,160,255,0.3)"}`, background: "rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 44 }}>💬</span>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap" }}>{typed(q, fr, dPede, dSess - 2)}{blink(fr)}</span>
                    </div>
                  )}
                  {fr < dCode && fr >= dAbre && (
                    // cursor indo até a aba Code
                    <div style={{ position: "absolute", left: 200 + 420 * ease(lin(fr, dAbre, dCode)), top: 160 - 80 * ease(lin(fr, dAbre, dCode)), fontSize: 70 }}>👆</div>
                  )}
                </div>
              )}
            </Janela>
          </In>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map(([t, ok], k) => (
              <In key={k} fr={fr} d={dAtu + 6 + k * 5} dx={-400} dy={0}>
                <div style={{ width: 920, display: "flex", alignItems: "center", gap: 22, padding: "18px 26px", borderRadius: 24, background: ok ? "rgba(52,211,153,0.14)" : WIN, border: `3px solid ${ok ? GREEN : "rgba(190,160,255,0.3)"}`, boxSizing: "border-box" }}>
                  <div style={{ width: 62, height: 62, borderRadius: 31, background: ok ? GREEN : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", transform: `scale(${ok ? 1 + 0.2 * Math.max(0, 1 - (fr - [dAbre - 4, dCode + 4, dSess][k]) / 8) : 1})` }}>{ok ? "✓" : k + 1}</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff" }}>{t}</div>
                </div>
              </In>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 2: listar e ler ----------
const SESS = [["refatorar login", "pronto", "🔐"], ["API", "pronto", "🧩"], ["pagamentos", "rodando", "💳"], ["landing page", "esperando", "🖼️"], ["docs", "rodando", "📄"]];
const Item1 = ({ fr }) => {
  const d0 = at(53), dLista = at(56), dLe = at(61), dPerg = at(67), dQ = at(68), dConc = at(76);
  const q = "o que a sessão da API concluiu?";
  const scan = fr >= dLe ? Math.floor((fr - dLe) / 5) : -1;
  const answered = fr >= dConc + 3;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="1" icon="📋" t="Lista e lê" sub="o que cada sessão fez" />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <In fr={fr} d={d0 + 4}>
          <Janela title="Code · sessões" w={920} h={fr >= dPerg ? 560 : 640} glow={answered}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SESS.slice(0, fr >= dPerg ? 4 : 5).map(([t, st, ic], k) => {
                const dd = dLista + k * 3;
                if (fr < dd && fr < d0 + 12) return null;
                const reading = scan === k && fr < dPerg;
                const read = scan > k || fr >= dPerg;
                const glow = reading || (answered && k === 1);
                return (
                  <In key={t} fr={fr} d={Math.min(dd, d0 + 10 + k * 3)} dx={300} dy={0}>
                    <Row fr={fr} title={t} st={st} icon={ic} w={860} glow={glow}
                      extra={read ? <span style={{ fontSize: 34 }}>📄</span> : reading ? <span style={{ fontFamily: MONO, fontSize: 26, color: PINK }}>lendo…</span> : null} />
                  </In>
                );
              })}
            </div>
          </Janela>
        </In>
        {fr >= dPerg && (
          <In fr={fr} d={dPerg}>
            <div style={{ width: 920, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ alignSelf: "flex-end", maxWidth: 820, padding: "20px 28px", borderRadius: "28px 28px 6px 28px", background: PINK, fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff" }}>{typed(q, fr, dQ, dConc + 1)}{fr < dConc + 2 && blink(fr)}</div>
              {answered && (
                <In fr={fr} d={dConc + 3}>
                  <div style={{ maxWidth: 840, padding: "20px 28px", borderRadius: "28px 28px 28px 6px", background: WIN, border: `2px solid ${GREEN}`, fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>
                    🧩 Sessão <span style={{ color: GREEN }}>API</span>: terminou ✓ e deixou o resumo
                  </div>
                </In>
              )}
            </div>
          </In>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: recado entre sessões ----------
const Item2 = ({ fr }) => {
  const d0 = at(77), dRec = at(79), dAvisa = at(82), dMudou = at(90), dOcup = at(91), dEsp = at(98), dTerm = at(100), dE = at(101), dResp = at(103), dVoce = at(106);
  const msg = "o banco mudou!";
  const sent = fr >= dMudou;
  const prog = lin(fr, dOcup, dTerm + 2);
  const done = fr >= dTerm + 2;
  const delivered = fr >= dE;
  const replied = fr >= dResp + 14;
  const Win = ({ t, ic, glow, children, x }) => (
    <div style={{ position: "absolute", left: x, top: 420, width: 440, height: 820, borderRadius: 30, background: WIN, border: `3px solid ${glow ? PINK : "rgba(190,160,255,0.3)"}`, boxShadow: glow ? `0 0 60px ${PINKA(0.45)}` : "0 20px 60px rgba(0,0,0,0.5)", padding: 24, boxSizing: "border-box", transform: `translateY(${bob(fr, x, 4)}px)` }}>
      <div style={{ fontSize: 70, textAlign: "center" }}>{ic}</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", textAlign: "center", marginBottom: 20 }}>{t}</div>
      {children}
    </div>
  );
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="2" icon="✉️" t="Recado entre sessões" sub="e a resposta volta" />
      <In fr={fr} d={Math.min(dRec, d0 + 6)}>
        <div style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
          <Win t="chefe" ic="👑" x={60} glow={fr >= dAvisa && fr < dMudou + 4 || replied}>
            {fr >= dAvisa && (
              <div style={{ padding: "18px 20px", borderRadius: 22, background: PINK, fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>
                avisa <b>pagamentos</b>: {typed(msg, fr, dAvisa + 4, dMudou)}{!sent && blink(fr)}
              </div>
            )}
            {sent && <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 26, color: GREEN }}>✓ enviado</div>}
            {replied && (
              <In fr={fr} d={dResp + 14}>
                <div style={{ marginTop: 22, padding: "18px 20px", borderRadius: 22, background: "rgba(52,211,153,0.14)", border: `2px solid ${GREEN}`, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff" }}>
                  ↩ <span style={{ color: GREEN }}>pagamentos</span>: entendido, já ajustei ✓
                </div>
              </In>
            )}
            {fr >= dVoce && <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center" }}><In fr={fr} d={dVoce}><Pill size={36}>resposta pra você ✓</Pill></In></div>}
          </Win>
          <Win t="pagamentos" ic="💳" x={580} glow={delivered && !replied}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: inter, fontWeight: 800, fontSize: 32, color: done ? GREEN : AMBER }}>
              {done ? "✓ terminou" : <><Spin fr={fr} /> {fr >= dOcup ? "ocupada" : "rodando"}</>}
            </div>
            <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,0.08)", marginTop: 16 }}>
              <div style={{ width: `${(fr >= dOcup ? 0.35 + 0.65 * prog : 0.2 + 0.15 * lin(fr, dRec, dOcup)) * 100}%`, height: "100%", borderRadius: 13, background: done ? GREEN : AMBER }} />
            </div>
            {sent && !delivered && fr >= dMudou + 12 && (
              <In fr={fr} d={dMudou + 12}>
                <div style={{ marginTop: 26, padding: "16px 18px", borderRadius: 20, border: `2px dashed ${PINK}`, fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", transform: `scale(${fr >= dEsp ? 1 + 0.04 * Math.sin(fr / 3) : 1})` }}>📥 na fila: {fr >= dEsp ? "espera terminar" : "1 recado"}</div>
              </In>
            )}
            {delivered && (
              <In fr={fr} d={dE}>
                <div style={{ marginTop: 26, padding: "16px 18px", borderRadius: 20, background: PINKA(0.2), border: `2px solid ${PINK}` }}>
                  <div style={{ fontFamily: MONO, fontSize: 24, color: PINK }}>✉️ de: 👑 chefe ↗</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", marginTop: 6 }}>o banco mudou!</div>
                </div>
              </In>
            )}
          </Win>
          <Envelope fr={fr} d={dMudou} x0={220} x1={760} y={900} />
          <Envelope fr={fr} d={dResp} x0={760} x1={220} y={1000} back />
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ---------- 4: renomear e arquivar ----------
const Item3 = ({ fr }) => {
  const d0 = at(107), dRen = at(109), dArq = at(112), dMes = at(121);
  const rows = [["refatorar login", "mesclado", "🔐"], ["API", "mesclado", "🧩"], ["pagamentos", "aberto", "💳"], ["", "mesclado", "🖼️"], ["docs", "aberto", "📄"]];
  const merged = [0, 1, 3];
  const oldName = "sessão sem nome", newName = "landing page";
  const name4 = fr < dRen ? oldName : fr < dRen + 10 ? oldName.slice(0, Math.max(0, oldName.length - Math.round((fr - dRen) * 1.6))) : typed(newName, fr, dRen + 10, dArq - 4);
  const archivedAt = (k) => dArq + 6 + merged.indexOf(k) * 6;
  const nArch = merged.filter((k) => fr >= archivedAt(k) + 10).length;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="3" icon="🗂️" t="Renomeia e arquiva" sub="as sessões com PR mesclado" />
      <div style={{ position: "absolute", top: 410, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {rows.map(([t, st, ic], k) => {
          const isM = merged.includes(k);
          const a = isM ? archivedAt(k) : 1e9;
          const q = ease(lin(fr, a, a + 10));
          const renaming = k === 3 && fr >= dRen && fr < dArq;
          return (
            <In key={k} fr={fr} d={d0 + 3 + k * 2} dx={300} dy={0}>
              <div style={{ transform: `translate(${q * 120}px, ${q * (1180 - (410 + k * 120))}px) scale(${1 - 0.6 * q})`, opacity: 1 - 0.7 * q }}>
                <Row fr={fr} title={k === 3 ? <span>{name4}{renaming && blink(fr)}</span> : t} st={st} icon={ic} w={900} glow={renaming || (fr >= dArq && isM && q < 1)}
                  extra={k === 3 && renaming ? <span style={{ fontSize: 34 }}>✏️</span> : null} />
              </div>
            </In>
          );
        })}
        <div style={{ position: "absolute", top: 740, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <In fr={fr} d={dArq}>
            <div style={{ width: 620, height: 230, borderRadius: 34, background: WIN, border: `4px solid ${fr >= dMes ? GREEN : PINK}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, boxShadow: `0 0 60px ${PINKA(0.4)}`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - (fr - (archivedAt(merged[Math.max(0, nArch - 1)]) + 10)) / 6)})` }}>
              <span style={{ fontSize: 110 }}>📦</span>
              <div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>Arquivadas</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 90, color: fr >= dMes ? GREEN : PINK }}>{nArch}</div>
              </div>
            </div>
          </In>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: as travas ----------
const Item4 = ({ fr }) => {
  const d0 = at(122), dNo = at(126), dManual = at(128), dPede = at(130), dArq = at(135), dCada = at(137), dNome = at(142);
  const modes = ["Manual", "Auto", "Bypass"];
  const selM = fr >= dManual ? 0 : Math.floor((fr - dNo) / 5) % 3;
  const cx = interpolate(fr, [dPede + 4, dArq - 2], [880, 330], clamp), cy = interpolate(fr, [dPede + 4, dArq - 2], [1150, 800], clamp);
  const clicked = fr >= dArq;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={d0} n="4" icon="🔒" t="As travas" sub="o que quase ninguém conta" />
      <div style={{ position: "absolute", top: 410, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {fr < dCada ? (
          <>
            {fr >= dNo && (
              <In fr={fr} d={dNo}>
                <div style={{ display: "flex", gap: 16, padding: 14, borderRadius: 30, background: WIN, border: "2px solid rgba(190,160,255,0.3)" }}>
                  {modes.map((m, k) => <div key={m} style={{ width: 270, textAlign: "center", padding: "22px 0", borderRadius: 22, fontFamily: inter, fontWeight: 800, fontSize: 44, color: k === selM ? "#fff" : GREY, background: k === selM ? (k === 0 ? PINK : "rgba(255,255,255,0.15)") : "transparent", transform: `scale(${k === 0 && fr >= dManual ? 1 + 0.1 * Math.max(0, 1 - (fr - dManual) / 8) : 1})` }}>{m}</div>)}
                </div>
              </In>
            )}
            {fr < dNo && <In fr={fr} d={d0 + 4}><div style={{ fontSize: 260, transform: `rotate(${Math.sin(fr / 4) * 8}deg)` }}>🔒</div></In>}
            {fr >= dPede && (
              <In fr={fr} d={dPede}>
                <div style={{ width: 900, padding: "30px 34px", borderRadius: 30, background: WIN, border: `3px solid ${clicked ? GREEN : AMBER}`, boxSizing: "border-box", boxShadow: `0 0 60px ${clicked ? "rgba(52,211,153,0.35)" : "rgba(251,191,36,0.3)"}`, transform: `translateX(${fr < dArq ? shake(fr, dPede + 2, 10) : 0}px)` }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: AMBER }}>✋ Pedido de aprovação</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", marginTop: 12 }}>Arquivar “landing page”?</div>
                  <div style={{ display: "flex", gap: 20, marginTop: 26 }}>
                    <div style={{ flex: 1, textAlign: "center", padding: "20px 0", borderRadius: 20, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: clicked ? GREEN : PINK, transform: `scale(${clicked ? 1 + 0.1 * Math.max(0, 1 - (fr - dArq) / 6) : 1})` }}>{clicked ? "✓ Aprovado" : "Permitir"}</div>
                    <div style={{ flex: 1, textAlign: "center", padding: "20px 0", borderRadius: 20, fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREY, background: "rgba(255,255,255,0.08)" }}>Negar</div>
                  </div>
                </div>
              </In>
            )}
            {fr >= dPede + 4 && <div style={{ position: "absolute", left: cx, top: cy - 410, fontSize: 80, zIndex: 8, transform: `scale(${clicked && fr < dArq + 5 ? 0.85 : 1})` }}>👆</div>}
          </>
        ) : (
          <>
            <In fr={fr} d={dCada}>
              <Janela title="pagamentos · mensagem recebida" w={920} h={480} glow={fr >= dNome}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 22, background: fr >= dNome ? PINK : PINKA(0.2), border: `3px solid ${PINK}`, transform: `scale(${fr >= dNome ? 1 + 0.06 * Math.max(0, 1 - (fr - dNome) / 8) : 1})` }}>
                  <span style={{ fontSize: 50 }}>👑</span>
                  <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff" }}>de: sessão chefe</span>
                  <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 30, color: "#fff" }}>↗ abrir</span>
                </div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", marginTop: 28 }}>“o banco mudou!”</div>
                <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
                  {fr >= dCada + 18 && <In fr={fr} d={dCada + 18}><Pill size={32} c={BLUE} bg="rgba(122,184,255,0.12)">remetente à vista</Pill></In>}
                  {fr >= dNome + 6 && <In fr={fr} d={dNome + 6}><Pill size={32}>sem recado anônimo ✓</Pill></In>}
                </div>
              </Janela>
            </In>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6: o que ela enxerga ----------
const Limites = ({ fr }) => {
  const d0 = at(146), dVinte = at(149), dRec = at(151), dAs = at(155), dNuvem = at(157), dTerm = at(161), dFora = at(164);
  const lit = Math.min(20, Math.max(0, Math.floor((fr - dVinte) / 1.2)));
  const out = [["☁️", "nuvem", dNuvem], [">_", "terminal", dTerm]];
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} size={110} top={210} rot={-2}>{fr < dAs ? "ela enxerga 👀" : "fica de fora 🚫"}</Big>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {fr < dAs ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 18 }}>
              {Array.from({ length: 20 }, (_, k) => {
                const on = k < lit;
                return <div key={k} style={{ height: 110, borderRadius: 20, background: on ? PINKA(0.35) : "rgba(255,255,255,0.05)", border: `3px solid ${on ? PINK : "rgba(190,160,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, transform: `scale(${on ? 1 + 0.15 * Math.max(0, 1 - (fr - dVinte - k * 1.2) / 6) : 0.9 + 0.1 * pop(fr, d0 + (k % 5), 12)})` }}>{on ? "💬" : ""}</div>;
              })}
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 130, color: "#fff", lineHeight: 1 }}>{lit}<span style={{ fontSize: 60, color: GREY }}> sessões</span></div>
            {fr >= dRec && <In fr={fr} d={dRec}><Pill size={44} c="#fff" bg={PINKA(0.8)} style={{ border: `2px solid ${PINK}` }}>as mais recentes do app</Pill></In>}
          </>
        ) : (
          <>
            <In fr={fr} d={dAs}><Row fr={fr} title="app no computador" st="" icon="🖥️" w={900} glow extra={<span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: GREEN }}>✓ vê</span>} /></In>
            {out.map(([ic, t, d], k) => {
              const q = ease(lin(fr, dFora, dFora + 10));
              return (
                <In key={t} fr={fr} d={d - 4} dx={400} dy={0}>
                  <div style={{ transform: `translateX(${q * (k ? -60 : 60)}px) rotate(${q * (k ? -4 : 4)}deg)`, opacity: 1 - 0.5 * q, position: "relative" }}>
                    <div style={{ width: 900, display: "flex", alignItems: "center", gap: 22, padding: "26px 30px", borderRadius: 26, background: "rgba(255,92,122,0.12)", border: `3px solid ${RED}`, boxSizing: "border-box" }}>
                      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: "#fff", width: 90, textAlign: "center" }}>{ic}</span>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>sessões do {t}</span>
                      <span style={{ marginLeft: "auto", fontSize: 70, color: RED, transform: `scale(${pop(fr, d + 2, 8)})`, fontFamily: inter, fontWeight: 800 }}>✕</span>
                    </div>
                  </div>
                </In>
              );
            })}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(165), dCom = at(170), dK = at(171), dSeg = at(174);
  const n = Math.floor(interpolate(fr, [d0, dCom], [3, 27], clamp));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <In fr={fr} d={d0}><div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 96, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(fr / 5)})` }}>quantas abertas?</div></In>
        <In fr={fr} d={d0 + 4}>
          <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "24px 40px", borderRadius: 30, background: WIN, border: `3px solid ${PINKA(0.6)}` }}>
            <span style={{ fontSize: 80 }}>💬</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 130, color: "#fff" }}>{n}</span>
            <span style={{ fontSize: 80, display: "inline-block", transform: `rotate(${fr * 12}deg)` }}>🌀</span>
          </div>
        </In>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", marginTop: 20, position: "relative" }}>
          {fr >= dK + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dK + 8 + k * 5; if (fr < t0) return null; const q = (fr - t0) / 40; return <div key={k} style={{ position: "absolute", left: 600 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "👑"}</div>; })}
          <div style={{ width: 760, display: "flex", alignItems: "center", gap: 18, padding: "22px 28px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dK ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dCom - 6, dCom), boxSizing: "border-box" }}>
            <span style={{ fontSize: 50 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 56, color: "#fff" }}>{typed("CHEFE", fr, dK - 2, dK + 8)}{blink(fr)}</span>
            {fr >= dK + 10 && <span style={{ marginLeft: "auto", fontSize: 50, transform: `scale(${pop(fr, dK + 10, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff", background: fr >= dSeg + 2 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 40px", borderRadius: 20, transform: `scale(${fr >= dSeg + 2 ? pop(fr, dSeg + 2, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dCom, dCom + 6) }}>{fr >= dSeg + 2 ? "✓ Seguindo" : "Seguir"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Bloco = ({ fr, a, b, children, first }) => {
  if (fr < a - 2 || fr > b + 10) return null;
  const pin = first ? 1 : ease(lin(fr, a - 2, a + 8)), pout = ease(lin(fr, b, b + 10));
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 160}px)` }}>{children}</AbsoluteFill>;
};

const Reacao = ({ fr, a, b, pose, top = 1150, left }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  const x = 10 - (1 - pin) * 420 - pout * 420;
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 300, ...(left ? { left: x } : { right: x }), top, zIndex: 8 }} />;
};

// ---------- legendas ----------
const KEY = new Set(["perdendo", "tempo", "chat", "conversa", "claude", "manda", "todas", "4", "ninguem", "ligar", "botao", "atualiza", "code", "portugues", "1", "lista", "le", "api", "concluiu", "2", "recado", "pagamentos", "banco", "mudou", "ocupada", "espera", "resposta", "3", "renomear", "arquivar", "arquiva", "pr", "mesclado", "travas", "manual", "aprovacao", "nome", "20", "recentes", "nuvem", "terminal", "fora", "quantas", "chefe", "segue"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUMS = { um: "1", dois: "2", tres: "3", quatro: "4", vinte: "20" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  const nn = (k) => (words[k] ? norm(words[k].w) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const push = (t, j, key = true) => { toks.push({ t: t + tail(words[j]), s: x.s, e: words[j].e, key }); k = j; };
    if (n === "a" && nn(k + 1) === "p" && nn(k + 2) === "i") { push("API", k + 2); continue; }
    if (n === "p" && nn(k + 1) === "r") { push("PR", k + 1); continue; }
    if (n === "numero" && NUMS[nn(k + 1)]) { push("Nº " + NUMS[nn(k + 1)], k + 1); continue; }
    if (NUMS[n] && n !== "um") { push(NUMS[n], k); continue; }
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
    <div style={{ position: "absolute", left: 50, right: 50, top: 1560, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, transform: `scale(${0.85 + 0.15 * p})`, zIndex: 9 }}>
      {chunk.map((w, i) => {
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[,!?:;…"]+$/g, "").replace(/\.$/, "");
        const key = w.key || KEY.has(norm(shown));
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortClaudeComanda = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(30), at(53), at(77), at(107), at(122), at(146), at(165), end];
  const scenes = [Hook, Ligar, Item1, Item2, Item3, Item4, Limites, CTA];
  const chunks = buildChunks(words);
  const S = (from, src, v, d = 20) => <Sequence key={src + from} from={Math.max(0, from)} durationInFrames={d}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((Sc, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><Sc fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1250} />
      <Reacao fr={fr} a={at(122)} b={at(130)} pose="apontando" top={1230} left />
      <Reacao fr={fr} a={at(171)} b={end} pose="comemorando" top={1180} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      {S(0, "whoosh", 1, 30)}
      {S(0, "riser", 0.35)}
      {S(at(5), "pop", 0.7)}
      {S(at(7), "error", 0.45, 15)}
      {S(at(8), "whoosh", 0.8, 30)}
      {S(at(13), "ding", 0.5, 15)}
      {S(at(18), "whoosh", 0.6, 30)}
      {S(at(26), "pop", 0.5)}
      {S(at(32), "error", 0.35, 15)}
      {B.slice(1, -1).map((b) => S(b - 4, "whoosh", 0.3))}
      {[at(56), at(57), at(58), at(59), at(76) + 3, at(126), at(130), at(149)].map((b) => S(b, "pop", 0.28, 15))}
      {[at(41), at(45), at(52), at(100) + 2, at(121), at(135), at(142)].map((b) => S(b, "ding", 0.32))}
      {[at(90), at(103)].map((b) => S(b, "whoosh", 0.45))}
      {[at(115), at(117), at(119)].map((b) => S(b, "coin", 0.2, 15))}
      {[at(157), at(161)].map((b) => S(b, "error", 0.3, 15))}
      {S(at(171) + 4, "ding", 0.45)}
    </AbsoluteFill>
  );
};

export const CapaClaudeComanda = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff", background: RED, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)" }}>Perdendo tempo</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, letterSpacing: -2, marginTop: 24 }}>chat por chat?</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 54, color: BODY, marginTop: 30 }}>1 conversa do Claude manda em todas</div>
    </div>
    <div style={{ position: "absolute", top: 860, left: 0, right: 0, height: 700 }}>
      <svg width={1080} height={700} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3, 4, 5].map((k) => { const a = (k / 6) * Math.PI * 2; return <line key={k} x1={540} y1={350} x2={540 + Math.cos(a) * 340} y2={350 + Math.sin(a) * 260} stroke={PINK} strokeWidth={7} strokeDasharray="18 12" />; })}
      </svg>
      {["login", "API", "pagamentos", "landing", "docs", "testes"].map((s, k) => {
        const a = (k / 6) * Math.PI * 2;
        return <div key={s} style={{ position: "absolute", left: 540 + Math.cos(a) * 340 - 120, top: 350 + Math.sin(a) * 260 - 40, width: 240, padding: "14px 0", borderRadius: 20, background: WIN, border: `3px solid ${GREEN}`, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>✓ {s}</div>;
      })}
      <div style={{ position: "absolute", left: 370, top: 230, width: 340, height: 240, borderRadius: 34, background: "linear-gradient(145deg, #3a1d6e, #1a0d33)", border: `4px solid ${PINK}`, boxShadow: `0 0 80px ${PINKA(0.6)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 90 }}>👑</div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>sessão chefe</div>
      </div>
    </div>
  </AbsoluteFill>
);
