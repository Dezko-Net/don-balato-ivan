'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order } from '@/types/admin';
import { RefreshCw, Package, CheckCircle, Truck, Eye, AlertTriangle, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function ChecklistPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      // Cargar pedidos en estado "shipped" (Embalado) y "checklist"
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

  const moveToDelivered = async (orderId: string) => {
    if (!confirm('Confirmar entrega a agencia? Asegurate de haber subido el comprobante o numero de seguimiento.')) return;
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus: 'delivered' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert('Error: ' + (data.error || 'No se pudo actualizar'));
        return;
      }
      setOrders(prev => prev.filter(o => o.$id !== orderId));
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const fmt = (n: number) => '$' + (n || 0).toLocaleString('es-CL');

  const shippedOrders = orders.filter(o => o.STATUS === 'shipped');
  const checklistOrders = orders.filter(o => o.STATUS === 'checklist');

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-cyan-500" />
            Checklist de Despacho
          </h1>
          <p className="text-sm text-gray-500 mt-1">Verifica bultos antes de entregar a la agencia</p>
        </div>
        <button onClick={loadOrders} disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Embalados - pendientes de checklist */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-violet-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Embalados ({shippedOrders.length})
        </h2>
        {shippedOrders.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
            <Inbox className="w-8 h-8" />
            No hay pedidos embalados pendientes de checklist
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shippedOrders.map(o => {
              let boxPhotos: string[] = [];
              try { boxPhotos = JSON.parse((o as any).BOXPHOTOS || '[]'); } catch {}
              const bultoCount = (o as any).BULTOCOUNT || 0;
              const hasChecklistData = bultoCount > 0 && boxPhotos.length > 0;
              return (
                <div key={o.$id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{o.ORDERCODE || '#' + o.$id.slice(-6)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Embalado</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold">{o.CUSTOMERNAME}</p>
                    <p>{o.ADDRESS || 'Sin direccion'}, {o.COMUNA} {o.REGION}</p>
                    <p className="text-gray-400">{o.SHIPPINGAGENCY || 'Sin agencia'}</p>
                  </div>
                  <div className="text-xs font-bold text-gray-700">
                    Total: {fmt(o.TOTAL)}
                  </div>
                  {hasChecklistData && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-700 bg-cyan-50 rounded-lg px-2 py-1">
                      <CheckCircle className="w-3 h-3" />
                      {bultoCount} bulto(s) - {boxPhotos.length} foto(s)
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <Link href={`/admin/orders/${o.$id}`}
                      className="flex-1 text-center text-xs font-bold px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" /> Ver detalle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Checklist - listos para entregar a agencia */}
      <div>
        <h2 className="text-sm font-bold text-cyan-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Listos para entregar a agencia ({checklistOrders.length})
        </h2>
        {checklistOrders.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
            <Inbox className="w-8 h-8" />
            No hay pedidos en checklist pendientes de entrega
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {checklistOrders.map(o => {
              let boxPhotos: string[] = [];
              try { boxPhotos = JSON.parse((o as any).BOXPHOTOS || '[]'); } catch {}
              const bultoCount = (o as any).BULTOCOUNT || 0;
              const hasShippingProof = !!(o as any).SHIPPINGPROOFURL;
              const hasTracking = !!(o as any).TRACKINGNUMBER;
              const canDeliver = hasShippingProof || hasTracking;
              return (
                <div key={o.$id} className="bg-white rounded-xl border border-cyan-200 shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{o.ORDERCODE || '#' + o.$id.slice(-6)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">Checklist</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold">{o.CUSTOMERNAME}</p>
                    <p>{o.ADDRESS || 'Sin direccion'}, {o.COMUNA} {o.REGION}</p>
                    <p className="text-gray-400">{o.SHIPPINGAGENCY || 'Sin agencia'}</p>
                  </div>
                  <div className="text-xs font-bold text-gray-700">
                    Total: {fmt(o.TOTAL)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-700 bg-cyan-50 rounded-lg px-2 py-1">
                    <CheckCircle className="w-3 h-3" />
                    {bultoCount} bulto(s) - {boxPhotos.length} foto(s)
                  </div>
                  {boxPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {boxPhotos.slice(0, 4).map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt={`Bulto ${i+1}`} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                        </a>
                      ))}
                      {boxPhotos.length > 4 && <span className="text-[10px] text-gray-400 self-center">+{boxPhotos.length - 4} mas</span>}
                    </div>
                  )}
                  {!canDeliver && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 rounded-lg px-2 py-1">
                      <AlertTriangle className="w-3 h-3" />
                      Falta comprobante o N de seguimiento
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <Link href={`/admin/orders/${o.$id}`}
                      className="flex-1 text-center text-xs font-bold px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" /> Ver detalle
                    </Link>
                    <button onClick={() => moveToDelivered(o.$id)} disabled={updatingId === o.$id || !canDeliver}
                      className="flex-1 text-xs font-bold px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-1">
                      <Truck className="w-3 h-3" />
                      {updatingId === o.$id ? '...' : 'Entregar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
