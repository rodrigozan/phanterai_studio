// Vídeo longo 16:9 do Aprenda YouTube. Lê public/phanterai/episodes/long-videos/<slug>/timeline.json
// (scripts/long-timeline.js): cenas com frames, palavras para a legenda, voz.mp3 e a música sorteada
// (loop até o fim, a 20% do volume original). Efeitos de public/sfx entram pelos componentes das cenas.
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { colors } from "../theme";
import { CENAS } from "./cenas";
import { Corte } from "./cortes";
import { Cena, Legendas, PanteraCtx, pasta } from "./base";

const FALLBACK = { durationInFrames: 150, fps: 30, width: 1920, height: 1080 };

export const calculateLongMetadata = async ({ props }) => {
  const { slug } = props;
  if (!slug) return { ...FALLBACK, props: { ...props, timeline: null } };
  try {
    const timeline = await (await fetch(pasta(slug, "timeline.json"))).json();
    const musicaSeg = await getAudioDurationInSeconds(staticFile(`phanterai/music/${timeline.musica}`));
    return { fps: timeline.fps, durationInFrames: timeline.totalFrames, width: 1920, height: 1080, props: { ...props, timeline: { ...timeline, musicaSeg } } };
  } catch {
    return { ...FALLBACK, props: { ...props, timeline: null } };
  }
};

export const LongVideo = ({ slug, timeline }) => {
  const { durationInFrames, fps } = useVideoConfig();
  if (!timeline) {
    return <AbsoluteFill style={{ background: colors.bgOuter, color: "#fff", alignItems: "center", justifyContent: "center", fontSize: 44, fontFamily: "sans-serif" }}>{slug ? `timeline.json não encontrado para ${slug}` : "Passe { slug } em props"}</AbsoluteFill>;
  }
  const vol = timeline.musicaVolume ?? 0.17;
  return (
    <AbsoluteFill style={{ background: colors.bgOuter }}>
      {/* a timeline começa as cenas em `lead` segundos: a voz entra junto, senão a legenda atrasa */}
      <Sequence from={Math.round((timeline.lead ?? 0) * fps)} layout="none"><Audio src={pasta(slug, "voz.mp3")} /></Sequence>
      {Array.from({ length: Math.ceil(durationInFrames / Math.round(timeline.musicaSeg * fps)) }, (_, i) => {
        const seg = Math.round(timeline.musicaSeg * fps);
        return (
          <Sequence key={i} from={i * seg} durationInFrames={seg} layout="none">
            <Audio
              src={staticFile(`phanterai/music/${timeline.musica}`)}
              volume={(f) => vol * interpolate(i * seg + f, [0, 30, durationInFrames - 75, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          </Sequence>
        );
      })}
      {timeline.scenes.map((c, i) => {
        const Comp = CENAS[c.tipo];
        if (!Comp) throw new Error(`tipo de cena "${c.tipo}" (${c.id}) não existe em long/cenas.jsx`);
        return (
          <Sequence key={c.id} from={c.startFrame} durationInFrames={c.endFrame - c.startFrame}>
            <PanteraCtx.Provider value={c.pantera !== false}>
              <Cena whoosh={i > 0} flash={i > 0}>
                <Comp slug={slug} d={c.dados} pose={c.pose} dur={c.endFrame - c.startFrame} />
              </Cena>
            </PanteraCtx.Provider>
          </Sequence>
        );
      })}
      {(timeline.cortes ?? []).map((c) => (
        <Sequence key={c.id} from={c.startFrame} durationInFrames={c.endFrame - c.startFrame}><Corte slug={slug} c={c} /></Sequence>
      ))}
      <Legendas palavras={timeline.words} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(5,4,12,0.5) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
