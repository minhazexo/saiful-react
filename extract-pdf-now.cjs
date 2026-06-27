const fs = require('fs');
const path = require('path');

(async () => {
  const pdfPath = path.join(__dirname, 'public', 'pdf', 'Final Home Page words.pdf');
  console.log('Reading PDF:', pdfPath);
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF not found:', pdfPath);
    process.exit(1);
  }

  const mod = require('pdf-parse');
  const PDFParse = mod.PDFParse || mod.default?.PDFParse || (mod.default && mod.default.PDFParse) || mod;
  console.log('Loaded PDFParse:', typeof PDFParse);

  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: buf });
  const textResult = await parser.getText();
  let out = '=== PAGES ===\n' + (textResult.pages?.length || '?') + '\n\n';
  out += '=== FULL TEXT ===\n' + (textResult.text || '') + '\n\n';
  const text = textResult.text || '';
  const re = /[\u0980-\u09FF\u09E6-\u09EF]+/g;
  const matches = text.match(re) || [];
  out += '=== UNIQUE BANGLA WORDS/PHRASES (in order) ===\n' + [...new Set(matches)].join(' | ') + '\n\n';
  out += '=== BANGLA WORD FREQUENCY ===\n';
  const freq = {};
  for (const m of matches) freq[m] = (freq[m] || 0) + 1;
  Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .forEach(([w, c]) => { out += c + '\t' + w + '\n'; });

  fs.writeFileSync(path.join(__dirname, 'public', 'pdf-extracted-content.txt'), out);
  console.log('Wrote', out.length, 'chars to public/pdf-extracted-content.txt');
  console.log('Page text snippets (first 8000 chars):');
  console.log(text.slice(0, 8000));
})().catch((e) => {
  console.error('ERR:', e?.stack || e?.message || e);
  process.exit(1);
});
