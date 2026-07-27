const fs = require('fs');
const path = require('path');
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

// Firebase images array paste
const firebaseList = [
  {
    "sku": "160",
    "name": "CUCHILLO COLORES DESDE $160",
    "image": "https://firebasestorage.googleapis.com/v0/b/geminai-449212.firebasestorage.app/o/images%2F1782616087374_42vd5b3t9.webp?alt=media&token=7ca19598-e602-4e6f-8027-1e5b741945fc"
  },
  {
    "sku": "350",
    "name": "Set esponja acero inoxidable 4pcs DESDE $350",
    "image": "https://firebasestorage.googleapis.com/v0/b/geminai-449212.firebasestorage.app/o/images%2F1781814056364_6zynbdh0t.webp?alt=media&token=41cdc0f1-61df-405e-9382-4d4f5ce9c0a2"
  }
];

async function run() {
  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');

  const products = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));

  console.log('🔄 Procesando emparejamiento por nombre y SKU...');
  let updated = 0;

  firebaseList.forEach(item => {
    if (item.image && item.image.startsWith('https://')) {
      const match = products.find(p => 
        (item.sku && p.sku === item.sku) ||
        (item.name && p.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]))
      );

      if (match && !match.image) {
        match.image = item.image;
        updated++;
        console.log(` ✅ Vinculado: ${match.name} (SKU ${match.sku}) -> ${item.image}`);
      }
    }
  });

  fs.writeFileSync(jsonPath1, JSON.stringify(products, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(products, null, 2), 'utf8');

  // Actualizar Appwrite
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);

  const docsRes = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(500)]);
  for (const doc of docsRes.documents) {
    const matched = products.find(p => p.sku === doc.jumpseller_id || p.sku === doc.SKU || p.name === doc.NAME);
    if (matched && matched.image && doc.IMAGEURL !== matched.image) {
      try {
        await databases.updateDocument(DATABASE_ID, 'products', doc.$id, { IMAGEURL: matched.image });
      } catch(e){}
    }
  }

  console.log(`✅ Finalizado. ${updated} imágenes vinculadas.`);
}

run();
