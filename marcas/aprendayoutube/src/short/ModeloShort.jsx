// Ponto de partida de todo Short/Reel do Aprenda YouTube (1080x1920, 30 fps). Copie para short/Short<Tema>.jsx,
// troque o palco pelos componentes do tema (interface recriada em motion) e registre em ../composicoes.jsx.
// A identidade vem de ../components/identidade.jsx e ../theme.js: não importe nada visual da PhanterAI.
// Props (todas opcionais, servem de exemplo): gancho {linha, destaque}, itens[{ em (s), t }], cta, words[{w,start,end}]
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FundoAY, LegendaCurta, Logo, Play, Sfx, Texto } from "../components/identidade";
import { AMARELO, BRANCO, FONT, MAGENTA, colors } from "../theme";

export const AY_FPS = 30;

const EXEMPLO = {
  gancho: { linha: "Seu vídeo travou em", destaque: "50 views?" },
  itens: [{ em: 3, t: "Título com contraste" }, { em: 4.2, t: "Capa com uma ideia só" }, { em: 5.4, t: "Gancho sem saudação" }],
  cta: "Comenta GANCHO",
  words: [],
};

const Item = ({ n, t, em }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < em) return null;
  const s = spring({ frame: frame - em, fps, config: { damping: 12, mass: 0.6 } });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 36px", borderRadius: 44, background: BRANCO, transform: `translateX(${(1 - s) * -700}px)`, boxShadow: `0 18px 40px ${colors.fundoEscuro}88` }}>
      <Sfx name="pop" atFrame={em} />
      <div style={{ ...FONT, width: 104, height: 104, borderRadius: 52, background: AMARELO, color: MAGENTA, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
      <div style={{ ...FONT, textAlign: "left", color: MAGENTA, fontSize: 56 }}>{t}</div>
    </div>
  );
};

export const ModeloShort = (props) => {
  const { gancho, itens, cta, words } = { ...EXEMPLO, ...props };
  const { fps, durationInFrames } = useVideoConfig();
  const lista = Math.round(itens[0].em * fps);
  const fim = durationInFrames - 2 * fps;
  return (
    <AbsoluteFill>
      <FundoAY>
        <Sequence durationInFrames={lista}>
          <Texto y={520} size={78}>{gancho.linha}</Texto>
          <Texto em={8} y={670} size={130} fundo={AMARELO} rot={-3}>{gancho.destaque}</Texto>
          <Play size={190} style={{ position: "absolute", left: 445, top: 960 }} />
          <Sfx name="riser" atFrame={0} />
        </Sequence>
        <Sequence from={lista} durationInFrames={fim - lista}>
          <div style={{ position: "absolute", left: 70, right: 70, top: 430, display: "flex", flexDirection: "column", gap: 36 }}>
            {itens.map((it, i) => <Item key={it.t} n={i + 1} t={it.t} em={Math.round(it.em * fps) - lista} />)}
          </div>
        </Sequence>
        <Sequence from={fim}>
          <Logo largura={640} style={{ position: "absolute", left: 250, top: 420 }} />
          <Texto em={6} y={1180} size={72} fundo={AMARELO}>{cta}</Texto>
        </Sequence>
        <Sequence durationInFrames={fim}>
          <Logo largura={230} coracao={false} style={{ position: "absolute", left: 425, top: 120 }} />
        </Sequence>
        <LegendaCurta palavras={words} />
      </FundoAY>
    </AbsoluteFill>
  );
};

// Capa do Short (still 1080x1920, texto dentro da zona segura y 285–1635).
export const CapaShort = ({ linha = "Travou em", destaque = "50 views?", apoio = "3 consertos" }) => (
  <FundoAY>
    <Logo largura={430} coracao={false} style={{ position: "absolute", left: 325, top: 330 }} />
    <Texto em={-30} y={840} size={110}>{linha}</Texto>
    <Texto em={-30} y={1000} size={150} fundo={AMARELO} rot={-3}>{destaque}</Texto>
    <Texto em={-30} y={1280} size={70}>{apoio}</Texto>
    <Play size={160} style={{ position: "absolute", left: 460, top: 1430 }} />
  </FundoAY>
);
