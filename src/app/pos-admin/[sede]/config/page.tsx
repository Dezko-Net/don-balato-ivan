'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Settings, Save, CheckCircle, AlertCircle, Tag, ToggleLeft, ToggleRight, Loader2, ShoppingBag, UserCheck, Globe, MapPin } from 'lucide-react';
import { getServices } from '@/lib/appwrite-admin';
import { Query } from 'appwrite';

import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

type ModoVentaPOS = 'cajera_cobra' | 'jefe_cobra';

export interface PriceListItem {
  campo: string;
  nombre: string;
  activa: boolean;
  esExclusiva: boolean;
}

const inputCls = 'w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const ERP_CONFIG_COLLECTION = 'erp_config';

export default function PosAdminConfigPage() {
  const params = useParams<{ sede: string }>();
  const sedeSlug = (params?.sede || 'chacabuco-08').trim();

  // --- Datos empresa ---
  const [nombreEmpresa, setNombreEmpresa] = useState('3B Chile');
  const [rut, setRut] = useState('');
  const [giro, setGiro] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [qrFalsoEnBoleta, setQrFalsoEnBoleta] = useState(false);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);
  const [savingEmpresa, setSavingEmpresa] = useState(false);

  // --- Modo de venta POS ---
  const [modoVentaGlobal, setModoVentaGlobal] = useState<ModoVentaPOS>('cajera_cobra');
  const [modoVentaSedeOverride, setModoVentaSedeOverride] = useState<ModoVentaPOS | null>(null);
  const [savingModoVenta, setSavingModoVenta] = useState(false);

  // --- Listas de precios ---
  const [listas, setListas] = useState<PriceListItem[]>([
    { campo: 'precio_detalle', nombre: 'Detalle / Web', activa: true, esExclusiva: false },
    { campo: 'precio_mayorista', nombre: 'Mayorista', activa: true, esExclusiva: false },
    { campo: 'precio_segundo', nombre: 'Emprendedor', activa: true, esExclusiva: false },
  ]);
  const [savingPrecios, setSavingPrecios] = useState(false);

  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Cargar datos empresa desde API server
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/admin-supreme/load-config');
        const json = await res.json();

        if (json.ok && json.data && active) {
          const parsed = JSON.parse(json.data || '{}');
          if (parsed.empresa) {
            const emp = parsed.empresa;
            setNombreEmpresa(emp.nombreEmpresa || '3B Chile');
            setRut(emp.rut || '');
            setGiro(emp.giro || '');
            setDireccion(emp.direccion || '');
            setTelefono(emp.telefono || '');
            setEmail(emp.email || '');
            setQrFalsoEnBoleta(emp.qrFalsoEnBoleta || false);
            if (emp.modoVentaPOS) setModoVentaGlobal(emp.modoVentaPOS);
          }
          if (parsed.listasPrecios && Array.isArray(parsed.listasPrecios)) {
            setListas(parsed.listasPrecios);
          }
          if (parsed.overrides && parsed.overrides[sedeSlug]) {
            setModoVentaSedeOverride(parsed.overrides[sedeSlug].modoVentaPOS || null);
          }
        }
      } catch (err) {
        console.error('Error cargando configuración POS:', err);
      } finally {
        if (active) setLoadingEmpresa(false);
      }
    })();
    return () => { active = false; };
  }, [sedeSlug]);

  const updateConfigInAppwrite = async (patch: (current: any) => any) => {
    const resLoad = await fetch('/api/admin-supreme/load-config');
    const jsonLoad = await resLoad.json();
    let currentData = {};
    if (jsonLoad.ok && jsonLoad.data) {
      currentData = JSON.parse(jsonLoad.data || '{}');
    }

    const updatedData = patch(currentData);
    const jsonStr = JSON.stringify(updatedData);

    const resSave = await fetch('/api/admin-supreme/save-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: jsonStr }),
    });

    const jsonSave = await resSave.json();
    if (!jsonSave.ok) {
      throw new Error(jsonSave.error || 'Error guardando configuración en servidor');
    }
  };

  const handleSaveEmpresa = async () => {
    setSavingEmpresa(true);
    try {
      await updateConfigInAppwrite((curr) => ({
        ...curr,
        empresa: {
          nombreEmpresa,
          rut,
          giro,
          direccion,
          telefono,
          email,
          qrFalsoEnBoleta,
          modoVentaPOS: modoVentaGlobal,
        },
      }));
      showToast('ok', 'Datos de empresa guardados en Appwrite');
    } catch (e: any) {
      showToast('err', 'Error: ' + (e?.message || String(e)));
    } finally {
      setSavingEmpresa(false);
    }
  };

  const handleSaveModoVenta = async (modo: ModoVentaPOS, replicarATodas: boolean) => {
    setSavingModoVenta(true);
    try {
      if (replicarATodas) {
        await updateConfigInAppwrite((curr) => ({
          ...curr,
          empresa: {
            ...(curr.empresa || {}),
            modoVentaPOS: modo,
          },
          overrides: {
            ...(curr.overrides || {}),
            [sedeSlug]: { modoVentaPOS: null },
          },
        }));
        if (db) {
          await setDoc(doc(db, 'config_pos', 'empresa'), { modoVentaPOS: modo }, { merge: true }).catch(() => {});
          await setDoc(doc(db, 'config_pos', `sede_${sedeSlug}`), { modoVentaPOS: null }, { merge: true }).catch(() => {});
        }
        setModoVentaGlobal(modo);
        setModoVentaSedeOverride(null);
        showToast('ok', 'Modo de cobro aplicado a TODAS las sucursales');
      } else {
        await updateConfigInAppwrite((curr) => ({
          ...curr,
          overrides: {
            ...(curr.overrides || {}),
            [sedeSlug]: { modoVentaPOS: modo },
          },
        }));
        if (db) {
          await setDoc(doc(db, 'config_pos', `sede_${sedeSlug}`), { modoVentaPOS: modo }, { merge: true }).catch(() => {});
        }
        setModoVentaSedeOverride(modo);
        showToast('ok', `Modo aplicado únicamente a la sucursal [${sedeSlug}]`);
      }
    } catch (e: any) {
      showToast('err', 'Error: ' + (e?.message || String(e)));
    } finally {
      setSavingModoVenta(false);
    }
  };

  const handleVolverAlGlobal = async () => {
    setSavingModoVenta(true);
    try {
      await updateConfigInAppwrite((curr) => ({
        ...curr,
        overrides: {
          ...(curr.overrides || {}),
          [sedeSlug]: { modoVentaPOS: null },
        },
      }));
      if (db) {
        await setDoc(doc(db, 'config_pos', `sede_${sedeSlug}`), { modoVentaPOS: null }, { merge: true }).catch(() => {});
      }
      setModoVentaSedeOverride(null);
      showToast('ok', 'Esta sucursal ahora vuelve al modo global');
    } catch (e: any) {
      showToast('err', 'Error: ' + (e?.message || String(e)));
    } finally {
      setSavingModoVenta(false);
    }
  };

  const modoVentaEfectivo: ModoVentaPOS = modoVentaSedeOverride ?? modoVentaGlobal;

  const handleSavePrecios = async () => {
    setSavingPrecios(true);
    try {
      await updateConfigInAppwrite((curr) => ({
        ...curr,
        listasPrecios: listas,
      }));
      showToast('ok', 'Listas de precios actualizadas en Appwrite');
    } catch (e: any) {
      showToast('err', 'Error: ' + (e?.message || String(e)));
    } finally {
      setSavingPrecios(false);
    }
  };

  const updateLista = (index: number, field: keyof PriceListItem, value: any) => {
    setListas(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  if (loadingEmpresa) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2 text-indigo-600" /> Cargando configuración del POS...
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración General POS ({sedeSlug})</h1>
        <p className="text-sm text-gray-500 mt-1">Datos de la empresa, boletas y configuración de listas de precios.</p>
      </div>

      {/* Datos de la empresa */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-200">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Settings size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm sm:text-base">Datos de la empresa</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Información para boletas y comprobantes de venta</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block font-medium">Nombre empresa</label>
            <input type="text" value={nombreEmpresa} onChange={e => setNombreEmpresa(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block font-medium">RUT empresa</label>
            <input type="text" value={rut} onChange={e => setRut(e.target.value)} placeholder="76.123.456-7" className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block font-medium">Giro</label>
            <input type="text" value={giro} onChange={e => setGiro(e.target.value)} placeholder="Venta al detalle" className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block font-medium">Teléfono</label>
            <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+56 9 1234 5678" className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contacto@empresa.cl" className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block font-medium">Dirección</label>
            <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Dirección sucursal" className={inputCls} />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setQrFalsoEnBoleta(!qrFalsoEnBoleta)} className="shrink-0">
              {qrFalsoEnBoleta
                ? <ToggleRight size={32} className="text-green-500" />
                : <ToggleLeft size={32} className="text-gray-300" />
              }
            </button>
            <div>
              <div className="text-sm font-semibold text-gray-900">QR en boleta de compra</div>
              <div className="text-xs text-gray-500">Muestra un código QR de verificación en los comprobantes del POS</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button onClick={handleSaveEmpresa} disabled={savingEmpresa}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm disabled:opacity-50">
            {savingEmpresa ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar datos empresa
          </button>
        </div>
      </div>

      {/* Modo de venta POS */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-200">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <ShoppingBag size={18} className="text-amber-600" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm sm:text-base">Modo de cobro del POS</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Define la modalidad de cobro para la sucursal [{sedeSlug}]</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500">Modo activo en esta sucursal:</span>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${
            modoVentaEfectivo === 'jefe_cobra' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {modoVentaEfectivo === 'jefe_cobra' ? <UserCheck size={12} /> : <ShoppingBag size={12} />}
            {modoVentaEfectivo === 'jefe_cobra' ? 'Jefe cobra (con pre-venta)' : 'Cajera cobra directo'}
          </span>
          {modoVentaSedeOverride !== null ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
              <MapPin size={12} /> Override en esta sucursal
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">
              <Globe size={12} /> Heredado del global
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Opción 1: Cajera cobra */}
          <div className={`border-2 rounded-xl p-4 transition ${
            modoVentaEfectivo === 'cajera_cobra' ? 'border-emerald-400 bg-emerald-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}>
            <div className="flex items-start gap-2 mb-2">
              <ShoppingBag size={18} className={modoVentaEfectivo === 'cajera_cobra' ? 'text-emerald-600' : 'text-gray-400'} />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">Cajera cobra directo</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Por defecto. La cajera procesa el pago al finalizar la venta y descuenta stock.</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-3">
              <button
                onClick={() => handleSaveModoVenta('cajera_cobra', true)}
                disabled={savingModoVenta}
                className="text-[11px] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg px-3 py-1.5 font-semibold flex items-center justify-center gap-1.5"
              >
                <Globe size={12} /> Aplicar a TODAS las sucursales
              </button>
              <button
                onClick={() => handleSaveModoVenta('cajera_cobra', false)}
                disabled={savingModoVenta}
                className="text-[11px] bg-white border border-emerald-300 hover:bg-emerald-50 disabled:opacity-50 text-emerald-700 rounded-lg px-3 py-1.5 font-semibold flex items-center justify-center gap-1.5"
              >
                <MapPin size={12} /> Solo en esta sucursal
              </button>
            </div>
          </div>

          {/* Opción 2: Jefe cobra */}
          <div className={`border-2 rounded-xl p-4 transition ${
            modoVentaEfectivo === 'jefe_cobra' ? 'border-amber-400 bg-amber-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}>
            <div className="flex items-start gap-2 mb-2">
              <UserCheck size={18} className={modoVentaEfectivo === 'jefe_cobra' ? 'text-amber-600' : 'text-gray-400'} />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">Jefe cobra (con pre-venta)</div>
                <div className="text-[11px] text-gray-500 mt-0.5">La cajera arma la venta e imprime una boleta de pre-venta. Un usuario JEFE recibe, cobra y emite boleta.</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-3">
              <button
                onClick={() => handleSaveModoVenta('jefe_cobra', true)}
                disabled={savingModoVenta}
                className="text-[11px] bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg px-3 py-1.5 font-semibold flex items-center justify-center gap-1.5"
              >
                <Globe size={12} /> Aplicar a TODAS las sucursales
              </button>
              <button
                onClick={() => handleSaveModoVenta('jefe_cobra', false)}
                disabled={savingModoVenta}
                className="text-[11px] bg-white border border-amber-300 hover:bg-amber-50 disabled:opacity-50 text-amber-700 rounded-lg px-3 py-1.5 font-semibold flex items-center justify-center gap-1.5"
              >
                <MapPin size={12} /> Solo en esta sucursal
              </button>
            </div>
          </div>
        </div>

        {modoVentaSedeOverride !== null && (
          <div className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <div className="text-xs text-blue-800">
              Esta sucursal tiene un modo personalizado ({modoVentaSedeOverride === 'jefe_cobra' ? 'Jefe cobra' : 'Cajera cobra'}).
            </div>
            <button
              onClick={handleVolverAlGlobal}
              disabled={savingModoVenta}
              className="shrink-0 text-[11px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-3 py-1.5 font-semibold"
            >
              Volver al modo global
            </button>
          </div>
        )}

        {savingModoVenta && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 size={12} className="animate-spin" /> Guardando en Appwrite...
          </div>
        )}
      </div>

      {/* Listas de Precios */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-200">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
            <Tag size={18} className="text-purple-600" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm sm:text-base">Listas de Precios del POS</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Configura nombres y activa o desactiva listas.</div>
          </div>
        </div>

        <div className="space-y-4">
          {listas.map((l, i) => (
            <div key={i} className={`rounded-xl border p-4 transition ${l.activa ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <button onClick={() => updateLista(i, 'activa', !l.activa)} className="shrink-0" title={l.activa ? 'Desactivar' : 'Activar'}>
                  {l.activa
                    ? <ToggleRight size={32} className="text-emerald-500" />
                    : <ToggleLeft size={32} className="text-gray-300" />
                  }
                </button>

                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Nombre de la lista</label>
                  <input
                    type="text"
                    value={l.nombre}
                    onChange={e => updateLista(i, 'nombre', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none text-sm font-semibold text-gray-900 py-1"
                  />
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Campo Base de Datos</div>
                  <div className="text-xs font-mono text-gray-500">{l.campo}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={l.esExclusiva}
                  onChange={e => updateLista(i, 'esExclusiva', e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-500">
                  Precio exclusivo (no se usa para comparar con costo)
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-400">
            Las listas desactivadas se ocultan de las cajeras pero mantienen sus datos en la base de datos.
          </p>
          <button onClick={handleSavePrecios} disabled={savingPrecios}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm disabled:opacity-50">
            {savingPrecios ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar listas de precio
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold z-50 border ${
          toast.type === 'ok' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'ok' ? <CheckCircle size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-600" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
