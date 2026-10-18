---
name: montagem-video-pantera
description: Monta vídeos do canal Aprenda YouTube em Remotion a partir de um roteiro .md marcado, um áudio MP3 da voz do Rod e assets enviados por ele. Use quando o Rod pedir para montar, renderizar ou gerar preview de um vídeo do canal, ou mencionar roteiro marcado, pantera ou /montar.
---

# Montagem de vídeo — Aprenda YouTube (pantera)

Pipeline fixo. Siga as etapas na ordem e não pule nenhuma.

## Estrutura do projeto

```
~/aprenda-youtube-video/
  src/
    Root.jsx
    theme.js
    components/   Stage, Card, Badge, Title, Panther, Sfx
    templates/    um arquivo por template de cena
    Episode.jsx   lê episodes/<slug>/timeline.json e monta as cenas
  public/
    pantera/      feliz, triste, surpresa, comemorando, pensando, apontando (.png)
    sfx/          pop, ding, whoosh, coin, error, riser (.mp3)
    music/        trilhas de fundo
    episodes/<slug>/  voz.mp3, roteiro.md, assets do Rod, words.json, timeline.json
  scripts/
    transcribe.py     faster-whisper com word_timestamps → words.json
    align.js          roteiro.md + words.json → timeline.json
  out/
```

## Etapa 1 — Receber o episódio

1. Confirme que existe `public/episodes/<slug>/` contendo `roteiro.md` e `voz.mp3`.
2. Leia a seção `## ASSETS_DO_ROD` do roteiro e confira se cada arquivo listado está na pasta.
3. Se faltar algum arquivo, pare e liste exatamente o que falta. Não invente substitutos.

## Etapa 2 — Transcrever com tempo por palavra

```
python3 scripts/transcribe.py public/episodes/<slug>/voz.mp3
```

- Modelo: `faster-whisper` `medium`, idioma `pt`, `word_timestamps=True`.
- Saída: `words.json` no formato `[{ "w": "palavra", "start": 1.23, "end": 1.51 }]`.

## Etapa 3 — Alinhar roteiro e áudio

```
node scripts/align.js <slug>
```

1. Para cada bloco `### Cxx` do roteiro, localize o campo `fala:` dentro de `words.json` usando correspondência aproximada: normalize acentos e pontuação e aceite pequenas diferenças da transcrição.
2. `start` da cena = início da primeira palavra da fala. `end` = início da cena seguinte.
3. Os eventos internos (`ao: "palavra"`) recebem o tempo dessa palavra dentro da fala.
4. Converta tudo para frames a 30 fps e grave `timeline.json`.
5. Se alguma fala não for encontrada, informe o ID da cena e o trecho. Não chute tempo.

## Etapa 4 — Montar as cenas

- `Episode.jsx` percorre `timeline.json` e renderiza o template de cada cena com os `dados` e a `pose` indicados.
- Templates disponíveis: `titulo-impacto`, `checklist-cards`, `contador`, `grafico-barras`, `studio-mockup`, `comparacao`, `lista-numerada`, `analogia`, `print`, `gravacao-tela`, `cta`.
- Template inexistente no roteiro: crie o componente novo em `templates/` seguindo `theme.js` e avise o Rod.
- Pose: troque o PNG com um pop de escala (spring de cerca de 6 frames) e toque `sfx/pop.mp3`.
- Toda entrada de card, badge ou número tem SFX sincronizado.
- Música de fundo a −24 dB sob a voz, com fade in e fade out.

## Etapa 5 — Preview

```
yarn remotion render src/Root.jsx Episode out/<slug>-preview.mp4 --scale=0.5 --props=public/episodes/<slug>/props.json
```

Avise o Rod que o preview está pronto e aguarde aprovação ou ajustes. Não faça o render final sem aprovação.

## Etapa 6 — Render final

```
yarn remotion render src/Root.jsx Episode out/<slug>.mp4 --props=public/episodes/<slug>/props.json
```

Ao terminar, informe o caminho do arquivo, a duração e o tempo de render.

## Regras visuais (theme.js)

- Fundo: radial `#140B2E` → `#05040C`, manchas de luz roxa e dourada se movendo, spotlight e chão.
- Cores: violeta `#8B5CF6` e `#C084FC`, dourado `#FBBF24`, vermelho `#FB4B6B`, verde `#34D399`, texto `#F5F3FF`.
- Fonte: Montserrat ou Poppins 900, títulos em caixa alta.
- Cards: vidro em degradê com borda e glow da cor do contexto.
- Ritmo: algum elemento muda a cada 1,5 a 3 segundos. Nenhuma cena fica parada por mais de 3 segundos.
- A pantera nunca é espelhada (o boné tem lado fixo). A pose `apontando` aponta para a esquerda, então o alvo fica à esquerda dela.

## Comandos

- Use `yarn`, nunca `npm`.
- Um comando por linha. Nunca encadeie comandos com `&&`.
