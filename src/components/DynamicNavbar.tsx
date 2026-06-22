'use client';
import { useTemplate } from '@/context/TemplateContext';
import { usePathname } from 'next/navigation';
import Navbar1 from '@/templates/plantilla1/Navbar';
import Navbar2 from '@/templates/plantilla2/Navbar';
import Navbar3 from '@/templates/plantilla3/Navbar';
import Navbar4 from '@/templates/plantilla4/Navbar';
import Navbar100 from '@/templates/plantilla100/Navbar';
import Navbar101 from '@/templates/plantilla101/Navbar';

export default function DynamicNavbar() {
  const pathname = usePathname();
  const { template, isLoading, getSectionTemplate } = useTemplate();
  if (isLoading) return null;

  const isProductDetail = pathname.includes('/producto/') || pathname.includes('/productos/');
  const isCatalog = pathname.includes('/collections/all') || pathname === '/productos' || pathname === '/catalogo';
  const isCollections = pathname.includes('/collections');
  const isCart = pathname === '/carrito';
  const isCheckout = pathname === '/checkout';

  let activeTemplate = template;
  if (isProductDetail) {
    activeTemplate = getSectionTemplate('productDetail');
  } else if (isCatalog) {
    activeTemplate = getSectionTemplate('catalog');
  } else if (isCollections) {
    activeTemplate = getSectionTemplate('collections');
  } else if (isCart) {
    activeTemplate = getSectionTemplate('cart');
  } else if (isCheckout) {
    activeTemplate = getSectionTemplate('checkout');
  } else {
    activeTemplate = getSectionTemplate('landing');
  }

  if (activeTemplate === 1) return <Navbar1 />;
  if (activeTemplate === 2) return <Navbar2 />;
  if (activeTemplate === 3) return <Navbar3 />;
  if (activeTemplate === 4) return <Navbar4 />;
  if (activeTemplate === 100) return <Navbar100 />;
  if (activeTemplate === 101) return <Navbar101 />;
  
  // By default, return Navbar1. For HTML-migrated themes (like 23),
  // they will hide the top part of Navbar1 via CSS and only use the bottom mobile nav.
  return <Navbar1 />;
}
