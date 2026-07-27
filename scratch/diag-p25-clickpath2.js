const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));

  const res = await page.evaluate(() => {
    const t = document.querySelector('product-bundle-toggle-button');
    const log = [];
    ['click', 'pointerdown', 'mousedown'].forEach(type => {
      const probe = [];
      let cur = t;
      const nodes = [];
      while (cur) { nodes.push(cur); cur = cur.parentNode; }
      nodes.push(window);
      nodes.forEach(n => {
        const name = n === window ? 'window' : (n.tagName ? n.tagName.toLowerCase() : '#doc');
        n.addEventListener(type, () => probe.push('C:' + name), true);
      });
      t.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
      log.push(type + ' → ' + probe.slice(0, 6).join(' | '));
      // limpiar listeners añadidos? (solo sondas de esta sesión, no afecta)
    });
    // probar también con pointer-events habilitado
    const pe = getComputedStyle(t).pointerEvents;
    const peParent = getComputedStyle(t.closest('product-bundle')).pointerEvents;
    const peSticky = getComputedStyle(t.closest('sticky-element')).pointerEvents;
    log.push(`pointerEvents: toggle=${pe} bundle=${peParent} sticky=${peSticky}`);
    return log;
  });
  res.forEach(r => console.log(r));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
