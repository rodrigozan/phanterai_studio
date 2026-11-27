# shorts-blocos

Shorts 1080x1920 a 60fps com personagens estilo blocos, montados por código a partir de `scenes.json`. Receita completa em `.claude/skills/shorts-blocos/SKILL.md`.

| O quê | Onde |
|---|---|
| Contrato de cenas (Zod) | `src/schema/scenes.ts` |
| Personagem, expressões | `src/remotion/characters/` |
| Câmera (close/medium/wide, punchIn, shake, pan) | `src/remotion/camera/Camera.tsx` |
| Cenários (sala, cozinha, quarto, escola) | `src/remotion/scenery/Room.tsx` |
| Música com ducking + SFX | `src/remotion/audio/AudioBed.tsx` |
| Composição final / teste de 10s | `src/remotion/Short.tsx` (`ShortBlocos`) / `TesteBlocos.tsx` |
| TTS, timing, auditoria, orquestração | `src/pipeline/` |
| Episódios | `public/shorts-blocos/episodes/<slug>/` |
| Roteiro e narração entregues | `videos/<slug>/` |

```
yarn blocos <slug> --validate
yarn blocos <slug>
yarn blocos <slug> --preview
yarn tsx marcas/afamiliaquadrada/src/pipeline/audit.ts <slug>
```

`.env`: `ELEVENLABS_API_KEY` e `ELEVENLABS_NARRATOR_VOICE_ID` (se ausente, usa `ELEVENLABS_STORY_NARRATOR_VOICE_ID`). No `scenes.json`, `"voiceId": "$NARRATOR"` aponta para essa voz.
