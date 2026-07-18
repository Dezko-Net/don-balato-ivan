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
const CATEGORIES_COLLECTION = 'categories';
const MEDIA_BUCKET_ID = '6a15f9a5001070a3c408';
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';

function setSkuInFeatures(features, sku) {
  let base = features || '';
  base = base.replace(/\n?SKU:\s*[^\n]*/gi, '').trim();
  return base ? `${base}\nSKU: ${sku}` : `SKU: ${sku}`;
}

function setBarcodeInFeatures(features, barcode) {
  if (!barcode) return features;
  let base = features || '';
  base = base.replace(/\n?BARCODE:\s*[^\n]*/gi, '').trim();
  return base ? `${base}\nBARCODE: ${barcode}` : `BARCODE: ${barcode}`;
}

async function main() {
  // STEP 1: Read Excel
  console.log('1. Leyendo Excel...');
  const excelPath = path.join(process.cwd(), 'excels', 'product.xlsx');
  const wb = XLSX.readFile(excelPath);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
  console.log(`   ${rows.length} productos en el Excel.`);

  // STEP 2: Create categories
  console.log('2. Creando categorias...');
  // Group by product type (we'll use a generic category since Excel doesn't have categories)
  // Let's create a single category for all products
  let categoryId = '';
  try {
    const existingCats = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION, [Query.limit(1)]);
    if (existingCats.documents.length > 0) {
      categoryId = existingCats.documents[0].$id;
    } else {
      const cat = await databases.createDocument(DATABASE_ID, CATEGORIES_COLLECTION, ID.unique(), {
        name: 'Productos',
      });
      categoryId = cat.$id;
    }
  } catch (e) {
    console.error('   Error creando categoria:', e.message);
  }
  console.log(`   Categoria ID: ${categoryId}`);

  // STEP 3: Upload images and create products
  console.log('3. Subiendo productos con imagenes...');
  const hdDir = path.join(process.cwd(), 'excels', 'imagenes-hd');
  const hdFiles = fs.existsSync(hdDir) ? fs.readdirSync(hdDir) : [];
  const hdMap = new Map();
  for (const f of hdFiles) {
    const baseName = path.basename(f, path.extname(f));
    hdMap.set(baseName, path.join(hdDir, f));
  }

  let created = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const sku = String(row['Codigo'] || '').trim();
    const name = String(row['Producto nombre 2'] || '').trim() || `Producto ${sku}`;
    const barcode = String(row['Código Barra 1'] || '').trim();
    const packQty = Math.round(Number(row['cantidad por paquete']) || 0) || 12;

    // 4 prices
    const priceDetalle = Math.round(Number(row['Precio Detalle (1-5pcs)']) || 0);
    const priceIntermedio = Math.round(Number(row['Precio Intermedio (6-11pcs)']) || 0);
    const priceMayor = Math.round(Number(row['Precio Mayor (12-23pcs)']) || 0);
    const priceCaja = Math.round(Number(row['Precio Caja (24+pcs)']) || 0);

    try {
      // Upload image if exists
      let imageUrl = '';
      const imgPath = hdMap.get(sku);
      if (imgPath && fs.existsSync(imgPath)) {
        try {
          const fileBuffer = fs.readFileSync(imgPath);
          const fileExt = path.extname(imgPath);
          const mimeType = fileExt === '.png' ? 'image/png' : 'image/jpeg';
          const fileId = ID.unique();
          // Use REST API directly for file upload
          const formData = new FormData();
          formData.append('fileId', fileId);
          formData.append('file', new Blob([fileBuffer], { type: mimeType }), `products/${sku}${fileExt}`);
          const uploadRes = await fetch(`${ENDPOINT}/storage/buckets/${MEDIA_BUCKET_ID}/files`, {
            method: 'POST',
            headers: {
              'X-Appwrite-Project': PROJECT_ID,
              'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
            },
            body: formData,
          });
          if (uploadRes.ok) {
            imageUrl = `${ENDPOINT}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
          } else {
            console.error(`   Error subiendo imagen ${sku}: ${await uploadRes.text()}`);
          }
        } catch (e) {
          console.error(`   Error subiendo imagen ${sku}: ${e.message}`);
        }
      }

      // Build features
      let features = setSkuInFeatures('', sku);
      features = setBarcodeInFeatures(features, barcode);

      // Create product
      const payload = {
        NAME: name,
        DESCRIPTION: name,
        PRICE: priceDetalle,
        STOCK: 96,
        COST: 0,
        CURRENTPRICE: null,
        WHOLESALEPRICE: priceMayor,
        WHOLESALEMINQUANTITY: packQty,
        PACKQTY: packQty,
        INTERMEDIATEPRICE: priceIntermedio,
        BOXPRICE: priceCaja,
        IMAGEURL: imageUrl,
        IMAGEURL2: '',
        IMAGEURL3: '',
        CATEGORYID: categoryId,
        FEATURES: features.split('\n').filter(Boolean),
        TAGS: ['productos'],
        sku: sku,
        barcode: barcode,
        ISACTIVE: true,
      };

      await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION, ID.unique(), payload);
      created++;

      if ((i + 1) % 10 === 0) {
        console.log(`   Progreso: ${i + 1}/${rows.length} (creados: ${created}, errores: ${failed})`);
      }
    } catch (e) {
      failed++;
      errors.push(`${sku}: ${e.message}`);
      if (failed <= 5) console.error(`   Error creando ${sku}: ${e.message}`);
    }
  }

  console.log(`\n4. Resultado:`);
  console.log(`   Productos creados: ${created}`);
  console.log(`   Errores: ${failed}`);
  if (errors.length > 0) {
    console.log(`   Primeros 5 errores:`);
    errors.slice(0, 5).forEach(e => console.log(`     - ${e}`));
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
