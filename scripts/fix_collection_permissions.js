const { Client, Databases, Permission, Role } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

async function fixPermissions() {
  try {
    const colsRes = await databases.listCollections(DATABASE_ID);
    console.log(`📦 Encontradas ${colsRes.collections.length} colecciones en Appwrite Database:`);

    for (const col of colsRes.collections) {
      console.log(`  - Colección: ${col.name} (ID: ${col.$id})`);
      try {
        await databases.updateCollection(
          DATABASE_ID,
          col.$id,
          col.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any())
          ],
          false, // documentSecurity
          true   // enabled
        );
        console.log(`  ✅ Permisos públicos asignados a la colección ${col.name}`);
      } catch (err) {
        console.error(`  ❌ Error asignando permisos a ${col.name}:`, err.message);
      }
    }
  } catch (err) {
    console.error('❌ Error listing collections:', err.message);
  }
}

fixPermissions();
