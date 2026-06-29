const { chromium } = require('playwright');

const URL = 'http://localhost:5174/';
const OUT = __dirname;

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

(async () => {
  const browser = await chromium.launch();
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
    // ensure Bengali (BN) like the reference. Try clicking BN toggle if present.
    await page.waitForTimeout(1500);
    // scroll through to trigger lazy/in-view animations
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const step = () => {
          window.scrollBy(0, 600);
          y += 600;
          if (y < document.body.scrollHeight) setTimeout(step, 80);
          else res();
        };
        step();
      });
    });
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/live_${vp.name}.png`, fullPage: true });
    console.log('shot', vp.name);
    await ctx.close();
  }
  await browser.close();
})();
