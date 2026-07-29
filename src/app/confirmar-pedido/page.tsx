'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CHILE_REGIONES } from '@/types';

interface AgencyOption {
  name: string;
  color: string;
  bg: string;
  desc: string;
  active: boolean;
}

const AGENCIES: AgencyOption[] = [
  { name: 'STARKEN', color: '#1a7f37', bg: '#e6f4ea', desc: 'Tarifa económica - Cobertura Nacional', active: true },
  { name: 'PULLMAN CARGO', color: '#002855', bg: '#e6f0fa', desc: 'Tarifa económica - Ideal para cajas grandes', active: true },
  { name: 'VARMONTT', color: '#c62828', bg: '#fce8e6', desc: 'Tarifa económica - Especialistas al Sur de Chile', active: true },
  { name: 'BLUEXPRESS', color: '#0d4ea3', bg: '#e3f2fd', desc: 'Envío rápido - Cobertura Nacional', active: true },
  { name: 'CHILEXPRESS', color: '#d22630', bg: '#fce4ec', desc: 'Envío rápido - Cobertura Nacional', active: true },
  { name: 'RETIRO EN TIENDA', color: '#7c3aed', bg: '#f5f3ff', desc: 'Retiro en tienda - Toesca 2537, Santiago', active: true },
];

const BANK_DETAILS = {
  holder: 'DON BALATO IVAN',
  rut: '7826749898',
  bank: 'Mercado Pago',
  type: 'Cuenta Vista',
  number: '1037879898',
  email: 'donbalatosoporte@gmail.com',
};

interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  total: number;
}

function ConfirmarPedidoContent() {
  const params = useSearchParams();
  const code = params.get('code');
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [address, setAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [agency, setAgency] = useState('');

  const comunas = region ? CHILE_REGIONES[region] || [] : [];

  useEffect(() => {
    if (!code) return;
    (async () => {
      try {
        const res = await fetch(`/api/catalogo/order?code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (data.error) { setError(data.error); return; }
        setOrder(data.order);
        if (data.order.STATUS === 'processing' || data.order.STATUS === 'shipped' || data.order.STATUS === 'delivered') {
          setSuccess(true);
          setLoading(false);
          return;
        }
        const parsed = JSON.parse(data.order.ITEMS || '[]');
        setItems(parsed.map((i: any) => ({
          sku: i.sku || '',
          name: i.name || '',
          qty: i.qty || 1,
          price: i.price || 0,
          total: (i.qty || 1) * (i.price || 0),
        })));
        if (data.order.REGION) setRegion(data.order.REGION);
        if (data.order.COMUNA) setComuna(data.order.COMUNA);
        if (data.order.ADDRESS) setAddress(data.order.ADDRESS);
        if (data.order.ADDITIONALINFO) setAdditionalInfo(data.order.ADDITIONALINFO);
        if (data.order.SHIPPINGAGENCY) setAgency(data.order.SHIPPINGAGENCY);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const total = items.reduce((s, i) => s + i.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region || !comuna || !address) { setError('Completa región, comuna y dirección'); return; }
    if (!file) { setError('Sube tu comprobante de pago'); return; }
    setSaving(true);
    setError('');
    try {
      // 1. Upload payment proof
      const formData = new FormData();
      formData.append('orderCode', code || '');
      formData.append('file', file);
      const proofRes = await fetch('/api/catalogo/upload-proof', {
        method: 'POST',
        body: formData,
      });
      const proofData = await proofRes.json();
      if (proofData.error) { setError(proofData.error); return; }

      // 2. Save shipping data
      const shipRes = await fetch('/api/catalogo/shipping-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: code, region, comuna, address, additionalInfo, shippingAgency: agency }),
      });
      const shipData = await shipRes.json();
      if (shipData.error) { setError(shipData.error); return; }

      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg">Cargando pedido...</div>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Todo listo!</h1>
          <p className="text-gray-500">Tu comprobante y datos de envío fueron recibidos. El pedido {code} está en proceso. Te avisaremos pronto. 😊</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-6 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">Confirmar pedido</h1>
          <p className="text-indigo-200 text-sm mt-1">Código: <span className="font-mono font-bold">{code}</span></p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Productos confirmados */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-3">Productos confirmados</h2>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.qty} x ${item.price.toLocaleString('es-CL')} = <span className="font-bold">${item.total.toLocaleString('es-CL')}</span></p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-gray-100">
            <span className="font-bold text-gray-700">Total:</span>
            <span className="text-2xl font-bold text-indigo-600">${total.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* Datos bancarios */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <h2 className="font-bold text-blue-800 mb-3">Datos para transferir</h2>
          <div className="space-y-1 text-sm text-blue-900">
            <p><span className="font-semibold">Titular:</span> {BANK_DETAILS.holder}</p>
            <p><span className="font-semibold">RUT:</span> {BANK_DETAILS.rut}</p>
            <p><span className="font-semibold">Banco:</span> {BANK_DETAILS.bank}</p>
            <p><span className="font-semibold">Tipo:</span> {BANK_DETAILS.type}</p>
            <p><span className="font-semibold">N° Cuenta:</span> {BANK_DETAILS.number}</p>
            <p><span className="font-semibold">Email:</span> {BANK_DETAILS.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subir comprobante */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-3">Subir comprobante de pago</h2>
            <p className="text-sm text-gray-500 mb-3">Toma una foto o sube una imagen del comprobante de transferencia.</p>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {file && (
              <div className="mt-3">
                <img src={URL.createObjectURL(file)} alt="comprobante" className="max-h-48 rounded-xl object-contain" />
                <p className="text-xs text-green-600 mt-1 font-semibold">{file.name} ✓</p>
              </div>
            )}
          </div>

          {/* Datos de envío */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-3">Datos de envío</h2>

            {/* Agencia */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {AGENCIES.map(ag => {
                const sel = agency === ag.name;
                return (
                  <button
                    type="button"
                    key={ag.name}
                    onClick={() => {
                      setAgency(ag.name);
                      if (ag.name === 'RETIRO EN TIENDA') {
                        setRegion('Región Metropolitana');
                        setComuna('Santiago');
                        setAddress('Toesca 2537, Santiago Centro, Chile');
                      }
                    }}
                    style={{ padding: '10px 6px', border: `2px solid ${sel ? ag.color : '#e5e7eb'}`, borderRadius: 12, background: sel ? ag.bg : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all .2s' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: sel ? ag.color : '#6b7280' }}>{ag.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Región */}
            <div className="mb-3">
              <label className="text-sm font-bold text-gray-700 mb-1 block">Región</label>
              <select
                value={region}
                onChange={e => { setRegion(e.target.value); setComuna(''); }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm">
                <option value="">Selecciona región</option>
                {Object.keys(CHILE_REGIONES).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Comuna */}
            <div className="mb-3">
              <label className="text-sm font-bold text-gray-700 mb-1 block">Comuna</label>
              <select
                value={comuna}
                onChange={e => setComuna(e.target.value)}
                disabled={!region}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm disabled:opacity-50">
                <option value="">Selecciona comuna</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="text-sm font-bold text-gray-700 mb-1 block">Dirección</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Calle, número, depto/block"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm" />
            </div>

            {/* Info adicional */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Información adicional (opcional)</label>
              <textarea
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
                placeholder="Referencias, horarios, etc."
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm resize-none" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-20">
            <div className="max-w-2xl mx-auto">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50">
                {saving ? 'Enviando...' : 'Enviar comprobante y datos de envío'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ConfirmarPedidoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Cargando...</div></div>}>
      <ConfirmarPedidoContent />
    </Suspense>
  );
}
