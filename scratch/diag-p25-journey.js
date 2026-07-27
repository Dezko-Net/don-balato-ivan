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

  // Simular sesión de usuario: 12 gestos seguidos hacia abajo desde el centro
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  let stuck = 0;
  for (let i = 0; i < 12; i++) {
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(195, 420, -420);
    const after = await page.evaluate(() => window.scrollY);
    const d = Math.round(after - before);
    if (d < 50) stuck++;
    console.log(`gesto ${i + 1}: y=${Math.round(after)} (delta ${d})`);
  }
  console.log(stuck === 0 ? '✅ SCROLL FLUIDO EN TODA LA PÁGINA' : `⚠️ ${stuck} gestos trabados`);
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
