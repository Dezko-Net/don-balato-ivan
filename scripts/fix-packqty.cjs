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

async function main() {
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let total = 0;
  const limit = 100;
  let offset = 0;

  while (true) {
    const queryPath = `/databases/${DATABASE_ID}/collections/${PRODUCTS_COLLECTION}/documents?limit=${limit}&offset=${offset}`;
    console.log(`Fetching offset=${offset}...`);
    const res = await appwriteFetch(queryPath, 'GET');
    if (!res.documents || res.documents.length === 0) {
      console.log(`No more documents. Total fetched: ${total}`);
      break;
    }

    console.log(`Got ${res.documents.length} documents (total in collection: ${res.total})`);

    for (const doc of res.documents) {
      total++;
      const packQty = doc.PACKQTY;
      const wsMinQty = doc.WHOLESALEMINQUANTITY;
      const stock = doc.STOCK || 0;
      if (total <= 30 || stock > 0) {
        console.log(`  [${total}] ${doc.NAME?.substring(0, 40)} | STOCK=${stock} | PACKQTY=${packQty} | WS_MIN=${wsMinQty} | WS_PRICE=${doc.WHOLESALEPRICE} | PRICE=${doc.PRICE}`);
      }
      // Only update products WITH STOCK and WITHOUT PACKQTY (or PACKQTY = 0 or 1)
      if (stock > 0 && (!packQty || packQty === 0 || packQty === 1)) {
        try {
          const updateData = { PACKQTY: 12 };
          if (!wsMinQty || wsMinQty === 0) {
            updateData.WHOLESALEMINQUANTITY = 12;
          }
          await appwriteFetch(
            `/databases/${DATABASE_ID}/collections/${PRODUCTS_COLLECTION}/documents/${doc.$id}`,
            'PATCH',
            { data: updateData }
          );
          updated++;
          if (updated % 50 === 0) console.log(`Updated ${updated} products...`);
        } catch (e) {
          errors++;
          if (errors <= 3) console.error(`Error updating ${doc.$id} (${doc.NAME}): ${e.message}`);
        }
      } else {
        skipped++;
      }
    }

    offset += res.documents.length;
    if (offset >= res.total) break;
  }

  console.log(`\nDONE!`);
  console.log(`  Total products scanned: ${total}`);
  console.log(`  Updated (PACKQTY set to 12): ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
