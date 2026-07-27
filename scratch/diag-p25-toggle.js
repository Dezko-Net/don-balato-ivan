const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));

  const info = await page.evaluate(() => {
    const t = document.querySelector('product-bundle-toggle-button');
    const bundle = document.querySelector('product-bundle');
    return {
      customElementDefined: !!customElements.get('product-bundle-toggle-button'),
      toggleCount: document.querySelectorAll('product-bundle-toggle-button').length,
      bundleCount: document.querySelectorAll('product-bundle').length,
      bundleId: bundle ? bundle.id : null,
      ariaControls: t ? t.getAttribute('aria-controls') : null,
      controlledFound: t ? !!document.getElementById(t.getAttribute('aria-controls')) : null,
      toggleHasListenerFlag: t ? t.constructor.name : null,
      bundleDefined: !!customElements.get('product-bundle'),
    };
  });
  console.log(JSON.stringify(info, null, 1));

  // Probar click y ver qué pasa con listeners manuales
  await page.evaluate(() => {
    const t = document.querySelector('product-bundle-toggle-button');
    t.addEventListener('click', () => { window.__clicked = true; });
    t.click();
  });
  const clicked = await page.evaluate(() => !!window.__clicked);
  const active = await page.evaluate(() => document.querySelector('product-bundle').classList.contains('active'));
  console.log('click llegó al botón:', clicked, '| bundle.active:', active);
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
