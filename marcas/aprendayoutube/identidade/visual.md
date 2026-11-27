# Identidade visual do Aprenda YouTube

Definida pelo Rod em 27/11/2026: é a do banner do canal ([banner-canal.png](banner-canal.png)). A da PhanterAI
(roxo, rosa, pantera, Poppins/Inter) NÃO vale aqui.

## Cores (amostradas do banner)
| Uso | Cor |
|---|---|
| Fundo magenta/vinho, texto sobre amarelo | `#9A015C` |
| Forma orgânica e destaques | `#DFD011` |
| Botão de play, alerta | `#E6335D` |
| Textos | `#FFFFFF` |
| Apoio (magenta escurecido: sombra, vinheta) | `#4E002F` |

## Elementos
- **Forma amarela arredondada** com "APRENDA" pequeno em caixa alta entre duas linhas finas e "youtube" grande, minúsculo, negrito, magenta.
- **Coração com listras diagonais claras** atrás da forma.
- **Play** circular vermelho-rosado.
- Textos brancos, sans em negrito: **Open Sans 700/800**. "youtube" e chamadas curtas: **Lexend 800**.
- Texto do canal: "como planejar, criar, configurar / manter, se destacar / e monetizar canais no youtube" e
  "Vídeos novos às Sextas". Cuidado: o banner original tem o erro "detacar"; o certo é **destacar**.
- **Sem mascote.** A pantera é da PhanterAI. Reações e humor usam a forma, o play, a caixa amarela e texto animado.
- Destaque de legenda: caixa amarela com letra magenta.
- Título normal (frase), não TUDO EM CAIXA ALTA.

## Onde está no código
`marcas/aprendayoutube/src/theme.js` e `components/identidade.jsx` (`FundoAY`, `Logo`, `Forma`, `Coracao`, `Play`,
`Texto`, `LegendaCurta`). Composições: `AYBanner` (reprodução do banner, para conferir), `AYModeloShort`,
`AYCapaShort`, `AYLongVideo`, `AYLongCapa`.
