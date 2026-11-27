// Registro dos tipos de cena do vídeo longo do Aprenda YouTube: roteiro.json -> cenas[].tipo -> componente.
// Todos são genéricos (texto vem do roteiro). Formato dos `dados` no cabeçalho de cenas-c.jsx e cenas-d.jsx.
import * as C from "./cenas-c";
import * as D from "./cenas-d";
import { Cta } from "./cenas-cta";

export const CENAS = {
  "gancho-video": C.GanchoVideo,
  cartoes: C.Cartoes,
  fluxo: C.Fluxo,
  "navegador-print": C.NavegadorPrint,
  "instalador-assistente": C.InstaladorAssistente,
  terminal: C.Terminal,
  "claude-pedido": C.ClaudePedido,
  "studio-preview": C.StudioPreview,
  cta: Cta,
  "cta-final": C.CtaProximo,
  "cta-proximo": C.CtaProximo,
  "desktop-conectores": D.DesktopConectores,
  "desktop-pedido": D.DesktopPedido,
  "blender-janela": D.BlenderJanela,
  "instalador-sistemas": D.InstaladorSistemas,
};
