// Short "Capa do Short trocada" (Aprenda YouTube, 28/11/2026 17:00). Mito vs. Realidade.
// Fatos: support.google.com/youtube/answer/72431 (capa própria só com conta verificada, senão só sugestões automáticas;
// Shorts 9:16, recomendado 2160x3840; vídeo vertical com capa 16:9 é trocado por uma 4:5 automática em Início, Explorar
// e Inscrições; capa fora das Diretrizes pode ser rejeitada e gerar strike; reincidência pode tirar a capa personalizada
// por 30 dias; Studio > Conteúdo > Shorts > Miniatura > Salvar).
// Só peças da identidade do canal (FundoAY, Forma, Play, Logo, Texto, LegendaCurta). Sem mascote, sem print, sem IA.
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CenaInterna, Forma, FundoAY, LegendaCurta, Logo, Play, Sfx, Texto } from "../components/identidade";
import { AMARELO, BRANCO, FONT, MAGENTA, MUSIC_VOLUME, PLAY, colors } from "../theme";

export const CDS_FPS = 30;
const FPS = CDS_FPS;
const TAIL = 1.1;
const SLUG = "yt-short-2026-11-28-1700-capa-do-short";
const f = (p) => staticFile(`aprendayoutube/episodes/shorts-reels-tiktok/${SLUG}/${p}`);
const MUSICA = "aprendayoutube/music/CuriousFocus.mp3";
const F = (s) => Math.round(s * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ESCURO = colors.fundoEscuro;
const CINZA = "#8a7b84";

export const calculateCapaDoShortMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w) => ({ w: w.w, start: w.s, end: w.e }));
  const end = words[words.length - 1].end;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças ----------
const mola = (frame, em, cfg = { damping: 11, mass: 0.6 }) => (frame < em ? 0 : spring({ frame: frame - em, fps: FPS, config: cfg }));

// Capa feita pelo criador (desenhada só com peças da marca).
const MinhaCapa = ({ w = 300, h = 533, texto = "MINHA CAPA", style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 26, background: `linear-gradient(170deg, ${colors.brilho}, ${MAGENTA})`, position: "relative", overflow: "hidden", border: `6px solid ${BRANCO}`, boxSizing: "border-box", ...style }}>
    <Forma largura={Math.min(w, h * 0.95) * 0.8} style={{ position: "absolute", left: (w - Math.min(w, h * 0.95) * 0.8) / 2, top: (h - Math.min(w, h * 0.95) * 0.8 * 0.93) / 2 + h * 0.04 }}>
      <div style={{ ...FONT, fontSize: Math.min(w, h * 0.95) * 0.13, color: MAGENTA }}>{texto}</div>
    </Forma>
    <Play size={w * 0.22} style={{ position: "absolute", right: w * 0.06, top: w * 0.06 }} />
  </div>
);

// Quadro automático (o que o YouTube põe no lugar): cinza, borrado, com selo "auto".
const CapaAuto = ({ w = 300, h = 533, rotulo = "auto", style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 26, background: `repeating-linear-gradient(135deg, ${CINZA}, ${CINZA} 18px, #75666f 18px, #75666f 36px)`, position: "relative", border: `6px solid ${BRANCO}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    <div style={{ ...FONT, fontSize: Math.min(w, h) * 0.17, color: BRANCO, background: ESCURO, padding: "6px 22px", borderRadius: 18 }}>{rotulo}</div>
  </div>
);

// Celular estilizado com um card de Short.
const Celular = ({ children, w = 420, h = 760, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: 60, background: ESCURO, padding: 20, boxSizing: "border-box", boxShadow: `0 24px 60px ${ESCURO}cc`, position: "relative", ...style }}>
    <div style={{ position: "absolute", left: w / 2 - 50, top: 26, width: 100, height: 14, borderRadius: 7, background: "#ffffff33" }} />
    <div style={{ width: "100%", height: "100%", borderRadius: 44, background: colors.cartao, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{children}</div>
  </div>
);

// Troca com giro em Y: mostra A até `em`, depois B.
const Vira = ({ em, a, b }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [em - 5, em + 5], [0, 1], clamp);
  const ang = t < 0.5 ? t * 180 : (t - 1) * 180;
  return <div style={{ transform: `perspective(1200px) rotateY(${ang}deg)` }}>{t < 0.5 ? a : b}</div>;
};

const Badge = ({ n, titulo, em = 0 }) => {
  const frame = useCurrentFrame();
  const s = mola(frame, em, { damping: 12, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 300, display: "flex", alignItems: "center", gap: 28, transform: `translateX(${(1 - s) * -900}px)` }}>
      <Sfx name="pop" atFrame={em} />
      <div style={{ ...FONT, width: 130, height: 130, borderRadius: 65, background: AMARELO, color: MAGENTA, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
      <div style={{ ...FONT, fontSize: 70, color: BRANCO, textAlign: "left", textShadow: `0 6px 0 ${ESCURO}` }}>{titulo}</div>
    </div>
  );
};

const Cursor = ({ x, y, clique = false }) => (
  <svg width={70} height={84} viewBox="0 0 24 28" style={{ position: "absolute", left: x, top: y, transform: `scale(${clique ? 0.82 : 1})`, filter: `drop-shadow(0 4px 6px ${ESCURO})` }}>
    <path d="M2 2 L2 22 L7.5 17 L11 26 L14.5 24.5 L11 16 L19 16 Z" fill={BRANCO} stroke={MAGENTA} strokeWidth="1.6" />
  </svg>
);

const Carimbo = ({ em, children, cor = PLAY, y = 900, size = 120, rot = -8 }) => {
  const frame = useCurrentFrame();
  if (frame < em) return null;
  const s = interpolate(frame - em, [0, 6], [2.2, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: `scale(${s}) rotate(${rot}deg)` }}>
      <div style={{ ...FONT, fontSize: size, color: BRANCO, background: cor, padding: "10px 46px", borderRadius: 30, border: `8px solid ${BRANCO}` }}>{children}</div>
    </div>
  );
};

const PlayDispara = ({ em, x = 445, de = 1500 }) => {
  const frame = useCurrentFrame();
  const t = frame - em;
  if (t < 0 || t > 40) return null;
  const y = interpolate(t, [0, 40], [de, -300], { easing: (v) => v * v });
  return <Play size={190} style={{ position: "absolute", left: x, top: y, transform: `rotate(${t * 9}deg)` }} />;
};

const FormaEstoura = ({ em, y = 860, largura = 760, children }) => {
  const frame = useCurrentFrame();
  const t = frame - em;
  if (t < 0) return null;
  const s = interpolate(t, [0, 5, 12], [0.2, 1.25, 1], clamp);
  const tremor = Math.sin(t * 2.4) * interpolate(t, [0, 20], [14, 2], clamp);
  return <Forma largura={largura} style={{ position: "absolute", left: (1080 - largura) / 2 + tremor, top: y, transform: `scale(${s}) rotate(${tremor / 2}deg)` }}>{children}</Forma>;
};

const Treme = ({ em, ate = 9999, forca = 12, children, style = {} }) => {
  const frame = useCurrentFrame();
  const on = frame >= em && frame < ate;
  const dx = on ? Math.sin(frame * 2.3) * interpolate(frame, [em, em + 20], [forca, 3], clamp) : 0;
  return <div style={{ transform: `translateX(${dx}px) rotate(${dx / 4}deg)`, ...style }}>{children}</div>;
};

// ---------- cenas (frames locais) ----------
// C1 0 s: "Sua capa do Short pode ser TROCADA!" (TROCADA em 1,84 s = f55)
const Cena1 = () => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 8], [1.15, 1], clamp);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" atFrame={0} />
      <Sfx name="pop" atFrame={18} />
      <Sfx name="error" atFrame={55} />
      <Texto y={300} size={88}>Sua capa do Short</Texto>
      <div style={{ position: "absolute", left: 330, top: 450, transform: `scale(${punch})` }}>
        <Celular>
          <Vira em={55} a={<MinhaCapa w={340} h={604} />} b={<CapaAuto w={340} h={604} />} />
        </Celular>
      </div>
      {frame >= 18 && frame < 55 ? <Texto em={18} y={1260} size={60} fundo={colors.verde} color={MAGENTA}>✓ capa enviada</Texto> : null}
      <PlayDispara em={6} x={820} />
      <Texto em={55} y={1080} size={160} fundo={AMARELO} rot={-4}>TROCADA!</Texto>
      {frame >= 55 ? <AbsoluteFill style={{ background: AMARELO, opacity: interpolate(frame, [55, 61], [0.55, 0], clamp) }} /> : null}
    </AbsoluteFill>
  );
};

// C2 2,7 s: "São três regras do YouTube... e a segunda é a pegadinha!" (três 3,2; segunda 4,88; pegadinha 5,84)
const Cena2 = () => {
  const frame = useCurrentFrame();
  const cards = [15, 27, 39];
  const destaque = frame >= 65;
  return (
    <AbsoluteFill>
      <Texto em={0} y={320} size={84}>O YouTube tem</Texto>
      <Texto em={15} y={440} size={110} fundo={AMARELO} rot={-3}>3 regras</Texto>
      <div style={{ position: "absolute", left: 90, right: 90, top: 720, display: "flex", justifyContent: "space-between" }}>
        {cards.map((em, i) => {
          const s = mola(frame, em, { damping: 10, mass: 0.6 });
          const dois = i === 1 && destaque;
          const tr = dois ? Math.sin(frame * 2.2) * interpolate(frame, [65, 90], [14, 3], clamp) : 0;
          return (
            <div key={i} style={{ width: 260, height: 340, borderRadius: 36, background: dois ? AMARELO : BRANCO, opacity: destaque && !dois ? 0.45 : 1, transform: `scale(${s * (dois ? 1.18 : 1)}) translateX(${tr}px) rotate(${tr / 3}deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 18px 40px ${ESCURO}` }}>
              <Sfx name="pop" atFrame={em} />
              <div style={{ ...FONT, fontSize: 170, color: MAGENTA }}>{i + 1}</div>
            </div>
          );
        })}
      </div>
      <Sfx name="riser" atFrame={65} />
      <Sfx name="error" atFrame={94} />
      <Texto em={94} y={1150} size={110} fundo={PLAY} rot={3}>pegadinha!</Texto>
    </AbsoluteFill>
  );
};

// C3 6,8 s: conta verificada (conta 7,8=f30; verificar? 9,28=f74; Nada 10,16=f101; Só as sugestões 11,5=f142)
const Cena3 = () => {
  const frame = useCurrentFrame();
  const bloqueado = frame >= 101;
  const cx = interpolate(frame, [60, 92], [900, 640], clamp);
  return (
    <AbsoluteFill>
      <Badge n={1} titulo="Conta verificada" em={0} />
      {frame >= 24 ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 480, padding: "30px 36px", borderRadius: 36, background: BRANCO, transform: `scale(${mola(frame, 24)})` }}>
          <div style={{ ...FONT, fontSize: 46, color: `${MAGENTA}aa`, textAlign: "left" }}>Miniatura</div>
          <div style={{ marginTop: 18, height: 120, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, background: bloqueado ? "#ddd" : AMARELO, border: bloqueado ? `5px dashed ${CINZA}` : "none" }}>
            <div style={{ ...FONT, fontSize: 52, color: bloqueado ? CINZA : MAGENTA }}>{bloqueado ? "🔒 Fazer upload" : "Fazer upload"}</div>
          </div>
          <Cursor x={cx} y={150} clique={frame > 92 && frame < 100} />
        </div>
      ) : null}
      {frame >= 48 && frame < 101 ? <Texto em={48} y={860} size={60} fundo={PLAY}>conta não verificada</Texto> : null}
      <Sfx name="pop" atFrame={48} />
      <Sfx name="error" atFrame={101} />
      {frame >= 101 && frame < 142 ? <Carimbo em={101} y={880} size={110} rot={-6}>NADA!</Carimbo> : null}
      {frame >= 142 ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 860, display: "flex", justifyContent: "space-between" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ transform: `scale(${mola(frame, 142 + i * 8)})` }}>
              <Sfx name="pop" atFrame={142 + i * 8} />
              <CapaAuto w={260} h={400} rotulo="auto" />
            </div>
          ))}
        </div>
      ) : null}
      <Texto em={170} y={1290} size={60}>só sugestões</Texto>
    </AbsoluteFill>
  );
};

// C4 13,3 s: em pé, 9:16 (Short 14,8=f45; EM PÉ 15,56=f68; Nove 16,4=f93)
const Cena4 = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [62, 76], [0, 1], clamp);
  const w = interpolate(k, [0, 1], [760, 400]);
  const h = interpolate(k, [0, 1], [428, 711]);
  return (
    <AbsoluteFill>
      <Badge n={2} titulo="Capa em pé" em={0} />
      <div style={{ position: "absolute", left: (1080 - w) / 2, top: 500 + (711 - h) / 2, transform: `scale(${mola(frame, 10)})` }}>
        <MinhaCapa w={w} h={h} />
      </div>
      <Sfx name="pop" atFrame={10} />
      <Sfx name="whoosh" atFrame={62} />
      {frame >= 30 && frame < 62 ? <Texto em={30} y={1000} size={64} fundo={PLAY}>deitada? ✕</Texto> : null}
      <Sfx name="coin" atFrame={93} />
      <Texto em={93} y={1130} size={150} fundo={AMARELO} rot={-3}>9:16</Texto>
      <Texto em={110} y={1320} size={50}>recomendado 2160 × 3840</Texto>
    </AbsoluteFill>
  );
};

// C5 17,85 s: capa deitada é trocada (deitada? 18,44=f18; Início 19,36=f45; Explorar 20,12=f68; Inscrições 20,96=f93;
// troca 22,4=f137; quatro por cinco 23,04=f155)
const ABAS = [{ em: 45, t: "Início" }, { em: 68, t: "Explorar" }, { em: 93, t: "Inscrições" }];
const Cena5 = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Texto em={0} y={300} size={84}>Capa deitada</Texto>
      <Texto em={14} y={410} size={84}>no Short?</Texto>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 20 }}>
        {ABAS.map((a) => (
          <div key={a.t} style={{ ...FONT, fontSize: 48, color: MAGENTA, background: BRANCO, padding: "14px 28px", borderRadius: 40, transform: `scale(${mola(frame, a.em)})` }}>
            <Sfx name="pop" atFrame={a.em} />
            {a.t}
          </div>
        ))}
      </div>
      <Treme em={130} ate={150} style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scale(${mola(frame, 4)})` }}>
          <Vira em={137} a={<MinhaCapa w={720} h={405} texto="16:9" />} b={<CapaAuto w={440} h={550} rotulo="4:5 auto" />} />
        </div>
      </Treme>
      <Sfx name="pop" atFrame={4} />
      <Sfx name="error" atFrame={137} />
      <Carimbo em={155} y={1290} size={84} rot={-5}>troca automática</Carimbo>
    </AbsoluteFill>
  );
};

// C6 24,8 s: meme "Trocou mais rápido que Power Ranger morfando!" (morfando 26,6 = f54)
const CORES = [PLAY, "#2f6fe0", AMARELO, "#ff7ac0", colors.verde, BRANCO];
const Cena6 = () => {
  const frame = useCurrentFrame();
  const i = Math.floor(frame / 4) % CORES.length;
  return (
    <AbsoluteFill>
      <Texto em={0} y={300} size={84}>Trocou mais rápido</Texto>
      <Texto em={10} y={410} size={84}>que Power Ranger</Texto>
      <div style={{ position: "absolute", left: 340, top: 600, transform: `rotate(${Math.sin(frame / 2) * 6}deg) scale(${1 + 0.06 * Math.sin(frame)})` }}>
        <div style={{ width: 400, height: 560, borderRadius: 30, background: CORES[i], border: `8px solid ${BRANCO}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...FONT, fontSize: 120, color: i === 2 || i === 5 ? MAGENTA : BRANCO }}>⚡</div>
        </div>
      </div>
      {[12, 24, 36].map((em) => <Sfx key={em} name="whoosh" atFrame={em} />)}
      <FormaEstoura em={54} y={930} largura={560}>
        <div style={{ ...FONT, fontSize: 88, color: MAGENTA }}>morfando!</div>
      </FormaEstoura>
      <Sfx name="ding" atFrame={54} />
      <PlayDispara em={56} x={820} de={1400} />
    </AbsoluteFill>
  );
};

// C7 27,45 s: Diretrizes (Diretrizes 29,6=f65; Violou? 31,2=f112; rejeitada 32,32=f146; strike 33,68=f187)
const Cena7 = () => {
  const frame = useCurrentFrame();
  const violou = frame >= 112;
  return (
    <AbsoluteFill>
      <Badge n={3} titulo="Diretrizes" em={0} />
      {frame >= 60 ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 470, padding: "24px 34px", borderRadius: 32, background: BRANCO, transform: `scale(${mola(frame, 60)})` }}>
          <div style={{ ...FONT, fontSize: 50, color: MAGENTA }}>Diretrizes da Comunidade</div>
        </div>
      ) : null}
      <Sfx name="pop" atFrame={60} />
      <Treme em={112} ate={146} forca={16} style={{ position: "absolute", left: 350, top: 640 }}>
        <div style={{ transform: `scale(${mola(frame, 20)})`, outline: violou ? `10px solid ${PLAY}` : "none", borderRadius: 30 }}>
          <MinhaCapa w={380} h={560} texto="CAPA" />
        </div>
      </Treme>
      <Sfx name="pop" atFrame={20} />
      {violou && frame < 146 ? <Texto em={112} y={1250} size={80} fundo={PLAY}>violou?</Texto> : null}
      <Sfx name="error" atFrame={146} />
      <Carimbo em={146} y={860} size={110} rot={-8}>REJEITADA</Carimbo>
      <Sfx name="error" atFrame={187} />
      <Texto em={187} y={1250} size={96} fundo={AMARELO} rot={3}>⚠ + strike!</Texto>
    </AbsoluteFill>
  );
};

// C8 34,4 s: "Repetiu? Pode ficar trinta dias sem capa personalizada!" (trinta 35,92=f46; sem capa 36,72=f70)
const Cena8 = () => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [46, 74], [0, 30], clamp));
  return (
    <AbsoluteFill>
      <Texto em={0} y={300} size={96} fundo={PLAY}>Repetiu?</Texto>
      <div style={{ position: "absolute", left: 140, right: 140, top: 480, padding: 24, borderRadius: 34, background: BRANCO, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, transform: `scale(${mola(frame, 12)})` }}>
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{ height: 90, borderRadius: 14, background: i < n ? PLAY : `${MAGENTA}22`, display: "flex", alignItems: "center", justifyContent: "center", ...FONT, fontSize: 34, color: i < n ? BRANCO : `${MAGENTA}88` }}>{i < n ? "✕" : i + 1}</div>
        ))}
      </div>
      <Sfx name="pop" atFrame={12} />
      <Sfx name="riser" atFrame={46} />
      <FormaEstoura em={74} y={1000} largura={440}>
        <div style={{ ...FONT, fontSize: 84, color: MAGENTA }}>30 dias</div>
      </FormaEstoura>
      <Sfx name="error" atFrame={74} />
    </AbsoluteFill>
  );
};

// C9 38,1 s: passos (Studio 39,32=f37; Conteúdo 39,76=f50; Shorts 40,64=f76; Miniatura 41,32=f97; salvar 42,28=f125)
const PASSOS = [{ em: 37, t: "Studio" }, { em: 50, t: "Conteúdo" }, { em: 76, t: "Shorts" }, { em: 97, t: "Miniatura" }];
const Cena9 = () => {
  const frame = useCurrentFrame();
  const atual = PASSOS.filter((p) => frame >= p.em).length - 1;
  const salvo = frame >= 125;
  const cy = atual < 0 ? 520 : 470 + atual * 150;
  return (
    <AbsoluteFill>
      <Texto em={0} y={300} size={90}>Pra trocar:</Texto>
      <div style={{ position: "absolute", left: 140, right: 140, top: 440, display: "flex", flexDirection: "column", gap: 30 }}>
        {PASSOS.map((p, i) => (frame >= 4 + i * 6 ? <div key={`g${i}`} style={{ position: "absolute", left: 0, right: 0, top: i * 150, height: 120, borderRadius: 30, border: `5px dashed ${BRANCO}88`, opacity: interpolate(frame, [4 + i * 6, 10 + i * 6], [0, 1], clamp) }} /> : null))}
        {PASSOS.map((p, i) => {
          const s = mola(frame, p.em, { damping: 12 });
          const on = i === atual;
          return (
            <div key={p.t} style={{ height: 120, borderRadius: 30, background: on ? AMARELO : BRANCO, display: "flex", alignItems: "center", gap: 24, padding: "0 34px", transform: `translateX(${(1 - s) * 1200}px) scale(${on ? 1.04 : 1})` }}>
              <Sfx name="pop" atFrame={p.em} />
              <div style={{ ...FONT, width: 70, height: 70, borderRadius: 35, background: MAGENTA, color: BRANCO, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <div style={{ ...FONT, fontSize: 60, color: MAGENTA }}>{p.t}</div>
            </div>
          );
        })}
      </div>
      {frame >= 108 ? (
        <div style={{ position: "absolute", left: 290, top: 1110, width: 500, height: 130, borderRadius: 65, background: salvo ? colors.verde : PLAY, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${mola(frame, 108, { damping: 10 }) * (frame > 120 && frame < 126 ? 0.9 : 1)})` }}>
          <div style={{ ...FONT, fontSize: 64, color: BRANCO }}>{salvo ? "SALVO ✓" : "SALVAR"}</div>
        </div>
      ) : null}
      <Cursor x={frame >= 112 ? 640 : 820} y={frame >= 112 ? 1190 : cy + 40} clique={frame > 120 && frame < 126} />
      <Sfx name="ding" atFrame={125} />
    </AbsoluteFill>
  );
};

// C10 42,9 s: CTA (em pé 45,04=f64; deitada 45,52=f79; segue 46,72=f115)
const Cena10 = () => {
  const frame = useCurrentFrame();
  const texto = "Minha última capa era…";
  const n = Math.floor(interpolate(frame, [6, 40], [0, texto.length], clamp));
  return (
    <AbsoluteFill>
      <Logo largura={560} style={{ position: "absolute", left: 260, top: 290, transform: `scale(${1 + 0.03 * Math.sin(frame / 6)})` }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 740, padding: "34px 36px", borderRadius: 36, background: BRANCO }}>
        <div style={{ ...FONT, fontSize: 40, color: `${MAGENTA}99`, textAlign: "left", marginBottom: 12 }}>Adicione um comentário…</div>
        <div style={{ ...FONT, fontSize: 58, color: MAGENTA, textAlign: "left", minHeight: 70 }}>{texto.slice(0, n)}{frame % 16 < 8 ? "|" : ""}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", gap: 40 }}>
        {[{ em: 64, t: "EM PÉ", c: AMARELO }, { em: 79, t: "DEITADA", c: PLAY }].map((b) => (
          <div key={b.t} style={{ ...FONT, fontSize: 64, padding: "22px 40px", borderRadius: 40, background: b.c, color: b.c === AMARELO ? MAGENTA : BRANCO, transform: `scale(${mola(frame, b.em, { damping: 9 })})` }}>
            <Sfx name="pop" atFrame={b.em} />
            {b.t}
          </div>
        ))}
      </div>
      <Texto em={112} y={1260} size={66} fundo={AMARELO} rot={-2}>Segue pra próxima cobaia!</Texto>
    </AbsoluteFill>
  );
};

// início de cada cena em segundos (tempos das palavras em audio/words.json)
const CENAS = [
  [0, Cena1], [2.7, Cena2], [6.8, Cena3], [13.3, Cena4], [17.85, Cena5], [24.8, Cena6], [27.45, Cena7], [34.4, Cena8], [38.1, Cena9], [42.9, Cena10],
];

export const ShortCapaDoShort = ({ words = [], endSec = 49 }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <FundoAY>
        {CENAS.map(([ini, C], i) => {
          const from = F(ini);
          const ate = i + 1 < CENAS.length ? F(CENAS[i + 1][0]) : durationInFrames;
          return (
            <Sequence key={i} from={from} durationInFrames={ate - from}>
              {i === 0 ? <C /> : <CenaInterna><C /></CenaInterna>}
            </Sequence>
          );
        })}
        <Sequence from={F(5)} durationInFrames={F(42.9) - F(5)}>
          <Logo largura={200} coracao={false} style={{ position: "absolute", left: 440, top: 100 }} />
        </Sequence>
        <LegendaCurta palavras={words} y={1500} />
      </FundoAY>
      <Audio src={f("audio/narracao.mp3")} />
      <Audio src={staticFile(MUSICA)} loop volume={MUSIC_VOLUME} />
    </AbsoluteFill>
  );
};

// Capa (still 1080x1920, zona segura y 285–1635): mesma promessa do gancho.
export const CapaCapaDoShort = () => (
  <FundoAY>
    <Logo largura={300} coracao={false} style={{ position: "absolute", left: 390, top: 300 }} />
    <Texto em={-30} y={600} size={100}>Sua capa do Short</Texto>
    <Texto em={-30} y={735} size={140} fundo={AMARELO} rot={-3}>trocada?</Texto>
    <div style={{ position: "absolute", left: 130, top: 960, display: "flex", gap: 30, alignItems: "center" }}>
      <MinhaCapa w={300} h={460} />
      <div style={{ ...FONT, fontSize: 120, color: AMARELO }}>→</div>
      <CapaAuto w={300} h={460} rotulo="auto" />
    </div>
    <Texto em={-30} y={1480} size={66}>3 regras do YouTube</Texto>
  </FundoAY>
);
