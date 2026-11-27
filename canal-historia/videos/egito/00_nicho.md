# Egito Antigo: leitura do nicho (etapa 1, /yt-viral)

Coleta: 2026-11-25, yt-dlp em listagens públicas (últimos 30 vídeos de cada canal), 303 vídeos longos (>4 min) de 24 canais.
Dados brutos: `00_nicho_collected.json`. Ranking: `swipe.py --min 2.0` (múltiplo sobre a mediana do próprio canal).
Canais com menos de 4 vídeos coletados foram descartados pela ferramenta: Comando Animado, Fun History, Wise Crowns, Odd Stick History.

## Mais forte (relevante ao formato)
| Múltiplo | Views vs mediana | Canal | Título | Fórmula (do título) |
|---|---|---|---|---|
| 120x | 118.000 vs 980 | Sacristia Explica (PT) | A História COMPLETA da Igreja Católica | sem classificação |
| 18,7x | 1.000.000 vs 53.500 | Genius History | The ENTIRE History of Iran in 11 Minutes | The Clock |
| 16x | 2.700 vs 169 | Arquivo Morto (PT) | A História INTEIRA do Integralismo no Brasil em 12 minutos | sem classificação (na prática, The Clock) |
| 10x | 3.700.000 vs 370.000 | How So | Medieval Europe: 1000 Years in 20 Minutes | The Clock |
| 7,7x | 414.000 vs 53.500 | Genius History | The ENTIRE History of ROME in 12 Minutes | The Clock |

Estrutura comum: **um recorte inteiro de um assunto + a duração prometida em minutos no título** (11 a 20 min, e o vídeo cumpre).
A fórmula é leitura do TÍTULO, não prova do motivo do sucesso.

## Cuidados
- Medianas minúsculas inflam o múltiplo (Stickman History 47, Hist Docs 109, Sacristia 980). Os dois primeiros do ranking bruto (vlog e "WW3") são ruído e foram ignorados.
- Egito, especificamente: 13 vídeos de Egito (maioria stickman) em canais pequenos ficaram entre 5 e 171 views. O único grande (Kelevin, 587k) está dentro do normal do canal dele (mediana 353k, ~1,7x). **Os dados sustentam o FORMATO, não o Egito como tema vencedor.**
- PT-BR: o formato "A HISTÓRIA INTEIRA de X em N minutos" quase não tem concorrente com tração (Arquivo Morto: mediana 169, máx 2.700). Brecha real, mas não testada.
- A busca foi por consulta, então há viés para o que o YouTube devolve nessas palavras; não é o mercado inteiro.

## Títulos de trabalho para o Egito (decidir na etapa 1)
1. A HISTÓRIA INTEIRA do EGITO ANTIGO em 12 minutos
2. 3.000 anos de Egito em 12 minutos (a história inteira)
3. A HISTÓRIA INTEIRA do Egito Antigo: dos primeiros faraós a Cleópatra em 12 minutos

O "12 minutos" e os "3.000 anos" só valem se o vídeo final e a pesquisa confirmarem (ajustar o número ao tempo real do render).
