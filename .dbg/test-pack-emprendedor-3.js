/* Debug 3: saber QUÉ elemento recibe realmente el tap y por qué. */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36');
  page.on('pageerror', e => console.log('[pageerror]', (e.stack || String(e)).slice(0, 800)));

  const t0 = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  await page.waitForFunction(() => {
    const r = document.querySelector('.tpl25-shopify-root');
    return r && r.dataset.htmlSet && !r.classList.contains('yaxsell-pre-enhance');
  }, { timeout: 60000 });
  console.log('visible @', Date.now() - t0, 'ms');

  // Probar clicks en document para ver si el delegado recibe algo
  await page.evaluate(() => {
    window.__clicks = [];
    document.addEventListener('click', (e) => {
      const t = e.target;
      window.__clicks.push({
        tag: t.tagName, cls: (t.className || '').toString().slice(0, 80),
        text: (t.textContent || '').trim().slice(0, 40),
      });
    }, true);
  });

  const SECTION = '#shopify-section-template--27619508257049__product-bundle';

  // Scroll hasta la sección y esperar al IntersectionObserver
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), SECTION);
  await new Promise(r => setTimeout(r, 2000));

  const diag = await page.evaluate((sel) => {
    const s = document.querySelector(sel);
    const sidebar = s?.querySelector('.product-bundle__sidebar');
    const toggle = s?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    const r = toggle?.getBoundingClientRect();
    const cx = r ? r.x + r.width / 2 : 0, cy = r ? r.y + r.height / 2 : 0;
    const atPoint = document.elementFromPoint(cx, cy);
    // Cadena de pointer-events de toggle hacia arriba
    const chain = [];
    let el = toggle;
    while (el && chain.length < 8) {
      chain.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 60), pe: getComputedStyle(el).pointerEvents });
      el = el.parentElement;
    }
    return {
      sidebarClass: sidebar?.className,
      toggleRect: r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null,
      elementFromPoint: atPoint ? { tag: atPoint.tagName, cls: (atPoint.className || '').toString().slice(0, 80) } : null,
      chain,
      cx, cy,
    };
  }, SECTION);
  console.log(JSON.stringify(diag, null, 2));

  // Tap real en el centro del toggle
  const tTap = Date.now();
  await page.touchscreen.tap(diag.cx, diag.cy);
  await new Promise(r => setTimeout(r, 1500));
  const after = await page.evaluate((sel) => ({
    active: document.querySelector(sel)?.querySelector('.product-bundle')?.classList.contains('active'),
    clicks: window.__clicks,
  }), SECTION);
  console.log('>>> tras tap: active =', after.active, '| tiempo:', Date.now() - tTap, 'ms');
  console.log('clicks capturados:', JSON.stringify(after.clicks, null, 2));

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
