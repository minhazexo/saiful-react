const fs = require('fs');
const path = require('path');

(async () => {
  const pdfPath = path.join(__dirname, 'public', 'for new things to connect', 'Academy Page Pdf.pdf');
  console.log('Reading PDF:', pdfPath);
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF not found:', pdfPath);
    process.exit(1);
  }

  const out = [];
  out.push('=== PDF: ' + pdfPath + ' (' + fs.statSync(pdfPath).size + ' bytes) ===\n');

  try {
    const mod = require('pdf-parse');
    const PDFParse = mod.PDFParse || mod.default?.PDFParse || (mod.default && mod.default.PDFParse) || mod;
    const buf = fs.readFileSync(pdfPath);
    const parser = new PDFParse({ data: buf });
    const textResult = await parser.getText();
    out.push('=== PAGES ===\n' + (textResult.pages?.length || '?') + '\n\n');
    out.push('=== FULL TEXT ===\n' + (textResult.text || '') + '\n');
    out.push('=== END ===\n');
  } catch (e) {
    out.push('TEXT EXTRACT FAILED: ' + (e?.stack || e?.message || e) + '\n');
  }

  const txtPath = path.join(__dirname, 'public', 'for new things to connect', 'academy-pdf-extracted.txt');
  fs.writeFileSync(txtPath, out.join(''));
  console.log('Wrote', out.join('').length, 'chars to', txtPath);
})().catch((e) => {
  console.error('ERR:', e?.stack || e?.message || e);
  process.exit(1);
});
