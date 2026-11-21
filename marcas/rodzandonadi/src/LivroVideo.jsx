import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { BarraCapitulos, Captura, Clip, Entrada, Etiqueta, Legendas, Palco, SlugCtx, Titulo, pasta } from "./base";
import { Anansi, Beats, Ciclo, Escritorio, Estrutura, Faltam, Final, Kalunga, Mapa, QuatroEmUm, Texto } from "./graficos";
import { montarPlano } from "./plano.js";
import { colors } from "./theme";

const GRAFICOS = { Anansi, Beats, Ciclo, Escritorio, Estrutura, Faltam, Final, Kalunga, Mapa, QuatroEmUm };
const FALLBACK = { durationInFrames: 150, fps: 30, width: 1920, height: 1080 };

export const calculateLivroMetadata = async ({ props }) => {
  const { slug } = props;
  if (!slug) return { ...FALLBACK, props: { ...props, plano: null } };
  try {
    const timeline = await (await fetch(pasta(slug, "timeline.json"))).json();
    return { fps: timeline.fps, durationInFrames: timeline.total, width: 1920, height: 1080, props: { ...props, plano: montarPlano(timeline), musica: timeline.musica, musicaVolume: timeline.musicaVolume } };
  } catch (e) {
    return { ...FALLBACK, props: { ...props, plano: null, erro: String(e) } };
  }
};

const Shot = ({ s }) => {
  if (s.tipo === "captura") return <Captura img={s.img} foco={s.foco} dest={s.dest} rotulo={s.rotulo} />;
  if (s.tipo === "clipe") return <Clip nome={s.nome} foco={s.foco} dest={s.dest} dur={s.dur} rotulo={s.rotulo} taxa={s.taxa} ate={s.ate} />;
  if (s.tipo === "titulo") return <Titulo sub={s.sub} y={s.y} size={s.size}>{s.titulo}</Titulo>;
  if (s.tipo === "texto") return <Texto trechos={s.trechos} modo={s.modo} dur={s.dur} />;
  const G = GRAFICOS[s.comp];
  if (!G) throw new Error(`gráfico ${s.comp} não existe`);
  return <G marcas={s.marcas} dur={s.dur} />;
};

const Musica = ({ faixa, volume }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <Audio
      src={staticFile(`phanterai/music/${faixa}`)}
      loop
      volume={(f) => volume * interpolate(f, [0, 30, durationInFrames - 75, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  );
};

export const LivroVideo = ({ slug, plano, erro, musica, musicaVolume }) => {
  if (!plano) {
    return <AbsoluteFill style={{ background: colors.roxoEscuro, color: "#fff", alignItems: "center", justifyContent: "center", fontSize: 40, fontFamily: "sans-serif", padding: 80, textAlign: "center" }}>{erro ?? (slug ? `timeline.json não encontrado para ${slug}` : "Passe { slug } em props")}</AbsoluteFill>;
  }
  return (
    <SlugCtx.Provider value={slug}>
      <Palco>
        <Audio src={pasta(slug, "voz.mp3")} />
        {musica && <Musica faixa={musica} volume={musicaVolume ?? 0.2} />}
        {plano.map((c) => (
          <Sequence key={c.id} from={c.inicio} durationInFrames={c.dur}>
            {c.etapa !== null && <BarraCapitulos ativa={c.etapa} />}
            {c.shots.map((s, i) => (
              <Sequence key={i} from={s.inicio} durationInFrames={s.dur}>
                <Entrada dur={s.dur} sair={i < c.shots.length - 1}>
                  <Shot s={s} />
                </Entrada>
              </Sequence>
            ))}
            {c.etiquetas.map((e, i) => (
              <Sequence key={`e${i}`} from={e.inicio} durationInFrames={e.dur}>
                <Etiqueta fonte={e.fonte} dur={e.dur} />
              </Sequence>
            ))}
            <Legendas palavras={c.words} />
          </Sequence>
        ))}
      </Palco>
    </SlugCtx.Provider>
  );
};
