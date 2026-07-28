/* Debug 2: medir cuándo se vuelve visible/clicable la sección Pack Emprendedor
   y probar taps REALES (no dispatchEvent) sobre toggle y "Ver detalle". */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36');

  page.on('response', res => {
    const u = res.url();
    if (u.includes('/api/public-data') || u.includes('body-clean.html')) {
      console.log(`[net] ${res.status()} ${u.replace('http://localhost:3000', '')} @ ${Date.now() - t0}ms`);
    }
  });
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 400)));

  const t0 = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('domcontentloaded @', Date.now() - t0, 'ms');

  // Marca de tiempo: html inyectado
  await page.waitForFunction(() => document.querySelector('.tpl25-shopify-root')?.dataset.htmlSet, { timeout: 40000 });
  console.log('HTML injected @', Date.now() - t0, 'ms');

  // Marca de tiempo: yaxsell-pre-enhance removido (sección visible)
  await page.waitForFunction(() => {
    const r = document.querySelector('.tpl25-shopify-root');
    return r && !r.classList.contains('yaxsell-pre-enhance');
  }, { timeout: 60000 });
  console.log('pre-enhance REMOVED (sección visible) @', Date.now() - t0, 'ms');

  const SECTION = '#shopify-section-template--27619508257049__product-bundle';

  // Estado de visibilidad real del toggle
  const vis = await page.evaluate((sel) => {
    const s = document.querySelector(sel);
    const toggle = s?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    const r = toggle?.getBoundingClientRect();
    const cs = toggle ? getComputedStyle(toggle) : null;
    const sidebar = s?.querySelector('.product-bundle__sidebar');
    const sbcs = sidebar ? getComputedStyle(sidebar) : null;
    return {
      toggleRect: r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null,
      toggleVisibility: cs?.visibility, togglePointerEvents: cs?.pointerEvents,
      sidebarTransform: sbcs?.transform?.slice(0, 60), sidebarClass: sidebar?.className,
    };
  }, SECTION);
  console.log('toggle state:', JSON.stringify(vis, null, 2));

  // Hacer scroll hasta la sección para que el sidebar sticky aparezca
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: 'center' });
  }, SECTION);
  await new Promise(r => setTimeout(r, 1200));

  // ── TAP REAL en el toggle de la cortina negra ──
  const toggleHandle = await page.$(SECTION + ' product-bundle-toggle-button');
  const box = toggleHandle ? await toggleHandle.boundingBox() : null;
  console.log('toggle boundingBox:', box);
  if (box) {
    const tTap = Date.now();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    let activeAt = null;
    for (let i = 0; i < 50; i++) {
      const active = await page.evaluate((sel) =>
        document.querySelector(sel)?.querySelector('.product-bundle')?.classList.contains('active'), SECTION);
      if (active) { activeAt = Date.now() - tTap; break; }
      await new Promise(r => setTimeout(r, 100));
    }
    console.log('>>> TAP toggle → cortina .active en:', activeAt, 'ms');
  } else {
    console.log('>>> toggle SIN boundingBox (no clicable / fuera de viewport)');
  }

  // ── TAP REAL en "Ver detalle" de la primera tarjeta visible ──
  const btnInfo = await page.evaluate((sel) => {
    const cards = Array.from(document.querySelector(sel).querySelectorAll('.product-card'))
      .filter(c => getComputedStyle(c).display !== 'none');
    const btn = cards[0]?.querySelector('.product-form__submit');
    if (!btn) return null;
    btn.scrollIntoView({ block: 'center' });
    const r = btn.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, SECTION);
  console.log('ver-detalle coords:', btnInfo);
  if (btnInfo) {
    await new Promise(r => setTimeout(r, 500));
    const tTap2 = Date.now();
    await page.touchscreen.tap(btnInfo.x, btnInfo.y);
    let drawerAt = null;
    for (let i = 0; i < 60; i++) {
      const has = await page.evaluate(() => !!document.getElementById('yaxsell-product-detail-drawer'));
      if (has) { drawerAt = Date.now() - tTap2; break; }
      await new Promise(r => setTimeout(r, 100));
    }
    console.log('>>> TAP ver-detalle → drawer abierto en:', drawerAt, 'ms');
  }

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
