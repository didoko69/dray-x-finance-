// ---------- Supermarket environments (video 2) ----------
Object.assign(SKY, { lit: SKY.night, nightlit: SKY.night, black: SKY.dark, afternoon: ['#7fa6c9', '#c9cfc0', '#efd9a8'], memory: SKY.night, dawnbroken: SKY.dawn, cctv: SKY.night, flicker: SKY.night });
const TEAL = '#2f4a4c', TEAL2 = '#3b5a5b', BEIGE = '#c9bea6', BEIGE2 = '#b5aa92', GREY = '#7d8588';
const PROD = ['#a8553c', '#5f7f5a', '#c9a24a', '#4f6f86', '#b98a5a', '#8a6a8a', '#d6cdb5', '#6a8f8a'];
function prodRow(x, y, w, h, seed, kind = 'mix') {
  let s = '', cx = x;
  for (let i = 0; cx < x + w - 10; i++) {
    const r = rnd(seed + i), pw = kind === 'can' ? 26 : 22 + r * 26, ph = kind === 'can' ? h * .8 : h * (.55 + rnd(seed + i + 9) * .4), col = PROD[Math.floor(rnd(seed * 3 + i) * 8)];
    if (rnd(seed + i * 7) < .08) { cx += pw + 4; continue; } // gaps (looted)
    s += kind === 'can' ? `<rect x="${cx}" y="${y + h - ph}" width="${pw}" height="${ph}" rx="4" fill="${col}" stroke="${INK}" stroke-width="2.5"/><rect x="${cx}" y="${y + h - ph * .65}" width="${pw}" height="${ph * .3}" fill="#e8e0cc" opacity=".8"/>`
      : `<rect x="${cx}" y="${y + h - ph}" width="${pw}" height="${ph}" fill="${col}" stroke="${INK}" stroke-width="2.5"/><rect x="${cx + 3}" y="${y + h - ph + 6}" width="${pw - 6}" height="${ph * .25}" fill="#efe7d4" opacity=".6"/>`;
    cx += pw + 3;
  }
  return s;
}
function shelfUnit(x, y, w, h, rows, seed, kind) {
  let s = R(x, y, w, h, GREY, 6);
  for (let r = 0; r < rows; r++) { const ry = y + 14 + r * (h - 20) / rows, rh = (h - 20) / rows - 14; s += `<rect x="${x + 8}" y="${ry}" width="${w - 16}" height="${rh}" fill="#3a3f42"/>` + prodRow(x + 12, ry, w - 24, rh, seed + r * 17, kind) + `<rect x="${x + 4}" y="${ry + rh}" width="${w - 8}" height="10" fill="#9aa1a4" stroke="${INK}" stroke-width="3"/>`; }
  return s;
}
function storeFloor(y0) { return tiles(y0, 1080, BEIGE, BEIGE2); }
function cartSVG(x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${P('M-70 -80 L80 -80 L60 -10 L-50 -10Z', 'none', 7)}${Array.from({ length: 6 }, (_, i) => `<path d="M${-60 + i * 25} -80 L${-46 + i * 20} -10" stroke="${INK}" stroke-width="3"/>`).join('')}${P('M80 -80 L100 -110 L120 -110', 'none', 7)}${C(-40, 6, 10, '#333', 4)}${C(50, 6, 10, '#333', 4)}<path d="M-50 -10 L-40 0 M60 -10 L50 0" stroke="${INK}" stroke-width="5"/></g>`;
}
function signBoard(x, y, w, h, txt, bg = '#3d6b4f', fg = '#f1ece2', fs = 40) { return R(x, y, w, h, bg, 6, 'rx="8"') + T(x + w / 2, y + h / 2 + fs * .36, fs, txt, fg); }

ENV.front = (L) => {
  let s = `<rect width="1920" height="1080" fill="${TEAL}"/>` + `<rect width="1920" height="140" fill="#24393b"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${120 + i * 300}" y="60" width="200" height="16" rx="8" fill="#e9efe6"/>`;
  s += windowOutside(600, 300, 720, 490, L === 'day' ? 'day' : 'night', { city: .75 });
  s += `<rect x="600" y="640" width="720" height="150" fill="${L === 'day' ? '#6b6f74' : '#1f2328'}"/>`;
  s += `<path d="M600 300 h720 v490 h-720z M960 300 v490 M780 300 v490 M1140 300 v490" stroke="#1e2a2b" stroke-width="16" fill="none"/>`;
  s += R(580, 250, 760, 50, '#4a5658', 6) + signBoard(700, 160, 520, 70, 'GREENLEAF MARKET', '#3d6b4f', '#f1ece2', 42);
  s += storeFloor(790) + `<rect y="782" width="1920" height="14" fill="#24393b"/>`;
  // checkouts both sides
  for (const [x, f] of [[120, 1], [1500, -1]]) {
    s += R(x, 640, 320, 150, '#d6cdb5', 6) + R(x + 10, 610, 300, 34, '#3a3f42', 5) + R(x + (f > 0 ? 220 : 20), 540, 80, 70, '#4a4f56', 5, 'rx="6"') + `<rect x="${x + (f > 0 ? 230 : 30)}" y="550" width="60" height="34" fill="#9fc3b0"/>`;
    s += signBoard(x + 110, 440, 100, 60, f > 0 ? '1' : '4', '#c9a24a', '#222', 34);
  }
  s += shelfUnit(-20, 380, 120, 400, 4, 3) + shelfUnit(1820, 380, 120, 400, 4, 9);
  return s;
};
ENV.entrance = (L) => {
  const day = !isNight(L);
  let s = windowOutside(0, 0, 1920, 1080, L === 'nightlit' ? 'night' : L, { city: .42 });
  s += `<rect x="0" y="540" width="1920" height="540" fill="${day ? '#6d7177' : '#1e2329'}"/>`;
  for (let i = 0; i < 10; i++) s += `<path d="M${i * 210 + 40} 580 L${i * 210 - 60} 720" stroke="${day ? '#d6d6d6' : '#4a505c'}" stroke-width="6"/>`;
  for (const [x, y, c] of [[150, 600, '#8c3b32'], [1450, 595, '#4f6f86']]) s += P(`M${x} ${y} q10 -40 60 -44 h80 q40 4 60 44 h20 v30 h-240z`, c, 5) + C(x + 40, y + 30, 16, '#222', 5) + C(x + 190, y + 30, 16, '#222', 5);
  s += cartSVG(700, 640, .7, 0);
  for (const x of [420, 1280]) s += P(`M${x} 590 V330 h40`, 'none', 7) + `<ellipse cx="${x + 46}" cy="334" rx="16" ry="7" fill="${day ? '#ddd' : '#ffd27a'}"/>`;
  if (L === 'nightlit') s += `<rect width="1920" height="1080" fill="#e8f4ff" opacity=".06"/>`;
  return s;
};
ENV.entrancefront = (L) => {
  let s = '';
  for (const x of [0, 480, 960, 1440, 1920]) s += `<path d="M${x} 0 V1080" stroke="#1e2a2b" stroke-width="30"/>`;
  s += `<rect x="0" y="0" width="1920" height="60" fill="#24393b" stroke="${INK}" stroke-width="6"/><rect x="0" y="900" width="1920" height="180" fill="#3a4547" stroke="${INK}" stroke-width="6"/>`;
  for (const x of [240, 720, 1200, 1680]) s += `<rect x="${x - 120}" y="560" width="240" height="20" rx="10" fill="#9aa1a4" stroke="${INK}" stroke-width="4"/>`;
  s += `<path d="M120 0 L-120 900 M560 0 L360 900 M1100 0 L900 900 M1560 0 L1380 900" stroke="#cfe0ff" stroke-width="40" opacity=".05"/>`;
  s += R(820, 200, 280, 110, '#f1ece2', 4, 'opacity=".85"') + T(960, 245, 26, 'OPEN DAILY', '#2f4a4c') + T(960, 285, 22, '7AM – 11PM', '#2f4a4c', 700);
  return s;
};
ENV.aisle = (L) => {
  const vx = 960, vy = 460;
  let s = `<rect width="1920" height="1080" fill="#22302f"/>`;
  s += `<path d="M0 1080 L${vx - 120} ${vy + 120} H${vx + 120} L1920 1080Z" fill="${BEIGE}"/>`;
  for (let k = 0; k < 14; k++) { const z = k * .5, sc = 1 / (1 + z); const y = vy + (1080 - vy) * sc; s += `<path d="M${vx - (vx + 100) * sc} ${y} H${vx + (vx + 100) * sc}" stroke="${BEIGE2}" stroke-width="${2 + 4 * sc}"/>`; }
  s += `<path d="M${vx} ${vy + 120} L${vx} 1080" stroke="${BEIGE2}" stroke-width="3" opacity=".6"/>`;
  // end wall
  const se = 1 / (1 + 6.5);
  s += `<rect x="${vx - (vx + 100) * se}" y="${vy + (60 - vy) * se}" width="${2 * (vx + 100) * se}" height="${(1080 - 60) * se}" fill="${TEAL2}"/>` + T(vx, vy - 40, 26, 'BAKERY', '#e9dfc6', 800);
  for (const side of [-1, 1]) {
    const xn = side < 0 ? -100 : 2020;
    for (let k = 0; k < 13; k++) { const z1 = k * .5, z2 = z1 + .5, s1 = 1 / (1 + z1), s2 = 1 / (1 + z2);
      const X1 = vx + (xn - vx) * s1, X2 = vx + (xn - vx) * s2;
      const top1 = vy + (60 - vy) * s1, top2 = vy + (60 - vy) * s2, bot1 = vy + (1000 - vy) * s1, bot2 = vy + (1000 - vy) * s2;
      s += `<path d="M${X1} ${top1} L${X2} ${top2} L${X2} ${bot2} L${X1} ${bot1}Z" fill="${GREY}" stroke="${INK}" stroke-width="${1 + 3 * s1}"/>`;
      for (let r = 0; r < 5; r++) { const f1 = .06 + r * .185, f2 = f1 + .15;
        const a1 = top1 + (bot1 - top1) * f1, a2 = top2 + (bot2 - top2) * f1, b1 = top1 + (bot1 - top1) * f2, b2 = top2 + (bot2 - top2) * f2;
        s += `<path d="M${X1} ${a1} L${X2} ${a2} L${X2} ${b2} L${X1} ${b1}Z" fill="#33393b"/>`;
        const nprod = 3; for (let q = 0; q < nprod; q++) { if (rnd(k * 31 + r * 7 + q + (side > 0 ? 500 : 0)) < .12) continue; const u1 = q / nprod + .03, u2 = (q + 1) / nprod - .03;
          const px1 = X1 + (X2 - X1) * u1, px2 = X1 + (X2 - X1) * u2; const hh = .25 + rnd(k + r + q) * .6;
          const ya1 = b1 + (a1 - b1) * hh * (1 - u1) + (b2 + (a2 - b2) * hh - (b1 + (a1 - b1) * hh)) * u1, yb1 = b1 + (b2 - b1) * u1, ya2 = b1 + (a1 - b1) * hh * (1 - u2) + (b2 + (a2 - b2) * hh - (b1 + (a1 - b1) * hh)) * u2, yb2 = b1 + (b2 - b1) * u2;
          s += `<path d="M${px1} ${ya1} L${px2} ${ya2} L${px2} ${yb2} L${px1} ${yb1}Z" fill="${PROD[Math.floor(rnd(k * 13 + r * 5 + q * 3 + side) * 8)]}" stroke="${INK}" stroke-width="${.6 + 1.5 * s1}"/>`; }
        s += `<path d="M${X1} ${b1} L${X2} ${b2}" stroke="#9aa1a4" stroke-width="${2 + 7 * s1}"/>`; } } }
  // ceiling light strips
  for (let k = 0; k < 8; k++) { const sc = 1 / (1 + k * .8); s += `<rect x="${vx - 160 * sc}" y="${vy + (40 - vy) * sc}" width="${320 * sc}" height="${12 * sc + 3}" rx="4" fill="#e9efe6"/>`; }
  // hanging aisle sign
  s += `<path d="M860 0 V40 M1060 0 V40" stroke="${INK}" stroke-width="5"/>` + signBoard(780, 40, 360, 70, 'AISLE 4 · CANNED FOOD', '#3d6b4f', '#f1ece2', 28);
  return s;
};
ENV.storage = (L) => {
  let s = `<rect width="1920" height="1080" fill="#4b5859"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M0 ${80 + i * 52} H1920" stroke="#445152" stroke-width="3"/>`).join('');
  s += `<rect y="820" width="1920" height="260" fill="#6d6a62"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += R(150, 280, 250, 540, '#6b7476', 8) + `<rect x="190" y="320" width="170" height="70" fill="#e9dfc6"/>` + T(275, 365, 26, 'STORAGE', '#2f4a4c') + C(370, 560, 9, '#c9a24a', 4);
  // metal shelving with boxes and water packs
  for (const x0 of [1000, 1440]) { s += P(`M${x0} 820 V260 M${x0 + 400} 820 V260`, 'none', 10);
    for (let r = 0; r < 4; r++) { const y = 330 + r * 130; s += `<path d="M${x0} ${y} h400" stroke="${INK}" stroke-width="8"/>`;
      for (let c = 0; c < 4; c++) s += (r + c + x0) % 3 === 0 ? `<g>${Array.from({ length: 6 }, (_, k) => `<rect x="${x0 + 14 + c * 96 + k * 13}" y="${y - 58}" width="11" height="54" rx="4" fill="#69b3ee" stroke="${INK}" stroke-width="2"/>`).join('')}</g>` : R(x0 + 14 + c * 96, y - 70, 84, 66, ['#b08a5a', '#c49a62', '#9a7a4a'][(r + c) % 3], 4) + `<path d="M${x0 + 14 + c * 96} ${y - 50} h84" stroke="#7a5a32" stroke-width="3"/>`; } }
  s += R(520, 700, 360, 120, '#b08a5a', 6) + `<path d="M520 740 h360" stroke="#7a5a32" stroke-width="4"/>` + T(700, 780, 24, 'FRAGILE', '#7a3a22', 800);
  s += `<rect x="0" y="0" width="1920" height="70" fill="#3a4546"/><rect x="860" y="30" width="200" height="16" rx="8" fill="#e9efe6"/>`;
  return s;
};
ENV.office = (L) => {
  let s = `<rect width="1920" height="1080" fill="#5c6b62"/><rect y="820" width="1920" height="260" fill="#5a4f45"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="8"/>`;
  // floor plan poster
  s += R(500, 230, 420, 300, '#f1ece2', 6) + T(710, 270, 24, 'FLOOR PLAN', '#2f4a4c');
  s += `<rect x="530" y="290" width="360" height="210" fill="none" stroke="#2f4a4c" stroke-width="4"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="${600 + i * 50}" y="340" width="20" height="110" fill="#9aa1a4"/>`).join('') + `<path d="M700 500 v-14 M540 420 h-14 M840 290 v-14" stroke="#c33a2f" stroke-width="10"/>`;
  // window with blinds
  s += R(1000, 200, 300, 260, '#1c2630', 6) + Array.from({ length: 12 }, (_, i) => `<path d="M1006 ${214 + i * 20} h288" stroke="#8a9493" stroke-width="7"/>`).join('');
  // desk
  s += R(560, 640, 520, 30, '#7a5236', 6) + R(580, 670, 200, 150, '#6a4a30', 6) + `<path d="M600 710 h160 M600 760 h160" stroke="${INK}" stroke-width="4"/><circle cx="680" cy="700" r="5" fill="#c9a24a"/><circle cx="680" cy="750" r="5" fill="#c9a24a"/>` + P('M1060 670 v150', 'none', 9);
  s += R(820, 520, 160, 110, '#2c2f36', 6, 'rx="6"') + `<rect x="835" y="533" width="130" height="82" fill="#1a2028"/>` + P('M900 630 v14 M870 644 h60', 'none', 6);
  // narrow door (hidden) + cabinet drawn in fx
  s += R(1400, 380, 150, 440, '#3a4546', 6) + `<rect x="1416" y="400" width="118" height="400" fill="#2a3233"/>`;
  return s;
};
ENV.secroom = (L) => {
  let s = `<rect width="1920" height="1080" fill="#2a3436"/><rect y="840" width="1920" height="240" fill="#3a3a3e"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += R(560 + c * 210, 150 + r * 120, 190, 105, '#14181c', 6, 'rx="6"') + `<rect x="${572 + c * 210}" y="${162 + r * 120}" width="166" height="81" fill="#0b0e11"/>`;
  s += R(160, 280, 260, 300, '#56605f', 6) + T(290, 320, 22, 'EMERGENCY LIGHTING', '#e9dfc6', 800);
  for (let i = 0; i < 8; i++) s += R(190 + (i % 4) * 56, 360 + Math.floor(i / 4) * 90, 40, 64, '#2a2f33', 4, 'rx="4"') + `<rect x="${200 + (i % 4) * 56}" y="${370 + Math.floor(i / 4) * 90}" width="20" height="26" fill="#9aa1a4"/>`;
  s += P('M300 560 L1700 560 L1760 700 L240 700Z', '#4a5455', 7) + R(240, 700, 1520, 140, '#3a4344', 7);
  for (let i = 0; i < 18; i++) s += `<circle cx="${420 + i * 38}" cy="${620 + (i % 2) * 30}" r="8" fill="${['#4fe07a', '#c9a24a', '#5a6a6a'][i % 3]}"/>`;
  s += R(1220, 580, 180, 100, '#d6cdb5', 6, 'rx="10"') + C(1310, 625, 30, '#c33a2f', 6) + T(1310, 702, 22, 'MANUAL OVERRIDE', '#f1ece2', 900);
  s += R(1440, 590, 200, 70, '#14181c', 5) + `<rect x="1450" y="600" width="180" height="50" fill="#2a0a0a"/>`;
  return s;
};
ENV.cctv = (L) => {
  let s = `<rect width="1920" height="1080" fill="#26302c"/>`;
  s += `<rect x="0" y="0" width="1920" height="230" fill="#1a201d"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M0 ${300 + i * 70} H1920" stroke="#33403a" stroke-width="3"/><path d="M${i * 170} 230 V1080" stroke="#33403a" stroke-width="3"/>`;
  s += `<rect x="400" y="215" width="1120" height="30" fill="#5a6a64"/>` + Array.from({ length: 5 }, (_, i) => `<path d="M${400 + i * 280} 215 v30" stroke="#1a201d" stroke-width="10"/>`).join('');
  s += R(930, 245, 60, 30, '#8a9a94', 4);
  s += `<rect x="150" y="760" width="300" height="150" fill="#3f4a45" stroke="#1a201d" stroke-width="5"/><rect x="1470" y="760" width="300" height="150" fill="#3f4a45" stroke="#1a201d" stroke-width="5"/>`;
  return s;
};
ENV.loading = (L) => {
  let s = `<rect width="1920" height="1080" fill="#4a5050"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M0 ${70 + i * 80} H1920" stroke="#434949" stroke-width="3"/>`).join('');
  s += `<rect y="840" width="1920" height="240" fill="#5d5a54"/><path d="M0 840 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += R(500, 210, 920, 630, '#2a2e30', 8) + R(470, 180, 980, 40, '#3a4042', 6);
  for (const x of [470, 1420]) s += R(x, 600, 30, 240, '#d8b52a', 5) + Array.from({ length: 4 }, (_, i) => `<path d="M${x} ${620 + i * 60} l30 30" stroke="#222" stroke-width="10"/>`).join('');
  s += `<path d="M560 1080 L640 840 M1360 1080 L1280 840" stroke="#d8b52a" stroke-width="10" stroke-dasharray="40 30"/>`;
  s += R(80, 700, 260, 140, '#9a7a4a', 6) + R(110, 620, 200, 80, '#b08a5a', 5) + T(960, 160, 38, 'LOADING BAY · EXIT', '#d8b52a');
  s += R(1470, 420, 170, 170, '#56605f', 6, 'rx="8"') + `<rect x="1490" y="440" width="130" height="70" fill="#0d1210"/>` + Array.from({ length: 6 }, (_, i) => C(1500 + (i % 3) * 50, 540 + Math.floor(i / 3) * 26, 8, '#3a3f42', 3)).join('');
  return s;
};
ENV.staffdoor = (L) => {
  let s = `<rect width="1920" height="1080" fill="${TEAL}"/>` + storeFloor(820) + `<rect y="812" width="1920" height="14" fill="#24393b"/>`;
  s += R(800, 260, 320, 560, '#6b7476', 8) + `<rect x="830" y="290" width="260" height="500" fill="#5f686a"/>` + R(860, 330, 200, 70, '#c33a2f', 5) + T(960, 377, 32, 'STAFF ONLY', '#fff');
  s += R(1060, 520, 30, 70, '#9aa1a4', 4, 'rx="6"');
  s += signBoard(1300, 300, 300, 70, 'LOADING  →', '#d8b52a', '#222', 32);
  s += shelfUnit(40, 360, 600, 450, 4, 21) + shelfUnit(1480, 420, 440, 390, 3, 33);
  return s;
};
ENV.electronics = (L) => {
  let s = `<rect width="1920" height="1080" fill="${TEAL}"/>` + storeFloor(820) + signBoard(700, 90, 520, 70, 'ELECTRONICS', '#4f6f86', '#f1ece2', 40);
  for (let i = 0; i < 4; i++) s += R(180 + i * 400, 220, 340, 200, '#14181c', 7, 'rx="6"') + `<rect x="${195 + i * 400}" y="235" width="310" height="170" fill="#1d2630"/>`;
  s += shelfUnit(120, 470, 1680, 350, 3, 41);
  return s;
};
ENV.pharmacy = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3d5b55"/>` + storeFloor(820);
  s += R(760, 90, 400, 80, '#f1ece2', 6) + T(1000, 147, 44, 'PHARMACY', '#2f6a4a') + `<path d="M800 110 h40 v-0 M820 100 v40 M800 120 h40" stroke="#3a9a5a" stroke-width="14"/>`;
  s += shelfUnit(140, 220, 1640, 360, 4, 51) + R(300, 620, 1320, 200, '#d6cdb5', 7) + R(300, 600, 1320, 30, '#b5aa92', 6);
  return s;
};
ENV.bakery = (L) => {
  let s = `<rect width="1920" height="1080" fill="#5a5444"/>` + storeFloor(820) + windowOutside(1300, 140, 520, 300, 'afternoon', { city: .8 }) + `<path d="M1300 140 h520 v300 h-520z M1560 140 v300" stroke="#2a2a26" stroke-width="14" fill="none"/>`;
  s += signBoard(200, 100, 460, 80, 'BAKERY', '#a8553c', '#f1ece2', 48);
  s += R(140, 520, 1040, 300, '#c9b99c', 7) + R(160, 420, 1000, 110, '#e8eef0', 6, 'opacity=".55"');
  for (let i = 0; i < 9; i++) s += `<ellipse cx="${220 + i * 105}" cy="500" rx="40" ry="18" fill="#c48a4a" stroke="${INK}" stroke-width="3"/><path d="M${200 + i * 105} 494 l12 -6 M${218 + i * 105} 494 l12 -6" stroke="#8a5a2a" stroke-width="3"/>`;
  s += R(1250, 600, 120, 220, '#7a5236', 6);
  return s;
};
ENV.restroom = (L) => {
  let s = `<rect width="1920" height="1080" fill="#4a5a5a"/>` + storeFloor(820);
  s += R(140, 300, 220, 520, '#6b7476', 7) + R(1560, 300, 220, 520, '#6b7476', 7) + C(250, 250, 34, '#f1ece2', 5) + C(1670, 250, 34, '#f1ece2', 5);
  s += `<path d="M250 236 v28 M240 246 h20" stroke="#4f6f86" stroke-width="7"/><path d="M1670 236 l-10 28 h20z" fill="#a8553c"/>`;
  s += R(700, 330, 520, 490, '#7d8588', 8) + Array.from({ length: 11 }, (_, i) => `<path d="M700 ${370 + i * 42} h520" stroke="#5f686a" stroke-width="6"/>`).join('') + R(700, 790, 520, 30, '#d8b52a', 5);
  s += R(860, 230, 200, 70, '#2f8a4a', 6) + T(960, 278, 36, 'EXIT', '#fff') + T(960, 870, 26, 'EMERGENCY EXIT', '#c33a2f', 900);
  return s;
};
ENV.exterior = (L) => {
  const [id, gd] = skyGrad(L);
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  if (isNight(L)) for (let i = 0; i < 80; i++) s += `<circle cx="${rnd(i) * 1920}" cy="${rnd(i + 99) * 400}" r="${1 + rnd(i + 5) * 2}" fill="#fff" opacity="${.4 + rnd(i + 7) * .6}"/>`;
  s += skyline(0, 1000, 600, 60, 220, 81, isNight(L) ? 1 : 0, .7);
  s += R(1000, 260, 940, 620, '#5f6566', 8) + `<rect x="1000" y="260" width="940" height="40" fill="#3d6b4f"/>`;
  for (let i = 0; i < 5; i++) s += R(1060 + i * 170, 340, 120, 70, '#1c2228', 5);
  s += R(1250, 520, 460, 360, '#2a2e30', 7) + R(1250, 520, 460, 240, '#7d8588', 6) + Array.from({ length: 6 }, (_, i) => `<path d="M1250 ${550 + i * 36} h460" stroke="#5f686a" stroke-width="5"/>`).join('');
  s += `<rect y="880" width="1920" height="200" fill="${isNight(L) ? '#2a2c2e' : '#7a7468'}"/><path d="M0 880 H1920" stroke="${INK}" stroke-width="6"/>`;
  s += `<path d="M100 1000 L700 1000" stroke="#d8b52a" stroke-width="8" stroke-dasharray="50 40"/>`;
  // delivery truck
  s += R(280, 560, 420, 300, '#d6cdb5', 7, 'rx="8"') + T(490, 700, 34, 'FRESH', '#3d6b4f') + T(490, 745, 26, 'DELIVERY', '#3d6b4f', 700);
  s += P('M700 640 h140 l60 90 v130 h-200z', '#d6cdb5', 7) + P('M720 660 h110 l40 60 h-150z', '#2a3440', 5) + C(380, 870, 40, '#222', 7) + C(800, 870, 40, '#222', 7);
  return s;
};
ENV.loadout = (L) => {
  let s = `<rect width="1920" height="1080" fill="#2a2c2e"/>` + R(-10, -10, 1940, 830, '#7d8588', 8) + Array.from({ length: 18 }, (_, i) => `<path d="M0 ${30 + i * 44} h1920" stroke="#5f686a" stroke-width="6"/>`).join('');
  s += R(-10, 800, 1940, 30, '#d8b52a', 6) + `<rect x="0" y="830" width="1920" height="70" fill="#0a0b0c"/><rect y="900" width="1920" height="180" fill="#3a3c3e"/>`;
  return s;
};
ENV.sky = (L) => {
  let s = `<linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1024"/><stop offset="1" stop-color="#2a3a5a"/></linearGradient><rect width="1920" height="1080" fill="url(#nsky)"/>`;
  for (let i = 0; i < 260; i++) s += `<circle cx="${rnd(i + 3) * 1920}" cy="${rnd(i + 401) * 800}" r="${.8 + rnd(i + 9) * 2.4}" fill="#fff" opacity="${.3 + rnd(i + 17) * .7}"/>`;
  s += `<circle cx="1450" cy="260" r="70" fill="#f2efe0"/><circle cx="1480" cy="245" r="62" fill="#0e1530"/>`;
  s += skyline(0, 1920, 1080, 80, 260, 91, 1, .9);
  return s;
};
ENV.parking = (L) => {
  const L2 = L === 'dawnbroken' ? 'dawn' : (L === 'nightlit' ? 'night' : L);
  const [id, gd] = skyGrad(L2);
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>` + skyline(0, 1920, 380, 40, 160, 71, isNight(L2) ? 1 : 0, .6);
  s += R(260, 260, 1400, 480, '#8a8f88', 8) + `<rect x="260" y="260" width="1400" height="70" fill="#3d6b4f"/>` + T(960, 312, 48, 'GREENLEAF MARKET', '#f1ece2');
  const lit = L === 'nightlit';
  s += R(700, 420, 520, 320, lit ? '#f4f7e8' : (L === 'dawnbroken' ? '#1c2228' : '#2a3440'), 7);
  s += `<path d="M700 420 h520 v320 h-520z M960 420 v320 M830 420 v320 M1090 420 v320" stroke="#2a2e30" stroke-width="10" fill="none"/>`;
  for (const x of [340, 1300]) s += R(x, 420, 280, 200, lit ? '#e8f0d8' : '#2a3440', 6);
  if (L === 'dawnbroken') {
    s += P('M720 520 l60 40 l-30 50 l70 30 M1000 460 l40 60 l-50 40 l30 60 M1120 600 l50 -40 l30 70', 'none', 4, 'stroke="#cfe0ff"');
    s += `<g transform="rotate(-6 960 420)">${R(690, 400, 540, 70, '#7d8588', 6)}${Array.from({ length: 2 }, (_, i) => `<path d="M690 ${420 + i * 25} h540" stroke="#5f686a" stroke-width="5"/>`).join('')}</g>`;
  }
  s += `<rect y="740" width="1920" height="340" fill="${isNight(L2) ? '#20242a' : '#6d7177'}"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M${i * 170 + 40} 780 L${i * 170 - 60} 960" stroke="${isNight(L2) ? '#4a505c' : '#d6d6d6'}" stroke-width="6"/>`;
  s += cartSVG(1500, 900, .8, L === 'dawnbroken' ? 70 : 0) + cartSVG(300, 880, .7, 0);
  for (const x of [180, 1720]) s += P(`M${x} 900 V520 h40`, 'none', 8) + `<ellipse cx="${x + 46}" cy="524" rx="16" ry="7" fill="${isNight(L2) ? '#ffd27a' : '#ddd'}"/>`;
  if (lit) s += `<ellipse cx="960" cy="800" rx="700" ry="200" fill="#f4f7e8" opacity=".12"/>`;
  return s;
};
ENV.street = (L) => {
  const [id, gd] = skyGrad('day');
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  [[0, 160, 300, '#a89a86'], [300, 260, 260, '#8f8a7a'], [560, 120, 300, '#b5a88f'], [1100, 200, 280, '#98a4a8'], [1380, 140, 320, '#a8988a'], [1700, 240, 240, '#8a9a8a']].forEach(([x, y, w, c]) => { s += R(x, y, w, 680 - y, c, 6); for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) if (y + 40 + r * 80 < 620) s += R(x + 30 + k * (w - 60) / 3, y + 40 + r * 80, (w - 120) / 3, 50, '#4f6f86', 3); });
  s += `<rect y="680" width="1920" height="120" fill="#9a968c"/><rect y="800" width="1920" height="280" fill="#55585e"/><path d="M0 940 H1920" stroke="#e9e6dc" stroke-width="8" stroke-dasharray="80 60"/>`;
  // barrier + abandoned ambulance
  s += R(1240, 760, 360, 40, '#e9e6dc', 5) + Array.from({ length: 6 }, (_, i) => `<rect x="${1250 + i * 60}" y="762" width="30" height="36" fill="#c33a2f"/>`).join('') + P('M1270 800 v40 M1570 800 v40', 'none', 7);
  s += `<g transform="translate(1360,720) rotate(-6)">${R(-200, -160, 300, 170, '#f1ece2', 7, 'rx="10"')}${P('M100 -110 h80 l40 60 v60 h-120z', '#f1ece2', 7)}<path d="M-80 -110 v60 M-110 -80 h60" stroke="#c33a2f" stroke-width="16"/>${C(-140, 14, 30, '#222', 6)}${C(150, 14, 30, '#222', 6)}</g>`;
  s += cartSVG(300, 880, .8, 80);
  return s;
};
ENV.road = (L) => {
  const [id, gd] = skyGrad('dawn');
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/><circle cx="1500" cy="480" r="110" fill="#ffe3a0" opacity=".9"/>`;
  s += skyline(0, 1920, 600, 40, 180, 61, 0, .6) + `<rect y="600" width="1920" height="480" fill="#8a8f6a"/>`;
  s += R(1100, 470, 520, 160, '#8a8f88', 6) + `<rect x="1100" y="470" width="520" height="30" fill="#3d6b4f"/>` + R(1300, 540, 120, 90, '#1c2228', 5);
  s += P('M0 900 Q900 820 1920 860 L1920 1080 L0 1080Z', '#5d5f63', 0) + `<path d="M0 960 Q900 880 1920 930" stroke="#e9e6dc" stroke-width="8" stroke-dasharray="70 50" fill="none"/>`;
  return s;
};
ENV.flashlight = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3a3530"/>`;
  s += `<g transform="rotate(-12 960 540)">${R(560, 470, 640, 140, '#4a4d55', 8, 'rx="30"')}${R(1180, 440, 120, 200, '#5a5d65', 8, 'rx="20"')}<ellipse cx="1300" cy="540" rx="20" ry="90" fill="#f4e7b0" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: 5 }, (_, i) => `<path d="M${700 + i * 70} 460 q20 80 0 160" stroke="#8a7a5a" stroke-width="40" fill="none"/>`).join('')}${Array.from({ length: 5 }, (_, i) => `<path d="M${700 + i * 70} 460 q20 80 0 160" stroke="${INK}" stroke-width="4" fill="none" opacity=".5"/>`).join('')}</g>`;
  s += P('M300 1080 Q340 820 600 700 Q660 690 680 730 L520 900 L480 1080Z', '#9a6646', 7) + `<path d="M300 1080 L380 900" stroke="#2f5a3e" stroke-width="140"/>`;
  s += P('M1620 1080 Q1580 820 1320 720 Q1260 710 1250 750 L1400 900 L1440 1080Z', '#9a6646', 7) + `<path d="M1620 1080 L1540 900" stroke="#2f5a3e" stroke-width="140"/>`;
  return s;
};
ENV.override = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3a4344"/>` + R(360, 240, 1200, 640, '#d6cdb5', 8, 'rx="30"');
  s += C(960, 560, 190, '#8a1f1a', 8) + C(960, 560, 150, '#c33a2f', 8) + T(420, 830, 54, 'MANUAL OVERRIDE', '#2f4a4c', 900, 'start');
  s += R(420, 290, 1080, 70, '#d8b52a', 6) + T(960, 340, 40, 'AUTHORIZED STAFF ONLY', '#222', 900);
  return s;
};
ENV.radiohand = (L) => {
  let s = `<rect width="1920" height="1080" fill="${L === 'dawn' ? '#6a5a50' : '#2f3a3a'}"/>`;
  s += `<g transform="rotate(-8 960 540)">${R(760, 300, 400, 560, '#3a3f46', 9, 'rx="40"')}<rect x="810" y="360" width="300" height="160" rx="10" fill="#0b1a10" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 8 }, (_, i) => `<path d="M820 ${580 + i * 28} h280" stroke="#2a2e33" stroke-width="10"/>`).join('')}<path d="M1100 300 L1160 60" stroke="${INK}" stroke-width="18"/>${C(1100, 800, 26, '#5a5f66', 5)}</g>`;
  s += P('M420 1080 Q500 860 760 760 Q800 760 800 820 L700 940 L640 1080Z', '#9a6646', 7) + `<path d="M420 1080 L520 900" stroke="#2f5a3e" stroke-width="150"/>`;
  return s;
};
