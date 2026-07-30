'use client'

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceDot, ReferenceLine
} from 'recharts'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, TrendingDown, DollarSign, Users, Package,
  MessageCircle, Brain, FileText, ArrowRight,
  Building2, Clock, AlertTriangle, Zap,
  ChevronRight, RefreshCw, Menu, X, Home, Calendar,
  ClipboardList, Boxes, Database, Calculator, Search,
  ShoppingCart, BarChart2, Activity, Star, Trophy, Bug, Trash2,
  Send, Loader2, Phone, Mic, MicOff, Volume2, VolumeX, Bell, Receipt, Landmark, Link2,
  Shield, Copy, Split, Wallet, Target, Flame, Sparkles, PieChart as PieIcon, BarChart3, Radar as RadarIcon
} from 'lucide-react'
import { DEMO_WORKERS } from '@/data/demoWorkers'
import type { SedeSlug } from '@/types'
// [APPWRITE] Servicios de datos reales del ERP Yaxsel
import { fetchCuadresERP } from '@/lib/cuadresErpService'
import type { CuadreERP } from '@/lib/cuadresErpService'
import { fetchAllAppwriteErpProducts } from '@/lib/appwriteErpService'

// ============================================================================
// SHIMS DE MIGRACIÓN (SOLO-VISUAL)
// Reemplazan Firebase / react-router-dom / auth / runtimeConfig del proyecto
// original Asistora. No hay lógica real: fuerzan modo demo para renderizar el
// diseño. La conexión a Appwrite se hará en una etapa posterior.
// ============================================================================

// Assets (copiados a /public)
const asisImage = '/erp/asis.png'
const toraImage = '/erp/tora.png'

// react-router-dom → Next.js
const Link = ({ to, children, ...rest }: any) => <NextLink href={to || '#'} {...rest}>{children}</NextLink>
function useNavigate() {
  const router = useRouter()
  return useCallback((path: string) => { try { router.push(path) } catch {} }, [router])
}

// Firebase Firestore → mocks no-op (retornan vacío; el componente cae a datos demo)
const db: any = null
const collection = (...args: any[]) => ({ __col: args })
const doc = (...args: any[]) => ({ __doc: args })
const getDoc = async (_ref?: any) => ({ exists: () => false, data: (): any => ({}) })
const getDocs = async (_q?: any) => ({ size: 0, empty: true, docs: [] as any[], forEach: (_fn?: any) => {} })
const query = (...args: any[]) => ({ __q: args })
const where = (...args: any[]) => ({ __where: args })
const orderBy = (...args: any[]) => ({ __orderBy: args })
const limit = (...args: any[]) => ({ __limit: args })
const onSnapshot = (_q: any, _cb?: any, _err?: any) => { return () => {} }
const updateDoc = async (..._args: any[]) => {}

// useAuth → invitado demo
const useAuth = () => ({ user: null as any, appUser: null as any, isGuest: true, logout: () => {} })

// runtimeConfig → configuración Yaxsel fija, en modo demo
interface RuntimeBranchConfig { slug: SedeSlug; name: string; region: string; icon: string; color: string; active: boolean; imageUrl: string; managerEmail: string }
const YAXSEL_BRANDING = {
  companyLogoUrl: '/avatar.png',
  companyIconUrl: '/avatar.png',
  defaultUserAvatarUrl: '/avatar.png',
  titleColor: '#10b981',
}
const YAXSEL_OWNER = { displayName: 'Administrador', email: 'dexkonet@gmail.com', photoURL: '/avatar.png' }
const YAXSEL_BRANCHES: RuntimeBranchConfig[] = [
  { slug: 'alameda', name: 'Alameda', region: 'Santiago Centro', icon: '🏙️', color: 'emerald', active: true, imageUrl: '', managerEmail: '' },
]
const getRuntimeConfig = () => ({
  companyName: 'Yaxsel',
  legalName: 'Yaxsel',
  companyDescription: 'ERP Yaxsel',
  supremeAdminEmail: YAXSEL_OWNER.email,
  branding: YAXSEL_BRANDING,
  ownerProfile: YAXSEL_OWNER,
  firebase: { projectId: 'asistoraerp-demo' },
  branches: YAXSEL_BRANCHES,
  sparkMode: false,
})
const getConfiguredBranches = (includeInactive = false): RuntimeBranchConfig[] =>
  includeInactive ? YAXSEL_BRANCHES : YAXSEL_BRANCHES.filter(b => b.active)
const getFirebaseProjectId = () => 'asistoraerp-demo'
// [APPWRITE] Demo apagado: los datos ahora vienen de Appwrite (cuadres_erp)
const isRuntimeDemoProject = () => false

const ASIS_AVATAR = '/avatar.png'
const runtimeAppConfig = getRuntimeConfig()
const runtimeBranding = runtimeAppConfig.branding
const runtimeOwnerProfile = runtimeAppConfig.ownerProfile
const firebaseProjectId = getFirebaseProjectId()
const CLOUD_FUNCTIONS_BASE_URL = `https://us-central1-${firebaseProjectId}.cloudfunctions.net`
const IS_DEMO_PROJECT = isRuntimeDemoProject()
const DEMO_PROFILE_CACHE_KEY = `asistora_demo_profile_${firebaseProjectId}`
const SIDEBAR_EXECUTIVE_AVATAR = runtimeOwnerProfile.photoURL || runtimeBranding.defaultUserAvatarUrl
const COMPANY_LOGO_URL = runtimeBranding.companyLogoUrl || runtimeBranding.companyIconUrl

// Cache keys (bump version cuando agregues nuevos campos a SucursalData para invalidar caches viejos)
const CACHE_KEY = 'dashboard_cache_v2'
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutos
const MEDIA_CACHE_KEY = 'dashboard_media_cache'
const MEDIA_CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas

// Helper to cache images/videos as base64
const cacheMedia = async (url: string): Promise<string> => {
  try {
    const cached = localStorage.getItem(`${MEDIA_CACHE_KEY}_${url}`)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < MEDIA_CACHE_EXPIRY) return data
    }
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        try {
          localStorage.setItem(`${MEDIA_CACHE_KEY}_${url}`, JSON.stringify({ data: base64, timestamp: Date.now() }))
        } catch {}
        resolve(base64)
      }
      reader.readAsDataURL(blob)
    })
  } catch {
    return url
  }
}

const LOGO_URL = runtimeBranding.companyLogoUrl || runtimeBranding.companyIconUrl

interface SucursalData {
  slug: string
  name: string
  icon: string
  color: string
  ventas: number
  gastos: number
  ganancia: number
  cuadreEnviado?: boolean
}

interface Trabajador {
  id: string
  nombre: string
  cargo: string
  sucursal: string
  foto?: string
}

interface TopProduct {
  sku: string
  nombre: string
  cantidad: number
  ventas: number
  costoNeto: number
}

interface DemoProfile {
  companyName: string
  userName: string
}

interface DayData {
  fecha: string     // 'dd/MM'
  fechaFull: string // 'yyyy-MM-dd'
  ventas: number
  gastos: number
  ganancia: number
}

function getSucursales() {
  return getConfiguredBranches().map((branch) => ({
    slug: branch.slug,
    name: branch.name,
    icon: branch.icon,
    color: branch.color,
  }))
}

const ACTIVE_BRANCH_SLUGS = new Set<string>(getSucursales().map((branch) => branch.slug))

const DEMO_SUCURSAL_SEEDS: Record<string, { hoy: { ventas: number; gastos: number }; ayer: { ventas: number; gastos: number } }> = {
  'la-florida': { hoy: { ventas: 3890000, gastos: 820000 }, ayer: { ventas: 3420000, gastos: 760000 } },
  'copiapo': { hoy: { ventas: 4320000, gastos: 940000 }, ayer: { ventas: 4010000, gastos: 910000 } },
  'alameda': { hoy: { ventas: 3610000, gastos: 760000 }, ayer: { ventas: 3290000, gastos: 700000 } },
}

const buildDemoMockSucursales = (mode: 'hoy' | 'ayer'): SucursalData[] => getSucursales().map((branch) => {
  const seed = DEMO_SUCURSAL_SEEDS[branch.slug] || DEMO_SUCURSAL_SEEDS.alameda
  const snapshot = seed[mode]
  return {
    ...branch,
    ventas: snapshot.ventas,
    gastos: snapshot.gastos,
    ganancia: snapshot.ventas - snapshot.gastos,
  }
})

const DEMO_MOCK_SUCURSALES: SucursalData[] = buildDemoMockSucursales('hoy')

const DEMO_MOCK_TOP_PRODUCTS: TopProduct[] = [
  { sku: 'ARZ-001', nombre: 'Arroz Grado 2 1KG', cantidad: 186, ventas: 334800, costoNeto: 243000 },
  { sku: 'ACE-900', nombre: 'Aceite Vegetal 900ML', cantidad: 154, ventas: 569800, costoNeto: 421600 },
  { sku: 'AZU-001', nombre: 'Azúcar 1KG', cantidad: 141, ventas: 239700, costoNeto: 181890 },
  { sku: 'PST-500', nombre: 'Pasta Spaghetti 500G', cantidad: 128, ventas: 217600, costoNeto: 163840 },
  { sku: 'ATN-170', nombre: 'Atún Lomitos 170G', cantidad: 93, ventas: 325500, costoNeto: 241800 },
]

const DEMO_MOCK_SUCURSALES_AYER: SucursalData[] = buildDemoMockSucursales('ayer')

const DEMO_MOCK_TOP_PRODUCTS_AYER: TopProduct[] = [
  { sku: 'ARZ-001', nombre: 'Arroz Grado 2 1KG', cantidad: 172, ventas: 309600, costoNeto: 224500 },
  { sku: 'ACE-900', nombre: 'Aceite Vegetal 900ML', cantidad: 149, ventas: 551300, costoNeto: 407900 },
  { sku: 'AZU-001', nombre: 'Azúcar 1KG', cantidad: 133, ventas: 226100, costoNeto: 171500 },
  { sku: 'PST-500', nombre: 'Pasta Spaghetti 500G', cantidad: 119, ventas: 202300, costoNeto: 152200 },
  { sku: 'ATN-170', nombre: 'Atún Lomitos 170G', cantidad: 87, ventas: 304500, costoNeto: 226300 },
]

const DEMO_MOCK_TRABAJADORES: Trabajador[] = [
  ...DEMO_WORKERS.filter((w) => ACTIVE_BRANCH_SLUGS.has(w.sede)).map((w) => ({
    id: w.id,
    nombre: w.nombre,
    cargo: w.cargo,
    sucursal: w.sede,
    foto: w.fotoUrl,
  })),
]

const formatCLP = (n: number) => 
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const formatCompact = (n: number) => formatCLP(n) // Mostrar cifras completas

const colorClasses: Record<string, { bg: string, text: string, border: string, light: string }> = {
  pink: { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200', light: 'bg-pink-50' },
  green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200', light: 'bg-green-50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200', light: 'bg-rose-50' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-50' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50' },
  slate: { bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-200', light: 'bg-slate-50' },
  fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-600', border: 'border-fuchsia-200', light: 'bg-fuchsia-50' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200', light: 'bg-sky-50' },
  red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200', light: 'bg-red-50' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, appUser, isGuest, logout } = useAuth()
  const [demoProfile, setDemoProfile] = useState<DemoProfile>({ companyName: runtimeAppConfig.companyName, userName: 'Usuario Demo' })
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [onboardingCompany, setOnboardingCompany] = useState('')
  const [onboardingUser, setOnboardingUser] = useState('')
  const [loading, setLoading] = useState(true)
  const [dateMode, setDateMode] = useState<'hoy' | 'ayer'>('hoy')
  const [selectedSedeFilter, setSelectedSedeFilter] = useState<string>(() => {
    try { return localStorage.getItem('activeBranch') || 'todas' } catch { return 'todas' }
  })
  const [sucursalesData, setSucursalesData] = useState<SucursalData[]>([])
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [topProductsBySede, setTopProductsBySede] = useState<Record<string, TopProduct[]>>({})
  const [totals, setTotals] = useState({ ventas: 0, gastos: 0, ganancia: 0 })
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [monthlyData, setMonthlyData] = useState<DayData[]>([])
  const [monthlyBySede, setMonthlyBySede] = useState<Record<string, { ventas: number; gastos: number; ganancia: number }>>({})
  const [fixedMonthlyBySede, setFixedMonthlyBySede] = useState<Record<string, { sueldos: number; externos: number; total: number }>>({})
  const [dailyBySede, setDailyBySede] = useState<Record<string, DayData[]>>({})
  const [loadingMonthly, setLoadingMonthly] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAsisChat, setShowAsisChat] = useState(false)
  const [showAsisOptions, setShowAsisOptions] = useState(false) // Mini-burbujas de opciones
  const [showAsisToraCloud, setShowAsisToraCloud] = useState(false) // ASIS/TORA cloud expanded
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [customDate, setCustomDate] = useState('')
  const [customDateEnd, setCustomDateEnd] = useState('')
  // Estado de cierre de caja por sede (solo hoy) — para mostrar chips de sucursales con cuadres pendientes
  const [cuadreStatusBySede, setCuadreStatusBySede] = useState<Record<string, { sedeName: string; cajeros: { nombre: string; listo: boolean }[] }>>({})
  const [isBackgroundCall, setIsBackgroundCall] = useState(false) // Llamada en segundo plano
  const [bubbleVideoLoaded, setBubbleVideoLoaded] = useState({ asis: false, tora: false })
  const [mainBubbleVideoFading, setMainBubbleVideoFading] = useState(false)
  const mainBubbleVideoRef = useRef<HTMLVideoElement>(null)
  const fadingBubbleRef = useRef(false)
  const [cachedAvatar, setCachedAvatar] = useState(ASIS_AVATAR)
  const [avatarLoaded, setAvatarLoaded] = useState(false)
  const [bubbleImagesLoaded, setBubbleImagesLoaded] = useState({ asis: false, tora: false })
  
  // ASIS proactive notification states
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [notifPreview, setNotifPreview] = useState<string | null>(null)

  // Listen for unread ASIS web notifications
  useEffect(() => {
    if (!db) return
    try {
      const q = query(
        collection(db, 'asis_web_notifications'),
        where('read', '==', false),
        orderBy('createdAtMs', 'desc'),
        limit(20)
      )
      const unsub = onSnapshot(q, (snap: any) => {
        setUnreadNotifs(snap.size)
        if (snap.size > 0) {
          const latest = snap.docs[0].data()
          setNotifPreview(String(latest?.text || '').slice(0, 80))
        } else {
          setNotifPreview(null)
        }
      }, () => { /* ignore errors */ })
      return () => { try { unsub() } catch { /* Firestore internal assertion on cleanup */ } }
    } catch { /* ignore */ }
  }, [])

  // Sincronizar selectedSedeFilter con la sede activa del header global
  useEffect(() => {
    const handler = (e: any) => {
      const slug = String(e?.detail || '')
      if (slug) setSelectedSedeFilter(slug)
    }
    window.addEventListener('activeBranchChanged', handler as EventListener)
    // Por si cambia en otra pestaña
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'activeBranch' && e.newValue) setSelectedSedeFilter(e.newValue)
    }
    window.addEventListener('storage', storageHandler)
    return () => {
      window.removeEventListener('activeBranchChanged', handler as EventListener)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])

  // Valores derivados por sede activa (si hay filtro → muestra solo esa sede)
  const displaySucursalesData = useMemo(() => {
    if (selectedSedeFilter === 'todas') return sucursalesData
    return sucursalesData.filter(s => s.slug === selectedSedeFilter)
  }, [sucursalesData, selectedSedeFilter])

  const displayTotals = useMemo(() => {
    if (selectedSedeFilter === 'todas') return totals
    const suc = sucursalesData.find(s => s.slug === selectedSedeFilter)
    return suc ? { ventas: suc.ventas, gastos: suc.gastos, ganancia: suc.ganancia } : { ventas: 0, gastos: 0, ganancia: 0 }
  }, [totals, sucursalesData, selectedSedeFilter])

  const displayTopProducts = useMemo(() => {
    if (selectedSedeFilter === 'todas') return topProducts
    return (topProductsBySede[selectedSedeFilter] || []).slice(0, 5)
  }, [topProducts, topProductsBySede, selectedSedeFilter])

  const displayTrabajadores = useMemo(() => {
    if (selectedSedeFilter === 'todas') return trabajadores
    return trabajadores.filter(t => t.sucursal === selectedSedeFilter)
  }, [trabajadores, selectedSedeFilter])

  const displayMonthlyData = useMemo(() => {
    if (selectedSedeFilter === 'todas') return monthlyData
    return dailyBySede[selectedSedeFilter] || []
  }, [monthlyData, dailyBySede, selectedSedeFilter])

  // IA Chat states
  const [iaMessages, setIaMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hola! Soy ASIS, tu asistente del Dashboard. Puedo explicarte cómo funciona cada sección y ayudarte a navegar. ¿Qué te gustaría saber?' }
  ])
  const [iaInput, setIaInput] = useState('')
  const [iaLoading, setIaLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  // Modo llamada states
  const [isCallMode, setIsCallMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false)
  const [callDisplayContent, setCallDisplayContent] = useState<string | null>(null)
  const [isMicMuted, setIsMicMuted] = useState(false)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isCallModeRef = useRef(false)
  
  // Mantener ref actualizado
  useEffect(() => {
    isCallModeRef.current = isCallMode
  }, [isCallMode])
  
  // Cache avatar image on mount
  useEffect(() => {
    cacheMedia(ASIS_AVATAR).then(setCachedAvatar)
  }, [])

  // Onboarding de primer ingreso para demo
  useEffect(() => {
    if (user || isGuest) return
    if (!IS_DEMO_PROJECT) return
    try {
      const raw = localStorage.getItem(DEMO_PROFILE_CACHE_KEY)
      if (!raw) {
        setOnboardingOpen(true)
        return
      }
      const parsed = JSON.parse(raw) as Partial<DemoProfile>
      const companyName = String(parsed?.companyName || '').trim()
      const userName = String(parsed?.userName || '').trim()
      if (!companyName || !userName) {
        setOnboardingOpen(true)
        return
      }
      setDemoProfile({ companyName, userName })
    } catch {
      setOnboardingOpen(true)
    }
  }, [user, isGuest])

  useEffect(() => {
    if (user?.email) {
      setDemoProfile({
        companyName: runtimeAppConfig.companyName,
        userName: appUser?.displayName || user.displayName || user.email.split('@')[0],
      })
      setOnboardingOpen(false)
      return
    }

    if (isGuest) {
      setDemoProfile({ companyName: runtimeAppConfig.companyName, userName: 'Invitado' })
      setOnboardingOpen(false)
    }
  }, [user, appUser, isGuest])

  useEffect(() => {
    if (!onboardingOpen) return
    document.body.classList.add('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [onboardingOpen])

  const submitOnboarding = (e: React.FormEvent) => {
    e.preventDefault()
    const companyName = onboardingCompany.trim()
    const userName = onboardingUser.trim()
    if (!companyName || !userName) return
    const profile: DemoProfile = { companyName, userName }
    setDemoProfile(profile)
    try {
      localStorage.setItem(DEMO_PROFILE_CACHE_KEY, JSON.stringify(profile))
    } catch {
      // ignore cache errors
    }
    setOnboardingOpen(false)
  }

  // Limpiar llamada al salir de la página o refresh
  useEffect(() => {
    const cleanup = () => {
      if (isCallModeRef.current || isBackgroundCall) {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop() } catch {}
        }
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
        window.speechSynthesis?.cancel()
      }
    }
    window.addEventListener('beforeunload', cleanup)
    return () => {
      cleanup()
      window.removeEventListener('beforeunload', cleanup)
    }
  }, [isBackgroundCall])
  
  // Costos y precios de productos desde BD
  const [costsBD, setCostsBD] = useState<Map<string, number>>(new Map())
  const [pricesBD, setPricesBD] = useState<Map<string, number>>(new Map())
  const [productNamesBD, setProductNamesBD] = useState<Map<string, string>>(new Map())
  const [minus10Flags, setMinus10Flags] = useState<Set<string>>(new Set())

  // [APPWRITE] Costos, precios y nombres de productos desde la colección `products`
  useEffect(() => {
    let cancelled = false
    async function loadCosts() {
      try {
        const products = await fetchAllAppwriteErpProducts()
        const costMap = new Map<string, number>()
        const priceMap = new Map<string, number>()
        const nameMap = new Map<string, string>()
        for (const p of products) {
          const sku = String(p.sku || '').trim().toUpperCase()
          if (!sku) continue
          costMap.set(sku, Math.round(Number(p.costo_uni) || 0))
          nameMap.set(sku, String(p.nombre || sku))
          // Precio de referencia = mínimo entre detalle (precio_venta_1) y mayorista (precio_venta_2)
          const candidates = [Number(p.precio_venta_1) || 0, Number(p.precio_venta_2) || 0].filter(n => isFinite(n) && n > 0)
          const pvMin = candidates.length ? Math.min(...candidates) : 0
          if (pvMin > 0) priceMap.set(sku, Math.round(pvMin))
        }
        if (!cancelled) {
          setCostsBD(costMap)
          setPricesBD(priceMap)
          setProductNamesBD(nameMap)
          setMinus10Flags(new Set()) // sin ajuste_menos10 en Yaxsel
        }
      } catch (e) {
        console.error('[Dashboard][Appwrite] loadCosts error:', e)
      }
    }
    loadCosts()
    return () => { cancelled = true }
  }, [])

  // Bloquear scroll del body cuando sidebar está abierta
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  // Guardar en cache
  const saveToCache = (cachePayload: any) => {
    const cacheData = {
      data: cachePayload,
      timestamp: Date.now(),
      dateMode,
      branchSlugs: getSucursales().map(s => s.slug)
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
  }

  // Cargar desde cache
  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null
      const { data, timestamp, dateMode: cachedMode, branchSlugs: cachedSlugs } = JSON.parse(cached)
      // Invalidate cache if branch slugs changed
      const currentSlugs = getSucursales().map(s => s.slug).sort().join(',')
      const savedSlugs = Array.isArray(cachedSlugs) ? cachedSlugs.sort().join(',') : ''
      if (savedSlugs !== currentSlugs) return null
      // Verificar si el cache es válido (mismo modo y no expirado)
      if (cachedMode === dateMode && Date.now() - timestamp < CACHE_EXPIRY) {
        return data
      }
    } catch (e) {
      console.error('Error loading cache:', e)
    }
    return null
  }

  const loadData = async (forceRefresh = false) => {
    // ── [APPWRITE] Binding real: datos del día desde la colección cuadres_erp ──
    {
      try {
        setLoading(true)
        const cuadres = await fetchCuadresERP(1)
        const nowCL = new Date(Date.now() - 3 * 60 * 60 * 1000)
        const todayStr = nowCL.toISOString().slice(0, 10)
        const yDate = new Date(nowCL); yDate.setDate(yDate.getDate() - 1)
        const yStr = yDate.toISOString().slice(0, 10)
        const targetDate = dateMode === 'ayer' ? yStr : todayStr
        const dayList = cuadres.filter((c: CuadreERP) => c.fecha === targetDate)
        const bruto = (c: CuadreERP) =>
          (Number(c.montos?.efectivoSistema) || 0) + (Number(c.montos?.debitoSistema) || 0) + (Number(c.montos?.transferencias) || 0)
        const sucData: SucursalData[] = getSucursales().map((b) => {
          const c = dayList.find((x: CuadreERP) => x.sede === b.slug)
          const ventas = c ? bruto(c) : 0
          const gastos = c ? (Number(c.calculos?.gastosTotales) || 0) : 0
          return { ...b, ventas, gastos, ganancia: ventas - gastos, cuadreEnviado: !!c }
        })
        const tot = sucData.reduce(
          (a, s) => ({ ventas: a.ventas + s.ventas, gastos: a.gastos + s.gastos, ganancia: a.ganancia + s.ganancia }),
          { ventas: 0, gastos: 0, ganancia: 0 }
        )
        // Top productos: agrega los topProducts de todos los cuadres del día
        const globalMap = new Map<string, TopProduct>()
        const perSede: Record<string, Map<string, TopProduct>> = {}
        dayList.forEach((c: CuadreERP) => {
          const sm = perSede[c.sede] || (perSede[c.sede] = new Map<string, TopProduct>())
          ;(c.topProducts || []).forEach((p) => {
            const key = String(p.sku || p.nombre || '')
            if (!key) return
            const g = globalMap.get(key) || { sku: p.sku, nombre: p.nombre, cantidad: 0, ventas: 0, costoNeto: 0 }
            g.cantidad += Number(p.cantidadVendida) || 0
            g.ventas += Number(p.ventasBrutas) || 0
            g.costoNeto += Number(p.costoNeto) || 0
            globalMap.set(key, g)
            const s = sm.get(key) || { sku: p.sku, nombre: p.nombre, cantidad: 0, ventas: 0, costoNeto: 0 }
            s.cantidad += Number(p.cantidadVendida) || 0
            s.ventas += Number(p.ventasBrutas) || 0
            s.costoNeto += Number(p.costoNeto) || 0
            sm.set(key, s)
          })
        })
        const topGlobal = Array.from(globalMap.values()).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10)
        const topBySede: Record<string, TopProduct[]> = {}
        Object.keys(perSede).forEach((s) => {
          topBySede[s] = Array.from(perSede[s].values()).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10)
        })
        setSucursalesData(sucData)
        setTotals(tot)
        setTopProducts(topGlobal)
        setTopProductsBySede(topBySede)
        setLastUpdate(new Date())
        setLoading(false)
        return
      } catch (e) {
        console.error('[Dashboard][Appwrite] loadData error:', e)
        setLoading(false)
        return
      }
    }
    // ─── (código original de Firebase/demo — ya no se ejecuta) ───
    if (IS_DEMO_PROJECT) {
      const demoSucursales = dateMode === 'ayer' ? DEMO_MOCK_SUCURSALES_AYER : DEMO_MOCK_SUCURSALES
      const demoTopProducts = dateMode === 'ayer' ? DEMO_MOCK_TOP_PRODUCTS_AYER : DEMO_MOCK_TOP_PRODUCTS
      const demoTotals = demoSucursales.reduce(
        (acc, s) => {
          acc.ventas += s.ventas
          acc.gastos += s.gastos
          acc.ganancia += s.ganancia
          return acc
        },
        { ventas: 0, gastos: 0, ganancia: 0 }
      )

      setLoading(false)
      setSucursalesData(demoSucursales)
      setTotals(demoTotals)
      setTopProducts(demoTopProducts)
      setLastUpdate(new Date())
      saveToCache({
        sucursalesData: demoSucursales,
        totals: demoTotals,
        topProducts: demoTopProducts,
        lastUpdate: new Date().toISOString()
      })
      return
    }

    // Intentar cargar desde cache primero
    if (!forceRefresh) {
      const cached = loadFromCache()
      if (cached) {
        const cachedSucursales = Array.isArray(cached.sucursalesData) ? cached.sucursalesData : []
        const cachedTop = Array.isArray(cached.topProducts) ? cached.topProducts : []
        const cacheHasRealData = cachedSucursales.some((s: any) => Number(s?.ventas) > 0 || Number(s?.gastos) > 0 || Number(s?.ganancia) > 0) || cachedTop.length > 0

        if (IS_DEMO_PROJECT && !cacheHasRealData) {
          const demoTotals = DEMO_MOCK_SUCURSALES.reduce(
            (acc, s) => {
              acc.ventas += s.ventas
              acc.gastos += s.gastos
              acc.ganancia += s.ganancia
              return acc
            },
            { ventas: 0, gastos: 0, ganancia: 0 }
          )
          setSucursalesData(DEMO_MOCK_SUCURSALES)
          setTotals(demoTotals)
          setTopProducts(DEMO_MOCK_TOP_PRODUCTS)
          setLastUpdate(new Date())
          setLoading(false)
          return
        }

        setSucursalesData(cached.sucursalesData)
        setTotals(cached.totals)
        setTopProducts(cached.topProducts)
        setLastUpdate(new Date(cached.lastUpdate))
        setLoading(false)
        return
      }
    }
    
    setLoading(true)
    try {
      const d = new Date()
      if (dateMode === 'ayer') d.setDate(d.getDate() - 1)
      const yyyy = d.getFullYear()
      const MM = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')

      if (!db) throw new Error('no-db')

      const data: SucursalData[] = []
      let totalVentas = 0, totalGastos = 0, totalGanancia = 0
      const allTopProducts: TopProduct[] = []

      const SUCURSALES = getSucursales()
      const fechaStr = `${yyyy}-${MM}-${dd}`

      // Cargar todas las sucursales EN PARALELO para mejor rendimiento
      const sucursalPromises = SUCURSALES.map(async (suc) => {
        try {
          let dayRef = doc(db!, 'sedes', suc.slug, 'reports', fechaStr)
          let daySnap = await getDoc(dayRef)

          // Fallback to old path: reports/{sede}/{yyyy}/{MM}/days/{dd}
          if (!daySnap.exists()) {
            const yyyy2 = fechaStr.slice(0, 4)
            const MM2 = fechaStr.slice(5, 7)
            const dd2 = fechaStr.slice(8, 10)
            dayRef = doc(db!, 'reports', suc.slug, yyyy2, MM2, 'days', dd2)
            daySnap = await getDoc(dayRef)
          }

          if (daySnap.exists()) {
            const raw: any = daySnap.data()
            const ventas = (Number(raw?.montos?.efectivoSistema) || 0) + 
                          (Number(raw?.montos?.debitoSistema) || 0) + 
                          (Number(raw?.montos?.transferencias) || 0)
            const gastos = Number(raw?.calculos?.gastosTotales) || 0
            
            // Calcular ganancia como en TopProducts
            const topProductsArr = Array.isArray(raw?.topProducts) ? raw.topProducts : []
            let totVentas = 0
            let totCostos = 0
            
            topProductsArr.forEach((p: any) => {
              const sku = String(p?.sku || '').trim().toUpperCase()
              const cantidad = Number(p?.cantidadVendida) || 0
              const ventasBrutas = Number(p?.ventasBrutas) || 0
              const costoNetoReporte = Number(p?.costoNeto) || 0
              
              const costoUnitBD = costsBD.get(sku) || 0
              const base = costoUnitBD > 0 ? costoUnitBD : (cantidad > 0 ? Math.round(costoNetoReporte / cantidad) : 0)
              
              const applyAdj = minus10Flags.has(sku)
              const costoUnit = Math.round(base * (applyAdj ? 0.81 : 1))
              const costoNeto = costoUnit * cantidad
              
              if (base > 0) {
                totVentas += ventasBrutas
                totCostos += costoNeto
              }
            })
            
            const gananciaBruta = totVentas - totCostos
            const ganancia = gananciaBruta - gastos

            const sucData: SucursalData = { ...suc, ventas, gastos, ganancia, cuadreEnviado: true }
            const products = topProductsArr.map((p: any) => ({
              sku: p.sku || '',
              nombre: p.nombre || '',
              cantidad: Number(p.cantidadVendida) || 0,
              ventas: Number(p.ventasBrutas) || 0,
              costoNeto: Number(p.costoNeto) || 0,
            }))

            return { sucData, products, ventas, gastos, ganancia }
          } else {
            return { sucData: { ...suc, ventas: 0, gastos: 0, ganancia: 0, cuadreEnviado: false } as SucursalData, products: [], ventas: 0, gastos: 0, ganancia: 0 }
          }
        } catch (err) {
          console.error(`[Dashboard] Error cargando ${suc.slug}:`, err)
          return { sucData: { ...suc, ventas: 0, gastos: 0, ganancia: 0, cuadreEnviado: false } as SucursalData, products: [], ventas: 0, gastos: 0, ganancia: 0 }
        }
      })

      // Esperar a que todas las consultas terminen en paralelo
      const results = await Promise.all(sucursalPromises)
      
      // Agregar resultados
      const bySedeTop: Record<string, TopProduct[]> = {}
      results.forEach(r => {
        data.push(r.sucData)
        totalVentas += r.ventas
        totalGastos += r.gastos
        totalGanancia += r.ganancia
        r.products.forEach((p: TopProduct) => allTopProducts.push(p))
        bySedeTop[r.sucData.slug] = [...r.products].sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)
      })
      setTopProductsBySede(bySedeTop)

      const aggregated = new Map<string, TopProduct>()
      allTopProducts.forEach(p => {
        const key = p.sku || p.nombre
        const existing = aggregated.get(key)
        if (existing) {
          existing.cantidad += p.cantidad
          existing.ventas += p.ventas
        } else {
          aggregated.set(key, { ...p })
        }
      })
      const sortedTop = Array.from(aggregated.values()).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)

      const hasRealData = data.some((s) => s.ventas > 0 || s.gastos > 0 || s.ganancia > 0) || sortedTop.length > 0

      // Si es "hoy" y no hay datos, cambiar automáticamente a "ayer"
      if (dateMode === 'hoy' && !hasRealData) {
        setDateMode('ayer')
        return
      }

      if (IS_DEMO_PROJECT && !hasRealData) {
        const demoTotals = DEMO_MOCK_SUCURSALES.reduce(
          (acc, s) => {
            acc.ventas += s.ventas
            acc.gastos += s.gastos
            acc.ganancia += s.ganancia
            return acc
          },
          { ventas: 0, gastos: 0, ganancia: 0 }
        )

        setSucursalesData(DEMO_MOCK_SUCURSALES)
        setTotals(demoTotals)
        setTopProducts(DEMO_MOCK_TOP_PRODUCTS)
        setLastUpdate(new Date())
        saveToCache({
          sucursalesData: DEMO_MOCK_SUCURSALES,
          totals: demoTotals,
          topProducts: DEMO_MOCK_TOP_PRODUCTS,
          lastUpdate: new Date().toISOString()
        })
        return
      }

      setSucursalesData(data)
      setTotals({ ventas: totalVentas, gastos: totalGastos, ganancia: totalGanancia })
      setTopProducts(sortedTop)
      setLastUpdate(new Date())
      
      // Guardar en cache
      saveToCache({
        sucursalesData: data,
        totals: { ventas: totalVentas, gastos: totalGastos, ganancia: totalGanancia },
        topProducts: sortedTop,
        lastUpdate: new Date().toISOString()
      })
    } catch (e) {
      console.error('Error loading dashboard data:', e)
    } finally {
      setLoading(false)
    }
  }

  const loadTrabajadores = async () => {
    try {
      if (!db) return
      const snap = await getDocs(collection(db, 'trabajadores'))
      const list: Trabajador[] = []
      snap.forEach((d: any) => {
        const data = d.data() as any
        // Soft-delete flags posibles: activo:false, activa:false, eliminado:true, estado:'inactivo'
        const isInactive = data.activo === false || data.activa === false || data.eliminado === true || data.estado === 'inactivo' || data.estado === 'eliminado'
        if (!isInactive) {
          // El campo real en Firestore es `sede` (PlanillaUnificada lo usa así)
          const sede = data.sede || data.sucursal || ''
          list.push({
            id: d.id,
            nombre: data.nombre || 'Sin nombre',
            cargo: data.cargo || 'Trabajador',
            sucursal: sede,
            foto: data.foto || data.fotoUrl || '',
          })
        }
      })
      const filteredList = list.filter((worker) => {
        const currentSlugs = new Set(getSucursales().map(s => s.slug))
        // Slug alterno: 'web' equivale a 'web-tiendas-3b-chile'
        const sede = worker.sucursal === 'web' ? 'web-tiendas-3b-chile' : worker.sucursal
        return !!sede && currentSlugs.has(sede)
      }).map(w => ({ ...w, sucursal: w.sucursal === 'web' ? 'web-tiendas-3b-chile' : w.sucursal }))
      if (IS_DEMO_PROJECT && filteredList.length === 0) {
        setTrabajadores(DEMO_MOCK_TRABAJADORES)
        return
      }
      setTrabajadores(filteredList)
    } catch (e) {
      console.error('Error loading trabajadores:', e)
      if (IS_DEMO_PROJECT) setTrabajadores(DEMO_MOCK_TRABAJADORES)
    }
  }

  // Carga el estado de cierre de caja de HOY por cada sede: lista los cajeros pendientes/listos
  const loadCuadreStatusToday = async () => {
    try {
      if (!db || IS_DEMO_PROJECT) { setCuadreStatusBySede({}); return }
      // Respetar el modo Hoy/Ayer del dashboard
      const refDate = new Date()
      if (dateMode === 'ayer') refDate.setDate(refDate.getDate() - 1)
      const today = refDate.toLocaleDateString('en-CA', { timeZone: 'America/Santiago' })
      const SUCURSALES = getSucursales()
      const result: Record<string, { sedeName: string; cajeros: { nombre: string; listo: boolean }[] }> = {}
      await Promise.all(SUCURSALES.map(async (suc) => {
        try {
          // Cargar cajeros de la sede (soporta slug alterno 'web' para web-tiendas-3b-chile)
          const sedeQueries = suc.slug === 'web-tiendas-3b-chile'
            ? [
                query(collection(db!, 'trabajadores'), where('sede', '==', 'web-tiendas-3b-chile')),
                query(collection(db!, 'trabajadores'), where('sede', '==', 'web')),
              ]
            : [query(collection(db!, 'trabajadores'), where('sede', '==', suc.slug))]
          const snaps = await Promise.all(sedeQueries.map(q => getDocs(q)))
          const seen = new Set<string>()
          const names: string[] = []
          snaps.forEach((snap: any) => snap.forEach((d: any) => {
            const data = d.data() as any
            if (data?.activo === false) return
            const cargo = String(data?.cargo || '').toUpperCase()
            const nombre = String(data?.nombre || '').trim()
            if (!nombre) return
            if (cargo.includes('CAJER') && !seen.has(nombre.toLowerCase())) {
              seen.add(nombre.toLowerCase())
              names.push(nombre)
            }
          }))
          if (names.length === 0) return

          // Cargar estado parcial de hoy (soporta slug alterno 'web' para web-tiendas-3b-chile)
          const slugCandidates = suc.slug === 'web-tiendas-3b-chile' ? ['web-tiendas-3b-chile', 'web'] : [suc.slug]
          const cajerosMap: Record<string, any> = {}
          for (const slug of slugCandidates) {
            try {
              const parcialSnap = await getDoc(doc(db!, 'cuadre_parcial', `${slug}_${today}`))
              if (parcialSnap.exists()) {
                const map = parcialSnap.data()?.cajeros || {}
                Object.entries(map).forEach(([k, v]) => { cajerosMap[k] = v })
              }
            } catch { /* noop */ }
          }

          // Normalizar nombres para matching robusto (case-insensitive, trim, sin acentos)
          const normName = (s: string) => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          const cajerosMapNorm: Record<string, any> = {}
          Object.entries(cajerosMap).forEach(([k, v]) => { cajerosMapNorm[normName(k)] = v })

          // Si ya existe un reporte final enviado para hoy, todas las cajeras se consideran listas
          let hasFinalReport = false
          try {
            const [yyyy, MM, dd] = today.split('-')
            for (const slug of slugCandidates) {
              const finalSnap = await getDoc(doc(db!, 'reports', slug, yyyy, MM, 'days', dd))
              if (finalSnap.exists()) { hasFinalReport = true; break }
            }
          } catch { /* noop */ }

          const cajerosStatus = names.map(nombre => {
            const entry = cajerosMap[nombre] || cajerosMapNorm[normName(nombre)]
            const status = entry?.status
            // Tratar como "listo" cualquier estado terminal conocido, completedAt, o si ya se envió el cierre final
            const listo = hasFinalReport || status === 'completed' || status === 'submitted' || status === 'absent' || status === 'no_caja' || (!!entry?.completedAt && !entry?.correctionPending)
            return { nombre, listo }
          })

          // Mostrar siempre todas las sedes con cajeras (verdes si listas, rojas si pendientes)
          result[suc.slug] = { sedeName: suc.name, cajeros: cajerosStatus }
        } catch (err) {
          console.warn(`[CuadreStatus] Error en ${suc.slug}:`, err)
        }
      }))
      setCuadreStatusBySede(result)
    } catch (e) {
      console.warn('Error loading cuadre status:', e)
    }
  }

  const loadMonthlyData = async () => {
    // ── [APPWRITE] Binding real: agregado mensual desde cuadres_erp ──
    {
      try {
        setLoadingMonthly(true)
        const cuadres = await fetchCuadresERP(2)
        const nowCL = new Date(Date.now() - 3 * 60 * 60 * 1000)
        const ym = nowCL.toISOString().slice(0, 7) // 'YYYY-MM'
        const monthList = cuadres.filter((c: CuadreERP) => (c.fecha || '').slice(0, 7) === ym)
        const bruto = (c: CuadreERP) =>
          (Number(c.montos?.efectivoSistema) || 0) + (Number(c.montos?.debitoSistema) || 0) + (Number(c.montos?.transferencias) || 0)
        const dayMap = new Map<string, DayData>()
        const perSedeAcc: Record<string, { ventas: number; gastos: number; ganancia: number }> = {}
        const perSedeDaily: Record<string, DayData[]> = {}
        monthList.forEach((c: CuadreERP) => {
          const ventas = bruto(c)
          const gastos = Number(c.calculos?.gastosTotales) || 0
          const ganancia = ventas - gastos
          const parts = (c.fecha || '').split('-')
          const label = `${parts[2] || ''}/${parts[1] || ''}`
          const dd = dayMap.get(c.fecha) || { fecha: label, fechaFull: c.fecha, ventas: 0, gastos: 0, ganancia: 0 }
          dd.ventas += ventas; dd.gastos += gastos; dd.ganancia += ganancia
          dayMap.set(c.fecha, dd)
          const acc = perSedeAcc[c.sede] || { ventas: 0, gastos: 0, ganancia: 0 }
          acc.ventas += ventas; acc.gastos += gastos; acc.ganancia += ganancia
          perSedeAcc[c.sede] = acc
          ;(perSedeDaily[c.sede] = perSedeDaily[c.sede] || []).push({ fecha: label, fechaFull: c.fecha, ventas, gastos, ganancia })
        })
        const days = Array.from(dayMap.values()).sort((a, b) => a.fechaFull.localeCompare(b.fechaFull))
        Object.keys(perSedeDaily).forEach((s) => perSedeDaily[s].sort((a, b) => a.fechaFull.localeCompare(b.fechaFull)))
        setMonthlyData(days)
        setDailyBySede(perSedeDaily)
        setMonthlyBySede(perSedeAcc)
        setFixedMonthlyBySede({}) // gastos fijos (sueldos/externos): binding posterior
        setLoadingMonthly(false)
        return
      } catch (e) {
        console.error('[Dashboard][Appwrite] loadMonthlyData error:', e)
        setLoadingMonthly(false)
        return
      }
    }
    // ─── (código original de Firebase — ya no se ejecuta) ───
    if (!db || IS_DEMO_PROJECT) return
    setLoadingMonthly(true)
    try {
      const SUCURSALES = getSucursales()
      const today = new Date()
      // Build days from 1st of current month to today
      const days: { yyyy: string; MM: string; dd: string; label: string; fechaFull: string }[] = []
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      for (let d = new Date(firstOfMonth); d <= today; d.setDate(d.getDate() + 1)) {
        const yyyy = String(d.getFullYear())
        const MM = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        days.push({ yyyy, MM, dd, label: `${dd}/${MM}`, fechaFull: `${yyyy}-${MM}-${dd}` })
      }

      // Per-day totals across all sedes
      const dayMap = new Map<string, DayData>()
      days.forEach(d => dayMap.set(d.fechaFull, { fecha: d.label, fechaFull: d.fechaFull, ventas: 0, gastos: 0, ganancia: 0 }))

      // Per-sede monthly totals y per-sede daily map
      const sedeAcc: Record<string, { ventas: number; gastos: number; ganancia: number }> = {}
      const sedeDayMap: Record<string, Map<string, DayData>> = {}
      SUCURSALES.forEach(s => {
        sedeAcc[s.slug] = { ventas: 0, gastos: 0, ganancia: 0 }
        const m = new Map<string, DayData>()
        days.forEach(d => m.set(d.fechaFull, { fecha: d.label, fechaFull: d.fechaFull, ventas: 0, gastos: 0, ganancia: 0 }))
        sedeDayMap[s.slug] = m
      })

      // Fetch all days × all sedes in parallel
      await Promise.all(SUCURSALES.flatMap(suc =>
        days.map(async day => {
          try {
            let snap = await getDoc(doc(db!, 'sedes', suc.slug, 'reports', day.fechaFull))
            if (!snap.exists()) {
              snap = await getDoc(doc(db!, 'reports', suc.slug, day.yyyy, day.MM, 'days', day.dd))
            }
            if (!snap.exists()) return
            const raw: any = snap.data()
            const ventas = (Number(raw?.montos?.efectivoSistema) || 0) +
              (Number(raw?.montos?.debitoSistema) || 0) +
              (Number(raw?.montos?.transferencias) || 0)
            const gastos = Number(raw?.calculos?.gastosTotales) || 0
            const topArr = Array.isArray(raw?.topProducts) ? raw.topProducts : []
            let totV = 0, totC = 0
            topArr.forEach((p: any) => {
              const ventasBrutas = Number(p?.ventasBrutas) || 0
              const costoNeto = Number(p?.costoNeto) || 0
              if (costoNeto > 0 || ventasBrutas > 0) { totV += ventasBrutas; totC += costoNeto }
            })
            const ganancia = (totV - totC) - gastos

            const dayEntry = dayMap.get(day.fechaFull)
            if (dayEntry) {
              dayEntry.ventas += ventas
              dayEntry.gastos += gastos
              dayEntry.ganancia += ganancia
            }
            if (sedeAcc[suc.slug]) {
              sedeAcc[suc.slug].ventas += ventas
              sedeAcc[suc.slug].gastos += gastos
              sedeAcc[suc.slug].ganancia += ganancia
            }
            const sedeDayEntry = sedeDayMap[suc.slug]?.get(day.fechaFull)
            if (sedeDayEntry) {
              sedeDayEntry.ventas += ventas
              sedeDayEntry.gastos += gastos
              sedeDayEntry.ganancia += ganancia
            }
          } catch { /* skip */ }
        })
      ))

      // Cargar sueldos planilla + gastos fijos externos por sede y restarlos del resultado
      // Prorrateo: (sueldos mensuales + gastos fijos mensuales) * (diasLaborablesHastaHoy / diasLaborablesTotalMes)
      const countWorkingDays = (start: Date, end: Date) => {
        let count = 0
        const d = new Date(start)
        while (d <= end) {
          if (d.getDay() !== 0) count++ // lun-sab (excluye domingos)
          d.setDate(d.getDate() + 1)
        }
        return count
      }
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const workingDaysElapsed = countWorkingDays(firstOfMonth, today)
      const workingDaysTotal = countWorkingDays(firstOfMonth, lastDayOfMonth)
      const proratio = workingDaysTotal > 0 ? workingDaysElapsed / workingDaysTotal : 0

      const fixedBySede: Record<string, { sueldos: number; externos: number; total: number }> = {}

      await Promise.all(SUCURSALES.map(async (suc) => {
        try {
          // Sueldos: colección trabajadores filtrada por sede
          const workersSnap = await getDocs(query(collection(db!, 'trabajadores'), where('sede', '==', suc.slug)))
          let sueldosMensual = 0
          workersSnap.forEach((docSnap: any) => {
            const raw: any = docSnap.data()
            sueldosMensual += Number(raw?.sueldo) || 0
          })

          // Gastos fijos externos: doc external_expenses/{sede}
          let externosFijosMensual = 0
          try {
            const extSnap = await getDoc(doc(db!, 'external_expenses', suc.slug))
            if (extSnap.exists()) {
              const rawItems = Array.isArray(extSnap.data()?.fixedItems) ? extSnap.data()?.fixedItems : []
              externosFijosMensual = rawItems
                .filter((it: any) => it?.active !== false)
                .reduce((sum: number, it: any) => sum + (Number(it?.amount) || 0), 0)
            }
          } catch { /* skip */ }

          fixedBySede[suc.slug] = {
            sueldos: sueldosMensual,
            externos: externosFijosMensual,
            total: sueldosMensual + externosFijosMensual,
          }

          const ajuste = Math.round((sueldosMensual + externosFijosMensual) * proratio)
          if (sedeAcc[suc.slug]) {
            sedeAcc[suc.slug].gastos += ajuste
            sedeAcc[suc.slug].ganancia -= ajuste
          }

          // Distribuir ajuste diariamente para que los sparklines y charts diarios reflejen
          const ajustePerDay = workingDaysElapsed > 0 ? ajuste / workingDaysElapsed : 0
          days.forEach(d => {
            const dDate = new Date(d.fechaFull + 'T00:00:00')
            if (dDate.getDay() === 0) return // domingo
            const dayEntry = dayMap.get(d.fechaFull)
            if (dayEntry) {
              dayEntry.gastos += ajustePerDay
              dayEntry.ganancia -= ajustePerDay
            }
            const sedeDayEntry = sedeDayMap[suc.slug]?.get(d.fechaFull)
            if (sedeDayEntry) {
              sedeDayEntry.gastos += ajustePerDay
              sedeDayEntry.ganancia -= ajustePerDay
            }
          })
        } catch (err) {
          console.warn(`[Dashboard] Error cargando sueldos/externos ${suc.slug}:`, err)
        }
      }))

      setMonthlyData(Array.from(dayMap.values()))
      setMonthlyBySede(sedeAcc)
      setFixedMonthlyBySede(fixedBySede)
      const dailyBySedeOut: Record<string, DayData[]> = {}
      Object.keys(sedeDayMap).forEach(slug => {
        dailyBySedeOut[slug] = Array.from(sedeDayMap[slug].values())
      })
      setDailyBySede(dailyBySedeOut)
    } catch (e) {
      console.error('[Dashboard] loadMonthlyData error:', e)
    } finally {
      setLoadingMonthly(false)
    }
  }

  useEffect(() => {
    if (onboardingOpen) return
    loadData()
    loadTrabajadores()
    loadCuadreStatusToday()
  }, [dateMode, costsBD, onboardingOpen])

  // Refrescar estado de cuadres cada 60s
  useEffect(() => {
    if (onboardingOpen) return
    const id = setInterval(() => { loadCuadreStatusToday() }, 60000)
    return () => clearInterval(id)
  }, [onboardingOpen])

  useEffect(() => {
    if (onboardingOpen) return
    loadMonthlyData()
  }, [onboardingOpen])

  // Scroll al último mensaje del chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [iaMessages])

  // IA Chat - Tutorial del Dashboard
  const sendToIA = async (message: string, shouldSpeak: boolean = false, showInCallWindow: boolean = false) => {
    if (!message.trim()) return
    
    const userMsg = { role: 'user' as const, content: message }
    setIaMessages(prev => [...prev, userMsg])
    setIaInput('')
    setIaLoading(true)

    try {
      // Contexto del Dashboard para la IA
      const dashboardContext = `Eres ASIS, el asistente tutorial del Dashboard de Tiendas 3B. Tu rol es explicar cómo funciona el sistema.

ESTRUCTURA DEL DASHBOARD:
1. **Panel Principal**: Muestra ventas brutas, gastos y ganancia final del día (ayer o hoy)
2. **Sucursales**: La Florida, Alameda y Copiapó con sus datos individuales
3. **Top Productos**: Los 5 productos más vendidos del día
4. **Trabajadores**: Acceso rápido al equipo

MENÚ LATERAL (Sidebar):
- Inicio: Dashboard principal
- Realizar Corte: Para cajeras, cierre de caja diario
- Corregir Corte: Admin para editar cuadres existentes
- Chat IA: Asistente general ASIS
- WhatsApp: Gestión de contactos y mensajes
- Trabajadores: Planilla unificada del personal
- Inventario: Control de stock
- Rev. Costos: Productos con costo bajo o sin costo
- Rev. Precios: Productos con precio bajo
- Informes: Reportes generales
- Top 10: Productos más vendidos histórico
- Alertas: Anomalías detectadas
- Base de Datos: Acceso directo a Firebase
- Control Datos: Búsqueda avanzada
- Utilidad: Calculadora de utilidades
- Análisis: Histórico de ventas
- Tiempo Real: Ventas en vivo
- Pedidos: Control de pedidos
- Ganancias Excel: Exportar a Excel
- Informe Mensual: Resumen del mes

DATOS ACTUALES:
- Ventas: ${totals.ventas > 0 ? '$' + totals.ventas.toLocaleString('es-CL') : 'Cargando...'}
- Gastos: ${totals.gastos > 0 ? '$' + totals.gastos.toLocaleString('es-CL') : 'Cargando...'}
- Ganancia: ${totals.ganancia > 0 ? '$' + totals.ganancia.toLocaleString('es-CL') : 'Cargando...'}
- Sucursales activas: ${sucursalesData.length}
- Top producto: ${topProducts[0]?.nombre || 'N/A'} (${topProducts[0]?.cantidad || 0} uds)

Responde de forma amigable y concisa. Si preguntan por algo específico, explica cómo acceder o usarlo.`

      const response = await fetch(`${CLOUD_FUNCTIONS_BASE_URL}/chatWithGemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `${dashboardContext}\n\nPregunta del usuario: ${message}`,
          sessionId: 'dashboard-tutorial'
        })
      })

      const data = await response.json()
      const assistantMsg = { role: 'assistant' as const, content: data.response || 'Sin respuesta' }
      setIaMessages(prev => [...prev, assistantMsg])
      
      // Mostrar en ventana superpuesta si se indica
      if (showInCallWindow && data.response) {
        setCallDisplayContent(data.response)
        setTimeout(() => setCallDisplayContent(null), 15000)
      }
      
      // Leer respuesta en voz alta si se indica
      if (shouldSpeak) {
        speakText(data.response, showInCallWindow)
      }
    } catch (e) {
      setIaMessages(prev => [...prev, { role: 'assistant', content: 'Error al conectar con la IA' }])
    } finally {
      setIaLoading(false)
    }
  }

  // Speech Recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'es-CL'
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setIaInput(transcript)
      const inCallMode = isCallModeRef.current
      sendToIA(transcript, true, inCallMode)
    }

    recognitionRef.current.onend = () => setIsListening(false)
    recognitionRef.current.onerror = () => setIsListening(false)
    recognitionRef.current.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsListening(false)
  }

  // Text to Speech
  const speakText = async (text: string, formatForVoice: boolean = false) => {
    try {
      let cleanText = text
        .replace(/\*\*/g, '')
        .replace(/###?\s*/g, '')
        .replace(/[-─━]{3,}/g, '')
        .replace(/•/g, '')
      
      if (formatForVoice) {
        // Quitar emojis
        cleanText = cleanText.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
          .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
          .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
          .replace(/[\u{2600}-\u{26FF}]/gu, '')
        // Formatear números
        cleanText = cleanText.replace(/\$\s*([\d.]+)/g, (_, num) => num.replace(/\./g, '') + ' pesos')
        cleanText = cleanText.replace(/(\d+)\.(\d{3})/g, '$1$2')
      }
      
      cleanText = cleanText.substring(0, 800)
      
      const resp = await fetch(`${CLOUD_FUNCTIONS_BASE_URL}/textToSpeech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText })
      })
      
      const data = await resp.json()
      
      if (data.ok && data.audio) {
        const audioData = atob(data.audio)
        const audioArray = new Uint8Array(audioData.length)
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i)
        }
        const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        setIsSpeakingAudio(true)
        audio.onended = () => {
          setIsSpeakingAudio(false)
          audioRef.current = null
          if (isCallModeRef.current && !isMicMuted) {
            setTimeout(() => startListening(), 500)
          }
        }
        audio.play()
      }
    } catch (e) {
      console.error('Error en TTS:', e)
    }
  }

  const interruptAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeakingAudio(false)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  const shortcuts = useMemo(() => [
    { to: '/admin', label: 'Cortes', icon: <ClipboardList size={18} />, color: 'indigo' },
    { to: '/planilla-unificada', label: 'Personal', icon: <Users size={18} />, color: 'blue' },
    { to: '/inventario', label: 'Inventario', icon: <Boxes size={18} />, color: 'violet' },
    { to: '/revision-costos', label: 'Costos', icon: <AlertTriangle size={18} />, color: 'rose' },
    { to: '/whatsapp-gestion', label: 'WhatsApp', icon: <MessageCircle size={18} />, color: 'green' },
    { to: '/telegram-gestion', label: 'Telegram', icon: <MessageCircle size={18} />, color: 'sky' },
    { to: '/informes-generales', label: 'Informes', icon: <FileText size={18} />, color: 'slate' },
    { to: '/top-products', label: 'Top 10', icon: <Trophy size={18} />, color: 'amber' },
    { to: '/base-datos', label: 'Base Datos', icon: <Database size={18} />, color: 'emerald' },
  ], [])

  const sidebarLinks = useMemo(() => [
    { to: '/', label: 'Inicio', icon: <Home size={18} />, color: 'blue', desc: 'Dashboard' },
    { to: '/cajeras', label: 'Realizar Corte', icon: <FileText size={18} />, color: 'fuchsia', desc: 'Cierre caja' },
    { to: '/_admin', label: 'Ver Cortes', icon: <ClipboardList size={18} />, color: 'indigo', desc: 'Cuadres enviados' },
    { to: '/admin', label: 'Corregir Corte', icon: <ClipboardList size={18} />, color: 'indigo', desc: 'Editar cuadres' },
    { to: '/admin-supreme', label: 'Admin Supreme', icon: <Shield size={18} />, color: 'purple', desc: 'Panel maestro' },
    { to: '/gastos', label: 'Gastos', icon: <DollarSign size={18} />, color: 'rose', desc: 'Por sucursal' },
    { to: '/gastos-externos', label: 'Gastos Externos', icon: <Receipt size={18} />, color: 'rose', desc: 'Fuera cuadre' },
    { to: '/adelantos-personal', label: 'Adelantos Personal', icon: <DollarSign size={18} />, color: 'amber', desc: 'Préstamos' },
    { to: '/sucursales', label: 'Sucursales', icon: <Building2 size={18} />, color: 'blue', desc: 'Resumen sedes' },
    { to: '/chat-ia', label: 'Chat IA', icon: <Brain size={18} />, color: 'blue', desc: 'Asistente ASIS' },
    { to: '/cerebro-ia', label: 'Cerebro IA', icon: <Brain size={18} />, color: 'violet', desc: 'IA avanzada' },
    { to: '/whatsapp-gestion', label: 'WhatsApp', icon: <MessageCircle size={18} />, color: 'green', desc: 'Contactos' },
    { to: '/whatsapp-config', label: 'WhatsApp Config', icon: <MessageCircle size={18} />, color: 'green', desc: 'Configuración' },
    { to: '/telegram-gestion', label: 'Telegram', icon: <MessageCircle size={18} />, color: 'sky', desc: 'Roles' },
    { to: '/planilla-unificada', label: 'Trabajadores', icon: <Users size={18} />, color: 'indigo', desc: 'Planilla' },
    { to: '/informe-general-trabajadores', label: 'Informe Trabajadores', icon: <Users size={18} />, color: 'indigo', desc: 'General' },
    { to: '/analisis-cajeras', label: 'Análisis Cajeras', icon: <Users size={18} />, color: 'pink', desc: 'Rendimiento' },
    { to: '/roles', label: 'Roles', icon: <Users size={18} />, color: 'purple', desc: 'Gestión usuarios' },
    { to: '/inventario', label: 'Inventario', icon: <Boxes size={18} />, color: 'violet', desc: 'Stock' },
    { to: '/revision-costos', label: 'Rev. Costos', icon: <AlertTriangle size={18} />, color: 'rose', desc: 'Bajo costo' },
    { to: '/revision-precios', label: 'Rev. Precios', icon: <DollarSign size={18} />, color: 'amber', desc: 'Precios bajos' },
    { to: '/correccion-precios', label: 'Corrección Precios', icon: <TrendingDown size={18} />, color: 'rose', desc: 'Costo vs venta' },
    { to: '/comparacion-costos', label: 'Comparación Costos', icon: <TrendingDown size={18} />, color: 'amber', desc: 'Comparar' },
    { to: '/comparacion-logica', label: 'Comparación Lógica', icon: <TrendingDown size={18} />, color: 'amber', desc: 'Lógica costos' },
    { to: '/productos-duplicados', label: 'Productos Duplicados', icon: <Copy size={18} />, color: 'red', desc: 'Duplicados' },
    { to: '/productos-estrella', label: 'Productos Estrella', icon: <Star size={18} />, color: 'amber', desc: 'Mejores' },
    { to: '/clientes-frecuentes', label: 'Clientes Frecuentes', icon: <Users size={18} />, color: 'blue', desc: 'Fidelización' },
    { to: '/informes-generales', label: 'Informes', icon: <FileText size={18} />, color: 'slate', desc: 'Reportes' },
    { to: '/informes', label: 'Informes Clásicos', icon: <FileText size={18} />, color: 'slate', desc: 'Antiguos' },
    { to: '/informes-productos', label: 'Informes Productos', icon: <FileText size={18} />, color: 'slate', desc: 'Por producto' },
    { to: '/informe-mensual', label: 'Informe Mensual', icon: <BarChart2 size={18} />, color: 'green', desc: 'Mes' },
    { to: '/informe-merma', label: 'Informe Merma', icon: <BarChart2 size={18} />, color: 'rose', desc: 'Pérdidas' },
    { to: '/top-products', label: 'Top 10', icon: <Trophy size={18} />, color: 'amber', desc: 'Más vendidos' },
    { to: '/top-producto-dia', label: 'Top del Día', icon: <Trophy size={18} />, color: 'amber', desc: 'Hoy' },
    { to: '/alertas', label: 'Alertas', icon: <Activity size={18} />, color: 'red', desc: 'Anomalías' },
    { to: '/base-datos', label: 'Base de Datos', icon: <Database size={18} />, color: 'sky', desc: 'Firebase' },
    { to: '/control-datos', label: 'Control Datos', icon: <Search size={18} />, color: 'indigo', desc: 'Búsqueda' },
    { to: '/depurador', label: 'Depurador', icon: <Bug size={18} />, color: 'rose', desc: 'Debug SKU' },
    { to: '/eliminador-masivo', label: 'Eliminador Masivo', icon: <Trash2 size={18} />, color: 'rose', desc: 'Borrar products' },
    { to: '/comprobador-datos-2', label: 'Comprobador', icon: <Search size={18} />, color: 'cyan', desc: 'Verificación' },
    { to: '/asis-monitor', label: 'ASIS Monitor', icon: <Activity size={18} />, color: 'emerald', desc: 'Estado IA' },
    { to: '/utilidad', label: 'Utilidad', icon: <Calculator size={18} />, color: 'emerald', desc: 'Cálculos' },
    { to: '/analisis-historico', label: 'Análisis', icon: <BarChart2 size={18} />, color: 'purple', desc: 'Histórico' },
    { to: '/ventas-tiempo-real', label: 'Tiempo Real', icon: <Activity size={18} />, color: 'red', desc: 'En vivo' },
    { to: '/control-pedidos', label: 'Pedidos', icon: <ShoppingCart size={18} />, color: 'amber', desc: 'Control' },
    { to: '/pagos-pedidos', label: 'Pagos & Pedidos', icon: <ShoppingCart size={18} />, color: 'blue', desc: 'Plataforma Web' },
    { to: '/separar-ventas', label: 'Separar Ventas', icon: <Split size={18} />, color: 'sky', desc: 'Por método' },
    { to: '/transferencias', label: 'Transferencias', icon: <Landmark size={18} />, color: 'cyan', desc: 'Webhook MP' },
    { to: '/conciliar-transferencias', label: 'Conciliar Transferencias', icon: <Link2 size={18} />, color: 'violet', desc: 'RetailBase' },
    { to: '/ganancias-excel', label: 'Ganancias Excel', icon: <TrendingUp size={18} />, color: 'green', desc: 'Export' },
    { to: '/pos', label: 'POS', icon: <ShoppingCart size={18} />, color: 'fuchsia', desc: 'Punto de venta' },
  ], [])

  return (
    <>
    <div className="px-4 py-4 pb-24 space-y-5 max-w-7xl mx-auto">
      {/* Barra de filtros del Dashboard */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 flex-shrink-0">
            <button onClick={() => setDateMode('ayer')} className={`px-2.5 py-1 text-xs rounded-md transition-all ${dateMode === 'ayer' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>Ayer</button>
            <button onClick={() => setDateMode('hoy')} className={`px-2.5 py-1 text-xs rounded-md transition-all ${dateMode === 'hoy' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>Hoy</button>
          </div>
          {/* Chips de sucursales con cuadres pendientes */}
          {Object.keys(cuadreStatusBySede).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {Object.entries(cuadreStatusBySede).map(([slug, info]) => (
                <div
                  key={slug}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 min-w-0"
                  title={`${info.sedeName} — cierre de caja pendiente`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 whitespace-nowrap">{info.sedeName}</span>
                  <span className="text-amber-300">·</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {info.cajeros.map(c => (
                      <button
                        key={c.nombre}
                        type="button"
                        onClick={() => {
                          if (c.listo) return
                          navigate(`/${slug}?cajera=${encodeURIComponent(c.nombre)}`)
                        }}
                        disabled={c.listo}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                          c.listo
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200 hover:scale-105 active:scale-95 cursor-pointer'
                        }`}
                        title={c.listo ? `${c.nombre} — cuadre listo` : `Hacer corte de ${c.nombre}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.listo ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className="truncate max-w-[120px]">{c.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setShowDatePicker(!showDatePicker)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" title="Filtrar por fecha">
            <Calendar size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
          {showDatePicker && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">📅 Filtrar por fecha</p>
              <label className="text-[10px] text-slate-500 font-bold">Desde</label>
              <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="w-full mt-0.5 mb-2 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <label className="text-[10px] text-slate-500 font-bold">Hasta</label>
              <input type="date" value={customDateEnd} onChange={e => setCustomDateEnd(e.target.value)} className="w-full mt-0.5 mb-3 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <div className="flex gap-2">
                <button onClick={() => { setShowDatePicker(false); loadData(true) }} className="flex-1 px-3 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-colors">Aplicar</button>
                <button onClick={() => { setCustomDate(''); setCustomDateEnd(''); setShowDatePicker(false); loadData(true) }} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors">Reset</button>
              </div>
            </div>
          )}
        </div>
      </div>
        {/* Animated progress bar - data completeness */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 p-3 shadow-sm">
          {loading ? (
            <>
              <div className="flex items-center justify-between mb-1.5">
                <div className="h-3 w-24 rounded-full bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out infinite' }} />
                <div className="h-3 w-32 rounded-full bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.2s infinite' }} />
              </div>
              <div className="h-3 rounded-full bg-slate-200/80 overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-gradient-to-r from-slate-300 to-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out infinite' }} />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Datos del día</span>
                <span className="text-xs font-extrabold text-slate-700">
                  {(() => {
                    // Cuadre enviado = doc del día existe en Firestore. Fallback: ventas/gastos > 0 (cache/demo)
                    const filled = displaySucursalesData.filter(s => (s.cuadreEnviado === true) || (s.cuadreEnviado === undefined && (s.ventas > 0 || s.gastos > 0))).length
                    const total = displaySucursalesData.length || 1
                    const pct = Math.round((filled / total) * 100)
                    const label = selectedSedeFilter === 'todas' ? 'sucursales' : 'sede'
                    return `${filled}/${total} ${label} · ${pct}%`
                  })()}
                </span>
              </div>
              <div className="h-6 rounded-full bg-slate-200/80 overflow-hidden relative">
                {(() => {
                  const filled = displaySucursalesData.filter(s => (s.cuadreEnviado === true) || (s.cuadreEnviado === undefined && (s.ventas > 0 || s.gastos > 0))).length
                  const total = displaySucursalesData.length || 1
                  const pct = Math.round((filled / total) * 100)
                  const color = pct >= 100 ? 'from-emerald-400 via-green-400 to-teal-400' : pct >= 50 ? 'from-amber-400 via-orange-400 to-yellow-400' : 'from-rose-400 via-red-400 to-pink-400'
                  return (
                    <div className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${color} transition-[width] duration-1000 ease-out`} style={{ width: `${pct}%` }}>
                      {/* Shimmer wave */}
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,0) 100%)', backgroundSize: '200% 100%', animation: 'td_shimmer 2.5s ease-in-out infinite' }} />
                      {/* Liquid particles - dense */}
                      {[...Array(16)].map((_, i) => (
                        <div key={`pb_${i}`} className="absolute rounded-full" style={{
                          left: `${3 + (i * 6.5) % 92}%`, top: `${8 + (i * 23 + 7) % 75}%`,
                          width: `${1.5 + (i % 4) * 0.8}px`, height: `${1.5 + (i % 4) * 0.8}px`,
                          background: `radial-gradient(circle, rgba(255,255,255,${0.6 + (i % 3) * 0.15}), rgba(255,255,255,0.1))`,
                          boxShadow: `0 0 ${2 + (i % 3)}px rgba(255,255,255,0.5)`,
                          animation: `td_float ${1.2 + (i % 5) * 0.4}s ease-in-out ${(i * 0.15) % 2}s infinite alternate`,
                        }} />
                      ))}
                      {/* Bubble borders - liquid effect */}
                      {[...Array(8)].map((_, i) => (
                        <div key={`pbb_${i}`} className="absolute rounded-full border border-white/30" style={{
                          left: `${5 + (i * 13) % 85}%`, top: `${5 + (i * 19) % 70}%`,
                          width: `${3 + (i % 3) * 2}px`, height: `${3 + (i % 3) * 2}px`,
                          animation: `td_bubble ${1.5 + (i % 4) * 0.5}s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                      {/* Moving highlight blobs */}
                      <div className="absolute top-0 h-full w-8 rounded-full bg-white/15 blur-sm" style={{ left: '20%', animation: 'td_drift 3s ease-in-out infinite' }} />
                      <div className="absolute top-0 h-full w-6 rounded-full bg-white/10 blur-sm" style={{ left: '60%', animation: 'td_drift 4s ease-in-out infinite reverse' }} />
                    </div>
                  )
                })()}
              </div>
            </>
          )}
        </div>

        {/* Stats - 2x2 en móvil — cards always visible, only amounts shimmer while loading */}
        <div className="grid grid-cols-2 gap-3">
          {/* Ventas Brutas */}
          <Link to="/sucursales" className="block rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 shadow-sm relative overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-50/40 to-transparent dark:from-emerald-900/10" />
              {[...Array(14)].map((_, i) => (
                <div key={`vp_${i}`} className="absolute rounded-full" style={{
                  left: `${8 + (i * 13 + 5) % 80}%`,
                  top: `${10 + (i * 19 + 7) % 70}%`,
                  width: `${3 + (i % 3) * 1.5}px`, height: `${3 + (i % 3) * 1.5}px`,
                  background: `radial-gradient(circle, rgba(52,211,153,${0.45 + (i % 3) * 0.12}), rgba(16,185,129,${0.2 + (i % 3) * 0.08}))`,
                  boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(16,185,129,0.3)`,
                  animation: `td_float ${3 + (i % 4) * 0.8}s ease-in-out ${(i * 0.3) % 3.5}s infinite alternate`,
                }} />
              ))}
              <div className="absolute top-1/4 left-1/3 h-5 w-5 rounded-full bg-emerald-300/20 blur-md" style={{ animation: 'td_drift 4s ease-in-out infinite' }} />
              <div className="absolute bottom-1/4 right-1/4 h-4 w-4 rounded-full bg-green-300/15 blur-md" style={{ animation: 'td_drift 5s ease-in-out infinite reverse' }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center border border-emerald-200/50 group-hover:scale-110 transition-transform"><TrendingUp size={14} className="text-emerald-600" /></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ventas Brutas</span>
              </div>
              {loading ? (
                <div className="h-7 w-20 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
              ) : (
                <p className="text-xl font-bold text-slate-800 dark:text-white">{formatCompact(displayTotals.ventas)}</p>
              )}
            </div>
          </Link>
          {/* Gastos */}
          <Link to="/gastos" className="block rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 shadow-sm relative overflow-hidden hover:shadow-md hover:border-rose-300 transition-all group">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-rose-50/40 to-transparent dark:from-rose-900/10" />
              {[...Array(14)].map((_, i) => (
                <div key={`gp_${i}`} className="absolute rounded-full" style={{
                  left: `${8 + (i * 15 + 3) % 80}%`,
                  top: `${10 + (i * 17 + 11) % 70}%`,
                  width: `${3 + (i % 3) * 1.5}px`, height: `${3 + (i % 3) * 1.5}px`,
                  background: `radial-gradient(circle, rgba(251,113,133,${0.45 + (i % 3) * 0.12}), rgba(244,63,94,${0.2 + (i % 3) * 0.08}))`,
                  boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(244,63,94,0.3)`,
                  animation: `td_float ${3 + (i % 4) * 0.8}s ease-in-out ${(i * 0.35) % 3.5}s infinite alternate`,
                }} />
              ))}
              <div className="absolute top-1/4 right-1/3 h-5 w-5 rounded-full bg-rose-300/20 blur-md" style={{ animation: 'td_drift 4.5s ease-in-out infinite' }} />
              <div className="absolute bottom-1/4 left-1/4 h-4 w-4 rounded-full bg-red-300/15 blur-md" style={{ animation: 'td_drift 5.5s ease-in-out infinite reverse' }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 flex items-center justify-center border border-rose-200/50 group-hover:scale-110 transition-transform"><TrendingDown size={14} className="text-rose-600" /></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gastos</span>
              </div>
              {loading ? (
                <div className="h-7 w-20 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
              ) : (
                <p className="text-xl font-bold text-slate-800 dark:text-white">{formatCompact(displayTotals.gastos)}</p>
              )}
            </div>
          </Link>
          {/* Ganancia Final */}
          <div className="col-span-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-4 shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
            onClick={() => navigate('/top-products/productos?global=1')}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Floating particles */}
              {[...Array(20)].map((_, i) => (
                <div key={`gf_${i}`} className="absolute rounded-full" style={{
                  left: `${5 + (i * 11 + 3) % 88}%`,
                  top: `${8 + (i * 17 + 5) % 78}%`,
                  width: `${2 + (i % 4) * 1.5}px`, height: `${2 + (i % 4) * 1.5}px`,
                  background: `radial-gradient(circle, rgba(255,255,255,${0.3 + (i % 3) * 0.15}), rgba(255,255,255,${0.1 + (i % 3) * 0.05}))`,
                  boxShadow: `0 0 ${4 + (i % 3) * 3}px rgba(255,255,255,0.25)`,
                  animation: `td_float ${2.5 + (i % 5) * 0.7}s ease-in-out ${(i * 0.25) % 4}s infinite alternate`,
                }} />
              ))}
              {/* Blur orbs */}
              <div className="absolute top-0 left-1/4 h-12 w-12 rounded-full bg-white/10 blur-xl" style={{ animation: 'td_drift 5s ease-in-out infinite' }} />
              <div className="absolute bottom-0 right-1/3 h-10 w-10 rounded-full bg-emerald-300/15 blur-xl" style={{ animation: 'td_drift 6s ease-in-out infinite reverse' }} />
              <div className="absolute top-1/2 left-2/3 h-8 w-8 rounded-full bg-teal-200/10 blur-lg" style={{ animation: 'td_drift 4s ease-in-out 1s infinite' }} />
              {/* Bubble circles */}
              {[...Array(6)].map((_, i) => (
                <div key={`gb_${i}`} className="absolute rounded-full border border-white/20" style={{
                  left: `${8 + i * 16}%`,
                  bottom: `${5 + (i % 3) * 15}%`,
                  width: `${8 + (i % 3) * 6}px`, height: `${8 + (i % 3) * 6}px`,
                  animation: `td_bubble ${3 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
                }} />
              ))}
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-green-100 text-xs font-bold flex items-center gap-1.5">Ganancia Final</p>
                {loading ? (
                  <div className="h-9 w-28 rounded-lg bg-white/20 animate-pulse mt-1" />
                ) : (
                  <p className="text-3xl font-black text-white drop-shadow-sm">{formatCompact(displayTotals.ganancia)}</p>
                )}
                <p className="text-[10px] text-green-200 mt-0.5">Ventas - Costos - Gastos → Ver detalle</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <DollarSign size={28} className="text-white drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Atajos IA - below Ganancia Final */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/cerebro-ia"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-violet-300 transition-all"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-violet-50/40 to-transparent dark:from-violet-900/10" />
              {[...Array(14)].map((_, i) => (
                <div key={`ci_${i}`} className="absolute rounded-full border border-violet-300/30" style={{
                  left: `${3 + (i * 7 + 2) % 90}%`,
                  bottom: `${2 + (i * 11 + 5) % 80}%`,
                  width: `${5 + (i % 4) * 4}px`, height: `${5 + (i % 4) * 4}px`,
                  animation: `td_bubble ${2.5 + i * 0.4}s ease-in-out ${i * 0.25}s infinite`,
                }} />
              ))}
              {[...Array(14)].map((_, i) => (
                <div key={`cd_${i}`} className="absolute rounded-full" style={{
                  left: `${3 + (i * 11 + 7) % 90}%`,
                  top: `${3 + (i * 17 + 3) % 90}%`,
                  width: `${2 + (i % 3) * 1.5}px`, height: `${2 + (i % 3) * 1.5}px`,
                  background: `radial-gradient(circle, rgba(139,92,246,${0.35 + (i % 3) * 0.12}), rgba(124,58,237,${0.1 + (i % 3) * 0.08}))`,
                  boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(139,92,246,0.25)`,
                  animation: `td_float ${2.5 + (i % 5) * 0.7}s ease-in-out ${(i * 0.2) % 4}s infinite alternate`,
                }} />
              ))}
              <div className="absolute top-[15%] left-1/3 h-7 w-7 rounded-full bg-violet-300/20 blur-md" style={{ animation: 'td_drift 4s ease-in-out infinite' }} />
              <div className="absolute top-[55%] right-[20%] h-6 w-6 rounded-full bg-purple-300/15 blur-md" style={{ animation: 'td_drift 5s ease-in-out infinite reverse' }} />
              <div className="absolute bottom-[10%] left-[15%] h-5 w-5 rounded-full bg-violet-400/10 blur-md" style={{ animation: 'td_drift 6s ease-in-out 1s infinite' }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center border border-violet-200/50 group-hover:scale-110 transition-transform">
                  <Brain size={20} className="text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Cerebro IA</p>
                  <p className="text-[10px] text-slate-500">Gastos, ventas, análisis</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-bold bg-violet-100 text-violet-600 border border-violet-200">✨ Gemini 2.5</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Activo</span>
              </div>
            </div>
          </Link>
          <Link
            to="/asis-monitor"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-teal-50/40 to-transparent dark:from-teal-900/10" />
              {[...Array(14)].map((_, i) => (
                <div key={`da_${i}`} className="absolute rounded-full border border-teal-300/30" style={{
                  left: `${3 + (i * 8 + 4) % 90}%`,
                  bottom: `${2 + (i * 13 + 3) % 80}%`,
                  width: `${5 + (i % 4) * 4}px`, height: `${5 + (i % 4) * 4}px`,
                  animation: `td_bubble ${2.5 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
              {[...Array(14)].map((_, i) => (
                <div key={`dd_${i}`} className="absolute rounded-full" style={{
                  left: `${3 + (i * 13 + 5) % 90}%`,
                  top: `${3 + (i * 19 + 9) % 90}%`,
                  width: `${2 + (i % 3) * 1.5}px`, height: `${2 + (i % 3) * 1.5}px`,
                  background: `radial-gradient(circle, rgba(20,184,166,${0.35 + (i % 3) * 0.12}), rgba(13,148,136,${0.1 + (i % 3) * 0.08}))`,
                  boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(20,184,166,0.25)`,
                  animation: `td_float ${2.5 + (i % 5) * 0.7}s ease-in-out ${(i * 0.25) % 4}s infinite alternate`,
                }} />
              ))}
              <div className="absolute top-[15%] right-1/3 h-7 w-7 rounded-full bg-teal-300/20 blur-md" style={{ animation: 'td_drift 4.5s ease-in-out infinite' }} />
              <div className="absolute top-[55%] left-[20%] h-6 w-6 rounded-full bg-emerald-300/15 blur-md" style={{ animation: 'td_drift 5.5s ease-in-out infinite reverse' }} />
              <div className="absolute bottom-[10%] right-[15%] h-5 w-5 rounded-full bg-teal-400/10 blur-md" style={{ animation: 'td_drift 6s ease-in-out 1s infinite' }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 flex items-center justify-center border border-teal-200/50 group-hover:scale-110 transition-transform">
                  <Activity size={20} className="text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Dashboard ASIS</p>
                  <p className="text-[10px] text-slate-500">Autonomía, genoma, metas</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Producto más vendido - Clickeable */}
        {loading ? (
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out infinite' }} />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-36 rounded-full bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.1s infinite' }} />
                <div className="h-3.5 w-48 rounded-full bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.2s infinite' }} />
                <div className="h-2.5 w-28 rounded-full bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.3s infinite' }} />
              </div>
            </div>
          </div>
        ) : displayTopProducts.length > 0 && (
          <Link 
            to="/top-producto-dia"
            className="group relative overflow-hidden block rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-50/30 to-transparent dark:from-amber-900/10" />
              {[...Array(22)].map((_, i) => {
                const symbols = ['✦', '★', '✧', '⭐', '✦', '★', '✧', '·', '★', '✦']
                const size = i % 4 === 0 ? 14 : i % 3 === 0 ? 10 : i % 2 === 0 ? 7 : 5
                return (
                  <div key={`tp_${i}`} className="absolute select-none" style={{
                    left: `${3 + (i * 11 + 7) % 92}%`,
                    top: `${5 + (i * 17 + 3) % 85}%`,
                    fontSize: `${size}px`,
                    color: `rgba(251,191,36,${0.3 + (i % 4) * 0.12})`,
                    textShadow: `0 0 ${size}px rgba(245,158,11,${0.3 + (i % 3) * 0.15}), 0 0 ${size * 2}px rgba(251,191,36,0.1)`,
                    animation: `td_float ${3 + (i % 6) * 0.6}s ease-in-out ${(i * 0.2) % 4}s infinite alternate`,
                    transform: `rotate(${(i * 37) % 360}deg)`,
                  }}>{symbols[i % symbols.length]}</div>
                )
              })}
              <div className="absolute top-1/4 right-1/4 h-10 w-10 rounded-full bg-amber-300/20 blur-xl" style={{ animation: 'td_drift 4s ease-in-out infinite' }} />
              <div className="absolute bottom-1/4 left-1/3 h-8 w-8 rounded-full bg-yellow-300/15 blur-lg" style={{ animation: 'td_drift 5s ease-in-out infinite reverse' }} />
              <div className="absolute top-1/2 left-1/2 h-6 w-6 rounded-full bg-orange-200/10 blur-md" style={{ animation: 'td_drift 3.5s ease-in-out 1s infinite' }} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-amber-200/40" style={{ boxShadow: '0 0 12px rgba(251,191,36,0.4), 0 4px 12px rgba(245,158,11,0.3)' }}>
                <Trophy size={22} className="text-white drop-shadow-sm" />
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 55%, transparent 65%)', backgroundSize: '250% 100%', animation: 'trophyShine 6s ease-in-out infinite' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-amber-600/80 uppercase tracking-wider">Producto más vendido del día</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight mt-0.5">{displayTopProducts[0]?.nombre || 'N/A'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">{displayTopProducts[0]?.cantidad || 0} uds</span>
                  <span className="text-[10px] text-slate-400">vendidas</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
          </Link>
        )}

        {/* Producto con menos ganancia & Producto con más pérdida */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map(i => (
              <div key={`skel_mp${i}`} className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out infinite' }} />
                  <div className="h-2.5 w-20 rounded-full bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.1s infinite' }} />
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200 mb-2" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.2s infinite' }} />
                <div className="h-2.5 w-24 rounded-full bg-slate-200 mb-1.5" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.3s infinite' }} />
                <div className="h-2 w-16 rounded-full bg-slate-200" style={{ animation: 'td_shimmer 1.5s ease-in-out 0.4s infinite' }} />
              </div>
            ))}
          </div>
        ) : displayTopProducts.length > 0 && (() => {
          const withMargin = displayTopProducts.map(p => {
            const sku = String(p.sku || '').trim().toUpperCase()
            const cantidad = p.cantidad || 0
            const ventasBrutas = p.ventas || 0
            const costoNetoReporte = p.costoNeto || 0
            const costoUnitBD = costsBD.get(sku) || 0
            const base = costoUnitBD > 0 ? costoUnitBD : (cantidad > 0 ? Math.round(costoNetoReporte / cantidad) : 0)
            const applyAdj = minus10Flags.has(sku)
            const costoUnit = Math.round(base * (applyAdj ? 0.81 : 1))
            const costoNeto = costoUnit * cantidad
            const margen = ventasBrutas - costoNeto
            const pct = ventasBrutas > 0 ? (margen / ventasBrutas) * 100 : 0
            return { ...p, margen, pct, costoNeto }
          }).filter(p => p.cantidad > 0 && (p.costoNeto > 0 || p.ventas > 0))

          const leastProfit = [...withMargin].filter(p => p.margen >= 0).sort((a, b) => a.pct - b.pct)[0]
          const mostLoss = [...withMargin].filter(p => p.margen < 0).sort((a, b) => a.margen - b.margen)[0]

          return (
            <div className="grid grid-cols-2 gap-3">
              {leastProfit && (
                <Link to="/revision-precios" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-orange-300 transition-all">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-50/40 to-transparent dark:from-orange-900/10" />
                    {[...Array(14)].map((_, i) => (
                      <div key={`lp_${i}`} className="absolute rounded-full" style={{
                        left: `${8 + (i * 14 + 5) % 80}%`,
                        top: `${10 + (i * 21 + 7) % 70}%`,
                        width: `${3 + (i % 3) * 1.5}px`, height: `${3 + (i % 3) * 1.5}px`,
                        background: `radial-gradient(circle, rgba(249,115,22,${0.4 + (i % 3) * 0.1}), rgba(234,88,12,${0.15 + (i % 3) * 0.06}))`,
                        boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(249,115,22,0.25)`,
                        animation: `td_float ${3 + (i % 4) * 0.8}s ease-in-out ${(i * 0.3) % 3.5}s infinite alternate`,
                      }} />
                    ))}
                    <div className="absolute top-1/4 left-1/3 h-6 w-6 rounded-full bg-orange-300/20 blur-md" style={{ animation: 'td_drift 4s ease-in-out infinite' }} />
                    <div className="absolute bottom-1/4 right-1/4 h-5 w-5 rounded-full bg-orange-200/15 blur-md" style={{ animation: 'td_drift 5s ease-in-out infinite reverse' }} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center border border-orange-200/50 group-hover:scale-110 transition-transform">
                        <TrendingDown size={16} className="text-orange-500" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Menos ganancia</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate" title={leastProfit.nombre}>{leastProfit.nombre}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-600">{leastProfit.pct.toFixed(1)}%</span>
                      <span className="text-[9px] text-slate-400">margen</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1">{leastProfit.cantidad} uds · {formatCompact(leastProfit.ventas)} ventas</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 group-hover:text-orange-500 transition-colors">→ Rev. Precios</p>
                  </div>
                </Link>
              )}
              {mostLoss ? (
                <Link to="/revision-costos" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-red-300 transition-all">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-red-50/40 to-transparent dark:from-red-900/10" />
                    {[...Array(14)].map((_, i) => (
                      <div key={`ml_${i}`} className="absolute rounded-full" style={{
                        left: `${8 + (i * 15 + 3) % 80}%`,
                        top: `${10 + (i * 19 + 11) % 70}%`,
                        width: `${3 + (i % 3) * 1.5}px`, height: `${3 + (i % 3) * 1.5}px`,
                        background: `radial-gradient(circle, rgba(248,113,113,${0.45 + (i % 3) * 0.12}), rgba(220,38,38,${0.2 + (i % 3) * 0.08}))`,
                        boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(220,38,38,0.3)`,
                        animation: `td_float ${3 + (i % 4) * 0.8}s ease-in-out ${(i * 0.35) % 3.5}s infinite alternate`,
                      }} />
                    ))}
                    <div className="absolute top-1/4 right-1/3 h-6 w-6 rounded-full bg-red-300/20 blur-md" style={{ animation: 'td_drift 4.5s ease-in-out infinite' }} />
                    <div className="absolute bottom-1/4 left-1/4 h-5 w-5 rounded-full bg-rose-300/15 blur-md" style={{ animation: 'td_drift 5.5s ease-in-out infinite reverse' }} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center border border-red-200/50 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={16} className="text-red-600" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Más pérdida</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate" title={mostLoss.nombre}>{mostLoss.nombre}</p>
                    <p className="text-[10px] text-red-600 font-semibold mt-1">Pérdida: {formatCLP(Math.abs(mostLoss.margen))}</p>
                    <p className="text-[9px] text-slate-400 mt-1 group-hover:text-red-500 transition-colors">→ Rev. Costos</p>
                  </div>
                </Link>
              ) : (() => {
                const dbLossProducts: { sku: string; nombre: string; costo: number; precio: number; perdida: number }[] = []
                costsBD.forEach((costo, sku) => {
                  const precio = pricesBD.get(sku) || 0
                  if (costo > 0 && precio > 0 && costo > precio) {
                    const nombre = productNamesBD.get(sku) || sku
                    dbLossProducts.push({ sku, nombre, costo, precio, perdida: costo - precio })
                  }
                })
                dbLossProducts.sort((a, b) => b.perdida - a.perdida)
                const worstDbLoss = dbLossProducts[0]

                if (worstDbLoss) {
                  return (
                    <Link to="/revision-costos" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-red-300 transition-all">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-red-50/40 to-transparent dark:from-red-900/10" />
                        {[...Array(14)].map((_, i) => (
                          <div key={`db_${i}`} className="absolute rounded-full" style={{
                            left: `${8 + (i * 15 + 3) % 80}%`, top: `${10 + (i * 19 + 11) % 70}%`,
                            width: `${3 + (i % 3) * 1.5}px`, height: `${3 + (i % 3) * 1.5}px`,
                            background: `radial-gradient(circle, rgba(248,113,113,${0.45 + (i % 3) * 0.12}), rgba(220,38,38,${0.2 + (i % 3) * 0.08}))`,
                            boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(220,38,38,0.3)`,
                            animation: `td_float ${3 + (i % 4) * 0.8}s ease-in-out ${(i * 0.35) % 3.5}s infinite alternate`,
                          }} />
                        ))}
                        <div className="absolute top-1/4 right-1/3 h-6 w-6 rounded-full bg-red-300/20 blur-md" style={{ animation: 'td_drift 4.5s ease-in-out infinite' }} />
                        <div className="absolute bottom-1/4 left-1/4 h-5 w-5 rounded-full bg-rose-300/15 blur-md" style={{ animation: 'td_drift 5.5s ease-in-out infinite reverse' }} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center border border-red-200/50 group-hover:scale-110 transition-transform">
                            <AlertTriangle size={16} className="text-red-600" />
                          </div>
                          <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Pérdida en BD</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate" title={worstDbLoss.nombre}>{worstDbLoss.nombre}</p>
                        <p className="text-[10px] text-red-600 font-semibold mt-1">-{formatCLP(worstDbLoss.perdida)}/ud</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Sin pérdidas hoy · {dbLossProducts.length} en BD</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 group-hover:text-red-500 transition-colors">→ Rev. Costos</p>
                      </div>
                    </Link>
                  )
                }

                return (
                  <Link to="/revision-costos" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-50/40 to-transparent dark:from-emerald-900/10" />
                      {[...Array(14)].map((_, i) => (
                        <div key={`np_${i}`} className="absolute rounded-full" style={{
                          left: `${8 + (i * 15 + 3) % 80}%`, top: `${10 + (i * 19 + 11) % 70}%`,
                          width: `${3 + (i % 3) * 1.5}px`, height: `${3 + (i % 3) * 1.5}px`,
                          background: `radial-gradient(circle, rgba(52,211,153,${0.45 + (i % 3) * 0.12}), rgba(16,185,129,${0.2 + (i % 3) * 0.08}))`,
                          boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(16,185,129,0.3)`,
                          animation: `td_float ${3 + (i % 4) * 0.8}s ease-in-out ${(i * 0.35) % 3.5}s infinite alternate`,
                        }} />
                      ))}
                      <div className="absolute top-1/3 left-1/4 h-6 w-6 rounded-full bg-emerald-300/20 blur-md" style={{ animation: 'td_drift 4s ease-in-out infinite' }} />
                      <div className="absolute bottom-1/4 right-1/4 h-5 w-5 rounded-full bg-green-300/15 blur-md" style={{ animation: 'td_drift 5s ease-in-out infinite reverse' }} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center border border-emerald-200/50 group-hover:scale-110 transition-transform">
                          <AlertTriangle size={16} className="text-emerald-600" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Pérdidas</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 leading-tight">Sin pérdidas en BD</p>
                      <p className="text-[10px] text-slate-500 mt-1">Ningún producto con costo {'>'} precio</p>
                      <p className="text-[9px] text-slate-400 mt-1 group-hover:text-emerald-500 transition-colors">→ Rev. Costos</p>
                    </div>
                  </Link>
                )
              })()}
            </div>
          )
        })()}

        {/* Accesos Rápidos - Scroll horizontal, 2 filas */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
            <Zap size={16} className="text-amber-400" /> Accesos Rápidos
          </h2>
          <div className="overflow-x-auto pb-2 -mx-4 px-4" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="grid grid-rows-2 grid-flow-col gap-2 w-max" style={{WebkitOverflowScrolling: 'touch'}}>
              {shortcuts.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border ${colorClasses[item.color]?.border} hover:shadow-md transition-all min-w-[120px]`}
                >
                  <div className={`p-1.5 rounded-lg ${colorClasses[item.color]?.light} ${colorClasses[item.color]?.text}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Equipo - Scroll horizontal */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-indigo-400" /> Equipo
            </h2>
            <Link to="/planilla-unificada" className="text-xs text-blue-600 flex items-center gap-1">Equipo <ChevronRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <div className="flex gap-3 w-max">
                {[0,1,2,3,4,5].map(i => (
                  <div key={`skel_eq${i}`} className="flex flex-col items-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-w-[80px]">
                    <div className="w-12 h-12 rounded-full bg-slate-200 mb-2" style={{ animation: `td_shimmer 1.5s ease-in-out ${i * 0.15}s infinite` }} />
                    <div className="h-2.5 w-14 rounded-full bg-slate-200" style={{ animation: `td_shimmer 1.5s ease-in-out ${0.1 + i * 0.15}s infinite` }} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
          <div className="overflow-x-auto pb-2 -mx-4 px-4" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="flex gap-3 w-max" style={{WebkitOverflowScrolling: 'touch'}}>
              {displayTrabajadores.length > 0 ? (
                displayTrabajadores.map((t) => (
                  <Link
                    key={t.id}
                    to={`/trabajador/${t.sucursal}/${t.id}`}
                    className="flex flex-col items-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all min-w-[80px]"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 mb-2">
                      {t.foto ? (
                        <img src={t.foto} alt={t.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-400">
                          {t.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[70px]">
                      {t.nombre.split(' ')[0]}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 w-full">
                  <Users size={24} className="mx-auto mb-1 opacity-50" />
                  <p className="text-xs">Sin trabajadores</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        {/* Top Productos */}
        {loading ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Star size={16} className="text-amber-400" /> Top Productos
              </h2>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
              {[0,1,2,3,4].map(i => (
                <div key={`skel_tp${i}`} className={`flex items-center gap-3 px-4 py-3 ${i < 4 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                  <div className="w-6 h-6 rounded-full bg-slate-200" style={{ animation: `td_shimmer 1.5s ease-in-out ${i * 0.1}s infinite` }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-40 rounded-full bg-slate-200" style={{ animation: `td_shimmer 1.5s ease-in-out ${0.1 + i * 0.1}s infinite` }} />
                    <div className="h-2 w-20 rounded-full bg-slate-200" style={{ animation: `td_shimmer 1.5s ease-in-out ${0.2 + i * 0.1}s infinite` }} />
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-3.5 w-8 rounded-full bg-slate-200 ml-auto" style={{ animation: `td_shimmer 1.5s ease-in-out ${0.15 + i * 0.1}s infinite` }} />
                    <div className="h-2 w-6 rounded-full bg-slate-200 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : displayTopProducts.length > 1 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Star size={16} className="text-amber-400" /> Top Productos
              </h2>
              <Link to="/top-products" className="text-xs text-blue-600 flex items-center gap-1">Ver más <ChevronRight size={14} /></Link>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
              {displayTopProducts.slice(0, 5).map((p, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i !== displayTopProducts.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{p.nombre}</p>
                    <p className="text-[10px] text-slate-500">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{p.cantidad}</p>
                    <p className="text-[10px] text-slate-500">uds</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ ANALYTICS CHARTS MENSUAL ═══════════════ */}
        {(() => {
          const fmtK = (v: number) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`
          const COLORS_SEDES = ['#10b981','#6366f1','#f59e0b','#ef4444','#8b5cf6','#06b6d4']
          const SUCURSALES = getSucursales()

          // Spinner mientras carga datos mensuales
          if (loadingMonthly) return (
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 shadow-sm flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Cargando datos mensuales…</p>
            </div>
          )

          if (displayMonthlyData.length === 0) return null

          // Resumen mensual: usa monthlyBySede si hay sede seleccionada, sino totales globales
          const mTotals = selectedSedeFilter !== 'todas' && monthlyBySede[selectedSedeFilter]
            ? monthlyBySede[selectedSedeFilter]
            : displayMonthlyData.reduce((a, d) => ({ ventas: a.ventas + d.ventas, gastos: a.gastos + d.gastos, ganancia: a.ganancia + d.ganancia }), { ventas: 0, gastos: 0, ganancia: 0 })
          const margen = mTotals.ventas > 0 ? Math.round((mTotals.ganancia / mTotals.ventas) * 100) : 0
          const margenColor = margen >= 30 ? '#10b981' : margen >= 15 ? '#f59e0b' : '#ef4444'

          // Datos por sede desde monthlyBySede (filtrado si hay sede activa)
          const sedeBarData = SUCURSALES
            .filter(s => selectedSedeFilter === 'todas' || s.slug === selectedSedeFilter)
            .map((s, i) => {
              const acc = monthlyBySede[s.slug] || { ventas: 0, gastos: 0, ganancia: 0 }
              return {
                name: s.name.length > 8 ? s.name.slice(0,7)+'…' : s.name,
                fullName: s.name,
                slug: s.slug,
                Ventas: acc.ventas,
                Gastos: acc.gastos,
                Ganancia: acc.ganancia,
                color: COLORS_SEDES[i % COLORS_SEDES.length],
              }
            }).filter(s => s.Ventas > 0 || s.Ganancia > 0)

          // Pie: participación de ventas mensual por sede
          const pieData = sedeBarData.map((s, i) => ({ name: s.fullName, value: s.Ventas, fill: s.color }))

          // Radar multidimensional mensual
          const maxV = Math.max(...sedeBarData.map(s => s.Ventas), 1)
          const maxG = Math.max(...sedeBarData.map(s => s.Gastos), 1)
          const maxGan = Math.max(...sedeBarData.map(s => s.Ganancia), 1)
          const radarData = [
            { axis: 'Ventas', ...Object.fromEntries(sedeBarData.map(s => [s.fullName, Math.round(s.Ventas/maxV*100)])) },
            { axis: 'Gastos', ...Object.fromEntries(sedeBarData.map(s => [s.fullName, Math.round(s.Gastos/maxG*100)])) },
            { axis: 'Ganancia', ...Object.fromEntries(sedeBarData.map(s => [s.fullName, Math.round(s.Ganancia/maxGan*100)])) },
            { axis: 'Eficiencia', ...Object.fromEntries(sedeBarData.map(s => [s.fullName, s.Ventas > 0 ? Math.round(s.Ganancia/s.Ventas*100) : 0])) },
            { axis: 'Costo%', ...Object.fromEntries(sedeBarData.map(s => [s.fullName, s.Ventas > 0 ? Math.round(s.Gastos/s.Ventas*100) : 0])) },
          ]

          // Datos para tendencia: solo los días con ventas > 0 (oculta domingos/feriados/futuros sin datos)
          const trendData = displayMonthlyData.filter(d => d.ventas > 0)

          // Mejor / peor día de ventas
          const daysWithSales = trendData.filter(d => d.ventas > 0)
          const bestDay = daysWithSales.length ? daysWithSales.reduce((a, b) => b.ventas > a.ventas ? b : a) : null
          const worstDay = daysWithSales.length ? daysWithSales.reduce((a, b) => b.ventas < a.ventas ? b : a) : null

          // Obtener nombre del día de la semana desde fecha (formato dd/MM)
          const getDayName = (fecha: string) => {
            try {
              const [dd, MM] = fecha.split('/').map(Number)
              const date = new Date(new Date().getFullYear(), MM - 1, dd)
              return date.toLocaleDateString('es-CL', { weekday: 'long' })
            } catch { return '' }
          }

          // Comparativa últimos 7 días vs 7 previos
          const last7 = trendData.slice(-7)
          const prev7 = trendData.slice(-14, -7)
          const sum7 = (arr: any[], key: string) => arr.reduce((s, d) => s + (d[key] || 0), 0)
          const calcTrend = (key: string) => {
            const a = sum7(last7, key), b = sum7(prev7, key)
            if (b <= 0) return { pct: 0, up: a > 0 }
            const pct = Math.round(((a - b) / b) * 100)
            return { pct, up: pct >= 0 }
          }
          const trendVentas = calcTrend('ventas')
          const trendGastos = calcTrend('gastos')
          const trendGanancia = calcTrend('ganancia')

          // Proyección fin de mes (basada en promedio diario actual)
          const _today = new Date()
          const diasActuales = trendData.length
          const diasEnMes = new Date(_today.getFullYear(), _today.getMonth() + 1, 0).getDate()
          const avgDiario = diasActuales > 0 ? mTotals.ventas / diasActuales : 0
          const proyeccionVentas = Math.round(avgDiario * diasEnMes)

          // Gastos fijos del mes completo (sueldos + externos) para sede seleccionada o todas
          const fixedTotalsFull = (selectedSedeFilter !== 'todas'
            ? [fixedMonthlyBySede[selectedSedeFilter]].filter(Boolean)
            : Object.values(fixedMonthlyBySede))
            .reduce((acc, f) => ({
              sueldos: acc.sueldos + (f?.sueldos || 0),
              externos: acc.externos + (f?.externos || 0),
              total: acc.total + (f?.total || 0),
            }), { sueldos: 0, externos: 0, total: 0 })

          // Separar gastos variables (operativos del día) vs fijos (prorrateados en mTotals.gastos)
          const proratioCal = diasEnMes > 0 ? diasActuales / diasEnMes : 0
          const gastosFijosYaContados = Math.round(fixedTotalsFull.total * proratioCal)
          const gastosVariablesActuales = Math.max(0, mTotals.gastos - gastosFijosYaContados)

          // Proyección de gastos variables a fin de mes (según ritmo actual)
          const avgGastoVariableDiario = diasActuales > 0 ? gastosVariablesActuales / diasActuales : 0
          const gastosVariablesProyectados = Math.round(avgGastoVariableDiario * diasEnMes)

          // Proyección total de gastos fin de mes = variables proyectados + fijos completos
          const proyeccionGastos = gastosVariablesProyectados + fixedTotalsFull.total

          // Proyección de ganancia fin de mes: ganancia bruta proyectada (ventas − costos) − gastos proyectados
          const gananciaBrutaActual = mTotals.ganancia + mTotals.gastos
          const avgGananciaBrutaDiaria = diasActuales > 0 ? gananciaBrutaActual / diasActuales : 0
          const proyeccionGananciaBruta = Math.round(avgGananciaBrutaDiaria * diasEnMes)
          const proyeccionGananciaFinal = proyeccionGananciaBruta - proyeccionGastos

          // Tooltips
          const TooltipCustom = ({ active, payload, label }: any) => {
            if (!active || !payload?.length) return null
            const total = payload.reduce((s: number, p: any) => s + (Number(p.value) || 0), 0)
            return (
              <div className="relative overflow-hidden rounded-xl border border-white/70 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-2.5 text-xs min-w-[140px]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-slate-50/40" />
                <p className="relative font-black text-slate-800 mb-1.5 pb-1.5 border-b border-slate-100">{label}</p>
                <div className="relative space-y-1">
                  {payload.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0 shadow-sm" style={{ background: p.color || p.fill || p.stroke, boxShadow: `0 0 6px ${p.color || p.fill || p.stroke}80` }} />
                        <span className="text-slate-500 truncate">{p.name}</span>
                      </div>
                      <span className="font-black text-slate-800 tabular-nums">{fmtK(Number(p.value) || 0)}</span>
                    </div>
                  ))}
                </div>
                {payload.length > 1 && total > 0 && (
                  <div className="relative mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Total</span>
                    <span className="font-black text-slate-700 tabular-nums">{fmtK(total)}</span>
                  </div>
                )}
              </div>
            )
          }

          const PieTooltipCustom = ({ active, payload }: any) => {
            if (!active || !payload?.length) return null
            const total = pieData.reduce((s, d) => s + d.value, 0)
            return (
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
                <p className="font-bold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
                <p className="text-slate-700 font-bold">{fmtK(payload[0].value)}</p>
                <p className="text-slate-400">{total > 0 ? Math.round(payload[0].value/total*100) : 0}% del total mensual</p>
              </div>
            )
          }

          // Resumen cards mensuales
          const now = new Date()
          const mesLabel = now.toLocaleString('es-CL', { month: 'long', year: 'numeric' })

          return (
            <div className="space-y-4">

              {/* Header mensual */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 flex-shrink-0">
                    <BarChart2 size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-700 dark:text-white">Análisis Mensual</p>
                    <p className="text-[10px] text-slate-400 capitalize truncate">{mesLabel} · del 1 al {now.getDate()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-1 sm:flex-none overflow-x-auto scrollbar-none -mx-1 px-1">
                    <div className="inline-flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSedeFilter('todas')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                          selectedSedeFilter === 'todas'
                            ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Todas
                      </button>
                      {SUCURSALES.map((suc) => (
                        <button
                          key={suc.slug}
                          onClick={() => setSelectedSedeFilter(suc.slug)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                            selectedSedeFilter === suc.slug
                              ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {suc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => loadMonthlyData()} disabled={loadingMonthly} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 flex-shrink-0" title="Actualizar datos mensuales">
                    <RefreshCw size={12} className={`text-slate-500 ${loadingMonthly ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* KPI cards mensuales */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Ventas', value: mTotals.ventas, icon: <Wallet size={12} />, gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50/40', border: 'border-emerald-200/70', text: 'text-emerald-700', ring: 'ring-emerald-200/40', stroke: '#10b981', key: 'ventas', trend: trendVentas, positive: true },
                  { label: 'Gastos', value: mTotals.gastos, icon: <TrendingDown size={12} />, gradient: 'from-rose-500 to-pink-500', bg: 'from-rose-50 to-pink-50/40', border: 'border-rose-200/70', text: 'text-rose-700', ring: 'ring-rose-200/40', stroke: '#f43f5e', key: 'gastos', trend: trendGastos, positive: false },
                  { label: 'Ganancia', value: mTotals.ganancia, icon: <TrendingUp size={12} />, gradient: 'from-indigo-500 to-violet-500', bg: 'from-indigo-50 to-violet-50/40', border: 'border-indigo-200/70', text: 'text-indigo-700', ring: 'ring-indigo-200/40', stroke: '#6366f1', key: 'ganancia', trend: trendGanancia, positive: true },
                ].map(card => {
                  // Para gastos, "bajó" es bueno, "subió" es malo
                  const isGood = card.positive ? card.trend.up : !card.trend.up
                  const trendColor = isGood ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200'
                  const hasTrend = trendData.length > 1
                  return (
                    <div key={card.label} className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.bg} border ${card.border} p-2 sm:p-2.5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ring-1 ${card.ring}`}>
                      <div className={`pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                      <div className="relative flex items-center justify-between mb-0.5">
                        <p className={`text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider ${card.text}`}>{card.label}</p>
                        <div className={`flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br ${card.gradient} text-white shadow-sm`}>{card.icon}</div>
                      </div>
                      <p className="relative text-[13px] sm:text-sm font-black text-slate-800 dark:text-white tabular-nums">{fmtK(card.value)}</p>
                      <div className="relative flex items-center justify-between mt-1 gap-1">
                        {hasTrend && card.trend.pct !== 0 && (
                          <span className={`inline-flex items-center gap-0.5 text-[8.5px] font-black px-1 py-0.5 rounded border ${trendColor}`}>
                            {card.trend.up ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                            {Math.abs(card.trend.pct)}%
                          </span>
                        )}
                        {trendData.length > 2 && (
                          <div className="flex-1 h-6 -my-0.5 min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                  <linearGradient id={`spark_${card.key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={card.stroke} stopOpacity={0.4} />
                                    <stop offset="100%" stopColor={card.stroke} stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey={card.key} stroke={card.stroke} strokeWidth={1.5} fill={`url(#spark_${card.key})`} dot={false} isAnimationActive={false} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Proyección */}
              {proyeccionVentas > mTotals.ventas && diasActuales < diasEnMes && (
                <div className="relative overflow-hidden rounded-xl border border-sky-200/60 bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-2.5 shadow-sm">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-300/20 blur-2xl" />
                  <div className="relative flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/30 flex-shrink-0">
                      <Sparkles size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-sky-900">Proyección fin de mes</p>
                      <p className="text-[9px] text-slate-500">A ritmo actual ({fmtK(Math.round(avgDiario))}/día · {diasActuales}/{diasEnMes} días)</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-sky-700 tabular-nums">{fmtK(proyeccionVentas)}</p>
                      <p className="text-[9px] text-slate-400">ventas estimadas</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Proyección fin de mes · Gastos */}
              {diasActuales > 0 && diasActuales < diasEnMes && fixedTotalsFull.total > 0 && (
                <div className="relative overflow-hidden rounded-xl border border-rose-200/60 bg-gradient-to-r from-rose-50 via-white to-pink-50 p-2.5 shadow-sm">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-rose-300/20 blur-2xl" />
                  <div className="relative flex items-center gap-2.5 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30 flex-shrink-0">
                      <TrendingDown size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-rose-900">Proyección fin de mes · Gastos</p>
                      <p className="text-[9px] text-slate-500">Variables proyectados + gastos fijos del mes completo</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-rose-700 tabular-nums">{fmtK(proyeccionGastos)}</p>
                      <p className="text-[9px] text-slate-400">gastos estimados</p>
                    </div>
                  </div>
                  <div className="relative grid grid-cols-2 gap-1.5">
                    <div className="rounded-lg border border-rose-200/50 bg-white/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600">Variables actuales</p>
                      <p className="text-[11px] font-black text-rose-800 tabular-nums">{fmtK(gastosVariablesActuales)}</p>
                      <p className="text-[8.5px] text-rose-500 mt-0.5">→ proy. {fmtK(gastosVariablesProyectados)}</p>
                    </div>
                    <div className="rounded-lg border border-amber-300/70 bg-gradient-to-br from-amber-50 to-yellow-50 px-2 py-1.5 ring-1 ring-amber-200/60">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-amber-700">Fijos mes completo</p>
                      <p className="text-[11px] font-black text-amber-800 tabular-nums">{fmtK(fixedTotalsFull.total)}</p>
                      <p className="text-[8.5px] text-amber-600 mt-0.5">Sueldos {fmtK(fixedTotalsFull.sueldos)} · Externos {fmtK(fixedTotalsFull.externos)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Proyección fin de mes · Ganancias */}
              {diasActuales > 0 && diasActuales < diasEnMes && proyeccionGananciaBruta > 0 && (
                <div className={`relative overflow-hidden rounded-xl border ${proyeccionGananciaFinal >= 0 ? 'border-emerald-200/60' : 'border-rose-300/60'} bg-gradient-to-r ${proyeccionGananciaFinal >= 0 ? 'from-emerald-50 via-white to-teal-50' : 'from-rose-50 via-white to-pink-50'} p-2.5 shadow-sm`}>
                  <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full ${proyeccionGananciaFinal >= 0 ? 'bg-emerald-300/20' : 'bg-rose-300/20'} blur-2xl`} />
                  <div className="relative flex items-center gap-2.5 mb-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${proyeccionGananciaFinal >= 0 ? 'from-emerald-500 to-teal-500 shadow-emerald-500/30' : 'from-rose-500 to-pink-500 shadow-rose-500/30'} text-white shadow-md flex-shrink-0`}>
                      <TrendingUp size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-bold ${proyeccionGananciaFinal >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>Proyección fin de mes · Ganancias</p>
                      <p className="text-[9px] text-slate-500">Ganancia bruta proyectada − gastos proyectados</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-black tabular-nums ${proyeccionGananciaFinal >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{fmtK(proyeccionGananciaFinal)}</p>
                      <p className="text-[9px] text-slate-400">ganancia neta estimada</p>
                    </div>
                  </div>
                  <div className="relative grid grid-cols-2 gap-1.5">
                    <div className="rounded-lg border border-indigo-200/60 bg-white/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-indigo-600">Ganancia bruta proyectada</p>
                      <p className="text-[11px] font-black text-indigo-800 tabular-nums">{fmtK(proyeccionGananciaBruta)}</p>
                    </div>
                    <div className="rounded-lg border border-rose-200/60 bg-white/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600">(−) Gastos proyectados</p>
                      <p className="text-[11px] font-black text-rose-800 tabular-nums">{fmtK(proyeccionGastos)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart 1: Tendencia diaria — Área 30 días */}
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/10 blur-3xl" />
                <div className="relative flex items-start sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 flex-shrink-0">
                      <Activity size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-700 dark:text-white truncate">Tendencia Diaria de Ventas</p>
                      <p className="text-[10px] text-slate-400 capitalize truncate">{new Date().toLocaleString('es-CL',{month:'long'})} · {selectedSedeFilter === 'todas' ? 'todas las sedes' : (SUCURSALES.find(s => s.slug === selectedSedeFilter)?.name || selectedSedeFilter)}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-bold border border-emerald-200/60 flex-shrink-0">
                    <TrendingUp size={10} /> Área
                  </span>
                </div>
                {(bestDay || worstDay) && (
                  <div className="relative grid grid-cols-2 gap-2 mb-2">
                    {bestDay && (
                      <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2 py-1.5">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600">Mejor día</p>
                        <p className="text-[11px] font-black text-emerald-800 tabular-nums">{fmtK(bestDay.ventas)} <span className="text-[9px] font-bold text-emerald-600">· {bestDay.fecha} ({getDayName(bestDay.fecha)})</span></p>
                      </div>
                    )}
                    {worstDay && daysWithSales.length > 1 && (
                      <div className="rounded-lg border border-rose-200/60 bg-rose-50/70 px-2 py-1.5">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600">Peor día</p>
                        <p className="text-[11px] font-black text-rose-800 tabular-nums">{fmtK(worstDay.ventas)} <span className="text-[9px] font-bold text-rose-600">· {worstDay.fecha} ({getDayName(worstDay.fecha)})</span></p>
                      </div>
                    )}
                  </div>
                )}
                <div className="relative h-[200px] sm:h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                      <defs>
                        <linearGradient id="mGVentas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="mGGanancia" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="mGGastos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="fecha"
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        minTickGap={20}
                        tickFormatter={(v: string) => String(v).split('/')[0]}
                      />
                      <YAxis tickFormatter={fmtK} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
                      <Tooltip content={<TooltipCustom />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                      <Area type="monotoneX" dataKey="ventas" name="Ventas" stroke="#10b981" strokeWidth={2.5} fill="url(#mGVentas)" dot={{ r: 2.5, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} connectNulls />
                      <Area type="monotoneX" dataKey="ganancia" name="Ganancia" stroke="#6366f1" strokeWidth={2} fill="url(#mGGanancia)" dot={{ r: 2, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} connectNulls />
                      <Area type="monotoneX" dataKey="gastos" name="Gastos" stroke="#f43f5e" strokeWidth={1.5} fill="url(#mGGastos)" dot={false} activeDot={{ r: 3, stroke: '#fff', strokeWidth: 2 }} connectNulls />
                      {bestDay && <ReferenceDot x={bestDay.fecha} y={bestDay.ventas} r={6} fill="#10b981" stroke="#fff" strokeWidth={2.5} ifOverflow="visible" />}
                      {worstDay && daysWithSales.length > 1 && <ReferenceDot x={worstDay.fecha} y={worstDay.ventas} r={5} fill="#f43f5e" stroke="#fff" strokeWidth={2} ifOverflow="visible" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Barras agrupadas — Acumulado mensual por sede */}
              {sedeBarData.length > 0 && (() => {
                const totalV = sedeBarData.reduce((s, d) => s + d.Ventas, 0)
                const totalGa = sedeBarData.reduce((s, d) => s + d.Ganancia, 0)
                const totalGs = sedeBarData.reduce((s, d) => s + d.Gastos, 0)
                const topSede = [...sedeBarData].sort((a, b) => b.Ventas - a.Ventas)[0]
                const topGanancia = [...sedeBarData].sort((a, b) => b.Ganancia - a.Ganancia)[0]
                const mostEfficient = [...sedeBarData].filter(s => s.Ventas > 0).sort((a, b) => (b.Ganancia/b.Ventas) - (a.Ganancia/a.Ventas))[0]
                const avgVenta = sedeBarData.length > 0 ? Math.round(totalV / sedeBarData.length) : 0
                const sedesRanked = [...sedeBarData].sort((a, b) => b.Ventas - a.Ventas)
                return (
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-300/20 to-violet-300/10 blur-3xl" />
                  <div className="relative flex items-start sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30 flex-shrink-0">
                        <BarChart3 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-700 dark:text-white truncate">Acumulado por Sede</p>
                        <p className="text-[10px] text-slate-400 truncate">{sedeBarData.length} sede{sedeBarData.length !== 1 ? 's' : ''} activa{sedeBarData.length !== 1 ? 's' : ''} · prom. {fmtK(avgVenta)}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 font-bold border border-indigo-200/60 flex-shrink-0">
                      <BarChart3 size={10} /> Barras
                    </span>
                  </div>

                  {/* Mini KPIs totales */}
                  <div className="relative grid grid-cols-3 gap-1.5 mb-3">
                    <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600">Σ Ventas</p>
                      <p className="text-[11px] font-black text-emerald-800 tabular-nums">{fmtK(totalV)}</p>
                    </div>
                    <div className="rounded-lg border border-rose-200/60 bg-rose-50/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600">Σ Gastos</p>
                      <p className="text-[11px] font-black text-rose-800 tabular-nums">{fmtK(totalGs)}</p>
                    </div>
                    <div className="rounded-lg border border-indigo-200/60 bg-indigo-50/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-indigo-600">Σ Ganancia</p>
                      <p className="text-[11px] font-black text-indigo-800 tabular-nums">{fmtK(totalGa)}</p>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={220} minHeight={200}>
                    <BarChart data={sedeBarData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barCategoryGap="22%">
                      <defs>
                        <linearGradient id="mBVentas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.55} />
                        </linearGradient>
                        <linearGradient id="mBGastos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.55} />
                        </linearGradient>
                        <linearGradient id="mBGanancia" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.55} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={fmtK} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<TooltipCustom />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                      <Bar dataKey="Ventas" fill="url(#mBVentas)" radius={[6,6,0,0]} />
                      <Bar dataKey="Gastos" fill="url(#mBGastos)" radius={[6,6,0,0]} />
                      <Bar dataKey="Ganancia" fill="url(#mBGanancia)" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Top 3 insights */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {topSede && (
                      <div className="rounded-lg border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50/40 px-2 py-1.5">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">🏆 Top en ventas</p>
                        <p className="text-[11px] font-black text-emerald-800 truncate">{topSede.fullName}</p>
                        <p className="text-[9px] text-emerald-600 tabular-nums">{fmtK(topSede.Ventas)} · {totalV > 0 ? Math.round(topSede.Ventas/totalV*100) : 0}%</p>
                      </div>
                    )}
                    {topGanancia && (
                      <div className="rounded-lg border border-indigo-200/60 bg-gradient-to-br from-indigo-50 to-violet-50/40 px-2 py-1.5">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">💎 Top ganancia</p>
                        <p className="text-[11px] font-black text-indigo-800 truncate">{topGanancia.fullName}</p>
                        <p className="text-[9px] text-indigo-600 tabular-nums">{fmtK(topGanancia.Ganancia)}</p>
                      </div>
                    )}
                    {mostEfficient && (
                      <div className="rounded-lg border border-amber-200/60 bg-gradient-to-br from-amber-50 to-yellow-50/40 px-2 py-1.5">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">⚡ Más eficiente</p>
                        <p className="text-[11px] font-black text-amber-800 truncate">{mostEfficient.fullName}</p>
                        <p className="text-[9px] text-amber-600 tabular-nums">{mostEfficient.Ventas > 0 ? Math.round(mostEfficient.Ganancia/mostEfficient.Ventas*100) : 0}% margen</p>
                      </div>
                    )}
                  </div>

                  {/* Ranking table */}
                  {sedesRanked.length > 1 && (
                    <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Ranking de sedes</p>
                        <p className="text-[9px] text-slate-400">Ventas · Margen · Participación</p>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {sedesRanked.map((s, i) => {
                          const margen = s.Ventas > 0 ? Math.round(s.Ganancia/s.Ventas*100) : 0
                          const part = totalV > 0 ? Math.round(s.Ventas/totalV*100) : 0
                          const mColor = margen >= 30 ? 'text-emerald-600' : margen >= 15 ? 'text-amber-600' : 'text-rose-600'
                          return (
                            <div key={s.slug} className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-700 text-[9px] font-black text-slate-500 flex-shrink-0">{i+1}</span>
                              <span className="w-1.5 h-4 rounded-full flex-shrink-0" style={{ background: s.color }} />
                              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate flex-1">{s.fullName}</p>
                              <p className="text-[10px] font-black tabular-nums text-slate-700 dark:text-slate-200 w-16 text-right">{fmtK(s.Ventas)}</p>
                              <p className={`text-[10px] font-black tabular-nums w-10 text-right ${mColor}`}>{margen}%</p>
                              <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                <div className="h-full rounded-full transition-all" style={{ width: `${part}%`, background: s.color }} />
                              </div>
                              <p className="text-[9px] font-bold text-slate-500 w-8 text-right tabular-nums">{part}%</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                )
              })()}

              {/* Chart 3+4: Pie + Radial gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Pie: participación de ventas mensual */}
                {pieData.length > 0 && (() => {
                  const pieTotal = pieData.reduce((s, d) => s + d.value, 0)
                  const pieSorted = [...pieData].sort((a, b) => b.value - a.value)
                  const leader = pieSorted[0]
                  const last = pieSorted[pieSorted.length - 1]
                  const leaderPct = pieTotal > 0 ? Math.round((leader.value / pieTotal) * 100) : 0
                  const lastPct = pieTotal > 0 ? Math.round((last.value / pieTotal) * 100) : 0
                  const concentration = leaderPct
                  const balanceLabel = concentration >= 60 ? 'Alta concentración' : concentration >= 40 ? 'Concentración media' : 'Distribución balanceada'
                  const balanceColor = concentration >= 60 ? 'text-rose-600 bg-rose-50 border-rose-200' : concentration >= 40 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                  const gap = leaderPct - lastPct
                  return (
                  <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-pink-300/20 to-rose-300/10 blur-3xl" />
                    <div className="relative flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 flex-shrink-0">
                          <PieIcon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-700 dark:text-white">Distribución Ventas</p>
                          <p className="text-[10px] text-slate-400 truncate">{pieData.length} sede{pieData.length !== 1 ? 's' : ''} · {fmtK(pieTotal)} total</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${balanceColor} flex-shrink-0`}>
                        {balanceLabel}
                      </span>
                    </div>

                    <div className="relative py-4">
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <defs>
                            {pieData.map((entry, i) => (
                              <linearGradient key={`pg_${i}`} id={`mPiePP_${i}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={entry.fill} stopOpacity={1} />
                                <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={88}
                            paddingAngle={3} dataKey="value" stroke="#fff" strokeWidth={2}
                            label={({ percent }: any) => percent >= 0.05 ? `${Math.round(percent*100)}%` : ''} labelLine={false}>
                            {pieData.map((_, i) => <Cell key={i} fill={`url(#mPiePP_${i})`} />)}
                          </Pie>
                          <Tooltip content={<PieTooltipCustom />} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Centro del donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400">Total</p>
                        <p className="text-sm font-black text-slate-700 dark:text-white tabular-nums">{fmtK(pieTotal)}</p>
                      </div>
                    </div>

                    {/* Detalle por sede */}
                    <div className="mt-3 space-y-1">
                      {pieSorted.map((s, i) => {
                        const pct = pieTotal > 0 ? (s.value / pieTotal) * 100 : 0
                        return (
                          <div key={s.name} className="flex items-center gap-2">
                            <span className="flex h-4 w-4 items-center justify-center rounded text-[8.5px] font-black text-white flex-shrink-0" style={{ background: s.fill }}>{i+1}</span>
                            <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate flex-1">{s.name}</p>
                            <p className="text-[10px] font-black tabular-nums text-slate-700 dark:text-slate-200 w-14 text-right">{fmtK(s.value)}</p>
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.fill }} />
                            </div>
                            <p className="text-[9px] font-black tabular-nums text-slate-500 w-9 text-right">{Math.round(pct)}%</p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Insights */}
                    {pieSorted.length > 1 && (
                      <div className="mt-3 grid grid-cols-2 gap-1.5">
                        <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2 py-1.5">
                          <p className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600">Líder</p>
                          <p className="text-[10px] font-black text-emerald-800 truncate">{leader.name}</p>
                          <p className="text-[9px] text-emerald-600">{leaderPct}% · {fmtK(leader.value)}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/60 bg-slate-50/70 px-2 py-1.5">
                          <p className="text-[8.5px] font-bold uppercase tracking-wider text-slate-600">Brecha</p>
                          <p className="text-[10px] font-black text-slate-800 tabular-nums">{gap} pts</p>
                          <p className="text-[9px] text-slate-500">líder vs último</p>
                        </div>
                      </div>
                    )}
                  </div>
                  )
                })()}

                {/* Radial gauge: margen mensual */}
                {(() => {
                  const gastosPct = mTotals.ventas > 0 ? Math.round((mTotals.gastos / mTotals.ventas) * 100) : 0
                  const targetMargen = 30
                  const deltaTarget = margen - targetMargen
                  const costPerSale = mTotals.ventas > 0 ? (mTotals.gastos / mTotals.ventas) : 0
                  const gananciaPorPeso = mTotals.ventas > 0 ? (mTotals.ganancia / mTotals.ventas) : 0
                  return (
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl" style={{ background: `${margenColor}22` }} />
                  <div className="relative flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-md flex-shrink-0" style={{ background: `linear-gradient(135deg, ${margenColor}, ${margenColor}dd)`, boxShadow: `0 4px 12px ${margenColor}40` }}>
                        <Target size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-700 dark:text-white">Margen Neto</p>
                        <p className="text-[10px] text-slate-400 truncate">Meta {targetMargen}% · {deltaTarget >= 0 ? '+' : ''}{deltaTarget} pts</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border flex-shrink-0" style={{ background: `${margenColor}15`, color: margenColor, borderColor: `${margenColor}40` }}>
                      {margen >= 30 ? '🟢' : margen >= 15 ? '🟡' : '🔴'} {margen >= 30 ? 'Excelente' : margen >= 15 ? 'Normal' : 'Bajo'}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <ResponsiveContainer width="100%" height={150}>
                      <RadialBarChart cx="50%" cy="75%" innerRadius="58%" outerRadius="88%"
                        startAngle={180} endAngle={0}
                        data={[{ value: 100, fill: '#f1f5f9' }, { value: Math.max(0, Math.min(100, margen)), fill: margenColor }]}>
                        <RadialBar background dataKey="value" cornerRadius={8} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="-mt-10 text-center">
                      <p className="text-4xl font-black tabular-nums" style={{ color: margenColor, textShadow: `0 2px 8px ${margenColor}30` }}>{margen}<span className="text-2xl">%</span></p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Meta: {targetMargen}%</p>
                    </div>
                  </div>

                  {/* Barra comparativa ventas/gastos/ganancia */}
                  <div className="mt-2 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Composición por $100 de venta</p>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div className="h-full transition-all flex items-center justify-center" style={{ width: `${Math.min(100, gastosPct)}%`, background: 'linear-gradient(to right, #f43f5e, #fb7185)' }} title={`Gastos ${gastosPct}%`} />
                      <div className="h-full transition-all flex items-center justify-center" style={{ width: `${Math.max(0, 100 - gastosPct)}%`, background: `linear-gradient(to right, ${margenColor}, ${margenColor}cc)` }} title={`Margen ${margen}%`} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[8.5px] font-bold text-rose-600">Gastos {gastosPct}%</span>
                      <span className="text-[8.5px] font-bold" style={{ color: margenColor }}>Margen {Math.max(0, 100 - gastosPct)}%</span>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600">Ganancia</p>
                      <p className="text-[11px] font-black text-emerald-800 tabular-nums">{fmtK(mTotals.ganancia)}</p>
                      <p className="text-[8.5px] text-emerald-600">${Math.round(gananciaPorPeso * 100)} / $100</p>
                    </div>
                    <div className="rounded-lg border border-rose-200/60 bg-rose-50/70 px-2 py-1.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600">Costo</p>
                      <p className="text-[11px] font-black text-rose-800 tabular-nums">{fmtK(mTotals.gastos)}</p>
                      <p className="text-[8.5px] text-rose-600">${Math.round(costPerSale * 100)} / $100</p>
                    </div>
                  </div>
                </div>
                )
                })()}
              </div>

              {/* Chart 5: Barras diarias — comparación ventas vs ganancia día a día */}
              {(() => {
                const daysCount = trendData.length
                const avgVentas = daysCount > 0 ? Math.round(trendData.reduce((s: number, d: any) => s + (d.ventas || 0), 0) / daysCount) : 0
                const avgGanancia = daysCount > 0 ? Math.round(trendData.reduce((s: number, d: any) => s + (d.ganancia || 0), 0) / daysCount) : 0
                const avgGastos = daysCount > 0 ? Math.round(trendData.reduce((s: number, d: any) => s + (d.gastos || 0), 0) / daysCount) : 0
                const profitableDays = trendData.filter((d: any) => (d.ganancia || 0) > 0).length
                const lossDays = trendData.filter((d: any) => (d.ganancia || 0) < 0).length
                const profitablePct = daysCount > 0 ? Math.round((profitableDays / daysCount) * 100) : 0
                // Últimos 7 días tendencia
                const last7 = trendData.slice(-7)
                const prev7 = trendData.slice(-14, -7)
                const last7Avg = last7.length > 0 ? last7.reduce((s: number, d: any) => s + (d.ventas || 0), 0) / last7.length : 0
                const prev7Avg = prev7.length > 0 ? prev7.reduce((s: number, d: any) => s + (d.ventas || 0), 0) / prev7.length : 0
                const weekDelta = prev7Avg > 0 ? Math.round(((last7Avg - prev7Avg) / prev7Avg) * 100) : 0
                const trendUp = weekDelta >= 0
                return (
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-300/20 to-orange-300/10 blur-3xl" />
                <div className="relative flex items-start sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 flex-shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-700 dark:text-white truncate">Ventas Diarias</p>
                      <p className="text-[10px] text-slate-400 truncate">{daysCount} días · prom. {fmtK(avgVentas)}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border flex-shrink-0 ${trendUp ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {trendUp ? '↗' : '↘'} {trendUp ? '+' : ''}{weekDelta}% sem
                  </span>
                </div>

                {/* Mini KPIs */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2 py-1.5">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Prom./día</p>
                    <p className="text-[10.5px] font-black text-emerald-800 tabular-nums">{fmtK(avgVentas)}</p>
                  </div>
                  <div className="rounded-lg border border-indigo-200/60 bg-indigo-50/70 px-2 py-1.5">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-600">Ganancia</p>
                    <p className="text-[10.5px] font-black text-indigo-800 tabular-nums">{fmtK(avgGanancia)}</p>
                  </div>
                  <div className="rounded-lg border border-rose-200/60 bg-rose-50/70 px-2 py-1.5">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-rose-600">Gasto</p>
                    <p className="text-[10.5px] font-black text-rose-800 tabular-nums">{fmtK(avgGastos)}</p>
                  </div>
                  <div className="rounded-lg border border-amber-200/60 bg-amber-50/70 px-2 py-1.5">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-amber-600">Rentable</p>
                    <p className="text-[10.5px] font-black text-amber-800 tabular-nums">{profitableDays}/{daysCount}</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={220} minHeight={200}>
                  <BarChart data={trendData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }} barCategoryGap="15%">
                    <defs>
                      <linearGradient id="mDVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.45} />
                      </linearGradient>
                      <linearGradient id="mDGanancia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.45} />
                      </linearGradient>
                      <linearGradient id="mDGastos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.35} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                      interval={Math.max(0, Math.floor(trendData.length / 6))} />
                    <YAxis tickFormatter={fmtK} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<TooltipCustom />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                    <ReferenceLine y={avgVentas} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `prom ${fmtK(avgVentas)}`, position: 'insideTopRight', fontSize: 9, fill: '#10b981', fontWeight: 700 }} />
                    <Bar dataKey="ventas" name="Ventas" fill="url(#mDVentas)" radius={[4,4,0,0]} />
                    <Bar dataKey="ganancia" name="Ganancia" fill="url(#mDGanancia)" radius={[4,4,0,0]} />
                    <Bar dataKey="gastos" name="Gastos" fill="url(#mDGastos)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Insights del período */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  <div className="rounded-lg border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50/40 px-2 py-1.5">
                    <p className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600">Días rentables</p>
                    <p className="text-[11px] font-black text-emerald-800 tabular-nums">{profitableDays} <span className="text-[9px] font-bold text-emerald-600">({profitablePct}%)</span></p>
                  </div>
                  <div className="rounded-lg border border-rose-200/60 bg-gradient-to-br from-rose-50 to-pink-50/40 px-2 py-1.5">
                    <p className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600">Días con pérdida</p>
                    <p className="text-[11px] font-black text-rose-800 tabular-nums">{lossDays}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200/60 bg-gradient-to-br from-slate-50 to-slate-100/40 px-2 py-1.5 col-span-2 sm:col-span-1">
                    <p className="text-[8.5px] font-bold uppercase tracking-wider text-slate-600">Tendencia 7d vs prev</p>
                    <p className={`text-[11px] font-black tabular-nums ${trendUp ? 'text-emerald-700' : 'text-rose-700'}`}>{trendUp ? '+' : ''}{weekDelta}%</p>
                  </div>
                </div>
              </div>
                )
              })()}

              {/* Chart 6: Radar multidimensional mensual */}
              {sedeBarData.length >= 2 && (() => {
                // Líder por cada eje
                const axisLeaders = radarData.map(row => {
                  const entries = sedeBarData.map(s => ({ sede: s.fullName, color: s.color, value: Number(row[s.fullName as keyof typeof row] || 0) }))
                  const inverted = row.axis === 'Costo%' || row.axis === 'Gastos'
                  const sorted = [...entries].sort((a, b) => inverted ? a.value - b.value : b.value - a.value)
                  return { axis: row.axis, leader: sorted[0], inverted }
                })
                // Score total por sede: promedio de ejes positivos - promedio de negativos
                const scoreBySede = sedeBarData.map(s => {
                  const ventasN = Number(radarData[0][s.fullName as keyof typeof radarData[0]] || 0)
                  const gastosN = Number(radarData[1][s.fullName as keyof typeof radarData[1]] || 0)
                  const gananciaN = Number(radarData[2][s.fullName as keyof typeof radarData[2]] || 0)
                  const eficN = Number(radarData[3][s.fullName as keyof typeof radarData[3]] || 0)
                  const costoN = Number(radarData[4][s.fullName as keyof typeof radarData[4]] || 0)
                  // score = ventas + ganancia + eficiencia - (gastos + costo%) promediado
                  const score = Math.round((ventasN + gananciaN + eficN - gastosN - costoN) / 3)
                  return { sede: s.fullName, color: s.color, score }
                }).sort((a, b) => b.score - a.score)
                const topOverall = scoreBySede[0]
                return (
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-300/20 to-purple-300/10 blur-3xl" />
                  <div className="relative flex items-start sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/30 flex-shrink-0">
                        <RadarIcon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-700 dark:text-white truncate">Radar Multidimensional</p>
                        <p className="text-[10px] text-slate-400 truncate">5 dimensiones · {sedeBarData.length} sedes</p>
                      </div>
                    </div>
                    {topOverall && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border flex-shrink-0" style={{ background: `${topOverall.color}15`, color: topOverall.color, borderColor: `${topOverall.color}40` }}>
                        🏆 {topOverall.sede}
                      </span>
                    )}
                  </div>

                  <ResponsiveContainer width="100%" height={260} minHeight={240}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: '#64748b' }} />
                      {sedeBarData.map((s) => (
                        <Radar key={s.slug} name={s.fullName} dataKey={s.fullName}
                          stroke={s.color} fill={s.color} fillOpacity={0.15} strokeWidth={2} dot={{ r: 3 }} />
                      ))}
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                      <Tooltip content={({ active, payload, label }: any) => active && payload?.length ? (
                        <div className="bg-white/95 border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
                          <p className="font-bold text-slate-700 mb-1">{label}</p>
                          {payload.map((p: any, i: number) => (
                            <div key={i} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.stroke }} /><span className="text-slate-500">{p.name}:</span><span className="font-bold">{p.value}%</span></div>
                          ))}
                        </div>
                      ) : null} />
                    </RadarChart>
                  </ResponsiveContainer>

                  {/* Leyenda ejes */}
                  <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1.5">
                    <p className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Qué mide cada eje</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-0.5 text-[9px] text-slate-600">
                      <span><b>Ventas:</b> vol. relativo</span>
                      <span><b>Gastos:</b> menor = mejor</span>
                      <span><b>Ganancia:</b> utilidad total</span>
                      <span><b>Eficiencia:</b> margen %</span>
                      <span><b>Costo%:</b> menor = mejor</span>
                    </div>
                  </div>

                  {/* Líder por eje */}
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {axisLeaders.map((a) => (
                      <div key={a.axis} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5">
                        <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: a.leader.color }} />
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 w-16">{a.axis}</p>
                        <p className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate flex-1">{a.leader.sede}</p>
                        <p className="text-[10px] font-black tabular-nums" style={{ color: a.leader.color }}>{a.leader.value}{a.axis === 'Eficiencia' || a.axis === 'Costo%' ? '%' : ''}</p>
                        {a.inverted && <span className="text-[8px] text-slate-400">↓</span>}
                      </div>
                    ))}
                  </div>

                  {/* Ranking global de score */}
                  <div className="mt-2 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/60 to-purple-50/30 px-2.5 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-violet-600 mb-1">Score global (ventas + ganancia + eficiencia − costos)</p>
                    <div className="space-y-1">
                      {scoreBySede.map((s, i) => (
                        <div key={s.sede} className="flex items-center gap-2">
                          <span className="flex h-4 w-4 items-center justify-center rounded text-[8.5px] font-black text-white flex-shrink-0" style={{ background: s.color }}>{i+1}</span>
                          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate flex-1">{s.sede}</p>
                          <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                            <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(2, Math.min(100, s.score))}%`, background: s.color }} />
                          </div>
                          <p className="text-[10px] font-black tabular-nums w-8 text-right" style={{ color: s.color }}>{s.score}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                )
              })()}

              {/* Chart 7: Ranking de rentabilidad mensual */}
              {sedeBarData.length > 0 && (() => {
                const sortedByGan = [...sedeBarData].sort((a, b) => b.Ganancia - a.Ganancia)
                const totalGananciaRk = sedeBarData.reduce((s, d) => s + d.Ganancia, 0)
                const totalVentasRk = sedeBarData.reduce((s, d) => s + d.Ventas, 0)
                const maxGan = Math.max(...sedeBarData.map(x => x.Ganancia), 1)
                const leaderRk = sortedByGan[0]
                const lastRk = sortedByGan[sortedByGan.length - 1]
                const avgMargen = totalVentasRk > 0 ? Math.round((totalGananciaRk / totalVentasRk) * 100) : 0
                const gapRk = leaderRk && lastRk ? leaderRk.Ganancia - lastRk.Ganancia : 0
                const leaderPctRk = totalGananciaRk > 0 ? Math.round((leaderRk.Ganancia / totalGananciaRk) * 100) : 0
                // Mejor margen (eficiencia)
                const bestMargin = [...sedeBarData].filter(s => s.Ventas > 0).sort((a, b) => (b.Ganancia/b.Ventas) - (a.Ganancia/a.Ventas))[0]
                return (
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-300/20 to-amber-300/10 blur-3xl" />
                  <div className="relative flex items-start sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-md shadow-yellow-500/30 flex-shrink-0">
                        <Trophy size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-700 dark:text-white truncate">Ranking de Rentabilidad</p>
                        <p className="text-[10px] text-slate-400 truncate">{sedeBarData.length} sedes · Ganancia 30 días</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 font-bold border border-amber-200/60 flex-shrink-0">
                      margen prom {avgMargen}%
                    </span>
                  </div>

                  {/* KPIs resumen */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2 py-1.5">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Σ Ganancia</p>
                      <p className="text-[11px] font-black text-emerald-800 tabular-nums">{fmtK(totalGananciaRk)}</p>
                    </div>
                    <div className="rounded-lg border border-indigo-200/60 bg-indigo-50/70 px-2 py-1.5">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-600">Líder aporta</p>
                      <p className="text-[11px] font-black text-indigo-800 tabular-nums">{leaderPctRk}%</p>
                    </div>
                    <div className="rounded-lg border border-rose-200/60 bg-rose-50/70 px-2 py-1.5">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-rose-600">Brecha 1º-último</p>
                      <p className="text-[11px] font-black text-rose-800 tabular-nums">{fmtK(gapRk)}</p>
                    </div>
                  </div>

                  <div className="relative space-y-3">
                    {sortedByGan.map((s, i) => {
                      const pct = Math.max(2, Math.round((s.Ganancia / maxGan) * 100))
                      const rankColor = i === 0 ? '#10b981' : i === 1 ? '#6366f1' : i === 2 ? '#f59e0b' : '#94a3b8'
                      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                      const margen = s.Ventas > 0 ? Math.round(s.Ganancia/s.Ventas*100) : 0
                      const partGan = totalGananciaRk > 0 ? Math.round((s.Ganancia/totalGananciaRk)*100) : 0
                      const mColor = margen >= 30 ? 'text-emerald-600' : margen >= 15 ? 'text-amber-600' : 'text-rose-600'
                      return (
                        <div key={s.slug} className="group/row rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent p-2.5 transition-all hover:border-slate-200 hover:shadow-sm">
                          <div className="flex justify-between text-[10px] mb-1.5">
                            <span className="font-bold text-slate-700 dark:text-white flex items-center gap-1.5 min-w-0">
                              {medal ? (
                                <span className="text-sm flex-shrink-0" style={{ filter: `drop-shadow(0 1px 2px ${rankColor}40)` }}>{medal}</span>
                              ) : (
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black flex-shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg, ${rankColor}, ${rankColor}cc)` }}>#{i+1}</span>
                              )}
                              <span className="truncate">{s.fullName}</span>
                            </span>
                            <span className="font-black text-slate-800 dark:text-white tabular-nums flex-shrink-0">{fmtK(s.Ganancia)}</span>
                          </div>
                          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden shadow-inner">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${rankColor}, ${rankColor}bb)`, boxShadow: `0 0 8px ${rankColor}60` }}>
                              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'td_shimmer 2s ease-in-out infinite' }} />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] text-slate-500 mt-1.5">
                            <span className="inline-flex items-center gap-1"><Wallet size={9} /> {fmtK(s.Ventas)} ventas</span>
                            <span className="inline-flex items-center gap-1"><TrendingDown size={9} className="text-rose-500" /> {fmtK(s.Gastos)} gasto</span>
                            <span className={`inline-flex items-center gap-1 font-bold ${mColor}`}><Target size={9} /> {margen}% margen</span>
                            <span className="inline-flex items-center gap-1 ml-auto font-bold text-slate-600">{partGan}% del total</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer insights */}
                  {bestMargin && sedeBarData.length > 1 && (
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      <div className="rounded-lg border border-amber-200/60 bg-gradient-to-br from-amber-50 to-yellow-50/40 px-2 py-1.5">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-amber-600">⚡ Mayor margen %</p>
                        <p className="text-[10px] font-black text-amber-800 truncate">{bestMargin.fullName}</p>
                        <p className="text-[9px] text-amber-600 tabular-nums">{bestMargin.Ventas > 0 ? Math.round(bestMargin.Ganancia/bestMargin.Ventas*100) : 0}% · {fmtK(bestMargin.Ganancia)}</p>
                      </div>
                      <div className="rounded-lg border border-rose-200/60 bg-gradient-to-br from-rose-50 to-pink-50/40 px-2 py-1.5">
                        <p className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600">⚠ Menor ganancia</p>
                        <p className="text-[10px] font-black text-rose-800 truncate">{lastRk.fullName}</p>
                        <p className="text-[9px] text-rose-600 tabular-nums">{fmtK(lastRk.Ganancia)} · {lastRk.Ventas > 0 ? Math.round(lastRk.Ganancia/lastRk.Ventas*100) : 0}% margen</p>
                      </div>
                    </div>
                  )}
                </div>
                )
              })()}

            </div>
          )
        })()}
        {/* ═══════════════ END CHARTS ═══════════════ */}

        {/* Footer */}
        {lastUpdate && (
          <div className="text-center py-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Clock size={10} /> {lastUpdate.toLocaleTimeString('es-CL')}
          </div>
        )}
      </div>

      {/* Burbuja flotante AsistoRA — RIGHT side */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Mini-burbujas de opciones */}
        {showAsisOptions && (
          <div className="flex flex-col items-end gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            {/* ASIS/TORA cloud — rectangular pill like Chat/Llamar, split pink/blue with water particles */}
            <div className="relative">
              {/* Expanded ASIS + TORA individual bubbles to the left */}
              {showAsisToraCloud && (
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 flex items-center gap-3" style={{ animation: 'bubblePop 0.35s ease-out both' }}>
                  {/* ASIS bubble */}
                  <Link to="/chat-ia" onClick={() => { localStorage.setItem('chat_selected_assistant', 'asis'); setShowAsisOptions(false); setShowAsisToraCloud(false) }}
                    className="group relative" style={{ animation: 'bubblePop 0.3s 0.05s ease-out both' }}>
                    <div className="relative" style={{ animation: 'bubbleFloat 4s ease-in-out infinite' }}>
                      <div className="absolute inset-0 rounded-full bg-pink-400/15" style={{ animation: 'bubbleRing 2s 0.5s ease-out infinite' }} />
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-md shadow-pink-400/15 border-2 border-white group-hover:scale-110 group-active:scale-95 transition-transform relative">
                        {!bubbleImagesLoaded.asis && <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-white to-pink-100 animate-pulse" style={{ backgroundSize: '200% 100%' }} />}
                        <img src={asisImage} alt="ASIS" className="w-full h-full object-cover" onLoad={() => setBubbleImagesLoaded(prev => ({ ...prev, asis: true }))} style={{ opacity: bubbleImagesLoaded.asis ? 1 : 0, transition: 'opacity 0.3s' }} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-pink-600 bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm border border-pink-200/50">ASIS</div>
                    </div>
                  </Link>
                  {/* TORA bubble */}
                  <Link to="/chat-ia" onClick={() => { localStorage.setItem('chat_selected_assistant', 'tora'); setShowAsisOptions(false); setShowAsisToraCloud(false) }}
                    className="group relative" style={{ animation: 'bubblePop 0.3s 0.15s ease-out both' }}>
                    <div className="relative" style={{ animation: 'bubbleFloat 4s 1s ease-in-out infinite' }}>
                      <div className="absolute inset-0 rounded-full bg-blue-400/15" style={{ animation: 'bubbleRing 2s ease-out infinite' }} />
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-md shadow-blue-400/15 border-2 border-white group-hover:scale-110 group-active:scale-95 transition-transform relative">
                        {!bubbleImagesLoaded.tora && <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-white to-blue-100 animate-pulse" style={{ backgroundSize: '200% 100%' }} />}
                        <img src={toraImage} alt="TORA" className="w-full h-full object-cover" onLoad={() => setBubbleImagesLoaded(prev => ({ ...prev, tora: true }))} style={{ opacity: bubbleImagesLoaded.tora ? 1 : 0, transition: 'opacity 0.3s' }} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-blue-600 bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm border border-blue-200/50">TORA</div>
                    </div>
                  </Link>
                </div>
              )}
              {/* The cloud button — rectangular pill like Chat/Llamar, split ASIS(pink)/TORA(blue) with day-data-bar water texture */}
              <button
                onClick={() => setShowAsisToraCloud(!showAsisToraCloud)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all overflow-hidden border border-white/80"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)', minWidth: '120px' }}
              >
                {/* Full background — split gradient */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  {/* ASIS half — pink/rose water */}
                  <div className="absolute top-0 bottom-0 left-0 right-1/2 bg-gradient-to-br from-pink-300 via-rose-200 to-pink-400 overflow-hidden">
                    {/* Liquid particles — dense like day data bar */}
                    {[...Array(8)].map((_, i) => (
                      <div key={`aw2_${i}`} className="absolute rounded-full" style={{
                        left: `${5 + (i * 14 + 3) % 85}%`, top: `${8 + (i * 17 + 5) % 80}%`,
                        width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
                        background: `radial-gradient(circle, rgba(255,255,255,${0.6 + (i % 3) * 0.12}), rgba(255,200,220,${0.3 + (i % 2) * 0.1}))`,
                        boxShadow: `0 0 ${2 + (i % 3)}px rgba(255,255,255,0.4)`,
                        animation: `td_float ${2 + (i % 4) * 0.5}s ease-in-out ${(i * 0.2) % 2}s infinite alternate`,
                      }} />
                    ))}
                    {/* Bubble borders */}
                    {[...Array(4)].map((_, i) => (
                      <div key={`ab_${i}`} className="absolute rounded-full border border-white/25" style={{
                        left: `${8 + (i * 22) % 75}%`, bottom: `${5 + (i * 18) % 70}%`,
                        width: `${4 + (i % 3) * 3}px`, height: `${4 + (i % 3) * 3}px`,
                        animation: `td_bubble ${2 + i * 0.4}s ease-in-out ${i * 0.15}s infinite`,
                      }} />
                    ))}
                    {/* Moving highlight blob */}
                    <div className="absolute top-1/3 left-1/4 h-4 w-4 rounded-full bg-white/20 blur-sm" style={{ animation: 'td_drift 3s ease-in-out infinite' }} />
                  </div>
                  {/* TORA half — blue/cyan water */}
                  <div className="absolute top-0 bottom-0 left-1/2 right-0 bg-gradient-to-br from-blue-300 via-cyan-200 to-blue-400 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                      <div key={`tw2_${i}`} className="absolute rounded-full" style={{
                        left: `${5 + (i * 13 + 7) % 85}%`, top: `${8 + (i * 19 + 3) % 80}%`,
                        width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
                        background: `radial-gradient(circle, rgba(255,255,255,${0.6 + (i % 3) * 0.12}), rgba(200,230,255,${0.3 + (i % 2) * 0.1}))`,
                        boxShadow: `0 0 ${2 + (i % 3)}px rgba(255,255,255,0.4)`,
                        animation: `td_float ${2 + (i % 4) * 0.5}s ease-in-out ${(i * 0.25) % 2}s infinite alternate`,
                      }} />
                    ))}
                    {[...Array(4)].map((_, i) => (
                      <div key={`tb_${i}`} className="absolute rounded-full border border-white/25" style={{
                        left: `${8 + (i * 20) % 75}%`, bottom: `${5 + (i * 15) % 70}%`,
                        width: `${4 + (i % 3) * 3}px`, height: `${4 + (i % 3) * 3}px`,
                        animation: `td_bubble ${2 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                    <div className="absolute top-1/3 right-1/4 h-4 w-4 rounded-full bg-white/20 blur-sm" style={{ animation: 'td_drift 3.5s ease-in-out infinite reverse' }} />
                  </div>
                  {/* Center divider */}
                  <div className="absolute top-1 bottom-1 left-1/2 w-px bg-white/50 z-10" />
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" style={{ backgroundSize: '200% 100%', animation: 'td_shimmer 3s linear infinite' }} />
                </div>
                {/* Labels — bigger */}
                <div className="relative z-10 flex items-center justify-center w-full gap-3">
                  <span className="text-[11px] font-black text-white drop-shadow-sm" style={{ textShadow: '0 1px 3px rgba(190,50,100,0.5)' }}>ASIS</span>
                  <span className="text-white/60 text-[10px]">/</span>
                  <span className="text-[11px] font-black text-white drop-shadow-sm" style={{ textShadow: '0 1px 3px rgba(50,100,190,0.5)' }}>TORA</span>
                </div>
              </button>
            </div>
            {/* Opción Chat — opens tutorial chatbot */}
            <button
              onClick={async () => { 
                setShowAsisChat(true); 
                setShowAsisOptions(false);
                setShowAsisToraCloud(false);
                if (db && unreadNotifs > 0) {
                  try {
                    const q = query(collection(db, 'asis_web_notifications'), where('read', '==', false), limit(20))
                    const snap = await getDocs(q)
                    const batch: Promise<void>[] = []
                    snap.docs.forEach(d => batch.push(updateDoc(d.ref, { read: true })))
                    await Promise.all(batch).catch(() => {})
                  } catch { /* ignore */ }
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-lg border border-blue-200 hover:bg-blue-50 hover:scale-105 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageCircle size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Chat</span>
            </button>
            {/* Opción Llamar */}
            <button
              onClick={() => {
                setIsBackgroundCall(true)
                setIsCallMode(true)
                setShowAsisOptions(false)
                setShowAsisToraCloud(false)
                setTimeout(() => startListening(), 300)
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-lg border border-green-200 hover:bg-green-50 hover:scale-105 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Phone size={16} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Llamar</span>
            </button>
          </div>
        )}
        
        {/* Burbuja principal AsistoRA */}
        {!isBackgroundCall ? (
          <div className="relative">
            <button
              onClick={() => { setShowAsisOptions(!showAsisOptions); if (showAsisOptions) setShowAsisToraCloud(false) }}
              className={`h-16 w-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all ${showAsisOptions ? 'rotate-45' : ''}`}
              style={{ background: 'radial-gradient(circle, transparent 60%, rgba(255,255,255,0.8) 100%)' }}
            >
              <div className="h-14 w-14 rounded-full overflow-hidden relative" style={{ boxShadow: '0 0 8px 4px rgba(255,255,255,0.6)' }}>
                <img src={cachedAvatar} alt="AsistoRA" className="h-full w-full object-cover" />
              </div>
              <span className={`absolute -top-0.5 -left-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${showAsisOptions ? 'bg-blue-500' : 'bg-green-500'}`} />
            </button>
            {/* Notification badge */}
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -left-1 min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold border-2 border-white shadow-lg animate-bounce z-10">
                {unreadNotifs > 9 ? '9+' : unreadNotifs}
              </span>
            )}
            {/* Preview tooltip */}
            {notifPreview && !showAsisOptions && (
              <div className="absolute bottom-full right-0 mb-2 max-w-[220px] px-3 py-2 bg-white rounded-xl shadow-lg border border-blue-200 text-xs text-slate-700 animate-in fade-in slide-in-from-bottom-1">
                <p className="font-medium text-blue-600 mb-0.5">ASIS dice:</p>
                <p className="line-clamp-2">{notifPreview}</p>
              </div>
            )}
          </div>
        ) : (
          /* Burbuja en modo llamada segundo plano */
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-green-400/20 animate-pulse" />
                <div className="absolute -inset-4 rounded-full bg-green-400/10 animate-pulse" style={{animationDelay: '0.5s'}} />
              </>
            )}
            {isSpeakingAudio && (
              <>
                <div className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-purple-400/20 animate-pulse" />
              </>
            )}
            {iaLoading && (
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin" />
            )}
            <button
              onClick={() => { 
                if (isSpeakingAudio) {
                  interruptAudio()
                  if (!isMicMuted) setTimeout(() => startListening(), 200)
                } else {
                  setIsBackgroundCall(false); setIsCallMode(false); interruptAudio(); stopListening()
                }
              }}
              className={`relative h-16 w-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all ${
                isListening ? 'bg-gradient-to-br from-green-400 to-green-600 scale-110' :
                isSpeakingAudio ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 
                iaLoading ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                'bg-gradient-to-br from-green-500 to-green-600'
              }`}
              style={{
                boxShadow: isListening ? '0 0 20px rgba(34, 197, 94, 0.6)' :
                           isSpeakingAudio ? '0 0 20px rgba(168, 85, 247, 0.6)' :
                           '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <div className={`h-14 w-14 rounded-full overflow-hidden border-2 ${
                isListening ? 'border-green-300' : isSpeakingAudio ? 'border-purple-300' : 'border-white'
              }`}>
                <img src={ASIS_AVATAR} alt="AsistoRA" className="h-full w-full object-cover" />
              </div>
            </button>
            {/* Indicador de estado */}
            <div className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg ${
              isSpeakingAudio ? 'bg-purple-500 animate-pulse' : isListening ? 'bg-green-500 animate-bounce' : iaLoading ? 'bg-blue-500 animate-spin' : 'bg-green-600'
            }`}>
              {isSpeakingAudio ? '🔊' : isListening ? '🎤' : iaLoading ? '💭' : '📞'}
            </div>
            {/* Botón colgar */}
            <button
              onClick={() => { setIsBackgroundCall(false); setIsCallMode(false); interruptAudio(); stopListening() }}
              className="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:scale-125 hover:bg-red-600 transition-all"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Chat ASIS - Diseño mejorado */}
      {showAsisChat && !isCallMode && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Header mejorado */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={ASIS_AVATAR} alt="ASIS" className="w-11 h-11 rounded-full object-cover border-2 border-blue-300 shadow-md" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  ASIS <span className="text-xs font-normal text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">Tutorial</span>
                </h3>
                <p className="text-[10px] text-slate-500">Guía del Dashboard • En línea</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowAsisChat(false); setIsBackgroundCall(true); setIsCallMode(true); setTimeout(() => startListening(), 300) }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all"
              >
                <Phone size={14} /> Llamar
              </button>
              <button onClick={() => setShowAsisChat(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Mensajes con diseño mejorado */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {iaMessages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <img src={ASIS_AVATAR} alt="ASIS" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md shadow-md' 
                    : 'bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {iaLoading && (
              <div className="flex gap-2 justify-start">
                <img src={ASIS_AVATAR} alt="ASIS" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sugerencias mejoradas - antes del input */}
          <div className="px-4 pb-2">
            <p className="text-[10px] text-slate-400 mb-2 font-medium uppercase tracking-wide">Preguntas sugeridas</p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '📝', text: '¿Cómo hago un corte de caja?' },
                { icon: '🏆', text: '¿Qué es el Top 10?' },
                { icon: '📦', text: '¿Dónde veo el inventario?' },
                { icon: '💰', text: '¿Cómo veo las ganancias?' },
                { icon: '👥', text: '¿Dónde están los trabajadores?' },
                { icon: '📊', text: '¿Cómo genero informes?' },
                { icon: '⚠️', text: '¿Qué son las alertas?' },
                { icon: '📱', text: '¿Cómo uso WhatsApp?' },
              ].map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => sendToIA(q.text)} 
                  className="flex items-center gap-1.5 px-3 py-2 text-xs bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                >
                  <span>{q.icon}</span>
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input mejorado */}
          <div className="p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200/50">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => isListening ? stopListening() : startListening()}
                className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={iaInput}
                  onChange={(e) => setIaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendToIA(iaInput)}
                  placeholder="Escribe tu pregunta..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
                />
              </div>
              <button
                onClick={() => sendToIA(iaInput)}
                disabled={iaLoading || !iaInput.trim()}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modo Llamada - Solo pantalla completa si NO es llamada en segundo plano */}
      {isCallMode && !isBackgroundCall && (
        <div className="fixed inset-0 z-[60] bg-gradient-to-b from-blue-600 via-blue-500 to-blue-700 flex flex-col items-center justify-center">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-white/10">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-white" />
              <span className="text-white font-medium text-sm">En llamada - Tutorial</span>
            </div>
            <button
              onClick={() => { setIsCallMode(false); interruptAudio(); stopListening() }}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Avatar o ventana de info */}
          <div className="flex flex-col items-center">
            {callDisplayContent ? (
              <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm mx-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-100">
                  <img src={ASIS_AVATAR} alt="ASIS" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-bold text-blue-700">Información</span>
                  <button onClick={() => setCallDisplayContent(null)} className="ml-auto p-1 rounded-full hover:bg-blue-100">
                    <X size={14} className="text-blue-400" />
                  </button>
                </div>
                <div className="text-sm text-slate-700 max-h-[40vh] overflow-y-auto whitespace-pre-wrap">
                  {callDisplayContent}
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className={`absolute inset-0 bg-white/30 rounded-full ${isSpeakingAudio ? 'animate-ping' : 'animate-pulse'}`} />
                  <img 
                    src={ASIS_AVATAR} 
                    alt="ASIS" 
                    className={`w-36 h-36 rounded-full object-cover border-4 ${isSpeakingAudio ? 'border-white' : isListening ? 'border-green-400' : 'border-white/50'} shadow-2xl animate-bounce`}
                    style={{animationDuration: '2s'}}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center ${
                    isSpeakingAudio ? 'bg-white' : isListening ? 'bg-green-500' : iaLoading ? 'bg-blue-300' : 'bg-white/50'
                  } border-4 border-blue-600`}>
                    {isSpeakingAudio ? <Volume2 size={14} className="text-blue-600" /> :
                     isListening ? <Mic size={14} className="text-white" /> :
                     iaLoading ? <Loader2 size={14} className="text-white animate-spin" /> :
                     <Phone size={14} className="text-blue-600" />}
                  </div>
                </div>
                <p className="text-white text-sm mt-6 font-medium">
                  {isSpeakingAudio ? 'Hablando...' : isListening ? 'Escuchando...' : iaLoading ? 'Pensando...' : 'En llamada'}
                </p>
                {(isListening || isSpeakingAudio) && (
                  <div className="flex gap-1 mt-4">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-1.5 rounded-full animate-pulse ${isSpeakingAudio ? 'bg-white' : 'bg-green-400'}`}
                        style={{ height: `${15 + Math.random() * 25}px`, animationDelay: `${i * 80}ms` }} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controles */}
          <div className="absolute bottom-8 flex gap-4">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-4 rounded-full ${isMicMuted ? 'bg-red-500' : 'bg-white/20'} hover:scale-110 transition-transform`}
            >
              {isMicMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
            </button>
            {isSpeakingAudio && (
              <button onClick={interruptAudio} className="p-4 rounded-full bg-amber-500 hover:scale-110 transition-transform">
                <VolumeX size={24} className="text-white" />
              </button>
            )}
            <button
              onClick={() => { setIsCallMode(false); interruptAudio(); stopListening() }}
              className="p-4 rounded-full bg-red-500 hover:scale-110 transition-transform"
            >
              <Phone size={24} className="text-white rotate-[135deg]" />
            </button>
          </div>
        </div>
      )}

      {/* Bubble animation keyframes */}
      <style>{`
        @keyframes bubblePop { 0%{transform:scale(0) translateY(20px);opacity:0} 60%{transform:scale(1.1) translateY(-4px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes bubbleRing { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
        @keyframes bubbleFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes welcomeDrift { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-12px) translateX(6px)} }
        @keyframes welcomePulse { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:.9;transform:scale(1.15)} }
        @keyframes textShine { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
      `}</style>

      {/* Onboarding inmersivo (primer ingreso demo) */}
      {onboardingOpen && (
        <div className="fixed inset-0 z-[80] overflow-hidden">
          <div className="absolute inset-0 bg-white/55 backdrop-blur-2xl" />
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-cyan-300/45 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-sky-300/45 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/35 blur-3xl" />

          <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-8">
            <form onSubmit={submitOnboarding} className="w-full max-w-4xl grid gap-8 md:grid-cols-[1.15fr_1fr] items-center">
              <div className="relative text-center md:text-left px-2 sm:px-4">
                <div className="pointer-events-none absolute -inset-6">
                  {[...Array(16)].map((_, i) => (
                    <span
                      key={`welcome_particle_${i}`}
                      className="absolute rounded-full"
                      style={{
                        left: `${5 + (i * 17) % 90}%`,
                        top: `${8 + (i * 13) % 82}%`,
                        width: `${3 + (i % 3) * 1.5}px`,
                        height: `${3 + (i % 3) * 1.5}px`,
                        background: i % 2 ? 'rgba(56,189,248,0.55)' : 'rgba(99,102,241,0.45)',
                        boxShadow: '0 0 14px rgba(125,211,252,0.65)',
                        animation: `welcomeDrift ${3 + (i % 5) * 0.7}s ease-in-out ${(i * 0.22) % 2}s infinite alternate, welcomePulse ${1.6 + (i % 4) * 0.35}s ease-in-out ${(i * 0.18) % 1.5}s infinite`
                      }}
                    />
                  ))}
                </div>
                <div className="mx-auto md:mx-0 relative h-44 w-44 rounded-full border border-white/70 bg-white/40 shadow-[0_0_80px_rgba(125,211,252,0.75)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98), rgba(186,230,253,0.55) 42%, rgba(14,165,233,0.22) 100%)' }} />
                  <img src={ASIS_AVATAR} alt="Asistora" className="relative h-32 w-32 rounded-full object-cover border-2 border-white shadow-xl" />
                </div>

                <p className="mt-7 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/55 border border-white/70 text-[11px] font-black tracking-[0.25em] text-sky-700/90 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                  WELCOME EXPERIENCE
                </p>
                <h2
                  className="mt-3 text-3xl sm:text-5xl font-black leading-[1.05] text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${runtimeBranding.titleColor || '#3b82f6'} 0%, ${runtimeBranding.titleColor ? runtimeBranding.titleColor + 'cc' : '#3b82f6cc'} 30%, ${runtimeBranding.titleColor || '#3b82f6'} 55%, ${runtimeBranding.titleColor ? runtimeBranding.titleColor + '99' : '#3b82f699'} 75%, ${runtimeBranding.titleColor || '#3b82f6'} 100%)`,
                    backgroundSize: '200% 100%',
                    animation: 'textShine 6s linear infinite'
                  }}
                >
                  HOLA, SOY ASISTORA
                </h2>
                <p className="mt-2 text-base sm:text-xl font-semibold text-sky-800 tracking-wide">BIENVENIDO A LA DEMO</p>
                <p className="mt-3 text-sm sm:text-[15px] text-slate-700/95 max-w-md mx-auto md:mx-0 leading-relaxed">Para una experiencia inmersiva y personalizada, completa tus datos y te preparo el dashboard a tu medida.</p>
              </div>

              <div className="px-2 sm:px-4 md:border-l md:border-white/60 md:pl-8">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[11px] font-black tracking-[0.16em] text-slate-700">NOMBRE DE LA EMPRESA</span>
                    <input
                      value={onboardingCompany}
                      onChange={(e) => setOnboardingCompany(e.target.value)}
                      placeholder="Ej: Comercial Andina"
                      className="mt-1.5 w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_10px_30px_rgba(125,211,252,0.25)] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      autoFocus
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-black tracking-[0.16em] text-slate-700">NOMBRE DEL USUARIO</span>
                    <input
                      value={onboardingUser}
                      onChange={(e) => setOnboardingUser(e.target.value)}
                      placeholder="Ej: Carla"
                      className="mt-1.5 w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_10px_30px_rgba(125,211,252,0.25)] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      required
                    />
                  </label>
                </div>

                <button type="submit" className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white font-black py-3 shadow-lg shadow-sky-400/30 hover:from-sky-600 hover:to-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99]">
                  Entrar a la demo
                </button>

                <p className="mt-3 text-[11px] text-slate-600 text-center">Tus datos se guardan en este navegador para no volver a pedirlos.</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
