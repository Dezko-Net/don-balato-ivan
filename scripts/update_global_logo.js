const fs = require('fs');
const path = require('path');

const NEW_LOGO_URL = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784931333115-pegada-1784931318404.png';

const OLD_LOGOS = [
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784930597805-pegada-1784930575636.png',
  'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784401902773-pegada-1784401898779.png'
];

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  OLD_LOGOS.forEach(oldLogo => {
    if (content.includes(oldLogo)) {
      const parts = content.split(oldLogo);
      count += parts.length - 1;
      content = parts.join(NEW_LOGO_URL);
    }
  });

  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Logo actualizado en ${filePath} (${count} cambios)`);
  }
}

function run() {
  console.log('🚀 Actualizando al NUEVO logo oficial en toda la tienda...');

  const files = [
    path.join(__dirname, '../src/templates/plantilla25/HomePage.tsx'),
    path.join(__dirname, '../src/components/NavbarConceptReal.tsx'),
    path.join(__dirname, '../src/components/Navbar23.tsx'),
    path.join(__dirname, '../src/templates/plantilla23/HomePage.tsx'),
    path.join(__dirname, '../public/shopify/plantilla23/body-clean.html'),
    path.join(__dirname, '../public/shopify/catalogo-original/settings.json'),
    path.join(__dirname, '../catalogo-unificado/settings.json')
  ];

  files.forEach(updateFile);

  console.log('🎉 NUEVO LOGO OFICIAL ACTUALIZADO CON ÉXITO.');
}

run();
