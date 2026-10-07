// node render.mjs [stills t1,t2,...]   — default: render pill.mp4 + in-context.mp4
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.dirname(DIR);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.png': 'image/png', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!p.startsWith(ROOT) || !fs.existsSync(p)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); });
await new Promise(r => srv.listen(0, r));
const b = await chromium.launch(); const pg = await b.newPage();
pg.on('pageerror', e => { console.error(e); process.exit(1); });
await pg.goto(`http://localhost:${srv.address().port}/pill/index.html`);
await pg.evaluate(() => window.ready);
const dec = s => Buffer.from(s.slice(s.indexOf(',') + 1), 'base64');
const [mode, arg] = process.argv.slice(2);
if (mode === 'stills') {
  const out = path.join(DIR, 'stills'); fs.mkdirSync(out, { recursive: true });
  for (const t of arg.split(',').map(Number)) {
    await pg.evaluate(i => window.renderFrame(i), Math.round(t * 60));
    const g = await pg.evaluate(() => window.grab());
    fs.writeFileSync(path.join(out, `pill-${t.toFixed(2)}.png`), dec(g.pill));
  }
} else {
  const enc = (file, extra = []) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '60', '-c:v', 'png', '-i', '-', ...extra, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(DIR, file)], { stdio: ['pipe', 'inherit', 'inherit'] });
  const A = enc('noon-one-pill.mp4', ['-filter_complex', 'color=c=0xD3E6F8:s=970x500:r=60[bg];[bg][0:v]overlay=shortest=1']), B = enc('noon-one-pill-in-context.mp4');
  const Cw = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '60', '-c:v', 'png', '-i', '-', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '2M', '-auto-alt-ref', '0', path.join(DIR, 'noon-one-pill-transparent.webm')], { stdio: ['pipe', 'inherit', 'inherit'] });
  const write = (s, buf) => new Promise(r => s.stdin.write(buf) ? r() : s.stdin.once('drain', r));
  for (let i = 0; i < 360; i++) {
    await pg.evaluate(i => window.renderFrame(i), i);
    const g = await pg.evaluate(() => window.grab());
    const pb = dec(g.pill); await write(A, pb); await write(Cw, pb); await write(B, dec(g.ctx));
  }
  A.stdin.end(); B.stdin.end(); Cw.stdin.end();
  await Promise.all([A, B, Cw].map(s => new Promise(r => s.on('close', r))));
  console.log('done');
}
await b.close(); srv.close();
