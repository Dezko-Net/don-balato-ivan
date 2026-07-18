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

const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90')
  .setKey(process.env.APPWRITE_API_KEY || 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655');

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const PRODUCTS_COLLECTION = 'products';

function extractSkuFromFeatures(features) {
  if (!features) return '';
  const text = Array.isArray(features) ? features.join('\n') : features;
  const m = text.match(/SKU:\s*([^\n]+)/i);
  return m ? m[1].trim() : '';
}

function extractBarcodeFromFeatures(features) {
  if (!features) return '';
  const text = Array.isArray(features) ? features.join('\n') : features;
  const m = text.match(/Barcode:\s*([^\n]+)/i);
  return m ? m[1].trim() : '';
}

async function main() {
  const results = [];
  let cursor = null;

  while (true) {
    const queries = [Query.limit(100), Query.greaterThan('STOCK', 0)];
    if (cursor) queries.push(Query.cursorAfter(cursor));

    const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, queries);
    if (!res.documents || res.documents.length === 0) break;

    for (const doc of res.documents) {
      const stock = doc.STOCK ?? 0;
      const sku = doc.SKU || extractSkuFromFeatures(doc.FEATURES) || '';
      const barcode = extractBarcodeFromFeatures(doc.FEATURES) || '';
      results.push({
        name: doc.NAME || '',
        sku,
        barcode,
        stock: stock === 99999 ? 'Ilimitado' : stock,
        price: doc.PRICE || 0,
      });
    }

    cursor = res.documents[res.documents.length - 1].$id;
    if (results.length >= res.total) break;
  }

  console.log(`\n=== SKUs con Stock (${results.length} total) ===\n`);
  for (const r of results) {
    console.log(r.sku || 'SIN-SKU');
  }

  const withSku = results.filter(r => r.sku).length;
  const withoutSku = results.filter(r => !r.sku).length;
  console.log(`\nResumen: ${results.length} productos con stock | ${withSku} con SKU | ${withoutSku} sin SKU`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
