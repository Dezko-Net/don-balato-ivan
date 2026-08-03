'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle2, Crown, Palette, RefreshCw, Save,
  Server, Shield, Store, Trash2, UserPlus, Users, Waypoints,
} from 'lucide-react'
import {
  ADMIN_SUPREME_ALLOWED_EMAIL, APP_ROLES, ROLE_COLORS, ROLE_LABELS, SECTION_STYLES,
  type AppRole, type AppUserRecord, type BranchConfig, type RuntimeAppConfig, type SectionTone,
  createEmptyBranch, getDefaultRuntimeConfig, loadConfig, loadUsers, mergeRuntimeConfig,
  saveConfig, saveUserToAppwrite, deleteUserFromAppwrite, deleteConfig, sanitize,
} from './helpers'
import { AmbientParticles, ImageUploader, Img, Section, Stat } from './ui'
import { AdminOnboarding } from './onboarding'

const glass = 'bg-white/60 backdrop-blur-2xl border border-white/40 shadow-lg shadow-black/[0.03]'
const inputCls = 'mt-1.5 w-full rounded-xl border border-slate-200/60 bg-white/70 px-3.5 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100/80 backdrop-blur-sm'
const btnPrimary = 'inline-flex items-center gap-2 rounded-xl bg-slate-700 border border-slate-600/50 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none'
const btnSecondary = 'inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-sm px-4 py-2.5 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:bg-white/80 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none'
const labelCls = 'block text-[12px] font-semibold text-slate-500 uppercase tracking-wide'
const pill = (active: boolean) => active
  ? 'border-slate-400 bg-slate-100 text-slate-700 shadow-sm'
  : 'border-slate-200/60 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white'

export default function AdminSupremePage() {
  const init = useMemo(() => getDefaultRuntimeConfig(), [])
  const baseConfig = useMemo(() => mergeRuntimeConfig(getDefaultRuntimeConfig(), init), [init])
  const [form, setForm] = useState<RuntimeAppConfig>(init)
  const [status, setStatus] = useState<string | null>(null)
  const [users, setUsers] = useState<AppUserRecord[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(false)
  const [savingUser, setSavingUser] = useState<string | null>(null)
  const [showNewUser, setShowNewUser] = useState(false)
  const [showNewBranch, setShowNewBranch] = useState(false)
  const [newUser, setNewUser] = useState<AppUserRecord>({ email: '', displayName: '', photoURL: init.branding.defaultUserAvatarUrl, role: 'trabajador', branchSlugs: [] })
  const [newBranch, setNewBranch] = useState<BranchConfig>(createEmptyBranch())
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [obCompanyName, setObCompanyName] = useState('')
  const [obOwnerName, setObOwnerName] = useState('')
  const [obBranchName, setObBranchName] = useState('')
  const [obBranchSlug, setObBranchSlug] = useState('')
  const [obBranchImage, setObBranchImage] = useState('')
  const [obSparkMode, setObSparkMode] = useState(true)
  const [obLogoUrl, setObLogoUrl] = useState('https://img.freepik.com/vector-premium/vector-diseno-logotipo-minimalista-abstracto-creativo-elegante-cualquier-empresa-marca_1253202-135975.jpg?semt=ais_rp_progressive&w=740&q=80')
  const [obAvatarUrl, setObAvatarUrl] = useState('https://www.shutterstock.com/image-photo/confident-middle-aged-business-man-600nw-2516789501.jpg')
  const [obGradient, setObGradient] = useState('from-sky-500 via-cyan-500 to-blue-600')
  const [obWorkerName, setObWorkerName] = useState('')
  const [obWorkerNac, setObWorkerNac] = useState('CHILENA')
  const [obWorkerGenero, setObWorkerGenero] = useState<'HOMBRE' | 'MUJER'>('MUJER')

  const supremeEmail = (form.supremeAdminEmail || '').trim().toLowerCase()
  const savedSupremeEmail = (init.supremeAdminEmail || '').trim().toLowerCase()
  const myEmail = ADMIN_SUPREME_ALLOWED_EMAIL
  const myRole: AppRole = 'admin_supremo'
  const canEdit = true

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const config = await loadConfig()
      if (cancelled) return
      if (!config || !config.companyName || !config.ownerProfile.displayName) setOnboardingOpen(true)
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!onboardingOpen) return
    document.body.classList.add('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [onboardingOpen])

  const submitOnboarding = async () => {
    const company = obCompanyName.trim()
    const owner = obOwnerName.trim()
    const bName = obBranchName.trim()
    const bSlug = obBranchSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (!company || !owner || !bName || !bSlug) { setStatus('Faltan datos: completa todos los campos.'); return }
    const newConfig: RuntimeAppConfig = {
      ...getDefaultRuntimeConfig(),
      companyName: company, legalName: company,
      companyDescription: `Panel maestro para ${company}`,
      sparkMode: obSparkMode,
      ownerProfile: { ...getDefaultRuntimeConfig().ownerProfile, displayName: owner },
      branding: { ...getDefaultRuntimeConfig().branding, companyLogoUrl: obLogoUrl, defaultUserAvatarUrl: obAvatarUrl },
      branches: [{ slug: bSlug, name: bName, region: '', icon: '🏪', color: 'blue', active: true, imageUrl: obBranchImage, managerEmail: '' }],
    }
    setForm(newConfig)
    setStatus('Guardando configuración…')
    const ok = await saveConfig(newConfig)
    if (!ok) { setStatus('Error al guardar la configuración. Revisa la consola para más detalles.'); return }

    if (obWorkerName.trim()) {
      try {
        await fetch('/api/admin-supreme/save-trabajador', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: obWorkerName.trim(),
            cargo: 'Cajera',
            sede: bSlug,
            nacionalidad: obWorkerNac,
            genero: obWorkerGenero,
            activo: true,
          }),
        })
      } catch (e) { console.error('[onboarding] save-trabajador error:', e) }
    }

    setStatus(null)
    setOnboardingOpen(false)
  }

  const activeCount = useMemo(() => form.branches.filter((b) => b.active).length, [form.branches])
  const [activeSection, setActiveSection] = useState<SectionTone>('brand')
  const sectionItems = [
    { key: 'brand' as SectionTone, label: 'Branding', detail: 'Logo, nombre y color', icon: <Palette size={17} />, badge: `${form.branding.companyLogoUrl ? '1' : '0'} logo` },
    { key: 'owner' as SectionTone, label: 'Operador', detail: 'Dueño y correo supremo', icon: <Crown size={17} />, badge: form.ownerProfile.displayName || 'Sin nombre' },
    { key: 'branches' as SectionTone, label: 'Sucursales', detail: 'Sedes y managers', icon: <Store size={17} />, badge: `${activeCount}/${form.branches.length} activas` },
    { key: 'firebase' as SectionTone, label: 'Appwrite', detail: 'Credenciales y conexión', icon: <Server size={17} />, badge: form.firebase.projectId || 'donbalatoivan' },
    { key: 'users' as SectionTone, label: 'Usuarios', detail: 'Roles y accesos', icon: <Users size={17} />, badge: `${users.length} usuarios` },
    { key: 'checklist' as SectionTone, label: 'Checklist', detail: 'Salida comercial final', icon: <Shield size={17} />, badge: canEdit ? 'Listo para operar' : 'Modo lectura' },
  ]
  const activeSectionMeta = sectionItems.find((item) => item.key === activeSection) || sectionItems[0]

  /* form updaters */
  function set<K extends keyof RuntimeAppConfig>(k: K, v: RuntimeAppConfig[K]) { setForm((p) => ({ ...p, [k]: v })) }
  function setBrand(k: keyof RuntimeAppConfig['branding'], v: string) { setForm((p) => ({ ...p, branding: { ...p.branding, [k]: v } })) }
  function setOwner(k: keyof RuntimeAppConfig['ownerProfile'], v: string) { setForm((p) => ({ ...p, ownerProfile: { ...p.ownerProfile, [k]: v } })) }
  function setBranch(slug: string, k: string, v: string | boolean) { setForm((p) => ({ ...p, branches: p.branches.map((b) => b.slug === slug ? { ...b, [k]: v } : b) })) }

  function addBranch() {
    if (!canEdit) return
    const slug = sanitize(newBranch.slug || newBranch.name).replace(/^-+|-+$/g, '')
    const name = newBranch.name.trim()
    if (!slug || !name) { setStatus('La nueva sucursal necesita nombre y slug válidos.'); return }
    if (form.branches.some((b) => b.slug === slug)) { setStatus(`Ya existe una sucursal con el slug ${slug}.`); return }
    setForm((p) => ({ ...p, branches: [...p.branches, { ...newBranch, slug, name, region: newBranch.region.trim(), icon: newBranch.icon.trim() || '🏬', color: newBranch.color.trim() || 'slate', imageUrl: newBranch.imageUrl.trim(), managerEmail: newBranch.managerEmail.trim().toLowerCase() }] }))
    setStatus(`Sucursal ${name} creada.`)
    setShowNewBranch(false)
    setNewBranch(createEmptyBranch())
  }

  function removeBranch(slug: string) {
    if (!canEdit) return
    const branch = form.branches.find((b) => b.slug === slug)
    if (!branch) return
    if (!confirm(`¿Eliminar la sucursal ${branch.name}?`)) return
    setForm((p) => ({ ...p, branches: p.branches.filter((b) => b.slug !== slug) }))
    setUsers((p) => p.map((u) => ({ ...u, branchSlugs: (u.branchSlugs || []).filter((s) => s !== slug) })))
    setStatus(`Sucursal ${branch.name} eliminada.`)
  }

  /* load remote config */
  useEffect(() => {
    (async () => {
      setLoadingConfig(true)
      try {
        const remote = await loadConfig()
        if (remote) setForm(remote)
        else setForm(baseConfig)
      } catch (e) { console.error(e); setStatus('No se pudo cargar la configuración desde Appwrite.') }
      finally { setLoadingConfig(false) }
    })()
  }, [baseConfig])

  /* load users */
  useEffect(() => {
    (async () => {
      setLoadingUsers(true)
      try {
        const list = await loadUsers()
        list.sort((a, b) => APP_ROLES.indexOf(b.role) - APP_ROLES.indexOf(a.role))
        setUsers(list)
      } catch (e) { console.error(e) } finally { setLoadingUsers(false) }
    })()
  }, [])

  const saveUser = async (entry: AppUserRecord) => {
    const email = entry.email.trim().toLowerCase()
    if (!email) { setStatus('Se necesita un email.'); return }
    const norm: AppUserRecord = { ...entry, email, displayName: (entry.displayName || email.split('@')[0]).trim(), photoURL: (entry.photoURL || form.branding.defaultUserAvatarUrl).trim(), role: email === (supremeEmail || savedSupremeEmail) ? 'admin_supremo' : entry.role, branchSlugs: entry.branchSlugs || [], createdAt: entry.createdAt || Date.now(), createdBy: entry.createdBy || myEmail }
    setSavingUser(email)
    try {
      await saveUserToAppwrite(norm)
      setUsers((p) => { const exists = p.some((u) => u.email === email); const next = exists ? p.map((u) => u.email === email ? norm : u) : [...p, norm]; return next.sort((a, b) => APP_ROLES.indexOf(b.role) - APP_ROLES.indexOf(a.role)) })
      setStatus(`${email} guardado.`)
    } catch (e) { console.error(e); setStatus(`Error guardando ${email}.`) } finally { setSavingUser(null) }
  }

  const deleteUser = async (email: string) => {
    if (email === (supremeEmail || savedSupremeEmail) || !confirm(`¿Eliminar ${email}?`)) return
    setSavingUser(email)
    try { await deleteUserFromAppwrite(email); setUsers((p) => p.filter((u) => u.email !== email)); setStatus(`${email} eliminado.`) } catch { setStatus(`Error eliminando ${email}.`) } finally { setSavingUser(null) }
  }

  const handleSave = async () => {
    if (!canEdit) return
    try {
      await saveConfig(form)
      setStatus('Guardado en Appwrite. Recargando...')
      setTimeout(() => window.location.reload(), 400)
    } catch (e) {
      const detail = e instanceof Error ? e.message : 'Error desconocido'
      setStatus(`Error al guardar: ${detail}`)
    }
  }

  const handleReset = async () => {
    if (!canEdit) return
    await deleteConfig()
    setStatus('Restaurado. Recargando...')
    setTimeout(() => window.location.reload(), 400)
  }

  if (loadingConfig) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-xl shadow-slate-200/60">
            <div className="text-sm font-semibold text-slate-500">Cargando configuración desde Appwrite...</div>
          </div>
        </div>
      </div>
    )
  }

  const activeSectionContent = (() => {
    switch (activeSection) {
      case 'brand':
        return (
          <Section icon={<Palette size={18} />} title="Marca e identidad" subtitle="Aquí defines cómo se presenta la empresa frente al cliente." tone="brand">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={labelCls}>Nombre comercial</label><input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} className={inputCls} disabled={!canEdit} /></div>
              <div><label className={labelCls}>Razón social</label><input value={form.legalName} onChange={(e) => set('legalName', e.target.value)} className={inputCls} disabled={!canEdit} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Descripción comercial</label><textarea value={form.companyDescription} onChange={(e) => set('companyDescription', e.target.value)} rows={3} className={`${inputCls} resize-y`} disabled={!canEdit} /></div>
            </div>
            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-sky-100/80 bg-gradient-to-r from-sky-50/90 to-violet-50/80 p-4 shadow-sm">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200/40">
                <Img src={form.branding.companyLogoUrl} alt="" fallback="✨" className="h-full w-full rounded-2xl" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold text-slate-900">{form.companyName || 'Sin nombre'}</div>
                <div className="truncate text-[12px] text-slate-500">{form.legalName || 'Sin razón social'}</div>
                <div className="mt-1 text-[11px] text-sky-700">Vista rápida de marca</div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Logo de la empresa (header)</label>
                <ImageUploader value={form.branding.companyLogoUrl} onChange={(v) => setBrand('companyLogoUrl', v)} fallback="🏢" shape="landscape" disabled={!canEdit} />
                <div className="mt-1 text-[10px] text-slate-400">Se muestra en el header del Dashboard</div>
              </div>
              <div>
                <label className={labelCls}>Avatar por defecto (usuarios)</label>
                <ImageUploader value={form.branding.defaultUserAvatarUrl} onChange={(v) => setBrand('defaultUserAvatarUrl', v)} fallback="👤" shape="circle" disabled={!canEdit} />
                <div className="mt-1 text-[10px] text-slate-400">Para usuarios sin foto personal</div>
              </div>
            </div>
            <div className="mt-5">
              <label className={labelCls}>Color del título (con degradado)</label>
              <div className="mt-3">
                <div className="grid grid-cols-6 gap-2">
                  {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#84cc16', '#14b8a6', '#64748b', '#fbbf24', '#fde047'].map((color) => (
                    <button key={color} onClick={() => setBrand('titleColor', color)} disabled={!canEdit}
                      className={`relative h-10 w-10 rounded-lg border-2 transition-all ${form.branding.titleColor === color ? 'border-slate-900 scale-110 shadow-lg' : 'border-slate-200 hover:border-slate-400 hover:scale-105'} ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
                      {form.branding.titleColor === color && <div className="absolute inset-0 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-white shadow-sm" /></div>}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full border border-slate-300" style={{ background: `linear-gradient(135deg, ${form.branding.titleColor || '#3b82f6'}, ${form.branding.titleColor ? form.branding.titleColor + '80' : '#3b82f680'})` }} />
                      <span className="text-[12px] text-slate-600">{form.branding.titleColor || '#3b82f6'}</span>
                    </div>
                  </div>
                  <input value={form.branding.titleColor} onChange={(e) => setBrand('titleColor', e.target.value)} className={`${inputCls} w-32 text-center`} disabled={!canEdit} placeholder="#3b82f6" />
                </div>
              </div>
            </div>
          </Section>
        )
      case 'owner':
        return (
          <Section icon={<Crown size={18} />} title="Operador principal" subtitle="La persona dueña del sistema y el correo maestro del panel." tone="owner">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
              <ImageUploader value={form.ownerProfile.photoURL} onChange={(v) => setOwner('photoURL', v)} fallback="👑" shape="circle" disabled={!canEdit} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className={labelCls}>Nombre</label><input value={form.ownerProfile.displayName} onChange={(e) => setOwner('displayName', e.target.value)} className={inputCls} disabled={!canEdit} /></div>
                <div><label className={labelCls}>Email operador</label><input value={form.ownerProfile.email} onChange={(e) => setOwner('email', e.target.value)} className={inputCls} disabled={!canEdit} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Email admin supremo</label><input value={form.supremeAdminEmail} onChange={(e) => set('supremeAdminEmail', e.target.value)} className={inputCls} placeholder="dueno@empresa.com" disabled={!canEdit} /></div>
              </div>
            </div>
          </Section>
        )
      case 'branches':
        return (
          <Section icon={<Store size={18} />} title="Sucursales" subtitle={`Define qué sedes existen, cómo se ven y quién las lidera. ${activeCount} activas.`} tone="branches">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <div>
                <div className="text-[13px] font-bold text-slate-900">Gestión de sucursales</div>
                <div className="text-[12px] text-slate-600">Crea nuevas sedes, edita sus datos y elimina las que ya no usarás.</div>
              </div>
              <button onClick={() => setShowNewBranch((p) => !p)} disabled={!canEdit} className={`${btnPrimary} !py-2 !text-[12px]`}><Store size={14} /> Nueva sucursal</button>
            </div>
            {showNewBranch && (
              <div className="mt-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className={labelCls}>Nombre</label><input value={newBranch.name} onChange={(e) => setNewBranch((p) => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Nueva sucursal" disabled={!canEdit} /></div>
                  <div><label className={labelCls}>Slug</label><input value={newBranch.slug} onChange={(e) => setNewBranch((p) => ({ ...p, slug: sanitize(e.target.value) }))} className={inputCls} placeholder="nueva-sucursal" disabled={!canEdit} /></div>
                  <div><label className={labelCls}>Región</label><input value={newBranch.region} onChange={(e) => setNewBranch((p) => ({ ...p, region: e.target.value }))} className={inputCls} placeholder="Región o ciudad" disabled={!canEdit} /></div>
                  <div><label className={labelCls}>Emoji</label><input value={newBranch.icon} onChange={(e) => setNewBranch((p) => ({ ...p, icon: e.target.value }))} className={inputCls} placeholder="🏬" disabled={!canEdit} /></div>
                  <div><label className={labelCls}>Color UI</label><input value={newBranch.color} onChange={(e) => setNewBranch((p) => ({ ...p, color: e.target.value }))} className={inputCls} placeholder="slate, emerald, violet..." disabled={!canEdit} /></div>
                  <div><label className={labelCls}>Encargado</label><input value={newBranch.managerEmail} onChange={(e) => setNewBranch((p) => ({ ...p, managerEmail: e.target.value }))} className={inputCls} placeholder="encargado@empresa.com" disabled={!canEdit} /></div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Imagen de sede</label>
                    <ImageUploader value={newBranch.imageUrl} onChange={(v) => setNewBranch((p) => ({ ...p, imageUrl: v }))} fallback={newBranch.icon || '🏬'} shape="landscape" disabled={!canEdit} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600">
                    <input type="checkbox" checked={newBranch.active} onChange={(e) => setNewBranch((p) => ({ ...p, active: e.target.checked }))} className="accent-slate-700" disabled={!canEdit} /> Activar de inmediato
                  </label>
                  <div className="flex gap-2">
                    <button onClick={addBranch} disabled={!canEdit} className={`${btnPrimary} !text-[12px]`}>Crear</button>
                    <button onClick={() => { setShowNewBranch(false); setNewBranch(createEmptyBranch()) }} className={`${btnSecondary} !text-[12px]`}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
              {form.branches.map((b) => (
                <article key={b.slug} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative flex items-center gap-3 p-3 border-b border-slate-100">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                      {b.imageUrl ? <img src={b.imageUrl} alt={b.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl">{b.icon}</div>}
                      <div className="absolute bottom-0.5 right-0.5 inline-flex items-center justify-center rounded-full bg-white/95 h-5 w-5 text-[12px] shadow-sm">{b.icon}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 font-mono">{b.slug}</span>
                        <label className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold shadow-sm cursor-pointer ${b.active ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          <input type="checkbox" checked={b.active} onChange={(e) => setBranch(b.slug, 'active', e.target.checked)} disabled={!canEdit} className="accent-emerald-500 h-3 w-3" /> {b.active ? 'Activa' : 'Pausada'}
                        </label>
                      </div>
                      <div className="mt-1 truncate text-[15px] sm:text-base font-black text-slate-900">{b.name || 'Sin nombre'}</div>
                      <div className="truncate text-[11px] text-slate-500">{b.region || 'Sin región definida'}</div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="mb-3 grid gap-1.5 grid-cols-3">
                      <div className="rounded-lg bg-slate-50 px-2 py-1.5"><div className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Color</div><div className="mt-0.5 truncate text-[11px] font-bold text-slate-700">{b.color || 'slate'}</div></div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1.5"><div className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Manager</div><div className="mt-0.5 truncate text-[11px] font-bold text-slate-700">{b.managerEmail ? b.managerEmail.split('@')[0] : '—'}</div></div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1.5"><div className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Ruta</div><div className="mt-0.5 truncate text-[11px] font-bold text-slate-700 font-mono">/{b.slug}</div></div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><label className={labelCls}>Nombre</label><input value={b.name} onChange={(e) => setBranch(b.slug, 'name', e.target.value)} className={inputCls} disabled={!canEdit} /></div>
                      <div><label className={labelCls}>Región</label><input value={b.region} onChange={(e) => setBranch(b.slug, 'region', e.target.value)} className={inputCls} disabled={!canEdit} /></div>
                      <div><label className={labelCls}>Emoji</label><input value={b.icon} onChange={(e) => setBranch(b.slug, 'icon', e.target.value)} className={inputCls} disabled={!canEdit} /></div>
                      <div><label className={labelCls}>Color UI</label><input value={b.color} onChange={(e) => setBranch(b.slug, 'color', e.target.value)} className={inputCls} placeholder="slate, emerald, violet..." disabled={!canEdit} /></div>
                      <div className="sm:col-span-2"><label className={labelCls}>Encargado</label><input value={b.managerEmail} onChange={(e) => setBranch(b.slug, 'managerEmail', e.target.value)} className={inputCls} placeholder="email@empresa.com" disabled={!canEdit} /></div>
                      <div className="sm:col-span-2"><label className={labelCls}>Imagen de sede</label><ImageUploader value={b.imageUrl} onChange={(v) => setBranch(b.slug, 'imageUrl', v)} fallback={b.icon} shape="landscape" disabled={!canEdit} hidePreview /></div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                      <button onClick={() => removeBranch(b.slug)} disabled={!canEdit} className={`${btnSecondary} !text-[12px] !text-rose-600 hover:!bg-rose-50`}><Trash2 size={13} /> Eliminar sucursal</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )
      case 'firebase':
        return (
          <Section icon={<Server size={18} />} title="Appwrite del cliente" subtitle="Bloque técnico: conecta esta interfaz con el proyecto real del cliente." tone="firebase">
            <div className={`mb-5 rounded-2xl border p-4 transition ${form.sparkMode ? 'border-amber-300/70 bg-gradient-to-r from-amber-50/90 to-orange-50/80' : 'border-slate-200/60 bg-white/60'}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[13px] font-bold text-slate-900">⚡ Modo Spark (sin Storage)</div>
                  <div className="mt-1 text-[12px] text-slate-600">{form.sparkMode ? 'Activo — Las subidas de imágenes están deshabilitadas. Las fotos se manejan solo con URL externa.' : 'Desactivado — El sistema funciona con todas las funcionalidades.'}</div>
                </div>
                <button type="button" onClick={() => setForm((p) => ({ ...p, sparkMode: !p.sparkMode }))} disabled={!canEdit} className={`relative h-7 w-[52px] shrink-0 rounded-full border transition-colors duration-200 ${form.sparkMode ? 'border-amber-400 bg-amber-400' : 'border-slate-300 bg-slate-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${form.sparkMode ? 'translate-x-[26px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {form.sparkMode && (
                <div className="mt-3 rounded-xl border border-amber-200/70 bg-white/80 px-3 py-2.5 text-[11px] leading-5 text-amber-800">
                  <strong>Sin Storage:</strong> No se pueden subir fotos (logo, avatar, sedes). Usa URLs externas.<br />
                  <strong>Funciona:</strong> Dashboard, POS, informes, inventario, Appwrite, Auth.
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-blue-100/80 bg-blue-50/50 px-4 py-3 mb-4">
              <div className="text-[12px] font-bold text-blue-800">🔒 Credenciales Appwrite (solo lectura)</div>
              <div className="mt-1 text-[11px] text-blue-700">Estos valores se configuran automáticamente desde <code className="bg-blue-100 px-1 rounded">.env.local</code>. No es necesario editarlos manualmente.</div>
            </div>
            <div className="grid gap-3">
              {([['projectId', 'Project ID'], ['apiKey', 'API Key'], ['authDomain', 'Auth Domain'], ['appId', 'App ID'], ['storageBucket', 'Storage Bucket'], ['messagingSenderId', 'Messaging Sender ID'], ['recaptchaV3SiteKey', 'Recaptcha Site Key']] as const).map(([key, label]) => (
                <div key={key}><label className={labelCls}>{label}</label><input value={form.firebase[key] || ''} className={`${inputCls} !bg-slate-50/80 !text-slate-500`} disabled readOnly /></div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border-2 border-red-200/80 bg-gradient-to-r from-red-50/90 to-rose-50/80 p-4">
              <div className="flex items-center gap-2 mb-2"><Trash2 size={16} className="text-red-600" /><div className="text-[13px] font-bold text-red-800">Factory Reset — Borrar todos los datos</div></div>
              <div className="text-[11px] text-red-700/80 mb-3">Elimina <b>toda</b> la data operacional: trabajadores, ventas, stock, reportes, gastos, pagos, sucursales y usuarios. La configuración de Admin Supreme (marca, operador) se mantiene. <b>No se puede deshacer.</b></div>
              <button type="button" disabled={!canEdit} onClick={async () => {
                if (!canEdit) return
                const pass = prompt('⚠️ FACTORY RESET — Escribe "BORRAR TODO" para confirmar:')
                if (pass !== 'BORRAR TODO') { setStatus('Factory Reset cancelado.'); return }
                setStatus('🔄 Borrando datos...')
                try { await deleteConfig(); setStatus('✅ Factory Reset completo. Recargando...'); setTimeout(() => window.location.reload(), 1500) }
                catch (e: any) { setStatus(`❌ Error en Factory Reset: ${e?.message || e}`) }
              }} className={`w-full py-2.5 rounded-xl border-2 border-red-300 bg-red-100/80 text-red-800 text-[12px] font-bold transition ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'hover:bg-red-200/90 hover:border-red-400 cursor-pointer'}`}>🗑️ Factory Reset</button>
            </div>
          </Section>
        )
      case 'users':
        return (
          <Section icon={<Users size={18} />} title="Usuarios y roles" subtitle={`Quién puede entrar, qué rol tiene y qué sedes puede ver. ${users.length} usuarios.`} tone="users">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-semibold text-slate-500">{canEdit ? 'Puedes gestionar usuarios.' : 'Modo lectura.'}</span>
              <button onClick={() => setShowNewUser(!showNewUser)} disabled={!canEdit} className={`${btnPrimary} !py-1.5 !text-[12px]`}><UserPlus size={14} /> Nuevo</button>
            </div>
            {showNewUser && (
              <div className="mt-4 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm p-4 space-y-3">
                <ImageUploader value={newUser.photoURL || ''} onChange={(v) => setNewUser((p) => ({ ...p, photoURL: v }))} fallback="👤" shape="circle" disabled={!canEdit} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className={labelCls}>Email</label><input value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="user@empresa.com" /></div>
                  <div><label className={labelCls}>Nombre</label><input value={newUser.displayName} onChange={(e) => setNewUser((p) => ({ ...p, displayName: e.target.value }))} className={inputCls} /></div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Rol</label>
                    <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value as AppRole }))} className={inputCls}>
                      {APP_ROLES.filter((r) => r !== 'admin_supremo').map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Sucursales</label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {form.branches.map((b) => {
                      const on = (newUser.branchSlugs || []).includes(b.slug)
                      return <label key={b.slug} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${pill(on)}`}>
                        <input type="checkbox" checked={on} onChange={() => { setNewUser((p) => { const s = new Set(p.branchSlugs || []); s.has(b.slug) ? s.delete(b.slug) : s.add(b.slug); return { ...p, branchSlugs: [...s] } }) }} className="accent-sky-500" /> {b.name}
                      </label>
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { await saveUser(newUser); setNewUser({ email: '', displayName: '', photoURL: form.branding.defaultUserAvatarUrl, role: 'trabajador', branchSlugs: [] }); setShowNewUser(false) }} disabled={!canEdit || !newUser.email.trim()} className={`${btnPrimary} !text-[12px]`}>Crear</button>
                  <button onClick={() => setShowNewUser(false)} className={`${btnSecondary} !text-[12px]`}>Cancelar</button>
                </div>
              </div>
            )}
            <div className="mt-4 space-y-3">
              {loadingUsers ? <div className="py-6 text-center text-[13px] text-slate-400">Cargando usuarios...</div>
              : users.length === 0 ? <div className="py-6 text-center text-[13px] text-slate-400">Sin usuarios todavía.</div>
              : users.map((u) => {
                const isSup = u.email === (supremeEmail || savedSupremeEmail)
                return (
                  <div key={u.email} className="rounded-2xl bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="grid gap-4 p-4 sm:grid-cols-[auto_1fr]">
                      <ImageUploader value={u.photoURL || ''} onChange={(v) => setUsers((p) => p.map((x) => x.email === u.email ? { ...x, photoURL: v } : x))} fallback="👤" shape="circle" disabled={!canEdit} />
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        <div><label className={labelCls}>Nombre</label><input value={u.displayName} onChange={(e) => setUsers((p) => p.map((x) => x.email === u.email ? { ...x, displayName: e.target.value } : x))} className={inputCls} disabled={!canEdit} /></div>
                        <div><label className={labelCls}>Email</label><input value={u.email} className={inputCls} disabled /></div>
                        <div className="sm:col-span-2">
                          <label className={labelCls}>Rol</label>
                          <select value={isSup ? 'admin_supremo' : u.role} onChange={(e) => setUsers((p) => p.map((x) => x.email === u.email ? { ...x, role: e.target.value as AppRole } : x))} className={inputCls} disabled={!canEdit || isSup}>
                            {(isSup ? APP_ROLES : APP_ROLES.filter((r) => r !== 'admin_supremo')).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span>
                            {isSup && <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-50/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">Protegido</span>}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelCls}>Sucursales</label>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {form.branches.map((b) => {
                              const on = (u.branchSlugs || []).includes(b.slug)
                              return <label key={b.slug} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${pill(on)}`}>
                                <input type="checkbox" checked={on} onChange={() => { setUsers((p) => p.map((x) => { if (x.email !== u.email) return x; const s = new Set(x.branchSlugs || []); s.has(b.slug) ? s.delete(b.slug) : s.add(b.slug); return { ...x, branchSlugs: [...s] } })) }} disabled={!canEdit} className="accent-sky-500" /> {b.name}
                              </label>
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t border-white/40 px-4 py-3">
                      <button onClick={() => saveUser(u)} disabled={!canEdit || savingUser === u.email} className={`${btnPrimary} !py-1.5 !text-[11px]`}><Save size={13} /> {savingUser === u.email ? 'Guardando...' : 'Guardar'}</button>
                      <button onClick={() => deleteUser(u.email)} disabled={!canEdit || isSup} className={`${btnSecondary} !py-1.5 !text-[11px] !text-rose-600 hover:!bg-rose-50`}><Trash2 size={13} /> Eliminar</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>
        )
      case 'checklist':
        return (
          <Section icon={<Shield size={18} />} title="Checklist comercial" subtitle="Resumen final para dejar el cliente listo y entendible." defaultOpen={false} tone="checklist">
            <ol className="space-y-2 text-[13px] leading-6 text-slate-600 list-decimal list-inside">
              <li>Configurar proyecto Appwrite del cliente y pegar aquí sus credenciales.</li>
              <li>Subir logo, icono, avatar y fotos de sede via URL externa.</li>
              <li>Crear usuarios en <code className="text-[12px] bg-slate-100 px-1 rounded">erp_users</code> con roles y sedes asignadas.</li>
              <li>Guardar y recargar para aplicar toda la identidad.</li>
              <li>Verificar conexión con colecciones de Appwrite.</li>
            </ol>
          </Section>
        )
    }
  })()

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(217,70,239,0.10),_transparent_18%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.10),_transparent_20%),linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(248,250,252,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(148,163,184,0.18)_0.8px,transparent_0.8px)] [background-size:24px_24px]" />
      <AmbientParticles />
      <div className="relative w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
        {/* HERO */}
        <header className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white/95 via-sky-50/90 to-violet-50/85 backdrop-blur-2xl shadow-[0_30px_80px_-40px_rgba(59,130,246,0.35)]">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/30 to-cyan-300/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gradient-to-br from-violet-400/25 to-fuchsia-300/15 blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1.5s' }} />
          <div className="pointer-events-none absolute right-1/4 top-0 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '0.5s' }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-96 bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.22),_transparent_55%)] lg:block" />
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(148,163,184,0.25)_0.8px,transparent_0.8px)] [background-size:28px_28px]" />
          <AmbientParticles />
          <div className="relative px-4 py-5 sm:px-8 sm:py-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-white/80 px-2.5 py-0.5 text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm">
                  <div className="relative"><div className="absolute inset-0 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-white shadow-sm"></div></div><Waypoints size={11} /> Admin Supreme</div>
                </div>
                <h1 className="mt-2.5 text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">Panel de control multiempresa</h1>
                <p className="mt-1.5 max-w-2xl text-[11.5px] sm:text-[13px] leading-5 sm:leading-6 text-slate-600">Marca, sedes, usuarios y Appwrite en un solo lugar.</p>
              </div>
              <div className="hidden sm:block rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl p-3 shadow-md shadow-black/[0.05] min-w-[180px]">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-200"><Img src={form.branding.companyLogoUrl} alt="" fallback="🏢" className="h-full w-full rounded-xl" /></div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center"><CheckCircle2 size={8} className="text-white" strokeWidth={3} /></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[8.5px] font-black uppercase tracking-[0.18em] text-slate-400">Empresa</div>
                    <div className="mt-0.5 truncate text-[12px] font-extrabold text-slate-900">{form.companyName || 'Sin nombre'}</div>
                    <div className="text-[9.5px] text-emerald-600 font-bold">● En línea</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-5 grid gap-2 grid-cols-2 lg:grid-cols-4">
              <Stat label="Proyecto" value={form.firebase.projectId || 'donbalatoivan'} icon={<Server size={14} />} gradient="from-blue-500 to-indigo-600" />
              <Stat label="Sedes activas" value={`${activeCount}/${form.branches.length}`} icon={<Store size={14} />} gradient="from-emerald-500 to-teal-600" />
              <Stat label="Usuarios" value={`${users.length}`} icon={<Users size={14} />} gradient="from-fuchsia-500 to-violet-600" />
              <Stat label="Tu rol" value={ROLE_LABELS[myRole]} icon={<Crown size={14} />} gradient="from-amber-500 to-orange-600" />
            </div>
          </div>
        </header>

        {/* TOOLBAR */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Link href="/erp-dashboard" className="inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur-sm px-3.5 py-2 text-[12px] font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"><ArrowLeft size={14} /> Dashboard</Link>
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur-sm px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${canEdit ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} /> {canEdit ? 'Modo edición' : 'Modo lectura'}
          </div>
          {status && <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/70 bg-emerald-50/70 px-3 py-2 text-[12px] font-semibold text-emerald-700 backdrop-blur-sm shadow-sm"><CheckCircle2 size={14} /> {status}</span>}
        </div>

        {/* Nav mobile */}
        <div className="mt-4 xl:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {sectionItems.map((item) => {
              const active = item.key === activeSection
              const style = SECTION_STYLES[item.key]
              return <button key={item.key} type="button" onClick={() => setActiveSection(item.key)} className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-all whitespace-nowrap ${active ? `${style.icon} shadow-md` : 'border border-slate-200/70 bg-white/70 text-slate-600 backdrop-blur-sm shadow-sm'}`}>
                <span className={`${active ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span> {item.label}
              </button>
            })}
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={handleSave} disabled={!canEdit} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-3 py-2 text-[12px] font-bold text-white shadow-md shadow-indigo-500/25 transition active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"><Save size={13} /> Guardar cambios</button>
            <button onClick={handleReset} disabled={!canEdit} title="Restaurar" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-slate-600 shadow-sm transition active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"><RefreshCw size={13} /></button>
          </div>
        </div>

        <div className="mt-4 xl:mt-6 grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar desktop */}
          <aside className="hidden xl:block xl:sticky xl:top-4 xl:self-start">
            <div className={`rounded-[28px] ${glass} p-4 overflow-hidden relative`}>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-400/15 to-sky-400/10 blur-2xl" />
              <div className="relative flex items-center gap-3 border-b border-slate-200/60 px-1 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20"><Waypoints size={18} /></div>
                <div className="min-w-0"><div className="text-[14px] font-black text-slate-900 tracking-tight">Admin Supreme</div><div className="text-[10.5px] text-slate-500 font-medium">Control panel maestro</div></div>
              </div>
              <nav className="relative mt-4 space-y-1.5">
                {sectionItems.map((item) => {
                  const active = item.key === activeSection
                  const style = SECTION_STYLES[item.key]
                  return <button key={item.key} type="button" onClick={() => setActiveSection(item.key)} className={`group relative w-full rounded-2xl px-2.5 py-2.5 text-left transition-all duration-200 overflow-hidden ${active ? 'bg-white/95 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.25)] border border-white ring-1 ring-indigo-200/50' : 'border border-transparent hover:bg-white/50 hover:border-white/60'}`}>
                    {active && <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b ${style.strip}`} />}
                    <div className="relative flex items-center gap-2.5 pl-1.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${active ? `${style.icon} shadow-md` : 'bg-slate-100/80 text-slate-600 group-hover:bg-white'}`}>{item.icon}</div>
                      <div className="min-w-0 flex-1"><div className={`text-[12.5px] font-bold truncate ${active ? 'text-slate-900' : 'text-slate-700'}`}>{item.label}</div><div className={`truncate text-[10.5px] ${active ? 'text-slate-500' : 'text-slate-400'}`}>{item.detail}</div></div>
                      {active && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 animate-pulse" />}
                    </div>
                  </button>
                })}
              </nav>
              <div className="relative mt-4 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white/80 to-slate-50/60 backdrop-blur-sm p-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-2"><span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Estado general</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between"><span className="text-slate-500">Sedes activas</span><span className="font-extrabold text-emerald-600 tabular-nums">{activeCount}/{form.branches.length}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">Usuarios</span><span className="font-extrabold text-fuchsia-600 tabular-nums">{users.length}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">Proyecto</span><span className="font-extrabold text-blue-600 truncate max-w-[110px]" title={form.firebase.projectId || 'donbalatoivan'}>{form.firebase.projectId || 'donbalatoivan'}</span></div>
                </div>
              </div>
              <div className="relative mt-3 flex gap-2">
                <button onClick={handleSave} disabled={!canEdit} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-3 py-2.5 text-[12px] font-bold text-white shadow-md shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"><Save size={13} /> Guardar</button>
                <button onClick={handleReset} disabled={!canEdit} title="Restaurar" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-900 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"><RefreshCw size={13} /></button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className={`rounded-2xl sm:rounded-[30px] ${glass} overflow-hidden relative`}>
            <div className={`h-1 w-full bg-gradient-to-r ${SECTION_STYLES[activeSection].strip}`} />
            <div className="relative border-b border-slate-200/60 px-4 py-3.5 sm:px-6 sm:py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl shadow-lg shadow-black/[0.08] ${SECTION_STYLES[activeSection].icon}`}>{activeSectionMeta.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className={`inline-flex rounded-full border px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] ${SECTION_STYLES[activeSection].badge}`}>{activeSectionMeta.label}</div>
                    <h2 className="mt-1 text-base sm:text-2xl font-black tracking-tight text-slate-900 truncate">{activeSectionMeta.detail}</h2>
                    <p className="hidden sm:block mt-0.5 text-[12px] leading-5 text-slate-500">Edita este bloque de forma aislada — cada sección guarda su propia parte del negocio.</p>
                  </div>
                </div>
                <div className="hidden md:block rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 text-right shadow-sm backdrop-blur-sm shrink-0">
                  <div className="text-[8.5px] font-black uppercase tracking-[0.2em] text-slate-400">Dato rápido</div>
                  <div className="mt-0.5 text-[12px] font-extrabold text-slate-900 truncate max-w-[180px]" title={String(activeSectionMeta.badge)}>{activeSectionMeta.badge}</div>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-5 lg:p-6">{activeSectionContent}</div>
          </section>
        </div>
      </div>
      <AdminOnboarding open={onboardingOpen} obCompanyName={obCompanyName} setObCompanyName={setObCompanyName} obOwnerName={obOwnerName} setObOwnerName={setObOwnerName} obBranchName={obBranchName} setObBranchName={setObBranchName} obBranchSlug={obBranchSlug} setObBranchSlug={setObBranchSlug} obBranchImage={obBranchImage} setObBranchImage={setObBranchImage} obSparkMode={obSparkMode} setObSparkMode={setObSparkMode} obLogoUrl={obLogoUrl} setObLogoUrl={setObLogoUrl} obAvatarUrl={obAvatarUrl} setObAvatarUrl={setObAvatarUrl} obGradient={obGradient} setObGradient={setObGradient} obWorkerName={obWorkerName} setObWorkerName={setObWorkerName} obWorkerNac={obWorkerNac} setObWorkerNac={setObWorkerNac} obWorkerGenero={obWorkerGenero} setObWorkerGenero={setObWorkerGenero} onFinish={submitOnboarding} />
    </div>
  )
}
