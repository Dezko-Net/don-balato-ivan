import DynamicCollectionAll from '@/components/DynamicCollectionAll';

export default async function MarcaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let brandName = '';
  switch (slug) {
    case 'kevin-coco':
      brandName = 'Kevin & Coco';
      break;
    case '3q-beauty':
      brandName = '3Q Beauty';
      break;
    case 'sadoer':
      brandName = 'SADOER';
      break;
    case 'billion-beauty':
      brandName = 'Billion Beauty';
      break;
    default:
      // If we don't know the slug, we can pass it as is, or fallback.
      brandName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  return (
    <main>
      <div className="bg-gray-50 py-8 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marca: {brandName}</h1>
          <p className="text-gray-600">Explora todos los productos, colecciones y categorías de {brandName}.</p>
        </div>
      </div>
      <DynamicCollectionAll initialBrand={brandName} />
    </main>
  );
}
