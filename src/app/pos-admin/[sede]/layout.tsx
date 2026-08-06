'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { SEDES, DEFAULT_SEDE, SedeSlug } from '@/types';
import {
  LayoutDashboard, ShoppingCart, RotateCcw, FileText, Store, Clock,
  Lock, Users, Package, Tags, BarChart3, Settings, ChevronDown, ChevronRight,
  Menu, X, ArrowLeft, Boxes, ArrowRightLeft, ClipboardList, Warehouse,
  PackageCheck, PackageMinus, TrendingUp, UserCog, CreditCard,
} from 'lucide-react';

// ─── Sede accent colors ────────────────────────────────────────────────────────
interface SedeAccent {
  accent: string;
  accentText: string;
  accentBorder: string;
  dot: string;
  logo: string;
  btnPOS: string;
  badge: string;
  badgeText: string;
  pickerHover: string;
  pickerBorderHover: string;
  pickerIcon: string;
  pickerIconBg: string;
}

const ACCENT_PALETTE: SedeAccent[] = [
  { accent: 'bg-sky-50', accentText: 'text-sky-700', accentBorder: 'border-sky-300', dot: 'bg-sky-500', logo: 'bg-sky-500', btnPOS: 'bg-sky-500 hover:bg-sky-600', badge: 'bg-sky-50', badgeText: 'text-sky-700', pickerHover: 'hover:bg-sky-50', pickerBorderHover: 'hover:border-sky-400', pickerIcon: 'text-sky-600', pickerIconBg: 'bg-sky-100 group-hover:bg-sky-200' },
  { accent: 'bg-emerald-50', accentText: 'text-emerald-700', accentBorder: 'border-emerald-300', dot: 'bg-emerald-500', logo: 'bg-emerald-500', btnPOS: 'bg-emerald-500 hover:bg-emerald-600', badge: 'bg-emerald-50', badgeText: 'text-emerald-700', pickerHover: 'hover:bg-emerald-50', pickerBorderHover: 'hover:border-emerald-400', pickerIcon: 'text-emerald-600', pickerIconBg: 'bg-emerald-100 group-hover:bg-emerald-200' },
  { accent: 'bg-violet-50', accentText: 'text-violet-700', accentBorder: 'border-violet-300', dot: 'bg-violet-500', logo: 'bg-violet-500', btnPOS: 'bg-violet-500 hover:bg-violet-600', badge: 'bg-violet-50', badgeText: 'text-violet-700', pickerHover: 'hover:bg-violet-50', pickerBorderHover: 'hover:border-violet-400', pickerIcon: 'text-violet-600', pickerIconBg: 'bg-violet-100 group-hover:bg-violet-200' },
  { accent: 'bg-rose-50', accentText: 'text-rose-700', accentBorder: 'border-rose-300', dot: 'bg-rose-500', logo: 'bg-rose-500', btnPOS: 'bg-rose-500 hover:bg-rose-600', badge: 'bg-rose-50', badgeText: 'text-rose-700', pickerHover: 'hover:bg-rose-50', pickerBorderHover: 'hover:border-rose-400', pickerIcon: 'text-rose-600', pickerIconBg: 'bg-rose-100 group-hover:bg-rose-200' },
  { accent: 'bg-amber-50', accentText: 'text-amber-700', accentBorder: 'border-amber-300', dot: 'bg-amber-500', logo: 'bg-amber-500', btnPOS: 'bg-amber-500 hover:bg-amber-600', badge: 'bg-amber-50', badgeText: 'text-amber-700', pickerHover: 'hover:bg-amber-50', pickerBorderHover: 'hover:border-amber-400', pickerIcon: 'text-amber-600', pickerIconBg: 'bg-amber-100 group-hover:bg-amber-200' },
  { accent: 'bg-indigo-50', accentText: 'text-indigo-700', accentBorder: 'border-indigo-300', dot: 'bg-indigo-500', logo: 'bg-indigo-500', btnPOS: 'bg-indigo-500 hover:bg-indigo-600', badge: 'bg-indigo-50', badgeText: 'text-indigo-700', pickerHover: 'hover:bg-indigo-50', pickerBorderHover: 'hover:border-indigo-400', pickerIcon: 'text-indigo-600', pickerIconBg: 'bg-indigo-100 group-hover:bg-indigo-200' },
  { accent: 'bg-teal-50', accentText: 'text-teal-700', accentBorder: 'border-teal-300', dot: 'bg-teal-500', logo: 'bg-teal-500', btnPOS: 'bg-teal-500 hover:bg-teal-600', badge: 'bg-teal-50', badgeText: 'text-teal-700', pickerHover: 'hover:bg-teal-50', pickerBorderHover: 'hover:border-teal-400', pickerIcon: 'text-teal-600', pickerIconBg: 'bg-teal-100 group-hover:bg-teal-200' },
  { accent: 'bg-orange-50', accentText: 'text-orange-700', accentBorder: 'border-orange-300', dot: 'bg-orange-500', logo: 'bg-orange-500', btnPOS: 'bg-orange-500 hover:bg-orange-600', badge: 'bg-orange-50', badgeText: 'text-orange-700', pickerHover: 'hover:bg-orange-50', pickerBorderHover: 'hover:border-orange-400', pickerIcon: 'text-orange-600', pickerIconBg: 'bg-orange-100 group-hover:bg-orange-200' },
];

function getSedeAccent(slug: string): SedeAccent {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}

function getSedeTheme(slug: string) {
  const a = getSedeAccent(slug);
  return {
    sidebar: 'bg-white', border: 'border-gray-200', logo: a.logo,
    accent: a.accent, accentText: a.accentText, accentBorder: a.accentBorder,
    header: 'bg-white', headerBorder: 'border-gray-200',
    badge: a.badge, badgeText: a.badgeText, dot: a.dot, btnPOS: a.btnPOS,
    picker: a.pickerHover, pickerBorder: a.pickerBorderHover,
    pickerIcon: a.pickerIcon, pickerIconBg: a.pickerIconBg,
  };
}

interface NavSection {
  label: string;
  icon: React.ReactNode;
  children: Array<{ label: string; path: string; icon: React.ReactNode }>;
}

const sections: NavSection[] = [
  {
    label: 'Ventas',
    icon: <CreditCard size={18} />,
    children: [
      { label: 'Historial de ventas', path: 'ventas', icon: <FileText size={16} /> },
      { label: 'Historial de devoluciones', path: 'devoluciones', icon: <RotateCcw size={16} /> },
      { label: 'Punto de venta', path: 'cajero', icon: <ShoppingCart size={16} /> },
      { label: 'Historial de caja POS', path: 'caja-historial', icon: <Clock size={16} /> },
      { label: 'Cerrar caja POS', path: 'caja-cerrar', icon: <Lock size={16} /> },
      { label: 'Historial de cierre de cajas', path: 'caja-cierres', icon: <ClipboardList size={16} /> },
      { label: 'Clientes', path: 'clientes', icon: <Users size={16} /> },
    ],
  },
  {
    label: 'Producto',
    icon: <Package size={18} />,
    children: [
      { label: 'Productos', path: 'productos', icon: <Package size={16} /> },
      { label: 'Listas de precios', path: 'listas-precios', icon: <Tags size={16} /> },
      { label: 'Descuentos', path: 'descuentos', icon: <Tags size={16} /> },
    ],
  },
  {
    label: 'Inventario',
    icon: <Boxes size={18} />,
    children: [
      { label: 'Stock', path: 'stock', icon: <Warehouse size={16} /> },
      { label: 'Recepciones', path: 'recepciones', icon: <PackageCheck size={16} /> },
      { label: 'Control de inventario', path: 'control-inventario', icon: <ClipboardList size={16} /> },
      { label: 'Despachos', path: 'despachos', icon: <PackageMinus size={16} /> },
      { label: 'Movimiento de stock', path: 'movimientos', icon: <ArrowRightLeft size={16} /> },
    ],
  },
  {
    label: 'Informes',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Informes de ventas', path: 'informes', icon: <TrendingUp size={16} /> },
    ],
  },
];

const configSection: NavSection = {
  label: 'Administrar',
  icon: <Settings size={18} />,
  children: [
    { label: 'Configuracion general', path: 'config', icon: <Settings size={16} /> },
    { label: 'Usuarios', path: 'usuarios', icon: <UserCog size={16} /> },
  ],
};

export default function PosAdminSedeLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ sede: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const currentSede = ((params?.sede) || DEFAULT_SEDE) as SedeSlug;

  const [dynamicBranches, setDynamicBranches] = useState<Array<{ slug: string; name: string }>>([
    { slug: 'chacabuco-08', name: 'CHACABUCO 08' },
  ]);

  React.useEffect(() => {
    fetch('/api/admin-supreme/load-config')
      .then(res => res.json())
      .then(res => {
        if (res.ok && res.data) {
          try {
            const parsed = JSON.parse(res.data);
            if (Array.isArray(parsed.branches) && parsed.branches.length > 0) {
              const active = parsed.branches
                .filter((b: any) => b.active !== false)
                .map((b: any) => ({
                  slug: b.slug || b.name?.toLowerCase().replace(/\s+/g, '-'),
                  name: b.name || b.slug,
                }));
              if (active.length > 0) setDynamicBranches(active);
            }
          } catch (e) {
            console.error('Error parsing POS Admin config:', e);
          }
        }
      })
      .catch(err => console.error('Error fetching POS Admin config:', err));
  }, []);

  React.useEffect(() => {
    if (dynamicBranches.length > 0) {
      const isCurrentActive = dynamicBranches.some(b => b.slug === currentSede);
      if (!isCurrentActive) {
        const pathParts = pathname.split('/');
        const subPath = pathParts.slice(3).join('/') || 'ventas';
        router.replace(`/pos-admin/${dynamicBranches[0].slug}/${subPath}`);
      }
    }
  }, [dynamicBranches, currentSede, pathname, router]);

  const activeBranchObj = dynamicBranches.find(b => b.slug === currentSede);
  const sedeNombre = activeBranchObj ? activeBranchObj.name : (SEDES[currentSede] || currentSede.replace(/-/g, ' '));
  const basePath = `/pos-admin/${currentSede}`;
  const theme = getSedeTheme(currentSede);

  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ Ventas: true });
  const [mobileOpen, setMobileOpen] = useState(false);

  const textPrimary = 'text-gray-900';
  const textSecondary = 'text-gray-500';
  const textNav = 'text-gray-800';
  const hoverNav = 'hover:bg-gray-100';
  const borderColor = 'border-gray-200';

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isNavActive = (path: string) => pathname === `${basePath}/${path}`;
  const isBaseActive = pathname === basePath;

  const renderSection = (section: NavSection, isConfig = false) => {
    const isOpen = openSections[section.label] ?? false;
    return (
      <div key={section.label}>
        <button
          onClick={() => toggleSection(section.label)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
            isConfig ? `${textSecondary} ${hoverNav}` : `${textNav} ${hoverNav}`
          }`}
        >
          {section.icon}
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{section.label}</span>
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </>
          )}
        </button>
        {isOpen && !collapsed && (
          <div className={`ml-2 border-l ${borderColor}`}>
            {section.children.map(item => (
              <Link
                key={item.path}
                href={`${basePath}/${item.path}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2 ml-2 text-sm rounded-lg transition-colors border ${
                  isNavActive(item.path)
                    ? `${theme.accent} ${theme.accentText} font-semibold ${theme.accentBorder}`
                    : `border-transparent ${textSecondary} ${hoverNav}`
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full ${theme.sidebar}`}>
      {/* Logo */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${borderColor}`}>
        <button onClick={() => router.push('/admin')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className={`w-9 h-9 rounded-lg ${theme.logo} flex items-center justify-center`}>
            <Store size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="text-left">
              <div className={`font-bold text-sm ${textPrimary}`}>Yaxsel</div>
              <div className={`text-xs ${textSecondary}`}>Administrador</div>
            </div>
          )}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${textSecondary} hover:opacity-80 hidden lg:block`}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Sucursal activa */}
      {!collapsed && (
        <div className={`px-3 py-3 border-b ${borderColor}`}>
          <div className={`text-xs font-semibold uppercase tracking-wide px-1 mb-2 ${textSecondary}`}>Sucursal</div>
          {dynamicBranches.length > 1 ? (
            <select
              value={currentSede}
              onChange={(e) => router.push(`/pos-admin/${e.target.value}/ventas`)}
              className={`w-full rounded-xl px-3 py-2 text-sm font-medium ${theme.accent} ${theme.accentBorder} ${theme.accentText} border shadow-sm focus:outline-none cursor-pointer`}
            >
              {dynamicBranches.map(b => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          ) : (
            <div className={`flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-sm font-medium ${theme.accent} ${theme.accentBorder} ${theme.accentText} border shadow-sm`}>
              <Store size={15} className={theme.accentText} />
              <span className="truncate">{sedeNombre}</span>
              <span className={`ml-auto w-2 h-2 rounded-full ${theme.dot} shrink-0`} />
            </div>
          )}
        </div>
      )}

      {/* Dashboard link */}
      <div className="px-3 pt-3">
        <Link
          href={basePath}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
            isBaseActive
              ? `${theme.accent} ${theme.accentText} ${theme.accentBorder}`
              : `border-transparent ${textNav} ${hoverNav}`
          }`}
        >
          <LayoutDashboard size={18} />
          {!collapsed && 'Inicio'}
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {sections.map(s => renderSection(s))}
        <div className={`border-t ${borderColor} mt-2 pt-2`}>
          <div className={`text-xs px-4 py-1 font-semibold uppercase tracking-wider ${textSecondary}`}>
            {!collapsed && 'Configuracion'}
          </div>
          {renderSection(configSection, true)}
        </div>
      </nav>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r ${theme.border} shrink-0 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 h-full shadow-2xl animate-[slideInLeft_0.25s_ease-out]">
            <button
              onClick={() => setMobileOpen(false)}
              className={`absolute top-4 right-4 z-10 ${textSecondary} hover:opacity-80`}
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className={`flex items-center justify-between ${theme.header} border-b ${theme.headerBorder} px-4 lg:px-6 py-3 shrink-0 shadow-sm`}>
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden ${textSecondary} hover:opacity-80 transition`}
            >
              <Menu size={22} />
            </button>
            <button
              onClick={() => router.push('/admin')}
              className={`${textSecondary} hover:opacity-80 transition`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`font-bold text-sm lg:text-lg ${textPrimary}`}>{sedeNombre}</h1>
              <p className={`text-[10px] lg:text-xs ${textSecondary}`}>Administrador POS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${theme.badge} ${theme.badgeText}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
              {sedeNombre}
            </span>
            <Link
              href={`/pos/${currentSede}`}
              className={`flex items-center gap-1.5 ${theme.btnPOS} text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold transition`}
            >
              <ShoppingCart size={14} /> <span className="hidden sm:inline">Ir a</span> POS
            </Link>
          </div>
        </header>

        {/* Page content — children = Outlet equivalent */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-sky-50/10 lg:bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile animation */}
      <style>{`
        @keyframes slideInLeft { 0%{transform:translateX(-100%)} 100%{transform:translateX(0)} }
      `}</style>
    </div>
  );
}
