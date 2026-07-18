const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const { Client, Databases, Query } = require('node-appwrite');
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90')
  .setKey(process.env.APPWRITE_API_KEY || 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655');
const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const PRODUCTS_COLLECTION = 'products';

async function main() {
  let totalDeleted = 0;
  let batch = 0;

  while (true) {
    const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [
      Query.limit(100)
    ]);

    if (!res.documents || res.documents.length === 0) break;

    const ids = res.documents.map(d => d.$id);
    
    // Delete one by one (Appwrite doesn't have bulk delete in REST)
    for (const id of ids) {
      try {
        await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION, id);
        totalDeleted++;
      } catch (e) {
        console.error(`Error borrando ${id}: ${e.message}`);
      }
    }

    batch++;
    console.log(`Batch ${batch}: ${totalDeleted} productos eliminados...`);
  }

  console.log(`\nTotal eliminados: ${totalDeleted}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
