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
      <DynamicCollectionAll initialBrand={brandName} />
    </main>
  );
}
