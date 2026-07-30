"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { fetchAllAppwriteErpProducts, updateAppwriteErpProduct, AppwriteErpProduct } from '@/lib/appwriteErpService'
import { openReceiptPrintWindow } from '@/lib/posReceipt'
import { SEDES, SedeSlug } from '@/types'
import {
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, ArrowRightLeft,
  X, Check, Package, BarChart3, Clock, DollarSign, Maximize2, Minimize2,
  ChevronLeft, Hash, Percent, AlertCircle, CheckCircle, RotateCcw, Receipt,
  Store, ScanBarcode, Loader2, Lock, Unlock, Zap, Eye, EyeOff, LogOut, Send, Camera, ScanText, Edit3, BookMarked, FolderOpen,
  Monitor, RefreshCw,
} from 'lucide-react'


// Firebase Mocks
const db = {} as any;
const authReady = Promise.resolve();
const collection = (d: any, p: any) => p;
const doc = (...args: any[]) => args.join('/');
const getDoc = async (...args: any[]) => ({ exists: () => false, data: () => ({}) });
const getDocs = async (c: any): Promise<any> => ({ forEach: (cb: any) => {} });
const onSnapshot = (c: any, cb: any, err?: any) => { cb({ forEach: () => {}, docs: [], exists: () => false, data: () => ({}) }); return () => {}; };
const query = (...args: any[]) => args[0];
const setDoc = async (...args: any[]) => {};
const updateDoc = async (...args: any[]) => {};
const where = (f: any, op: any, val: any) => f;
const Timestamp = { now: () => ({ seconds: Date.now() / 1000 }), fromDate: (d: any) => ({ seconds: d.getTime() / 1000 }) };
type Timestamp = any;
const increment = (n: number) => n;
const orderBy = (f: any, d?: any) => f;
const fbLimit = (n: number) => n;
const runTransaction = async (d: any, cb: any) => cb({ get: async () => ({ exists: () => false }), set: () => {}, update: () => {} });
const serverTimestamp = () => ({ seconds: Date.now() / 1000 });
const writeBatch = (d: any) => ({ update: () => {}, commit: async () => {} });

// Mock usePriceListConfig variables
const listasActivas = [] as any[];
const nombrePorCampo = (c: string) => c;
const openBlankReceiptWindow = openReceiptPrintWindow;




// ─── POS User Session ─────────────────────────────────────────────────────────
interface PosUserSession {
  id: string
  nombre: string
  cargo: string
  fotoUrl?: string
  sede: string
  role: 'cajera' | 'vendedora' | 'jefe'
  loginAt: number
}

const POS_SESSION_KEY = 'asistora_pos_session'

function getPosSession(sede: string): PosUserSession | null {
  try {
    const raw = localStorage.getItem('yaxsel_pos_session')
    if (!raw) return { id: 'default', nombre: 'Fernanda', cargo: 'Cajera', sede: sede, role: 'cajera', loginAt: Date.now() }
    const session = JSON.parse(raw) as PosUserSession
    return session
  } catch { return { id: 'default', nombre: 'Fernanda', cargo: 'Cajera', sede: sede, role: 'cajera', loginAt: Date.now() } }
}

function savePosSession(session: PosUserSession) {
  localStorage.setItem(POS_SESSION_KEY, JSON.stringify(session))
}

function clearPosSession() {
  localStorage.removeItem(POS_SESSION_KEY)
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductDoc {
  sku: string
  nombre: string
  costo_uni: number
  precio_detalle: number
  precio_mayorista: number
  precio_region?: number
  precio_segundo?: number
  ajuste_menos10?: boolean
  imageUrl?: string
  codigo_barra?: string
}

interface StockDoc {
  sku: string
  sede: string
  stock: number
}

interface CartItem {
  sku: string
  nombre: string
  cantidad: number
  precioUnitario: number
  priceField?: string
  priceLabel?: string
  costoUnitario: number
  descuentoPct: number
  subtotal: number
  stockDisponible: number
}

type MetodoPago = 'efectivo' | 'debito' | 'transferencia'

interface PagoEntry {
  metodo: MetodoPago
  monto: number
}

type ReceiptCounters = {
  boletaNumero: number
  debitoOrdenNumero: number | null
}

interface VentaPOS {
  id: string
  sede: string
  cajeroNombre: string
  sesionCajaId: string
  fecha: Timestamp
  fechaStr?: string
  items: Array<{
    sku: string
    nombre: string
    cantidad: number
    precioUnitario: number
    costoUnitario: number
    descuentoPct: number
    subtotal: number
  }>
  subtotal: number
  descuentoGlobalPct: number
  descuentoGlobal: number
  total: number
  pagos: PagoEntry[]
  vuelto: number
  estado: 'completada' | 'anulada'
  createdAt?: Timestamp
  boletaNumero?: number
  debitoOrdenNumero?: number | null
}

// ─── Cart Drafts ─────────────────────────────────────────────────────────────

interface CartDraft {
  id: string
  label: string
  cart: CartItem[]
  descuentoGlobalPct: number
  savedAt: number
}

const POS_DRAFTS_KEY = 'asistora_pos_drafts_v1'

function loadDrafts(sede: string): CartDraft[] {
  try {
    const raw = localStorage.getItem(`${POS_DRAFTS_KEY}_${sede}`)
    if (!raw) return []
    return JSON.parse(raw) as CartDraft[]
  } catch { return [] }
}

function saveDraftsToStorage(sede: string, drafts: CartDraft[]) {
  try { localStorage.setItem(`${POS_DRAFTS_KEY}_${sede}`, JSON.stringify(drafts)) } catch {}
}

interface SesionCaja {
  id: string
  sede: string
  cajeroNombre: string
  estado: 'abierta' | 'cerrada'
  montoApertura: number
  montoCierre?: number
  ventasCount: number
  totalVentas: number
  totalEfectivo: number
  totalDebito: number
  totalTransferencia: number
  aperturaAt: Timestamp
  cierreAt?: Timestamp
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n))

const fmtN = (n: number) => new Intl.NumberFormat('es-CL').format(Math.round(n))

const normSku = (v: unknown) => String(v ?? '').trim().toUpperCase()

const now = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const genId = () => `pos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

// ─── Component ───────────────────────────────────────────────────────────────

export default function PuntoDeVentaPage() {
  const { sede: sedeParam } = useParams<{ sede: string }>()
  const router = useRouter()
  const sede = (sedeParam || '') as SedeSlug
  const sedeNombre = SEDES[sede] || sede
  

  // ─── POS Login ────────────────────────────────────────────────────────────────
  const [posUser, setPosUser] = useState<PosUserSession | null>(() => getPosSession(sede))
  const [loginUsers, setLoginUsers] = useState<Array<{ id: string; nombre: string; cargo: string; fotoUrl?: string; posPassword?: string; posActivo?: boolean }>>([])
  const [loginLoading, setLoginLoading] = useState(true)
  const [loginSelected, setLoginSelected] = useState<string | null>(null)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginShowPw, setLoginShowPw] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showOCRScanner, setShowOCRScanner] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  // ─── Editar método de pago ────────────────────────────────────────────────
  const [editPagoTarget, setEditPagoTarget] = useState<VentaPOS | null>(null)
  const [editPagoPin, setEditPagoPin] = useState('')
  const [editPagoPinError, setEditPagoPinError] = useState(false)
  const [editPagoPinOk, setEditPagoPinOk] = useState(false)
  const [editPagoMetodo, setEditPagoMetodo] = useState<MetodoPago>('efectivo')
  const [editPagoSaving, setEditPagoSaving] = useState(false)
  const [isMobile, setIsMobile] = useState(false); useEffect(() => { setIsMobile(window.innerWidth < 1024) }, [])

  // ─── State ──────────────────────────────────────────────────────────────────
  // Products & stock
  const [products, setProducts] = useState<Map<string, ProductDoc>>(new Map())
  const [stockMap, setStockMap] = useState<Map<string, number>>(new Map())
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [hideNoStock, setHideNoStock] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const sesionCajaRef = useRef<SesionCaja | null>(null)

  // ─── Modos de red ────────────────────────────────────────────────────────────
  const [cartSyncEnabled, setCartSyncEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('pos_cartSync') !== 'off' } catch { return true }
  })
  const [modoLento, setModoLento] = useState<boolean>(() => {
    try { return localStorage.getItem('pos_modoLento') === 'on' } catch { return false }
  })
  const toggleCartSync = () => setCartSyncEnabled(v => { const n = !v; try { localStorage.setItem('pos_cartSync', n ? 'on' : 'off') } catch {} return n })
  const toggleModoLento = () => setModoLento(v => { const n = !v; try { localStorage.setItem('pos_modoLento', n ? 'on' : 'off') } catch {} return n })
  const openCustomerVisualizer = () => {
    if (!posUser || !sede) return
    const url = `/pos-visualizer/${sede}/${encodeURIComponent(posUser.id)}`
    window.open(url, 'asistora_customer_visualizer', 'noopener,noreferrer')
  }

  // Cart
  const [cart, setCart] = useState<CartItem[]>([])
  const [descuentoGlobalPct, setDescuentoGlobalPct] = useState(0)
  const [lastSavedCart, setLastSavedCart] = useState<{ cart: CartItem[]; descuento: number; timestamp: number } | null>(null)

  // Payment
  const [pagoActivo, setPagoActivo] = useState<MetodoPago>('efectivo')
  const [montoRecibido, setMontoRecibido] = useState('')
  const [pagos, setPagos] = useState<PagoEntry[]>([])
  const [splitMode, setSplitMode] = useState(false)

  // Caja
  const [sesionCaja, setSesionCaja] = useState<SesionCaja | null>(null)
  const [cajaLoaded, setCajaLoaded] = useState(false)
  // Keep ref in sync for keyboard handler
  useEffect(() => { sesionCajaRef.current = sesionCaja }, [sesionCaja])
  const [cajeroNombre, setCajeroNombre] = useState('')
  const [montoApertura, setMontoApertura] = useState('')
  const [showApertura, setShowApertura] = useState(false)
  const [showCierre, setShowCierre] = useState(false)
  const [efectivoReal, setEfectivoReal] = useState('')
  type ItemCierre = { tipo: 'gasto' | 'anulacion' | 'devolucion'; monto: string; detalle: string; boletaNumero: string }
  const [itemsCierre, setItemsCierre] = useState<ItemCierre[]>([])

  // UI
  const [mobileTab, setMobileTab] = useState<'products' | 'cart' | 'payment'>('products')
  const [fullscreen, setFullscreen] = useState(false)
  const [clock, setClock] = useState(now())
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' | 'info' } | null>(null)
  const [processing, setProcessing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [ventasHoy, setVentasHoy] = useState<VentaPOS[]>([])
  const [drafts, setDrafts] = useState<CartDraft[]>(() => loadDrafts(sede))
  const [showDrafts, setShowDrafts] = useState(false)
  const [showQuickAmounts, setShowQuickAmounts] = useState(false)
  const [selectedPriceBySku, setSelectedPriceBySku] = useState<Record<string, string>>({})
  const [lastPrintedSale, setLastPrintedSale] = useState<VentaPOS | null>(null)
  const [cartAddedItem, setCartAddedItem] = useState<{ nombre: string; precio: number } | null>(null)
  const [empresaConfig, setEmpresaConfig] = useState<{
    nombreEmpresa: string
    rut: string
    giro: string
    direccion: string
    telefono: string
    email: string
    qrFalsoEnBoleta: boolean
  }>({
    nombreEmpresa: '', rut: '', giro: '', direccion: '', telefono: '', email: '', qrFalsoEnBoleta: false,
  })

  // ─── Vendedora / Cajera / Jefe roles ───────────────────────────────────
  const isVendedora = posUser?.role === 'vendedora'
  const isCajera = posUser?.role === 'cajera'
  const isJefe = posUser?.role === 'jefe'

  // ─── Modo de venta POS (cajera_cobra | jefe_cobra) ──────────────────────
  type ModoVentaPOS = 'cajera_cobra' | 'jefe_cobra'
  const [modoVentaPOS, setModoVentaPOS] = useState<ModoVentaPOS>('cajera_cobra')

  // Cargar modo efectivo: override de sede o global
  useEffect(() => {
    if (!db || !sede) return
    let cancelled = false
    ;(async () => {
      try {
        await authReady
        // 1) Override de sede
        const snapSede = await getDoc(doc(db!, 'config_pos', `sede_${sede}`))
        if (!cancelled && snapSede.exists()) {
          const ds = snapSede.data() as any
          const ms = ds.modoVentaPOS as ModoVentaPOS | undefined | null
          if (ms === 'cajera_cobra' || ms === 'jefe_cobra') {
            setModoVentaPOS(ms)
            return
          }
        }
        // 2) Global
        const snapGlobal = await getDoc(doc(db!, 'config_pos', 'empresa'))
        if (!cancelled && snapGlobal.exists()) {
          const dg = snapGlobal.data() as any
          const mg = dg.modoVentaPOS as ModoVentaPOS | undefined
          if (mg === 'cajera_cobra' || mg === 'jefe_cobra') {
            setModoVentaPOS(mg)
            return
          }
        }
        if (!cancelled) setModoVentaPOS('cajera_cobra')
      } catch { /* silently fail */ }
    })()
    return () => { cancelled = true }
  }, [sede])

  // Listener reactivo del modo (snapshot) — opcional, para que se aplique en vivo
  useEffect(() => {
    if (!db || !sede) return
    const unsubSede = onSnapshot(doc(db!, 'config_pos', `sede_${sede}`), (snap: any) => {
      if (snap.exists()) {
        const ds = snap.data() as any
        const ms = ds.modoVentaPOS as ModoVentaPOS | undefined | null
        if (ms === 'cajera_cobra' || ms === 'jefe_cobra') { setModoVentaPOS(ms); return }
      }
      // Si sede no tiene override, leer global
      getDoc(doc(db!, 'config_pos', 'empresa')).then(s => {
        if (s.exists()) {
          const dg = s.data() as any
          const mg = dg.modoVentaPOS as ModoVentaPOS | undefined
          if (mg === 'cajera_cobra' || mg === 'jefe_cobra') setModoVentaPOS(mg)
          else setModoVentaPOS('cajera_cobra')
        }
      }).catch(() => {})
    })
    return () => unsubSede()
  }, [sede])

  // ─── Pending sales for cajeras (from vendedoras) ────────────────────────
  const [pendingSales, setPendingSales] = useState<any[]>([])
  const [showPendingSales, setShowPendingSales] = useState(false)

  useEffect(() => {
    if (!db || !posUser || !isCajera || !sede) return
    const q = query(
      collection(db!, 'pos_ventas_pendientes'),
      where('cajeraId', '==', posUser.id),
      where('sede', '==', sede),
      where('estado', '==', 'pendiente'),
    )
    const unsub = onSnapshot(q, (snap: any) => {
      const sales: any[] = []
      snap.forEach((d: any) => sales.push({ id: d.id, ...d.data() }))
      sales.sort((a, b) => (b.creadoAt?.seconds || 0) - (a.creadoAt?.seconds || 0))
      setPendingSales(sales)
    })
    return () => unsub()
  }, [posUser, isCajera, sede])

  const handleAcceptPendingSale = (sale: any) => {
    // Load sale items into cart
    if (sale.items && Array.isArray(sale.items)) {
      setCart(sale.items as CartItem[])
      if (typeof sale.descuentoGlobalPct === 'number') setDescuentoGlobalPct(sale.descuentoGlobalPct)
    }
    // Mark as accepted
    if (db) {
      updateDoc(doc(db!, 'pos_ventas_pendientes', sale.id), { estado: 'aceptada' }).catch(() => {})
    }
    setShowPendingSales(false)
    showToast(`Venta de ${sale.vendedoraNombre} cargada · Cliente: ${sale.clienteNombre}`, 'ok')
  }

  const handleRejectPendingSale = (saleId: string) => {
    if (db) {
      updateDoc(doc(db!, 'pos_ventas_pendientes', saleId), { estado: 'rechazada' }).catch(() => {})
    }
  }

  // ─── Pre-ventas pendientes (para rol JEFE) ──────────────────────────────
  const [preVentas, setPreVentas] = useState<any[]>([])
  const [showPreVentas, setShowPreVentas] = useState(false)
  // Cuando jefe acepta una pre-venta, guardamos su id para que al "Cobrar" actualicemos esa venta
  const [cobrandoPreventaId, setCobrandoPreventaId] = useState<string | null>(null)

  useEffect(() => {
    if (!db || !posUser || !isJefe || !sede) return
    const q = query(
      collection(db!, 'ventas_pos'),
      where('sede', '==', sede),
      where('estado', '==', 'pre_venta'),
    )
    const unsub = onSnapshot(q, (snap: any) => {
      const list: any[] = []
      snap.forEach((d: any) => list.push({ id: d.id, ...d.data() }))
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setPreVentas(list)
    })
    return () => unsub()
  }, [posUser, isJefe, sede])

  const handleAcceptPreventa = (pv: any) => {
    if (!pv || !Array.isArray(pv.items)) return
    // Cargar items al carrito del jefe (reconstruyendo el formato CartItem)
    const items: CartItem[] = pv.items.map((it: any) => ({
      sku: String(it.sku || ''),
      nombre: String(it.nombre || ''),
      cantidad: Number(it.cantidad || 0),
      precioUnitario: Number(it.precioUnitario || 0),
      costoUnitario: Number(it.costoUnitario || 0),
      descuentoPct: Number(it.descuentoPct || 0),
      subtotal: Number(it.subtotal || 0),
      stockDisponible: 9999,
    }))
    setCart(items)
    setDescuentoGlobalPct(Number(pv.descuentoGlobalPct || 0))
    setCobrandoPreventaId(pv.id)
    setShowPreVentas(false)
    showToast(`Pre-venta cargada · ${fmtCLP(Number(pv.total || 0))}`, 'ok')
  }

  const handleRejectPreventa = async (pv: any) => {
    if (!db || !pv?.id) return
    try {
      await updateDoc(doc(db!, 'ventas_pos', pv.id), { estado: 'anulada', anuladaEn: serverTimestamp(), anuladaPor: posUser?.nombre || 'jefe' })
      showToast('Pre-venta anulada', 'ok')
    } catch (e: any) {
      showToast(`Error: ${e.message}`, 'err')
    }
  }

  // Auto-abrir panel de pre-ventas al jefe cuando llegan nuevas (no estando cobrando una)
  const jefeAutoOpenedRef = useRef<number>(0)
  useEffect(() => {
    if (!isJefe || cobrandoPreventaId) return
    if (preVentas.length > 0 && preVentas.length > jefeAutoOpenedRef.current) {
      setShowPreVentas(true)
    }
    jefeAutoOpenedRef.current = preVentas.length
  }, [isJefe, preVentas.length, cobrandoPreventaId])

  // ─── Vendedora mode: send to cajera ──────────────────────────────────────
  const [showSendToCajera, setShowSendToCajera] = useState(false)
  const [sendingToCajera, setSendingToCajera] = useState(false)
  const [vendedoraSelectedCajera, setVendedoraSelectedCajera] = useState<string | null>(null)
  const [vendedoraClienteEnabled, setVendedoraClienteEnabled] = useState(false)
  const [clienteNombre, setClienteNombre] = useState('')
  const [clienteRut, setClienteRut] = useState('')
  const [clienteTelefono, setClienteTelefono] = useState('')
  const [clienteCorreo, setClienteCorreo] = useState('')

  const handleSendToCajera = async (cajeraId: string, cajeraNombre: string) => {
    if (!db || !posUser || !sede || cart.length === 0) return
    setSendingToCajera(true)
    try {
      await authReady
      const id = `venta_pending_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      await setDoc(doc(db!, 'pos_ventas_pendientes', id), {
        id,
        sede,
        vendedoraId: posUser.id,
        vendedoraNombre: posUser.nombre,
        cajeraId,
        cajeraNombre,
        items: cart.map(c => ({ ...c })),
        descuentoGlobalPct,
        totalItems: totalItemsCount,
        subtotal: subtotalCart,
        total: totalCart,
        clienteNombre: clienteNombre.trim() || 'Cliente',
        clienteRut: vendedoraClienteEnabled ? (clienteRut.trim() || '') : '',
        clienteTelefono: vendedoraClienteEnabled ? (clienteTelefono.trim() || '') : '',
        clienteCorreo: vendedoraClienteEnabled ? (clienteCorreo.trim() || '') : '',
        clienteRegistrar: vendedoraClienteEnabled,
        estado: 'pendiente',
        creadoAt: serverTimestamp(),
      })
      showToast(`Venta enviada a ${cajeraNombre}`, 'ok')
      setCart([])
      setDescuentoGlobalPct(0)
      setShowSendToCajera(false)
      setClienteNombre('')
      setClienteRut('')
      setClienteTelefono('')
      setClienteCorreo('')
    } catch (e: any) {
      showToast(`Error: ${e.message}`, 'err')
    } finally {
      setSendingToCajera(false)
    }
  }

  // ─── Load empresa config ─────────────────────────────────────────────────
  useEffect(() => {
    if (!db) return
    ;(async () => {
      try {
        await authReady
        const snap = await getDoc(doc(db!, 'config_pos', 'empresa'))
        if (snap.exists()) {
          const d = snap.data() as any
          setEmpresaConfig({
            nombreEmpresa: d.nombreEmpresa || '', rut: d.rut || '', giro: d.giro || '',
            direccion: d.direccion || '', telefono: d.telefono || '', email: d.email || '',
            qrFalsoEnBoleta: d.qrFalsoEnBoleta || false,
          })
        }
      } catch {}
    })()
  }, [])

  const nextReceiptCounters = async (payments: PagoEntry[]): Promise<ReceiptCounters> => {
    const hasDebito = payments.some(p => p.metodo === 'debito' && p.monto > 0)
    const ref = doc(db!, 'config_pos', `correlativos_${sede}`)
    return runTransaction(db!, async (tx: any) => {
      const snap = await tx.get(ref)
      const current = snap.exists() ? (snap.data() as any) : {}
      const disponibles: number[] = Array.isArray(current?.boletasDisponibles) ? [...current.boletasDisponibles] : []
      
      let nextBoleta: number
      let nuevasDisponibles: number[]
      if (disponibles.length > 0) {
        disponibles.sort((a, b) => a - b)
        nextBoleta = disponibles[0]
        nuevasDisponibles = disponibles.slice(1)
      } else {
        nextBoleta = (Number(current?.boletaNumero) || 0) + 1
        nuevasDisponibles = []
      }
      
      const nextDebito = hasDebito ? ((Number(current?.debitoOrdenNumero) || 0) + 1) : (Number(current?.debitoOrdenNumero) || 0)
      const newMax = nextBoleta > (Number(current?.boletaNumero) || 0) ? nextBoleta : (Number(current?.boletaNumero) || 0)

      tx.set(ref, {
        sede,
        boletaNumero: newMax,
        boletasDisponibles: nuevasDisponibles,
        debitoOrdenNumero: nextDebito,
        updatedAt: Date.now(),
      }, { merge: true })

      return {
        boletaNumero: nextBoleta,
        debitoOrdenNumero: hasDebito ? nextDebito : null,
      }
    })
  }

  // ─── Load cart from localStorage ───────────────────────────────────────────
  useEffect(() => {
    if (!sede) return
    try {
      const key = `pos_cart_${sede}`
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.cart && Array.isArray(parsed.cart) && parsed.cart.length > 0) {
          setLastSavedCart(parsed)
        }
      }
    } catch {}
  }, [sede])

  // ─── Save cart to localStorage (debounced 300ms) ──────────────────────────
  useEffect(() => {
    if (!sede) return
    const t = setTimeout(() => {
      try {
        const key = `pos_cart_${sede}`
        if (cart.length > 0) {
          localStorage.setItem(key, JSON.stringify({ cart, descuento: descuentoGlobalPct, timestamp: Date.now() }))
        } else {
          localStorage.removeItem(key)
        }
      } catch {}
    }, 300)
    return () => clearTimeout(t)
  }, [cart, descuentoGlobalPct, sede])

  // ─── Firestore cart sync (cross-device) ────────────────────────────────────
  // deviceId uniquely identifies this browser tab so we never apply our own writes
  const cartSyncDeviceId = useRef(`dev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`)
  // Timestamp of our last local write — ignore remote snapshots arriving within 3s of our write
  const cartSyncLastWrite = useRef(0)

  // Write cart to Firestore — debounced 1500ms so typing doesn't trigger Firestore at all
  useEffect(() => {
    if (!db || !posUser || !sede) return
    if (!cartSyncEnabled || modoLento) return // sync desactivado
    const syncId = `${posUser.id}_${sede}`
    const timeout = setTimeout(async () => {
      cartSyncLastWrite.current = Date.now()
      try {
        await setDoc(doc(db!, 'pos_cart_sync', syncId), {
          cart: cart.map(c => ({ ...c })),
          descuento: descuentoGlobalPct,
          updatedAt: serverTimestamp(),
          deviceId: cartSyncDeviceId.current,
          sede,
        })
      } catch (e) {
        console.warn('Cart sync write error:', e)
      }
    }, 1500)
    return () => clearTimeout(timeout)
  }, [cart, descuentoGlobalPct, posUser, sede, cartSyncEnabled, modoLento])

  // Listen for remote cart changes
  useEffect(() => {
    if (!db || !posUser || !sede) return
    if (!cartSyncEnabled || modoLento) return // sync desactivado
    const syncId = `${posUser.id}_${sede}`
    let firstSnapshot = true
    const unsub = onSnapshot(doc(db!, 'pos_cart_sync', syncId), (snap: any) => {
      if (firstSnapshot) { firstSnapshot = false; return }
      if (!snap.exists()) return
      const data = snap.data()
      if (data?.deviceId === cartSyncDeviceId.current) return
      if (Date.now() - cartSyncLastWrite.current < 2000) return
      if (data?.cart && Array.isArray(data.cart)) {
        setCart(data.cart as CartItem[])
        if (typeof data.descuento === 'number') setDescuentoGlobalPct(data.descuento)
      }
    })
    return () => unsub()
  }, [posUser, sede, cartSyncEnabled, modoLento])

  // ─── Load POS login users (onSnapshot para sincronizar cambios de planilla) ──
  useEffect(() => {
    if (!sede || !db) { setLoginLoading(false); return }
    setLoginLoading(true)

    // Query both slug variants for web-tiendas-3b-chile
    const sedeVariants = sede === 'web-tiendas-3b-chile'
      ? ['web-tiendas-3b-chile', 'web']
      : [sede]

    const unsubs: (() => void)[] = []
    const snapResults = new Map<string, any[]>()

    const merge = () => {
      const all: any[] = []
      snapResults.forEach(docs => all.push(...docs))
      const users: typeof loginUsers = []
      const seen = new Set<string>()
      all.forEach(({ id, data }) => {
        if (seen.has(id)) return
        seen.add(id)
        const cargo = String(data?.cargo || '').toUpperCase()
        if (cargo.includes('CAJER') || cargo.includes('VENDEDOR') || cargo.includes('VENDEDORA') || cargo.includes('JEFE')) {
          users.push({
            id,
            nombre: String(data?.nombre || 'Sin nombre'),
            cargo: String(data?.cargo || ''),
            fotoUrl: data?.fotoUrl || '',
            posPassword: data?.posPassword || '',
            posActivo: data?.posActivo !== false,
          })
        }
      })
      users.sort((a, b) => a.nombre.localeCompare(b.nombre))
      setLoginUsers(users)
      setLoginLoading(false)
    }

    sedeVariants.forEach(s => {
      const q = query(collection(db!, 'trabajadores'), where('sede', '==', s))
      const unsub = onSnapshot(q, (snap: any) => {
        snapResults.set(s, snap.docs.map((d: any) => ({ id: d.id, data: d.data() })))
        merge()
      }, () => {
        snapResults.set(s, [])
        merge()
      })
      unsubs.push(unsub)
    })

    return () => unsubs.forEach(u => u())
  }, [sede])

  const handlePosLogin = () => {
    if (!loginSelected) return
    const user = loginUsers.find(u => u.id === loginSelected)
    if (!user) return
    if (user.posPassword && loginPassword !== user.posPassword) {
      setLoginError('Contraseña incorrecta')
      return
    }
    const cargo = user.cargo.toUpperCase()
    const role: PosUserSession['role'] = cargo.includes('JEFE')
      ? 'jefe'
      : cargo.includes('CAJER')
        ? 'cajera'
        : 'vendedora'
    const session: PosUserSession = {
      id: user.id,
      nombre: user.nombre,
      cargo: user.cargo,
      fotoUrl: user.fotoUrl,
      sede,
      role,
      loginAt: Date.now(),
    }
    savePosSession(session)
    setPosUser(session)
    setLoginPassword('')
    setLoginError('')
    setLoginSelected(null)
  }

  const handlePosLogout = () => {
    clearPosSession()
    setPosUser(null)
    setLoginSelected(null)
    setLoginPassword('')
    setLoginError('')
  }

  // ─── Clock ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setClock(now()), 1000)
    return () => clearInterval(t)
  }, [])

  // ─── Toast ─────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: 'ok' | 'err' | 'info' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // ─── Load products ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!db) return
    let cancelled = false
    const load = async () => {
      try {
        await authReady
        if (cancelled) return
        const snap = await getDocs(collection(db!, 'products'))
        const map = new Map<string, ProductDoc>()
        snap.forEach((d: any) => {
          const raw: any = d.data()
          const sku = normSku(raw?.sku || d.id)
          if (!sku) return
          map.set(sku, {
            sku,
            nombre: String(raw?.nombre || raw?.descripcion || sku),
            costo_uni: Number(raw?.costo_uni) || 0,
            precio_detalle: Number(raw?.precio_detalle) || 0,
            precio_mayorista: Number(raw?.precio_mayorista) || 0,
            precio_region: Number(raw?.precio_region || raw?.precio_segundo) || 0,
            precio_segundo: Number(raw?.precio_segundo || raw?.precio_region) || 0,
            ajuste_menos10: !!raw?.ajuste_menos10,
            imageUrl: raw?.imageUrl || '',
            codigo_barra: String(raw?.codigo_barra || '').trim(),
          })
        })
        if (!cancelled) {
          setProducts(map)
          setLoadingProducts(false)
        }
      } catch (e) {
        console.error('Error loading products:', e)
        if (!cancelled) setLoadingProducts(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // ─── Load stock for sede (polling — evita reconexiones con internet malo) ──
  useEffect(() => {
    if (!db || !sede) return
    let cancelled = false
    let intervalId: ReturnType<typeof setInterval> | null = null

    const fetchStock = async () => {
      try {
        await authReady
        if (cancelled) return
        const q = query(collection(db!, 'stock'), where('sede', '==', sede))
        const snap = await getDocs(q)
        if (cancelled) return
        const map = new Map<string, number>()
        snap.forEach((d: any) => {
          const raw: any = d.data()
          const sku = normSku(raw?.sku)
          if (sku) map.set(sku, Number(raw?.stock) || 0)
        })
        setStockMap(map)
      } catch (e) {
        console.error('Error loading stock:', e)
      }
    }

    fetchStock()
    // Modo lento: refrescar cada 5min; normal: cada 60s
    intervalId = setInterval(fetchStock, modoLento ? 300_000 : 60_000)

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
    }
  }, [sede, modoLento])

  // ─── Load today's sales ────────────────────────────────────────────────────
  useEffect(() => {
    if (!db || !sede) return
    let unsub = () => {}
    const load = async () => {
      try {
        await authReady
        const today = todayStr()
        const q = query(
          collection(db!, 'ventas_pos'),
          where('sede', '==', sede),
          where('fechaStr', '==', today),
        )
        let firstLoad = true
        unsub = onSnapshot(q, (snap: any) => {
          const list: VentaPOS[] = []
          snap.forEach((d: any) => {
            list.push({ id: d.id, ...d.data() } as any)
          })
          list.sort((a: any, b: any) => {
            const aMs = a?.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0
            const bMs = b?.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0
            return bMs - aMs
          })
          setVentasHoy(list.slice(0, 100))
          if (firstLoad) {
            firstLoad = false
            const lastCompleted = list.find(v => v.estado === 'completada')
            if (lastCompleted) setLastPrintedSale(prev => prev ?? lastCompleted)
          }
        })
      } catch (e) {
        console.error('Error loading ventas_pos:', e)
      }
    }
    load()
    return () => unsub()
  }, [sede])

  // ─── Load active caja session ──────────────────────────────────────────────
  useEffect(() => {
    if (!db || !sede) return
    let unsub = () => {}
    const load = async () => {
      try {
        await authReady
        const q = query(
          collection(db!, 'caja_sesiones'),
          where('sede', '==', sede),
          where('estado', '==', 'abierta'),
          fbLimit(1),
        )
        unsub = onSnapshot(q, (snap: any) => {
          if (snap.empty) {
            setSesionCaja(null)
          } else {
            const d = snap.docs[0]
            setSesionCaja({ id: d.id, ...d.data() } as any)
          }
          setCajaLoaded(true)
        })
      } catch (e) {
        console.error('Error loading caja:', e)
      }
    }
    load()
    return () => unsub()
  }, [sede])

  // ─── Auto-open apertura when caja is closed ───────────────────────────────
  useEffect(() => {
    if (!cajaLoaded) return
    if (!posUser) return
    if (sesionCaja) { setShowApertura(false); return }
    setShowApertura(true)
  }, [cajaLoaded, sesionCaja, posUser])

  // ─── Focus search on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => searchRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  // ─── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F1') { e.preventDefault(); setPagoActivo('efectivo') }
      if (e.key === 'F2') { e.preventDefault(); setPagoActivo('debito') }
      if (e.key === 'F3') { e.preventDefault(); setPagoActivo('transferencia') }
      if (e.key === 'Escape') {
        setShowHistory(prev => { if (prev) return false; return prev })
        // Solo cerrar apertura si ya hay sesión de caja abierta
        setShowApertura(prev => { if (prev && sesionCajaRef.current) return false; return prev })
        setShowCierre(prev => { if (prev) return false; return prev })
        setSearchTerm('')
        searchRef.current?.focus()
      }
      if (e.key === 'F8') { e.preventDefault(); setCart([]); setDescuentoGlobalPct(0); setPagos([]) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ─── Fullscreen ────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setFullscreen(false)
    }
  }

  // ─── Stock efectivo = Firestore stock − carrito local ─────────────────────
  // Evita que el stock "suba" cuando onSnapshot reconecta con internet malo.
  const effectiveStockMap = useMemo(() => {
    const map = new Map(stockMap)
    cart.forEach(item => {
      const raw = map.get(item.sku)
      // Si el SKU existe en stockMap, descontar lo que está en carrito
      if (raw !== undefined) map.set(item.sku, Math.max(0, raw - item.cantidad))
    })
    return map
  }, [stockMap, cart])

  // ─── Search & filter products ──────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toUpperCase()
    if (!term) return []
    const results: (ProductDoc & { stock: number })[] = []
    products.forEach((p) => {
      const cb = (p.codigo_barra || '').trim().toUpperCase()
      if (p.sku.includes(term) || p.nombre.toUpperCase().includes(term) || (cb && cb.includes(term))) {
        // Usar effectiveStockMap (stock Firestore - carrito local)
        // Si no hay dato aún (internet lento), asumir stock disponible
        const stock = effectiveStockMap.has(p.sku) ? (effectiveStockMap.get(p.sku) || 0) : -1
        if (hideNoStock && stock === 0) return
        results.push({ ...p, stock: stock < 0 ? 999 : stock })
      }
    })
    return results.sort((a, b) => {
      const aExact = a.sku === term ? -1 : 0
      const bExact = b.sku === term ? -1 : 0
      if (aExact !== bExact) return aExact - bExact
      return b.stock - a.stock
    }).slice(0, 50)
  }, [searchTerm, products, effectiveStockMap, hideNoStock])

  const quickTopProducts = useMemo(() => {
    const acc = new Map<string, { sku: string; cantidad: number }>()
    ventasHoy.forEach((venta) => {
      if (venta.estado === 'anulada') return
      ;(venta.items || []).forEach((item) => {
        const sku = normSku(item?.sku)
        if (!sku) return
        const prev = acc.get(sku)
        acc.set(sku, {
          sku,
          cantidad: (prev?.cantidad || 0) + Number(item?.cantidad || 0),
        })
      })
    })

    return Array.from(acc.values())
      .map(({ sku, cantidad }) => {
        const product = products.get(sku)
        if (!product) return null
        const stock = effectiveStockMap.has(sku) ? (effectiveStockMap.get(sku) || 0) : 999
        return {
          ...product,
          stock,
          cantidadVendidaHoy: cantidad,
        }
      })
      .filter((item): item is ProductDoc & { stock: number; cantidadVendidaHoy: number } => !!item && (!hideNoStock || item.stock > 0))
      .sort((a, b) => {
        if (b.cantidadVendidaHoy !== a.cantidadVendidaHoy) return b.cantidadVendidaHoy - a.cantidadVendidaHoy
        return b.stock - a.stock
      })
      .slice(0, 20)
  }, [ventasHoy, products, effectiveStockMap, hideNoStock])

  // ─── Cart helpers ──────────────────────────────────────────────────────────
  const getPriceOptions = useCallback((p: ProductDoc) => {
    const active = listasActivas
      .map((l) => {
        const value = l.campo === 'precio_detalle'
          ? Number(p.precio_detalle || 0)
          : l.campo === 'precio_mayorista'
            ? Number(p.precio_mayorista || 0)
            : Number(p.precio_segundo || p.precio_region || 0)
        if (value <= 0) return null
        return {
          field: l.campo,
          label: l.nombre,
          value,
        }
      })
      .filter((x): x is { field: string; label: string; value: number } => !!x)

    if (active.length > 0) return active

    const fallback = [
      { field: 'precio_detalle', label: nombrePorCampo('precio_detalle'), value: Number(p.precio_detalle || 0) },
      { field: 'precio_mayorista', label: nombrePorCampo('precio_mayorista'), value: Number(p.precio_mayorista || 0) },
      { field: 'precio_segundo', label: nombrePorCampo('precio_segundo'), value: Number(p.precio_segundo || p.precio_region || 0) },
    ].filter(x => x.value > 0)

    return fallback
  }, [listasActivas, nombrePorCampo])

  const getDefaultPriceOption = useCallback((p: ProductDoc) => {
    const options = getPriceOptions(p)
    if (options.length === 0) return null
    return options.find((o: any) => o.field === 'precio_segundo')
      || options.find((o: any) => o.field === 'precio_detalle')
      || options.find((o: any) => o.field === 'precio_mayorista')
      || options[0]
  }, [getPriceOptions])

  const getPrice = (p: ProductDoc, field?: string) => {
    if (field === 'precio_detalle') return Number(p.precio_detalle || 0)
    if (field === 'precio_mayorista') return Number(p.precio_mayorista || 0)
    if (field === 'precio_segundo') return Number(p.precio_segundo || p.precio_region || 0)
    return getDefaultPriceOption(p)?.value || 0
  }

  const addToCart = (p: ProductDoc & { stock?: number }, selectedPriceField?: string) => {
    const priceOption = selectedPriceField
      ? getPriceOptions(p).find((o: any) => o.field === selectedPriceField) || getDefaultPriceOption(p)
      : getDefaultPriceOption(p)
    const precio = priceOption?.value || 0
    if (precio <= 0) {
      showToast(`${p.sku} sin precio configurado`, 'err')
      return
    }
    // stockMap.has() = false cuando el listener aún no cargó (internet lento) → no bloquear
    const stockKnown = p.stock !== undefined ? true : stockMap.has(p.sku)
    const stockDisp = p.stock ?? (stockKnown ? (effectiveStockMap.get(p.sku) ?? 0) : 999)
    setCart(prev => {
      const existing = prev.find(c => c.sku === p.sku && (c.priceField || '') === (priceOption?.field || ''))
      if (existing) {
        // Comparar contra stock bruto total, no efectivo
        const totalStockForSku = stockKnown ? (stockMap.get(p.sku) ?? stockDisp) : stockDisp
        if (stockKnown && existing.cantidad >= totalStockForSku) {
          showToast(`Stock insuficiente: solo ${totalStockForSku} ud${totalStockForSku !== 1 ? 's' : ''} disponibles`, 'err')
          return prev
        }
        return prev.map(c => c.sku === p.sku && (c.priceField || '') === (priceOption?.field || '') ? {
          ...c,
          cantidad: c.cantidad + 1,
          subtotal: (c.cantidad + 1) * c.precioUnitario * (1 - c.descuentoPct / 100),
        } : c)
      }
      if (stockKnown && stockDisp <= 0) {
        showToast(`${p.sku} sin stock disponible`, 'err')
        return prev
      }
      return [...prev, {
        sku: p.sku,
        nombre: p.nombre,
        cantidad: 1,
        precioUnitario: precio,
        priceField: priceOption?.field,
        priceLabel: priceOption?.label,
        costoUnitario: p.costo_uni,
        descuentoPct: 0,
        subtotal: precio,
        stockDisponible: stockDisp,
      }]
    })

    // Show "added to cart" notification on mobile
    setCartAddedItem({ nombre: p.nombre, precio })
    setTimeout(() => setCartAddedItem(null), 2000)

    setSearchTerm('')
    searchRef.current?.focus()
  }

  const updateCartQty = (sku: string, priceField: string | undefined, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.sku !== sku || (c.priceField || '') !== (priceField || '')) return c
      // Usar stock bruto total (no effectiveStockMap que ya descuenta el carrito)
      const totalStock = stockMap.has(c.sku) ? (stockMap.get(c.sku) ?? c.stockDisponible) : c.stockDisponible
      const newQty = Math.max(1, c.cantidad + delta)
      if (delta > 0 && newQty > totalStock) {
        showToast(`Stock insuficiente: solo ${totalStock} ud${totalStock !== 1 ? 's' : ''} disponibles`, 'err')
        return c
      }
      return { ...c, cantidad: newQty, subtotal: newQty * c.precioUnitario * (1 - c.descuentoPct / 100) }
    }))
  }

  const setCartQty = (sku: string, priceField: string | undefined, qty: number) => {
    if (qty <= 0) { removeFromCart(sku, priceField); return }
    setCart(prev => prev.map(c => {
      if (c.sku !== sku || (c.priceField || '') !== (priceField || '')) return c
      // Usar stock bruto total
      const totalStock = stockMap.has(c.sku) ? (stockMap.get(c.sku) ?? c.stockDisponible) : c.stockDisponible
      const safeQty = Math.min(qty, totalStock)
      if (qty > totalStock) showToast(`Stock insuficiente: solo ${totalStock} ud${totalStock !== 1 ? 's' : ''} disponibles`, 'err')
      return { ...c, cantidad: safeQty, subtotal: safeQty * c.precioUnitario * (1 - c.descuentoPct / 100) }
    }))
  }

  const setCartDiscount = (sku: string, priceField: string | undefined, pct: number) => {
    const p = Math.max(0, Math.min(100, pct))
    setCart(prev => prev.map(c => {
      if (c.sku !== sku || (c.priceField || '') !== (priceField || '')) return c
      return { ...c, descuentoPct: p, subtotal: c.cantidad * c.precioUnitario * (1 - p / 100) }
    }))
  }

  const setCartPriceField = (sku: string, currentField: string | undefined, nextField: string) => {
    const product = products.get(sku)
    if (!product) return
    const priceOption = getPriceOptions(product).find((o: any) => o.field === nextField)
    if (!priceOption) return
    setCart(prev => prev.map(c => {
      if (c.sku !== sku || (c.priceField || '') !== (currentField || '')) return c
      return {
        ...c,
        priceField: priceOption.field,
        priceLabel: priceOption.label,
        precioUnitario: priceOption.value,
        subtotal: c.cantidad * priceOption.value * (1 - c.descuentoPct / 100),
      }
    }))
  }

  const removeFromCart = (sku: string, priceField?: string) => {
    setCart(prev => prev.filter(c => !(c.sku === sku && (c.priceField || '') === (priceField || ''))))
  }

  const restoreLastCart = () => {
    if (!lastSavedCart) return
    setCart(lastSavedCart.cart)
    setDescuentoGlobalPct(lastSavedCart.descuento || 0)
    setLastSavedCart(null)
    showToast('Carrito recuperado', 'ok')
  }

  // ─── Drafts ────────────────────────────────────────────────────────────────
  const handleSaveDraft = () => {
    if (cart.length === 0) { showToast('El carrito está vacío', 'err'); return }
    const num = drafts.length + 1
    const totalLabel = fmtCLP(cart.reduce((s, c) => s + c.subtotal, 0))
    const newDraft: CartDraft = {
      id: `draft_${Date.now()}`,
      label: `Borrador #${num} · ${totalLabel}`,
      cart: cart.map(c => ({ ...c })),
      descuentoGlobalPct,
      savedAt: Date.now(),
    }
    const updated = [...drafts, newDraft]
    setDrafts(updated)
    saveDraftsToStorage(sede, updated)
    setCart([])
    setDescuentoGlobalPct(0)
    setPagos([])
    showToast(`Borrador #${num} guardado`, 'ok')
  }

  const handleLoadDraft = (draft: CartDraft) => {
    setCart(draft.cart)
    setDescuentoGlobalPct(draft.descuentoGlobalPct)
    setPagos([])
    const updated = drafts.filter((d: any) => d.id !== draft.id)
    setDrafts(updated)
    saveDraftsToStorage(sede, updated)
    setShowDrafts(false)
    showToast('Borrador cargado', 'ok')
  }

  const handleDeleteDraft = (draftId: string) => {
    const updated = drafts.filter((d: any) => d.id !== draftId)
    setDrafts(updated)
    saveDraftsToStorage(sede, updated)
    showToast('Borrador eliminado', 'info')
  }

  // ─── Totals ────────────────────────────────────────────────────────────────
  const subtotalCart = useMemo(() => cart.reduce((sum, c) => sum + c.subtotal, 0), [cart])
  const descuentoGlobalMonto = useMemo(() => Math.round(subtotalCart * descuentoGlobalPct / 100), [subtotalCart, descuentoGlobalPct])
  const totalCart = useMemo(() => Math.round(subtotalCart - descuentoGlobalMonto), [subtotalCart, descuentoGlobalMonto])
  const totalItemsCount = useMemo(() => cart.reduce((s, c) => s + c.cantidad, 0), [cart])

  // Payment
  const totalPagado = useMemo(() => pagos.reduce((s, p) => s + p.monto, 0), [pagos])
  const restante = useMemo(() => Math.max(0, totalCart - totalPagado), [totalCart, totalPagado])
  const vuelto = useMemo(() => {
    if (splitMode) {
      return Math.max(0, totalPagado - totalCart)
    }
    const efectivoEntry = Number(montoRecibido) || 0
    return Math.max(0, efectivoEntry - totalCart)
  }, [montoRecibido, totalCart, splitMode, totalPagado])

  // ─── Caja operations ──────────────────────────────────────────────────────
  const handleAbrirCaja = async () => {
    if (!db || !sede) return
    const nombre = posUser ? posUser.nombre : cajeroNombre.trim()
    const monto = Number(montoApertura) || 0
    if (!nombre) { showToast('Ingresa el nombre del cajero', 'err'); return }
    try {
      await authReady
      const id = genId()
      const data: any = {
        sede,
        cajeroNombre: nombre,
        estado: 'abierta',
        montoApertura: monto,
        ventasCount: 0,
        totalVentas: 0,
        totalEfectivo: 0,
        totalDebito: 0,
        totalTransferencia: 0,
        aperturaAt: serverTimestamp(),
        fechaStr: todayStr(),
      }
      await setDoc(doc(db!, 'caja_sesiones', id), data)
      showToast(`Caja abierta por ${nombre}`, 'ok')
      setShowApertura(false)
      setCajeroNombre('')
      setMontoApertura('')
    } catch (e: any) {
      showToast(`Error: ${e.message}`, 'err')
    }
  }

  const handleCerrarCaja = async () => {
    if (!db || !sesionCaja) return
    const efectivoRealNum = Number(efectivoReal) || 0
    const gastosItems = itemsCierre.filter(it => it.tipo === 'gasto').map(it => ({ tipo: it.tipo, monto: Number(it.monto) || 0, detalle: it.detalle, boletaNumero: it.boletaNumero }))
    const anulacionesItems = itemsCierre.filter(it => it.tipo === 'anulacion').map(it => ({ tipo: it.tipo, monto: Number(it.monto) || 0, detalle: it.detalle, boletaNumero: it.boletaNumero }))
    const devolucionesItems = itemsCierre.filter(it => it.tipo === 'devolucion').map(it => ({ tipo: it.tipo, monto: Number(it.monto) || 0, detalle: it.detalle, boletaNumero: it.boletaNumero }))
    const totalGastos = gastosItems.reduce((s, it) => s + it.monto, 0)
    const totalAnulaciones = anulacionesItems.reduce((s, it) => s + it.monto, 0)
    const totalDevoluciones = devolucionesItems.reduce((s, it) => s + it.monto, 0)

    try {
      await authReady
      // Anular pre-ventas pendientes (no cobradas) de esta sesión de caja
      const preVentasPendientes = ventasHoy.filter((v: any) => v.estado === 'pre_venta' && v.sesionCajaId === sesionCaja.id)
      if (preVentasPendientes.length > 0) {
        await Promise.all(preVentasPendientes.map((pv: any) =>
          updateDoc(doc(db!, 'ventas_pos', pv.id), {
            estado: 'anulada',
            anuladaEn: serverTimestamp(),
            anuladaPor: 'cierre_caja_auto',
            motivoAnulacion: 'Pre-venta no cobrada al cierre de caja',
          }).catch(() => {})
        ))
      }
      const ventasCompletadas = ventasHoy.filter(v => v.estado === 'completada' && v.sesionCajaId === sesionCaja.id)

      const totalEfectivo = ventasCompletadas.reduce((sum, v) => {
        const ef = v.pagos?.find(p => p.metodo === 'efectivo')?.monto || 0
        return sum + ef
      }, 0)
      const totalDebito = ventasCompletadas.reduce((sum, v) => {
        const deb = v.pagos?.find(p => p.metodo === 'debito')?.monto || 0
        return sum + deb
      }, 0)
      const totalTransferencia = ventasCompletadas.reduce((sum, v) => {
        const tr = v.pagos?.find(p => p.metodo === 'transferencia')?.monto || 0
        return sum + tr
      }, 0)
      const totalVentas = totalEfectivo + totalDebito + totalTransferencia
      const totalVueltos = ventasCompletadas.reduce((sum, v) => sum + (v.vuelto || 0), 0)

      const efectivoTeorico = totalEfectivo + sesionCaja.montoApertura - totalVueltos
      const diferencia = efectivoRealNum - efectivoTeorico

      const ahora = new Date()
      const corteId = `corte_${sesionCaja.id}`
      const corteData = {
        id: corteId,
        sesionCajaId: sesionCaja.id,
        sede: sede,
        cajeroNombre: sesionCaja.cajeroNombre,
        aperturaAt: sesionCaja.aperturaAt,
        cierreAt: serverTimestamp(),
        fechaCierreStr: ahora.toLocaleDateString('es-CL'),
        horaCierreStr: ahora.toLocaleTimeString('es-CL'),
        montoApertura: sesionCaja.montoApertura,
        ventasCount: ventasCompletadas.length,
        totalEfectivo,
        totalDebito,
        totalTransferencia,
        totalVentas,
        totalVueltos,
        efectivoTeorico,
        efectivoReal: efectivoRealNum,
        gastos: totalGastos,
        gastosItems,
        anulacionesItems,
        devolucionesItems,
        totalAnulaciones,
        totalDevoluciones,
        diferencia,
        createdAt: serverTimestamp(),
      }

      await setDoc(doc(db!, 'cortes_caja', corteId), corteData)

      // Calcular ganancias por producto desde los items de las ventas (costoUnitario ya está guardado)
      const skuMap = new Map<string, { sku: string; nombre: string; cantidadVendida: number; ventasBrutas: number; costoNeto: number }>()
      for (const venta of ventasCompletadas) {
        for (const item of (venta.items || [])) {
          const sku = String(item.sku || '').trim().toUpperCase()
          if (!sku) continue
          const cur = skuMap.get(sku) || { sku, nombre: item.nombre || '', cantidadVendida: 0, ventasBrutas: 0, costoNeto: 0 }
          cur.cantidadVendida += item.cantidad || 0
          cur.ventasBrutas += item.subtotal || 0
          cur.costoNeto += Math.round((item.costoUnitario || 0) * (item.cantidad || 0))
          skuMap.set(sku, cur)
        }
      }
      const topProducts = Array.from(skuMap.values())
        .map(p => ({ ...p, ventasNetas: p.ventasBrutas - p.costoNeto }))
        .sort((a, b) => b.ventasBrutas - a.ventasBrutas)
        .slice(0, 50)

      const totalCostoProductos = topProducts.reduce((s, p) => s + p.costoNeto, 0)
      const gananciaProductos = topProducts.reduce((s, p) => s + p.ventasNetas, 0)

      // Escribir también en reports/{sede}/{yyyy}/{MM}/days/{dd} para que /_admin lo muestre
      const yyyy = String(ahora.getFullYear())
      const MM = String(ahora.getMonth() + 1).padStart(2, '0')
      const dd = String(ahora.getDate()).padStart(2, '0')
      const totalBruto = totalEfectivo + totalDebito + totalTransferencia
      const totalNeto = totalBruto - totalGastos
      // Escribir en ruta antigua
      const reportRef = doc(db!, 'reports', sede as string, yyyy, MM, 'days', dd)
      // Escribir también en ruta nueva para el Dashboard
      const reportRefNew = doc(db!, 'sedes', sede as string, 'reports', `${yyyy}-${MM}-${dd}`)
      const reportData = {
        sede: sede as string,
        fecha: `${yyyy}-${MM}-${dd}`,
        montos: {
          efectivoSistema: totalEfectivo,
          efectivoReal: efectivoRealNum,
          debitoSistema: totalDebito,
          debitoReal: totalDebito,
          transferencias: totalTransferencia,
        },
        calculos: {
          gastosTotales: totalGastos,
          totalBruto,
          totalNeto,
          diferenciaTotal: diferencia,
          diferenciaEfectivo: diferencia,
          diferenciaDebito: 0,
        },
        gastos: gastosItems.map(g => ({ monto: g.monto, observacion: g.detalle || '', boletaNumero: g.boletaNumero || '' })),
        anuladas: anulacionesItems.map(a => ({ monto: a.monto, observacion: a.detalle || '', boletaNumero: a.boletaNumero || '' })),
        devoluciones: devolucionesItems.map((d: any) => ({ monto: d.monto, observacion: d.detalle || '', boletaNumero: d.boletaNumero || '' })),
        ...(topProducts.length > 0 ? { topProducts, costoProductos: totalCostoProductos, gananciaProductos } : {}),
        fotos: [],
        estado: 'enviado',
        origenPOS: true,
        cajeroNombre: sesionCaja.cajeroNombre,
        ventasCount: ventasCompletadas.length,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }
      await setDoc(reportRef, reportData, { merge: true })
      await setDoc(reportRefNew, reportData, { merge: true })

      await updateDoc(doc(db!, 'caja_sesiones', sesionCaja.id), {
        estado: 'cerrada',
        cierreAt: serverTimestamp(),
        montoCierre: efectivoRealNum,
        ventasCount: ventasCompletadas.length,
        totalVentas,
        totalEfectivo,
        totalDebito,
        totalTransferencia,
      })

      showToast('Caja cerrada y corte guardado correctamente', 'ok')
      setShowCierre(false)
      setEfectivoReal('')
      setItemsCierre([])
    } catch (e: any) {
      showToast(`Error: ${e.message}`, 'err')
    }
  }

  // ─── Print receipt ─────────────────────────────────────────────────────────
  const printReceipt = (venta: VentaPOS, existingWindow?: Window | null, esPreVenta = false) => openReceiptPrintWindow({
    ventaId: venta.id,
    boletaNumero: Number(venta.boletaNumero) || 0,
    debitoOrdenNumero: venta.debitoOrdenNumero ?? null,
    cajero: venta.cajeroNombre,
    sedeNombre,
    fecha: venta.fecha?.toDate ? venta.fecha.toDate() : new Date(),
    subtotal: Number(venta.subtotal || 0),
    descuentoGlobalPct: Number(venta.descuentoGlobalPct || 0),
    descuentoGlobal: Number(venta.descuentoGlobal || 0),
    total: Number(venta.total || 0),
    vuelto: Number(venta.vuelto || 0),
    pagos: (venta.pagos || []).map(p => ({ metodo: p.metodo, monto: Number(p.monto || 0) })),
    items: (venta.items || []).map(it => ({
      sku: it.sku,
      nombre: it.nombre,
      cantidad: Number(it.cantidad || 0),
      precioUnitario: Number(it.precioUnitario || 0),
      subtotal: Number(it.subtotal || 0),
    })),
    esPreVenta,
  } as any)

  // ─── Complete Sale ─────────────────────────────────────────────────────────
  const handleCompleteSale = async () => {
    if (!db || !sede) return
    if (cart.length === 0) { showToast('Carrito vacío', 'err'); return }
    if (!sesionCaja) { showToast('Abre la caja primero', 'err'); return }
    if (processing) return

    // ═══ Modo jefe_cobra: cajera genera PRE-VENTA, no cobra ═══
    const esPreVenta = modoVentaPOS === 'jefe_cobra' && isCajera

    // Validate payment (solo si no es pre-venta)
    let finalPagos: PagoEntry[] = []
    if (!esPreVenta) {
      if (splitMode) {
        if (totalPagado < totalCart) {
          showToast(`Faltan ${fmtCLP(restante)} por pagar`, 'err')
          return
        }
        finalPagos = [...pagos]
      } else {
        const monto = Number(montoRecibido) || totalCart
        if (pagoActivo === 'efectivo' && monto < totalCart) {
          showToast(`Monto insuficiente. Faltan ${fmtCLP(totalCart - monto)}`, 'err')
          return
        }
        finalPagos = [{ metodo: pagoActivo, monto: pagoActivo === 'efectivo' ? monto : totalCart }]
      }
    }

    // ═══ Jefe cobrando pre-venta existente ═══
    const esCobroPreventa = isJefe && !!cobrandoPreventaId

    // Open popup before any async ops so browser doesn't block it
    const receiptWindow = openReceiptPrintWindow(null as any) as any
    setProcessing(true)
    try {
      await authReady
      const ventaId = esCobroPreventa ? cobrandoPreventaId! : genId()
      const ventaData: any = {
        sede,
        cajeroNombre: sesionCaja.cajeroNombre,
        sesionCajaId: sesionCaja.id,
        fecha: serverTimestamp(),
        fechaStr: todayStr(),
        items: cart.map(c => ({
          sku: c.sku,
          nombre: c.nombre,
          cantidad: c.cantidad,
          precioUnitario: c.precioUnitario,
          costoUnitario: c.costoUnitario,
          descuentoPct: c.descuentoPct,
          subtotal: Math.round(c.subtotal),
        })),
        subtotal: Math.round(subtotalCart),
        descuentoGlobalPct,
        descuentoGlobal: descuentoGlobalMonto,
        total: totalCart,
        pagos: esPreVenta ? [] : finalPagos.map(p => ({ metodo: p.metodo, monto: Math.round(p.monto) })),
        vuelto: esPreVenta ? 0 : (splitMode ? Math.max(0, totalPagado - totalCart) : Math.max(0, (Number(montoRecibido) || totalCart) - totalCart)),
        estado: esPreVenta ? 'pre_venta' : 'completada',
        modoVenta: modoVentaPOS,
        createdAt: serverTimestamp(),
      }
      if (esCobroPreventa) {
        ventaData.cobradoPorJefe = true
        ventaData.jefeNombre = posUser?.nombre || ''
        ventaData.cobradaEn = serverTimestamp()
      }

      let receiptCounters: ReceiptCounters = { boletaNumero: 0, debitoOrdenNumero: null }

      if (esPreVenta) {
        // PRE-VENTA: no descontar stock, no asignar boleta real, no actualizar totales de caja
        ventaData.boletaNumero = 0
        ventaData.debitoOrdenNumero = null
        await setDoc(doc(db!, 'ventas_pos', ventaId), ventaData)
      } else {
        // VENTA NORMAL o cobro de pre-venta: descontar stock + actualizar caja
        const stockUpdates = cart.map(async (item) => {
          const stockId = `${sede}__${item.sku}`
          const stockRef = doc(db!, 'stock', stockId)
          try {
            await updateDoc(stockRef, { stock: increment(-item.cantidad) })
          } catch {
            try {
              const snap = await getDoc(stockRef)
              if (!snap.exists()) {
                await setDoc(stockRef, { sku: item.sku, sede, stock: -item.cantidad })
              }
            } catch {}
          }
        })
        await Promise.all(stockUpdates)

        const efectivoTotal = finalPagos.filter(p => p.metodo === 'efectivo').reduce((s, p) => s + p.monto, 0)
        const debitoTotal = finalPagos.filter(p => p.metodo === 'debito').reduce((s, p) => s + p.monto, 0)
        const transTotal = finalPagos.filter(p => p.metodo === 'transferencia').reduce((s, p) => s + p.monto, 0)
        receiptCounters = await nextReceiptCounters(finalPagos)
        ventaData.boletaNumero = receiptCounters.boletaNumero
        ventaData.debitoOrdenNumero = receiptCounters.debitoOrdenNumero

        if (esCobroPreventa) {
          // Actualizar venta existente (mantener id original de la pre-venta)
          await setDoc(doc(db!, 'ventas_pos', ventaId), ventaData, { merge: true })
        } else {
          await setDoc(doc(db!, 'ventas_pos', ventaId), ventaData)
        }
        await updateDoc(doc(db!, 'caja_sesiones', sesionCaja.id), {
          ventasCount: increment(1),
          totalVentas: increment(totalCart),
          totalEfectivo: increment(efectivoTotal),
          totalDebito: increment(debitoTotal),
          totalTransferencia: increment(transTotal),
        })
      }

      // Print receipt
      const vuelto = esPreVenta ? 0 : (splitMode ? Math.max(0, totalPagado - totalCart) : Math.max(0, (Number(montoRecibido) || totalCart) - totalCart))
      const completedVenta: VentaPOS = {
        id: ventaId,
        sede,
        cajeroNombre: sesionCaja.cajeroNombre,
        sesionCajaId: sesionCaja.id,
        fecha: Timestamp.fromDate(new Date()),
        fechaStr: todayStr(),
        items: cart.map(c => ({
          sku: c.sku,
          nombre: c.nombre,
          cantidad: c.cantidad,
          precioUnitario: c.precioUnitario,
          costoUnitario: c.costoUnitario,
          descuentoPct: c.descuentoPct,
          subtotal: Math.round(c.subtotal),
        })),
        subtotal: Math.round(subtotalCart),
        descuentoGlobalPct,
        descuentoGlobal: descuentoGlobalMonto,
        total: totalCart,
        pagos: esPreVenta ? [] : finalPagos.map(p => ({ metodo: p.metodo, monto: Math.round(p.monto) })),
        vuelto,
        estado: esPreVenta ? ('pre_venta' as any) : 'completada',
        boletaNumero: receiptCounters.boletaNumero,
        debitoOrdenNumero: receiptCounters.debitoOrdenNumero,
        createdAt: Timestamp.fromDate(new Date()),
      }
      if (!esPreVenta) setLastPrintedSale(completedVenta)
      printReceipt(completedVenta, receiptWindow, esPreVenta)

      // Clear cart
      setCart([])
      setDescuentoGlobalPct(0)
      setMontoRecibido('')
      setPagos([])
      setLastSavedCart(null)
      setSplitMode(false)
      if (esCobroPreventa) setCobrandoPreventaId(null)
      showToast(
        esPreVenta
          ? `Pre-venta ${fmtCLP(totalCart)} enviada al jefe ✓`
          : esCobroPreventa
            ? `Pre-venta cobrada ${fmtCLP(totalCart)} ✓`
            : `Venta ${fmtCLP(totalCart)} completada ✓`,
        'ok'
      )
      searchRef.current?.focus()
    } catch (e: any) {
      showToast(`Error al guardar: ${e.message}`, 'err')
    } finally {
      setProcessing(false)
    }
  }

  // ─── Editar método de pago ─────────────────────────────────────────────────
  const EDIT_PAGO_PIN = '988189813'

  const openEditPago = (v: VentaPOS) => {
    setEditPagoTarget(v)
    setEditPagoPin('')
    setEditPagoPinError(false)
    setEditPagoPinOk(false)
    // Pre-seleccionar el método actual (el primero si hay varios)
    const current = (v.pagos?.[0]?.metodo as MetodoPago) || 'efectivo'
    setEditPagoMetodo(current)
  }

  const handleEditPagoPin = () => {
    if (editPagoPin !== EDIT_PAGO_PIN) {
      setEditPagoPinError(true)
      setEditPagoPin('')
      return
    }
    setEditPagoPinError(false)
    setEditPagoPinOk(true)
  }

  const handleEditPagoSave = async () => {
    if (!editPagoTarget || !db) return
    setEditPagoSaving(true)
    try {
      await authReady
      // Reconstruir pagos con nuevo método, manteniendo montos
      const newPagos = (editPagoTarget.pagos || []).map((p: any, i: number) =>
        i === 0 ? { ...p, metodo: editPagoMetodo } : p
      )
      // Si solo hay un pago, simplemente reemplazar todo
      const finalPagos = editPagoTarget.pagos?.length === 1
        ? [{ metodo: editPagoMetodo, monto: editPagoTarget.total }]
        : newPagos

      await updateDoc(doc(db!, 'ventas_pos', editPagoTarget.id), { pagos: finalPagos })

      // Actualizar sesión de caja si corresponde
      if (sesionCaja && editPagoTarget.sesionCajaId === sesionCaja.id) {
        const oldEf = (editPagoTarget.pagos || []).filter((p: any) => p.metodo === 'efectivo').reduce((s: number, p: any) => s + (p.monto || 0), 0)
        const oldDb = (editPagoTarget.pagos || []).filter((p: any) => p.metodo === 'debito').reduce((s: number, p: any) => s + (p.monto || 0), 0)
        const oldTr = (editPagoTarget.pagos || []).filter((p: any) => p.metodo === 'transferencia').reduce((s: number, p: any) => s + (p.monto || 0), 0)
        const newEf = finalPagos.filter(p => p.metodo === 'efectivo').reduce((s, p) => s + (p.monto || 0), 0)
        const newDb = finalPagos.filter(p => p.metodo === 'debito').reduce((s, p) => s + (p.monto || 0), 0)
        const newTr = finalPagos.filter(p => p.metodo === 'transferencia').reduce((s, p) => s + (p.monto || 0), 0)
        await updateDoc(doc(db!, 'caja_sesiones', sesionCaja.id), {
          totalEfectivo: increment(newEf - oldEf),
          totalDebito: increment(newDb - oldDb),
          totalTransferencia: increment(newTr - oldTr),
        })
      }

      showToast('Método de pago actualizado', 'ok')
      setEditPagoTarget(null)
    } catch (e: any) {
      showToast(`Error: ${e.message}`, 'err')
    }
    setEditPagoSaving(false)
  }

  // ─── Anular venta ──────────────────────────────────────────────────────────
  const handleAnular = async (venta: VentaPOS) => {
    if (!db || !confirm(`¿Anular venta por ${fmtCLP(venta.total)}?`)) return
    try {
      await authReady
      await updateDoc(doc(db!, 'ventas_pos', venta.id), { estado: 'anulada' })
      // Restore stock
      for (const item of (venta.items || [])) {
        const stockId = `${sede}__${item.sku}`
        try {
          await updateDoc(doc(db!, 'stock', stockId), { stock: increment(item.cantidad) })
        } catch {}
      }
      // Update caja session
      if (sesionCaja && venta.sesionCajaId === sesionCaja.id) {
        const ef = (venta.pagos || []).filter((p: any) => p.metodo === 'efectivo').reduce((s: number, p: any) => s + (p.monto || 0), 0)
        const db2 = (venta.pagos || []).filter((p: any) => p.metodo === 'debito').reduce((s: number, p: any) => s + (p.monto || 0), 0)
        const tr = (venta.pagos || []).filter((p: any) => p.metodo === 'transferencia').reduce((s: number, p: any) => s + (p.monto || 0), 0)
        await updateDoc(doc(db!, 'caja_sesiones', sesionCaja.id), {
          ventasCount: increment(-1),
          totalVentas: increment(-venta.total),
          totalEfectivo: increment(-ef),
          totalDebito: increment(-db2),
          totalTransferencia: increment(-tr),
        })
      }
      showToast('Venta anulada y stock restaurado', 'info')
    } catch (e: any) {
      showToast(`Error: ${e.message}`, 'err')
    }
  }

  // ─── Add split payment ─────────────────────────────────────────────────────
  const addSplitPago = () => {
    const monto = Number(montoRecibido)
    if (!monto || monto <= 0) return
    setPagos(prev => [...prev, { metodo: pagoActivo, monto }])
    setMontoRecibido('')
  }

  // ─── Barcode detection (auto-submit on Enter from search) ──────────────────
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const term = searchTerm.trim().toUpperCase()
      // Exact SKU match → add directly
      const exact = products.get(term)
      if (exact) {
        addToCart({ ...exact, stock: stockMap.get(term) || 0 })
        setSearchTerm('')
        return
      }
      // Exact codigo_barra match → add directly
      let cbMatch: (ProductDoc & { stock: number }) | undefined
      products.forEach(p => {
        if ((p.codigo_barra || '').trim().toUpperCase() === term) {
          cbMatch = { ...p, stock: stockMap.get(p.sku) || 0 }
        }
      })
      if (cbMatch) {
        addToCart(cbMatch)
        setSearchTerm('')
        return
      }
      // If only 1 result, add it
      if (filteredProducts.length === 1) {
        addToCart(filteredProducts[0])
        return
      }
    }
  }

  const handleBarcodeDetected = (code: string) => {
    setShowBarcodeScanner(false)
    const term = code.trim().toUpperCase()
    // 1. Exact SKU match
    const exactSku = products.get(term)
    if (exactSku) {
      addToCart({ ...exactSku, stock: stockMap.get(term) || 0 })
      showToast(`✅ ${exactSku.nombre}`, 'ok')
      return
    }
    // 2. Exact codigo_barra match
    let cbMatch: (ProductDoc & { stock: number }) | undefined
    products.forEach(p => {
      if ((p.codigo_barra || '').trim().toUpperCase() === term) {
        cbMatch = { ...p, stock: stockMap.get(p.sku) || 0 }
      }
    })
    if (cbMatch) {
      addToCart(cbMatch)
      showToast(`✅ ${cbMatch.nombre}`, 'ok')
      return
    }
    // 3. Fallback: put in search bar
    setSearchTerm(code.trim())
    showToast(`Código ${code} — sin coincidencia`, 'info')
  }

  // ─── Quick amounts for cash ────────────────────────────────────────────────
  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

  // ─── Sales summary ─────────────────────────────────────────────────────────
  const ventasCompletadas = useMemo(() => ventasHoy.filter(v => v.estado === 'completada'), [ventasHoy])
  const totalVentasHoy = useMemo(() => ventasCompletadas.reduce((s, v) => s + (v.total || 0), 0), [ventasCompletadas])

  // ─── RENDER ────────────────────────────────────────────────────────────────
  if (!sede || !SEDES[sede]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-xl shadow-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Punto de Venta</h1>
          </div>
          <p className="text-slate-500 text-sm mb-6 ml-1">Selecciona la sucursal para abrir el POS:</p>
          <div className="space-y-3">
            {Object.entries(SEDES).map(([slug, name]) => (
              <button key={slug} onClick={() => router.push(`/pos/${slug}`)}
                className="w-full flex items-center gap-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl px-4 py-4 text-left transition-all group shadow-sm hover:shadow-md">
                <div className="w-9 h-9 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center shrink-0 transition">
                  <Store size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-slate-800 font-semibold">{name}</div>
                  <div className="text-slate-400 text-xs">{slug}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── POS Loading Screen ────────────────────────────────────────────────────
  if (loginLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-48 h-48 sm:w-64 sm:h-64">
          <RefreshCw className='animate-spin' />
        </div>
        <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">Cargando punto de venta...</p>
        {/* Barra de progreso indeterminada */}
        <div className="mt-3 w-48 sm:w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-[loadingBar_1.5s_ease-in-out_infinite] rounded-full" style={{ width: '40%' }} />
        </div>
        <style>{`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(150%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    )
  }

  // ─── POS Login Screen ──────────────────────────────────────────────────────
  const anyHasPassword = loginUsers.some(u => !!u.posPassword)
  if (!posUser && anyHasPassword && !loginLoading) {
    const selectedUser = loginUsers.find(u => u.id === loginSelected)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 flex flex-col items-center justify-center px-4 py-8">
        <button onClick={() => router.push(`/pos-admin/${sede || 'alameda'}`)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition">
          <ChevronLeft size={24} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-4">
            <Store size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Punto de Venta</h2>
          <p className="text-sm text-gray-500 mt-1">{sedeNombre}</p>
          <p className="text-xs text-gray-400 mt-0.5">Selecciona tu cuenta para ingresar</p>
        </div>

        {!loginSelected ? (
          <>
            {/* User circles */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 max-w-lg">
              {loginUsers.filter(u => !!u.posPassword).map(u => {
                const isCaj = u.cargo.toUpperCase().includes('CAJER')
                const cargoUp = u.cargo.toUpperCase()
                const isFemale = cargoUp.includes('CAJERA') || cargoUp.includes('VENDEDORA')
                const ringColor = isFemale ? 'ring-pink-300 hover:ring-pink-400' : 'ring-blue-300 hover:ring-blue-400'
                return (
                  <div key={u.id} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => { setLoginSelected(u.id); setLoginPassword(''); setLoginError('') }}
                      className={`relative w-20 h-20 rounded-full overflow-hidden shadow-lg ring-4 ${ringColor} hover:scale-110 hover:shadow-xl active:scale-95 transition-all cursor-pointer`}
                    >
                      {u.fotoUrl ? (
                        <img src={u.fotoUrl} alt={u.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-2xl font-bold text-white ${isCaj ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                    <span className="text-sm font-semibold text-gray-800">{u.nombre}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCaj ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {isCaj ? '💰 Cajera' : '🛍️ Vendedora'}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <>
            {/* Password input */}
            <div className="w-full max-w-xs">
              <div className="flex flex-col items-center mb-6">
                <div className={`relative w-20 h-20 rounded-full overflow-hidden shadow-lg ring-4 mb-3 ${
                  selectedUser && (selectedUser.cargo.toUpperCase().includes('CAJERA') || selectedUser.cargo.toUpperCase().includes('VENDEDORA'))
                    ? 'ring-pink-300' : 'ring-blue-300'
                }`}>
                  {selectedUser?.fotoUrl ? (
                    <img src={selectedUser.fotoUrl} alt={selectedUser.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl font-bold text-white">
                      {selectedUser?.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="font-bold text-gray-900">{selectedUser?.nombre}</div>
                <div className="text-xs text-gray-500">{selectedUser?.cargo}</div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={loginShowPw ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => { setLoginPassword(e.target.value); setLoginError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') handlePosLogin() }}
                    placeholder="Contraseña"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 pr-10"
                    autoFocus
                  />
                  <button type="button" onClick={() => setLoginShowPw(!loginShowPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {loginShowPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginError && <p className="text-xs text-red-500 text-center">{loginError}</p>}
                <button
                  onClick={handlePosLogin}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition active:scale-[0.98]"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => { setLoginSelected(null); setLoginPassword(''); setLoginError('') }}
                  className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition"
                >
                  ← Elegir otra persona
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden select-none">
      {/* ─── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-3 lg:px-6 py-2.5 lg:py-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 lg:gap-4 min-w-0">
          <button onClick={() => router.push(`/pos-admin/${sede || 'alameda'}`)} className="text-gray-400 hover:text-gray-600 transition shrink-0">
            <ChevronLeft size={22} />
          </button>
          {/* Mobile: user avatar + name + sucursal */}
          <div className="flex lg:hidden items-center gap-2 min-w-0">
            {posUser ? (
              <>
                {posUser.fotoUrl ? (
                  <img src={posUser.fotoUrl} alt={posUser.nombre} className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-gray-200" />
                ) : (
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ${posUser.role === 'cajera' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                    {posUser.nombre.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-sm text-gray-900 truncate leading-tight">{posUser.nombre}</div>
                  <div className="text-[10px] text-gray-500 truncate leading-tight">{sedeNombre}</div>
                </div>
              </>
            ) : (
              <div className="min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">{sedeNombre}</div>
                <div className="text-[10px] text-gray-500">Punto de Venta</div>
              </div>
            )}
          </div>
          {/* Desktop: user photo + name + sede */}
          {posUser && (
            <div className="hidden lg:flex items-center gap-3 min-w-0">
              {posUser.fotoUrl ? (
                <img src={posUser.fotoUrl} alt={posUser.nombre} className="w-14 h-14 rounded-full object-cover ring-4 ring-sky-200 shadow-md" />
              ) : (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md ${posUser.role === 'cajera' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                  {posUser.nombre.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-bold text-lg text-gray-900 truncate">{posUser.nombre}</div>
                <div className="text-xs text-gray-500">{sedeNombre}</div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 lg:gap-4">
          {/* Pending sales avatars grouped by vendedora (desktop cajera) */}
          {isCajera && pendingSales.length > 0 && (
            <div className="hidden lg:flex items-center gap-3">
              {(() => {
                const grouped = new Map<string, typeof pendingSales>()
                pendingSales.forEach(sale => {
                  const existing = grouped.get(sale.vendedoraId) || []
                  grouped.set(sale.vendedoraId, [...existing, sale])
                })
                return Array.from(grouped.entries()).map(([vendedoraId, sales]) => {
                  const vendedoraUser = loginUsers.find(u => u.id === vendedoraId)
                  const count = sales.length
                  return (
                    <button
                      key={`avatar_${vendedoraId}`}
                      onClick={() => setShowPendingSales(true)}
                      className="relative group"
                      title={`${sales[0].vendedoraNombre} - ${count} pedido${count > 1 ? 's' : ''}`}
                    >
                      {vendedoraUser?.fotoUrl ? (
                        <img
                          src={vendedoraUser.fotoUrl}
                          alt={sales[0].vendedoraNombre}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400 hover:ring-4 transition-all animate-pulse shadow-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-lg font-bold ring-2 ring-blue-400 hover:ring-4 transition-all animate-pulse shadow-lg">
                          {(sales[0].vendedoraNombre || '?').charAt(0)}
                        </div>
                      )}
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center px-1">
                        <span className="text-[10px] font-bold text-white">{count}</span>
                      </span>
                    </button>
                  )
                })
              })()}
            </div>
          )}
          {sesionCaja && (
            <>
              <div className="flex lg:hidden items-center gap-1 bg-green-50 rounded-full px-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-green-700">{fmtN(sesionCaja.ventasCount)} ventas</span>
              </div>
              <div className="hidden lg:flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="text-sm">
                  <div className="font-semibold text-green-900">Caja abierta</div>
                  <div className="text-xs text-green-600">{fmtN(sesionCaja.ventasCount)} ventas</div>
                </div>
              </div>
            </>
          )}
          {!sesionCaja && !isVendedora && (
            <>
              <div className="flex lg:hidden items-center gap-1 bg-red-50 rounded-full px-2 py-0.5">
                <Lock size={9} className="text-red-500" />
                <span className="text-[9px] font-bold text-red-700">Cerrada</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                <Lock size={14} className="text-red-500" />
                <span className="text-sm font-medium text-red-700">Cerrada</span>
              </div>
            </>
          )}
          {/* Pending sales badge */}
          {isCajera && pendingSales.length > 0 && (
            <button
              onClick={() => setShowPendingSales(true)}
              className="relative lg:hidden flex items-center gap-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full px-2 py-0.5 transition"
              title="Ventas pendientes de vendedoras"
            >
              <Send size={11} className="text-blue-600" />
              <span className="text-[9px] font-bold text-blue-700">{pendingSales.length}</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
            </button>
          )}
          {/* Pre-ventas badge para JEFE */}
          {isJefe && (
            <button
              onClick={() => setShowPreVentas(true)}
              className="relative flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-lg px-2.5 py-1.5 lg:px-3 lg:py-2 transition font-semibold"
              title="Pre-ventas pendientes de cobro"
            >
              <Receipt size={14} className="text-amber-600" />
              <span className="text-xs">Pre-ventas</span>
              {preVentas.length > 0 && (
                <>
                  <span className="bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{preVentas.length}</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setShowHistory(true)}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition p-1.5"
            title="Ventas de hoy"
          >
            <Clock size={18} />
          </button>
          <button
            onClick={() => router.push(`/pos/${sede}/historial`)}
            className="hidden md:inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-blue-400 text-sm text-gray-700 rounded-lg px-3 py-2 transition-colors"
          >
            <BarChart3 size={16} className="text-blue-600" /> Historial
          </button>
          {posUser && (
            <button
              onClick={openCustomerVisualizer}
              className="hidden md:inline-flex items-center gap-2 bg-cyan-50 border border-cyan-300 hover:border-cyan-500 text-sm text-cyan-700 rounded-lg px-3 py-2 transition-colors"
              title="Abrir pantalla cliente para segundo monitor"
            >
              <Monitor size={16} className="text-cyan-600" /> Cliente
            </button>
          )}
          <button
            onClick={() => setShowDrafts(true)}
            className="hidden md:inline-flex items-center gap-2 bg-amber-50 border border-amber-300 hover:border-amber-400 text-sm text-amber-700 rounded-lg px-3 py-2 transition-colors relative"
          >
            <FolderOpen size={16} className="text-amber-600" /> Borradores
            {drafts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{drafts.length}</span>
            )}
          </button>
          {lastPrintedSale && (
            <button
              onClick={() => printReceipt(lastPrintedSale)}
              className="hidden lg:inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-emerald-400 text-sm text-gray-700 rounded-lg px-3 py-2 transition-colors"
            >
              <Receipt size={16} className="text-emerald-600" /> Reimprimir
            </button>
          )}
          <div className="hidden lg:block text-sm font-mono text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">{clock}</div>
          <button onClick={toggleFullscreen} className="hidden lg:block text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg">
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          {posUser && (
            <button
              onClick={handlePosLogout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition p-1.5 lg:px-2 lg:py-1.5 lg:rounded-lg lg:hover:bg-red-50"
              title={`Cerrar sesión (${posUser.nombre})`}
            >
              <LogOut size={16} />
              <span className="hidden lg:inline text-xs font-medium">Salir</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner: cajera en modo jefe_cobra */}
      {isCajera && modoVentaPOS === 'jefe_cobra' && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-300 px-3 lg:px-6 py-2 flex items-center gap-2 text-amber-900 text-xs lg:text-sm">
          <Receipt size={14} className="text-amber-700 shrink-0" />
          <span><strong>Modo PRE-VENTA activo:</strong> al finalizar, la boleta se imprime como pre-venta y el jefe debe cobrar. El stock se descuenta solo cuando el jefe procesa el pago.</span>
        </div>
      )}
      {/* Banner: jefe cobrando pre-venta */}
      {isJefe && cobrandoPreventaId && (
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border-b border-emerald-300 px-3 lg:px-6 py-2 flex items-center gap-2 text-emerald-900 text-xs lg:text-sm">
          <CheckCircle size={14} className="text-emerald-700 shrink-0" />
          <span><strong>Cobrando pre-venta {cobrandoPreventaId.slice(-6).toUpperCase()}:</strong> elige el método de pago y procesa. Al confirmar se descontará stock y emitirá la boleta final.</span>
          <button
            onClick={() => { setCobrandoPreventaId(null); setCart([]); setDescuentoGlobalPct(0); }}
            className="ml-auto text-xs bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-700 rounded-md px-2 py-1 font-semibold"
          >Cancelar</button>
        </div>
      )}

      {/* ─── Main area: 3 columns (desktop) / tabs (mobile) ─────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0 pb-14 lg:pb-0">

        {/* ═══ LEFT: Products search + grid ═══════════════════════════════ */}
        <div className={`flex-1 flex flex-col border-r border-gray-200 min-w-0 bg-gradient-to-b from-slate-50 to-blue-50/30 lg:bg-white ${mobileTab !== 'products' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Search bar */}
          <div className="p-3 lg:p-4 border-b border-blue-100 lg:border-gray-200 bg-white/80 lg:bg-white backdrop-blur-sm">
            <div className="relative">
              <ScanBarcode size={18} className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-blue-400 lg:text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Buscar producto..."
                className="w-full bg-white border-2 border-blue-200 lg:border-gray-300 rounded-xl pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm lg:text-base shadow-sm"
                autoComplete="off"
              />
              {searchTerm ? (
                <button onClick={() => { setSearchTerm(''); searchRef.current?.focus() }}
                  className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  <X size={18} />
                </button>
              ) : (
                <div className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 lg:hidden">
                  <button
                    onClick={() => setShowBarcodeScanner(true)}
                    className="text-blue-400 hover:text-blue-600 transition"
                    title="Escanear código de barras"
                  >
                    <Camera size={18} />
                  </button>
                  <button
                    onClick={() => setShowOCRScanner(true)}
                    className="text-purple-400 hover:text-purple-600 transition"
                    title="Leer texto con cámara (OCR)"
                  >
                    <ScanText size={18} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] lg:text-xs text-gray-500">Ocultar sin stock</span>
              <button onClick={() => setHideNoStock(v => !v)} className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${hideNoStock ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${hideNoStock ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] lg:text-xs text-gray-500" title="Sincroniza el carrito entre telefono y PC">Sync multi-dispositivo</span>
              <button onClick={toggleCartSync} className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${cartSyncEnabled && !modoLento ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${cartSyncEnabled && !modoLento ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] lg:text-xs text-amber-600 font-semibold" title="Desactiva sync y reduce consultas. Ideal con internet lento">Modo internet lento</span>
              <button onClick={toggleModoLento} className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${modoLento ? 'bg-amber-400' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${modoLento ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Product list */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2">
            {loadingProducts && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-48 h-48 sm:w-64 sm:h-64">
                  <RefreshCw className='animate-spin' />
                </div>
                <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">Cargando productos...</p>
                {/* Barra de progreso indeterminada */}
                <div className="mt-3 w-48 sm:w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-[loadingBar_1.5s_ease-in-out_infinite] rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            )}
            {!loadingProducts && searchTerm && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Package size={48} className="mb-3 opacity-40" />
                <span className="text-base lg:text-lg font-medium">No se encontraron productos</span>
                <span className="text-xs lg:text-sm text-gray-500 mt-1">Intenta con otro término</span>
              </div>
            )}
            {!loadingProducts && !searchTerm && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-amber-500" />
                    <h3 className="text-[11px] lg:text-xs font-bold text-gray-700">Atajos rápidos</h3>
                    <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{quickTopProducts.length}</span>
                  </div>
                </div>
                {quickTopProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 lg:py-16 text-gray-400">
                    <ScanBarcode size={40} className="mb-2 opacity-20" />
                    <span className="text-sm lg:text-base font-medium text-gray-600">Busca un producto</span>
                    <span className="text-[10px] lg:text-xs text-gray-500 mt-1">Escanea código o escribe nombre</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-1.5 lg:gap-2">
                    {quickTopProducts.map((p) => {
                      return (
                      <button
                        key={p.sku}
                        onClick={() => addToCart(p, selectedPriceBySku[p.sku] || getDefaultPriceOption(p)?.field)}
                        className="w-full rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 active:scale-[0.97] px-2 py-2 lg:px-2.5 lg:py-2.5 text-left transition-all duration-150 relative overflow-hidden"
                      >
                        {p.imageUrl && (
                          <img
                            src={p.imageUrl} alt={p.nombre}
                            className="w-full h-20 object-cover rounded-md mb-1.5 cursor-zoom-in active:scale-95 transition-transform"
                            loading="lazy"
                            onClick={e => { e.stopPropagation(); setLightboxUrl(p.imageUrl!) }}
                          />
                        )}
                        <div className="font-semibold text-gray-900 text-[11px] lg:text-[12px] leading-tight line-clamp-1 mb-1">{p.nombre}</div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] lg:text-xs text-blue-600">{fmtCLP(getPrice(p))}</span>
                          <span className="text-[8px] lg:text-[9px] text-gray-400">{fmtN(p.cantidadVendidaHoy)}x</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-[8px] text-gray-400">{p.sku}</span>
                          <div className={`px-1 py-0 rounded text-[8px] font-bold ${
                            p.stock > 10 ? 'bg-green-100 text-green-700' :
                            p.stock > 0 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {p.stock > 0 ? `${fmtN(p.stock)}u` : '0'}
                          </div>
                        </div>
                        {getPriceOptions(p).length > 1 && (
                          <select
                            data-price-select
                            value={selectedPriceBySku[p.sku] || getDefaultPriceOption(p)?.field || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { e.stopPropagation(); setSelectedPriceBySku(prev => ({ ...prev, [p.sku]: e.target.value })) }}
                            className="w-full bg-gray-50 border border-gray-200 rounded px-1 py-0.5 text-[9px] text-gray-600 mt-1"
                          >
                            {getPriceOptions(p).map((opt) => (
                              <option key={opt.field} value={opt.field}>{opt.label} · {fmtCLP(opt.value)}</option>
                            ))}
                          </select>
                        )}
                      </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
            {filteredProducts.map(p => (
              <button key={p.sku} onClick={() => addToCart(p, selectedPriceBySku[p.sku] || getDefaultPriceOption(p)?.field)}
                className="w-full animated-gradient bg-gradient-to-r from-white via-sky-50/30 to-white hover:bg-white/90 border border-sky-100/30 hover:border-sky-200/50 rounded-xl text-left transition-all duration-200 group shadow-sm hover:shadow-md active:scale-[0.98] overflow-hidden">
                <div className="flex items-stretch">
                  {/* Color accent bar on mobile */}
                  <div className="w-1 lg:w-0 bg-gradient-to-b from-sky-300 to-sky-400 shrink-0 rounded-l-xl" />
                  <div className="flex-1 flex items-center gap-2.5 px-3 py-3">
                    {/* Imagen del producto */}
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl} alt={p.nombre}
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg object-cover shrink-0 border border-gray-100 active:scale-95 transition-transform cursor-zoom-in"
                        loading="lazy"
                        onClick={e => { e.stopPropagation(); setLightboxUrl(p.imageUrl!) }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-[13px] lg:text-sm leading-snug line-clamp-2 mb-1">{p.nombre}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-blue-600 font-bold text-sm">{fmtCLP(getPrice(p))}</span>
                        <span className="font-mono text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{p.sku}</span>
                        {p.costo_uni > 0 && <span className="text-gray-400 text-[9px] hidden sm:inline">C: {fmtCLP(p.costo_uni)}</span>}
                        <div className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                          p.stock > 10 ? 'bg-green-100 text-green-700' :
                          p.stock > 0 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.stock > 0 ? `${fmtN(p.stock)} uds` : 'Agotado'}
                        </div>
                      </div>
                      {getPriceOptions(p).length > 1 && (
                        <div className="mt-1.5 max-w-[210px]">
                          <select
                            data-price-select
                            value={selectedPriceBySku[p.sku] || getDefaultPriceOption(p)?.field || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { e.stopPropagation(); setSelectedPriceBySku(prev => ({ ...prev, [p.sku]: e.target.value })) }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-gray-700 focus:outline-none focus:border-blue-500"
                          >
                            {getPriceOptions(p).map((opt) => (
                              <option key={opt.field} value={opt.field}>{opt.label} · {fmtCLP(opt.value)}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                      <Plus size={18} className="text-blue-500 group-hover:text-blue-600" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom bar: shortcuts (desktop only) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
            <span className="bg-white border border-gray-300 px-2 py-1 rounded font-mono">F1</span> <span className="text-gray-600">Efectivo</span>
            <span className="bg-white border border-gray-300 px-2 py-1 rounded font-mono ml-3">F2</span> <span className="text-gray-600">Débito</span>
            <span className="bg-white border border-gray-300 px-2 py-1 rounded font-mono ml-3">F3</span> <span className="text-gray-600">Transfer</span>
            <span className="bg-white border border-gray-300 px-2 py-1 rounded font-mono ml-3">F8</span> <span className="text-gray-600">Limpiar</span>
          </div>
        </div>

        {/* ═══ CENTER: Cart ═══════════════════════════════════════════════ */}
        <div className={`w-full lg:w-[420px] flex-col bg-white border-r border-gray-200 lg:shrink-0 ${mobileTab !== 'cart' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Cart header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-blue-600" />
              <span className="font-bold text-lg text-gray-900">Carrito</span>
              {totalItemsCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">{totalItemsCount}</span>
              )}
              {cart.length > 0 && (
                <button
                  onClick={handleSaveDraft}
                  title="Guardar como borrador"
                  className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-700 text-xs font-medium rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  <BookMarked size={14} /> Guardar
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button onClick={() => { setCart([]); setDescuentoGlobalPct(0); setPagos([]) }}
                  className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1.5 font-medium">
                  <Trash2 size={16} /> Vaciar
                </button>
              )}
              {cart.length === 0 && lastSavedCart && (
                <button onClick={restoreLastCart}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1.5 font-medium">
                  <RotateCcw size={16} /> Recuperar última venta
                </button>
              )}
            </div>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart size={48} className="mb-3 opacity-20" />
                <span className="text-lg font-medium text-gray-500">Carrito vacío</span>
                <span className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <div key={`${item.sku}-${item.priceField || 'default'}`} className="px-4 py-3 hover:bg-white/80 transition animated-gradient bg-gradient-to-r from-white via-sky-50/30 to-white border-b border-sky-100/30">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 text-xs mt-1 w-5 text-right shrink-0 font-medium">{idx + 1}</span>
                      {products.get(item.sku)?.imageUrl && (
                        <img
                          src={products.get(item.sku)!.imageUrl}
                          alt={item.nombre}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100 cursor-zoom-in active:scale-95 transition-transform mt-0.5"
                          loading="lazy"
                          onClick={() => setLightboxUrl(products.get(item.sku)!.imageUrl!)}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{item.nombre}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.sku} · {fmtCLP(item.precioUnitario)} c/u</div>
                        {products.get(item.sku) && getPriceOptions(products.get(item.sku)!).length > 1 && (
                          <div className="mt-1.5 max-w-[190px]">
                            <select
                              value={item.priceField || getDefaultPriceOption(products.get(item.sku)!)?.field || ''}
                              onClick={(e) => e.stopPropagation()}
                              onTouchStart={(e) => e.stopPropagation()}
                              onChange={(e) => setCartPriceField(item.sku, item.priceField, e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 touch-manipulation"
                            >
                              {getPriceOptions(products.get(item.sku)!).map((opt) => (
                                <option key={opt.field} value={opt.field}>{opt.label} · {fmtCLP(opt.value)}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeFromCart(item.sku, item.priceField)}
                        className="text-gray-400 hover:text-red-500 transition shrink-0 mt-1">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 ml-8">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateCartQty(item.sku, item.priceField, -1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-gray-700">
                          <Minus size={14} />
                        </button>
                        <input type="number" value={item.cantidad} min={1} max={stockMap.get(item.sku) ?? item.stockDisponible}
                          onChange={e => setCartQty(item.sku, item.priceField, Number(e.target.value))}
                          className="w-14 bg-white border border-gray-300 rounded-lg text-center text-sm text-gray-900 font-semibold py-1.5 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button onClick={() => updateCartQty(item.sku, item.priceField, 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-gray-700">
                          <Plus size={14} />
                        </button>
                        {/* Discount */}
                        <div className="flex items-center gap-1 ml-2">
                          <Percent size={12} className="text-orange-500" />
                          <input type="number" value={item.descuentoPct || ''} min={0} max={100}
                            placeholder="0"
                            onChange={e => setCartDiscount(item.sku, item.priceField, Number(e.target.value))}
                            className="w-12 bg-white border border-gray-300 rounded-lg text-center text-xs text-orange-600 font-semibold py-1.5 focus:outline-none focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-base">{fmtCLP(item.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart totals */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 bg-white px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-semibold text-gray-900">{fmtCLP(subtotalCart)}</span>
              </div>
              {/* Global discount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent size={14} className="text-orange-500" />
                  <span className="text-sm text-gray-700 font-medium">Dcto. global</span>
                  <input type="number" value={descuentoGlobalPct || ''} min={0} max={100}
                    placeholder="0"
                    onChange={e => setDescuentoGlobalPct(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-14 bg-white border border-gray-300 rounded-lg text-center text-sm text-orange-600 font-semibold py-1 ml-1 focus:outline-none focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm text-orange-600 font-medium">%</span>
                </div>
                {descuentoGlobalMonto > 0 && (
                  <span className="text-orange-600 font-semibold">-{fmtCLP(descuentoGlobalMonto)}</span>
                )}
              </div>
              <div className="flex justify-between text-2xl font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-700">TOTAL</span>
                <span className="text-blue-600">{fmtCLP(totalCart)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT: Payment panel ═══════════════════════════════════════ */}
        <div className={`w-full lg:w-[360px] flex-col bg-white lg:shrink-0 min-h-0 overflow-y-auto border-l border-gray-200 ${mobileTab !== 'payment' ? 'hidden lg:flex' : 'flex'}`}>

          {/* ── Vendedora: cajera selection + client ─────────────────────── */}
          {isVendedora ? (
          <div className="flex-1 flex flex-col">
            {/* Total summary */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Total a enviar</div>
                <div className="text-3xl font-black text-gray-900">{fmtCLP(totalCart)}</div>
                <div className="text-xs text-gray-500 mt-0.5">{totalItemsCount} producto{totalItemsCount > 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Select cajera */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Seleccionar cajera</div>
              <div className="flex gap-3 justify-center flex-wrap">
                {loginUsers.filter(u => u.cargo.toUpperCase().includes('CAJER')).map(caj => {
                  const selected = vendedoraSelectedCajera === caj.id
                  return (
                    <button
                      key={caj.id}
                      onClick={() => setVendedoraSelectedCajera(selected ? null : caj.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all w-28 ${
                        selected
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100 scale-105'
                          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      {caj.fotoUrl ? (
                        <img src={caj.fotoUrl} alt={caj.nombre} className={`w-14 h-14 rounded-full object-cover ring-2 ${selected ? 'ring-emerald-400' : 'ring-gray-200'}`} />
                      ) : (
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white ${selected ? 'bg-emerald-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'}`}>
                          {caj.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className={`text-xs font-semibold truncate w-full text-center ${selected ? 'text-emerald-700' : 'text-gray-700'}`}>{caj.nombre.split(' ')[0]}</span>
                      {selected && <Check size={14} className="text-emerald-600" />}
                    </button>
                  )
                })}
                {loginUsers.filter(u => u.cargo.toUpperCase().includes('CAJER')).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">No hay cajeras disponibles</p>
                )}
              </div>
            </div>

            {/* Client toggle + name */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Registrar cliente</span>
                <button
                  onClick={() => setVendedoraClienteEnabled(!vendedoraClienteEnabled)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${vendedoraClienteEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${vendedoraClienteEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {!vendedoraClienteEnabled && (
                <input
                  type="text"
                  value={clienteNombre}
                  onChange={e => setClienteNombre(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mt-2"
                  autoFocus
                />
              )}
              {vendedoraClienteEnabled && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={e => setClienteNombre(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    autoFocus
                  />
                  <input
                    type="tel"
                    value={clienteTelefono}
                    onChange={e => setClienteTelefono(e.target.value)}
                    placeholder="Teléfono"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="email"
                    value={clienteCorreo}
                    onChange={e => setClienteCorreo(e.target.value)}
                    placeholder="Correo"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="text"
                    value={clienteRut}
                    onChange={e => setClienteRut(e.target.value)}
                    placeholder="RUT"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}
            </div>

            {/* Spacer + enviar button */}
            <div className="flex-1" />
            <div className="px-5 py-5">
              <button
                onClick={() => {
                  const caj = loginUsers.find(u => u.id === vendedoraSelectedCajera)
                  if (caj) handleSendToCajera(caj.id, caj.nombre)
                }}
                disabled={cart.length === 0 || !vendedoraSelectedCajera || sendingToCajera}
                className={`w-full py-4 rounded-2xl text-base font-bold transition-all flex items-center justify-center gap-3 shadow-lg ${
                  cart.length > 0 && vendedoraSelectedCajera && !sendingToCajera
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-200 active:scale-[0.97]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {sendingToCajera ? (
                  <><Loader2 size={20} className="animate-spin" /> Enviando...</>
                ) : (
                  <><Send size={20} /> Enviar a Cajera</>
                )}
              </button>
              {!vendedoraSelectedCajera && cart.length > 0 && (
                <p className="text-amber-500 text-[11px] text-center mt-2 font-medium">Selecciona una cajera arriba</p>
              )}
            </div>
          </div>
          ) : (
          <>
          {/* ── Cajera: normal payment methods ──────────────────────────── */}
          <div className="px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900">Forma de Pago</span>
              <button onClick={() => { setSplitMode(!splitMode); setPagos([]) }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${splitMode ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {splitMode ? 'Dividido ✓' : 'Dividir'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'efectivo' as MetodoPago, icon: <Banknote size={20} />, label: 'Efectivo', color: 'green' },
                { key: 'debito' as MetodoPago, icon: <CreditCard size={20} />, label: 'Débito', color: 'blue' },
                { key: 'transferencia' as MetodoPago, icon: <ArrowRightLeft size={20} />, label: 'Transfer', color: 'purple' },
              ]).map(m => (
                <button key={m.key} onClick={() => setPagoActivo(m.key)}
                  className={`flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 transition-all ${
                    pagoActivo === m.key
                      ? `bg-${m.color}-50 border-${m.color}-500 text-${m.color}-700`
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {m.icon}
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div className="px-5 py-4 border-b border-gray-200">
            {pagoActivo === 'efectivo' && !splitMode && (
              <>
                <label className="text-xs text-gray-500 mb-2 block font-medium">Monto recibido (efectivo)</label>
                <input type="number" value={montoRecibido}
                  onChange={e => setMontoRecibido(e.target.value)}
                  placeholder={fmtN(totalCart)}
                  className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 py-3 text-2xl text-gray-900 text-center font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onKeyDown={e => { if (e.key === 'Enter') handleCompleteSale() }}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickAmounts.map(a => (
                    <button key={a} onClick={() => setMontoRecibido(String(a))}
                      className="bg-gray-100 hover:bg-blue-100 border border-gray-300 hover:border-blue-400 rounded-lg px-3 py-2 text-xs text-gray-700 font-bold transition">
                      {fmtN(a)}
                    </button>
                  ))}
                  <button onClick={() => setMontoRecibido(String(totalCart))}
                    className="bg-green-100 hover:bg-green-200 border border-green-400 rounded-lg px-3 py-2 text-xs text-green-700 font-bold transition">
                    Exacto
                  </button>
                </div>
              </>
            )}
            {splitMode && (
              <>
                <label className="text-xs text-gray-500 mb-2 block font-medium">Monto ({pagoActivo})</label>
                <div className="flex gap-2">
                  <input type="number" value={montoRecibido}
                    onChange={e => setMontoRecibido(e.target.value)}
                    placeholder="Monto"
                    className="flex-1 bg-white border-2 border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 text-center font-bold focus:outline-none focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onKeyDown={e => { if (e.key === 'Enter') addSplitPago() }}
                  />
                  <button onClick={addSplitPago}
                    className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 py-2.5 font-bold transition">
                    <Plus size={18} />
                  </button>
                </div>
                <button onClick={() => { if (restante > 0) { setMontoRecibido(String(restante)) } }}
                  className="w-full mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium">
                  Usar restante: {fmtCLP(restante)}
                </button>
                {pagos.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {pagos.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <span className="text-gray-700 capitalize font-medium">{p.metodo}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{fmtCLP(p.monto)}</span>
                          <button onClick={() => setPagos(prev => prev.filter((_, j) => j !== i))}
                            className="text-red-500 hover:text-red-600"><X size={14} /></button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs text-gray-500 pt-1">
                      <span>Total pagado:</span>
                      <span className={totalPagado >= totalCart ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>
                        {fmtCLP(totalPagado)} / {fmtCLP(totalCart)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
            {pagoActivo !== 'efectivo' && !splitMode && (
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">{fmtCLP(totalCart)}</div>
                <span className="text-sm text-gray-500 capitalize">{pagoActivo === 'debito' ? 'Pago con tarjeta débito' : 'Pago por transferencia'}</span>
              </div>
            )}
          </div>

          {/* Change display */}
          {((pagoActivo === 'efectivo' && !splitMode && Number(montoRecibido) > totalCart) || (splitMode && totalPagado > totalCart)) && (
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-200">
              <div className="flex justify-between items-center">
                <span className="text-amber-700 text-sm font-semibold">Vuelto</span>
                <span className="text-2xl font-bold text-amber-600">{fmtCLP(vuelto)}</span>
              </div>
            </div>
          )}

          {/* Confirm button (cajera only — vendedora has its own panel above) */}
          <div className="px-5 py-4">
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || !sesionCaja || processing}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 ${
                cart.length > 0 && sesionCaja && !processing
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              {processing ? (
                <><Loader2 size={20} className="animate-spin" /> Procesando...</>
              ) : (
                <><Receipt size={20} /> COBRAR {totalCart > 0 ? fmtCLP(totalCart) : ''}</>
              )}
            </button>
            {!sesionCaja && cart.length > 0 && (
              <p className="text-red-500 text-xs text-center mt-2">Abre la caja primero</p>
            )}
          </div>

          {/* Caja actions (hidden for vendedoras) */}
          {!isVendedora && (
          <div className="px-5 pb-4 space-y-2">
            {!sesionCaja ? (
              <button onClick={() => setShowApertura(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 rounded-xl py-3 text-sm font-semibold transition">
                <Unlock size={16} /> Abrir Caja
              </button>
            ) : (
              <button onClick={() => setShowCierre(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-300 text-red-600 rounded-xl py-2.5 text-sm font-medium transition">
                <Lock size={16} /> Cerrar Caja
              </button>
            )}
            <button onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-medium transition">
              <Clock size={16} /> Ventas de hoy ({ventasCompletadas.length}) · {fmtCLP(totalVentasHoy)}
            </button>
            <button
              onClick={() => { if (lastPrintedSale) printReceipt(lastPrintedSale) }}
              disabled={!lastPrintedSale}
              title={lastPrintedSale ? `Boleta N° ${String(lastPrintedSale.boletaNumero || 0).padStart(7,'0')}` : 'Completa una venta primero'}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition border ${
                lastPrintedSale
                  ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-700'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <Receipt size={16} />
              {lastPrintedSale
                ? `Reimprimir N° ${String(lastPrintedSale.boletaNumero || 0).padStart(7,'0')}`
                : 'Sin venta para reimprimir'}
            </button>
          </div>
          )}

          {/* Caja summary — calculado desde ventasHoy para reflejar ediciones de pago */}
          {!isVendedora && sesionCaja && (() => {
            const vCompletadas = ventasHoy.filter(v => v.estado === 'completada' && v.sesionCajaId === sesionCaja.id)
            const livEfectivo = vCompletadas.reduce((s, v) => s + ((v.pagos || []).find(p => p.metodo === 'efectivo')?.monto || 0), 0)
            const livDebito = vCompletadas.reduce((s, v) => s + ((v.pagos || []).find(p => p.metodo === 'debito')?.monto || 0), 0)
            const livTransf = vCompletadas.reduce((s, v) => s + ((v.pagos || []).find(p => p.metodo === 'transferencia')?.monto || 0), 0)
            const livTotal = livEfectivo + livDebito + livTransf
            return (
            <div className="mx-5 mb-4 bg-gray-50 rounded-xl p-4 text-xs space-y-1.5 border border-gray-200">
              <div className="flex justify-between text-gray-500">
                <span>Apertura:</span>
                <span className="text-gray-900 font-semibold">{fmtCLP(sesionCaja.montoApertura)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Efectivo:</span>
                <span className="text-green-600 font-semibold">{fmtCLP(livEfectivo)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Débito:</span>
                <span className="text-blue-600 font-semibold">{fmtCLP(livDebito)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Transferencia:</span>
                <span className="text-purple-600 font-semibold">{fmtCLP(livTransf)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold pt-2 border-t border-gray-200">
                <span>Total ventas:</span>
                <span>{fmtCLP(livTotal)}</span>
              </div>
            </div>
            )
          })()}
          </>
          )}
        </div>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-lg border-t border-blue-100 flex z-40 shadow-[0_-4px_20px_rgba(59,130,246,0.1)]">
        <button
          onClick={() => setMobileTab('products')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-all duration-200 relative ${
            mobileTab === 'products' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          {mobileTab === 'products' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />}
          <div className={`p-1.5 rounded-lg transition-all ${mobileTab === 'products' ? 'bg-blue-100 scale-110' : ''}`}>
            <ScanBarcode size={19} />
          </div>
          Productos
        </button>
        <button
          onClick={() => setMobileTab('cart')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-all duration-200 relative ${
            mobileTab === 'cart' ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          {mobileTab === 'cart' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full" />}
          <div className={`p-1.5 rounded-lg transition-all relative ${mobileTab === 'cart' ? 'bg-indigo-100 scale-110' : ''}`}>
            <ShoppingCart size={19} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 shadow-sm animate-bounce" style={{animationDuration:'2s'}}>
                {totalItemsCount > 9 ? '9+' : totalItemsCount}
              </span>
            )}
          </div>
          Carrito
        </button>
        <button
          onClick={() => setMobileTab('payment')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-all duration-200 relative ${
            mobileTab === 'payment' ? 'text-emerald-600' : 'text-gray-400'
          }`}
        >
          {mobileTab === 'payment' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />}
          <div className={`p-1.5 rounded-lg transition-all ${mobileTab === 'payment' ? 'bg-emerald-100 scale-110' : ''}`}>
            <DollarSign size={19} />
          </div>
          {cart.length > 0 && totalCart > 0 ? (
            <span className="text-[9px] font-extrabold text-emerald-600">{fmtCLP(totalCart)}</span>
          ) : 'Cobrar'}
        </button>
      </div>

      {/* ═══ MOBILE: "Added to cart" notification ═══════════════════════ */}
      {cartAddedItem && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 lg:hidden z-50 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 border border-emerald-400/30">
            <CheckCircle size={16} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-bold truncate max-w-[200px]">{cartAddedItem.nombre}</div>
              <div className="text-[10px] text-emerald-100">{fmtCLP(cartAddedItem.precio)} agregado al carrito</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODALS ══════════════════════════════════════════════════════ */}

      {/* Apertura de caja */}
      {showApertura && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200">
            {!sesionCaja && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
                <span className="text-amber-600 text-lg">⚠️</span>
                <p className="text-xs font-semibold text-amber-700">La caja está cerrada. Debes abrirla para operar.</p>
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-2">Apertura de Caja</h2>
            <p className="text-sm text-gray-500 mb-6">Ingresa los datos para abrir la caja del día</p>
            <div className="space-y-4">
              {posUser ? (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  {posUser.fotoUrl ? (
                    <img src={posUser.fotoUrl} alt={posUser.nombre} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold">{posUser.nombre.charAt(0)}</div>
                  )}
                  <div>
                    <div className="font-bold text-emerald-900 text-sm">{posUser.nombre}</div>
                    <div className="text-xs text-emerald-600">{posUser.cargo}</div>
                  </div>
                </div>
              ) : (
              <div>
                <label className="text-sm text-gray-700 mb-1.5 block font-medium">Nombre del Cajero *</label>
                <input type="text" value={cajeroNombre} onChange={e => setCajeroNombre(e.target.value)}
                  placeholder="Ej: María"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleAbrirCaja() }}
                />
              </div>
              )}
              <div>
                <label className="text-sm text-gray-700 mb-1.5 block font-medium">*Ingrese Monto de Apertura de Caja (CLP)</label>
                <input type="number" value={montoApertura} onChange={e => setMontoApertura(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              {sesionCaja && (
                <button onClick={() => setShowApertura(false)}
                  className="flex-1 text-gray-600 hover:text-gray-800 font-medium transition text-sm">
                  Cancelar
                </button>
              )}
              <button onClick={handleAbrirCaja}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-bold transition shadow-sm">
                Abrir Caja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cierre de caja */}
      {showCierre && sesionCaja && (() => {
        const ventasCompletadas = ventasHoy.filter(v => v.estado === 'completada' && v.sesionCajaId === sesionCaja.id)
        const totalEfectivo = ventasCompletadas.reduce((sum, v) => {
          const ef = v.pagos?.find(p => p.metodo === 'efectivo')?.monto || 0
          return sum + ef
        }, 0)
        const totalDebito = ventasCompletadas.reduce((sum, v) => {
          const deb = v.pagos?.find(p => p.metodo === 'debito')?.monto || 0
          return sum + deb
        }, 0)
        const totalTransferencia = ventasCompletadas.reduce((sum, v) => {
          const tr = v.pagos?.find(p => p.metodo === 'transferencia')?.monto || 0
          return sum + tr
        }, 0)
        const totalVentas = totalEfectivo + totalDebito + totalTransferencia
        const totalVueltos = ventasCompletadas.reduce((sum, v) => sum + (v.vuelto || 0), 0)
        const efectivoTeorico = totalEfectivo + sesionCaja.montoApertura - totalVueltos
        const efectivoRealNum = Number(efectivoReal) || 0
        const totalItemsMonto = itemsCierre.reduce((s, it) => s + (Number(it.monto) || 0), 0)
        const totalGastosUI = itemsCierre.filter(it => it.tipo === 'gasto').reduce((s, it) => s + (Number(it.monto) || 0), 0)
        const totalAnulacionesUI = itemsCierre.filter(it => it.tipo === 'anulacion').reduce((s, it) => s + (Number(it.monto) || 0), 0)
        const totalDevolucionesUI = itemsCierre.filter(it => it.tipo === 'devolucion').reduce((s, it) => s + (Number(it.monto) || 0), 0)
        const diferencia = efectivoRealNum - efectivoTeorico
        const TIPO_CONFIG = {
          gasto:     { label: '📦 Gasto',      color: 'border-gray-300 bg-gray-50' },
          anulacion: { label: '🚫 Anulación',   color: 'border-red-200 bg-red-50' },
          devolucion:{ label: '🔄 Devolución',  color: 'border-amber-200 bg-amber-50' },
        }

        return (
          <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
            <div className="min-h-full flex items-start justify-center p-4 py-6">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Comprobante Cierre de Caja</h2>
              <p className="text-sm text-gray-500 mb-4">Sucursal: {sedeNombre}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 font-semibold mb-2">APERTURA</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Cajero:</span><span className="font-semibold text-gray-900">{sesionCaja.cajeroNombre}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span className="text-gray-900">{sesionCaja.aperturaAt?.toDate?.().toLocaleDateString('es-CL') || '--'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Hora:</span><span className="text-gray-900">{sesionCaja.aperturaAt?.toDate?.().toLocaleTimeString('es-CL') || '--'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Monto:</span><span className="font-bold text-blue-700">{fmtCLP(sesionCaja.montoApertura)}</span></div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <div className="text-xs text-red-600 font-semibold mb-2">CIERRE</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span className="text-gray-900">{new Date().toLocaleDateString('es-CL')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Hora:</span><span className="text-gray-900">{new Date().toLocaleTimeString('es-CL')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Ventas:</span><span className="font-bold text-gray-900">{ventasCompletadas.length}</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-4">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Resumen de Caja</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-600">TOTAL EFECTIVO ({ventasCompletadas.filter(v => v.pagos?.some(p => p.metodo === 'efectivo')).length} Ventas)</span>
                    <span className="font-bold text-green-700">{fmtCLP(totalEfectivo)}</span>
                  </div>
                  <div className="flex justify-between py-1"><span className="text-gray-500 pl-4">Apertura</span><span className="text-gray-900">{fmtCLP(sesionCaja.montoApertura)}</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500 pl-4">Vueltos</span><span className="text-gray-900">-{fmtCLP(totalVueltos)}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-600">T.Débito ({ventasCompletadas.filter(v => v.pagos?.some(p => p.metodo === 'debito')).length} Ventas)</span>
                    <span className="font-bold text-blue-700">{fmtCLP(totalDebito)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-600">TRANSFERENCIA ({ventasCompletadas.filter(v => v.pagos?.some(p => p.metodo === 'transferencia')).length} Ventas)</span>
                    <span className="font-bold text-purple-700">{fmtCLP(totalTransferencia)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-base">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-600">{fmtCLP(totalVentas)}</span>
                  </div>
                </div>
              </div>

              {(() => {
                const faltante = Math.max(0, -diferencia)
                const sobrante = Math.max(0, diferencia)
                const justificado = totalItemsMonto
                const pendiente = Math.max(0, faltante - justificado)
                const sinDatos = !efectivoReal
                const cuadra = !sinDatos && diferencia === 0
                const sobra = !sinDatos && diferencia > 0
                const falta = !sinDatos && pendiente > 0
                const panelBg = sinDatos
                  ? 'bg-yellow-50 border-yellow-200'
                  : cuadra ? 'bg-green-50 border-green-300'
                  : sobra ? 'bg-orange-50 border-orange-300'
                  : 'bg-red-50 border-red-300'
                const dividerColor = sinDatos
                  ? 'border-yellow-300'
                  : cuadra ? 'border-green-300'
                  : sobra ? 'border-orange-300'
                  : 'border-red-300'
                const labelColor = sinDatos
                  ? 'text-gray-700'
                  : cuadra ? 'text-green-800'
                  : sobra ? 'text-orange-800'
                  : 'text-red-800'
                const inputFocus = sinDatos
                  ? 'focus:border-yellow-500 focus:ring-yellow-100'
                  : cuadra ? 'focus:border-green-500 focus:ring-green-100'
                  : sobra ? 'focus:border-orange-500 focus:ring-orange-100'
                  : 'focus:border-red-500 focus:ring-red-100'
                return (
                <div className={`rounded-xl p-5 border mb-4 space-y-3 transition-colors duration-300 ${panelBg}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-sm ${labelColor}`}>
                      {sinDatos ? '📋 Datos reales de cierre'
                        : cuadra ? '✅ Caja cuadrada correctamente'
                        : sobra ? `🟠 Sobrante en caja: ${fmtCLP(sobrante)}`
                        : `⚠️ Faltante sin justificar: ${fmtCLP(pendiente)}`}
                    </h3>
                  </div>

                  <div>
                    <label className={`text-xs mb-1 block font-medium ${labelColor}`}>Efectivo Real en Caja (CLP) *</label>
                    <input
                      type="number"
                      value={efectivoReal}
                      onChange={e => setEfectivoReal(e.target.value)}
                      placeholder="0"
                      onWheel={e => e.currentTarget.blur()}
                      className={`w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${inputFocus}`}
                    />
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold ${labelColor}`}>Gastos / Anulaciones / Devoluciones</span>
                      <button
                        type="button"
                        onClick={() => setItemsCierre(prev => [...prev, { tipo: 'gasto', monto: '', detalle: '', boletaNumero: '' }])}
                        className="text-xs bg-gray-800 text-white px-2.5 py-1 rounded-lg hover:bg-gray-700 transition"
                      >+ Agregar</button>
                    </div>
                    {itemsCierre.length === 0 && <p className="text-xs text-gray-400 italic">Sin ítems registrados</p>}
                    <div className="space-y-2">
                      {itemsCierre.map((item, idx) => (
                        <div key={idx} className={`border rounded-xl p-3 ${TIPO_CONFIG[item.tipo].color}`}>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <select
                              value={item.tipo}
                              onChange={e => setItemsCierre(prev => prev.map((it, i) => i === idx ? { ...it, tipo: e.target.value as any } : it))}
                              className="border rounded-lg px-2 py-1.5 text-xs font-semibold h-9 bg-white"
                            >
                              <option value="gasto">📦 Gasto</option>
                              <option value="anulacion">🚫 Anulación</option>
                              <option value="devolucion">🔄 Devolución</option>
                            </select>
                            <input
                              type="number"
                              value={item.monto}
                              onChange={e => setItemsCierre(prev => prev.map((it, i) => i === idx ? { ...it, monto: e.target.value } : it))}
                              placeholder="Monto $"
                              onWheel={e => e.currentTarget.blur()}
                              className="w-28 border rounded-lg px-2 py-1.5 h-9 text-sm bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => setItemsCierre(prev => prev.filter((_, i) => i !== idx))}
                              className="ml-auto text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1"
                            >✕</button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={item.detalle}
                              onChange={e => setItemsCierre(prev => prev.map((it, i) => i === idx ? { ...it, detalle: e.target.value } : it))}
                              placeholder={item.tipo === 'devolucion' ? 'Producto / motivo *' : 'Descripción / detalle *'}
                              className="border rounded-lg px-2 py-2 text-sm w-full bg-white"
                            />
                            <input
                              type="text"
                              value={item.boletaNumero}
                              onChange={e => setItemsCierre(prev => prev.map((it, i) => i === idx ? { ...it, boletaNumero: e.target.value } : it))}
                              placeholder="N° Boleta (si aplica)"
                              className="border rounded-lg px-2 py-2 text-sm w-full bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`space-y-1.5 text-sm pt-2 border-t ${dividerColor}`}>
                    <div className="flex justify-between"><span className="text-gray-600">Efectivo Teórico:</span><span className="font-semibold text-gray-900">{fmtCLP(efectivoTeorico)}</span></div>
                    {efectivoRealNum > 0 && <>
                      <div className="flex justify-between"><span className="text-gray-600">Efectivo Real:</span><span className="font-semibold text-gray-900">{fmtCLP(efectivoRealNum)}</span></div>
                      <div className="flex justify-between font-bold">
                        <span className={diferencia >= 0 ? 'text-green-700' : 'text-red-700'}>Diferencia:</span>
                        <span className={diferencia >= 0 ? 'text-green-700' : 'text-red-700'}>{diferencia >= 0 ? '+' : ''}{fmtCLP(diferencia)}</span>
                      </div>
                    </>}
                    {totalGastosUI > 0 && <div className="flex justify-between"><span className="text-gray-600">Gastos:</span><span className="font-semibold text-red-600">-{fmtCLP(totalGastosUI)}</span></div>}
                    {totalAnulacionesUI > 0 && <div className="flex justify-between"><span className="text-gray-600">Anulaciones:</span><span className="font-semibold text-red-600">-{fmtCLP(totalAnulacionesUI)}</span></div>}
                    {totalDevolucionesUI > 0 && <div className="flex justify-between"><span className="text-gray-600">Devoluciones:</span><span className="font-semibold text-amber-600">-{fmtCLP(totalDevolucionesUI)}</span></div>}
                    {totalItemsMonto > 0 && <div className={`flex justify-between font-semibold border-t pt-1.5 ${dividerColor}`}><span className="text-gray-700">Total justificado:</span><span className="text-gray-800">-{fmtCLP(totalItemsMonto)}</span></div>}
                    {!sinDatos && (
                      <div className={`flex justify-between font-bold text-base pt-1 border-t ${dividerColor}`}>
                        <span className={cuadra ? 'text-green-700' : sobra ? 'text-orange-700' : 'text-red-700'}>
                          {cuadra ? '✅ Cuadra' : sobra ? '🟠 Sobrante' : '❌ Faltante sin justificar'}
                        </span>
                        <span className={cuadra ? 'text-green-700' : sobra ? 'text-orange-700' : 'text-red-700'}>
                          {cuadra ? fmtCLP(0) : sobra ? `+${fmtCLP(sobrante)}` : fmtCLP(pendiente)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                )
              })()}

              <div className="flex gap-3">
                <button onClick={() => { setShowCierre(false); setEfectivoReal(''); setItemsCierre([]) }}
                  className="flex-1 text-gray-600 hover:text-gray-800 font-medium transition text-sm py-3">
                  Cancelar
                </button>
                <button
                  onClick={handleCerrarCaja}
                  disabled={!efectivoReal}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-3 font-bold transition">
                  <Lock size={16} className="inline mr-2" />
                  Cerrar Caja
                </button>
              </div>
            </div>
            </div>
          </div>
        )
      })()}

      {/* Drafts panel */}
      {showDrafts && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FolderOpen size={20} className="text-amber-500" />
                <h2 className="font-bold text-lg text-gray-900">Borradores</h2>
                {drafts.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{drafts.length}</span>
                )}
              </div>
              <button onClick={() => setShowDrafts(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {drafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <BookMarked size={40} className="mb-3 opacity-20" />
                  <p className="text-sm font-medium text-gray-500">No hay borradores guardados</p>
                  <p className="text-xs text-gray-400 mt-1">Guarda una venta para atender a otro cliente</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {drafts.map((draft, idx) => {
                    const itemCount = draft.cart.reduce((s, c) => s + c.cantidad, 0)
                    const totalDraft = draft.cart.reduce((s, c) => s + c.subtotal, 0)
                    const timeStr = new Date(draft.savedAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                    return (
                      <div key={draft.id} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-amber-800 text-sm">Borrador #{idx + 1}</span>
                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{timeStr}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {draft.cart.slice(0, 3).map(c => c.nombre).join(', ')}
                            {draft.cart.length > 3 ? ` +${draft.cart.length - 3} más` : ''}
                          </p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {fmtCLP(totalDraft)} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleLoadDraft(draft)}
                            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg px-3 py-2 transition-colors"
                          >
                            <ShoppingCart size={13} /> Cargar
                          </button>
                          <button
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg px-3 py-2 transition-colors border border-red-200"
                          >
                            <Trash2 size={13} /> Borrar
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sales history */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                Ventas de Hoy
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-5">
              {ventasHoy.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-lg">No hay ventas registradas hoy</div>
              ) : (
                <div className="space-y-2">
                  {ventasHoy.map(v => {
                    const hora = v.fecha?.toDate ? v.fecha.toDate().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '--:--'
                    const isAnulada = v.estado === 'anulada'
                    return (
                      <div key={v.id} className={`rounded-xl border p-3 sm:p-4 transition ${isAnulada ? 'bg-red-50 border-red-200 opacity-60' : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-sm'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-gray-500 text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200">{hora}</span>
                            <span className="font-bold text-gray-900 text-base">{fmtCLP(v.total)}</span>
                            {isAnulada && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">ANULADA</span>}
                            <span className="text-xs text-gray-500 capitalize sm:hidden">
                              {(v.pagos || []).map((p: any) => p.metodo).join(' + ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 capitalize hidden sm:inline">
                              {(v.pagos || []).map((p: any) => p.metodo).join(' + ')}
                            </span>
                            {!isAnulada && (
                              <button onClick={() => openEditPago(v)}
                                className="text-violet-500 hover:text-violet-700 text-xs flex items-center gap-1 font-medium">
                                <Edit3 size={12} /> Pago
                              </button>
                            )}
                            {!isAnulada && (
                              <button onClick={() => printReceipt(v)}
                                className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center gap-1 font-medium">
                                <Receipt size={12} /> Reimprimir
                              </button>
                            )}
                            {!isAnulada && (
                              <button onClick={() => handleAnular(v)}
                                className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium">
                                <RotateCcw size={12} /> Anular
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-1.5 sm:mt-2 text-xs text-gray-500 line-clamp-2">
                          {(v.items || []).map((it: any, i: number) => (
                            <span key={i}>
                              {i > 0 && ' · '}
                              {it.cantidad}x {it.nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-500 text-sm">{ventasCompletadas.length} ventas</span>
              <span className="text-green-600 font-bold text-lg sm:text-xl">{fmtCLP(totalVentasHoy)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar método de pago */}
      {editPagoTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-violet-600" />
                <span className="font-bold text-gray-900 text-sm">Editar forma de pago</span>
              </div>
              <button onClick={() => setEditPagoTarget(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Venta info */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm">
                <div className="font-bold text-gray-900">{fmtCLP(editPagoTarget.total)}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Pago actual: <span className="font-semibold capitalize">{(editPagoTarget.pagos || []).map((p: any) => p.metodo).join(' + ')}</span>
                </div>
              </div>

              {!editPagoPinOk ? (
                /* Paso 1: PIN */
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ingresa el PIN</label>
                  <input
                    type="password"
                    value={editPagoPin}
                    onChange={e => { setEditPagoPin(e.target.value); setEditPagoPinError(false) }}
                    onKeyDown={e => e.key === 'Enter' && handleEditPagoPin()}
                    placeholder="PIN de seguridad"
                    autoFocus
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm text-center font-mono tracking-widest focus:outline-none focus:ring-2 ${editPagoPinError ? 'border-red-400 ring-red-100 text-red-600' : 'border-gray-200 focus:ring-violet-100 focus:border-violet-400'}`}
                  />
                  {editPagoPinError && <p className="text-xs text-red-600 text-center font-medium">PIN incorrecto</p>}
                  <button
                    onClick={handleEditPagoPin}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition"
                  >
                    Confirmar PIN
                  </button>
                </div>
              ) : (
                /* Paso 2: Seleccionar método */
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nuevo método de pago</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['efectivo', 'debito', 'transferencia'] as MetodoPago[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setEditPagoMetodo(m)}
                        className={`py-2.5 rounded-xl text-xs font-bold capitalize border-2 transition ${
                          editPagoMetodo === m
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {m === 'efectivo' ? '💵 Efectivo' : m === 'debito' ? '💳 Débito' : '📲 Transfer'}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleEditPagoSave}
                    disabled={editPagoSaving}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                  >
                    {editPagoSaving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    {editPagoSaving ? 'Guardando...' : 'Guardar cambio'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold z-50 animate-[fadeIn_0.2s] border ${
          toast.type === 'ok' ? 'bg-green-50 text-green-800 border-green-200' :
          toast.type === 'err' ? 'bg-red-50 text-red-800 border-red-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          {toast.type === 'ok' && <CheckCircle size={18} className="text-green-600" />}
          {toast.type === 'err' && <AlertCircle size={18} className="text-red-600" />}
          {toast.msg}
        </div>
      )}

      {showPendingSales && isCajera && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Send size={18} className="text-blue-600" /> Ventas Pendientes
              </h2>
              <button onClick={() => setShowPendingSales(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {pendingSales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No hay ventas pendientes</p>
            ) : (
              <div className="space-y-3">
                {pendingSales.map(sale => {
                  const vendedoraUser = loginUsers.find(u => u.id === sale.vendedoraId)
                  return (
                  <div key={sale.id} className="rounded-xl border border-blue-200 bg-blue-50/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {vendedoraUser?.fotoUrl ? (
                          <img src={vendedoraUser.fotoUrl} alt={sale.vendedoraNombre} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-blue-200">
                            {(sale.vendedoraNombre || '?').charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-gray-900">{sale.vendedoraNombre}</div>
                          <div className="text-[10px] text-gray-500">Vendedora</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-700">{fmtCLP(sale.total || 0)}</div>
                        <div className="text-[10px] text-gray-500">{sale.totalItems || 0} items</div>
                      </div>
                    </div>
                    {sale.clienteNombre && sale.clienteNombre !== 'Cliente' && (
                      <div className="text-xs text-gray-600 mb-2 bg-white rounded-lg px-2.5 py-1.5 border border-gray-100">
                        👤 <span className="font-semibold">{sale.clienteNombre}</span>
                        {sale.clienteRut && <span className="ml-2 text-gray-400">RUT: {sale.clienteRut}</span>}
                        {sale.clienteTelefono && <span className="ml-2 text-gray-400">Tel: {sale.clienteTelefono}</span>}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400 mb-2">
                      {sale.items?.slice(0, 3).map((it: any, i: number) => (
                        <span key={i}>{it.nombre} x{it.cantidad}{i < Math.min(sale.items.length, 3) - 1 ? ', ' : ''}</span>
                      ))}
                      {sale.items?.length > 3 && <span> +{sale.items.length - 3} más</span>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptPendingSale(sale)}
                        className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition"
                      >Aceptar y Cobrar</button>
                      <button
                        onClick={() => handleRejectPendingSale(sale.id)}
                        className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition border border-red-200"
                      >Rechazar</button>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de pre-ventas para JEFE */}
      {showPreVentas && isJefe && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Receipt size={18} className="text-amber-600" /> Pre-ventas por cobrar
              </h2>
              <button onClick={() => setShowPreVentas(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {preVentas.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No hay pre-ventas pendientes</p>
            ) : (
              <div className="space-y-3">
                {preVentas.map((pv: any) => (
                  <div key={pv.id} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-amber-200">
                          {(pv.cajeroNombre || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{pv.cajeroNombre || 'Cajera'}</div>
                          <div className="text-[10px] text-gray-500">Cajera · Pre-venta</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-700">{fmtCLP(pv.total || 0)}</div>
                        <div className="text-[10px] text-gray-500">{(pv.items || []).reduce((s: number, it: any) => s + Number(it.cantidad || 0), 0)} items</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 mb-2 bg-white rounded-lg px-2.5 py-1.5 border border-gray-100">
                      {(pv.items || []).slice(0, 3).map((it: any, i: number) => (
                        <span key={i}>{it.nombre} x{it.cantidad}{i < Math.min((pv.items || []).length, 3) - 1 ? ', ' : ''}</span>
                      ))}
                      {(pv.items || []).length > 3 && <span> +{(pv.items || []).length - 3} más</span>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptPreventa(pv)}
                        className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition"
                      >Cargar y Cobrar</button>
                      <button
                        onClick={() => handleRejectPreventa(pv)}
                        className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition border border-red-200"
                      >Anular</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send to Cajera modal (vendedora mode) */}
      {showSendToCajera && isVendedora && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Send size={18} className="text-blue-600" /> Enviar a Cajera
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {totalItemsCount} producto{totalItemsCount > 1 ? 's' : ''} · Total: <span className="font-bold text-gray-900">{fmtCLP(totalCart)}</span>
            </p>

            {/* Customer data */}
            <div className="space-y-3 mb-5">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Datos del cliente</div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Nombre *</label>
                <input
                  type="text"
                  value={clienteNombre}
                  onChange={e => setClienteNombre(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">RUT (opcional)</label>
                  <input
                    type="text"
                    value={clienteRut}
                    onChange={e => setClienteRut(e.target.value)}
                    placeholder="12.345.678-9"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Teléfono (opcional)</label>
                  <input
                    type="tel"
                    value={clienteTelefono}
                    onChange={e => setClienteTelefono(e.target.value)}
                    placeholder="+56912345678"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Select cajera */}
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Seleccionar cajera</div>
            <div className="space-y-2 mb-4">
              {loginUsers.filter(u => u.cargo.toUpperCase().includes('CAJER')).map(caj => (
                <button
                  key={caj.id}
                  onClick={() => handleSendToCajera(caj.id, caj.nombre)}
                  disabled={sendingToCajera}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition text-left"
                >
                  {caj.fotoUrl ? (
                    <img src={caj.fotoUrl} alt={caj.nombre} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                      {caj.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{caj.nombre}</div>
                    <div className="text-[10px] text-gray-500">{caj.cargo}</div>
                  </div>
                  <Send size={14} className="text-emerald-500 shrink-0" />
                </button>
              ))}
              {loginUsers.filter(u => u.cargo.toUpperCase().includes('CAJER')).length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No hay cajeras disponibles en esta sucursal</p>
              )}
            </div>

            <button
              onClick={() => setShowSendToCajera(false)}
              className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-600 transition"
            >Cancelar</button>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <img src={lightboxUrl} alt="producto" className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]" />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* OCR Scanner Modal */}

      {/* POS mobile keyframes */}
      <style>{`
        @keyframes slideUp { 0%{transform:translate(-50%,20px);opacity:0} 100%{transform:translate(-50%,0);opacity:1} }
        @keyframes fadeIn { 0%{opacity:0} 100%{opacity:1} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
      `}</style>
    </div>
  )
}
