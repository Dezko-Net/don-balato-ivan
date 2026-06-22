'use client';
import { useTemplate } from '@/context/TemplateContext';
import CollectionPage5 from '@/templates/plantilla5/CollectionPage';
import CollectionPage100 from '@/templates/plantilla100/CollectionPage';

export default function DynamicCollectionPage({ children }: { children: React.ReactNode }) {
  const { isLoading, getSectionTemplate } = useTemplate();
  
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  const template = getSectionTemplate('collections');
  
  if (template === 100) return <CollectionPage100 />;
  if (template === 5) return <CollectionPage5 />;
  
  // Por defecto, renderiza el children (que es la vista original de /productos)
  return <>{children}</>;
}
