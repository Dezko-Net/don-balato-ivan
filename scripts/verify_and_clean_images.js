const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

function checkUrl(url) {
  return new Promise(resolve => {
    if (!url || typeof url !== 'string') return resolve(false);
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, res => {
      const contentType = res.headers['content-type'] || '';
      // Debe responder 200 OK Y ser una imagen valida (no XML de error)
      if (res.statusCode === 200 && contentType.includes('image')) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function run() {
  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');

  const products = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));
  console.log(`🔍 Verificando URLs de imágenes para ${products.length} productos...`);

  let valid = 0;
  let cleaned = 0;

  for (let p of products) {
    if (p.image) {
      const isOk = await checkUrl(p.image);
      if (isOk) {
        valid++;
      } else {
        console.log(` ⚠️ Imagen 403/XML descartada para SKU ${p.sku} (${p.name})`);
        p.image = '';
        cleaned++;
      }
    }
  }

  // Save cleaned JSON files
  fs.writeFileSync(jsonPath1, JSON.stringify(products, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(products, null, 2), 'utf8');

  console.log(`\n✅ RESULTADO:`);
  console.log(`   - Imágenes reales de alta calidad: ${valid}`);
  console.log(`   - Enlaces descartados (403/XML): ${cleaned}`);

  // Sincronizar Appwrite
  console.log('🔄 Sincronizando Appwrite...');
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);

  const docsRes = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(500)]);
  for (const doc of docsRes.documents) {
    const matched = products.find(p => p.sku === doc.jumpseller_id || p.sku === doc.SKU || p.name === doc.NAME);
    const validImg = matched?.image || '';
    if (doc.IMAGEURL !== validImg) {
      try {
        await databases.updateDocument(DATABASE_ID, 'products', doc.$id, { IMAGEURL: validImg });
      } catch(e){}
    }
  }

  console.log('🎉 Sincronización finalizada con éxito.');
}

run();
