# Vectorise le logo "dilerna" (masque blanc) en polygones (unités : largeur du logo = 4)
import cv2, numpy as np, json
from shapely.geometry import Polygon
from shapely.ops import unary_union
im = cv2.imread('/home/user/dilerna-site/assets/logo/dilerna-logo-mot-blanc.png', cv2.IMREAD_UNCHANGED)
a = im[:, :, 3] if im.shape[2] == 4 else cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
S = 8
big = cv2.resize(a, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
big = cv2.GaussianBlur(big, (0, 0), S * .6)
_, bw = cv2.threshold(big, 127, 255, cv2.THRESH_BINARY)
cs, hier = cv2.findContours(bw, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
hier = hier[0]
H, W = a.shape
k = 4.0 / (W * S)
polys = []
for i, c in enumerate(cs):
    if hier[i][3] != -1: continue
    c = cv2.approxPolyDP(c, 1.2, True)[:, 0, :]
    holes = []
    j = hier[i][2]
    while j != -1:
        h = cv2.approxPolyDP(cs[j], 1.2, True)[:, 0, :]
        if len(h) > 2: holes.append([((x) * k, (H * S - y) * k) for x, y in h])
        j = hier[j][0]
    if len(c) > 2:
        p = Polygon([(x * k, (H * S - y) * k) for x, y in c], holes)
        if p.area > 1e-4: polys.append(p.buffer(0))
u = unary_union(polys)
minx, miny, maxx, maxy = u.bounds
print('bounds', u.bounds, 'parts', len(getattr(u, 'geoms', [u])))
def out(geom):
    g = []
    for p in getattr(geom, 'geoms', [geom]):
        if p.is_empty or p.area < 1e-4: continue
        g.append({'ext': [(x - (minx + maxx) / 2, y - miny) for x, y in p.exterior.coords[:-1]],
                  'holes': [[(x - (minx + maxx) / 2, y - miny) for x, y in r.coords[:-1]] for r in p.interiors],
                  'cx': p.centroid.x - (minx + maxx) / 2})
    return g
data = {}
for name, d in [('outer', 0.016), ('cavity', 0.008), ('liquid', -0.002)]:
    g = u.buffer(d, join_style=1)
    g = g.buffer(0.007, join_style=1).buffer(-0.007, join_style=1)      # arrondit les creux trop aigus
    g = g.buffer(-0.003, join_style=1).buffer(0.003, join_style=1)
    data[name] = out(g.simplify(0.0015))
    print(name, len(data[name]), sum(len(p['ext']) for p in data[name]))
json.dump(data, open('logo_polys.json', 'w'))
