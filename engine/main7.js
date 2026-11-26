// ---------- Video 7: desert cards, fx, subtitles ----------
const _card6 = cardSVG, _fx6 = fxSVG;
const HAND = 'font-family="DejaVu Serif, serif" font-style="italic"';
function bottleBig(x, y, s, level) { const h = 520 * clamp(level / 3, 0, 1);
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-300" width="300" height="560" rx="60" fill="#dfeaf0" stroke="${INK}" stroke-width="9" opacity=".95"/>
  <clipPath id="bcl"><rect x="-140" y="-290" width="280" height="540" rx="52"/></clipPath><g clip-path="url(#bcl)"><rect x="-150" y="${250 - h}" width="300" height="${h + 20}" fill="#3e8fd0"/><path d="M-150 ${250 - h} q75 -14 150 0 t150 0" stroke="#9fd2f5" stroke-width="8" fill="none"/></g>
  <rect x="-60" y="-360" width="120" height="70" rx="12" fill="#2a2a2a" stroke="${INK}" stroke-width="7"/>${[0, 1, 2].map(k => `<path d="M-150 ${250 - 520 * (k + 1) / 3} h40" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`; }
function mapBase(t, torn) { let s = `<rect width="1920" height="1080" fill="#2a1e14"/><g transform="rotate(-2 960 540)"><path d="M260 100 L1680 120 L1700 980 L240 960Z" fill="#e8d8b0" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${380 + i * 220} 110 v860" stroke="#cdb98a" stroke-width="3"/>`;
  s += `<path d="M300 700 Q600 640 800 760 T1300 700 T1660 760" stroke="#c9a46a" stroke-width="14" fill="none" opacity=".6"/><path d="M420 300 q80 -60 160 0 q80 60 160 0" stroke="#b08a5a" stroke-width="6" fill="none"/>`;
  s += `<path d="M1200 260 l30 -40 l30 40 l30 -40 l30 40" stroke="#8a6a4a" stroke-width="6" fill="none"/>` + `<circle cx="1480" cy="300" r="22" fill="#c33a2f" stroke="${INK}" stroke-width="5"/>` + T(1480, 370, 34, 'SETTLEMENT', '#3a2a1a', 900);
  s += `<circle cx="520" cy="820" r="18" fill="#2e4a7a" stroke="${INK}" stroke-width="5"/>` + T(520, 880, 30, 'YOU ARE HERE?', '#2e4a7a', 800);
  if (torn) s += `<path d="M1700 520 L1600 560 L1650 640 L1560 700 L1700 760Z" fill="#2a1e14"/><path d="M240 400 L330 430 L280 500 L360 560 L238 600Z" fill="#2a1e14"/><path d="M700 140 q40 120 -20 260 q60 80 0 200" stroke="#a8946a" stroke-width="5" fill="none"/><ellipse cx="1100" cy="560" rx="120" ry="70" fill="#b8956a" opacity=".45"/>`;
  return s; }
cardSVG = function (c, p, t, dur) {
  const lt = p * dur;
  if (c.t === 'dwater') { const L = c.to != null ? c.l + (c.to - c.l) * ease(clamp(p * 1.4, 0, 1)) : c.l; let s = `<rect width="1920" height="1080" fill="#2a1a10"/><circle cx="960" cy="540" r="700" fill="url(#glow)" opacity=".18"/>` + bottleBig(760, 560, .95, L);
    s += T(1300, 520, 150, L.toFixed(1) + ' L', L < 1.5 ? '#ff7a5a' : '#fff', 900) + T(1300, 610, 40, 'WATER LEFT', '#e9cfa0', 800);
    if (c.drip) for (let k = 0; k < 4; k++) { const q = (lt * .8 + k / 4) % 1; s += `<path d="M${640 + k * 70} ${700 + q * 300} q-12 22 0 30 q12 -8 0 -30" fill="#7fc0ee" opacity="${1 - q}"/>`; }
    return s; }
  if (c.t === 'dmap') { let s = mapBase(t, c.stage >= 1);
    if (c.stage === 0 || c.stage === 1) { const q = clamp(p * 1.8, 0, 1); s += `<path d="M520 820 L1480 300" stroke="#c33a2f" stroke-width="7" stroke-dasharray="${1100 * q} 1200"/>` + T(1060, 520, 54, '100 KM', '#c33a2f', 900, 'middle', `opacity="${q}" transform="rotate(-28 1060 520)"`); }
    if (c.stage === 0 && c.empty) s += `<circle cx="960" cy="540" r="${200 + 500 * ease(clamp(p, 0, 1))}" fill="none" stroke="#c33a2f" stroke-width="6" opacity=".5" stroke-dasharray="20 16"/>` + T(960, 1010, 40, 'NO SETTLEMENTS FOR HUNDREDS OF KM', '#e9cfa0', 900, 'middle', `opacity="${clamp(p * 3, 0, 1)}"`);
    if (c.stage === 2) [[0, -30], [20, 0], [-40, 20]].forEach(([a, b], k) => { s += `<path d="M520 820 L${1480 + a * 8} ${300 + b * 8}" stroke="#c33a2f" stroke-width="5" stroke-dasharray="14 12" opacity="${clamp(p * 3 - k * .5, 0, 1)}"/>`; }) || (s += T(1000, 560, 120, '?', '#c33a2f', 900, 'middle', `opacity="${clamp(p * 2, 0, 1)}"`));
    if (c.stage === 3) { s += `<circle cx="1560" cy="200" r="50" fill="#ffd23a" stroke="${INK}" stroke-width="6"/>` + T(1560, 290, 30, 'SUN → WEST', '#3a2a1a', 900) + `<path d="M520 820 L1400 380" stroke="#c33a2f" stroke-width="7" stroke-dasharray="${1000 * clamp(p * 1.5, 0, 1)} 1100"/>`; }
    if (c.stage === 4) { const q = clamp(p * 2, 0, 1); s += `<path d="M880 600 l20 -30 l20 30 l-20 30z" fill="none" stroke="#3a2a1a" stroke-width="5"/><circle cx="900" cy="600" r="${60 + 10 * Math.sin(t * 5)}" fill="none" stroke="#c33a2f" stroke-width="8" opacity="${q}"/>` + T(900, 700, 34, 'SHELTER', '#c33a2f', 900, 'middle', `opacity="${q}"`) + `<path d="M520 820 Q700 700 880 610" stroke="#2e4a7a" stroke-width="6" stroke-dasharray="${700 * q} 800" fill="none"/>`; }
    return s + '</g>'; }
  if (c.t === 'dphone') { let s = `<rect width="1920" height="1080" fill="#2a1a10"/><g transform="translate(960 560) rotate(-6)"><path d="M200 380 q120 -40 160 120 l60 260 l-200 40Z" fill="#fbfaf6" stroke="${INK}" stroke-width="8"/><rect x="-220" y="-430" width="440" height="860" rx="56" fill="#111" stroke="${INK}" stroke-width="8"/><rect x="-196" y="-384" width="392" height="776" rx="28" fill="#c98a4a"/>`;
    s += T(-160, -340, 28, 'No Service', '#fff', 800, 'start') + T(0, -160, 110, '1:42', '#fff', 300) + `<rect x="-150" y="20" width="300" height="140" rx="20" fill="#000" opacity=".4"/>` + T(0, 80, 34, 'Call failed', '#ff8a7a', 800) + T(0, 130, 26, 'No network', '#fff', 600);
    return s + `</g>`; }
  if (c.t === 'dkit') { let s = `<rect width="1920" height="1080" fill="#d8b884"/>` + ripples(0, 1080, '#b8925a', 5, 30);
    const items = [['3 L WATER', x => `<g transform="translate(${x} 520) scale(.42)">${bottleBig(0, 0, 1, 3)}</g>`], ['DAMAGED MAP', x => `<g transform="translate(${x - 120} 420) rotate(-6)"><path d="M0 0 L240 10 L230 200 L-6 190Z" fill="#e8d8b0" stroke="${INK}" stroke-width="6"/><path d="M180 10 l40 60 l-30 30" fill="#d8b884"/></g>`], ['OLD RADIO', x => `<g transform="translate(${x} 520)"><rect x="-70" y="-110" width="140" height="220" rx="16" fill="#3a3f46" stroke="${INK}" stroke-width="7"/><path d="M40 -110 l20 -90" stroke="${INK}" stroke-width="7"/><rect x="-46" y="-80" width="92" height="50" fill="#9ab07a"/>${[0, 1, 2].map(k => `<path d="M-46 ${0 + k * 22} h92" stroke="#222" stroke-width="6"/>`).join('')}</g>`], ['PHONE · NO SIGNAL', x => `<g transform="translate(${x} 520) rotate(8)"><rect x="-60" y="-110" width="120" height="220" rx="18" fill="#111" stroke="${INK}" stroke-width="6"/><rect x="-50" y="-96" width="100" height="192" rx="10" fill="#c98a4a"/></g>`]];
    items.forEach(([lab, f], k) => { const o = clamp(p * 5 - k * .7, 0, 1); const x = 330 + k * 420; s += `<g opacity="${o}">${f(x)}${T(x, 820, 34, lab, '#2a1a10', 900)}</g>`; });
    return s; }
  if (c.t === 'drule') { const q = clamp(p * 3, 0, 1); return `<rect width="1920" height="1080" fill="#1d140e"/>` + T(960, 420, 44, 'SURVIVAL RULE', '#e0a050', 900, 'middle', `opacity="${q}" letter-spacing="8"`) + T(960, 560, 92, 'RATION YOUR SWEAT,', '#fff', 900, 'middle', `opacity="${q}"`) + T(960, 680, 92, 'NOT YOUR WATER', '#ffd23a', 900, 'middle', `opacity="${clamp(p * 3 - .5, 0, 1)}"`) + `<rect x="${960 - 400 * q}" y="730" width="${800 * q}" height="8" fill="#c33a2f"/>`; }
  if (c.t === 'dcap') { let s = `<rect width="1920" height="1080" fill="#e3b06a"/>` + ripples(0, 1080, '#c98d48', 7, 40);
    if (c.hand) s += `<path d="M-40 760 Q500 620 900 640 Q1160 650 1200 720 Q1160 860 900 880 Q500 900 -40 1000Z" fill="#fbfaf6" stroke="${INK}" stroke-width="10"/><path d="M1000 660 q60 -10 90 30 M1010 700 q70 -4 100 34 M1000 760 q70 6 90 40" stroke="${INK}" stroke-width="8" fill="none"/>`;
    const y = c.hand ? 700 : 560 + (1 - ease(clamp(p * 2, 0, 1))) * 0;
    s += `<g transform="translate(${c.hand ? 860 : 960} ${y}) rotate(-14)"><ellipse cx="0" cy="40" rx="120" ry="34" fill="#000" opacity="${c.hand ? 0 : .25}"/><rect x="-110" y="-50" width="220" height="90" rx="24" fill="#2f7ad0" stroke="${INK}" stroke-width="9"/>${Array.from({ length: 10 }, (_, k) => `<path d="M${-96 + k * 21} -44 v78" stroke="#1f5aa0" stroke-width="6"/>`).join('')}<path d="M-90 -36 h120" stroke="#9fd2f5" stroke-width="8" opacity=".7"/></g>`;
    if (c.shine) s += `<path d="M${980} 470 l14 -40 l14 40 l40 14 l-40 14 l-14 40 l-14 -40 l-40 -14z" fill="#fff" opacity="${.5 + .5 * Math.sin(t * 6)}"/>`;
    return s; }
  if (c.t === 'dclothc') { let s = `<rect width="1920" height="1080" fill="#a8683a"/>` + boulder(960, 1200, 900, 'day', 3);
    const w = (k) => Math.sin(t * 5 + k) * 18;
    s += `<path d="M360 300 Q700 ${280 + w(0)} 1000 ${310 + w(1)} T1600 ${300 + w(2)} L1580 ${720 + w(3)} Q1300 ${700 + w(4)} 1000 ${740 + w(5)} T380 ${710 + w(6)}Z" fill="#e9e2cc" stroke="${INK}" stroke-width="9"/>`;
    s += `<g transform="rotate(-3 980 520)" opacity="${clamp(p * 3, 0, 1)}">${T(980, 590, 170, 'DO NOT FOLLOW', '#7a1a12', 900, 'middle', 'font-family="DejaVu Sans" letter-spacing="4"')}</g>` + `<path d="M330 260 L410 340 M1640 270 L1560 350" stroke="#6a5a3a" stroke-width="18"/>`;
    return s; }
  if (c.t === 'dradio') { let s = `<rect width="1920" height="1080" fill="#20160e"/><g transform="translate(960 600) rotate(${c.shake ? Math.sin(t * 30) * 1.5 : -4})"><path d="M120 -560 l50 -260" stroke="${INK}" stroke-width="16"/><circle cx="172" cy="-826" r="16" fill="#3a3a3a"/>`;
    s += `<rect x="-260" y="-560" width="520" height="980" rx="60" fill="#3a3f46" stroke="${INK}" stroke-width="10"/><rect x="-200" y="-480" width="400" height="200" rx="16" fill="${c.mode === 'off' ? '#2a3020' : '#9ab07a'}" stroke="${INK}" stroke-width="7"/>`;
    if (c.mode !== 'off') { s += TM(0, -390, 52, c.ch || 'CH 07', '#1d2a14', 900, 'middle'); for (let k = 0; k < 28; k++) { const h = (c.mode === 'voice' ? 30 + Math.abs(Math.sin(t * 11 + k * .8)) * 50 : 6 + rnd(Math.floor(t * 18) + k) * 50); s += `<rect x="${-180 + k * 13}" y="${-320 - h / 2}" width="7" height="${h}" fill="#1d2a14" opacity=".8"/>`; } }
    for (let k = 0; k < 8; k++) s += `<path d="M-200 ${-200 + k * 60} h400" stroke="#1d1f22" stroke-width="22" stroke-linecap="round"/>`;
    s += `<circle cx="-150" cy="320" r="40" fill="#2a2d33" stroke="${INK}" stroke-width="6"/><rect x="60" y="290" width="140" height="60" rx="14" fill="#c33a2f" stroke="${INK}" stroke-width="6"/></g>`;
    if (c.mode !== 'off') for (let k = 0; k < 4; k++) { const q = (t * 1.3 + k / 4) % 1; s += `<path d="M${1260 + q * 300} ${340 - q * 120} q${60 + q * 60} ${200 + q * 100} 0 ${400 + q * 240}" stroke="#ffe2a8" stroke-width="${10 * (1 - q)}" fill="none" opacity="${(1 - q) * .8}"/>`; }
    return s; }
  if (c.t === 'dnote') { let s = `<rect width="1920" height="1080" fill="#2a1e16"/><g transform="rotate(-2 960 540)"><rect x="380" y="140" width="1160" height="800" fill="#efe6cf" stroke="${INK}" stroke-width="8"/>`;
    for (let k = 0; k < 9; k++) s += `<path d="M420 ${260 + k * 76} h1080" stroke="#c9bfa8" stroke-width="3"/>`;
    const L = ['If you find this shelter,', 'do not assume the water is safe.', 'Check your surroundings', 'before drinking anything.']; const q = clamp(p * 1.6, 0, 1) * L.join('').length; let acc = 0;
    L.forEach((l, k) => { const n = clamp(q - acc, 0, l.length); acc += l.length; s += T(450, 330 + k * 140, 66, l.slice(0, Math.floor(n)), '#2a2240', 700, 'start', HAND); });
    return s + '</g>'; }
  if (c.t === 'dphoto') { let s = `<rect width="1920" height="1080" fill="#2a1e16"/>`; const z = c.zoom ? 1 + .7 * ease(clamp(p, 0, 1)) : 1 + .04 * p;
    s += `<g transform="translate(${c.zoom ? 960 - 220 * ease(clamp(p, 0, 1)) : 960} 540) scale(${z}) translate(-960 -540) rotate(${c.back ? 3 : -3} 960 540)"><rect x="470" y="110" width="980" height="860" fill="#f4efe2" stroke="${INK}" stroke-width="8"/>`;
    if (!c.back) s += `<svg x="510" y="150" width="900" height="640" viewBox="200 200 1500 1067" preserveAspectRatio="xMidYMid slice">${ENV.dshelter('day')}${figure({ k: 'drv', x: 640, y: 880, s: 1.25, p: 'stand', f: 0, v: 0, e: 'soft', noshadow: 0 }, 0, 0, 'day')}<rect width="1920" height="1080" fill="#c9a06a" opacity=".22"/></svg>` + T(960, 880, 36, '', '#555');
    else { const q = clamp(p * 2.5, 0, 1); s += T(960, 500, 120, c.date || 'NOV 6', '#2a2240', 700, 'middle', `${HAND} opacity="${q}"`) + T(960, 640, 46, '— tomorrow —', '#7a1a12', 700, 'middle', `${HAND} opacity="${clamp(p * 2.5 - .6, 0, 1)}"`); }
    return s + '</g>'; }
  if (c.t === 'blackend') return `<rect width="1920" height="1080" fill="#000"/>`;
  return _card6(c, p, t, dur);
};
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env, L = shot.light; const has = k => f.includes(k); let s = '';
  const base = _fx6(shot, lt, p, t, front); const pal = DP(L);
  const pc = L === 'night' ? '#202034' : '#8a5a32', pc2 = L === 'night' ? '#14142a' : '#5e3820';
  if (!front) {
    if (E === 'dwide') {
      if (has('trail1') || has('trail2') || has('trail2appear') || has('trail2close')) s += trail(380, 600, 760, 690, 1180, 980, 26, .55, 1.5, pc);
      if (has('trail2')) s += trail(380, 600, 760, 690, 1180, 980, 26, .55, 1.5, pc2, 22, 1, .9);
      if (has('trail2appear')) s += trail(380, 600, 760, 690, 1180, 980, 26, .55, 1.5, pc2, 22, clamp(lt / 2.6, 0, 1), .9);
      if (has('trail2close')) s += trail(380, 600, 760, 690, 1180, 980, 26, .55, 1.5, pc2, 22, .93, .95);
    }
    if (E === 'dtrack') { const sets = has('dozens') ? 12 : (has('two') ? 2 : (has('one') ? 1 : 0)); const ap = has('appear') ? clamp(lt / 2.2, 0, 1) : 1;
      for (let k = 0; k < sets; k++) { const ox = k < 2 ? 0 : (k - 6) * 150, col = k === 1 ? pc2 : pc; s += trail(900 + ox, -120, 820 + ox * .6, 520, 980 + ox * 1.2, 1200, 10, 2.6, 4.2, col, k === 1 ? 40 : 0, k === 1 ? ap : 1, k > 1 ? .8 : 1); } }
    if (E === 'dshelter' && has('manytrails')) for (let k = 0; k < 12; k++) s += trail(-100 + k * 170, 1100, 400 + k * 60, 900, 820 + (k - 6) * 8, 870, 12, 1.1, .7, pc, 0, 1, .85);
    if (E === 'dvalley' && has('vtracks')) s += trail(960, 1100, 980, 900, 1000, 770, 14, 1.4, .7, pc, 0, 1, .9);
    if (E === 'droad') {
      const drive = has('suvdrive'), stop = has('suvstop'), night = has('suvnight');
      if (drive) { const x = -400 + lt * 380; s += `<g>${[0, 1, 2, 3, 4].map(k => `<circle cx="${x - 300 - k * 70}" cy="${820 - k * 10}" r="${40 + k * 22}" fill="${pal.sand[1]}" opacity="${.5 - k * .08}"/>`).join('')}</g>` + suv(x, 860, .9, {}); }
      if (stop) s += suv(860, 860, .9, { hood: has('hood') }) + (has('hood') ? [0, 1, 2, 3].map(k => { const q = (t * .5 + k / 4) % 1; return `<circle cx="${1080 + Math.sin(q * 6) * 20}" cy="${700 - q * 220}" r="${20 + q * 40}" fill="#efefef" opacity="${.45 * (1 - q)}"/>`; }).join('') : '');
      if (has('oneinside')) s += `<circle cx="930" cy="712" r="22" fill="#111"/><path d="M906 742 q24 -20 48 0z" fill="#111"/>`;
      if (has('tyretracks')) s += `<path d="M1960 900 Q1300 860 860 870 Q500 880 -40 940" stroke="${pal.sand[3]}" stroke-width="16" fill="none" stroke-dasharray="26 18" opacity=".55"/><path d="M1960 950 Q1300 910 860 920 Q500 930 -40 990" stroke="${pal.sand[3]}" stroke-width="16" fill="none" stroke-dasharray="26 18" opacity=".45"/>`;
      if (night) { const q = has('suvarrive') ? ease(clamp(lt / 3.2, 0, 1)) : 1; const x = 2300 - 1200 * q; s += suv(x, 860, .9, { flip: 1, lights: !has('lightsout') || lt < .6 }); }
    }
    if (E === 'drock' && has('capsand')) s += `<g transform="translate(1180 950) rotate(-10)"><rect x="-22" y="-10" width="44" height="18" rx="5" fill="#2f7ad0" stroke="${INK}" stroke-width="4"/></g><path d="M1210 920 l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6z" fill="#fff" opacity="${.5 + .5 * Math.sin(t * 6)}"/>`;
    if (E === 'dcloth') { const w = k => Math.sin(t * 6 + k) * 16; s += `<path d="M990 806 Q1100 ${790 + w(0)} 1200 ${812 + w(1)} L1196 ${900 + w(2)} Q1100 ${880 + w(3)} 994 ${880}Z" fill="#e9e2cc" stroke="${INK}" stroke-width="5"/>` + T(1095, 860, 18, 'DO NOT FOLLOW', '#7a1a12', 900); }
    if (E === 'dridge' && has('mirage')) { const a = Math.sin(t * 7) * 4; s += `<g opacity=".5"><rect x="${880 + a}" y="508" width="70" height="20" fill="#2a2420" transform="scale(1 -1) translate(0 -1036)"/></g><rect x="600" y="480" width="700" height="60" fill="#dce8f0" opacity="${.18 + .1 * Math.sin(t * 3)}"/>`; }
    if (E === 'dshin' && has('photoin')) s += `<g transform="translate(990 690) rotate(${-8})"><rect x="-60" y="-40" width="120" height="86" fill="#f4efe2" stroke="${INK}" stroke-width="4"/><rect x="-50" y="-30" width="100" height="56" fill="#b08a5a"/></g>`;
    if (has('elight')) { const on = Math.floor(t * 2.5) % 2; const ex = shot.elx || 1180, ey = shot.ely || 860; s += `<rect x="${ex - 14}" y="${ey - 40}" width="28" height="40" rx="6" fill="#3a3a3a" stroke="${INK}" stroke-width="4"/>` + (on ? `<circle cx="${ex}" cy="${ey - 44}" r="14" fill="#ff4a2a"/><circle cx="${ex}" cy="${ey - 44}" r="160" fill="#ff4a2a" opacity=".18"/>` : ''); }
  }
  if (front) {
    if (has('haze')) for (let k = 0; k < 6; k++) { const y = (shot.hz || 600) - 40 + k * 16; s += `<path d="M0 ${y} ${Array.from({ length: 13 }, (_, i) => `Q${i * 160 + 80} ${y + Math.sin(t * 4 + i + k) * 6} ${i * 160 + 160} ${y}`).join(' ')}" stroke="#fff" stroke-width="10" fill="none" opacity=".05"/>`; }
    if (has('dust')) for (let k = 0; k < 40; k++) { const x = (rnd(k) * 2000 + t * (30 + rnd(k + 1) * 60)) % 2000 - 40, y = rnd(k + 2) * 1080 + Math.sin(t + k) * 20; s += `<circle cx="${x}" cy="${y}" r="${1.5 + rnd(k + 3) * 3}" fill="#fff2d0" opacity="${.25 + rnd(k + 4) * .35}"/>`; }
    if (has('blow')) for (let k = 0; k < 30; k++) { const x = (rnd(k) * 2400 + t * 900) % 2400 - 240, y = 760 + rnd(k + 5) * 320; s += `<path d="M${x} ${y} h${80 + rnd(k) * 160}" stroke="${pal.sand[0]}" stroke-width="${2 + rnd(k + 1) * 4}" opacity=".45" stroke-linecap="round"/>`; }
    if (has('storm') || has('stormin')) { const q = has('stormin') ? ease(clamp(lt / 2.5, 0, 1)) : 1; s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#a8743e" opacity="${.78 * q}"/>`;
      for (let k = 0; k < 90; k++) { const x = (rnd(k) * 2600 - t * (900 + rnd(k + 1) * 900)) % 2600; const xx = x < 0 ? x + 2600 : x; s += `<path d="M${xx - 300} ${rnd(k + 2) * 1080} h${120 + rnd(k) * 260}" stroke="#e8c48a" stroke-width="${2 + rnd(k + 3) * 6}" opacity="${.5 * q}" stroke-linecap="round"/>`; }
      s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#6a4020" opacity="${.15 * q * (1 + Math.sin(t * 2))}"/>`; }
    if (has('headlights') || (has('suvnight') && !(has('lightsout') && lt > .6))) { const q = has('suvarrive') ? ease(clamp(lt / 3.2, 0, 1)) : 1; const x = 2300 - 1200 * q - 250 * .9; s += `<path d="M${x} 760 L${x - 1300} 600 L${x - 1300} 1080 L${x} 790Z" fill="#fff7c0" opacity=".22"/>`; }
  }
  return base + s;
};
Object.assign(LIGHT, {
  hot: t => `<rect width="1920" height="1080" fill="#fff0c0" opacity="${.08 + .03 * Math.sin(t * 2)}"/>`,
  sunset: t => `<rect width="1920" height="1080" fill="#ff7a30" opacity=".14"/>`,
  night: t => `<rect width="1920" height="1080" fill="#050a20" opacity=".35"/>`,
  storm: t => `<rect width="1920" height="1080" fill="#8a5a2a" opacity=".2"/>`,
  dawn: t => `<rect width="1920" height="1080" fill="#ffb080" opacity=".1"/>`
});
// ---------- burned-in subtitles + highlighted key phrases ----------
const _render6 = window.render;
window.render = function (t) {
  const TLs = window.TL; const cur = TLs.find(s => t >= s.start && t < s.end) || TLs[TLs.length - 1];
  window.SHX = cur.light === 'sunset' ? -110 : (cur.light === 'night' ? 0 : 40);
  const i = _render6(t);
  const sh = TLs[i]; let o = '';
  const SUB = TLs[0].subs || []; const c = SUB.find(c => t >= c.s && t < c.e);
  if (c) { const fs = 46; o += `<text x="960" y="1030" font-size="${fs}" font-weight="800" text-anchor="middle" font-family="DejaVu Sans, Arial" fill="#fff" stroke="#000" stroke-width="10" stroke-linejoin="round" paint-order="stroke">${c.txt.replace(/&/g, '&amp;')}</text>`; }
  if (sh.hl) { const lt = t - sh.start, q = clamp(lt / .25, 0, 1), sc = .5 + .6 * ease(q) - .1 * Math.sin(q * Math.PI); const fs = Math.min(84, 1560 / (sh.hl.length * .68)), w = Math.min(1720, sh.hl.length * fs * .7 + 100);
    o += `<g transform="translate(960 150) scale(${sc}) rotate(-1.5)"><rect x="${-w / 2}" y="-70" width="${w}" height="130" rx="18" fill="#111314" stroke="#ffd23a" stroke-width="6"/><text x="0" y="28" font-size="${fs}" font-weight="900" text-anchor="middle" font-family="DejaVu Sans, Arial" fill="#ffd23a">${sh.hl}</text></g>`; }
  if (o) document.getElementById('stage').insertAdjacentHTML('beforeend', `<svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">${o}</svg>`);
  return i;
};
