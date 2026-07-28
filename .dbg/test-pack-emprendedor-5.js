/* Debug 5: ¿dónde muere el click? window vs document vs root, y isTrusted. */
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

  // Instrumentar ANTES de que theme.js registre nada más (ya cargó, pero registramos en window capture que va primero)
  await page.evaluate(() => {
    window.__log = [];
    const rec = (where) => (e) => {
      const t = e.target;
      window.__log.push({
        where, type: e.type, trusted: e.isTrusted,
        tag: t?.tagName, cls: (t?.className || '').toString().slice(0, 40),
      });
    };
    window.addEventListener('click', rec('window-capture'), true);
    window.addEventListener('click', rec('window-bubble'), false);
    document.addEventListener('click', rec('document-capture'), true);
    document.addEventListener('click', rec('document-bubble'), false);
    // También espiar stopImmediatePropagation para pillar al culpable
    const origSIP = Event.prototype.stopImmediatePropagation;
    Event.prototype.stopImmediatePropagation = function () {
      if (this.type === 'click') {
        window.__log.push({ where: 'SIP-LLAMADO', type: 'click', stack: new Error().stack?.split('\n').slice(1, 4).join(' | ').slice(0, 300) });
      }
      return origSIP.apply(this, arguments);
    };
    const origSP = Event.prototype.stopPropagation;
    Event.prototype.stopPropagation = function () {
      if (this.type === 'click') {
        window.__log.push({ where: 'SP-LLAMADO', type: 'click', stack: new Error().stack?.split('\n').slice(1, 4).join(' | ').slice(0, 300) });
      }
      return origSP.apply(this, arguments);
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
  console.log('tap en:', p);

  await page.evaluate(() => { window.__log = []; });
  await page.touchscreen.tap(p.x, p.y);
  await new Promise(r => setTimeout(r, 1500));
  const log = await page.evaluate(() => window.__log);
  console.log(JSON.stringify(log, null, 1));

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
