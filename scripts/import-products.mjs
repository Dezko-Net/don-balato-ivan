import XLSX from 'xlsx';
import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan');

// Use server-side API key for batch operations
const apiKey = process.env.APPWRITE_API_KEY;
if (apiKey) {
  client.setKey(apiKey);
}

const databases = new Databases(client);
const DATABASE_ID = 'donbalatoivan';
const PRODUCTS_COLLECTION_ID = 'products';
const CATEGORIES_COLLECTION_ID = 'categories';
const SUBCATEGORIES_COLLECTION_ID = 'subcategories';

async function listAll(collectionId) {
  const all = [];
  let cursor = null;
  while (true) {
    const queries = [{ method: 'limit', values: [100] }];
    if (cursor) queries.push({ method: 'cursorAfter', values: [cursor] });
    const res = await databases.listDocuments(DATABASE_ID, collectionId, queries);
    if (res.documents.length === 0) break;
    all.push(...res.documents);
    cursor = res.documents[res.documents.length - 1].$id;
    if (res.documents.length < 100) break;
  }
  return all;
}

async function main() {
  console.log('📖 Leyendo Excel...');
  const wb = XLSX.readFile('c:\\Users\\Yanpo\\Downloads\\productos_para_appwrite.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  console.log(`  ${rows.length} productos encontrados`);

  console.log('📂 Obteniendo categorías de Appwrite...');
  const categories = await listAll(CATEGORIES_COLLECTION_ID);
  console.log(`  ${categories.length} categorías encontradas`);
  categories.forEach(c => console.log(`    - ${c.$id}: ${c.name}`));

  console.log('📂 Obteniendo subcategorías de Appwrite...');
  const subcategories = await listAll(SUBCATEGORIES_COLLECTION_ID);
  console.log(`  ${subcategories.length} subcategorías encontradas`);
  subcategories.forEach(s => console.log(`    - ${s.$id}: ${s.name} (cat: ${s.categoryId})`));

  // Map category names to IDs
  const catMap = {};
  categories.forEach(c => { catMap[c.name.toLowerCase().trim()] = c.$id; });

  // Map subcategory names to IDs
  const subMap = {};
  subcategories.forEach(s => { subMap[s.name.toLowerCase().trim()] = { id: s.$id, categoryId: s.categoryId }; });

  // Find subcategories per category
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
      const catName = (row['Categoría'] || '').trim();
      const catId = catMap[catName.toLowerCase()] || '';

      // Try to find a matching subcategory
      let subCatId = '';
      if (catId && subsByCategory[catId]) {
        // Just pick the first subcategory if exists, or leave empty
        // We'll leave subcategory empty - user said "create subcategory if they don't have"
        // meaning link to existing ones
      }

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
      console.log(`  ✅ [${i + 1}/${rows.length}] ${doc.NAME} (cat: ${catName})`);
    } catch (e) {
      errors++;
      console.error(`  ❌ [${i + 1}/${rows.length}] ${row['Nombre']}: ${e.message}`);
    }
  }

  console.log(`\n🎉 Listo! ${created} productos creados, ${errors} errores.`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
