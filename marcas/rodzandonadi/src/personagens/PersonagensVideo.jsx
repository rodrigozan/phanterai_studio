import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { BarraCapitulos, Captura, Entrada, Etiqueta, Legendas, Palco, SlugCtx, Titulo, pasta } from "../base";
import { Corte } from "../Corte";
import { montarPlanoCom } from "../plano.js";
import { colors } from "../theme";
import { CENAS_EP2, CORTES_EP2, ETAPAS_EP2 } from "./dados.js";
import * as G from "./graficos";
import { ChatClaude, Documento, FlowGerar, GitHubArquivos, GitHubHistorico, Navegador, PaginaImagem } from "./telas";

const FALLBACK = { durationInFrames: 150, fps: 30, width: 1920, height: 1080 };

export const calcularPersonagensMetadata = async ({ props }) => {
  const { slug } = props;
  if (!slug) return { ...FALLBACK, props: { ...props, plano: null } };
  try {
    const timeline = await (await fetch(pasta(slug, "timeline.json"))).json();
    return { fps: timeline.fps, durationInFrames: timeline.total, width: 1920, height: 1080, props: { ...props, plano: montarPlanoCom(timeline, CENAS_EP2, CORTES_EP2, 60), musica: timeline.musica, musicaVolume: timeline.musicaVolume } };
  } catch (e) {
    return { ...FALLBACK, props: { ...props, plano: null, erro: String(e) } };
  }
};

const Pagina = ({ p }) => {
  if (p === "github") return <GitHubArquivos dest="arquivos" />;
  if (p === "github-historico") return <GitHubHistorico />;
  if (p === "flow") return <PaginaImagem img="capturas/flow-inicio.png" />;
  return null;
};

const Shot = ({ s }) => {
  if (s.tipo === "captura") return <Captura img={s.img} foco={s.foco} dest={s.dest} rotulo={s.rotulo} />;
  if (s.tipo === "titulo") return <Titulo sub={s.sub} y={s.y} size={s.size}>{s.titulo}</Titulo>;
  if (s.tipo === "navegador") return <Navegador url={s.url} aba={s.aba} dur={s.dur} escuro={s.escuro}><Pagina p={s.pagina} /></Navegador>;
  if (s.tipo === "pagina") return <Navegador url={s.pagina === "github-historico" ? "github.com/rodrigozan/o-rasgo-de-kalunga/commits/main" : s.url} aba="Commits · rodrigozan/o-rasgo-de-kalunga" dur={s.dur} escuro><Pagina p={s.pagina} /></Navegador>;
  if (s.tipo === "chat") return <ChatClaude pedido={s.pedido} resposta={s.resposta} ferramenta={s.ferramenta} dur={s.dur} />;
  if (s.tipo === "flow") return <FlowGerar prompt={s.prompt} img={s.img} dur={s.dur} />;
  if (s.tipo === "doc") return <Documento nome={s.nome} linhas={s.linhas} dur={s.dur} />;
  if (s.tipo === "anotada") return <G.ImagemAnotada img={s.img} pontos={s.pontos} marcas={s.marcas} foco={s.foco} rotulo={s.rotulo} dur={s.dur} />;
  if (s.tipo === "vo") return <G.VoClipe partes={s.partes} dur={s.dur} />;
  const C = G[s.comp];
  if (!C) throw new Error(`gráfico ${s.comp} não existe`);
  return <C marcas={s.marcas} dur={s.dur} img={s.img} partes={s.partes} rotulo={s.rotulo} />;
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

export const PersonagensVideo = ({ slug, plano, erro, musica, musicaVolume, semVoz }) => {
  if (!plano) {
    return <AbsoluteFill style={{ background: colors.roxoEscuro, color: "#fff", alignItems: "center", justifyContent: "center", fontSize: 40, fontFamily: "sans-serif", padding: 80, textAlign: "center" }}>{erro ?? (slug ? `timeline.json não encontrado para ${slug}` : "Passe { slug } em props")}</AbsoluteFill>;
  }
  return (
    <SlugCtx.Provider value={slug}>
      <Palco>
        {!semVoz && <Audio src={pasta(slug, "voz.mp3")} />}
        {musica && !semVoz && <Musica faixa={musica} volume={musicaVolume ?? 0.2} />}
        {plano.map((c) => (
          <Sequence key={c.id} from={c.inicio} durationInFrames={c.dur}>
            {c.shots.map((s, i) => (
              <Sequence key={i} from={s.inicio} durationInFrames={s.dur}>
                <Entrada dur={s.dur} sair={i < c.shots.length - 1}>
                  <Shot s={s} />
                </Entrada>
              </Sequence>
            ))}
            {c.cortes.map((k, i) => (
              <Sequence key={`c${i}`} from={k.inicio} durationInFrames={k.dur}>
                <Corte c={k} dur={k.dur} />
              </Sequence>
            ))}
            {c.etapa !== null && <BarraCapitulos ativa={c.etapa} etapas={ETAPAS_EP2} />}
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
