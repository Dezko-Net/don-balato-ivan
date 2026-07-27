const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));

  // snapshot scrollTop de todo antes
  const snap = () => page.evaluate(() => {
    const m = new Map();
    document.querySelectorAll('body *').forEach((el, i) => {
      if (el.scrollTop > 0 || el.scrollLeft > 0) m.set(el.tagName + '.' + String(el.className).slice(0, 60) + '#' + el.id, [el.scrollTop, el.scrollLeft]);
    });
    return [...m.entries()];
  });

  const before = await snap();
  const cdp = await page.target().createCDPSession();
  // gesto de scroll largo desde el centro
  await cdp.send('Input.synthesizeScrollGesture', { x: 195, y: 500, yDistance: -1200, gestureSourceType: 'touch', speed: 600 });
  await new Promise(r => setTimeout(r, 1200));
  const after = await snap();
  const winY = await page.evaluate(() => window.scrollY);

  console.log('window.scrollY:', winY);
  console.log('Elementos scrolleados ANTES:', JSON.stringify(before));
  console.log('Elementos scrolleados DESPUÉS:', JSON.stringify(after, null, 1));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
