const fs = require('fs');
const path = require('path');

function reduceOverlayInFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Reducir la opacidad del overlay oscuro de 0.2/0.3/0.4 a 0.05
  content = content.replace(/--overlay-opacity:\s*0\.[1-9];/g, '--overlay-opacity: 0.05;');
  content = content.replace(/--overlay-opacity:\s*0\.2;/g, '--overlay-opacity: 0.05;');
  content = content.replace(/--overlay-opacity:\s*0\.3;/g, '--overlay-opacity: 0.05;');
  content = content.replace(/--overlay-opacity:\s*0\.4;/g, '--overlay-opacity: 0.05;');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Overlay oscuro reducido en ${filePath}`);
}

function run() {
  console.log('🚀 Reduciendo la capa y blur oscuro en portadas y banners...');

  reduceOverlayInFile(path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'));
  reduceOverlayInFile(path.join(__dirname, '../public/shopify/plantilla25/index.html'));

  console.log('🎉 OVERLAY Y BLUR OSCURO REDUCIDO CON ÉXITO.');
}

run();
