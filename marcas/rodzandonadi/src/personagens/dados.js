import { DIMS } from "../base";

Object.assign(DIMS, {
  "claude-personagens": [973, 708],
  "claude-sem-descricao": [1024, 568],
  "claude-fichas": [1014, 652],
  "claude-prompts": [1038, 636],
  "flow-galeria": [1535, 658],
});

export const ETAPAS_EP2 = ["Projeto", "Fichas", "Prompts", "Imagens", "Lore"];

const REPO = "github.com/rodrigozan/o-rasgo-de-kalunga";

const PEDIDO_1 = "Acesse o github do projeto https://github.com/rodrigozan/o-rasgo-de-kalunga e pegue as descrições dos personagens";
const PEDIDO_2 = "Tem as descrições físicas, roupas e acessórios dos personagens?";
const PEDIDO_3 = "Então crie a descrição de cada um dos personagens";
const PEDIDO_4 = "transforme em prompt estilo anime digital art, adicione idade dos adolescentes e personagens quando humanos";

const PROMPT_LARA = "Anime digital art, full body character design, 15-year-old Afro-Brazilian teenage girl, dark brown skin, slim and wiry athletic build, 1.62 m tall, angular face, thick eyebrows, narrowed dark brown eyes with a watchful, distrustful expression, tight high bun of coily black hair tied with a rubber band, thin scar on her chin, calloused hands, bitten nails, fresh scratch on her shoulder, wearing dark ripped jeans patched at the knee with silver duct tape, faded gray school P.E. t-shirt, oversized olive-green windbreaker jacket, worn running sneakers with string instead of laces, black school backpack with a torn side pocket, pocketknife, slingshot made from tire inner tube hanging on her belt, roll of nylon wire, blue and white bead bracelet on her wrist, post-apocalyptic small Brazilian town background, soft cel shading, cinematic lighting, highly detailed, vibrant colors";

const FICHAS = [
  "# O Rasgo de Kalunga — Descrição dos Personagens",
  "## Lara (15)",
  "- **Físico:** negra de pele marrom-escura, magra e de músculos secos.",
  "- Cabelo crespo preso num coque alto e apertado.",
  "- **Roupas:** calça jeans rasgada no joelho, remendada com silver tape.",
  "- Jaqueta corta-vento verde-oliva grande demais, que era da mãe.",
  "- **Acessórios:** estilingue de câmara de pneu e pulseira de miçangas.",
  "## Pedro (15)",
  "- **Físico:** mais alto, desengonçado, olhos grandes e sonhadores.",
  "- **Sinais de transformação:** lábios azulados, membrana entre os dedos.",
  "- **Roupas:** moletom vinho com capuz, bermuda tactel e chinelo.",
  "- **Acessórios:** o caderno de causos da Vó Benedita, junto ao peito.",
  "## Mãe dos gêmeos — Cláudia (transformada em Iara)",
  "- **Antes do Dia 0:** 38 anos, técnica de enfermagem no posto de saúde.",
  "- **Transformada:** cabelos de alga, olhos dourados sem pupila.",
  "- **Acessórios:** a medalha de Nossa Senhora Aparecida.",
  "## Vó Benedita (falecida)",
  "- Benzedeira, lenço branco, vestido de chita e avental bordado.",
];

const PROMPTS = [
  "# O Rasgo de Kalunga — Prompts de Personagens (Anime Digital Art)",
  "## Lara (15 anos)",
  "Anime digital art, full body character design, 15-year-old Afro-Brazilian teenage girl…",
  "## Pedro (15 anos)",
  "Anime digital art, full body character design, 15-year-old Afro-Brazilian teenage boy…",
  "## Cláudia, mãe dos gêmeos — humana (38 anos)",
  "Anime digital art, full body character design, 38-year-old Afro-Brazilian woman…",
  "## Cláudia transformada — Iara/Mãe-d'água",
  "Anime digital art, Brazilian river spirit Iara, mermaid woman…",
  "## Vó Benedita (78 anos)",
  "Anime digital art, 78-year-old Afro-Brazilian elderly woman…",
  "## Seu Ademir — humano (60 anos)",
  "## Dona Celina — humana (45 anos)",
  "## Jefferson — humano (14 anos)",
];

export const CENAS_EP2 = [
  {
    id: "S01",
    etapa: null,
    shots: [
      { de: 0, tipo: "grafico", comp: "SemRosto" },
      { de: "hoje eles tem cara", tipo: "grafico", comp: "Trio" },
      { de: "neste video eu mostro", tipo: "titulo", titulo: "Dando rosto aos personagens com IA", sub: "Da ficha ao prompt, do prompt à imagem" },
    ],
  },
  {
    id: "S02",
    etapa: null,
    shots: [
      { de: 0, tipo: "titulo", titulo: "Esse mundo não nasceu na IA", y: 360, size: 130 },
      { de: "o universo de o rasgo", tipo: "grafico", comp: "Pilares", marcas: { a: "o universo de o rasgo", b: "um conto escrito do zero", c: "ampliar a lore", d: "a ia propoe" } },
    ],
  },
  {
    id: "S03",
    etapa: 0,
    shots: [
      { de: 0, tipo: "navegador", url: REPO, aba: "rodrigozan/o-rasgo-de-kalunga", escuro: true, pagina: "github" },
      { de: "pense numa pasta", tipo: "grafico", comp: "MaquinaTempo", marcas: { b: "e cada alteracao", c: "voltar para qualquer" } },
      { de: "o site e gratuito", tipo: "pagina", pagina: "github-historico" },
    ],
  },
  {
    id: "S04",
    etapa: 0,
    shots: [
      { de: 0, tipo: "grafico", comp: "Motivos", marcas: { a: "primeiro o claude", b: "segundo fica registrado", c: "terceiro e ali", d: "se voce nao quiser" } },
    ],
  },
  {
    id: "S05",
    etapa: 1,
    shots: [
      {
        de: 0,
        tipo: "chat",
        pedido: PEDIDO_1,
        ferramenta: "Leu um arquivo, executou 2 comandos",
        resposta: ["Os personagens estão em **Planejamento - O Rasgo de Kalunga.md**:", "- **Lara (15):** prática, desconfiada e protetora.", "- **Pedro (15):** sonhador, contador de histórias.", "- **Mãe dos gêmeos:** transformou-se no Dia 0.", "- **Vó Benedita (falecida):** benzedeira."],
      },
      { de: "a lara pratica", tipo: "captura", img: "claude-personagens", dest: { x: 50, y: 213, w: 845, h: 54 }, rotulo: "Lara" },
      { de: "o pedro sonhador", tipo: "captura", img: "claude-personagens", dest: { x: 50, y: 270, w: 845, h: 80 }, rotulo: "Pedro" },
      { de: "a mae dos gemeos", tipo: "captura", img: "claude-personagens", dest: { x: 50, y: 353, w: 845, h: 54 }, rotulo: "A mãe" },
      { de: "a vo benedita", tipo: "captura", img: "claude-personagens", dest: { x: 50, y: 410, w: 845, h: 54 }, rotulo: "Vó Benedita" },
      { de: "e os seres", tipo: "captura", img: "claude-personagens", dest: { x: 50, y: 468, w: 845, h: 170 }, rotulo: "Os seres" },
      { de: "a ficha tinha", tipo: "grafico", comp: "FaltaCorpo", marcas: { b: "faltava o corpo" } },
    ],
  },
  {
    id: "S06",
    etapa: 1,
    shots: [
      { de: 0, tipo: "chat", pedido: PEDIDO_2, ferramenta: "Search for physical descriptions", resposta: ["**Não.** O planejamento só tem personalidade, função na história e medos.", "A Cena 01 traz poucos detalhes físicos, e são estes:", "- **Lara:** usa mochila, e a costura do bolso lateral está estourando."] },
      { de: "o claude separou", tipo: "captura", img: "claude-sem-descricao", dest: { x: 36, y: 225, w: 960, h: 80 }, rotulo: "O que existia" },
      { de: "e disse com todas", tipo: "captura", img: "claude-sem-descricao", dest: { x: 36, y: 498, w: 960, h: 64 }, rotulo: "O que não existia" },
      { de: "esse e o ponto", tipo: "titulo", titulo: "A IA não inventou nada sem eu pedir", sub: "Ela mostrou o buraco. Preencher foi decisão minha.", y: 300, size: 120 },
    ],
  },
  {
    id: "S07",
    etapa: 1,
    shots: [
      { de: 0, tipo: "chat", pedido: PEDIDO_3, ferramenta: "Criou um arquivo, compartilhou um arquivo", resposta: ["Rod, criei as descrições em **Personagens - O Rasgo de Kalunga.md**, com físico, roupas e acessórios de cada personagem."] },
      { de: "o claude escreveu", tipo: "doc", nome: "Personagens - O Rasgo de Kalunga.md", linhas: FICHAS },
      { de: "mas o melhor foi", tipo: "captura", img: "claude-fichas", dest: { x: 40, y: 175, w: 900, h: 180 }, rotulo: "O que ele inventou" },
      { de: "deu nome para a mae", tipo: "grafico", comp: "Inventado", marcas: { a: "deu nome para a mae", b: "dona celina", c: "jefferson", d: "colocou oculos", e: "e criou a medalha", f: "a ficha e uma proposta" } },
    ],
  },
  {
    id: "S08",
    etapa: 2,
    shots: [
      { de: 0, tipo: "chat", pedido: PEDIDO_4, ferramenta: "Criou um arquivo, compartilhou um arquivo", resposta: ["Rod, os prompts estão em **Prompts Personagens - O Rasgo de Kalunga.md**, em inglês, no estilo anime digital art.", "- **Cláudia:** 38 anos.", "- **Vó Benedita:** 78 anos.", "- **Seu Ademir:** 60 anos.", "- **Dona Celina:** 45 anos.", "- **Jefferson:** 14 anos."] },
      { de: "os prompts sairam", tipo: "doc", nome: "Prompts Personagens - O Rasgo de Kalunga.md", linhas: PROMPTS },
      { de: "a idade entra", tipo: "grafico", comp: "AnatomiaPrompt" },
      { de: "e a versao humana", tipo: "grafico", comp: "AntesDepois", marcas: { b: "e a claudia iara" } },
    ],
  },
  {
    id: "S09",
    etapa: 3,
    shots: [
      { de: 0, tipo: "navegador", url: "labs.google/flow", aba: "Google Flow", escuro: true, pagina: "flow" },
      { de: "e so colar", tipo: "flow", prompt: PROMPT_LARA, img: "personagens/lara.jpg" },
      {
        de: "olha a lara",
        tipo: "anotada",
        img: "personagens/lara.jpg",
        rotulo: "Lara",
        pontos: [
          { x: 688, y: 58, t: "coque alto", ao: "a" },
          { x: 742, y: 548, t: "fita no joelho", ao: "b" },
          { x: 600, y: 250, t: "jaqueta grande demais", ao: "c", lado: "e" },
          { x: 1290, y: 300, t: "perigo", ao: "d", lado: "e" },
        ],
        marcas: { a: "o coque alto", b: "a fita prateada", c: "a jaqueta", d: "a palavra perigo" },
      },
      {
        de: "o pedro saiu",
        tipo: "anotada",
        img: "personagens/pedro.jpg",
        rotulo: "Pedro",
        pontos: [
          { x: 690, y: 75, t: "capuz", ao: "a" },
          { x: 690, y: 140, t: "óculos", ao: "b", lado: "e" },
          { x: 655, y: 112, t: "lápis", ao: "c", lado: "e" },
          { x: 705, y: 262, t: "caderno", ao: "d" },
          { x: 690, y: 190, t: "lábios azulados", ao: "e" },
        ],
        marcas: { a: "de capuz", b: "com os oculos", c: "o lapis", d: "o caderno", e: "os labios" },
      },
      {
        de: "e a mae ja",
        tipo: "anotada",
        img: "personagens/iara.jpg",
        rotulo: "A mãe, como Iara",
        pontos: [
          { x: 705, y: 128, t: "olhos dourados", ao: "a" },
          { x: 610, y: 330, t: "cabelo de alga", ao: "b", lado: "e" },
          { x: 720, y: 420, t: "camisola rasgada", ao: "c" },
          { x: 705, y: 218, t: "medalha", ao: "d" },
          { x: 485, y: 62, t: "lua vermelha", ao: "e", lado: "e" },
        ],
        marcas: { a: "os olhos dourados", b: "o cabelo de alga", c: "a camisola rasgada", d: "a medalha", e: "uma lua vermelha" },
      },
    ],
  },
  {
    id: "S10",
    etapa: 3,
    shots: [
      { de: 0, tipo: "vo", partes: [0] },
      { de: "repare que o prompt", tipo: "grafico", comp: "VoPrompt", marcas: { a: "ajustei o estilo", c: "o mesmo estilo" } },
      { de: "o flow pensa", tipo: "vo", partes: [1, 2, 3] },
      {
        de: "ela ja morreu",
        tipo: "anotada",
        img: "personagens/vo-benedita.jpg",
        rotulo: "Vó Benedita",
        pontos: [
          { x: 690, y: 85, t: "lenço branco" },
          { x: 610, y: 600, t: "vestido de chita", lado: "e" },
          { x: 730, y: 450, t: "avental bordado" },
          { x: 700, y: 400, t: "ramos de benzer", lado: "e" },
          { x: 150, y: 470, t: "fogão a lenha" },
        ],
      },
    ],
  },
  {
    id: "S11",
    etapa: 3,
    shots: [
      { de: 0, tipo: "titulo", titulo: "Nem tudo saiu certo", y: 380, size: 140 },
      { de: "o primeiro problema", tipo: "grafico", comp: "Consistencia", marcas: { b: "como referencia" } },
      {
        de: "o segundo e que",
        tipo: "anotada",
        img: "personagens/pedro.jpg",
        rotulo: "Problema 2 · detalhe sutil",
        foco: { x: 560, y: 60, w: 300, h: 260 },
        pontos: [
          { x: 690, y: 140, t: "pupila de peixe?", ao: "a" },
          { x: 700, y: 268, t: "membrana nos dedos?", ao: "b" },
        ],
        marcas: { a: "a pupila de peixe", b: "e a membrana" },
      },
      {
        de: "e o terceiro e",
        tipo: "grafico",
        comp: "Recortes",
        img: "personagens/claudia-posto.jpg",
        rotulo: "Problema 3 · texto na imagem",
        partes: [{ x: 0, y: 5, w: 92, h: 245 }, { x: 205, y: 90, w: 82, h: 335 }],
        marcas: { a: "palavras sem sentido" },
      },
      { de: "a ia desenha rapido", tipo: "titulo", titulo: "A IA desenha rápido", sub: "Conferir com a ficha continua sendo trabalho meu", y: 340, size: 140 },
    ],
  },
  {
    id: "S12",
    etapa: 4,
    shots: [
      { de: 0, tipo: "titulo", titulo: "Ampliar o mundo", y: 380, size: 170 },
      { de: "no conto aca", tipo: "grafico", comp: "Lore4", marcas: { a: "no conto aca", b: "o leopardo osebo", c: "os mmoatia", d: "a piton onini", e: "os marimbondos mmoboro", f: "dois ja estao", g: "os outros dois" } },
      { de: "os mmoatia tem", tipo: "grafico", comp: "Ponte" },
      { de: "e a regra", tipo: "grafico", comp: "Regra", marcas: { b: "falta descobrir" } },
      { de: "eu vou pedir propostas", tipo: "grafico", comp: "Canone", marcas: { a: "eu vou pedir propostas", b: "comparar com o romance", c: "so entao decidir" } },
    ],
    etiquetas: [{ de: "no conto aca", fonte: "Wikipedia (Anansi)", dur: 240 }],
  },
  {
    id: "S13",
    etapa: null,
    shots: [
      { de: 0, tipo: "grafico", comp: "Proximo", marcas: { a: "me conta nos comentarios", b: "se inscreve no canal" } },
      { de: "a historia continua", tipo: "titulo", titulo: "A história continua sendo minha", sub: "A IA só me ajuda a contar", y: 340, size: 130 },
    ],
  },
];

export const CORTES_EP2 = {
  S01: [{ de: "existiam so em texto", v: "escritora-caderno-1" }],
  S02: [
    { de: "escrevendo um romance", v: "escritor-digitando-1" },
    { de: "quem decide o que", v: "pensando-decisao-1" },
  ],
  S03: [{ de: "serve muito bem", v: "escritora-notebook-1" }],
  S04: [
    { de: "copiar e colar", v: "digitando-noite-1" },
    { de: "eu desfaco", v: "riscando-papel-1" },
    { de: "fica guardada fora", v: "organizando-arquivos-1" },
  ],
  S06: [{ de: "a decisao de preencher", v: "pensando-janela-1" }],
  S07: [{ de: "algumas ideias eu mantive", v: "lendo-anotando-1" }],
  S08: [{ de: "os geradores de imagem", v: "ilustradora-tablet-1" }],
  S10: [{ de: "lembrancas e sonhos", v: "avo-neta-1" }],
  S11: [{ de: "e aqui que entra", v: "revisando-papeis-1" }],
  S12: [{ de: "ampliar o mundo", v: "lendo-livros-1" }],
  S13: [
    { de: "me conta nos comentarios", v: "celular-sorrindo-1" },
    { de: "acompanha a serie", v: "assistindo-notebook-1" },
  ],
};
