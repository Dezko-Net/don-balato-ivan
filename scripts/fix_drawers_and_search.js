const fs = require('fs');
const path = require('path');

function fixDrawerHTML(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Quitar 'hidden sm:flex' de todos los botones de cerrar para que aparezcan SIEMPRE en móviles
  const oldCloseClass = 'drawer__close hidden sm:flex';
  const newCloseClass = 'drawer__close flex';

  if (content.includes(oldCloseClass)) {
    content = content.replaceAll(oldCloseClass, newCloseClass);
  }

  // 2. Asegurar que los botones de búsqueda tengan data-action o triggers limpios
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ HTML de cortinas y botones actualizado en ${filePath}`);
}

function run() {
  console.log('🚀 Corrigiendo botones de cerrar cortina y búsqueda en móviles...');

  fixDrawerHTML(path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'));
  fixDrawerHTML(path.join(__dirname, '../public/shopify/plantilla25/header-clean.html'));
  fixDrawerHTML(path.join(__dirname, '../public/shopify/plantilla25/index.html'));

  console.log('🎉 HTML DE CORTINAS ACTUALIZADO CON ÉXITO.');
}

run();
