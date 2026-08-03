'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, ExternalLink, RefreshCw, Send, CheckCircle2, Package, Sparkles, Info, ArrowRight } from 'lucide-react';

export default function CatalogoMayoristaAdminPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'link' | 'sync'>('info');

  return (
    <div className="p-4 md:p-8 space-y-8 w-full max-w-6xl mx-auto font-sans">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60 uppercase tracking-widest shadow-sm">
                Módulo Mayorista
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Sistema Activo
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Gestión de Catálogo<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                y Ventas Mayoristas
              </span>
            </h1>
            <p className="text-base text-gray-500 font-medium leading-relaxed max-w-xl">
              Panel centralizado para administrar el catálogo público, sincronizar inventario y gestionar los pedidos recibidos mediante nuestro asistente de WhatsApp.
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href="/catalogo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1 group/btn w-full md:w-auto"
            >
              <span>Abrir Catálogo Público</span>
              <ExternalLink size={18} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between text-gray-500 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">Productos Sincronizados</span>
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                <Package size={20} className="text-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-5xl font-black text-gray-900 tracking-tighter">120</p>
              <span className="text-lg font-bold text-gray-400">+</span>
            </div>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <RefreshCw size={14} className="text-amber-500" /> Actualizado en tiempo real
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between text-gray-500 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">Canal de Recepción</span>
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                <Send size={20} className="text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tight mb-3">WhatsApp</p>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-500" /> Asistente Kenia en línea
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between text-gray-500 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">Rendimiento</span>
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                <CheckCircle2 size={20} className="text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-black text-blue-600 tracking-tight mb-3">Optimizado</p>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              CDN Google (Imágenes WebP)
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <ShoppingBag size={24} className="text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Operativa de Ventas</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Guía rápida para la gestión de clientes y enlaces</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-8 relative overflow-hidden group transition-colors hover:bg-slate-50">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <ExternalLink size={20} className="text-amber-500" /> 
                Compartir Catálogo
              </h3>
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
              Usa este enlace oficial para que tus clientes puedan visualizar los productos disponibles, armar su canasta de compras de forma interactiva y enviarte el pedido listo por WhatsApp.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center overflow-hidden">
                <code className="text-sm font-mono font-bold text-gray-800 truncate select-all">
                  https://donbalatoivan.cl/catalogo
                </code>
              </div>
              <button className="px-6 py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 flex-shrink-0">
                Copiar
              </button>
            </div>
          </div>

          <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-8 relative overflow-hidden transition-colors hover:bg-slate-50">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"></div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <Info size={20} className="text-emerald-500" /> 
              Proceso de Compra
            </h3>
            <ul className="space-y-4">
              {[
                { step: '1', text: 'El cliente abre el enlace web del catálogo.' },
                { step: '2', text: 'Agrega los productos que desea al carrito interactivo.' },
                { step: '3', text: 'El sistema formatea un mensaje detallado con el pedido.' },
                { step: '4', text: 'El cliente te envía el mensaje automáticamente por WhatsApp.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                    {item.step}
                  </span>
                  <span className="text-sm font-medium text-gray-600 pt-0.5">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

