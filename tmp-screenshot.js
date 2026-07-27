const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const productId = process.argv[2] || '6a6307670025da009493';
  const url = `http://localhost:3002/productos/${productId}`;
  console.log('Navigating to', url);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 8000));
    await page.screenshot({ path: 'tmp-screenshot-desktop.png', fullPage: false });
    console.log('Desktop screenshot saved to tmp-screenshot-desktop.png');
    
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: 'tmp-screenshot-mobile.png', fullPage: false });
    console.log('Mobile screenshot saved to tmp-screenshot-mobile.png');
  } catch (e) {
    console.error('Error:', e.message);
  }
  await browser.close();
})();
