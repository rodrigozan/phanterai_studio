# phanterai_creative_agency

Repositório único com duas partes:

1. **Biblioteca de skills do Claude Code** (`.claude/skills/`) para o canal de YouTube
   "Aprenda YouTube" (mascote: a pantera / "pantera"), de Rodrigo Zandonadi.
2. **Projeto Remotion** (`src/`, `public/`, `scripts/` na raiz) que essas skills operam para
   montar os vídeos do canal a partir de roteiro + voz + assets.

Se você só quer renderizar um vídeo de um episódio já preparado, vá direto para
[Guia passo a passo: montar um episódio](#guia-passo-a-passo-montar-um-episódio).

---

## Especificações técnicas

| Item | Valor |
|---|---|
| Engine de vídeo | [Remotion](https://remotion.dev) `^4.0.536` |
| UI | React `^19.3.1` / react-dom `^19.3.1` |
| Fontes | `@remotion/google-fonts` (Poppins 900) |
| Gerenciador de pacotes | Yarn **Berry** (`4.18.0`), `nodeLinker: node-modules` |
| Resolução de saída | 1920×1080 (Full HD) |
| Frame rate | 30 fps |
| Transcrição | `faster-whisper` (modelo `medium`, idioma `pt`, `word_timestamps=True`), via Python 3 |
| Alinhamento roteiro↔áudio | `scripts/align.js`, Node puro, sem dependências |
| Testado com | Node `v26.7.0`, Yarn `4.18.0`, Python `3.12.3` |

### Por que Yarn com `nodeLinker: node-modules`

O Plug'n'Play (PnP) padrão do Yarn Berry **não funciona** com os binários nativos do
compositor do Remotion e do Chrome headless usados no render. Por isso o `.yarnrc.yml` força
`nodeLinker: node-modules`. Não remova esse override nem reintroduza arquivos `.pnp.*`.

### Estrutura do repositório

```
.claude/skills/              skills do Claude Code (uma pasta por skill, com SKILL.md)
  montagem-video-pantera/    pipeline de montagem de vídeo (este README cobre o uso)
  yt-audit/ yt-chapters/ yt-comment/ yt-edit/ yt-package/ yt-plan/
  yt-retention/ yt-script/ yt-seo/ yt-shorts/ yt-viral/
                              skills de estratégia de canal (sem vídeo), ver tabela abaixo

src/
  Root.jsx                   entry point do Remotion — registra a composition "Episode"
                              (1920x1080, 30fps) e usa calculateMetadata para dimensionar
                              o vídeo a partir de public/episodes/<slug>/timeline.json
  Episode.jsx                percorre timeline.json, renderiza cada cena num <Sequence>
                              com o template de templates/index.js, mixa voz.mp3 + música
  theme.js                   cores, fontes, volume de música, listas de poses/sfx válidas
  components/                Stage (fundo), Card, Badge, Title, Panther, Sfx
  templates/                 um arquivo por template de cena (ver lista abaixo) + index.js
                              (registro nome-no-roteiro -> componente)

public/
  pantera/                   PNGs da mascote (poses), fundo transparente — ver README local
  sfx/                       efeitos sonoros curtos (.mp3) — ver README local
  music/                     trilhas de fundo (.mp3) — ver README local
  episodes/<slug>/           uma pasta por episódio (roteiro.md, voz.mp3, assets do Rod;
                              words.json e timeline.json são gerados e gitignored)

scripts/
  transcribe.py              faster-whisper -> words.json (transcrição com tempo por palavra)
  align.js                   roteiro.md + words.json -> timeline.json (sem dependências)
  requirements.txt           dependências Python (faster-whisper)

out/                         vídeos renderizados (gitignored)
```

### Templates de cena disponíveis

Registrados em `src/templates/index.js`, usados no roteiro via `template: <nome>`:

| Nome no roteiro | `dados` | Eventos próprios |
|---|---|---|
| `titulo-impacto` | `titulo`, `subtitulo?`, `destaque?` | `zoom-mascote` |
| `checklist-cards` | `itens` (texto ou `{ texto, feito }`) | `card-N`, `check-N`, `riscar-item-N` |
| `contador` | `de?`, `ate`, `rotulo` | `contar` |
| `grafico-barras` | `barras: [{ rotulo, valor }]` | `crescer-barra-N` |
| `studio-mockup` | `videos`/`thumbs`, `iguais?`, `layout?`, `embaralhar?` (ou `imagem`) | `clonar-cards`, `entrar-thumbs`, `embaralhar` |
| `comparacao` | `esquerda`/`direita: { titulo, valor }` | `destacar-esquerda`, `destacar-direita` |
| `lista-numerada` | `itens`, `ativo?` | `destacar-N`, `destacar-todos` |
| `analogia` | `imagem?`, `emoji?`, `titulo?`, `texto?` (sem eles, a fala vira texto animado) | palavra de cada evento acende |
| `print` | `arquivo`, `legenda?`, `recorte?`, `borrar?` | `zoom-print` |
| `gravacao-tela` | `arquivo`, `legenda?`, `recorte?`, `borrar?`, `inicio?` (s), `velocidade?` | `zoom-tela` |
| `cta` | `botao?`, `pergunta?`, `titulo?` | `clicar-botao`, `balao-comentario` |

N começa em 1. Em qualquer template valem também `carimbo-vermelho`, `carimbo-verde`, `tremer`,
`zoom-in`, `brilho`, `lupa`, `relogio-girando`, `sirene` e `riscar` (`src/components/Acoes.jsx`),
e todo evento toca um SFX (`sfxDaAcao` em `src/components/eventos.js`).

`recorte` e cada área de `borrar` são `{ x, y, w, h }` em % do arquivo original; `arquivo` é o
nome dentro de `public/episodes/<slug>/`. O borrão é fixo na tela: numa gravação que rola, o
conteúdo sai de baixo dele.

Template novo: crie o arquivo em `src/templates/` seguindo `theme.js` e registre-o em
`templates/index.js`.

### Identidade visual (`src/theme.js`)

- Fundo: radial `#140B2E` → `#05040C`, manchas de luz roxa e dourada em movimento, spotlight e chão.
- Cores: violeta `#8B5CF6` / `#C084FC`, dourado `#FBBF24`, vermelho `#FB4B6B`, verde `#34D399`, texto `#F5F3FF`.
- Fonte: Poppins, peso 900, títulos em caixa alta.
- Cards em vidro com degradê, borda e glow na cor do contexto da cena.
- Ritmo: algo muda na tela a cada 1,5–3s; nenhuma cena fica estática por mais de 3s.
- A pantera (mascote) **nunca é espelhada** — o boné tem lado fixo. Na pose `apontando`, ela
  aponta para a esquerda, então o alvo da cena deve ficar à esquerda dela.
- Música de fundo a **−24 dB** sob a voz (`MUSIC_VOLUME = 0.063` em `theme.js`), com fade in/out.

### Assets esperados (fornecidos pelo Rod, não versionados aqui)

- `public/pantera/*.png` — uma pose por arquivo, nomes exatos: `feliz`, `triste`, `surpresa`,
  `comemorando`, `pensando`, `apontando`.
- `public/sfx/*.mp3` — nomes exatos: `pop` (entrada/troca de pose), `ding` (checklist OK),
  `whoosh` (item de lista numerada), `coin` (contador subindo), `error` (checklist não feito),
  `riser` (abertura de cena de impacto/CTA).
- `public/music/*.mp3` — trilhas de fundo, referenciadas pelo campo `musica:` do roteiro.

Se um arquivo esperado não existir, `Episode.jsx`/`Panther`/`Sfx` lançam erro explícito — nunca
monte um placeholder no lugar.

### Skills de estratégia de canal (sem vídeo)

Essas skills são só-instrução (sem script), exceto onde indicado — operam sobre texto/CSV que
você cola ou aponta, não sobre o projeto Remotion:

| Skill | Para que serve | Script auxiliar |
|---|---|---|
| `yt-audit` | Auditoria completa do canal (packaging, consistência, 15s iniciais) | — |
| `yt-chapters` | Capítulos a partir de transcrição, validados pelas regras do YouTube | `yt-chapters/chapters.py` |
| `yt-comment` | Respostas a comentários na voz do criador, triadas | — |
| `yt-edit` | EDL (dead air, cortes, retakes) a partir de transcrição | `yt-edit/deadair.py` |
| `yt-package` | Título + thumbnail como um par, com lint de truncamento/duplicação | `yt-package/title.py` |
| `yt-plan` | Calendário de upload semanal/mensal | — |
| `yt-retention` | Pontos de queda de retenção a partir de export do YouTube Studio | `yt-retention/retention.py` |
| `yt-script` | Roteiro completo com hook pontuado (21 fórmulas) e beats de retenção | `yt-script/hookscore.py` |
| `yt-seo` | Descrição, tags e texto de busca | — |
| `yt-shorts` | Encontra e escreve Shorts dentro de um vídeo longo | — |
| `yt-viral` | Ranking de concorrentes por múltiplo da própria mediana do canal | `yt-viral/swipe.py` |

Esses scripts rodam direto: `python3 .claude/skills/<skill>/<script>.py <args>`.

---

## Guia passo a passo: montar um episódio

Este é o fluxo completo da skill `montagem-video-pantera`, do zero ao `.mp4` final.

### 0. Pré-requisitos (uma vez só)

```bash
# Node e Yarn já vêm do ambiente; instale as dependências JS:
yarn install

# Ambiente Python para transcrição:
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements.txt
```

### 1. Preparar a pasta do episódio

Crie `public/episodes/<slug>/` e coloque dentro:

- `roteiro.md` — o roteiro marcado (ver [formato abaixo](#formato-do-roteiromd))
- `voz.mp3` — o áudio gravado da voz do Rod
- qualquer asset citado na seção `## ASSETS_DO_ROD` do roteiro (prints, vídeos de tela)

Confira que **todo arquivo listado em `## ASSETS_DO_ROD` existe de fato** na pasta antes de
seguir. Se faltar algo, pare aqui e resolva — não existe placeholder.

### 2. Transcrever a voz com tempo por palavra

```bash
.venv/bin/python scripts/transcribe.py public/episodes/<slug>/voz.mp3
```

Gera `public/episodes/<slug>/words.json`, no formato:

```json
[{ "w": "palavra", "start": 1.23, "end": 1.51 }]
```

### 3. Alinhar roteiro + áudio em timeline

```bash
node scripts/align.js <slug>
```

Lê `roteiro.md` + `words.json` e grava `public/episodes/<slug>/timeline.json` (tudo já
convertido para frames a 30fps). Para cada bloco `### Cxx`:

- localiza o campo `fala:` dentro de `words.json` por correspondência aproximada (acentos e
  pontuação normalizados, tolera pequenas diferenças da transcrição);
- `start` da cena = início da primeira palavra da fala; `end` = início da cena seguinte;
- cada item de `eventos:` recebe o frame exato da palavra em `ao`, relativo ao início da cena
  (palavra não encontrada também para o script).

Se uma `fala:` não for encontrada no áudio, o script **para e informa a cena e o trecho** — ele
nunca chuta um tempo. Corrija o roteiro ou a transcrição e rode de novo.

### 4. Gerar o `props.json` do episódio

```json
{ "slug": "<slug>" }
```

Salve em `public/episodes/<slug>/props.json`. É o que diz ao Remotion qual episódio renderizar.

### 5. Preview rápido

```bash
yarn remotion render src/Root.jsx Episode out/<slug>-preview.mp4 \
  --scale=0.5 \
  --props=public/episodes/<slug>/props.json
```

`--scale=0.5` renderiza em metade da resolução, bem mais rápido, só para validar timing, cores
e sincronismo de SFX antes do render final.

Alternativa interativa (recomendada para ajustar cena a cena):

```bash
yarn studio
```

Abre o Remotion Studio (`remotion studio src/Root.jsx`) com player e scrubber.

### 6. Render final

Só depois de aprovar o preview:

```bash
yarn remotion render src/Root.jsx Episode out/<slug>.mp4 \
  --props=public/episodes/<slug>/props.json
```

O arquivo final sai em `out/<slug>.mp4`, 1920×1080 a 30fps.

### Formato do `roteiro.md`

Grammar completa documentada no cabeçalho de `scripts/align.js` — é a fonte de verdade; se você
mudar o parser, atualize esse comentário também. Resumo:

```markdown
musica: trilha.mp3                (opcional; public/music/, em loop, sobe nas pausas da fala)
musica_fim: 163.5                 (opcional; onde o loop volta, antes do fade out da faixa)

## CENAS

### C01 | template: titulo-impacto | pose: surpresa
fala: "Primeiro de fevereiro de 2027. Anota essa data."
dados: { titulo: "01/02/2027", subtitulo: "anota essa data" }
eventos: [{ ao: "Anota", acao: "carimbo-vermelho" }]

### C01b | template: checklist-cards | pose: pensando
fala: "Não é bug. Não é azar."
dados: { itens: ["Bug", "Azar"] }
eventos: [{ ao: "bug", acao: "riscar-item-1" }, { ao: "azar", acao: "riscar-item-2" }]

## ASSETS_DO_ROD
- `print-01.png`: o que printar
```

É o mesmo formato que a skill `pauta-roteiro-aprenda-youtube` entrega, então o roteiro pode vir
de lá ou ser escrito aqui. Só a seção `## CENAS` é lida pelo `align.js`.

- `### <id> | template: <nome> | pose: <pose>` — id livre começando com `C` (`C04`, `C04a`,
  `C55b`); a ordem das cenas é a ordem no arquivo. `template` é um dos nomes da
  [tabela de templates](#templates-de-cena-disponíveis); `pose`, uma das poses em `public/pantera/`.
- `fala:` — trecho literal da narração, entre aspas duplas; usado para localizar o tempo no
  `words.json`.
- `dados:` — objeto em sintaxe de JS (chaves sem aspas, strings em aspas duplas), passado ao
  template como `dados`. Opcional.
- `eventos:` — array de `{ ao: "<palavra da fala>", acao: "<acao>" }`; cada um ganha o frame
  daquela palavra, relativo ao início da cena. Opcional.

### Usando as skills via Claude Code

Em vez de rodar os comandos manualmente, você pode simplesmente pedir ao Claude Code (ou digitar
`/montar`) para montar/renderizar/pré-visualizar o vídeo de um slug — a skill
`montagem-video-pantera` segue exatamente essas etapas, na ordem, e para sozinha se faltar algum
asset ou se uma fala não alinhar.

### Checklist de erros comuns

| Sintoma | Causa provável |
|---|---|
| `Episode.jsx`/`Panther`/`Sfx` lança erro de pose/sfx inexistente | nome usado no roteiro não bate com os arquivos em `public/pantera/` ou `public/sfx/` (confira os READMEs dessas pastas) |
| `align.js` para informando cena + trecho | a `fala:` daquele bloco não foi encontrada em `words.json` — revise o roteiro ou regrave/retranscreva o trecho |
| Vídeo abre em frame de placeholder no Studio | `slug` vazio ou `public/episodes/<slug>/timeline.json` ainda não existe — rode as etapas 2–3 |
| Render muito lento | use `--scale=0.5` para preview; o render final sem `--scale` é mais lento por natureza |
