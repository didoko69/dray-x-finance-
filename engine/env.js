// ---------- environments: static backgrounds (rasterised once per env+light) ----------
const SKY = {
  eve: ['#3b2f5c', '#c86b4a', '#f2a65a'], night: ['#0c1428', '#1b2742', '#2a3656'], dark: ['#070b18', '#0f1729', '#18223a'],
  red: ['#0c1428', '#1b2742', '#2a3656'], dawn: ['#5a6fa0', '#e9a07a', '#f7d48a'], day: ['#6fa8dc', '#a9cdec', '#dfeef8'],
  sos: ['#070b18', '#0f1729', '#18223a'], sosdark: ['#070b18', '#0f1729', '#18223a'], dim: ['#0c1428', '#1b2742', '#2a3656'],
  warm: ['#0c1428', '#1b2742', '#2a3656'], cold: ['#0c1428', '#1b2742', '#2a3656'], flicker: ['#0c1428', '#1b2742', '#2a3656']
};
let gid = 0;
function skyGrad(light) { const s = SKY[light] || SKY.night; const id = 'sk' + (gid++);
  return [id, `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s[0]}"/><stop offset=".6" stop-color="${s[1]}"/><stop offset="1" stop-color="${s[2]}"/></linearGradient>`]; }
const isNight = l => !['eve', 'dawn', 'day', 'afternoon', 'dawnbroken'].includes(l);

function skyline(x0, x1, base, hmin, hmax, seed, lit, scale = 1) {
  let s = '';
  for (let i = 0, x = x0; x < x1; i++) {
    const w = (40 + rnd(seed + i) * 50) * scale, h = hmin + rnd(seed + i + 50) * (hmax - hmin);
    s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${i % 2 ? '#1d2840' : '#253150'}" stroke="#121a2b" stroke-width="2"/>`;
    if (lit) for (let r = 0; r < h / (18 * scale) - 1; r++) for (let c = 0; c < w / (12 * scale) - 1; c++) if (rnd(seed * 7 + i * 31 + r * 7 + c) > (lit === 2 ? .45 : .75)) s += `<rect x="${x + 4 * scale + c * 11 * scale}" y="${base - h + 6 * scale + r * 18 * scale}" width="${5 * scale}" height="${8 * scale}" fill="#f0c060" opacity=".9"/>`;
    x += w + 3;
  }
  return s;
}
function plane(x, y, s, col = '#e8ecf2') {
  return `<g transform="translate(${x},${y}) scale(${s})">${P('M-300 0 Q-300 -40 -240 -44 L240 -44 Q300 -40 320 -10 L320 4 Q300 14 240 14 L-240 14 Q-300 14 -300 0Z', col, 5)}
  ${P('M-240 -44 L-290 -130 L-250 -130 L-180 -44Z', col, 5)}${P('M-40 0 L-120 70 L-60 70 L60 0Z', '#cfd5de', 5)}
  ${Array.from({ length: 12 }, (_, i) => `<circle cx="${-180 + i * 34}" cy="-22" r="7" fill="#5b6b84"/>`).join('')}${P('M250 -30 Q280 -30 296 -14 L262 -14Z', '#5b6b84', 3)}</g>`;
}
function tiles(y0, y1, col1, col2) {
  let s = `<rect x="0" y="${y0}" width="1920" height="${y1 - y0}" fill="${col1}"/>`;
  for (let i = -12; i <= 12; i++) s += `<path d="M${960 + i * 60} ${y0} L${960 + i * 260} ${y1}" stroke="${col2}" stroke-width="3"/>`;
  for (let k = 0; k < 8; k++) { const y = y0 + (y1 - y0) * Math.pow(k / 8, 1.6); s += `<path d="M0 ${y} H1920" stroke="${col2}" stroke-width="3"/>`; }
  return s;
}
function seatsRow(x, y, n, col = '#3f6a9a') {
  let s = '';
  for (let i = 0; i < n; i++) s += P(`M${x + i * 70} ${y} h60 v-50 q0 -10 -10 -10 h-40 q-10 0 -10 10z`, col, 5) + R(x + i * 70 - 4, y - 6, 68, 16, col, 5, 'rx="5"');
  s += P(`M${x} ${y + 10} v40 M${x + n * 70 - 10} ${y + 10} v40`, 'none', 7);
  return s;
}
function windowOutside(x, y, w, h, light, opts = {}) {
  const [id, gd] = skyGrad(light);
  let s = `<defs>${gd}<clipPath id="c${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#c${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;
  if (opts.city) s += skyline(x, x + w, y + h * opts.city, 40, h * .35, 11, isNight(light) ? 1 : 0, .8);
  if (opts.runway) {
    const gy = y + h * .7;
    s += `<rect x="${x}" y="${gy}" width="${w}" height="${h}" fill="${isNight(light) ? '#1c2230' : '#5d6470'}"/>`;
    s += `<path d="M${x} ${gy + 40} H${x + w}" stroke="${isNight(light) ? '#3a4255' : '#c9cbcf'}" stroke-width="6" stroke-dasharray="60 40"/>`;
    if (opts.plane) s += plane(x + w * opts.plane, gy + 20, .9);
    if (opts.tower) s += `${R(x + w * opts.tower, gy - 260, 40, 260, '#7b8494', 4)}${P(`M${x + w * opts.tower - 30} ${gy - 260} h100 l-14 -50 h-72z`, '#9fb4c9', 4)}`;
  }
  s += `</g>`;
  return s;
}

const ENV = {};
ENV.hall = (L) => {
  let s = `<rect width="1920" height="1080" fill="#7d8796"/>`;
  s += windowOutside(0, 120, 1920, 560, L, { city: .62, runway: 1, plane: .62, tower: .14 });
  for (let i = 0; i <= 8; i++) s += `<path d="M${i * 240} 120 V680" stroke="#39404c" stroke-width="16"/>`;
  s += `<path d="M0 400 H1920" stroke="#39404c" stroke-width="8"/>`;
  s += `<rect x="0" y="0" width="1920" height="125" fill="#5b6370"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${60 + i * 220}" y="40" width="120" height="14" rx="7" fill="#f4ecd2"/>`).join('');
  s += `<path d="M0 125 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += tiles(680, 1080, '#a3a9b3', '#8d939e');
  s += `<rect x="0" y="672" width="1920" height="14" fill="#565d68" stroke="${INK}" stroke-width="4"/>`;
  // board hanging
  s += `<path d="M860 125 V160 M1060 125 V160" stroke="${INK}" stroke-width="6"/>` + R(760, 160, 400, 150, '#1d2129', 7, 'rx="8"') + T(960, 200, 24, 'DEPARTURES', '#f2c14e');
  for (let r = 0; r < 4; r++) s += `<rect x="785" y="${215 + r * 22}" width="350" height="14" fill="#2c323d"/><rect x="785" y="${215 + r * 22}" width="${120 + rnd(r) * 160}" height="14" fill="#f2c14e" opacity=".6"/>`;
  // pillars
  for (const x of [360, 1520]) s += R(x, 125, 70, 560, '#c9ccd2', 7) + `<rect x="${x + 10}" y="560" width="50" height="40" fill="#2a5aa0"/>` + T(x + 35, 588, 22, 'G' + (x > 1000 ? '14' : '3'), '#fff');
  s += seatsRow(120, 760, 3) + seatsRow(1640, 760, 3) + seatsRow(560, 720, 4, '#4d76a3') + seatsRow(1120, 720, 4, '#4d76a3');
  // trolley + bags
  s += P('M1380 860 h120 l20 -70 M1390 860 v14 M1490 860 v14', 'none', 6) + R(1395, 800, 80, 56, '#8c3b32', 5, 'rx="8"') + R(1405, 760, 60, 42, '#41608f', 5, 'rx="6"');
  return s;
};
ENV.board = (L) => {
  let s = `<rect width="1920" height="1080" fill="#14161b"/>` + R(80, 80, 1760, 920, '#1b1f27', 10, 'rx="18"');
  s += T(160, 190, 64, 'DEPARTURES', '#f2c14e', 800, 'start') + `<path d="M140 220 H1780" stroke="#3a3f4a" stroke-width="4"/>`;
  s += T(160, 270, 30, 'TIME', '#8a93a3', 700, 'start') + T(380, 270, 30, 'FLIGHT', '#8a93a3', 700, 'start') + T(640, 270, 30, 'DESTINATION', '#8a93a3', 700, 'start') + T(1350, 270, 30, 'STATUS', '#8a93a3', 700, 'start');
  const rows = [['18:05', 'KB 214', 'LISBON'], ['18:20', 'NR 088', 'NAIROBI'], ['18:35', 'KB 402', 'TORONTO'], ['18:40', 'AX 731', 'OSAKA'], ['19:10', 'KB 118', 'DUBAI'], ['19:25', 'LT 509', 'ACCRA'], ['20:00', '7Q9', 'CARGO · KBX']];
  rows.forEach((r, i) => { const y = 340 + i * 90; s += `<rect x="140" y="${y - 50}" width="1640" height="72" fill="${i % 2 ? '#20252e' : '#252b35'}"/>` + T(160, y, 40, r[0], '#e9e6dc', 700, 'start') + T(380, y, 40, r[1], '#e9e6dc', 700, 'start') + T(640, y, 40, r[2], '#e9e6dc', 700, 'start'); });
  return s;
};
ENV.glass = (L) => {
  let s = windowOutside(0, 0, 1920, 1080, L, { city: .45 });
  const night = isNight(L);
  // parking lot
  s += `<rect x="0" y="560" width="1920" height="520" fill="${night ? '#20242c' : '#5a5f68'}"/>`;
  for (let i = 0; i < 10; i++) s += `<path d="M${i * 210 + 40} 600 L${i * 210 - 40} 700" stroke="${night ? '#4a505c' : '#dcdcdc'}" stroke-width="6"/>`;
  const cars = [[120, 610, '#8c3b32'], [560, 620, '#41608f'], [990, 605, '#bbbbbb'], [1450, 615, '#2f6a4a']];
  for (const c of cars) s += P(`M${c[0]} ${c[1]} q10 -40 60 -44 h80 q40 4 60 44 h20 v30 h-240z`, c[2], 5) + C(c[0] + 40, c[1] + 30, 16, '#222', 5) + C(c[0] + 190, c[1] + 30, 16, '#222', 5);
  for (const x of [300, 1200]) s += P(`M${x} 600 V380 h40`, 'none', 7) + `<ellipse cx="${x + 46}" cy="384" rx="16" ry="7" fill="${night ? '#ffd27a' : '#ddd'}"/>`;
  return s;
};
ENV.glassfront = (L) => { // drawn over actors (glass mullions + sill + reflections)
  let s = '';
  for (let i = 0; i <= 6; i++) s += `<path d="M${i * 320} 0 V1080" stroke="#2f3540" stroke-width="22"/>`;
  s += `<rect x="0" y="880" width="1920" height="200" fill="#4b525e" stroke="${INK}" stroke-width="6"/>`;
  s += `<path d="M100 0 L-200 880 M520 0 L260 880 M1100 0 L860 880 M1500 0 L1300 880" stroke="#cfe0ff" stroke-width="40" opacity=".05"/>`;
  return s;
};
ENV.cityview = (L) => {
  let s = windowOutside(0, 0, 1920, 1080, L, {});
  s += skyline(0, 1920, 560, 80, 360, 21, isNight(L) ? 2 : 0, 1);
  s += `<rect x="0" y="560" width="1920" height="520" fill="${isNight(L) ? '#151b28' : '#596070'}"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M0 ${600 + i * 22} H1920" stroke="#f0c060" stroke-width="2" stroke-dasharray="${4 + i} 26" opacity=".5"/>`;
  s += `<path d="M0 760 Q960 700 1920 760" stroke="#8a93a3" stroke-width="5" stroke-dasharray="4 10" fill="none"/>`; // fence
  for (let i = 0; i < 9; i++) { const x = 120 + i * 210, y = 740 - Math.sin(i / 8 * Math.PI) * 40; s += R(x, y - 30, 90, 34, '#4a5236', 4, 'rx="5"') + R(x + 60, y - 50, 30, 22, '#4a5236', 4); }
  // window frame
  s += `<path d="M0 0 H1920 V1080 H0Z M960 0 V1080 M0 540 H1920" stroke="#2f3540" stroke-width="40" fill="none"/>`;
  return s;
};
ENV.ring = (L) => {
  let s = windowOutside(0, 0, 1920, 1080, L, {});
  s += skyline(0, 1920, 330, 40, 200, 31, 2, .7) + `<rect x="0" y="330" width="1920" height="750" fill="#1a2030"/>`;
  s += `<ellipse cx="960" cy="690" rx="820" ry="300" fill="#222a3a" stroke="#8a93a3" stroke-width="6" stroke-dasharray="6 12"/>`;
  s += `<path d="M300 700 H1620" stroke="#3a4255" stroke-width="40"/>`;
  // terminal
  s += P('M640 560 L1280 560 L1340 700 L580 700Z', '#5d6676', 6) + P('M640 560 Q960 470 1280 560', '#7b8494', 6);
  for (let i = 0; i < 12; i++) s += `<rect x="${620 + i * 58}" y="600" width="40" height="60" fill="#2a3346"/>`;
  s += R(1360, 420, 30, 220, '#7b8494', 4) + P('M1340 420 h70 l-10 -40 h-50z', '#9fb4c9', 4);
  // trucks around ellipse
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, x = 960 + Math.cos(a) * 780, y = 690 + Math.sin(a) * 285;
    s += `<g transform="translate(${x},${y}) scale(${.8 + Math.sin(a) * .25})">${R(-40, -26, 80, 30, '#4a5236', 4, 'rx="4"')}${R(12, -44, 28, 20, '#4a5236', 4)}${C(-24, 6, 9, '#222', 3)}${C(24, 6, 9, '#222', 3)}</g>`; }
  return s;
};
ENV.shutters = (L) => {
  let s = `<rect width="1920" height="1080" fill="#8a92a0"/>` + tiles(780, 1080, '#a3a9b3', '#8d939e');
  for (let i = 0; i < 4; i++) { const x = 120 + i * 440;
    s += windowOutside(x, 300, 360, 480, L, { city: .7 }) + `<path d="M${x + 180} 300 V780" stroke="#39404c" stroke-width="10"/>` + R(x, 300, 360, 480, 'none', 10);
    s += R(x - 10, 240, 380, 60, '#5b6370', 6) + `<rect x="${x + 130}" y="190" width="100" height="40" fill="#2f8a4a" stroke="${INK}" stroke-width="4"/>` + T(x + 180, 220, 24, 'EXIT', '#fff'); }
  return s;
};
ENV.lounge = (L) => {
  let s = `<linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b5a4a"/><stop offset="1" stop-color="#8a735c"/></linearGradient><rect width="1920" height="1080" fill="url(#lw)"/>`;
  for (let i = 0; i < 24; i++) s += `<path d="M${i * 80} 90 V780" stroke="#5e4f40" stroke-width="3"/>`;
  s += `<rect width="1920" height="90" fill="#4a4038"/>` + Array.from({ length: 5 }, (_, i) => `<circle cx="${250 + i * 360}" cy="70" r="16" fill="#f4ecd2" stroke="${INK}" stroke-width="4"/>`).join('');
  s += windowOutside(120, 170, 820, 470, L, { runway: 1, plane: .5, city: .55 }) + `<path d="M120 170 h820 v470 h-820z M530 170 v470" stroke="#3a3330" stroke-width="16" fill="none"/>`;
  s += `<rect x="0" y="780" width="1920" height="300" fill="#4c5a6e"/>` + Array.from({ length: 30 }, (_, i) => `<path d="M${i * 70} 780 l-60 300" stroke="#45526a" stroke-width="4"/>`).join('');
  s += `<rect x="0" y="770" width="1920" height="16" fill="#3a3330"/>`;
  // glass door
  s += R(1380, 300, 230, 480, '#2a3346', 8) + `<rect x="1395" y="315" width="200" height="450" fill="#3a4a66" opacity=".7"/>` + R(1630, 480, 40, 60, '#2a2a2a', 4) + `<circle cx="1650" cy="500" r="5" fill="#a33"/>` + T(1495, 290, 24, 'BUSINESS LOUNGE', '#e9dfc6', 700);
  // sofas
  s += P('M260 700 q0 -40 40 -40 h300 q40 0 40 40 v80 h-380z', '#7a3b3b', 7) + R(230, 720, 60, 70, '#6a3232', 7, 'rx="20"') + R(610, 720, 60, 70, '#6a3232', 7, 'rx="20"');
  s += P('M880 740 h220 M900 740 v40 M1080 740 v40', 'none', 8) + `<ellipse cx="990" cy="738" rx="120" ry="16" fill="#5a4a3a" stroke="${INK}" stroke-width="5"/>`;
  s += R(1720, 560, 120, 220, '#5a4a3a', 6) + `<rect x="1735" y="580" width="90" height="60" fill="#d8cfbf"/>` + T(1780, 620, 18, 'BAR', '#5a4a3a');
  return s;
};
ENV.balcony = (L) => {
  let s = `<rect width="1920" height="1080" fill="#6d7584"/>` + windowOutside(0, 60, 1920, 380, L, { runway: 1, plane: .7 });
  for (let i = 0; i <= 8; i++) s += `<path d="M${i * 240} 60 V440" stroke="#39404c" stroke-width="10"/>`;
  s += tiles(440, 1080, '#99a0aa', '#868c97');
  s += seatsRow(780, 640, 5) + seatsRow(1300, 700, 4) + seatsRow(400, 700, 3);
  s += P('M1180 660 h110 l16 -60 M1188 660 v12 M1282 660 v12', 'none', 6);
  // railing foreground
  s += `<rect x="0" y="880" width="1920" height="200" fill="#5b6370"/><rect x="0" y="740" width="1920" height="140" fill="#cfe0ff" opacity=".18"/><path d="M0 740 H1920" stroke="${INK}" stroke-width="12"/><path d="M0 880 H1920" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${i * 240} 740 V880" stroke="${INK}" stroke-width="6"/>`;
  return s;
};
ENV.security = (L) => {
  let s = `<rect width="1920" height="1080" fill="#8b929e"/><rect width="1920" height="110" fill="#5b6370"/>` + tiles(700, 1080, '#a7adb6', '#9298a2');
  s += R(700, 160, 520, 90, '#2a5aa0', 7) + T(960, 222, 54, 'SECURITY', '#fff');
  // x-ray machine
  s += R(160, 600, 520, 110, '#c5cad2', 7) + R(300, 520, 240, 190, '#d8dce2', 7, 'rx="10"') + `<rect x="330" y="620" width="180" height="90" fill="#1f2530"/>` + `<path d="M160 640 H680" stroke="#2c2f36" stroke-width="20"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${330 + i * 30} 620 v90" stroke="#3a3f4a" stroke-width="5"/>`;
  s += R(160, 710, 20, 100, '#777', 5) + R(660, 710, 20, 100, '#777', 5);
  // arches
  for (const x of [800, 1060, 1320]) s += P(`M${x} 820 V430 h160 V820`, 'none', 26) + P(`M${x} 820 V430 h160 V820`, 'none', 14, `stroke="#c9ccd2"`) + `<rect x="${x + 50}" y="440" width="60" height="16" fill="#3a8a4a"/>`;
  // stanchions
  for (const x of [120, 760, 1560, 1760]) s += P(`M${x} 900 V800`, 'none', 8) + C(x, 796, 8, '#d0d0d0', 4);
  s += `<path d="M1560 820 Q1660 840 1760 820" stroke="#2a5aa0" stroke-width="8" fill="none"/>`;
  // trays
  [[600, 900, 10], [980, 960, -15], [1500, 930, 20], [300, 1000, -8], [1200, 1010, 5]].forEach(([x, y, r]) => s += `<g transform="rotate(${r} ${x} ${y})">${R(x - 50, y - 12, 100, 24, '#8c939e', 5, 'rx="5"')}</g>`);
  return s;
};
ENV.food = (L) => {
  let s = `<rect width="1920" height="1080" fill="#7a6f66"/><rect width="1920" height="100" fill="#4f4842"/>` + tiles(780, 1080, '#b0a596', '#9c9182');
  const shops = [['BURGERS', '#b0453a'], ['NOODLE BAR', '#3a7a5a'], ['COFFEE', '#6b4a2a']];
  shops.forEach((sh, i) => { const x = 80 + i * 620;
    s += R(x, 160, 520, 90, sh[1], 7) + T(x + 260, 222, 44, sh[0], '#f6efe0');
    s += R(x, 250, 520, 530, '#3b3330', 7) + `<rect x="${x + 20}" y="270" width="480" height="${180 + i * 30}" fill="#9aa1aa"/>` + Array.from({ length: 8 }, (_, k) => `<path d="M${x + 20} ${290 + k * 22} h480" stroke="#7d848e" stroke-width="4"/>`).join('');
    s += R(x + 20, 640, 480, 140, '#c9b99c', 6); });
  // fridge
  s += R(870, 420, 180, 360, '#cfd6de', 7, 'rx="8"') + `<rect x="885" y="440" width="150" height="300" fill="#a9d4f0" opacity=".5"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) s += `<rect x="${895 + c * 28}" y="${450 + r * 70}" width="16" height="50" rx="5" fill="${['#69b3ee', '#e07a34', '#7fd36b'][(r + c) % 3]}" stroke="${INK}" stroke-width="2"/>`;
  // tables
  for (const x of [300, 1450, 700, 1700]) s += `<ellipse cx="${x}" cy="860" rx="90" ry="20" fill="#d8cfbf" stroke="${INK}" stroke-width="5"/>` + P(`M${x} 880 v80 M${x - 40} 960 h80`, 'none', 7);
  return s;
};
ENV.staff = (L) => {
  let s = `<rect width="1920" height="1080" fill="#6f7a6a"/>` + Array.from({ length: 30 }, (_, i) => `<path d="M0 ${i * 30} H1920" stroke="#66715f" stroke-width="2"/>`).join('');
  s += `<rect x="0" y="780" width="1920" height="300" fill="#585248"/><path d="M0 780 H1920" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 4; i++) s += R(60 + i * 110, 300, 100, 480, '#8a9aa8', 6) + `<path d="M${80 + i * 110} 330 h60 M${80 + i * 110} 345 h60" stroke="${INK}" stroke-width="4"/>` + C(140 + i * 110, 540, 6, '#555', 3);
  // shelves with supplies
  s += R(1380, 300, 440, 480, '#7a5236', 7);
  for (let r = 0; r < 3; r++) { s += `<path d="M1380 ${420 + r * 120} h440" stroke="${INK}" stroke-width="7"/>`;
    for (let c = 0; c < 9; c++) s += r === 1 ? R(1395 + c * 46, 448 + r * 120 - 80, 34, 52, '#e07a34', 3, 'rx="4"') : `<rect x="${1395 + c * 46}" y="${420 + r * 120 - 90}" width="26" height="80" rx="8" fill="#69b3ee" stroke="${INK}" stroke-width="3"/>`; }
  // bench/cot
  s += R(620, 690, 640, 50, '#5b4a3a', 7, 'rx="8"') + P('M650 740 v40 M1230 740 v40', 'none', 9) + R(600, 650, 120, 40, '#d6d1c7', 5, 'rx="14"');
  // table + lamp
  s += R(1240, 640, 120, 18, '#5a3d2a', 5) + P('M1260 658 v120 M1340 658 v120', 'none', 7) + P('M1300 640 v-60 l-30 -50 h60z', '#d8c37a', 5);
  s += `<rect x="760" y="260" width="300" height="200" fill="#e9dfc6" stroke="${INK}" stroke-width="6"/>` + T(910, 320, 26, 'STAFF ONLY', '#8a2a2a') + T(910, 370, 20, 'BAGGAGE OPERATIONS', '#444', 600) + T(910, 410, 18, 'Shift board', '#666', 500);
  return s;
};
ENV.corridor = (L) => {
  const vx = 960, vy = 470;
  let s = `<rect width="1920" height="1080" fill="#55606a"/>`;
  s += `<path d="M0 0 L${vx - 220} ${vy - 160} L${vx - 220} ${vy + 140} L0 1080Z" fill="#6c7782"/><path d="M1920 0 L${vx + 220} ${vy - 160} L${vx + 220} ${vy + 140} L1920 1080Z" fill="#65707b"/>`;
  s += `<path d="M0 1080 L${vx - 220} ${vy + 140} H${vx + 220} L1920 1080Z" fill="#4a4f55"/><path d="M0 0 L${vx - 220} ${vy - 160} H${vx + 220} L1920 0Z" fill="#3e444c"/>`;
  s += R(vx - 220, vy - 160, 440, 300, '#2a3038', 6);
  for (let k = 0; k < 6; k++) { const f = Math.pow(.62, k), x = vx - 220 - (960 - 220) * f, x2 = vx + 220 + (960 - 220) * f, yt = vy - 160 - (vy - 160) * f, yb = vy + 140 + (1080 - vy - 140) * f;
    s += `<path d="M${x} ${yt} H${x2} M${x} ${yb} H${x2}" stroke="#2c3238" stroke-width="${4 + f * 6}"/>`;
    s += `<rect x="${vx - 60 * f - 20}" y="${yt + 6 * f}" width="${120 * f + 40}" height="${10 + 10 * f}" rx="5" fill="#f4ecd2" stroke="${INK}" stroke-width="3"/>`; }
  // pipes
  for (const off of [0, 30]) s += `<path d="M0 ${60 + off} L${vx - 220} ${vy - 140 + off * .3}" stroke="#7a6a50" stroke-width="${16 - off * .2}"/>` + `<path d="M1920 ${80 + off} L${vx + 220} ${vy - 130 + off * .3}" stroke="#5a6a70" stroke-width="${14 - off * .2}"/>`;
  // doors
  s += P('M120 300 L330 360 L330 860 L120 960Z', '#7a6a50', 6) + P('M1800 300 L1590 360 L1590 860 L1800 960Z', '#6a6a70', 6);
  s += `<rect x="150" y="380" width="140" height="50" fill="#e9dfc6" transform="skewY(15) translate(0 -60)"/>`;
  s += T(225, 410, 20, 'STAFF ONLY', '#8a2a2a', 800, 'middle', 'transform="skewY(15) translate(0 -60)"');
  s += `<path d="M640 1080 L${vx - 60} ${vy + 140} M1280 1080 L${vx + 60} ${vy + 140}" stroke="#d8b52a" stroke-width="8" stroke-dasharray="40 30"/>`;
  return s;
};
ENV.store = (L) => {
  let s = `<rect width="1920" height="1080" fill="#6a6f78"/><rect y="800" width="1920" height="280" fill="#4c5058"/><path d="M0 800 H1920" stroke="${INK}" stroke-width="8"/>`;
  for (const x0 of [560, 980]) { s += P(`M${x0} 800 V300 M${x0 + 360} 800 V300`, 'none', 10);
    for (let r = 0; r < 4; r++) { const y = 360 + r * 130; s += `<path d="M${x0} ${y} h360" stroke="${INK}" stroke-width="8"/>`;
      for (let c = 0; c < 4; c++) s += R(x0 + 14 + c * 86, y - 70, 74, 66, ['#b08a5a', '#c49a62', '#9a7a4a'][(r + c) % 3], 4); } }
  s += R(240, 260, 260, 540, '#7b8494', 8) + `<path d="M370 270 V790" stroke="${INK}" stroke-width="5"/>` + C(355, 520, 6, '#444', 3) + C(385, 520, 6, '#444', 3);
  s += R(1460, 300, 240, 500, '#5a5f68', 8) + `<rect x="1520" y="340" width="120" height="70" fill="#e9dfc6"/>` + T(1580, 382, 22, 'STORE B', '#333');
  s += R(1650, 520, 22, 60, '#c8a24a', 4);
  return s;
};
ENV.cupboard = (L) => `<rect width="1920" height="1080" fill="#07080b"/><rect x="930" y="0" width="60" height="1080" fill="#1a2130"/>`;
ENV.door = (L) => {
  let s = `<rect width="1920" height="1080" fill="#5f6873"/><rect y="820" width="1920" height="260" fill="#45494f"/>`;
  s += R(1000, 220, 380, 600, '#7b8494', 8) + `<path d="M1000 220 l380 0" stroke="#d8b52a" stroke-width="20" stroke-dasharray="30 30"/>`;
  s += R(1060, 300, 260, 120, '#c33a2f', 6) + T(1190, 350, 34, 'RESTRICTED', '#fff') + T(1190, 395, 26, 'CARGO BAY', '#fff', 700);
  s += R(1420, 580, 70, 110, '#2c2f36', 6, 'rx="8"') + `<rect x="1435" y="600" width="40" height="30" fill="#555"/>`;
  return s;
};
ENV.cargo = (L) => {
  let s = `<rect width="1920" height="1080" fill="#4a5462"/><rect y="0" width="1920" height="160" fill="#2f3640"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${i * 240} 160 L${i * 240 + 120} 0" stroke="#252b33" stroke-width="12"/>`;
  s += `<path d="M0 160 H1920" stroke="${INK}" stroke-width="10"/>` + `<rect y="860" width="1920" height="220" fill="#3b4048"/><path d="M0 860 H1920" stroke="${INK}" stroke-width="8"/>`;
  // crates
  [[60, 620, 220, 240], [300, 700, 160, 160], [1560, 600, 300, 260], [1440, 720, 140, 140], [1640, 460, 180, 140]].forEach(([x, y, w, h], i) => s += R(x, y, w, h, i % 2 ? '#9a7a4a' : '#b08a5a', 6) + `<path d="M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}" stroke="${INK}" stroke-width="4" opacity=".5"/>`);
  // tape on walls
  for (const y of [300, 420]) s += `<path d="M0 ${y} H520 M1400 ${y + 20} H1920" stroke="#e8c21a" stroke-width="26"/><path d="M0 ${y} H520 M1400 ${y + 20} H1920" stroke="#222" stroke-width="26" stroke-dasharray="26 26"/>`;
  // notices
  for (const [x, y, r] of [[230, 470, -4], [360, 500, 5], [1500, 480, 3]]) s += `<g transform="rotate(${r} ${x} ${y})">${R(x - 50, y - 60, 100, 130, '#f1ece2', 4)}<rect x="${x - 40}" y="${y - 50}" width="80" height="16" fill="#c33a2f"/>${[0, 1, 2, 3].map(k => `<path d="M${x - 38} ${y - 20 + k * 18} h${60 + rnd(k + x) * 16}" stroke="#666" stroke-width="5"/>`).join('')}</g>`;
  // container
  s += P('M560 380 L1360 380 L1360 860 L560 860Z', '#b4472e', 8);
  for (let i = 0; i < 16; i++) s += `<path d="M${590 + i * 48} 400 V840" stroke="#8f3522" stroke-width="7"/>`;
  s += `<rect x="640" y="440" width="380" height="150" fill="#f1ece2" stroke="${INK}" stroke-width="6"/>` + T(830, 560, 120, '7Q9', '#222', 900);
  // torn doors
  s += P('M1360 380 L1520 330 L1500 560 L1530 620 L1480 900 L1360 860Z', '#a03f28', 8) + P('M1180 860 L1200 600 L1230 640 L1250 420 L1360 380 L1360 860Z', '#1a1416', 6);
  s += P('M1240 470 l30 -20 l-6 40 l40 -10 M1210 640 l40 10 l-10 30', 'none', 6, 'stroke="#d9d4c7"');
  s += `<rect x="1180" y="390" width="20" height="470" fill="none"/>`;
  return s;
};
ENV.control = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3d4652"/>` + windowOutside(80, 100, 1760, 480, L, { runway: 1, city: .55, tower: .9 });
  for (let i = 0; i <= 4; i++) s += `<path d="M${80 + i * 440} 100 V580" stroke="#262c35" stroke-width="16"/>`;
  s += `<rect x="80" y="100" width="1760" height="480" fill="none" stroke="${INK}" stroke-width="10"/>`;
  // runway lamps (off)
  for (let r = 0; r < 2; r++) for (let i = 0; i < 18; i++) s += `<circle cx="${120 + i * 100}" cy="${470 + r * 60 + i * 2}" r="5" fill="#4a4f5a"/>`;
  // console
  s += P('M0 640 L1920 640 L1920 1080 L0 1080Z', '#2c323c', 8) + P('M0 640 L1920 640 L1920 700 L0 700Z', '#4d5664', 6);
  for (const x of [180, 560, 940]) s += R(x, 560, 300, 140, '#11161d', 7, 'rx="8"');
  s += C(330, 630, 52, '#0d2a1a', 4) + `<circle cx="330" cy="630" r="30" fill="none" stroke="#3a8a5a" stroke-width="3"/>`;
  s += `<path d="M590 650 l40 -30 l40 20 l40 -40 l40 30 l40 -20 l40 10" stroke="#4fa36a" stroke-width="5" fill="none"/>` + T(1090, 640, 30, 'RWY LIGHTS', '#d8b52a', 800);
  // switch panel
  s += R(1345, 560, 130, 120, '#d8dce2', 7, 'rx="10"') + R(1395, 590, 30, 60, '#444', 5, 'rx="6"') + T(1410, 702, 20, 'MANUAL', '#d8dce2', 700);
  return s;
};
ENV.runway = (L) => {
  const [id, gd] = skyGrad(L);
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>` + skyline(0, 1920, 430, 30, 160, 41, 1, .7);
  s += `<rect y="430" width="1920" height="650" fill="#141a26"/>` + P('M760 430 L1160 430 L1800 1080 L120 1080Z', '#1f2533', 0);
  s += `<path d="M960 440 L960 1080" stroke="#3a4255" stroke-width="10" stroke-dasharray="40 40"/>`;
  s += plane(300, 500, .6, '#8a93a3') + R(1640, 280, 40, 160, '#5b6370', 4) + P('M1620 280 h80 l-12 -40 h-56z', '#6c86a0', 4);
  return s;
};
ENV.stairs = (L) => {
  let s = `<rect width="1920" height="1080" fill="#4a525e"/>`;
  for (let i = 0; i < 12; i++) { const x = 300 + i * 110, y = 980 - i * 60; s += `<path d="M${x} ${y} h110 v-60" stroke="${INK}" stroke-width="6" fill="#6c7480"/>` + `<rect x="${x}" y="${y}" width="110" height="${1080 - y}" fill="#5d6571"/>`; }
  s += `<path d="M260 900 L1640 160" stroke="${INK}" stroke-width="10"/>` + Array.from({ length: 13 }, (_, i) => `<path d="M${300 + i * 110} ${880 - i * 59} v80" stroke="${INK}" stroke-width="5"/>`).join('');
  s += R(80, 300, 140, 260, '#2f8a4a', 6) + T(150, 450, 28, 'EXIT', '#fff') + T(150, 250, 30, 'LEVEL 3 ▲', '#d8dce2', 700);
  return s;
};
ENV.baggage = (L) => {
  let s = `<rect width="1920" height="1080" fill="#7d8592"/>` + windowOutside(0, 60, 1920, 220, L, {}) + Array.from({ length: 9 }, (_, i) => `<path d="M${i * 240} 60 V280" stroke="#39404c" stroke-width="10"/>`).join('');
  s += `<rect y="280" width="1920" height="20" fill="#39404c"/>` + tiles(560, 1080, '#a3a9b3', '#8d939e');
  for (const [cx, n] of [[560, 1], [1360, 2]]) { s += `<ellipse cx="${cx}" cy="740" rx="330" ry="110" fill="#3a3f4a" stroke="${INK}" stroke-width="8"/><ellipse cx="${cx}" cy="740" rx="250" ry="60" fill="#5b6370" stroke="${INK}" stroke-width="6"/>`;
    s += R(cx - 60, 380, 120, 300, '#5b6370', 7) + `<rect x="${cx - 46}" y="560" width="92" height="110" fill="#1f2328"/>` + R(cx - 80, 330, 160, 60, '#f2c14e', 6) + T(cx, 375, 40, n, '#222'); }
  s += R(760, 160, 400, 70, '#2a5aa0', 6) + T(960, 210, 40, 'BAGGAGE CLAIM', '#fff');
  return s;
};
ENV.gate = (L) => {
  const [id, gd] = skyGrad('dawn');
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="#3b4250"/>`;
  s += `<rect x="460" y="180" width="1000" height="680" fill="url(#${id})"/><rect x="460" y="700" width="1000" height="160" fill="#b9a58a"/>` + skyline(460, 1460, 700, 30, 160, 61, 0, .7);
  s += R(440, 160, 1040, 40, '#2c323c', 6) + R(420, 160, 40, 700, '#2c323c', 6) + R(1460, 160, 40, 700, '#2c323c', 6) + T(960, 140, 50, 'CARGO GATE C', '#d8b52a');
  s += `<rect y="860" width="1920" height="220" fill="#3b4048"/><path d="M0 860 H1920" stroke="${INK}" stroke-width="8"/>`;
  return s;
};
ENV.gateout = (L) => {
  const [id, gd] = skyGrad('dawn');
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  s += R(-10, 120, 1940, 760, '#6c7380', 8) + `<path d="M0 300 H1920" stroke="#5b6170" stroke-width="6"/>`;
  s += R(460, 300, 1000, 580, '#1a1416', 8) + T(960, 270, 50, 'GATE C', '#d8b52a');
  s += `<rect y="880" width="1920" height="200" fill="#8f8270"/><path d="M0 880 H1920" stroke="${INK}" stroke-width="8"/>`;
  return s;
};
ENV.tarmac = (L) => {
  const [id, gd] = skyGrad('dawn');
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>` + `<circle cx="1500" cy="460" r="90" fill="#ffe3a0" opacity=".8"/>`;
  s += skyline(0, 1920, 520, 30, 140, 71, 0, .6) + `<rect y="520" width="1920" height="560" fill="#8f8270"/>`;
  s += P('M100 520 L300 380 L500 520Z', '#6b7350', 6) + P('M1500 540 L1700 400 L1900 540Z', '#6b7350', 6);
  for (const x of [600, 1250]) s += `<g transform="translate(${x},600)">${R(-120, -80, 240, 90, '#4a5236', 6, 'rx="6"')}${R(80, -130, 90, 60, '#4a5236', 6)}${C(-70, 16, 26, '#222', 5)}${C(80, 16, 26, '#222', 5)}</g>`;
  return s;
};
ENV.street = (L) => {
  const [id, gd] = skyGrad('day');
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  // terminal in distance + fence
  s += P('M1180 560 L1700 560 L1740 640 L1140 640Z', '#8a93a3', 5) + R(1760, 470, 24, 170, '#8a93a3', 4);
  s += `<path d="M1100 600 H1920" stroke="#666" stroke-width="4"/>` + Array.from({ length: 20 }, (_, i) => `<path d="M${1100 + i * 42} 560 V650" stroke="#777" stroke-width="3"/>`).join('');
  // buildings left
  [[0, 180, 300, '#c9a27a'], [300, 260, 260, '#b5876a'], [560, 140, 300, '#d8c3a0'], [860, 300, 240, '#a7b5c4']].forEach(([x, y, w, c], i) => { s += R(x, y, w, 660 - y, c, 6); for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) if (y + 40 + r * 80 < 600) s += R(x + 30 + k * (w - 60) / 3, y + 40 + r * 80, (w - 120) / 3, 50, '#5d7896', 3); });
  // cafe
  s += R(300, 520, 260, 140, '#f1ece2', 6) + P('M290 520 l20 -50 h240 l20 50z', '#c8382f', 6) + T(430, 508, 26, 'COFFEE', '#fff');
  s += `<rect y="660" width="1920" height="200" fill="#a7a49c"/><path d="M0 660 H1920" stroke="${INK}" stroke-width="6"/><rect y="860" width="1920" height="220" fill="#55585e"/><path d="M0 960 H1920" stroke="#e9e6dc" stroke-width="8" stroke-dasharray="80 60"/>`;
  s += P('M1050 660 V440 h50', 'none', 7) + `<ellipse cx="1110" cy="444" rx="18" ry="7" fill="#ddd"/>`;
  return s;
};
ENV.cardhand = (L) => {
  let s = `<rect width="1920" height="1080" fill="#2b2b33"/>`;
  s += `<g transform="rotate(-6 760 560)">${R(560, 380, 400, 260, '#f1ece2', 7, 'rx="20"')}<rect x="560" y="380" width="400" height="70" fill="#2a5aa0" stroke="${INK}" stroke-width="7"/>${T(760, 430, 34, 'KELVIN BAY · STAFF', '#fff')}
  ${C(660, 540, 50, '#fbfaf6', 5)}<path d="M612 528 Q620 486 660 488 Q700 486 708 528 Q690 510 660 512 Q630 510 612 528Z" fill="#b9b9bd" stroke="${INK}" stroke-width="4"/>${T(820, 530, 30, 'GRACE O.', '#222', 800)}${T(820, 570, 22, 'BAGGAGE · L4', '#555', 600)}</g>`;
  s += `<path d="M640 360 Q600 120 820 40" stroke="#c8382f" stroke-width="16" fill="none"/><path d="M880 360 Q940 140 820 40" stroke="#c8382f" stroke-width="16" fill="none"/>`;
  s += `<g transform="rotate(8 1280 560)">${R(1080, 320, 380, 460, '#f7f4ee', 7)}<rect x="1110" y="350" width="320" height="320" fill="#8fc0e8"/>${C(1270, 520, 46, '#fbfaf6', 5)}<path d="M1226 506 Q1230 470 1270 470 Q1310 470 1314 506 Z" fill="#c8382f" stroke="${INK}" stroke-width="4"/><path d="M1250 520 h2 M1288 520 h2" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M1250 540 q20 18 40 0" stroke="${INK}" stroke-width="5" fill="none"/>${P('M1270 566 V630 M1270 590 l-40 -20 M1270 590 l40 -30 M1270 630 l-20 40 M1270 630 l20 40', 'none', 7)}<path d="M1300 540 l40 -14 l-10 10 l20 0 l-50 12z" fill="#e8ecf2" stroke="${INK}" stroke-width="3"/>${T(1270, 740, 40, 'Teddy, 6', '#333', 600, 'middle', 'font-style="italic"')}</g>`;
  // hand
  s += P('M300 1080 Q380 820 560 700 Q620 670 660 700 Q700 740 640 770 L560 820 Q520 900 520 1080Z', '#fbfaf6', 7);
  return s;
};
ENV.photo = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3b3330"/>`;
  s += `<g transform="rotate(-3 960 540)">${R(560, 140, 800, 860, '#f7f4ee', 8)}<rect x="610" y="190" width="700" height="620" fill="#8fc0e8"/><rect x="610" y="640" width="700" height="170" fill="#7fb06a"/>
  ${C(960, 450, 90, '#fbfaf6', 7)}<path d="M872 420 Q880 350 960 350 Q1040 350 1048 420Z" fill="#c8382f" stroke="${INK}" stroke-width="6"/><path d="M1040 410 h60" stroke="${INK}" stroke-width="10"/>
  <circle cx="930" cy="450" r="9" fill="${INK}"/><circle cx="992" cy="450" r="9" fill="${INK}"/><path d="M920 490 q40 34 80 0" stroke="${INK}" stroke-width="7" fill="none"/>
  ${P('M960 540 V680 M960 580 l-80 -50 M960 580 l90 -70 M960 680 l-40 90 M960 680 l40 90', 'none', 12)}<path d="M1050 500 l90 -30 l-20 22 l44 0 l-110 26z" fill="#e8ecf2" stroke="${INK}" stroke-width="5"/>
  ${T(960, 920, 60, 'Teddy, 6', '#333', 600, 'middle', 'font-style="italic"')}</g>`;
  s += P('M1240 1080 Q1300 900 1360 860 Q1420 840 1440 880 L1400 1080Z', '#fbfaf6', 7) + `<path d="M1300 1080 L1330 960" stroke="#f2c418" stroke-width="80"/>`;
  return s;
};
ENV.card = () => `<rect width="1920" height="1080" fill="#f1ece2"/>`;
ENV.map = () => `<rect width="1920" height="1080" fill="#f1ece2"/>`;
