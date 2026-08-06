'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchAllAppwriteErpProducts, AppwriteErpProduct } from '@/lib/appwriteErpService';
import { SEDES, SedeSlug } from '@/types';
import { ShoppingCart, Package, DollarSign, TrendingUp, RefreshCw, ChevronRight, Store, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n));

export default function PosAdminSedeDashboardPage() {
  const params = useParams();
  const sedeSlug = (params?.sede || 'chacabuco-08') as SedeSlug;
  const sedeNombre = SEDES[sedeSlug] || sedeSlug;

  const [products, setProducts] = useState<AppwriteErpProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAllAppwriteErpProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const totalCount = products.length;
    const inStock = products.filter((p) => p.stock > 0).length;
    const withImage = products.filter((p) => Boolean(p.imageUrl)).length;
    const totalInventoryValue = products.reduce((sum, p) => sum + p.costo_uni * p.stock, 0);
    const totalRetailValue = products.reduce((sum, p) => sum + p.precio_venta_1 * p.stock, 0);
    return { totalCount, inStock, withImage, totalInventoryValue, totalRetailValue };
  }, [products]);

  const basePath = `/pos-admin/${sedeSlug}`;

  return (
    <div className="space-y-6">
      {/* Header Banner Sede */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs uppercase font-bold tracking-wider mb-1">
            <Store className="w-4 h-4" /> Sucursal Activa: {sedeNombre}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Dashboard POS — {sedeNombre}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Módulo de caja registradora e inventario unificado en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/pos/${sedeSlug}`}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-md transition text-sm"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Abrir Caja Registradora (POS)</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/pos/${sedeSlug}`}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition">Terminal de Caja POS</h3>
              <p className="text-gray-500 text-xs mt-0.5">Escáner 0ms, cobros y boleta 80mm PDF417</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href={`${basePath}/productos`}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition">Productos & Inventario</h3>
              <p className="text-gray-500 text-xs mt-0.5">Maestro completo conectado a Appwrite Cloud</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition" />
        </Link>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Estado de Conexión</h3>
              <p className="text-emerald-600 font-bold text-xs mt-0.5">Appwrite Cloud Conectado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Métricas de Inventario */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-gray-900">Métricas de Inventario Unificado</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-xs text-gray-500 font-medium">Total Productos</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : stats.totalCount}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-xs text-emerald-600 font-bold">Con Foto (Visibles Web)</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{loading ? '...' : stats.withImage}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-xs text-blue-600 font-bold">Valor Inventario (Costo)</div>
            <div className="text-xl font-black text-blue-600 mt-1">{loading ? '...' : fmtCLP(stats.totalInventoryValue)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-xs text-purple-600 font-bold">Valor Proyectado (Venta)</div>
            <div className="text-xl font-black text-purple-600 mt-1">{loading ? '...' : fmtCLP(stats.totalRetailValue)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
