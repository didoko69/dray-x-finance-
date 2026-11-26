// ---------- Video 4 cards + fx ----------
const _card3 = cardSVG, _fx3 = fxSVG, _icon3 = icon2;
icon2 = function (k, x, y, s = 1) {
  const g = i => `<g transform="translate(${x},${y}) scale(${s})">${i}</g>`;
  if (k === 'antiseptic') return g(`<rect x="-26" y="-40" width="52" height="84" rx="8" fill="#8a5a3a" stroke="${INK}" stroke-width="4"/><rect x="-14" y="-58" width="28" height="20" fill="#f1ece2" stroke="${INK}" stroke-width="4"/><rect x="-26" y="-10" width="52" height="30" fill="#f1ece2"/><path d="M0 -6 v22 M-11 5 h22" stroke="#3a9a5a" stroke-width="6"/>`);
  if (k === 'gloves') return g(`<path d="M-30 40 v-50 q0 -12 8 -12 v-20 q0 -8 7 -8 q7 0 7 8 v-6 q0 -8 7 -8 q7 0 7 8 v4 q0 -8 7 -8 q7 0 7 8 v40 q0 30 -20 44z" fill="#9fd0e8" stroke="${INK}" stroke-width="4"/>`);
  return _icon3(k, x, y, s);
};
const HZ = { reception: [300, 640, 420, 220, 'RECEPTION'], ed: [300, 300, 420, 300, 'EMERGENCY DEPT'], pharmacy: [760, 300, 300, 200, 'PHARMACY'], nurses: [760, 540, 300, 140, 'NURSES’ STATION'], ward: [1100, 300, 300, 240, 'PATIENT WARD'], records: [1100, 580, 300, 140, 'RECORDS'], ward6: [1440, 300, 240, 240, 'WARD 6'], laundry: [1440, 580, 240, 140, 'LAUNDRY'], base: [760, 780, 920, 140, 'BASEMENT · GENERATOR'], amb: [300, 880, 420, 80, 'AMBULANCE BAY'] };
function hospMap(c, p, t) {
  let s = T(960, 110, 46, 'RIVERSIDE GENERAL · EMERGENCY MAP', '#2f4a4c') + R(260, 260, 1460, 720, '#e6dfd0', 7, 'rx="8"');
  const sealed = { zones: [], ed: ['ed'], ph: ['ed', 'pharmacy'], base: ['ed', 'pharmacy', 'base'], isolation: [], control: ['base'], exits: [], laundry: [], unlock: [], pharmacy: [] }[c.mode] || [];
  for (const k in HZ) { const [x, y, w, h, lab] = HZ[k]; const isSealed = sealed.includes(k); const hl = (c.mode === 'pharmacy' && k === 'pharmacy') || (c.mode === 'isolation' && k === 'ward6') || (c.mode === 'control' && k === 'base');
    let fill = hl ? '#fff3c4' : '#d6cdb5'; if (c.mode === 'zones') fill = ['#d8e8f0', '#f0dcd8', '#e0f0d8', '#f0ecd0'][Object.keys(HZ).indexOf(k) % 4];
    s += R(x, y, w, h, fill, 4, 'rx="6"') + T(x + w / 2, y + h / 2 + 8, 22, lab, '#3a4546', 800);
    if (isSealed) { const a = (k === sealed[sealed.length - 1]) ? clamp(p * 5, 0, 1) : 1; s += `<g opacity="${a}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#c33a2f" opacity=".25"/><rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" rx="6" fill="none" stroke="#c33a2f" stroke-width="6"/>${T(x + w / 2, y + h - 20, 26, 'SEALED', '#c33a2f', 900)}</g>`; } }
  const ex = (x, y, lab, col) => C(x, y, 26, col, 5) + T(x, y + 10, 26, '⇧', '#fff', 900) + T(x + 36, y + 9, 22, lab, col, 900, 'start');
  if (c.mode === 'exits' || c.mode === 'unlock') { s += ex(250, 760, '', c.mode === 'unlock' ? '#2f8a4a' : '#c33a2f') + ex(250, 920, '', c.mode === 'unlock' ? '#2f8a4a' : '#c33a2f'); if (c.mode === 'unlock') s += T(960, 1030, 34, 'Power off  →  exits may unlock?', '#2f8a4a', 900, 'middle', `opacity="${clamp(p * 3, 0, 1)}"`); }
  if (c.mode === 'laundry' || c.mode === 'control') { const pts = c.mode === 'laundry' ? [[1250, 650], [1250, 560], [1560, 560], [1560, 650], [1560, 760], [1200, 850]] : [[1250, 650], [1200, 850]];
    let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    s += `<path d="M${pts.map(q => q.join(' ')).join(' L')}" stroke="${c.mode === 'laundry' ? '#2f8a4a' : '#c9a24a'}" stroke-width="10" fill="none" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - ease(clamp(p * 1.3, 0, 1)))}" stroke-linecap="round"/>`;
    if (c.mode === 'control') s += `<rect x="760" y="780" width="920" height="140" rx="6" fill="none" stroke="#c9a24a" stroke-width="8"/>` + T(1220, 770, 26, 'MANUAL LOCKDOWN CONTROL', '#8a6a1a', 900);
    if (c.mode === 'laundry') s += `<path d="M1180 700 l40 40 M1220 700 l-40 40" stroke="#c33a2f" stroke-width="8"/>` + T(1200, 690, 20, 'STAIRS BLOCKED', '#c33a2f', 900); }
  if (c.mode === 'isolation') for (let i = 0; i < 5; i++) { const q = clamp(p * 1.5 - i * .15, 0, 1); s += `<circle cx="${1250 + (1560 - 1250) * q}" cy="${420 + i * 20}" r="10" fill="#5a5f58" opacity="${q > 0 ? 1 : 0}"/>`; }
  return s;
}
cardSVG = function (c, p, t, dur) {
  if (c.t === 'hmap') return `<rect width="1920" height="1080" fill="${CREAM}"/>` + hospMap(c, p, t);
  if (c.t === 'pa' && (c.amara || c.red)) {
    let s = `<rect width="1920" height="1080" fill="${c.amara ? '#1d1418' : '#1a0c0c'}"/>` + `<g transform="translate(960,320)">${P('M-120 -60 h80 l90 -70 v260 l-90 -70 h-80z', '#d6cdb5', 8)}</g>`;
    let wv = 'M560 560'; for (let x = 0; x <= 800; x += 8) wv += ` L${560 + x} ${560 + Math.sin(x * .05 + t * 9) * 40 * Math.abs(Math.sin(t * 4 + x * .01)) * (c.amara ? (rnd(Math.floor(t * 8) + x) > .9 ? 2 : 1) : 1)}`;
    s += `<path d="${wv}" stroke="${c.amara ? '#e8a0b8' : '#ff5a4a'}" stroke-width="5" fill="none"/>`;
    const q = clamp(p * 1.4, 0, 1), n1 = Math.floor(q * 2 * c.a.length), n2 = Math.floor(clamp(q * 2 - 1, 0, 1) * (c.b || '').length);
    s += T(960, 760, c.amara ? 80 : 70, c.a.slice(0, n1), c.amara ? '#f4e0e8' : '#ff8a7a', 800, 'middle', c.amara ? 'font-style="italic"' : '') + T(960, 860, 54, (c.b || '').slice(0, n2), c.amara ? '#f4e0e8' : '#f1ece2', 700, 'middle', c.amara ? 'font-style="italic"' : '');
    if (c.amara) s += T(960, 980, 28, 'HOSPITAL SPEAKERS', '#8a6a76', 800, 'middle', 'letter-spacing="6"');
    return s; }
  if (c.t === 'items' && c.note) { const s = _card3(Object.assign({}, c, { note: undefined }), p, t, dur); return s + T(960, 960, 50, c.note, '#c33a2f', 900, 'middle', `opacity="${clamp((p - .5) * 4, 0, 1)}"`); }
  if (c.t === 'screen') {
    let s = `<rect width="1920" height="1080" fill="#0e1412"/>` + R(220, 90, 1480, 900, '#2c2f36', 12, 'rx="24"') + `<rect x="270" y="140" width="1380" height="800" fill="#0b1a14"/>`;
    const G = '#7fe0a0', D = '#3a6a4a', st = c.stage;
    s += T(310, 200, 34, 'RIVERSIDE GENERAL · EVACUATION REPORT', G, 800, 'start') + `<path d="M310 220 H1610" stroke="${D}" stroke-width="3"/>`;
    if (st <= 3) { const rows = [['EMERGENCY DEPT', 'EVACUATED'], ['PATIENT WARD A', 'EVACUATED'], ['PHARMACY STAFF', 'EVACUATED'], ['ADMIN', 'EVACUATED'], ['WARD 6', 'SEALED']];
      rows.forEach((r, i) => { if (i === 4 && st < 2) return; const red = i === 4 && st >= 3; s += T(330, 300 + i * 80, 40, r[0], red ? '#ff6a5a' : G, 700, 'start') + T(1580, 300 + i * 80, 40, r[1], red ? '#ff6a5a' : (i === 4 ? '#ffc04a' : G), 900, 'end'); if (red) s += `<rect x="310" y="${250 + i * 80}" width="1300" height="66" fill="none" stroke="#ff6a5a" stroke-width="4" opacity="${.6 + .4 * Math.sin(t * 6)}"/>`; });
      if (st >= 1) s += T(330, 760, 32, 'Most staff evacuated.', G, 600, 'start', `opacity="${st === 1 ? clamp(p * 4, 0, 1) : 1}"`); }
    else { s += T(310, 270, 36, 'WARD 6 · PATIENT LIST', G, 800, 'start');
      const names = ['PATIENT 011', 'PATIENT 012', 'PATIENT 013', 'PATIENT 014', 'PATIENT 015', 'PATIENT 016', 'PATIENT 017'];
      const off = st >= 9 ? -120 * clamp(st === 9 ? p * 2 : 1, 0, 1) : 0;
      names.forEach((n, i) => { const y = 340 + i * 62 + off; if (y < 300) return; const last = i === 6; const show = st >= 5 || i < 6 * clamp(p * 2, 0, 1);
        if (!show && st === 4) return; s += T(330, y, 34, n, last && st >= 7 ? '#ff6a5a' : G, 700, 'start');
        if (st >= 6) s += T(1580, y, 34, last ? (st >= 7 ? (st >= 8 ? 'STATUS UNKNOWN' : '???') : '') : 'TRANSFERRED', last && st >= 7 ? '#ff6a5a' : D, 900, 'end', last || st > 6 ? '' : `opacity="${clamp(p * 3 - i * .3, 0, 1)}"`);
        if (last && st >= 8) s += `<rect x="310" y="${y - 44}" width="1300" height="60" fill="none" stroke="#ff6a5a" stroke-width="4" opacity="${.6 + .4 * Math.sin(t * 6)}"/>`; });
      if (st >= 10) { const y = 820 + off; s += R(330, y - 60, 1260, 130, '#3a1a14', 4) + T(360, y - 15, 30, 'NOTE ATTACHED:', '#ffc04a', 900, 'start');
        if (st >= 11) { const txt = '“Do not open the ward under any circumstances.”'; s += T(360, y + 40, 38, txt.slice(0, Math.floor(clamp(p * 1.6, 0, 1) * txt.length)), '#ff6a5a', 800, 'start'); } } }
    if (Math.floor(t * 2) % 2) s += `<rect x="1600" y="900" width="20" height="30" fill="${G}"/>`;
    return s + Array.from({ length: 40 }, (_, i) => `<path d="M270 ${140 + i * 20} H1650" stroke="#000" stroke-width="2" opacity=".25"/>`).join(''); }
  if (c.t === 'wave') { let s = `<rect width="1920" height="1080" fill="#14181a"/>` + T(960, 200, 50, 'REPEATING WHAT IT HEARD', '#e9dfc6', 900);
    for (let k = 0; k < 4; k++) { let wv = `M260 ${380 + k * 150}`; for (let x = 0; x <= 1400; x += 10) wv += ` L${260 + x} ${380 + k * 150 + Math.sin(x * .04 + t * (4 + k)) * 40 * Math.abs(Math.sin(x * .007 + k))}`; s += `<path d="${wv}" stroke="${['#7fe0a0', '#e8a0b8', '#9fc3e0', '#ffc04a'][k]}" stroke-width="5" fill="none" opacity="${clamp(p * 4 - k * .6, 0, 1)}"/>`; }
    return s; }
  if (c.t === 'power') { let s = `<rect width="1920" height="1080" fill="${CREAM}"/>` + T(960, 160, 54, 'HOW THE LOCKDOWN STAYS ON', '#222', 900);
    const nodes = [['GENERATOR', 360], ['BACKUP POWER', 960], ['LOCKDOWN SYSTEM', 1560]];
    nodes.forEach(([lab, x], i) => { const a = clamp((p - i * .2) * 5, 0, 1); s += `<g opacity="${a}">${R(x - 230, 440, 460, 160, '#fbf8f0', 6, 'rx="18"')}${T(x, 535, 40, lab, '#222', 900)}</g>`; if (i < 2) s += `<path d="M${x + 240} 520 H${x + 360}" stroke="#c9a24a" stroke-width="12" stroke-dasharray="20 14" stroke-dashoffset="${-t * 60}" opacity="${a}"/>`; });
    return s + T(960, 760, 40, 'Cut the power → the doors might open.', '#2f6a8a', 800, 'middle', `opacity="${clamp((p - .6) * 4, 0, 1)}"`); }
  return _card3(c, p, t, dur);
};
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env; const has = k => f.includes(k); let s = '';
  const base = _fx3(shot, lt, p, t, front);
  if (!front) {
    if (has('doorpound') && (lt % 1.3) < .15) s += `<g transform="translate(${(rnd(Math.floor(t * 30)) - .5) * 10},0)">${R(840, 360, 240, 260, '#8a9a94', 5)}<path d="M960 360 v260" stroke="${INK}" stroke-width="5"/></g><path d="M820 380 l-30 -14 M820 480 l-36 0 M1100 380 l30 -14" stroke="#fff" stroke-width="5"/>`;
    if (has('tv')) { s += `<rect x="1312" y="222" width="276" height="156" fill="#1a3a6a"/>` + R(1330, 240, 240, 40, '#c33a2f', 0) + T(1450, 268, 22, 'EMERGENCY', '#fff', 900) + T(1450, 330, 18, 'STAY INDOORS', '#fff', 800) + `<rect x="1312" y="${222 + (t * 80) % 156}" width="276" height="6" fill="#fff" opacity=".2"/>`; }
    if (has('bottles')) s += icon2('water', 1100, 790, .5) + icon2('water', 1140, 795, .5);
    if (has('pharmdoor')) { const q = ease(clamp(p * 1.4, 0, 1)); s += `<rect x="320" y="330" width="${240 * (1 - q * .7)}" height="490" fill="#9fb8b0" stroke="${INK}" stroke-width="5"/>`; }
    if (has('loot2')) s += icon2('bandage', 1200, 820, .5) + icon2('antiseptic', 1260, 810, .45) + icon2('medkit', 1330, 820, .5);
    
    if (has('emptybed')) s += `<path d="M780 690 q60 -30 120 0 q80 30 200 -10" stroke="#e9e6dc" stroke-width="16" fill="none"/>` + `<path d="M1000 700 l30 160 M1060 700 l-20 160" stroke="#9aa1a4" stroke-width="6"/>`;
    if (has('footprints')) for (let i = 0; i < 8; i++) { const f2 = i / 8, y = 640 + f2 * 380, x = 960 + (i % 2 ? 1 : -1) * (14 + 30 * f2); s += `<ellipse cx="${x}" cy="${y}" rx="${8 + 16 * f2}" ry="${4 + 8 * f2}" fill="#3a2a26" opacity=".75"/>`; }
    if (has('ward6move')) s += `<rect x="1030" y="400" width="10" height="${200}" fill="#2a2a2a" opacity="${(Math.sin(t * 3) + 1) / 2}"/>`;
    if (has('ward6slam')) { const q = clamp(lt * 4, 0, 1); s += `<g transform="translate(880,360) scale(${1 - q * .7},1)">${R(0, 0, 160, 260, '#6a7470', 6)}</g><rect x="${880 + 160 * (1 - q * .7)}" y="360" width="${160 * q * .7 + 10}" height="260" fill="#060707"/>`; }
    if (has('genshake')) { const k = (rnd(Math.floor(t * 20)) - .5) * 6; s += `<g transform="translate(${k},0)">${R(420, 420, 620, 440, '#5f6a4a', 9, 'rx="16"')}${R(460, 470, 220, 160, '#3a3f30', 5)}${T(730, 820, 34, 'GENERATOR', '#d8b52a', 900)}</g>`; }
    if (has('genshadow')) { const x = 360 + Math.sin(t * .8) * 60; s += `<rect x="${x}" y="300" width="60" height="560" fill="#050606" opacity=".85"/>`; }
    if (has('pullswitch')) { const q = ease(clamp((p - .2) * 2.5, 0, 1)); s += `<g transform="rotate(${-40 + 80 * q} 960 580)">${R(940, 360, 40, 220, '#9aa1a4', 6)}${C(960, 360, 34, '#2c2f36', 6)}</g>` + `<circle cx="960" cy="580" r="40" fill="#3a3f42" stroke="${INK}" stroke-width="6"/>`; }
    if (has('unlockleds')) for (let i = 0; i < 6; i++) { const on = p > i * .14; const f2 = Math.pow(.7, i); s += `<circle cx="${960 - (740 * f2 + 220)}" cy="${470 + 140 * f2}" r="${6 + 10 * f2}" fill="${on ? '#4fe07a' : '#c33a2f'}"/><circle cx="${960 + (740 * f2 + 220)}" cy="${470 + 140 * f2}" r="${6 + 10 * f2}" fill="${on ? '#4fe07a' : '#c33a2f'}"/>`; }
    if (has('ambopen') || has('ambopen2')) { const q = has('ambopen2') ? 1 : ease(clamp(p * 1.3, 0, 1)); s += `<rect x="${960 - 420 * q}" y="220" width="${840 * q}" height="640" fill="#f4d9b8"/>` + `<rect x="${540 - 380 * q}" y="220" width="410" height="640" fill="#9aa59f" stroke="${INK}" stroke-width="5"/><rect x="${970 + 380 * q}" y="220" width="410" height="640" fill="#9aa59f" stroke="${INK}" stroke-width="5"/>`; }
    if (has('glassover')) s += '';
  }
  if (front) {
    if (E === 'nurses') s += ENV.nursesfront(shot.light) + (has('keys') ? R(880, 650, 180, 26, '#3a3f42', 4, 'rx="6"') : '');
    if (has('speaker')) { const x = 960, y = 150; s += P(`M${x - 50} ${y - 40} h100 l-14 64 h-72z`, '#3a3f4a', 6); for (let k = 0; k < 3; k++) { const r = 20 + ((t * 70 + k * 30) % 90); s += `<path d="M${x - r} ${y + 36 + r * .4} q${r} ${r * .5} ${2 * r} 0" stroke="#fff" stroke-width="5" fill="none" opacity="${1 - r / 110}"/>`; } }
    if (has('glitchpa')) { const k = Math.floor(t * 20); for (let i = 0; i < 5; i++) s += `<rect x="${rnd(k + i) * 1920}" y="${rnd(k + i + 7) * 1080}" width="${300 + rnd(k + i + 2) * 700}" height="${10 + rnd(k + i + 4) * 30}" fill="#e8a0b8" opacity=".35"/>`; }
    if (has('lightsred')) { const q = clamp((p - .3) * 3, 0, 1); s += `<rect width="1920" height="1080" fill="#ff1a10" opacity="${q * .25}"/><rect width="1920" height="1080" fill="#000" opacity="${q * .35}"/>`; }
    if (has('camled')) { const on = Math.floor(t * 2) % 2; const ang = has('camturn') ? -30 + 60 * ease(clamp(p * 1.2, 0, 1)) : -30; s += `<g transform="translate(440,200) rotate(${ang})">${R(-10, -14, 70, 28, '#d6dbe0', 4, 'rx="6"')}<circle cx="60" cy="0" r="10" fill="#2c2f36"/></g><circle cx="440" cy="232" r="7" fill="${on ? '#ff3b3b' : '#5a1a14'}"/>` + (on ? `<circle cx="440" cy="232" r="22" fill="#ff3b3b" opacity=".3"/>` : ''); }
    if (has('doorsclose')) { const q = ease(clamp(p * 1.2, 0, 1)); s += `<rect x="${740 - 0}" y="320" width="${220 * q}" height="300" fill="#8a9a94" stroke="${INK}" stroke-width="5"/><rect x="${1180 - 220 * q}" y="320" width="${220 * q}" height="300" fill="#8a9a94" stroke="${INK}" stroke-width="5"/>`; }
    if (has('shutters4')) { const q = ease(clamp(p * 1.3, 0, 1)), h = 280 * q; s += `<rect x="760" y="340" width="400" height="${h}" fill="#8d949e" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: Math.floor(h / 24) }, (_, k) => `<path d="M760 ${340 + h - k * 24} h400" stroke="#6d747e" stroke-width="4"/>`).join(''); }
    if (has('rattle') && Math.floor(t * 12) % 2) s += `<path d="M880 470 l-30 -10 M880 600 l-30 10 M1040 470 l30 -10" stroke="#fff" stroke-width="4" opacity=".7"/>`;
    if (has('lockedsign')) { const a = clamp(p * 5, 0, 1); s += `<g opacity="${a}">${R(780, 360, 360, 110, '#c33a2f', 6, 'rx="14"')}${T(960, 432, 64, 'LOCKED', '#fff', 900)}</g>`; }
    if (has('screenglow')) s += `<ellipse cx="1440" cy="560" rx="420" ry="300" fill="#7fe0a0" opacity=".07"/>`;
    if (has('beamdoor')) s += `<path d="M1150 820 L880 300 L1060 300Z" fill="#fff4c8" opacity=".14"/>`;
    if (has('doorbeam')) s += `<ellipse cx="960" cy="560" rx="380" ry="460" fill="#fff4c8" opacity=".16"/>`;
    if (has('glassover')) { s += `<rect x="400" y="160" width="1120" height="860" fill="#bcd0d8" opacity=".12"/>` + `<path d="M520 160 L380 1020 M900 160 L760 1020 M1300 160 L1160 1020" stroke="#e8f0f4" stroke-width="40" opacity=".08"/>`; }
  }
  return base + s;
};
Object.assign(LIGHT, {
  hosp: t => `<rect width="1920" height="1080" fill="#e8fff0" opacity=".06"/>`,
  flickred: t => { const k = Math.floor(t * 12); const fl = rnd(k) > .85 ? .75 : .45; return `<rect width="1920" height="1080" fill="#0a0406" opacity="${fl}"/><rect width="1920" height="1080" fill="#ff1a10" opacity=".14"/>`; },
  red: t => `<rect width="1920" height="1080" fill="#0a0406" opacity=".42"/><rect width="1920" height="1080" fill="#ff1a10" opacity="${.12 + .06 * (Math.sin(t * 2) + 1) / 2}"/>`
});
