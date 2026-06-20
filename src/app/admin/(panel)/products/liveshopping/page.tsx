'use client';

import { useEffect, useState, useCallback } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Product } from '@/types/admin';
import {
  RefreshCw, AlertTriangle, Package, Pencil, Check, Trash2,
  ShoppingBag, Plus, Zap, Clock, X, ChevronDown, ChevronUp,
  Calendar, History, Eye,
} from 'lucide-react';
import Link from 'next/link';
import {
  getSkuFromFeatures,
  getLiveLogicFromFeatures,
  setLiveLogicInFeatures,
  isLiveLogicLimitedTimeActive,
  LiveLogicConfig,
} from '@/lib/product-features';

// ─── Types ────────────────────────────────────────────────────────────────────

type LiveSession = {
  dateKey: string; // YYYY-MM-DD
  label: string;
  products: Product[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getLiveShoppingThreshold = (): Date => {
  const now = new Date();
  const today5Pm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0, 0);
  return now >= today5Pm ? today5Pm : new Date(today5Pm.getTime() - 86400000);
};

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const todayKey = () => new Date().toISOString().slice(0, 10);

function getLiveStatus(p: Product, thresholdTime: number) {
  if (!p.$createdAt) return null;
  const importedTime = new Date(p.$createdAt).getTime();
  if (importedTime < thresholdTime) return null;
  const createdTime = p.$createdAt ? new Date(p.$createdAt).getTime() : 0;
  return createdTime >= thresholdTime ? 'new' : 'existing';
}

// ─── Live Logic Modal ─────────────────────────────────────────────────────────

function LiveLogicModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (productId: string, features: string) => Promise<void>;
}) {
  const basePrice = product.PRICE || 0;
  const apertura20Price = Math.round(basePrice * 0.8);

  const currentLogic = getLiveLogicFromFeatures(product.FEATURES) ?? {};

  // Tabs
  const [activeTab, setActiveTab] = useState<'minQty' | 'limitedTime'>('minQty');

  // Min qty state
  const [minQtyEnabled, setMinQtyEnabled] = useState(!!currentLogic.minQty);
  const [minQtyQty, setMinQtyQty] = useState(currentLogic.minQty?.qty ?? 2);
  const [minQtyPrice, setMinQtyPrice] = useState(currentLogic.minQty?.offerPrice ?? apertura20Price);

  // Limited time state
  const [limitedTimeEnabled, setLimitedTimeEnabled] = useState(!!currentLogic.limitedTime);
  const [ltOfferPrice, setLtOfferPrice] = useState(currentLogic.limitedTime?.offerPrice ?? apertura20Price);
  const [ltExpiresAt, setLtExpiresAt] = useState<string>(() => {
    if (currentLogic.limitedTime?.expiresAt) {
      // Convert ISO to datetime-local format
      return currentLogic.limitedTime.expiresAt.slice(0, 16);
    }
    // Default: 2 hours from now
    const d = new Date(Date.now() + 2 * 3600000);
    return d.toISOString().slice(0, 16);
  });

  // Disable apertura: auto-determined
  const hasAnyLogic = minQtyEnabled || limitedTimeEnabled;

  // Saving state
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const config: LiveLogicConfig = {
        disableApertura: hasAnyLogic,
      };

      if (minQtyEnabled) {
        config.minQty = { qty: Number(minQtyQty), offerPrice: Number(minQtyPrice) };
      }

      if (limitedTimeEnabled) {
        config.limitedTime = {
          expiresAt: new Date(ltExpiresAt).toISOString(),
          offerPrice: Number(ltOfferPrice),
        };
      }

      const newFeatures = setLiveLogicInFeatures(product.FEATURES || '', hasAnyLogic ? config : null);
      await onSave(product.$id, newFeatures);
      onClose();
    } catch (e: any) {
      alert('Error al guardar lógica: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLogic = async () => {
    if (!confirm('¿Quitar toda la Lógica Live Shopping de este producto?')) return;
    setSaving(true);
    try {
      const newFeatures = setLiveLogicInFeatures(product.FEATURES || '', null);
      await onSave(product.$id, newFeatures);
      onClose();
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const isLtActive = currentLogic.limitedTime && isLiveLogicLimitedTimeActive(currentLogic);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Lógica Live Shopping</h2>
                <p className="text-white/80 text-xs mt-0.5 truncate max-w-[280px]">{product.NAME}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Price reference */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wide">Precio base</p>
              <p className="font-bold text-lg">{fmt(basePrice)}</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wide">Precio −20% apertura</p>
              <p className="font-bold text-lg">{fmt(apertura20Price)}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('minQty')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'minQty' ? 'text-rose-600 border-b-2 border-rose-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Package className="w-4 h-4" /> Cantidad mínima
          </button>
          <button
            onClick={() => setActiveTab('limitedTime')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'limitedTime' ? 'text-rose-600 border-b-2 border-rose-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Clock className="w-4 h-4" /> Tiempo limitado
            {isLtActive && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          </button>
        </div>

        {/* Tab content */}
        <div className="p-5 space-y-4">

          {/* ── Cantidad mínima ── */}
          {activeTab === 'minQty' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Mínimo de compra para precio oferta</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    El cliente ve precio normal (−20%) hasta alcanzar la cantidad. Al llevar X o más, aplica tu precio.
                  </p>
                </div>
                <button
                  onClick={() => setMinQtyEnabled(!minQtyEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 mt-1 ${minQtyEnabled ? 'bg-rose-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${minQtyEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {minQtyEnabled && (
                <div className="bg-rose-50 rounded-xl p-4 space-y-3 border border-rose-100">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      Cantidad mínima para activar oferta
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMinQtyQty(q => Math.max(2, Number(q) - 1))}
                        className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center transition"
                      >−</button>
                      <input
                        type="number"
                        min={2}
                        value={minQtyQty}
                        onChange={e => setMinQtyQty(Number(e.target.value))}
                        className="w-20 text-center px-2 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                      <button
                        onClick={() => setMinQtyQty(q => Number(q) + 1)}
                        className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center transition"
                      >+</button>
                      <span className="text-xs text-gray-500 ml-1">unidades</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      Precio especial por unidad (al llevar {minQtyQty}+)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                      <input
                        type="number"
                        min={0}
                        value={minQtyPrice}
                        onChange={e => setMinQtyPrice(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <p className="text-[10px] text-gray-400">
                        Ref: −20% = <span className="font-semibold text-gray-600">{fmt(apertura20Price)}</span>
                      </p>
                      {minQtyPrice < basePrice && (
                        <p className="text-[10px] text-rose-600 font-semibold ml-auto">
                          −{Math.round(((basePrice - minQtyPrice) / basePrice) * 100)}% vs precio base
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-rose-100 text-xs text-gray-600 space-y-1">
                    <p>📦 <strong>Menos de {minQtyQty} unid.</strong> → precio con −20% apertura ({fmt(apertura20Price)})</p>
                    <p>🔥 <strong>{minQtyQty} o más unid.</strong> → precio especial: {fmt(minQtyPrice)} c/u</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Tiempo limitado ── */}
          {activeTab === 'limitedTime' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Oferta por tiempo limitado</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Un precio especial hasta la fecha/hora elegida. Al expirar, vuelve al precio con −20%.
                  </p>
                </div>
                <button
                  onClick={() => setLimitedTimeEnabled(!limitedTimeEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 mt-1 ${limitedTimeEnabled ? 'bg-rose-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${limitedTimeEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {limitedTimeEnabled && (
                <div className="bg-rose-50 rounded-xl p-4 space-y-3 border border-rose-100">
                  {isLtActive && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-xs font-semibold text-green-700">Oferta activa en este momento</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      La oferta expira el
                    </label>
                    <input
                      type="datetime-local"
                      value={ltExpiresAt}
                      onChange={e => setLtExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      Precio de oferta durante el tiempo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                      <input
                        type="number"
                        min={0}
                        value={ltOfferPrice}
                        onChange={e => setLtOfferPrice(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <p className="text-[10px] text-gray-400">
                        Ref: −20% = <span className="font-semibold text-gray-600">{fmt(apertura20Price)}</span>
                      </p>
                      {ltOfferPrice < basePrice && (
                        <p className="text-[10px] text-rose-600 font-semibold ml-auto">
                          −{Math.round(((basePrice - ltOfferPrice) / basePrice) * 100)}% vs precio base
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-rose-100 text-xs text-gray-600 space-y-1">
                    <p>⏰ <strong>Mientras dure el tiempo:</strong> {fmt(ltOfferPrice)}</p>
                    <p>🔄 <strong>Al expirar:</strong> vuelve a {fmt(apertura20Price)} (−20% apertura)</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active logic summary */}
          {hasAnyLogic && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800 flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>
                <strong>Apertura −20% desactivado</strong> para este producto mientras tenga lógica Live activa.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center gap-2">
          {currentLogic.minQty || currentLogic.limitedTime ? (
            <button
              onClick={handleRemoveLogic}
              disabled={saving}
              className="px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition border border-red-200 disabled:opacity-50"
            >
              Quitar lógica
            </button>
          ) : null}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition border border-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition disabled:opacity-60 flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</>
            ) : (
              <><Check className="w-4 h-4" /> Guardar lógica</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({
  p,
  thresholdTime,
  editingStock,
  setEditingStock,
  savingStockId,
  removingId,
  onSaveStock,
  onRemove,
  onOpenLogic,
}: {
  p: Product;
  thresholdTime: number;
  editingStock: { id: string; value: string } | null;
  setEditingStock: (v: { id: string; value: string } | null) => void;
  savingStockId: string | null;
  removingId: string | null;
  onSaveStock: (id: string) => void;
  onRemove: (id: string) => void;
  onOpenLogic: (p: Product) => void;
}) {
  const liveStatus = getLiveStatus(p, thresholdTime);
  const pSku = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku) || p.$id;
  const liveLogic = getLiveLogicFromFeatures(p.FEATURES);
  const hasLogic = !!(liveLogic?.minQty || liveLogic?.limitedTime);
  const ltActive = hasLogic && liveLogic?.limitedTime && isLiveLogicLimitedTimeActive(liveLogic);

  let rowBgClass = '';
  if (liveStatus === 'new') rowBgClass = 'bg-pink-50/50 hover:bg-pink-100/40 border-l-4 border-l-pink-400';
  else if (liveStatus === 'existing') rowBgClass = 'bg-amber-50/50 hover:bg-amber-100/40 border-l-4 border-l-amber-400';

  return (
    <tr className={`transition-colors ${rowBgClass}`}>
      {/* Product details */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
            {p.IMAGEURL ? (
              <img src={p.IMAGEURL} alt={p.NAME} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900 truncate max-w-[240px]">{p.NAME}</p>
              {liveStatus === 'new' && (
                <span className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white animate-pulse">Nuevo</span>
              )}
              {liveStatus === 'existing' && (
                <span className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">Ya estaba</span>
              )}
              {/* Logic indicators */}
              {hasLogic && (
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${ltActive ? 'bg-green-500 text-white animate-pulse' : 'bg-violet-500 text-white'}`}>
                  <Zap className="w-2.5 h-2.5" />
                  {ltActive ? 'Oferta activa' : liveLogic?.minQty ? `Mín. ${liveLogic.minQty.qty} ud.` : 'Lógica'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span className="font-mono font-medium">SKU: {pSku}</span>
              {p.PACKQTY && p.PACKQTY > 1 && (
                <><span>•</span><span className="text-pink-600 font-semibold">{p.PACKQTY} un/pack</span></>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Stock */}
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          {editingStock?.id === p.$id ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="0" value={editingStock.value}
                onChange={e => setEditingStock({ id: p.$id, value: e.target.value })}
                onKeyDown={e => { if (e.key === 'Enter') onSaveStock(p.$id); if (e.key === 'Escape') setEditingStock(null); }}
                autoFocus
                className="w-16 px-2.5 py-1 text-center border border-pink-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              />
              <button
                onClick={() => onSaveStock(p.$id)}
                disabled={savingStockId === p.$id}
                className="p-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition disabled:opacity-60 flex items-center justify-center"
              >
                {savingStockId === p.$id ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingStock({ id: p.$id, value: String(p.STOCK ?? 0) })}
              className={`text-base font-bold px-3 py-1 rounded-full border border-dashed transition-all hover:bg-gray-50 ${
                p.STOCK === 0 ? 'text-red-600 bg-red-50 border-red-200' : p.STOCK <= 5 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'
              }`}
              title="Haz click para cambiar el stock rápidamente"
            >
              {p.STOCK ?? 0}
            </button>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-4 text-right">
        {p.CURRENTPRICE && p.CURRENTPRICE < p.PRICE ? (
          <div>
            <span className="font-semibold text-rose-600">{fmt(p.CURRENTPRICE)}</span>
            <span className="text-xs text-gray-400 line-through ml-1.5">{fmt(p.PRICE)}</span>
          </div>
        ) : (
          <span className="font-semibold text-gray-900">{fmt(p.PRICE)}</span>
        )}
        {p.WHOLESALEPRICE ? (
          <p className="text-[10px] text-violet-500 font-semibold mt-0.5">Pack: {fmt(p.WHOLESALEPRICE)}</p>
        ) : null}
        {hasLogic && liveLogic?.minQty && (
          <p className="text-[10px] text-rose-500 font-semibold mt-0.5">
            ≥{liveLogic.minQty.qty} ud. → {fmt(liveLogic.minQty.offerPrice)}
          </p>
        )}
        {hasLogic && liveLogic?.limitedTime && (
          <p className={`text-[10px] font-semibold mt-0.5 ${ltActive ? 'text-green-600' : 'text-gray-400'}`}>
            {ltActive ? `⏰ ${fmt(liveLogic.limitedTime.offerPrice)}` : 'Tiempo expirado'}
          </p>
        )}
      </td>

      {/* Import time */}
      <td className="px-6 py-4 text-center text-gray-500 font-mono text-xs">
        {p.$createdAt ? fmtTime(p.$createdAt) : '—'}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {/* Logic button */}
          <button
            onClick={() => onOpenLogic(p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              hasLogic
                ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                : 'bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'
            }`}
            title="Configurar Lógica Live Shopping"
          >
            <Zap className="w-3.5 h-3.5" />
            {hasLogic ? 'Lógica ✓' : 'Lógica'}
          </button>

          {/* View in Store */}
          <a
            href={`/productos/${p.$id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all inline-flex items-center justify-center"
            title="Ver en tienda"
          >
            <Eye className="w-4 h-4" />
          </a>

          {/* Edit */}
          <Link
            href={`/admin/products?search=${pSku}`}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Ir a editar detalles en el catálogo general"
          >
            <Pencil className="w-4 h-4" />
          </Link>

          {/* Remove from live */}
          <button
            onClick={() => onRemove(p.$id)}
            disabled={removingId === p.$id}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
            title="Quitar de este Live (El producto permanece en catálogo)"
          >
            {removingId === p.$id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── History Session Card ─────────────────────────────────────────────────────

function SessionCard({ session }: { session: LiveSession }) {
  const [expanded, setExpanded] = useState(false);
  const isToday = session.dateKey === todayKey();

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isToday ? 'border-pink-200' : 'border-gray-100'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isToday ? 'bg-pink-100' : 'bg-gray-100'}`}>
            {isToday ? <ShoppingBag className="w-4 h-4 text-pink-600" /> : <History className="w-4 h-4 text-gray-500" />}
          </div>
          <div className="text-left">
            <p className={`font-semibold text-sm ${isToday ? 'text-pink-700' : 'text-gray-800'}`}>
              {isToday ? '🔴 Live de Hoy' : session.label}
            </p>
            <p className="text-xs text-gray-400">{session.products.length} producto(s)</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/80 text-gray-400 text-xs uppercase">
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3 text-center">Stock</th>
                  <th className="px-5 py-3 text-right">Precio</th>
                  <th className="px-5 py-3 text-center">Importado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {session.products.map(p => {
                  const pSku = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku) || p.$id;
                  const liveLogic = getLiveLogicFromFeatures(p.FEATURES);
                  const hasLogic = !!(liveLogic?.minQty || liveLogic?.limitedTime);
                  return (
                    <tr key={p.$id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {p.IMAGEURL ? <img src={p.IMAGEURL} alt={p.NAME} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-gray-300" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{p.NAME}</p>
                            <p className="text-[10px] text-gray-400 font-mono">SKU: {pSku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`font-bold text-sm px-2 py-0.5 rounded-full ${
                          (p.STOCK ?? 0) === 0 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                        }`}>{p.STOCK ?? 0}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className="font-semibold text-gray-900">{fmt(p.PRICE)}</p>
                        {hasLogic && liveLogic?.minQty && (
                          <p className="text-[10px] text-rose-500 font-semibold">≥{liveLogic.minQty.qty} → {fmt(liveLogic.minQty.offerPrice)}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500 font-mono text-xs">
                        {p.$createdAt ? fmtTime(p.$createdAt) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LiveShoppingAdminPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStock, setEditingStock] = useState<{ id: string; value: string } | null>(null);
  const [savingStockId, setSavingStockId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [logicProduct, setLogicProduct] = useState<Product | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const threshold = getLiveShoppingThreshold();
  const thresholdTime = threshold.getTime();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // Fetch today's live products + a week of history
      const oneWeekAgo = new Date(Date.now() - 7 * 86400000);

      const resp = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
        Query.greaterThanEqual('$createdAt', oneWeekAgo.toISOString()),
        Query.orderDesc('$createdAt'),
        Query.limit(500),
      ]);

      const docs = (resp.documents as unknown as Product[]).sort((a, b) => {
        const timeA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
        const timeB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setAllProducts(docs);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveStock = async (productId: string) => {
    if (!editingStock || editingStock.id !== productId) return;
    const newStock = parseInt(editingStock.value, 10);
    if (isNaN(newStock) || newStock < 0) { setEditingStock(null); return; }
    setSavingStockId(productId);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, productId, { STOCK: newStock });
      setAllProducts(prev => prev.map(p => p.$id === productId ? { ...p, STOCK: newStock } : p));
      setEditingStock(null);
    } catch (e: any) {
      alert('Error al actualizar stock: ' + e.message);
    } finally {
      setSavingStockId(null);
    }
  };

  const removeFromLive = async (productId: string) => {
    if (!confirm('¿Seguro que deseas quitar este producto de la transmisión de Live Shopping de hoy?')) return;
    setRemovingId(productId);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, productId, { $createdAt: '1970-01-01T00:00:00.000Z' });
      setAllProducts(prev => prev.filter(p => p.$id !== productId));
    } catch (e: any) {
      alert('Error al quitar de Live: ' + e.message);
    } finally {
      setRemovingId(null);
    }
  };

  const saveLogic = async (productId: string, newFeatures: string) => {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, productId, { FEATURES: newFeatures });
    setAllProducts(prev => prev.map(p => p.$id === productId ? { ...p, FEATURES: newFeatures } : p));
  };

  useEffect(() => { load(); }, [load]);

  // Separate today's live products from history
  const todayProducts = allProducts.filter(p => {
    if (!p.$createdAt) return false;
    return new Date(p.$createdAt).getTime() >= thresholdTime;
  });

  // Group history by date (past days only)
  const historyByDate = allProducts
    .filter(p => p.$createdAt && new Date(p.$createdAt).getTime() < thresholdTime)
    .reduce<Record<string, Product[]>>((acc, p) => {
      const key = new Date(p.$createdAt!).toISOString().slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {});

  const historySessions: LiveSession[] = Object.entries(historyByDate)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, products]) => ({
      dateKey,
      label: fmtDate(`${dateKey}T12:00:00`),
      products,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-pink-50 to-rose-50/30 p-6 rounded-2xl border border-pink-100/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-10 h-10 bg-rose-500 rounded-xl shadow-lg shadow-rose-200">
            <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-rose-400 opacity-75" />
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Live Shopping de Hoy 🛍️</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Productos en transmisión en vivo · Umbral: {threshold.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition shadow-sm ${
              showHistory ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" /> {showHistory ? 'Ocultar historial' : 'Ver historial'}
          </button>
          <Link
            href="/admin/products/bulk-add"
            className="flex items-center gap-1.5 px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Agregar más
          </Link>
          <button
            onClick={load}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-150 rounded-xl p-4 flex flex-wrap gap-6 items-center text-xs shadow-sm">
        <span className="font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
          </span>
          Estados:
        </span>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md bg-pink-50 border border-pink-200 border-l-4 border-l-pink-400 block shrink-0" /><span className="text-gray-600">Nuevos hoy</span></div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md bg-amber-50 border border-amber-200 border-l-4 border-l-amber-400 block shrink-0" /><span className="text-gray-600">Ya existían</span></div>
        <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold"><Zap className="w-2.5 h-2.5" />Lógica</span><span className="text-gray-600">Tiene lógica live activa</span></div>
        <span className="text-gray-400 ml-auto">
          Hoy en vivo: <span className="font-bold text-gray-900">{todayProducts.length}</span> producto(s)
        </span>
      </div>

      {/* Add by SKU block */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-pink-500" />
          <h2 className="text-sm font-bold text-gray-800">Agregar productos existentes al Live por SKU</h2>
        </div>
        <p className="text-xs text-gray-500">
          Ingresa uno o más SKUs (separados por coma o salto de línea). El sistema buscará los productos en el inventario general, los activará y los colocará en primer lugar en el Live Shopping de hoy.
        </p>
        <div className="flex gap-3 items-end">
          <textarea
            id="liveshopping-sku-input"
            placeholder="Ej: SKU100, SKU101, SKU102"
            rows={2}
            className="flex-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-gray-800"
          />
          <button
            type="button"
            id="btn-add-sku-live"
            onClick={async () => {
              const el = document.getElementById('liveshopping-sku-input') as HTMLInputElement;
              const text = el?.value || '';
              const skus = text
                .split(/[\n,]+/)
                .map(s => s.trim())
                .filter(Boolean);
              if (skus.length === 0) {
                alert('Ingresa al menos un SKU');
                return;
              }

              const btn = document.getElementById('btn-add-sku-live') as HTMLButtonElement;
              if (btn) {
                btn.disabled = true;
                btn.innerText = 'Cargando...';
              }
              
              try {
                const { databases } = getServices();
                const { databaseId } = getAppwriteConfig();
                
                let foundCount = 0;
                const notFoundSkus: string[] = [];
                const errorSkus: string[] = [];

                for (const sku of skus) {
                  try {
                    const resp = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
                      Query.equal('sku', sku),
                      Query.limit(1)
                    ]);
                    
                    if (resp.documents.length > 0) {
                      const prod = resp.documents[0];
                      const newStock = (prod.STOCK || 0) > 0 ? prod.STOCK : 1;
                      await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, prod.$id, {
                        $createdAt: new Date().toISOString(),
                        ISACTIVE: true,
                        STOCK: newStock
                      });
                      foundCount++;
                    } else {
                      notFoundSkus.push(sku);
                    }
                    await new Promise(r => setTimeout(r, 150));
                  } catch (err) {
                    console.error('Error adding SKU to Live:', sku, err);
                    errorSkus.push(sku);
                  }
                }

                let msg = `Carga finalizada.\n\n✅ ${foundCount} producto(s) agregados/actualizados para el Live de hoy.`;
                if (notFoundSkus.length > 0) {
                  msg += `\n\n⚠️ Los siguientes SKUs no se encontraron en el inventario:\n${notFoundSkus.join(', ')}`;
                }
                if (errorSkus.length > 0) {
                  msg += `\n\n❌ Hubo errores al procesar los siguientes SKUs:\n${errorSkus.join(', ')}`;
                }
                
                alert(msg);
                if (el) el.value = '';
                load();
              } catch (e: any) {
                alert('Error general: ' + e.message);
              } finally {
                if (btn) {
                  btn.disabled = false;
                  btn.innerText = 'Agregar a Live';
                }
              }
            }}
            className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shrink-0 h-10 transition"
          >
            Agregar a Live
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}
        </div>
      )}

      {/* Today's Live Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Precio</th>
                <th className="px-6 py-4 text-center">Hora de carga</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5].map(j => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : todayProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                      <p className="font-medium">No hay productos en el Live de hoy todavía</p>
                      <p className="text-xs">Usa la opción "Agregar Masivamente" para subir tus productos.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                todayProducts.map(p => (
                  <ProductRow
                    key={p.$id}
                    p={p}
                    thresholdTime={thresholdTime}
                    editingStock={editingStock}
                    setEditingStock={setEditingStock}
                    savingStockId={savingStockId}
                    removingId={removingId}
                    onSaveStock={saveStock}
                    onRemove={removeFromLive}
                    onOpenLogic={setLogicProduct}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History section */}
      {showHistory && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-gray-400" />
            <h2 className="text-base font-bold text-gray-700">Historial de sesiones pasadas (últimos 7 días)</h2>
          </div>
          {historySessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
              <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="font-medium">Sin historial aún</p>
              <p className="text-xs mt-1">Los liveshoppings pasados aparecerán aquí con fecha y productos.</p>
            </div>
          ) : (
            historySessions.map(session => (
              <SessionCard key={session.dateKey} session={session} />
            ))
          )}
        </div>
      )}

      {/* Live Logic Modal */}
      {logicProduct && (
        <LiveLogicModal
          product={logicProduct}
          onClose={() => setLogicProduct(null)}
          onSave={saveLogic}
        />
      )}
    </div>
  );
}
