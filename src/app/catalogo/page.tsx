import type { Metadata } from 'next';
import CatalogoClient from './CatalogoClient';

export const metadata: Metadata = {
  title: 'Catálogo Mayorista | Don Balato Iván',
  description: 'Catálogo mayorista oficial de Don Balato Iván. Haz tus pedidos al por mayor directamente por WhatsApp con stock y precios en tiempo real.',
};

export default function CatalogoPage() {
  return <CatalogoClient />;
}
