const fs = require('fs');
const path = require('path');
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

const SUBCATEGORIES_WITH_EMOJIS = [
  // 1. Hogar y Cocina
  { id: 'sub_cocina_electro', name: '🍳 Cocina y Electrodomésticos' },
  { id: 'sub_organizacion_especies', name: '🏺 Organización y Especieros' },
  { id: 'sub_utensilios_mesa', name: '🔪 Utensilios y Cuchillería' },
  { id: 'sub_limpieza_cocina', name: '🧽 Paños y Esponjas de Cocina' },

  // 2. Electrónica y Tecnología
  { id: 'sub_audio_parlantes', name: '🔊 Audio y Parlantes' },
  { id: 'sub_audifonos_auriculares', name: '🎧 Audífonos e In-Ear' },
  { id: 'sub_iluminacion_solar', name: '☀️ Iluminación y Linternas Solares' },
  { id: 'sub_accesorios_gadgets', name: '⌚ Gadgets y Tecnología' },

  // 3. Moda y Calzado
  { id: 'sub_calzado_pantuflas', name: '🩴 Calzado y Pantuflas' },
  { id: 'sub_fajas_postura', name: '⌛ Fajas y Cuidado Corporal' },
  { id: 'sub_belleza_cabello', name: '💇 Belleza y Cabello' },
  { id: 'sub_ropa_accesorios', name: '👗 Ropa y Accesorios' },

  // 4. Aseo y Limpieza
  { id: 'sub_papel_higiene', name: '🧻 Papel e Higiene' },
  { id: 'sub_detergentes_limpiadores', name: '🧴 Detergentes y Limpiadores' },
  { id: 'sub_banos_toallas', name: '🛁 Artículos de Baño' },

  // 5. Mascotas
  { id: 'sub_higiene_mascotas', name: '🐾 Higiene y Cuidado Mascotas' },
  { id: 'sub_accesorios_mascotas', name: '🎾 Cepillos y Juguetes Mascotas' },

  // 6. Juguetes y Niños
  { id: 'sub_juguetes_control', name: '🚗 Juguetes y Control Remoto' },
  { id: 'sub_escolar_infantil', name: '🎒 Escolar e Infantil' },
];

async function run() {
  console.log('✨ Añadiendo emojis a las 19 subcategorías...');

  const subMap = Object.fromEntries(SUBCATEGORIES_WITH_EMOJIS.map(s => [s.id, s.name]));

  // 1. Actualizar Appwrite subcategories collection
  for (const sub of SUBCATEGORIES_WITH_EMOJIS) {
    try {
      await databases.updateDocument(DATABASE_ID, 'subcategories', sub.id, {
        name: sub.name
      });
      console.log(` ✅ Emojis aplicados a Appwrite: ${sub.name}`);
    } catch (err) {
      console.error(` ❌ Error actualizando subcategoría ${sub.id}:`, err.message);
    }
  }

  // 2. Actualizar JSONs locales
  const jsonPath1 = path.join(__dirname, '../public/shopify/catalogo-original/products.json');
  const jsonPath2 = path.join(__dirname, '../catalogo-unificado/products.json');

  const localProducts = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));

  localProducts.forEach(p => {
    if (p.subcategoryId && subMap[p.subcategoryId]) {
      p.subcategory = subMap[p.subcategoryId];
    }
  });

  fs.writeFileSync(jsonPath1, JSON.stringify(localProducts, null, 2), 'utf8');
  fs.writeFileSync(jsonPath2, JSON.stringify(localProducts, null, 2), 'utf8');

  console.log('🎉 EMOJIS AGREGADOS A TODAS LAS SUBCATEGORÍAS CON ÉXITO.');
}

run();
