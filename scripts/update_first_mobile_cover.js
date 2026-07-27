const fs = require('fs');
const path = require('path');

const NEW_MOBILE_COVER = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784932038771-pegada-1784932036366.png';

const OLD_MOBILE_COVERS = [
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784931626518-pegada-1784931599359.png',
  '//concept-theme-tech.myshopify.com/cdn/shop/files/home-slider-01-mob.webp'
];

function updateFirstMobileCover(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  OLD_MOBILE_COVERS.forEach(oldCover => {
    if (content.includes(oldCover)) {
      const parts = content.split(oldCover);
      count += parts.length - 1;
      content = parts.join(NEW_MOBILE_COVER);
    }
  });

  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Portada móvil actualizada en ${filePath} (${count} cambios)`);
  }
}

function run() {
  console.log('🚀 Actualizando a la NUEVA primera imagen de portada móvil...');

  updateFirstMobileCover(path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'));
  updateFirstMobileCover(path.join(__dirname, '../public/shopify/plantilla25/index.html'));

  console.log('🎉 PORTADA MÓVIL ACTUALIZADA CON ÉXITO.');
}

run();
