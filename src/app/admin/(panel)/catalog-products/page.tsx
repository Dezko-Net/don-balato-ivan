'use client';

import { useEffect, useState, useCallback } from 'react';
import { Query, ID } from 'appwrite';
import Link from 'next/link';
import { getServices, getAppwriteConfig, STOCK_ALERTS_COLLECTION_ID, INVENTORY_PRODUCTS_COLLECTION_ID, NOTIFICATIONS_COLLECTION_ID, PRODUCTS_COLLECTION_ID, CATALOG_PRODUCTS_COLLECTION_ID, USERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { formatPrice } from '@/lib/appwrite';
import { normalizeStockAlert, type StockAlert } from '@/lib/stock-alerts';
import { getSkuFromFeatures, getWarehouseLocationFromFeatures } from '@/lib/product-features';
import { Search, RefreshCw, Package, AlertTriangle, Users, Bell, CheckCircle, XCircle, User, ChevronRight, ArrowLeft, Clock, Eye, Sparkles, ExternalLink, Lock, Copy, Printer, Trash2, X, ShoppingCart } from 'lucide-react';

interface StockAlertView extends StockAlert {
  sku?: string;
  section?: number | null;
  gondola?: string | null;
  currentStock?: number;
  inCatalog?: boolean;
  hasStock?: boolean; // true if product is in 'products' collection with STOCK > 0
  inInventory?: boolean; // true if product is only in inventory_products (not yet published)
  source?: 'products' | 'catalog_products' | 'inventory_products';
  price?: number;
  productsDocId?: string; // $id in 'products' collection for navigation
}

interface GroupedUser {
  userId: string;
  userName: string;
  email: string;
  requests: StockAlertView[];
  pendingCount: number;
  foundCount: number;
  missingCount: number;
}

export default function CatalogProductsPage() {
  const [alerts, setAlerts] = useState<StockAlertView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<GroupedUser | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<Record<string, string>>({});
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [imageUrlModal, setImageUrlModal] = useState<{ productId: string; currentUrl: string; newUrl: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const allDocs: any[] = [];
      let offset = 0;
      while (true) {
        const r = await databases.listDocuments(databaseId, STOCK_ALERTS_COLLECTION_ID, [Query.limit(2000), Query.offset(offset)]);
        allDocs.push(...r.documents);
        if (r.documents.length < 2000) break;
        offset += 2000;
      }
      
      const rawAlerts = allDocs.map((d: any) => normalizeStockAlert(d));
      
      const uniqueProductIds = Array.from(new Set(rawAlerts.map(a => a.productId).filter(Boolean)));
      const uniqueUserIds = Array.from(new Set(rawAlerts.map(a => a.userId).filter(id => id && !id.includes('@'))));
      
      // 1. Fetch Products — try PRODUCTS and CATALOG_PRODUCTS first (by $id), then INVENTORY_PRODUCTS as fallback
      const productMap: Record<string, { name: string; image: string; sku?: string; jumpsellerId?: string; barcode?: string; section?: number | null; gondola?: string; stock?: number; price?: number; inCatalog?: boolean; hasStock?: boolean; inInventory?: boolean; source?: 'products' | 'catalog_products' | 'inventory_products'; productsDocId?: string }> = {};
      const productChunks: string[][] = [];
      for (let i = 0; i < uniqueProductIds.length; i += 100) {
        productChunks.push(uniqueProductIds.slice(i, i + 100));
      }

      // Helper to extract image from a document
      const extractImage = (p: any): string => {
        if (p.IMAGES) {
          try {
            const parsed = JSON.parse(p.IMAGES);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
          } catch {
            if (typeof p.IMAGES === 'string' && p.IMAGES.startsWith('http')) return p.IMAGES;
          }
        }
        return p.IMAGEURL || p.IMAGEURL2 || p.IMAGE_URL || p.imageUrl || p.image || p.IMAGE || '';
      };

      // Pass 1: Resolve products from the shared, server-cached endpoint
      // (/api/public-data/products — 24h unstable_cache, invalidated on product
      // edits) instead of chunked direct Appwrite reads. One cached fetch builds
      // a $id map, so this costs ~0 Appwrite reads instead of one read per alert
      // product. Note: the endpoint excludes products with negative STOCK; those
      // fall through to the CATALOG_PRODUCTS / INVENTORY_PRODUCTS passes below.
      try {
        const prodRes = await fetch('/api/public-data/products?limit=10000', { cache: 'no-store' });
        const prodJson = await prodRes.json();
        const cachedById: Record<string, any> = {};
        for (const p of (prodJson.products || [])) cachedById[p.$id] = p;
        for (const id of uniqueProductIds) {
          const p = cachedById[id];
          if (!p) continue;
          const skuVal = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku);
          const locVal = getWarehouseLocationFromFeatures(p.FEATURES, p.section ?? null);
          productMap[p.$id] = {
            name: p.NAME || p.name || '',
            image: extractImage(p),
            sku: skuVal || '',
            jumpsellerId: p.jumpseller_id || '',
            barcode: p.barcode || (p.FEATURES ? (p.FEATURES.match(/Barcode:\s*([^,\n]+)/i) || [])[1] : '') || '',
            section: locVal.section,
            gondola: locVal.gondola || '?',
            stock: p.STOCK ?? 0,
            price: p.PRICE || p.price || p.CURRENTPRICE || 0,
            inCatalog: true,
            hasStock: (p.STOCK ?? 0) > 0,
            inInventory: false,
            source: 'products',
            productsDocId: p.$id,
          };
        }
      } catch (e) {
        console.error('Error loading products from cached endpoint', e);
      }

      for (const chunk of productChunks) {
        try {
          const res = await databases.listDocuments(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, [
            Query.equal('$id', chunk),
            Query.limit(20),
          ]);
          res.documents.forEach((p: any) => {
            const skuVal = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku);
            const locVal = getWarehouseLocationFromFeatures(p.FEATURES, p.section ?? null);
            productMap[p.$id] = {
              name: p.NAME || p.name || '',
              image: extractImage(p),
              sku: skuVal || '',
              jumpsellerId: p.jumpseller_id || '',
              barcode: p.barcode || (p.FEATURES ? (p.FEATURES.match(/Barcode:\s*([^,\n]+)/i) || [])[1] : '') || '',
              section: locVal.section,
              gondola: locVal.gondola || '?',
              stock: p.STOCK ?? 0,
              price: p.PRICE || p.price || p.CURRENTPRICE || 0,
              inCatalog: true,
              hasStock: false,
              inInventory: false,
              source: 'catalog_products',
              productsDocId: undefined,
            };
          });
        } catch (e) {
          console.error('Error loading catalog_products chunk', e);
        }
      }

      // Pass 2: Fallback to INVENTORY_PRODUCTS for products not found in catalog
      const missingIds = uniqueProductIds.filter(id => !productMap[id]);
      for (let i = 0; i < missingIds.length; i += 100) {
        const chunk = missingIds.slice(i, i + 100);
        try {
          const res = await databases.listDocuments(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, [
            Query.equal('$id', chunk),
            Query.limit(20),
          ]);
          res.documents.forEach((p: any) => {
            const skuVal = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku);
            const locVal = getWarehouseLocationFromFeatures(p.FEATURES, p.section ?? null);
            productMap[p.$id] = {
              name: p.NAME || p.name || '',
              image: extractImage(p),
              sku: skuVal || '',
              jumpsellerId: p.jumpseller_id || '',
              barcode: p.barcode || (p.FEATURES ? (p.FEATURES.match(/Barcode:\s*([^,\n]+)/i) || [])[1] : '') || '',
              section: locVal.section,
              gondola: locVal.gondola || '?',
              stock: p.STOCK ?? 0,
              price: p.PRICE || p.price || p.CURRENTPRICE || 0,
              inCatalog: false,
              hasStock: false,
              inInventory: true,
              source: 'inventory_products',
              productsDocId: undefined,
            };
          });
        } catch (e) {
          console.error('Error loading inventory_products chunk', e);
        }
      }

      // Pass 3: Removed. (Previously fetched ALL catalog_products and products into memory to match by SKU).
      // We now rely on Pass 4 to lazily fetch missing products by SKU/name via targeted queries.


      const norm = (s: string) => (s || '').trim().replace(/[\.\-]/g, '').toLowerCase();

      // Pass 4: For products still without source or without hasStock, search products collection by name and SKU
      const unresolvedIds = uniqueProductIds.filter(id => {
        const p = productMap[id];
        return !p || (!p.hasStock && p.source !== 'products');
      });
      if (unresolvedIds.length > 0) {
        const unresolvedItems = unresolvedIds.map(id => {
          const rawAlert = rawAlerts.find(a => a.productId === id);
          const existing = productMap[id];
          return { id, name: rawAlert?.productName || existing?.name || '', sku: existing?.sku || rawAlert?.sku || '' };
        }).filter(n => n.name.length > 2 || n.sku.length > 1);

        // Batch query by SKU to reduce reads
        const skusToSearch = Array.from(new Set(unresolvedItems.map(u => u.sku).filter(s => s.length > 1)));
        const batchMap = new Map<string, any>();
        
        for (let i = 0; i < skusToSearch.length; i += 100) {
           const chunk = skusToSearch.slice(i, i + 100);
           try {
             const skuRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
               Query.equal('sku', chunk), Query.limit(20),
             ]);
             skuRes.documents.forEach((d: any) => batchMap.set(norm(d.sku), d));
           } catch (e) {}
        }

        // Batch query by NAME to reduce reads
        const namesToSearch = Array.from(new Set(unresolvedItems.map(u => u.name).filter(n => n.length > 2)));
        const batchNameMap = new Map<string, any>();
        
        for (let i = 0; i < namesToSearch.length; i += 100) {
           const chunk = namesToSearch.slice(i, i + 100);
           try {
             const nameRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
               Query.equal('NAME', chunk), Query.limit(20),
             ]);
             nameRes.documents.forEach((d: any) => batchNameMap.set(d.NAME.toLowerCase().trim(), d));
           } catch (e) {}
        }

        for (const { id, name, sku } of unresolvedItems) {
          if (productMap[id]?.source === 'products' && productMap[id]?.hasStock) continue; // already resolved
          try {
            let p: any = null;
            if (sku) p = batchMap.get(norm(sku));
            
            if (!p && name) {
              p = batchNameMap.get(name.toLowerCase().trim());
            }
            if (p) {
              const existing = productMap[id] || {};
              const locVal = getWarehouseLocationFromFeatures(p.FEATURES, p.section ?? null);
              productMap[id] = {
                name: existing.name || p.NAME || '',
                image: existing.image || extractImage(p),
                sku: existing.sku || getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku) || '',
                jumpsellerId: existing.jumpsellerId || p.jumpseller_id || '',
                barcode: existing.barcode || p.barcode || '',
                section: locVal.section,
                gondola: locVal.gondola || '?',
                stock: p.STOCK ?? 0,
                price: p.PRICE || p.price || p.CURRENTPRICE || existing.price || 0,
                inCatalog: p.ISACTIVE !== false,
                hasStock: (p.STOCK ?? 0) > 0,
                inInventory: false,
                source: 'products',
                productsDocId: p.$id,
              };
            }
          } catch {}
        }
      }

      // 2. Fetch Users
      const userMap: Record<string, { name: string; email: string }> = {};
      const userChunks: string[][] = [];
      for (let i = 0; i < uniqueUserIds.length; i += 100) {
        userChunks.push(uniqueUserIds.slice(i, i + 100));
      }
      
      for (const chunk of userChunks) {
        try {
          const res = await databases.listDocuments(databaseId, USERS_COLLECTION_ID, [
            Query.equal('userId', chunk),
            Query.limit(20),
          ]);
          res.documents.forEach((u: any) => {
            userMap[u.userId] = {
              name: u.name || u.NAME || 'Usuario sin nombre',
              email: u.email || u.EMAIL || '',
            };
          });
        } catch (e) {
          console.error('Error loading users chunk', e);
        }
      }
      
      // 3. Map alerts with resolved info
      const resolvedAlerts = rawAlerts.map(a => {
        const pInfo = productMap[a.productId];
        const uInfo = userMap[a.userId];
        
        let email = a.email;
        let userName = a.userName;
        
        if (a.userId && a.userId.includes('@')) {
          email = a.userId;
          userName = a.userId.split('@')[0];
        } else if (uInfo) {
          email = uInfo.email;
          userName = uInfo.name;
        }
        
        return {
          ...a,
          // Use pInfo name if found, then fall back to alert's stored name, then placeholder
          productName: (pInfo?.name && pInfo.name.trim()) ? pInfo.name : (a.productName && a.productName.trim() ? a.productName : (pInfo ? 'Producto en catálogo' : 'Producto sin nombre')),
          productImage: pInfo?.image || a.productImage || '',
          sku: pInfo?.sku || a.sku || '',
          section: pInfo?.section,
          gondola: pInfo?.gondola,
          currentStock: pInfo?.stock ?? 0,
          price: pInfo?.price ?? 0,
          productsDocId: pInfo?.productsDocId,
          inCatalog: pInfo?.inCatalog ?? false,
          hasStock: pInfo?.hasStock ?? false,
          inInventory: pInfo?.inInventory ?? false,
          source: pInfo?.source,
          email: email || 'Invitado',
          userName: userName || email?.split('@')[0] || 'Cliente sin nombre',
        };
      });
      
      // Auto-notify and mark available for pending alerts where the product has stock
      const pendingWithStock = resolvedAlerts.filter(a => a.status === 'pending' && a.hasStock);
      if (pendingWithStock.length > 0) {
        pendingWithStock.forEach(async (req) => {
          try {
            const { databases } = getServices();
            const { databaseId } = getAppwriteConfig();
            
            if (req.userId) {
              const isInStore = req.source === 'products' || req.source === 'catalog_products';
              const isInventory = req.source === 'inventory_products';
              const notifData = {
                userId: req.userId,
                title: isInStore ? '🛒 ¡Tu producto ya está en la tienda!' : isInventory ? '📦 ¡Producto encontrado en bodega!' : '🎉 ¡Tu producto ya tiene stock!',
                message: isInStore
                  ? `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]¡Buenas noticias! "${req.productName}" que consultaste ya está disponible en la tienda (${req.quantity || 1} und). ¡No te quedes sin él!`
                  : isInventory
                  ? `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]¡Buenas noticias! "${req.productName}" que consultaste fue encontrado en nuestra bodega (${req.quantity || 1} und). ¡No te quedes sin él!`
                  : `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]¡Buenas noticias! "${req.productName}" que consultaste ya está disponible (${req.quantity || 1} und). ¡No te quedes sin él!`,
                type: 'success',
                isRead: false,
              };
              await databases.createDocument(databaseId, NOTIFICATIONS_COLLECTION_ID, ID.unique(), notifData);
            }
            await databases.updateDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, req.$id, { status: 'available' });
          } catch (err) {
            console.error('Error auto-resolving restocked alert:', err);
          }
        });

        // Set status to 'available' locally so they disappear from pending lists/counts
        resolvedAlerts.forEach(a => {
          if (a.status === 'pending' && a.hasStock) {
            a.status = 'available';
          }
        });
      }

      setAlerts(resolvedAlerts);
    } catch (e: any) { setError(e.message); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Group alerts by user
  const groupedUsers: GroupedUser[] = (() => {
    const map: Record<string, StockAlertView[]> = {};
    alerts.forEach(a => {
      const key = a.userId || a.email;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    return Object.entries(map).map(([userId, reqs]) => {
      reqs.sort((a, b) => {
        if (a.source && !b.source) return -1;
        if (!a.source && b.source) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
      return {
        userId,
        userName: reqs[0].userName || reqs[0].email.split('@')[0],
        email: reqs[0].email,
        requests: reqs,
        pendingCount: reqs.filter(r => r.status === 'pending').length,
        foundCount: reqs.filter(r => r.source || r.hasStock).length,
        missingCount: reqs.filter(r => !r.source && !r.hasStock).length,
      };
    }).filter(u => u.pendingCount > 0).sort((a, b) => b.pendingCount - a.pendingCount);
  })();

  const filteredUsers = groupedUsers.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.userName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const totalPending = groupedUsers.filter(u => u.pendingCount > 0).length;
  const totalAvailable = groupedUsers.filter(u => u.requests.some(r => r.status === 'available')).length;
  const totalUnavailable = groupedUsers.filter(u => u.requests.some(r => r.status === 'unavailable')).length;

  const handleMarkAvailable = async (req: StockAlertView) => {
    // Only block if product is NOT in tienda or inventory (completely unknown)
    if (req.source !== 'products' && req.source !== 'catalog_products' && req.source !== 'inventory_products' && (!req.currentStock || req.currentStock <= 0)) {
      window.alert('No hay stock registrado en el inventario para este producto. Agrégalo primero.');
      return;
    }
    setProcessingId(req.$id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // ── Notification + alert update in parallel ──
      const notifPromise = req.userId ? (async () => {
        const isInStore = req.source === 'products' || req.source === 'catalog_products';
        const isInventory = req.source === 'inventory_products';
        const notifData: any = {
          userId: req.userId,
          title: isInStore ? '🛒 ¡Tu producto ya está en la tienda!' : isInventory ? '📦 ¡Producto encontrado en bodega!' : '🎉 ¡Tu producto ya tiene stock!',
          message: isInStore
            ? `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]¡Buenas noticias! "${req.productName}" que consultaste ya está disponible en la tienda (${req.quantity || 1} und). ¡No te quedes sin él!`
            : isInventory
            ? `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]¡Buenas noticias! "${req.productName}" que consultaste fue encontrado en nuestra bodega (${req.quantity || 1} und). ¡No te quedes sin él!`
            : `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]¡Buenas noticias! "${req.productName}" que consultaste ya está disponible (${req.quantity || 1} und). ¡No te quedes sin él!`,
          type: 'success',
          isRead: false,
        };
        try {
          await databases.createDocument(databaseId, NOTIFICATIONS_COLLECTION_ID, ID.unique(), notifData);
        } catch (notifErr: any) {
          console.warn('No se pudo crear notificación:', notifErr?.message);
        }
      })() : Promise.resolve();

      const updatePromise = (async () => {
        try {
          await databases.updateDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, req.$id, { status: 'available' });
        } catch (updErr: any) {
          console.warn('No se pudo actualizar estado de alerta:', updErr?.message);
        }
      })();

      await Promise.all([notifPromise, updatePromise]);
      setAlerts(prev => prev.map(a => a.$id === req.$id ? { ...a, status: 'available' as any } : a));
    } catch (e: any) {
      window.alert('Error: ' + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleNotifyAllFound = async () => {
    if (!selectedUser) return;
    const foundReqs = selectedUser.requests.filter(a => a.source || a.hasStock);
    if (foundReqs.length === 0) {
      window.alert('No hay productos encontrados para notificar.');
      return;
    }
    if (!confirm(`¿Notificar y llevar al carrito ${foundReqs.length} producto(s) encontrado(s) para ${selectedUser.userName}?`)) return;
    setProcessingId('bulk');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // Process all notifications in parallel
      await Promise.all(foundReqs.map(async (req) => {
        // Create notification
        if (req.userId) {
          const isInStore = req.source === 'products' || req.source === 'catalog_products';
          const isInventory = req.source === 'inventory_products';
          try {
            await databases.createDocument(databaseId, NOTIFICATIONS_COLLECTION_ID, ID.unique(), {
              userId: req.userId,
              title: isInStore ? '🛒 ¡Tu producto ya está en la tienda!' : isInventory ? '📦 ¡Producto encontrado en bodega!' : '🎉 ¡Tu producto ya tiene stock!',
              message: `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]¡Buenas noticias! "${req.productName}" ya tiene stock (${req.quantity || 1} und). ¡Agrégalo a tu carrito!`,
              type: 'success',
              isRead: false,
            });
          } catch (notifErr: any) {
            console.warn('No se pudo crear notificación:', notifErr?.message);
          }
        }

        // Update alert status
        try {
          await databases.updateDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, req.$id, { status: 'available' });
        } catch (updErr: any) {
          console.warn('No se pudo actualizar alerta:', updErr?.message);
        }
      }));

      // Update all alerts locally in one state update
      const updatedIds = new Set(foundReqs.map(r => r.$id));
      setAlerts(prev => prev.map(a => updatedIds.has(a.$id) ? { ...a, status: 'available' as any } : a));
    } catch (e: any) {
      window.alert('Error: ' + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkUnavailable = async (req: StockAlertView) => {
    if (!confirm(`¿Eliminar "${req.productName}" del catálogo e inventario, y notificar al cliente?`)) return;
    setProcessingId(req.$id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // 1. Mark alert as unavailable
      await databases.updateDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, req.$id, { status: 'unavailable' });

      // 2. Delete from catalog_products (by productId matching $id)
      try {
        const catRes = await databases.listDocuments(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, [
          Query.equal('$id', req.productId), Query.limit(1),
        ]);
        if (catRes.documents.length > 0) {
          await databases.deleteDocument(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, catRes.documents[0].$id);
        }
      } catch (e) {
        console.warn('No se pudo eliminar de catalog_products:', e);
      }

      // 3. Delete from inventory_products
      try {
        await databases.deleteDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, req.productId);
      } catch (e) {
        console.warn('No se pudo eliminar de inventory_products:', e);
      }

      // 4. Notification to user
      if (req.userId) {
        const notifData: any = {
          userId: req.userId,
          title: '😔 Producto sin stock por ahora',
          message: `[IMG:${req.productImage || ''}][PRICE:${req.price || 0}][STOCK:${req.currentStock || 0}][QTY:${req.quantity || 1}][PID:${req.productsDocId || req.productId}]Lamentamos informarte que "${req.productName}" no tiene existencia actualmente. Lo vigilaremos de cerca y te avisaremos en cuanto vuelva a estar disponible. ¡Gracias por tu paciencia!`,
          type: 'warning',
          isRead: false,
        };
        try {
          await databases.createDocument(databaseId, NOTIFICATIONS_COLLECTION_ID, ID.unique(), notifData);
        } catch (notifErr: any) {
          console.warn('No se pudo crear notificación:', notifErr?.message);
        }
      }

      setAlerts(prev => prev.map(a => a.$id === req.$id ? { ...a, status: 'unavailable', notified: true } : a));
    } catch (e: any) {
      window.alert('Error: ' + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteAlert = async (req: StockAlertView) => {
    if (!confirm(`¿Eliminar "${req.productName}" de las consultas, catálogo e inventario?`)) return;
    setProcessingId(req.$id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // 1. Delete from catalog_products (by productId matching $id)
      try {
        const catRes = await databases.listDocuments(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, [
          Query.equal('$id', req.productId), Query.limit(1),
        ]);
        if (catRes.documents.length > 0) {
          await databases.deleteDocument(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, catRes.documents[0].$id);
        }
      } catch (e) {
        console.warn('No se pudo eliminar de catalog_products:', e);
      }

      // 2. Delete from inventory_products
      try {
        await databases.deleteDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, req.productId);
      } catch (e) {
        console.warn('No se pudo eliminar de inventory_products:', e);
      }

      // 3. Delete the stock alert document
      await databases.deleteDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, req.$id);
      
      setAlerts(prev => prev.filter(a => a.$id !== req.$id));
    } catch (e: any) {
      window.alert('Error: ' + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteAllUserAlerts = async () => {
    if (!selectedUser) return;
    const count = selectedUser.requests.length;
    if (!confirm(`¿Eliminar las ${count} consulta${count !== 1 ? 's' : ''} de ${selectedUser.userName}?`)) return;
    setProcessingId('bulk');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const ids = selectedUser.requests.map(r => r.$id);
      await Promise.all(ids.map(id => databases.deleteDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, id)));
      setAlerts(prev => prev.filter(a => !ids.includes(a.$id)));
      setSelectedUser(null);
    } catch (e: any) {
      window.alert('Error: ' + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const timeAgo = (ts: number) => {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `hace ${days}d`;
  };

  const handleCopySkus = () => {
    if (!selectedUser) return;
    const skus = selectedUser.requests.map(r => r.sku).filter(Boolean);
    if (skus.length === 0) {
      alert('No hay SKUs para copiar en estas consultas.');
      return;
    }
    const text = skus.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert(`Se copiaron ${skus.length} SKUs al portapapeles.`);
    }).catch(err => {
      console.error('Error al copiar al portapapeles', err);
      alert('Error copiando SKUs');
    });
  };

  if (isLoading) return (
    <div className="admin-main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <RefreshCw size={32} className="animate-spin" style={{ color: '#6366f1' }} />
    </div>
  );

  if (error) return (
    <div className="admin-main-content" style={{ padding: 24 }}>
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <AlertTriangle size={20} color="#ef4444" />
        <span style={{ color: '#991b1b', fontSize: 14 }}>{error}</span>
      </div>
    </div>
  );

  // ── En mobile, si hay un usuario seleccionado mostramos solo el panel de detalle ──
  const showUserList = !isMobile || !selectedUser;
  const showUserDetail = !isMobile || !!selectedUser;

  const handlePrintPDF = (mode: 'full' | 'available' | 'gallery' = 'full') => {
    if (!selectedUser) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const found = selectedUser.requests.filter(a => a.inCatalog);
    const missing = selectedUser.requests.filter(a => !a.inCatalog);

    let contentHtml = '';

    if (mode === 'gallery') {
      contentHtml = `
        <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
          ${found.length > 0 ? found.map(f => `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; text-align: center; page-break-inside: avoid;">
              ${f.productImage 
                ? `<img src="${f.productImage}" alt="Foto" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; margin-bottom: 12px;" />` 
                : `<div style="width: 100%; aspect-ratio: 1; background: #f3f4f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #9ca3af; margin-bottom: 12px;">Sin foto</div>`
              }
              <div style="font-family: monospace; font-weight: 700; color: #4b5563; font-size: 13px; margin-bottom: 4px;">${f.sku || '-'}</div>
              <div style="font-size: 14px; font-weight: 600; color: #111827; line-height: 1.3;">${f.productName}</div>
              <div style="font-size: 12px; color: #6b7280; margin-top: 6px; background: #f0fdf4; color: #166534; padding: 4px; border-radius: 4px; display: inline-block;">
                S:${f.section || '?'} / G:${f.gondola || '?'}
              </div>
            </div>
          `).join('') : '<p>No hay productos con stock para mostrar.</p>'}
        </div>
      `;
    } else {
      contentHtml = `
        <div class="found-section">
          <h2>Productos Disponibles (${found.length})</h2>
          ${found.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th style="width: 60px;">Foto</th>
                <th style="width: 100px;">SKU</th>
                <th>Producto</th>
                <th style="width: 100px;">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              ${found.map(f => `
                <tr>
                  <td>${f.productImage ? `<img src="${f.productImage}" alt="Foto" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />` : `<div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af;">-</div>`}</td>
                  <td class="sku">${f.sku || '-'}</td>
                  <td>${f.productName}</td>
                  <td>S:${f.section || '?'} / G:${f.gondola || '?'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No se encontraron productos disponibles.</p>'}
        </div>

        ${mode === 'full' ? `
        <div class="missing-section">
          <h2>Productos Agotados / No Disponibles (${missing.length})</h2>
          ${missing.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th style="width: 60px;">Foto</th>
                <th style="width: 100px;">SKU</th>
                <th>Producto</th>
              </tr>
            </thead>
            <tbody>
              ${missing.map(m => `
                <tr>
                  <td>${m.productImage ? `<img src="${m.productImage}" alt="Foto" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />` : `<div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af;">-</div>`}</td>
                  <td class="sku">${m.sku || '-'}</td>
                  <td>${m.productName}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No hay productos faltantes.</p>'}
        </div>
        ` : ''}
      `;
    }

    const html = `
      <html>
        <head>
          <title>Reporte de Disponibilidad - ${selectedUser.userName}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; color: #111827; padding: 40px; margin: 0; }
            h1 { font-size: 24px; font-weight: 800; margin: 0 0 5px 0; }
            h2 { font-size: 18px; font-weight: 700; margin: 30px 0 10px 0; padding-bottom: 5px; border-bottom: 2px solid #e5e7eb; }
            p { color: #6b7280; font-size: 14px; margin: 0 0 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: 600; color: #374151; }
            .found-section h2 { color: #16a34a; border-color: #bbf7d0; }
            .found-section th { background: #f0fdf4; }
            .missing-section h2 { color: #dc2626; border-color: #fecaca; }
            .missing-section th { background: #fef2f2; }
            .sku { font-family: monospace; font-weight: 600; color: #4b5563; }
            @media print {
              body { padding: 0; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Disponibilidad ${mode === 'gallery' ? '(Galería)' : ''}</h1>
          <p>Cliente: <strong>${selectedUser.userName}</strong> (${selectedUser.email})<br/>Fecha: ${new Date().toLocaleDateString()}</p>
          ${contentHtml}
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="admin-main-content" style={{ padding: isMobile ? '16px 12px' : '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, color: '#111827', margin: 0 }}>Consultas de Disponibilidad</h1>
          <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>
            Clientes que consultaron productos del catálogo
          </p>
        </div>
        <button onClick={load} style={{ padding: '8px 12px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 14 : 20 }}>
        <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 10, padding: isMobile ? 12 : 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#c0547a', textTransform: 'uppercase', letterSpacing: '.5px' }}>Clientes Pendientes</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#be185d', marginTop: 2 }}>{totalPending}</div>
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: isMobile ? 12 : 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.5px' }}>Clientes Sin Stock</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#b91c1c', marginTop: 2 }}>{totalUnavailable}</div>
        </div>
        <div style={{ background: '#ecfdf5', border: '1px solid #34d399', borderRadius: 10, padding: isMobile ? 12 : 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '.5px' }}>Clientes En Tienda</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#047857', marginTop: 2 }}>{totalAvailable}</div>
        </div>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: isMobile ? 12 : 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.5px' }}>Total Clientes</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#1d4ed8', marginTop: 2 }}>{groupedUsers.length}</div>
        </div>
      </div>

      {/* Search — only show when on user list panel */}
      {showUserList && (
        <div style={{ position: 'relative', marginBottom: 12, maxWidth: isMobile ? '100%' : 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      )}

      {/* Two-panel layout — stacked on mobile */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, minHeight: isMobile ? 'auto' : 500 }}>

        {/* Panel 1: User list */}
        {showUserList && (
          <div style={{
            flex: (!isMobile && selectedUser) ? '0 0 300px' : 1,
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={15} color="#6366f1" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Clientes ({filteredUsers.length})</span>
            </div>
            <div style={{ maxHeight: isMobile ? 320 : 600, overflowY: 'auto' }}>
              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <Package size={32} color="#d1d5db" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Sin consultas aún</p>
                </div>
              ) : filteredUsers.map(u => (
                <div key={u.userId} onClick={() => setSelectedUser(u)}
                  style={{
                    padding: '11px 14px', borderBottom: '1px solid #f9fafb', cursor: 'pointer',
                    background: selectedUser?.userId === u.userId ? '#f0f0ff' : 'transparent',
                    transition: 'background .15s',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                  onMouseEnter={e => { if (selectedUser?.userId !== u.userId) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={e => { if (selectedUser?.userId !== u.userId) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} color="#6366f1" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.userName}</p>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, background: '#fdf2f8', color: '#c0547a', padding: '2px 7px', borderRadius: 10, border: '1px solid #fbcfe8', textAlign: 'right' }}>
                      {u.pendingCount} pendiente{u.pendingCount !== 1 ? 's' : ''}<br/>
                      <span style={{ color: '#16a34a' }}>{u.foundCount} encontrada{u.foundCount !== 1 ? 's' : ''}</span> · <span style={{ color: '#dc2626' }}>{u.missingCount} no existe{u.missingCount !== 1 ? 'n' : ''}</span>
                    </span>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>{u.requests.length} total</span>
                  </div>
                  <ChevronRight size={14} color="#d1d5db" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel 2: User detail */}
        {showUserDetail && (
          <div style={{ flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            {selectedUser ? (
              <>
                {/* Detail header */}
                <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => setSelectedUser(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowLeft size={16} color="#6b7280" />
                  </button>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={15} color="#6366f1" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedUser.userName}</p>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedUser.email}</p>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '3px 9px', borderRadius: 10 }}>
                    {selectedUser.requests.length} consulta{selectedUser.requests.length !== 1 ? 's' : ''}
                  </span>

                  <button onClick={handleDeleteAllUserAlerts} disabled={processingId === 'bulk'} title="Eliminar todas las consultas de este cliente" style={{ flexShrink: 0, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 5, cursor: processingId === 'bulk' ? 'wait' : 'pointer', color: '#dc2626', fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}>
                    <Trash2 size={13} /> Eliminar Todo
                  </button>
                </div>

                {/* Requests list */}
                <div style={{ maxHeight: isMobile ? 'none' : 600, overflowY: 'auto', padding: isMobile ? 10 : 12 }}>
                  {selectedUser.requests.map(a => (
                    <div key={a.$id} style={{
                      background: (a.status === 'available' || a.hasStock || a.source === 'products') ? '#ecfdf5' : a.source === 'catalog_products' ? '#f5f3ff' : a.source === 'inventory_products' ? '#fffbeb' : (a.status === 'pending' ? '#fffbf5' : '#fef2f2'),
                      border: `1px solid ${(a.status === 'available' || a.hasStock || a.source === 'products') ? '#34d399' : a.source === 'catalog_products' ? '#a78bfa' : a.source === 'inventory_products' ? '#fbbf24' : (a.status === 'pending' ? '#fbcfe8' : '#fecaca')}`,
                      borderRadius: 10, padding: isMobile ? 11 : 14, marginBottom: 10,
                      boxShadow: (a.status === 'available' || a.hasStock || a.source === 'products') ? '0 0 0 1px #34d399' : a.source === 'catalog_products' ? '0 0 0 1px #a78bfa' : a.source === 'inventory_products' ? '0 0 0 1px #fbbf24' : 'none',
                    }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        {/* Product image */}
                        {a.productImage ? (
                          <div style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                            onClick={() => setImageUrlModal({ productId: a.productId, currentUrl: a.productImage, newUrl: a.productImage })}
                            onDoubleClick={() => setZoomImageUrl(a.productImage)}
                            title="Click: cambiar imagen · Doble click: ampliar">
                            <img src={a.productImage} alt={a.productName} style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: 8, objectFit: 'cover' }} />
                            <div style={{
                              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', borderRadius: 8,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s',
                            }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}>
                              <Eye size={14} color="#fff" />
                            </div>
                          </div>
                        ) : (
                          <div style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Package size={20} color="#9ca3af" />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Name + status badge */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                            <p style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: '#111827', margin: 0, flex: 1, minWidth: 0 }}>
                              {a.productName}
                            </p>
                            {a.status === 'pending' && (a.source || a.hasStock) && (
                              <span style={{ fontSize: 10, fontWeight: 700, background: (a.source === 'products' || a.hasStock) ? '#d1fae5' : a.source === 'inventory_products' ? '#fef3c7' : a.source === 'catalog_products' ? '#ede9fe' : '#dbeafe', color: (a.source === 'products' || a.hasStock) ? '#065f46' : a.source === 'inventory_products' ? '#92400e' : a.source === 'catalog_products' ? '#6d28d9' : '#1e40af', padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3, border: `1px solid ${(a.source === 'products' || a.hasStock) ? '#34d399' : a.source === 'inventory_products' ? '#fbbf24' : a.source === 'catalog_products' ? '#a78bfa' : '#93c5fd'}`, flexShrink: 0 }}>
                                {(a.source === 'products' || a.hasStock) ? <><ShoppingCart size={10} /> En Tienda · Con Stock</> : a.source === 'inventory_products' ? <><AlertTriangle size={10} /> En Bodega</> : a.source === 'catalog_products' ? <><Eye size={10} /> En Catálogo</> : <><CheckCircle size={10} /> En Tienda</>}
                              </span>
                            )}
                            {a.status === 'pending' && !a.source && !a.hasStock && (
                              <span style={{ fontSize: 10, fontWeight: 700, background: '#fdf2f8', color: '#c0547a', padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap', border: '1px solid #fbcfe8', flexShrink: 0 }}>
                                Pendiente
                              </span>
                            )}
                            {a.status === 'available' && (
                              <span style={{ fontSize: 10, fontWeight: 700, background: '#d1fae5', color: '#065f46', padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3, border: '1px solid #34d399', flexShrink: 0 }}>
                                <ShoppingCart size={10} /> En Tienda · Con Stock
                              </span>
                            )}
                            {a.status === 'unavailable' && (
                              <span style={{ fontSize: 10, fontWeight: 700, background: '#fef2f2', color: '#dc2626', padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                                <XCircle size={10} /> Sin Stock
                              </span>
                            )}
                          </div>

                          {/* SKU and Location */}
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                            {a.sku && (
                              <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#4b5563', background: '#f3f4f6', padding: '2px 5px', borderRadius: 4 }}>
                                SKU: {a.sku}
                              </span>
                            )}
                            {a.section !== undefined && a.section !== null && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '2px 5px', borderRadius: 4 }}>
                                📍 Sec: {a.section} · Gónd: {a.gondola || '?'}
                              </span>
                            )}
                            {/* Badge: producto en products con stock (only when pending) */}
                            {(a.source === 'products' || a.hasStock) && a.status !== 'available' && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, color: '#065f46',
                                background: '#d1fae5', border: '1px solid #34d399',
                                padding: '2px 7px', borderRadius: 10,
                                display: 'flex', alignItems: 'center', gap: 3,
                                whiteSpace: 'nowrap',
                              }}>
                                <ShoppingCart size={10} /> {a.currentStock ?? 0} uds
                              </span>
                            )}
                            {/* Badge: producto en catalog_products (a pedido, only when pending) */}
                            {a.source === 'catalog_products' && a.status !== 'available' && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, color: '#6d28d9',
                                background: '#ede9fe', border: '1px solid #a78bfa',
                                padding: '2px 7px', borderRadius: 10,
                                display: 'flex', alignItems: 'center', gap: 3,
                                whiteSpace: 'nowrap',
                              }}>
                                <Eye size={10} /> En Catálogo · A Pedido
                              </span>
                            )}
                            {/* Badge: producto solo en inventory_products */}
                            {a.source === 'inventory_products' && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, color: '#92400e',
                                background: '#fef3c7', border: '1px solid #fbbf24',
                                padding: '2px 7px', borderRadius: 10,
                                display: 'flex', alignItems: 'center', gap: 3,
                                whiteSpace: 'nowrap',
                              }}>
                                <AlertTriangle size={10} /> En Verificación de Bodega
                              </span>
                            )}
                            {/* Link directo al producto en el catálogo */}
                            {(a.source === 'products' || a.source === 'catalog_products') && a.productId && (
                              <Link
                                href={`/producto/${a.productId}`}
                                target="_blank"
                                style={{ fontSize: 10, fontWeight: 600, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}
                              >
                                <ExternalLink size={10} /> Ver producto
                              </Link>
                            )}
                          </div>

                          <div style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={10} /> {timeAgo(a.createdAt)}
                          </div>

                          {/* Action buttons */}
                          {(a.status as string) === 'subido_a_stock' && (
                            <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11, color: '#1e40af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <ShoppingCart size={12} /> Producto agregado al carrito del cliente y notificado
                              </span>
                            </div>
                          )}
                          {a.status === 'pending' && (
                            <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              {/* Ir a Inventario */}
                              <Link
                                href={`/inventario?search=${encodeURIComponent(a.sku || a.productName)}`}
                                target="_blank"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  padding: isMobile ? '7px 10px' : '8px 12px',
                                  borderRadius: 8,
                                  background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(139, 92, 246) 100%)',
                                  color: '#fff', fontSize: isMobile ? 12 : 13, fontWeight: 600, textDecoration: 'none',
                                  boxShadow: 'rgba(99, 102, 241, 0.3) 0px 2px 8px',
                                }}
                              >
                                <ExternalLink size={15} /> {isMobile ? 'Inventario' : 'Ir a Inventario'}
                              </Link>

                              {/* Eliminar consulta */}
                              <button
                                onClick={() => handleDeleteAlert(a)}
                                disabled={processingId === a.$id}
                                style={{
                                  padding: isMobile ? '7px 10px' : '8px 12px', border: '1px solid #fecaca', borderRadius: 8,
                                  fontSize: isMobile ? 11 : 12, fontWeight: 700,
                                  background: '#fff', color: '#dc2626', cursor: processingId === a.$id ? 'wait' : 'pointer',
                                  display: 'flex', alignItems: 'center', gap: 4,
                                }}
                              >
                                <Trash2 size={12} /> Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, padding: 32 }}>
                <Bell size={36} color="#d1d5db" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: '#9ca3af', margin: 0 }}>Selecciona un cliente</p>
                <p style={{ fontSize: 12, color: '#d1d5db', margin: '4px 0 0' }}>Para ver sus consultas de disponibilidad</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image URL replacement modal */}
      {imageUrlModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setImageUrlModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <p className="font-bold text-gray-900">Cambiar imagen</p>
              <button onClick={() => setImageUrlModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              {imageUrlModal.currentUrl && (
                <div className="w-full h-32 rounded-xl bg-gray-100 overflow-hidden">
                  <img src={imageUrlModal.currentUrl} alt="Actual" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL de la nueva imagen</label>
                <input type="url" value={imageUrlModal.newUrl} onChange={e => setImageUrlModal(m => m ? { ...m, newUrl: e.target.value } : null)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setImageUrlModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={async () => {
                if (!imageUrlModal) return;
                try {
                  const { databases } = getServices();
                  const { databaseId } = getAppwriteConfig();
                  
                  // Try to find and update in PRODUCTS first
                  try {
                    await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, imageUrlModal.productId, { IMAGEURL: imageUrlModal.newUrl });
                  } catch (e: any) {
                    // If not in PRODUCTS, try CATALOG_PRODUCTS
                    try {
                      await databases.updateDocument(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, imageUrlModal.productId, { IMAGEURL: imageUrlModal.newUrl });
                    } catch (e2: any) {
                      // If not in CATALOG_PRODUCTS, try INVENTORY_PRODUCTS
                      try {
                        await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, imageUrlModal.productId, { IMAGEURL: imageUrlModal.newUrl });
                      } catch (e3: any) {
                        throw new Error('Producto no encontrado en ninguna colección');
                      }
                    }
                  }
                  
                  // Update local state immediately to show new image
                  setAlerts(prev => prev.map(a => a.productId === imageUrlModal.productId ? { ...a, productImage: imageUrlModal.newUrl } : a));
                  setImageUrlModal(null);
                } catch (e: any) { alert('Error: ' + e.message); }
              }} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Lightbox */}
      {zoomImageUrl && (
        <div
          onClick={() => setZoomImageUrl(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(4px)',
            zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
            cursor: 'zoom-out',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
            <img
              src={zoomImageUrl}
              alt="Zoomed"
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '85vh', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', objectFit: 'contain' }}
            />
            <button
              onClick={() => setZoomImageUrl(null)}
              style={{
                position: 'absolute', top: -14, right: -14, background: '#fff', border: 'none', borderRadius: '50%',
                width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)', cursor: 'pointer', color: '#374151', fontWeight: 'bold', fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

