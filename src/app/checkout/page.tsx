'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, MapPin, Package, ChevronDown, ChevronRight, Shield, Truck, RefreshCw, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID, NOTIFICATIONS_COLLECTION_ID, WHOLESALE_ORDERS_COLLECTION_ID, APERTURA_SETTINGS_COLLECTION_ID, COUPONS_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { serverListDocuments } from '@/lib/appwrite-server';
import { ADDRESSES_COLLECTION_ID } from '@/lib/appwrite-admin';
import { notifyNewOrder } from '@/lib/notify-admin';
import { CHILE_REGIONES } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/appwrite';
import { resolveStorageImageUrl } from '@/lib/product-images';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import { getSkuFromFeatures, getBarcodeFromFeatures } from '@/lib/product-features';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { Query, ID } from 'appwrite';
import Image from 'next/image';
import Link from 'next/link';
import { isBelowMinimumOrder, minimumOrderMessage } from '@/lib/order-rules';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import DynamicCheckout from '@/components/DynamicCheckout';

interface AgencyOption { name: string; color: string; bg: string; desc: string; logo: string; active?: boolean; }
interface SavedAddress { id: string; alias: string; name: string; phone: string; fullAddress: string; commune: string; region: string; lat: number; lng: number; }

// Fallback agencies if API fails
const FALLBACK_AGENCIES: AgencyOption[] = [
  { name: 'STARKEN', color: '#1a7f37', bg: '#e6f4ea', desc: 'Envío a coordinar tras confirmar', logo: '', active: true },
  { name: 'BLUEXPRESS', color: '#1558b0', bg: '#e8f0fe', desc: 'Envío a coordinar tras confirmar', logo: '', active: true },
  { name: 'VARMONTT', color: '#c62828', bg: '#fce8e6', desc: 'Envío a coordinar tras confirmar', logo: '', active: true },
  { name: 'RETIRO EN TIENDA', color: '#e65c00', bg: '#fff3e0', desc: 'Retira en nuestra sucursal', logo: '', active: true },
];

const PINK = '#e396bf'; const PINK_LIGHT = '#f5a8cf'; const PINK_BG = '#fdf2f8'; const FF = '"DM Sans", system-ui, sans-serif';
const inp: React.CSSProperties = { width: '100%', padding: '12px 14px', border: '1.5px solid #fce7f3', borderRadius: 12, fontSize: 14, outline: 'none', color: '#111', background: '#fff', boxSizing: 'border-box', transition: 'all .2s', fontFamily: FF };
const selectStyle: React.CSSProperties = { ...inp, appearance: 'none', paddingRight: 32, backgroundColor: '#fff', color: '#111' };
const optionStyle: React.CSSProperties = { backgroundColor: '#fff', color: '#111' };
const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 6, fontFamily: FF };

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const discountParam = parseFloat(searchParams.get('discount') || '0');
  const { items, subtotal, clearCart, catalogSubtotal, aperturaSavings, updateCartWithLiveProducts, removeItem, hasPackItems, getEffectiveItemTotal, getEffectivePrice } = useCart();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const { unlimitedStock } = useStoreSettings();
  const { settings: apertura, isActive: aperturaActive, discountPercent: aperturaPct } = useAperturaPromotion();

  const [form, setForm] = useState({
    name: '', rut: '', phone: '', email: '',
    region: '', comuna: '', address: '', additionalInfo: '',
  });
  const [customerNote, setCustomerNote] = useState('');
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [isGift, setIsGift] = useState(false);
  const [agencies, setAgencies] = useState<AgencyOption[]>(FALLBACK_AGENCIES);
  const [agency, setAgency] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'agencia'>('domicilio');

  // Live validation on mount
  const [isValidatingCart, setIsValidatingCart] = useState(true);
  useEffect(() => {
    if (items.length === 0) {
      setIsValidatingCart(false);
      return;
    }
    const validateCart = async () => {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const ids = items.map(i => i.product.$id);
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
          Query.equal('$id', ids),
          Query.limit(100)
        ]);
        
        const validDocs = res.documents as any[];
        const validIds = new Set(validDocs.map(d => d.$id));
        
        const deletedProducts = items.filter(it => !validIds.has(it.product.$id));
        if (deletedProducts.length > 0) {
          for (const dp of deletedProducts) {
            removeItem(dp.product.$id);
          }
          setError(`Algunos productos de tu carrito ya no están disponibles en la tienda y fueron removidos.`);
        }
        
        if (validDocs.length > 0) {
          updateCartWithLiveProducts(validDocs);
        }
      } catch (err) {
        console.error('Error live validating cart', err);
      } finally {
        setIsValidatingCart(false);
      }
    };
    validateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showingNewAddress, setShowingNewAddress] = useState(false);
  const submittedRef = useRef(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponDocId, setCouponDocId] = useState('');
  const [couponUserRestriction, setCouponUserRestriction] = useState<string | null>(null);
  const [publicCoupons, setPublicCoupons] = useState<any[]>([]);

  // Agency dropdown and modal state
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Geolocation state
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoSkipped, setGeoSkipped] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{lat: number, lng: number} | null>(null);
  const [geoError, setGeoError] = useState('');

  const comunas = form.region ? CHILE_REGIONES[form.region] || [] : [];
  const totalDiscount = discountParam + couponDiscount;
  const total = Math.max(0, subtotal - totalDiscount);
  const belowMinimum = isBelowMinimumOrder(total);

  useEffect(() => {
    if (items.length === 0 && !submittedRef.current) router.push('/carrito');
  }, [items, router]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace('/login?redirect=/checkout');
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    // Fetch agencies from API (managed in admin)
    (async () => {
      try {
        const res = await fetch('/api/agencies');
        const data = await res.json();
        if (data.agencies && data.agencies.length > 0) {
          setAgencies(data.agencies);
        }
      } catch {
        // Keep fallback agencies
      }
    })();
  }, []);

  // Fetch public coupons (using server SDK with API key to bypass read permissions)
  useEffect(() => {
    (async () => {
      try {
        // Fetch all coupons and filter client-side to avoid query syntax issues
        const res = await serverListDocuments(COUPONS_COLLECTION_ID, [JSON.stringify({ method: 'limit', values: [100] })]);
        const docs = (res.documents as any[]) || [];
        const active = docs.filter((c: any) => {
          const isActive = c.isActive ?? c.ISACTIVE ?? c.ACTIVE ?? true;
          if (!isActive) return false;
          const rawExpires = c.expiresAt || c.EXPIRESAT || c.endAt || c.ENDAT || null;
          if (rawExpires) {
            let expDate: Date | null = null;
            if (typeof rawExpires === 'number') {
              expDate = new Date(rawExpires < 1e12 ? rawExpires * 1000 : rawExpires);
            } else {
              expDate = new Date(rawExpires);
            }
            if (expDate && expDate < new Date()) return false;
          }
          const maxUses = c.maxUses || c.MAXUSES || 0;
          const usedCount = c.usedCount || c.USEDCOUNT || 0;
          if (maxUses && usedCount >= maxUses) return false;
          const code = (c.code || c.CODE || '').toUpperCase();
          if (!code) return false;
          return true;
        });
        setPublicCoupons(active);
      } catch (e) { console.error('Failed to fetch public coupons:', e); }
    })();
  }, []);

  useEffect(() => {
    if (couponApplied && couponUserRestriction && couponUserRestriction.trim().toLowerCase() !== 'null') {
      const restrictedVal = couponUserRestriction.trim().toLowerCase();
      const userEmail = user?.email?.trim().toLowerCase();
      const userId = user?.id?.trim().toLowerCase();
      const checkoutEmail = form.email?.trim().toLowerCase();

      const matchUser = (userId && userId === restrictedVal) || 
                        (userEmail && userEmail === restrictedVal) ||
                        (checkoutEmail && checkoutEmail === restrictedVal);

      if (!matchUser) {
        removeCoupon();
        setError('El cupón aplicado se removió porque no coincide con el correo o usuario ingresado');
      }
    }
  }, [form.email, user, couponApplied, couponUserRestriction]);

  useEffect(() => {
    // Load saved addresses from DB first, fallback to localStorage
    if (user?.id) {
      (async () => {
        try {
          const { databases } = getServices();
          const { databaseId } = getAppwriteConfig();
          const res = await databases.listDocuments(databaseId, ADDRESSES_COLLECTION_ID, [
            Query.equal('userId', user.id),
            Query.limit(100),
          ]);
          const dbAddrs: SavedAddress[] = res.documents.map((doc: any) => ({
            id: doc.$id,
            alias: doc.alias || 'Otro',
            name: doc.name || '',
            phone: doc.phone || '',
            fullAddress: doc.fullAddress || '',
            commune: doc.commune || '',
            region: doc.region || '',
            lat: doc.lat || 0,
            lng: doc.lng || 0,
          }));
          if (dbAddrs.length > 0) {
            setSavedAddresses(dbAddrs);
            setSelectedAddressId(dbAddrs[0].id);
            fillFormFromAddress(dbAddrs[0]);
            localStorage.setItem(`addr_${user.id}`, JSON.stringify(dbAddrs));
          } else {
            // Fallback to localStorage
            const stored = localStorage.getItem(`addr_${user.id}`);
            if (stored) {
              const addresses: SavedAddress[] = JSON.parse(stored);
              setSavedAddresses(addresses);
              if (addresses.length > 0) {
                setSelectedAddressId(addresses[0].id);
                fillFormFromAddress(addresses[0]);
              }
            }
          }
        } catch {
          // Fallback to localStorage on error
          try {
            const stored = localStorage.getItem(`addr_${user.id}`);
            if (stored) {
              const addresses: SavedAddress[] = JSON.parse(stored);
              setSavedAddresses(addresses);
              if (addresses.length > 0) {
                setSelectedAddressId(addresses[0].id);
                fillFormFromAddress(addresses[0]);
              }
            }
          } catch {}
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    // Load user data (name, email, phone, RUT) from user and prefs
    if (user) {
      (async () => {
        try {
          const { account } = getServices();
          const acc = await account.get();
          const prefs = (acc as any).prefs || {};
          setForm(f => ({
            ...f,
            name: f.name || user.name || '',
            email: f.email || user.email || '',
            phone: f.phone || prefs.phone || user.phone || '',
            rut: f.rut || prefs.rut || '',
            region: f.region || prefs.region || '',
            comuna: f.comuna || prefs.comuna || '',
            address: f.address || prefs.address || '',
          }));
        } catch {}
      })();
    }
  }, [user]);

  function fillFormFromAddress(addr: SavedAddress) {
    const isSucursalAddress = (addr.fullAddress || '').startsWith('[SUCURSAL]');
    const cleanAddress = isSucursalAddress
      ? addr.fullAddress.replace('[SUCURSAL]', '').trim()
      : addr.fullAddress;

    setDeliveryType(isSucursalAddress ? 'agencia' : 'domicilio');

    setForm(f => ({
      ...f,
      name: addr.name || f.name,
      phone: addr.phone || f.phone,
      region: addr.region || f.region,
      comuna: addr.commune || f.comuna,
      address: cleanAddress || f.address,
      additionalInfo: '',
    }));
  }

  function selectAddress(addr: SavedAddress) {
    setSelectedAddressId(addr.id);
    fillFormFromAddress(addr);
  }

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  function formatRut(val: string) {
    const clean = val.replace(/[^0-9kK]/g, '').toUpperCase();
    if (clean.length <= 1) return clean;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
  }

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      // Try lowercase 'code' first, then uppercase 'CODE'
      let res = await databases.listDocuments(databaseId, COUPONS_COLLECTION_ID, [
        Query.equal('code', code),
        Query.limit(1),
      ]);
      if (res.documents.length === 0) {
        try {
          res = await databases.listDocuments(databaseId, COUPONS_COLLECTION_ID, [
            Query.equal('CODE', code),
            Query.limit(1),
          ]);
        } catch {}
      }
      if (res.documents.length === 0) {
        setCouponError('Cupón no encontrado');
        setCouponLoading(false);
        return;
      }
      const coupon = res.documents[0] as any;

      // Validate active (try both lowercase and uppercase field names)
      const isActive = coupon.isActive ?? coupon.ISACTIVE ?? coupon.ACTIVE ?? true;
      if (!isActive) {
        setCouponError('Este cupón ya no está vigente');
        setCouponLoading(false);
        return;
      }
      // Validate expiry (try both lowercase and uppercase)
      // expiresAt can be epoch seconds (number) or ISO string
      const rawExpires = coupon.expiresAt || coupon.EXPIRESAT || coupon.endAt || coupon.ENDAT || null;
      let expiresAt: Date | null = null;
      if (rawExpires) {
        if (typeof rawExpires === 'number') {
          // epoch seconds — if < 1e12 it's seconds, otherwise milliseconds
          expiresAt = new Date(rawExpires < 1e12 ? rawExpires * 1000 : rawExpires);
        } else {
          expiresAt = new Date(rawExpires);
        }
      }
      if (expiresAt && expiresAt < new Date()) {
        setCouponError('Este cupón ha expirado');
        setCouponLoading(false);
        return;
      }
      // Validate max uses
      const maxUses = coupon.maxUses ?? coupon.MAXUSES ?? 0;
      const usedCount = coupon.usedCount ?? coupon.USEDCOUNT ?? 0;
      if (maxUses && usedCount >= maxUses) {
        setCouponError('Este cupón ha alcanzado su límite de usos');
        setCouponLoading(false);
        return;
      }
      // Validate min purchase
      const minOrderAmount = coupon.minPurchase ?? coupon.minOrderAmount ?? coupon.MINORDERAMOUNT ?? 0;
      if (minOrderAmount && subtotal < minOrderAmount) {
        setCouponError(`Compra mínima: ${formatPrice(minOrderAmount)}`);
        setCouponLoading(false);
        return;
      }

      // Validate user/email restriction
      const userRestriction = coupon.userRestriction || coupon.USERRESTRICTION || null;
      const hasRestriction = userRestriction && userRestriction.trim() !== '' && userRestriction.trim().toLowerCase() !== 'null';
      if (hasRestriction) {
        const restrictedVal = userRestriction.trim().toLowerCase();
        const userEmail = user?.email?.trim().toLowerCase();
        const userId = user?.id?.trim().toLowerCase();
        const checkoutEmail = form.email?.trim().toLowerCase();

        const matchUser = (userId && userId === restrictedVal) || 
                          (userEmail && userEmail === restrictedVal) ||
                          (checkoutEmail && checkoutEmail === restrictedVal);

        if (!matchUser) {
          setCouponError('Este cupón está restringido a otro usuario');
          setCouponLoading(false);
          return;
        }
      }

      // Calculate eligible subtotal for coupon (excluding active timed offer products)
      const now = Date.now();
      const eligibleSubtotal = items.reduce((acc, i) => {
        const isOfferActive = i.timedOfferPrice && i.timedOfferExpiresAt && now < i.timedOfferExpiresAt;
        if (isOfferActive) return acc;
        
        const pFeatures = Array.isArray(i.product.FEATURES) ? i.product.FEATURES.join('\n') : i.product.FEATURES || '';
        const isExact = /ExactWholesale:\s*true/i.test(pFeatures);
        const minQty = i.product.WHOLESALEMINQUANTITY || 0;
        const qtyMatches = isExact 
          ? i.quantity === minQty 
          : i.quantity >= minQty;

        const hasConfiguredWholesale = !!(i.product.WHOLESALEPRICE && i.product.WHOLESALEMINQUANTITY);
        const effectiveWholesale = (hasConfiguredWholesale && qtyMatches) ? i.product.WHOLESALEPRICE : (hasConfiguredWholesale ? undefined : i.wholesalePrice);
        const itemPrice = effectiveWholesale || resolveProductDisplayPrice(i.product, apertura).displayPrice;
        return acc + itemPrice * i.quantity;
      }, 0);

      // Calculate discount
      let discount = 0;
      const couponValue = coupon.value ?? coupon.discountValue ?? coupon.DISCOUNTVALUE ?? coupon.VALUE ?? 0;
      const couponType = coupon.type ?? coupon.discountType ?? coupon.DISCOUNTTYPE ?? coupon.TYPE ?? 'percent';
      if (couponType === 'percent' || couponType === 'percentage') {
        discount = Math.round(eligibleSubtotal * couponValue / 100);
        const maxDiscount = coupon.maxDiscount ?? coupon.MAXDISCOUNT ?? 0;
        if (maxDiscount && discount > maxDiscount) discount = maxDiscount;
      } else {
        discount = couponValue;
      }
      discount = Math.min(discount, eligibleSubtotal);

      setCouponDiscount(discount);
      setCouponApplied(code);
      setCouponDocId(coupon.$id);
      setCouponUserRestriction(userRestriction || null);
    } catch (err: any) {
      setCouponError('Error al validar cupón');
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCouponDiscount(0);
    setCouponApplied('');
    setCouponDocId('');
    setCouponCode('');
    setCouponError('');
    setCouponUserRestriction(null);
  }

  async function getNextOrderIndex(): Promise<number> {
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const { Query } = await import('appwrite');
      const res = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [Query.limit(1)]);
      return (res.total || 0) + 1;
    } catch {
      return Math.floor(Date.now() / 1000) % 100000;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.region || !form.comuna) { setError('Selecciona región y comuna'); return; }
    if (!form.name || !form.rut || !form.phone) { setError('Completa todos los campos obligatorios'); return; }
    if (belowMinimum) {
      setError(minimumOrderMessage(total));
      return;
    }
    
    if (!agency) {
      setShowAgencyModal(true);
      return;
    }

    setShowSummaryModal(true);
  }

  async function executeCheckout() {
    setShowSummaryModal(false);
    // Si no se ha decidido sobre geolocalización, mostrar modal
    if (!geoSkipped && !geoCoords) {
      setShowGeoModal(true);
      return;
    }

    if (hasPackItems) {
      createWholesaleRequest(geoCoords);
    } else {
      createOrder(geoCoords);
    }
  }

  async function createWholesaleRequest(coords: {lat: number, lng: number} | null) {
    setSubmitting(true); setError('');
    try {
      // Validate pack stock for wholesale items
      for (const item of items) {
        if (item.isPack && item.product.PACKQTY && item.product.PACKQTY > 1) {
          const packStock = item.product.PACK_STOCK ?? Math.floor((item.product.STOCK || 0) / item.product.PACKQTY);
          const requestedPacks = Math.ceil(item.quantity / item.product.PACKQTY);
          if (packStock < requestedPacks) {
            setError(`Stock insuficiente para "${item.product.NAME}". Solo hay ${packStock} paquete(s) disponible(s) y solicitaste ${requestedPacks}.`);
            setSubmitting(false);
            return;
          }
        }
      }

      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const now = Date.now();
      const reqCode = `WR-${String(now).slice(-8)}`;
      const itemsData = items.map(i => {
        const prod = i.product as any;
        const productSku = prod.SKU || getSkuFromFeatures(prod.FEATURES, prod.TAGS, prod.jumpseller_id, prod.SKU) || '';
        const productBarcode = prod.BARCODE || getBarcodeFromFeatures(prod.FEATURES, prod.BARCODE) || '';
        const total = getEffectiveItemTotal(i);
        const price = getEffectivePrice(i);
        return {
          id: prod.$id,
          name: prod.NAME,
          price,
          packQty: prod.PACKQTY || 1,
          qty: i.quantity,
          img: prod.IMAGEURL || '',
          total,
          isPack: i.isPack || false,
          sku: productSku,
          barcode: productBarcode
        };
      });
      const finalAddress = (agency !== 'RETIRO EN TIENDA' && deliveryType === 'agencia' && !form.address.startsWith('[SUCURSAL]'))
        ? `[SUCURSAL] ${form.address}` : form.address;
      const additionalInfoWithGeo = coords
        ? `${form.additionalInfo ? form.additionalInfo + '\n' : ''}[GEO:${coords.lat},${coords.lng}]`
        : form.additionalInfo;
      const docId = await databases.createDocument(databaseId, WHOLESALE_ORDERS_COLLECTION_ID, ID.unique(), {
        USERID: user?.id || 'guest',
        ITEMS: JSON.stringify(itemsData),
        CUSTOMERNAME: form.name,
        CUSTOMERRUT: form.rut,
        CUSTOMERPHONE: form.phone,
        CUSTOMEREMAIL: form.email,
        REGION: form.region,
        COMUNA: form.comuna,
        ADDRESS: finalAddress,
        ADDITIONALINFO: additionalInfoWithGeo,
        SHIPPINGAGENCY: agency,
        SUBTOTAL: subtotal,
        TOTAL: subtotal,
        REQCODE: reqCode,
        STATUS: 'pending_stock',
        CREATEDAT: now,
        ...(customerNote.trim() ? { CUSTOMERNOTE: customerNote.trim() } : {}),
      });
      submittedRef.current = true;
      clearCart();
      router.push(`/pedido-mayorista-confirmado?id=${docId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar pedido mayorista');
    } finally { setSubmitting(false); }
  }

  const handleGeolocate = () => {
    setIsGeolocating(true);
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización.');
      setIsGeolocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGeoCoords(coords);
        setIsGeolocating(false);
        setShowGeoModal(false);
        setGeoSkipped(false);
        if (hasPackItems) {
          createWholesaleRequest(coords);
        } else {
          createOrder(coords);
        }
      },
      (err) => {
        setGeoError('No se pudo obtener tu ubicación automáticamente: ' + err.message);
        setIsGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSkipGeo = () => {
    setGeoSkipped(true);
    setShowGeoModal(false);
    if (hasPackItems) {
      createWholesaleRequest(null);
    } else {
      createOrder(null);
    }
  };

  async function createOrder(coords: {lat: number, lng: number} | null) {
    setSubmitting(true); setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const orderIndex = await getNextOrderIndex();
      const orderCode = `ORD-${String(orderIndex).padStart(5, '0')}`;
      const now = Date.now();
      const expiresAt = now + 3 * 60 * 60 * 1000;
      const itemsData = items.map(i => {
        const total = getEffectiveItemTotal(i);
        const price = getEffectivePrice(i);
        const originalPrice = i.product.PRICE !== price ? i.product.PRICE : null;
        const note = itemNotes[i.product.$id] || '';
        return { 
          id: i.product.$id, 
          name: i.product.NAME, 
          price, 
          originalPrice, 
          qty: i.quantity, 
          img: resolveStorageImageUrl(i.product.IMAGEURL), 
          total,
          ...(note.trim() ? { note: note.trim() } : {})
        };
      });

      // ── Carga de documentos en lote para validación y descuento ──
      const allProductDocs: Record<string, any> = {};
      const productIds = items.map(it => it.product.$id);
      
      try {
        for (let i = 0; i < productIds.length; i += 100) {
          const chunk = productIds.slice(i, i + 100);
          const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
            Query.equal('$id', chunk),
            Query.limit(100)
          ]);
          for (const doc of res.documents) {
            allProductDocs[doc.$id] = doc;
          }
        }
      } catch (err: any) {
        setError('Error al consultar disponibilidad de productos. Intenta de nuevo.');
        setSubmitting(false);
        return;
      }

      // ── Validación de stock antes de crear pedido (evita oversell) ──
      // Regla: STOCK = 99999 = sentinel de "ilimitado", nunca se valida ni descuenta.
      // Si el admin puso un stock real (< 99999), siempre se valida y descuenta,
      // incluso en modo unlimitedStock de la tienda.
      for (const it of items) {
        const productDoc = allProductDocs[it.product.$id];
        if (!productDoc) {
          setError(`El producto "${it.product.NAME}" ya no está disponible en la tienda. Por favor, elimínalo de tu carrito para continuar.`);
          setSubmitting(false);
          return;
        }
        
        const currentStock = Number(productDoc.STOCK ?? 0);
        // Producto con stock ilimitado (sentinel 99999) → no validar
        if (currentStock === 99999) {
          continue;
        }
        // Producto con stock real asignado → validar aunque sea modo sin-stock
        if (currentStock < it.quantity) {
          setError(`Stock insuficiente para "${productDoc.NAME || it.product.NAME}". Disponible: ${currentStock}, necesitas: ${it.quantity}.`);
          setSubmitting(false);
          return;
        }
      }

      const finalAddress = (agency !== 'RETIRO EN TIENDA' && deliveryType === 'agencia' && !form.address.startsWith('[SUCURSAL]'))
        ? `[SUCURSAL] ${form.address}`
        : form.address;
      const additionalInfoWithGeo = coords 
        ? `${form.additionalInfo ? form.additionalInfo + '\\n' : ''}[GEO:${coords.lat},${coords.lng}]`
        : form.additionalInfo;

      const docId = await databases.createDocument(databaseId, ORDERS_COLLECTION_ID, ID.unique(), {
        USERID: user?.id || 'guest', ITEMS: JSON.stringify(itemsData),
        CUSTOMERNAME: form.name, CUSTOMERRUT: form.rut, CUSTOMERPHONE: form.phone, CUSTOMEREMAIL: form.email,
        REGION: form.region, COMUNA: form.comuna, ADDRESS: finalAddress, ADDITIONALINFO: additionalInfoWithGeo,
        PAYMENTMETHOD: 'Transferencia Bancaria', SHIPPINGAGENCY: agency,
        SUBTOTAL: subtotal, SHIPPINGCOST: 0, TOTAL: total,
        ORDERCODE: orderCode, ORDERINDEX: orderIndex,
        STATUS: 'pending', CREATEDAT: now,
        ...(customerNote.trim() ? { CUSTOMERNOTE: customerNote.trim() } : {}),
        ...(isGift ? { ISGIFT: true } : {}),
      });
      submittedRef.current = true;
      const orderId = (docId as unknown as { $id: string }).$id;

      // Notify admin about new order
      notifyNewOrder(orderCode, form.name, total, items.length).catch(() => {});

      // ── Descontar stock reservado (con rollback si falla) ──
      // Solo se descuenta si el producto tiene stock real asignado (< 99999).
      // STOCK = 99999 = sentinel de ilimitado, se salta el descuento siempre.
      const stockRollback: { productId: string; prevStock: number }[] = [];
      try {
        for (const item of items) {
          const productDoc = allProductDocs[item.product.$id];
          if (!productDoc) {
             throw new Error(`El producto "${item.product.NAME}" ya no está disponible en la tienda.`);
          }
          const currentStock = Number(productDoc.STOCK ?? 0);
          
          // Stock ilimitado → no descontar
          if (currentStock === 99999) {
            continue;
          }
          // Stock real → siempre descontar (incluso en modo unlimitedStock de la tienda)
          if (currentStock < item.quantity) {
            throw new Error(`Stock insuficiente para "${productDoc.NAME || item.product.NAME}". Disponible: ${currentStock}, necesitas: ${item.quantity}.`);
          }
          stockRollback.push({ productId: item.product.$id, prevStock: currentStock });
          await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, item.product.$id, { STOCK: currentStock - item.quantity });
        }
      } catch (err: any) {
        // Revertir stock ya descontado
        for (const r of stockRollback) {
          try { await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, r.productId, { STOCK: r.prevStock }); } catch {}
        }
        // Cancelar el pedido recién creado para no dejar reserva fantasma
        try {
          await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, { STATUS: 'cancelled', UPDATEDAT: Date.now() });
        } catch {}
        throw err;
      }

      // Mark coupon as used (increment counter and deactivate)
      if (couponDocId) {
        try {
          const couponDoc = await databases.getDocument(databaseId, COUPONS_COLLECTION_ID, couponDocId);
          const currentCount = (couponDoc as any).usedCount ?? (couponDoc as any).USEDCOUNT ?? 0;
          await databases.updateDocument(databaseId, COUPONS_COLLECTION_ID, couponDocId, {
            isActive: false,
            ISACTIVE: false,
            usedCount: currentCount + 1,
            USEDCOUNT: currentCount + 1,
          });
        } catch {}
      }
      
      // Save RUT and phone to user prefs for future purchases
      if (user && (form.rut || form.phone)) {
        try {
          const { account } = getServices();
          const acc = await account.get();
          const currentPrefs = (acc as any).prefs || {};
          const updatedPrefs: any = { ...currentPrefs };
          if (form.rut) updatedPrefs.rut = form.rut;
          if (form.phone) updatedPrefs.phone = form.phone;
          if (form.region) updatedPrefs.region = form.region;
          if (form.comuna) updatedPrefs.comuna = form.comuna;
          if (form.address) updatedPrefs.address = form.address;
          await account.updatePrefs(updatedPrefs);
        } catch (prefError) {
          console.log('Error saving user prefs:', prefError);
        }
      }
      
      // Save address to addresses collection for future purchases
      if (user && form.region && form.comuna && form.address) {
        try {
          const { databases } = getServices();
          const { databaseId } = getAppwriteConfig();
          // Check if this address already exists for the user
          const existing = await databases.listDocuments(databaseId, ADDRESSES_COLLECTION_ID, [
            Query.equal('userId', user.id),
            Query.equal('fullAddress', finalAddress),
            Query.equal('commune', form.comuna),
            Query.limit(1),
          ]);
          if (existing.documents.length === 0) {
            await databases.createDocument(databaseId, ADDRESSES_COLLECTION_ID, ID.unique(), {
              userId: user.id,
              alias: (agency !== 'RETIRO EN TIENDA' && deliveryType === 'agencia') ? 'Sucursal' : 'Otro',
              name: form.name,
              phone: form.phone,
              fullAddress: finalAddress,
              commune: form.comuna,
              region: form.region,
              lat: 0,
              lng: 0,
            });
          }
        } catch (addrError) {
          console.log('Error saving address:', addrError);
        }
      }
      
      clearCart();
      router.push(`/pedido-confirmado?id=${orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear pedido');
    } finally { setSubmitting(false); }
  }

  const totalItems = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <>
      <style>{`
        @keyframes ckBtnShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ckOrbFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.9; }
          50% { transform: translateY(-22px) translateX(8px) scale(1.4); opacity: 1; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-44px) translateX(-4px) scale(0.6); opacity: 0; }
        }
        @keyframes ckSparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          20% { transform: scale(1.2) rotate(90deg); opacity: 1; }
          50% { transform: scale(0.8) rotate(180deg); opacity: 0.8; }
          80% { transform: scale(1.1) rotate(270deg); opacity: 0.5; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes ckTrail {
          0% { transform: translateX(0) scaleX(1); opacity: 0.8; }
          50% { transform: translateX(20px) scaleX(1.5); opacity: 0.4; }
          100% { transform: translateX(40px) scaleX(0); opacity: 0; }
        }
        @keyframes ckPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(227,150,191,0.3), inset 0 0 12px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 20px rgba(227,150,191,0.5), inset 0 0 20px rgba(255,255,255,0.2); }
        }
        @keyframes ckShimmer {
          0% { left: -40%; }
          100% { left: 110%; }
        }
        .ck-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.1));
          box-shadow: 0 0 6px rgba(255,255,255,0.5);
          animation: ckOrbFloat 2.8s ease-in-out infinite;
        }
        .ck-orb:nth-child(1) { width: 8px; height: 8px; left: 8%; bottom: 4px; animation-delay: 0s; }
        .ck-orb:nth-child(2) { width: 5px; height: 5px; left: 22%; bottom: 2px; animation-delay: 0.4s; }
        .ck-orb:nth-child(3) { width: 10px; height: 10px; left: 38%; bottom: 6px; animation-delay: 0.8s; }
        .ck-orb:nth-child(4) { width: 6px; height: 6px; left: 52%; bottom: 3px; animation-delay: 1.2s; }
        .ck-orb:nth-child(5) { width: 7px; height: 7px; left: 68%; bottom: 5px; animation-delay: 1.6s; }
        .ck-orb:nth-child(6) { width: 4px; height: 4px; left: 82%; bottom: 2px; animation-delay: 2s; }
        .ck-orb:nth-child(7) { width: 9px; height: 9px; left: 92%; bottom: 4px; animation-delay: 2.4s; }
        .ck-sparkle {
          position: absolute;
          width: 4px; height: 4px;
          background: white;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: ckSparkle 2s ease-in-out infinite;
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
        }
        .ck-sparkle:nth-child(8) { left: 15%; top: 30%; animation-delay: 0s; }
        .ck-sparkle:nth-child(9) { left: 45%; top: 20%; animation-delay: 0.7s; width: 5px; height: 5px; }
        .ck-sparkle:nth-child(10) { left: 75%; top: 40%; animation-delay: 1.4s; }
        .ck-sparkle:nth-child(11) { left: 30%; top: 55%; animation-delay: 0.3s; width: 3px; height: 3px; }
        .ck-sparkle:nth-child(12) { left: 60%; top: 15%; animation-delay: 1s; }
        .ck-trail {
          position: absolute;
          height: 2px;
          width: 20px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: ckTrail 2.5s ease-in-out infinite;
        }
        .ck-trail:nth-child(13) { left: 5%; top: 45%; animation-delay: 0s; }
        .ck-trail:nth-child(14) { left: 35%; top: 35%; animation-delay: 0.8s; }
        .ck-trail:nth-child(15) { left: 65%; top: 50%; animation-delay: 1.6s; }
        @keyframes ckPulseWholesale {
          0%, 100% { box-shadow: 0 0 8px rgba(92,61,36,0.15), inset 0 0 12px rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 20px rgba(92,61,36,0.3), inset 0 0 20px rgba(255,255,255,0.3); }
        }
        .ck-confirm-btn {
          animation: ckBtnShift 3s ease infinite, ckPulse 2s ease-in-out infinite;
        }
        .ck-confirm-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 32px rgba(227,150,191,0.35), inset 0 0 20px rgba(255,255,255,0.15); }
        .ck-confirm-btn-wholesale {
          animation: ckBtnShift 3s ease infinite, ckPulseWholesale 2s ease-in-out infinite;
        }
        .ck-confirm-btn-wholesale:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 32px rgba(92,61,36,0.25), inset 0 0 20px rgba(255,255,255,0.2); }
        .ck-shimmer-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: ckShimmer 2.5s ease-in-out infinite;
          pointer-events: none;
        }
        .ck-modal-agency-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (max-width: 800px) {
          .ck-page { padding: 12px 12px calc(76px + env(safe-area-inset-bottom, 0px)) !important; }
          .ck-layout { flex-direction: column !important; gap: 12px !important; }
          .ck-main { min-width: 0 !important; width: 100% !important; }
          .ck-sidebar { width: 100% !important; position: static !important; order: -1; }
          .ck-card { padding: 16px 14px !important; border-radius: 16px !important; }
          .ck-card h2 { font-size: 15px !important; }
          .ck-agency-grid { grid-template-columns: 1fr !important; }
          .ck-form-grid { grid-template-columns: 1fr !important; }
          .ck-form-grid > div { grid-column: 1 / -1 !important; }
          .ck-summary-items { max-height: 180px !important; padding: 12px 14px !important; }
          .ck-breadcrumb { font-size: 12px !important; margin-bottom: 12px !important; flex-wrap: wrap; }
          
          /* Grid de agencias en modal (de 2 en 2 en mobiles) */
          .ck-modal-agency-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .ck-agency-card {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 14px 10px !important;
            gap: 10px !important;
          }
          .ck-agency-chevron {
            display: none !important;
          }
          .ck-agency-logo-wrapper {
            width: 48px !important;
            height: 48px !important;
            margin-bottom: 2px;
          }
          .ck-agency-name {
            font-size: 13px !important;
          }
          .ck-agency-desc {
            font-size: 10px !important;
            line-height: 1.2;
          }
        }
        .ck-input-placeholder::placeholder { color: #6b7280; opacity: 1; }
        .ck-textarea-placeholder::placeholder { color: #6b7280; opacity: 1; }
      `}</style>
    <div className="ck-page" style={{ minHeight: '100vh', padding: '24px 4%', fontFamily: FF, position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <img src="https://img.magnific.com/free-vector/monochrome-realistic-liquid-effect-background_474888-7306.jpg?semt=ais_hybrid&w=740&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px) brightness(1.1) saturate(0.4)', transform: 'scale(1.1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 10%,rgba(227,150,191,0.12),transparent 32%), linear-gradient(180deg,rgba(255,245,248,0.82) 0%,rgba(255,255,255,0.92) 100%)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div className="ck-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 16 }}>
          <Link href="/" style={{ color: PINK, textDecoration: 'none', fontWeight: 600 }}>Inicio</Link>
          <ChevronRight size={12} color={PINK_LIGHT} />
          <Link href="/carrito" style={{ color: PINK, textDecoration: 'none', fontWeight: 600 }}>Carrito</Link>
          <ChevronRight size={12} color={PINK_LIGHT} />
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>Finalizar compra</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* ── LEFT ── */}
            <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Shipping agencies */}
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: '22px 24px', border: '1px solid #fce7f3', boxShadow: '0 8px 28px rgba(227,150,191,0.08)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 50 }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 10, fontFamily: FF }}>
                  <span style={{ width: 28, height: 28, borderRadius: 10, background: `linear-gradient(135deg, ${PINK}, ${PINK_LIGHT})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>1</span>
                  Agencia de envío
                </h2>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <button type="button" onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                    style={{ width: '100%', padding: '14px 16px', border: `2px solid ${agency ? PINK : '#fce7f3'}`, borderRadius: 14, background: agency ? PINK_BG : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 10, boxShadow: agency ? '0 4px 14px rgba(227,150,191,0.1)' : 'none' }}>
                    {agency ? (() => {
                      const ag = agencies.find((a: AgencyOption) => a.name === agency);
                      return ag ? (
                        <>
                          <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ag.bg, borderRadius: 10, flexShrink: 0, overflow: 'hidden' }}>
                            {ag.logo ? <img src={ag.logo} alt={ag.name} style={{ width: 28, height: 28, objectFit: 'contain' }} /> : <Truck size={16} color={ag.color} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: ag.color }}>{ag.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#888' }}>{ag.desc}</p>
                          </div>
                        </>
                      ) : null;
                    })() : (
                      <span style={{ color: '#9ca3af', fontSize: 14 }}>Selecciona agencia de envío</span>
                    )}
                    <ChevronDown size={16} color="#999" style={{ marginLeft: 'auto', transition: 'transform .2s', transform: agencyDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>
                  {agencyDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, background: '#fff', borderRadius: 14, border: '1px solid #fce7f3', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', maxHeight: 280, overflowY: 'auto' }}>
                      {agencies.map((ag: AgencyOption) => {
                        const sel = agency === ag.name;
                        return (
                          <button type="button" key={ag.name} onClick={() => { setAgency(ag.name); setAgencyDropdownOpen(false); if (ag.name === 'RETIRO EN TIENDA') { setForm(f => ({ ...f, region: 'Región Metropolitana', comuna: 'Santiago', address: 'Toesca 2537, Santiago Centro, Chile' })); setSelectedAddressId(null); setShowingNewAddress(true); } }}
                            style={{ width: '100%', padding: '12px 16px', border: 'none', background: sel ? PINK_BG : 'transparent', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #fdf2f8', transition: 'background .15s' }}
                            onMouseEnter={e => { if (!sel) e.currentTarget.style.background = '#fefcfe'; }}
                            onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}>
                            <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ag.bg, borderRadius: 9, flexShrink: 0, overflow: 'hidden' }}>
                              {ag.logo ? <img src={ag.logo} alt={ag.name} style={{ width: 26, height: 26, objectFit: 'contain' }} /> : <Truck size={15} color={ag.color} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: sel ? ag.color : '#333' }}>{ag.name}</p>
                              <p style={{ margin: '1px 0 0', fontSize: 11, color: '#888' }}>{ag.desc}</p>
                            </div>
                            {sel && <span style={{ width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg, ${PINK}, #c0547a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p style={{ margin: '12px 0 0', fontSize: 12, color: '#00a650', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <RefreshCw size={12} /> El costo de envío se coordina con el vendedor tras confirmar el pedido.
                </p>
              </div>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && !showingNewAddress && (
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: '22px 24px', border: '1px solid #fce7f3', boxShadow: '0 8px 28px rgba(227,150,191,0.08)', backdropFilter: 'blur(10px)' }}>
                  <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 10, fontFamily: FF }}>
                    <span style={{ width: 28, height: 28, borderRadius: 10, background: `linear-gradient(135deg, ${PINK}, ${PINK_LIGHT})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>2</span>
                    Dirección de envío
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginBottom: 12 }}>
                    {savedAddresses.map((addr) => {
                      const sel = selectedAddressId === addr.id;
                      const aliasIcon = addr.alias === 'Casa' ? '🏠' : addr.alias === 'Trabajo' ? '💼' : '📍';
                      return (
                        <button type="button" key={addr.id} onClick={() => selectAddress(addr)}
                          style={{ padding: '14px 16px', border: `2px solid ${sel ? PINK : '#fce7f3'}`, borderRadius: 14, background: sel ? PINK_BG : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', position: 'relative', boxShadow: sel ? '0 4px 14px rgba(227,150,191,0.15)' : 'none' }}>
                          {sel && <span style={{ position: 'absolute', top: 8, right: 10, width: 18, height: 18, borderRadius: '50%', background: `linear-gradient(135deg, ${PINK}, #c0547a)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          </span>}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <span style={{ fontSize: 16 }}>{aliasIcon}</span>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: sel ? PINK : '#333' }}>{addr.alias}</p>
                          </div>
                          <p style={{ margin: '0 0 3px', fontSize: 12, color: '#555', lineHeight: 1.3 }}>{addr.fullAddress}</p>
                          <p style={{ margin: 0, fontSize: 11, color: '#888' }}>{addr.commune}{addr.region ? `, ${addr.region}` : ''}</p>
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => { setShowingNewAddress(true); setSelectedAddressId(null); setDeliveryType('domicilio'); setForm({ name: '', rut: '', phone: '', email: '', region: '', comuna: '', address: '', additionalInfo: '' }); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', border: '1.5px dashed #f5a8cf', borderRadius: 12, color: PINK, fontSize: 13, fontWeight: 600, background: PINK_BG, transition: 'all .15s', cursor: 'pointer', fontFamily: FF }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fce7f3'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = PINK_BG; }}>
                    <Plus size={14} /> Agregar nueva dirección
                  </button>
                </div>
              )}

              {/* Personal data */}
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: '22px 24px', border: '1px solid #fce7f3', boxShadow: '0 8px 28px rgba(227,150,191,0.08)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1 }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 10, fontFamily: FF }}>
                  <span style={{ width: 28, height: 28, borderRadius: 10, background: `linear-gradient(135deg, ${PINK}, ${PINK_LIGHT})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>3</span>
                  Datos personales
                </h2>
                <div style={{ margin: '0 0 14px', padding: '8px 12px', borderRadius: 10, background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#3b82f6', fontFamily: FF, fontWeight: 600 }}>
                  <Shield size={13} /> Estos datos quedarán guardados en tu cuenta y no necesitarás volver a ingresarlos
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={label}>Nombre completo *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Juan Pérez" style={inp}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={label}>RUT *</label>
                    <input required value={form.rut} onChange={e => set('rut', formatRut(e.target.value))} placeholder="12.345.678-9" maxLength={12} style={inp}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={label}>Teléfono *</label>
                    <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+56 9 1234 5678" style={inp}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={label}>Email (para notificaciones)</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="juan@email.com" style={inp}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </div>
              </div>

              {/* Shipping address - only show if no saved addresses OR user is adding new */}
              {(savedAddresses.length === 0 || showingNewAddress) && (
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: '22px 24px', border: '1px solid #fce7f3', boxShadow: '0 8px 28px rgba(227,150,191,0.08)', backdropFilter: 'blur(10px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 10, fontFamily: FF }}>
                      <span style={{ width: 28, height: 28, borderRadius: 10, background: `linear-gradient(135deg, ${PINK}, #c0547a)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>4</span>
                      Dirección de envío
                    </h2>
                    {showingNewAddress && savedAddresses.length > 0 && (
                      <button type="button" onClick={() => { setShowingNewAddress(false); if (savedAddresses.length > 0) { setSelectedAddressId(savedAddresses[0].id); fillFormFromAddress(savedAddresses[0]); } }}
                        style={{ padding: '6px 12px', border: '1.5px solid #fce7f3', borderRadius: 10, color: PINK, background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', fontFamily: FF }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = PINK_BG; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}>
                        ← Usar dirección guardada
                      </button>
                    )}
                  </div>

                  {agency !== 'RETIRO EN TIENDA' && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={label}>Tipo de entrega *</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => setDeliveryType('domicilio')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: `2px solid ${deliveryType === 'domicilio' ? PINK : '#fce7f3'}`,
                            borderRadius: 12,
                            background: deliveryType === 'domicilio' ? PINK_BG : '#fff',
                            color: deliveryType === 'domicilio' ? PINK : '#6b7280',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                            fontFamily: FF
                          }}
                        >
                          🏠 Despacho a Domicilio
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryType('agencia')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: `2px solid ${deliveryType === 'agencia' ? PINK : '#fce7f3'}`,
                            borderRadius: 12,
                            background: deliveryType === 'agencia' ? PINK_BG : '#fff',
                            color: deliveryType === 'agencia' ? PINK : '#6b7280',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                            fontFamily: FF
                          }}
                        >
                          🏢 Retiro en Sucursal / Agencia
                        </button>
                      </div>
                    </div>
                  )}
                  <div style={{ margin: '0 0 14px', padding: '8px 12px', borderRadius: 10, background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#3b82f6', fontFamily: FF, fontWeight: 600 }}>
                    <MapPin size={13} /> Esta dirección quedará guardada en tu cuenta para futuros pedidos
                  </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <label style={label}>Región *</label>
                    <select required value={form.region} onChange={e => { set('region', e.target.value); set('comuna', ''); }}
                      style={selectStyle}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }} >
                      <option value="" style={optionStyle}>Selecciona región</option>
                      {Object.keys(CHILE_REGIONES).map(r => <option key={r} value={r} style={optionStyle}>{r}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, bottom: 12, color: '#999', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <label style={label}>Comuna *</label>
                    <select required value={form.comuna} onChange={e => set('comuna', e.target.value)} disabled={!form.region}
                      style={{ ...selectStyle, opacity: form.region ? 1 : 0.5 }}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }}>
                      <option value="" style={optionStyle}>Selecciona comuna</option>
                      {comunas.map(c => <option key={c} value={c} style={optionStyle}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, bottom: 12, color: '#999', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={label}>
                      {agency !== 'RETIRO EN TIENDA' && deliveryType === 'agencia' ? 'Sucursal o Agencia de Destino *' : 'Dirección Particular *'}
                    </label>
                    <input required value={form.address} onChange={e => set('address', e.target.value)}
                      placeholder={agency !== 'RETIRO EN TIENDA' && deliveryType === 'agencia' ? 'Ej: Starken Sucursal Padre Las Casas (o dirección de la sucursal)' : 'Calle, número, departamento/casa'}
                      style={inp}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }} />
                    {agency !== 'RETIRO EN TIENDA' && deliveryType === 'agencia' && (
                      <p style={{ margin: '6px 0 0', fontSize: 11, color: '#e06b9b', fontWeight: 600, fontFamily: FF }}>
                        ⚠️ Indica claramente el nombre o dirección de la sucursal de destino. No ingreses tu dirección particular aquí para evitar confusiones de despacho.
                      </p>
                    )}
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={label}>Información adicional (opcional)</label>
                    <textarea value={form.additionalInfo} onChange={e => set('additionalInfo', e.target.value)}
                      placeholder="Referencias, instrucciones para la entrega..." rows={2}
                      style={{ ...inp, resize: 'none', fontFamily: FF }}
                      onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#fce7f3'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </div>
                </div>
              )}

            </div>

            {/* ── RIGHT: order summary ── */}
            <div className="ck-sidebar" style={{ width: 340, flexShrink: 0, position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Summary card */}
              <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 22, border: '1px solid #fce7f3', boxShadow: '0 12px 40px rgba(227,150,191,0.1)', backdropFilter: 'blur(14px)', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', padding: '18px 22px 14px', borderBottom: '1px solid #fce7f3' }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111', fontFamily: FF, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 10, background: `linear-gradient(135deg, ${PINK}, #c0547a)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={14} color="#fff" />
                    </span>
                    Resumen de compra
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9ca3af', fontFamily: FF }}>{totalItems} producto{totalItems !== 1 ? 's' : ''} en tu pedido</p>
                </div>

                {/* Items */}
                <div style={{ padding: '14px 22px', maxHeight: 360, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map((item, idx) => {
                      const pricing = resolveProductDisplayPrice(item.product, apertura);
                      const price = pricing.displayPrice;
                      return (
                        <div key={`${item.product.$id}-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px', borderRadius: 12, background: '#fefcfe', border: '1px solid #fdf2f8', transition: 'all .15s' }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: 48, height: 48, background: 'linear-gradient(135deg, #fdf2f8, #fff)', borderRadius: 12, overflow: 'visible', flexShrink: 0, border: '1px solid #fce7f3' }}>
                              {item.product.IMAGEURL
                                ? <img src={resolveStorageImageUrl(item.product.IMAGEURL)} alt={item.product.NAME} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', padding: 2 }} />
                                : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</span>}
                              <span style={{ position: 'absolute', top: -3, right: -3, background: `linear-gradient(135deg, ${PINK}, #c0547a)`, color: '#fff', fontSize: 8, fontWeight: 800, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(227,150,191,0.3)' }}>{item.quantity}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 12, color: '#374151', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: FF, fontWeight: 500 }}>{item.product.NAME}</p>
                              {pricing.fromApertura && (
                                <span style={{ fontSize: 9, fontWeight: 700, color: '#be185d', background: '#fdf2f8', padding: '2px 6px', borderRadius: 6, marginTop: 4, display: 'inline-block' }}>Promo apertura</span>
                              )}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              {pricing.hasDiscount && pricing.originalPrice != null && (
                                <p style={{ margin: '0 0 2px', fontSize: 10, color: '#9ca3af', textDecoration: 'line-through', fontFamily: FF }}>{formatPrice(pricing.originalPrice * item.quantity)}</p>
                              )}
                              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: pricing.fromApertura ? '#e396bf' : '#111', fontFamily: FF }}>{formatPrice(price * item.quantity)}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <input 
                              type="text" 
                              placeholder="Nota: Ej. color azul, talla, etc."
                              value={itemNotes[item.product.$id] || ''}
                              onChange={(e) => setItemNotes(prev => ({ ...prev, [item.product.$id]: e.target.value }))}
                              style={{ 
                                width: '100%', 
                                padding: '6px 10px', 
                                fontSize: 11, 
                                border: '1.5px solid #fce7f3', 
                                borderRadius: 8, 
                                outline: 'none',
                                background: '#fff',
                                color: '#111'
                              }}
                              className="ck-input-placeholder"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Totals */}
                <div style={{ padding: '0 22px 14px' }}>
                  <div style={{ borderTop: '1px dashed #fce7f3', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#6b7280', fontFamily: FF }}>Subtotal</span>
                      <span style={{ color: '#374151', fontWeight: 600, fontFamily: FF }}>{formatPrice(subtotal)}</span>
                    </div>
                    {aperturaSavings > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#be185d', fontFamily: FF }}>Promoción de apertura (-{aperturaPct}%)</span>
                        <span style={{ color: '#be185d', fontWeight: 700, fontFamily: FF }}>-{formatPrice(aperturaSavings)}</span>
                      </div>
                    )}
                    {discountParam > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#00a650', fontFamily: FF }}>Descuento</span>
                        <span style={{ color: '#00a650', fontWeight: 700, fontFamily: FF }}>-{formatPrice(discountParam)}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#00a650', display: 'flex', alignItems: 'center', gap: 4, fontFamily: FF }}>
                          🎟 {couponApplied}
                          <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#f5a8cf', cursor: 'pointer', fontSize: 10, textDecoration: 'underline', padding: 0, fontFamily: FF }}>quitar</button>
                        </span>
                        <span style={{ color: '#00a650', fontWeight: 700, fontFamily: FF }}>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#9ca3af', fontFamily: FF }}>Envío</span>
                      <span style={{ color: '#00a650', fontWeight: 600, fontSize: 11, fontFamily: FF }}>A coordinar</span>
                    </div>
                  </div>
                </div>

                {/* Total highlight */}
                <div style={{ margin: '0 22px 16px', padding: '12px 16px', borderRadius: 14, background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', border: `1px solid ${belowMinimum ? '#fca5a5' : '#fbcfe8'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111', fontFamily: FF }}>Total a pagar</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: belowMinimum ? '#dc2626' : PINK, fontFamily: FF, letterSpacing: '-0.03em' }}>{formatPrice(total)}</span>
                </div>
                {belowMinimum && (
                  <p style={{ margin: '0 22px 12px', fontSize: 12, color: '#b91c1c', background: '#fef2f2', padding: '10px 12px', borderRadius: 10, border: '1px solid #fecaca', fontFamily: FF, lineHeight: 1.45 }}>
                    ⚠ {minimumOrderMessage(total)}
                  </p>
                )}

                {/* Coupon */}
                {!couponApplied && (
                  <div style={{ padding: '0 22px 16px' }}>
                    <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#6b7280', fontFamily: FF, textTransform: 'uppercase', letterSpacing: '0.05em' }}>¿Tenés un cupón?</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
                        className="ck-input-placeholder"
                        style={{ flex: 1, padding: '10px 12px', border: `1.5px solid ${couponError ? '#fca5a5' : '#e5e7eb'}`, borderRadius: 10, fontSize: 13, outline: 'none', color: '#111', background: '#f9fafb', textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: FF, fontWeight: 600 }}
                        onFocus={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.08)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = couponError ? '#fca5a5' : '#e5e7eb'; e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        style={{ padding: '10px 18px', background: couponCode.trim() ? `linear-gradient(135deg, ${PINK}, #c0547a)` : '#e5e7eb', color: couponCode.trim() ? '#fff' : '#9ca3af', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: couponCode.trim() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', opacity: couponLoading ? 0.6 : 1, fontFamily: FF, transition: 'all .2s', boxShadow: couponCode.trim() ? '0 4px 12px rgba(227,150,191,0.2)' : 'none' }}
                      >
                        {couponLoading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {couponError && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#ef4444', fontFamily: FF }}>⚠ {couponError}</p>}
                    {(() => {
                      const filtered = publicCoupons.filter((c: any) => {
                        const userRestriction = c.userRestriction || c.USERRESTRICTION || null;
                        if (!userRestriction || userRestriction.trim() === '' || userRestriction.trim().toLowerCase() === 'null') return true;
                        const val = userRestriction.trim().toLowerCase();
                        return (
                          (user?.id && user.id.toLowerCase() === val) ||
                          (user?.email && user.email.toLowerCase() === val) ||
                          (form.email && form.email.toLowerCase() === val)
                        );
                      });
                      if (filtered.length === 0) return null;
                      return (
                        <div style={{ marginTop: 8 }}>
                          <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#9ca3af', fontFamily: FF, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cupones disponibles</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {filtered.map((c: any) => {
                              const code = (c.code || c.CODE || '').toUpperCase();
                              if (!code) return null;
                              const discType = c.type ?? c.DISCOUNTTYPE ?? c.TYPE ?? 'percent';
                              const discVal = c.value ?? c.DISCOUNTVALUE ?? c.VALUE ?? 0;
                              const label = discType === 'percent' || discType === 'percentage' ? `${discVal}% OFF` : formatPrice(discVal);
                              return (
                                <button key={c.$id} type="button" onClick={() => { setCouponCode(code); setCouponError(''); }}
                                  style={{ padding: '5px 10px', borderRadius: 999, border: `1.5px solid ${couponCode === code ? PINK : '#fce7f3'}`, background: couponCode === code ? PINK_BG : '#fff', color: couponCode === code ? PINK : '#6b7280', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FF, transition: 'all .15s', letterSpacing: 0.5 }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.color = PINK; }}
                                  onMouseLeave={e => { if (couponCode !== code) { e.currentTarget.style.borderColor = '#fce7f3'; e.currentTarget.style.color = '#6b7280'; } }}>
                                  🎟 {code} <span style={{ fontWeight: 800, color: '#00a650' }}>{label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Agency badge — only show when selected */}
                {agency && (
                <div style={{ margin: '0 22px 14px', padding: '10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(227,150,191,0.06), rgba(249,168,212,0.1))', border: '1px solid #fce7f3', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: PINK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fce7f3' }}>
                    <Truck size={13} color={PINK} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111', fontFamily: FF }}>{agency}</p>
                  </div>
                </div>
                )}

                {/* Note */}
                <div style={{ padding: '0 22px 16px' }}>
                  <textarea value={customerNote} onChange={e => setCustomerNote(e.target.value)} maxLength={500}
                    placeholder="💬 Notas para tu pedido (opcional)..."
                    className="ck-textarea-placeholder"
                    style={{ width: '100%', padding: '10px 12px', fontSize: 12, border: '1.5px solid #f3f4f6', borderRadius: 10, resize: 'none', minHeight: 44, maxHeight: 80, outline: 'none', color: '#374151', boxSizing: 'border-box', fontFamily: FF, background: '#f9fafb', transition: 'all .2s' }}
                    onFocus={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(227,150,191,0.08)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>

                {error && <p style={{ margin: '0 22px 12px', fontSize: 12, color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: 10, border: '1px solid #fecaca', fontFamily: FF }}>⚠ {error}</p>}

                {/* Wholesale notice */}
                {hasPackItems && (
                  <div style={{ margin: '0 22px 14px', padding: '14px 16px', borderRadius: 14, background: 'linear-gradient(135deg,#fef9f4,#fff8f0)', border: '1px solid #eed9c4', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>📦</span>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#5c3d24', fontFamily: FF }}>Pedido Mayorista</p>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: '#92400e', fontFamily: FF, lineHeight: 1.5 }}>
                      Hemos recibido tus productos. Antes del pago, verificaremos la disponibilidad de stock y nos comunicaremos contigo por <strong>WhatsApp</strong> para confirmarte cuáles hay disponibles.
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: '#b45309', fontFamily: FF }}>También podrás ver el estado desde <strong>Mis Pedidos Mayoristas</strong> en tu cuenta.</p>
                  </div>
                )}

                {/* Submit button */}
                <div style={{ padding: '0 22px 20px' }}>
                  <button type="submit" disabled={submitting || belowMinimum} className={hasPackItems ? "ck-confirm-btn-wholesale" : "ck-confirm-btn"}
                    style={{ display: 'block', width: '100%', padding: '16px 0', backgroundImage: submitting ? 'none' : (hasPackItems ? 'linear-gradient(135deg, #f7e5d4, #eed9c4, #d4b290, #eed9c4, #f7e5d4)' : 'linear-gradient(135deg, #fbcfe8, #f5a8cf, #e396bf, #f5a8cf, #fbcfe8)'), backgroundColor: submitting ? (hasPackItems ? '#eed9c4' : '#f5a8cf') : 'transparent', color: hasPackItems ? '#5c3d24' : '#fff', textAlign: 'center', borderRadius: 16, fontSize: 16, fontWeight: 800, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all .3s', boxSizing: 'border-box', fontFamily: FF, position: 'relative', overflow: 'hidden', backgroundSize: '300% 300%', letterSpacing: '0.02em' }}>
                    {!submitting && <>
                      <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        <span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" />
                        <span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" />
                        <span className="ck-trail" /><span className="ck-trail" /><span className="ck-trail" />
                      </span>
                      <span className="ck-shimmer-line" />
                    </>}
                    <span style={{ position: 'relative', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {submitting ? 'Procesando...' : hasPackItems ? <>📦 Solicitar Pedido Mayorista</> : <><Shield size={16} /> Confirmar pedido</>}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal de Selección de Agencia */}
        {showAgencyModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ padding: '32px 24px 24px', textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 64, height: 64, background: PINK_BG, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `1px solid ${PINK_LIGHT}`, boxShadow: `0 8px 24px rgba(227,150,191,0.2)` }}>
                  <Truck size={32} color={PINK} strokeWidth={2.5} />
                </div>
                <h3 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#111', fontFamily: FF, lineHeight: 1.2 }}>¿Por dónde enviamos tu pedido? 📦</h3>
                <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280', fontFamily: FF, lineHeight: 1.5 }}>
                  Selecciona la agencia de envíos de tu preferencia para continuar.
                </p>
                <div className="ck-modal-agency-grid">
                  {agencies.map(a => (
                    <button
                      key={a.name}
                      type="button"
                      onClick={() => {
                        setAgency(a.name);
                        setShowAgencyModal(false);
                        setShowSummaryModal(true);
                      }}
                      className="ck-agency-card"
                      style={{
                        padding: '16px', borderRadius: 16, border: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = hasPackItems ? '#cda178' : PINK; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = hasPackItems ? '0 6px 16px rgba(92,61,36,0.1)' : '0 6px 16px rgba(227,150,191,0.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: a.bg, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className="ck-agency-logo-wrapper">
                        {a.logo ? (
                          <img src={a.logo} alt={a.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                        ) : (
                          <Truck size={20} color={a.color} />
                        )}
                      </div>
                      <div className="ck-agency-text-wrapper">
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111', fontFamily: FF }} className="ck-agency-name">{a.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280', fontFamily: FF }} className="ck-agency-desc">{a.desc}</p>
                      </div>
                      <div style={{ marginLeft: 'auto' }} className="ck-agency-chevron">
                        <ChevronRight size={20} color="#9ca3af" />
                      </div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setShowAgencyModal(false)}
                  style={{ marginTop: 24, padding: '12px 24px', background: 'transparent', color: '#6b7280', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FF, textDecoration: 'underline' }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Resumen y Confirmación */}
        {showSummaryModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
              <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, background: PINK_BG, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={24} color={PINK} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111', fontFamily: FF }}>Confirmación Final</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280', fontFamily: FF }}>Revisa tus datos antes de enviar</p>
                </div>
              </div>
              
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ background: '#f9fafb', borderRadius: 16, padding: '16px', border: '1px solid #e5e7eb', marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, fontFamily: FF }}>Dirección de Envío</h4>
                  <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#111', fontFamily: FF }}>{form.name}</p>
                  <p style={{ margin: '0 0 4px', fontSize: 14, color: '#374151', fontFamily: FF }}>{form.address}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280', fontFamily: FF }}>{form.comuna}, {form.region}</p>
                </div>
                
                <div style={{ background: '#f9fafb', borderRadius: 16, padding: '16px', border: '1px solid #e5e7eb', marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, fontFamily: FF }}>Datos de Contacto</h4>
                  <p style={{ margin: '0 0 4px', fontSize: 14, color: '#374151', fontFamily: FF }}><strong>Email:</strong> {form.email}</p>
                  <p style={{ margin: '0 0 4px', fontSize: 14, color: '#374151', fontFamily: FF }}><strong>Teléfono:</strong> {form.phone}</p>
                  <p style={{ margin: 0, fontSize: 14, color: '#374151', fontFamily: FF }}><strong>RUT:</strong> {form.rut}</p>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(227,150,191,0.06), rgba(249,168,212,0.1))', borderRadius: 16, padding: '16px', border: '1px solid #fce7f3' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, color: PINK, textTransform: 'uppercase', letterSpacing: 1, fontFamily: FF }}>Agencia Seleccionada</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <Truck size={18} color={PINK} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111', fontFamily: FF }}>{agency}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowSummaryModal(false)}
                  style={{ flex: 1, padding: '16px', background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FF, transition: 'all 0.2s' }}>
                  Volver
                </button>
                <button type="button" onClick={executeCheckout}
                  style={{ flex: 2, padding: '16px', background: hasPackItems ? 'linear-gradient(135deg, #eed9c4, #e1c2a4, #cda178)' : 'linear-gradient(135deg, #fbcfe8, #f5a8cf, #e396bf)', color: hasPackItems ? '#5c3d24' : '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: FF, boxShadow: hasPackItems ? '0 8px 20px rgba(92,61,36,0.15)' : '0 8px 20px rgba(227,150,191,0.3)', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                  <span className="ck-shimmer-line" />
                  <span style={{ position: 'relative', zIndex: 2, textShadow: hasPackItems ? 'none' : '0 1px 3px rgba(0,0,0,0.12)' }}>Confirmar y Enviar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Geolocalización (Pro) */}
        {showGeoModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 420, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ padding: '32px 24px 24px', textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 64, height: 64, background: PINK_BG, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `1px solid ${PINK_LIGHT}`, boxShadow: `0 8px 24px rgba(227,150,191,0.2)` }}>
                  <MapPin size={32} color={PINK} strokeWidth={2.5} />
                </div>
                <h3 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#111', fontFamily: FF, lineHeight: 1.2 }}>Mejora la precisión<br/>de tu envío 📍</h3>
                <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280', fontFamily: FF, lineHeight: 1.5 }}>
                  ¿Deseas geolocalizar tu dirección actual? Esto nos ayudará a obtener una ubicación exacta para que el repartidor encuentre tu destino sin problemas y tu pedido llegue más rápido.
                </p>
                {geoError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 14px', marginBottom: 20 }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#ef4444', fontFamily: FF, fontWeight: 500 }}>{geoError}</p>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button onClick={handleGeolocate} disabled={isGeolocating}
                    style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #fbcfe8, #f5a8cf, #e396bf)', color: '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: isGeolocating ? 'not-allowed' : 'pointer', fontFamily: FF, boxShadow: '0 8px 20px rgba(227,150,191,0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {isGeolocating ? (
                      <><RefreshCw size={18} className="animate-spin" /> Obteniendo ubicación...</>
                    ) : (
                      <><MapPin size={18} /> Sí, usar mi ubicación actual</>
                    )}
                  </button>
                  <button onClick={handleSkipGeo} disabled={isGeolocating}
                    style={{ width: '100%', padding: '16px', background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: 16, fontSize: 14, fontWeight: 700, cursor: isGeolocating ? 'not-allowed' : 'pointer', fontFamily: FF, transition: 'all 0.2s' }}>
                    No estoy en mi casa, prefiero escribirla.
                  </button>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
        )}
      </div>
      </div>
    </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <DynamicCheckout>
      <Suspense fallback={<div style={{ background: 'linear-gradient(180deg, #fdf2f8 0%, #fff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF }}><p style={{ color: '#f5a8cf' }}>Cargando...</p></div>}>
        <CheckoutInner />
      </Suspense>
    </DynamicCheckout>
  );
}
