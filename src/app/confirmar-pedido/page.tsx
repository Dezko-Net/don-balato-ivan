'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CHILE_REGIONES } from '@/types';
import { CATALOGO_AGENCIES, AgencyLogo } from '@/components/catalogo/AgencyLogos';

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
  image: string;
  id: string;
}

const norm = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function ConfirmarPedidoContent() {
  const params = useSearchParams();
  const code = params.get('code');
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

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
        const mapped: OrderItem[] = parsed.map((i: any) => ({
          sku: i.sku || '',
          name: i.name || '',
          qty: i.qty || 1,
          price: i.price || 0,
          total: (i.qty || 1) * (i.price || 0),
          image: i.image || '',
          id: i.id || '',
        }));
        setItems(mapped);
        if (data.order.REGION) setRegion(data.order.REGION);
        if (data.order.COMUNA) setComuna(data.order.COMUNA);
        if (data.order.ADDRESS) setAddress(data.order.ADDRESS);
        if (data.order.ADDITIONALINFO) setAdditionalInfo(data.order.ADDITIONALINFO);
        if (data.order.SHIPPINGAGENCY) setAgency(data.order.SHIPPINGAGENCY);

        // Enriquecer imágenes faltantes desde el catálogo principal (por id o nombre)
        if (mapped.some(m => !m.image)) {
          try {
            const pr = await fetch('/api/public-data/products?limit=1000', { cache: 'no-store' });
            const pd = await pr.json();
            const arr: any[] = Array.isArray(pd) ? pd : (pd.products || pd.documents || []);
            const byId = new Map<string, string>();
            const byName = new Map<string, string>();
            for (const p of arr) {
              const img = p.IMAGEURL || p.image || '';
              if (!img) continue;
              const pid = String(p.$id || p.id || '');
              if (pid) byId.set(pid, img);
              const nm = norm(p.NAME || p.name || '');
              if (nm) byName.set(nm, img);
            }
            setItems(prev => prev.map(it => {
              if (it.image) return it;
              const img = (it.id && byId.get(it.id)) || byName.get(norm(it.name)) || '';
              return img ? { ...it, image: img } : it;
            }));
          } catch { /* enriquecimiento best-effort */ }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const total = items.reduce((s, i) => s + i.total, 0);

  const copy = (key: string, val: string) => {
    navigator.clipboard?.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(c => (c === key ? null : c)), 1600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region || !comuna || !address) { setError('Completa región, comuna y dirección'); return; }
    if (!file) { setError('Sube tu comprobante de pago'); return; }
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('orderCode', code || '');
      formData.append('file', file);
      const proofRes = await fetch('/api/catalogo/upload-proof', { method: 'POST', body: formData });
      const proofData = await proofRes.json();
      if (proofData.error) { setError(proofData.error); return; }

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-indigo-200 border-t-indigo-600 animate-spin" />
          <div className="text-gray-400 text-sm">Cargando tu pedido…</div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          </div>
          <div className="text-gray-800 text-lg font-bold mb-1">No pudimos abrir el pedido</div>
          <div className="text-gray-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_10px_40px_rgba(79,70,229,0.12)] border border-indigo-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500" />
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">¡Todo listo!</h1>
          <p className="text-gray-500 text-sm leading-relaxed">Recibimos tu comprobante y tus datos de envío. El pedido <span className="font-mono font-bold text-indigo-600">{code}</span> está en proceso. Te avisaremos por WhatsApp muy pronto. 😊</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] pb-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 text-white px-5 pt-6 pb-7 sticky top-0 z-20 shadow-lg shadow-indigo-600/20">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-black leading-tight">Confirmar pedido</h1>
            <p className="text-indigo-100 text-xs mt-0.5">Código <span className="font-mono font-bold text-white">{code}</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Cliente */}
        {order?.CUSTOMERNAME && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white rounded-xl px-3 py-2 border border-gray-100">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="font-semibold text-gray-700">{order.CUSTOMERNAME}</span>
            {order.CUSTOMERPHONE && <><span>·</span><span>{order.CUSTOMERPHONE}</span></>}
          </div>
        )}
        {/* Progreso */}
        <div className="flex items-center gap-2 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5 text-green-600"><span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px]">✓</span>Stock confirmado</span>
          <span className="flex-1 h-px bg-gray-200" />
          <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px]">2</span>Pago y envío</span>
        </div>

        {/* Productos confirmados */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <h2 className="font-bold text-gray-900">Tu pedido ({items.length})</h2>
          </div>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <ProductThumb src={item.image} alt={item.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{item.name}</p>
                  {item.sku && <span className="inline-block mt-1 text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">SKU {item.sku}</span>}
                  <p className="text-xs text-gray-500 mt-1">{item.qty} × ${item.price.toLocaleString('es-CL')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900">${item.total.toLocaleString('es-CL')}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-dashed border-gray-200">
            <span className="font-bold text-gray-700">Total a pagar</span>
            <span className="text-2xl font-black text-indigo-600">${total.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* Datos bancarios */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <h2 className="font-bold text-blue-900">Datos para transferir</h2>
          </div>
          <div className="space-y-1.5">
            {[
              ['Titular', BANK_DETAILS.holder],
              ['RUT', BANK_DETAILS.rut],
              ['Banco', BANK_DETAILS.bank],
              ['Tipo', BANK_DETAILS.type],
              ['N° Cuenta', BANK_DETAILS.number],
              ['Email', BANK_DETAILS.email],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between gap-2 bg-white/70 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <span className="text-[11px] text-blue-500 font-semibold block leading-none mb-0.5">{label}</span>
                  <span className="text-sm text-blue-900 font-semibold truncate block">{val}</span>
                </div>
                <button type="button" onClick={() => copy(label, val)}
                  className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                  {copied === label ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subir comprobante */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.9A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12" /></svg>
              <h2 className="font-bold text-gray-900">Comprobante de pago</h2>
            </div>
            <p className="text-sm text-gray-500 mb-3">Sube una foto o captura de tu transferencia.</p>
            {!file ? (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-200 rounded-2xl py-8 px-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition text-center">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-semibold text-indigo-600">Toca para subir tu comprobante</span>
                <span className="text-[11px] text-gray-400">JPG o PNG</span>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            ) : (
              <div className="relative">
                <img src={URL.createObjectURL(file)} alt="comprobante" className="w-full max-h-64 rounded-2xl object-contain bg-gray-50 border border-gray-100" />
                <button type="button" onClick={() => setFile(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <p className="text-xs text-green-600 mt-2 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {file.name}
                </p>
              </div>
            )}
          </div>

          {/* Datos de envío */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h11v8H5zM16 10h3l2 2v4h-5M7 18a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <h2 className="font-bold text-gray-900">Datos de envío</h2>
            </div>

            {/* Agencia */}
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Elige tu transporte</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              {CATALOGO_AGENCIES.map(ag => {
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
                    className="relative flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center transition"
                    style={{ border: `2px solid ${sel ? ag.color : '#eef0f4'}`, background: sel ? ag.bg : '#fff' }}
                  >
                    {sel && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px]" style={{ background: ag.color }}>✓</span>
                    )}
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: sel ? '#fff' : ag.bg }}>
                      <AgencyLogo name={ag.name} color={ag.color} />
                    </span>
                    <span className="text-[11px] font-extrabold leading-tight" style={{ color: sel ? ag.color : '#374151' }}>{ag.name}</span>
                    <span className="text-[9px] text-gray-400 leading-tight">{ag.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Región */}
            <div className="mb-3">
              <label className="text-sm font-bold text-gray-700 mb-1 block">Región</label>
              <select value={region} onChange={e => { setRegion(e.target.value); setComuna(''); }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm bg-white">
                <option value="">Selecciona región</option>
                {Object.keys(CHILE_REGIONES).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Comuna */}
            <div className="mb-3">
              <label className="text-sm font-bold text-gray-700 mb-1 block">Comuna</label>
              <select value={comuna} onChange={e => setComuna(e.target.value)} disabled={!region}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm disabled:opacity-50 bg-white">
                <option value="">Selecciona comuna</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="text-sm font-bold text-gray-700 mb-1 block">Dirección</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Calle, número, depto/block"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm" />
            </div>

            {/* Info adicional */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Información adicional <span className="text-gray-400 font-normal">(opcional)</span></label>
              <textarea value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)}
                placeholder="Referencias, horarios, etc." rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm resize-none" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3l9 16H3l9-16z" /></svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-4 pb-6 z-20">
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <span className="text-[11px] text-gray-400 font-semibold">Total</span>
                <span className="text-lg font-black text-indigo-600">${total.toLocaleString('es-CL')}</span>
              </div>
              <button type="submit" disabled={saving}
                className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 active:scale-[0.99] transition disabled:opacity-50 shadow-lg shadow-indigo-600/25">
                {saving ? 'Enviando…' : 'Enviar comprobante y envío'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductThumb({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (src && ok) {
    return (
      <img src={src} alt={alt} onError={() => setOk(false)}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100 bg-gray-50" />
    );
  }
  return (
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center flex-shrink-0 border border-indigo-100">
      <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    </div>
  );
}

export default function ConfirmarPedidoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="text-gray-400">Cargando…</div></div>}>
      <ConfirmarPedidoContent />
    </Suspense>
  );
}
