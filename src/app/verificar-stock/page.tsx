'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const HIDE_NAV_STYLE = `.global-mobile-nav, .global-pay-ribbon, nav[class*='bottom'], .bottom-nav { display: none !important; }`;

interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  total: number;
  image?: string;
  available: boolean;
}

interface OrderData {
  $id: string;
  ORDERCODE: string;
  CUSTOMERNAME: string;
  CUSTOMERPHONE: string;
  ITEMS: string;
  TOTAL: number;
  STATUS: string;
  PAYMENTMETHOD?: string;
}

const BANK_DETAILS = {
  holder: 'DON BALATO IVAN',
  rut: '7826749898',
  bank: 'Mercado Pago',
  type: 'Cuenta Vista',
  number: '1037879898',
  email: 'donbalatosoporte@gmail.com',
};

const ACCESS_PASSWORD = 'redes123';

function VerificarStockContent() {
  const params = useSearchParams();
  const code = params.get('code');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [waLink, setWaLink] = useState('');
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (!code) return;
    (async () => {
      try {
        const res = await fetch(`/api/catalogo/order?code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (data.error) { setError(data.error); return; }
        setOrder(data.order);
        const parsed = JSON.parse(data.order.ITEMS || '[]');
        setItems(parsed.map((i: any) => ({
          sku: i.sku || '',
          name: i.name || '',
          qty: i.qty || 1,
          price: i.price || 0,
          total: (i.price || 0) * (i.qty || 1),
          image: i.image || '',
          available: true,
        })));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const toggleAvailable = (idx: number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, available: !it.available } : it));
  };

  const updateQty = (idx: number, qty: number) => {
    const q = Math.max(1, Math.floor(qty) || 1);
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      return { ...it, qty: q, total: it.price * q };
    }));
  };

  const incrementQty = (idx: number) => {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      const q = it.qty + 1;
      return { ...it, qty: q, total: it.price * q };
    }));
  };

  const decrementQty = (idx: number) => {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      const q = Math.max(1, it.qty - 1);
      return { ...it, qty: q, total: it.price * q };
    }));
  };

  const availableItems = items.filter(i => i.available);
  const newTotal = availableItems.reduce((sum, i) => sum + i.total, 0);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/catalogo/confirm-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: code, items }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }

      // If WhatsApp order, build WhatsApp link for cashier to send to customer
      const isWhatsApp = order?.PAYMENTMETHOD === 'WhatsApp';
      if (isWhatsApp) {
        const phone = order?.CUSTOMERPHONE?.replace(/\D/g, '') || '';
        let msg = `Hola ${order?.CUSTOMERNAME || ''}! Ya verificamos el stock de tu pedido ${code}.\n\n`;
        msg += `*Productos confirmados:*\n`;
        availableItems.forEach(i => {
          msg += `• ${i.name} (${i.sku})\n  ${i.qty} x $${i.price.toLocaleString('es-CL')} = $${i.total.toLocaleString('es-CL')}\n`;
        });
        msg += `\n*Total: $${newTotal.toLocaleString('es-CL')}*\n\n`;
        msg += `*Datos para transferir:*\n`;
        msg += `Titular: ${BANK_DETAILS.holder}\n`;
        msg += `RUT: ${BANK_DETAILS.rut}\n`;
        msg += `Banco: ${BANK_DETAILS.bank}\n`;
        msg += `Tipo: ${BANK_DETAILS.type}\n`;
        msg += `N°: ${BANK_DETAILS.number}\n`;
        msg += `Email: ${BANK_DETAILS.email}\n\n`;
        msg += `Realiza la transferencia y envíanos el comprobante por aquí. 😊`;

        const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        setWaLink(link);
      }
      setConfirmed(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <style>{HIDE_NAV_STYLE}</style>
        <div className="text-gray-400 text-lg">Cargando pedido...</div>
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl font-bold mb-2">Error</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  if (confirmed) {
    const isWhatsApp = order?.PAYMENTMETHOD === 'WhatsApp';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Stock confirmado!</h1>
          <p className="text-gray-500 mb-6">El pedido {code} pasó a estado "stock confirmado".</p>
          {isWhatsApp ? (
            <>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-600 transition mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enviar cotización al cliente
              </a>
              <p className="text-xs text-gray-400">Se abrirá WhatsApp con el mensaje listo para enviar</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">El administrador continuará con el proceso de armado del pedido.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">Verificar Stock</h1>
          <p className="text-sm text-gray-500">Pedido <span className="font-mono font-bold text-indigo-600">{code}</span></p>
          <p className="text-sm text-gray-500">Cliente: <span className="font-semibold">{order?.CUSTOMERNAME}</span> · {order?.CUSTOMERPHONE}</p>
        </div>
      </div>

      {/* Items */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        <p className="text-sm text-gray-500 mb-2">Marca los productos disponibles y ajusta las cantidades:</p>
        {items.map((item, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-4 border-2 transition ${item.available ? 'border-green-200' : 'border-red-200 opacity-60'}`}>
            <div className="flex items-start gap-3">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</div>
                <div className="text-sm font-bold text-gray-700 mt-1">${item.price.toLocaleString('es-CL')} c/u</div>
              </div>
              <button
                onClick={() => toggleAvailable(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {item.available ? '✓ Disponible' : '✗ No hay'}
              </button>
            </div>
            {item.available && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => decrementQty(idx)}
                  className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 transition flex-shrink-0">
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={e => updateQty(idx, parseInt(e.target.value) || 1)}
                  onFocus={e => e.target.select()}
                  className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center font-bold"
                />
                <button
                  onClick={() => incrementQty(idx)}
                  className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 transition flex-shrink-0">
                  +
                </button>
                <span className="text-sm font-bold text-gray-700 ml-auto">= ${item.total.toLocaleString('es-CL')}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Total confirmado:</span>
            <span className="text-2xl font-bold text-gray-800">${newTotal.toLocaleString('es-CL')}</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={saving || availableItems.length === 0}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50">
            {saving ? 'Confirmando...' : 'Confirmar stock y generar cotización'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerificarStockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Cargando...</div></div>}>
      <VerificarStockContent />
    </Suspense>
  );
}
