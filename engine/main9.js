// ---------- Video 9: the bunker — environments, CCTV feeds, cards, fx ----------
const BCON = ['#5c5b56', '#4e4d49', '#403f3c', '#2e2d2b'];
function concrete(x, y, w, h, c = BCON[0], seed = 1) { let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  for (let i = 0; i < w / 240; i++) s += `<path d="M${x + i * 240} ${y} V${y + h}" stroke="#000" stroke-width="3" opacity=".18"/>`;
  for (let i = 0; i < 26; i++) s += `<circle cx="${x + rnd(seed + i) * w}" cy="${y + rnd(seed + i + 40) * h}" r="${2 + rnd(seed + i + 9) * 4}" fill="#000" opacity=".12"/>`;
  for (let i = 0; i < 4; i++) { const cx = x + rnd(seed + i * 3) * w, cy = y + rnd(seed + i * 5) * h; s += `<path d="M${cx} ${cy} l${20 + rnd(i) * 30} ${30 + rnd(i + 2) * 40} l-10 ${20 + rnd(i + 3) * 30}" stroke="#000" stroke-width="2.5" fill="none" opacity=".25"/>`; }
  return s; }
function crt(x, y, w, h) { return `<rect x="${x - 16}" y="${y - 16}" width="${w + 32}" height="${h + 40}" rx="14" fill="#2a2b2e" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#0a120e"/>`; }
function vaultDoor(cx, cy, r, open = 0) { let s = `<circle cx="${cx}" cy="${cy}" r="${r + 26}" fill="#3a3a3a" stroke="${INK}" stroke-width="8"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#6a6e70" stroke="${INK}" stroke-width="8"/><circle cx="${cx}" cy="${cy}" r="${r * .82}" fill="none" stroke="#565a5c" stroke-width="10"/>`;
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; s += `<circle cx="${cx + Math.cos(a) * r * .92}" cy="${cy + Math.sin(a) * r * .92}" r="${r * .035}" fill="#3a3e40" stroke="${INK}" stroke-width="2"/>`; }
  return s; }
function wheel(cx, cy, r, rot) { let s = `<g transform="rotate(${rot} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#b03a2a" stroke-width="${r * .14}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="3"/>`;
  for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283; s += `<path d="M${cx} ${cy} L${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}" stroke="#8a2a1e" stroke-width="${r * .12}"/>`; }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * .2}" fill="#5a5e60" stroke="${INK}" stroke-width="4"/></g>`; }
function shelfUnit(x, y, w, h, seed = 3) { let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3e3a34" stroke="${INK}" stroke-width="6"/>`;
  for (let r = 0; r < 4; r++) { const yy = y + 20 + r * (h - 20) / 4; s += `<rect x="${x}" y="${yy + (h - 20) / 4 - 14}" width="${w}" height="14" fill="#6a5a44" stroke="${INK}" stroke-width="3"/>`;
    for (let k = 0; k < Math.floor(w / 70); k++) { const ih = 40 + rnd(seed + r * 9 + k) * 50, iw = 46 + rnd(seed + k) * 14, ix = x + 14 + k * 70, iy = yy + (h - 20) / 4 - 14 - ih; const t = Math.floor(rnd(seed + r * 3 + k) * 4);
      s += t === 0 ? `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="8" fill="#9fc6dc" stroke="${INK}" stroke-width="3" opacity=".9"/>` : t === 1 ? `<rect x="${ix}" y="${iy + ih * .3}" width="${iw}" height="${ih * .7}" fill="#7a6a3a" stroke="${INK}" stroke-width="3"/>` : t === 2 ? `<rect x="${ix}" y="${iy + ih * .4}" width="${iw}" height="${ih * .6}" rx="4" fill="#a83a2a" stroke="${INK}" stroke-width="3"/>` : `<rect x="${ix}" y="${iy + ih * .2}" width="${iw}" height="${ih * .8}" fill="#56604a" stroke="${INK}" stroke-width="3"/>`; } }
  return s; }
function bunkerRoom(L, mirror) { let s = concrete(0, 0, 1920, 820, BCON[0], mirror ? 7 : 1);
  s += `<path d="M0 0 H1920 V110 Q960 40 0 110Z" fill="${BCON[2]}"/><path d="M0 110 Q960 40 1920 110" stroke="${INK}" stroke-width="6" fill="none"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${200 + i * 300} 80 V820" stroke="${BCON[2]}" stroke-width="22"/><path d="M${200 + i * 300} 80 V820" stroke="${INK}" stroke-width="2" opacity=".4"/>`;
  s += `<path d="M0 150 H1920" stroke="#7a6a4a" stroke-width="14"/><path d="M0 172 H1920" stroke="#5a6a7a" stroke-width="10"/>`;
  s += `<rect y="820" width="1920" height="260" fill="${BCON[3]}"/>` + P('M0 820 H1920', 'none', 7) + Array.from({ length: 16 }, (_, i) => `<path d="M${i * 130} 820 L${(i * 130 - 960) * 1.7 + 960} 1080" stroke="#000" stroke-width="3" opacity=".25"/>`).join('');
  // vault door (left) + stairs
  s += `<path d="M0 260 L120 260 L120 820 L0 820Z" fill="${BCON[2]}"/>` + vaultDoor(250, 470, 170);
  // vent
  s += `<rect x="880" y="200" width="160" height="100" fill="#2a2b2d" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 6 }, (_, k) => `<path d="M890 ${214 + k * 14} h140" stroke="#5a5c5e" stroke-width="6"/>`).join('');
  // desk + monitors + radio
  s += `<rect x="470" y="660" width="660" height="34" fill="#4a4036" stroke="${INK}" stroke-width="6"/><path d="M500 694 V820 M1100 694 V820" stroke="${INK}" stroke-width="12"/>`;
  s += crt(520, 470, 170, 130) + crt(730, 440, 210, 160) + crt(980, 490, 120, 100) + `<rect x="760" y="640" width="160" height="18" rx="4" fill="#2a2b2e" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="1150" y="610" width="130" height="80" rx="8" fill="#3a3f46" stroke="${INK}" stroke-width="5"/><path d="M1260 610 l20 -70" stroke="${INK}" stroke-width="5"/><rect x="1166" y="626" width="60" height="26" fill="#2a3020"/>`;
  s += `<rect x="1140" y="690" width="160" height="10" fill="#4a4036"/><path d="M1150 700 V820 M1290 700 V820" stroke="${INK}" stroke-width="8"/>`;
  // chair
  s += `<path d="M760 820 v-90 M860 820 v-90 M750 730 h120 M760 730 l-6 -120 h100 l6 120" stroke="${INK}" stroke-width="10" fill="none"/>`;
  // tally wall plate
  s += `<rect x="1330" y="300" width="300" height="230" fill="${BCON[1]}" stroke="#000" stroke-width="2" opacity=".55"/>`;
  // cot
  s += `<rect x="1320" y="730" width="320" height="40" rx="10" fill="#5a6a4a" stroke="${INK}" stroke-width="5"/><path d="M1330 770 V820 M1630 770 V820" stroke="${INK}" stroke-width="8"/><rect x="1330" y="710" width="80" height="30" rx="10" fill="#d9d4c7" stroke="${INK}" stroke-width="4"/>`;
  // storage shelf (hides the panel)
  s += shelfUnit(1680, 240, 240, 580, mirror ? 9 : 3);
  // tiny camera (top right corner) — a clue from the start
  s += `<rect x="1846" y="118" width="44" height="26" rx="6" fill="#26282b" stroke="${INK}" stroke-width="3"/><circle cx="1854" cy="131" r="6" fill="#111"/><path d="M1880 118 v-14" stroke="${INK}" stroke-width="4"/>`;
  // hanging lamps
  for (const x of [640, 1380]) s += `<path d="M${x} 60 V150" stroke="${INK}" stroke-width="4"/><path d="M${x - 40} 190 L${x - 22} 150 h44 L${x + 40} 190Z" fill="#3a3c3e" stroke="${INK}" stroke-width="4"/>`;
  return s; }
ENV.bunker = L => bunkerRoom(L, 0);
ENV.bunker2 = L => `<g transform="translate(1920 0) scale(-1 1)">${bunkerRoom(L, 1)}</g>`;
ENV.bdoor = L => { let s = concrete(0, 0, 1920, 1080, BCON[1], 5) + `<rect y="900" width="1920" height="180" fill="${BCON[3]}"/>` + P('M0 900 H1920', 'none', 6);
  s += `<path d="M120 1080 L360 900 M520 1080 L560 900" stroke="#000" opacity=".2" stroke-width="4"/>` + vaultDoor(820, 500, 380);
  s += `<rect x="1380" y="380" width="340" height="300" rx="16" fill="#2a2b2e" stroke="${INK}" stroke-width="7"/><rect x="1410" y="410" width="280" height="150" fill="#06100a"/>` + Array.from({ length: 9 }, (_, k) => `<rect x="${1420 + (k % 3) * 90}" y="${580 + Math.floor(k / 3) * 30}" width="70" height="22" rx="4" fill="#4a4c4f"/>`).join('');
  s += `<rect x="740" y="60" width="160" height="40" fill="#e0b030" stroke="${INK}" stroke-width="4"/>` + T(820, 88, 22, 'EXIT', '#1a1a1a', 900);
  return s; };
ENV.bsecret = L => { let s = concrete(0, 0, 1920, 860, '#46443f', 11) + `<rect y="860" width="1920" height="220" fill="${BCON[3]}"/>` + P('M0 860 H1920', 'none', 6);
  s += `<rect x="80" y="260" width="380" height="600" fill="#2e3032" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 7 }, (_, k) => `<rect x="100" y="${290 + k * 80}" width="340" height="56" fill="#3a3d40" stroke="${INK}" stroke-width="3"/><circle cx="130" cy="${318 + k * 80}" r="7" fill="${k % 3 ? '#3a6a3a' : '#7a2a1a'}"/>`).join('');
  s += `<rect x="560" y="660" width="560" height="30" fill="#4a4036" stroke="${INK}" stroke-width="5"/><path d="M590 690 V860 M1090 690 V860" stroke="${INK}" stroke-width="10"/>` + crt(700, 470, 260, 180);
  for (let k = 0; k < 5; k++) s += `<rect x="${560 + k * 110}" y="${230 + (k % 2) * 30}" width="90" height="120" fill="#e9e2cc" stroke="${INK}" stroke-width="3" transform="rotate(${(k - 2) * 3} ${600 + k * 110} 290)"/><path d="M${575 + k * 110} ${260 + (k % 2) * 30} h60 M${575 + k * 110} ${280 + (k % 2) * 30} h50" stroke="#555" stroke-width="3"/>`;
  // the lower-level door with warning
  s += `<rect x="1250" y="200" width="460" height="660" fill="#3a3c3e" stroke="${INK}" stroke-width="9"/><rect x="1280" y="230" width="400" height="630" fill="#55595c" stroke="${INK}" stroke-width="6"/>`;
  s += `<path d="M1280 470 h400 M1280 620 h400" stroke="#3a3c3e" stroke-width="10"/>` + T(1480, 380, 30, 'DO NOT CONNECT TO THE', '#c33a2f', 900) + T(1480, 420, 30, 'EXTERNAL CAMERA SYSTEM', '#c33a2f', 900);
  s += `<rect x="1300" y="520" width="360" height="40" fill="#e0b030" opacity=".85"/>` + T(1480, 550, 26, 'SECTION B · LOWER LEVEL', '#1a1a1a', 900);
  s += `<rect x="1740" y="420" width="150" height="200" rx="10" fill="#2a2b2e" stroke="${INK}" stroke-width="6"/><rect x="1756" y="440" width="118" height="70" fill="#06100a"/>`;
  return s; };
ENV.bout = L => { const n = L !== 'bday'; let s = `<defs><linearGradient id="bos" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${n ? '#0a0d12' : '#6a5a4e'}"/><stop offset="1" stop-color="${n ? '#262a30' : '#b08a6a'}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#bos)"/>`;
  s += `<path d="M0 640 Q400 520 900 600 T1920 560 V1080 H0Z" fill="${n ? '#2a2c26' : '#7a6a52'}" stroke="${INK}" stroke-width="5"/>`;
  for (const [x, h] of [[200, 260], [1600, 220], [1780, 300]]) s += `<path d="M${x} ${640} v-${h} M${x} ${640 - h * .6} l-50 -60 M${x} ${640 - h * .4} l60 -70 M${x} ${640 - h * .8} l30 -40" stroke="${n ? '#14161a' : '#3a2e24'}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M560 980 L640 520 L1280 520 L1360 980Z" fill="${n ? '#4a4c4a' : '#8a8a84'}" stroke="${INK}" stroke-width="7"/><path d="M600 520 h720 v-40 h-720z" fill="${n ? '#3a3c3a' : '#76766e'}" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="780" y="600" width="360" height="380" fill="${n ? '#3a4044' : '#6a7074'}" stroke="${INK}" stroke-width="8"/><circle cx="960" cy="790" r="60" fill="none" stroke="#7a2a1e" stroke-width="14"/><path d="M780 700 h360 M780 880 h360" stroke="#000" opacity=".25" stroke-width="6"/>`;
  s += `<rect y="980" width="1920" height="100" fill="${n ? '#1e201c' : '#5e5040'}"/>` + P('M0 980 H1920', 'none', 5);
  return s; };
ENV.bcity = L => { let s = `<defs><linearGradient id="bcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0a10"/><stop offset=".6" stop-color="#6a2018"/><stop offset="1" stop-color="#d0642a"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#bcs)"/>`;
  for (let i = 0; i < 14; i++) { const x = i * 145 - 20, h = 260 + rnd(i + 4) * 360; s += `<rect x="${x}" y="${860 - h}" width="125" height="${h}" fill="#1a1416" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: Math.floor(h / 50) }, (_, k) => `<rect x="${x + 20}" y="${880 - h + k * 50}" width="85" height="20" fill="${rnd(i * 7 + k) > .7 ? '#d08a3a' : '#2a2224'}" opacity=".8"/>`).join(''); }
  s += `<rect y="860" width="1920" height="220" fill="#2a2224" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 5; i++) s += `<path d="M${200 + i * 400} 600 q-60 -200 40 -420" stroke="#3a2a28" stroke-width="${60 + i * 10}" fill="none" opacity=".5" stroke-linecap="round"/>`;
  return s; };
ENV.bwallc = L => { let s = concrete(0, 0, 1920, 1080, BCON[0], 21); return s; };
ENV.bvent = L => { let s = concrete(0, 0, 1920, 1080, BCON[1], 31) + `<rect x="560" y="260" width="800" height="520" fill="#202124" stroke="${INK}" stroke-width="10"/>`;
  for (let k = 0; k < 9; k++) s += `<rect x="590" y="${290 + k * 54}" width="740" height="30" fill="#4a4c4f" stroke="${INK}" stroke-width="3"/>`;
  return s + [[580, 280], [1340, 280], [580, 760], [1340, 760]].map(([x, y]) => C(x, y, 12, '#6a6c6e', 3)).join(''); };
// ---------- CCTV feeds ----------
const _card8 = cardSVG, _fx8 = fxSVG;
function sign(x, y, s, text, lines) { const ls = lines || [text]; const w = 300, h = 60 + ls.length * 52;
  return `<g transform="translate(${x} ${y}) scale(${s}) rotate(-3)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#efeadb" stroke="${INK}" stroke-width="5"/>${ls.map((l, i) => `<text x="0" y="${-h / 2 + 62 + i * 52}" font-size="${Math.min(40, 280 / (l.length * .62))}" font-weight="900" fill="#1a1a1a" text-anchor="middle" font-family="DejaVu Sans" font-style="italic">${l}</text>`).join('')}</g>`; }
function feedInner(c, t, lt, p) {
  if (c.mode === 'internal') { let s = ENV.bunker('bwarm') + figure({ k: 'dan', x: 760, y: 1010, s: 1.25, p: 'still', f: 0, e: 'back', nopack: 1 }, t, lt, 'bwarm'); return `<g transform="translate(1920 0) scale(-1 1) translate(-160 -80) scale(1.15)">${s}</g>`; }
  if (c.mode === 'second') { let s = ENV.bunker2('bwarm'); const sit = figure({ k: 'dan', x: 1080, y: 820, s: 1.1, p: c.write ? 'reach' : 'sit', f: 0, e: c.look ? 'blank' : 'det', nopack: 1 }, t, lt, 'bwarm');
    return s + sit + (c.paper ? sign(1240, 560, 1.4 * clamp(lt / 1.2, .2, 1), '', ['YOU ARE NOT IN THE', 'ORIGINAL BUNKER.']) : ''); }
  let s = ENV.bout('night');
  const nst = c.stones || 0; for (let k = 0; k < nst; k++) s += `<ellipse cx="${700 + k * 70}" cy="${1000 + (k % 2) * 14}" rx="28" ry="18" fill="#7a7a74" stroke="${INK}" stroke-width="4"/>`;
  if (c.msg) s += `<g opacity="${c.msgin ? clamp(lt / 1.5, 0, 1) : 1}"><text x="960" y="680" font-size="40" font-weight="900" fill="#c33a2f" text-anchor="middle" font-family="DejaVu Sans" transform="rotate(-2 960 680)">WE KNOW</text><text x="960" y="740" font-size="40" font-weight="900" fill="#c33a2f" text-anchor="middle" font-family="DejaVu Sans" transform="rotate(-2 960 740)">YOU ARE THERE</text></g>`;
  if (c.photo) s += `<g transform="translate(1080 1010) rotate(-12)"><rect x="-60" y="-40" width="120" height="84" fill="#f4efe2" stroke="${INK}" stroke-width="4"/><rect x="-50" y="-30" width="100" height="56" fill="#8a7a6a"/></g>`;
  if (c.shadow) { const q = clamp((lt - .3) / 1.0, 0, 1); if (q > 0 && q < 1) s += `<g opacity=".85"><ellipse cx="${300 + q * 1300}" cy="760" rx="60" ry="160" fill="#000"/></g>`; }
  if (c.second) s += `<g opacity="${c.second === 2 ? .85 : .35}">${figure({ k: 'dan', x: 1500, y: 960, s: .8, p: 'still', f: 1, e: 'blank', nopack: 1 }, t, lt, 'bnight')}</g>`;
  if (c.mic) { s += `<g transform="translate(960 1060) scale(1.7) translate(-960 -1060)">` + figure({ k: 'mic', x: 960, y: 1060, s: 1.05, p: c.sign ? 'hold' : 'still', f: 0, e: c.eyes || 'soft' }, t, lt, 'bnight') + (c.sign ? sign(1010, 800, 1.0, '', c.sign) : '') + `</g>`; }
  return s;
}
function feedCard(c, p, t, lt) {
  let s = `<rect width="1920" height="1080" fill="#0a0b0c"/>` + screen(160, 70, 1600, 900, '#000');
  const zt = c.zoomTo || (c.mic ? [1000, 760] : [960, 700]); const z0 = c.z0 || 1, z1 = c.z1 || (c.zoom ? 2.2 : 1.05); const z = z0 + (z1 - z0) * ease(clamp(p * 1.1, 0, 1));
  const inner = feedInner(c, t, lt, p);
  const tint = c.mode === 'second' ? '#3a2a1a' : (c.mode === 'internal' ? '#2a2a1a' : '#1a3a2a');
  s += `<svg x="160" y="70" width="1600" height="900" viewBox="0 0 1920 1080"><g transform="translate(${zt[0]} ${zt[1]}) scale(${z}) translate(${-zt[0]} ${-zt[1]})">${inner}</g><rect width="1920" height="1080" fill="${tint}" opacity=".35" style="mix-blend-mode:multiply"/><rect width="1920" height="1080" fill="#b0d0c0" opacity=".1"/>`;
  if (c.glitch || (lt < .25)) for (let k = 0; k < 8; k++) { const y = rnd(Math.floor(t * 20) + k) * 1080; s += `<rect x="0" y="${y}" width="1920" height="${10 + rnd(k + Math.floor(t * 20)) * 40}" fill="#fff" opacity="${.08 + rnd(k) * .1}"/>`; }
  if (c.detect) { const bx = c.detect; const on = blink(t * 2); s += `<rect x="${bx[0]}" y="${bx[1]}" width="${bx[2]}" height="${bx[3]}" fill="none" stroke="#ff3b3b" stroke-width="6" opacity="${on ? 1 : .4}"/>` + `<text x="${bx[0]}" y="${bx[1] - 14}" font-size="34" font-weight="900" fill="#ff3b3b" font-family="DejaVu Sans Mono">MOTION DETECTED</text>`; }
  if (c.mode === 'second' && c.look) s += `<circle cx="1080" cy="${820 - 210 * 1.1}" r="90" fill="none" stroke="#fff" stroke-width="0"/>`;
  s += `</svg>` + scan(160, 70, 1600, 900, t);
  const sec = (c.sec != null ? c.sec : 0) + Math.floor(lt);
  s += TM(200, 130, 32, c.label || 'CAM 01 · ENTRANCE', '#e9f2ee') + TM(1720, 130, 32, `${c.day || 'DAY 90'}  ${c.time || '03:12'}:${String(sec % 60).padStart(2, '0')}`, c.future ? '#ff6a5a' : '#e9f2ee', 700, 'end');
  if (blink(t)) s += `<circle cx="1690" cy="930" r="13" fill="#ff3b3b"/>` + TM(1660, 942, 28, 'REC', '#ff3b3b', 900, 'end');
  if (c.ff) s += TM(210, 930, 40, c.ff, '#fff', 900);
  if (c.circle) s += `<ellipse cx="${160 + 1600 * c.circle[0] / 1920}" cy="${70 + 900 * c.circle[1] / 1080}" rx="${c.circle[2]}" ry="${c.circle[3]}" fill="none" stroke="#ffc04a" stroke-width="7" stroke-dasharray="${1400 * clamp(p * 1.6, 0, 1)} 1500"/>`;
  return s; }
cardSVG = function (c, p, t, dur) {
  const lt = p * dur;
  if (c.t === 'feed') return feedCard(c, p, t, lt);
  if (c.t === 'bnote') { const sh = Math.sin(t * 30) * (c.shake ? 3 : 0); let s = `<rect width="1920" height="1080" fill="#0e0f10"/><g transform="translate(${sh} ${sh * .5}) rotate(-3 960 540)"><rect x="380" y="180" width="1160" height="720" fill="#efeadb" stroke="${INK}" stroke-width="10"/>`;
    const L = c.lines; const q = c.type ? clamp(p * 1.5, 0, 1) * L.join('').length : 1e9; let acc = 0;
    L.forEach((l, i) => { const n = clamp(q - acc, 0, l.length); acc += l.length; s += `<text x="960" y="${540 - (L.length - 1) * 70 + i * 140}" font-size="${Math.min(110, 1000 / (l.length * .6))}" font-weight="900" fill="${c.red && i === L.length - 1 ? '#7a1a12' : '#1a1a1a'}" text-anchor="middle" font-family="DejaVu Sans" font-style="italic">${l.slice(0, Math.floor(n))}</text>`; });
    return s + `</g>`; }
  if (c.t === 'bpanel') { let s = `<rect width="1920" height="1080" fill="#0b0c0e"/>` + screen(260, 140, 1400, 800, c.bg || '#050c08'); let y = 300;
    s += TM(300, 200, 30, c.head || 'BUNKER CONTROL SYSTEM', '#5ab06a');
    c.lines.forEach((l, i) => { const q = clamp(p * 2.5 - i * .45, 0, 1); if (q <= 0) return; const [txt, col] = Array.isArray(l) ? l : [l, '#c9ffd9']; const big = txt.length < 24; s += TM(960, y + (big ? 30 : 0), big ? 74 : 52, typed(txt, q * 1.4), col, 900, 'middle', (Array.isArray(l) && l[2] && blink(t * 1.5)) ? 'opacity=".55"' : ''); y += big ? 140 : 100; });
    return s + scan(260, 140, 1400, 800, t); }
  if (c.t === 'bdocs') { let s = `<rect width="1920" height="1080" fill="#1a1c20"/><g transform="rotate(-2 960 540)"><rect x="260" y="120" width="1400" height="840" fill="#20406a" stroke="${INK}" stroke-width="8"/>`;
    for (let i = 0; i < 28; i++) s += `<path d="M${260 + i * 50} 120 v840" stroke="#2c5080" stroke-width="2"/>`; for (let i = 0; i < 17; i++) s += `<path d="M260 ${120 + i * 50} h1400" stroke="#2c5080" stroke-width="2"/>`;
    s += `<path d="M300 300 H1620" stroke="#cfe0f0" stroke-width="5"/>` + T(960, 200, 46, 'BUNKER — CROSS SECTION', '#e8f0f8', 900);
    s += `<rect x="560" y="340" width="800" height="220" fill="none" stroke="#e8f0f8" stroke-width="6"/>` + T(960, 470, 40, 'SECTION A · MAIN', '#e8f0f8', 800);
    const q = clamp(p * 2, 0, 1); s += `<g opacity="${q}"><rect x="560" y="620" width="800" height="220" fill="none" stroke="#ff8a6a" stroke-width="6" stroke-dasharray="20 12"/>` + T(960, 730, 40, 'SECTION B · LOWER LEVEL', '#ff8a6a', 900) + T(960, 790, 32, 'SEALED', '#ff8a6a', 900) + `<path d="M960 560 V620" stroke="#ff8a6a" stroke-width="6"/></g>`;
    s += T(1500, 920, 28, 'Design: R. — 2009', '#cfe0f0', 700, 'end', 'font-style="italic"'); return s + '</g>'; }
  if (c.t === 'bphoto') { let s = `<rect width="1920" height="1080" fill="#14120f"/><g transform="rotate(-3 960 540) translate(960 540) scale(${1 + .05 * p}) translate(-960 -540)"><rect x="480" y="140" width="960" height="800" fill="#f4efe2" stroke="${INK}" stroke-width="8"/>`;
    s += `<svg x="520" y="180" width="880" height="600" viewBox="0 0 1920 1310"><rect width="1920" height="1310" fill="#b8c8a0"/><rect y="900" width="1920" height="410" fill="#7a9a5a"/><circle cx="1500" cy="260" r="120" fill="#fff6c8"/>${figure({ k: 'dan', x: 760, y: 1200, s: 2.4, p: 'stand', f: 0, e: 'soft', nopack: 1, nosh: 1 }, 0, 0, 'day')}${figure({ k: 'mic', x: 1180, y: 1200, s: 2.2, p: 'stand', f: 1, e: 'soft', nosh: 1 }, 0, 0, 'day')}<rect width="1920" height="1310" fill="#c9a06a" opacity=".2"/></svg>`;
    s += T(960, 880, 44, c.cap || 'Daniel & Michael', '#3a2a1a', 700, 'middle', 'font-family="DejaVu Serif" font-style="italic"'); return s + '</g>'; }
  if (c.t === 'tally') { let s = concrete(0, 0, 1920, 1080, BCON[0], 41); const n = c.n || 12; const show = c.to ? Math.round(n + (c.to - n) * clamp(p * 1.3, 0, 1)) : n;
    for (let k = 0; k < show; k++) { const g = Math.floor(k / 5), r = k % 5, gx = 200 + (g % 9) * 170, gy = 220 + Math.floor(g / 9) * 230; s += r < 4 ? `<path d="M${gx + r * 26} ${gy} l4 130" stroke="#e9e2cc" stroke-width="9" stroke-linecap="round"/>` : `<path d="M${gx - 14} ${gy + 90} L${gx + 110} ${gy + 30}" stroke="#e9e2cc" stroke-width="9" stroke-linecap="round"/>`; }
    s += T(1500, 980, 110, `DAY ${show}`, '#e9e2cc', 900, 'middle', 'font-family="DejaVu Sans" opacity=".95"');
    return s; }
  return _card8(c, p, t, dur);
};
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env; const has = k => f.includes(k); let s = '';
  const base = _fx8(shot, lt, p, t, front);
  if (!front) {
    if ((E === 'bunker' || E === 'bunker2') && !has('monoff')) { const k = E === 'bunker2' ? -1 : 1; for (const [x, y, w, h] of [[520, 470, 170, 130], [730, 440, 210, 160], [980, 490, 120, 100]]) { const xx = k > 0 ? x : 1920 - x - w; s += `<rect x="${xx}" y="${y}" width="${w}" height="${h}" fill="${has('monred') ? '#3a0a0a' : '#16302a'}"/><path d="M${xx + 10} ${y + h * .7} l${w * .3} -${h * .3} l${w * .3} ${h * .1}" stroke="#4a7a6a" stroke-width="3" fill="none"/>` + `<rect x="${xx}" y="${y + ((t * 40) % h)}" width="${w}" height="4" fill="#fff" opacity=".08"/>`; } }
    if (E === 'bunker' && shot.tally) { const n = shot.tally; for (let k = 0; k < Math.min(n, 90); k++) { const g = Math.floor(k / 5), r = k % 5, gx = 1345 + (g % 6) * 46, gy = 316 + Math.floor(g / 6) * 72; s += r < 4 ? `<path d="M${gx + r * 7} ${gy} v40" stroke="#e9e2cc" stroke-width="3"/>` : `<path d="M${gx - 4} ${gy + 30} L${gx + 28} ${gy + 8}" stroke="#e9e2cc" stroke-width="3"/>`; } }
    if (E === 'bunker' && has('panelopen')) s += `<rect x="1680" y="240" width="240" height="580" fill="#141516"/><rect x="1700" y="300" width="200" height="460" fill="#26282b" stroke="${INK}" stroke-width="5"/>` + shelfUnit(1500, 240, 180, 580, 3);
    if (E === 'bunker' && has('radioon')) s += `<rect x="1166" y="626" width="60" height="26" fill="${has('radioname') ? '#9ab07a' : '#6a7a4a'}"/>` + (has('radioname') ? `<text x="1196" y="645" font-size="12" font-weight="900" fill="#1d2a14" text-anchor="middle" font-family="DejaVu Sans Mono">MICHAEL</text>` : '');
    if (E === 'bdoor') { const un = has('unlock') ? clamp(lt / 3, 0, 1) : (has('unlocked') ? 1 : 0); s += wheel(820, 500, 150, un * 540);
      for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; const r0 = 300 - 60 * un; s += `<path d="M${820 + Math.cos(a) * r0} ${500 + Math.sin(a) * r0} L${820 + Math.cos(a) * (r0 + 90)} ${500 + Math.sin(a) * (r0 + 90)}" stroke="#8a8e90" stroke-width="22" stroke-linecap="round"/>`; }
      const ptxt = has('idconf') ? [['IDENTITY', '#4fe07a'], ['CONFIRMED', '#4fe07a'], ['DOOR OPENING', blink(t * 1.5) ? '#ff4a3a' : '#7a1a12']] : (has('locked') ? [['SEALED', '#4fe07a']] : []);
      ptxt.forEach(([l, c], i) => { s += TM(1550, 450 + i * 40, 30, l, c, 900, 'middle'); });
      if (has('opening')) { const q = clamp(lt / 3, 0, 1); s += `<path d="M${820 - 380} 500 a380 380 0 0 1 ${760 * q} 0" fill="none" stroke="#fff6c8" stroke-width="${10 * q}" opacity=".6"/>`; } }
    if (E === 'bsecret') { if (has('mon2')) s += `<rect x="700" y="470" width="260" height="180" fill="#1a1a14"/><rect x="700" y="${470 + ((t * 50) % 180)}" width="260" height="6" fill="#fff" opacity=".1"/>`;
      const st = has('occupied'); s += `<rect x="1756" y="440" width="118" height="70" fill="${st ? (blink(t) ? '#3a0a0a' : '#1a0606') : '#06100a'}"/>` + (st ? TM(1815, 470, 13, 'LOWER LEVEL', '#ff6a5a', 900, 'middle') + TM(1815, 492, 13, 'OCCUPIED', '#ff6a5a', 900, 'middle') : TM(1815, 480, 13, 'STATUS', '#4fe07a', 900, 'middle'));
      if (has('ajar')) { const q = has('ajaropen') ? ease(clamp(lt / 2, 0, 1)) : 1; s += `<path d="M${1680 - 120 * q} 230 L1680 230 L1680 860 L${1680 - 120 * q} 860Z" fill="#030304"/>`; } }
    if (E === 'bvent' && has('tap')) { const ph = lt % 2.4; const k = Math.floor(ph / .3); if (k < 3 && (ph % .3) < .1 || (ph > 1.5 && ph < 2.4 && Math.floor((ph - 1.5) / .3) < 3 && ((ph - 1.5) % .3) < .1)) s += `<rect x="560" y="260" width="800" height="520" fill="#fff" opacity=".06"/>` + `<path d="M1380 400 q30 30 0 60 M1410 380 q50 50 0 100" stroke="#e9e2cc" stroke-width="5" fill="none" opacity=".6"/>`; }
    if (E === 'bvent' && has('fanoff')) s += TM(960, 880, 34, 'FAN: OFF', '#ff6a5a', 900, 'middle');
    if (E === 'bout' && has('siren')) for (let k = 0; k < 3; k++) { const a = t * 4 + k * 2; s += `<circle cx="${400 + k * 600}" cy="300" r="${200 + 40 * Math.sin(a)}" fill="#ff2a1a" opacity=".1"/>`; }
    if (E === 'bcity' && has('siren')) for (let k = 0; k < 4; k++) { const a = t * 5 + k; s += `<circle cx="${200 + k * 500}" cy="${700}" r="${120 + 30 * Math.sin(a)}" fill="${k % 2 ? '#2a5aff' : '#ff2a1a'}" opacity="${.18 + .12 * Math.sin(a * 2)}"/>`; }
  }
  if (front) {
    if (has('flashlight')) { const fx0 = shot.fl ? shot.fl[0] : 960, fy0 = shot.fl ? shot.fl[1] : 600; s += `<defs><radialGradient id="flg" cx="${fx0 / 1920}" cy="${fy0 / 1080}" r=".28" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".93"/></radialGradient></defs><rect x="-300" y="-300" width="2520" height="1680" fill="#000" opacity=".2"/><rect width="1920" height="1080" fill="url(#flg)"/>`; }
    if (has('blackout')) s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#000" opacity="${clamp(p * 2.4, 0, 1) * .98}"/>`;
    if (has('dark')) s += `<rect x="-300" y="-300" width="2520" height="1680" fill="#000" opacity=".9"/>`;
  }
  return base + s;
};
Object.assign(LIGHT, {
  bwarm: t => `<rect width="1920" height="1080" fill="#ffb060" opacity=".07"/><circle cx="640" cy="260" r="520" fill="#ffd8a0" opacity=".08"/><circle cx="1380" cy="260" r="520" fill="#ffd8a0" opacity=".08"/><rect width="1920" height="1080" fill="#000" opacity=".12"/>`,
  bred: t => `<rect width="1920" height="1080" fill="#3a0000" opacity="${.42 + .1 * Math.sin(t * 3)}"/><rect width="1920" height="1080" fill="#ff1a0a" opacity="${.1 + .06 * Math.sin(t * 3)}"/>`,
  bflicker: t => { const k = Math.floor(t * 12); const off = rnd(k) > .72; return `<rect width="1920" height="1080" fill="#000" opacity="${off ? .82 : .2}"/>`; },
  bnight: t => `<rect width="1920" height="1080" fill="#02060e" opacity=".25"/>`,
  bday: t => ``
});
// ---------- day stamp (new) ----------
const _render8 = window.render;
window.render = function (t) { const i = _render8(t); const sh = window.TL[i];
  if (sh.day) { const lt = t - sh.start, q = clamp(lt / .3, 0, 1); const o = `<g transform="translate(50 44)" opacity="${q}"><rect x="0" y="0" width="${60 + String(sh.day).length * 34 + 130}" height="80" rx="6" fill="#f2c418" stroke="#111" stroke-width="5"/><text x="22" y="60" font-size="52" font-weight="900" fill="#111" font-family="DejaVu Sans">DAY ${sh.day}</text></g>`;
    document.getElementById('stage').insertAdjacentHTML('beforeend', `<svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">${o}</svg>`); }
  return i; };
// ---------- multi-cut shots + dynamic camera (retention upgrade) ----------
const _prep9 = window.prepare;
window.prepare = async function (tl) { const out = [];
  for (const s of tl) { if (!s.cuts) { out.push(s); continue; }
    const parts = [s].concat(s.cuts.map(c => Object.assign({}, s, { actors: [], fx: [], card: null, cam: [960, 540, 1, 1.08, 0, 0] }, c, { text: null, hl: c.hl || null, flash: c.flash || null })));
    const ws = parts.map(p => p.w || 1), tot = ws.reduce((a, b) => a + b, 0); let st = s.start;
    parts.forEach((p, k) => { const d = (s.end - s.start) * ws[k] / tot; const q = Object.assign({}, p, { start: st, end: st + d }); delete q.cuts; if (q.card) { q.env = 'card'; q.light = ''; } out.push(q); st += d; }); }
  window.TL = out; return _prep9(out); };
const _render9 = window.render;
window.render = function (t) { const i = _render9(t); const sh = window.TL[i]; const lt = t - sh.start; const st = document.getElementById('stage'); const sc = st.firstElementChild;
  if (sc) { const punch = sh.nopunch ? 0 : .07 * (1 - ease(clamp(lt / .28, 0, 1))); const tilt = (sh.tilt || 0) + (sh.tilt ? Math.sin(t * .7) * .4 : 0); const hd = sh.hand || 0;
    const hx = hd ? (Math.sin(t * 2.1) * 1 + Math.sin(t * 5.3) * .4) * hd : 0, hy = hd ? (Math.cos(t * 1.7) * 1 + Math.sin(t * 4.1) * .4) * hd : 0;
    const scl = 1 + punch + Math.abs(tilt) * .03 + (hd ? hd * .004 : 0);
    sc.style.transformOrigin = '50% 50%'; sc.style.transform = `translate(${hx}px,${hy}px) rotate(${tilt}deg) scale(${scl})`; }
  if (sh.flash) { const q = 1 - clamp(lt / .35, 0, 1); if (q > 0) st.insertAdjacentHTML('beforeend', `<svg style="position:absolute;left:0;top:0" width="1920" height="1080"><rect width="1920" height="1080" fill="${sh.flash === 'red' ? '#ff1a0a' : '#fff'}" opacity="${q * (sh.flash === 'red' ? .45 : .6)}"/></svg>`); }
  if (sh.slam) { const q = clamp(lt / .18, 0, 1), sc2 = 1.8 - .8 * ease(q); st.insertAdjacentHTML('beforeend', `<svg style="position:absolute;left:0;top:0" width="1920" height="1080"><g transform="translate(960 540) scale(${sc2})" opacity="${q}"><text x="0" y="0" font-size="${Math.min(150, 1700 / (sh.slam.length * .66))}" font-weight="900" fill="#fff" stroke="#000" stroke-width="14" paint-order="stroke" text-anchor="middle" dominant-baseline="middle" font-family="DejaVu Sans">${sh.slam}</text></g></svg>`); }
  return i; };
