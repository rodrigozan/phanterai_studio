import { AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame } from "remotion";
import { AREA, FONT, Rotulo, clamp, pasta, useSlug } from "./base";
import { colors, radii } from "./theme";

const Sombra = () => <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(31,5,38,0.15) 0%, rgba(31,5,38,0) 30%, rgba(31,5,38,0) 55%, rgba(31,5,38,0.78) 100%)" }} />;

const Video = ({ c, dur }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1, 1.06], clamp);
  return (
    <AbsoluteFill style={{ background: colors.roxoEscuro, isolation: "isolate" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <OffthreadVideo
          src={pasta(slug, `pexels/${c.v}.mp4`)}
          muted
          startFrom={Math.round((c.ss ?? 1) * 30)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.08) brightness(1.3)", mixBlendMode: "screen" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#a574ca", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(31,5,38,0) 55%, rgba(31,5,38,0.55) 100%)` }} />
      <Sombra />
    </AbsoluteFill>
  );
};

const Arte = ({ c, dur }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1.02, 1.1], clamp);
  return (
    <AbsoluteFill style={{ background: colors.roxoEscuro }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Img src={pasta(slug, c.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Sombra />
      {c.rotulo && <Rotulo>{c.rotulo}</Rotulo>}
    </AbsoluteFill>
  );
};

const Cartao = ({ c, dur }) => {
  const slug = useSlug();
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1, 1.035], clamp);
  return (
    <AbsoluteFill style={{ background: colors.roxoEscuro }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${colors.roxo} 0%, ${colors.roxoEscuro} 75%)` }} />
      <div style={{ position: "absolute", left: AREA.x + 330, top: AREA.y - 6, width: AREA.w - 660, height: AREA.h - 30, background: "#EEE9F0", borderRadius: radii.lg, border: `5px solid ${colors.amarelo}`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ flex: 1, minHeight: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${z})` }}>
          <Img src={pasta(slug, c.img)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: colors.roxoEscuro, padding: "6px 0 10px" }}>{c.credito}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Corte = ({ c, dur }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5, Math.max(6, dur - 6), dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{c.v ? <Video c={c} dur={dur} /> : c.cartao ? <Cartao c={c} dur={dur} /> : <Arte c={c} dur={dur} />}</AbsoluteFill>;
};
