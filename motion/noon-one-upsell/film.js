'use strict';
// noon One · Free Delivery — 15s motion piece, 1920x1080.
// Everything is a pure function of time t (seconds) so frames render deterministically.

const W = 1920, H = 1080, FPS = 60, DUR = 15;
const C = {
  ink: '#0B0B0E', yellow: '#F3E008', green: '#30AE4A', red: '#C52A26', pink: '#F06298',
  cream: '#FFF6E0', white: '#FFFFFF',
};

// ───────────────────────── math / easing ─────────────────────────
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const pr = (t, a, b) => clamp((t - a) / (b - a));
const eOutCubic = x => 1 - Math.pow(1 - x, 3);
const eInCubic = x => x * x * x;
const eInOutCubic = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eOutQuart = x => 1 - Math.pow(1 - x, 4);
const eOutExpo = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const eInExpo = x => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
const eInOutExpo = x => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2);
const eOutBack = (x, s = 1.70158) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const eInOutSine = x => 0.5 - 0.5 * Math.cos(Math.PI * x);
const pulse = (t, t0, k = 10) => (t < t0 ? 0 : Math.exp(-(t - t0) * k));
const bell = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));
const damp = (t, t0, k = 8, w = 22) => (t < t0 ? 0 : Math.exp(-(t - t0) * k) * Math.cos((t - t0) * w));
// critically-damped-ish spring 0→1 with one overshoot
const spring = (x, f = 1.6, d = 5.5) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-d * x) * Math.cos(f * Math.PI * x) * (1 - x) - 0 * x);
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const lerpV = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));

// ───────────────────────── canvases ─────────────────────────
const out = document.getElementById('out');
const fg = document.createElement('canvas'); fg.width = W; fg.height = H;
const c = fg.getContext('2d');
const mk = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; return k; };
const tcv = mk(W, H), tc = tcv.getContext('2d');   // S1 text buffer (glitch)
const lcv = mk(W, H), lc = lcv.getContext('2d');   // liquid-fill buffer
const mcv = mk(W, H), mc = mcv.getContext('2d');   // text mask buffer
const UIW = 1000, UIH = 2060, BZ = 26, SCR_W = UIW - 2 * BZ, SCR_H = UIH - 2 * BZ, K = SCR_W / 390;
const uiv = mk(UIW, UIH), u = uiv.getContext('2d');

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function setF(ctx, w, s, ls = 0) { ctx.font = `${w} ${s}px Figtree`; ctx.letterSpacing = ls + 'px'; }

// ───────────────────────── logo ─────────────────────────
const LOGO = {
  green: new Path2D('M41.3599 11.7341C41.3106 10.7983 41.1224 9.87152 40.781 8.9876C40.2787 7.68704 39.461 6.54353 38.4577 5.58044C37.9255 5.07034 37.4167 4.52519 36.8274 4.07869C35.7839 3.28693 34.6001 2.68987 33.3709 2.24467C31.0151 1.3932 28.5581 0.886995 26.0854 0.514478C22.0994 -0.087778 18.1095 -0.259109 14.139 0.537842C10.5566 1.25692 7.08453 2.95985 4.25107 5.27801C3.56963 5.83484 2.66884 6.7577 2.17951 7.49234C1.02821 9.21994 2.37031 11.3317 3.18024 12.8958C3.89542 14.2742 4.62877 15.6436 5.379 17.0038C6.05005 18.22 6.68475 19.4648 7.65173 20.4811C9.91798 22.881 13.05 23.7727 16.265 23.9545C18.8675 24.1011 21.4764 23.8714 24.0671 23.5819C26.2256 23.3405 28.379 23.0589 30.5167 22.6747C32.4338 22.3307 34.4327 22.0192 36.1784 21.1106C37.9164 20.2046 39.4272 18.8197 40.3021 17.0506C40.7979 16.0485 41.0705 14.9206 41.247 13.8212C41.3573 13.1281 41.3976 12.4272 41.3612 11.7328L41.3599 11.7341Z'),
  red: new Path2D('M1.29077 11.4181C1.14539 9.93325 1.51661 8.44967 2.65233 7.24257C2.94827 6.92846 3.27925 6.6468 3.63879 6.40668C4.36175 5.92513 5.14053 5.51238 5.94138 5.1762C7.52489 4.51035 9.17721 3.9678 10.8178 3.4564C12.4299 2.95408 14.064 2.52056 15.7228 2.20126C16.5172 2.0481 17.3155 1.9209 18.1176 1.82096C21.112 1.44715 24.1453 1.44325 27.1501 1.66261C30.1549 1.88196 30.8195 1.63535 35.4415 3.56802C37.0783 4.25205 38.558 5.37998 39.6573 6.78828C40.7632 8.20436 41.3499 9.84758 41.4005 11.6725C41.4589 13.7973 41.0501 16.388 39.717 18.052C37.3171 21.0438 33.2077 21.5981 29.5189 21.8096C26.9853 21.955 24.4413 21.9057 21.9051 21.907C20.6603 21.907 19.4143 21.9057 18.1695 21.9005C13.2502 21.8823 8.46852 20.0184 4.54866 17.1071C4.43574 17.0227 4.32152 16.9449 4.21508 16.8527C2.68608 15.5301 1.49325 13.4741 1.29207 11.4181H1.29077Z'),
  pink: new Path2D('M1.72479 17.6835C1.17446 17.0657 0.727953 16.3635 0.424229 15.5717C-0.306526 13.6702 -0.0443342 11.513 0.836985 9.70751C1.82474 7.68528 3.23303 6.57682 5.37337 5.93043C11.4543 4.09381 17.9572 4.53382 24.277 3.89132C26.7405 3.64082 29.1936 3.22287 31.6702 3.19821C32.6268 3.18912 33.6002 3.24104 34.5036 3.55645C35.5706 3.92896 36.483 4.64934 37.2761 5.45407C38.3664 6.55994 39.2814 7.86699 39.7721 9.34148C40.2627 10.816 40.3055 12.4657 39.7227 13.9051C38.6376 16.5828 35.7237 17.9937 32.9733 18.8802C29.3689 20.0419 25.6242 20.7221 21.8692 21.214C17.3263 21.8084 12.6653 22.1226 8.19775 21.1101C5.79262 20.565 3.32389 19.4786 1.72739 17.6848L1.72479 17.6835Z'),
  yellow: new Path2D('M16.6493 3.40276C17.8071 3.20677 19.0012 2.97703 20.2174 2.74599C22.6277 2.28781 24.8304 1.63623 26.8176 1.63623C30.1871 1.63623 32.9076 2.2917 34.8429 3.58967C37.5115 5.37956 38.0787 8.02871 38.0839 9.93672C38.093 12.9415 36.8976 15.4219 34.5301 17.3105C31.3202 19.8727 26.1102 21.1213 19.8579 20.8267C14.5687 20.5774 9.78826 19.3742 6.39667 17.4377C4.10966 16.1319 1.12044 13.793 1.11914 10.3832C1.11914 5.81049 6.53166 5.11608 16.6467 3.40146L16.6493 3.40276Z'),
  o: new Path2D('M11.0821 7.1167C13.9 7.1167 15.3874 8.79367 15.3874 10.973C15.3874 13.5494 13.3639 15.8832 10.4772 15.8832C7.59055 15.8832 6.17188 14.2062 6.17188 12.0451C6.17188 9.46861 8.19541 7.118 11.0821 7.118V7.1167ZM10.9951 9.46861C9.73349 9.46861 8.9028 10.6446 8.9028 11.9062C8.9028 12.9264 9.54269 13.5312 10.5798 13.5312C11.8245 13.5312 12.6721 12.3553 12.6721 11.0937C12.6721 10.0735 12.0322 9.46861 10.9951 9.46861Z'),
  n: new Path2D('M21.9934 10.9898C22.0285 10.8341 22.0804 10.5927 22.0804 10.385C22.0804 9.72821 21.5275 9.46861 20.9395 9.46861C20.162 9.46861 19.5558 9.88396 19.1587 10.2811L17.9658 15.6755H15.3037L17.1533 7.32437H19.8154L19.5727 8.34457C20.2126 7.7566 21.042 7.1167 22.2868 7.1167C23.9637 7.1167 24.9671 8.01619 24.9671 9.27781C24.9671 9.43357 24.9151 9.797 24.8801 9.96963L23.6185 15.6755H20.9564L21.9934 10.9898Z'),
  e: new Path2D('M30.2576 7.1167C32.3668 7.1167 34.0957 8.44841 34.0957 10.886C34.0957 11.4052 33.9918 12.0451 33.923 12.3384H28.0095V12.4423C28.0095 12.8576 28.6312 13.8259 30.0149 13.8259C30.7067 13.8259 31.5192 13.6351 31.9683 13.3067L32.7808 15.0706C31.9683 15.6236 30.8274 15.8832 29.8072 15.8832C27.1451 15.8832 25.3643 14.4995 25.3643 12.097C25.3643 9.4167 27.4047 7.118 30.2576 7.118V7.1167ZM31.7451 10.4888C31.7451 9.95276 31.296 9.17527 30.1369 9.17527C29.1336 9.17527 28.408 9.97093 28.2691 10.6108H31.7269C31.7438 10.5758 31.7438 10.5239 31.7438 10.4901L31.7451 10.4888Z'),
};
const LCX = 20.68, LCY = 12;
const LAYERS = [['green', C.green], ['red', C.red], ['pink', C.pink], ['yellow', C.yellow]];
const LETTERS = [['o', 10.78, 11.5], ['n', 20.13, 11.4], ['e', 29.73, 11.5]];
const LOGO_UNION = new Path2D();
['green', 'red', 'pink', 'yellow'].forEach(k => LOGO_UNION.addPath(LOGO[k]));

function drawLogo(ctx, x, y, s, o = {}) {
  const A = o.alpha ?? 1;
  for (let i = 0; i < 5; i++) {
    const L = (o.layers && o.layers[i]) || {};
    const a = (L.a ?? 1) * A;
    if (a <= 0.002) continue;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(x + (L.dx || 0), y + (L.dy || 0));
    if (L.rot) ctx.rotate(L.rot);
    const sc = s * (L.sc ?? 1);
    ctx.scale(sc * (L.sx ?? 1), sc);
    ctx.translate(-LCX, -LCY);
    if (L.sh) { ctx.shadowColor = `rgba(0,0,0,${L.sh})`; ctx.shadowBlur = L.shb || 30; ctx.shadowOffsetY = L.sho || 12; ctx.shadowOffsetX = L.shx || 0; }
    if (i < 4) { ctx.fillStyle = LAYERS[i][1]; ctx.fill(LOGO[LAYERS[i][0]]); }
    else {
      ctx.fillStyle = o.letterColor || '#000';
      for (let j = 0; j < 3; j++) {
        const [k, lx, ly] = LETTERS[j];
        const P = (o.letters && o.letters[j]) || {};
        const la = P.a ?? 1;
        if (la <= 0.002) continue;
        ctx.save();
        ctx.globalAlpha = a * la;
        ctx.translate(lx + (P.dx || 0), ly + (P.dy || 0));
        const ls = P.sc ?? 1; ctx.scale(ls, ls);
        if (P.rot) ctx.rotate(P.rot);
        ctx.translate(-lx, -ly);
        ctx.fill(LOGO[k]);
        ctx.restore();
      }
    }
    ctx.restore();
  }
}
function logoSheen(ctx, x, y, s, p, alpha = 0.55, rot = 0) {
  if (p <= 0 || p >= 1) return;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-LCX, -LCY);
  ctx.clip(LOGO_UNION);
  const bx = lerp(-10, 52, eInOutCubic(p));
  ctx.translate(bx, 12); ctx.rotate(0.38);
  const g = ctx.createLinearGradient(-5, 0, 5, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(-5, -40, 10, 80);
  ctx.globalAlpha = 0.6;
  const g2 = ctx.createLinearGradient(5, 0, 8, 0);
  g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.7})`); g2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g2; ctx.fillRect(5, -40, 3, 80);
  ctx.restore();
}

// ───────────────────────── camera shake ─────────────────────────
const IMPACTS = [[0.98, 12], [1.745, 20], [2.95, 16], [4.84, 22], [9.56, 9], [13.47, 7]];
function shake(t) {
  let x = 0, y = 0;
  IMPACTS.forEach(([t0, A], i) => {
    const p = pulse(t, t0, 9) * A;
    x += p * Math.sin((t - t0) * 97 + i * 1.7);
    y += p * Math.cos((t - t0) * 83 + i * 2.3);
  });
  return [x, y];
}

// ───────────────────────── layout (computed once fonts load) ─────────────────────────
const S1 = { LY: 455, l1y: 420, l2y: 722, words: [], letters: [], l2L: 0, l2R: 0 };
const S3 = { free: [], freeTop: 0, dL: 0, dR: 0 };
const END = { line2: 'delivery on your orders', words: [], l2x: 0 };

function layout() {
  setF(c, 800, 104, -2);
  const l1 = 'STILL PAYING FOR', w1 = c.measureText(l1).width, x1 = 960 - w1 / 2;
  let acc = '';
  l1.split(' ').forEach((w, i) => {
    S1.words.push({ s: w, x: x1 + (i ? c.measureText(acc + ' ').width : 0) });
    acc += (i ? ' ' : '') + w;
  });
  setF(c, 900, 300, -8);
  const l2 = 'DELIVERY?', w2 = c.measureText(l2).width, x2 = 960 - w2 / 2;
  for (let i = 0; i < l2.length; i++) S1.letters.push({ s: l2[i], x: x2 + c.measureText(l2.slice(0, i)).width, w: c.measureText(l2[i]).width });
  S1.l2L = x2; S1.l2R = x2 + w2;

  setF(c, 900, 420, -14);
  const f = 'FREE', wf = c.measureText(f).width, xf = 960 - wf / 2;
  for (let i = 0; i < 4; i++) S3.free.push({ s: f[i], x: xf + c.measureText(f.slice(0, i)).width, w: c.measureText(f[i]).width });
  S3.fL = xf; S3.fR = xf + wf;
  setF(c, 900, 175, -5);
  const d = 'DELIVERY', wd = c.measureText(d).width;
  S3.dL = 960 - wd / 2; S3.dR = 960 + wd / 2;
  setF(c, 700, 44, 0);
  S3.pillW = c.measureText('on your orders').width + 90;

  setF(c, 700, 74, -1);
  const l = END.line2, wl = c.measureText(l).width, xl = 960 - wl / 2;
  END.l2x = xl;
  let a2 = '';
  l.split(' ').forEach((w, i) => { END.words.push({ s: w, x: xl + (i ? c.measureText(a2 + ' ').width : 0) }); a2 += (i ? ' ' : '') + w; });
  setF(c, 900, 250, -8);
  END.freeW = c.measureText('FREE').width;
  setF(c, 800, 42, 0);
  END.pillW = c.measureText('Join noon One').width + 150;
}

// ───────────────────────── S1 · kinetic type ─────────────────────────
const cam1 = t => 1 + 0.08 * eOutCubic(pr(t, 0, 1.745));

function drawLine2(ctx, t, final) {
  setF(ctx, 900, 300, -8);
  ctx.fillStyle = C.yellow;
  S1.letters.forEach((L, i) => {
    const st = 0.6 + i * 0.045;
    const p = final ? 1 : eOutExpo(pr(t, st, st + 0.6));
    if (p <= 0) return;
    const dy = -(1 - p) * 340;
    ctx.save();
    ctx.translate(L.x + L.w / 2, S1.l2y + dy);
    ctx.scale(1, 1 + (1 - p) * 0.45);
    ctx.fillText(L.s, -L.w / 2, 0);
    ctx.restore();
  });
  // strike-through
  const sp = final ? 1 : eOutExpo(pr(t, 1.36, 1.6));
  if (sp > 0) {
    const x0 = S1.l2L - 34, x1 = S1.l2R + 34, y = S1.l2y - 104;
    ctx.save();
    ctx.translate(x0, y); ctx.rotate(-0.035);
    ctx.fillStyle = C.red;
    ctx.fillRect(0, -17, (x1 - x0) * sp, 34);
    ctx.restore();
  }
}

function sceneS1(t) {
  const k = cam1(t), [sx, sy] = shake(t);
  c.save();
  c.translate(960 + sx, 540 + sy); c.scale(k, k); c.translate(-960, -540);
  const LY = S1.LY;

  // ignition dot → horizon line
  if (t < 1.36) {
    const p1 = pr(t, 0.0, 0.3), p2 = eInOutExpo(pr(t, 0.22, 0.58)), p3 = eInOutExpo(pr(t, 1.0, 1.34));
    const r = 22 * eOutBack(p1, 2.4);
    const w = lerp(2 * r, 1520, p2) * (1 - p3), h = lerp(2 * r, 6, p2);
    if (r > 0.3) {
      // halo
      const hg = c.createRadialGradient(960, LY, 0, 960, LY, 220 * (1 - p2 * 0.6));
      hg.addColorStop(0, `rgba(243,224,8,${0.35 * (1 - p3)})`); hg.addColorStop(1, 'rgba(243,224,8,0)');
      c.fillStyle = hg; c.fillRect(960 - 600, LY - 300, 1200, 600);
    }
    if (w > 0.5) { c.fillStyle = C.yellow; rr(c, 960 - w / 2, LY - h / 2, w, h, h / 2); c.fill(); }
  }

  // line 1 — rises out of the horizon line, exits upward through a mask
  if (t > 0.35 && t < 2.05) {
    c.save();
    c.beginPath(); c.rect(0, LY - 165, W, 161); c.clip();
    setF(c, 800, 104, -2); c.fillStyle = '#fff';
    S1.words.forEach((wd, i) => {
      const st = 0.42 + i * 0.07;
      const p = eOutExpo(pr(t, st, st + 0.7));
      const pe = eInExpo(pr(t, 1.66 + i * 0.04, 1.94 + i * 0.04));
      c.fillText(wd.s, wd.x, S1.l1y + (1 - p) * 140 - pe * 170);
    });
    c.restore();
  }

  // line 2 — drops out of the horizon line, gets struck, glitches, shatters
  if (t > 0.55 && t < 1.745) {
    tc.clearRect(0, 0, W, H);
    tc.save(); tc.beginPath(); tc.rect(0, LY + 4, W, 520); tc.clip();
    drawLine2(tc, t, false);
    tc.restore();
    const g = pr(t, 1.5, 1.58);
    if (g > 0) {
      const R = rng(Math.floor(t * 40) + 7);
      let y = LY;
      while (y < 800) {
        const h = 6 + R() * 46, on = R() < 0.55;
        const dx = on ? (R() - 0.5) * 220 * g : 0;
        c.drawImage(tcv, 0, y, W, h, dx, y, W, h);
        if (on && R() < 0.35) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.5; c.drawImage(tcv, 0, y, W, h, dx + 24 * g, y, W, h); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
        y += h;
      }
    } else c.drawImage(tcv, 0, 0);
  }
  c.restore();
}

// ───────────────────────── particles: type → vortex → logo ─────────────────────────
let PARTS = [];
const PCOL = [C.yellow, C.red, C.green, C.pink, '#FFFFFF'];
function buildParticles() {
  const sc = mk(W, H), s = sc.getContext('2d', { willReadFrequently: true });
  drawLine2(s, 99, true);
  let d = s.getImageData(0, 0, W, H).data;
  const src = [];
  const k1 = cam1(1.745);
  for (let y = 0; y < H; y += 5) for (let x = 0; x < W; x += 5) {
    const i = (y * W + x) * 4;
    if (d[i + 3] > 128) src.push([960 + (x - 960) * k1, 540 + (y - 540) * k1, d[i] > 150 && d[i + 1] < 100 ? 1 : 0]);
  }
  s.clearRect(0, 0, W, H);
  drawLogo(s, 960, 540, 18);
  d = s.getImageData(0, 0, W, H).data;
  const tgt = [];
  for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) {
    const i = (y * W + x) * 4;
    if (d[i + 3] < 128) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2];
    let ci;
    if (r < 60 && g < 60 && b < 60) ci = 4;          // letters → white light
    else if (g > 150 && r > 200 && b < 90) ci = 0;   // yellow
    else if (g > 140 && r < 120) ci = 2;             // green
    else if (b > 110) ci = 3;                         // pink
    else ci = 1;                                      // red
    tgt.push([x, y, ci]);
  }
  const R = rng(42);
  for (let i = tgt.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [tgt[i], tgt[j]] = [tgt[j], tgt[i]]; }
  PARTS = src.map((p, i) => {
    const T = tgt[i % tgt.length];
    let dx = p[0] - 960, dy = p[1] - 610;
    const L = Math.hypot(dx, dy) || 1;
    dx = dx / L + (R() - 0.5) * 0.9; dy = dy / L + (R() - 0.5) * 1.4;
    return {
      x: p[0], y: p[1], sc: p[2], tx: T[0], ty: T[1], tc: T[2],
      dx, dy, dist: 120 + R() * 560, ph: R() * 6.28, d: R(), spin: (2.2 + R() * 2.4) * (R() < 0.5 ? -1 : 1),
      cth: 0.15 + R() * 0.6, sz: 3.2 + R() * 2.6,
    };
  });
}
function drawParticles(t) {
  if (t < 1.745 || t > 3.12) return;
  const fade = 1 - pr(t, 2.98, 3.1);
  const buckets = PCOL.map(() => []);
  const ex = eOutExpo(pr(t, 1.745, 2.6));
  for (const p of PARTS) {
    const ux = p.x + p.dx * p.dist * ex + Math.sin(t * 3.1 + p.ph) * 34 * ex;
    const uy = p.y + p.dy * p.dist * ex + Math.cos(t * 2.7 + p.ph) * 34 * ex;
    const w = eInOutCubic(pr(t, 2.02 + p.d * 0.32, 2.97));
    const sp = p.spin * w, ca = Math.cos(-p.spin), sa = Math.sin(-p.spin);
    const tx = p.tx - 960, ty = p.ty - 540;
    const rtx = tx * ca - ty * sa, rty = tx * sa + ty * ca;
    const lx = lerp(ux - 960, rtx, w), ly = lerp(uy - 540, rty, w);
    const cs = Math.cos(sp), sn = Math.sin(sp);
    const X = 960 + lx * cs - ly * sn, Y = 540 + lx * sn + ly * cs;
    const ci = w > p.cth ? p.tc : (p.sc ? 1 : 0);
    const s = p.sz * lerp(1, 0.85, w) * (1 + 0.6 * bell(w, 0.5, 0.25));
    buckets[ci].push(X - s / 2, Y - s / 2, s);
  }
  c.save();
  c.globalAlpha = fade;
  buckets.forEach((b, ci) => {
    c.fillStyle = PCOL[ci];
    c.beginPath();
    for (let i = 0; i < b.length; i += 3) c.rect(b[i], b[i + 1], b[i + 2], b[i + 2]);
    c.fill();
  });
  c.restore();
}

// ───────────────────────── S2 · logo lock, 3D exploded view, zoom-through ─────────────────────────
function orbitRings(t, front) {
  const a = pr(t, 3.02, 3.4) * (1 - pr(t, 4.05, 4.3));
  if (a <= 0) return;
  for (let i = 0; i < 2; i++) {
    const R = 560 + i * 110, ry = R * (0.2 + 0.06 * i), rot = -0.22 + i * 0.42;
    const grow = eOutExpo(pr(t, 3.02 + i * 0.08, 3.6 + i * 0.08));
    c.save();
    c.translate(960, 540); c.rotate(rot + (1 - grow) * 0.6 * (i ? -1 : 1));
    c.strokeStyle = `rgba(255,255,255,${0.28 * a})`; c.lineWidth = 2;
    c.beginPath();
    if (front) c.ellipse(0, 0, R * grow, ry * grow, 0, 0, Math.PI);
    else c.ellipse(0, 0, R * grow, ry * grow, 0, Math.PI, Math.PI * 2);
    c.stroke();
    for (let d = 0; d < 3; d++) {
      const th = t * (1.3 + i * 0.4) * (i ? -1 : 1) + d * 2.09 + i;
      const sn = Math.sin(th);
      if ((sn > 0) !== front) continue;
      const px = Math.cos(th) * R * grow, py = sn * ry * grow;
      const sz = 9 + 5 * sn;
      c.fillStyle = [C.yellow, C.pink, C.green][(d + i) % 3];
      c.globalAlpha = a;
      c.beginPath(); c.arc(px, py, sz, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
    }
    c.restore();
  }
}
function shockwaves(t) {
  [[2.95, C.yellow, 0], [3.0, C.pink, 1], [3.06, '#ffffff', 2]].forEach(([t0, col, i]) => {
    const p = pr(t, t0, t0 + 0.75);
    if (p <= 0 || p >= 1) return;
    const e = eOutCubic(p);
    c.strokeStyle = col; c.globalAlpha = (1 - p) * (i === 2 ? 0.5 : 0.9);
    c.lineWidth = 44 * (1 - e) + 1;
    c.beginPath(); c.ellipse(960, 540, 300 + e * 1100, (300 + e * 1100) * 0.9, 0, 0, Math.PI * 2); c.stroke();
    c.globalAlpha = 1;
  });
}
function sceneS2(t) {
  drawParticles(t);
  if (t < 2.9) return;
  const [sx, sy] = shake(t);
  const zt = pr(t, 4.16, 4.62), ze = eInExpo(zt);
  const appear = pr(t, 2.9, 2.97);
  const sep = eInOutCubic(pr(t, 3.16, 3.7)) * (1 - eInOutExpo(pr(t, 3.92, 4.26)));
  const ay = lerp(0.6, -0.4, eInOutCubic(pr(t, 3.16, 4.2))) * sep;
  const ax = 0.16 * sep;
  const punch = 1 + 0.14 * damp(t, 2.95, 7, 19);
  const base = 18 * punch;
  const S = base * Math.pow(60, ze);
  const A = [20.5, 18.6];
  const ac = [960 + (A[0] - LCX) * base, 540 + (A[1] - LCY) * base];
  const zc = eInOutCubic(zt);
  const anc = [lerp(ac[0], 960, zc), lerp(ac[1], 540, zc)];
  const cx = anc[0] - (A[0] - LCX) * S + sx * (1 - ze), cy = anc[1] - (A[1] - LCY) * S + sy * (1 - ze);

  if (zt < 0.5) { orbitRings(t, false); shockwaves(t); }
  const zs = [2.4, 1.6, 0.8, 0, -1.0];
  const layers = zs.map(z0 => {
    const z = z0 * 150 * sep;
    const xp = z * Math.sin(ay), yp = -z * Math.sin(ax), depth = z * Math.cos(ay) * Math.cos(ax);
    const k = 1500 / (1500 + depth);
    return { dx: xp * k * (S / 18), dy: yp * k * (S / 18), sc: k, sx: Math.cos(ay), sh: 0.55 * sep, shb: 50 * sep, sho: 26 * sep, shx: -18 * sep };
  });
  drawLogo(c, cx, cy, S, { alpha: appear, layers });
  if (zt < 0.5) {
    logoSheen(c, cx, cy, S, pr(t, 3.0, 3.45), 0.65);
    logoSheen(c, cx, cy, S, pr(t, 3.95, 4.35), 0.5);
    orbitRings(t, true);
  }
}

// ───────────────────────── S3 · FREE DELIVERY on yellow ─────────────────────────
function freeLetters(ctx, t, final) {
  setF(ctx, 900, 420, -14);
  S3.free.forEach((L, i) => {
    const st = 4.64 + i * 0.05;
    const p = final ? 1 : pr(t, st, st + 0.5);
    if (p <= 0) return;
    const y = -(1 - eOutBack(p, 1.5)) * 820;
    const rot = (1 - eOutCubic(p)) * (hash(i + 3) - 0.5) * 0.9;
    const land = final ? 0 : bell(t, st + 0.22, 0.06);
    ctx.save();
    ctx.translate(L.x + L.w / 2, 520 + y);
    ctx.rotate(rot);
    ctx.scale(1 + land * 0.1, 1 - land * 0.12);
    ctx.fillText(L.s, -L.w / 2, 0);
    ctx.restore();
  });
}
function sceneS3(t) {
  c.fillStyle = C.yellow; c.fillRect(0, 0, W, H);
  const [sx, sy] = shake(t);
  const rot = lerp(-0.04, 0.012, eOutCubic(pr(t, 4.62, 7.1)));
  const sc = 1.14 - 0.14 * eOutExpo(pr(t, 4.62, 5.3)) + 0.05 * eInOutSine(pr(t, 5.3, 7.2));
  c.save();
  c.translate(960 + sx, 540 + sy); c.rotate(rot); c.scale(sc, sc); c.translate(-960, -540);

  // drifting crosses (parallax geometry)
  c.strokeStyle = 'rgba(11,11,14,0.13)'; c.lineWidth = 3;
  c.beginPath();
  const off = (t - 4.6) * 38;
  for (let gx = -200; gx < W + 200; gx += 120) for (let gy = -200; gy < H + 200; gy += 120) {
    const x = gx + (off % 120), y = gy - ((off * 0.5) % 120);
    const s = 9 * eOutBack(pr(t, 4.7 + hash(gx * 0.01 + gy) * 0.4, 5.1 + hash(gx * 0.01 + gy) * 0.4), 2);
    if (s <= 0) continue;
    c.moveTo(x - s, y); c.lineTo(x + s, y); c.moveTo(x, y - s); c.lineTo(x, y + s);
  }
  c.stroke();

  // impact rings
  [[4.84, 0], [4.92, 1]].forEach(([t0, i]) => {
    const p = pr(t, t0, t0 + 0.8);
    if (p <= 0 || p >= 1) return;
    const e = eOutCubic(p);
    c.strokeStyle = `rgba(11,11,14,${0.28 * (1 - p)})`; c.lineWidth = 60 * (1 - e) + 1;
    c.beginPath(); c.arc(960, 470, 200 + e * 1300, 0, Math.PI * 2); c.stroke();
  });

  // rotating arcs + dashed orbit
  const arcs = [[C.pink, 520, 34, 0.9, 0.2], [C.green, 575, 18, -0.65, 2.4], [C.red, 470, 14, 1.25, 4.1], [C.ink, 620, 6, -1.0, 1.1]];
  arcs.forEach(([col, R, lw, spd, a0], i) => {
    const g = eOutExpo(pr(t, 4.95 + i * 0.07, 5.7 + i * 0.07));
    if (g <= 0) return;
    const a = a0 + (t - 4.9) * spd;
    c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round';
    c.beginPath(); c.arc(960, 470, R, a, a + 1.1 * g); c.stroke();
    c.beginPath(); c.arc(960, 470, R, a + Math.PI, a + Math.PI + 0.45 * g); c.stroke();
  });
  c.lineCap = 'butt';
  {
    const g = eOutExpo(pr(t, 4.9, 5.6));
    c.save(); c.translate(960, 470); c.rotate((t - 4.6) * 0.35);
    c.setLineDash([3, 17]); c.lineWidth = 5; c.strokeStyle = `rgba(11,11,14,${0.3 * g})`;
    c.beginPath(); c.arc(0, 0, 690 * (0.8 + 0.2 * g), 0, Math.PI * 2); c.stroke();
    c.setLineDash([]); c.restore();
  }

  // FREE
  c.fillStyle = C.ink;
  freeLetters(c, t, false);

  // liquid rising inside FREE (creative mask)
  const lq = eInOutCubic(pr(t, 5.78, 6.4));
  if (lq > 0) {
    lc.clearRect(0, 0, W, H);
    lc.save();
    const top = 520 - 305 - 30, bot = 535;
    const lvl = lerp(bot, top, lq);
    lc.beginPath(); lc.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) lc.lineTo(x, lvl + Math.sin(x * 0.011 + t * 9) * 16 * (1 - lq * 0.6) + Math.sin(x * 0.027 - t * 6) * 7);
    lc.lineTo(W, H); lc.closePath(); lc.clip();
    lc.fillStyle = C.pink; lc.fillRect(0, 0, W, H);
    const blobs = [[C.green, 0.9, 0.0, 260], [C.red, 1.3, 2.0, 230], ['#ffffff', 1.7, 4.0, 120], [C.green, 1.1, 3.1, 200]];
    blobs.forEach(([col, sp, ph, r]) => {
      const bx = 960 + Math.sin(t * sp + ph) * 420, by = 400 + Math.cos(t * sp * 1.3 + ph) * 110;
      const g = lc.createRadialGradient(bx, by, 0, bx, by, r);
      g.addColorStop(0, col); g.addColorStop(1, col === '#ffffff' ? 'rgba(255,255,255,0)' : col + '00');
      lc.fillStyle = g; lc.fillRect(bx - r, by - r, 2 * r, 2 * r);
    });
    lc.restore();
    mc.clearRect(0, 0, W, H);
    mc.fillStyle = '#000';
    freeLetters(mc, t, true);
    mc.globalCompositeOperation = 'source-in';
    mc.drawImage(lcv, 0, 0);
    mc.globalCompositeOperation = 'source-over';
    c.drawImage(mcv, 0, 0);
  }

  // DELIVERY — wipe reveal led by tri-colour bars
  const wp = eInOutExpo(pr(t, 4.96, 5.42));
  if (wp > 0) {
    const L = S3.dL - 70, R = S3.dR + 70, xe = lerp(L, R, wp);
    c.save(); c.beginPath(); c.rect(0, 520, xe, 260); c.clip();
    setF(c, 900, 175, -5); c.fillStyle = C.ink; c.textAlign = 'center';
    c.fillText('DELIVERY', 960, 720);
    c.textAlign = 'left';
    c.restore();
    const bp = pr(t, 4.96, 5.6);
    if (bp < 1) {
      const bx = lerp(L, R + 260, eInOutExpo(bp));
      [C.red, C.green, C.pink].forEach((col, i) => { c.fillStyle = col; c.fillRect(bx + i * 30 - 8, 548 - i * 8, 18, 200 + i * 16); });
    }
  }
  // pill
  const pp = pr(t, 5.3, 5.85);
  if (pp > 0) {
    const s = eOutBack(pp, 2.2);
    c.save(); c.translate(960, 822); c.scale(s, s); c.rotate((1 - eOutCubic(pp)) * -0.12);
    c.fillStyle = C.ink; rr(c, -S3.pillW / 2, -42, S3.pillW, 84, 42); c.fill();
    setF(c, 700, 44, 0); c.fillStyle = C.yellow; c.textAlign = 'center'; c.fillText('on your orders', 0, 15); c.textAlign = 'left';
    c.restore();
  }
  c.restore();
}

// ───────────────────────── marquee bands transition ─────────────────────────
function bands(t) {
  if (t < 6.48 || t > 7.75) return;
  const cols = [[C.ink, C.yellow], [C.pink, C.ink], [C.green, '#fff'], [C.red, '#fff'], [C.ink, C.pink], [C.yellow, C.ink], [C.pink, C.ink], [C.ink, C.yellow], [C.green, '#fff']];
  const N = 9, BH = 190, Lb = 2900;
  c.save();
  c.translate(960, 540); c.rotate(-0.21);
  setF(c, 900, 118, -3);
  for (let i = 0; i < N; i++) {
    const dir = i % 2 ? 1 : -1;
    const cp = eInOutExpo(pr(t, 6.5 + i * 0.032, 6.9 + i * 0.032));
    const xp = eInOutExpo(pr(t, 7.2 + i * 0.03, 7.62 + i * 0.03));
    if (cp <= 0 || xp >= 1) continue;
    const x = dir * Lb * (1 - cp) - dir * Lb * xp;
    const y = (i - (N - 1) / 2) * BH;
    c.save(); c.translate(x, y);
    c.fillStyle = cols[i][0]; c.fillRect(-1500, -BH / 2 - 1, 3000, BH + 2);
    c.beginPath(); c.rect(-1500, -BH / 2, 3000, BH); c.clip();
    c.fillStyle = cols[i][1];
    const scroll = ((t * 900 * dir) % 1100 + 1100) % 1100;
    for (let k = -3; k < 3; k++) {
      const tx = k * 1100 + scroll - 1100;
      c.fillText('FREE DELIVERY', tx, 42);
      c.save(); c.translate(tx + 945, 0); c.rotate(t * 3 * dir);
      c.beginPath(); for (let s = 0; s < 8; s++) { const a = s * Math.PI / 4, r = s % 2 ? 12 : 34; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill();
      c.restore();
    }
    c.restore();
  }
  c.restore();
}

// ───────────────────────── S4 · 3D city delivery run ─────────────────────────
const RP = [[0, 0], [0, 700], [460, 1400], [460, 2100], [-420, 2850], [-420, 3550], [160, 4150], [160, 4800]];
function crPt(p0, p1, p2, p3, v) { const v2 = v * v, v3 = v2 * v; return 0.5 * (2 * p1 + (-p0 + p2) * v + (2 * p0 - 5 * p1 + 4 * p2 - p3) * v2 + (-p0 + 3 * p1 - 3 * p2 + p3) * v3); }
function route(s) {
  const n = RP.length - 1;
  if (s < 0) return [RP[0][0], RP[0][1] + s * n * 700];
  if (s > 1) return [RP[n][0], RP[n][1] + (s - 1) * n * 700];
  const f = s * n, i = Math.min(n - 1, Math.floor(f)), v = f - i;
  const P = k => RP[clamp(k, 0, n)];
  return [crPt(P(i - 1)[0], P(i)[0], P(i + 1)[0], P(i + 2)[0], v), crPt(P(i - 1)[1], P(i)[1], P(i + 1)[1], P(i + 2)[1], v)];
}
const RS = []; for (let i = 0; i <= 400; i++) RS.push(route(i / 400));
const BLD = [];
(function genCity() {
  const R = rng(7);
  const tryAdd = (x, z, w, d, h) => {
    const rad = Math.max(w, d) * 0.72 + 150;
    for (const p of RS) if (Math.hypot(p[0] - x, p[1] - z) < rad) return;
    for (const b of BLD) if (Math.abs(b.x - x) < (b.w + w) / 2 + 40 && Math.abs(b.z - z) < (b.d + d) / 2 + 40) return;
    BLD.push({ x, z, w, d, h, seed: R() * 1000, hue: R() });
  };
  for (let s = -0.15; s < 1.12; s += 0.022) {
    const a = route(s), b = route(s + 0.01);
    let tx = b[0] - a[0], tz = b[1] - a[1]; const L = Math.hypot(tx, tz) || 1; tx /= L; tz /= L;
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        const off = 300 + row * 420 + R() * 200;
        const w = 160 + R() * 190, d = 160 + R() * 190, h = 140 + R() * (row ? 900 : 600);
        tryAdd(a[0] + -tz * off * side, a[1] + tx * off * side, w, d, h);
      }
    }
  }
})();

function makeCam(eye, look, f = 1100) {
  const dx = look[0] - eye[0], dy = look[1] - eye[1], dz = look[2] - eye[2];
  const yaw = Math.atan2(dx, dz), pitch = Math.atan2(-dy, Math.hypot(dx, dz));
  return { ex: eye[0], ey: eye[1], ez: eye[2], cy: Math.cos(yaw), sy: Math.sin(yaw), cp: Math.cos(pitch), sp: Math.sin(pitch), pitch, f };
}
function toCam(m, X, Y, Z) {
  const x = X - m.ex, y = Y - m.ey, z = Z - m.ez;
  const x1 = x * m.cy - z * m.sy, z1 = x * m.sy + z * m.cy;
  return [x1, y * m.cp + z1 * m.sp, -y * m.sp + z1 * m.cp];
}
const scr = (m, p) => [960 + m.f * p[0] / p[2], 540 - m.f * p[1] / p[2]];
function proj(m, X, Y, Z) { const p = toCam(m, X, Y, Z); return p[2] < 15 ? null : [...scr(m, p), p[2]]; }
const NEAR = 15;
function seg3(m, a, b) { // clip a camera-space segment against the near plane, return screen points
  if (a[2] < NEAR && b[2] < NEAR) return null;
  if (a[2] < NEAR) { const k = (NEAR - a[2]) / (b[2] - a[2]); a = [lerp(a[0], b[0], k), lerp(a[1], b[1], k), NEAR]; }
  if (b[2] < NEAR) { const k = (NEAR - b[2]) / (a[2] - b[2]); b = [lerp(b[0], a[0], k), lerp(b[1], a[1], k), NEAR]; }
  return [scr(m, a), scr(m, b)];
}
const pkgS = t => eInOutSine(pr(t, 7.12, 9.56));
function cam4(t) {
  const s = pkgS(t);
  const b = route(s - 0.08), a = route(s + 0.11);
  let eye = [b[0], 230, b[1]], look = [a[0], 0, a[1]];
  const sw = eOutCubic(pr(t, 7.12, 7.95));
  const hb = route(-0.25);
  eye = lerpV([hb[0] - 300, 1500, hb[1]], eye, sw);
  look = lerpV([0, 0, 900], look, sw);
  const cr = eInOutCubic(pr(t, 9.28, 9.9));
  const hm = route(1);
  eye = lerpV(eye, [hm[0] + 120, 2500, hm[1] - 520], cr);
  look = lerpV(look, [hm[0], 0, hm[1] + 60], cr);
  return makeCam(eye, look);
}
function quad(m, pts, fill, stroke) {
  const P = [];
  for (const q of pts) { const p = toCam(m, q[0], q[1], q[2]); if (p[2] < 25) return; P.push(scr(m, p)); }
  c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.stroke(); }
}
function box(m, x, z, w, d, y0, h, cols, edge, yaw = 0) {
  const cs = Math.cos(yaw), sn = Math.sin(yaw);
  const P = (lx, ly, lz) => [x + lx * cs + lz * sn, y0 + ly, z - lx * sn + lz * cs];
  const hw = w / 2, hd = d / 2;
  const faces = [
    { n: [0, 1, 0], v: [P(-hw, h, -hd), P(hw, h, -hd), P(hw, h, hd), P(-hw, h, hd)], col: cols[0] },
    { n: [-sn, 0, -cs], v: [P(-hw, 0, -hd), P(hw, 0, -hd), P(hw, h, -hd), P(-hw, h, -hd)], col: cols[1] },
    { n: [sn, 0, cs], v: [P(-hw, 0, hd), P(hw, 0, hd), P(hw, h, hd), P(-hw, h, hd)], col: cols[1] },
    { n: [-cs, 0, sn], v: [P(-hw, 0, -hd), P(-hw, 0, hd), P(-hw, h, hd), P(-hw, h, -hd)], col: cols[2] },
    { n: [cs, 0, -sn], v: [P(hw, 0, -hd), P(hw, 0, hd), P(hw, h, hd), P(hw, h, -hd)], col: cols[2] },
  ];
  const vis = [];
  for (const f of faces) {
    const cx = (f.v[0][0] + f.v[2][0]) / 2, cy = (f.v[0][1] + f.v[2][1]) / 2, cz = (f.v[0][2] + f.v[2][2]) / 2;
    if ((m.ex - cx) * f.n[0] + (m.ey - cy) * f.n[1] + (m.ez - cz) * f.n[2] > 0) vis.push(f);
  }
  c.lineWidth = 1.2;
  for (const f of vis) quad(m, f.v, f.col, edge);
  return vis;
}
function sceneS4(t) {
  const m = cam4(t);
  const [sx, sy] = shake(t);
  c.save(); c.translate(sx, sy);
  // sky + ground
  const hy = 540 - m.f * Math.tan(m.pitch);
  c.fillStyle = '#08080C'; c.fillRect(-50, -50, W + 100, H + 100);
  if (hy > -400) {
    const g = c.createLinearGradient(0, hy - 420, 0, hy + 10);
    g.addColorStop(0, 'rgba(26,20,40,0)'); g.addColorStop(0.75, 'rgba(60,34,62,0.75)'); g.addColorStop(1, 'rgba(243,224,8,0.32)');
    c.fillStyle = g; c.fillRect(-50, hy - 420, W + 100, 430);
  }
  // grid
  const GS = 250;
  const gx0 = Math.floor((m.ex - 5000) / GS) * GS, gz0 = Math.floor((m.ez - 1200) / GS) * GS;
  c.lineWidth = 1.5;
  for (const major of [false, true]) {
    c.strokeStyle = major ? 'rgba(243,224,8,0.34)' : 'rgba(243,224,8,0.14)';
    c.beginPath();
    for (let x = gx0; x <= gx0 + 10000; x += GS) {
      if ((Math.round(x / GS) % 4 === 0) !== major) continue;
      for (let z = gz0; z < gz0 + 7400; z += GS) {
        const sg = seg3(m, toCam(m, x, 0, z), toCam(m, x, 0, z + GS));
        if (sg) { c.moveTo(sg[0][0], sg[0][1]); c.lineTo(sg[1][0], sg[1][1]); }
      }
    }
    for (let z = gz0; z <= gz0 + 7400; z += GS) {
      if ((Math.round(z / GS) % 4 === 0) !== major) continue;
      for (let x = gx0; x < gx0 + 10000; x += GS) {
        const sg = seg3(m, toCam(m, x, 0, z), toCam(m, x + GS, 0, z));
        if (sg) { c.moveTo(sg[0][0], sg[0][1]); c.lineTo(sg[1][0], sg[1][1]); }
      }
    }
    c.stroke();
  }
  // distance fog over grid
  if (hy > -400) {
    const g = c.createLinearGradient(0, hy, 0, hy + 380);
    g.addColorStop(0, 'rgba(8,8,12,0.95)'); g.addColorStop(1, 'rgba(8,8,12,0)');
    c.fillStyle = g; c.fillRect(-50, hy, W + 100, 380);
  }

  // route
  const s = pkgS(t);
  const drawRoute = (s0, s1, done) => {
    const n = Math.max(2, Math.ceil((s1 - s0) * 400));
    for (let i = 0; i < n; i++) {
      const a = route(lerp(s0, s1, i / n)), b = route(lerp(s0, s1, (i + 1) / n));
      const A = toCam(m, a[0], 2, a[1]), B = toCam(m, b[0], 2, b[1]);
      const sg = seg3(m, A, B); if (!sg) continue;
      const z = Math.max(NEAR, Math.min(A[2], B[2]));
      const wdt = clamp(m.f * 16 / z, 1.5, 22);
      if (done) {
        c.strokeStyle = 'rgba(243,224,8,0.25)'; c.lineWidth = wdt * 2.6; c.beginPath(); c.moveTo(...sg[0]); c.lineTo(...sg[1]); c.stroke();
        c.strokeStyle = C.yellow; c.lineWidth = wdt; c.beginPath(); c.moveTo(...sg[0]); c.lineTo(...sg[1]); c.stroke();
      } else if (i % 4 < 2) {
        c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = wdt * 0.45; c.beginPath(); c.moveTo(...sg[0]); c.lineTo(...sg[1]); c.stroke();
      }
    }
  };
  c.lineCap = 'round';
  drawRoute(s, 1, false);
  drawRoute(0, s, true);
  c.lineCap = 'butt';

  // home ripples on the ground
  const hm = route(1);
  for (let i = 0; i < 3; i++) {
    const p = pr(t, 9.56 + i * 0.12, 10.3 + i * 0.12);
    if (p <= 0 || p >= 1) continue;
    const R = 80 + eOutCubic(p) * 900;
    c.strokeStyle = `rgba(243,224,8,${(1 - p) * 0.9})`; c.lineWidth = 6 * (1 - p) + 1.5;
    c.beginPath();
    for (let k = 0; k <= 48; k++) { const a = k / 48 * Math.PI * 2; const q = proj(m, hm[0] + Math.cos(a) * R, 0, hm[1] + Math.sin(a) * R); if (q) c.lineTo(q[0], q[1]); }
    c.stroke();
  }

  // buildings + package, painter-sorted
  const items = [];
  for (const b of BLD) {
    const p = toCam(m, b.x, 0, b.z);
    if (p[2] < -600 || p[2] > 7600) continue;
    items.push({ z: p[2] + Math.max(b.w, b.d) * 0.3, b });
  }
  const pk = route(s), pk2 = route(s + 0.004);
  const pyaw = Math.atan2(pk2[0] - pk[0], pk2[1] - pk[1]);
  const pp = toCam(m, pk[0], 0, pk[1]);
  items.push({ z: pp[2], pkg: true });
  items.sort((a, b) => b.z - a.z);
  for (const it of items) {
    if (it.pkg) { drawPackage(m, t, pk, pyaw); continue; }
    const b = it.b;
    const rise = eOutCubic(clamp((6800 - it.z) / 1500));
    if (rise <= 0.01) continue;
    const h = b.h * rise;
    const tint = b.hue;
    const top = tint < 0.12 ? '#3a3210' : '#2a2a36', s1 = '#1b1b25', s2 = '#14141c';
    const vis = box(m, b.x, b.z, b.w, b.d, 0, h, [top, s1, s2], `rgba(243,224,8,${0.26 + 0.14 * (tint < 0.3)})`);
    // lit windows
    const wa = 1 - pr(t, 9.2, 9.6);
    if (it.z < 4200 && wa > 0) {
      c.globalAlpha = wa;
      const R = rng(Math.floor(b.seed));
      for (const f of vis) {
        if (f.n[1] === 1) continue;
        const [v0, v1, , v3] = f.v;
        for (let wy = 60; wy < h - 30; wy += 72) for (let wx = 0.18; wx < 0.9; wx += 0.22) {
          const on = R();
          if (on > 0.34) continue;
          const X = lerp(v0[0], v1[0], wx), Z = lerp(v0[2], v1[2], wx);
          const q = proj(m, X, wy, Z); if (!q) continue;
          const sz = clamp(m.f * 22 / q[2], 0.5, 14);
          c.fillStyle = on < 0.05 ? 'rgba(240,98,152,0.85)' : on < 0.1 ? 'rgba(255,255,255,0.7)' : 'rgba(243,224,8,0.6)';
          c.fillRect(q[0] - sz / 2, q[1] - sz * 0.6, sz, sz * 1.2);
        }
      }
      c.globalAlpha = 1;
    }
  }

  // pins
  drawPin(m, route(0), 'store', 1);
  const drop = pr(t, 9.3, 9.7);
  if (drop > 0) drawPin(m, hm, 'home', drop);

  // speed streaks
  const sp = bell(t, 8.4, 0.75) * (1 - pr(t, 9.2, 9.5));
  if (sp > 0.02) {
    const vy = Math.max(hy, 300);
    for (let i = 0; i < 46; i++) {
      const a = hash(i * 3.1) * Math.PI * 2, ph = hash(i * 7.7);
      const r = Math.pow((t * 1.7 + ph) % 1, 2) * 1500 + 120;
      const len = 60 + r * 0.35;
      const x0 = 960 + Math.cos(a) * r, y0 = vy + Math.sin(a) * r * 0.75;
      c.strokeStyle = `rgba(255,255,255,${0.32 * sp * clamp(r / 500)})`; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len * 0.75); c.stroke();
    }
  }

  // fee label tracking the package
  const lq0 = proj(m, pk[0], 175, pk[1]);
  const lp = lq0 ? [lq0[0], Math.max(150, lq0[1] - 130)] : null;
  const la = pr(t, 7.85, 8.2) * (1 - pr(t, 9.15, 9.35));
  if (lp && la > 0) {
    const s2 = eOutBack(pr(t, 7.85, 8.3), 2.2) * (1 - eInExpo(pr(t, 9.15, 9.35)) * 0.4);
    c.save(); c.translate(lp[0], lp[1]); c.scale(s2 * 1.35, s2 * 1.35); c.globalAlpha = la;
    c.shadowColor = 'rgba(0,0,0,0.45)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
    c.fillStyle = '#fff'; rr(c, -200, -52, 400, 92, 46); c.fill();
    c.shadowColor = 'transparent';
    c.beginPath(); c.moveTo(-14, 38); c.lineTo(0, 56); c.lineTo(14, 38); c.fill();
    setF(c, 600, 28, 0); c.fillStyle = '#6b6b75'; c.fillText('Delivery fee', -168, 4);
    // tick → FREE slot animation
    const sl = eOutExpo(pr(t, 8.25, 8.6));
    c.save(); c.beginPath(); c.rect(10, -46, 180, 82); c.clip();
    setF(c, 600, 30, 0); c.fillStyle = '#9a9aa3';
    c.fillText('— — —', 26, 4 - sl * 70);
    setF(c, 900, 38, 0); c.fillStyle = C.green;
    c.fillText('FREE', 34, 10 + (1 - sl) * 70);
    c.restore();
    if (sl > 0.5) { c.strokeStyle = C.green; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); const k = eOutCubic(pr(t, 8.45, 8.7)); c.moveTo(146, -4); c.lineTo(146 + 10 * Math.min(1, k * 2), 6 * Math.min(1, k * 2)); if (k > 0.5) c.lineTo(156 + 22 * (k - 0.5) * 2, 6 - 26 * (k - 0.5) * 2); c.stroke(); c.lineCap = 'butt'; }
    c.restore();
  }

  // kinetic type
  const tA = pr(t, 7.5, 9.3);
  if (tA > 0 && tA < 1) {
    const lg = c.createLinearGradient(0, 0, 900, 0);
    lg.addColorStop(0, 'rgba(8,8,12,0.75)'); lg.addColorStop(1, 'rgba(8,8,12,0)');
    c.fillStyle = lg; c.globalAlpha = Math.min(pr(t, 7.5, 7.8), 1 - pr(t, 9.0, 9.3)); c.fillRect(0, 0, 900, H); c.globalAlpha = 1;
    [['Straight to', '#fff', 360], ['your door.', C.yellow, 490]].forEach(([s2, col, y], i) => {
      const p = eOutExpo(pr(t, 7.62 + i * 0.1, 8.3 + i * 0.1));
      const e = eInExpo(pr(t, 8.98 + i * 0.06, 9.26 + i * 0.06));
      c.save(); c.beginPath(); c.rect(0, y - 120, 1000, 150); c.clip();
      setF(c, 900, 124, -4); c.fillStyle = col;
      c.fillText(s2, 110, y + (1 - p) * 150 - e * 160);
      c.restore();
    });
  }
  c.restore();
  return m;
}
function drawPackage(m, t, pk, yaw) {
  const bob = 62 + Math.sin(t * 13) * 7;
  // shadow
  c.fillStyle = 'rgba(0,0,0,0.55)';
  c.beginPath();
  for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2; const q = proj(m, pk[0] + Math.cos(a) * 85, 0, pk[1] + Math.sin(a) * 85); if (q) c.lineTo(q[0], q[1]); }
  c.fill();
  // glow
  const q = proj(m, pk[0], bob + 55, pk[1]);
  if (q) {
    const r = clamp(m.f * 260 / q[2], 10, 600);
    const g = c.createRadialGradient(q[0], q[1], 0, q[0], q[1], r);
    g.addColorStop(0, 'rgba(243,224,8,0.35)'); g.addColorStop(1, 'rgba(243,224,8,0)');
    c.fillStyle = g; c.fillRect(q[0] - r, q[1] - r, 2 * r, 2 * r);
  }
  box(m, pk[0], pk[1], 110, 110, bob, 110, [C.yellow, '#C9B806', '#A79800'], 'rgba(0,0,0,0.35)', yaw + Math.sin(t * 5) * 0.08);
  // tape on top
  const cs = Math.cos(yaw), sn = Math.sin(yaw), y = bob + 110.5;
  const P = (lx, lz) => [pk[0] + lx * cs + lz * sn, y, pk[1] - lx * sn + lz * cs];
  quad(m, [P(-12, -55), P(12, -55), P(12, 55), P(-12, 55)], C.ink, null);
}
function drawPin(m, p, kind, a) {
  const q = proj(m, p[0], 0, p[1]); if (!q) return;
  const R = clamp(m.f * 95 / q[2], 8, 120) * (kind === 'home' ? 1.25 : 1);
  const dropY = -(1 - eOutBack(a, 2.2)) * 500;
  c.save(); c.translate(q[0], q[1] + dropY);
  c.globalAlpha = clamp(a * 3);
  c.fillStyle = kind === 'home' ? C.yellow : '#fff';
  c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 20; c.shadowOffsetY = 8;
  c.beginPath(); c.arc(0, -R * 1.7, R, Math.PI * 0.82, Math.PI * 0.18); c.lineTo(0, 0); c.closePath(); c.fill();
  c.shadowColor = 'transparent';
  c.fillStyle = C.ink;
  if (kind === 'home') {
    const s = R / 22;
    c.save(); c.translate(0, -R * 1.7); c.scale(s, s);
    c.beginPath(); c.moveTo(-12, -1); c.lineTo(0, -12); c.lineTo(12, -1); c.lineTo(12, 11); c.lineTo(4, 11); c.lineTo(4, 4); c.lineTo(-4, 4); c.lineTo(-4, 11); c.lineTo(-12, 11); c.closePath(); c.fill();
    c.restore();
  } else {
    setF(c, 900, R * 0.62, -1); c.textAlign = 'center'; c.fillText('noon', 0, -R * 1.7 + R * 0.22); c.textAlign = 'left';
  }
  c.restore();
}

// ───────────────────────── phone UI (texture) ─────────────────────────
const TILE = { x: 275, y: 214, w: 97, h: 50 };
function heart(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 7);
  ctx.bezierCurveTo(-11, -1, -9, -10, -3, -9); ctx.bezierCurveTo(-1.2, -8.6, 0, -7, 0, -6);
  ctx.bezierCurveTo(0, -7, 1.2, -8.6, 3, -9); ctx.bezierCurveTo(9, -10, 11, -1, 0, 7);
  ctx.fill(); ctx.restore();
}
function drawTileContent(ctx, t, x, y, w, h, s = 1) {
  // ctx units: pt; (x,y,w,h) tile rect
  const bg = ctx.createLinearGradient(0, y, 0, y + h);
  bg.addColorStop(0, '#FFFCF3'); bg.addColorStop(1, '#F7E6B8');
  ctx.fillStyle = bg; rr(ctx, x, y, w, h, 12 * s); ctx.fill();
  const rg = ctx.createRadialGradient(x + w / 2, y + h * 0.35, 0, x + w / 2, y + h * 0.35, w * 0.55);
  rg.addColorStop(0, 'rgba(255,255,255,0.95)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = rg; ctx.fill();
}
function drawOneTile(t) {
  const { x, y, w, h } = TILE;
  const hl = pr(t, 10.25, 10.6);
  const press = 1 - 0.07 * bell(t, 12.33, 0.06);
  u.save();
  u.translate(x + w / 2, y + h / 2); u.scale(press, press); u.translate(-(x + w / 2), -(y + h / 2));
  if (hl > 0) {
    u.save();
    u.shadowColor = `rgba(243,224,8,${0.9 * hl})`; u.shadowBlur = 60 * hl * (0.85 + 0.15 * Math.sin(t * 9));
    u.fillStyle = '#fff'; rr(u, x, y, w, h, 12); u.fill();
    u.restore();
  }
  drawTileContent(u, t, x, y, w, h);
  u.save(); rr(u, x, y, w, h, 12); u.clip();
  const q = eInOutExpo(pr(t, 11.42, 11.8));
  if (q < 1) drawLogo(u, x + w / 2, y + h / 2 - q * 48, 1.08 * (1 - q * 0.3), { alpha: 1 - q * 0.5 });
  if (q > 0) {
    setF(u, 900, 19, -0.4); u.fillStyle = C.ink; u.textAlign = 'center';
    u.fillText('FREE', x + w / 2, y + 25 + (1 - q) * 46);
    setF(u, 700, 12.5, 0);
    u.fillText('delivery', x + w / 2, y + 40 + (1 - q) * 56);
    u.textAlign = 'left';
  }
  // shimmer
  const sh = pr(t, 11.95, 12.3);
  if (sh > 0 && sh < 1) {
    const bx = lerp(x - 40, x + w + 40, eInOutCubic(sh));
    const g = u.createLinearGradient(bx - 18, 0, bx + 18, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    u.fillStyle = g; u.save(); u.translate(bx, y); u.transform(1, 0, -0.5, 1, 0, 0); u.translate(-bx, -y); u.fillRect(bx - 18, y - 10, 36, h + 20); u.restore();
  }
  // tap ripple
  const rp = pr(t, 12.3, 12.75);
  if (rp > 0 && rp < 1) {
    const R = 6 + eOutCubic(rp) * 70;
    u.fillStyle = `rgba(11,11,14,${0.12 * (1 - rp)})`; u.beginPath(); u.arc(x + w * 0.58, y + h * 0.55, R, 0, Math.PI * 2); u.fill();
  }
  u.restore();
  // border
  u.lineWidth = hl > 0 ? 2.2 : 1.2;
  if (hl > 0) {
    const cg = u.createConicGradient(t * 3.2, x + w / 2, y + h / 2);
    [C.yellow, C.pink, C.red, C.green, C.yellow].forEach((col, i) => cg.addColorStop(i / 4, col));
    u.strokeStyle = cg;
  } else u.strokeStyle = '#ffffff';
  rr(u, x, y, w, h, 12); u.stroke();
  u.restore();
}
function drawUI(t) {
  u.setTransform(1, 0, 0, 1, 0, 0);
  u.clearRect(0, 0, UIW, UIH);
  // body
  const body = u.createLinearGradient(0, 0, UIW, UIH);
  body.addColorStop(0, '#3a3a40'); body.addColorStop(0.5, '#141418'); body.addColorStop(1, '#2a2a30');
  u.fillStyle = body; rr(u, 0, 0, UIW, UIH, 150); u.fill();
  u.strokeStyle = 'rgba(255,255,255,0.35)'; u.lineWidth = 3; rr(u, 4, 4, UIW - 8, UIH - 8, 146); u.stroke();
  u.save();
  rr(u, BZ, BZ, SCR_W, SCR_H, 124); u.clip();
  u.translate(BZ, BZ); u.scale(K, K);
  // screen bg
  u.fillStyle = '#F4F6F9'; u.fillRect(0, 0, 390, 900);
  const hg = u.createLinearGradient(0, 0, 0, 300);
  hg.addColorStop(0, '#C6DDF6'); hg.addColorStop(0.55, '#D7E9F8'); hg.addColorStop(1, 'rgba(244,246,249,1)');
  u.fillStyle = hg; u.fillRect(0, 0, 390, 300);
  const sg = u.createRadialGradient(120, 210, 0, 120, 210, 220);
  sg.addColorStop(0, 'rgba(255,255,255,0.55)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  u.fillStyle = sg; u.fillRect(0, 0, 390, 300);
  // status bar
  setF(u, 600, 17, 0); u.fillStyle = '#000'; u.fillText('9:41', 44, 31);
  for (let i = 0; i < 4; i++) u.fillRect(306 + i * 5, 30 - 4 - i * 2.2, 3.4, 4 + i * 2.2);
  u.strokeStyle = '#000'; u.lineWidth = 2.1; u.lineCap = 'round';
  for (let i = 0; i < 3; i++) { u.beginPath(); u.arc(336, 31, 3 + i * 3.6, -Math.PI * 0.75, -Math.PI * 0.25); u.stroke(); }
  u.lineCap = 'butt';
  u.lineWidth = 1.2; u.strokeStyle = 'rgba(0,0,0,0.45)'; rr(u, 349, 20.5, 25, 12, 3.5); u.stroke();
  u.fillStyle = '#000'; rr(u, 351, 22.5, 21, 8, 2); u.fill(); u.fillRect(375, 24.5, 1.6, 4);
  // dynamic island
  u.fillStyle = '#000'; rr(u, 133, 11, 124, 36, 18); u.fill();
  // app tiles
  const tiles = [
    { bg: '#FEEE00', draw: (cx, cy) => { setF(u, 900, 25, -0.8); u.fillStyle = '#000'; u.textAlign = 'center'; u.fillText('noon', cx, cy + 8); } },
    { bg: '#fff', draw: (cx, cy) => { setF(u, 900, 21, -0.8); u.fillStyle = '#2424B8'; u.textAlign = 'center'; u.fillText('super', cx, cy - 2); u.fillText('mall', cx - 4, cy + 18); } },
    { bg: '#fff', draw: (cx, cy) => { setF(u, 800, 21, -0.6); u.fillStyle = '#000'; u.textAlign = 'center'; u.fillText('noon', cx, cy - 2); setF(u, 900, 19, -0.2); u.fillStyle = '#E0245E'; u.fillText('FOOD', cx, cy + 18); } },
    { bg: '#fff', draw: (cx, cy) => { u.fillStyle = '#C8332B'; rr(u, cx - 25, cy - 22, 50, 44, 6); u.fill(); setF(u, 900, 25, -1); u.fillStyle = '#fff'; u.textAlign = 'center'; u.fillText('15', cx, cy + 4); u.fillStyle = '#7d1e18'; u.fillRect(cx - 25, cy + 9, 50, 11); setF(u, 900, 7.5, 0.3); u.fillStyle = '#fff'; u.fillText('MINUTES', cx, cy + 17.5); } },
    { bg: '#fff', draw: (cx, cy) => { u.fillStyle = '#111'; u.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + Math.PI / 6; u.lineTo(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22); } u.fill(); } },
  ];
  tiles.forEach((tl, i) => {
    const x = 13 + 85 * i, y = 58;
    u.save(); u.shadowColor = 'rgba(30,60,110,0.12)'; u.shadowBlur = 14; u.shadowOffsetY = 4;
    u.fillStyle = tl.bg; rr(u, x, y, 78, 78, 22); u.fill(); u.restore();
    tl.draw(x + 39, y + 39); u.textAlign = 'left';
  });
  // location row
  u.fillStyle = '#1F3A68';
  u.save(); u.translate(19, 152);
  u.beginPath(); u.moveTo(0, 10); u.lineTo(11, 0); u.lineTo(22, 10); u.lineTo(22, 22); u.lineTo(14, 22); u.lineTo(14, 15); u.lineTo(8, 15); u.lineTo(8, 22); u.lineTo(0, 22); u.closePath(); u.fill();
  u.restore();
  setF(u, 700, 18, -0.2); u.fillStyle = '#000'; u.fillText('Home -', 46, 171);
  setF(u, 400, 14.5, 0); u.fillStyle = '#3A4150'; u.fillText('BDA Complex, 100 Feet Rd 3rd Block, Kor...', 19, 197);
  u.strokeStyle = '#000'; u.lineWidth = 1.8; u.beginPath(); u.moveTo(301, 190); u.lineTo(306, 195); u.lineTo(311, 190); u.stroke();
  u.fillStyle = '#fff'; u.beginPath(); u.arc(354, 176, 18.5, 0, Math.PI * 2); u.fill();
  u.fillStyle = '#EE4D5F'; heart(u, 354, 177, 1.15);
  // search
  u.fillStyle = '#fff'; rr(u, 17, 214, 248, 50, 12); u.fill();
  u.strokeStyle = '#D3DAE4'; u.lineWidth = 1.3; u.stroke();
  u.strokeStyle = '#111'; u.lineWidth = 2.2; u.beginPath(); u.arc(38, 237, 7, 0, Math.PI * 2); u.stroke();
  u.beginPath(); u.moveTo(43, 242); u.lineTo(48, 247); u.stroke();
  setF(u, 500, 15.5, 0); u.fillStyle = '#1b1b1f'; u.fillText('Search for “PS5 ”', 57, 244);
  u.strokeStyle = '#D0D5DD'; u.lineWidth = 1; u.beginPath(); u.moveTo(226, 226); u.lineTo(226, 252); u.stroke();
  u.strokeStyle = '#111'; u.lineWidth = 1.9; rr(u, 236, 231, 21, 15, 3.5); u.stroke(); u.beginPath(); u.arc(246.5, 238.5, 4, 0, Math.PI * 2); u.stroke();
  u.beginPath(); u.moveTo(241, 231); u.lineTo(243, 228); u.lineTo(250, 228); u.lineTo(252, 231); u.stroke();
  // cards
  const g1 = u.createLinearGradient(13, 282, 241, 432);
  g1.addColorStop(0, '#E7DFD3'); g1.addColorStop(1, '#BBAA96');
  u.fillStyle = g1; rr(u, 13, 282, 228, 150, 16); u.fill();
  u.fillStyle = 'rgba(255,255,255,0.35)'; u.beginPath(); u.arc(70, 330, 60, 0, Math.PI * 2); u.fill();
  u.fillStyle = 'rgba(120,96,70,0.35)'; rr(u, 140, 330, 70, 90, 30); u.fill();
  u.fillStyle = 'rgba(255,255,255,0.85)'; rr(u, 205, 290, 28, 18, 6); u.fill();
  setF(u, 500, 11, 0); u.fillStyle = '#555'; u.fillText('Ad', 212, 303);
  const g2 = u.createLinearGradient(255, 282, 400, 432);
  g2.addColorStop(0, '#1E2A3A'); g2.addColorStop(1, '#3D5168');
  u.fillStyle = g2; rr(u, 255, 282, 160, 150, 16); u.fill();
  setF(u, 800, 19, -0.3); u.fillStyle = '#fff'; u.fillText('Mega', 270, 318); u.fillText('Deals', 270, 340);
  u.fillStyle = C.yellow; rr(u, 270, 352, 72, 22, 11); u.fill();
  setF(u, 800, 11, 0); u.fillStyle = '#000'; u.fillText('Shop now', 278, 367);
  // section + product cards
  setF(u, 800, 19, -0.3); u.fillStyle = '#111'; u.fillText('Deals for you', 16, 468);
  setF(u, 600, 13, 0); u.fillStyle = '#2E5BD8'; u.fillText('View all', 318, 468);
  const pc = [['#FDE7EF', C.pink], ['#E5F5EA', C.green], ['#FFF6D6', '#E2C800']];
  for (let row = 0; row < 2; row++) for (let i = 0; i < 3; i++) {
    const x = 13 + 123 * i, y = 482 + row * 178;
    u.fillStyle = '#fff'; rr(u, x, y, 116, 166, 14); u.fill();
    u.fillStyle = pc[(i + row) % 3][0]; rr(u, x + 6, y + 6, 104, 96, 10); u.fill();
    u.fillStyle = pc[(i + row) % 3][1];
    if ((i + row) % 3 === 0) { u.beginPath(); u.arc(x + 58, y + 54, 26, 0, Math.PI * 2); u.fill(); }
    else if ((i + row) % 3 === 1) { rr(u, x + 36, y + 26, 44, 56, 12); u.fill(); }
    else { u.beginPath(); u.ellipse(x + 58, y + 62, 34, 16, -0.2, 0, Math.PI * 2); u.fill(); }
    u.fillStyle = '#E3E6EB'; rr(u, x + 8, y + 112, 92, 8, 4); u.fill(); rr(u, x + 8, y + 126, 60, 8, 4); u.fill();
    u.fillStyle = '#111'; rr(u, x + 8, y + 142, 44, 12, 4); u.fill();
  }
  // tab bar
  u.fillStyle = 'rgba(255,255,255,0.97)'; u.fillRect(0, 750, 390, 90);
  u.fillStyle = '#E6E8EC'; u.fillRect(0, 750, 390, 1);
  ['Home', 'Categories', 'Deals', 'Account', 'Cart'].forEach((l, i) => {
    const cx = 39 + i * 78;
    u.fillStyle = i === 0 ? '#111' : '#9AA0AA';
    rr(u, cx - 11, 762, 22, 22, 6); u.fill();
    setF(u, 600, 10.5, 0); u.textAlign = 'center'; u.fillText(l, cx, 799); u.textAlign = 'left';
  });
  u.fillStyle = '#111'; rr(u, 130, 812, 130, 5, 2.5); u.fill();

  // dim everything except the noon One tile
  const dim = pr(t, 10.85, 11.25) * 0.5;
  if (dim > 0) {
    u.fillStyle = `rgba(10,18,34,${dim})`;
    u.beginPath(); u.rect(0, 0, 390, 900);
    u.roundRect(TILE.x - 5, TILE.y - 5, TILE.w + 10, TILE.h + 10, 16);
    u.fill('evenodd');
  }
  drawOneTile(t);
  u.restore();
}

// ───────────────────────── phone camera (4x4) ─────────────────────────
function m4mul(a, b) { const o = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s; } return o; }
function m4persp(fovy, asp, n, f) { const t = 1 / Math.tan(fovy / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; }
function m4trans(x, y, z) { const o = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]); return o; }
function m4rx(a) { const c2 = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c2, s, 0, 0, -s, c2, 0, 0, 0, 0, 1]); }
function m4ry(a) { const c2 = Math.cos(a), s = Math.sin(a); return new Float32Array([c2, 0, -s, 0, 0, 1, 0, 0, s, 0, c2, 0, 0, 0, 0, 1]); }
function m4rz(a) { const c2 = Math.cos(a), s = Math.sin(a); return new Float32Array([c2, s, 0, 0, -s, c2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); }
function m4apply(m, x, y, z) { const X = m[0] * x + m[4] * y + m[8] * z + m[12], Y = m[1] * x + m[5] * y + m[9] * z + m[13], Wc = m[3] * x + m[7] * y + m[11] * z + m[15]; return [(X / Wc * 0.5 + 0.5) * W, (1 - (Y / Wc * 0.5 + 0.5)) * H]; }
const TILE_W = [(BZ + (TILE.x + TILE.w / 2) * K) - UIW / 2, UIH / 2 - (BZ + (TILE.y + TILE.h / 2) * K)];
function phoneMVP(t) {
  const a = eOutCubic(pr(t, 9.62, 10.75));
  const b = eInOutExpo(pr(t, 10.85, 11.45));
  const drift = 0.03 * Math.sin(t * 1.4);
  const rotY = lerp(lerp(-0.75, -0.17, a) + drift * (1 - a * 0.5), 0.0, b) + 0.025 * Math.sin(t * 1.1) * b;
  const rotX = lerp(lerp(0.5, 0.08, a), 0, b) + 0.015 * Math.cos(t * 1.3) * b;
  const rotZ = lerp(lerp(0.22, 0.035, a), 0, b);
  const posY = lerp(-1100, 0, a);
  const dist = lerp(lerp(7600, 4700, a), 940, b) - 90 * eInOutSine(pr(t, 11.45, 12.6));
  const tx = lerp(330, TILE_W[0], b), ty = lerp(0, TILE_W[1], b);
  const P = m4persp(30 * Math.PI / 180, W / H, 50, 40000);
  const V = m4trans(-tx, -ty, -dist);
  const M = m4mul(m4trans(0, posY, 0), m4mul(m4rz(rotZ), m4mul(m4rx(rotX), m4ry(rotY))));
  return m4mul(P, m4mul(V, M));
}
function tileScreen(mvp) {
  const w2 = UIW / 2, h2 = UIH / 2;
  const toW = (px, py) => [BZ + px * K - w2, h2 - (BZ + py * K)];
  const corners = [[TILE.x, TILE.y], [TILE.x + TILE.w, TILE.y], [TILE.x + TILE.w, TILE.y + TILE.h], [TILE.x, TILE.y + TILE.h]].map(([x, y]) => { const w = toW(x, y); return m4apply(mvp, w[0], w[1], 0); });
  const xs = corners.map(p => p[0]), ys = corners.map(p => p[1]);
  return { corners, x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
}

// ───────────────────────── confetti ─────────────────────────
function confetti(t, t0, x, y, n, seed, spd = 1, scale = 1) {
  const tt = t - t0;
  if (tt < 0 || tt > 1.6) return;
  const R = rng(seed);
  const cols = [C.yellow, C.pink, C.green, C.red, '#fff'];
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, v = (500 + R() * 1100) * spd, col = cols[Math.floor(R() * 5)], shp = R(), rs = (R() - 0.5) * 18, sz = (8 + R() * 14) * scale, life = 0.8 + R() * 0.7;
    if (tt > life) continue;
    const drag = (1 - Math.exp(-tt * 3.2)) / 3.2;
    const px = x + Math.cos(a) * v * drag, py = y + Math.sin(a) * v * drag + 600 * tt * tt;
    const al = 1 - pr(tt, life * 0.6, life);
    c.save(); c.translate(px, py); c.rotate(rs * tt); c.globalAlpha = al; c.fillStyle = col; c.strokeStyle = col;
    if (shp < 0.4) c.fillRect(-sz / 2, -sz / 4, sz, sz / 2);
    else if (shp < 0.7) { c.beginPath(); c.arc(0, 0, sz / 2.6, 0, Math.PI * 2); c.fill(); }
    else { c.lineWidth = 4 * scale; c.beginPath(); c.moveTo(-sz / 2, 0); c.lineTo(sz / 2, 0); c.moveTo(0, -sz / 2); c.lineTo(0, sz / 2); c.stroke(); }
    c.restore();
  }
}

// ───────────────────────── S5 overlays ─────────────────────────
function sceneS5Overlay(t, mvp) {
  const ts = tileScreen(mvp);
  const tcx = ts.x + ts.w / 2, tcy = ts.y + ts.h / 2;
  // callout
  const ca = pr(t, 10.2, 10.4) * (1 - pr(t, 10.8, 10.95));
  if (ca > 0) {
    const p = eInOutExpo(pr(t, 10.2, 10.55));
    const ax = ts.x + ts.w + 8, ay = tcy;
    const ex = 1150, ey = 420;
    c.globalAlpha = ca;
    c.strokeStyle = C.ink; c.lineWidth = 3;
    c.beginPath(); c.moveTo(ax, ay);
    const mx = lerp(ax, ex - 40, p);
    c.lineTo(mx, ay + (ey - ay) * clamp(p * 1.5 - 0.3) * 0); c.stroke();
    // elbow path: horizontal then up
    c.beginPath(); c.moveTo(ax, ay); c.lineTo(lerp(ax, ex - 40, eOutCubic(clamp(p * 1.6))), ay);
    if (p > 0.6) c.lineTo(ex - 40, lerp(ay, ey - 30, eOutCubic((p - 0.6) / 0.4)));
    c.stroke();
    c.fillStyle = C.ink; c.beginPath(); c.arc(ax, ay, 7, 0, Math.PI * 2); c.fill();
    [['Your free delivery', C.ink, 0], ['is one tap away.', '#1F3A68', 1]].forEach(([s, col, i]) => {
      const q = eOutExpo(pr(t, 10.32 + i * 0.08, 10.85 + i * 0.08));
      c.save(); c.beginPath(); c.rect(ex - 10, ey - 70 + i * 90, 900, 96); c.clip();
      setF(c, 800, 76, -2); c.fillStyle = col; c.fillText(s, ex, ey + i * 90 + (1 - q) * 100);
      c.restore();
    });
    c.globalAlpha = 1;
  }
  // burst when tile flips to FREE
  confetti(t, 11.5, tcx, tcy, 70, 11, 1.1, 1.1);
  for (let i = 0; i < 2; i++) {
    const p = pr(t, 11.48 + i * 0.1, 12.1 + i * 0.1);
    if (p <= 0 || p >= 1) continue;
    const e = eOutCubic(p);
    c.strokeStyle = i ? C.pink : C.yellow; c.globalAlpha = 1 - p; c.lineWidth = 16 * (1 - e) + 2;
    rr(c, ts.x - e * 160, ts.y - e * 160, ts.w + e * 320, ts.h + e * 320, 30 + e * 140); c.stroke();
    c.globalAlpha = 1;
  }
  return ts;
}

// ───────────────────────── S6 · end card ─────────────────────────
const ENDL = { lx: 960, ly: 280, ls: 11, freeY: 668, l2Y: 770, pillY: 888 };
function endBg(t) {
  const g = c.createRadialGradient(960, 330, 0, 960, 420, 1250);
  g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.35, '#FFF8E6'); g.addColorStop(0.75, '#FBE9BB'); g.addColorStop(1, '#F3D98E');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  const blobs = [[C.pink, 0.35, 0, 520, 0.16], [C.green, 0.28, 2.1, 480, 0.12], [C.yellow, 0.4, 4.2, 600, 0.35], [C.red, 0.22, 5.3, 380, 0.08]];
  blobs.forEach(([col, sp, ph, r, a]) => {
    const bx = 960 + Math.cos(t * sp + ph) * 760, by = 540 + Math.sin(t * sp * 1.3 + ph) * 380;
    const rg = c.createRadialGradient(bx, by, 0, bx, by, r);
    rg.addColorStop(0, col + Math.round(a * 255).toString(16).padStart(2, '0')); rg.addColorStop(1, col + '00');
    c.fillStyle = rg; c.fillRect(bx - r, by - r, 2 * r, 2 * r);
  });
  // fine rotating rings
  c.save(); c.translate(ENDL.lx, ENDL.ly);
  c.setLineDash([2, 14]); c.lineWidth = 2; c.strokeStyle = 'rgba(11,11,14,0.14)';
  c.rotate(t * 0.15); c.beginPath(); c.arc(0, 0, 330, 0, Math.PI * 2); c.stroke();
  c.rotate(-t * 0.35); c.beginPath(); c.arc(0, 0, 410, 0, Math.PI * 2); c.stroke();
  c.setLineDash([]); c.restore();
}
function sceneS6(t, ts) {
  const e = eInOutExpo(pr(t, 12.48, 12.95));
  const full = { x: 0, y: 0, w: W, h: H };
  const r0 = ts ? ts : { x: 900, y: 500, w: 120, h: 60 };
  const R = { x: lerp(r0.x, full.x, e), y: lerp(r0.y, full.y, e), w: lerp(r0.w, full.w, e), h: lerp(r0.h, full.h, e) };
  const rad = lerp(r0.w * 12 / 97, 0, e);
  const push = 1 + 0.03 * eInOutSine(pr(t, 12.9, 15));
  c.save();
  rr(c, R.x, R.y, R.w, R.h, rad); c.clip();
  endBg(t);
  c.translate(960, 540); c.scale(push, push); c.translate(-960, -540);
  const [sx, sy] = shake(t); c.translate(sx * 0.6, sy * 0.6);

  // shared-element text: FREE / delivery travel from the tile to the end card
  const tp = (px, py) => [r0.x + (px - TILE.x) / TILE.w * r0.w, r0.y + (py - TILE.y) / TILE.h * r0.h];
  const ptPx = r0.w / TILE.w;
  const [fx0, fy0] = tp(TILE.x + TILE.w / 2, TILE.y + 25);
  const [dx0, dy0] = tp(TILE.x + TILE.w / 2, TILE.y + 40);
  // highlighter swipe behind FREE
  const hp = eInOutExpo(pr(t, 13.0, 13.32));
  if (hp > 0) {
    c.save(); c.translate(960 - END.freeW / 2 - 30, ENDL.freeY - 70); c.rotate(-0.025);
    c.fillStyle = C.yellow; c.fillRect(0, 0, (END.freeW + 60) * hp, 92);
    c.restore();
  }
  setF(c, 900, lerp(19 * ptPx, 250, e), lerp(-0.4 * ptPx, -8, e)); c.fillStyle = C.ink; c.textAlign = 'center';
  c.fillText('FREE', lerp(fx0, 960, e), lerp(fy0, ENDL.freeY, e));
  // "delivery" anchor: center-aligned in tile → left-aligned start of line 2
  setF(c, 700, lerp(12.5 * ptPx, 74, e), lerp(0, -1, e));
  const dW = c.measureText('delivery').width;
  c.textAlign = 'left';
  c.fillText('delivery', lerp(dx0 - dW / 2, END.l2x, e), lerp(dy0, ENDL.l2Y, e));
  // rest of line 2
  c.save(); c.beginPath(); c.rect(0, ENDL.l2Y - 80, W, 104); c.clip();
  END.words.slice(1).forEach((wd, i) => {
    const q = eOutExpo(pr(t, 12.95 + i * 0.07, 13.55 + i * 0.07));
    if (q <= 0) return;
    c.fillStyle = i === 2 ? '#7a5b00' : C.ink;
    c.fillText(wd.s, wd.x, ENDL.l2Y + (1 - q) * 100);
  });
  c.restore();

  // logo — layers stack in from above, letters stamp
  const layers = [0, 1, 2, 3, 4].map(i => {
    const st = 12.92 + i * 0.07;
    const p = pr(t, st, st + 0.55);
    return { dy: -(1 - eOutBack(p, 1.9)) * 520, rot: (1 - eOutCubic(p)) * (i % 2 ? 0.25 : -0.25), a: p > 0 ? 1 : 0, sh: i < 4 ? 0.12 : 0, shb: 22, sho: 10 };
  });
  const letters = [0, 1, 2].map(j => {
    const p = pr(t, 13.28 + j * 0.06, 13.6 + j * 0.06);
    return { sc: lerp(2.2, 1, eOutBack(p, 2)), a: p > 0 ? 1 : 0 };
  });
  layers[4].dy = 0; layers[4].rot = 0; layers[4].a = 1;
  const fl = Math.sin(t * 2.2) * 6;
  drawLogo(c, ENDL.lx, ENDL.ly + fl, ENDL.ls, { layers, letters });
  logoSheen(c, ENDL.lx, ENDL.ly + fl, ENDL.ls, pr(t, 14.05, 14.6), 0.75);
  confetti(t, 13.47, ENDL.lx, ENDL.ly, 60, 99, 0.9, 1);

  // CTA pill
  const pp = pr(t, 13.45, 13.95);
  if (pp > 0) {
    const s = eOutBack(pp, 2.4);
    const pw = END.pillW, ph = 104;
    c.save(); c.translate(960, ENDL.pillY); c.scale(s, s);
    c.shadowColor = 'rgba(80,60,0,0.3)'; c.shadowBlur = 40; c.shadowOffsetY = 16;
    c.fillStyle = C.ink; rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.fill();
    c.shadowColor = 'transparent';
    setF(c, 800, 42, 0); c.fillStyle = C.yellow; c.textAlign = 'left';
    const tw = c.measureText('Join noon One').width;
    c.fillText('Join noon One', -tw / 2 - 26, 15);
    // arrow chip
    const ax = tw / 2 + 22 + 6 * Math.sin(t * 6) * pr(t, 14.3, 14.5);
    c.fillStyle = C.yellow; c.beginPath(); c.arc(ax, 0, 26, 0, Math.PI * 2); c.fill();
    c.strokeStyle = C.ink; c.lineWidth = 4.5; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(ax - 10, 0); c.lineTo(ax + 9, 0); c.moveTo(ax + 1, -8); c.lineTo(ax + 9, 0); c.lineTo(ax + 1, 8); c.stroke();
    c.lineCap = 'butt';
    // shine
    const sh = pr(t, 14.0, 14.45);
    if (sh > 0 && sh < 1) {
      c.save(); rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.clip();
      const bx = lerp(-pw / 2 - 80, pw / 2 + 80, eInOutCubic(sh));
      const g = c.createLinearGradient(bx - 40, 0, bx + 40, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.translate(bx, 0); c.transform(1, 0, -0.5, 1, 0, 0); c.translate(-bx, 0); c.fillRect(bx - 40, -ph, 80, ph * 2);
      c.restore();
    }
    c.restore();
  }
  c.textAlign = 'left';
  c.restore();
  // expanding edge glow
  if (e > 0 && e < 1) {
    c.strokeStyle = C.yellow; c.lineWidth = 10 * (1 - e) + 2;
    rr(c, R.x, R.y, R.w, R.h, rad); c.stroke();
  }
}

// ───────────────────────── frame composer ─────────────────────────
function drawFrame(t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  c.clearRect(0, 0, W, H);
  c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  const st = { bg: null, phone: null, post: postParams(t) };

  if (t < 4.62) {
    const amt = lerp(0.18, 0.95, eInOutCubic(pr(t, 2.2, 3.05)));
    st.bg = { top: [0.045, 0.043, 0.06], bot: [0.02, 0.02, 0.028], amt, light: 0, focus: lerp(0.4, 1, pr(t, 2.2, 3.0)), speed: 1 + 2 * bell(t, 2.6, 0.4) };
    if (t < 2.05) sceneS1(t);
    sceneS2(t);
  } else if (t < 7.14) {
    sceneS3(t);
  }
  if (t >= 9.6 && t < 12.96) {
    st.bg = { top: [0.53, 0.75, 0.94], bot: [0.92, 0.95, 0.985], amt: 0.55, light: 1, focus: 0, speed: 0.6 };
    drawUI(t);
    st.phone = { mvp: phoneMVP(t), sheen: lerp(-0.6, 1.8, pr(t, 9.7, 11.0)) };
  }
  if (t >= 7.14 && t < 10.2) {
    const m = sceneS4(t);
    // circular reveal from the home pin into the app
    const rp = pr(t, 9.66, 10.15);
    if (rp > 0) {
      const hm = route(1);
      const q = proj(m, hm[0], 0, hm[1]) || [960, 540];
      const r = eInOutExpo(rp) * 2300;
      c.globalCompositeOperation = 'destination-out';
      c.beginPath(); c.arc(q[0], q[1], r, 0, Math.PI * 2); c.fill();
      c.globalCompositeOperation = 'source-over';
      [[C.yellow, 1, 28], [C.pink, 0.93, 14]].forEach(([col, k, lw]) => {
        c.strokeStyle = col; c.lineWidth = lw * (1 - rp) + 2;
        c.beginPath(); c.arc(q[0], q[1], r * k, 0, Math.PI * 2); c.stroke();
      });
    }
  }
  bands(t);
  let ts = null;
  if (st.phone && t >= 10.0) ts = sceneS5Overlay(t, st.phone.mvp);
  if (t >= 12.48) sceneS6(t, ts || (st.phone ? tileScreen(st.phone.mvp) : null));
  if (t >= 12.96) st.phone = null;
  return st;
}

function postParams(t) {
  const ca = 0.0016 + 0.022 * pulse(t, 1.745, 9) + 0.026 * pulse(t, 2.95, 8) + 0.016 * pulse(t, 4.62, 7) + 0.012 * pulse(t, 4.84, 9)
    + 0.016 * pulse(t, 7.14, 8) + 0.012 * bell(t, 6.75, 0.1) + 0.014 * bell(t, 9.85, 0.14) + 0.012 * bell(t, 11.12, 0.16) + 0.014 * bell(t, 12.72, 0.16) + 0.004 * pulse(t, 13.47, 8);
  const flash = 0.32 * pulse(t, 1.745, 14) + 0.55 * pulse(t, 2.95, 9) + 0.12 * pulse(t, 4.62, 10) + 0.10 * pulse(t, 13.47, 10);
  let zb = 0, zc = [0.5, 0.5];
  const zt = pr(t, 4.16, 4.62);
  if (zt > 0 && zt < 1) zb = 0.42 * eInCubic(zt);
  zb += 0.05 * bell(t, 1.8, 0.08) + 0.08 * bell(t, 11.12, 0.14) + 0.06 * bell(t, 12.72, 0.14) + 0.06 * bell(t, 7.0, 0.12);
  const dark = t < 4.62 || (t >= 7.14 && t < 9.9);
  return { ca, flash, zb, zc, vig: dark ? 0.5 : 0.22, grain: 0.045 };
}

// ───────────────────────── WebGL pipeline ─────────────────────────
const gl = out.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false, alpha: false, premultipliedAlpha: false });
const hasFloat = !!gl.getExtension('EXT_color_buffer_float');
const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
const VS = `#version 300 es
in vec2 a; out vec2 v; void main(){ v=a*.5+.5; gl_Position=vec4(a,0.,1.); }`;
const QVS = `#version 300 es
in vec2 a; uniform mat4 uM; uniform vec2 uSize; uniform vec2 uOff; out vec2 v;
void main(){ v=a*.5+.5; gl_Position=uM*vec4(a.x*uSize.x*.5+uOff.x, a.y*uSize.y*.5+uOff.y, 0., 1.); }`;
const NOISE = `
float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+1.),f.x), f.y); }
float fbm(vec2 p){ float s=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s+=a*n(p); p=m*p; a*=.5; } return s; }`;
const BGFS = `#version 300 es
precision highp float; in vec2 v; out vec4 o;
uniform float uT, uAmt, uLight, uFocus; uniform vec2 uRes; uniform vec3 uTop, uBot;
${NOISE}
void main(){
  vec2 p=(v-.5)*vec2(uRes.x/uRes.y,1.)*2.3;
  float t=uT*.32;
  vec2 q=vec2(fbm(p+vec2(0.,t)), fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+3.6*q+vec2(1.7,9.2)+.7*t), fbm(p+3.6*q+vec2(8.3,2.8)-.6*t));
  float f=fbm(p+3.2*r);
  vec3 G=vec3(.188,.682,.290), R=vec3(.773,.165,.149), P=vec3(.941,.384,.596), Y=vec3(.953,.878,.031);
  vec3 col=mix(P,Y,smoothstep(.35,.85,f));
  col=mix(col,G,smoothstep(.5,.95,r.x)*.85);
  col=mix(col,R,smoothstep(.55,.95,q.y)*.7);
  float m=smoothstep(.42,1.05,f*f*1.7+r.y*.35);
  float rib=smoothstep(.02,.0,abs(f-.62))*.6;
  vec3 base=mix(uBot,uTop,v.y);
  float foc=mix(1., smoothstep(1.25,.05,length((v-.5)*vec2(1.7,1.))), uFocus);
  vec3 dcol=mix(mix(P,R,smoothstep(.3,.7,q.x)), G, smoothstep(.55,.9,r.x));
  dcol=mix(dcol, Y, smoothstep(.0,.03,.03-abs(f-.66))*.9);
  float dm=pow(smoothstep(.45,1.0,f*f*1.6+r.y*.3),1.6);
  vec3 dark=base+dcol*(dm*.9+rib*.5)*uAmt*foc;
  vec3 light=mix(base, mix(base,col,.32), (m*.8+rib*.3)*uAmt);
  o=vec4(mix(dark,light,uLight),1.);
}`;
const COPYFS = `#version 300 es
precision highp float; in vec2 v; out vec4 o; uniform sampler2D uT; void main(){ o=texture(uT,v); }`;
const PHONEFS = `#version 300 es
precision highp float; in vec2 v; out vec4 o; uniform sampler2D uT; uniform float uSheen;
void main(){ vec4 c=texture(uT,v); float s=smoothstep(.22,.0,abs((v.x*.8+ (1.-v.y)*.6)-uSheen))*.16; c.rgb+=s*c.a; o=c; }`;
const SHADOWFS = `#version 300 es
precision highp float; in vec2 v; out vec4 o; uniform vec2 uSize; uniform float uR, uBlur, uA;
float sd(vec2 p, vec2 b, float r){ vec2 q=abs(p)-b+r; return length(max(q,0.))+min(max(q.x,q.y),0.)-r; }
void main(){ vec2 p=(v-.5)*uSize; float d=sd(p, uSize*.5-uBlur, uR); float a=(1.-smoothstep(-uBlur,uBlur,d))*uA; o=vec4(0.,0.,0.,a); }`;
const POSTFS = `#version 300 es
precision highp float; in vec2 v; out vec4 o;
uniform sampler2D uS, uF; uniform vec2 uRes, uZC; uniform float uCA, uZB, uFlash, uGrain, uVig, uSeed; uniform int uN;
float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
vec3 cs(vec2 uv, vec2 off){
  vec4 fr=texture(uF,uv+off), fg=texture(uF,uv), fb=texture(uF,uv-off);
  return vec3(fr.r+texture(uS,uv+off).r*(1.-fr.a), fg.g+texture(uS,uv).g*(1.-fg.a), fb.b+texture(uS,uv-off).b*(1.-fb.a));
}
void main(){
  vec2 uv=v, d=uv-.5;
  vec2 off=d*uCA*(.5+dot(d,d)*3.);
  vec3 col=vec3(0.);
  for(int i=0;i<24;i++){ if(i>=uN) break; float k=float(i)/float(max(uN-1,1)); col+=cs(uZC+(uv-uZC)*(1.-uZB*k), off); }
  col/=float(uN);
  col*=1.-uVig*smoothstep(.25,1.05,length(d*vec2(1.25,1.))*1.25);
  col=mix(col, vec3(1.,.99,.92), uFlash);
  col+=(h(gl_FragCoord.xy+uSeed*1.37)-.5)*uGrain;
  o=vec4(col,1.);
}`;
function compile(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
function program(vs, fs) {
  const p = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'a'); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const U = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); U[info.name] = gl.getUniformLocation(p, info.name); }
  return { p, U };
}
const P_BG = program(VS, BGFS), P_COPY = program(VS, COPYFS), P_PHONE = program(QVS, PHONEFS), P_SH = program(QVS, SHADOWFS), P_POST = program(VS, POSTFS);
const triBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, triBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
const quadBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
function useBuf(b) { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); }
function tex(w, h, internal, fmt, type, filter) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  if (w) gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, fmt, type, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}
function fbo(t) { const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return f; }
const BGW = 960, BGH = 540;
const bgT = tex(BGW, BGH, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR), bgF = fbo(bgT);
const scT = tex(W, H, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR), scF = fbo(scT);
let accT = hasFloat ? tex(W, H, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, gl.LINEAR) : tex(W, H, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR);
let accF = fbo(accT);
if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { accT = tex(W, H, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR); accF = fbo(accT); }
const fgT = tex(0, 0, 0, 0, 0, gl.LINEAR);
const uiT = tex(0, 0, 0, 0, 0, gl.LINEAR_MIPMAP_LINEAR);
if (aniso) { gl.bindTexture(gl.TEXTURE_2D, uiT); gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8); }

function upload(t, canvas, mips) {
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  if (mips) gl.generateMipmap(gl.TEXTURE_2D);
}
function bindTex(unit, t) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); }

function renderSub(t, N, seed) {
  const st = drawFrame(t);
  gl.disable(gl.BLEND);
  // background
  if (st.bg) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, bgF); gl.viewport(0, 0, BGW, BGH);
    gl.useProgram(P_BG.p); useBuf(triBuf);
    const b = st.bg;
    gl.uniform1f(P_BG.U.uT, t * (b.speed || 1) + 3.0); gl.uniform1f(P_BG.U.uAmt, b.amt); gl.uniform1f(P_BG.U.uLight, b.light); gl.uniform1f(P_BG.U.uFocus, b.focus);
    gl.uniform2f(P_BG.U.uRes, W, H); gl.uniform3fv(P_BG.U.uTop, b.top); gl.uniform3fv(P_BG.U.uBot, b.bot);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, scF); gl.viewport(0, 0, W, H);
  if (st.bg) { gl.useProgram(P_COPY.p); useBuf(triBuf); bindTex(0, bgT); gl.uniform1i(P_COPY.U.uT, 0); gl.drawArrays(gl.TRIANGLES, 0, 3); }
  else { gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); }
  if (st.phone) {
    upload(uiT, uiv, true);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    useBuf(quadBuf);
    const sh = m4mul(st.phone.mvp, m4trans(60, -110, -120));
    gl.useProgram(P_SH.p);
    gl.uniformMatrix4fv(P_SH.U.uM, false, sh); gl.uniform2f(P_SH.U.uSize, UIW + 360, UIH + 360); gl.uniform2f(P_SH.U.uOff, 0, 0);
    gl.uniform1f(P_SH.U.uR, 330); gl.uniform1f(P_SH.U.uBlur, 180); gl.uniform1f(P_SH.U.uA, 0.42);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(P_PHONE.p);
    gl.uniformMatrix4fv(P_PHONE.U.uM, false, st.phone.mvp); gl.uniform2f(P_PHONE.U.uSize, UIW, UIH); gl.uniform2f(P_PHONE.U.uOff, 0, 0);
    bindTex(0, uiT); gl.uniform1i(P_PHONE.U.uT, 0); gl.uniform1f(P_PHONE.U.uSheen, st.phone.sheen);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.BLEND);
  }
  upload(fgT, fg, false);
  // post → accumulate
  gl.bindFramebuffer(gl.FRAMEBUFFER, accF); gl.viewport(0, 0, W, H);
  gl.enable(gl.BLEND); gl.blendColor(0, 0, 0, 1 / N); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE);
  gl.useProgram(P_POST.p); useBuf(triBuf);
  bindTex(0, scT); bindTex(1, fgT);
  const p = st.post;
  gl.uniform1i(P_POST.U.uS, 0); gl.uniform1i(P_POST.U.uF, 1);
  gl.uniform2f(P_POST.U.uRes, W, H); gl.uniform2f(P_POST.U.uZC, p.zc[0], p.zc[1]);
  gl.uniform1f(P_POST.U.uCA, p.ca); gl.uniform1f(P_POST.U.uZB, p.zb); gl.uniform1f(P_POST.U.uFlash, p.flash);
  gl.uniform1f(P_POST.U.uGrain, p.grain); gl.uniform1f(P_POST.U.uVig, p.vig); gl.uniform1f(P_POST.U.uSeed, seed % 97);
  gl.uniform1i(P_POST.U.uN, p.zb > 0.004 ? 18 : 1);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.disable(gl.BLEND);
}
function renderAt(t, N = 1, seed = 0, shutter = 1 / FPS * 0.5) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, accF); gl.viewport(0, 0, W, H);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  for (let k = 0; k < N; k++) renderSub(Math.min(DUR - 1e-4, t + (N > 1 ? (k / N) * shutter : 0)), N, seed);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
  gl.useProgram(P_COPY.p); useBuf(triBuf); bindTex(0, accT); gl.uniform1i(P_COPY.U.uT, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
window.renderFrame = (i, N = 1) => renderAt(i / FPS, N, i);
window.renderTime = (t, N = 1) => renderAt(t, N, Math.floor(t * FPS));

// ───────────────────────── boot ─────────────────────────
window.ready = (async () => {
  await Promise.all([400, 500, 600, 700, 800, 900].map(w => document.fonts.load(`${w} 40px Figtree`)));
  await document.fonts.ready;
  layout();
  buildParticles();
  return true;
})();
// live preview when opened in a browser normally
if (!/headless/i.test(navigator.userAgent) && !location.search.includes('static')) {
  window.ready.then(() => {
    const t0 = performance.now();
    const loop = () => { const t = ((performance.now() - t0) / 1000) % DUR; renderAt(t, 1, Math.floor(t * FPS)); requestAnimationFrame(loop); };
    loop();
  });
}
