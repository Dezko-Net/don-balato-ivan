'use client';

import React from 'react';

export default function CatalogoClient() {
  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <iframe
        src="/shopify/catalogo-original/index.html"
        title="Catálogo Mayorista | Don Balato Iván"
        className="w-full h-full border-0"
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
}
