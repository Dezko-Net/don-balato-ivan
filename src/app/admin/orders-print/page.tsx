'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order } from '@/types/admin';
import { Loader2 } from 'lucide-react';

const SHORT_LABEL: Record<string, string> = {
  pending:            'Pendiente',
  processing:         'Recibido',
  paid:               'Verificado',
  assembling:         'Etiqueta',
  confirming_stock:   'Confirmando',
  stock_confirmed:    'Confirmado',
  packing:            'Embalando',
  negotiation:        'Negociación',
  preparing_shipping: 'Etiqueta',
  ready_to_ship:      'Despachar',
  shipped:            'Salió',
  delivered:          'Entregado',
  cancelled:          'Cancelado',
};

function PrintContent() {
  const searchParams = useSearchParams();
  const statusesParam = searchParams.get('statuses') || '';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!statusesParam) {
        setLoading(false);
        return;
      }
      
      const statusesToFetch = statusesParam.split(',').filter(Boolean);
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      try {
        const queries = [
          Query.equal('STATUS', statusesToFetch),
          Query.orderAsc('CREATEDAT'),
          Query.limit(500)
        ];

        const resp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, queries);
        setOrders(resp.documents as unknown as Order[]);
      } catch (err) {
        console.error('Error fetching orders for print:', err);
      } finally {
        setLoading(false);
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    }
    loadOrders();
  }, [statusesParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <span className="ml-2 text-gray-500">Preparando lista...</span>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white text-black p-4 sm:p-8 min-h-screen print:p-0">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: portrait; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
          .no-print { display: none !important; }
          .print-break-inside-avoid { break-inside: avoid; }
        }
      `}} />

      <div className="flex justify-between items-end mb-6 border-b border-gray-300 pb-2">
        <div>
          <h1 className="text-2xl font-black">Checklist de Pedidos</h1>
          <p className="text-sm text-gray-600">Estados: {statusesParam.split(',').map(s => SHORT_LABEL[s] || s).join(', ')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Generado: {dateStr}</p>
          <p className="text-sm font-bold mt-1">Total: {orders.length} pedidos</p>
        </div>
      </div>

      <button onClick={() => window.print()} className="no-print mb-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold shadow-sm">
        Imprimir Ahora
      </button>

      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300 print:bg-gray-200">
            <th className="border border-gray-300 p-2 text-center w-12">✓</th>
            <th className="border border-gray-300 p-2 text-left w-24">Código</th>
            <th className="border border-gray-300 p-2 text-left w-48">Cliente</th>
            <th className="border border-gray-300 p-2 text-center w-24">Estado</th>
            <th className="border border-gray-300 p-2 text-left">Resumen Items</th>
            <th className="border border-gray-300 p-2 text-left w-48">Agencia</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.$id} className="border-b border-gray-300 print-break-inside-avoid hover:bg-gray-50">
              <td className="border border-gray-300 p-2 text-center align-middle">
                <div className="w-5 h-5 border-2 border-gray-400 rounded-sm inline-block bg-white"></div>
              </td>
              <td className="border border-gray-300 p-2 font-bold whitespace-nowrap">{o.ORDERCODE}</td>
              <td className="border border-gray-300 p-2">{o.CUSTOMERNAME || o.CUSTOMERRUT || 'Anónimo'}</td>
              <td className="border border-gray-300 p-2 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {SHORT_LABEL[o.STATUS] || o.STATUS}
                </span>
              </td>
              <td className="border border-gray-300 p-2 text-xs text-gray-600">
                {(() => {
                  try {
                    const items = JSON.parse(o.ITEMS || '[]') as any[];
                    if (!items.length) return '-';
                    return (
                      <ul className="list-disc pl-4 space-y-0.5">
                        {items.slice(0, 5).map((it: any, i: number) => (
                          <li key={i} className="line-clamp-1">{it.quantity}x {it.name || it.sku}</li>
                        ))}
                        {items.length > 5 && <li className="italic text-gray-500">...y {items.length - 5} más</li>}
                      </ul>
                    );
                  } catch {
                    return '-';
                  }
                })()}
              </td>
              <td className="border border-gray-300 p-2 text-xs">
                {o.SHIPPINGAGENCY}
                {o.TRACKINGNUMBER ? <div className="text-gray-500 mt-0.5">Trk: {o.TRACKINGNUMBER}</div> : null}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500 italic border border-gray-300">
                No hay pedidos en estos estados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function OrdersPrintPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando...</div>}>
      <PrintContent />
    </Suspense>
  );
}
