// ---------- Desert environments (video 7) ----------
const DPAL = {
  day: { sky: ['#7fb2dc', '#c4dcec', '#f4e2bc'], sand: ['#efc684', '#e3b06a', '#c98d48', '#a8683a'], rock: ['#b5683e', '#8e4a2c', '#6a3420'], sun: '#fff6d8' },
  hot: { sky: ['#a9c4dc', '#e8e0c8', '#fbe8c0'], sand: ['#f4cf90', '#e8b872', '#cf9450', '#ad6e3e'], rock: ['#bd7044', '#965030', '#703a22'], sun: '#ffffff' },
  sunset: { sky: ['#2c2350', '#b0503a', '#f4a24a'], sand: ['#d0844a', '#b86a3a', '#8e4a2c', '#5e2e1e'], rock: ['#7a3a26', '#5a2a1c', '#3e1c14'], sun: '#ffd27a' },
  night: { sky: ['#03050c', '#0c1428', '#1e2a46'], sand: ['#5a5a72', '#4a4a62', '#38384e', '#26263a'], rock: ['#3a3446', '#2c2838', '#1e1a28'], sun: '#dfe6ff' },
  storm: { sky: ['#8a5a32', '#b07a44', '#c8945a'], sand: ['#c99a5e', '#b6864e', '#9a6a3c', '#7a4e2c'], rock: ['#8a5a3a', '#6a4028', '#4a2c1c'], sun: '#f4d8a0' },
  dawn: { sky: ['#4a5a8a', '#d89a7a', '#f6d49a'], sand: ['#e0b07a', '#cc9a62', '#a8743e', '#7e5230'], rock: ['#9a5a3a', '#7a4228', '#5a2e1c'], sun: '#ffe2a8' }
};
const DP = L => DPAL[L] || DPAL.day;
let dg = 0;
function dsky(L, h = 1080, sunX = 1500, sunY = 220) {
  const p = DP(L), id = 'dsk' + (dg++);
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient>
  <radialGradient id="${id}g"><stop offset="0" stop-color="${p.sun}" stop-opacity=".95"/><stop offset=".25" stop-color="${p.sun}" stop-opacity=".45"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient></defs><rect width="1920" height="${h}" fill="url(#${id})"/>`;
  if (L === 'night') { for (let i = 0; i < 160; i++) s += `<circle cx="${rnd(i) * 1920}" cy="${rnd(i + 77) * h * .8}" r="${.8 + rnd(i + 5) * 1.8}" fill="#fff" opacity="${.25 + rnd(i + 9) * .7}"/>`;
    s += `<path d="M0 ${h * .1} Q960 ${h * .55} 1920 ${h * .2}" stroke="#8a9ac8" stroke-width="140" fill="none" opacity=".06"/>` + `<circle cx="${sunX}" cy="${sunY}" r="38" fill="#e9eef8"/><circle cx="${sunX - 12}" cy="${sunY - 8}" r="34" fill="${p.sky[0]}" opacity=".9"/>`; }
  else if (L !== 'storm') s += `<circle cx="${sunX}" cy="${sunY}" r="${L === 'sunset' ? 330 : 420}" fill="url(#${id}g)"/><circle cx="${sunX}" cy="${sunY}" r="${L === 'sunset' ? 70 : 54}" fill="${p.sun}"/>`;
  return s;
}
function dune(y, amp, col, seed, rim) { // a smooth dune band from y down to the bottom
  let d = `M-20 ${y}`; const n = 5;
  for (let i = 0; i < n; i++) { const x0 = -20 + i * 1960 / n, x1 = x0 + 1960 / n; const peak = y - amp * (.4 + rnd(seed + i) * .8); d += ` Q${x0 + 1960 / n * (.35 + rnd(seed + i + 9) * .3)} ${peak} ${x1} ${y + (rnd(seed + i + 3) - .5) * amp * .5}`; }
  d += ` L1940 1100 L-20 1100Z`;
  return `<path d="${d}" fill="${col}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` + (rim ? `<path d="${d.split(' L1940')[0]}" stroke="${rim}" stroke-width="5" fill="none" opacity=".55" transform="translate(0 7)"/>` : '');
}
function ripples(y0, y1, col, seed, n = 40) { let s = ''; for (let i = 0; i < n; i++) { const y = y0 + rnd(seed + i) * (y1 - y0), w = 40 + (y - y0) / (y1 - y0 + 1) * 140, x = rnd(seed + i + 50) * 1920; s += `<path d="M${x} ${y} q${w * .25} -${4 + w * .03} ${w * .5} 0 t${w * .5} 0" stroke="${col}" stroke-width="${2 + (y - y0) / 200}" fill="none" opacity=".55"/>`; } return s; }
function mesa(x, y, w, h, L, seed) { const p = DP(L); const top = y - h;
  let d = `M${x} ${y} L${x + w * .08} ${top + h * .25} L${x + w * .18} ${top + 6} L${x + w * .82} ${top} L${x + w * .9} ${top + h * .3} L${x + w} ${y}Z`;
  let s = `<path d="${d}" fill="${p.rock[0]}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M${x + w * .55} ${top + 4} L${x + w * .82} ${top} L${x + w * .9} ${top + h * .3} L${x + w} ${y} L${x + w * .6} ${y}Z" fill="${p.rock[1]}" opacity=".85"/>`;
  for (let k = 1; k < 4; k++) s += `<path d="M${x + w * (.1 + k * .02)} ${top + h * k / 4} L${x + w * (.92 - k * .01)} ${top + h * k / 4 + (rnd(seed + k) - .5) * 14}" stroke="${p.rock[2]}" stroke-width="4" opacity=".6"/>`;
  return s;
}
function boulder(x, y, r, L, seed = 1) { const p = DP(L);
  let d = `M${x - r} ${y}`; for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; const rr = r * (.8 + rnd(seed + i) * .35); d += ` L${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr * .8}`; } d += 'Z';
  return `<ellipse cx="${x + r * .5}" cy="${y + 6}" rx="${r * 1.4}" ry="${r * .16}" fill="#000" opacity=".22"/><path d="${d}" fill="${p.rock[0]}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${x} ${y - r * .75} Q${x + r * .7} ${y - r * .6} ${x + r} ${y}" fill="${p.rock[1]}" opacity=".7"/><path d="M${x - r * .6} ${y - r * .3} l${r * .3} -${r * .1}" stroke="${p.rock[2]}" stroke-width="4"/>`; }
function shrub(x, y, s) { let g = ''; for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .32; g += `<path d="M${x} ${y} q${Math.cos(a) * 20 * s} ${Math.sin(a) * 30 * s} ${Math.cos(a) * 44 * s} ${Math.sin(a) * 50 * s}" stroke="#6a5a34" stroke-width="${3 * s}" fill="none"/>`; } return g; }
function footprint(x, y, s, ang, col, op = 1) { return `<g transform="translate(${x},${y}) rotate(${ang}) scale(${s})" opacity="${op}"><ellipse cx="0" cy="-8" rx="9" ry="13" fill="${col}"/><ellipse cx="0" cy="12" rx="7" ry="8" fill="${col}"/><path d="M-9 -14 q9 -8 18 0" stroke="#fff3d8" stroke-width="2" fill="none" opacity=".5"/></g>`; }
// a trail of footprints along a quadratic path from (x0,y0) far to (x1,y1) near
function trail(x0, y0, cx, cy, x1, y1, n, sz0, sz1, col, off = 0, appear = 1, op = 1) {
  let s = ''; const m = Math.floor(n * appear);
  for (let i = 0; i < m; i++) { const u = i / (n - 1), a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
    const x = a * x0 + b * cx + c * x1, y = a * y0 + b * cy + c * y1; const dx = 2 * (1 - u) * (cx - x0) + 2 * u * (x1 - cx), dy = 2 * (1 - u) * (cy - y0) + 2 * u * (y1 - cy);
    const ang = Math.atan2(dy, dx) * 180 / Math.PI + 90, sz = sz0 + (sz1 - sz0) * u, side = (i % 2 ? 1 : -1) * 12 * sz;
    const nx = -dy / Math.hypot(dx, dy), ny = dx / Math.hypot(dx, dy);
    s += footprint(x + nx * (side + off * sz), y + ny * (side + off * sz), sz, ang, col, op); }
  return s;
}
function suv(x, y, s, o = {}) { // 4x4 vehicle, side view
  let g = `<g transform="translate(${x},${y}) scale(${o.flip ? -s : s},${s})"><ellipse cx="0" cy="8" rx="300" ry="22" fill="#000" opacity=".25"/>`;
  g += `<path d="M-260 -40 L-250 -120 L-150 -130 L-90 -210 L120 -210 L170 -130 L260 -120 L270 -40Z" fill="${o.col || '#d8d2c2'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  g += `<path d="M-70 -196 L-120 -134 L-10 -134 L-10 -196Z M10 -196 L10 -134 L150 -134 L110 -196Z" fill="#33424e" stroke="${INK}" stroke-width="5"/>`;
  g += `<path d="M-90 -210 L120 -210" stroke="${INK}" stroke-width="6"/><rect x="-80" y="-232" width="190" height="20" rx="4" fill="#4a4a4a" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M-260 -70 H270" stroke="#8a7a5a" stroke-width="10" opacity=".7"/>`;
  for (const wx of [-160, 170]) g += `<circle cx="${wx}" cy="-30" r="56" fill="#1d1d1f" stroke="${INK}" stroke-width="6"/><circle cx="${wx}" cy="-30" r="24" fill="#8a8a8a" stroke="${INK}" stroke-width="4"/>`;
  g += `<rect x="248" y="-118" width="26" height="22" rx="4" fill="${o.lights ? '#fff7c0' : '#e9e2c8'}" stroke="${INK}" stroke-width="4"/>`;
  if (o.hood) g += `<path d="M170 -130 L230 -230 L262 -220 L240 -126Z" fill="${o.col || '#d8d2c2'}" stroke="${INK}" stroke-width="6"/>`;
  return g + '</g>';
}
function shelterHut(x, y, s, L) { const p = DP(L);
  let g = `<g transform="translate(${x},${y}) scale(${s})">` + mesa(-520, 0, 360, 360, L, 3) + mesa(160, 0, 380, 420, L, 7);
  g += `<path d="M-180 0 L-150 -230 L170 -250 L190 0Z" fill="#2a1e16"/>`;
  g += `<path d="M-200 -200 L200 -240 L210 -200 L-190 -160Z" fill="#7a6a4a" stroke="${INK}" stroke-width="6"/>` + `<path d="M-150 -170 V0 M150 -205 V0" stroke="#5a4428" stroke-width="16"/>`;
  g += `<path d="M-120 -165 L20 -180 L60 0 L-120 0Z" fill="#6f7a6a" stroke="${INK}" stroke-width="5" opacity=".92"/>`;
  return g + '</g>';
}
const ENV7 = {};
ENV.dwide = L => { const p = DP(L); let s = dsky(L, 640, 1520, 210);
  s += mesa(80, 560, 420, 150, L, 1) + mesa(1180, 560, 300, 110, L, 4);
  s += dune(560, 40, p.sand[2], 11, null) + dune(640, 70, p.sand[1], 21, p.sand[0]) + dune(780, 90, p.sand[0], 31, '#fff2cc');
  s += ripples(700, 1080, p.sand[2], 3, 50) + boulder(1640, 900, 90, L, 5) + boulder(260, 960, 60, L, 8) + shrub(1500, 940, 1.2) + shrub(520, 870, .8);
  return s; };
ENV.dtrack = L => { const p = DP(L); const id = 'gt' + (dg++);
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sand[1]}"/><stop offset="1" stop-color="${p.sand[0]}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  for (let i = 0; i < 26; i++) { const y = 40 + i * 42; s += `<path d="M-40 ${y} Q480 ${y - 20 + rnd(i) * 30} 960 ${y + 6} T1960 ${y}" stroke="${p.sand[2]}" stroke-width="5" fill="none" opacity=".45"/><path d="M-40 ${y + 6} Q480 ${y - 14 + rnd(i) * 30} 960 ${y + 12} T1960 ${y + 6}" stroke="#fff3d6" stroke-width="3" fill="none" opacity=".35"/>`; }
  for (let i = 0; i < 30; i++) s += `<circle cx="${rnd(i + 3) * 1920}" cy="${rnd(i + 7) * 1080}" r="${3 + rnd(i) * 7}" fill="${p.rock[1]}" stroke="${INK}" stroke-width="2"/>`;
  return s; };
ENV.droad = L => { const p = DP(L); let s = dsky(L, 600, 400, 200);
  s += mesa(1300, 540, 520, 170, L, 2) + dune(540, 30, p.sand[2], 41, null) + dune(600, 40, p.sand[1], 51, p.sand[0]);
  s += `<path d="M-50 1080 L860 600 L960 600 L1970 1080Z" fill="${p.sand[2]}" opacity=".55"/><path d="M200 1080 L890 600 M1700 1080 L930 600" stroke="${p.sand[3]}" stroke-width="10" opacity=".7"/>`;
  s += ripples(640, 1080, p.sand[2], 9, 40) + shrub(260, 760, 1) + shrub(1640, 820, 1.2) + boulder(1780, 980, 70, L, 4);
  return s; };
ENV.drock = L => { const p = DP(L); let s = dsky(L, 620, 300, 160);
  s += dune(600, 40, p.sand[1], 61, null) + dune(720, 50, p.sand[0], 71, '#fff2cc') + ripples(720, 1080, p.sand[2], 13, 40);
  s += `<path d="M1150 880 L1900 980 L1900 1080 L1050 1080Z" fill="${p.sand[3]}" opacity=".45"/>`; // shade
  s += `<path d="M900 900 L960 430 L1180 330 L1460 380 L1600 520 L1700 900Z" fill="${p.rock[0]}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M1300 360 L1460 380 L1600 520 L1700 900 L1320 900Z" fill="${p.rock[1]}"/><path d="M980 560 L1640 600 M960 700 L1680 740" stroke="${p.rock[2]}" stroke-width="5" opacity=".6"/>`;
  s += boulder(500, 960, 70, L, 3) + shrub(300, 900, 1);
  return s; };
ENV.dvalley = L => { const p = DP(L); let s = dsky(L, 760, 960, 140);
  s += mesa(-60, 700, 760, 480, L, 5) + mesa(1240, 700, 760, 520, L, 9);
  s += dune(680, 30, p.sand[1], 81, null) + `<path d="M520 1080 L860 690 L1080 690 L1420 1080Z" fill="${p.sand[0]}" stroke="${INK}" stroke-width="5"/>` + ripples(720, 1080, p.sand[2], 21, 26);
  s += boulder(1060, 760, 110, L, 6) + boulder(300, 1000, 80, L, 2);
  return s; };
ENV.dridge = L => { const p = DP(L); let s = dsky(L, 560, 1650, 170);
  s += dune(500, 20, p.sand[3], 91, null) + dune(540, 30, p.sand[2], 95, null);
  s += `<g opacity=".85"><rect x="880" y="470" width="70" height="34" fill="#2a2420"/><rect x="900" y="452" width="30" height="20" fill="#2a2420"/></g>`; // the dark structure
  s += `<path d="M-20 820 Q500 640 960 700 Q1400 760 1940 650 L1940 1100 L-20 1100Z" fill="${p.sand[0]}" stroke="${INK}" stroke-width="6"/>` + ripples(760, 1080, p.sand[2], 31, 30) + boulder(1500, 900, 80, L, 7);
  return s; };
ENV.dcloth = L => { const p = DP(L); let s = dsky(L, 620, 1500, 180) + dune(600, 40, p.sand[1], 101, null) + dune(700, 50, p.sand[0], 111, '#fff2cc') + ripples(720, 1080, p.sand[2], 41, 30);
  s += boulder(900, 960, 190, L, 9) + `<path d="M820 820 L1000 800" stroke="#6a5a3a" stroke-width="10"/>`;
  return s; };
ENV.dshelter = L => { const p = DP(L); let s = dsky(L, 640, 1600, 200) + dune(620, 30, p.sand[2], 121, null);
  s += `<path d="M1180 640 L1420 330 L1700 300 L1940 420 L1940 640Z" fill="${p.rock[1]}" stroke="${INK}" stroke-width="6"/>`; // ridge
  s += dune(700, 30, p.sand[1], 131, p.sand[0]) + shelterHut(820, 860, 1.0, L) + `<rect x="0" y="860" width="1920" height="220" fill="${p.sand[0]}"/>` + P('M0 860 H1920', 'none', 5) + ripples(880, 1080, p.sand[2], 51, 26);
  return s; };
ENV.dshin = L => { const p = DP(L); let s = `<rect width="1920" height="1080" fill="#2a1e16"/>`;
  s += `<path d="M0 0 L1920 0 L1920 220 L0 300Z" fill="#7a6a4a" stroke="${INK}" stroke-width="7"/>` + `<path d="M260 300 V1080 M1660 230 V1080" stroke="#5a4428" stroke-width="40"/>`;
  s += `<path d="M1700 260 L1920 230 L1920 1080 L1700 1080Z" fill="${p.sand[1]}" opacity=".85"/>`; // opening with daylight
  s += `<rect y="860" width="1920" height="220" fill="${p.sand[2]}"/>` + P('M0 860 H1920', 'none', 6) + ripples(880, 1080, p.sand[3], 61, 20);
  // empty container, old backpack, note
  s += `<path d="M420 860 L420 700 Q420 670 450 670 L560 670 Q590 670 590 700 L590 860Z" fill="#c9d6dc" stroke="${INK}" stroke-width="6" opacity=".9"/><rect x="470" y="640" width="70" height="34" rx="6" fill="#3a6a9a" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M900 860 L880 700 Q900 650 980 650 Q1060 650 1080 700 L1060 860Z" fill="#6a5a3a" stroke="${INK}" stroke-width="6"/><path d="M910 740 h150" stroke="#4a3e28" stroke-width="8"/><rect x="940" y="760" width="80" height="50" rx="6" fill="#5a4c30" stroke="${INK}" stroke-width="4"/>`;
  s += `<g transform="rotate(-6 1300 840)"><rect x="1220" y="810" width="170" height="60" fill="#efe6cf" stroke="${INK}" stroke-width="4"/>${[0, 1, 2].map(k => `<path d="M1236 ${826 + k * 14} q20 -5 40 0 t40 0 t40 0" stroke="#4a3a5a" stroke-width="3" fill="none"/>`).join('')}</g>`;
  return s; };
ENV.ddamp = L => { const p = DP(L); let s = dsky(L, 560, 300, 170) + dune(540, 40, p.sand[1], 141, null) + `<rect y="600" width="1920" height="480" fill="${p.sand[0]}"/>` + P('M0 600 H1920', 'none', 5);
  s += `<ellipse cx="960" cy="840" rx="560" ry="150" fill="${p.sand[2]}" stroke="${INK}" stroke-width="5"/><ellipse cx="960" cy="860" rx="380" ry="90" fill="${p.sand[3]}" opacity=".7"/><ellipse cx="980" cy="870" rx="200" ry="40" fill="#5a4630" opacity=".7"/>`;
  s += shrub(700, 800, 1.3) + shrub(1240, 820, 1.1) + `<path d="M1180 820 q10 -50 30 -70 M1196 820 q-6 -40 -26 -60" stroke="#7a8a3a" stroke-width="6" fill="none"/>` + ripples(620, 1080, p.sand[2], 71, 20);
  return s; };
ENV.dsky = L => { const p = DP(L); return dsky(L, 760, 960, 260) + dune(700, 20, p.sand[2], 151, null) + dune(760, 30, p.sand[0], 161, '#fff2cc') + ripples(800, 1080, p.sand[2], 81, 30); };
