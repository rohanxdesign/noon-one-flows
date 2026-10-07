// Renders the film frame-by-frame in headless Chromium and pipes frames to ffmpeg.
//   node render.mjs video [out.mp4] [subframes]
//   node render.mjs stills <dir> t1,t2,...
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, r));
const port = server.address().port;

const [mode = 'video', a1, a2] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => { console.error('[pageerror]', e); process.exit(1); });
await page.goto(`http://localhost:${port}/index.html?static`);
await page.evaluate(() => window.ready);

const grab = async () => {
  const url = await page.evaluate(() => document.getElementById('out').toDataURL('image/png'));
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

if (mode === 'frames') {
  // node render.mjs frames <dir> <start>:<end>:<step> [subframes] — resumable, skips existing frames
  fs.mkdirSync(a1, { recursive: true });
  const [st, en, step = 1] = a2.split(':').map(Number);
  const N = Number(process.argv[5] || 4);
  const t0 = Date.now(); let n = 0;
  for (let i = st; i < en; i += step) {
    const f = path.join(a1, `f${String(i).padStart(4, '0')}.png`);
    if (fs.existsSync(f)) continue;
    await page.evaluate(([i, N]) => window.renderFrame(i, N), [i, N]);
    fs.writeFileSync(f + '.tmp', await grab()); fs.renameSync(f + '.tmp', f);
    if (++n % 20 === 0) console.log(`${i} ${((Date.now() - t0) / n / 1000).toFixed(2)}s/frame`);
  }
} else if (mode === 'stills') {
  fs.mkdirSync(a1, { recursive: true });
  for (const t of a2.split(',').map(Number)) {
    await page.evaluate(t => window.renderTime(t, 1), t);
    fs.writeFileSync(path.join(a1, `t${t.toFixed(2).padStart(5, '0')}.png`), await grab());
    console.log('still', t);
  }
} else {
  const outFile = a1 || path.join(ROOT, 'noon-one-free-delivery.mp4');
  const N = Number(a2 || 4);
  const FRAMES = 15 * 60;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '60', '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < FRAMES; i++) {
    await page.evaluate(([i, N]) => window.renderFrame(i, N), [i, N]);
    const buf = await grab();
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 30 === 0) console.log(`frame ${i}/${FRAMES}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', outFile);
}
await browser.close();
server.close();
