import { useEffect, useState } from "react";
import { Img, OffthreadVideo, cancelRender, continueRender, delayRender, useVideoConfig } from "remotion";
import { colors } from "../theme";

// Tamanho natural do arquivo, lido antes do frame renderizar (delayRender). Arquivo que
// não abre derruba o render com o nome dele, em vez de sair um quadro vazio.
const useTamanhoNatural = (src, tipo) => {
  const [tamanho, setTamanho] = useState(null);
  const [handle] = useState(() => delayRender(`medindo ${src}`));

  useEffect(() => {
    const el = tipo === "video" ? document.createElement("video") : new Image();
    const pronto = (w, h) => {
      setTamanho({ w, h });
      continueRender(handle);
    };
    if (tipo === "video") {
      el.preload = "metadata";
      el.onloadedmetadata = () => pronto(el.videoWidth, el.videoHeight);
    } else {
      el.onload = () => pronto(el.naturalWidth, el.naturalHeight);
    }
    el.onerror = () => cancelRender(new Error(`não consegui abrir ${src} - confira se o arquivo está na pasta do episódio`));
    el.src = src;
  }, [src, tipo, handle]);

  return tamanho;
};

// Print ou gravação de tela inteira (sem cortar), encaixada em maxW x maxH.
// recorte: { x, y, w, h } em % do arquivo original - mostra só essa área.
// borrar: [{ x, y, w, h }] em % do arquivo original - borra essas áreas (acompanham recorte e zoom).
// escala/foco: zoom aplicado ao conteúdo, com origem em foco { x, y } (% da área visível).
// inicio/velocidade (só vídeo): começa em `inicio` segundos e toca em `velocidade` (0.75 = mais lento).
export const Midia = ({ src, tipo = "imagem", recorte, borrar = [], maxW, maxH, escala = 1, foco, inicio = 0, velocidade = 1 }) => {
  const { fps } = useVideoConfig();
  const natural = useTamanhoNatural(src, tipo);
  if (!natural) return null;

  const r = recorte ?? { x: 0, y: 0, w: 100, h: 100 };
  const cortadoW = (natural.w * r.w) / 100;
  const cortadoH = (natural.h * r.h) / 100;
  const s = Math.min(maxW / cortadoW, maxH / cortadoH);
  const origem = foco ? `${foco.x}% ${foco.y}%` : "50% 50%";

  const midiaStyle = { width: "100%", height: "100%", display: "block" };

  return (
    <div
      style={{
        position: "relative",
        width: cortadoW * s,
        height: cortadoH * s,
        overflow: "hidden",
        borderRadius: 20,
        border: `1px solid ${colors.violetLight}55`,
        boxShadow: `0 0 70px ${colors.violet}66`,
        background: "#fff",
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `scale(${escala})`, transformOrigin: origem }}>
        <div
          style={{
            position: "absolute",
            width: natural.w * s,
            height: natural.h * s,
            left: (-r.x / 100) * natural.w * s,
            top: (-r.y / 100) * natural.h * s,
          }}
        >
          {tipo === "video" ? <OffthreadVideo src={src} muted trimBefore={Math.round(inicio * fps)} playbackRate={velocidade} style={midiaStyle} /> : <Img src={src} style={midiaStyle} />}
          {borrar.map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
                backdropFilter: "blur(28px)",
                background: "rgba(20, 11, 46, 0.25)",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
