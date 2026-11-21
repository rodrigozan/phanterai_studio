# Mapa de mídia real — Como escrever um livro com IA

Proposta para revisão. Nada foi baixado nem renderizado.

Regras: cortes de até 2 s; vídeo do Pexels e imagem na proporção 80/20; ilustrações de mito vêm de busca de imagens do Google; personagens sempre pessoas negras; tratamento duotone roxo `#1F0526` com toques de amarelo; legenda e etiqueta de fonte ficam por cima. Meta: 20 a 25% do tempo (cerca de 100 a 120 s), uns 50 cortes (cerca de 40 vídeos e 10 imagens).

Os tempos vêm do timeline.json atual.

| Cena | Tempo | Assunto | Cortes | Tipo | Busca |
|---|---|---|---|---|---|
| S01 | 0:00–0:26 | Pasta vazia, planejamento pronto, "conversando com o Claude" | 4 | vídeo | `blank page writer desk`, `person typing laptop night`, `hands writing notebook` |
| S02 | 0:26–0:50 | Processo repetível, o caminho em ordem | 3 | vídeo | `person planning notebook`, `checklist pen`, `writer thinking window` |
| S03 | 0:50–1:16 | Pasta no computador, escritório do livro | 3 | vídeo | `folder desktop laptop`, `person opening laptop home`, `organizing files desk` |
| S04 | 1:16–2:03 | Projeto, objetivo, avisos de permissão e nuvem | 4 | vídeo | `person reading laptop screen`, `hands writing goals notebook`, `cloud servers data`, `reading warning screen` |
| S05 | 2:03–2:46 | Skills, zip, aviso de confiança | 3 | vídeo | `person installing software laptop`, `zip file download`, `reading carefully screen` |
| S06 | 2:46–3:33 | Instalar pelo GitHub, 36 beats, três fios | 4 | vídeo | `person coding github laptop`, `sticky notes wall story`, `timeline notes board`, `reading documentation` |
| S07 | 3:33–4:10 | Ferramentas por etapa: Word, Canva, KDP | 3 | vídeo | `book cover design`, `typing manuscript`, `stack of books` |
| S08 | 4:10–4:56 | Ideia, irmãos Lara e Pedro, Santa Branca, mitos africanos no Brasil | 6 | 3 vídeo + 3 imagem | vídeo: `small town brazil street`, `overgrown abandoned street`, `notebook story ideas`; imagem (arte própria): **Lara**, **Pedro**, **Claudia** |
| S09 | 4:56–5:42 | Planejamento, mitos bantu e akan, Anansi, Nyame, Osebo, Mmoatia | 6 | 5 vídeo + 1 imagem | vídeo: `spider web morning`, `leopard`, `forest canopy mist`, `writer researching books`, `person reading notes`; imagem: **Anansi** (Pamela Colman Smith, 1899, domínio público) |
| S10 | 5:42–6:28 | Erros do plano, Kalunga, Atlântico, pergunte sem medo | 5 | 4 vídeo + 1 imagem | vídeo: `ocean horizon waves`, `person correcting notebook`, `pen crossing out text`, `sea at dusk`; imagem: **Cosmograma Bakongo** (CC BY-SA 4.0, Wikimedia Commons, com crédito) |
| S11 | 6:28–7:31 | Primeira cena, Swain, estilo de IA, reescrita estilo Riordan, voz da Lara | 7 | vídeo | `person writing notebook`, `person reading manuscript`, `teenager smartphone`, `writer frustrated crossing out`, `person typing late night`, `book pages turning`, `coffee desk writing` |
| S12 | 7:31–8:08 | Atualizar o plano, o que falta, inscreva-se | 4 | vídeo | `finished book on table`, `person closing laptop`, `stack of books`, `hands holding book` |

Total: 49 cortes. 43 vídeos e 6 imagens (3 de arte própria, 1 domínio público, 1 diagrama CC BY-SA), cerca de 88% e 12%. Sem arte de Nyame, Osebo e Mmoatia: eles ficam a cargo do vídeo do Pexels e do nome em texto.

## Arte própria dos personagens

Arquivos em `public/rodzandonadi/episodes/long-videos/escrever-livro-com-ia/personagens/`:

- `lara.jpg`: Lara, adolescente de coque com estilingue, numa rua tomada pela vegetação.
- `pedro.jpg`: Pedro, de óculos, com manta do Corinthians e um livro, num rio com neblina.
- `claudia.jpg`: Claudia, mãe dos meninos, de uniforme de saúde, em frente ao posto do bairro.
- `claudia-cobra.jpg`: **não entra** neste vídeo. A transformação só aparece na cena 5 do planejamento; a cena 1 mostra a mãe só como lembrança.

O escudo do Corinthians na manta do Pedro foi aprovado por você. A história é construída com o público, então a Claudia humana pode aparecer.

## Imagens externas

- Anansi: `Anansi-34.png`, Pamela Colman Smith, *Annancy Stories* (1899), domínio público, Wikimedia Commons.
- Kalunga: `Kongo Cosmogram`, CC BY-SA 4.0, Wikimedia Commons. Crédito do autor e do arquivo na descrição do vídeo.

## Onde entra cada tipo

- Caderno e caneta: planejar, estrutura, cenas, plano atualizado (S02, S04, S06, S09, S11).
- Pessoa digitando no notebook: escrever a história, revisar, ajustar (S01, S11).
- Folha em branco ou pessoa pensando: abertura e dúvida (S01, S08).
- Livro fechado, pilha de livros, mãos com livro: fechamento (S07, S12).
- Ilustrações: S08 a S10, nos nomes de personagens e seres.

## Cuidados

- Pexels: prefiro mãos, ombros e nuca. Descarto rosto repetido, logo visível, tela legível que contradiga a narração e escritório corporativo.
- Personagens: só a arte própria do Rod (Lara, Pedro, Claudia).
- Imagens externas: só domínio público e Creative Commons (Wikimedia Commons), com autor e link nos créditos. Nada do Google Imagens sem licença clara.
- Nenhum clipe se repete.

## Como fica depois da aprovação

1. Montar `broll.json` com as buscas acima e rodar `node scripts/long-broll.js escrever-livro-com-ia` com `MARCA=rodzandonadi`.
2. Baixar Anansi e o cosmograma do Wikimedia Commons e registrar autor e licença.
3. Conferir tudo num contact sheet e descartar o que não tiver relação.
4. Ligar cada corte à palavra falada, usar o duotone, renderizar e mandar.
