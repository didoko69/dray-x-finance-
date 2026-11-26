# Professional YouTube thumbnail compositor (shared by Divine survival and Dray x finance).
# Usage: python3 tools/pro_thumb.py <ep>   (reads episodes/<ep>/pro_thumb.json, needs work/<ep> with the engine copied in)
# Output: out/<ep>/thumbnail.jpg (1280x720, <2 MB) and work/<ep>/thumb_320.jpg (phone-size check)
#
# pro_thumb.json:
# {
#  "bg":     {shot dict: env, light, cam, actors, fx, ...},          scene behind everything
#  "grade":  {"sat": 0.7, "bright": 0.7, "contrast": 1.15, "tint": "#ff2a1a", "tint_amt": 0.25, "blur": 3},
#  "burst":  {"x": 1400, "y": 500, "color": "#ffb000", "rays": 18, "alpha": 0.55, "r": 1100},   light rays behind the subject
#  "layers": [ {"shot": {cam, actors, fx (rendered on a green screen)}, "outline": "#ffffff", "outline_px": 12,
#               "rim": "#ffd27a", "shadow": true, "glow": "#ff3020"} ],                          keyed cut-out characters / props
#  "glows":  [[x, y, r, "#ff2020"]],                                  glowing eyes / lights, drawn last
#  "vignette": 0.65,
#  "text": [ {"t": "IT'S OPEN", "x": 1880, "y": 30, "size": 250, "fill": "#ffe600", "fill2": "#ff9d00", "anchor": "right",
#             "rot": -3, "extrude": 12, "box": null, "stroke": 18} ],     box = colour of a solid block behind the text
#  "arrow": [x0, y0, x1, y1], "circle": [x, y, r]
# }
import json, sys, os, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops

ep = sys.argv[1]; W = f'work/{ep}'; E = f'episodes/{ep}'
cfg = json.load(open(f'{E}/pro_thumb.json'))
FONT = next((p for p in ['fonts/Anton-Regular.ttf', '/usr/share/fonts/truetype/google-fonts/ofl/anton/Anton-Regular.ttf'] if os.path.exists(p)), '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
hexc = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

# ---------- render all shots with the engine ----------
def shot(d, i):
    d = dict(d); d.setdefault('text', None); d.setdefault('fx', []); d.setdefault('au', {}); d.setdefault('card', None)
    d.setdefault('actors', []); d.setdefault('light', ''); d.setdefault('cam', [960, 540, 1, 1, 0, 0]); d['cam'] = list(d['cam'])
    if len(d['cam']) == 4: d['cam'] += [0, 0]
    d['cam'][3] = d['cam'][2]  # no zoom drift
    d['start'] = i * 3; d['end'] = i * 3 + 3; d['nopunch'] = 1
    if 'tt' not in d: d['tt'] = 0.3 + ((0.9 - i * 3) % 3.7) * 0.6  # land between blinks (blink every ~3.7 s)
    return d
shots = [shot(cfg['bg'], 0)] + [shot(dict(L['shot'], env='tgreen', light=''), i + 1) for i, L in enumerate(cfg.get('layers', []))]
json.dump(shots, open(f'{W}/th.json', 'w'))
open(f'{W}/ep_tgreen.js', 'w').write("ENV.tgreen = L => `<rect width=\"1920\" height=\"1080\" fill=\"#00ff00\"/>`;\n")
page = open(f'{W}/page.html').read()
if 'ep_tgreen.js' not in page: open(f'{W}/page.html', 'w').write(page.replace('</body>', '<script src="ep_tgreen.js"></script></body>'))
subprocess.run(['cp', 'engine/th2.js', W], check=True)
subprocess.run(['node', 'th2.js'], cwd=W, check=True)

# ---------- background: grade, blur, tint ----------
g = cfg.get('grade', {})
bg = Image.open(f'{W}/th0.png').convert('RGB')
if g.get('blur'): bg = bg.filter(ImageFilter.GaussianBlur(g['blur']))
bg = ImageEnhance.Color(bg).enhance(g.get('sat', .75))
bg = ImageEnhance.Brightness(bg).enhance(g.get('bright', .75))
bg = ImageEnhance.Contrast(bg).enhance(g.get('contrast', 1.15))
if g.get('tint'):
    bg = Image.blend(bg, ImageChops.multiply(bg, Image.new('RGB', bg.size, hexc(g['tint']))), g.get('tint_amt', .25))
im = bg.convert('RGBA')

# ---------- light burst ----------
b = cfg.get('burst')
if b:
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov); c = hexc(b.get('color', '#ffb000')); R = b.get('r', 1300); n = b.get('rays', 18)
    for k in range(n):
        a0 = 2 * math.pi * k / n; a1 = a0 + math.pi / n * .55
        od.polygon([(b['x'], b['y']), (b['x'] + R * math.cos(a0), b['y'] + R * math.sin(a0)), (b['x'] + R * math.cos(a1), b['y'] + R * math.sin(a1))], fill=c + (int(255 * b.get('alpha', .45) * .5),))
    for r, al in [(520, .25), (300, .35), (150, .5)]:
        od.ellipse((b['x'] - r, b['y'] - r, b['x'] + r, b['y'] + r), fill=c + (int(255 * b.get('alpha', .45) * al),))
    im = Image.alpha_composite(im, ov.filter(ImageFilter.GaussianBlur(18)))

# ---------- vignette ----------
v = cfg.get('vignette', .6)
if v:
    yy, xx = np.mgrid[0:1080, 0:1920]; d = np.sqrt(((xx - 960) / 960) ** 2 + ((yy - 540) / 540) ** 2)
    a = np.clip((d - .55) / .75, 0, 1) * v * 255
    im = Image.alpha_composite(im, Image.merge('RGBA', [Image.new('L', im.size, 0)] * 3 + [Image.fromarray(a.astype('uint8'))]))

# ---------- keyed layers (characters / props) with sticker outline, rim light, shadow ----------
for i, L in enumerate(cfg.get('layers', [])):
    lay = Image.open(f'{W}/th{i + 1}.png').convert('RGB'); a = np.asarray(lay).astype(int)
    key = (a[..., 1] > a[..., 0] + 40) & (a[..., 1] > a[..., 2] + 40)
    m = Image.fromarray(((~key) * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MedianFilter(5))
    # despill green on edges
    edge = np.asarray(m.filter(ImageFilter.MaxFilter(3))) ^ np.asarray(m.filter(ImageFilter.MinFilter(9)))  # only the cut-out border
    arr = np.asarray(lay).copy(); gmax = np.maximum(arr[..., 0], arr[..., 2]); e = edge > 0
    arr[..., 1][e] = np.minimum(arr[..., 1][e], gmax[e] + 10); lay = Image.fromarray(arr)
    if L.get('shade', 0.35):  # soft inner shadow from bottom-right gives the flat cartoon some volume
        sm2 = ImageChops.subtract(m, ImageChops.offset(m, -40, -40)).filter(ImageFilter.GaussianBlur(28)).point(lambda q: int(q * L.get('shade', .35)))
        lay = Image.composite(Image.new('RGB', lay.size, (40, 20, 30)), lay, sm2)
    if L.get('shadow', True):
        sm = m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(14)); sh = Image.new('RGBA', im.size, (0, 0, 0, 0))
        sh.paste(Image.new('RGBA', im.size, (0, 0, 0, 190)), (18, 22), sm); im = Image.alpha_composite(im, sh)
    if L.get('glow'):
        gm = m.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(26))
        im = Image.alpha_composite(im, Image.merge('RGBA', (*[Image.new('L', im.size, c) for c in hexc(L['glow'])], gm.point(lambda q: int(q * .9)))))
    op = L.get('outline_px', 12)
    if L.get('outline', '#ffffff') and op:
        om = m.filter(ImageFilter.MaxFilter(op * 2 + 1)); bm = om.filter(ImageFilter.MaxFilter(5))
        im.paste(Image.new('RGBA', im.size, (12, 10, 12, 255)), (0, 0), bm)
        im.paste(Image.new('RGBA', im.size, hexc(L.get('outline', '#ffffff')) + (255,)), (0, 0), om)
    im.paste(lay.convert('RGBA'), (0, 0), m)
    if L.get('rim'):  # inner rim light on one side
        dx = L.get('rim_dx', 14); sh_m = ImageChops.subtract(m, ImageChops.offset(m, dx, 0)).filter(ImageFilter.GaussianBlur(5))
        im = Image.alpha_composite(im, Image.merge('RGBA', (*[Image.new('L', im.size, c) for c in hexc(L['rim'])], sh_m.point(lambda q: int(q * .8)))))

# ---------- glows (eyes, lights) ----------
for x, y, r, col in cfg.get('glows', []):
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov); c = hexc(col)
    for rr, al in [(r * 3, 60), (r * 1.6, 140), (r, 255)]: od.ellipse((x - rr, y - rr, x + rr, y + rr), fill=c + (al,))
    od.ellipse((x - r * .4, y - r * .4, x + r * .4, y + r * .4), fill=(255, 240, 200, 255))
    im = Image.alpha_composite(im, ov.filter(ImageFilter.GaussianBlur(max(2, r // 3))))

d = ImageDraw.Draw(im)
# ---------- arrow / circle ----------
if cfg.get('circle'):
    x, y, r = cfg['circle']
    for w, col in [(30, (0, 0, 0, 255)), (18, (255, 40, 25, 255))]: d.ellipse((x - r, y - r, x + r, y + r), outline=col, width=w)
if cfg.get('arrow'):
    x0, y0, x1, y1 = cfg['arrow']; ang = math.atan2(y1 - y0, x1 - x0); Lh = 90
    head = lambda s: [(x1 + s * math.cos(ang), y1 + s * math.sin(ang)), (x1 - Lh * math.cos(ang - .55), y1 - Lh * math.sin(ang - .55)), (x1 - Lh * math.cos(ang + .55), y1 - Lh * math.sin(ang + .55))]
    d.line([(x0, y0), (x1, y1)], fill=(0, 0, 0, 255), width=46); d.polygon(head(14), fill=(0, 0, 0, 255))
    d.line([(x0, y0), (x1, y1)], fill=(255, 40, 25, 255), width=30); d.polygon(head(0), fill=(255, 40, 25, 255))

# ---------- text: gradient fill, extrude, thick stroke, optional block ----------
def text_layer(tx):
    f = ImageFont.truetype(FONT, tx['size']); s = tx.get('stroke', 18); ex = tx.get('extrude', 12)
    bbox = ImageDraw.Draw(Image.new('L', (10, 10))).textbbox((0, 0), tx['t'], font=f, stroke_width=s)
    w, h = bbox[2] - bbox[0] + ex + 60, bbox[3] - bbox[1] + ex + 60; L = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ld = ImageDraw.Draw(L)
    ox, oy = 30 - bbox[0], 30 - bbox[1]
    if tx.get('box'):
        ld.rectangle((0, 0, w - ex - 20, h - ex - 20), fill=hexc(tx['box']) + (255,))
    for k in range(ex, 0, -2): ld.text((ox + k, oy + k), tx['t'], font=f, fill=(0, 0, 0, 255), stroke_width=s, stroke_fill=(0, 0, 0, 255))
    ld.text((ox, oy), tx['t'], font=f, fill=(0, 0, 0, 255), stroke_width=s, stroke_fill=(0, 0, 0, 255))
    mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).text((ox, oy), tx['t'], font=f, fill=255)
    c1, c2 = hexc(tx.get('fill', '#ffe600')), hexc(tx.get('fill2', tx.get('fill', '#ffe600')))
    grad = Image.new('RGBA', (w, h)); gd = ImageDraw.Draw(grad)
    for y in range(h): t = y / h; gd.line([(0, y), (w, y)], fill=tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)) + (255,))
    L.paste(grad, (0, 0), mask)
    hl = Image.new('L', (w, h), 0); ImageDraw.Draw(hl).text((ox, oy - max(2, tx['size'] // 60)), tx['t'], font=f, fill=70)  # top highlight
    L = Image.alpha_composite(L, Image.merge('RGBA', [Image.new('L', (w, h), 255)] * 3 + [ImageChops.multiply(hl, mask)]))
    if tx.get('rot'): L = L.rotate(tx['rot'], resample=Image.BICUBIC, expand=True)
    return L
for tx in cfg.get('text', []):
    L = text_layer(tx); x = tx['x'] - (L.width if tx.get('anchor') == 'right' else L.width // 2 if tx.get('anchor') == 'center' else 0)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); sh.paste(L, (x + 10, tx['y'] + 14), L)
    alpha = sh.split()[3].point(lambda q: int(q * .55)).filter(ImageFilter.GaussianBlur(10))
    im = Image.alpha_composite(im, Image.merge('RGBA', [Image.new('L', im.size, 0)] * 3 + [alpha]))
    im.alpha_composite(L, (max(0, x), max(0, tx['y'])))

out = ImageEnhance.Sharpness(im.convert('RGB')).enhance(1.25)
os.makedirs(f'out/{ep}', exist_ok=True)
out.resize((1280, 720), Image.LANCZOS).save(f'out/{ep}/thumbnail.jpg', quality=90)
out.resize((320, 180), Image.LANCZOS).save(f'{W}/thumb_320.jpg', quality=90)
print('pro thumb ok')
