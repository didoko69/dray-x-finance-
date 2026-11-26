import json, numpy as np, soundfile as sf
import math
def rnd_py(x):
    v = math.sin(x * 127.1 + 311.7) * 43758.5453
    return v - math.floor(v)
from scipy import signal
from scipy.ndimage import uniform_filter1d
sr = 24000
TL = json.load(open('timeline.json'))
T = TL[-1]['end']; n = int(sr * T) + sr; t = (np.arange(n) / sr).astype(np.float32)
rng = np.random.default_rng(11)

def filt(x, lo=None, hi=None, order=4):
    o = max(1, order // 2)
    if lo and hi: sos = signal.butter(o, [lo, min(hi, sr / 2 - 100)], 'bandpass', fs=sr, output='sos')
    elif hi: sos = signal.butter(o, min(hi, sr / 2 - 100), 'lowpass', fs=sr, output='sos')
    elif lo: sos = signal.butter(o, lo, 'highpass', fs=sr, output='sos')
    else: return x
    return signal.sosfilt(sos, x).astype(np.float32)
def reverb(x, sec=2.5, wet=.4):
    L = int(sec * sr); d = np.arange(L) / sr; h = (rng.standard_normal(L) * np.exp(-d * 3 / sec)).astype(np.float32); h[:int(.01 * sr)] = 0
    y = signal.oaconvolve(x, h)[:len(x)].astype(np.float32)
    y *= (np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-9) / (np.sqrt(np.mean(y.astype(np.float64) ** 2)) + 1e-9)
    return (x * (1 - wet) + y * wet).astype(np.float32)
def curve(key, smooth=1.5, default=0):
    c = np.zeros(n, np.float32)
    for s in TL: c[int(s['start'] * sr):int(s['end'] * sr)] = s['au'].get(key, default)
    k = int(smooth * sr) | 1
    return np.clip(uniform_filter1d(c, k), 0, None) if k > 1 else c
def add(buf, at, x, g=1.0):
    i = int(at * sr)
    if i < 0: x = x[-i:]; i = 0
    m = min(len(x), n - i)
    if m > 0: buf[i:i + m] += x[:m] * g
def seg(d): return (np.arange(int(d * sr)) / sr).astype(np.float32)
noise = lambda L: rng.standard_normal(L).astype(np.float32)

# ---------- beds ----------
tens = curve('tension', 2.0, .3)
dr = np.zeros(n, np.float32)
for fr, a in [(46.25, .5), (92.5, .6), (185, .5), (370, .25), (392, .12), (554, .07)]:
    dr += (a * np.sin(2 * np.pi * fr * t + rng.random() * 6) * (1 + .3 * np.sin(2 * np.pi * (.15 + rng.random() * .3) * t))).astype(np.float32)
bow = filt(noise(n), 250, 650)
pul = (np.sin(2 * np.pi * 55 * t) * np.exp(-((t * 1.1) % 1) * 6)).astype(np.float32)
drone = dr * (.25 + .9 * tens) + bow * 1.6 * tens ** 1.5 + pul * .9 * np.clip(tens - .6, 0, 1) * 2.5
drone = reverb(drone, 2.2, .35)
def pad(chords, length):
    out = np.zeros(n, np.float32)
    for k in range(int(T / length) + 1):
        ch = chords[k % len(chords)]; d = seg(length * 1.3); e = np.sin(np.clip(d / (length * 1.3), 0, 1) * np.pi) ** 1.3
        add(out, k * length, sum(np.sin(2 * np.pi * fr * d) * .3 + np.sin(2 * np.pi * fr * 1.003 * d) * .2 for fr in ch) * e)
    return out
def piano(notes, step):
    out = np.zeros(n, np.float32)
    for k in range(int(T / step)):
        fr = notes[k % len(notes)]; d = seg(2.5)
        add(out, k * step + .3, (np.sin(2 * np.pi * fr * d) + .4 * np.sin(4 * np.pi * fr * d) + .15 * np.sin(6 * np.pi * fr * d)) * np.exp(-d * 1.8))
    return out
warm_lv, sad_lv = curve('warm', 2.5), curve('sad', 2.5)
warm = pad([[130.8, 164.8, 196, 261.6], [110, 130.8, 164.8, 220], [87.3, 130.8, 174.6, 220], [98, 123.5, 146.8, 196]], 4.0) + .35 * piano([523.3, 659.3, 784, 659.3, 587.3, 698.5, 880, 698.5], 1.4)
sad = piano([440, 392, 349.2, 329.6, 293.7, 329.6, 349.2, 261.6], 1.6) + .6 * pad([[110, 130.8, 164.8], [87.3, 110, 130.8], [98, 116.5, 146.8], [82.4, 98, 123.5]], 6.4)
music = reverb(drone + warm * warm_lv * .9 + sad * sad_lv * .8, 2.0, .25)

hum = (np.sin(2 * np.pi * 120 * t) * .5 + np.sin(2 * np.pi * 240 * t) * .2).astype(np.float32) * curve('hum', .5) + filt(noise(n), 300, 1500) * .2 * curve('hum', .5)
buzz_lv = curve('buzz', .3)
buzz = (np.sign(np.sin(2 * np.pi * 120 * t)) * .15 * (np.random.default_rng(3).random(n // 2400 + 1).repeat(2400)[:n] > .5)).astype(np.float32) * buzz_lv
wind = filt(noise(n), 80, 600) * (0.6 + 0.4 * np.sin(2 * np.pi * .09 * t) ** 2) * curve('wind', 1.5)
city = (filt(noise(n), 60, 700) * 1.2) * curve('city', 1.0)
air = filt(noise(n), 80, 400) * .4
bed = music + hum * .5 + buzz * .6 + wind * .9 + city * .7 + air * .4

# siren (distant wail) where tagged
siren_lv = curve('siren', 1.2)
cyc = 4.2; ph = (t % cyc) / cyc
f = np.where(ph < .12, 950 + 950 * np.sin(ph / .12 * np.pi / 2), 1900 - 950 * ((ph - .12) / .88)) * (1 + .004 * np.sin(2 * np.pi * 6 * t))
phs = 2 * np.pi * np.cumsum(f) / sr
sir = reverb(filt((np.sin(phs) + .45 * np.sin(2 * phs) + .2 * np.sin(3 * phs)).astype(np.float32), None, 2600), 3.0, .65) * siren_lv
# alarm (store alarm: two-tone pulse) where tagged
al_lv = curve('alarm', .3)
alarm = (np.sign(np.sin(2 * np.pi * np.where((t * 2) % 1 < .5, 880, 660) * t)) * .3).astype(np.float32)
alarm = reverb(filt(alarm, 300, 3000), 1.5, .5) * al_lv

# ---------- cheerful store melody (original) ----------
MEL = [(523.3, .25), (659.3, .25), (784, .25), (1046.5, .5), (784, .25), (880, .25), (784, .25), (659.3, .5), (587.3, .25), (659.3, .25), (523.3, .75)]
def melody(at, g=.5, eff='store'):
    k = at
    for fr, d in MEL:
        dd = seg(d + .4); w = (np.sin(2 * np.pi * fr * dd) + .5 * np.sin(4 * np.pi * fr * dd) + .25 * np.sin(6 * np.pi * fr * dd)) * np.exp(-dd * 4)
        add(mel, k, w, g); k += d
mel = np.zeros(n, np.float32)

# ---------- SFX ----------
sfx = np.zeros(n, np.float32)
def hit(at, g=1.0):
    d = seg(3); w = np.sin(2 * np.pi * (55 - 22 * d) * d) * np.exp(-d * 2) + filt(noise(len(d)), None, 900) * np.exp(-d * 5) * .5
    add(sfx, at, reverb(w.astype(np.float32), 2.5, .4), g)
def riser(end, dur=2.0, g=.45):
    d = seg(dur); q = d / dur; x = filt(noise(len(d)), 300, None) * q ** 2.5 + np.sin(2 * np.pi * np.cumsum(200 + 1800 * q ** 2) / sr) * .3 * q ** 2; add(sfx, end - dur, x, g)
def heartbeat(a, b, g=.9):
    k = a
    while k < b:
        for off, amp in [(0, 1), (.28, .7)]: d = seg(.25); add(sfx, k + off, np.sin(2 * np.pi * 48 * d) * np.exp(-d * 18) * amp, g)
        k += 60 / 66
def groan(at, g=.5):
    dur = .9 + rng.random() * .9; d = seg(dur); f0 = 85 + rng.random() * 60
    fr = f0 * (1 + .12 * np.sin(2 * np.pi * (2 + rng.random() * 3) * d) - .15 * d / dur); saw = ((np.cumsum(fr) / sr) % 1) * 2 - 1
    x = filt(saw.astype(np.float32), 300, 1100, 2) + filt(noise(len(d)), 400, 1500) * .3; x *= np.sin(np.pi * d / dur) ** .7; add(sfx, at, reverb(x, 1.2, .3), g)
def scream(at, g=.4):
    dur = 1.2 + rng.random(); d = seg(dur); f0 = 300 + rng.random() * 250; fr = f0 * (1 + .3 * np.sin(np.pi * d / dur) + .05 * np.sin(2 * np.pi * 7 * d))
    saw = ((np.cumsum(fr) / sr) % 1) * 2 - 1; x = filt(saw.astype(np.float32), 600, 3000, 2) * np.sin(np.pi * d / dur) ** .5; add(sfx, at, reverb(x, 2.0, .6), g)
def tone(at, fr, dur, g=.3, decay=8):
    d = seg(dur); add(sfx, at, np.sin(2 * np.pi * fr * d) * np.exp(-d * decay) * np.minimum(1, d * 200), g)
def nz(at, dur, lo, hi, g=.4, dec=6):
    d = seg(dur); add(sfx, at, filt(noise(len(d)), lo, hi) * np.exp(-d * dec), g)
def thump(at, g=.8):
    d = seg(.5); add(sfx, at, np.sin(2 * np.pi * 70 * d) * np.exp(-d * 14) + filt(noise(len(d)), None, 600) * np.exp(-d * 25) * .6, g)
def clang(at, g=.4):
    d = seg(1.5); add(sfx, at, sum(np.sin(2 * np.pi * fr * d) * a for fr, a in [(523, 1), (1187, .6), (1931, .4), (2753, .25)]) * np.exp(-d * 4), g); thump(at, .4)
def step(at, g=.25): nz(at, .12, 100, 900, g, 30)
def chime(at): tone(at, 784, 1.2, .25, 3); tone(at + .45, 622, 1.4, .25, 3)
def shutter(at, dur, g=.4):
    d = seg(dur); x = filt(noise(len(d)), 80, 900) * (1 + .5 * np.sign(np.sin(2 * np.pi * 18 * d))); add(sfx, at, x, g * .7); thump(at + dur, 1.0); clang(at + dur, .25)
def glassbang(at, g=.6):
    thump(at, g); d = seg(.6); add(sfx, at, sum(np.sin(2 * np.pi * fr * d) for fr in [1800, 2600, 3500]) * np.exp(-d * 12) * .15, g)
def knock(at, g=.9):
    d = seg(.3); add(sfx, at, (np.sin(2 * np.pi * 120 * d) * np.exp(-d * 30) + filt(noise(len(d)), 200, 1500) * np.exp(-d * 40) * .5), g)
def motor(at, dur, g=.5):
    d = seg(dur); x = (np.sin(2 * np.pi * 50 * d) + .5 * np.sign(np.sin(2 * np.pi * 100 * d))) * (.6 + .4 * np.sin(2 * np.pi * 3 * d)) + filt(noise(len(d)), 60, 400) * .8
    env = np.minimum(1, d / .4) * np.minimum(1, (dur - d) / .4); add(sfx, at, filt(x.astype(np.float32), None, 800) * env, g)

for s in TL:
    au = s['au']; a, b = s['start'], s['end']; D = b - a
    if au.get('hit'): hit(a, .9 * au['hit'])
    if au.get('riser'): riser(b, min(2.0, D * .8))
    if au.get('hb'): heartbeat(a + .2, b)
    if au.get('groan'):
        for j in range(int(2 + D * .8 * au['groan'])): groan(a + rng.random() * D * .9, .35 * au['groan'])
    if au.get('scream'):
        for j in range(int(2 + D * au['scream'])): scream(a + rng.random() * D * .8, .25 * au['scream'])
    if au.get('melody'): melody(a + .2, .45 * au['melody'])
    if au.get('endmelody'): melody(b - 2.55, .3, 'radio')
    if au.get('pa') or au.get('chime'): chime(a + .1)
    if au.get('clunks'):
        for j in range(6): thump(a + .1 + j * .12, .5); nz(a + .1 + j * .12, .05, 2000, 6000, .3, 60)
    if au.get('shutter'): shutter(a + D * .05, D * .3)
    if au.get('scrape') or au.get('scrape_glass'):
        d = seg(D * .8); lo, hi = (600, 3000) if au.get('scrape') else (1200, 5000)
        add(sfx, a + .2, filt(noise(len(d)), lo, hi) * (np.abs(np.sin(2 * np.pi * .9 * d)) ** 2) + np.sin(2 * np.pi * (900 + 200 * np.sin(2 * np.pi * 1.3 * d)) * d) * .12, .35)
    if au.get('bangglass'):
        for j in range(int(1 + D * 1.5 * au['bangglass'])): glassbang(a + .1 + rng.random() * D * .8, .6)
    if au.get('thud') or au.get('thump'): thump(a + D * .3, 1.0)
    if au.get('slam'): thump(a + D * .6, 1.0); nz(a + D * .6, .2, 1000, 4000, .3, 20)
    if au.get('run'):
        k = a + .1
        while k < b: step(k, .3); k += .28
    if au.get('steps'):
        k = a + .2
        while k < b: step(k, .18 * au['steps']); k += .55
    if au.get('crowdpanic'):
        for j in range(int(D * 8)): step(a + rng.random() * D, .2)
        for j in range(4): scream(a + rng.random() * D * .8, .15)
    if au.get('drag'):
        for j in range(int(D / 1.2) + 1): nz(a + j * 1.2, 1.0, 200, 1500, .25, 2)
    if au.get('powerdown'):
        d = seg(1.5); add(sfx, a + D * .5, np.sin(2 * np.pi * np.cumsum(120 * np.exp(-d * 2)) / sr) * np.exp(-d * 1.5) * .5); thump(a + D * .5, .6)
    if au.get('paper'): nz(a + .3, .4, 1500, 6000, .2, 8)
    if au.get('rustle'):
        for j in range(int(D * 2)): nz(a + j * .5 + rng.random() * .3, .25, 1000, 6000, .15, 10)
    if au.get('strain'):
        d = seg(D * .7); add(sfx, a + .2, filt(noise(len(d)), 100, 600) * (np.abs(np.sin(2 * np.pi * 1.5 * d))) * .5 + np.sin(2 * np.pi * 70 * d) * .1)
    if au.get('knock1'): knock(a + D * .4, .6)
    if au.get('knocks'):
        for j in range(3): knock(a + .2 + j * .75, .9 * au['knocks'])
    if au.get('drip'):
        for j in range(int(D * 1.5)): tone(a + .3 + j * .7, 1400 - j * 40, .15, .1, 25)
    if au.get('growl'):
        d = seg(2.0); fr = 55 + 10 * np.sin(2 * np.pi * 3 * d); saw = ((np.cumsum(fr) / sr) % 1) * 2 - 1
        add(sfx, a + .3, reverb(filt(saw.astype(np.float32), 80, 600, 2) * np.sin(np.pi * d / 2.0), 1.5, .5), .6)
    if au.get('clock'):
        k = a + .2
        while k < b: tone(k, 2500, .04, .12, 80); k += 1.0
    if au.get('tick'):
        k = a + .1
        while k < b: tone(k, 2200, .05, .2, 60); k += 1.0
    if au.get('beep'):
        for j in range(3): tone(a + .3 + j * .5, 1200, .15, .15, 15)
    if au.get('drawers'):
        for j in range(3): nz(a + .3 + j * 1.0, .5, 300, 2000, .3, 6); thump(a + .7 + j * 1.0, .3)
    if au.get('creak'):
        d = seg(1.4); fr = 300 + 200 * np.sin(2 * np.pi * .5 * d); x = np.sign(np.sin(2 * np.pi * np.cumsum(fr) / sr)) * (rng.random(len(d)) > .3)
        add(sfx, a + D * .6, filt(x.astype(np.float32), 300, 2000) * np.exp(-d * 1.5), .2)
    if au.get('crash'):
        for j in range(5): clang(a + .05 + j * .18, .4); nz(a + .05 + j * .15, .8, 1500, 7000, .35, 5)
        hit(a, .8)
    if au.get('glass'):
        for j in range(8): tone(a + .2 + rng.random() * D * .6, 2500 + rng.random() * 2500, .2, .08, 20)
    if au.get('button'): nz(a + D * .35, .05, 1000, 5000, .6, 60); thump(a + D * .35, .5)
    if au.get('motor'): motor(a + .2, D - .2, .5 * au['motor'])
    if au.get('click'): nz(a + .15, .04, 1500, 6000, .5, 80)
    if au.get('tear'): nz(a + D * .3, .6, 800, 6000, .45, 6)
    if au.get('static'):
        d = seg(D); x = filt(noise(len(d)), 800, 5000) * (.4 + .6 * (rng.random(len(d) // 240 + 1).repeat(240)[:len(d)] > .7)); add(sfx, a, x * .12 * au['static'])
    if au.get('zip'): nz(a + D * .8, .5, 2000, 7000, .25, 3)
    if au.get('birds'):
        for j in range(int(D * 1.5)):
            d = seg(.12); add(sfx, a + rng.random() * D, np.sin(2 * np.pi * (3000 + 1500 * np.sin(2 * np.pi * 25 * d)) * d) * np.exp(-d * 20) * .06 * au['birds'])
    if au.get('pops') and s['card']:
        c = s['card']
        if c['t'] in ('items', 'icons4'):
            k = len(c.get('items', [0, 0, 0, 0]))
            for j in range(k): tone(a + D * (.05 + j * (.15 if c.get('pack') else (.1 if c['t'] == 'items' else .18))) + .05, 600 + j * 60, .15, .2, 20)
        if c['t'] == 'map':
            for j in range(3): tone(a + D * (.1 + j * .25) + .05, 700 + j * 120, .2, .2, 15)
        if c['t'] == 'loop':
            for j in range(int(D * 2)): tone(a + .2 + j * .5, 900, .08, .12, 30)
        if c['t'] == 'week':
            for j in range(7): tone(a + .1 + j * .12, 500 + j * 50, .1, .15, 25)
    if s['card'] and s['card']['t'] == 'clock': tone(a + D * .45, 1760, .3, .3, 8); hit(a + D * .45, .5)


# ===== video 3 additions =====
KN = [.35, .85, 1.35]
_kd = seg(.45)
KNOCK = (np.sin(2 * np.pi * 95 * _kd) * np.exp(-_kd * 22) + filt(noise(len(_kd)), 150, 1200) * np.exp(-_kd * 35) * .7 + np.sin(2 * np.pi * 210 * _kd) * np.exp(-_kd * 30) * .4).astype(np.float32)
def knock3(a, g=1.0, kind='door'):
    k = KNOCK.copy()
    if kind == 'wall': k = filt(k, None, 500) * 1.6
    if kind == 'metal': k = k + sum(np.sin(2 * np.pi * fr * _kd) for fr in [880, 1430, 2210]).astype(np.float32) * np.exp(-_kd * 9) * .25
    if kind == 'deep': k = filt(k, None, 300) * 2.0
    for o in KN: add(sfx, a + o, reverb(k, 2.6 if kind in ('door', 'deep') else 1.2, .45), g)
rev = lambda x, sec=2, wet=.5: reverb(x.astype(np.float32), sec, wet)
vent_lv = curve('vent', 1.0); fan_lv = curve('fan', .5)
bedx = (filt(noise(n), 40, 250) * 1.2 + (np.sin(2 * np.pi * 58 * t) * .3).astype(np.float32)) * vent_lv + (filt(noise(n), 100, 900) * (1 + .4 * np.sin(2 * np.pi * 9 * t)).astype(np.float32)) * fan_lv * 1.4
cctv_lv = curve('cctvhum', .3); bedx += ((np.sin(2 * np.pi * 60 * t) * .3).astype(np.float32) + filt(noise(n), 3000, 8000) * .3) * cctv_lv
pidx = next((i for i, x in enumerate(TL) if x.get('voice') in ('patient', 'daniel', 'own', 'radio')), 0); own_src, _ = sf.read(f'vo/{pidx:03d}.wav'); own_src = own_src.astype(np.float32)
for s0 in TL:
    au = s0['au']; a, b = s0['start'], s0['end']; D = b - a
    if au.get('knock3'): knock3(a, au['knock3'])
    if au.get('knock1'): add(sfx, a + .2, rev(KNOCK, 2.6, .45), 1.0)
    if au.get('knock3wall'): knock3(a, 1.0, 'wall')
    if au.get('knock3metal'): knock3(a, .8, 'metal')
    if au.get('knock3deep'): knock3(a + D * .55, 1.0, 'deep')
    if au.get('endknock'):
        vo_end = s0['vo'] + sf.info(f"vo/{TL.index(s0):03d}.wav").duration
        knock3(vo_end + .6, .7, 'deep')
    if au.get('drip'):
        for j in range(int(D * 1.2 * au['drip']) + 1): tone(a + .3 + rng.random() * D, 1300 + rng.random() * 500, .12, .08, 30)
    if au.get('barrier'):
        d = seg(D * .45); add(sfx, a + D * .35, filt(noise(len(d)), 500, 3500) * (np.abs(np.sin(2 * np.pi * 2 * d)) ** 2) + np.sin(2 * np.pi * (700 + 300 * d) * d) * .1, .4); clang(a + D * .8, .4)
    if au.get('thudsabove'):
        for j in range(5): add(sfx, a + rng.random() * D, filt(seg(.4) * 0 + noise(int(.4 * sr)), None, 200) * np.exp(-seg(.4) * 10), .5)
    if au.get('lock'): nz(a + D * .5, .05, 1500, 6000, .5, 80); nz(a + D * .5 + .12, .05, 800, 4000, .5, 80); thump(a + D * .5 + .12, .2)
    if au.get('glassclink'):
        for j in range(3): tone(a + 1 + j * .4, 2400 + j * 300, .25, .1, 15)
    if au.get('scrapeslow'):
        d = seg(D * .85); add(sfx, a + .2, rev(filt(noise(len(d)), 150, 1500) * np.clip(np.sin(np.pi * d / d[-1]), 0, 1) ** .5 + np.sin(2 * np.pi * (120 + 40 * np.sin(2 * np.pi * .7 * d)) * d) * .2, 2.5, .5), .6)
    if au.get('metaldrag'):
        d = seg(D * .85); add(sfx, a + .2, rev(filt(noise(len(d)), 300, 2500) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.4 * d))) + np.sin(2 * np.pi * 400 * d) * .05, 2.5, .5), .5)
    if au.get('chainclink'):
        for j in range(int(D * 3)): tone(a + .2 + j * .33 + rng.random() * .1, 1800 + rng.random() * 900, .15, .12, 20)
    if au.get('chainstrain'):
        d = seg(D * .9); add(sfx, a + .1, filt(noise(len(d)), 800, 4000) * .3 * (d / d[-1]) + np.sin(2 * np.pi * (300 + 600 * d / d[-1]) * d) * .06, .6)
        for j in range(int(D * 4)): tone(a + .1 + j * .25, 1600 + j * 30, .1, .1, 25)
    if au.get('snap'): nz(a + .3, .15, 2000, 8000, .8, 25); clang(a + .3, .6)
    if au.get('metalcrash'):
        for j in range(4): clang(a + .1 + j * .2, .5)
        add(sfx, a, rev(filt(noise(int(2 * sr)), 60, 800) * np.exp(-seg(2) * 2), 3, .6), .6)
    if au.get('creakbuilding'): 
        d = seg(2); add(sfx, a + D * .6, rev(np.sin(2 * np.pi * (80 + 20 * np.sin(2 * np.pi * .8 * d)) * d) * np.exp(-d * 1.2) * .5, 2.5, .5))
    if au.get('stepsghost'):
        for j in range(4): add(sfx, a + .5 + j * .7, rev(filt(noise(int(.12 * sr)), 100, 700) * np.exp(-seg(.12) * 30), 2.5, .7), .15)
    if au.get('stepsslow') or au.get('stepssoft'):
        k = a + .2; iv = 1.1 if au.get('stepsslow') else .55; g0 = .35 if au.get('stepsslow') else .12
        while k < b: add(sfx, k, rev(filt(noise(int(.15 * sr)), 60, 600) * np.exp(-seg(.15) * 25), 2.0, .5), g0); k += iv
    if au.get('metalgrab'): tone(a + .3, 900, .3, .2, 12); nz(a + .3, .1, 500, 3000, .3, 30)
    if au.get('handle'):
        for j in range(4): nz(a + .4 + j * .18, .08, 800, 4000, .35, 40)
    if au.get('doorhits'):
        k = a + .2
        while k < b - .2: thump(k, .9); k += 1.1
    if au.get('doorhit1'): thump(a + .3, 1.0); clang(a + .3, .3)
    if au.get('crtOn'): d = seg(1.2); add(sfx, a + D * .5, np.sin(2 * np.pi * 15000 * d) * .02 + np.sin(2 * np.pi * 60 * d) * np.exp(-d * 3) * .3); thump(a + D * .5, .4)
    if au.get('glitch'):
        for j in range(int(3 + D * 2)): d = seg(.08 + rng.random() * .15); add(sfx, a + rng.random() * D, filt(noise(len(d)), 500, 8000) * .4 * np.sign(np.sin(2 * np.pi * 40 * d)), .5 * au['glitch'])
    if au.get('rewind'): d = seg(.6); add(sfx, a + .05, np.sin(2 * np.pi * np.cumsum(2000 - 1500 * d / .6) / sr) * .15 * np.exp(-d * 2))
    if au.get('ladder'):
        k = a + .2
        while k < b: tone(k, 520, .2, .2, 18); tone(k, 1150, .15, .08, 25); k += .45
    if au.get('hatch'): add(sfx, a + D * .3, filt(np.sign(np.sin(2 * np.pi * np.cumsum(200 + 120 * np.sin(2 * np.pi * .6 * seg(1.2))) / sr)).astype(np.float32), 200, 1500) * np.exp(-seg(1.2) * 1.5) * .25); clang(a + D * .3 + 1.1, .4)
    if au.get('clinkfaint'): tone(a + D * .4, 1800, .3, .1, 12)
    if au.get('whisper') or au.get('namecall'):
        w = own_src[::-1].copy() if au.get('whisper') else own_src[: int(1.0 * sr)].copy()
        w = filt(w, 200, 2500); w = rev(w, 3.0, .75)
        add(sfx, a + .4, w, .5 * (au.get('whisper') or au.get('namecall')))
    if au.get('rumble'): d = seg(D); add(sfx, a, filt(noise(len(d)), 20, 120) * np.sin(np.pi * d / D) * 1.5, .6)
    if au.get('static_end'): d = seg(D * .4); add(sfx, a, filt(noise(len(d)), 800, 5000) * .15, 1.0)
bed = bed + bedx * .8

# ===== video 4 additions =====
gen_lv = curve('gen', .6)
bedx2 = (np.sin(2 * np.pi * 50 * t) * .4 + np.sign(np.sin(2 * np.pi * 100 * t)) * .1).astype(np.float32) * (1 + .2 * np.sin(2 * np.pi * 3 * t)).astype(np.float32) * gen_lv + filt(noise(n), 40, 400) * gen_lv
bed = bed + bedx2 * .7

# ===== video 5 additions =====
cityamb = (filt(noise(n), 60, 500) * .8 + filt(noise(n), 1500, 4000) * .05).astype(np.float32) * curve('cityamb', 1.5)
rain_lv = curve('rain', 1.0); rainb = filt(noise(n), 1500, 8000) * .6 * rain_lv
bed = bed + cityamb * .8 + rainb
# --- video 6: ocean against the hull + low engine rumble ---
sw = (0.55 + 0.45 * np.sin(2 * np.pi * .11 * t) ** 2 * (0.7 + 0.3 * np.sin(2 * np.pi * .043 * t))).astype(np.float32)
oceanb = filt(noise(n), 60, 700) * sw * 1.3 + filt(noise(n), 900, 3500) * sw ** 3 * .35
engb = (np.sin(2 * np.pi * 31 * t) * .5 + np.sin(2 * np.pi * 62 * t) * .3 + np.sin(2 * np.pi * 93.5 * t) * .12).astype(np.float32) * (1 + .15 * np.sin(2 * np.pi * 4.3 * t)).astype(np.float32) + filt(noise(n), 30, 220) * .8
bed = bed + oceanb * curve('ocean', 1.5) * 1.1 + engb * curve('engine', 1.2) * .9
for s0 in TL:
    au = s0['au']; a, b = s0['start'], s0['end']; D = b - a
    if au.get('ladderscrape'):
        for j in range(4): d = seg(.5); add(sfx, a + .4 + j * .7, rev(filt(noise(len(d)), 600, 3000) * np.exp(-d * 5) + np.sin(2 * np.pi * 700 * d) * .1 * np.exp(-d * 8), 1.5, .5), .4)
    if au.get('pipegrab'): tone(a + .3, 700, .4, .25, 10); tone(a + .3, 1650, .3, .1, 14); nz(a + .3, .08, 500, 3000, .3, 30)
    if au.get('whispername'): w = filt(own_src[::-1].copy(), 250, 2500); add(sfx, a + .3, rev(w, 2.5, .6), .45)
    if au.get('stepsecho'):
        k = a + .1
        while k < b: add(sfx, k, rev(filt(noise(int(.12 * sr)), 80, 800) * np.exp(-seg(.12) * 30), 2.5, .6), .35); k += .33
    if au.get('helicopterfar'): d = seg(D); add(sfx, a, filt(noise(len(d)), 60, 300) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 11 * d))) * np.sin(np.pi * d / D) * .4)
    if au.get('tarp'):
        for j in range(int(D * 1.5)): nz(a + .3 + j * .66, .4, 300, 3000, .3, 6)
    if au.get('hammer'):
        for j in range(int(D * 1.2)): thump(a + .5 + j * .8, .5); tone(a + .5 + j * .8, 900, .15, .12, 25)
    if au.get('plastic'):
        for j in range(int(D * 1.5)): d = seg(.2); add(sfx, a + .3 + j * .6, filt(noise(len(d)), 400, 2500) * np.exp(-d * 18) + np.sin(2 * np.pi * 320 * d) * np.exp(-d * 20) * .3, .35)
    if au.get('gunshots'):
        for j in range(4): at = a + .4 + rng.random() * (D - 1); d = seg(1.2); add(sfx, at, rev(filt(noise(len(d)), 200, 4000) * np.exp(-d * 30), 3.0, .7), .5)
    if au.get('cans'):
        for j in range(3): tone(a + .4 + j * .7, 1100 + j * 60, .25, .15, 18); thump(a + .4 + j * .7, .2)
    if au.get('doorbang'):
        k = a + .2
        while k < b: thump(k, 1.0); clang(k, .2); k += .9
    if au.get('paperslide'): d = seg(1.2); add(sfx, a + D * .3, filt(noise(len(d)), 2000, 7000) * np.sin(np.pi * d / 1.2) * .2)
    if au.get('campfire'):
        for j in range(int(D * 6)): nz(a + rng.random() * D, .03, 2000, 7000, .15, 90)
    if au.get('stepsmany'):
        for j in range(int(D * 7)): add(sfx, a + rng.random() * D, rev(filt(noise(int(.15 * sr)), 60, 700) * np.exp(-seg(.15) * 25), 2.0, .5), .3)
    if au.get('tableimpact'):
        k = a + .2
        while k < b: thump(k, 1.0); nz(k, .3, 300, 2000, .3, 12); k += 1.0
    if au.get('wood'):
        for j in range(3): nz(a + .3 + j * .6, .4, 400, 3000, .4, 10); thump(a + .3 + j * .6, .7)
    if au.get('bridge'):
        k = a + .1
        while k < b: tone(k, 420, .25, .2, 12); tone(k, 980, .2, .08, 18); k += .3
        d = seg(D); add(sfx, a, np.sin(2 * np.pi * (180 + 30 * np.sin(2 * np.pi * .7 * d)) * d) * .05)
    if au.get('eclick'): at = a + D * .2; nz(at, .03, 2000, 8000, .8, 120); tone(at + .02, 120, .6, .2, 6)
    if au.get('endtail5'):
        vo_end = s0['vo'] + sf.info(f"vo/{TL.index(s0):03d}.wav").duration
        hit(vo_end + .7, .7)

for s0 in TL:
    au = s0['au']; a, b = s0['start'], s0['end']; D = b - a
    if au.get('pound'):
        k = a + .2
        while k < b: thump(k, 1.0); clang(k, .15); k += 1.3
    if au.get('wheel'): d = seg(2.0); add(sfx, a + .3, filt(noise(len(d)), 1500, 5000) * np.abs(np.sin(2 * np.pi * 3 * d)) * np.exp(-d * 1.2) * .3)
    if au.get('servo'): d = seg(1.5); add(sfx, a + D * .2, np.sin(2 * np.pi * (600 + 80 * np.sin(2 * np.pi * 4 * d)) * d) * .08 * np.minimum(1, d * 5) * np.minimum(1, (1.5 - d) * 5))
    if au.get('buzzer'): d = seg(.6); add(sfx, a + .3, np.sign(np.sin(2 * np.pi * 220 * d)) * .15 * np.exp(-d * 2))
    if au.get('rattle'):
        for j in range(int(D * 3)): nz(a + .2 + j * .33, .12, 300, 2500, .35, 25); thump(a + .2 + j * .33, .2)
    if au.get('keys'):
        for j in range(int(D * 5)): nz(a + .3 + j * .2 + rng.random() * .05, .03, 2000, 7000, .25, 90)
    if au.get('computer'): d = seg(D); add(sfx, a, (np.sin(2 * np.pi * 15000 * d) * .01 + filt(noise(len(d)), 200, 600) * .1).astype(np.float32))
    if au.get('monitor'):
        k = a + .3
        while k < b: tone(k, 1000, .12, .12, 20); k += .9
    if au.get('ceilingcreak'): d = seg(2.0); add(sfx, a + .4, rev(np.sin(2 * np.pi * (90 + 30 * np.sin(2 * np.pi * .7 * d)) * d) * np.exp(-d * 1.2) * .4, 2.5, .5))
    if au.get('metalcreak'):
        for j in range(2): d = seg(1.2); add(sfx, a + .5 + j * 1.3, rev(np.sin(2 * np.pi * np.cumsum(300 + 200 * np.sin(2 * np.pi * .8 * d)) / sr) * np.exp(-d * 2) * .15, 2, .5))
    if au.get('switch'): clang(a + D * .5, .5); thump(a + D * .5, 1.0)
    if au.get('gendown'): d = seg(2.5); add(sfx, a + .1, (np.sin(2 * np.pi * np.cumsum(50 * np.exp(-d * 1.2)) / sr) * np.exp(-d * .8) * .6).astype(np.float32))
    if au.get('unlock'):
        for j in range(6): nz(a + .3 + j * D * .14, .05, 1000, 5000, .5, 70); thump(a + .32 + j * D * .14, .5); tone(a + .35 + j * D * .14, 1600, .1, .1, 30)
    if au.get('doorslide'): d = seg(1.5); add(sfx, a + .2, filt(noise(len(d)), 200, 1500) * np.sin(np.pi * d / 1.5) * .4); thump(a + 1.7, .4)
    if au.get('breath'):
        for j in range(3): d = seg(.8); add(sfx, a + .3 + j * 1.0, filt(noise(len(d)), 300, 2000) * np.sin(np.pi * d / .8) * .12)
    if au.get('endtail'):
        vo_end = s0['vo'] + sf.info(f"vo/{TL.index(s0):03d}.wav").duration
        chime(vo_end + .8); hit(vo_end + .6, .6)


# ---------- silence gates ----------
gate = np.ones(n, np.float32)
for i, s in enumerate(TL):
    if s['au'].get('drop'): gate[int(max(0, s['start'] - .55) * sr):int(s['start'] * sr)] = 0
    if s['au'].get('silence'): gate[int(s['start'] * sr):int(s['end'] * sr)] = .05
    if s['au'].get('drop_after'): gate[int((s['end'] - .5) * sr):int(s['end'] * sr)] = 0
gate = uniform_filter1d(gate, int(.03 * sr))
# melody processing: speaker sound (band-limited + reverb)
mel = reverb(filt(mel, 250, 4000), 1.8, .45)
# make end melody (radio) sound distant/thin
endmel_mask = np.zeros(n, np.float32)
for s in TL:
    if s['au'].get('endmelody'): endmel_mask[int((s['end'] - 2.7) * sr):] = 1


# ---------- video 7: desert + curiosity sound design ----------
myst = curve('mystery', 2.0)
# music-box / celesta curiosity motif (original): A minor with a raised-4th "question" note
MB = [440, 523.25, 659.25, 622.25, 587.33, 523.25, 493.88, 415.3, 440, 659.25, 880, 830.6, 739.99, 659.25, 622.25, 493.88]
mbox = np.zeros(n, np.float32); step = .42
for k in range(int(T / step)):
    fr = MB[k % len(MB)] * (1 if (k // 16) % 2 == 0 else .5 * 2 ** (rng.integers(0, 2)))
    d = seg(2.2); env_ = np.exp(-d * 3.2)
    note = (np.sin(2 * np.pi * fr * d) + .35 * np.sin(2 * np.pi * fr * 2.76 * d) * np.exp(-d * 6) + .2 * np.sin(2 * np.pi * fr * 5.4 * d) * np.exp(-d * 9)) * env_
    add(mbox, k * step + (.03 if k % 2 else 0), note.astype(np.float32), .9 if k % 4 == 0 else .55)
mbox = reverb(mbox, 3.2, .55)
padm = sum(np.sin(2 * np.pi * f0 * t + rng.random() * 6) * a0 for f0, a0 in [(110, .5), (164.8, .3), (155.6, .18), (220, .2)]).astype(np.float32) * (1 + .3 * np.sin(2 * np.pi * .1 * t)).astype(np.float32)
tickm = np.zeros(n, np.float32)
for k in range(int(T / .84)):
    d = seg(.05); add(tickm, k * .84, (filt(noise(len(d)), 2500, 7000) * np.exp(-d * 120)).astype(np.float32), .5)
curio = mbox * .9 + reverb(padm, 2.5, .4) * .35 + tickm * .5
storm_lv = curve('storm', 1.0)
stormb = (filt(noise(n), 150, 2500) * 1.3 + filt(noise(n), 40, 200) * .8) * (0.7 + 0.3 * np.sin(2 * np.pi * .3 * t)).astype(np.float32)
sandhiss = filt(noise(n), 2500, 8000) * .25 * curve('wind', 1.2)
bed = bed + curio * myst * 1.1 + stormb * storm_lv * 1.4 + sandhiss
def sting(at, g=.6):  # curiosity sting: rising bell gliss + soft low boom
    d = seg(1.6); f = 600 * 2 ** (d * 1.2); ph = 2 * np.pi * np.cumsum(f) / sr
    x = (np.sin(ph) * .5 + np.sin(ph * 2.76) * .2) * np.exp(-d * 1.8); add(sfx, at, reverb(x.astype(np.float32), 2.5, .6), g)
    d2 = seg(1.8); add(sfx, at + .05, (np.sin(2 * np.pi * (45 + 30 * np.exp(-d2 * 6)) * d2) * np.exp(-d2 * 2)).astype(np.float32), g * .9)
def whoosh(at, g=.5):
    d = seg(.7); e = np.sin(np.pi * d / .7) ** 2; add(sfx, at - .2, filt(noise(len(d)), 500, 4000) * e, g)
def sandstep(at, g=.3):
    d = seg(.16); add(sfx, at, filt(noise(len(d)), 600, 5000) * np.exp(-d * 28) * (1 + .5 * np.sin(2 * np.pi * 37 * d)), g)
def slosh(at, g=.5):
    for k in range(3):
        d = seg(.35); add(sfx, at + k * .28, (filt(noise(len(d)), 200, 1400) * np.sin(np.pi * d / .35) * (1 + np.sin(2 * np.pi * 9 * d))).astype(np.float32), g * (1 - k * .25))
for s0 in TL:
    au = s0['au']; a, b = s0['start'], s0['end']; D = b - a
    if au.get('sting'): sting(a + .05, .55 * au['sting'])
    if au.get('whoosh'): whoosh(a + .1)
    if au.get('sandsteps'):
        k = a + .1; rate = .42 / max(.5, au['sandsteps'])
        while k < b - .1: sandstep(k, .22 * min(1, au['sandsteps'])); k += rate
    if au.get('slosh'): slosh(a + .2, .45 * au['slosh'])
    if au.get('cloth'):
        d = seg(D); add(sfx, a, filt(noise(len(d)), 300, 2500) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 3 * d))) * .12)
    if au.get('enginefar'):
        d = seg(D); add(sfx, a, reverb((np.sin(2 * np.pi * 52 * d) * .4 + filt(noise(len(d)), 40, 300)).astype(np.float32) * np.clip(d / D, 0, 1) * .5, 2, .5))
    if au.get('brake'):
        d = seg(.9); add(sfx, a + .1, filt(noise(len(d)), 1500, 5000) * np.exp(-d * 3) * .3)


# ---------- video 8: flood water, thunder, knocks, cracks ----------
floodb = (filt(noise(n), 50, 600) * 1.2 + filt(noise(n), 600, 2500) * .35) * (0.75 + 0.25 * np.sin(2 * np.pi * .17 * t)).astype(np.float32)
bed = bed + floodb * curve('flood', 1.0) * 1.1
def thunder(at, g=.8):
    d = seg(4.5); x = filt(noise(len(d)), 25, 400) * (np.exp(-d * .9) * (1 + .6 * np.sin(2 * np.pi * 1.3 * d))) ; x[:int(.02 * sr)] *= 2.5
    add(sfx, at, reverb(x.astype(np.float32), 3, .4), g)
for s0 in TL:
    au = s0['au']; a, b = s0['start'], s0['end']
    if 'lightning' in s0.get('fx', []):
        k0 = int(a / 3.1)
        while k0 * 3.1 < b:
            if k0 * 3.1 >= a and rnd_py(k0) > .35: thunder(k0 * 3.1 + .35, .6)
            k0 += 1
    if au.get('thunder'): thunder(a + .3, .7 * au['thunder'])
    if au.get('horn'):  # ship/ferry horn blasts: au['horn']=count (int), long low chord with distant reverb
        nb = int(au['horn']); k = a + .4
        for j in range(nb):
            d = seg(1.6); env = np.clip(d / .12, 0, 1) * np.clip((1.6 - d) / .3, 0, 1)
            x = sum(np.sign(np.sin(2 * np.pi * f * d)) * g for f, g in ((92, 1), (138, .7), (184, .35))).astype(np.float32)
            x = filt(x, 60, 900) * env * .5; add(sfx, k, reverb(x.astype(np.float32), 3.5, .55)); k += 2.3
    if au.get('bigsplash'):
        d = seg(2.2); add(sfx, a + .25, filt(noise(len(d)), 80, 2500) * np.exp(-d * 2.2) * 1.0)
    if au.get('explode'):
        d = seg(4.0); add(sfx, a + .2, (filt(noise(len(d)), 20, 400) * np.exp(-d * 1.1) * 1.4 + filt(noise(len(d)), 400, 3000) * np.exp(-d * 4) * .4).astype(np.float32))
    if au.get('splash'):
        d = seg(1.2); add(sfx, a + .2, filt(noise(len(d)), 200, 4000) * np.exp(-d * 3.5) * .6)
    if au.get('tapping'):
        k = a + .3
        while k < b:
            d = seg(.05); add(sfx, k, (filt(noise(len(d)), 1500, 6000) * np.exp(-d * 90)).astype(np.float32), .35); k += .19
    if au.get('ring'):
        k = a + .2
        while k < b - .3:
            d = seg(.9); add(sfx, k, (np.sin(2 * np.pi * 440 * d) * .5 + np.sin(2 * np.pi * 480 * d) * .5) * (d < .8) * .08); k += 1.6
    if au.get('rope'):
        d = seg(1.4); add(sfx, a + .3, filt(noise(len(d)), 800, 4000) * (.5 + .5 * np.sin(2 * np.pi * 7 * d)) * .15)
    if au.get('water'):
        d = seg(b - a); add(sfx, a, filt(noise(len(d)), 300, 1500) * (.5 + .5 * np.sin(2 * np.pi * .7 * d)) * .1)


# ---------- video 9: whooshes on fast cuts, chalk, flicker buzz ----------
for s0 in TL:
    au = s0['au']; a, b = s0['start'], s0['end']
    cuts = s0.get('cuts') or []
    if cuts:
        ws = [s0.get('w', 1)] + [c.get('w', 1) for c in cuts]; tot = sum(ws); acc = a
        for w_ in ws[:-1]:
            acc += (b - a) * w_ / tot
            d = seg(.5); e = np.sin(np.pi * d / .5) ** 2; add(sfx, acc - .25, filt(noise(len(d)), 600, 5000) * e, .35)
            d2 = seg(.6); add(sfx, acc, (np.sin(2 * np.pi * (60 + 40 * np.exp(-d2 * 10)) * d2) * np.exp(-d2 * 5)).astype(np.float32), .35)
    if s0.get('flash'):
        d = seg(.4); add(sfx, a, filt(noise(len(d)), 2000, 9000) * np.exp(-d * 9), .25)
    if s0.get('slam'):
        d = seg(1.0); add(sfx, a, (np.sin(2 * np.pi * (50 + 60 * np.exp(-d * 12)) * d) * np.exp(-d * 3)).astype(np.float32), .7)
    if au.get('chalk'):
        k = a + .2
        while k < min(b, a + 2.5):
            d = seg(.12); add(sfx, k, filt(noise(len(d)), 2500, 8000) * np.exp(-d * 18) * .25); k += .32
    if au.get('flickerbuzz'):
        d = seg(b - a); add(sfx, a, (np.sign(np.sin(2 * np.pi * 120 * d)) * .04 * (rng.random(len(d)) > .3)).astype(np.float32))

# ---------- voice ----------
voice = np.zeros(n, np.float32)
for i, s in enumerate(TL):
    if s.get('vo') is None: continue
    v, vsr = sf.read(f'vo/{i:03d}.wav'); v = v.astype(np.float32)
    kind = s.get('voice', 'nar')
    if kind == 'pa': v = reverb(filt(v, 300, 3500), 1.6, .4) * 1.4
    if kind == 'comp':
        v = filt(v, 300, 3800) * (0.75 + 0.25 * np.sign(np.sin(2 * np.pi * 70 * (np.arange(len(v)) / sr)))).astype(np.float32); v = np.round(v * 24) / 24; v = reverb(v.astype(np.float32), 1.8, .45) * 1.3
    if kind == 'amara':
        v = filt(v, 350, 3600) * (1 + .08 * np.sin(2 * np.pi * 7 * np.arange(len(v)) / sr)).astype(np.float32); v = reverb(v, 1.6, .45) * 1.3
    if kind == 'patient':
        v = reverb(filt(v, 200, 3000), 3.0, .6) * 1.2
    if kind == 'elias':
        v = reverb(v, .8, .15)
    if kind == 'own':
        v = filt(v, 350, 3200) * 1.6; v = np.tanh(v * 2.5) / 2.0; v = reverb(v, 1.5, .3)
    if kind == 'micradio':
        v = filt(v, 300, 3200, 3); v = np.tanh(v * 3) / 2.2; v = reverb(v, .7, .25); v = v + filt(noise(len(v)), 1000, 6000) * .02
    if kind == 'mic':
        v = reverb(v, 1.8, .45) * .9
    if kind == 'below':
        v = filt(v, 150, 1600) * 1.5; v = reverb(v, 2.6, .55)
    if kind == 'behind':
        v = filt(v, 100, 5000) * 1.1; v = reverb(v, .3, .1)
    if kind == 'sys':
        v = filt(v, 250, 6000); v = reverb(v, .8, .2)
    if kind == 'thing':
        v = filt(v, 120, 1300) * 1.6; v = reverb(v, 2.4, .5); v = v + np.roll(v, int(.018 * sr)) * .5
    if kind == 'thing2':
        v = filt(v, 150, 2600) * 1.3; v = reverb(v, 1.4, .35)
    if kind == 'lily':
        v = reverb(v, 1.6, .3)
    if kind == 'radio2':
        v = filt(v, 300, 3400) * 1.4; v = np.tanh(v * 1.8) / 1.6; v = v + filt(noise(len(v)), 1000, 5000) * .012
    if kind == 'nora':
        v = reverb(v, .9, .15) * 1.05
    if kind == 'walt':
        v = reverb(v, .9, .15) * 1.05
    if kind == 'drv':
        v = reverb(v, 1.0, .18)
    if kind == 'radio':
        v = filt(v, 400, 3000) * 1.6; v = np.tanh(v * 3) / 2.2
        v = v + filt(noise(len(v)), 1000, 5000) * .02
    add(voice, s['vo'], v)

def rms(x): x = x[np.abs(x) > 1e-5]; return np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-9
voice *= 10 ** (-18 / 20) / rms(voice)
bed *= 10 ** (-31 / 20) / rms(bed)
if (siren_lv > .3).any(): sir *= 10 ** (-34 / 20) / rms(sir[siren_lv > .3])
alarm *= 10 ** (-32 / 20) / (rms(alarm[al_lv > .3]) if (al_lv > .3).any() else 1)
mel *= (10 ** (-27 / 20) / rms(mel)) if np.abs(mel).max() > 1e-5 else 0
mel = mel * (1 - endmel_mask) + filt(mel, 600, 2500) * endmel_mask * .6
sfx *= 10 ** (-7 / 20) / np.abs(sfx).max()
duck = uniform_filter1d(np.abs(voice), int(.3 * sr)); duck /= duck.max()
dk = 1 - .4 * np.clip(duck * 3, 0, 1)
core = (bed * dk + alarm * dk) * gate + mel * (1 - .3 * np.clip(duck * 3, 0, 1)) + voice + sfx * .9
L = core + sir * dk * gate * .8; Rr = core + sir * dk * gate * 1.2
fl = int(2.5 * sr); fade = np.ones(n, np.float32); e = int(T * sr); fade[e - fl:e] = np.linspace(1, 0, fl); fade[e:] = 0
st = np.stack([L * fade, Rr * fade], 1); st /= np.abs(st).max() / .95
sf.write('mix.wav', st[:e], sr)
print('mix ok', T)
