/**
 * WhatsApp Business Cloud API – helper utilities
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages
 */

const WA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WA_API_BASE = `https://graph.facebook.com/v20.0`;

import { serverListDocuments, serverCreateDocument, serverDeleteDocument } from './appwrite-server';
import { ADMIN_CHAT_COLLECTION_ID } from './appwrite-admin';
import crypto from 'crypto';

const MAX_HISTORY = 20; // máx turnos a mantener por usuario

export function getWhatsAppDocId(msgId: string, role: 'user' | 'assistant'): string {
  const hash = crypto.createHash('md5').update(msgId).digest('hex');
  return role === 'user' ? `u_${hash}` : `a_${hash}`;
}

export async function getHistory(phone: string): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
  try {
    const qUserId = JSON.stringify({ method: 'equal', attribute: 'userId', values: [`whatsapp:${phone}`] });
    const qOrder = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
    const qLimit = JSON.stringify({ method: 'limit', values: [MAX_HISTORY] });
    
    const res = await serverListDocuments(ADMIN_CHAT_COLLECTION_ID, [qUserId, qOrder, qLimit]);
    
    // The documents are returned in descending order, we want them ascending (chronological)
    const reversedDocs = [...(res.documents || [])].reverse();
    
    return reversedDocs.map((doc: any) => ({
      role: doc.senderRole === 'admin' ? 'assistant' : 'user',
      content: doc.message || '',
    }));
  } catch (err) {
    console.error('[WhatsApp] getHistory error:', err);
    return [];
  }
}

export async function addToHistory(
  phone: string,
  role: 'user' | 'assistant',
  content: string,
  msgId?: string
): Promise<void> {
  try {
    const docId = msgId 
      ? getWhatsAppDocId(msgId, role)
      : `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    await serverCreateDocument(ADMIN_CHAT_COLLECTION_ID, docId, {
      userId: `whatsapp:${phone}`,
      senderRole: role === 'assistant' ? 'admin' : 'user',
      message: content,
      readByUser: true,
      readByAdmin: true,
    });
  } catch (err) {
    // If it's a duplicate document error, we just ignore it
    console.error('[WhatsApp] addToHistory error:', err);
  }
}

export async function clearHistory(phone: string): Promise<void> {
  try {
    const qUserId = JSON.stringify({ method: 'equal', attribute: 'userId', values: [`whatsapp:${phone}`] });
    const qLimit = JSON.stringify({ method: 'limit', values: [100] });
    
    const res = await serverListDocuments(ADMIN_CHAT_COLLECTION_ID, [qUserId, qLimit]);
    if (res.documents && res.documents.length > 0) {
      await Promise.all(
        res.documents.map((doc: any) => serverDeleteDocument(ADMIN_CHAT_COLLECTION_ID, doc.$id).catch(() => {}))
      );
    }
  } catch (err) {
    console.error('[WhatsApp] clearHistory error:', err);
  }
}

// ─── Send a plain text message ─────────────────────────────────────────────────
export async function sendWhatsAppMessage(to: string, text: string, token: string): Promise<void> {
  if (!token || !WA_PHONE_NUMBER_ID) {
    console.error('[WhatsApp] Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID env vars');
    return;
  }

  const url = `${WA_API_BASE}/${WA_PHONE_NUMBER_ID}/messages`;

  // Split long messages (WA limit is 4096 chars per message)
  const chunks = splitText(text, 4000);
  for (const chunk of chunks) {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: chunk },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[WhatsApp] sendMessage error:', err);
    }
  }
}

// ─── Send a Template message ───────────────────────────────────────────────────
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  components: any[],
  token: string
): Promise<void> {
  if (!token || !WA_PHONE_NUMBER_ID) {
    console.error('[WhatsApp] Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID env vars');
    return;
  }

  const url = `${WA_API_BASE}/${WA_PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[WhatsApp] sendTemplate error:', err);
    throw new Error(`WhatsApp API Error: ${err}`);
  }
}

// ─── Mark message as read ──────────────────────────────────────────────────────
export async function markAsRead(messageId: string, token: string): Promise<void> {
  if (!token || !WA_PHONE_NUMBER_ID) return;
  const url = `${WA_API_BASE}/${WA_PHONE_NUMBER_ID}/messages`;
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  }).catch(() => {});
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function splitText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLen;
    if (end < text.length) {
      const nl = text.lastIndexOf('\n', end);
      if (nl > start) end = nl + 1;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
}

export function formatWhatsAppPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '').trim();
  if (cleaned.startsWith('56')) {
    return cleaned;
  }
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    return '56' + cleaned;
  }
  return cleaned;
}
