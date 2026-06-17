'use client';

import React from 'react';
import { Package, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmbalajesPlaceholderPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Embalajes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de precios y lógica de embalajes de la tienda</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm min-h-[400px]">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sección en Construcción</h2>
        <p className="text-gray-500 max-w-md text-sm leading-relaxed">
          Estamos preparando la lógica de Embalajes para ti. En esta sección podrás gestionar las configuraciones avanzadas de precios y cantidades para compras por embalaje cerrado.
        </p>
        <div className="pt-4">
          <Link href="/admin/por-mayor" className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl text-sm hover:bg-indigo-700 transition shadow-sm">
            Ir a Sección Por Mayor
          </Link>
        </div>
      </div>
    </div>
  );
}
