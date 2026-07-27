const fs = require('fs');
const path = require('path');
const { Client, Databases, ID, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

// Subcategorías estructuradas por categoría
const SUBCATEGORIES = [
  // 1. Hogar y Cocina (cat_hogar_cocina)
  { id: 'sub_cocina_electro', categoryId: 'cat_hogar_cocina', name: 'Cocina y Electrodomésticos', order: 1 },
  { id: 'sub_organizacion_especies', categoryId: 'cat_hogar_cocina', name: 'Organización y Especieros', order: 2 },
  { id: 'sub_utensilios_mesa', categoryId: 'cat_hogar_cocina', name: 'Utensilios y Cuchillería', order: 3 },
  { id: 'sub_limpieza_cocina', categoryId: 'cat_hogar_cocina', name: 'Paños y Esponjas de Cocina', order: 4 },

  // 2. Electrónica y Tecnología (cat_electronica_tech)
  { id: 'sub_audio_parlantes', categoryId: 'cat_electronica_tech', name: 'Audio y Parlantes', order: 1 },
  { id: 'sub_audifonos_auriculares', categoryId: 'cat_electronica_tech', name: 'Audífonos e In-Ear', order: 2 },
  { id: 'sub_iluminacion_solar', categoryId: 'cat_electronica_tech', name: 'Iluminación y Linternas Solares', order: 3 },
  { id: 'sub_accesorios_gadgets', categoryId: 'cat_electronica_tech', name: 'Gadgets y Tecnología', order: 4 },

  // 3. Moda y Calzado (cat_moda_calzado)
  { id: 'sub_calzado_pantuflas', categoryId: 'cat_moda_calzado', name: 'Calzado y Pantuflas', order: 1 },
  { id: 'sub_fajas_postura', categoryId: 'cat_moda_calzado', name: 'Fajas y Cuidado Corporal', order: 2 },
  { id: 'sub_belleza_cabello', categoryId: 'cat_moda_calzado', name: 'Belleza y Cabello', order: 3 },
  { id: 'sub_ropa_accesorios', categoryId: 'cat_moda_calzado', name: 'Ropa y Accesorios', order: 4 },

  // 4. Aseo y Limpieza (cat_aseo_limpieza)
  { id: 'sub_papel_higiene', categoryId: 'cat_aseo_limpieza', name: 'Papel e Higiene', order: 1 },
  { id: 'sub_detergentes_limpiadores', categoryId: 'cat_aseo_limpieza', name: 'Detergentes y Limpiadores', order: 2 },
  { id: 'sub_banos_toallas', categoryId: 'cat_aseo_limpieza', name: 'Artículos de Baño', order: 3 },

  // 5. Mascotas (cat_mascotas)
  { id: 'sub_higiene_mascotas', categoryId: 'cat_mascotas', name: 'Higiene y Cuidado Mascotas', order: 1 },
  { id: 'sub_accesorios_mascotas', categoryId: 'cat_mascotas', name: 'Cepillos y Juguetes Mascotas', order: 2 },

  // 6. Juguetes y Niños (cat_juguetes_ninos)
  { id: 'sub_juguetes_control', categoryId: 'cat_juguetes_ninos', name: 'Juguetes y Control Remoto', order: 1 },
  { id: 'sub_escolar_infantil', categoryId: 'cat_juguetes_ninos', name: 'Escolar e Infantil', order: 2 },
];

function classifySubcategory(name = '', categoryId = '') {
  const n = name.toLowerCase();

  if (categoryId === 'cat_hogar_cocina') {
    if (n.includes('especiero') || n.includes('escurridor') || n.includes('organizador') || n.includes('zapatero')) return 'sub_organizacion_especies';
    if (n.includes('utensilio') || n.includes('cuchillo') || n.includes('chispero') || n.includes('tabla')) return 'sub_utensilios_mesa';
    if (n.includes('paño') || n.includes('esponja') || n.includes('guante')) return 'sub_limpieza_cocina';
    return 'sub_cocina_electro'; // hervidor, batidora, sarten, mini waflera, palomita, etc.
  }

  if (categoryId === 'cat_electronica_tech') {
    if (n.includes('audifono') || n.includes('pods')) return 'sub_audifonos_auriculares';
    if (n.includes('linterna') || n.includes('solar') || n.includes('lampara') || n.includes('led') || n.includes('tira')) return 'sub_iluminacion_solar';
    if (n.includes('parlante') || n.includes('alexa') || n.includes('radio') || n.includes('soundbar') || n.includes('barra')) return 'sub_audio_parlantes';
    return 'sub_accesorios_gadgets'; // reloj, tensiometro, oximetro, alargador, soporte, etc.
  }

  if (categoryId === 'cat_moda_calzado') {
    if (n.includes('pantufla') || n.includes('pantuf')) return 'sub_calzado_pantuflas';
    if (n.includes('faja') || n.includes('postura') || n.includes('callo')) return 'sub_fajas_postura';
    if (n.includes('cepillo') || n.includes('corte') || n.includes('espejo')) return 'sub_belleza_cabello';
    return 'sub_ropa_accesorios'; // toalla secado, gorro, paragua, etc.
  }

  if (categoryId === 'cat_aseo_limpieza') {
    if (n.includes('papel') || n.includes('servilleta') || n.includes('cotonito')) return 'sub_papel_higiene';
    if (n.includes('detergente') || n.includes('pastilla') || n.includes('limpiador') || n.includes('suavizante')) return 'sub_detergentes_limpiadores';
    return 'sub_banos_toallas';
  }

  if (categoryId === 'cat_mascotas') {
    if (n.includes('arena') || n.includes('baño') || n.includes('sanitario')) return 'sub_higiene_mascotas';
    return 'sub_accesorios_mascotas';
  }

  if (categoryId === 'cat_juguetes_ninos') {
    if (n.includes('cartuchera') || n.includes('escolar')) return 'sub_escolar_infantil';
    return 'sub_juguetes_control';
  }

  return 'sub_cocina_electro';
}

async function run() {
  console.log('🚀 Creando subcategorías e integrando en los 133 productos...');

  // 1. Crear subcategorías en Appwrite
  const subMapNames = Object.fromEntries(SUBCATEGORIES.map(s => [s.id, s.name]));

  for (const sub of SUBCATEGORIES) {
    try {
      await databases.createDocument(DATABASE_ID, 'subcategories', sub.id, {
        name: sub.name,
        categoryId: sub.categoryId,
        order: sub.order,
      });
      console.log(` ✅ Subcategoría creada: ${sub.name} (Cat: ${sub.categoryId})`);
    } catch (err) {
      try {
        await databases.updateDocument(DATABASE_ID, 'subcategories', sub.id, {
          name: sub.name,
          categoryId: sub.categoryId,
          order: sub.order,
        });
        console.log(` 🔄 Subcategoría actualizada: ${sub.name}`);
      } catch (e) {
        console.error(` ❌ Error en subcategoría ${sub.name}:`, e.message);
      }
    }
  }

  // 2. Obtener productos
  const docsRes = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(500)]);

  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');
  const localProducts = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));

  const counts = {};

  for (const doc of docsRes.documents) {
    const catId = doc.CATEGORYID || 'cat_hogar_cocina';
    const subId = classifySubcategory(doc.NAME, catId);
    const subName = subMapNames[subId] || 'General';

    counts[subName] = (counts[subName] || 0) + 1;

    try {
      await databases.updateDocument(DATABASE_ID, 'products', doc.$id, {
        SUBCATEGORYID: subId
      });
    } catch (err) {
      console.error(` ❌ Error actualizando producto ${doc.NAME}:`, err.message);
    }

    const localMatch = localProducts.find(p => p.sku === doc.jumpseller_id || p.sku === doc.SKU || p.name === doc.NAME);
    if (localMatch) {
      localMatch.subcategoryId = subId;
      localMatch.subcategory = subName;
    }
  }

  fs.writeFileSync(jsonPath1, JSON.stringify(localProducts, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(localProducts, null, 2), 'utf8');

  console.log('\n📊 DISTRIBUCIÓN DE PRODUCTOS POR SUBCATEGORÍA:');
  Object.entries(counts).forEach(([sub, qty]) => {
    console.log(`   - ${sub}: ${qty} productos`);
  });

  console.log('\n🎉 ASIGNACIÓN DE SUBCATEGORÍAS FINALIZADA CON ÉXITO.');
}

run();
