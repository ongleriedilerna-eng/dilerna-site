# Animation 3D de l'accueil (Blender)

Rendu Cycles, 100 images 600×1300, décor compris.

1. `python -m pip install bpy==5.2.2 opencv-python-headless shapely numpy pillow` (Python 3.13)
2. `python vectorize.py` : vectorise le logo (`assets/logo/dilerna-logo-mot-blanc.png`) en `logo_polys.json` (déjà fourni)
3. `NFRAMES=100 SAMPLES=40 OUTDIR=out python anim.py -- 600 $(seq 0 99)` : rend les images PNG
   (`scene.py` construit la scène : flacon, bouchon, pinceau plat, logo en verre + vernis, décor ; `anim.py` anime chaque image).
   Ajouter `GPU=1` pour rendre sur la carte graphique (OptiX/CUDA) : environ 6 s par image au lieu de 50 s sur le processeur.
4. `python encode.py out ../assets/hero3d` : encode en WebP pour le site

Les images actuelles du site ont été rendues avant que la capsule chocolat du haut soit cachée dans `scene.py` ;
elle en a été effacée après coup avec `python erase_capsule.py out out_sans_capsule` (inutile pour un nouveau rendu).

Les chemins sont relatifs au dossier `3d/` (le logo est lu dans `../assets/logo/`).

## Version ordinateur (en largeur, vernis marron)

`DESK=1` (ajouté à la fin de `scene.py`) : image 16:9, caméra plus large, vernis marron chocolat. Sans `DESK`, la version téléphone ne change pas.

    DESK=1 DESK_LENS=50 DESK_LOOKZ=2.25 DESK_CAMZ=2.45 GPU=1 NFRAMES=100 SAMPLES=48 OUTDIR=C:/chemin/absolu python anim.py -- 2048 $(seq 0 99)
    python encode.py C:/chemin/absolu ../assets/hero3d-ordi

(`OUTDIR` doit être un chemin absolu, sinon Blender écrit les images ailleurs.) Environ 25 s par image sur la carte graphique.

### Qualité maximale (accueil ordinateur actuel)

    DESK=1 DESK_HQ=1 DESK_LENS=50 DESK_LOOKZ=2.25 DESK_CAMZ=2.45 GPU=1 NFRAMES=100 SAMPLES=192 OUTDIR=C:/chemin/absolu python anim.py -- 3840 $(seq 0 99)

Puis encoder en deux tailles : `assets/hero3d-ordi/` (2560×1440, réduit en Lanczos, WebP qualité 92) et `assets/hero3d-ordi-4k/`
(3840×2160, WebP qualité 90). Environ 3 min par image sur une RTX 2050. Les images sont identiques d'un lancement à l'autre
(`random.seed(5)`), on peut donc reprendre un rendu interrompu à partir de l'image où il s'est arrêté.
