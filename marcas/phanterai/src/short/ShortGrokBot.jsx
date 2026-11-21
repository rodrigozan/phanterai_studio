import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 21/11/2026 18:00 — "3 prompts para configurar seu primeiro Grok Bot".
// Fatos conferidos na documentação oficial (capturada em fontes/ em 21/11/2026):
// - docs.x.ai/grok-bot/bots: "In your first message, give the Bot its job, sources, and approval boundaries,
//   and ask it to remember them. Send a real first task with a clear finish line".
// - docs.x.ai/grok-bot/get-started: app em macOS, Windows, Linux (+ iPhone/Android); Bots num cloud computer;
//   "When an action needs your OK, the Bot shows an approval card and waits"; passo 5 "Make it a routine":
//   quando o resultado está certo, peça para fazer num horário. Starter prompt "Inbox manager":
//   "Sort my unread email into urgent, needs a reply, and FYI. Draft replies to the urgent ones and don't send anything."
// - docs.x.ai/grok-bot/skills-routines-and-automations: exemplo de rotina "Every weekday at 8:00 AM ...".
// - docs.x.ai/grok-bot/bots "Edit a Bot": regra duradoura "From now on, never send external messages without approval".
// Tudo é interface recriada em motion no Remotion (genérica, no estilo PhanterAI): nenhum print, nada gerado por IA.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const SGB_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-21-1800-3-prompts-grok-bot";
export const SGB_FPS = 30;
const FPS = SGB_FPS;
const f = (p) => staticFile(`${SGB_SLUG}/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const PINK = "rgb(222,64,200)";
const PINKA = (a) => `rgba(222,64,200,${a})`;
const BODY = "rgb(205,202,222)";
const GREY = "rgb(140,136,170)";
const GREEN = "#34D399";
const RED = "#ff5c7a";
const AMBER = "#fbbf24";
const WIN = "rgba(20,14,40,0.94)";
const MUSIC = "phanterai/music/Daniel.mp3";
const TAIL = 0.8;

export const calculateGrokBotMetadata = async () => {
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
  <div style={{ width: w, height: h, borderRadius: 30, background: WIN, border: `2px solid ${glow ? PINK : "rgba(190,160,255,0.28)"}`, boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${PINKA(glow ? 0.45 : 0.18)}`, overflow: "hidden", position: "relative", ...style }}>
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

// Ícone do app (genérico, desenhado aqui; não é o logo oficial).
const AppIcon = ({ size = 220, fr, on = 1 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: "linear-gradient(145deg, #2b1d55, #120b26)", border: `4px solid ${PINKA(0.4 + 0.5 * on)}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${50 + 40 * on}px ${PINKA(0.35 * on + 0.1)}`, position: "relative" }}>
    <div style={{ fontSize: size * 0.52, transform: `rotate(${Math.sin(fr / 9) * 4}deg)` }}>🤖</div>
    <div style={{ position: "absolute", right: -10, top: -10, width: size * 0.2, height: size * 0.2, borderRadius: "50%", background: GREEN, border: "4px solid #120b26", opacity: on }} />
  </div>
);

// Bolha de mensagem do usuário com texto digitado.
const Bolha = ({ fr, txt, a, b, w = 860, size = 36, hi = [] }) => {
  const shown = typed(txt, fr, a, b);
  let parts = [shown];
  hi.forEach((h) => {
    parts = parts.flatMap((p) => (typeof p !== "string" ? [p] : p.split(new RegExp(`(${h})`)).map((s) => (s === h ? { h: s } : s))));
  });
  return (
    <div style={{ width: w, marginLeft: "auto", background: PINKA(0.2), border: `2px solid ${PINKA(0.7)}`, borderRadius: "30px 30px 6px 30px", padding: "22px 28px", fontFamily: inter, fontWeight: 400, fontSize: size, color: "#fff", lineHeight: 1.32, boxSizing: "border-box", minHeight: 90 }}>
      {parts.map((p, i) => (typeof p === "string" ? <span key={i}>{p}</span> : <span key={i} style={{ fontWeight: 800, color: "#fff", background: PINKA(0.85), borderRadius: 8, padding: "0 6px" }}>{p.h}</span>))}
      {fr < b + 6 && blink(fr)}
    </div>
  );
};

const Check = ({ fr, d, children, size = 40 }) => {
  const on = fr >= d;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: inter, fontWeight: 800, fontSize: size, color: on ? "#fff" : GREY, transform: `scale(${on ? 0.92 + 0.08 * pop(fr, d, 9) : 1})`, transformOrigin: "left center" }}>
      <div style={{ width: size * 1.25, height: size * 1.25, borderRadius: 12, border: `3px solid ${on ? GREEN : GREY}`, background: on ? "rgba(52,211,153,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN, fontSize: size }}>{on ? "✓" : ""}</div>
      {children}
    </div>
  );
};

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

// ---------- inbox (gancho e item 2) ----------
const MAILS = [
  { de: "Cliente", as: "Proposta vence hoje", col: 0 },
  { de: "Banco", as: "Fatura de novembro", col: 2 },
  { de: "Equipe", as: "Revisar o roteiro?", col: 1 },
  { de: "Newsletter", as: "As novidades da semana", col: 2 },
  { de: "Fornecedor", as: "Pedido atrasado", col: 0 },
  { de: "Parceiro", as: "Reunião na terça?", col: 1 },
  { de: "Loja", as: "Seu pedido saiu", col: 2 },
  { de: "Sócio", as: "Contrato assinado?", col: 1 },
];
const COLS = [
  { t: "Urgente", c: RED, i: "🔥" },
  { t: "Responder", c: AMBER, i: "↩️" },
  { t: "Informativo", c: "#7ab8ff", i: "ℹ️" },
];
const MailRow = ({ m, w = 300, small }) => (
  <div style={{ width: w, padding: small ? "10px 14px" : "14px 18px", borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(190,160,255,0.2)", boxSizing: "border-box" }}>
    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: small ? 22 : 26, color: "#fff" }}>✉️ {m.de}</div>
    <div style={{ fontFamily: inter, fontSize: small ? 20 : 23, color: BODY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.as}</div>
  </div>
);
// Coluna de triagem. times[k] = quadro em que o e-mail k cai na coluna.
const Triagem = ({ fr, times, colOn, w = 960, h = 560, draft = -1, lockAt = -1 }) => {
  const cw = (w - 40) / 3;
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      {COLS.map((c, ci) => {
        const on = fr >= colOn[ci];
        const n = MAILS.filter((m, k) => m.col === ci && fr >= times[k]).length;
        return (
          <div key={ci} style={{ position: "absolute", left: ci * (cw + 20), top: 0, width: cw, height: h, borderRadius: 24, background: on ? `${c.c}22` : "rgba(255,255,255,0.04)", border: `3px solid ${on ? c.c : "rgba(190,160,255,0.2)"}`, transform: `scale(${on ? 0.95 + 0.05 * pop(fr, colOn[ci], 9) : 1})` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", fontFamily: inter, fontWeight: 800, fontSize: 28, color: on ? "#fff" : GREY }}>
              <span>{c.i} {c.t}</span>
              <span style={{ background: on ? c.c : "rgba(255,255,255,0.1)", color: "#120b26", borderRadius: 20, padding: "0 12px", fontSize: 26 }}>{n}</span>
            </div>
          </div>
        );
      })}
      {MAILS.map((m, k) => {
        if (fr < times[k] - 12) return null;
        const p = ease(lin(fr, times[k] - 12, times[k]));
        const idx = MAILS.slice(0, k).filter((x) => x.col === m.col).length;
        const x1 = m.col * (cw + 20) + 10, y1 = 76 + idx * 112;
        const x0 = w / 2 - cw / 2, y0 = -200;
        return (
          <div key={k} style={{ position: "absolute", left: x0 + (x1 - x0) * p, top: y0 + (y1 - y0) * p, opacity: p, transform: `rotate(${(1 - p) * (k % 2 ? 8 : -8)}deg)` }}>
            <MailRow m={m} w={cw - 20} small />
            {m.col === 0 && draft >= 0 && fr >= draft + idx * 8 && (
              <div style={{ position: "absolute", right: -6, bottom: -14, fontFamily: inter, fontWeight: 800, fontSize: 20, color: "#120b26", background: GREEN, borderRadius: 12, padding: "2px 10px", transform: `scale(${pop(fr, draft + idx * 8, 9)})` }}>✍️ rascunho</div>
            )}
          </div>
        );
      })}
      {lockAt >= 0 && fr >= lockAt && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -110, display: "flex", justifyContent: "center", gap: 24, transform: `scale(${pop(fr, lockAt, 10)})` }}>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", background: "rgba(255,255,255,0.08)", border: `3px solid ${RED}`, borderRadius: 20, padding: "14px 30px", textDecoration: "line-through", textDecorationColor: RED, textDecorationThickness: 5 }}>Enviar</div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: AMBER, background: "rgba(251,191,36,0.12)", border: `3px solid ${AMBER}`, borderRadius: 20, padding: "14px 30px" }}>🔒 espera seu OK</div>
        </div>
      )}
    </div>
  );
};

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const dDorme = at(5), dTres = at(6), dOrdem = at(9), dTerc = at(12), dLiga = at(16);
  let big, bigD, size = 140, bg = "#3b2a7a", rot = -3;
  if (fr < dDorme) { big = "você dorme 😴"; bigD = 0; }
  else if (fr < dTres) { big = "…e ele trabalha"; bigD = dDorme; size = 112; bg = PINK; rot = 2; }
  else if (fr < dTerc) { big = "3 prompts"; bigD = dTres; size = 160; bg = PINK; rot = -2; }
  else { big = "o 3º liga ⚡"; bigD = dTerc; size = 140; bg = RED; rot = 2; }
  const dEnq = at(3);
  const flash = [dEnq, dDorme, dTres, dOrdem, dTerc, dLiga].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.5, 0);
  // relógio de 02:00 até 07:00 no "dorme"
  const mins = Math.round(interpolate(fr, [0, dDorme], [120, 420], clamp));
  const clock = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  const day = fr >= dDorme;
  const times = MAILS.map((_, k) => 4 + k * 7);
  const zoom = interpolate(fr, [0, 8], [1.08, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={200} rot={rot} bg={bg}>{big}</Big>
      {fr < dTres + 10 ? (
        <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, transform: `scale(${zoom}) translateX(${fr >= dTres ? -ease(lin(fr, dTres, dTres + 10)) * 1100 : 0}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ fontSize: 90, transform: `rotate(${day ? 0 : Math.sin(fr / 6) * 10}deg) scale(${day ? pop(fr, dDorme, 8) : 1})` }}>{day ? "☀️" : "🌙"}</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: day ? AMBER : "#fff", textShadow: `0 0 40px ${day ? AMBER : PINK}` }}>{clock}</div>
          </div>
          <Janela title="Grok Bot · caixa de entrada" w={980} h={860} glow={day} style={{ transform: `translateX(${shake(fr, dEnq, 16)}px) scale(${fr >= dEnq && fr < dDorme ? 1 + 0.03 * Math.max(0, 1 - (fr - dEnq) / 8) : 1})` }}>
            <Triagem fr={fr} times={times} colOn={[2, 2, 2]} w={924} h={740} />
            {day && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
                <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: 96, color: GREEN, border: `8px solid ${GREEN}`, borderRadius: 22, padding: "6px 34px", background: "rgba(10,6,24,0.88)", transform: `rotate(-10deg) scale(${interpolate(fr, [dDorme, dDorme + 6], [1.7, 1], clamp)})` }}>✓ PRONTO</span>
              </div>
            )}
          </Janela>
        </div>
      ) : (
        <div style={{ position: "absolute", top: 500, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
          {[["1", "?", dTres], ["2", "?", dTres + 5], ["3", "🔒", dTres + 10]].map(([n, ic, d], k) => {
            const terc = k === 2 && fr >= dTerc;
            const scan = fr >= dTres + 14 && fr < dTerc && Math.floor((fr - dTres - 14) / 7) % 3 === k;
            const lig = k === 2 && fr >= dLiga;
            return (
              <In key={k} fr={fr} d={d} dx={600} dy={0}>
                <div style={{ width: 900, height: 220, borderRadius: 34, background: lig ? PINKA(0.3) : scan ? PINKA(0.14) : WIN, border: `4px solid ${terc || scan ? PINK : "rgba(190,160,255,0.3)"}`, display: "flex", alignItems: "center", gap: 34, padding: "0 40px", boxSizing: "border-box", transform: `translateX(${terc ? shake(fr, dTerc, 18) : 0}px) scale(${terc ? 1 + 0.06 * pop(fr, dTerc, 8) : 1})`, boxShadow: lig ? `0 0 90px ${PINK}` : "none" }}>
                  <div style={{ width: 120, height: 120, borderRadius: 60, background: terc ? PINK : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 72, color: "#fff" }}>{n}</div>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", flex: 1 }}>prompt {lig ? "" : ic}</div>
                  {k === 2 && (
                    <div style={{ width: 150, height: 80, borderRadius: 40, background: lig ? GREEN : "rgba(255,255,255,0.15)", position: "relative" }}>
                      <div style={{ position: "absolute", top: 8, left: 8 + 70 * ease(lin(fr, dLiga, dLiga + 6)), width: 64, height: 64, borderRadius: 32, background: "#fff" }} />
                    </div>
                  )}
                </div>
              </In>
            );
          })}
          {fr >= dOrdem && <In fr={fr} d={dOrdem}><Pill size={44} c={PINK} bg={PINKA(0.15)}>nessa ordem ↓</Pill></In>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 1: o que é ----------
const Intro = ({ fr }) => {
  const dIc = at(20), dX = at(23), dOs = [at(28), at(29), at(30), at(32)], dCom = at(34), dNuv = at(36), dOk = at(40), dImp = at(44);
  const devs = [["💻", "Mac"], ["🪟", "Windows"], ["🐧", "Linux"], ["📱", "celular"]];
  const toCard = fr >= at(37);
  const click = at(43);
  return (
    <AbsoluteFill>
      {!toCard ? (
        <div style={{ position: "absolute", top: 220, left: 0, right: 0, height: 1150 }}>
          {/* nuvem com o computador */}
          {fr >= dCom && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <In fr={fr} d={dCom} dy={-60}>
                <div style={{ position: "relative", width: 560, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "absolute", fontSize: 300, top: -70, opacity: 0.9 }}>☁️</div>
                  <div style={{ position: "relative", top: 30, width: 230, height: 140, borderRadius: 16, background: "#120b26", border: `4px solid ${fr >= dNuv ? GREEN : PINK}`, fontFamily: MONO, fontSize: 22, color: GREEN, padding: 12, boxSizing: "border-box" }}>
                    {typed("$ bot rodando…", fr, dCom + 4, dCom + 20)}<br />{fr >= dNuv && <span style={{ color: "#fff" }}>● online 24h</span>}
                  </div>
                </div>
              </In>
            </div>
          )}
          <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <In fr={fr} d={dIc - 4}><div style={{ position: "relative" }}>
              <AppIcon fr={fr} size={260} on={lin(fr, dIc, dIc + 8)} />
              {[0, 1, 2, 3, 4].map((k) => { const a = fr / 9 + (k * Math.PI * 2) / 5; const r = 190 + 14 * Math.sin(fr / 7 + k); return <div key={k} style={{ position: "absolute", left: 130 + Math.cos(a) * r - 10, top: 130 + Math.sin(a) * r * 0.55 - 10, width: 20, height: 20, borderRadius: 10, background: k % 2 ? PINK : GREEN, boxShadow: `0 0 20px ${k % 2 ? PINK : GREEN}` }} />; })}
              {fr >= at(21) && fr < at(21) + 14 && <div style={{ position: "absolute", left: 130 - 200 * lin(fr, at(21), at(21) + 14), top: 130 - 200 * lin(fr, at(21), at(21) + 14), width: 400 * lin(fr, at(21), at(21) + 14), height: 400 * lin(fr, at(21), at(21) + 14), borderRadius: "50%", border: `6px solid ${PINK}`, opacity: 1 - lin(fr, at(21), at(21) + 14) }} />}
            </div></In>
            <In fr={fr} d={dIc}><div style={{ fontFamily: inter, fontWeight: 800, fontSize: 84, color: "#fff", letterSpacing: -2 }}>Grok Bot</div></In>
            {fr >= dX && <In fr={fr} d={dX}><Pill size={40} c={BODY} bg="rgba(255,255,255,0.08)">da xAI</Pill></In>}
          </div>
          {devs.map(([ic, nm], k) => {
            const d = dOs[k];
            if (fr < d) return null;
            const pos = [[60, 420], [740, 420], [60, 760], [740, 760]][k];
            return (
              <div key={k} style={{ position: "absolute", left: pos[0], top: pos[1] }}>
                <In fr={fr} d={d} dx={k % 2 ? 300 : -300} dy={0}>
                  <div style={{ width: 280, padding: "20px 0", borderRadius: 28, background: WIN, border: `3px solid ${fr >= dNuv ? GREEN : PINKA(0.5)}`, textAlign: "center" }}>
                    <div style={{ fontSize: 76 }}>{ic}</div>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>{nm} {fr >= dNuv ? "✓" : ""}</div>
                  </div>
                </In>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <In fr={fr} d={at(37)} dy={120}>
            <div style={{ width: 900, borderRadius: 34, background: WIN, border: `3px solid ${AMBER}`, padding: 40, boxSizing: "border-box", boxShadow: `0 0 70px rgba(251,191,36,0.25)` }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: AMBER }}>⚠️ Precisa da sua aprovação</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff", marginTop: 18, lineHeight: 1.15 }}>Enviar e-mail para o cliente?</div>
              <div style={{ marginTop: 18 }}><MailRow m={{ de: "Para: Cliente", as: "Re: Proposta vence hoje" }} w={820} /></div>
              <div style={{ display: "flex", gap: 24, marginTop: 34, position: "relative" }}>
                <div style={{ flex: 1, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 42, color: GREY, border: "3px solid rgba(190,160,255,0.3)", borderRadius: 22, padding: "20px 0" }}>Recusar</div>
                <div style={{ flex: 1, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#fff", background: fr >= click ? GREEN : fr >= dOk ? PINK : "rgba(222,64,200,0.4)", borderRadius: 22, padding: "20px 0", transform: `scale(${fr >= click ? 0.94 + 0.06 * pop(fr, click, 8) : fr >= dOk ? 1 + 0.05 * Math.sin(fr / 3) : 1})` }}>{fr >= click ? "✓ Aprovado" : "Aprovar"}</div>
                {/* cursor */}
                <div style={{ position: "absolute", fontSize: 70, left: interpolate(fr, [at(38), click], [120, 600], clamp), top: interpolate(fr, [at(38), click], [160, 40], clamp), transform: `scale(${fr >= click && fr < click + 5 ? 0.8 : 1})` }}>👆</div>
              </div>
            </div>
          </In>
          {fr >= dImp && <In fr={fr} d={dImp}><Pill size={44} c={AMBER} bg="rgba(251,191,36,0.12)">só age com o seu OK</Pill></In>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 2: prompt 1, o cargo ----------
const Item1 = ({ fr }) => {
  const dH = at(45), dC = at(49), d1 = at(52), d2 = at(54), d3 = at(57), dTipo = at(58), dTy = at(59), dTyE = at(72), dMem = at(71);
  const txt = "Você cuida do meu e-mail e nunca envia nada sem eu aprovar. Lembre disso!";
  return (
    <AbsoluteFill>
      <Header fr={fr} d={dH} n="1" icon="🪪" t="O cargo" sub="na primeira mensagem" />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <In fr={fr} d={dH + 6}>
          <Janela title="+ Novo Bot" w={960} h={fr >= dTipo ? 940 : 780} glow={fr >= dMem}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <AppIcon fr={fr} size={110} on={lin(fr, dC, dC + 8)} />
              <div>
                <div style={{ fontFamily: inter, fontSize: 26, color: GREY }}>Nome do Bot</div>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff" }}>{typed("Bot do E-mail", fr, dH + 10, dC + 4)}{fr < dC + 8 && blink(fr)}</div>
              </div>
              {fr >= dC && <div style={{ marginLeft: "auto" }}><In fr={fr} d={dC}><Pill size={32} c={PINK} bg={PINKA(0.15)}>cargo ✓</Pill></In></div>}
            </div>
            <div style={{ display: "flex", flexDirection: fr >= dTipo ? "row" : "column", gap: fr >= dTipo ? 18 : 44, marginTop: 50, flexWrap: "wrap" }}>
              <Check fr={fr} d={d1} size={fr >= dTipo ? 30 : 60}>1 trabalho só</Check>
              <Check fr={fr} d={d2} size={fr >= dTipo ? 30 : 60}>fontes</Check>
              <Check fr={fr} d={d3} size={fr >= dTipo ? 30 : 60}>limites</Check>
            </div>
            {fr >= dTipo && (
              <div style={{ marginTop: 34 }}>
                <In fr={fr} d={dTipo}><Bolha fr={fr} txt={txt} a={dTy} b={dTyE} w={890} size={50} hi={["nunca envia nada", "Lembre disso!"]} /></In>
              </div>
            )}
          </Janela>
        </In>
        {fr >= dMem && <In fr={fr} d={dMem}><Pill size={44}>🧠 memória salva ✓</Pill></In>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3: prompt 2, a primeira tarefa ----------
const Item2 = ({ fr }) => {
  const dH = at(73), dT = at(78), dCol = at(83), dTy = at(84), dTyE = at(99);
  const colOn = [at(88), at(89), at(91)];
  const times = MAILS.map((m, k) => colOn[m.col] + (k % 3) * 5);
  const txt = "Separe meus e-mails em urgente, responder e informativo. Escreva as respostas urgentes e não envie nada.";
  return (
    <AbsoluteFill>
      <Header fr={fr} d={dH} n="2" icon="📨" t="A primeira tarefa" sub="como pra um colega" />
      <div style={{ position: "absolute", top: 390, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {fr < dTy ? (
          <In fr={fr} d={dH + 8}>
            <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 260 }}>
              <div style={{ width: 270, height: 270, borderRadius: 135, background: "rgba(255,255,255,0.08)", border: `4px solid ${BODY}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 130 }}>🧑</div>
              <div style={{ fontSize: 90, transform: `translateX(${Math.sin(fr / 4) * 14}px)` }}>💬</div>
              <AppIcon fr={fr} size={270} on={lin(fr, dCol, dCol + 6)} />
            </div>
            {fr >= dCol && <div style={{ textAlign: "center", marginTop: 40 }}><In fr={fr} d={dCol}><Pill size={48} c={PINK} bg={PINKA(0.15)}>= colega de trabalho</Pill></In></div>}
          </In>
        ) : (
          <>
            <In fr={fr} d={dTy}><Bolha fr={fr} txt={txt} a={dTy} b={dTyE} w={960} size={36} hi={["urgente", "responder", "informativo", "não envie nada"]} /></In>
            <div style={{ marginTop: 10 }}>
              <Triagem fr={fr} times={times} colOn={colOn} w={960} h={600} draft={at(94)} lockAt={at(97)} />
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4: prompt 3, a rotina ----------
const DIAS = ["S", "T", "Q", "Q", "S", "S", "D"];
const Item3 = ({ fr }) => {
  const dH = at(100), dR = at(104), dCerto = at(106), dTy = at(107), dTyE = at(116), dUtil = [at(110), at(111), at(112)], dOito = at(114), dPronto = at(117), dRot = at(119), dSoz = at(122);
  const txt = "Ficou ótimo! Repita isso todo dia útil, às 8h da manhã.";
  const runs = fr >= dSoz ? Math.min(5, 1 + Math.floor((fr - dSoz) / 6)) : 0;
  return (
    <AbsoluteFill>
      <Header fr={fr} d={dH} n="3" icon="🔁" t="A rotina" sub="quando ficar certo" />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {fr < dTy ? (
          <In fr={fr} d={dH + 8}>
            <div style={{ width: 900, borderRadius: 30, background: WIN, border: `3px solid ${fr >= dCerto ? GREEN : "rgba(190,160,255,0.3)"}`, padding: 40, boxSizing: "border-box", marginTop: 180 }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: GREY }}>Resultado da tarefa</div>
              <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
                {[["🔥", "2 urgentes", RED], ["↩️", "3 responder", AMBER], ["ℹ️", "3 info", "#7ab8ff"]].map(([i, t, c], k) => (
                  <div key={k} style={{ flex: 1, borderRadius: 20, border: `3px solid ${c}`, background: `${c}22`, padding: "18px 0", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#fff", transform: `scale(${pop(fr, dH + 12 + k * 6, 10)})` }}>{i}<br />{t}</div>
                ))}
              </div>
              <div style={{ marginTop: 24, fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREEN, opacity: lin(fr, dR, dR + 4) }}>✍️ 2 rascunhos · nada enviado</div>
            </div>
            {fr >= dCerto && <div style={{ textAlign: "center", marginTop: 30, fontSize: 130, transform: `scale(${pop(fr, dCerto, 8)}) rotate(${shake(fr, dCerto, 10)}deg)` }}>👍</div>}
          </In>
        ) : (
          <>
            <In fr={fr} d={dTy}><Bolha fr={fr} txt={txt} a={dTy} b={dTyE} w={960} size={46} hi={["todo dia útil", "8h da manhã"]} /></In>
            <In fr={fr} d={dTy + 6} style={{ marginTop: 20 }}>
              <div style={{ width: 960, borderRadius: 30, background: WIN, border: `3px solid ${fr >= dPronto ? GREEN : "rgba(190,160,255,0.3)"}`, padding: 30, boxSizing: "border-box", boxShadow: fr >= dPronto ? `0 0 70px rgba(52,211,153,0.3)` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>🔁 Rotina · Separar e-mails</div>
                  <div style={{ width: 130, height: 70, borderRadius: 35, background: fr >= dPronto ? GREEN : "rgba(255,255,255,0.15)", position: "relative" }}>
                    <div style={{ position: "absolute", top: 7, left: 7 + 60 * ease(lin(fr, dPronto, dPronto + 6)), width: 56, height: 56, borderRadius: 28, background: "#fff" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
                  {DIAS.map((d, k) => {
                    const on = k < 5 && fr >= (k < 2 ? dUtil[0] : k < 4 ? dUtil[1] : dUtil[2]) + (k % 2) * 3;
                    return <div key={k} style={{ flex: 1, height: 120, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 44, color: on ? "#fff" : GREY, background: on ? PINK : "rgba(255,255,255,0.06)", transform: `scale(${on ? 0.9 + 0.1 * pop(fr, dUtil[0], 9) : 1})` }}>{d}</div>;
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 26 }}>
                  <div style={{ fontSize: 64 }}>⏰</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 100, color: fr >= dOito ? AMBER : GREY }}>
                    {fr >= dOito ? `0${Math.min(8, Math.floor(interpolate(fr, [dOito, dOito + 8], [1, 8], clamp)))}:00` : "--:--"}
                  </div>
                  {fr >= dRot && <div style={{ marginLeft: "auto" }}><In fr={fr} d={dRot}><Pill size={36}>✓ rotina ativa</Pill></In></div>}
                </div>
              </div>
            </In>
            {fr >= dSoz && (
              <In fr={fr} d={dSoz}>
                <div style={{ display: "flex", gap: 14 }}>
                  {["seg", "ter", "qua", "qui", "sex"].map((d, k) => (
                    <div key={k} style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: k < runs ? "#120b26" : GREY, background: k < runs ? GREEN : "rgba(255,255,255,0.06)", borderRadius: 20, padding: "18px 22px", transform: `scale(${k < runs ? 0.9 + 0.1 * pop(fr, dSoz + k * 6, 9) : 1})` }}>{d} {k < runs ? "✓" : ""}</div>
                  ))}
                </div>
              </In>
            )}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5: CTA ----------
const CTA = ({ fr }) => {
  const d0 = at(124), dL = at(129), dS = at(131), dC = at(134);
  const items = [["1", "🪪", "O cargo + lembre disso"], ["2", "📨", "A primeira tarefa"], ["3", "🔁", "A rotina no horário"]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {items.map(([n, ic, t], k) => (
          <In key={k} fr={fr} d={d0 + k * 5} dx={-500} dy={0}>
            <div style={{ width: 920, display: "flex", alignItems: "center", gap: 26, padding: "30px 34px", borderRadius: 28, background: WIN, border: `3px solid ${PINKA(0.6)}`, boxSizing: "border-box" }}>
              <div style={{ width: 84, height: 84, borderRadius: 42, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 54 }}>{ic}</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>{t}</div>
              <div style={{ marginLeft: "auto", fontSize: 44, color: GREEN, opacity: lin(fr, d0 + k * 5 + 8, d0 + k * 5 + 10) }}>✓</div>
            </div>
          </In>
        ))}
        {fr >= dL && <In fr={fr} d={dL}><Pill size={44} c={PINK} bg={PINKA(0.15)}>📝 os 3 na legenda ↓</Pill></In>}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", marginTop: 20, position: "relative" }}>
          {fr >= dC + 8 && [0, 1, 2, 3, 4, 5].map((k) => { const t0 = dC + 8 + k * 5; if (fr < t0) return null; const q = (fr - t0) / 40; return <div key={k} style={{ position: "absolute", left: 560 + (k % 3) * 40 + Math.sin(fr / 5 + k) * 20, top: 20 - q * 220, fontSize: 56, opacity: Math.max(0, 1 - q) }}>{k % 2 ? "💜" : "❤️"}</div>; })}
          <div style={{ width: 720, display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dC ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dS - 4, dS + 2) }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 50, color: "#fff" }}>{typed("BOT", fr, dC - 4, dC + 4)}{blink(fr)}</span>
            {fr >= dC + 8 && <span style={{ marginLeft: "auto", fontSize: 48, transform: `scale(${pop(fr, dC + 8, 9)})` }}>❤️</span>}
          </div>
          <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: fr >= dS + 4 ? "rgba(255,255,255,0.15)" : PINK, padding: "22px 34px", borderRadius: 20, transform: `scale(${fr >= dS + 4 ? pop(fr, dS + 4, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dS - 6, dS) }}>{fr >= dS + 4 ? "✓ Seguindo" : "Seguir"}</div>
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
const KEY = new Set(["bot", "dorme", "tres", "3", "prompts", "prompt", "terceiro", "liga", "grok", "xai", "mac", "windows", "linux", "celular", "nuvem", "ok", "importantes", "cargo", "so", "fontes", "limites", "email", "emails", "nunca", "aprovar", "lembre", "tarefa", "colega", "urgente", "responder", "informativo", "urgentes", "nada", "rotina", "certo", "repetir", "util", "oito", "pronto", "sozinho", "legenda", "segue", "comenta"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3" };
const buildChunks = (words) => {
  const toks = [];
  const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const nx = words[k + 1] && norm(words[k + 1].w);
    if (n === "numero" && NUM[nx]) { toks.push({ t: "Nº " + NUM[nx] + tail(words[k + 1]), s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "x" && nx === "a" && words[k + 2] && norm(words[k + 2].w) === "i") { toks.push({ t: "xAI" + tail(words[k + 2]), s: x.s, e: words[k + 2].e, key: true }); k += 2; continue; }
    if (n === "tres") { toks.push({ t: "3" + tail(x), s: x.s, e: x.e, key: true }); continue; }
    if (n === "oito") { toks.push({ t: "8h", s: x.s, e: x.e, key: true }); continue; }
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

export const ShortGrokBot = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(18), at(45), at(73), at(100), at(124), end];
  const scenes = [Hook, Intro, Item1, Item2, Item3, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Bloco key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Bloco>)}
      <Reacao fr={fr} a={0} b={at(5)} pose="surpresa" top={1290} />
      <Reacao fr={fr} a={at(100)} b={at(105)} pose="apontando" top={1230} left />
      <Reacao fr={fr} a={at(130)} b={end} pose="comemorando" top={1180} left />
      <Legendas chunks={chunks} fr={fr} />
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={1} /></Sequence>
      <Sequence from={0} durationInFrames={20}><Audio src={staticFile("sfx/riser.mp3")} volume={0.35} /></Sequence>
      <Sequence from={at(5)} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(6)} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.8} /></Sequence>
      <Sequence from={at(12)} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.4} /></Sequence>
      <Sequence from={at(16)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.6} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.3} /></Sequence>)}
      {[at(28), at(29), at(30), at(32), at(52), at(54), at(57)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.28} /></Sequence>)}
      {[at(43), at(71), at(117), at(134)].map((b, k) => <Sequence key={"d" + k} from={b} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.32} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const CapaGrokBot = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 96, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}>Esse bot trabalha</div>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 120, color: "#fff", background: PINK, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)", marginTop: 16 }}>enquanto você dorme</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 64, color: BODY, marginTop: 30 }}>3 prompts, na ordem</div>
    </div>
    <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ fontSize: 90 }}>🌙</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: "#fff", textShadow: `0 0 40px ${PINK}` }}>03:00</div>
      </div>
      <AppIcon fr={0} size={300} on={1} />
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff" }}>Grok Bot</div>
    </div>
  </AbsoluteFill>
);
