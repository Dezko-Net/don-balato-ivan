const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Load env
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

async function getSkusWithStock() {
  const skus = new Set();
  let cursor = null;

  while (true) {
    const queries = [Query.limit(100), Query.greaterThan('STOCK', 0)];
    if (cursor) queries.push(Query.cursorAfter(cursor));

    const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, queries);
    if (!res.documents || res.documents.length === 0) break;

    for (const doc of res.documents) {
      const sku = doc.SKU || extractSkuFromFeatures(doc.FEATURES) || '';
      if (sku) skus.add(sku);
    }

    cursor = res.documents[res.documents.length - 1].$id;
    if (skus.size >= res.total) break;
  }

  return skus;
}

async function main() {
  console.log('1. Obteniendo SKUs con stock desde Appwrite...');
  const stockSkus = await getSkusWithStock();
  console.log(`   ${stockSkus.size} SKUs con stock encontrados.`);

  console.log('2. Leyendo product.xlsx...');
  const excelPath = path.join(process.cwd(), 'excels', 'product.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  console.log(`   ${rows.length} filas en el Excel.`);

  // Find the SKU column (case-insensitive)
  const firstRow = rows[0] || {};
  const keys = Object.keys(firstRow);
  const skuKey = keys.find(k => k.toLowerCase() === 'sku') 
    || keys.find(k => k.toLowerCase().includes('sku'))
    || keys.find(k => k.toLowerCase() === 'codigo')
    || keys.find(k => k.toLowerCase().includes('codigo'));
  
  if (!skuKey) {
    console.error('No se encontro columna SKU en el Excel. Columnas disponibles:', keys.join(', '));
    process.exit(1);
  }
  console.log(`   Columna SKU: "${skuKey}"`);

  // Filter rows that have a SKU in the stock set
  const kept = [];
  const removed = [];
  const matchedSkus = new Set();
  for (const row of rows) {
    const sku = String(row[skuKey] || '').trim();
    if (stockSkus.has(sku)) {
      kept.push(row);
      matchedSkus.add(sku);
    } else {
      removed.push(row);
    }
  }

  // Find SKUs in stock that didn't match any Excel row
  const unmatched = [];
  for (const sku of stockSkus) {
    if (!matchedSkus.has(sku)) {
      unmatched.push(sku);
    }
  }
  if (unmatched.length > 0) {
    console.log(`\nSKUs con stock que NO existen en el Excel (${unmatched.length}):`);
    for (const sku of unmatched) {
      console.log(`  ${sku}`);
    }
  }

  console.log(`3. Filtrando: ${kept.length} filas mantenidas, ${removed.length} filas eliminadas.`);

  // Write filtered Excel
  const newWorksheet = XLSX.utils.json_to_sheet(kept);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

  const outputPath = path.join(process.cwd(), 'excels', 'product.xlsx');
  // Don't overwrite again, just report
  // XLSX.writeFile(newWorkbook, outputPath);
  console.log(`4. Excel NO sobrescrito (solo reporte).`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
