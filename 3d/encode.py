# Nettoie l'alpha du capteur d'ombres (bruit très faible) et encode en WebP
import sys, os, numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
for f in sorted(os.listdir(src)):
    if not f.endswith('.png'): continue
    im = np.asarray(Image.open(os.path.join(src, f)).convert('RGBA')).astype(np.float32)
    rgb, a = im[..., :3], im[..., 3]
    lum = rgb.mean(axis=2)
    shadow = lum < 40                               # pixels « ombre seule » : noirs, peu opaques
    cleaned = np.clip((a - 12) / (255 - 12) * 255, 0, 255)
    a2 = np.where(shadow, cleaned, a)
    out = np.dstack([rgb, a2]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(dst, f.replace('.png', '.webp')), 'WEBP', quality=90, method=6, alpha_quality=90)
    print(f, flush=True)
