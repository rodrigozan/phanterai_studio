import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

// Reel 20/11/2026 12:00 — "Tire seus dados da internet e das IAs: 5 comandos".
// Fatos conferidos nas fontes primárias (capturadas em fontes/ em 20/11/2026):
// - Google, "Encontrar e remover informações pessoais nos resultados da Pesquisa Google" (support.google.com/websearch/answer/12719076):
//   página "Privacidade nos resultados sobre você"; aceita telefone, endereço, e-mail e CPF; notificações; guia "Para analisar";
//   botão "Pedir remoção"; status Em andamento/Aprovado/Negado; remove só da Pesquisa Google.
// - LGPD (Lei 13.709/2018, planalto.gov.br): art. 18, VI (eliminação dos dados tratados com consentimento) e § 5º (sem custos para o titular).
// - OpenAI, "Controles de dados no ChatGPT": "Melhorar o modelo para todo mundo" ativado por padrão nos planos Free/Plus/Pro.
// - OpenAI, "Memória no ChatGPT": dá para perguntar o que ele lembra sobre você e excluir memórias.
// - Anthropic, privacy.claude.com/pt/articles/12109829: Configurações > Privacidade > "Ajude a melhorar nossos modelos de IA".
// Conteúdo dentro das demos (nomes, sites, memórias) é ilustrativo. Fontes só no texto do post.
// Palco contínuo com interface recriada em motion; ações disparadas pelo índice da palavra em words.json.
const inter = loadInter("normal", { weights: ["400", "800"] }).fontFamily;
const lora = loadLora("italic", { weights: ["500"] }).fontFamily;
const MONO = "'DejaVu Sans Mono', monospace";

export const STD_SLUG = "phanterai/episodes/shorts-reels-tiktok/reel-2026-11-20-1200-tirar-dados-da-internet";
export const STD_FPS = 30;
const FPS = STD_FPS;
const f = (p) => staticFile(`${STD_SLUG}/${p}`);
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
const MUSIC = "phanterai/music/Code_and_Coffe.mp3";
const TAIL = 0.6;

export const calculateTirarDadosMetadata = async () => {
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
  <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: -1, opacity: lin(fr, 160, 175) }}>
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

const Chip = ({ n, icon, titulo, sub, fr, d, warn }) => {
  const p = pop(fr, d, 13);
  const c = warn ? RED : PINK;
  return (
    <div style={{ position: "absolute", top: 190, left: 70, right: 70, display: "flex", alignItems: "center", gap: 24, padding: "18px 28px", borderRadius: 28, background: "rgba(30,18,60,0.92)", border: `2px solid ${warn ? RED : PINKA(0.6)}`, transform: `translateY(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`, opacity: p }}>
      <div style={{ width: 96, height: 96, borderRadius: 24, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 58, color: "#fff", flexShrink: 0 }}>{n}</div>
      <div style={{ fontSize: 64 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", lineHeight: 1.05 }}>{titulo}</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 34, color: BODY, marginTop: 4 }}>{sub}</div>
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
    <span style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: size, color: "#fff", background: bg, padding: "0 42px", borderRadius: 30, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap" }}>{children}</span>
  </div>
);

const Pill = ({ children, bg = "rgba(52,211,153,0.16)", c = GREEN, size = 40 }) => (
  <span style={{ display: "inline-block", fontFamily: inter, fontWeight: 800, fontSize: size, color: c, background: bg, border: `2px solid ${c}`, padding: "8px 26px", borderRadius: 40, whiteSpace: "nowrap" }}>{children}</span>
);

// Interruptor estilo app: on (0..1) anima a bolinha e a cor.
const Toggle = ({ on, scale = 1, onColor = GREEN }) => (
  <div style={{ width: 130 * scale, height: 72 * scale, borderRadius: 40 * scale, background: on > 0.5 ? onColor : "rgba(255,255,255,0.18)", position: "relative", flexShrink: 0, transition: "none" }}>
    <div style={{ position: "absolute", top: 6 * scale, left: (6 + 58 * on) * scale, width: 60 * scale, height: 60 * scale, borderRadius: 30 * scale, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }} />
  </div>
);

// Caixa de busca estilo buscador (genérica, cores da marca).
const Busca = ({ text, fr, w = 900 }) => (
  <div style={{ width: w, height: 104, borderRadius: 52, background: "#fff", display: "flex", alignItems: "center", gap: 22, padding: "0 36px", boxShadow: `0 0 50px ${PINKA(0.3)}` }}>
    <span style={{ fontSize: 46 }}>🔎</span>
    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 42, color: "#1a1030", whiteSpace: "nowrap" }}>{text}{blink(fr)}</span>
  </div>
);

const Resultado = ({ fr, d, site, dado, tipo, alerta, w = 900 }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 12);
  return (
    <div style={{ width: w, borderRadius: 24, background: WIN, border: `3px solid ${alerta ? RED : "rgba(190,160,255,0.28)"}`, padding: "20px 28px", opacity: p, transform: `translateX(${(1 - p) * 120 + (alerta ? shake(fr, d, 10) : 0)}px)` }}>
      <div style={{ fontFamily: MONO, fontSize: 26, color: GREEN }}>{site}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY }}>{tipo}</span>
        <span style={{ fontFamily: MONO, fontSize: 40, color: "#fff", background: alerta ? "rgba(255,92,122,0.25)" : "transparent", padding: "0 10px", borderRadius: 8 }}>{dado}</span>
        {alerta && <span style={{ marginLeft: "auto", fontSize: 40 }}>⚠️</span>}
      </div>
    </div>
  );
};

// Chat genérico: bolha do usuário e resposta da IA.
const Bolha = ({ children, me, fr, d, w = 760, border }) => {
  if (fr < d) return null;
  const p = pop(fr, d, 13);
  return (
    <div style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: w, borderRadius: 28, padding: "22px 28px", background: me ? PINKA(0.9) : "rgba(255,255,255,0.08)", border: border ? `3px solid ${border}` : "none",
      fontFamily: inter, fontWeight: me ? 800 : 400, fontSize: 36, color: "#fff", lineHeight: 1.25, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{children}</div>
  );
};

const Colar = ({ fr, d }) => {
  if (fr < d || fr > d + 22) return null;
  const p = pop(fr, d, 10), out = lin(fr, d + 14, d + 22);
  return (
    <div style={{ position: "absolute", top: 380, right: 120, transform: `scale(${p}) rotate(${-8 + 8 * p}deg)`, opacity: 1 - out, zIndex: 5 }}>
      <Pill c="#fff" bg={PINK} size={44}>📋 Ctrl + V</Pill>
    </div>
  );
};

// ---------- 0: gancho ----------
const Hook = ({ fr }) => {
  const d4 = at(4), d8 = at(8), d9 = at(9), d11 = at(11), d15 = at(15), d20 = at(20), d23 = at(23);
  const flash = [d4, d8, d9, d11, d20].reduce((s, d) => s + Math.max(0, 1 - Math.abs(fr - d) / 5) * 0.55, 0);
  let big, bigD, size = 150, bg = PINK, rot = 0;
  if (fr < d4) { big = "seu telefone"; bigD = 0; size = 150; rot = -3; }
  else if (fr < d8) { big = "e seu CPF"; bigD = d4; size = 160; rot = 2; }
  else if (fr < d9) { big = "no Google!"; bigD = d8; size = 160; bg = RED; }
  else if (fr < d11) { big = "5 comandos"; bigD = d9; size = 140; }
  else if (fr < d20) { big = "copia e cola"; bigD = d11; size = 130; }
  else { big = "o 5º ninguém desliga"; bigD = d20; size = 96; bg = RED; }
  // número sendo "revelado" no quadro 0
  const tel = "(11) 9 8742-" + String(1000 + Math.floor(8999 * ease(lin(fr, 0, 18)))).slice(0, 4);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: PINKA(Math.min(0.5, flash)) }} />
      <Big fr={fr} d={bigD} size={size} top={210} rot={rot} bg={bg}>{big}</Big>
      {fr < d9 && (
        <Palco top={480}>
          <div style={{ transform: `scale(${interpolate(fr, [0, 8], [1.15, 1], clamp)})`, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
            <Busca fr={fr} text={typed("Ana Souza, Campinas", fr, 0, 16)} />
            <Resultado fr={fr} d={-8} site="lista-telefonica.exemplo" tipo="telefone" dado={tel} alerta />
            <Resultado fr={fr} d={d4} site="cadastro-publico.exemplo" tipo="CPF" dado={fr < d4 + 10 ? "***.***.***-**" : "123.456.789-00"} alerta />
            {fr >= d8 && <Resultado fr={fr} d={d8} site="busca-pessoas.exemplo" tipo="endereço" dado="Rua das Flores, 120" alerta />}
          </div>
        </Palco>
      )}
      {fr >= d9 && (
        <Palco top={520}>
          <div style={{ display: "flex", gap: 22 }}>
            {[1, 2, 3, 4, 5].map((n, k) => {
              const p = pop(fr, d9 + k * 3, 11);
              const warn = n === 5 && fr >= d20;
              const pasted = fr >= d11 + k * 4;
              return (
                <div key={k} style={{ width: 160, height: 230, borderRadius: 26, background: warn ? "rgba(255,92,122,0.25)" : "rgba(30,18,60,0.92)", border: `3px solid ${warn ? RED : pasted ? GREEN : PINKA(0.6)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: p,
                  transform: `scale(${(0.6 + 0.4 * p) * (warn ? 1.12 + 0.05 * Math.sin(fr / 3) : 1)}) translateX(${warn ? shake(fr, d20, 10) : 0}px)` }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 80, color: "#fff" }}>{n}</div>
                  <div style={{ fontSize: 50 }}>{warn ? "🔓" : pasted ? "📋" : "?"}</div>
                </div>
              );
            })}
          </div>
          {fr >= d11 && fr < d20 && (
            <div style={{ width: 860, borderRadius: 26, background: WIN, border: `2px solid ${PINKA(0.6)}`, padding: "24px 30px", fontFamily: MONO, fontSize: 34, color: "#fff", transform: `scale(${pop(fr, d11, 12)})` }}>
              <span style={{ color: PINK }}>›</span> {typed("pesquise meu nome e...", fr, d11, d15 + 6)}{blink(fr)}
            </div>
          )}
          {fr >= d20 && (
            <In fr={fr} d={d20 + 4}>
              <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "22px 34px", borderRadius: 26, background: WIN, border: `3px solid ${RED}` }}>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 44, color: "#fff" }}>vem ligado</span>
                <Toggle on={1} scale={1.1} onColor={RED} />
              </div>
            </In>
          )}
          {fr >= d23 && <In fr={fr} d={d23}><Pill c={RED} bg="rgba(255,92,122,0.15)" size={44}>⚠ fica até o fim</Pill></In>}
        </Palco>
      )}
      <Colar fr={fr} d={d11} />
    </AbsoluteFill>
  );
};

// ---------- 1: IA te procura ----------
const P1 = "Pesquise meu nome e minha cidade e liste os sites com meu telefone, endereço ou CPF.";
const Item1 = ({ fr }) => {
  const d0 = at(24), dIA = at(28), dA = at(30), dC = at(31), dT = at(44), dE = at(45), dF = at(47);
  const scan = (fr - dIA) / 12;
  return (
    <AbsoluteFill>
      <Chip n={1} icon="🔎" titulo="A IA te procura" sub="com busca na web ligada" fr={fr} d={d0} />
      <Palco top={430}>
        {fr < dC ? (
          <div style={{ position: "relative", width: 560, height: 560, transform: `scale(${pop(fr, d0 + 3, 12)})` }}>
            {[0, 1, 2].map((k) => {
              const r = ((fr / 1.2 + k * 40) % 120) / 120;
              return <div key={k} style={{ position: "absolute", left: 280 - 280 * r, top: 280 - 280 * r, width: 560 * r, height: 560 * r, borderRadius: "50%", border: `4px solid ${PINKA(1 - r)}` }} />;
            })}
            <div style={{ position: "absolute", left: 170, top: 170, width: 220, height: 220, borderRadius: 60, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", transform: `rotate(${Math.sin(fr / 6) * 6}deg)` }}>IA</div>
            {fr >= dIA && <div style={{ position: "absolute", left: 280 + Math.cos(scan) * 230 - 40, top: 280 + Math.sin(scan) * 230 - 40, fontSize: 80 }}>🔍</div>}
            {fr >= dA && <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center" }}><In fr={fr} d={dA}><Pill size={44} c={PINK} bg={PINKA(0.15)}>👤 você</Pill></In></div>}
          </div>
        ) : (
          <Janela title="chat com IA · busca na web" w={920} h={860}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Bolha me fr={fr} d={dC}>{typed(P1, fr, dC + 2, dT - 4)}{fr < dT - 4 && blink(fr)}</Bolha>
              {fr >= dT - 6 && <div style={{ fontFamily: inter, fontSize: 30, color: GREY }}>{fr < dT ? "pesquisando" + ".".repeat(1 + ((fr / 4) | 0) % 3) : "achei 3 sites:"}</div>}
              <Resultado fr={fr} d={dT} w={850} site="lista-telefonica.exemplo" tipo="telefone" dado="(11) 9 8742-•••" alerta />
              <Resultado fr={fr} d={dE} w={850} site="busca-pessoas.exemplo" tipo="endereço" dado="Rua das Fl•••" alerta />
              <Resultado fr={fr} d={dF} w={850} site="cadastro-publico.exemplo" tipo="CPF" dado="123.•••.•••-••" alerta />
            </div>
          </Janela>
        )}
      </Palco>
      <Colar fr={fr} d={dC} />
    </AbsoluteFill>
  );
};

// ---------- 2: Google, Privacidade nos resultados sobre você ----------
const Item2 = ({ fr }) => {
  const d0 = at(48), dG = at(50), dP = at(53), dCol = at(58), dTel = at(59), dMail = at(60), dCpf = at(62), dAv = at(66), dAch = at(69), dPed = at(70);
  const Campo = ({ d, label, val }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 18, border: `2px solid ${fr >= d ? PINK : "rgba(255,255,255,0.18)"}`, background: "rgba(255,255,255,0.05)" }}>
      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY, width: 170 }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 34, color: "#fff" }}>{typed(val, fr, d, d + 10)}</span>
      {fr >= d + 12 && <span style={{ marginLeft: "auto", color: GREEN, fontSize: 38, transform: `scale(${pop(fr, d + 12, 9)})` }}>✓</span>}
    </div>
  );
  const pedido = fr >= dPed + 4;
  return (
    <AbsoluteFill>
      <Chip n={2} icon="🛡️" titulo="Google te vigia por você" sub="Privacidade nos resultados sobre você" fr={fr} d={d0} />
      <Palco top={430}>
        <Janela title="Pesquisa Google · Menu" w={920} h={880}>
          {fr >= dP + 10 && fr < dCol ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, paddingTop: 30 }}>
              <div style={{ fontSize: 150, transform: `scale(${pop(fr, dP + 10, 9) * (1 + 0.06 * Math.sin(fr / 3))})` }}>🛡️</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, color: "#fff", textAlign: "center", lineHeight: 1.15 }}>{typed("Privacidade nos resultados sobre você", fr, dP + 12, dP + 30)}</div>
              <div style={{ fontFamily: inter, fontSize: 32, color: BODY, textAlign: "center", opacity: lin(fr, dP + 26, dP + 32) }}>Veja se telefone, endereço, e-mail ou CPF aparecem na Pesquisa</div>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: PINK, padding: "20px 50px", borderRadius: 20, opacity: lin(fr, dP + 30, dP + 36), transform: `scale(${fr >= dCol - 8 ? 0.92 : 1 + 0.05 * Math.sin(fr / 3)})` }}>Vamos começar</div>
            </div>
          ) : fr < dCol ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {["Histórico de pesquisa", "Privacidade nos resultados sobre você", "Configurações", "Ajuda"].map((t, k) => {
                const hi = k === 1 && fr >= dP;
                const p = pop(fr, d0 + 3 + k * 3, 12);
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 26px", borderRadius: 20, background: hi ? PINKA(0.25) : "rgba(255,255,255,0.05)", border: `3px solid ${hi ? PINK : "transparent"}`, opacity: p, transform: `translateX(${(1 - p) * 80}px) scale(${hi ? 1 + 0.03 * Math.sin(fr / 4) : 1})` }}>
                    <span style={{ fontSize: 40 }}>{["🕘", "🛡️", "⚙️", "❔"][k]}</span>
                    <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff" }}>{t}</span>
                  </div>
                );
              })}
              {fr >= dP && (
                <div style={{ position: "absolute", left: 640 + Math.cos(fr / 5) * 6, top: 180 + interpolate(fr, [dP, dP + 10], [300, 80], clamp), fontSize: 70 }}>👆</div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 36, color: "#fff" }}>{fr < dAch ? "O que monitorar" : "Para analisar (1)"}</div>
              {fr < dAch ? (
                <>
                  <Campo d={dCol} label="nome" val="Ana Souza" />
                  <Campo d={dTel} label="telefone" val="(11) 98742-0000" />
                  <Campo d={dMail} label="e-mail" val="ana@email.com" />
                  <Campo d={dCpf} label="CPF" val="123.456.789-00" />
                  {fr >= dAv && (
                    <In fr={fr} d={dAv}>
                      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px", borderRadius: 20, background: "rgba(52,211,153,0.14)", border: `2px solid ${GREEN}` }}>
                        <span style={{ fontSize: 44, transform: `rotate(${Math.sin(fr / 2) * 18}deg)` }}>🔔</span>
                        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff" }}>Notificações ativadas</span>
                        <Toggle on={lin(fr, dAv + 2, dAv + 8)} scale={0.7} />
                      </div>
                    </In>
                  )}
                </>
              ) : (
                <>
                  <Resultado fr={fr} d={dAch} w={850} site="lista-telefonica.exemplo" tipo="telefone" dado="(11) 98742-0000" alerta={!pedido} />
                  <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 38, color: "#fff", background: pedido ? "rgba(255,255,255,0.12)" : PINK, padding: "20px 40px", borderRadius: 20, transform: `scale(${fr >= dPed && fr < dPed + 6 ? 0.92 : 1 + (pedido ? 0 : 0.04 * Math.sin(fr / 3))})` }}>Pedir remoção</div>
                  </div>
                  {pedido && (
                    <In fr={fr} d={dPed + 4}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 24px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `2px solid ${YEL}` }}>
                        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: GREY }}>Pedidos de remoção</span>
                        <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: YEL }}>⏳ Em andamento</span>
                        <div style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}><div style={{ width: `${100 * lin(fr, dPed + 6, dPed + 30)}%`, height: "100%", background: YEL }} /></div>
                      </div>
                    </In>
                  )}
                </>
              )}
            </div>
          )}
        </Janela>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 3: pedido LGPD ----------
const P3 = "Escreva um pedido de eliminação dos meus dados, com base no art. 18 da LGPD.";
const CARTA = ["Ao encarregado de dados do site,", "com base no art. 18, VI, da LGPD,", "solicito a eliminação dos meus", "dados pessoais e a confirmação", "por escrito. Atenciosamente, Ana."];
const Item3 = ({ fr }) => {
  const d0 = at(72), dS = at(74), dT = at(77), dC = at(78), dE = at(81), dL = at(98), dLei = at(99), dCusto = at(102);
  return (
    <AbsoluteFill>
      <Chip n={3} icon="⚖️" titulo="A IA escreve o pedido" sub="direito garantido pela LGPD" fr={fr} d={d0} />
      <Palco top={430}>
        {fr < dC ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <Resultado fr={fr} d={d0 + 2} site="lista-telefonica.exemplo" tipo="telefone" dado="(11) 98742-0000" alerta />
            {fr >= dS && (
              <In fr={fr} d={dS}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 64, color: "#fff", transform: `translateX(${shake(fr, dT, 14)}px)` }}>
                  {fr < dT ? "ainda no ar…" : <span style={{ color: RED }}>✗ não tirou</span>}
                </div>
              </In>
            )}
          </div>
        ) : (
          <Janela title="chat com IA" w={920} h={880}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Bolha me fr={fr} d={dC}>{typed(P3, fr, dC + 3, dL)}{fr < dL && blink(fr)}</Bolha>
              {fr >= dL && (
                <div style={{ borderRadius: 22, background: "#f5f1ff", padding: "22px 28px", transform: `scale(${pop(fr, dL, 12)})`, transformOrigin: "top left" }}>
                  <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: "#5b3fa0", marginBottom: 6 }}>📄 Pedido de eliminação</div>
                  {CARTA.map((l, k) => {
                    const a = dL + 4 + k * 6;
                    return <div key={k} style={{ fontFamily: lora, fontStyle: "italic", fontSize: 32, color: "#1a1030", lineHeight: 1.3, background: k === 1 && fr >= dLei ? "rgba(222,64,200,0.25)" : "transparent" }}>{typed(l, fr, a, a + 6)}</div>;
                  })}
                </div>
              )}
              {fr >= dCusto && (
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "center", marginTop: 6 }}>
                  <div style={{ transformOrigin: "50% 0%", transform: `rotate(${Math.sin((fr - dCusto) / 5) * 14 * Math.exp(-(fr - dCusto) / 40)}deg) scale(${pop(fr, dCusto, 9)})` }}>
                    <div style={{ width: 4, height: 30, background: GREY, margin: "0 auto" }} />
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 66, color: "#fff", background: GREEN, padding: "4px 34px", borderRadius: 18 }}>R$ 0</div>
                  </div>
                  <div style={{ marginTop: 40 }}><Pill size={32}>art. 18, § 5º</Pill></div>
                </div>
              )}
            </div>
          </Janela>
        )}
      </Palco>
      <Colar fr={fr} d={dC} />
    </AbsoluteFill>
  );
};

// ---------- 4: memória ----------
const MEMS = ["Mora em Campinas", "Trabalha com vendas", "Nome do filho: Pedro", "Toma remédio para pressão"];
const Item4 = ({ fr }) => {
  const d0 = at(106), dCh = at(108), dQ = at(114), dM = at(119), dN = at(120), dX = at(122), dMem = at(123);
  const gone = (k) => lin(fr, dMem + k * 3, dMem + k * 3 + 8);
  return (
    <AbsoluteFill>
      <Chip n={4} icon="🧠" titulo="O que a IA lembra" sub="pergunte e apague" fr={fr} d={d0} />
      <Palco top={430}>
        <Janela title="ChatGPT" w={920} h={880}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {fr < dCh && <div style={{ fontFamily: MONO, fontSize: 30, color: GREY }}>{typed("nova conversa", fr, d0 + 2, d0 + 12)}{blink(fr)}</div>}
            <Bolha me fr={fr} d={dCh}>{typed("O que você lembra sobre mim?", fr, dCh + 2, dM)}{fr < dM && blink(fr)}</Bolha>
            {fr >= dCh + 4 && fr < dM && <div style={{ fontFamily: inter, fontSize: 30, color: GREY }}>{"pensando" + ".".repeat(1 + ((fr / 4) | 0) % 3)}</div>}
            {fr >= dM && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: inter, fontSize: 32, color: BODY }}>Eu lembro que você:</div>
                {MEMS.map((m, k) => {
                  const p = pop(fr, dM + 2 + k * 3, 12), g = gone(k);
                  if (g >= 1) return null;
                  const sel = fr >= dN;
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 18, background: sel ? "rgba(255,92,122,0.16)" : "rgba(255,255,255,0.06)", border: `2px solid ${sel ? RED : "transparent"}`,
                      opacity: p * (1 - g), transform: `translateX(${(1 - p) * 80 + g * 600}px) rotate(${g * 12}deg)` }}>
                      <span style={{ fontSize: 34 }}>🧠</span>
                      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: "#fff", textDecoration: sel && fr >= dX ? "line-through" : "none" }}>{m}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {fr >= dN && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
                <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", background: fr >= dMem + 18 ? GREEN : RED, padding: "20px 44px", borderRadius: 20, transform: `scale(${fr >= dX && fr < dX + 6 ? 0.9 : pop(fr, dN, 10)})` }}>
                  {fr >= dMem + 18 ? "✓ Memória excluída" : "🗑 Excluir memória"}
                </div>
              </div>
            )}
          </div>
        </Janela>
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- 5: treino da IA ----------
const Item5 = ({ fr }) => {
  const d0 = at(124), dConv = at(127), dTr = at(128), dCh = at(133), dLig = at(139), dFab = at(141), dDes = at(142), dMod = at(145), dCl = at(149), dAj = at(151), dMel = at(153), dIA = at(157);
  const offGPT = lin(fr, dMod, dMod + 8), offCl = lin(fr, dMel, dMel + 8);
  return (
    <AbsoluteFill>
      <Chip n={5} icon="🔓" titulo="Sua conversa treina a IA" sub="e quase ninguém desliga" fr={fr} d={d0} warn />
      <Palco top={440}>
        {fr < dDes ? (
          <div style={{ position: "relative", width: 920, height: 860 }}>
            {Array.from({ length: 6 }, (_, k) => {
              const t = ((fr - dConv) / 26 + k / 6) % 1;
              if (fr < dConv) return null;
              return <div key={k} style={{ position: "absolute", left: 60 + t * 560, top: 140 + Math.sin(k * 2.1) * 90 + t * 120, fontSize: 60, opacity: 1 - t * 0.6, transform: `scale(${1 - t * 0.5})` }}>💬</div>;
            })}
            <div style={{ position: "absolute", left: 600, top: 120, width: 300, height: 300, borderRadius: 60, background: WIN, border: `4px solid ${fr >= dTr ? RED : PINK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${pop(fr, d0 + 4, 12) * (1 + 0.04 * Math.sin(fr / 3))})`, boxShadow: `0 0 ${40 + 20 * Math.sin(fr / 4)}px ${fr >= dTr ? "rgba(255,92,122,0.5)" : PINKA(0.4)}` }}>
              <div style={{ fontSize: 110 }}>🤖</div>
              <div style={{ fontFamily: MONO, fontSize: 28, color: fr >= dTr ? RED : BODY }}>{fr >= dTr ? `treino ${Math.min(100, Math.round(100 * lin(fr, dTr, dLig)))}%` : "modelo"}</div>
            </div>
            {fr >= dCh && (
              <div style={{ position: "absolute", left: 40, right: 40, top: 520 }}>
                <In fr={fr} d={dCh}>
                  <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "28px 34px", borderRadius: 28, background: WIN, border: `3px solid ${fr >= dLig ? RED : "rgba(190,160,255,0.3)"}`, transform: `translateX(${shake(fr, dLig, 12)}px)` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>Melhorar o modelo para todo mundo</div>
                      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: fr >= dFab ? RED : GREY, marginTop: 6 }}>{fr >= dFab ? "⚠ ligado por padrão" : "ChatGPT · Free, Plus e Pro"}</div>
                    </div>
                    <Toggle on={lin(fr, dLig - 4, dLig + 2)} scale={1.2} onColor={RED} />
                  </div>
                </In>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 34, alignItems: "center", position: "relative" }}>
            <div style={{ position: "absolute", zIndex: 4, fontSize: 80, left: 800, top: interpolate(fr, [dDes, dMod - 2, dMod + 8, dMel - 2, dMel + 8, dIA + 30], [420, 150, 170, 470, 490, 900], clamp), transform: `scale(${(fr >= dMod - 2 && fr < dMod + 4) || (fr >= dMel - 2 && fr < dMel + 4) ? 0.85 : 1})` }}>👆</div>
            {[
              ["ChatGPT", "Configurações › Controles de dados", "Melhorar o modelo para todo mundo", dDes, offGPT],
              ["Claude", "Configurações › Privacidade", "Ajude a melhorar nossos modelos de IA", dCl, offCl],
            ].map(([app, path, label, d, off], k) => (
              fr >= d - 2 ? (
                <In key={k} fr={fr} d={d - 2}>
                  <div style={{ width: 920, borderRadius: 30, background: WIN, border: `3px solid ${off >= 1 ? GREEN : RED}`, padding: "26px 34px", boxShadow: `0 0 50px ${off >= 1 ? "rgba(52,211,153,0.25)" : "rgba(255,92,122,0.25)"}` }}>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 34, color: k ? "#e8a26b" : BLUE }}>{app}</div>
                    <div style={{ fontFamily: MONO, fontSize: 26, color: GREY, marginTop: 4 }}>{typed(path, fr, d, d + 10)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 18 }}>
                      <div style={{ flex: 1, fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", lineHeight: 1.15 }}>{label}</div>
                      <Toggle on={1 - off} scale={1.2} onColor={RED} />
                    </div>
                    <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 32, color: off >= 1 ? GREEN : RED, marginTop: 12 }}>{off >= 1 ? "✓ desligado" : "ligado"}</div>
                    {off >= 1 && <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.1)", marginTop: 12, overflow: "hidden" }}><div style={{ width: `${100 * lin(fr, (k ? dMel : dMod) + 8, (k ? dMel : dMod) + 60)}%`, height: "100%", background: GREEN }} /></div>}
                  </div>
                </In>
              ) : null
            ))}
          </div>
        )}
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const PASSOS = ["IA te procura", "Google: remoção", "Pedido LGPD", "Apaga a memória", "Desliga o treino"];
const CTA = ({ fr }) => {
  const d0 = at(158), dL = at(163), dC = at(164), dS = at(167);
  return (
    <AbsoluteFill>
      <Big fr={fr} d={d0} top={200} size={96}>5 comandos</Big>
      <Palco top={420}>
        <div style={{ width: 880, borderRadius: 30, background: WIN, border: `2px solid ${PINKA(0.6)}`, padding: "22px 30px", display: "flex", flexDirection: "column", gap: 12 }}>
          {PASSOS.map((p, k) => {
            const ok = fr >= d0 + 3 + k * 4;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: ok ? GREEN : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 800, fontSize: 32, color: "#fff", transform: `scale(${ok ? pop(fr, d0 + 3 + k * 4, 9) : 1})` }}>{ok ? "✓" : k + 1}</div>
                <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff" }}>{p}</span>
              </div>
            );
          })}
        </div>
        {fr >= dL && <In fr={fr} d={dL}><Pill size={42} c={PINK} bg={PINKA(0.15)}>📝 tudo na legenda ↓</Pill></In>}
        <div style={{ width: 880, display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderRadius: 26, background: WIN, border: `2px solid ${fr >= dC ? PINK : "rgba(190,160,255,0.28)"}`, opacity: lin(fr, dC - 6, dC) }}>
          <span style={{ fontSize: 50 }}>💬</span>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 52, color: "#fff" }}>{typed("DADOS", fr, dC, dC + 10)}{blink(fr)}</span>
          {fr >= dC + 14 && <span style={{ marginLeft: "auto", fontSize: 50, transform: `scale(${pop(fr, dC + 14, 9)})` }}>❤️</span>}
        </div>
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 48, color: "#fff", background: fr >= dS + 6 ? "rgba(255,255,255,0.15)" : PINK, padding: "16px 60px", borderRadius: 20, transform: `scale(${fr >= dS + 6 ? pop(fr, dS + 6, 9) : 1 + 0.05 * Math.sin(fr / 4)})`, opacity: lin(fr, dS - 6, dS) }}>{fr >= dS + 6 ? "✓ Seguindo" : "Seguir"}</div>
      </Palco>
    </AbsoluteFill>
  );
};

const Reacao = ({ fr, a, b, pose, top = 1150 }) => {
  if (fr < a || fr > b + 12) return null;
  const pin = pop(fr, a, 12), pout = ease(lin(fr, b, b + 12));
  return <Img src={staticFile(`phanterai/pantera/${pose}.png`)} style={{ position: "absolute", height: 330, right: 20 - (1 - pin) * 420 - pout * 420, top }} />;
};

// ---------- legendas ----------
const KEY = new Set(["telefone", "cpf", "google", "cinco", "comandos", "copia", "cola", "dados", "quinto", "desliga", "ia", "achar", "pesquise", "sites", "privacidade", "remocao", "avisa", "eliminacao", "lgpd", "dezoito", "custo", "chatgpt", "lembra", "excluir", "memoria", "treina", "fabrica", "claude", "legenda", "comenta", "segue", "endereco", "email", "lei"]);
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const NUM = { um: "1", dois: "2", tres: "3", quatro: "4", cinco: "5" };
const buildChunks = (words) => {
  const toks = [];
  for (let k = 0; k < words.length; k++) {
    const x = words[k], n = norm(x.w);
    const nx = words[k + 1] && norm(words[k + 1].w), nx2 = words[k + 2] && norm(words[k + 2].w), nx3 = words[k + 3] && norm(words[k + 3].w);
    const tail = (w) => (/[.,!?:;]$/.test(w.w) ? w.w.slice(-1) : "");
    if (n === "numero" && NUM[nx]) { toks.push({ t: "Nº " + NUM[nx] + tail(words[k + 1]), s: x.s, e: words[k + 1].e, key: true }); k += 1; continue; }
    if (n === "l" && nx === "g" && nx2 === "p" && nx3 === "d") { toks.push({ t: "LGPD" + tail(words[k + 3]), s: x.s, e: words[k + 3].e, key: true }); k += 3; continue; }
    if (n === "chat" && nx === "g" && nx2 === "p" && nx3 === "t") { toks.push({ t: "ChatGPT" + tail(words[k + 3]), s: x.s, e: words[k + 3].e, key: true }); k += 3; continue; }
    if (n === "dezoito") { toks.push({ t: "art. 18", s: x.s, e: x.e, key: true }); continue; }
    if (n === "cinco" && nx === "comandos") { toks.push({ t: "5", s: x.s, e: x.e, key: true }); continue; }
    toks.push({ t: x.w.replace(/^"|"(?=[.,!?:;]*$)/g, ""), s: x.s, e: x.e });
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
        const shown = w.t.replace(/\.\.\.$/, "").replace(/[,!?:;…"]+$/g, "").replace(/\.$/, "").replace(/"/g, "");
        const key = w.key || KEY.has(norm(shown));
        return key
          ? <span key={i} style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500, fontSize: 82, color: "#fff", background: PINK, padding: "0 18px", borderRadius: 14, lineHeight: 1.2 }}>{shown}</span>
          : <span key={i} style={{ fontFamily: inter, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.2, textShadow: "0 4px 22px rgba(0,0,0,0.9)" }}>{shown}</span>;
      })}
    </div>
  );
};

export const ShortTirarDados = ({ words, endSec }) => {
  const fr = useCurrentFrame();
  W = {}; (words || []).forEach((x) => { W[x.i] = x; });
  if (!words || !words.length) return <AbsoluteFill style={{ background: "#0b0618" }} />;
  const end = Math.round(endSec * FPS);
  const B = [0, at(24), at(48), at(72), at(106), at(124), at(158), end];
  const scenes = [Hook, Item1, Item2, Item3, Item4, Item5, CTA];
  const chunks = buildChunks(words);
  return (
    <AbsoluteFill>
      <Fundo fr={fr} />
      <Logo fr={fr} />
      {scenes.map((S, k) => <Cena key={k} first={k === 0} fr={fr} a={B[k]} b={B[k + 1]}><S fr={fr} /></Cena>)}
      <Reacao fr={fr} a={0} b={at(8)} pose="surpresa" top={1170} />
      <Reacao fr={fr} a={at(139)} b={at(141) + 20} pose="apontando" top={1200} />
      <Reacao fr={fr} a={at(164)} b={end} pose="comemorando" top={1180} />
      {fr >= at(1) && <Legendas chunks={chunks} fr={fr} />}
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSIC)} loop volume={0.2} />
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={1} /></Sequence>
      <Sequence from={0} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(4)} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(8)} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.45} /></Sequence>
      <Sequence from={at(9)} durationInFrames={30}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} /></Sequence>
      <Sequence from={at(20)} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.45} /></Sequence>
      {B.slice(1, -1).map((b, k) => <Sequence key={k} from={Math.max(0, b - 4)} durationInFrames={20}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.25} /></Sequence>)}
      {[at(31), at(78), at(53), at(70), at(122), at(145), at(153)].map((b, k) => <Sequence key={"p" + k} from={b} durationInFrames={15}><Audio src={staticFile("sfx/pop.mp3")} volume={0.35} /></Sequence>)}
      {[at(102), at(123) + 18, at(167) + 6].map((b, k) => <Sequence key={"d" + k} from={b} durationInFrames={20}><Audio src={staticFile("sfx/ding.mp3")} volume={0.3} /></Sequence>)}
      <Sequence from={at(139)} durationInFrames={15}><Audio src={staticFile("sfx/error.mp3")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

export const CapaTirarDados = () => (
  <AbsoluteFill>
    <Fundo fr={40} />
    <Logo fr={999} />
    <div style={{ position: "absolute", top: 300, left: 50, right: 50, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: lora, fontStyle: "italic", fontSize: 130, color: "#fff", background: RED, padding: "0 40px", borderRadius: 26, transform: "rotate(-3deg)" }}>seu CPF</div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1.05, marginTop: 36, letterSpacing: -2 }}>pode estar<br />no Google</div>
      <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 58, color: BODY, marginTop: 22 }}>5 comandos para tirar, copia e cola</div>
    </div>
    <div style={{ position: "absolute", top: 1010, left: 90, display: "flex", flexDirection: "column", gap: 18 }}>
      {[["telefone", "(11) 9 8742-••••"], ["CPF", "123.•••.•••-••"]].map(([t, d], k) => (
        <div key={k} style={{ width: 700, borderRadius: 24, background: WIN, border: `3px solid ${RED}`, padding: "18px 26px", display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: GREY }}>{t}</span>
          <span style={{ fontFamily: MONO, fontSize: 38, color: "#fff" }}>{d}</span>
          <span style={{ marginLeft: "auto", fontSize: 40 }}>⚠️</span>
        </div>
      ))}
    </div>
    <Img src={staticFile("phanterai/pantera/surpresa.png")} style={{ position: "absolute", height: 340, right: 20, top: 1290 }} />
  </AbsoluteFill>
);
