# Roteiro para Claude Code (Remotion): Como escrever um livro com IA

Canal: @rodzandonadi
Formato: vídeo longo para YouTube, sem apresentador, com narração em português, capturas de tela, clipes de tela e motion graphics, no mesmo modelo dos vídeos longos da Phanter AI, mas com a identidade visual do canal rodzandonadi.
Duração estimada: cerca de 9 minutos (a narração tem 1.331 palavras, por volta de 8min50s a 150 palavras por minuto). A duração final vem do áudio real.

---

## 1. Como usar este documento

Você é o Claude Code. Sua missão é montar o vídeo completo em Remotion a partir deste roteiro, da narração e dos arquivos de apoio.

Cada cena tem três níveis de instrução:

- OBRIGATÓRIO: o que precisa aparecer ou acontecer. Não mude.
- RECOMENDADO: sugestão forte, mas você pode trocar por algo melhor se justificar.
- LIVRE: decisão sua (animação, ritmo, transições, composição, tipografia dentro da identidade).

Você tem liberdade criativa para escolher como cada ideia aparece. Não tem liberdade para mudar a ordem das cenas, o texto da narração, os fatos mostrados em tela nem a identidade visual definida pelas referências do canal.

Regras gerais de trabalho:
- Não escreva comentários no código.
- Se precisar instalar dependências, use yarn (nunca npm), com os pacotes normais em um comando `yarn add` e os de desenvolvimento em outro comando `yarn add -D`, um comando por linha, sem encadear com `&&`.
- Use o projeto Remotion do diretório de trabalho atual; se não houver, crie um.
- Antes de começar, leia este roteiro inteiro, a narração e a pasta de referências.

## 2. Arquivos de entrada

Estrutura esperada (ajuste os nomes se precisar, mas mantenha o mapeamento da seção 7):

- `public/audio/narracao.mp3`: áudio da narração gerado a partir do arquivo `narracao-rodzandonadi-escrever-livro-com-ia.md` (12 parágrafos, um por cena).
- `public/capturas/`: as capturas de tela PNG, com os nomes originais `Captura_de_tela_2026-11-19_HHMMSS.png`.
- `public/clipes/planejamento.mp4` e `public/clipes/cena_1.mp4`: clipes de rolagem de texto (11 a 12 segundos, com áudio que deve ficar mudo, salvo decisão contrária do Rod).
- `public/texto/cena_1.txt`: texto final da cena 1 (versão reescrita).
- `referencias/`: prints do canal do YouTube e do Instagram do Rod para referência de layout (ver seção 3).

Narração e sincronia:
1. Obtenha as marcações de tempo por palavra do áudio (por transcrição ou pelos timestamps do gerador de voz).
2. Gere um `cenas.json` com início e fim em frames de cada cena, derivado do áudio: o parágrafo N da narração corresponde à cena SN.
3. A composição deve ser dirigida por esse arquivo, para que trocar o áudio reajuste o vídeo inteiro.

Se algum arquivo estiver faltando, pare e liste o que falta antes de seguir.

## 3. Identidade visual

Fonte da verdade: `marcas/rodzandonadi/marca.json` e `marcas/rodzandonadi/IDENTIDADE-VISUAL.md` (PDF do Estúdio Taco, 2021). Os prints do canal e do Instagram ainda podem ser enviados em `referencias/`; se enviados, prevalecem sobre qualquer outra instrução em caso de conflito.

Quando a pasta `referencias/` estiver preenchida:

1. Analise cada imagem e extraia: paleta de cores, tipografia (família, peso, caixa), estilo de títulos, uso de contornos e sombras, cantos arredondados, logotipo e avatar, proporção e posição de elementos, densidade de informação.
2. Registre as decisões em um arquivo de tokens (`theme`) usado por todas as cenas: cores, fontes, espaçamentos, raios, sombras.
3. Se um elemento destas instruções conflitar com as referências, prevalecem as referências.

Tudo por tokens (`marcas/rodzandonadi/src/theme.js`), nada de cor ou fonte solta nos componentes.

Importante: o modelo de produção é o dos vídeos longos da Phanter AI (formato, ritmo, estrutura), mas não use a marca da Phanter AI. Nada de panterinha de boné amarelo nem paleta neon da Phanter AI neste vídeo.

## 4. Especificações técnicas (RECOMENDADO)

- Resolução 1920x1080, 30 fps, proporção 16:9.
- Legendas sincronizadas com a narração, palavra por palavra ou frase por frase, dentro da identidade visual; posição que não cubra o conteúdo principal das capturas.
- Trilha sonora instrumental discreta (lofi ou ambiente), volume baixo sob a voz; pode ser música autoral do Rod, se ele indicar o arquivo. Sem música de terceiros com direitos autorais.
- Transições curtas e consistentes; evite efeitos que distraiam da leitura das telas.
- Texto em tela sempre legível em tela de celular: zoom nos trechos citados em vez de mostrar a captura inteira pequena.

## 5. Padrões do modelo (RECOMENDADO)

Componentes reutilizáveis sugeridos. Crie os que fizer sentido; você pode inventar outros.

- Cena de captura: entrada suave, zoom e deslocamento até o trecho citado, destaque (retângulo, brilho ou escurecimento do resto) no ponto exato que a narração menciona.
- Cena de clipe: clipe de tela com moldura, mudo, com velocidade ajustável para casar com a narração.
- Texto animado: revelação de trechos de texto com destaque de palavras-chave.
- Antes e depois: duas versões lado a lado ou em sequência, com rótulos claros.
- Etiqueta de fonte: faixa discreta no canto com o nome da fonte quando um fato verificado é citado (ver seção 8).
- Barra de capítulos: indicador discreto das etapas (Preparar, Skills, Planejar, Ajustar, Escrever), que avança com as cenas.
- Cartão de abertura de bloco, se achar útil.

## 6. Cenas

Duração é alvo; a duração real vem do áudio. Cada cena corresponde a um parágrafo da narração (a âncora é o início do parágrafo).

### S01 — Gancho (0:00 a 0:28) | Parágrafo 1
Âncora: "Esta pasta estava vazia."
Assets: captura 152248, captura 160623, `planejamento.mp4` (trecho), `cena_1.txt` (trecho).
- Objetivo: contraste entre o antes e o depois, em ritmo rápido.
- OBRIGATÓRIO: abrir com a pasta vazia (152248), terminar na pasta com o arquivo de planejamento (160623); mostrar de relance o planejamento e um trecho do texto da cena.
- RECOMENDADO: cortes rápidos no ritmo das frases; título provisório do vídeo em tela só ao final da cena.
- LIVRE: transição entre o antes e o depois; efeito de "preenchimento" da pasta.

### S02 — Mapa do vídeo (0:28 a 0:57) | Parágrafo 2
Âncora: "A ideia é te mostrar um processo..."
Assets: nenhum (motion graphic).
- OBRIGATÓRIO: mostrar as etapas na ordem em que a narração as cita: preparar pasta e projeto; instalar duas skills; apresentar a ideia e gerar o planejamento; corrigir; pedir a primeira cena; o que falta para publicar.
- LIVRE: ícones, linha do tempo, numeração. Esta cena introduz a barra de capítulos.

### S03 — A pasta (0:57 a 1:27) | Parágrafo 3
Âncora: "Tudo começa na tela inicial do Claude..."
Assets: capturas 152050, 152248.
- OBRIGATÓRIO: tela inicial com a opção "Projeto ou pasta" em destaque; pasta `E:\Autopublicação com IA` vazia.
- RECOMENDADO: o nome da pasta aparece em tela quando a narração o fala.
- LIVRE: animação de "escritório do livro" (pasta com arquivos aparecendo), se combinar com a identidade.

### S04 — O projeto e as permissões (1:27 a 2:13) | Parágrafo 4
Âncora: "Depois criei o projeto..."
Assets: capturas 152420, 152508, 152304, 152519.
- OBRIGATÓRIO: tela de criação do projeto com nome, objetivo e pasta (152420); o aviso "Permitir que o Claude altere arquivos" (152304); o aviso de acesso à pasta com o texto sobre a sessão rodar na nuvem (152519), com zoom nesse trecho.
- OBRIGATÓRIO: na captura 152508, ocultar (recortar ou desfocar) o texto digitado no campo de mensagem, porque é uma pergunta que não faz parte desta história.
- RECOMENDADO: ordem das imagens seguindo a fala (criação, permissão, aviso da nuvem).
- LIVRE: destaque visual nos dois avisos para reforçar que são pontos de atenção.

### S05 — Skills por upload (2:13 a 3:00) | Parágrafo 5
Âncora: "Agora as skills."
Assets: capturas 154203, 154224, 154256, 154505.
- OBRIGATÓRIO: aba Plugins com o filtro Skills (154203); menu Adicionar com "Fazer upload de plugin" (154224); tela com o arquivo `fantasy-world-building-1.0.0.zip` e o aviso de confiança (154256), com zoom no aviso; página do plugin com "Pode executar código sem pedir permissão" (154505), com zoom nesse trecho.
- Não usar a captura 154152 (mostra conectores com login expirado).
- LIVRE: animação de seta ou cursor guiando o caminho Plugins, Adicionar, Fazer upload.

### S06 — Skills pelo GitHub (3:00 a 3:56) | Parágrafo 6
Âncora: "A segunda forma é pedir para o próprio Claude."
Assets: capturas 155256, 155338.
- OBRIGATÓRIO: o pedido de instalação com o link, o card "Salvar plugin" com `/crucible-writing-system`, o aviso do Claude sobre as quatro skills unidas e o que ficou de fora (zoom nesse texto), e a confirmação "Salvo como /crucible-writing-system".
- OBRIGATÓRIO: etiqueta de fonte quando a narração citar os 36 beats e os três fios (ver seção 8).
- RECOMENDADO: mostrar de forma gráfica "4 skills em 1" (planner, outliner, writer, editor viram uma).
- LIVRE: forma de apresentar os números (36 beats, 3 fios) sem poluir.

### S07 — O que o Claude tem à mão (3:56 a 4:34) | Parágrafo 7
Âncora: "Com tudo pronto, abri o projeto..."
Assets: capturas 155531, 155538, 155816, 155823, 155828.
- OBRIGATÓRIO: o menu de modelo e esforço (155531), a pergunta sobre as ferramentas (155538) e a resposta organizada por etapa (155816 e 155823).
- RECOMENDADO: rolar verticalmente a resposta, emendando 155816 em 155823, em vez de cortar entre imagens; usar 155828 só se precisar mostrar o fim da lista.
- LIVRE: agrupar visualmente por etapa (planejar e escrever, manuscrito, capa, divulgação e venda) com cores ou ícones.

### S08 — A ideia e as perguntas (4:34 a 5:22) | Parágrafo 8
Âncora: "Aí contei a ideia."
Assets: capturas 160414, 160420.
- OBRIGATÓRIO: o texto da ideia do Rod (160414) e as quatro perguntas com as respostas (160420).
- RECOMENDADO: destacar, em sequência, os elementos que a narração cita (gêmeos Lara e Pedro, Santa Branca, Dia Zero, mitos africanos); depois as quatro perguntas na ordem em que são faladas.
- LIVRE: forma de transição entre a ideia e as perguntas.

### S09 — O planejamento (5:22 a 6:16) | Parágrafo 9
Âncora: "Com essas respostas, o Claude pesquisou na web..."
Assets: capturas 160556, 160600, 160623, `planejamento.mp4`.
- OBRIGATÓRIO: o planejamento sendo entregue (160556, 160600), o arquivo salvo na pasta (160623) e o clipe do documento (ficha, personagens, tabela das seis cenas, lista de fontes), com zoom na seção de fontes quando a narração falar de fontes.
- OBRIGATÓRIO: etiqueta de fonte quando a narração citar Anansi, Nyame, Osebo e Mmoatia (ver seção 8).
- RECOMENDADO: cartão visual simples ligando Anansi ao mito original e ao personagem do conto (Osebo como vilão), sem copiar imagens de terceiros.
- LIVRE: ritmo do clipe (aceleração ou pausa em trechos).

### S10 — Os erros e o Kalunga (6:16 a 7:07) | Parágrafo 10
Âncora: "Aqui entra a parte que quase ninguém mostra..."
Assets: capturas 162137, 162600.
- OBRIGATÓRIO: a mensagem de correção do Rod (162137) e a explicação sobre Kalunga (162600), com zoom no trecho citado.
- OBRIGATÓRIO: etiqueta de fonte quando a narração definir Kalunga (ver seção 8).
- RECOMENDADO: tom visual mais "de bastidor", com a frase final ("pergunte") reforçada em tela.
- LIVRE: tratamento gráfico da ideia de "fronteira de água entre dois mundos", sem usar imagens de terceiros.

### S11 — A cena 1: antes e depois (7:07 a 8:15) | Parágrafo 11
Âncora: "Depois do plano, pedi a primeira cena..."
Assets: capturas 162719, 162740, 163408, 163505, `cena_1.mp4` (antes), `cena_1.txt` (depois).
- OBRIGATÓRIO: o pedido da cena (162719) e a cena pronta com a estrutura (162740).
- OBRIGATÓRIO: gráfico da estrutura de cena e sequência mostrando as duas metades (cena: objetivo, conflito, desastre; sequência: reação, dilema, decisão), preenchida com o conteúdo real da cena 1 segundo a captura 162740: objetivo (pegar o xarope), conflito (o Lobisomem, que antes era o Seu Ademir), desastre (a lata de sardinha), reação (pânico e culpa), dilema (entrar ou correr para o rio), decisão (passar o xarope por baixo da porta e correr para o rio).
- OBRIGATÓRIO: o antes (`cena_1.mp4`, muitos parágrafos de uma frase só), a crítica do Rod (163408), o que mudou (163505) e o depois (trechos de `cena_1.txt`).
- OBRIGATÓRIO: etiqueta de fonte quando a narração citar Dwight Swain (ver seção 8).
- RECOMENDADO: comparação lado a lado ou em sequência do mesmo trecho antes e depois, se o Rod fornecer o texto antigo; sem ele, o clipe é o "antes" e o texto é o "depois".
- RECOMENDADO: para o "depois", mostrar trechos curtos (abertura, a lata de sardinha, a decisão de ir ao rio), não o texto inteiro.
- LIVRE: animação da estrutura, destaque de palavras, ritmo.

### S12 — Atualizar o plano e próximos passos (8:15 a 8:52) | Parágrafo 12
Âncora: "Por fim, pedi para atualizar o planejamento."
Assets: captura 164829.
- OBRIGATÓRIO: o planejamento atualizado (164829) com zoom nos pontos citados (meta de cerca de 10 mil palavras, cenas de cerca de 1.700, estilo registrado, cenas 2 e 3 ajustadas, pergunta sobre escrever a próxima).
- OBRIGATÓRIO: lista visual do que falta (diagramar, capa, publicar, divulgar, vender) e tela final de inscrição no canal, no estilo do canal.
- LIVRE: tela final, encerramento, trilha sonora.
- Não use a captura `1795117713911_image.png` (repete a 164829).

## 7. Mapa de assets

| ID | Arquivo | Tipo | Cena |
|----|---------|------|------|
| 152050 | Captura_de_tela_2026-11-19_152050.png | Tela inicial | S03 |
| 152248 | Captura_de_tela_2026-11-19_152248.png | Pasta vazia | S01, S03 |
| 152304 | Captura_de_tela_2026-11-19_152304.png | Permissão de alterar arquivos | S04 |
| 152420 | Captura_de_tela_2026-11-19_152420.png | Criar projeto | S04 |
| 152508 | Captura_de_tela_2026-11-19_152508.png | Projeto criado (ocultar o texto digitado) | S04 |
| 152519 | Captura_de_tela_2026-11-19_152519.png | Acesso à pasta | S04 |
| 154203 | Captura_de_tela_2026-11-19_154203.png | Plugins, filtro Skills | S05 |
| 154224 | Captura_de_tela_2026-11-19_154224.png | Menu Adicionar | S05 |
| 154256 | Captura_de_tela_2026-11-19_154256.png | Upload do zip | S05 |
| 154505 | Captura_de_tela_2026-11-19_154505.png | Plugin Fantasy World Building | S05 |
| 155256 | Captura_de_tela_2026-11-19_155256.png | Instalar pelo GitHub | S06 |
| 155338 | Captura_de_tela_2026-11-19_155338.png | Skill salva | S06 |
| 155531 | Captura_de_tela_2026-11-19_155531.png | Menu de modelos | S07 |
| 155538 | Captura_de_tela_2026-11-19_155538.png | Primeira pergunta | S07 |
| 155816 | Captura_de_tela_2026-11-19_155816.png | Resposta, parte 1 | S07 |
| 155823 | Captura_de_tela_2026-11-19_155823.png | Resposta, parte 2 | S07 |
| 155828 | Captura_de_tela_2026-11-19_155828.png | Resposta, fim (opcional) | S07 |
| 160414 | Captura_de_tela_2026-11-19_160414.png | A ideia | S08 |
| 160420 | Captura_de_tela_2026-11-19_160420.png | Perguntas do Claude | S08 |
| 160556 | Captura_de_tela_2026-11-19_160556.png | Planejamento, parte 1 | S09 |
| 160600 | Captura_de_tela_2026-11-19_160600.png | Planejamento, parte 2 | S09 |
| 160623 | Captura_de_tela_2026-11-19_160623.png | Arquivo na pasta | S01, S09 |
| 162137 | Captura_de_tela_2026-11-19_162137.png | Correções do Rod | S10 |
| 162600 | Captura_de_tela_2026-11-19_162600.png | Explicação de Kalunga | S10 |
| 162719 | Captura_de_tela_2026-11-19_162719.png | Pedido da cena 1 | S11 |
| 162740 | Captura_de_tela_2026-11-19_162740.png | Cena 1 pronta | S11 |
| 163408 | Captura_de_tela_2026-11-19_163408.png | Crítica de estilo | S11 |
| 163505 | Captura_de_tela_2026-11-19_163505.png | Cena reescrita | S11 |
| 164829 | Captura_de_tela_2026-11-19_164829.png | Planejamento atualizado | S12 |
| V1 | planejamento.mp4 | Clipe do documento | S01, S09 |
| V2 | cena_1.mp4 | Clipe da cena 1 (antes) | S11 |
| T1 | cena_1.txt | Texto da cena 1 (depois) | S01, S11 |

Descartadas: 154152 (login expirado nos conectores) e `1795117713911_image.png` (repete a 164829).

## 8. Etiquetas de fonte (fatos verificados que aparecem na narração)

Mostre uma etiqueta discreta com a fonte quando a narração citar o fato.

- Estrutura da Crucible (36 beats, três fios, fantasia épica, quatro skills): repositório `github.com/forsonny/the-crucible-writing-system-for-claude`.
- Anansi, Nyame, Osebo, Mmoatia: Wikipedia (Anansi) e Mythlok (Theft of Stories, `mythlok.com/events/theft-of-stories/`).
- Kalunga (palavra em kikongo para "limiar entre mundos", fronteira de água entre vivos e ancestrais, associação ao Atlântico após o tráfico de escravizados): Wikipedia (Kalûnga Line).
- Cena e sequência (Swain, 1965): Wikipedia (Scene and sequel).
- Rick Riordan, autor de Os Heróis do Olimpo: Wikipedia (Percy Jackson & the Olympians, série seguida por The Heroes of Olympus).

## 9. Checklist de entrega

- A composição lê `cenas.json` e o áudio real; trocar o áudio reajusta o vídeo.
- Cada parágrafo da narração aparece na cena correspondente, na ordem.
- Todas as capturas estão legíveis, com zoom nos trechos citados.
- A captura 152508 está sem o texto digitado, e a 154152 e a duplicada não aparecem.
- Etiquetas de fonte aparecem nos momentos da seção 8.
- Identidade visual segue as referências do canal (seção 3); nenhum elemento da Phanter AI.
- Sem erros de português nos textos em tela.
- Render final em MP4 1920x1080, 30 fps; assistir ao render inteiro antes de entregar.

## 10. Pendências para o Rod

- Enviar os prints do canal do YouTube e do Instagram (seção 3).
- Gerar o áudio da narração e enviar o arquivo.
- Informar se o áudio dos clipes `planejamento.mp4` e `cena_1.mp4` entra ou fica mudo.
- Enviar o texto antigo da cena 1, se quiser o antes e depois lado a lado em texto.
- Indicar a trilha (música autoral ou outra).
- Confirmar se a narração em primeira pessoa e o convite final para se inscrever no canal estão bons.
