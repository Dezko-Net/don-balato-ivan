'use client'

import { useId, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PARTICLES, SECTION_STYLES, type SectionTone } from './helpers'

export function Img({ src, alt, fallback, className = '' }: { src?: string; alt: string; fallback: string; className?: string }) {
  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} />
  return <div className={`flex items-center justify-center bg-gradient-to-br from-slate-100/80 to-slate-200/60 text-2xl ${className}`}>{fallback}</div>
}

export function Stat({ label, value, icon, gradient = 'from-slate-500 to-slate-700' }: { label: string; value: string; icon?: React.ReactNode; gradient?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl px-4 py-3 shadow-sm shadow-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50">
      <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} opacity-[0.08] blur-2xl group-hover:opacity-[0.14] transition`} />
      <div className="relative flex items-center gap-3">
        {icon && <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-black/[0.08]`}>{icon}</div>}
        <div className="min-w-0 flex-1">
          <div className="text-[9.5px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
          <div className="mt-0.5 truncate text-[14px] font-extrabold text-slate-900">{value || '—'}</div>
        </div>
      </div>
    </div>
  )
}

export function AmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span key={`${p.left}-${p.top}-${i}`} className={`absolute rounded-full ${p.size} ${p.color} animate-pulse blur-[0.5px]`} style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }} />
      ))}
    </div>
  )
}

export function Section({ icon, title, subtitle, children, defaultOpen = true, tone }: {
  icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean; tone: SectionTone
}) {
  const [open, setOpen] = useState(defaultOpen)
  const style = SECTION_STYLES[tone]
  return (
    <section className={`overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-br ${style.shell} backdrop-blur-2xl shadow-lg shadow-black/[0.04]`}>
      <div className={`h-1.5 w-full bg-gradient-to-r ${style.strip}`} />
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition hover:bg-white/30">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-md shadow-black/[0.08] ${style.icon}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${style.badge}`}>sección</div>
          <h2 className="mt-2 text-[15px] font-bold text-slate-900">{title}</h2>
          <p className="text-[12px] text-slate-600">{subtitle}</p>
        </div>
        {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      {open && <div className="border-t border-white/50 px-5 pb-5 pt-4">{children}</div>}
    </section>
  )
}

export function ImageUploader({ value, onChange, fallback, shape = 'landscape', disabled, hidePreview = false }: {
  value: string; onChange: (v: string) => void; fallback: string; shape?: 'landscape' | 'square' | 'circle'; disabled?: boolean; hidePreview?: boolean
}) {
  const sizeMap = {
    landscape: 'h-20 w-20 sm:h-24 sm:w-full sm:max-w-[180px] rounded-xl',
    square: 'h-16 w-16 sm:h-20 sm:w-20 rounded-xl',
    circle: 'h-14 w-14 sm:h-16 sm:w-16 rounded-full',
  }
  return (
    <div className="rounded-xl bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm p-2.5 transition duration-300 hover:shadow-md">
      <div className="flex items-center gap-2.5">
        {!hidePreview && (
          <div className={`shrink-0 overflow-hidden ${sizeMap[shape]} border border-slate-200/40 bg-white/70`}>
            <Img src={value} alt="" fallback={fallback} className={`h-full w-full ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}`} />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-1.5">
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…"
            className="block w-full rounded-lg border border-slate-200/50 bg-white/60 px-2 py-1 text-[10.5px] text-slate-600 outline-none placeholder:text-slate-300 focus:border-sky-300" disabled={disabled} />
          <div className="text-[10px] text-slate-400">Pega una URL de imagen</div>
        </div>
      </div>
    </div>
  )
}
