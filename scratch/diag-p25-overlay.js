const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));

  const info = await page.evaluate(() => {
    const overlays = [...document.querySelectorAll('overlay-element, .overlay, newsletter-modal, [class*="modal"]')]
      .slice(0, 12).map(el => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 70), id: el.id,
          visibility: s.visibility, opacity: s.opacity, pointerEvents: s.pointerEvents,
          display: s.display, zIndex: s.zIndex, rect: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        };
      }).filter(o => o.display !== 'none');
    return {
      htmlClass: document.documentElement.className,
      bodyClass: document.body.className,
      overlays,
    };
  });
  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
