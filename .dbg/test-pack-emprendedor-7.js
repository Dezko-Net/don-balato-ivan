/* Debug 7: ¿qué recibe el tap en "Ver detalle"? */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36');
  page.on('pageerror', e => console.log('[pageerror]', (e.stack || String(e)).slice(0, 400)));

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => {
    const r = document.querySelector('.tpl25-shopify-root');
    return r && r.dataset.htmlSet && !r.classList.contains('yaxsell-pre-enhance');
  }, { timeout: 60000 });

  await page.evaluate(() => {
    window.__clicks = [];
    document.addEventListener('click', (e) => {
      window.__clicks.push({ tag: e.target.tagName, cls: (e.target.className || '').toString().slice(0, 60) });
    }, true);
  });

  const SECTION = '#shopify-section-template--27619508257049__product-bundle';
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), SECTION);
  await new Promise(r => setTimeout(r, 2000));

  const bp = await page.evaluate((sel) => {
    const cards = Array.from(document.querySelector(sel).querySelectorAll('.product-card'))
      .filter(c => getComputedStyle(c).display !== 'none');
    const btn = cards[0]?.querySelector('.product-form__submit');
    if (!btn) return null;
    btn.scrollIntoView({ block: 'center' });
    const r = btn.getBoundingClientRect();
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    const at = document.elementFromPoint(cx, cy);
    return {
      x: cx, y: cy,
      btnRect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      btnType: btn.getAttribute('type'),
      cardHasId: !!cards[0].dataset.comboProductId,
      atPoint: at ? { tag: at.tagName, cls: (at.className || '').toString().slice(0, 70) } : null,
      atPointIsInsideBtn: btn.contains(at),
    };
  }, SECTION);
  console.log(JSON.stringify(bp, null, 2));

  await new Promise(r => setTimeout(r, 800));
  // Re-verificar justo antes del tap (layout shift)
  const bp2 = await page.evaluate((sel) => {
    const cards = Array.from(document.querySelector(sel).querySelectorAll('.product-card'))
      .filter(c => getComputedStyle(c).display !== 'none');
    const btn = cards[0]?.querySelector('.product-form__submit');
    const r = btn?.getBoundingClientRect();
    if (!r) return null;
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    const at = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, atPoint: at?.tagName, inside: btn.contains(at) };
  }, SECTION);
  console.log('justo antes del tap:', JSON.stringify(bp2));

  await page.touchscreen.tap(bp2.x, bp2.y);
  await new Promise(r => setTimeout(r, 1500));
  const res = await page.evaluate(() => ({
    drawer: !!document.getElementById('yaxsell-product-detail-drawer'),
    loading: !!document.getElementById('yaxsell-combo-detail-loading'),
    clicks: window.__clicks,
  }));
  console.log(JSON.stringify(res, null, 2));

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
