'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Loader2, Save, Wallet, CreditCard, ArrowLeftRight, HandCoins, Scale } from 'lucide-react'
import { SEDES, SedeSlug } from '@/types'
import { createCuadreERP, type CuadreGasto } from '@/lib/cuadresErpService'

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n || 0))

const SEDE_KEYS = Object.keys(SEDES) as SedeSlug[]
const todayCL = () => new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10)

type GastoDraft = { monto: string; observacion: string }

export default function NuevoCuadrePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [sede, setSede] = useState<SedeSlug>('alameda')
  const [fecha, setFecha] = useState<string>(todayCL())
  const [efectivoSistema, setEfectivoSistema] = useState('')
  const [efectivoReal, setEfectivoReal] = useState('')
  const [debitoSistema, setDebitoSistema] = useState('')
  const [debitoReal, setDebitoReal] = useState('')
  const [transferencias, setTransferencias] = useState('')
  const [gastos, setGastos] = useState<GastoDraft[]>([])

  const num = (v: string) => Number(v) || 0

  const calc = useMemo(() => {
    const efSis = num(efectivoSistema), efReal = num(efectivoReal)
    const debSis = num(debitoSistema), debReal = num(debitoReal)
    const transf = num(transferencias)
    const gastosTotales = gastos.reduce((s, g) => s + num(g.monto), 0)
    const totalBruto = efSis + debSis + transf
    const totalNeto = totalBruto - gastosTotales
    const diferenciaEfectivo = efSis - efReal
    const diferenciaDebito = debSis - debReal
    const diferenciaTotal = diferenciaEfectivo + diferenciaDebito
    return { gastosTotales, totalBruto, totalNeto, diferenciaEfectivo, diferenciaDebito, diferenciaTotal }
  }, [efectivoSistema, efectivoReal, debitoSistema, debitoReal, transferencias, gastos])

  const addGasto = () => setGastos(prev => [...prev, { monto: '', observacion: '' }])
  const updGasto = (i: number, k: keyof GastoDraft, v: string) =>
    setGastos(prev => prev.map((g, idx) => idx === i ? { ...g, [k]: v } : g))
  const delGasto = (i: number) => setGastos(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!fecha) { setError('Selecciona una fecha.'); return }
    setSaving(true)
    const gastosClean: CuadreGasto[] = gastos
      .filter(g => num(g.monto) > 0)
      .map(g => ({ monto: num(g.monto), observacion: g.observacion.trim() }))
    const created = await createCuadreERP({
      sede,
      fecha,
      estado: 'enviado',
      montos: {
        efectivoSistema: num(efectivoSistema),
        efectivoReal: num(efectivoReal),
        debitoSistema: num(debitoSistema),
        debitoReal: num(debitoReal),
        transferencias: num(transferencias),
      },
      calculos: {
        gastosTotales: calc.gastosTotales,
        totalNeto: calc.totalNeto,
        totalBruto: calc.totalBruto,
        diferenciaTotal: calc.diferenciaTotal,
        diferenciaEfectivo: calc.diferenciaEfectivo,
        diferenciaDebito: calc.diferenciaDebito,
      },
      gastos: gastosClean,
      topProducts: [],
      fotos: [],
      anuladas: [],
      devoluciones: [],
    })
    setSaving(false)
    if (!created) { setError('No se pudo guardar el cuadre. Intenta nuevamente.'); return }
    router.push('/erp')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 sm:px-6 py-5">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => router.push('/erp')} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800">Nuevo Cuadre de Caja</h1>
            <p className="text-xs text-slate-500 mt-0.5">Los cálculos se generan automáticamente al escribir.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sede + fecha */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Sede">
              <select value={sede} onChange={e => setSede(e.target.value as SedeSlug)} className={inputCls}>
                {SEDE_KEYS.map(s => <option key={s} value={s}>{SEDES[s]}</option>)}
              </select>
            </Field>
            <Field label="Fecha">
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inputCls} />
            </Field>
          </div>

          {/* Montos */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Medios de pago</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MoneyField icon={<Wallet size={14} className="text-emerald-500" />} label="Efectivo Sistema (POS)" value={efectivoSistema} onChange={setEfectivoSistema} />
              <MoneyField icon={<Wallet size={14} className="text-emerald-500" />} label="Efectivo Real (conteo)" value={efectivoReal} onChange={setEfectivoReal} />
              <MoneyField icon={<CreditCard size={14} className="text-sky-500" />} label="Débito Sistema" value={debitoSistema} onChange={setDebitoSistema} />
              <MoneyField icon={<CreditCard size={14} className="text-sky-500" />} label="Débito Real" value={debitoReal} onChange={setDebitoReal} />
              <MoneyField icon={<ArrowLeftRight size={14} className="text-violet-500" />} label="Transferencias" value={transferencias} onChange={setTransferencias} />
            </div>
          </div>

          {/* Gastos */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><HandCoins size={15} className="text-rose-500" /> Gastos del día</h2>
              <button type="button" onClick={addGasto} className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 text-rose-700 px-3 py-1.5 text-xs font-bold hover:bg-rose-100 transition">
                <Plus size={14} /> Agregar gasto
              </button>
            </div>
            {gastos.length === 0 ? (
              <p className="text-xs text-slate-400">Sin gastos. Usa "Agregar gasto" si hubo egresos.</p>
            ) : (
              <div className="space-y-2">
                {gastos.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="number" min={0} value={g.monto} onChange={e => updGasto(i, 'monto', e.target.value)} placeholder="Monto" className={`${inputCls} w-32`} />
                    <input value={g.observacion} onChange={e => updGasto(i, 'observacion', e.target.value)} placeholder="Descripción (ej: Proveedor)" className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => delGasto(i)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen calculado */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-1.5"><Scale size={15} /> Resumen (automático)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Summary label="Venta Bruta" value={fmtCLP(calc.totalBruto)} accent="text-emerald-800 font-black" />
              <Summary label="Gastos" value={fmtCLP(calc.gastosTotales)} accent="text-rose-700 font-bold" />
              <Summary label="Venta Neta" value={fmtCLP(calc.totalNeto)} accent="text-emerald-800 font-black" />
              <Summary label="Dif. Efectivo" value={fmtCLP(calc.diferenciaEfectivo)} accent={calc.diferenciaEfectivo === 0 ? 'text-slate-700' : 'text-red-700 font-bold'} />
              <Summary label="Dif. Débito" value={fmtCLP(calc.diferenciaDebito)} accent={calc.diferenciaDebito === 0 ? 'text-slate-700' : 'text-red-700 font-bold'} />
              <Summary label="Dif. Total" value={fmtCLP(calc.diferenciaTotal)} accent={calc.diferenciaTotal === 0 ? 'text-slate-700' : 'text-red-700 font-bold'} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 transition">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Guardando…' : 'Guardar cuadre'}
            </button>
            <button type="button" onClick={() => router.push('/erp')} className="rounded-xl border border-slate-200 text-slate-600 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputCls = 'border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  )
}

function MoneyField({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{icon} {label}</span>
      <input type="number" min={0} value={value} onChange={e => onChange(e.target.value)} placeholder="0" className={`${inputCls} w-full`} />
    </label>
  )
}

function Summary({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl bg-white/70 border border-emerald-100 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-sm ${accent}`}>{value}</p>
    </div>
  )
}
