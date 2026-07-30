/**
 * Agrega atributos faltantes a la colección discount_coupons.
 * - userRestriction (string) — usado en admin/coupons
 * - USERRESTRICTION (string) — usado en loyaltyService
 *
 * Uso: npx tsx scripts/add-coupon-attrs.ts
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
  console.error('❌ Set APPWRITE_API_KEY in .env.local');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const db = new Databases(client);

const COUPONS_COLLECTION_ID = 'discount_coupons';

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
  console.log('\n🎫 Agregando atributos faltantes a discount_coupons...\n');

  await createAttr(
    () => db.createStringAttribute(databaseId, COUPONS_COLLECTION_ID, 'userRestriction', 256, false),
    'userRestriction (string 256)',
  );

  await createAttr(
    () => db.createStringAttribute(databaseId, COUPONS_COLLECTION_ID, 'USERRESTRICTION', 256, false),
    'USERRESTRICTION (string 256)',
  );

  console.log('\n⏳ Espera ~30s para que Appwrite procese los atributos.');
  console.log('✅ Listo.\n');
}

main().catch(console.error);
