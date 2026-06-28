const fs = require('fs');
const path = require('path');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { createCanvas } = require('@napi-rs/canvas');

  const pdfPath = path.join(__dirname, 'public', 'pdf', 'Final Home Page words.pdf');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const page = await doc.getPage(1);

  const scale = 1; // 1920 wide is enough
  const viewport = page.getViewport({ scale });
  const W = Math.ceil(viewport.width);
  const H = Math.ceil(viewport.height);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  // Slice vertically into chunks for viewing
  const outDir = path.join(__dirname, 'public', 'pdf', 'slices');
  fs.mkdirSync(outDir, { recursive: true });
  const sliceH = 1400;
  let idx = 0;
  for (let y = 0; y < H; y += sliceH) {
    const h = Math.min(sliceH, H - y);
    const sc = createCanvas(W, h);
    const sctx = sc.getContext('2d');
    sctx.drawImage(canvas, 0, y, W, h, 0, 0, W, h);
    const buf = sc.toBuffer('image/png');
    const name = `slice-${String(idx).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(outDir, name), buf);
    console.log(`${name}  y=${y}..${y + h}`);
    idx++;
  }
  console.log('TOTAL HEIGHT:', H, 'SLICES:', idx);
})().catch((e) => { console.error('ERR:', e?.stack || e); process.exit(1); });
