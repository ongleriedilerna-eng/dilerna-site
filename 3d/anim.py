# DILERNA · animation image par image (t de 0 à 1) et rendu
import sys, os, math
sys.argv = [a for a in sys.argv]
__file__ = os.path.abspath(__file__)
exec(open(os.path.join(os.path.dirname(__file__), 'scene.py'), encoding='utf-8').read())
import bmesh
from mathutils import Matrix, Vector, Quaternion

def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def seg(t, a, b): return clamp((t - a) / (b - a))
def io(t): return 4 * t * t * t if t < .5 else 1 - (-2 * t + 2) ** 3 / 2
def ioq(t): return t * t * (3 - 2 * t)
def out(t): return 1 - (1 - t) ** 3
def inn(t): return t * t * t
def lerp(a, b, t): return a + (b - a) * t
def vlerp(a, b, t): return a.lerp(b, t)

X0 = 0.92                 # tige du « l » : c'est là que le vernis entre
TOPL = 1.10
MOUTH = Vector((0, 0, BH + 0.12))
REST = Vector((0.0, 0.0, 1.78))
SC = 1.15
TILT = 112.0

def bottle_matrix(t):
    go = io(seg(t, .30, .47)); back = io(seg(t, .80, .92))
    k = go * (1 - back)
    yaw = lerp(26, 0, ioq(seg(t, 0, .34))) if t < .5 else lerp(0, -14, ioq(seg(t, .82, 1)))
    float_ = math.sin(t * math.pi * 2.0) * 0.05 * (1 - k)
    tilt = TILT * k
    R = Matrix.Rotation(math.radians(tilt), 4, 'Y') @ Matrix.Rotation(math.radians(yaw), 4, 'Z')
    # en position de versement : le goulot se place au-dessus de la tige du « l »
    target_mouth = Vector((X0 + 0.10, 0, 1.72))
    pour_loc = target_mouth - (Matrix.Rotation(math.radians(TILT), 4, 'Y') @ (MOUTH * SC))
    loc = vlerp(REST, pour_loc, k) + Vector((0, 0, float_))
    # arc : le flacon monte un peu pendant qu'il bascule
    loc.z += math.sin(k * math.pi) * 0.35
    return Matrix.Translation(loc) @ R @ Matrix.Scale(SC, 4), k

def cap_matrix(t, BM):
    un = seg(t, .07, .19); pull = io(seg(t, .17, .27)); away = io(seg(t, .25, .38))
    ret = io(seg(t, .86, .95)); rescrew = seg(t, .94, 1.0)
    spin = -720 * ioq(un) if t < .6 else -720 * (1 - ioq(rescrew))
    lift = 0.12 * ioq(un) + 0.97 * pull if t < .6 else (0.12 + 1.0 * (1 - io(seg(t, .90, .955)))) * (1 - ioq(rescrew)) + 0.12 * (1 - ioq(rescrew)) * 0
    if t >= .6:
        lift = 0.12 * (1 - ioq(rescrew)) + 0.97 * (1 - io(seg(t, .895, .945)))
    attached = BM @ Matrix.Translation((0, 0, CAPZ + lift)) @ Matrix.Rotation(math.radians(spin), 4, 'Z')
    park = Matrix.Translation((-1.28, 0.3, 3.2)) @ Matrix.Rotation(math.radians(26), 4, 'Y') @ Matrix.Rotation(math.radians(30), 4, 'Z') @ Matrix.Scale(SC, 4)
    w = away * (1 - ret) if t < .6 else (1 - ret)
    if t >= .6: w = 1 - io(seg(t, .84, .91))
    if w <= 0: return attached
    if w >= 1: return park
    la, ra, _ = attached.decompose(); lp, rp, _ = park.decompose()
    l = la.lerp(lp, w); l.z += math.sin(w * math.pi) * 0.18
    return Matrix.Translation(l) @ ra.slerp(rp, w).to_matrix().to_4x4() @ Matrix.Scale(SC, 4)

def fill_amount(t): return io(seg(t, .50, .80))

def logo_level(x, t):
    f = seg(t, .49, .80)
    d = abs(x - X0)
    local = clamp((f * 1.25 - d * 0.18))
    return -0.02 + ioq(local) * 1.25

def bottle_volume_target(t, V0): return V0 * (1 - 0.42 * fill_amount(t))

def liquid_volume(level):
    blevel.location.z = level
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    ev = bliq.evaluated_get(dg)
    bm = bmesh.new(); bm.from_mesh(ev.to_mesh()); bm.transform(bliq.matrix_world)
    v = abs(bm.calc_volume()); bm.free(); ev.to_mesh_clear()
    return v

V0 = None
def pose(t):
    global V0
    BM, k = bottle_matrix(t)
    bottle.matrix_world = BM
    cap.parent = None
    cap.matrix_world = cap_matrix(t, BM)
    bpy.context.view_layer.update()
    # niveau du vernis dans le flacon (volume conservé, surface horizontale)
    if V0 is None:
        bottle.matrix_world = Matrix.Translation(REST) @ Matrix.Scale(SC, 4)
        bpy.context.view_layer.update()
        V0 = liquid_volume(REST.z + (0.175 + 0.86 * (BH - 0.25)) * SC)
        bottle.matrix_world = BM; bpy.context.view_layer.update()
    target = bottle_volume_target(t, V0)
    lo, hi = -2.0, 6.0
    for _ in range(16):
        mid = (lo + hi) / 2
        if liquid_volume(mid) < target: lo = mid
        else: hi = mid
    blevel.location.z = (lo + hi) / 2
    # logo (le moule en verre se soulève et disparaît une fois rempli)
    dm = io(seg(t, .84, .95))
    FADE.outputs[0].default_value = dm
    outer.location.z = 0.32 * dm
    outer.hide_render = dm >= 0.999
    set_logo_level(lambda x: logo_level(x, t))
    # filet : il s'arrête pendant que le flacon est encore penché (sa queue tombe dans le « l »),
    # pour ne jamais rester suspendu en l'air quand le flacon se redresse
    grow = out(seg(t, .455, .515)); stop = inn(seg(t, .72, .78))
    BMs = BM
    mouth = BMs @ MOUTH
    axis = (BMs.to_3x3() @ Vector((0, 0, 1))).normalized()
    # le filet finit toujours dans la lettre (pas au-dessus, même quand le vernis arrive en haut)
    # (haut du vernis dans la lettre sous le point de versement : 0,715 d'après logo_polys.json)
    end = Vector((X0, -0.0, max(0.05, min(logo_level(X0, t), 0.69))))
    A = mouth + axis * 0.03; B = mouth + axis * 0.16 + Vector((0, 0, -0.25)); C = end
    def P(u): return A * (1 - u) ** 2 + B * 2 * u * (1 - u) + C * u * u

    st_cu.splines.clear()
    if grow > 0.001 and stop < 0.999:
        s0, s1 = stop, grow
        n = 40
        sp = st_cu.splines.new('POLY'); sp.points.add(n - 1)
        for i in range(n):
            u = lerp(s0, s1, i / (n - 1)); p = P(u)
            sp.points[i].co = (p.x, p.y, p.z, 1)
            taper = lerp(1.25, 0.72, u) * (1 - 0.55 * stop)
            if i == n - 1 and grow < 1: taper *= 1.15
            sp.points[i].radius = taper
        stream.hide_render = False
    else:
        stream.hide_render = True
    animate_floaters(t)
    # goutte du pinceau
    drop.scale = (1, 1, 1 + 0.25 * math.sin(t * 40))

if __name__ == '__main__':
    args = sys.argv[sys.argv.index('--') + 2:] if '--' in sys.argv else []
    outdir = os.environ.get('OUTDIR', os.path.join(ROOT, 'frames')); os.makedirs(outdir, exist_ok=True)
    N = int(os.environ.get('NFRAMES', '100'))
    if os.environ.get('SAMPLES'): sc.cycles.samples = int(os.environ['SAMPLES'])
    # GPU=1 : rendu sur la carte graphique (OptiX ou CUDA), bien plus rapide que le processeur
    if os.environ.get('GPU'):
        prefs = bpy.context.preferences.addons['cycles'].preferences
        for typ in ('OPTIX', 'CUDA'):
            try:
                prefs.compute_device_type = typ; prefs.get_devices()
                if any(d.type == typ for d in prefs.devices): break
            except TypeError: pass
        for d in prefs.devices: d.use = d.type != 'CPU'
        sc.cycles.device = 'GPU'
        print('devices', [(d.name, d.type, d.use) for d in prefs.devices], flush=True)
    for a in args:
        i = int(a); t = i / (N - 1)
        pose(t)
        sc.render.filepath = os.path.join(outdir, f'f{i:03d}.png')
        bpy.ops.render.render(write_still=True)
        print('frame', i, flush=True)
