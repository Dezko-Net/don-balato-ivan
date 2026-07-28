const { Client, Databases, ID, Query } = require('appwrite');
const XLSX = require('xlsx');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan');

const databases = new Databases(client);
const DATABASE_ID = '6a62e7440033d2278d28';
const PRODUCTS_COLLECTION_ID = 'products';
const CATEGORIES_COLLECTION_ID = 'categories';
const SUBCATEGORIES_COLLECTION_ID = 'subcategories';

async function listAll(collectionId) {
  const all = [];
  let cursor = null;
  while (true) {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const res = await databases.listDocuments(DATABASE_ID, collectionId, queries);
    if (res.documents.length === 0) break;
    all.push(...res.documents);
    cursor = res.documents[res.documents.length - 1].$id;
    if (res.documents.length < 100) break;
  }
  return all;
}

// Map Excel category names to Appwrite category IDs
const CATEGORY_MAP = {
  'Productos de Hogar': 'cat_hogar_cocina',
  'Productos en Ofertas': 'cat_hogar_cocina', // Ofertas -> Hogar y Cocina by default
  'Productos de Limpieza': 'cat_aseo_limpieza',
};

// Keyword-based subcategory matching
function findSubcategory(catId, productName, subsByCategory) {
  if (!catId || !subsByCategory[catId]) return '';
  const subs = subsByCategory[catId];
  const name = productName.toLowerCase();

  // Hogar y Cocina subcategories
  if (catId === 'cat_hogar_cocina') {
    // Audio/Parlantes
    if (name.includes('parlante') || name.includes('barra de sonido') || name.includes('alexa') || name.includes('radio'))
      return subs.find(s => s.name.includes('Audio'))?.$id || '';
    // Audífonos
    if (name.includes('audifono') || name.includes('audífono') || name.includes('ultrapods') || name.includes('ultra pods') || name.includes('m10'))
      return subs.find(s => s.name.includes('Audífonos'))?.$id || '';
    // Iluminación/Linternas
    if (name.includes('linterna') || name.includes('lampara') || name.includes('lámpara') || name.includes('amapolleta') || name.includes('ampolleta') || name.includes('luz') || name.includes('led neon') || name.includes('tiral') || name.includes('espejo led') || name.includes('chispero'))
      return subs.find(s => s.name.includes('Iluminación'))?.$id || '';
    // Gadgets/Tecnología
    if (name.includes('smart') || name.includes('reloj') || name.includes('pesa') || name.includes('balanza') || name.includes('tensiometro') || name.includes('tensiómetro') || name.includes('oximetro') || name.includes('oxímetro') || name.includes('sellador') || name.includes('inflador') || name.includes('calentador') || name.includes('calefator') || name.includes('espejo retrovisor') || name.includes('removedor') || name.includes('perfilador') || name.includes('maquina de cera') || name.includes('máquina de cera') || name.includes('maquina de corte') || name.includes('máquina de corte'))
      return subs.find(s => s.name.includes('Gadgets'))?.$id || '';
    // Cocina y Electrodomésticos
    if (name.includes('min') || name.includes('waflera') || name.includes('picadora') || name.includes('batidora') || name.includes('hervidor') || name.includes('sarten') || name.includes('sartén') || name.includes('parrilla') || name.includes('freidora') || name.includes('licuadora') || name.includes('ducha') || name.includes('aspiradora') || name.includes('palomita') || name.includes('dispensador') || name.includes('maquina') || name.includes('máquina') || name.includes('organizador') || name.includes('escurridor') || name.includes('set de cocina') || name.includes('set termo') || name.includes('vaso') || name.includes('mug') || name.includes('termo'))
      return subs.find(s => s.name.includes('Cocina'))?.$id || '';
    // Organización y Especieros
    if (name.includes('especiero') || name.includes('colgador') || name.includes('esquinero') || name.includes('tendedero') || name.includes('alfombra') || name.includes('set de cocina') || name.includes('cuchillo') || name.includes('utensilio') || name.includes('cinta para embalar'))
      return subs.find(s => s.name.includes('Organización') || s.name.includes('Especieros'))?.$id || '';
    // Utensilios y Cuchillería
    if (name.includes('cuchillo') || name.includes('utensilio') || name.includes('set de cuchillo'))
      return subs.find(s => s.name.includes('Utensilios'))?.$id || '';
    // Paños y Esponjas de Cocina
    if (name.includes('esponja') || name.includes('paño') || name.includes('trapo') || name.includes('vaso vending') || name.includes('toallas humedas') || name.includes('cotonitos'))
      return subs.find(s => s.name.includes('Paños'))?.$id || '';
  }

  // Aseo y Limpieza subcategories
  if (catId === 'cat_aseo_limpieza') {
    // Papel e Higiene
    if (name.includes('papel') || name.includes('servilleta') || name.includes('toalla') || name.includes('pañales') || name.includes('panales'))
      return subs.find(s => s.name.includes('Papel'))?.$id || '';
    // Detergentes y Limpiadores
    if (name.includes('jabon') || name.includes('jabón') || name.includes('detergente') || name.includes('limpiador') || name.includes('traperos') || name.includes('kit') || name.includes('guantes') || name.includes('esponja') || name.includes('paño'))
      return subs.find(s => s.name.includes('Detergentes'))?.$id || '';
    // Artículos de Baño
    if (name.includes('baño') || name.includes('toalla'))
      return subs.find(s => s.name.includes('Baño'))?.$id || '';
  }

  // Moda y Calzado (for Ofertas that are moda)
  if (catId === 'cat_moda_calzado') {
    if (name.includes('pantufla') || name.includes('calceta') || name.includes('calcetin') || name.includes('calzado'))
      return subs.find(s => s.name.includes('Calzado'))?.$id || '';
    if (name.includes('faja') || name.includes('corrector') || name.includes('postura'))
      return subs.find(s => s.name.includes('Fajas'))?.$id || '';
    if (name.includes('gorro') || name.includes('capa') || name.includes('cartuchera'))
      return subs.find(s => s.name.includes('Ropa'))?.$id || '';
  }

  // Juguetes y Niños
  if (catId === 'cat_juguetes_ninos') {
    if (name.includes('control') || name.includes('auto') || name.includes('pistola'))
      return subs.find(s => s.name.includes('Control'))?.$id || '';
    if (name.includes('escolar') || name.includes('cartuchera') || name.includes('kawaii') || name.includes('squishy') || name.includes('gorro') || name.includes('bebé'))
      return subs.find(s => s.name.includes('Escolar'))?.$id || '';
  }

  // Mascotas
  if (catId === 'cat_mascotas') {
    if (name.includes('arena') || name.includes('baño') || name.includes('higiene'))
      return subs.find(s => s.name.includes('Higiene'))?.$id || '';
    if (name.includes('cepillo') || name.includes('juguete'))
      return subs.find(s => s.name.includes('Cepillos'))?.$id || '';
  }

  return '';
}

// For "Productos en Ofertas", determine the real category based on product name
function resolveCategoryForOfertas(productName) {
  const name = productName.toLowerCase();
  if (name.includes('pantufla') || name.includes('calceta') || name.includes('faja') || name.includes('corrector') || name.includes('gorro') || name.includes('capa') || name.includes('cartuchera'))
    return 'cat_moda_calzado';
  if (name.includes('pañales') || name.includes('panales') || name.includes('cepillo') || name.includes('limpiador') || name.includes('aromatizante') || name.includes('difusor'))
    return 'cat_aseo_limpieza';
  if (name.includes('oximetro') || name.includes('oxímetro') || name.includes('calentast') || name.includes('picadora'))
    return 'cat_hogar_cocina';
  if (name.includes('kawaii') || name.includes('squishy') || name.includes('bebé'))
    return 'cat_juguetes_ninos';
  return 'cat_hogar_cocina'; // default
}

async function main() {
  console.log('📖 Leyendo Excel...');
  const wb = XLSX.readFile('c:\\Users\\Yanpo\\Downloads\\productos_para_appwrite.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  console.log(`  ${rows.length} productos encontrados`);

  console.log('📂 Obteniendo categorías y subcategorías de Appwrite...');
  const categories = await listAll(CATEGORIES_COLLECTION_ID);
  const subcategories = await listAll(SUBCATEGORIES_COLLECTION_ID);
  console.log(`  ${categories.length} categorías, ${subcategories.length} subcategorías`);

  const subsByCategory = {};
  subcategories.forEach(s => {
    if (!subsByCategory[s.categoryId]) subsByCategory[s.categoryId] = [];
    subsByCategory[s.categoryId].push(s);
  });

  console.log('\n🚀 Subiendo productos...');
  let created = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const excelCat = (row['Categoría'] || '').trim();
      let catId = CATEGORY_MAP[excelCat] || '';

      // For "Productos en Ofertas", resolve real category by product name
      if (excelCat === 'Productos en Ofertas') {
        catId = resolveCategoryForOfertas(row['Nombre'] || '');
      }

      const subCatId = findSubcategory(catId, row['Nombre'] || '', subsByCategory);

      const tags = row['Tags'] ? String(row['Tags']).split(',').map(t => t.trim()).filter(Boolean) : [];

      const features = [];
      if (row['SKU']) features.push(`sku:${row['SKU']}`);
      if (row['Código de barras']) features.push(`barcode:${row['Código de barras']}`);

      const payload = {
        NAME: row['Nombre'] || '',
        DESCRIPTION: row['Descripción'] || '',
        PRICE: Math.round(Number(row['Precio']) || 0),
        STOCK: Math.round(Number(row['Stock']) || 0),
        COST: Math.round(Number(row['Costo']) || 0),
        WHOLESALEPRICE: Math.round(Number(row['Precio Mayorista']) || 0),
        WHOLESALEMINQUANTITY: Math.round(Number(row['Mín. Mayorista']) || 0),
        CATALOGPRICE: Math.round(Number(row['Precio Mayorista']) || 0),
        IMAGEURL: row['URL Imagen'] || '',
        IMAGEURL2: row['URL Imagen 2'] || '',
        IMAGEURL3: row['URL Imagen 3'] || '',
        CATEGORYID: catId,
        SUBCATEGORYID: subCatId,
        TAGS: tags,
        FEATURES: features,
        ISACTIVE: row['Activo'] === 'Sí' || row['Activo'] === true,
        ISFEATURED: row['Destacado'] === 'Sí' || row['Destacado'] === true,
        SOLDQUANTITY: Math.round(Number(row['Vendidos']) || 0),
      };

      const doc = await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, ID.unique(), payload);
      created++;
      const catName = categories.find(c => c.$id === catId)?.name || '?';
      const subName = subcategories.find(s => s.$id === subCatId)?.name || 'Sin sub';
      console.log(`  ✅ [${i + 1}/${rows.length}] ${doc.NAME} → ${catName} / ${subName}`);
    } catch (e) {
      errors++;
      console.error(`  ❌ [${i + 1}/${rows.length}] ${row['Nombre']}: ${e.message}`);
    }
  }

  console.log(`\n🎉 Listo! ${created} productos creados, ${errors} errores.`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
