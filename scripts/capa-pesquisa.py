#!/usr/bin/env python3
"""Pesquisa de thumbs virais (método yt-viral: views / mediana do próprio canal) antes de criar capas.

    python3 -I scripts/capa-pesquisa.py youtube|ia "busca do tema do vídeo" PASTA_NOVA

Gera canais.jpg (outliers do nicho) e tema.jpg (busca do tema no último mês) + lista.txt. Só listagens públicas.
"""
import concurrent.futures as cf, json, os, statistics, subprocess, sys, urllib.parse, urllib.request

YTDLP = "/root/work-wallet/ytv/bin/yt-dlp"
CANAIS = {
    "youtube": ["@ThinkMediaTV", "@ThinkMediaPodcast", "@FilmBooth", "@channelmakers", "@NateBlack", "@vidIQ"],
    "ia": ["@JeffSu", "@futurepedia_io", "@KevinStratvert", "@DanKieft", "@SkillLeapAI", "@mreflow", "@nateherk", "@LiamOttley", "@GregIsenberg"],
}

def listar(url, n=30, exigir_views=True):
    r = subprocess.run([YTDLP, "--flat-playlist", "-J", "--playlist-end", str(n), url], capture_output=True, text=True, timeout=150)
    try:
        return [v for v in json.loads(r.stdout)["entries"] if v.get("view_count") or not exigir_views]
    except Exception:
        print("falhou:", url, r.stderr[-200:])
        return []

def folha(itens, pasta, nome):
    os.makedirs(f"{pasta}/{nome}", exist_ok=True)
    for i, v in enumerate(itens):
        for q in ("maxresdefault", "hqdefault"):
            try:
                urllib.request.urlretrieve(f"https://i.ytimg.com/vi/{v['id']}/{q}.jpg", f"{pasta}/{nome}/{i:02d}.jpg")
                break
            except Exception:
                pass
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-pattern_type", "glob", "-i", f"{pasta}/{nome}/*.jpg", "-vf",
                    "scale=400:225:force_original_aspect_ratio=increase,crop=400:225,pad=406:231:3:3:white,tile=4x5",
                    "-frames:v", "1", f"{pasta}/{nome}.jpg"], check=False)

def main():
    nicho, busca, pasta = sys.argv[1:4]
    with cf.ThreadPoolExecutor(5) as ex:
        por_canal = list(zip(CANAIS[nicho], ex.map(lambda c: listar(f"https://www.youtube.com/{c}/videos"), CANAIS[nicho])))
    fora = []
    for canal, videos in por_canal:
        if len(videos) < 4:
            continue
        med = statistics.median(v["view_count"] for v in videos)
        top = sorted(videos, key=lambda v: -v["view_count"])[:4]
        fora += [{**v, "x": v["view_count"] / med, "canal": canal} for v in top]
    fora = sorted(fora, key=lambda v: -v["x"])[:20]
    # busca por relevância, só do último mês (a listagem de busca não traz o número de views)
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote_plus(busca)}&sp=EgQIBBAB"
    tema = listar(url, 20, exigir_views=False)
    folha(fora, pasta, "canais")
    folha(tema, pasta, "tema")
    with open(f"{pasta}/lista.txt", "w") as f:
        f.write("CANAIS (ordem da folha, esquerda para direita)\n" + "".join(f"{v['x']:.1f}x {v['view_count']} {v['canal']} | {v['title']}\n" for v in fora))
        f.write("\nTEMA\n" + "".join(f"{v.get('view_count') or '-'} | {v['title']}\n" for v in tema))
    print(open(f"{pasta}/lista.txt").read())

if __name__ == "__main__":
    main()
