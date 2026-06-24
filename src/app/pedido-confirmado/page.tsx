'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, Clock, Upload, Copy, Check, AlertTriangle, MapPin, Package,
  Truck, Shield, FileText, Sparkles, Building2, User, CreditCard, Mail,
  Hash, ChevronRight, PartyPopper, MessageCircle
} from 'lucide-react';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION, MEDIA_BUCKET_ID, MEDIA_PREFIXES, formatPrice, ID } from '@/lib/appwrite';
import { Order, OrderItem } from '@/types';
import { generateOrderPdf } from '@/lib/generateOrderPdf';

const FF = '"DM Sans","Proxima Nova",-apple-system,BlinkMacSystemFont,sans-serif';

interface BankField {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

const BANK_DEFAULTS = {
  bankAccountHolder: 'YESBELLA LTDA.',
  bankRut: '77.270.689-8',
  bankName: 'BCI',
  bankAccountType: 'Cuenta Corriente',
  bankAccountNumber: '32590547',
  bankEmail: 'kevincoco0819@gmail.com',
};

function loadBankDetails(): BankField[] {
  try {
    const stored = localStorage.getItem('store_bank_details');
    const p = stored ? { ...BANK_DEFAULTS, ...JSON.parse(stored) } : BANK_DEFAULTS;
    return [
      { key: 'holder', label: 'Titular',         value: p.bankAccountHolder || 'No configurado', icon: <User size={14} /> },
      { key: 'rut',    label: 'RUT',             value: p.bankRut           || 'No configurado', icon: <Hash size={14} /> },
      { key: 'bank',   label: 'Banco',           value: p.bankName          || 'No configurado', icon: <Building2 size={14} /> },
      { key: 'type',   label: 'Tipo de cuenta',  value: p.bankAccountType   || 'Cuenta Vista',   icon: <CreditCard size={14} /> },
      { key: 'number', label: 'N° de cuenta',    value: p.bankAccountNumber || 'No configurado', icon: <Hash size={14} /> },
      { key: 'email',  label: 'Email',           value: p.bankEmail         || 'No configurado', icon: <Mail size={14} /> },
    ];
  } catch {
    return [
      { key: 'holder', label: 'Titular',        value: BANK_DEFAULTS.bankAccountHolder,  icon: <User size={14} /> },
      { key: 'rut',    label: 'RUT',            value: BANK_DEFAULTS.bankRut,   icon: <Hash size={14} /> },
      { key: 'bank',   label: 'Banco',          value: BANK_DEFAULTS.bankName,            icon: <Building2 size={14} /> },
      { key: 'type',   label: 'Tipo de cuenta', value: BANK_DEFAULTS.bankAccountType, icon: <CreditCard size={14} /> },
      { key: 'number', label: 'N° de cuenta',   value: BANK_DEFAULTS.bankAccountNumber,       icon: <Hash size={14} /> },
      { key: 'email',  label: 'Email',          value: BANK_DEFAULTS.bankEmail, icon: <Mail size={14} /> },
    ];
  }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: 'Pendiente de pago',  color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  processing: { label: 'Pago en revisión',   color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
  paid:       { label: 'Pago confirmado',    color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  shipped:    { label: 'Despachado',         color: '#6b21a8', bg: '#faf5ff', border: '#e9d5ff' },
  delivered:  { label: 'Entregado',          color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  cancelled:  { label: 'Cancelado',          color: '#991b1b', bg: '#fef2f2', border: '#fecaca' },
};

function Countdown({ expiresAt }: { expiresAt: number }) {
  const [display, setDisplay] = useState('');
  const [urgent, setUrgent] = useState(false);
  useEffect(() => {
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) { setDisplay('Expirado'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUrgent(diff < 15 * 60000);
      setDisplay(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 22px', background: urgent ? '#fef2f2' : '#fdf2f8', border: `2px solid ${urgent ? '#fecaca' : '#fbcfe8'}`, borderRadius: 16 }}>
      <Clock size={20} color={urgent ? '#dc2626' : '#c0547a'} />
      <div style={{ textAlign: 'left' }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: urgent ? '#991b1b' : '#9a3412', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tiempo restante</p>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 26, fontWeight: 800, color: urgent ? '#dc2626' : '#c0547a', letterSpacing: '0.05em' }}>{display}</p>
      </div>
    </div>
  );
}

function ConfirmadoInner() {
  const params = useSearchParams();
  const orderId = params.get('id') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const load = useCallback(async () => {
    if (!orderId) { setIsLoading(false); return; }
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const doc = await databases.getDocument(databaseId, ORDERS_COLLECTION, orderId);
      const o = doc as unknown as Order;
      setOrder(o);
      if (o.PAYMENTPROOFURL) setUploaded(true);
      try { setItems(JSON.parse(o.ITEMS)); } catch {}
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [orderId]);

  useEffect(() => { load(); }, [load]);

  // Trigger confetti on first load when order just created
  useEffect(() => {
    if (order && order.STATUS === 'pending') {
      const created = order.CREATEDAT || 0;
      if (Date.now() - created < 60000) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  }, [order]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploading(true);
    try {
      const { storage, databases } = getServices();
      const { databaseId, endpoint, projectId } = getAppwriteConfig();
      const fileId = ID.unique();
      const up = await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const url = `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}${ext ? `&ext=${ext}` : ''}`;
      await databases.updateDocument(databaseId, ORDERS_COLLECTION, orderId, { PAYMENTPROOFURL: url, STATUS: 'processing' });
      setUploaded(true);
      await load();
    } catch { alert('Error al subir el comprobante. Intenta de nuevo.'); }
    finally { setUploading(false); }
  }

  function copyField(key: string, val: string) {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function copyAll(BANK: BankField[]) {
    const text = BANK.map(b => `${b.label}: ${b.value}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  }

  if (isLoading) {
    return (
      <div style={{ fontFamily: FF, minHeight: '100vh', background: 'linear-gradient(180deg,#fdf2f8 0%,#fff 280px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, border: '4px solid #fce7f3', borderTop: '4px solid #e396bf', borderRadius: '50%', animation: 'pkSpin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Cargando tu pedido...</p>
        </div>
        <style>{`@keyframes pkSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ fontFamily: FF, minHeight: '100vh', background: 'linear-gradient(180deg,#fdf2f8 0%,#fff 280px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '40px 32px', border: '1px solid #fce7f3', textAlign: 'center', maxWidth: 420, boxShadow: '0 10px 40px rgba(227,150,191,0.08)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertTriangle size={36} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Pedido no encontrado</h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 20px' }}>No pudimos encontrar el pedido solicitado.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '11px 24px', background: 'linear-gradient(135deg,#e396bf,#f5a8cf)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 700, boxShadow: '0 6px 20px rgba(227,150,191,0.25)' }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const isPending = order.STATUS === 'pending';
  const isSuccess = uploaded || (order.STATUS !== 'pending' && order.STATUS !== 'cancelled');
  const BANK = loadBankDetails();
  const status = STATUS_MAP[order.STATUS] || { label: order.STATUS, color: '#374151', bg: '#f3f4f6', border: '#e5e7eb' };
  const showTimer = isPending && order.EXPIRESAT && !uploaded;

  return (
    <div style={{ fontFamily: FF, minHeight: '100vh', background: 'linear-gradient(180deg,#fdf2f8 0%,#fff 320px)' }}>
      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-20px',
              width: 8 + Math.random() * 6,
              height: 8 + Math.random() * 6,
              background: ['#e396bf', '#f5a8cf', '#fbcfe8', '#a855f7', '#fde68a'][Math.floor(Math.random() * 5)],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `pkConfetti ${2 + Math.random() * 2}s ${Math.random() * 0.5}s ease-out forwards`,
            }} />
          ))}
        </div>
      )}

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px calc(60px + 92px + env(safe-area-inset-bottom, 0px))' }}>
        {/* ── Success header ── */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '40px 32px 32px', border: '1px solid #fce7f3', textAlign: 'center', boxShadow: '0 12px 48px rgba(227,150,191,0.1)', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,150,191,0.08), transparent)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,150,191,0.06), transparent)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg,#fce7f3,#fbcfe8)', marginBottom: 16, animation: 'pkPulse 2s ease-in-out infinite', boxShadow: '0 12px 40px rgba(227,150,191,0.2)' }}>
              {isSuccess ? <CheckCircle2 size={44} color="#e396bf" strokeWidth={2.5} /> : <PartyPopper size={42} color="#e396bf" strokeWidth={2.2} />}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fdf2f8', color: '#e396bf', padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
              <Sparkles size={13} /> Pedido recibido
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 900, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {isSuccess ? '¡Pedido confirmado!' : '¡Gracias por tu compra!'}
            </h1>
            {order.CUSTOMERNAME && (
              <p style={{ margin: '0 0 16px', fontSize: 15, color: '#6b7280' }}>
                Hola <strong style={{ color: '#111' }}>{order.CUSTOMERNAME}</strong>, te enviamos los detalles a tu correo.
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#fff', border: '1.5px solid #fce7f3', borderRadius: 999, fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
                Código: <strong style={{ color: '#e396bf', fontFamily: 'monospace' }}>{order.ORDERCODE}</strong>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: 999, background: status.bg, color: status.color, border: `1.5px solid ${status.border}`, fontSize: 13, fontWeight: 700 }}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Timeline ── */}
        {order.STATUS !== 'cancelled' && (() => {
          const steps = [
            { key: 'pending',    label: 'Recibido',   icon: <Clock size={14} /> },
            { key: 'processing', label: 'En revisión', icon: <Upload size={14} /> },
            { key: 'paid',       label: 'Confirmado',  icon: <CheckCircle2 size={14} /> },
            { key: 'shipped',    label: 'Enviado',    icon: <Truck size={14} /> },
            { key: 'delivered',  label: 'Entregado',  icon: <Package size={14} /> },
          ];
          const statusOrder = ['pending', 'processing', 'paid', 'shipped', 'delivered'];
          const currentIdx = statusOrder.indexOf(order.STATUS);
          return (
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 20px', border: '1px solid #fce7f3', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, left: '10%', right: '10%', height: 3, background: '#fce7f3', zIndex: 0, borderRadius: 999 }} />
                <div style={{ position: 'absolute', top: 16, left: '10%', height: 3, background: 'linear-gradient(90deg,#e396bf,#f5a8cf)', zIndex: 1, width: currentIdx >= 0 ? `${(currentIdx / (steps.length - 1)) * 80}%` : '0%', transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)', borderRadius: 999 }} />
                {steps.map((step, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: done ? 'linear-gradient(135deg,#e396bf,#f5a8cf)' : '#fff',
                        border: `2px solid ${done ? '#e396bf' : '#fce7f3'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: done ? '#fff' : '#fbcfe8',
                        transition: 'all 0.3s',
                        boxShadow: active ? '0 0 0 6px rgba(227,150,191,0.15)' : done ? '0 4px 12px rgba(227,150,191,0.25)' : 'none',
                      }}>
                        {step.icon}
                      </div>
                      <span style={{ marginTop: 8, fontSize: 11, fontWeight: active ? 800 : 600, color: done ? '#111' : '#9ca3af', textAlign: 'center', lineHeight: 1.2 }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── Timer ── */}
        {showTimer && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #fde68a', marginBottom: 16, textAlign: 'center' }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#92400e', fontWeight: 600 }}>
              Tienes <strong>3 horas</strong> para completar el pago de tu pedido
            </p>
            <Countdown expiresAt={order.EXPIRESAT!} />
            <p style={{ margin: '12px 0 0', fontSize: 12, color: '#b45309' }}>
              Después de transferir, sube el comprobante para confirmar tu pedido
            </p>
          </div>
        )}

        {/* ── Bank details ── */}
        {isPending && !uploaded && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', border: '1px solid #fce7f3', marginBottom: 16, boxShadow: '0 4px 16px rgba(227,150,191,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
                <CreditCard size={18} color="#e396bf" /> Datos para transferir
              </h2>
              <button onClick={() => copyAll(BANK)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: copied === 'all' ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#e396bf,#f5a8cf)', color: '#fff', border: 'none', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(227,150,191,0.25)', transition: 'all 0.2s' }}>
                {copied === 'all' ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar todo</>}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {BANK.map(b => (
                <button key={b.key} onClick={() => copyField(b.key, b.value)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: copied === b.key ? '#f0fdf4' : '#fdf2f8', border: `1.5px solid ${copied === b.key ? '#bbf7d0' : '#fce7f3'}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit' }}
                  onMouseEnter={e => { if (copied !== b.key) { (e.currentTarget as HTMLElement).style.background = '#fce7f3'; (e.currentTarget as HTMLElement).style.borderColor = '#fbcfe8'; } }}
                  onMouseLeave={e => { if (copied !== b.key) { (e.currentTarget as HTMLElement).style.background = '#fdf2f8'; (e.currentTarget as HTMLElement).style.borderColor = '#fce7f3'; } }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e396bf', flexShrink: 0 }}>
                      {b.icon}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{b.label}</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.value}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: copied === b.key ? '#16a34a' : '#e396bf', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                    {copied === b.key ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                  </span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '14px 16px', background: 'linear-gradient(135deg,#fff8e1,#fef3c7)', border: '1.5px solid #fde68a', borderRadius: 14 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
                ⚠️ Transfiere exactamente <strong style={{ fontSize: 16, color: '#92400e' }}>{formatPrice(order.TOTAL)}</strong> y sube el comprobante abajo para que confirmemos tu pedido.
              </p>
            </div>
          </div>
        )}

        {/* ── Upload proof ── */}
        {(isPending || order.STATUS === 'processing') && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', border: `1.5px solid ${uploaded ? '#bbf7d0' : '#fce7f3'}`, marginBottom: 16 }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
              <Upload size={18} color={uploaded ? '#16a34a' : '#e396bf'} /> Comprobante de pago
            </h2>
            {uploaded ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#f0fdf4', borderRadius: 14, border: '1.5px solid #bbf7d0' }}>
                <CheckCircle2 size={22} color="#16a34a" />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#166534' }}>Comprobante recibido</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#22c55e' }}>Estamos revisando tu pago. Te avisaremos cuando esté confirmado.</p>
                </div>
              </div>
            ) : (
              <>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#6b7280' }}>
                  Sube tu comprobante de transferencia para que confirmemos tu pedido
                </p>
                <label style={{ display: 'block', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                  <input type="file" accept="image/*,.pdf" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
                  <div style={{ border: '2px dashed #fbcfe8', borderRadius: 16, padding: '32px 16px', textAlign: 'center', background: '#fdf2f8', transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (!uploading) { (e.currentTarget as HTMLElement).style.borderColor = '#e396bf'; (e.currentTarget as HTMLElement).style.background = '#fce7f3'; } }}
                    onMouseLeave={e => { if (!uploading) { (e.currentTarget as HTMLElement).style.borderColor = '#fbcfe8'; (e.currentTarget as HTMLElement).style.background = '#fdf2f8'; } }}>
                    {uploading ? (
                      <>
                        <div style={{ width: 36, height: 36, border: '3px solid #fce7f3', borderTop: '3px solid #e396bf', borderRadius: '50%', animation: 'pkSpin 1s linear infinite', margin: '0 auto 10px' }} />
                        <p style={{ margin: 0, fontSize: 14, color: '#e396bf', fontWeight: 700 }}>Subiendo comprobante...</p>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 14px rgba(227,150,191,0.15)' }}>
                          <Upload size={24} color="#e396bf" />
                        </div>
                        <p style={{ margin: '0 0 4px', fontSize: 15, color: '#111', fontWeight: 700 }}>Click para subir comprobante</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>JPG, PNG o PDF · Máx. 10MB</p>
                      </>
                    )}
                  </div>
                </label>
              </>
            )}
          </div>
        )}

        {/* ── WhatsApp Link Section ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', border: '1px solid #fce7f3', marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
            <MessageCircle size={18} color="#25D366" /> Recibir notificaciones
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            Conecta tu pedido a nuestro WhatsApp para recibir actualizaciones automáticas. Si escribiste mal tu número en el carrito, haz click aquí para corregirlo.
          </p>
          <a
            href={`https://wa.me/56999149712?text=vincular_pedido%20${order.$id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#25D366', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(37,211,102,0.2)' }}
          >
            <MessageCircle size={18} /> Conectar WhatsApp
          </a>
        </div>

        {/* ── Order items ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', border: '1px solid #fce7f3', marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
            <Package size={18} color="#e396bf" /> Detalle del pedido
          </h2>
          {items.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
              No hay productos para mostrar
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < items.length - 1 ? 12 : 0, borderBottom: i < items.length - 1 ? '1px solid #fce7f3' : 'none', alignItems: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg,#fdf2f8,#fce7f3)', border: '1px solid #fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {item.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.img}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => {
                          const img = e.currentTarget;
                          img.style.display = 'none';
                          const parent = img.parentElement;
                          if (parent && !parent.querySelector('.pk-item-fallback')) {
                            const fb = document.createElement('div');
                            fb.className = 'pk-item-fallback';
                            fb.style.cssText = 'font-size:24px;color:#e396bf;font-weight:800;';
                            fb.textContent = (item.name?.[0] || '🛍').toUpperCase();
                            parent.appendChild(fb);
                          }
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 22, color: '#e396bf', fontWeight: 800 }}>{(item.name?.[0] || '🛍').toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px', fontSize: 14, color: '#111', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3 }}>{item.name}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
                      <span style={{ padding: '2px 8px', background: '#fdf2f8', color: '#e396bf', borderRadius: 999, fontWeight: 700 }}>x{item.qty}</span>
                      <span>{formatPrice(item.price)} c/u</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111', flexShrink: 0 }}>{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ borderTop: '1.5px solid #fce7f3', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
              <span>Subtotal</span><span style={{ fontWeight: 600 }}>{formatPrice(order.SUBTOTAL)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
              <span>Envío</span>
              <span style={{ color: order.SHIPPINGCOST > 0 ? '#111' : '#16a34a', fontWeight: 600 }}>
                {order.SHIPPINGCOST > 0 ? formatPrice(order.SHIPPINGCOST) : 'A coordinar'}
              </span>
            </div>
            {order.DISCOUNT && order.DISCOUNT > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#e396bf' }}>
                <span>Descuento {order.COUPONCODE ? `(${order.COUPONCODE})` : ''}</span>
                <span style={{ fontWeight: 700 }}>−{formatPrice(order.DISCOUNT)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 900, color: '#111', paddingTop: 10, borderTop: '1.5px solid #fce7f3', marginTop: 4, letterSpacing: '-0.02em' }}>
              <span>Total</span><span style={{ color: '#e396bf' }}>{formatPrice(order.TOTAL)}</span>
            </div>
          </div>
        </div>

        {/* ── Shipping info ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', border: '1px solid #fce7f3', marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
            <MapPin size={18} color="#e396bf" /> Datos de envío
          </h2>
          <div style={{ background: '#fdf2f8', borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontWeight: 800, color: '#111', fontSize: 15 }}>{order.CUSTOMERNAME}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
              {order.CUSTOMERPHONE}
              {order.CUSTOMEREMAIL && <> · {order.CUSTOMEREMAIL}</>}
            </p>
            {order.ADDRESS && <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151' }}>{order.ADDRESS}</p>}
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#374151' }}>{order.COMUNA}, {order.REGION}</p>
            {order.SHIPPINGAGENCY && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '5px 12px', background: '#fff', borderRadius: 999, border: '1px solid #fce7f3' }}>
                <Truck size={13} color="#e396bf" />
                <span style={{ color: '#e396bf', fontWeight: 700, fontSize: 12 }}>{order.SHIPPINGAGENCY}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Trust ── */}
        <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 20, padding: '18px 22px', border: '1px solid #bbf7d0', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={20} color="#16a34a" />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: '#166534' }}>Compra Protegida</p>
              <p style={{ margin: 0, fontSize: 12, color: '#22c55e', lineHeight: 1.5 }}>
                Si tienes algún problema con tu pedido, te devolvemos el dinero.
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <button onClick={() => generateOrderPdf(order, items)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', background: '#fff', color: '#e396bf', border: '1.5px solid #fce7f3', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.borderColor = '#fbcfe8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fce7f3'; }}>
          <FileText size={16} /> Descargar comprobante PDF
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/productos" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px 0', background: 'linear-gradient(135deg,#e396bf,#f5a8cf)', color: '#fff', textAlign: 'center', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 20px rgba(227,150,191,0.25)', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(227,150,191,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(227,150,191,0.25)'; }}>
            Seguir comprando <ChevronRight size={16} />
          </Link>
          <Link href="/cuenta/pedidos" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px 0', background: '#fff', color: '#e396bf', textAlign: 'center', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1.5px solid #fce7f3', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fdf2f8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
            Ver mis pedidos
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pkSpin { to { transform: rotate(360deg); } }
        @keyframes pkPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes pkConfetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={
      <div style={{ fontFamily: FF, minHeight: '100vh', background: 'linear-gradient(180deg,#fdf2f8 0%,#fff 280px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 60, height: 60, border: '4px solid #fce7f3', borderTop: '4px solid #e396bf', borderRadius: '50%', animation: 'pkSpin 1s linear infinite' }} />
        <style>{`@keyframes pkSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ConfirmadoInner />
    </Suspense>
  );
}
