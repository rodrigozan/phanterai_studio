---
name: familia-quadrada-musica
description: "Trilhas fixas do canal Família Quadrada (vídeos de Roblox): qual das 4 músicas usar em cada momento do Short, volumes, ducking e loop. Use ao montar scenes.json ou o áudio de qualquer episódio."
---

# Família Quadrada — Referência de Música

O canal usa **somente estas 4 faixas** como música de fundo. Não buscar, gerar ou trocar por outras sem ordem explícita do Rod.

## Arquivos

Salvar em `public/afamiliaquadrada/music/` com estes nomes:

| Id | Arquivo | Título original | Papel |
|---|---|---|---|
| `tema` | `public/afamiliaquadrada/music/whistle-and-bounce.mp3` | Whistle & Bounce | Tema principal: ukulele, assobio, 115 BPM |
| `travessura` | `public/afamiliaquadrada/music/tiptoe-and-trouble.mp3` | Tiptoe & Trouble | Travessura: pizzicato, fagote, 110 BPM |
| `escalada` | `public/afamiliaquadrada/music/slapstick-dash.mp3` | Slapstick Dash | Caos e perseguição: cordas staccato, tuba, 130 BPM |
| `brasil` | `public/afamiliaquadrada/music/tamborzao-mischief.mp3` | Tamborzão Mischief | Funk leve brasileiro: tamborzão, cavaquinho, 125 BPM |

Se algum arquivo não existir, parar e pedir ao Rod. Nunca substituir.

## Marcação por momento do episódio

| Momento | Faixa | Observação |
|---|---|---|
| Gancho (0–3s) | `tema` | Entra já no frame 0 com um SFX de impacto por cima |
| Dia 1 e Dia 2 | `tema` | Situação ainda "normal" |
| Dia 3 | `travessura` | A loucura começa. Trocar no selo "DIA 3" |
| Dia 4 e Dia 5 | `escalada` | Máximo absurdo. Trocar no selo "DIA 4" |
| Reviravolta | silêncio de 0,4–0,6s + SFX (record scratch ou "ding") e depois volta `escalada` | O único silêncio musical permitido |
| CTA e final | `tema` | Volta ao tema para o loop emendar no frame 0 |

### Exceções por enredo

- **Plano ou segredo** (mãe tramando, interrogatório, alguém escondendo algo): `travessura` no lugar de `tema` nos dias 1–2.
- **Festa, churrasco, dancinha, publi, fama, futebol, viagem**: `brasil` no lugar de `escalada` nos dias 4–5.
- **Episódio de família completa (especial)**: `tema` → `brasil` → `escalada` → `tema`.
- Máximo de 3 faixas diferentes por episódio.

## Mixagem

- Volume base da música: -18 LUFS aprox. (bem abaixo das vozes).
- Ducking: -10 dB sob as falas, ataque de 80 ms e release de 250 ms.
- Nunca zerar a música, exceto no silêncio da reviravolta.
- Troca de faixa: crossfade de 6 a 10 frames (60fps), sempre no frame do selo "DIA X" ou do corte.
- Começar cada faixa a partir de um tempo forte (início de compasso), nunca no meio de uma frase musical.
- Voz em -14 LUFS integrado no master final.

## Loop

- O último segundo do vídeo usa `tema` no mesmo volume e na mesma posição de compasso em que o vídeo começa.
- Calcular o offset inicial da faixa para que o fim do episódio caia num ponto que emende com o frame 0.

## Schema

No `scenes.json`, cada cena ganha:

```json
"music": {
  "track": "tema" | "travessura" | "escalada" | "brasil" | "none",
  "transition": "crossfade" | "cut" | "stop"
}
```

`none` só é permitido na reviravolta. O auditor reprova o episódio se:

- aparecer qualquer faixa fora destas 4;
- houver mais de 3 faixas no episódio;
- houver silêncio musical fora da reviravolta;
- a faixa final não for `tema`.

## Como o código aplica

Implementado em `marcas/afamiliaquadrada/src/schema/music.ts` (regras, ganho e plano de faixas), `remotion/audio/AudioBed.tsx` (mixagem) e `pipeline/audit.ts` (métrica `music`).

- **`music` é opcional por cena.** Sem ele, a faixa sai automaticamente pela tabela acima: primeira e última cena `tema`, a cena que abre o DIA 3 `travessura`, a que abre o DIA 4 `escalada`, e as outras herdam a anterior. Só escreva `music` para as exceções de enredo e para a reviravolta.
- **Reviravolta:** marque a cena com `"track": "none"`. A música para no início da cena, fica 30 frames (0,5s) em silêncio e volta com a faixa que tocava antes, a partir do começo. Ponha o SFX da reviravolta (`sfx` da primeira fala) nesse intervalo.
- **Crossfade** de 8 frames no início da cena (o frame do selo "DIA X"). `cut` e `stop` usam uma micro-rampa de 2 frames para não estalar.
- **Tempo forte:** cada faixa entra a partir do primeiro tempo forte (`downbeat` em `TRACKS`; o `tema` tem 1,39s de silêncio no começo do arquivo, que é pulado).
- **Volume:** o código toca as cópias de `public/afamiliaquadrada/music/nivelado/` (nível achatado, receita no README da pasta), e o ganho de cada faixa leva o arquivo a -18 LUFS (`lufs` medido em `TRACKS`; se refizer a cópia, meça de novo com `ffmpeg -i x.mp3 -af ebur128 -f null -`). Ducking de -10 dB, ataque de 5 frames e release de 15.
- **Loop:** quando abre e fecha com `tema`, o frame 0 começa o `tema` na mesma posição de compasso em que o final termina.
- Uma faixa com o mesmo id em cenas seguidas continua tocando, sem reiniciar.
- O campo antigo `music` do episódio (`bed.mp3`) não existe mais e é ignorado.
- **Auditoria:** a métrica `volumeDrops` não conta quedas dentro do trecho da `travessura` (as pausas do pizzicato fazem parte do estilo) nem no silêncio da reviravolta. Fora disso, a regra de nenhuma janela 10 dB abaixo da média continua valendo.
