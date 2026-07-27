const fs = require('fs');
const path = require('path');

function updateTopbarColor(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Reemplazar variables CSS de announcement-bar a amarillo vibrante
  const oldCSS = `#shopify-section-sections--27201777467673__announcement-bar {
      --gradient-background: #1f1f1f;
      --color-background: 31 31 31;
      --color-foreground: 250 250 250;
      --color-highlight: 255 221 191;
    }`;

  const newCSS = `#shopify-section-sections--27201777467673__announcement-bar {
      --gradient-background: #facc15;
      --color-background: 250 204 21;
      --color-foreground: 17 24 39;
      --color-highlight: 245 158 11;
      background-color: #facc15 !important;
      color: #111827 !important;
    }`;

  if (content.includes('#shopify-section-sections--27201777467673__announcement-bar')) {
    content = content.replace(
      /--gradient-background:\s*#1f1f1f;/g,
      '--gradient-background: #facc15;'
    );
    content = content.replace(
      /--color-background:\s*31 31 31;/g,
      '--color-background: 250 204 21;'
    );
    content = content.replace(
      /--color-foreground:\s*250 250 250;/g,
      '--color-foreground: 17 24 39;'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Barra de anuncios cambiada a amarillo en ${filePath}`);
  }
}

function run() {
  console.log('🚀 Cambiando la barra superior de anuncios a color AMARILLO...');

  updateTopbarColor(path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'));
  updateTopbarColor(path.join(__dirname, '../public/shopify/plantilla25/index.html'));
  updateTopbarColor(path.join(__dirname, '../public/shopify/plantilla25/assets/css/inline/index-inline-1.css'));

  console.log('🎉 BARRA DE ANUNCIOS CAMBIADA A AMARILLO CON ÉXITO.');
}

run();
