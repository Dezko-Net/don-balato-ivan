/**
 * Script de migración: reorganiza categorías planas en jerarquía padre → subcategoría.
 *
 * Pasos:
 * 1. Lee las categorías actuales desde Appwrite.
 * 2. Crea las categorías padre nuevas (Skincare, Maquillaje, Capilar).
 * 3. Para cada categoría actual, crea una subcategoría bajo el padre correspondiente.
 * 4. Actualiza todos los productos: CATEGORYID → padre, SUBCATEGORYID → subcategoría nueva.
 * 5. (Opcional) Elimina las categorías antiguas si ya no tienen productos.
 *
 * Uso:
 *   node scripts/migrate-categories.cjs           → dry-run (solo muestra qué haría)
 *   node scripts/migrate-categories.cjs --run     → ejecuta la migración
 */

const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const { Client, Databases, Query, ID } = require('node-appwrite');

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90')
  .setKey(process.env.APPWRITE_API_KEY || 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655');

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const CATEGORIES_COLLECTION = 'categories';
const SUBCATEGORIES_COLLECTION = 'subcategories';
const PRODUCTS_COLLECTION = 'products';

const DRY_RUN = !process.argv.includes('--run');

// ─── Mapeo completo: nombre categoría actual → nombre categoría padre ───
const CATEGORY_MAPPING = {
  // Skincare
  'Skincare Facial':             'Skincare',
  'Tónicos y Esencias':          'Skincare',
  'Limpiadores Faciales':        'Skincare',
  'Desmaquillantes y Algodones': 'Skincare',
  'Exfoliantes':                 'Skincare',
  'Cuidado Corporal':            'Skincare',
  'Cuidado de Manos':            'Skincare',
  'Cuidado de Pies':             'Skincare',
  // Maquillaje
  'Labiales':                    'Maquillaje',
  'Sombras de Ojos':             'Maquillaje',
  'Base de Maquillaje':          'Maquillaje',
  'Corrector':                   'Maquillaje',
  'Primer':                      'Maquillaje',
  'Polvos':                      'Maquillaje',
  'Rubor e Iluminador':          'Maquillaje',
  'Máscara de Pestañas':         'Maquillaje',
  'Fijador de Maquillaje':       'Maquillaje',
  'Sets y Kits':                 'Maquillaje',
  'Sets y Kits de Maquillaje':   'Maquillaje',
  'Pestañas y Accesorios':       'Maquillaje',
  // Capilar
  'Cuidado del Cabello':         'Capilar',
  'Secadores de Cabello':        'Capilar',
  'Maquinas de Corte':           'Capilar',
  'Herramientas de Peluquería':  'Capilar',
  // Manicure
  'Equipos de Uñas':             'Manicure',
  'Herramientas de Manicura':    'Manicure',
  // Herramientas y Accesorios
  'Brochas y Pinceles':          'Herramientas',
  'Esponjas de Maquillaje':      'Herramientas',
  'Herramientas de Belleza':     'Herramientas',
  'Organizadores y Mobiliario':  'Herramientas',
  'Maletines y Organizadores':   'Herramientas',
  'Accesorios de Belleza':       'Herramientas',
  // Otros (sin migrar — se quedan como categoría propia)
  // 'Otros':                    '(propia)',
  // 'Maquillaje':               '(ya existe como padre)',
  // 'Aromaterapia y Difusores': '(propia)',
  // 'Empaques y Regalos':       '(propia)',
};

// Orden de las categorías padre nuevas
const PARENT_ORDER = ['Skincare', 'Maquillaje', 'Capilar', 'Manicure', 'Herramientas'];

// Categorías que se quedan como están (no se migran)
const KEEP_AS_IS = ['Otros', 'Maquillaje', 'Aromaterapia y Difusores', 'Empaques y Regalos'];

async function fetchAllCategories() {
  const all = [];
  let offset = 0;
  while (true) {
    const res = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION, [
      Query.orderAsc('$createdAt'),
      Query.limit(100),
      Query.offset(offset),
    ]);
    all.push(...res.documents);
    if (res.documents.length < 100) break;
    offset += 100;
  }
  return all;
}

async function fetchAllProducts() {
  const all = [];
  let offset = 0;
  while (true) {
    const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [
      Query.limit(100),
      Query.offset(offset),
    ]);
    all.push(...res.documents);
    if (res.documents.length < 100) break;
    offset += 100;
    console.log(`  ...productos cargados: ${all.length}`);
  }
  return all;
}

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Migración de Categorías — ${DRY_RUN ? 'DRY RUN' : 'EJECUCIÓN REAL'}`);
  console.log(`${'='.repeat(60)}\n`);

  // 1. Cargar categorías actuales
  console.log('1. Cargando categorías actuales...');
  const currentCategories = await fetchAllCategories();
  console.log(`   → ${currentCategories.length} categorías encontradas`);

  // 1b. Cargar productos y contar por categoría
  console.log('\n1b. Contando productos por categoría...');
  const products = await fetchAllProducts();
  console.log(`   → ${products.length} productos cargados`);
  const productCountByCat = {};
  for (const p of products) {
    const catId = p.CATEGORYID || '__none__';
    productCountByCat[catId] = (productCountByCat[catId] || 0) + 1;
  }

  // Mostrar resumen de categorías con productos
  console.log('\n   Categorías con productos:');
  currentCategories.forEach(c => {
    const count = productCountByCat[c.$id] || 0;
    const parent = CATEGORY_MAPPING[c.name] || (KEEP_AS_IS.includes(c.name) ? '(propia)' : '(sin mapear)');
    const marker = count > 0 ? '✓' : '✗';
    console.log(`     ${marker} ${c.name} (${count} prods) → ${parent}`);
  });

  // Filtrar: solo migrar categorías que TENGAN productos
  const toMigrate = currentCategories.filter(c =>
    CATEGORY_MAPPING[c.name] && (productCountByCat[c.$id] || 0) > 0
  );
  const toSkip = currentCategories.filter(c =>
    !CATEGORY_MAPPING[c.name] || (productCountByCat[c.$id] || 0) === 0
  );

  console.log(`\n   → ${toMigrate.length} categorías con productos que se migrarán`);
  console.log(`   → ${toSkip.length} categorías sin productos o sin migrar (se ignoran)`);

  if (toMigrate.length === 0) {
    console.log('\nNo hay categorías con productos para migrar. Abortando.');
    return;
  }

  // 2. Crear categorías padre (solo si tienen al menos una subcategoría con productos)
  console.log('\n2. Creando categorías padre...');
  const parentMap = {}; // nombre padre → $id

  // Determinar qué padres necesitamos (solo los que tienen subcategorías con productos)
  const neededParents = new Set(toMigrate.map(c => CATEGORY_MAPPING[c.name]));

  for (const parentName of PARENT_ORDER) {
    if (!neededParents.has(parentName)) {
      console.log(`   → "${parentName}" no necesita crearse (sin subcategorías con productos)`);
      continue;
    }

    // Verificar si ya existe
    const existing = currentCategories.find(c => c.name === parentName);
    if (existing) {
      console.log(`   → "${parentName}" ya existe [id: ${existing.$id}] — se reutiliza`);
      parentMap[parentName] = existing.$id;
      continue;
    }

    if (DRY_RUN) {
      console.log(`   → [DRY RUN] Crearía categoría padre: "${parentName}"`);
      parentMap[parentName] = `dry_${parentName}`;
    } else {
      const doc = await databases.createDocument(DATABASE_ID, CATEGORIES_COLLECTION, ID.unique(), {
        name: parentName,
        iconUrl: '',
        order: PARENT_ORDER.indexOf(parentName),
      });
      console.log(`   → Creada: "${parentName}" [id: ${doc.$id}]`);
      parentMap[parentName] = doc.$id;
    }
  }

  // 3. Crear subcategorías
  console.log('\n3. Creando subcategorías...');
  const subcatMap = {}; // $id categoría antigua → $id subcategoría nueva

  for (const cat of toMigrate) {
    const parentName = CATEGORY_MAPPING[cat.name];
    const parentId = parentMap[parentName];

    if (DRY_RUN) {
      console.log(`   → [DRY RUN] Crearía subcategoría: "${cat.name}" bajo "${parentName}"`);
      subcatMap[cat.$id] = `dry_sub_${cat.$id}`;
    } else {
      const doc = await databases.createDocument(DATABASE_ID, SUBCATEGORIES_COLLECTION, ID.unique(), {
        name: cat.name,
        categoryId: parentId,
        parentSubcategoryId: null,
        order: 0,
      });
      console.log(`   → Creada: "${cat.name}" → "${parentName}" [id: ${doc.$id}]`);
      subcatMap[cat.$id] = doc.$id;
    }
  }

  // 4. Actualizar productos
  console.log('\n4. Actualizando productos...');
  console.log(`   → ${products.length} productos en total`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const p of products) {
    const oldCatId = p.CATEGORYID;
    if (!oldCatId || !subcatMap[oldCatId]) {
      skipped++;
      continue;
    }

    const oldCat = currentCategories.find(c => c.$id === oldCatId);
    const parentName = oldCat ? CATEGORY_MAPPING[oldCat.name] : null;
    const newParentId = parentName ? parentMap[parentName] : null;
    const newSubcatId = subcatMap[oldCatId];

    if (!newParentId || !newSubcatId) {
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      updated++;
      continue;
    }

    try {
      await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, p.$id, {
        CATEGORYID: newParentId,
        SUBCATEGORYID: newSubcatId,
      });
      updated++;
      if (updated % 50 === 0) console.log(`   ...actualizados: ${updated}/${products.length}`);
    } catch (e) {
      errors++;
      console.error(`   ✗ Error actualizando producto ${p.$id}: ${e.message}`);
    }
  }

  console.log(`\n   Resumen: ${updated} actualizados, ${skipped} sin migrar, ${errors} errores`);

  // 5. Reporte final
  console.log(`\n${'='.repeat(60)}`);
  console.log('  MIGRACIÓN COMPLETADA');
  console.log(`${'='.repeat(60)}`);
  console.log(`  Categorías padre creadas: ${PARENT_ORDER.length}`);
  console.log(`  Subcategorías creadas: ${toMigrate.length}`);
  console.log(`  Categorías no migradas (sin productos o propias): ${toSkip.map(c => `${c.name} (${productCountByCat[c.$id] || 0})`).join(', ') || 'ninguna'}`);
  console.log(`  Productos actualizados: ${updated}`);
  if (DRY_RUN) {
    console.log('\n  ⚠ DRY RUN — no se hicieron cambios reales.');
    console.log('  Para ejecutar de verdad: node scripts/migrate-categories.cjs --run');
  }
  console.log('');
}

main().catch(err => {
  console.error('\n✗ Error fatal:', err.message);
  process.exit(1);
});
