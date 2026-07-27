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
    await new Promise(r => setTimeout(r, 700));
  }

  // Journey x2 para descartar flakiness del primer gesto
  for (let round = 1; round <= 2; round++) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 1200));
    let stuck = 0;
    for (let i = 0; i < 10; i++) {
      const before = await page.evaluate(() => window.scrollY);
      await touchDrag(195, 420, -420);
      const after = await page.evaluate(() => window.scrollY);
      if (Math.round(after - before) < 50) stuck++;
    }
    console.log(`journey ${round}: ${stuck === 0 ? '✅ fluido' : '⚠️ ' + stuck + ' trabados'} (finalY=${await page.evaluate(() => Math.round(window.scrollY))})`);
  }

  // Bundle: scroll a la sección y click real en el toggle
  await page.evaluate(() => window.scrollTo(0, 4200));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scratch/restore-collapsed.png' });
  await page.evaluate(() => document.querySelector('product-bundle-toggle-button').click());
  await new Promise(r => setTimeout(r, 1000));
  const st = await page.evaluate(() => ({
    active: document.querySelector('product-bundle').classList.contains('active'),
    bodyDisplay: getComputedStyle(document.querySelector('.product-bundle__body')).display,
  }));
  console.log('tras click toggle:', JSON.stringify(st));
  await page.screenshot({ path: 'scratch/restore-expanded.png' });
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
