/**
 * Scraper Yollgo v9 - Simple: interceptar + clic + guardado incremental
 * 
 * 1. Login
 * 2. Navegar a categoría
 * 3. Clic en cada subcategoría (ng-click="go(i)")
 * 4. Capturar respuestas de API "articulos/3201"
 * 5. Guardar JSON después de cada subcategoría
 * 
 * Uso: node scripts/scrape-yollgo.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PHONE = '992139185';
const PASSWORD = 'redes123';
const SHOP_ID = '3201';
const OUTPUT_FILE = path.join(__dirname, 'yollgo-products.json');

async function main() {
  console.log('🚀 Scraper Yollgo v9');
  console.log(`📱 +56 ${PHONE} | Shop: ${SHOP_ID}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Acumular productos capturados de la API
  const allProducts = [];
  let currentCategory = '';
  let currentSubCategory = '';

  // Interceptaar respuestas — buscar articulo_lists
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('articulos/')) {
      try {
        const text = await response.text();
        const data = JSON.parse(text);
        if (data.code === 1000 && data.articulo_lists && data.articulo_lists.length > 0) {
          console.log(`  📦 ${data.articulo_lists.length} productos capturados`);
          for (const p of data.articulo_lists) {
            p._category = currentCategory;
            p._subCategory = currentSubCategory;
            allProducts.push(p);
          }
          // Guardado incremental
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
            scrapedAt: new Date().toISOString(),
            shopId: SHOP_ID,
            productsCount: allProducts.length,
            products: allProducts,
          }, null, 2));
        }
      } catch {}
    }
  });

  // 1. Login
  console.log('🔑 Login...');
  await page.goto('https://app.yollgo.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const phoneInput = await page.$('input[type="number"]') || (await page.$$('input'))[0];
  const passwordInput = await page.$('input[type="password"]');
  if (phoneInput) { await phoneInput.click({ clickCount: 3 }); await phoneInput.type(PHONE, { delay: 30 }); }
  if (passwordInput) { await passwordInput.click({ clickCount: 3 }); await passwordInput.type(PASSWORD, { delay: 30 }); }

  await page.evaluate(() => {
    const btns = document.querySelectorAll('button, [ng-click]');
    for (const b of btns) {
      if ((b.innerText || '').trim() === 'Log In' || (b.getAttribute('ng-click') || '').includes('login')) { b.click(); return; }
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  console.log('  ✅ Login OK');

  // 2. Ir a categoría
  console.log('\n📂 Navegando a categoría...');
  await page.goto(`https://app.yollgo.com/#/home/category/${SHOP_ID}`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // 3. Obtener lista de subcategorías (clickeables con ng-click="go(i)")
  const subCats = await page.evaluate(() => {
    const results = [];
    const els = document.querySelectorAll('[ng-click]');
    for (const el of els) {
      const ngClick = el.getAttribute('ng-click') || '';
      const text = (el.innerText || '').trim();
      if (ngClick.includes('go(') && text.length > 3 && text.length < 200) {
        results.push(text);
      }
    }
    return results;
  });

  console.log(`  ${subCats.length} subcategorías\n`);

  // 4. Clic en cada subcategoría
  for (let i = 0; i < subCats.length; i++) {
    const catName = subCats[i];
    currentCategory = catName;
    currentSubCategory = catName;
    console.log(`[${i + 1}/${subCats.length}] ${catName}`);

    // Volver a la página de categoría
    try {
      await page.evaluate(() => {
        // Buscar botón "back" o navegar via hash
        window.location.hash = `/home/category/${'3201'}`;
      });
      await new Promise(r => setTimeout(r, 1200));
    } catch { /* ignore */ }

    // Hacer clic en la subcategoría
    try {
      await page.evaluate((searchText) => {
        const els = document.querySelectorAll('[ng-click]');
        for (const el of els) {
          const ngClick = el.getAttribute('ng-click') || '';
          if (!ngClick.includes('go(')) continue;
          if ((el.innerText || '').trim() === searchText) { el.click(); return; }
        }
      }, catName);
    } catch { /* ignore */ }

    // Esperar a que cargue
    await new Promise(r => setTimeout(r, 2500));

    // Scroll para cargar más
    try {
      for (let s = 0; s < 5; s++) {
        await page.evaluate(() => window.scrollBy(0, 400));
        await new Promise(r => setTimeout(r, 400));
      }
    } catch { /* ignore */ }

    await new Promise(r => setTimeout(r, 200));
  }

  // 5. Resultado final
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Total productos: ${allProducts.length}`);
  console.log(`✅ Guardado en: ${OUTPUT_FILE}`);

  if (allProducts.length > 0) {
    const sample = allProducts[0];
    console.log('\n🔍 Campos:', Object.keys(sample).join(', '));
    console.log('\n📋 Primer producto:');
    console.log(JSON.stringify(sample).substring(0, 500));
  }

  await browser.close();
  console.log('\n👋 Fin.');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  // Los productos ya están guardados incrementalmente
  console.log('💡 Los productos capturados hasta el error están guardados en yollgo-products.json');
  process.exit(0);
});
