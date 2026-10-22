# Roteiro de teste — composição TesteSfx

Vídeo: render da composição `TesteSfx` (`src/TesteSfx.jsx`), 1920×1080, 30 fps, **1:00**, sem voz nem música.
30 efeitos = 6 famílias × 5 opções, **2 s por trecho**, na ordem de `SFX`/`SFX_VARIANTS` (`src/theme.js`):
pop → ding → whoosh → coin → error → riser. Opção 1 = arquivo original; 2–5 = alternativas Mixkit.

Testador: ____________  Data: ___/___/____  Arquivo MP4: ______________________  Fone/caixa: ____________

## Como conferir

- Ouça de fone, volume do sistema fixo do início ao fim. A tela mostra família, "opção N de 5" e o arquivo — confira se bate com a linha.
- O som entra ~0,2 s depois da troca de tela. **Fim** = quando o trecho deve acabar dentro dos 2 s (já com fade).
- **Toca** — o som aparece nesse trecho (não fica mudo, não toca o som de outro trecho).
- **Inteiro** — termina por conta própria ou em fade suave antes da próxima tela; sem corte seco, clique ou estalo.
- **Volume** — parecido com as outras opções da *mesma família* (não compare pop com riser). Se destoar, anote "alto" ou "baixo".
- **Resultado** — OK só se os três itens passarem; senão FALHA + motivo em Obs.

## Tabela

| Marca | Família | Opção | Arquivo | Fim | Toca | Inteiro | Volume | OK/FALHA | Obs. |
|---|---|---|---|---|---|---|---|---|---|
| 0:00 | pop | 1 | `pop.mp3` | 0,5 s | ☐ | ☐ | ☐ | |  |
| 0:02 | pop | 2 | `variants/pop/pop-02.mp3` | 0,7 s | ☐ | ☐ | ☐ | |  |
| 0:04 | pop | 3 | `variants/pop/pop-03.mp3` | 0,5 s | ☐ | ☐ | ☐ | |  |
| 0:06 | pop | 4 | `variants/pop/pop-04.mp3` | 0,5 s | ☐ | ☐ | ☐ | |  |
| 0:08 | pop | 5 | `variants/pop/pop-05.mp3` | 0,4 s | ☐ | ☐ | ☐ | |  |
| 0:10 | ding | 1 | `ding.mp3` | 1,2 s | ☐ | ☐ | ☐ | |  |
| 0:12 | ding | 2 | `variants/ding/ding-02.mp3` | 1,2 s | ☐ | ☐ | ☐ | |  |
| 0:14 | ding | 3 | `variants/ding/ding-03.mp3` | 1,1 s | ☐ | ☐ | ☐ | |  |
| 0:16 | ding | 4 | `variants/ding/ding-04.mp3` | 0,6 s | ☐ | ☐ | ☐ | |  |
| 0:18 | ding | 5 | `variants/ding/ding-05.mp3` | 0,9 s | ☐ | ☐ | ☐ | |  |
| 0:20 | whoosh | 1 | `whoosh.mp3` | 0,7 s | ☐ | ☐ | ☐ | |  |
| 0:22 | whoosh | 2 | `variants/whoosh/whoosh-02.mp3` | 1,1 s | ☐ | ☐ | ☐ | |  |
| 0:24 | whoosh | 3 | `variants/whoosh/whoosh-03.mp3` | 1,1 s | ☐ | ☐ | ☐ | |  |
| 0:26 | whoosh | 4 | `variants/whoosh/whoosh-04.mp3` | 0,5 s | ☐ | ☐ | ☐ | |  |
| 0:28 | whoosh | 5 | `variants/whoosh/whoosh-05.mp3` | 1,1 s | ☐ | ☐ | ☐ | |  |
| 0:30 | coin | 1 | `coin.mp3` | 1,4 s | ☐ | ☐ | ☐ | | **⚠ chiado?** |
| 0:32 | coin | 2 | `variants/coin/coin-02.mp3` | 0,6 s | ☐ | ☐ | ☐ | |  |
| 0:34 | coin | 3 | `variants/coin/coin-03.mp3` | 1,4 s | ☐ | ☐ | ☐ | |  |
| 0:36 | coin | 4 | `variants/coin/coin-04.mp3` | 0,7 s | ☐ | ☐ | ☐ | |  |
| 0:38 | coin | 5 | `variants/coin/coin-05.mp3` | 0,6 s | ☐ | ☐ | ☐ | |  |
| 0:40 | error | 1 | `error.mp3` | 0,5 s | ☐ | ☐ | ☐ | |  |
| 0:42 | error | 2 | `variants/error/error-02.mp3` | 0,5 s | ☐ | ☐ | ☐ | |  |
| 0:44 | error | 3 | `variants/error/error-03.mp3` | 1,0 s | ☐ | ☐ | ☐ | |  |
| 0:46 | error | 4 | `variants/error/error-04.mp3` | 1,0 s | ☐ | ☐ | ☐ | |  |
| 0:48 | error | 5 | `variants/error/error-05.mp3` | 1,0 s | ☐ | ☐ | ☐ | |  |
| 0:50 | riser | 1 | `riser.mp3` | 2,0 s | ☐ | ☐ | ☐ | |  |
| 0:52 | riser | 2 | `variants/riser/riser-02.mp3` | 1,8 s | ☐ | ☐ | ☐ | |  |
| 0:54 | riser | 3 | `variants/riser/riser-03.mp3` | 2,0 s | ☐ | ☐ | ☐ | |  |
| 0:56 | riser | 4 | `variants/riser/riser-04.mp3` | 2,0 s | ☐ | ☐ | ☐ | |  |
| 0:58 | riser | 5 | `variants/riser/riser-05.mp3` | 2,0 s | ☐ | ☐ | ☐ | |  |

## Atenção especial

- **coin opção 1 (0:30, `coin.mp3`, arquivo original)** — já apontado como possível **chiado**. Ouça duas vezes, de fone, e anote: chiado/ruído de fundo (sim/não), se aparece no ataque, no meio ou na cauda, e se o volume está alto em relação a coin 2–5. Ele recebe o maior ganho do teste (volume final 60% contra 15–36% das outras coins), o que pode realçar ruído do arquivo.
  - Chiado: ☐ não  ☐ sim — onde: ______________________
- **riser 1, 3, 4, 5 (0:50, 0:54, 0:56, 0:58)** — o trecho vai até o limite dos 2 s. Confira se o fade acontece antes da troca de tela e, no 0:58, antes do fim do vídeo.
- **whoosh opção 3 (0:24)** — também com ganho alto (60%); confirme que não estoura nem chia.

## Resumo

Falhas (marca + motivo): ______________________________________________

Família com volume desigual: ______________________________________________

Opção preferida por família: pop __ · ding __ · whoosh __ · coin __ · error __ · riser __
