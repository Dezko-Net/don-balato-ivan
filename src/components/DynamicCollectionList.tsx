'use client';
import { useTemplate } from '@/context/TemplateContext';
import CollectionList5 from '@/templates/plantilla5/CollectionList';
import CollectionList1 from '@/templates/plantilla1/CollectionList';
import CollectionList100 from '@/templates/plantilla100/CollectionList';

export default function DynamicCollectionList() {
  const { isLoading, getSectionTemplate } = useTemplate();
  
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  // Use collections key for categories page
  const template = getSectionTemplate('collections');
  
  if (template === 100) return <CollectionList100 />;
  if (template === 5) return <CollectionList5 />;
  
  // Default to plantilla 1
  return <CollectionList1 />;
}
