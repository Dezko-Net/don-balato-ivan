const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));

  const path = await page.evaluate(() => {
    const t = document.querySelector('product-bundle-toggle-button');
    const log = [];
    // listeners en cada nivel del camino
    let cur = t;
    const nodes = [];
    while (cur) { nodes.push(cur); cur = cur.parentNode; }
    nodes.push(window);
    for (const n of nodes) {
      const name = n === window ? 'window' : (n.tagName ? n.tagName.toLowerCase() + '.' + String(n.className).slice(0, 30) : '#document');
      n.addEventListener('click', () => log.push('CAPTURE ' + name), true);
      n.addEventListener('click', () => log.push('BUBBLE ' + name), false);
    }
    t.click();
    return log;
  });
  console.log(path.join('\n'));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
