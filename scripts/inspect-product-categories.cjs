const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}
const { Client, Databases, Query } = require('node-appwrite');
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90')
  .setKey(process.env.APPWRITE_API_KEY || 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655');
const db = new Databases(client);
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
async function getAll(collection) {
  const docs = [];
  let cursor = null;
  while (true) {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const response = await db.listDocuments(databaseId, collection, queries);
    docs.push(...response.documents);
    if (!response.documents.length || docs.length >= response.total) return docs;
    cursor = response.documents[response.documents.length - 1].$id;
  }
}
async function main() {
  const [categories, products] = await Promise.all([getAll('categories'), getAll('products')]);
  console.log('CATEGORIAS');
  categories.forEach(category => console.log(JSON.stringify({ id: category.$id, name: category.name, NAME: category.NAME })));
  console.log(`\nPRODUCTOS: ${products.length}`);
  products.forEach(product => console.log(JSON.stringify({ sku: product.sku, name: product.NAME, categoryId: product.CATEGORYID })));
}
main().catch(error => { console.error(error.message); process.exit(1); });
