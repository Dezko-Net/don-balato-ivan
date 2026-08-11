'use client';

import { useRef, useState, useEffect } from 'react';
import { ID } from 'appwrite';
import {
  ArrowLeft, ChevronDown, ChevronUp, Camera, Loader2, X, Sparkles,
  Check, Infinity as InfinityIcon, Search, Edit3,
} from 'lucide-react';
import { getServices, getAppwriteConfig, MEDIA_BUCKET_ID } from '@/lib/appwrite';
import { generateProductTitle, generateProductDescription } from '@/lib/aiAdmin';
import { Product, Category, Subcategory } from '@/types/admin';
import PriceInput from '@/components/PriceInput';

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
  aiAutoEnhance?: boolean;
}

/* ── Slot de imagen grande: tocar para subir/tomar foto ─────────────── */
function MobilePhotoUploader({ imageUrls, onChange }: {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [similarImages, setSimilarImages] = useState<{ url: string; score?: number }[]>([]);
  const [bestGuess, setBestGuess] = useState<string[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [selectedFromAI, setSelectedFromAI] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const [aiRefUrl, setAiRefUrl] = useState<string | null>(null);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());

  const uploadToAppwrite = async (file: File): Promise<string> => {
    const { storage } = getServices();
    const { endpoint, projectId } = getAppwriteConfig();
    const fileId = ID.unique();
    await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
    return `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
  };

  const handleFiles = async (files: FileList) => {
    const remaining = 3 - imageUrls.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of toUpload) {
        newUrls.push(await uploadToAppwrite(file));
      }
      onChange([...imageUrls, ...newUrls].slice(0, 3));
    } catch (e: any) {
      alert('Error al subir imagen: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => {
    onChange(imageUrls.filter((_, i) => i !== idx));
  };

  // Subir 1 foto de referencia para la IA
  const handleAiRefFile = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToAppwrite(file);
      setAiRefUrl(url);
      // Auto-buscar al subir
      doSearch(url);
    } catch (e: any) {
      alert('Error al subir imagen: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const doSearch = async (refUrl: string) => {
    setSearching(true);
    setShowSimilar(true);
    setSimilarImages([]);
    setBestGuess([]);
    setSelectedFromAI([]);
    setBrokenUrls(new Set());
    try {
      const res = await fetch('/api/vision-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: refUrl }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSimilarImages(data.images || []);
      setBestGuess(data.bestGuess || []);
    } catch (e: any) {
      alert('Error al buscar: ' + e.message);
      setShowSimilar(false);
    } finally {
      setSearching(false);
    }
  };

  const toggleSelectAI = (url: string) => {
    setSelectedFromAI(prev => {
      if (prev.includes(url)) return prev.filter(u => u !== url);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, url];
    });
  };

  const confirmAISelection = async () => {
    if (selectedFromAI.length === 0) {
      setShowSimilar(false);
      return;
    }
    setImporting(true);
    try {
      const newUrls: string[] = [];
      for (const url of selectedFromAI) {
        // Usar proxy del servidor para evitar CORS
        const res = await fetch(`/api/vision-similar?url=${encodeURIComponent(url)}`);
        if (!res.ok) continue;
        const blob = await res.blob();
        const file = new File([blob], `ai-${Date.now()}-${Math.random()}.jpg`, { type: blob.type || 'image/jpeg' });
        newUrls.push(await uploadToAppwrite(file));
      }
      if (newUrls.length === 0) {
        alert('No se pudieron importar las imágenes');
        return;
      }
      // Lógica de reemplazo:
      // Si seleccionas 3 de la IA → reemplaza todo (la referencia se va)
      // Si seleccionas 1 o 2 → la referencia se queda + las de la IA
      if (aiRefUrl && newUrls.length >= 3) {
        // Reemplazo total
        onChange(newUrls.slice(0, 3));
      } else if (aiRefUrl) {
        // Referencia + selección de IA (max 3 total)
        const combined = [aiRefUrl, ...newUrls].slice(0, 3);
        onChange(combined);
      } else {
        onChange(newUrls.slice(0, 3));
      }
      setShowSimilar(false);
      setAiRefUrl(null);
      setSelectedFromAI([]);
    } catch (e: any) {
      alert('Error al importar: ' + e.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
      />
      <input
        ref={aiInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { if (e.target.files?.length) handleAiRefFile(e.target.files); e.target.value = ''; }}
      />

      {/* Fotos actuales */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
              <img src={url} alt={`Foto ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-90 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-black/55 text-white px-1.5 py-0.5 rounded-full">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dos opciones: Manual o IA */}
      {imageUrls.length < 3 && (
        <div className="grid grid-cols-2 gap-3">
          {/* Manual */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-36 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1.5 transition active:scale-[0.98] disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-7 h-7 text-gray-400 animate-spin" />
                <span className="text-[11px] text-gray-500 font-medium">Subiendo...</span>
              </>
            ) : (
              <>
                <Camera className="w-7 h-7 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">Añadir fotos</span>
                <span className="text-[10px] text-gray-400">Manual, máx 3</span>
              </>
            )}
          </button>

          {/* IA - Google Lens */}
          <button
            type="button"
            onClick={() => {
              if (imageUrls.length > 0) {
                setAiRefUrl(imageUrls[0]);
                doSearch(imageUrls[0]);
              } else {
                aiInputRef.current?.click();
              }
            }}
            disabled={uploading || searching}
            className="h-36 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 flex flex-col items-center justify-center gap-1.5 transition active:scale-[0.98] disabled:opacity-50"
          >
            {searching ? (
              <>
                <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
                <span className="text-[11px] text-indigo-500 font-medium">Buscando...</span>
              </>
            ) : (
              <>
                <Search className="w-7 h-7 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-600">Buscar con IA</span>
                <span className="text-[10px] text-indigo-400">1 ref → 20 opciones</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Cortina inferior con resultados de Google Lens */}
      {showSimilar && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => !importing && setShowSimilar(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto p-4 space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between sticky top-0 bg-white pb-2 border-b border-gray-100 z-10">
              <div>
                <p className="text-sm font-bold text-gray-900">Fotos similares ({similarImages.length})</p>
                {bestGuess.length > 0 && (
                  <p className="text-[11px] text-gray-500">Google: {bestGuess.join(' · ')}</p>
                )}
              </div>
              <button onClick={() => !importing && setShowSimilar(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Foto de referencia */}
            {aiRefUrl && (
              <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-2">
                <img src={aiRefUrl} alt="Referencia" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-indigo-700">Foto de referencia</p>
                  <p className="text-[10px] text-indigo-400">Se mantiene si eliges 1-2 · Se reemplaza si eliges 3</p>
                </div>
              </div>
            )}

            {searching ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <span className="text-sm text-gray-500">Buscando en Google...</span>
              </div>
            ) : similarImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Search className="w-8 h-8 text-gray-300" />
                <span className="text-sm text-gray-400">No se encontraron imágenes similares</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {similarImages.filter(img => !brokenUrls.has(img.url)).map((img, i) => {
                    const isSelected = selectedFromAI.includes(img.url);
                    const selectedIdx = selectedFromAI.indexOf(img.url);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleSelectAI(img.url)}
                        disabled={importing}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition active:scale-95 disabled:opacity-50 ${
                          isSelected ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={`/api/vision-similar?url=${encodeURIComponent(img.url)}`}
                          alt={`Similar ${i + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          onError={() => setBrokenUrls(prev => new Set(prev).add(img.url))}
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                            <span className="text-[10px] font-bold">{selectedIdx + 1}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Barra de confirmación */}
                <div className="sticky bottom-0 bg-white pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      {selectedFromAI.length === 0
                        ? 'Toca para seleccionar (máx 3)'
                        : `${selectedFromAI.length} seleccionada${selectedFromAI.length > 1 ? 's' : ''}`}
                    </span>
                    {selectedFromAI.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedFromAI([])}
                        className="text-[11px] text-gray-500 font-medium"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={confirmAISelection}
                    disabled={selectedFromAI.length === 0 || importing}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-lg active:scale-[0.98] transition disabled:opacity-50"
                  >
                    {importing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
                    ) : (
                      <><Check className="w-4 h-4" /> Importar {selectedFromAI.length} foto{selectedFromAI.length > 1 ? 's' : ''}</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Editor móvil: wizard de 4 pasos ────────────────────────────────── */
const STEPS = [
  { label: 'Fotos' },
  { label: 'Precios' },
  { label: 'Info' },
  { label: 'Categoría' },
];

const inputCls = 'w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-gray-800';
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

export default function MobileProductEditor({
  modal, setModal, onClose, onSave, isSaving,
  categories, subcategories,
  aiLoading, setAiLoading, aiTitles, setAiTitles,
  onGenerateAll, onGenerateTabs,
  aiAutoEnhance,
}: Props) {
  const [step, setStep] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [infoMode, setInfoMode] = useState<'none' | 'ai' | 'manual'>('none');
  const [aiStep, setAiStep] = useState<string>('');
  const [isRestored, setIsRestored] = useState(false);
  const [marginPct, setMarginPct] = useState<string>('');
  const [catalogPct, setCatalogPct] = useState<string>('');
  const d = modal.data;

  // Restaurar de localStorage al montar (solo modo add)
  useEffect(() => {
    if (modal.mode !== 'add') { setIsRestored(true); return; }
    try {
      const saved = localStorage.getItem('mobile-editor-state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.step != null) setStep(state.step);
        if (state.infoMode) setInfoMode(state.infoMode);
        if (state.marginPct != null) setMarginPct(state.marginPct);
        if (state.catalogPct != null) setCatalogPct(state.catalogPct);
        if (state.modalData) {
          setModal(m => m ? { ...m, data: { ...m.data, ...state.modalData } } : m);
        }
      }
    } catch {}
    setIsRestored(true);
  }, []);

  // Guardar en localStorage cuando cambian los datos relevantes (solo modo add, solo después de restaurar)
  useEffect(() => {
    if (modal.mode !== 'add' || !isRestored) return;
    try {
      const payload = {
        step,
        infoMode,
        marginPct,
        catalogPct,
        modalData: {
          NAME: d.NAME, DESCRIPTION: d.DESCRIPTION, PRICE: d.PRICE,
          CATALOGPRICE: d.CATALOGPRICE, COST: d.COST, STOCK: d.STOCK,
          IMAGEURL: d.IMAGEURL, IMAGEURL2: d.IMAGEURL2, IMAGEURL3: d.IMAGEURL3,
          CATEGORYID: d.CATEGORYID, SUBCATEGORYID: d.SUBCATEGORYID,
          TAGS: d.TAGS, _details: d._details, _usage: d._usage, _ingredients: d._ingredients,
          WHOLESALEPRICE: d.WHOLESALEPRICE,
        },
      };
      localStorage.setItem('mobile-editor-state', JSON.stringify(payload));
    } catch (e) { console.error('[MobileEditor] Error guardando:', e); }
  }, [step, infoMode, marginPct, catalogPct, d.NAME, d.DESCRIPTION, d.PRICE, d.CATALOGPRICE, d.COST, d.STOCK,
      d.IMAGEURL, d.IMAGEURL2, d.IMAGEURL3, d.CATEGORYID, d.SUBCATEGORYID, d.TAGS,
      d._details, d._usage, d._ingredients, d.WHOLESALEPRICE, modal.mode, isRestored]);

  // Limpiar localStorage al guardar
  useEffect(() => {
    if (isSaving) {
      localStorage.removeItem('mobile-editor-state');
    }
  }, [isSaving]);

  // Reset al abrir modal nuevo
  useEffect(() => {
    if (modal.mode === 'add') {
      const saved = localStorage.getItem('mobile-editor-state');
      if (!saved) {
        setStep(0);
        setInfoMode('none');
        setAiStep('');
      }
    } else {
      setStep(0);
      setInfoMode('none');
      setAiStep('');
    }
  }, [modal.mode]);

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

  /* IA: iniciar flujo completo - primero sugerir títulos */
  const startAIFlow = async () => {
    setAiStep('Analizando imágenes y generando títulos...');
    setAiLoading('title');
    setAiTitles([]);
    try {
      const catName = categories.find(c => c.$id === d.CATEGORYID)?.name || '';
      const titles = await generateProductTitle(d.DESCRIPTION || d.NAME || '', catName, imageUrls, d.NAME || '');
      setAiTitles(titles);
    } catch (e: any) {
      alert(e.message);
      setInfoMode('none');
    } finally {
      setAiLoading(null);
      setAiStep('');
    }
  };

  /* IA: tras seleccionar título, generar descripción + categoría + tags + ficha */
  const selectTitleAndGenerate = async (title: string) => {
    update({ NAME: title });
    setAiTitles([]);
    setAiLoading('all');
    setAiStep('Generando descripción...');
    try {
      // 1. Generar descripción con el título seleccionado
      const catName = categories.find(c => c.$id === d.CATEGORYID)?.name || '';
      setAiStep('Generando descripción con IA...');
      const desc = await generateProductDescription(title, catName, d.DESCRIPTION || '', imageUrls);
      update({ DESCRIPTION: desc });

      // 2. Generar todo el resto (categoría, tags, ficha) via onGenerateAll
      setAiStep('Autocompletando categoría, tags y ficha técnica...');
      // Esperar a que el state se actualice antes de llamar onGenerateAll
      await new Promise(r => setTimeout(r, 300));
      onGenerateAll();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAiLoading(null);
      setAiStep('');
    }
  };

  /* Validación ligera por paso antes de avanzar */
  const goNext = () => {
    if (step === 1 && (!d.PRICE || Number(d.PRICE) <= 0)) {
      alert('Ingresa el Precio para continuar'); return;
    }
    if (step === 2 && !d.NAME?.trim()) { alert('Escribe el nombre del producto para continuar'); return; }
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
          {aiAutoEnhance && !imageUrls[0] && (
            <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-2xl p-3">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse shrink-0" />
              <p className="text-sm text-purple-700 font-medium">Sube una foto del producto y la IA autocompletará todo automáticamente</p>
            </div>
          )}
          <MobilePhotoUploader
            imageUrls={imageUrls}
            onChange={urls => {
              update({
              IMAGEURL: urls[0] || '',
              IMAGEURL2: urls[1] || '',
              IMAGEURL3: urls[2] || '',
            });
            }}
          />
          <p className="text-xs text-gray-400 text-center">Una buena foto ayuda a vender más 📸</p>
        </div>
      )}

      {/* ── PASO 2: PRECIOS Y STOCK ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            {/* Costo + Margen → Precio automático */}
            <div>
              <label className={labelCls}>Costo (lo que pagas) <span className="text-gray-400 font-normal">principal</span></label>
              <input
                type="number" inputMode="numeric"
                value={d.COST || ''}
                onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                onChange={e => update({ COST: Number(e.target.value) || 0 })}
                placeholder="Ej: 3000"
                className={`${inputCls} text-lg font-bold`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-700 mb-1.5">Margen de ganancia (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" inputMode="numeric"
                  value={marginPct}
                  placeholder="Ej: 100"
                  onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                  onChange={e => {
                    setMarginPct(e.target.value);
                    const pct = Number(e.target.value);
                    const cost = Number(d.COST) || 0;
                    if (pct !== 0 && cost > 0) {
                      const price = Math.round(cost * (1 + pct / 100));
                      update({ PRICE: price, WHOLESALEPRICE: price });
                    }
                  }}
                  className="w-24 px-3 py-3 border border-emerald-300 rounded-2xl text-base font-bold text-emerald-700 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {d.COST && d.PRICE && (
                  <span className="text-sm font-semibold text-emerald-600">
                    Ganancia: ${(Number(d.PRICE) - Number(d.COST)).toLocaleString('es-CL')}
                  </span>
                )}
              </div>
            </div>

            {/* Precio (editable, se autocalcula con margen pero se puede cambiar) */}
            <div className="pt-2 border-t border-gray-100">
              <label className={labelCls}>Precio venta (CLP) <span className="text-red-500">*</span></label>
              <PriceInput
                value={d.PRICE || ''}
                onChange={v => update({ PRICE: v, WHOLESALEPRICE: v })}
                placeholder="Ej: $6.000"
                className={`${inputCls} text-lg font-bold ${!d.PRICE ? 'border-red-300 bg-red-50' : ''}`}
              />
              {d.COST && d.PRICE && (
                <p className={`text-[11px] font-semibold mt-1 ${((Number(d.PRICE) - Number(d.COST)) / Number(d.PRICE) * 100) >= 30 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  Margen actual: {Math.round(((Number(d.PRICE) - Number(d.COST)) / Number(d.PRICE)) * 100)}%
                </p>
              )}
            </div>

            {/* Precio Catálogo con % manual */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] text-amber-600 font-medium shrink-0">% sobre costo:</span>
                <input
                  type="number" inputMode="numeric"
                  value={catalogPct}
                  placeholder="Ej: 10"
                  onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                  onChange={e => {
                    setCatalogPct(e.target.value);
                    const pct = Number(e.target.value);
                    const cost = Number(d.COST) || 0;
                    if (pct !== 0 && cost > 0) {
                      update({ CATALOGPRICE: Math.round(cost * (1 + pct / 100)) });
                    }
                  }}
                  className="w-20 px-2 py-1 border border-amber-300 rounded-lg text-[11px] bg-white font-semibold text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {d.COST && d.CATALOGPRICE && (
                  <span className="text-[10px] text-amber-500 font-medium">
                    Ganancia: ${(Number(d.CATALOGPRICE) - Number(d.COST)).toLocaleString('es-CL')}
                  </span>
                )}
              </div>
              <label className="block text-xs font-semibold text-amber-700 mb-1.5">Precio Catálogo ✨</label>
              <input
                type="number" inputMode="numeric"
                value={d.CATALOGPRICE || ''}
                onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                onChange={e => update({ CATALOGPRICE: Number(e.target.value) || 0 })}
                placeholder="Auto o manual"
                className="w-full px-3 py-3 border border-amber-300 bg-amber-50/50 rounded-2xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <div>
              <label className={labelCls}>Stock disponible</label>
              <div className="flex gap-2">
                <input
                  type="number" inputMode="numeric"
                  value={d.STOCK || ''}
                  onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                  onChange={e => update({ STOCK: Number(e.target.value) || 0 })}
                  placeholder="Vacío = Ilimitado"
                  className={`${inputCls} flex-1 text-lg font-bold`}
                />
                <button type="button" onClick={() => update({ STOCK: 99999 })}
                  className="flex items-center gap-1.5 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 active:scale-95 transition shrink-0">
                  <InfinityIcon className="w-4 h-4" /> Ilimitado
                </button>
              </div>
              {Number(d.STOCK) === 0 && (
                <p className="text-[11px] font-semibold text-indigo-500 mt-1.5">Se guardara como Ilimitado automaticamente</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 3: INFORMACIÓN ── */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Modo none: mostrar 2 botones */}
          {infoMode === 'none' && (
            <div className="space-y-4">
              <div className="text-center pt-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">¿Cómo quieres completar la info?</p>
              </div>
              <button
                type="button"
                onClick={() => { setInfoMode('manual'); }}
                className="w-full flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-gray-300 bg-gray-50 active:scale-[0.98] transition"
              >
                <Edit3 className="w-8 h-8 text-gray-500" />
                <span className="text-sm font-bold text-gray-700">Completar manualmente</span>
                <span className="text-[11px] text-gray-400">Tú escribes todo</span>
              </button>
              <button
                type="button"
                onClick={() => { setInfoMode('ai'); startAIFlow(); }}
                disabled={aiLoading !== null}
                className="w-full flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-indigo-300 bg-indigo-50/50 active:scale-[0.98] transition disabled:opacity-50"
              >
                {aiLoading !== null ? (
                  <>
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="text-sm font-bold text-indigo-600">{aiStep || 'Generando...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                    <span className="text-sm font-bold text-indigo-600">Completar todo con IA</span>
                    <span className="text-[11px] text-indigo-400">Analiza fotos y autocompleta todo</span>
                  </>
                )}
              </button>
              {imageUrls.length === 0 && (
                <p className="text-[11px] text-amber-600 text-center font-medium">
                  ⚠️ Sube al menos una foto en el paso anterior para mejor resultado de IA
                </p>
              )}
            </div>
          )}

          {/* Modo manual: campos vacíos */}
          {infoMode === 'manual' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                <Edit3 className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-xs font-semibold text-gray-500">Modo manual</span>
                <button type="button" onClick={() => setInfoMode('none')} className="ml-auto text-[11px] text-indigo-600 font-medium">Cambiar</button>
              </div>
              <div>
                <label className={labelCls}>Nombre del producto <span className="text-red-500">*</span></label>
                <input
                  value={d.NAME || ''}
                  onChange={e => update({ NAME: e.target.value })}
                  placeholder="Ej: Brillo labial Honey Crystal"
                  className={inputCls}
                />
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
              </div>
            </div>
          )}

          {/* Modo IA: mostrar títulos sugeridos, luego autocompletar */}
          {infoMode === 'ai' && (
            <div className="space-y-5">
              {/* Indicador de progreso IA */}
              {aiLoading !== null && (
                <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-3">
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-indigo-700">{aiStep || 'Procesando...'}</p>
                    <p className="text-[10px] text-indigo-400">No cierres esta ventana</p>
                  </div>
                </div>
              )}

              {/* Paso 1: Seleccionar título */}
              {aiLoading === null && aiTitles.length > 0 && !d.NAME && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-xs font-semibold text-indigo-700">Elige un título para tu producto</span>
                  </div>
                  <div className="space-y-2">
                    {aiTitles.map((t, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectTitleAndGenerate(t)}
                        className="w-full text-left p-3.5 rounded-2xl border-2 border-gray-200 bg-white text-sm font-medium text-gray-800 active:scale-[0.98] transition hover:border-indigo-400"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setInfoMode('none')} className="text-[11px] text-gray-500 font-medium w-full text-center">Volver</button>
                </div>
              )}

              {/* Ya completado: mostrar info con etiqueta IA */}
              {aiLoading === null && d.NAME && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-emerald-700">Completado con IA</span>
                    <button type="button" onClick={() => setInfoMode('none')} className="ml-auto text-[11px] text-gray-500 font-medium">Reiniciar</button>
                  </div>
                  <div>
                    <label className={labelCls}>Nombre del producto</label>
                    <input value={d.NAME || ''} onChange={e => update({ NAME: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Descripción</label>
                    <textarea value={d.DESCRIPTION || ''} onChange={e => update({ DESCRIPTION: e.target.value })} rows={5} className={`${inputCls} resize-none`} />
                  </div>
                  <div className="bg-indigo-50/50 rounded-xl p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> También se autocompletó:</p>
                    <p className="text-[11px] text-indigo-600">✓ Categoría y subcategoría</p>
                    <p className="text-[11px] text-indigo-600">✓ Tags</p>
                    <p className="text-[11px] text-indigo-600">✓ Ficha técnica (detalles, uso, ingredientes)</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── PASO 4: CATEGORÍA Y EXTRAS ── */}
      {step === 3 && (
        <div className="space-y-5">
          {infoMode === 'ai' && d.CATEGORYID && (
            <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-emerald-700">Categoría autocompletada por IA</span>
              <span className="ml-auto text-[10px] text-emerald-500">Puedes editar si quieres</span>
            </div>
          )}
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
