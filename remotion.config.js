// Config do CLI do Remotion para o studio.
// Única mudança: o ShotcraftFinish importa código direto de /root/video-shotcraft (src/shotcraft/sc.js);
// esses arquivos ficam fora deste projeto, então `react` e `remotion` precisam ser resolvidos pelo
// node_modules do studio (uma só cópia do React no bundle). Não altera nenhuma outra composição.
import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    modules: [path.resolve(process.cwd(), "node_modules"), "node_modules"],
  },
}));
