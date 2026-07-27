const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));

  const dump = await page.evaluate(() => {
    const el = document.elementFromPoint(195, 700);
    const chain = [];
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const s = getComputedStyle(cur);
      chain.push({
        tag: cur.tagName.toLowerCase(),
        cls: String(cur.className).slice(0, 55),
        ov: s.overflow, ta: s.touchAction, pos: s.position,
        transform: s.transform !== 'none' ? s.transform.slice(0, 40) : 'none',
        contain: s.contain, willChange: s.willChange,
        h: Math.round(cur.getBoundingClientRect().height),
      });
      cur = cur.parentElement;
    }
    return chain;
  });
  dump.forEach(d => console.log(JSON.stringify(d)));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
