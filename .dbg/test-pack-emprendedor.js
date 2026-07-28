/* Debug: probar toggle cortina negra + botón "Ver detalle" del Pack Emprendedor
   Mide cuándo responden tras cargar la página. */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--window-size=390,844'],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36');
  page.on('console', m => {
    const t = m.text();
    if (/error|Error|combo|bundle|tpl25/i.test(t)) console.log('[console]', t.slice(0, 300));
  });
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 500)));

  const t0 = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('domcontentloaded at', Date.now() - t0, 'ms');

  const SECTION = '#shopify-section-template--27619508257049__product-bundle';

  // Esperar a que la sección exista en el DOM
  await page.waitForSelector(SECTION, { timeout: 30000 });
  console.log('section in DOM at', Date.now() - t0, 'ms');

  // Estado inicial
  const info0 = await page.evaluate((sel) => {
    const s = document.querySelector(sel);
    const toggle = s?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    const btn = s?.querySelector('.product-card .product-form__submit');
    const bundle = s?.querySelector('.product-bundle');
    return {
      sectionVisible: s ? getComputedStyle(s).visibility : 'n/a',
      sectionDisplay: s ? getComputedStyle(s).display : 'n/a',
      toggleTag: toggle?.tagName,
      toggleText: toggle?.textContent?.trim().slice(0, 60),
      btnText: btn?.textContent?.trim().slice(0, 60),
      bundleActive: bundle?.classList.contains('active'),
      preEnhance: document.querySelector('.tpl25-shopify-root')?.classList.contains('yaxsell-pre-enhance'),
    };
  }, SECTION);
  console.log('initial state:', JSON.stringify(info0, null, 2));

  // Click en el toggle de la cortina negra
  const tClick = Date.now();
  await page.evaluate((sel) => {
    const s = document.querySelector(sel);
    const toggle = s?.querySelector('product-bundle-toggle-button, .product-bundle__toggle');
    toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }, SECTION);

  // Verificar si .active se aplicó y en cuánto tiempo
  let activeAt = null;
  for (let i = 0; i < 40; i++) {
    const active = await page.evaluate((sel) => {
      const b = document.querySelector(sel)?.querySelector('.product-bundle');
      return b?.classList.contains('active');
    }, SECTION);
    if (active) { activeAt = Date.now() - tClick; break; }
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('toggle .active applied after:', activeAt, 'ms');

  // Click en "Ver detalle" de la primera tarjeta
  const tClick2 = Date.now();
  await page.evaluate((sel) => {
    const s = document.querySelector(sel);
    const btn = s?.querySelector('.product-card .product-form__submit');
    btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }, SECTION);

  let drawerAt = null;
  for (let i = 0; i < 60; i++) {
    const has = await page.evaluate(() => !!document.getElementById('yaxsell-product-detail-drawer'));
    if (has) { drawerAt = Date.now() - tClick2; break; }
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('drawer opened after:', drawerAt, 'ms');

  const loading = await page.evaluate(() => !!document.getElementById('yaxsell-combo-detail-loading'));
  console.log('combo-detail-loading visible:', loading);

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
