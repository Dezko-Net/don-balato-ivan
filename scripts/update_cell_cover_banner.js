const fs = require('fs');
const path = require('path');

const TARGET_IMAGE_URL = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784934688773-pegada-1784934685159.png';

const PREVIOUS_MOBILE_LOGOS = [
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784933165577-pegada-1784933164071.png',
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784932950143-pegada-1784932923569.png',
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784932618396-pegada-1784932589217.png',
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784932038771-pegada-1784932036366.png',
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784931626518-pegada-1784931599359.png',
  '//concept-theme-tech.myshopify.com/cdn/shop/files/home-slider-01-mob.webp'
];

function updateCellCover(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  PREVIOUS_MOBILE_LOGOS.forEach(oldUrl => {
    if (content.includes(oldUrl)) {
      const parts = content.split(oldUrl);
      count += parts.length - 1;
      content = parts.join(TARGET_IMAGE_URL);
    }
  });

  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Portada de móvil actualizada a la nueva versión en ${filePath} (${count} cambios)`);
  }
}

function run() {
  console.log('🚀 Actualizando a la NUEVA imagen de portada MÓVIL...');

  updateCellCover(path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'));
  updateCellCover(path.join(__dirname, '../public/shopify/plantilla25/index.html'));

  console.log('🎉 PORTADA MÓVIL ACTUALIZADA CON ÉXITO.');
}

run();
