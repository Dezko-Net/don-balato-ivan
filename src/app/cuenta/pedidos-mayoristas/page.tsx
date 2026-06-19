'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Loader2, Clock, CheckCircle, XCircle, MessageCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { getServices, getAppwriteConfig } from '@/lib/appwrite';
import { WHOLESALE_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { useAuth } from '@/hooks/useAuth';
import { useCuentaBg } from '../CuentaBgContext';
import { Query } from 'appwrite';
import CuentaPageShell from '@/components/cuenta/CuentaPageShell';
import { formatPrice } from '@/lib/appwrite';

const FF = '"DM Sans",system-ui,sans-serif';
const AMBER = '#c68b59';
const AMBER_BG = '#fef9f4';

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  pending_stock:   { label: 'Verificando stock',    bg: '#fff8e1', color: '#f57f17', icon: <Clock size={13} /> },
  stock_confirmed: { label: 'Stock confirmado',     bg: '#e8f5e9', color: '#2e7d32', icon: <CheckCircle size={13} /> },
  partial_stock:   { label: 'Stock parcial',        bg: '#fff3e0', color: '#e65c00', icon: <RefreshCw size={13} /> },
  waiting_payment: { label: 'Esperando pago',       bg: '#e3f2fd', color: '#1565c0', icon: <Clock size={13} /> },
  paid:            { label: 'Pago recibido',        bg: '#e8f5e9', color: '#1b5e20', icon: <CheckCircle size={13} /> },
  cancelled:       { label: 'Cancelado',            bg: '#ffebee', color: '#c62828', icon: <XCircle size={13} /> },
};

const BG = 'https://img.freepik.com/free-photo/shipment-delivery-by-truck-bell-notification-delivery-transportation-concept-3d-rendering_56104-1309.jpg?semt=ais_hybrid&w=740&q=80';

export default function PedidosMayoristasPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  useCuentaBg(BG);
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user) { router.push('/login'); return; }
    (async () => {
      setLoading(true);
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const res = await databases.listDocuments(databaseId, WHOLESALE_ORDERS_COLLECTION_ID, [
          Query.equal('USERID', user.id),
          Query.orderDesc('$createdAt'),
          Query.limit(50),
        ]);
        setRequests(res.documents);
      } catch {
        try {
          const { databases } = getServices();
          const { databaseId } = getAppwriteConfig();
          const res2 = await databases.listDocuments(databaseId, WHOLESALE_ORDERS_COLLECTION_ID, [
            Query.equal('CUSTOMEREMAIL', user.email || ''),
            Query.orderDesc('$createdAt'),
            Query.limit(50),
          ]);
          setRequests(res2.documents);
        } catch { setRequests([]); }
      } finally { setLoading(false); }
    })();
  }, [isLoggedIn, user, authLoading, router]);

  const formatDate = (ts: number | string) => {
    const d = typeof ts === 'number' ? new Date(ts) : new Date(ts);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const parseItems = (raw: string): any[] => {
    try { return JSON.parse(raw); } catch { return []; }
  };

  return (
    <CuentaPageShell
      title="Pedidos Mayoristas"
      subtitle="Seguí el estado de tus solicitudes mayoristas"
    >
      <div style={{ fontFamily: FF, maxWidth: 680, margin: '0 auto', padding: '0 0 60px' }}>

        {/* Info banner */}
        <div style={{ padding: '12px 16px', borderRadius: 14, background: 'linear-gradient(135deg,#fef9f4,#fff8f0)', border: '1px solid #eed9c4', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <MessageCircle size={16} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
            Una vez que verificamos el stock, te avisamos por <strong>WhatsApp</strong>. Podés ver el detalle de cada solicitud aquí y confirmar tu pedido cuando esté listo.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Loader2 size={28} color={AMBER} style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 20, border: '1px solid #eed9c4', boxShadow: '0 4px 20px rgba(198,139,89,0.06)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: AMBER_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package size={28} color={AMBER} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#374151', margin: '0 0 8px' }}>No tenés pedidos mayoristas</p>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Visitá nuestra sección de paquetes y comprá en cantidad.</p>
            <Link href="/paquetes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: AMBER, color: '#fff', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <Package size={14} /> Ver paquetes
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {requests.map(req => {
              const status = STATUS_MAP[req.STATUS] || { label: req.STATUS || 'Desconocido', bg: '#f3f4f6', color: '#6b7280', icon: <Clock size={13} /> };
              const items = parseItems(req.ITEMS || '[]');
              const isExpanded = expandedId === req.$id;
              const createdAt = req.CREATEDAT || req.$createdAt;
              const reqCode = req.REQCODE || req.$id.slice(-8).toUpperCase();
              return (
                <div key={req.$id} style={{ background: '#fff', borderRadius: 18, border: '1px solid #eed9c4', overflow: 'hidden', boxShadow: '0 4px 16px rgba(198,139,89,0.06)' }}>
                  {/* Card header */}
                  <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}
                    onClick={() => setExpandedId(isExpanded ? null : req.$id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: AMBER_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Package size={17} color={AMBER} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>#{reqCode}</p>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: status.bg, color: status.color }}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#9ca3af' }}>{formatDate(createdAt)} · {items.length} producto{items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: AMBER }}>{formatPrice(req.TOTAL || req.SUBTOTAL || 0)}</span>
                      {isExpanded ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #eed9c4', padding: '16px 18px', background: '#fef9f4' }}>
                      {/* Items list */}
                      <div style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Productos solicitados</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {items.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#fff', borderRadius: 10, border: '1px solid #eed9c4' }}>
                              {item.img ? (
                                <img src={item.img} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8, border: '1px solid #eed9c4' }} />
                              ) : (
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: AMBER_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                                  {item.isPack && item.packQty > 1 ? `Paquete de ${item.packQty} un.` : `x${item.qty}`}
                                </p>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: AMBER }}>{formatPrice(item.total || 0)}</p>
                                <p style={{ margin: '2px 0 0', fontSize: 10, color: '#9ca3af' }}>{formatPrice(item.price || 0)}/un.</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery info */}
                      <div style={{ padding: '10px 12px', background: '#fff', borderRadius: 10, border: '1px solid #eed9c4', marginBottom: 12 }}>
                        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Entrega</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#374151' }}>{req.ADDRESS || '—'}</p>
                        {req.REGION && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>{req.COMUNA}, {req.REGION}</p>}
                        {req.SHIPPINGAGENCY && <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 700, color: AMBER }}>Agencia: {req.SHIPPINGAGENCY}</p>}
                      </div>

                      {/* Status message */}
                      {req.STATUS === 'pending_stock' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#fff8e1', borderRadius: 10, border: '1px solid #fde68a' }}>
                          <Clock size={14} color="#f57f17" />
                          <p style={{ margin: 0, fontSize: 11, color: '#92400e', lineHeight: 1.4 }}>
                            Estamos verificando el stock. Te avisaremos por WhatsApp a <strong>{req.CUSTOMERPHONE}</strong>.
                          </p>
                        </div>
                      )}
                      {req.STATUS === 'stock_confirmed' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#e8f5e9', borderRadius: 10, border: '1px solid #a7f3d0' }}>
                          <CheckCircle size={14} color="#2e7d32" />
                          <p style={{ margin: 0, fontSize: 11, color: '#1b5e20', lineHeight: 1.4 }}>
                            Stock confirmado. Podés proceder al pago.
                          </p>
                        </div>
                      )}
                      {req.STATUS === 'partial_stock' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#fff3e0', borderRadius: 10, border: '1px solid #fed7aa' }}>
                          <RefreshCw size={14} color="#e65c00" />
                          <p style={{ margin: 0, fontSize: 11, color: '#92400e', lineHeight: 1.4 }}>
                            Algunos productos tienen stock limitado. Revisá los detalles que te enviamos por WhatsApp.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CuentaPageShell>
  );
}
