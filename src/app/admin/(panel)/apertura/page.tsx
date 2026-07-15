'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Save, RefreshCw } from 'lucide-react';
import { getServices, getAppwriteConfig, APERTURA_SETTINGS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Query, ID } from 'appwrite';

const FF = '"DM Sans",system-ui,sans-serif';
const PINK = '#e396bf';

export default function AperturaPage() {
  const [isActive, setIsActive] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minPurchase, setMinPurchase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const res = await databases.listDocuments(databaseId, APERTURA_SETTINGS_COLLECTION_ID, [Query.limit(1)]);
      
      if (res.documents.length > 0) {
        const settings = res.documents[0] as any;
        setIsActive(settings.isActive ?? true);
        setDiscountPercent(settings.discountPercent || 10);
        setMinPurchase(settings.minPurchase || 0);
      }
    } catch (e: any) {
      // If collection doesn't exist, just use defaults
      console.error('Error loading settings (collection may not exist yet):', e.message);
      setIsActive(true);
      setDiscountPercent(10);
      setMinPurchase(0);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      // Check if we're disabling the promotion
      const existing = await databases.listDocuments(databaseId, APERTURA_SETTINGS_COLLECTION_ID, [Query.limit(1)]);
      const wasActive = existing.documents.length > 0 ? (existing.documents[0] as any).isActive : false;
      
      const settings = {
        isActive,
        discountPercent,
        minPurchase,
        updatedAt: new Date().toISOString()
      };
      
      if (existing.documents.length > 0) {
        // Update existing document
        await databases.updateDocument(databaseId, APERTURA_SETTINGS_COLLECTION_ID, existing.documents[0].$id, settings);
        await fetch('/api/revalidate?tag=apertura_settings');
        
        // If disabling promotion, remove coupon from all auth users' prefs (server API)
        if (wasActive && !isActive) {
          try {
            const clearRes = await fetch('/api/admin/apertura/clear-coupons', { method: 'POST' });
            const clearData = await clearRes.json().catch(() => ({}));
            if (!clearRes.ok || !clearData.ok) {
              throw new Error(clearData.error || clearData.message || 'No se pudieron limpiar los cupones');
            }
            alert(`Configuración guardada. Cupón eliminado de ${clearData.removedCount ?? 0} usuarios.`);
          } catch (e) {
            console.error('Error removing coupons from users:', e);
            alert('Configuración guardada. Error al eliminar cupón de usuarios: ' + (e instanceof Error ? e.message : String(e)));
          }
        } else {
          alert('Configuración guardada exitosamente');
        }
      } else {
        // Create new document
        await databases.createDocument(databaseId, APERTURA_SETTINGS_COLLECTION_ID, ID.unique(), {
          ...settings,
          createdAt: new Date().toISOString()
        });
        await fetch('/api/revalidate?tag=apertura_settings');
        alert('Configuración guardada exitosamente');
      }
    } catch (e) {
      console.error('Error saving settings:', e);
      alert('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontFamily: FF }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #fce7f3', borderTopColor: PINK, animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FF }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          Promoción de Apertura
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
          Configura el descuento de bienvenida para nuevos usuarios
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #fce7f3', boxShadow: '0 4px 24px rgba(227,150,191,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #fce7f3' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#e396bf,#f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
              Descuento de Bienvenida
            </h2>
            <p style={{ margin: 4, fontSize: 13, color: '#6b7280' }}>
              Se aplica automáticamente a nuevos usuarios al reclamar su regalo
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          {/* Toggle Activo/Inactivo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, background: '#fdf2f8', borderRadius: 12 }}>
            <div>
              <label style={{ fontSize: 15, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 4 }}>
                Estado de la Promoción
              </label>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                {isActive ? 'La promoción está activa para todos los usuarios' : 'La promoción está desactivada'}
              </p>
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              style={{
                width: 56, height: 32, borderRadius: 999, border: 'none', cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg,#e396bf,#f43f5e)' : '#e5e7eb',
                position: 'relative', transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 4, left: isActive ? 28 : 4,
                transition: 'left 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }} />
            </button>
          </div>

          {/* Porcentaje de descuento */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>
              Porcentaje de Descuento
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                min={0}
                max={100}
                style={{
                  width: 120, padding: '12px 16px', borderRadius: 10, border: '1.5px solid #fce7f3',
                  fontSize: 16, fontWeight: 700, color: '#111', outline: 'none', fontFamily: FF
                }}
              />
              <span style={{ fontSize: 18, fontWeight: 700, color: PINK }}>%</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#9ca3af' }}>
              Porcentaje de descuento que se aplica al subtotal del pedido
            </p>
          </div>

          {/* Monto mínimo */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>
              Monto Mínimo de Compra
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>$</span>
              <input
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(Number(e.target.value))}
                min={0}
                step={1000}
                style={{
                  width: 200, padding: '12px 16px', borderRadius: 10, border: '1.5px solid #fce7f3',
                  fontSize: 16, fontWeight: 700, color: '#111', outline: 'none', fontFamily: FF
                }}
              />
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#9ca3af' }}>
              Monto mínimo antes del descuento (ej: $62.500 para que quede $50.000 con 20% de descuento)
            </p>
          </div>

          {/* Botón Guardar */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button
              onClick={saveSettings}
              disabled={saving}
              style={{
                flex: 1, padding: 16, borderRadius: 12, border: 'none',
                background: saving ? '#9ca3af' : 'linear-gradient(135deg,#e396bf,#f43f5e)',
                color: '#fff', fontSize: 14, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(227,150,191,0.3)'
              }}
            >
              {saving ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Configuración
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
