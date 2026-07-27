const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));

  // Encuentra puntos de prueba: announcement, header, hero, richtext, slider categorías, video-hero
  const points = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + Math.min(r.height / 2, 300)), sel };
    };
    return {
      announcement: pick('.topbar-section'),
      header: pick('header[is="sticky-header"]'),
      hero: pick('slideshow-element'),
      richtext: pick('.collage'),
      catslider: pick('slider-element'),
    };
  });
  console.log('Puntos:', JSON.stringify(points));

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

  for (const [name, p] of Object.entries(points)) {
    if (!p || p.y < 0 || p.y > 800) { console.log(`${name}: fuera de viewport, skip`); continue; }
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(p.x, p.y, -400); // deslizar hacia arriba (scroll down)
    const after = await page.evaluate(() => window.scrollY);
    console.log(`${name}: scrollY ${Math.round(before)} -> ${Math.round(after)}  (delta ${Math.round(after - before)})`);
    // volver arriba para el siguiente test
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 600));
  }

  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
