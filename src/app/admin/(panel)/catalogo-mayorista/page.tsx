'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, ExternalLink, RefreshCw, Send, CheckCircle2, Package, Sparkles } from 'lucide-react';

export default function CatalogoMayoristaAdminPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'link' | 'sync'>('info');

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              Módulo Mayorista
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Catálogo Unificado & Ventas por WhatsApp</h1>
          <p className="text-xs text-slate-400">
            Administra la recepción de pedidos mayoristas y enlace directo con tus clientes de WhatsApp.
          </p>
        </div>

        <a
          href="/catalogo"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition shadow-md shadow-amber-500/20"
        >
          <ExternalLink size={14} /> Abrir Catálogo Mayorista (/catalogo)
        </a>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Productos en Catálogo</span>
            <Package size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">120+</p>
          <p className="text-[11px] text-slate-500">Sincronizados con la base de datos central</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Canal Principal</span>
            <Send size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">WhatsApp Bot</p>
          <p className="text-[11px] text-slate-500">Asistente Kenia lista para tomar pedidos</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Estado de Integración</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">Activo</p>
          <p className="text-[11px] text-slate-500">Imágenes WebP en CDN de Google</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Instrucciones de Uso para Ventas</h2>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles size={14} /> ¿Cómo compartir el catálogo con clientes?
            </h3>
            <p>
              Copia y envía el enlace <code className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">https://donbalatoivan.cl/catalogo</code> a tus clientes por WhatsApp o redes sociales.
              Ellos podrán armar su pedido al por mayor en segundos y enviártelo formateado a tu chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
