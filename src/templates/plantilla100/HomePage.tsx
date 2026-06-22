'use client';

import { useEffect, useRef, useState } from 'react';

type Template100Manifest = {
  bodyClassName: string;
  htmlDataTemplate: string;
  css: string[];
  js: string[];
};

export default function HomePage100() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [manifest, setManifest] = useState<Template100Manifest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;

    Promise.all([
      fetch('/shopify/plantilla100/body-clean.html', { cache: 'no-cache' }).then((response) => {
        if (!response.ok) throw new Error(`HTML ${response.status}`);
        return response.text();
      }),
      fetch('/shopify/plantilla100/manifest.json', { cache: 'no-cache' }).then((response) => {
        if (!response.ok) throw new Error(`Manifest ${response.status}`);
        return response.json();
      }),
    ])
      .then(([html, manifestJson]) => {
        if (aborted) return;
        setBodyHtml(html);
        setManifest(manifestJson);
      })
      .catch((error) => {
        if (aborted) return;
        console.error('[Plantilla100] Error loading assets', error);
        setLoadError(error.message || 'Error cargando plantilla100');
      });

    return () => {
      aborted = true;
    };
  }, []);

  useEffect(() => {
    if (!manifest) return;

    const previousTemplate = document.documentElement.dataset.template;
    document.documentElement.dataset.template = manifest.htmlDataTemplate;

    const bodyClasses = manifest.bodyClassName.split(/\s+/).filter(Boolean);
    bodyClasses.forEach((className) => document.body.classList.add(className));
    document.body.classList.remove('page-loading');

    manifest.css.forEach((href) => {
      if (document.querySelector(`link[data-tpl100="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl100', href);
      document.head.appendChild(link);
    });

    return () => {
      if (previousTemplate) document.documentElement.dataset.template = previousTemplate;
      else delete document.documentElement.dataset.template;

      bodyClasses.forEach((className) => document.body.classList.remove(className));
    };
  }, [manifest]);

  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    if (containerRef.current.dataset.htmlSet === '1') return;

    containerRef.current.innerHTML = bodyHtml;
    containerRef.current.dataset.htmlSet = '1';

    containerRef.current.querySelectorAll('script').forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attribute) => {
        newScript.setAttribute(attribute.name, attribute.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });
  }, [bodyHtml]);

  useEffect(() => {
    if (!manifest || !bodyHtml) return;

    const globalWindow = window as typeof window & { Shopify?: unknown; __tpl100ScriptsLoaded?: boolean };
    if (!globalWindow.Shopify) {
      globalWindow.Shopify = {
        shop: 'kxym3z-mf.myshopify.com',
        country: 'CL',
        currency: 'USD',
        locale: 'es',
        theme: { name: 'Development (209814-Yraser)', id: '157105258596' },
        routes: { root_url: '/', cart_url: '/carrito', search_url: '/productos' },
        customerAccountsEnabled: false,
      };
    }

    if (globalWindow.__tpl100ScriptsLoaded) return;
    globalWindow.__tpl100ScriptsLoaded = true;

    const loadOne = (src: string) =>
      new Promise<void>((resolve) => {
        if (document.querySelector(`script[data-tpl100="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        if (src.includes('localization-form.js')) {
          script.type = 'module';
        }
        script.setAttribute('data-tpl100', src);
        script.onload = () => resolve();
        script.onerror = () => {
          console.warn('[Plantilla100] Failed to load:', src);
          resolve();
        };
        document.body.appendChild(script);
      });

    const activateAnimations = () => {
      document.querySelectorAll('.animation-element, .animation-wrapper').forEach((element) => {
        element.classList.add('in-view');
      });

      document.querySelectorAll('video').forEach((element) => {
        const video = element as HTMLVideoElement;
        if (video.autoplay) {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
    };

    (async () => {
      for (const src of manifest.js) {
        await loadOne(src);
      }

      setTimeout(() => {
        activateAnimations();
        try {
          document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
          window.dispatchEvent(new Event('load'));
        } catch (error) {
          console.warn('[Plantilla100] DOM events dispatch failed', error);
        }
      }, 400);
    })();

    return () => {
      globalWindow.__tpl100ScriptsLoaded = false;
    };
  }, [manifest, bodyHtml]);

  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar la home real de `plantilla100`.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml || !manifest) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#111827', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <div ref={containerRef} data-template-home="100" />;
}
