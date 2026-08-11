/**
 * Crea los atributos PACK_MIN_PACKS y PACK_DISCOUNT_PCT en la colección products
 * para soportar precio por volumen con % de descuento.
 */
const fs = require('fs');
const path = require('path');

const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const apiKey = envLocal.match(/APPWRITE_API_KEY=(.+)/)?.[1]?.trim();
const projectId = envLocal.match(/NEXT_PUBLIC_APPWRITE_PROJECT_ID=(.+)/)?.[1]?.trim();
const endpoint = envLocal.match(/NEXT_PUBLIC_APPWRITE_ENDPOINT=(.+)/)?.[1]?.trim();
const databaseId = envLocal.match(/NEXT_PUBLIC_APPWRITE_DATABASE_ID=(.+)/)?.[1]?.trim() || '6a62e7440033d2278d28';

if (!apiKey || !projectId || !endpoint) {
  console.error('Faltan credenciales de Appwrite en .env.local');
  process.exit(1);
}

const COLLECTION_ID = 'products';
const ATTRIBUTES = [
  { key: 'PACK_MIN_PACKS', type: 'integer', size: 4, default: 0 },
  { key: 'PACK_DISCOUNT_PCT', type: 'integer', size: 4, default: 0 },
];

async function main() {
  for (const attr of ATTRIBUTES) {
    const url = `${endpoint}/databases/${databaseId}/collections/${COLLECTION_ID}/attributes/${attr.type}`;
    console.log(`Creando atributo ${attr.key}...`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: attr.key,
          type: attr.type,
          size: attr.size,
          required: false,
          default: attr.default,
        }),
      });
      const text = await res.text();
      console.log(`  Status: ${res.status}, URL: ${url}`);
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text.substring(0, 200) }; }
      if (res.ok) {
        console.log(`✓ ${attr.key} creado:`, data.$id);
      } else {
        console.error(`✗ ${attr.key} error:`, data.message || JSON.stringify(data));
      }
    } catch (e) {
      console.error(`✗ ${attr.key} excepción:`, e.message);
    }
  }
  console.log('\nListo. Espera unos segundos a que Appwrite indexe los atributos.');
}

main();
