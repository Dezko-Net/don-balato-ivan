import fs from 'fs';
import path from 'path';

// Load env
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

if (!API_KEY) {
  console.error('ERROR: APPWRITE_API_KEY no encontrada en .env.local');
  process.exit(1);
}

// Minimal Appwrite SDK client using fetch
async function appwriteFetch(path: string, method: string, body?: any) {
  const url = `${ENDPOINT}${path}`;
  const headers: Record<string, string> = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json',
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Appwrite ${res.status}: ${data.message || JSON.stringify(data)}`);
  }
  return data;
}

function setSkuInFeatures(features: string, sku: string): string {
  let base = features || '';
  base = base.replace(/\n?SKU:\s*[^\n]*/gi, '').trim();
  return base ? `${base}\nSKU: ${sku}` : `SKU: ${sku}`;
}

function setBarcodeInFeatures(features: string, barcode: string): string {
  let base = features || '';
  base = base.replace(/\n?BARCODE:\s*[^\n]*/gi, '').trim();
  return base ? `${base}\nBARCODE: ${barcode}` : `BARCODE: ${barcode}`;
}

async function listDocuments(collectionId: string, limit = 500, cursor?: string) {
  let queryStr = `?limit=${limit}`;
  if (cursor) queryStr += `&cursorAfter=${cursor}`;
  return appwriteFetch(`/databases/${DATABASE_ID}/collections/${collectionId}/documents${queryStr}`, 'GET');
}

async function createDocument(collectionId: string, data: any) {
  return appwriteFetch(`/databases/${DATABASE_ID}/collections/${collectionId}/documents`, 'POST', {
    documentId: 'unique()',
    data: data,
    permissions: ['read("any")', 'write("any")', 'delete("any")', 'update("any")'],
  });
}

async function deleteDocument(collectionId: string, docId: string) {
  return appwriteFetch(`/databases/${DATABASE_ID}/collections/${collectionId}/documents/${docId}`, 'DELETE');
}

async function generateId() {
  return 'xxxxxxxxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16)) + Date.now().toString(16);
}

async function main() {
  const jsonPath = process.argv[2] || 'C:\\Users\\Yanpo\\Desktop\\depurador\\yolgo_products.json';
  console.log(`[bulk-import] Reading JSON from: ${jsonPath}`);
  
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const products = JSON.parse(raw);
  console.log(`[bulk-import] Found ${products.length} products to import`);

  // ═══ STEP 1: Delete all existing categories ═══
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

  // ═══ STEP 2: Create new categories from productType ═══
  const uniqueCategories = [...new Set(products.map((p: any) => p.productType))];
  const categoryMap = new Map<string, string>();

  for (const catName of uniqueCategories) {
    try {
      const slug = catName.toLowerCase().replace(/\s+/g, '-');
      const doc = await createDocument(CATEGORIES_COLLECTION, {
        name: catName,
      });
      categoryMap.set(catName, doc.$id);
      console.log(`[bulk-import] Created category: ${catName} -> ${doc.$id}`);
    } catch (e: any) {
      console.error(`[bulk-import] Error creating category ${catName}:`, e.message);
    }
  }
  console.log(`[bulk-import] Created ${categoryMap.size} categories`);

  // ═══ STEP 3: Import products ═══
  let importedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const originalPrice = Math.round(Number(p.price)) || 0;
      const wholesalePrice = Math.round(originalPrice * 0.90);
      const packQty = Math.round(Number(p.packQty)) || 0;
      const categoryId = categoryMap.get(p.productType) || '';

      let features = setSkuInFeatures('', p.sku);
      features = setBarcodeInFeatures(features, p.barcode);

      const payload: Record<string, any> = {
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
        FEATURES: features,
        TAGS: [p.productType.toLowerCase().replace(/\s+/g, '-')],
      };

      await createDocument(PRODUCTS_COLLECTION, payload);
      importedCount++;

      if ((i + 1) % 50 === 0) {
        console.log(`[bulk-import] Progress: ${i + 1}/${products.length} (imported: ${importedCount}, errors: ${errorCount})`);
      }
    } catch (err: any) {
      errorCount++;
      errors.push(`Error importing ${p.sku}: ${err.message}`);
      if (errorCount <= 10) console.error(`[bulk-import] Error importing ${p.sku}:`, err.message);
    }
  }

  console.log(`\n[bulk-import] DONE!`);
  console.log(`  Categories deleted: ${deletedCategories}`);
  console.log(`  Subcategories deleted: ${deletedSubcategories}`);
  console.log(`  Categories created: ${categoryMap.size}`);
  console.log(`  Products imported: ${importedCount}`);
  console.log(`  Errors: ${errorCount}`);
  if (errors.length > 0) {
    console.log(`  First 10 errors:`);
    errors.slice(0, 10).forEach(e => console.log(`    - ${e}`));
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
