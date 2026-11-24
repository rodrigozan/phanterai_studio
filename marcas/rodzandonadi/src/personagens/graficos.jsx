import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AREA, FONT, aparece, clamp, pasta, useSlug } from "../base";
import { colors, radii, shadows } from "../theme";

const m = (marcas, k, d = 0) => (marcas && marcas[k] !== undefined ? marcas[k] : d);

const Pop = ({ de, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - de, fps, config: { damping: 14, stiffness: 140 } });
  return <div style={{ opacity: Math.min(1, s * 1.4), transform: `scale(${0.85 + 0.15 * s}) translateY(${(1 - s) * 30}px)`, ...style }}>{children}</div>;
};

const Caixa = ({ children, ativo = true, style }) => (
  <div style={{ background: ativo ? colors.roxo : `${colors.roxo}66`, border: `4px solid ${ativo ? colors.amarelo : colors.roxo}`, borderRadius: radii.lg, boxShadow: shadows.suave, color: colors.branco, fontFamily: FONT, ...style }}>{children}</div>
);

const Foto = ({ img, style, z = 1, pos = "center" }) => {
  const slug = useSlug();
  return (
    <div style={{ borderRadius: radii.lg, overflow: "hidden", border: `4px solid ${colors.amarelo}`, boxShadow: shadows.suave, ...style }}>
      <Img src={pasta(slug, img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})` }} />
    </div>
  );
};

const Silhueta = ({ cor = colors.roxo }) => (
  <svg viewBox="0 0 100 160" style={{ width: 150, height: 240 }}>
    <circle cx="50" cy="34" r="24" fill={cor} />
    <path d="M10 160 C10 95 25 70 50 70 C75 70 90 95 90 160 Z" fill={cor} />
    <text x="50" y="44" textAnchor="middle" fontSize="30" fontWeight="900" fill={colors.amarelo} fontFamily="sans-serif">?</text>
  </svg>
);

export const SemRosto = ({ dur }) => {
  const nomes = [["Lara", "prática · desconfiada"], ["Pedro", "sonhador · ouve a água"], ["A mãe", "transformada no Dia 0"]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 70, paddingBottom: 80 }}>
      {nomes.map(([n, t], i) => (
        <Pop key={n} de={6 + i * 10}>
          <Caixa style={{ width: 430, height: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <Silhueta cor="#3b1450" />
            <div style={{ fontSize: 62, fontWeight: 900 }}>{n}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: colors.amarelo, textAlign: "center", padding: "0 20px" }}>{t}</div>
          </Caixa>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

export const Trio = () => {
  const itens = [["personagens/lara.jpg", "Lara", "30% center"], ["personagens/pedro.jpg", "Pedro", "50% center"], ["personagens/iara.jpg", "A mãe, como Iara", "50% center"]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 40, paddingBottom: 90 }}>
      {itens.map(([img, n], i) => (
        <Pop key={img} de={4 + i * 12}>
          <div style={{ position: "relative" }}>
            <Foto img={img} style={{ width: 520, height: 640 }} />
            <div style={{ position: "absolute", left: 20, bottom: 20, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 36, padding: "4px 18px", borderRadius: radii.pill, fontFamily: FONT }}>{n}</div>
          </div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

export const Pilares = ({ marcas }) => {
  const frame = useCurrentFrame();
  const p = [
    ["a", "1", "O mundo já existia", "Já escrevo um romance nele"],
    ["b", "2", "Um conto do zero", "Escrito em parceria com o Claude"],
    ["c", "3", "Ampliar a lore", "Personagens, criaturas e detalhes novos"],
  ];
  const d = m(marcas, "d", 9999);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
      <div style={{ display: "flex", gap: 44 }}>
        {p.map(([k, n, t, s]) => (
          <Pop key={k} de={m(marcas, k)}>
            <Caixa ativo={frame < d} style={{ width: 500, height: 420, padding: 40, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 90, fontWeight: 900, color: colors.amarelo, lineHeight: 0.9 }}>{n}</div>
              <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1 }}>{t}</div>
              <div style={{ fontSize: 36, fontWeight: 600, color: colors.cinza }}>{s}</div>
            </Caixa>
          </Pop>
        ))}
      </div>
      {frame >= d && (
        <Pop de={d} style={{ marginTop: 50 }}>
          <div style={{ background: colors.amarelo, color: colors.roxoEscuro, fontFamily: FONT, fontWeight: 900, fontSize: 76, padding: "8px 50px", borderRadius: radii.pill }}>A IA propõe. Eu escolho.</div>
        </Pop>
      )}
    </AbsoluteFill>
  );
};

export const MaquinaTempo = ({ marcas, dur }) => {
  const frame = useCurrentFrame();
  const itens = [["Initial Commit", "16:12"], ["Cena 01", "16:35"], ["Correções da cena 01", "16:36"]];
  const b = m(marcas, "b", 30);
  const c = m(marcas, "c", 60);
  const prog = interpolate(frame, [b, b + 40], [0, 1], clamp);
  const volta = interpolate(frame, [c, c + 30], [0, 1], clamp);
  const pos = 2 - volta * 2;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 100, fontFamily: FONT }}>
      <Pop de={0}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 70 }}>
          <div style={{ fontSize: 130 }}>📁</div>
          <div style={{ color: colors.branco, fontSize: 70, fontWeight: 900, lineHeight: 1 }}>A pasta do livro<br /><span style={{ color: colors.amarelo }}>com máquina do tempo</span></div>
        </div>
      </Pop>
      <div style={{ position: "relative", width: 1500, height: 220 }}>
        <div style={{ position: "absolute", left: 100, right: 100, top: 60, height: 8, background: `${colors.roxo}`, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 100, top: 60, height: 8, width: `${prog * 1300}px`, background: colors.amarelo, borderRadius: 4 }} />
        {itens.map(([t, h], i) => {
          const x = 100 + i * 650;
          const o = interpolate(frame, [b + i * 13, b + i * 13 + 10], [0, 1], clamp);
          const aqui = frame >= c && Math.round(pos) === i;
          return (
            <div key={t} style={{ position: "absolute", left: x - 160, top: 0, width: 320, textAlign: "center", opacity: o }}>
              <div style={{ margin: "36px auto 0", width: 56, height: 56, borderRadius: 28, background: aqui ? colors.amarelo : colors.roxo, border: `6px solid ${colors.amarelo}` }} />
              <div style={{ color: colors.branco, fontSize: 36, fontWeight: 800, marginTop: 18 }}>{t}</div>
              <div style={{ color: colors.cinza, fontSize: 28, fontWeight: 600 }}>19/11, {h}</div>
            </div>
          );
        })}
        {frame >= c && (
          <div style={{ position: "absolute", left: 100 + pos * 650 - 30, top: -56, fontSize: 60, color: colors.amarelo }}>▼</div>
        )}
      </div>
      {frame >= c && <Pop de={c + 10} style={{ marginTop: 30 }}><div style={{ color: colors.amarelo, fontSize: 52, fontWeight: 900 }}>↺ voltar para qualquer versão</div></Pop>}
    </AbsoluteFill>
  );
};

export const Motivos = ({ marcas }) => {
  const frame = useCurrentFrame();
  const itens = [
    ["a", "O Claude lê pelo link", "Sem copiar e colar o livro. Sempre a versão atual."],
    ["b", "Tudo fica registrado", "O que eu escrevi e o que a IA sugeriu. Dá para desfazer."],
    ["c", "Oficial × proposta", "O que já é do mundo e o que ainda é ideia."],
  ];
  const d = m(marcas, "d", 9999);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 110, fontFamily: FONT }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {itens.map(([k, t, s], i) => {
          const de = m(marcas, k);
          const ativo = frame >= de && (i === 2 ? frame < d : frame < m(marcas, itens[i + 1][0], 99999));
          return (
            <Pop key={k} de={de}>
              <Caixa ativo={ativo} style={{ width: 1400, padding: "22px 40px", display: "flex", alignItems: "center", gap: 36 }}>
                <div style={{ fontSize: 90, fontWeight: 900, color: colors.amarelo, width: 70 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1 }}>{t}</div>
                  <div style={{ fontSize: 36, fontWeight: 600, color: colors.cinza }}>{s}</div>
                </div>
              </Caixa>
            </Pop>
          );
        })}
        {frame >= d && (
          <Pop de={d}>
            <div style={{ alignSelf: "center", textAlign: "center", color: colors.branco, fontSize: 46, fontWeight: 800 }}>Sem GitHub? <span style={{ color: colors.amarelo }}>Uma pasta no Google Drive resolve.</span></div>
          </Pop>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const FaltaCorpo = ({ marcas }) => {
  const frame = useCurrentFrame();
  const b = m(marcas, "b", 40);
  const itens = ["Personalidade", "Função na história", "Medo"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 120, paddingBottom: 100, fontFamily: FONT }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {itens.map((t, i) => (
          <Pop key={t} de={4 + i * 8}>
            <div style={{ fontSize: 64, fontWeight: 900, color: colors.branco }}><span style={{ color: colors.amarelo }}>✓</span> {t}</div>
          </Pop>
        ))}
        {frame >= b && <Pop de={b}><div style={{ fontSize: 64, fontWeight: 900, color: colors.amarelo }}>✗ Corpo</div></Pop>}
      </div>
      <Pop de={10}>
        <div style={{ transform: "scale(2.2)", opacity: frame >= b ? 0.45 + 0.15 * Math.sin(frame / 5) : 1 }}><Silhueta cor="#3b1450" /></div>
      </Pop>
    </AbsoluteFill>
  );
};

export const Inventado = ({ marcas }) => {
  const frame = useCurrentFrame();
  const itens = [
    ["a", "A mãe", "Cláudia"],
    ["b", "A mula sem cabeça", "Dona Celina"],
    ["c", "O Saci", "Jefferson"],
    ["d", "Pedro", "de óculos"],
    ["e", "A mãe transformada", "medalha de Nossa Senhora Aparecida"],
  ];
  const f = m(marcas, "f", 9999);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 110, fontFamily: FONT }}>
      <div style={{ color: colors.cinza, fontSize: 40, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", marginBottom: 26 }}>O que a IA inventou e avisou</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, width: 1500 }}>
        {itens.map(([k, a, b], i) => (
          <Pop key={k} de={m(marcas, k)} style={i === 4 ? { gridColumn: "1 / span 2" } : {}}>
            <Caixa style={{ padding: "18px 30px", display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontSize: 38, fontWeight: 700, color: colors.cinza }}>{a}</span>
              <span style={{ fontSize: 54, fontWeight: 900, color: colors.amarelo }}>→ {b}</span>
            </Caixa>
          </Pop>
        ))}
      </div>
      {frame >= f && (
        <Pop de={f} style={{ marginTop: 34 }}>
          <div style={{ background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 64, padding: "6px 46px", borderRadius: radii.pill, transform: "rotate(-2deg)" }}>Proposta, não ordem</div>
        </Pop>
      )}
    </AbsoluteFill>
  );
};

const PROMPT_LARA = [
  ["Anime digital art", "estilo"],
  [", full body character design, ", null],
  ["15-year-old", "idade"],
  [" Afro-Brazilian teenage girl, dark brown skin, slim and wiry, angular face, ", null],
  ["tight high bun of coily black hair, thin scar on her chin", "físico"],
  [", wearing ", null],
  ["dark ripped jeans patched with silver duct tape, oversized olive-green windbreaker", "roupa"],
  [", slingshot on her belt, blue and white bead bracelet, ", null],
  ["post-apocalyptic small Brazilian town background", "cenário"],
  [", soft cel shading, cinematic lighting", null],
];

export const AnatomiaPrompt = ({ marcas, dur }) => {
  const frame = useCurrentFrame();
  const ordem = ["idade", "estilo", "físico", "roupa", "cenário"];
  const t0 = 10;
  const passo = Math.max(14, (dur - 40) / ordem.length);
  const acesa = (tag) => frame >= t0 + ordem.indexOf(tag) * passo;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 110, fontFamily: FONT }}>
      <div style={{ color: colors.cinza, fontSize: 38, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Anatomia do prompt · Lara</div>
      <div style={{ width: 1560, background: "#16161c", border: `3px solid ${colors.roxo}`, borderRadius: radii.lg, padding: "40px 44px 30px", fontFamily: "'DejaVu Sans Mono', monospace", fontSize: 34, lineHeight: 2.1, color: "#c9c4d6" }}>
        {PROMPT_LARA.map(([t, tag], i) => {
          if (!tag) return <span key={i}>{t}</span>;
          const on = acesa(tag);
          return (
            <span key={i} style={{ position: "relative", background: on ? colors.amarelo : "transparent", color: on ? colors.roxoEscuro : "#fff", fontWeight: on ? 700 : 400, borderRadius: 6, padding: "0 4px" }}>
              {t}
              {on && <span style={{ position: "absolute", left: 0, top: -32, fontFamily: FONT, fontSize: 24, fontWeight: 900, color: colors.amarelo, background: colors.roxoEscuro, padding: "0 8px", borderRadius: 6, whiteSpace: "nowrap", textTransform: "uppercase", lineHeight: 1.2 }}>{tag}</span>}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const AntesDepois = ({ marcas }) => {
  const frame = useCurrentFrame();
  const b = m(marcas, "b", 40);
  const seta = interpolate(frame, [b - 6, b + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 40, paddingBottom: 100, fontFamily: FONT }}>
      <Pop de={4}>
        <div style={{ position: "relative" }}>
          <Foto img="personagens/claudia-posto.jpg" style={{ width: 660, height: 600 }} pos="48% 40%" />
          <div style={{ position: "absolute", left: 20, bottom: 20, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 38, padding: "4px 18px", borderRadius: radii.pill }}>Cláudia enfermeira</div>
        </div>
      </Pop>
      <div style={{ fontSize: 110, color: colors.amarelo, fontWeight: 900, opacity: seta, transform: `translateX(${(1 - seta) * -40}px)` }}>→</div>
      {frame >= b - 4 && (
        <Pop de={b}>
          <div style={{ position: "relative" }}>
            <Foto img="personagens/iara.jpg" style={{ width: 660, height: 600 }} pos="52% 30%" />
            <div style={{ position: "absolute", left: 20, bottom: 20, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 38, padding: "4px 18px", borderRadius: radii.pill }}>Cláudia como Iara</div>
          </div>
        </Pop>
      )}
    </AbsoluteFill>
  );
};

const IW = 1376;
const IH = 768;

export const ImagemAnotada = ({ img, pontos = [], marcas, foco, dur, rotulo }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s0 = Math.min(AREA.w / IW, (AREA.h + 40) / IH);
  const f = foco ?? { x: 0, y: 0, w: IW, h: IH };
  const sF = foco ? Math.min(AREA.w / f.w, (AREA.h + 40) / f.h) : s0 * 1.04;
  const p = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 40 });
  const s = s0 + (sF - s0) * p;
  const cx = IW / 2 + (f.x + f.w / 2 - IW / 2) * p;
  const cy = IH / 2 + (f.y + f.h / 2 - IH / 2) * p;
  const tx = AREA.x + AREA.w / 2 - cx * s;
  const ty = AREA.y + AREA.h / 2 - 10 - cy * s;
  return (
    <AbsoluteFill style={{ clipPath: `inset(${AREA.y - 40}px ${AREA.x - 20}px ${1080 - AREA.y - AREA.h - 40}px ${AREA.x - 20}px round 24px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: IW, height: IH, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>
        <Img src={pasta(slug, img)} style={{ width: IW, height: IH, display: "block" }} />
      </div>
      {pontos.map((pt, i) => {
        const de = pt.ao !== undefined ? m(marcas, pt.ao, 0) : 16 + i * 12;
        const o = aparece(frame, de, 10);
        if (o <= 0) return null;
        const x = tx + pt.x * s;
        const y = ty + pt.y * s;
        const lx = pt.lado === "e" ? x - 40 : x + 40;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
            <div style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: 26, border: `6px solid ${colors.amarelo}`, boxShadow: `0 0 18px ${colors.amarelo}`, transform: `scale(${0.6 + 0.4 * o})` }} />
            <div style={{ position: "absolute", top: y - 34, left: lx, transform: pt.lado === "e" ? "translateX(-100%)" : "none", background: colors.roxoEscuro, border: `3px solid ${colors.amarelo}`, color: colors.branco, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "2px 18px", borderRadius: radii.pill, whiteSpace: "nowrap" }}>{pt.t}</div>
          </div>
        );
      })}
      {rotulo && (
        <div style={{ position: "absolute", top: 98, left: AREA.x, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 800, fontSize: 38, letterSpacing: 2, textTransform: "uppercase", padding: "6px 22px", borderRadius: radii.pill, fontFamily: FONT }}>{rotulo}</div>
      )}
    </AbsoluteFill>
  );
};

const VW = 1560;
const VH = 792;

const Moldura = ({ s, tx, ty, children }) => (
  <AbsoluteFill style={{ clipPath: `inset(${AREA.y - 40}px ${AREA.x - 20}px ${1080 - AREA.y - AREA.h - 40}px ${AREA.x - 20}px round 24px)` }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: VW, height: VH, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>{children}</div>
  </AbsoluteFill>
);

const enquadra = (f) => {
  const s = Math.min(AREA.w / f.w, (AREA.h + 40) / f.h);
  return { s, tx: AREA.x + AREA.w / 2 - (f.x + f.w / 2) * s, ty: AREA.y + AREA.h / 2 - 10 - (f.y + f.h / 2) * s };
};

const Selo = ({ children }) => (
  <div style={{ position: "absolute", right: AREA.x + 10, top: 98, background: colors.amarelo, color: colors.roxoEscuro, fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "4px 20px", borderRadius: radii.pill }}>{children}</div>
);

const TRECHOS = [
  { de: 0.5, ate: 4.1, taxa: 1 },
  { de: 4.1, ate: 14, taxa: 2.5 },
  { de: 14, ate: 54.7, taxa: 16 },
  { de: 54.7, ate: 58.5, taxa: 1 },
];

export const VoClipe = ({ dur, partes = [0, 1, 2, 3] }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const { s, tx, ty } = enquadra({ x: 0, y: 0, w: VW, h: VH });
  let t = 0;
  const segs = partes.map((i) => {
    const tr = TRECHOS[i];
    const n = Math.round(((tr.ate - tr.de) / tr.taxa) * 30);
    const r = { ...tr, ini: t, n };
    t += n;
    return r;
  });
  const atual = segs.find((g) => frame >= g.ini && frame < g.ini + g.n);
  const ult = segs[segs.length - 1];
  return (
    <AbsoluteFill>
      <Moldura s={s} tx={tx} ty={ty}>
        {segs.map((g, i) => (
          <Sequence key={i} from={g.ini} durationInFrames={g.n} layout="none">
            <OffthreadVideo src={pasta(slug, "clipes/vo-flow.mp4")} muted startFrom={Math.round(g.de * 30)} playbackRate={g.taxa} style={{ width: VW, height: VH, display: "block" }} />
          </Sequence>
        ))}
        {frame >= ult.ini + ult.n && (
          <Freeze frame={Math.round(ult.ate * 30) - 2}>
            <OffthreadVideo src={pasta(slug, "clipes/vo-flow.mp4")} muted style={{ width: VW, height: VH, display: "block" }} />
          </Freeze>
        )}
      </Moldura>
      {atual && atual.taxa > 1 && <Selo>{atual.taxa}× mais rápido</Selo>}
    </AbsoluteFill>
  );
};

export const VoPrompt = ({ marcas }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ini = enquadra({ x: 0, y: 0, w: VW, h: VH });
  const fim = enquadra({ x: 260, y: 360, w: 770, h: 430 });
  const p = spring({ frame: frame - 4, fps, config: { damping: 200 }, durationInFrames: 30 });
  const s = ini.s + (fim.s - ini.s) * p;
  const tx = ini.tx + (fim.tx - ini.tx) * p;
  const ty = ini.ty + (fim.ty - ini.ty) * p;
  const marcasR = [
    { k: "a", r: { x: 286, y: 441, w: 614, h: 26 } },
    { k: "b", r: { x: 286, y: 441, w: 614, h: 26 }, nao: true },
    { k: "c", r: { x: 614, y: 690, w: 172, h: 25 } },
  ];
  return (
    <AbsoluteFill>
      <Moldura s={s} tx={tx} ty={ty}>
        <Freeze frame={60}>
          <OffthreadVideo src={pasta(slug, "clipes/vo-flow.mp4")} muted style={{ width: VW, height: VH, display: "block" }} />
        </Freeze>
        {marcasR.filter((x) => !x.nao).map(({ k, r }) => {
          const o = aparece(frame, m(marcas, k, 9999), 10);
          return <div key={k} style={{ position: "absolute", left: r.x - 4, top: r.y - 3, width: r.w + 8, height: r.h + 6, border: `3px solid ${colors.amarelo}`, borderRadius: 6, background: "rgba(242,204,69,0.16)", opacity: o, boxShadow: `0 0 14px ${colors.amarelo}` }} />;
        })}
      </Moldura>
      <Selo>Prompt ajustado</Selo>
    </AbsoluteFill>
  );
};

export const Consistencia = ({ marcas }) => {
  const frame = useCurrentFrame();
  const b = m(marcas, "b", 9999);
  const ref = frame >= b;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 40, paddingBottom: 100, fontFamily: FONT }}>
      <Pop de={4}>
        <Foto img="personagens/claudia-posto.jpg" style={{ width: 500, height: 600 }} pos="48% 35%" />
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 230 }}>
        {!ref ? (
          <Pop de={14}><div style={{ fontSize: 150, fontWeight: 900, color: colors.amarelo }}>≠</div></Pop>
        ) : (
          <Pop de={b}><div style={{ fontSize: 40, fontWeight: 900, color: colors.amarelo, textAlign: "center" }}>referência<br /><span style={{ fontSize: 110 }}>→</span></div></Pop>
        )}
      </div>
      <Pop de={8}>
        {!ref ? (
          <Foto img="personagens/claudia-rua.jpg" style={{ width: 500, height: 600 }} pos="50% 30%" />
        ) : (
          <Foto img="personagens/iara.jpg" style={{ width: 500, height: 600 }} pos="52% 25%" />
        )}
      </Pop>
      <div style={{ position: "absolute", top: 100, left: AREA.x, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 38, textTransform: "uppercase", letterSpacing: 2, padding: "6px 22px", borderRadius: radii.pill }}>Problema 1 · consistência</div>
    </AbsoluteFill>
  );
};

const No = ({ de, t, s, novo, style }) => (
  <Pop de={de} style={{ position: "absolute", ...style }}>
    <Caixa ativo={!novo} style={{ width: 420, padding: "20px 24px", textAlign: "center", borderStyle: novo ? "dashed" : "solid", borderColor: colors.amarelo }}>
      <div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1 }}>{t}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: novo ? colors.amarelo : colors.cinza, marginTop: 6 }}>{s}</div>
    </Caixa>
  </Pop>
);

export const Lore4 = ({ marcas }) => {
  const frame = useCurrentFrame();
  const f = m(marcas, "f", 9999);
  const g = m(marcas, "g", 9999);
  const nos = [
    ["b", "Osebo", "o leopardo", 0, { left: 130, top: 170 }],
    ["c", "Mmoatia", "espíritos da mata", 0, { left: 130, top: 600 }],
    ["d", "Onini", "a píton", 1, { right: 130, top: 170 }],
    ["e", "Mmoboro", "os marimbondos", 1, { right: 130, top: 600 }],
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Pop de={m(marcas, "a")} style={{ position: "absolute", left: 960 - 270, top: 360 }}>
        <Caixa style={{ width: 540, padding: "30px 20px", textAlign: "center", background: colors.amarelo, color: colors.roxoEscuro }}>
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1 }}>Anansi</div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>compra as histórias de Nyame</div>
        </Caixa>
      </Pop>
      {nos.map(([k, t, s, novo, pos]) => (
        <No key={k} de={m(marcas, k)} t={t} novo={novo} s={frame >= (novo ? g : f) ? (novo ? "esperando a vez" : "já está no conto ✓") : s} style={pos} />
      ))}
    </AbsoluteFill>
  );
};

export const Ponte = ({ marcas }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 60, paddingBottom: 120, fontFamily: FONT }}>
      <Pop de={4}><Caixa style={{ width: 480, padding: 40, textAlign: "center" }}><div style={{ fontSize: 34, color: colors.cinza, fontWeight: 800 }}>MITO AFRICANO</div><div style={{ fontSize: 76, fontWeight: 900 }}>Mmoatia</div></Caixa></Pop>
      <Pop de={18}>
        <div style={{ textAlign: "center", color: colors.amarelo, fontWeight: 900 }}>
          <div style={{ fontSize: 120, transform: "scaleX(-1)" }}>👣</div>
          <div style={{ fontSize: 40 }}>pés virados<br />para trás</div>
        </div>
      </Pop>
      <Pop de={30}><Caixa style={{ width: 480, padding: 40, textAlign: "center" }}><div style={{ fontSize: 34, color: colors.cinza, fontWeight: 800 }}>FOLCLORE BRASILEIRO</div><div style={{ fontSize: 76, fontWeight: 900 }}>Curupira</div></Caixa></Pop>
    </AbsoluteFill>
  );
};

export const Regra = ({ marcas }) => {
  const b = m(marcas, "b", 40);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 110, fontFamily: FONT }}>
      <Pop de={4}>
        <div style={{ color: colors.branco, fontSize: 66, fontWeight: 900, textAlign: "center", lineHeight: 1.05 }}>Cada pessoa vira o ser ligado ao<br /><span style={{ color: colors.amarelo }}>seu maior medo ou desejo</span></div>
      </Pop>
      <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
        {[["Seu Ademir", "Lobisomem", "qual era o medo?"], ["Dona Celina", "Mula sem cabeça", "qual era o desejo?"]].map(([q, v, p], i) => (
          <Pop key={q} de={b + i * 12}>
            <Caixa style={{ width: 600, padding: "26px 36px" }}>
              <div style={{ fontSize: 54, fontWeight: 900 }}>{q} → {v}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: colors.amarelo }}>{p}</div>
            </Caixa>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Canone = ({ marcas }) => {
  const frame = useCurrentFrame();
  const passos = [["a", "A IA propõe"], ["b", "Comparo com o romance"], ["c", "Eu decido"], ["c", "Vira oficial"]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 18, paddingBottom: 120, fontFamily: FONT }}>
      {passos.map(([k, t], i) => {
        const de = m(marcas, k) + (i === 3 ? 18 : 0);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {i > 0 && <div style={{ fontSize: 70, color: colors.amarelo, fontWeight: 900, opacity: aparece(frame, de - 4, 8) }}>→</div>}
            <Pop de={de}><Caixa ativo={i === 3 ? true : frame >= de} style={{ width: 340, height: 220, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 50, fontWeight: 900, padding: 20, background: i === 3 ? colors.amarelo : colors.roxo, color: i === 3 ? colors.roxoEscuro : colors.branco }}>{t}</Caixa></Pop>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Proximo = ({ marcas }) => {
  const frame = useCurrentFrame();
  const b = m(marcas, "b", 9999);
  const seres = ["Anansi", "Osebo", "Saci", "Mula sem cabeça"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 120, fontFamily: FONT }}>
      <div style={{ color: colors.cinza, fontSize: 40, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", marginBottom: 30 }}>No próximo vídeo</div>
      <div style={{ display: "flex", gap: 30 }}>
        {seres.map((s, i) => (
          <Pop key={s} de={4 + i * 8}>
            <Caixa style={{ width: 360, height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Silhueta cor="#3b1450" />
              <div style={{ fontSize: 46, fontWeight: 900, textAlign: "center" }}>{s}</div>
            </Caixa>
          </Pop>
        ))}
      </div>
      <Pop de={m(marcas, "a", 30)} style={{ marginTop: 40 }}>
        <div style={{ color: colors.amarelo, fontSize: 60, fontWeight: 900 }}>Qual você quer ver primeiro? 💬</div>
      </Pop>
      {frame >= b && (
        <Pop de={b} style={{ marginTop: 20 }}>
          <div style={{ background: "#e22", color: "#fff", fontWeight: 900, fontSize: 52, padding: "8px 44px", borderRadius: radii.md }}>INSCREVA-SE</div>
        </Pop>
      )}
    </AbsoluteFill>
  );
};

export const Recortes = ({ img, partes, rotulo, marcas }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const a = m(marcas, "a", 9999);
  const H = 640;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 60, paddingBottom: 80, fontFamily: FONT }}>
      {partes.map((r, i) => {
        const s = H / r.h;
        return (
          <Pop key={i} de={6 + i * 10}>
            <div style={{ width: r.w * s, height: H, overflow: "hidden", position: "relative", borderRadius: radii.lg, border: `4px solid ${colors.amarelo}`, boxShadow: shadows.suave }}>
              <Img src={pasta(slug, img)} style={{ position: "absolute", left: -r.x * s, top: -r.y * s, width: IW * s, height: IH * s, maxWidth: "none" }} />
            </div>
          </Pop>
        );
      })}
      {frame >= a && (
        <Pop de={a} style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center" }}>
          <div style={{ background: colors.roxoEscuro, border: `4px solid ${colors.amarelo}`, color: colors.branco, fontWeight: 900, fontSize: 56, padding: "6px 34px", borderRadius: radii.pill, transform: "rotate(-3deg)" }}>palavras sem sentido</div>
        </Pop>
      )}
      <div style={{ position: "absolute", top: 100, left: AREA.x, background: colors.amarelo, color: colors.roxoEscuro, fontWeight: 900, fontSize: 38, textTransform: "uppercase", letterSpacing: 2, padding: "6px 22px", borderRadius: radii.pill }}>{rotulo}</div>
    </AbsoluteFill>
  );
};
