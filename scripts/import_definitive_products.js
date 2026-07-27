// Script: import_definitive_products.js
// Importa masivamente los productos de catalogo-unificado/products.json a Appwrite

const fs = require('fs');
const path = require('path');
const { Client, Databases, ID, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

async function runImport() {
  try {
    const jsonPath = path.join(__dirname, '..', 'catalogo-unificado', 'products.json');
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ No se encontró el archivo ${jsonPath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const items = JSON.parse(rawData);
    console.log(`📦 Encontrados ${items.length} productos para importar en ${jsonPath}`);

    // 1. Obtener o crear categorías
    const categoryMap = new Map(); // catName -> catId
    const existingCatsRes = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION, [Query.limit(500)]);
    existingCatsRes.documents.forEach(doc => {
      if (doc.name) categoryMap.set(doc.name.trim().toLowerCase(), doc.$id);
    });

    const uniqueCats = [...new Set(items.map(i => (i.category || 'General').trim()))];
    console.log(`📂 Procesando ${uniqueCats.length} categorías únicas...`);

    for (const catName of uniqueCats) {
      const lower = catName.toLowerCase();
      if (!categoryMap.has(lower)) {
        try {
          const newCat = await databases.createDocument(DATABASE_ID, CATEGORIES_COLLECTION, ID.unique(), {
            name: catName,
            slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          });
          categoryMap.set(lower, newCat.$id);
          console.log(`  ➕ Creada categoría: "${catName}" (${newCat.$id})`);
        } catch (catErr) {
          console.error(`  ⚠️ Error creando categoría "${catName}":`, catErr.message);
        }
      }
    }

    // 2. Importar productos
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const sku = item.sku || `SKU-${i + 1}`;
      const name = item.name || 'Producto sin nombre';
      const price = Number(item.priceA) || Number(item.priceB) || 0;
      const catalogPrice = Number(item.priceB) || price;
      const stock = Number(item.stock) || 999;
      const catName = (item.category || 'General').trim().toLowerCase();
      const categoryId = categoryMap.get(catName) || '';
      const imageUrl = item.image || '';

      const payload = {
        NAME: name,
        DESCRIPTION: `SKU: ${sku} - ${name}`,
        PRICE: price,
        STOCK: stock,
        COST: 0,
        CURRENTPRICE: null,
        WHOLESALEPRICE: catalogPrice,
        CATALOGPRICE: catalogPrice,
        WHOLESALEMINQUANTITY: 1,
        PACKQTY: 1,
        IMAGEURL: imageUrl,
        IMAGEURL2: '',
        IMAGEURL3: '',
        CATEGORYID: categoryId,
        SUBCATEGORYID: '',
        ISACTIVE: true,
        jumpseller_id: sku,
      };

      try {
        await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION, ID.unique(), payload);
        imported++;
        if ((i + 1) % 20 === 0 || i + 1 === items.length) {
          console.log(` Progress: ${i + 1}/${items.length} productos procesados...`);
        }
      } catch (err) {
        errors++;
        console.error(` ❌ Error al importar SKU ${sku} (${name}):`, err.message);
      }
    }

    console.log(`\n🎉 IMPORTACIÓN FINALIZADA!`);
    console.log(`   ✅ Importados exitosamente: ${imported}`);
    console.log(`   ❌ Errores: ${errors}`);

  } catch (globalErr) {
    console.error('❌ Error global en runImport:', globalErr);
  }
}

runImport();
