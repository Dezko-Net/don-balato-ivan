'use client';

/* ══════════════════════════════════════════════════════════════════
   Navbar23 — versión REUTILIZABLE del navbar del home (plantilla 23).
   Antes ese navbar solo existía inyectado dentro de plantilla23/HomePage
   (DOM manipulado sobre el HTML del tema). Aquí está como componente React
   para usarlo en product detail y demás páginas vía DynamicNavbar.
   - Mega-menú de categorías (mismo diseño que el home).
   - Badge del carrito REACTIVO (useCart) — arregla el "(0)" que no se movía.
   - Header + drawer móvil + barra inferior de accesos.
   ══════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Heart, Menu, X, Home, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Category, Subcategory } from '@/types';

const LOGO = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784401902773-pegada-1784401898779.png';

const EMOJI: Record<string, string> = {
  'Skincare': '🧴', 'Skincare Facial': '🧴', 'Maquillaje': '💄', 'Capilar': '💇‍♀️',
  'Manicure': '💅', 'Herramientas': '🔧', 'Otros': '📦', 'Aromaterapia y Difusores': '🕯️',
  'Empaques y Regalos': '🎁', 'Fragancias': '🌸', 'Cabello': '💇‍♀️', 'Cuerpo': '🧼', 'Ofertas': '🏷️',
};

export default function Navbar23() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [cats, setCats] = useState<Category[]>([]);
  const [subs, setSubs] = useState<Subcategory[]>([]);
  const [catCounts, setCatCounts] = useState<Record<string, number>>({});
  const [subCounts, setSubCounts] = useState<Record<string, number>>({});
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);

  // ── Fetch categorías + conteos (misma fuente que el home) ──
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/public-data/catalog'),
          fetch('/api/public-data/products?limit=1'),
        ]);
        if (!catRes.ok || !prodRes.ok || !active) return;
        const catData = await catRes.json();
        const prodData = await prodRes.json();
        if (!active) return;
        setCats((catData.categories || []) as Category[]);
        setSubs((catData.subcategories || []) as Subcategory[]);
        setCatCounts(prodData.categoryCounts || {});
        setSubCounts(prodData.subcategoryCounts || {});
      } catch { /* silencioso */ }
    })();
    return () => { active = false; };
  }, []);

  // Cerrar drawer y mega-menús al cambiar de página
  useEffect(() => { setDrawer(false); setOpenGroup(null); }, [pathname]);

  const navCats = useMemo(
    () => cats.filter(c => (catCounts[c.$id] || 0) > 0).sort((a, b) => (catCounts[b.$id] || 0) - (catCounts[a.$id] || 0)),
    [cats, catCounts]
  );
  const subsFor = (catId: string) =>
    subs.filter(s => (s as any).categoryId === catId && !(s as any).parentSubcategoryId && (subCounts[s.$id] || 0) > 0)
      .sort((a, b) => (subCounts[b.$id] || 0) - (subCounts[a.$id] || 0));
  const subSubsFor = (subId: string) => subs.filter(s => (s as any).parentSubcategoryId === subId);

  const badge = totalItems > 99 ? '99+' : String(totalItems);

  return (
    <div className="nb23-root">
      {/* ─────────── NAVBAR DESKTOP (mega-menú) ─────────── */}
      <div className="nb23-pc">
        <div className="nb23-container">
          <Link href="/" className="nb23-logo">
            <img src={LOGO} alt="Kevin & Coco Chile" />
          </Link>

          <nav className="nb23-bottom" aria-label="Navegación principal">
            <Link href="/" className="nb23-link" style={{ fontWeight: 700, color: '#e0457b' }}>Inicio</Link>
            <Link href="/productos" className="nb23-link">Tienda</Link>
            {navCats.map(cat => {
              const cSubs = subsFor(cat.$id);
              const emoji = EMOJI[cat.name] || '';
              const catLink = `/productos?categoria=${encodeURIComponent(cat.name)}`;
              if (cSubs.length === 0) {
                return <Link key={cat.$id} href={catLink} className="nb23-link">{emoji ? `${emoji} ` : ''}{cat.name}</Link>;
              }
              const isOpen = openGroup === cat.$id;
              return (
                <div key={cat.$id} className={`nb23-group${isOpen ? ' open' : ''}`}>
                  <button
                    type="button"
                    className="nb23-parent"
                    onClick={() => setOpenGroup(isOpen ? null : cat.$id)}
                  >
                    {emoji ? `${emoji} ` : ''}{cat.name}
                    <ChevronDown size={13} className="nb23-caret" />
                  </button>
                  <div className="nb23-mega">
                    {cSubs.map(sub => {
                      const ssubs = subSubsFor(sub.$id);
                      return (
                        <div key={sub.$id} className="nb23-mega-col">
                          <Link href={`${catLink}&subcat=${encodeURIComponent(sub.$id)}`} className="nb23-mega-title">{sub.name}</Link>
                          {ssubs.length > 0
                            ? ssubs.map(ss => (
                                <Link key={ss.$id} href={`${catLink}&subcat=${encodeURIComponent(sub.$id)}&subSubcat=${encodeURIComponent(ss.$id)}`}>{ss.name}</Link>
                              ))
                            : <Link href={`${catLink}&subcat=${encodeURIComponent(sub.$id)}`}>Ver todo ({subCounts[sub.$id] || 0})</Link>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="nb23-actions">
            <Link href="/productos" className="nb23-cat-link">Catálogo</Link>
            <Link href="/productos" aria-label="Buscar" className="nb23-icon"><Search size={21} /></Link>
            <Link href="/carrito" aria-label="Carrito" className="nb23-icon nb23-cart">
              <ShoppingBag size={21} />
              {totalItems > 0 && <span className="nb23-badge">{badge}</span>}
            </Link>
            <Link href="/cuenta" aria-label="Mi cuenta" className="nb23-icon"><User size={21} /></Link>
          </div>
        </div>
      </div>

      {/* ─────────── HEADER MÓVIL ─────────── */}
      <div className="nb23-mobile">
        <button type="button" className="nb23-m-btn" aria-label="Menú" onClick={() => setDrawer(true)}><Menu size={24} /></button>
        <Link href="/" className="nb23-m-logo"><img src={LOGO} alt="Kevin & Coco" /></Link>
        <div className="nb23-m-icons">
          <Link href="/productos" aria-label="Buscar" className="nb23-m-btn"><Search size={22} /></Link>
          <Link href="/carrito" aria-label="Carrito" className="nb23-m-btn nb23-cart">
            <ShoppingBag size={22} />
            {totalItems > 0 && <span className="nb23-badge">{badge}</span>}
          </Link>
        </div>
      </div>

      {/* ─────────── DRAWER MÓVIL ─────────── */}
      {drawer && (
        <>
          <div className="nb23-backdrop" onClick={() => setDrawer(false)} />
          <aside className="nb23-drawer">
            <div className="nb23-drawer-head">
              <img src={LOGO} alt="Kevin & Coco" />
              <button type="button" aria-label="Cerrar" onClick={() => setDrawer(false)}><X size={22} /></button>
            </div>
            <Link href="/" className="nb23-d-link nb23-d-strong">Inicio</Link>
            <Link href="/productos" className="nb23-d-link nb23-d-strong">Tienda</Link>
            <div className="nb23-d-sep">Categorías</div>
            {navCats.map(cat => (
              <Link key={cat.$id} href={`/productos?categoria=${encodeURIComponent(cat.name)}`} className="nb23-d-link">
                {EMOJI[cat.name] ? `${EMOJI[cat.name]} ` : ''}{cat.name}
                <span className="nb23-d-count">{catCounts[cat.$id] || 0}</span>
              </Link>
            ))}
            <div className="nb23-d-sep" />
            <Link href="/cuenta/pedidos" className="nb23-d-link nb23-d-strong">Mis Pedidos</Link>
            <Link href="/cuenta" className="nb23-d-link nb23-d-strong">Mi Cuenta</Link>
          </aside>
        </>
      )}

      {/* ─────────── BARRA INFERIOR MÓVIL ─────────── */}
      <nav className="nb23-tabbar" aria-label="Accesos rápidos">
        <Link href="/" className={`nb23-tab${pathname === '/' ? ' active' : ''}`}><Home size={20} /><span>Inicio</span></Link>
        <Link href="/productos" className={`nb23-tab${pathname.startsWith('/productos') ? ' active' : ''}`}><Search size={20} /><span>Tienda</span></Link>
        <Link href="/favoritos" className={`nb23-tab${pathname === '/favoritos' ? ' active' : ''}`}><Heart size={20} /><span>Favoritos</span></Link>
        <Link href="/carrito" className={`nb23-tab nb23-cart${pathname === '/carrito' ? ' active' : ''}`}>
          <ShoppingBag size={20} />{totalItems > 0 && <span className="nb23-badge nb23-badge-tab">{badge}</span>}<span>Carrito</span>
        </Link>
        <Link href="/cuenta" className={`nb23-tab${pathname.startsWith('/cuenta') ? ' active' : ''}`}><User size={20} /><span>Cuenta</span></Link>
      </nav>

      <style>{`
        .nb23-root { font-family: 'Outfit','Inter',system-ui,sans-serif; }
        .nb23-badge {
          position: absolute; top: -5px; right: -7px; min-width: 17px; height: 17px; padding: 0 4px;
          display: flex; align-items: center; justify-content: center; box-sizing: border-box;
          background: #e0457b; color: #fff; border-radius: 999px; font-size: 10px; font-weight: 800;
          line-height: 1; border: 1.5px solid #fff;
        }
        .nb23-cart { position: relative; }

        /* ── DESKTOP ── */
        .nb23-pc { display: none; }
        @media (min-width: 993px) {
          .nb23-pc {
            display: flex; position: sticky; top: 0; z-index: 50; width: 100%;
            background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 8px 0;
          }
          .nb23-mobile, .nb23-tabbar { display: none !important; }
        }
        .nb23-container {
          width: 100%; max-width: 100%; padding: 0 6.5%;
          display: flex; flex-direction: row; align-items: center; gap: 24px;
        }
        .nb23-logo { display: flex; align-items: center; flex: 0 0 auto; line-height: 0; }
        .nb23-logo img { height: 30px; width: auto; max-width: 112px; object-fit: contain; }
        .nb23-bottom {
          display: flex; justify-content: center; align-items: center; flex: 1 1 auto;
          flex-wrap: nowrap; gap: 20px; margin: 0 auto; font-size: 12px; font-weight: 600; min-width: 0;
        }
        .nb23-link { color: #001b2e; text-decoration: none; white-space: nowrap; transition: opacity 0.2s; background: none; border: none; cursor: pointer; font: inherit; }
        .nb23-link:hover { opacity: 0.7; }
        .nb23-group { position: relative; display: flex; align-items: center; }
        .nb23-parent {
          display: inline-flex; align-items: center; gap: 3px; cursor: pointer;
          background: none; border: none; font: inherit; color: #001b2e; white-space: nowrap; padding: 0;
        }
        .nb23-caret { transition: transform 0.2s ease; }
        .nb23-group:hover .nb23-caret, .nb23-group.open .nb23-caret { transform: rotate(180deg); }
        .nb23-mega {
          display: none; position: absolute; top: calc(100% + 1px); left: 50%; transform: translateX(-50%);
          min-width: 600px; padding: 18px 28px 24px; background: #fff; border-radius: 0 0 14px 14px;
          box-shadow: 0 14px 35px rgba(0,0,0,.16); z-index: 100;
          grid-template-columns: repeat(3, minmax(150px, 1fr)); gap: 22px 34px; text-align: left;
        }
        .nb23-mega::before { content: ''; position: absolute; top: -18px; left: 0; right: 0; height: 18px; }
        .nb23-group:hover .nb23-mega, .nb23-group.open .nb23-mega { display: grid; }
        .nb23-mega-col { display: flex; flex-direction: column; gap: 7px; }
        .nb23-mega-title { margin-bottom: 4px; color: #333 !important; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; text-decoration: none; }
        .nb23-mega a { display: block; color: #666; font-size: 12px; font-weight: 500; text-decoration: none; }
        .nb23-mega a:hover { color: #d277a5; }
        .nb23-actions { display: flex; align-items: center; gap: 18px; flex: 0 0 auto; margin-left: 18px; }
        .nb23-cat-link { font-size: 12px; font-weight: 900; color: #e0457b; text-decoration: none; text-transform: uppercase; white-space: nowrap; }
        .nb23-cat-link:hover { opacity: 0.7; }
        .nb23-icon { color: #000; display: inline-flex; align-items: center; position: relative; text-decoration: none; }
        .nb23-icon:hover { opacity: 0.7; }

        /* ── MÓVIL: header superior ── */
        .nb23-mobile {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 10px 14px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          position: sticky; top: 0; z-index: 50;
        }
        .nb23-m-btn { background: none; border: none; color: #111827; cursor: pointer; display: inline-flex; align-items: center; position: relative; text-decoration: none; padding: 4px; }
        .nb23-m-logo img { height: 28px; width: auto; object-fit: contain; }
        .nb23-m-icons { display: flex; align-items: center; gap: 14px; }

        /* ── DRAWER ── */
        .nb23-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); z-index: 9998; }
        .nb23-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: min(82vw, 340px); background: #fff; z-index: 9999;
          display: flex; flex-direction: column; padding: 14px 12px calc(14px + env(safe-area-inset-bottom,0px));
          box-shadow: 6px 0 30px rgba(0,0,0,0.18); overflow-y: auto; animation: nb23In .28s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes nb23In { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .nb23-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 12px; }
        .nb23-drawer-head img { height: 30px; }
        .nb23-drawer-head button { background: #f8f4f6; border: none; width: 36px; height: 36px; border-radius: 50%; color: #c0547a; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .nb23-d-link {
          display: flex; align-items: center; justify-content: space-between; padding: 13px 12px; border-radius: 12px;
          color: #374151; text-decoration: none; font-size: 15px; font-weight: 600;
        }
        .nb23-d-link:hover { background: #fdf2f8; }
        .nb23-d-strong { font-weight: 800; color: #111827; }
        .nb23-d-count { font-size: 11px; font-weight: 800; color: #9ca3af; background: #f3f4f6; border-radius: 999px; padding: 2px 9px; }
        .nb23-d-sep { padding: 12px 12px 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #c0547a; }

        /* ── BARRA INFERIOR ── */
        .nb23-tabbar {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; display: flex;
          background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-top: 1px solid #f1e6ec;
          padding: 6px 4px calc(6px + env(safe-area-inset-bottom,0px));
        }
        .nb23-tab {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
          color: #9ca3af; text-decoration: none; font-size: 10px; font-weight: 700; position: relative; padding: 4px 0;
        }
        .nb23-tab.active { color: #c0547a; }
        .nb23-badge-tab { top: -2px; right: calc(50% - 20px); }
        @media (min-width: 993px) { .nb23-tabbar, .nb23-mobile { display: none; } }
      `}</style>
    </div>
  );
}
