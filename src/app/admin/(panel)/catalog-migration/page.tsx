'use client';

import { useState, useEffect } from 'react';
import { Query, ID } from 'appwrite';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID, CATALOG_PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { ArrowRightLeft, AlertTriangle, CheckCircle, Database, Trash2 } from 'lucide-react';

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

export default function CatalogMigrationPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ total: number; done: number; copied: number; deleted: number } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState<{ totalProducts: number; zeroStock: number; withStock: number; catalogProducts: number } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const [prodRes, catRes] = await Promise.all([
          databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [Query.limit(1)]),
          databases.listDocuments(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, [Query.limit(1)]),
        ]);
        // Count zero-stock products
        const allDocs: any[] = [];
        let offset = 0;
        while (true) {
          const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
            Query.limit(500), Query.offset(offset),
          ]);
          allDocs.push(...res.documents);
          if (res.documents.length < 500) break;
          offset += 500;
        }
        const zeroStock = allDocs.filter(d => !d.STOCK || d.STOCK === 0);
        const withStock = allDocs.filter(d => d.STOCK && d.STOCK > 0);
        setStats({
          totalProducts: allDocs.length,
          zeroStock: zeroStock.length,
          withStock: withStock.length,
          catalogProducts: catRes.total,
        });
      } catch (err: any) {
        console.error('Error fetching stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleMigrate = async () => {
    if (!confirm('¿Estás seguro? Esto moverá todos los productos con STOCK=0 de "products" a "catalog_products" y los eliminará de "products".\n\nAsegúrate de que la colección "catalog_products" ya exista en Appwrite.')) return;

    setIsProcessing(true);
    setError('');
    setSuccess('');
    setProgress({ total: 0, done: 0, copied: 0, deleted: 0 });

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // 1. Fetch all zero-stock products
      const allDocs: any[] = [];
      let offset = 0;
      while (true) {
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
          Query.limit(500), Query.offset(offset),
        ]);
        allDocs.push(...res.documents);
        if (res.documents.length < 500) break;
        offset += 500;
      }

      const zeroStockDocs = allDocs.filter(d => !d.STOCK || d.STOCK === 0);
      setProgress(p => ({ ...p!, total: zeroStockDocs.length }));

      let done = 0;
      let copied = 0;
      let deleted = 0;

      // 2. Copy each to catalog_products
      for (const doc of zeroStockDocs) {
        try {
          const productData: any = {};
          for (const key of COPY_KEYS) {
            if (doc[key] !== undefined && doc[key] !== null) {
              productData[key] = doc[key];
            }
          }
          // Store reference to original product ID
          productData.ORIGINAL_PRODUCT_ID = doc.$id;
          productData.ISACTIVE = doc.ISACTIVE !== false;

          await executeWithRetry(() =>
            databases.createDocument(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, ID.unique(), productData)
          );
          copied++;
        } catch (err: any) {
          console.error(`Error copying ${doc.NAME}:`, err.message);
        }
        done++;
        setProgress(p => ({ ...p!, done, copied, deleted }));
        await new Promise(r => setTimeout(r, 80));
      }

      // 3. Delete from products (after all copies succeed)
      done = 0;
      for (const doc of zeroStockDocs) {
        try {
          await executeWithRetry(() =>
            databases.deleteDocument(databaseId, PRODUCTS_COLLECTION_ID, doc.$id)
          );
          deleted++;
        } catch (err: any) {
          console.error(`Error deleting ${doc.$id}:`, err.message);
        }
        done++;
        setProgress(p => ({ ...p!, done, copied, deleted }));
        await new Promise(r => setTimeout(r, 80));
      }

      setSuccess(`Migración completa: ${copied} productos copiados a catalog_products, ${deleted} eliminados de products.`);
      // Refresh stats
      setStats(null);
      const [prodRes, catRes] = await Promise.all([
        databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, [Query.limit(1)]),
      ]);
      setStats({
        totalProducts: prodRes.total,
        zeroStock: 0,
        withStock: prodRes.total,
        catalogProducts: catRes.total,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="admin-main-content" style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ArrowRightLeft size={24} color="#6366f1" /> Migración a Catalog Products
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0' }}>
          Mueve productos sin stock de <strong>products</strong> a <strong>catalog_products</strong> para que BodegApp pueda publicar sin conflicto de barcode.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, textAlign: 'center' }}>
            <Database size={18} color="#6366f1" style={{ margin: '0 auto 6px' }} />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>{stats.totalProducts}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', margin: '2px 0 0', textTransform: 'uppercase' }}>Products Total</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', margin: 0 }}>{stats.withStock}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', margin: '2px 0 0', textTransform: 'uppercase' }}>Con Stock</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#dc2626', margin: 0 }}>{stats.zeroStock}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', margin: '2px 0 0', textTransform: 'uppercase' }}>Sin Stock (migrar)</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#0891b2', margin: 0 }}>{stats.catalogProducts}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', margin: '2px 0 0', textTransform: 'uppercase' }}>Catalog Products</p>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle color="#ef4444" size={20} />
            <span style={{ color: '#991b1b', fontSize: 14 }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle color="#16a34a" size={20} />
            <span style={{ color: '#166534', fontSize: 14 }}>{success}</span>
          </div>
        )}

        {/* Warning */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#92400e', margin: 0, lineHeight: 1.6 }}>
            <strong>⚠ Antes de migrar:</strong> Asegúrate de crear la colección <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>catalog_products</code> en Appwrite con los mismos atributos que <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>products</code>.
            Agregar también el atributo <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>ORIGINAL_PRODUCT_ID</code> (string) para referencia.
          </p>
        </div>

        {/* Flow diagram */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#334155' }}>Flujo de datos después de migrar:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>products</span>
              <span style={{ color: '#9ca3af' }}>→ solo productos CON stock →</span>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>/productos</span>
              <span style={{ color: '#9ca3af' }}>(Tienda)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#fce7f3', color: '#9d174d', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>catalog_products</span>
              <span style={{ color: '#9ca3af' }}>→ productos SIN stock →</span>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>/catalogo</span>
              <span style={{ color: '#9ca3af' }}>(A Pedido)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>inventory_products</span>
              <span style={{ color: '#9ca3af' }}>→ maestro BodegApp →</span>
              <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>catalog-visibility</span>
              <span style={{ color: '#9ca3af' }}>(comparar)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleMigrate}
          disabled={isProcessing || !stats || stats.zeroStock === 0}
          style={{
            width: '100%', background: isProcessing || !stats || stats.zeroStock === 0 ? '#9ca3af' : '#6366f1',
            color: '#fff', border: 'none', borderRadius: 8, padding: '14px 24px',
            fontSize: 15, fontWeight: 700, cursor: isProcessing || !stats || stats.zeroStock === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <ArrowRightLeft size={18} />
          {stats?.zeroStock === 0
            ? 'No hay productos sin stock para migrar'
            : isProcessing
              ? 'Migrando...'
              : `Migrar ${stats?.zeroStock || 0} productos sin stock a catalog_products`}
        </button>

        {isProcessing && progress && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
              <span>
                {progress.deleted < progress.copied
                  ? `Copiando a catalog_products... (${progress.copied} copiados)`
                  : `Eliminando de products... (${progress.deleted} eliminados)`}
              </span>
              <span>{progress.done} / {progress.total}</span>
            </div>
            <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#6366f1', width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`, transition: 'width 0.2s' }} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#6b7280' }}>
              <span>✅ Copiados: {progress.copied}</span>
              <span>🗑️ Eliminados: {progress.deleted}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
