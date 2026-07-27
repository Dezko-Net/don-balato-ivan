'use client';



import { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { ChevronUp } from 'lucide-react';



export default function BackToTop() {

  const [visible, setVisible] = useState(false);

  const pathname = usePathname();



  useEffect(() => {

    const onScroll = () => setVisible(window.scrollY > 400);

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('touchmove', onScroll, { passive: true });

    return () => {

      window.removeEventListener('scroll', onScroll);

      window.removeEventListener('touchmove', onScroll);

    };

  }, [pathname]);



  // Ocultar en rutas admin

  if (pathname?.startsWith('/admin')) return null;



  if (!visible) return null;



  return (

    <button

      onClick={() => {

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => { if (window.scrollY > 0) window.scrollTo(0, 0); }, 400);

      }}

      aria-label="Volver arriba"

      style={{

        position: 'fixed', bottom: 90, right: 20, zIndex: 40,

        width: 44, height: 44, borderRadius: '50%',

        background: 'rgba(255,255,255,0.92)', border: '2px solid rgba(0,0,0,0.25)', cursor: 'pointer',

        display: 'flex', alignItems: 'center', justifyContent: 'center',

        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',

        transition: 'opacity .2s, transform .2s, box-shadow .2s',

        opacity: visible ? 1 : 0,

        transform: visible ? 'translateY(0)' : 'translateY(10px)',

        backdropFilter: 'blur(12px)',

      }}

      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor = '#000000'; }}

      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.25)'; }}

    >

      <ChevronUp size={22} color="#000000" />

    </button>

  );

}

