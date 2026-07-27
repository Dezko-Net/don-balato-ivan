const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));

  const health = await page.evaluate(() => new Promise(resolve => {
    let rafCount = 0;
    const t0 = performance.now();
    const loop = () => { rafCount++; if (performance.now() - t0 < 2000) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    // long tasks
    let longTasks = 0, totalLong = 0;
    const po = new PerformanceObserver(list => {
      for (const e of list.getEntries()) { if (e.duration > 50) { longTasks++; totalLong += e.duration; } }
    });
    try { po.observe({ entryTypes: ['longtask'] }); } catch {}
    // timeout drift
    const t1 = performance.now();
    setTimeout(() => {
      resolve({
        rafPerSec: Math.round(rafCount / 2),
        setTimeoutDriftMs: Math.round(performance.now() - t1 - 100),
        longTasks,
        totalLongMs: Math.round(totalLong),
      });
    }, 2100);
  }));
  console.log('Main thread health:', JSON.stringify(health));

  // CSS animations activas y elementos animados
  const anims = await page.evaluate(() => {
    const running = document.getAnimations ? document.getAnimations().length : -1;
    return { runningAnimations: running };
  });
  console.log('Animaciones corriendo:', JSON.stringify(anims));
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
