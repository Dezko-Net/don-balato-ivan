/**
 * Agrega el atributo NIGHTORDER (boolean) a la colección orders.
 * Necesario para marcar pedidos nocturnos (6pm-9am) que pasan directo a stock confirmado.
 *
 * Uso: npx tsx scripts/add-night-order-attr.ts
 *
 * Requiere APPWRITE_API_KEY (desde Appwrite Dashboard > API Keys)
 * Ejemplo PowerShell:
 *   $env:APPWRITE_API_KEY="your-key"; npx tsx scripts/add-night-order-attr.ts
 */

import { Client, Databases } from 'node-appwrite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
} catch {}

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const apiKey = process.env.APPWRITE_API_KEY || '';

if (!apiKey) {
  console.error('❌ Set APPWRITE_API_KEY env var (from Appwrite Dashboard > API Keys)');
  console.error('   Example: $env:APPWRITE_API_KEY="your-key"; npx tsx scripts/add-night-order-attr.ts');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const db = new Databases(client);

const ORDERS_COLLECTION_ID = 'orders';

async function createAttr(fn: () => Promise<any>, label: string) {
  try {
    await fn();
    console.log(`  ✅ ${label}`);
  } catch (e: any) {
    if (e?.message?.includes('already exists') || e?.code === 409) {
      console.log(`  ⏭️  ${label} (ya existe)`);
    } else {
      console.error(`  ❌ ${label}: ${e?.message || e}`);
    }
  }
}

async function main() {
  console.log('\n🌙 Agregando NIGHTORDER a colección orders...\n');

  await createAttr(
    () => db.createBooleanAttribute(databaseId, ORDERS_COLLECTION_ID, 'NIGHTORDER', false),
    'NIGHTORDER (boolean)',
  );

  console.log('\n⏳ Espera ~30s para que Appwrite procese el atributo.');
  console.log('✅ Listo. Los pedidos nocturnos ahora se marcarán correctamente.\n');
}

main().catch(console.error);
