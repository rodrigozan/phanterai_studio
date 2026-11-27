# Capas dos vídeos longos (Aprenda YouTube e PhanterAI Creative)

Regra do Rod, 27/11/2026: as capas dos dois canais estavam todas iguais (3 modelos fixos, o A sempre subia).
Substitui a regra de 20/11 (A pantera gigante, B pedido no Desktop, C antes x depois). Esses modelos não existem mais.

## Processo, em todo vídeo
1. **Pesquisar** (método da skill yt-viral): `python3 -I scripts/capa-pesquisa.py youtube|ia "busca do tema" <pasta nova no scratchpad>`.
   Abrir `canais.jpg` e `tema.jpg`. Thumbnails baixadas são só referência de composição, nunca copiar arte, rosto ou marca de ninguém.
2. **Anotar** em `capas.json` (campo `referencia`) qual outlier inspirou cada capa e o que foi aproveitado.
3. **Criar 3 ideias diferentes de verdade** (promessa, emoção e composição, não só o texto):
   - 1 `livre`: componente novo `marcas/phanterai/src/long/capas-livres/<slug>.jsx`, desenhado em cima de UMA metáfora do assunto
     (ex.: cartaz de "procurado" para o algoritmo vilão). `export default ({slug, ...dados}) => ...`, 1280x720. Nunca copiar a livre de outro vídeo.
   - 2 da biblioteca, com fundos diferentes e fora dos usados recentemente.
4. Renderizar: `node scripts/long-capa.mjs <slug> out/<marca>/long-videos/<slug>/capa.jpg --canal=aprenda|creative`.
5. **Olhar `capa-folha.jpg`**: lê no tamanho de celular? texto cortado ou coberto? as 3 parecem de canais diferentes? parecem com as dos últimos vídeos? Corrigir.
6. **A = a ideia mais forte para este vídeo**, não um modelo fixo.

O script recusa: sem `livre`, formatos repetidos, fundos iguais, A usada nos últimos 6 vídeos, B/C usadas nos últimos 2.
O histórico `marcas/phanterai/capas-historico.json` é um só para os dois canais: commitar junto. Não contornar com `--amostra`.

## capas.json (em public/phanterai/episodes/long-videos/<slug>/)
```json
[
 {"formato": "livre", "referencia": "...", "dados": {}},
 {"formato": "versus", "referencia": "...", "dados": {"esquerda": {"topo": "ANTES", "numero": "4 MIL", "base": "HORAS"}, "direita": {"topo": "2027", "numero": "8 MIL", "base": "HORAS"}}},
 {"formato": "post", "referencia": "...", "dados": {"autor": "Canal pequeno", "linhas": ["Frase curta", "em 2 ou 3", "linhas."]}}
]
```

| formato | fundo | dados | serve quando |
|---|---|---|---|
| citacao | neutro | antes[], destaque, pose, fundo | uma frase que provoca |
| metrica | neutro | rotulo, valor, sobe, palavra, pose | há um número real que dói ou impressiona |
| versus | cor | esquerda{topo,numero,base}, direita{...} | dois estados ou duas regras |
| gigante | cor | palavra (curta), selo, pose, fundo, faisca | o tema cabe numa palavra |
| marcatexto | cor | linha, destaque, img, fundo | há um print ou resultado bonito |
| notificacao | cor | avisos[] (até 3), chamada, faisca | consequência que chega no celular |
| post | claro | autor, linhas[], pose, fundo | opinião ou anúncio forte |
| grade | claro | titulo, itens[{icone,rotulo}] (3 a 5), rodape, cor, faisca | lista de N coisas |
| velho-novo | claro | velho[], novo[], pose | jeito antigo riscado |
| escalada | escuro | titulo, passos[3], cor | progressão de números |
| cartaz | escuro | linhas[] (1 ou 2), pose | tese ou desabafo |
| grafico | escuro | pontos[], anotacao[], rotulo, marco | curva REAL |
| etapas | escuro | comando, telas[{img,rotulo}] (3) | rascunho até resultado |
| resultado | foto | img, titulo, selo, zoom | o que a IA fez é bonito sozinho |

`img` é relativo à pasta do episódio. Faísca laranja (`faisca`) só quando o vídeo é sobre o Claude. A pantera é opcional: não precisa estar nas 3.

## Limites
- Número, gráfico, post, notificação e métrica só com dado real e do próprio vídeo. Nada de dinheiro, views ou resultado inventado, nem notificação que finja ser real de empresa.
- Sem foto de banco de imagem, sem rosto de pessoa real, sem personagem protegido, sem copiar a arte de outro canal.
- Capa de vídeo já publicado não se refaz sem o Rod pedir.
- Biblioteca cansou? Criar formato novo em `CapaFormatos.jsx` (a partir de pesquisa nova) e registrar em `capa-regras.mjs`. Uma livre que ficou boa pode virar formato.
