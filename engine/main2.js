// ---------- Video 2 cards, fx and lights ----------
const _cardOld = cardSVG, _fxOld = fxSVG;
function icon2(k, x, y, s = 1) {
  const g = i => `<g transform="translate(${x},${y}) scale(${s})">${i}</g>`;
  switch (k) {
    case 'water': return icon('bottle', x, y, s);
    case 'can': return icon('can', x, y, s);
    case 'battery': return g(`<rect x="-20" y="-44" width="40" height="88" rx="6" fill="#2c2f36" stroke="${INK}" stroke-width="4"/><rect x="-8" y="-54" width="16" height="10" fill="#9aa1a4" stroke="${INK}" stroke-width="3"/><rect x="-20" y="-10" width="40" height="54" rx="4" fill="#c9a24a"/>${T(0, 26, 26, '+', '#222')}`);
    case 'flashlight': return g(`<rect x="-50" y="-14" width="70" height="28" rx="8" fill="#4a4d55" stroke="${INK}" stroke-width="4"/><path d="M20 -20 L50 -30 L50 30 L20 20Z" fill="#5a5d65" stroke="${INK}" stroke-width="4"/><path d="M52 -26 L90 -40 L90 40 L52 26Z" fill="#f4e7b0" opacity=".7"/>`);
    case 'medkit': return g(`<rect x="-44" y="-34" width="88" height="68" rx="8" fill="#f1ece2" stroke="${INK}" stroke-width="4"/><path d="M0 -20 v40 M-20 0 h40" stroke="#c33a2f" stroke-width="12"/><path d="M-14 -34 v-10 h28 v10" stroke="${INK}" stroke-width="4" fill="none"/>`);
    case 'knife': return g(`<rect x="-50" y="-10" width="60" height="20" rx="6" fill="#d8b52a" stroke="${INK}" stroke-width="4"/><path d="M10 -8 L56 -8 L44 8 L10 8Z" fill="#d6dbe0" stroke="${INK}" stroke-width="4"/>`);
    case 'opener': return g(`<path d="M-50 -6 L30 -6 M-50 6 L30 6" stroke="#9aa1a4" stroke-width="10"/><circle cx="40" cy="0" r="18" fill="#9aa1a4" stroke="${INK}" stroke-width="4"/><path d="M40 -18 l14 -14" stroke="${INK}" stroke-width="6"/>`);
    case 'bandage': return g(`<rect x="-46" y="-16" width="92" height="32" rx="16" fill="#e9c9a6" stroke="${INK}" stroke-width="4" transform="rotate(-20)"/><rect x="-14" y="-12" width="28" height="24" fill="#f6efe2" transform="rotate(-20)"/>`);
    case 'radio': return g(`<rect x="-36" y="-40" width="72" height="80" rx="10" fill="#3a3f46" stroke="${INK}" stroke-width="4"/><rect x="-26" y="-30" width="52" height="24" fill="#4fe07a"/><path d="M20 -40 l14 -40" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M-24 ${4 + i * 10} h48" stroke="#22262b" stroke-width="5"/>`).join('')}`);
    case 'food': return g(`<rect x="-50" y="-20" width="100" height="60" rx="8" fill="#b98a5a" stroke="${INK}" stroke-width="4"/><path d="M-40 -20 q10 -30 30 -10 q14 -26 30 0 q20 -20 30 10" fill="#7fb06a" stroke="${INK}" stroke-width="4"/>`);
    case 'medicine': return g(`<rect x="-30" y="-40" width="60" height="84" rx="8" fill="#f1ece2" stroke="${INK}" stroke-width="4"/><rect x="-34" y="-56" width="68" height="20" rx="4" fill="#3a9a5a" stroke="${INK}" stroke-width="4"/><path d="M0 -14 v36 M-18 4 h36" stroke="#3a9a5a" stroke-width="10"/>`);
    case 'wall': return g(Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) => `<rect x="${-60 + c * 40 + (r % 2) * 20}" y="${-40 + r * 22}" width="38" height="20" fill="#a8553c" stroke="${INK}" stroke-width="3"/>`).join('')).join(''));
  }
  return '';
}
// store plan
const SP = { bakery: [280, 190, 480, 140, 'BAKERY'], corridor: [780, 230, 600, 60, 'STAFF CORRIDOR'], loading: [1400, 190, 260, 140, 'LOADING BAY'], pharmacy: [280, 360, 220, 180, 'PHARMACY'],
  office: [1180, 360, 240, 120, "MANAGER'S OFFICE"], secroom: [1440, 360, 220, 120, 'SECURITY'], storage: [1440, 510, 220, 190, 'STORAGE'], electronics: [280, 570, 220, 130, 'ELECTRONICS'], restrooms: [280, 730, 220, 130, 'RESTROOMS'], checkouts: [560, 820, 800, 60, 'CHECKOUTS'] };
const EXITS = { main: [960, 960, 'MAIN ENTRANCE'], emerg: [240, 795, 'EMERGENCY EXIT'], loading: [1530, 170, 'LOADING BAY EXIT'] };
function storePlan(c, p, t) {
  let s = R(240, 170, 1440, 790, '#e6dfd0', 7, 'rx="6"') + T(960, 120, 46, 'GREENLEAF MARKET · FLOOR PLAN', '#2f4a4c');
  for (let i = 0; i < 6; i++) s += `<rect x="${560 + i * 100}" y="380" width="44" height="380" fill="#b5aa92" stroke="${INK}" stroke-width="3"/>`;
  for (const k in SP) { const [x, y, w, h, lab] = SP[k]; const hl = (c.mode === 'route' || c.mode === 'route0') && ['bakery', 'corridor', 'loading'].includes(k);
    s += R(x, y, w, h, hl ? '#fff3c4' : '#d6cdb5', 4, 'rx="6"') + T(x + w / 2, y + h / 2 + 9, k === 'corridor' ? 24 : 22, lab, '#3a4546', 800); }
  const mark = (k, col, txt, a = 1) => { const [x, y, lab] = EXITS[k]; return `<g opacity="${a}">${C(x, y, 34, col, 6)}${T(x, y + 13, 36, txt, '#fff', 900)}${k === 'emerg' ? T(x - 44, y - 4, 22, 'EMERGENCY', col, 900, 'end') + T(x - 44, y + 22, 22, 'EXIT', col, 900, 'end') : (k === 'loading' ? T(x + 160, y - 4, 22, 'LOADING BAY', col, 900, 'start') + T(x + 160, y + 22, 22, 'EXIT', col, 900, 'start') : T(x, y + 75, 26, lab, col, 900))}</g>`; };
  const pin = (x, y) => `<g transform="translate(${x},${y - 6})"><path d="M0 0 C-26 -36 -26 -62 0 -62 C26 -62 26 -36 0 0Z" fill="#2f5a3e" stroke="${INK}" stroke-width="5"/><circle cy="-42" r="9" fill="#fff"/></g>`;
  if (c.mode === 'exits') { ['main', 'emerg', 'loading'].forEach((k, i) => { const a = clamp((p - .1 - i * .25) * 5, 0, 1); s += mark(k, '#2f6a8a', i + 1, a); }); }
  if (c.mode === 'x_main') { s += mark('main', '#c33a2f', '✕') + mark('emerg', '#8a8f88', '2', .6) + mark('loading', '#8a8f88', '3', .6);
    for (let i = 0; i < 14; i++) s += `<circle cx="${820 + i * 22 + Math.sin(t * 3 + i) * 4}" cy="${1010 + (i % 3) * 14}" r="9" fill="#5a5f58"/>`; }
  if (c.mode === 'loading' || c.mode === 'route0') { s += mark('main', '#c33a2f', '✕', .9) + mark('emerg', '#c33a2f', '✕', .9) + mark('loading', '#2f8a4a', '✓'); }
  if (c.mode === 'either') { s += mark('loading', '#c9a24a', '?') + mark('main', '#c9a24a', '?') + mark('emerg', '#c9a24a', '?'); }
  if (c.mode === 'flood') { s += mark('main', '#c33a2f', '!') + mark('emerg', '#c33a2f', '!') + mark('loading', '#c33a2f', '!');
    for (let i = 0; i < 40; i++) { const q = clamp(p * 1.4 - rnd(i) * .4, 0, 1); const tx = 580 + rnd(i + 3) * 560, ty = 400 + rnd(i + 7) * 340; s += `<circle cx="${960 + (tx - 960) * q}" cy="${960 + (ty - 960) * q}" r="9" fill="#5a5f58" opacity="${q > 0 ? 1 : 0}"/>`; } }
  if (c.mode === 'route' || c.mode === 'route0') {
    const pts = [[1550, 600], [1140, 600], [1140, 345], [700, 345], [700, 260], [1530, 260], [1530, 175]];
    let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const q = c.mode === 'route0' ? clamp((p - .1) / .5, 0, 1) * .25 : clamp((p - .05) / .7, 0, 1);
    const d = 'M' + pts.map(a => a.join(' ')).join(' L');
    s += `<path d="${d}" stroke="#2f8a4a" stroke-width="10" fill="none" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - ease(q))}" stroke-linecap="round" stroke-linejoin="round"/>`;
    let rem = L * ease(q), pos = pts[0]; for (let i = 1; i < pts.length; i++) { const sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (rem <= sl) { const f = rem / sl; pos = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; break; } rem -= sl; pos = pts[i]; }
    s += pin(pos[0], pos[1]);
  }
  if (c.mode === 'exits' || c.mode === 'x_main') s += pin(1550, 610);
  return s;
}
cardSVG = function (c, p, t, dur) {
  if (c.t === 'day' && typeof c.n === 'string') { const o = clamp(p * 5, 0, 1) * clamp((1 - p) * 5, 0, 1); return `<rect width="1920" height="1080" fill="#151417"/>` + T(960, 580, 130, c.n, '#f3f0ea', 900, 'middle', `letter-spacing="10" opacity="${o}"`); }
  const BG = `<rect width="1920" height="1080" fill="${CREAM}"/>`;
  if (c.t === 'clock') { const flip = p > .45; const v = flip ? c.b : c.a; const fl = flip ? clamp(1 - (p - .45) * 6, 0, 1) : 0;
    return `<rect width="1920" height="1080" fill="#101315"/>` + R(560, 330, 800, 360, '#1c2124', 10, 'rx="30"') + T(960, 600, 230, v, flip ? '#ff5a4a' : '#4fe07a', 900, 'middle', 'letter-spacing="10"') + T(960, 780, 40, 'SECURITY SYSTEM', '#8a9493', 800, 'middle', `letter-spacing="6"`) + `<rect width="1920" height="1080" fill="#fff" opacity="${fl * .6}"/>`; }
  if (c.t === 'icons4') { let s = BG + T(960, 220, 60, 'THE PERFECT HIDEOUT?', '#222', 900); const labs = ['Food', 'Bottled water', 'Medicine', 'Thick walls'], ks = ['food', 'water', 'medicine', 'wall'];
    ks.forEach((k, i) => { const a = clamp((p - .05 - i * .18) * 5, 0, 1); s += `<g opacity="${a}">${R(180 + i * 410, 340, 340, 400, '#fbf8f0', 6, 'rx="18"')}${icon2(k, 350 + i * 410, 520, 1.6)}${T(350 + i * 410, 700, 36, labs[i], '#333', 800)}</g>`; }); return s; }
  if (c.t === 'items') { let s = BG + T(960, 170, 60, c.title, '#222', 900, 'middle', 'letter-spacing="3"'); const n = c.items.length;
    const names = { water: 'Bottled water', can: 'Canned food', battery: 'Batteries', flashlight: 'Flashlight', medkit: 'First-aid kit', knife: 'Utility knife', opener: 'Can opener', bandage: 'Bandages', radio: 'Radio', wrench: 'Metal wrench' };
    if (c.pack) { s += `<g transform="translate(960,760)">${P('M-170 -200 Q-170 -260 -100 -260 H100 Q170 -260 170 -200 V160 H-170Z', '#1d1d21', 8)}${P('M-120 -260 Q-120 -330 0 -330 Q120 -330 120 -260', 'none', 12)}<path d="M-170 -120 H170" stroke="#3a3a40" stroke-width="8"/></g>`;
      c.items.forEach((k, i) => { const st = .08 + i * .15, q = clamp((p - st) / .18, 0, 1); const x0 = 240 + i * 360, y0 = 330, x1 = 960, y1 = 640; const x = x0 + (x1 - x0) * ease(q), y = y0 + (y1 - y0) * ease(q) - Math.sin(q * Math.PI) * 120; if (q < 1) s += icon2(k, x, y, 1.3 * (1 - q * .5)); });
      return s; }
    c.items.forEach((k, i) => { const col = i % 4, row = Math.floor(i / 4); const x = 300 + col * 440 + (row && n - 4 < 4 ? (4 - (n - 4)) * 220 : 0), y = 420 + row * 330; const a = clamp((p - .05 - i * .1) * 6, 0, 1);
      s += `<g opacity="${a}" transform="translate(${x},${y}) scale(${a < 1 ? .6 + a * .5 : 1}) translate(${-x},${-y})">${R(x - 170, y - 140, 340, 280, '#fbf8f0', 6, 'rx="18"')}${icon2(k, x, y - 20, 1.4)}${T(x, y + 105, 30, names[k], '#333', 800)}</g>`; }); return s; }
  if (c.t === 'map') return BG + storePlan(c, p, t);
  if (c.t === 'week') { let s = BG + T(960, 230, 64, 'THE PLAN', '#222', 900);
    for (let i = 0; i < 7; i++) { const x = 260 + i * 200, now = i + 1 === c.a; const fill = i === 6 ? '#cfe8d0' : (i + 1 < c.a ? '#3a4546' : '#fbf8f0');
      s += R(x, 420, 170, 220, fill, 6, 'rx="14"') + T(x + 85, 480, 28, 'DAY', i + 1 < c.a ? '#d6cdb5' : '#666', 800) + T(x + 85, 570, 80, i + 1, i + 1 < c.a ? '#f1ece2' : '#222', 900);
      if (i === 6) s += T(x + 85, 690, 32, 'ESCAPE', '#2f8a4a', 900);
      if (now) s += `<rect x="${x - 10}" y="410" width="190" height="240" rx="18" fill="none" stroke="${c.a === 5 ? '#c33a2f' : '#2f6a8a'}" stroke-width="10" opacity="${.6 + .4 * Math.sin(t * 6)}"/>` + T(x + 85, 380, 32, c.a === 5 ? 'TONIGHT?' : 'TODAY', c.a === 5 ? '#c33a2f' : '#2f6a8a', 900); }
    return s; }
  if (c.t === 'pa') { const q = clamp(p * 1.3, 0, 1); let s = `<rect width="1920" height="1080" fill="#1a2224"/>` + `<g transform="translate(960,330)">${P('M-120 -60 h80 l90 -70 v260 l-90 -70 h-80z', '#d6cdb5', 8)}</g>`;
    for (let k = 0; k < 3; k++) { const r = 60 + ((t * 120 + k * 60) % 180); s += `<path d="M${1080 + r * .3} ${330 - r * .7} q${r * .5} ${r * .7} 0 ${r * 1.4}" stroke="#d6cdb5" stroke-width="8" fill="none" opacity="${1 - r / 240}"/>`; }
    const n1 = Math.floor(q * 2 * c.a.length), n2 = Math.floor(clamp(q * 2 - 1, 0, 1) * c.b.length);
    return s + T(960, 700, 76, c.a.slice(0, n1), '#f1ece2', 900) + T(960, 810, 64, c.b.slice(0, n2), '#f1ece2', 800); }
  if (c.t === 'panel') { let s = `<rect width="1920" height="1080" fill="#2a2e30"/>` + R(360, 180, 1200, 720, '#56605f', 10, 'rx="30"') + `<rect x="420" y="240" width="1080" height="460" rx="12" fill="#080b0a" stroke="${INK}" stroke-width="8"/>`;
    const blink = Math.floor(t * 2.5) % 2;
    if (c.stage === 0) s += `<rect x="460" y="300" width="${blink ? 60 : 0}" height="80" fill="#ff5a4a"/>`;
    if (c.stage >= 1) s += T(960, 350, 54, 'SECURITY LOCKDOWN ACTIVE', blink || c.stage > 1 ? '#ff5a4a' : '#5a1a14', 900, 'middle', 'letter-spacing="3"');
    if (c.stage >= 2) { const rem = 3 * 86400 + 23 * 3600 + 58 * 60 + 41 - Math.floor(t); const d = Math.floor(rem / 86400), h = Math.floor(rem % 86400 / 3600), m = Math.floor(rem % 3600 / 60), sc = rem % 60; const z = n => String(n).padStart(2, '0');
      s += T(960, 520, c.stage === 4 ? 120 : 104, `${z(d)}d ${z(h)}:${z(m)}:${z(sc)}`, '#ffb43a', 900, 'middle', 'letter-spacing="6"') + T(960, 600, 32, 'TIME REMAINING', '#8a9493', 800, 'middle', 'letter-spacing="6"'); }
    if (c.stage === 3) s += T(960, 665, 34, 'SCHEDULE: 7-DAY LOCKDOWN · AUTO', '#4fe07a', 800, 'middle', `opacity="${clamp((p - .1) * 4, 0, 1)}"`);
    if (c.stage === 4) s += T(960, 665, 44, 'AT 00d 00:00:00  →  ?', '#ff5a4a', 900, 'middle', `opacity="${clamp((p - .4) * 3, 0, 1)}"`);
    for (let i = 0; i < 4; i++) s += C(560 + i * 100, 790, 22, i === 0 ? (blink ? '#ff3b3b' : '#5a1a14') : '#3a3f42', 5);
    return s; }
  if (c.t === 'loop') { let s = BG + T(960, 140, 58, c.stage === 0 ? 'NOT ON PURPOSE' : 'THE LOOP', c.stage === 0 ? '#2f4a4c' : '#c33a2f', 900);
    const nodes = [['MOTION SENSOR', 960, 280], ['ANNOUNCEMENT', 1440, 560], ['NOISE', 960, 860], ['MORE INFECTED', 480, 560]];
    if (c.stage === 0) { s += `<g transform="translate(960,560)">${P('M-160 -80 h110 l120 -90 v340 l-120 -90 h-110z', '#d6cdb5', 8)}</g>` + T(960, 900, 44, 'A glitch — not a trap.', '#555', 800); return s; }
    s += `<circle cx="960" cy="570" r="290" fill="none" stroke="#b5aa92" stroke-width="10" stroke-dasharray="20 18"/>`;
    const k = c.stage === 2 ? (t * .5) % 1 : clamp(p, 0, 1) * .25; const an = -Math.PI / 2 + k * Math.PI * 2;
    s += C(960 + Math.cos(an) * 290, 570 + Math.sin(an) * 290, 22, '#c33a2f', 5);
    nodes.forEach(([lab, x, y], i) => { const a = c.stage === 2 ? 1 : clamp((p - i * .15) * 5, 0, 1); const active = Math.floor(((an + Math.PI / 2 + 6.283) % 6.283) / 1.5708) === i;
      s += `<g opacity="${a}">${R(x - 190, y - 55, 380, 110, active && c.stage === 2 ? '#fff3c4' : '#fbf8f0', 6, 'rx="18"')}${T(x, y + 13, 36, lab, '#222', 900)}</g>`; });
    if (c.stage >= 1) s += T(960, 590, 70, '∞', '#c33a2f', 900);
    return s; }
  if (c.t === 'warning') { let s = `<rect width="1920" height="1080" fill="#1c1f20"/>` + R(240, 240, 1440, 600, '#d8b52a', 8);
    s += `<rect x="290" y="290" width="1340" height="500" fill="#1c1f20"/>` + Array.from({ length: 20 }, (_, i) => `<path d="M${250 + i * 76} 250 l40 30" stroke="#1c1f20" stroke-width="20"/>`).join('');
    s += `<path d="M960 340 L1030 470 H890Z" fill="#d8b52a" stroke="${INK}" stroke-width="6"/>` + T(960, 458, 70, '!', '#1c1f20', 900);
    s += T(960, 580, 64, 'DISABLING SECURITY MAY', '#f1ece2', 900, 'middle', `opacity="${clamp(p * 4, 0, 1)}"`) + T(960, 680, 64, 'RELEASE ALL LOCKED EXITS', '#ff5a4a', 900, 'middle', `opacity="${clamp((p - .2) * 4, 0, 1)}"`); return s; }
  if (c.t === 'gauge') { const v = Math.max(4, Math.round(38 - 34 * clamp(p * 1.2, 0, 1))); const fl = Math.floor(t * 8) % 3 === 0;
    let s = `<rect width="1920" height="1080" fill="#14181a"/>` + T(960, 260, 54, 'BACKUP POWER', '#8a9493', 900, 'middle', 'letter-spacing="6"');
    s += R(460, 380, 960, 300, 'none', 12, 'rx="30"') + R(1420, 470, 50, 120, '#3a3f42', 8) + `<rect x="480" y="400" width="${920 * v / 100}" height="260" rx="18" fill="${v < 15 ? (fl ? '#ff5a4a' : '#8a1f1a') : '#c9a24a'}"/>`;
    return s + T(960, 820, 120, v + '%', v < 15 ? '#ff5a4a' : '#f1ece2', 900); }
  if (c.t === 'radio' && c.red) { let s = _cardOld(Object.assign({}, c, { red: 0 }), p, t, dur); return s.replace(/#4fe07a/g, '#ff5a4a').replace(/#9fe0b0/g, '#ff9a8a'); }
  return _cardOld(c, p, t, dur);
};

function heroOf(shot) { return (shot.actors || []).find(a => a.k === 'hero'); }
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env; const has = k => f.includes(k); let s = '';
  if (!front) {
    if (has('carts')) s += cartSVG(560, 900, 1.0, 95) + cartSVG(1250, 930, 1.1, -80) + cartSVG(900, 980, .9, 175);
    if (has('smear')) s += `<path d="M760 940 q80 -30 180 -10 q90 20 160 -6 q30 30 -40 40 q-120 10 -220 -6 q-70 0 -80 -18z" fill="#5a1f1c" opacity=".75"/>`;
    if (has('shelfpush') || has('shelfin')) { const q = has('shelfpush') ? ease(clamp(p * 1.3, 0, 1)) : ease(clamp(p * 1.5, 0, 1)) * .3 + .7; const x = 700 - 300 * q;
      s += `<g>${shelfUnit(x - 80, 380, 260, 440, 3, 61)}</g>` + (q < .99 ? `<path d="M${x + 190} 830 l60 6 M${x + 190} 840 l80 4" stroke="#fff" stroke-width="4" opacity="${.4 + .4 * Math.sin(t * 20)}"/>` : ''); }
    if (has('stash')) s += [['water', 1080, 790], ['water', 1110, 790], ['can', 1160, 795], ['can', 1200, 795], ['battery', 1250, 800], ['medkit', 1320, 790]].map(([k, x, y]) => icon2(k, x, y, .55)).join('');
    if (has('lamp')) { s += `<rect x="600" y="770" width="24" height="50" rx="6" fill="#4a4d55" stroke="${INK}" stroke-width="3"/>`; }
    if (has('radioprop')) s += icon2('radio', 1010, 640, .9);
    if (has('loot')) s += icon2('medkit', 1150, 790, .6) + icon2('bandage', 1230, 800, .5);
    if (has('liquid')) { const q = E === 'staffdoor' ? clamp(.35 + lt * .03, 0, 1) : 1; s += `<ellipse cx="960" cy="${828 + 30 * q}" rx="${150 * q + 40}" ry="${22 * q + 6}" fill="#1e1416" opacity=".9"/>`; }
    if (has('knock')) { const k = lt % 3; const sh = (k < .1 || (k > .9 && k < 1) || (k > 1.8 && k < 1.9)) ? 6 : 0; s += `<rect x="${830 + sh}" y="290" width="260" height="500" fill="#5f686a" opacity="${sh ? 1 : 0}"/>` + (sh ? `<path d="M780 400 l-40 -20 M780 500 l-50 0 M780 600 l-40 20" stroke="#f1ece2" stroke-width="6"/>` : ''); }
    if (has('rack') || has('rackmove') || has('rackopen')) { const off = has('rackopen') ? 120 : (has('rackmove') ? 50 * ease(clamp(p, 0, 1)) : 0);
      s += `<g transform="translate(${960 + off},780) rotate(-24)">${R(-260, -90, 520, 120, GREY, 7)}${Array.from({ length: 4 }, (_, i) => `<path d="M${-250 + i * 130} -90 v120" stroke="${INK}" stroke-width="5"/>`).join('')}${prodRow(-240, -80, 480, 40, 71)}</g>`;
      for (let i = 0; i < 6; i++) s += icon2(i % 2 ? 'can' : 'water', 760 + i * 70 + off * .3, 900 + (i % 2) * 20, .45); }
    if (has('drawers')) s += R(600, 690, 160, 50, '#8a6a46', 5) + `<rect x="620" y="700" width="120" height="30" fill="#e9dfc6"/>`;
    if (E === 'office') { const q = has('cabinetmove') ? ease(clamp(p * 1.3, 0, 1)) : 0; const x = 1390 - 230 * q; s += R(x, 420, 180, 400, '#7d8588', 7) + [0, 1, 2].map(i => R(x + 16, 440 + i * 128, 148, 110, '#8a9294', 4) + `<rect x="${x + 70}" y="${480 + i * 128}" width="40" height="12" rx="6" fill="#3a3f42"/>`).join(''); }
    if (has('onescreen')) { const x = 1202, y = 162; s += `<rect x="${x}" y="${y}" width="166" height="81" fill="#3a4a42"/><rect x="${x + 50}" y="${y + 6}" width="70" height="8" fill="#8a9a94"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${x + 30 + i * 22}" cy="${y + 30 + (i % 2) * 8}" r="6" fill="#1a201d"/>`).join('') + `<rect x="${x - 10}" y="${y - 10}" width="186" height="101" fill="#b8ffd8" opacity="${.08 + .04 * Math.sin(t * 9)}"/>`; }
    if (has('cctvcrowd')) for (let i = 0; i < 26; i++) { const tx = 300 + rnd(i) * 1320, ty = 270 + rnd(i + 5) * 120; s += `<circle cx="${tx + Math.sin(t * 2 + i) * 6}" cy="${ty + Math.cos(t * 1.7 + i) * 5}" r="26" fill="#121714" stroke="#2a332e" stroke-width="4"/>`; }
    if (has('fallenshelf')) s += `<g transform="translate(1250,880) rotate(-70)">${R(-60, -260, 120, 520, GREY, 7)}</g>` + Array.from({ length: 10 }, (_, i) => icon2(['can', 'water', 'battery'][i % 3], 1000 + i * 60, 960 + (i % 3) * 30, .45)).join('');
    if (has('shutterrise') || has('shutterhalf')) { const q = has('shutterrise') ? .08 * clamp(p, 0, 1) + .02 : .45; const h = 620 * (1 - q); s += `<rect x="510" y="${840 - 620 * q}" width="900" height="${620 * q}" fill="#7d8a9a" opacity=".55"/>` + `<rect x="510" y="220" width="900" height="${h}" fill="#7d8588" stroke="${INK}" stroke-width="7"/>` + Array.from({ length: Math.floor(h / 40) }, (_, i) => `<path d="M510 ${220 + h - i * 40} h900" stroke="#5f686a" stroke-width="6"/>`).join('') + `<rect x="510" y="${220 + h - 26}" width="900" height="26" fill="#d8b52a" stroke="${INK}" stroke-width="5"/>`; }
    else if (E === 'loading') { s += `<rect x="510" y="220" width="900" height="610" fill="#7d8588" stroke="${INK}" stroke-width="7"/>` + Array.from({ length: 15 }, (_, i) => `<path d="M510 ${250 + i * 40} h900" stroke="#5f686a" stroke-width="6"/>`).join('') + `<rect x="510" y="806" width="900" height="26" fill="#d8b52a" stroke="${INK}" stroke-width="5"/>`; }
    if (has('daylightgap')) s += `<rect x="520" y="828" width="880" height="10" fill="#ffe9a8" opacity=".9"/><path d="M520 838 L380 1080 L1540 1080 L1400 838Z" fill="#ffe9a8" opacity=".12"/>`;
    if (has('bagdrag')) s += `<rect x="${1000 + 60 * lt * .8}" y="840" width="70" height="44" rx="10" fill="#1d1d21" stroke="${INK}" stroke-width="5"/>`;
    if (has('fabric')) s += `<path d="M900 870 q30 -10 60 4 l-6 14 q-26 -10 -52 0z" fill="#2f5a3e" stroke="${INK}" stroke-width="3"/>`;
    if (has('winflicker')) for (let i = 0; i < 5; i++) { const on = rnd(Math.floor(t * 6) + i * 9) > .35; s += `<rect x="${1060 + i * 170}" y="340" width="120" height="70" fill="#f4f0c8" opacity="${on ? .75 : .1}"/>`; }
    if (has('broken')) s += `<path d="M820 300 l60 120 l-50 80 l90 100 M1020 260 l-40 140 l70 60 l-40 120" stroke="#cfe0ff" stroke-width="5" fill="none"/>`;
    if (has('beacons') && E === 'street') { const on = Math.floor(t * 3) % 2; s += `<circle cx="1260" cy="540" r="14" fill="${on ? '#ff3b3b' : '#3b6bff'}"/><circle cx="1260" cy="540" r="60" fill="${on ? '#ff3b3b' : '#3b6bff'}" opacity=".25"/>`; }
    if (has('smoke')) for (let k = 0; k < 18; k++) { const ph = (t * .1 + k / 18) % 1, base = k % 2 ? 640 : 1500; s += `<circle cx="${base + Math.sin(k * 3 + ph * 4) * 30 + ph * 160}" cy="${260 - ph * 300}" r="${24 + ph * 90}" fill="#3a3a3e" opacity="${.55 * (1 - ph * .7)}"/>`; }
  }
  if (front) {
    if (E === 'entrance') { s += ENV.entrancefront(shot.light); if (has('marks')) for (let i = 0; i < 12; i++) s += `<ellipse cx="${200 + rnd(i) * 1500}" cy="${480 + rnd(i + 4) * 300}" rx="${30 + rnd(i + 2) * 40}" ry="${50 + rnd(i + 8) * 60}" fill="#3a3430" opacity=".35"/>`; }
    if (has('shutters')) { const q = ease(clamp((p - .05) / .3, 0, 1)); if (E === 'front') { const h = 490 * q; s += `<rect x="600" y="300" width="720" height="${h}" fill="#8d949e" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: Math.floor(h / 30) }, (_, k) => `<path d="M600 ${300 + h - k * 30} h720" stroke="#6d747e" stroke-width="5"/>`).join(''); } }
    if (has('notes')) for (let k = 0; k < 7; k++) { const ph = (t * .35 + k / 7) % 1; const x = 300 + k * 230 + Math.sin(ph * 6 + k) * 30, y = 700 - ph * 600; s += `<g opacity="${(1 - ph) * .9}" transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="16" ry="12" fill="#f1ece2" transform="rotate(-20)"/><path d="M14 -4 V-60 l26 10" stroke="#f1ece2" stroke-width="6" fill="none"/></g>`; }
    if (has('speaker')) { const x = 960, y = E === 'aisle' ? 180 : 150; s += P(`M${x - 50} ${y - 40} h100 l-14 64 h-72z`, '#3a3f4a', 6); for (let k = 0; k < 3; k++) { const r = 20 + ((t * 70 + k * 30) % 90); s += `<path d="M${x - r} ${y + 36 + r * .4} q${r} ${r * .5} ${2 * r} 0" stroke="#fff" stroke-width="5" fill="none" opacity="${1 - r / 110}"/>`; } }
    if (has('ghost')) s += '';
    if (has('cctv')) { s += `<rect width="1920" height="1080" fill="#7fffb0" opacity=".06"/>` + Array.from({ length: 54 }, (_, i) => `<path d="M0 ${i * 20} H1920" stroke="#000" stroke-width="3" opacity=".25"/>`).join('');
      s += T(60, 70, 34, 'CAM 01 · ENTRANCE', '#e9efe6', 800, 'start') + T(1860, 70, 34, '00:0' + Math.floor(clamp(lt, 0, 9)) + ':' + String(Math.floor((lt * 7) % 60)).padStart(2, '0'), '#e9efe6', 800, 'end') + (Math.floor(t * 2) % 2 ? `<circle cx="80" cy="1010" r="14" fill="#ff3b3b"/>${T(110, 1022, 32, 'REC', '#ff3b3b', 800, 'start')}` : ''); }
    if (has('cctvlights')) s += `<rect width="1920" height="1080" fill="#ffffff" opacity="${clamp(1 - (p - .3) * 3, 0, .4) * (p > .3 ? 1 : 0)}"/>`;
    if (has('sensor')) { const pu = (Math.sin(t * 8) + 1) / 2; s += `<path d="M960 275 L700 520 L1220 520Z" fill="#ff3b3b" opacity="${.12 + .1 * pu}"/>` + `<circle cx="960" cy="262" r="${50 + pu * 16}" fill="none" stroke="#ff3b3b" stroke-width="8"/>` + T(960, 190, 34, 'MOTION SENSOR', '#ff5a4a', 900); }
    if (has('press')) { const q = clamp((p - .3) * 4, 0, 1); s += `<circle cx="960" cy="560" r="150" fill="#ff7a5a" opacity="${q * .5}"/>`; }
    if (E === 'override') { const q = has('press') ? clamp((p - .1) * 3, 0, 1) : .2 * Math.sin(t * 2) + .1; const y = has('press') ? 640 - 70 * ease(q) : 650 + 10 * Math.sin(t * 2); s += P(`M1300 1080 Q1240 ${y + 160} 1060 ${y + 40} Q980 ${y - 10} 920 ${y} Q860 ${y + 40} 900 ${y + 80} L1100 ${y + 200} L1180 1080Z`, '#9a6646', 7) + `<path d="M1300 1080 L1220 ${y + 220}" stroke="#2f5a3e" stroke-width="170"/>`; }
    if (has('flash')) s += `<rect width="1920" height="1080" fill="#fff" opacity="${clamp(1 - lt * 3, 0, 1) * .8}"/>`;
    if (has('crash')) s += `<rect width="1920" height="1080" fill="#fff" opacity="${clamp(1 - lt * 4, 0, 1) * .5}"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${700 + rnd(i) * 520} ${300 + rnd(i + 3) * 400} l${(rnd(i + 5) - .5) * 60} ${20 + rnd(i + 6) * 40} l20 -14z" fill="#cfe0ff" opacity="${clamp(1 - lt, 0, 1)}" transform="translate(0,${lt * 300})"/>`).join('');
    if (has('breath')) for (let k = 0; k < 3; k++) { const ph = (t * .5 + k / 3) % 1; s += `<circle cx="${1460 - ph * 80}" cy="${700 - ph * 40}" r="${8 + ph * 30}" fill="#e9efe6" opacity="${(1 - ph) * .35}"/>`; }
    if (has('dust')) for (let i = 0; i < 40; i++) { const x = (rnd(i) * 1920 + t * 20 * (rnd(i + 1) - .5)) % 1920, y = (rnd(i + 3) * 1080 + t * 10) % 1080; s += `<circle cx="${x}" cy="${y}" r="${1.5 + rnd(i + 2) * 2.5}" fill="#e9dfc6" opacity=".35"/>`; }
    if (has('torch')) { const a = Math.sin(t * .6) * 300; s += `<path d="M960 1080 L${700 + a} 380 L${1220 + a} 380Z" fill="#fff4c8" opacity=".14"/>`; }
    if (has('beam')) { const h = heroOf(shot); if (h) { const x = h.x + (h.mv || 0) * lt, dir = h.f ? -1 : 1, y = h.y - 120 * h.s; s += `<path d="M${x + dir * 50 * h.s} ${y} L${x + dir * 900} ${y - 260} L${x + dir * 900} ${y + 260}Z" fill="#fff4c8" opacity=".16"/>`; } }
    if (has('powerfail')) { const q = p > .55 ? clamp((p - .55) * 8, 0, 1) : 0; s += `<rect width="1920" height="1080" fill="#05080a" opacity="${q * .65 * (Math.floor(t * 20) % 3 ? 1 : .6)}"/>`; }
    if (has('lightson')) { for (let k = 0; k < 6; k++) { const on = p > .1 + k * .07; s += `<rect x="0" y="${k * 180}" width="1920" height="180" fill="#05080a" opacity="${on ? 0 : .7}"/>`; } }
    if (has('shake')) s += '';
    if (has('panelblink')) { const on = Math.floor(t * 2.5) % 2; s += `<rect x="1490" y="440" width="130" height="70" fill="${on ? '#ff3b3b' : '#3a0a08'}" opacity=".85"/>` + T(1555, 485, 20, 'LOCKDOWN', on ? '#fff' : '#ff5a4a', 900); }
    if (has('shutterstrain')) s += `<path d="M700 340 l-30 -20 M1220 340 l30 -20" stroke="#f1ece2" stroke-width="6" opacity="${.5 + .5 * Math.sin(t * 18)}"/>`;
  }
  return s;
};
Object.assign(LIGHT, {
  lit: t => `<rect width="1920" height="1080" fill="#e8fff4" opacity=".05"/>`,
  nightlit: t => `<rect width="1920" height="1080" fill="#0d1a3a" opacity=".25"/>`,
  black: t => `<rect width="1920" height="1080" fill="#000" opacity=".93"/>`,
  red: t => `<rect width="1920" height="1080" fill="#0a0608" opacity=".45"/><rect width="1920" height="1080" fill="#ff1a10" opacity="${.12 + .12 * (Math.sin(t * 4.5) + 1) / 2}"/>`,
  afternoon: t => `<rect width="1920" height="1080" fill="#ffb060" opacity=".1"/>`,
  memory: t => `<rect width="1920" height="1080" fill="#c9a07a" opacity=".28"/>`,
  dawnbroken: t => `<rect width="1920" height="1080" fill="#ff9a70" opacity=".08"/>`,
  cctv: t => '',
  dim: t => `<rect width="1920" height="1080" fill="#0c1618" opacity=".3"/>`,
  dark: t => `<rect width="1920" height="1080" fill="#03070a" opacity=".62"/>`,
  night: t => `<rect width="1920" height="1080" fill="#0d1a3a" opacity=".36"/>`
});
// shake: camera shake for entrance impacts
const _render = window.render;
window.render = function (t) { const i = _render(t); const sh = window.TL[i]; if (sh.fx && sh.fx.includes('shake')) { const lt = t - sh.start; const k = Math.max(0, 1 - (lt % 1.2) * 4) * 8; const svg = document.querySelector('#stage svg'); svg.style.transform = `translate(${(rnd(Math.floor(t * 30)) - .5) * k}px,${(rnd(Math.floor(t * 30) + 1) - .5) * k}px)`; } return i; };
