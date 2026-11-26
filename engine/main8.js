// ---------- Video 8: flooded city — environments, cards, fx ----------
const FPAL = {
  storm: { sky: ['#2a323c', '#47505b', '#68717b'], water: ['#6a7e88', '#465a66', '#2c3a44'], bld: ['#6a7078', '#565c64', '#454a52'], win: '#2a3038', lit: '#3a4048' },
  fnight: { sky: ['#0a1220', '#16233a', '#2a3b54'], water: ['#2c4050', '#1c2c38', '#101a22'], bld: ['#3e4a5c', '#33404e', '#2a3442'], win: '#0e1218', lit: '#c9a34a' },
  clear: { sky: ['#5a6e86', '#a8b4b8', '#e6d2b0'], water: ['#7a929a', '#566e78', '#3a4c54'], bld: ['#8a8e92', '#74787e', '#5e6268'], win: '#3a4048', lit: '#3a4048' },
  pre: { sky: ['#2c343e', '#48525c', '#66707a'], water: ['#6e6650', '#524c3a', '#3a3428'], bld: ['#7a7e84', '#666a72', '#52565e'], win: '#d9c27a', lit: '#e9cf7a' }
};
const FP = L => FPAL[L] || FPAL.storm;
let fg = 0;
function fsky(L, h = 1080) { const p = FP(L), id = 'fs' + (fg++);
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".6" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient></defs><rect width="1920" height="${h}" fill="url(#${id})"/>`;
  if (L !== 'clear') for (let i = 0; i < 7; i++) { const x = rnd(i + 3) * 2100 - 100, y = 40 + rnd(i + 8) * 260, w = 300 + rnd(i) * 400; s += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${50 + rnd(i + 1) * 40}" fill="${L === 'fnight' ? '#0e141e' : '#2e353e'}" opacity=".75"/><ellipse cx="${x + 60}" cy="${y + 26}" rx="${w * .7}" ry="${30 + rnd(i + 2) * 30}" fill="${L === 'fnight' ? '#121a26' : '#39414b'}" opacity=".6"/>`; }
  else s += `<circle cx="1500" cy="300" r="220" fill="#fff2cc" opacity=".25"/><circle cx="1500" cy="300" r="60" fill="#fff6dc" opacity=".8"/>`;
  return s; }
function tower(x, top, w, L, seed, o = {}) { const p = FP(L); const col = p.bld[seed % 3];
  let s = `<rect x="${x}" y="${top}" width="${w}" height="${1100 - top}" fill="${col}" stroke="${INK}" stroke-width="${o.sw || 5}"/><rect x="${x + w * .62}" y="${top}" width="${w * .38}" height="${1100 - top}" fill="#000" opacity=".12"/>`;
  const cw = o.cw || 34, rh = o.rh || 46;
  for (let yy = top + 26; yy < 1080; yy += rh) for (let xx = x + 16; xx < x + w - cw; xx += cw + 14) { const lit = L === 'fnight' ? (rnd(seed * 31 + xx * 7 + yy) > .97) : (L === 'pre' ? rnd(seed + xx + yy) > .55 : false); s += `<rect x="${xx}" y="${yy}" width="${cw}" height="${rh * .55}" fill="${lit ? p.lit : p.win}" opacity="${lit ? .9 : .85}"/>`; }
  s += `<rect x="${x - 6}" y="${top - 12}" width="${w + 12}" height="14" fill="${p.bld[2]}" stroke="${INK}" stroke-width="4"/>`;
  if (o.box) s += `<rect x="${x + w * .2}" y="${top - 60}" width="${w * .3}" height="48" fill="${p.bld[1]}" stroke="${INK}" stroke-width="4"/>`;
  if (o.ant) s += `<path d="M${x + w * .7} ${top - 12} V${top - 110} M${x + w * .7 - 20} ${top - 80} h40" stroke="${INK}" stroke-width="5"/>`;
  return s; }
const FCITY = [[60, 330, 230, 0], [330, 420, 170, 1], [540, 240, 260, 2, 1], [860, 360, 190, 0], [1090, 300, 230, 1], [1370, 270, 220, 2], [1640, 410, 240, 0]];
ENV.fcity = L => { let s = fsky(L, 1080);
  for (let i = 0; i < 16; i++) s += tower(i * 130 - 30, 470 + rnd(i + 50) * 120, 110, L, i + 7, { cw: 16, rh: 26, sw: 3 });
  s += `<rect width="1920" height="1080" fill="${FP(L).sky[2]}" opacity=".35"/>`;
  FCITY.forEach(([x, top, w, sd, mar], i) => { s += tower(x, top, w, L, sd + i, { box: mar || i === 5, ant: i === 0 || i === 4 }); });
  return s; };
ENV.froof = L => { const p = FP(L); let s = fsky(L, 760);
  for (let i = 0; i < 10; i++) s += tower(i * 210 - 40, 420 + rnd(i + 20) * 160, 150, L, i + 3, { cw: 22, rh: 32, sw: 4 });
  s += `<rect width="1920" height="760" fill="${p.sky[2]}" opacity=".25"/>`;
  return s; };
function roofDeck(L) { const p = FP(L); let s = `<rect x="0" y="690" width="1920" height="50" fill="${p.bld[0]}" stroke="${INK}" stroke-width="6"/><rect x="0" y="740" width="1920" height="340" fill="${L === 'fnight' ? '#2a2e32' : '#6e7274'}" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M${i * 170} 740 L${(i * 170 - 960) * 1.6 + 960} 1080" stroke="#000" stroke-width="3" opacity=".15"/>`;
  for (let i = 0; i < 6; i++) s += `<ellipse cx="${300 + rnd(i) * 1400}" cy="${820 + rnd(i + 4) * 220}" rx="${60 + rnd(i + 1) * 80}" ry="10" fill="#000" opacity=".12"/>`;
  // access door structure (left)
  s += `<rect x="120" y="330" width="460" height="410" fill="${L === 'fnight' ? '#3a4044' : '#8a8e88'}" stroke="${INK}" stroke-width="7"/><rect x="100" y="310" width="500" height="34" fill="${L === 'fnight' ? '#2e3438' : '#6e726c'}" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="250" y="440" width="200" height="300" fill="${L === 'fnight' ? '#2a3a38' : '#56706a'}" stroke="${INK}" stroke-width="7"/><rect x="415" y="580" width="20" height="40" rx="6" fill="#c9c9c0" stroke="${INK}" stroke-width="4"/><rect x="290" y="470" width="120" height="60" fill="#1a2228" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="190" y="370" width="60" height="30" fill="#e0b030" stroke="${INK}" stroke-width="3"/>` + T(220, 393, 16, 'ROOF', '#1a1a1a', 900);
  // water tank (right) + antenna
  s += `<path d="M1500 740 V560 M1700 740 V560 M1500 650 L1700 560 M1700 650 L1500 560" stroke="${INK}" stroke-width="10"/><rect x="1460" y="380" width="280" height="190" rx="30" fill="${L === 'fnight' ? '#3e3a36' : '#8a7460'}" stroke="${INK}" stroke-width="7"/><path d="M1460 430 h280 M1460 520 h280" stroke="#000" stroke-width="5" opacity=".3"/>`;
  s += `<path d="M1860 740 V420 M1830 470 h60 M1840 520 h40" stroke="${INK}" stroke-width="7"/>`;
  return s; }
ENV.froofdeck = L => ENV.froof(L) + roofDeck(L);
ENV.fdoor = L => { const n = L === 'fnight'; let s = `<rect width="1920" height="1080" fill="${n ? '#30363a' : '#8a8e88'}"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M0 ${i * 120 + 40} H1920" stroke="#000" stroke-width="3" opacity=".12"/>`;
  s += `<rect x="520" y="40" width="880" height="1000" fill="${n ? '#1a1e20' : '#4a4e4a'}" stroke="${INK}" stroke-width="10"/>`;
  s += `<rect x="560" y="80" width="800" height="900" fill="${n ? '#2a3a38' : '#56706a'}" stroke="${INK}" stroke-width="8"/><rect x="640" y="150" width="640" height="260" fill="#1a2228" stroke="${INK}" stroke-width="6"/>`;
  for (const y of [520, 820]) s += `<rect x="600" y="${y}" width="720" height="16" fill="#000" opacity=".15"/>`;
  s += `<rect x="1250" y="540" width="40" height="110" rx="10" fill="#c9c9c0" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="560" y="980" width="800" height="28" fill="#05080a"/><rect x="0" y="1008" width="1920" height="72" fill="${n ? '#2a2e32' : '#6e7274'}" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="760" y="220" width="400" height="80" fill="#e0b030" stroke="${INK}" stroke-width="5" opacity=".9"/>` + T(960, 278, 48, 'ROOF ACCESS', '#1a1a1a', 900);
  return s; };
ENV.fstair = L => { let s = `<rect width="1920" height="1080" fill="#1c2024"/>`;
  for (let i = 0; i < 9; i++) { const y = 120 + i * 100, x = 300 + (i % 2) * 600; s += `<path d="M${x} ${y} l${i % 2 ? 700 : 700} ${0} l0 40 l-700 0z" fill="#34383c" stroke="${INK}" stroke-width="5"/>`; for (let k = 0; k < 7; k++) s += `<path d="M${x + k * 100} ${y} v40" stroke="${INK}" stroke-width="3" opacity=".5"/>`; }
  s += `<path d="M280 100 V1080 M1640 100 V1080" stroke="#8a8e88" stroke-width="12"/><rect x="0" y="0" width="1920" height="100" fill="#121518"/>`;
  s += `<rect x="0" y="880" width="1920" height="200" fill="#1a2622"/><path d="M0 900 q200 -12 400 0 t400 0 t400 0 t400 0 t400 0" stroke="#3a4a44" stroke-width="5" fill="none"/>`;
  return s; };
ENV.fmaint = L => { let s = `<rect width="1920" height="1080" fill="#3a4044"/><rect y="820" width="1920" height="260" fill="#2a2e32"/>` + P('M0 820 H1920', 'none', 6);
  for (const y of [300, 520, 740]) { s += R(160, y, 900, 22, '#5a5248', 5); for (let k = 0; k < 7; k++) s += R(190 + k * 120, y - 60 - rnd(y + k) * 50, 80, 60 + rnd(y + k) * 50, ['#8a6a3a', '#6a7a8a', '#a8a29a', '#c33a2f'][k % 4], 4); }
  s += `<path d="M1200 0 V820 M1260 0 V820" stroke="#6a6e70" stroke-width="22"/><path d="M1100 160 H1920" stroke="#7a5a3a" stroke-width="26"/>` + R(1380, 560, 380, 260, '#4a4038', 6);
  s += `<rect x="0" y="1040" width="1920" height="40" fill="#24323a" opacity=".8"/>`;
  return s; };
ENV.fstreet = L => { const p = FP(L); let s = fsky(L, 620);
  s += tower(-40, 160, 420, L, 1, { cw: 30, rh: 44 }) + tower(1540, 140, 440, L, 2, { cw: 30, rh: 44 }) + tower(420, 360, 280, L, 3, { cw: 22, rh: 34 }) + tower(1240, 330, 280, L, 4, { cw: 22, rh: 34 });
  s += `<rect y="760" width="1920" height="320" fill="#3a3e42" stroke="${INK}" stroke-width="6"/><path d="M0 900 H1920" stroke="#d9c27a" stroke-width="10" stroke-dasharray="80 60"/>`;
  s += `<rect y="740" width="1920" height="26" fill="#7a7e80" stroke="${INK}" stroke-width="4"/>`;
  return s; };
ENV.facross = L => { const p = FP(L); let s = fsky(L, 1080);
  s += tower(500, 120, 920, L, 5, { cw: 70, rh: 120 });
  s += `<rect x="830" y="380" width="120" height="66" fill="#05080c" stroke="${INK}" stroke-width="5"/>`;
  return s; };
ENV.fwater = L => { const p = FP(L); let s = fsky(L, 1080);
  for (let i = 0; i < 12; i++) s += tower(i * 170 - 40, 380 + rnd(i + 70) * 140, 130, L, i + 9, { cw: 18, rh: 28, sw: 3 });
  s += `<rect width="1920" height="1080" fill="${p.sky[2]}" opacity=".3"/>` + tower(-80, 120, 420, L, 2, { cw: 34, rh: 48 }) + tower(1500, 200, 380, L, 1, { cw: 34, rh: 48, box: 1 });
  return s; };
// ---------- water, rain, boats ----------
function waterSurf(L, wl, t, o = {}) { const p = FP(L), id = 'fw' + (fg++);
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.water[0]}"/><stop offset=".4" stop-color="${p.water[1]}"/><stop offset="1" stop-color="${p.water[2]}"/></linearGradient></defs>`;
  s += `<path d="M-40 ${wl} ${Array.from({ length: 14 }, (_, i) => `Q${i * 150 + 75} ${wl + Math.sin(t * 2 + i) * 6} ${i * 150 + 150} ${wl}`).join(' ')} L1960 1100 L-40 1100Z" fill="url(#${id})" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 30; i++) { const y = wl + 12 + Math.pow(rnd(i + 5), 1.4) * (1080 - wl), w = 40 + (y - wl) / 3, x = ((rnd(i) * 2100 + t * (o.flow || 18) * (1 + rnd(i + 2))) % 2100) - 100; s += `<path d="M${x} ${y} q${w / 2} -${4 + w * .04} ${w} 0" stroke="${L === 'fnight' ? '#5a7488' : '#b8ccd6'}" stroke-width="${2.5 + (y - wl) / 160}" fill="none" opacity=".7"/>`; }
  s += `<rect x="-40" y="${wl + 4}" width="2000" height="14" fill="#fff" opacity=".12"/>`;
  if (o.rings !== 0) for (let i = 0; i < 18; i++) { const q = (t * 1.6 + rnd(i + 40)) % 1, x = rnd(i + Math.floor(t * 1.6 + rnd(i + 40)) * 13) * 1920, y = wl + 20 + rnd(i * 3 + Math.floor(t * 1.6 + rnd(i + 40))) * (1060 - wl); s += `<ellipse cx="${x}" cy="${y}" rx="${4 + q * 26}" ry="${1.5 + q * 6}" fill="none" stroke="#c9d6d0" stroke-width="2" opacity="${(1 - q) * .6}"/>`; }
  for (let i = 0; i < 8; i++) { const x = rnd(i + 90) * 1920, y = wl + 30 + rnd(i + 91) * 300; s += `<path d="M${x} ${y} h${30 + rnd(i) * 60}" stroke="#2a2a22" stroke-width="6" opacity=".45" stroke-linecap="round"/>`; } // debris
  return s; }
function rainFX(t, n = 160, heavy = 1, L) { let s = ''; const col = L === 'fnight' ? '#8a9ab0' : '#c9d4dc';
  for (let i = 0; i < n * heavy; i++) { const sp = 1400 + rnd(i + 3) * 600; const x = (rnd(i) * 2300 + t * 260) % 2300 - 200, y = (rnd(i + 7) * 1300 + t * sp) % 1300 - 120; const l = 30 + rnd(i + 2) * 40; s += `<path d="M${x} ${y} l${-l * .22} ${l}" stroke="${col}" stroke-width="${1.5 + rnd(i + 4) * 1.5}" opacity="${.25 + rnd(i + 5) * .35}"/>`; }
  return s; }
function rescueBoat(x, y, s, flip, t, peopleLook) { const bob = Math.sin(t * 2.4) * 4;
  let g = `<g transform="translate(${x},${y + bob}) scale(${flip ? -s : s},${s})">`;
  g += figure({ k: 'op', x: 60, y: -40, s: .55, p: 'stand', f: 0, e: peopleLook || 'fear', nosh: 1 }, t, t, 'storm') + figure({ k: 'pax', x: -60, y: -40, s: .55, p: peopleLook === 'point' ? 'point' : 'stand', f: 0, v: 4, e: 'fear', nosh: 1 }, t, t, 'storm');
  g += `<path d="M-200 -50 L200 -50 Q230 -50 220 -10 L200 20 L-190 20 Q-220 0 -210 -40Z" fill="#ef7a22" stroke="${INK}" stroke-width="7"/><path d="M-200 -30 H210" stroke="#f4f2ee" stroke-width="8"/>`;
  g += `<rect x="-250" y="-70" width="50" height="80" rx="8" fill="#2a2d33" stroke="${INK}" stroke-width="6"/><path d="M-226 10 v40" stroke="${INK}" stroke-width="8"/>`;
  return g + `</g><ellipse cx="${x}" cy="${y + 26}" rx="${260 * s}" ry="${12 * s}" fill="#e9eef0" opacity=".25"/>`; }
function raft(x, y, s, t) { const bob = Math.sin(t * 1.8) * 6;
  return `<g transform="translate(${x},${y + bob}) rotate(${Math.sin(t * 1.3) * 2}) scale(${s})"><rect x="-200" y="-30" width="400" height="40" rx="6" fill="#8a6a4a" stroke="${INK}" stroke-width="6"/><path d="M-160 -30 v-50 M160 -30 v-50" stroke="#6a4a2e" stroke-width="16"/><rect x="40" y="-90" width="120" height="70" rx="14" fill="#e9e6dc" stroke="${INK}" stroke-width="5"/><path d="M-200 -10 h400 M-120 -30 l-20 40 M120 -30 l20 40" stroke="#c9b48a" stroke-width="6"/></g>`; }
// ---------- cards ----------
const _card7 = cardSVG, _fx7 = fxSVG;
function phoneFrame(inner, t, rot = -4) { return `<rect width="1920" height="1080" fill="#11161c"/><g transform="translate(960 560) rotate(${rot})"><path d="M200 380 q120 -40 160 120 l60 260 l-200 40Z" fill="#fbfaf6" stroke="${INK}" stroke-width="8"/><rect x="-240" y="-470" width="480" height="940" rx="56" fill="#111" stroke="${INK}" stroke-width="8"/><rect x="-216" y="-424" width="432" height="852" rx="28" fill="#0f141c"/>${inner}</g>`; }
cardSVG = function (c, p, t, dur) {
  const lt = p * dur;
  if (c.t === 'falert') { const o = blink(t * 1.4) ? 1 : .75; return phoneFrame(`<rect x="-200" y="-260" width="400" height="360" rx="24" fill="#c33a2f" opacity="${o}"/>` + T(0, -190, 34, '⚠ EMERGENCY ALERT', '#fff', 900) + T(0, -120, 46, 'FLASH FLOOD', '#fff', 900) + T(0, -70, 46, 'WARNING', '#fff', 900) + T(0, 0, 24, 'Move to higher ground', '#fff', 700) + T(0, 34, 24, 'immediately.', '#fff', 700) + T(0, -340, 26, '9:41 PM', '#9aa', 700), t); }
  if (c.t === 'fchat') { let s = T(0, -380, 28, 'Lily', '#fff', 900) + `<circle cx="-150" cy="-390" r="22" fill="#e2507a"/><rect x="-216" y="-350" width="432" height="2" fill="#2a3240"/>` + T(180, -380, 20, c.bat || '4%', '#ff6a5a', 900, 'end');
    const msgs = c.msgs || []; let y = -300; const show = c.newlast ? clamp(p * 4, 0, 1) : 1;
    msgs.forEach((m, i) => { const mine = m.startsWith('>'); const txt = mine ? m.slice(1) : m; const lines = []; let cur = ''; for (const w of txt.split(' ')) { if ((cur + ' ' + w).length > 20 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } lines.push(cur);
      const h = 30 + lines.length * 40, w = 330; const op = (i === msgs.length - 1 && c.newlast) ? show : 1; const x = mine ? 200 - w : -200;
      s += `<g opacity="${op}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${mine ? '#2e7af0' : (c.red && i === msgs.length - 1 ? '#7a1a1a' : '#2a3240')}"/>${lines.map((l, k) => T(x + 20, y + 44 + k * 40, 30, l, '#fff', 700, 'start')).join('')}</g>`; y += h + 18; });
    if (c.typing) s += `<rect x="-200" y="${y}" width="120" height="56" rx="22" fill="#2a3240"/>` + [0, 1, 2].map(k => `<circle cx="${-170 + k * 30}" cy="${y + 28}" r="8" fill="#9aa" opacity="${.3 + .7 * (Math.floor(t * 3) % 3 === k)}"/>`).join('');
    if (c.calling) s = T(0, -200, 40, 'Calling Lily…', '#fff', 800) + `<circle cx="0" cy="0" r="${70 + 10 * Math.sin(t * 6)}" fill="#e2507a"/>` + T(0, 160, 34, p > .5 ? 'No answer' : '', '#ff8a7a', 800) + `<circle cx="0" cy="300" r="50" fill="#c33a2f"/>`;
    return phoneFrame(s, t); }
  if (c.t === 'fnosig') return phoneFrame(T(0, -360, 24, 'No Service', '#ff8a7a', 800) + T(0, -180, 100, '2:07', '#fff', 300) + `<rect x="-160" y="20" width="320" height="140" rx="20" fill="#2a3240"/>` + T(0, 80, 34, 'Calling 112…', '#fff', 800) + T(0, 130, 26, p > .4 ? 'Call failed' : '', '#ff8a7a', 700) + T(160, -380, 22, '3%', '#ff6a5a', 900, 'end'), t);
  if (c.t === 'fkit') { let s = `<rect width="1920" height="1080" fill="#5e6264"/>`;
    const items = [['BACKPACK', x => `<rect x="${x - 70}" y="400" width="140" height="180" rx="30" fill="#18181a" stroke="${INK}" stroke-width="7"/><path d="M${x - 40} 400 q40 -60 80 0" stroke="${INK}" stroke-width="10" fill="none"/>`], ['SOME FOOD', x => `<rect x="${x - 80}" y="440" width="90" height="140" rx="8" fill="#c33a2f" stroke="${INK}" stroke-width="6"/><rect x="${x + 10}" y="480" width="80" height="100" rx="8" fill="#e0b030" stroke="${INK}" stroke-width="6"/>`], ['2 WATER BOTTLES', x => `<rect x="${x - 70}" y="400" width="60" height="180" rx="16" fill="#9fd2f5" stroke="${INK}" stroke-width="6"/><rect x="${x + 10}" y="400" width="60" height="180" rx="16" fill="#9fd2f5" stroke="${INK}" stroke-width="6"/>`], ['FLASHLIGHT', x => `<rect x="${x - 90}" y="470" width="150" height="50" rx="10" fill="#2a2d33" stroke="${INK}" stroke-width="6"/><path d="M${x + 60} 460 l40 -16 v102 l-40 -16z" fill="#e0b030" stroke="${INK}" stroke-width="6"/>`], ['PHONE · 5%', x => `<rect x="${x - 55}" y="400" width="110" height="190" rx="18" fill="#111" stroke="${INK}" stroke-width="6"/><rect x="${x - 30}" y="540" width="20" height="30" fill="#ff4a2a"/>`]];
    items.forEach(([lab, f], k) => { const o = clamp(p * 6 - k * .8, 0, 1); const x = 230 + k * 365; s += `<g opacity="${o}">${f(x)}${T(x, 690, 32, lab, '#fff', 900)}</g>`; });
    return s; }
  if (c.t === 'flist') { let s = `<rect width="1920" height="1080" fill="#14181e"/><g transform="rotate(-2 960 540)"><rect x="300" y="110" width="1320" height="860" rx="40" fill="#1d2228" stroke="${INK}" stroke-width="9"/><rect x="340" y="150" width="1240" height="780" rx="16" fill="#e9eef2"/>`;
    s += T(380, 210, 34, 'SURVIVOR REGISTER · SECTOR 4', '#2a3440', 900, 'start') + `<rect x="380" y="240" width="1160" height="4" fill="#9aa"/>`;
    s += `<rect x="400" y="290" width="300" height="380" fill="#fbfaf6" stroke="${INK}" stroke-width="6"/><svg x="410" y="300" width="280" height="300" viewBox="-160 -340 320 360">${figure({ k: 'lily', x: 0, y: 0, s: 1.4, p: 'stand', f: 0, e: 'soft', nosh: 1 }, 0, 0, 'clear')}</svg>`;
    s += T(760, 360, 60, 'LILY', '#1a2028', 900, 'start') + T(760, 420, 30, 'Age 12 · Residential Block C', '#4a5560', 700, 'start');
    if (c.stage >= 1) { const q = clamp(p * 3, 0, 1); s += `<rect x="740" y="480" width="740" height="110" rx="14" fill="#2a9a5a" opacity="${q}"/>` + T(1110, 552, 50, 'RESCUED — TWO DAYS AGO', '#fff', 900, 'middle', `opacity="${q}"`); }
    return s + '</g>'; }
  return _card7(c, p, t, dur);
};
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env, L = shot.light; const has = k => f.includes(k); let s = '';
  const base = _fx7(shot, lt, p, t, front);
  if (!front) {
    if (shot.wl != null) { const wl = shot.wl2 != null ? shot.wl + (shot.wl2 - shot.wl) * ease(clamp(lt / Math.max(1, shot.end - shot.start), 0, 1)) : shot.wl; s += waterSurf(L, wl, t, { flow: shot.flow }); if (E === 'froofdeck') s += roofDeck(L); }
    if (shot.boat) { const b = shot.boat; const q = ease(clamp(lt / (b.dur || 3), 0, 1)); const turn = b.turn && q > .45; const x = b.x0 + (b.x1 - b.x0) * (b.turn ? (q < .45 ? q / .45 : 1 - (q - .45) / .55 * .9) : q); s += rescueBoat(x, b.y, b.s, b.flip ? !turn : turn, t, b.look); }
    if (shot.raftAt) { const r = shot.raftAt; s += raft(r.x + (r.dx || 0) * clamp(lt / 4, 0, 1), r.y, r.s, t); }
    if (has('carswept')) { s += suv(-300 + lt * 260, shot.wl2 != null ? 870 : 900, .7, { col: '#c33a2f' }) + suv(2200 - lt * 200, 940, .75, { col: '#d8d2c2', flip: 1 }); }
    if (has('flash3')) { const cyc = (t % 2.2), on = (cyc < 1.1) ? (Math.floor(cyc / .3) % 2 === 0 && cyc < .9) : false; if (on) s += `<rect x="835" y="385" width="110" height="56" fill="#fff6c8"/><circle cx="890" cy="413" r="120" fill="#fff6c8" opacity=".25"/>`; }
    if (has('winshadow')) { const q = clamp((lt - .4) / 1.6, 0, 1); if (q > 0 && q < 1) s += `<g opacity=".9"><circle cx="${850 + q * 80}" cy="405" r="16" fill="#000"/><rect x="${838 + q * 80}" y="420" width="24" height="30" fill="#000"/></g>`; }
    if (E === 'fdoor') {
      if (has('seep')) { const q = clamp(lt / 3, 0, 1); s += `<path d="M560 1008 Q960 ${1008 + 60 * q} 1360 1008 L1500 1080 L420 1080Z" fill="#3a4a46" opacity="${.7 * clamp(q * 2, 0, 1)}"/>` + [0, 1, 2].map(k => { const qq = (t * .6 + k / 3) % 1; return `<ellipse cx="960" cy="1030" rx="${100 + qq * 400}" ry="${10 + qq * 20}" fill="none" stroke="#9aa894" stroke-width="3" opacity="${(1 - qq) * .6}"/>`; }).join(''); }
      if (has('hand')) { const q = clamp((lt - .3) / 1.2, 0, 1); const tap = Math.max(0, Math.sin(t * 9)) * 12 * (q >= 1); s += `<g transform="translate(860 ${1004})"><path d="M0 0 Q20 ${-6 + 0} 40 ${30 * q}" stroke="#d6dad8" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M50 0 q20 4 34 ${40 * q - tap}" stroke="#d6dad8" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M90 0 q20 4 30 ${44 * q}" stroke="#d6dad8" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M130 0 q16 4 22 ${36 * q - tap * .6}" stroke="#d6dad8" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M0 0 Q20 ${-6} 40 ${30 * q}" stroke="${INK}" stroke-width="28" fill="none" stroke-linecap="round" opacity=".25"/></g>`; }
      if (has('ajar')) { const q = has('ajaropen') ? ease(clamp(lt / 2, 0, 1)) : 1; const gap = 40 + 160 * q; s += `<rect x="${1360 - gap}" y="80" width="${gap}" height="900" fill="#050607"/>`; if (has('lilyin')) s += `<g opacity="${clamp(q * 1.2, 0, 1)}">${figure({ k: 'lily', x: 1360 - gap / 2, y: 960, s: 1.0, p: 'still', f: 1, e: has('lilyclose') ? 'blank' : 'soft', nosh: 1 }, t, lt, 'fnight')}</g>`; s += `<path d="M560 80 L${1360 - gap} 80 L${1360 - gap} 980 L560 980Z" fill="none" stroke="${INK}" stroke-width="8"/>`; }
    }
    if (E === 'froofdeck' && has('doorknock')) { const k = Math.floor(lt / .7); const ph = (lt % .7); if (k < 3 && ph < .15) s += `<rect x="250" y="440" width="200" height="300" fill="#000" opacity=".12"/>` + [0, 1].map(j => `<path d="M${470 + j * 30} ${560 - j * 20} q20 20 0 40" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/>`).join(''); }
    if (E === 'froofdeck' && has('roofflood')) s += `<rect x="0" y="${has('roofdeep') ? 820 : 960}" width="1920" height="300" fill="#3a5262" opacity=".8"/><path d="M0 ${has('roofdeep') ? 820 : 960} q240 -10 480 0 t480 0 t480 0 t480 0" stroke="#9aa894" stroke-width="4" fill="none"/>`;
    if (E === 'froofdeck' && has('dooropen')) s += `<rect x="250" y="440" width="70" height="300" fill="#050607"/>` + (has('lilyin') ? figure({ k: 'lily', x: 290, y: 740, s: .42, p: 'still', f: 0, e: 'soft', nosh: 1 }, t, lt, 'fnight') : '');
    if (has('lilyroof')) { const r = shot.lilyAt || [1480, 270, .16]; s += figure({ k: 'lily', x: r[0], y: r[1], s: r[2], p: has('lilywave') ? 'reach' : 'still', f: 1, e: 'soft', nosh: 1 }, t, lt, L); if (has('lilywave')) s += `<path d="M${r[0] - 30 * r[2] * 4} ${r[1] - 260 * r[2]} q${Math.sin(t * 8) * 6} -10 0 -20" stroke="${INK}" stroke-width="2" fill="none"/>`; }
    if (has('marcusbldg')) s += figure({ k: 'mar', x: 700, y: 228, s: .1, p: 'still', f: 0, nosh: 1 }, t, lt, L);
    if (has('beam')) { const bx = shot.beam[0], by = shot.beam[1], ang = shot.beam[2]; s += `<path d="M${bx} ${by} L${bx + Math.cos(ang) * 1400 - Math.sin(ang) * 160} ${by + Math.sin(ang) * 1400 + Math.cos(ang) * 160} L${bx + Math.cos(ang) * 1400 + Math.sin(ang) * 160} ${by + Math.sin(ang) * 1400 - Math.cos(ang) * 160}Z" fill="#fff6c8" opacity="${has('beamflash') ? (Math.floor(t * 3) % 2 ? .3 : 0) : .22}"/>`; }
    if (has('jacketwave')) { }
    if (E === 'fmaint' && has('radioon')) s += `<g transform="translate(1570 520)"><rect x="-110" y="-70" width="220" height="130" rx="14" fill="#3a3f46" stroke="${INK}" stroke-width="6"/><rect x="-80" y="-48" width="110" height="40" fill="${has('radiodead') ? '#2a3020' : '#9ab07a'}"/><path d="M60 -70 l30 -80" stroke="${INK}" stroke-width="6"/></g>`;
  }
  if (front) {
    if (has('rain')) s += rainFX(t, has('rainlight') ? 70 : 170, 1, L);
    if (has('lightning')) { const k = Math.floor(t / 3.1), ph = t % 3.1; if (rnd(k) > .35 && ph < .25) s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#e9f0ff" opacity="${ph < .08 ? .55 : .2}"/><path d="M${300 + rnd(k) * 1300} -20 l-40 160 l50 0 l-70 180 l40 0 l-90 200" stroke="#fff" stroke-width="7" fill="none" opacity="${ph < .12 ? 1 : .4}"/>`; }
    if (has('shake')) { }
    if (has('blackout')) s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#000" opacity="${clamp(p * 2.2, 0, 1) * .97}"/>`;
    if (has('powercut')) { const q = lt > .9 ? 1 : 0; s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#000" opacity="${q * .55}"/>`; }
  }
  return base + s;
};
Object.assign(LIGHT, {
  storm: t => `<rect width="1920" height="1080" fill="#1a2430" opacity=".18"/>`,
  fnight: t => `<rect width="1920" height="1080" fill="#02060e" opacity=".2"/>`,
  clear: t => ``,
  pre: t => `<rect width="1920" height="1080" fill="#1a2430" opacity=".12"/>`
});
