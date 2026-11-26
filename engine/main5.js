// ---------- Video 5 cards + fx ----------
const _card4 = cardSVG, _fx4 = fxSVG, _icon4 = icon2;
icon2 = function (k, x, y, s = 1) {
  const g = i => `<g transform="translate(${x},${y}) scale(${s})">${i}</g>`;
  if (k === 'tarp') return g(`<path d="M-60 30 L-40 -40 L60 -30 L64 30Z" fill="#3f6a7a" stroke="${INK}" stroke-width="5"/><path d="M-40 -40 L-20 30 M20 -34 L30 30" stroke="#2f5a6a" stroke-width="4"/>`);
  if (k === 'transmitter') return g(`<rect x="-44" y="-30" width="88" height="66" rx="8" fill="#3a3f46" stroke="${INK}" stroke-width="5"/><path d="M30 -30 l14 -50" stroke="${INK}" stroke-width="5"/><circle cx="44" cy="-82" r="6" fill="#ff3b3b"/><rect x="-32" y="-18" width="40" height="22" fill="#ff5a4a"/><circle cx="24" cy="14" r="10" fill="#5a5f66" stroke="${INK}" stroke-width="3"/>`);
  if (k === 'photo') return g(`<rect x="-44" y="-50" width="88" height="100" fill="#f7f4ee" stroke="${INK}" stroke-width="4" transform="rotate(-6)"/><rect x="-34" y="-40" width="68" height="64" fill="#8fa0a8" transform="rotate(-6)"/>`);
  return _icon4(k, x, y, s);
};
function polaroid(x, y, w, h, rot, inner, caption) {
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 14}" y="${y + 16}" width="${w}" height="${h}" fill="#000" opacity=".3"/>${R(x, y, w, h, '#f4efe2', 7)}<svg x="${x + 30}" y="${y + 30}" width="${w - 60}" height="${h - 160}" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">${inner}</svg>${caption ? T(x + w / 2, y + h - 55, 40, caption, '#444', 600, 'middle', 'font-style="italic"') : ''}</g>`;
}
function photo1Inner(t) {
  let s = `<rect width="1000" height="700" fill="#9fc3d8"/><rect y="460" width="1000" height="240" fill="#8a9a6a"/>` + skyline(0, 1000, 460, 60, 200, 17, 0, .6);
  s += `<g transform="translate(380,700) scale(1.15)">${figure({ k: 'hero', x: 0, y: 0, s: 1, p: 'stand', f: 0, v: 3, e: 'soft', pipe: 0 }, 0, 0)}</g>`;
  s += `<g transform="translate(640,700) scale(1.0)">${figure({ k: 'michael', x: 0, y: 0, s: 1, p: 'point', f: 1, v: 0, e: 'soft' }, 0, 0)}</g>`;
  return s;
}
function photo2Inner(t, stage) {
  let s = `<rect width="1000" height="700" fill="#b8b0a0"/>` + `<g transform="translate(640,40) scale(.7)">${commsBldg(0, 0, 1, false)}</g><rect y="520" width="1000" height="180" fill="#7a7260"/>`;
  s += `<g opacity="${stage >= 1 ? 1 : .0}"><g transform="translate(500,600) scale(.8)" filter="url(#blurT2)">${figure({ k: 'pax', x: 0, y: 0, s: 1, p: 'stand', f: 0, v: 4 }, 0, 0).replace(/#8f8a3b/g, '#4a5236')}</g><path d="M460 400 h80" stroke="#4a5236" stroke-width="40"/></g>`;
  s += `<g transform="translate(300,700) scale(1.05)">${figure({ k: 'stranger', x: 0, y: 0, s: 1, p: 'stand', f: 0, v: 0, e: 'soft' }, 0, 0)}</g><g transform="translate(720,700) scale(.95)">${figure({ k: 'michael', x: 0, y: 0, s: 1, p: 'stand', f: 1, v: 0, e: 'det' }, 0, 0)}</g>`;
  return `<defs><filter id="blurT2"><feGaussianBlur stdDeviation="5"/></filter></defs>` + s;
}
cardSVG = function (c, p, t, dur) {
  const DARK = `<rect width="1920" height="1080" fill="#2a2622"/>`;
  if (c.t === 'photo1') { const z = c.zoom ? 1 + .15 * p : 1; let s = DARK + `<g transform="translate(960 540) scale(${z}) translate(-960 -540)">${polaroid(560, 120, 800, 840, -3, photo1Inner(t), c.faded ? '' : 'Me & Michael')}</g>`;
    if (c.faded) s += `<rect width="1920" height="1080" fill="#2a2622" opacity=".45"/>` + T(960, 1010, 40, 'Missing since week one', '#e9dfc6', 800, 'middle', `opacity="${clamp(p * 3, 0, 1)}"`);
    return s; }
  if (c.t === 'photo2') { const z = c.stage >= 4 ? 1 + .6 * ease(clamp(p, 0, 1)) : 1; const fx = c.stage >= 4 ? -380 * ease(clamp(p, 0, 1)) : 0, fy = c.stage >= 4 ? 300 * ease(clamp(p, 0, 1)) : 0;
    let s = DARK + `<g transform="translate(${fx},${fy}) translate(960 540) scale(${z}) translate(-960 -540)">${polaroid(460, 100, 1000, 860, 2, photo2Inner(t, c.stage), '')}</g>`;
    if (c.stage === 1) s += `<ellipse cx="960" cy="420" rx="120" ry="200" fill="none" stroke="#c33a2f" stroke-width="8" stroke-dasharray="${1000 * clamp(p * 1.5, 0, 1)} 1200"/>`;
    if (c.stage === 2) s += T(960, 1030, 44, 'A military uniform', '#ff8a7a', 900, 'middle', `opacity="${clamp(p * 3, 0, 1)}"`);
    if (c.stage === 3) s += `<rect x="1150" y="170" width="290" height="380" fill="none" stroke="#ffc04a" stroke-width="8" stroke-dasharray="${1400 * clamp(p * 1.5, 0, 1)} 1500"/>`;
    return s; }
  if (c.t === 'msg') { let s = DARK + `<g transform="rotate(-2 960 540)"><rect x="480" y="110" width="960" height="860" fill="#efe8d6" stroke="${INK}" stroke-width="6"/><path d="M480 400 h960 M480 700 h960" stroke="#d6cdb5" stroke-width="4"/>`;
    s += `<g opacity="${c.stage === 0 ? clamp(p * 3, 0, 1) : 1}"><path d="M620 760 V320 h220 V760 M620 380 h220 M620 440 h220 M620 500 h220 M620 560 h220 M620 620 h220 M620 680 h220" stroke="#2a2a2a" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M600 320 h260 l-20 -40 h-220z" fill="none" stroke="#2a2a2a" stroke-width="6"/><path d="M720 280 l20 -20 l10 14 l20 -26 l14 26" stroke="#2a2a2a" stroke-width="5" fill="none"/>${T(730, 820, 30, 'our building', '#444', 600, 'middle', 'font-style="italic"')}</g>`;
    if (c.stage >= 1) s += `<g opacity="${c.stage === 1 ? clamp(p * 3, 0, 1) : 1}">${C(1120, 360, 70, 'none', 6)}<path d="M1120 360 v-46 M1120 360 l34 18" stroke="${INK}" stroke-width="6"/></g>`;
    if (c.stage >= 2) s += T(1150, 500, 48, 'TOMORROW', '#2a2a2a', 800, 'middle', `font-style="italic" opacity="${c.stage === 2 ? clamp(p * 3, 0, 1) : 1}"`) + T(1150, 560, 48, 'MORNING', '#2a2a2a', 800, 'middle', 'font-style="italic"');
    if (c.stage >= 4) { const n = c.stage === 4 && !c.still ? Math.floor(clamp(p * 1.8, 0, 1) * 22) : 22; s += T(960, 890, 62, 'DON’T TRUST THE RADIO.'.slice(0, n), '#8a1f1a', 800, 'middle', 'font-style="italic"'); if (c.stage === 5) s += `<path d="M560 925 h800" stroke="#c33a2f" stroke-width="8" opacity="${clamp(p * 3, 0, 1)}"/>`; }
    return s + `</g>`; }
  if (c.t === 'bio5') { let s = `<rect width="1920" height="1080" fill="${CREAM}"/>` + `<g transform="translate(560,700) scale(1.9)">${figure({ k: 'stranger', x: 0, y: 0, s: 1, p: 'stand', f: 0, v: 0, e: 'sad' }, t, t)}</g>`;
    s += T(1000, 330, 90, 'DANIEL', '#222', 900, 'start', 'letter-spacing="6"'); ['About 30 · travelled alone for 3 days', 'Met Michael at a survivor camp', 'Carries: an old photograph'].forEach((l, i) => s += T(1000, 450 + i * 90, 40, l, '#555', 700, 'start', `opacity="${clamp((p - .1 - i * .18) * 5, 0, 1)}"`)); return s; }
  if (c.t === 'lure') { let s = `<rect width="1920" height="1080" fill="${CREAM}"/>` + T(960, 160, 54, 'THE SIGNAL IS BAIT', '#c33a2f', 900);
    s += `<g transform="translate(260,280) scale(.75)">${commsBldg(0, 0, 1, false)}</g>`;
    for (let k = 0; k < 4; k++) { const r = 60 + ((t * 120 + k * 90) % 360); s += `<path d="M${560 + r * .3} ${380 - r * .4} q${r * .4} ${r * .4} 0 ${r * .8}" stroke="#c33a2f" stroke-width="6" fill="none" opacity="${1 - r / 420}"/>`; }
    for (let i = 0; i < 5; i++) { const q = (t * .15 + i / 5) % 1; s += `<g transform="translate(${1700 - q * 900},${760 + (i % 2) * 40}) scale(.5)">${figure({ k: 'pax', x: 0, y: 0, s: 1, p: 'walk', f: 1, v: i, e: '' }, t, t)}</g>`; }
    s += T(1350, 930, 36, 'Survivors follow the broadcast… and never return.', '#555', 800, 'middle', `opacity="${clamp((p - .3) * 4, 0, 1)}"`); return s; }
  if (c.t === 'gathermap') { let s = `<rect width="1920" height="1080" fill="${CREAM}"/>` + T(960, 140, 50, 'WHERE THE BROADCAST POINTS…', '#222', 900);
    s += R(260, 220, 1400, 760, '#e6dfd0', 6, 'rx="8"');
    for (let i = 0; i < 6; i++) s += `<path d="M${260 + i * 280} 220 v760 M260 ${220 + i * 152} h1400" stroke="#cfc6b4" stroke-width="10"/>`;
    s += `<g transform="translate(960,600)"><path d="M0 0 C-40 -60 -40 -100 0 -100 C40 -100 40 -60 0 0Z" fill="#c33a2f" stroke="${INK}" stroke-width="5"/><circle cy="-66" r="14" fill="#fff"/></g>`;
    for (let i = 0; i < 40; i++) { const a2 = rnd(i) * 6.28, r0 = 300 + rnd(i + 3) * 300, q = clamp(p * 1.3 - rnd(i + 5) * .3, 0, 1), r = r0 * (1 - q * .8); s += `<circle cx="${960 + Math.cos(a2) * r}" cy="${560 + Math.sin(a2) * r * .6}" r="10" fill="#5a5f58"/>`; }
    return s + T(960, 1040, 36, '…the infected gather.', '#c33a2f', 900); }
  if (c.t === 'items' && c.items.includes('tarp')) { return _card4(c, p, t, dur).replace(/undefined/g, 'Old tarpaulin'); }
  if (c.t === 'items' && (c.items.includes('transmitter') || c.items.includes('photo'))) { return _card4(c, p, t, dur).replace(/undefined/, c.items[0] === 'transmitter' ? 'Radio transmitter' : '').replace(/undefined/, 'Another photograph'); }
  return _card4(c, p, t, dur);
};
const WIN = [1084, 530, 106, 84];
fxSVG = function (shot, lt, p, t, front) {
  const f = shot.fx || [], E = shot.env; const has = k => f.includes(k); let s = '';
  const base = _fx4(shot, lt, p, t, front);
  if (!front) {
    if (has('shelterbuild')) { const q = clamp(p * 1.3, 0, 1); s += `<rect x="440" y="600" width="400" height="${220 * (1 - q)}" fill="${CON}"/>`; }
    if (has('rainfall')) for (let i = 0; i < 90; i++) { const x = (rnd(i) * 1920 + t * 60) % 1920, y = (rnd(i + 3) * 1080 + t * 900) % 1080; s += `<path d="M${x} ${y} l-6 26" stroke="#cfe0ff" stroke-width="2" opacity=".6"/>`; }
    if (has('flashlightprop')) s += icon2('flashlight', 820, 800, .5);
    if (has('handlecheck') || has('doorlock')) { const a = Math.sin(t * 8) * 12; s += `<g transform="rotate(${a} 760 520)">${R(740, 510, 70, 18, '#9aa1a4', 4, 'rx="8"')}</g>`; }
    if (has('countcans')) for (let i = 0; i < 3; i++) s += `<g opacity="${clamp(p * 4 - i, 0, 1)}">${icon2('can', 1000 + i * 80, 840, .55)}</g>`;
    if (E === 'roofdoor') { const sh = has('doorshake') && (lt % .9) < .14 ? 8 : 0; const open = has('dooropen') ? ease(clamp(p * 1.4, 0, 1)) : (has('doorbroken') ? 1 : 0);
      if (open > 0) s += `<rect x="540" y="320" width="240" height="380" fill="#0b0c0d"/><path d="M780 320 L${780 - 240 * (1 - open * .7)} ${330} L${780 - 240 * (1 - open * .7)} 690 L780 700Z" fill="#6b7476" stroke="${INK}" stroke-width="6"/>`;
      else if (sh) s += `<rect x="${540 + sh}" y="320" width="240" height="380" fill="#6b7476" stroke="${INK}" stroke-width="5"/><path d="M500 380 l-30 -10 M500 520 l-36 0 M820 380 l30 -10" stroke="#fff" stroke-width="5"/>`;
      if (has('doorcrack')) s += `<path d="M600 360 l40 60 l-20 40 l50 70 M700 340 l-30 80 l40 50" stroke="${INK}" stroke-width="5" fill="none"/>`;
      const tq = has('tablepush') ? 1 - ease(clamp(p * 1.3, 0, 1)) : 0; const tm = has('tablemove') ? (lt % 1.1 < .2 ? 30 : 15) : 0; const tin = has('tablepush') || has('tablein') || has('tablemove') || has('doorcrack');
      if (tin && !has('doorbroken')) s += `<g transform="translate(${tq * 400 + tm},0)">${R(500, 600, 320, 40, '#7a5a3a', 6)}${P('M520 640 v70 M800 640 v70', 'none', 10)}</g>`;
      if (has('doorbroken')) s += `<g transform="translate(980,760) rotate(20)">${R(-160, -20, 320, 40, '#7a5a3a', 6)}</g>`;
      if (has('doorhit5') && (lt % 1.0) < .15) s += `<path d="M500 420 l-30 -10 M500 560 l-36 0" stroke="#fff" stroke-width="5"/>`; }
    if (has('photoslide') || has('photoslid')) { const q = has('photoslide') ? ease(clamp((p - .2) * 1.6, 0, 1)) : 1; s += `<g transform="translate(${880},${790 + 140 * q}) rotate(${-8 + 4 * q})">${R(0, -10, 170, 120, '#f4efe2', 4)}<rect x="12" y="2" width="146" height="80" fill="#8fa0a8"/></g>`; }
    if (has('foldedpaper')) s += `<g transform="translate(880,760) rotate(-10)">${R(0, 0, 110, 70, '#efe8d6', 4)}<path d="M55 0 v70" stroke="#c9c0aa" stroke-width="3"/></g>`;
    if (has('lamp5')) s += `<circle cx="1000" cy="860" r="${300 + Math.sin(t * 9) * 10}" fill="url(#glow)" opacity=".5"/><rect x="988" y="820" width="24" height="40" fill="#4a4d55" stroke="${INK}" stroke-width="3"/><circle cx="1000" cy="815" r="10" fill="#f4e7b0"/>`;
    if (has('pipeground')) s += `<path d="M1120 870 L1300 860" stroke="#7d8588" stroke-width="12" stroke-linecap="round"/>`;
    if (has('giftfood')) s += icon2('water', 900, 850, .45) + icon2('can', 950, 860, .4);
    if (has('routeacross')) { const pts = [[200, 700], [520, 640], [820, 700], [1150, 620], [1480, 660]]; let d = 'M' + pts.map(q => q.join(' ')).join(' L'); s += `<path d="${d}" stroke="#ffc04a" stroke-width="10" fill="none" stroke-dasharray="2000" stroke-dashoffset="${2000 * (1 - ease(clamp(p * 1.3, 0, 1)))}" stroke-linecap="round"/>`; }
    if (has('bldgdoor')) s += `<rect x="1180" y="700" width="200" height="200" fill="#0b0c0d"/>`;
    if (has('bridgeshake')) s += `<path d="M520 600 L1400 680" stroke="#c9d0d4" stroke-width="4" opacity="${(Math.sin(t * 30) + 1) / 2}"/>`;
    if (has('nbdoorslam')) { const q = ease(clamp((p - .4) * 3, 0, 1)); s += `<rect x="${1300}" y="280" width="${280 * q}" height="560" fill="#4f5658" stroke="${INK}" stroke-width="6"/>`; }
    if (has('tarptorn')) s += `<path d="M520 800 L600 620 L700 700 L880 640" stroke="#3f6a7a" stroke-width="20" fill="none"/>`;
    if (has('signalwaves')) for (let k = 0; k < 4; k++) { const r = 40 + ((t * 120 + k * 80) % 320); s += `<circle cx="788" cy="212" r="${r}" fill="none" stroke="#ff5a4a" stroke-width="6" opacity="${1 - r / 360}"/>`; }
    if (has('windowlight')) { const on = lt > .5 || (shot.text && !shot.text.startsWith('A light')); const fl = lt < .7 && shot.text.startsWith('A light') ? (Math.floor(t * 20) % 2) : 1; if (on) s += `<rect x="${WIN[0]}" y="${WIN[1]}" width="${WIN[2]}" height="${WIN[3]}" fill="#ffd98a" opacity="${fl}"/><rect x="${WIN[0] - 40}" y="${WIN[1] - 40}" width="${WIN[2] + 80}" height="${WIN[3] + 80}" fill="#ffd98a" opacity="${.15 * fl}"/>`; }
    if (has('watcher')) s += `<g opacity="${clamp(lt * .6, 0, 1)}"><ellipse cx="${WIN[0] + 52}" cy="${WIN[1] + 34}" rx="16" ry="20" fill="#0a0a0a"/><path d="M${WIN[0] + 24} ${WIN[1] + 84} q28 -46 56 0z" fill="#0a0a0a"/></g>`;
    if (has('flashes') && rnd(Math.floor(t * 6)) > .8) s += `<circle cx="${1100 + rnd(Math.floor(t * 6) + 1) * 500}" cy="${600 + rnd(Math.floor(t * 6) + 2) * 100}" r="20" fill="#ffd98a" opacity=".8"/>`;
    if (has('campfire')) for (let k = 0; k < 6; k++) { const ph = (t * .5 + k / 6) % 1; s += `<circle cx="${1100 + Math.sin(k * 2 + ph * 5) * 30}" cy="${740 - ph * 300}" r="${20 + ph * 50}" fill="#2a1a1a" opacity="${.6 * (1 - ph)}"/>`; }
    if (has('radiooff') && E === 'radiohand5') s += `<g transform="rotate(-8 960 540)"><rect x="810" y="360" width="300" height="160" rx="10" fill="#050605" opacity="${clamp((p - .3) * 5, 0, 1)}"/></g>`;
  }
  if (front) {
    if (has('arrowbldg')) { const q = ease(clamp(p * 1.5, 0, 1)); s += `<path d="M700 900 Q960 ${900 - 150 * q} 1500 ${1000}" stroke="#c33a2f" stroke-width="12" fill="none" stroke-dasharray="${900 * q} 1000"/>` + T(1500, 920, 36, 'YOUR BUILDING', '#ff8a7a', 900, 'middle', `opacity="${q}"`); }
    if (has('shakehand')) { const k = Math.sin(t * 30) * 4; s += `<g transform="translate(${k},${k * .5}) rotate(-4 960 560)">${R(700, 360, 520, 420, '#f4efe2', 6)}<rect x="730" y="390" width="460" height="300" fill="#c9c2b0"/>${T(960, 560, 30, '(photo — face down)', '#8a826e', 600, 'middle', 'font-style="italic"')}</g>`; }
  }
  return base + s;
};
Object.assign(LIGHT, {
  afternoon: t => `<rect width="1920" height="1080" fill="#ffb060" opacity=".08"/>`,
  sunset: t => `<rect width="1920" height="1080" fill="#ff8040" opacity=".12"/>`,
  rain: t => `<rect width="1920" height="1080" fill="#3a4a5a" opacity=".25"/>`,
  dusk5: t => `<rect width="1920" height="1080" fill="#1a1428" opacity=".35"/>`,
  memoryred: t => `<rect width="1920" height="1080" fill="#ff3a1a" opacity=".12"/><rect width="1920" height="1080" fill="#c9a07a" opacity=".2"/>`
});
