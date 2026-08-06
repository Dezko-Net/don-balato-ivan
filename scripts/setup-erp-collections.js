const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const headers = {
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
  'Content-Type': 'application/json',
};

async function api(path, method = 'GET', body = null) {
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${APPWRITE_ENDPOINT}${path}`, options);
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json };
}

async function createCollection(collectionId, name) {
  console.log(`Verificando/Creando colección '${collectionId}' (${name})...`);
  const check = await api(`/databases/${DATABASE_ID}/collections/${collectionId}`);
  if (check.ok) {
    console.log(`  ✅ Colección '${collectionId}' ya existe.`);
    return true;
  }
  const create = await api(`/databases/${DATABASE_ID}/collections`, 'POST', {
    collectionId,
    name,
    permissions: ['read("any")', 'create("any")', 'update("any")', 'delete("any")'],
    documentSecurity: false,
  });
  if (create.ok) {
    console.log(`  🎉 Creada colección '${collectionId}'!`);
    return true;
  } else {
    console.error(`  ❌ Error creando '${collectionId}':`, create.data.message || create.data);
    return false;
  }
}

async function addStringAttribute(collectionId, key, size = 255, required = false, defaultVal = undefined) {
  const body = { key, size, required };
  if (defaultVal !== undefined) body.default = defaultVal;
  const res = await api(`/databases/${DATABASE_ID}/collections/${collectionId}/attributes/string`, 'POST', body);
  if (res.ok) console.log(`    + Atributo string '${key}' (${size}) agregado.`);
  else if (res.data?.type === 'attribute_already_exists') console.log(`    = Atributo '${key}' ya existe.`);
  else console.warn(`    ⚠️ Atributo '${key}' warning:`, res.data?.message || res.data);
}

async function addNumberAttribute(collectionId, key, required = false, defaultVal = undefined) {
  const body = { key, required };
  if (defaultVal !== undefined) body.default = defaultVal;
  const res = await api(`/databases/${DATABASE_ID}/collections/${collectionId}/attributes/float`, 'POST', body);
  if (res.ok) console.log(`    + Atributo float '${key}' agregado.`);
  else if (res.data?.type === 'attribute_already_exists') console.log(`    = Atributo '${key}' ya existe.`);
  else console.warn(`    ⚠️ Atributo '${key}' warning:`, res.data?.message || res.data);
}

async function addBooleanAttribute(collectionId, key, required = false, defaultVal = true) {
  const body = { key, required, default: defaultVal };
  const res = await api(`/databases/${DATABASE_ID}/collections/${collectionId}/attributes/boolean`, 'POST', body);
  if (res.ok) console.log(`    + Atributo boolean '${key}' agregado.`);
  else if (res.data?.type === 'attribute_already_exists') console.log(`    = Atributo '${key}' ya existe.`);
  else console.warn(`    ⚠️ Atributo '${key}' warning:`, res.data?.message || res.data);
}

async function main() {
  console.log('🚀 Iniciando creación de colecciones ERP & POS en Appwrite...\n');

  // 1. trabajadores_erp
  await createCollection('trabajadores_erp', 'Trabajadores ERP');
  await addStringAttribute('trabajadores_erp', 'nombre', 255);
  await addStringAttribute('trabajadores_erp', 'cargo', 255);
  await addStringAttribute('trabajadores_erp', 'sede', 255);
  await addNumberAttribute('trabajadores_erp', 'sueldo', false, 0);
  await addStringAttribute('trabajadores_erp', 'fotoUrl', 1000, false, '');
  await addBooleanAttribute('trabajadores_erp', 'activo', false, true);
  await addStringAttribute('trabajadores_erp', 'nacionalidad', 255, false, '');
  await addStringAttribute('trabajadores_erp', 'genero', 255, false, '');
  await addStringAttribute('trabajadores_erp', 'fechaIngreso', 255, false, '');

  // 2. inventory_products
  await createCollection('inventory_products', 'Inventario ERP');
  await addStringAttribute('inventory_products', 'name', 255);
  await addStringAttribute('inventory_products', 'sku', 255);
  await addNumberAttribute('inventory_products', 'price', false, 0);
  await addNumberAttribute('inventory_products', 'cost', false, 0);
  await addNumberAttribute('inventory_products', 'stock', false, 0);
  await addStringAttribute('inventory_products', 'sede', 255, false, 'alameda');
  await addStringAttribute('inventory_products', 'category', 255, false, '');
  await addStringAttribute('inventory_products', 'imageUrl', 1000, false, '');

  // 3. pos_sales
  await createCollection('pos_sales', 'Ventas POS');
  await addStringAttribute('pos_sales', 'saleId', 255);
  await addNumberAttribute('pos_sales', 'total', false, 0);
  await addStringAttribute('pos_sales', 'paymentMethod', 255, false, 'EFECTIVO');
  await addStringAttribute('pos_sales', 'sede', 255, false, 'alameda');
  await addStringAttribute('pos_sales', 'cajeroId', 255, false, '');
  await addStringAttribute('pos_sales', 'cajeroNombre', 255, false, '');
  await addStringAttribute('pos_sales', 'itemsJson', 10000, false, '[]');
  await addStringAttribute('pos_sales', 'createdAt', 255, false, '');

  // 4. pos_shifts
  await createCollection('pos_shifts', 'Turnos POS');
  await addStringAttribute('pos_shifts', 'shiftId', 255);
  await addStringAttribute('pos_shifts', 'sede', 255, false, 'alameda');
  await addStringAttribute('pos_shifts', 'cajeroId', 255, false, '');
  await addNumberAttribute('pos_shifts', 'montoInicial', false, 0);
  await addNumberAttribute('pos_shifts', 'montoFinal', false, 0);
  await addStringAttribute('pos_shifts', 'estado', 255, false, 'ABIERTO');
  await addStringAttribute('pos_shifts', 'openedAt', 255, false, '');
  await addStringAttribute('pos_shifts', 'closedAt', 255, false, '');

  console.log('\n✨ ¡Proceso completado con éxito!');
}

main().catch(console.error);
