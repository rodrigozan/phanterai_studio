# public/shorts-blocos/music/

`bed.mp3`: trilha contínua do shorts-blocos. Gerada de `public/phanterai/music/CuriousFocus.mp3` com nível achatado, para a auditoria de quedas de volume passar:

```
ffmpeg -i public/phanterai/music/CuriousFocus.mp3 -af "dynaudnorm=f=100:g=5:p=0.7:m=30,acompressor=threshold=-24dB:ratio=4:attack=5:release=120,loudnorm=I=-18:TP=-2" -ar 44100 -b:a 192k public/shorts-blocos/music/bed.mp3
```

Volume e ducking em `marcas/afamiliaquadrada/src/remotion/audio/AudioBed.tsx` (`MUSIC_BASE`, `DUCK_DB`, ducking por palavra).

## Trilhas fixas da Família Quadrada

Regras de uso por momento do episódio na skill `.claude/skills/familia-quadrada-musica/SKILL.md`. Não trocar por outras.

| Id | Arquivo | Título original |
|---|---|---|
| `tema` | `whistle-and-bounce.mp3` | Whistle & Bounce |
| `travessura` | `tiptoe-and-trouble.mp3` | Tiptoe & Trouble |
| `escalada` | `slapstick-dash.mp3` | Slapstick Dash |
| `brasil` | `tamborzao-mischief.mp3` | Tamborzão Mischief |

Originais no Google Drive (pasta 1iLC1Xe1XteqKEW91tOJL5oUDAUrTUwNU), 128 kbps, 48 kHz, estéreo.

`nivelado/`: versões das 4 trilhas que o código toca (`TRACKS` em `marcas/afamiliaquadrada/src/schema/music.ts`), com nível achatado pelo mesmo filtro do `bed.mp3`, para a auditoria de quedas de volume. Os originais acima ficam intactos. Para refazer:

```
for f in whistle-and-bounce tiptoe-and-trouble slapstick-dash tamborzao-mischief; do ffmpeg -i public/shorts-blocos/music/$f.mp3 -af "dynaudnorm=f=100:g=5:p=0.7:m=30,acompressor=threshold=-24dB:ratio=4:attack=5:release=120,loudnorm=I=-18:TP=-2" -ar 48000 -b:a 192k public/shorts-blocos/music/nivelado/$f.mp3; done
```
