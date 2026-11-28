// Narração: audio/narracao.mp3 já com o corte 2,50–5,50 s (ver audio/words.json, campo "corte").
// Short "Tela final invisível" (Aprenda YouTube, 28/11/2026 10:00). Mito vs. Realidade.
// Fatos: support.google.com/youtube/answer/6388789 (mín. 25 s; últimos 5 a 20 s; até 4 elementos em 16:9;
// "conteúdo para crianças" não tem tela final, mesmo se já tiver sido adicionada; Studio > Conteúdo > Editor > Tela final > Salvar).
// Só peças da identidade do canal (FundoAY, Forma, Play, Logo, Texto, LegendaCurta). Sem mascote, sem print, sem IA.
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CenaInterna, Forma, FundoAY, LegendaCurta, Logo, Play, Sfx, Texto } from "../components/identidade";
import { AMARELO, BRANCO, FONT, MAGENTA, MUSIC_VOLUME, PLAY, colors } from "../theme";

export const TLF_FPS = 30;
const FPS = TLF_FPS;
const TAIL = 1.1;
const SLUG = "yt-short-2026-11-28-1000-tela-final";
const f = (p) => staticFile(`aprendayoutube/episodes/shorts-reels-tiktok/${SLUG}/${p}`);
const MUSICA = "aprendayoutube/music/Coding_at_Night.mp3";
const F = (s) => Math.round(s * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ESCURO = colors.fundoEscuro;

export const calculateTelaFinalMetadata = async () => {
  const wj = await fetch(f("audio/words.json")).then((r) => r.json());
  const words = wj.words.map((w) => ({ w: w.w, start: w.s, end: w.e }));
  const end = words[words.length - 1].end;
  return { durationInFrames: Math.ceil((end + TAIL) * FPS), props: { words, endSec: end + TAIL } };
};

// ---------- peças ----------
const useMola = (em, cfg = { damping: 12, mass: 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame < em ? 0 : spring({ frame: frame - em, fps, config: cfg });
};

// Player 16:9 recriado (cartão branco com tela escura e barra de progresso).
const Player = ({ w = 940, prog = 0.97, children, style = {} }) => {
  const h = Math.round((w * 9) / 16);
  return (
    <div style={{ width: w, padding: 18, borderRadius: 40, background: BRANCO, boxShadow: `0 24px 60px ${ESCURO}aa`, ...style }}>
      <div style={{ position: "relative", width: "100%", height: h, borderRadius: 24, overflow: "hidden", background: `linear-gradient(160deg, ${colors.cartao}, ${ESCURO})` }}>
        {children}
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 18, height: 10, borderRadius: 5, background: "#ffffff44" }}>
          <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 5, background: PLAY }} />
        </div>
      </div>
    </div>
  );
};

// Elemento da tela final (vídeo, playlist, inscrever-se, canal).
const Elemento = ({ tipo = "Vídeo", w = 250, h = 150, op = 1, s = 1, x = 0, y = 0, tracejado = false }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: tipo === "Inscrever-se" ? h / 2 : 18, opacity: op, transform: `scale(${s})`,
    background: tracejado ? "transparent" : tipo === "Inscrever-se" ? PLAY : AMARELO, border: tracejado ? `5px dashed ${BRANCO}aa` : "none",
    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: tracejado ? "none" : `0 10px 24px ${ESCURO}` }}>
    {tracejado ? null : <div style={{ ...FONT, fontSize: 40, color: tipo === "Inscrever-se" ? BRANCO : MAGENTA }}>{tipo}</div>}
  </div>
);

const Badge = ({ n, titulo, em = 0 }) => {
  const s = useMola(em);
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

// Play da marca disparando para cima (reação).
const PlayDispara = ({ em, x = 445, de = 1500 }) => {
  const frame = useCurrentFrame();
  const t = frame - em;
  if (t < 0 || t > 40) return null;
  const y = interpolate(t, [0, 40], [de, -300], { easing: (v) => v * v });
  return <Play size={190} style={{ position: "absolute", left: x, top: y, transform: `rotate(${t * 9}deg)` }} />;
};

// Forma amarela estourando atrás de um número/palavra (reação).
const FormaEstoura = ({ em, y = 860, largura = 760 }) => {
  const frame = useCurrentFrame();
  const t = frame - em;
  if (t < 0) return null;
  const s = interpolate(t, [0, 5, 12], [0.2, 1.25, 1], clamp);
  const tremor = Math.sin(t * 2.4) * interpolate(t, [0, 20], [14, 2], clamp);
  return <Forma largura={largura} style={{ position: "absolute", left: (1080 - largura) / 2 + tremor, top: y, transform: `scale(${s}) rotate(${tremor / 2}deg)`, opacity: 0.95 }} />;
};

// ---------- cenas (frames locais) ----------
const Cena1 = () => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 8], [1.15, 1], clamp);
  const some = interpolate(frame, [42, 50], [1, 0.12], clamp);
  const pisca = frame < 42 ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 2.2)) : some;
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" atFrame={0} />
      <Sfx name="error" atFrame={45} />
      <Texto y={330} size={88}>Sua tela final</Texto>
      <div style={{ position: "absolute", left: 70, top: 500, transform: `scale(${punch})` }}>
        <Player>
          <Elemento tipo="Vídeo" x={40} y={60} op={pisca} />
          <Elemento tipo="Vídeo" x={330} y={60} op={pisca} />
          <Elemento tipo="Inscrever-se" x={190} y={270} w={300} h={110} op={pisca} />
          {frame >= 45 ? [40, 330].map((x) => <Elemento key={x} tracejado x={x} y={60} />) : null}
        </Player>
      </div>
      <PlayDispara em={6} x={790} />
      <Texto em={45} y={1110} size={150} fundo={AMARELO} rot={-4}>INVISÍVEL!</Texto>
      {frame >= 45 ? <AbsoluteFill style={{ background: AMARELO, opacity: interpolate(frame, [45, 51], [0.55, 0], clamp) }} /> : null}
    </AbsoluteFill>
  );
};

const Cena2 = () => {
  const frame = useCurrentFrame();
  const cards = [0, 18, 36];
  const treme = frame >= 65 ? Math.sin(frame * 2.2) * interpolate(frame, [65, 88], [16, 3], clamp) : 0;
  return (
    <AbsoluteFill>
      <Texto em={0} y={330} size={84}>O YouTube tem</Texto>
      <Texto em={5} y={450} size={110} fundo={AMARELO} rot={-3}>3 regras</Texto>
      <div style={{ position: "absolute", left: 90, right: 90, top: 720, display: "flex", justifyContent: "space-between" }}>
        {cards.map((em, i) => {
          const s = frame < em ? 0 : spring({ frame: frame - em, fps: FPS, config: { damping: 10, mass: 0.6 } });
          const terceira = i === 2 && frame >= 65;
          return (
            <div key={i} style={{ width: 260, height: 340, borderRadius: 36, background: terceira ? PLAY : BRANCO, transform: `scale(${s}) rotate(${terceira ? treme / 3 : 0}deg) translateX(${terceira ? treme : 0}px)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 18px 40px ${ESCURO}` }}>
              <Sfx name="pop" atFrame={em} />
              <div style={{ ...FONT, fontSize: 170, color: terceira ? BRANCO : MAGENTA }}>{i + 1}</div>
            </div>
          );
        })}
      </div>
      <Sfx name="error" atFrame={84} />
      <Texto em={84} y={1160} size={100} fundo={AMARELO} rot={3}>apaga tudo!</Texto>
    </AbsoluteFill>
  );
};

const Cena3 = () => {
  const frame = useCurrentFrame();
  const seg = Math.floor(interpolate(frame, [27, 66], [0, 24], clamp));
  const vermelho = frame >= 69;
  return (
    <AbsoluteFill>
      <Badge n={1} titulo="Duração mínima" em={0} />
      <div style={{ position: "absolute", left: 70, top: 520 }}>
        <Player prog={seg / 25}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ ...FONT, fontSize: 210, color: vermelho ? PLAY : BRANCO, transform: `scale(${vermelho ? 1 + 0.05 * Math.sin(frame / 2) : 1})` }}>0:{String(seg).padStart(2, "0")}</div>
          </div>
        </Player>
      </div>
      {frame >= 69 && frame < 126 ? <Carimbo em={69} y={1100} size={90} rot={-5}>mín. 25 s</Carimbo> : null}
      <Sfx name="error" atFrame={69} />
      <Texto em={93} saiEm={124} y={1250} size={80}>Sem tela final</Texto>
      <FormaEstoura em={126} y={900} largura={720} />
      <Sfx name="whoosh" atFrame={126} />
      <Texto em={128} y={1150} size={112} color={MAGENTA} style={{ textShadow: "none" }}>NENHUMA!</Texto>
    </AbsoluteFill>
  );
};

const Cena4 = () => {
  const frame = useCurrentFrame();
  const zona = interpolate(frame, [36, 60], [0, 1], clamp);
  const cursor = interpolate(frame, [0, 36], [0, 0.8], clamp);
  return (
    <AbsoluteFill>
      <Texto em={0} y={330} size={84}>Ela só aparece</Texto>
      <Texto em={10} y={450} size={96} fundo={AMARELO} rot={-2}>no finalzinho</Texto>
      <div style={{ position: "absolute", left: 80, right: 80, top: 760, height: 120, borderRadius: 24, background: BRANCO, overflow: "hidden" }}>
        {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 76, top: 20, width: 60, height: 80, borderRadius: 10, background: `${MAGENTA}${i % 2 ? "55" : "88"}` }} />)}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${zona * 24}%`, background: AMARELO, borderLeft: `6px solid ${PLAY}` }} />
        <div style={{ position: "absolute", left: `${cursor * 100}%`, top: 0, bottom: 0, width: 6, background: PLAY }} />
      </div>
      <Sfx name="whoosh" atFrame={36} />
      <Texto em={52} y={920} size={64}>últimos 20 s</Texto>
      <Texto em={70} y={1010} size={64}>(mín. 5 s)</Texto>
      <Sfx name="pop" atFrame={70} />
      {frame >= 104 ? (
        <div style={{ position: "absolute", left: 120, right: 120, top: 1140, padding: "26px 30px", borderRadius: 36, background: BRANCO, display: "flex", alignItems: "center", gap: 24, transform: `scale(${spring({ frame: frame - 104, fps: FPS, config: { damping: 11 } })})` }}>
          <Sfx name="ding" atFrame={104} />
          <div style={{ ...FONT, width: 90, height: 90, borderRadius: 45, background: colors.verde, color: BRANCO, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
          <div style={{ ...FONT, fontSize: 56, color: MAGENTA, textAlign: "left" }}>Final livre na edição</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const SLOTS = [{ x: 40, y: 50 }, { x: 330, y: 50 }, { x: 40, y: 250 }, { x: 330, y: 250 }];
const PREENCHE = [{ em: 121, t: "Vídeo" }, { em: 138, t: "Playlist" }, { em: 164, t: "Inscrever-se" }, { em: 180, t: "Canal" }];
const Cena5 = () => {
  const frame = useCurrentFrame();
  const quinto = frame - 191;
  const quintoX = quinto < 0 ? 1200 : interpolate(quinto, [0, 8, 16], [1200, 700, 1300], clamp);
  return (
    <AbsoluteFill>
      <Badge n={2} titulo="Limite de peças" em={0} />
      <div style={{ position: "absolute", left: 70, top: 500 }}>
        <Player>
          {SLOTS.map((p, i) => frame >= 62 + i * 8 ? <Elemento key={`s${i}`} tracejado x={p.x} y={p.y} w={260} h={160} /> : null)}
          {PREENCHE.map((p, i) => (frame >= p.em ? <Elemento key={p.t} tipo={p.t} x={SLOTS[i].x} y={SLOTS[i].y} w={260} h={160} s={spring({ frame: frame - p.em, fps: FPS, config: { damping: 10 } })} /> : null))}
          <div style={{ position: "absolute", right: 30, top: 40, width: 220, height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: frame >= 53 ? 1 : 0 }}>
            <div style={{ ...FONT, fontSize: 200, color: AMARELO, transform: `scale(${frame >= 53 ? spring({ frame: frame - 53, fps: FPS, config: { damping: 8 } }) : 0})` }}>4</div>
            <div style={{ ...FONT, fontSize: 50, color: BRANCO }}>no máx.</div>
          </div>
        </Player>
      </div>
      {PREENCHE.map((p) => <Sfx key={p.t} name="pop" atFrame={p.em} />)}
      <Sfx name="coin" atFrame={53} />
      {quinto >= 0 ? (
        <div style={{ position: "absolute", left: quintoX, top: 1110 }}>
          <Elemento tipo="5º?" x={0} y={0} w={240} h={140} />
          {quinto > 6 ? <div style={{ ...FONT, position: "absolute", left: 80, top: -10, fontSize: 140, color: PLAY }}>✕</div> : null}
        </div>
      ) : null}
      <Sfx name="error" atFrame={197} />
      <Texto em={197} y={1290} size={80} fundo={AMARELO} rot={-3}>escolhe bem!</Texto>
      <Texto em={30} saiEm={190} y={1130} size={58}>vídeo horizontal (16:9)</Texto>
    </AbsoluteFill>
  );
};

const Cena6 = () => {
  const frame = useCurrentFrame();
  const ligado = frame >= 46;
  const k = interpolate(frame, [46, 52], [0, 1], clamp);
  const some = interpolate(frame, [117, 125], [1, 0], clamp);
  const cx = interpolate(frame, [10, 40], [300, 820], clamp);
  return (
    <AbsoluteFill>
      <Badge n={3} titulo="Público do vídeo" em={0} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 480, padding: "28px 34px", borderRadius: 36, background: BRANCO, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ ...FONT, fontSize: 52, color: MAGENTA, textAlign: "left" }}>Conteúdo para<br />crianças</div>
        <div style={{ width: 170, height: 90, borderRadius: 45, background: ligado ? PLAY : "#ccc", position: "relative" }}>
          <div style={{ position: "absolute", top: 8, left: 8 + k * 80, width: 74, height: 74, borderRadius: 37, background: BRANCO }} />
        </div>
        <Cursor x={cx} y={70} clique={frame > 40 && frame < 50} />
      </div>
      <Sfx name="pop" atFrame={46} />
      {frame >= 64 && frame < 117 ? <Texto em={64} y={1290} size={64} fundo={PLAY}>⚠ tela final…</Texto> : null}
      {frame >= 64 ? <Sfx name="riser" atFrame={64} /> : null}
      <div style={{ position: "absolute", left: 160, top: 760, transform: `scale(0.82) translateX(${frame >= 64 && frame < 117 ? Math.sin(frame * 1.7) * interpolate(frame, [64, 116], [2, 14], clamp) : 0}px)`, transformOrigin: "top left", outline: frame >= 64 && frame < 117 && frame % 10 < 5 ? `8px solid ${PLAY}` : "none", borderRadius: 40 }}>
        <Player>
          {[{ x: 40, t: "Vídeo" }, { x: 330, t: "Vídeo" }].map((p, i) => <Elemento key={i} tipo={p.t} x={p.x} y={60} op={some} s={1 + (1 - some) * 0.4} />)}
          <Elemento tipo="Inscrever-se" x={190} y={270} w={300} h={110} op={some} s={1 + (1 - some) * 0.4} />
          {frame >= 117 ? [40, 330].map((x) => <Elemento key={x} tracejado x={x} y={60} />) : null}
        </Player>
      </div>
      <Sfx name="error" atFrame={117} />
      <Carimbo em={117} y={1120} size={130} rot={-7}>SOME!</Carimbo>
      <Texto em={140} y={1300} size={64}>mesmo já colocada</Texto>
    </AbsoluteFill>
  );
};

const Cena7 = () => {
  const frame = useCurrentFrame();
  const zap = (i) => (Math.floor((frame + i * 3) / 3) % 2 === 0 ? 1 : 0.15);
  return (
    <AbsoluteFill>
      <Texto em={0} y={330} size={80}>Some mais rápido</Texto>
      <Texto em={8} y={440} size={80}>que o Goku no</Texto>
      <Texto em={50} y={1150} size={110} fundo={AMARELO} rot={-4}>teletransporte!</Texto>
      {[0, 1, 2].map((i) => {
        const sai = interpolate(frame, [30 + i * 6, 40 + i * 6], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: 120 + i * 290, top: 720 - sai * 500, opacity: (1 - sai) * zap(i), transform: `scaleY(${1 + sai * 2}) scaleX(${1 - sai * 0.7})` }}>
            <Elemento tipo={i === 1 ? "Playlist" : "Vídeo"} x={0} y={0} w={250} h={150} />
          </div>
        );
      })}
      {[30, 36, 42].map((em) => <Sfx key={em} name="whoosh" atFrame={em} />)}
      <FormaEstoura em={0} y={880} largura={300} />
      <PlayDispara em={48} x={150} de={1400} />
    </AbsoluteFill>
  );
};

const PASSOS = [{ em: 36, t: "Studio" }, { em: 53, t: "Conteúdo" }, { em: 82, t: "Editor" }, { em: 99, t: "Tela final" }];
const Cena8 = () => {
  const frame = useCurrentFrame();
  const atual = PASSOS.filter((p) => frame >= p.em).length - 1;
  const salvo = frame >= 128;
  const cy = atual < 0 ? 520 : 470 + atual * 150;
  return (
    <AbsoluteFill>
      <Texto em={0} y={300} size={90}>Pra colocar:</Texto>
      <div style={{ position: "absolute", left: 140, right: 140, top: 440, display: "flex", flexDirection: "column", gap: 30 }}>
        {PASSOS.map((p, i) => (frame >= 4 + i * 6 ? <div key={`g${i}`} style={{ position: "absolute", left: 0, right: 0, top: i * 150, height: 120, borderRadius: 30, border: `5px dashed ${BRANCO}88`, opacity: interpolate(frame, [4 + i * 6, 10 + i * 6], [0, 1], clamp) }} /> : null))}
        {PASSOS.map((p, i) => {
          const s = frame < p.em ? 0 : spring({ frame: frame - p.em, fps: FPS, config: { damping: 12 } });
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
      {frame >= 110 ? (
        <div style={{ position: "absolute", left: 290, top: 1110, width: 500, height: 130, borderRadius: 65, background: salvo ? colors.verde : PLAY, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spring({ frame: frame - 110, fps: FPS, config: { damping: 10 } }) * (frame > 124 && frame < 130 ? 0.9 : 1)})` }}>
          <div style={{ ...FONT, fontSize: 64, color: BRANCO }}>{salvo ? "SALVO ✓" : "SALVAR"}</div>
        </div>
      ) : null}
      <Cursor x={frame >= 115 ? 640 : 820} y={frame >= 115 ? 1190 : cy + 40} clique={frame > 124 && frame < 130} />
      <Sfx name="ding" atFrame={128} />
    </AbsoluteFill>
  );
};

const Cena9 = () => {
  const frame = useCurrentFrame();
  const texto = "Quantos elementos tem a sua tela final?";
  const n = Math.floor(interpolate(frame, [8, 50], [0, texto.length], clamp));
  return (
    <AbsoluteFill>
      <Logo largura={600} style={{ position: "absolute", left: 240, top: 290, transform: `scale(${1 + 0.03 * Math.sin(frame / 6)})` }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 760, padding: "34px 36px", borderRadius: 36, background: BRANCO }}>
        <div style={{ ...FONT, fontSize: 40, color: `${MAGENTA}99`, textAlign: "left", marginBottom: 12 }}>Adicione um comentário…</div>
        <div style={{ ...FONT, fontSize: 58, color: MAGENTA, textAlign: "left", minHeight: 130 }}>{texto.slice(0, n)}{frame % 16 < 8 ? "|" : ""}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 26 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = frame < 30 + i * 6 ? 0 : spring({ frame: frame - 30 - i * 6, fps: FPS, config: { damping: 9 } });
          return <div key={i} style={{ ...FONT, width: 130, height: 130, borderRadius: 65, background: i === 4 ? AMARELO : "#ffffff33", color: i === 4 ? MAGENTA : BRANCO, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>{i}</div>;
        })}
      </div>
      <Sfx name="pop" atFrame={30} />
      <Texto em={80} y={1260} size={70} fundo={AMARELO} rot={-2}>Segue pra próxima cobaia!</Texto>
    </AbsoluteFill>
  );
};

// início de cada cena em segundos (tempos das palavras em audio/words.json)
const CENAS = [
  [0, Cena1], [2.5, Cena2], [6.9, Cena3], [12.1, Cena4], [17.45, Cena5], [24.95, Cena6], [30.9, Cena7], [33.76, Cena8], [38.9, Cena9],
];

export const ShortTelaFinal = ({ words = [], endSec = 47 }) => {
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
        <Sequence from={F(5)} durationInFrames={F(38.9) - F(5)}>
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
export const CapaTelaFinal = () => (
  <FundoAY>
    <Logo largura={300} coracao={false} style={{ position: "absolute", left: 390, top: 300 }} />
    <Texto em={-30} y={620} size={104}>Sua tela final</Texto>
    <Texto em={-30} y={760} size={140} fundo={AMARELO} rot={-3}>invisível?</Texto>
    <div style={{ position: "absolute", left: 120, top: 975, transform: "scale(0.9)", transformOrigin: "top left" }}>
      <Player>
        <Elemento tracejado x={40} y={60} />
        <Elemento tracejado x={330} y={60} />
        <Elemento tipo="Inscrever-se" x={190} y={270} w={300} h={110} op={0.25} />
        <div style={{ ...FONT, position: "absolute", right: 40, top: 110, fontSize: 150, color: PLAY }}>?</div>
      </Player>
    </div>
    <Texto em={-30} y={1520} size={66}>3 regras do YouTube</Texto>
  </FundoAY>
);
