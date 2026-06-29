const { chromium } = require('playwright');
const URL = 'http://localhost:5174/';
const OUT = __dirname;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const failed = [];
  const errors = [];
  page.on('requestfailed', (r) => failed.push(r.url() + '  ::  ' + (r.failure()?.errorText||'')));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + '  ' + r.url()); });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2000);
  await page.evaluate(async () => {
    await new Promise((res) => { let y=0; const s=()=>{window.scrollBy(0,500);y+=500;if(y<document.body.scrollHeight)setTimeout(s,60);else res();}; s(); });
  });
  await page.waitForTimeout(1000);

  // Force every framer-motion / hidden element visible
  await page.addStyleTag({ content: `*{animation:none!important;transition:none!important} [style*="opacity: 0"],[style*="opacity:0"]{opacity:1!important;transform:none!important}` });
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      const s = el.getAttribute('style') || '';
      if (/opacity:\s*0/.test(s) || /translate/.test(s)) {
        el.style.opacity = '1'; el.style.transform = 'none';
      }
    });
  });
  await page.waitForTimeout(500);

  // Report section heights & emptiness
  const sections = await page.evaluate(() => {
    return [...document.querySelectorAll('section, footer, .home-page > *')].map(s => {
      const r = s.getBoundingClientRect();
      return { cls: s.className?.toString().slice(0,40), h: Math.round(r.height), txt: (s.innerText||'').trim().slice(0,30) };
    });
  });

  console.log('=== FAILED/404 ===');
  console.log([...new Set(failed)].join('\n') || 'none');
  console.log('\n=== CONSOLE ERRORS ===');
  console.log([...new Set(errors)].slice(0,20).join('\n') || 'none');
  console.log('\n=== SECTIONS ===');
  sections.forEach(s => console.log(`${String(s.h).padStart(5)}px  [${s.cls}]  "${s.txt}"`));

  await page.evaluate(() => window.scrollTo(0,0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/live_desktop_forced.png`, fullPage: true });
  await browser.close();
})();
