// ================= Dray x finance — documentary kit =================
// Characters: 'suit' (dark suit + tie; v: 0 black hair, 1 grey hair, 2 bald, 3 glasses+brown hair, 4 woman bob),
//             'worker' (shirt + lanyard), plus engine kinds (pax, you, dan, mic, doctor...).
// Envs: office wallst tradefloor boardroom court bankext vault tvstudio skyline yacht prison desk home(engine)
// Cards: chart bignum headline timeline quote compare chapter flow facts sources title day blackend
const FC = { navy: '#1d2a44', gold: '#e0b030', green: '#2f9e5b', red: '#c8392f', paper: '#efe8d8', ink: INK };
const _torsoF = torso, _hatF = hat;
torso = function (kind, v, ps) {
  const n = ps.neck, h = ps.hip;
  if (kind === 'suit') { const col = ['#22252c', '#2c3446', '#3a2f2a', '#1d2a44', '#3c2238'][v % 5];
    return P(`M${n[0] - 32} ${n[1] + 2} L${n[0] + 32} ${n[1] + 2} L${h[0] + 32} ${h[1] + 14} L${h[0] - 32} ${h[1] + 14}Z`, col, 5)
      + `<path d="M${n[0] - 14} ${n[1] + 3} L${n[0]} ${n[1] + 34} L${n[0] + 14} ${n[1] + 3}Z" fill="#f2f0ea" stroke="${INK}" stroke-width="3"/>`
      + (v === 4 ? '' : `<path d="M${n[0]} ${n[1] + 8} l-6 10 l6 30 l6 -30Z" fill="${['#a83a2f', '#c9a03a', '#2f6fb5', '#a83a2f'][v % 4]}" stroke="${INK}" stroke-width="2"/>`)
      + `<path d="M${n[0] - 14} ${n[1] + 3} L${n[0] - 4} ${n[1] + 46} M${n[0] + 14} ${n[1] + 3} L${n[0] + 4} ${n[1] + 46}" stroke="#111" stroke-width="3"/>`; }
  if (kind === 'worker') return P(`M${n[0] - 30} ${n[1] + 2} L${n[0] + 30} ${n[1] + 2} L${h[0] + 30} ${h[1] + 12} L${h[0] - 30} ${h[1] + 12}Z`, ['#7a9ac0', '#d9d4c7', '#8aa070'][v % 3], 5)
      + `<path d="M${n[0] - 10} ${n[1] + 4} L${n[0]} ${n[1] + 40} L${n[0] + 10} ${n[1] + 4}" stroke="#2f6fb5" stroke-width="3" fill="none"/><rect x="${n[0] - 9}" y="${n[1] + 38}" width="18" height="24" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  return _torsoF(kind, v, ps); };
hat = function (kind, v, e) {
  if (kind === 'suit') { v = v % 5;
    if (v === 2) return `<path d="M-52 4 Q-58 -14 -50 -24 M52 4 Q58 -14 50 -24" stroke="#8a8a8a" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    const col = ['#1c1c1c', '#b9b9bd', '', '#5a3a22', '#2a1a12'][v];
    let s = `<path d="M-54 -12 Q-54 -64 0 -64 Q54 -64 54 -12 Q36 -44 0 -46 Q-28 -46 -40 -30 Q-46 -22 -54 -12Z" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    if (v === 4) s += `<path d="M-54 -20 Q-66 30 -44 50 M54 -20 Q66 30 44 50" stroke="${col}" stroke-width="20" fill="none" stroke-linecap="round"/>`;
    if (v === 3) s += `<g fill="none" stroke="#111" stroke-width="4"><rect x="-38" y="-14" width="28" height="20" rx="5"/><rect x="10" y="-14" width="28" height="20" rx="5"/><path d="M-10 -6 h20"/></g>`;
    return s; }
  if (kind === 'worker') return `<path d="M-54 -12 Q-54 -64 0 -64 Q54 -64 54 -12 Q36 -44 0 -46 Q-36 -44 -54 -12Z" fill="${['#3a2a1a', '#1c1c1c', '#7a4a2a'][v % 3]}" stroke="${INK}" stroke-width="5"/>`;
  return _hatF(kind, v, e); };
// ---------- helpers ----------
const fmtMoney = (v, cur = '$') => { const a = Math.abs(v); if (a >= 1e9) return cur + (v / 1e9).toFixed(v % 1e9 === 0 || a >= 1e11 ? 0 : 1) + 'B'; if (a >= 1e6) return cur + (v / 1e6).toFixed(a >= 1e8 ? 0 : 1) + 'M'; if (a >= 1e3) return cur + Math.round(v).toLocaleString('en-US'); return cur + (Math.round(v * 100) / 100); };
const grad = (id, a, b, vert = 1) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${vert ? 0 : 1}" y2="${vert ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
const isNF = L => /night|dark|red|dim|bnight|brnight/.test(L || '');
let _fg = 0;
function fSky(L) { const id = 'fs' + (_fg++); const n = isNF(L); return grad(id, n ? '#0b1022' : '#8fb4d6', n ? '#24304a' : '#e3e6dc') + `<rect width="1920" height="1080" fill="url(#${id})"/>`; }
function towers(L, y0, sc = 1, seed = 3) { let s = ''; const n = isNF(L);
  for (let i = 0; i < 18; i++) { const w = (80 + rnd(seed + i) * 90) * sc, h = (180 + rnd(seed + i + 40) * 420) * sc, x = i * 115 * sc - 40;
    s += `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h}" fill="${n ? '#161c2a' : ['#6c7a8e', '#7d8aa0', '#5d6a80'][i % 3]}" stroke="${INK}" stroke-width="4"/>`;
    for (let k = 0; k < Math.floor(h / (34 * sc)); k++) for (let j = 0; j < 3; j++) if (rnd(seed * 7 + i * 13 + k * 3 + j) > (n ? .7 : .35)) s += `<rect x="${x + 10 * sc + j * (w - 20 * sc) / 3}" y="${y0 - h + 14 * sc + k * 34 * sc}" width="${(w - 20 * sc) / 3 - 8 * sc}" height="${14 * sc}" fill="${n ? '#e8c26a' : '#b9cde0'}" opacity=".85"/>`; }
  return s; }
function desk(x, y, w = 520) { return `<rect x="${x - w / 2}" y="${y}" width="${w}" height="34" fill="#6a4a32" stroke="${INK}" stroke-width="6"/><rect x="${x - w / 2 + 20}" y="${y + 34}" width="30" height="160" fill="#5a3e2a" stroke="${INK}" stroke-width="5"/><rect x="${x + w / 2 - 50}" y="${y + 34}" width="30" height="160" fill="#5a3e2a" stroke="${INK}" stroke-width="5"/>`; }
function monitor(x, y, up = 1, sc = 1) { const c = up ? FC.green : FC.red; return `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-90" y="-120" width="180" height="110" rx="8" fill="#111" stroke="${INK}" stroke-width="6"/><path d="M-70 -30 L-30 ${up ? -50 : -80} L0 ${up ? -60 : -50} L30 ${up ? -90 : -60} L70 ${up ? -105 : -30}" stroke="${c}" stroke-width="7" fill="none"/><rect x="-10" y="-10" width="20" height="20" fill="#333"/><rect x="-40" y="8" width="80" height="10" fill="#333" stroke="${INK}" stroke-width="3"/></g>`; }
function columns(x0, x1, y0, y1, n = 6, col = '#e7e1d2') { let s = `<path d="M${x0 - 40} ${y0} L${(x0 + x1) / 2} ${y0 - 150} L${x1 + 40} ${y0}Z" fill="${col}" stroke="${INK}" stroke-width="7"/><rect x="${x0 - 40}" y="${y0}" width="${x1 - x0 + 80}" height="50" fill="${col}" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < n; i++) { const x = x0 + i * (x1 - x0) / (n - 1); s += `<rect x="${x - 26}" y="${y0 + 50}" width="52" height="${y1 - y0 - 50}" fill="${col}" stroke="${INK}" stroke-width="6"/><path d="M${x - 10} ${y0 + 60} V${y1 - 10} M${x + 10} ${y0 + 60} V${y1 - 10}" stroke="#bdb5a2" stroke-width="4"/>`; }
  return s + `<rect x="${x0 - 60}" y="${y1}" width="${x1 - x0 + 120}" height="40" fill="${col}" stroke="${INK}" stroke-width="7"/>`; }
function goldbar(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 0 L-36 -30 L36 -30 L50 0Z" fill="#e0b030" stroke="${INK}" stroke-width="5"/><path d="M-30 -24 L30 -24" stroke="#fff3b0" stroke-width="4"/></g>`; }
function cash(x, y, s = 1, r = 0) { return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-60" y="-28" width="120" height="56" rx="4" fill="#7cbf7a" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="0" r="16" fill="#a9dca6" stroke="#2f6a2e" stroke-width="3"/><text x="0" y="8" font-size="22" font-weight="900" text-anchor="middle" fill="#2f6a2e" font-family="DejaVu Sans">$</text></g>`; }
// ---------- environments ----------
ENV.office = L => { const n = isNF(L); let s = `<rect width="1920" height="1080" fill="${n ? '#1e2230' : '#cfd3d6'}"/>`;
  s += `<rect x="80" y="80" width="1760" height="620" fill="${n ? '#0b1022' : '#9cc0dc'}" stroke="${INK}" stroke-width="8"/><svg x="80" y="80" width="1760" height="620" viewBox="0 0 1760 620">${towers(L, 640, .9, 11)}</svg>`;
  for (let i = 0; i < 5; i++) s += `<rect x="${80 + i * 440 - 8}" y="80" width="16" height="620" fill="#5a5e66" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect y="700" width="1920" height="380" fill="${n ? '#2a2a30' : '#7a6a5a'}"/><path d="M0 700 H1920" stroke="${INK}" stroke-width="7"/>` + desk(960, 760, 760) + monitor(820, 760, 1) + monitor(1100, 760, 1);
  s += `<path d="M1600 760 q-10 -120 40 -200 q30 60 10 200Z" fill="#4a7a3a" stroke="${INK}" stroke-width="5"/><rect x="1590" y="760" width="80" height="90" fill="#8a5a3a" stroke="${INK}" stroke-width="5"/>`;
  return s; };
ENV.wallst = L => { const n = isNF(L); let s = fSky(L) + towers(L, 880, 1, 5);
  s += columns(560, 1360, 360, 840, 6, n ? '#9a958a' : '#e7e1d2') + T(960, 340, 46, 'STOCK EXCHANGE', '#222', 900, 'middle', 'letter-spacing="6"');
  for (const x of [470, 1450]) s += `<path d="M${x} 840 V420" stroke="#555" stroke-width="8"/><path d="M${x} 430 h110 v70 h-110Z" fill="#2f4a8a" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect y="880" width="1920" height="200" fill="${n ? '#2a2a2e' : '#8a8680'}"/><path d="M0 880 H1920" stroke="${INK}" stroke-width="7"/>`;
  return s; };
ENV.tradefloor = L => { let s = `<rect width="1920" height="1080" fill="#1b1f2a"/>`;
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const x = 40 + i * 310, y = 80 + r * 230, up = rnd(i + r * 9) > .45;
    s += `<rect x="${x}" y="${y}" width="290" height="200" fill="#0a0d14" stroke="#3a4050" stroke-width="6"/>` + TM(x + 16, y + 40, 26, ['AAPL', 'BANK', 'GOLD', 'OIL', 'EUR', 'DAX', 'TECH', 'BOND', 'FX', 'NDX', 'SPX', 'FUND'][r * 6 + i], '#cfd6e2', 900) + TM(x + 274, y + 40, 26, (up ? '+' : '−') + (1 + rnd(i * 3 + r) * 9).toFixed(1) + '%', up ? '#3ad07a' : '#ff5a4a', 900, 'end')
      + `<path d="M${x + 16} ${y + 170} L${x + 80} ${y + (up ? 140 : 110)} L${x + 150} ${y + (up ? 120 : 150)} L${x + 210} ${y + (up ? 90 : 160)} L${x + 274} ${y + (up ? 70 : 180)}" stroke="${up ? '#3ad07a' : '#ff5a4a'}" stroke-width="6" fill="none"/>`; }
  s += `<rect y="560" width="1920" height="40" fill="#111"/><rect y="760" width="1920" height="320" fill="#2a2d36"/><path d="M0 760 H1920" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 4; i++) s += desk(240 + i * 480, 800, 380) + monitor(240 + i * 480 - 80, 800, i % 2, .8) + monitor(240 + i * 480 + 80, 800, (i + 1) % 2, .8);
  return s; };
ENV.boardroom = L => { let s = `<rect width="1920" height="1080" fill="#5a4a42"/>` + Array.from({ length: 20 }, (_, i) => `<path d="M${i * 100} 0 V760" stroke="#4e4038" stroke-width="30"/>`).join('');
  s += `<rect x="560" y="90" width="800" height="440" fill="#0e1320" stroke="${INK}" stroke-width="10"/><path d="M620 470 L760 400 L900 420 L1040 300 L1180 250 L1300 150" stroke="${FC.green}" stroke-width="12" fill="none"/>`;
  s += `<rect y="760" width="1920" height="320" fill="#3a2e28"/><path d="M200 800 L1720 800 L1880 1080 L40 1080Z" fill="#6a4a32" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${250 + i * 260}" y="660" width="120" height="150" rx="14" fill="#1f2430" stroke="${INK}" stroke-width="5"/>`;
  return s; };
ENV.court = L => { let s = `<rect width="1920" height="1080" fill="#7a5a40"/>` + Array.from({ length: 16 }, (_, i) => `<rect x="${i * 120}" y="0" width="110" height="720" fill="#6e5038" stroke="#5a4030" stroke-width="4"/>`).join('');
  s += `<rect x="560" y="300" width="800" height="300" fill="#5a3a24" stroke="${INK}" stroke-width="8"/><rect x="520" y="280" width="880" height="40" fill="#4a2e1c" stroke="${INK}" stroke-width="6"/>`;
  s += `<circle cx="960" cy="160" r="90" fill="#c9a03a" stroke="${INK}" stroke-width="7"/><path d="M960 100 V220 M900 140 H1020 M900 140 l-20 50 h40Z M1020 140 l-20 50 h40Z" stroke="${INK}" stroke-width="6" fill="#e0c060"/>`;
  s += `<path d="M300 720 V300 M1620 720 V300" stroke="#555" stroke-width="8"/><path d="M300 310 h90 v60 h-90Z" fill="#2f4a8a" stroke="${INK}" stroke-width="4"/><path d="M1620 310 h90 v60 h-90Z" fill="#c8392f" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect y="720" width="1920" height="360" fill="#4a3424"/><path d="M0 720 H1920" stroke="${INK}" stroke-width="7"/><rect x="100" y="820" width="600" height="60" fill="#5a3a24" stroke="${INK}" stroke-width="6"/><rect x="1220" y="820" width="600" height="60" fill="#5a3a24" stroke="${INK}" stroke-width="6"/>`;
  return s; };
ENV.bankext = L => { const n = isNF(L); let s = fSky(L) + towers(L, 900, .8, 21);
  s += `<rect x="360" y="300" width="1200" height="600" fill="${n ? '#8a8578' : '#ddd5c2'}" stroke="${INK}" stroke-width="8"/>` + columns(480, 1440, 320, 860, 7, n ? '#9a958a' : '#eee8da');
  s += T(960, 300, 64, 'BANK', '#222', 900, 'middle', 'letter-spacing="20"') + `<rect x="880" y="700" width="160" height="200" fill="#3a2a1a" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect y="900" width="1920" height="180" fill="${n ? '#2a2a2e' : '#8a8680'}"/><path d="M0 900 H1920" stroke="${INK}" stroke-width="7"/>`;
  return s; };
ENV.vault = L => { let s = `<rect width="1920" height="1080" fill="#3a3d44"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 90} H1920" stroke="#33363c" stroke-width="6"/>`).join('');
  s += `<circle cx="300" cy="460" r="260" fill="#8a8f96" stroke="${INK}" stroke-width="10"/><circle cx="300" cy="460" r="200" fill="#a0a5ac" stroke="${INK}" stroke-width="6"/><path d="M300 300 V620 M140 460 H460 M187 347 L413 573 M413 347 L187 573" stroke="#6a6e74" stroke-width="16"/><circle cx="300" cy="460" r="40" fill="#5a5e66" stroke="${INK}" stroke-width="6"/>`;
  for (let r = 0; r < 5; r++) for (let i = 0; i < 6 - (r % 2); i++) s += goldbar(860 + i * 110 + (r % 2) * 55, 900 - r * 34, 1);
  for (let i = 0; i < 9; i++) s += cash(1500 + (i % 3) * 120, 900 - Math.floor(i / 3) * 60, 1, (rnd(i) - .5) * 20);
  s += `<rect y="900" width="1920" height="180" fill="#2a2c30"/><path d="M0 900 H1920" stroke="${INK}" stroke-width="7"/>`;
  return s; };
ENV.tvstudio = L => { let s = `<rect width="1920" height="1080" fill="#14213a"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${rnd(i) * 1920}" cy="${rnd(i + 30) * 600}" r="${3 + rnd(i + 5) * 6}" fill="#4a6aa0" opacity=".5"/>`).join('');
  s += `<rect x="1100" y="120" width="680" height="400" fill="#0a0d14" stroke="#3a4a6a" stroke-width="8"/><path d="M1140 460 L1280 380 L1400 410 L1520 260 L1740 180" stroke="${FC.red}" stroke-width="10" fill="none"/>`;
  s += `<path d="M300 700 L1620 700 L1560 1080 L360 1080Z" fill="#c8392f" stroke="${INK}" stroke-width="7"/><rect x="300" y="680" width="1320" height="40" fill="#eee" stroke="${INK}" stroke-width="6"/>`;
  return s; };
ENV.skyline = L => { const n = isNF(L); let s = fSky(L); if (n) s += Array.from({ length: 60 }, (_, i) => `<circle cx="${rnd(i + 3) * 1920}" cy="${rnd(i + 90) * 400}" r="${1 + rnd(i) * 2}" fill="#fff" opacity=".6"/>`).join('');
  s += towers(L, 1080, 1.4, 31); return s; };
ENV.yacht = L => { let s = fSky(L) + `<circle cx="1550" cy="220" r="90" fill="#ffe08a"/><rect y="640" width="1920" height="440" fill="#2f7fb0"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M${rnd(i) * 1900} ${680 + rnd(i + 4) * 380} q30 -10 60 0" stroke="#8fd0f0" stroke-width="4" fill="none"/>`).join('');
  s += `<path d="M340 640 L1580 640 L1460 800 L420 800Z" fill="#f4f4f0" stroke="${INK}" stroke-width="8"/><path d="M560 640 L640 520 L1240 520 L1320 640Z" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M760 520 L820 440 L1100 440 L1140 520Z" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${680 + i * 90}" y="555" width="60" height="40" rx="6" fill="#2a3a5a" stroke="${INK}" stroke-width="3"/>`;
  s += `<path d="M420 760 H1460" stroke="#1d2a44" stroke-width="10"/>`; return s; };
ENV.prison = L => { let s = `<rect width="1920" height="1080" fill="#5a5e62"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 110 + 40} H1920" stroke="#4e5256" stroke-width="5"/>`).join('');
  s += `<rect x="1200" y="160" width="220" height="140" fill="#9cc0dc" stroke="${INK}" stroke-width="7"/>` + [1240, 1290, 1340, 1390].map(x => `<path d="M${x} 160 V300" stroke="#333" stroke-width="8"/>`).join('');
  s += `<rect x="200" y="640" width="500" height="80" fill="#8a8f96" stroke="${INK}" stroke-width="6"/><rect y="820" width="1920" height="260" fill="#44484c"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="7"/>`;
  return s; };
ENV.desk = L => { let s = `<rect width="1920" height="1080" fill="#6a4a32"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 95} H1920" stroke="#5a3e2a" stroke-width="5"/>`).join('');
  s += `<g transform="rotate(-6 700 540)"><rect x="380" y="180" width="640" height="760" fill="${FC.paper}" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 16 }, (_, i) => `<rect x="440" y="${300 + i * 36}" width="${300 + rnd(i) * 220}" height="12" fill="#b9b1a0"/>`).join('') + T(700, 260, 44, 'BALANCE SHEET', '#222', 900) + `</g>`;
  s += `<g transform="rotate(5 1350 560)"><rect x="1080" y="260" width="560" height="640" fill="#f6f2e6" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="1130" y="${360 + i * 40}" width="${200 + rnd(i + 9) * 240}" height="12" fill="#c0b8a6"/>`).join('') + `</g>`;
  s += `<path d="M1500 960 L1760 700" stroke="#222" stroke-width="18" stroke-linecap="round"/><path d="M1760 700 L1790 670" stroke="#c9a03a" stroke-width="18" stroke-linecap="round"/>`;
  return s; };
// ---------- cards ----------
const _cardFin = cardSVG;
cardSVG = function (c, p, t, dur) { const q = k => clamp((p - k) * 4, 0, 1);
  const bg = (d = 0) => `<rect width="1920" height="1080" fill="${d ? '#10151f' : CREAM}"/>`;
  if (c.t === 'chapter') return `<rect width="1920" height="1080" fill="#0b0d12"/>` + T(960, 470, 54, 'CHAPTER ' + c.n, FC.gold, 900, 'middle', `letter-spacing="10" opacity="${q(0)}"`) + T(960, 600, 110, c.a, '#fff', 900, 'middle', `opacity="${q(.1)}"`) + `<rect x="${960 - 300 * ease(q(.05))}" y="640" width="${600 * ease(q(.05))}" height="8" fill="${FC.gold}"/>`;
  if (c.t === 'bignum') { const v = c.v * ease(clamp(p * 1.6, 0, 1)); return bg(1) + T(960, 380, 50, c.label || '', '#cfd6e2', 900, 'middle', 'letter-spacing="6"') + T(960, 600, 200, c.fmt === 'raw' ? Math.round(v).toLocaleString('en-US') + (c.suf || '') : fmtMoney(v, c.cur || '$') + (c.suf || ''), c.color || FC.gold, 900, 'middle', `stroke="#000" stroke-width="6" paint-order="stroke"`) + T(960, 730, 44, c.sub || '', '#9aa6b8', 700, 'middle', `opacity="${q(.3)}"`); }
  if (c.t === 'headline') { const r = c.rot != null ? c.rot : -3, sc = .85 + .15 * ease(clamp(p * 3, 0, 1)); return `<rect width="1920" height="1080" fill="#2a2a2e"/><g transform="translate(960 540) rotate(${r}) scale(${sc}) translate(-960 -540)"><rect x="360" y="90" width="1200" height="900" fill="${FC.paper}" stroke="${INK}" stroke-width="6"/>` + T(960, 190, 70, c.paper || 'THE DAILY LEDGER', '#111', 900, 'middle', 'font-family="DejaVu Serif" letter-spacing="4"') + `<path d="M400 220 H1520 M400 232 H1520" stroke="#111" stroke-width="4"/>` + T(960, 268, 28, c.date || '', '#333', 700) + wrapT(c.h, 960, 370, 72, 22, '#111', 900, 'DejaVu Serif') + T(960, 640, 38, c.sub || '', '#333', 700, 'middle', 'font-style="italic"') + Array.from({ length: 8 }, (_, i) => `<rect x="${420 + (i % 2) * 560}" y="${700 + Math.floor(i / 2) * 60}" width="500" height="14" fill="#b9b1a0"/>`).join('') + `</g>`; }
  if (c.t === 'timeline') { const it = c.items, n = it.length, x0 = 200, x1 = 1720; let s = bg() + T(960, 170, 58, c.title || 'TIMELINE', '#222', 900, 'middle', 'letter-spacing="4"') + `<path d="M${x0} 540 H${x0 + (x1 - x0) * ease(clamp(p * 2, 0, 1))}" stroke="#222" stroke-width="10"/>`;
    it.forEach(([y, l], i) => { const x = x0 + i * (x1 - x0) / Math.max(1, n - 1), qq = clamp(p * 2 * n / 1.2 - i * .9, 0, 1), hi = c.hi === i; if (qq <= 0) return;
      s += `<g opacity="${qq}"><circle cx="${x}" cy="540" r="${hi ? 30 : 20}" fill="${hi ? FC.red : '#222'}" stroke="${INK}" stroke-width="5"/>` + T(x, i % 2 ? 640 : 470, 50, y, hi ? FC.red : '#222', 900) + wrapT(l, x, i % 2 ? 700 : 380, 32, 16, '#444', 700, null, i % 2 ? 1 : -1) + `</g>`; });
    return s; }
  if (c.t === 'quote') return bg(1) + T(260, 380, 260, '“', FC.gold, 900, 'middle', `opacity=".9"`) + wrapT(c.q, 960, 500, 76, 30, '#fff', 800) + T(1700, 860, 40, c.who || '', '#9aa6b8', 700, 'end', `opacity="${q(.3)}"`);
  if (c.t === 'chart') { const pts = c.pts, n = pts.length, vals = pts.map(a => a[1]), mx = c.max || Math.max(...vals) * 1.12, mn = c.min != null ? c.min : 0, X = i => 260 + i * (1400 / Math.max(1, n - 1)), Y = v => 880 - (v - mn) / (mx - mn) * 560, k = ease(clamp(p * 1.4, 0, 1)) * (n - 1);
    let s = bg() + T(960, 150, 56, c.title, '#222', 900) + `<path d="M240 300 V880 H1700" stroke="#888" stroke-width="5" fill="none"/>`; let d = '', last = [X(0), Y(vals[0])];
    for (let i = 0; i <= Math.floor(k); i++) { d += (i ? 'L' : 'M') + X(i) + ' ' + Y(vals[i]); last = [X(i), Y(vals[i])]; }
    if (k % 1 > 0 && k < n - 1) { const i = Math.floor(k), f = k - i, xx = X(i) + (X(i + 1) - X(i)) * f, yy = Y(vals[i]) + (Y(vals[i + 1]) - Y(vals[i])) * f; d += `L${xx} ${yy}`; last = [xx, yy]; }
    const col = c.color === 'down' ? FC.red : c.color === 'up' ? FC.green : (vals[n - 1] < vals[0] ? FC.red : FC.green);
    s += `<path d="${d}" stroke="${col}" stroke-width="12" fill="none" stroke-linejoin="round"/>` + `<circle cx="${last[0]}" cy="${last[1]}" r="16" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    pts.forEach(([l, v], i) => { if (i > k + .01) return; s += T(X(i), 930, 30, l, '#444', 800) + (c.labels !== false ? T(X(i), Y(v) - 30, 32, (c.fmt === 'raw' ? v + (c.unit || '') : fmtMoney(v, c.cur || '€')), '#222', 900) : ''); });
    if (c.note) s += T(960, 1020, 38, c.note, FC.red, 900, 'middle', `opacity="${q(.6)}"`); return s; }
  if (c.t === 'compare') { const mx = Math.max(c.a[1], c.b[1]), H = 520; let s = bg() + T(960, 160, 56, c.title, '#222', 900);
    [[c.a, 620, FC.navy], [c.b, 1300, c.bcol || FC.red]].forEach(([[l, v], x, col], i) => { const h = H * v / mx * ease(clamp(p * 2 - i * .3, 0, 1)); s += `<rect x="${x - 120}" y="${880 - h}" width="240" height="${h}" fill="${col}" stroke="${INK}" stroke-width="6"/>` + T(x, 940, 40, l, '#222', 900) + T(x, 860 - h, 56, c.fmt === 'raw' ? v.toLocaleString('en-US') + (c.unit || '') : fmtMoney(v, c.cur || '€'), '#222', 900); });
    if (c.note) s += T(960, 1030, 36, c.note, '#666', 700, 'middle', `opacity="${q(.5)}"`); return s; }
  if (c.t === 'flow') { const nd = c.nodes, n = nd.length; let s = bg() + T(960, 170, 54, c.title || '', '#222', 900);
    nd.forEach((l, i) => { const x = 260 + i * (1400 / Math.max(1, n - 1)), qq = clamp(p * (n + 1) * .8 - i, 0, 1); if (qq <= 0) return;
      s += `<g opacity="${qq}"><rect x="${x - 150}" y="460" width="300" height="160" rx="18" fill="${i === n - 1 && c.endRed ? '#f6d6d2' : '#fff'}" stroke="${INK}" stroke-width="6"/>` + wrapT(l, x, 535, 36, 14, '#222', 900) + `</g>`;
      if (i < n - 1 && qq >= 1) { const x2 = 260 + (i + 1) * (1400 / Math.max(1, n - 1)); s += `<path d="M${x + 160} 540 H${x2 - 170}" stroke="${FC.gold}" stroke-width="12"/><path d="M${x2 - 190} 518 L${x2 - 160} 540 L${x2 - 190} 562Z" fill="${FC.gold}"/>` + cash((x + x2) / 2, 470 - 10 * Math.sin(t * 4 + i), .6, 0); } });
    if (c.note) s += T(960, 800, 40, c.note, FC.red, 900, 'middle', `opacity="${q(.6)}"`); return s; }
  if (c.t === 'facts') { let s = bg() + T(960, 170, 58, c.title, '#222', 900, 'middle', 'letter-spacing="3"');
    c.rows.forEach(([a, b], i) => { const qq = clamp(p * (c.rows.length + 1) * .9 - i, 0, 1); if (qq <= 0) return; const y = 340 + i * 150;
      s += `<g opacity="${qq}"><rect x="300" y="${y - 70}" width="1320" height="120" rx="16" fill="#fff" stroke="${INK}" stroke-width="5"/>` + T(360, y + 12, 54, a, FC.red, 900, 'start') + T(1580, y + 12, 40, b, '#222', 800, 'end') + `</g>`; });
    return s; }
  if (c.t === 'sources') { let s = bg(1) + T(960, 160, 54, 'SOURCES', '#fff', 900, 'middle', 'letter-spacing="8"'); (c.lines || []).forEach((l, i) => s += T(960, 280 + i * 62, 32, l, '#cfd6e2', 700)); return s; }
  return _cardFin(c, p, t, dur); };
function wrapT(txt, x, y, size, maxc, fill, w, fam, dir = 1) { const words = String(txt || '').split(' '); const lines = []; let cur = '';
  for (const wd of words) { if ((cur + ' ' + wd).trim().length > maxc && cur) { lines.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); } if (cur) lines.push(cur);
  const lh = size * 1.18, y0 = dir < 0 ? y - (lines.length - 1) * lh : y;
  return lines.map((l, i) => T(x, y0 + i * lh, size, l, fill, w, 'middle', fam ? `font-family="${fam}"` : '')).join(''); }
// ---------- fx ----------
const _fxFin = fxSVG;
fxSVG = function (shot, lt, p, t, front) { const f = shot.fx || []; const has = k => f.includes(k); let s = _fxFin(shot, lt, p, t, front);
  if (!front) {
    if (has('moneyrain')) for (let k = 0; k < 26; k++) { const x = (rnd(k) * 2000 + Math.sin(t + k) * 40) % 2000 - 40, y = (rnd(k + 5) * 1200 + t * 160 + k * 40) % 1200 - 100; s += cash(x, y, .7, (t * 60 + k * 30) % 360); }
    if (has('crowdq')) for (let k = 0; k < 14; k++) s += figure({ k: 'pax', v: k, x: 80 + k * 125, y: 1050, s: .75, p: 'stand', f: k % 2, e: 'fear' }, t + k, lt, shot.light);
    if (has('redtick')) { const y = 1000; s += `<rect y="${y}" width="1920" height="80" fill="#111"/>` + Array.from({ length: 8 }, (_, k) => TM(((k * 300 - t * 200) % 2400 + 2400) % 2400 - 300, y + 54, 36, ['WDI −98%', 'DAX −2.1%', 'BANK −7%', 'FUND −12%'][k % 4], '#ff5a4a', 900)).join(''); }
    if (has('greentick')) { const y = 1000; s += `<rect y="${y}" width="1920" height="80" fill="#111"/>` + Array.from({ length: 8 }, (_, k) => TM(((k * 300 - t * 200) % 2400 + 2400) % 2400 - 300, y + 54, 36, ['WDI +4.2%', 'DAX +1.1%', 'TECH +3%', 'PAY +6%'][k % 4], '#3ad07a', 900)).join(''); }
    if (has('flashbulbs')) { if (Math.floor(t * 7) % 5 === 0) s += `<rect width="1920" height="1080" fill="#fff" opacity=".35"/>`; }
  }
  return s; };
