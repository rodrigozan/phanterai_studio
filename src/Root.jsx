// Ponto de entrada do Remotion. Aqui só entra o que é comum a todas as marcas (ShotcraftFinish) e a
// lista de marcas. As composições de cada marca ficam em marcas/<marca>/src/composicoes.jsx.
// Marca nova: crie marcas/<marca>/src/composicoes.jsx exportando um componente com as <Composition>
// dela e acrescente uma <Folder> abaixo. O id da composição continua único no projeto inteiro.
import { Composition, Folder, registerRoot } from "remotion";
import { ComposicoesPhanterAI } from "../marcas/phanterai/src/composicoes";
import { ComposicoesRodZandonadi } from "../marcas/rodzandonadi/src/composicoes";
import { ComposicoesShortsBlocos } from "../marcas/afamiliaquadrada/src/composicoes";
import { ShotcraftFinish, calculateShotcraftMetadata } from "./shotcraft/ShotcraftFinish";

const RemotionRoot = () => (
  <>
    <Folder name="phanterai">
      <ComposicoesPhanterAI />
    </Folder>
    <Folder name="rodzandonadi">
      <ComposicoesRodZandonadi />
    </Folder>
    <Folder name="afamiliaquadrada">
      <ComposicoesShortsBlocos />
    </Folder>
    <Composition
      id="ShotcraftFinish"
      component={ShotcraftFinish}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={30}
      defaultProps={{ base: null, look: "phanterai", shots: [] }}
      calculateMetadata={calculateShotcraftMetadata}
    />
  </>
);

registerRoot(RemotionRoot);
