'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Package, ChevronDown, ArrowLeft, Search, Sparkles, Loader2, Lock, FileText, RefreshCw, Check } from 'lucide-react';
import ProductPhotoUploader from '@/components/admin/ProductPhotoUploader';
import PriceInput from '@/components/PriceInput';
import { generateProductTitle, generateProductDescription, generateProductAiPack } from '@/lib/aiAdmin';

interface Category { $id: string; name: string; }
interface Subcategory { $id: string; name: string; categoryId: string; parentSubcategoryId?: string; }

interface VendorProduct {
  $id: string;
  NAME: string;
  DESCRIPTION?: string;
  PRICE: number;
  STOCK: number;
  IMAGEURL?: string;
  IMAGEURL2?: string;
  IMAGEURL3?: string;
  CATEGORYID?: string;
  SUBCATEGORYID?: string;
  TAGS?: string[] | string;
  FEATURES?: string[] | string;
  PACKQTY?: number;
  WHOLESALEPRICE?: number;
  WHOLESALEMINQUANTITY?: number;
  PACK_MIN_PACKS?: number;
  PACK_DISCOUNT_PCT?: number;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  tags: string;
  sku: string;
  barcode: string;
  volPricingEnabled: boolean;
  volMinQty: string;
  volDiscountType: 'fixed' | 'pct';
  volPrice: string;
  volPct: string;
  details: string;
  usage: string;
  ingredients: string;
}

const EMPTY_FORM: ProductForm = {
  name: '', description: '', price: '', stock: '', category: '', subcategory: '',
  imageUrl: '', imageUrl2: '', imageUrl3: '', tags: '', sku: '', barcode: '',
  volPricingEnabled: false, volMinQty: '', volDiscountType: 'fixed', volPrice: '', volPct: '',
  details: '', usage: '', ingredients: '',
};

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n || 0);
}

function getSkuFromFeatures(features: any): string {
  const arr = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n') : []);
  const skuLine = arr.find((f: string) => f.startsWith('SKU:'));
  return skuLine ? skuLine.replace('SKU:', '').trim() : '';
}

function getBarcodeFromFeatures(features: any): string {
  const arr = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n') : []);
  const barLine = arr.find((f: string) => f.startsWith('BARCODE:'));
  return barLine ? barLine.replace('BARCODE:', '').trim() : '';
}

function getCustomTabsFromFeatures(features: any): { details: string; usage: string; ingredients: string } {
  const arr = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n') : []);
  const tabsLine = arr.find((f: string) => f.startsWith('CUSTOM_TABS:'));
  if (!tabsLine) return { details: '', usage: '', ingredients: '' };
  try {
    const json = tabsLine.replace('CUSTOM_TABS:', '').trim();
    const parsed = JSON.parse(json);
    return { details: parsed.details || '', usage: parsed.usage || '', ingredients: parsed.ingredients || '' };
  } catch { return { details: '', usage: '', ingredients: '' }; }
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiTitles, setAiTitles] = useState<string[]>([]);
  const [purging, setPurging] = useState(false);
  const [step, setStep] = useState(0);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/public-data/catalog');
      const data = await res.json();
      setCategories(data.categories || []);
      setSubcategories(data.subcategories || []);
    } catch { /* noop */ }
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vendor/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch { /* noop */ }
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); loadCategories(); }, [load, loadCategories]);

  const purgeCache = async () => {
    setPurging(true);
    try {
      await fetch('/api/admin/revalidate', { method: 'POST' });
      alert('Caché purgado. Los productos aparecerán en la tienda.');
    } catch {
      alert('No se pudo purgar el caché.');
    } finally {
      setPurging(false);
    }
  };

  /* ── IA helpers ── */
  const imageUrlsForm = [form.imageUrl, form.imageUrl2, form.imageUrl3].filter(Boolean);
  const editorHasPhoto = imageUrlsForm.length > 0;

  const generateAll = useCallback(async () => {
    setAiLoading('all');
    setAiTitles([]);
    try {
      const categoryName = categories.find(c => c.$id === form.category)?.name || '';
      const catNames = categories.map(c => c.name);
      const subGroups = categories.map(c => ({
        category: c.name,
        subs: subcategories.filter(s => s.categoryId === c.$id && !s.parentSubcategoryId).map(s => s.name),
      }));
      const result = await generateProductAiPack({
        name: form.name,
        description: form.description,
        category: categoryName,
        imageUrls: imageUrlsForm,
        availableCategories: catNames,
        availableSubcategories: subGroups,
      });
      setAiTitles(result.titles);

      let matchedCatId = form.category;
      if (result.suggestedCategory) {
        const matched = categories.find(c => c.name.toLowerCase() === result.suggestedCategory.toLowerCase());
        if (matched) matchedCatId = matched.$id;
      }
      let matchedSubId = '';
      if (result.suggestedSubcategory && matchedCatId) {
        const matchedSub = subcategories.find(s =>
          s.categoryId === matchedCatId && !s.parentSubcategoryId &&
          s.name.toLowerCase() === result.suggestedSubcategory.toLowerCase()
        );
        if (matchedSub) matchedSubId = matchedSub.$id;
      }
      setForm(f => ({
        ...f,
        name: result.selectedTitle || f.name,
        description: result.description || f.description,
        tags: result.tags.join(', '),
        category: matchedCatId || f.category,
        subcategory: matchedSubId,
        details: result.details || f.details,
        usage: result.usage || f.usage,
        ingredients: result.ingredients || f.ingredients,
      }));
    } catch (e: any) {
      alert(e.message || 'No se pudo generar el contenido con IA.');
    } finally {
      setAiLoading(null);
    }
  }, [categories, subcategories, form, imageUrlsForm]);

  const generateTitles = async () => {
    setAiLoading('title');
    setAiTitles([]);
    try {
      const categoryName = categories.find(c => c.$id === form.category)?.name || '';
      const titles = await generateProductTitle(form.description, categoryName, imageUrlsForm, form.name);
      setAiTitles(titles);
    } catch (e: any) {
      alert(e.message || 'No se pudieron generar títulos con IA.');
    } finally {
      setAiLoading(null);
    }
  };

  const generateDescription = async () => {
    setAiLoading('desc');
    try {
      const categoryName = categories.find(c => c.$id === form.category)?.name || '';
      const desc = await generateProductDescription(form.name, categoryName, form.description, imageUrlsForm);
      setForm(f => ({ ...f, description: desc }));
    } catch (e: any) {
      alert(e.message || 'No se pudo generar la descripción con IA.');
    } finally {
      setAiLoading(null);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setStep(0);
    setShowForm(true);
  };

  const openEdit = (p: VendorProduct) => {
    const tabs = getCustomTabsFromFeatures(p.FEATURES);
    setEditingId(p.$id);
    setStep(0);
    setForm({
      name: p.NAME || '',
      description: p.DESCRIPTION || '',
      price: String(p.PRICE || ''),
      stock: p.STOCK === 99999 ? '' : String(p.STOCK ?? ''),
      category: p.CATEGORYID || '',
      subcategory: p.SUBCATEGORYID || '',
      imageUrl: p.IMAGEURL || '',
      imageUrl2: p.IMAGEURL2 || '',
      imageUrl3: p.IMAGEURL3 || '',
      tags: Array.isArray(p.TAGS) ? p.TAGS.join(', ') : (p.TAGS || ''),
      sku: getSkuFromFeatures(p.FEATURES),
      barcode: getBarcodeFromFeatures(p.FEATURES),
      volPricingEnabled: !!(p.WHOLESALEMINQUANTITY && p.WHOLESALEMINQUANTITY > 0) || !!(p.PACK_MIN_PACKS && p.PACK_DISCOUNT_PCT),
      volMinQty: String(p.WHOLESALEMINQUANTITY || p.PACK_MIN_PACKS || ''),
      volDiscountType: (p.PACK_DISCOUNT_PCT && p.PACK_DISCOUNT_PCT > 0) ? 'pct' : 'fixed',
      volPrice: p.WHOLESALEPRICE ? String(p.WHOLESALEPRICE) : '',
      volPct: p.PACK_DISCOUNT_PCT ? String(p.PACK_DISCOUNT_PCT) : '',
      details: tabs.details,
      usage: tabs.usage,
      ingredients: tabs.ingredients,
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('El precio debe ser mayor a 0'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        price: form.price,
        stock: form.stock,
        category: form.category,
        subcategory: form.subcategory,
        imageUrl: form.imageUrl,
        imageUrl2: form.imageUrl2,
        imageUrl3: form.imageUrl3,
        tags: form.tags,
        sku: form.sku,
        barcode: form.barcode,
        wholesalePrice: form.volPricingEnabled && form.volDiscountType === 'fixed' ? Number(form.volPrice) || 0 : 0,
        wholesaleMinQuantity: form.volPricingEnabled ? Number(form.volMinQty) || 0 : 0,
        packMinPacks: form.volPricingEnabled ? Number(form.volMinQty) || 0 : 0,
        packDiscountPct: form.volPricingEnabled && form.volDiscountType === 'pct' ? Number(form.volPct) || 0 : 0,
        details: form.details,
        usage: form.usage,
        ingredients: form.ingredients,
      };
      const res = await fetch(editingId ? `/api/vendor/products/${editingId}` : '/api/vendor/products', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setError(data?.error || 'Error al guardar'); setSaving(false); return; }
      setShowForm(false);
      await load();
    } catch {
      setError('Error de conexión');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      await fetch(`/api/vendor/products/${id}`, { method: 'DELETE' });
      await load();
    } catch { /* noop */ }
  };

  const filtered = products.filter(p =>
    !search || p.NAME?.toLowerCase().includes(search.toLowerCase())
  );

  const catName = (id?: string) => categories.find(c => c.$id === id)?.name || '—';

  /* ── Vista: lista de productos ── */
  if (!showForm) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Mis productos</h1>
            <p className="text-xs sm:text-sm text-gray-500">{products.length} producto{products.length !== 1 ? 's' : ''} en tu tienda</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => load()} disabled={isLoading}
              title="Actualizar lista"
              className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-3 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <button onClick={purgeCache} disabled={purging}
              className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-3 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50">
              {purging ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span className="hidden sm:inline">Purgar caché</span>
            </button>
            <button onClick={openCreate} className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nuevo producto</span><span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{search ? 'No se encontraron productos.' : 'Aún no tienes productos. Crea el primero.'}</p>
          </div>
        ) : (
          <>
            {/* Desktop: tabla */}
            <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-semibold">
                    <td className="px-4 py-3">Producto</td>
                    <td className="px-4 py-3">Categoría</td>
                    <td className="px-4 py-3">Precio</td>
                    <td className="px-4 py-3">Stock</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.$id} className="border-t border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {p.IMAGEURL && <img src={p.IMAGEURL} alt={p.NAME} className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{p.NAME}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{catName(p.CATEGORYID)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(p.PRICE)}</td>
                      <td className="px-4 py-3">
                        {p.STOCK === 99999 ? (
                          <span className="text-xs font-semibold text-emerald-600">Ilimitado</span>
                        ) : p.STOCK === 0 ? (
                          <span className="text-xs font-semibold text-red-500">Agotado</span>
                        ) : p.STOCK <= 5 ? (
                          <span className="text-xs font-semibold text-amber-500">{p.STOCK} un.</span>
                        ) : (
                          <span className="text-gray-600">{p.STOCK}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(p)} title="Editar" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.$id)} title="Eliminar" className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: cards */}
            <div className="sm:hidden space-y-3">
              {filtered.map(p => (
                <div key={p.$id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {p.IMAGEURL && <img src={p.IMAGEURL} alt={p.NAME} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.NAME}</p>
                    <p className="text-xs text-gray-400 truncate">{catName(p.CATEGORYID)}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900 text-sm">{formatPrice(p.PRICE)}</span>
                      {p.STOCK === 99999 ? (
                        <span className="text-xs font-semibold text-emerald-600">Ilimitado</span>
                      ) : p.STOCK === 0 ? (
                        <span className="text-xs font-semibold text-red-500">Agotado</span>
                      ) : p.STOCK <= 5 ? (
                        <span className="text-xs font-semibold text-amber-500">{p.STOCK} un.</span>
                      ) : (
                        <span className="text-xs text-gray-600">{p.STOCK} un.</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold transition">
                        <Pencil className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button onClick={() => handleDelete(p.$id)} className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  /* ── Vista: formulario (wizard responsivo, igual al admin) ── */
  const WIZARD_STEPS = [
    { label: 'Fotos' },
    { label: 'Precios' },
    { label: 'Info' },
    { label: 'Categoría' },
  ];

  const goNext = () => {
    if (step === 1 && (!form.price || Number(form.price) <= 0)) { setError('El precio es obligatorio'); return; }
    if (step === 2 && !form.name.trim()) { setError('Escribe el nombre del producto'); return; }
    setError('');
    setStep(s => Math.min(s + 1, WIZARD_STEPS.length - 1));
  };
  const goBack = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div>
      {/* Header bar — desktop */}
      <div className="hidden sm:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            {editingId && <p className="text-xs text-gray-400">ID: {editingId}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60 flex items-center gap-2">
            {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Guardando...</> : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Header bar — mobile */}
      <div className="sm:hidden flex items-center gap-3 mb-4">
        <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">{editingId ? 'Editar' : 'Nuevo'}</h1>
          <p className="text-xs text-gray-400">Paso {step + 1} de {WIZARD_STEPS.length} · {WIZARD_STEPS[step].label}</p>
        </div>
      </div>

      {/* Progress dots — mobile */}
      <div className="sm:hidden flex items-center gap-1.5 mb-4">
        {WIZARD_STEPS.map((s, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'flex-[2] bg-gray-900' : i < step ? 'flex-1 bg-gray-400' : 'flex-1 bg-gray-200'}`} />
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-4">{error}</div>
      )}

      {/* ══ Desktop: layout de 2 columnas (igual que antes) ══ */}
      <div className="hidden sm:flex gap-6 items-start flex-col lg:flex-row">
        {/* Columna izquierda: fotos + IA */}
        <div className="w-full lg:w-[300px] xl:w-[340px] shrink-0 space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center">1</span>
              Fotos del producto
            </label>
            <ProductPhotoUploader
              imageUrls={imageUrlsForm}
              onChange={urls => setForm(f => ({ ...f, imageUrl: urls[0] || '', imageUrl2: urls[1] || '', imageUrl3: urls[2] || '' }))}
              compact
            />
            <p className="text-[11px] text-gray-400 mt-2">Hasta 3 fotos. La primera es la principal.</p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-white p-5 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-900">Asistente IA</p>
                <p className="text-[10px] text-purple-500">Autocompleta este producto con IA</p>
              </div>
            </div>
            <button type="button" onClick={generateAll} disabled={aiLoading !== null || !editorHasPhoto}
              title={!editorHasPhoto ? 'Primero sube al menos una foto' : undefined}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-60 shadow-sm">
              {aiLoading === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : !editorHasPhoto ? <Lock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {aiLoading === 'all' ? 'Generando...' : '✨ Generar todo con IA'}
            </button>
            <p className="text-[10px] text-purple-400 text-center pt-1">{editorHasPhoto ? 'La IA usa las fotos y el nombre para autocompletar todo' : '🔒 Sube al menos 1 foto para desbloquear la IA'}</p>
          </div>
        </div>

        {/* Columna principal */}
        <div className="flex-1 min-w-0 space-y-6">
          {!editorHasPhoto && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">Sección 2 bloqueada</p>
                <p className="text-xs text-amber-600">Sube al menos 1 foto del producto en el paso 1 para desbloquear precios e inventario.</p>
              </div>
            </div>
          )}

          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all ${!editorHasPhoto ? 'opacity-40 pointer-events-none select-none' : ''}`}>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center">2</span> Precios e Inventario
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Precio venta (CLP) <span className="text-red-500">*</span></label>
                <PriceInput value={form.price} onChange={v => setForm(f => ({ ...f, price: String(v) }))}
                  placeholder="$0"
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 ${!form.price ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <span className="flex items-center justify-between">
                    <span>Stock</span>
                    <button type="button" onClick={() => setForm(f => ({ ...f, stock: '' }))} className="text-[10px] text-gray-900 hover:text-indigo-800 font-semibold underline">Ilimitado</button>
                  </span>
                </label>
                <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                  onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                  placeholder="Vacío = Ilimitado"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                {form.stock === '' && <p className="text-xs text-emerald-600 mt-1">✓ Stock Ilimitado</p>}
                {form.stock !== '' && Number(form.stock) > 0 && Number(form.stock) <= 5 && (
                  <p className="text-xs text-amber-500 mt-1">⚠ Stock bajo</p>
                )}
              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center">3</span> Información básica
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Nombre del producto *</label>
                  <button type="button" onClick={generateTitles} disabled={aiLoading !== null}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 transition disabled:opacity-50">
                    {aiLoading === 'title' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Sugerir nombres con IA
                  </button>
                </div>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="Nombre del producto" />
                {aiTitles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {aiTitles.map((t, i) => (
                      <button key={i} type="button" onClick={() => { setForm(f => ({ ...f, name: t })); setAiTitles([]); }}
                        className="text-xs px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg hover:bg-purple-100 border border-purple-100 transition-colors truncate max-w-full">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                  <button type="button" onClick={generateDescription} disabled={aiLoading !== null}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 transition disabled:opacity-50">
                    {aiLoading === 'desc' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Generar con IA
                  </button>
                </div>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Describe tu producto..." />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center">4</span> Organización y Detalles
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
                <div className="relative">
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: '' }))}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800">
                    <option value="">Sin categoría</option>
                    {categories.map(c => <option key={c.$id} value={c.$id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subcategoría</label>
                <div className="relative">
                  <select value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                    disabled={!form.category}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:opacity-50 disabled:bg-gray-100">
                    <option value="">Ninguna</option>
                    {subcategories.filter(s => s.categoryId === form.category && !s.parentSubcategoryId).map(s => <option key={s.$id} value={s.$id}>{s.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
                <input type="text" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                  placeholder="Código interno"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-800" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Código de barras</label>
                <input type="text" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))}
                  placeholder="EAN / UPC"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-800" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Tags (separados por coma)</label>
                <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="tag1, tag2, tag3" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center">5</span> Ficha Técnica
              {(form.details || form.usage || form.ingredients) && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">con contenido</span>
              )}
            </h3>
            <p className="text-xs text-gray-500 mb-4">Completa estos campos para mostrar pestañas dedicadas debajo de la descripción en el detalle de producto.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detalles del producto</label>
                <textarea value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Ej: Material, dimensiones, peso, etc." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Modo de uso</label>
                <textarea value={form.usage} onChange={e => setForm(f => ({ ...f, usage: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Instrucciones de uso..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ingredientes / Composición</label>
                <textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Lista de ingredientes..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Mobile: wizard con pasos ══ */}
      <div className="sm:hidden space-y-4 pb-24" style={{ minHeight: '100%' }}>
        {/* Paso 0: Fotos */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Fotos del producto</h3>
            <ProductPhotoUploader
              imageUrls={imageUrlsForm}
              onChange={urls => setForm(f => ({ ...f, imageUrl: urls[0] || '', imageUrl2: urls[1] || '', imageUrl3: urls[2] || '' }))}
              compact
            />
            <p className="text-[11px] text-gray-400 mt-2">Hasta 3 fotos. La primera es la principal.</p>

            {/* Panel IA */}
            <div className="mt-4 rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-white p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-900">Asistente IA</p>
                  <p className="text-[10px] text-purple-500">Autocompleta con IA</p>
                </div>
              </div>
              <button type="button" onClick={generateAll} disabled={aiLoading !== null || !editorHasPhoto}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-60 shadow-sm">
                {aiLoading === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : !editorHasPhoto ? <Lock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading === 'all' ? 'Generando...' : '✨ Generar todo con IA'}
              </button>
              <p className="text-[10px] text-purple-400 text-center">{editorHasPhoto ? 'La IA usa las fotos y el nombre' : '🔒 Sube 1 foto para desbloquear la IA'}</p>
            </div>
          </div>
        )}

        {/* Paso 1: Precios */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Precios e Inventario</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio venta (CLP) <span className="text-red-500">*</span></label>
              <PriceInput value={form.price} onChange={v => setForm(f => ({ ...f, price: String(v) }))}
                placeholder="$0"
                className={`w-full px-4 py-3.5 border rounded-2xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-gray-800 ${!form.price ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Stock</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, stock: '' }))} className="text-xs text-gray-900 font-semibold underline">Ilimitado</button>
              </div>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                placeholder="Vacío = Ilimitado"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-gray-800" />
              {form.stock === '' && <p className="text-xs text-emerald-600 mt-1">✓ Stock Ilimitado</p>}
              {form.stock !== '' && Number(form.stock) > 0 && Number(form.stock) <= 5 && (
                <p className="text-xs text-amber-500 mt-1">⚠ Stock bajo</p>
              )}
            </div>

          </div>
        )}

        {/* Paso 2: Info */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Información básica</h3>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Nombre *</label>
                <button type="button" onClick={generateTitles} disabled={aiLoading !== null}
                  className="flex items-center gap-1 text-xs font-semibold text-purple-700 transition disabled:opacity-50">
                  {aiLoading === 'title' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  IA
                </button>
              </div>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="Nombre del producto" />
              {aiTitles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {aiTitles.map((t, i) => (
                    <button key={i} type="button" onClick={() => { setForm(f => ({ ...f, name: t })); setAiTitles([]); }}
                      className="text-xs px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg border border-purple-100">
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <button type="button" onClick={generateDescription} disabled={aiLoading !== null}
                  className="flex items-center gap-1 text-xs font-semibold text-purple-700 transition disabled:opacity-50">
                  {aiLoading === 'desc' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  IA
                </button>
              </div>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4} className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Describe tu producto..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (separados por coma)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="tag1, tag2" />
            </div>
          </div>
        )}

        {/* Paso 3: Categoría + Ficha técnica */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Organización</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
                <div className="relative">
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: '' }))}
                    className="w-full appearance-none px-4 py-3.5 pr-10 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-gray-800">
                    <option value="">Sin categoría</option>
                    {categories.map(c => <option key={c.$id} value={c.$id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subcategoría</label>
                <div className="relative">
                  <select value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                    disabled={!form.category}
                    className="w-full appearance-none px-4 py-3.5 pr-10 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:opacity-50 disabled:bg-gray-100">
                    <option value="">Ninguna</option>
                    {subcategories.filter(s => s.categoryId === form.category && !s.parentSubcategoryId).map(s => <option key={s.$id} value={s.$id}>{s.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
                <input type="text" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                  placeholder="Código interno"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base font-mono focus:outline-none focus:ring-2 focus:ring-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de barras</label>
                <input type="text" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))}
                  placeholder="EAN / UPC"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base font-mono focus:outline-none focus:ring-2 focus:ring-gray-800" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Ficha Técnica <span className="text-[10px] font-normal text-gray-400">(opcional)</span></h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detalles</label>
                <textarea value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                  rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Material, dimensiones..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Modo de uso</label>
                <textarea value={form.usage} onChange={e => setForm(f => ({ ...f, usage: e.target.value }))}
                  rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Instrucciones..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ingredientes</label>
                <textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Lista..." />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra inferior fija — mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-4 pt-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        <div className="flex gap-3 max-w-lg mx-auto">
          {step > 0 ? (
            <button onClick={goBack}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 active:scale-[0.98] transition">
              ← Atrás
            </button>
          ) : (
            <button onClick={() => setShowForm(false)}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 active:scale-[0.98] transition">
              Cancelar
            </button>
          )}
          {step < WIZARD_STEPS.length - 1 ? (
            <button onClick={goNext}
              className="flex-[2] py-3.5 rounded-2xl bg-gray-900 text-white text-base font-bold shadow-lg active:scale-[0.98] transition">
              Siguiente →
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving}
              className="flex-[2] py-3.5 rounded-2xl bg-gray-900 text-white text-base font-bold shadow-lg active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</> : <><Check className="w-5 h-5" /> {editingId ? 'Guardar' : 'Crear'}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
