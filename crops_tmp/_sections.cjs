const { chromium } = require('playwright');
const URL = 'http://localhost:5174/';
const OUT = __dirname;
const width = parseInt(process.argv[2] || '390', 10);
const tag = process.argv[3] || 'm';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(1500);
  await page.evaluate(async () => { await new Promise((res)=>{let y=0;const s=()=>{window.scrollBy(0,400);y+=400;if(y<document.body.scrollHeight)setTimeout(s,40);else res();};s();}); });
  await page.waitForTimeout(600);
  await page.addStyleTag({ content: `*{animation-play-state:paused!important}
    nav, header, .consent-banner, [class*="consent"], [class*="ConsentBanner"], [class*="whatsapp"], [class*="WhatsApp"], [class*="DemoBanner"]{display:none!important}` });
  await page.evaluate(() => { document.querySelectorAll('*').forEach(el=>{const s=el.getAttribute('style')||'';if(/opacity:\s*0/.test(s)){el.style.opacity='1';el.style.transform='none';}}); });
  const sels = [
    ['hero', '.hero-section'],
    ['stats', '.stats-section'],
    ['problems', '.problems-section'],
    ['journey', '.start-here'],
    ['framework', '.framework-section'],
    ['process', '.process-section'],
    ['founder', '.founder-section'],
    ['cases', '.client-results-section'],
    ['testi', '.testimonials-section'],
    ['faq', '.faq'],
    ['finalcta', '.final-cta'],
    ['footer', 'footer'],
  ];
  for (const [name, sel] of sels) {
    const el = page.locator(sel).first();
    try { await el.scrollIntoViewIfNeeded({ timeout: 3000 }); await page.waitForTimeout(150);
      await el.screenshot({ path: `${OUT}/sec_${tag}_${name}.png` }); console.log('ok', name);
    } catch(e){ console.log('skip', name, e.message.slice(0,40)); }
  }
  await browser.close();
})();
