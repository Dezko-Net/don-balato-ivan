import { NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Query } from 'node-appwrite';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    try {
      await databases.createStringAttribute(databaseId, PRODUCTS_COLLECTION_ID, 'BRAND', 255, false);
      console.log('Attributo BRAND creado. Esperando unos segundos...');
      await new Promise(r => setTimeout(r, 5000));
    } catch (e: any) {
      if (e.code === 409) {
         console.log('Attributo BRAND ya existe.');
      } else {
         console.error('Error creando atributo:', e);
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

    let updatedCount = 0;
    for (const p of allProducts) {
      if (!p.NAME) continue;
      const name = p.NAME.toLowerCase();
      let brand = '';
      if (name.includes('sadoer')) brand = 'SADOER';
      else if (name.includes('kevin&coco') || name.includes('kevin & coco') || name.includes('kevincoco') || name.includes('kevin coco')) brand = 'Kevin & Coco';
      else if (name.includes('3q') || name.includes('3 q')) brand = '3Q Beauty';
      else if (name.includes('billion') || name.includes('billion beauty')) brand = 'Billion Beauty';
      else if (name.includes('karite') || name.includes('karité')) brand = 'Karite';
      else if (name.includes('kiss beauty')) brand = 'Kiss Beauty';
      else if (name.includes('ushas')) brand = 'Ushas';
      else if (name.includes('ruby rose')) brand = 'Ruby Rose';
      else if (name.includes('pink 21') || name.includes('pink21')) brand = 'Pink 21';
      else if (name.includes('hengfang')) brand = 'HengFang';
      else if (name.includes('peiliee')) brand = 'Peiliee';
      else if (name.includes('huda')) brand = 'Huda Beauty';

      // Actualizar solo si cambió
      if (p.BRAND !== brand) {
        await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, p.$id, {
          BRAND: brand
        });
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, total: allProducts.length, updated: updatedCount });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
