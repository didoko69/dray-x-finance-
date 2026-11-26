// ---------- Cruise ship environments (video 6) ----------
Object.assign(SKY, { sea: ['#5f9fd0', '#a8cde8', '#dcecf6'], seanight: ['#070b18', '#16223c', '#2c3c5e'], emerg: SKY.dark, blackout: SKY.dark });
const SEA = L => isNight(L) ? ['#1c3050', '#0a1628'] : ['#2f6b93', '#16405e'];
function seaBand(y0, y1, L, id = 'sea' + (gid++)) {
  const [a, b] = SEA(L);
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect x="0" y="${y0}" width="1920" height="${y1 - y0}" fill="url(#${id})"/>`;
  for (let i = 0; i < 40; i++) { const y = y0 + 10 + Math.pow(rnd(i + 3), 1.6) * (y1 - y0 - 10), w = 30 + (y - y0) / (y1 - y0) * 140; s += `<path d="M${rnd(i) * 1920} ${y} q${w / 2} -${4 + w * .04} ${w} 0" stroke="${isNight(L) ? '#1c2c44' : '#6fa4c8'}" stroke-width="${2 + (y - y0) / (y1 - y0) * 4}" fill="none" opacity=".7"/>`; }
  return s;
}
function skyBand(L, h) { const [id, gd] = skyGrad(L === 'day' ? 'sea' : (isNight(L) ? 'seanight' : L)); let s = `<defs>${gd}</defs><rect width="1920" height="${h}" fill="url(#${id})"/>`;
  if (isNight(L)) for (let i = 0; i < 70; i++) s += `<circle cx="${rnd(i) * 1920}" cy="${rnd(i + 40) * h * .9}" r="${1 + rnd(i + 5) * 1.5}" fill="#fff" opacity="${.2 + rnd(i + 7) * .5}"/>`;
  else for (let i = 0; i < 4; i++) s += `<g opacity=".8"><ellipse cx="${200 + i * 480 + rnd(i) * 100}" cy="${80 + rnd(i + 2) * 120}" rx="${120 + rnd(i) * 60}" ry="30" fill="#fff"/><ellipse cx="${260 + i * 480 + rnd(i) * 100}" cy="${60 + rnd(i + 2) * 120}" rx="70" ry="34" fill="#fff"/></g>`;
  return s;
}
// the ship in side profile (used for exterior shots)
function cruiseShip(x, y, s, L, opts = {}) {
  const lit = isNight(L);
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += P('M-640 -170 L700 -170 L640 0 L-560 0 Q-620 -60 -640 -170Z', '#f3f3ef', 7) + `<path d="M-628 -110 L688 -110 L680 -90 L-620 -90Z" fill="#23335a"/>`;
  for (let i = 0; i < 30; i++) g += C(-560 + i * 40, -55, 7, lit ? (rnd(i) > .7 ? '#ffd98a' : '#22324a') : '#2a3a52', 2);
  g += R(-560, -300, 1120, 130, '#f6f6f2', 6) + R(-500, -400, 980, 100, '#f6f6f2', 6) + R(-440, -480, 780, 80, '#f6f6f2', 6);
  for (const [yy, x0, n] of [[-270, -540, 36], [-230, -540, 36], [-370, -480, 31], [-455, -420, 25]]) for (let i = 0; i < n; i++) g += `<rect x="${x0 + i * 30}" y="${yy}" width="20" height="18" fill="${lit ? (rnd(i + yy) > .75 ? '#ffd98a' : '#1a2638') : '#3a5a7a'}"/>`;
  g += P('M340 -480 L520 -480 L560 -400 L340 -400Z', '#f6f6f2', 6) + `<path d="M360 -470 L510 -470 L540 -420 L360 -420Z" fill="#1a2a40"/>`;
  g += R(-200, -600, 110, 120, '#23335a', 6) + `<rect x="-200" y="-600" width="110" height="26" fill="#b0302a" stroke="${INK}" stroke-width="5"/>`;
  // empty lifeboat davits along the side
  for (let i = 0; i < 8; i++) { const dx = -470 + i * 120; g += `<rect x="${dx}" y="-205" width="90" height="34" fill="#cfd2d4" stroke="${INK}" stroke-width="3" opacity=".9"/><path d="M${dx + 10} -205 v-20 h70 v20" stroke="#8a9094" stroke-width="5" fill="none"/>`; }
  g += P('M-300 -600 V-660 M-310 -640 h20', 'none', 5) + `<path d="M480 -480 V-540" stroke="${INK}" stroke-width="5"/>`;
  return g + `</g>`;
}
const ENV6 = {};
ENV.socean = L => {
  let s = skyBand(L, 470) + seaBand(430, 1080, L);
  s += cruiseShip(960, 780, 1.05, L);
  s += `<path d="M1600 790 q-200 30 -600 20 q-400 -10 -700 30" stroke="#e9f2f8" stroke-width="10" fill="none" opacity=".7"/>`;
  return s;
};
ENV.sview = L => skyBand(L, 520) + seaBand(500, 1080, L); // nothing but ocean
ENV.scabin = L => {
  let s = `<rect width="1920" height="1080" fill="#e7dccb"/>` + `<rect y="0" width="1920" height="60" fill="#f2ece2"/>` + P('M0 60 H1920', 'none', 5);
  for (let i = 0; i < 24; i++) s += `<path d="M${i * 80} 60 V780" stroke="#ddd0bc" stroke-width="3"/>`;
  s += `<rect y="780" width="1920" height="300" fill="#3d4a66"/>` + P('M0 780 H1920', 'none', 6);
  for (let i = 0; i < 14; i++) s += `<path d="M${rnd(i) * 1920} ${820 + rnd(i + 2) * 240} l60 0" stroke="#33405a" stroke-width="5"/>`;
  // door (left)
  s += R(80, 260, 220, 520, '#8a6a4a', 7) + C(270, 540, 10, '#d4b45a', 4) + `<rect x="150" y="300" width="80" height="28" rx="4" fill="#d4b45a" stroke="${INK}" stroke-width="3"/>` + T(190, 322, 20, '047', '#3a2a1a', 900);
  // window (right)
  s += R(1240, 200, 420, 360, '#5a6470', 9);
  s += `<svg x="1260" y="220" width="380" height="320" viewBox="0 400 1920 680" preserveAspectRatio="xMidYMid slice">${skyBand(L, 520)}${seaBand(500, 1080, L)}</svg>`;
  s += P('M1450 220 V540', 'none', 10, 'stroke="#5a6470"') + `<path d="M1240 200 h-40 v380 h40 M1660 200 h40 v380 h-40" fill="#c8b8a0" stroke="${INK}" stroke-width="5"/>`;
  s += R(1220, 560, 460, 26, '#c9bfae', 5);
  // wardrobe + camera
  s += R(1720, 220, 200, 560, '#9a7a5a', 7) + P('M1820 220 V780', 'none', 5) + C(1805, 500, 7, '#d4b45a', 3) + C(1835, 500, 7, '#d4b45a', 3);
  s += R(1770, 160, 70, 40, '#2c2f36', 4, 'rx="8"') + C(1790, 182, 10, '#111', 3) + `<path d="M1805 200 v20" stroke="${INK}" stroke-width="5"/>`;
  // bed
  s += R(360, 420, 40, 380, '#6a4a2e', 6) + R(380, 600, 640, 150, '#f4f2ee', 7) + R(380, 560, 640, 60, '#f4f2ee', 6) + `<path d="M520 600 L1020 600 L1020 750 L520 750Z" fill="#3d5a8a" stroke="${INK}" stroke-width="6"/>`;
  s += `<ellipse cx="460" cy="575" rx="70" ry="26" fill="#fff" stroke="${INK}" stroke-width="5"/>` + R(380, 750, 640, 40, '#6a4a2e', 6);
  // nightstand + clock
  s += R(1050, 640, 140, 140, '#8a6a4a', 6) + R(1062, 590, 116, 54, '#151719', 5, 'rx="8"');
  // lamp + art
  s += P('M1100 590 V560', 'none', 4) + `<path d="M1070 520 h60 l14 40 h-88z" fill="#f2e6c8" stroke="${INK}" stroke-width="4"/>`;
  s += R(560, 200, 300, 200, '#f6f1e6', 6) + `<path d="M580 360 q60 -80 120 -20 q60 -60 140 10" stroke="#5a8ab0" stroke-width="10" fill="none"/>`;
  return s;
};
function corrBase(L, emerg) {
  const wall = emerg ? '#5a4a4c' : '#d8cfbf', wall2 = emerg ? '#4a3c3e' : '#cbbfac', ceil = emerg ? '#3a3234' : '#efe9dd', carpet = emerg ? '#4a1f24' : '#7a2a30';
  let s = `<rect width="1920" height="1080" fill="${ceil}"/>`;
  s += P('M0 0 L820 340 L820 600 L0 1080Z', wall, 6) + P('M1920 0 L1100 340 L1100 600 L1920 1080Z', wall2, 6) + P('M0 1080 L820 600 L1100 600 L1920 1080Z', carpet, 6);
  s += P('M380 1080 L900 600 L1020 600 L1540 1080Z', emerg ? '#2c3040' : '#24335a', 0, 'stroke="none"');
  for (let k = 0; k < 9; k++) { const u = k / 9, y = 600 + 480 * (1 - Math.pow(1 - u, 1)) ; }
  s += R(820, 340, 280, 260, emerg ? '#3a3234' : '#cfc6b6', 5);
  s += R(900, 380, 120, 220, emerg ? '#1a2028' : '#9fc0d0', 5) + P('M960 380 V600', 'none', 4);
  // doors: left & right walls
  for (let k = 0; k < 5; k++) { const u1 = .08 + k * .17, u2 = u1 + .09; const L1 = u => [820 * u, 340 * u, 1080 - 480 * u];
    const [xa, ta, ba] = L1(u1), [xb, tb, bb] = L1(u2); const hA = (ba - ta), hB = (bb - tb);
    s += `<path d="M${xa} ${ta + hA * .2} L${xb} ${tb + hB * .2} L${xb} ${bb} L${xa} ${ba}Z" fill="${emerg ? '#4a3a2c' : '#8a6a4a'}" stroke="${INK}" stroke-width="${5 - k * .6}"/>`;
    s += `<circle cx="${xb - (xb - xa) * .15}" cy="${tb + hB * .6}" r="${6 - k}" fill="#d4b45a"/>`;
    const xr = 1920 - xa, xr2 = 1920 - xb;
    s += `<path d="M${xr} ${ta + hA * .2} L${xr2} ${tb + hB * .2} L${xr2} ${bb} L${xr} ${ba}Z" fill="${emerg ? '#4a3a2c' : '#8a6a4a'}" stroke="${INK}" stroke-width="${5 - k * .6}"/>`;
    s += `<rect x="${xa + (xb - xa) * .3}" y="${ta + hA * .1}" width="${(xb - xa) * .4}" height="${hA * .05}" fill="#d4b45a"/>`; }
  for (let k = 0; k < 6; k++) { const u = k / 6, y = 340 * u * .95 + 10, w = 120 * (1 - u * .8); s += `<ellipse cx="960" cy="${y + 20}" rx="${w}" ry="${12 * (1 - u * .7)}" fill="${emerg ? '#6a2a2a' : '#fffbe8'}" stroke="${INK}" stroke-width="3"/>`; }
  return s;
}
ENV.scorr = L => corrBase(L, false);
ENV.scorre = L => corrBase(L, true);
ENV.sstairs = L => {
  let s = `<rect width="1920" height="1080" fill="#e9dfcc"/>` + `<rect y="820" width="1920" height="260" fill="#7a2a30"/>` + P('M0 820 H1920', 'none', 6);
  for (let i = 0; i < 12; i++) { const y = 820 - i * 52, x = 700 + i * 60; s += R(x, y - 52, 900 - i * 20, 52, i % 2 ? '#8a3036' : '#7a2a30', 5); }
  s += P('M640 820 L1340 196', 'none', 14, 'stroke="#c9a24a"') + P('M1640 820 L2040 196', 'none', 14, 'stroke="#c9a24a"');
  for (let i = 0; i < 12; i++) s += `<path d="M${680 + i * 58} ${780 - i * 52} v-90" stroke="#c9a24a" stroke-width="6"/>`;
  s += `<path d="M560 0 V120" stroke="${INK}" stroke-width="4"/><path d="M460 120 h200 l-40 60 h-120z" fill="#f2e6b8" stroke="${INK}" stroke-width="5"/>` + [480, 520, 560, 600, 640].map(x => `<path d="M${x} 180 v30" stroke="#d4b45a" stroke-width="4"/><circle cx="${x}" cy="214" r="7" fill="#fff8d8"/>`).join('');
  s += R(80, 200, 360, 260, '#f6f1e6', 7) + T(260, 300, 34, 'DECK 7', '#3a2a1a', 900) + T(260, 360, 24, '▲ 8 · 9 · 10', '#6a5a4a', 700) + T(260, 410, 24, '▼ 6 · 5 · 4', '#6a5a4a', 700);
  return s;
};
function table(x, y, sc, food = true) {
  let g = `<g transform="translate(${x},${y}) scale(${sc})">`;
  for (const a of [-1, 1]) g += `<path d="M${a * 150} -40 q${a * 10} -80 ${a * 4} -110" stroke="#b08a3a" stroke-width="14" fill="none"/><rect x="${a * 150 - 22}" y="-150" width="44" height="60" rx="10" fill="#c9a24a" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M-130 -20 L130 -20 L150 60 L-150 60Z" fill="#f4f2ee" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="-20" rx="140" ry="36" fill="#fbfaf6" stroke="${INK}" stroke-width="5"/>`;
  for (const [px, py] of [[-70, -22], [0, -34], [70, -22], [-30, -6], [40, -6]]) { g += `<ellipse cx="${px}" cy="${py}" rx="24" ry="9" fill="#fff" stroke="${INK}" stroke-width="3"/>`; if (food) g += `<circle cx="${px - 6}" cy="${py - 2}" r="6" fill="${['#c4632a', '#6a9a3a', '#d8b84a'][(px + 200) % 3]}"/><circle cx="${px + 7}" cy="${py - 1}" r="5" fill="#8a3a2a"/>`; }
  for (const gx of [-40, 30, 95]) g += `<path d="M${gx} -60 h14 l-3 26 h-8z" fill="${gx > 50 ? '#e0c050' : '#8a1a2a'}" stroke="${INK}" stroke-width="2.5" opacity=".9"/><path d="M${gx + 7} -34 v12" stroke="${INK}" stroke-width="2.5"/>`;
  g += `<path d="M-6 -50 v-30" stroke="#f2e6c8" stroke-width="8"/><circle cx="-6" cy="-84" r="5" fill="#ffd98a"/>`;
  return g + '</g>';
}
ENV.sdining = L => {
  let s = `<rect width="1920" height="1080" fill="#e3d5bc"/>` + `<rect y="0" width="1920" height="80" fill="#c9b48a"/>`;
  for (let i = 0; i < 6; i++) { const x = 90 + i * 300; s += R(x, 140, 220, 330, '#5a6470', 7) + `<svg x="${x + 10}" y="150" width="200" height="310" viewBox="700 300 500 700" preserveAspectRatio="xMidYMid slice">${skyBand(L, 520)}${seaBand(500, 1080, L)}</svg>` + P(`M${x + 110} 140 V470`, 'none', 7, 'stroke="#5a6470"'); }
  s += `<rect y="500" width="1920" height="580" fill="#8a3a36"/>` + P('M0 500 H1920', 'none', 6);
  for (let i = 0; i < 20; i++) s += `<path d="M${i * 110} 500 L${(i * 110 - 960) * 2.2 + 960} 1080" stroke="#7a3230" stroke-width="4"/>`;
  for (const x of [480, 1440]) s += `<path d="M${x} 0 V50" stroke="${INK}" stroke-width="4"/><ellipse cx="${x}" cy="70" rx="90" ry="24" fill="#f2e6b8" stroke="${INK}" stroke-width="5"/>` + [-60, -30, 0, 30, 60].map(d => `<path d="M${x + d} 90 v40" stroke="#d4b45a" stroke-width="3"/><circle cx="${x + d}" cy="134" r="6" fill="#fff8d8"/>`).join('');
  for (let i = 0; i < 7; i++) s += table(150 + i * 270, 600, .5);
  for (let i = 0; i < 5; i++) s += table(220 + i * 370, 760, .75);
  for (let i = 0; i < 3; i++) s += table(300 + i * 660, 980, 1.05);
  return s;
};
function sunbed(x, y, sc, towel) { return `<g transform="translate(${x},${y}) scale(${sc})"><path d="M-120 0 L80 0 L130 -60 L110 -70 L70 -20 L-120 -20Z" fill="#f4f2ee" stroke="${INK}" stroke-width="5"/><path d="M-110 0 v26 M70 0 v26" stroke="${INK}" stroke-width="6"/>${towel ? `<path d="M-90 -22 L40 -22 L50 -2 L-80 -2Z" fill="${towel}" stroke="${INK}" stroke-width="4"/>` : ''}</g>`; }
ENV.spool = L => {
  let s = skyBand(L, 440) + seaBand(410, 520, L);
  s += `<rect y="480" width="1920" height="40" fill="#e9eef2" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 25 }, (_, i) => `<path d="M${i * 80} 480 v40" stroke="#9aa4aa" stroke-width="4"/>`).join('') + P('M0 470 H1920', 'none', 8, 'stroke="#c9d0d4"');
  s += `<rect y="520" width="1920" height="560" fill="#d9c6a2"/>` + P('M0 520 H1920', 'none', 6);
  for (let i = 0; i < 16; i++) s += `<path d="M${i * 130} 520 L${(i * 130 - 960) * 1.9 + 960} 1080" stroke="#c4b08a" stroke-width="4"/>`;
  s += P('M560 600 L1360 600 L1580 920 L340 920Z', '#3fa7d6', 8) + P('M540 590 L1380 590 L1610 935 L310 935Z', 'none', 10, 'stroke="#f4f2ee"');
  s += P('M600 640 L1320 640', 'none', 3, 'stroke="#8fd3f0"');
  s += sunbed(160, 640, .7, '#3d7ac2') + sunbed(250, 760, .9, '#d84a3a') + sunbed(170, 900, 1.1, null) + sunbed(1760, 640, .7, null) + sunbed(1700, 780, .9, '#f2c418');
  s += `<path d="M1660 520 V300" stroke="${INK}" stroke-width="7"/><path d="M1480 330 Q1660 200 1840 330Z" fill="#e05a3a" stroke="${INK}" stroke-width="6"/><path d="M1540 330 Q1600 270 1660 330 Q1720 270 1780 330" stroke="#f4f2ee" stroke-width="10" fill="none"/>`;
  // drink + table, sunglasses
  s += R(1440, 820, 100, 14, '#f4f2ee', 4) + P('M1490 834 V900', 'none', 6) + `<path d="M1470 770 h34 l-6 50 h-22z" fill="#f4a73a" stroke="${INK}" stroke-width="4"/><rect x="1470" y="770" width="34" height="18" fill="#fff" opacity=".6"/><path d="M1496 770 l14 -30" stroke="#e05a3a" stroke-width="4"/>`;
  s += `<g transform="translate(250,742)"><circle cx="-22" cy="0" r="14" fill="#1a1a1a" stroke="${INK}" stroke-width="3"/><circle cx="18" cy="0" r="14" fill="#1a1a1a" stroke="${INK}" stroke-width="3"/><path d="M-8 0 h12" stroke="${INK}" stroke-width="3"/></g>`;
  return s;
};
ENV.sboat = L => { // lifeboat deck, looking out to sea along the empty davits
  let s = skyBand(L, 560) + seaBand(520, 760, L);
  s += `<rect y="760" width="1920" height="320" fill="#9aa4a6"/>` + P('M0 760 H1920', 'none', 6);
  for (let i = 0; i < 20; i++) s += `<path d="M${i * 110} 760 L${(i * 110 - 960) * 1.6 + 960} 1080" stroke="#8a9496" stroke-width="3"/>`;
  s += `<rect y="700" width="1920" height="12" fill="#c9d0d4" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 33 }, (_, i) => `<path d="M${i * 60} 712 v48" stroke="#c9d0d4" stroke-width="5"/>`).join('');
  for (const x of [220, 760, 1300, 1840]) {
    s += `<path d="M${x} 1000 V420 Q${x} 340 ${x + 80} 330 L${x + 170} 330" stroke="#e9ecee" stroke-width="30" fill="none"/><path d="M${x} 1000 V420 Q${x} 340 ${x + 80} 330 L${x + 170} 330" stroke="${INK}" stroke-width="36" fill="none" opacity=".25"/>`;
    s += `<rect x="${x - 60}" y="960" width="160" height="40" fill="#e98a2a" stroke="${INK}" stroke-width="5"/>` + T(x + 20, 990, 22, 'LIFEBOAT ' + (Math.round(x / 540) + 1), '#2a1a0a', 900);
    s += `<path d="M${x + 40} 900 h-60 M${x + 40} 900 v40 M${x - 20} 900 v40" stroke="#6a7276" stroke-width="10"/>`;
  }
  return s;
};
ENV.sbridge = L => {
  const n = isNight(L);
  let s = `<rect width="1920" height="1080" fill="${n ? '#1a1e26' : '#2e343e'}"/>`;
  s += `<svg x="0" y="80" width="1920" height="420" viewBox="0 200 1920 600" preserveAspectRatio="xMidYMid slice">${skyBand(L, 520)}${seaBand(500, 1080, L)}</svg>`;
  for (let i = 0; i <= 6; i++) s += `<rect x="${i * 320 - 14}" y="70" width="28" height="440" fill="${n ? '#262b34' : '#3a414c'}" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect y="0" width="1920" height="80" fill="${n ? '#20242c' : '#3a414c'}" stroke="${INK}" stroke-width="6"/><rect y="500" width="1920" height="40" fill="${n ? '#20242c' : '#3a414c'}" stroke="${INK}" stroke-width="6"/>`;
  s += P('M0 640 Q960 560 1920 640 L1920 820 Q960 740 0 820Z', '#3a404a', 7);
  for (let i = 0; i < 7; i++) s += R(140 + i * 240, 600 - Math.sin((i + .5) / 7 * Math.PI) * 50, 180, 110, '#0c1016', 5, 'rx="8"');
  s += `<rect y="820" width="1920" height="260" fill="${n ? '#14171c' : '#262b32'}"/>` + P('M0 820 Q960 740 1920 820', 'none', 6);
  for (const x of [640, 1240]) s += `<path d="M${x - 70} 780 h140 l-10 -150 h-120z" fill="#202328" stroke="${INK}" stroke-width="6"/><rect x="${x - 80}" y="770" width="160" height="40" rx="10" fill="#2a2d33" stroke="${INK}" stroke-width="6"/><path d="M${x} 810 v120 M${x - 60} 940 h120" stroke="${INK}" stroke-width="10"/>`;
  s += R(900, 700, 120, 60, '#2a2d33', 5) + `<path d="M960 700 v-60" stroke="#8a9094" stroke-width="12"/><circle cx="960" cy="636" r="16" fill="#c33a2f" stroke="${INK}" stroke-width="4"/>`;
  return s;
};
ENV.ssec = L => {
  let s = `<rect width="1920" height="1080" fill="#1c2128"/>` + `<rect y="760" width="1920" height="320" fill="#14171c"/>`;
  s += R(330, 90, 1260, 560, '#0c0e12', 8);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += R(360 + c * 305, 115 + r * 175, 285, 160, '#0a1a14', 5);
  s += P('M200 700 L1720 700 L1780 780 L140 780Z', '#3a3e46', 7) + R(780, 690, 360, 26, '#2a2d33', 4) + R(1220, 680, 60, 30, '#2a2d33', 4);
  s += `<path d="M900 1000 v-120 M840 1010 h120" stroke="${INK}" stroke-width="12"/><path d="M820 880 h160 l-14 -170 h-132z" fill="#22262c" stroke="${INK}" stroke-width="6"/>`;
  s += R(200, 620, 90, 80, '#2a2d33', 4) + C(245, 660, 26, '#3a3f46', 4); // speaker
  return s;
};
ENV.sengine = L => {
  let s = `<rect width="1920" height="1080" fill="#2a2e2c"/>`;
  for (let i = 0; i < 5; i++) s += `<rect y="${60 + i * 46}" width="1920" height="26" fill="${['#6a5a3a', '#4a5a5a', '#7a3a2a', '#5a5f60', '#4a4f50'][i]}" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 6 }, (_, k) => `<rect x="${120 + k * 330 + i * 40}" y="${54 + i * 46}" width="22" height="38" fill="#3a3a3a" stroke="${INK}" stroke-width="3"/>`).join('');
  for (const x of [120, 620, 1120]) { s += R(x, 360, 420, 400, '#5a6266', 8, 'rx="30"') + R(x + 40, 320, 340, 50, '#4a5256', 6, 'rx="10"');
    for (let k = 0; k < 6; k++) s += C(x + 60 + k * 60, 345, 10, '#8a9094', 3);
    s += C(x + 120, 520, 46, '#e9e6dc', 6) + `<path d="M${x + 120} 520 l26 -22" stroke="#c33a2f" stroke-width="5"/>` + R(x + 220, 470, 140, 200, '#4a5256', 5); }
  s += `<rect y="760" width="1920" height="320" fill="#3a3e3c"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M${i * 50} 760 v320" stroke="#2c302e" stroke-width="4"/>`).join('') + P('M0 760 H1920', 'none', 6);
  s += P('M0 740 H1920', 'none', 8, 'stroke="#e0b030"');
  s += R(1600, 520, 260, 180, '#202428', 6) + R(1630, 545, 200, 120, '#0a140c', 4) + R(1580, 700, 300, 60, '#33383c', 6); // terminal
  s += R(1640, 380, 180, 50, '#c33a2f', 5) + T(1730, 414, 22, 'DANGER', '#fff', 900);
  return s;
};
ENV.screw = L => { // restricted crew staircase
  let s = `<rect width="1920" height="1080" fill="#4a4f52"/>`;
  for (let i = 0; i < 14; i++) s += R(300 + i * 70, 960 - i * 60, 600, 60, '#5f6568', 5);
  s += P('M260 960 L1240 120', 'none', 12, 'stroke="#e0b030"') + P('M860 960 L1840 120', 'none', 12, 'stroke="#e0b030"');
  for (let i = 0; i < 14; i++) s += `<path d="M${300 + i * 70} ${930 - i * 60} v-80" stroke="#e0b030" stroke-width="5"/>`;
  s += `<rect y="960" width="1920" height="120" fill="#3a3e40"/>` + P('M0 960 H1920', 'none', 6);
  s += '<rect x="1240" y="0" width="680" height="140" fill="#3a3e40"/>' + P('M1240 140 H1920', 'none', 6);
  s += R(120, 340, 360, 140, '#e0b030', 6) + T(300, 400, 40, 'CREW ONLY', '#1a1a1a', 900) + T(300, 450, 26, 'RESTRICTED AREA', '#1a1a1a', 800);
  return s;
};
ENV.sroom = L => {
  let s = `<rect width="1920" height="1080" fill="#3a3f44"/>` + `<rect y="780" width="1920" height="300" fill="#2a2e32"/>` + P('M0 780 H1920', 'none', 6);
  s += P('M600 700 L1320 700 L1360 760 L560 760Z', '#4a4038', 6) + `<path d="M600 760 v220 M1320 760 v220" stroke="${INK}" stroke-width="12"/>`;
  s += R(820, 470, 280, 200, '#1c1f24', 6) + R(840, 490, 240, 150, '#0a0e14', 4) + `<path d="M960 670 v30 M910 700 h100" stroke="${INK}" stroke-width="10"/>`;
  s += R(80, 220, 260, 560, '#5a6066', 7) + C(300, 520, 9, '#9aa', 3);
  return s;
};
ENV.sphone = L => { // emergency telephone on a corridor wall
  let s = `<rect width="1920" height="1080" fill="#d8cfbf"/>` + `<rect y="880" width="1920" height="200" fill="#7a2a30"/>` + P('M0 880 H1920', 'none', 6);
  s += R(820, 300, 280, 380, '#c33a2f', 8, 'rx="14"') + R(860, 340, 200, 60, '#f4f2ee', 4) + T(960, 382, 30, 'EMERGENCY', '#c33a2f', 900);
  s += R(880, 430, 160, 200, '#2a2d33', 6, 'rx="20"');
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += R(890 + c * 50, 450 + r * 50, 36, 36, '#e9e6dc', 3);
  return s;
};
