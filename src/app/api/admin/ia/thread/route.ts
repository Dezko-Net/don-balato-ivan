import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_CHAT_COLLECTION_ID } from '@/lib/appwrite-admin';
import { serverListDocuments, serverUpdateDocument } from '@/lib/appwrite-server';
import { getKeniaConfig, getKeniaUsage, normalizePhone } from '@/lib/kenia-runtime';

type ChatDoc = {
  $id: string;
  $createdAt?: string;
  senderRole?: string;
  message?: string;
  readByAdmin?: boolean;
  readByUser?: boolean;
};

export async function GET(req: NextRequest) {
  try {
    const phone = normalizePhone(req.nextUrl.searchParams.get('phone') || '');
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Falta el teléfono' }, { status: 400 });
    }

    const qUser = JSON.stringify({ method: 'equal', attribute: 'userId', values: [`whatsapp:${phone}`] });
    const qOrder = JSON.stringify({ method: 'orderAsc', attribute: '$createdAt' });
    const qLimit = JSON.stringify({ method: 'limit', values: [300] });
    const res = await serverListDocuments(ADMIN_CHAT_COLLECTION_ID, [qUser, qOrder, qLimit]);

    const unread = (res.documents || []).filter((doc: any) => doc.senderRole === 'user' && !doc.readByAdmin);
    await Promise.all(
      unread.map((doc: any) =>
        serverUpdateDocument(ADMIN_CHAT_COLLECTION_ID, doc.$id, { readByAdmin: true }).catch(() => null)
      )
    );

    const usage = await getKeniaUsage(phone);
    const config = await getKeniaConfig();
    const messages = ((res.documents || []) as ChatDoc[]).map((doc) => ({
      id: doc.$id,
      role: doc.senderRole === 'admin' ? 'assistant' : 'user',
      text: String(doc.message || ''),
      createdAt: doc.$createdAt || '',
      readByAdmin: !!doc.readByAdmin,
      readByUser: !!doc.readByUser,
    }));

    return NextResponse.json({
      success: true,
      thread: {
        phone,
        messages,
        usage: {
          ...usage,
          overLimit: usage.totalTokens >= config.tokenLimitPerCustomer,
          tokenLimit: config.tokenLimitPerCustomer,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'No se pudo cargar la conversación' }, { status: 500 });
  }
}
