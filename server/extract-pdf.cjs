const fs = require('fs');
const path = require('path');

async function extractPdf() {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const pdfPath = path.resolve(__dirname, '..', 'public', 'pdf', 'Final Home Page words.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF not found at:', pdfPath);
      return;
    }
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log('=== PDF Text Content ===');
    console.log(pdfData.text);
    
    // Extract Bengali text specifically
    const bengaliText = pdfData.text.match(/[\u0980-\u09FF\u09E6-\u09EF]+/g);
    if (bengaliText && bengaliText.length > 0) {
      console.log('\n=== Bengali Text Only ===');
      console.log([...new Set(bengaliText)].join(' '));
    }
  } catch (err) {
    console.error('Error:', err.message);
    console.log('\nTo install pdf-parse, run: npm install pdf-parse');
  }
}

extractPdf();