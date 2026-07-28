/* Diagnóstico plantilla25: mide cuándo los botones del theme "despiertan". */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setCacheEnabled(false); // simular hard refresh

  const t0 = Date.now();
  const ts = () => ((Date.now() - t0) / 1000).toFixed(2) + 's';

  // Instrumentación ANTES de que cargue cualquier script de la página
  await page.evaluateOnNewDocument(() => {
    window.__diag = { defines: [], errors: [], scripts: [] };
    const origDefine = customElements.define.bind(customElements);
    customElements.define = (name, ctor, opts) => {
      window.__diag.defines.push({ name, t: performance.now() });
      return origDefine(name, ctor, opts);
    };
    window.addEventListener('error', e => {
      window.__diag.errors.push(String(e.message).slice(0, 200));
    });
    window.addEventListener('unhandledrejection', e => {
      window.__diag.errors.push('promise: ' + String(e.reason).slice(0, 200));
    });
  });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warn') {
      console.log(`[console.${msg.type()} @${ts()}]`, msg.text().slice(0, 180));
    }
  });

  console.log(`[${ts()}] navegando...`);
  await page.goto('http://localhost:3100/preview/plantilla/25', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(`[${ts()}] domcontentloaded`);

  // Sondeo cada 500ms durante 12s
  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 500));
    const state = await page.evaluate(() => {
      const q = sel => !!document.querySelector(sel);
      const menuBtn = document.querySelector('[aria-controls="MenuDrawer"]');
      const detalleBtn = document.querySelector('#shopify-section-template--27619508257049__product-bundle .product-card button');
      const toggle = document.querySelector('.product-bundle__toggle, product-bundle-toggle-button');
      const elFromPoint = menuBtn
        ? (() => { const r = menuBtn.getBoundingClientRect(); const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return el ? (el.tagName + '.' + String(el.className).slice(0, 40)) : 'null'; })()
        : 'n/a';
      return {
        menuDrawerDefined: !!customElements.get('menu-drawer'),
        themeDefineCount: window.__diag.defines.length,
        menuBtnExists: !!menuBtn,
        menuBtnClickableFromPoint: elFromPoint,
        detalleBtnExists: !!detalleBtn,
        toggleExists: !!toggle,
        toggleTag: toggle ? toggle.tagName : 'n/a',
        preEnhance: q('.yaxsell-pre-enhance'),
        errors: window.__diag.errors.slice(0, 4),
        firstDefines: window.__diag.defines.slice(0, 3).map(d => `${d.name}@${(d.t / 1000).toFixed(2)}s`),
        lastDefine: window.__diag.defines.length ? window.__diag.defines[window.__diag.defines.length - 1].name + '@' + (window.__diag.defines[window.__diag.defines.length - 1].t / 1000).toFixed(2) + 's' : 'n/a',
      };
    });
    console.log(`[${ts()}]`, JSON.stringify(state));
    if (state.menuDrawerDefined && i > 2) { /* sigue sondeando para ver el resto */ }
  }

  // Prueba de click real en el botón de menú
  const clickResult = await page.evaluate(() => {
    const menuBtn = document.querySelector('[aria-controls="MenuDrawer"]');
    if (!menuBtn) return 'no menuBtn';
    menuBtn.click();
    return new Promise(res => setTimeout(() => {
      const drawer = document.querySelector('#MenuDrawer');
      res('drawer open=' + (drawer?.hasAttribute('open')) + ' display=' + (drawer ? getComputedStyle(drawer).display : 'n/a'));
    }, 800));
  });
  console.log(`[${ts()}] click menu →`, clickResult);

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
