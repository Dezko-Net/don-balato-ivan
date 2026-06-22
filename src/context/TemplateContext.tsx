'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SectionTemplates {
  landing: number;
  collections: number;
  catalog: number;
  productDetail: number;
  cart: number;
  checkout: number;
}

interface TemplateContextType {
  template: number;
  isLoading: boolean;
  sections: SectionTemplates;
  getSectionTemplate: (section: keyof SectionTemplates) => number;
}

const DEFAULT_SECTIONS: SectionTemplates = { landing: 1, collections: 1, catalog: 1, productDetail: 5, cart: 1, checkout: 1 };

const TemplateContext = createContext<TemplateContextType>({
  template: 1,
  isLoading: true,
  sections: DEFAULT_SECTIONS,
  getSectionTemplate: () => 1,
});

export function useTemplate() {
  return useContext(TemplateContext);
}

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [template, setTemplate] = useState(23);
  const [sections, setSections] = useState<SectionTemplates>({ landing: 23, collections: 23, catalog: 23, productDetail: 5, cart: 23, checkout: 23 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let dbGlobal = 23;
      let dbSections = { landing: 23, collections: 23, catalog: 23, productDetail: 5, cart: 23, checkout: 23 };

      try {
        const res = await fetch(`/api/template`);
        if (res.ok) {
          const data = await res.json();
          dbGlobal = Number(data.template) || 23;
          if (data.sections) {
            dbSections = {
              landing: Number(data.sections.landing) || dbGlobal,
              collections: Number(data.sections.collections) || dbGlobal,
              catalog: Number(data.sections.catalog) || dbGlobal,
              productDetail: Number(data.sections.productDetail) || dbGlobal,
              cart: Number(data.sections.cart) || dbGlobal,
              checkout: Number(data.sections.checkout) || dbGlobal,
            };
          } else {
            dbSections = { landing: dbGlobal, collections: dbGlobal, catalog: dbGlobal, productDetail: dbGlobal, cart: dbGlobal, checkout: dbGlobal };
          }
        }
      } catch (err) {
        console.error('[TemplateContext] failed to load template from API:', err);
      }

      // 2. Check for _tpl override or pathname match to apply target section override
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tplOverride = params.get('_tpl');
        const pathnameMatch = window.location.pathname.match(/\/preview\/plantilla\/(\d+)/);

        if (tplOverride) {
          const t = Number(tplOverride) || 1;
          const section = params.get('section') as keyof SectionTemplates | null;
          if (section && dbSections[section] !== undefined) {
            dbSections[section] = t;
          } else {
            // Apply globally if no specific section is provided
            dbSections = { landing: t, collections: t, catalog: t, productDetail: t, cart: t, checkout: t };
          }
          dbGlobal = t;
        } else if (pathnameMatch && pathnameMatch[1]) {
          const t = Number(pathnameMatch[1]);
          const path = window.location.pathname;
          // Check if current route is a preview page for a specific section
          const isCart = path.includes('/carrito');
          const isCheckout = path.includes('/checkout');
          const isProductDetail = path.includes('/producto/') || path.includes('/productos/');
          const isCatalog = path.includes('/collections/all');
          const isCollections = path.includes('/collections');

          if (isCart) {
            dbSections.cart = t;
          } else if (isCheckout) {
            dbSections.checkout = t;
          } else if (isProductDetail) {
            dbSections.productDetail = t;
          } else if (isCatalog) {
            dbSections.catalog = t;
          } else if (isCollections) {
            dbSections.collections = t;
          } else {
            dbSections.landing = t;
          }
          dbGlobal = t;
        }
      }

      setTemplate(dbGlobal);
      setSections(dbSections);
      setIsLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    
    let activeTemplate = template; // default to global
    
    const isProductDetail = path.includes('/producto/') || path.includes('/productos/');
    const isCatalog = path.includes('/collections/all') || path === '/productos' || path === '/catalogo';
    const isCollections = path.includes('/collections');
    const isCart = path === '/carrito';
    const isCheckout = path === '/checkout';

    if (isProductDetail) {
      activeTemplate = sections.productDetail;
    } else if (isCatalog) {
      activeTemplate = sections.catalog;
    } else if (isCollections) {
      activeTemplate = sections.collections;
    } else if (isCart) {
      activeTemplate = sections.cart;
    } else if (isCheckout) {
      activeTemplate = sections.checkout;
    } else if (path === '/' || path === '') {
      activeTemplate = sections.landing;
    }

    const bgMap: Record<number, string> = {
      1: '#f8f9fa',
      2: '#ebebeb',
      3: '#f5f5f5',
      4: '#ffffff',
      5: '#fdfbf7',
      100: '#ffffff',
      101: '#ffffff',
    };
    document.body.style.backgroundColor = bgMap[activeTemplate] || '#f8f9fa';
    document.body.style.color = activeTemplate === 2 ? '#333333' : activeTemplate === 4 ? '#1F1F1F' : activeTemplate === 5 ? '#2a2120' : '#111827';
  }, [template, sections]);

  const getSectionTemplate = (section: keyof SectionTemplates): number => {
    return sections[section] || template;
  };

  return (
    <TemplateContext.Provider value={{ template, isLoading, sections, getSectionTemplate }}>
      <div data-template={template} className="contents">
        {children}
      </div>
    </TemplateContext.Provider>
  );
}
