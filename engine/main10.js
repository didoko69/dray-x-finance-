// ---------- Video 10 cards / fx / lights ----------
const _icon10 = icon;
icon = function (k, x, y, s = 1) { const g = i => `<g transform="translate(${x},${y}) scale(${s})">${i}</g>`;
  if (k === 'moon') return g(`<path d="M10 -60 A60 60 0 1 0 40 40 A46 46 0 1 1 10 -60Z" fill="#f2e6a8" stroke="${INK}" stroke-width="5"/>`);
  if (k === 'bus') return g(`<rect x="-80" y="-50" width="160" height="80" rx="12" fill="#e3b43a" stroke="${INK}" stroke-width="5"/><rect x="-66" y="-40" width="40" height="30" fill="#8fb0c4" stroke="${INK}" stroke-width="3"/><rect x="-18" y="-40" width="40" height="30" fill="#8fb0c4" stroke="${INK}" stroke-width="3"/><circle cx="-46" cy="32" r="14" fill="#1d1d21"/><circle cx="46" cy="32" r="14" fill="#1d1d21"/><path d="M-60 -60 l30 -30 M60 -60 l-30 -30" stroke="#c33a2f" stroke-width="6"/>`);
  if (k === 'skull') return g(`<path d="M-40 10 Q-46 -50 0 -52 Q46 -50 40 10 L26 18 V36 H-26 V18Z" fill="#efeadb" stroke="${INK}" stroke-width="5"/><circle cx="-16" cy="-12" r="11" fill="${INK}"/><circle cx="16" cy="-12" r="11" fill="${INK}"/>`);
  if (k === 'bean') return _icon10('can', x, y, s);
  if (k === 'rice') return g(`<path d="M-30 40 L-36 -30 Q0 -50 36 -30 L30 40Z" fill="#e9e2cc" stroke="${INK}" stroke-width="4"/><path d="M-20 -6 h40" stroke="#c33a2f" stroke-width="6"/>`);
  if (k === 'bar') return g(`<rect x="-36" y="-14" width="72" height="28" rx="6" fill="#c9803a" stroke="${INK}" stroke-width="4"/><path d="M-20 -14 v28 M0 -14 v28 M20 -14 v28" stroke="#8a5a2a" stroke-width="3"/>`);
  if (k === 'drop') return g(`<path d="M0 -50 Q36 0 30 20 A30 30 0 0 1 -30 20 Q-36 0 0 -50Z" fill="#69b3ee" stroke="#1b3d66" stroke-width="5"/>`);
  return _icon10(k, x, y, s); };
function towerCard(c, p, t, lt) { let s = brSky('brday') + `<circle cx="1500" cy="220" r="90" fill="#fff8d8"/>` + skyline('brday', 960, 1.3, 7, 0);
  s += `<g transform="translate(960 1000) scale(2.3) translate(-960 -1000)">` + waterTower(960, 1000, 1, 'brday') + `</g>` + `<rect width="1920" height="1080" fill="#0a1430" opacity=".72"/>` + Array.from({ length: 50 }, (_, i) => `<circle cx="${rnd(i + 3) * 1920}" cy="${rnd(i + 90) * 500}" r="${1 + rnd(i + 7) * 2}" fill="#fff" opacity="${.3 + rnd(i) * .5}"/>`).join('');
  const lx = 960, ly = 1000 - 2.3 * 305;
  let on = false, txt = '';
  if (c.morse) { // J .---  U ..-  M --  P .--.
    const code = [['J', '.---'], ['U', '..-'], ['M', '--'], ['P', '.--.']]; let seq = []; code.forEach(([L2, m], li) => { for (const ch of m) seq.push([ch === '.' ? .25 : .7, 1, li]), seq.push([.22, 0, li]); seq.push([.5, 0, li]); });
    const tot = seq.reduce((a, b) => a + b[0], 0), sp = tot / (c.dur || 8); let acc = 0, x = lt * sp, cur = -1; for (const [d, o, li] of seq) { if (x >= acc && x < acc + d) { on = !!o; cur = li; break; } acc += d; if (x >= acc) cur = li; }
    if (x >= tot) cur = 3; txt = code.slice(0, cur + 1).map(a => a[0]).join(' ');
    const done = code.slice(0, Math.max(0, cur + 1)); s += done.map((a, i) => TM(330 + i * 300, 1010, 64, a[1].replace(/\./g, '•').replace(/-/g, '—'), '#ffd56a', 900, 'middle')).join('');
  } else if (c.n != null) { const per = .42, k = Math.min(c.n, Math.floor(lt / per)); on = (lt % per) < per * .5 && lt / per < c.n; txt = String(c.count === false ? '' : (c.show != null ? c.show : k + (on ? 1 : 0))); }
  else on = c.steady || Math.floor(lt * 2.4) % 2 === 0;
  if (on) s += `<circle cx="${lx}" cy="${ly}" r="160" fill="#fff4c0" opacity=".25"/><circle cx="${lx}" cy="${ly}" r="60" fill="#fff4c0" opacity=".55"/><circle cx="${lx}" cy="${ly}" r="20" fill="#fff"/><path d="M${lx - 400} ${ly} H${lx + 400} M${lx} ${ly - 260} V${ly + 260}" stroke="#fff4c0" stroke-width="4" opacity=".4"/>`;
  else s += `<circle cx="${lx}" cy="${ly}" r="12" fill="#5a5440"/>`;
  if (txt) s += `<text x="1720" y="300" font-size="${c.morse ? 120 : 220}" font-weight="900" fill="#ffd56a" text-anchor="end" font-family="DejaVu Sans" stroke="#000" stroke-width="8" paint-order="stroke">${txt}</text>`;
  if (c.label) s += TM(960, 120, 40, c.label, '#e9e2cc', 900, 'middle');
  return s; }
const _card10 = cardSVG;
cardSVG = function (c, p, t, dur) { const lt = p * dur;
  if (c.t === 'tower') return towerCard(c, p, t, lt);
  if (c.t === 'prob') { const q = clamp(p * 3, 0, 1); let s = `<rect width="1920" height="1080" fill="${CREAM}"/>` + `<g opacity="${q}">${icon(c.icon, 960, 330, 1.8)}</g>`;
    return s + T(960, 620, 58, 'PROBLEM #' + c.n, '#c33a2f', 900, 'middle', `letter-spacing="6" opacity="${q}"`) + T(960, 740, 110, c.a, '#222', 900, 'middle', `opacity="${clamp((p - .12) * 4, 0, 1)}"`) + T(960, 830, 40, c.b || '', '#666', 700, 'middle', `opacity="${clamp((p - .35) * 4, 0, 1)}"`); }
  if (c.t === 'rain') { let s = `<rect width="1920" height="1080" fill="${CREAM}"/>` + T(960, 150, 60, 'RAIN MATH', '#222', 900, 'middle', 'letter-spacing="4"');
    const q1 = clamp(p * 3, 0, 1), q2 = clamp((p - .35) * 3, 0, 1);
    s += `<g opacity="${q1}"><rect x="260" y="330" width="300" height="300" fill="#7ab0d8" stroke="${INK}" stroke-width="6"/>` + T(410, 690, 40, '1 m²', '#222', 900) + Array.from({ length: 8 }, (_, k) => `<path d="M${280 + k * 36} ${240 + ((t * 300 + k * 47) % 80)} l-8 26" stroke="#3a7ab5" stroke-width="5"/>`).join('') + T(960, 470, 64, '1 mm  ×  1 m²  =', '#222', 900) + `</g>`;
    s += `<g opacity="${q1}">${icon('bottle', 1420, 470, 1.3)}` + T(1560, 490, 70, '1 L', '#2f6fb5', 900, 'start') + `</g>`;
    if (c.big) { s += `<g opacity="${q2}">` + T(960, 830, 72, `${c.big[0]} m²  ×  ${c.big[1]} mm  =  ${Math.round(c.big[0] * c.big[1] * ease(q2))} L`, '#c33a2f', 900) + T(960, 920, 36, c.note || '', '#666', 700) + `</g>`; }
    return s; }
  if (c.t === 'loot') { let s = `<rect width="1920" height="1080" fill="${CREAM}"/>` + T(960, 170, 60, c.title, '#222', 900, 'middle', 'letter-spacing="3"');
    c.items.forEach(([ic, lab], i) => { const q = clamp(p * (c.items.length + 1) * .9 - i, 0, 1); if (q <= 0) return; const x = 960 + (i - (c.items.length - 1) / 2) * 330; s += `<g opacity="${q}">${icon(ic, x, 500, 1.5 * (q < 1 ? .7 + .3 * q : 1))}` + T(x, 680, 34, lab, '#444', 800) + `</g>`; });
    if (c.note) s += T(960, 900, 52, c.note, '#c33a2f', 900, 'middle', `opacity="${clamp((p - .6) * 4, 0, 1)}"`);
    return s; }
  if (c.t === 'news') { let s = `<rect width="1920" height="1080" fill="#0e1622"/><rect x="0" y="0" width="1920" height="1080" fill="#1a2a3a"/>`;
    s += `<rect x="120" y="140" width="800" height="560" fill="#2a3a4a" stroke="#000" stroke-width="4"/>` + figure({ k: 'pax', v: 3, x: 520, y: 1000, s: 2.0, p: 'stand', f: 0, e: 'det' }, t, lt, 'day');
    s += `<rect x="1000" y="180" width="780" height="480" fill="#d9e0e6" stroke="#000" stroke-width="4"/><path d="M1060 600 L1200 420 L1300 520 L1460 300 L1560 400 L1720 260" stroke="#c33a2f" stroke-width="12" fill="none"/>` + T(1390, 240, 40, 'CASES · HOSPITAL DISTRICT', '#222', 900);
    s += `<rect y="760" width="1920" height="140" fill="#c33a2f"/>` + T(80, 850, 60, 'BREAKING', '#fff', 900, 'start') + `<rect y="900" width="1920" height="90" fill="#f1ece2"/>` + T(80, 962, 46, `"SEVERE FLU" — HOSPITAL DISTRICT UNDER QUARANTINE`, '#111', 900, 'start');
    return s + `<rect width="1920" height="1080" fill="#000" opacity=".1"/>`; }
  if (c.t === 'bmap') { let s = `<rect width="1920" height="1080" fill="#e9e2cc"/>` + T(960, 110, 54, 'HARBOR BRIDGE · DAY ' + (c.day || 1), '#222', 900, 'middle', 'letter-spacing="3"');
    s += `<path d="M0 420 Q960 380 1920 440 V700 Q960 660 0 700Z" fill="#7ab0d8" stroke="${INK}" stroke-width="6"/>` + T(1700, 600, 40, 'RIVER', '#2f5a7a', 900, 'middle', 'font-style="italic"');
    s += `<rect x="300" y="530" width="1320" height="40" fill="#8a8f96" stroke="${INK}" stroke-width="6"/>`;
    const q = clamp(p * 2, 0, 1); s += `<g opacity="${q}"><circle cx="240" cy="550" r="${120}" fill="#c33a2f" opacity=".35"/><circle cx="1680" cy="550" r="${130}" fill="#c33a2f" opacity=".35"/>` + T(240, 760, 40, 'WEST · 2000+', '#c33a2f', 900) + T(1680, 760, 40, 'EAST · 2000+', '#c33a2f', 900) + `</g>`;
    s += icon('bus', 960, 470, .9) + T(960, 380, 40, 'YOU', '#222', 900) + T(960, 660, 34, '600 m ← → 600 m', '#222', 800);
    if (c.tower) s += `<g transform="translate(1250 360) scale(.5)">${waterTower(0, 0, 1, 'brday')}</g>` + T(1250, 380, 30, 'WATER TOWER', '#222', 800);
    if (c.hosp) s += `<rect x="200" y="200" width="200" height="120" fill="#f1ece2" stroke="${INK}" stroke-width="5"/>` + T(300, 280, 60, '+', '#c33a2f', 900) + T(300, 180, 30, 'HOSPITAL DISTRICT', '#222', 800);
    if (c.drop) s += T(960, 960, 50, c.drop, '#c33a2f', 900, 'middle', `opacity="${clamp((p - .3) * 3, 0, 1)}"`);
    return s; }
  return _card10(c, p, t, dur); };
const _fx10 = fxSVG;
fxSVG = function (shot, lt, p, t, front) { const f = shot.fx || [], E = shot.env; const has = k => f.includes(k); let s = _fx10(shot, lt, p, t, front);
  if (!front) {
    if (has('tlight')) { const pos = { brdeck: [1600, 260], busroof: [1500, 296], brwide: [1700, 290] }[E] || [1600, 260]; const on = Math.floor(lt * 2.4) % 2 === 0; if (on) s += `<circle cx="${pos[0]}" cy="${pos[1]}" r="70" fill="#fff4c0" opacity=".25"/><circle cx="${pos[0]}" cy="${pos[1]}" r="14" fill="#fff"/>`; }
    if (has('carlights')) { const on = Math.floor(lt * 3) % 2 === 0; if (on) s += `<circle cx="1830" cy="1020" r="120" fill="#ffb03a" opacity=".35"/><circle cx="1700" cy="770" r="80" fill="#ffb03a" opacity=".35"/>`; }
    if (has('charges') && E === 'brwide') { const on = Math.floor(t * (has('fast') ? 6 : 1.5)) % 2 === 0; for (const x of [480, 1440]) s += `<circle cx="${x}" cy="640" r="${on ? 9 : 5}" fill="${on ? '#ff3a2a' : '#5a1a14'}"/>`; }
    if (has('charges') && E === 'brdown') { const on = Math.floor(t * (has('fast') ? 6 : 1.5)) % 2 === 0; for (const [x, y, r] of [[960, 420, 26], [220, 520, 12], [1700, 520, 12]]) s += `<rect x="${x - r * 3}" y="${y - r * 2}" width="${r * 6}" height="${r * 4}" fill="#5a5e52" stroke="${INK}" stroke-width="4"/><circle cx="${x + r * 1.6}" cy="${y - r * .6}" r="${r * .5}" fill="${on ? '#ff3a2a' : '#4a1a14'}"/>` + (on ? `<circle cx="${x + r * 1.6}" cy="${y - r * .6}" r="${r * 2.5}" fill="#ff3a2a" opacity=".3"/>` : ''); }
    if (E === 'charge') { const on = Math.floor(t * (has('fast') ? 6 : 1.5)) % 2 === 0; s += `<circle cx="1210" cy="420" r="30" fill="${on ? '#ff3a2a' : '#4a1a14'}"/>` + (on ? `<circle cx="1210" cy="420" r="90" fill="#ff3a2a" opacity=".35"/>` : ''); }
    if (has('tarp') && E === 'busroof') s += `<path d="M560 840 L1300 830 L1340 1000 L520 1010Z" fill="#3a7ab5" stroke="${INK}" stroke-width="6" opacity=".92"/><path d="M930 835 L930 1005" stroke="#2a5a8a" stroke-width="5"/>` + Array.from({ length: 6 }, (_, k) => icon('bottle', 600 + k * 120, 1000, .7)).join('');
    if (has('horde') && E === 'brwide') { const q = has('hordemove') ? ease(clamp(lt / 6, 0, 1)) : 0; s += crowd(200, 220 + 260 * q, 455, .55, 40 + 60 * q, 77, shot.light) + crowd(1700 - 260 * q, 1720, 455, .55, 40 + 60 * q, 91, shot.light); }
    if (has('carwall') && E === 'brwide') s += `<rect x="880" y="488" width="14" height="22" fill="#a83a2f" stroke="${INK}" stroke-width="2"/><rect x="1026" y="488" width="14" height="22" fill="#3a5a8a" stroke="${INK}" stroke-width="2"/>`;
    if (has('smoke')) for (let k = 0; k < 4; k++) { const x = 200 + k * 500 + Math.sin(t * .3 + k) * 40; s += `<circle cx="${x}" cy="${560 - ((t * 20 + k * 90) % 300)}" r="${120 + k * 20}" fill="#3a3436" opacity=".22"/>`; }
    if (has('newsTV') && E === 'home') s += `<svg x="200" y="350" width="480" height="300" viewBox="0 0 1920 1080">${cardSVG({ t: 'news' }, p, t, 3)}</svg>`;
  }
  if (front) {
    if (has('rainfx')) { let r = `<rect x="-300" y="-300" width="2520" height="1680" fill="#1a2430" opacity=".25"/>`; for (let k = 0; k < 140; k++) { const x = (rnd(k) * 2100 + t * 300) % 2100 - 100, y = (rnd(k + 9) * 1180 + t * 1500 + k * 37) % 1180 - 100; r += `<path d="M${x} ${y} l-10 40" stroke="#c8d8e8" stroke-width="3" opacity=".5"/>`; } s += r; }
    if (has('pulse')) s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#ff1a0a" opacity="${.1 + .1 * Math.sin(t * 8)}"/>`;
  }
  return s; };
Object.assign(LIGHT, {
  brday: t => ``,
  brdusk: t => `<rect width="1920" height="1080" fill="#ff8a3a" opacity=".1"/>`,
  brnight: t => `<rect width="1920" height="1080" fill="#0d1a3a" opacity=".38"/>`,
});
// ---------- Walter: grey-haired bus driver ----------
const _torso10 = torso, _hat10 = hat;
torso = function (kind, v, ps) { if (kind === 'walt') { const n = ps.neck, h = ps.hip; return P(`M${n[0] - 30} ${n[1] + 4} L${n[0] + 30} ${n[1] + 4} L${h[0] + 30} ${h[1] + 12} L${h[0] - 30} ${h[1] + 12}Z`, '#2e4a6a', 5) + `<path d="M${n[0]} ${n[1] + 6} L${h[0]} ${h[1] + 8}" stroke="#1e3048" stroke-width="4"/><rect x="${n[0] + 6}" y="${n[1] + 20}" width="16" height="10" fill="#e3b43a" stroke="${INK}" stroke-width="2"/>`; } return _torso10(kind, v, ps); };
hat = function (kind, v, e) { if (kind === 'walt') return `<path d="M-54 10 Q-60 -30 -44 -40 M54 10 Q60 -30 44 -40" stroke="#b9b9bd" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-50 -26 Q-50 -66 0 -68 Q50 -66 50 -26Z" fill="#1e3048" stroke="${INK}" stroke-width="5"/><path d="M-52 -26 H52" stroke="${INK}" stroke-width="6"/><path d="M-10 -28 Q20 -14 58 -24" stroke="#14202e" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="-10" y="-58" width="20" height="14" fill="#e3b43a" stroke="${INK}" stroke-width="2"/>` + (e === 'back' ? '' : `<path d="M-22 12 Q0 4 22 12 Q12 20 0 15 Q-12 20 -22 12Z" fill="#b9b9bd" stroke="${INK}" stroke-width="3"/>`); return _hat10(kind, v, e); };
