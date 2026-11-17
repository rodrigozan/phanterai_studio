# THE BLACK BOY WHO CHEERED FOR HITLER - THEN SURVIVED NAZI GERMANY

Canal Afro WW2 Tales (@AfroWW2Tales). Slug `massaquoi-hamburg`. Narração em inglês; comunicação com o Rod em português.
Trabalho em `out/afro-ww2-tales/massaquoi-hamburg/` (`input/ sync/ work/ qa/`). Publicação só após aprovação do Rod.

## Insumos (já no studio, não baixar do Drive)
Atualização do Rod (17/11): insumos já estão em `public/afro-ww2-tales/`:
- Episódio do dia: `public/afro-ww2-tales/episodes/2026-11_17/{Narration/audio.mp3, Images/*.jpg}` (26 imagens: 01–24, 20_B e BASE.jpg, que não consta do briefing)
- Músicas, comuns a todos os vídeos do canal: `public/afro-ww2-tales/musics/*.mp3`
- Se não houver `audio.mp3`, a voz é ElevenLabs com `ELEVENLABS_AFRO_WWW_TALES_VOICE_ID` do `.env` do studio. Neste vídeo há áudio, então não gerar voz.
- Ao final, fazer o upload do vídeo pela API do phantertools (canal já cadastrado) (o Rod dispensou aprovação para o upload).
- Trabalho/saídas intermediárias: `out/afro-ww2-tales/massaquoi-hamburg/{sync,work,qa}`; `input/` fica só com relatórios (`inputs-report.json`, `images-index.json`).

## Insumos originais (Google Drive, referência)
Pasta: https://drive.google.com/drive/folders/1I15NMrUDr7xeflGgpqrfEXgNDpLGlmMd
- `Narration/audio.mp3` (~62 MB, narração única): https://drive.google.com/drive/folders/1hHW4tm-9xredAnUvRHncDgrhMbEX301W
- `Musics/*.mp3`: https://drive.google.com/drive/folders/1mIkmqg5tzE05pXLb0MCpJcBFsDHKQJQ2
- `Images/` 01..24.jpg + 20_B.jpg (25 imagens): https://drive.google.com/drive/folders/1gXbJo90fh0HRb-_J0opk_z_hTM9SwRq0
- Google Doc `Roteiro` id 1Yho_o9Leeh4idYVhj7XdSmcHof1XQ_qRZX9JnZvfE1M (só capítulos/descrição, não é fonte de áudio)
Regras: narração só de `Narration`, sem ElevenLabs; músicas só de `Musics`; imagens só de `Images`. Originais do Drive não são alterados.
Rodar apenas: validação, sincronização, montagem, QA, packaging, revisão. NÃO rodar agentes 01, 02, 03, 05, 06.

## Estilo
Faceless, imagens P&B IA quase estáticas (vários minutos cada), legenda fixa no rodapé "Imagens geradas por IA meramente ilustrativas" (idioma PT/EN pendente com o Rod), sem título/cartela/número de capítulo, sem efeito de transição especial, marcar conteúdo sintético no YouTube, nenhuma imagem como foto histórica real.

## Validação (`qa/inputs-report.json`)
Duração e bitrate do audio.mp3 (não assumir; ~46 min esperado), músicas com duração, imagens com largura/altura/proporção; confirmar 25 imagens. <1280 px: listar ao Rod (sem upscale). Fora de 16:9: crop central, avisar se perder assunto. Não P&B: `hue=s=0`. 20 e 20_B são variações (usar as duas em sequência no cap. 7 ou escolher). Criar `input/images-index.json` (1 linha por imagem, vendo cada imagem).

## Sincronização (`sync/`)
faster-whisper (small+ , en, timestamps por palavra) -> `transcript.json`. Âncoras (primeira frase de cada capítulo; títulos não são lidos):
1 "Hamburg, Germany, 1933." | 2 "Hans's childhood began at the meeting point of two worlds." | 3 "After Hitler's visit in 1934, Hans's classmates rushed to join the Deutsches Jungvolk" | 4 "The rejection Hans met in school was not the decision of one teacher." | 5 "When the Second World War began in September 1939, Hans was thirteen years old." | 6 "By the summer of 1943, the war had turned Hamburg" | 7 "By the beginning of 1945, the Germany in which Hans had grown up was close to military defeat." | 8 "After the war, Hans stayed in Hamburg, a nineteen-year-old"
O pedido de like/inscrição ("If you're finding this story valuable...") pertence ao fim do cap. 3 e termina em "Now, let's return to Hans Massaquoi's story."; cap. 4 começa depois. Âncora não achada: não adivinhar, gravar trecho mais próximo e avisar. Gerar `chapters.json` (start, last_word_end anterior, pausa) e `paragraphs.json`.
**Intervalo de 3,0 s só de música** em cada virada 1→2…7→8: pausa p<3 insere silêncio, p>3 corta excesso, só em região de silêncio. Montar `narration-final.wav` (8 blocos + intervalos); todas as marcações usam essa linha do tempo. Início: música e voz juntas em 0:00. Fim: música continua 4 s com fade out. Normalizar: `loudnorm=I=-16:TP=-1.5:LRA=11` -> `narration-norm.wav`.

## Músicas (`Nome da Faixa (Take N).mp3`; Modern/Retro/Vintage em algumas)
Cap1 The Quiet Before | Cap2 Ordinary Streets, Changing Flags | Cap3 The Door Closes | Cap4 Paper Walls | Cap5 Whispers in the Stairwell | Cap6 Night of Fire até o parágrafo "Massaquoi's memoir places his own survival within this destruction.", depois Ashes at Dawn | Cap7 The Last Flag Falls | Cap8 Long Road Home até o parágrafo "That career gave him the skills and the platform for an act of historical testimony.", depois Witness. NÃO usar Hour of Decision nem Courage in Olive Drab.
Troca no meio de capítulo (6 e 8): crossfade 4 s, sem intervalo de 3 s.
Cobertura: encadear takes da mesma faixa (1,2,1,… ; Witness 1,2,3,1…) com acrossfade 4 s, começando pelo primeiro take da lista (Modern/Take 1), cortar na duração do trecho.
Volume: normalizar cada take (loudnorm -16) para `work/musics-norm/*.wav`, depois `volume=0.20` constante; narração 100%; sem ducking/automação. Viradas: música anterior fade out 2 s começando na última palavra; nova música fade in 2 s começando 1 s após o início do intervalo, já a 20% na primeira palavra. Trilhas posicionadas com `adelay`, somadas com `amix=inputs=N:normalize=0:duration=longest` -> `work/music-bed.wav`. Registrar tudo em `credits.json` (gerada por IA, pasta Musics).

## Imagens x capítulos (provisório, confirmar com images-index e pedir aprovação do Rod)
1: 01,02,03 | 2: 04,05,06 | 3: 07,08,09 | 4: 10,11,12 | 5: 13,14,15 | 6: 16,17,18,19 | 7: 20,20_B,21 | 8: 22,23,24
Âncorar em `paragraphs.json`; cada imagem entra no início de um parágrafo. Duração por imagem entre 0,6x e 1,6x da média (duração total/25); excedeu: dividir em dois enquadramentos (zoom em áreas diferentes). Cada capítulo começa com imagem nova, que entra no início do intervalo de 3 s com a dissolução de 1,5 s padrão. Gancho (30 s) com imagem forte (menino ou comício). Sem imagem adequada, manter a anterior. Gerar `scenes.json` {id, chapter, image, start, end, motion, focus}.

## Montagem (ffmpeg)
1920x1080, 30 fps, H.264 (crf 18), AAC 192k. Clipe por imagem, `scale=7680:-1,zoompan` com zoom 100%→máx 108% (incremento 0.08/frames), alternando zoom-in/out; pan lateral só em cenas >120 s, máx 4%. Transições: `xfade=fade` 1,5 s em todas as trocas; proibido fadeblack/cartela/título. Unir em lotes de 5–6 e concatenar. Vinheta leve + grão sutil iguais em todas as cenas. Legenda fixa no rodapé: sans-serif pequena, branca, 55–65% opacidade, margem 4% da altura, o vídeo todo. Áudio: narração-norm 100% + music-bed (20%), pico < -1 dBTP. `captions.srt` a partir do transcript (linha do tempo final), não queimar. Saída `video.mp4`.

## QA (`qa/qa-report.md`)
Duração = narração + 7×3,0 s + 4 s de cauda; 3,0 s (±0,1) sem voz e com música em cada virada; nenhum título/marcação de capítulo; música a 20% constante; sem tela preta indevida; 10 pontos de sincronia imagem×parágrafo; legenda visível em todos os frames amostrados; 12 frames espalhados para o Rod.

## Packaging (`packaging.json`)
Título atual tem 66 caracteres. `vidiq_score_title` + 5 variações ≤60 mantendo o contraste "menino negro que aplaudiu Hitler" × "sobreviveu"; escolher a de maior score. 3 conceitos de thumbnail (imagem P&B do vídeo, ≤4 palavras, `vidiq_score_thumbnail`, marcação sintética). Descrição: ≥4 parágrafos, capítulos com timestamps (de `chapters.json` na linha final; só na descrição), fontes verificadas na web, créditos de trilha, aviso de imagens IA. Tags via `vidiq_keyword_research`, uma linha por vírgulas. `ai_disclosure: true`.

## Checagem factual (`factcheck.md`, antes da aprovação)
Fontes na web para: nascimento e família de Hans Massaquoi; episódio de 1934 e exclusão do Deutsches Jungvolk; Leis de Nuremberg (set/1935) e extensão a negros; esterilizações de 1937 (~500); Bayume Mohamed Husen, Martha Ndumbe, Gert Schramm; Operação Gomorra (datas, Window, bombardeiros em 27–28/jul, mortos, área); rendição de Hamburgo (Gen. Alwin Wolz, 7ª Divisão Blindada, Lüneburg Heath, Reims); pós-guerra (Libéria, 82ª Aerotransportada, Jet, Ebony e 1ª edição, livro 1999, filme 2006, morte em 19/jan/2013). Narração já gravada: divergências só sinalizadas ao Rod, nunca alterar áudio/roteiro sem aprovação.

## Entregáveis
`qa/inputs-report.json`, `input/images-index.json`, `sync/{transcript,chapters,paragraphs}.json`, `sync/narration-{final,norm}.wav`, `work/music-bed.wav`, `scenes.json`, `video.mp4`, `captions.srt`, `qa/qa-report.md`, `factcheck.md`, `packaging.json`, `credits.json`.

## Ordem
1 baixar+validar | 2 images-index | 3 transcrever+capítulos (aprovação se faltar âncora) | 4 narration-final | 5 trilha | 6 scenes.json (aprovação do mapeamento) | 7 montar | 8 QA | 9 factcheck | 10 packaging | 11 entregar ao Rod.

## Upload (phantertools)
Canal já cadastrado no phantertools_api (`/root/phantertools/phantertools_api/src/routes/youtube.ts`): `GET /youtube/channels` para achar o canal Afro WW2 Tales, `POST /youtube/upload` para enviar (ver o handler para o corpo). Sem esperar aprovação do Rod (dispensada em 17/11); marcar conteúdo sintético (`ai_disclosure`).
