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

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const storage = new Storage(client);
const databases = new Databases(client);

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
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

async function processImages() {
  console.log('🚀 Iniciando migración de imágenes a Appwrite Storage (Bucket: media)...');
  
  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');

  const products = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));
  const docsRes = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(500)]);

  console.log(`📦 Encontrados ${docsRes.documents.length} productos en Appwrite.`);

  let uploadedCount = 0;
  let skippedCount = 0;

  for (const doc of docsRes.documents) {
    const currentUrl = doc.IMAGEURL || '';
    
    // Si la imagen ya está en Appwrite Storage (empieza con endpoint de appwrite/storage)
    if (currentUrl.includes('cloud.appwrite.io') && currentUrl.includes('/storage/')) {
      skippedCount++;
      continue;
    }

    const matchedLocal = products.find(p => p.sku === doc.jumpseller_id || p.sku === doc.SKU || p.name === doc.NAME);
    const sourceUrl = currentUrl || matchedLocal?.image;

    if (!sourceUrl || !sourceUrl.startsWith('http')) {
      skippedCount++;
      continue;
    }

    console.log(` ⬇️ Descargando imagen para: [SKU ${doc.SKU || doc.jumpseller_id}] ${doc.NAME}...`);
    const buffer = await downloadBuffer(sourceUrl);

    if (!buffer || buffer.length < 100) {
      console.log(` ⚠️ No se pudo descargar la imagen de ${sourceUrl}`);
      skippedCount++;
      continue;
    }

    const filename = `prod_${doc.SKU || doc.jumpseller_id || ID.unique()}.webp`;

    try {
      console.log(` ⬆️ Subiendo a Appwrite Storage bucket '${BUCKET_ID}'...`);
      const fileRes = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        InputFile.fromBuffer(buffer, filename)
      );

      const appwriteImageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileRes.$id}/view?project=${PROJECT_ID}`;

      // Actualizar documento en Appwrite
      await databases.updateDocument(DATABASE_ID, 'products', doc.$id, {
        IMAGEURL: appwriteImageUrl
      });

      // Actualizar local
      if (matchedLocal) {
        matchedLocal.image = appwriteImageUrl;
      }

      uploadedCount++;
      console.log(` ✅ Subida exitosa: ${appwriteImageUrl}`);
    } catch (err) {
      console.error(` ❌ Error subiendo a Appwrite para ${doc.NAME}:`, err.message);
    }
  }

  // Guardar JSONs
  fs.writeFileSync(jsonPath1, JSON.stringify(products, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(products, null, 2), 'utf8');

  console.log(`\n🎉 MIGRACIÓN COMPLETA A APPWRITE STORAGE:`);
  console.log(`   - Imágenes subidas y hospedadas en Appwrite: ${uploadedCount}`);
  console.log(`   - Productos omitidos (ya hospedados o sin imagen): ${skippedCount}`);
}

processImages();
