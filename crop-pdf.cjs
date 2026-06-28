const fs = require('fs');
const path = require('path');

// Render once at a scale, dump many named vertical crops.
const REGIONS = [
  // name, y0, y1  (in scaled px)
  ['r-nav-hero', 0, 1400],
  ['r-hero-stats', 1400, 2300],
  ['r-cmp-top', 2700, 4100],
  ['r-cmp-bot', 4000, 5500],
  ['r-category', 5500, 7200],
  ['r-trust', 7100, 8000],
  ['r-journey6', 8000, 9100],
  ['r-steps5', 9100, 10400],
  ['r-founder', 10400, 12000],
  ['r-clientres', 12000, 13600],
  ['r-testi-top', 13600, 15000],
  ['r-testi-bot', 15000, 16400],
  ['r-faq-top', 16400, 17800],
  ['r-faq-bot', 17800, 19400],
  ['r-strategy', 19400, 21000],
  ['r-footer', 21000, 22600],
];

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { createCanvas } = require('@napi-rs/canvas');
  const scale = parseFloat(process.argv[2] || '2');

  const pdfPath = path.join(__dirname, 'public', 'pdf', 'Final Home Page words.pdf');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale });
  const W = Math.ceil(viewport.width);
  const H = Math.ceil(viewport.height);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  const outDir = path.join(__dirname, 'public', 'pdf', 'slices');
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, y0, y1raw] of REGIONS) {
    const y1 = Math.min(y1raw, H);
    if (y0 >= H) continue;
    const h = y1 - y0;
    const sc = createCanvas(W, h);
    const sctx = sc.getContext('2d');
    sctx.drawImage(canvas, 0, y0, W, h, 0, 0, W, h);
    fs.writeFileSync(path.join(outDir, `${name}.png`), sc.toBuffer('image/png'));
    console.log(`${name}.png  y=${y0}..${y1}`);
  }
  console.log('FULL H=', H, 'W=', W);
})().catch((e) => { console.error('ERR:', e?.stack || e); process.exit(1); });
