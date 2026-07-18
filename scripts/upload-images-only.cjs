const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const { Client, Databases, Storage, Query, ID } = require('node-appwrite');

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90')
  .setKey(process.env.APPWRITE_API_KEY || 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655');

const databases = new Databases(client);
const storage = new Storage(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const PRODUCTS_COLLECTION = 'products';
const MEDIA_BUCKET_ID = '6a15f9a5001070a3c408';
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';

async function main() {
  // Get all products
  console.log('1. Obteniendo productos de Appwrite...');
  const products = [];
  let cursor = null;
  while (true) {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, queries);
    if (!res.documents || res.documents.length === 0) break;
    products.push(...res.documents);
    cursor = res.documents[res.documents.length - 1].$id;
    if (products.length >= res.total) break;
  }
  console.log(`   ${products.length} productos encontrados.`);

  // Build SKU -> product map
  const productMap = new Map();
  for (const p of products) {
    const sku = p.sku || '';
    if (sku) productMap.set(sku, p);
  }

  // Read HD images
  const imgDir = path.join(process.cwd(), 'excels', 'imagenes-cortadas');
  const imgFiles = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  console.log(`2. ${imgFiles.length} imagenes cortadas para subir.`);

  let uploaded = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < imgFiles.length; i++) {
    const file = imgFiles[i];
    const sku = path.basename(file, path.extname(file));
    const filePath = path.join(imgDir, file);

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const fileExt = path.extname(file);
      const fileId = ID.unique();
      
      // Use Node.js File from buffer (Node 20+)
      const nodeFile = new File([fileBuffer], `products/${sku}${fileExt}`, {
        type: fileExt === '.png' ? 'image/png' : 'image/jpeg',
      });
      
      await storage.createFile(MEDIA_BUCKET_ID, fileId, nodeFile);
      const imageUrl = `${ENDPOINT}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;

      // Update product with image URL
      const product = productMap.get(sku);
      if (product) {
        await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, product.$id, {
          IMAGEURL: imageUrl,
        });
        uploaded++;
      } else {
        console.log(`   Producto no encontrado para SKU: ${sku}`);
        failed++;
      }

      if ((i + 1) % 10 === 0) {
        console.log(`   Progreso: ${i + 1}/${imgFiles.length} (subidas: ${uploaded}, errores: ${failed})`);
      }
    } catch (e) {
      failed++;
      errors.push(`${sku}: ${e.message}`);
      if (failed <= 5) console.error(`   Error: ${sku}: ${e.message}`);
    }
  }

  console.log(`\n3. Resultado:`);
  console.log(`   Imagenes subidas: ${uploaded}`);
  console.log(`   Errores: ${failed}`);
  if (errors.length > 0) {
    console.log(`   Primeros 5 errores:`);
    errors.slice(0, 5).forEach(e => console.log(`     - ${e}`));
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
