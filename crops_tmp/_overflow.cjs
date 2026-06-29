const { chromium } = require('playwright');
const URL = 'http://localhost:5174/';
const OUT = __dirname;

(async () => {
  const browser = await chromium.launch();
  for (const width of [390, 768]) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
    await page.waitForTimeout(1500);
    const info = await page.evaluate((vw) => {
      const docW = document.documentElement.scrollWidth;
      const offenders = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 || r.left < -1) {
          // only report elements whose own box exceeds, not just children
          if (r.width > vw + 1 || r.right > vw + 2) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className||'').toString().slice(0,45),
              w: Math.round(r.width), left: Math.round(r.left), right: Math.round(r.right),
            });
          }
        }
      });
      // dedupe + sort widest first, keep distinct class
      const seen = new Set(); const uniq = [];
      offenders.sort((a,b)=>b.w-a.w).forEach(o=>{ const k=o.tag+o.cls; if(!seen.has(k)){seen.add(k);uniq.push(o);} });
      return { docW, vw, offenders: uniq.slice(0,25) };
    }, width);
    console.log(`\n===== width ${width}  docScrollWidth=${info.docW} =====`);
    info.offenders.forEach(o => console.log(`  w=${String(o.w).padStart(5)} right=${String(o.right).padStart(5)}  ${o.tag}.${o.cls}`));
    await ctx.close();
  }
  await browser.close();
})();
