import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID } from './src/lib/appwrite-admin';
import { Query } from 'node-appwrite';

async function verify() {
  const { databases } = getServices();
  const { databaseId } = getAppwriteConfig();

  const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
    Query.limit(20)
  ]);

  console.log(`Verifying ${res.documents.length} products...`);
  for (const doc of res.documents) {
    console.log(`Product: ${doc.NAME.substring(0, 30)}... | Brand: ${doc.BRAND}`);
  }
}

verify().catch(console.error);
