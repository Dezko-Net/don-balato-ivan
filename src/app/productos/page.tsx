import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getCachedAllProducts } from '@/lib/catalog-cache';

const ProductosClient = dynamic(() => import('./ProductosClient'));

const BASE = 'https://www.donbalatoivan.cl';

export const metadata: Metadata = {
  title: 'Catalogo de Productos | Cosmetica, Maquillaje y Skincare',
  description:
    'Explora nuestro catalogo completo de cosmetica, maquillaje y skincare en Chile. Compra al detalle o por mayor con precios por volumen. Envios a todo Chile.',
  alternates: { canonical: `${BASE}/productos` },
  openGraph: {
    title: 'Catalogo de Productos | Don Balato Ivan',
    description:
      'Explora nuestro catalogo completo de cosmetica, maquillaje y skincare en Chile. Compra al detalle o por mayor con precios por volumen.',
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
    // Si no hay catalogo, igual mostramos la pagina
  }

  return (
    <>
      {/* Contenido estatico para SEO - visible para crawlers y usuarios sin JS */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden' }}>
        <h1>Catalogo de Productos de Cosmetica y Belleza - Don Balato Ivan</h1>
        <p>
          Tienda online de cosmetica, maquillaje y skincare en Chile. Compra al detalle o por mayor
          con precios por volumen: mientras mas llevas, menos pagas. Envios a todo Chile.
        </p>
        <ul>
          {products.map(p => (
            <li key={p.$id}>
              <a href={`${BASE}/productos/${p.$id}`}>{p.NAME}</a>
              {p.BRAND && ` - ${p.BRAND}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Componente interactivo del lado del cliente */}
      <ProductosClient />
    </>
  );
}

