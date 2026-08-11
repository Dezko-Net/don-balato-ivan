import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments, serverCreateDocument } from '@/lib/appwrite-server';
import { VENDORS_COLLECTION_ID, VENDOR_ORDERS_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { hashPassword, generateVendorPassword } from '@/lib/vendor-auth';
import { Query } from 'appwrite';

export const dynamic = 'force-dynamic';

// GET: lista vendors con métrica agregada (para calcular comisión) — sin exponer pedidos detallados
export async function GET() {
  try {
    const vendorsRes = await serverListDocuments(VENDORS_COLLECTION_ID, [Query.limit(200)]);
    const vendors = vendorsRes.documents as any[];

    const withStats = await Promise.all(vendors.map(async (v) => {
      let totalSold = 0;
      let orderCount = 0;
      let productCount = 0;
      try {
        // Solo pedidos pagados/entregados cuentan como venta real
        const ordersRes = await serverListDocuments(VENDOR_ORDERS_COLLECTION_ID, [
          Query.equal('VENDOR_ID', v.$id),
          Query.equal('STATUS', ['paid', 'preparing', 'shipped', 'delivered']),
          Query.limit(1000),
        ]);
        orderCount = ordersRes.total;
        totalSold = (ordersRes.documents as any[]).reduce((sum, o) => sum + (Number(o.TOTAL) || 0), 0);
      } catch { /* noop */ }
      try {
        const prodRes = await serverListDocuments(PRODUCTS_COLLECTION_ID, [Query.equal('VENDOR_ID', v.$id), Query.limit(1)]);
        productCount = prodRes.total;
      } catch { /* noop */ }

      return {
        $id: v.$id,
        name: v.NAME,
        email: v.EMAIL,
        active: v.ACTIVE,
        minPurchaseAmount: v.MIN_PURCHASE_AMOUNT || 0,
        createdAt: v.CREATEDAT,
        totalSold,
        orderCount,
        productCount,
      };
    }));

    return NextResponse.json({ vendors: withStats });
  } catch (err: any) {
    console.error('[admin/vendors GET]', err);
    return NextResponse.json({ error: 'Error al listar vendedores' }, { status: 500 });
  }
}

// POST: crea un nuevo vendor con la contraseña definida por el admin
export async function POST(req: NextRequest) {
  try {
    const {
      name, email, password, minPurchaseAmount = 0,
      bankAccountHolder = '', bankRut = '', bankName = '', bankAccountType = '', bankAccountNumber = '', bankEmail = '',
      brandColor = '#f97316', brandSecondaryColor = '#fb923c', logoUrl = '', storeAddress = '', storePhone = '', storeEmail = '', storeWebsite = '',
    } = await req.json();

    if (!name || !String(name).trim()) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 });
    if (!email || !String(email).trim()) return NextResponse.json({ error: 'Falta el email' }, { status: 400 });
    if (!password || String(password).trim().length < 4) return NextResponse.json({ error: 'La contraseña debe tener al menos 4 caracteres' }, { status: 400 });

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await serverListDocuments(VENDORS_COLLECTION_ID, [Query.equal('EMAIL', normalizedEmail), Query.limit(1)]);
    if (existing.documents.length > 0) {
      return NextResponse.json({ error: 'Ya existe un vendedor con ese email' }, { status: 409 });
    }

    const plainPassword = String(password).trim();
    const now = Date.now();
    const vendor = await serverCreateDocument(VENDORS_COLLECTION_ID, 'unique()', {
      NAME: String(name).trim(),
      EMAIL: normalizedEmail,
      PASSWORD_HASH: hashPassword(plainPassword),
      ACTIVE: true,
      MIN_PURCHASE_AMOUNT: parseInt(minPurchaseAmount) || 0,
      BANK_ACCOUNT_HOLDER: bankAccountHolder,
      BANK_RUT: bankRut,
      BANK_NAME: bankName,
      BANK_ACCOUNT_TYPE: bankAccountType,
      BANK_ACCOUNT_NUMBER: bankAccountNumber,
      BANK_EMAIL: bankEmail,
      BRAND_COLOR: brandColor || '#f97316',
      BRAND_SECONDARY_COLOR: brandSecondaryColor || '#fb923c',
      LOGO_URL: logoUrl || '',
      STORE_ADDRESS: storeAddress || '',
      STORE_PHONE: storePhone || '',
      STORE_EMAIL: storeEmail || normalizedEmail,
      STORE_WEBSITE: storeWebsite || '',
      VISIBLE_AGENCIES: '[]',
      CREATEDAT: now,
      UPDATEDAT: now,
    });

    return NextResponse.json({
      ok: true,
      vendor,
      credentials: { email: normalizedEmail, password: plainPassword },
    });
  } catch (err: any) {
    console.error('[admin/vendors POST]', err);
    return NextResponse.json({ error: err.message || 'Error al crear el vendedor' }, { status: 500 });
  }
}
