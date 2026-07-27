const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));
  const cdp = await page.target().createCDPSession();

  const wheelTest = async (label) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));
    await page.mouse.move(195, 400);
    let total = 0;
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel({ deltaY: 600 });
      await new Promise(r => setTimeout(r, 700));
    }
    total = await page.evaluate(() => Math.round(window.scrollY));
    console.log(`${label}: scrollY tras 3x wheel(600) = ${total} (esperado ~1800)`);
    await page.evaluate(() => window.scrollTo(0, 0));
    return total;
  };

  await wheelTest('baseline');

  // 1. Matar TODAS las animaciones/transiciones CSS
  await page.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
    st.id = 'kill-anim';
    document.head.appendChild(st);
  });
  await wheelTest('sin animaciones CSS');

  // 2. Matar todos los intervalos/timeouts (incluye el setInterval de 400ms y los del tema)
  await page.evaluate(() => {
    const maxId = window.setTimeout(() => {}, 0);
    for (let i = 0; i <= maxId; i++) { window.clearTimeout(i); window.clearInterval(i); }
  });
  await wheelTest('sin animaciones + sin timers');

  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
