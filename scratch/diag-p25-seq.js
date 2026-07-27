const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));

  // Medir posiciones de las secciones principales
  const sections = await page.evaluate(() => {
    return [...document.querySelectorAll('.shopify-section, [id*="shopify-section"]')].slice(0, 30).map(el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        id: el.id || String(el.className).slice(0, 50),
        top: Math.round(r.top + window.scrollY), h: Math.round(r.height),
        pos: s.position, z: s.zIndex,
      };
    }).filter(x => x.h > 50);
  });
  console.log(JSON.stringify(sections, null, 0).replace(/\},\{/g, '},\n{'));

  // screenshots en puntos clave
  for (const y of [300, 700, 1100, 1500]) {
    await page.evaluate(v => window.scrollTo({ top: v, behavior: 'instant' }), y);
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({ path: `scratch/seq-${y}.png` });
  }
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
