'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { MEDIA_BUCKET_ID, MEDIA_PREFIXES, ORDER_BOX_PHOTOS_BUCKET_ID, ID, Query } from '@/lib/appwrite';
import { Order, OrderStatus } from '@/types/admin';
import { generateOrderPdf } from '@/lib/generateOrderPdf';
import {
  ArrowLeft, Package, User, MapPin, CreditCard, Truck, Clock, FileText,
  Phone, Mail, Hash, ChevronDown, Save, CheckCircle, Copy, Check,
  AlertTriangle, ExternalLink, Image as ImageIcon, MessageSquare, Calendar, DollarSign,
  Printer, Send, Ban, StickyNote, MapPinned, Receipt, Tag, XCircle, Upload, Search, Download
} from 'lucide-react';
import { getWarehouseLocationFromFeatures, getSkuFromFeatures, getBarcodeFromFeatures, type ProductWarehouseLocation } from '@/lib/product-features';
import { resolveStorageImageUrl } from '@/lib/product-images';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string; icon: string }> = {
  pending:            { label: 'Pendiente',                 bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400',   icon: '🕐' },
  processing:         { label: 'Pago Recibido',             bg: 'bg-blue-50',    text: 'text-blue-700',     border: 'border-blue-200',    dot: 'bg-blue-400',    icon: '🔍' },
  paid:               { label: 'Pago Verificado',           bg: 'bg-emerald-50', text: 'text-emerald-700',  border: 'border-emerald-200', dot: 'bg-emerald-400', icon: '💰' },
  assembling:         { label: 'Imprimiendo Etiqueta',      bg: 'bg-indigo-50',  text: 'text-indigo-700',   border: 'border-indigo-200',  dot: 'bg-indigo-400',  icon: '🏷️' },
  confirming_stock:   { label: 'Confirmando Stock',         bg: 'bg-teal-50',    text: 'text-teal-700',     border: 'border-teal-200',    dot: 'bg-teal-400',    icon: '🔎' },
  stock_confirmed:    { label: 'Stock Confirmado',          bg: 'bg-lime-50',    text: 'text-lime-700',     border: 'border-lime-200',    dot: 'bg-lime-400',    icon: '✔️' },
  packing:            { label: 'Embalando Pedido',          bg: 'bg-amber-50',   text: 'text-amber-700',    border: 'border-amber-200',   dot: 'bg-amber-400',   icon: '📦' },
  negotiation:        { label: 'Negociación',               bg: 'bg-pink-50',    text: 'text-pink-700',     border: 'border-pink-200',    dot: 'bg-pink-400',    icon: '🤝' },
  preparing_shipping: { label: 'Etiqueta Lista',            bg: 'bg-orange-50',  text: 'text-orange-700',   border: 'border-orange-200',  dot: 'bg-orange-400',  icon: '🏷️' },
  ready_to_ship:      { label: 'Listo para Despachar',      bg: 'bg-cyan-50',    text: 'text-cyan-700',     border: 'border-cyan-200',    dot: 'bg-cyan-400',    icon: '📋' },
  shipped:            { label: 'Salió de Tienda',           bg: 'bg-violet-50',  text: 'text-violet-700',   border: 'border-violet-200',  dot: 'bg-violet-400',  icon: '🚚' },
  delivered:          { label: 'Entregado a Agencia',       bg: 'bg-green-50',   text: 'text-green-700',    border: 'border-green-200',   dot: 'bg-green-400',   icon: '✅' },
  cancelled:          { label: 'Cancelado',                 bg: 'bg-red-50',     text: 'text-red-700',      border: 'border-red-200',     dot: 'bg-red-400',     icon: '❌' },
};

const STATUS_FLOW = ['pending', 'processing', 'paid', 'assembling', 'confirming_stock', 'stock_confirmed', 'packing', 'ready_to_ship', 'shipped', 'delivered'];

// Colores hex por estado (para gradientes/glows del rediseño)
const STATUS_HEX: Record<string, string> = {
  pending: '#f97316', processing: '#3b82f6', paid: '#10b981',
  assembling: '#6366f1', confirming_stock: '#14b8a6', stock_confirmed: '#65a30d',
  packing: '#d97706', negotiation: '#ec4899', preparing_shipping: '#f97316',
  ready_to_ship: '#06b6d4', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444',
};

const isBluexpress = (agency?: string) => !!agency && agency.toUpperCase().replace(/\s/g, '').includes('BLUEXPRESS');
const isPickupAgency = (agency?: string) => !!agency && agency.toUpperCase() === 'RETIRO EN TIENDA';

// Etiqueta del estado según sea retiro en tienda o envío por agencia
const displayStatusLabel = (status: string, agency?: string): string => {
  const pickup = isPickupAgency(agency);
  if (status === 'ready_to_ship') return pickup ? 'Listo para Retirar' : 'Listo para Despachar';
  if (status === 'delivered') return pickup ? 'Entregado' : 'Entregado a Agencia';
  return STATUS_CONFIG[status]?.label || status;
};

const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

const fmtDate = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const fmtTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
};

function isPdfUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.toLowerCase();
  return clean.endsWith('.pdf') || clean.includes('.pdf') || clean.includes('ext=pdf');
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [productStocks, setProductStocks] = useState<Record<string, number>>({});
  const [productLocations, setProductLocations] = useState<Record<string, ProductWarehouseLocation>>({});
  const [productSkus, setProductSkus] = useState<Record<string, string>>({});
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});
  const [productBarcodes, setProductBarcodes] = useState<Record<string, string>>({});
  const [proofOpen, setProofOpen] = useState(false);
  const [shippingProofOpen, setShippingProofOpen] = useState(false);
  const [paymentProofIsPdf, setPaymentProofIsPdf] = useState(false);
  const [shippingProofIsPdf, setShippingProofIsPdf] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadingShippingProof, setUploadingShippingProof] = useState(false);
  const [uploadingBoxPhoto, setUploadingBoxPhoto] = useState(false);
  const [detectedAddr, setDetectedAddr] = useState<{ region: string; comuna: string; full: string } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [agencies, setAgencies] = useState<{ name: string }[]>([]);
  const [editingAgency, setEditingAgency] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [savingAgency, setSavingAgency] = useState(false);
  const [editingTracking, setEditingTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [savingTracking, setSavingTracking] = useState(false);
  const prevStatusRef = useRef<string | null>(null);

  // Out of stock & Replacement states
  const [replacingIdx, setReplacingIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [isSimilarSearch, setIsSimilarSearch] = useState(false);
  const [notifyingIdx, setNotifyingIdx] = useState<number | null>(null);
  const [notifiedIndices, setNotifiedIndices] = useState<Set<number>>(new Set());
  const [missingQty, setMissingQty] = useState<number>(1);

  const toggleMissingItem = async (index: number) => {
    if (!order) return;
    let parsedItems: any[] = [];
    try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}
    const item = parsedItems[index];
    if (!item) return;

    const isCurrentlyMissing = !!item.missing;
    item.missing = !isCurrentlyMissing;

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
        ITEMS: JSON.stringify(parsedItems)
      });
      setOrder(prev => prev ? { ...prev, ITEMS: JSON.stringify(parsedItems) } : null);
      // If now missing, clear notification flag so button reappears
      if (isCurrentlyMissing) {
        setNotifiedIndices(prev => { const s = new Set(prev); s.delete(index); return s; });
      }
    } catch (e: any) {
      alert('Error al actualizar el producto: ' + e.message);
    }
  };

  const notifyMissingItemToCustomer = async (index: number, itemName: string) => {
    if (!order || notifyingIdx === index) return;
    setNotifyingIdx(index);
    try {
      const { notifyOrderStatusChange } = await import('@/services/notificationService');
      const { createNotificationClient, resolveUserIdFromOrder } = await import('@/services/notificationService');
      const userId = await resolveUserIdFromOrder(order);
      if (!userId) {
        alert('No se pudo encontrar al usuario del pedido para notificar.');
        return;
      }
      const code = order.ORDERCODE || order.$id;
      await createNotificationClient({
        title: '⚠️ Producto sin stock en tu pedido',
        message: `El producto "${itemName}" en tu pedido ${code} no está disponible. Puedes elegir un reemplazo en tu pedido.`,
        type: 'warning',
        userId,
        link: `/pedido/${order.$id}`,
        refKey: `missing:${order.$id}:${index}:${Date.now()}`,
      });
      setNotifiedIndices(prev => new Set(prev).add(index));
      alert('¡Cliente notificado! Verá el aviso al ingresar a la app.');
    } catch (e: any) {
      alert('Error al notificar al cliente: ' + e.message);
    } finally {
      setNotifyingIdx(null);
    }
  };

  const handleSearchProducts = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      // Búsqueda nativa
      const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
        Query.search('NAME', q.trim()),
        Query.limit(15)
      ]);
      setSearchResults(res.documents);
    } catch {
      // Fallback
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
          Query.limit(100)
        ]);
        const filteredProds = res.documents.filter((p: any) =>
          p.NAME?.toLowerCase().includes(q.toLowerCase()) ||
          p.sku?.toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(filteredProds.slice(0, 15));
      } catch {}
    } finally {
      setSearching(false);
    }
  };

  const handleSearchBySkuAndReplace = async (skuQuery: string) => {
    const trimmed = skuQuery.trim();
    if (!trimmed) return;
    setSearching(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      let doc = null;
      const queriesToTry = [
        trimmed,
        trimmed.toUpperCase(),
        trimmed.toLowerCase()
      ];
      
      const uniqueQueries = Array.from(new Set(queriesToTry));
      
      for (const q of uniqueQueries) {
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
          Query.equal('sku', q),
          Query.limit(1)
        ]);
        if (res.documents.length > 0) {
          doc = res.documents[0];
          break;
        }
      }
      
      if (doc) {
        await replaceItem(doc);
      } else {
        alert(`No se encontró ningún producto con el SKU "${trimmed}". Asegúrate de que el SKU sea correcto.`);
      }
    } catch (err: any) {
      alert('Error al buscar por SKU: ' + err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleUpdateQty = async (index: number, newQty: number) => {
    if (!order) return;
    let parsedItems: any[] = [];
    try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}
    const targetItem = parsedItems[index];
    if (!targetItem) return;

    if (newQty === 0) {
      if (!confirm('¿Eliminar este producto de la orden?')) return;
      parsedItems.splice(index, 1);
    } else {
      targetItem.qty = newQty;
      targetItem.total = targetItem.price * newQty;
    }

    const newSubtotal = parsedItems.reduce((s, x) => s + (x.price * x.qty), 0);
    const newTotal = newSubtotal + (order.SHIPPINGCOST || 0) - (order.DISCOUNTAMOUNT || 0);

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
        ITEMS: JSON.stringify(parsedItems),
        SUBTOTAL: newSubtotal,
        TOTAL: newTotal
      });
      await load();
    } catch (err: any) {
      alert('Error al actualizar cantidad: ' + err.message);
    }
  };

  const handleOpenSimilarSearch = async (index: number) => {
    const oldItem = items[index];
    if (!oldItem) return;

    let initialMissing = oldItem.qty || 1;
    if (oldItem.qty > 1) {
      const input = prompt(`¿Cuántas unidades faltan de "${oldItem.name}"? (Máx: ${oldItem.qty})`, oldItem.qty.toString());
      if (input === null) return; // cancelado
      const parsed = parseInt(input, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > oldItem.qty) {
        alert("Cantidad inválida");
        return;
      }
      initialMissing = parsed;
    }

    setMissingQty(initialMissing);
    setReplacingIdx(index);
    setIsSimilarSearch(true);
    setSearching(true);
    setSearchQuery('');
    setSearchResults([]);

    const targetPrice = oldItem.price || 0;
    const totalMissingPrice = targetPrice * initialMissing;

    // Rango de consulta: Nunca menos a 100 pesos ni mayor a 1000 pesos de diferencia
    const minDiscounted = Math.max(0, totalMissingPrice - 100);
    const maxDiscounted = totalMissingPrice + 1000;

    const minPriceLimit = Math.round(minDiscounted / 0.8);
    const maxPriceLimit = Math.round(maxDiscounted / 0.8);

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // 1. Query products with price range (accounting for 20% discount)
      let prods: any[] = [];
      try {
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
          Query.greaterThanEqual('PRICE', minPriceLimit),
          Query.lessThanEqual('PRICE', maxPriceLimit),
          Query.limit(100)
        ]);
        prods = res.documents;
      } catch (err) {
        console.error("Error querying by price range:", err);
      }

      // 2. Sort by price descending (siempre primero lo mayor)
      const sorted = [...prods].sort((a: any, b: any) => {
        const priceA = Math.round((a.CURRENTPRICE ?? a.PRICE ?? 0) * 0.8);
        const priceB = Math.round((b.CURRENTPRICE ?? b.PRICE ?? 0) * 0.8);
        return priceB - priceA;
      });

      // Filter out the product itself from the results if it matches oldItem.id
      const filtered = sorted.filter((p: any) => p.$id !== oldItem.id);

      setSearchResults(filtered);
    } catch (e) {
      console.error("Error finding similar products:", e);
    } finally {
      setSearching(false);
    }
  };

  const handleDownloadSimilarCatalog = () => {
    if (replacingIdx === null || !items[replacingIdx]) return;
    if (searchResults.length === 0) {
      alert("No hay opciones disponibles para descargar.");
      return;
    }

    const topResults = searchResults.slice(0, 4); // Max 4 opciones
    
    topResults.forEach(p => {
      if (p.IMAGEURL) {
        // Change Appwrite /view endpoint to /download to force browser download
        const downloadUrl = p.IMAGEURL.replace('/view?', '/download?');
        const price = Math.round((p.CURRENTPRICE ?? p.PRICE ?? 0) * 0.8);
        
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.target = '_blank';
        // Optional: you can include the price in the downloaded filename
        a.download = `${p.NAME.replace(/[^a-zA-Z0-9]/g, '_')}_$${price}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };

  const replaceItem = async (newProduct: any) => {
    if (!order || replacingIdx === null) return;
    let parsedItems: any[] = [];
    try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}
    const oldItem = parsedItems[replacingIdx];
    if (!oldItem) return;

    const confirmMsg = `¿Reemplazar "${oldItem.name}" por "${newProduct.NAME}"?\nSe registrará el bloqueo del SKU y se eliminará de la tienda.`;
    if (!confirm(confirmMsg)) return;

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      let oldSku = oldItem.sku || '';
      let oldName = oldItem.name;
      let oldImg = oldItem.img || '';

      if (oldItem.id) {
        try {
          const oldProd: any = await databases.getDocument(databaseId, PRODUCTS_COLLECTION_ID, oldItem.id);
          oldSku = oldProd.sku || getSkuFromFeatures(oldProd.FEATURES, oldProd.TAGS, oldProd.jumpseller_id, oldProd.sku);
          oldName = oldProd.NAME || oldName;
          oldImg = oldProd.IMAGEURL || oldImg;
        } catch {
          try {
            const nameSearchRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
              Query.equal('NAME', oldItem.name),
              Query.limit(1)
            ]);
            if (nameSearchRes.documents.length > 0) {
              const oldProd = nameSearchRes.documents[0] as any;
              oldSku = oldProd.sku || getSkuFromFeatures(oldProd.FEATURES, oldProd.TAGS, oldProd.jumpseller_id, oldProd.sku);
              oldName = oldProd.NAME || oldName;
              oldImg = oldProd.IMAGEURL || oldImg;
            }
          } catch (errName) {
            console.error("Error doing name fallback search for blocked products:", errName);
          }
        }
      }

      if (oldSku) {
        try {
          const blockedResp = await databases.listDocuments(databaseId, 'blocked_products', [
            Query.equal('sku', oldSku),
            Query.limit(1)
          ]);
          if (blockedResp.documents.length === 0) {
            await databases.createDocument(databaseId, 'blocked_products', ID.unique(), {
              sku: oldSku,
              name: oldName,
              imageUrl: oldImg
            });
          }
        } catch (err) {
          console.error("Error writing to blocked_products:", err);
        }
      }

      if (oldItem.id) {
        try {
          await databases.deleteDocument(databaseId, PRODUCTS_COLLECTION_ID, oldItem.id);
        } catch {}
      }

      const newPrice = Math.round((newProduct.CURRENTPRICE ?? newProduct.PRICE ?? 0) * 0.8);
      const newSku = newProduct.sku || getSkuFromFeatures(newProduct.FEATURES, newProduct.TAGS, newProduct.jumpseller_id, newProduct.sku);

      const totalMissingPrice = missingQty * (oldItem.price || 0);
      const isCloserToTotal = Math.abs(newPrice - totalMissingPrice) < Math.abs(newPrice - (oldItem.price || 0));
      const newQty = isCloserToTotal ? 1 : missingQty;

      const newReplacedItem = {
        ...oldItem,
        id: newProduct.$id,
        name: newProduct.NAME,
        price: newPrice,
        originalPrice: newProduct.CURRENTPRICE ?? newProduct.PRICE ?? 0,
        img: resolveStorageImageUrl(newProduct.IMAGEURL),
        sku: newSku,
        qty: newQty,
        total: newPrice * newQty,
        missing: false,
        replaced: true,
        originalItem: {
          id: oldItem.id || '',
          name: oldItem.name,
          price: oldItem.price,
          img: oldItem.img || '',
          sku: oldSku
        }
      };

      // Reemplazo total siempre para evitar items duplicados o divididos por error
      parsedItems[replacingIdx] = newReplacedItem;

      const newSubtotal = parsedItems.reduce((s, it) => s + (it.price * it.qty), 0);
      const newTotal = newSubtotal + (order.SHIPPINGCOST || 0) - (order.DISCOUNTAMOUNT || 0);

      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
        ITEMS: JSON.stringify(parsedItems),
        SUBTOTAL: newSubtotal,
        TOTAL: newTotal
      });

      setReplacingIdx(null);
      setSearchQuery('');
      setSearchResults([]);
      setIsSimilarSearch(false);
      await load();
      alert('Producto reemplazado y bloqueado exitosamente.');
    } catch (e: any) {
      alert('Error al reemplazar el producto: ' + e.message);
    }
  };

  // Auto-print when status changes to 'assembling' (Imprimiendo Etiqueta)
  useEffect(() => {
    if (!order) return;
    const prev = prevStatusRef.current;
    prevStatusRef.current = order.STATUS;
    if (prev && prev !== 'assembling' && order.STATUS === 'assembling') {
      setTimeout(() => window.print(), 500);
    }
  }, [order?.STATUS]);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const doc = await databases.getDocument(databaseId, ORDERS_COLLECTION_ID, orderId);
      const o = doc as unknown as Order;
      setOrder(o);
      setAdminNotes(o.adminNotes || '');
      setTrackingNumber((o as any).TRACKINGNUMBER || '');

      // Fetch product stocks
      let items: { id?: string }[] = [];
      try { items = JSON.parse(o.ITEMS || '[]'); } catch {}
      const productIds = items.map(it => it.id).filter((id): id is string => Boolean(id));
      if (productIds.length > 0) {
        const stocks: Record<string, number> = {};
        const locs: Record<string, ProductWarehouseLocation> = {};
        const skus: Record<string, string> = {};
        const prices: Record<string, number> = {};
        const barcodes: Record<string, string> = {};
        await Promise.all(productIds.map(async (pid) => {
          try {
            const product = await databases.getDocument(databaseId, PRODUCTS_COLLECTION_ID, pid);
            const doc = product as { STOCK?: number; FEATURES?: string; TAGS?: string; jumpseller_id?: string; sku?: string; section?: number; PRICE?: number; barcode?: string };
            stocks[pid] = doc.STOCK || 0;
            locs[pid] = getWarehouseLocationFromFeatures(doc.FEATURES, doc.section);
            skus[pid] = getSkuFromFeatures(doc.FEATURES, doc.TAGS, doc.jumpseller_id, doc.sku);
            prices[pid] = doc.PRICE || 0;
            barcodes[pid] = getBarcodeFromFeatures(doc.FEATURES, doc.barcode);
          } catch {}
        }));
        setProductStocks(stocks);
        setProductLocations(locs);
        setProductSkus(skus);
        setProductPrices(prices);
        setProductBarcodes(barcodes);
      } else {
        setProductLocations({});
      }
    } catch (e: any) {
      setError(e.message || 'Error al cargar el pedido');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { load(); }, [load]);

  // Reverse-geocode de las coords GPS del cliente → dirección detectada (región/comuna)
  useEffect(() => {
    const info = order?.ADDITIONALINFO || '';
    const m = info.match(/\[GEO:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\]/);
    if (!m) { setDetectedAddr(null); return; }
    let cancelled = false;
    setGeoLoading(true);
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${m[1]}&longitude=${m[2]}&localityLanguage=es`)
      .then(r => r.json())
      .then((d: any) => {
        if (cancelled) return;
        const region = d.principalSubdivision || '';
        const comuna = d.city || d.locality || '';
        const full = Array.from(new Set([d.locality, d.city, d.principalSubdivision, d.countryName].filter(Boolean))).join(', ');
        setDetectedAddr({ region, comuna, full });
      })
      .catch(() => { if (!cancelled) setDetectedAddr(null); })
      .finally(() => { if (!cancelled) setGeoLoading(false); });
    return () => { cancelled = true; };
  }, [order?.ADDITIONALINFO]);

  useEffect(() => {
    if (order?.PAYMENTPROOFURL) {
      if (isPdfUrl(order.PAYMENTPROOFURL)) {
        setPaymentProofIsPdf(true);
      } else {
        fetch(order.PAYMENTPROOFURL, { method: 'HEAD' })
          .then(res => {
            const contentType = res.headers.get('content-type');
            if (contentType?.includes('application/pdf')) {
              setPaymentProofIsPdf(true);
            } else {
              setPaymentProofIsPdf(false);
            }
          })
          .catch(err => {
            console.warn('Error checking payment proof Content-Type:', err);
            setPaymentProofIsPdf(false);
          });
      }
    } else {
      setPaymentProofIsPdf(false);
    }

    if (order?.SHIPPINGPROOFURL) {
      if (isPdfUrl(order.SHIPPINGPROOFURL)) {
        setShippingProofIsPdf(true);
      } else {
        fetch(order.SHIPPINGPROOFURL, { method: 'HEAD' })
          .then(res => {
            const contentType = res.headers.get('content-type');
            if (contentType?.includes('application/pdf')) {
              setShippingProofIsPdf(true);
            } else {
              setShippingProofIsPdf(false);
            }
          })
          .catch(err => {
            console.warn('Error checking shipping proof Content-Type:', err);
            setShippingProofIsPdf(false);
          });
      }
    } else {
      setShippingProofIsPdf(false);
    }
  }, [order?.PAYMENTPROOFURL, order?.SHIPPINGPROOFURL]);

  // Load agencies for the selector
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/agencies');
        const data = await res.json();
        if (data.agencies) setAgencies(data.agencies);
      } catch {}
    })();
  }, []);

  const saveAgency = async () => {
    if (!order || !selectedAgency) return;
    setSavingAgency(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
        SHIPPINGAGENCY: selectedAgency,
        AGENCYCHANGED: true,
      });
      setOrder(prev => prev ? { ...prev, SHIPPINGAGENCY: selectedAgency, AGENCYCHANGED: true } : prev);
      setEditingAgency(false);
    } catch (e: any) {
      console.error('Error updating agency:', e?.message);
    } finally {
      setSavingAgency(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    const prevStatus = order.STATUS;
    setUpdating(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // If cancelling, restore stock (only for products with real stock, not 99999 sentinel)
      if (newStatus === 'cancelled') {
        let items: { id?: string; qty?: number }[] = [];
        try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
        for (const item of items) {
          if (item.id && item.qty) {
            try {
              const product = await databases.getDocument(databaseId, PRODUCTS_COLLECTION_ID, item.id);
              const currentStock = (product as any).STOCK || 0;
              // No restituir si el producto tiene stock ilimitado (sentinel 99999)
              if (currentStock === 99999) continue;
              await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, item.id, {
                STOCK: currentStock + item.qty,
              });
            } catch (err) { console.error('Error restoring stock for product', item.id, err); }
          }
        }
      }

      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
        STATUS: newStatus,
        UPDATEDAT: Date.now(),
      });
      setOrder(prev => prev ? { ...prev, STATUS: newStatus as OrderStatus } : prev);
      const { notifyOrderStatusChange } = await import('@/services/notificationService');
      await notifyOrderStatusChange(order, prevStatus, newStatus).catch(() => {});
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!order) return;
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
        adminNotes: adminNotes.trim(),
      });
      setOrder(prev => prev ? { ...prev, adminNotes: adminNotes.trim() } : prev);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyOrderItemsList = (type: 'barcode' | 'sku') => {
    if (!order) return;
    let parsedItems: any[] = [];
    try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}
    
    const lines = parsedItems.map(it => {
      let code = '';
      if (type === 'barcode') {
        if (it.id) {
          code = productBarcodes[it.id] || '';
        }
        if (!code) {
          code = (it as any).barcode || '';
        }
        if (!code && it.id) {
          code = productSkus[it.id] || '';
        }
        if (!code) {
          code = it.sku || '';
        }
      } else {
        if (it.id) {
          code = productSkus[it.id] || '';
        }
        if (!code) {
          code = it.sku || '';
        }
        if (!code && it.id) {
          code = productBarcodes[it.id] || '';
        }
        if (!code) {
          code = (it as any).barcode || '';
        }
      }
      
      if (!code) {
        code = it.id || it.name || '';
      }
      
      const qty = it.qty || 1;
      
      let origPrice = 0;
      if (it.id) {
        origPrice = productPrices[it.id] || 0;
      }
      if (!origPrice) {
        origPrice = it.originalPrice || it.price || 0;
      }
      
      return `${code},${qty},${origPrice}`;
    });
    
    const textToCopy = lines.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(type === 'barcode' ? 'copiedBarcode' : 'copiedSku');
    setTimeout(() => setCopied(null), 1500);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">Error al cargar el pedido</p>
            <p className="text-sm text-red-600">{error || 'Pedido no encontrado'}</p>
          </div>
          <Link href="/admin/orders" className="ml-auto px-4 py-2 bg-white border border-red-200 rounded-xl text-sm text-red-700 hover:bg-red-50">
            Volver
          </Link>
        </div>
      </div>
    );
  }

  let items: { name: string; qty: number; price: number; total: number; img?: string; id?: string; originalPrice?: number | null }[] = [];
  try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
  const date = order.CREATEDAT ? new Date(order.CREATEDAT) : new Date(order.$createdAt);
  const ageMs = Date.now() - date.getTime();
  const isOverdue = order.STATUS === 'pending' && ageMs > 3 * 86400000;
  const scRaw = STATUS_CONFIG[order.STATUS] || STATUS_CONFIG.pending;
  const isRetiro = order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
  const isReadyRetiro = order.STATUS === 'ready_to_ship' && isRetiro;
  const sc = {
    ...scRaw,
    label: isReadyRetiro ? 'Listo para retirar' : displayStatusLabel(order.STATUS, order.SHIPPINGAGENCY),
    bg: isReadyRetiro ? 'bg-fuchsia-50' : scRaw.bg,
    text: isReadyRetiro ? 'text-fuchsia-700' : scRaw.text,
    border: isReadyRetiro ? 'border-fuchsia-200' : scRaw.border,
    dot: isReadyRetiro ? 'bg-fuchsia-400' : scRaw.dot,
    icon: isReadyRetiro ? '🛍️' : scRaw.icon,
  };
  const customerNote = (order as any).CUSTOMERNOTE;
  const isGift = (order as any).ISGIFT;
  const isLive = (order as any).PURCHASEDFROMLIVE;

  const currentStepIdx = STATUS_FLOW.indexOf(order.STATUS);
  const isCancelled = order.STATUS === 'cancelled';

  const rawAdditionalInfo = order.ADDITIONALINFO || '';
  const geoMatch = rawAdditionalInfo.match(/\[GEO:(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\]/);
  const isGeolocated = !!geoMatch;
  const geoLat = geoMatch ? geoMatch[1] : null;
  const geoLng = geoMatch ? geoMatch[3] : null;
  const displayAdditionalInfo = geoMatch
    ? rawAdditionalInfo.replace(geoMatch[0], '').trim()
    : rawAdditionalInfo;

  // Comparación dirección ingresada vs. detectada por GPS
  const normTxt = (s?: string) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, '').trim();
  const fieldMatch = (a?: string, b?: string) => {
    const na = normTxt(a), nb = normTxt(b);
    if (!na || !nb) return false;
    return na === nb || na.includes(nb) || nb.includes(na);
  };
  const comunaMatches = fieldMatch(order.COMUNA, detectedAddr?.comuna);
  const regionMatches = fieldMatch(order.REGION, detectedAddr?.region);
  const geoAddressMatches = !!detectedAddr && comunaMatches && regionMatches;

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'cancelled' && !confirm('¿Cancelar este pedido? El stock será devuelto.')) return;
    updateStatus(newStatus);
  };

  const handleAdminUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploadingProof(true);
    try {
      const { storage, databases } = getServices();
      const { databaseId, endpoint, projectId } = getAppwriteConfig();
      const fileId = ID.unique();
      await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const url = `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}&ext=${ext}`;
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
        PAYMENTPROOFURL: url,
        STATUS: order.STATUS === 'pending' ? 'processing' : order.STATUS,
      });
      await load();
    } catch (err: any) {
      alert('Error al subir comprobante: ' + (err?.message || err));
    } finally {
      setUploadingProof(false);
    }
  };

  const handleAdminUploadShippingProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploadingShippingProof(true);
    try {
      const { storage, databases } = getServices();
      const { databaseId, endpoint, projectId } = getAppwriteConfig();
      const fileId = ID.unique();
      await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const url = `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}&ext=${ext}`;

      // El voucher/comprobante de envío solo se adjunta; no fuerza cambio de estado
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
        SHIPPINGPROOFURL: url,
        UPDATEDAT: Date.now(),
      });
      setOrder(prev => prev ? { ...prev, SHIPPINGPROOFURL: url } : prev);

      // Abrir automáticamente el comprobante PDF/imagen en el navegador
      window.open(url, '_blank');

      await load();
    } catch (err: any) {
      alert('Error al subir comprobante de envío: ' + (err?.message || err));
    } finally {
      setUploadingShippingProof(false);
    }
  };

  const handleSaveTracking = async () => {
    if (!order) return;
    setSavingTracking(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
        TRACKINGNUMBER: trackingNumber,
      });
      setOrder(prev => prev ? { ...prev, TRACKINGNUMBER: trackingNumber } as any : prev);
      setEditingTracking(false);
      alert('Número de seguimiento guardado.');
    } catch (err: any) {
      alert('Error al guardar el número de seguimiento: ' + (err.message || err));
    } finally {
      setSavingTracking(false);
    }
  };

  const handleAdminDeleteShippingProof = async () => {
    if (!order) return;
    if (!confirm('¿Seguro que deseas eliminar el comprobante de envío?')) return;
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
        SHIPPINGPROOFURL: '',
      });
      setOrder(prev => prev ? { ...prev, SHIPPINGPROOFURL: '' } : prev);
      alert('Comprobante de envío eliminado correctamente.');
      await load();
    } catch (err: any) {
      alert('Error al eliminar comprobante de envío: ' + (err?.message || err));
    }
  };

  const handleUploadBoxPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !order) return;
    setUploadingBoxPhoto(true);
    try {
      const { storage, databases } = getServices();
      const { databaseId, endpoint, projectId } = getAppwriteConfig();
      const newUrls: string[] = [];
      for (const file of files) {
        const fileId = ID.unique();
        await storage.createFile(ORDER_BOX_PHOTOS_BUCKET_ID, fileId, file);
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        newUrls.push(`${endpoint}/storage/buckets/${ORDER_BOX_PHOTOS_BUCKET_ID}/files/${fileId}/view?project=${projectId}&ext=${ext}`);
      }
      let current: string[] = [];
      try { current = JSON.parse(order.BOXPHOTOS || '[]'); } catch {}
      const merged = [...current, ...newUrls];
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
        BOXPHOTOS: JSON.stringify(merged),
        UPDATEDAT: Date.now(),
      });
      setOrder(prev => prev ? { ...prev, BOXPHOTOS: JSON.stringify(merged) } : prev);
    } catch (err: any) {
      alert('Error al subir foto(s) de las cajas: ' + (err?.message || err));
    } finally {
      setUploadingBoxPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeleteBoxPhoto = async (url: string) => {
    if (!order || !confirm('¿Eliminar esta foto de las cajas?')) return;
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      let current: string[] = [];
      try { current = JSON.parse(order.BOXPHOTOS || '[]'); } catch {}
      const next = current.filter(u => u !== url);
      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
        BOXPHOTOS: JSON.stringify(next),
      });
      setOrder(prev => prev ? { ...prev, BOXPHOTOS: JSON.stringify(next) } : prev);
    } catch (err: any) {
      alert('Error al eliminar la foto: ' + (err?.message || err));
    }
  };

  // Fotos de las cajas (parse seguro)
  let boxPhotos: string[] = [];
  try { boxPhotos = JSON.parse(order.BOXPHOTOS || '[]'); } catch {}
  // Banner de alerta: agencia (no BluExpress, no retiro) ya despachada sin N° seguimiento ni voucher
  const orderIsPickup = isPickupAgency(order.SHIPPINGAGENCY);
  const orderIsBluexpress = isBluexpress(order.SHIPPINGAGENCY);
  const trackingPending =
    ['shipped', 'delivered'].includes(order.STATUS) &&
    !!order.SHIPPINGAGENCY && !orderIsPickup && !orderIsBluexpress &&
    !((order as any).TRACKINGNUMBER && (order as any).TRACKINGNUMBER.trim()) &&
    !(order.SHIPPINGPROOFURL && order.SHIPPINGPROOFURL.trim());
  // Mostrar sección de fotos de cajas desde que está listo para despachar en adelante
  const showBoxPhotos = ['ready_to_ship', 'shipped', 'delivered'].includes(order.STATUS) && !orderIsPickup;

  const totalItems = items.reduce((s, it) => s + it.qty, 0);
  const ageDays = Math.floor(ageMs / 86400000);
  const ageHours = Math.floor(ageMs / 3600000);
  const ageStr = ageDays > 0 ? `${ageDays}d` : `${ageHours}h`;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-inside: avoid; break-inside: avoid; }
          body { background: #fff !important; }
          /* Single column layout for print */
          .print-area { width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .print-area .lg\:grid-cols-3 { grid-template-columns: 1fr !important; }
          .print-area .lg\:col-span-2 { grid-column: span 1 !important; }
          /* No forced page breaks - let content flow naturally */
          .print-info-block { page-break-after: auto; }
          .print-products-block { page-break-before: auto; }
          /* Remove shadows/borders for cleaner print */
          .print-area .shadow-sm { box-shadow: none !important; }
          .print-area .divide-y > div { page-break-inside: avoid; break-inside: avoid; }
        }
      `}</style>

      {/* Proof lightbox */}
      {proofOpen && order.PAYMENTPROOFURL && (() => {
        const isPdf = isPdfUrl(order.PAYMENTPROOFURL) || paymentProofIsPdf;
        return (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4 gap-4" onClick={() => setProofOpen(false)}>
            <div className="no-print flex gap-4">
              <a 
                href={order.PAYMENTPROOFURL} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-indigo-700 transition"
              >
                <ExternalLink className="w-4 h-4" /> Abrir archivo / Descargar
              </a>
              <button onClick={() => setProofOpen(false)} className="px-4 py-2 bg-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/30 transition">
                Cerrar
              </button>
            </div>
            <div className="relative max-w-3xl max-h-[80vh] w-full flex items-center justify-center p-6 bg-gray-900 rounded-2xl" onClick={e => e.stopPropagation()}>
              {isPdf ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-white">
                  <FileText size={64} className="text-indigo-400 animate-pulse" />
                  <p className="text-sm font-semibold text-gray-300">Este comprobante es un archivo PDF</p>
                  <a href={order.PAYMENTPROOFURL} target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition font-bold text-xs flex items-center gap-2 no-underline">
                    <ExternalLink size={14} /> Abrir y ver PDF en nueva pestaña
                  </a>
                </div>
              ) : (
                <img src={order.PAYMENTPROOFURL} alt="Comprobante de pago" className="w-full h-auto max-h-[75vh] object-contain rounded-2xl" />
              )}
            </div>
          </div>
        );
      })()}

      {/* Shipping Proof lightbox */}
      {shippingProofOpen && order.SHIPPINGPROOFURL && (() => {
        const isPdf = isPdfUrl(order.SHIPPINGPROOFURL) || shippingProofIsPdf;
        return (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4 gap-4" onClick={() => setShippingProofOpen(false)}>
            <div className="no-print flex gap-4">
              <a 
                href={order.SHIPPINGPROOFURL} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-indigo-700 transition"
              >
                <ExternalLink className="w-4 h-4" /> Abrir archivo / Descargar
              </a>
              <button onClick={() => setShippingProofOpen(false)} className="px-4 py-2 bg-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/30 transition">
                Cerrar
              </button>
            </div>
            <div className="relative max-w-3xl max-h-[80vh] w-full flex items-center justify-center p-6 bg-gray-900 rounded-2xl" onClick={e => e.stopPropagation()}>
              {isPdf ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-white">
                  <FileText size={64} className="text-indigo-400 animate-pulse" />
                  <p className="text-sm font-semibold text-gray-300">Este comprobante es un archivo PDF</p>
                  <a href={order.SHIPPINGPROOFURL} target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition font-bold text-xs flex items-center gap-2 no-underline">
                    <ExternalLink size={14} /> Abrir y ver PDF en nueva pestaña
                  </a>
                </div>
              ) : (
                <img src={order.SHIPPINGPROOFURL} alt="Comprobante de envío" className="w-full h-auto max-h-[75vh] object-contain rounded-2xl" />
              )}
            </div>
          </div>
        );
      })()}

      {/* Replacement Modal */}
      {replacingIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-xl border border-gray-100">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {items[replacingIdx]?.img ? <img src={items[replacingIdx]?.img} className="w-full h-full object-contain p-1" /> : <Package className="w-5 h-5 text-gray-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {isSimilarSearch ? 'Buscar Productos Similares' : 'Reemplazar Producto'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Reemplazando: <span className="font-semibold text-gray-700">{items[replacingIdx]?.name}</span> ({fmt(items[replacingIdx]?.price)})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSimilarSearch && searchResults.length > 0 && (
                  <button
                    onClick={handleDownloadSimilarCatalog}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm mr-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar Imágenes
                  </button>
                )}
                <button
                  onClick={() => { setReplacingIdx(null); setSearchQuery(''); setSearchResults([]); setIsSimilarSearch(false); }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={e => {
                      setIsSimilarSearch(false);
                      handleSearchProducts(e.target.value);
                    }}
                    onKeyDown={async e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        await handleSearchBySkuAndReplace(searchQuery);
                      }
                    }}
                    placeholder="Buscar por nombre o SKU..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-2.5">
                {searching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    {searchQuery.trim() ? 'No se encontraron productos' : 'Escribe para buscar productos disponibles...'}
                  </p>
                ) : (
                  searchResults.map(p => {
                    const originalPrice = p.CURRENTPRICE ?? p.PRICE ?? 0;
                    const price = Math.round(originalPrice * 0.8);
                    const pSku = p.sku || getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku);
                    return (
                      <div
                        key={p.$id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100/70 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.IMAGEURL ? (
                            <img src={p.IMAGEURL} alt={p.NAME} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{p.NAME}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                            SKU: <span className="font-mono">{pSku || '—'}</span> · Stock: <span className={p.STOCK > 0 || p.STOCK === 99999 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{p.STOCK === 99999 ? 'Ilimitado' : p.STOCK}</span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                          <p className="text-xs sm:text-sm font-bold text-gray-900">{fmt(price)}</p>
                          <button
                            onClick={() => replaceItem(p)}
                            disabled={p.STOCK <= 0 && p.STOCK !== 99999}
                            className="text-[10px] font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                          >
                            Seleccionar
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    {/* ───────── HOJA DE IMPRESIÓN (1 página): cliente, agencia y productos sin imágenes ───────── */}
    <div className="hidden print:block" style={{ color: '#111', fontSize: 12, lineHeight: 1.4, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties}>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', color: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 }}>Orden de preparación</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{order.ORDERCODE || '#' + order.$id.slice(-6)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 999, padding: '3px 12px', fontWeight: 700, fontSize: 12 }}>{displayStatusLabel(order.STATUS, order.SHIPPINGAGENCY)}</div>
          <div style={{ fontSize: 11, marginTop: 5, opacity: 0.85 }}>{fmtDate(date.getTime())} · {fmtTime(date.getTime())}</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>{totalItems} uds · {items.length} productos</div>
        </div>
      </div>

      {/* Cliente / Envío */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: '#f3f4f6', padding: '5px 12px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#374151' }}>Cliente</div>
          <div style={{ padding: '8px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{order.CUSTOMERNAME}</div>
            {order.CUSTOMERRUT && <div>RUT: {order.CUSTOMERRUT}</div>}
            {order.CUSTOMERPHONE && <div>Tel: {order.CUSTOMERPHONE}</div>}
            {order.CUSTOMEREMAIL && <div style={{ color: '#4b5563' }}>{order.CUSTOMEREMAIL}</div>}
          </div>
        </div>
        <div style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: '#f3f4f6', padding: '5px 12px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#374151' }}>Envío</div>
          <div style={{ padding: '8px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{order.SHIPPINGAGENCY || 'Sin agencia'}</div>
            <div>{order.ADDRESS || '—'}</div>
            <div style={{ color: '#4b5563' }}>{[order.COMUNA, order.REGION].filter(Boolean).join(', ')}</div>
            {displayAdditionalInfo && <div style={{ color: '#4b5563', fontStyle: 'italic' }}>{displayAdditionalInfo}</div>}
            <div style={{ marginTop: 2 }}>N° Seguimiento: <strong>{(order as any).TRACKINGNUMBER || '—'}</strong></div>
          </div>
        </div>
      </div>

      {customerNote && (
        <div style={{ border: '1px solid #fcd34d', background: '#fffbeb', borderRadius: 8, padding: '6px 12px', marginBottom: 12, fontSize: 11 }}>
          <strong>Nota del cliente:</strong> {customerNote}
        </div>
      )}

      {/* Productos (sin imágenes) */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, border: '1px solid #d1d5db', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#111827', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '6px 8px', width: 90 }}>SKU</th>
            <th style={{ padding: '6px 8px' }}>Producto</th>
            <th style={{ padding: '6px 8px', textAlign: 'center', width: 44 }}>Cant.</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', width: 70 }}>Precio</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', width: 80 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 ? '#f9fafb' : '#fff' }}>
              <td style={{ padding: '5px 8px', fontFamily: 'monospace', color: '#6b21a8' }}>{(it.id ? productSkus[it.id] : '') || (it as any).sku || '—'}</td>
              <td style={{ padding: '5px 8px' }}>{it.name}{(it as any).missing ? <strong style={{ color: '#b91c1c' }}> (FALTANTE)</strong> : ''}</td>
              <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>{it.qty}</td>
              <td style={{ padding: '5px 8px', textAlign: 'right' }}>{fmt(it.price)}</td>
              <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700 }}>{fmt(it.total || it.price * it.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div style={{ marginTop: 12, marginLeft: 'auto', width: 260, fontSize: 12, border: '1px solid #d1d5db', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px' }}><span style={{ color: '#6b7280' }}>Subtotal</span><span>{fmt(order.SUBTOTAL || order.TOTAL)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px' }}><span style={{ color: '#6b7280' }}>Envío</span><span>{order.SHIPPINGCOST > 0 ? fmt(order.SHIPPINGCOST) : 'Contraentrega'}</span></div>
        {order.DISCOUNTAMOUNT && order.DISCOUNTAMOUNT > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px', color: '#15803d' }}><span>Descuento {order.COUPONCODE ? `(${order.COUPONCODE})` : ''}</span><span>-{fmt(order.DISCOUNTAMOUNT)}</span></div>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', background: '#111827', color: '#fff', fontWeight: 800, fontSize: 14 }}><span>TOTAL</span><span>{fmt(order.TOTAL)}</span></div>
      </div>

      <div style={{ marginTop: 16, paddingTop: 8, borderTop: '1px dashed #d1d5db', fontSize: 9, color: '#9ca3af', textAlign: 'center' }}>
        Documento interno de preparación · {order.ORDERCODE} · Generado el {new Date().toLocaleDateString('es-CL')}
      </div>
    </div>

    <div className="print-area print:hidden max-w-6xl mx-auto space-y-4 sm:space-y-5 px-1 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button onClick={() => router.push('/admin/orders')} className="no-print p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Pedido {order.ORDERCODE || '#' + order.$id.slice(-6)}</h1>
              <button onClick={() => { copyText(order.ORDERCODE || order.$id, 'code'); }} className="no-print text-gray-400 hover:text-indigo-500 transition flex-shrink-0">
                {copied === 'code' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {isOverdue && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white rounded animate-pulse">VENCIDO</span>}
              {isLive && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded">🔴 LIVE</span>}
              {isGift && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded">🎁 REGALO</span>}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{fmtDate(date.getTime())} · {fmtTime(date.getTime())} · Hace {ageStr}</p>
          </div>
        </div>
        <div className="no-print flex items-center gap-1 sm:gap-2 flex-shrink-0 flex-wrap">
          <button onClick={() => {
            const statusLabelC = displayStatusLabel(order.STATUS, order.SHIPPINGAGENCY);
            const textC = `Pedido: ${order.ORDERCODE}\nCliente: ${order.CUSTOMERNAME}\nRUT: ${order.CUSTOMERRUT || '-'}\nTeléfono: ${order.CUSTOMERPHONE || '-'}\nDirección: ${order.ADDRESS}, ${order.COMUNA}, ${order.REGION}\nAgencia: ${order.SHIPPINGAGENCY || '-'}\nTotal: ${fmt(order.TOTAL)}\nEstado: ${statusLabelC}`;
            copyText(textC, 'all');
          }} className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition">
            {copied === 'all' ? <><Check className="w-3.5 h-3.5 text-green-600 animate-pulse" /><span className="hidden xs:inline sm:inline">Copiado</span></> : <><Copy className="w-3.5 h-3.5" /><span className="hidden xs:inline sm:inline">Datos</span></>}
          </button>
          <button onClick={() => copyOrderItemsList('sku')} className="flex items-center gap-1.5 px-2 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 rounded-xl text-xs font-semibold hover:bg-violet-100 transition">
            {copied === 'copiedSku' ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600 animate-pulse" />
                <span className="hidden xs:inline sm:inline">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">SKU</span>
              </>
            )}
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-white border border-gray-250 text-gray-600 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition">
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Summary cards (mobile-friendly) */}
      {(() => {
        const statusHex = isReadyRetiro ? '#c026d3' : (STATUS_HEX[order.STATUS] || '#6b7280');
        const cards: { label: string; value: React.ReactNode; hex: string; icon: React.ReactNode }[] = [
          { label: 'Total', hex: '#4f46e5', value: fmt(order.TOTAL), icon: <DollarSign className="w-4 h-4 text-white" /> },
          { label: 'Items', hex: '#d97706', value: <>{totalItems} <span className="text-xs font-semibold text-gray-400">uds</span></>, icon: <Package className="w-4 h-4 text-white" /> },
          { label: 'Estado', hex: statusHex, value: <span style={{ color: statusHex }}>{sc.label}</span>, icon: <span className="text-base leading-none">{sc.icon}</span> },
          { label: 'Antigüedad', hex: isOverdue ? '#ef4444' : '#64748b', value: <span style={{ color: isOverdue ? '#dc2626' : undefined }}>{ageStr}</span>, icon: <Clock className="w-4 h-4 text-white" /> },
        ];
        return (
          <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {cards.map((c, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${c.hex}12, transparent 70%)` }} />
                <div className="relative flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(145deg, ${c.hex}, ${c.hex}d9)`, boxShadow: `0 3px 8px -3px ${c.hex}99, inset 0 1px 1px rgba(255,255,255,0.4)` }}>
                    {c.icon}
                  </span>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-wide font-bold text-gray-400">{c.label}</p>
                </div>
                <p className="relative text-base sm:text-xl font-extrabold text-gray-900 tracking-tight leading-tight truncate">{c.value}</p>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Status Stepper */}
      {!isCancelled ? (
        <div className="no-print relative rounded-[20px] overflow-hidden border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
          {/* Ambient sutil */}
          <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${(isReadyRetiro ? '#c026d3' : (STATUS_HEX[order.STATUS] || '#6366f1'))}0d, transparent 70%)` }} />

          {/* Header */}
          <div className="relative flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: `linear-gradient(145deg, ${(isReadyRetiro ? '#c026d3' : (STATUS_HEX[order.STATUS] || '#6b7280'))}, ${(isReadyRetiro ? '#c026d3' : (STATUS_HEX[order.STATUS] || '#6b7280'))}d9)`, boxShadow: `0 3px 8px -3px ${(isReadyRetiro ? '#c026d3' : (STATUS_HEX[order.STATUS] || '#6b7280'))}99, inset 0 1px 1px rgba(255,255,255,0.4)` }}>
                {sc.icon}
              </span>
              <div>
                <p className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight tracking-tight">{sc.label}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium leading-tight flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  Toca un paso para cambiar el estado
                </p>
              </div>
            </div>
            <button
              onClick={() => handleStatusChange('negotiation')}
              disabled={updating || order.STATUS === 'negotiation'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-60 hover:-translate-y-0.5"
              style={{ background: order.STATUS === 'negotiation' ? '#ec4899' : '#fdf2f8', color: order.STATUS === 'negotiation' ? '#fff' : '#db2777', border: '1px solid #fbcfe8' }}>
              🤝 {order.STATUS === 'negotiation' ? 'En negociación' : 'Negociación'}
            </button>
          </div>

          {/* Progress rail */}
          <div className="relative overflow-x-auto pb-2 pt-3">
            <div className="flex items-start gap-0 min-w-max">
              {STATUS_FLOW.map((step, i) => {
                const STEP_ICON_PATHS: Record<string, string> = {
                  pending:          'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
                  processing:       'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
                  paid:             'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
                  assembling:       'M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8z',
                  confirming_stock: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
                  stock_confirmed:  'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
                  packing:          'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
                  ready_to_ship:    'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z',
                  shipped:          'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.35-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
                  delivered:        'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
                };
                const isReadyRetiroStep = step === 'ready_to_ship' && isRetiro;
                const hex = isReadyRetiroStep ? '#c026d3' : (STATUS_HEX[step] || '#6b7280');
                const label = displayStatusLabel(step, order.SHIPPINGAGENCY);
                const isCompleted = i < currentStepIdx;
                const isCurrent = i === currentStepIdx;
                const isFuture = i > currentStepIdx;
                const nextHex = STATUS_HEX[STATUS_FLOW[i + 1]] || hex;
                const iconPath = STEP_ICON_PATHS[step];
                return (
                  <React.Fragment key={step}>
                    <button type="button" onClick={() => !isCurrent && handleStatusChange(step)} disabled={updating || isCurrent}
                      title={`Cambiar a "${label}"`}
                      className="group flex flex-col items-center gap-1.5 flex-shrink-0 disabled:cursor-default" style={{ width: 70 }}>
                      <div className="relative transition-transform duration-200 group-hover:enabled:-translate-y-0.5 group-enabled:group-hover:scale-105" style={{ animation: isCurrent ? 'kcdFloat 2.6s ease-in-out infinite' : undefined }}>
                        {isCurrent && <span className="absolute inset-0 rounded-[13px]" style={{ ['--kcd' as any]: `${hex}3d`, animation: 'kcdPulse 2.2s ease-out infinite' }} />}
                        <div className="relative flex items-center justify-center rounded-[13px] transition-all duration-300"
                          style={{
                            width: isCurrent ? 42 : 34,
                            height: isCurrent ? 42 : 34,
                            background: isFuture ? 'linear-gradient(160deg,#ffffff,#f1f5f9)' : `linear-gradient(160deg, rgba(255,255,255,0.22), rgba(0,0,0,0.12)), ${hex}`,
                            border: isFuture ? `1.5px dashed ${hex}3a` : '1px solid rgba(255,255,255,0.3)',
                            boxShadow: isCurrent ? `0 0 0 3px ${hex}1a, 0 6px 14px -8px ${hex}aa, inset 0 1px 1px rgba(255,255,255,0.5)` : isFuture ? 'none' : `0 3px 9px -5px ${hex}80, inset 0 1px 1px rgba(255,255,255,0.45)`,
                          }}>
                          {isCompleted ? (
                            <Check className="w-4 h-4 text-white" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' }} />
                          ) : (
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: isFuture ? `${hex}66` : '#fff', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' }}>
                              {iconPath && <path d={iconPath} />}
                            </svg>
                          )}
                          {!isFuture && <span className="absolute inset-x-1 top-1 h-1/3 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />}
                        </div>
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-center leading-tight transition-colors group-hover:enabled:text-gray-900" style={{ color: isCurrent ? hex : isFuture ? '#c2cbd6' : '#475569' }}>{label}</span>
                    </button>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className="relative self-start mt-[17px] flex-shrink-0 -mx-1 rounded-full overflow-hidden" style={{ height: 4, width: 24, background: isCompleted ? `linear-gradient(90deg, ${hex}, ${nextHex})` : '#e5e7eb' }}>
                        {isCompleted && <span className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)', animation: `kcdShimmer 2.4s linear ${i * 0.18}s infinite` }} />}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {order.STATUS === 'pending' && (
            <p className="relative text-[10px] sm:text-xs text-amber-600 mt-3 flex items-center gap-1 font-semibold">
              <Clock className="w-3 h-3" /> Expira en {Math.max(0, Math.floor(((order.EXPIRESAT || date.getTime() + 3*3600000) - Date.now()) / 3600000))}h
            </p>
          )}

          <style>{`
            @keyframes kcdShimmer { 0% { transform: translateX(-110%); } 100% { transform: translateX(220%); } }
            @keyframes kcdSheen { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
            @keyframes kcdPulse { 0% { box-shadow: 0 0 0 0 var(--kcd); } 70% { box-shadow: 0 0 0 11px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
            @keyframes kcdFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
          `}</style>
        </div>
      ) : (
        /* Cancelled banner */
        <div className="no-print rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 p-3 sm:p-5 flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm sm:text-lg font-bold text-red-700">Pedido Cancelado</p>
              <p className="text-[10px] sm:text-xs text-red-500">Stock devuelto a los productos</p>
            </div>
          </div>
          <div className="no-print relative">
            <select value={order.STATUS} onChange={e => handleStatusChange(e.target.value)} disabled={updating}
              className="appearance-none text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-7 sm:pr-8 bg-white text-gray-800 border-gray-200">
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {displayStatusLabel(k, order.SHIPPINGAGENCY)}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── Alerta: falta N° de seguimiento o voucher (agencias ≠ BluExpress) ── */}
      {trackingPending && (
        <div className="no-print rounded-xl sm:rounded-2xl border border-amber-300 bg-amber-50 p-3 sm:p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">Seguimiento pendiente</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Este pedido se despachó por <strong>{order.SHIPPINGAGENCY}</strong>. Falta cargar el <strong>N° de seguimiento</strong> o subir la <strong>foto del voucher</strong> que entrega la agencia. (BluExpress no lo requiere — la etiqueta se imprime antes.)
            </p>
          </div>
        </div>
      )}

      {/* ── Negociación de Faltantes Control Panel ── */}
      {order.STATUS === 'negotiation' && (
        <div className="no-print bg-white rounded-xl sm:rounded-2xl border border-pink-250 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
            <span className="text-xl">🤝</span>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Panel de Negociación por Productos Faltantes</h2>
              <p className="text-xs text-gray-400">Selecciona qué productos faltan y en qué cantidad para coordinar con el cliente.</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
            {items.map((it, idx) => {
              const isMissing = !!(it as any).missing;
              const isReplaced = !!(it as any).replaced;
              
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded bg-gray-50 border overflow-hidden shrink-0 flex items-center justify-center">
                      {it.img ? <img src={it.img} className="w-full h-full object-contain" /> : <Package className="w-3 h-3 text-gray-300" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{it.name}</p>
                      <p className="text-gray-400 text-[10px]">Cantidad en pedido: {it.qty}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {isMissing ? (
                      <>
                        <span className="px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-600 border border-red-100 text-[10px]">
                          ⚠️ Faltante
                        </span>
                        <button
                          onClick={async () => {
                            if (!confirm('¿Marcar este producto como disponible?')) return;
                            let parsedItems: any[] = [];
                            try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}
                            const itemToRestore = parsedItems[idx];
                            if (!itemToRestore) return;

                            const identicalIdx = parsedItems.findIndex((x, i) => 
                              i !== idx && 
                              x.id === itemToRestore.id && 
                              !x.missing && 
                              !x.replaced
                            );

                            if (identicalIdx !== -1) {
                              parsedItems[identicalIdx].qty += itemToRestore.qty;
                              parsedItems[identicalIdx].total = parsedItems[identicalIdx].qty * parsedItems[identicalIdx].price;
                              parsedItems.splice(idx, 1);
                            } else {
                              itemToRestore.missing = false;
                            }

                            try {
                              const { databases } = getServices();
                              const { databaseId } = getAppwriteConfig();
                              await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
                                ITEMS: JSON.stringify(parsedItems)
                              });
                              setOrder(prev => prev ? { ...prev, ITEMS: JSON.stringify(parsedItems) } : null);
                            } catch (err: any) {
                              alert('Error: ' + err.message);
                            }
                          }}
                          className="px-2.5 py-1 bg-white border border-gray-250 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                          Marcar Disponible
                        </button>
                      </>
                    ) : isReplaced ? (
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600 text-[10px]">
                        🔄 Reemplazado
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[10px]">Faltan:</span>
                        <input
                          type="number"
                          min={1}
                          max={it.qty}
                          defaultValue={1}
                          id={`missing-qty-${idx}`}
                          className="w-12 px-1.5 py-0.5 border border-gray-300 rounded text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={async () => {
                            const inputEl = document.getElementById(`missing-qty-${idx}`) as HTMLInputElement;
                            const mQty = parseInt(inputEl?.value || '1');
                            if (isNaN(mQty) || mQty <= 0 || mQty > it.qty) return;

                            let parsedItems: any[] = [];
                            try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}
                            const itemToMark = parsedItems[idx];
                            if (!itemToMark) return;

                            if (mQty === itemToMark.qty) {
                              itemToMark.missing = true;
                            } else {
                              const newItem = {
                                ...itemToMark,
                                qty: mQty,
                                total: itemToMark.price * mQty,
                                missing: true
                              };
                              itemToMark.qty -= mQty;
                              itemToMark.total = itemToMark.price * itemToMark.qty;
                              parsedItems.push(newItem);
                            }

                            try {
                              const { databases } = getServices();
                              const { databaseId } = getAppwriteConfig();
                              await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
                                ITEMS: JSON.stringify(parsedItems)
                              });
                              setOrder(prev => prev ? { ...prev, ITEMS: JSON.stringify(parsedItems) } : null);
                            } catch (err: any) {
                              alert('Error: ' + err.message);
                            }
                          }}
                          className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg font-medium hover:bg-red-100 transition"
                        >
                          Marcar Faltante
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
        {/* ── PAGE 1: Info block (header + customer + shipping + totals) ── */}
        <div className="print-info-block lg:col-span-2 space-y-3 sm:space-y-5">
          {/* Order header */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden print-break">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-500" />
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Pedido {order.ORDERCODE || '#' + order.$id.slice(-6)}</p>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400">{fmtDate(date.getTime())} · {fmtTime(date.getTime())}</p>
            </div>
          </div>

          {/* Location Map + verificación de dirección (no se imprime) */}
          {order.ADDRESS && (
            <div className="no-print bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
                <MapPinned className="w-4 h-4 text-indigo-500" />
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Ubicación de entrega</p>
                {isGeolocated && <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-100">📍 GPS</span>}
              </div>

              {/* Comparación: dirección ingresada vs. detectada por GPS (siempre visible) */}
              {(() => {
                const ok = isGeolocated && geoAddressMatches;
                const gpsAccent = !isGeolocated ? '#94a3b8' : geoLoading ? '#9ca3af' : ok ? '#22c55e' : '#ef4444';
                const gpsBorder = !isGeolocated ? '#e5e7eb' : geoLoading ? '#e5e7eb' : ok ? '#bbf7d0' : '#fecaca';
                const gpsBg = !isGeolocated ? '#f8fafc' : geoLoading ? '#f9fafb' : ok ? 'linear-gradient(160deg,#f0fdf4,#ffffff)' : 'linear-gradient(160deg,#fef2f2,#ffffff)';
                return (
                  <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-b border-gray-100">
                    {/* Ingresada por el cliente */}
                    <div className="rounded-xl border p-3" style={{ borderColor: '#bbf7d0', background: 'linear-gradient(160deg,#f0fdf4,#ffffff)' }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center"><User className="w-3 h-3 text-white" /></span>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Dirección ingresada</p>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 leading-snug">{order.ADDRESS}</p>
                      <p className="text-[11px] text-gray-500">{[order.COMUNA, order.REGION].filter(Boolean).join(', ') || '—'}</p>
                    </div>
                    {/* Detectada por GPS */}
                    <div className="rounded-xl border p-3" style={{ borderColor: gpsBorder, background: gpsBg }}>
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: gpsAccent }}>
                          <MapPin className="w-3 h-3 text-white" />
                        </span>
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: !isGeolocated ? '#64748b' : geoLoading ? '#6b7280' : ok ? '#15803d' : '#b91c1c' }}>Detectada por GPS</p>
                        {isGeolocated && !geoLoading && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: ok ? '#dcfce7' : '#fee2e2', color: ok ? '#15803d' : '#b91c1c' }}>
                            {ok ? '✓ COINCIDE' : '✕ DIFIERE'}
                          </span>
                        )}
                      </div>
                      {!isGeolocated ? (
                        <p className="text-xs text-gray-400 leading-snug">El cliente no compartió su ubicación GPS en este pedido.</p>
                      ) : geoLoading ? (
                        <p className="text-xs text-gray-400 italic">Calculando dirección…</p>
                      ) : detectedAddr ? (
                        <>
                          <p className="text-xs font-semibold text-gray-800 leading-snug">{detectedAddr.full || '—'}</p>
                          <p className="text-[11px]" style={{ color: comunaMatches ? '#16a34a' : '#dc2626' }}>
                            {detectedAddr.comuna || '—'}{detectedAddr.region ? <span style={{ color: regionMatches ? '#16a34a' : '#dc2626' }}>, {detectedAddr.region}</span> : null}
                          </p>
                          {!ok && (
                            <p className="text-[10px] text-red-600 mt-1 leading-snug">⚠️ El cliente pudo haber hecho el pedido fuera de su casa. Verifica la dirección de envío.</p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No se pudo determinar.</p>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${isGeolocated ? `${geoLat},${geoLng}` : encodeURIComponent(`${order.ADDRESS}, ${order.COMUNA}, ${order.REGION}, Chile`)}`}>
                </iframe>
              </div>
            </div>
          )}

          {/* Notes & Timeline */}
          <div className="no-print bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-indigo-500" />
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Notas y seguimiento</p>
            </div>
            <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
              {customerNote && (
                <div className="p-2.5 sm:p-3.5 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl">
                  <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Nota del cliente</p>
                  <p className="text-xs sm:text-sm text-amber-800 whitespace-pre-wrap">{customerNote}</p>
                </div>
              )}
              {isGift && (
                <div className="p-2.5 sm:p-3.5 bg-pink-50 border border-pink-200 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm text-pink-700 font-medium">🎁 Pedido marcado como regalo</p>
                </div>
              )}
              {/* Timeline */}
              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-2 sm:mb-3 uppercase tracking-wide">Historial del pedido</p>
                <div className="relative ml-1.5 sm:ml-2 space-y-3 sm:space-y-4 border-l-2 border-gray-200 pl-3 sm:pl-4">
                  <TimelineEntry dot="bg-indigo-400" title="Pedido creado" date={`${fmtDate(date.getTime())} ${fmtTime(date.getTime())}`} />
                  {order.PAYMENTPROOFURL && (
                    <TimelineEntry dot="bg-emerald-400" title="Comprobante subido" icon={<ImageIcon className="w-3 h-3" />} />
                  )}
                  {order.SHIPPINGPROOFURL && (
                    <TimelineEntry dot="bg-violet-400" title="Comprobante de envío subido" icon={<Truck className="w-3 h-3" />} />
                  )}
                  {order.UPDATEDAT && order.STATUS !== 'pending' && (() => {
                    const title = `Estado → ${displayStatusLabel(order.STATUS, order.SHIPPINGAGENCY)}`;
                    return (
                      <TimelineEntry dot={STATUS_CONFIG[order.STATUS]?.dot || 'bg-gray-400'} title={title} date={`${fmtDate(order.UPDATEDAT)} ${fmtTime(order.UPDATEDAT)}`} />
                    );
                  })()}
                  {isCancelled && (
                    <TimelineEntry dot="bg-red-400" title="Pedido cancelado — stock devuelto" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Customer + Shipping (visible in print) */}
        <div className="space-y-3 sm:space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden print-break">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Cliente</p>
            </div>
            <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3">
              <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Nombre" value={order.CUSTOMERNAME} onCopy={() => copyText(order.CUSTOMERNAME, 'name')} copied={copied === 'name'} />
              {order.CUSTOMERRUT && <InfoRow icon={<Hash className="w-3.5 h-3.5" />} label="RUT" value={order.CUSTOMERRUT} onCopy={() => copyText(order.CUSTOMERRUT!, 'rut')} copied={copied === 'rut'} />}
              {order.CUSTOMERPHONE && <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="Teléfono" value={order.CUSTOMERPHONE} onCopy={() => copyText(order.CUSTOMERPHONE!, 'phone')} copied={copied === 'phone'} />}
              {order.CUSTOMEREMAIL && <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={order.CUSTOMEREMAIL} onCopy={() => copyText(order.CUSTOMEREMAIL!, 'email')} copied={copied === 'email'} />}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden print-break">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2">
              <MapPinned className="w-4 h-4 text-indigo-500" />
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Envío</p>
            </div>
            <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2">
              {editingAgency ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedAgency}
                    onChange={e => setSelectedAgency(e.target.value)}
                    className="text-xs sm:text-sm font-bold border border-violet-200 rounded-lg px-2 py-1.5 bg-violet-50 text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 flex-1 min-w-[140px]"
                  >
                    <option value="">Seleccionar agencia</option>
                    {agencies.map(a => (
                      <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                  <button onClick={saveAgency} disabled={!selectedAgency || savingAgency}
                    className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-700 disabled:opacity-50 transition">
                    <Save className="w-3 h-3" />
                    {savingAgency ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button onClick={() => setEditingAgency(false)}
                    className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {order.SHIPPINGAGENCY && (
                    <p className="text-sm sm:text-base font-bold text-violet-700 print:text-black">{order.SHIPPINGAGENCY}</p>
                  )}
                  {order.AGENCYCHANGED && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">Modificada</span>
                  )}
                  <button onClick={() => { setEditingAgency(true); setSelectedAgency(order.SHIPPINGAGENCY || ''); }}
                    className="text-[10px] font-bold px-2 py-1 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition flex items-center gap-1 no-print">
                    <Truck className="w-3 h-3" /> Cambiar
                  </button>
                </div>
              )}
              <p className="text-xs sm:text-sm font-medium text-gray-900">{order.ADDRESS || 'Sin dirección'}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{order.COMUNA}{order.COMUNA && order.REGION ? ', ' : ''}{order.REGION}</p>
              {displayAdditionalInfo && (
                <div className="mt-1.5 sm:mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Info adicional</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 whitespace-pre-wrap">{displayAdditionalInfo}</p>
                </div>
              )}
              {(order as any).ADDRESSPHOTOURL && (
                <a href={(order as any).ADDRESSPHOTOURL} target="_blank" rel="noreferrer" className="block mt-1.5 sm:mt-2">
                  <img src={(order as any).ADDRESSPHOTOURL} alt="Foto dirección" className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200" />
                </a>
              )}
              {/* Tracking Number */}
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 no-print">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500">N° de Seguimiento</p>
                  {editingTracking ? (
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Ej. 123456789"
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <button
                        onClick={handleSaveTracking}
                        disabled={savingTracking}
                        className="px-3 py-1.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50"
                      >
                        {savingTracking ? '...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingTracking(false);
                          setTrackingNumber((order as any).TRACKINGNUMBER || '');
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {(order as any).TRACKINGNUMBER ? (
                        <p className="text-sm sm:text-base font-bold text-violet-700 flex-1 break-all">{(order as any).TRACKINGNUMBER}</p>
                      ) : (
                        <p className="text-sm sm:text-base font-medium text-gray-400 italic flex-1">Sin número asignado</p>
                      )}
                      <button
                        onClick={() => setEditingTracking(true)}
                        className="text-[10px] font-bold px-2 py-1 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition flex items-center gap-1 shrink-0"
                      >
                        <Truck className="w-3 h-3" /> {(order as any).TRACKINGNUMBER ? 'Editar' : 'Añadir'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comprobante de envío / voucher de la agencia (no BluExpress) */}
              {(order.SHIPPINGPROOFURL || order.STATUS === 'preparing_shipping' || (['ready_to_ship', 'shipped', 'delivered'].includes(order.STATUS) && !orderIsPickup && !orderIsBluexpress)) && (
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                  {order.SHIPPINGPROOFURL ? (
                    <div className="flex gap-2 w-full no-print">
                      <button onClick={() => {
                        const url = order.SHIPPINGPROOFURL!;
                        if (isPdfUrl(url) || shippingProofIsPdf) {
                          window.open(url, '_blank');
                        } else {
                          setShippingProofOpen(true);
                        }
                      }}
                        className="flex-1 flex items-center gap-2 p-2.5 sm:p-3 bg-violet-50 border border-violet-200 rounded-lg sm:rounded-xl hover:bg-violet-100 transition group text-left">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs font-semibold text-violet-700">Comprobante de envío</p>
                          <p className="text-[9px] sm:text-[10px] text-violet-500">Click para ver</p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-violet-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                      </button>
                      <button
                        onClick={handleAdminDeleteShippingProof}
                        title="Eliminar comprobante de envío"
                        className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg sm:rounded-xl text-red-600 transition flex items-center justify-center shrink-0"
                      >
                        <Ban className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 p-2.5 sm:p-3 bg-violet-50 border border-violet-200 rounded-lg sm:rounded-xl cursor-pointer hover:bg-violet-100 transition group">
                      <input type="file" accept="image/*,.pdf" onChange={handleAdminUploadShippingProof} className="hidden" disabled={uploadingShippingProof} />
                      {uploadingShippingProof ? (
                        <>
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          <p className="text-[10px] sm:text-xs text-violet-700 font-medium">Subiendo comprobante de envío...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500 flex-shrink-0 group-hover:text-violet-600" />
                          <p className="text-[10px] sm:text-xs text-violet-700 font-medium">Subir comprobante de envío</p>
                        </>
                      )}
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fotos de las cajas (registro antes de despachar) */}
          {showBoxPhotos && (
            <div className="no-print bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-500" />
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Fotos de las cajas</p>
                <span className="ml-auto text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">{boxPhotos.length} foto{boxPhotos.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="p-3 sm:p-5 space-y-3">
                <p className="text-[10px] sm:text-xs text-gray-400">Registro fotográfico de las cajas antes del despacho (opcional).</p>
                {boxPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {boxPhotos.map((url) => (
                      <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <a href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt="Caja" className="w-full h-full object-cover" />
                        </a>
                        <button onClick={() => handleDeleteBoxPhoto(url)} title="Eliminar"
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2 p-2.5 sm:p-3 bg-cyan-50 border border-cyan-200 rounded-lg sm:rounded-xl cursor-pointer hover:bg-cyan-100 transition group">
                  <input type="file" accept="image/*" multiple onChange={handleUploadBoxPhotos} className="hidden" disabled={uploadingBoxPhoto} />
                  {uploadingBoxPhoto ? (
                    <>
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-cyan-700 font-medium">Subiendo fotos...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 flex-shrink-0 group-hover:text-cyan-600" />
                      <p className="text-[10px] sm:text-xs text-cyan-700 font-medium">Subir foto(s) de las cajas</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="no-print bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-500" />
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Pago</p>
              {order.PAYMENTMETHOD && (
                <span className="ml-auto text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{order.PAYMENTMETHOD}</span>
              )}
            </div>
            <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3">
              {order.COUPONCODE && (
                <div className="flex items-center justify-between p-2 sm:p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1"><Tag className="w-3 h-3" /> Cupón</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-700">{order.COUPONCODE}</span>
                </div>
              )}
              {order.PAYMENTPROOFURL ? (
                <button onClick={() => {
                  const url = order.PAYMENTPROOFURL!;
                  if (isPdfUrl(url) || paymentProofIsPdf) {
                    window.open(url, '_blank');
                  } else {
                    setProofOpen(true);
                  }
                }}
                  className="flex items-center gap-2 p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl hover:bg-emerald-100 transition group w-full text-left">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-emerald-700">Comprobante de pago</p>
                    <p className="text-[9px] sm:text-[10px] text-emerald-500">Click para ver</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </button>
              ) : order.STATUS === 'pending' || order.STATUS === 'processing' ? (
                <label className="flex items-center gap-2 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl cursor-pointer hover:bg-amber-100 transition group">
                  <input type="file" accept="image/*,.pdf" onChange={handleAdminUploadProof} className="hidden" disabled={uploadingProof} />
                  {uploadingProof ? (
                    <>
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-amber-700 font-medium">Subiendo...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0 group-hover:text-amber-600" />
                      <p className="text-[10px] sm:text-xs text-amber-700 font-medium">Subir comprobante</p>
                    </>
                  )}
                </label>
              ) : null}
            </div>
          </div>

          {/* Quick actions */}
          <div className="no-print bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 space-y-1.5 sm:space-y-2">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wide">Acciones rápidas</p>
            {order.CUSTOMERPHONE && (
              <a href={`https://wa.me/${order.CUSTOMERPHONE.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 w-full p-2 sm:p-2.5 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-green-700 hover:bg-green-100 transition">
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> WhatsApp
              </a>
            )}
            {order.CUSTOMERPHONE && (
              <a href={`https://wa.me/${order.CUSTOMERPHONE.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(`¡Hola ${order.CUSTOMERNAME}! Te escribimos de Kevin & Coco Chile. 😊 Queríamos contarte que ya tenemos reservado tu pedido ${order.ORDERCODE || '#' + order.$id.slice(-6)} por un total de ${fmt(order.TOTAL)}. Escríbenos por aquí cuando tengas listo tu comprobante de transferencia para poder procesarlo y comenzar a prepararlo hoy mismo. ¡Muchas gracias por tu preferencia!`)}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 w-full p-2 sm:p-2.5 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-amber-800 hover:bg-amber-100 transition">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" /> WhatsApp Pago Pendiente
              </a>
            )}
            {order.STATUS !== 'cancelled' && (
              <button onClick={() => handleStatusChange('cancelled')}
                className="flex items-center gap-2 w-full p-2 sm:p-2.5 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-100 transition">
                <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Cancelar pedido
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PAGE 2+: Products block ── */}
      <div className="print-products-block bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-500" />
            <p className="font-semibold text-gray-900 text-xs sm:text-sm">Productos ({items.length})</p>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400">{totalItems} unidades</p>
        </div>
        <div className="divide-y divide-gray-50">
          {items.map((it, i) => {
            const currentStock = it.id ? (productStocks[it.id] ?? 0) : 0;
            const remainingStock = order.STATUS === 'pending' ? currentStock - it.qty : currentStock;
            const loc = it.id ? productLocations[it.id] : null;
            const sku = it.id ? productSkus[it.id] : '';
            const isMissing = !!(it as any).missing;
            const isReplaced = !!(it as any).replaced;
            const origItem = (it as any).originalItem;

            // En modo negociación, si hay algún item marcado como faltante o reemplazado,
            // ocultamos todos los que estén disponibles de forma normal.
            const hasNegotiations = order.STATUS === 'negotiation' && items.some(x => (x as any).missing || (x as any).replaced);
            if (hasNegotiations && !isMissing && !isReplaced) return null;

            return (
              <div key={i} className={`flex flex-col gap-2 px-3 sm:px-5 py-3 sm:py-3.5 hover:bg-gray-50/50 transition border-b border-gray-100 last:border-0 ${isMissing ? 'bg-red-50/80 border-l-4 border-l-red-500' : isReplaced ? 'bg-emerald-50/40 border-l-4 border-l-emerald-400' : ''}`}>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {it.img
                      ? <img src={it.img} alt="" className="w-full h-full object-contain p-0.5 sm:p-1" />
                      : <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${isMissing ? 'text-red-950' : 'text-gray-900'}`}>{it.name}</p>
                      {isMissing && (
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          ⚠️ Faltante
                        </span>
                      )}
                      {isReplaced && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            🔄 Reemplazado
                          </span>
                          {it.originalPrice && it.originalPrice > it.price && (
                            <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                              Dif molestias: {fmt(((origItem?.price || it.originalPrice) * it.qty) - (it.price * it.qty))}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {(it as any).note && (
                      <p className="text-[11px] bg-amber-50 text-amber-800 p-2 rounded-lg mt-1 border border-amber-100 font-medium">
                        💬 Nota: {(it as any).note}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                      <span className="text-[10px] sm:text-xs text-gray-500">{fmt(it.price)} c/u</span>
                      <span className="text-gray-300">×</span>
                      <div className="flex items-center gap-1 no-print">
                        <input
                          type="number"
                          min={0}
                          value={it.qty}
                          onChange={async (e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 0) {
                              await handleUpdateQty(i, val);
                            }
                          }}
                          className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-xs bg-white text-gray-800"
                        />
                      </div>
                      <span className="hidden print:inline text-[10px] sm:text-xs font-semibold text-gray-700">{it.qty}</span>
                      {it.originalPrice && it.originalPrice !== it.price && (
                        <span className="text-[9px] sm:text-[10px] line-through text-gray-300">{fmt(it.originalPrice)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {sku && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-800 text-[10px] sm:text-xs font-bold print:bg-violet-50 print:border print:border-violet-200">
                          <Hash className="w-3 h-3 shrink-0" />{sku}
                        </span>
                      )}
                      {loc?.label && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] sm:text-xs font-bold print:bg-indigo-50 print:border print:border-indigo-200">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {loc.label}
                        </span>
                      )}
                    </div>
                    {it.id && !isMissing && !isReplaced && (
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-1 flex-wrap no-print">
                        <span className={`text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.5 rounded ${remainingStock <= 0 ? 'bg-red-100 text-red-600' : remainingStock <= 5 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                          Stock: {currentStock}
                        </span>
                        {order.STATUS === 'pending' && (
                          <span className={`text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.5 rounded ${remainingStock <= 0 ? 'bg-red-100 text-red-600' : remainingStock <= 5 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            → {remainingStock}
                          </span>
                        )}
                        {order.STATUS !== 'pending' && (
                          <span className="text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600">
                            {remainingStock} disp
                          </span>
                        )}
                      </div>
                    )}
                    {isReplaced && origItem && (() => {
                      const originalPriceTotal = (origItem.price || 0) * it.qty;
                      const replacementPriceTotal = it.price * it.qty;
                      const difference = originalPriceTotal - replacementPriceTotal;
                      return (
                        <div className="mt-1 text-[10px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
                          <p className="italic">Originalmente: <span className="font-semibold">{origItem.name}</span> ({origItem.sku || 'Sin SKU'}) a {fmt(origItem.price)} c/u</p>
                          {difference > 0 ? (
                            <p className="text-emerald-600 font-bold mt-0.5">
                              Saldo a favor del cliente por diferencia: {fmt(difference)}
                            </p>
                          ) : difference < 0 ? (
                            <p className="text-blue-600 font-bold mt-0.5">
                              Valor extra cubierto por la tienda por las molestias de diferencia: {fmt(Math.abs(difference))}
                            </p>
                          ) : (
                            <p className="text-gray-500 font-bold mt-0.5">Sin diferencia de precio</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{fmt(it.total || it.price * it.qty)}</p>
                  </div>
                </div>

                {/* Actions row for this product inside order */}
                {['pending', 'processing', 'paid', 'assembling', 'negotiation'].includes(order.STATUS) && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:pl-18 no-print flex-wrap">
                    <button
                      onClick={() => toggleMissingItem(i)}
                      className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg transition border ${isMissing ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                    >
                      {isMissing ? 'Marcar como Disponible' : 'Marcar como Sin Stock (No Hay)'}
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(`¿Eliminar "${it.name}" por completo de este pedido?`)) return;
                        let parsedItems: any[] = [];
                        try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}
                        parsedItems.splice(i, 1);
                        
                        const newSubtotal = parsedItems.reduce((s, x) => s + (x.price * x.qty), 0);
                        const newTotal = newSubtotal + (order.SHIPPINGCOST || 0) - (order.DISCOUNTAMOUNT || 0);

                        try {
                          const { databases } = getServices();
                          const { databaseId } = getAppwriteConfig();
                          await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, order.$id, {
                            ITEMS: JSON.stringify(parsedItems),
                            SUBTOTAL: newSubtotal,
                            TOTAL: newTotal
                          });
                          await load();
                        } catch (err: any) {
                          alert('Error al eliminar: ' + err.message);
                        }
                      }}
                      className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition border border-red-200"
                    >
                      Eliminar del Pedido
                    </button>
                    {isMissing && (
                      <>
                        <button
                          onClick={() => notifyMissingItemToCustomer(i, it.name)}
                          disabled={notifyingIdx === i || notifiedIndices.has(i)}
                          className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg transition border flex items-center gap-1 ${
                            notifiedIndices.has(i)
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                              : notifyingIdx === i
                              ? 'bg-amber-50 text-amber-700 border-amber-200 cursor-wait opacity-70'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {notifiedIndices.has(i) ? (
                            <><Check className="w-3 h-3" /> Notificado</>
                          ) : notifyingIdx === i ? (
                            <><div className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin" /> Enviando...</>
                          ) : (
                            <><Send className="w-3 h-3" /> Notificar al cliente</>
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenSimilarSearch(i)}
                          className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1"
                        >
                          <Search className="w-3 h-3" /> Buscar Similares
                        </button>
                        <button
                          onClick={() => {
                            setIsSimilarSearch(false);
                            setReplacingIdx(i);
                            setMissingQty(it.qty || 1);
                          }}
                          className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                          Reemplazar Producto
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Totals at the end */}
        <div className="px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 space-y-1.5 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-700">{fmt(order.SUBTOTAL || order.TOTAL)}</span>
          </div>
          {order.SHIPPINGCOST > 0 ? (
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500 flex items-center gap-1"><Truck className="w-3 h-3" /> Envío</span>
              <span className="text-gray-700">{fmt(order.SHIPPINGCOST)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500 flex items-center gap-1"><Truck className="w-3 h-3" /> Envío</span>
              <span className="text-emerald-600 text-[10px] sm:text-xs font-medium">Pago contraentrega</span>
            </div>
          )}
          {order.DISCOUNTAMOUNT && order.DISCOUNTAMOUNT > 0 && (
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-emerald-600 flex items-center gap-1"><Tag className="w-3 h-3" /> Descuento {order.COUPONCODE && <span className="font-mono text-[10px] sm:text-xs">({order.COUPONCODE})</span>}</span>
              <span className="text-emerald-600 font-medium">-{fmt(order.DISCOUNTAMOUNT)}</span>
            </div>
          )}
          <div className="flex justify-between text-base sm:text-lg font-bold pt-1.5 sm:pt-2 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{fmt(order.TOTAL)}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function InfoRow({ icon, label, value, onCopy, copied }: { icon: React.ReactNode; label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <span className="text-gray-400 flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-xs sm:text-sm text-gray-800 font-medium truncate">{value}</p>
        </div>
      </div>
      <button onClick={onCopy}
        className="no-print p-1.5 sm:p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-500 sm:opacity-0 sm:group-hover:opacity-100 transition flex-shrink-0">
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function TimelineEntry({ dot, title, date, icon }: { dot: string; title: string; date?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 sm:gap-3 relative">
      <div className={`absolute -left-[17px] sm:-left-[21px] w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${dot} border-2 border-white top-0.5`} />
      <div className="flex-1">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {icon}
          <p className="text-xs sm:text-sm text-gray-700 font-medium">{title}</p>
        </div>
        {date && <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{date}</p>}
      </div>
    </div>
  );
}
