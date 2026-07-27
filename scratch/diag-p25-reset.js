const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));

  await page.evaluate(() => {
    window.__log = { scrollEvents: 0, scrollToCalls: [], lastY: [] };
    window.addEventListener('scroll', () => {
      window.__log.scrollEvents++;
      window.__log.lastY.push(Math.round(window.scrollY));
    }, { passive: true });
    const orig = window.scrollTo.bind(window);
    window.scrollTo = (...a) => {
      window.__log.scrollToCalls.push(JSON.stringify(a).slice(0, 80) + ' :: ' + new Error().stack.split('\n')[2]?.trim().slice(0, 120));
      return orig(...a);
    };
  });

  const cdp = await page.target().createCDPSession();
  await cdp.send('Input.synthesizeScrollGesture', { x: 195, y: 400, yDistance: -600, gestureSourceType: 'touch', speed: 800 });
  await new Promise(r => setTimeout(r, 1500));

  const res = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    scrollEvents: window.__log.scrollEvents,
    lastY: window.__log.lastY.slice(-8),
    scrollToCalls: window.__log.scrollToCalls.slice(0, 6),
    scrollingElement: document.scrollingElement && document.scrollingElement.tagName,
    docH: document.documentElement.scrollHeight,
  }));
  console.log(JSON.stringify(res, null, 1));

  // También probar wheel (mouse)
  await page.mouse.move(195, 400);
  await page.mouse.wheel({ deltaY: 500 });
  await new Promise(r => setTimeout(r, 800));
  console.log('tras wheel:', await page.evaluate(() => Math.round(window.scrollY)));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
