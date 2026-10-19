# Efface la capsule d'ongle chocolat qui flotte tout en haut au centre de l'accueil (Marie la trouvait « collée » au logo).
# Pour chaque image PNG HD : on repère, dans une zone autour de la capsule, les pixels qui s'écartent nettement du mur,
# puis on reconstitue le mur à cet endroit (inpainting) et on remet un léger grain pour que ça ne se voie pas.
import sys, os, numpy as np, cv2

SRC = sys.argv[1]
DST = sys.argv[2] if len(sys.argv) > 2 else SRC
ONLY = sys.argv[3:] if len(sys.argv) > 3 else None
X0, Y0, X1, Y1 = 540, 200, 830, 500          # zone de recherche (images 1080 × 2340)
os.makedirs(DST, exist_ok=True)
rng = np.random.default_rng(7)

for f in sorted(os.listdir(SRC)):
    if not f.endswith('.png') or (ONLY and f not in ONLY):
        continue
    im = cv2.imread(os.path.join(SRC, f), cv2.IMREAD_UNCHANGED)
    bgr = im[..., :3]
    roi = bgr[Y0:Y1, X0:X1].astype(np.float32)
    # couleur du mur : médiane du bord de la zone
    border = np.concatenate([roi[0], roi[-1], roi[:, 0], roi[:, -1]])
    wall = np.median(border, axis=0)
    dist = np.linalg.norm(roi - wall, axis=2)
    mask = (dist > 14).astype(np.uint8) * 255
    # on garde le plus gros morceau (la capsule), on l'élargit pour prendre le flou autour
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask)
    if n <= 1:
        print(f, 'rien'); continue
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    mask = (lab == big).astype(np.uint8) * 255
    mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
    patch = cv2.inpaint(bgr[Y0:Y1, X0:X1].copy(), mask, 21, cv2.INPAINT_TELEA).astype(np.float32)
    # léger grain, comme le reste du mur
    noise = cv2.GaussianBlur(rng.normal(0, 2.2, patch.shape[:2]).astype(np.float32), (0, 0), 1.2)
    patch += noise[..., None]
    soft = cv2.GaussianBlur(mask, (0, 0), 6).astype(np.float32)[..., None] / 255.0
    out = roi * (1 - soft) + patch * soft
    bgr[Y0:Y1, X0:X1] = np.clip(out, 0, 255).astype(np.uint8)
    im[..., :3] = bgr
    cv2.imwrite(os.path.join(DST, f), im)
    print(f, 'ok', int(stats[big, cv2.CC_STAT_AREA]))
