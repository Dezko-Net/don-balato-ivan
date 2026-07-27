const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));
  const cdp = await page.target().createCDPSession();

  async function touchDrag(x, y, dy) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + (dy * i) / steps, id: 1 }] });
      await new Promise(r => setTimeout(r, 20));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await new Promise(r => setTimeout(r, 900));
  }

  // overflow computado de una sección
  const ov = await page.evaluate(() => {
    const el = document.querySelector('.shopify-section');
    const s = getComputedStyle(el);
    return s.overflow;
  });
  console.log('overflow .shopify-section:', ov);

  // wheel
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(195, 400);
  for (let i = 0; i < 3; i++) { await page.mouse.wheel({ deltaY: 600 }); await new Promise(r => setTimeout(r, 600)); }
  console.log('wheel 3x600 →', await page.evaluate(() => Math.round(window.scrollY)));

  // gestos en bundle (grid de productos y panel)
  for (const [name, scrollTo, y] of [['bundle-grid', 3600, 400], ['bundle-panel', 5200, 400], ['catslider', 900, 400]]) {
    await page.evaluate(v => window.scrollTo(0, v), scrollTo);
    await new Promise(r => setTimeout(r, 600));
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(195, y, -400);
    const after = await page.evaluate(() => window.scrollY);
    console.log(`${name}: ${Math.round(before)} -> ${Math.round(after)} (delta ${Math.round(after - before)})`);
  }

  // screenshots del bundle
  await page.evaluate(() => window.scrollTo(0, 3540));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'scratch/final-bundle1.png' });
  await page.evaluate(() => window.scrollTo(0, 4900));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'scratch/final-bundle2.png' });
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
