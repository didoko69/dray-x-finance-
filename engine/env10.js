// ---------- Video 10: Zombie Outbreak — 30 Days Trapped On A Bridge (S1E1) ----------
const BRS = { brday: ['#7fa6c9', '#b9cbd6', '#e6dcc4'], brdusk: ['#2a2840', '#8a4a44', '#e08a52'], brnight: ['#060a16', '#0f1830', '#1c2848'], bred: ['#1a0608', '#3a0c10', '#5a1a14'], bday: ['#7fa6c9', '#b9cbd6', '#e6dcc4'] };
const isN = L => L === 'brnight' || L === 'bred' || L === 'bnight';
let _bg = 0;
function brSky(L) { const c = BRS[L] || BRS.brnight; const id = 'brs' + (_bg++);
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  if (isN(L)) for (let i = 0; i < 70; i++) s += `<circle cx="${rnd(i + 3) * 1920}" cy="${rnd(i + 90) * 420}" r="${1 + rnd(i + 7) * 2}" fill="#fff" opacity="${.3 + rnd(i) * .5}"/>`;
  return s; }
function skyline(L, y0, sc = 1, seed = 1, smoke = 1) { const n = isN(L); let s = '';
  if (smoke) for (let i = 0; i < 3; i++) { const x = 300 + i * 600 + rnd(seed + i) * 200; s += `<path d="M${x} ${y0} q-80 -180 40 -360 q90 -140 -20 -300" stroke="${n ? '#1a1a22' : '#5a5458'}" stroke-width="${70 + i * 20}" fill="none" opacity=".45" stroke-linecap="round"/>`; }
  for (let i = 0; i < 26; i++) { const w = (50 + rnd(seed + i) * 70) * sc, h = (60 + rnd(seed + i + 30) * 200) * sc, x = i * 78 * sc - 30 + rnd(i + seed) * 20;
    s += `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h}" fill="${n ? '#141822' : '#6a7486'}" stroke="${INK}" stroke-width="3"/>`;
    for (let k = 0; k < Math.floor(h / (26 * sc)); k++) for (let j = 0; j < 2; j++) if (rnd(seed * 3 + i * 11 + k * 3 + j) > (n ? .86 : .5)) s += `<rect x="${x + 8 * sc + j * w / 2}" y="${y0 - h + 10 * sc + k * 26 * sc}" width="${w / 2 - 14 * sc}" height="${10 * sc}" fill="${n ? '#d8a04a' : '#9aa6b6'}" opacity=".8"/>`; }
  if (smoke && !n) for (let i = 0; i < 2; i++) s += `<circle cx="${500 + i * 900}" cy="${y0 - 10}" r="40" fill="#e0803a" opacity=".5"/>`;
  if (smoke && n) for (let i = 0; i < 3; i++) s += `<circle cx="${400 + i * 600}" cy="${y0 - 5}" r="60" fill="#ff7a2a" opacity=".22"/>`;
  return s; }
function waterTower(x, y, s, L) { const n = isN(L), c = n ? '#20242c' : '#8a8478';
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 0 L-36 -170 M50 0 L36 -170 M-20 0 L-14 -170 M20 0 L14 -170 M-46 -60 L46 -110 M46 -60 L-46 -110" stroke="${n ? '#15181e' : '#5a564e'}" stroke-width="7" fill="none"/>
  <path d="M-64 -170 H64 V-250 Q0 -275 -64 -250Z" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M-70 -250 Q0 -300 70 -250" fill="${n ? '#191c22' : '#7a7468'}" stroke="${INK}" stroke-width="6"/><path d="M0 -285 v-20" stroke="${INK}" stroke-width="5"/></g>`; }
function car(x, y, w, col, f = 0, seed = 1) { const h = w * .42; let s = `<g transform="translate(${x} ${y}) scale(${f ? -1 : 1} 1)">`;
  s += `<path d="M${-w / 2} -${h * .22} L${-w / 2} -${h * .62} Q${-w / 2 + 6} -${h * .7} ${-w * .3} -${h * .7} L${-w * .2} -${h} L${w * .22} -${h} L${w * .34} -${h * .7} L${w / 2 - 6} -${h * .66} Q${w / 2} -${h * .6} ${w / 2} -${h * .4} L${w / 2} -${h * .22}Z" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M${-w * .18} -${h * .94} L${-w * .26} -${h * .72} L${-w * .03} -${h * .72} L${-w * .03} -${h * .94}Z M${w * .02} -${h * .94} L${w * .02} -${h * .72} L${w * .3} -${h * .72} L${w * .2} -${h * .94}Z" fill="#9fb4c4" stroke="${INK}" stroke-width="3" opacity=".9"/>`;
  s += C(-w * .3, -h * .2, h * .22, '#1d1d21', 5) + C(w * .3, -h * .2, h * .22, '#1d1d21', 5) + C(-w * .3, -h * .2, h * .09, '#7a7e84', 2) + C(w * .3, -h * .2, h * .09, '#7a7e84', 2);
  if (rnd(seed) > .5) s += `<path d="M${-w * .1} -${h * .45} h${w * .12}" stroke="#000" stroke-width="3" opacity=".4"/>`;
  return s + `</g>`; }
const CARC = ['#a83a2f', '#3a5a8a', '#d9d4c7', '#2c2f36', '#6a7a4a', '#c9a03a', '#7a8088', '#5a3a6a'];
function bus(x, y, w, L) { const h = w * .42; let s = `<g transform="translate(${x} ${y})">`;
  s += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h * .88}" rx="18" fill="#e3b43a" stroke="${INK}" stroke-width="7"/><rect x="${-w / 2}" y="${-h * .42}" width="${w}" height="${h * .1}" fill="#c33a2f"/>`;
  for (let k = 0; k < 7; k++) s += `<rect x="${-w / 2 + 30 + k * (w - 60) / 7}" y="${-h * .9}" width="${(w - 60) / 7 - 16}" height="${h * .36}" rx="6" fill="${isN(L) ? '#1a2030' : '#8fb0c4'}" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${w / 2 - 150}" y="${-h * .98}" width="120" height="34" fill="#111" stroke="${INK}" stroke-width="3"/>` + TM(w / 2 - 90, -h * .98 + 26, 24, '42 HARBOR', '#f2a03a', 900, 'middle');
  s += C(-w * .32, -h * .1, h * .15, '#1d1d21', 6) + C(w * .3, -h * .1, h * .15, '#1d1d21', 6) + C(-w * .32, -h * .1, h * .06, '#7a7e84', 2) + C(w * .3, -h * .1, h * .06, '#7a7e84', 2);
  return s + `</g>`; }
function crowd(x0, x1, y, sc, n, seed, L, dens = 1) { let s = ''; const col = isN(L) ? '#2a2e28' : '#4a5040';
  for (let i = 0; i < n * dens; i++) { const x = x0 + rnd(seed + i) * (x1 - x0), yy = y + rnd(seed + i + 500) * 60 * sc, ss = sc * (.8 + rnd(i + seed + 9) * .3);
    s += `<path d="M${x} ${yy} v-${40 * ss} M${x} ${yy - 30 * ss} l${14 * ss} ${-8 * ss}" stroke="${col}" stroke-width="${7 * ss}" stroke-linecap="round"/><circle cx="${x + 2 * ss}" cy="${yy - 52 * ss}" r="${12 * ss}" fill="#9aa092" stroke="${INK}" stroke-width="${3 * ss}"/>`; }
  return s; }
function towerLegs(x, top, bot, w, L) { const c = isN(L) ? '#3a3e46' : '#8a8f96';
  let s = `<rect x="${x - w / 2}" y="${top}" width="${w * .22}" height="${bot - top}" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="${x + w / 2 - w * .22}" y="${top}" width="${w * .22}" height="${bot - top}" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
  for (let k = 0; k < 3; k++) s += `<rect x="${x - w / 2}" y="${top + 40 + k * (bot - top) / 3.2}" width="${w}" height="26" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
  return s; }
// --- main deck (looking across the bridge to the far city + water tower) ---
ENV.brdeck = L => { const n = isN(L); let s = brSky(L) + skyline(L, 560, 1, 4) + waterTower(1600, 560, 1, L);
  s += `<rect y="560" width="1920" height="90" fill="${n ? '#0c1422' : '#4a6a80'}"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${rnd(i) * 1900} ${575 + rnd(i + 5) * 60} h${40 + rnd(i + 2) * 60}" stroke="${n ? '#2a3a5a' : '#8ab0c8'}" stroke-width="3"/>`).join('');
  s += towerLegs(330, -20, 700, 190, L);
  s += `<path d="M330 40 Q1200 560 2100 300" stroke="${n ? '#4a4e56' : '#9a9fa6'}" stroke-width="14" fill="none"/><path d="M330 40 Q1200 560 2100 300" stroke="${INK}" stroke-width="3" fill="none"/>`;
  for (let k = 0; k < 16; k++) { const xx = 460 + k * 100, u = (xx - 330) / 1770, yy = (1 - u) * (1 - u) * 40 + 2 * (1 - u) * u * 560 + u * u * 300; s += `<path d="M${xx} ${yy} V660" stroke="${n ? '#3a3e46' : '#7a7f86'}" stroke-width="4"/>`; }
  s += `<rect y="640" width="1920" height="26" fill="${n ? '#3a3e46' : '#8a8f96'}" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M${i * 50} 640 v-34" stroke="${n ? '#3a3e46' : '#8a8f96'}" stroke-width="6"/>`).join('') + `<path d="M0 606 H1920" stroke="${n ? '#3a3e46' : '#8a8f96'}" stroke-width="8"/>`;
  s += `<rect y="666" width="1920" height="414" fill="${n ? '#24262c' : '#5a5c62'}"/><path d="M0 666 H1920" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 12; i++) s += `<rect x="${i * 180}" y="${820}" width="90" height="10" fill="#d9c96a" opacity=".6"/><rect x="${i * 180 + 60}" y="${980}" width="90" height="10" fill="#d9c96a" opacity=".6"/>`;
  [[60, 800, 220, 0], [330, 790, 210, 2], [1420, 800, 220, 4], [1700, 795, 230, 1], [1960, 800, 200, 3]].forEach(([x, y, w, c], i) => s += car(x, y, w, CARC[c], i % 2, i));
  s += bus(960, 905, 640, L);
  [[90, 1080, 300, 5], [1830, 1085, 320, 6]].forEach(([x, y, w, c], i) => s += car(x, y, w, CARC[c], i, i + 9));
  return s; };
// --- wide side elevation ---
ENV.brwide = L => { const n = isN(L); let s = brSky(L) + skyline(L, 470, .7, 8) + waterTower(1700, 470, .6, L);
  s += `<rect y="470" width="1920" height="610" fill="${n ? '#0a1220' : '#3e6078'}"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M${rnd(i + 1) * 1900} ${600 + rnd(i + 8) * 460} h${30 + rnd(i + 2) * 90}" stroke="${n ? '#22324e' : '#7aa0ba'}" stroke-width="3"/>`).join('');
  for (const x of [480, 1440]) { s += `<rect x="${x - 40}" y="560" width="80" height="520" fill="${n ? '#2a2e36' : '#7a7e84'}" stroke="${INK}" stroke-width="5"/>` + towerLegs(x, 130, 540, 90, L); }
  s += `<path d="M-200 520 Q20 260 ${480} 140 Q960 520 1440 140 Q1900 260 2120 520" stroke="${n ? '#4a4e56' : '#a0a5ac'}" stroke-width="9" fill="none"/>`;
  for (let k = 0; k < 44; k++) { const xx = 20 + k * 44; let yy; if (xx < 480) { const u = (xx + 200) / 680; yy = 520 - (380) * Math.pow(u, 1.6); } else if (xx < 1440) { const u = (xx - 960) / 480; yy = 140 + 380 * (1 - u * u) * 0 + (520 - 140) * (1 - u * u) * .0 + 140 + (1 - u * u) * 0; yy = 140 + (330) * (1 - u * u); } else { const u = (2120 - xx) / 680; yy = 520 - 380 * Math.pow(u, 1.6); }
    s += `<path d="M${xx} ${yy} V510" stroke="${n ? '#3a3e46' : '#8a8f96'}" stroke-width="2"/>`; }
  s += `<rect x="-20" y="510" width="1960" height="50" fill="${n ? '#3a3e46' : '#8a8f96'}" stroke="${INK}" stroke-width="6"/>`;
  for (let k = 0; k < 70; k++) { const xx = 230 + k * 21 + rnd(k) * 8; if (Math.abs(xx - 960) < 50) continue; s += `<rect x="${xx}" y="${494 - rnd(k + 3) * 4}" width="16" height="12" rx="3" fill="${CARC[k % 8]}" stroke="${INK}" stroke-width="2"/>`; }
  s += `<rect x="925" y="484" width="70" height="24" rx="5" fill="#e3b43a" stroke="${INK}" stroke-width="3"/>`;
  s += crowd(-20, 220, 455, .55, 60, 3, L) + crowd(1700, 1940, 455, .55, 70, 9, L);
  return s; };
// --- bus roof close ---
ENV.busroof = L => { const n = isN(L); let s = brSky(L) + skyline(L, 640, 1.1, 12) + waterTower(1500, 640, 1.15, L);
  s += `<rect y="640" width="1920" height="60" fill="${n ? '#0c1422' : '#4a6a80'}"/>`;
  s += `<path d="M-100 -40 Q900 420 2100 120" stroke="${n ? '#4a4e56' : '#9a9fa6'}" stroke-width="18" fill="none"/>` + Array.from({ length: 9 }, (_, k) => { const xx = 100 + k * 220; return `<path d="M${xx} ${150 + 160 * Math.sin((xx + 100) / 2200 * Math.PI)} V720" stroke="${n ? '#3a3e46' : '#7a7f86'}" stroke-width="6"/>`; }).join('');
  s += `<rect y="700" width="1920" height="30" fill="${n ? '#3a3e46' : '#8a8f96'}" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M-20 800 Q960 760 1940 800 V1100 H-20Z" fill="${n ? '#8a8676' : '#dcd6c4'}" stroke="${INK}" stroke-width="7"/>`;
  s += `<rect x="300" y="860" width="220" height="90" rx="10" fill="${n ? '#6a675a' : '#b9b3a0'}" stroke="${INK}" stroke-width="5"/><rect x="1380" y="850" width="160" height="70" rx="8" fill="${n ? '#5a574c' : '#a9a390'}" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 4 }, (_, k) => `<path d="M${1395} ${865 + k * 14} h130" stroke="#000" opacity=".3" stroke-width="4"/>`).join('');
  s += `<path d="M-20 1040 Q960 1000 1940 1040" stroke="#e3b43a" stroke-width="18" fill="none"/>`;
  return s; };
// --- bus interior ---
ENV.busin = L => { const n = isN(L); let s = `<rect width="1920" height="1080" fill="${n ? '#1a1c22' : '#5a5e66'}"/>`;
  s += `<rect y="240" width="1920" height="340" fill="${n ? '#0c1220' : '#9ab4c6'}"/>`;
  s += `<g opacity=".9">` + [[200, 560, 280, 1], [620, 560, 300, 3], [1100, 560, 260, 0], [1500, 560, 300, 6]].map(([x, y, w, c], i) => car(x, y, w, CARC[c], i % 2, i)).join('') + `</g>` + `<path d="M0 280 Q900 120 1920 300" stroke="#7a7f86" stroke-width="8" fill="none"/>`;
  for (let k = 0; k < 5; k++) s += `<rect x="${k * 400 - 20}" y="230" width="40" height="360" fill="${n ? '#2a2c32' : '#6a6e76'}" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect y="580" width="1920" height="40" fill="${n ? '#2a2c32' : '#6a6e76'}" stroke="${INK}" stroke-width="5"/><rect y="0" width="1920" height="240" fill="${n ? '#24262c' : '#7a7e86'}"/><path d="M0 120 H1920" stroke="#e3b43a" stroke-width="10"/>`;
  for (let k = 0; k < 5; k++) s += `<path d="M${200 + k * 380} 0 V900" stroke="#e3b43a" stroke-width="12"/><path d="M${200 + k * 380} 0 V900" stroke="${INK}" stroke-width="2" opacity=".5"/>`;
  s += `<rect y="900" width="1920" height="180" fill="${n ? '#2a2a2e' : '#4a4a50'}"/><path d="M0 900 H1920" stroke="${INK}" stroke-width="6"/>`;
  for (let k = 0; k < 4; k++) { const x = 60 + k * 420; s += `<path d="M${x} 900 V700 Q${x} 640 ${x + 60} 640 H${x + 200} V900Z" fill="#2f4a7a" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="760" width="260" height="60" rx="14" fill="#3a5a8a" stroke="${INK}" stroke-width="5"/>`; }
  s += `<rect x="1700" y="240" width="220" height="660" fill="#1a1c22" stroke="${INK}" stroke-width="7"/><path d="M1810 250 V890" stroke="${INK}" stroke-width="6"/><rect x="1715" y="260" width="85" height="620" fill="#9ab4c6" opacity=".35"/><rect x="1820" y="260" width="85" height="620" fill="#9ab4c6" opacity=".35"/>`;
  return s; };
// --- end of bridge: barricade + horde ---
ENV.brend = L => { const n = isN(L); let s = brSky(L) + skyline(L, 600, .9, 21);
  s += towerLegs(960, 60, 760, 260, L);
  s += `<rect y="600" width="1920" height="480" fill="${n ? '#24262c' : '#5a5c62'}"/><path d="M0 600 H1920" stroke="${INK}" stroke-width="5"/>`;
  s += crowd(0, 1920, 600, .9, 90, 4, L) + crowd(0, 1920, 650, 1.1, 60, 44, L);
  s += `<rect x="100" y="640" width="320" height="140" fill="#4a5a3a" stroke="${INK}" stroke-width="6"/><rect x="420" y="680" width="120" height="100" fill="#3e4a30" stroke="${INK}" stroke-width="6"/>` + C(170, 790, 32, '#1d1d21', 6) + C(470, 790, 32, '#1d1d21', 6);
  for (let k = 0; k < 9; k++) { const x = 560 + k * 150; s += `<path d="M${x} 860 L${x + 20} 760 L${x + 110} 760 L${x + 130} 860Z" fill="${n ? '#7a7870' : '#c9c4b4'}" stroke="${INK}" stroke-width="6" transform="rotate(${(rnd(k) - .5) * (k % 3 === 1 ? 24 : 6)} ${x + 65} 860)"/>`; }
  for (let k = 0; k < 10; k++) s += `<ellipse cx="${1300 + (k % 5) * 70}" cy="${880 - Math.floor(k / 5) * 34}" rx="38" ry="20" fill="#8a7a52" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="700" y="560" width="520" height="70" fill="#d9c43a" stroke="${INK}" stroke-width="5"/>` + T(960, 608, 34, 'QUARANTINE · NO CROSSING', '#1a1a1a', 900);
  return s; };
// --- looking down over the railing at a pillar + water ---
ENV.brdown = L => { const n = isN(L); let s = `<rect width="1920" height="1080" fill="${n ? '#060a14' : '#3e6078'}"/>`;
  for (let i = 0; i < 70; i++) s += `<path d="M${rnd(i + 4) * 1900} ${rnd(i + 40) * 1080} q40 -8 80 0" stroke="${n ? '#1a2a44' : '#8ab0c8'}" stroke-width="4" fill="none" opacity=".7"/>`;
  for (const [x, w] of [[220, 160], [1700, 160]]) s += `<rect x="${x - w / 2}" y="240" width="${w}" height="840" fill="${n ? '#1a1c22' : '#6a6e74'}" stroke="${INK}" stroke-width="5" opacity=".85"/>`;
  s += `<rect x="700" y="160" width="520" height="920" fill="${n ? '#2a2c32' : '#8a8e94'}" stroke="${INK}" stroke-width="7"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${720 + rnd(i) * 480}" cy="${200 + rnd(i + 30) * 860}" r="${3 + rnd(i + 3) * 5}" fill="#000" opacity=".2"/>`).join('');
  s += `<path d="M700 1000 Q960 960 1220 1000" stroke="#fff" stroke-width="5" fill="none" opacity=".3"/>`;
  s += `<rect y="0" width="1920" height="180" fill="${n ? '#24262c' : '#5a5c62'}"/><rect y="150" width="1920" height="34" fill="${n ? '#3a3e46' : '#8a8f96'}" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 24 }, (_, i) => `<rect x="${i * 84}" y="60" width="16" height="96" fill="${n ? '#3a3e46' : '#8a8f96'}" stroke="${INK}" stroke-width="4"/>`).join('') + `<rect y="46" width="1920" height="22" fill="${n ? '#4a4e56' : '#9a9fa6'}" stroke="${INK}" stroke-width="5"/>`;
  return s; };
// --- demolition charge close-up ---
ENV.charge = L => { let s = `<rect width="1920" height="1080" fill="${isN(L) ? '#2a2c32' : '#8a8e94'}"/>` + Array.from({ length: 60 }, (_, i) => `<circle cx="${rnd(i) * 1920}" cy="${rnd(i + 60) * 1080}" r="${3 + rnd(i + 3) * 8}" fill="#000" opacity=".18"/>`).join('');
  s += `<path d="M0 300 H1920 M0 780 H1920" stroke="#2a2a2a" stroke-width="30"/><path d="M0 300 H1920 M0 780 H1920" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="560" y="300" width="800" height="480" rx="20" fill="#5a5e52" stroke="${INK}" stroke-width="9"/><rect x="620" y="360" width="440" height="120" fill="#e0b030" stroke="${INK}" stroke-width="5"/>` + T(840, 405, 34, 'DANGER', '#1a1a1a', 900) + T(840, 455, 30, 'EXPLOSIVE · DO NOT TOUCH', '#1a1a1a', 800);
  s += `<rect x="1120" y="360" width="180" height="120" rx="10" fill="#14161a" stroke="${INK}" stroke-width="5"/><path d="M640 560 C760 700 900 520 1300 650 M640 600 C800 760 1000 560 1300 700" stroke="#c33a2f" stroke-width="10" fill="none"/><path d="M640 640 C760 740 940 640 1300 740" stroke="#3a6a9a" stroke-width="10" fill="none"/>`;
  return s; };
// --- the day before: apartment with TV ---
ENV.home = L => { let s = `<rect width="1920" height="1080" fill="#6a5a6a"/><rect y="0" width="1920" height="820" fill="#7a6a72"/>` + Array.from({ length: 24 }, (_, i) => `<path d="M${i * 80} 0 V820" stroke="#6a5a62" stroke-width="20" opacity=".5"/>`).join('');
  s += `<rect x="1180" y="140" width="560" height="420" fill="#2a2840" stroke="${INK}" stroke-width="10"/><svg x="1180" y="140" width="560" height="420" viewBox="0 0 1920 1080">${brSky('brdusk')}${skyline('brdusk', 900, 1.6, 5, 0)}</svg><path d="M1460 140 V560 M1180 350 H1740" stroke="${INK}" stroke-width="8"/>`;
  s += `<rect y="820" width="1920" height="260" fill="#6a4a32"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${i * 140} 820 V1080" stroke="#4a3220" stroke-width="4"/>`).join('') + P('M0 820 H1920', 'none', 6);
  s += `<rect x="160" y="700" width="560" height="120" fill="#4a3a2a" stroke="${INK}" stroke-width="6"/><rect x="180" y="330" width="520" height="340" rx="10" fill="#14161a" stroke="${INK}" stroke-width="9"/><rect x="200" y="350" width="480" height="300" fill="#1a2a3a"/><path d="M440 670 v30" stroke="${INK}" stroke-width="12"/>`;
  s += `<path d="M900 820 V700 Q900 640 960 640 H1500 Q1560 640 1560 700 V820Z" fill="#3a5a6a" stroke="${INK}" stroke-width="7"/><rect x="880" y="720" width="700" height="80" rx="20" fill="#4a6a7a" stroke="${INK}" stroke-width="6"/>`;
  return s; };
