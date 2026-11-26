// ---------- Video 6: cruise ship cards + fx + characters ----------
const _card5 = cardSVG, _fx5 = fxSVG, _fig5 = figure;
const NAVY = '#26324d', NAVY2 = '#2e3b5a', JK = '#2b2e34';
figure = function (a, t, lt, light) {
  if (a.k === 'p047') { // protagonist: navy T-shirt (later a dark jacket)
    let g = _fig5(Object.assign({}, a, { k: 'hero', v: 0, pipe: 0 }), t, lt, light);
    g = g.replace(/<rect [^>]*fill="#1d1d21"[^>]*\/>/, '').replace(/#2f5a3e/g, a.jk ? JK : NAVY2).replace(/#284d35/g, NAVY).replace(/#d9d4c7/g, a.jk ? '#5a5e66' : NAVY2);
    if (a.jk) g = g.replace(/<\/g>$/, '') + '</g>';
    return g;
  }
  if (a.k === 'crew') return _fig5(Object.assign({}, a, { k: 'pax', v: 5 }), t, lt, light).replace(/#555a66/g, '#f4f2ee').replace(/#2a2a2a/g, '#1a1a1a');
  return _fig5(a, t, lt, light);
};
function screen(x, y, w, h, col = '#07130e') { return `<rect x="${x - 24}" y="${y - 24}" width="${w + 48}" height="${h + 48}" rx="20" fill="#1c1f24" stroke="${INK}" stroke-width="7"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`; }
function scan(x, y, w, h, t) { let s = ''; for (let i = 0; i < h; i += 6) s += `<rect x="${x}" y="${y + i}" width="${w}" height="2" fill="#000" opacity=".18"/>`; return s + `<rect x="${x}" y="${y + ((t * 220) % h)}" width="${w}" height="40" fill="#fff" opacity=".04"/>`; }
const MONO = 'font-family="DejaVu Sans Mono, monospace"';
const TM = (x, y, s, txt, fill = '#7dffb0', w = 700, anchor = 'start', extra = '') => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" ${MONO} ${extra}>${txt}</text>`;
const typed = (txt, q) => txt.slice(0, Math.floor(txt.length * clamp(q, 0, 1)));
const blink = t => Math.floor(t * 2.5) % 2 === 0;

function cctvFeed(mode, t, p, lt) {
  // returns content for a 1920x1080 viewBox, shown inside a CCTV frame
  let s = corrBase('day', false);
  const F = (o) => figure(o, t, lt, 'day');
  const walkers = (frozen) => [[700, 860, .8, 2], [1150, 780, .62, 0], [880, 700, .45, 3]].map(([x, y, sc, v], i) => F({ k: i === 1 ? 'crew' : 'pax', x: x + (frozen ? 0 : (i % 2 ? -60 : 70) * lt), y, s: sc, p: frozen ? 'still' : 'walk', f: i % 2, v })).join('');
  if (mode === 'normal') s += walkers(false);
  if (mode === 'crew') s += F({ k: 'crew', x: 600 + 80 * lt, y: 880, s: .85, p: 'hold', f: 0 }) + F({ k: 'crew', x: 1000 + 60 * lt, y: 760, s: .6, p: 'hold', f: 0 }) + `<rect x="${640 + 80 * lt}" y="700" width="80" height="60" fill="#c9a26a" stroke="${INK}" stroke-width="4"/>`;
  if (mode === 'pool') { s = ENV.spool('day'); s += F({ k: 'pax', x: 400, y: 880, s: .8, p: 'sit', f: 0, v: 1 }) + F({ k: 'pax', x: 1500, y: 860, s: .8, p: 'walk', f: 1, v: 4, mv: -40 }) + `<circle cx="${900 + Math.sin(t * 2) * 40}" cy="760" r="34" fill="#9a6646" stroke="${INK}" stroke-width="5"/>`; }
  if (mode === 'freeze') s += walkers(true);
  if (mode === 'glass') { s += F({ k: 'pax', x: 900, y: 900, s: .95, p: 'reach', f: 0, v: 3 }); const q = clamp(lt / .8, 0, 1); s += q < 1 ? `<path d="M${990} ${640 + 240 * q * q} h24 l-4 34 h-16z" fill="#bfe2ff" stroke="${INK}" stroke-width="3"/>` : `<path d="M960 900 l-30 -10 M990 902 l20 -16 M1010 900 l34 -4 M975 898 l-6 -20" stroke="#bfe2ff" stroke-width="5"/>`; }
  if (mode === 'door') s += `<path d="M330 296 L470 278 L470 1000 L330 1080Z" fill="#0b0c0d"/>` + F({ k: 'pax', x: 470, y: 920, s: .95, p: 'reach', f: 1, v: 1 });
  if (mode === 'still') s += F({ k: 'crew', x: 960, y: 820, s: .75, p: 'still', f: 0 });
  if (mode === 'turn') s += [[620, 900, .9, 2], [960, 820, .75, 5], [1300, 900, .9, 1], [860, 720, .5, 3], [1080, 700, .45, 0]].map(([x, y, sc, v], i) => F({ k: i === 1 ? 'crew' : 'pax', x, y, s: sc, p: 'stand', f: 0, v })).join('') + `<rect width="1920" height="1080" fill="#000" opacity="${.1 + .05 * Math.sin(t * 20)}"/>`;
  if (mode === 'walk') s += [[620, 900, .9, 2], [1300, 900, .9, 1], [960, 820, .75, 5]].map(([x, y, sc, v], i) => { const q = clamp(lt / 3, 0, 1); return F({ k: i === 2 ? 'crew' : 'pax', x: x + (960 - x) * q * .8, y: y - 220 * q, s: sc * (1 - q * .6), p: 'walk', f: x < 960 ? 0 : 1, v, e: 'back' }); }).join('');
  if (mode === 'hero' || mode === 'herozoom') { const q = clamp((lt - .4) / 1.2, 0, 1); s += `<path d="M1590 278 L${1590 - 140 * q} 296 L${1590 - 140 * q} 1080 L1590 1000Z" fill="#0b0c0d"/>`; if (lt > .9 || mode === 'herozoom') s += F({ k: 'p047', x: mode === 'herozoom' ? 1250 : 1500 - 120 * clamp(lt - .9, 0, 2), y: 920, s: .95, p: mode === 'herozoom' ? 'still' : 'walk', f: 1, e: 'det' }); }
  if (mode === 'cabinlive') { s = ENV.scabin('day') + F({ k: 'p047', x: 900, y: 900, s: 1, p: 'hold', f: 0, e: 'fear' }) + `<rect x="955" y="700" width="70" height="50" fill="#f4efe2" stroke="${INK}" stroke-width="4"/>`; }
  return s;
}
function cctvCard(c, p, t, lt) {
  let s = `<rect width="1920" height="1080" fill="#0d0f12"/>` + screen(210, 100, 1500, 844, '#000');
  const z = c.zoom ? 1 + .9 * ease(clamp(p, 0, 1)) : 1 + .04 * p, zx = c.zoom ? 1250 : 960, zy = c.zoom ? 560 : 540;
  const rew = c.mode === 'rewind';
  const inner = cctvFeed(rew ? 'walk' : c.mode, t, p, rew ? Math.max(0, 3 - lt * 3) : lt);
  s += `<svg x="210" y="100" width="1500" height="844" viewBox="0 0 1920 1080"><g transform="translate(${zx} ${zy}) scale(${z}) translate(${-zx} ${-zy})">${inner}</g><rect width="1920" height="1080" fill="#3a6a5a" opacity=".28" style="mix-blend-mode:multiply"/><rect width="1920" height="1080" fill="#9fd0b0" opacity=".08"/></svg>`;
  s += scan(210, 100, 1500, 844, t);
  const sec = c.sec != null ? c.sec + Math.floor(lt) : Math.floor(t) % 60;
  s += TM(250, 160, 34, `CAM ${c.cam || '07'} · ${c.place || 'DECK 7 CORRIDOR'}`, '#e9f2ee') + TM(1670, 160, 34, `${c.date || 'OCT 28'}  ${c.time || '02:13'}:${String(sec % 60).padStart(2, '0')} AM`, '#e9f2ee', 700, 'end');
  if (blink(t)) s += `<circle cx="1640" cy="900" r="14" fill="#ff3b3b"/>` + TM(1610, 912, 30, 'REC', '#ff3b3b', 900, 'end');
  if (rew) s += TM(260, 900, 56, '◀◀ REWIND', '#fff', 900) + `<rect x="210" y="100" width="1500" height="844" fill="#fff" opacity="${.06 * (Math.floor(t * 12) % 2)}"/>`;
  if (c.label) s += `<rect x="560" y="960" width="800" height="80" rx="12" fill="#c33a2f" opacity="${clamp(p * 4, 0, 1)}"/>` + T(960, 1015, 44, c.label, '#fff', 900, 'middle', `opacity="${clamp(p * 4, 0, 1)}"`);
  if (c.circle) s += `<ellipse cx="${210 + 1500 * 1250 / 1920}" cy="${100 + 844 * 760 / 1080}" rx="150" ry="250" fill="none" stroke="#ffc04a" stroke-width="8" stroke-dasharray="${1300 * clamp(p * 1.5, 0, 1)} 1400"/>`;
  return s;
}
function navUI(c, p, t, lt) {
  let s = `<rect width="1920" height="1080" fill="#0b0f14"/>` + screen(160, 90, 1600, 900, '#06121e');
  const q = clamp(p * 3, 0, 1);
  s += TM(200, 150, 32, 'NAVIGATION SYSTEM · AUTOPILOT ACTIVE', '#5ab0ff') + `<circle cx="1700" cy="138" r="10" fill="${blink(t) ? '#4fe07a' : '#1a4a2a'}"/>`;
  const map = (blank) => { let m = `<rect x="200" y="190" width="1000" height="760" fill="#0c2a44"/>`; for (let i = 0; i < 11; i++) m += `<path d="M${200 + i * 100} 190 v760 M200 ${190 + i * 76} h1000" stroke="#1a4a6a" stroke-width="2"/>`;
    if (!blank) m += `<path d="M200 260 q80 40 60 120 q-20 60 30 120 l-90 40Z" fill="#2a4a3a" stroke="#4a7a5a" stroke-width="3"/><path d="M1200 420 q-90 20 -70 100 q20 80 -40 140 l110 80Z" fill="#2a4a3a" stroke="#4a7a5a" stroke-width="3"/>`;
    return m; };
  if (c.stage === 'coords') { s += map(false) + `<circle cx="640" cy="560" r="${12 + 6 * Math.sin(t * 5)}" fill="#ffd23a"/>` + TM(1250, 300, 34, 'POSITION', '#7aa8d0') + TM(1250, 360, 40, typed('31°04′N  42°17′W', q), '#fff') + TM(1250, 430, 34, typed('ATLANTIC OCEAN', clamp(p * 3 - .6, 0, 1)), '#ffd23a', 900) + TM(1250, 520, 28, 'SPEED 18.4 KN', '#7aa8d0'); }
  if (c.stage === 'dest' || c.stage === 'eta' || c.stage === 'warn') {
    s += map(false) + `<path d="M640 560 L1000 380" stroke="#ffd23a" stroke-width="5" stroke-dasharray="14 10"/><circle cx="640" cy="560" r="12" fill="#ffd23a"/><circle cx="1000" cy="380" r="${16 + 8 * Math.sin(t * 6)}" fill="none" stroke="#ff4a3a" stroke-width="5"/>`;
    s += TM(1250, 300, 30, 'DESTINATION', '#7aa8d0') + TM(1250, 370, 60, c.stage === 'dest' ? typed('BLACKWATER', q) : 'BLACKWATER', '#fff', 900);
    if (c.stage !== 'dest') s += TM(1250, 470, 30, 'ESTIMATED ARRIVAL', '#7aa8d0') + TM(1250, 540, 64, c.stage === 'eta' ? `${String(Math.max(0, 48 - Math.floor(lt * 0))).padStart(2, '0')}:00:00` : '47:58:12', '#ffd23a', 900);
    if (c.stage === 'warn') { const o = clamp(p * 4, 0, 1) * (blink(t * 1.4) ? 1 : .65); s += `<rect x="1230" y="640" width="500" height="150" rx="10" fill="#c33a2f" opacity="${o}"/>` + TM(1480, 700, 38, 'DO NOT', '#fff', 900, 'middle', `opacity="${o}"`) + TM(1480, 760, 38, 'CHANGE COURSE', '#fff', 900, 'middle', `opacity="${o}"`); }
  }
  if (c.stage === 'search' || c.stage === 'zoom' || c.stage === 'nomap') {
    const z = c.stage === 'zoom' ? 1 + 2 * ease(q) : 1;
    s += `<g><svg x="200" y="190" width="1000" height="760" viewBox="${200 + (500 - 500 / z)} ${190 + (380 - 380 / z)} ${1000 / z} ${760 / z}">${map(true)}</svg></g>`;
    s += R(1250, 250, 460, 70, '#0c2a44', 3, 'rx="8"') + TM(1270, 298, 32, typed('BLACKWATER', c.stage === 'search' ? q * 1.5 : 1) + (blink(t) ? '|' : ''), '#fff');
    if (c.stage === 'nomap') s += TM(1250, 380, 26, 'MAP SOURCE: OCEANIC CHART 2', '#7aa8d0');
    if (p > .45 || c.stage !== 'search') s += TM(1250, 440, 40, c.stage === 'nomap' ? 'LOCATION DOES NOT EXIST' : 'NO RESULTS FOUND', '#ff6a5a', 900);
  }
  if (c.stage === 'hidden') { s += map(true) + `<circle cx="700" cy="570" r="${20 + 10 * Math.sin(t * 6)}" fill="#ff3b3b" opacity="${blink(t * 2) ? 1 : .4}"/><circle cx="700" cy="570" r="${60 + ((t * 80) % 120)}" fill="none" stroke="#ff3b3b" stroke-width="4" opacity="${1 - ((t * 80) % 120) / 120}"/>`;
    s += TM(1250, 300, 30, 'DESTINATION', '#7aa8d0') + TM(1250, 370, 56, 'BLACKWATER', '#fff', 900) + TM(1250, 450, 28, 'NO CHARTED LAND', '#ff6a5a', 800); }
  return s + scan(160, 90, 1600, 900, t);
}
function radarUI(c, p, t, lt) {
  let s = `<rect width="1920" height="1080" fill="#0b0f14"/>` + screen(510, 90, 900, 900, '#03140a');
  const cx = 960, cy = 540;
  for (const r of [120, 240, 360, 430]) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1f6a3a" stroke-width="3"/>`;
  s += `<path d="M${cx - 430} ${cy} H${cx + 430} M${cx} ${cy - 430} V${cy + 430}" stroke="#1f6a3a" stroke-width="2"/>`;
  const a = t * 2.2; s += `<path d="M${cx} ${cy} L${cx + 430 * Math.cos(a)} ${cy + 430 * Math.sin(a)}" stroke="#4fe07a" stroke-width="5"/>`;
  for (let k = 1; k < 14; k++) { const b = a - k * .05; s += `<path d="M${cx} ${cy} L${cx + 430 * Math.cos(b)} ${cy + 430 * Math.sin(b)}" stroke="#4fe07a" stroke-width="10" opacity="${.18 * (1 - k / 14)}"/>`; }
  s += `<path d="M${cx} ${cy - 18} l12 30 h-24z" fill="#ffd23a"/>`;
  if (c.mode === 'many') { const n = Math.floor(300 * clamp(p * 2, 0, 1)); for (let i = 0; i < n; i++) { const r = 70 + rnd(i) * 350, th = rnd(i + 500) * 6.283; const age = ((a - th) % 6.283 + 6.283) % 6.283; s += `<circle cx="${cx + r * Math.cos(th)}" cy="${cy + r * Math.sin(th)}" r="5" fill="#9aff9a" opacity="${.35 + .65 * Math.exp(-age)}"/>`; } s += TM(560, 170, 30, `CONTACTS: ${n}`, '#ff6a5a', 900); }
  else s += TM(560, 170, 30, 'CONTACTS: 0', '#4fe07a', 900);
  return s + scan(510, 90, 900, 900, t);
}
function termUI(lines, p, t, opts = {}) {
  let s = `<rect width="1920" height="1080" fill="#0b0f14"/>` + screen(200, 110, 1520, 860, opts.bg || '#06100c');
  s += TM(240, 170, 28, opts.head || 'CREW TERMINAL · DECK 4', '#4fe07a');
  let y = 260; lines.forEach((l, i) => { const q = clamp(p * (opts.speed || 2.2) * lines.length / Math.max(1, lines.length) - i * .35, 0, 1); if (q <= 0) return; s += TM(l.x || 260, y, l.s || 40, typed(l.t, l.instant ? 1 : q * 1.4), l.c || '#c9ffd9', l.w || 700, l.a || 'start'); y += (l.s || 40) * 1.7; });
  if (opts.box) { const o = clamp((p - (opts.boxAt || .2)) * 5, 0, 1) * (blink(t * 1.3) ? 1 : .7); s += `<rect x="340" y="${opts.boxY || 560}" width="1240" height="${opts.boxH || 200}" rx="14" fill="#c33a2f" opacity="${o}"/>` + opts.box.map((b, i) => TM(960, (opts.boxY || 560) + 80 + i * 70, 48, b, '#fff', 900, 'middle', `opacity="${o}"`)).join(''); }
  return s + scan(200, 110, 1520, 860, t);
}
function sleepPhotoInner(t) { // the photo of him asleep (taken from above the wardrobe)
  let s = ENV.scabin('night');
  s += figure({ k: 'p047', x: 640, y: 640, s: 1.2, p: 'sleep', f: 0, e: 'sleep' }, 0, 0, 'night');
  return `<g transform="translate(-200 -200) scale(1.2)">${s}</g><rect width="1920" height="1080" fill="#1a2a3a" opacity=".35"/>`;
}
cardSVG = function (c, p, t, dur) {
  const lt = p * dur;
  if (c.t === 'clock') { const fl = c.flash ? (Math.floor(t * 2) % 2 ? 1 : .25) : 1; let s = `<rect width="1920" height="1080" fill="#14161a"/>` + `<rect x="420" y="300" width="1080" height="480" rx="60" fill="#1d2025" stroke="${INK}" stroke-width="10"/><rect x="480" y="360" width="960" height="360" rx="24" fill="#0a0b0c"/>`;
    return s + T(960, 640, 300, c.time || '10:17', '#ff3a2a', 900, 'middle', `font-family="DejaVu Sans Mono, monospace" opacity="${fl}" letter-spacing="10"`) + T(1360, 470, 56, 'AM', '#ff3a2a', 900, 'middle', `opacity="${fl}"`) + `<rect x="480" y="360" width="960" height="360" rx="24" fill="url(#glow)" opacity=".15"/>`; }
  if (c.t === 'phone') { let s = `<rect width="1920" height="1080" fill="#1a1c22"/><g transform="translate(960 560) rotate(${-4 + 2 * Math.sin(t)})">`;
    s += `<path d="M260 380 q120 -40 160 120 l60 260 l-200 40Z" fill="#7a4e33" stroke="${INK}" stroke-width="8"/>`;
    s += `<rect x="-240" y="-470" width="480" height="940" rx="60" fill="#111" stroke="${INK}" stroke-width="8"/><rect x="-215" y="-420" width="430" height="850" rx="30" fill="#2a3d6a"/>`;
    s += T(-180, -380, 26, 'No Service', '#ff8a7a', 800, 'start') + T(180, -380, 26, '⊘', '#ff8a7a', 800, 'end') + T(0, -200, 120, '10:17', '#fff', 300) + T(0, -120, 40, c.date || 'Saturday, October 31', '#e9eef8', 700);
    if (c.stage >= 1) { const q = clamp(p * 2, 0, 1); s += `<rect x="-190" y="-40" width="380" height="330" rx="20" fill="#1c2a4c" opacity=".9"/>` + T(0, 10, 30, 'OCTOBER', '#9ab', 800);
      [28, 29, 30, 31].forEach((d, i) => { const x = -150 + i * 100; const miss = i < 3; s += `<rect x="${x - 40}" y="50" width="80" height="80" rx="10" fill="${miss ? '#3a2a3a' : '#3d7ac2'}"/>` + T(x, 106, 36, d, '#fff', 800); if (miss && q > i * .3) s += T(x, 200, 64, '?', '#ff6a5a', 900, 'middle', `opacity="${clamp(q * 3 - i, 0, 1)}"`); });
      s += T(0, 270, 28, '3 days — no memory', '#ff8a7a', 800, 'middle', `opacity="${q}"`); }
    return s + `</g>`; }
  if (c.t === 'evac') return termUI([{ t: 'EMERGENCY LOG · SHIP STATUS', s: 34, c: '#7aa8d0' }, { t: '', s: 20 }, { t: 'PASSENGER EVACUATION COMPLETED.', s: 52, c: '#fff', w: 900 }, { t: '', s: 20 }, { t: 'DATE: OCTOBER 28 · 02:40 AM', s: 40, c: c.stage ? '#ffd23a' : '#c9ffd9' }, { t: 'LIFEBOATS LAUNCHED: 18 / 18', s: 36 }], c.stage ? 1 : p, t, { box: c.stage ? ['3 DAYS AGO'] : null, boxY: 720, boxH: 130, boxAt: .1 });
  if (c.t === 'nav') return navUI(c, p, t, lt);
  if (c.t === 'radar') return radarUI(c, p, t, lt);
  if (c.t === 'cctv') return cctvCard(c, p, t, lt);
  if (c.t === 'audio') { let s = termUI([{ t: 'SECURITY ARCHIVE / CABINS / 047', s: 34, c: '#7aa8d0', instant: 1 }], 1, t, { head: 'SECURITY ROOM · ARCHIVE' });
    s += `<path d="M300 300 h180 l30 34 h300 v220 h-510z" fill="#e0b030" stroke="${INK}" stroke-width="6"/>` + T(555, 470, 40, 'CABIN 047', '#2a1a0a', 900);
    if (c.stage >= 1) { s += R(900, 300, 720, 260, '#0c2a1a', 4, 'rx="12"') + TM(940, 360, 32, '▶ recording_047.wav', '#fff');
      const live = c.stage === 1 || c.stage === 2; if (c.stage === 4) {} const amp = c.stage === 2 ? 1 : .25;
      for (let i = 0; i < 60; i++) { const h = live ? (8 + Math.abs(Math.sin(t * 9 + i * .7) * Math.sin(t * 3.3 + i)) * 90 * amp + rnd(i + Math.floor(t * 12)) * 20 * (c.stage === 1 ? 1 : .3)) : 6; s += `<rect x="${940 + i * 11}" y="${470 - h / 2}" width="6" height="${h}" fill="${c.stage === 2 ? '#7dffb0' : '#5a8a6a'}"/>`; }
      s += TM(940, 540, 26, c.stage === 1 ? 'STATIC…' : (c.stage === 2 ? 'VOICE DETECTED' : (c.stage === 4 ? 'READY · 00:00 / 00:41' : 'END OF RECORDING')), c.stage === 2 ? '#ffd23a' : '#7aa8d0'); }
    return s; }
  if (c.t === 'smallmon') { let s = `<rect width="1920" height="1080" fill="#0b0d10"/>` + screen(360, 160, 1200, 760, '#050b10');
    s += TM(960, 330, 36, 'SHIP POSITION · LIVE', '#5ab0ff', 700, 'middle') + `<circle cx="960" cy="440" r="${14 + 6 * Math.sin(t * 5)}" fill="#ffd23a"/>`;
    if (c.stage >= 1) s += TM(960, 600, 52, typed('BLACKWATER ARRIVAL: 11 HOURS.', c.stage === 1 ? p * 2.5 : 1), '#fff', 900, 'middle');
    if (c.stage >= 2) s += TM(960, 720, 60, typed('PASSENGER 047: AWAKE.', p * 2.5), '#ff4a3a', 900, 'middle');
    return s + scan(360, 160, 1200, 760, t); }
  if (c.t === 'wrist') { let s = `<rect width="1920" height="1080" fill="#20242a"/>`;
    s += `<path d="M-100 380 L1400 300 Q1700 290 1800 460 Q1700 640 1400 640 L-100 760Z" fill="#7a4e33" stroke="${INK}" stroke-width="10"/>`;
    s += `<g transform="rotate(-4 900 520)"><rect x="700" y="300" width="300" height="440" rx="40" fill="#f4f2ee" stroke="${INK}" stroke-width="8"/><rect x="640" y="430" width="420" height="190" rx="16" fill="#e9e6dc" stroke="${INK}" stroke-width="7"/>`;
    s += T(850, 500, 34, 'PASSENGER', '#555', 800) + T(850, 590, 84, '047', '#c33a2f', 900, 'middle', `opacity="${clamp(p * 3 - .4, 0, 1)}"`) + `<rect x="680" y="440" width="40" height="160" fill="#3d7ac2"/></g>`;
    return s; }
  if (c.t === 'enginelog') {
    if (c.stage === 'doc') return termUI([{ t: 'OPERATING RECORD · LATEST', s: 34, c: '#7aa8d0' }, { t: '', s: 10 }, { t: 'CREW ON BOARD: 0', s: 44, c: '#fff', w: 900 }, { t: 'OPERATING WITHOUT CREW: 6 DAYS', s: 44, c: '#ffd23a', w: 900 }, { t: 'MODE: PROGRAMMED ROUTE', s: 40 }, { t: 'ROUTE: → BLACKWATER', s: 40 }], p, t, { head: 'ENGINE CONTROL · SYSTEM LOG' });
    if (c.stage === 'locked') return termUI([{ t: 'NAVIGATION CONTROLS', s: 40, c: '#7aa8d0' }, { t: 'RUDDER ........ LOCKED', s: 44, c: '#ff6a5a' }, { t: 'THROTTLE ...... LOCKED', s: 44, c: '#ff6a5a' }, { t: 'COURSE ........ LOCKED', s: 44, c: '#ff6a5a' }], p, t, { head: 'ENGINE CONTROL · ACCESS' });
    if (c.stage === 'shutdown') return termUI([{ t: 'EMERGENCY PROCEDURES', s: 34, c: '#7aa8d0' }, { t: '> 07  EMERGENCY ENGINE SHUTDOWN', s: 44, c: '#fff', w: 900 }, { t: '  STEP 1: OVERRIDE AUTOPILOT', s: 34 }, { t: '  STEP 2: CUT FUEL SUPPLY', s: 34 }, { t: '  STEP 3: CONFIRM MANUAL STOP', s: 34 }], p, t, { head: 'ENGINE CONTROL · PROCEDURES' });
    if (c.stage === 'warn') return termUI([{ t: '> EXECUTE SHUTDOWN?', s: 40 }], 1, t, { head: 'ENGINE CONTROL · WARNING', box: ['MANUAL SHUTDOWN WILL RESULT', 'IN TOTAL SYSTEM FAILURE.'], boxY: 420, boxH: 260, boxAt: 0 });
  }
  if (c.t === 'countdown') { const v = c.from + (c.to - c.from) * clamp(p * 1.2, 0, 1); const h = Math.floor(v), m = Math.floor((v - h) * 60), sec = Math.floor(((v - h) * 60 - m) * 60);
    let s = `<rect width="1920" height="1080" fill="#0b0f14"/>` + screen(360, 220, 1200, 640, '#120606');
    s += TM(960, 360, 44, c.label || 'BLACKWATER ARRIVAL', '#ff8a7a', 800, 'middle') + TM(960, 620, 190, `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`, v <= .001 ? '#ff2a1a' : '#fff', 900, 'middle');
    if (c.sub) s += TM(960, 760, 46, c.sub, '#ffd23a', 900, 'middle', `opacity="${clamp(p * 3, 0, 1)}"`);
    return s + scan(360, 220, 1200, 640, t); }
  if (c.t === 'paxlist') { let s = `<rect width="1920" height="1080" fill="#0b0f14"/>` + screen(200, 90, 1520, 900, '#060c14');
    s += TM(240, 150, 30, 'HIDDEN FOLDER · /SYS/PASSENGERS', '#5ab0ff') + TM(1680, 150, 30, 'RECORDS: 1,186', '#5ab0ff', 700, 'end');
    const ids = [12, 13, 19, 21, 26, 30, 33, 38, 41, 44, 47, 52, 55, 61];
    const scroll = c.stage === 0 ? -lt * 60 : 0;
    s += `<svg x="200" y="180" width="1520" height="800" viewBox="0 0 1520 800"><g transform="translate(0 ${scroll})">`;
    for (let i = 0; i < 26; i++) { const id = c.stage === 0 ? 100 + i * 37 : ids[i % ids.length] + (i >= ids.length ? 300 : 0); const is47 = id === 47;
      const st = is47 ? 'REPEAT' : (rnd(id) > .3 ? 'TRANSFERRED' : 'COMPLETED'); const show = c.stage >= 1 || c.stage === 0;
      const y = 60 + i * 62; const hl = is47 && c.stage >= 2;
      if (hl) s += `<rect x="20" y="${y - 44}" width="1480" height="60" fill="#c33a2f" opacity="${blink(t) ? .9 : .6}"/>`;
      s += TM(60, y, 38, `PASSENGER ${String(id).padStart(3, '0')}`, hl ? '#fff' : '#c9d9e9') + TM(1460, y, 38, show ? st : '', hl ? '#fff' : (st === 'COMPLETED' ? '#ffd23a' : '#7aa8d0'), 900, 'end'); }
    s += `</g></svg>`;
    if (c.stage === 3) s += `<rect x="360" y="380" width="1200" height="320" rx="18" fill="#0c1a2a" stroke="#5ab0ff" stroke-width="5"/>` + TM(960, 470, 40, typed('PASSENGER 047 HAS REGAINED', p * 3), '#fff', 900, 'middle') + TM(960, 530, 40, typed('CONSCIOUSNESS.', p * 3 - .5), '#fff', 900, 'middle') + TM(960, 620, 36, typed('PREVIOUS ARRIVAL ATTEMPTS: UNSUCCESSFUL.', p * 2.5 - .9), '#ff6a5a', 900, 'middle');
    return s + scan(200, 90, 1520, 900, t); }
  if (c.t === 'shipphoto') { const z = 1 + .12 * p; let s = `<rect width="1920" height="1080" fill="#14161a"/><g transform="translate(960 540) scale(${z}) translate(-960 -540)">`;
    s += `<g transform="rotate(-2 960 540)"><rect x="380" y="130" width="1160" height="820" fill="#efe6cf" stroke="${INK}" stroke-width="8"/><svg x="420" y="170" width="1080" height="640" viewBox="0 120 1920 960" preserveAspectRatio="xMidYMid slice">${ENV.socean('dusk5')}<rect width="1920" height="1080" fill="#7a5a3a" opacity=".35"/></svg>`;
    s += T(960, 900, 44, 'BLACKWATER', '#3a2a1a', 900) + `<g opacity="${clamp(p * 3 - .3, 0, 1)}">` + '<rect x="1150" y="840" width="340" height="80" rx="8" fill="#c33a2f"/>' + T(1320, 895, 44, 'DATED 2046', '#fff', 900) + `</g></g></g>`;
    return s; }
  if (c.t === 'returncabin') { let s = `<rect width="1920" height="1080" fill="#050608"/>`; for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) { const x = 120 + k * 580, y = 160 + r * 420; const o = clamp(p * 6 - (r * 3 + k) * .5, 0, 1);
      s += `<g opacity="${o}">${screen(x, y, 520, 300, '#2a0606')}${TM(x + 260, y + 130, 36, 'PASSENGER 047.', '#fff', 900, 'middle')}${TM(x + 260, y + 190, 26, 'PLEASE RETURN TO', '#ff8a7a', 900, 'middle')}${TM(x + 260, y + 230, 26, 'YOUR CABIN.', '#ff8a7a', 900, 'middle')}${scan(x, y, 520, 300, t)}</g>`; }
    return s; }
  if (c.t === 'sleepphoto') { const shake = c.shake ? Math.sin(t * 34) * 5 : 0; let s = `<rect width="1920" height="1080" fill="#14161a"/><g transform="translate(${shake},${shake * .6}) rotate(${-3 + (c.flip ? 2 : 0)} 960 540)">`;
    s += `<path d="M300 900 q-120 -40 -200 120 l300 80Z M1620 900 q120 -40 200 120 l-300 80Z" fill="#7a4e33" stroke="${INK}" stroke-width="8"/>`;
    s += `<rect x="440" y="140" width="1040" height="800" fill="#f4efe2" stroke="${INK}" stroke-width="8"/>`;
    if (!c.back) s += `<svg x="480" y="180" width="960" height="640" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">${sleepPhotoInner(t)}</svg>` + T(960, 900, 34, 'CABIN 047 · 03:02 AM', '#555', 700, 'middle', 'font-style="italic"');
    else s += `<g transform="rotate(-3 960 540)">${T(960, 560, 110, 'SEE YOU', '#2a2a3a', 900, 'middle', `opacity="${clamp(p * 3, 0, 1)}" font-family="DejaVu Serif" font-style="italic"`)}${T(960, 700, 110, 'NEXT TIME.', '#2a2a3a', 900, 'middle', `opacity="${clamp(p * 3 - .5, 0, 1)}" font-family="DejaVu Serif" font-style="italic"`)}</g>`;
    return s + `</g>`; }
  if (c.t === 'blackend') return `<rect width="1920" height="1080" fill="#000"/>`;
  return _card5(c, p, t, dur);
};
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env; const has = k => f.includes(k); let s = '';
  const base = _fx5(shot, lt, p, t, front);
  if (!front) {
    if (has('waves')) { const y0 = E === 'socean' ? 440 : (E === 'spool' ? 420 : 510); for (let i = 0; i < 26; i++) { const y = y0 + 10 + Math.pow(rnd(i + 9), 1.5) * (1080 - y0); const x = ((rnd(i) * 2100 + t * (20 + rnd(i + 2) * 30)) % 2100) - 100; const w = 40 + (y - y0) / 4; s += `<path d="M${x} ${y + Math.sin(t * 2 + i) * 4} q${w / 2} -${6 + w * .05} ${w} 0" stroke="${isNight(shot.light) ? '#2a3c58' : '#cfe6f6'}" stroke-width="${2 + (y - y0) / 160}" fill="none" opacity=".8"/>`; } }
    if (has('wake')) for (let k = 0; k < 8; k++) { const q = (t * .3 + k / 8) % 1; s += `<ellipse cx="${1660 - q * 1400}" cy="${800 + q * 60}" rx="${40 + q * 120}" ry="${6 + q * 10}" fill="#fff" opacity="${.5 * (1 - q)}"/>`; }
    if (has('flatsea')) { s += `<rect x="0" y="500" width="1920" height="580" fill="#1a3048"/><rect x="0" y="500" width="1920" height="580" fill="url(#glow)" opacity=".05"/><path d="M0 500 H1920" stroke="#3a5070" stroke-width="3"/>`; }
    if (has('darkshape')) { const q = clamp(.5 + p, 0, 1); const hy = E === 'sbridge' ? 330 : 500; s += `<rect x="0" y="${hy - 60}" width="1920" height="80" fill="#6a7a9a" opacity=".25"/>`; s += `<path d="M300 ${E === 'sbridge' ? 330 : 500} Q600 ${E === 'sbridge' ? 270 : 400} 900 ${E === 'sbridge' ? 285 : 430} Q1300 ${E === 'sbridge' ? 250 : 360} 1700 ${E === 'sbridge' ? 330 : 500}Z" fill="#020305" opacity="${q}"/>`; }
    if (E === 'scabin') {
      const clk = has('clock1017') ? '10:17' : (has('clockoff') ? '' : '10:17');
      if (clk) s += `<text x="1120" y="634" font-size="36" font-weight="900" fill="#ff3a2a" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" opacity="${has('clockflash') ? (Math.floor(t * 2) % 2 ? 1 : .2) : 1}">${clk}</text>`;
      if (has('camred') && blink(t * .8)) s += `<circle cx="1824" cy="174" r="7" fill="#ff2a1a"/><circle cx="1824" cy="174" r="20" fill="#ff2a1a" opacity=".3"/>`;
      if (has('photobed')) s += `<g transform="translate(760,640) rotate(-12)"><rect x="-70" y="-50" width="140" height="100" fill="#f4efe2" stroke="${INK}" stroke-width="4"/><rect x="-58" y="-40" width="116" height="66" fill="#3a4a5a"/></g>`;
      if (has('dooropen')) { const q = ease(clamp(p * 1.6, 0, 1)); s += `<rect x="80" y="260" width="220" height="520" fill="${has('corrdark') ? '#0a0a0c' : '#e9dfcc'}"/><path d="M80 260 L${80 + 220 * (1 - q * .8)} ${270} L${80 + 220 * (1 - q * .8)} 770 L80 780Z" fill="#8a6a4a" stroke="${INK}" stroke-width="6"/>`; }
    }
    if (E === 'spool') { if (has('ripples')) for (let k = 0; k < 6; k++) { const q = (t * .4 + k / 6) % 1; s += `<ellipse cx="${700 + rnd(k) * 520}" cy="${700 + rnd(k + 3) * 160}" rx="${20 + q * 90}" ry="${6 + q * 20}" fill="none" stroke="#bfe8fa" stroke-width="4" opacity="${1 - q}"/>`; }
      if (has('toy')) { const bx = 1220 + Math.sin(t * .7) * 20, by = 860 + Math.sin(t * 2) * 6; s += `<g transform="translate(${bx},${by}) rotate(${Math.sin(t * 1.6) * 8})"><ellipse cx="0" cy="0" rx="46" ry="26" fill="#f2c418" stroke="${INK}" stroke-width="5"/><circle cx="26" cy="-30" r="22" fill="#f2c418" stroke="${INK}" stroke-width="5"/><path d="M46 -30 l18 6 l-18 6z" fill="#e07a2a" stroke="${INK}" stroke-width="3"/><circle cx="32" cy="-36" r="4" fill="${INK}"/></g>`; } }
    if (E === 'sboat' && has('cables')) for (const x of [220, 760, 1300, 1840]) { const sw = Math.sin(t * 1.3 + x) * 14; s += `<path d="M${x + 165} 330 Q${x + 165 + sw} 480 ${x + 165 + sw * 1.4} 600" stroke="#4a5256" stroke-width="5" fill="none"/><path d="M${x + 155 + sw * 1.4} 600 h20 v16 q-10 20 -20 0" stroke="#4a5256" stroke-width="6" fill="none"/>`; }
    if (E === 'sbridge') {
      const off = has('lightsout') ? Math.floor(clamp(p * 1.15, 0, 1) * 8) : (has('allout') ? 8 : 0);
      for (let i = 0; i < 7; i++) { const x = 140 + i * 240, y = 600 - Math.sin((i + .5) / 7 * Math.PI) * 50; if (i < off) continue;
        const red = has('screensred'); const col = red ? '#3a0606' : (i % 3 === 0 ? '#0c2a44' : (i % 3 === 1 ? '#03140a' : '#06121e'));
        s += `<rect x="${x + 6}" y="${y + 6}" width="168" height="98" fill="${col}"/>`;
        if (red) s += TM(x + 90, y + 50, 16, 'PASSENGER 047.', '#fff', 900, 'middle') + TM(x + 90, y + 76, 12, 'RETURN TO CABIN', '#ff8a7a', 900, 'middle');
        else if (i % 3 === 1) { const a = t * 2.2; s += `<circle cx="${x + 90}" cy="${y + 55}" r="40" fill="none" stroke="#1f6a3a" stroke-width="2"/><path d="M${x + 90} ${y + 55} l${40 * Math.cos(a)} ${40 * Math.sin(a)}" stroke="#4fe07a" stroke-width="3"/>`; }
        else s += `<path d="M${x + 20} ${y + 70} l40 -20 l40 10 l40 -30" stroke="#5ab0ff" stroke-width="3" fill="none"/><circle cx="${x + 140}" cy="${y + 30}" r="5" fill="#ff4a3a" opacity="${blink(t)}"/>`;
        s += `<rect x="${x - 40}" y="${y - 30}" width="260" height="170" fill="url(#glow)" opacity="${red ? .2 : .12}"/>`; }
    }
    if (E === 'ssec' && !has('nofeeds')) for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const x = 360 + c * 305, y = 115 + r * 175, k = r * 4 + c;
      s += `<svg x="${x}" y="${y}" width="285" height="160" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><rect width="1920" height="1080" fill="${['#2a3a34', '#33403a', '#2a3440'][k % 3]}"/><path d="M0 0 L820 340 L820 600 L0 1080 M1920 0 L1100 340 L1100 600 L1920 1080" stroke="#5a7a6a" stroke-width="16" fill="none"/>${has('feedsfrozen') ? '' : `<circle cx="${(rnd(k) * 1920 + t * 160 * (k % 2 ? 1 : -1)) % 1920}" cy="${700 + rnd(k + 1) * 200}" r="60" fill="#9ab0a4"/><rect x="${(rnd(k) * 1920 + t * 160 * (k % 2 ? 1 : -1)) % 1920 - 30}" y="${760 + rnd(k + 1) * 200}" width="60" height="220" fill="#9ab0a4"/>`}<rect width="1920" height="1080" fill="#9fd0b0" opacity=".08"/></svg>` + TM(x + 10, y + 26, 18, `CAM ${String(k + 1).padStart(2, '0')}`, '#e9f2ee');
      s += `<rect x="${x}" y="${y + ((t * 60 + k * 30) % 160)}" width="285" height="10" fill="#fff" opacity=".05"/>`; }
    if (E === 'sengine') { if (has('warnlights')) for (const [x, y] of [[300, 300], [800, 300], [1300, 300], [1730, 360]]) { const on = Math.floor(t * 2 + x) % 2; s += `<circle cx="${x}" cy="${y}" r="16" fill="${on ? '#ff3b2a' : '#5a1a14'}" stroke="${INK}" stroke-width="4"/>` + (on ? `<circle cx="${x}" cy="${y}" r="70" fill="#ff3b2a" opacity=".18"/>` : ''); }
      s += `<rect x="1630" y="545" width="200" height="120" fill="#0a140c"/>` + TM(1640, 580, 16, 'SYS: AUTO', '#4fe07a') + TM(1640, 610, 16, 'CREW: 0', '#ffd23a') + TM(1640, 640, 16, blink(t) ? 'ROUTE ▶' : '', '#4fe07a');
      for (const x of [330, 830, 1330]) s += `<path d="M${x} 520 l${26 * Math.cos(t * 9 + x)} ${26 * Math.sin(t * 9 + x)}" stroke="#c33a2f" stroke-width="5"/>`;
      if (has('steam')) for (let k = 0; k < 6; k++) { const q = (t * .5 + k / 6) % 1; s += `<circle cx="${560 + k * 40 + Math.sin(q * 6) * 20}" cy="${200 - q * 160}" r="${20 + q * 50}" fill="#c9d0d4" opacity="${.3 * (1 - q)}"/>`; } }
    if (E === 'sroom') { const st = has('monmsg2') ? 2 : (has('monmsg1') ? 1 : 0); s += `<rect x="840" y="490" width="240" height="150" fill="#0a1420"/><circle cx="960" cy="${530}" r="${6 + 3 * Math.sin(t * 5)}" fill="#ffd23a"/>`; if (st) s += TM(960, 590, 14, 'BLACKWATER ARRIVAL: 11 HOURS.', '#fff', 900, 'middle'); if (st > 1) s += TM(960, 620, 16, 'PASSENGER 047: AWAKE.', '#ff4a3a', 900, 'middle'); s += `<rect x="780" y="440" width="360" height="260" fill="url(#glow)" opacity=".15"/>`; }
    if ((E === 'scorr' || E === 'scorre') && has('shadow')) { const q = clamp((lt - .3) / 1.4, 0, 1); if (q > 0 && q < 1) s += `<g opacity=".9"><ellipse cx="${905 + q * 110}" cy="430" rx="20" ry="26" fill="#050608"/><rect x="${890 + q * 110}" y="450" width="30" height="120" rx="10" fill="#050608"/></g>`; }
    if ((E === 'scorr' || E === 'scorre') && has('enddoor')) { const q = has('enddoorclose') ? ease(clamp((lt - .2) / 1.6, 0, 1)) : 1; const open = has('enddooropen') ? ease(clamp(lt / 1.0, 0, 1)) : 0; const w = 120 * (has('enddooropen') ? (1 - open * .85) : (.15 + .85 * q)); s += `<rect x="900" y="380" width="120" height="220" fill="#08090b"/><rect x="900" y="380" width="${w}" height="220" fill="#8a6a4a" stroke="${INK}" stroke-width="4"/>`; }
    if ((E === 'scorr' || E === 'scorre') && has('uniform')) { s += `<g transform="translate(980,930)"><path d="M-160 0 L-40 -40 L60 -30 L150 10 L40 40 L-90 36Z" fill="#f4f2ee" stroke="${INK}" stroke-width="6"/><path d="M60 -30 L200 -10 L220 30 L150 10Z" fill="#1a1a22" stroke="${INK}" stroke-width="6"/><rect x="-40" y="-26" width="34" height="10" fill="#d4b45a"/><path d="M-60 -6 h40" stroke="#d4b45a" stroke-width="6"/></g>`;
      if (has('warm')) for (let k = 0; k < 4; k++) { const q = (t * .4 + k / 4) % 1; s += `<path d="M${920 + k * 40} ${900 - q * 160} q-14 -20 0 -40 q14 -20 0 -40" stroke="#fff" stroke-width="5" fill="none" opacity="${.4 * (1 - q)}"/>`; } }
    if (E === 'sphone' && has('phonelift')) { }
  }
  if (front) {
    if (has('vibe')) { }
    if (has('blackout')) { const q = clamp(p * 2.5, 0, 1); s += `<rect x="-200" y="-200" width="2400" height="1500" fill="#000" opacity="${q * .97}"/>`; }
    if (has('lightson')) { const q = 1 - clamp(lt / .25, 0, 1); s += `<rect x="-200" y="-200" width="2400" height="1500" fill="#000" opacity="${q}"/><rect x="-200" y="-200" width="2400" height="1500" fill="#fff" opacity="${lt < .4 ? .25 * (1 - lt / .4) : 0}"/>`; }
  }
  return base + s;
};
Object.assign(LIGHT, {
  emerg: t => { const k = Math.floor(t * 9); const fl = rnd(k) > .85 ? .5 : .32; return `<rect width="1920" height="1080" fill="#1a0306" opacity="${fl}"/><rect width="1920" height="1080" fill="#ff2a1a" opacity="${.06 + .05 * Math.sin(t * 3)}"/>`; },
  shipnight: t => `<rect width="1920" height="1080" fill="#06102a" opacity=".2"/>`,
  dusk5: LIGHT.dusk5 || (t => ''),
  sea: t => ''
});
