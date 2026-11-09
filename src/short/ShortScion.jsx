// Reels/Short 9:16 — "Anthropic Scion: o Git não deu conta" (rodada video-curto 2026-11-07-2026).
// Roteiro: out/video-curto/2026-11-07-2026/roteiro-final.md. Marca PhanterAI (fundo #080810, magenta).
// Cada cena dura a sua locução (voz-eleven/cNN.mp3 (ElevenLabs, voz do Rod)) + respiro; as transições ficam no respiro entre as falas.
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { Sfx } from "../components/Sfx";

const sora = loadSora("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
const inter = loadInter("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
const serif = loadSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const SC_SLUG = "2026-11-07-2026";
export const SC_FPS = 30;
const F = SC_FPS;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rnd = (i, s = 1) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const C = {
  bg: "#080810",
  card: "#0F0F1A",
  text: "#F8FAFC",
  apoio: "#CBD5E1",
  mudo: "#94A3B8",
  m1: "#B0179F",
  m2: "#FF1FBF",
  m3: "#FF5BD6",
  alerta: "#FF2E63",
};
const GRAD = `linear-gradient(90deg, ${C.m1} 0%, ${C.m2} 55%, ${C.m3} 100%)`;
const GRAD_CLARO = `linear-gradient(90deg, ${C.m2} 0%, ${C.m3} 100%)`;
const gradClaro = { textShadow: "none", filter: "drop-shadow(0 4px 20px rgba(255,31,191,0.5))", background: GRAD_CLARO, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
const gradText = { background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
const sombra = "0 6px 30px rgba(0,0,0,0.65)";

// ---------- cenas: fala da locução (como foi lida), legendas (texto certo) e transição de entrada ----------
const CENAS = [
  {
    id: "c01",
    fala: "O Guit não deu conta. A Ântropic criou outro.",
    legendas: [],
  },
  {
    id: "c02",
    trans: "glitch",
    T: 8,
    fala: "Em maio, ela fazia uns dois mil e quinhentos mérdjis por dia. Em setembro, mais de trinta mil. Segundo a própria Ântropic.",
    legendas: [
      ["Em maio, ela fazia uns", "Em maio"],
      ["2.500 merges por dia.", "dois mil"],
      ["Em setembro, mais de 30 mil.", "Em setembro"],
      ["Segundo a própria Anthropic.", "Segundo"],
    ],
  },
  {
    id: "c03",
    trans: "parede",
    T: 16,
    fala: "Os agentes de IA escrevem tanto código que escrever deixou de ser o problema.",
    legendas: [
      ["Os agentes de IA escrevem", "Os agentes"],
      ["tanto código que escrever", "tanto"],
      ["deixou de ser o problema.", "deixou"],
    ],
  },
  {
    id: "c04",
    trans: "portal",
    T: 15,
    fala: "O problema virou a estrutura feita para gente: controle de versão, teste, juntar código.",
    legendas: [
      ["O problema virou a estrutura", "O problema"],
      ["feita para gente:", "feita"],
      ["controle de versão, teste,", "controle"],
      ["juntar código.", "juntar"],
    ],
  },
  {
    id: "c05",
    trans: "flip",
    T: 16,
    fala: "A resposta da Ântropic foi o Sáion. Os agentes estão sempre online, então o servidor guarda o histórico e cada máquina leva só um quéxe pequeno.",
    legendas: [
      ["A resposta da Anthropic", "A resposta"],
      ["foi o Scion.", "foi o"],
      ["Os agentes estão sempre online,", "Os agentes"],
      ["então o servidor guarda o histórico", "então"],
      ["e cada máquina leva", "e cada"],
      ["só um cache pequeno.", "só um"],
    ],
  },
  {
    id: "c06",
    trans: "zoom",
    T: 13,
    fala: "Segundo a Ântropic, a infraestrutura ficou duzentas vezes menor, e baixar o código para teste passou de minutos para segundos.",
    legendas: [
      ["Segundo a Anthropic,", "Segundo"],
      ["a infraestrutura ficou", "a infra"],
      ["200 vezes menor,", "duzentas"],
      ["e baixar o código para teste", "e baixar"],
      ["passou de minutos para segundos.", "passou"],
    ],
  },
  {
    id: "c07",
    trans: "curl",
    T: 17,
    fala: "E quem construiu? Sete pessoas. Em cinco meses.",
    legendas: [],
  },
  {
    id: "c08",
    trans: "shatter",
    T: 18,
    fala: "Só que atenção: o Sáion é interno. Não dá para baixar, e a própria Ântropic diz que ele não substitui o Guit no uso geral.",
    legendas: [
      ["Só que atenção:", "Só que"],
      ["o Scion é interno.", "o Sáion"],
      ["Não dá para baixar,", "Não dá"],
      ["e a própria Anthropic diz que ele", "e a própria"],
      ["não substitui o Git no uso geral.", "não substitui"],
    ],
  },
  {
    id: "c09",
    trans: "wipe",
    T: 10,
    fala: "A lição vale para qualquer negócio: quando a IA acelera uma parte do trabalho, o gargalo muda de lugar. Onde está o seu? Conta aí.",
    legendas: [
      ["Vale para qualquer negócio:", "A lição"],
      ["quando a IA acelera", "quando"],
      ["uma parte do trabalho,", "uma parte"],
      ["o gargalo muda de lugar.", "o gargalo"],
      ["Onde está o seu?", "Onde"],
      ["Conta aí.", "Conta"],
    ],
  },
];

// ---------- linha do tempo (segundos) a partir da duração de cada locução ----------
const LEAD0 = 0.12;
const LEAD = 0.08;
export const linhaDoTempo = (voz) => {
  let t = 0;
  const cenas = CENAS.map((c, i) => {
    const lead = i === 0 ? LEAD0 : LEAD;
    const prox = CENAS[i + 1];
    const pad = prox ? Math.max(0.36, prox.T / F + 0.06) : 0.75;
    const L = lead + voz[i] + pad;
    const e = { ini: t, voz: t + lead, vdur: voz[i], fim: t + L, L };
    t += L;
    return e;
  });
  return { cenas, total: t };
};

// Ajudante de tempo local da cena (frames a partir do início da cena).
const mkH = (i, e) => {
  const fala = CENAS[i].fala;
  const low = fala.toLowerCase();
  const vI = e.voz - e.ini;
  return {
    L: Math.round(e.L * F),
    v0: Math.round(vI * F),
    vfim: Math.round((vI + e.vdur) * F),
    v: (frac) => Math.round((vI + e.vdur * frac) * F),
    w: (pal, n = 0) => {
      let idx = -1;
      for (let k = 0; k <= n; k++) idx = low.indexOf(pal.toLowerCase(), idx + 1);
      if (idx < 0) throw new Error(`"${pal}" não está na fala da ${CENAS[i].id}`);
      return Math.round((vI + (e.vdur * idx) / fala.length) * F);
    },
  };
};

// ---------- blocos ----------
const Fundo = ({ f, cor = C.bg, glow = 1 }) => (
  <AbsoluteFill style={{ background: cor, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        backgroundPosition: `0 ${(f * 0.6) % 72}px`,
      }}
    />
    <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", left: -380 + Math.sin(f / 40) * 90, top: 120 + Math.cos(f / 55) * 80, background: `radial-gradient(circle, ${C.m1}55 0%, transparent 65%)`, opacity: glow }} />
    <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", right: -360 - Math.sin(f / 50) * 80, bottom: 160 + Math.cos(f / 36) * 90, background: `radial-gradient(circle, ${C.m2}40 0%, transparent 65%)`, opacity: glow }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
  </AbsoluteFill>
);

const pop = (f, em, cfg = { damping: 11, mass: 0.6, stiffness: 160 }) => (f < em ? 0 : spring({ frame: f - em, fps: F, config: cfg }));

const Rotulo = ({ children, f, em = 0, y = 250, cor = C.m3 }) => {
  const s = pop(f, em);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s, transform: `translateY(${(1 - s) * -20}px)` }}>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: cor, padding: "8px 22px", border: `2px solid ${C.m2}66`, borderRadius: 999, background: "rgba(15,15,26,0.8)" }}>{children}</div>
    </div>
  );
};

// Bloco de texto que entra com mola (sobe e cresce).
const Linha = ({ children, f, em = 0, size = 80, cor = C.text, font = sora, peso = 800, style = {}, de = 40 }) => {
  const s = pop(f, em, { damping: 12, mass: 0.7, stiffness: 140 });
  if (s <= 0) return null;
  return (
    <div style={{ fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.06, color: cor, textAlign: "center", textShadow: sombra, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * de}px) scale(${0.85 + 0.15 * s})`, ...style }}>
      {children}
    </div>
  );
};
const G = ({ children }) => <span style={{ ...gradText, textShadow: "none", filter: "drop-shadow(0 4px 18px rgba(255,31,191,0.45))" }}>{children}</span>;
const Serif = ({ children, size, cor }) => (
  <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: size, color: cor ?? C.m3, textShadow: "0 0 30px rgba(255,31,191,0.5)" }}>{children}</span>
);

const Pant = ({ pose, x, y, w, f, em = 0, sai = null, bob = true, extra = "" }) => {
  if (f < em) return null;
  const s = pop(f, em, { damping: 10, mass: 0.6, stiffness: 150 });
  const o = sai != null ? interpolate(f, [sai, sai + 7], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  const by = bob ? Math.sin(f / 9) * 10 : 0;
  const rot = bob ? Math.sin(f / 14) * 3 : 0;
  return (
    <Img
      src={staticFile(`pantera/${pose}.png`)}
      style={{ position: "absolute", left: x, top: y, width: w, transform: `translate(-50%, -50%) translateY(${by}px) rotate(${rot}deg) scale(${s * (0.6 + 0.4 * o)}) ${extra}`, opacity: o, filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.6))" }}
    />
  );
};

const Selo = ({ children, f, em, y, size = 26 }) => {
  const s = pop(f, em);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s }}>
      <div style={{ fontFamily: mono, fontWeight: 500, fontSize: size, color: C.apoio, padding: "6px 18px", borderRadius: 10, background: "rgba(15,15,26,0.85)", border: `1px solid ${C.m2}55`, transform: `scale(${0.8 + 0.2 * s})` }}>{children}</div>
    </div>
  );
};

// ---------- terminal (C01 e fecho em loop na C09) ----------
const LOG = [
  ["$ git merge agent/refactor-0412", C.text],
  ["Auto-merging services/api/routes.ts", C.mudo],
  ["$ git merge agent/tests-0413", C.text],
  ["Merge made by the 'ort' strategy.", C.mudo],
  ["$ git merge agent/docs-0414", C.text],
  ["CONFLICT (content): merge conflict", C.m3],
  ["$ git merge agent/fix-0415", C.text],
  ["Auto-merging web/app/page.tsx", C.mudo],
  ["$ git merge agent/perf-0416", C.text],
  ["waiting for lock on index...", C.m3],
  ["$ git merge agent/ui-0417", C.text],
  ["Auto-merging core/queue.ts", C.mudo],
  ["$ git merge agent/infra-0418", C.text],
  ["CONFLICT (content): merge conflict", C.m3],
  ["$ git merge agent/auth-0419", C.text],
  ["waiting for lock on index...", C.m3],
];
const CALMO = [
  ["$ scion status", C.text],
  ["servidor: histórico completo", C.mudo],
  ["cliente: cache local", C.mudo],
  ["✓ agentes sincronizados", C.m3],
];
const Terminal = ({ f, L, modo = "caos", glitchEm = 0 }) => {
  const caos = modo === "caos";
  const n = caos ? Math.min(LOG.length * 3, Math.floor(Math.pow(Math.max(0, f) / 2.2, 1.25))) : CALMO.length;
  const travou = caos && f >= glitchEm;
  const linhas = [];
  for (let k = Math.max(0, n - 11); k < n; k++) linhas.push(caos ? LOG[k % LOG.length] : CALMO[k]);
  const jit = travou ? (rnd(Math.floor(f / 2), 3) - 0.5) * 22 : 0;
  return (
    <div style={{ position: "absolute", left: 80, top: 340, width: 920, height: 560, borderRadius: 28, background: C.card, border: `2px solid ${travou ? C.alerta : C.m2 + "66"}`, overflow: "hidden", boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${travou ? 60 : 30}px ${travou ? C.alerta + "66" : C.m2 + "22"}`, transform: `translateX(${jit}px)` }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", gap: 14, padding: "0 26px", borderBottom: `1px solid ${C.m2}33` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
        <div style={{ marginLeft: 18, fontFamily: mono, fontSize: 24, color: C.mudo }}>~/monorepo — {caos ? "git" : "scion"}</div>
      </div>
      <div style={{ padding: "18px 30px", fontFamily: mono, fontWeight: 500, fontSize: 30, lineHeight: "41px" }}>
        {linhas.map(([t, c], k) => (
          <div key={k} style={{ color: c, whiteSpace: "nowrap" }}>{t}</div>
        ))}
        {!travou ? <span style={{ display: "inline-block", width: 16, height: 32, background: C.m2, opacity: Math.floor(f / 8) % 2 ? 0 : 1 }} /> : null}
      </div>
      {travou ? (
        <>
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 70 + rnd(k + Math.floor(f / 3), 7) * 460, height: 10 + rnd(k, 2) * 36, background: k % 2 ? `${C.alerta}88` : `${C.m2}77`, transform: `translateX(${(rnd(k + f, 5) - 0.5) * 120}px)`, mixBlendMode: "screen" }} />
          ))}
          <AbsoluteFill style={{ background: `${C.alerta}22` }} />
        </>
      ) : null}
    </div>
  );
};

// ---------- C01 · gancho ----------
const C01 = ({ f, h }) => {
  const zoom = interpolate(f, [0, h.L], [1, 1.07], clamp);
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 60%" }}>
        <Terminal f={f + 12} L={h.L} glitchEm={h.w("outro") - 4} />
        <Pant pose="surpresa" x={interpolate(pop(f, h.v(0.25)), [0, 1], [1260, 930])} y={880} w={290} f={f} em={0} bob />
        <div style={{ position: "absolute", top: 990, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Linha f={f} em={h.w("o guit") } size={92}>O GIT NÃO<br />DEU CONTA.</Linha>
          <Linha f={f} em={h.w("a ântropic")} size={78}>A ANTHROPIC CRIOU</Linha>
          <Linha f={f} em={h.w("outro") - 2} size={150} style={{ marginTop: -6 }}>
            <G>OUTRO.</G>
          </Linha>
        </div>
      </AbsoluteFill>
      <Rotulo f={f} em={0}>ANTHROPIC · SCION</Rotulo>
    </AbsoluteFill>
  );
};

// ---------- C02 · o dado ----------
const fmt = (n) => Math.round(n).toLocaleString("pt-BR");
const C02 = ({ f, h }) => {
  const tMaio = h.w("dois mil");
  const tSet = h.w("trinta");
  const vMaio = interpolate(f, [tMaio - 8, tMaio + 10], [0, 2500], clamp);
  const pSet = interpolate(f, [tSet - 10, tSet + 22], [0, 1], { ...clamp, easing: ease });
  const vSet = lerp(2500, 30000, pSet);
  const morph = pSet > 0 && pSet < 1;
  const cards = [
    { x: 70, rot: "MAIO", val: fmt(vMaio), em: h.w("em maio"), hot: false },
    { x: 560, rot: "SETEMBRO", val: fmt(vSet) + (pSet >= 1 ? "+" : ""), em: h.w("em setembro") - 6, hot: true },
  ];
  // barras: maio (pequena) e setembro (estoura o quadro no fim)
  const base = 1380;
  const hMaio = interpolate(f, [tMaio - 8, tMaio + 10], [0, 46], clamp);
  const hSet = lerp(46, 640, pSet) + interpolate(f, [tSet + 22, h.L], [0, 700], { ...clamp, easing: (t) => t * t });
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Rotulo f={f} em={2}>MERGES POR DIA</Rotulo>
      {/* barras */}
      <div style={{ position: "absolute", left: 120, width: 240, top: base - hMaio, height: hMaio, borderRadius: "16px 16px 0 0", background: `${C.mudo}aa` }} />
      <div style={{ position: "absolute", left: 420, width: 280, top: base - hSet, height: hSet, borderRadius: "18px 18px 0 0", background: `linear-gradient(0deg, ${C.m1}, ${C.m2} 60%, ${C.m3})`, boxShadow: `0 0 ${40 + pSet * 60}px ${C.m2}88` }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: base, height: 4, background: `${C.text}55` }} />
      <div style={{ position: "absolute", left: 120, width: 240, top: base + 14, fontFamily: mono, fontSize: 26, color: C.mudo, textAlign: "center" }}>maio</div>
      <div style={{ position: "absolute", left: 420, width: 280, top: base + 14, fontFamily: mono, fontSize: 26, color: C.m3, textAlign: "center" }}>setembro</div>
      {/* cartões */}
      {cards.map((c) => {
        const s = pop(f, c.em);
        return (
          <div key={c.rot} style={{ position: "absolute", left: c.x, top: 350, width: 450, height: 250, borderRadius: 26, background: C.card, border: `2px solid ${c.hot ? C.m2 : C.m2 + "55"}`, opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.8 + 0.2 * s})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: c.hot && pSet >= 1 ? `0 0 50px ${C.m2}66` : "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: C.mudo }}>{c.rot}</div>
            <div style={{ fontFamily: sora, fontWeight: 800, fontSize: c.hot ? 104 : 96, color: C.text, ...(c.hot ? gradText : {}), filter: c.hot && morph ? `blur(${(1 - Math.abs(pSet - 0.5) * 2) * 2.5}px)` : "none", fontVariantNumeric: "tabular-nums" }}>{c.val}</div>
          </div>
        );
      })}
      <Pant pose="apontando" x={890} y={1210} w={330} f={f} em={h.w("em maio")} />
      <Selo f={f} em={h.w("segundo")} y={1440}>segundo a Anthropic · 13/10/2026</Selo>
    </AbsoluteFill>
  );
};

// ---------- C03 · o gargalo mudou ----------
const C03 = ({ f, h }) => {
  const esc = interpolate(f, [0, 16], [1, 0], clamp);
  const tRisco = h.w("escrever deixou");
  const risco = interpolate(f, [tRisco, tRisco + 9], [0, 1], { ...clamp, easing: ease });
  const tGarg = h.w("problema") - 4;
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.m2}, ${C.m1})`, opacity: esc }} />
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <Linha f={f} em={h.w("escrevem") - 6} size={98}>ESCREVER<br />CÓDIGO</Linha>
          <div style={{ position: "absolute", left: -30, top: "46%", height: 26, width: `${risco * 112}%`, background: GRAD, borderRadius: 14, transform: "rotate(-6deg)", boxShadow: `0 0 30px ${C.m2}` }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0 }}>
        <Linha f={f} em={tGarg - 6} size={58} cor={C.apoio}>NÃO É MAIS O</Linha>
      </div>
      {/* GARGALO com o "O" em posição fixa (centro 860, 935): é dele que nasce o portal da C04 */}
      {(() => {
        const s = pop(f, tGarg, { damping: 10, mass: 0.7, stiffness: 140 });
        if (s <= 0) return null;
        const pulse = 1 + Math.max(0, Math.sin((f - tGarg) / 6)) * 0.04;
        return (
          <div style={{ position: "absolute", top: 850, left: 0, width: 1080, height: 170, opacity: Math.min(1, s * 1.5), transform: `scale(${0.8 + 0.2 * s})`, transformOrigin: "860px 85px" }}>
            <div style={{ position: "absolute", right: 1080 - 790, top: 0, fontFamily: sora, fontWeight: 800, fontSize: 150, lineHeight: "170px", ...gradText }}>GARGAL</div>
            <div style={{ position: "absolute", left: 790, width: 140, top: 0, textAlign: "center", fontFamily: sora, fontWeight: 800, fontSize: 150, lineHeight: "170px", ...gradText, transform: `scale(${pulse})` }}>O</div>
          </div>
        );
      })()}
      <Pant pose="pensando" x={interpolate(pop(f, 10), [0, 1], [-250, 250])} y={1250} w={380} f={f} em={0} />
    </AbsoluteFill>
  );
};

// ---------- C04 · onde está o problema ----------
const Icone = ({ tipo }) => {
  const st = { stroke: C.m3, strokeWidth: 9, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (tipo === "versao")
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="35" cy="22" r="12" {...st} /><circle cx="35" cy="98" r="12" {...st} /><circle cx="88" cy="40" r="12" {...st} />
        <path d="M35 34 V86 M88 52 C88 75 35 62 35 86" {...st} />
      </svg>
    );
  if (tipo === "teste")
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <rect x="18" y="18" width="84" height="84" rx="18" {...st} />
        <path d="M38 62 L54 78 L84 44" {...st} />
      </svg>
    );
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <path d="M20 25 C60 25 60 60 100 60 M20 95 C60 95 60 60 100 60 M84 46 L100 60 L84 74" {...st} />
    </svg>
  );
};
const C04 = ({ f, h }) => {
  const tTreme = h.w("juntar") + 4;
  const treme = f >= tTreme ? 1 : 0;
  const cards = [
    { tipo: "versao", rot: ["CONTROLE", "DE VERSÃO"], em: h.w("controle") },
    { tipo: "teste", rot: ["TESTE"], em: h.w("teste") },
    { tipo: "merge", rot: ["MERGE"], em: h.w("juntar") },
  ];
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Rotulo f={f} em={-14}>ESTRUTURA FEITA PARA GENTE</Rotulo>
      <Pant pose="triste" x={540} y={1250} w={300} f={f} em={-10} />
      {cards.map((c, k) => {
        const s = pop(f, c.em, { damping: 11, mass: 0.6, stiffness: 150 });
        const jx = treme ? (rnd(f * 3 + k, 1) - 0.5) * 18 : 0;
        const jy = treme ? (rnd(f * 3 + k, 2) - 0.5) * 12 : 0;
        const x = 60 + k * 330;
        return (
          <div key={c.tipo} style={{ position: "absolute", left: x, top: 470, width: 300, height: 400, borderRadius: 26, background: C.card, border: `2px solid ${treme ? C.alerta + "aa" : C.m2 + "66"}`, opacity: s, transform: `translate(${jx}px, ${jy + (1 - s) * 90}px) rotate(${(1 - s) * (k - 1) * 12 + (treme ? (rnd(f + k, 4) - 0.5) * 4 : 0)}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
            <Icone tipo={c.tipo} />
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.text, textAlign: "center", lineHeight: 1.25 }}>
              {c.rot.map((r) => <div key={r}>{r}</div>)}
            </div>
            {/* fumaça de pixels */}
            {treme
              ? Array.from({ length: 10 }).map((_, j) => {
                  const t = (f - tTreme + j * 3) % 24;
                  return <div key={j} style={{ position: "absolute", left: 30 + rnd(j, k) * 240, top: -10 - t * 7, width: 12, height: 12, background: j % 2 ? C.m3 : C.mudo, opacity: 1 - t / 24 }} />;
                })
              : null}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 960, left: 0, right: 0 }}>
        <Linha f={f} em={h.w("feita")} size={58} font={inter} peso={700} cor={C.apoio}>
          feita para <Serif size={92}>escala humana</Serif>
        </Linha>
      </div>
    </AbsoluteFill>
  );
};

// ---------- C05 · a ideia do Scion ----------
const CX = 540;
const CY = 930;
const NOS = [
  ...Array.from({ length: 8 }).map((_, k) => ({ r: 250, a: (k / 8) * Math.PI * 2 + 0.2 })),
  ...Array.from({ length: 12 }).map((_, k) => ({ r: 390, a: (k / 12) * Math.PI * 2 - 0.1 })),
].map((n) => ({ x: CX + Math.cos(n.a) * n.r, y: CY + Math.sin(n.a) * n.r * 0.92 }));
const NO_ZOOM = NOS[19]; // nó por onde a câmera mergulha (zoom through)
const C05 = ({ f, h }) => {
  const tTit = h.w("sáion") - 3;
  const tLinhas = h.w("os agentes");
  const tServ = h.w("servidor");
  const tCache = h.w("quéxe");
  const some = h.w("pequeno") + 6;
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <Linha f={f} em={tTit} size={170} style={{ letterSpacing: 8 }}><G>SCION</G></Linha>
      </div>
      <div style={{ position: "absolute", top: 440, left: 0, right: 0 }}>
        <Linha f={f} em={tTit + 8} size={30} font={mono} peso={500} cor={C.apoio} de={20}>controle de versão interno da Anthropic</Linha>
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
        {NOS.map((n, k) => {
          const em = tLinhas + k * 2;
          const p = interpolate(f, [em, em + 8], [0, 1], clamp);
          if (p <= 0) return null;
          const x2 = lerp(CX, n.x, p);
          const y2 = lerp(CY, n.y, p);
          const pulso = ((f - em) % 26) / 26;
          return (
            <g key={k}>
              <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={C.m2} strokeOpacity={0.45} strokeWidth={3} />
              {p >= 1 ? <circle cx={lerp(CX, n.x, pulso)} cy={lerp(CY, n.y, pulso)} r={7} fill={C.m3} opacity={1 - pulso * 0.6} /> : null}
              {p >= 1 ? <circle cx={n.x} cy={n.y} r={k === 19 ? 26 : 20} fill={C.card} stroke={C.m3} strokeWidth={4} /> : null}
            </g>
          );
        })}
        {(() => {
          const s = pop(f, -14);
          return <circle cx={CX} cy={CY} r={110 * s} fill="url(#gNo)" stroke={C.m3} strokeWidth={5} />;
        })()}
        <defs>
          <radialGradient id="gNo"><stop offset="0%" stopColor={C.m2} /><stop offset="100%" stopColor={C.m1} /></radialGradient>
        </defs>
      </svg>
      <Pant pose="feliz" x={CX} y={CY - 20} w={230} f={f} em={-10} sai={some} />
      {f >= some + 4 ? (
        <div style={{ position: "absolute", left: CX - 100, top: CY - 30, width: 200, textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.text, opacity: pop(f, some + 4) }}>servidor</div>
      ) : null}
      <div style={{ position: "absolute", top: 1360, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {[
          ["SERVIDOR = histórico", tServ],
          ["CLIENTE = cache local", tCache],
        ].map(([t, em]) => {
          const s = pop(f, em);
          return (
            <div key={t} style={{ fontFamily: mono, fontWeight: 700, fontSize: 27, color: C.text, padding: "10px 18px", borderRadius: 12, background: C.card, border: `2px solid ${C.m2}88`, opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>{t}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- C06 · o resultado ----------
const C06 = ({ f, h }) => {
  const t200 = h.w("duzentas");
  const enc = interpolate(f, [t200 - 6, t200 + 16], [1, 0.05], { ...clamp, easing: ease });
  const tMin = h.w("minutos");
  const tSeg = h.w("segundos");
  // ponteiro: gira rápido e desacelera até parar em "segundos"
  const giro = interpolate(f, [0, tSeg], [0, 1], clamp);
  const ang = 360 * 9 * (1 - Math.pow(1 - giro, 3));
  const risco = interpolate(f, [tSeg - 4, tSeg + 6], [0, 1], clamp);
  const salto = interpolate(f, [h.w("e baixar"), h.w("e baixar") + 22], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Selo f={f} em={0} y={260} size={28}>segundo a Anthropic</Selo>
      <div style={{ position: "absolute", left: 538, top: 380, width: 4, height: 900, background: `linear-gradient(${C.m2}00, ${C.m2}aa, ${C.m2}00)` }} />
      {/* esquerda: infraestrutura encolhe */}
      <div style={{ position: "absolute", left: 270 - 170, top: 640 - 170, width: 340, height: 340, borderRadius: 26 * enc + 6, background: `linear-gradient(135deg, ${C.m1}, ${C.m2})`, transform: `scale(${enc * pop(f, 4)})`, boxShadow: `0 0 60px ${C.m2}66`, overflow: "hidden" }}>
        {Array.from({ length: 6 }).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 30, right: 30, top: 30 + k * 50, height: 30, borderRadius: 8, background: "rgba(8,8,16,0.45)" }}>
            <div style={{ position: "absolute", right: 14, top: 9, width: 12, height: 12, borderRadius: 6, background: k % 2 ? C.m3 : "#7CFFB2" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 20, width: 500, top: 860 }}>
        <Linha f={f} em={t200 + 6} size={170}><G>200x</G></Linha>
        <Linha f={f} em={t200 + 12} size={64}>MENOR</Linha>
      </div>
      {/* direita: cronômetro */}
      <svg width="400" height="400" viewBox="0 0 400 400" style={{ position: "absolute", left: 810 - 200, top: 640 - 200, transform: `scale(${pop(f, 6)})` }}>
        <circle cx="200" cy="215" r="160" fill={C.card} stroke={C.m2} strokeWidth="10" />
        <rect x="180" y="20" width="40" height="30" rx="8" fill={C.m2} />
        {Array.from({ length: 12 }).map((_, k) => {
          const a = (k / 12) * Math.PI * 2;
          return <line key={k} x1={200 + Math.sin(a) * 130} y1={215 - Math.cos(a) * 130} x2={200 + Math.sin(a) * 148} y2={215 - Math.cos(a) * 148} stroke={C.mudo} strokeWidth="6" strokeLinecap="round" />;
        })}
        <line x1="200" y1="215" x2={200 + Math.sin((ang * Math.PI) / 180) * 120} y2={215 - Math.cos((ang * Math.PI) / 180) * 120} stroke={C.m3} strokeWidth="10" strokeLinecap="round" />
        <circle cx="200" cy="215" r="14" fill={C.m3} />
      </svg>
      <div style={{ position: "absolute", left: 560, width: 500, top: 880 }}>
        <div style={{ position: "relative" }}>
          <Linha f={f} em={tMin - 4} size={66} cor={C.mudo}>MINUTOS</Linha>
          <div style={{ position: "absolute", left: 90, top: "48%", height: 12, width: risco * 320, background: C.alerta, borderRadius: 6 }} />
        </div>
        <Linha f={f} em={tSeg} size={80} style={{ marginTop: 12 }}><G>SEGUNDOS</G></Linha>
      </div>
      {/* a pantera salta pela divisória */}
      {salto > 0 ? (
        <Img src={staticFile("pantera/comemorando.png")} style={{ position: "absolute", left: lerp(170, 900, salto), top: 1230 - Math.sin(salto * Math.PI) * 330, width: 290, transform: `translate(-50%, -50%) rotate(${salto * 360}deg)`, filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.6))" }} />
      ) : (
        <Pant pose="comemorando" x={170} y={1230} w={290} f={f} em={8} />
      )}
    </AbsoluteFill>
  );
};

// ---------- C07 · a equipe ----------
const C07 = ({ f, h }) => {
  const t7 = h.w("sete");
  const t5 = h.w("cinco");
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Rotulo f={f} em={h.w("e quem")}>QUEM CONSTRUIU?</Rotulo>
      {Array.from({ length: 7 }).map((_, k) => {
        const aceso = f >= t7 + k * 3;
        const s = pop(f, 2 + k * 2);
        return (
          <Img key={k} src={staticFile("pantera/feliz.png")} style={{ position: "absolute", left: 50 + k * 140, top: 380, width: 140, opacity: s, transform: `translateY(${aceso ? -14 * pop(f, t7 + k * 3) + 14 : 0}px) scale(${0.7 + 0.3 * s})`, filter: aceso ? `drop-shadow(0 0 18px ${C.m2})` : "brightness(0) opacity(0.45)" }} />
        );
      })}
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <Linha f={f} em={t7} size={0} style={{ fontSize: 0 }}>
          <Serif size={300}>7</Serif>
        </Linha>
        <Linha f={f} em={t7 + 4} size={84}>PESSOAS</Linha>
      </div>
      {/* calendário: 5 folhas voam e empilham */}
      {Array.from({ length: 5 }).map((_, k) => {
        const em = t5 - 8 + k * 3;
        const s = pop(f, em, { damping: 13, mass: 0.7, stiffness: 120 });
        if (s <= 0) return null;
        const de = [[-700, -300], [800, -200], [-600, 500], [700, 600], [0, 900]][k];
        return (
          <div key={k} style={{ position: "absolute", left: 300 + k * 6, top: 1000 - k * 10, width: 280, height: 210, borderRadius: 18, background: C.card, border: `3px solid ${C.m2}aa`, transform: `translate(${de[0] * (1 - s)}px, ${de[1] * (1 - s)}px) rotate(${(1 - s) * 90 + (k - 2) * 3}deg)`, boxShadow: "0 16px 40px rgba(0,0,0,0.55)", overflow: "hidden" }}>
            <div style={{ height: 50, background: GRAD }} />
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: C.text, textAlign: "center", marginTop: 40 }}>MÊS {k + 1}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 940, left: 600, right: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <Linha f={f} em={t5 + 6} size={0} style={{ fontSize: 0 }}>
          <Serif size={280}>5</Serif>
        </Linha>
        <Linha f={f} em={t5 + 10} size={72}>MESES</Linha>
      </div>
    </AbsoluteFill>
  );
};

// ---------- C08 · o alerta ----------
const C08 = ({ f, h }) => {
  const tInt = h.w("interno") - 2;
  const desenho = interpolate(f, [2, 20], [0, 1], clamp);
  const st = f >= tInt ? spring({ frame: f - tInt, fps: F, config: { damping: 14, mass: 0.5, stiffness: 260 } }) : 0;
  const shake = f >= tInt && f < tInt + 8 ? (rnd(f, 9) - 0.5) * 30 * (1 - (f - tInt) / 8) : 0;
  const per = 2 * (520 + 170);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <Fundo f={f} />
      <Rotulo f={f} em={0} cor={C.alerta}>ATENÇÃO</Rotulo>
      <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x="200" y="470" width="520" height="170" rx="40" fill={`${C.card}`} stroke={C.m3} strokeWidth="6" strokeDasharray={per} strokeDashoffset={per * (1 - desenho)} />
      </svg>
      <div style={{ position: "absolute", left: 200, top: 470, width: 520, height: 170, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontFamily: sora, fontWeight: 800, fontSize: 52, color: C.text, opacity: interpolate(f, [12, 20], [0, 1], clamp) }}>
        <span style={{ color: C.m3 }}>↓</span> BAIXAR SCION
      </div>
      {st > 0 ? (
        <div style={{ position: "absolute", left: 140, top: 430, width: 640, height: 250, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(-11deg) scale(${lerp(3.2, 1, st)})`, opacity: Math.min(1, st * 2) }}>
          <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 118, letterSpacing: 10, color: C.alerta, border: `12px solid ${C.alerta}`, borderRadius: 24, padding: "4px 34px", background: "rgba(8,8,16,0.82)", boxShadow: `0 0 50px ${C.alerta}88` }}>INTERNO</div>
        </div>
      ) : null}
      <Pant pose="apontando" x={930} y={610} w={260} f={f} em={6} />
      <div style={{ position: "absolute", top: 860, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Linha f={f} em={h.w("não dá")} size={76}>NÃO DÁ PARA <G>BAIXAR</G></Linha>
        <Linha f={f} em={h.w("não substitui") - 4} size={60} cor={C.apoio}>NÃO SUBSTITUI O GIT<br />NO USO GERAL</Linha>
      </div>
      <Selo f={f} em={h.w("e a própria")} y={1240}>segundo a Anthropic</Selo>
    </AbsoluteFill>
  );
};

// ---------- C09 · fecho (opinião PhanterAI) e loop ----------
const C09 = ({ f, h }) => {
  const tPerg = h.w("onde");
  const sai = interpolate(f, [h.L - 18, h.L - 4], [1, 0], clamp); // limpa para emendar no quadro da C01
  const perg = "ONDE ESTÁ O SEU?";
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Terminal f={f} L={h.L} modo="calmo" />
      <AbsoluteFill style={{ opacity: sai }}>
        <AbsoluteFill style={{ background: "rgba(8,8,16,0.55)" }} />
        <Rotulo f={f} em={2}>OPINIÃO PHANTERAI</Rotulo>
        <Pant pose="pensando" x={540} y={660} w={400} f={f} em={6} />
        <div style={{ position: "absolute", top: 940, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Linha f={f} em={h.w("o gargalo")} size={82}>o gargalo</Linha>
          <Linha f={f} em={h.w("muda de")} size={0} style={{ fontSize: 0 }}>
            <Serif size={118}>mudou de lugar.</Serif>
          </Linha>
        </div>
        <div style={{ position: "absolute", top: 1220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          {perg.split("").map((ch, k) => {
            const s = pop(f, tPerg + k * 1.2, { damping: 10, mass: 0.5, stiffness: 170 });
            return (
              <span key={k} style={{ display: "inline-block", whiteSpace: "pre", fontFamily: sora, fontWeight: 800, fontSize: 84, ...(k >= 9 ? gradText : { color: C.text }), opacity: s, transform: `translateY(${(1 - s) * 70}px)` }}>{ch}</span>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 1390, left: 0, right: 0, textAlign: "center", opacity: pop(f, 10) }}>
          <span style={{ fontFamily: sora, fontWeight: 800, fontSize: 40, color: C.text }}>Phanter</span>
          <span style={{ fontFamily: sora, fontWeight: 800, fontSize: 40, color: C.m2 }}>AI</span>
          <span style={{ fontFamily: mono, fontSize: 28, color: C.mudo, marginLeft: 18 }}>@phanteraicreative</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPS = [C01, C02, C03, C04, C05, C06, C07, C08, C09];

// ---------- transições ----------
const halfClip = (poly, keep) => {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i];
    const B = poly[(i + 1) % poly.length];
    const va = keep(A);
    const vb = keep(B);
    if (va >= 0) out.push(A);
    if (va >= 0 !== vb >= 0) {
      const t = va / (va - vb);
      out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]);
    }
  }
  return out;
};
const RECT = [[0, 0], [1080, 0], [1080, 1920], [0, 1920]];
const poly = (pts) => (pts.length ? `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})` : "polygon(0 0,0 0,0 0)");

const Abs = ({ style, children }) => <AbsoluteFill style={style}>{children}</AbsoluteFill>;

// Cena que entra (modo "in") ou sai ("out"), com progresso p de 0 a 1.
const Transicao = ({ tipo, modo, p, render, k }) => {
  const e = ease(Math.min(1, Math.max(0, p)));
  if (tipo === "glitch") {
    if (modo === "out") {
      const j = (rnd(k, 1) - 0.5) * 60 * p;
      return <Abs style={{ transform: `translateX(${j}px) skewX(${(rnd(k, 2) - 0.5) * 10 * p}deg)`, filter: `hue-rotate(${p * 90}deg) saturate(${1 + p * 2})` }}>{render()}</Abs>;
    }
    const fatias = 9;
    const off = (1 - p) * 28;
    return (
      <>
        {Array.from({ length: fatias }).map((_, i) => {
          if (p < rnd(i, 4) * 0.7) return null;
          const y0 = (i / fatias) * 1920;
          const y1 = ((i + 1) / fatias) * 1920;
          return <Abs key={i} style={{ clipPath: `polygon(0 ${y0}px,1080px ${y0}px,1080px ${y1}px,0 ${y1}px)`, transform: `translateX(${(rnd(i, k) - 0.5) * 140 * (1 - p)}px)` }}>{render()}</Abs>;
        })}
        {p < 1 ? <Abs style={{ transform: `translateX(${off}px)`, opacity: 0.45 * (1 - p), mixBlendMode: "screen", filter: "sepia(1) saturate(8) hue-rotate(280deg)" }}>{render()}</Abs> : null}
        {p < 1 ? <Abs style={{ transform: `translateX(${-off}px)`, opacity: 0.4 * (1 - p), mixBlendMode: "screen", filter: "sepia(1) saturate(8) hue-rotate(140deg)" }}>{render()}</Abs> : null}
      </>
    );
  }
  if (tipo === "parede") {
    if (modo === "out") return render();
    const x0 = lerp(420, 0, e);
    const x1 = lerp(700, 1080, e);
    const y0 = lerp(400, 0, Math.min(1, e * 1.3));
    return <Abs style={{ clipPath: `polygon(${x0}px ${y0}px, ${x1}px ${y0}px, ${x1}px 1920px, ${x0}px 1920px)` }}>{render()}</Abs>;
  }
  if (tipo === "portal") {
    if (modo === "out") return <Abs style={{ transform: `scale(${1 + e * 0.25})`, transformOrigin: "860px 935px" }}>{render()}</Abs>;
    const r = Math.pow(e, 1.6) * 2300;
    return (
      <>
        <Abs style={{ clipPath: `circle(${r}px at 860px 935px)` }}>{render()}</Abs>
        <div style={{ position: "absolute", left: 860 - r, top: 935 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${10 * (1 - e) + 2}px solid ${C.m3}`, boxShadow: `0 0 40px ${C.m2}, inset 0 0 40px ${C.m2}`, opacity: 1 - e }} />
      </>
    );
  }
  if (tipo === "flip") {
    return (
      <>
        {[0, 1, 2].map((i) => {
          const q = Math.min(1, Math.max(0, (p - i * 0.12) / 0.76));
          const x0 = i * 360;
          const x1 = x0 + 360;
          let ang;
          if (modo === "out") {
            if (q >= 0.5) return null;
            ang = q * 180;
          } else {
            if (q < 0.5) return null;
            ang = -90 + (q - 0.5) * 180;
          }
          return (
            <Abs key={i} style={{ perspective: 1800, perspectiveOrigin: `${x0 + 180}px 960px` }}>
              <Abs style={{ clipPath: `polygon(${x0}px 0,${x1}px 0,${x1}px 1920px,${x0}px 1920px)`, transform: `rotateY(${ang}deg)`, transformOrigin: `${x0 + 180}px 960px`, backfaceVisibility: "hidden" }}>{render()}</Abs>
            </Abs>
          );
        })}
      </>
    );
  }
  if (tipo === "zoom") {
    const o = `${NO_ZOOM.x}px ${NO_ZOOM.y}px`;
    if (modo === "out") return <Abs style={{ transform: `scale(${1 + 7 * Math.pow(e, 2)})`, transformOrigin: o, opacity: 1 - Math.pow(p, 3), filter: `blur(${e * 6}px)` }}>{render()}</Abs>;
    return <Abs style={{ transform: `scale(${0.08 + 0.92 * e})`, transformOrigin: o, opacity: Math.min(1, p * 2.2), filter: `blur(${(1 - e) * 8}px)`, borderRadius: 60 * (1 - e), overflow: "hidden" }}>{render()}</Abs>;
  }
  if (tipo === "curl") {
    if (modo === "out") return render();
    const c = lerp(3000, -250, e);
    const rev = halfClip(RECT, ([x, y]) => x + y - c);
    const abaClip = halfClip(halfClip(halfClip(halfClip(rev.map(([x, y]) => [c - y, c - x]), ([x]) => x), ([x]) => 1080 - x), ([, y]) => y), ([, y]) => 1920 - y);
    const sombraFaixa = halfClip(halfClip(RECT, ([x, y]) => c - (x + y)), ([x, y]) => x + y - (c - 90));
    return (
      <>
        <Abs style={{ clipPath: poly(rev) }}>{render()}</Abs>
        <div style={{ position: "absolute", inset: 0, clipPath: poly(sombraFaixa), background: "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, clipPath: poly(abaClip), background: `linear-gradient(135deg, #1a1426 0%, #3a1838 45%, ${C.m3} 100%)`, boxShadow: "0 0 40px rgba(0,0,0,0.6)" }} />
      </>
    );
  }
  if (tipo === "shatter") {
    if (modo === "in") return render();
    const cols = 3;
    const rows = 5;
    const w = 1080 / cols;
    const hh = 1920 / rows;
    const pecas = [];
    for (let r = 0; r < rows; r++)
      for (let cI = 0; cI < cols; cI++) {
        const x = cI * w;
        const y = r * hh;
        const jx = (rnd(r * 7 + cI, 3) - 0.5) * w * 0.5;
        const meio = [x + w / 2 + jx, y + hh / 2 + (rnd(cI * 5 + r, 8) - 0.5) * hh * 0.4];
        const cantos = [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]];
        for (let t = 0; t < 4; t++) pecas.push([cantos[t], cantos[(t + 1) % 4], meio]);
      }
    return (
      <>
        {pecas.map((tri, i) => {
          const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
          const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
          const atraso = rnd(i, 6) * 0.25;
          const q = Math.max(0, (p - atraso) / (1 - atraso));
          const dx = (cx - 540) * 0.5 * q + (rnd(i, 2) - 0.5) * 120 * q;
          const dy = -160 * q * rnd(i, 4) + 2600 * q * q;
          const rot = (rnd(i, 5) - 0.5) * 160 * q;
          return (
            <Abs key={i} style={{ clipPath: poly(tri), transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px`, opacity: 1 - Math.pow(q, 4) }}>
              {render()}
              <AbsoluteFill style={{ background: C.m2, opacity: 0.12 + 0.35 * Math.min(1, q * 3) }} />
            </Abs>
          );
        })}
      </>
    );
  }
  if (tipo === "wipe") {
    if (modo === "out") return render();
    const kx = 0.32;
    const s = lerp(-560, 1900, e);
    const band = 230;
    const rev = halfClip(RECT, ([x, y]) => s - (x + kx * (y - 960)));
    const faixa = halfClip(halfClip(RECT, ([x, y]) => x + kx * (y - 960) - s), ([x, y]) => s + band - (x + kx * (y - 960)));
    return (
      <>
        <Abs style={{ clipPath: poly(rev) }}>{render()}</Abs>
        <div style={{ position: "absolute", inset: 0, clipPath: poly(faixa), background: GRAD, boxShadow: `0 0 60px ${C.m2}` }} />
        <Img src={staticFile("pantera/comemorando.png")} style={{ position: "absolute", left: s + band / 2, top: 960, width: 360, transform: "translate(-50%, -50%) rotate(-8deg)", filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.6))" }} />
      </>
    );
  }
  return render();
};

// ---------- legenda queimada ----------
const Legenda = ({ i, f, h }) => {
  const leg = CENAS[i].legendas;
  if (!leg.length || f < h.v0 - 2 || f > h.vfim + 6) return null;
  const marcas = leg.map(([, ancora]) => h.w(ancora));
  let atual = 0;
  for (let k = 0; k < marcas.length; k++) if (f >= marcas[k] - 3) atual = k;
  const ini = marcas[atual] - 3;
  const s = pop(f, ini, { damping: 14, mass: 0.5, stiffness: 220 });
  const destaque = /^(2\.500|30|200|anthropic|scion|git|interno|gargalo|agentes|merges)/i;
  return (
    <div style={{ position: "absolute", top: 1520, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 46, lineHeight: 1.2, color: C.text, textAlign: "center", padding: "12px 26px", borderRadius: 18, background: "rgba(8,8,16,0.78)", border: `1px solid ${C.m2}44`, transform: `scale(${0.9 + 0.1 * s})`, opacity: Math.min(1, s * 1.4) }}>
        {leg[atual][0].split(" ").map((w, k) => (
          <span key={k} style={{ color: destaque.test(w) ? C.m3 : C.text }}>{w} </span>
        ))}
      </div>
    </div>
  );
};

// ---------- sons por cena (frames locais) ----------
const SONS = [
  (h) => [{ n: "riser", f: Math.max(0, h.w("outro") - 30) }],
  (h) => [{ n: "pop", f: h.w("dois mil") }, { n: "ding", f: h.w("trinta") + 18 }, { n: "pop", f: h.w("trinta") - 4 }],
  (h) => [{ n: "whoosh", f: h.w("escrever deixou") }, { n: "pop", f: h.w("problema") - 4 }],
  (h) => [{ n: "pop", f: h.w("controle") }, { n: "pop", f: h.w("teste") }, { n: "pop", f: h.w("juntar") }],
  (h) => [{ n: "ding", f: h.w("sáion") - 3 }, { n: "pop", f: h.w("pequeno") + 6 }],
  (h) => [{ n: "whoosh", f: h.w("duzentas") - 6 }, { n: "whoosh", f: h.w("e baixar") }, { n: "ding", f: h.w("segundos") }],
  (h) => [0, 2, 4, 6].map((k) => ({ n: "pop", f: h.w("sete") + k * 3 })).concat([{ n: "pop", f: h.w("cinco") + 6 }]),
  (h) => [{ n: "riser", f: Math.max(0, h.w("interno") - 26) }, { n: "pop", f: h.w("interno") - 2 }],
  (h) => [{ n: "ding", f: h.w("conta aí") }],
];
// sons das transições (no frame em que a cena seguinte começa a entrar)
const SOM_TRANS = { glitch: "error", parede: "whoosh", portal: "whoosh", flip: "whoosh", zoom: "whoosh", curl: "whoosh", shatter: "coin", wipe: "whoosh" };

// ---------- composição ----------
export const ShortScion = ({ voz }) => {
  const frame = useCurrentFrame();
  const tl = linhaDoTempo(voz);
  const total = Math.round(tl.total * F);
  const ab = tl.cenas.map((e) => [Math.round(e.ini * F), Math.round(e.fim * F)]);
  const hs = tl.cenas.map((e, i) => mkH(i, e));

  // trilha: entra na C02, -30% na C04, some 0,3 s depois do carimbo da C08
  const mus0 = ab[1][0] - CENAS[1].T;
  const stamp = ab[7][0] + hs[7].w("interno") - 2;
  const volMus = (fl) => {
    const fg = fl + mus0;
    let v = 0.085 * interpolate(fg, [mus0, mus0 + 6], [0, 1], clamp);
    if (fg >= ab[3][0] && fg < ab[3][1]) v *= 0.7;
    if (fg >= stamp && fg < stamp + 9) v = 0;
    else if (fg >= stamp + 9 && fg < stamp + 21) v *= (fg - stamp - 9) / 12;
    v *= interpolate(fg, [total - 5, total], [1, 0], clamp);
    return v;
  };

  const camadas = [];
  CENAS.forEach((c, i) => {
    const [a, b] = ab[i];
    const Tin = c.T || 0;
    const prox = CENAS[i + 1];
    const Tout = prox ? prox.T : 0;
    const fim = prox ? b : total;
    if (frame < a - Tin || frame >= fim) return;
    const f = frame - a;
    const Comp = COMPS[i];
    const render = () => <Comp f={f} h={hs[i]} />;
    let node = render();
    let z = i;
    if (Tin && frame < a) {
      const p = (frame - (a - Tin)) / Tin;
      node = <Transicao tipo={c.trans} modo="in" p={p} render={render} k={frame} />;
    } else if (prox && frame >= b - Tout) {
      const p = (frame - (b - Tout)) / Tout;
      node = <Transicao tipo={prox.trans} modo="out" p={p} render={render} k={frame} />;
      if (prox.trans === "shatter") z = 99;
    }
    camadas.push(
      <AbsoluteFill key={c.id} style={{ zIndex: z }}>
        {node}
      </AbsoluteFill>
    );
  });

  const atual = ab.findIndex(([a, b], i) => frame >= a && (frame < b || i === ab.length - 1));

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {camadas}
      {atual >= 0 ? <AbsoluteFill style={{ zIndex: 200 }}><Legenda i={atual} f={frame - ab[atual][0]} h={hs[atual]} /></AbsoluteFill> : null}

      <Sequence from={mus0} layout="none">
        <Audio src={staticFile("music/Coding_at_Night.mp3")} volume={volMus} />
      </Sequence>
      {CENAS.map((c, i) => (
        <Sequence key={`v${c.id}`} from={Math.round(tl.cenas[i].voz * F)} layout="none">
          <Audio src={staticFile(`episodes/${SC_SLUG}/voz-eleven/${c.id}.mp3`)} />
        </Sequence>
      ))}
      {SONS.flatMap((fn, i) => fn(hs[i]).map((s, k) => <Sfx key={`s${i}-${k}`} name={s.n} atFrame={Math.max(0, ab[i][0] + s.f)} />))}
      {CENAS.map((c, i) => (c.trans ? <Sfx key={`t${i}`} name={SOM_TRANS[c.trans]} atFrame={ab[i][0] - c.T} /> : null))}
    </AbsoluteFill>
  );
};

// Duração de cada locução lida dos arquivos; sem arquivo ainda, estima pela fala (prévia).
export const calculateScionMetadata = async ({ props }) => {
  const voz = await Promise.all(
    CENAS.map(async (c) => {
      try {
        return await getAudioDurationInSeconds(staticFile(`episodes/${SC_SLUG}/voz-eleven/${c.id}.mp3`));
      } catch {
        return c.fala.length / 15;
      }
    })
  );
  const { total } = linhaDoTempo(voz);
  return { durationInFrames: Math.round(total * F), fps: F, props: { ...props, voz } };
};

// ---------- capa do Reel (1080x1920) e thumbnail do Short (1280x720): brief do youtube-metadata.json ----------
const BarraCapa = ({ left, top, w, h, rot = "30.000+" }) => (
  <>
    <div style={{ position: "absolute", left, top, width: w, height: h, borderRadius: "22px 22px 0 0", background: `linear-gradient(0deg, ${C.m1}, ${C.m2} 60%, ${C.m3})`, boxShadow: `0 0 90px ${C.m2}aa` }} />
    <div style={{ position: "absolute", left: left - 60, width: w + 120, top: top + 30, textAlign: "center", fontFamily: sora, fontWeight: 800, fontSize: w * 0.2, color: C.text, textShadow: sombra }}>{rot}</div>
  </>
);
export const ScionCapa = () => (
  <AbsoluteFill>
    <Fundo f={30} />
    <BarraCapa left={130} top={380} w={360} h={1240} />
    <div style={{ position: "absolute", left: 130, width: 360, top: 600, textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.text }}>MERGES/DIA</div>
    <Img src={staticFile("pantera/apontando.png")} style={{ position: "absolute", left: 610, top: 1130, width: 420, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6))" }} />
    <div style={{ position: "absolute", left: 560, right: 30, top: 420, fontFamily: sora, fontWeight: 800, fontSize: 132, lineHeight: 1.0, color: C.text, textShadow: sombra }}>
      GIT
      <br />
      NÃO
      <br />
      DEU
      <br />
      <span style={gradClaro}>CONTA</span>
    </div>
    <div style={{ position: "absolute", left: 560, right: 40, top: 990, fontFamily: mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.m3 }}>ANTHROPIC · SCION</div>
  </AbsoluteFill>
);
export const ScionThumb = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Fundo f={30} />
    <BarraCapa left={830} top={90} w={250} h={640} />
    <Img src={staticFile("pantera/apontando.png")} style={{ position: "absolute", left: 1040, top: 400, width: 250, filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.6))" }} />
    <div style={{ position: "absolute", left: 60, top: 130, width: 780, whiteSpace: "nowrap", fontFamily: sora, fontWeight: 800, fontSize: 116, lineHeight: 1.02, color: C.text, textShadow: sombra }}>
      GIT NÃO
      <br />
      DEU <span style={gradClaro}>CONTA</span>
    </div>
    <div style={{ position: "absolute", left: 66, top: 420, fontFamily: mono, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: C.m3 }}>ANTHROPIC · SCION</div>
  </AbsoluteFill>
);
