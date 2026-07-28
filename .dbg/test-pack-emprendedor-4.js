/* Debug 4: capturar TODOS los eventos del tap y probar mouse vs touch. */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36');
  page.on('pageerror', e => console.log('[pageerror]', (e.stack || String(e)).slice(0, 600)));

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => {
    const r = document.querySelector('.tpl25-shopify-root');
    return r && r.dataset.htmlSet && !r.classList.contains('yaxsell-pre-enhance');
  }, { timeout: 60000 });

  await page.evaluate(() => {
    window.__events = [];
    for (const type of ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'click', 'mousedown', 'mouseup']) {
      document.addEventListener(type, (e) => {
        const t = e.target;
        window.__events.push({
          type,
          tag: t.tagName,
          cls: (t.className || '').toString().slice(0, 50),
          defaultPrevented: e.defaultPrevented,
          x: Math.round(e.clientX ?? -1), y: Math.round(e.clientY ?? -1),
        });
      }, true);
    }
  });

  const SECTION = '#shopify-section-template--27619508257049__product-bundle';
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), SECTION);
  await new Promise(r => setTimeout(r, 2500));

  // Rect JUSTO antes del tap (evitar layout shift)
  const getTogglePoint = () => page.evaluate((sel) => {
    const toggle = document.querySelector(sel)?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    const r = toggle?.getBoundingClientRect();
    return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height } : null;
  }, SECTION);

  let p = await getTogglePoint();
  console.log('toggle point (touch):', p);
  await page.evaluate(() => { window.__events = []; });
  await page.touchscreen.tap(p.x, p.y);
  await new Promise(r => setTimeout(r, 1200));
  let res = await page.evaluate((sel) => ({
    active: document.querySelector(sel)?.querySelector('.product-bundle')?.classList.contains('active'),
    events: window.__events,
  }), SECTION);
  console.log('TOUCH tap → active:', res.active);
  console.log('eventos:', JSON.stringify(res.events, null, 1));

  // Reintentar con MOUSE click
  p = await getTogglePoint();
  console.log('toggle point (mouse):', p);
  await page.evaluate(() => { window.__events = []; });
  await page.mouse.click(p.x, p.y);
  await new Promise(r => setTimeout(r, 1200));
  res = await page.evaluate((sel) => ({
    active: document.querySelector(sel)?.querySelector('.product-bundle')?.classList.contains('active'),
    events: window.__events,
  }), SECTION);
  console.log('MOUSE click → active:', res.active);
  console.log('eventos:', JSON.stringify(res.events, null, 1));

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
