const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');

  const loaded = [];
  page.on('response', r => { if (r.url().includes('flickity-touch-fix')) loaded.push(r.url() + ' -> ' + r.status()); });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.slice(0, 200)));

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));
  console.log('flickity-touch-fix:', loaded);

  const info = await page.evaluate(() => {
    const probe = (x, y, label) => {
      const chain = [];
      const els = document.elementsFromPoint(x, y);
      for (const el of els.slice(0, 8)) {
        const s = getComputedStyle(el);
        chain.push({
          tag: el.tagName.toLowerCase(),
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60),
          touchAction: s.touchAction,
          pointerEvents: s.pointerEvents,
        });
      }
      return { label, chain };
    };
    return [
      probe(195, 24, 'announcement'),
      probe(195, 81, 'header'),
      probe(195, 276, 'hero'),
      probe(195, 500, 'hero-bajo'),
    ];
  });
  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
