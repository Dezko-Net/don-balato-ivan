import { NextRequest, NextResponse } from 'next/server';
import { serverUpdateDocument, serverDeleteDocument } from '@/lib/appwrite-server';
import { VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { hashPassword } from '@/lib/vendor-auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = { UPDATEDAT: Date.now() };
    let newPassword: string | null = null;

    if (body.active !== undefined) updateData.ACTIVE = !!body.active;
    if (body.minPurchaseAmount !== undefined) updateData.MIN_PURCHASE_AMOUNT = parseInt(body.minPurchaseAmount) || 0;
    if (body.bankAccountHolder !== undefined) updateData.BANK_ACCOUNT_HOLDER = body.bankAccountHolder;
    if (body.bankRut !== undefined) updateData.BANK_RUT = body.bankRut;
    if (body.bankName !== undefined) updateData.BANK_NAME = body.bankName;
    if (body.bankAccountType !== undefined) updateData.BANK_ACCOUNT_TYPE = body.bankAccountType;
    if (body.bankAccountNumber !== undefined) updateData.BANK_ACCOUNT_NUMBER = body.bankAccountNumber;
    if (body.bankEmail !== undefined) updateData.BANK_EMAIL = body.bankEmail;
    if (body.brandColor !== undefined) updateData.BRAND_COLOR = body.brandColor;
    if (body.brandSecondaryColor !== undefined) updateData.BRAND_SECONDARY_COLOR = body.brandSecondaryColor;
    if (body.logoUrl !== undefined) updateData.LOGO_URL = body.logoUrl;
    if (body.storeAddress !== undefined) updateData.STORE_ADDRESS = body.storeAddress;
    if (body.storePhone !== undefined) updateData.STORE_PHONE = body.storePhone;
    if (body.storeEmail !== undefined) updateData.STORE_EMAIL = body.storeEmail;
    if (body.storeWebsite !== undefined) updateData.STORE_WEBSITE = body.storeWebsite;
    if (body.resetPassword) {
      const pwd = typeof body.newPassword === 'string' ? body.newPassword.trim() : '';
      if (pwd.length < 4) {
        return NextResponse.json({ error: 'La contraseña debe tener al menos 4 caracteres' }, { status: 400 });
      }
      newPassword = pwd;
      updateData.PASSWORD_HASH = hashPassword(pwd);
    }

    const vendor = await serverUpdateDocument(VENDORS_COLLECTION_ID, id, updateData);
    return NextResponse.json({ ok: true, vendor, ...(newPassword ? { newPassword } : {}) });
  } catch (err: any) {
    console.error('[admin/vendors PATCH]', err);
    return NextResponse.json({ error: err.message || 'Error al actualizar el vendedor' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await serverDeleteDocument(VENDORS_COLLECTION_ID, id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[admin/vendors DELETE]', err);
    return NextResponse.json({ error: err.message || 'Error al eliminar el vendedor' }, { status: 500 });
  }
}
