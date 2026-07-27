const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000)); // esperar a que inyecte HTML + JS

  const report = await page.evaluate(() => {
    const out = { url: location.href, scrollables: [], htmlBody: {}, docHeight: 0, winH: window.innerHeight };
    out.docHeight = document.documentElement.scrollHeight;
    const cs = (el, props) => { const s = getComputedStyle(el); const o = {}; props.forEach(p => o[p] = s[p]); return o; };
    out.htmlBody = {
      html: cs(document.documentElement, ['overflow', 'overflowY', 'scrollSnapType', 'height', 'touchAction']),
      body: cs(document.body, ['overflow', 'overflowY', 'scrollSnapType', 'height', 'touchAction', 'position']),
    };
    const all = document.querySelectorAll('body *');
    for (const el of all) {
      const s = getComputedStyle(el);
      const oy = s.overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 20 && el.clientHeight > 40) {
        const r = el.getBoundingClientRect();
        out.scrollables.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 90) : '',
          id: el.id || '',
          clientH: el.clientHeight, scrollH: el.scrollHeight,
          snap: s.scrollSnapType, pos: s.position,
          top: Math.round(r.top), visible: r.bottom > 0 && r.top < window.innerHeight,
        });
      }
    }
    return out;
  });

  console.log(JSON.stringify(report, null, 1).slice(0, 6000));
  await page.screenshot({ path: 'scratch/p25-top.png' });
  // screenshot después de scrollear un poco
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scratch/p25-mid.png' });
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
