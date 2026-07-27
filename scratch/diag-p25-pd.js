const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));

  // Instrumentar preventDefault
  await page.evaluate(() => {
    window.__pdLog = [];
    const orig = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function () {
      if (this.type && this.type.startsWith('touch')) {
        const stack = new Error().stack.split('\n').slice(1, 4).join(' | ').slice(0, 300);
        window.__pdLog.push(this.type + ' @ ' + (this.target && this.target.className ? String(this.target.className).slice(0, 40) : this.target && this.target.tagName) + ' :: ' + stack);
      }
      return orig.call(this);
    };
  });

  async function touchDrag(startX, startY, dy) {
    const cdp = await page.target().createCDPSession();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y: startY, id: 1 }] });
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: startX, y: startY + (dy * i) / steps, id: 1 }] });
      await new Promise(r => setTimeout(r, 16));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await new Promise(r => setTimeout(r, 800));
  }

  for (const [name, x, y] of [['header', 195, 81], ['hero', 195, 276], ['announcement', 195, 24]]) {
    await page.evaluate(() => { window.__pdLog = []; });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(x, y, -400);
    const after = await page.evaluate(() => window.scrollY);
    const log = await page.evaluate(() => window.__pdLog.slice(0, 4));
    const chain = await page.evaluate(([px, py]) => {
      return document.elementsFromPoint(px, py).slice(0, 6).map(el => {
        const s = getComputedStyle(el);
        return `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 45)} [ta=${s.touchAction}]`;
      });
    }, [x, y]);
    console.log(`\n=== ${name} (delta ${Math.round(after - before)}) ===`);
    chain.forEach(c => console.log('  ', c));
    log.forEach(l => console.log('  PD>', l));
  }
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
