import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import w1 from "../../../../../public/rodzandonadi/episodes/zanathos-cap1/audio/words-p1.json";
import w2 from "../../../../../public/rodzandonadi/episodes/zanathos-cap1/audio/words-p2.json";
import w3 from "../../../../../public/rodzandonadi/episodes/zanathos-cap1/audio/words-p3.json";
import w4 from "../../../../../public/rodzandonadi/episodes/zanathos-cap1/audio/words-p4.json";
import { FPS, Fecho, Fundo, Gancho, Legendas, K, chunksDe, cl, f } from "./base";
import { PARTES } from "./partes";

const DADOS = { 1: w1, 2: w2, 3: w3, 4: w4 };
const CHUNKS = Object.fromEntries(Object.entries(DADOS).map(([k, d]) => [k, chunksDe(d.words)]));
export const CAP1_FRAMES = Object.fromEntries(Object.entries(DADOS).map(([k, d]) => [k, f(d.dur)]));
const A = (rel) => staticFile(`rodzandonadi/episodes/zanathos-cap1/audio/${rel}`);

export const ZanathosCap1 = ({ parte = 1, capa = false }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const P = PARTES[parte];
  const D = DADOS[parte];
  const veu = P.veu(t);
  const preto = t >= P.corte && t < D.fim + 99;
  const fimNarr = D.fim;
  return (
    <AbsoluteFill style={{ background: K.vao, overflow: "hidden" }}>
      <Fundo frame={frame} brilho={preto ? 0 : P.brilho(t)} />
      {veu > 0 ? <AbsoluteFill style={{ background: K.vao, opacity: veu }} /> : null}
      <P.Cena t={t} frame={frame} />
      {P.memes(t)}
      <Gancho t={t} texto={P.gancho[0]} destaque={P.gancho[1]} />
      <Legendas t={t} chunks={CHUNKS[parte]} fim={fimNarr} />
      <Fecho t={t} ini={fimNarr + 0.5} texto={P.fecho} />
      {capa ? null : <Audio src={A(`narracao-p${parte}.mp3`)} volume={1} />}
      {capa ? null : P.eco ? <Audio src={staticFile(P.eco)} volume={0.55} /> : null}
      {capa ? null : (
        <Audio
          src={staticFile("rodzandonadi/episodes/zanathos-cap1/audio/som/drone.mp3")}
          volume={(fr) => P.drone(fr / FPS) * interpolate(fr, [0, 20], [0, 1], cl) * interpolate(fr, [f(D.dur) - 20, f(D.dur)], [1, 0], cl)}
        />
      )}
      {capa ? null : P.sfx.map((s, i) => (
        <Sequence key={i} from={f(s.t)} layout="none">
          <Audio src={s.src.startsWith("rodzandonadi") || s.src.startsWith("sfx") ? staticFile(s.src) : s.src} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
