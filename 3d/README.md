# Animation 3D de l'accueil (Blender)

Rendu Cycles, 100 images 600×1300, décor compris.

1. `python -m pip install bpy==5.2.2 opencv-python-headless shapely numpy pillow` (Python 3.13)
2. `python vectorize.py` : vectorise le logo (`assets/logo/dilerna-logo-mot-blanc.png`) en `logo_polys.json` (déjà fourni)
3. `NFRAMES=100 SAMPLES=40 OUTDIR=out python anim.py -- 600 $(seq 0 99)` : rend les images PNG
   (`scene.py` construit la scène : flacon, bouchon, pinceau plat, logo en verre + vernis, décor ; `anim.py` anime chaque image)
4. `python encode.py out ../assets/hero3d` : encode en WebP pour le site

Les chemins absolus dans les scripts (`/home/user/...`) sont ceux de la machine où le rendu a été fait : à adapter.
