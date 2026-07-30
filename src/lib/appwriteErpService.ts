import { getServices, PRODUCTS_COLLECTION, Query } from '@/lib/appwrite';

export interface AppwriteErpProduct {
  $id: string;
  sku: string;
  codigo_barra: string;
  nombre: string;
  costo_uni: number;
  precio_venta_1: number; // Precio detalle / normal
  precio_venta_2: number; // Precio mayorista
  stock: number;
  isactive: boolean;
  category: string;
  imageUrl: string | null;
  rawDocument?: any;
}

// Cargar todos los productos de Appwrite Cloud mediante cursores
export async function fetchAllAppwriteErpProducts(): Promise<AppwriteErpProduct[]> {
  try {
    const { databases } = getServices();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
    
    const allDocs: any[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const queries: any[] = [Query.limit(100)];
      if (cursor) {
        queries.push(Query.cursorAfter(cursor));
      }

      const res = await databases.listDocuments(dbId, PRODUCTS_COLLECTION, queries);
      if (res.documents && res.documents.length > 0) {
        allDocs.push(...res.documents);
        cursor = res.documents[res.documents.length - 1].$id;
        if (res.documents.length < 100) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    const items: AppwriteErpProduct[] = allDocs.map((doc: any) => ({
      $id: doc.$id,
      sku: doc.SKU || doc.sku || doc.$id,
      codigo_barra: doc.BARCODE || doc.barcode || doc.codigo_barra || doc.sku || '',
      nombre: doc.NAME || doc.name || doc.nombre || 'Sin Nombre',
      costo_uni: Number(doc.COST || doc.cost || doc.costo_uni || 0),
      precio_venta_1: Number(doc.PRICE || doc.price || doc.precio_venta_1 || 0),
      precio_venta_2: Number(doc.WHOLESALEPRICE || doc.precio_venta_2 || 0),
      stock: Number(doc.STOCK || doc.stock || 0),
      isactive: doc.ISACTIVE !== undefined ? Boolean(doc.ISACTIVE) : true,
      category: doc.CATEGORYID || doc.category || doc.categoria || 'General',
      imageUrl: doc.IMAGEURL || doc.imageUrl || doc.image || null,
      rawDocument: doc,
    }));

    console.log(`✅ Appwrite ERP: ${items.length} productos cargados.`);
    return items;
  } catch (error) {
    console.error('❌ Error al cargar productos de Appwrite:', error);
    return [];
  }
}

// Actualizar cualquier atributo de producto en Appwrite Cloud
export async function updateAppwriteErpProduct(
  productId: string,
  data: Partial<{
    nombre: string;
    codigo_barra: string;
    precio_venta_1: number;
    precio_venta_2: number;
    costo_uni: number;
    stock: number;
    isactive: boolean;
  }>
): Promise<boolean> {
  try {
    const { databases } = getServices();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';

    const payload: any = {};
    if (data.nombre !== undefined) { payload.NAME = data.nombre; payload.name = data.nombre; }
    if (data.codigo_barra !== undefined) { payload.BARCODE = data.codigo_barra; payload.barcode = data.codigo_barra; }
    if (data.precio_venta_1 !== undefined) { payload.PRICE = data.precio_venta_1; payload.price = data.precio_venta_1; }
    if (data.precio_venta_2 !== undefined) { payload.WHOLESALEPRICE = data.precio_venta_2; }
    if (data.costo_uni !== undefined) { payload.COST = data.costo_uni; payload.cost = data.costo_uni; }
    if (data.stock !== undefined) { payload.STOCK = data.stock; payload.stock = data.stock; }
    if (data.isactive !== undefined) { payload.ISACTIVE = data.isactive; }

    await databases.updateDocument(dbId, PRODUCTS_COLLECTION, productId, payload);
    console.log(`✅ Producto [${productId}] actualizado en Appwrite`);
    return true;
  } catch (error) {
    console.error(`❌ Error actualizando producto [${productId}] en Appwrite:`, error);
    return false;
  }
}
