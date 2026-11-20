// Cortes de mídia real (b-roll) por cima das cenas: vídeo/foto do Pexels e prints de sites (Playwright).
// Cada corte dura <= 2 s e é planejado por scripts/long-timeline.js (timeline.cortes).
import { AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pasta } from "./base";

export const Corte = ({ slug, c }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n, fps } = useVideoConfig();
  const entrada = interpolate(f, [0, 6], [1.07, 1], clamp);
  const flash = interpolate(f, [0, 4], [0.5, 0], clamp);
  const saida = interpolate(f, [n - 4, n], [1, 0.0], clamp);
  const zoom = interpolate(f, [0, n], [1.0, 1.1], clamp);
  const src = pasta(slug, c.src);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: 0.2 + 0.8 * Math.min(1, saida * 3) }}>
      <AbsoluteFill style={{ transform: `scale(${entrada})` }}>
        {c.tipo === "video" && (
          <OffthreadVideo src={src} muted startFrom={Math.round((c.from ?? 0) * fps)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {c.tipo === "foto" && (
          <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
        )}
        {c.tipo === "print" && (
          <AbsoluteFill style={{ background: "#0b0a14", alignItems: "center", justifyContent: "center" }}>
            <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.45)", transform: "scale(1.15)" }} />
            <div style={{ position: "relative", width: 1640, height: 922, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,0.7)", border: "2px solid rgba(255,255,255,0.18)", transform: `scale(${zoom})`, transformOrigin: `${c.fx ?? 50}% ${c.fy ?? 40}%` }}>
              <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
