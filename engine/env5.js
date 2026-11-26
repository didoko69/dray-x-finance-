// ---------- Rooftop environments (video 5) ----------
Object.assign(SKY, { sunset: ['#3a2a4a', '#c8603a', '#f0a050'], rain: ['#4a5258', '#6a7278', '#8a9298'], dusk5: ['#1e2236', '#5a3a4a', '#a8604a'], memoryred: SKY.night });
const CON = '#7a776e', CON2 = '#6a675f';
function commsBldg(x, y, s, lit) { // emergency communications building (across the street)
  let g = `<g transform="translate(${x},${y}) scale(${s})">${R(0, 0, 360, 520, '#5a5e60', 6)}<rect x="0" y="0" width="360" height="40" fill="#3a3e40"/>`;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) g += R(30 + c * 82, 70 + r * 72, 56, 44, '#1c2228', 3);
  g += P('M260 0 V-180 M230 -120 h60 M240 -60 h40', 'none', 6) + `<path d="M70 -10 a50 30 0 0 1 100 0z" fill="#c9cfd2" stroke="${INK}" stroke-width="5"/><path d="M120 -10 v-30" stroke="${INK}" stroke-width="5"/>`;
  g += R(60, 470, 240, 40, '#8a2e22', 4) + `<text x="180" y="498" font-size="20" font-weight="800" fill="#e9dfc6" text-anchor="middle" font-family="DejaVu Sans">EMERGENCY COMMS</text></g>`;
  return g;
}
function cityBack(L, base = 640, comms = true) {
  const [id, gd] = skyGrad(L);
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  if (L === 'sunset' || L === 'dusk5') s += `<circle cx="420" cy="${base - 120}" r="90" fill="#f4b060" opacity=".85"/>`;
  if (isNight(L) && L !== 'rain') for (let i = 0; i < 60; i++) s += `<circle cx="${rnd(i) * 1920}" cy="${rnd(i + 99) * 300}" r="${1 + rnd(i + 5) * 1.6}" fill="#fff" opacity="${.3 + rnd(i + 7) * .5}"/>`;
  s += skyline(0, 1920, base, 120, 380, 51, 0, .9);
  for (let i = 0; i < 8; i++) s += `<path d="M${rnd(i + 3) * 1900} ${base - 300 + rnd(i) * 200} l${20 + rnd(i) * 40} -${10 + rnd(i + 2) * 30} l-${10} ${30}z" fill="#2a2e36" opacity=".7"/>`; // broken edges
  if (comms) s += commsBldg(1330, base - 470, .9, false);
  return s;
}
function parapet(y) { return `<rect x="0" y="${y}" width="1920" height="50" fill="${CON2}" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 24 }, (_, i) => `<path d="M${i * 80} ${y} v50" stroke="#5a574f" stroke-width="3"/>`).join(''); }
function roofFloor(y) { let s = `<rect x="0" y="${y}" width="1920" height="${1080 - y}" fill="${CON}"/>`; for (let i = 0; i < 18; i++) s += `<path d="M${rnd(i) * 1920} ${y + rnd(i + 3) * (1080 - y)} l${40 + rnd(i + 1) * 120} ${rnd(i + 2) * 20 - 10}" stroke="#6a675f" stroke-width="3"/>`; return s; }
function accessBox(x, y) { return R(x, y, 300, 420, '#8a867c', 7) + R(x - 14, y - 20, 328, 30, '#6a675f', 6) + R(x + 80, y + 120, 140, 300, '#5f6668', 7) + C(x + 200, y + 280, 8, '#c9b25a', 3) + T(x + 150, y + 100, 20, 'ROOF ACCESS', '#3a3830', 900); }
function waterTank(x, y) { return P(`M${x} ${y + 260} V${y + 160} M${x + 220} ${y + 260} V${y + 160} M${x + 20} ${y + 260} L${x + 200} ${y + 170} M${x + 200} ${y + 260} L${x + 20} ${y + 170}`, 'none', 8) + `<path d="M${x - 20} ${y + 160} V${y + 20} Q${x + 110} ${y - 30} ${x + 240} ${y + 20} V${y + 160}Z" fill="#6a5a46" stroke="${INK}" stroke-width="7"/>` + Array.from({ length: 4 }, (_, i) => `<path d="M${x - 20} ${y + 40 + i * 32} h260" stroke="#5a4a38" stroke-width="5"/>`).join(''); }
function tarpShelter(x, y, torn) { return `<path d="M${x} ${y + 200} L${x + 40} ${y} L${x + 360} ${y + 30} L${x + 380} ${y + 200}Z" fill="${torn ? '#3a5a6a' : '#3f6a7a'}" stroke="${INK}" stroke-width="6" ${torn ? 'transform="rotate(4)"' : ''}/>` + P(`M${x + 40} ${y} V${y + 200} M${x + 360} ${y + 30} V${y + 200}`, 'none', 8) + `<path d="M${x + 60} ${y + 200} h280" stroke="#6b4a2e" stroke-width="14"/>` + R(x + 100, y + 140, 200, 60, '#5a4a3a', 5, 'rx="10"'); }
function containers(x, y) { let s = ''; for (let i = 0; i < 5; i++) s += R(x + i * 62, y - 70 - (i % 2) * 10, 52, 70 + (i % 2) * 10, ['#4f86b6', '#c9cfd2', '#4f86b6', '#e0a040', '#4f86b6'][i], 5, 'rx="8"') + `<rect x="${x + i * 62 + 4}" y="${y - 40}" width="44" height="${36}" fill="#9fc3e0" opacity=".6"/>`; return s + `<path d="M${x - 20} ${y - 160} L${x + 330} ${y - 120} L${x + 300} ${y - 90}" stroke="#3f6a7a" stroke-width="10" fill="none"/>`; }
function garden(x, y) { let s = ''; for (let i = 0; i < 3; i++) s += R(x + i * 110, y - 60, 96, 60, '#6b4a2e', 5) + `<path d="M${x + 20 + i * 110} ${y - 60} q10 -40 20 0 q10 -50 20 0 q10 -30 20 0" fill="#5f7f4a" stroke="${INK}" stroke-width="3"/>`; s += R(x + 20, y - 170, 120, 100, '#9a7a4a', 5) + R(x + 160, y - 150, 100, 80, '#b08a5a', 5); return s; }
function bridgeStub(x, y) { return `<path d="M${x} ${y} L1920 ${y + 60}" stroke="#7d8588" stroke-width="10"/><path d="M${x} ${y - 40} L1920 ${y + 20}" stroke="#7d8588" stroke-width="6"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${x + i * 60} ${y + i * 6} v-40" stroke="#7d8588" stroke-width="4"/>`).join(''); }

ENV.roof = (L) => {
  let s = cityBack(L, 640) + parapet(600) + roofFloor(650);
  s += accessBox(120, 380) + waterTank(560, 420) + tarpShelter(520, 600) + containers(960, 820) + garden(1300, 860) + bridgeStub(1660, 640);
  return s;
};
ENV.roofdoor = (L) => {
  let s = cityBack(L, 560, false) + roofFloor(700);
  s += R(300, 160, 760, 560, '#8a867c', 8) + R(280, 130, 800, 40, '#6a675f', 6) + R(520, 300, 280, 420, '#5f6668', 8) + `<rect x="540" y="320" width="240" height="380" fill="#6b7476"/>` + C(760, 520, 12, '#c9b25a', 4) + T(680, 270, 26, 'ROOF ACCESS', '#3a3830', 900);
  s += `<path d="M560 700 l200 0" stroke="${INK}" stroke-width="4"/>` + parapet(520).replace(/x="0"/, 'x="1060"').replace('width="1920"', 'width="860"');
  return s;
};
ENV.shelter = (L) => {
  let s = cityBack(L, 600) + parapet(560) + roofFloor(610);
  s += waterTank(200, 380) + tarpShelter(440, 620) + `<g transform="translate(980,860)">${R(-60, -60, 120, 60, '#6b4a2e', 5)}</g>`;
  return s;
};
ENV.water = (L) => {
  let s = cityBack(L, 560) + parapet(520) + roofFloor(570);
  s = s + `<g transform="translate(560,900) scale(1.6) translate(-560,-900)">${containers(560, 900)}</g>`;
  return s;
};
ENV.garden = (L) => cityBack(L, 560) + parapet(520) + roofFloor(570) + `<g transform="translate(700,900) scale(1.8) translate(-700,-900)">${garden(700, 900)}</g>`;
ENV.bridge = (L) => {
  let s = cityBack(L, 760, true) + `<rect x="0" y="560" width="520" height="520" fill="#8a867c" stroke="${INK}" stroke-width="7"/>` + `<rect x="1400" y="700" width="520" height="380" fill="#7a766c" stroke="${INK}" stroke-width="7"/>`;
  s += `<rect x="1400" y="660" width="520" height="40" fill="#6a675f" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M520 600 L1400 680" stroke="#5f6668" stroke-width="22"/><path d="M520 540 L1400 620 M520 600 L1400 680" stroke="#9aa1a4" stroke-width="7"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${520 + i * 80} ${540 + i * 7.3} v60" stroke="#9aa1a4" stroke-width="5"/>`).join('');
  s += `<rect x="520" y="620" width="880" height="460" fill="#2a2c30" opacity=".5"/>` + R(1700, 520, 140, 180, '#5f6668', 6) + T(1770, 500, 18, 'ROOF B', '#e9dfc6', 800);
  return s;
};
ENV.neighbor = (L) => { let s = `<rect width="1920" height="1080" fill="#5a5850"/><rect y="840" width="1920" height="240" fill="#4a4840"/><path d="M0 840 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += R(1300, 280, 280, 560, '#5f6668', 8) + `<rect x="1320" y="300" width="240" height="140" fill="#f4c88a" opacity=".5"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M0 ${80 + i * 72} H1920" stroke="#535149" stroke-width="3"/>`).join('') + R(200, 600, 300, 240, '#7a6a52', 6); return s; };
ENV.citybelow = (L) => {
  const [id, gd] = skyGrad(L);
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>` + skyline(0, 1920, 360, 60, 200, 61, isNight(L) ? 0 : 0, .6);
  s += `<path d="M0 360 L700 360 L380 1080 L0 1080Z" fill="#5a5850"/><path d="M1920 360 L1220 360 L1540 1080 L1920 1080Z" fill="#55534b"/>`;
  s += `<path d="M700 360 L1220 360 L1540 1080 L380 1080Z" fill="#4a4c50"/><path d="M960 360 L960 1080" stroke="#d6d2c8" stroke-width="8" stroke-dasharray="40 40"/>`;
  for (const [x, y, r] of [[700, 700, 20], [1150, 860, -30], [880, 520, 10]]) s += `<g transform="translate(${x},${y}) rotate(${r})">${R(-90, -40, 180, 80, ['#8c3b32', '#4f6f86', '#6b6a3a'][Math.abs(r) % 3], 5, 'rx="12"')}</g>`;
  s += `<rect width="1920" height="140" fill="#7a776e" stroke="${INK}" stroke-width="6" transform="translate(0,940)"/>`;
  return s;
};
ENV.citywide = (L) => { let s = cityBack(L === 'memory' ? 'day' : L, 760) + `<rect y="760" width="1920" height="320" fill="#4a4c50"/>` + parapet(1000); return s; };
ENV.street5 = (L) => ENV.street3(L === 'dawn' ? 'dawn' : 'day') + (L === 'dawn' ? '' : '');
ENV.stairwell = (L) => {
  let s = `<rect width="1920" height="1080" fill="#55575a"/>`;
  for (let i = 0; i < 14; i++) { const x = 200 + i * 110, y = 1040 - i * 62; s += `<rect x="${x}" y="${y}" width="110" height="${1080 - y}" fill="${i % 2 ? '#6a6c6e' : '#727476'}"/><path d="M${x} ${y} h110" stroke="${INK}" stroke-width="5"/>`; }
  s += `<path d="M160 940 L1700 80" stroke="${INK}" stroke-width="10"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${200 + i * 110} ${930 - i * 61} v80" stroke="${INK}" stroke-width="5"/>`).join('');
  s += R(60, 300, 120, 220, '#5f6668', 6) + T(120, 280, 26, 'FLOOR 12', '#e9dfc6', 800);
  return s;
};
ENV.ladderin = (L) => { let s = `<rect width="1920" height="1080" fill="#3a3c3a"/><path d="M0 0 L640 260 L640 1080 L0 1080Z" fill="#454745"/><path d="M1920 0 L1280 260 L1280 1080 L1920 1080Z" fill="#414341"/>`;
  s += P('M840 1080 V120 M1080 1080 V120', 'none', 14) + Array.from({ length: 17 }, (_, i) => `<path d="M840 ${160 + i * 56} H1080" stroke="${INK}" stroke-width="10"/>`).join('') + `<rect x="700" y="0" width="520" height="120" fill="#6b7476"/><rect x="720" y="20" width="480" height="80" fill="#8a9294"/>`;
  return s; };
ENV.underdoor5 = (L) => { let s = cityBack(L, 400, false) + roofFloor(760) + R(560, -40, 800, 820, '#5f6668', 9) + `<rect x="560" y="780" width="800" height="16" fill="#0a0b0c"/>`; return s; };
ENV.photohand = (L) => { let s = `<rect width="1920" height="1080" fill="#7a6a5a"/>`;
  s += P('M300 1080 Q380 840 640 780 Q700 770 700 830 L560 940 L520 1080Z', '#9a6646', 7) + `<path d="M300 1080 L400 900" stroke="#4f5a34" stroke-width="150"/>`;
  s += P('M1620 1080 Q1540 840 1280 780 Q1220 770 1220 830 L1360 940 L1400 1080Z', '#9a6646', 7) + `<path d="M1620 1080 L1520 900" stroke="#4f5a34" stroke-width="150"/>`;
  return s; };
ENV.radiohand5 = (L) => ENV.radiohand(L).replace(/#2f5a3e/g, '#4f5a34');
ENV.camp = (L) => { const day = L === 'memory';
  let s = `<rect width="1920" height="1080" fill="${day ? '#8a8a7a' : '#2a2224'}"/>` + skyline(0, 1920, 560, 60, 240, 71, 0, .7) + `<rect y="560" width="1920" height="520" fill="${day ? '#7a7260' : '#3a3030'}"/>`;
  for (const [x, c] of [[200, '#4f6a5a'], [600, '#6a5a4a'], [1350, '#5a6a7a']]) s += P(`M${x} 860 L${x + 150} 640 L${x + 300} 860Z`, c, 6) + `<path d="M${x + 150} 860 L${x + 150} 700" stroke="${INK}" stroke-width="4"/>`;
  s += R(1000, 760, 200, 100, '#7a6a52', 5) + T(960, 520, 34, 'SURVIVOR CAMP', day ? '#3a3830' : '#c9a080', 900);
  return s; };
ENV.comms = (L) => { let s = cityBack(L, 900, false) + commsBldg(560, 260, 1.9, false) + `<rect y="900" width="1920" height="180" fill="#4a4c50"/>` + parapet(1020); return s; };
