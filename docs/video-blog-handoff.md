# Artigo e descrição do YouTube — PhanterAI

Todo vídeo do canal Aprenda YouTube deve ter um artigo próprio, com pelo menos 500 palavras, passo a passo completo, links usados no roteiro, autor Rod Zandonadi e embed do mesmo vídeo. Quando a narração prometer links ou instruções na descrição, inclua na descrição o endereço desse artigo.

Depois de enviar o vídeo e finalizar capa e metadados, execute no Studio:

```sh
python3 -I scripts/blog-youtube.py --schedule VIDEO_ID
```

O comando confirma o agendamento do artigo no horário do vídeo e adiciona no início da descrição:

```text
Passo a passo e links deste vídeo:
https://phanterai.com/blog/youtube-<id em minúsculas>
```

O restante da descrição, capítulos, comandos, fontes e recomendações é preservado. O endereço só é inserido depois que o artigo completo está salvo e vinculado ao vídeo correto. O YouTube mantém o vídeo privado até o horário agendado, portanto o embed pode ficar indisponível antes desse horário.

Só considere a integração concluída quando o comando retornar `description_linked: true`. Registre `url`, `status`, `post_id` e `description_linked` no resultado do episódio. Os recibos também ficam em `blog-publication.json` e `blog-link.txt` na pasta do roteiro e em `out/phanterai/blog/VIDEO_ID/`.

Se essa etapa falhar, preserve o agendamento e os IDs existentes; registre `blog_pendente` e o motivo separadamente. Não envie outro vídeo. O cron retoma a vinculação a cada cinco minutos em caso de falha. Se alguém remover o link depois, ele será recolocado após a próxima leitura do vídeo pelo scanner. Descrições acima do limite de 5.000 caracteres exigem ajuste humano e não são truncadas.

Configuração privada: `link_descriptions_enabled: true` em `/root/.config/phanterai-blog/config.json`. O adaptador usa a conexão existente do Phantertools, confirma propriedade do canal e verifica descrição, título, tags, visibilidade e horário após a alteração. Nenhuma credencial pertence ao repositório. Backups privados das descrições anteriores ficam na pasta de saída do vídeo.
