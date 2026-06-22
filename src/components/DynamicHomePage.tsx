'use client';
import { useTemplate } from '@/context/TemplateContext';
import HomePage1 from '@/templates/plantilla1/HomePage';
import HomePage2 from '@/templates/plantilla2/HomePage';
import HomePage3 from '@/templates/plantilla3/HomePage';
import HomePage4 from '@/templates/plantilla4/HomePage';
import HomePage5 from '@/templates/plantilla5/HomePage';
import HomePage6 from '@/templates/plantilla6/HomePage';
import HomePage7 from '@/templates/plantilla7/HomePage';
import HomePage8 from '@/templates/plantilla8/HomePage';
import HomePage10 from '@/templates/plantilla10/HomePage';
import HomePage11 from '@/templates/plantilla11/HomePage';
import HomePage12 from '@/templates/plantilla12/HomePage';
import HomePage13 from '@/templates/plantilla13/HomePage';
import HomePage24 from '@/templates/plantilla24/HomePage';
import HomePage25 from '@/templates/plantilla25/HomePage';
import HomePage23 from '@/templates/plantilla23/HomePage';
import HomePage100 from '@/templates/plantilla100/HomePage';
import HomePage101 from '@/templates/plantilla101/HomePage';

export default function DynamicHomePage({ children }: { children: React.ReactNode }) {
  const { isLoading, getSectionTemplate } = useTemplate();
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  const template = getSectionTemplate('landing');
  if (template === 1) return <HomePage1 />;
  if (template === 2) return <HomePage2 />;
  if (template === 3) return <HomePage3 />;
  if (template === 4) return <HomePage4 />;
  if (template === 5) return <HomePage5 />;
  if (template === 6) return <HomePage6 />;
  if (template === 7) return <HomePage7 />;
  if (template === 8) return <HomePage8 />;
  if (template === 10) return <HomePage10 />;
  if (template === 11) return <HomePage11 />;
  if (template === 12) return <HomePage12 />;
  if (template === 13) return <HomePage13 />;
  if (template === 24) return <HomePage24 />;
  if (template === 23) return <HomePage23 />;
  if (template === 25) return <HomePage25 />;
  if (template === 100) return <HomePage100 />;
  if (template === 101) return <HomePage101 />;
  return <>{children}</>;
}
