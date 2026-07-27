const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));
  const cdp = await page.target().createCDPSession();

  for (const [name, x, y] of [['hero', 195, 276], ['richtext', 195, 700], ['bundle-zone', 195, 400]]) {
    if (name === 'bundle-zone') await page.evaluate(() => window.scrollTo(0, 3600));
    else await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 800));
    const before = await page.evaluate(() => window.scrollY);
    await cdp.send('Input.synthesizeScrollGesture', { x, y, yDistance: -500, gestureSourceType: 'touch', speed: 700 });
    await new Promise(r => setTimeout(r, 1200));
    const after = await page.evaluate(() => window.scrollY);
    console.log(`${name}: ${Math.round(before)} -> ${Math.round(after)} (delta ${Math.round(after - before)})`);
  }
  // wheel
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(195, 400);
  await page.mouse.wheel({ deltaY: 600 });
  await new Promise(r => setTimeout(r, 900));
  console.log('wheel:', await page.evaluate(() => Math.round(window.scrollY)));

  await page.screenshot({ path: 'scratch/headful.png' });
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
