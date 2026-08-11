import { NextRequest, NextResponse } from 'next/server';
import { getVendorSession } from '@/lib/vendor-auth';
import { serverListDocuments, serverCreateDocument } from '@/lib/appwrite-server';
import { PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Query } from 'appwrite';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

// GET: lista SOLO los productos del vendor autenticado (nunca confía en un vendorId del cliente)
export async function GET(req: NextRequest) {
  const session = getVendorSession(req);
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const queries = [Query.equal('VENDOR_ID', session.vendorId), Query.limit(50), Query.orderDesc('$createdAt')];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const res = await serverListDocuments(PRODUCTS_COLLECTION_ID, queries);
    return NextResponse.json({ products: res.documents, total: res.total });
  } catch (err: any) {
    console.error('[vendor/products GET]', err);
    return NextResponse.json({ error: 'Error al listar productos' }, { status: 500 });
  }
}

// POST: crea un producto, forzando VENDOR_ID al del vendor autenticado
export async function POST(req: NextRequest) {
  const session = getVendorSession(req);
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const {
      name, description, price, stock, category, subcategory,
      imageUrl, imageUrl2, imageUrl3, tags, sku, barcode,
      wholesalePrice, wholesaleMinQuantity, packMinPacks, packDiscountPct,
      details, usage, ingredients,
    } = await req.json();

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    const parsedPrice = parseFloat(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: 'El precio debe ser mayor a 0' }, { status: 400 });
    }

    const stockForSave = (stock === undefined || stock === null || stock === '') ? 99999 : Math.max(0, Math.round(Number(stock)));

    // Tags: string → array
    const tagsArray = typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : (Array.isArray(tags) ? tags : []);

    // Features: guardar SKU, barcode y ficha técnica dentro de FEATURES (mismo patrón que admin)
    const features: string[] = [];
    if (sku) features.push(`SKU: ${sku}`);
    if (barcode) features.push(`BARCODE: ${barcode}`);
    if (details || usage || ingredients) {
      features.push(`CUSTOM_TABS: ${JSON.stringify({ details: details || '', usage: usage || '', ingredients: ingredients || '' })}`);
    }

    const productData: Record<string, unknown> = {
      NAME: String(name).trim(),
      DESCRIPTION: description || '',
      PRICE: parsedPrice,
      CURRENTPRICE: parsedPrice,
      CATEGORYID: category || '',
      SUBCATEGORYID: subcategory || '',
      STOCK: stockForSave,
      ISACTIVE: stockForSave > 0,
      IMAGEURL: imageUrl || 'https://placehold.co/400x400?text=Sin+Imagen',
      IMAGEURL2: imageUrl2 || '',
      IMAGEURL3: imageUrl3 || '',
      PACKQTY: 0,
      WHOLESALEPRICE: Math.round(Number(wholesalePrice)) || parsedPrice,
      WHOLESALEMINQUANTITY: Math.round(Number(wholesaleMinQuantity)) || 0,
      PACK_MIN_PACKS: Math.round(Number(packMinPacks)) || 0,
      PACK_DISCOUNT_PCT: Math.round(Number(packDiscountPct)) || 0,
      TAGS: tagsArray,
      FEATURES: features,
      RATING: 0,
      NUMREVIEWS: 0,
      SOLDQUANTITY: 0,
      VENDOR_ID: session.vendorId,
    };

    const result = await serverCreateDocument(PRODUCTS_COLLECTION_ID, 'unique()', productData);
    revalidateTag('products');
    revalidateTag('catalog');
    revalidateTag('home');
    return NextResponse.json({ ok: true, product: result });
  } catch (err: any) {
    console.error('[vendor/products POST]', err);
    return NextResponse.json({ error: err.message || 'Error al crear el producto' }, { status: 500 });
  }
}
