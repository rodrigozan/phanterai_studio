---
slug: monetizacao-youtube-fev
titulo: "Monetização do YouTube muda em 1º de fevereiro (e tem bônus de Shorts até lá)"
---

## CENAS

musica: CuriousFocus.mp3

### C01 | template: contador | pose: surpresa
fala: "Você tem menos de 100 dias. Daqui a 96 dias, no 1º de fevereiro,"
dados: { de: 100, ate: 96, rotulo: "dias até 1º de fevereiro" }
eventos: [{ ao: "96", acao: "contar" }]

### C02 | template: titulo-impacto | pose: apontando
fala: "as regras de monetização do YouTube mudam e as regras para entrar no programa dobram."
dados: { titulo: "AS REGRAS DOBRAM", subtitulo: "monetização do YouTube" }
eventos: [{ ao: "dobram", acao: "carimbo-vermelho" }]

### C03 | template: titulo-impacto | pose: feliz
fala: "Mas antes disso, existe uma janela, um bônus de shorts que pode colocar de centenas a milhares de dólares na mão de quem postar agora."
dados: { titulo: "BÔNUS DE SHORTS", subtitulo: "centenas a milhares de dólares" }
eventos: [{ ao: "bônus", acao: "carimbo-verde" }]

### C04 | template: checklist-cards | pose: apontando
fala: "Neste vídeo, eu junto os dois assuntos. O que muda, o que não muda e o que você deve fazer enquanto ainda dá tempo."
dados: { titulo: "NESTE VÍDEO", itens: ["O que muda", "O que não muda", "O que fazer agora"] }

### C05 | template: titulo-impacto | pose: feliz
fala: "Fala galera, bem-vindos ao Aprenda YouTube. Vamos começar pelo básico."
dados: { titulo: "VAMOS AO BÁSICO", subtitulo: "Aprenda YouTube" }

### C06 | template: comparacao | pose: apontando
fala: "Hoje, para entrar no programa de parceiros do YouTube, você precisa de mil inscritos e 4 mil horas de exibição."
dados: { esquerda: { titulo: "Inscritos", valor: "1.000" }, direita: { titulo: "Horas de exibição", valor: "4.000 h" } }
eventos: [{ ao: "4", acao: "destacar-direita" }]

### C07 | template: contador | pose: surpresa
fala: "Ou, no caminho dos shorts, 10 milhões de visualizações."
dados: { de: 0, ate: 10000000, rotulo: "views em Shorts (caminho dos Shorts)" }
eventos: [{ ao: "10", acao: "contar" }]

### C08 | template: comparacao | pose: surpresa
fala: "Em 1º de fevereiro, o cenário muda. Os mil inscritos continuam sendo exigidos, mas as horas sobem para 8 mil, contadas em um período de 12 meses."
dados: { esquerda: { titulo: "Hoje", valor: "4.000 h" }, direita: { titulo: "1º de fevereiro", valor: "8.000 h" } }
eventos: [{ ao: "8", acao: "destacar-direita" }]

### C09 | template: comparacao | pose: apontando
fala: "E nos shorts, o número passa para 20 milhões de visualizações em um período de 90 dias."
dados: { esquerda: { titulo: "Hoje", valor: "10 mi" }, direita: { titulo: "1º de fevereiro", valor: "20 mi" } }
eventos: [{ ao: "20", acao: "destacar-direita" }]

### C10 | template: titulo-impacto | pose: pensando
fala: "Ou seja, fora a quantidade de inscritos, tudo dobra."
dados: { titulo: "TUDO DOBRA", subtitulo: "menos os inscritos" }
eventos: [{ ao: "dobra", acao: "carimbo-vermelho" }]

### C11 | template: titulo-impacto | pose: apontando
fala: "Mas isso vale para quem ainda vai entrar no programa. Ou seja, para quem pedir a monetização a partir de 1º de fevereiro."
dados: { titulo: "SÓ PARA NOVOS", subtitulo: "pedidos a partir de 1º/fev" }

### C12 | template: titulo-impacto | pose: feliz
fala: "Agora, uma informação importante para você não entrar em pânico. Nada zera em fevereiro."
dados: { titulo: "NADA ZERA", subtitulo: "sem pânico" }
eventos: [{ ao: "zera", acao: "carimbo-verde" }]

### C13 | template: grafico-barras | pose: apontando
fala: "Se você tem 3.500 horas hoje, elas continuam valendo. A diferença é que a linha de chegada muda de lugar."
dados: { titulo: "3.500 h continuam valendo", barras: [{ rotulo: "Você hoje", valor: 3500 }, { rotulo: "Meta de hoje", valor: 4000 }, { rotulo: "Meta nova", valor: 8000 }] }

### C14 | template: comparacao | pose: pensando
fala: "Em vez de 4 mil, a meta passa a ser 8 mil. Então, quanto mais perto você estiver agora, mais vale a pena acelerar antes da virada."
dados: { esquerda: { titulo: "Antes", valor: "4.000 h" }, direita: { titulo: "Depois", valor: "8.000 h" } }
eventos: [{ ao: "acelerar", acao: "destacar-esquerda" }]

### C15 | template: titulo-impacto | pose: comemorando
fala: "E um detalhe importante. Quem bater a meta atual e pedir a análise antes de 1º de fevereiro, entra pela regra de hoje."
dados: { titulo: "ANTES DE 1º/FEV", subtitulo: "entra pela regra de hoje" }
eventos: [{ ao: "hoje", acao: "carimbo-verde" }]

### C16 | template: titulo-impacto | pose: pensando
fala: "E se você já é monetizado, também tem uma tarefa."
dados: { titulo: "JÁ É MONETIZADO?", subtitulo: "também tem tarefa" }

### C17 | template: checklist-cards | pose: apontando
fala: "Quem já está no programa de parceiros, não precisa cumprir esses novos requisitos de entrada e continua monetizando os vídeos longos."
dados: { titulo: "QUEM JÁ ESTÁ NO PROGRAMA", itens: ["Não cumpre os novos requisitos de entrada", "Continua monetizando vídeos longos"] }

### C18 | template: contador | pose: apontando
fala: "Mas precisa aceitar os novos termos no YouTube Studio até 31 de janeiro."
dados: { de: 0, ate: 31, prefixo: "", sufixo: " de janeiro", rotulo: "aceite os novos termos no Studio" }
eventos: [{ ao: "31", acao: "contar" }]

### C19 | template: contador | pose: surpresa
fala: "E, para continuar ganhando com shorts, precisa de 10 milhões de visualizações qualificadas nos últimos 90 dias."
dados: { de: 0, ate: 10000000, rotulo: "views qualificadas em 90 dias" }
eventos: [{ ao: "10", acao: "contar" }]

### C20 | template: titulo-impacto | pose: triste
fala: "Se você deixar de aceitar os termos, pode colocar a sua receita em risco. Então, quando terminar este vídeo, abra o Studio e confira."
dados: { titulo: "ACEITE OS TERMOS", subtitulo: "receita em risco" }
eventos: [{ ao: "risco", acao: "sirene" }]

### C21 | template: titulo-impacto | pose: surpresa
fala: "Agora vem a parte curiosa. Antes de endurecer as regras para os shorts, o YouTube está oferecendo um bônus."
dados: { titulo: "A PARTE CURIOSA", subtitulo: "o bônus de Shorts" }
eventos: [{ ao: "bônus", acao: "brilho" }]

### C22 | template: checklist-cards | pose: apontando
fala: "Criadores que já são monetizados e que postam shorts estão recebendo convites por e-mail e por notificação dentro do Studio."
dados: { titulo: "COMO CHEGA O CONVITE", itens: ["Canal já monetizado", "Posta Shorts", "E-mail ou notificação no Studio"] }

### C23 | template: titulo-impacto | pose: feliz
fala: "Não existe inscrição. O convite é automático."
dados: { titulo: "SEM INSCRIÇÃO", subtitulo: "convite automático" }
eventos: [{ ao: "automático", acao: "carimbo-verde" }]

### C24 | template: contador | pose: apontando
fala: "Nos convites divulgados, o prazo para aceitar é 15 de novembro. E aceitar até o dia 15 faz o mês contar."
dados: { de: 0, ate: 15, sufixo: " de novembro", rotulo: "prazo para aceitar o convite" }
eventos: [{ ao: "15", acao: "contar" }]

### C25 | template: comparacao | pose: apontando
fala: "O período relatado vai de 1 de novembro a 31 de janeiro, bem na véspera da mudança."
dados: { esquerda: { titulo: "Começa", valor: "1º/nov" }, direita: { titulo: "Termina", valor: "31/jan" } }
eventos: [{ ao: "31", acao: "destacar-direita" }]

### C26 | template: lista-numerada | pose: feliz
fala: "Por enquanto, ele está disponível em seis países. Estados Unidos, Reino Unido, Alemanha, Japão, Coreia do Sul e o Brasil."
dados: { titulo: "6 PAÍSES", itens: ["Estados Unidos", "Reino Unido", "Alemanha", "Japão", "Coreia do Sul", "Brasil"], ativo: 6 }
eventos: [{ ao: "Brasil", acao: "destacar-6" }]

### C27 | template: titulo-impacto | pose: pensando
fala: "Como funciona o dinheiro? Pelo que criadores têm mostrado nas redes, são dois níveis."
dados: { titulo: "COMO FUNCIONA O DINHEIRO?", subtitulo: "dois níveis" }

### C28 | template: contador | pose: comemorando
fala: "O primeiro é um pagamento mínimo garantido, que você ganha só por cumprir uma meta de postagens. E um dos exemplos divulgados fala em 300 dólares por mês."
dados: { de: 0, ate: 300, prefixo: "US$ ", sufixo: "/mês", rotulo: "nível 1: mínimo por postar (exemplo relatado)" }
eventos: [{ ao: "300", acao: "contar" }]

### C29 | template: comparacao | pose: surpresa
fala: "O segundo nível é um pagamento maior, que depende do desempenho dos seus shorts, medido em visualizações engajadas. E os tetos relatados vão de mil a dois mil dólares por mês."
dados: { esquerda: { titulo: "Teto relatado", valor: "US$ 1.000" }, direita: { titulo: "Teto relatado", valor: "US$ 2.000" } }
eventos: [{ ao: "dois", acao: "destacar-direita" }]

### C30 | template: titulo-impacto | pose: apontando
fala: "Tudo isso somado à receita normal de anúncios dos shorts."
dados: { titulo: "+ RECEITA DE ANÚNCIOS", subtitulo: "dos Shorts" }
eventos: [{ ao: "somado", acao: "carimbo-verde" }]

### C31 | template: contador | pose: apontando
fala: "E os convites divulgados pedem entre 12 e 16 shorts públicos por mês."
dados: { de: 0, ate: 16, rotulo: "Shorts públicos por mês (12 a 16)" }
eventos: [{ ao: "16", acao: "contar" }]

### C32 | template: titulo-impacto | pose: triste
fala: "Mas atenção, a oferta muda de criador para criador, então não trate esses números como regra para todo mundo."
dados: { titulo: "VARIA POR CRIADOR", subtitulo: "números são relatos, não regra" }
eventos: [{ ao: "atenção", acao: "sirene" }]

### C33 | template: titulo-impacto | pose: pensando
fala: "Por que o YouTube de repente ficou tão generoso? Uma pista está na concorrência."
dados: { titulo: "POR QUE TÃO GENEROSO?", subtitulo: "uma pista: a concorrência" }

### C34 | template: contador | pose: surpresa
fala: "Poucos dias antes, o X lançou uma oferta parecida, com milhares de dólares para quem postasse 15 vídeos em 30 dias, sem exigir desempenho."
dados: { de: 0, ate: 15, rotulo: "vídeos em 30 dias (oferta do X)" }
eventos: [{ ao: "15", acao: "contar" }]

### C35 | template: comparacao | pose: apontando
fala: "Parece que existe uma pequena disputa por criadores entre as plataformas."
dados: { esquerda: { titulo: "YouTube", valor: "Bônus de Shorts" }, direita: { titulo: "X", valor: "Oferta por 15 vídeos" } }
eventos: [{ ao: "disputa", acao: "destacar-todos" }]

### C36 | template: titulo-impacto | pose: pensando
fala: "E existe uma segunda leitura, que é só uma hipótese. O YouTube pode estar incentivando os criadores monetizados a darem mais uma chance aos shorts antes de a regra apertar."
dados: { titulo: "SEGUNDA LEITURA", subtitulo: "hipótese, não fato confirmado" }
eventos: [{ ao: "hipótese", acao: "brilho" }]

### C37 | template: titulo-impacto | pose: surpresa
fala: "Porque tem uma armadilha escondida aqui, e o exemplo vem do próprio VidIQ."
dados: { titulo: "A ARMADILHA", subtitulo: "exemplo do vidIQ" }
eventos: [{ ao: "armadilha", acao: "carimbo-vermelho" }]

### C38 | template: grafico-barras | pose: apontando
fala: "O canal deles ganhou cerca de mil dólares com mais ou menos cinco milhões de visualizações engajadas em shorts em um trimestre. Só que, em fevereiro, eles ficam muito longe do mínimo exigido."
dados: { titulo: "VIEWS EM SHORTS (milhões)", barras: [{ rotulo: "vidIQ no trimestre", valor: 5 }, { rotulo: "Mínimo em fev", valor: 10 }] }

### C39 | template: titulo-impacto | pose: triste
fala: "Então a pergunta é, por que continuar fazendo shorts se, depois da mudança, a receita some? O bônus parece uma ponte para esse momento."
dados: { titulo: "O BÔNUS É UMA PONTE", subtitulo: "leitura, não fato" }

### C40 | template: analogia | pose: pensando
fala: "E aí vem a pergunta que fica no ar. Para onde vai o dinheiro dos canais que deixarem de ser elegíveis?"
dados: { emoji: "💰", titulo: "PARA ONDE VAI O DINHEIRO?", texto: "dos canais que deixarem de ser elegíveis" }

### C41 | template: titulo-impacto | pose: apontando
fala: "Ninguém confirmou nada, mas uma leitura possível é que ele se concentre nos criadores que continuarem elegíveis. Se esse bolo for dividido por menos canais, quem estiver dentro pode ganhar mais."
dados: { titulo: "MENOS CANAIS, MAIS BOLO", subtitulo: "hipótese, não garantia" }
eventos: [{ ao: "bolo", acao: "brilho" }]

### C42 | template: titulo-impacto | pose: feliz
fala: "É uma hipótese, não uma garantia, mas é um bom motivo para você querer estar dentro."
dados: { titulo: "QUERER ESTAR DENTRO", subtitulo: "bom motivo" }

### C43 | template: contador | pose: apontando
fala: "Então, o que fazer nos próximos 96 dias? Eu separo em três caminhos."
dados: { de: 0, ate: 3, rotulo: "caminhos para os próximos 96 dias" }
eventos: [{ ao: "três", acao: "contar" }]

### C44 | template: checklist-cards | pose: apontando
fala: "Se você ainda não é monetizado, o primeiro passo é descobrir exatamente onde você está. Quantos inscritos, quantas horas de exibição, quantas visualizações nos shorts."
dados: { titulo: "AINDA NÃO É MONETIZADO", itens: ["Quantos inscritos", "Quantas horas de exibição", "Quantas views nos Shorts"] }

### C45 | template: comparacao | pose: pensando
fala: "Com esses três números na mão, escolha um caminho. Horas ou shorts."
dados: { esquerda: { titulo: "Caminho 1", valor: "Horas" }, direita: { titulo: "Caminho 2", valor: "Shorts" } }
eventos: [{ ao: "shorts", acao: "destacar-direita" }]

### C46 | template: titulo-impacto | pose: apontando
fala: "E monte um calendário fixo de publicações até primeiro de fevereiro. Sem calendário, 96 dias passam sem você perceber."
dados: { titulo: "CALENDÁRIO FIXO", subtitulo: "até 1º de fevereiro" }
eventos: [{ ao: "calendário", acao: "brilho" }]

### C47 | template: titulo-impacto | pose: comemorando
fala: "E se você estiver perto das 4 mil horas ou dos 10 milhões de visualizações, corra para pedir a análise antes de primeiro de fevereiro. Porque depois dessa data, valem as metas novas."
dados: { titulo: "PERTO DA META? CORRA", subtitulo: "peça a análise antes de 1º/fev" }
eventos: [{ ao: "corra", acao: "zoom-in" }]

### C48 | template: checklist-cards | pose: apontando
fala: "Se você já é monetizado, aceite os novos termos no estúdio. Fique de olho no e-mail e nas notificações para ver se o convite do bônus chegou."
dados: { titulo: "JÁ É MONETIZADO", itens: ["Aceite os novos termos no Studio", "Olhe e-mail e notificações", "Convite do bônus chegou?"] }

### C49 | template: titulo-impacto | pose: feliz
fala: "E, se chegar, cumpra o mínimo de shorts do programa antes que o prazo acabe."
dados: { titulo: "CUMPRA O MÍNIMO", subtitulo: "antes do prazo" }
eventos: [{ ao: "mínimo", acao: "carimbo-verde" }]

### C50 | template: titulo-impacto | pose: comemorando
fala: "E para todo mundo, vale a regra que não muda. Consistência vale mais do que perfeição."
dados: { titulo: "CONSISTÊNCIA > PERFEIÇÃO", subtitulo: "para todo mundo" }
eventos: [{ ao: "Consistência", acao: "carimbo-verde" }]

### C51 | template: titulo-impacto | pose: apontando
fala: "Aquele vídeo parado no seu computador, aquela ideia que você vem adiando, é a hora de gravar, editar e publicar."
dados: { titulo: "É A HORA", subtitulo: "gravar, editar e publicar" }

### C52 | template: cta | pose: apontando
fala: "Agora me conta nos comentários. Quantos inscritos você tem? Quantas horas de exibição? Quantas visualizações nos shorts? E você, recebeu o convite do bônus?"
dados: { titulo: "ME CONTA NOS COMENTÁRIOS", pergunta: "Inscritos, horas, views nos Shorts? Recebeu o convite?" }
eventos: [{ ao: "comentários", acao: "balao-comentario" }]

### C53 | template: cta | pose: comemorando
fala: "Se este vídeo ajudou, deixe o seu like, se inscreve no canal para não perder as próximas atualizações e nos vemos no próximo vídeo."
dados: { titulo: "APRENDA YOUTUBE", subtitulo: "like + inscreva-se", botao: "Inscreva-se" }
eventos: [{ ao: "inscreve", acao: "clicar-botao" }]

### C54 | template: contador | pose: surpresa
fala: "Faltam 96 dias. Bora usar cada um deles."
dados: { de: 96, ate: 96, rotulo: "dias. Bora usar cada um." }
