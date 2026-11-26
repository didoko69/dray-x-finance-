// ---------- Hospital environments (video 4) ----------
Object.assign(SKY, { hosp: SKY.day, flickred: SKY.night });
const HW = '#d3ded6', HW2 = '#bccbc1', HF = '#c9cfc4', HT = '#7fa49c';
function hallway(L, o = {}) {
  const vx = 960, vy = 470, ew = 220, eh = 300;
  const wall = o.wall || HW, wall2 = o.wall2 || HW2, floor = o.floor || HF;
  let s = `<rect width="1920" height="1080" fill="${wall}"/>`;
  s += `<path d="M0 0 L${vx - ew} ${vy - eh / 2} L${vx - ew} ${vy + eh / 2} L0 1080Z" fill="${wall}"/><path d="M1920 0 L${vx + ew} ${vy - eh / 2} L${vx + ew} ${vy + eh / 2} L1920 1080Z" fill="${wall2}"/>`;
  s += `<path d="M0 1080 L${vx - ew} ${vy + eh / 2} H${vx + ew} L1920 1080Z" fill="${floor}"/><path d="M0 0 L${vx - ew} ${vy - eh / 2} H${vx + ew} L1920 0Z" fill="#e6ece6"/>`;
  for (let k = 0; k < 8; k++) { const f = Math.pow(.66, k), xl = vx - ew - (vx - ew) * f, xr = vx + ew + (1920 - vx - ew) * f, yb = vy + eh / 2 + (1080 - vy - eh / 2) * f, yt = vy - eh / 2 - (vy - eh / 2) * f;
    s += `<path d="M${xl} ${yb} H${xr}" stroke="#b5bcb1" stroke-width="${1 + 3 * f}"/>`;
    s += `<rect x="${vx - 120 * f - 30}" y="${yt + 10 * f}" width="${240 * f + 60}" height="${8 + 10 * f}" rx="4" fill="#f4f8f2" stroke="#9aa59c" stroke-width="2"/>`; }
  // handrails + skirting
  s += `<path d="M0 640 L${vx - ew} ${vy + 60}" stroke="${HT}" stroke-width="14"/><path d="M1920 640 L${vx + ew} ${vy + 60}" stroke="${HT}" stroke-width="14"/>`;
  s += `<path d="M0 1000 L${vx - ew} ${vy + eh / 2 - 6}" stroke="${HT}" stroke-width="10"/><path d="M1920 1000 L${vx + ew} ${vy + eh / 2 - 6}" stroke="${HT}" stroke-width="10"/>`;
  // side doors
  s += P('M140 300 L360 360 L360 860 L140 930Z', o.door || '#9fb8b0', 6) + P('M1780 300 L1560 360 L1560 860 L1780 930Z', o.door || '#9fb8b0', 6);
  s += `<g transform="translate(250,380) skewY(15)">${R(-70, -30, 140, 46, '#2f6a5a', 4)}${T(0, 2, 20, o.signL || 'X-RAY', '#fff', 800)}</g><g transform="translate(1670,380) skewY(-15)">${R(-70, -30, 140, 46, '#2f6a5a', 4)}${T(0, 2, 20, o.signR || 'TRIAGE', '#fff', 800)}</g>`;
  // end wall
  s += `<rect x="${vx - ew}" y="${vy - eh / 2}" width="${ew * 2}" height="${eh}" fill="${o.end || '#c4d2c9'}"/>`;
  return s;
}
ENV.edcorr = (L) => { let s = hallway(L, { signL: 'X-RAY', signR: 'TRIAGE' });
  s += R(840, 360, 240, 260, '#8a9a94', 5) + `<path d="M960 360 v260" stroke="${INK}" stroke-width="5"/>` + `<rect x="860" y="400" width="80" height="60" fill="#3a4a46"/><rect x="980" y="400" width="80" height="60" fill="#3a4a46"/>` + R(860, 330, 200, 30, '#c33a2f', 4) + T(960, 352, 20, 'EMERGENCY', '#fff', 900);
  return s; };
ENV.maincorr = (L) => { let s = hallway(L, { signL: 'WARD A', signR: 'RECORDS' });
  s += `<rect x="740" y="320" width="440" height="300" fill="#7a8a84"/><rect x="760" y="340" width="400" height="280" fill="#2a3432"/>`;
  s += `<g transform="translate(1400,430) skewY(-15)">${R(-110, -80, 220, 160, '#f1ece2', 5)}${T(0, -52, 18, 'EMERGENCY MAP', '#2f4a4c', 900)}<rect x="-90" y="-36" width="70" height="40" fill="#cfe3d8"/><rect x="-10" y="-36" width="90" height="40" fill="#f3d8d0"/><rect x="-90" y="14" width="170" height="40" fill="#e6dfd0"/></g>`;
  return s; };
ENV.laundry = (L) => { let s = hallway(L, { wall: '#aab6ae', wall2: '#9aa69e', floor: '#a9ada4', door: '#7d8a84', signL: 'LAUNDRY', signR: 'LINEN', end: '#8a968e' });
  s += R(880, 360, 160, 260, '#6a7470', 6) + `<rect x="1030" y="360" width="10" height="260" fill="#060707"/>` + R(890, 330, 140, 30, '#c33a2f', 4) + T(960, 352, 20, 'WARD 6', '#fff', 900);
  for (const [x, y, s2] of [[420, 900, 1], [1500, 920, 1.1]]) s += `<g transform="translate(${x},${y}) scale(${s2})">${R(-110, -120, 220, 120, '#7d8588', 5, 'rx="8"')}<path d="M-100 -120 q50 -40 100 -10 q60 -30 100 10" fill="#e9e6dc" stroke="${INK}" stroke-width="4"/>${C(-80, 12, 12, '#333', 4)}${C(80, 12, 12, '#333', 4)}</g>`;
  return s; };
ENV.hext = (L) => {
  const [id, gd] = skyGrad(L);
  let s = `<defs>${gd}</defs><rect width="1920" height="1080" fill="url(#${id})"/>` + skyline(0, 700, 520, 60, 220, 33, 0, .6);
  s += R(560, 180, 1400, 640, '#d6dcd6', 8) + Array.from({ length: 3 }, (_, r) => Array.from({ length: 7 }, (_, c) => R(620 + c * 190, 230 + r * 110, 130, 70, '#5d7896', 4)).join('')).join('');
  s += R(860, 130, 820, 70, '#2f6a5a', 6) + T(1270, 180, 44, 'RIVERSIDE GENERAL HOSPITAL', '#fff');
  s += `<path d="M1050 560 h560 l40 -40 h-640z" fill="#9aa1a4" stroke="${INK}" stroke-width="6"/>` + T(1330, 548, 30, 'EMERGENCY · AMBULANCE', '#c33a2f', 900);
  s += R(1150, 600, 360, 220, '#2a3440', 7) + `<path d="M1330 600 v220" stroke="${INK}" stroke-width="6"/><rect x="1310" y="600" width="40" height="220" fill="#0d1216"/>`;
  s += `<rect y="820" width="1920" height="260" fill="#8a8a84"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/><path d="M0 960 H1920" stroke="#e9e6dc" stroke-width="8" stroke-dasharray="80 60"/>`;
  s += `<g transform="translate(560,820)">${R(-200, -200, 300, 190, '#f1ece2', 7, 'rx="10"')}${P('M100 -150 h90 l40 60 v80 h-130z', '#f1ece2', 7)}<path d="M-120 -140 v60 M-150 -110 h60" stroke="#c33a2f" stroke-width="16"/><rect x="-200" y="-70" width="430" height="16" fill="#c33a2f"/>${C(-130, 0, 30, '#222', 6)}${C(150, 0, 30, '#222', 6)}</g>`;
  return s;
};
ENV.reception = (L) => {
  let s = `<rect width="1920" height="1080" fill="${HW}"/><rect y="0" width="1920" height="100" fill="#e6ece6"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="${150 + i * 360}" y="40" width="220" height="16" rx="8" fill="#f4f8f2" stroke="#9aa59c" stroke-width="2"/>`).join('');
  s += tiles(820, 1080, HF, '#b5bcb1') + `<rect y="812" width="1920" height="14" fill="${HT}"/>`;
  s += windowOutside(60, 220, 360, 520, 'day', { city: .8 }) + `<path d="M60 220 h360 v520 h-360z M240 220 v520" stroke="#5a6a64" stroke-width="12" fill="none"/>`;
  s += R(1000, 600, 620, 220, '#e9e6dc', 7) + R(980, 580, 660, 30, HT, 6) + R(1180, 470, 260, 60, '#2f6a5a', 5) + T(1310, 512, 30, 'RECEPTION', '#fff');
  s += R(1300, 210, 300, 180, '#14181a', 7, 'rx="6"');
  for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) s += P(`M${520 + i * 80} ${740 + r * 110} h66 v-56 q0 -10 -10 -10 h-46 q-10 0 -10 10z`, '#7fa49c', 5);
  s += `<g transform="translate(760,940) rotate(-80)">${C(0, 0, 60, 'none', 8)}${R(-20, -90, 100, 20, '#7d8588', 5)}${C(70, 40, 18, 'none', 6)}</g>`;
  for (let i = 0; i < 14; i++) s += `<rect x="${300 + rnd(i) * 1400}" y="${860 + rnd(i + 3) * 180}" width="60" height="44" fill="#f4f1e8" stroke="#9a948a" stroke-width="2" transform="rotate(${rnd(i + 7) * 60 - 30} ${330 + rnd(i) * 1400} ${880 + rnd(i + 3) * 180})"/>`;
  return s;
};
ENV.apartment = (L) => {
  let s = `<rect width="1920" height="1080" fill="#6a5e52"/><rect y="820" width="1920" height="260" fill="#5a4a3a"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += windowOutside(1300, 200, 420, 340, 'eve', { city: .7 }) + `<path d="M1300 200 h420 v340 h-420z M1510 200 v340" stroke="#3a3028" stroke-width="12" fill="none"/>`;
  s += P('M640 700 q0 -50 50 -50 h420 q50 0 50 50 v120 h-520z', '#7a4a3a', 7) + R(600, 720, 70, 100, '#6a3a2a', 7, 'rx="20"') + R(1130, 720, 70, 100, '#6a3a2a', 7, 'rx="20"');
  s += R(200, 300, 260, 520, '#5a4a3a', 7) + `<path d="M200 470 h260 M200 640 h260" stroke="${INK}" stroke-width="6"/>`;
  return s;
};
ENV.streeth = (L) => ENV.street3('day');
ENV.pharm = (L) => {
  let s = `<rect width="1920" height="1080" fill="${HW}"/>` + tiles(840, 1080, HF, '#b5bcb1') + `<rect y="832" width="1920" height="14" fill="${HT}"/>`;
  s += R(300, 300, 280, 540, '#9fb8b0', 7) + `<rect x="320" y="330" width="240" height="200" fill="#cfe0ff" opacity=".5"/>` + R(330, 220, 220, 50, '#2f6a5a', 5) + T(440, 255, 28, 'PHARMACY', '#fff');
  s += R(410, 160, 60, 40, '#3a3f42', 4, 'rx="6"');
  s += shelfUnit(700, 260, 520, 580, 5, 81) + shelfUnit(1260, 260, 520, 580, 5, 91);
  return s;
};
ENV.glassdoor = (L) => {
  let s = `<rect width="1920" height="1080" fill="${HW}"/>` + tiles(860, 1080, HF, '#b5bcb1');
  s += windowOutside(540, 220, 840, 640, 'day', { city: .75 }) + `<path d="M540 220 h840 v640 h-840z M960 220 v640" stroke="#4a5a54" stroke-width="20" fill="none"/>`;
  s += R(520, 180, 880, 40, '#7d8588', 5) + R(900, 480, 30, 120, '#9aa1a4', 4, 'rx="8"') + R(990, 480, 30, 120, '#9aa1a4', 4, 'rx="8"') + T(960, 150, 34, 'MAIN ENTRANCE', '#2f4a4c');
  return s;
};
ENV.ambay = (L) => {
  let s = `<rect width="1920" height="1080" fill="#b9c4bc"/>` + tiles(860, 1080, '#b5b9b0', '#9fa49a');
  s += R(520, 200, 880, 660, '#7d8588', 8) + `<rect x="540" y="220" width="410" height="640" fill="#9aa59f"/><rect x="970" y="220" width="410" height="640" fill="#9aa59f"/>` + `<rect x="600" y="300" width="290" height="200" fill="#5d7896"/><rect x="1030" y="300" width="290" height="200" fill="#5d7896"/>`;
  s += R(800, 140, 320, 60, '#c33a2f', 5) + T(960, 182, 30, 'AMBULANCE EXIT', '#fff');
  s += R(1440, 480, 100, 140, '#3a3f42', 5, 'rx="8"') + `<circle cx="1490" cy="520" r="14" fill="#c33a2f"/>`;
  return s;
};
ENV.nurses = (L) => {
  let s = `<rect width="1920" height="1080" fill="${HW}"/>` + tiles(860, 1080, HF, '#b5bcb1') + `<rect y="0" width="1920" height="90" fill="#e6ece6"/>`;
  s += `<rect x="0" y="240" width="1920" height="40" fill="${HT}"/>` + T(960, 270, 28, 'NURSES’ STATION', '#fff');
  s += R(1250, 380, 140, 100, '#14181a', 5, 'rx="6"') + `<path d="M1260 440 l20 -20 l20 30 l20 -40 l20 30 l20 -10" stroke="#4fe07a" stroke-width="4" fill="none"/>`;
  s += R(1500, 320, 300, 520, '#9fb8b0', 7) + R(200, 320, 220, 520, '#9fb8b0', 7);
  return s;
};
ENV.nursesfront = (L) => R(240, 700, 1440, 180, '#e9e6dc', 8) + R(220, 680, 1480, 30, HT, 6);
ENV.records = (L) => {
  let s = `<rect width="1920" height="1080" fill="#c9d2c9"/>` + tiles(860, 1080, '#b9bfb4', '#a5ab9f');
  s += R(250, 300, 260, 560, '#9fb8b0', 7) + `<rect x="300" y="340" width="160" height="110" fill="#2a3432"/>` + T(380, 500, 24, 'RECORDS', '#2f4a4c', 900);
  for (let i = 0; i < 3; i++) { s += R(620 + i * 130, 340, 110, 520, '#7d8588', 6); for (let k = 0; k < 4; k++) s += R(630 + i * 130, 360 + k * 125, 90, 105, '#8a9294', 3) + `<rect x="${660 + i * 130}" y="${400 + k * 125}" width="30" height="10" rx="5" fill="#3a3f42"/>`; }
  s += R(1100, 660, 640, 30, '#6b4a2e', 6) + P('M1130 690 v170 M1710 690 v170', 'none', 10) + R(1300, 470, 280, 190, '#2c2f36', 7, 'rx="10"') + `<rect x="1320" y="490" width="240" height="140" fill="#0d1a14"/>` + R(1400, 660, 80, 12, '#555', 3);
  return s;
};
ENV.idcard = (L) => {
  let s = `<rect width="1920" height="1080" fill="#2a3432"/>` + `<rect x="560" y="0" width="800" height="1080" fill="#ecebe6"/><path d="M560 0 L760 1080 M1360 0 L1160 1080" stroke="#cfcfca" stroke-width="10"/>`;
  s += `<g transform="rotate(-4 960 560)">${R(700, 360, 520, 340, '#fff', 7, 'rx="20"')}<rect x="700" y="360" width="520" height="80" rx="20" fill="#2f6a5a"/>${T(960, 412, 32, 'RIVERSIDE GENERAL', '#fff')}${C(800, 560, 70, '#5a3a26', 6)}<path d="M738 540 Q740 486 800 484 Q860 486 862 540 Q850 512 800 510 Q750 512 738 540Z" fill="#8f8f8f"/>${T(1040, 560, 52, 'DR. ELIAS', '#222', 900)}${T(1040, 620, 26, 'EMERGENCY MEDICINE', '#555', 700)}</g>`;
  s += `<path d="M960 0 v360" stroke="#3f6f9a" stroke-width="18"/>`;
  return s;
};
ENV.ward = (L) => {
  let s = `<rect width="1920" height="1080" fill="${HW}"/>` + tiles(860, 1080, HF, '#b5bcb1') + `<rect y="0" width="1920" height="90" fill="#e6ece6"/>`;
  for (const x of [200, 760, 1320]) s += R(x, 700, 380, 80, '#f4f1e8', 6, 'rx="10"') + R(x - 10, 600, 40, 180, '#9aa1a4', 5) + R(x + 340, 660, 40, 120, '#9aa1a4', 5) + P(`M${x + 20} 780 v80 M${x + 360} 780 v80`, 'none', 8) + R(x + 30, 660, 110, 44, '#ffffff', 4, 'rx="14"') + `<path d="M${x} 300 q40 30 0 60 q40 30 0 60 q40 30 0 60 v120" stroke="#a9c7c0" stroke-width="20" fill="none" opacity=".7"/>`;
  s += R(1720, 420, 120, 90, '#14181a', 5, 'rx="6"') + `<path d="M1730 470 l20 -20 l20 30 l20 -40 l20 30" stroke="#4fe07a" stroke-width="4" fill="none"/>` + P('M1780 510 v350', 'none', 8);
  s += windowOutside(700, 180, 520, 300, L === 'memory' ? 'day' : 'night', { city: .8 }) + `<path d="M700 180 h520 v300 h-520z M960 180 v300" stroke="#5a6a64" stroke-width="12" fill="none"/>`;
  return s;
};
ENV.ward6in = (L) => {
  let s = `<rect width="1920" height="1080" fill="#b9c6be"/>` + tiles(860, 1080, '#aab2a8', '#969e94') + `<rect width="1920" height="90" fill="#cfd8d0"/>`;
  s += R(700, 700, 520, 90, '#f4f1e8', 7, 'rx="12"') + R(680, 560, 50, 230, '#9aa1a4', 5) + P('M720 790 v70 M1200 790 v70', 'none', 8) + R(760, 650, 140, 54, '#fff', 4, 'rx="16"');
  s += P('M1300 860 V300 M1260 300 h80', 'none', 8) + `<path d="M1300 320 q30 20 0 60" stroke="#a9c7c0" stroke-width="10" fill="none"/>` + R(1420, 420, 140, 100, '#14181a', 5, 'rx="6"') + `<path d="M1430 470 h120" stroke="#4fe07a" stroke-width="4"/>`;
  s += T(960, 200, 46, 'WARD 6 · ISOLATION', '#7a2a22', 900);
  return s;
};
ENV.ward6close = (L) => {
  let s = `<rect width="1920" height="1080" fill="#6a7470"/>` + R(560, 100, 800, 900, '#5a6460', 10) + `<rect x="600" y="140" width="720" height="860" fill="#050606"/>`;
  s += R(1320, 100, 60, 900, '#7d8a84', 6) + R(700, 50, 520, 50, '#c33a2f', 5) + T(960, 88, 32, 'WARD 6', '#fff');
  s += `<rect y="1000" width="1920" height="80" fill="#8a8e86"/>`;
  return s;
};
ENV.stairdoor = (L) => {
  let s = `<rect width="1920" height="1080" fill="${HW2}"/>` + tiles(860, 1080, HF, '#b5bcb1');
  s += R(660, 220, 600, 640, '#6b7476', 9) + `<path d="M660 220 h600" stroke="#d8b52a" stroke-width="22" stroke-dasharray="40 30"/>` + R(760, 300, 400, 120, '#c33a2f', 6) + T(960, 352, 40, 'SECURITY DOOR', '#fff') + T(960, 396, 24, 'BASEMENT · AUTHORIZED ONLY', '#fff', 700);
  s += R(1300, 480, 90, 130, '#2c2f36', 6, 'rx="8"') + `<circle cx="1345" cy="520" r="14" fill="#ff3b3b"/>` + R(800, 520, 320, 40, '#9aa1a4', 6, 'rx="12"');
  return s;
};
ENV.generator = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3f4542"/><rect y="860" width="1920" height="220" fill="#4f504a"/><path d="M0 860 H1920" stroke="${INK}" stroke-width="8"/>`;
  s += `<path d="M0 120 H1920 M0 170 H1920" stroke="#5a6a6a" stroke-width="26"/>`;
  s += R(80, 300, 220, 560, '#2a2e2c', 8) + T(190, 280, 24, 'BASEMENT', '#c9b25a', 900);
  s += R(420, 420, 620, 440, '#5f6a4a', 9, 'rx="16"') + R(460, 470, 220, 160, '#3a3f30', 5) + Array.from({ length: 8 }, (_, i) => `<path d="M720 ${470 + i * 44} h280" stroke="#4a5238" stroke-width="12"/>`).join('') + T(730, 820, 34, 'GENERATOR', '#d8b52a', 900) + P('M1040 520 h120 v-300', 'none', 26);
  s += R(1340, 380, 260, 340, '#d6cdb5', 8, 'rx="12"') + T(1470, 420, 22, 'MANUAL LOCKDOWN', '#2f4a4c', 900) + T(1470, 448, 22, 'CONTROL', '#2f4a4c', 900);
  for (let i = 0; i < 6; i++) s += `<circle cx="${1390 + (i % 3) * 80}" cy="${490 + Math.floor(i / 3) * 50}" r="14" fill="${i === 0 ? '#c33a2f' : '#3a3f42'}" stroke="${INK}" stroke-width="3"/>`;
  s += R(1430, 590, 80, 110, '#c33a2f', 6, 'rx="8"') + R(1455, 560, 30, 70, '#9aa1a4', 5);
  return s;
};
ENV.switch = (L) => {
  let s = `<rect width="1920" height="1080" fill="#3a3f3c"/>` + R(460, 160, 1000, 760, '#d6cdb5', 9, 'rx="30"') + T(960, 250, 52, 'EMERGENCY SHUTDOWN', '#2f4a4c', 900);
  s += R(820, 340, 280, 480, '#c33a2f', 8, 'rx="20"') + T(960, 880, 34, 'OFF  ◀  ▶  ON', '#2f4a4c', 900);
  return s;
};
ENV.radiohand4 = (L) => ENV.radiohand(L).replace(/#2f5a3e/g, '#2e3b5a');
ENV.glassfinal = (L) => {
  let s = `<rect width="1920" height="1080" fill="#8a948e"/>` + R(360, 120, 1200, 900, '#4a5a54', 10) + `<rect x="400" y="160" width="1120" height="860" fill="#1a2422"/><rect x="400" y="560" width="1120" height="460" fill="#2a3432"/>`;
  s += `<path d="M960 160 v860" stroke="#4a5a54" stroke-width="20"/>` + R(560, 80, 800, 50, '#c33a2f', 5) + T(960, 118, 30, 'EMERGENCY · AMBULANCE', '#fff');
  return s;
};
