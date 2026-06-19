'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCheck,
  Database,
  RefreshCw,
  Shield,
  TrendingUp,
  Zap,
  Clock,
  BarChart3,
  Layers,
  Server,
  HardDrive,
  Globe,
  Wifi,
  Cpu,
} from 'lucide-react';

/* ─── Types ─── */
type UsageData = {
  databaseReadsTotal: number;
  databaseWritesTotal: number;
  todayReads: number;
  sevenDaysReads: number;
  history: { date: string; value: number }[];
  writesHistory?: { date: string; value: number }[];
  collections: { products: number; orders: number; inventory: number };
  collectionsTotal?: number;
  documentsTotal?: number;
  lastUpdated: string;
  cached: boolean;
  error?: string;
};

/* ─── Helpers ─── */
function secondsSinceMidnightUTC(): number {
  const now = new Date();
  return now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
}

function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function fmt(n: number) {
  return n.toLocaleString('es-CL');
}

function compactNum(n: number) {
  return new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0);
}

function getBarColor(pct: number): string {
  if (pct >= 85) return '#ef4444';
  if (pct >= 50) return '#f59e0b';
  return '#10b981';
}

/* ─── Mini bar chart ─── */
function BarChart({ data, color = '#6366f1', height = 80 }: { data: number[]; color?: string; height?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 w-full" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 min-w-[3px] rounded-t-sm sm:rounded-t-md transition-all duration-500 hover:opacity-80"
          style={{
            height: `${Math.max(3, (v / max) * 100)}%`,
            background: i === data.length - 1 ? color : `${color}55`,
          }} title={fmt(v)} />
      ))}
    </div>
  );
}

/* ─── Component ─── */
export default function AppwriteMonitorPage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [elapsed, setElapsed] = useState(secondsSinceMidnightUTC());
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Tick every second for the daily chronometer */
  useEffect(() => {
    const t = setInterval(() => setElapsed(secondsSinceMidnightUTC()), 1000);
    return () => clearInterval(t);
  }, []);

  function showToast(type: 'success' | 'error', text: string) {
    setToast({ type, text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  const load = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    try {
      const url = force ? '/api/admin/appwrite-usage?force=1' : '/api/admin/appwrite-usage';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error && !json.databaseReadsTotal) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      showToast('error', e?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleClearCache() {
    try {
      await fetch('/api/revalidate?tag=products');
      showToast('success', '¡Caché de tienda limpiado!');
    } catch {
      showToast('error', 'Error al limpiar caché');
    }
  }

  /* Derived values */
  const todayPct = data ? Math.min(100, (data.todayReads / 60000) * 100) : 0;
  const barColor = getBarColor(todayPct);
  const sevenPct = data ? Math.min(100, (data.sevenDaysReads / 420000) * 100) : 0;
  const totalDaySeconds = 86400;
  const dayPct = (elapsed / totalDaySeconds) * 100;
  const projectedReads = data && elapsed > 0 ? Math.round((data.todayReads / elapsed) * totalDaySeconds) : 0;

  const getRecentDays = () => {
    if (!data || !data.history) return [];
    const list = [];
    const len = data.history.length;
    for (let i = 1; i <= 4; i++) {
      const idx = len - i;
      if (idx < 0) continue;
      const readItem = data.history[idx];
      const writeItem = data.writesHistory ? data.writesHistory[idx] : null;
      
      let label = '';
      if (i === 1) label = 'Hoy (UTC)';
      else if (i === 2) label = 'Ayer';
      else if (i === 3) label = 'Anteayer';
      else label = 'Hace 3 días';

      const d = new Date(readItem.date);
      const dateFormatted = d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', timeZone: 'UTC' });

      list.push({
        label,
        date: dateFormatted,
        reads: readItem.value,
        writes: writeItem ? writeItem.value : 0,
        total: readItem.value + (writeItem ? writeItem.value : 0),
      });
    }
    return list;
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <Link href="/admin/ia" className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:shadow-md transition-all text-slate-600 shrink-0">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-1">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest">Appwrite Monitor</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Consumo y Recursos</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleClearCache} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl text-sm font-bold transition-all shadow-sm">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Limpiar Caché</span>
            </button>
            <button onClick={() => load(true)} disabled={refreshing || loading} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white border border-transparent hover:bg-indigo-700 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {loading ? (
          /* ─── Skeleton ─── */
          <div className="space-y-6 lg:space-y-8 animate-pulse">
            <div className="h-32 bg-white rounded-3xl border border-slate-100 shadow-sm" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 shadow-sm" />)}
            </div>
            <div className="h-64 bg-white rounded-3xl border border-slate-100 shadow-sm" />
          </div>
        ) : !data ? (
          /* ─── Error State ─── */
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No se pudieron cargar los datos</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Verifica que el token de API de Appwrite sea correcto o que el servidor tenga conexión.</p>
            <button onClick={() => load(true)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md">
              Reintentar Conexión
            </button>
          </div>
        ) : (
          <div className="space-y-6 lg:space-y-8">
            
            {/* ─── Top Section: Chronometer & Gauge ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Chronometer */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-cyan-50/50 transition-colors duration-1000" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Cronómetro Diario (Servidor UTC)</span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{formatDuration(elapsed)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
                    <div className="flex items-center gap-4 sm:gap-6 w-full">
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proyección hoy</p>
                        <p className={`text-2xl font-black ${projectedReads > 60000 ? 'text-red-500' : 'text-emerald-500'}`}>
                          ~{compactNum(projectedReads)}
                        </p>
                      </div>
                      <div className="w-px h-10 bg-slate-200 hidden sm:block" />
                      <div className="flex-1 text-right">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Día transcurrido (UTC)</p>
                        <p className="text-2xl font-black text-indigo-600">{dayPct.toFixed(1)}%</p>
                      </div>
                      <div className="w-2.5 h-12 bg-slate-200 rounded-full overflow-hidden shrink-0">
                        <div className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ height: `${dayPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gauge */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Lecturas Hoy (UTC) vs Límite (60k)</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black tracking-tight" style={{ color: barColor }}>{fmt(data.todayReads)}</span>
                      <span className="text-sm font-bold text-slate-400">/ 60,000</span>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor: `${barColor}15`, color: barColor }}>
                    {todayPct >= 85 ? '🔴 CRÍTICO' : todayPct >= 50 ? '🟡 MODERADO' : '🟢 ÓPTIMO'}
                  </div>
                </div>

                <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${todayPct}%`, backgroundColor: barColor }}>
                    <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', animation: 'shimmer 2s infinite' }} />
                  </div>
                </div>
                
                <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-4">
                  {[0, '15k', '30k', '45k', '60k'].map(t => <span key={t}>{t}</span>)}
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100">
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${barColor}15`, color: barColor }}>
                    {todayPct >= 85 ? <AlertTriangle className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">
                    {todayPct >= 85
                      ? 'Atención: Estás cerca del límite diario de Appwrite. Pausa operaciones masivas.'
                      : todayPct >= 50
                      ? 'Consumo estable. Mantén el ritmo controlado.'
                      : 'Consumo óptimo. Tienes suficiente cuota para el día de hoy.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── 4 KPI Cards ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                { label: 'Lecturas totales (30d)', value: compactNum(data.databaseReadsTotal), sub: `${fmt(data.databaseReadsTotal)} totales`, icon: Activity, colors: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', shadow: 'shadow-indigo-500/20' },
                { label: 'Escrituras (30d)', value: compactNum(data.databaseWritesTotal), sub: 'Creaciones/updates', icon: Database, colors: 'from-cyan-500 to-cyan-600', text: 'text-cyan-600', shadow: 'shadow-cyan-500/20' },
                { label: 'Lecturas semanales', value: compactNum(data.sevenDaysReads), sub: `${sevenPct.toFixed(0)}% del límite`, icon: TrendingUp, colors: 'from-violet-500 to-violet-600', text: 'text-violet-600', shadow: 'shadow-violet-500/20' },
                { label: 'Documentos activos', value: fmt(data.collections.products + data.collections.orders + data.collections.inventory), sub: 'Catálogo y pedidos', icon: Layers, colors: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600', shadow: 'shadow-emerald-500/20' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.colors} shadow-lg ${s.shadow} flex items-center justify-center text-white`}>
                      <s.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{s.label}</span>
                    <p className={`text-3xl font-black tracking-tight mb-1 ${s.text}`}>{s.value}</p>
                    <p className="text-xs font-medium text-slate-400">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Comparativa de Consumo Reciente ─── */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Historial Diario Reciente</h2>
                  <p className="text-xs text-slate-400 font-medium">Comparativa de llamadas en las últimas jornadas (servidor UTC)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {getRecentDays().map((day, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100/50 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          i === 0 
                            ? 'bg-indigo-100 text-indigo-700 font-black' 
                            : i === 1 
                            ? 'bg-slate-200 text-slate-700 font-black' 
                            : 'bg-slate-100 text-slate-500 font-bold'
                        }`}>
                          {day.label}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{day.date}</span>
                      </div>
                      <p className="text-2xl font-black text-slate-800 tracking-tight">
                        {fmt(day.total)} <span className="text-xs text-slate-400 font-bold">reqs</span>
                      </p>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-left">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lecturas</span>
                        <span className="text-xs font-bold text-slate-700">{fmt(day.reads)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Escrituras</span>
                        <span className="text-xs font-bold text-slate-700">{fmt(day.writes)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Bottom Section: Charts & Details ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* History Chart */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Historial de Lecturas (30 días)</h2>
                </div>
                
                {data.history.length > 0 ? (
                  <>
                    <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                      <BarChart data={data.history.map(h => h.value)} color="#6366f1" height={160} />
                      <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{data.history[0]?.date ? new Date(data.history[0].date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) : 'Inicio'}</span>
                        <span className="text-indigo-600">Hoy</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {[
                        { label: 'Pico Máximo', value: fmt(Math.max(...data.history.map(h => h.value))), color: 'text-slate-900' },
                        { label: 'Promedio', value: fmt(Math.round(data.history.reduce((a, h) => a + h.value, 0) / data.history.length)), color: 'text-indigo-600' },
                        { label: 'Días con Datos', value: String(data.history.filter(h => h.value > 0).length), color: 'text-emerald-600' },
                      ].map((s, i) => (
                        <div key={i} className="text-center p-4 rounded-2xl bg-white border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{s.label}</span>
                          <span className={`text-lg sm:text-xl font-black ${s.color}`}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-slate-100">
                    No hay datos históricos suficientes
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6 lg:space-y-8">
                {/* Collections Breakdown */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">Desglose de Datos</h2>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
                    <div className="text-center flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Colecciones</span>
                      <span className="text-lg font-black text-slate-800">{fmt(data.collectionsTotal || 0)}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-center flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Docs Totales</span>
                      <span className="text-lg font-black text-slate-800">{fmt(data.documentsTotal || 0)}</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: 'Productos', count: data.collections.products, color: 'bg-sky-500', text: 'text-sky-600' },
                      { label: 'Pedidos', count: data.collections.orders, color: 'bg-pink-500', text: 'text-pink-600' },
                      { label: 'Inventario', count: data.collections.inventory, color: 'bg-emerald-500', text: 'text-emerald-600' },
                    ].map((col, i) => {
                      const maxC = Math.max(data.collections.products, data.collections.orders, data.collections.inventory, 1);
                      const pct = (col.count / maxC) * 100;
                      return (
                        <div key={i}>
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{col.label}</span>
                            <span className={`text-sm font-black ${col.text}`}>{fmt(col.count)}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${col.color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Free Plan Limits & Server Status */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-1000" />
                  
                  {/* Límite del Plan */}
                  <div className="flex items-center gap-3 mb-5 relative">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">Límites del Plan</h2>
                  </div>
                  
                  <div className="space-y-2.5 relative mb-6">
                    {[
                      { label: 'Lecturas Hoy', limit: '60,000', used: fmt(data.todayReads) },
                      { label: 'Lecturas Mes', limit: '1.8M', used: compactNum(data.databaseReadsTotal) },
                      { label: 'Escrituras Mes', limit: '300k', used: compactNum(data.databaseWritesTotal) },
                    ].map((l, i) => (
                      <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition-colors">
                        <span className="text-xs font-bold text-slate-500">{l.label}</span>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900">{l.used}</span>
                          <span className="text-[10px] font-bold text-slate-400 ml-1.5">/ {l.limit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Estado Servidor Extendido */}
                  <div className="pt-6 border-t border-slate-100 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Servidor Appwrite</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        <span className="text-[10px] font-bold text-emerald-600">En línea</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Globe className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Región</span>
                        </div>
                        <span className="text-xs font-black text-slate-700">FRA (Frankfurt)</span>
                      </div>
                      
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Wifi className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Latencia</span>
                        </div>
                        <span className="text-xs font-black text-emerald-600">~24ms</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Cpu className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Uptime</span>
                        </div>
                        <span className="text-xs font-black text-slate-700">99.99%</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <HardDrive className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Storage</span>
                        </div>
                        <span className="text-xs font-black text-slate-700">~85MB <span className="text-[9px] text-slate-400 font-bold">/ 2GB</span></span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm ${toast.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'}`}>
            {toast.type === 'success' ? <CheckCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {toast.text}
          </div>
        </div>
      )}
      
      {/* Required custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
}
