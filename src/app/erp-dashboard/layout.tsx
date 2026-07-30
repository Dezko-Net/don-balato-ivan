'use client'

import React, { useEffect, useState, useMemo } from 'react'
import NextLink from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { SedeSlug } from '@/types'
// [APPWRITE] Ventas de hoy reales
import { fetchCuadresERP } from '@/lib/cuadresErpService'
import type { CuadreERP } from '@/lib/cuadresErpService'

// ============================================================================
// SHIMS DE MIGRACIÓN (mismos que erp-dashboard/page.tsx): reemplazan
// Firebase / react-router-dom / auth / runtimeConfig del original Asistora.
// ============================================================================
const Link = ({ to, children, ...rest }: any) => <NextLink href={to || '#'} {...rest}>{children}</NextLink>
function useNavigate() {
  const r = useRouter()
  return React.useCallback((path: string, opts?: { replace?: boolean }) => {
    try { opts?.replace ? r.replace(path) : r.push(path) } catch {}
  }, [r])
}
function useLocation() { return { pathname: usePathname() || '/' } }

// Firebase Firestore → mocks no-op
const db: any = null
const collection = (...a: any[]) => ({ __col: a })
const doc = (...a: any[]) => ({ __doc: a })
const getDoc = async (_r?: any) => ({ exists: () => false, data: (): any => ({}) })
const onSnapshot = (_q: any, _cb?: any, _e?: any) => () => {}
const query = (...a: any[]) => ({ __q: a })
const orderBy = (...a: any[]) => ({ __ob: a })
const Timestamp = {
  now: () => ({ toMillis: () => Date.now(), toDate: () => new Date() }),
  fromDate: (d: Date) => ({ toMillis: () => d.getTime(), toDate: () => d }),
}

// useAuth → invitado demo
const useAuth = () => ({ user: null as any, appUser: null as any, isGuest: true, logout: async () => {} })

// runtimeConfig → configuración Yaxsel fija
interface RuntimeBranchConfig { slug: SedeSlug; name: string; region: string; icon: string; color: string; active: boolean; imageUrl: string; managerEmail: string }
const YAXSEL_BRANDING = { companyLogoUrl: '/avatar.png', companyIconUrl: '/avatar.png', defaultUserAvatarUrl: '/avatar.png', titleColor: '#10b981' }
const YAXSEL_OWNER = { displayName: 'Administrador', email: 'dexkonet@gmail.com', photoURL: '/avatar.png' }
const YAXSEL_BRANCHES: RuntimeBranchConfig[] = [
  { slug: 'alameda', name: 'Alameda', region: 'Santiago Centro', icon: '🏙️', color: 'emerald', active: true, imageUrl: '', managerEmail: '' },
]
const getRuntimeConfig = () => ({
  companyName: 'Yaxsel', legalName: 'Yaxsel', companyDescription: 'ERP Yaxsel',
  supremeAdminEmail: YAXSEL_OWNER.email, branding: YAXSEL_BRANDING, ownerProfile: YAXSEL_OWNER,
  firebase: { projectId: 'asistoraerp-demo' }, branches: YAXSEL_BRANCHES, sparkMode: false,
})
const getConfiguredBranches = (includeInactive = false): RuntimeBranchConfig[] =>
  includeInactive ? YAXSEL_BRANCHES : YAXSEL_BRANCHES.filter(b => b.active)
import {
  Home, FileText, ClipboardList, DollarSign, Users, Brain,
  MessageCircle, Boxes, AlertTriangle, TrendingDown, Database,
  Search, Bug, Trash2, Activity, Calculator, BarChart2, ShoppingCart,
  Trophy, Receipt, Landmark, Link2, TrendingUp, X, Menu,
  Building2, Shield, Copy, Split, Star, FlaskConical, UserCircle, History, LayoutDashboard,
  Bell, Plus, ChevronDown, LogOut, Sun, Moon, Settings, Wallet, MapPin,
  Zap, CheckCircle2, Circle, Command as CommandIcon, Store
} from 'lucide-react'

const runtimeAppConfig = getRuntimeConfig()
const runtimeBranding = runtimeAppConfig.branding
const runtimeOwnerProfile = runtimeAppConfig.ownerProfile
const SIDEBAR_EXECUTIVE_AVATAR = runtimeOwnerProfile.photoURL || runtimeBranding.defaultUserAvatarUrl
const COMPANY_LOGO_URL = runtimeBranding.companyLogoUrl || runtimeBranding.companyIconUrl

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
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-50' },
}

export default function ErpDashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, appUser, isGuest, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [avatarLoaded, setAvatarLoaded] = useState(false)

  // ─── Command Palette ──────────────────────────────────────────────
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [paletteIndex, setPaletteIndex] = useState(0)
  const paletteInputRef = React.useRef<HTMLInputElement>(null)

  const userName = appUser?.displayName || user?.displayName || user?.email?.split('@')[0] || (isGuest ? 'Invitado' : 'Usuario')
  const companyName = runtimeAppConfig.companyName || 'ASISTORA'
  const userRole = (appUser as any)?.role || (isGuest ? 'Invitado' : 'Admin')

  // Fecha actual en formato YYYY-MM-DD para link de Ganancias
  const todayDate = new Date().toISOString().split('T')[0]
  const gananciasLink = `/top-products/productos?global=1&date=${todayDate}`

  // ─── Header extras ─────────────────────────────────────────────────
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifOpen, setNotifOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [plusOpen, setPlusOpen] = useState(false)
  const [branchOpen, setBranchOpen] = useState(false)
  const [atajosOpen, setAtajosOpen] = useState(false)
  const [ventasHoy, setVentasHoy] = useState<any[]>([])
  const [totalVentasHoy, setTotalVentasHoy] = useState(0)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('theme') === 'dark' } catch { return false }
  })
  const [activeBranch, setActiveBranch] = useState<string>(() => {
    try { return localStorage.getItem('activeBranch') || 'todas' } catch { return 'todas' }
  })

  const branches = useMemo(() => getConfiguredBranches(), [])
  const activeBranchLabel = activeBranch === 'todas' ? 'Todas las sedes' : (branches.find(b => b.slug === activeBranch)?.name || 'Todas')

  // Reloj en vivo
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Persistir sede activa
  useEffect(() => {
    try { localStorage.setItem('activeBranch', activeBranch) } catch {}
    window.dispatchEvent(new CustomEvent('activeBranchChanged', { detail: activeBranch }))
  }, [activeBranch])

  // Tema claro/oscuro
  useEffect(() => {
    try {
      if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark') }
      else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light') }
    } catch {}
  }, [darkMode])

  // Obtener ventas de hoy desde sedes/reports (misma fuente que Dashboard)
  useEffect(() => {
    // ── [APPWRITE] Ventas de hoy desde cuadres_erp (reemplaza Firebase) ──
    {
      let cancelled = false
      const bruto = (c: CuadreERP) =>
        (Number(c.montos?.efectivoSistema) || 0) + (Number(c.montos?.debitoSistema) || 0) + (Number(c.montos?.transferencias) || 0)
      const run = async () => {
        try {
          const cuadres = await fetchCuadresERP(1)
          const nowCL = new Date(Date.now() - 3 * 60 * 60 * 1000)
          const todayStr = nowCL.toISOString().slice(0, 10)
          const total = cuadres.filter((c: CuadreERP) => c.fecha === todayStr).reduce((s, c) => s + bruto(c), 0)
          if (!cancelled) setTotalVentasHoy(total)
        } catch (e) {
          console.error('[Layout][Appwrite] ventasHoy error:', e)
        }
      }
      run()
      const id = setInterval(run, 60000)
      return () => { cancelled = true; clearInterval(id) }
    }
    // ─── (código original Firebase — ya no se ejecuta) ───

    const fetchTodaySales = async () => {
      try {
        // Primero intentar con HOY
        let today = new Date()
        let yyyy = today.getFullYear()
        let MM = String(today.getMonth() + 1).padStart(2, '0')
        let dd = String(today.getDate()).padStart(2, '0')
        let fechaStr = `${yyyy}-${MM}-${dd}`
        let fechaLabel = 'hoy'

        console.log('🔍 Buscando ventas para fecha:', fechaStr, `(${fechaLabel})`)

        // Obtener configuración de sucursales
        const branches = getConfiguredBranches()
        console.log('🏢 Sucursales configuradas:', branches.map(b => b.slug))
        
        let totalVentas = 0
        let hasData = false

        // Función interna para buscar ventas en una fecha específica
        const fetchForDate = async (fecha: string, label: string) => {
          let totalVentas = 0
          let foundData = false

          await Promise.all(branches.map(async (sucursal) => {
            try {
              console.log(`📊 Buscando en sucursal: ${sucursal.slug} (${label})`)
              
              // Intentar nuevo path: sedes/{sucursal}/reports/{fecha}
              let dayRef = doc(db!, 'sedes', sucursal.slug, 'reports', fecha)
              let daySnap = await getDoc(dayRef)
              console.log(`✅ Nuevo path sedes/${sucursal.slug}/reports/${fecha} existe:`, daySnap.exists())

              // Fallback a path antiguo: reports/{sucursal}/{yyyy}/{MM}/days/{dd}
              if (!daySnap.exists()) {
                const [y, m, d] = fecha.split('-')
                dayRef = doc(db!, 'reports', sucursal.slug, y, m, 'days', d)
                daySnap = await getDoc(dayRef)
                console.log(`🔄 Fallback path reports/${sucursal.slug}/${y}/${m}/days/${d} existe:`, daySnap.exists())
              }

              if (daySnap.exists()) {
                const data: any = daySnap.data()
                console.log(`📄 Documento completo de ${sucursal.slug} (${label}):`, data)
                
                // Revisar estructuras anidadas
                console.log(`💳 Montos de ${sucursal.slug} (${label}):`, data?.montos)
                console.log(`🧮 Calculos de ${sucursal.slug} (${label}):`, data?.calculos)
                
                // Buscar todos los campos posibles que contengan ventas
                const ventasBrutas = Number(data?.ventasBrutas) || 0
                const ventas = Number(data?.ventas) || 0
                const total = Number(data?.total) || 0
                const totalVenta = Number(data?.totalVenta) || 0
                const totalVentasCampo = Number(data?.totalVentas) || 0
                
                // Buscar en montos
                const montosVentas = Number(data?.montos?.ventasBrutas) || 0
                const montosTotal = Number(data?.montos?.total) || 0
                const montosVentasNetas = Number(data?.montos?.ventasNetas) || 0
                
                // Buscar en calculos
                const calculosVentas = Number(data?.calculos?.ventasBrutas) || 0
                const calculosTotal = Number(data?.calculos?.total) || 0
                const calculosTotalBruto = Number(data?.calculos?.totalBruto) || 0
                const calculosTotalNeto = Number(data?.calculos?.totalNeto) || 0
                
                console.log(`💰 Campos de ventas encontrados en ${sucursal.slug} (${label}):`, {
                  directas: { ventasBrutas, ventas, total, totalVenta, totalVentas: totalVentasCampo },
                  montos: { ventasBrutas: montosVentas, total: montosTotal, ventasNetas: montosVentasNetas },
                  calculos: { ventasBrutas: calculosVentas, total: calculosTotal, totalBruto: calculosTotalBruto, totalNeto: calculosTotalNeto }
                })
                
                // Usar el primer campo que tenga valor (priorizando totalBruto que es el campo real)
                const ventasValor = calculosTotalBruto || calculosTotalNeto || montosVentas || montosTotal || 
                                  calculosVentas || calculosTotal || ventasBrutas || ventas || total || totalVenta || totalVentasCampo
                console.log(`✅ Ventas de ${sucursal.slug} (${label}):`, ventasValor)
                totalVentas += ventasValor
                if (ventasValor > 0) foundData = true
              } else {
                console.log(`❌ No hay datos para ${sucursal.slug} (${label})`)
              }
            } catch (error) {
              console.error(`Error al obtener ventas de ${sucursal.slug} (${label}):`, error)
            }
          }))

          return { total: totalVentas, foundData }
        }

        // Primero intentar hoy
        let result = await fetchForDate(fechaStr, 'hoy')
        totalVentas = result.total
        hasData = result.foundData

        // Si no hay datos hoy, intentar ayer (misma lógica que Dashboard)
        if (!hasData) {
          console.log('� No hay datos hoy, intentando ayer...')
          today.setDate(today.getDate() - 1)
          yyyy = today.getFullYear()
          MM = String(today.getMonth() + 1).padStart(2, '0')
          dd = String(today.getDate()).padStart(2, '0')
          fechaStr = `${yyyy}-${MM}-${dd}`
          fechaLabel = 'ayer'

          result = await fetchForDate(fechaStr, 'ayer')
          totalVentas = result.total
          hasData = result.foundData
        }

        console.log(`�📈 Total ventas (${fechaLabel}):`, totalVentas)
        setTotalVentasHoy(totalVentas)
      } catch (error) {
        console.error('Error al obtener ventas de hoy:', error)
      }
    }

    // Ejecutar inmediatamente y luego cada 30 segundos
    fetchTodaySales()
    const interval = setInterval(fetchTodaySales, 30000)

    return () => clearInterval(interval)
  }, [])

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('[data-hdr-dropdown]') && !t.closest('[data-hdr-trigger]')) {
        setNotifOpen(false); setAvatarOpen(false); setPlusOpen(false); setBranchOpen(false); setAtajosOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Notificaciones reales desde Firestore
  type NotifItem = { id: string; icon: React.ReactNode; color: string; title: string; desc: string; time: string; unread: boolean; to?: string }
  const [notifications, setNotifications] = useState<NotifItem[]>([])

  useEffect(() => {
    if (!db) return
    let cancelled = false

    const loadNotifications = async () => {
      try {
        const items: NotifItem[] = []
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' })
        const branches = getConfiguredBranches().filter(b => b.active !== false)

        // 1) Cuadres pendientes de hoy por sede
        const { collection, getDocs, query, where, doc, getDoc } = await import('firebase/firestore')
        await Promise.all(branches.map(async (suc) => {
          try {
            const slugCandidates = suc.slug === 'web-tiendas-3b-chile' ? ['web-tiendas-3b-chile', 'web'] : [suc.slug]
            const cajerosMap: Record<string, any> = {}
            for (const slug of slugCandidates) {
              try {
                const parcialSnap = await getDoc(doc(db!, 'cuadre_parcial', `${slug}_${today}`))
                if (parcialSnap.exists()) {
                  const map = parcialSnap.data()?.cajeros || {}
                  Object.entries(map).forEach(([k, v]) => { cajerosMap[k] = v })
                }
              } catch {}
            }
            // Si no hay ninguna entrada para la sede hoy, notificar
            if (Object.keys(cajerosMap).length === 0) {
              items.push({
                id: `cuadre_${suc.slug}`,
                icon: <AlertTriangle size={14} />,
                color: 'rose',
                title: 'Cuadre pendiente',
                desc: `${suc.name} no ha iniciado el cuadre de hoy`,
                time: 'hoy',
                unread: true,
                to: '/_admin',
              })
            } else {
              // Revisar cajeras pendientes
              const pendientes = Object.entries(cajerosMap).filter(([_, v]: any) => {
                const s = v?.status
                return s !== 'completed' && s !== 'submitted' && s !== 'absent' && s !== 'no_caja' && !v?.completedAt
              })
              if (pendientes.length > 0) {
                items.push({
                  id: `cuadre_pend_${suc.slug}`,
                  icon: <AlertTriangle size={14} />,
                  color: 'amber',
                  title: 'Cajeras pendientes',
                  desc: `${suc.name}: ${pendientes.length} cajera(s) sin cerrar`,
                  time: 'hoy',
                  unread: true,
                  to: '/_admin',
                })
              }
            }
          } catch {}
        }))

        // 2) Stock bajo (productos con stock < 5)
        try {
          const stockSnap = await getDocs(query(collection(db!, 'stock'), where('stock', '<', 5), where('stock', '>', 0)))
          if (!stockSnap.empty) {
            items.push({
              id: 'stock_bajo',
              icon: <Boxes size={14} />,
              color: 'amber',
              title: 'Stock bajo',
              desc: `${stockSnap.size} producto(s) con menos de 5 unidades`,
              time: 'ahora',
              unread: false,
              to: '/base-datos',
            })
          }
        } catch {}

        // 3) Productos con costo >= precio (pérdida)
        try {
          const prodSnap = await getDocs(query(collection(db!, 'products')))
          let perdidas = 0
          prodSnap.forEach((d) => {
            const x: any = d.data()
            const costo = Number(x?.costo_uni) || 0
            const precio = Number(x?.precio_mayorista || x?.precio_venta_2) || 0
            if (costo > 0 && precio > 0 && costo >= precio) perdidas++
          })
          if (perdidas > 0) {
            items.push({
              id: 'precios_perdida',
              icon: <TrendingDown size={14} />,
              color: 'red',
              title: 'Precios en pérdida',
              desc: `${perdidas} producto(s) con costo ≥ precio`,
              time: 'ahora',
              unread: true,
              to: '/correccion-precios',
            })
          }
        } catch {}

        if (!cancelled) setNotifications(items)
      } catch (e) {
        console.warn('[Notif] error:', e)
      }
    }

    loadNotifications()
    const interval = setInterval(loadNotifications, 5 * 60 * 1000) // cada 5 min
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  // Cerrar sidebar/palette/dropdowns al cambiar de página
  useEffect(() => { setSidebarOpen(false); setPaletteOpen(false); setPaletteQuery(''); setNotifOpen(false); setAvatarOpen(false); setPlusOpen(false); setBranchOpen(false); setAtajosOpen(false) }, [location.pathname])

  // Abrir palette al escribir cualquier letra desde cualquier parte
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement).isContentEditable
      if (isInput) return
      if (e.key === 'Escape') { setPaletteOpen(false); setPaletteQuery(''); return }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.length === 1 && /[a-zA-Zà-ÿ0-9 ]/.test(e.key)) {
        setPaletteQuery(prev => prev + e.key)
        setPaletteOpen(true)
        setPaletteIndex(0)
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (paletteOpen) setTimeout(() => paletteInputRef.current?.focus(), 30)
  }, [paletteOpen])

  // Hover zone: abrir sidebar solo cuando el mouse toca la esquina superior izquierda
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xOpen = window.innerWidth * 0.08
      const yMax = window.innerHeight * 0.12
      const closeThreshold = window.innerWidth * 0.25
      if (e.clientX <= xOpen && e.clientY <= yMax && !sidebarOpen) {
        setSidebarOpen(true)
      } else if (e.clientX > closeThreshold && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [sidebarOpen])

  // Bloquear scroll del body cuando sidebar está abierta
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const navLinks = useMemo(() => [
    // ── GENERAL ──
    { section: 'General' },
    { to: '/', label: 'Inicio', icon: <Home size={18} />, color: 'blue', desc: 'Dashboard' },
    { to: '/sucursales', label: 'Sucursales', icon: <Building2 size={18} />, color: 'blue', desc: 'Resumen sedes' },
    { to: '/alertas', label: 'Alertas', icon: <Activity size={18} />, color: 'red', desc: 'Anomalías' },
    { to: '/ventas-tiempo-real', label: 'Tiempo Real', icon: <Activity size={18} />, color: 'red', desc: 'En vivo' },
    // ── CUADRES ──
    { section: 'Cuadres' },
    { to: '/cajeras', label: 'Realizar Corte', icon: <FileText size={18} />, color: 'fuchsia', desc: 'Cierre caja' },
    { to: '/_admin', label: 'Ver Cortes', icon: <ClipboardList size={18} />, color: 'indigo', desc: 'Cuadres enviados' },
    { to: '/admin', label: 'Corregir Corte', icon: <ClipboardList size={18} />, color: 'indigo', desc: 'Editar cuadres' },
    // ── GASTOS ──
    { section: 'Gastos' },
    { to: '/gastos', label: 'Gastos', icon: <DollarSign size={18} />, color: 'rose', desc: 'Por sucursal' },
    { to: '/gastos-externos', label: 'Gastos Externos', icon: <Receipt size={18} />, color: 'rose', desc: 'Fuera cuadre' },
    { to: '/adelantos-personal', label: 'Adelantos Personal', icon: <DollarSign size={18} />, color: 'amber', desc: 'Préstamos' },
    // ── PERSONAL ──
    { section: 'Personal' },
    { to: '/planilla-unificada', label: 'Trabajadores', icon: <Users size={18} />, color: 'indigo', desc: 'Planilla' },
    { to: '/informe-general-trabajadores', label: 'Informe Trabajadores', icon: <Users size={18} />, color: 'indigo', desc: 'General' },
    { to: '/analisis-cajeras', label: 'Análisis Cajeras', icon: <Users size={18} />, color: 'pink', desc: 'Rendimiento' },
    { to: '/roles', label: 'Roles', icon: <Users size={18} />, color: 'purple', desc: 'Gestión usuarios' },
    { to: '/clientes-frecuentes', label: 'Clientes Frecuentes', icon: <UserCircle size={18} />, color: 'blue', desc: 'Fidelización' },
    // ── CATÁLOGOS EMPRENDEDOR ──
    { section: 'Gestión de Catálogos' },
    { to: '/admin-catalogos', label: 'Catálogos', icon: <Store size={18} />, color: 'emerald', desc: 'Panel Master SaaS' },
    // ── INVENTARIO & PRODUCTOS ──
    { section: 'Inventario & Productos' },
    { to: '/inventario', label: 'Inventario', icon: <Boxes size={18} />, color: 'violet', desc: 'Stock' },
    { to: '/productos-estrella', label: 'Productos Estrella', icon: <Star size={18} />, color: 'amber', desc: 'Mejores' },
    { to: '/productos-duplicados', label: 'Productos Duplicados', icon: <Copy size={18} />, color: 'red', desc: 'Duplicados' },
    // ── COSTOS & PRECIOS ──
    { section: 'Costos & Precios' },
    { to: '/revision-costos', label: 'Rev. Costos', icon: <AlertTriangle size={18} />, color: 'rose', desc: 'Bajo costo' },
    { to: '/revision-precios', label: 'Rev. Precios', icon: <DollarSign size={18} />, color: 'amber', desc: 'Precios bajos' },
    { to: '/correccion-precios', label: 'Corrección Precios', icon: <TrendingDown size={18} />, color: 'rose', desc: 'Costo vs venta' },
    { to: '/comparacion-costos', label: 'Comparación Costos', icon: <TrendingDown size={18} />, color: 'amber', desc: 'Comparar' },
    { to: '/comparacion-logica', label: 'Comparación Lógica', icon: <TrendingDown size={18} />, color: 'amber', desc: 'Lógica costos' },
    { to: '/revision-costos-history', label: 'Historial Costos', icon: <History size={18} />, color: 'amber', desc: 'Revisión histórica' },
    // ── VENTAS & PEDIDOS ──
    { section: 'Ventas & Pedidos' },
    { to: '/top-products', label: 'Top 10', icon: <Trophy size={18} />, color: 'amber', desc: 'Más vendidos' },
    { to: '/top-10-cajeras', label: 'Top Cajeras', icon: <Trophy size={18} />, color: 'pink', desc: 'Ranking cajeras' },
    { to: '/top-10-sucursales', label: 'Top Sucursales', icon: <Trophy size={18} />, color: 'violet', desc: 'Ranking sedes' },
    { to: '/top-producto-dia', label: 'Top del Día', icon: <Trophy size={18} />, color: 'amber', desc: 'Hoy' },
    { to: '/control-pedidos', label: 'Pedidos', icon: <ShoppingCart size={18} />, color: 'amber', desc: 'Control' },
    { to: '/pagos-pedidos', label: 'Pagos & Pedidos', icon: <ShoppingCart size={18} />, color: 'blue', desc: 'Plataforma Web' },
    { to: '/separar-ventas', label: 'Separar Ventas', icon: <Split size={18} />, color: 'sky', desc: 'Por método' },
    { to: '/transferencias', label: 'Transferencias', icon: <Landmark size={18} />, color: 'cyan', desc: 'Webhook MP' },
    { to: '/conciliar-transferencias', label: 'Conciliar', icon: <Link2 size={18} />, color: 'violet', desc: 'RetailBase' },
    { to: '/analisis-productos', label: 'Análisis Productos', icon: <Search size={18} />, color: 'sky', desc: 'Por producto' },
    // ── INFORMES ──
    { section: 'Informes' },
    { to: '/informes-generales', label: 'Informes', icon: <FileText size={18} />, color: 'slate', desc: 'Reportes' },
    { to: '/informe-mensual', label: 'Informe Mensual', icon: <BarChart2 size={18} />, color: 'green', desc: 'Mes' },
    { to: '/informe-merma', label: 'Informe Merma', icon: <BarChart2 size={18} />, color: 'rose', desc: 'Pérdidas' },
    { to: '/analisis-historico', label: 'Análisis Histórico', icon: <BarChart2 size={18} />, color: 'purple', desc: 'Histórico' },
    { to: '/ganancias-excel', label: 'Ganancias Excel', icon: <TrendingUp size={18} />, color: 'green', desc: 'Export' },
    { to: '/utilidad', label: 'Utilidad', icon: <Calculator size={18} />, color: 'emerald', desc: 'Cálculos' },
    // ── IA & COMUNICACIONES ──
    { section: 'IA & Comunicaciones' },
    { to: '/chat-ia', label: 'Chat IA', icon: <Brain size={18} />, color: 'blue', desc: 'Asistente ASIS' },
    { to: '/cerebro-ia', label: 'Cerebro IA', icon: <Brain size={18} />, color: 'violet', desc: 'IA avanzada' },
    { to: '/asis-monitor', label: 'ASIS Monitor', icon: <Activity size={18} />, color: 'emerald', desc: 'Estado IA' },
    { to: '/whatsapp-gestion', label: 'WhatsApp', icon: <MessageCircle size={18} />, color: 'green', desc: 'Contactos' },
    { to: '/whatsapp-config', label: 'WhatsApp Config', icon: <MessageCircle size={18} />, color: 'green', desc: 'Configuración' },
    { to: '/telegram-gestion', label: 'Telegram', icon: <MessageCircle size={18} />, color: 'sky', desc: 'Roles' },
    // ── BASE DE DATOS ──
    { section: 'Base de Datos' },
    { to: '/base-datos', label: 'Base de Datos', icon: <Database size={18} />, color: 'sky', desc: 'Firebase' },
    { to: '/control-datos', label: 'Control Datos', icon: <Search size={18} />, color: 'indigo', desc: 'Búsqueda' },
    { to: '/depurador', label: 'Depurador', icon: <Bug size={18} />, color: 'rose', desc: 'Debug SKU' },
    { to: '/eliminador-masivo', label: 'Eliminador Masivo', icon: <Trash2 size={18} />, color: 'rose', desc: 'Borrar products' },
    { to: '/comprobador-datos-2', label: 'Comprobador', icon: <Search size={18} />, color: 'cyan', desc: 'Verificación' },
    // ── ADMINISTRACIÓN ──
    { section: 'Administración' },
    { to: '/admin-supreme', label: 'Admin Supreme', icon: <Shield size={18} />, color: 'purple', desc: 'Panel maestro' },
    { to: '/pos-admin', label: 'Dashboard POS', icon: <LayoutDashboard size={18} />, color: 'fuchsia', desc: 'Admin POS' },
    { to: '/pos', label: 'POS', icon: <ShoppingCart size={18} />, color: 'fuchsia', desc: 'Punto de venta' },
  ], [])

  const sidebarLinks = navLinks

  const paletteResults = useMemo(() => {
    const q = paletteQuery.toLowerCase().trim()
    if (!q) return navLinks.filter(l => 'to' in l) as Array<{to:string;label:string;icon:React.ReactNode;color:string;desc:string}>
    return (navLinks.filter(l => 'to' in l) as Array<{to:string;label:string;icon:React.ReactNode;color:string;desc:string}>)
      .filter(l => l.label.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q))
  }, [paletteQuery, navLinks])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative">
      {/* Sidebar (móvil + desktop) */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <aside className={`custom-safe-area absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Header fijo — Perfil Admin */}
          <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 4px rgba(147,51,234,0.12), 0 0 8px rgba(147,51,234,0.06)' }}>
                <div className="absolute inset-0 rounded-2xl border border-purple-300/30" />
                {!avatarLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200" style={{ backgroundSize: '200% 100%', animation: 'skelShimmer 1.5s linear infinite' }} />
                )}
                <img src={SIDEBAR_EXECUTIVE_AVATAR} className="h-full w-full object-cover" onLoad={() => setAvatarLoaded(true)} style={{ opacity: avatarLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif", letterSpacing: '0.02em' }}>{userName}</span>
                </div>
                <span className="relative inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full text-white overflow-hidden shadow-lg mt-1" style={{background:'linear-gradient(135deg,#06b6d4 0%,#2563eb 60%,#4f46e5 100%)',backgroundSize:'300% 300%',animation:'lavaFlow 3s ease infinite'}}>
                  <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-white/30 top-0.5 left-1 animate-ping" style={{animationDuration:'2s'}} />
                  </span>
                  Panel Admin
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <X size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
          {/* Contenido scrolleable */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {sidebarLinks.map((link, i) => {
              if ('section' in link) {
                return (
                  <div key={`section-${i}`} className="pt-3 pb-1 px-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{link.section}</span>
                  </div>
                )
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${location.pathname === link.to ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                  <div className={`p-2 rounded-lg ${colorClasses[link.color]?.light || 'bg-slate-100'} ${colorClasses[link.color]?.text || 'text-slate-600'} group-hover:scale-110 transition-transform`}>
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{link.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{link.desc}</div>
                  </div>
                </Link>
              )
            })}
          </nav>
          {/* Cerrar sesión */}
          <div className="flex-shrink-0 p-3 border-t border-slate-200 dark:border-slate-700">
            <button onClick={async () => { await logout(); navigate('/dashboard-login', { replace: true }) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition group">
              <div className="p-2 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100"><X size={18} /></div>
              <span className="text-sm font-medium text-red-600">Cerrar sesión</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Command Palette */}
      {paletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={() => { setPaletteOpen(false); setPaletteQuery('') }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                ref={paletteInputRef}
                value={paletteQuery}
                onChange={e => { setPaletteQuery(e.target.value); setPaletteIndex(0) }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setPaletteIndex(i => Math.min(i + 1, paletteResults.length - 1)) }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setPaletteIndex(i => Math.max(i - 1, 0)) }
                  if (e.key === 'Enter' && paletteResults[paletteIndex]) { navigate(paletteResults[paletteIndex].to); setPaletteOpen(false); setPaletteQuery('') }
                  if (e.key === 'Escape') { setPaletteOpen(false); setPaletteQuery('') }
                  if (e.key === 'Backspace' && paletteQuery === '') { setPaletteOpen(false) }
                }}
                placeholder="Buscar en el sistema..."
                className="flex-1 bg-transparent text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                autoComplete="off"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-md border border-slate-200 dark:border-slate-600">ESC</kbd>
            </div>
            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto py-2" style={{scrollbarWidth:'none'}}>
              {paletteResults.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-400 text-sm">Sin resultados para "{paletteQuery}"</div>
              )}
              {paletteResults.map((link, i) => {
                const cc = colorClasses[link.color] || colorClasses.slate
                return (
                  <button
                    key={link.to}
                    onClick={() => { navigate(link.to); setPaletteOpen(false); setPaletteQuery('') }}
                    onMouseEnter={() => setPaletteIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                      i === paletteIndex ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${cc.light} ${cc.text} shrink-0`}>{link.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{link.label}</div>
                      <div className="text-[11px] text-slate-400">{link.desc}</div>
                    </div>
                    {i === paletteIndex && (
                      <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-500 rounded shrink-0">↵</kbd>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes logo_spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes logo_spinRev  { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        @keyframes logo_pulse    { 0%{box-shadow:0 0 0 0 var(--logo-color-a)} 70%{box-shadow:0 0 0 7px var(--logo-color-b)} 100%{box-shadow:0 0 0 0 var(--logo-color-b)} }
        @keyframes logo_float    { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.05) translateY(-1px)} }
        @keyframes logo_conic    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes logo_shimmer  { 0%{transform:translateX(-120%) rotate(20deg);opacity:0} 40%{opacity:0.8} 100%{transform:translateX(120%) rotate(20deg);opacity:0} }
        @keyframes logo_orbit1   { from{transform:rotate(0deg) translateX(34px) rotate(0deg)} to{transform:rotate(360deg) translateX(34px) rotate(-360deg)} }
        @keyframes logo_orbit2   { from{transform:rotate(120deg) translateX(34px) rotate(-120deg)} to{transform:rotate(480deg) translateX(34px) rotate(-480deg)} }
        @keyframes logo_orbit3   { from{transform:rotate(240deg) translateX(34px) rotate(-240deg)} to{transform:rotate(600deg) translateX(34px) rotate(-600deg)} }
        @keyframes logo_blink    { 0%,100%{opacity:0.4;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.3)} }

        @keyframes hdr_drift_h   { 0%{transform:translateX(-20px)} 50%{transform:translateX(calc(100vw + 20px))} 100%{transform:translateX(-20px)} }
        @keyframes hdr_drift_r   { 0%{transform:translateX(calc(100vw + 20px))} 50%{transform:translateX(-20px)} 100%{transform:translateX(calc(100vw + 20px))} }
        @keyframes hdr_floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes hdr_twinkle   { 0%,100%{opacity:0.2;transform:scale(0.7)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes hdr_shooting  { 0%{transform:translateX(-10%) translateY(0) rotate(18deg);opacity:0} 8%{opacity:1} 40%{opacity:1} 55%{transform:translateX(120%) translateY(30px) rotate(18deg);opacity:0} 100%{opacity:0} }
        @keyframes hdr_blob      { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(15px,-5px) scale(1.08)} 66%{transform:translate(-10px,4px) scale(0.95)} }
        @keyframes hdr_lineFlow  { 0%{stroke-dashoffset:200;opacity:0.2} 50%{opacity:0.5} 100%{stroke-dashoffset:0;opacity:0.2} }
        @keyframes hdr_ripple    { 0%{transform:scale(0);opacity:0.7} 100%{transform:scale(4);opacity:0} }
        @keyframes hdr_zigzag    { 0%{transform:translate(0,0)} 25%{transform:translate(40vw,-6px)} 50%{transform:translate(60vw,8px)} 75%{transform:translate(85vw,-4px)} 100%{transform:translate(110vw,0)} }
        @keyframes hdr_nebula    { 0%{transform:rotate(0deg) scale(1);opacity:0.3} 50%{opacity:0.55} 100%{transform:rotate(360deg) scale(1.1);opacity:0.3} }
        @keyframes hdr_aurora    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes hdr_hexPulse  { 0%,100%{opacity:0.08} 50%{opacity:0.22} }
        @keyframes hdr_dna       { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(6px) rotate(180deg)} }
        @keyframes hdr_scanline  { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes hdr_comet     { 0%{transform:translateX(-15%) translateY(0px);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateX(120%) translateY(-8px);opacity:0} }
        @keyframes hdr_orbitX    { from{transform:rotate(0deg) translateX(80px) rotate(0deg)} to{transform:rotate(360deg) translateX(80px) rotate(-360deg)} }
      `}</style>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
        {/* =============== Partículas del header =============== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>

          {/* grid de hexágonos neutro (oculto en móvil) */}
          <svg className="absolute inset-0 w-full h-full hidden sm:block" style={{ animation: 'hdr_hexPulse 4s ease-in-out infinite' }}>
            <defs>
              <pattern id="hdrHex" x="0" y="0" width="28" height="24" patternUnits="userSpaceOnUse">
                <polygon points="14,1 26,7 26,18 14,24 2,18 2,7" fill="none" stroke="#94a3b8" strokeOpacity="0.18" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hdrHex)" />
          </svg>



          {/* estrellas titilando — 20 desktop, 8 mobile — azul, verde, gris (ocultas en móvil) */}
          <div className="hidden sm:block">
            {Array.from({ length: 20 }).map((_, i) => {
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
              if (isMobile && i >= 8) return null
            const ptColors = [
              ['rgba(59,130,246,0.95)','rgba(59,130,246,0.7)'],   // azul
              ['rgba(34,197,94,0.95)','rgba(34,197,94,0.7)'],     // verde
              ['rgba(148,163,184,0.9)','rgba(148,163,184,0.6)'],  // gris
            ]
            const [bg, sh] = ptColors[i % 3]
            return (
              <div key={`tw_${i}`} className="absolute rounded-full" style={{
                left: `${(i * 79 + 5) % 98}%`,
                top: `${10 + (i * 43 + 7) % 75}%`,
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                background: bg,
                animation: `hdr_twinkle ${1.8 + (i % 5) * 0.5}s ease-in-out ${(i * 0.17) % 3}s infinite`,
              }} />
            )
          })}
          </div>

          {/* orbes flotando — 10 desktop, 4 mobile — azul, verde, gris (ocultos en móvil) */}
          <div className="hidden sm:block">
            {Array.from({ length: 10 }).map((_, i) => {
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
              if (isMobile && i >= 4) return null
            const orbColors = [
              'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)',
              'radial-gradient(circle, rgba(34,197,94,0.4), transparent 70%)',
              'radial-gradient(circle, rgba(148,163,184,0.35), transparent 70%)',
            ]
            return (
              <div key={`orb_${i}`} className="absolute rounded-full" style={{
                left: `${(i * 53 + 12) % 95}%`,
                top: `${15 + (i * 31) % 65}%`,
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                background: orbColors[i % 3],
                filter: 'blur(1px)',
                animation: `hdr_floatY ${3 + (i % 4)}s ease-in-out ${(i * 0.3) % 2}s infinite`,
              }} />
            )
          })}
          </div>

          {/* partículas derivando — 6 desktop, 3 mobile — azul, verde, gris */}
          {Array.from({ length: 6 }).map((_, i) => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
            if (isMobile && i >= 3) return null
            const driftColors = [
              ['rgba(59,130,246,0.8)','rgba(59,130,246,0.6)'],
              ['rgba(34,197,94,0.8)','rgba(34,197,94,0.6)'],
              ['rgba(148,163,184,0.7)','rgba(148,163,184,0.5)'],
            ]
            const [bg, sh] = driftColors[i % 3]
            return (
              <div key={`drift_${i}`} className="absolute rounded-full" style={{
                top: `${15 + i * 14}%`,
                width: `${2 + (i % 2)}px`,
                height: `${2 + (i % 2)}px`,
                background: bg,
                opacity: 0.6,
                animation: `${i % 2 === 0 ? 'hdr_drift_h' : 'hdr_drift_r'} ${14 + (i % 4) * 4}s linear ${i * 1.5}s infinite`,
              }} />
            )
          })}

          {/* estrellas fugaces — azul y verde */}
          <div className="absolute top-[15%] left-0 h-px w-24" style={{
            background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.9), transparent)',
            animation: 'hdr_shooting 7s ease-in 2s infinite',
          }} />
          <div className="absolute top-[60%] left-0 h-px w-20" style={{
            background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.8), transparent)',
            animation: 'hdr_shooting 10s ease-in 6s infinite',
          }} />

          {/* ripples — azul, verde, azul (ocultos en móvil) */}
          {[
            { left: '18%', top: '40%', delay: '0s',   color: 'rgba(59,130,246,0.6)' },
            { left: '58%', top: '30%', delay: '1.5s',  color: 'rgba(34,197,94,0.6)' },
            { left: '82%', top: '60%', delay: '3s',    color: 'rgba(59,130,246,0.5)' },
          ].map((r, i) => (
            <div key={`rip_${i}`} className="absolute rounded-full border hidden sm:block" style={{
              left: r.left, top: r.top, width: '8px', height: '8px',
              borderColor: r.color,
              animation: `hdr_ripple 4s ease-out ${r.delay} infinite`,
            }} />
          ))}

          {/* luciérnagas — 4 desktop, 2 mobile — azul y verde */}
          {[0, 1, 2, 3].map(i => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
            if (isMobile && i >= 2) return null
            const zzC = i % 2 === 0
              ? ['rgba(59,130,246,0.9)','rgba(59,130,246,0.6)']
              : ['rgba(34,197,94,0.9)','rgba(34,197,94,0.6)']
            return (
              <div key={`zz_${i}`} className="absolute rounded-full hidden sm:block" style={{
                top: `${20 + i * 18}%`, left: 0,
                width: '3px', height: '3px',
                background: zzC[0],
                animation: `hdr_zigzag ${18 + i * 3}s linear ${i * 4}s infinite`,
              }} />
            )
          })}


          {/* DNA helix — 8 desktop, 4 mobile — azul y verde alternado */}
          {Array.from({ length: 8 }).map((_, i) => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
            if (isMobile && i >= 4) return null
            return (
              <div key={`dna_${i}`} className="absolute rounded-full hidden sm:block" style={{
                left: `${35 + i * 4}%`,
                top: '50%',
                width: '2px', height: '2px',
                background: i % 2 === 0 ? 'rgba(59,130,246,0.8)' : 'rgba(34,197,94,0.8)',
                animation: `hdr_dna ${2.5 + (i % 3) * 0.3}s ease-in-out ${i * 0.15}s infinite`,
              }} />
            )
          })}

        </div>
        <div className="relative px-2 sm:px-5 py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Izquierda: menu + logo + empresa */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0">
              <Menu size={22} className="text-slate-600 dark:text-slate-400" />
            </button>
            <Link to="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity min-w-0">
              <div className="relative flex-shrink-0 group w-[56px] h-[56px] sm:w-[68px] sm:h-[68px]" style={{
                '--logo-color': runtimeBranding.titleColor || '#3b82f6',
                '--logo-color-a': `${runtimeBranding.titleColor || '#3b82f6'}88`,
                '--logo-color-b': `${runtimeBranding.titleColor || '#3b82f6'}00`,
              } as React.CSSProperties}>

                {/* capa 2: anillo SVG giratorio (arco principal) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 68 68" style={{animation:'logo_spin 5s linear infinite'}}>
                  <defs>
                    <linearGradient id="logoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor={runtimeBranding.titleColor || '#3b82f6'} stopOpacity="1" />
                      <stop offset="50%"  stopColor={runtimeBranding.titleColor || '#3b82f6'} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={runtimeBranding.titleColor || '#3b82f6'} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle cx="34" cy="34" r="32" fill="none" stroke="url(#logoRingGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="80 140" />
                </svg>

                {/* capa 3: anillo contrario, punteado */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 68 68" style={{animation:'logo_spinRev 8s linear infinite'}}>
                  <circle cx="34" cy="34" r="30" fill="none" stroke={runtimeBranding.titleColor || '#3b82f6'} strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="2 6" />
                </svg>


                {/* capa 5: imagen con shimmer */}
                <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-white/80 shadow-lg bg-white">
                  <img src={COMPANY_LOGO_URL} alt="Logo empresa" className="h-full w-full object-cover" />
                </div>

                {/* capa 6: 3 partículas orbitando (ocultas en móvil) */}
                <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none">
                  {[
                    { anim: 'logo_orbit1 3.2s linear infinite', blink: 'logo_blink 2.0s ease-in-out infinite' },
                    { anim: 'logo_orbit2 3.2s linear infinite', blink: 'logo_blink 2.0s ease-in-out 0.7s infinite' },
                    { anim: 'logo_orbit3 3.2s linear infinite', blink: 'logo_blink 2.0s ease-in-out 1.4s infinite' },
                  ].map((p, i) => (
                    <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 hidden sm:block" style={{ animation: p.anim }}>
                      <span className="block rounded-full" style={{
                        width: '4px', height: '4px',
                        background: runtimeBranding.titleColor || '#3b82f6',
                        animation: p.blink,
                      }} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-base sm:text-lg font-black whitespace-nowrap truncate" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif", letterSpacing: '0.02em' }}>
                  <span className="bg-clip-text text-transparent" style={{
                    backgroundImage: `linear-gradient(90deg, ${runtimeBranding.titleColor || '#3b82f6'} 0%, ${runtimeBranding.titleColor ? runtimeBranding.titleColor + 'cc' : '#3b82f6cc'} 50%, ${runtimeBranding.titleColor || '#3b82f6'} 100%)`
                  }}>{companyName}</span>
                </h1>
                <p className="block text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 -mt-0.5 truncate">
                  {currentTime.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' })} · {currentTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </Link>

            {/* Selector de sede activa (desktop) */}
            <div className="hidden md:block relative ml-2">
              <button
                data-hdr-trigger
                onClick={() => { setBranchOpen(v => !v); setNotifOpen(false); setAvatarOpen(false); setPlusOpen(false) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition ${activeBranch === 'todas' ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}
              >
                <MapPin size={12} />
                <span className="max-w-[120px] truncate">{activeBranchLabel}</span>
                <ChevronDown size={12} className={`transition-transform ${branchOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Centro: buscador ⌘K (desktop) */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden lg:flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
            title="Buscar"
          >
            <Search size={18} />
          </button>

          {/* Derecha: acciones */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Ventas del día (desktop y mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/60 dark:border-emerald-800">
              <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
                <Wallet size={9} />
              </div>
              <div className="leading-tight">
                <p className="hidden sm:block text-[8.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Ventas hoy</p>
                <p className="text-[10px] sm:text-[11px] font-black text-emerald-800 dark:text-emerald-200 tabular-nums">
                  {totalVentasHoy > 0 ? `$${totalVentasHoy.toLocaleString('es-CL')}` : '$0'}
                </p>
              </div>
            </div>

            {/* CONTADOR IA (IA del informe mensual) — solo desktop */}
            <Link
              to="/ia-consultor"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold transition shadow-sm"
              title="CONTADOR IA — IA del informe mensual"
            >
              <TrendingUp size={14} />
              <span>CONTADOR IA</span>
            </Link>

            {/* Estado Firebase */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" title="Conectado a Firebase">
              <div className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider hidden md:inline">En línea</span>
            </div>

            {/* Shortcuts: Cuadres / Ganancias / POS (desktop) */}
            <Link to="/_admin" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold transition" title="Cuadres">
              <ClipboardList size={14} />
              <span>Cuadres</span>
            </Link>
            <Link to={gananciasLink} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold transition" title="Ganancias">
              <TrendingUp size={14} />
              <span>Ganancias</span>
            </Link>
            <Link to="/pos-admin" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold transition" title="POS">
              <BarChart2 size={14} />
              <span>POS</span>
            </Link>

            {/* Atajos (solo mobile) */}
            <div className="relative sm:hidden">
              <button
                data-hdr-trigger
                onClick={() => { setAtajosOpen(v => !v); setNotifOpen(false); setAvatarOpen(false); setPlusOpen(false); setBranchOpen(false) }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold transition"
                title="Atajos"
              >
                <Zap size={13} />
                <span>Atajos</span>
                <ChevronDown size={11} className={`transition-transform ${atajosOpen ? 'rotate-180' : ''}`} />
              </button>
              {atajosOpen && (
                <div data-hdr-dropdown className="absolute right-0 top-full mt-1 w-48 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 overflow-hidden z-50">
                  <Link to="/_admin" onClick={() => setAtajosOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-b border-slate-100 dark:border-slate-700 transition">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600"><ClipboardList size={15} /></div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Cuadres</span>
                  </Link>
                  <Link to={gananciasLink} onClick={() => setAtajosOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-slate-100 dark:border-slate-700 transition">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600"><TrendingUp size={15} /></div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Ganancias</span>
                  </Link>
                  <Link to="/pos-admin" onClick={() => setAtajosOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600"><BarChart2 size={15} /></div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">POS</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Botón + (nuevo registro) */}
            <div className="relative hidden sm:flex">
              <button
                data-hdr-trigger
                onClick={() => { setPlusOpen(v => !v); setNotifOpen(false); setAvatarOpen(false); setBranchOpen(false) }}
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all"
                title="Nuevo registro"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Buscador mobile */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
              title="Buscar"
            >
              <Search size={18} />
            </button>

            {/* Campana notificaciones */}
            <div className="relative">
              <button
                data-hdr-trigger
                onClick={() => { setNotifOpen(v => !v); setAvatarOpen(false); setPlusOpen(false); setBranchOpen(false) }}
                className="relative flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                title="Notificaciones"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black px-1 shadow-md shadow-rose-500/40 ring-2 ring-white dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Avatar + dropdown */}
            <div className="relative hidden sm:flex">
              <button
                data-hdr-trigger
                onClick={() => { setAvatarOpen(v => !v); setNotifOpen(false); setPlusOpen(false); setBranchOpen(false) }}
                className="flex items-center gap-1 p-0.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="relative rounded-xl overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-md h-9 w-9 sm:h-[54px] sm:w-[54px]">
                  <img src={SIDEBAR_EXECUTIVE_AVATAR} className="h-full w-full object-cover" />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" />
                </div>
                <ChevronDown size={12} className={`text-slate-400 hidden sm:block transition-transform ${avatarOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════ Dropdown: Selector de sede ═══════════ */}
        {branchOpen && (
          <div data-hdr-dropdown className="absolute left-16 sm:left-32 md:left-56 top-full mt-1 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 overflow-hidden z-50">
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <MapPin size={14} className="text-emerald-600" />
              <span className="text-xs font-black text-slate-700 dark:text-white">Sede activa</span>
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              <button
                onClick={() => { setActiveBranch('todas'); setBranchOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition ${activeBranch === 'todas' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <Building2 size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Todas las sedes</p>
                  <p className="text-[10px] text-slate-500">Vista consolidada</p>
                </div>
                {activeBranch === 'todas' && <CheckCircle2 size={14} className="text-emerald-500" />}
              </button>
              {branches.map(b => (
                <button
                  key={b.slug}
                  onClick={() => { setActiveBranch(b.slug); setBranchOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition ${activeBranch === b.slug ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-sm">
                    <MapPin size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{b.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{b.slug}</p>
                  </div>
                  {activeBranch === b.slug && <CheckCircle2 size={14} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ Dropdown: Botón + (nuevo) ═══════════ */}
        {plusOpen && (
          <div data-hdr-dropdown className="absolute right-24 sm:right-32 top-full mt-1 w-60 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 overflow-hidden z-50">
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
              <Zap size={14} className="text-violet-600" />
              <span className="text-xs font-black text-slate-700 dark:text-white">Crear rápido</span>
            </div>
            <div className="py-1">
              {[
                { to: '/gastos', label: 'Nuevo gasto', icon: <DollarSign size={13} />, color: 'rose' },
                { to: '/gastos-externos', label: 'Gasto externo', icon: <Receipt size={13} />, color: 'rose' },
                { to: '/adelantos-personal', label: 'Adelanto personal', icon: <Wallet size={13} />, color: 'amber' },
                { to: '/cajeras', label: 'Realizar corte', icon: <FileText size={13} />, color: 'fuchsia' },
                { to: '/transferencias', label: 'Transferencia', icon: <Landmark size={13} />, color: 'cyan' },
                { to: '/whatsapp-gestion', label: 'Contacto WhatsApp', icon: <MessageCircle size={13} />, color: 'green' },
              ].map((a, i) => {
                const cc = colorClasses[a.color] || colorClasses.slate
                return (
                  <button
                    key={i}
                    onClick={() => { navigate(a.to); setPlusOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${cc.light} ${cc.text}`}>
                      {a.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex-1">{a.label}</span>
                    <Plus size={11} className="text-slate-400" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══════════ Dropdown: Notificaciones ═══════════ */}
        {notifOpen && (
          <div data-hdr-dropdown className="absolute right-12 sm:right-14 top-full mt-1 w-80 max-w-[calc(100vw-16px)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 overflow-hidden z-50">
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-rose-600" />
                <span className="text-xs font-black text-slate-700 dark:text-white">Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black text-white bg-rose-500 rounded-full">{unreadCount} nuevas</span>
                )}
              </div>
              <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700">Marcar leídas</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(n => {
                const cc = colorClasses[n.color] || colorClasses.slate
                const content = (
                  <>
                    {n.unread && <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cc.light} ${cc.text} flex-shrink-0 mt-0.5`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{n.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{n.desc}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </>
                )
                const cls = `relative flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition ${n.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`
                return n.to ? (
                  <Link key={n.id} to={n.to} onClick={() => setNotifOpen(false)} className={cls}>{content}</Link>
                ) : (
                  <div key={n.id} className={cls}>{content}</div>
                )
              })}
              {notifications.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-400 text-xs">Sin notificaciones</div>
              )}
            </div>
            <Link to="/alertas" onClick={() => setNotifOpen(false)} className="flex items-center justify-center gap-1 px-3 py-2 border-t border-slate-100 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              Ver todas <TrendingUp size={11} />
            </Link>
          </div>
        )}

        {/* ═══════════ Dropdown: Avatar ═══════════ */}
        {avatarOpen && (
          <div data-hdr-dropdown className="absolute right-2 sm:right-4 top-full mt-1 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 overflow-hidden z-50">
            <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-md">
                  <img src={SIDEBAR_EXECUTIVE_AVATAR} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 dark:text-white truncate">{userName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email || (isGuest ? 'Invitado' : '')}</p>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Shield size={8} /> {userRole}
                  </span>
                </div>
              </div>
            </div>
            <div className="py-1">
              <button onClick={() => { navigate('/roles'); setAvatarOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <UserCircle size={14} className="text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Mi perfil</span>
              </button>
              <button onClick={() => { navigate('/admin-supreme'); setAvatarOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <Settings size={14} className="text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Configuración</span>
              </button>
              <button onClick={() => setDarkMode(v => !v)} className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-slate-500" />}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex-1">{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
                <div className={`relative w-8 h-4 rounded-full transition ${darkMode ? 'bg-violet-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${darkMode ? 'left-4' : 'left-0.5'}`} />
                </div>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
              <button
                onClick={async () => { await logout(); navigate('/dashboard-login', { replace: true }) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
              >
                <LogOut size={14} className="text-rose-500" />
                <span className="text-xs font-bold text-rose-600">Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Contenido de la página */}
      <main>
        {children}
      </main>
    </div>
  )
}
