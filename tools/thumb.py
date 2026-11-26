# Thumbnail: renders episodes/<ep>/thumb_shots.json (shot 0 = inset, shot 1 = main) and adds text from thumb.txt
import json, sys, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
ep = sys.argv[1]; W = f'work/{ep}'; E = f'episodes/{ep}'
# v2 layout (thumb.json has "v": 2): shot 0 = background + threat, shot 1 = hero on ENV.tgreen (chroma key, same camera).
#   Hero is keyed out, given a light rim/glow and pasted over a darkened, desaturated background with a dark foreground fade
#   (keeps the bottom-right timestamp corner empty). Optional glowing "eyes", red "arrow"/"circle", and 1-2 text lines (Anton).
if json.load(open(f'{E}/thumb.json')).get('v') == 2:
    from PIL import ImageFilter, ImageChops
    import numpy as np
    cfg = json.load(open(f'{E}/thumb.json'))
    subprocess.run(['cp', f'{E}/thumb_shots.json', f'{W}/th.json'], check=True)
    subprocess.run(['cp', 'engine/th2.js', W], check=True)
    subprocess.run(['node', 'th2.js'], cwd=W, check=True)
    bg = Image.open(f'{W}/th0.png').convert('RGB'); hero = Image.open(f'{W}/th1.png').convert('RGB')
    bg = ImageEnhance.Brightness(ImageEnhance.Color(bg).enhance(cfg.get('bg_sat', .35))).enhance(cfg.get('bg_dim', .6))
    a = np.asarray(hero).astype(int); key = (a[..., 1] > a[..., 0] + 50) & (a[..., 1] > a[..., 2] + 50)
    m = Image.fromarray(((~key) * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    im = bg.convert('RGBA')
    # foreground fade (hides the threat's lower body, empties the bottom-right corner)
    fg = cfg.get('fg', 760); grad = Image.new('L', im.size, 0); gd = ImageDraw.Draw(grad)
    for y in range(fg, 1080): gd.line([(0, y), (1920, y)], fill=int(255 * min(1, (y - fg) / 140)))
    im = Image.composite(Image.new('RGBA', im.size, (8, 6, 8, 255)), im, grad)
    for ex, ey in cfg.get('eyes', []):
        ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
        for r, al in [(34, 70), (18, 160), (8, 255)]: od.ellipse((ex - r, ey - r, ex + r, ey + r), fill=(255, 40 if r > 10 else 200, 20, al))
        im = Image.alpha_composite(im, ov.filter(ImageFilter.GaussianBlur(3)))
    # rim light: dilated hero mask, blurred, warm colour, under the hero
    rimc = tuple(int(cfg.get('rim', '#ffd27a')[i:i + 2], 16) for i in (1, 3, 5))
    rm = m.filter(ImageFilter.MaxFilter(cfg.get('rim_px', 15))).filter(ImageFilter.GaussianBlur(6))
    im = Image.alpha_composite(im, Image.merge('RGBA', (*[Image.new('L', im.size, c) for c in rimc], rm.point(lambda v: int(v * .95)))))
    im.paste(hero, (0, 0), m)
    d = ImageDraw.Draw(im)
    if cfg.get('arrow'):
        x0, y0, x1, y1 = cfg['arrow']; d.line([(x0, y0), (x1, y1)], fill='#ff2a1a', width=26)
        import math
        ang = math.atan2(y1 - y0, x1 - x0); L = 70
        d.polygon([(x1 + 20 * math.cos(ang), y1 + 20 * math.sin(ang)), (x1 - L * math.cos(ang - .5), y1 - L * math.sin(ang - .5)), (x1 - L * math.cos(ang + .5), y1 - L * math.sin(ang + .5))], fill='#ff2a1a')
    if cfg.get('circle'):
        x, y, r = cfg['circle']; d.ellipse((x - r, y - r, x + r, y + r), outline='#ff2a1a', width=16)
    FA = '/usr/share/fonts/truetype/google-fonts/ofl/anton/Anton-Regular.ttf'
    FA = FA if os.path.exists(FA) else '/usr/share/fonts/truetype/dejavu/DejaVu-Sans-Bold.ttf'
    for tx in cfg['text']:
        f = ImageFont.truetype(FA, tx['size']); x = tx['x']
        if tx.get('anchor') == 'right': x -= d.textlength(tx['t'], font=f)
        d.text((x, tx['y']), tx['t'], font=f, fill=tx.get('color', '#ffd400'), stroke_width=tx.get('stroke', 16), stroke_fill='black')
    im = ImageEnhance.Contrast(im.convert('RGB')).enhance(1.1)
    os.makedirs(f'out/{ep}', exist_ok=True); im = im.resize((1280, 720), Image.LANCZOS); im.save(f'out/{ep}/thumbnail.jpg', quality=90)
    im.resize((320, 180), Image.LANCZOS).save(f'{W}/thumb_320.jpg', quality=90)
    print('thumb ok (v2)'); sys.exit(0)
subprocess.run(['cp', f'{E}/thumb_shots.json', f'{W}/th.json'], check=True)
subprocess.run(['cp', 'engine/th.js', W], check=True)
subprocess.run(['node', 'th.js'], cwd=W, check=True)
cfg = json.load(open(f'{E}/thumb.json'))
a = Image.open(f'{W}/th0.png').convert('RGB'); b = Image.open(f'{W}/th1.png').convert('RGB')
im = b
if cfg.get('glow'):
    x, y = cfg['glow']
    for r, al in [(150, 40), (80, 90), (26, 255)]:
        ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(ov).ellipse((x - r, y - r, x + r, y + r), fill=(255, 244, 192, al))
        im = Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB')
d = ImageDraw.Draw(im)
if cfg.get('inset', True):
    c = cfg.get('inset_crop', [180, 380, 1740, 1060]); box = cfg.get('inset_box', [1080, 640, 1880, 989])
    im.paste(a.crop(c).resize((box[2] - box[0], box[3] - box[1])), (box[0], box[1])); d.rectangle(box, outline='#e03a2a', width=10)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
d.text((50, 40), cfg['line1'], font=ImageFont.truetype(F, 150), fill='#f2c418', stroke_width=14, stroke_fill='black')
d.text((50, 210), cfg['line2'], font=ImageFont.truetype(F, 96), fill='white', stroke_width=14, stroke_fill='black')
im = ImageEnhance.Color(ImageEnhance.Contrast(im).enhance(1.12)).enhance(1.2)
os.makedirs(f'out/{ep}', exist_ok=True); im.resize((1280, 720)).save(f'out/{ep}/thumbnail.jpg', quality=85)
print('thumb ok')
