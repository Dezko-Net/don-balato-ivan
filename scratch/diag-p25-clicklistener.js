const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=420,900'] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 7000));
  const cdp = await page.target().createCDPSession();

  const { result } = await cdp.send('Runtime.evaluate', { expression: 'window' });
  const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId, depth: 1 });
  const clicks = listeners.filter(l => l.type === 'click');
  for (const l of clicks) {
    // resolver URL del script
    let url = '?';
    try {
      const { scriptSource, ...meta } = await cdp.send('Debugger.getScriptSource', { scriptId: l.scriptId }).catch(() => ({ scriptSource: '' }));
      url = `scriptId=${l.scriptId} line=${l.lineNumber}`;
    } catch {}
    console.log(`click passive=${l.passive} capture=${l.useCapture} once=${l.once} → scriptId ${l.scriptId}:${l.lineNumber}`);
  }
  // Mapear scriptIds a URLs
  const scripts = new Map();
  cdp.on('Debugger.scriptParsed', () => {});
  await cdp.send('Debugger.enable');
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
