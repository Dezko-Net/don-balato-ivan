const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));

  const listeners = await page.evaluate(() => {
    // getEventListeners está disponible en el contexto de CDP/console; aquí usamos un truco:
    return null;
  });

  // Vía CDP: DOMDebugger.getEventListeners sobre window
  const cdp = await page.target().createCDPSession();
  const { result } = await cdp.send('Runtime.evaluate', { expression: 'window' });
  const { listeners: ls } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId, depth: 1 });
  const interesting = ls.filter(l => ['wheel', 'touchstart', 'touchmove', 'touchend', 'scroll', 'mousewheel'].includes(l.type))
    .map(l => `${l.type} passive=${l.passive} useCapture=${l.useCapture} @ ${(l.scriptId || '')}:${l.lineNumber}`);
  console.log('WINDOW listeners:');
  interesting.forEach(x => console.log(' ', x));

  // También en document
  const { result: docRes } = await cdp.send('Runtime.evaluate', { expression: 'document' });
  const { listeners: dls } = await cdp.send('DOMDebugger.getEventListeners', { objectId: docRes.objectId, depth: 1 });
  const dInteresting = dls.filter(l => ['wheel', 'touchstart', 'touchmove', 'touchend', 'scroll', 'mousewheel'].includes(l.type))
    .map(l => `${l.type} passive=${l.passive} useCapture=${l.useCapture}`);
  console.log('DOCUMENT listeners:');
  dInteresting.forEach(x => console.log(' ', x));

  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
