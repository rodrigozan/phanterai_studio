import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { TEMPLATES } from "./templates";
import { MUSIC_VOLUME, MUSIC_VOLUME_PAUSA, colors } from "./theme";
import { Title } from "./components/Title";
import { Acoes } from "./components/Acoes";

const FADE_MUSICA_FRAMES = 45;
const RAMPA_PAUSA_FRAMES = 10;
const CROSSFADE_MUSICA_FRAMES = 30;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

// Volume da música no frame f do vídeo: baixo sob a voz, sobe nas pausas (com rampa de
// entrada e saída), e fade in no começo. O fim é o fade out da própria faixa (ver Musica).
const volumeMusica = (f, pausas) => {
  const fade = interpolate(f, [0, FADE_MUSICA_FRAMES], [0, 1], clamp);
  let subida = 0;
  for (const p of pausas) {
    if (f < p.startFrame || f > p.endFrame) continue;
    const rampa = Math.min(RAMPA_PAUSA_FRAMES, (p.endFrame - p.startFrame) / 2);
    subida = interpolate(f, [p.startFrame, p.startFrame + rampa, p.endFrame - rampa, p.endFrame], [0, 1, 1, 0], clamp);
  }
  return fade * (MUSIC_VOLUME + (MUSIC_VOLUME_PAUSA - MUSIC_VOLUME) * subida);
};

const FALLBACK_METADATA = { durationInFrames: 150, fps: 30, width: 1920, height: 1080 };

// Busca public/episodes/<slug>/timeline.json e usa a última cena para fixar a duração
// do vídeo antes do render começar. Sem slug (ou sem timeline ainda gerado por
// scripts/align.js), cai num placeholder em vez de quebrar o preview.
export const calculateEpisodeMetadata = async ({ props }) => {
  const { slug } = props;

  if (!slug) {
    return { ...FALLBACK_METADATA, props: { ...props, timeline: null } };
  }

  try {
    const response = await fetch(staticFile(`episodes/${slug}/timeline.json`));
    const timeline = await response.json();
    const last = timeline.scenes[timeline.scenes.length - 1];
    // Duração da faixa inteira: a última repetição da música termina no fade out natural dela.
    const musicDuration = timeline.music
      ? await getAudioDurationInSeconds(staticFile(`music/${timeline.music}`))
      : null;

    return {
      fps: timeline.fps ?? FALLBACK_METADATA.fps,
      durationInFrames: Math.max(last.endFrame, 1),
      props: { ...props, timeline: { ...timeline, musicDuration } },
    };
  } catch (err) {
    return { ...FALLBACK_METADATA, props: { ...props, timeline: null } };
  }
};

// Música o vídeo todo, terminando no fade out natural da faixa: a última repetição toca a
// faixa inteira e é posicionada para acabar junto com o vídeo. Antes dela, a faixa repete em
// loop até `fimSegundos` (musica_fim no roteiro - evita o buraco do fade out no meio do vídeo;
// sem ele, repete a faixa inteira), sempre em crossfade com a repetição seguinte.
const Musica = ({ src, pausas, fimSegundos, faixaSegundos, duracao, fps }) => {
  const faixa = Math.round(faixaSegundos * fps);
  const trecho = fimSegundos ? Math.round(fimSegundos * fps) : faixa;
  const X = CROSSFADE_MUSICA_FRAMES;

  // Vídeo mais curto que a faixa: um trecho só, pegando o final dela.
  if (faixa >= duracao) {
    return <Audio src={src} trimBefore={faixa - duracao} volume={(f) => volumeMusica(f, pausas)} />;
  }

  const inicioFinal = duracao - faixa;
  const passo = trecho - X;
  const loops = [];
  for (let k = 0; k * passo < inicioFinal; k++) loops.push(k * passo);

  return (
    <>
      {loops.map((inicio, i) => (
        <Sequence key={i} from={inicio} durationInFrames={trecho} layout="none">
          <Audio
            src={src}
            trimAfter={trecho}
            volume={(f) =>
              volumeMusica(inicio + f, pausas) *
              interpolate(f, [0, X, passo, trecho], [i === 0 ? 1 : 0, 1, 1, 0], clamp) *
              interpolate(inicio + f, [inicioFinal, inicioFinal + X], [1, 0], clamp)
            }
          />
        </Sequence>
      ))}
      <Sequence from={inicioFinal} durationInFrames={faixa} layout="none">
        <Audio
          src={src}
          volume={(f) => volumeMusica(inicioFinal + f, pausas) * interpolate(f, [0, X], [0, 1], clamp)}
        />
      </Sequence>
    </>
  );
};

export const Episode = ({ slug, timeline }) => {
  const { durationInFrames, fps } = useVideoConfig();

  if (!timeline) {
    return (
      <AbsoluteFill style={{ background: colors.bgOuter, alignItems: "center", justifyContent: "center", padding: 120 }}>
        <Title size={44} color={colors.text}>
          {slug
            ? `public/episodes/${slug}/timeline.json não encontrado — rode scripts/align.js`
            : "Passe { slug } em props.json para carregar um episódio"}
        </Title>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <Audio src={staticFile(`episodes/${slug}/voz.mp3`)} />
      {timeline.music ? (
        <Musica
          src={staticFile(`music/${timeline.music}`)}
          pausas={timeline.pausas ?? []}
          fimSegundos={timeline.musicEnd}
          faixaSegundos={timeline.musicDuration}
          duracao={durationInFrames}
          fps={fps}
        />
      ) : null}
      {timeline.scenes.map((scene) => {
        const Template = TEMPLATES[scene.template];
        if (!Template) {
          throw new Error(
            `Template "${scene.template}" (cena ${scene.id}) não existe em src/templates/index.js`
          );
        }
        return (
          <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame}>
            <Acoes eventos={scene.eventos}>
              <Template dados={scene.dados} pose={scene.pose} eventos={scene.eventos} fala={scene.fala} slug={slug} />
            </Acoes>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
