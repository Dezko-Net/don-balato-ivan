const { Client, Storage, Permission, Role } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const storage = new Storage(client);

async function fixPermissions() {
  try {
    const res = await storage.listBuckets();
    console.log(`📦 Encontrados ${res.buckets.length} buckets en Appwrite Storage:`);
    
    for (const b of res.buckets) {
      console.log(`  - Bucket: ${b.name} (ID: ${b.$id})`);
      try {
        await storage.updateBucket(
          b.$id,
          b.name,
          [Permission.read(Role.any())],
          false, // fileSecurity
          true   // enabled
        );
        console.log(`  ✅ Permiso de lectura pública asignado al bucket ${b.$id}`);
      } catch (err) {
        console.error(`  ❌ Error en bucket ${b.$id}:`, err.message);
      }
    }
  } catch (globalErr) {
    console.error('❌ Error listing buckets:', globalErr.message);
  }
}

fixPermissions();
