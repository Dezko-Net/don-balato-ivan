'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, UserPlus, Trash2, ArrowLeft, Loader2, Building2, BadgeDollarSign } from 'lucide-react'
import { SEDES, SedeSlug } from '@/types'
import {
  fetchTrabajadoresERP,
  createTrabajadorERP,
  deleteTrabajadorERP,
  type TrabajadorERP,
} from '@/lib/trabajadoresErpService'

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n || 0))

const SEDE_KEYS = Object.keys(SEDES) as SedeSlug[]

const emptyForm = {
  nombre: '',
  cargo: '',
  sede: 'alameda' as SedeSlug,
  sueldo: '',
  fotoUrl: '',
  fechaIngreso: '',
}

export default function EquipoPage() {
  const router = useRouter()
  const [items, setItems] = useState<TrabajadorERP[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const list = await fetchTrabajadoresERP()
    list.sort((a, b) => a.nombre.localeCompare(b.nombre))
    setItems(list)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const totalSueldos = items.filter(t => t.activo).reduce((s, t) => s + (Number(t.sueldo) || 0), 0)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setSaving(true)
    const created = await createTrabajadorERP({
      nombre: form.nombre.trim(),
      cargo: form.cargo.trim(),
      sede: form.sede,
      sueldo: Number(form.sueldo) || 0,
      fotoUrl: form.fotoUrl.trim(),
      activo: true,
      fechaIngreso: form.fechaIngreso,
    })
    setSaving(false)
    if (!created) { setError('No se pudo guardar. Intenta nuevamente.'); return }
    setForm(emptyForm)
    await load()
  }

  const handleDelete = async (t: TrabajadorERP) => {
    if (!window.confirm(`¿Eliminar a ${t.nombre}?`)) return
    setDeletingId(t.$id)
    const ok = await deleteTrabajadorERP(t.$id)
    setDeletingId(null)
    if (!ok) { alert('No se pudo eliminar. Intenta nuevamente.'); return }
    setItems(prev => prev.filter(x => x.$id !== t.$id))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push('/erp-dashboard')} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-sm"><Users size={18} /></div>
          <div>
            <h1 className="text-lg font-black text-slate-800 dark:text-white leading-none">Gestión de Equipo</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Trabajadores del ERP · colección <code>trabajadores_erp</code></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Formulario */}
        <form onSubmit={handleAdd} className="lg:col-span-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Agregar trabajador</h2>
          </div>
          <div className="space-y-3">
            <Field label="Nombre *">
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className={inputCls} placeholder="Ej: María Pérez" />
            </Field>
            <Field label="Cargo">
              <input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} className={inputCls} placeholder="Ej: Cajera" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sede">
                <select value={form.sede} onChange={e => setForm({ ...form, sede: e.target.value as SedeSlug })} className={inputCls}>
                  {SEDE_KEYS.map(s => <option key={s} value={s}>{SEDES[s]}</option>)}
                </select>
              </Field>
              <Field label="Sueldo (CLP)">
                <input type="number" min={0} value={form.sueldo} onChange={e => setForm({ ...form, sueldo: e.target.value })} className={inputCls} placeholder="0" />
              </Field>
            </div>
            <Field label="Fecha de ingreso">
              <input type="date" value={form.fechaIngreso} onChange={e => setForm({ ...form, fechaIngreso: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Foto (URL)">
              <input value={form.fotoUrl} onChange={e => setForm({ ...form, fotoUrl: e.target.value })} className={inputCls} placeholder="https://…" />
            </Field>
            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {saving ? 'Guardando…' : 'Agregar al equipo'}
            </button>
          </div>
        </form>

        {/* Lista */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Building2 size={14} /> Trabajadores activos</div>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{loading ? '…' : items.filter(t => t.activo).length}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><BadgeDollarSign size={14} /> Sueldos / mes</div>
              <p className="text-2xl font-black text-emerald-600 mt-1">{loading ? '…' : fmtCLP(totalSueldos)}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-14 text-slate-400 text-sm"><Loader2 size={18} className="animate-spin" /> Cargando equipo…</div>
            ) : items.length === 0 ? (
              <div className="py-14 text-center text-sm text-slate-500">Aún no hay trabajadores. Agrega el primero con el formulario.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {items.map(t => (
                  <div key={t.$id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {t.fotoUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={t.fotoUrl} alt={t.nombre} className="w-full h-full object-cover" />
                        : <span className="text-sm font-bold text-slate-500">{t.nombre.slice(0, 1).toUpperCase()}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{t.nombre}</p>
                      <p className="text-xs text-slate-500 truncate">{t.cargo || 'Sin cargo'} · {SEDES[t.sede] || t.sede}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{fmtCLP(t.sueldo)}</p>
                      <p className="text-[10px] text-slate-400">{t.fechaIngreso || '—'}</p>
                    </div>
                    <button onClick={() => handleDelete(t)} disabled={deletingId === t.$id} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition disabled:opacity-50">
                      {deletingId === t.$id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  )
}
