const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  const productId = process.argv[2] || '6a6307670025da009493';
  const url = `http://localhost:3002/productos/${productId}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const info = await page.evaluate(() => {
    const root = document.querySelector('.tpl5-shopify-root');
    const bar = document.querySelector('#yaxsell-thumbs-bar');
    const thumbs = document.querySelector('.media-gallery__carousel-thumbnails');
    const gallery = document.querySelector('.media-gallery__carousel') || document.querySelector('media-gallery') || document.querySelector('.media-gallery');
    return {
      rootExists: !!root,
      barExists: !!bar,
      barParent: bar ? bar.parentElement?.className : null,
      barStyle: bar ? bar.getAttribute('style') : null,
      barChildren: bar ? bar.children.length : 0,
      thumbsExists: !!thumbs,
      thumbsDisplay: thumbs ? getComputedStyle(thumbs).display : null,
      galleryExists: !!gallery,
      galleryRect: gallery ? JSON.stringify(gallery.getBoundingClientRect()) : null
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
