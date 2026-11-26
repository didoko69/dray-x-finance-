// ---------- cards, fx, lighting, render loop ----------
const CREAM = '#f1ece2';
function pop(p, i, n, start = .1, span = .5) { const q = (p - start - span * i / n) / .08; return clamp(q, 0, 1); }
function icon(kind, x, y, s = 1) {
  const g = (inner) => `<g transform="translate(${x},${y}) scale(${s})">${inner}</g>`;
  if (kind === 'bottle') return g(`<rect x="-10" y="-62" width="20" height="14" rx="3" fill="#2f6fb5" stroke="#1b3d66" stroke-width="3"/><path d="M-22 -40 Q-22 -50 -10 -50 H10 Q22 -50 22 -40 V30 Q22 40 12 40 H-12 Q-22 40 -22 30Z" fill="#69b3ee" stroke="#1b3d66" stroke-width="4"/><path d="M-12 -30 v50" stroke="#bfe2ff" stroke-width="5" stroke-linecap="round"/>`);
  if (kind === 'cracker') return g(`<rect x="-30" y="-36" width="60" height="72" rx="6" fill="#e9c47a" stroke="#7a5a22" stroke-width="4"/>${[-14, 0, 14].map(a => [-18, 0, 18].map(b => `<circle cx="${a}" cy="${b}" r="3" fill="#a07a32"/>`).join('')).join('')}`);
  if (kind === 'can') return g(`<rect x="-28" y="-40" width="56" height="80" rx="6" fill="#e07a34" stroke="#7a3a12" stroke-width="4"/><rect x="-28" y="-14" width="56" height="30" fill="#f5d6a8" stroke="#7a3a12" stroke-width="3"/><ellipse cx="0" cy="-40" rx="28" ry="7" fill="#c9c9c9" stroke="#555" stroke-width="3"/>`);
  if (kind === 'phone') return g(`<rect x="-26" y="-46" width="52" height="92" rx="9" fill="#2c2f36" stroke="${INK}" stroke-width="4"/><rect x="-20" y="-36" width="40" height="66" fill="#7fb2ff"/><path d="M-12 -10 l24 24 M12 -10 l-24 24" stroke="#c33a2f" stroke-width="6"/>`);
  if (kind === 'ear') return g(`<path d="M-30 -10 Q-30 -70 20 -70 Q70 -70 70 -10 Q70 30 30 50 Q10 60 10 90 Q10 110 -10 110" fill="#f3d9c2" stroke="${INK}" stroke-width="8"/><path d="M0 -10 Q0 -40 24 -40 Q46 -40 46 -12 Q46 8 24 20" fill="none" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(k => `<path d="M${100 + k * 26} ${-50 - k * 10} q30 50 0 100" stroke="#c33a2f" stroke-width="6" fill="none" opacity="${.8 - k * .2}"/>`).join('')}`);
  return '';
}
function paper(x, y, w, h, rot = 0) { return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 12}" y="${y + 14}" width="${w}" height="${h}" fill="#000" opacity=".15"/>${R(x, y, w, h, '#fbf8f0', 6)}</g>`; }
function stamp(x, y, txt, p, rot = -12, col = '#c33a2f', size = 56) {
  if (p <= 0) return ''; const s = 1 + (1 - clamp(p, 0, 1)) * 1.5, o = clamp(p * 3, 0, 1);
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" opacity="${o}"><rect x="${-txt.length * size * .34}" y="${-size * .9}" width="${txt.length * size * .68}" height="${size * 1.3}" rx="10" fill="none" stroke="${col}" stroke-width="8"/>${T(0, size * .2, size, txt, col, 900)}</g>`;
}

const MAPR = { lounge: [1040, 170, 260, 120, 'LOUNGE · L3'], control: [1340, 170, 260, 120, 'CONTROL ROOM'], hall: [300, 330, 1000, 200, 'DEPARTURE HALL'], security: [1340, 330, 240, 200, 'SECURITY'], food: [1620, 330, 220, 200, 'FOOD COURT'],
  baggage: [300, 580, 560, 180, 'BAGGAGE CLAIM'], staff: [900, 580, 230, 180, 'STAFF ROOM'], store: [1170, 580, 210, 180, 'STORE B'], cargo: [1420, 580, 420, 290, 'CARGO BAY'], tunnels: [300, 800, 1080, 70, 'SERVICE TUNNELS'] };
const ROUTES = { lounge: [[800, 470], [1170, 470], [1170, 230]], food: [[1170, 230], [1170, 470], [1460, 470], [1730, 470]], tunnels: [[1015, 670], [1015, 835], [400, 835], [1300, 835]],
  store: [[1015, 670], [1015, 835], [1275, 835], [1275, 670]], control: [[1015, 670], [600, 670], [600, 470], [1470, 470], [1470, 230]], escape: [[1470, 230], [1470, 470], [600, 470], [600, 670], [600, 835], [1630, 835], [1630, 720], [1900, 720]], origin: [] };
function mapCard(c, p, t) {
  let s = T(960, 110, 48, 'KELVIN BAY INTERNATIONAL', '#222') + T(960, 150, 24, 'TERMINAL PLAN', '#777', 700);
  const hl = { lounge: ['lounge'], food: ['food', 'security'], tunnels: ['tunnels', 'staff'], store: ['store', 'tunnels'], control: ['control'], escape: ['cargo', 'baggage'], origin: ['cargo'] }[c.route] || [];
  for (const k in MAPR) { const [x, y, w, h, lab] = MAPR[k]; const on = hl.includes(k);
    s += R(x, y, w, h, on ? '#fff3c4' : '#e3ddd0', 5, 'rx="8"') + T(x + w / 2, y + h / 2 + 10, k === 'tunnels' ? 26 : 26, lab, on ? '#222' : '#777', 800); }
  s += `<path d="M1840 700 h40 v40 h-40" fill="#2f8a4a" stroke="${INK}" stroke-width="4"/>` + T(1860, 690, 22, 'GATE C', '#2f8a4a', 800);
  const pts = ROUTES[c.route] || [];
  if (pts.length) { let d = 'M' + pts.map(q => q.join(' ')).join(' L'); let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const q = clamp((p - .08) / .6, 0, 1);
    s += `<path d="${d}" stroke="#c33a2f" stroke-width="10" fill="none" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - ease(q))}" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="${d}" stroke="#fbf8f0" stroke-width="3" fill="none" stroke-dasharray="14 18" stroke-dashoffset="${-t * 40}" opacity="${q}"/>`;
    // moving pin
    let rem = L * ease(q), pos = pts[0];
    for (let i = 1; i < pts.length; i++) { const sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (rem <= sl) { const f = rem / sl; pos = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; break; } rem -= sl; pos = pts[i]; }
    s += `<g transform="translate(${pos[0]},${pos[1] - 10})"><path d="M0 0 C-30 -40 -30 -70 0 -70 C30 -70 30 -40 0 0Z" fill="#2e4a7a" stroke="${INK}" stroke-width="5"/><circle cy="-48" r="10" fill="#fff"/></g>`;
  }
  if (c.route === 'origin') { const [x, y, w, h] = MAPR.cargo; const cx = x + w / 2, cy = y + h / 2;
    for (let k = 0; k < 4; k++) { const r = ((t * 120 + k * 140) % 560); s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c33a2f" stroke-width="${8 * (1 - r / 560)}" opacity="${1 - r / 560}"/>`; }
    s += C(cx, cy, 26, '#c33a2f', 5) + T(cx, cy + 120, 30, 'OUTBREAK ORIGIN', '#c33a2f', 900); }
  return s;
}

function cardSVG(c, p, t, dur) {
  if (c.t === 'day') { const o = clamp(p * 5, 0, 1) * clamp((1 - p) * 5, 0, 1); return `<rect width="1920" height="1080" fill="#151417"/>` + T(960, 580, 130, 'DAY ' + c.n, '#f3f0ea', 900, 'middle', `letter-spacing="10" opacity="${o}"`); }
  if (c.t === 'title') { const o = clamp(p * 4, 0, 1); return `<rect width="1920" height="1080" fill="#151417"/>` + T(960, 570, 90, c.a, '#f3f0ea', 900, 'middle', `letter-spacing="8" opacity="${o}"`) + `<rect x="${960 - 300 * ease(clamp(p * 2, 0, 1))}" y="620" width="${600 * ease(clamp(p * 2, 0, 1))}" height="6" fill="#c33a2f"/>`; }
  let s = `<rect width="1920" height="1080" fill="${CREAM}"/>`;
  if (c.t === 'sup') {
    s += T(960, 200, 66, 'SUPPLIES · DAY ' + c.day, '#222', 900, 'middle', 'letter-spacing="3"');
    c.rows.forEach((r, i) => { const y = 340 + i * 220, st = c.instant ? 0 : .08 + i * .25; const q = c.instant ? 1 : clamp((p - st) / .25, 0, 1);
      s += T(420, y, 40, r[0], '#666', 800, 'start', `opacity="${clamp(q * 3, 0, 1)}"`) + T(1500, y + 10, 66, Math.round(r[1] * ease(q)) + r[2], '#222', 900, 'end', `opacity="${clamp(q * 3, 0, 1)}"`);
      const n = r[4], sp = Math.min(100, 1000 / n);
      for (let k = 0; k < n; k++) { const a = c.instant ? 1 : clamp(q * n * 1.2 - k, 0, 1); if (a <= 0) continue; s += `<g opacity="${a}">${icon(r[3], 450 + k * sp, y + 110, a < 1 ? a * 1.15 : 1)}</g>`; } });
    if (c.note) s += T(960, 1000, 38, c.note, c.instant ? '#c33a2f' : '#666', 800, 'middle', `opacity="${clamp((p - .3) * 4, 0, 1)}"`);
    return s;
  }
  if (c.t === 'rule') {
    const q = clamp(p * 3, 0, 1);
    return s + `<g opacity="${q}">${icon(c.icon, 900, 330, 1.4)}</g>` + T(960, 620, 60, 'RULE ' + c.n, '#c33a2f', 900, 'middle', `opacity="${q}" letter-spacing="4"`) + T(960, 720, 64, c.a, '#222', 900, 'middle', `opacity="${clamp((p - .15) * 4, 0, 1)}"`) + T(960, 800, 38, c.b, '#666', 700, 'middle', `opacity="${clamp((p - .45) * 4, 0, 1)}"`);
  }
  if (c.t === 'bio') {
    s += `<g transform="translate(560,640) scale(1.9)">${figure({ k: 'grace', x: 0, y: 0, s: 1, p: 'stand', f: 0, v: 0 }, t, t)}</g>`;
    s += T(1000, 330, 90, c.name, '#222', 900, 'start', 'letter-spacing="6"');
    c.lines.forEach((l, i) => s += T(1000, 450 + i * 90, 42, l, '#555', 700, 'start', `opacity="${clamp((p - .1 - i * .18) * 5, 0, 1)}"`));
    return s;
  }
  if (c.t === 'radio') {
    s = `<rect width="1920" height="1080" fill="#14171c"/>` + R(560, 220, 800, 420, '#2c2f36', 10, 'rx="40"') + `<rect x="620" y="280" width="480" height="300" rx="16" fill="#0b1a10" stroke="${INK}" stroke-width="6"/>` + C(1220, 360, 60, '#3a3d44', 6) + C(1220, 520, 40, '#3a3d44', 6) + P('M700 220 L640 80', 'none', 12);
    let wv = 'M640 430'; for (let x = 0; x <= 440; x += 8) { const amp = 50 * (0.3 + 0.7 * Math.abs(Math.sin(t * 7 + x * .05))) * (rnd(Math.floor(t * 12) + x) * .8 + .2); wv += ` L${640 + x} ${430 + Math.sin(x * .15 + t * 20) * amp}`; }
    s += `<path d="${wv}" stroke="#4fe07a" stroke-width="4" fill="none"/>`;
    const n1 = Math.floor(clamp(p * 1.8, 0, 1) * c.a.length), n2 = c.b ? Math.floor(clamp((p - .35) * 1.8, 0, 1) * c.b.length) : 0;
    s += T(960, 780, 64, c.a.slice(0, n1), '#4fe07a', 900, 'middle', 'letter-spacing="4"') + (c.b ? T(960, 870, 44, c.b.slice(0, n2), '#9fe0b0', 700, 'middle', 'letter-spacing="3"') : '');
    return s;
  }
  if (c.t === 'count') {
    s += T(960, 300, 120, 'DAY ' + c.a + ' OF ' + c.b, '#222', 900);
    for (let i = 0; i < c.b; i++) { const x = 300 + (i % 15) * 88, y = 450 + Math.floor(i / 15) * 110; const filled = i < c.a && clamp(p * 1.6 * c.b - i * 1.2, 0, 1) > 0;
      s += R(x, y, 70, 80, i === c.b - 1 ? '#f3c4bc' : (filled ? '#3a3f4a' : '#fbf8f0'), 5, 'rx="8"'); if (i === c.b - 1) s += T(x + 35, y + 54, 30, '?', '#c33a2f', 900); }
    s += T(960, 800, 40, c.a >= 29 ? 'One day left.' : 'What happens on day 30?', '#c33a2f', 800, 'middle', `opacity="${clamp((p - .5) * 4, 0, 1)}"`);
    return s;
  }
  if (c.t === 'notice') {
    s = `<rect width="1920" height="1080" fill="#3b4048"/>` + paper(560, 90, 800, 900, -2);
    s += `<g transform="rotate(-2 960 540)"><rect x="560" y="90" width="800" height="120" fill="#c33a2f"/>${T(960, 170, 54, 'QUARANTINE NOTICE', '#fff')}
    ${T(620, 300, 36, 'Cargo container 7Q9', '#222', 800, 'start')}${T(620, 360, 30, 'Biological hazard. Do not open.', '#444', 600, 'start')}${T(620, 410, 30, 'Terminal under containment protocol.', '#444', 600, 'start')}
    ${T(620, 540, 40, 'ISSUED:', '#777', 800, 'start')}${T(820, 540, 60, '14 MARCH', '#222', 900, 'start')}</g>`;
    s += stamp(1000, 760, 'YOU LANDED: 17 MARCH', (p - .3) * 3, -8, '#c33a2f', 50);
    return s;
  }
  if (c.t === 'clues') {
    s += T(960, 160, 60, c.k ? 'IT ALL FITS' : '. . .', '#222', 900);
    const labs = ['Yellow vests', 'Running away', 'City lights on', 'Ring of trucks'];
    for (let i = 0; i < 4; i++) { const x = 160 + i * 420, y = 280; s += R(x, y, 360, 460, '#fbf8f0', 6, 'rx="16"');
      const a = c.k ? clamp((p - .05 - i * .2) * 5, 0, 1) : 0;
      if (a <= 0) { s += T(x + 180, y + 270, 160, '?', '#ccc', 900); continue; }
      let ic = '';
      if (i === 0) ic = `<g transform="translate(${x + 180},${y + 380}) scale(1.1)">${figure({ k: 'inf', x: 0, y: 0, s: 1, p: 'still', f: 0, v: 0 }, t, t)}</g>`;
      if (i === 1) ic = `<g transform="translate(${x + 150},${y + 370}) scale(.9)">${figure({ k: 'pax', x: 0, y: 0, s: 1, p: 'run', f: 0, v: 2 }, t, t)}</g><path d="M${x + 240} ${y + 200} h80 l-20 -20 M${x + 320} ${y + 200} l-20 20" stroke="#c33a2f" stroke-width="10" fill="none"/>`;
      if (i === 2) ic = skyline(x + 30, x + 330, y + 360, 60, 240, 5, 2, 1);
      if (i === 3) ic = `<ellipse cx="${x + 180}" cy="${y + 250}" rx="140" ry="80" fill="none" stroke="#8a93a3" stroke-width="6" stroke-dasharray="6 10"/>${R(x + 140, y + 220, 80, 50, '#7b8494', 4)}` + Array.from({ length: 8 }, (_, k) => { const an = k / 8 * 6.28; return `<rect x="${x + 180 + Math.cos(an) * 140 - 14}" y="${y + 250 + Math.sin(an) * 80 - 10}" width="28" height="20" fill="#4a5236" stroke="${INK}" stroke-width="3"/><circle cx="${x + 180 + Math.cos(an) * 140}" cy="${y + 238 + Math.sin(an) * 80}" r="5" fill="${(Math.floor(t * 3) + k) % 2 ? '#e33' : '#36f'}"/>`; }).join('');
      s += `<g opacity="${a}">${ic}</g>` + T(x + 180, y + 430, 34, labs[i], '#222', 800, 'middle', `opacity="${a}"`); }
    return s;
  }
  if (c.t === 'order') {
    s = `<rect width="1920" height="1080" fill="#3b4048"/>` + paper(520, 110, 880, 860, 2);
    s += `<g transform="rotate(2 960 540)">${T(960, 220, 50, 'CONTAINMENT ORDER 30-A', '#222', 900)}<path d="M600 250 H1320" stroke="#222" stroke-width="4"/>
    ${T(600, 340, 34, 'Perimeter: hold for 30 days.', '#444', 600, 'start')}${T(600, 400, 34, 'No entry. No exit.', '#444', 600, 'start')}
    ${T(600, 520, 44, 'DAY 30:', '#c33a2f', 900, 'start')}${T(600, 590, 44, 'FULL STERILIZATION', '#222', 900, 'start')}${T(600, 650, 44, 'OF TERMINAL', '#222', 900, 'start')}</g>`;
    s += stamp(1150, 820, 'AUTHORIZED', (p - .35) * 3, -14, '#c33a2f', 64);
    return s;
  }
  if (c.t === 'morse') {
    s = `<rect width="1920" height="1080" fill="#14171c"/>` + T(960, 200, 50, 'RUNWAY LIGHTS · MANUAL', '#d8b52a', 800, 'middle', 'letter-spacing="4"');
    const seq = [0, 0, 0, 1, 1, 1, 0, 0, 0]; let x = 300; const k = Math.floor(clamp(p * 1.15, 0, 1) * 9.5);
    seq.forEach((d, i) => { const on = i < k, w = d ? 160 : 60; const gx = x; x += w + (i % 3 === 2 ? 110 : 40);
      s += `<rect x="${gx}" y="480" width="${w}" height="60" rx="30" fill="${on ? '#ffd56a' : '#2c2f36'}" stroke="${INK}" stroke-width="4"/>` + (on ? `<rect x="${gx - 10}" y="470" width="${w + 20}" height="80" rx="40" fill="#ffd56a" opacity=".3"/>` : ''); });
    s += T(960, 760, 110, ['', 'S', 'S', 'S', 'S O', 'S O', 'S O', 'S O S', 'S O S', 'S O S'][Math.min(9, k)] || 'S O S', '#f3f0ea', 900, 'middle', 'letter-spacing="30"');
    return s;
  }
  if (c.t === 'timer') {
    s = `<rect width="1920" height="1080" fill="#14171c"/>`; const v = Math.max(0, Math.ceil(15 * (1 - p * 1.05)));
    const a = 1 - p; s += `<circle cx="960" cy="520" r="300" fill="none" stroke="#2c2f36" stroke-width="30"/><circle cx="960" cy="520" r="300" fill="none" stroke="#c33a2f" stroke-width="30" stroke-dasharray="${1885 * a} 2000" transform="rotate(-90 960 520)"/>`;
    s += T(960, 600, 240, v, '#f3f0ea', 900) + T(960, 930, 44, 'GATE C CLOSING', '#c33a2f', 900, 'middle', 'letter-spacing="6"');
    return s;
  }
  if (c.t === 'map') return s + mapCard(c, p, t);
  return s;
}

// ---- morse timing for SOS lamps ----
const MORSE = (() => { const a = []; let tt = 0; const add = (on, d) => { a.push([tt, tt + d, on]); tt += d; };
  for (const g of [[0, 0, 0], [1, 1, 1], [0, 0, 0]]) { for (const d of g) { add(1, d ? .6 : .2); add(0, .18); } add(0, .35); } add(0, .6); return { a, L: tt }; })();
function sosOn(t) { const x = t % MORSE.L; for (const s of MORSE.a) if (x >= s[0] && x < s[1]) return s[2]; return 0; }

function fxSVG(shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env; let s = '';
  const has = k => f.includes(k);
  if (!front) {
    if (E === 'board') { const rows = 7;
      for (let i = 0; i < rows; i++) { const y = 340 + i * 90; let st = 'ON TIME', col = '#7fd36b';
        const flipAt = has('board_flip') ? .15 + i * .1 : -1;
        if (has('board_cx') || (has('board_flip') && p > flipAt)) { st = 'CANCELLED'; col = '#ff5a4a'; }
        if (i === 6 && (has('board_cx') || (has('board_flip') && p > flipAt))) { st = 'HOLD'; col = '#ffb43a'; }
        if (has('board_flip') && Math.abs(p - flipAt) < .03) st = '█ █ █ █';
        s += T(1350, y, 44, st, col, 900, 'start'); }
      if (has('hl7q9')) { const o = .5 + .5 * Math.sin(t * 6); s += `<rect x="130" y="${340 + 6 * 90 - 62}" width="1660" height="92" rx="10" fill="none" stroke="#ffb43a" stroke-width="${6 + o * 4}" opacity="${.6 + o * .4}"/>`; } }
    if (has('shutters')) for (let i = 0; i < 4; i++) { const x = 120 + i * 440, q = ease(clamp((p - .05 - i * .14) / .22, 0, 1)), h = 480 * q;
      s += `<rect x="${x}" y="300" width="360" height="${h}" fill="#8d949e" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: Math.floor(h / 30) }, (_, k) => `<path d="M${x} ${300 + h - k * 30} h360" stroke="#6d747e" stroke-width="5"/>`).join(''); }
    if (E === 'lounge') { // vending machine state
      const ps = window.PUSH; let vx = 1180;
      if (has('vend_push')) vx = 1180 + 210 * ease(clamp(p * 1.1, 0, 1)); else if (ps && t > ps) vx = 1390;
      if (has('door_open')) vx = 1180;
      if (has('door_open')) s += `<rect x="1395" y="315" width="200" height="450" fill="#0d1018"/>` + P('M1395 315 L1300 340 L1300 760 L1395 780Z', '#3a4a66', 6);
      s += R(vx, 420, 190, 360, '#b33a3a', 7, 'rx="8"') + `<rect x="${vx + 20}" y="450" width="110" height="240" fill="#1d2129"/>` + Array.from({ length: 12 }, (_, k) => `<rect x="${vx + 28 + (k % 3) * 34}" y="${462 + Math.floor(k / 3) * 56}" width="22" height="40" rx="5" fill="${['#69b3ee', '#e07a34', '#7fd36b'][k % 3]}"/>`).join('') + R(vx + 140, 480, 34, 80, '#ddd', 4);
      if (has('vend_push')) s += `<path d="M${vx - 10} 790 l-60 6 M${vx - 10} 800 l-80 4" stroke="#fff" stroke-width="4" opacity="${.5 + .5 * Math.sin(t * 20)}"/>`;
    }
    if (E === 'balcony') { if (has('suitcase')) { const q = clamp((p - .1) / .15, 0, 1); s += `<g transform="translate(${1240 + q * 60},${600 + q * 70}) rotate(${q * 80})">${R(-40, -30, 80, 60, '#8c3b32', 5, 'rx="8"')}</g>` + (q >= 1 ? `<path d="M1270 690 l-30 -20 M1330 690 l30 -20 M1300 680 v-30" stroke="#fff" stroke-width="5" opacity="${clamp(1 - (p - .25) * 3, 0, 1)}"/>` : ''); }
      if (has('suitcase_open')) s += R(1230, 680, 90, 30, '#8c3b32', 5) + Array.from({ length: 8 }, (_, k) => `<rect x="${1180 + rnd(k) * 200}" y="${690 + rnd(k + 9) * 40}" width="26" height="14" fill="${['#e9dfc6', '#7a3b8f', '#2f7a5a'][k % 3]}" transform="rotate(${rnd(k + 3) * 90} ${1200 + rnd(k) * 200} 700)"/>`).join(''); }
    if (has('loot')) s += [[0, '#69b3ee'], [1, '#e9c47a'], [2, '#69b3ee'], [3, '#e07a34']].map(([k, c]) => `<rect x="${shot.actors[0] ? shot.actors[0].x + 40 + k * 26 : 900}" y="${(shot.actors[0] ? shot.actors[0].y : 820) - 40}" width="20" height="40" rx="6" fill="${c}" stroke="${INK}" stroke-width="3"/>`).join('');
    if (has('emptybottle')) s += `<g transform="rotate(80 1000 800)">${icon('bottle', 1000, 790, .7)}</g><g transform="rotate(-70 1080 810)">${icon('bottle', 1080, 800, .7)}</g>`;
    if (has('shoes')) s += P('M1100 812 q0 -20 20 -20 h20 q20 4 30 20z', '#5a3d2a', 4) + P('M1160 816 q0 -20 20 -20 h20 q20 4 30 20z', '#5a3d2a', 4);
    if (has('phone_ring')) { s += R(1740, 890, 40, 70, '#2c2f36', 4, 'rx="6"') + `<rect x="1746" y="898" width="28" height="48" fill="${Math.floor(t * 4) % 2 ? '#bfe2ff' : '#7fb2ff'}"/>`; for (let k = 0; k < 3; k++) { const r = 30 + ((t * 80 + k * 30) % 90); s += `<circle cx="1760" cy="925" r="${r}" fill="none" stroke="#fff" stroke-width="4" opacity="${1 - r / 120}"/>`; } }
    if (has('radio') || (E === 'staff' && true)) { s += R(1180, 640, 70, 44, '#2c2f36', 4, 'rx="6"') + `<path d="M1195 640 l-14 -40" stroke="${INK}" stroke-width="5"/><rect x="1192" y="650" width="30" height="20" fill="${has('radiowave') ? '#4fe07a' : '#1f3a26'}"/>`;
      if (has('radiowave')) for (let k = 0; k < 3; k++) { const r = 20 + ((t * 60 + k * 25) % 75); s += `<path d="M${1250 + r * .3} ${660 - r * .6} q${r * .5} ${r * .6} 0 ${r * 1.2}" stroke="#4fe07a" stroke-width="4" fill="none" opacity="${1 - r / 95}"/>`; } }
    if (has('candle')) { const fl = .85 + .15 * Math.sin(t * 17) * Math.sin(t * 5.3); s += `<rect x="1288" y="595" width="22" height="44" fill="#f3ead5" stroke="${INK}" stroke-width="4"/><path d="M1299 ${590 - 14 * fl} q8 9 0 14 q-8 -5 0 -14Z" fill="#ffd36b" stroke="#e07a2a" stroke-width="2"/>`; }
    if (has('glasses')) s += `<circle cx="1240" cy="870" r="14" fill="none" stroke="#5a3a20" stroke-width="5"/><circle cx="1272" cy="872" r="14" fill="none" stroke="#5a3a20" stroke-width="5"/><path d="M1254 870h4" stroke="#5a3a20" stroke-width="5"/>`;
    if (has('keycard')) { const on = p > .45; s += `<circle cx="1455" cy="665" r="12" fill="${on ? '#4fe07a' : '#e33'}" stroke="${INK}" stroke-width="3"/>` + (on ? `<circle cx="1455" cy="665" r="30" fill="#4fe07a" opacity=".3"/>` : '');
      const hx = 1426 + 0, hy = 652 - 60 * 1; s += `<g transform="translate(${1410 + (1 - clamp(p * 2, 0, 1)) * -60},${612})">${R(-10, -20, 46, 64, '#f1ece2', 4, 'rx="5"')}<rect x="-10" y="-20" width="46" height="16" fill="#2a5aa0"/></g>`; }
    if (has('radar')) { const a = t * 2.4; s += `<path d="M330 630 L${330 + Math.cos(a) * 50} ${630 + Math.sin(a) * 50}" stroke="#4fe07a" stroke-width="4"/><circle cx="${330 + Math.cos(1.3) * 30}" cy="${630 + Math.sin(1.3) * 30}" r="4" fill="#4fe07a" opacity="${(Math.sin(t * 3) + 1) / 2}"/>`; }
    if (has('belts')) { for (const cx of [560, 1360]) for (let k = 0; k < 7; k++) { const an = t * .8 + k / 7 * 6.28, x = cx + Math.cos(an) * 290, y = 740 + Math.sin(an) * 85; s += R(x - 34, y - 40, 68, 46, ['#8c3b32', '#41608f', '#2f6a4a', '#c49a62'][k % 4], 4, 'rx="8"'); }
      const r = (t * 4) % 6.28; s += `<circle cx="960" cy="300" r="20" fill="#ffb43a" stroke="${INK}" stroke-width="4"/><path d="M960 300 L${960 + Math.cos(r) * 400} ${300 + Math.sin(r) * 60 + 200}" stroke="#ffb43a" stroke-width="60" opacity=".12"/>`; }
    if (has('smoke')) for (let k = 0; k < 14; k++) { const ph = (t * .12 + k / 14) % 1; s += `<circle cx="${1440 + Math.sin(k * 3 + ph * 4) * 20 + ph * 140}" cy="${560 - ph * 560}" r="${20 + ph * 80}" fill="#2a2a2e" opacity="${.75 * (1 - ph * .6)}"/>`; }
    if (has('fireglow')) { const fl = .7 + .3 * Math.sin(t * 9) * Math.sin(t * 3.3); s += `<ellipse cx="960" cy="600" rx="${420 * fl}" ry="${160 * fl}" fill="#ff7a2a" opacity=".35" style="mix-blend-mode:screen"/>` + Array.from({ length: 6 }, (_, k) => { const ph = (t * .2 + k / 6) % 1; return `<circle cx="${800 + k * 60 + ph * 60}" cy="${560 - ph * 400}" r="${30 + ph * 70}" fill="#1a1a1e" opacity="${.7 * (1 - ph)}"/>`; }).join(''); }
    if (has('door_bang')) { const sh = Math.max(0, Math.sin(t * 25)) * (Math.floor(t * 3) % 2) * 6; s += `<rect x="${1460 + sh}" y="300" width="240" height="500" fill="#5a5f68" stroke="${INK}" stroke-width="8"/>` + (sh > 3 ? `<path d="M1430 400 l-40 -20 M1430 500 l-50 0 M1430 600 l-40 20" stroke="#fff" stroke-width="6"/>` : ''); }
  }
  if (front) {
    if (E === 'glass') s += ENV.glassfront(shot.light);
    if (has('bus')) { const x = -500 + ((t * 120) % 2900); s += `<g transform="translate(${x},1030)">${R(0, -150, 420, 140, '#d8b52a', 7, 'rx="16"')}${Array.from({ length: 5 }, (_, k) => `<rect x="${20 + k * 78}" y="-130" width="60" height="50" fill="#9fc3e0" stroke="${INK}" stroke-width="3"/>`).join('')}${C(80, -6, 26, '#222', 6)}${C(340, -6, 26, '#222', 6)}</g>`; }
    if (has('arrow_away')) { const q = ease(clamp(p * 2, 0, 1)); s += `<path d="M600 520 h${700 * q}" stroke="#c33a2f" stroke-width="22" stroke-linecap="round"/><path d="M${600 + 700 * q - 40} 480 l50 40 l-50 40" stroke="#c33a2f" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${q}"/>` + T(950, 470, 50, 'AWAY', '#fff', 900, 'middle', `opacity="${q}"`); }
    if (has('ring_vest')) for (const a of shot.actors) if (a.k === 'inf' && (a.v % 4 === 0 || a.v % 4 === 3)) { const q = clamp((p - .1) * 3, 0, 1); s += `<ellipse cx="${a.x}" cy="${a.y - 115 * a.s}" rx="${70 * a.s}" ry="${70 * a.s}" fill="none" stroke="#c33a2f" stroke-width="7" stroke-dasharray="${440 * q} 500"/>`; }
    if (has('speaker')) { const x = 960, y = E === 'hall' ? 150 : 110; s += P(`M${x - 40} ${y - 30} h80 l-10 50 h-60z`, '#3a3f4a', 5);
      if (shot.light !== 'dark') for (let k = 0; k < 3; k++) { const r = 20 + ((t * 70 + k * 30) % 90); s += `<path d="M${x - r} ${y + 30 + r * .4} q${r} ${r * .5} ${2 * r} 0" stroke="#fff" stroke-width="4" fill="none" opacity="${1 - r / 110}"/>`; }
      else s += `<path d="M${x - 30} ${y + 50} l60 30 M${x + 30} ${y + 50} l-60 30" stroke="#c33a2f" stroke-width="6" opacity="${clamp((p - .2) * 4, 0, 1)}"/>`; }
    if (has('hands')) { const q = clamp((p - .55) * 4, 0, 1); for (let k = 0; k < 4; k++) s += `<g opacity="${q}">${P(`M${560 + k * 220} 872 l${-20 + k * 10} 30 l${10} 0 l${-6} 24`, '#a9b59a', 5)}</g>`; }
    if (has('gate_open') || has('gate_close')) { const q = has('gate_open') ? ease(clamp(p * 1.2, 0, 1)) : 1 - ease(clamp((p - .2) * 1.6, 0, 1)); const X = E === 'gateout' ? 460 : 460, Y0 = E === 'gateout' ? 300 : 180, H = E === 'gateout' ? 580 : 680; const h = H * (1 - q * .85);
      s += `<rect x="${X}" y="${Y0}" width="1000" height="${h}" fill="#7b8494" stroke="${INK}" stroke-width="8"/>` + Array.from({ length: Math.floor(h / 40) }, (_, k) => `<path d="M${X} ${Y0 + h - k * 40} h1000" stroke="#5f6873" stroke-width="6"/>`).join('') + `<rect x="${X}" y="${Y0 + h - 30}" width="1000" height="30" fill="#d8b52a" stroke="${INK}" stroke-width="5"/>`; }
    if (has('sunrays')) for (let k = 0; k < 6; k++) s += `<path d="M960 600 L${300 + k * 260} 1080 L${380 + k * 260} 1080Z" fill="#ffe3a0" opacity="${.06 + .03 * Math.sin(t * 2 + k)}"/>`;
    if (has('clean')) { const q = clamp((p - .1) * 4, 0, 1); s += `<g opacity="${q}"><rect x="1080" y="420" width="260" height="110" rx="20" fill="#2f8a4a" stroke="${INK}" stroke-width="6"/>${T(1210, 494, 56, 'CLEAN', '#fff', 900)}</g>`; }
    if (has('cupboard')) { const q = ease(clamp(p * 1.6, 0, 1)); s += `<rect x="240" y="260" width="${260 * q}" height="540" fill="#7b8494" stroke="${INK}" stroke-width="8"/>`; }
    if (E === 'cupboard') { const w = has('crack_open') ? 60 + 700 * ease(clamp((p - .5) * 2, 0, 1)) : 60; s += `<rect x="${960 - w / 2}" y="0" width="${w}" height="1080" fill="#2a3446"/>`;
      if (!has('crack_open')) for (let k = 0; k < 5; k++) { const x = ((t * 500 + k * 380) % 1600) - 300; if (x > 860 && x < 1060) s += `<rect x="${x}" y="200" width="60" height="880" fill="#05060a"/>`; } }
    if (has('beacons')) { const pos = E === 'ring' ? Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return [960 + Math.cos(a) * 780, 690 + Math.sin(a) * 285 - 40]; }) : Array.from({ length: 9 }, (_, i) => [210 + i * 210, 740 - Math.sin(i / 8 * Math.PI) * 40 - 60]);
      pos.forEach(([x, y], i) => { const on = (Math.floor(t * 3) + i) % 2; s += `<circle cx="${x}" cy="${y}" r="8" fill="${on ? '#ff3b3b' : '#3b6bff'}"/><circle cx="${x}" cy="${y}" r="34" fill="${on ? '#ff3b3b' : '#3b6bff'}" opacity=".25"/>`; }); }
    if (has('sos') && E === 'runway') { const on = sosOn(t);
      for (let i = 0; i < 16; i++) { const f = i / 15, xl = 760 - 640 * Math.pow(f, 1.4), xr = 1160 + 640 * Math.pow(f, 1.4), y = 440 + 640 * Math.pow(f, 1.4), r = 4 + 14 * f;
        for (const x of [xl, xr]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${on ? '#fff3c4' : '#3a3f4a'}"/>` + (on ? `<circle cx="${x}" cy="${y}" r="${r * 4}" fill="#ffd56a" opacity=".25"/>` : ''); } }
    if (has('sosflash')) { const on = sosOn(t); if (on) s += `<rect x="0" y="120" width="1920" height="560" fill="#ffe9a8" opacity=".35"/>`; }
    if (has('alarmlight')) { const a = (t * 5) % 6.28; s += `<circle cx="960" cy="40" r="22" fill="#ff3b3b" stroke="${INK}" stroke-width="4"/><path d="M960 40 L${960 + Math.cos(a) * 900} ${40 + Math.abs(Math.sin(a)) * 600} L${960 + Math.cos(a + .25) * 900} ${40 + Math.abs(Math.sin(a + .25)) * 600}Z" fill="#ff3b3b" opacity=".18"/>`; }
  }
  return s;
}

const LIGHT = {
  eve: t => `<rect width="1920" height="1080" fill="#ffb070" opacity=".07"/>`,
  night: t => `<rect width="1920" height="1080" fill="#0d1a3a" opacity=".38"/>`,
  dark: t => `<rect width="1920" height="1080" fill="#050a1a" opacity=".55"/>`,
  sosdark: t => `<rect width="1920" height="1080" fill="#050a1a" opacity="${sosOn(t) ? .3 : .55}"/>`,
  sos: t => `<rect width="1920" height="1080" fill="#050a1a" opacity=".25"/>`,
  red: t => `<rect width="1920" height="1080" fill="#0d1a3a" opacity=".3"/><rect width="1920" height="1080" fill="#ff2020" opacity="${.08 + .1 * (Math.sin(t * 5) + 1) / 2}"/>`,
  dim: t => `<rect width="1920" height="1080" fill="#10182a" opacity=".33"/>`,
  flicker: t => { const k = Math.floor(t * 12); const fl = rnd(k) > .88 ? .72 : (rnd(k + 3) > .8 ? .5 : .38); return `<rect width="1920" height="1080" fill="#0a0f1a" opacity="${fl}"/>`; },
  warm: t => `<rect width="1920" height="1080" fill="#ff9a40" opacity=".1"/><circle cx="1300" cy="560" r="700" fill="url(#glow)" opacity=".5"/>`,
  cold: t => `<rect width="1920" height="1080" fill="#0a2a4a" opacity=".3"/>`,
  dawn: t => `<rect width="1920" height="1080" fill="#ff9a70" opacity=".08"/>`,
  day: t => ''
};

// --------- assembly ----------
const DEFS = `<defs>
<filter id="wobA" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="3"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".7"/><stop offset=".4" stop-color="#ff9a3c" stop-opacity=".25"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
</defs>`;
const BG = {}; let GRAIN = null;
function bgSVG(env, light) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160" viewBox="0 0 1920 1080"><defs><filter id="wob" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter></defs><g filter="url(#wob)">${ENV[env](light)}</g></svg>`;
}
async function rasterSVG(svg, w, h) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const img = new Image(); img.src = url; await img.decode();
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(img, 0, 0, w, h);
  const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', .93)); return URL.createObjectURL(blob);
}
window.prepare = async function (shots) {
  window.TL = shots;
  for (const s of shots) if (s.fx && s.fx.includes('vend_push')) window.PUSH = s.end;
  const need = new Set(shots.filter(s => s.env !== 'card' && s.env !== 'map').map(s => s.env + '|' + s.light));
  for (const k of need) { const [e, l] = k.split('|'); BG[k] = await rasterSVG(bgSVG(e, l), 3840, 2160); }
  // grain
  const cv = document.createElement('canvas'); cv.width = 960; cv.height = 540; const g = cv.getContext('2d'); const id = g.createImageData(960, 540);
  for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 22; }
  g.putImageData(id, 0, 0); GRAIN = cv.toDataURL('image/png');
  // preload images
  await Promise.all(Object.values(BG).concat([GRAIN]).map(u => { const im = new Image(); im.src = u; return im.decode(); }));
  return Object.keys(BG).length;
};
window.render = function (t) {
  const TLs = window.TL; let i = TLs.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = TLs.length - 1;
  const sh = TLs[i], dur = sh.end - sh.start, lt = t - sh.start, p = lt / dur;
  let inner = '';
  const cam = sh.cam || [960, 540, 1, 1, 0, 0]; const e = ease(clamp(p, 0, 1));
  const z = cam[2] + (cam[3] - cam[2]) * e; let cx = cam[0] + cam[4] * e, cy = cam[1] + cam[5] * e;
  if (cam[6]) { cx += Math.sin(t * 31) * cam[6] / z + Math.sin(t * 17) * cam[6] * .5 / z; cy += Math.cos(t * 27) * cam[6] * .7 / z; }
  cx = clamp(cx, 960 / z, 1920 - 960 / z); cy = clamp(cy, 540 / z, 1080 - 540 / z);
  const camT = `translate(960 540) scale(${z}) translate(${-cx} ${-cy})`;
  if (sh.env === 'card' || sh.env === 'map') {
    const c = sh.card; const zz = 1 + .025 * p;
    inner = `<g transform="translate(960 540) scale(${zz}) translate(-960 -540)">${cardSVG(c, p, t, dur)}</g>`;
  } else {
    let w = `<image href="${BG[sh.env + '|' + sh.light]}" x="0" y="0" width="1920" height="1080"/>`;
    w += fxSVG(sh, lt, p, t, false);
    const acts = (sh.actors || []).slice().sort((a, b) => a.y - b.y);
    let ag = ''; for (const a of acts) { const aa = (sh.env === 'glass' && a.k === 'you') ? Object.assign({}, a, { e: 'back' }) : a; ag += figure(aa, t, lt, sh.light); }
    w += `<g filter="url(#wobA)">${ag}</g>`;
    w += fxSVG(sh, lt, p, t, true);
    inner = `<g transform="${camT}">${w}</g>` + (LIGHT[sh.light] ? LIGHT[sh.light](t) : '');
  }
  const fade = Math.max(lt < .15 ? 1 - lt / .15 : 0, (i === TLs.length - 1 && dur - lt < 1.5) ? 1 - (dur - lt) / 1.5 : 0);
  const gx = Math.floor(rnd(Math.floor(t * 30)) * 960), gy = 0;
  document.getElementById('stage').innerHTML = `<svg width="1920" height="1080" viewBox="0 0 1920 1080">${DEFS}${inner}<rect width="1920" height="1080" fill="url(#vig)"/>
  <image href="${GRAIN}" x="${-gx}" y="${-gy}" width="1920" height="1080"/><image href="${GRAIN}" x="${1920 - gx}" y="0" width="1920" height="1080"/>
  <rect width="1920" height="1080" fill="#000" opacity="${fade}"/></svg>`;
  return i;
};
