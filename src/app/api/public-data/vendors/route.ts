import { NextResponse } from 'next/server';
import { serverListDocuments } from '@/lib/appwrite-server';
import { VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await serverListDocuments(VENDORS_COLLECTION_ID, [
      JSON.stringify({ method: 'equal', attribute: 'ACTIVE', values: [true] }),
      JSON.stringify({ method: 'orderAsc', attribute: 'NAME' }),
      JSON.stringify({ method: 'limit', values: [200] }),
    ]);
    return NextResponse.json({ vendors: (result.documents as any[]).map(v => ({
      id: v.$id,
      name: v.NAME || 'Tienda asociada',
      color: v.BRAND_COLOR || '#f97316',
      secondaryColor: v.BRAND_SECONDARY_COLOR || '#fb923c',
      logoUrl: v.LOGO_URL || '',
      phone: v.STORE_PHONE || v.PUBLIC_PHONE || '',
      email: v.STORE_EMAIL || v.PUBLIC_EMAIL || '',
      address: v.STORE_ADDRESS || '',
    })) });
  } catch (error: any) {
    console.error('[API public-data/vendors]', error);
    return NextResponse.json({ vendors: [] }, { status: 500 });
  }
}
