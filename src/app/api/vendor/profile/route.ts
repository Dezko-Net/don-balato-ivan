import { NextRequest, NextResponse } from 'next/server';
import { getVendorSession } from '@/lib/vendor-auth';
import { serverGetDocument, serverUpdateDocument } from '@/lib/appwrite-server';
import { VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

const branding = (vendor: any) => ({
  name: vendor.NAME || '', email: vendor.EMAIL || '',
  brandColor: vendor.BRAND_COLOR || '#f97316', brandSecondaryColor: vendor.BRAND_SECONDARY_COLOR || '#fb923c',
  logoUrl: vendor.LOGO_URL || '', storeAddress: vendor.STORE_ADDRESS || '',
  storePhone: vendor.STORE_PHONE || '', storeEmail: vendor.STORE_EMAIL || vendor.EMAIL || '', storeWebsite: vendor.STORE_WEBSITE || '',
});

export async function GET(req: NextRequest) {
  const session = getVendorSession(req);
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  try { return NextResponse.json({ vendor: branding(await serverGetDocument(VENDORS_COLLECTION_ID, session.vendorId)) }); }
  catch { return NextResponse.json({ error: 'No se pudo cargar el perfil' }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  const session = getVendorSession(req);
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  try {
    const body = await req.json();
    const data: Record<string, unknown> = { UPDATEDAT: Date.now() };
    for (const [input, field] of Object.entries({ brandColor: 'BRAND_COLOR', brandSecondaryColor: 'BRAND_SECONDARY_COLOR', logoUrl: 'LOGO_URL', storeAddress: 'STORE_ADDRESS', storePhone: 'STORE_PHONE', storeEmail: 'STORE_EMAIL', storeWebsite: 'STORE_WEBSITE' })) {
      if (body[input] !== undefined) data[field] = String(body[input] || '').trim();
    }
    const vendor = await serverUpdateDocument(VENDORS_COLLECTION_ID, session.vendorId, data);
    return NextResponse.json({ ok: true, vendor: branding(vendor) });
  } catch (error: any) { return NextResponse.json({ error: error.message || 'No se pudo guardar el perfil' }, { status: 500 }); }
}
