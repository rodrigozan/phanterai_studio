# Palitempo — pipeline de vídeos de história com bonecos palito

Canal de YouTube no formato **"A HISTÓRIA INTEIRA de X em N minutos"**: 10–14 min, 16:9, narração PT-BR,
bonecos palito. Primeiro vídeo: **Egito Antigo** (`videos/egito/`).

## Regras que valem em toda sessão
1. **Chaves**: só por variável de ambiente. Fonte única: `/root/phanterai_studio/.env`
   (`ELEVENLABS_API_KEY`, `ELEVENLABS_STORY_NARRATOR_VOICE_ID`, `GOOGLE_AI_STUDIO`). `scripts/common.py` carrega
   só esses prefixos. NUNCA imprimir, logar nem commitar as chaves; não copiar o .env para cá.
2. **Aprovação ao fim de CADA etapa.** Parar e pedir o OK do Rod antes de seguir. Nada de API paga
   (ElevenLabs/Gemini) antes de ele aprovar a etapa anterior; a etapa 5 (elenco) é a primeira que gasta.
3. **Voz**: sempre o mesmo `voice_id` (config.json) e **somente o modelo `eleven_v4`**. Não trocar de modelo.
4. **Imagens**: todo prompt começa com o PROMPT DE ESTILO (`config.json → estilo`) e leva as referências de
   `elenco/<personagem>.png` das cenas. Modelo configurável em `config.json → imagem.modelo`.
5. **Fatos**: só entra no roteiro o que tem fonte confiável (museus, universidades, enciclopédias) em
   `01_pesquisa.md`. O que for contestado vai marcado como contestado. Fato sem fonte não entra.
6. Scripts são **idempotentes** (pulam o que existe; `--force` refaz). Testar sempre com `--limit`/`--only`
   e `--dry-run` antes de rodar tudo.
7. Antes de escrever código de API novo, conferir a documentação atual (endpoint e nome de modelo mudam).
8. Música: Rod fornece `audio/musica.mp3` (livre de direitos). Não gerar nem baixar música.
9. Upload no YouTube é manual por enquanto.
10. Tudo que mudar no projeto também vai para o Obsidian (`projetos/palitempo.md`), no mesmo turno.

## Estilo (PROMPT DE ESTILO)
Classic 2D stickman cartoon, clean thick black line art, round white head, simple expressive face, flat warm
colors, simple but cinematic background, high readability, no text, 16:9.

## Elenco do Egito
narrador (chapéu de explorador marrom) · farao (nemes listrado azul e dourado, barba postiça) ·
sacerdote (cabeça raspada, manto branco) · campones (tanga branca, cesto) · escriba (papiro e pena) ·
soldado (escudo de couro, lança). Descrições completas em `config.json → elenco`.

## Estrutura
```
config.json            voz, modelos, estilo, elenco, parâmetros de render
scripts/               common.py tts.py imagens.py elenco.py manifest.py kenburns.py srt.py
elenco/                <personagem>.png (referências aprovadas)
videos/<slug>/         01_pesquisa.md 02_roteiro.md cenas.json vo/ img/ clips/ audio/ manifest.json out/ publicacao.md
videos/_teste/         material sintético só para testar o render (não é vídeo real)
```

## cenas.json
`[{ "id": "s001", "texto": "...", "personagens": ["farao"], "prompt": "descrição visual", "efeito": "auto" }]`
Cenas de 1–2 frases (5–8 s). `efeito`: auto | zoom_in | zoom_out | pan_left | pan_right | pan_up | pan_down | static.
Se existir `clips/sNNN.mp4`, o render usa o clipe no lugar da imagem.

## Fluxo (parar e pedir aprovação a cada etapa)
1. Tema e título → `/yt-viral` (se houver dados) e `/yt-plan`
2. Pesquisa → `01_pesquisa.md`
3. Roteiro → `/yt-script` (5 hooks, Rod escolhe), ~1.700–1.900 palavras, virada a cada 30–60 s → `02_roteiro.md`
4. Cenas → `cenas.json`
5. Elenco → `python3 scripts/elenco.py` → Rod aprova
6. Voz → `python3 scripts/tts.py videos/egito --limit 3` → Rod aprova a voz → rodar o resto
7. Imagens → `python3 scripts/imagens.py videos/egito --limit 5` → Rod aprova → rodar o resto
8. Música → Rod coloca `audio/musica.mp3`
9. Render → `scripts/manifest.py` + `scripts/kenburns.py`; teste com `--limit 10`, depois o completo
10. Publicação → `scripts/srt.py` + `/yt-package`, `/yt-seo`, `/yt-chapters` (sobre o .srt) → `publicacao.md`

## Comandos
```
python3 scripts/elenco.py [--only farao] [--force] [--dry-run]
python3 scripts/tts.py videos/egito [--limit N] [--only s001,s002] [--force] [--dry-run]
python3 scripts/imagens.py videos/egito [--limit N] [--only s001] [--force] [--dry-run]
python3 scripts/manifest.py videos/egito
python3 scripts/kenburns.py videos/egito/manifest.json [--limit 10] [--jobs 4] [--force]
python3 scripts/srt.py videos/egito
```
