# DILERNA · scène 3D (Blender / Cycles) : le flacon s'ouvre, se penche et remplit le logo en verre
import bpy, bmesh, json, math, sys, os
from mathutils import Vector, Matrix, Euler

ROOT = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(ROOT, 'logo_polys.json')))
LOGO_PNG = os.path.join(ROOT, '..', 'assets', 'logo', 'dilerna-logo-mot-blanc.png')

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def srgb(h, a=1.0):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), a)

# ---------------- matériaux ----------------
def principled(name, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m

M_POLISH = principled('polish', **{'Base Color': srgb('#4E2414'), 'Roughness': 0.09, 'Coat Weight': 1.0,
                                   'Coat Roughness': 0.015, 'Coat IOR': 1.5})
M_GLASS = principled('glass', **{'Base Color': srgb('#FFF8F0'), 'Roughness': 0.0, 'IOR': 1.48, 'Transmission Weight': 1.0})
M_LGLASS = principled('logoglass', **{'Base Color': srgb('#FFF9F2'), 'Roughness': 0.0, 'IOR': 1.22, 'Transmission Weight': 1.0})
def shadow_clear(m, amt=1.0):
    # le verre laisse passer la lumière directe (sinon le vernis à l'intérieur reste dans l'ombre)
    t = m.node_tree; out_ = t.nodes['Material Output']; bs = t.nodes['Principled BSDF']
    lp = t.nodes.new('ShaderNodeLightPath'); tr_ = t.nodes.new('ShaderNodeBsdfTransparent'); mx = t.nodes.new('ShaderNodeMixShader')
    mt = t.nodes.new('ShaderNodeMath'); mt.operation = 'MULTIPLY'; mt.inputs[1].default_value = amt
    t.links.new(lp.outputs['Is Shadow Ray'], mt.inputs[0]); t.links.new(mt.outputs[0], mx.inputs['Fac'])
    t.links.new(bs.outputs[0], mx.inputs[1]); t.links.new(tr_.outputs[0], mx.inputs[2]); t.links.new(mx.outputs[0], out_.inputs['Surface'])
shadow_clear(M_GLASS, 0.9); shadow_clear(M_LGLASS, 0.9)
# fondu du moule en verre (démoulage)
_t = M_LGLASS.node_tree; _o = _t.nodes['Material Output']; _prev = _o.inputs['Surface'].links[0].from_socket
_fm = _t.nodes.new('ShaderNodeMixShader'); _ft = _t.nodes.new('ShaderNodeBsdfTransparent'); FADE = _t.nodes.new('ShaderNodeValue'); FADE.outputs[0].default_value = 0.0
_t.links.new(FADE.outputs[0], _fm.inputs['Fac']); _t.links.new(_prev, _fm.inputs[1]); _t.links.new(_ft.outputs[0], _fm.inputs[2]); _t.links.new(_fm.outputs[0], _o.inputs['Surface'])
M_CAP = principled('cap', **{'Base Color': srgb('#1B0B06'), 'Roughness': 0.22, 'Coat Weight': 1.0, 'Coat Roughness': 0.04})
M_NECK = principled('neck', **{'Base Color': srgb('#EDE3D8'), 'Roughness': 0.35, 'Transmission Weight': 0.6, 'IOR': 1.45})
M_STEM = principled('stem', **{'Base Color': srgb('#140805'), 'Roughness': 0.3})

# décalcomanie blanche du logo sur le flacon
M_LABEL = bpy.data.materials.new('label'); M_LABEL.use_nodes = True
nt = M_LABEL.node_tree; nt.nodes.clear()
o = nt.nodes.new('ShaderNodeOutputMaterial'); mix = nt.nodes.new('ShaderNodeMixShader')
tr = nt.nodes.new('ShaderNodeBsdfTransparent'); pb = nt.nodes.new('ShaderNodeBsdfPrincipled')
pb.inputs['Base Color'].default_value = srgb('#F6EEE4'); pb.inputs['Roughness'].default_value = 0.4
tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(LOGO_PNG); tex.extension = 'CLIP'
nt.links.new(tex.outputs['Alpha'], mix.inputs['Fac']); nt.links.new(tr.outputs[0], mix.inputs[1])
nt.links.new(pb.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], o.inputs['Surface'])

def link(ob, mat=None):
    sc.collection.objects.link(ob)
    if mat: ob.data.materials.append(mat)
    return ob

def rounded_box(name, w, d, h, r, mat, seg=6, z0=0.0):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * w, v.co.y * d, v.co.z * h + h / 2 + z0))
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=r, segments=seg, affect='EDGES', profile=0.5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); link(ob, mat)
    for p in me.polygons: p.use_smooth = True
    return ob

def cyl(name, r, h, mat, z0=0.0, seg=64, bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r, depth=h)
    for v in bm.verts: v.co.z += h / 2 + z0
    if bevel: bmesh.ops.bevel(bm, geom=[e for e in bm.edges if not e.is_manifold or len(e.link_faces) == 2 and abs(e.link_faces[0].normal.z) != abs(e.link_faces[1].normal.z)], offset=bevel, segments=4, affect='EDGES')
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); link(ob, mat)
    for p in me.polygons: p.use_smooth = abs(p.normal.z) < 0.99
    return ob

# ---------------- logo en verre ----------------
LOGO_Y = 0.0      # le logo est posé sur le sol (z=0), centré en x
DEPTH = 0.34
def curve_from(polys, name, depth, bevel):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '2D'; cu.fill_mode = 'BOTH'
    cu.extrude = depth / 2; cu.bevel_depth = bevel; cu.bevel_resolution = 4
    for p in polys:
        for ring in [p['ext']] + p['holes']:
            sp = cu.splines.new('POLY'); sp.points.add(len(ring) - 1)
            for i, (x, y) in enumerate(ring): sp.points[i].co = (x, y, 0, 1)
            sp.use_cyclic_u = True
    ob = bpy.data.objects.new(name, cu); sc.collection.objects.link(ob)
    ob.rotation_euler = (math.pi / 2, 0, 0)    # debout, face à la caméra (-y)
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    mo = bpy.data.objects.new(name + '_m', me); sc.collection.objects.link(mo)
    mo.matrix_world = ob.matrix_world.copy()
    bpy.data.objects.remove(ob)
    bm_ = bmesh.new(); bm_.from_mesh(me)
    bmesh.ops.remove_doubles(bm_, verts=bm_.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm_, faces=bm_.faces)
    bm_.to_mesh(me); bm_.free()
    for p in me.polygons: p.use_smooth = False
    return mo

outer = curve_from(D['outer'], 'logo_outer', DEPTH, 0.010)
cav = curve_from(D['cavity'], 'logo_cav', DEPTH - 0.022, 0.0)
# coque de verre = extérieur - cavité
bm = outer.modifiers.new('hollow', 'BOOLEAN'); bm.operation = 'DIFFERENCE'; bm.object = cav; bm.material_mode = 'TRANSFER'; bm.solver = 'EXACT'
cav.hide_render = True; cav.hide_viewport = True; cav.data.materials.append(M_LGLASS)
outer.data.materials.append(M_LGLASS)
ws = outer.modifiers.new('ws', 'WEIGHTED_NORMAL')
liq = curve_from(D['liquid'], 'logo_liq', DEPTH - 0.04, 0.006)
liq.data.materials.append(M_POLISH)
_b = bmesh.new(); _b.from_mesh(liq.data)
for f_ in _b.faces: f_.smooth = True
for e_ in _b.edges:
    if len(e_.link_faces) == 2 and e_.calc_face_angle(0) > math.radians(42): e_.smooth = False
_b.to_mesh(liq.data); _b.free()

# découpeur : champ de hauteur (niveau du vernis, qui monte depuis le point de versement)
NX = 96
cut_me = bpy.data.meshes.new('cutter')
verts, faces = [], []
for i in range(NX + 1):
    x = -2.3 + 4.6 * i / NX
    verts += [(x, -1, -0.5), (x, 1, -0.5), (x, -1, 0.0), (x, 1, 0.0)]
for i in range(NX):
    a, b = 4 * i, 4 * (i + 1)
    faces += [(a + 2, b + 2, b + 3, a + 3), (a, a + 1, b + 1, b), (a, b, b + 2, a + 2), (a + 1, a + 3, b + 3, b + 1)]
faces += [(0, 2, 3, 1), (4 * NX, 4 * NX + 1, 4 * NX + 3, 4 * NX + 2)]
cut_me.from_pydata(verts, [], faces); cut_me.update()
cutter = bpy.data.objects.new('cutter', cut_me); sc.collection.objects.link(cutter)
cutter.hide_render = True; cutter.data.materials.append(M_POLISH)
lb = liq.modifiers.new('level', 'BOOLEAN'); lb.operation = 'INTERSECT'; lb.object = cutter; lb.material_mode = 'TRANSFER'; lb.solver = 'EXACT'

def set_logo_level(fn):
    for i in range(NX + 1):
        x = -2.3 + 4.6 * i / NX
        z = fn(x)
        cut_me.vertices[4 * i + 2].co.z = z; cut_me.vertices[4 * i + 3].co.z = z
    cut_me.update()

# ---------------- flacon ----------------
BW, BD, BH = 0.98, 0.62, 0.92          # verre (corps)
bottle = bpy.data.objects.new('bottle', None); sc.collection.objects.link(bottle)
body = rounded_box('body', BW, BD, BH, 0.17, M_GLASS); body.parent = bottle
cavity = rounded_box('bcav', BW - 0.14, BD - 0.14, BH - 0.24, 0.11, M_GLASS, z0=0.17)
cavity.hide_render = True; cavity.hide_viewport = True
hb = body.modifiers.new('hollow', 'BOOLEAN'); hb.operation = 'DIFFERENCE'; hb.object = cavity; hb.material_mode = 'TRANSFER'; hb.solver = 'EXACT'
cavity.parent = bottle
neck = cyl('neck', 0.15, 0.13, M_GLASS, z0=BH - 0.01, bevel=0.01); neck.parent = bottle
# vernis dans le flacon (cavité réduite, coupée par un plan horizontal du monde)
bliq = rounded_box('bliq', BW - 0.15, BD - 0.15, BH - 0.25, 0.105, M_POLISH, z0=0.175); bliq.parent = bottle
blevel = rounded_box('blevel', 6, 6, 6, 0.0, M_POLISH, seg=1, z0=-6); blevel.hide_render = True; blevel.hide_viewport = True
bb = bliq.modifiers.new('level', 'BOOLEAN'); bb.operation = 'INTERSECT'; bb.object = blevel; bb.material_mode = 'TRANSFER'; bb.solver = 'EXACT'
# étiquette
lab_me = bpy.data.meshes.new('label')
lw, lh = 0.66, 0.66 * 186 / 600
lab_me.from_pydata([(-lw / 2, 0, 0), (lw / 2, 0, 0), (lw / 2, 0, lh), (-lw / 2, 0, lh)], [], [(0, 1, 2, 3)])
lab_me.uv_layers.new(); uv = lab_me.uv_layers[0].data
for i, c in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]): uv[i].uv = c
label = bpy.data.objects.new('label', lab_me); link(label, M_LABEL); label.parent = bottle
label.location = (0, -BD / 2 - 0.004, 0.24)

# bouchon + pinceau (pivot = axe du flacon, en haut du col)
CAPZ = BH + 0.004
cap = bpy.data.objects.new('cap', None); sc.collection.objects.link(cap); cap.parent = bottle
cap.location = (0, 0, CAPZ)
capm = rounded_box('capm', 0.36, 0.36, 0.86, 0.06, M_CAP, seg=5); capm.parent = cap
# tige raccourcie : le bout du pinceau reste au-dessus du fond en verre épais (sinon on le voit dépasser en bas du flacon)
STEM_L = 0.35
stem = cyl('stem', 0.032, STEM_L, M_STEM, z0=-STEM_L, seg=24); stem.parent = cap
# pinceau de vernis : plat, en éventail, bout arrondi, chargé de vernis
FER = cyl('ferrule', 0.04, 0.05, M_STEM, z0=-STEM_L - 0.05, seg=32); FER.parent = cap
br_me = bpy.data.meshes.new('brush')
# bloc subdivisé puis déformé : poils plats qui s'ouvrent en éventail, bout coupé droit et arrondi
_bb = bmesh.new(); bmesh.ops.create_cube(_bb, size=1.0)
bmesh.ops.subdivide_edges(_bb, edges=[e for e in _bb.edges if abs((e.verts[0].co - e.verts[1].co).z) > 0.5], cuts=10, use_grid_fill=True)
bmesh.ops.subdivide_edges(_bb, edges=[e for e in _bb.edges if abs((e.verts[0].co - e.verts[1].co).x) > 0.5], cuts=4, use_grid_fill=True)
BL = 0.27
for v in _bb.verts:
    u = 0.5 - v.co.z                                   # 0 en haut (virole) → 1 au bout
    hw = 0.036 + 0.03 * u ** 0.9                       # demi-largeur : s'ouvre en éventail
    ht = 0.024 - 0.011 * u                             # demi-épaisseur : s'affine
    x = v.co.x * 2 * hw; y = v.co.y * 2 * ht
    z = -u * BL + 0.012 * (v.co.x * 2) ** 2 * (u > 0.97)    # bout légèrement bombé
    v.co = Vector((x, y, z))
_bb.to_mesh(br_me); _bb.free()
M_BRUSH = M_POLISH.copy(); M_BRUSH.name = 'brushpolish'
_n = M_BRUSH.node_tree; _bs = _n.nodes['Principled BSDF']
_wv = _n.nodes.new('ShaderNodeTexWave'); _wv.wave_type = 'BANDS'; _wv.bands_direction = 'X'
_wv.inputs['Scale'].default_value = 45; _wv.inputs['Distortion'].default_value = 2.0; _wv.inputs['Detail'].default_value = 2
_tc = _n.nodes.new('ShaderNodeTexCoord'); _n.links.new(_tc.outputs['Object'], _wv.inputs['Vector'])
_bp = _n.nodes.new('ShaderNodeBump'); _bp.inputs['Strength'].default_value = 0.25; _bp.inputs['Distance'].default_value = 0.002
_n.links.new(_wv.outputs['Fac'], _bp.inputs['Height']); _n.links.new(_bp.outputs['Normal'], _bs.inputs['Normal'])
brush = bpy.data.objects.new('brush', br_me); link(brush, M_BRUSH); brush.parent = cap
brush.location = (0, 0, -STEM_L - 0.05)
for p in br_me.polygons: p.use_smooth = True
brush.modifiers.new('sub', 'SUBSURF').levels = 1
drop = bpy.data.objects.new('drop', bpy.data.meshes.new('drop'))
bm_ = bmesh.new(); bmesh.ops.create_uvsphere(bm_, u_segments=24, v_segments=16, radius=0.026)
for v in bm_.verts:
    if v.co.z > 0: v.co.z *= 1.6
bm_.to_mesh(drop.data); bm_.free(); link(drop, M_POLISH); drop.parent = cap
for p in drop.data.polygons: p.use_smooth = True
drop.location = (0, 0, -STEM_L - 0.05 - 0.27 - 0.016)

# ---------------- filet de vernis ----------------
st_cu = bpy.data.curves.new('stream', 'CURVE'); st_cu.dimensions = '3D'
st_cu.bevel_depth = 0.042; st_cu.bevel_resolution = 6; st_cu.use_fill_caps = True
sp = st_cu.splines.new('BEZIER'); sp.bezier_points.add(3)
stream = bpy.data.objects.new('stream', st_cu); link(stream, M_POLISH)

# ---------------- sol (capteur d'ombres), lumières, caméra ----------------
fl = bpy.data.meshes.new('floor'); fl.from_pydata([(-20, -20, 0), (20, -20, 0), (20, 20, 0), (-20, 20, 0)], [], [(0, 1, 2, 3)])
floor = bpy.data.objects.new('floor', fl); link(floor); floor.is_shadow_catcher = True

def area(name, loc, rot, size, energy, color=(1, .97, .93), sx=None, cam=False):
    l = bpy.data.lights.new(name, 'AREA'); l.energy = energy; l.color = color
    if sx: l.shape = 'RECTANGLE'; l.size = size; l.size_y = sx
    else: l.size = size
    ob = bpy.data.objects.new(name, l); sc.collection.objects.link(ob)
    ob.location = loc; ob.rotation_euler = Euler([math.radians(a) for a in rot])
    ob.visible_camera = cam
    return ob

area('key', (-4.5, -4.0, 6.5), (40, 0, -45), 5.0, 520)
fl_ = area('fill', (5.0, -5.0, 2.5), (75, 0, 45), 6.0, 140); fl_.visible_glossy = False
area('rimL', (-3.6, 3.0, 2.6), (-70, 0, -40), 1.2, 320, sx=6.0)
area('rimR', (3.6, 3.0, 2.6), (-70, 0, 40), 1.2, 320, sx=6.0)
area('top', (0, 0, 7.5), (0, 0, 0), 3.0, 220)
# cartes sombres pour dessiner les bords du verre
def card(name, loc, rot, sx, sy, col):
    m = bpy.data.meshes.new(name); m.from_pydata([(-sx / 2, -sy / 2, 0), (sx / 2, -sy / 2, 0), (sx / 2, sy / 2, 0), (-sx / 2, sy / 2, 0)], [], [(0, 1, 2, 3)])
    ob = bpy.data.objects.new(name, m); link(ob, principled(name + 'm', **{'Base Color': srgb(col), 'Roughness': 0.9}))
    ob.location = loc; ob.rotation_euler = Euler([math.radians(a) for a in rot]); ob.visible_camera = False; ob.visible_shadow = False; ob.visible_diffuse = False
    return ob
card('flagL', (-3.2, 1.0, 3.3), (90, 0, -70), 2.0, 6.0, '#3A2218')
card('flagR', (3.2, 1.0, 3.3), (90, 0, 70), 2.0, 6.0, '#3A2218')

w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs[0].default_value = srgb('#F3EBE1')
w.node_tree.nodes['Background'].inputs[1].default_value = 0.42

cam_d = bpy.data.cameras.new('cam'); cam_d.lens = 70; cam_d.sensor_width = 36
cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (0, -11.6, 3.3)
look = Vector((0, 0, 2.2)) - cam.location
cam.rotation_euler = look.to_track_quat('-Z', 'Y').to_euler()
cam_d.dof.use_dof = True; cam_d.dof.focus_distance = (Vector((0, 0, 1.0)) - cam.location).length; cam_d.dof.aperture_fstop = 5.6

r = sc.render
r.engine = 'CYCLES'; r.film_transparent = True
sc.cycles.film_transparent_glass = False
r.resolution_x = int(sys.argv[sys.argv.index('--') + 1]) if '--' in sys.argv else 720
r.resolution_y = int(r.resolution_x * 4 / 3)
sc.cycles.samples = 128; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.015
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.max_bounces = 16; sc.cycles.transmission_bounces = 16; sc.cycles.glossy_bounces = 6
sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.cycles.blur_glossy = 1.0
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Punchy'
sc.view_settings.exposure = 0.15
r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'
r.use_persistent_data = True
sc.cycles.device = 'CPU'
r.threads_mode = 'AUTO'

# =========================================================================
# DÉCOR (v5) : studio crème, socle en travertin, colonnes, petits flacons nude,
# capsules d'ongles et perles qui flottent (flou d'arrière-plan)
# =========================================================================
import random
random.seed(5)
r.film_transparent = False
floor.is_shadow_catcher = False

def mat_travertine(name, col, scale=6.0, pores=0.35):
    m = bpy.data.materials.new(name); m.use_nodes = True
    t = m.node_tree; b = t.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = 0.62; b.inputs['Base Color'].default_value = srgb(col)
    tc = t.nodes.new('ShaderNodeTexCoord')
    nz = t.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = 8
    t.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    ramp = t.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = srgb(col); ramp.color_ramp.elements[1].color = tuple(c * 0.86 for c in srgb(col)[:3]) + (1,)
    ramp.color_ramp.elements[0].position = 0.35; ramp.color_ramp.elements[1].position = 0.75
    t.links.new(nz.outputs['Fac'], ramp.inputs['Fac']); t.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    vo = t.nodes.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = scale * 9
    t.links.new(tc.outputs['Object'], vo.inputs['Vector'])
    bp = t.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = pores; bp.inputs['Distance'].default_value = 0.004
    t.links.new(vo.outputs['Distance'], bp.inputs['Height']); t.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

M_WALL = principled('wall', **{'Base Color': srgb('#EFE2D3'), 'Roughness': 0.9})
M_FLOOR = mat_travertine('floor', '#EEE0CF', 2.0, 0.15)
M_TRAV = mat_travertine('trav', '#F0E4D5', 5.0, 0.4)
M_PEARL = principled('pearl', **{'Base Color': srgb('#F4EEE6'), 'Roughness': 0.22, 'Coat Weight': 1.0, 'Coat Roughness': 0.05,
                                 'Thin Film Thickness': 320.0, 'Thin Film IOR': 1.45})
NAIL_COLS = ['#4E2E22', '#6E4A32', '#AB9680', '#D8C6B6', '#E9D5C8', '#210202']
M_NAILS = [principled('nail' + c, **{'Base Color': srgb(c), 'Roughness': 0.12, 'Coat Weight': 1.0, 'Coat Roughness': 0.02}) for c in NAIL_COLS]
M_CHROME = principled('chrome', **{'Base Color': srgb('#D9C2A8'), 'Metallic': 1.0, 'Roughness': 0.12})
M_NUDE = principled('nudepolish', **{'Base Color': srgb('#C9A58E'), 'Roughness': 0.1, 'Coat Weight': 1.0, 'Coat Roughness': 0.02})
M_BEIGE = principled('beigepolish', **{'Base Color': srgb('#AB8A70'), 'Roughness': 0.1, 'Coat Weight': 1.0, 'Coat Roughness': 0.02})

# sol réel sous le socle, mur courbe (cyclo) au fond
FLOOR_Z = -0.32
floor.location.z = FLOOR_Z; floor.data.materials.append(M_FLOOR)
cyc = bpy.data.meshes.new('cyc'); vs_, fs_ = [], []
prof_ = [(y, FLOOR_Z) for y in (-30, 2.0)] + [(2.0 + 2.2 * math.sin(a), FLOOR_Z + 2.2 * (1 - math.cos(a))) for a in [i * math.pi / 2 / 10 for i in range(1, 11)]] + [(4.2, 25.0)]
for xi, x in enumerate((-30, 30)):
    for (y, z) in prof_: vs_.append((x, y + 4.0, z))
n_ = len(prof_)
for i in range(n_ - 1): fs_.append((i, i + 1, n_ + i + 1, n_ + i))
cyc.from_pydata(vs_, [], fs_); cyc.update()
cyc_ob = bpy.data.objects.new('cyc', cyc); link(cyc_ob, M_WALL)
for p in cyc.polygons: p.use_smooth = True
floor.hide_render = True                     # le cyclo fait office de sol (raccord sans couture)
cyc_ob.data.materials.clear(); cyc_ob.data.materials.append(M_FLOOR)

# socle sous le logo
plinth = rounded_box('plinth', 4.5, 1.05, -FLOOR_Z, 0.05, M_TRAV, seg=4, z0=FLOOR_Z)

# colonnes en travertin au fond, avec petits flacons et perles
def column(x, y, h, rad):
    c = cyl('col', rad, h, M_TRAV, z0=FLOOR_Z, seg=64, bevel=0.02); c.location = (x, y, 0); return c
column(-2.15, 2.9, 3.1, 0.55); column(2.35, 3.4, 2.2, 0.62); column(-0.4, 5.0, 1.4, 0.7)

def mini_bottle(x, y, z, s, liquid, yaw):
    g = bpy.data.objects.new('mini', None); sc.collection.objects.link(g)
    b_ = rounded_box('mb', BW, BD, BH, 0.17, M_GLASS); b_.parent = g
    l_ = rounded_box('ml', BW - 0.15, BD - 0.15, (BH - 0.25) * 0.8, 0.105, liquid, z0=0.175); l_.parent = g
    c_ = rounded_box('mc', 0.36, 0.36, 0.86, 0.06, M_CAP, seg=5, z0=BH + 0.004); c_.parent = g
    g.location = (x, y, z); g.scale = (s, s, s); g.rotation_euler = (0, 0, math.radians(yaw))
    return g
mini_bottle(-2.1, 2.9, FLOOR_Z + 3.1, 0.55, M_NUDE, 28)
mini_bottle(2.45, 3.4, FLOOR_Z + 2.2, 0.6, M_BEIGE, -22)

def pearl(loc, rad):
    o = bpy.data.objects.new('pearl', bpy.data.meshes.new('pearl'))
    b_ = bmesh.new(); bmesh.ops.create_uvsphere(b_, u_segments=32, v_segments=20, radius=rad); b_.to_mesh(o.data); b_.free()
    link(o, M_PEARL); o.location = loc
    for p in o.data.polygons: p.use_smooth = True
    return o
for k in range(5):
    pearl((2.1 + 0.18 * k - 0.1 * (k % 2), 3.15 - 0.12 * k, FLOOR_Z + 2.2 + 0.09), 0.09)
for k in range(4):
    pearl((-1.75 + 0.2 * k, 2.55 + 0.05 * k, FLOOR_Z + 3.1 + 0.08), 0.08)

# capsule d'ongle (forme amande, bombée)
def nail_mesh():
    me = bpy.data.meshes.new('nail'); NUu, NVv = 22, 14; vs, fs = [], []
    for iu in range(NUu + 1):
        u = iu / NUu
        hw = 0.5 * (0.78 + 0.5 * u * (1 - u) * 2.2) * (1 - u ** 2.4) ** 0.7 + 0.002
        for iv in range(NVv + 1):
            v = -1 + 2 * iv / NVv
            vs.append((v * hw * 0.32, -0.16 * (v * hw * 2) ** 2 - 0.05 * u * u, u * 0.62))
    for iu in range(NUu):
        for iv in range(NVv):
            a_ = iu * (NVv + 1) + iv; fs.append((a_, a_ + 1, a_ + NVv + 2, a_ + NVv + 1))
    me.from_pydata(vs, [], fs); me.update()
    return me
NAIL_ME = nail_mesh()
FLOATERS = []
def nail(loc, rot, mat, s=1.0):
    o = bpy.data.objects.new('nail', NAIL_ME.copy()); link(o, mat)
    sol = o.modifiers.new('sol', 'SOLIDIFY'); sol.thickness = 0.022; sol.offset = 0
    o.modifiers.new('sub', 'SUBSURF').levels = 2
    for p in o.data.polygons: p.use_smooth = True
    o.location = loc; o.rotation_euler = Euler([math.radians(a) for a in rot]); o.scale = (s, s, s)
    FLOATERS.append(dict(ob=o, loc=Vector(loc), rot=Vector(rot), ph=random.uniform(0, 6.28), amp=random.uniform(0.08, 0.2), spin=random.uniform(-40, 40)))
    return o
# arrière-plan (flou) et premier plan (très flou) : on garde le centre dégagé pour le flacon et le logo
SPOTS = [((-2.0, 1.6, 4.4), 0), ((2.1, 1.9, 4.9), 1), ((-1.5, 2.6, 2.4), 2), ((1.6, 2.4, 1.9), 3), ((-0.9, 3.4, 5.6), 4),
         ((0.9, 3.0, 5.9), 5), ((-2.4, 1.2, 1.4), 6), ((2.5, 1.0, 3.3), 0), ((0.2, 4.2, 4.2), 3), ((-2.2, -2.2, 0.0), 1),
         ((2.0, -2.6, 5.0), 2), ((1.9, -1.8, -0.1), 4)]
for (x, y, z), mi in SPOTS:
    mat = M_CHROME if mi == 6 else M_NAILS[mi % len(M_NAILS)]
    nail((x, y, z), (random.uniform(-70, 70), random.uniform(-70, 70), random.uniform(0, 360)), mat, random.uniform(0.9, 1.25))
for (x, y, z) in [(-1.2, 1.8, 5.0), (1.3, 1.5, 3.9), (-2.5, 2.0, 3.0), (2.6, 2.6, 2.5), (0.5, 3.6, 6.4), (-0.4, 2.8, 3.6), (2.3, -2.0, 1.6), (-2.0, -1.5, 4.9)]:
    o = pearl((x, y, z), random.uniform(0.07, 0.13))
    FLOATERS.append(dict(ob=o, loc=Vector((x, y, z)), rot=Vector((0, 0, 0)), ph=random.uniform(0, 6.28), amp=random.uniform(0.06, 0.15), spin=0))

def animate_floaters(t):
    for f in FLOATERS:
        a = f['ph'] + t * 2.4
        f['ob'].location = f['loc'] + Vector((0.05 * math.sin(a * 0.7), 0, f['amp'] * math.sin(a)))
        f['ob'].rotation_euler = Euler([math.radians(f['rot'].x + 8 * math.sin(a)), math.radians(f['rot'].y + 6 * math.cos(a)), math.radians(f['rot'].z + f['spin'] * t)])

# caméra : plein écran téléphone (≈ 0,46), plus haut et plus serré
r.resolution_y = int(r.resolution_x * 1430 / 660)
cam_d.lens = 50
cam.location = (0, -13.3, 2.55)
look = Vector((0, 0, 2.15)) - cam.location
cam.rotation_euler = look.to_track_quat('-Z', 'Y').to_euler()
cam_d.dof.focus_distance = (Vector((0, 0, 1.2)) - cam.location).length; cam_d.dof.aperture_fstop = 2.2
sc.cycles.samples = 64
w.node_tree.nodes['Background'].inputs[1].default_value = 0.5
w.node_tree.nodes['Background'].inputs[0].default_value = srgb('#FFF1E2')
sc.view_settings.exposure = 0.55
