const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const https = require('https');
const http = require('http');

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
    const res = await databases.listDocuments(DATABASE_ID, 'products', queries);
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

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        downloadImage(res.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(filePath, buffer);
        resolve();
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  console.log('1. Obteniendo SKUs con stock...');
  const stockSkus = await getSkusWithStock();
  console.log(`   ${stockSkus.size} SKUs con stock.`);

  console.log('2. Leyendo imagenes.xlsx...');
  const imgPath = path.join(process.cwd(), 'excels', 'imagenes.xlsx');
  const imgWb = XLSX.readFile(imgPath);
  const imgRows = XLSX.utils.sheet_to_json(imgWb.Sheets[imgWb.SheetNames[0]], { defval: '' });
  console.log(`   ${imgRows.length} filas en imagenes.xlsx.`);

  // Filter to only SKUs with stock
  const toDownload = imgRows.filter(r => {
    const sku = String(r['Codigo'] || '').trim();
    return stockSkus.has(sku) && r['Enlace de imagen'];
  });
  console.log(`   ${toDownload.length} imagenes para descargar (con stock).`);

  // Create output directory
  const outDir = path.join(process.cwd(), 'excels', 'imagenes-descargadas');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let downloaded = 0;
  let failed = 0;
  const failures = [];

  // Download in batches of 10
  const batchSize = 10;
  for (let i = 0; i < toDownload.length; i += batchSize) {
    const batch = toDownload.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(async (r) => {
      const sku = String(r['Codigo'] || '').trim();
      const url = String(r['Enlace de imagen'] || '').trim();
      if (!url) return;

      // Determine extension from URL
      const extMatch = url.match(/\.(jpg|jpeg|png|gif|webp|bmp)/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
      const fileName = `${sku}.${ext}`;
      const filePath = path.join(outDir, fileName);

      try {
        await downloadImage(url, filePath);
        downloaded++;
        if (downloaded % 20 === 0) console.log(`   Descargadas: ${downloaded}/${toDownload.length}`);
      } catch (e) {
        failed++;
        failures.push(`${sku}: ${e.message} (${url})`);
      }
    }));
  }

  console.log(`\n3. Resultado:`);
  console.log(`   Descargadas: ${downloaded}`);
  console.log(`   Fallidas: ${failed}`);
  if (failures.length > 0) {
    console.log(`\nFallos:`);
    failures.forEach(f => console.log(`  ${f}`));
  }
  console.log(`\nImagenes guardadas en: ${outDir}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
