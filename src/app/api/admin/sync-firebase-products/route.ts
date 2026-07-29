import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, ID, Query } from '@/lib/appwrite';
import { setSkuInFeatures } from '@/lib/product-features';

interface FirebaseProduct {
  sku: string;
  name: string;
  priceA: number;
  priceB?: number;
  stock: number;
  category: string;
  subcategory?: string;
  image: string;
  image2?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const products: FirebaseProduct[] = body.products;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: 'No products provided' }, { status: 400 });
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    // ═══ STEP 1: Get existing categories from Appwrite ═══
    const catRes = await databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [
      Query.limit(500),
    ]);
    const existingCategories = new Map<string, string>(); // name (lowercase) -> categoryId
    for (const doc of catRes.documents) {
      const name = (doc.name || doc.NAME || '').toString();
      if (name) existingCategories.set(name.toLowerCase().trim(), doc.$id);
    }
    console.log(`[sync-firebase] Found ${existingCategories.size} existing categories in Appwrite`);

    // ═══ STEP 2: Get existing product SKUs to avoid duplicates ═══
    const existingSkus = new Set<string>();
    let offset = 0;
    while (true) {
      const prodRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
        Query.limit(500),
        Query.offset(offset),
      ]);
      if (prodRes.documents.length === 0) break;
      for (const doc of prodRes.documents) {
        const features = doc.FEATURES || '';
        const skuMatch = String(features).match(/SKU:\s*(.+)/i);
        if (skuMatch) existingSkus.add(skuMatch[1].trim());
      }
      offset += prodRes.documents.length;
      if (prodRes.documents.length < 500) break;
    }
    console.log(`[sync-firebase] Found ${existingSkus.size} existing product SKUs in Appwrite`);

    // ═══ STEP 3: Import products ═══
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const newCategoryNames = new Set<string>();

    // First pass: identify new categories needed
    for (const p of products) {
      const catName = (p.category || 'Hogar y Cocina').trim();
      if (!existingCategories.has(catName.toLowerCase().trim())) {
        newCategoryNames.add(catName);
      }
    }

    // Create missing categories
    for (const catName of newCategoryNames) {
      try {
        const slug = catName.toLowerCase().replace(/\s+/g, '-');
        const doc = await databases.createDocument(databaseId, CATEGORIES_COLLECTION, ID.unique(), {
          name: catName,
          slug: slug,
        });
        existingCategories.set(catName.toLowerCase().trim(), doc.$id);
        console.log(`[sync-firebase] Created category: ${catName} -> ${doc.$id}`);
      } catch (e: any) {
        console.error(`[sync-firebase] Error creating category ${catName}:`, e.message);
      }
    }

    // Import products
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        // Skip if SKU already exists
        if (existingSkus.has(p.sku)) {
          skippedCount++;
          continue;
        }

        const catName = (p.category || 'Hogar y Cocina').trim();
        const categoryId = existingCategories.get(catName.toLowerCase().trim()) || '';
        const price = Math.round(p.priceA || 0);

        let features = setSkuInFeatures('', p.sku);

        const payload: Record<string, any> = {
          NAME: p.name,
          DESCRIPTION: p.name,
          PRICE: price,
          STOCK: p.stock || 999,
          COST: 0,
          CURRENTPRICE: null,
          WHOLESALEPRICE: price,
          WHOLESALEMINQUANTITY: 0,
          PACKQTY: 0,
          IMAGEURL: p.image || '',
          IMAGEURL2: p.image2 || '',
          CATEGORYID: categoryId,
          SUBCATEGORYID: '',
          FEATURES: features,
          TAGS: [catName.toLowerCase().replace(/\s+/g, '-')],
        };

        await databases.createDocument(databaseId, PRODUCTS_COLLECTION, ID.unique(), payload);
        importedCount++;
        existingSkus.add(p.sku);

        if ((i + 1) % 10 === 0) {
          console.log(`[sync-firebase] Progress: ${i + 1}/${products.length} (imported: ${importedCount}, skipped: ${skippedCount}, errors: ${errorCount})`);
        }
      } catch (err: any) {
        errorCount++;
        errors.push(`Error importing ${p.sku} (${p.name}): ${err.message}`);
        console.error(`[sync-firebase] Error importing ${p.sku}:`, err.message);
      }
    }

    console.log(`[sync-firebase] DONE: ${importedCount} imported, ${skippedCount} skipped (already exist), ${errorCount} errors`);

    // Invalidate cache
    try {
      revalidateTag('products');
      revalidateTag('home');
      revalidateTag('catalog');
      revalidateTag('offers');
    } catch (e: any) {
      console.error('[sync-firebase] Error revalidating cache:', e?.message);
    }

    return NextResponse.json({
      success: true,
      importedCount,
      skippedCount,
      errorCount,
      errors: errors.length > 0 ? errors.slice(0, 20) : undefined,
      message: `Sincronización completa: ${importedCount} productos importados, ${skippedCount} ya existían, ${errorCount} errores.`
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('[sync-firebase] Fatal error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error en sincronización'
    }, { status: 500, headers: corsHeaders });
  }
}
