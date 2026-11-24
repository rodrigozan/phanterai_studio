# Ep. 2 — Dando rosto aos personagens com IA

Segundo vídeo da série "Como escrever um livro com IA". Mesmo modelo do ep. 1 (`escrever-livro-com-ia`): vídeo longo 16:9, 30 fps, sem apresentador, voz do Rod no ElevenLabs, legendas palavra a palavra, b-roll do Pexels e telas animadas em Remotion.

- Slug: `personagens-com-ia`
- Composição: `RodPersonagensIA` (`marcas/rodzandonadi/src/personagens/PersonagensVideo.jsx`)
- Narração: `roteiro.json` na pasta do episódio (13 cenas, cerca de 1.200 palavras, uns 8 a 9 minutos). Texto corrido em `narracao-rodzandonadi-personagens-com-ia.md`.
- Mídia: `public/rodzandonadi/episodes/long-videos/personagens-com-ia/`
  - `capturas/`: prints das conversas com o Claude e do Google Flow enviados pelo Rod.
  - `personagens/`: as imagens geradas no Flow (Lara, Pedro, Iara, Vó Benedita, Cláudia no posto e na rua).
  - `clipes/vo-flow.mp4`: gravação da geração da Vó Benedita no Flow (sem áudio, recomprimida).
  - `broll.json`: 15 buscas do Pexels, 1 clipe cada, todas com pessoas negras. Nenhum clipe se repete.

## Como renderizar no VPS

Rodar da raiz do projeto, nesta ordem:

```
MARCA=rodzandonadi node scripts/long-voz.js personagens-com-ia
MARCA=rodzandonadi node scripts/long-broll.js personagens-com-ia
node marcas/rodzandonadi/scripts/timeline.mjs personagens-com-ia
COMP=RodPersonagensIA node marcas/rodzandonadi/scripts/stills.mjs personagens-com-ia 300 5000 11500
yarn remotion render src/Root.jsx RodPersonagensIA out/rodzandonadi/long-videos/personagens-com-ia.mp4 --props='{"slug":"personagens-com-ia"}'
```

1. `long-voz.js` gera `voz/S01.mp3` a `voz/S13.mp3`, os tempos de cada palavra e `voz.mp3`.
2. `long-broll.js` baixa os 15 clipes em `pexels/` e registra autor e link em `pexels-manifest.json` (créditos da descrição).
3. `timeline.mjs` monta `timeline.json` a partir da voz e sorteia a música.
4. Os stills servem para conferir antes do render completo. Se uma âncora não for encontrada, o erro diz a cena e a frase.
5. Se um clipe do Pexels não tiver relação com a frase, troque a busca em `broll.json`, apague o arquivo em `pexels/` e rode `long-broll.js` de novo.

## Cenas

| Cena | Assunto | O que aparece |
|---|---|---|
| S01 | Gancho | Fichas sem rosto → Lara, Pedro e Iara → título |
| S02 | Contexto | Mundo já existia, romance em andamento, conto do zero com o Claude, IA para ampliar a lore |
| S03 | O que é o GitHub | Navegador abrindo o repositório real, máquina do tempo com os 3 commits, página de commits |
| S04 | Por que uso | Três motivos e a alternativa do Google Drive |
| S05 | O Claude lê o GitHub | Chat com o pedido sendo digitado, resposta, print real com destaque em cada personagem |
| S06 | A IA diz que não tem | Chat, print real, título "A IA não inventou nada sem eu pedir" |
| S07 | As fichas | Chat, arquivo de descrições rolando, print real, lista do que a IA inventou |
| S08 | Ficha vira prompt | Chat, arquivo de prompts, anatomia do prompt da Lara, Cláudia → Iara |
| S09 | Google Flow | Navegador abrindo o Flow, prompt da Lara sendo digitado e gerado, imagens anotadas |
| S10 | Vó Benedita | Gravação real da geração (trechos acelerados), prompt ajustado em destaque, imagem anotada |
| S11 | O que deu errado | Consistência da Cláudia, detalhe sutil do Pedro, texto sem sentido nos cartazes |
| S12 | Ampliar a lore | Os quatro prisioneiros de Anansi, Mmoatia × Curupira, regra da transformação, fluxo até o cânone |
| S13 | Fechamento | Próximos seres, pergunta para os comentários, inscrição |

## Decisões do Rod

- O cobertor do Pedro fica com o escudo; o vídeo não comenta o assunto.
- As telas do Claude, do GitHub e do Flow são recriações animadas em Remotion; os prints reais entram logo depois de cada animação.
- O repositório do livro mostra o estado real (2 arquivos, 3 commits). Os arquivos de personagens e prompts ainda não foram enviados para lá.
