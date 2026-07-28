const { Client, Databases } = require('appwrite');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan');

const databases = new Databases(client);
const DATABASE_ID = '6a62e7440033d2278d28';

async function main() {
  try {
    const res = await databases.listDocuments(DATABASE_ID, 'categories', []);
    console.log('Categories:', JSON.stringify(res.documents.map(d => ({ id: d.$id, name: d.name })), null, 2));

    const res2 = await databases.listDocuments(DATABASE_ID, 'subcategories', []);
    console.log('Subcategories:', JSON.stringify(res2.documents.map(d => ({ id: d.$id, name: d.name, categoryId: d.categoryId })), null, 2));
  } catch(e) {
    console.error('Error:', e.message);
  }
}

main();
