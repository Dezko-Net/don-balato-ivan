'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { getSectionConfigAsync, getSectionConfig, isSectionEnabled, invalidateSectionCache, SectionConfig } from '@/lib/section-config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './chinamart.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── Google Fonts + Material Icons (loaded only when template 4 is active) ── */
const FONT_LINKS = [
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Serif+JP:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
];

/* ── DATA ── */
const SERVICES = [
  { img: '/chinamart/img_importacion.png', title: 'Importación de Alimentos Asiáticos', desc: 'Traemos directamente desde Asia los mejores productos alimenticios con calidad garantizada y origen certificado.' },
  { img: '/chinamart/img_ventas.png', title: 'Ventas Online', desc: 'Compra desde casa por WhatsApp o encuéntranos en Mundo Líder buscando "chinamart". Despacho rápido.' },
  { img: '/chinamart/img_mayoristas.png', title: 'Ventas Mayoristas', desc: 'Atendemos restaurantes, supermercados y negocios con precios competitivos y grandes volúmenes de stock.' },
  { img: '/chinamart/img_marcas.png', title: 'Representación de Marcas Asiáticas', desc: 'Representantes exclusivos en Chile de Kang Shi Fu (Master Kong) y otras marcas asiáticas de primer nivel.' },
  { img: '/chinamart/img_distribucion.png', title: 'Distribución a Retailers', desc: 'Distribuimos a tiendas, supermercados y cadenas de retail en todo Chile con logística confiable y puntual.' },
  { img: '/chinamart/img_catering.png', title: 'Catering para Eventos', desc: 'Proveemos productos asiáticos para eventos, festivales gastronómicos y celebraciones de cualquier tamaño.' },
];

const PRODUCTS = [
  { img: 'https://i5.walmartimages.cl/asr/89b57365-097a-4508-81f6-e93561794286.75ae2cc1898ede872c52556b48ab7e96.jpeg?odnHeight=400&odnWidth=400&odnBg=ffffff', name: 'Fideo Instantáneo Sabor Carne en Escabeche 122g × 12', brand: 'Kang Shi Fu', link: 'https://www.lider.cl/ip/instantaneos/fideo-instantaneo-kang-shi-fu-sabor-a-carne-en-escabeche-122g-12-potes/00693796210703' },
  { img: 'https://i5.walmartimages.cl/asr/1b4cc26c-7093-4ef6-bc8b-a26b10a4ed21.07b4de6f8c280d9d3bfc8451e3d60a9f.jpeg?odnHeight=400&odnWidth=400&odnBg=ffffff', name: 'Fideo Instantáneo Carne Especiada a Soja 110g × 12', brand: 'Kang Shi Fu', link: 'https://www.lider.cl/ip/cafe-te-y-hierbas/fideo-instantaneo-kang-shi-fu-sabor-artificial-carne-especiada-a-soja-110g-12-potes/00693796211512' },
  { img: 'https://i5.walmartimages.cl/asr/10189018-f73e-49cf-b139-b20189d49c5c.ef1603cdb4071a3ff51008bdd96274cb.jpeg?odnHeight=400&odnWidth=400&odnBg=ffffff', name: 'Té Jazmín Light 500 ml × Botella', brand: 'Kang Shi Fu', link: 'https://www.lider.cl/ip/otros/te-jazmin-light-marca-kang-shi-fu-500-ml-botella/00692129433798' },
  { img: 'https://i5.walmartimages.cl/asr/7cdef4bd-6169-4b8e-bd6d-bde3ce9a1fc1.57f7f159bd6a28c88da9d8fa464712f3.png?odnHeight=400&odnWidth=400&odnBg=ffffff', name: 'Fideo Instantáneo Pollo con Champiñón 100g × Pack 5', brand: 'Kang Shi Fu', link: 'https://www.lider.cl/ip/instantaneos/fideo-instantaneo-kang-shi-fu-taza-sabor-res-100g/00693796210710' },
  { img: 'https://i5.walmartimages.cl/asr/d37701a8-82c3-49bf-93f3-67442ab62b73.7f53d74006819ca351879ccbc2581294.jpeg?odnHeight=400&odnWidth=400&odnBg=ffffff', name: 'Fideo Instantáneo Carne Especiada a Soja 105g × 30', brand: 'Kang Shi Fu', link: 'https://www.lider.cl/ip/otros/producto/00693796211519' },
];

const TESTIMONIALS = [
  { name: 'Wei Zhang', role: 'Cliente frecuente', text: 'Increíble poder encontrar los fideos Kang Shi Fu originales en Chile. He probado muchos, pero la calidad de los que importa Chinamart es otro nivel. ¡Recomendadísimo el sabor de Res Escabechada!', orange: false },
  { name: 'Li Ming Chen', role: 'Distribuidor Regional', text: 'Como mayorista, la confiabilidad es todo. Chinamart cumple con los plazos y la autenticidad de las marcas que representan. Es el socio ideal para abastecer mi tienda con productos asiáticos reales.', orange: true },
  { name: 'Mei Lin Wang', role: 'Compra Online Lider', text: 'Compro siempre por Lider.cl y me encanta que Chinamart sea el proveedor. Los snacks y el té jazmín llegan siempre frescos y bien embalados. ¡El mejor servicio de importación!', orange: false },
];

const HERO_BG = 'https://lh3.googleusercontent.com/gps-cs-s/AHVAwep9PlG1c81UGSH7bGxvDv9yaqYmACAwinK63mOr4W0zMMV67kV26qGSZBuKiU-hm1AYso5ykPC9M6i-NN3DxwbrULbZgPgQxdRPchL5hBCHFpePFBbPj3mF3cvfbB9r5bO3OZ-t2SEiZIE=s1360-w1360-h1020';
const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/geminai-449212.firebasestorage.app/o/IADESIGN%2FSin%20t%C3%ADtulo-1.png?alt=media&token=53d73b12-0fba-47f8-a1c0-51f4ac180a76';
const ABOUT_IMG = 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/IADESIGN/2026/03/1774917466959-pegada-1774917466406.png?GoogleAccessId=imagen%40geminai-449212.iam.gserviceaccount.com&Expires=16730334000&Signature=QDFCu%2FRbKymxG79dKC8XSuQr6fig0KBCEitYCJbmWor3O6PtVTF%2FkEe5HigUDHS2YoTjR9IyaC%2BuFXufnkHfFiQxz3rZy9wf3L3DYFmhsc2Diu4WyeTot3n0kpw8Mk8DrnoBz%2BCCNGNyHRjVn6odc6KEgWsY2lP0B5tLwdys7ilw7XJGDv6Ut94X9k20hrtCRDIpjolEu2mMTpXP7yr4%2BEZsX34a6TIvOW9%2FotxNVS5wXaA2jIRXpq2M5tlj4etDTgA2cUtPUW9u1u3N9lphqvUQQoXcXZ5K7yTkkeusbK0rvA%2FDmfK40SN%2BEYFdxKvptsyPCHfsHR4gWXIFV7IiXg%3D%3D';
const LIDER_IMG = 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/IADESIGN/2026/03/1774783928091-pegada-1774783928031.png?GoogleAccessId=imagen%40geminai-449212.iam.gserviceaccount.com&Expires=16730334000&Signature=hJMnL7byQmZqJ4IuSQJPn8YqXgs3HtcXZPvJiBjlasNGMm8o%2Ba8EAw5u24JloOjGhY5GMXOBCryoop19Z%2F8bn8ogT0wbslJtFRs9iFbOUIY3sAl2YkHInZXbr%2BOIWmRv5yf9AQJkQp0mFzejk1MekjNKnZYmFQ8qyyEzeZpujGzbmuNfVnNswrjJeonxpNn6ekafkWzz%2BMvR7gR%2FgUu%2BG8Wya%2BMgIGjneNQo5msQC65AKbE8CboCzOdjs%2Fb84D3QFX5emq5ekD4C07ih%2FSnOSBvJuKL9JqlGbK2hyU44%2Fg0upLGZv8IvS0h8gQZp%2FJNAGliMmvVmlMCzy0vPbhW6Hg%3D%3D';

const MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d53260.76733168359!2d-70.673504!3d-33.45457!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5093eee6aab%3A0x4a86ff09d3cc7d6d!2sChinamart!5e0!3m2!1ses-419!2sus!4v1774780158630!5m2!1ses-419!2sus';

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor" />
  </svg>
);

export default function HomePage4() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sectionCfg, setSectionCfg] = useState<SectionConfig[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('#inicio');
  const scrolledRef = useRef(false);
  const backToTopVisibleRef = useRef(false);
  const activeSectionRef = useRef('#inicio');

  const sec = useCallback((id: string) => isSectionEnabled(sectionCfg, id), [sectionCfg]);
  const navSettings = useMemo(() => sectionCfg.find(s => s.id === 'cm_navbar')?.settings || {}, [sectionCfg]);
  const heroSettings = useMemo(() => sectionCfg.find(s => s.id === 'cm_hero')?.settings || {}, [sectionCfg]);
  const footerSettings = useMemo(() => sectionCfg.find(s => s.id === 'cm_footer')?.settings || {}, [sectionCfg]);
  const navLogo = navSettings.logoUrl || LOGO_URL;

  /* ── Load section config ── */
  useEffect(() => {
    getSectionConfigAsync().then(setSectionCfg);
  }, []);

  /* ── Load fonts dynamically ── */
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    FONT_LINKS.forEach(href => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => { links.forEach(l => l.remove()); };
  }, []);

  /* ── Scroll listener: navbar shrink + back to top + active link ── */
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const nextScrolled = window.scrollY > 80;
        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
        const nextBackToTopVisible = window.scrollY > 500;
        if (nextBackToTopVisible !== backToTopVisibleRef.current) {
          backToTopVisibleRef.current = nextBackToTopVisible;
          setBackToTopVisible(nextBackToTopVisible);
        }
      const y = window.scrollY + 140;
      const sects = document.querySelectorAll('section[id]');
        let nextActiveSection = activeSectionRef.current;
      sects.forEach(s => {
        const el = s as HTMLElement;
        if (y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
            nextActiveSection = '#' + el.id;
        }
      });
        if (nextActiveSection !== activeSectionRef.current) {
          activeSectionRef.current = nextActiveSection;
          setActiveSection(nextActiveSection);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── Theme Editor bridge (postMessage) ── */
  useEffect(() => {
    function handleEditorMsg(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return;
      const { type, sectionId } = e.data;
      if (type === 'te:reloadConfig') {
        invalidateSectionCache();
        const cfg = getSectionConfig();
        console.log('[Chinamart] Config reloaded from localStorage, navSettings:', cfg.find(s => s.id === 'cm_navbar')?.settings?.cmNavModel);
        setSectionCfg(cfg);
      }
      if (type === 'te:scrollTo' && sectionId) {
        const el = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (type === 'te:highlight' && sectionId) {
        document.querySelectorAll('[data-section-id]').forEach(el => el.classList.remove('te-highlight'));
        const el = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (el) el.classList.add('te-highlight');
      }
      if (type === 'te:unhighlight') {
        document.querySelectorAll('[data-section-id]').forEach(el => el.classList.remove('te-highlight'));
      }
    }
    window.addEventListener('message', handleEditorMsg);
    return () => window.removeEventListener('message', handleEditorMsg);
  }, []);

  /* ── Notify editor on section click/hover (when in iframe) ── */
  useEffect(() => {
    if (window === window.top) return;
    const getLabel = (id: string) => {
      const map: Record<string, string> = {
        cm_navbar: 'Navbar', cm_hero: 'Hero', cm_services: 'Servicios',
        cm_about: 'Nosotros', cm_products: 'Productos', cm_testimonials: 'Testimonios',
        cm_contact: 'Contacto', cm_footer: 'Footer',
      };
      return map[id] || id;
    };
    const handleClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        const id = el.dataset.sectionId;
        if (id) window.parent.postMessage({ type: 'te:select', sectionId: id }, '*');
      }
    };
    const handleMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      document.querySelectorAll('.te-hover-tip').forEach(t => t.remove());
      if (el) {
        const id = el.dataset.sectionId!;
        const rect = el.getBoundingClientRect();
        const tip = document.createElement('div');
        tip.className = 'te-hover-tip';
        tip.textContent = getLabel(id);
        tip.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;background:#F97316;color:#fff;padding:4px 10px;font-size:11px;font-weight:700;border-radius:4px 4px 4px 0;z-index:99999;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.2);`;
        document.body.appendChild(tip);
        el.classList.add('te-hover-outline');
        window.parent.postMessage({ type: 'te:hover', sectionId: id }, '*');
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (el) el.classList.remove('te-hover-outline');
      document.querySelectorAll('.te-hover-tip').forEach(t => t.remove());
      window.parent.postMessage({ type: 'te:hoverOut' }, '*');
    };
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── Smooth anchor scroll ── */
  const scrollToId = (id: string) => {
    const el = document.querySelector(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    gsap.to(window, { scrollTo: { y: top, autoKill: false }, duration: 1, ease: 'power3.inOut' });
    setMenuOpen(false);
  };

  const handleBackToTop = () => {
    gsap.to(window, { scrollTo: { y: 0, autoKill: false }, duration: 1.2, ease: 'power3.inOut' });
  };

  /* ── GSAP animations ── */
  useEffect(() => {
    if (!rootRef.current || sectionCfg.length === 0) return;
    const ctx = gsap.context(() => {
      // Section reveals
      rootRef.current!.querySelectorAll('.kicker, .section-title, .section-lead').forEach(el => {
        gsap.set(el, { y: 30, opacity: 0 });
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
          onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        });
      });

      // Highlight cards batch
      const hlCards = gsap.utils.toArray<HTMLElement>('.hl-card');
      hlCards.forEach((card, i) => {
        gsap.set(card, { y: 50, opacity: 0 });
        ScrollTrigger.create({ trigger: card, start: 'top 92%', once: true,
          onEnter: () => gsap.to(card, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: 'power3.out' })
        });
      });

      // Product cards
      const prodCards = gsap.utils.toArray<HTMLElement>('.prod-card');
      prodCards.forEach((card, i) => {
        gsap.set(card, { y: 40, opacity: 0, scale: 0.97 });
        ScrollTrigger.create({ trigger: card, start: 'top 92%', once: true,
          onEnter: () => gsap.to(card, { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.07, ease: 'back.out(1.4)' })
        });
      });

      // Testimonial cards
      const testiCards = gsap.utils.toArray<HTMLElement>('.testi-card');
      testiCards.forEach((card, i) => {
        const dir = i % 2 === 0 ? -55 : 55;
        gsap.set(card, { x: dir, y: 35, opacity: 0, rotation: i % 2 === 0 ? -2 : 2 });
        ScrollTrigger.create({ trigger: card, start: 'top 90%', once: true,
          onEnter: () => gsap.to(card, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 1.1, ease: 'expo.out' })
        });
      });

      // History section
      const histContent = rootRef.current!.querySelector('.history__content');
      const histImg = rootRef.current!.querySelector('.history__img');
      if (histContent) {
        gsap.set(histContent, { x: -50, opacity: 0 });
        ScrollTrigger.create({ trigger: histContent, start: 'top 88%', once: true,
          onEnter: () => gsap.to(histContent, { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' })
        });
      }
      if (histImg) {
        gsap.set(histImg, { x: 50, opacity: 0 });
        ScrollTrigger.create({ trigger: histImg, start: 'top 88%', once: true,
          onEnter: () => gsap.to(histImg, { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' })
        });
      }

      // Contact section
      const contactInfo = rootRef.current!.querySelector('.reservations__info, .reservations__details');
      const contactForm = rootRef.current!.querySelector('.reservations__form');
      if (contactInfo) {
        gsap.set(contactInfo, { x: -50, opacity: 0 });
        ScrollTrigger.create({ trigger: contactInfo, start: 'top 88%', once: true,
          onEnter: () => gsap.to(contactInfo, { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' })
        });
      }
      if (contactForm) {
        gsap.set(contactForm, { x: 50, opacity: 0 });
        ScrollTrigger.create({ trigger: contactForm, start: 'top 88%', once: true,
          onEnter: () => gsap.to(contactForm, { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' })
        });
      }

      // Parallax images
      rootRef.current!.querySelectorAll('.history__img img').forEach(img => {
        gsap.to(img, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: (img as HTMLElement).closest('section') || img, start: 'top bottom', end: 'bottom top', scrub: 1.8 }
        });
      });

      // Tilt 3D
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        rootRef.current!.querySelectorAll('.hl-card, .testi-card, .reservations__form, .prod-card').forEach(card => {
          (card as HTMLElement).style.transformStyle = 'preserve-3d';
          card.addEventListener('mousemove', (e: Event) => {
            const me = e as MouseEvent;
            const r = (card as HTMLElement).getBoundingClientRect();
            const xPct = (me.clientX - r.left) / r.width - 0.5;
            const yPct = (me.clientY - r.top) / r.height - 0.5;
            gsap.to(card, { rotationY: xPct * 14, rotationX: -yPct * 14, scale: 1.02, z: 20, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, z: 0, duration: 1, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
          });
        });
      }

      setTimeout(() => ScrollTrigger.refresh(), 200);
    }, rootRef);

    return () => ctx.revert();
  }, [sectionCfg]);

  /* ── Contact form ── */
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const email = fd.get('email') as string;
    const msg = fd.get('message') as string;
    const waMsg = `Hola Chinamart 👋\n\nNombre: ${name}\nTeléfono: ${phone}${email ? `\nEmail: ${email}` : ''}\n\nMensaje:\n${msg}`;
    window.open(`https://wa.me/56962293893?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  if (sectionCfg.length === 0) return null;

  /* ── Ordered middle sections (reorderable via editor) ── */
  const cmMiddle = sectionCfg
    .filter(s => s.id.startsWith('cm_') && s.id !== 'cm_navbar' && s.id !== 'cm_footer' && s.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSection = (id: string): React.ReactNode => {
    switch (id) {
      case 'cm_hero':
        return (
          <section
            className="hero"
            id="inicio"
            key="cm_hero"
            data-section-id="cm_hero"
            style={{
              '--cm-hero-text': heroSettings.cmHeroTextColor || '#ffffff',
              '--cm-hero-overlay-bg': heroSettings.cmHeroBgColor || '#111827',
              '--cm-hero-overlay-opacity': `${heroSettings.cmHeroOverlayOpacity ?? 0.55}`,
              '--cm-hero-height': `${heroSettings.cmHeroHeight ?? 700}px`,
              '--cm-hero-title-size': `${heroSettings.cmHeroTitleSize ?? 48}px`,
              '--cm-hero-btn-bg': heroSettings.cmHeroBtnBg || '#ef4444',
              '--cm-hero-btn-text': heroSettings.cmHeroBtnText || '#ffffff',
              '--cm-hero-btn-radius': `${heroSettings.cmHeroBtnRadius ?? 12}px`,
              '--cm-hero-align': heroSettings.cmHeroAlign || 'center',
            } as React.CSSProperties}
          >
            <div className="hero__bg">
              <img src={heroSettings.imageUrl || HERO_BG} alt="Alimentos asiáticos Chinamart" className="hero__bg-img" width={1920} height={1080} />
              <div className="hero__overlay" />
            </div>
            <div className="container hero__content">
              <p className="hero__eyebrow">¡Bienvenido a Chinamart!</p>
              <h1 className="hero__title">{heroSettings.title || <>¡Tu mundo de <span className="hero__title-red">alimentos asiáticos</span> en Chile!</>}</h1>
              <p className="hero__lead">{heroSettings.subtitle || <>Somos el representante exclusivo en Chile de la marca <strong>Kang Shi Fu (Master Kong)</strong>. Importación, distribución y venta mayorista y minorista.</>}</p>
              <div className="hero__actions">
                <a href={heroSettings.buttonLink || 'https://www.lider.cl/search?q=chinamart'} className="btn btn--hero-cta btn--lg" target="_blank" rel="noopener noreferrer">{heroSettings.buttonText || 'Compra Ahora'} <span className="material-icons">shopping_cart</span></a>
                <a href="#contacto" className="btn btn--outline-light btn--lg" onClick={e => { e.preventDefault(); scrollToId('#contacto'); }}>¡Contáctanos!</a>
              </div>
              <p className="hero__lider">¡Encuéntranos en Mundo Líder buscando <strong>&quot;chinamart&quot;</strong>!</p>
            </div>
            <div className="hero__scroll"><span className="material-icons">expand_more</span></div>
          </section>
        );
      case 'cm_services':
        return (
          <section className="highlights" id="servicios" key="cm_services" data-section-id="cm_services">
            <div className="container">
              <div className="section-header section-header--center">
                <span className="kicker">Lo que hacemos</span>
                <h2 className="section-title">Nuestros <span className="text-red">Servicios</span></h2>
              </div>
              <div className="highlights__grid">
                {SERVICES.map((s, i) => (
                  <div className="hl-card" key={i}>
                    <img src={s.img} alt={s.title} className="hl-card__img" loading="lazy" />
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'cm_about':
        return (
          <section className="history" id="nosotros" key="cm_about" data-section-id="cm_about">
            <div className="container history__grid">
              <div className="history__content">
                <span className="kicker">Sobre nosotros</span>
                <h2 className="section-title">Tu conexión con <span className="text-red">sabores de Asia</span></h2>
                <p>Chinamart nació con la misión de traer los auténticos sabores de Asia a Chile. Somos importadores y distribuidores especializados en productos alimenticios asiáticos de alta calidad.</p>
                <p>Como representantes exclusivos de Kang Shi Fu (Master Kong), garantizamos productos originales y frescos. Atendemos tanto a clientes finales como a restaurantes, supermercados y negocios de comida.</p>
                <div className="history__signature">
                  <img src={LOGO_URL} alt="Chinamart Logo" loading="lazy" width={200} height={200} />
                  <div><strong>Chinamart Ltda.</strong><span>Importador &amp; Distribuidor</span></div>
                </div>
              </div>
              <div className="history__img">
                <img src={ABOUT_IMG} alt="Instalaciones Chinamart" loading="lazy" width={600} height={700} />
              </div>
            </div>
          </section>
        );
      case 'cm_products':
        return (
          <section className="productos" id="marcas" key="cm_products" data-section-id="cm_products">
            <div className="container">
              <div className="section-header section-header--center">
                <span className="kicker">Disponibles en Líder</span>
                <h2 className="section-title">Nuestros <span className="text-red">productos</span></h2>
                <p className="section-lead">Encuentra los productos Kang Shi Fu de Chinamart en Mundo Líder. Fideos instantáneos y bebidas originales directamente importados.</p>
              </div>
              <div className="productos__grid">
                {PRODUCTS.map((p, i) => (
                  <a className="prod-card" href={p.link} target="_blank" rel="noopener noreferrer" key={i}>
                    <div className="prod-card__img-wrap"><img src={p.img} alt={p.name} loading="lazy" width={400} height={400} /></div>
                    <div className="prod-card__info">
                      <span className="prod-card__brand">{p.brand}</span>
                      <h3 className="prod-card__name">{p.name}</h3>
                      <span className="prod-card__cta">Ver en Líder <span className="material-icons">open_in_new</span></span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="productos__footer">
                <a href="https://www.lider.cl/search?q=chinamart" target="_blank" rel="noopener noreferrer" className="btn btn--red btn--lg">
                  <span className="material-icons">storefront</span> Ver más en Líder.cl
                </a>
              </div>
            </div>
          </section>
        );
      case 'cm_testimonials':
        return (
          <section className="testimonials" id="testimonios" key="cm_testimonials" data-section-id="cm_testimonials">
            <div className="container">
              <div className="section-header section-header--center">
                <span className="kicker">Opiniones</span>
                <h2 className="section-title">Lo que dicen nuestros <span className="text-red">clientes</span></h2>
              </div>
              <div className="testi-grid">
                {TESTIMONIALS.map((t, i) => (
                  <div className={`testi-card${t.orange ? ' testi-card--orange' : ''}`} key={i}>
                    <div className="testi-card__quote-icon">&ldquo;</div>
                    <div className="testi-card__stars">★★★★★</div>
                    <blockquote className="testi-card__text">{t.text}</blockquote>
                    <div className="testi-card__author">
                      <div className="testi-card__avatar">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}&backgroundColor=F97316&textColor=ffffff`} alt={t.name} />
                      </div>
                      <div className="testi-card__meta">
                        <strong style={t.orange ? { color: '#ffffff' } : undefined}>{t.name}</strong>
                        <span style={t.orange ? { color: '#ffffff' } : undefined}>{t.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'cm_contact':
        return (
          <section className="reservations" id="contacto" key="cm_contact" data-section-id="cm_contact">
            <div className="container">
              <div className="section-header section-header--center">
                <span className="kicker">Escríbenos</span>
                <h2 className="section-title">¿Necesitas <span className="text-red">productos asiáticos</span>?</h2>
                <p className="section-lead">Si tienes alguna consulta o necesitas información adicional sobre nuestros productos, no dudes en ponerte en contacto con nosotros. ¡Estamos aquí para ayudarte!</p>
              </div>
              <div className="reservations__grid">
                <div className="reservations__info">
                  <div className="reservations__details">
                    <div>
                      <span className="material-icons">location_on</span>
                      <div><strong>Dirección</strong><p>Gorbea 2727, Santiago · Chile</p></div>
                    </div>
                    <div>
                      <span className="material-icons">phone</span>
                      <div><strong>WhatsApp</strong><p><a href="https://wa.me/56962293893">+56 9 6229 3893</a></p></div>
                    </div>
                    <div>
                      <span className="material-icons">email</span>
                      <div><strong>Correo Electrónico</strong><p><a href="mailto:chinamart.santiago@gmail.com">chinamart.santiago@gmail.com</a></p></div>
                    </div>
                    <div>
                      <span className="material-icons">schedule</span>
                      <div>
                        <strong>Horario Verano</strong>
                        <p>Lunes a Sábado: 9:30 – 20:00<br />Domingo: 10:00 – 20:00<br />Festivos abiertos, excepto Año Nuevo.</p>
                      </div>
                    </div>
                  </div>
                  <div className="contact__lider">
                    <div className="contact__lider-icon"><img src={LIDER_IMG} alt="Lider" loading="lazy" /></div>
                    <div className="contact__lider-text">
                      <span className="lider-badge">Exclusivo Online</span>
                      <p>Disponible en <strong>Mundo Líder</strong>. Busca la marca <span className="text-orange">&quot;Chinamart&quot;</span> para entrega inmediata.</p>
                    </div>
                  </div>
                </div>
                <form className="reservations__form" id="contactForm" onSubmit={handleContactSubmit}>
                  <h3>Envíanos un mensaje</h3>
                  <div className="form-row">
                    <div className="form-group"><label htmlFor="cm-name">Nombre *</label><input type="text" id="cm-name" name="name" placeholder="Tu nombre" autoComplete="name" required /></div>
                    <div className="form-group"><label htmlFor="cm-phone">Teléfono *</label><input type="tel" id="cm-phone" name="phone" placeholder="+56 9 0000 0000" autoComplete="tel" required /></div>
                  </div>
                  <div className="form-group"><label htmlFor="cm-email">Email</label><input type="email" id="cm-email" name="email" placeholder="tu@email.com" autoComplete="email" /></div>
                  <div className="form-group"><label htmlFor="cm-msg">Mensaje *</label><textarea id="cm-msg" name="message" rows={4} placeholder="¿Qué productos necesitas? ¿Mayorista o minorista?" required /></div>
                  <button type="submit" className="btn btn--red btn--block btn--lg"><span className="material-icons">send</span> Enviar mensaje</button>
                </form>
              </div>
            </div>
          </section>
        );
      case 'cm_banner_image': {
        const bS = sectionCfg.find(c => c.id === 'cm_banner_image')?.settings || {};
        return (
          <section className="cm-section cm-banner-image" key="cm_banner_image" data-section-id="cm_banner_image" style={{ padding: '60px 0', background: bS.bgColor || '#f3f4f6', textAlign: 'center' as const }}>
            <div className="container">
              {bS.imageUrl ? <img src={bS.imageUrl} alt={bS.title || 'Banner'} style={{ maxWidth: '100%', borderRadius: 16 }} /> : <div style={{ height: 200, background: '#e5e7eb', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 18 }}>Imagen del banner</div>}
              {bS.title && <h2 style={{ marginTop: 24, fontSize: 28, fontWeight: 700, color: bS.textColor || '#111' }}>{bS.title}</h2>}
            </div>
          </section>
        );
      }
      case 'cm_video': {
        const vS = sectionCfg.find(c => c.id === 'cm_video')?.settings || {};
        return (
          <section className="cm-section cm-video" key="cm_video" data-section-id="cm_video" style={{ padding: '80px 0', background: '#000' }}>
            <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
              {vS.buttonLink ? <iframe src={vS.buttonLink} style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: 16 }} allow="autoplay; encrypted-media" allowFullScreen /> : <div style={{ aspectRatio: '16/9', background: '#1f2937', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>URL de video no configurada</div>}
            </div>
          </section>
        );
      }
      case 'cm_newsletter': {
        const nS = sectionCfg.find(c => c.id === 'cm_newsletter')?.settings || {};
        return (
          <section className="cm-section cm-newsletter" key="cm_newsletter" data-section-id="cm_newsletter" style={{ padding: '80px 0', background: nS.bgColor || '#F97316', textAlign: 'center' as const }}>
            <div className="container" style={{ maxWidth: 600, margin: '0 auto' }}>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{nS.title || 'Suscríbete a nuestro newsletter'}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>{nS.subtitle || 'Recibe ofertas exclusivas y novedades'}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="email" placeholder="tu@email.com" style={{ flex: 1, padding: '14px 20px', borderRadius: 12, border: 'none', fontSize: 16 }} />
                <button style={{ padding: '14px 28px', borderRadius: 12, background: '#111', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{nS.buttonText || 'Suscribirse'}</button>
              </div>
            </div>
          </section>
        );
      }
      case 'cm_faq': {
        return (
          <section className="cm-section cm-faq" key="cm_faq" data-section-id="cm_faq" style={{ padding: '80px 0', background: '#fff' }}>
            <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
              <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 40, color: '#111' }}>Preguntas Frecuentes</h2>
              {['¿Hacen envíos a regiones?', '¿Cuál es el monto mínimo de compra?', '¿Venden al por mayor?'].map((q, i) => (
                <details key={i} style={{ borderBottom: '1px solid #e5e7eb', padding: '20px 0' }}>
                  <summary style={{ fontWeight: 600, fontSize: 16, cursor: 'pointer', color: '#374151' }}>{q}</summary>
                  <p style={{ marginTop: 12, color: '#6b7280', lineHeight: 1.6 }}>Respuesta de ejemplo. Edita esta sección para personalizar las preguntas y respuestas.</p>
                </details>
              ))}
            </div>
          </section>
        );
      }
      case 'cm_map': {
        const mS = sectionCfg.find(c => c.id === 'cm_map')?.settings || {};
        return (
          <section className="cm-section cm-map" key="cm_map" data-section-id="cm_map" style={{ padding: '0' }}>
            <iframe src={mS.buttonLink || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.3!2d-70.6!3d-33.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI0JzAuMCJT!5e0!3m2!1ses!2scl!4v1'} style={{ width: '100%', height: 400, border: 'none' }} allowFullScreen loading="lazy" />
          </section>
        );
      }
      case 'cm_rich_text': {
        const rS = sectionCfg.find(c => c.id === 'cm_rich_text')?.settings || {};
        return (
          <section className="cm-section cm-rich-text" key="cm_rich_text" data-section-id="cm_rich_text" style={{ padding: '60px 0', background: rS.bgColor || '#fff' }}>
            <div className="container" style={{ maxWidth: 800, margin: '0 auto', color: rS.textColor || '#374151', fontSize: 16, lineHeight: 1.8 }}>
              <p>{rS.description || 'Bloque de texto enriquecido. Agrega aquí contenido libre como políticas, información adicional o cualquier texto que necesites.'}</p>
            </div>
          </section>
        );
      }
      case 'cm_countdown': {
        const cS = sectionCfg.find(c => c.id === 'cm_countdown')?.settings || {};
        return (
          <section className="cm-section cm-countdown" key="cm_countdown" data-section-id="cm_countdown" style={{ padding: '80px 0', background: cS.bgColor || '#ef4444', textAlign: 'center' as const }}>
            <div className="container">
              <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 24 }}>{cS.title || '¡Oferta por tiempo limitado!'}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
                {['Días', 'Hrs', 'Min', 'Seg'].map((l, i) => (
                  <div key={i} style={{ width: 80, padding: '16px 0', background: 'rgba(0,0,0,0.2)', borderRadius: 12, color: '#fff' }}>
                    <div style={{ fontSize: 32, fontWeight: 800 }}>{[3, 12, 45, 30][i]}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{l}</div>
                  </div>
                ))}
              </div>
              {cS.buttonText && <a href={cS.buttonLink || '#'} style={{ display: 'inline-block', padding: '14px 36px', background: '#fff', color: '#ef4444', borderRadius: 12, fontWeight: 700, fontSize: 16 }}>{cS.buttonText}</a>}
            </div>
          </section>
        );
      }
      case 'cm_logo_list': {
        return (
          <section className="cm-section cm-logo-list" key="cm_logo_list" data-section-id="cm_logo_list" style={{ padding: '60px 0', background: '#f9fafb' }}>
            <div className="container" style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#374151', marginBottom: 32 }}>Nuestras Marcas</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap', opacity: 0.5 }}>
                {[1,2,3,4,5].map(i => <div key={i} style={{ width: 100, height: 50, background: '#d1d5db', borderRadius: 8 }} />)}
              </div>
            </div>
          </section>
        );
      }
      case 'cm_gallery': {
        return (
          <section className="cm-section cm-gallery" key="cm_gallery" data-section-id="cm_gallery" style={{ padding: '80px 0', background: '#fff' }}>
            <div className="container">
              <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111', textAlign: 'center', marginBottom: 40 }}>Galería</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[1,2,3,4,5,6].map(i => <div key={i} style={{ aspectRatio: '4/3', background: '#e5e7eb', borderRadius: 12 }} />)}
              </div>
            </div>
          </section>
        );
      }
      case 'cm_stats': {
        return (
          <section className="cm-section cm-stats" key="cm_stats" data-section-id="cm_stats" style={{ padding: '80px 0', background: '#111827' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 60, textAlign: 'center', flexWrap: 'wrap' }}>
              {[['500+', 'Productos'], ['10K+', 'Clientes'], ['50+', 'Marcas'], ['5', 'Años']].map(([n, l], i) => (
                <div key={i}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: '#F97316' }}>{n}</div>
                  <div style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </section>
        );
      }
      case 'cm_cta': {
        const ctaS = sectionCfg.find(c => c.id === 'cm_cta')?.settings || {};
        return (
          <section className="cm-section cm-cta" key="cm_cta" data-section-id="cm_cta" style={{ padding: '80px 0', background: ctaS.bgColor || '#F97316', textAlign: 'center' as const }}>
            <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 16 }}>{ctaS.title || '¿Listo para empezar?'}</h2>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 32 }}>{ctaS.subtitle || 'Contáctanos hoy y descubre nuestras ofertas.'}</p>
              <a href={ctaS.buttonLink || '#contacto'} style={{ display: 'inline-block', padding: '16px 40px', background: '#fff', color: '#F97316', borderRadius: 12, fontWeight: 700, fontSize: 18 }}>{ctaS.buttonText || 'Contáctanos'}</a>
            </div>
          </section>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="cm-root" ref={rootRef}>

      {/* ══ NAVBAR ══ */}
      {sec('cm_navbar') && (
        <header
          className={`navbar${scrolled ? ' scrolled' : ''}${navSettings.cmNavLogoPosition === 'center' ? ' navbar--centered' : ''}`}
          id="navbar"
          data-section-id="cm_navbar"
          style={{
            '--cm-nav-link-color': navSettings.cmNavLinkColor || '#ffffff',
            '--cm-nav-link-active': navSettings.cmNavLinkActiveColor || '#F97316',
            '--cm-nav-scrolled-link-color': navSettings.cmNavScrolledLinkColor || '#374151',
            '--cm-nav-scrolled-bg': navSettings.cmNavScrolledBg || 'rgba(255,255,255,0.95)',
            '--cm-nav-scrolled-radius': `${navSettings.cmNavScrolledRadius ?? 16}px`,
            '--cm-nav-logo-height': `${navSettings.cmNavLogoHeight ?? 110}px`,
            '--cm-nav-scrolled-logo-height': `${navSettings.cmNavScrolledLogoHeight ?? 60}px`,
            '--cm-nav-font-size': `${navSettings.cmNavFontSize ?? 14}px`,
            '--cm-nav-btn-bg': navSettings.cmNavBtnBg || '#F97316',
            '--cm-nav-btn-radius': `${navSettings.cmNavBtnRadius ?? 8}px`,
            '--cm-nav-border-color': navSettings.cmNavBorderColor || 'transparent',
          } as React.CSSProperties}
        >
          <div className="container navbar__inner">
            <a className="navbar__brand" href="#inicio" onClick={e => { e.preventDefault(); scrollToId('#inicio'); }}>
              <img src={navLogo} alt="Chinamart" className="navbar__logo-img" />
            </a>
            <nav className={`navbar__menu${menuOpen ? ' open' : ''}`} id="navMenu">
              <ul className="navbar__list">
                {[['#inicio','Inicio'],['#nosotros','Nosotros'],['#marcas','Marcas'],['#testimonios','Reseñas'],['#contacto','Contacto']].map(([href, label]) => (
                  <li key={href}><a href={href} className={`navbar__link${activeSection === href ? ' active' : ''}`} onClick={e => { e.preventDefault(); scrollToId(href); }}>{label}</a></li>
                ))}
              </ul>
            </nav>
            <div className="navbar__actions">
              {navSettings.cmNavShowSearch && (
                <button className="navbar__search-btn" aria-label="Buscar" onClick={() => {}}>
                  <span className="material-icons" style={{ fontSize: 20 }}>search</span>
                </button>
              )}
              <a
                href={navSettings.cmNavBtnLink || 'https://wa.me/56962293893'}
                className="btn btn--cta btn--sm"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'var(--cm-nav-btn-bg)', borderRadius: 'var(--cm-nav-btn-radius)' }}
              >
                {WA_SVG} {navSettings.cmNavBtnText || 'WhatsApp'}
              </a>
              <button className={`navbar__burger${menuOpen ? ' active' : ''}`} aria-label="Menú" onClick={() => setMenuOpen(p => !p)}>
                <span /><span />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ══ DYNAMIC MIDDLE SECTIONS (reorderable via /admin/sections-custom) ══ */}
      {cmMiddle.map(s => renderSection(s.id))}

      {/* ══ FOOTER ══ */}
      {sec('cm_footer') && (
        <footer
          className="footer"
          data-section-id="cm_footer"
          style={{
            '--cm-footer-bg': footerSettings.cmFooterBg || '#111827',
            '--cm-footer-text': footerSettings.cmFooterTextColor || '#d1d5db',
            '--cm-footer-accent': footerSettings.cmFooterAccentColor || '#F97316',
            '--cm-footer-logo-height': `${footerSettings.cmFooterLogoHeight ?? 50}px`,
            '--cm-footer-border-top': footerSettings.cmFooterBorderTop ? `1px solid ${footerSettings.cmFooterBorderColor || '#e5e7eb'}` : 'none',
          } as React.CSSProperties}
        >
          <div className="container footer__inner">
            <div className="footer__brand">
              <a href="#inicio" className="footer__logo" onClick={e => { e.preventDefault(); scrollToId('#inicio'); }}>
                <img src={LOGO_URL} alt="Chinamart" className="footer__logo-img" />
              </a>
              <p className="footer__brand-p">Importación y distribución de alimentos asiáticos en Chile. Somos el puente directo hacia la autenticidad de Oriente.</p>
              <div className="footer__socials">
                <a href="#" className="social-btn" aria-label="Instagram"><i className="material-icons">camera_alt</i></a>
                <a href="#" className="social-btn" aria-label="TikTok"><i className="material-icons">music_note</i></a>
                <a href="#" className="social-btn" aria-label="Facebook"><i className="material-icons">facebook</i></a>
                <a href="https://wa.me/56962293893" className="social-btn social-btn--whatsapp" aria-label="WhatsApp"><i className="material-icons">chat</i></a>
              </div>
            </div>
            <div className="footer__links">
              <h5>Explora</h5>
              <a href="#inicio" onClick={e => { e.preventDefault(); scrollToId('#inicio'); }}>Inicio</a>
              <a href="#nosotros" onClick={e => { e.preventDefault(); scrollToId('#nosotros'); }}>Nosotros</a>
              <a href="#marcas" onClick={e => { e.preventDefault(); scrollToId('#marcas'); }}>Nuestras Marcas</a>
              <a href="#testimonios" onClick={e => { e.preventDefault(); scrollToId('#testimonios'); }}>Reseñas Clientes</a>
              <a href="#servicios" onClick={e => { e.preventDefault(); scrollToId('#servicios'); }}>Servicios</a>
            </div>
            <div className="footer__links">
              <h5>Atención</h5>
              <a href="https://wa.me/56962293893" className="footer__contact-item"><i className="material-icons">phone_iphone</i> +56 9 6229 3893</a>
              <a href="#" className="footer__contact-item"><i className="material-icons">location_on</i> Gorbea 2727, Santiago</a>
              <a href="mailto:chinamart.santiago@gmail.com" className="footer__contact-item"><i className="material-icons">alternate_email</i> chinamart.santiago</a>
              <a href="https://www.lider.cl/search?q=chinamart" target="_blank" rel="noopener noreferrer" className="footer__contact-item"><i className="material-icons">shopping_bag</i> Tienda en Líder.cl</a>
            </div>
            <div className="footer__map">
              <iframe src={MAP_EMBED} width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa Chinamart" />
            </div>
          </div>
          <div className="container footer__bottom">
            <span className="footer__copyright">© 2026 Chinamart Chile. Todos los derechos reservados.</span>
            <div className="footer__legal">
              <a href="https://www.lider.cl/search?q=chinamart" target="_blank" rel="noopener noreferrer" className="footer__legal-link">Tienda en Líder.cl</a>
              <a href="#" className="footer__legal-link">Aviso Legal</a>
              <a href="#" className="footer__legal-link">Privacidad</a>
            </div>
          </div>
        </footer>
      )}

      {/* ══ BACK TO TOP ══ */}
      <button
        className={`back-to-top${backToTopVisible ? ' visible' : ''}`}
        onClick={handleBackToTop}
        aria-label="Volver arriba"
        style={{ opacity: backToTopVisible ? 1 : 0, pointerEvents: backToTopVisible ? 'auto' : 'none' }}
      >
        <span className="material-icons">keyboard_arrow_up</span>
      </button>

    </div>
  );
}
