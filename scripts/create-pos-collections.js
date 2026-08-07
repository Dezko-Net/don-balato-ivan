// Script para crear colecciones y atributos del POS en Appwrite
// Ejecutar: node scripts/create-pos-collections.js

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = 'donbalatoivan';
const DATABASE_ID = '6a62e7440033d2278d28';
const API_KEY = 'standard_6cd1375a55fe6d93b6f0857404f29b5d3333dbf496213b6bea1afe3a0ead6c4489f9400f3cc3700c9f65573d5580239a5284aa99ea21f44cf07af1c96426aacc3ee9564048c035e0e5b26467316d9e56df117f52443748ff31cabfcaf1d336a0ef0519ede8e2924534aff4c7d98de556ba8ef52050cb6a349f8d4373faf46982';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

async function createCollection(collectionId, name) {
  const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections`;
  const body = {
    collectionId,
    name,
    permissions: ['read("any")', 'create("any")', 'update("any")', 'delete("any")'],
    documentSecurity: false,
  };
  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (res.ok) { console.log(`  ✅ Colección ${collectionId} creada`); return true; }
    const data = await res.json();
    if (data?.message?.includes('already exists') || data?.code === 409) {
      console.log(`  ℹ️  Colección ${collectionId} ya existe`);
      return true;
    }
    console.log(`  ❌ Error creando ${collectionId}: ${data?.message || `HTTP ${res.status}`}`);
    return false;
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
    return false;
  }
}

async function createAttr(collectionId, attr) {
  const typePath = attr.type === 'integer' ? 'integer' : attr.type === 'float' ? 'float' : attr.type === 'boolean' ? 'boolean' : 'string';
  const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/${typePath}`;
  const body = { key: attr.key, required: attr.required || false };
  if (attr.type === 'string') body.size = attr.size || 256;
  if (attr.default !== undefined && attr.default !== null) body.default = attr.default;
  if (attr.array !== undefined) body.array = attr.array;

  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (res.ok) { console.log(`    ✅ ${attr.key}`); return true; }
    const data = await res.json();
    if (data?.message?.includes('already exists') || data?.code === 409) {
      console.log(`    ℹ️  ${attr.key} ya existe`);
      return true;
    }
    console.log(`    ❌ ${attr.key}: ${data?.message || `HTTP ${res.status}`}`);
    return false;
  } catch (err) {
    console.log(`    ❌ ${attr.key}: ${err.message}`);
    return false;
  }
}

// ─── Definiciones de colecciones ─────────────────────────────────────────────

const COLLECTIONS = [
  {
    id: 'ventas_pos',
    name: 'Ventas POS',
    attrs: [
      { key: 'sede', type: 'string', size: 64, required: true },
      { key: 'cajeroNombre', type: 'string', size: 128 },
      { key: 'sesionCajaId', type: 'string', size: 128 },
      { key: 'fechaStr', type: 'string', size: 20 },
      { key: 'fechaTs', type: 'integer' }, // timestamp en ms
      { key: 'itemsJson', type: 'string', size: 30000 }, // items serializados como JSON
      { key: 'pagosJson', type: 'string', size: 4000 }, // pagos serializados como JSON
      { key: 'subtotal', type: 'integer' },
      { key: 'descuentoGlobalPct', type: 'integer' },
      { key: 'descuentoGlobal', type: 'integer' },
      { key: 'total', type: 'integer' },
      { key: 'vuelto', type: 'integer' },
      { key: 'estado', type: 'string', size: 32, default: 'completada' },
      { key: 'modoVenta', type: 'string', size: 32 },
      { key: 'tipoComprobante', type: 'string', size: 32, default: 'comprobante' },
      { key: 'boletaNumero', type: 'integer', default: 0 },
      { key: 'debitoOrdenNumero', type: 'integer' },
      { key: 'cobradoPorJefe', type: 'boolean', default: false },
      { key: 'jefeNombre', type: 'string', size: 128 },
      { key: 'cobradaEnTs', type: 'integer' },
      { key: 'anuladaEnTs', type: 'integer' },
      { key: 'anuladaPor', type: 'string', size: 128 },
      { key: 'motivoAnulacion', type: 'string', size: 500 },
      { key: 'createdAtTs', type: 'integer' },
    ],
  },
  {
    id: 'caja_sesiones',
    name: 'Caja Sesiones',
    attrs: [
      { key: 'sede', type: 'string', size: 64, required: true },
      { key: 'cajeroNombre', type: 'string', size: 128 },
      { key: 'estado', type: 'string', size: 32, default: 'abierta' },
      { key: 'montoApertura', type: 'integer', default: 0 },
      { key: 'ventasCount', type: 'integer', default: 0 },
      { key: 'totalVentas', type: 'integer', default: 0 },
      { key: 'totalEfectivo', type: 'integer', default: 0 },
      { key: 'totalDebito', type: 'integer', default: 0 },
      { key: 'totalTransferencia', type: 'integer', default: 0 },
      { key: 'aperturaAtTs', type: 'integer' }, // timestamp en ms
      { key: 'cierreAtTs', type: 'integer' },
      { key: 'montoCierre', type: 'integer' },
      { key: 'fechaStr', type: 'string', size: 20 },
    ],
  },
  {
    id: 'cortes_caja',
    name: 'Cortes de Caja',
    attrs: [
      { key: 'sesionCajaId', type: 'string', size: 128 },
      { key: 'sede', type: 'string', size: 64 },
      { key: 'cajeroNombre', type: 'string', size: 128 },
      { key: 'aperturaAtTs', type: 'integer' },
      { key: 'cierreAtTs', type: 'integer' },
      { key: 'fechaCierreStr', type: 'string', size: 20 },
      { key: 'horaCierreStr', type: 'string', size: 20 },
      { key: 'montoApertura', type: 'integer' },
      { key: 'ventasCount', type: 'integer' },
      { key: 'totalEfectivo', type: 'integer' },
      { key: 'totalDebito', type: 'integer' },
      { key: 'totalTransferencia', type: 'integer' },
      { key: 'totalVentas', type: 'integer' },
      { key: 'totalVueltos', type: 'integer' },
      { key: 'efectivoTeorico', type: 'integer' },
      { key: 'efectivoReal', type: 'integer' },
      { key: 'gastos', type: 'integer' },
      { key: 'gastosItemsJson', type: 'string', size: 10000 },
      { key: 'anulacionesItemsJson', type: 'string', size: 10000 },
      { key: 'devolucionesItemsJson', type: 'string', size: 10000 },
      { key: 'totalAnulaciones', type: 'integer' },
      { key: 'totalDevoluciones', type: 'integer' },
      { key: 'diferencia', type: 'integer' },
      { key: 'topProductsJson', type: 'string', size: 30000 },
      { key: 'costoProductos', type: 'integer' },
      { key: 'gananciaProductos', type: 'integer' },
      { key: 'createdAtTs', type: 'integer' },
    ],
  },
];

// ─── Ejecutar ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Creando colecciones del POS en Appwrite...\n');

  for (const col of COLLECTIONS) {
    console.log(`\n📋 ${col.name} (${col.id})`);
    const ok = await createCollection(col.id, col.name);
    if (!ok) continue;

    console.log('  Atributos:');
    for (const attr of col.attrs) {
      await createAttr(col.id, attr);
    }
  }

  console.log('\n✅ Done! Colecciones del POS creadas.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
