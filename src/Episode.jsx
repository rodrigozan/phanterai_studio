import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TEMPLATES } from "./templates";
import { MUSIC_VOLUME, colors } from "./theme";
import { Title } from "./components/Title";

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

    return {
      fps: timeline.fps ?? FALLBACK_METADATA.fps,
      durationInFrames: Math.max(last.endFrame, 1),
      props: { ...props, timeline },
    };
  } catch (err) {
    return { ...FALLBACK_METADATA, props: { ...props, timeline: null } };
  }
};

export const Episode = ({ slug, timeline }) => {
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
      {timeline.music ? <Audio src={staticFile(`music/${timeline.music}`)} volume={MUSIC_VOLUME} /> : null}
      {timeline.scenes.map((scene) => {
        const Template = TEMPLATES[scene.template];
        if (!Template) {
          throw new Error(
            `Template "${scene.template}" (cena ${scene.id}) não existe em src/templates/index.js`
          );
        }
        return (
          <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame}>
            <Template dados={scene.dados} pose={scene.pose} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
