# Marcas

O studio atende mais de uma marca. Cada marca tem a própria pasta e nada de uma marca fica solto na raiz.

| Marca | Pasta | Contas |
|---|---|---|
| PhanterAI | `marcas/phanterai` | Instagram e YouTube @phanteraicreative |
| Aprenda YouTube | `marcas/aprendayoutube` | Instagram e YouTube @aprendayoutube (projeto e identidade próprios, sem relação visual com a PhanterAI) |
| Anime Power Bíblia | `marcas/anime-power-biblia` | Instagram e YouTube @animepowerbiblia  |
| Afro WW2 Tales | `marcas/afro-ww2-tales` | YouTube @AfroWW2Tales |
| Rod Zandonadi | `marcas/rodzandonadi` | YouTube e Instagram @rodzandonadi |
| Família Quadrada | `marcas/afamiliaquadrada` | YouTube Shorts e Instagram Reels @afamiliaquadrada  |
| Palitempo | `marcas/palitempo` | YouTube @palitempo |

## Onde fica cada coisa

| O quê | Caminho |
|---|---|
| Identidade, contas e regras de pauta | `marcas/<marca>/marca.json` |
| Código Remotion da marca (tema, composições, templates) | `marcas/<marca>/src/` |
| Calendário de publicação | `marcas/<marca>/calendario/` |
| Arquivos que o Remotion carrega (episódios, música, mascote) | `public/<marca>/` |
| Vídeos renderizados e logs | `out/<marca>/` |

O Remotion só aceita uma pasta pública, por isso os arquivos de mídia ficam em `public/<marca>/` e não
dentro de `marcas/<marca>/`. No código, `staticFile("phanterai/music/Daniel.mp3")`.

## O que é comum

- `src/Root.jsx`: junta as composições de todas as marcas.
- `src/shotcraft/`: acabamento Shotcraft, usado pelo phanterclaw para qualquer marca (`look`).
- `public/sfx/`: efeitos sonoros.
- `scripts/`: scripts que recebem a marca pela variável `MARCA` (padrão `phanterai`), por exemplo
  `MARCA=anime-power-biblia node scripts/align.js <slug>`.

## Criar uma marca

1. `marcas/<marca>/marca.json` (copie o de outra marca).
2. `public/<marca>/` com `episodes/` e `music/`.
3. Se a marca usar Remotion: `marcas/<marca>/src/composicoes.jsx` e uma `<Folder>` em `src/Root.jsx`.
4. Acrescente a linha na tabela acima.
