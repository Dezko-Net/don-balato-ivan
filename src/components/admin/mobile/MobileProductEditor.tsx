'use client';

import { useRef, useState } from 'react';
import { ID } from 'appwrite';
import {
  ArrowLeft, ChevronDown, ChevronUp, Camera, Loader2, X, Sparkles,
  ImagePlus, Check, Infinity as InfinityIcon,
} from 'lucide-react';
import { getServices, getAppwriteConfig, MEDIA_BUCKET_ID } from '@/lib/appwrite';
import { generateProductTitle, generateProductDescription } from '@/lib/aiAdmin';
import { Product, Category, Subcategory } from '@/types/admin';

export type ProductModalData = Partial<Product> & {
  _barcode?: string; _sku?: string; _details?: string; _usage?: string; _ingredients?: string;
};
export type ProductModalState = { mode: 'add' | 'edit'; data: ProductModalData };
type AiLoading = 'title' | 'desc' | 'tabs' | 'all' | null;

interface Props {
  modal: ProductModalState;
  setModal: React.Dispatch<React.SetStateAction<ProductModalState | null>>;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  categories: Category[];
  subcategories: Subcategory[];
  aiLoading: AiLoading;
  setAiLoading: (v: AiLoading) => void;
  aiTitles: string[];
  setAiTitles: (v: string[]) => void;
  onGenerateAll: () => void;
  onGenerateTabs: () => void;
}

/* ── Slot de imagen grande: tocar para subir/tomar foto ─────────────── */
function MobileImageSlot({ label, value, onChange, big }: {
  label: string; value: string; onChange: (url: string) => void; big?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const { storage } = getServices();
      const { endpoint, projectId } = getAppwriteConfig();
      const fileId = ID.unique();
      await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
      onChange(`${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}`);
    } catch (e: any) {
      alert('Error al subir imagen: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`relative w-full rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center gap-1.5 transition active:scale-[0.98] ${
          big ? 'h-52' : 'h-28'
        } ${value ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-gray-50'}`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 text-[11px] font-semibold bg-black/55 text-white px-2.5 py-1 rounded-full">
              Tocar para cambiar
            </span>
          </>
        ) : uploading ? (
          <>
            <Loader2 className="w-7 h-7 text-gray-400 animate-spin" />
            <span className="text-xs text-gray-500 font-medium">Subiendo...</span>
          </>
        ) : (
          <>
            {big ? <Camera className="w-9 h-9 text-gray-400" /> : <ImagePlus className="w-6 h-6 text-gray-400" />}
            <span className={`font-semibold text-gray-600 ${big ? 'text-sm' : 'text-[11px]'}`}>{label}</span>
            {big && <span className="text-[11px] text-gray-400">Toca para tomar foto o elegir de galería</span>}
          </>
        )}
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500 active:scale-95 transition"
        >
          <X className="w-3.5 h-3.5" /> Quitar imagen
        </button>
      )}
    </div>
  );
}

/* ── Editor móvil: wizard de 4 pasos ────────────────────────────────── */
const STEPS = [
  { label: 'Fotos' },
  { label: 'Info' },
  { label: 'Precios' },
  { label: 'Categoría' },
];

const inputCls = 'w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-gray-800';
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

export default function MobileProductEditor({
  modal, setModal, onClose, onSave, isSaving,
  categories, subcategories,
  aiLoading, setAiLoading, aiTitles, setAiTitles,
  onGenerateAll, onGenerateTabs,
}: Props) {
  const [step, setStep] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);
  const d = modal.data;

  const update = (patch: Partial<ProductModalData>) =>
    setModal(m => m ? { ...m, data: { ...m.data, ...patch } } : m);

  const imageUrls = [d.IMAGEURL, d.IMAGEURL2, d.IMAGEURL3]
    .map(u => String(u || '').trim()).filter(Boolean).slice(0, 3);

  /* IA: sugerir títulos */
  const suggestTitles = async () => {
    setAiLoading('title'); setAiTitles([]);
    try {
      const catName = categories.find(c => c.$id === d.CATEGORYID)?.name || '';
      const titles = await generateProductTitle(d.DESCRIPTION || d.NAME || '', catName, imageUrls, d.NAME || '');
      setAiTitles(titles);
    } catch (e: any) { alert(e.message); }
    finally { setAiLoading(null); }
  };

  /* IA: generar descripción */
  const generateDesc = async () => {
    setAiLoading('desc');
    try {
      const catName = categories.find(c => c.$id === d.CATEGORYID)?.name || '';
      const desc = await generateProductDescription(d.NAME || '', catName, d.DESCRIPTION || '', imageUrls);
      update({ DESCRIPTION: desc });
    } catch (e: any) { alert(e.message); }
    finally { setAiLoading(null); }
  };

  /* Validación ligera por paso antes de avanzar */
  const goNext = () => {
    if (step === 1 && !d.NAME?.trim()) { alert('Escribe el nombre del producto para continuar'); return; }
    if (step === 2 && (!d.PRICE || Number(d.PRICE) <= 0)) {
      alert('Ingresa el Precio para continuar'); return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0 });
  };
  const goBack = () => { setStep(s => Math.max(s - 1, 0)); window.scrollTo({ top: 0 }); };

  const margin = d.COST && d.PRICE
    ? Math.round(((Number(d.PRICE) - Number(d.COST)) / Number(d.PRICE)) * 100)
    : null;

  return (
    <div className="md:hidden pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onClose}
          className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm active:scale-95 transition shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {modal.mode === 'add' ? 'Nuevo Producto' : 'Editar Producto'}
          </h1>
          <p className="text-xs text-gray-500">Paso {step + 1} de {STEPS.length} · {STEPS[step].label}</p>
        </div>
        <button onClick={onSave} disabled={isSaving}
          className="px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold shadow-sm disabled:opacity-60 active:scale-95 transition shrink-0 flex items-center gap-1.5">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Guardar
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="flex gap-1.5 mb-5">
        {STEPS.map((s, i) => (
          <button key={s.label} onClick={() => { setStep(i); window.scrollTo({ top: 0 }); }}
            className="flex-1 flex flex-col items-center gap-1">
            <span className={`h-1.5 w-full rounded-full transition ${i <= step ? 'bg-gray-900' : 'bg-gray-200'}`} />
            <span className={`text-[10px] font-semibold ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── PASO 1: FOTOS ── */}
      {step === 0 && (
        <div className="space-y-4">
          <MobileImageSlot big label="Foto principal" value={d.IMAGEURL || ''} onChange={v => update({ IMAGEURL: v })} />
          <div className="grid grid-cols-2 gap-3">
            <MobileImageSlot label="Foto 2 (opcional)" value={d.IMAGEURL2 || ''} onChange={v => update({ IMAGEURL2: v })} />
            <MobileImageSlot label="Foto 3 (opcional)" value={d.IMAGEURL3 || ''} onChange={v => update({ IMAGEURL3: v })} />
          </div>
          <p className="text-xs text-gray-400 text-center">Una buena foto ayuda a vender más 📸</p>
        </div>
      )}

      {/* ── PASO 2: INFORMACIÓN ── */}
      {step === 1 && (
        <div className="space-y-5">
          <button type="button" onClick={onGenerateAll} disabled={aiLoading === 'all'}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white text-sm font-bold shadow-lg active:scale-[0.98] transition disabled:opacity-50">
            <Sparkles className="w-4 h-4" /> {aiLoading === 'all' ? 'Generando todo con IA...' : '✨ Generar todo con IA'}
          </button>
          <div>
            <label className={labelCls}>Nombre del producto <span className="text-red-500">*</span></label>
            <input
              value={d.NAME || ''}
              onChange={e => update({ NAME: e.target.value })}
              placeholder="Ej: Brillo labial Honey Crystal"
              className={inputCls}
            />
            <button type="button" onClick={suggestTitles} disabled={aiLoading === 'title' || aiLoading === 'all'}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 active:scale-[0.98] transition disabled:opacity-50">
              <Sparkles className="w-4 h-4" /> {aiLoading === 'title' ? 'Generando...' : 'Sugerir nombre con IA'}
            </button>
            {aiTitles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {aiTitles.map((t, i) => (
                  <button key={i} type="button"
                    onClick={() => { update({ NAME: t }); setAiTitles([]); }}
                    className="text-xs px-3 py-2 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 active:bg-gray-100 transition">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              value={d.DESCRIPTION || ''}
              onChange={e => update({ DESCRIPTION: e.target.value })}
              rows={5}
              placeholder="Describe tu producto..."
              className={`${inputCls} resize-none`}
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={onGenerateAll} disabled={aiLoading === 'all'}
                className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-gray-900 text-white text-xs font-semibold active:scale-[0.98] transition disabled:opacity-50">
                <Sparkles className="w-3.5 h-3.5" /> {aiLoading === 'all' ? 'Autocompletando...' : '✨ Autocompletar todo'}
              </button>
              <button type="button" onClick={generateDesc} disabled={aiLoading === 'desc' || aiLoading === 'all'}
                className="flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-800 active:scale-[0.98] transition disabled:opacity-50">
                <Sparkles className="w-3.5 h-3.5" /> {aiLoading === 'desc' ? 'Generando...' : 'Generar con IA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 3: PRECIOS Y STOCK ── */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <div>
              <label className={labelCls}>Precio (CLP) <span className="text-red-500">*</span></label>
              <input
                type="number" inputMode="numeric"
                value={d.PRICE ?? ''}
                onChange={e => update({ PRICE: Number(e.target.value), WHOLESALEPRICE: Number(e.target.value) })}
                placeholder="Ej: 2990"
                className={`${inputCls} text-lg font-bold ${!d.PRICE ? 'border-red-300 bg-red-50' : ''}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-700 mb-1.5">Precio Catálogo ✨</label>
              <input
                type="number" inputMode="numeric"
                value={d.CATALOGPRICE ?? d.PRICE ?? ''}
                onChange={e => update({ CATALOGPRICE: Number(e.target.value) })}
                placeholder="Mismo precio o especial"
                className="w-full px-3 py-3 border border-amber-300 bg-amber-50/50 rounded-2xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Costo (lo que pagas)</label>
                <input
                  type="number" inputMode="numeric"
                  value={d.COST ?? ''}
                  onChange={e => update({ COST: Number(e.target.value) })}
                  className={inputCls}
                />
                {margin !== null && (
                  <p className={`text-[11px] font-semibold mt-1 ${margin >= 30 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    Margen: {margin}%
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className={labelCls}>Stock disponible</label>
              <div className="flex gap-2">
                <input
                  type="number" inputMode="numeric"
                  value={d.STOCK ?? ''}
                  onChange={e => update({ STOCK: Number(e.target.value) })}
                  placeholder="0"
                  className={`${inputCls} flex-1 text-lg font-bold`}
                />
                <button type="button" onClick={() => update({ STOCK: 99999 })}
                  className="flex items-center gap-1.5 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 active:scale-95 transition shrink-0">
                  <InfinityIcon className="w-4 h-4" /> Ilimitado
                </button>
              </div>
              {Number(d.STOCK) === 0 && (
                <p className="text-[11px] font-semibold text-red-500 mt-1.5">⚠️ Con stock 0 el producto aparecerá agotado</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 4: CATEGORÍA Y EXTRAS ── */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            {([
              {
                label: 'Categoría', value: d.CATEGORYID || '', disabled: false,
                onChange: (v: string) => update({ CATEGORYID: v, SUBCATEGORYID: '' }),
                options: categories.map(c => ({ id: c.$id, name: c.name })), empty: 'Sin categoría',
              },
              {
                label: 'Subcategoría (opcional)', value: d.SUBCATEGORYID || '', disabled: !d.CATEGORYID,
                onChange: (v: string) => update({ SUBCATEGORYID: v }),
                options: subcategories.filter(s => s.categoryId === d.CATEGORYID && !s.parentSubcategoryId).map(s => ({ id: s.$id, name: s.name })),
                empty: 'Ninguna',
              },
            ] as const).map((sel, i) => (
              <div key={i}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{sel.label}</label>
                <div className="relative">
                  <select
                    value={sel.value}
                    onChange={e => sel.onChange(e.target.value)}
                    disabled={sel.disabled}
                    className={`${inputCls} appearance-none pr-10 disabled:opacity-50 disabled:bg-gray-100`}
                  >
                    <option value="">{sel.empty}</option>
                    {sel.options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">SKU (opcional)</label>
                <input value={d._sku ?? ''} onChange={e => update({ _sku: e.target.value })}
                  placeholder="Código interno" className={`${inputCls} font-mono`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cód. barras (opcional)</label>
                <input value={d._barcode ?? ''} onChange={e => update({ _barcode: e.target.value })}
                  placeholder="EAN / UPC" inputMode="numeric" className={`${inputCls} font-mono`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (separados por coma)</label>
              <input
                value={Array.isArray(d.TAGS) ? d.TAGS.join(', ') : (d.TAGS || '')}
                onChange={e => update({ TAGS: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className={inputCls}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={!!d.DISABLE_DISCOUNTS}
                onChange={e => update({ DISABLE_DISCOUNTS: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-800"
              />
              <span className="text-sm font-medium text-gray-700">Bloquear descuentos en este producto</span>
            </label>
          </div>

          {/* Ficha técnica colapsable */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button type="button" onClick={() => setSpecsOpen(v => !v)}
              className="w-full flex items-center justify-between p-4 text-left active:bg-gray-50 transition">
              <div>
                <p className="text-sm font-semibold text-gray-800">Ficha técnica <span className="text-gray-400 font-normal">(opcional)</span></p>
                <p className="text-[11px] text-gray-400 mt-0.5">Detalles, modo de uso e ingredientes</p>
              </div>
              {specsOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {specsOpen && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                <button type="button" onClick={onGenerateTabs} disabled={aiLoading === 'tabs' || aiLoading === 'all'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-900 text-white text-sm font-semibold active:scale-[0.98] transition disabled:opacity-50">
                  <Sparkles className="w-4 h-4" /> {aiLoading === 'tabs' ? 'Generando ficha...' : '✨ Generar ficha con IA'}
                </button>
                {([
                  { label: 'Detalles del producto', field: '_details' as const, ph: 'Ej: Material: 100% Algodón\nDimensiones: 15cm x 10cm' },
                  { label: 'Modo de uso', field: '_usage' as const, ph: 'Ej: Aplicar sobre la piel limpia...' },
                  { label: 'Ingredientes', field: '_ingredients' as const, ph: 'Ej: Aqua, Glycerin, Niacinamide...' },
                ]).map(t => (
                  <div key={t.field}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.label}</label>
                    <textarea
                      rows={3}
                      value={d[t.field] || ''}
                      onChange={e => update({ [t.field]: e.target.value })}
                      placeholder={t.ph}
                      className={`${inputCls} resize-none text-sm`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barra inferior fija */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-4 pt-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        <div className="flex gap-3 max-w-lg mx-auto">
          {step > 0 ? (
            <button onClick={goBack}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 active:scale-[0.98] transition">
              ← Atrás
            </button>
          ) : (
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 active:scale-[0.98] transition">
              Cancelar
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={goNext}
              className="flex-[2] py-3.5 rounded-2xl bg-gray-900 text-white text-base font-bold shadow-lg active:scale-[0.98] transition">
              Siguiente →
            </button>
          ) : (
            <button onClick={onSave} disabled={isSaving}
              className="flex-[2] py-3.5 rounded-2xl bg-gray-900 text-white text-base font-bold shadow-lg active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2">
              {isSaving
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
                : <><Check className="w-5 h-5" /> {modal.mode === 'add' ? 'Crear Producto' : 'Guardar Cambios'}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
