'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setVisible(window.scrollY > 400));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchend', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchend', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, [pathname]);

  // Ocultar en rutas admin
  if (pathname?.startsWith('/admin')) return null;
  if (!visible) return null;

  const handleClick = () => {
    // Intentar smooth scroll, con fallback instantáneo
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
    // Fallback después de 500ms por si smooth no funciona en mobile
    setTimeout(() => { if (window.scrollY > 0) window.scrollTo(0, 0); }, 500);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Volver arriba"
      style={{
        position: 'fixed', bottom: 90, right: 20, zIndex: 40,
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,0.92)', border: '2px solid #000000', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity .2s, transform .2s',
        opacity: 1,
        transform: 'translateY(0)',
        backdropFilter: 'blur(12px)',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <ChevronUp size={22} color="#000000" />
    </button>
  );
}
