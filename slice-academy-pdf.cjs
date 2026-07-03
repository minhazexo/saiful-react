// Renders the Academy Page PDF into per-page PNGs, fixed-stride chunks, and
// named section crops using pdfjs-dist + @napi-rs/canvas (same pipeline as
// crop-pdf.cjs).
//
// Usage:
//   node slice-academy-pdf.cjs                  # scale=2, default stride=1400
//   node slice-academy-pdf.cjs 1.5              # custom render scale
//   node slice-academy-pdf.cjs 2 sections.json  # add named region crops
//
// Output: public/pdf/slices/academy/
//   page-pNN.png                  - full page render at chosen scale
//   page-pNN-slice-KKK.png        - fixed 1400px-tall chunks per page
//   <name>.png                    - named region crop (stitched if it
//                                   crosses pages)
//
// sections.json shape:
//   {
//     "stride": 1400,                     // optional; overrides default 1400
//     "regions": [
//       ["hero", 0, 1400],
//       ["ecosystem", 1400, 2600],
//       ["dashboard", 2600, 4000],
//       ["pricing", 15000, 16500]
//     ]
//   }
//
// Y values are "global" scaled-px coordinates assuming all pages stacked
// vertically (i.e. y0..y1 of page N is offset by sum of heights of pages 1..N-1).

const fs = require('fs');
const path = require('path');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { createCanvas } = require('@napi-rs/canvas');

  const scale = parseFloat(process.argv[2] || '2');
  const sectionsPath = process.argv[3] || null;

  const DEFAULT_STRIDE = 1400;

  const pdfPath = path.join(
    __dirname,
    'public',
    'for new things to connect',
    'Academy Page Pdf.pdf',
  );
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF not found:', pdfPath);
    process.exit(1);
  }

  const outDir = path.join(__dirname, 'public', 'pdf', 'slices', 'academy');
  fs.mkdirSync(outDir, { recursive: true });

  // Optional regions (CLI arg). Each is [name, y0, y1] in global scaled-px.
  let regions = [];
  let stride = DEFAULT_STRIDE;
  if (sectionsPath) {
    if (!fs.existsSync(sectionsPath)) {
      console.error('sections file not found:', sectionsPath);
      process.exit(1);
    }
    let cfg;
    try {
      cfg = JSON.parse(fs.readFileSync(sectionsPath, 'utf8'));
    } catch (e) {
      console.error('Invalid sections JSON:', e?.message || e);
      process.exit(1);
    }
    if (typeof cfg.stride === 'number' && cfg.stride > 0) stride = cfg.stride;
    regions = (cfg.regions || []).map(([name, y0, y1]) => ({ name, y0, y1 }));
  }

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

  const totalPages = doc.numPages;
  console.log(`PDF: ${pdfPath}`);
  console.log(
    `Pages: ${totalPages}   Scale: ${scale}x   Stride: ${stride}px   Output: ${outDir}`,
  );
  console.log(`Regions: ${regions.length}`);
  console.log('---');

  // PASS 1 — render each PDF page ONCE, cache canvases, dump full + stride.
  // (Hoisted so named-region crops in Pass 2 reuse these canvases.)
  const pageCanvases = []; // [{ canvas, W, H, baseY }]
  let baseY = 0;
  for (let p = 1; p <= totalPages; p++) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale });
    const W = Math.ceil(viewport.width);
    const H = Math.ceil(viewport.height);

    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    pageCanvases.push({ canvas, W, H, baseY });

    // Full-page output
    const fullName = `page-p${String(p).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(outDir, fullName), canvas.toBuffer('image/png'));
    console.log(`${fullName}  W=${W}  H=${H}  (full page, baseY=${baseY})`);

    // Fixed-stride chunks (driven by cfg.stride or default)
    let idx = 0;
    for (let y = 0; y < H; y += stride) {
      const h = Math.min(stride, H - y);
      const sc = createCanvas(W, h);
      const sctx = sc.getContext('2d');
      sctx.drawImage(canvas, 0, y, W, h, 0, 0, W, h);
      const sliceName = `page-p${String(p).padStart(2, '0')}-slice-${String(idx).padStart(3, '0')}.png`;
      fs.writeFileSync(path.join(outDir, sliceName), sc.toBuffer('image/png'));
      console.log(
        `${sliceName}  page-local y=${y}..${y + h}  global y=${baseY + y}..${baseY + y + h}`,
      );
      idx++;
    }

    baseY += H;
  }

  // PASS 2 — apply each named region. If the region crosses pages, stitch the
  // per-page crops vertically into a single `<name>.png` for direct visual
  // diff against the live page.
  if (regions.length) {
    console.log('---');
    console.log(`Named regions: ${regions.length}`);

    // Namespaced subdir so regions can't collide with `page-*.png` outputs.
    const sectionsOutDir = path.join(outDir, 'sections');
    fs.mkdirSync(sectionsOutDir, { recursive: true });

    // Cache per-region file paths so we can write one stitched PNG per region.
    const regionOutputs = regions.map((r) => ({
      name: r.name,
      y0: r.y0,
      y1: r.y1,
      pieces: [], // { pageIdx, localY, localH, W }
    }));

    for (let pi = 0; pi < pageCanvases.length; pi++) {
      const pg = pageCanvases[pi];
      // pg.baseY is the page's START offset (push happens before baseY+=H).
      const pgStart = pg.baseY;
      const pgEnd = pg.baseY + pg.H;

      for (const regP of regionOutputs) {
        const ovStart = Math.max(regP.y0, pgStart);
        const ovEnd = Math.min(regP.y1, pgEnd);
        if (ovEnd <= ovStart) continue;
        regP.pieces.push({
          pageIdx: pi,
          localY: ovStart - pgStart,
          localH: ovEnd - ovStart,
          W: pg.W,
        });
      }
    }

    for (const regP of regionOutputs) {
      if (!regP.pieces.length) {
        console.log(
          `(skip ${regP.name}: y0=${regP.y0}..${regP.y1} is outside any page)`,
        );
        continue;
      }

      // All pieces on one page → simple crop, same width as source page.
      // Pieces on multiple pages → stitch vertically into one canvas that is
      // min(W across pieces) wide and the sum of piece heights tall.
      const W = Math.min(...regP.pieces.map((p) => p.W));
      const totalH = regP.pieces.reduce((acc, p) => acc + p.localH, 0);
      const out = createCanvas(W, totalH);
      const octx = out.getContext('2d');

      let dy = 0;
      for (let i = 0; i < regP.pieces.length; i++) {
        const p = regP.pieces[i];
        const pgCanvas = pageCanvases[p.pageIdx].canvas;
        octx.drawImage(pgCanvas, 0, p.localY, W, p.localH, 0, dy, W, p.localH);
        dy += p.localH;
      }

      const outName = `${regP.name}.png`;
      fs.writeFileSync(path.join(sectionsOutDir, outName), out.toBuffer('image/png'));

      const pages =
        regP.pieces.length === 1
          ? `p${regP.pieces[0].pageIdx + 1}`
          : `pages ${regP.pieces.map((p) => p.pageIdx + 1).join('+')}`;
      console.log(
        `${outName}  ${pages}  W=${W}  H=${totalH}  (y0=${regP.y0}..y1=${regP.y1})`,
      );
    }
  }

  const totalH = pageCanvases.reduce((acc, p) => acc + p.H, 0);
  console.log('---');
  console.log(`TOTAL: ${totalPages} pages, cumulative H=${totalH} @ ${scale}x`);
  console.log('Done.');
})().catch((e) => {
  console.error('ERR:', e?.stack || e?.message || e);
  process.exit(1);
});
