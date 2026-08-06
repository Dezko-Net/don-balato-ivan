'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, MapPin, ChevronRight, Package, Store, ArrowLeft, Download, Upload, Search, RefreshCw, Save, Trash2, Plus, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getServices, PRODUCTS_COLLECTION, Query, ID } from '@/lib/appwrite';
import { fetchAllAppwriteErpProducts, updateAppwriteErpProduct, createAppwriteErpProduct, deleteAppwriteErpProduct, AppwriteErpProduct } from '@/lib/appwriteErpService';
import { DEFAULT_SEDE, SEDE_SLUGS, SEDES as SEDES_LABELS, type SedeSlug } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { isAdminEmail } from '@/lib/admin-access';
import { useRouter } from 'next/navigation';

function usePriceListConfig() {
  return {
    config: {},
    listasActivas: ['precio_detalle', 'precio_mayorista', 'precio_segundo'],
    listasParaCosto: [
      { campo: 'precio_detalle', nombre: 'Detalle' },
      { campo: 'precio_mayorista', nombre: 'Mayorista' },
      { campo: 'precio_segundo', nombre: 'Emprendedor' },
    ],
    nombrePorCampo: (campo: string) => {
      if (campo === 'precio_detalle') return 'Detalle / Web';
      if (campo === 'precio_mayorista') return 'Mayorista';
      if (campo === 'precio_segundo') return 'Emprendedor';
      return campo;
    },
  };
}

function parseMoney(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return Math.round(val);
  let s = String(val).trim();
  if (!s) return 0;
  s = s.replace(/\$/g, '').replace(/\s+/g, '').replace(/%/g, '');
  const hasDot = s.includes('.');
  const hasComma = s.includes(',');
  if (hasDot && hasComma) {
    s = s.replace(/\./g, '').replace(/,/g, '.');
  } else if (hasComma && !hasDot) {
    const parts = s.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      s = parts[0] + '.' + parts[1];
    } else {
      s = s.replace(/,/g, '');
    }
  } else if (hasDot && !hasComma) {
    const parts = s.split('.');
    if (parts.length > 2) {
      s = parts.join('');
    } else if (parts[1]?.length === 3) {
      s = parts.join('');
    }
  }
  s = s.replace(/[^0-9.-]/g, '');
  const n = Number(s);
  return isNaN(n) ? 0 : Math.round(n);
}

function norm(s: any): string {
  const t = String(s ?? '').toLowerCase();
  return t
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildCSV(headers: string[], rows: Array<Array<string | number>>): string {
  const esc = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(r.map(esc).join(','));
  return lines.join('\n');
}

type ProductRow = {
  sku: string;
  isAutoSku?: boolean;
  nombre: string;
  codigo_barra: string;
  categoria?: string;
  stock?: number;
  ilimitado: boolean;
  costo_uni: number;
  precio_venta_1?: number;
  precio_venta_2?: number;
  precio_venta_3?: number;
  ajuste_menos10?: boolean;
  updatedAt?: number;
  rowId?: string;
};

type StockRow = {
  sku: string;
  stock: number;
  updatedAt?: number;
};

export default function BaseDeDatosPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !isAdminEmail(user?.email))) {
      router.replace('/admin/login');
    }
  }, [authLoading, isLoggedIn, user, router]);

  const { config: priceListConfig, listasActivas: plActivas, listasParaCosto: plParaCosto, nombrePorCampo: plNombre } = usePriceListConfig();
  const [tab, setTab] = useState<'maestro' | 'stock' | 'precios' | 'ventas' | 'paste'>('maestro');
  
  // Paste Update state
  const [pasteInput, setPasteInput] = useState('');
  const [pasteParsed, setPasteParsed] = useState<Array<{
    sku: string;
    codigo_barra: string;
    nombre: string;
    stock: number;
    costo_uni: number;
    precio_detalle: number;
    precio_mayorista: number;
    precio_segundo: number;
    existsProduct: boolean;
    currentStock: number;
    fechaIngreso: string;
    invalid?: string;
  }>>([]);
  const [pasteApplying, setPasteApplying] = useState(false);
  const [pasteParsing, setPasteParsing] = useState(false);
  const [pasteResult, setPasteResult] = useState<string>('');

  const [sede, setSede] = useState<SedeSlug>(DEFAULT_SEDE);
  const [prodRows, setProdRows] = useState<ProductRow[]>([]);
  const [stockRows, setStockRows] = useState<StockRow[]>([]);
  const [stockSearch, setStockSearch] = useState('');
  const [priceRows, setPriceRows] = useState<Array<{ sku: string; precio_detalle: number; precio_mayorista: number; precio_segundo?: number; precio_auto?: boolean }>>([]);
  const [salesRows, setSalesRows] = useState<Array<{ sku: string; nombre: string; cantidadVendida: number; ventasBrutas: number; costoNeto: number; costoUnitarioCalculado: number }>>([]);
  
  const [file, setFile] = useState<File | null>(null);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [skuFilter, setSkuFilter] = useState<'todos' | 'vt' | 'db' | 'num'>('todos');
  const [onlyNoCost, setOnlyNoCost] = useState(false);
  const [openWithCost, setOpenWithCost] = useState(false);
  const [openNoCost, setOpenNoCost] = useState(false);
  const [costoGeneralSearch, setCostoGeneralSearch] = useState('');
  const [showLatestFirst, setShowLatestFirst] = useState(false);
  const [stage, setStage] = useState<'choose' | 'santiago' | 'sede'>('choose');

  const [dynamicSedes, setDynamicSedes] = useState<Array<{ slug: string; name: string; active: boolean; icon?: string; color?: string }>>([
    { slug: 'chacabuco-08', name: 'CHACABUCO 08', active: true, icon: '🏪', color: 'emerald' },
  ]);

  useEffect(() => {
    fetch('/api/admin-supreme/load-config')
      .then(res => res.json())
      .then(res => {
        if (res.ok && res.data) {
          try {
            const parsed = JSON.parse(res.data);
            if (Array.isArray(parsed.branches) && parsed.branches.length > 0) {
              const branches = parsed.branches.map((b: any) => ({
                slug: b.slug || b.name?.toLowerCase().replace(/\s+/g, '-'),
                name: b.name || b.slug,
                active: b.active !== false,
                icon: b.icon || '🏪',
                color: b.color || 'emerald',
              }));
              setDynamicSedes(branches);
            }
          } catch (e) {
            console.error('Error parsing branches:', e);
          }
        }
      })
      .catch(err => console.error('Error loading config branches:', err));
  }, []);

  const configuredBranches = dynamicSedes;
  const activeBranches = useMemo(() => configuredBranches.filter(b => b.active), [configuredBranches]);

  const [showHasDM, setShowHasDM] = useState(false);
  const [showHasDMSegundo, setShowHasDMSegundo] = useState(false);
  const [showIncompleteEither, setShowIncompleteEither] = useState(false);
  const [showOnlyEstimated, setShowOnlyEstimated] = useState(false);
  const [exportProgress, setExportProgress] = useState<number>(-1);
  const [loadProgress, setLoadProgress] = useState<number>(-1);

  const [showFilters, setShowFilters] = useState(true);
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(false);
  const [showCodigoBarra, setShowCodigoBarra] = useState(false);

  const [generalCosts, setGeneralCosts] = useState<Array<{ sku: string; nombre: string; costo_uni: number }>>([]);
  const [loadingGeneral, setLoadingGeneral] = useState<boolean>(false);
  const [costFile, setCostFile] = useState<File | null>(null);
  
  const generalCostDraftBySkuRef = useRef<Record<string, string>>({});
  const costoDraftByRowIdRef = useRef<Record<string, string>>({});
  const precioBajoDraftBySkuRef = useRef<Record<string, string>>({});

  const isSinglePriceSede = stage === 'sede' && sede === 'copiapo';
  const isTwoPriceSede = stage === 'sede' && sede !== 'copiapo';

  const ensureRowId = (r: ProductRow): ProductRow => {
    if (r.rowId) return r;
    return { ...r, rowId: `${Date.now()}_${Math.random().toString(36).slice(2)}` };
  };

  const precioMasBajo = (r: ProductRow): number => {
    const p1 = Math.round(Number((r as any)?.precio_venta_1) || 0);
    const p2 = Math.round(Number((r as any)?.precio_venta_2) || 0);
    const p3 = Math.round(Number((r as any)?.precio_venta_3) || 0);
    const ps = [p1, p2, p3].filter((n) => n > 0);
    if (!ps.length) return 0;
    return Math.min(...ps);
  };

  const getPrecioMasBajoFromPriceRows = (sku: string): number => {
    const priceRow = priceRows.find(p => p.sku === sku);
    if (!priceRow) return 0;
    const ps = [
      Math.round(priceRow.precio_detalle || 0),
      Math.round(priceRow.precio_mayorista || 0),
      Math.round(priceRow.precio_segundo || 0)
    ].filter(x => x > 0);
    if (!ps.length) return 0;
    return Math.min(...ps);
  };

  const precioMasBajoFromPriceRow = (r: { precio_detalle: number; precio_mayorista: number; precio_segundo?: number }): number => {
    const precios: number[] = [];
    for (const l of plParaCosto) {
      const v = l.campo === 'precio_detalle' ? r.precio_detalle : l.campo === 'precio_mayorista' ? r.precio_mayorista : (r.precio_segundo ?? 0);
      if (Math.round(Number(v) || 0) > 0) precios.push(Math.round(Number(v) || 0));
    }
    if (!precios.length) {
      const b = Math.round(Number(r?.precio_mayorista) || 0);
      const c = Math.round(Number(r?.precio_segundo) || 0);
      if (b > 0 && c > 0) return Math.min(b, c);
      if (b > 0) return b;
      if (c > 0) return c;
      return Math.round(Number(r?.precio_detalle) || 0);
    }
    return Math.min(...precios);
  };

  // Cargar productos desde Appwrite Cloud
  const loadAppwriteProducts = async () => {
    setLoading(true);
    setLoadingGeneral(true);
    setLoadProgress(20);
    try {
      const items = await fetchAllAppwriteErpProducts(true);
      setLoadProgress(60);

      const pRows: ProductRow[] = items.map((item) => ({
        sku: item.sku,
        isAutoSku: item.isAutoSku,
        nombre: item.nombre,
        codigo_barra: item.codigo_barra,
        categoria: item.category,
        stock: item.stock,
        ilimitado: false,
        costo_uni: item.costo_uni,
        precio_venta_1: item.precio_venta_1,
        precio_venta_2: item.precio_venta_2,
        precio_venta_3: item.precio_venta_3,
        updatedAt: Date.now(),
        rowId: item.$id,
      }));

      const prRows = items.map((item) => ({
        sku: item.sku,
        precio_detalle: item.precio_venta_1,
        precio_mayorista: item.precio_venta_2,
        precio_segundo: item.precio_venta_3,
      }));

      const gCosts = items.map((item) => ({
        sku: item.sku,
        nombre: item.nombre,
        costo_uni: item.costo_uni,
      }));

      const sRows = items.map((item) => ({
        sku: item.sku,
        stock: item.stock,
      }));

      setProdRows(pRows);
      setPriceRows(prRows);
      setGeneralCosts(gCosts);
      setStockRows(sRows);
      setLoadProgress(100);
      setMessage(`✅ ${items.length} productos cargados dinámicamente desde Appwrite.`);
    } catch (err: any) {
      console.error('Error cargando de Appwrite:', err);
      setMessage('❌ Error cargando productos de Appwrite: ' + (err?.message || String(err)));
    } finally {
      setLoading(false);
      setLoadingGeneral(false);
      setTimeout(() => setLoadProgress(-1), 1000);
    }
  };

  useEffect(() => {
    loadAppwriteProducts();
  }, [stage, sede]);

  // Guardar Maestro en Appwrite
  const saveMaestro = async () => {
    setLoading(true);
    setMessage('');
    try {
      let total = 0;
      for (const r of prodRows) {
        if (!r.sku) continue;
        await updateAppwriteErpProduct(r.rowId || r.sku, {
          nombre: r.nombre,
          codigo_barra: r.codigo_barra,
          costo_uni: Math.round(r.costo_uni),
          precio_venta_1: Math.round(Number(r.precio_venta_1) || 0),
          precio_venta_2: Math.round(Number(r.precio_venta_2) || 0),
          precio_venta_3: Math.round(Number(r.precio_venta_3) || 0),
        });
        total++;
      }
      setMessage(`✅ Maestro guardado correctamente en Appwrite. (${total} productos)`);
      loadAppwriteProducts();
    } catch (e: any) {
      setMessage('Error guardando Maestro: ' + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  // Guardar Precios en Appwrite
  const savePrecios = async (rows?: Array<{ sku: string; precio_detalle: number; precio_mayorista: number; precio_segundo?: number }>) => {
    setLoading(true);
    setMessage('');
    try {
      let total = 0;
      for (const r of (rows || priceRows)) {
        if (!r.sku) continue;
        const matching = prodRows.find(p => p.sku === r.sku);
        const docId = matching?.rowId || r.sku;
        await updateAppwriteErpProduct(docId, {
          precio_venta_1: Math.round(r.precio_detalle) || 0,
          precio_venta_2: Math.round(r.precio_mayorista) || 0,
          precio_venta_3: Math.round(r.precio_segundo || 0),
        });
        total++;
      }
      setMessage(`✅ Precios guardados correctamente en Appwrite. Total: ${total}.`);
    } catch (e: any) {
      setMessage('Error guardando precios: ' + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  // Guardar Stock en Appwrite
  const saveStock = async () => {
    setLoading(true);
    setMessage('');
    try {
      let total = 0;
      for (const r of stockRows) {
        if (!r.sku) continue;
        const matching = prodRows.find(p => p.sku === r.sku);
        const docId = matching?.rowId || r.sku;
        await updateAppwriteErpProduct(docId, {
          stock: Math.round(r.stock),
        });
        total++;
      }
      setMessage(`✅ Stock guardado correctamente en Appwrite (${total} registros).`);
    } catch (e: any) {
      setMessage('Error guardando Stock: ' + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto de Appwrite
  const deleteProducto = async (sku: string) => {
    if (!sku) return;
    if (!confirm(`¿Eliminar producto ${sku} de Appwrite?`)) return;
    try {
      const matching = prodRows.find(p => p.sku === sku);
      const docId = matching?.rowId || sku;
      await deleteAppwriteErpProduct(docId);
      setProdRows(list => list.filter(r => r.sku !== sku));
      setPriceRows(list => list.filter(r => r.sku !== sku));
      setGeneralCosts(list => list.filter(r => r.sku !== sku));
      setStockRows(list => list.filter(r => r.sku !== sku));
      setMessage(`🗑️ Producto ${sku} eliminado de Appwrite.`);
    } catch (e: any) {
      setMessage('Error eliminando: ' + (e?.message || String(e)));
    }
  };

  // Guardar fila individual de costo
  const saveCostoRow = async (r: ProductRow) => {
    try {
      const sku = String(r.sku || '').trim();
      if (!sku) return;
      const rowId = r.rowId || sku;
      const draft = rowId ? costoDraftByRowIdRef.current[rowId] : undefined;
      const nuevo = Math.round(parseMoney(draft ?? r.costo_uni));

      await updateAppwriteErpProduct(rowId, { costo_uni: nuevo });

      setProdRows(list => list.map(x => (x === r ? { ...x, costo_uni: nuevo } : x)));
      if (rowId) delete costoDraftByRowIdRef.current[rowId];
      setMessage(`Guardado costo: ${sku}`);
    } catch (e: any) {
      setMessage('Error guardando costo: ' + (e?.message || String(e)));
    }
  };

  // Guardar fila individual de precio bajo
  const savePrecioBajoMaestroRow = async (r: ProductRow) => {
    try {
      const sku = String(r?.sku || '').trim();
      if (!sku) return;
      const draft = precioBajoDraftBySkuRef.current[sku];
      const nuevoBajo = Math.round(parseMoney(draft ?? precioMasBajo(r)));

      const v1 = Math.round(Number((r as any)?.precio_venta_1) || 0);
      const v2 = Math.round(Number((r as any)?.precio_venta_2) || 0);
      const nuevoVenta2 = nuevoBajo;
      const nuevoVenta1 = Math.max(v1 > 0 ? v1 : 0, nuevoBajo, v2 > 0 ? v2 : 0);

      const rowId = r.rowId || sku;
      await updateAppwriteErpProduct(rowId, {
        precio_venta_1: Math.round(nuevoVenta1),
        precio_venta_2: Math.round(nuevoVenta2),
      });

      setProdRows(list => list.map(x => x.sku === sku ? { ...x, precio_venta_1: nuevoVenta1, precio_venta_2: nuevoVenta2 } : x));
      setPriceRows(list => list.map(x => x.sku === sku ? { ...x, precio_detalle: nuevoVenta1, precio_mayorista: nuevoVenta2 } : x));

      delete precioBajoDraftBySkuRef.current[sku];
      setMessage(`Guardado precio bajo: ${sku}`);
    } catch (e: any) {
      setMessage('Error guardando precio bajo: ' + (e?.message || String(e)));
    }
  };

  // Parse & Apply Paste Update (Pegado Masivo de Excel / CSV)
  const parsePasteInput = async () => {
    setPasteResult('');
    const raw = String(pasteInput || '').trim();
    if (!raw) {
      setPasteParsed([]);
      setPasteResult('Pega el texto con las columnas primero.');
      return;
    }
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) { setPasteParsed([]); setPasteResult('No hay contenido.'); return; }

    const headerCandidate = lines[0].toLowerCase();
    const hasHeader = headerCandidate.includes('sku') && (headerCandidate.includes('nombre') || headerCandidate.includes('producto'));
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const splitRow = (line: string): string[] => {
      if (line.includes('\t')) return line.split('\t').map(c => c.trim());
      return line.split(/ {2,}/).map(c => c.trim());
    };

    const rows = dataLines.map(splitRow).filter(cols => cols.length >= 2 && String(cols[0] || '').trim());
    if (!rows.length) {
      setPasteParsed([]);
      setPasteResult('No se detectaron filas válidas. Asegúrate de separar las columnas por TAB.');
      return;
    }

    setPasteParsing(true);
    setPasteResult(`Procesando ${rows.length} filas…`);

    const existingSkus = new Set(prodRows.map(p => p.sku.toLowerCase()));
    const stockMap = new Map(stockRows.map(s => [s.sku.toLowerCase(), s.stock]));

    const parsed = rows.map(cols => {
      const sku = String(cols[0] || '').trim();
      const codigo_barra = String(cols[1] || '').trim();
      const nombre = String(cols[2] || '').trim();
      const stock = parseMoney(cols[3] || '0');
      const costo_uni = parseMoney(cols[4] || '0');
      const precio_detalle = parseMoney(cols[5] || '0');
      const precio_mayorista = parseMoney(cols[6] || '0');
      const precio_segundo = parseMoney(cols[7] || '0');

      const existsProduct = existingSkus.has(sku.toLowerCase());
      const currentStock = stockMap.get(sku.toLowerCase()) || 0;

      return {
        sku,
        codigo_barra,
        nombre: nombre || 'Producto Excel',
        stock,
        costo_uni,
        precio_detalle,
        precio_mayorista,
        precio_segundo,
        existsProduct,
        currentStock,
        fechaIngreso: new Date().toISOString().slice(0, 10),
      };
    });

    setPasteParsed(parsed);
    setPasteResult(`${parsed.length} filas detectadas. ${parsed.filter(p => !p.existsProduct).length} nuevos · ${parsed.filter(p => p.existsProduct).length} existentes.`);
    setPasteParsing(false);
  };

  const applyPasteUpdate = async () => {
    if (!pasteParsed.length) return;
    setPasteApplying(true);
    setPasteResult('Sincronizando con Appwrite Cloud…');

    try {
      let newCount = 0;
      let updateCount = 0;

      for (const row of pasteParsed) {
        const existing = prodRows.find(p => p.sku.toLowerCase() === row.sku.toLowerCase());
        if (existing) {
          await updateAppwriteErpProduct(existing.rowId || existing.sku, {
            nombre: row.nombre || existing.nombre,
            codigo_barra: row.codigo_barra || existing.codigo_barra,
            precio_venta_1: row.precio_detalle || existing.precio_venta_1,
            precio_venta_2: row.precio_mayorista || existing.precio_venta_2,
            precio_venta_3: row.precio_segundo || existing.precio_venta_3,
            costo_uni: row.costo_uni || existing.costo_uni,
            stock: row.stock !== undefined ? row.stock : (stockRows.find(s => s.sku === existing.sku)?.stock || 0),
          });
          updateCount++;
        } else {
          await createAppwriteErpProduct({
            sku: row.sku,
            nombre: row.nombre,
            codigo_barra: row.codigo_barra,
            precio_venta_1: row.precio_detalle,
            precio_venta_2: row.precio_mayorista,
            precio_venta_3: row.precio_segundo,
            costo_uni: row.costo_uni,
            stock: row.stock,
          });
          newCount++;
        }
      }

      setPasteResult(`✅ Aplicado en Appwrite: ${newCount} creados · ${updateCount} actualizados.`);
      setPasteInput('');
      setPasteParsed([]);
      loadAppwriteProducts();
    } catch (e: any) {
      setPasteResult('Error aplicando masivo: ' + (e?.message || String(e)));
    } finally {
      setPasteApplying(false);
    }
  };

  const labelForSede = (slug: string) => {
    const branch = configuredBranches.find(b => b.slug === slug);
    return branch?.name || SEDES_LABELS[slug as SedeSlug] || slug;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-content-center bg-slate-900 text-white font-bold text-sm">
        Verificando credenciales de administrador...
      </div>
    );
  }

  if (!isLoggedIn || !isAdminEmail(user?.email)) {
    return null;
  }

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${dark ? 'dark' : ''}`}
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1707209856575-a80b9dff5524?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'rgba(248,250,252,0.88)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)'
      }}>
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(99,102,241,0.12)' }} />
          <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(14,165,233,0.1)', animationDelay: '700ms' }} />
          <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(16,185,129,0.08)', animationDelay: '1200ms' }} />
        </div>
      </div>

      {/* Header */}
      <div className="relative sticky top-0 z-40" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', borderBottom: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-3">
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
            onClick={()=> {
              if (stage === 'choose') {
                if (window.history.length > 1) window.history.back();
                else window.location.assign('/erp-dashboard');
              } else {
                setStage('choose'); setTab('maestro');
              }
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {stage === 'choose' ? 'Inicio ERP' : 'Volver'}
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <h1 className="text-sm font-black text-slate-800 tracking-tight">
            {stage === 'choose' ? 'Base de Datos Appwrite Cloud' : `Inventario de ${labelForSede(sede)}`}
          </h1>
          <div className="grow" />
          {stage !== 'choose' && (
            <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700">{labelForSede(sede)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 py-5">
        {stage === 'choose' && (
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            {/* Sidebar izquierdo: Sucursales + Stats */}
            <div className="lg:w-72 xl:w-80 shrink-0 space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl p-5 border border-white/70 shadow-[0_10px_30px_rgba(15,23,42,0.08)]" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.86))', backdropFilter: 'blur(10px)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Store className="text-indigo-600 h-10 w-10" />
                  <div>
                    <div className="text-sm font-black text-slate-800">Base de Datos</div>
                    <div className="text-[10px] text-slate-400 font-medium">Sincronizada con Appwrite</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '🏬', label: 'Sucursales', val: String(activeBranches.length), color: '#10b981' },
                    { icon: '📦', label: 'Productos', val: generalCosts.length > 0 ? generalCosts.length.toLocaleString() : '—', color: '#8b5cf6' },
                    { icon: '💰', label: 'Con costo', val: generalCosts.filter(r => Math.round(r.costo_uni) > 0).length.toLocaleString(), color: '#3b82f6' },
                    { icon: '⚠️', label: 'Sin costo', val: generalCosts.filter(r => Math.round(r.costo_uni) <= 0).length.toLocaleString(), color: '#f59e0b' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-lg px-2.5 py-2 transition-transform duration-200 hover:-translate-y-0.5" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px]">{s.icon}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: `${s.color}aa` }}>{s.label}</span>
                      </div>
                      <div className="text-sm font-black" style={{ color: s.color, lineHeight: 1 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de sucursales */}
              <div className="rounded-2xl overflow-hidden border border-white/70 shadow-[0_10px_30px_rgba(15,23,42,0.08)]" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))', backdropFilter: 'blur(10px)' }}>
                <div className="px-4 py-3 border-b border-slate-100/80 flex items-center gap-2" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))' }}>
                  <Store className="h-4 w-4 text-indigo-500" />
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Sucursales</span>
                  <span className="text-[9px] font-bold text-slate-400 ml-auto">{activeBranches.length} activas</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {configuredBranches.map((branch) => (
                    <button
                      key={branch.slug}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 group"
                      onClick={() => { setSede(branch.slug as SedeSlug); setStage('sede'); setTab('stock'); setSearch(''); }}
                    >
                      <div className="h-9 w-9 rounded-xl grid place-content-center text-base shrink-0 bg-indigo-50 border border-indigo-100">
                        {branch.icon || '🏬'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate">{branch.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{branch.slug}</div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl overflow-hidden border border-white/70 shadow-[0_14px_40px_rgba(15,23,42,0.1)]" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))', backdropFilter: 'blur(10px)' }}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                      <Package className="text-indigo-600" size={20} /> Catálogo de Productos y Precios en Appwrite
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Gestión sincronizada Web & POS de precios y stock.</p>
                  </div>
                  <button onClick={loadAppwriteProducts} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refrescar
                  </button>
                </div>

                <div className="p-4">
                  {/* Pestañas internas */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setTab('maestro')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === 'maestro' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      Maestro
                    </button>
                    <button onClick={() => setTab('precios')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === 'precios' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      Precios Web/POS (3 Niveles)
                    </button>
                    <button onClick={() => setTab('stock')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === 'stock' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      Stock
                    </button>
                    <button onClick={() => setTab('paste')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === 'paste' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700'}`}>
                      Carga Masiva Excel
                    </button>
                  </div>

                  {message && (
                    <div className="mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold">
                      {message}
                    </div>
                  )}

                  {tab === 'maestro' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">SKU</th>
                            <th className="p-2.5">Código Barra</th>
                            <th className="p-2.5">Nombre Producto</th>
                            <th className="p-2.5 text-center">Stock Appwrite</th>
                            <th className="p-2.5 text-right">Costo</th>
                            <th className="p-2.5 text-right">P1 (Web)</th>
                            <th className="p-2.5 text-right">P2 (Mayor)</th>
                            <th className="p-2.5 text-right">P3 (Emp)</th>
                            <th className="p-2.5 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {prodRows.map((r) => (
                            <tr key={r.rowId || r.sku} className="hover:bg-slate-50">
                              <td className="p-2.5 font-mono font-bold text-indigo-600">
                                <div className="flex items-center gap-1.5">
                                  <span>{r.sku}</span>
                                  {r.isAutoSku && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300" title="SKU Generado Automáticamente">
                                      AUTO
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 font-mono">{r.codigo_barra || '—'}</td>
                              <td className="p-2.5 font-bold text-slate-800">{r.nombre}</td>
                              <td className="p-2.5 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${ (r.stock || 0) <= 5 ? 'bg-rose-100 text-rose-700 font-black' : 'bg-emerald-100 text-emerald-800'}`}>
                                  {r.stock || 0}
                                </span>
                              </td>
                              <td className="p-2.5 text-right">${r.costo_uni.toLocaleString()}</td>
                              <td className="p-2.5 text-right font-bold text-emerald-700">${(r.precio_venta_1 || 0).toLocaleString()}</td>
                              <td className="p-2.5 text-right font-bold text-indigo-700">${(r.precio_venta_2 || 0).toLocaleString()}</td>
                              <td className="p-2.5 text-right font-bold text-purple-700">${(r.precio_venta_3 || 0).toLocaleString()}</td>
                              <td className="p-2.5 text-center">
                                <button onClick={() => deleteProducto(r.sku)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {tab === 'precios' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">SKU</th>
                            <th className="p-2.5">Nombre</th>
                            <th className="p-2.5 text-right">P1 Detalle/Web</th>
                            <th className="p-2.5 text-right">P2 Mayorista</th>
                            <th className="p-2.5 text-right">P3 Emprendedor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {priceRows.map((r) => (
                            <tr key={r.sku} className="hover:bg-slate-50">
                              <td className="p-2.5 font-mono font-bold text-indigo-600">{r.sku}</td>
                              <td className="p-2.5 font-bold text-slate-800">{prodRows.find(p => p.sku === r.sku)?.nombre || '—'}</td>
                              <td className="p-2.5 text-right">
                                <input type="number" defaultValue={r.precio_detalle} onBlur={(e) => updateAppwriteErpProduct(r.sku, { precio_venta_1: parseMoney(e.target.value) })} className="w-24 px-2 py-1 border border-emerald-300 rounded text-right font-bold text-emerald-800 bg-emerald-50/50" />
                              </td>
                              <td className="p-2.5 text-right">
                                <input type="number" defaultValue={r.precio_mayorista} onBlur={(e) => updateAppwriteErpProduct(r.sku, { precio_venta_2: parseMoney(e.target.value) })} className="w-24 px-2 py-1 border border-indigo-300 rounded text-right font-bold text-indigo-800 bg-indigo-50/50" />
                              </td>
                              <td className="p-2.5 text-right">
                                <input type="number" defaultValue={r.precio_segundo} onBlur={(e) => updateAppwriteErpProduct(r.sku, { precio_venta_3: parseMoney(e.target.value) })} className="w-24 px-2 py-1 border border-purple-300 rounded text-right font-bold text-purple-800 bg-purple-50/50" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {tab === 'stock' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">SKU</th>
                            <th className="p-2.5">Nombre</th>
                            <th className="p-2.5 text-center">Stock Appwrite</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {stockRows.map((r) => (
                            <tr key={r.sku} className="hover:bg-slate-50">
                              <td className="p-2.5 font-mono font-bold text-indigo-600">{r.sku}</td>
                              <td className="p-2.5 font-bold text-slate-800">{prodRows.find(p => p.sku === r.sku)?.nombre || '—'}</td>
                              <td className="p-2.5 text-center">
                                <input type="number" defaultValue={r.stock} onBlur={(e) => updateAppwriteErpProduct(r.sku, { stock: Number(e.target.value) })} className="w-20 px-2 py-1 border border-slate-300 rounded text-center font-bold bg-white" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {tab === 'paste' && (
                    <div className="space-y-4">
                      <textarea
                        rows={6}
                        placeholder={'Sku\tCódigo Barra\tNombre Producto\tStock\tCosto neto unit.\tARGENTINOS\tPRECIO POR MAYOR\tSEGUNDO PRECIO\nIDBCHEN489\tSKU 2143\tTERMO VACUUM 1000 ML\t196\t2500\t0\t3500\t3000'}
                        value={pasteInput}
                        onChange={(e) => setPasteInput(e.target.value)}
                        className="w-full p-3 border border-purple-200 rounded-xl font-mono text-xs bg-purple-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex gap-2">
                        <button onClick={parsePasteInput} disabled={pasteParsing} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition">
                          {pasteParsing ? 'Procesando…' : '🔍 Parsear Filas'}
                        </button>
                      </div>
                      {pasteResult && <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">{pasteResult}</div>}
                      {pasteParsed.length > 0 && (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <div className="bg-slate-100 p-3 font-bold text-xs flex justify-between items-center">
                            <span>Previsualización ({pasteParsed.length} filas)</span>
                            <button onClick={applyPasteUpdate} disabled={pasteApplying} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                              {pasteApplying ? 'Guardando en Appwrite…' : '🚀 Aplicar a Appwrite'}
                            </button>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                                <tr>
                                  <th className="p-2">Acción</th>
                                  <th className="p-2">SKU</th>
                                  <th className="p-2">Nombre</th>
                                  <th className="p-2 text-center">Stock</th>
                                  <th className="p-2 text-right">P1</th>
                                  <th className="p-2 text-right">P2</th>
                                  <th className="p-2 text-right">P3</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium">
                                {pasteParsed.map((r, i) => (
                                  <tr key={i}>
                                    <td className="p-2">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.existsProduct ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                        {r.existsProduct ? 'Actualizar' : 'Nuevo'}
                                      </span>
                                    </td>
                                    <td className="p-2 font-mono font-bold text-indigo-600">{r.sku}</td>
                                    <td className="p-2">{r.nombre}</td>
                                    <td className="p-2 text-center font-bold">{r.stock}</td>
                                    <td className="p-2 text-right text-emerald-700 font-bold">${r.precio_detalle.toLocaleString()}</td>
                                    <td className="p-2 text-right text-indigo-700 font-bold">${r.precio_mayorista.toLocaleString()}</td>
                                    <td className="p-2 text-right text-purple-700 font-bold">${r.precio_segundo.toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
