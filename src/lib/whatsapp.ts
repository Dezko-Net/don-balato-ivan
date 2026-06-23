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
    throw new Error('Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID env vars');
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
      throw new Error(`WhatsApp API Error: ${err}`);
    }

    const data = await res.json();
    console.log('[WhatsApp] Message sent successfully. Response:', JSON.stringify(data));
  }
}

// ─── Send a Template message ───────────────────────────────────────────────────
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  components: any[],
  token: string
): Promise<any> {
  if (!token || !WA_PHONE_NUMBER_ID) {
    throw new Error('Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID env vars');
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

  console.log('[WhatsApp] Sending template to:', to, '| template:', templateName, '| lang:', languageCode);

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

  const data = await res.json();
  console.log('[WhatsApp] Template sent successfully. Response:', JSON.stringify(data));
  return data;
}

// ─── Send an Interactive List message (menu) ───────────────────────────────────
export interface WhatsAppListRow {
  id: string;
  title: string; // máx 24 chars
  description?: string; // máx 72 chars
}
export interface WhatsAppListSection {
  title?: string; // máx 24 chars
  rows: WhatsAppListRow[];
}
export async function sendWhatsAppList(
  to: string,
  opts: {
    header?: string;
    body: string;
    footer?: string;
    buttonText: string;
    sections: WhatsAppListSection[];
  },
  token: string,
): Promise<void> {
  if (!token || !WA_PHONE_NUMBER_ID) {
    throw new Error('Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID env vars');
  }

  const url = `${WA_API_BASE}/${WA_PHONE_NUMBER_ID}/messages`;
  const clip = (s: string, n: number) => String(s || '').slice(0, n);

  const interactive: any = {
    type: 'list',
    body: { text: clip(opts.body, 1024) },
    action: {
      button: clip(opts.buttonText, 20),
      sections: opts.sections.map(sec => ({
        ...(sec.title ? { title: clip(sec.title, 24) } : {}),
        rows: sec.rows.map(r => ({
          id: clip(r.id, 200),
          title: clip(r.title, 24),
          ...(r.description ? { description: clip(r.description, 72) } : {}),
        })),
      })),
    },
  };
  if (opts.header) interactive.header = { type: 'text', text: clip(opts.header, 60) };
  if (opts.footer) interactive.footer = { text: clip(opts.footer, 60) };

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[WhatsApp] sendList error:', err);
    throw new Error(`WhatsApp API Error: ${err}`);
  }
  const data = await res.json();
  console.log('[WhatsApp] List sent successfully. Response:', JSON.stringify(data));
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
  let cleaned = phone.replace(/\D/g, '').trim();
  
  // E.164 for Chile mobile: 569XXXXXXXX (11 digits, WITH the 9 mobile prefix)
  // WhatsApp stores numbers in E.164 format — the 9 MUST be included
  // Previously we dropped the 9 which caused templates to go to a non-existent number
  if (cleaned.startsWith('569') && cleaned.length === 11) {
    return cleaned; // Already in correct E.164 format: 569XXXXXXXX
  }
  
  if (cleaned.startsWith('56')) {
    return cleaned;
  }
  
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    // Local Chilean mobile without country code: 9XXXXXXXX → 569XXXXXXXX
    return '56' + cleaned;
  }
  
  if (cleaned.length === 8) {
    // Local Chilean landline without country code or mobile prefix
    return '56' + cleaned;
  }
  
  return cleaned;
}
