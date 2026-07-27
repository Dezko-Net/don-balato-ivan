const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  async function touchDrag(x, y, dy) {
    const cdp = await page.target().createCDPSession();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + (dy * i) / steps, id: 1 }] });
      await new Promise(r => setTimeout(r, 20));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await new Promise(r => setTimeout(r, 900));
  }

  // Página simple de control
  await page.setContent(`<html><body style="margin:0"><div style="height:3000px;background:linear-gradient(#fff,#000)"></div></body></html>`);
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, 0));
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(195, 400, -400);
    console.log('control:', Math.round(before), '->', await page.evaluate(() => Math.round(window.scrollY)));
  }
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
