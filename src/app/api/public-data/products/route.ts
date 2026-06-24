import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, TIMED_OFFERS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';
import { resolveProductDisplayPrice, fetchAperturaSettings } from '@/lib/apertura-promo';
import { getSkuFromFeatures } from '@/lib/product-features';
import { normalizeProductImages } from '@/lib/product-images';

// Module-level in-memory cache fallbacks (safe-guard in case unstable_cache is bypassed or server restarts)
let memoryCacheAllProducts: any[] | null = null;
let memoryCacheAllProductsTime = 0;

let memoryCacheActiveOffers: any[] | null = null;
let memoryCacheActiveOffersTime = 0;

let memoryCacheAperturaSettings: any = null;
let memoryCacheAperturaSettingsTime = 0;


// Cache all active products for 60 seconds
const getCachedAllProducts = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheAllProducts && (now - memoryCacheAllProductsTime < 2000)) {
      return memoryCacheAllProducts;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    
    let allProducts = [];
    let lastId = null;
    const limit = 100;
    
    while (true) {
      const queries = [
        Query.limit(limit),
        Query.greaterThanEqual('STOCK', 0)
      ];
      if (lastId) {
        queries.push(Query.cursorAfter(lastId));
      }
      
      const response = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, queries);
      if (response.documents.length === 0) {
        break;
      }
      
      allProducts.push(...response.documents);
      lastId = response.documents[response.documents.length - 1].$id;
      
      if (response.documents.length < limit) {
        break;
      }
    }
    
    // Normalize images on fetch
    const normalized = allProducts.map(p => normalizeProductImages(p as any));
    memoryCacheAllProducts = normalized;
    memoryCacheAllProductsTime = Date.now();
    return normalized;
  },
  ['all-public-products-cache-v3'],
  { revalidate: 3600, tags: ['products'] }
);

// Cache active offer target IDs
const getCachedActiveOffers = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheActiveOffers && (now - memoryCacheActiveOffersTime < 3600000)) {
      return memoryCacheActiveOffers;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    const res = await databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [
      Query.equal('isActive', true),
      Query.equal('status', 'active'),
      Query.limit(100)
    ]);
    const ids = res.documents.map((d: any) => d.targetId).filter(Boolean);
    memoryCacheActiveOffers = ids;
    memoryCacheActiveOffersTime = Date.now();
    return ids;
  },
  ['active-offers-cache-v3'],
  { revalidate: 3600, tags: ['offers'] }
);

// Cache apertura settings
const getCachedAperturaSettings = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheAperturaSettings && (now - memoryCacheAperturaSettingsTime < 3600000)) {
      return memoryCacheAperturaSettings;
    }

    const settings = await fetchAperturaSettings();
    memoryCacheAperturaSettings = settings;
    memoryCacheAperturaSettingsTime = Date.now();
    return settings;
  },
  ['apertura-settings-cache-v3'],
  { revalidate: 3600, tags: ['settings'] }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean);
      if (ids.length === 0) {
        return NextResponse.json({ products: [] });
      }
      const [allProductsRaw] = await Promise.all([
        getCachedAllProducts()
      ]);
      const allProducts = allProductsRaw as any[];
      const filtered = allProducts.filter(p => ids.includes(p.$id));
      const map = new Map(filtered.map(p => [p.$id, p]));
      const sorted = ids.map(id => map.get(id)).filter(Boolean);
      return NextResponse.json({ products: sorted });
    }

    // 2. Standard Catalog Filters (Memory-based query)
    const sortBy = searchParams.get('sortBy') || 'newest';
    const categoryId = searchParams.get('categoryId') || undefined;
    const subcategoryId = searchParams.get('subcategoryId') || undefined;
    const subSubcategoryId = searchParams.get('subSubcategoryId') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const search = searchParams.get('search') || undefined;
    const ofertasOnly = searchParams.get('ofertasOnly') === 'true';
    const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : undefined;
    
    // Fallback to 1000 if limit is not passed (stale browser cache fallback)
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 1000;
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch cached data
    const [allProductsRaw, activeOffers, apertura] = await Promise.all([
      getCachedAllProducts(),
      getCachedActiveOffers(),
      getCachedAperturaSettings()
    ]);
    const allProducts = allProductsRaw as any[];

    // Calculate Category, Subcategory and SubSubcategory Counts (across all active products in DB)
    const categoryCounts: Record<string, number> = {};
    const subcategoryCounts: Record<string, number> = {};
    const subSubcategoryCounts: Record<string, number> = {};
    allProducts.forEach(p => {
      if (p.CATEGORYID) {
        categoryCounts[p.CATEGORYID] = (categoryCounts[p.CATEGORYID] || 0) + 1;
      }
      if (p.SUBCATEGORYID) {
        subcategoryCounts[p.SUBCATEGORYID] = (subcategoryCounts[p.SUBCATEGORYID] || 0) + 1;
      }
      if (p.SUBSUBCATEGORYID) {
        subSubcategoryCounts[p.SUBSUBCATEGORYID] = (subSubcategoryCounts[p.SUBSUBCATEGORYID] || 0) + 1;
      }
    });

    // Filter by category and search parameters (Except Price Range to compute price slider dynamically)
    let filtered = allProducts;
    if (categoryId) {
      filtered = filtered.filter(p => p.CATEGORYID === categoryId);
    }
    if (subcategoryId) {
      filtered = filtered.filter(p => p.SUBCATEGORYID === subcategoryId);
    }
    if (subSubcategoryId) {
      filtered = filtered.filter(p => p.SUBSUBCATEGORYID === subSubcategoryId);
    }
    if (ofertasOnly) {
      filtered = filtered.filter(p => activeOffers.includes(p.$id));
    }
    if (tag) {
      filtered = filtered.filter(p => {
        const pTags = !p.TAGS ? [] : typeof p.TAGS === 'string' ? (p.TAGS as string).split(',').map(t => t.trim()) : (p.TAGS as string[]);
        return pTags.some(t => t.toLowerCase() === tag.toLowerCase());
      });
    }
    if (search) {
      const normalizeText = (text: string) => 
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "").toLowerCase();
      
      const qTokens = normalizeText(search).trim().split(/\s+/).filter(Boolean);
      
      if (qTokens.length > 0) {
        filtered = filtered.filter(p => {
          const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
          const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
          const pSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
          
          const searchSpace = normalizeText(`${p.NAME} ${p.DESCRIPTION || ''} ${pSku}`);
          
          // Must contain ALL tokens (AND logic)
          return qTokens.every(token => searchSpace.includes(token));
        });
      }
    }

    // Calculate dynamic price range (min/max price matching current category/search criteria)
    const displayPrices = filtered.map(p => resolveProductDisplayPrice(p, apertura).displayPrice).filter(price => price > 0);
    const minPrice = displayPrices.length > 0 ? Math.floor(Math.min(...displayPrices)) : 0;
    const maxPrice = displayPrices.length > 0 ? Math.ceil(Math.max(...displayPrices)) : 0;

    // Apply Price Range filter
    if (priceMin !== undefined && priceMax !== undefined) {
      filtered = filtered.filter(p => {
        const price = resolveProductDisplayPrice(p, apertura).displayPrice;
        return price >= priceMin && price <= priceMax;
      });
    }

    // Sort Products
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
    } else if (sortBy === 'updated') {
      filtered.sort((a, b) => {
        const timeA = new Date(a.$updatedAt || a.$createdAt).getTime();
        const timeB = new Date(b.$updatedAt || b.$createdAt).getTime();
        return timeB - timeA;
      });
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => {
        const pa = resolveProductDisplayPrice(a, apertura).displayPrice;
        const pb = resolveProductDisplayPrice(b, apertura).displayPrice;
        return pa - pb;
      });
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => {
        const pa = resolveProductDisplayPrice(a, apertura).displayPrice;
        const pb = resolveProductDisplayPrice(b, apertura).displayPrice;
        return pb - pa;
      });
    }

    // Calculate all available tags in the current filtered set
    const allTags = Array.from(new Set(filtered.flatMap(p => {
      if (!p.TAGS) return [];
      if (typeof p.TAGS === 'string') return (p.TAGS as string).split(',').map(t => t.trim()).filter(Boolean);
      return (p.TAGS as string[]).filter(Boolean);
    }))).sort();

    // Sliced pagination
    const total = filtered.length;
    const paginatedProducts = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      products: paginatedProducts,
      total,
      priceRange: [minPrice, maxPrice],
      categoryCounts,
      subcategoryCounts,
      subSubcategoryCounts,
      allTags
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    });

  } catch (error: any) {
    console.error('[API public-data/products] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
