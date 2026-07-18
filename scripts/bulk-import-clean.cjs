const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';
const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const SUBCATEGORIES_COLLECTION = 'subcategories';

async function appwriteFetch(apiPath, method, body) {
  const url = `${ENDPOINT}${apiPath}`;
  const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json',
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text).message || text; } catch {}
    throw new Error(`Appwrite ${res.status}: ${msg}`);
  }
  try { return text ? JSON.parse(text) : {}; }
  catch { return {}; }
}

async function listDocuments(collectionId, limit) {
  return appwriteFetch(`/databases/${DATABASE_ID}/collections/${collectionId}/documents?limit=${limit || 500}`, 'GET');
}

async function createDocument(collectionId, data) {
  return appwriteFetch(`/databases/${DATABASE_ID}/collections/${collectionId}/documents`, 'POST', {
    documentId: 'unique()',
    data: data,
    permissions: ['read("any")', 'write("any")', 'delete("any")', 'update("any")'],
  });
}

async function deleteDocument(collectionId, docId) {
  return appwriteFetch(`/databases/${DATABASE_ID}/collections/${collectionId}/documents/${docId}`, 'DELETE');
}

function setSkuInFeatures(features, sku) {
  let base = features || '';
  base = base.replace(/\n?SKU:\s*[^\n]*/gi, '').trim();
  return base ? `${base}\nSKU: ${sku}` : `SKU: ${sku}`;
}

function setBarcodeInFeatures(features, barcode) {
  let base = features || '';
  base = base.replace(/\n?BARCODE:\s*[^\n]*/gi, '').trim();
  return base ? `${base}\nBARCODE: ${barcode}` : `BARCODE: ${barcode}`;
}

async function main() {
  const jsonPath = process.argv[2] || 'C:\\Users\\Yanpo\\Desktop\\depurador\\yolgo_products.json';
  console.log(`[bulk-import] Reading JSON from: ${jsonPath}`);
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const products = JSON.parse(raw);
  console.log(`[bulk-import] Found ${products.length} products to import`);

  // STEP 1: Delete ALL existing products
  console.log('[bulk-import] Deleting all existing products...');
  let deletedProducts = 0;
  let deleteErrors = 0;
  while (true) {
    const res = await listDocuments(PRODUCTS_COLLECTION, 500);
    if (res.documents.length === 0) break;
    for (const doc of res.documents) {
      try { await deleteDocument(PRODUCTS_COLLECTION, doc.$id); deletedProducts++; }
      catch (e) { deleteErrors++; if (deleteErrors <= 3) console.error(`[bulk-import] Delete error for ${doc.$id}:`, e.message); }
    }
    console.log(`[bulk-import] Deleted ${deletedProducts} products so far... (errors: ${deleteErrors})`);
    if (deleteErrors > 10) { console.error('[bulk-import] Too many delete errors, aborting product deletion'); break; }
  }
  console.log(`[bulk-import] Total products deleted: ${deletedProducts}`);

  // STEP 2: Delete ALL existing categories
  console.log('[bulk-import] Deleting all existing categories...');
  let deletedCategories = 0;
  while (true) {
    const res = await listDocuments(CATEGORIES_COLLECTION, 500);
    if (res.documents.length === 0) break;
    for (const doc of res.documents) {
      try { await deleteDocument(CATEGORIES_COLLECTION, doc.$id); deletedCategories++; } catch {}
    }
  }
  let deletedSubcategories = 0;
  while (true) {
    const res = await listDocuments(SUBCATEGORIES_COLLECTION, 500);
    if (res.documents.length === 0) break;
    for (const doc of res.documents) {
      try { await deleteDocument(SUBCATEGORIES_COLLECTION, doc.$id); deletedSubcategories++; } catch {}
    }
  }
  console.log(`[bulk-import] Deleted ${deletedCategories} categories, ${deletedSubcategories} subcategories`);

  // STEP 3: Create new categories
  const uniqueCategories = [...new Set(products.map(p => p.productType))];
  const categoryMap = new Map();
  for (const catName of uniqueCategories) {
    try {
      const doc = await createDocument(CATEGORIES_COLLECTION, { name: catName });
      categoryMap.set(catName, doc.$id);
    } catch (e) {
      console.error(`[bulk-import] Error creating category ${catName}:`, e.message);
    }
  }
  console.log(`[bulk-import] Created ${categoryMap.size} categories`);

  // STEP 4: Import products
  let importedCount = 0;
  let errorCount = 0;
  const errors = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const originalPrice = Math.round(Number(p.price)) || 0;
      const wholesalePrice = originalPrice;
      const packQty = Math.round(Number(p.packQty)) || 0;
      const categoryId = categoryMap.get(p.productType) || '';
      let features = setSkuInFeatures('', p.sku);
      features = setBarcodeInFeatures(features, p.barcode);
      const payload = {
        NAME: p.name,
        DESCRIPTION: p.name,
        PRICE: originalPrice,
        STOCK: 96,
        COST: 0,
        CURRENTPRICE: null,
        WHOLESALEPRICE: wholesalePrice,
        WHOLESALEMINQUANTITY: packQty,
        PACKQTY: packQty,
        IMAGEURL: p.firebaseUrl,
        IMAGEURL2: '',
        IMAGEURL3: '',
        CATEGORYID: categoryId,
        SUBCATEGORYID: '',
        FEATURES: features.split('\n').filter(Boolean),
        TAGS: [p.productType.toLowerCase().replace(/\s+/g, '-')],
      };
      await createDocument(PRODUCTS_COLLECTION, payload);
      importedCount++;
      if ((i + 1) % 50 === 0) {
        console.log(`[bulk-import] Progress: ${i + 1}/${products.length} (imported: ${importedCount}, errors: ${errorCount})`);
      }
    } catch (err) {
      errorCount++;
      errors.push(`Error importing ${p.sku}: ${err.message}`);
      if (errorCount <= 5) console.error(`[bulk-import] Error importing ${p.sku}:`, err.message);
    }
  }

  console.log(`\n[bulk-import] DONE!`);
  console.log(`  Products deleted: ${deletedProducts}`);
  console.log(`  Categories deleted: ${deletedCategories}`);
  console.log(`  Categories created: ${categoryMap.size}`);
  console.log(`  Products imported: ${importedCount}`);
  console.log(`  Errors: ${errorCount}`);
  if (errors.length > 0) {
    console.log(`  First 5 errors:`);
    errors.slice(0, 5).forEach(e => console.log(`    - ${e}`));
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
