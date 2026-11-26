# Finance thumbnail: episodes/<ep>/thumb.json =
#  {"shot": {...one shot dict...}, "big": "€1.9B", "line": "VANISHED", "big_col": "#f2c418", "x": 60, "arrow": [x1,y1,x2,y2] (optional), "dim": .7}
# Renders the shot with the engine (th2.js), darkens/desaturates it, adds huge text with thick outline. Output out/<ep>/thumbnail.jpg (1280x720, <2MB)
import json, sys, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
ep = sys.argv[1]; W = f'work/{ep}'; E = f'episodes/{ep}'
cfg = json.load(open(f'{E}/thumb.json')); sh = cfg['shot']; sh.setdefault('start', 0); sh.setdefault('end', 3); sh.setdefault('text', None); sh.setdefault('fx', []); sh.setdefault('au', {}); sh['nopunch'] = 1
json.dump([sh], open(f'{W}/th.json', 'w'))
subprocess.run(['cp', 'engine/th2.js', W], check=True); subprocess.run(['node', 'th2.js'], cwd=W, check=True)
im = Image.open(f'{W}/th0.png').convert('RGB')
im = ImageEnhance.Brightness(ImageEnhance.Color(im).enhance(cfg.get('sat', .8))).enhance(cfg.get('dim', .8))
d = ImageDraw.Draw(im)
FA = '/usr/share/fonts/truetype/google-fonts/ofl/anton/Anton-Regular.ttf'
FA = FA if os.path.exists(FA) else '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
x = cfg.get('x', 60)
d.text((x, 40), cfg['big'], font=ImageFont.truetype(FA, cfg.get('big_size', 260)), fill=cfg.get('big_col', '#f2c418'), stroke_width=16, stroke_fill='black')
if cfg.get('line'): d.text((x, cfg.get('line_y', 340)), cfg['line'], font=ImageFont.truetype(FA, cfg.get('line_size', 150)), fill=cfg.get('line_col', 'white'), stroke_width=14, stroke_fill='black')
if cfg.get('arrow'):
    x1, y1, x2, y2 = cfg['arrow']; d.line((x1, y1, x2, y2), fill='#e0201a', width=26)
    import math; a = math.atan2(y2 - y1, x2 - x1); L = 70
    d.polygon([(x2, y2), (x2 - L * math.cos(a - .5), y2 - L * math.sin(a - .5)), (x2 - L * math.cos(a + .5), y2 - L * math.sin(a + .5))], fill='#e0201a')
os.makedirs(f'out/{ep}', exist_ok=True); im = im.resize((1280, 720), Image.LANCZOS); im.save(f'out/{ep}/thumbnail.jpg', quality=88)
im.resize((320, 180)).save(f'{W}/thumb_small.jpg'); print('thumb ok')
