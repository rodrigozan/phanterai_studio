# Metas da auditoria

Calculadas por `marcas/shorts-blocos/src/pipeline/audit.ts`. Reprovou em qualquer uma, o vídeo não sai.

| Métrica | Fonte | Meta |
|---|---|---|
| Mudanças visuais a cada 10s | timing.json (cortes, punch-in, shake, expressão, pan, troca de fala sem cutOnWord) | ≥ 13 |
| Tempo de rosto em close | segmentos de câmera com plano `close` | ≥ 33% |
| Rosto no 1º frame | regra de layout do plano close (`layout.ts`) | 40–50% da altura |
| Quedas de volume nas pausas | RMS em janelas de 250 ms do mp4 | nenhuma ≥ 10 dB abaixo da média |
| Loop | diferença média de pixels entre o primeiro e o último frame | < 0,02 |
| Duração | ffprobe | ≤ 60 s |
| CTA de inscrição no meio | scenes.json | proibido |
