const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));
  const cdp = await page.target().createCDPSession();

  // Test wheel
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.mouse.move(195, 400);
  for (let i = 0; i < 3; i++) { await page.mouse.wheel({ deltaY: 600 }); await new Promise(r => setTimeout(r, 700)); }
  console.log('wheel 3x600 →', await page.evaluate(() => Math.round(window.scrollY)), '(esperado ~1800)');

  // Test gestos táctiles por sección
  for (const [name, x, y] of [['announcement', 195, 24], ['header', 195, 81], ['hero', 195, 276], ['richtext', 195, 700]]) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));
    await cdp.send('Input.synthesizeScrollGesture', { x, y, yDistance: -400, gestureSourceType: 'touch', speed: 700 });
    await new Promise(r => setTimeout(r, 1000));
    console.log(`gesto ${name}: delta`, await page.evaluate(() => Math.round(window.scrollY)));
  }

  // animaciones restantes
  const count = await page.evaluate(() => {
    let preloading = 0;
    for (const a of document.getAnimations()) if (a.animationName === 'preloading' && a.playState === 'running') preloading++;
    return { total: document.getAnimations().length, preloadingRunning: preloading };
  });
  console.log('animaciones:', JSON.stringify(count));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
