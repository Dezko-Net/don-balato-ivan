/* Debug 6: identificar EXACTAMENTE quién llama stopImmediatePropagation en clicks. */
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
    window.__log = [];
    window.__nid = 0;
    const origSIP = Event.prototype.stopImmediatePropagation;
    Event.prototype.stopImmediatePropagation = function () {
      if (this.type === 'click') {
        if (this.__dbgId == null) { this.__dbgId = ++window.__nid; }
        window.__log.push({
          evId: this.__dbgId,
          trusted: this.isTrusted,
          ts: Math.round(this.timeStamp),
          stack: new Error().stack?.split('\n').slice(2, 6).join('\n').replace(/webpack-internal:\/\/\/\(app-pages-browser\)\/\.\//g, '').slice(0, 700),
        });
      }
      return origSIP.apply(this, arguments);
    };
  });

  const SECTION = '#shopify-section-template--27619508257049__product-bundle';
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), SECTION);
  await new Promise(r => setTimeout(r, 2500));

  const p = await page.evaluate((sel) => {
    const toggle = document.querySelector(sel)?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    const r = toggle?.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, SECTION);

  await page.evaluate(() => { window.__log = []; window.__nid = 0; });
  await page.touchscreen.tap(p.x, p.y);
  await new Promise(r => setTimeout(r, 1500));
  const out = await page.evaluate((sel) => ({
    active: document.querySelector(sel)?.querySelector('.product-bundle')?.classList.contains('active'),
    log: window.__log,
  }), SECTION);
  console.log('active:', out.active);
  out.log.forEach((l, i) => console.log(`\n── SIP #${i} (evento ${l.evId}, trusted=${l.trusted}, ts=${l.ts}) ──\n${l.stack}`));

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
