'use client';
import { useTemplate } from '@/context/TemplateContext';
import { usePathname } from 'next/navigation';
import Navbar1 from '@/templates/plantilla1/Navbar';
import Navbar2 from '@/templates/plantilla2/Navbar';
import Navbar3 from '@/templates/plantilla3/Navbar';
import Navbar4 from '@/templates/plantilla4/Navbar';
import Navbar100 from '@/templates/plantilla100/Navbar';
import Navbar101 from '@/templates/plantilla101/Navbar';
import Navbar23 from '@/components/Navbar23';

export default function DynamicNavbar() {
  const pathname = usePathname();
  const { isLoading, getSectionTemplate } = useTemplate();

  // 🎀 Navbar unificado (jul 2026): en el HOME la plantilla 23 inyecta su propio
  // navbar; en TODAS las demás páginas (product detail, catálogo, carrito, cuenta…)
  // usamos el MISMO diseño con Navbar23 (React reutilizable). Navbar23 trae su
  // propia data de categorías y el badge del carrito reactivo, así que no depende
  // del template ni del estado de carga.
  if (pathname !== '/') return <Navbar23 />;

  // ── HOME (pathname === '/') ──
  // La plantilla 23 inyecta su propio navbar; aquí devolvemos el navbar del
  // template de landing (comportamiento previo intacto).
  if (isLoading) return <Navbar1 />;
  const activeTemplate = getSectionTemplate('landing');
  if (activeTemplate === 2) return <Navbar2 />;
  if (activeTemplate === 3) return <Navbar3 />;
  if (activeTemplate === 4) return <Navbar4 />;
  if (activeTemplate === 100) return <Navbar100 />;
  if (activeTemplate === 101) return <Navbar101 />;
  // Por defecto Navbar1 (temas migrados como el 23 ocultan su parte superior vía CSS).
  return <Navbar1 />;
}
