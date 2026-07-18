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
const ORDERS_COLLECTION = 'orders';
const WHOLESALE_ORDERS = 'wholesale_orders';

async function appwriteFetch(apiPath, method, body) {
  const url = `${ENDPOINT}${apiPath}`;
  const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json',
  };
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text).message || text; } catch {}
    throw new Error(`Appwrite ${res.status}: ${msg}`);
  }
  try { return text ? JSON.parse(text) : {}; }
  catch { return {}; }
}

async function checkCollection(collName, label) {
  console.log(`\n=== ${label} (${collName}) ===`);
  const res = await appwriteFetch(
    `/databases/${DATABASE_ID}/collections/${collName}/documents?limit=10`,
    'GET'
  );
  if (!res.documents || res.documents.length === 0) {
    console.log(`  No documents found (total: ${res.total || 0})`);
    return;
  }
  console.log(`  Total orders: ${res.total}`);
  console.log(`  Showing first ${res.documents.length}:\n`);

  for (const order of res.documents) {
    const items = JSON.parse(order.ITEMS || '[]');
    const firstItem = items[0] || {};
    const fields = Object.keys(firstItem);
    const hasSku = firstItem.sku && firstItem.sku !== '';
    const hasBarcode = firstItem.barcode && firstItem.barcode !== '';
    
    console.log(`  Order ${order.ORDERCODE || order.$id} | ${items.length} items | fields: [${fields.join(', ')}]`);
    console.log(`    First item: name="${firstItem.name?.substring(0, 30)}" | sku="${firstItem.sku || '∅'}" | barcode="${firstItem.barcode || '∅'}" | id="${firstItem.id || '∅'}"`);
  }
}

async function main() {
  await checkCollection(ORDERS_COLLECTION, 'Regular Orders');
  await checkCollection(WHOLESALE_ORDERS, 'Wholesale Orders');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
