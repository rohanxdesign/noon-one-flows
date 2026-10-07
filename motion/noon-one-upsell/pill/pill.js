'use strict';
// noon One pill — 6s seamless loop. 970x500 = 97x50pt at 10x.
const FW = 970, FH = 500, RAD = 120, CX = FW / 2, CY = FH / 2, DUR = 6, FPS = 60;
const NAVY = '#002A5B', INK = '#0B0B0E';
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const pr = (t, a, b) => clamp((t - a) / (b - a));
const eOutCubic = x => 1 - Math.pow(1 - x, 3);
const eInCubic = x => x * x * x;
const eInOutCubic = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eOutExpo = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const eInExpo = x => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
const eInOutExpo = x => (x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2);
const eOutBack = (x, s = 1.70158) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const bell = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));
const damp = (t, t0, k = 9, w = 26) => (t < t0 ? 0 : Math.exp(-(t - t0) * k) * Math.sin((t - t0) * w));
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const mk = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; return k; };
const setF = (x, w, s, ls = 0) => { x.font = `${w} ${s}px Figtree`; x.letterSpacing = ls + 'px'; };

const IMG = {};
function logo(x, cx, cy, s, o = {}) {
  x.save(); x.globalAlpha = o.a ?? 1; x.translate(cx, cy); if (o.rot) x.rotate(o.rot); x.scale(s * (o.sx ?? 1), s * (o.sy ?? 1)); x.translate(-20.68, -12);
  [['green', C.green], ['red', C.red], ['pink', C.pink], ['yellow', C.yellow]].forEach(([k, c]) => { x.fillStyle = c; x.fill(LOGO[k]); });
  x.fillStyle = '#000'; ['o', 'n', 'e'].forEach(k => x.fill(LOGO[k])); x.restore();
}
function cream(x) {
  const g = x.createLinearGradient(0, 0, 0, FH); g.addColorStop(0, '#FFFCF3'); g.addColorStop(1, '#F7E6B8'); x.fillStyle = g; x.fillRect(0, 0, FW, FH);
  const r = x.createRadialGradient(CX, FH * .35, 0, CX, FH * .35, FW * .55); r.addColorStop(0, 'rgba(255,255,255,.95)'); r.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = r; x.fillRect(0, 0, FW, FH);
}
// van image (includes its own navy pill + sparkles); w = drawn width, anchored at centre
function van(x, cx, cy, w, o = {}) {
  const i = IMG.van, h = w * i.height / i.width;
  x.save(); x.translate(cx, cy); x.rotate(o.rot || 0); x.scale(o.sx ?? 1, o.sy ?? 1);
  x.drawImage(i, -w / 2, -h / 2, w, h); x.restore();
}
function speed(x, t, seed, n, y0, y1, dir, col, a) {
  if (a <= 0) return;
  x.strokeStyle = col; x.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const y = lerp(y0, y1, hash(seed + i)), len = 80 + hash(seed + i * 3) * 220, sp = 1800 + hash(seed + i * 7) * 1400;
    const px = ((hash(seed + i * 5) * (FW + 600) + t * sp) % (FW + 600)) - 300;
    const xx = dir > 0 ? px : FW - px;
    x.globalAlpha = a * (.35 + .65 * hash(seed + i * 11)); x.lineWidth = 5 + 6 * hash(seed + i * 13);
    x.beginPath(); x.moveTo(xx, y); x.lineTo(xx - dir * len, y); x.stroke();
  }
  x.globalAlpha = 1;
}
function parcel(x, cx, cy, s, rot = 0) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.fillStyle = '#E0A867'; x.beginPath(); x.moveTo(-62, -30); x.lineTo(-28, -62); x.lineTo(70, -62); x.lineTo(36, -30); x.closePath(); x.fill();
  x.fillStyle = '#B97A3C'; x.beginPath(); x.moveTo(36, -30); x.lineTo(70, -62); x.lineTo(70, 32); x.lineTo(36, 64); x.closePath(); x.fill();
  x.fillStyle = '#CF8F4E'; x.fillRect(-62, -30, 98, 94);
  x.fillStyle = C.yellow; x.beginPath(); x.moveTo(-22, -30); x.lineTo(12, -62); x.lineTo(30, -62); x.lineTo(-4, -30); x.closePath(); x.fill(); x.fillRect(-22, -30, 18, 40);
  x.restore();
}
function puffs(x, t, t0, px, py, col) {
  const p = pr(t, t0, t0 + .45); if (p <= 0 || p >= 1) return;
  x.fillStyle = col;
  for (let i = 0; i < 6; i++) {
    const a = Math.PI + (i / 5 - .5) * 1.4, r = eOutCubic(p) * (60 + 40 * hash(i));
    x.globalAlpha = (1 - p) * .8; x.beginPath(); x.arc(px + Math.cos(a) * r * 1.6, py + Math.sin(a) * r * .5, 16 * (1 - p * .5), 0, 7); x.fill();
  }
  x.globalAlpha = 1;
}

// ── layout for the lockup
let FREE = [], FREE_X = 0, DEL_W = 0;
function layout(x) {
  setF(x, 900, 250, -8); const w = x.measureText('FREE').width; FREE_X = CX - w / 2;
  for (let i = 0; i < 4; i++) FREE.push({ s: 'FREE'[i], x: FREE_X + x.measureText('FREE'.slice(0, i)).width, w: x.measureText('FREE'[i]).width });
}

function draw(x, t) {
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.textAlign = 'left';
  cream(x);

  // ── 1 · rest + logo exit (0 – 1.0)
  const breathe = 1 + 0.018 * Math.sin(t * Math.PI * 2 / DUR * 3) * (1 - bell(t, 1.5, 1.2) - bell(t, 3.5, 1.5));
  const ex = eInExpo(pr(t, .62, .95));
  if (t < 1.0) logo(x, CX + ex * 760, CY, 10.6 * breathe, { sx: 1 - ex * .25, sy: 1 + ex * .08 });

  // ── navy wipe from the left (0.62 – 0.98), stays until the yellow wipe
  const nw = eInOutExpo(pr(t, .62, .98));
  const yw = eInOutCubic(pr(t, 2.02, 2.42));
  if (nw > 0 && t < 2.5) {
    x.fillStyle = NAVY; x.beginPath(); x.roundRect(-200, 0, 200 + nw * (FW + 220), FH, [0, 260, 260, 0]); x.fill();
  }
  // yellow wipe chasing the van (2.02 – 2.42), holds until the cream wipe
  const cw = eInOutCubic(pr(t, 5.0, 5.42));
  if (yw > 0 && t < 5.5) {
    x.fillStyle = C.yellow; x.beginPath(); x.roundRect(-300, 0, 300 + yw * (FW + 320), FH, [0, 260, 260, 0]); x.fill();
  }
  // van enters from left, settles, takes a parcel, leaves right
  if (t > .7 && t < 2.5) {
    const vin = eOutBack(pr(t, .78, 1.3), 1.2);
    const vout = eInExpo(pr(t, 1.95, 2.4));
    const vx = lerp(-520, CX - 10, vin) + vout * 1350;
    const land = damp(t, 1.72, 10, 30) * .06;
    const bob = Math.sin(t * 28) * 4 * (1 - pr(t, 1.3, 1.5)) + Math.sin(t * 9) * 3;
    const lean = -.04 * bell(t, 1.05, .12) + .05 * bell(t, 1.32, .1) - .05 * pr(t, 1.95, 2.1) * (1 - pr(t, 2.3, 2.4));
    const fast = clamp(bell(t, .95, .18) + pr(t, 2.0, 2.2));
    speed(x, t, 3, 14, 110, 400, 1, '#5C8AD0', .75 * fast);
    // motion ghosting when fast
    if (fast > .05) for (let g = 3; g >= 1; g--) { x.save(); x.globalAlpha = .12 * fast; van(x, vx - g * 34 * fast, CY + 10 + bob, 560, { rot: lean }); x.restore(); }
    van(x, vx, CY + 10 + bob - land * 90, 560, { rot: lean, sy: 1 - land, sx: 1 + land * .5 });
    puffs(x, t, 1.28, vx - 270, CY + 150, 'rgba(120,160,220,1)');
    // parcel drop onto the roof → into the van
    const pd = pr(t, 1.42, 1.74);
    if (pd > 0 && pd < 1) {
      const py = lerp(-140, CY - 105, eInCubic(pd));
      parcel(x, vx - 40, py, 1.15, (1 - pd) * .5);
    }
    // little sparkle when it lands
    const sp = pr(t, 1.72, 2.0);
    if (sp > 0 && sp < 1) {
      x.strokeStyle = C.yellow; x.lineWidth = 8 * (1 - sp); x.lineCap = 'round';
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45, r0 = 90 + sp * 60, r1 = r0 + 40 * (1 - sp);
        x.beginPath(); x.moveTo(vx - 60 + Math.cos(a) * r0, CY - 60 + Math.sin(a) * r0); x.lineTo(vx - 60 + Math.cos(a) * r1, CY - 60 + Math.sin(a) * r1); x.stroke(); }
    }
  }
  // ── FREE delivery (2.3 – 5.1)
  if (t > 2.3 && t < 5.5) {
    x.save();
    const up = eInExpo(pr(t, 4.98, 5.3));               // lockup exits upward
    x.translate(0, -up * 520);
    const pop = 1 + .05 * bell(t, 4.25, .09);
    x.translate(CX, CY); x.scale(pop, pop); x.translate(-CX, -CY);
    setF(x, 900, 250, -8); x.fillStyle = INK;
    FREE.forEach((L, i) => {
      const st = 2.34 + i * .045, p = pr(t, st, st + .42);
      if (p <= 0) return;
      const y = -(1 - eOutBack(p, 1.6)) * 420, land = bell(t, st + .2, .05);
      x.save(); x.translate(L.x + L.w / 2, 288 + y); x.scale(1 + land * .1, 1 - land * .12); x.fillText(L.s, -L.w / 2, 0); x.restore();
    });
    // "delivery" rises in once the underline-van leaves
    const dp = eOutExpo(pr(t, 3.42, 3.85));
    if (dp > 0) {
      x.save(); x.beginPath(); x.rect(0, 312, FW, 140); x.clip();
      setF(x, 800, 112, -2); x.textAlign = 'center'; x.fillStyle = INK; x.fillText('delivery', CX, 420 + (1 - dp) * 130); x.textAlign = 'left'; x.restore();
    }
    x.restore();
    // underline van: zips in under FREE, pauses, zips out right
    const ui = eOutBack(pr(t, 2.72, 3.08), 1.4), uo = eInExpo(pr(t, 3.28, 3.55));
    if (ui > 0 && uo < 1) {
      const ux = lerp(-260, CX, ui) + uo * 900, fastU = clamp(bell(t, 2.85, .1) + pr(t, 3.3, 3.45));
      speed(x, t, 9, 7, 340, 460, 1, 'rgba(11,11,14,.6)', .45 * fastU);
      van(x, ux, 395 + Math.sin(t * 30) * 2, 220, { rot: -.05 * bell(t, 2.95, .08) + .05 * bell(t, 3.12, .08) });
    }
  }
  // ── return: cream wipe led by a van, logo drops back in
  if (cw > 0) {
    const edge = cw * (FW + 340) - 40;
    x.save(); x.beginPath(); x.roundRect(-300, 0, 300 + edge, FH, [0, 260, 260, 0]); x.clip(); cream(x); x.restore();
    if (cw < 1) van(x, edge - 60, 395, 220, { rot: -.03 });
    speed(x, t, 21, 6, 340, 470, 1, 'rgba(11,11,14,.5)', .4 * bell(t, 5.2, .15));
  }
  const lp = pr(t, 5.32, 5.82);
  if (lp > 0) {
    const y = -(1 - eOutBack(lp, 1.8)) * 420, sq = bell(t, 5.58, .05);
    logo(x, CX, CY + y, 10.6 * breathe, { sx: 1 + sq * .08, sy: 1 - sq * .1, rot: (1 - eOutCubic(lp)) * .2 });
  }
}
const SHEEN = mk(FW, FH);

// pill mask + subframe motion blur
const work = mk(FW, FH), wx = work.getContext('2d');
const pill = mk(FW, FH), px = pill.getContext('2d');
function renderPill(t, N = 4, shutter = .5 / FPS) {
  px.setTransform(1, 0, 0, 1, 0, 0); px.globalCompositeOperation = 'source-over'; px.clearRect(0, 0, FW, FH);
  px.save(); px.beginPath(); px.roundRect(0, 0, FW, FH, RAD); px.clip();
  for (let k = 0; k < N; k++) {
    draw(wx, ((t + k / N * shutter) % DUR + DUR) % DUR);
    px.globalAlpha = 1 / (k + 1); px.drawImage(work, 0, 0);   // running average
  }
  px.restore(); px.globalAlpha = 1;
  return pill;
}

// ── in-context homepage header (3x, 390pt wide)
const KS = 3, HW = 390 * KS, HH = 290 * KS;
const ctxc = mk(HW, HH), hx = ctxc.getContext('2d');
function rr(x, a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }
function header(t) {
  const u = hx; u.setTransform(KS, 0, 0, KS, 0, 0);
  const hg = u.createLinearGradient(0, 0, 0, 290); hg.addColorStop(0, '#C6DDF6'); hg.addColorStop(.6, '#D7E9F8'); hg.addColorStop(1, '#EAF2FA');
  u.fillStyle = hg; u.fillRect(0, 0, 390, 290);
  setF(u, 600, 17); u.fillStyle = '#000'; u.fillText('9:41', 44, 31);
  for (let i = 0; i < 4; i++) u.fillRect(306 + i * 5, 26 - i * 2.2, 3.4, 4 + i * 2.2);
  u.strokeStyle = '#000'; u.lineWidth = 2.1; u.lineCap = 'round';
  for (let i = 0; i < 3; i++) { u.beginPath(); u.arc(336, 31, 3 + i * 3.6, -Math.PI * .75, -Math.PI * .25); u.stroke(); }
  u.lineCap = 'butt'; u.lineWidth = 1.2; u.strokeStyle = 'rgba(0,0,0,.45)'; rr(u, 349, 20.5, 25, 12, 3.5); u.stroke(); u.fillStyle = '#000'; rr(u, 351, 22.5, 21, 8, 2); u.fill();
  const tiles = [
    ['#FEEE00', (cx, cy) => { setF(u, 900, 25, -.8); u.fillStyle = '#000'; u.textAlign = 'center'; u.fillText('noon', cx, cy + 8); }],
    ['#fff', (cx, cy) => { setF(u, 900, 21, -.8); u.fillStyle = '#2424B8'; u.textAlign = 'center'; u.fillText('super', cx, cy - 2); u.fillText('mall', cx - 4, cy + 18); }],
    ['#fff', (cx, cy) => { setF(u, 800, 21, -.6); u.fillStyle = '#000'; u.textAlign = 'center'; u.fillText('noon', cx, cy - 2); setF(u, 900, 19, -.2); u.fillStyle = '#E0245E'; u.fillText('FOOD', cx, cy + 18); }],
    ['#fff', (cx, cy) => { u.fillStyle = '#C8332B'; rr(u, cx - 25, cy - 22, 50, 44, 6); u.fill(); setF(u, 900, 25, -1); u.fillStyle = '#fff'; u.textAlign = 'center'; u.fillText('15', cx, cy + 4); u.fillStyle = '#7d1e18'; u.fillRect(cx - 25, cy + 9, 50, 11); setF(u, 900, 7.5, .3); u.fillStyle = '#fff'; u.fillText('MINUTES', cx, cy + 17.5); }],
    ['#fff', (cx, cy) => { u.fillStyle = '#111'; u.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + Math.PI / 6; u.lineTo(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22); } u.fill(); }],
  ];
  tiles.forEach(([bg, d], i) => { const x0 = 13 + 85 * i; u.save(); u.shadowColor = 'rgba(30,60,110,.12)'; u.shadowBlur = 14 * KS; u.shadowOffsetY = 4 * KS; u.fillStyle = bg; rr(u, x0, 58, 78, 78, 22); u.fill(); u.restore(); d(x0 + 39, 97); u.textAlign = 'left'; });
  u.fillStyle = '#1F3A68'; u.save(); u.translate(19, 152); u.beginPath(); u.moveTo(0, 10); u.lineTo(11, 0); u.lineTo(22, 10); u.lineTo(22, 22); u.lineTo(14, 22); u.lineTo(14, 15); u.lineTo(8, 15); u.lineTo(8, 22); u.lineTo(0, 22); u.closePath(); u.fill(); u.restore();
  setF(u, 700, 18, -.2); u.fillStyle = '#000'; u.fillText('Home -', 46, 171);
  setF(u, 400, 14.5); u.fillStyle = '#3A4150'; u.fillText('BDA Complex, 100 Feet Rd 3rd Block, Kor...', 19, 197);
  u.fillStyle = '#fff'; u.beginPath(); u.arc(354, 176, 18.5, 0, 7); u.fill();
  u.fillStyle = '#EE4D5F'; u.save(); u.translate(354, 177); u.scale(1.15, 1.15); u.beginPath(); u.moveTo(0, 7); u.bezierCurveTo(-11, -1, -9, -10, -3, -9); u.bezierCurveTo(-1.2, -8.6, 0, -7, 0, -6); u.bezierCurveTo(0, -7, 1.2, -8.6, 3, -9); u.bezierCurveTo(9, -10, 11, -1, 0, 7); u.fill(); u.restore();
  u.fillStyle = '#fff'; rr(u, 17, 214, 248, 50, 12); u.fill(); u.strokeStyle = '#D3DAE4'; u.lineWidth = 1.3; u.stroke();
  u.strokeStyle = '#111'; u.lineWidth = 2.2; u.beginPath(); u.arc(38, 237, 7, 0, 7); u.stroke(); u.beginPath(); u.moveTo(43, 242); u.lineTo(48, 247); u.stroke();
  setF(u, 500, 15.5); u.fillStyle = '#1b1b1f'; u.fillText('Search for “PS5 ”', 57, 244);
  u.strokeStyle = '#D0D5DD'; u.lineWidth = 1; u.beginPath(); u.moveTo(226, 226); u.lineTo(226, 252); u.stroke();
  u.strokeStyle = '#111'; u.lineWidth = 1.9; rr(u, 236, 231, 21, 15, 3.5); u.stroke(); u.beginPath(); u.arc(246.5, 238.5, 4, 0, 7); u.stroke();
  // the pill
  u.save(); u.shadowColor = 'rgba(30,60,110,.15)'; u.shadowBlur = 10 * KS; u.shadowOffsetY = 3 * KS; u.fillStyle = '#fff'; rr(u, 275, 214, 97, 50, 12); u.fill(); u.restore();
  u.drawImage(pill, 275, 214, 97, 50);
  u.strokeStyle = 'rgba(255,255,255,.9)'; u.lineWidth = 1.2; rr(u, 275, 214, 97, 50, 12); u.stroke();
  const fade = u.createLinearGradient(0, 270, 0, 290); fade.addColorStop(0, 'rgba(244,246,249,0)'); fade.addColorStop(1, '#F4F6F9'); u.fillStyle = fade; u.fillRect(0, 270, 390, 20);
  return ctxc;
}

window.renderFrame = i => { const t = i / FPS; renderPill(t); header(t); };
window.grab = () => ({ pill: pill.toDataURL('image/png'), ctx: ctxc.toDataURL('image/png') });
window.ready = (async () => {
  await Promise.all([400, 500, 600, 700, 800, 900].map(w => document.fonts.load(`${w} 40px Figtree`)));
  await new Promise(r => { const i = new Image(); i.onload = () => { IMG.van = i; r(); }; i.src = '../storyboard/illustrations/van-only.svg'; });
  layout(wx); return true;
})();
