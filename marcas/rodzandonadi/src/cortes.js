const P = (arquivo, rotulo) => ({ img: `personagens/${arquivo}`, rotulo });
const CRED_ANANSI = "Ilustração de Pamela Colman Smith, 1899 · domínio público";
const CRED_KALUNGA = "Cosmograma Bakongo · MiddleOfAfrica · CC BY-SA 4.0";

export const CORTES = {
  S01: [
    { de: "pasta estava vazia", v: "folha-branca-1" },
    { de: "conto de apocalipse", v: "rua-abandonada-1" },
    { de: "conversando com o", v: "digitando-noite-1" },
    { de: "corrigir o estilo", v: "corrigindo-1" },
  ],
  S02: [
    { de: "repetir com o", v: "planejando-1" },
    { de: "montar o planejamento", v: "mao-escrevendo-1" },
    { de: "chegar a publicacao", v: "livros-pilha-1" },
  ],
  S03: [
    { de: "no meu computador", v: "abrindo-notebook-1" },
    { de: "escritorio do livro", v: "pensando-janela-1" },
    { de: "arquivos de apoio", v: "arquivos-mesa-1" },
  ],
  S04: [
    { de: "campo mais importante", v: "mao-escrevendo-2" },
    { de: "planejar uma historia", v: "planejando-2" },
    { de: "roda na nuvem", v: "servidores-1" },
    { de: "leia isso antes", v: "lendo-tela-1" },
  ],
  S05: [
    { de: "pacote de instrucoes", v: "codando-1" },
    { de: "construir mundos", v: "floresta-neblina-1" },
    { de: "confira de onde", v: "lendo-tela-2" },
  ],
  S06: [
    { de: "link do repositorio", v: "codando-2" },
    { de: "abrir o conteudo", v: "lendo-manuscrito-1" },
    { de: "trinta e seis", v: "post-its-1" },
    { de: "tres fios narrativos", v: "teia-1" },
  ],
  S07: [
    { de: "escrever um livro", v: "abrindo-notebook-2" },
    { de: "o manuscrito e", v: "lendo-manuscrito-2" },
    { de: "para a capa", v: "capa-livro-1" },
  ],
  S08: [
    { de: "um apocalipse folclorico", v: "rua-abandonada-2" },
    { de: "irmaos gemeos negros", ...P("lara.jpg", "Lara") },
    { de: "lara e pedro", ...P("pedro.jpg", "Pedro") },
    { de: "santa branca", v: "rua-cidade-1" },
    { de: "quatro perguntas", v: "pensando-janela-2" },
  ],
  S09: [
    { de: "pesquisou na web", v: "biblioteca-1" },
    { de: "o elenco", ...P("claudia.jpg", "Claudia") },
    { de: "uma lista de fontes", v: "biblioteca-2" },
    { de: "anansi por exemplo", img: "externas/anansi.png", cartao: true, credito: CRED_ANANSI },
    { de: "o leopardo osebo", v: "leopardo-1" },
    { de: "a mmoatia", v: "floresta-neblina-2" },
  ],
  S10: [
    { de: "li e apontei", v: "paginas-virando-1" },
    { de: "limiar entre mundos", img: "externas/kalunga-cosmograma.png", cartao: true, credito: CRED_KALUNGA },
    { de: "dos ancestrais", v: "mar-entardecer-1" },
    { de: "oceano atlantico", v: "oceano-2" },
  ],
  S11: [
    { de: "pedi a primeira cena", v: "cafe-escrevendo-1" },
    { de: "conflito e desastre", v: "post-its-2" },
    { de: "eu li e", v: "paginas-virando-2" },
    { de: "paragrafos cheios", v: "folha-branca-2" },
    { de: "rick riordan", v: "livros-pilha-2" },
    { de: "ele reescreveu", v: "digitando-noite-1", ss: 8 },
  ],
  S12: [
    { de: "atualizar o planejamento", v: "planejando-1", ss: 14 },
    { de: "o ciclo se repete", v: "livro-mao-1" },
    { de: "fazer a capa", v: "capa-livro-2" },
    { de: "livro publicado", v: "livro-mao-2" },
  ],
};

export const DUR_CORTE = 60;
