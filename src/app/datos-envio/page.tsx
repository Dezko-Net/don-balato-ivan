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
  logo: string;
  active: boolean;
}

const FALLBACK_AGENCIES: AgencyOption[] = [
  { name: 'STARKEN', color: '#1a7f37', bg: '#e6f4ea', desc: 'Tarifa económica - Cobertura Nacional', logo: '', active: true },
  { name: 'PULLMAN CARGO', color: '#002855', bg: '#e6f0fa', desc: 'Tarifa económica - Ideal para cajas grandes', logo: '', active: true },
  { name: 'VARMONTT', color: '#c62828', bg: '#fce8e6', desc: 'Tarifa económica - Especialistas al Sur de Chile', logo: '', active: true },
  { name: 'BLUEXPRESS', color: '#0d4ea3', bg: '#e3f2fd', desc: 'Envío rápido - Cobertura Nacional', logo: '', active: true },
  { name: 'CHILEXPRESS', color: '#d22630', bg: '#fce4ec', desc: 'Envío rápido - Cobertura Nacional', logo: '', active: true },
  { name: 'RETIRO EN TIENDA', color: '#7c3aed', bg: '#f5f3ff', desc: 'Retiro en tienda - Toesca 2537, Santiago', logo: '', active: true },
];

const ACCESS_PASSWORD = 'redes123';

function DatosEnvioContent() {
  const params = useSearchParams();
  const code = params.get('code');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

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
        // Pre-fill if order already has some data
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region || !comuna || !address) { setError('Completa región, comuna y dirección'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/catalogo/shipping-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: code, region, comuna, address, additionalInfo, shippingAgency: agency }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
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
        <div className="text-gray-400 text-lg">Cargando...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Acceso restringido</h1>
          <p className="text-sm text-gray-500 mb-4">Esta página es solo para uso interno. Ingresa la contraseña.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && passwordInput === ACCESS_PASSWORD) setAuthed(true); }}
            placeholder="Contraseña"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-center font-semibold mb-3"
          />
          <button
            onClick={() => { if (passwordInput === ACCESS_PASSWORD) setAuthed(true); else setError('Contraseña incorrecta'); }}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition">
            Ingresar
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Datos guardados!</h1>
          <p className="text-gray-500">El pedido {code} tiene los datos de envío registrados y pasó a estado "en proceso".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">Datos de Envío</h1>
          <p className="text-sm text-gray-500">Pedido <span className="font-mono font-bold text-indigo-600">{code}</span></p>
          <p className="text-sm text-gray-500">Cliente: <span className="font-semibold">{order?.CUSTOMERNAME}</span> · {order?.CUSTOMERPHONE}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>}

        {/* Agency selection */}
        <div className="bg-white rounded-2xl p-4">
          <label className="text-sm font-bold text-gray-700 mb-3 block">Agencia de envío</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FALLBACK_AGENCIES.map(ag => (
              <button
                key={ag.name}
                type="button"
                onClick={() => setAgency(ag.name)}
                className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition ${agency === ag.name ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                {ag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="bg-white rounded-2xl p-4">
          <label className="text-sm font-bold text-gray-700 mb-2 block">Región *</label>
          <select
            value={region}
            onChange={e => { setRegion(e.target.value); setComuna(''); }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm"
            required>
            <option value="">Selecciona región</option>
            {Object.keys(CHILE_REGIONES).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Comuna */}
        <div className="bg-white rounded-2xl p-4">
          <label className="text-sm font-bold text-gray-700 mb-2 block">Comuna *</label>
          <select
            value={comuna}
            onChange={e => setComuna(e.target.value)}
            disabled={!region}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm disabled:opacity-50"
            required>
            <option value="">Selecciona comuna</option>
            {comunas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-4">
          <label className="text-sm font-bold text-gray-700 mb-2 block">Dirección *</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Ej: Av. Providencia 1234, Depto 5B"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm"
            required />
        </div>

        {/* Additional info */}
        <div className="bg-white rounded-2xl p-4">
          <label className="text-sm font-bold text-gray-700 mb-2 block">Información adicional (opcional)</label>
          <textarea
            value={additionalInfo}
            onChange={e => setAdditionalInfo(e.target.value)}
            placeholder="Referencias, horarios, etc."
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-300 focus:outline-none text-sm resize-none" />
        </div>

        {/* Submit */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-20">
          <div className="max-w-2xl mx-auto">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar datos de envío'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function DatosEnvioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Cargando...</div></div>}>
      <DatosEnvioContent />
    </Suspense>
  );
}
