const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));
  const cdp = await page.target().createCDPSession();

  async function touchDrag(x, y, dy) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + (dy * i) / steps, id: 1 }] });
      await new Promise(r => setTimeout(r, 20));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await new Promise(r => setTimeout(r, 700));
  }

  // 1. Estado del bundle restaurado
  const bundleState = await page.evaluate(() => {
    const wrap = document.querySelector('.product-bundle-wrapper > .lg\\:grow-0');
    const sidebar = document.querySelector('.product-bundle__sidebar');
    const body = document.querySelector('.product-bundle__body');
    const bundle = document.querySelector('product-bundle');
    return {
      wrapPos: wrap ? getComputedStyle(wrap).position : null,
      wrapMarginGrow: (() => { const g = document.querySelector('.product-bundle-wrapper > .lg\\:grow'); return g ? getComputedStyle(g).marginBlockEnd : null; })(),
      sidebarMaxH: sidebar ? getComputedStyle(sidebar).maxHeight : null,
      bodyDisplay: body ? getComputedStyle(body).display : null,
      bundleActive: bundle ? bundle.classList.contains('active') : null,
    };
  });
  console.log('bundle state:', JSON.stringify(bundleState));

  // 2. Scroll hasta la zona del bundle con gestos (como un usuario)
  await page.evaluate(() => window.scrollTo(0, 3400));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'scratch/restore-bundle-collapsed.png' });

  // 3. Tap en el toggle para expandir (animación)
  const toggle = await page.$('product-bundle-toggle-button');
  if (toggle) { await toggle.tap(); await new Promise(r => setTimeout(r, 900)); }
  const expanded = await page.evaluate(() => {
    const bundle = document.querySelector('product-bundle');
    const body = document.querySelector('.product-bundle__body');
    return { active: bundle.classList.contains('active'), bodyDisplay: getComputedStyle(body).display };
  });
  console.log('tras tap toggle:', JSON.stringify(expanded));
  await page.screenshot({ path: 'scratch/restore-bundle-expanded.png' });

  // 4. Journey completo: 12 gestos desde arriba
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  let stuck = 0;
  for (let i = 0; i < 12; i++) {
    const before = await page.evaluate(() => window.scrollY);
    await touchDrag(195, 420, -420);
    const after = await page.evaluate(() => window.scrollY);
    if (Math.round(after - before) < 50) { stuck++; console.log(`gesto ${i + 1}: TRABADO en y=${Math.round(after)}`); }
  }
  console.log('finalY:', await page.evaluate(() => Math.round(window.scrollY)), stuck === 0 ? '✅ FLUIDO' : `⚠️ ${stuck} trabados`);
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
