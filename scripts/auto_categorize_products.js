const fs = require('fs');
const path = require('path');
const { Client, Databases, ID, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

const CATEGORIES = [
  { id: 'cat_hogar_cocina', name: 'Hogar y Cocina' },
  { id: 'cat_electronica_tech', name: 'Electrónica y Tecnología' },
  { id: 'cat_moda_calzado', name: 'Moda y Calzado' },
  { id: 'cat_aseo_limpieza', name: 'Aseo y Limpieza' },
  { id: 'cat_mascotas', name: 'Mascotas' },
  { id: 'cat_juguetes_ninos', name: 'Juguetes y Niños' },
];

function classifyProduct(name = '') {
  const n = name.toLowerCase();
  if (n.includes('gato') || n.includes('mascota') || n.includes('perro') || n.includes('arena')) return 'cat_mascotas';
  if (n.includes('limpia') || n.includes('detergente') || n.includes('papel') || n.includes('lavadora') || 
      n.includes('toalla') || n.includes('cotonito') || n.includes('jabon') || n.includes('esponja') || 
      n.includes('paño') || n.includes('suavizante') || n.includes('servilleta') || n.includes('bolsa')) return 'cat_aseo_limpieza';
  if (n.includes('audifono') || n.includes('parlante') || n.includes('alexa') || n.includes('reloj') || 
      n.includes('linterna') || n.includes('radio') || n.includes('led') || n.includes('smart') || 
      n.includes('camara') || n.includes('power bank') || n.includes('tensiometro') || n.includes('oximetro') || 
      n.includes('usb') || n.includes('inalambrico') || n.includes('alargador') || n.includes('tv') || n.includes('bluetooth')) return 'cat_electronica_tech';
  if (n.includes('pantufla') || n.includes('faja') || n.includes('gorro') || n.includes('paragua') || 
      n.includes('cepillo') || n.includes('maquina de corte') || n.includes('cuchillo colores') || 
      n.includes('calentast') || n.includes('postura') || n.includes('callo')) return 'cat_moda_calzado';
  if (n.includes('juguete') || n.includes('burbuja') || n.includes('auto con control') || n.includes('cartuchera')) return 'cat_juguetes_ninos';
  return 'cat_hogar_cocina';
}

async function run() {
  console.log('🚀 Categorizando productos en Appwrite...');

  const docsRes = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(500)]);
  console.log(`📦 Encontrados ${docsRes.documents.length} productos.`);

  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');
  const localProducts = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));

  const categoryMapNames = Object.fromEntries(CATEGORIES.map(c => [c.id, c.name]));
  const counts = {};

  for (const doc of docsRes.documents) {
    const catId = classifyProduct(doc.NAME);
    const catName = categoryMapNames[catId];
    counts[catName] = (counts[catName] || 0) + 1;

    try {
      await databases.updateDocument(DATABASE_ID, 'products', doc.$id, {
        CATEGORYID: catId
      });
    } catch(err) {
      console.error(` Error en ${doc.NAME}:`, err.message);
    }

    const localMatch = localProducts.find(p => p.sku === doc.jumpseller_id || p.sku === doc.SKU || p.name === doc.NAME);
    if (localMatch) {
      localMatch.category = catName;
      localMatch.CATEGORYID = catId;
    }
  }

  fs.writeFileSync(jsonPath1, JSON.stringify(localProducts, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(localProducts, null, 2), 'utf8');

  console.log('\n📊 CATEGORÍAS ASIGNADAS CON ÉXITO:');
  Object.entries(counts).forEach(([cat, qty]) => {
    console.log(`   - ${cat}: ${qty} productos`);
  });
}

run();
