'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wallet, CreditCard, ArrowLeftRight, HandCoins, TrendingUp, CircleDollarSign,
  Scale, Image, Trash2, Building2, TreePine, Share2, Download, Lock,
  FileSpreadsheet, Send, RotateCcw, Package,
} from 'lucide-react'
import { SEDES, SedeSlug } from '@/types'
import { fetchCuadresERP, deleteCuadreERP } from '@/lib/cuadresErpService'
import type { CuadreERP } from '@/lib/cuadresErpService'
import { fetchAllAppwriteErpProducts } from '@/lib/appwriteErpService'

// ---------- Inline types ----------
interface GastoItem { monto?: number; observacion?: string; detalle?: string; esDevolucion?: boolean; esAnulada?: boolean; folio?: string }
interface TopProduct { sku: string; nombre: string; cantidadVendida: number; ventasBrutas: number; ventasNetas: number; costoNeto: number }

// ---------- GROUPS mock ----------
type GroupKey = string
const GROUPS: Record<GroupKey, { sedes: SedeSlug[] }> = {}

type CuadreSedeSlug = SedeSlug

type GroupTotals = { bruto: number; gastos: number; neto: number; debitoSistema: number; debitoReal: number; transferencias: number }
const EMPTY_GROUP_TOTALS: GroupTotals = { bruto: 0, gastos: 0, neto: 0, debitoSistema: 0, debitoReal: 0, transferencias: 0 }

// ─────────────────────────────────────────────────────────────
export default function ERPPage() {
  const router = useRouter()

  const SEDE_UI: Record<CuadreSedeSlug, { icon: string; bg: string; border: string; bar: string; text: string; chipBg: string; chipText: string }> = {
    'alameda': { icon: '🌳', bg: 'bg-green-50', border: 'border-green-300', bar: 'bg-green-300', text: 'text-green-900', chipBg: 'bg-green-100', chipText: 'text-green-900' },
    'copiapo': { icon: '🏜️', bg: 'bg-amber-50', border: 'border-amber-300', bar: 'bg-amber-300', text: 'text-amber-900', chipBg: 'bg-amber-100', chipText: 'text-amber-900' },
    'la-florida': { icon: '🌺', bg: 'bg-pink-50', border: 'border-pink-300', bar: 'bg-pink-300', text: 'text-pink-900', chipBg: 'bg-pink-100', chipText: 'text-pink-900' },
  }

  const cuadreCardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [rows, setRows] = useState<CuadreERP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated] = useState(true)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [monthDates, setMonthDates] = useState<Record<string, string[]>>({})
  const [selectedSede, setSelectedSede] = useState<'' | CuadreSedeSlug>('')
  const [multiSedeFilter, setMultiSedeFilter] = useState<CuadreSedeSlug[]>([])
  const [activeGroup, setActiveGroup] = useState<GroupKey | ''>('')

  const normSku = (v: any) => String(v ?? '').trim().toUpperCase()

  const [gastosSheet, setGastosSheet] = useState<{ open: boolean; sede?: string; fecha?: string; gastos?: GastoItem[]; fotos?: { url: string; tipo: 'gasto' | 'corte'; gastoIndex?: number; name?: string; caja?: 1 | 2 }[] }>({ open: false })
  const [globalGastosSheet, setGlobalGastosSheet] = useState<{ open: boolean; fecha?: string; items?: Array<{ sede: SedeSlug; monto: number; observacion?: string; fotos: { url: string; tipo: 'gasto' | 'corte'; gastoIndex?: number; name?: string; caja?: 1 | 2 }[] }> }>({ open: false })
  const [cortesSheet, setCortesSheet] = useState<{ open: boolean; sede?: string; fecha?: string; items?: GastoItem[] }>({ open: false })
  const [topsSheet, setTopsSheet] = useState<{ open: boolean; sede?: string; fecha?: string; items?: TopProduct[] }>({ open: false })
  const [viewer, setViewer] = useState<{ open: boolean; urls: string[]; index: number; title?: string }>({ open: false, urls: [], index: 0 })

  const clearMultiSedeFilter = () => { setMultiSedeFilter([]); setActiveGroup('') }

  // ── Load data (Appwrite) ───────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const cuadres = await fetchCuadresERP(3) // últimos 3 meses

        // Construir lista de fechas disponibles
        const fechasSet = new Set<string>()
        cuadres.forEach(c => fechasSet.add(c.fecha))
        const fechas = Array.from(fechasSet).sort((a, b) => b.localeCompare(a))

        // Construir meses disponibles
        const monthsMap: Record<string, string[]> = {}
        fechas.forEach(d => {
          const m = d.slice(0, 7)
          if (!monthsMap[m]) monthsMap[m] = []
          monthsMap[m].push(d)
        })
        Object.keys(monthsMap).forEach(m => monthsMap[m].sort((a, b) => b.localeCompare(a)))
        const months = Object.keys(monthsMap).sort((a, b) => b.localeCompare(a))

        setRows(cuadres)
        setAvailableDates(fechas)
        setMonthDates(monthsMap)
        setAvailableMonths(months)

        if (fechas.length > 0) {
          // Intentar seleccionar hoy (hora Chile UTC-3)
          const now = new Date(Date.now() - 3 * 60 * 60 * 1000)
          const todayStr = now.toISOString().slice(0, 10)
          const todayExists = fechas.includes(todayStr)
          const targetDate = todayExists ? todayStr : fechas[0]
          setSelectedDate(targetDate)
          const targetMonth = targetDate.slice(0, 7)
          setSelectedMonth(months.includes(targetMonth) ? targetMonth : (months[0] || ''))
        }

        setError(null)
      } catch (e: any) {
        console.error('[ERP] Error cargando cuadres:', e)
        setError(`Error cargando cuadres: ${e?.message || String(e)}`)
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Lock body scroll when sheets open
  useEffect(() => {
    const anyOpen = gastosSheet.open || cortesSheet.open || topsSheet.open || viewer.open
    if (anyOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [gastosSheet.open, cortesSheet.open, topsSheet.open, viewer.open])

  // ── Costs from Appwrite ────────────────────────────────────
  const [costsBD, setCostsBD] = useState<Map<string, number>>(new Map())
  const [minus10Flags] = useState<Set<string>>(new Set()) // sin ajuste_menos10 en Yaxsel

  useEffect(() => {
    async function loadCosts() {
      try {
        const products = await fetchAllAppwriteErpProducts()
        const map = new Map<string, number>()
        for (const p of products) {
          const sku = String(p.sku || '').trim().toUpperCase()
          if (sku && p.costo_uni > 0) map.set(sku, p.costo_uni)
        }
        setCostsBD(map)
      } catch (err) {
        console.warn('[ERP] No se pudieron cargar costos de productos:', err)
      }
    }
    loadCosts()
  }, [])

  // ── Helpers ───────────────────────────────────────────────
  const money = (n?: number) => typeof n === 'number' ? `$${n.toLocaleString('es-CL')}` : '-'

  const SEDE_STYLES: Record<string, { bg: string; text: string; Icon: any }> = {
    'copiapo': { bg: 'bg-amber-100', text: 'text-amber-800', Icon: Building2 },
    'la-florida': { bg: 'bg-pink-100', text: 'text-pink-800', Icon: Building2 },
    'alameda': { bg: 'bg-green-100', text: 'text-green-800', Icon: TreePine },
  }

  const calcBruto = (x: any) => {
    const fromMontos = (Number(x?.montos?.efectivoSistema) || 0) + (Number(x?.montos?.debitoSistema) || 0) + (Number(x?.montos?.transferencias) || 0)
    if (fromMontos > 0) return fromMontos
    const items: any[] = Array.isArray(x?.topProducts) ? x.topProducts : []
    return items.reduce((s, p) => s + (Number(p?.ventasBrutas) || 0), 0)
  }

  const sumAnuladas = (x: any) => (Array.isArray(x?.anuladas) ? x.anuladas : []).reduce((s: number, a: any) => s + (Number(a?.monto) || 0), 0)
  const sumDevoluciones = (x: any) => (Array.isArray(x?.devoluciones) ? x.devoluciones : []).reduce((s: number, d: any) => s + (Number(d?.monto) || 0), 0)
  const calcNeto = (x: any) => calcBruto(x) - (Number(x?.calculos?.gastosTotales) || 0) - sumAnuladas(x) - sumDevoluciones(x)

  const formatSedeLabel = (s: any) => {
    const slug = String(s || '').trim()
    const label = (SEDES as any)[slug] || String(s || '')
    return String(label).replace(/^DON BALATO\s*/i, '').trim()
  }

  const calcDifEfectivo = (x: { montos?: { efectivoSistema?: number; efectivoReal?: number } }) => {
    const sistema = Number(x?.montos?.efectivoSistema) || 0
    const real = Number(x?.montos?.efectivoReal) || 0
    return sistema - real
  }

  const getCajaDiffInfo = (r: any) => {
    const hasMontos = r?.montos && typeof r.montos === 'object' && Object.keys(r.montos).length > 0
    const hasCalculos = r?.calculos && typeof r.calculos === 'object' && Object.keys(r.calculos).length > 0
    if (!hasMontos && !hasCalculos) return { label: 'Sin cuadre', className: 'text-amber-700', detail: 'No se ha realizado el corte del día' }
    const efectivoSistema = Number(r?.montos?.efectivoSistema) || 0
    const efectivoReal = Number(r?.montos?.efectivoReal) || 0
    const gastos = Number(r?.calculos?.gastosTotales) || 0
    const anuladasT = sumAnuladas(r)
    const devolucionesT = sumDevoluciones(r)
    const justificado = gastos + anuladasT + devolucionesT
    const esperado = efectivoReal + justificado
    const diff = efectivoSistema - esperado
    if (diff === 0) return { label: 'Cuadra', className: 'text-green-700', detail: '' }
    const esSobrante = diff < 0
    return {
      label: esSobrante ? 'Sobrante' : 'No cuadra',
      className: esSobrante ? 'text-emerald-700' : 'text-red-700',
      detail: `${esSobrante ? 'Sobrante no justificado' : 'Faltante no justificado'}: ${money(Math.abs(diff))}`,
    }
  }

  const calcCostosProductos = (x: any) => {
    const items: TopProduct[] = Array.isArray(x?.topProducts) ? (x.topProducts as TopProduct[]) : []
    return items.reduce((sum, p) => {
      const sku = String(p?.sku || '').trim().toUpperCase()
      const cantidad = Number(p?.cantidadVendida) || 0
      const costoNetoReporte = Number(p?.costoNeto) || 0
      const costoUnitBD = Number(costsBD.get(sku) || 0)
      const base = costoUnitBD > 0 ? costoUnitBD : (cantidad > 0 ? costoNetoReporte / cantidad : 0)
      const isMinus10 = minus10Flags.has(sku)
      const costoUnit = Math.round(base * (isMinus10 ? 0.81 : 1))
      return sum + costoUnit * cantidad
    }, 0)
  }

  // ── Sheet handlers ─────────────────────────────────────────
  const openViewer = (urls: string[], index = 0, title?: string) => setViewer({ open: true, urls, index, title })
  const closeViewer = () => setViewer({ open: false, urls: [], index: 0 })

  const openGastosSheet = (row: any) => {
    setGastosSheet({ open: true, sede: row?.sede, fecha: row?.fecha, gastos: Array.isArray(row?.gastos) ? row.gastos : [], fotos: Array.isArray(row?.fotos) ? row.fotos : [] })
  }
  const closeGastosSheet = () => setGastosSheet({ open: false })

  const openGlobalGastosSheet = () => {
    try {
      const rowsList: any[] = Array.isArray(sortedRowsForWeb) ? sortedRowsForWeb : []
      const items: Array<{ sede: SedeSlug; monto: number; observacion?: string; fotos: any[] }> = []
      rowsList.forEach((r) => {
        const sede = (r?.sede || 'alameda') as SedeSlug
        const gastos: GastoItem[] = Array.isArray(r?.gastos) ? r.gastos : []
        const fotos: any[] = Array.isArray(r?.fotos) ? r.fotos : []
        gastos.forEach((g, idx) => {
          const fotosDeGasto = fotos.filter((f: any) => f?.tipo === 'gasto' && f?.gastoIndex === idx)
          items.push({ sede, monto: Number(g?.monto) || 0, observacion: g?.observacion, fotos: fotosDeGasto })
        })
      })
      items.sort((a, b) => b.monto - a.monto)
      setGlobalGastosSheet({ open: true, fecha: selectedDate || undefined, items })
    } catch { }
  }
  const closeGlobalGastosSheet = () => setGlobalGastosSheet({ open: false })

  const openCortesSheet = (row: any) => {
    const gastos: GastoItem[] = Array.isArray(row?.gastos) ? row.gastos : []
    const fromGastos = gastos.filter((g: any) => g?.esDevolucion || g?.esAnulada)
    const anuladas: GastoItem[] = (Array.isArray(row?.anuladas) ? row.anuladas : []).map((a: any) => ({ ...a, esAnulada: true }))
    const devoluciones: GastoItem[] = (Array.isArray(row?.devoluciones) ? row.devoluciones : []).map((d: any) => ({ ...d, esDevolucion: true }))
    setCortesSheet({ open: true, sede: row?.sede, fecha: row?.fecha, items: [...fromGastos, ...anuladas, ...devoluciones] })
  }
  const closeCortesSheet = () => setCortesSheet({ open: false })

  const openTopsSheet = (row: any) => {
    const items: TopProduct[] = Array.isArray(row?.topProducts) ? row.topProducts : []
    if (!items.length) { alert('No hay Top 10 para esta sede en esta fecha.'); return }
    setTopsSheet({ open: true, sede: row?.sede, fecha: row?.fecha, items })
  }
  const closeTopsSheet = () => setTopsSheet({ open: false })

  const handleDeleteCuadreOfDay = async (row: any) => {
    if (!row || row?._pending) { alert('No hay un cuadre creado para eliminar.'); return }
    const ok = window.confirm(
      `¿Eliminar el cuadre de ${formatSedeLabel(row?.sede)} del día ${row?.fecha}?\n\nEsto borrará el cuadre de la base de datos.`
    )
    if (!ok) return

    if (row.$id) {
      const deleted = await deleteCuadreERP(row.$id)
      if (!deleted) { alert('Error al eliminar el cuadre. Intenta nuevamente.'); return }
    }
    setRows(prev => prev.filter(r => r.$id !== row.$id))
    alert('Cuadre eliminado.')
  }

  const handleExportExcel = async () => {
    alert('Exportar Excel: próximamente disponible. Instala exceljs y file-saver para activarlo.')
  }

  const handleGenerateImage = async () => {
    alert('Generar imagen: próximamente disponible. Instala html-to-image para activarlo.')
  }

  const handleShareExcel = async () => {
    alert('Compartir: próximamente disponible.')
  }

  const handleSendWhatsAppPreview = async (_row: any, _stage: 'parte1' | 'parte2') => {
    alert('WhatsApp Preview: próximamente disponible.')
  }

  const handleDownloadSedeCardOnlyImage = async (_row: any) => {
    alert('Descarga de imagen: próximamente disponible. Instala html-to-image para activarlo.')
  }

  const handleDownloadSedeCardReportImage = async (_row: any) => {
    alert('Reporte imagen: próximamente disponible. Instala html-to-image para activarlo.')
  }

  const handleDownloadSedeGastosOnlyImage = async (_row: any) => {
    alert('Imagen gastos: próximamente disponible. Instala html-to-image para activarlo.')
  }

  // ── Derived state ─────────────────────────────────────────
  const sedeKeys = Object.keys(SEDES) as CuadreSedeSlug[]
  const rowsForSelected = rows.filter(r => {
    if (!selectedDate) return true
    const f = typeof r?.fecha === 'string' ? r.fecha.slice(0, 10) : String(r?.fecha || '').slice(0, 10)
    return f === selectedDate
  })
  const bySede = new Map<string, any>(rowsForSelected.map(r => [String(r.sede), r]))
  const defaultRow = (sede: CuadreSedeSlug) => ({
    id: `${selectedDate || 'sin-fecha'}-${sede}`,
    sede, fecha: selectedDate || '-',
    montos: { efectivoSistema: 0, efectivoReal: 0, debitoSistema: 0, debitoReal: 0, transferencias: 0 },
    calculos: { gastosTotales: 0, totalNeto: 0, totalBruto: 0, diferenciaTotal: 0, diferenciaEfectivo: 0, diferenciaDebito: 0 },
    _pending: true,
  })
  const hasAdvancedSedeFilter = multiSedeFilter.length > 0
  const sedePool = hasAdvancedSedeFilter ? (multiSedeFilter as CuadreSedeSlug[]) : (selectedSede ? [selectedSede as CuadreSedeSlug] : sedeKeys)
  const displayRows = sedePool.map((s) => {
    const existing = bySede.get(s)
    return existing ? { ...existing, _pending: false } : defaultRow(s)
  })
  const sortedRowsForWeb = [...displayRows].sort((a, b) => calcBruto(b) - calcBruto(a))

  const groupTotals = useMemo<Record<GroupKey, GroupTotals>>(() => {
    const totals = {} as Record<GroupKey, GroupTotals>
    ;(Object.entries(GROUPS) as [GroupKey, (typeof GROUPS)[GroupKey]][]).forEach(([key, meta]) => {
      const rows = displayRows.filter((r) => meta.sedes.includes(r.sede as any))
      totals[key] = rows.reduce((acc, row) => {
        const bruto = calcBruto(row)
        const gastos = Number(row?.calculos?.gastosTotales) || 0
        const neto = bruto - gastos
        return { bruto: acc.bruto + bruto, gastos: acc.gastos + gastos, neto: acc.neto + neto, debitoSistema: acc.debitoSistema + (Number(row?.montos?.debitoSistema) || 0), debitoReal: acc.debitoReal + (Number(row?.montos?.debitoReal) || 0), transferencias: acc.transferencias + (Number(row?.montos?.transferencias) || 0) }
      }, { ...EMPTY_GROUP_TOTALS })
    })
    return totals
  }, [displayRows])

  // Totales globales
  const totalsDetailed = displayRows.reduce((acc, r) => {
    acc.montos.efectivoSistema += Number(r?.montos?.efectivoSistema) || 0
    acc.montos.efectivoReal += Number(r?.montos?.efectivoReal) || 0
    acc.montos.debitoSistema += Number(r?.montos?.debitoSistema) || 0
    acc.montos.debitoReal += Number(r?.montos?.debitoReal) || 0
    acc.montos.transferencias += Number(r?.montos?.transferencias) || 0
    acc.calculos.gastosTotales += Number(r?.calculos?.gastosTotales) || 0
    acc.calculos.totalBruto += Number(r?.calculos?.totalBruto) || 0
    acc.calculos.totalNeto += Number(r?.calculos?.totalNeto) || 0
    acc.calculos.diferenciaTotal += Number(r?.calculos?.diferenciaTotal) || 0
    acc.calculos.diferenciaEfectivo += Number(r?.calculos?.diferenciaEfectivo) || 0
    acc.calculos.diferenciaDebito += Number(r?.calculos?.diferenciaDebito) || 0
    return acc
  }, {
    montos: { efectivoSistema: 0, efectivoReal: 0, debitoSistema: 0, debitoReal: 0, transferencias: 0 },
    calculos: { gastosTotales: 0, totalNeto: 0, totalBruto: 0, diferenciaTotal: 0, diferenciaEfectivo: 0, diferenciaDebito: 0 },
  })

  const ventasBrutas = displayRows.reduce((s, r) => s + calcBruto(r), 0)
  const gastosTotales = totalsDetailed.calculos.gastosTotales
  const costosProductosTotales = displayRows.reduce((sum, r) => sum + calcCostosProductos(r), 0)
  const gananciaDiaTotales = ventasBrutas - costosProductosTotales
  const gananciaFinalTotales = ventasBrutas - costosProductosTotales - gastosTotales
  const anuladasDevolucionesTotales = displayRows.reduce((sum, r) => {
    const at = (Array.isArray(r?.anuladas) ? r.anuladas : []).reduce((s: number, a: any) => s + (Number(a?.monto) || 0), 0)
    const dt = (Array.isArray(r?.devoluciones) ? r.devoluciones : []).reduce((s: number, d: any) => s + (Number(d?.monto) || 0), 0)
    return sum + at + dt
  }, 0)
  const totalVentasSistema = (Number(totalsDetailed.montos.efectivoSistema) || 0) + (Number(totalsDetailed.montos.debitoSistema) || 0) + (Number(totalsDetailed.montos.transferencias) || 0)
  const efectivoTeorico = totalsDetailed.montos.efectivoSistema
  const efectivoReal = totalsDetailed.montos.efectivoReal
  const debitoTeorico = totalsDetailed.montos.debitoSistema
  const debitoReal = totalsDetailed.montos.debitoReal
  const transferenciasTotales = totalsDetailed.montos.transferencias
  const diferenciaCajaTotal = totalsDetailed.calculos.diferenciaTotal
  const diferenciaEfectivoTotal = totalsDetailed.calculos.diferenciaEfectivo

  // ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 pt-3 pb-4 sm:pt-4 sm:pb-5 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-full mb-3" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/admin')} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ArrowLeftRight size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">Cuadres ERP</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {selectedDate || 'Todas las fechas'}{hasAdvancedSedeFilter ? ` · ${multiSedeFilter.length} sede${multiSedeFilter.length === 1 ? '' : 's'}` : selectedSede ? ` · ${formatSedeLabel(selectedSede)}` : ' · Todas las sedes'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Filtros */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="text-sm">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Mes</span>
            <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white text-slate-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={selectedMonth} onChange={(e) => { const v = e.target.value; setSelectedMonth(v); const dates = monthDates[v] || []; if (dates[0]) setSelectedDate(dates[0]) }}>
              <option value="">Todos los meses</option>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Dia</span>
            <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white text-slate-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
              <option value="">Todos los dias</option>
              {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Sede</span>
            <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white text-slate-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={selectedSede} onChange={(e) => { clearMultiSedeFilter(); setSelectedSede(e.target.value as any) }} disabled={hasAdvancedSedeFilter}>
              <option value="">Todas las sedes</option>
              {sedeKeys.map((s) => <option key={String(s)} value={String(s)}>{formatSedeLabel(s)}</option>)}
            </select>
            {hasAdvancedSedeFilter && <p className="text-[11px] text-emerald-600 font-medium mt-1">Filtro avanzado activo</p>}
          </label>
        </div>

        {hasAdvancedSedeFilter && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            {multiSedeFilter.map((slug) => <span key={slug} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium">{formatSedeLabel(slug)}</span>)}
            <button type="button" onClick={() => { clearMultiSedeFilter(); setSelectedSede('') }} className="text-[11px] font-semibold text-emerald-600 hover:underline ml-1">Limpiar</button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-emerald-600" />
            <span className="ml-3 text-slate-500 font-medium">Cargando cuadres...</span>
          </div>
        )}
        {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mb-4">{error}</div>}

        {!loading && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="col-span-2 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/80 to-cyan-50/60 border border-emerald-200/50 p-5 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl bg-emerald-200/50" />
                  <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-3xl bg-teal-200/40" />
                  <div className="absolute top-3 right-16 w-2 h-2 rounded-full bg-emerald-300/60 animate-pulse" />
                  <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-teal-400/50 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute bottom-4 right-24 w-2.5 h-2.5 rounded-full bg-emerald-200/70 animate-pulse" style={{ animationDelay: '0.7s' }} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-extrabold tracking-widest uppercase text-emerald-700">Venta Bruta Total</p>
                    <p className="text-3xl sm:text-4xl font-black mt-1 text-emerald-900">{money(ventasBrutas)}</p>
                    <p className="text-[11px] mt-1.5 text-emerald-600 font-semibold">Efectivo + Debito + Transferencias</p>
                  </div>
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-100/80 to-teal-100/80 flex items-center justify-center border border-emerald-200/40 shadow-inner">
                    <TrendingUp size={28} className="text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50/80 to-fuchsia-50/40 border border-rose-200/50 p-3.5 sm:p-4 shadow-md relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl bg-rose-200/40" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/40 shadow-inner"><HandCoins size={15} className="text-rose-600" /></div>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-rose-700">Gastos</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-rose-800">{money(gastosTotales)}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50/40 border border-amber-200/50 p-3.5 sm:p-4 shadow-md relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl bg-amber-200/40" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/40 shadow-inner"><RotateCcw size={15} className="text-amber-700" /></div>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-800">Devol / Anuladas</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-amber-900">{money(anuladasDevolucionesTotales)}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {displayRows.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <button type="button" onClick={handleExportExcel} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs hover:bg-emerald-700 shadow-sm transition-colors">
                  <Download className="h-3.5 w-3.5" /> Exportar
                </button>
                <button type="button" onClick={handleGenerateImage} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-3 py-2 text-xs hover:bg-blue-700 shadow-sm transition-colors">
                  <Image className="h-3.5 w-3.5" /> Imagen
                </button>
                <button type="button" onClick={handleShareExcel} className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 text-white px-3 py-2 text-xs hover:bg-sky-700 shadow-sm transition-colors">
                  <Share2 className="h-3.5 w-3.5" /> Compartir
                </button>
                <button type="button" onClick={() => router.push('/admin')} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 text-slate-700 px-3 py-2 text-xs bg-white hover:bg-slate-50 shadow-sm transition-colors">
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Informes
                </button>
                <button type="button" onClick={openGlobalGastosSheet} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 text-rose-700 px-3 py-2 text-xs bg-rose-50 hover:bg-rose-100 shadow-sm transition-colors">
                  <HandCoins className="h-3.5 w-3.5" /> Gastos
                </button>
              </div>
            )}

            {/* Desglose financiero */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-5 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="font-semibold text-slate-800 text-sm">Desglose del Dia</div>
                <p className="text-[10px] text-slate-500 mt-0.5">{selectedDate || 'Todas las fechas'}</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                <div className="p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Ventas y Gastos</div>
                  <div className="space-y-1.5 text-sm">
                    {[
                      { label: 'Venta Bruta', value: ventasBrutas, accent: 'text-emerald-700 font-semibold' },
                      { label: 'Costos Productos', value: costosProductosTotales, accent: 'text-slate-800 font-semibold' },
                      { label: 'Ganancia (Bruto - Costos)', value: gananciaDiaTotales, accent: gananciaDiaTotales >= 0 ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold' },
                      { label: 'Gastos', value: gastosTotales, accent: 'text-rose-700 font-semibold' },
                      { label: 'Ganancia Final', value: gananciaFinalTotales, accent: gananciaFinalTotales >= 0 ? 'text-emerald-800 font-bold' : 'text-red-800 font-bold', highlight: true },
                      { label: 'Dif. Caja Total', value: diferenciaCajaTotal, accent: diferenciaCajaTotal === 0 ? 'text-gray-700' : diferenciaCajaTotal > 0 ? 'text-red-700 font-semibold' : 'text-emerald-700 font-semibold' },
                    ].map((row: any) => (
                      <div key={row.label} className={`flex items-center justify-between rounded-xl px-3 py-2 ${row.highlight ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'}`}>
                        <span className="text-xs text-slate-600">{row.label}</span>
                        <span className={`text-right ${row.accent}`}>{money(row.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Medios de Pago</div>
                  <div className="space-y-1.5 text-sm">
                    {[
                      { label: 'Efectivo Teorico', value: efectivoTeorico },
                      { label: 'Efectivo Real', value: efectivoReal },
                      { label: 'Dif. Efectivo', value: diferenciaEfectivoTotal, accent: diferenciaEfectivoTotal === 0 ? '' : diferenciaEfectivoTotal > 0 ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold' },
                      { label: 'Debito Sistema', value: debitoTeorico },
                      { label: 'Debito Real', value: debitoReal },
                      { label: 'Transferencias', value: transferenciasTotales },
                      { label: 'Total Sistema', value: totalVentasSistema, highlight: true },
                    ].map((row: any) => (
                      <div key={row.label} className={`flex items-center justify-between rounded-xl px-3 py-2 ${row.highlight ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}`}>
                        <span className="text-xs text-slate-600">{row.label}</span>
                        <span className={`text-right font-semibold text-slate-800 ${row.accent || ''}`}>{money(row.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sede cards */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Building2 size={16} className="text-slate-400" /> Sucursales</h2>
              <span className="text-xs text-slate-500">{sortedRowsForWeb.length} cuadre{sortedRowsForWeb.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {sortedRowsForWeb.length === 0 && (
                <div className="col-span-full rounded-2xl bg-white border border-slate-200 p-8 text-center">
                  <p className="text-sm text-slate-500">No hay datos para los filtros seleccionados.</p>
                </div>
              )}
              {sortedRowsForWeb.map((r) => {
                const sedeKey = String(r?.sede || '') as SedeSlug
                const fechaKey = String(r?.fecha || '').slice(0, 10)
                const cardKey = `${sedeKey}|${fechaKey}`
                const sedeStyle = (SEDE_STYLES as any)[sedeKey] || { bg: 'bg-slate-100', text: 'text-slate-800', Icon: Building2 }
                const sedeUI = (SEDE_UI as any)[r.sede] || { icon: '🏬', bg: 'bg-white', border: 'border-slate-200', bar: '' }
                return (
                  <div
                    key={`${r.sede || 'sede'}-${r.fecha || 'fecha'}`}
                    ref={(el) => { cuadreCardRefs.current[cardKey] = el }}
                    className={`group relative overflow-hidden rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-200 ${sedeUI.bg || 'bg-white'} ${r?._pending ? 'border-yellow-300 border-dashed ring-2 ring-yellow-200' : (sedeUI.border || 'border-slate-200')}`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 ${sedeUI.bar || 'bg-slate-200'}`} />
                    <div className={`absolute -top-6 -right-6 w-28 h-28 ${sedeStyle.bg} opacity-30 rounded-full blur-2xl group-hover:opacity-50 transition-opacity pointer-events-none`} />
                    {r?._pending && (
                      <div className="pointer-events-none select-none absolute -right-10 top-3 rotate-45 bg-yellow-400 text-yellow-900 text-[10px] font-bold tracking-wide px-10 py-1 shadow z-20">EN ESPERA</div>
                    )}
                    {r?._pending && (
                      <div className="absolute inset-x-0 bottom-0 top-12 z-10 flex items-center justify-center backdrop-blur-sm bg-yellow-50/40 cursor-not-allowed rounded-b-2xl">
                        <Lock className="h-10 w-10 text-yellow-900 opacity-80" />
                      </div>
                    )}
                    <div className="relative mb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{sedeUI.icon || '🏬'}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-slate-800 ${r?._pending ? 'text-yellow-900' : ''}`}>{formatSedeLabel(sedeKey)}</h3>
                          <span className="text-xs text-slate-500">{r.fecha}</span>
                        </div>
                      </div>
                      {!r?._pending && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button type="button" onClick={() => handleDownloadSedeCardOnlyImage(r)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Imagen cuadro">
                            <Image className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDownloadSedeCardReportImage(r)} className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors" title="Reporte ganancias">
                            <CircleDollarSign className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDownloadSedeGastosOnlyImage(r)} className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors" title="Imagen gastos">
                            <HandCoins className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleSendWhatsAppPreview(r, 'parte1')} className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors" title="WhatsApp P1">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDeleteCuadreOfDay(r)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors ml-auto" title="Eliminar cuadre">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 text-sm relative">
                      <div className="flex justify-between items-center px-1 py-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-emerald-500" /> Efec. Sistema</span>
                        <span className="font-medium text-slate-700">{money(r?.montos?.efectivoSistema)}</span>
                      </div>
                      <div className="flex justify-between items-center px-1 py-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-emerald-500" /> Efec. Real</span>
                        <span className="font-medium text-slate-700">{money(r?.montos?.efectivoReal)}</span>
                      </div>
                      {(() => { const d = calcDifEfectivo(r); return d !== 0 ? (
                        <div className={`flex justify-between items-center rounded-lg px-2 py-1.5 ${d > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                          <span className="text-xs text-slate-600 flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-amber-500" /> Dif. Efectivo</span>
                          <span className={`font-bold text-xs ${d > 0 ? 'text-red-700' : 'text-emerald-700'}`}>{d > 0 ? 'Faltante ' : 'Sobrante '}{money(Math.abs(d))}</span>
                        </div>
                      ) : null })()}
                      {(() => {
                        const gastosList = Array.isArray(r?.gastos) ? r.gastos : []
                        const esMercaderia = (g: any) => { const obs = String(g?.observacion || '').toLowerCase(); return obs.includes('proveedor') }
                        const otrosGastosTotal = gastosList.filter((g: any) => !esMercaderia(g)).reduce((s: number, g: any) => s + (Number(g?.monto) || 0), 0)
                        return (
                          <div className="flex justify-between items-center px-1 py-1">
                            <span className="text-xs text-slate-500 flex items-center gap-1.5"><HandCoins className="h-3.5 w-3.5 text-rose-500" /> Gastos</span>
                            <span className="font-bold text-rose-700 flex items-center gap-1.5">
                              {money(otrosGastosTotal)}
                              {Number(r?.calculos?.gastosTotales) > 0 && (
                                <button type="button" onClick={() => openGastosSheet(r)} className="p-1 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"><Image className="h-3 w-3" /></button>
                              )}
                            </span>
                          </div>
                        )
                      })()}
                      <div className="flex justify-between items-center px-1 py-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-sky-500" /> Debito Sist.</span>
                        <span className="font-medium text-slate-700">{money(r?.montos?.debitoSistema)}</span>
                      </div>
                      <div className="flex justify-between items-center px-1 py-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5"><ArrowLeftRight className="h-3.5 w-3.5 text-violet-500" /> Transf. Sist.</span>
                        <span className="font-medium text-slate-700">{money(r?.montos?.transferenciaSistema ?? r?.montos?.transferencias)}</span>
                      </div>
                      <div className="h-px bg-slate-100 my-1" />
                      <div className="flex justify-between items-center rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Bruto</span>
                        <span className="font-bold text-slate-800">{money(calcBruto(r))}</span>
                      </div>
                      <div className="flex justify-between items-center rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5"><CircleDollarSign className="h-3.5 w-3.5" /> Neto</span>
                        <span className="font-bold text-emerald-800">{money(calcNeto(r))}</span>
                      </div>
                    </div>

                    {/* Dif. Caja */}
                    {(() => {
                      const info = getCajaDiffInfo(r)
                      return (
                        <div className={`mt-3 rounded-xl px-3 py-2 ${info.className.includes('red') ? 'bg-red-50 border border-red-200' : info.className.includes('amber') ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600 flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-amber-500" /> Dif. Caja</span>
                            <span className={`text-xs font-bold ${info.className}`}>{info.label}</span>
                          </div>
                          {info.detail && <div className="text-[10px] text-slate-500 mt-0.5 text-right">{info.detail}</div>}
                        </div>
                      )
                    })()}

                    {!r?._pending && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => openCortesSheet(r)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                          <RotateCcw className="h-3.5 w-3.5" /> Anuladas / Devol.
                        </button>
                        <button type="button" onClick={() => openTopsSheet(r)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                          <TrendingUp className="h-3.5 w-3.5" /> Top 10
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Bottom Sheet: Gastos */}
        {gastosSheet.open && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={closeGastosSheet} />
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] w-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="text-sm text-gray-700">Gastos — <b>{formatSedeLabel(gastosSheet.sede)}</b> {gastosSheet.fecha ? `— ${gastosSheet.fecha}` : ''}</div>
                <button onClick={closeGastosSheet} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Cerrar</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {Array.isArray(gastosSheet.gastos) && gastosSheet.gastos.length ? (
                  <div className="space-y-3">
                    {gastosSheet.gastos.map((g, idx) => {
                      const fotosDeGasto = (Array.isArray(gastosSheet.fotos) ? gastosSheet.fotos : []).filter((f: any) => f?.tipo === 'gasto' && f?.gastoIndex === idx)
                      return (
                        <div key={idx} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <div className="font-semibold">{g?.observacion || `Gasto #${idx + 1}`}</div>
                              {g?.detalle ? <div className="text-gray-600">{g.detalle}</div> : null}
                            </div>
                            <div className="text-sm font-semibold">{money(Number(g?.monto) || 0)}</div>
                          </div>
                          {fotosDeGasto.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-1 mt-2">
                              {fotosDeGasto.map((f: any, i: number) => (
                                <button key={i} className="shrink-0" onClick={() => { const urls = fotosDeGasto.map((x: any) => x.url).filter((u: string) => typeof u === 'string' && u); openViewer(urls, i) }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={f.url} alt={f?.name || `foto-${i + 1}`} className="h-28 w-28 object-contain rounded border bg-gray-50" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : <div className="text-sm text-gray-600">No hay gastos registrados.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Sheet: Gastos Globales */}
        {globalGastosSheet.open && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={closeGlobalGastosSheet} />
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] w-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                <div className="text-sm text-gray-700">Gastos — Todas las sucursales {globalGastosSheet.fecha ? `— ${globalGastosSheet.fecha}` : ''}</div>
                <button onClick={closeGlobalGastosSheet} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Cerrar</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 overscroll-contain">
                {Array.isArray(globalGastosSheet.items) && globalGastosSheet.items.length ? (
                  <div className="space-y-3">
                    {globalGastosSheet.items.map((g, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">{formatSedeLabel(g.sede)}</div>
                          <div className="text-sm font-bold">${Number(g.monto).toLocaleString('es-CL')}</div>
                        </div>
                        {g.observacion && <div className="text-sm text-gray-600 mt-1">{g.observacion}</div>}
                      </div>
                    ))}
                  </div>
                ) : <div className="text-sm text-gray-600">No hay gastos registrados.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Sheet: Anuladas */}
        {cortesSheet.open && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={closeCortesSheet} />
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] w-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                <div className="text-sm text-gray-700">Anuladas / Devoluciones — <b>{formatSedeLabel(cortesSheet.sede)}</b> {cortesSheet.fecha ? `— ${cortesSheet.fecha}` : ''}</div>
                <button onClick={closeCortesSheet} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Cerrar</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {Array.isArray(cortesSheet.items) && cortesSheet.items.length ? (
                  <div className="space-y-3">
                    {cortesSheet.items.map((g: any, idx: number) => {
                      const tipo = g?.esAnulada ? 'Anulada' : g?.esDevolucion ? 'Devolucion' : 'Otro'
                      const tipoBg = g?.esAnulada ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      return (
                        <div key={idx} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <div className="font-semibold flex items-center gap-1.5">
                                <RotateCcw className="h-3.5 w-3.5 text-orange-500" />
                                {g?.folio ? `Folio #${g.folio}` : `#${idx + 1}`}
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tipoBg}`}>{tipo}</span>
                              </div>
                              {g?.observacion && <div className="text-gray-600 mt-0.5">{g.observacion}</div>}
                            </div>
                            <div className="text-sm font-bold text-orange-700">{money(Number(g?.monto) || 0)}</div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Total Anuladas/Devol.</span>
                      <span className="text-sm font-bold text-orange-700">{money(cortesSheet.items.reduce((s: number, g: GastoItem) => s + (Number(g?.monto) || 0), 0))}</span>
                    </div>
                  </div>
                ) : <div className="text-sm text-gray-600">No hay devoluciones ni boletas anuladas.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Sheet: Top 10 */}
        {topsSheet.open && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={closeTopsSheet} />
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl h-[85vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="text-sm text-gray-700">Top 10 — <b>{formatSedeLabel(topsSheet.sede)}</b> {topsSheet.fecha ? `— ${topsSheet.fecha}` : ''}</div>
                <button onClick={closeTopsSheet} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Cerrar</button>
              </div>
              <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
                {Array.isArray(topsSheet.items) && topsSheet.items.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-2 border text-left">#</th>
                          <th className="px-2 py-2 border text-left">SKU</th>
                          <th className="px-2 py-2 border text-left">Nombre</th>
                          <th className="px-2 py-2 border text-right">Cantidad</th>
                          <th className="px-2 py-2 border text-right">Costo Neto</th>
                          <th className="px-2 py-2 border text-right">Ventas Brutas</th>
                          <th className="px-2 py-2 border text-right">Ventas Netas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topsSheet.items.map((p, idx) => (
                          <tr key={`${p.sku}-${idx}`} className="odd:bg-white even:bg-gray-50">
                            <td className="px-2 py-2 border text-left w-10">{idx + 1}</td>
                            <td className="px-2 py-2 border text-left whitespace-nowrap">{p.sku}</td>
                            <td className="px-2 py-2 border text-left">{p.nombre}</td>
                            <td className="px-2 py-2 border text-right">{Number(p.cantidadVendida).toLocaleString('es-CL')}</td>
                            <td className="px-2 py-2 border text-right text-gray-800">{money(Number(p.costoNeto) || 0)}</td>
                            <td className="px-2 py-2 border text-right text-gray-800">{money(Number(p.ventasBrutas) || 0)}</td>
                            <td className="px-2 py-2 border text-right text-gray-800">{money(Number(p.ventasNetas) || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div className="text-sm text-gray-600">No hay datos de Top 10 para esta sede.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {viewer.open && <ImageViewer viewer={viewer} onClose={closeViewer} onNavigate={(idx: number) => setViewer(v => ({ ...v, index: idx }))} />}
      </div>
    </div>
  )
}

// ── ImageViewer ────────────────────────────────────────────────────────────
function ImageViewer({ viewer, onClose, onNavigate }: { viewer: { open: boolean; urls: string[]; index: number; title?: string }; onClose: () => void; onNavigate: (idx: number) => void }) {
  const [zoom, setZoom] = useState(1)
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
  const zoomIn = () => setZoom(z => clamp(z + 0.25, 0.5, 5))
  const zoomOut = () => setZoom(z => clamp(z - 0.25, 0.5, 5))
  const reset = () => setZoom(1)
  const prev = () => onNavigate((viewer.index - 1 + viewer.urls.length) % viewer.urls.length)
  const next = () => onNavigate((viewer.index + 1) % viewer.urls.length)
  useEffect(() => { setZoom(1) }, [viewer.index])
  const url = viewer.urls[viewer.index]
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-black/60 text-white">
          <div className="text-sm truncate">{viewer.title || 'Visor de imagenes'}</div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-sm rounded bg-white/10 hover:bg-white/20" onClick={zoomOut}>-</button>
            <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button className="px-2 py-1 text-sm rounded bg-white/10 hover:bg-white/20" onClick={zoomIn}>+</button>
            <button className="px-2 py-1 text-sm rounded bg-white/10 hover:bg-white/20" onClick={reset}>Reset</button>
            <button className="px-2 py-1 text-sm rounded bg-white/10 hover:bg-white/20" onClick={onClose}>Cerrar</button>
          </div>
        </div>
        <div className="relative flex-1 overflow-auto touch-pan-y touch-pan-x">
          <div className="min-h-full min-w-full flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`img-${viewer.index + 1}`} className="max-w-[95vw] max-h-[85vh] rounded bg-white" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }} />
          </div>
          {viewer.urls.length > 1 && (
            <>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded bg-black/50 text-white hover:bg-black/60" onClick={prev}>prev</button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded bg-black/50 text-white hover:bg-black/60" onClick={next}>next</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 rounded px-2 py-1">{viewer.index + 1} / {viewer.urls.length}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
