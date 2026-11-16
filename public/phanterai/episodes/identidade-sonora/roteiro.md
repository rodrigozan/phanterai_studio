---
slug: identidade-sonora
titulo: "Como criar identidade sonora no YouTube (e achar música sem copyright do jeito certo)"
---

## CENAS

musica: CuriousFocus.mp3

### C01 | template: analogia | pose: surpresa
fala: "Esses dias, um inscrito aqui do canal, lá do Paraná, deixou um comentário que merece um vídeo inteiro."
dados: { emoji: "💬", titulo: "COMENTÁRIO DE INSCRITO", texto: "lá do Paraná" }

### C02 | template: cta | pose: apontando
fala: "Ele perguntou como criar uma identidade sonora para um canal do YouTube e onde achar música sem copyright."
dados: { titulo: "IDENTIDADE SONORA + SEM COPYRIGHT", pergunta: "Como criar identidade sonora? Onde achar música sem copyright?" }
eventos: [{ ao: "identidade", acao: "balao-comentario" }]

### C03 | template: titulo-impacto | pose: apontando
fala: "E o ponto é, essas duas perguntas são uma só."
dados: { titulo: "DUAS PERGUNTAS, UMA SÓ", subtitulo: "identidade + licença" }
eventos: [{ ao: "uma", acao: "carimbo-verde" }]

### C04 | template: gravacao-tela | pose: pensando
fala: "Porque música sem copyright que todo mundo usa não cria identidade nenhuma e identidade sonora sem licença segura vira dor de cabeça."
dados: { video: "pexels/b01.mp4", legenda: "TODO MUNDO USA = NENHUMA IDENTIDADE", inicio: 1, velocidade: 0.9 }

### C05 | template: checklist-cards | pose: feliz
fala: "Neste vídeo, eu te mostro como resolver as duas coisas juntas."
dados: { titulo: "NESTE VÍDEO", itens: ["Criar sua identidade sonora", "Achar música com licença segura"] }

### C06 | template: titulo-impacto | pose: apontando
fala: "Identidade sonora é o conjunto de sons que fazem o público reconhecer o seu canal de olhos fechados."
dados: { titulo: "IDENTIDADE SONORA", subtitulo: "reconhecer o canal de olhos fechados" }
eventos: [{ ao: "fechados", acao: "brilho" }]

### C07 | template: gravacao-tela | pose: feliz
fala: "Pensa no som de abertura do Netflix ou na vinheta da Intel."
dados: { video: "pexels/b07.mp4", legenda: "NETFLIX  |  INTEL", inicio: 2 }

### C08 | template: analogia | pose: surpresa
fala: "O próprio YouTube contratou um estúdio especializado em sonic branding, a Antfood, para criar o som que toca quando o app abre."
dados: { emoji: "🎧", titulo: "O YOUTUBE CONTRATOU A ANTFOOD", texto: "estúdio de sonic branding" }

### C09 | template: gravacao-tela | pose: apontando
fala: "Você não precisa de estúdio, mas precisa dos mesmos ingredientes."
dados: { video: "pexels/b05.mp4", legenda: "SEM ESTÚDIO, MESMOS INGREDIENTES", inicio: 0 }

### C10 | template: checklist-cards | pose: apontando
fala: "Uma assinatura curta, uma trilha de fundo com o mesmo clima, efeitos sonoros consistentes e uma voz com padrão."
dados: { titulo: "AS 4 PEÇAS", itens: ["Assinatura curta", "Trilha com o mesmo clima", "Efeitos consistentes", "Voz com padrão"] }
eventos: [{ ao: "Uma", acao: "card-1" }, { ao: "trilha", acao: "card-2" }, { ao: "efeitos", acao: "card-3" }, { ao: "voz", acao: "card-4" }]

### C11 | template: lista-numerada | pose: feliz
fala: "Quatro peças, só isso. Passo 1, defina o clima do canal em três palavras."
dados: { titulo: "6 PASSOS", itens: ["Clima em 3 palavras", "Um gênero só", "Assinatura de 3 a 5 s", "Kit de efeitos", "Volume padronizado", "Repetir"], ativo: 1 }
eventos: [{ ao: "Passo", acao: "destacar-1" }]

### C12 | template: titulo-impacto | pose: pensando
fala: "Calmo, tecnológico e acolhedor, por exemplo. Toda escolha de som depois disso precisa passar por essas três palavras."
dados: { titulo: "CALMO · TECNOLÓGICO · ACOLHEDOR", subtitulo: "todo som passa por essas 3 palavras" }

### C13 | template: gravacao-tela | pose: apontando
fala: "Passo 2, escolha um gênero e fique nele."
dados: { video: "pexels/b06.mp4", legenda: "PASSO 2: UM GÊNERO SÓ", inicio: 0 }

### C14 | template: lista-numerada | pose: feliz
fala: "Low -fi, eletrônico leve, orquestral, o que combinar com o seu assunto."
dados: { titulo: "GÊNEROS", itens: ["Lo-fi", "Eletrônico leve", "Orquestral"], ativo: 0 }
eventos: [{ ao: "Low", acao: "destacar-1" }, { ao: "eletrônico", acao: "destacar-2" }, { ao: "orquestral", acao: "destacar-3" }]

### C15 | template: contador | pose: surpresa
fala: "Passo 3, crie uma assinatura de 3 a 5 segundos para a abertura ou para a transição."
dados: { de: 0, ate: 5, rotulo: "segundos de assinatura sonora", sufixo: " s" }
eventos: [{ ao: "5", acao: "contar" }]

### C16 | template: gravacao-tela | pose: apontando
fala: "Pode ser uma nota, um acorde, um som de clique seguido de uma melodia curta."
dados: { video: "pexels/b07.mp4", legenda: "UMA NOTA · UM ACORDE · UM CLIQUE + MELODIA", inicio: 6 }

### C17 | template: checklist-cards | pose: apontando
fala: "Passo 4, monte um kit pequeno de efeitos sonoros."
dados: { titulo: "PASSO 4: KIT DE EFEITOS", itens: ["Transição", "Destaque", "Final"] }
eventos: [{ ao: "kit", acao: "card-1" }]

### C18 | template: checklist-cards | pose: feliz
fala: "Um para transição, um para destaque, um para o final."
dados: { titulo: "UM DE CADA", itens: ["Transição", "Destaque", "Final"] }
eventos: [{ ao: "transição", acao: "card-1" }, { ao: "destaque", acao: "card-2" }, { ao: "final", acao: "card-3" }]

### C19 | template: comparacao | pose: apontando
fala: "E use sempre os mesmos. Passo 5, padronize o volume."
dados: { esquerda: { titulo: "Música alta", valor: "cobre a voz" }, direita: { titulo: "Mix correto", valor: "voz na frente" } }
eventos: [{ ao: "volume", acao: "destacar-direita" }]

### C20 | template: titulo-impacto | pose: pensando
fala: "A música de fundo nunca pode brigar com a sua voz."
dados: { titulo: "MÚSICA NÃO BRIGA COM A VOZ", subtitulo: "passo 5" }
eventos: [{ ao: "brigar", acao: "carimbo-vermelho" }]

### C21 | template: titulo-impacto | pose: comemorando
fala: "E passo 6, repita. Identidade vem da repetição, não de um vídeo perfeito."
dados: { titulo: "IDENTIDADE = REPETIÇÃO", subtitulo: "não um vídeo perfeito" }
eventos: [{ ao: "repetição", acao: "carimbo-verde" }]

### C22 | template: titulo-impacto | pose: apontando
fala: "Agora a parte que ele perguntou, música sem copyright."
dados: { titulo: "MÚSICA SEM COPYRIGHT?", subtitulo: "a parte que ele perguntou" }

### C23 | template: gravacao-tela | pose: surpresa
fala: "Aqui vai a verdade que quase ninguém conta."
dados: { video: "pexels/b08.mp4", legenda: "A VERDADE QUE QUASE NINGUÉM CONTA", inicio: 0 }

### C24 | template: comparacao | pose: apontando
fala: "Quase nunca existe música sem copyright. O que existe é música com licença que permite o seu uso."
dados: { esquerda: { titulo: "SEM COPYRIGHT", valor: "quase não existe" }, direita: { titulo: "COM LICENÇA", valor: "permite o uso" } }
eventos: [{ ao: "licença", acao: "destacar-direita" }]

### C25 | template: analogia | pose: pensando
fala: "A diferença importa, porque o Content ID do YouTube compara o áudio do seu vídeo com um banco gigante de faixas registradas."
dados: { emoji: "🔎", titulo: "CONTENT ID", texto: "compara seu áudio com um banco gigante de faixas" }

### C26 | template: gravacao-tela | pose: surpresa
fala: "E uma faixa rotulada como livre ainda pode gerar reivindicação."
dados: { video: "pexels/b09.mp4", legenda: "\"LIVRE\" AINDA PODE GERAR REIVINDICAÇÃO", inicio: 0 }

### C27 | template: titulo-impacto | pose: triste
fala: "Escrever sem copyright intencional na descrição não vale nada."
dados: { titulo: "\"SEM COPYRIGHT INTENCIONAL\"", subtitulo: "não vale nada" }
eventos: [{ ao: "nada", acao: "carimbo-vermelho" }]

### C28 | template: titulo-impacto | pose: apontando
fala: "E o título de uma playlist também não é licença."
dados: { titulo: "TÍTULO DE PLAYLIST", subtitulo: "não é licença" }
eventos: [{ ao: "licença", acao: "carimbo-vermelho" }]

### C29 | template: lista-numerada | pose: feliz
fala: "Onde buscar então? Primeira opção, a biblioteca de áudio do YouTube, dentro do YouTube Studio."
dados: { titulo: "5 FONTES", itens: ["Biblioteca de Áudio do YouTube", "Bibliotecas pagas", "Free Music Archive", "Música com IA", "Música própria"], ativo: 1 }
eventos: [{ ao: "Primeira", acao: "destacar-1" }]

### C30 | template: checklist-cards | pose: apontando
fala: "É gratuita, pode ser usada em vídeos monetizados e dá para filtrar por atribuição não obrigatória."
dados: { titulo: "BIBLIOTECA DE ÁUDIO", itens: ["Gratuita", "Vale em vídeos monetizados", "Filtro: atribuição não obrigatória"] }
eventos: [{ ao: "gratuita", acao: "card-1" }, { ao: "monetizados", acao: "card-2" }, { ao: "atribuição", acao: "card-3" }]

### C31 | template: gravacao-tela | pose: pensando
fala: "O limite é que a licença vale para o YouTube e como muita gente usa as mesmas faixas, o som acaba genérico."
dados: { video: "pexels/b02.mp4", legenda: "MUITA GENTE, AS MESMAS FAIXAS = SOM GENÉRICO", inicio: 0 }

### C32 | template: lista-numerada | pose: feliz
fala: "Segunda opção, bibliotecas pagas, como a Artlist."
dados: { titulo: "5 FONTES", itens: ["Biblioteca de Áudio do YouTube", "Bibliotecas pagas", "Free Music Archive", "Música com IA", "Música própria"], ativo: 2 }
eventos: [{ ao: "Segunda", acao: "destacar-2" }]

### C33 | template: gravacao-tela | pose: apontando
fala: "Elas liberam o catálogo no Content ID e te dão uma licença por escrito."
dados: { video: "pexels/b10.mp4", legenda: "LICENÇA POR ESCRITO", inicio: 0 }

### C34 | template: lista-numerada | pose: feliz
fala: "Terceira, o Free Music Archive, com muita música gratuita, só que cada faixa tem a própria licença, então leia de cada uma, principalmente se for Creative Commons que pede crédito."
dados: { titulo: "5 FONTES", itens: ["Biblioteca de Áudio do YouTube", "Bibliotecas pagas", "Free Music Archive", "Música com IA", "Música própria"], ativo: 3 }
eventos: [{ ao: "Terceira", acao: "destacar-3" }]

### C35 | template: analogia | pose: apontando
fala: "Quarta, geradores de música com IA, que criam uma faixa única para o seu canal, mas leia os termos da ferramenta sobre o uso comercial."
dados: { emoji: "🤖", titulo: "MÚSICA COM IA", texto: "faixa única, mas leia os termos de uso comercial" }

### C36 | template: gravacao-tela | pose: comemorando
fala: "E quinta, a melhor para a identidade, criar ou encomendar a sua própria música, porque aí a assinatura é só sua."
dados: { video: "pexels/b05.mp4", legenda: "A SUA PRÓPRIA MÚSICA = ASSINATURA SÓ SUA", inicio: 4 }

### C37 | template: checklist-cards | pose: apontando
fala: "Antes de publicar, baixe sempre da fonte oficial, nunca de playlist de terceiros."
dados: { titulo: "ANTES DE PUBLICAR", itens: ["Baixe da fonte oficial", "Nunca de playlist de terceiros"] }
eventos: [{ ao: "baixe", acao: "card-1" }, { ao: "nunca", acao: "card-2" }]

### C38 | template: checklist-cards | pose: feliz
fala: "Salve o print da licença ou o comprovante da compra junto com o arquivo do projeto."
dados: { titulo: "GUARDE O COMPROVANTE", itens: [{ texto: "Print da licença ou comprovante", feito: true }, "Junto do arquivo do projeto"] }
eventos: [{ ao: "Salve", acao: "card-1" }, { ao: "projeto", acao: "card-2" }]

### C39 | template: checklist-cards | pose: apontando
fala: "Anote o nome da faixa e o site de onde veio."
dados: { titulo: "ANOTE", itens: ["Nome da faixa", "Site de onde veio"] }
eventos: [{ ao: "nome", acao: "card-1" }, { ao: "site", acao: "card-2" }]

### C40 | template: gravacao-tela | pose: surpresa
fala: "E se vier uma reivindicação mesmo assim, não entre em pânico."
dados: { video: "pexels/b08.mp4", legenda: "REIVINDICAÇÃO? SEM PÂNICO", inicio: 4 }

### C41 | template: lista-numerada | pose: apontando
fala: "Veja no YouTube Studio quem reivindicou, conteste apresentando a licença e avise o fornecedor da música."
dados: { titulo: "SE VIER REIVINDICAÇÃO", itens: ["Veja quem reivindicou", "Conteste com a licença", "Avise o fornecedor"], ativo: 0 }
eventos: [{ ao: "Veja", acao: "destacar-1" }, { ao: "conteste", acao: "destacar-2" }, { ao: "avise", acao: "destacar-3" }]

### C42 | template: comparacao | pose: pensando
fala: "Uma reivindicação do Content ID não é o mesmo que um aviso de violação de direitos autorais, mas trate com atenção do mesmo jeito."
dados: { esquerda: { titulo: "Reivindicação Content ID", valor: "automática" }, direita: { titulo: "Aviso de violação", valor: "mais sério" } }
eventos: [{ ao: "violação", acao: "destacar-direita" }]

### C43 | template: checklist-cards | pose: comemorando
fala: "Resumindo, defina o clima, crie uma assinatura curta, mantenha os efeitos consistentes e use só música que você consiga provar que pode usar."
dados: { titulo: "RESUMINDO", itens: ["Defina o clima", "Crie uma assinatura curta", "Efeitos consistentes", "Só música que você prova que pode usar"] }
eventos: [{ ao: "defina", acao: "card-1" }, { ao: "assinatura", acao: "card-2" }, { ao: "efeitos", acao: "card-3" }, { ao: "provar", acao: "card-4" }]

### C44 | template: cta | pose: apontando
fala: "Se esse vídeo ajudou, deixa o like e conta nos comentários que tipo de canal você tem que eu te ajudo a pensar na identidade sonora dele."
dados: { titulo: "QUE TIPO DE CANAL VOCÊ TEM?", pergunta: "Conta aqui que eu te ajudo com a identidade sonora." }
eventos: [{ ao: "comentários", acao: "balao-comentario" }]

### C45 | template: cta | pose: comemorando
fala: "Valeu pelo comentário, mano! Um abraço para o Paraná!"
dados: { titulo: "APRENDA YOUTUBE", subtitulo: "valeu pelo comentário!", botao: "Inscreva-se" }
eventos: [{ ao: "Paraná", acao: "clicar-botao" }]
