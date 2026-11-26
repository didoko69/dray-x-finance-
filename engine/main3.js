// ---------- Video 3 cards + fx ----------
const _card2 = cardSVG, _fx2 = fxSVG;
const KN = [.35, .85, 1.35]; // knock offsets (seconds into shot) — shared with audio
const knockAt = (lt, offs) => offs.some(o => lt >= o && lt < o + .14);
const _icon2 = icon2;
icon2 = function (k, x, y, s = 1) {
  if (k === 'wrench') return `<g transform="translate(${x},${y}) scale(${s}) rotate(-30)"><rect x="-60" y="-10" width="110" height="20" rx="8" fill="#8a9094" stroke="${INK}" stroke-width="4"/><path d="M50 -24 a24 24 0 1 1 0 48 l-10 -14 l10 -10 l-10 -10z" fill="#8a9094" stroke="${INK}" stroke-width="4"/></g>`;
  return _icon2(k, x, y, s);
};
function paper3(x, y, w, h, rot, inner, damaged) {
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 14}" y="${y + 16}" width="${w}" height="${h}" fill="#000" opacity=".25"/>${R(x, y, w, h, '#ece4d0', 5)}${damaged ? `<path d="M${x + w - 140} ${y} q40 60 0 120 q60 40 30 110 L${x + w} ${y + 260} L${x + w} ${y}Z" fill="#2a2420" opacity=".85"/><path d="M${x} ${y + h - 120} q120 -30 200 30 q80 50 160 -10 L${x + 360} ${y + h} L${x} ${y + h}Z" fill="#8a7a5a" opacity=".5"/>` : ''}${inner}</g>`;
}
const SM = { hall: [760, 200, 400, 150, 'TICKET HALL'], maint: [260, 420, 260, 130, 'MAINTENANCE'], office: [1400, 420, 260, 130, 'STATION OFFICE'], platform: [560, 440, 800, 110, 'PLATFORM'], vent: [1400, 650, 260, 130, 'VENTILATION'], tunnel: [260, 650, 260, 130, 'TUNNEL B'] };
function stationMap(c, p, t) {
  let s = R(200, 140, 1520, 820, '#e6dfd0', 7, 'rx="6"') + T(960, 80, 44, 'KESTREL STREET STATION · EMERGENCY MAP', '#2f4a4c');
  s += `<path d="M960 200 V140 M960 350 V440 M560 495 H520 M1360 495 H1400 M560 495 Q400 600 390 650 M1530 550 V650" stroke="#9aa1a4" stroke-width="18"/>`;
  for (const k in SM) { const [x, y, w, h, lab] = SM[k]; const hl = (c.mode === 'tunnel' || c.mode === 'closed') && k === 'tunnel' || (c.mode === 'vent' || c.mode === 'route') && k === 'vent';
    s += R(x, y, w, h, k === 'tunnel' && ['closed', 'tunnel'].includes(c.mode) ? '#f3d8d0' : (hl ? '#fff3c4' : '#d6cdb5'), 4, 'rx="6"') + T(x + w / 2, y + h / 2 + 9, 24, lab, '#3a4546', 800); }
  const ex = (x, y, lab, col, a = 1) => `<g opacity="${a}">${C(x, y, 30, col, 5)}${T(x, y + 12, 32, '↑', '#fff', 900)}${T(x + 44, y + 9, 24, lab, col, 900, 'start')}</g>`;
  if (c.mode === 'exits') { s += ex(960, 140, 'STREET EXIT', '#2f6a8a', clamp((p - .1) * 5, 0, 1)) + ex(390, 900, 'EXIT VIA TUNNEL B', '#2f6a8a', clamp((p - .4) * 5, 0, 1)) + `<path d="M390 780 V870" stroke="#9aa1a4" stroke-width="18" opacity="${clamp((p - .4) * 5, 0, 1)}"/>`; }
  if (c.mode === 'street') s += ex(960, 140, 'STREET EXIT', '#2f8a4a') + `<path d="M960 300 V160" stroke="#2f8a4a" stroke-width="10" stroke-dasharray="${300 * clamp(p * 2, 0, 1)} 400"/>`;
  if (c.mode === 'tunnel') s += ex(960, 140, 'STREET EXIT', '#8a8f88', .6) + `<path d="M390 780 V870" stroke="#9aa1a4" stroke-width="18"/>` + ex(390, 900, 'OLDER RAILWAY', '#2f6a8a') + `<path d="M760 495 L560 495 Q420 580 390 650 L390 880" stroke="#2f6a8a" stroke-width="10" fill="none" stroke-dasharray="${900 * clamp(p * 1.5, 0, 1)} 1000"/>`;
  if (c.mode === 'closed') s += `<path d="M390 780 V870" stroke="#9aa1a4" stroke-width="18"/>` + `<g transform="translate(390,715) rotate(-12)" opacity="${clamp(p * 5, 0, 1)}">${R(-150, -42, 300, 84, 'none', 0)}<rect x="-150" y="-42" width="300" height="84" rx="10" fill="none" stroke="#c33a2f" stroke-width="10"/>${T(0, 20, 60, 'CLOSED', '#c33a2f', 900)}</g>`;
  if (c.mode === 'vent' || c.mode === 'route') { s += ex(1700, 715, '', '#2f8a4a') + T(1530, 820, 22, 'SERVICE STAIRCASE', '#2f8a4a', 900);
    if (c.mode === 'route') { const pts = [[390, 485], [560, 495], [1360, 495], [1530, 550], [1530, 715], [1700, 715]]; let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      s += `<path d="M${pts.map(q => q.join(' ')).join(' L')}" stroke="#2f8a4a" stroke-width="10" fill="none" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - ease(clamp(p * 1.3, 0, 1)))}" stroke-linecap="round"/>`; } }
  s += `<g transform="translate(390,${['route'].includes(c.mode) ? 485 : 485})"><path d="M0 0 C-24 -34 -24 -60 0 -60 C24 -60 24 -34 0 0Z" fill="#4a4d52" stroke="${INK}" stroke-width="5"/><circle cy="-40" r="8" fill="#fff"/></g>`;
  return s;
}
cardSVG = function (c, p, t, dur) {
  const BG = `<rect width="1920" height="1080" fill="#2a2f2e"/>`;
  if (c.t === 'smap') return `<rect width="1920" height="1080" fill="${CREAM}"/>` + stationMap(c, p, t);
  if (c.t === 'notice3') { let s = BG + R(460, 200, 1000, 680, YEL, 8) + `<rect x="500" y="240" width="920" height="600" fill="#1c1f20"/>` + T(960, 360, 80, c.a, YEL, 900, 'middle', 'letter-spacing="8"');
    c.lines.forEach((l, i) => s += T(960, 500 + i * 90, 40, l, i === 1 ? '#ff5a4a' : '#f1ece2', 900, 'middle', `opacity="${clamp((p - .1 - i * .15) * 5, 0, 1)}"`)); return s; }
  if (c.t === 'folder') { let s = BG + `<g transform="rotate(-3 960 560)">${P('M460 220 h360 l40 50 h600 v680 h-1000z', '#c9a86a', 8)}${R(560, 400, 800, 200, '#ece4d0', 5)}${T(960, 530, 90, 'INCIDENT 26', '#7a2a22', 900)}</g>`;
    s += `<g opacity="${clamp((p - .2) * 4, 0, 1)}">${paper3(120, 300, 300, 400, -10, T(270, 360, 22, 'MAINT. REPORT', '#333', 900), 0)}${paper3(1500, 320, 300, 400, 8, T(1650, 380, 22, 'EMERGENCY LOG', '#333', 900), 0)}</g>`; return s; }
  if (c.t === 'report') { const lines = ['', 'Strange noises from sealed tunnel', 'Footsteps heard — nobody there', 'Worker: “Something followed me”', 'Section sealed: unexplained disappearance', 'INSPECTION · TUNNEL B', 'Handwritten note below:'];
    let inner = T(960, 230, 32, c.stage >= 5 ? 'INSPECTION REPORT' : 'INCIDENT 26 · REPORTS', '#333', 900);
    const from = c.stage >= 5 ? 5 : 1, to = c.stage >= 5 ? c.stage : c.stage;
    for (let i = 0; i < 9; i++) inner += `<path d="M580 ${300 + i * 60} h${500 + rnd(i) * 240}" stroke="#9a948a" stroke-width="10" opacity=".6"/>`;
    for (let i = from; i <= to; i++) { const k = i - from; const a = i === to ? clamp((p - .05) * 4, 0, 1) : 1; inner += `<rect x="560" y="${300 + k * 90 - 40}" width="800" height="60" fill="#fff3a0" opacity="${a * .8}"/>` + T(580, 300 + k * 90, 30, lines[i], '#222', 800, 'start', `opacity="${a}"`); }
    return BG + paper3(520, 140, 880, 840, -1, inner, c.stage < 5); }
  if (c.t === 'date') { let s = BG + paper3(520, 300, 880, 420, 1, '', 0); s += T(960, 470, 40, c.recent ? 'MOST RECENT ENTRY' : 'REPORT DATE', '#666', 800) + T(960, 580, c.recent ? 40 : 52, c.a, c.recent ? '#7a2a22' : '#222', 900);
    if (c.recent) s += stamp(1180, 690, 'RECENT', (p - .3) * 3, -10, '#c33a2f', 44); return s; }
  if (c.t === 'hand') { let s = BG + paper3(420, 200, 1080, 680, -2, '', 0);
    if (!c.blank) { const n1 = Math.floor(clamp(p * 2.2, 0, 1) * c.a.length), n2 = Math.floor(clamp(p * 2.2 - 1, 0, 1) * c.b.length);
      s += `<g transform="rotate(-4 960 540)" font-family="DejaVu Sans" font-style="italic">${T(960, 500, 92, c.a.slice(0, n1), '#2a1c1a', 700, 'middle', 'font-style="italic"')}${T(960, 640, 92, c.b.slice(0, n2), '#7a1f1a', 700, 'middle', 'font-style="italic"')}</g>`; }
    else s += T(960, 560, 40, '. . .', '#888', 700);
    return s; }
  if (c.t === 'frames') { let s = BG + T(960, 160, 54, c.stage ? 'BETWEEN TWO FRAMES' : 'IT DID NOT WALK AWAY', '#e9dfc6', 900);
    for (let i = 0; i < 2; i++) { const x = 260 + i * 740; s += R(x, 260, 660, 480, '#0e1210', 8) + `<g transform="translate(${x + 10},270) scale(${640 / 1920},${460 / 1080})">${platformCCTV()}${i === 0 ? figure({ k: 'tall', x: 1300, y: 560, s: .38, p: 'still', f: 0, v: 0 }, t, t) : ''}</g>` + T(x + 330, 800, 34, i ? 'FRAME 2  · 12:17:05' : 'FRAME 1  · 12:17:04', '#9aa49e', 800); }
    if (c.stage) s += `<path d="M930 500 h60 l-16 -16 M990 500 l-16 16" stroke="#ff5a4a" stroke-width="8" fill="none"/>` + T(960, 930, 44, 'No movement. Just gone.', '#ff5a4a', 900, 'middle', `opacity="${clamp((p - .3) * 4, 0, 1)}"`);
    return s; }
  if (c.t === 'nights') { let s = BG + T(960, 140, 54, 'PREVIOUS RECORDINGS', '#e9dfc6', 900); const pos = [[1300, 560, .38], [1050, 640, .55], [760, 760, .8]];
    for (let i = 0; i < 3; i++) { const x = 120 + i * 580, a = c.stage >= 1 ? clamp((p - i * .2) * 5, 0, 1) : 1; s += R(x, 250, 520, 380, '#0e1210', 8) + `<g transform="translate(${x + 10},260) scale(${500 / 1920},${360 / 1080})">${platformCCTV()}${c.stage >= 1 ? `<g opacity="${a}">${figure({ k: 'tall', x: pos[i][0], y: pos[i][1], s: pos[i][2], p: 'still', f: 0, v: 0 }, t, t)}</g>` : ''}</g>` + T(x + 260, 690, 36, 'NIGHT ' + (i + 1) + ' · 12:17', '#9aa49e', 800); }
    if (c.stage === 2) s += `<path d="M300 820 H1620" stroke="#ff5a4a" stroke-width="8"/><path d="M1620 820 l-24 -16 v32z" fill="#ff5a4a"/>` + T(960, 900, 44, 'Closer to the office every night', '#ff5a4a', 900, 'middle', `opacity="${clamp((p - .2) * 4, 0, 1)}"`);
    return s; }
  return _card2(c, p, t, dur);
};
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env; const has = k => f.includes(k); let s = '';
  if (!front) {
    if (E === 'door3') { // chain + door motion
      const kn = (has('knockdoor') && knockAt(lt, KN)) || (has('knock1') && lt > .2 && lt < .34); const sh = kn ? 6 : (has('doorshake') ? Math.sin(t * 40) * 3 : 0);
      if (sh) s += `<g transform="translate(${sh},0)">${R(570, 190, 380, 690, '#55605e', 7)}${R(970, 190, 380, 690, '#55605e', 7)}${R(900, 470, 30, 120, '#9aa1a4', 5, 'rx="8"')}${R(990, 470, 30, 120, '#9aa1a4', 5, 'rx="8"')}</g>` + `<circle cx="960" cy="${180 + lt * 60}" r="${10}" fill="#9a948a" opacity=".5"/>`;
      if (has('chainsnap')) { const q = clamp(p * 3, 0, 1); s += `<rect x="955" y="190" width="${10 + 60 * q}" height="690" fill="#050606"/>` + `<path d="M900 520 Q880 ${600 + q * 120} 870 ${700 + q * 120}" stroke="#7d8588" stroke-width="12" fill="none" stroke-dasharray="14 8"/><path d="M1020 520 Q1060 ${600 + q * 80} 1100 ${760 + q * 60}" stroke="#7d8588" stroke-width="12" fill="none" stroke-dasharray="14 8"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${960 + (rnd(i) - .5) * 300 * q}" y="${520 + rnd(i + 3) * 300 * q}" width="14" height="10" fill="#7d8588" transform="rotate(${i * 40} 960 520)"/>`).join(''); }
      else { const tight = has('chaintight') ? 1 : (has('chainmove') ? clamp(p, 0, .6) : 0); const vib = tight ? Math.sin(t * 50) * 2 : 0; const sag = 60 * (1 - tight);
        s += `<path d="M880 470 Q960 ${520 + sag + vib} 1040 470" stroke="#7d8588" stroke-width="16" fill="none" stroke-dasharray="18 8"/><path d="M880 590 Q960 ${540 - sag * .6 + vib} 1040 590" stroke="#7d8588" stroke-width="16" fill="none" stroke-dasharray="18 8"/>` + R(938, 520 + sag * .4, 44, 56, '#9a8a4a', 5, 'rx="8"'); } }
    if (has('barrier')) { const q = ease(clamp((p - .3) * 2, 0, 1)); s += `<g>${Array.from({ length: 8 }, (_, i) => `<path d="M${760 + i * 50 * q} 120 V280" stroke="#9aa1a4" stroke-width="10"/>`).join('')}<path d="M760 140 H${760 + 400 * q} M760 260 H${760 + 400 * q}" stroke="#9aa1a4" stroke-width="10"/></g>`; }
    if (has('benchpush') || has('benchin')) { const q = has('benchpush') ? ease(clamp(p * 1.3, 0, 1)) : 1; const x = 760 - 300 * q; s += `<g>${R(x - 160, 760, 320, 30, '#6b4a2e', 6)}${P(`M${x - 140} 790 v50 M${x + 140} 790 v50`, 'none', 9)}</g>`; }
    else if (E === 'maint') s += `<g>${R(300, 760, 320, 30, '#6b4a2e', 6)}${P('M320 790 v50 M600 790 v50', 'none', 9)}</g>`;
    if (has('lamp') && !has('lampoff')) s += `<rect x="1180" y="790" width="40" height="50" rx="6" fill="#3a3f42" stroke="${INK}" stroke-width="3"/><circle cx="1200" cy="785" r="14" fill="#f4e7b0"/>`;
    if (has('pack')) s += icon2('water', 1080, 800, .5) + icon2('medkit', 1140, 805, .45) + icon2('battery', 1190, 810, .45);
    if (has('monitoron') && E === 'office3') s += `<rect x="1400" y="490" width="160" height="120" rx="10" fill="#4a5a50"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M1400 ${495 + i * 12} h160" stroke="#000" stroke-width="3" opacity=".3"/>`).join('');
    if (has('officeknock') && knockAt(lt, KN)) s += `<path d="M230 400 l-40 -20 M230 520 l-50 0 M230 640 l-40 20" stroke="#f1ece2" stroke-width="7"/>` + `<rect x="${264}" y="300" width="300" height="540" fill="none" stroke="#f1ece2" stroke-width="4" opacity=".4"/>`;
    if (has('shadowpass')) { const x = -200 + p * 2400; s += `<rect x="${x}" y="800" width="${180}" height="14" fill="#050606"/>` + `<rect x="${x + 260}" y="800" width="120" height="14" fill="#050606" opacity="${p > .2 ? 1 : 0}"/>`; }
    if (has('handle')) { const a = Math.sin(clamp(lt - .3, 0, 3) * 2) * 25; s += `<g transform="rotate(${a} 1130 485)">${R(1120, 470, 120, 30, '#7d8588', 5, 'rx="10"')}</g>`; }
    if (has('doorpush')) { const q = Math.max(0, Math.sin(clamp(lt - .2, 0, 2) * 3)) * 14; s += `<rect x="${560 + 800}" y="0" width="${q}" height="800" fill="#c98a5a" opacity=".5"/>`; }
    if (has('doorpush2')) { const k = (lt % 1.1) < .12 ? 8 : 0; s += `<rect x="${140 + k}" y="300" width="260" height="540" fill="#5a6260" stroke="${INK}" stroke-width="8"/>`; }
    if (has('wallknock') && (knockAt(lt, KN) || (lt > 1.6 && lt < 1.7))) s += `<circle cx="960" cy="420" r="80" fill="#9a948a" opacity=".25"/><path d="M880 420 l-60 -10 M1040 430 l60 -6 M960 340 l0 -50" stroke="#e9dfc6" stroke-width="6"/>`;
    if (has('fan')) { const a = t * 400; s += `<g transform="translate(960,470) rotate(${a})">${[0, 72, 144, 216, 288].map(r => `<path d="M0 0 Q60 -40 220 -40 Q240 0 220 30 Q60 30 0 0Z" fill="#4a4f4c" stroke="${INK}" stroke-width="4" transform="rotate(${r})"/>`).join('')}${C(0, 0, 30, '#2a2e2c', 5)}</g>`; }
    if (has('doorhit') && knockAt(lt, [.3, 1.0])) s += `<rect x="226" y="320" width="260" height="540" fill="#5a5f5c" stroke="${INK}" stroke-width="8"/><path d="M200 420 l-40 -20 M200 560 l-50 0" stroke="#f1ece2" stroke-width="7"/>`;
    if (E === 'ladder') { const q = has('hatchopen') ? ease(clamp(p * 1.4, 0, 1)) : (has('hatchlight') ? 1 : 0);
      if (q > 0) s += `<rect x="790" y="150" width="340" height="100" fill="#f4d9a8" opacity="${q}"/>` + `<path d="M790 250 L640 1080 L1280 1080 L1130 250Z" fill="#f4d9a8" opacity="${.12 * q}"/>`;
      s += `<g transform="translate(790,150) scale(1,${1 - q * .9})">${R(0, 0, 340, 100, '#5a5f5c', 6)}<path d="M20 50 h300" stroke="${INK}" stroke-width="5"/></g>`; }
    if (has('hatchopenground')) { const k = has('hatchknock') && knockAt(lt, KN) ? 4 : 0; s += `<ellipse cx="700" cy="900" rx="120" ry="38" fill="#0a0b0b"/><g transform="translate(${830 + k},860) rotate(-70)">${`<ellipse cx="0" cy="0" rx="120" ry="40" fill="#5a5c5a" stroke="${INK}" stroke-width="6"/>`}</g>`; }
    if (has('ventglow')) for (let k = 0; k < 3; k++) { const r = 30 + ((t * 60 + k * 30) % 90); s += `<ellipse cx="700" cy="${900 - r * .3}" rx="${r * 1.6}" ry="${r * .5}" fill="none" stroke="#e9dfc6" stroke-width="4" opacity="${(1 - r / 120) * .6}"/>`; }
    if (has('tunnelmover')) { const x = -200 + ((t * 90) % 2400); s += `<g opacity=".95"><path d="M${x} 790 l40 -150 l14 0 l16 150z" fill="#050606"/><ellipse cx="${x + 36}" cy="630" rx="14" ry="22" fill="#050606"/></g><rect x="-50" y="645" width="1970" height="150" fill="#000" opacity=".35"/>`; }
    if (has('radiooff') && E === 'radiohand3') s += `<g transform="rotate(-8 960 540)"><rect x="810" y="360" width="300" height="160" rx="10" fill="#050605"/></g>`;
    if (has('smoke')) for (let k = 0; k < 14; k++) { const ph = (t * .1 + k / 14) % 1, base = k % 2 ? 500 : 1000; s += `<circle cx="${base + Math.sin(k * 3 + ph * 4) * 30 + ph * 160}" cy="${300 - ph * 320}" r="${24 + ph * 90}" fill="#2a2a2e" opacity="${.5 * (1 - ph * .7)}"/>`; }
    if (has('pack') === false && E === 'cctvoffice') s += '';
  }
  if (front) {
    if (has('beam') || has('beamdown')) { const h = heroOf(shot); if (h) { const x = h.x + (h.mv || 0) * lt, dir = h.f ? -1 : 1, y = h.y - 120 * h.s; const dy = has('beamdown') ? 260 : 0;
      s += `<path d="M${x + dir * 50 * h.s} ${y} L${x + dir * 1100} ${y - 300 + dy} L${x + dir * 1100} ${y + 300 + dy}Z" fill="#fff4c8" opacity=".14"/><path d="M${x + dir * 50 * h.s} ${y} L${x + dir * 700} ${y - 80 + dy * .6} L${x + dir * 700} ${y + 80 + dy * .6}Z" fill="#fff4c8" opacity=".1"/>`; } }
    if (has('torch')) { const a = Math.sin(t * .5) * 120; s += `<ellipse cx="${960 + a}" cy="520" rx="420" ry="360" fill="#fff4c8" opacity=".07"/>`; }
    if (has('dust')) for (let i = 0; i < 36; i++) { const x = (rnd(i) * 1920 + t * 14 * (rnd(i + 1) - .5) + 1920) % 1920, y = (rnd(i + 3) * 1080 + t * 8) % 1080; s += `<circle cx="${x}" cy="${y}" r="${1.5 + rnd(i + 2) * 2.5}" fill="#e9dfc6" opacity=".25"/>`; }
    if (has('cctv3')) { s += `<rect width="1920" height="1080" fill="#7fffb0" opacity=".07"/>` + Array.from({ length: 54 }, (_, i) => `<path d="M0 ${i * 20} H1920" stroke="#000" stroke-width="3" opacity=".28"/>`).join('');
      const clk = has('clock1217') ? '00:17' : (has('clock1216') ? '00:16' : '');
      const live = has('live'); s += T(60, 70, 34, live ? 'CAM 03 · LIVE' : 'CAM 03 · PLATFORM · REC', '#e9efe6', 800, 'start') + T(1860, 70, 34, live ? 'NOW' : `12:${clk ? clk.slice(3) : '16'}:${String(Math.floor((lt * 5) % 60)).padStart(2, '0')} AM`, '#e9efe6', 800, 'end');
      if (Math.floor(t * 2) % 2) s += `<circle cx="80" cy="1010" r="14" fill="#ff3b3b"/>` + T(110, 1022, 32, live ? 'LIVE' : 'PLAY', '#ff3b3b', 800, 'start'); }
    if (has('glitch') || (has('glitchmid') && lt > 1.0 && lt < 1.3) || (has('rew') && lt < .6)) { const k = Math.floor(t * 24); for (let i = 0; i < 7; i++) s += `<rect x="${(rnd(k + i) - .2) * 1920}" y="${rnd(k + i + 9) * 1080}" width="${400 + rnd(k + i + 3) * 900}" height="${8 + rnd(k + i + 5) * 40}" fill="${['#e9efe6', '#000', '#7fffb0'][i % 3]}" opacity=".6"/>`; if (has('rew')) s += T(960, 560, 120, '◀◀', '#e9efe6', 900); }
    if (has('breath')) for (let k = 0; k < 3; k++) { const ph = (t * .5 + k / 3) % 1; s += `<circle cx="${1010 + ph * 60}" cy="${720 - ph * 40}" r="${8 + ph * 30}" fill="#e9efe6" opacity="${(1 - ph) * .3}"/>`; }
    if (has('doorsilh')) s += `<rect x="975" y="420" width="${30}" height="140" fill="#000"/>`;
    if (has('climbup')) s += '';
  }
  return s;
};
// ladder: hero climbs upward over the shot
const _render2 = window.render;
window.render = function (t) { const i = _render2(t); return i; };

LIGHT.black = t => `<rect width="1920" height="1080" fill="#02050a" opacity=".7"/>`;
