// Client-safe notification helpers.
//
// NotificationsOverlay (a 'use client' component) must NOT import from
// notificationService.ts: that module pulls in @/lib/google-auth (which is
// `import 'server-only'`) and @/lib/appwrite-server, tainting the client bundle
// and breaking `next build`. These three functions only touch the Appwrite
// browser SDK, so they live here and are imported by client components instead.

import { getServices, getAppwriteConfig, NOTIFICATIONS_COLLECTION } from '@/lib/appwrite';

function parseDataField(data?: unknown): { link?: string; refKey?: string } {
  if (!data || typeof data !== 'string') return {};
  try {
    return JSON.parse(data) as { link?: string; refKey?: string };
  } catch {
    return {};
  }
}

function normalizeRead(doc: Record<string, unknown>): boolean {
  return !!(doc.isRead ?? doc.read ?? doc.READ);
}

export function getNotificationLink(doc: Record<string, unknown>): string | undefined {
  const direct = (doc.link || doc.LINK) as string | undefined;
  if (direct) return direct;
  return parseDataField(doc.data).link;
}

export function isNotificationUnread(doc: Record<string, unknown>): boolean {
  return !normalizeRead(doc);
}

export async function markNotificationRead(documentId: string) {
  const { databases } = getServices();
  const { databaseId } = getAppwriteConfig();
  await databases.updateDocument(databaseId, NOTIFICATIONS_COLLECTION, documentId, {
    isRead: true,
  });
}
