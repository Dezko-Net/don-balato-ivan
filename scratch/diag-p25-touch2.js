const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));
  const cdp = await page.target().createCDPSession();

  async function touchDrag(startX, startY, dy) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y: startY, id: 1 }] });
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: startX, y: startY + (dy * i) / steps, id: 1 }] });
      await new Promise(r => setTimeout(r, 20));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await new Promise(r => setTimeout(r, 900));
  }

  for (const [name, x, y] of [['announcement', 195, 24], ['header', 195, 81], ['hero', 195, 276], ['richtext', 195, 700], ['catslider~1300', 195, 500]]) {
    if (name.startsWith('catslider')) await page.evaluate(() => window.scrollTo(0, 900));
    else await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(x, y, -400);
    const after = await page.evaluate(() => window.scrollY);
    console.log(`${name}: ${Math.round(before)} -> ${Math.round(after)} (delta ${Math.round(after - before)})`);
  }
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
