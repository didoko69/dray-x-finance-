// ---------- Subway station environments (video 3) ----------
Object.assign(SKY, { dusk: ['#2a2840', '#7a4a4a', '#c9805a'] });
const TL3 = '#3f5a58', TL3b = '#36504e', YEL = '#c9b25a', CONC = '#5d6260';
function tileWall(x, y, w, h, c = TL3, step = 40) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  for (let yy = y; yy < y + h; yy += step / 2) s += `<path d="M${x} ${yy} h${w}" stroke="${TL3b}" stroke-width="2"/>`;
  for (let xx = x; xx < x + w; xx += step) s += `<path d="M${xx} ${y} v${h}" stroke="${TL3b}" stroke-width="2"/>`;
  return s;
}
function poster(x, y, w, h, seed, rot = 0) {
  const c = ['#8a6a4a', '#5f7a6a', '#7a5a6a', '#9a8a5a'][seed % 4];
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${R(x, y, w, h, c, 5)}<rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h * .5}" fill="#d6cdb5" opacity=".5"/><path d="M${x + 14} ${y + h * .7} h${w * .6} M${x + 14} ${y + h * .8} h${w * .4}" stroke="#2a2a2a" stroke-width="6" opacity=".5"/><path d="M${x + w} ${y} l-30 0 l30 40z" fill="#2a2e2e"/></g>`;
}
function suitcase(x, y, c, rot = 0, s = 1) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${R(-50, -36, 100, 72, c, 5, 'rx="10"')}<path d="M-16 -36 v-14 h32 v14" stroke="${INK}" stroke-width="5" fill="none"/><path d="M-50 0 h100" stroke="${INK}" stroke-width="3"/></g>`; }

ENV.platform = (L) => {
  const vx = 980, vy = 470;
  let s = `<rect width="1920" height="1080" fill="#1f2a2a"/>`;
  // ceiling
  s += `<path d="M0 0 H1920 L1120 380 L840 380Z" fill="#2a3332"/>`;
  // right wall (tiles approximated with perspective lines)
  s += `<path d="M1920 0 L1120 380 L1120 560 L1920 1080Z" fill="${TL3}"/>`;
  for (let k = 0; k < 14; k++) { const f = Math.pow(.8, k); const x = 1120 + 800 * f; s += `<path d="M${x} ${380 - 380 * f} L${x} ${560 + 520 * f}" stroke="${TL3b}" stroke-width="${1 + 3 * f}"/>`; }
  for (let r = 0; r < 12; r++) { const y0 = 380 * (1 - r / 12) + 0, y1 = 0 + r * 90; s += `<path d="M1120 ${380 + 180 * r / 12} L1920 ${y1}" stroke="${TL3b}" stroke-width="2"/>`; }
  s += `<path d="M1120 470 L1920 600" stroke="${YEL}" stroke-width="10" opacity=".7"/>` + T(1620, 580, 46, 'KESTREL STREET', '#e9dfc6', 900, 'middle', 'transform="skewY(9) translate(0,-250)"');
  for (const [x, w] of [[1300, 120], [1560, 180]]) s += `<path d="M${x} ${330 - (x - 1120) * .3} l${w} ${-w * .45} l0 ${w * 1.4} l${-w} ${w * .45}z" fill="#7a6a5a" stroke="${INK}" stroke-width="4"/>`;
  // platform floor
  s += `<path d="M380 1080 L1920 1080 L1120 560 L930 560Z" fill="#6a6c66"/><path d="M380 1080 L930 560 L960 560 L460 1080Z" fill="${YEL}" opacity=".8"/>`;
  for (let k = 0; k < 10; k++) { const f = Math.pow(.75, k), y = 560 + 520 * f, xl = 930 - 550 * f, xr = 1120 + 800 * f; s += `<path d="M${xl} ${y} H${xr}" stroke="#5a5c56" stroke-width="${1 + 3 * f}"/>`; }
  // track + train on left
  s += `<path d="M0 1080 L380 1080 L930 560 L840 560 L0 820Z" fill="#141818"/>`;
  s += `<path d="M0 230 L840 410 L840 545 L0 900Z" fill="#6f7a78" stroke="${INK}" stroke-width="5"/><path d="M0 300 L840 430" stroke="${YEL}" stroke-width="12" opacity=".6"/>`;
  for (let k = 0; k < 9; k++) { const f = Math.pow(.78, k), x = 840 - 840 * f, x2 = 840 - 840 * Math.pow(.78, k + .6); const t1 = 410 - 180 * f, b1 = 545 + 355 * f;
    s += `<path d="M${x} ${t1 + (b1 - t1) * .15} L${x2} ${410 - 180 * Math.pow(.78, k + .6) + ((545 + 355 * Math.pow(.78, k + .6)) - (410 - 180 * Math.pow(.78, k + .6))) * .15} L${x2} ${410 - 180 * Math.pow(.78, k + .6) + ((545 + 355 * Math.pow(.78, k + .6)) - (410 - 180 * Math.pow(.78, k + .6))) * .45} L${x} ${t1 + (b1 - t1) * .45}Z" fill="#1a2224" stroke="${INK}" stroke-width="${1 + 3 * f}"/>`; }
  // end wall + sealed door
  s += `<rect x="840" y="380" width="280" height="180" fill="#2c3634"/>` + R(935, 420, 110, 140, '#4a4f4e', 4) + `<path d="M935 430 L1045 550 M1045 430 L935 550" stroke="#9aa1a4" stroke-width="5"/>` + `<rect x="935" y="408" width="110" height="10" fill="${YEL}"/>`;
  s += R(1055, 450, 30, 30, YEL, 3) + T(990, 400, 16, 'NO ENTRY', '#c33a2f', 900);
  // ceiling lights
  for (let k = 0; k < 7; k++) { const f = Math.pow(.72, k); s += `<rect x="${980 - 140 * f}" y="${380 - 330 * f}" width="${280 * f}" height="${12 * f + 2}" rx="4" fill="#cfd8d2" opacity=".85"/>`; }
  // bench
  s += `<g transform="translate(1500,830)">${R(-150, -40, 300, 26, '#6b4a2e', 5)}${P('M-130 -14 v60 M130 -14 v60', 'none', 8)}</g>`;
  return s;
};
ENV.door3 = (L) => {
  let s = tileWall(0, 0, 1920, 1080) + `<rect y="880" width="1920" height="200" fill="#5a5c56"/><path d="M0 880 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += R(540, 160, 840, 720, '#3a3f3e', 10) + R(570, 190, 380, 690, '#55605e', 7) + R(970, 190, 380, 690, '#55605e', 7);
  for (const x of [600, 1000]) for (let i = 0; i < 5; i++) s += `<circle cx="${x + i * 76}" cy="210" r="6" fill="#3a3f3e"/><circle cx="${x + i * 76}" cy="860" r="6" fill="#3a3f3e"/>`;
  s += `<path d="M570 300 l60 -10 l40 30 M1300 700 l-50 20" stroke="#7a4a2a" stroke-width="10" opacity=".5"/>`;
  s += R(900, 470, 30, 120, '#9aa1a4', 5, 'rx="8"') + R(990, 470, 30, 120, '#9aa1a4', 5, 'rx="8"');
  // warning signs
  s += R(620, 260, 240, 150, YEL, 6) + `<path d="M740 285 L790 370 H690Z" fill="none" stroke="${INK}" stroke-width="8"/>` + T(740, 362, 50, '!', INK) + T(740, 400, 24, 'DANGER', INK, 900);
  s += R(1060, 260, 240, 120, '#c33a2f', 6) + T(1180, 315, 32, 'NO ENTRY', '#fff') + T(1180, 355, 20, 'SEALED SECTION', '#fff', 700);
  s += R(640, 650, 220, 110, '#e9dfc6', 5, 'transform="rotate(-4 750 700)"') + T(750, 700, 22, 'TUNNEL B', '#333', 900, 'middle', 'transform="rotate(-4 750 700)"') + T(750, 735, 18, 'STRUCTURAL INCIDENT', '#c33a2f', 800, 'middle', 'transform="rotate(-4 750 700)"');
  s += `<rect x="540" y="130" width="840" height="30" fill="${YEL}"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${550 + i * 60} 130 l30 30" stroke="${INK}" stroke-width="12"/>`).join('');
  return s;
};
ENV.street3 = (L) => {
  const [id, gd] = skyGrad(L);
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  [[0, 180, 300, '#6a6460'], [300, 260, 260, '#5f5a56'], [560, 140, 300, '#76706a'], [860, 300, 240, '#5a6264']].forEach(([x, y, w, c]) => { s += R(x, y, w, 700 - y, c, 6); for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) if (y + 40 + r * 80 < 640) s += R(x + 30 + k * (w - 60) / 3, y + 40 + r * 80, (w - 120) / 3, 50, rnd(r * 3 + k + x) > .7 ? '#c98a4a' : '#2a3036', 3); });
  s += `<rect y="700" width="1920" height="100" fill="#7a7670"/><rect y="800" width="1920" height="280" fill="#45484c"/><path d="M0 940 H1920" stroke="#d6d2c8" stroke-width="8" stroke-dasharray="80 60"/>`;
  // subway entrance at right
  s += P('M1180 700 L1660 700 L1660 760 L1180 760Z', '#3a3f3e', 6) + `<rect x="1200" y="710" width="440" height="50" fill="#0c0f10"/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M${1210 + i * 8} ${716 + i * 12} h${420 - i * 16}" stroke="#2a2e2e" stroke-width="6"/>`;
  s += P('M1180 700 V600 H1660 V700', 'none', 9) + P('M1420 600 V440', 'none', 10) + `<g transform="rotate(-8 1420 400)">${C(1420, 400, 60, '#2f6a5a', 7)}${T(1420, 420, 56, 'M', '#f1ece2', 900)}</g>` + `<path d="M1380 360 l30 40 l-20 30" stroke="${INK}" stroke-width="5" fill="none"/>`;
  s += T(1420, 590, 28, 'KESTREL ST', '#f1ece2', 900);
  s += cartSVG(400, 880, .8, 80) + `<g transform="translate(800,860) rotate(10)">${R(-120, -60, 240, 70, '#7a3a2a', 6, 'rx="10"')}${C(-70, 14, 22, '#222', 5)}${C(70, 14, 22, '#222', 5)}</g>`;
  return s;
};
ENV.stairs3 = (L) => {
  let s = `<rect width="1920" height="1080" fill="#1c2424"/>` + tileWall(0, 0, 520, 1080) + tileWall(1400, 0, 520, 1080);
  s += `<path d="M520 0 L760 260 L760 1080 L520 1080Z" fill="#2a3a38"/><path d="M1400 0 L1160 260 L1160 1080 L1400 1080Z" fill="#2a3a38"/>`;
  s += `<rect x="760" y="120" width="400" height="160" fill="${L === 'dim' ? '#c98a6a' : '#3a3030'}"/>`;
  for (let i = 0; i < 14; i++) { const y = 280 + i * 57, w = 400 + i * 40; s += `<rect x="${960 - w / 2}" y="${y}" width="${w}" height="57" fill="${i % 2 ? '#5a5c56' : '#64665f'}" stroke="${INK}" stroke-width="3"/><path d="M${960 - w / 2} ${y} h${w}" stroke="${YEL}" stroke-width="6" opacity=".6"/>`; }
  s += P('M700 1080 L820 280 M1220 1080 L1100 280', 'none', 10);
  return s;
};
ENV.hall3 = (L) => {
  let s = tileWall(0, 0, 1920, 820) + `<rect y="0" width="1920" height="110" fill="#2a3332"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${100 + i * 320}" y="50" width="180" height="14" rx="7" fill="#cfd8d2" opacity="${i === 2 ? .2 : .8}"/>`;
  s += poster(80, 200, 200, 280, 1, -3) + poster(340, 220, 220, 260, 2, 2) + poster(1420, 210, 200, 280, 3, 4) + poster(1680, 220, 180, 250, 0, -2);
  s += R(640, 170, 640, 90, '#2f6a5a', 6) + T(960, 228, 44, 'PLATFORMS  ↓', '#f1ece2');
  s += R(700, 300, 520, 300, '#e6dfd0', 6) + T(960, 340, 26, 'STATION MAP', '#2f4a4c') + `<path d="M740 470 H1180 M960 380 V560" stroke="#2f6a5a" stroke-width="10"/><path d="M1080 470 L1160 540" stroke="#c33a2f" stroke-width="8" stroke-dasharray="14 10"/>`;
  s += `<rect y="820" width="1920" height="260" fill="#6a6c66"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 5; i++) s += `<g transform="translate(${620 + i * 170},820)">${R(-14, -120, 28, 120, '#7d8588', 5)}${P('M14 -90 h60', 'none', 8)}</g>`;
  s += suitcase(300, 900, '#8c3b32', 12) + suitcase(1300, 940, '#4f6f86', -20) + suitcase(1650, 880, '#6b6a3a', 80, .8) + suitcase(900, 1000, '#5a4a6a', 5, 1.1);
  return s;
};
ENV.machines = (L) => {
  let s = tileWall(0, 0, 1920, 830) + `<rect y="830" width="1920" height="250" fill="#6a6c66"/><path d="M0 830 H1920" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 4; i++) { const x = 120 + i * 260; s += R(x, 360, 210, 470, '#8a9294', 7, 'rx="10"') + `<rect x="${x + 25}" y="400" width="160" height="110" fill="#14181a"/>` + R(x + 60, 560, 90, 40, '#3a3f42', 4) + R(x + 40, 650, 130, 20, '#2a2e30', 4) + T(x + 105, 390, 18, 'TICKETS', '#2f4a4c', 900); }
  s += R(1250, 300, 300, 530, '#2f6a5a', 8, 'rx="10"') + `<rect x="1280" y="340" width="190" height="380" fill="#1a2020"/>`;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) if (rnd(r * 4 + c) > .35) s += r % 2 ? `<rect x="${1292 + c * 44}" y="${352 + r * 72}" width="30" height="50" rx="4" fill="#e9c47a" stroke="${INK}" stroke-width="2"/>` : `<rect x="${1298 + c * 44}" y="${350 + r * 72}" width="18" height="56" rx="6" fill="#69b3ee" stroke="${INK}" stroke-width="2"/>`;
  s += `<path d="M1300 420 l60 60 M1400 380 l-50 90" stroke="#cfe0ff" stroke-width="4"/>` + R(1490, 380, 40, 120, '#ddd', 4) + T(1400, 760, 26, 'SNACKS', '#f1ece2', 900);
  return s;
};
ENV.maint = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3f4746"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M0 ${70 + i * 64} H1920" stroke="#394140" stroke-width="3"/>`).join('');
  s += `<rect y="840" width="1920" height="240" fill="#55574f"/><path d="M0 840 H1920" stroke="${INK}" stroke-width="8"/><rect width="1920" height="60" fill="#2c3332"/>`;
  s += `<path d="M0 120 H1920 M0 150 H1920" stroke="#5a6a6a" stroke-width="16"/>`;
  s += R(140, 300, 260, 540, '#5a6260', 8) + R(340, 540, 30, 60, '#c9b25a', 4) + `<rect x="190" y="340" width="160" height="60" fill="#e9dfc6"/>` + T(270, 380, 22, 'MAINTENANCE', '#2f4a4c', 900);
  s += R(1250, 600, 520, 40, '#6b4a2e', 6) + P('M1280 640 v200 M1740 640 v200', 'none', 10) + R(1260, 300, 500, 260, '#7a6a52', 6);
  for (let i = 0; i < 6; i++) s += `<g transform="translate(${1310 + i * 80},380) rotate(${-10 + i * 5})"><rect x="-6" y="0" width="12" height="90" fill="#8a9094" stroke="${INK}" stroke-width="3"/></g>`;
  s += R(1300, 560, 140, 40, '#c33a2f', 5) + R(1500, 540, 100, 60, '#3a3f42', 5);
  s += R(560, 760, 420, 80, '#5a6a5a', 6, 'rx="12"') + `<path d="M600 760 q100 -30 220 0 q80 20 140 0" fill="#7a8a7a" stroke="${INK}" stroke-width="4"/>`;
  s += R(1500, 200, 160, 90, '#3a3f42', 5) + `<path d="M1520 220 h120 M1520 245 h120" stroke="#5a5f62" stroke-width="5"/>`;
  return s;
};
ENV.office3 = (L) => {
  let s = `<rect width="1920" height="1080" fill="#4a5450"/><rect y="840" width="1920" height="240" fill="#4f4840"/><path d="M0 840 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += R(260, 300, 300, 540, '#5a5f5c', 8) + `<rect x="330" y="350" width="160" height="110" fill="#1a2020" stroke="${INK}" stroke-width="5"/>` + C(520, 580, 10, '#9aa1a4', 4) + T(410, 520, 22, 'OFFICE', '#e9dfc6', 900);
  for (let i = 0; i < 3; i++) s += R(640 + i * 150, 420, 130, 420, '#7d8588', 6) + [0, 1, 2].map(k => R(652 + i * 150, 440 + k * 130, 106, 110, '#8a9294', 3) + `<rect x="${690 + i * 150}" y="${480 + k * 130}" width="30" height="10" rx="5" fill="#3a3f42"/>`).join('');
  s += R(1100, 280, 160, 140, '#7a6a52', 5) + Array.from({ length: 5 }, (_, i) => `<rect x="${1112 + i * 28}" y="292" width="22" height="116" fill="${['#4f6f86', '#8a6a4a', '#5f7a6a', '#7a5a6a', '#9a8a5a'][i]}"/>`).join('');
  s += R(1080, 640, 640, 30, '#6b4a2e', 6) + P('M1110 670 v170 M1690 670 v170', 'none', 10);
  s += `<g transform="rotate(-6 1180 625)">${R(1120, 610, 140, 22, '#c9b25a', 3)}</g>` + R(1200, 600, 120, 30, '#e9dfc6', 3);
  s += R(1380, 470, 220, 170, '#bdb6a2', 7, 'rx="16"') + `<rect x="1400" y="490" width="160" height="120" rx="10" fill="#0d1210"/>` + R(1440, 640, 80, 10, '#8a8478', 3);
  return s;
};
function platformCCTV() {
  let s = `<rect width="1920" height="1080" fill="#2a312e"/>`;
  s += `<path d="M0 1080 L700 420 L1500 420 L1920 700 L1920 1080Z" fill="#3e4642"/><path d="M0 1080 L700 420 L760 420 L120 1080Z" fill="#7a7a5a" opacity=".6"/>`;
  s += `<path d="M0 300 L700 360 L700 420 L0 1080Z" fill="#1a1f1d"/><path d="M1500 420 L1500 240 L1920 120 L1920 700Z" fill="#4a5450"/>`;
  s += `<rect x="700" y="240" width="800" height="180" fill="#323a37"/>` + R(1240, 300, 120, 120, '#4f5a56', 4) + `<path d="M1240 310 L1360 410 M1360 310 L1240 410" stroke="#8a948f" stroke-width="5"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${760 + i * 120}" y="250" width="80" height="8" fill="#b8c2bc" opacity=".6"/>`;
  return s;
}
ENV.cctv3 = (L) => platformCCTV();
ENV.cctvoffice = (L) => {
  let s = `<rect width="1920" height="1080" fill="#2f3532"/><rect y="880" width="1920" height="200" fill="#3e4642"/>`;
  s += `<path d="M0 0 L500 200 L500 880 L0 1080Z" fill="#262b29"/><path d="M1920 0 L1500 200 L1500 880 L1920 1080Z" fill="#262b29"/>`;
  s += R(780, 330, 300, 550, '#4a524e', 6) + `<rect x="840" y="380" width="180" height="120" fill="#1a1f1d"/>` + T(930, 560, 26, 'OFFICE', '#9aa49e', 900) + C(1050, 620, 10, '#8a948f', 4);
  return s;
};
ENV.underdoor = (L) => {
  let s = `<rect width="1920" height="1080" fill="#151918"/>` + R(560, 0, 800, 800, '#2c3231', 8) + `<rect x="560" y="800" width="800" height="14" fill="#c98a5a" opacity=".55"/>`;
  s += `<rect y="814" width="1920" height="266" fill="#2a2c28"/>` + R(1120, 470, 120, 30, '#7d8588', 5, 'rx="10"') + C(1130, 485, 22, '#8a9094', 5);
  s += `<path d="M560 808 L240 1080 L1680 1080 L1360 808Z" fill="#c98a5a" opacity=".05"/>`;
  return s;
};
ENV.wall = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3f4746"/>` + Array.from({ length: 16 }, (_, i) => `<path d="M0 ${i * 70} H1920" stroke="#394140" stroke-width="4"/>`).join('');
  s += `<path d="M900 100 l40 120 l-30 80 l60 140 l-40 90 l30 120" stroke="#232828" stroke-width="6" fill="none"/><path d="M940 220 l80 30 M920 520 l-90 40" stroke="#232828" stroke-width="4"/>`;
  s += `<path d="M0 760 H1920 M0 800 H1920" stroke="#5a6a6a" stroke-width="14"/>`;
  return s;
};
ENV.vent = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3a3f3c"/><rect y="860" width="1920" height="220" fill="#4f504a"/><path d="M0 860 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += R(220, 320, 260, 540, '#5a5f5c', 8) + T(350, 300, 24, 'VENTILATION', '#c9b25a', 900);
  s += C(960, 470, 300, '#2a2e2c', 10) + C(960, 470, 260, '#1a1d1c', 6) + `<path d="M660 470 H1260 M960 170 V770" stroke="#4a4f4c" stroke-width="12"/>`;
  s += `<path d="M0 120 H700 M1220 120 H1920" stroke="#6a7470" stroke-width="40"/>`;
  s += P('M1500 860 V100 M1620 860 V100', 'none', 12) + Array.from({ length: 13 }, (_, i) => `<path d="M1500 ${140 + i * 56} H1620" stroke="${INK}" stroke-width="9"/>`).join('');
  s += `<circle cx="1800" cy="200" r="24" fill="#c33a2f" stroke="${INK}" stroke-width="5"/>`;
  return s;
};
ENV.ladder = (L) => {
  let s = `<rect width="1920" height="1080" fill="#2c3230"/>` + `<path d="M0 0 L640 260 L640 1080 L0 1080Z" fill="#3a403e"/><path d="M1920 0 L1280 260 L1280 1080 L1920 1080Z" fill="#363c3a"/>`;
  s += `<rect x="640" y="260" width="640" height="820" fill="#303634"/>`;
  s += R(760, 120, 400, 160, '#4a4f4e', 8) + `<rect x="790" y="150" width="340" height="100" fill="#3a3f3e"/>`;
  s += P('M840 1080 V260 M1080 1080 V260', 'none', 14) + Array.from({ length: 15 }, (_, i) => `<path d="M840 ${300 + i * 56} H1080" stroke="${INK}" stroke-width="10"/>`).join('');
  return s;
};
ENV.alley = (L) => {
  const [id, gd] = skyGrad('dawn');
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  s += `<path d="M0 0 L700 260 L700 780 L0 1080Z" fill="#6a4a3e"/><path d="M1920 0 L1220 260 L1220 780 L1920 1080Z" fill="#5f4a40"/>`;
  for (let r = 0; r < 22; r++) { s += `<path d="M0 ${r * 50} L700 ${260 + r * 24}" stroke="#5a3e34" stroke-width="2"/><path d="M1920 ${r * 50} L1220 ${260 + r * 24}" stroke="#4f3e36" stroke-width="2"/>`; }
  s += `<path d="M0 1080 L700 780 L1220 780 L1920 1080Z" fill="#55524c"/>` + skyline(700, 1220, 780, 100, 300, 13, 0, .5);
  s += P('M1500 200 L1500 700 M1380 260 L1680 200 M1380 420 L1680 380', 'none', 8) + `<g transform="translate(260,960)">${R(-80, -150, 160, 150, '#3f5a46', 6, 'rx="8"')}${R(-90, -170, 180, 30, '#34493a', 6)}</g>`;
  // hatch in ground
  s += `<ellipse cx="700" cy="900" rx="130" ry="44" fill="#3a3c3a" stroke="${INK}" stroke-width="7"/>`;
  return s;
};
ENV.pagehand = (L) => {
  let s = `<rect width="1920" height="1080" fill="#6a5a50"/>` + `<g transform="rotate(-5 960 520)">${R(620, 140, 680, 820, '#efe8d8', 6)}${T(960, 220, 34, 'MAINTENANCE REPORT', '#333', 900)}${Array.from({ length: 12 }, (_, i) => `<path d="M680 ${300 + i * 48} h${380 + rnd(i) * 160}" stroke="#777" stroke-width="7"/>`).join('')}<path d="M620 640 q200 40 300 -30 l120 90 l-60 120 l-360 140z" fill="#c9b99c" opacity=".5"/></g>`;
  s += P('M300 1080 Q380 840 640 780 Q700 770 700 830 L560 940 L520 1080Z', '#9a6646', 7) + `<path d="M300 1080 L400 900" stroke="#4a4d52" stroke-width="150"/>`;
  return s;
};
ENV.section = (L) => {
  const [id, gd] = skyGrad('dawn');
  let s = `<defs>${gd}</defs><rect width="1920" height="340" fill="url(#${id})"/>` + skyline(0, 1920, 340, 60, 220, 23, 0, .7);
  s += `<rect y="340" width="1920" height="740" fill="#4a3e34"/><path d="M0 340 H1920" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 40; i++) s += `<circle cx="${rnd(i) * 1920}" cy="${380 + rnd(i + 3) * 680}" r="${3 + rnd(i + 6) * 7}" fill="#3e342c"/>`;
  s += `<path d="M-50 720 H1970" stroke="#151817" stroke-width="150"/><path d="M-50 720 H1970" stroke="#1f2423" stroke-width="120"/><path d="M-50 770 H1970" stroke="#3a3f3e" stroke-width="6" stroke-dasharray="30 20"/>`;
  s += `<path d="M700 340 V650" stroke="#151817" stroke-width="60"/>` + `<ellipse cx="700" cy="340" rx="50" ry="10" fill="#3a3c3a"/>`;
  s += `<path d="M1100 900 Q1500 900 1700 760" stroke="#151817" stroke-width="110" fill="none"/>`;
  return s;
};
ENV.radiohand3 = (L) => ENV.radiohand(L).replace(/#2f5a3e/g, '#4a4d52');
