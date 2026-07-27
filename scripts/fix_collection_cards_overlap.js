const fs = require('fs');
const path = require('path');

function fixCollectionSection(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: Asegurar que todas las tarjetas de colecciones tengan media-card--overlap y estilo de texto blanco sobre overlay oscuro
  const blockIds = [
    'shopify-block-a202d561-5f50-4096-86ff-394783a9bc09',
    'shopify-block-ff52666c-6d32-4010-ad60-defb8b535d80',
    'shopify-block-d399df41-3b4c-49c7-a78a-a88a10f28270',
    'shopify-block-8bc31322-6b52-4ca4-b0b0-8cf696375078',
    'shopify-block-90d2569e-cae1-487f-b120-104ffbc27e90',
    'shopify-block-d2b67f23-10c2-40ac-9e9c-a879803f0411',
    'shopify-block-02686c27-0595-4d87-b08a-db1f6b7301c8',
    'shopify-block-ed8aaa6e-3da6-4f5c-84a2-db5c0cea0617'
  ];

  blockIds.forEach(id => {
    // Asegurar clase media-card--overlap
    const oldClassReg = new RegExp(`id="${id}" class="card media-card media-card--card"`, 'g');
    content = content.replace(oldClassReg, `id="${id}" class="card media-card media-card--card media-card--overlap"`);

    // Asegurar bloque style de overlay blanco
    const styleSnippet = `<style>#${id}{--color-foreground:255 255 255;--color-border:var(--color-foreground)/ 0.1;--color-border-dark:var(--color-foreground)/ 0.4;--color-border-light:var(--color-foreground)/ 0.06;--color-overlay:0 0 0;--overlay-opacity:0.4;}</style>`;

    if (!content.includes(`#${id}{--color-foreground:255 255 255`)) {
      content = content.replace(`id="${id}" class="card media-card media-card--card media-card--overlap">`, `id="${id}" class="card media-card media-card--card media-card--overlap">${styleSnippet}`);
    }
  });

  // Fix 2: Reemplazar "Todos los productos" con "Catálogo General" (o mantener en una sola linea sin romper)
  content = content.replace(
    'Todos los productos<small class="count',
    '<span class="whitespace-nowrap">Todos los Productos</span><small class="count'
  );
  content = content.replace(
    'Catálogo General<small class="count',
    '<span class="whitespace-nowrap">Catálogo General</span><small class="count'
  );

  // Fix 3: Asegurar la flecha derecha limpia sin rotación ni distorsión
  content = content.replace(
    /<svg class="icon icon-arrow-right icon-xs transform shrink-0"/g,
    '<svg class="icon icon-arrow-right icon-xs shrink-0 text-white"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Colecciones arregladas en ${filePath}`);
}

function run() {
  console.log('🛠️ Arreglando diseño de tarjetas de colección (overlap y overlay blanco)...');

  fixCollectionSection(path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'));
  fixCollectionSection(path.join(__dirname, '../public/shopify/plantilla25/index.html'));

  console.log('🎉 SECCIÓN DE COLECCIONES CORREGIDA CON ÉXITO.');
}

run();
