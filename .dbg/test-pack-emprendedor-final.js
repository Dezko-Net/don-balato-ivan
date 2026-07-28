/* Validación final: tap real en toggle + "Ver detalle" apenas la sección es visible. */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36');
  page.on('pageerror', e => console.log('[pageerror]', (e.stack || String(e)).slice(0, 300)));

  const t0 = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => {
    const r = document.querySelector('.tpl25-shopify-root');
    return r && r.dataset.htmlSet && !r.classList.contains('yaxsell-pre-enhance');
  }, { timeout: 60000 });
  console.log('sección visible @', Date.now() - t0, 'ms');

  const SECTION = '#shopify-section-template--27619508257049__product-bundle';
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), SECTION);
  await new Promise(r => setTimeout(r, 2000));

  // ── 1. TAP en toggle de la cortina negra ──
  let p = await page.evaluate((sel) => {
    const t = document.querySelector(sel)?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    const r = t?.getBoundingClientRect();
    return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  }, SECTION);
  let tTap = Date.now();
  await page.touchscreen.tap(p.x, p.y);
  let activeAt = null;
  for (let i = 0; i < 50; i++) {
    const a = await page.evaluate((sel) => document.querySelector(sel)?.querySelector('.product-bundle')?.classList.contains('active'), SECTION);
    if (a) { activeAt = Date.now() - tTap; break; }
    await new Promise(r => setTimeout(r, 50));
  }
  console.log('>>> TAP toggle → cortina abierta en:', activeAt, 'ms');

  // Verificar que el sidebar tiene productos reales listados
  const items = await page.evaluate((sel) =>
    document.querySelector(sel)?.querySelectorAll('.product-bundle__body .horizontal-product').length, SECTION);
  console.log('    productos en la cortina:', items);

  // Cerrar cortina (re-midiendo: el toggle se movió al expandirse)
  p = await page.evaluate((sel) => {
    const t = document.querySelector(sel)?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    const r = t?.getBoundingClientRect();
    return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  }, SECTION);
  await page.touchscreen.tap(p.x, p.y);
  await new Promise(r => setTimeout(r, 600));
  const stillActive = await page.evaluate((sel) => document.querySelector(sel)?.querySelector('.product-bundle')?.classList.contains('active'), SECTION);
  console.log('    cortina cerrada:', !stillActive);

  // ── 2. TAP en "Ver detalle" de la primera tarjeta visible ──
  const bp = await page.evaluate((sel) => {
    const cards = Array.from(document.querySelector(sel).querySelectorAll('.product-card'))
      .filter(c => getComputedStyle(c).display !== 'none');
    const btn = cards[0]?.querySelector('.product-form__submit');
    if (!btn) return null;
    btn.scrollIntoView({ block: 'center' });
    const r = btn.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, SECTION);
  await new Promise(r => setTimeout(r, 800));
  // Re-medir justo antes del tap (la página sigue cargando imágenes → layout shift)
  const bp2 = await page.evaluate((sel) => {
    const cards = Array.from(document.querySelector(sel).querySelectorAll('.product-card'))
      .filter(c => getComputedStyle(c).display !== 'none');
    const btn = cards[0]?.querySelector('.product-form__submit');
    const r = btn?.getBoundingClientRect();
    return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  }, SECTION);
  tTap = Date.now();
  await page.touchscreen.tap(bp2.x, bp2.y);
  let drawerAt = null;
  for (let i = 0; i < 60; i++) {
    const has = await page.evaluate(() => !!document.getElementById('yaxsell-product-detail-drawer'));
    if (has) { drawerAt = Date.now() - tTap; break; }
    await new Promise(r => setTimeout(r, 50));
  }
  console.log('>>> TAP "Ver detalle" → drawer abierto en:', drawerAt, 'ms');

  const drawerInfo = await page.evaluate(() => {
    const d = document.getElementById('yaxsell-product-detail-drawer');
    return d ? { visible: getComputedStyle(d).visibility, title: d.textContent?.trim().slice(0, 80) } : null;
  });
  console.log('    drawer:', JSON.stringify(drawerInfo));

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
