const { Client, Databases, Query } = require('appwrite');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan');

const databases = new Databases(client);
const DATABASE_ID = '6a62e7440033d2278d28';
const PRODUCTS_COLLECTION_ID = 'products';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const updates = [
  { name: 'Parlante led oferta', price: 2000, stock: 993, wholesale: 2000, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e010031dbbc8892/view?project=donbalatoivan', desc: 'SKU: Sku84 - Parlante led oferta', sku: 'Sku84', catId: 'cat_hogar_cocina', subId: 'sub_audio_parlantes' },
  { name: 'Colgador zapatero', price: 5500, stock: 999, wholesale: 5500, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e02002d00b2962a/view?project=donbalatoivan', desc: 'SKU: Sku87 - Colgador zapatero', sku: 'Sku87', catId: 'cat_hogar_cocina', subId: 'sub_organizacion_especies' },
  { name: 'Esquinero de baño', price: 5000, stock: 997, wholesale: 5000, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e0300252b751ee8/view?project=donbalatoivan', desc: 'SKU: Sku88 - Esquinero de baño', sku: 'Sku88', catId: 'cat_hogar_cocina', subId: 'sub_organizacion_especies' },
  { name: 'Baño sanitario mascota', price: 4000, stock: 999, wholesale: 4000, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e04001c9c6c6c67/view?project=donbalatoivan', desc: 'SKU: Sku89 - Baño sanitario mascota', sku: 'Sku89', catId: 'cat_mascotas', subId: 'sub_higiene_mascotas' },
  { name: 'Removedor de callo recargable', price: 2000, stock: 998, wholesale: 2000, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e05001571c0073e/view?project=donbalatoivan', desc: 'SKU: Sku90 - Removedor de callo recargable', sku: 'Sku90', catId: 'cat_hogar_cocina', subId: 'sub_accesorios_gadgets' },
  { name: 'Tiral led neon 5 metros', price: 3000, stock: 988, wholesale: 3000, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a6855dd0029618ef977/view?project=donbalatoivan', desc: 'SKU: Sku91 - Tiral led neon 5 metros', sku: 'Sku91', catId: 'cat_hogar_cocina', subId: 'sub_iluminacion_solar' },
  { name: 'Audifono ultra pods', price: 2000, stock: 992, wholesale: 2000, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e0700052118e569/view?project=donbalatoivan', desc: 'SKU: Sku92 - Audifono ultra pods', sku: 'Sku92', catId: 'cat_hogar_cocina', subId: 'sub_audifonos_auriculares' },
  { name: 'Audifono con pantalla', price: 4500, stock: 999, wholesale: 4500, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e07003dbd899ea3/view?project=donbalatoivan', desc: 'SKU: Sku96 - Audifono con pantalla', sku: 'Sku96', catId: 'cat_hogar_cocina', subId: 'sub_audifonos_auriculares' },
  { name: 'Cepillo magico 5 en 1', price: 2000, stock: 996, wholesale: 2000, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e09000f1a257e07/view?project=donbalatoivan', desc: 'SKU: Sku97 - Cepillo magico 5 en 1', sku: 'Sku97', catId: 'cat_mascotas', subId: 'sub_accesorios_mascotas' },
  { name: 'Cartuchera 3d kawaii', price: 500, stock: 993, wholesale: 500, minWholesale: 1, img: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/6a630e0a0007a5dd7a8b/view?project=donbalatoivan', desc: 'SKU: Sku98 - Cartuchera 3d kawaii', sku: 'Sku98', catId: 'cat_juguetes_ninos', subId: 'sub_escolar_infantil' },
  { name: 'Espejo retrovisor con camara full jd', price: 8500, stock: 999, wholesale: 8500, minWholesale: 1, img: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/CATALOGOEMPRENDEDOR/don-balato/198.webp', desc: 'SKU: 198 - Espejo retrovisor con camara full jd', sku: '198', catId: 'cat_hogar_cocina', subId: 'sub_accesorios_gadgets' },
  { name: 'CHISPERO  ELÉCTRICO', price: 1000, stock: 999, wholesale: 1000, minWholesale: 1, img: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/CATALOGOEMPRENDEDOR/don-balato/213.webp', desc: 'SKU: 213 - CHISPERO  ELÉCTRICO', sku: '213', catId: 'cat_hogar_cocina', subId: 'sub_iluminacion_solar' },
];

async function main() {
  console.log(`Actualizando ${updates.length} productos...`);
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < updates.length; i++) {
    const u = updates[i];
    try {
      // Find the product by name
      const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [
        Query.equal('NAME', u.name),
        Query.limit(1),
      ]);

      if (res.documents.length === 0) {
        console.error(`  ❌ [${i + 1}] No encontrado: ${u.name}`);
        errors++;
        continue;
      }

      const docId = res.documents[0].$id;
      const features = [`sku:${u.sku}`];

      const payload = {
        PRICE: u.price,
        STOCK: u.stock,
        COST: 0,
        WHOLESALEPRICE: u.wholesale,
        WHOLESALEMINQUANTITY: u.minWholesale,
        CATALOGPRICE: u.wholesale,
        IMAGEURL: u.img,
        DESCRIPTION: u.desc,
        CATEGORYID: u.catId,
        SUBCATEGORYID: u.subId,
        FEATURES: features,
        ISACTIVE: true,
      };

      await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, docId, payload);
      updated++;
      console.log(`  ✅ [${i + 1}/${updates.length}] ${u.name} → $${u.price}`);
    } catch (e) {
      errors++;
      console.error(`  ❌ [${i + 1}/${updates.length}] ${u.name}: ${e.message}`);
    }
    if (i < updates.length - 1) await sleep(1500);
  }

  console.log(`\n🎉 ${updated} actualizados, ${errors} errores.`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
