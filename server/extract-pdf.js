import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to use pdf-parse if installed, otherwise use a simple approach
async function extractPdfText() {
  const pdfPath = path.resolve(__dirname, '..', 'public', 'pdf', 'Final Home Page words.pdf');
  
  console.log('PDF path:', pdfPath);
  
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF file not found at:', pdfPath);
    return;
  }
  
  // Read raw PDF to check if it contains text streams
  const data = fs.readFileSync(pdfPath);
  console.log('PDF size:', data.length, 'bytes');
  
  // For Bengali text, we need proper PDF parsing
  // Try pdf-parse first
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    console.log('=== PDF Text Content ===');
    console.log(pdfData.text);
  } catch (e) {
    console.log('pdf-parse not available. Install with: npm install pdf-parse');
    console.log('Trying basic text extraction...');
    
    // Simple extraction - look for text in PDF stream
    const text = data.toString('utf8');
    // This won't work well for proper PDFs but shows structure
    const textMatches = text.match(/[\u0980-\u09FF]+/g); // Bengali Unicode range
    if (textMatches && textMatches.length > 0) {
      console.log('Found Bengali text patterns:', [...new Set(textMatches)].slice(0, 50));
    }
  }
}

extractPdfText().catch(console.error);