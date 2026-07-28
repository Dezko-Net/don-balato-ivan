const { Client, Databases, ID } = require('appwrite');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan');

const databases = new Databases(client);
const DATABASE_ID = '6a62e7440033d2278d28';
const PRODUCTS_COLLECTION_ID = 'products';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const remaining = [
  { name: 'Parlante led oferta', catId: 'cat_hogar_cocina', subId: 'sub_audio_parlantes', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Colgador zapatero', catId: 'cat_hogar_cocina', subId: 'sub_organizacion_especies', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Esquinero de baño', catId: 'cat_hogar_cocina', subId: 'sub_organizacion_especies', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Baño sanitario mascota', catId: 'cat_mascotas', subId: 'sub_higiene_mascotas', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Removedor de callo recargable', catId: 'cat_hogar_cocina', subId: 'sub_accesorios_gadgets', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Tiral led neon 5 metros', catId: 'cat_hogar_cocina', subId: 'sub_iluminacion_solar', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Audifono ultra pods', catId: 'cat_hogar_cocina', subId: 'sub_audifonos_auriculares', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Audifono con pantalla', catId: 'cat_hogar_cocina', subId: 'sub_audifonos_auriculares', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Cepillo magico 5 en 1', catId: 'cat_mascotas', subId: 'sub_accesorios_mascotas', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Cartuchera 3d kawaii', catId: 'cat_juguetes_ninos', subId: 'sub_escolar_infantil', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'Espejo retrovisor con camara full jd', catId: 'cat_hogar_cocina', subId: 'sub_accesorios_gadgets', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
  { name: 'CHISPERO  ELÉCTRICO', catId: 'cat_hogar_cocina', subId: 'sub_iluminacion_solar', price: 0, stock: 0, wholesale: 0, minWholesale: 1, img: '', desc: '', tags: [], features: [] },
];

async function main() {
  console.log(`Subiendo ${remaining.length} productos restantes con pausas de 2s...`);
  let created = 0;
  let errors = 0;

  for (let i = 0; i < remaining.length; i++) {
    const p = remaining[i];
    try {
      const payload = {
        NAME: p.name,
        DESCRIPTION: p.desc,
        PRICE: p.price,
        STOCK: p.stock,
        COST: 0,
        WHOLESALEPRICE: p.wholesale,
        WHOLESALEMINQUANTITY: p.minWholesale,
        CATALOGPRICE: p.wholesale,
        IMAGEURL: p.img,
        IMAGEURL2: '',
        IMAGEURL3: '',
        CATEGORYID: p.catId,
        SUBCATEGORYID: p.subId,
        TAGS: p.tags,
        FEATURES: p.features,
        ISACTIVE: true,
        ISFEATURED: false,
        SOLDQUANTITY: 0,
      };

      const doc = await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, ID.unique(), payload);
      created++;
      console.log(`  ✅ [${i + 1}/${remaining.length}] ${doc.NAME}`);
    } catch (e) {
      errors++;
      console.error(`  ❌ [${i + 1}/${remaining.length}] ${p.name}: ${e.message}`);
    }
    if (i < remaining.length - 1) await sleep(2000);
  }

  console.log(`\n🎉 ${created} creados, ${errors} errores.`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
