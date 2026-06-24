'use client';

import { useState, useEffect, useCallback } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, INVENTORY_PRODUCTS_COLLECTION_ID, CATEGORIES_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Product, Category } from '@/types/admin';
import { Search, RefreshCw, Package, CheckCircle2, XCircle, Sparkles, Eye, ClipboardPaste, ImageIcon, FileSpreadsheet, Upload } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

export default function ProductVotesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skuInput, setSkuInput] = useState('');
  const [lookupResults, setLookupResults] = useState<{ sku: string; product: Product | null }[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [saving, setSaving] = useState(false);

  // Image upload state
  const [imageRows, setImageRows] = useState<{ sku: string; imageUrl: string; product: Product | null }[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isSavingImages, setIsSavingImages] = useState(false);
  const [imageSaveProgress, setImageSaveProgress] = useState(0);
  const [imageSaveResults, setImageSaveResults] = useState<{ updated: number; notFound: number; errors: number } | null>(null);

  // Individual image edit state
  const [editingImage, setEditingImage] = useState<{ productId: string; currentUrl: string } | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const [catsResp] = await Promise.all([
        databases.listDocuments(databaseId, CATEGORIES_COLLECTION_ID, [Query.limit(500)]),
      ]);
      // Paginate all inventory products
      const allDocs: any[] = [];
      let offset = 0;
      while (true) {
        const r = await databases.listDocuments(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, [Query.limit(2000), Query.offset(offset)]);
        allDocs.push(...r.documents);
        if (r.documents.length < 2000) break;
        offset += 2000;
      }
      setProducts(allDocs as unknown as Product[]);
      setCategories(catsResp.documents as unknown as Category[]);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const catMap = Object.fromEntries(categories.map(c => [c.$id, c.name]));
  const comingSoonProducts = products.filter(p => p.COMING_SOON === true);

  const handleLookup = () => {
    const skus = skuInput.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
    if (skus.length === 0) { setLookupResults([]); setHasSearched(false); return; }
    const results = skus.map(sku => {
      const product = products.find(p =>
        (p.sku && p.sku.toLowerCase() === sku.toLowerCase()) ||
        (p.barcode && p.barcode.toLowerCase() === sku.toLowerCase()) ||
        (p.NAME && p.NAME.toLowerCase().includes(sku.toLowerCase())) ||
        (p.$id === sku)
      );
      return { sku, product: product || null };
    });
    setLookupResults(results);
    setHasSearched(true);
  };

  const foundResults = lookupResults.filter(r => r.product);
  const notFoundResults = lookupResults.filter(r => !r.product);

  const handleMarkAsComingSoon = async () => {
    const toMark = foundResults.filter(r => r.product && !r.product.COMING_SOON);
    if (toMark.length === 0) return;
    setSaving(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await Promise.all(toMark.map(r => databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, r.product!.$id, { COMING_SOON: true })));
      setProducts(prev => prev.map(p => toMark.find(r => r.product!.$id === p.$id) ? { ...p, COMING_SOON: true } : p));
      setLookupResults(prev => prev.map(r => r.product ? { ...r, product: { ...r.product, COMING_SOON: true } } : r));
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleRemoveComingSoon = async (productId: string) => {
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, productId, { COMING_SOON: false });
      setProducts(prev => prev.map(p => p.$id === productId ? { ...p, COMING_SOON: false } : p));
    } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleToggleComingSoon = async (product: Product) => {
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const newVal = !product.COMING_SOON;
      await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, product.$id, { COMING_SOON: newVal });
      setProducts(prev => prev.map(p => p.$id === product.$id ? { ...p, COMING_SOON: newVal } : p));
    } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleEditImage = (product: Product) => {
    setEditingImage({ productId: product.$id, currentUrl: product.IMAGEURL || '' });
    setNewImageUrl(product.IMAGEURL || '');
  };

  const handleSaveImageEdit = async () => {
    if (!editingImage) return;
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, editingImage.productId, { IMAGEURL: newImageUrl });
      setProducts(prev => prev.map(p => p.$id === editingImage.productId ? { ...p, IMAGEURL: newImageUrl } : p));
      setEditingImage(null);
      setNewImageUrl('');
    } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleCancelImageEdit = () => {
    setEditingImage(null);
    setNewImageUrl('');
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsProcessingImages(true);
    setImageSaveResults(null);

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

      const parsed = rawRows.map(row => {
        const sku = String(row['sku'] || row['SKU'] || row['Sku'] || row['codigo'] || row['Codigo'] || '').trim();
        const imageUrl = String(row['imagen'] || row['Imagen' ] || row['IMAGE'] || row['image'] || row['Image'] || row['IMAGEURL'] || row['imageUrl'] || row['url'] || '').trim();
        return { sku, imageUrl, product: null };
      }).filter(r => r.sku && r.imageUrl);

      // Match only against COMING_SOON products
      const matched = parsed.map(row => {
        const product = comingSoonProducts.find(p =>
          (p.sku && p.sku.toLowerCase() === row.sku.toLowerCase()) ||
          (p.barcode && p.barcode.toLowerCase() === row.sku.toLowerCase()) ||
          (p.NAME && p.NAME.toLowerCase().includes(row.sku.toLowerCase())) ||
          (p.$id === row.sku)
        );
        return { ...row, product: product || null };
      });

      setImageRows(matched);
    } catch (err: any) {
      alert('Error al leer archivo: ' + (err.message || err));
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleSaveImages = async () => {
    const toUpdate = imageRows.filter(r => r.product);
    if (toUpdate.length === 0) return;
    setIsSavingImages(true);
    setImageSaveProgress(0);
    let updated = 0, notFound = 0, errors = 0;

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    for (let i = 0; i < toUpdate.length; i++) {
      const row = toUpdate[i];
      try {
        await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, row.product!.$id, { IMAGEURL: row.imageUrl });
        setProducts(prev => prev.map(p => p.$id === row.product!.$id ? { ...p, IMAGEURL: row.imageUrl } : p));
        updated++;
      } catch (e) {
        errors++;
      }
      setImageSaveProgress(Math.round(((i + 1) / toUpdate.length) * 100));
      await new Promise(r => setTimeout(r, 80));
    }

    notFound = imageRows.filter(r => !r.product).length;
    setImageSaveResults({ updated, notFound, errors });
    setIsSavingImages(false);
  };

  if (isLoading) return (
    <div className="admin-main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <RefreshCw size={32} className="animate-spin" style={{ color: '#7c3aed' }} />
    </div>
  );

  return (
    <div className="admin-main-content" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>Productos que Llegan Pronto</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
            Pega SKUs para buscar productos y márcalos como "Llegan Pronto". Aparecen en /llegan-pronto y se ocultan de /catalogo.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/llegan-pronto" target="_blank" style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Eye size={15} /> Ver Página
          </Link>
          <button onClick={load} style={{ padding: '8px 12px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '.5px' }}>Marcados "Llegan Pronto"</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#6d28d9', marginTop: 4 }}>{comingSoonProducts.length}</div>
        </div>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.5px' }}>Total Inventario</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#1d4ed8', marginTop: 4 }}>{products.length}</div>
        </div>
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '.5px' }}>Con SKU</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#b45309', marginTop: 4 }}>{products.filter(p => p.sku).length}</div>
        </div>
      </div>

      {/* SKU Lookup */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClipboardPaste size={18} color="#7c3aed" /> Buscar por SKU / Código de Barras / Nombre
        </h2>
        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px' }}>Pega uno o varios SKUs separados por comas, punto y coma o saltos de línea.</p>
        <textarea value={skuInput} onChange={e => { setSkuInput(e.target.value); setHasSearched(false); }}
          placeholder={"Ejemplo:\nABC123\nDEF456, GHI789\nSKU-001; SKU-002"}
          style={{ width: '100%', minHeight: 100, padding: 12, border: '1px solid #d1d5db', borderRadius: 10, fontSize: 13, fontFamily: 'monospace', resize: 'vertical', outline: 'none', background: '#f9fafb' }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={handleLookup} style={{ padding: '10px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={15} /> Buscar SKUs
          </button>
          {foundResults.length > 0 && (
            <button onClick={handleMarkAsComingSoon} disabled={saving} style={{ padding: '10px 24px', background: saving ? '#a78bfa' : '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={15} /> {saving ? 'Guardando...' : `Marcar ${foundResults.filter(r => !r.product?.COMING_SOON).length} como "Llegan Pronto"`}
            </button>
          )}
        </div>

        {hasSearched && (
          <div style={{ marginTop: 20 }}>
            {foundResults.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} /> Encontrados ({foundResults.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                  {foundResults.map((r, i) => (
                    <div key={i} style={{ background: r.product?.COMING_SOON ? '#f5f3ff' : '#f0fdf4', border: `1px solid ${r.product?.COMING_SOON ? '#ddd6fe' : '#bbf7d0'}`, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      {r.product?.IMAGEURL ? <img src={r.product.IMAGEURL} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} /> : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Package size={20} color="#9ca3af" /></div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product?.NAME}</p>
                        <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>SKU: {r.sku} · {catMap[r.product?.CATEGORYID || ''] || 'Sin cat.'}</p>
                      </div>
                      {r.product?.COMING_SOON ? (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', background: '#ede9fe', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>✓ Llegan Pronto</span>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>Nuevo</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {notFoundResults.length > 0 && (
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <XCircle size={16} /> No Encontrados ({notFoundResults.length})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {notFoundResults.map((r, i) => (
                    <span key={i} style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: 6 }}>{r.sku}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Currently marked */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#7c3aed', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} /> Marcados como "Llegan Pronto" ({comingSoonProducts.length})
          </h2>
        </div>
        {comingSoonProducts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Package size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#9ca3af', margin: 0 }}>No hay productos marcados</p>
            <p style={{ fontSize: 12, color: '#d1d5db', margin: '4px 0 0' }}>Busca SKUs arriba y márcalos</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, padding: 16 }}>
            {comingSoonProducts.map(p => (
              <div key={p.$id} style={{ background: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f3f4f6' }}>
                  {editingImage?.productId === p.$id ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 12, gap: 8 }}>
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        placeholder="URL de imagen"
                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, outline: 'none' }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                        <button onClick={handleSaveImageEdit} style={{ flex: 1, padding: '6px 0', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
                        <button onClick={handleCancelImageEdit} style={{ flex: 1, padding: '6px 0', background: '#e5e7eb', color: '#333', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                      </div>
                    </div>
                  ) : p.IMAGEURL ? (
                    <img src={p.IMAGEURL} alt={p.NAME} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Package size={32} color="#d1d5db" /></div>
                  )}
                  <span style={{ position: 'absolute', top: 8, right: 8, background: '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>Llegan Pronto</span>
                </div>
                <div style={{ padding: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.NAME}</p>
                  <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>{catMap[p.CATEGORYID || ''] || 'Sin categoría'}{p.sku ? ` · SKU: ${p.sku}` : ''}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link prefetch={false} href={`/productos/${p.$id}`} target="_blank" style={{ flex: 1, padding: '6px 0', background: '#f1f5f9', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#333', textDecoration: 'none', textAlign: 'center' }}>Ver</Link>
                    <button onClick={() => handleEditImage(p)} disabled={editingImage?.productId === p.$id} style={{ flex: 1, padding: '6px 0', background: editingImage?.productId === p.$id ? '#e5e7eb' : '#dbeafe', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#2563eb', cursor: editingImage?.productId === p.$id ? 'not-allowed' : 'pointer' }}>Imagen</button>
                    <button onClick={() => handleRemoveComingSoon(p.$id)} style={{ flex: 1, padding: '6px 0', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#dc2626', cursor: 'pointer' }}>Quitar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image upload for COMING_SOON products */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, marginTop: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImageIcon size={18} color="#7c3aed" /> Actualizar Imágenes de Productos "Llegan Pronto"
        </h2>
        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px' }}>Sube un Excel con SKU + imagen (URL) para actualizar las imágenes de los productos marcados.</p>

        <div style={{ border: '2px dashed #d1d5db', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <label style={{ cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImageFile} className="hidden" disabled={isProcessingImages} />
            {isProcessingImages ? (
              <div style={{ width: 40, height: 40, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <div style={{ width: 48, height: 48, background: '#f5f3ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet size={24} color="#7c3aed" />
              </div>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
              {isProcessingImages ? 'Procesando...' : 'Seleccionar archivo Excel'}
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>.xlsx, .xls, .csv</span>
          </label>
        </div>

        {imageRows.length > 0 && (
          <>
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a' }}>{imageRows.filter(r => r.product).length}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '.5px' }}>Encontrados</div>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#dc2626' }}>{imageRows.filter(r => !r.product).length}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '.5px' }}>No encontrados</div>
              </div>
            </div>

            {imageRows.filter(r => r.product).length > 0 && (
              <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={handleSaveImages} disabled={isSavingImages}
                  style={{ padding: '10px 24px', background: isSavingImages ? '#a78bfa' : '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: isSavingImages ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isSavingImages ? (
                    <>
                      <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Guardando... {imageSaveProgress}%
                    </>
                  ) : (
                    <>
                      <Upload size={15} /> Actualizar {imageRows.filter(r => r.product).length} imágenes
                    </>
                  )}
                </button>
                {isSavingImages && (
                  <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#7c3aed', borderRadius: 4, transition: 'width 0.3s', width: `${imageSaveProgress}%` }} />
                  </div>
                )}
              </div>
            )}

            {imageSaveResults && (
              <div style={{ marginTop: 16, padding: 12, background: imageSaveResults.errors > 0 ? '#fef3c7' : '#dcfce7', borderRadius: 8, border: imageSaveResults.errors > 0 ? '1px solid #fde68a' : '1px solid #86efac' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: imageSaveResults.errors > 0 ? '#b45309' : '#15803d' }}>
                  {imageSaveResults.updated} actualizadas · {imageSaveResults.notFound} no encontrados · {imageSaveResults.errors} errores
                </span>
              </div>
            )}

            {imageRows.filter(r => r.product).length > 0 && (
              <div style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', margin: '0 0 8px' }}>Productos que se actualizarán</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                  {imageRows.filter(r => r.product).map((r, i) => (
                    <div key={i} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      {r.product!.IMAGEURL ? <img src={r.product!.IMAGEURL} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} /> : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} color="#9ca3af" /></div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product!.NAME}</p>
                        <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0' }}>SKU: {r.sku}</p>
                      </div>
                      <div style={{ width: 32, height: 32, borderRadius: 6, overflow: 'hidden', border: '1px solid #bbf7d0' }}>
                        <img src={r.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick toggle */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, marginTop: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Toggle rápido por búsqueda</h2>
        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px' }}>Busca cualquier producto y actívalo/desactívalo como "Llegan Pronto".</p>
        <QuickToggle products={products} catMap={catMap} onToggle={handleToggleComingSoon} />
      </div>
    </div>
  );
}

function QuickToggle({ products, catMap, onToggle }: { products: Product[]; catMap: Record<string, string>; onToggle: (p: Product) => void }) {
  const [q, setQ] = useState('');
  const filtered = q.length >= 2 ? products.filter(p => p.NAME.toLowerCase().includes(q.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(q.toLowerCase()))) : [];

  return (
    <div>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar producto por nombre o SKU..."
        style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, outline: 'none', marginBottom: 12 }} />
      {q.length >= 2 && filtered.length === 0 && <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Sin resultados</p>}
      {filtered.length > 0 && (
        <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.slice(0, 20).map(p => (
            <div key={p.$id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: p.COMING_SOON ? '#f5f3ff' : '#f9fafb', border: `1px solid ${p.COMING_SOON ? '#ddd6fe' : '#e5e7eb'}`, borderRadius: 8 }}>
              {p.IMAGEURL ? <img src={p.IMAGEURL} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} /> : (
                <div style={{ width: 36, height: 36, borderRadius: 6, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={16} color="#9ca3af" /></div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.NAME}</p>
                <p style={{ fontSize: 10, color: '#6b7280', margin: 0 }}>{catMap[p.CATEGORYID || ''] || 'Sin cat.'}{p.sku ? ` · ${p.sku}` : ''}</p>
              </div>
              <button onClick={() => onToggle(p)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: p.COMING_SOON ? '#7c3aed' : '#e5e7eb', color: p.COMING_SOON ? '#fff' : '#333' }}>
                {p.COMING_SOON ? '✓ Activo' : 'Activar'}
              </button>
            </div>
          ))}
          {filtered.length > 20 && <p style={{ fontSize: 11, color: '#9ca3af', margin: '8px 0 0', textAlign: 'center' }}>...y {filtered.length - 20} más</p>}
        </div>
      )}
    </div>
  );
}
