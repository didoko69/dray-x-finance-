// ---------- shared helpers ----------
const INK = '#262326';
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
const ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const R = (x, y, w, h, f, sw = 6, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${INK}" stroke-width="${sw}" ${extra}/>`;
const P = (d, f = 'none', sw = 6, extra = '') => `<path d="${d}" fill="${f}" ${/stroke="/.test(extra) ? '' : `stroke="${INK}"`} stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const T = (x, y, s, txt, fill = '#222', w = 800, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" font-family="DejaVu Sans, Arial" ${extra}>${txt}</text>`;
const C = (x, y, r, f, sw = 6, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${INK}" stroke-width="${sw}" ${extra}/>`;

// ---------- figures ----------
// local coords: feet at y=0, hip -95, neck -150, head centre -210 (r 52)
function limb(a, b, c) { return `M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`; }

function poseOf(p, t, kind) {
  // returns {hip, neck, head, ha(head angle), arms:[[sh,el,hand],[...]], legs:[[hip,knee,foot],...], body angle handled by hip/neck}
  let hip = [0, -95], neck = [0, -150], head = [0, -210], ha = 0;
  let sh = [0, -138];
  let arms, legs;
  const sw = Math.sin(t * 2) * 3;
  const std = () => { legs = [[hip, [-12, -48], [-24, 0]], [hip, [12, -48], [24, 0]]]; };
  switch (p) {
    case 'walk': case 'crouchwalk': case 'climb': {
      const ph = t * (p === 'crouchwalk' ? 4.5 : 6.5), a = Math.sin(ph), b = Math.sin(ph + Math.PI);
      const bob = Math.abs(Math.cos(ph)) * 4;
      if (p === 'crouchwalk') { hip = [0, -70]; neck = [22, -120]; head = [40, -175]; sh = [16, -110]; }
      if (p === 'climb') { neck = [14, -148]; head = [26, -206]; sh = [10, -136]; }
      hip = [hip[0], hip[1] - bob]; neck = [neck[0], neck[1] - bob]; head = [head[0], head[1] - bob]; sh = [sh[0], sh[1] - bob];
      legs = [[hip, [a * 14 + 6, hip[1] / 2 + 2], [a * 30, 0]], [hip, [b * 14 + 6, hip[1] / 2 + 2], [b * 30, 0]]];
      arms = [[sh, [sh[0] + b * 16, sh[1] + 42], [sh[0] + b * 28, sh[1] + 82]], [sh, [sh[0] + a * 16, sh[1] + 42], [sh[0] + a * 28, sh[1] + 82]]];
      if (kind === 'inf' || p === 'climb') arms = [[sh, [sh[0] + 40, sh[1] + 4 + a * 4], [sh[0] + 80, sh[1] + 10 + a * 6]], [sh, [sh[0] + 38, sh[1] + 12], [sh[0] + 76, sh[1] + 22 + b * 6]]];
      break;
    }
    case 'run': case 'dive': {
      const ph = t * 11, a = Math.sin(ph), b = Math.sin(ph + Math.PI);
      if (p === 'dive') { hip = [-40, -40]; neck = [40, -60]; head = [100, -78]; sh = [28, -58];
        legs = [[hip, [-90, -36], [-140, -30]], [hip, [-88, -50], [-136, -64]]];
        arms = [[sh, [80, -60], [130, -54]], [sh, [76, -46], [126, -36]]]; break; }
      hip = [0, -92]; neck = [26, -144]; head = [44, -200]; sh = [20, -132];
      legs = [[hip, [a * 30 + 14, -50 + Math.max(0, a) * -10], [a * 46 - (a < 0 ? 10 : 0), Math.min(0, a * 18)]], [hip, [b * 30 + 14, -50 + Math.max(0, b) * -10], [b * 46 - (b < 0 ? 10 : 0), Math.min(0, b * 18)]]];
      arms = [[sh, [sh[0] + b * 30, sh[1] + 34], [sh[0] + b * 30 + 26, sh[1] + 10]], [sh, [sh[0] + a * 30, sh[1] + 34], [sh[0] + a * 30 + 26, sh[1] + 10]]];
      if (kind === 'inf') arms = [[sh, [sh[0] + 44, sh[1] + 6], [sh[0] + 88, sh[1] + 4 + a * 8]], [sh, [sh[0] + 42, sh[1] + 16], [sh[0] + 84, sh[1] + 20 + b * 8]]];
      break;
    }
    case 'crouch': hip = [-10, -60]; neck = [18, -112]; head = [30, -168]; sh = [14, -100];
      legs = [[hip, [26, -40], [10, 0]], [hip, [-30, -26], [-40, 0]]];
      arms = [[sh, [40, -70], [70, -40]], [sh, [36, -60], [60, -30]]]; break;
    case 'crawl': hip = [-60, -42]; neck = [40, -56]; head = [96, -84]; sh = [28, -54];
      { const a = Math.sin(t * 4);
        legs = [[hip, [-100 + a * 10, -12], [-150, -6]], [hip, [-96 - a * 10, -14], [-140, -2]]];
        arms = [[sh, [56 + a * 10, -26], [70 + a * 14, 0]], [sh, [50 - a * 10, -24], [64 - a * 14, 0]]]; }
      break;
    case 'sit': hip = [0, -62]; neck = [0, -118]; head = [0, -178]; sh = [0, -106];
      legs = [[hip, [40, -62], [44, 0]], [hip, [34, -58], [36, 0]]];
      arms = [[sh, [16, -72], [42, -62]], [sh, [-10, -72], [20, -62]]]; break;
    case 'slump': hip = [0, -40]; neck = [-14, -96]; head = [-6, -154]; ha = 14; sh = [-12, -86];
      legs = [[hip, [50, -40], [90, 0]], [hip, [60, -20], [110, 0]]];
      arms = [[sh, [10, -50], [40, -36]], [sh, [-30, -46], [-20, -8]]]; break;
    case 'sleep': hip = [0, -60]; neck = [-60, -62]; head = [-118, -70]; ha = -80; sh = [-48, -62];
      legs = [[hip, [50, -60], [100, -58]], [hip, [50, -54], [100, -50]]];
      arms = [[sh, [-10, -50], [20, -54]], [sh, [-10, -56], [20, -60]]]; break;
    case 'guard': hip = [-4, -92]; neck = [8, -146]; head = [12, -204]; sh = [6, -134];
      legs = [[hip, [-26, -48], [-40, 0]], [hip, [16, -50], [30, 0]]]; arms = [[sh, [36, -112], [62, -150]], [sh, [40, -104], [70, -134]]]; break;
    case 'hold': std(); arms = [[sh, [-26, -96], [-30, -56]], [sh, [44, -140], [92, -150]]]; break;
    case 'shake': std(); head = [Math.sin(t * 9) * 8, -210]; arms = [[sh, [-26, -96], [-30, -56]], [sh, [26, -96], [30, -56]]]; break;
    case 'lookupD': std(); head = [4, -214]; ha = -18; arms = [[sh, [-26, -96], [-30, -56]], [sh, [26, -96], [30, -56]]]; break;
    case 'pull': hip = [10, -95]; neck = [-18, -148]; head = [-30, -204]; sh = [-14, -136];
      legs = [[hip, [30, -48], [50, 0]], [hip, [-6, -50], [4, 0]]]; arms = [[sh, [36, -130], [80, -124]], [sh, [34, -120], [78, -112]]]; break;
    case 'sofa': case 'sitbed': hip = [0, -62]; neck = [0, -118]; head = [0, -178]; sh = [0, -106];
      legs = [[hip, [40, -62], [44, 0]], [hip, [34, -58], [36, 0]]]; arms = [[sh, [16, -72], [42, -62]], [sh, [-14, -70], [-24, -40]]]; break;
    case 'limp': { const ph = t * 3.2, a2 = Math.sin(ph); legs = [[hip, [a2 * 14 + 6, -48], [a2 * 26, 0]], [hip, [-10, -46], [-34 + Math.max(0, a2) * 10, 0]]];
      arms = [[sh, [-14, -96], [-18, -58]], [sh, [16, -96], [20, -58]]]; ha = 16 + a2 * 4; break; }
    case 'kneel': hip = [0, -60]; neck = [6, -116]; head = [10, -174]; sh = [4, -104];
      legs = [[hip, [30, -40], [30, 0]], [hip, [-24, -8], [-70, 0]]];
      arms = [[sh, [30, -70], [36, -36]], [sh, [-20, -66], [-16, -30]]]; break;
    case 'climbl': { const a2 = Math.sin(t * 6); hip = [0, -95]; neck = [0, -150]; head = [0, -208]; sh = [0, -138];
      legs = [[hip, [-22, -60 + a2 * 12], [-24, -16 + a2 * 16]], [hip, [22, -60 - a2 * 12], [24, -16 - a2 * 16]]];
      arms = [[sh, [-34, -180], [-30, -228 + a2 * 18]], [sh, [34, -180], [30, -228 - a2 * 18]]]; break; }
    case 'fallen': hip = [-40, -26]; neck = [50, -34]; head = [108, -50]; ha = 70; sh = [36, -32];
      legs = [[hip, [-90, -20], [-140, -14]], [hip, [-86, -30], [-136, -36]]];
      arms = [[sh, [86, -40], [130, -20]], [sh, [70, -20], [100, 0]]]; break;
    case 'lift': hip = [0, -92]; neck = [0, -148]; head = [0, -206]; sh = [0, -136]; legs = [[hip, [-22, -48], [-34, 0]], [hip, [22, -48], [34, 0]]];
      arms = [[sh, [-30, -180], [-20, -226 + Math.sin(t * 9) * 3]], [sh, [30, -180], [20, -226 - Math.sin(t * 9) * 3]]]; break;
    case 'radio': std(); arms = [[sh, [-26, -96], [-30, -56]], [sh, [36, -112], [26, -176]]]; break;
    case 'scared': std(); arms = [[sh, [-34, -168], [-30, -210]], [sh, [34, -168], [30, -210]]]; head = [-6, -212]; break;
    case 'push': hip = [-10, -95]; neck = [24, -146]; head = [42, -202]; sh = [20, -134];
      legs = [[hip, [-30, -48], [-54, 0]], [hip, [4, -50], [-6, 0]]];
      arms = [[sh, [56, -134], [96, -128]], [sh, [54, -124], [94, -116]]]; break;
    case 'reach': std(); arms = [[sh, [-26, -96], [-30, -56]], [sh, [46, -150], [96, -148 + Math.sin(t * 1.5) * 4]]]; break;
    case 'point': std(); arms = [[sh, [-24, -96], [-28, -56]], [sh, [48, -146], [96, -164]]]; break;
    case 'shh': std(); arms = [[sh, [-24, -96], [-28, -56]], [sh, [30, -150], [8, -196]]]; break;
    case 'peek': hip = [-10, -60]; neck = [10, -116]; head = [20, -172]; sh = [8, -104];
      legs = [[hip, [26, -40], [10, 0]], [hip, [-30, -26], [-40, 0]]];
      arms = [[sh, [50, -110], [90, -100]], [sh, [46, -100], [86, -94]]]; break;
    case 'aim': std(); arms = [[sh, [44, -134], [90, -140]], [sh, [30, -120], [60, -136]]]; break;
    case 'test': std(); arms = [[sh, [-24, -96], [-28, -56]], [sh, [44, -128], [84, -150]]]; break;
    case 'press': { std(); const j = Math.floor(t * 3) % 2; arms = [[sh, [-40, -170 - j * 6], [-46, -214]], [sh, [40, -168], [48, -208 - j * 6]]]; ha = (rnd(Math.floor(t * 2)) - .5) * 30; break; }
    case 'still': std(); arms = [[sh, [-12, -96], [-14, -58]], [sh, [12, -96], [14, -58]]]; ha = 18; break;
    case 'turn': case 'lookup': case 'sniff': std(); arms = [[sh, [-12, -96], [-14, -58]], [sh, [12, -96], [14, -58]]];
      ha = p === 'turn' ? -25 : (p === 'lookup' ? 0 : -18 + Math.sin(t * 6) * 6); if (p === 'lookup') head = [0, -216]; break;
    case 'lunge': { hip = [0, -80]; neck = [30, -124]; head = [52, -176]; sh = [24, -114]; const a = Math.sin(t * 9);
      legs = [[hip, [20, -40], [40, 0]], [hip, [-30, -40], [-36, 0]]];
      arms = [[sh, [60, -100 + a * 10], [90, -70]], [sh, [56, -90 - a * 10], [84, -56]]]; ha = 20; break; }
    case 'shamble': default: {
      std();
      if (kind === 'inf') { const j = rnd(Math.floor(t * 2.3) + (kind.length)) - .5;
        arms = [[sh, [36, -140], [74, -134 + j * 10]], [sh, [34, -128], [70, -118]]]; ha = j * 34; }
      else arms = [[sh, [-26, -96 + sw * .3], [-30, -56 + sw]], [sh, [26, -96], [30, -56 - sw]]];
    }
  }
  if (!legs) std();
  return { hip, neck, head, ha, sh, arms, legs };
}

function face(kind, e, t, seed) {
  if (e === 'back') return '';
  const blink = ((t + seed) % 3.7) < .12;
  if (kind === 'inf') {
    return `<circle cx="-15" cy="-6" r="11" fill="#3b3f33"/><circle cx="15" cy="-8" r="11" fill="#3b3f33"/><circle cx="-14" cy="-6" r="3" fill="#f2f0d8"/><circle cx="16" cy="-8" r="3" fill="#f2f0d8"/>
    <path d="M-14 22 l6 -6 l6 6 l6 -6 l6 6 l4 -4" stroke="${INK}" stroke-width="4" fill="#3a3436"/><path d="M-30 -30 l10 6 M24 -34 l-6 10" stroke="#6f7a62" stroke-width="3"/>`;
  }
  if (kind === 'sol') return '';
  if (kind === 'gown') { if (e === 'smile') return `<path d="M-30 16 Q0 40 30 16" stroke="${INK}" stroke-width="4" fill="#f4efe6"/><path d="M-22 22 v8 M-10 26 v8 M2 27 v8 M14 25 v8" stroke="${INK}" stroke-width="2"/>`; if (e === 'hidden') return `<path d="M-14 22 h28" stroke="${INK}" stroke-width="3"/>`; return face('inf', e, t, seed); }
  if (kind === 'doctor' && e === 'hiddenD') return '';
  if (kind === 'doctor' && e === 'blank') return `<circle cx="-13" cy="-8" r="6" fill="#e9e6dc"/><circle cx="15" cy="-8" r="6" fill="#e9e6dc"/><path d="M-10 20 h20" stroke="${INK}" stroke-width="4"/>`;
  let eyes, brows = `<path d="M-24 -24 l14 -5 M8 -29 l14 5" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`, mouth = `<path d="M-8 20 q8 -6 16 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (e === 'sleep' || blink) eyes = `<path d="M-19 -6 q6 4 12 0 M9 -6 q6 4 12 0" stroke="${INK}" stroke-width="4" fill="none"/>`;
  else if (e === 'fear') eyes = `<circle cx="-13" cy="-8" r="9" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="15" cy="-8" r="9" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="-12" cy="-7" r="3.5" fill="${INK}"/><circle cx="16" cy="-7" r="3.5" fill="${INK}"/>`;
  else eyes = `<circle cx="-13" cy="-8" r="5" fill="${INK}"/><circle cx="15" cy="-8" r="5" fill="${INK}"/>`;
  if (e === 'fear') { mouth = `<ellipse cx="2" cy="22" rx="7" ry="9" fill="${INK}"/>`; brows = `<path d="M-26 -26 l14 -8 M10 -34 l14 8" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M40 -20 q6 10 0 14 q-6 -4 0 -14" fill="#9fd3ff" stroke="${INK}" stroke-width="2"/>`; }
  if (kind === 'hero' && __SCAR) brows += `<path d="M-30 -40 l12 8" stroke="#c98a6a" stroke-width="4"/>`;
  if (kind === 'hero' && e !== 'fear' && !(e === 'sleep' || blink)) eyes = `<ellipse cx="-14" cy="-8" rx="8" ry="7" fill="#f4efe6"/><ellipse cx="14" cy="-8" rx="8" ry="7" fill="#f4efe6"/><circle cx="-12" cy="-7" r="4.5" fill="${INK}"/><circle cx="16" cy="-7" r="4.5" fill="${INK}"/>`;
  if (e === 'det') { brows = `<path d="M-26 -30 l16 6 M10 -24 l16 -6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; mouth = `<path d="M-10 20 h20" stroke="${INK}" stroke-width="4"/>`; }
  if (e === 'sad') { brows = `<path d="M-24 -22 l14 -8 M8 -30 l14 8" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`; mouth = `<path d="M-8 24 q8 -8 16 0" stroke="${INK}" stroke-width="4" fill="none"/>`; if (!blink) eyes = `<circle cx="-13" cy="-4" r="5" fill="${INK}"/><circle cx="15" cy="-4" r="5" fill="${INK}"/>`; }
  if (e === 'soft') { mouth = `<path d="M-10 16 q10 10 20 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`; brows = `<path d="M-24 -22 l14 -2 M8 -24 l14 2" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`; }
  return eyes + brows + mouth;
}

const PAX = [['#7a3b8f', '#3a2a20'], ['#2f7a5a', '#d8b26a'], ['#b0573a', '#1f1f1f'], ['#41608f', '#6b4a2a'], ['#8f8a3b', '#c46a3a'], ['#555a66', '#2a2a2a']];
function torso(kind, v, ps) {
  const n = ps.neck, h = ps.hip, dx = n[0] - h[0];
  const shirt = (fill, extra = '') => P(`M${n[0] - 26} ${n[1] + 8} L${n[0] + 26} ${n[1] + 8} L${h[0] + 24} ${h[1] + 10} L${h[0] - 24} ${h[1] + 10}Z`, fill, 5) + extra;
  if (kind === 'amara') return P(`M${n[0] - 30} ${n[1] + 4} L${n[0] + 30} ${n[1] + 4} L${h[0] + 28} ${h[1] + 14} L${h[0] - 28} ${h[1] + 14}Z`, '#c9a03a', 5) + `<path d="M${h[0] - 26} ${h[1] + 6} h52" stroke="#a8842a" stroke-width="6"/>`;
  if (kind === 'doctor') return P(`M${n[0] - 22} ${n[1] + 4} L${n[0] + 22} ${n[1] + 4} L${h[0] + 20} ${h[1] + 8} L${h[0] - 20} ${h[1] + 8}Z`, '#3f6f9a', 4) + P(`M${n[0] - 34} ${n[1] + 2} L${n[0] - 8} ${n[1] + 4} L${h[0] - 6} ${h[1] + 50} L${h[0] - 38} ${h[1] + 50}Z`, '#ecebe6', 5) + P(`M${n[0] + 34} ${n[1] + 2} L${n[0] + 8} ${n[1] + 4} L${h[0] + 6} ${h[1] + 50} L${h[0] + 38} ${h[1] + 50}Z`, '#ecebe6', 5) + `<rect x="${n[0] + 12}" y="${n[1] + 26}" width="16" height="22" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="${n[0] + 14}" y="${n[1] + 28}" width="12" height="6" fill="#3f6f9a"/>`;
  if (kind === 'gown') return P(`M${n[0] - 26} ${n[1] + 4} L${n[0] + 26} ${n[1] + 4} L${h[0] + 34} ${h[1] + 48} L${h[0] - 34} ${h[1] + 48}Z`, '#a9c7c0', 5) + `<path d="M${n[0] - 20} ${n[1] + 30} l8 6 l8 -6 l8 6 l8 -6" stroke="#7fa49c" stroke-width="3" fill="none"/>`;
  if (kind === 'hero') return P(`M${n[0] - 30} ${n[1] + 4} L${n[0] + 30} ${n[1] + 4} L${h[0] + 28} ${h[1] + 14} L${h[0] - 28} ${h[1] + 14}Z`, '#2f5a3e', 5) + `<path d="M${h[0] - 16} ${h[1] - 14} h32 v12 h-32z" fill="#284d35" stroke="${INK}" stroke-width="3"/><path d="M${n[0] - 6} ${n[1] + 6} v26 M${n[0] + 6} ${n[1] + 6} v22" stroke="#d9d4c7" stroke-width="3"/>`;
  if (kind === 'grace') return shirt('#f2c418', `<path d="M${n[0] - 22} ${(n[1] + h[1]) / 2} L${n[0] + 22} ${(n[1] + h[1]) / 2 + 2}" stroke="#d9dde6" stroke-width="9"/><path d="M${n[0] - 22} ${h[1] - 4} L${n[0] + 22} ${h[1] - 2}" stroke="#d9dde6" stroke-width="9"/>`);
  if (kind === 'mic') return shirt('#2c2f36', `<path d="M${n[0] - 20} ${(n[1] + h[1]) / 2 + 10} h40 v18 h-40z" fill="#24272d" stroke="${INK}" stroke-width="3"/><path d="M${n[0] - 6} ${n[1] + 6} l-4 26 M${n[0] + 6} ${n[1] + 6} l4 26" stroke="#9aa0aa" stroke-width="3"/>`);
  if (kind === 'mar') return shirt('#22385e', `<path d="M${n[0]} ${n[1] + 4} L${h[0]} ${h[1]}" stroke="#9fb4d8" stroke-width="4"/><path d="M${n[0] - 30} ${n[1] + 2} q30 -22 60 0" stroke="#1a2a48" stroke-width="12" fill="none"/>`);
  if (kind === 'lily') return shirt('#e2507a', `<path d="M${h[0] - 34} ${h[1] + 10} L${h[0] + 34} ${h[1] + 10} L${h[0] + 22} ${h[1] - 30} L${h[0] - 22} ${h[1] - 30}Z" fill="#e2507a" stroke="${INK}" stroke-width="4"/>`);
  if (kind === 'op') return shirt('#2a2d33', `<path d="M${n[0] - 26} ${n[1] + 4} L${n[0] + 26} ${n[1] + 4} L${h[0] + 26} ${h[1] - 6} L${h[0] - 26} ${h[1] - 6}Z" fill="#ef7a22" stroke="${INK}" stroke-width="5"/><path d="M${n[0] - 20} ${(n[1] + h[1]) / 2} h40" stroke="#e9eef2" stroke-width="7"/>`);
  if (kind === 'dan') return shirt('#3d3a2c', `<path d="M${n[0] - 18} ${n[1] + 22} h16 v14 h-16z" fill="#2e2c22" stroke="${INK}" stroke-width="3"/><path d="M${h[0] - 24} ${h[1] + 2} h48" stroke="#5a4a2a" stroke-width="7"/>`);
  if (kind === 'drv') return shirt('#24242a', `<path d="M${n[0] - 22} ${n[1] + 6} L${h[0] + 20} ${h[1] + 6}" stroke="#3a3a42" stroke-width="7"/>`);
  if (kind === 'pax') return shirt(PAX[v % 6][0]);
  if (kind === 'sol') return shirt('#5b6440', `<path d="M${n[0] - 20} ${n[1] + 20}h40" stroke="#3f462c" stroke-width="6"/>`);
  if (kind === 'inf') {
    if (v % 4 === 0 || v % 4 === 3) return shirt('#7a8a6a', `<path d="M${n[0] - 22} ${(n[1] + h[1]) / 2} L${n[0] + 22} ${(n[1] + h[1]) / 2 + 2}" stroke="#bfc3b0" stroke-width="8"/><path d="M${h[0] - 10} ${h[1] + 10} l6 -14 l6 14" fill="#6e7560" stroke="none"/><path d="M${n[0] + 2} ${n[1] + 24} l10 8" stroke="#5a5a52" stroke-width="5"/>`);
    if (v % 4 === 1) return shirt('#3a3f4a', `<path d="M${n[0]} ${n[1] + 8} l-6 30 l6 10 l6 -10Z" fill="#8a2a2a" stroke="${INK}" stroke-width="3"/>`);
    return shirt('#d9d4c7', `<path d="M${n[0] - 6} ${n[1] + 30} q10 10 0 22" stroke="#6a6a60" stroke-width="7" fill="none"/>`);
  }
  return '';
}

function hat(kind, v, e) {
  if (kind === 'amara') return `<path d="M-52 -14 Q-54 -60 0 -64 Q54 -60 52 -14 Q40 -44 0 -46 Q-40 -44 -52 -14Z" fill="#1a1718" stroke="${INK}" stroke-width="4"/>${[-30, -15, 0, 15, 30].map(x => `<path d="M${x} -60 Q${x - 6} -40 ${x - 2} -30" stroke="#2c282a" stroke-width="5" fill="none"/>`).join('')}<circle cx="-46" cy="-56" r="20" fill="#1a1718" stroke="${INK}" stroke-width="4"/><path d="M-56 -46 q-12 30 -4 60" stroke="#1a1718" stroke-width="10" fill="none"/>`;
  if (kind === 'doctor') return `<path d="M-50 -20 Q-52 -58 0 -60 Q52 -58 50 -20 Q40 -40 0 -42 Q-40 -40 -50 -20Z" fill="#8f8f8f" stroke="${INK}" stroke-width="4"/>${[-30, -12, 6, 24].map(x => `<circle cx="${x}" cy="-50" r="3" fill="#bdbdbd"/>`).join('')}<path d="M10 -36 l16 -6" stroke="#b03028" stroke-width="4"/>`;
  if (kind === 'gown') return (e === 'hidden' || e === 'smile') ? `<path d="M-54 6 Q-56 -60 0 -62 Q56 -60 54 6 Q0 -4 -54 6Z" fill="#050607" opacity=".92"/><path d="M-50 -20 Q-40 -64 0 -64 Q40 -64 50 -20" fill="#2a2c2a"/>` : `<path d="M-48 -30 l14 -16 l10 10 l12 -18 l12 16 l14 -8" fill="none" stroke="#5a5f56" stroke-width="5"/>`;
  if (kind === 'hero') return `<path d="M-52 -18 Q-54 -58 -30 -66 Q0 -76 30 -66 Q54 -58 52 -18 Q48 -38 30 -44 Q0 -50 -30 -44 Q-48 -38 -52 -18Z" fill="#1c1a1c" stroke="${INK}" stroke-width="4"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${-38 + i * 9.5}" cy="${-56 + Math.abs(i - 4) * 2}" r="3" fill="#2c292c"/>`).join('')}<path d="M-50 -6 q-10 4 -4 18 M50 -6 q10 4 4 18" stroke="${INK}" stroke-width="4" fill="#9a6646"/>`;
  if (kind === 'you') return `<path d="M-54 -30 Q-52 -86 0 -88 Q52 -86 54 -30 Z" fill="#2e4a7a" stroke="${INK}" stroke-width="6"/>
    <path d="M-56 -32 Q0 -46 56 -32 L56 -20 Q0 -34 -56 -20Z" fill="#3c5f99" stroke="${INK}" stroke-width="5"/><circle cx="6" cy="-94" r="13" fill="#d9dde6" stroke="${INK}" stroke-width="5"/>`;
  if (kind === 'grace') return `<path d="M-52 -14 Q-56 -60 0 -58 Q56 -60 52 -14 Q40 -40 0 -42 Q-40 -40 -52 -14Z" fill="#b9b9bd" stroke="${INK}" stroke-width="5"/><circle cx="-34" cy="-58" r="18" fill="#b9b9bd" stroke="${INK}" stroke-width="5"/>
    ${e === 'back' ? '' : `<circle cx="-13" cy="-8" r="13" fill="none" stroke="#5a3a20" stroke-width="4"/><circle cx="15" cy="-8" r="13" fill="none" stroke="#5a3a20" stroke-width="4"/><path d="M0 -8h2" stroke="#5a3a20" stroke-width="4"/>`}`;
  if (kind === 'sol') return `<path d="M-56 -10 Q-56 -76 0 -78 Q56 -76 56 -10Z" fill="#5b6440" stroke="${INK}" stroke-width="6"/><path d="M-60 -12h120" stroke="${INK}" stroke-width="8"/>
    <rect x="-34" y="-4" width="68" height="26" rx="10" fill="#2c2f33" stroke="${INK}" stroke-width="4"/><circle cx="-14" cy="9" r="7" fill="#9ab"/><circle cx="14" cy="9" r="7" fill="#9ab"/><circle cx="0" cy="38" r="14" fill="#3a3d42" stroke="${INK}" stroke-width="4"/>`;
  if (kind === 'pax') { const hc = PAX[v % 6][1]; return v % 3 === 0 ? `<path d="M-52 -18 Q-50 -60 0 -60 Q50 -60 52 -18 Q30 -36 0 -40 Q-30 -36 -52 -18Z" fill="${hc}" stroke="${INK}" stroke-width="5"/>` :
      v % 3 === 1 ? `<path d="M-54 -20 Q-54 -64 0 -64 Q54 -64 54 -20 L54 30 Q46 0 40 -30 Q0 -44 -40 -30 Q-46 0 -54 30Z" fill="${hc}" stroke="${INK}" stroke-width="5"/>` :
      `<path d="M-50 -30 Q0 -70 50 -30 L50 -24 L-50 -24Z" fill="${hc}" stroke="${INK}" stroke-width="5"/><path d="M40 -26 h28" stroke="${INK}" stroke-width="8"/>`; }
  if (kind === 'mic') return `<path d="M-62 26 Q-68 -80 0 -82 Q68 -80 62 26 Q56 -52 0 -56 Q-56 -52 -62 26Z" fill="#2c2f36" stroke="${INK}" stroke-width="5"/><path d="M-36 -30 L-12 14" stroke="#a83a2f" stroke-width="5" stroke-linecap="round"/><path d="M-34 -16 l10 -4 M-28 -4 l10 -4" stroke="#a83a2f" stroke-width="3"/><circle cx="30" cy="26" r="6" fill="#5a4030"/>`;
  if (kind === 'mar') return `<path d="M-52 -18 Q-50 -62 0 -62 Q50 -62 52 -18 Q30 -38 0 -42 Q-30 -38 -52 -18Z" fill="#1c1c1c" stroke="${INK}" stroke-width="5"/>` + (v === 1 ? `<path d="M-62 20 Q-66 -76 0 -78 Q66 -76 62 20 Q54 -50 0 -54 Q-54 -50 -62 20Z" fill="#22385e" stroke="${INK}" stroke-width="5"/>` : '');
  if (kind === 'lily') return `<path d="M-52 -10 Q-54 -62 0 -62 Q54 -62 52 -10 Q40 -40 0 -44 Q-40 -40 -52 -10Z" fill="#2a1a12" stroke="${INK}" stroke-width="5"/><path d="M-50 -30 q-36 10 -30 60 M50 -30 q36 10 30 60" stroke="#2a1a12" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="-56" cy="-34" r="8" fill="#e2507a"/><circle cx="56" cy="-34" r="8" fill="#e2507a"/>`;
  if (kind === 'op') return `<path d="M-54 -16 Q-52 -66 0 -66 Q52 -66 54 -16Z" fill="#ef7a22" stroke="${INK}" stroke-width="5"/><path d="M-6 -22 h74" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`;
  if (kind === 'dan') return v === 1 ? `<path d="M-52 -18 Q-50 -62 0 -62 Q50 -62 52 -18 Q30 -38 0 -42 Q-30 -38 -52 -18Z" fill="#1c1c1c" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="-34" rx="84" ry="16" fill="#b89a68" stroke="${INK}" stroke-width="5"/><path d="M-44 -38 Q-44 -92 0 -94 Q44 -92 44 -38Z" fill="#c9ab78" stroke="${INK}" stroke-width="5"/><path d="M-44 -50 Q0 -42 44 -50" stroke="#6a4e2a" stroke-width="9" fill="none"/>` : `<path d="M-52 -18 Q-50 -62 0 -62 Q50 -62 52 -18 Q30 -38 0 -42 Q-30 -38 -52 -18Z" fill="#1c1c1c" stroke="${INK}" stroke-width="5"/>`;
  if (kind === 'drv') return v === 1 ? `<path d="M-58 10 Q-62 -72 0 -74 Q62 -72 58 10 Q40 -40 0 -44 Q-40 -40 -58 10Z" fill="#1d1d22" stroke="${INK}" stroke-width="5"/><path d="M-50 4 Q0 22 50 4 L50 40 Q0 70 -50 40Z" fill="#1d1d22" stroke="${INK}" stroke-width="5"/>` : `<path d="M-52 -18 Q-50 -64 0 -64 Q50 -64 52 -18Z" fill="#2a2a30" stroke="${INK}" stroke-width="5"/><path d="M-6 -24 h74" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`;
  if (kind === 'inf') return `<path d="M-40 -36 l12 -14 l8 10 l10 -16 l10 14 l12 -8 l6 12" fill="none" stroke="#4a4f40" stroke-width="5"/>`;
  return '';
}

let __SCAR = 0;
function figure(a, t, lt, light) {
  if (a.k === 'stranger' || a.k === 'michael') {
    const st = a.k === 'stranger'; __SCAR = st ? 1 : 0;
    let g0 = figure(Object.assign({}, a, { k: 'hero', v: 0, pipe: 0, fl: 0, mb: 0 }), t, lt, light); __SCAR = 0;
    g0 = g0.replace(/#2f5a3e/g, st ? '#7a5a3a' : '#a83a2a').replace(/#284d35/g, st ? '#6a4a2e' : '#8a2e22').replace(/#1d1d21/g, st ? '#5a4a32' : '#3a3a40').replace(/#9a6646/g, st ? '#4a2e1e' : '#8a5a3c').replace(/#3a3a40/g, st ? '#5a3a22' : '#2a2a30');
    return g0;
  }
  // a: actor; t: global time; lt: local shot time
  const kind = a.k;
  if (kind === 'ghand') return `<g transform="translate(${a.x},${a.y})" filter="url(#wobA)"><path d="M200 -20 L60 -14" stroke="#b9beb6" stroke-width="22" stroke-linecap="round"/><path d="M200 -20 L60 -14" stroke="${INK}" stroke-width="28" stroke-linecap="round" opacity=".25"/><path d="M60 -14 l-30 -14 M60 -14 l-34 0 M60 -14 l-30 12" stroke="#b9beb6" stroke-width="9" stroke-linecap="round"/></g>`;
  if (kind === 'ghand2') return `<g transform="translate(${a.x},${a.y})" filter="url(#wobA)"><path d="M-200 -10 Q-80 -20 30 -30" stroke="#b9beb6" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M30 -30 l30 -16 M30 -30 l36 -2 M30 -30 l30 12" stroke="#b9beb6" stroke-width="9" stroke-linecap="round"/></g>`;
  if (kind === 'tall') {
    const x = a.x + (a.mv || 0) * lt, s = a.s; let op = 1;
    if (a.p === 'vanish') op = lt < 1.1 ? 1 : 0;
    const sway = Math.sin(t * .9) * 3, ht = a.p === 'turn' ? Math.min(1, lt / 2.5) : 0;
    const body = `<path d="M0 -600 C-14 -590 -16 -560 -12 -540 C-30 -530 -36 -500 -34 -440 L-30 -300 L-26 -160 L-30 0 L-16 0 L-8 -250 L8 -250 L16 0 L30 0 L26 -160 L30 -300 L34 -440 C36 -500 30 -530 12 -540 C16 -560 14 -590 0 -600Z" fill="#050607"/>
      <path d="M-30 -500 C-56 -420 -64 -320 -70 -200 M30 -500 C${56 - ht * 20} -420 ${64 - ht * 10} -320 ${70 + sway} -200" stroke="#050607" stroke-width="10" fill="none" stroke-linecap="round"/>
      <ellipse cx="${ht * 6}" cy="-620" rx="${26 - ht * 6}" ry="40" fill="#050607"/>`;
    return `<g transform="translate(${x},${a.y}) scale(${s})" opacity="${op}"><defs><filter id="blurT"><feGaussianBlur stdDeviation="3"/></filter></defs><g filter="url(#blurT)" opacity=".96">${body}</g></g>`;
  }
  if (kind === 'hand') return `<g transform="translate(${a.x},${a.y})" filter="url(#wobA)">${P('M260 -150 L160 -140 L64 -132', 'none', 10)}<path d="M60 -134 l0 0" stroke="#f2c418" stroke-width="0"/><path d="M262 -140 L200 -136" stroke="#f2c418" stroke-width="24" stroke-linecap="round"/>${C(52, -134, 16, '#fbfaf6', 5)}</g>`;
  const p = a.p;
  const ps = poseOf(p, lt + (a.x % 7) * .37, kind);
  const x = a.x + (a.mv || 0) * lt;
  const isBack = a.e === 'back';
  let col = kind === 'inf' ? '#2c2f28' : INK;
  const headFill = kind === 'inf' ? '#b9beb6' : (kind === 'hero' || kind === 'amara' ? '#9a6646' : (kind === 'doctor' ? (a.e === 'pale' ? '#7a6a5e' : '#5a3a26') : (kind === 'gown' ? '#c9ccc4' : '#fbfaf6')));
  let g = '';
  // backpack for you
  if (kind === 'hero' && !['sleep', 'sit', 'slump', 'crawl', 'fallen'].includes(p)) g += `<rect x="${ps.neck[0] - 48}" y="${ps.neck[1] + 6}" width="30" height="50" rx="9" fill="#1d1d21" stroke="${INK}" stroke-width="5" transform="rotate(${(ps.neck[0] - ps.hip[0]) * .6} ${ps.neck[0]} ${ps.neck[1]})"/>`;
  if (kind === 'you' && !['sleep', 'sit', 'slump'].includes(p)) g += `<rect x="${ps.neck[0] - 46}" y="${ps.neck[1] + 4}" width="34" height="56" rx="10" fill="#3f5a3a" stroke="${INK}" stroke-width="5" transform="rotate(${(ps.neck[0] - ps.hip[0]) * .6} ${ps.neck[0]} ${ps.neck[1]})"/>`;
  if (kind === 'mar' && !['sleep', 'sit', 'slump', 'crawl', 'fallen'].includes(p) && a.e !== 'back') g += `<g transform="rotate(${(ps.neck[0] - ps.hip[0]) * .6} ${ps.neck[0]} ${ps.neck[1]})"><rect x="${ps.neck[0] - 50}" y="${ps.neck[1] + 4}" width="34" height="54" rx="9" fill="#18181a" stroke="${INK}" stroke-width="5"/></g>`;
  if (kind === 'dan' && !a.nopack && !['sleep', 'sit', 'slump', 'crawl', 'fallen'].includes(p) && a.e !== 'back') g += `<g transform="rotate(${(ps.neck[0] - ps.hip[0]) * .6} ${ps.neck[0]} ${ps.neck[1]})"><rect x="${ps.neck[0] - 50}" y="${ps.neck[1] + 4}" width="34" height="56" rx="9" fill="#5a4a32" stroke="${INK}" stroke-width="5"/><rect x="${ps.neck[0] - 62}" y="${ps.neck[1] + 20}" width="16" height="34" rx="6" fill="#4a90c8" stroke="${INK}" stroke-width="4"/><rect x="${ps.neck[0] - 60}" y="${ps.neck[1] + 14}" width="12" height="8" fill="#2a2a2a"/></g>`;
  if (kind === 'sol' && p === 'aim') g += '';
  const lw = kind === 'inf' ? 8 : (kind === 'dan' || kind === 'drv' || kind === 'mar' || kind === 'op' || kind === 'mic') ? 10 : kind === 'lily' ? 9 : (['hero', 'amara', 'doctor'].includes(kind) ? 12 : (kind === 'gown' ? 7 : 9));
  let lines = '';
  for (const l of ps.legs) lines += limb(l[0], l[1], l[2]) + ' ';
  lines += `M${ps.hip[0]} ${ps.hip[1]} L${ps.neck[0]} ${ps.neck[1]} `;
  const LEGC = { doctor: '#3f6f9a', gown: '#b9beb6' };
  g += `<path d="${lines}" stroke="${LEGC[kind] || col}" stroke-width="${lw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += torso(kind, a.v, ps);
  let arms = '';
  for (const l of ps.arms) arms += limb(l[0], l[1], l[2]) + ' ';
  const SLV = { hero: '#2f5a3e', amara: '#c9a03a', doctor: '#ecebe6', gown: '#c9ccc4' };
  g += `<path d="${arms}" stroke="${SLV[kind] || col}" stroke-width="${lw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (['amara', 'doctor', 'gown'].includes(kind)) { const sk = kind === 'doctor' ? '#5a3a26' : (kind === 'gown' ? '#c9ccc4' : '#9a6646'); for (const l of ps.arms) g += `<circle cx="${l[2][0]}" cy="${l[2][1]}" r="7" fill="${sk}" stroke="${INK}" stroke-width="3"/>`;
    if (kind === 'amara') { const l = ps.arms[1]; g += `<rect x="${(l[1][0] + l[2][0]) / 2 - 10}" y="${(l[1][1] + l[2][1]) / 2 - 8}" width="20" height="16" rx="4" fill="#f4efe6" stroke="${INK}" stroke-width="3"/>`; }
    if (kind === 'doctor' && p === 'hold') { const hnd = ps.arms[1][2]; g += `<path d="M${hnd[0]} ${hnd[1]} l60 -20" stroke="#9aa1a4" stroke-width="8" stroke-linecap="round"/>`; } }
  if (kind === 'hero') { for (const l of ps.arms) g += `<circle cx="${l[2][0]}" cy="${l[2][1]}" r="7" fill="#9a6646" stroke="${INK}" stroke-width="3"/>`;
    for (const l of ps.legs) g += `<ellipse cx="${l[2][0] + 6}" cy="${l[2][1] - 2}" rx="14" ry="7" fill="#3a3a40" stroke="${INK}" stroke-width="3"/>`;
    if (a.fl) { const hnd = ps.arms[1][2]; g += `<rect x="${hnd[0] - 4}" y="${hnd[1] - 8}" width="30" height="14" rx="4" fill="#4a4d55" stroke="${INK}" stroke-width="3"/><rect x="${hnd[0] + 24}" y="${hnd[1] - 11}" width="8" height="20" rx="2" fill="#f4e7b0" stroke="${INK}" stroke-width="2"/>`; }
    if (p === 'radio') { const hnd = ps.arms[1][2]; g += `<rect x="${hnd[0] - 14}" y="${hnd[1] - 30}" width="28" height="44" rx="5" fill="#3a3f46" stroke="${INK}" stroke-width="3"/><path d="M${hnd[0] - 6} ${hnd[1] - 30} l-6 -24" stroke="${INK}" stroke-width="3"/><rect x="${hnd[0] - 8}" y="${hnd[1] - 22}" width="16" height="10" fill="#4fe07a"/>`; } }
  if (kind === 'sol' && (p === 'aim')) { const hnd = ps.arms[0][2]; g += `<path d="M${hnd[0] - 50} ${hnd[1] + 6} L${hnd[0] + 70} ${hnd[1] - 4}" stroke="#1d1f22" stroke-width="12" stroke-linecap="round"/><path d="M${hnd[0] - 20} ${hnd[1] + 4} l-6 22" stroke="#1d1f22" stroke-width="9"/>`; }
  if (kind === 'sol' && p === 'test') { const hnd = ps.arms[1][2]; g += `<rect x="${hnd[0] - 6}" y="${hnd[1] - 30}" width="26" height="40" rx="5" fill="#d8dde3" stroke="${INK}" stroke-width="4"/><rect x="${hnd[0]}" y="${hnd[1] - 24}" width="14" height="10" fill="#7fd36b"/>`; }
  // scarf for you
  const h = ps.head;
  let head = `<g transform="translate(${h[0]},${h[1]}) rotate(${ps.ha})"><circle r="52" fill="${headFill}" stroke="${col}" stroke-width="6"/>${(isBack || p === 'climbl') ? '' : face(kind, a.e, t, a.x % 5)}${hat(kind, a.v, a.e)}</g>`;
  if (kind === 'you') { const n = ps.neck; g += `<path d="M${n[0] - 30} ${n[1] - 8} Q${n[0]} ${n[1] + 6} ${n[0] + 30} ${n[1] - 8} L${n[0] + 28} ${n[1] + 10} Q${n[0]} ${n[1] + 22} ${n[0] - 28} ${n[1] + 10}Z" fill="#c8382f" stroke="${INK}" stroke-width="5"/><path d="M${n[0] + 14} ${n[1] + 8} l${p === 'run' ? -26 : 10} 48 l-18 2 l-4 -46" fill="#c8382f" stroke="${INK}" stroke-width="5"/>`; }
  if (kind === 'grace') { const n = ps.neck; g += `<path d="M${n[0] - 18} ${n[1] - 2} L${n[0]} ${n[1] + 40} L${n[0] + 18} ${n[1] - 2}" stroke="#c8382f" stroke-width="5" fill="none"/><rect x="${n[0] - 9}" y="${n[1] + 38}" width="18" height="24" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>`; }
  if (kind === 'grace' && p === 'slump') g += `<path d="M${ps.arms[0][1][0] - 8} ${ps.arms[0][1][1] - 6} q8 6 2 14" stroke="#9b2420" stroke-width="10" fill="none"/>`;
  if (kind === 'hero' && p !== 'sleep') { const n = ps.neck; g += `<path d="M${n[0] - 34} ${n[1] + 6} Q${n[0] - 44} ${n[1] - 30} ${n[0] - 20} ${n[1] - 40} L${n[0] + 20} ${n[1] - 40} Q${n[0] + 44} ${n[1] - 30} ${n[0] + 34} ${n[1] + 6}Z" fill="#284d35" stroke="${INK}" stroke-width="5"/>`; }
  g += head;
  if (p === 'sleep') g += `<path d="M-150 -40 Q-60 -110 120 -70 L130 -40Z" fill="#8f949c" stroke="${INK}" stroke-width="6"/>`;
  if (kind === 'hero' && a.wr) { const hnd = ps.arms[0][2]; g += `<g transform="translate(${hnd[0]},${hnd[1]}) rotate(${p === 'run' ? 40 : 100})"><rect x="-6" y="-8" width="80" height="16" rx="6" fill="#8a9094" stroke="${INK}" stroke-width="3"/><path d="M74 -18 a18 18 0 1 1 0 36 l-8 -10 l8 -8 l-8 -8z" fill="#8a9094" stroke="${INK}" stroke-width="3"/></g>`; }
  if (kind === 'hero' && a.mb) { const hnd = ps.arms[0][2]; g += `<g transform="translate(${hnd[0] - 22},${hnd[1]})"><rect x="0" y="0" width="44" height="32" rx="6" fill="#c33a2f" stroke="${INK}" stroke-width="4"/><path d="M22 6 v20 M12 16 h20" stroke="#fff" stroke-width="5"/><path d="M12 0 q10 -12 20 0" stroke="${INK}" stroke-width="4" fill="none"/></g>`; }
  if (kind === 'hero' && a.pipe) { if (p === 'guard') { const h1 = ps.arms[0][2], h2 = ps.arms[1][2]; g += `<path d="M${h1[0] - 40} ${h1[1] + 70} L${h2[0] + 30} ${h2[1] - 80}" stroke="#7d8588" stroke-width="12" stroke-linecap="round"/><path d="M${h1[0] - 40} ${h1[1] + 70} L${h2[0] + 30} ${h2[1] - 80}" stroke="${INK}" stroke-width="16" stroke-linecap="round" opacity=".35"/>`; }
    else if (!['sit', 'sleep', 'crawl', 'kneel'].includes(p)) { const hnd = ps.arms[0][2]; g += `<path d="M${hnd[0] - 6} ${hnd[1] - 20} L${hnd[0] + 10} ${hnd[1] + 100}" stroke="#7d8588" stroke-width="11" stroke-linecap="round"/>`; } }
  if (kind === 'hero' && a.v === 3) { g = g.replace(/#2f5a3e/g, '#4f5a34').replace(/#284d35/g, '#434d2c'); const n = ps.neck; g += `<circle cx="${n[0] - 10}" cy="${n[1] + 40}" r="5" fill="#8a7a5a" opacity=".6"/><circle cx="${n[0] + 12}" cy="${n[1] + 70}" r="4" fill="#8a7a5a" opacity=".6"/><path d="M${n[0] + 16} ${n[1] + 20} l8 10" stroke="${INK}" stroke-width="3"/>`; }
  if (kind === 'hero' && a.v === 2) g = g.replace(/#2f5a3e/g, '#2e3b5a').replace(/#284d35/g, '#26324d');
  if (kind === 'hero' && a.v === 1) g = g.replace(/#2f5a3e/g, '#4a4d52').replace(/#284d35/g, '#3a3d42').replace(/#1d1d21/g, '#6b4a2e').replace(/#d9d4c7/g, '#7d8085');
  const sc = a.s, fl = a.f ? -1 : 1;
  if ((kind === 'dan' || kind === 'mic' || kind === 'drv' || kind === 'mar' || kind === 'op' || kind === 'lily') && !a.noshadow && !a.nosh && !['climbl'].includes(p)) g = `<ellipse cx="${(window.SHX || 30)}" cy="2" rx="${70 + Math.abs(window.SHX || 30) * .6}" ry="12" fill="#2a1a10" opacity=".28"/>` + g;
  return `<g transform="translate(${x},${a.y + (a.mvy || 0) * lt}) scale(${sc * fl},${sc})">${g}</g>`;
}
