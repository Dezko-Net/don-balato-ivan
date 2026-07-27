const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));

  const anims = await page.evaluate(() => {
    const seen = new Map();
    for (const a of document.getAnimations()) {
      const el = a.effect && a.effect.target;
      const name = a.animationName || (a.effect && a.effect.getKeyframes && 'keyframes-JS') || 'unknown';
      const key = `${name} @ ${el ? el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 55) : 'null'}`;
      const props = a.effect && a.effect.getKeyframes
        ? [...new Set(a.effect.getKeyframes().flatMap(k => Object.keys(k)))].filter(p => !['offset', 'easing', 'composite', 'computedOffset'].includes(p)).join(',')
        : '';
      if (!seen.has(key)) seen.set(key, { count: 0, props, playState: a.playState });
      seen.get(key).count++;
    }
    return [...seen.entries()].map(([k, v]) => `${k}  ×${v.count} [${v.props}] (${v.playState})`);
  });
  anims.forEach(a => console.log(a));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
