'use client';

import { useState, useEffect } from 'react';
import { Store, Phone, Mail, MapPin, Globe, Save, Loader2, Eye, EyeOff, Sparkles, Building2, MessageSquare, ToggleLeft, ToggleRight, ArrowRightLeft, AlertTriangle, CheckCircle, Database, RefreshCw } from 'lucide-react';
import { getServices, DATABASE_ID } from '@/lib/appwrite-admin';
import { Query, ID } from 'appwrite';

interface StoreSettings {
  $id?: string;
  storeName: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  description: string;
  showInAnnouncementBar: boolean;
}

/* ─── Reusable Field Component ─── */
function Field({ icon, label, hint, value, onChange, placeholder, type = 'text', multiline = false }: {
  icon: React.ReactNode; label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; multiline?: boolean;
}) {
  const id = label.replace(/\s+/g, '-');
  return (
    <div style={{ position: 'relative' }}>
      <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <span style={{ display: 'flex', alignItems: 'center', color: '#5850ec' }}>{icon}</span>
        {label}
      </label>
      {hint && <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>{hint}</div>}
      {multiline ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{
          width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, resize: 'vertical',
          background: '#fafafa', transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none', fontFamily: 'inherit',
        }} onFocus={e => { e.currentTarget.style.borderColor = '#5850ec'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(88,80,236,0.1)'; e.currentTarget.style.background = '#fff'; }} onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#fafafa'; }} />
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
          width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14,
          background: '#fafafa', transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none',
        }} onFocus={e => { e.currentTarget.style.borderColor = '#5850ec'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(88,80,236,0.1)'; e.currentTarget.style.background = '#fff'; }} onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#fafafa'; }} />
      )}
    </div>
  );
}

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings & { unlimitedStock: boolean }>({
    storeName: '', phone: '', email: '', address: '', website: '', description: '', showInAnnouncementBar: false, unlimitedStock: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Migration states
  const [migrating, setMigrating] = useState(false);
  const [migrationSuccess, setMigrationSuccess] = useState('');
  const [migrationError, setMigrationError] = useState('');
  const [migrationProgress, setMigrationProgress] = useState<{ total: number; done: number; copied: number; deleted: number } | null>(null);
  const [catalogCount, setCatalogCount] = useState<number | null>(null);

  useEffect(() => { loadSettings(); }, []);

  useEffect(() => {
    if (settings.$id) {
      fetchCatalogCount();
    }
  }, [settings.$id]);

  async function fetchCatalogCount() {
    try {
      const { databases } = getServices();
      const response = await databases.listDocuments(DATABASE_ID, 'catalog_products', [Query.limit(1)]);
      setCatalogCount(response.total);
    } catch (err) {
      console.error('Error fetching catalog count:', err);
    }
  }

  async function loadSettings() {
    try {
      const { databases } = getServices();
      const response = await databases.listDocuments(DATABASE_ID, 'store_settings', [Query.limit(1)]);
      if (response.documents.length > 0) {
        const doc = response.documents[0];
        setSettings({
          $id: doc.$id, storeName: doc.STORENAME || '', phone: doc.PHONE || '', email: doc.EMAIL || '',
          address: doc.ADDRESS || '', website: doc.WEBSITE || '', description: doc.DESCRIPTION || '',
          showInAnnouncementBar: doc.SHOWINANNOUNCEMENTBAR ?? false,
          unlimitedStock: doc.UNLIMITEDSTOCK ?? false,
        });
      }
    } catch (error) { console.error('Error loading settings:', error); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true); setMessage(null);
    try {
      const { databases } = getServices();
      const data = {
        STORENAME: settings.storeName, PHONE: settings.phone, EMAIL: settings.email,
        ADDRESS: settings.address, WEBSITE: settings.website, DESCRIPTION: settings.description,
        SHOWINANNOUNCEMENTBAR: settings.showInAnnouncementBar,
        UNLIMITEDSTOCK: settings.unlimitedStock,
      };
      if (settings.$id) {
        await databases.updateDocument(DATABASE_ID, 'store_settings', settings.$id, data);
      } else {
        const doc = await databases.createDocument(DATABASE_ID, 'store_settings', 'unique()', data);
        setSettings({ ...settings, $id: doc.$id });
      }

      // Dispatch update event to invalidate frontend cache
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('store-settings-updated'));
      }

      setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message || 'Error al guardar la configuración' });
    } finally { setSaving(false); }
  }

  const executeWithRetry = async (fn: () => Promise<any>, maxRetries = 5, initialDelay = 1500) => {
    let retries = 0;
    let delay = initialDelay;
    while (true) {
      try {
        return await fn();
      } catch (err: any) {
        if (err.code === 429 && retries < maxRetries) {
          console.warn(`Rate limit hit (429). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
          delay *= 2;
        } else {
          throw err;
        }
      }
    }
  };

  const COPY_KEYS = [
    'NAME', 'DESCRIPTION', 'PRICE', 'CURRENTPRICE', 'COST', 'STOCK',
    'SOLDQUANTITY', 'CATEGORYID', 'SUBCATEGORYID', 'IMAGEURL', 'IMAGEURL2', 'IMAGEURL3',
    'RATING', 'NUMREVIEWS', 'WHOLESALEPRICE',
    'WHOLESALEMINQUANTITY', 'ISFEATURED', 'ISACTIVE', 'PACKQTY', 'RESTOCKTHRESHOLD',
    'jumpseller_id', 'section', 'sku', 'barcode', 'COMING_SOON', 'DATE_ADDED',
    'TAGS', 'FEATURES',
  ];

  async function runMigration() {
    if (!confirm('¿Estás seguro de que deseas migrar todos los productos de catálogo a la tienda? Esto creará/actualizará los productos en la colección "products" con stock ilimitado (99999) y los eliminará de "catalog_products".')) return;

    setMigrating(true);
    setMigrationError('');
    setMigrationSuccess('');
    setMigrationProgress({ total: 0, done: 0, copied: 0, deleted: 0 });

    try {
      const { databases } = getServices();

      // 1. Fetch all catalog_products
      const allDocs: any[] = [];
      let offset = 0;
      while (true) {
        const res = await databases.listDocuments(DATABASE_ID, 'catalog_products', [
          Query.limit(500), Query.offset(offset),
        ]);
        allDocs.push(...res.documents);
        if (res.documents.length < 500) break;
        offset += 500;
      }

      setMigrationProgress(p => ({ ...p!, total: allDocs.length }));

      let done = 0;
      let copied = 0;
      let deleted = 0;

      // 2. Copy each to products (setting stock to 99999)
      for (const doc of allDocs) {
        try {
          const productData: any = {};
          for (const key of COPY_KEYS) {
            if (doc[key] !== undefined && doc[key] !== null) {
              productData[key] = doc[key];
            }
          }
          // Force stock to 99999 for unlimited stock
          productData.STOCK = 99999;
          productData.ISACTIVE = doc.ISACTIVE !== false;

          // If there is an ORIGINAL_PRODUCT_ID reference, try to restore with that document ID
          const targetDocId = doc.ORIGINAL_PRODUCT_ID || doc.$id || 'unique()';

          // Check if document already exists in products
          let exists = false;
          try {
            await databases.getDocument(DATABASE_ID, 'products', targetDocId);
            exists = true;
          } catch {}

          if (exists) {
            // Update existing
            await executeWithRetry(() =>
              databases.updateDocument(DATABASE_ID, 'products', targetDocId, {
                ...productData,
              })
            );
          } else {
            // Create new
            await executeWithRetry(() =>
              databases.createDocument(DATABASE_ID, 'products', targetDocId, productData)
            );
          }

          copied++;
        } catch (err: any) {
          console.error(`Error copying ${doc.NAME}:`, err.message);
        }
        done++;
        setMigrationProgress(p => ({ ...p!, done, copied, deleted }));
        await new Promise(r => setTimeout(r, 60));
      }

      // 3. Delete from catalog_products
      done = 0;
      for (const doc of allDocs) {
        try {
          await executeWithRetry(() =>
            databases.deleteDocument(DATABASE_ID, 'catalog_products', doc.$id)
          );
          deleted++;
        } catch (err: any) {
          console.error(`Error deleting ${doc.$id}:`, err.message);
        }
        done++;
        setMigrationProgress(p => ({ ...p!, done, copied, deleted }));
        await new Promise(r => setTimeout(r, 60));
      }

      setMigrationSuccess(`Migración exitosa: ${copied} productos movidos a la tienda.`);
      fetchCatalogCount();
    } catch (err: any) {
      setMigrationError(err.message || 'Ocurrió un error durante la migración');
    } finally {
      setMigrating(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: '#5850ec' }} />
        <span style={{ color: '#6b7280', fontSize: 14 }}>Cargando configuración...</span>
      </div>
    );
  }

  const hasData = settings.storeName || settings.phone || settings.email || settings.address;

  return (
    <div style={{ padding: '28px 32px', maxWidth: '960px' }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #5850ec, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(88,80,236,0.3)' }}>
              <Store size={22} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Mi Tienda</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: 14, marginLeft: 54 }}>Configura la información que se muestra en tu tienda</p>
        </div>
        <button onClick={() => setPreviewMode(!previewMode)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
          border: '1.5px solid #e5e7eb', background: previewMode ? '#f0eFFF' : '#fff',
          color: previewMode ? '#5850ec' : '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          {previewMode ? <Eye size={15} /> : <EyeOff size={15} />}
          {previewMode ? 'Vista previa' : 'Vista previa'}
        </button>
      </div>

      {/* ─── Success/Error Message ─── */}
      {message && (
        <div style={{
          padding: '12px 18px', borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
          background: message.type === 'success' ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          boxShadow: message.type === 'success' ? '0 2px 8px rgba(6,95,70,0.1)' : '0 2px 8px rgba(153,27,27,0.1)',
        }}>
          <Sparkles size={16} />
          {message.text}
        </div>
      )}

      {/* ─── Preview Bar ─── */}
      {previewMode && hasData && (
        <div style={{
          marginBottom: 24, borderRadius: 12, overflow: 'hidden',
          background: 'linear-gradient(90deg, #1e1b4b, #4f46e5, #7c3aed, #1e1b4b)',
          backgroundSize: '400% 100%', animation: 'gradFlow 8s ease infinite',
          padding: '10px 20px', color: 'rgba(255,255,255,0.9)', fontSize: 12,
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          boxShadow: '0 4px 16px rgba(79,70,229,0.3)',
        }}>
          {settings.storeName && <span style={{ fontWeight: 700 }}>{settings.storeName}</span>}
          {settings.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{settings.phone}</span>}
          {settings.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{settings.email}</span>}
          {settings.address && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{settings.address}</span>}
        </div>
      )}

      {/* ─── Two Column Layout ─── */}
      <div className="admin-2col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* ─── Card: Información de Contacto ─── */}
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5850ec' }}>
              <Building2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>Información de Contacto</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Datos visibles en tu tienda</div>
            </div>
          </div>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field icon={<Store size={13} />} label="Nombre de la tienda" hint="Se muestra en la barra superior y en el header" value={settings.storeName} onChange={v => setSettings({ ...settings, storeName: v })} placeholder="Ej: JoyPerfumes" />
            <Field icon={<Phone size={13} />} label="Teléfono" hint="Con código de país" value={settings.phone} onChange={v => setSettings({ ...settings, phone: v })} placeholder="Ej: +569 98393507" />
            <Field icon={<Mail size={13} />} label="Email" hint="Email de contacto principal" value={settings.email} onChange={v => setSettings({ ...settings, email: v })} placeholder="Ej: contacto@mitienda.com" type="email" />
          </div>
        </div>

        {/* ─── Card: Ubicación y Web ─── */}
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <MapPin size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>Ubicación y Web</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Dirección y presencia online</div>
            </div>
          </div>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field icon={<MapPin size={13} />} label="Dirección / Zona de despacho" hint="Se muestra como zona de cobertura" value={settings.address} onChange={v => setSettings({ ...settings, address: v })} placeholder="Ej: Despachos a todo Chile" />
            <Field icon={<Globe size={13} />} label="Sitio web" hint="URL de tu sitio o redes sociales" value={settings.website} onChange={v => setSettings({ ...settings, website: v })} placeholder="Ej: https://mitienda.com" type="url" />
            <Field icon={<MessageSquare size={13} />} label="Descripción" hint="Breve descripción de tu tienda" value={settings.description} onChange={v => setSettings({ ...settings, description: v })} placeholder="Ej: Perfumes originales y de calidad a los mejores precios" multiline />
          </div>
        </div>
      </div>

      {/* ─── Two Column Layout: Modalidad & Visualización ─── */}
      <div className="admin-2col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
        
        {/* ─── Card: Modalidad de Tienda ─── */}
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
              <Database size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>Modalidad de Tienda</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Define la lógica de inventario</div>
            </div>
          </div>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderRadius: 12,
              background: settings.unlimitedStock ? 'linear-gradient(135deg, #f0fdf4, #e8f5e9)' : '#fafafa',
              border: `1.5px solid ${settings.unlimitedStock ? '#bbf7d0' : '#e5e7eb'}`,
              transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: settings.unlimitedStock ? '#16a34a' : '#e5e7eb',
                  color: settings.unlimitedStock ? '#fff' : '#9ca3af',
                  transition: 'all 0.3s',
                }}>
                  {settings.unlimitedStock ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>Sin stock (Stock Ilimitado)</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>Permite comprar cualquier cantidad sin límites de inventario</div>
                </div>
              </div>
              <button onClick={() => setSettings({ ...settings, unlimitedStock: !settings.unlimitedStock })} style={{
                width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', position: 'relative',
                background: settings.unlimitedStock ? '#16a34a' : '#d1d5db',
                transition: 'background 0.3s',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, background: '#fff',
                  position: 'absolute', top: 3, left: settings.unlimitedStock ? 25 : 3,
                  transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
            
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              ℹ️ <strong>Al activar Sin Stock:</strong> Se ocultarán todas las pantallas de inventario y stock del panel. Las secciones "Catálogo" y "Solicitudes" serán ocultadas en el storefront y se permitirá la compra ilimitada.
            </div>
          </div>
        </div>

        {/* ─── Card: Visualización ─── */}
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0547a' }}>
              <Eye size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>Visualización en la tienda</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Controla dónde se muestran los datos</div>
            </div>
          </div>
          <div style={{ padding: '20px 22px' }}>
            {/* Toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderRadius: 12,
              background: settings.showInAnnouncementBar ? 'linear-gradient(135deg, #eef2ff, #f0eFFF)' : '#fafafa',
              border: `1.5px solid ${settings.showInAnnouncementBar ? '#c7d2fe' : '#e5e7eb'}`,
              transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: settings.showInAnnouncementBar ? '#5850ec' : '#e5e7eb',
                  color: settings.showInAnnouncementBar ? '#fff' : '#9ca3af',
                  transition: 'all 0.3s',
                }}>
                  {settings.showInAnnouncementBar ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>Mostrar en barra de anuncios</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Los datos de contacto aparecerán en la barra superior de la tienda</div>
                </div>
              </div>
              <button onClick={() => setSettings({ ...settings, showInAnnouncementBar: !settings.showInAnnouncementBar })} style={{
                width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', position: 'relative',
                background: settings.showInAnnouncementBar ? '#5850ec' : '#d1d5db',
                transition: 'background 0.3s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11, background: '#fff',
                  position: 'absolute', top: 3, left: settings.showInAnnouncementBar ? 27 : 3,
                  transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>

            {/* Mini preview when enabled */}
            {settings.showInAnnouncementBar && hasData && (
              <div style={{
                marginTop: 14, padding: '10px 16px', borderRadius: 8,
                background: 'linear-gradient(90deg, #1e1b4b, #4f46e5, #7c3aed, #1e1b4b)',
                backgroundSize: '400% 100%', animation: 'gradFlow 8s ease infinite',
                color: 'rgba(255,255,255,0.85)', fontSize: 11,
                display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
              }}>
                <span style={{ opacity: 0.5, fontSize: 10 }}>Vista previa →</span>
                {settings.storeName && <span style={{ fontWeight: 700 }}>{settings.storeName}</span>}
                {settings.phone && <span>📞 {settings.phone}</span>}
                {settings.email && <span>💌 {settings.email}</span>}
                {settings.address && <span>📦 {settings.address}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Card: Migración de Catálogo a Tienda (A pedido -> General) ─── */}
      {settings.unlimitedStock && catalogCount !== null && catalogCount > 0 && (
        <div style={{
          marginTop: 20, background: '#fff', borderRadius: 16, border: '1px solid #fde68a',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.05)', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #fef3c7', background: '#fffbeb', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <ArrowRightLeft size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#92400e' }}>Migración de Catálogo a Tienda</div>
              <div style={{ fontSize: 11, color: '#b45309' }}>Mueve productos "A Pedido" a la tienda con stock ilimitado</div>
            </div>
          </div>
          <div style={{ padding: '20px 22px' }}>
            {migrationSuccess && (
              <div style={{ display: 'flex', gap: 8, background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: 10, color: '#065f46', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                <CheckCircle size={16} />
                {migrationSuccess}
              </div>
            )}
            {migrationError && (
              <div style={{ display: 'flex', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: 10, color: '#991b1b', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                <AlertTriangle size={16} />
                {migrationError}
              </div>
            )}
            
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.5 }}>
              Detectamos <strong>{catalogCount}</strong> productos en la colección "A Pedido" (catalog_products). Como estás en la modalidad sin stock, estos productos deben ser pasados a tu tienda activa para que tus clientes puedan comprarlos.
            </p>

            <button
              onClick={runMigration}
              disabled={migrating}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                background: migrating ? '#9ca3af' : 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700,
                cursor: migrating ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                width: '100%', justifyContent: 'center',
                boxShadow: migrating ? 'none' : '0 4px 12px rgba(217,119,6,0.25)',
              }}
            >
              {migrating ? (
                <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Migrando...</>
              ) : (
                <><ArrowRightLeft size={16} /> Pasar {catalogCount} productos de Catálogo a Tienda</>
              )}
            </button>

            {migrating && migrationProgress && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4b5563', marginBottom: 6 }}>
                  <span>Copiando y eliminando del catálogo...</span>
                  <span>{migrationProgress.done} / {migrationProgress.total}</span>
                </div>
                <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#d97706', width: `${(migrationProgress.done / migrationProgress.total) * 100}%`, transition: 'width 0.2s' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Save Button ─── */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button onClick={handleSave} disabled={saving} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px',
          background: saving ? '#9ca3af' : 'linear-gradient(135deg, #5850ec, #7c3aed)',
          color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
          boxShadow: saving ? 'none' : '0 4px 14px rgba(88,80,236,0.35)',
        }}>
          {saving ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Guardando...</>
          ) : (
            <><Save size={16} />Guardar configuración</>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gradFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        input:focus, textarea:focus { border-color: #5850ec !important; box-shadow: 0 0 0 3px rgba(88,80,236,0.1) !important; background: #fff !important; }
      `}</style>
    </div>
  );
}
