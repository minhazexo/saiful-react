const { chromium } = require('playwright');
const URL = 'http://localhost:5174/';
const OUT = __dirname;
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
];
(async () => {
  const browser = await chromium.launch();
  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
    await page.waitForTimeout(1500);
    // scroll through to trigger in-view, then force any still-hidden motion elements visible
    await page.evaluate(async () => {
      await new Promise((res)=>{let y=0;const s=()=>{window.scrollBy(0,400);y+=400;if(y<document.body.scrollHeight)setTimeout(s,50);else res();};s();});
    });
    await page.waitForTimeout(800);
    await page.addStyleTag({ content: `*{animation-play-state:paused!important}` });
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach(el => {
        const s = el.getAttribute('style') || '';
        if (/opacity:\s*0/.test(s)) { el.style.opacity='1'; el.style.transform='none'; }
      });
    });
    await page.evaluate(() => window.scrollTo(0,0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/v2_${vp.name}.png`, fullPage: true });
    console.log('shot', vp.name, await page.evaluate(()=>document.documentElement.scrollWidth));
    await ctx.close();
  }
  await browser.close();
})();
