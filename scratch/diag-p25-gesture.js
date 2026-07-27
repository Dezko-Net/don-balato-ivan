const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));
  const cdp = await page.target().createCDPSession();

  for (const [name, x, y] of [['announcement', 195, 24], ['header', 195, 81], ['hero', 195, 276], ['hero2', 195, 450], ['richtext', 195, 700]]) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));
    const before = await page.evaluate(() => window.scrollY);
    await cdp.send('Input.synthesizeScrollGesture', { x, y, yDistance: -400, gestureSourceType: 'touch', speed: 800 });
    await new Promise(r => setTimeout(r, 900));
    const after = await page.evaluate(() => window.scrollY);
    console.log(`${name}: delta ${Math.round(after - before)}`);
  }
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
