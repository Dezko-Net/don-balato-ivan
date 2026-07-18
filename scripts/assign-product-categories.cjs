const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}
const { Client, Databases, Query } = require('node-appwrite');
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90')
  .setKey(process.env.APPWRITE_API_KEY || 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655');
const db = new Databases(client);
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';

const CATEGORY_IDS = {
  skincare: '6a4f053debeebb389cda',
  otros: '6a4f053e4611fcc4e759',
  rubor: '6a4f053e929ab4320ff0',
  tonicos: '6a4f053ee68fd84b4912',
  cabello: '6a4f053f3fbf32cbec61',
  limpiadores: '6a4f053f8d4bc567ed54',
  desmaquillantes: '6a4f053fdaa33c0fcf34',
  exfoliantes: '6a4f0540345c6788e395',
  manos: '6a4f0540859e974ccbae',
  pies: '6a4f0540d41c16f94780',
  corporal: '6a4f05412d8844fa3288',
  labiales: '6a4f05417c42ebd3ae1a',
  sombras: '6a4f0541c8fe91a69d4b',
  sets: '6a4f0542223369a4df89',
  setsMaquillaje: '6a4f0542707b197cf448',
  base: '6a4f0542bec353816ac6',
  corrector: '6a4f05431794f30d98ad',
  primer: '6a4f05436553bd035d40',
  equiposUnas: '6a4f0543b2658328f67d',
  polvos: '6a4f054409df7788e6d1',
  mascara: '6a4f054456db34924f84',
  fijador: '6a4f0544a4f6c448ef43',
  aromaterapia: '6a4f0544f2cf437c99c6',
  organizadores: '6a4f05454f1a3943d275',
  brochas: '6a4f05459e7d4a7faf0e',
  esponjas: '6a4f0545ee7c6b904945',
  herramientasBelleza: '6a4f054648b81755a65a',
  manicura: '6a4f05469d8132c8f030',
  pestanasAccesorios: '6a4f0546ea84774f65de',
  secadores: '6a4f05474a0c406f5c27',
  maquinasCorte: '6a4f054799bc3eac8726',
  peluqueria: '6a4f0547ea81adcc39c7',
  maletines: '6a4f054846a0ca0bc590',
  empaques: '6a4f05489894cc59645a',
  maquillaje: '6a57e7d9003d9917acdf',
  accesorios: '6a57e83b000dbf6dd49f',
};

function normalize(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function categoryFor(name) {
  const n = normalize(name);
  const has = (...words) => words.some(word => n.includes(word));

  // Specific product types first, before generic skincare/maquillaje rules.
  if (has('set de', 'set ', 'kit ', 'paleta de')) return CATEGORY_IDS.setsMaquillaje;
  if (has('toallita', 'desmaquill')) return CATEGORY_IDS.desmaquillantes;
  if (has('limpiador', 'mousse limpiador', 'gel limpiador')) return CATEGORY_IDS.limpiadores;
  if (has('exfolian')) return CATEGORY_IDS.exfoliantes;
  if (has('tonico', 'esencia')) return CATEGORY_IDS.tonicos;
  if (has('mascarilla', 'serum', 'crema facial', 'locion hidratante', 'agua micelar')) return CATEGORY_IDS.skincare;
  if (has('cuidado de manos', 'crema de manos', 'manos')) return CATEGORY_IDS.manos;
  if (has('cuidado de pies', 'crema de pies', 'pies')) return CATEGORY_IDS.pies;
  if (has('cuidado corporal', 'locion corporal', 'crema corporal', 'cuerpo')) return CATEGORY_IDS.corporal;
  if (has('rubor', 'iluminador', 'blush')) return CATEGORY_IDS.rubor;
  if (has('sombra', 'sombras')) return CATEGORY_IDS.sombras;
  if (has('base de maquillaje', 'base liquida', 'base facial')) return CATEGORY_IDS.base;
  if (has('corrector')) return CATEGORY_IDS.corrector;
  if (has('primer')) return CATEGORY_IDS.primer;
  if (has('polvo facial', 'polvo compacto', 'polvos')) return CATEGORY_IDS.polvos;
  if (has('mascara de pesta', 'mascara pesta', 'rimel')) return CATEGORY_IDS.mascara;
  if (has('fijador de maquillaje', 'spray fijador')) return CATEGORY_IDS.fijador;
  if (has('labial', 'brillo de labios', 'brillo labial', 'balsamo labial', 'aceite de labios')) return CATEGORY_IDS.labiales;
  if (has('brocha', 'pincel')) return CATEGORY_IDS.brochas;
  if (has('esponja')) return CATEGORY_IDS.esponjas;
  if (has('delineador', 'maquillaje', 'makeup')) return CATEGORY_IDS.maquillaje;
  if (has('secador')) return CATEGORY_IDS.secadores;
  if (has('maquina de corte', 'maquina corta')) return CATEGORY_IDS.maquinasCorte;
  if (has('peluquer', 'peine', 'cepillo')) return CATEGORY_IDS.peluqueria;
  if (has('manicura', 'unas', 'uñas')) return CATEGORY_IDS.manicura;
  if (has('pestana postiza', 'pestanas postizas', 'pestana', 'pestanas')) return CATEGORY_IDS.pestanasAccesorios;
  if (has('empaque', 'caja de regalo', 'regalo')) return CATEGORY_IDS.empaques;
  if (has('organizador', 'maletin')) return CATEGORY_IDS.organizadores;
  return CATEGORY_IDS.otros;
}

async function getAll(collection) {
  const docs = [];
  let cursor = null;
  while (true) {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const response = await db.listDocuments(databaseId, collection, queries);
    docs.push(...response.documents);
    if (!response.documents.length || docs.length >= response.total) return docs;
    cursor = response.documents[response.documents.length - 1].$id;
  }
}

async function main() {
  const products = await getAll('products');
  const counts = new Map();
  let updated = 0;

  for (const product of products) {
    const categoryId = categoryFor(product.NAME);
    await db.updateDocument(databaseId, 'products', product.$id, { CATEGORYID: categoryId });
    counts.set(categoryId, (counts.get(categoryId) || 0) + 1);
    updated++;
    if (updated % 25 === 0) console.log(`Actualizados: ${updated}/${products.length}`);
  }

  console.log(`\nTotal actualizados: ${updated}`);
  console.log('Distribucion por categoria:');
  for (const [categoryId, count] of counts) console.log(`  ${categoryId}: ${count}`);
}

main().catch(error => { console.error('Fatal:', error.message); process.exit(1); });
