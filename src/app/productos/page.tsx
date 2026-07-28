import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getCachedAllProducts } from '@/lib/catalog-cache';

const ProductosClient = dynamic(() => import('./ProductosClient'));

const BASE = 'https://www.donbalatoivan.cl';

export const metadata: Metadata = {
  title: 'CatÃ¡logo de Productos | CosmÃ©tica, Maquillaje y Skincare',
  description:
    'Explora nuestro catÃ¡logo completo de cosmÃ©tica, maquillaje y skincare en Chile. Compra al detalle o por mayor con precios por volumen. EnvÃ­os a todo Chile.',
  alternates: { canonical: `${BASE}/productos` },
  openGraph: {
    title: 'CatÃ¡logo de Productos | Don Balato IvÃ¡n',
    description:
      'Explora nuestro catÃ¡logo completo de cosmÃ©tica, maquillaje y skincare en Chile. Compra al detalle o por mayor con precios por volumen.',
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
    // Si no hay catÃ¡logo, igual mostramos la pÃ¡gina
  }

  return (
    <>
      {/* Contenido estÃ¡tico para SEO - visible para crawlers y usuarios sin JS */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden' }}>
        <h1>CatÃ¡logo de Productos de CosmÃ©tica y Belleza - Don Balato Iván</h1>
        <p>
          Tienda online de cosmÃ©tica, maquillaje y skincare en Chile. Compra al detalle o por mayor
          con precios por volumen: mientras mÃ¡s llevas, menos pagas. EnvÃ­os a todo Chile.
        </p>
        <ul>
          {products.map(p => (
            <li key={p.$id}>
              <a href={`${BASE}/productos/${p.$id}`}>{p.NAME}</a>
              {p.BRAND && ` â€” ${p.BRAND}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Componente interactivo del lado del cliente */}
      <ProductosClient />
    </>
  );
}

