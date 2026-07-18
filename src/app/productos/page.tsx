import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getCachedAllProducts } from '@/lib/catalog-cache';

const ProductosClient = dynamic(() => import('./ProductosClient'));

const BASE = 'https://www.kevincocochile.cl';

export const metadata: Metadata = {
  title: 'Catálogo de Productos | Cosmética, Maquillaje y Skincare',
  description:
    'Explora nuestro catálogo completo de cosmética, maquillaje y skincare en Chile. Compra al detalle o por mayor con precios por volumen. Envíos a todo Chile.',
  alternates: { canonical: `${BASE}/productos` },
  openGraph: {
    title: 'Catálogo de Productos | Kevin & Coco',
    description:
      'Explora nuestro catálogo completo de cosmética, maquillaje y skincare en Chile. Compra al detalle o por mayor con precios por volumen.',
    url: `${BASE}/productos`,
    type: 'website',
  },
};

export default async function ProductosPage() {
  let products: any[] = [];
  try {
    const all = (await getCachedAllProducts()) as any[];
    products = all.filter(p => p.STOCK == null || p.STOCK > 0).slice(0, 24);
  } catch {
    // Si no hay catálogo, igual mostramos la página
  }

  return (
    <>
      {/* Contenido estático para SEO - visible para crawlers y usuarios sin JS */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden' }}>
        <h1>Catálogo de Productos de Cosmética y Belleza - Kevin & Coco</h1>
        <p>
          Tienda online de cosmética, maquillaje y skincare en Chile. Compra al detalle o por mayor
          con precios por volumen: mientras más llevas, menos pagas. Envíos a todo Chile.
        </p>
        <ul>
          {products.map(p => (
            <li key={p.$id}>
              <a href={`${BASE}/productos/${p.$id}`}>{p.NAME}</a>
              {p.BRAND && ` — ${p.BRAND}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Componente interactivo del lado del cliente */}
      <ProductosClient />
    </>
  );
}
