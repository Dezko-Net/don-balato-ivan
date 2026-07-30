'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, ArrowLeft, Loader2, Search, Receipt, RefreshCw, ShoppingCart, Clock, CheckCircle, MessageSquare, Truck, XCircle, Upload } from 'lucide-react';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION, formatPrice } from '@/lib/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { useCuentaBg } from '../CuentaBgContext';
import { useCart } from '@/context/CartContext';
import { Query } from 'appwrite';
import CuentaPageShell from '@/components/cuenta/CuentaPageShell';

const FF = '"DM Sans",system-ui,sans-serif';
const PINK = '#3b82f6';

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:            { label: 'Recibido',            bg: '#fff8e1', color: '#f57f17' },
  pending_stock:      { label: 'Recibido',            bg: '#fff8e1', color: '#f57f17' },
  processing:         { label: 'Comprobando Stock',   bg: '#e3f2fd', color: '#1565c0' },
  paid:               { label: 'Stock confirmado',    bg: '#e8f5e9', color: '#2e7d32' },
  payment_review:     { label: 'Revisando Pago',      bg: '#e3f2fd', color: '#1d4ed8' },
  payment_confirmed:  { label: 'Pago confirmado',     bg: '#d1fae5', color: '#059669' },
  negotiation:        { label: 'Negociando',          bg: '#eff6ff', color: '#1d4ed8' },
  shipped:            { label: 'Embalado',            bg: '#f3e8ff', color: '#6b21a8' },
  delivered:          { label: 'Entregado a agencia', bg: '#e8f5e9', color: '#1b5e20' },
  cancelled:          { label: 'Cancelado',           bg: '#ffebee', color: '#c62828' },
};

const BG_PEDIDOS = 'https://img.freepik.com/free-photo/shipment-delivery-by-truck-bell-notification-delivery-transportation-concept-3d-rendering_56104-1309.jpg?semt=ais_hybrid&w=740&q=80';

export default function MisPedidosPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  useCuentaBg(BG_PEDIDOS);
  const router = useRouter();
  const { addItem } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // No forzar login - mostrar prompt si no está logueado

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    (async () => {
      setLoading(true);
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        // Try USERID first (more likely indexed), fallback to CUSTOMEREMAIL
        let res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
          Query.equal('USERID', user.id),
          Query.orderDesc('$createdAt'),
          Query.limit(50),
        ]);
        if (res.documents.length === 0) {
          try {
            res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
              Query.equal('CUSTOMEREMAIL', user.email),
              Query.orderDesc('$createdAt'),
              Query.limit(50),
            ]);
          } catch {}
        }
        if (res.documents.length === 0) {
          try {
            res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
              Query.equal('userId', user.id),
              Query.orderDesc('$createdAt'),
              Query.limit(50),
            ]);
          } catch {}
        }
        setOrders(res.documents);
      } catch (e) { console.error('Error fetching orders:', e); }
      finally { setLoading(false); }
    })();
  }, [isLoggedIn, user]);

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#eff6ff 0%,#fff 280px)' }}>
      <Loader2 size={32} color={PINK} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!isLoggedIn || !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#eff6ff 0%,#fff 280px)', fontFamily: FF }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #dbeafe', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <Link href="/cuenta" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ArrowLeft size={22} color={PINK} />
          </Link>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Mis Pedidos</span>
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 12px' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '50px 24px', textAlign: 'center', border: '1px solid #dbeafe' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Receipt size={32} color={PINK} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800, color: '#111827' }}>Iniciar sesión para ver tus pedidos</h2>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280' }}>Necesitás una cuenta para acceder a tu historial de compras</p>
            <Link href="/login" style={{ display: 'inline-block', padding: '12px 32px', background: `linear-gradient(135deg,${PINK},#2563eb)`, color: '#fff', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 6px 20px rgba(59,130,246,0.25)' }}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function reorder(order: any) {
    try {
      const items: any[] = JSON.parse(order.ITEMS || '[]');
      items.forEach((item: any) => {
        if (item.productId && item.name && item.price) {
          addItem({ $id: item.productId, NAME: item.name, PRICE: item.price, IMAGEURL: item.imageUrl || '', STOCK: 99, CURRENTPRICE: 0, DESCRIPTION: '', CATEGORYID: '', SOLDQUANTITY: 0 } as any, item.qty || 1);
        }
      });
      router.push('/carrito');
    } catch { /* silent */ }
  }

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.STATUS !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return o.ORDERCODE?.toLowerCase().includes(q) || o.CUSTOMERNAME?.toLowerCase().includes(q);
  });

  const statusTabs = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Recibidos' },
    { key: 'processing', label: 'C. Stock' },
    { key: 'paid', label: 'Confirmados' },
    { key: 'negotiation', label: 'Negociando' },
    { key: 'shipped', label: 'Enviados' },
    { key: 'delivered', label: 'Entregados' },
    { key: 'cancelled', label: 'Cancelados' },
  ];

  return (
    <CuentaPageShell
      title="Mis Pedidos"
      subtitle={`${orders.length} pedido${orders.length !== 1 ? 's' : ''} en tu historial`}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontFamily: FF }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por código o nombre..."
            style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #dbeafe', borderRadius: 12, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: FF }} />
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 4, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {statusTabs.map(tab => {
            const count = tab.key === 'all' ? orders.length : orders.filter(o => o.STATUS === tab.key).length;
            return (
              <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: statusFilter === tab.key ? `linear-gradient(135deg,${PINK},#2563eb)` : '#fff',
                  color: statusFilter === tab.key ? '#fff' : '#6b7280',
                  border: `1.5px solid ${statusFilter === tab.key ? 'transparent' : '#dbeafe'}`,
                  whiteSpace: 'nowrap', flexShrink: 0, boxShadow: statusFilter === tab.key ? '0 4px 12px rgba(59,130,246,0.25)' : 'none', transition: 'all .2s', scrollSnapAlign: 'start',
                }}>
                {tab.label} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <Loader2 size={28} color={PINK} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, border: '1px solid #dbeafe', padding: '50px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Receipt size={32} color={PINK} />
            </div>
            <p style={{ color: '#111827', fontSize: 17, fontWeight: 800, margin: '0 0 6px' }}>Sin pedidos aún</p>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 20px' }}>
              {search ? 'No encontramos resultados' : 'Aquí aparecerán tus compras'}
            </p>
            {!search && (
              <Link href="/productos" style={{ display: 'inline-block', padding: '12px 28px', background: `linear-gradient(135deg,${PINK},#2563eb)`, color: '#fff', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 6px 20px rgba(59,130,246,0.25)' }}>
                Ver productos
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <style>{`
              @keyframes pulseRingDynamic {
                0% { box-shadow: 0 0 0 0 var(--pulse-color, rgba(245,127,23,0.4)); }
                70% { box-shadow: 0 0 0 8px transparent; }
                100% { box-shadow: 0 0 0 0 transparent; }
              }
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(0.8); }
              }
            `}</style>
            {filtered.map(order => {
              const isRetiro = order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
              const isReadyRetiro = order.STATUS === 'shipped' && isRetiro;
              const st = isReadyRetiro 
                ? { label: 'Listo para retirar', bg: '#fae8ff', color: '#a21caf' }
                : (STATUS[order.STATUS] || { label: order.STATUS, bg: '#f5f5f5', color: '#666' });
              let items: any[] = [];
              try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
              const qty = items.reduce((s: number, i: any) => s + (i.qty || 1), 0);
              const date = new Date(order.CREATEDAT || order.$createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
              const isWaiting = true;

              // Color scheme per status
              const CARD_THEME: Record<string, { border: string; bg: string; iconBg: string; iconColor: string; shadow: string; hoverBorder: string; hoverShadow: string; barColor: string }> = {
                pending:       { border: '1.5px solid #ffcc80', bg: 'linear-gradient(135deg, #fff8e8 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #fff8e1, #ffe0b2)', iconColor: '#f57f17', shadow: 'rgba(245,127,23,0.08)', hoverBorder: '#ffb74d', hoverShadow: 'rgba(245,127,23,0.15)', barColor: '#f57f17' },
                pending_stock: { border: '1.5px solid #ffcc80', bg: 'linear-gradient(135deg, #fff8e8 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #fff8e1, #ffe0b2)', iconColor: '#f57f17', shadow: 'rgba(245,127,23,0.08)', hoverBorder: '#ffb74d', hoverShadow: 'rgba(245,127,23,0.15)', barColor: '#f57f17' },
                processing:    { border: '1.5px solid #90caf9', bg: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', iconColor: '#1565c0', shadow: 'rgba(21,101,192,0.08)', hoverBorder: '#64b5f6', hoverShadow: 'rgba(21,101,192,0.15)', barColor: '#1565c0' },
                paid:          { border: '1.5px solid #a5d6a7', bg: 'linear-gradient(135deg, #f1f8f3 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', iconColor: '#2e7d32', shadow: 'rgba(46,125,50,0.08)', hoverBorder: '#81c784', hoverShadow: 'rgba(46,125,50,0.15)', barColor: '#2e7d32' },
                payment_review: { border: '1.5px solid #93c5fd', bg: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', iconColor: '#1d4ed8', shadow: 'rgba(29,78,216,0.08)', hoverBorder: '#60a5fa', hoverShadow: 'rgba(29,78,216,0.15)', barColor: '#1d4ed8' },
                payment_confirmed: { border: '1.5px solid #6ee7b7', bg: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', iconColor: '#059669', shadow: 'rgba(5,150,105,0.08)', hoverBorder: '#34d399', hoverShadow: 'rgba(5,150,105,0.15)', barColor: '#059669' },
                negotiation:   { border: '1.5px solid #b39ddb', bg: 'linear-gradient(135deg, #f5f0ff 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #ede7f6, #d1c4e9)', iconColor: '#5e35b1', shadow: 'rgba(94,53,177,0.08)', hoverBorder: '#9575cd', hoverShadow: 'rgba(94,53,177,0.15)', barColor: '#5e35b1' },
                shipped:       { border: '1.5px solid #c4b5fd', bg: 'linear-gradient(135deg, #f5f0ff 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #ede7f6, #d1c4e9)', iconColor: '#6b21a8', shadow: 'rgba(107,33,168,0.08)', hoverBorder: '#a78bfa', hoverShadow: 'rgba(107,33,168,0.15)', barColor: '#6b21a8' },
                delivered:     { border: '1.5px solid #81c784', bg: 'linear-gradient(135deg, #f0f9f1 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #e8f5e9, #a5d6a7)', iconColor: '#1b5e20', shadow: 'rgba(27,94,32,0.08)', hoverBorder: '#66bb6a', hoverShadow: 'rgba(27,94,32,0.15)', barColor: '#1b5e20' },
                cancelled:     { border: '1.5px solid #ef9a9a', bg: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #ffebee, #ffcdd2)', iconColor: '#c62828', shadow: 'rgba(198,40,40,0.08)', hoverBorder: '#e57373', hoverShadow: 'rgba(198,40,40,0.15)', barColor: '#c62828' },
              };
              const theme = isReadyRetiro
                ? { border: '1.5px solid #e8a3f0', bg: 'linear-gradient(135deg, #fdf4ff 0%, #ffffff 60%)', iconBg: 'linear-gradient(135deg, #fae8ff, #f3d4f8)', iconColor: '#a21caf', shadow: 'rgba(162,28,175,0.08)', hoverBorder: '#d065e0', hoverShadow: 'rgba(162,28,175,0.15)', barColor: '#a21caf' }
                : (CARD_THEME[order.STATUS] || { border: '1px solid #e5e7eb', bg: '#fff', iconBg: '#f3f4f6', iconColor: '#6b7280', shadow: 'rgba(0,0,0,0.05)', hoverBorder: '#d1d5db', hoverShadow: 'rgba(0,0,0,0.1)', barColor: '#6b7280' });

              const pulseColor = theme.iconColor + '66';
              const pulseAnim = isWaiting ? 'pulseRingDynamic 2s infinite' : 'none';
              const statusIcon: Record<string, React.ReactNode> = {
                pending: <Clock size={20} color={theme.iconColor} strokeWidth={2.5} />,
                pending_stock: <Clock size={20} color={theme.iconColor} strokeWidth={2.5} />,
                processing: <Clock size={20} color={theme.iconColor} strokeWidth={2.5} />,
                paid: <CheckCircle size={22} color={theme.iconColor} />,
                payment_review: <Upload size={20} color={theme.iconColor} />,
                payment_confirmed: <CheckCircle size={22} color={theme.iconColor} />,
                negotiation: <MessageSquare size={20} color={theme.iconColor} />,
                shipped: <Package size={22} color={theme.iconColor} />,
                delivered: <Truck size={22} color={theme.iconColor} />,
                cancelled: <XCircle size={22} color={theme.iconColor} />,
              };
              return (
                <Link key={order.$id} href={`/pedido/${order.$id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, background: theme.bg, borderRadius: 16, padding: '16px 18px', textDecoration: 'none', border: theme.border, boxShadow: `0 2px 8px ${theme.shadow}`, transition: 'all .25s cubic-bezier(.16,1,.3,1)', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = theme.hoverBorder; el.style.boxShadow = `0 4px 16px ${theme.hoverShadow}`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = theme.border; el.style.boxShadow = `0 2px 8px ${theme.shadow}`; }}>
                  {isWaiting && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${theme.barColor}, transparent)`, backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
                  )}
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: pulseAnim, position: 'relative', ['--pulse-color' as any]: pulseColor }}>
                    {statusIcon[order.STATUS] || <Package size={22} color={theme.iconColor} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{order.ORDERCODE}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: st.bg, color: st.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {isWaiting && <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, animation: 'pulse 1.5s ease-in-out infinite' }} />}
                        {st.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#374151', fontWeight: 500 }}>{items.length} producto{items.length !== 1 ? 's' : ''}{qty !== items.length ? ` · ${qty} uds` : ''} · {formatPrice(order.TOTAL)}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af' }}>{date}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignItems: 'flex-end' }}>
                    <ChevronRight size={16} color="#d1d5db" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </CuentaPageShell>
  );
}
