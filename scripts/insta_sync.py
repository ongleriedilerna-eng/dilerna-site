"""Récupère les dernières publications Instagram de Dilerna (API officielle d'Instagram) et les met sur le site.

Lancé tout seul par GitHub toutes les 6 heures (.github/workflows/insta.yml), ou à la main depuis l'onglet Actions.
- Le code d'accès Instagram est dans le secret GitHub IG_TOKEN (jamais écrit dans le dépôt).
- Seules les photos et les carrousels sont pris (pas les vidéos) ; une publication dont la légende contient #perso est ignorée.
- Les photos sont copiées dans assets/img/insta/auto/ : les visiteuses ne chargent rien depuis Instagram (pas de cookies).
- js/insta-auto.js remplace les listes instaPosts (téléphone : 4) et instaPostsOrdinateur (ordinateur : 8) de config.js.
"""
import io, json, os, re, sys, urllib.parse, urllib.request
from PIL import Image

API = "https://graph.instagram.com"
OUT = "assets/img/insta/auto"
JS = "js/insta-auto.js"
N_PHONE, N_DESK = 4, 8
SKIP_TAG = "#perso"


def get(url, params):
    with urllib.request.urlopen(url + "?" + urllib.parse.urlencode(params), timeout=30) as r:
        return json.load(r)


def caption_text(c):
    """Première ligne de la légende, sans les hashtags, en 70 caractères au plus."""
    line = (c or "").strip().split("\n")[0]
    line = re.sub(r"[#@]\S+", "", line)
    line = re.sub(r"\s+", " ", line).strip(" -–—·:")
    if len(line) > 70:
        line = line[:70].rsplit(" ", 1)[0] + "…"
    return line or "Nail art Dilerna"


def main():
    token = os.environ.get("IG_TOKEN", "").strip()
    if not token:
        sys.exit("IG_TOKEN manquant (secret GitHub)")
    # prolonge le code d'accès (valable 60 jours, prolongé à chaque passage)
    try:
        get(API + "/refresh_access_token", {"grant_type": "ig_refresh_token", "access_token": token})
    except Exception as e:
        print("prolongation du code d'accès impossible pour l'instant :", type(e).__name__)
    data = get(API + "/me/media", {
        "fields": "id,caption,media_type,media_url,permalink,timestamp,children{media_type,media_url}",
        "limit": 30, "access_token": token})["data"]
    posts = []
    for m in data:
        if SKIP_TAG in (m.get("caption") or "").lower():
            continue
        url = None
        if m["media_type"] == "IMAGE":
            url = m.get("media_url")
        elif m["media_type"] == "CAROUSEL_ALBUM":
            kids = [k for k in (m.get("children") or {}).get("data", []) if k.get("media_type") == "IMAGE"]
            url = kids[0]["media_url"] if kids else None
        if url:
            posts.append((m["id"], url, caption_text(m.get("caption"))))
        if len(posts) == N_DESK:
            break
    if not posts:
        sys.exit("aucune photo trouvée : on garde la liste actuelle")

    os.makedirs(OUT, exist_ok=True)
    keep = set()
    for pid, url, _ in posts:
        name = pid + ".webp"; keep.add(name)
        path = os.path.join(OUT, name)
        if os.path.exists(path):
            continue
        with urllib.request.urlopen(url, timeout=60) as r:
            im = Image.open(io.BytesIO(r.read())).convert("RGB")
        if im.width > 1080:
            im = im.resize((1080, round(im.height * 1080 / im.width)), Image.LANCZOS)
        im.save(path, "WEBP", quality=88, method=6)
        print("nouvelle photo :", name)
    for f in os.listdir(OUT):
        if f not in keep:
            os.remove(os.path.join(OUT, f)); print("retirée :", f)

    items = [{"src": OUT + "/" + pid + ".webp", "alt": cap} for pid, _, cap in posts]
    js = ("/* Fichier écrit tout seul par scripts/insta_sync.py (GitHub, toutes les 6 h) : ne pas le modifier à la main.\n"
          "   Les dernières publications Instagram, de la plus récente à la plus ancienne. */\n"
          "(function () {\n  var D = window.DILERNA = window.DILERNA || {};\n"
          "  var L = " + json.dumps(items, ensure_ascii=False, indent=2).replace("\n", "\n  ") + ";\n"
          "  if (L.length) { D.instaPosts = L.slice(0, %d); D.instaPostsOrdinateur = L.slice(0, %d); }\n})();\n" % (N_PHONE, N_DESK))
    old = open(JS, encoding="utf-8").read() if os.path.exists(JS) else ""
    if js != old:
        open(JS, "w", encoding="utf-8", newline="\n").write(js)
        print("liste mise à jour :", len(items), "publications")
    else:
        print("rien de nouveau")


if __name__ == "__main__":
    main()
