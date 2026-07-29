'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ComprobanteContent() {
  const params = useSearchParams();
  const code = params.get('code');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!code) return;
    (async () => {
      try {
        const res = await fetch(`/api/catalogo/order?code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (data.error) { setError(data.error); return; }
        setOrder(data.order);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !code) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('orderCode', code);
      formData.append('file', file);
      const res = await fetch('/api/catalogo/upload-proof', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg">Cargando...</div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl font-bold mb-2">Error</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Comprobante subido!</h1>
          <p className="text-gray-500">El pedido {code} quedó en estado "por verificar". El administrador revisará el pago pronto.</p>
        </div>
      </div>
    );
  }

  const items = (() => { try { return JSON.parse(order?.ITEMS || '[]'); } catch { return []; } })();

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">Subir Comprobante</h1>
          <p className="text-sm text-gray-500">Pedido <span className="font-mono font-bold text-indigo-600">{code}</span></p>
          <p className="text-sm text-gray-500">Cliente: <span className="font-semibold">{order?.CUSTOMERNAME}</span> · {order?.CUSTOMERPHONE}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Order summary */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h2 className="font-bold text-gray-800 mb-3">Resumen del pedido</h2>
          {items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />}
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">{item.name}</div>
                <div className="text-xs text-gray-400">{item.qty} x ${item.price?.toLocaleString('es-CL')}</div>
              </div>
              <div className="text-sm font-bold text-gray-700">${item.total?.toLocaleString('es-CL')}</div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-xl font-bold text-gray-800">${order?.TOTAL?.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-bold text-gray-800 mb-2">Comprobante de pago</h2>
          <p className="text-sm text-gray-500 mb-4">Sube la foto o PDF del comprobante de transferencia que envió el cliente.</p>
          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
          <label className={`block ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <input type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
            <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-8 text-center bg-blue-50/10 transition">
              {uploading ? (
                <div className="text-blue-500 font-semibold">Subiendo...</div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-blue-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <div className="text-blue-600 font-semibold">Toca para subir comprobante</div>
                  <div className="text-xs text-gray-400 mt-1">JPG, PNG o PDF</div>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default function ComprobantePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Cargando...</div></div>}>
      <ComprobanteContent />
    </Suspense>
  );
}
