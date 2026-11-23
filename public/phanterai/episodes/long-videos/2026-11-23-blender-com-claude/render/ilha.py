import bpy, math, random, sys
random.seed(7)
argv = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
out = argv[0] if argv else "/root/blender-work/ilha/f_"
fs = int(argv[1]) if len(argv)>1 else 1
fe = int(argv[2]) if len(argv)>2 else 1
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def mat(nome, cor, rough=0.6, emis=None, metal=0.0):
    m = bpy.data.materials.new(nome); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*cor, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if emis: b.inputs["Emission Color"].default_value = (*emis, 1); b.inputs["Emission Strength"].default_value = 4
    return m
def obj_mat(o, m): o.data.materials.append(m)
grama = mat("grama", (0.18, 0.55, 0.16)); terra = mat("terra", (0.35, 0.2, 0.1), 0.9)
tronco = mat("tronco", (0.3, 0.17, 0.07)); folha = mat("folha", (0.1, 0.45, 0.12)); folha2 = mat("folha2", (0.85, 0.45, 0.1))
parede = mat("parede", (0.95, 0.9, 0.8)); telhado = mat("telhado", (0.7, 0.12, 0.1)); janela = mat("janela", (1, 0.8, 0.4), 0.3, emis=(1, 0.65, 0.25))
agua = mat("agua", (0.1, 0.45, 0.8), 0.05); nuvem = mat("nuvem", (1, 1, 1), 1.0)
# ilha: topo + base em cone invertido
bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=3, depth=0.4, location=(0,0,0)); topo = bpy.context.object; obj_mat(topo, grama)
bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=3, radius2=0.3, depth=3.2, location=(0,0,-1.8), rotation=(math.pi,0,0)); base = bpy.context.object; obj_mat(base, terra)
# lago
bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.9, depth=0.05, location=(1.2,-1.0,0.21)); obj_mat(bpy.context.object, agua)
# arvores
def arvore(x,y,s,m):
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.09*s, depth=0.8*s, location=(x,y,0.2+0.4*s)); obj_mat(bpy.context.object, tronco)
    bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=0.5*s, depth=1.1*s, location=(x,y,0.2+1.2*s)); obj_mat(bpy.context.object, m)
    bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=0.38*s, depth=0.8*s, location=(x,y,0.2+1.7*s)); obj_mat(bpy.context.object, m)
for (x,y,s,m) in [(-1.8,0.8,1.0,folha),(-1.2,1.8,0.8,folha2),(-2.2,-0.6,0.7,folha),(0.4,2.2,0.9,folha),(2.2,1.0,0.75,folha2),(-0.6,-2.2,0.7,folha)]:
    arvore(x,y,s,m)
# casinha
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.2,0.2,0.7)); c = bpy.context.object; c.scale=(1.0,0.8,0.5); obj_mat(c, parede)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.85, depth=0.6, location=(0.2,0.2,1.5), rotation=(0,0,math.pi/4)); t = bpy.context.object; t.scale=(1.25,1.0,1); obj_mat(t, telhado)
for dx in (-0.25, 0.25):
    bpy.ops.mesh.primitive_cube_add(size=0.2, location=(0.2+dx,-0.21,0.75)); obj_mat(bpy.context.object, janela)
# nuvens
for i in range(5):
    a = i*2*math.pi/5+0.6; r = 3.9
    for k in range(3):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.55-0.1*k, location=(r*math.cos(a)+0.5*k, r*math.sin(a), 3.3+0.4*math.sin(i)+0.1*k)); obj_mat(bpy.context.object, nuvem)
# luz e mundo
bpy.ops.object.light_add(type='SUN', location=(5,-5,8)); sol = bpy.context.object; sol.data.energy = 4; sol.data.color=(1,0.85,0.7); sol.rotation_euler=(math.radians(50),0,math.radians(40))
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes["Background"]; bg.inputs[1].default_value = 1.0
grad = w.node_tree.nodes.new("ShaderNodeTexGradient"); ramp = w.node_tree.nodes.new("ShaderNodeValToRGB"); coord = w.node_tree.nodes.new("ShaderNodeTexCoord"); mp = w.node_tree.nodes.new("ShaderNodeMapping")
mp.inputs["Rotation"].default_value = (0, 0, math.radians(-90)); mp.inputs["Location"].default_value = (0, 1, 0)
w.node_tree.links.new(coord.outputs["Window"], mp.inputs[0]); w.node_tree.links.new(mp.outputs[0], grad.inputs[0]); w.node_tree.links.new(grad.outputs[0], ramp.inputs[0]); w.node_tree.links.new(ramp.outputs[0], bg.inputs[0])
ramp.color_ramp.elements[0].color = (0.45, 0.25, 0.75, 1); ramp.color_ramp.elements[1].color = (1.0, 0.55, 0.3, 1)
# camera orbitando
bpy.ops.object.empty_add(location=(0,0,0.3)); alvo = bpy.context.object
bpy.ops.object.camera_add(location=(9,0,3.6)); cam = bpy.context.object; sc.camera = cam
tc = cam.constraints.new('TRACK_TO'); tc.target = alvo
bpy.ops.object.empty_add(location=(0,0,0)); piv = bpy.context.object; cam.parent = piv
piv.rotation_euler = (0,0,0); piv.keyframe_insert("rotation_euler", frame=1)
piv.rotation_euler = (0,0,math.radians(120)); piv.keyframe_insert("rotation_euler", frame=180)
for fc in piv.animation_data.action.fcurves if hasattr(piv.animation_data.action,'fcurves') else []:
    for k in fc.keyframe_points: k.interpolation = 'LINEAR'
cam.data.lens = 34
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16
sc.view_settings.view_transform = 'AgX'
try:
    sc.view_settings.look = 'AgX - Punchy'
except Exception as e: print('look', e); sc.cycles.use_denoising = True
sc.render.resolution_x = 1280; sc.render.resolution_y = 720; sc.render.fps = 30
sc.frame_start = fs; sc.frame_end = fe
sc.render.image_settings.file_format = 'JPEG'; sc.render.filepath = out
sc.render.threads_mode = 'FIXED'; sc.render.threads = 3
bpy.ops.wm.save_as_mainfile(filepath="/root/blender-work/ilha.blend")
bpy.ops.render.render(animation=True)
