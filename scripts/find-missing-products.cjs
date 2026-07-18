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

function extractSkuFromFeatures(features) {
  if (!features) return '';
  const text = Array.isArray(features) ? features.join('\n') : features;
  const m = text.match(/SKU:\s*([^\n]+)/i);
  return m ? m[1].trim() : '';
}

const targets = ['KC1048', 'ck0140', 'KC90241', '8182', '8313', '8014'];

async function main() {
  // Get ALL products with stock using cursor pagination
  const allDocs = [];
  let cursor = null;
  while (true) {
    const queries = [Query.limit(100), Query.greaterThan('STOCK', 0)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const res = await databases.listDocuments(DATABASE_ID, 'products', queries);
    if (!res.documents || res.documents.length === 0) break;
    allDocs.push(...res.documents);
    cursor = res.documents[res.documents.length - 1].$id;
    if (allDocs.length >= res.total) break;
  }

  console.log(`Total productos con stock: ${allDocs.length}\n`);

  for (const target of targets) {
    const found = allDocs.find(d => {
      const sku = d.SKU || extractSkuFromFeatures(d.FEATURES) || '';
      return sku.toLowerCase() === target.toLowerCase();
    });
    if (found) {
      const sku = found.SKU || extractSkuFromFeatures(found.FEATURES) || '';
      const skuField = found.SKU || '(vacio)';
      console.log(`${target} -> SKU field: "${skuField}" | FEATURES SKU: "${sku}" | NAME: ${found.NAME} | STOCK: ${found.STOCK} | PRICE: ${found.PRICE}`);
    } else {
      console.log(`${target} -> NO ENCONTRADO`);
    }
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
