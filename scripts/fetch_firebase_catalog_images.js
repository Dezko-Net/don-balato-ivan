const fs = require('fs');
const path = require('path');
const https = require('https');
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

// REST call to Firestore donbalatoivanchile
async function fetchFirestoreProducts() {
  const url = 'https://firestore.googleapis.com/v1/projects/donbalatoivanchile/databases/(default)/documents/donbalatoivan_products?pageSize=300';
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const docs = parsed.documents || [];
          const items = docs.map(d => {
            const fields = d.fields || {};
            return {
              sku: fields.sku?.stringValue || fields.SKU?.stringValue || fields.id?.stringValue || '',
              name: fields.name?.stringValue || fields.NAME?.stringValue || '',
              image: fields.image?.stringValue || fields.IMAGEURL?.stringValue || fields.imageUrl?.stringValue || ''
            };
          });
          resolve(items);
        } catch(e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  console.log('🔥 Consultando Firestore de Don Balato Iván...');
  const firestoreItems = await fetchFirestoreProducts();
  console.log(`📦 Recibidos ${firestoreItems.length} productos desde Firestore.`);

  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');

  const localProducts = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));

  let matchedCount = 0;

  firestoreItems.forEach(fsItem => {
    if (fsItem.image && fsItem.image.startsWith('http')) {
      const target = localProducts.find(p => 
        (fsItem.sku && p.sku === fsItem.sku) || 
        (fsItem.name && p.name.toLowerCase().trim() === fsItem.name.toLowerCase().trim())
      );

      if (target && (!target.image || target.image !== fsItem.image)) {
        target.image = fsItem.image;
        matchedCount++;
        console.log(` ✅ Imagen vinculada para SKU ${target.sku} (${target.name}) -> ${fsItem.image.substring(0, 70)}...`);
      }
    }
  });

  console.log(`\n🎉 Total de imágenes vinculadas desde Firestore: ${matchedCount}`);

  fs.writeFileSync(jsonPath1, JSON.stringify(localProducts, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(localProducts, null, 2), 'utf8');

  // Actualizar Appwrite
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);

  const docsRes = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(500)]);
  for (const doc of docsRes.documents) {
    const matched = localProducts.find(p => p.sku === doc.jumpseller_id || p.sku === doc.SKU || p.name === doc.NAME);
    if (matched && matched.image && doc.IMAGEURL !== matched.image) {
      try {
        await databases.updateDocument(DATABASE_ID, 'products', doc.$id, { IMAGEURL: matched.image });
      } catch(e){}
    }
  }

  console.log('✅ Base de datos de Appwrite actualizada con las nuevas imágenes.');
}

run();
