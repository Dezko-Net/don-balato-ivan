'use client';

import { useState } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Trash2, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BulkDeletePage() {
  const [skuList, setSkuList] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [results, setResults] = useState<{ deleted: number; notFound: string[]; errors: string[] } | null>(null);

  const handleDelete = async () => {
    if (!skuList.trim()) {
      alert('Pega la lista de SKUs primero');
      return;
    }

    const skus = skuList
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (skus.length === 0) {
      alert('No se encontraron SKUs válidos');
      return;
    }

    if (!confirm(`¿Eliminar ${skus.length} producto(s)? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(true);
    setResults(null);

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // Get all products first to find by SKU (paginate to get everything)
      let allProductsDocs: any[] = [];
      let cursor: string | undefined = undefined;
      let hasMore = true;

      while (hasMore) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));

        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, queries);
        allProductsDocs.push(...res.documents);

        if (res.documents.length < 100) {
          hasMore = false;
        } else {
          cursor = res.documents[res.documents.length - 1].$id;
        }
      }

      let deleted = 0;
      const notFound: string[] = [];
      const errors: string[] = [];

      for (const sku of skus) {
        try {
          // Find product by SKU (check FEATURES, TAGS, or jumpseller_id)
          const product = allProductsDocs.find((p: any) => {
            const features = p.FEATURES || '';
            const tags = p.TAGS || '';
            const jumpId = p.jumpseller_id || '';
            
            // Check FEATURES for SKU pattern
            const featMatch = features.match(/SKU:\s*(.+)/i);
            if (featMatch && featMatch[1].trim() === sku) return true;
            
            // Check TAGS for SKU
            const tagParts = tags.split(',').map((t: string) => t.trim());
            if (tagParts.includes(sku)) return true;
            
            // Check jumpseller_id
            if (jumpId === sku) return true;
            
            // Check direct SKU field if it exists
            if (p.SKU === sku) return true;
            
            return false;
          });

          if (!product) {
            notFound.push(sku);
            // Add small delay even for not found to maintain rhythm
            await new Promise(r => setTimeout(r, 100));
            continue;
          }

          await databases.deleteDocument(databaseId, PRODUCTS_COLLECTION_ID, product.$id);
          deleted++;
          
          // Add delay to avoid rate limit
          await new Promise(r => setTimeout(r, 200));
        } catch (e: any) {
          errors.push(`${sku}: ${e.message}`);
          // Add delay even on error
          await new Promise(r => setTimeout(r, 200));
        }
      }

      setResults({ deleted, notFound, errors });
      if (deleted > 0) {
        alert(`✅ ${deleted} producto(s) eliminado(s)`);
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={18} />
          Volver a Productos
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Eliminar Masivamente</h1>
        <p className="text-gray-600 mb-6">
          Pega una lista de SKUs (uno por línea) para eliminar productos en masa.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lista de SKUs
          </label>
          <textarea
            value={skuList}
            onChange={(e) => setSkuList(e.target.value)}
            placeholder="SD88758&#10;SD87522&#10;SD86402&#10;SD86259&#10;SD86242&#10;SD86228&#10;SD85191&#10;SD85153&#10;SD84149&#10;SD84132&#10;SD84118"
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm resize-none"
            disabled={isDeleting}
          />
          <p className="text-xs text-gray-500 mt-1">
            {skuList.split('\n').filter(s => s.trim()).length} SKUs detectados
          </p>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting || !skuList.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isDeleting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Eliminando...
            </>
          ) : (
            <>
              <Trash2 size={20} />
              Eliminar Productos
            </>
          )}
        </button>

        {results && (
          <div className="mt-6 space-y-4">
            {results.deleted > 0 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">Eliminados exitosamente</p>
                  <p className="text-sm text-green-700">{results.deleted} producto(s)</p>
                </div>
              </div>
            )}

            {results.notFound.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">SKUs no encontrados</p>
                  <p className="text-sm text-yellow-700">{results.notFound.length} SKU(s) no existen en la base de datos</p>
                  <details className="mt-2">
                    <summary className="text-xs text-yellow-800 cursor-pointer hover:underline">Ver lista</summary>
                    <pre className="text-xs mt-2 bg-yellow-100 p-2 rounded overflow-auto max-h-32">{results.notFound.join('\n')}</pre>
                  </details>
                </div>
              </div>
            )}

            {results.errors.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-900">Errores</p>
                  <p className="text-sm text-red-700">{results.errors.length} SKU(s) fallaron al eliminar</p>
                  <details className="mt-2">
                    <summary className="text-xs text-red-800 cursor-pointer hover:underline">Ver errores</summary>
                    <pre className="text-xs mt-2 bg-red-100 p-2 rounded overflow-auto max-h-32">{results.errors.join('\n')}</pre>
                  </details>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
