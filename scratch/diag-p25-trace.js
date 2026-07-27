const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));

  await page.evaluate(() => {
    window.__t = { start: 0, move: 0, cancel: 0, end: 0, lastTarget: '', moveTargets: new Set() };
    const opts = { passive: true, capture: true };
    window.addEventListener('touchstart', e => { window.__t.start++; window.__t.lastTarget = e.target.tagName + '.' + String(e.target.className).slice(0, 50); }, opts);
    window.addEventListener('touchmove', e => { window.__t.move++; window.__t.moveTargets.add(e.target.tagName + '.' + String(e.target.className).slice(0, 40)); }, opts);
    window.addEventListener('touchcancel', () => window.__t.cancel++, opts);
    window.addEventListener('touchend', () => window.__t.end++, opts);
  });

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

  for (const [name, x, y] of [['richtext', 195, 700], ['hero', 195, 276], ['announcement', 195, 24]]) {
    await page.evaluate(() => { window.__t = { start: 0, move: 0, cancel: 0, end: 0, lastTarget: '', moveTargets: new Set() }; window.scrollTo(0, 0); });
    await new Promise(r => setTimeout(r, 400));
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(x, y, -400);
    const after = await page.evaluate(() => window.scrollY);
    const t = await page.evaluate(() => ({ ...window.__t, moveTargets: [...window.__t.moveTargets] }));
    console.log(`${name}: delta=${Math.round(after - before)} | touchstart=${t.start} touchmove=${t.move} touchcancel=${t.cancel} touchend=${t.end}`);
    console.log(`   target: ${t.lastTarget} | moveTargets: ${t.moveTargets.join(' | ')}`);
  }
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
