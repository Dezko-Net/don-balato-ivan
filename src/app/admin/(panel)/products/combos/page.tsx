'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Plus, Trash2, Save, Search, Check, AlertCircle, 
  Sparkles, Layers, ArrowLeft, RefreshCw, Eye, Tag, Percent 
} from 'lucide-react';
import Link from 'next/link';

interface ProductItem {
  $id: string;
  NAME: string;
  PRICE: number;
  CURRENTPRICE?: number;
  IMAGEURL?: string;
  STOCK?: number;
}

interface ComboConfig {
  id: string;
  title: string;
  subtitle?: string;
  discountPercent?: number;
  badge?: string;
  isActive: boolean;
  mainProductId: string;
  bundleProductIds: string[];
}

export default function AdminCombosPage() {
  const [configs, setConfigs] = useState<ComboConfig[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Search & selector modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<{
    comboId: string;
    type: 'main' | 'bundle';
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [combosRes, productsRes] = await Promise.all([
          fetch('/api/admin/combos', { cache: 'no-store' }),
          fetch('/api/public-data/products?limit=100', { cache: 'no-store' }),
        ]);

        if (combosRes.ok) {
          const cData = await combosRes.json();
          if (cData.success && Array.isArray(cData.configs) && cData.configs.length > 0) {
            setConfigs(cData.configs);
          } else {
            // Default initial combo template
            setConfigs([{
              id: 'combo-' + Date.now(),
              title: 'Arma tu Combo Pro',
              subtitle: 'Combina tus productos favoritos con descuento especial.',
              discountPercent: 15,
              badge: 'PACK DESTACADO',
              isActive: true,
              mainProductId: '',
              bundleProductIds: [],
            }]);
          }
        }

        if (productsRes.ok) {
          const pData = await productsRes.json();
          setProducts((pData.products || []) as ProductItem[]);
        }
      } catch (err) {
        console.error('Error cargando combos o productos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/admin/combos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Error al guardar: ' + (data.error || 'Error desconocido'));
      }
    } catch (e: any) {
      alert('Error de conexión al guardar los combos');
    } finally {
      setSaving(false);
    }
  };

  const addCombo = () => {
    setConfigs([
      ...configs,
      {
        id: 'combo-' + Date.now(),
        title: 'Nuevo Combo ' + (configs.length + 1),
        subtitle: 'Selecciona los productos integrantes de este combo.',
        discountPercent: 10,
        badge: 'OFERTA PACK',
        isActive: true,
        mainProductId: '',
        bundleProductIds: [],
      },
    ]);
  };

  const removeCombo = (id: string) => {
    if (configs.length <= 1) {
      alert('Debe existir al menos una configuración de combo.');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este combo/pack?')) {
      setConfigs(configs.filter(c => c.id !== id));
    }
  };

  const updateCombo = (id: string, field: keyof ComboConfig, value: any) => {
    setConfigs(configs.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const toggleBundleProduct = (comboId: string, productId: string) => {
    setConfigs(configs.map(c => {
      if (c.id !== comboId) return c;
      const current = c.bundleProductIds || [];
      const updated = current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId];
      return { ...c, bundleProductIds: updated };
    }));
  };

  const filteredProducts = products.filter(p => 
    p.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.$id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductById = (id: string) => products.find(p => p.$id === id);

  const formatCLP = (n: number) => {
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n);
    } catch { return `$${n}`; }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="font-medium text-sm">Cargando configuración de combos y productos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/products" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Productos
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800">Combos & Packs</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" />
            Configurador de Combos / Packs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Selecciona qué productos reales forman cada combo. Los cambios se actualizarán dinámicamente en la sección "Arma tu combo" de tu tienda (Plantilla 25).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addCombo}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Añadir Nuevo Combo
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          ¡Configuración de combos guardada correctamente! La tienda ahora mostrará estos datos reales.
        </div>
      )}

      {/* Lista de Combos */}
      <div className="space-y-6">
        {configs.map((combo, idx) => {
          const mainProduct = getProductById(combo.mainProductId);
          const bundleProducts = (combo.bundleProductIds || [])
            .map(id => getProductById(id))
            .filter(Boolean) as ProductItem[];

          const totalPrice = (mainProduct ? (mainProduct.CURRENTPRICE || mainProduct.PRICE) : 0) +
            bundleProducts.reduce((acc, p) => acc + (p.CURRENTPRICE || p.PRICE), 0);

          const discountedPrice = Math.round(totalPrice * (1 - (combo.discountPercent || 0) / 100));

          return (
            <div key={combo.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Top Bar of Card */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    #{idx + 1}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={combo.title}
                      onChange={e => updateCombo(combo.id, 'title', e.target.value)}
                      placeholder="Título del Combo (ej: Arma tu Combo Pro)"
                      className="font-bold text-lg text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={combo.isActive}
                      onChange={e => updateCombo(combo.id, 'isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Activo en Tienda</span>
                  </label>

                  <button
                    onClick={() => removeCombo(combo.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar Combo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subtítulo / Descripción Corta</label>
                  <input
                    type="text"
                    value={combo.subtitle || ''}
                    onChange={e => updateCombo(combo.id, 'subtitle', e.target.value)}
                    placeholder="Ej: Llévate productos seleccionados con descuento"
                    className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Descuento (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={combo.discountPercent ?? 15}
                      onChange={e => updateCombo(combo.id, 'discountPercent', Number(e.target.value))}
                      className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Percent className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Insignia / Badge</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={combo.badge || ''}
                      onChange={e => updateCombo(combo.id, 'badge', e.target.value)}
                      placeholder="Ej: PACK DESTACADO, 15% OFF"
                      className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Tag className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Product Selectors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Producto Destacado */}
                <div className="border border-amber-200/80 rounded-xl p-4 bg-amber-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Producto Destacado del Home
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">Se mostrará en la sección de Producto Destacado con insignia giratoria.</p>
                    </div>

                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveModal({ comboId: combo.id, type: 'main' });
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      {mainProduct ? 'Cambiar Producto' : 'Seleccionar Producto'}
                    </button>
                  </div>

                  {mainProduct ? (
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                      {mainProduct.IMAGEURL ? (
                        <img src={mainProduct.IMAGEURL} alt={mainProduct.NAME} className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                      )}
                      <div className="grow min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{mainProduct.NAME}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{formatCLP(mainProduct.CURRENTPRICE || mainProduct.PRICE)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-amber-200 rounded-xl text-center bg-white/60">
                      <p className="text-xs text-gray-500 mb-2">No has seleccionado el Producto Destacado.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveModal({ comboId: combo.id, type: 'main' });
                        }}
                        className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg text-xs hover:bg-amber-700 transition-colors shadow-sm"
                      >
                        Seleccionar Producto Destacado
                      </button>
                    </div>
                  )}
                </div>

                {/* Productos en el Pack / Accesorios */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        Productos de la Sección "Arma tu Combo" ({bundleProducts.length})
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">Si dejas esta lista vacía (0 productos), la sección "Arma tu combo" se ocultará en el Home.</p>
                    </div>

                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveModal({ comboId: combo.id, type: 'bundle' });
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      Añadir / Gestionar
                    </button>
                  </div>

                  {bundleProducts.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {bundleProducts.map(p => (
                        <div key={p.$id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {p.IMAGEURL ? (
                              <img src={p.IMAGEURL} alt={p.NAME} className="w-9 h-9 object-cover rounded-lg border" />
                            ) : (
                              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">?</div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{p.NAME}</p>
                              <p className="text-gray-500 font-mono">{formatCLP(p.CURRENTPRICE || p.PRICE)}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleBundleProduct(combo.id, p.$id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Quitar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <p className="text-xs text-gray-500 mb-2">No has seleccionado productos accesorios para este combo.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveModal({ comboId: combo.id, type: 'bundle' });
                        }}
                        className="px-3 py-1.5 bg-gray-800 text-white font-semibold rounded-lg text-xs hover:bg-gray-900 transition-colors"
                      >
                        Añadir Productos al Pack
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen de Precios */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-500 block">Suma Total Normal:</span>
                    <span className="font-mono font-bold text-gray-700 line-through">{formatCLP(totalPrice)}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-semibold block">Precio Final Combo ({combo.discountPercent}% OFF):</span>
                    <span className="font-mono font-extrabold text-blue-900 text-base">{formatCLP(discountedPrice)}</span>
                  </div>
                </div>

                <div className="text-gray-500 italic">
                  Este precio y porcentaje se mostrará automáticamente en Plantilla 25.
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Búsqueda de Productos */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                {activeModal.type === 'main' 
                  ? 'Seleccionar Producto Destacado' 
                  : 'Seleccionar Productos para el Pack'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o ID de producto..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal Product List */}
            <div className="p-4 overflow-y-auto grow space-y-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => {
                  const currentCombo = configs.find(c => c.id === activeModal.comboId);
                  const isMain = currentCombo?.mainProductId === p.$id;
                  const isSelectedInBundle = (currentCombo?.bundleProductIds || []).includes(p.$id);

                  return (
                    <div
                      key={p.$id}
                      onClick={() => {
                        if (activeModal.type === 'main') {
                          updateCombo(activeModal.comboId, 'mainProductId', p.$id);
                          setActiveModal(null);
                        } else {
                          toggleBundleProduct(activeModal.comboId, p.$id);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        (activeModal.type === 'main' && isMain) || (activeModal.type === 'bundle' && isSelectedInBundle)
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {p.IMAGEURL ? (
                          <img src={p.IMAGEURL} alt={p.NAME} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{p.NAME}</p>
                          <p className="text-xs text-gray-500 font-mono">{formatCLP(p.CURRENTPRICE || p.PRICE)}</p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-3">
                        {activeModal.type === 'main' ? (
                          isMain ? (
                            <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Seleccionado
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200">
                              Elegir
                            </span>
                          )
                        ) : (
                          <input
                            type="checkbox"
                            checked={isSelectedInBundle}
                            onChange={() => {}}
                            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No se encontraron productos coincidentes.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-xl text-xs hover:bg-gray-800"
              >
                Listo / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
