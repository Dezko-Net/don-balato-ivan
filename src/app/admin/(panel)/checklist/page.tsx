'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order } from '@/types/admin';
import { RefreshCw, Package, CheckCircle, Truck, ArrowLeft, Camera, X, AlertTriangle, Inbox, MapPin, User, Hash, DollarSign, Edit2 } from 'lucide-react';

interface BoxPhoto {
  bulto: number;
  url: string;
}

export default function ChecklistPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const res = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
        Query.equal('STATUS', ['shipped', 'checklist']),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ]);
      setOrders(res.documents as unknown as Order[]);
    } catch (err: any) {
      console.error('Error loading checklist orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const fmt = (n: number) => '$' + (n || 0).toLocaleString('es-CL');

  const shippedOrders = orders.filter(o => o.STATUS === 'shipped');
  const checklistOrders = orders.filter(o => o.STATUS === 'checklist');

  // ── Vista detalle (tarjeta seleccionada) ──
  if (selectedOrder) {
    return (
      <ChecklistDetail
        order={selectedOrder}
        onBack={() => { setSelectedOrder(null); loadOrders(); }}
        fmt={fmt}
      />
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
            Checklist de Despacho
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Verifica bultos antes de entregar a la agencia</p>
        </div>
        <button onClick={loadOrders} disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 transition active:scale-95">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>

      {/* Embalados - pendientes de checklist */}
      <div className="mb-6">
        <h2 className="text-xs sm:text-sm font-bold text-violet-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Embalados ({shippedOrders.length})
        </h2>
        {shippedOrders.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
            <Inbox className="w-7 h-7" />
            No hay pedidos embalados pendientes
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {shippedOrders.map(o => {
              let boxPhotos: BoxPhoto[] = [];
              try { boxPhotos = JSON.parse((o as any).BOXPHOTOS || '[]'); } catch {}
              const bultoCount = (o as any).BULTOCOUNT || 0;
              const hasData = bultoCount > 0;
              return (
                <button
                  key={o.$id}
                  onClick={() => setSelectedOrder(o)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 flex flex-col gap-2 text-left hover:border-violet-300 hover:shadow-md transition active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{o.ORDERCODE || '#' + o.$id.slice(-6)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Embalado</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p className="font-semibold truncate">{o.CUSTOMERNAME || 'Sin nombre'}</p>
                    <p className="truncate">{o.ADDRESS || 'Sin dirección'}</p>
                    <p className="text-gray-400 truncate">{o.COMUNA} · {o.SHIPPINGAGENCY || 'Sin agencia'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-gray-700">{fmt(o.TOTAL)}</span>
                    {hasData ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-700 bg-cyan-50 rounded-lg px-2 py-0.5">
                        <CheckCircle className="w-3 h-3" />
                        {bultoCount} bulto(s) · {boxPhotos.length} foto(s)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 rounded-lg px-2 py-0.5">
                        <Camera className="w-3 h-3" />
                        Pendiente
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Checklist - listos para entregar a agencia */}
      {checklistOrders.length > 0 && (
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-cyan-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Listos para entregar ({checklistOrders.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {checklistOrders.map(o => {
              let boxPhotos: BoxPhoto[] = [];
              try { boxPhotos = JSON.parse((o as any).BOXPHOTOS || '[]'); } catch {}
              const bultoCount = (o as any).BULTOCOUNT || 0;
              return (
                <button
                  key={o.$id}
                  onClick={() => setSelectedOrder(o)}
                  className="bg-white rounded-xl border border-cyan-200 shadow-sm p-3 sm:p-4 flex flex-col gap-2 text-left hover:border-cyan-400 hover:shadow-md transition active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{o.ORDERCODE || '#' + o.$id.slice(-6)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">Checklist</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p className="font-semibold truncate">{o.CUSTOMERNAME || 'Sin nombre'}</p>
                    <p className="truncate">{o.ADDRESS || 'Sin dirección'}</p>
                    <p className="text-gray-400 truncate">{o.COMUNA} · {o.SHIPPINGAGENCY || 'Sin agencia'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-gray-700">{fmt(o.TOTAL)}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-700 bg-cyan-50 rounded-lg px-2 py-0.5">
                      <CheckCircle className="w-3 h-3" />
                      {bultoCount} bulto(s) · {boxPhotos.length} foto(s)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Vista detalle del pedido ──────────────────────────────────────────────────
function ChecklistDetail({ order, onBack, fmt }: { order: Order; onBack: () => void; fmt: (n: number) => string }) {
  const [bultoCount, setBultoCount] = useState<number>((order as any).BULTOCOUNT || 0);
  const [boxPhotos, setBoxPhotos] = useState<BoxPhoto[]>([]);
  const [uploadingBulto, setUploadingBulto] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [editingBultos, setEditingBultos] = useState(false);
  const [error, setError] = useState('');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    try { setBoxPhotos(JSON.parse((order as any).BOXPHOTOS || '[]')); } catch {}
    setBultoCount((order as any).BULTOCOUNT || 0);
  }, [order]);

  const isChecklist = order.STATUS === 'checklist';

  // Guardar cantidad de bultos
  const saveBultoCount = async (count: number) => {
    setBultoCount(count);
    setEditingBultos(false);
    try {
      await fetch('/api/admin/orders/upload-box-photos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.$id, bultoCount: count }),
      });
    } catch (e) {
      console.error('Error guardando bulto count:', e);
    }
  };

  // Subir foto de un bulto
  const handleFileUpload = async (bultoNum: number, file: File) => {
    setUploadingBulto(bultoNum);
    setError('');
    try {
      const formData = new FormData();
      formData.append('orderId', order.$id);
      formData.append('bultoIndex', String(bultoNum));
      formData.append('file', file);

      const res = await fetch('/api/admin/orders/upload-box-photos', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Error al subir foto');
        return;
      }
      setBoxPhotos(data.boxPhotos || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploadingBulto(null);
    }
  };

  // Eliminar foto de un bulto
  const handleDeletePhoto = async (bultoNum: number) => {
    try {
      const res = await fetch('/api/admin/orders/upload-box-photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.$id, bultoIndex: bultoNum }),
      });
      const data = await res.json();
      if (data.success) {
        setBoxPhotos(data.boxPhotos || []);
      }
    } catch (e) {
      console.error('Error eliminando foto:', e);
    }
  };

  // Confirmar checklist
  const handleConfirm = async () => {
    if (bultoCount === 0) {
      setError('Primero selecciona cuántos bultos tiene el pedido');
      return;
    }
    const uploadedCount = boxPhotos.length;
    if (uploadedCount < bultoCount) {
      setError(`Faltan fotos. Subiste ${uploadedCount} de ${bultoCount} bultos`);
      return;
    }
    setConfirming(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.$id, newStatus: 'checklist' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Error al confirmar');
        return;
      }
      onBack();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setConfirming(false);
    }
  };

  const getPhotoForBulto = (bultoNum: number) => boxPhotos.find(p => p.bulto === bultoNum);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header fijo */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 active:scale-95 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-bold text-gray-900">{order.ORDERCODE || '#' + order.$id.slice(-6)}</h1>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isChecklist ? 'bg-cyan-100 text-cyan-700' : 'bg-violet-100 text-violet-700'}`}>
            {isChecklist ? 'Checklist' : 'Embalado'}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Datos del cliente */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2.5">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Datos del pedido</h2>
          <div className="flex items-start gap-2.5 text-sm">
            <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">{order.CUSTOMERNAME || 'Sin nombre'}</p>
              {order.CUSTOMERPHONE && <p className="text-xs text-gray-500">{order.CUSTOMERPHONE}</p>}
            </div>
          </div>
          {order.CUSTOMERRUT && (
            <div className="flex items-center gap-2.5 text-sm">
              <Hash className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">{order.CUSTOMERRUT}</span>
            </div>
          )}
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-gray-700">{order.ADDRESS || 'Sin dirección'}</p>
              <p className="text-xs text-gray-500">{order.COMUNA} · {order.REGION}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Truck className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-700 font-semibold">{order.SHIPPINGAGENCY || 'Sin agencia'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm pt-1 border-t border-gray-100">
            <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="font-bold text-gray-900">{fmt(order.TOTAL)}</span>
          </div>
        </div>

        {/* Selector de bultos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Cantidad de bultos</h2>
            {bultoCount > 0 && !editingBultos && !isChecklist && (
              <button onClick={() => setEditingBultos(true)}
                className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
                <Edit2 className="w-3 h-3" />
                Cambiar
              </button>
            )}
          </div>

          {bultoCount === 0 || editingBultos ? (
            <div>
              <p className="text-xs text-gray-500 mb-3">¿Cuántos bultos tiene este pedido?</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => saveBultoCount(n)}
                    className={`py-3 rounded-xl font-bold text-lg transition active:scale-95 ${
                      bultoCount === n
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {[6, 7, 8, 9, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => saveBultoCount(n)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition active:scale-95 ${
                      bultoCount === n
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
                <Package className="w-7 h-7 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{bultoCount}</p>
                <p className="text-xs text-gray-500">{bultoCount === 1 ? 'bulto' : 'bultos'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Fotos de bultos */}
        {bultoCount > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Fotos de bultos</h2>
            <p className="text-xs text-gray-500 mb-3">Sube una foto para cada bulto</p>

            <div className="space-y-3">
              {Array.from({ length: bultoCount }, (_, i) => i + 1).map(bultoNum => {
                const photo = getPhotoForBulto(bultoNum);
                const isUploading = uploadingBulto === bultoNum;
                return (
                  <div key={bultoNum} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                      {bultoNum}
                    </div>

                    <input
                      ref={el => { fileInputRefs.current[bultoNum] = el; }}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(bultoNum, file);
                        e.target.value = '';
                      }}
                    />

                    {photo ? (
                      <div className="flex-1 flex items-center gap-2">
                        <a href={photo.url} target="_blank" rel="noreferrer"
                          className="w-16 h-16 rounded-xl overflow-hidden border-2 border-green-200 shrink-0">
                          <img src={photo.url} alt={`Bulto ${bultoNum}`} className="w-full h-full object-cover" />
                        </a>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Foto subida
                          </p>
                          {!isChecklist && (
                            <div className="flex gap-2 mt-1">
                              <button onClick={() => fileInputRefs.current[bultoNum]?.click()}
                                className="text-xs font-semibold text-violet-600 hover:text-violet-700">
                                Cambiar
                              </button>
                              <button onClick={() => handleDeletePhoto(bultoNum)}
                                className="text-xs font-semibold text-red-500 hover:text-red-600">
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : isUploading ? (
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <div className="w-5 h-5 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
                        </div>
                        <p className="text-xs text-gray-500">Subiendo...</p>
                      </div>
                    ) : isChecklist ? (
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                          <Camera className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-xs text-gray-400">Sin foto</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[bultoNum]?.click()}
                        className="flex-1 flex items-center gap-2 py-3 px-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-violet-400 hover:bg-violet-50 transition active:scale-[0.98]"
                      >
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600">Subir foto bulto {bultoNum}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-gray-500">Progreso</span>
                <span className="font-bold text-gray-700">{boxPhotos.length}/{bultoCount}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${(boxPhotos.length / bultoCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Botón confirmar fijo abajo */}
      {!isChecklist && bultoCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 sm:px-6 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleConfirm}
              disabled={confirming || boxPhotos.length < bultoCount}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 ${
                boxPhotos.length >= bultoCount && !confirming
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {confirming ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirmar Checklist ({boxPhotos.length}/{bultoCount} fotos)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
