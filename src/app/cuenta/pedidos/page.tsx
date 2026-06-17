'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, ArrowLeft, Loader2, Search, Receipt, RefreshCw, ShoppingCart } from 'lucide-react';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION, formatPrice } from '@/lib/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { useCuentaBg } from '../CuentaBgContext';
import { useCart } from '@/context/CartContext';
import { Query } from 'appwrite';
import CuentaPageShell from '@/components/cuenta/CuentaPageShell';

const FF = '"DM Sans",system-ui,sans-serif';
const PINK = '#e396bf';

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:            { label: 'Pendiente',                 bg: '#fff8e1', color: '#f57f17' },
  processing:         { label: 'Pago a verificar',          bg: '#e3f2fd', color: '#1565c0' },
  paid:               { label: 'Pago verificado',           bg: '#e8f5e9', color: '#2e7d32' },
  assembling:         { label: 'Armando',                   bg: '#f3e5f5', color: '#7b1fa2' },
  preparing_shipping: { label: 'Etiqueta lista',        bg: '#efebe9', color: '#5d4037' },
  ready_to_ship:      { label: 'Pedido listo para enviar',            bg: '#e0f7fa', color: '#00838f' },
  shipped:            { label: 'Enviado',                   bg: '#fdf2f8', color: '#e396bf' },
  delivered:          { label: 'Entregado',                 bg: '#e8f5e9', color: '#1b5e20' },
  cancelled:          { label: 'Cancelado',                 bg: '#ffebee', color: '#c62828' },
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#fdf2f8 0%,#fff 280px)' }}>
      <Loader2 size={32} color={PINK} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!isLoggedIn || !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#fdf2f8 0%,#fff 280px)', fontFamily: FF }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #fce7f3', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <Link href="/cuenta" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ArrowLeft size={22} color={PINK} />
          </Link>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Mis Pedidos</span>
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 12px' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '50px 24px', textAlign: 'center', border: '1px solid #fce7f3' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Receipt size={32} color={PINK} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800, color: '#111827' }}>Iniciar sesión para ver tus pedidos</h2>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280' }}>Necesitás una cuenta para acceder a tu historial de compras</p>
            <Link href="/login" style={{ display: 'inline-block', padding: '12px 32px', background: `linear-gradient(135deg,${PINK},#c0547a)`, color: '#fff', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 6px 20px rgba(227,150,191,0.25)' }}>
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
    { key: 'pending', label: 'Pendientes' },
    { key: 'processing', label: 'Pago a verificar' },
    { key: 'paid', label: 'Pago verificado' },
    { key: 'assembling', label: 'Armando' },
    { key: 'preparing_shipping', label: 'Etiqueta lista' },
    { key: 'ready_to_ship', label: 'Pedido listo para enviar' },
    { key: 'shipped', label: 'Enviados' },
    { key: 'delivered', label: 'Entregados' },
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
            style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #fce7f3', borderRadius: 12, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: FF }} />
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 4, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {statusTabs.map(tab => {
            const count = tab.key === 'all' ? orders.length : orders.filter(o => o.STATUS === tab.key).length;
            return (
              <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: statusFilter === tab.key ? `linear-gradient(135deg,${PINK},#c0547a)` : '#fff',
                  color: statusFilter === tab.key ? '#fff' : '#6b7280',
                  border: `1.5px solid ${statusFilter === tab.key ? 'transparent' : '#fce7f3'}`,
                  whiteSpace: 'nowrap', flexShrink: 0, boxShadow: statusFilter === tab.key ? '0 4px 12px rgba(227,150,191,0.25)' : 'none', transition: 'all .2s', scrollSnapAlign: 'start',
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
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, border: '1px solid #fce7f3', padding: '50px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Receipt size={32} color={PINK} />
            </div>
            <p style={{ color: '#111827', fontSize: 17, fontWeight: 800, margin: '0 0 6px' }}>Sin pedidos aún</p>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 20px' }}>
              {search ? 'No encontramos resultados' : 'Aquí aparecerán tus compras'}
            </p>
            {!search && (
              <Link href="/productos" style={{ display: 'inline-block', padding: '12px 28px', background: `linear-gradient(135deg,${PINK},#c0547a)`, color: '#fff', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 6px 20px rgba(227,150,191,0.25)' }}>
                Ver productos
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(order => {
              const isRetiro = order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
              const isReadyRetiro = order.STATUS === 'ready_to_ship' && isRetiro;
              const st = isReadyRetiro 
                ? { label: 'Listo para retirar', bg: '#fae8ff', color: '#a21caf' }
                : (STATUS[order.STATUS] || { label: order.STATUS, bg: '#f5f5f5', color: '#666' });
              let items: any[] = [];
              try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
              const qty = items.reduce((s: number, i: any) => s + (i.qty || 1), 0);
              const date = new Date(order.CREATEDAT || order.$createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
              return (
                <Link key={order.$id} href={`/pedido/${order.$id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 16, padding: '16px 18px', textDecoration: 'none', border: '1px solid #fce7f3', boxShadow: '0 2px 8px rgba(227,150,191,0.06)', transition: 'all .25s cubic-bezier(.16,1,.3,1)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(227,150,191,0.3)'; el.style.boxShadow = '0 4px 16px rgba(227,150,191,0.12)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#fce7f3'; el.style.boxShadow = '0 2px 8px rgba(227,150,191,0.06)'; }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={22} color={PINK} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{order.ORDERCODE}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#374151', fontWeight: 500 }}>{qty} artículo{qty !== 1 ? 's' : ''} · {formatPrice(order.TOTAL)}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af' }}>{date}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignItems: 'flex-end' }}>
                    {(order.STATUS === 'delivered' || order.STATUS === 'cancelled') && (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); reorder(order); }}
                        title="Volver a pedir"
                        style={{ padding: '5px 10px', background: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: PINK, fontWeight: 700, transition: 'all .2s' }}>
                        <RefreshCw size={11} /> Recomprar
                      </button>
                    )}
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
