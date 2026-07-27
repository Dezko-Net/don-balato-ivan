const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { Client, Storage, Databases, ID, Query } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const BUCKET_ID = 'media';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const storage = new Storage(client);
const databases = new Databases(client);

function fetchFirestoreAll() {
  return new Promise((resolve) => {
    const url = 'https://firestore.googleapis.com/v1/projects/donbalatoivanchile/databases/(default)/documents/donbalatoivan_products?pageSize=300';
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const docs = parsed.documents || [];
          const items = docs.map(d => {
            const f = d.fields || {};
            return {
              sku: f.sku?.stringValue || f.SKU?.stringValue || f.id?.stringValue || '',
              name: f.name?.stringValue || f.NAME?.stringValue || '',
              image: f.image?.stringValue || f.IMAGEURL?.stringValue || f.imageUrl?.stringValue || ''
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

function downloadBuffer(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) return resolve(null);
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode !== 200) return resolve(null);
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log('🔥 Obteniendo productos de Firebase Firestore donbalatoivanchile...');
  const firebaseProducts = await fetchFirestoreAll();
  console.log(`📦 Encontrados ${firebaseProducts.length} productos en Firebase Firestore.`);

  const appwriteDocs = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(500)]);
  console.log(`📦 Encontrados ${appwriteDocs.documents.length} productos en Appwrite Database.`);

  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');
  const localProducts = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));

  let synced = 0;

  for (const doc of appwriteDocs.documents) {
    // Si ya tiene una imagen valida en Appwrite Storage, continuar
    if (doc.IMAGEURL && doc.IMAGEURL.includes('cloud.appwrite.io') && doc.IMAGEURL.includes('/storage/')) {
      continue;
    }

    // Buscar en Firebase
    const fbMatch = firebaseProducts.find(f => 
      (f.sku && (f.sku === doc.jumpseller_id || f.sku === doc.SKU)) ||
      (f.name && doc.NAME && f.name.toLowerCase().trim() === doc.NAME.toLowerCase().trim())
    );

    const imageUrlToUse = fbMatch?.image || doc.IMAGEURL;

    if (!imageUrlToUse || !imageUrlToUse.startsWith('http')) {
      continue;
    }

    console.log(` ⬇️ Descargando imagen para: [SKU ${doc.SKU || doc.jumpseller_id}] ${doc.NAME}...`);
    const buffer = await downloadBuffer(imageUrlToUse);

    if (buffer && buffer.length > 100) {
      try {
        const filename = `prod_${doc.SKU || doc.jumpseller_id || ID.unique()}.webp`;
        console.log(` ⬆️ Subiendo a Appwrite Storage bucket 'media'...`);
        
        const fileRes = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          InputFile.fromBuffer(buffer, filename)
        );

        const appwriteUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileRes.$id}/view?project=${PROJECT_ID}`;

        await databases.updateDocument(DATABASE_ID, 'products', doc.$id, {
          IMAGEURL: appwriteUrl
        });

        const localMatch = localProducts.find(p => p.sku === doc.jumpseller_id || p.sku === doc.SKU || p.name === doc.NAME);
        if (localMatch) {
          localMatch.image = appwriteUrl;
        }

        synced++;
        console.log(` ✅ Vinculado exitosamente a Appwrite: ${appwriteUrl}`);
      } catch (err) {
        console.error(` ❌ Error al subir a Appwrite para ${doc.NAME}:`, err.message);
      }
    }
  }

  fs.writeFileSync(jsonPath1, JSON.stringify(localProducts, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(localProducts, null, 2), 'utf8');

  console.log(`\n🎉 COMPLETADO: ${synced} imágenes recuperadas de Firebase y sincronizadas nativamente en Appwrite Storage y Admin Database.`);
}

run();
