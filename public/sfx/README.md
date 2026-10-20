# public/sfx/

Efeitos sonoros curtos usados pelo componente `src/components/Sfx.jsx`. Nomes exatos:

- `pop.mp3` — entrada da pantera / troca de pose
- `ding.mp3` — item de checklist concluído
- `whoosh.mp3` — entrada de item em lista numerada
- `coin.mp3` — contador / número subindo
- `error.mp3` — item de checklist não concluído
- `riser.mp3` — abertura de cena de impacto / CTA

Só um trecho de cada arquivo toca (início e duração em `SFX_TRECHO`, `src/theme.js`), pulando
silêncio inicial e cortando arquivos longos. Trocou um arquivo? Meça com
`ffmpeg -i <arquivo> -af silencedetect=n=-40dB:d=0.15 -f null -` e ajuste lá.
