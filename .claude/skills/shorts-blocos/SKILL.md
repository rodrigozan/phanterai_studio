---
name: shorts-blocos
description: Cria Shorts/Reels animados com personagens estilo blocos (Remotion 60fps, vozes ElevenLabs, auditoria de retenção). Use quando o Rod pedir "faz um short de blocos", "short estilo jogo de blocos", "episódio novo do shorts-blocos", "e se a mãe/vó/professor começasse a...", ou /shorts-blocos.
---

# shorts-blocos

Pipeline de Shorts 1080x1920 a 60fps com personagens estilo blocos, totalmente em código. Marca `shorts-blocos`: código em `marcas/shorts-blocos/src/`, episódios em `public/shorts-blocos/episodes/<slug>/`, render em `out/shorts-blocos/<slug>.mp4`.

Visual só "estilo blocos". Nada de marca, logo, nome ou personagem oficial de jogo de terceiros, nem no roteiro, nem no título, nem nas tags. Isso protege o canal de strike e de desmonetização.

Comandos sempre com yarn, um por linha.

## Fluxo (delegado por subagente)

A sessão principal só orquestra (`claude --model sonnet`). Cada etapa vai para o subagente certo em `.claude/agents/`:

| Etapa | Subagente |
|---|---|
| 1–3 Pesquisa, roteiro, decupagem | `roteirista` |
| 4 TTS, timing, render | `operador` |
| 5 Auditoria | `auditor` |
| Reprovação visual (ritmo, enquadramento) | `animador`, depois `operador` renderiza de novo |

### 1. Pesquisa
vidIQ MCP `vidiq_outliers` (Shorts, nicho comédia/família/animação). Pegue vídeos com views muito acima dos inscritos do canal. Extraia **só o esqueleto**: gancho, escalada, reviravolta. Nunca copie texto, falas ou personagens. Registre o esqueleto escolhido em `references/formatos.md` se for novo.

### 2. Roteiro
Leia antes `references/personagens.md` (bíblia da Família Quadrada): só os 4 personagens fixos, com os nomes, cores e bordões de lá, e a pauta dos 10 primeiros episódios. História inédita, adaptada ao Brasil, usando `references/expressoes-br.md`. Escalada de **5 dias** com absurdo crescente, reviravolta final, e a última fala emendando na primeira (loop). Se houver afirmação factual (número, data, nome real), verifique na web e liste as fontes no roteiro.

### 3. Decupagem
Gere `public/shorts-blocos/episodes/<slug>/scenes.json` no contrato de `marcas/shorts-blocos/src/schema/scenes.ts`, respeitando `references/metas.md`. A música de cada cena segue a skill `familia-quadrada-musica` (só as 4 faixas fixas). Regras práticas que fazem a auditoria passar de primeira:
- Primeira fala: personagem principal em `close`, cena igual à última (mesmo `setting`, `cast`, sem `props`).
- Cada fala com 2–4 `visualBeats` (`punchIn`, `cut` com plano, `shake`, `expression`, `pan`) amarrados a palavras do texto.
- Pelo menos um terço das falas em `close`.
- Narrador: `voiceId: "$NARRATOR"` (voz clonada do `.env`) e `focusCharacterId` para dizer quem aparece.
- SFX só os que existem em `public/sfx/` (`whoosh`, `pop`, `ding`, `coin`, `error`, `riser`).
- `ctaComment` é uma palavra só. Pedido de inscrição é proibido.

Valide:
```
yarn blocos <slug> --validate
```

### 4. Áudio, timing e render
```
yarn blocos <slug>
```
Faz TTS (com cache por hash), `timing.json`, `props.json`, render e auditoria. Para preview rápido: `yarn blocos <slug> --preview`. Só áudio e timing: `--no-render`.

### 5. Auditoria
`audit.json` fica na pasta do episódio. Saída 2 = reprovado. Erro de roteiro ou de beats volta para o `roteirista`; erro de animação ou de enquadramento vai para o `animador`. No máximo 3 iterações, depois pare e reporte as métricas.

`volumeDrops` é só aviso (`AVISO` no log, lista `warnings` no `audit.json`): não reprova, não para o episódio e nunca justifica reescrever fala. Anote o tempo no `pos-publicacao.md` e siga.

Áudio do ElevenLabs é caro. Nenhuma correção de auditoria pode mudar o texto de uma fala já gerada (isso invalida o cache e gera TTS de novo). Corrija com beats, planos, SFX ou timing.

Quando o Rod pedir um episódio, faça o episódio inteiro, da pesquisa à entrega, sem parar para perguntar.

### 6. Entrega
Na pasta `marcas/shorts-blocos/videos/<slug>/`:
- `roteiro.md`: roteiro cena a cena (dia, cenário, quem fala, fala, plano, beats).
- `narracao.md`: só a narração em parágrafos corridos, sem título nem nenhum outro texto.
- `pos-publicacao.md`: o checklist abaixo, com a data de conferência (publicação + 48h).

Entregue `out/shorts-blocos/<slug>.mp4`, o `audit.json` e 3–5 sugestões de título (sem nome de jogo).

## Pós-publicação (48h)
1. Continuou assistindo vs. deslizou: meta > 80%. Baixo → refazer gancho e primeiro frame.
2. Porcentagem visualizada média: meta perto de 100%. Baixa → revisar loop e ritmo.
3. Retenção boa e vídeo não escala → reforçar o CTA de comentário.
Use a skill `yt-retention` com o CSV exportado do YouTube Studio para achar as quedas segundo a segundo.

## Distribuição
O mesmo mp4 vai para YouTube Shorts e Instagram Reels. Publicar via vidIQ MCP só com aprovação do Rod antes de cada post.
