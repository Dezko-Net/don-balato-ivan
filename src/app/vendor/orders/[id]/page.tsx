'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, Phone, Mail, Copy, Check, Truck, CreditCard, Clock, RefreshCw, ExternalLink, FileText } from 'lucide-react';
import { generateOrderPdf } from '@/lib/generateOrderPdf';

interface VendorOrder {
  $id: string;
  ORDERCODE: string;
  CUSTOMERNAME: string;
  CUSTOMERRUT?: string;
  CUSTOMERPHONE?: string;
  CUSTOMEREMAIL?: string;
  ADDRESS?: string;
  REGION?: string;
  COMUNA?: string;
  ADDITIONALINFO?: string;
  ITEMS: string;
  SUBTOTAL: number;
  TOTAL: number;
  STATUS: string;
  PAYMENTPROOFURL?: string;
  PAYMENTMETHOD?: string;
  SHIPPINGAGENCY?: string;
  CREATEDAT: number;
  UPDATEDAT?: number;
  $createdAt?: string;
}

const STATUS_FLOW = ['pending', 'payment_review', 'payment_confirmed', 'shipped', 'delivered'] as const;
const STATUS_OPTIONS = [
  ['pending', 'Recibido'], ['payment_review', 'Revisando Pago'], ['payment_confirmed', 'Pago Confirmado'],
  ['shipped', 'Embalado'], ['delivered', 'Entregado a Agencia'], ['negotiation', 'Negociando'], ['cancelled', 'Cancelado'],
] as const;

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  pending: { color: '#fb923c', bg: '#fff3e6', border: '#fed7aa', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z' },
  pending_stock: { color: '#eab308', bg: '#fefce8', border: '#fde68a', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z' },
  processing: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
  paid: { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
  payment_review: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 18c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
  payment_confirmed: { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
  shipped: { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', icon: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.35-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z' },
  checklist: { color: '#06b6d4', bg: '#ecfeff', border: '#a5f3fc', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  delivered: { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' },
  negotiation: { color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', icon: 'M21 15a2 2 0 01-2 2H8l-4 3V5a2 2 0 012-2h13a2 2 0 012 2z' },
  cancelled: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: 'M6 6l12 12M6 18L18 6' },
};

const formatPrice = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n || 0);
const formatDate = (value?: number | string) => value ? new Date(value).toLocaleString('es-CL', { timeZone: 'America/Santiago' }) : '—';

export default function VendorOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<VendorOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Record<string, any>>({});
  const [branding, setBranding] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vendor/orders/${params.id}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Pedido no encontrado');
      setOrder(data.order);
      setError('');
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar el pedido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add('vendor-order-detail-open');
    load();
    return () => document.body.classList.remove('vendor-order-detail-open');
  }, [params.id]);

  useEffect(() => {
    fetch('/api/vendor/profile').then(res => res.json()).then(data => setBranding(data.vendor || null)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!order) return;
    let parsed: any[] = [];
    try { parsed = JSON.parse(order.ITEMS || '[]'); } catch {}
    const ids = parsed.map(item => item.id || item.productId).filter(Boolean);
    if (!ids.length) return;
    fetch(`/api/public-data/products?ids=${encodeURIComponent(ids.join(','))}`)
      .then(res => res.json()).then(data => {
        const map: Record<string, any> = {};
        (data.products || []).forEach((product: any) => { map[product.$id] = product; });
        setCatalogProducts(map);
      }).catch(() => {});
  }, [order]);

  const updateStatus = async (status: string) => {
    if (!order || updating || status === order.STATUS) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/vendor/orders/${order.$id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'No se pudo actualizar');
      setOrder(data.order);
    } catch (e: any) { setError(e?.message || 'No se pudo actualizar el estado'); }
    finally { setUpdating(false); }
  };

  const cancelOrder = async () => {
    if (!order || updating || order.STATUS === 'cancelled') return;
    if (!window.confirm('¿Cancelar este pedido? El stock de sus productos será restituido.')) return;
    await updateStatus('cancelled');
  };

  const copy = async (key: string, value: string) => {
    if (!value) return;
    try { await navigator.clipboard.writeText(value); } catch {}
    setCopied(key);
    window.setTimeout(() => setCopied(k => k === key ? null : k), 1500);
  };

  if (loading) return <div className="max-w-5xl mx-auto py-10 text-center text-sm text-gray-500"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />Cargando pedido…</div>;
  if (error || !order) return <div className="max-w-5xl mx-auto py-10"><button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 mb-5"><ArrowLeft className="w-4 h-4" /> Volver</button><div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error || 'Pedido no encontrado'}</div></div>;

  let items: any[] = [];
  try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
  const status = STATUS_STYLE[order.STATUS] || { color: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb' };
  const address = [order.ADDRESS, order.COMUNA, order.REGION].filter(Boolean).join(', ');
  const mapQuery = encodeURIComponent(`${address || 'Chile'}, Chile`);
  const shippingText = [order.CUSTOMERNAME, order.CUSTOMERRUT, order.CUSTOMERPHONE, order.CUSTOMEREMAIL, address, order.SHIPPINGAGENCY].filter(Boolean).join('\n');
  const ageHours = Math.max(0, Math.floor((Date.now() - new Date(order.CREATEDAT || order.$createdAt || Date.now()).getTime()) / 3600000));
  const ageLabel = ageHours < 1 ? 'Ahora' : ageHours < 24 ? `${ageHours}h` : `${Math.floor(ageHours / 24)}d ${ageHours % 24}h`;

  return (
    <>
      <style>{`
        @keyframes vendorFlowFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
        @keyframes vendorFlowRing { 0%,100% { box-shadow: 0 0 0 0 rgba(17,24,39,.08); } 50% { box-shadow: 0 0 0 3px rgba(17,24,39,.06); } }
        @keyframes vendorFlowShimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
        .vendor-flow-active { animation: vendorFlowFloat 3.5s ease-in-out infinite; }
        .vendor-flow-ring { animation: vendorFlowRing 3.5s ease-in-out infinite; }
        .vendor-flow-line { position: relative; overflow: hidden; }
        .vendor-flow-line::after { content: ''; position: absolute; inset: 0; width: 45%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); animation: vendorFlowShimmer 4s linear infinite; }
        .vendor-flow-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .vendor-flow-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>
      <div className="max-w-6xl mx-auto pb-10 space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link href="/vendor/orders" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"><ArrowLeft className="w-4 h-4" /> Volver a mis pedidos</Link>
        <div className="flex items-center gap-2">
          <button onClick={() => generateOrderPdf(order as any, items as any, undefined, undefined, branding)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm"><FileText className="w-3.5 h-3.5" /> PDF</button>
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50"><RefreshCw className="w-3.5 h-3.5" /> Actualizar</button>
        </div>
      </div>

      <div className="relative rounded-[20px] overflow-hidden border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gray-100 pointer-events-none" />
        <div className="relative flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2.5"><span className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>📦</span><div><p className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">{STATUS_OPTIONS.find(([key]) => key === order.STATUS)?.[1] || order.STATUS}</p><p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">Toca un paso para cambiar el estado</p></div></div>
          <div className="flex items-center gap-2 flex-wrap justify-end"><span className="text-2xl font-black text-gray-900">{formatPrice(order.TOTAL)}</span><span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: status.color, background: status.bg }}>{STATUS_OPTIONS.find(([key]) => key === order.STATUS)?.[1] || order.STATUS}</span>{order.STATUS !== 'cancelled' && <button type="button" onClick={cancelOrder} disabled={updating} className="text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-50">Cancelar pedido</button>}</div>
        </div>
        <div className="vendor-flow-scroll relative overflow-x-auto pb-2 pt-3"><div className="flex items-start gap-0 min-w-max">{STATUS_FLOW.map((key, i, flow) => { const label = STATUS_OPTIONS.find(([k]) => k === key)?.[1] || key; const currentStatus = order.STATUS === 'processing' || order.STATUS === 'pending_stock' ? 'pending' : order.STATUS === 'paid' ? 'payment_confirmed' : order.STATUS === 'checklist' ? 'shipped' : order.STATUS; const current = flow.indexOf(currentStatus as typeof flow[number]); const isCurrent = i === current; const isCompleted = i < current; const isFuture = i > current; const st = STATUS_STYLE[key]; const next = STATUS_STYLE[flow[i + 1]] || st; return <span key={key} className="contents"><button type="button" onClick={() => updateStatus(key)} disabled={updating || isCurrent} className={`group flex flex-col items-center gap-1.5 flex-shrink-0 disabled:cursor-default ${isCurrent ? 'vendor-flow-active' : ''}`} style={{ width: 70 }}><div className="relative transition-transform duration-200 group-hover:enabled:-translate-y-0.5 group-enabled:group-hover:scale-105">{isCurrent && <span className="absolute inset-0 rounded-[13px] vendor-flow-ring" style={{ '--flow-color': `${st.color}3d` } as React.CSSProperties} />}<div className="relative flex items-center justify-center rounded-[13px] transition-all duration-300" style={{ width: isCurrent ? 42 : 34, height: isCurrent ? 42 : 34, background: isFuture ? 'linear-gradient(160deg,#fff,#f1f5f9)' : `linear-gradient(160deg,rgba(255,255,255,.22),rgba(0,0,0,.12)),${st.color}`, border: isFuture ? `1.5px dashed ${st.color}55` : '1px solid rgba(255,255,255,.3)', boxShadow: isCurrent ? `0 0 0 2px ${st.color}18, 0 3px 8px -5px ${st.color}55` : isFuture ? 'none' : `0 2px 6px -4px ${st.color}55` }}>{isCompleted ? <Check className="w-4 h-4 text-white" /> : <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: isFuture ? '#9ca3af' : '#fff' }}><path d={st.icon} /></svg>}{!isFuture && <span className="absolute inset-x-1 top-1 h-1/3 rounded-full" style={{ background: 'linear-gradient(180deg,rgba(255,255,255,.45),transparent)' }} />}</div></div><span className="text-[8px] sm:text-[9px] font-bold text-center leading-tight" style={{ color: isCurrent ? st.color : isFuture ? '#9ca3af' : st.color }}>{label}</span></button>{i < flow.length - 1 && <div className="relative self-start mt-[17px] flex-shrink-0 -mx-1 rounded-full overflow-hidden" style={{ height: 4, width: 24, background: isCompleted ? `linear-gradient(90deg,${st.color},${next.color})` : '#e5e7eb' }}>{isCompleted && <span className="absolute inset-0 vendor-flow-line" />}</div>}</span>; })}</div></div>
      </div>

      {/* Comprobante de pago — acción prioritaria */}
      <div className={`rounded-2xl border p-4 sm:p-5 shadow-sm ${order.PAYMENTPROOFURL ? 'border-emerald-200 bg-emerald-50/60' : 'border-amber-200 bg-amber-50/60'}`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3"><span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${order.PAYMENTPROOFURL ? 'bg-emerald-100' : 'bg-amber-100'}`}>{order.PAYMENTPROOFURL ? '✓' : '!'}</span><div><p className={`text-sm font-extrabold ${order.PAYMENTPROOFURL ? 'text-emerald-900' : 'text-amber-900'}`}>{order.PAYMENTPROOFURL ? 'Comprobante de pago recibido' : 'Comprobante de pago pendiente'}</p><p className={`text-xs mt-0.5 ${order.PAYMENTPROOFURL ? 'text-emerald-700' : 'text-amber-700'}`}>{order.PAYMENTPROOFURL ? 'Revisa el comprobante para confirmar el pago.' : 'El cliente todavía no ha enviado un comprobante.'}</p></div></div>
          {order.PAYMENTPROOFURL ? <a href={order.PAYMENTPROOFURL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition shadow-sm"><FileText className="w-4 h-4" /> Ver comprobante <ExternalLink className="w-3.5 h-3.5" /></a> : <span className="px-3 py-2 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold">Pendiente</span>}
        </div>
      </div>

      {/* Resumen superior — igual que el detalle admin */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: formatPrice(order.TOTAL), icon: '💰', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Items', value: `${items.reduce((sum, item) => sum + Number(item.qty || item.quantity || 1), 0)} uds`, icon: '📦', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Estado', value: STATUS_OPTIONS.find(([key]) => key === order.STATUS)?.[1] || order.STATUS, icon: '🕐', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Antigüedad', value: ageLabel, icon: '⏱', color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(card => <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-2.5"><span className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center text-base`}>{card.icon}</span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{card.label}</p><p className={`text-sm sm:text-base font-extrabold ${card.color} truncate`}>{card.value}</p></div></div>)}
      </div>

      {/* Notas y seguimiento — bloque visible como en admin */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /><h2 className="text-sm font-bold text-gray-900">Notas y seguimiento</h2></div>
        <div className="p-4 sm:p-5"><p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Historial del pedido</p><div className="relative ml-2 border-l-2 border-gray-200 pl-4 space-y-3"><div className="relative"><span className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-indigo-400 border-2 border-white ring-1 ring-indigo-100" /><p className="text-sm font-semibold text-gray-800">Pedido creado</p><p className="text-xs text-gray-400">{formatDate(order.CREATEDAT || order.$createdAt)}</p></div>{order.UPDATEDAT && order.UPDATEDAT !== order.CREATEDAT && <div className="relative"><span className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white ring-1 ring-emerald-100" /><p className="text-sm font-semibold text-gray-800">Pedido actualizado</p><p className="text-xs text-gray-400">{formatDate(order.UPDATEDAT)}</p></div>}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {address && <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500" /><h2 className="text-sm font-bold text-gray-900">Ubicación de entrega</h2></div><div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3"><p className="text-[10px] font-bold uppercase text-emerald-700 mb-1">Dirección ingresada</p><p className="text-xs font-semibold text-gray-800">{order.ADDRESS || '—'}</p><p className="text-[11px] text-gray-500">{[order.COMUNA, order.REGION].filter(Boolean).join(', ')}</p></div><div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3"><p className="text-[10px] font-bold uppercase text-indigo-700 mb-1">Mapa de entrega</p><p className="text-xs text-gray-600">Verifica que la ubicación corresponda a la dirección indicada.</p></div></div><div className="aspect-[16/9] sm:aspect-[21/9] w-full"><iframe title="Mapa de entrega" width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapQuery}`} /></div></div>}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"><div className="flex items-center justify-between mb-3"><h2 className="text-sm font-bold text-gray-900">Productos del pedido</h2><span className="text-xs text-gray-400">{items.length} producto{items.length !== 1 ? 's' : ''}</span></div><div className="space-y-2">{items.map((item, index) => { const qty = item.qty || item.quantity || 1; const price = item.price || item.unitPrice || 0; const catalog = catalogProducts[item.id || item.productId] || {}; const stock = catalog.STOCK; return <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"><div className="w-12 h-12 rounded-lg bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">{item.img || item.image ? <img src={item.img || item.image} alt="" className="w-full h-full object-contain" /> : <Package className="w-5 h-5 text-gray-300" />}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-gray-900 truncate">{item.name || item.title || 'Producto'}</p><p className="text-xs text-gray-500">{qty} × {formatPrice(price)}</p>{stock !== undefined && <p className="text-[10px] text-gray-400 mt-0.5">Stock: {stock === 99999 ? 'Ilimitado' : stock} disp</p>}</div><p className="text-sm font-bold text-gray-900">{formatPrice(item.total || qty * price)}</p></div>; })}</div></div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"><h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Cliente</h2><div className="space-y-2.5 text-sm"><p className="font-bold text-gray-900">{order.CUSTOMERNAME || '—'}</p>{[['Teléfono', order.CUSTOMERPHONE, Phone], ['Email', order.CUSTOMEREMAIL, Mail]].map(([label, value, Icon]: any) => value ? <div key={label} className="flex items-center gap-2 text-gray-600"><Icon className="w-4 h-4 text-gray-400" />{label === 'Teléfono' ? <a href={`tel:${String(value).replace(/\D/g, '')}`} className="hover:text-indigo-600">{value}</a> : <span className="truncate">{value}</span>}</div> : null)}</div></div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 sm:p-5"><div className="flex items-center justify-between mb-3"><h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Datos para despacho</h2><button onClick={() => copy('shipping', shippingText)} className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center gap-1">{copied === 'shipping' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} Copiar</button></div><div className="space-y-2 text-xs"><p><span className="text-gray-400 block">RUT</span><b>{order.CUSTOMERRUT || '—'}</b></p><p><span className="text-gray-400 block">Dirección</span><b>{address || '—'}</b></p><p><span className="text-gray-400 block">Agencia</span><b>{order.SHIPPINGAGENCY || '—'}</b></p><p><span className="text-gray-400 block">Método de pago</span><b>{order.PAYMENTMETHOD || '—'}</b></p></div></div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"><h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Resumen</h2><div className="space-y-2 text-sm"><div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.SUBTOTAL)}</span></div><div className="flex justify-between pt-2 border-t border-gray-100 font-black text-gray-900"><span>Total</span><span>{formatPrice(order.TOTAL)}</span></div></div></div>
          {order.ADDITIONALINFO && <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4"><h2 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Información adicional</h2><p className="text-sm text-amber-900 whitespace-pre-wrap">{order.ADDITIONALINFO}</p></div>}
        </div>
      </div>
    </div>
    </>
  );
}
