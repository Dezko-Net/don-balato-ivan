import useSWR from 'swr';
import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types';
import { getSkuFromFeatures } from '@/lib/product-features';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface UseProductsParams {
  categoryId?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  sortBy?: string;
  search?: string;
  tag?: string;
  priceMin?: number;
  priceMax?: number;
  ofertasOnly?: boolean;
  catalogMode?: 'retail' | 'paquetes' | 'embalajes';
}

export function useProductsCache({
  categoryId,
  subcategoryId,
  subSubcategoryId,
  sortBy = 'newest',
  search,
  tag,
  priceMin,
  priceMax,
  ofertasOnly,
  catalogMode
}: UseProductsParams) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(1);
  
  const { settings: apertura } = useAperturaPromotion();

  const [isMinWaitDone, setIsMinWaitDone] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    
    // Premium UX: Ensure minimum loader time so Lottie has time to load and play
    const t = setTimeout(() => setIsMinWaitDone(true), 1200);
    
    return () => {
      window.removeEventListener('resize', check);
      clearTimeout(t);
    };
  }, []);

  const limit = isMobile ? 50 : 100;

  // Global SWR Key: Fetch EVERYTHING exactly once per session.
  const globalKey = isClient ? `/api/public-data/products?limit=10000` : null;

  const { data, error, isValidating, mutate } = useSWR(globalKey, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    dedupingInterval: 86400000, // 24 hours deduping (essentially cached for the entire session)
  });

  // Keep loading true until both data arrives AND the minimum premium delay has passed
  const isLoadingInitialData = (!data && !error) || !isMinWaitDone;

  const processedData = useMemo(() => {
    if (!data || !data.products) {
      return {
        products: [] as Product[],
        total: 0,
        priceRange: [0, 0] as [number, number],
        categoryCounts: {} as Record<string, number>,
        subcategoryCounts: {} as Record<string, number>,
        subSubcategoryCounts: {} as Record<string, number>,
        allTags: [] as string[],
      };
    }

    let filtered: Product[] = [...data.products];
    const activeOffers = data.activeOffers || [];
    
    if (categoryId) {
      filtered = filtered.filter(p => p.CATEGORYID === categoryId);
    }
    if (subcategoryId) {
      filtered = filtered.filter(p => p.SUBCATEGORYID === subcategoryId);
    }
    if (subSubcategoryId) {
      filtered = filtered.filter(p => p.SUBSUBCATEGORYID === subSubcategoryId);
    }
    if (ofertasOnly && activeOffers.length > 0) {
      filtered = filtered.filter(p => activeOffers.includes(p.$id));
    }
    if (catalogMode === 'paquetes' || catalogMode === 'embalajes') {
      filtered = filtered.filter(p => {
        const qty = p.PACKQTY ? Number(p.PACKQTY) : 0;
        return !isNaN(qty) && qty > 1;
      });
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
          return qTokens.every(token => searchSpace.includes(token));
        });
      }
    }

    // Calculate priceRange dynamically for the current mode
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    const modeProducts = data.products.filter((p: Product) => {
      if (catalogMode === 'paquetes' || catalogMode === 'embalajes') {
        const qty = p.PACKQTY ? Number(p.PACKQTY) : 0;
        return !isNaN(qty) && qty > 1;
      }
      return true;
    });

    // Calculate Category, Subcategory and SubSubcategory Counts dynamically for this catalog mode
    const categoryCounts: Record<string, number> = {};
    const subcategoryCounts: Record<string, number> = {};
    const subSubcategoryCounts: Record<string, number> = {};
    modeProducts.forEach((p: Product) => {
      if (p.ISACTIVE === false) return;
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
    
    modeProducts.forEach((p: Product) => {
      let price = resolveProductDisplayPrice(p, apertura).displayPrice;
      if (catalogMode === 'embalajes') {
        price = p.WHOLESALEPRICE || p.PRICE;
      } else if (catalogMode === 'paquetes') {
        price = p.WHOLESALEPRICE || p.PRICE;
      }
      if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && p.PACKQTY) {
        price *= p.PACKQTY;
      }
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    });
    
    if (minPrice === Infinity) minPrice = 0;
    if (maxPrice === -Infinity) maxPrice = 0;
    const finalPriceRange: [number, number] = [minPrice, maxPrice];

    if (priceMin !== undefined && priceMax !== undefined) {
      filtered = filtered.filter(p => {
        let price = resolveProductDisplayPrice(p, apertura).displayPrice;
        if (catalogMode === 'embalajes') {
          price = p.WHOLESALEPRICE || p.PRICE;
        } else if (catalogMode === 'paquetes') {
          price = p.WHOLESALEPRICE || p.PRICE;
        }
        if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && p.PACKQTY) {
          price *= p.PACKQTY;
        }
        return price >= priceMin! && price <= priceMax!;
      });
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.$createdAt || 0).getTime() - new Date(a.$createdAt || 0).getTime());
    } else if (sortBy === 'updated') {
      filtered.sort((a, b) => {
        const timeA = new Date(a.$updatedAt || a.$createdAt || 0).getTime();
        const timeB = new Date(b.$updatedAt || b.$createdAt || 0).getTime();
        return timeB - timeA;
      });
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => {
        let priceA = resolveProductDisplayPrice(a, apertura).displayPrice;
        let priceB = resolveProductDisplayPrice(b, apertura).displayPrice;
        if (catalogMode === 'embalajes') {
          priceA = a.WHOLESALEPRICE || a.PRICE;
          priceB = b.WHOLESALEPRICE || b.PRICE;
        } else if (catalogMode === 'paquetes') {
          priceA = a.WHOLESALEPRICE || a.PRICE;
          priceB = b.WHOLESALEPRICE || b.PRICE;
        }
        if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && a.PACKQTY) priceA *= a.PACKQTY;
        if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && b.PACKQTY) priceB *= b.PACKQTY;
        return priceA - priceB;
      });
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => {
        let priceA = resolveProductDisplayPrice(a, apertura).displayPrice;
        let priceB = resolveProductDisplayPrice(b, apertura).displayPrice;
        if (catalogMode === 'embalajes') {
          priceA = a.WHOLESALEPRICE || a.PRICE;
          priceB = b.WHOLESALEPRICE || b.PRICE;
        } else if (catalogMode === 'paquetes') {
          priceA = a.WHOLESALEPRICE || a.PRICE;
          priceB = b.WHOLESALEPRICE || b.PRICE;
        }
        if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && a.PACKQTY) priceA *= a.PACKQTY;
        if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && b.PACKQTY) priceB *= b.PACKQTY;
        return priceB - priceA;
      });
    }

    return {
      products: filtered,
      total: filtered.length,
      priceRange: finalPriceRange,
      categoryCounts,
      subcategoryCounts,
      subSubcategoryCounts,
      allTags: data.allTags || [],
    };
  }, [data, categoryId, subcategoryId, subSubcategoryId, sortBy, search, tag, priceMin, priceMax, ofertasOnly, catalogMode, apertura]);

  const paginatedProducts = useMemo(() => {
    return processedData.products.slice(0, page * limit);
  }, [processedData.products, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [categoryId, subcategoryId, subSubcategoryId, search, tag, sortBy, priceMin, priceMax, ofertasOnly, catalogMode]);

  const hasMore = paginatedProducts.length < processedData.products.length;

  return {
    products: paginatedProducts,
    allProducts: processedData.products,
    total: processedData.total,
    priceRange: processedData.priceRange,
    categoryCounts: processedData.categoryCounts,
    subcategoryCounts: processedData.subcategoryCounts,
    subSubcategoryCounts: processedData.subSubcategoryCounts,
    allTags: processedData.allTags,
    error,
    isLoadingInitialData,
    isLoadingMore: isValidating && isLoadingInitialData,
    isReachingEnd: !hasMore,
    loadMore: () => {
      if (hasMore) setPage(p => p + 1);
    },
    isMobile,
    mutate
  };
}

export async function invalidateGlobalProductsCache() {
  try {
    await fetch('/api/admin/revalidate', { method: 'POST' }).catch(() => {});
    const { mutate } = require('swr');
    await mutate(
      (key: string) => typeof key === 'string' && key.startsWith('/api/public-data/products'),
      undefined,
      { revalidate: true }
    );
  } catch (e) {
    console.error('Error invalidating cache', e);
  }
}

