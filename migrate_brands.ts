import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID } from './src/lib/appwrite-admin';
import { Query } from 'node-appwrite';

async function migrate() {
  const { databases } = getServices();
  const { databaseId } = getAppwriteConfig();

  // Create attribute if it doesn't exist
  try {
    await databases.createStringAttribute(databaseId, PRODUCTS_COLLECTION_ID, 'BRAND', 255, false);
    console.log('Attributo BRAND creado. Esperando 5 segundos...');
    await new Promise(r => setTimeout(r, 5000));
  } catch (e: any) {
    if (e.code === 409) {
       console.log('Attributo BRAND ya existe.');
    } else {
       console.error('Error creando atributo:', e.message);
    }
  }

  // Fetch all products
  let allProducts: any[] = [];
  let offset = 0;
  let total = 1;
  while (allProducts.length < total) {
    const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
      Query.limit(100),
      Query.offset(offset)
    ]);
    allProducts.push(...res.documents);
    total = res.total;
    offset += 100;
  }
  console.log(`Fetched ${allProducts.length} products.`);

  let updatedCount = 0;
  for (const p of allProducts) {
    if (!p.NAME) continue;
    const name = p.NAME.toLowerCase();
    let brand = '';
    if (name.includes('sadoer')) brand = 'Sadoer';
    else if (name.includes('kevin&coco') || name.includes('kevin & coco') || name.includes('kevincoco') || name.includes('kevin coco')) brand = 'Kevin&Coco';
    else if (name.includes('karite') || name.includes('karité')) brand = 'Karite';
    else if (name.includes('kiss beauty')) brand = 'Kiss Beauty';
    else if (name.includes('ushas')) brand = 'Ushas';
    else if (name.includes('ruby rose')) brand = 'Ruby Rose';
    else if (name.includes('pink 21') || name.includes('pink21')) brand = 'Pink 21';
    else if (name.includes('hengfang')) brand = 'HengFang';
    else if (name.includes('peiliee')) brand = 'Peiliee';
    else if (name.includes('huda')) brand = 'Huda Beauty';

    // Appwrite returns null for undefined attributes sometimes, or undefined.
    // If brand is empty string, we might not need to update if it's already null/empty,
    // but we want to initialize it to empty string so it's queryable.
    if (p.BRAND !== brand) {
      try {
        await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, p.$id, {
          BRAND: brand
        });
        updatedCount++;
      } catch (err: any) {
        console.error(`Error updating product ${p.$id}: ${err.message}`);
      }
    }
  }
  console.log(`Successfully updated ${updatedCount} products.`);
}

migrate().catch(console.error);
