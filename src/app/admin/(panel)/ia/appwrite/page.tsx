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
} from 'lucide-react';

/* ─── Types ─── */
type UsageData = {
  databaseReadsTotal: number;
  databaseWritesTotal: number;
  todayReads: number;
  sevenDaysReads: number;
  history: { date: string; value: number }[];
  collections: { products: number; orders: number; inventory: number };
  lastUpdated: string;
  cached: boolean;
  error?: string;
};

/* ─── Helpers ─── */
function getChileTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
}

function secondsSinceMidnightChile(): number {
  const now = getChileTime();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
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
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, minWidth: 4, borderRadius: '3px 3px 0 0',
          height: `${Math.max(3, (v / max) * 100)}%`,
          background: i === data.length - 1 ? color : `${color}66`,
          transition: 'height .3s',
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
  const [elapsed, setElapsed] = useState(secondsSinceMidnightChile());
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Tick every second for the daily chronometer */
  useEffect(() => {
    const t = setInterval(() => setElapsed(secondsSinceMidnightChile()), 1000);
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
      showToast('success', '¡Cache de tienda limpiado!');
    } catch {
      showToast('error', 'Error al limpiar cache');
    }
  }

  /* Derived values */
  const todayPct = data ? Math.min(100, (data.todayReads / 60000) * 100) : 0;
  const barColor = getBarColor(todayPct);
  const sevenPct = data ? Math.min(100, (data.sevenDaysReads / 420000) * 100) : 0;
  const totalDaySeconds = 86400;
  const dayPct = (elapsed / totalDaySeconds) * 100;
  const projectedReads = data && elapsed > 0 ? Math.round((data.todayReads / elapsed) * totalDaySeconds) : 0;

  return (
    <div style={{ minHeight: '100%', background: 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)', padding: '20px 16px 48px' }}>
      <style>{`
        .aw-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; }
        .aw-card-light { background: #f8fafc; border: 1px solid #f8fafc; border-radius: 14px; }
        .aw-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 4px; display: block; }
        .aw-value { font-size: 26px; font-weight: 900; letter-spacing: -0.03em; color: #0f172a; line-height: 1; }
        .aw-sub { font-size: 11px; color: #94a3b8; margin-top: 3px; }
        .aw-btn { display: inline-flex; align-items: center; gap: 7px; border-radius: 11px; padding: 9px 16px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: opacity .15s; }
        .aw-btn:hover { opacity: 0.85; }
        .aw-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes aw-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          .aw-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .aw-main-grid { grid-template-columns: 1fr !important; }
          .aw-col-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .aw-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        {/* ─── Header ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/admin/ia" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', textDecoration: 'none', transition: 'background .15s' }}>
              <ArrowLeft style={{ width: 16, height: 16 }} />
            </Link>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 20, padding: '3px 10px', marginBottom: 6 }}>
                <Database style={{ width: 11, height: 11, color: '#4f46e5' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5' }}>Appwrite Monitor</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                Consumo y Recursos
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="aw-btn" onClick={handleClearCache}
              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>
              <RefreshCw style={{ width: 13, height: 13 }} />
              Limpiar Caché Tienda
            </button>
            <button className="aw-btn" onClick={() => load(true)} disabled={refreshing || loading}
              style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
              <RefreshCw style={{ width: 13, height: 13, ...(refreshing ? { animation: 'spin 1s linear infinite' } : {}) }} />
              {refreshing ? 'Cargando...' : 'Actualizar datos'}
            </button>
          </div>
        </div>

        {loading ? (
          /* ─── Skeleton ─── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[80, 200, 160].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: 18, background: '#fff', animation: 'aw-pulse 2s ease infinite' }} />
            ))}
          </div>
        ) : !data ? (
          <div className="aw-card" style={{ padding: 40, textAlign: 'center' }}>
            <AlertTriangle style={{ width: 40, height: 40, color: '#dc2626', margin: '0 auto 12px' }} />
            <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 16 }}>No se pudieron cargar los datos</p>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>Verifica que el token de API de Appwrite sea correcto</p>
            <button className="aw-btn" onClick={() => load(true)} style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', marginTop: 20 }}>
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {/* ─── Cronómetro del día (Chile) ─── */}
            <div className="aw-card" style={{ padding: '18px 22px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock style={{ width: 18, height: 18, color: '#0f172a' }} />
                </div>
                <div>
                  <span className="aw-label">Cronómetro diario — Hora Chile (UTC-4)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em' }}>
                      {formatDuration(elapsed)}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>transcurrido desde medianoche</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Progreso del día</p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: '#4f46e5' }}>{dayPct.toFixed(1)}%</p>
                </div>
                <div style={{ width: 6, height: 48, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ width: '100%', height: `${dayPct}%`, background: 'linear-gradient(180deg,#06b6d4,#4f46e5)', borderRadius: 3, transition: 'height 1s' }} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Proyección hoy</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: projectedReads > 60000 ? '#f87171' : '#34d399' }}>
                  ~{compactNum(projectedReads)}
                </p>
                <p style={{ fontSize: 10, color: '#94a3b8' }}>lecturas estimadas al cierre</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '6px 12px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: data.cached ? '#f59e0b' : '#10b981', boxShadow: data.cached ? '0 0 6px #f59e0b' : '0 0 6px #10b981', flexShrink: 0, animation: 'aw-pulse 2s ease infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>
                  {data.cached ? 'Caché (15m)' : 'Datos frescos'} · {new Date(data.lastUpdated).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* ─── Gauge diario ─── */}
            <div className="aw-card" style={{ padding: '20px 22px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span className="aw-label">Lecturas hoy vs límite diario (60,000)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: barColor, letterSpacing: '-0.04em' }}>{fmt(data.todayReads)}</span>
                    <span style={{ fontSize: 15, color: '#94a3b8', fontWeight: 600 }}>/ 60,000</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: barColor }}>{todayPct.toFixed(1)}%</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: todayPct >= 85 ? 'rgba(239,68,68,0.2)' : todayPct >= 50 ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)', color: barColor }}>
                    {todayPct >= 85 ? '🔴 CRITICO' : todayPct >= 50 ? '🟡 MODERADO' : '🟢 OPTIMO'}
                  </span>
                </div>
              </div>
              <div style={{ height: 12, background: '#f8fafc', borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${todayPct}%`, background: `linear-gradient(90deg,${barColor},${barColor}99)`, borderRadius: 6, transition: 'width .8s' }} />
              </div>
              {/* Ticks */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#cbd5e1' }}>
                {[0, '15k', '30k', '45k', '60k'].map(t => <span key={t}>{t}</span>)}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
                {todayPct >= 85
                  ? '⚠️ Cerca del límite diario. Considera pausar operaciones intensivas.'
                  : todayPct >= 50
                  ? '⚡ Consumo moderado. Mantén el ritmo bajo control.'
                  : '✅ Consumo óptimo dentro del plan gratuito (1.8M lecturas/mes).'}
              </p>
            </div>

            {/* ─── 4 KPI cards ─── */}
            <div className="aw-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Lecturas totales (30d)', value: compactNum(data.databaseReadsTotal), sub: `${fmt(data.databaseReadsTotal)} operaciones`, icon: Activity, color: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
                { label: 'Escrituras totales (30d)', value: compactNum(data.databaseWritesTotal), sub: 'creaciones y updates', icon: Database, color: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
                { label: 'Lecturas 7 días', value: compactNum(data.sevenDaysReads), sub: `${sevenPct.toFixed(0)}% del límite semanal`, icon: TrendingUp, color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
                { label: 'Docs activos totales', value: fmt(data.collections.products + data.collections.orders + data.collections.inventory), sub: 'productos + pedidos + stock', icon: Layers, color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
              ].map(s => (
                <div key={s.label} className="aw-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg,${s.color},${s.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 14px ${s.glow}` }}>
                    <s.icon style={{ width: 18, height: 18, color: '#0f172a' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p className="aw-label">{s.label}</p>
                    <p className="aw-value" style={{ fontSize: 22 }}>{s.value}</p>
                    <p className="aw-sub">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Charts + collections ─── */}
            <div className="aw-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>

              {/* Historial 30 días */}
              <div className="aw-card" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <BarChart3 style={{ width: 16, height: 16, color: '#4f46e5' }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Historial de lecturas — últimos 30 días</span>
                </div>
                {data.history.length > 0 ? (
                  <>
                    <BarChart data={data.history.map(h => h.value)} color="#6366f1" height={120} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#cbd5e1' }}>
                      <span>{data.history[0]?.date ? new Date(data.history[0].date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) : 'Inicio'}</span>
                      <span style={{ color: '#4f46e5', fontWeight: 700 }}>Hoy</span>
                    </div>
                    {/* Stats row under chart */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14 }}>
                      {[
                        { label: 'Pico máximo', value: fmt(Math.max(...data.history.map(h => h.value))), color: '#dc2626' },
                        { label: 'Promedio diario', value: fmt(Math.round(data.history.reduce((a, h) => a + h.value, 0) / data.history.length)), color: '#4f46e5' },
                        { label: 'Días con datos', value: String(data.history.filter(h => h.value > 0).length), color: '#34d399' },
                      ].map(s => (
                        <div key={s.label} className="aw-card-light" style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <p className="aw-label">{s.label}</p>
                          <p style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                    Sin datos históricos disponibles
                  </div>
                )}
              </div>

              {/* Colecciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="aw-card" style={{ padding: '18px 20px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Layers style={{ width: 15, height: 15, color: '#34d399' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Colecciones principales</span>
                  </div>
                  <div className="aw-col-grid" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Productos', count: data.collections.products, color: '#0ea5e9', desc: 'Catálogo + imágenes' },
                      { label: 'Pedidos', count: data.collections.orders, color: '#ec4899', desc: 'Historial de compras' },
                      { label: 'Inventario', count: data.collections.inventory, color: '#10b981', desc: 'Stock y variantes' },
                    ].map(col => {
                      const maxC = Math.max(data.collections.products, data.collections.orders, data.collections.inventory, 1);
                      const pct = (col.count / maxC) * 100;
                      return (
                        <div key={col.label} className="aw-card-light" style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{col.label}</span>
                              <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 6 }}>{col.desc}</span>
                            </div>
                            <span style={{ fontSize: 15, fontWeight: 900, color: col.color }}>{fmt(col.count)}</span>
                          </div>
                          <div style={{ height: 4, background: '#f8fafc', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: col.color, borderRadius: 2, transition: 'width .6s' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Límites info */}
                <div className="aw-card" style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Shield style={{ width: 14, height: 14, color: '#fbbf24' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Límites plan gratuito</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Lecturas diarias', limit: '60,000', icon: '📖', used: fmt(data.todayReads) },
                      { label: 'Lecturas mensuales', limit: '1.8M', icon: '📊', used: compactNum(data.databaseReadsTotal) },
                      { label: 'Escrituras mensuales', limit: '300k', icon: '✏️', used: compactNum(data.databaseWritesTotal) },
                    ].map(l => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: '#f8fafc', borderRadius: 9 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 13 }}>{l.icon}</span>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{l.label}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{l.used}</span>
                          <span style={{ fontSize: 10, color: '#cbd5e1', marginLeft: 4 }}>/ {l.limit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Semana ─── */}
            <div className="aw-card" style={{ padding: '18px 22px', marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap style={{ width: 15, height: 15, color: '#fbbf24' }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Lecturas 7 días acumulados</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{fmt(data.sevenDaysReads)} / 420,000</span>
              </div>
              <div style={{ height: 8, background: '#f8fafc', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${sevenPct}%`, background: 'linear-gradient(90deg,#f59e0b,#ef4444)', borderRadius: 4, transition: 'width .8s' }} />
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                {sevenPct.toFixed(1)}% del límite semanal recomendado (420k) — basado en 60k/día × 7
              </p>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 14, fontSize: 14, fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', background: toast.type === 'success' ? '#059669' : '#dc2626', color: '#0f172a', whiteSpace: 'nowrap' }}>
            {toast.type === 'success' ? <CheckCheck style={{ width: 16, height: 16 }} /> : <AlertTriangle style={{ width: 16, height: 16 }} />}
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
