'use client';

import { useEffect, useState, useCallback } from 'react';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID, CATALOG_PRODUCTS_COLLECTION_ID, INVENTORY_PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Product } from '@/types';
import { ImageOff, Loader2, RefreshCw, Search, Upload, X, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { MEDIA_BUCKET_ID } from '@/lib/appwrite';
import { invalidateProductCache } from '@/lib/cache';

interface ProductWithStatus extends Product {
  imageStatus: 'ok' | 'broken' | 'empty' | 'checking';
  collection: string;
}

async function checkImage(url: string): Promise<'ok' | 'broken' | 'empty'> {
  if (!url || url.trim() === '') return 'empty';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    clearTimeout(timeout);
    if (res.ok) return 'ok';
    // Try GET if HEAD fails
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 10000);
    const res2 = await fetch(url, { method: 'GET', signal: controller2.signal, redirect: 'follow' });
    clearTimeout(timeout2);
    return res2.ok ? 'ok' : 'broken';
  } catch {
    return 'broken';
  }
}

export default function ProductosSinImagenPage() {
  const [products, setProducts] = useState<ProductWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'broken' | 'empty'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const collections = [
        { name: 'products', id: PRODUCTS_COLLECTION_ID },
        { name: 'catalog_products', id: CATALOG_PRODUCTS_COLLECTION_ID },
        { name: 'inventory_products', id: INVENTORY_PRODUCTS_COLLECTION_ID },
      ];

      const allProducts: ProductWithStatus[] = [];
      for (const col of collections) {
        try {
          const res = await databases.listDocuments(databaseId, col.id, []);
          for (const doc of res.documents) {
            allProducts.push({
              ...doc,
              imageStatus: 'checking',
              collection: col.name,
            } as ProductWithStatus);
          }
        } catch (e) {
          // Collection might not exist or be empty
        }
      }
      setProducts(allProducts);
      setIsLoading(false);

      // Check images in background
      setChecking(true);
      const batchSize = 8;
      for (let i = 0; i < allProducts.length; i += batchSize) {
        const batch = allProducts.slice(i, i + batchSize);
        await Promise.all(batch.map(async (p) => {
          const status = await checkImage(p.IMAGEURL || '');
          setProducts(prev => prev.map(item =>
            item.$id === p.$id ? { ...item, imageStatus: status } : item
          ));
        }));
      }
      setChecking(false);
    } catch (e: any) {
      console.error('Error loading products:', e);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSave = async (product: ProductWithStatus) => {
    setSaving(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const colId = product.collection === 'products' ? PRODUCTS_COLLECTION_ID
        : product.collection === 'catalog_products' ? CATALOG_PRODUCTS_COLLECTION_ID
        : INVENTORY_PRODUCTS_COLLECTION_ID;
      await databases.updateDocument(databaseId, colId, product.$id, { IMAGEURL: editUrl });
      setProducts(prev => prev.map(p =>
        p.$id === product.$id ? { ...p, IMAGEURL: editUrl, imageStatus: 'ok' } : p
      ));
      setEditingId(null);
      setEditUrl('');
      invalidateProductCache();
    } catch (e: any) {
      alert('Error al guardar: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const brokenCount = products.filter(p => p.imageStatus === 'broken').length;
  const emptyCount = products.filter(p => p.imageStatus === 'empty').length;
  const okCount = products.filter(p => p.imageStatus === 'ok').length;

  const filtered = products.filter(p => {
    if (filter === 'broken' && p.imageStatus !== 'broken') return false;
    if (filter === 'empty' && p.imageStatus !== 'empty') return false;
    if (search && !p.NAME?.toLowerCase().includes(search.toLowerCase()) && !p.SKU?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ImageOff size={28} color="#e53935" />
            Productos sin imágenes
          </h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>
            Detecta y repara productos con imágenes rotas o sin imagen
          </p>
        </div>
        <button
          onClick={loadProducts}
          disabled={isLoading || checking}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', background: '#1a1a1a', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: isLoading || checking ? 'not-allowed' : 'pointer', opacity: isLoading || checking ? 0.6 : 1,
          }}
        >
          {isLoading || checking ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {checking ? 'Revisando...' : 'Revisar imágenes'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 14, padding: '20px 24px',
          border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={22} color="#4caf50" />
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{okCount}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Imágenes OK</div>
            </div>
          </div>
        </div>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 14, padding: '20px 24px',
          border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ImageOff size={22} color="#e53935" />
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#e53935' }}>{brokenCount}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Imágenes rotas</div>
            </div>
          </div>
        </div>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 14, padding: '20px 24px',
          border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={22} color="#ff9800" />
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ff9800' }}>{emptyCount}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Sin imagen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 38px',
              border: '1px solid #e0e0e0', borderRadius: 10,
              fontSize: 14, outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'broken', label: 'Rotos' },
            { key: 'empty', label: 'Sin imagen' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: filter === f.key ? '1px solid #1a1a1a' : '1px solid #e0e0e0',
                background: filter === f.key ? '#1a1a1a' : '#fff',
                color: filter === f.key ? '#fff' : '#666',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Cargando productos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
          <CheckCircle2 size={40} style={{ margin: '0 auto 12px', color: '#4caf50' }} />
          <p>No hay productos con problemas de imagen.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.$id} style={{
              background: '#fff', borderRadius: 14, padding: 16,
              border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              {/* Image preview */}
              <div style={{
                width: '100%', height: 160, borderRadius: 10, overflow: 'hidden',
                background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12, position: 'relative',
              }}>
                {p.imageStatus === 'checking' ? (
                  <Loader2 size={24} className="animate-spin" color="#aaa" />
                ) : p.imageStatus === 'empty' ? (
                  <div style={{ textAlign: 'center', color: '#aaa' }}>
                    <ImageOff size={32} style={{ margin: '0 auto 4px' }} />
                    <span style={{ fontSize: 12 }}>Sin imagen</span>
                  </div>
                ) : p.imageStatus === 'broken' ? (
                  <div style={{ textAlign: 'center', color: '#e53935' }}>
                    <ImageOff size={32} style={{ margin: '0 auto 4px' }} />
                    <span style={{ fontSize: 12 }}>Imagen rota</span>
                  </div>
                ) : (
                  <img
                    src={p.IMAGEURL}
                    alt={p.NAME}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      setProducts(prev => prev.map(item =>
                        item.$id === p.$id ? { ...item, imageStatus: 'broken' } : item
                      ));
                    }}
                  />
                )}
                {/* Status badge */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: p.imageStatus === 'ok' ? '#e8f5e9' : p.imageStatus === 'broken' ? '#ffebee' : p.imageStatus === 'empty' ? '#fff3e0' : '#f5f5f5',
                  color: p.imageStatus === 'ok' ? '#2e7d32' : p.imageStatus === 'broken' ? '#c62828' : p.imageStatus === 'empty' ? '#e65100' : '#888',
                }}>
                  {p.imageStatus === 'ok' ? 'OK' : p.imageStatus === 'broken' ? 'ROTO' : p.imageStatus === 'empty' ? 'SIN IMAGEN' : '...'}
                </div>
              </div>

              {/* Product info */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 4 }}>
                  {p.NAME || 'Sin nombre'}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {p.SKU && <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '2px 8px', borderRadius: 6 }}>{p.SKU}</span>}
                  <span style={{ fontSize: 11, color: '#aaa' }}>{p.collection}</span>
                  <span style={{ fontSize: 11, color: '#888' }}>${p.PRICE?.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Edit / Upload */}
              {editingId === p.$id ? (
                <div style={{ marginTop: 8 }}>
                  <ImageUploadField
                    label="Nueva URL de imagen"
                    value={editUrl}
                    onChange={setEditUrl}
                    bucketId={MEDIA_BUCKET_ID}
                    placeholder="https://..."
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => handleSave(p)}
                      disabled={saving}
                      style={{
                        flex: 1, padding: '8px 12px', background: '#1a1a1a', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
                      }}
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : 'Guardar'}
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditUrl(''); }}
                      style={{
                        padding: '8px 12px', background: '#f5f5f5', color: '#666',
                        border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingId(p.$id); setEditUrl(p.IMAGEURL || ''); }}
                  style={{
                    width: '100%', padding: '8px 12px',
                    background: p.imageStatus === 'ok' ? '#f5f5f5' : '#1a1a1a',
                    color: p.imageStatus === 'ok' ? '#666' : '#fff',
                    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Upload size={14} />
                  {p.imageStatus === 'ok' ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
              )}

              {/* URL preview */}
              {p.IMAGEURL && editingId !== p.$id && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#aaa', wordBreak: 'break-all', lineHeight: 1.4 }}>
                  <a href={p.IMAGEURL} target="_blank" rel="noreferrer" style={{ color: '#3483fa', textDecoration: 'none' }}>
                    {p.IMAGEURL.substring(0, 60)}{p.IMAGEURL.length > 60 ? '...' : ''}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
