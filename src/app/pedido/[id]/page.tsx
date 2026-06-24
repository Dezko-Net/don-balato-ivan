'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, Upload, Copy, Check, AlertTriangle, MapPin, Package, Truck, Shield, FileText, RefreshCw, Pencil, X, Plus, Minus, Trash2, Search, Tag, Receipt, ExternalLink, MessageSquare, Box } from 'lucide-react';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION, PRODUCTS_COLLECTION, MEDIA_BUCKET_ID, formatPrice, Query, ID } from '@/lib/appwrite';
import { resolveStorageImageUrl } from '@/lib/product-images';
import { Order, OrderItem, Product } from '@/types';
import { generateOrderPdf } from '@/lib/generateOrderPdf';
import { notifyPaymentUploaded, notifyNegotiationOpened, notifyNegotiationPartial, notifyNegotiationComplete } from '@/lib/notify-admin';
import { useAuth } from '@/hooks/useAuth';

const BANK_DEFAULTS = {
  bankAccountHolder: 'YESBELLA LTDA.',
  bankRut: '77.270.689-8',
  bankName: 'BCI',
  bankAccountType: 'Cuenta Corriente',
  bankAccountNumber: '32590547',
  bankEmail: 'kevincoco0819@gmail.com',
};

function getBankDetails(): Record<string, string> {
  try {
    const stored = localStorage.getItem('store_bank_details');
    const p = stored ? { ...BANK_DEFAULTS, ...JSON.parse(stored) } : BANK_DEFAULTS;
    return {
      'Titular': p.bankAccountHolder || 'No configurado',
      'RUT': p.bankRut || 'No configurado',
      'Banco': p.bankName || 'No configurado',
      'Tipo de cuenta': p.bankAccountType || 'Cuenta Vista',
      'N° de cuenta': p.bankAccountNumber || 'No configurado',
      'Email': p.bankEmail || 'No configurado',
    };
  } catch {
    return {
      'Titular': BANK_DEFAULTS.bankAccountHolder,
      'RUT': BANK_DEFAULTS.bankRut,
      'Banco': BANK_DEFAULTS.bankName,
      'Tipo de cuenta': BANK_DEFAULTS.bankAccountType,
      'N° de cuenta': BANK_DEFAULTS.bankAccountNumber,
      'Email': BANK_DEFAULTS.bankEmail,
    };
  }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:            { label: 'Pendiente',                 color: '#b45309', bg: '#fffbeb' },
  processing:         { label: 'Pago a verificar',          color: '#1558b0', bg: '#e8f0fe' },
  paid:               { label: 'Pago verificado',           color: '#166534', bg: '#f0fdf4' },
  assembling:         { label: 'Armando',                   color: '#7b1fa2', bg: '#f3e5f5' },
  negotiation:        { label: 'Negociación',                color: '#be185d', bg: '#fdf2f8' },
  preparing_shipping: { label: 'Etiqueta lista',        color: '#5d4037', bg: '#efebe9' },
  ready_to_ship:      { label: 'Pedido listo para enviar',            color: '#00838f', bg: '#e0f7fa' },
  shipped:            { label: 'Enviado',                   color: '#6b21a8', bg: '#faf5ff' },
  delivered:          { label: 'Entregado',                 color: '#166534', bg: '#f0fdf4' },
  cancelled:          { label: 'Cancelado',                 color: '#991b1b', bg: '#fff5f5' },
};

const STATUS_DESCRIPTIONS: Record<string, { title: string; desc: string; alertType: 'warning' | 'info' | 'success' | 'indigo' | 'danger' }> = {
  pending: {
    title: 'Esperando el Pago',
    desc: 'Tu pedido ha sido recibido. Para comenzar a procesarlo, realiza la transferencia bancaria con los datos indicados abajo y sube tu comprobante de pago.',
    alertType: 'warning'
  },
  processing: {
    title: 'Verificando tu Pago',
    desc: 'Hemos recibido tu comprobante de pago. Nuestro equipo administrativo validará la transferencia a la brevedad para confirmar tu compra.',
    alertType: 'info'
  },
  paid: {
    title: 'Pago Confirmado',
    desc: '¡Excelente! Tu pago ha sido verificado con éxito. Tu pedido pasará a nuestra área de preparación en bodega en las próximas horas.',
    alertType: 'success'
  },
  assembling: {
    title: 'Armando tu Pedido',
    desc: 'Nuestro equipo en bodega está seleccionando y empaquetando tus productos con mucho cuidado. ¡Pronto estará listo para el despacho!',
    alertType: 'indigo'
  },
  negotiation: {
    title: 'Pedido en Negociación',
    desc: 'Estamos revisando la disponibilidad de algunos productos de tu pedido. Te contactaremos pronto con las novedades.',
    alertType: 'warning'
  },
  preparing_shipping: {
    title: 'Etiqueta de Despacho Lista',
    desc: 'Estamos generando la etiqueta de envío con tus datos de entrega y sellando la caja para entregarla a la empresa de transporte.',
    alertType: 'indigo'
  },
  ready_to_ship: {
    title: 'Pedido listo para enviar',
    desc: 'El paquete ya está embalado y etiquetado en nuestro centro de despacho, a la espera de ser retirado por la agencia de envíos seleccionada.',
    alertType: 'indigo'
  },
  shipped: {
    title: 'Pedido Despachado / En camino',
    desc: '¡Tu pedido ya está en camino! Ha sido entregado a la empresa de transporte. Puedes ver y descargar el comprobante de envío abajo para realizar el seguimiento.',
    alertType: 'success'
  },
  delivered: {
    title: 'Pedido Entregado',
    desc: 'El pedido ha sido entregado correctamente en la dirección de destino. ¡Muchas gracias por tu compra y por confiar en nosotros!',
    alertType: 'success'
  },
  cancelled: {
    title: 'Pedido Cancelado',
    desc: 'Este pedido ha sido anulado. Si ya habías realizado la transferencia o tienes dudas, ponte en contacto con soporte técnico.',
    alertType: 'danger'
  }
};

function isPdfUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.toLowerCase();
  return clean.endsWith('.pdf') || clean.includes('.pdf') || clean.includes('ext=pdf');
}

function Timer({ expiresAt }: { expiresAt: number }) {
  const [display, setDisplay] = useState('');
  const [urgent, setUrgent] = useState(false);
  useEffect(() => {
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) { setDisplay('Expirado'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUrgent(diff < 15 * 60000);
      setDisplay(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return <span style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: urgent ? '#dc2626' : '#d97706' }}>{display}</span>;
}

const MAX_CUSTOMER_EDITS = 2;

function getProductSku(p: any): string {
  const direct = p?.SKU || p?.sku || '';
  if (direct && String(direct).trim()) return String(direct).trim();
  const feats = Array.isArray(p?.FEATURES) ? p.FEATURES.join('\n') : (p?.FEATURES || '');
  const m = String(feats || '').match(/SKU:\s*(.+)/i);
  return m ? m[1].trim().split('\n')[0] : '';
}

function getProductBarcode(p: any): string {
  const direct = p?.BARCODE || p?.barcode || '';
  if (direct && String(direct).trim()) return String(direct).trim();
  const feats = Array.isArray(p?.FEATURES) ? p.FEATURES.join('\n') : (p?.FEATURES || '');
  const m = String(feats || '').match(/Barcode:\s*(.+)/i);
  return m ? m[1].trim().split('\n')[0] : '';
}

export default function PedidoPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [agencies, setAgencies] = useState<{ name: string }[]>([]);
  const [showAgencyChange, setShowAgencyChange] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [savingAgency, setSavingAgency] = useState(false);

  // ── Customer edit/cancel (max 2 cambios) ──
  const [editOpen, setEditOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<OrderItem[]>([]);
  const [originalQtyById, setOriginalQtyById] = useState<Record<string, number>>({});
  const [productStockById, setProductStockById] = useState<Record<string, number>>({});
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [editError, setEditError] = useState<string>('');
  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [imageModal, setImageModal] = useState<{ src: string; name: string } | null>(null);
  const [paymentProofIsPdf, setPaymentProofIsPdf] = useState(false);
  const [shippingProofIsPdf, setShippingProofIsPdf] = useState(false);

  // Customer-side out-of-stock replacement states
  const [customerReplacingIdx, setCustomerReplacingIdx] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [replacingError, setReplacingError] = useState('');

  const handleOpenReplacementModal = async (item: OrderItem, index: number) => {
    setCustomerReplacingIdx(index);
    setLoadingSuggestions(true);
    setReplacingError('');
    setSuggestions([]);
    
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      // 1. Try to load original product to find its category
      let categoryId = '';
      if (item.id) {
        try {
          const oldProd = await databases.getDocument(databaseId, PRODUCTS_COLLECTION, item.id);
          categoryId = (oldProd as any).CATEGORYID || '';
        } catch {}
      }

      // 2. Query products
      let prods: any[] = [];
      if (categoryId) {
        try {
          const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
            Query.equal('CATEGORYID', categoryId),
            Query.limit(50)
          ]);
          prods = res.documents;
        } catch {}
      }

      // 3. Fallback to name search if no category products found
      if (prods.length === 0) {
        try {
          const firstWord = item.name.split(' ').filter(w => w.length > 3)[0] || '';
          if (firstWord) {
            const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
              Query.search('NAME', firstWord),
              Query.limit(30)
            ]);
            prods = res.documents;
          }
        } catch {}
      }

      // 4. Ultimate fallback to general products
      if (prods.length === 0) {
        try {
          const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
            Query.limit(50)
          ]);
          prods = res.documents;
        } catch {}
      }

      // Filter: must have stock, not be the current product
      const filtered = prods.filter((p: any) => {
        if (p.$id === item.id) return false;
        const stock = p.STOCK ?? 0;
        return stock > 0 || stock === 99999;
      });

      // Sort by price similarity (compare retail prices if originalPrice is available)
      const targetComparePrice = item.originalPrice || item.price;
      const sorted = filtered.sort((a, b) => {
        const priceA = a.CURRENTPRICE ?? a.PRICE ?? 0;
        const priceB = b.CURRENTPRICE ?? b.PRICE ?? 0;
        const diffA = Math.abs(priceA - targetComparePrice);
        const diffB = Math.abs(priceB - targetComparePrice);
        return diffA - diffB;
      });

      setSuggestions(sorted);
    } catch (e: any) {
      setReplacingError('Error al buscar alternativas sugeridas.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleCustomerReplace = async (newProd: any) => {
    if (!order || customerReplacingIdx === null) return;
    const parsedItems = [...items];
    const oldItem = parsedItems[customerReplacingIdx];
    if (!oldItem) return;

    if (!confirm(`¿Confirmas cambiar "${oldItem.name}" por "${newProd.NAME}"?`)) return;

    setLoadingSuggestions(true);
    setReplacingError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // 1. Block old product (SKU)
      let oldSku = (oldItem as any).sku || '';
      let oldName = oldItem.name;
      let oldImg = oldItem.img || '';

      if (oldItem.id) {
        try {
          const oldProd: any = await databases.getDocument(databaseId, PRODUCTS_COLLECTION, oldItem.id);
          oldSku = oldProd.sku || getProductSku(oldProd);
          oldName = oldProd.NAME || oldName;
          oldImg = oldProd.IMAGEURL || oldImg;
        } catch {
          try {
            const nameSearchRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
              Query.equal('NAME', oldItem.name),
              Query.limit(1)
            ]);
            if (nameSearchRes.documents.length > 0) {
              const oldProd = nameSearchRes.documents[0] as any;
              oldSku = oldProd.sku || getProductSku(oldProd);
              oldName = oldProd.NAME || oldName;
              oldImg = oldProd.IMAGEURL || oldImg;
            }
          } catch (errName) {
            console.error("Error doing name fallback search for blocked products (customer):", errName);
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
        } catch {}
      }

      // 2. Block old product stock instead of deleting
      if (oldItem.id) {
        try {
          await databases.updateDocument(databaseId, PRODUCTS_COLLECTION, oldItem.id, {
            STOCK: 0
          });
        } catch (errStock) {
          console.warn('No se pudo actualizar stock del producto original', errStock);
        }
      }

      // 3. Swap in order ITEMS
      let newPrice = newProd.CURRENTPRICE ?? newProd.PRICE ?? 0;
      let newOriginalPrice = null;
      if (oldItem.originalPrice && oldItem.originalPrice > oldItem.price) {
        const discountPct = (oldItem.originalPrice - oldItem.price) / oldItem.originalPrice;
        newOriginalPrice = newPrice;
        newPrice = Math.round(newPrice * (1 - discountPct));
      }
      const newSku = newProd.sku || getProductSku(newProd);

      parsedItems[customerReplacingIdx] = {
        ...oldItem,
        id: newProd.$id,
        name: newProd.NAME,
        price: newPrice,
        originalPrice: newOriginalPrice,
        img: newProd.IMAGEURL || '',
        sku: newSku,
        total: newPrice * oldItem.qty,
        missing: false,
        replaced: true,
        originalItem: {
          id: oldItem.id || '',
          name: oldItem.name,
          price: oldItem.price,
          img: oldItem.img || '',
          sku: oldSku
        } as any
      };

      const newSubtotal = parsedItems.reduce((s, it) => s + (it.price * it.qty), 0);
      const newTotal = newSubtotal + (order.SHIPPINGCOST || 0) - (order.DISCOUNT || 0);
      const editCount = (order as any).CUSTOMEREDITCOUNT || 0;

      await databases.updateDocument(databaseId, ORDERS_COLLECTION, order.$id, {
        ITEMS: JSON.stringify(parsedItems),
        SUBTOTAL: newSubtotal,
        TOTAL: newTotal,
        CUSTOMEREDITCOUNT: editCount + 1,
        UPDATEDAT: Date.now()
      });

      setCustomerReplacingIdx(null);
      setSuggestions([]);
      await load();
      alert('¡Producto reemplazado con éxito!');

      // Notify admin about replacement status
      try {
        const updatedItems = parsedItems;
        const missingCount = updatedItems.filter((it: any) => it.missing === true).length;
        const replacedCount = updatedItems.filter((it: any) => it.replaced === true).length;
        const orderCode = order.ORDERCODE || order.$id;
        const customerName = order.CUSTOMERNAME || 'Cliente';

        if (missingCount === 0 && replacedCount > 0) {
          await notifyNegotiationComplete(orderCode, customerName, replacedCount);
        } else if (missingCount > 0 && replacedCount > 0) {
          await notifyNegotiationPartial(orderCode, customerName, replacedCount, missingCount);
        } else {
          // Fallback: use the old message format for edge cases
          const adminMsg = `✅ El cliente del pedido *#${orderCode}* ha completado un reemplazo en la web.\n• Producto original: ${oldItem.name}\n• Nuevo producto: ${newProd.NAME}`;
          await fetch('/api/admin/whatsapp-send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '56936599658', message: adminMsg })
          });
        }
      } catch (errNotify) {
        console.warn('Error notificando al admin:', errNotify);
      }

    } catch (e: any) {
      setReplacingError(e.message || 'Error al realizar el reemplazo');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const load = useCallback(async () => {
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const doc = await databases.getDocument(databaseId, ORDERS_COLLECTION, id);
      const o = doc as unknown as Order;
      setOrder(o);
      if (o.PAYMENTPROOFURL) setUploaded(true);
      try { setItems(JSON.parse(o.ITEMS)); } catch {}

      // If order is in negotiation and customer hasn't opened it yet, mark as opened
      if (o.STATUS === 'negotiation' && !(o as any).NEGOTIATION_OPENED_AT) {
        try {
          await databases.updateDocument(databaseId, ORDERS_COLLECTION, id, {
            NEGOTIATION_OPENED_AT: Date.now()
          });
          // Notify admin that customer opened the negotiation link
          notifyNegotiationOpened(o.ORDERCODE || id, o.CUSTOMERNAME || 'Cliente').catch(() => {});
        } catch (e) {
          console.warn('No se pudo marcar NEGOTIATION_OPENED_AT:', e);
        }
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

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

  // Load agencies
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/agencies');
        const data = await res.json();
        if (data.agencies) setAgencies(data.agencies);
      } catch {}
    })();
  }, []);

  async function handleChangeAgency() {
    if (!order || !selectedAgency || savingAgency) return;
    setSavingAgency(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION, id, {
        SHIPPINGAGENCY: selectedAgency,
        AGENCYCHANGED: true,
      });
      setOrder(prev => prev ? { ...prev, SHIPPINGAGENCY: selectedAgency, AGENCYCHANGED: true } : prev);
      setShowAgencyChange(false);
    } catch {
      alert('Error al cambiar la agencia. Intenta de nuevo.');
    } finally {
      setSavingAgency(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploading(true);
    try {
      const { storage, databases } = getServices();
      const { databaseId, endpoint, projectId } = getAppwriteConfig();
      const fileId = ID.unique();
      const up = await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const url = `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}&ext=${ext}`;
      await databases.updateDocument(databaseId, ORDERS_COLLECTION, id, { PAYMENTPROOFURL: url, STATUS: 'processing' });
      setUploaded(true);
      await load();

      // Notify admin about payment upload
      notifyPaymentUploaded(order?.ORDERCODE || id, order?.CUSTOMERNAME || 'Cliente').catch(() => {});
    } catch { alert('Error al subir el comprobante. Intenta de nuevo.'); }
    finally { setUploading(false); }
  }

  function copyField(key: string, val: string) {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function copyAll() {
    const text = Object.entries(getBankDetails()).map(([k, v]) => `${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  }

  function getCustomerEditCount(o: Order): number {
    const anyO = o as any;
    const v = anyO.CUSTOMEREDITCOUNT ?? anyO.customerEditCount ?? anyO.EDITCOUNT ?? anyO.editCount ?? 0;
    return typeof v === 'number' && Number.isFinite(v) ? v : 0;
  }

  function computeSubtotal(list: OrderItem[]) {
    return list.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  }

  function getMaxQtyFor(productId: string, currentStockFallback?: number): number | null {
    const stock = productStockById[productId] ?? currentStockFallback;
    if (stock === undefined || !Number.isFinite(stock)) return null;
    const original = Number(originalQtyById[productId] ?? 0) || 0;
    // El stock actual ya tiene descontada la reserva del pedido; por eso el máximo posible es:
    // qty_original_en_pedido + stock_disponible_actual
    return Math.max(0, original + stock);
  }

  async function loadStocksFor(ids: string[]) {
    const uniq = Array.from(new Set(ids.filter(Boolean)));
    if (uniq.length === 0) return;
    setLoadingStocks(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const out: Record<string, number> = {};
      await Promise.all(uniq.map(async (pid) => {
        try {
          const doc = await databases.getDocument(databaseId, PRODUCTS_COLLECTION, pid);
          out[pid] = Number((doc as any).STOCK ?? 0);
        } catch {
          // si falla, dejamos sin stock (null) para no bloquear UI; el guardado validará igual
        }
      }));
      setProductStockById(prev => ({ ...prev, ...out }));
    } finally {
      setLoadingStocks(false);
    }
  }

  function openEditor() {
    if (!order) return;
    setEditError('');
    setProductSearch('');
    setProductResults([]);
    // Clonar items actuales como base
    const base = (items || []).map(it => ({ ...it, qty: Math.max(1, Number(it.qty) || 1) }));
    const orig: Record<string, number> = {};
    for (const it of base) orig[it.id] = Number(it.qty) || 0;
    setOriginalQtyById(orig);
    setDraftItems(base);
    loadStocksFor(base.map(i => i.id));
    setEditOpen(true);
  }

  function closeEditor() {
    setEditOpen(false);
    setEditError('');
    setProductSearch('');
    setProductResults([]);
  }

  // Cerrar modal de imagen con ESC
  useEffect(() => {
    if (!imageModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImageModal(null);
    };
    document.addEventListener('keydown', onKeyDown);
    // bloquear scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [imageModal]);

  function setQty(productId: string, qty: number) {
    setDraftItems(prev => prev.map(it => {
      if (it.id !== productId) return it;
      const minQ = 1;
      const maxQ = getMaxQtyFor(productId, (it as any).stock);
      const next = Math.max(minQ, qty);
      const clamped = maxQ != null ? Math.min(next, maxQ) : next;
      const price = Number(it.price) || 0;
      return { ...it, qty: clamped, total: price * clamped };
    }));
  }

  function removeDraft(productId: string) {
    setDraftItems(prev => prev.filter(it => it.id !== productId));
  }

  async function searchProducts() {
    const q = productSearch.trim();
    if (q.length < 2) { setProductResults([]); return; }
    setSearchingProducts(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // Primero intentamos búsqueda nativa; si falla por permisos/índices, fallback a listar y filtrar.
      try {
        const seen = new Set<string>();
        const merged: Product[] = [];

        const resByName = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
          Query.search('NAME', q),
          Query.limit(20),
        ]);
        for (const d of (resByName.documents as any[])) {
          const id = String((d as any).$id || '');
          if (!id || seen.has(id)) continue;
          seen.add(id);
          merged.push(d as Product);
        }

        // Intentar también búsqueda por FEATURES (SKU/Barcode). Si no existe índice o falla, lo ignoramos.
        try {
          const resByFeatures = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
            Query.search('FEATURES', q),
            Query.limit(20),
          ]);
          for (const d of (resByFeatures.documents as any[])) {
            const id = String((d as any).$id || '');
            if (!id || seen.has(id)) continue;
            seen.add(id);
            merged.push(d as Product);
          }
        } catch {}

        const list = merged.slice(0, 20);
        setProductResults(list);
        // cachear stock para usarlo en límites de cantidad
        const stockMap: Record<string, number> = {};
        for (const p of list as any[]) {
          if (p?.$id && Number.isFinite(Number(p?.STOCK))) stockMap[String(p.$id)] = Number(p.STOCK);
        }
        if (Object.keys(stockMap).length) setProductStockById(prev => ({ ...prev, ...stockMap }));
      } catch {
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [Query.limit(80)]);
        const docs = (res.documents as unknown as Product[]) || [];
        const qq = q.toLowerCase();
        const list = docs
          .filter((p: any) => {
            const name = String(p?.NAME || '').toLowerCase();
            const sku = getProductSku(p).toLowerCase();
            const barcode = getProductBarcode(p).toLowerCase();
            const tags = Array.isArray(p?.TAGS) ? p.TAGS.join(',') : (p?.TAGS || '');
            const feats = Array.isArray(p?.FEATURES) ? p.FEATURES.join('\n') : (p?.FEATURES || '');
            const hay = `${name}\n${sku}\n${barcode}\n${String(tags).toLowerCase()}\n${String(feats).toLowerCase()}`;
            return hay.includes(qq);
          })
          .slice(0, 20);
        setProductResults(list);
        const stockMap: Record<string, number> = {};
        for (const p of list as any[]) {
          if (p?.$id && Number.isFinite(Number(p?.STOCK))) stockMap[String(p.$id)] = Number(p.STOCK);
        }
        if (Object.keys(stockMap).length) setProductStockById(prev => ({ ...prev, ...stockMap }));
      }
    } catch (e) {
      console.error(e);
      setProductResults([]);
    } finally {
      setSearchingProducts(false);
    }
  }

  function addProductToDraft(p: Product) {
    setDraftItems(prev => {
      const idx = prev.findIndex(x => x.id === p.$id);
      const price = (p.CURRENTPRICE ?? p.PRICE ?? 0) as number;
      const img = resolveStorageImageUrl(p.IMAGEURL);
      const pid = String((p as any).$id || '');
      const directStock = Number((p as any).STOCK ?? 0);
      if (idx >= 0) {
        const cur = prev[idx];
        const newQty = (cur.qty || 1) + 1;
        const curPrice = Number(cur.price) || 0;
        const maxQ = getMaxQtyFor(cur.id, directStock);
        if (maxQ != null && newQty > maxQ) {
          alert('No hay más stock disponible para este producto.');
          return prev;
        }
        const next = [...prev];
        next[idx] = { ...cur, qty: newQty, total: curPrice * newQty };
        return next;
      }
      const maxNew = getMaxQtyFor(pid, directStock);
      if (maxNew != null && maxNew <= 0) {
        alert('Este producto no tiene stock disponible.');
        return prev;
      }
      return [
        ...prev,
        { id: p.$id, name: p.NAME, price, qty: 1, img, total: price, stock: directStock },
      ];
    });

    const pid = String((p as any).$id || '');
    const directStock = Number((p as any).STOCK ?? 0);
    if (pid && Number.isFinite(directStock)) {
      setProductStockById(s => ({ ...s, [pid]: directStock }));
    }
  }

  async function handleSaveEdits() {
    if (!order || savingEdit) return;
    if (draftItems.length === 0) { setEditError('El pedido debe tener al menos 1 producto.'); return; }

    setSavingEdit(true);
    setEditError('');

    try {
      const res = await fetch('/api/public-data/edit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: id,
          draftItems
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Error al guardar los cambios del pedido.');
      }

      closeEditor();
      await load();
    } catch (e: any) {
      console.error(e);
      setEditError(e?.message || 'Error al guardar cambios. Intenta de nuevo.');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleCancelOrder() {
    if (!order || cancelling) return;
    if (!window.confirm('¿Seguro que quieres anular este pedido?')) return;

    setCancelling(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      const latestDoc = await databases.getDocument(databaseId, ORDERS_COLLECTION, id);
      const latest = latestDoc as unknown as Order;

      const editCount = getCustomerEditCount(latest);
      const unmodifiableStatuses = ['paid', 'assembling', 'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'];
      if (unmodifiableStatuses.includes(latest.STATUS)) {
        alert('No puedes anular el pedido si ya está verificado, en proceso de preparación o anulado.');
        return;
      }

      let latestItems: OrderItem[] = [];
      try { latestItems = JSON.parse((latest as any).ITEMS || '[]'); } catch {}

      // Restituir stock (solo si el producto tenía stock real, no el sentinel 99999)
      for (const it of latestItems) {
        const pid = it.id;
        const qty = Number(it.qty) || 0;
        if (!pid || qty <= 0) continue;
        try {
          const productDoc = await databases.getDocument(databaseId, PRODUCTS_COLLECTION, pid);
          const currentStock = Number((productDoc as any).STOCK ?? 0);
          // No restituir si el producto tiene stock ilimitado (sentinel 99999)
          if (currentStock === 99999) continue;
          await databases.updateDocument(databaseId, PRODUCTS_COLLECTION, pid, { STOCK: currentStock + qty });
        } catch (err) {
          console.error('Error restaurando stock', pid, err);
        }
      }

      await databases.updateDocument(databaseId, ORDERS_COLLECTION, id, {
        STATUS: 'cancelled',
        UPDATEDAT: Date.now(),
        CUSTOMEREDITCOUNT: editCount + 1,
      });

      await load();
    } catch (e) {
      console.error(e);
      alert('Error al anular el pedido. Intenta de nuevo.');
    } finally {
      setCancelling(false);
    }
  }

  async function handleConfirmDelivery() {
    if (!order || confirming) return;
    if (!window.confirm('¿Confirmas que recibiste tu pedido correctamente?')) return;
    setConfirming(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, ORDERS_COLLECTION, id, {
        STATUS: 'delivered',
        UPDATEDAT: Date.now(),
      });
      setConfirmed(true);
      await load();
    } catch {
      alert('Error al confirmar la entrega. Intenta de nuevo.');
    } finally {
      setConfirming(false);
    }
  }

  const card: React.CSSProperties = { background: '#fff', borderRadius: 4, padding: '20px 22px', marginBottom: 12 };

  if (isLoading || authLoading) return (
    <div style={{ background: '#ebebeb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: 15 }}>Cargando pedido...</p>
    </div>
  );

  if (!order) return (
    <div style={{ background: '#ebebeb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <AlertTriangle size={40} color="#e53935" />
      <p style={{ color: '#333', fontSize: 16 }}>Pedido no encontrado</p>
      <Link href="/" style={{ color: '#3483fa', textDecoration: 'none', fontSize: 14 }}>Ir al inicio</Link>
    </div>
  );

  if (order.USERID && order.USERID !== 'guest') {
    if (!isLoggedIn || user?.id !== order.USERID) {
      return (
        <div style={{ background: '#ebebeb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, textAlign: 'center' }}>
          <Shield size={48} color="#e396bf" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#333', margin: 0 }}>Acceso Denegado</h2>
          <p style={{ color: '#666', fontSize: 14, maxWidth: 400 }}>
            Este pedido pertenece a una cuenta registrada. Para proteger la privacidad, debes iniciar sesión con la cuenta dueña de este pedido para verlo.
          </p>
          <Link href="/login" style={{ display: 'inline-block', marginTop: 10, padding: '12px 24px', background: '#e396bf', color: '#fff', textDecoration: 'none', borderRadius: 8, fontWeight: 700 }}>
            Iniciar Sesión
          </Link>
        </div>
      );
    }
  }

  const isPending = order.STATUS === 'pending';
  const BANK = getBankDetails();
  const isRetiro = order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
  const isReadyRetiro = order.STATUS === 'ready_to_ship' && isRetiro;
  const status = isReadyRetiro 
    ? { label: 'Listo para retirar', color: '#a21caf', bg: '#fae8ff' }
    : (STATUS_MAP[order.STATUS] || { label: order.STATUS, color: '#333', bg: '#f5f5f5' });
  const showTimer = isPending && order.EXPIRESAT && !uploaded;
  const isSuccess = uploaded || order.STATUS !== 'pending';
  const customerEditCount = getCustomerEditCount(order);
  const canCustomerModify = !['paid', 'assembling', 'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'].includes(order.STATUS);
  // Allow replacement selection even for 'paid'/'processing' orders if there are missing items
  const hasMissingItems = items.some(it => !!(it as any).missing);
  const canChooseReplacement = hasMissingItems && !['shipped', 'delivered', 'cancelled'].includes(order.STATUS);

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-indigo-50/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Header success banner ── */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-pink-100/40 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-400 via-pink-500 to-indigo-500" />
          <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4 border border-pink-100/50 shadow-inner">
            {isSuccess
              ? <CheckCircle size={32} className="text-pink-500" />
              : <Clock size={32} className="text-pink-500" />}
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isSuccess ? '¡Pedido confirmado!' : '¡Pedido recibido!'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Código: <strong className="text-gray-900 font-bold">{order.ORDERCODE}</strong></p>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-50 text-pink-600 border border-pink-100/30">
              {status.label}
            </span>
          </div>
          {order.CUSTOMERNAME && (
            <p className="text-sm text-gray-500 mt-4">
              Hola <strong className="text-gray-900 font-semibold">{order.CUSTOMERNAME}</strong>, gracias por tu compra.
            </p>
          )}
        </div>

        {(() => {
          const isRetiro = order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
          const isReadyRetiro = order.STATUS === 'ready_to_ship' && isRetiro;
          const infoRaw = STATUS_DESCRIPTIONS[order.STATUS] || { title: 'Estado del pedido', desc: 'Tu pedido está siendo procesado.', alertType: 'info' };
          const info = isReadyRetiro 
            ? {
                title: 'Listo para retirar',
                desc: '¡Tu pedido ya está listo! Puedes pasar a retirarlo en nuestra tienda física.',
                alertType: 'indigo'
              }
            : infoRaw;
          let bgClass = 'bg-blue-50/80 border-blue-200 text-blue-800';
          let iconColor = 'text-blue-500';
          if (info.alertType === 'warning') {
            bgClass = 'bg-amber-50/80 border-amber-200 text-amber-800';
            iconColor = 'text-amber-600';
          } else if (info.alertType === 'success') {
            bgClass = 'bg-green-50/80 border-green-200 text-green-800';
            iconColor = 'text-green-600';
          } else if (info.alertType === 'indigo') {
            bgClass = isReadyRetiro 
              ? 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800' 
              : 'bg-indigo-50/80 border-indigo-200 text-indigo-800';
            iconColor = isReadyRetiro ? 'text-fuchsia-500' : 'text-indigo-600';
          } else if (info.alertType === 'danger') {
            bgClass = 'bg-red-50/80 border-red-200 text-red-800';
            iconColor = 'text-red-600';
          }
          return (
            <div className={`border rounded-3xl p-5 md:p-6 mb-8 flex items-start gap-4 transition-all duration-300 ${bgClass}`}>
              <div className={`p-3 rounded-2xl bg-white shadow-sm flex-shrink-0 ${iconColor}`}>
                {order.STATUS === 'pending' && <Clock size={24} />}
                {order.STATUS === 'processing' && <Upload size={24} />}
                {order.STATUS === 'paid' && <CheckCircle size={24} />}
                {order.STATUS === 'assembling' && <Package size={24} />}
                {order.STATUS === 'negotiation' && <MessageSquare size={24} />}
                {order.STATUS === 'preparing_shipping' && <Tag size={24} />}
                {order.STATUS === 'ready_to_ship' && <Receipt size={24} />}
                {order.STATUS === 'shipped' && <Truck size={24} />}
                {order.STATUS === 'delivered' && <CheckCircle size={24} />}
                {order.STATUS === 'cancelled' && <AlertTriangle size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base md:text-lg mb-1">{info.title}</h3>
                <p className="text-sm leading-relaxed opacity-90">{info.desc}</p>
              </div>
            </div>
          );
        })()}

        {/* ── Order Timeline (Stepper) ── */}
        {(() => {
          const isRetiro = order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
          const steps = [
            { key: 'pending',            label: 'Pedido',       icon: <Clock size={15} /> },
            { key: 'processing',         label: 'Verificando',  icon: <Upload size={15} /> },
            { key: 'paid',               label: 'Verificado',   icon: <CheckCircle size={15} /> },
            { key: 'assembling',         label: 'Armando',      icon: <Package size={15} /> },
            { key: 'negotiation',        label: 'Negociación',  icon: <MessageSquare size={15} /> },
            { key: 'preparing_shipping', label: 'Etiqueta Lista',  icon: <Tag size={15} /> },
            { key: 'ready_to_ship',      label: 'Pedido listo para enviar',     icon: <Box size={15} /> },
            { key: 'shipped',            label: 'Enviado',      icon: <Truck size={15} /> },
            { key: 'delivered',          label: 'Entregado',    icon: <CheckCircle size={15} /> },
          ];
          const statusOrder = ['pending', 'processing', 'paid', 'assembling', 'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped', 'delivered'];
          const currentIdx = statusOrder.indexOf(order.STATUS);
          if (order.STATUS === 'cancelled') return null;
          return (
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pink-100/40">
              {/* Desktop horizontal timeline */}
              <div className="hidden md:flex items-start justify-between relative">
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-100 z-0" />
                <div className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-pink-400 to-pink-500 z-1 transition-all duration-500" style={{ width: currentIdx >= 0 ? `${Math.min(100, (currentIdx / (steps.length - 1)) * 100)}%` : '0%' }} />
                {steps.map((step, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-400'} ${active ? 'ring-4 ring-pink-100 scale-110' : ''}`}>
                        {step.icon}
                      </div>
                      <span className={`mt-2 text-[10px] text-center leading-tight max-w-[70px] ${active ? 'font-extrabold text-gray-900' : done ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile vertical timeline */}
              <div className="flex md:hidden flex-col gap-4 relative pl-2">
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100 z-0" />
                <div className="absolute left-6 top-4 w-0.5 bg-pink-400 z-1 transition-all duration-500" style={{ height: currentIdx >= 0 ? `${Math.min(100, (currentIdx / (steps.length - 1)) * 100)}%` : '0%' }} />
                {steps.map((step, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div key={step.key} className="flex items-center gap-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${done ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-400'} ${active ? 'ring-4 ring-pink-100 scale-110' : ''}`}>
                        {step.icon}
                      </div>
                      <span className={`text-xs font-semibold ${active ? 'text-pink-600 font-extrabold' : done ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── Timer ── */}
        {showTimer && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-amber-800 mb-2">Tienes 3 horas para completar el pago</p>
            <div className="my-2">
              <Timer expiresAt={order.EXPIRESAT!} />
            </div>
            <p className="text-xs text-amber-600">Una vez transferido, sube tu comprobante abajo para validarlo.</p>
          </div>
        )}

        {/* ── Bank details ── */}
        {isPending && !uploaded && (
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pink-100/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-gray-900">Datos de transferencia</h2>
              <button onClick={copyAll} className="flex items-center gap-1 px-3 py-1.5 bg-pink-50 border border-pink-100/30 rounded-xl text-xs font-bold text-pink-600 hover:bg-pink-100 transition">
                {copied === 'all' ? <><Check size={12} className="text-green-500" /> Copiado</> : <><Copy size={12} /> Copiar todo</>}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(BANK).map(([key, val]) => (
                <button key={key} onClick={() => copyField(key, val)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition ${copied === key ? 'bg-green-50/50 border-green-200' : 'bg-pink-50/10 border-pink-100/20 hover:bg-pink-50/30'}`}>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{key}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{val}</p>
                  </div>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${copied === key ? 'text-green-600' : 'text-gray-400 group-hover:text-pink-500'}`}>
                    {copied === key ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-pink-50/30 border border-pink-100/40 rounded-2xl">
              <p className="text-xs text-pink-800 leading-relaxed">
                ⚠️ Transfiere exactamente <strong className="text-sm font-extrabold">{formatPrice(order.TOTAL)}</strong> y sube el comprobante abajo para confirmar tu pedido.
              </p>
            </div>
          </div>
        )}

        {/* ── Comprobante de pago ── */}
        {(isPending || order.STATUS === 'processing' || order.PAYMENTPROOFURL) && (
          <div className={`bg-white rounded-3xl p-5 md:p-6 shadow-sm border transition-all ${order.PAYMENTPROOFURL ? 'border-green-200 bg-green-50/10' : 'border-pink-100/40'}`}>
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-4">
              <Upload size={18} className={order.PAYMENTPROOFURL ? 'text-green-600' : 'text-pink-500'} />
              Comprobante de pago
            </h2>
            
            {order.PAYMENTPROOFURL ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700 text-sm font-bold bg-green-50/60 p-4 rounded-2xl border border-green-200">
                  <CheckCircle size={18} className="shrink-0" />
                  <span>Comprobante recibido y en proceso de verificación</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      const url = order.PAYMENTPROOFURL!;
                      if (isPdfUrl(url) || paymentProofIsPdf) {
                        window.open(url, '_blank');
                      } else {
                        setImageModal({ src: url, name: 'Comprobante de pago' });
                      }
                    }}
                    className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-250 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition duration-300"
                  >
                    <ExternalLink size={14} /> Ver comprobante actual
                  </button>
                  
                  {/* Permitir re-subir comprobante si aún no ha sido verificado como pagado */}
                  {(order.STATUS === 'pending' || order.STATUS === 'processing') && (
                    <label className={`flex-1 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-150 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition duration-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
                      <RefreshCw size={14} className={uploading ? 'animate-spin' : ''} />
                      <span>{uploading ? 'Subiendo...' : 'Cambiar comprobante'}</span>
                    </label>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3">Por favor, sube una captura o archivo PDF de tu transferencia.</p>
                <label className={`block ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
                  <div className="border-2 border-dashed border-pink-100 hover:border-pink-300 rounded-2xl p-6 text-center bg-pink-50/5 transition">
                    {uploading ? (
                      <p className="text-sm font-semibold text-pink-500 animate-pulse">Subiendo comprobante...</p>
                    ) : (
                      <>
                        <Upload size={32} className="text-pink-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-pink-700">Haz click para subir comprobante</p>
                        <p className="text-xs text-gray-400 mt-0.5">Formatos: JPG, PNG, PDF</p>
                      </>
                    )}
                  </div>
                </label>
              </>
            )}
          </div>
        )}

        {/* ── WhatsApp Link Section ── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pink-100/40 mb-4">
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-2">
            <MessageSquare size={18} className="text-[#25D366]" /> Recibir notificaciones
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Conecta tu pedido a nuestro WhatsApp para recibir actualizaciones automáticas. Si escribiste mal tu número en el carrito, haz click aquí para corregirlo.
          </p>
          <a
            href={`https://wa.me/56999149712?text=vincular_pedido%20${order.$id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold text-sm transition shadow-sm"
          >
            <MessageSquare size={16} /> Conectar WhatsApp
          </a>
        </div>

        {/* ── Order items ── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pink-100/40">
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-4">
            <Package size={18} className="text-pink-500" /> Detalle del pedido
          </h2>
          <div className="divide-y divide-pink-50/40 space-y-3 pb-4">
            {items.map((item, i) => {
              const isMissing = !!(item as any).missing;
              const isReplaced = !!(item as any).replaced;

              // En modo negociación, si hay algún item marcado como faltante o reemplazado,
              // ocultamos todos los que estén disponibles de forma normal.
              const hasNegotiations = order?.STATUS === 'negotiation' && items.some(x => x.missing || x.replaced);
              if (hasNegotiations && !isMissing && !isReplaced) return null;

              const hasDiscount = item.originalPrice && item.originalPrice > item.price;
              const discountPct = hasDiscount ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100) : 0;
              return (
                <div key={i} className={`pt-3 first:pt-0 ${isMissing ? 'bg-red-50/30 p-3 rounded-2xl border border-red-100' : ''}`}>
                  <div className="flex gap-3 items-start">
                    {/* Imagen de Producto */}
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-pink-100/30 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.img ? (
                        <img src={resolveStorageImageUrl(item.img)} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-gray-300" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold leading-tight ${isMissing ? 'text-red-900' : 'text-gray-800'}`}>
                        {item.name}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400">
                          Cantidad: <strong className="text-gray-800 font-bold">{item.qty}</strong> · {formatPrice(item.price)} c/u
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-xs line-through text-gray-300">{formatPrice(item.originalPrice!)}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-extrabold">-{discountPct}%</span>
                          </>
                        )}
                      </div>

                      {isMissing && (
                        <div className="text-red-600 text-xs font-bold mt-2 flex items-center gap-1">
                          <AlertTriangle size={13} /> Producto agotado - requiere reemplazo
                        </div>
                      )}
                      {isReplaced && (() => {
                        const origItem = (item as any).originalItem;
                        if (!origItem) return (
                          <div className="text-green-600 text-xs font-bold mt-1 flex items-center gap-1">
                            <CheckCircle size={13} /> Reemplazado
                          </div>
                        );
                        
                        const originalPriceTotal = (origItem.price || 0) * item.qty;
                        const replacementPriceTotal = item.price * item.qty;
                        const difference = originalPriceTotal - replacementPriceTotal;
                        
                        return (
                          <div className="mt-1 space-y-1">
                            <div className="text-green-600 text-xs font-bold flex items-center gap-1">
                              <CheckCircle size={13} /> Reemplazado
                            </div>
                            <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 inline-block">
                              <p className="font-semibold text-gray-700">Detalles del reemplazo:</p>
                              <p className="mt-0.5">Producto original: <span className="font-bold text-gray-600">{origItem.name}</span> ({formatPrice(origItem.price)})</p>
                              {difference > 0 ? (
                                <p className="text-orange-600 font-bold mt-0.5">
                                  Diferencia en contra: {formatPrice(difference)}
                                </p>
                              ) : difference < 0 ? (
                                <p className="text-emerald-600 font-bold mt-0.5">
                                  Saldo a favor: {formatPrice(Math.abs(difference))}
                                </p>
                              ) : (
                                <p className="text-gray-500 font-bold mt-0.5">Sin diferencia de precio</p>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      {(item as any).note && (
                        <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-100/60 flex items-start gap-1">
                          <span className="font-bold">💬 Nota:</span>
                          <span>{(item as any).note}</span>
                        </div>
                      )}
                      {isMissing && (canChooseReplacement || canCustomerModify) && (
                        <button
                          onClick={() => handleOpenReplacementModal(item, i)}
                          className="mt-2.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition"
                        >
                          <RefreshCw size={12} /> Elegir reemplazo
                        </button>
                      )}
                    </div>
                    
                    <p className={`text-sm font-extrabold ${isMissing ? 'text-red-900' : 'text-gray-900'} shrink-0 pt-0.5`}>
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">{formatPrice(order.SUBTOTAL)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="font-bold text-green-600">{order.SHIPPINGCOST > 0 ? formatPrice(order.SHIPPINGCOST) : 'A coordinar'}</span>
            </div>
            {order.DISCOUNT && order.DISCOUNT > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Descuento {order.COUPONCODE && <span className="font-mono text-xs">({order.COUPONCODE})</span>}
                </span>
                <span className="text-emerald-600 font-medium">-{formatPrice(order.DISCOUNT)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-gray-950 pt-3 border-t border-gray-150 mt-2">
              <span>Total</span>
              <span>{formatPrice(order.TOTAL)}</span>
            </div>
          </div>
        </div>

        {/* ── Customer actions: editar/anular (máximo 2 veces) ── */}
        {order.STATUS !== 'cancelled' && (
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Gestionar pedido</h3>
                <p className="text-xs text-gray-400 mt-0.5">Modificaciones disponibles antes del empaque.</p>
              </div>
              {editOpen && (
                <button onClick={closeEditor}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition flex items-center gap-1 self-start sm:self-auto">
                  <X size={14} /> Cerrar editor
                </button>
              )}
            </div>

            {!canCustomerModify && (
              <p className="text-xs text-gray-400">
                Este pedido se encuentra en preparación o ya fue despachado, por lo que no permite modificaciones.
              </p>
            )}

            {canCustomerModify && !editOpen && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={openEditor}
                  className="flex-1 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-100 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition duration-300">
                  <Pencil size={14} /> Modificar productos
                </button>
                <button onClick={handleCancelOrder} disabled={cancelling}
                  className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50">
                  <Trash2 size={14} /> {cancelling ? 'Anulando...' : 'Anular pedido'}
                </button>
              </div>
            )}

            {editOpen && (
              <div className="space-y-4 mt-2">
                {editError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-700">
                    {editError}
                  </div>
                )}

                {/* Items editor */}
                <div className="space-y-2.5">
                  {draftItems.map((it) => (
                    <div key={it.id} className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-2xl bg-gray-50/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            const src = it.img ? resolveStorageImageUrl(it.img) : '';
                            if (src) setImageModal({ src, name: it.name });
                          }}
                          className="w-11 h-11 rounded-xl bg-white overflow-hidden shrink-0 border border-gray-100 cursor-pointer"
                        >
                          {it.img ? (
                            <img src={resolveStorageImageUrl(it.img)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Package size={18} className="text-gray-400" />
                            </div>
                          )}
                        </button>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{it.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatPrice(it.price)} · <span className="font-semibold text-gray-700">{formatPrice(it.price * it.qty)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
                          <button onClick={() => setQty(it.id, (it.qty || 1) - 1)} disabled={(it.qty || 1) <= 1 || loadingStocks}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-gray-500">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-800">{it.qty}</span>
                          <button onClick={() => setQty(it.id, (it.qty || 1) + 1)} disabled={loadingStocks}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500">
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeDraft(it.id)}
                          className="p-2 border border-red-100 rounded-xl hover:bg-red-50 text-red-600 transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add products */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-bold text-gray-800 flex items-center gap-1 mb-2">
                    <Search size={13} /> Agregar productos
                  </p>
                  <div className="flex gap-2">
                    <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Buscar producto..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-pink-300"
                    />
                    <button onClick={searchProducts} disabled={searchingProducts}
                      className="px-4 py-2 bg-pink-500 text-white rounded-xl font-bold text-xs hover:bg-pink-600 transition disabled:opacity-50 flex items-center gap-1">
                      <Search size={13} /> Buscar
                    </button>
                  </div>

                  {productResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {productResults.map(p => {
                        const stock = Number((p as any).STOCK ?? NaN);
                        const hasStock = Number.isFinite(stock) ? stock > 0 : true;
                        return (
                          <button
                            key={p.$id}
                            onClick={() => { if (hasStock) addProductToDraft(p); }}
                            disabled={!hasStock}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 text-left disabled:opacity-50 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                {p.IMAGEURL ? (
                                  <img src={resolveStorageImageUrl(p.IMAGEURL)} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center"><Package size={15} className="text-gray-300" /></div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-800 truncate">{p.NAME}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Stock: {Number.isFinite(stock) ? stock : '—'}</p>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="text-xs font-extrabold text-gray-900">{formatPrice((p.CURRENTPRICE ?? p.PRICE ?? 0) as number)}</span>
                              <span className="text-[10px] font-bold text-pink-600">+ Agregar</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Summary & Save */}
                <div className="border-t border-gray-100 pt-3 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>Nuevo subtotal</span>
                    <span>{formatPrice(computeSubtotal(draftItems))}</span>
                  </div>
                  <button onClick={handleSaveEdits} disabled={savingEdit}
                    className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold text-sm transition duration-300 disabled:opacity-50">
                    {savingEdit ? 'Guardando...' : 'Confirmar cambios en pedido'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Replacement Modal */}
        {customerReplacingIdx !== null && (
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={() => { if (!loadingSuggestions) { setCustomerReplacingIdx(null); setSuggestions([]); } }}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] border border-gray-150"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">Selecciona una alternativa</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">
                    Reemplazo para: {items[customerReplacingIdx]?.name}
                  </p>
                </div>
                <button 
                  onClick={() => { setCustomerReplacingIdx(null); setSuggestions([]); }}
                  disabled={loadingSuggestions}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {replacingError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-700">
                    {replacingError}
                  </div>
                )}

                {loadingSuggestions ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : suggestions.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-8">No hay alternativas sugeridas en stock.</p>
                ) : (
                  <div className="space-y-2">
                    {suggestions.map((p) => {
                      let price = p.CURRENTPRICE ?? p.PRICE ?? 0;
                      const originalItem = items[customerReplacingIdx!];
                      const hasDiscount = originalItem?.originalPrice && originalItem.originalPrice > originalItem.price;
                      if (hasDiscount) {
                        const discountPct = (originalItem.originalPrice! - originalItem.price) / originalItem.originalPrice!;
                        price = Math.round(price * (1 - discountPct));
                      }
                      const origPrice = originalItem?.price || 0;
                      const diff = price - origPrice;
                      const diffText = diff === 0 
                        ? 'Mismo precio' 
                        : diff > 0 
                          ? `+$${diff.toLocaleString()} de diferencia`
                          : `-$${Math.abs(diff).toLocaleString()} de diferencia`;
                      return (
                        <div
                          key={p.$id}
                          className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100/55 transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                              {p.IMAGEURL ? (
                                <img src={resolveStorageImageUrl(p.IMAGEURL)} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package size={18} className="text-gray-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{p.NAME}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                Precio: <span className="font-semibold text-gray-800">{formatPrice(price)}</span> · <span className="font-medium text-pink-600">{diffText}</span>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCustomerReplace(p)}
                            className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold shrink-0 transition"
                          >
                            Elegir
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Fullscreen Image Lightbox */}
        {imageModal && (() => {
          const isPdf = isPdfUrl(imageModal.src) || (imageModal.src === order?.PAYMENTPROOFURL ? paymentProofIsPdf : (imageModal.src === order?.SHIPPINGPROOFURL ? shippingProofIsPdf : false));
          return (
            <div
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setImageModal(null)}
            >
              <div
                className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-gray-150 flex items-center justify-between bg-gray-50">
                  <p className="text-xs font-bold text-gray-700 truncate pr-4">{imageModal.name}</p>
                  <div className="flex gap-2">
                    <a href={imageModal.src} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-xl bg-pink-50 border border-pink-100 hover:bg-pink-100 text-pink-700 transition flex items-center gap-1 text-xs font-bold no-underline">
                      <ExternalLink size={14} /> Abrir archivo
                    </a>
                    <button onClick={() => setImageModal(null)} className="p-1 px-3 rounded-xl bg-white border border-gray-250 hover:bg-gray-100 text-gray-600 transition flex items-center gap-1 text-xs font-bold">
                      <X size={14} /> Cerrar
                    </button>
                  </div>
                </div>
                <div className="bg-black/95 flex items-center justify-center min-h-[40vh] max-h-[80vh] overflow-hidden p-6 text-white">
                  {isPdf ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <FileText size={64} className="text-pink-500 animate-pulse" />
                      <p className="text-sm font-semibold text-gray-300">Este archivo es un comprobante en formato PDF</p>
                      <a href={imageModal.src} target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition font-bold text-xs flex items-center gap-2 no-underline">
                        <ExternalLink size={14} /> Abrir y ver PDF en nueva pestaña
                      </a>
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imageModal.src} alt="" className="max-w-full max-h-[78vh] object-contain" />
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Shipping info ── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pink-100/40">
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-pink-500" /> Datos de envío
          </h2>
          <div className="flex flex-col gap-1.5 text-sm text-gray-600">
            <p className="font-bold text-gray-900 text-base">{order.CUSTOMERNAME}</p>
            <p>{order.CUSTOMERPHONE}{order.CUSTOMEREMAIL ? ` · ${order.CUSTOMEREMAIL}` : ''}</p>
            <p>{order.ADDRESS}</p>
            <p>{order.COMUNA}, {order.REGION}</p>
            <div className="flex items-center gap-2 mt-2 font-semibold text-pink-600 text-xs">
              <Truck size={14} />
              <span>{order.SHIPPINGAGENCY}</span>
              {order.AGENCYCHANGED && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-pink-50 text-pink-700 rounded-md border border-pink-100">Modificada</span>
              )}
            </div>

            {(order as any).TRACKINGNUMBER && (
              <div className="mt-4 p-4 bg-violet-50/50 border border-violet-100 rounded-2xl flex flex-col gap-1">
                <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">Número de Seguimiento</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-base font-bold text-violet-800 break-all select-all">
                    {(order as any).TRACKINGNUMBER}
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText((order as any).TRACKINGNUMBER);
                      alert('¡Número de seguimiento copiado!');
                    }}
                    className="p-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-xl transition shrink-0"
                    title="Copiar número"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Agency change option */}
            {order.STATUS === 'pending' && !order.AGENCYCHANGED && (
              showAgencyChange ? (
                <div className="mt-4 p-4 bg-pink-50/20 border border-pink-100 rounded-2xl">
                  <p className="text-xs font-bold text-pink-800 mb-2">Selecciona nueva agencia de envío</p>
                  <select value={selectedAgency} onChange={e => setSelectedAgency(e.target.value)}
                    className="w-full px-3 py-2 border border-pink-200 rounded-xl text-xs font-bold text-pink-700 bg-white mb-3 outline-none focus:ring-2 focus:ring-pink-300">
                    <option value="">Seleccionar agencia</option>
                    {agencies.map(a => (
                      <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={handleChangeAgency} disabled={!selectedAgency || savingAgency}
                      className="flex-1 py-2 bg-pink-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-pink-600 disabled:opacity-50 transition">
                      <RefreshCw size={13} />
                      {savingAgency ? 'Guardando...' : 'Confirmar'}
                    </button>
                    <button onClick={() => setShowAgencyChange(false)}
                      className="px-4 py-2 bg-white border border-pink-100 text-pink-600 rounded-xl text-xs font-bold hover:bg-pink-50/50 transition">
                      Cancelar
                    </button>
                  </div>
                  <p className="text-[10px] text-pink-400 mt-2">⚠ Solo puedes cambiar la agencia 1 vez.</p>
                </div>
              ) : (
                <button onClick={() => { setShowAgencyChange(true); setSelectedAgency(order.SHIPPINGAGENCY || ''); }}
                  className="mt-3.5 px-3 py-1.5 bg-pink-50/50 text-pink-600 border border-pink-100 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-pink-100/50 transition self-start">
                  <RefreshCw size={12} /> Cambiar agencia de despacho
                </button>
              )
            )}

            {order.SHIPPINGPROOFURL && (() => {
              const url = order.SHIPPINGPROOFURL!;
              const isPdf = isPdfUrl(url) || shippingProofIsPdf;
              return (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <Truck className="w-4 h-4 text-pink-600" /> Comprobante de envío
                  </p>
                  {isPdf ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-medium">El comprobante de despacho se encuentra disponible en formato PDF:</p>
                      <button 
                        onClick={() => window.open(url, '_blank')}
                        className="w-full py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-100 rounded-2xl transition duration-300 font-semibold flex items-center justify-center gap-2 text-xs"
                      >
                        <FileText size={15} /> Ver comprobante de despacho (PDF)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 font-medium">Haz click en la imagen para ampliarla:</p>
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 max-h-60 flex items-center justify-center cursor-pointer hover:opacity-95 transition"
                        onClick={() => setImageModal({ src: url, name: 'Comprobante de envío' })}>
                        <img src={url} alt="Comprobante de despacho" className="max-w-full max-h-60 object-contain p-1" />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold flex items-center gap-1">
                          <Search size={10} /> Ampliar imagen
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── Delivery confirmation ── */}
        {order.STATUS === 'shipped' && !confirmed && (
          <div className="bg-indigo-50/30 border border-indigo-100 rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                <Truck size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-indigo-900">Tu pedido fue despachado</p>
                <p className="text-xs text-indigo-500">¿Ya lo recibiste? Por favor, confirma la entrega.</p>
              </div>
            </div>
            <button onClick={handleConfirmDelivery} disabled={confirming}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50">
              <Package size={15} />
              {confirming ? 'Confirmando...' : 'Confirmar que recibí mi pedido'}
            </button>
          </div>
        )}

        {/* Delivered confirmation */}
        {(order.STATUS === 'delivered' || confirmed) && (
          <div className="bg-green-50/20 border border-green-200 rounded-3xl p-5 md:p-6 text-center">
            <CheckCircle size={28} className="text-green-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-green-800">Entrega confirmada</p>
            <p className="text-xs text-green-600 mt-0.5">Gracias por confirmar la recepción de tu pedido.</p>
          </div>
        )}

        {/* Purchase Protection */}
        <div className="bg-green-50/20 border border-green-200 rounded-3xl p-4 flex items-start gap-3">
          <Shield size={18} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-xs text-green-800 leading-relaxed">
            <strong>Compra Protegida</strong> — Si tienes algún problema con la recepción de tu pedido, te garantizamos la devolución de tu dinero o reemplazo de productos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Download PDF */}
          <button onClick={() => generateOrderPdf(order, items)}
            className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-250 rounded-2xl font-semibold flex items-center justify-center gap-2 text-xs transition">
            <FileText size={15} /> Descargar comprobante en PDF
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/productos" className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white text-center rounded-2xl font-bold text-xs transition no-underline block">
              Seguir comprando
            </Link>
            <Link href="/cuenta/pedidos" className="flex-1 py-3 bg-white hover:bg-gray-50 text-pink-600 text-center rounded-2xl font-bold text-xs transition border border-pink-100 no-underline block">
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
