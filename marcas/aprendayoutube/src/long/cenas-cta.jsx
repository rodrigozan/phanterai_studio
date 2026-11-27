// CTA do meio do vídeo (like e inscrição). O CTA final é o "cta-proximo" de cenas-c.jsx.
// dados: like{ao}, sub{ao}, sub2 (frase), bg, guia{ao}/guiaTxt, q{ao}/qTxt
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { FONT, Cursor, Faiscas169, FundoMarca, Fundo, Pop, Sfx } from "./base";
import { Logo } from "../components/identidade";

const IconeLike = ({ cor }) => <svg width="64" height="64" viewBox="0 0 24 24"><path fill={cor} d="M2 10h4v11H2zM8 10l4-8c1.5 0 2.5 1 2.2 2.6L13.5 8H20c1 0 2 1 1.8 2.2l-1.4 8.6c-.2 1.2-1.2 2.2-2.4 2.2H8z" /></svg>;
export const Cta = ({ slug, d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const apertaLike = frame >= d.like.em;
  const apertaSub = frame >= d.sub.em;
  const sLike = spring({ frame: frame - d.like.em, fps, config: { damping: 6, mass: 0.5 } });
  const sSub = spring({ frame: frame - d.sub.em, fps, config: { damping: 8, mass: 0.6 } });
  const sino = apertaSub ? Math.sin((frame - d.sub.em) / 2.2) * 18 * Math.max(0, 1 - (frame - d.sub.em) / 50) : 0;
  return (
    <>
      {d.bg ? <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.62} /> : <FundoMarca />}
      <Faiscas169 n={apertaSub ? 36 : 14} />
      <div style={{ position: "absolute", right: 150, top: 180 }}><Pop em={2}><Logo largura={460} /></Pop></div>
      <div style={{ position: "absolute", left: 230, top: 270 }}><div style={{ ...FONT, fontSize: 44, color: colors.amarelo }}>{d.sub2 ?? "como planejar, criar e monetizar seu canal"}</div></div>
      <div style={{ position: "absolute", left: 230, top: 400, display: "flex", gap: 50, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 54px", borderRadius: 70, background: apertaLike ? "#3EA6FF" : "#272727", transform: `scale(${apertaLike ? 0.9 + 0.1 * sLike + 0.12 * (1 - Math.abs(1 - sLike)) : 1})`, boxShadow: apertaLike ? "0 0 60px #3EA6FF99" : "0 12px 40px rgba(0,0,0,0.5)" }}>
          <IconeLike cor="#fff" />
          <span style={{ ...FONT, fontSize: 58, color: "#fff" }}>Gostei</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 64px", borderRadius: 70, background: apertaSub ? "#3a3a3a" : "#FF0000", transform: `scale(${apertaSub ? 0.92 + 0.08 * sSub : 1})`, boxShadow: apertaSub ? "none" : "0 0 50px #FF000088" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" style={{ transform: `rotate(${sino}deg)` }}><path fill="#fff" d="M12 22a2.4 2.4 0 0 0 2.4-2.4h-4.8A2.4 2.4 0 0 0 12 22zm7-6.4V11c0-3.5-1.9-6.4-5-7.2V3a2 2 0 0 0-4 0v.8C6.9 4.6 5 7.5 5 11v4.6l-2 2V19h18v-1.4z" /></svg>
          <span style={{ ...FONT, fontSize: 58, color: "#fff" }}>{apertaSub ? "Inscrito" : "Inscrever-se"}</span>
        </div>
      </div>
      {frame >= d.like.em ? <Sfx name="coin" atFrame={d.like.em} /> : null}
      {frame >= d.sub.em ? <Sfx name="ding" atFrame={d.sub.em} /> : null}
      <Cursor pontos={[{ f: d.like.em - 30, x: 900, y: 800 }, { f: d.like.em, x: 400, y: 470 }, { f: d.sub.em - 4, x: 400, y: 470 }, { f: d.sub.em + 4, x: 960, y: 470 }]} cliques={[d.like.em + 2, d.sub.em + 6]} />
      {d.guia ? (
        <Pop em={d.guia.em} sfx="coin" style={{ position: "absolute", left: 250, top: 600 }}>
          <div style={{ background: colors.amarelo, color: "#9A015C", borderRadius: 40, padding: "18px 44px", ...FONT, fontSize: 54, boxShadow: "0 14px 40px rgba(0,0,0,0.45)" }}>{d.guiaTxt ?? "Comente: Guia Completo"}</div>
        </Pop>
      ) : null}
      {d.q ? (
        <Pop em={d.q.em} style={{ position: "absolute", left: 250, top: 750 }}>
          <div style={{ background: "#fff", color: "#9A015C", borderRadius: 40, padding: "18px 44px", ...FONT, fontSize: 46, maxWidth: 1000, boxShadow: "0 14px 40px rgba(0,0,0,0.45)" }}>{d.qTxt ?? "Qual projeto você vai criar primeiro?"}</div>
        </Pop>
      ) : null}
    </>
  );
};

