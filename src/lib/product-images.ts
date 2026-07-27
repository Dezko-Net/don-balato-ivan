import { getAppwriteConfig, MEDIA_BUCKET_ID, MEDIA_PREFIXES } from './appwrite';

export const PRODUCTS_BUCKET_ID = MEDIA_BUCKET_ID; // Backward compatibility

/** Convierte fileId o rutas parciales de Appwrite en URL pública de vista. */
export function resolveStorageImageUrl(
  value?: string | null,
  bucketId: string = MEDIA_BUCKET_ID,
  prefix: keyof typeof MEDIA_PREFIXES = 'products',
): string {
  if (!value || typeof value !== 'string') return '';
  const v = value.trim();
  if (!v) return '';

  // Data URIs and blobs pass through directly
  if (v.startsWith('data:') || v.startsWith('blob:')) return v;

  // Strip mode=admin from any URL
  const clean = v.replace(/&?mode=admin/, '').replace(/\?mode=admin/, '?').replace(/\?$/, '');

  // External URLs (non-Appwrite) pass through as-is
  if ((clean.startsWith('http://') || clean.startsWith('https://')) && !clean.includes('cloud.appwrite.io')) {
    return clean;
  }

  // Appwrite Storage URLs — route through /api/image proxy to bypass auth
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return `/api/image?url=${encodeURIComponent(clean)}`;
  }

  const { endpoint, projectId } = getAppwriteConfig();

  if (clean.startsWith('/storage/buckets/')) {
    const fullUrl = `${endpoint.replace(/\/$/, '')}${clean}${clean.includes('?') ? '' : `?project=${projectId}`}`;
    return `/api/image?url=${encodeURIComponent(fullUrl)}`;
  }

  // File ID de Appwrite (sin slashes ni espacios)
  if (/^[a-zA-Z0-9]{10,}$/.test(clean) && !clean.includes('/') && !clean.includes('.')) {
    const path = MEDIA_PREFIXES[prefix] + clean;
    const fullUrl = `${endpoint}/storage/buckets/${bucketId}/files/${path}/view?project=${projectId}`;
    return `/api/image?url=${encodeURIComponent(fullUrl)}`;
  }

  return v;
}

const IMAGE_KEYS = ['IMAGEURL', 'IMAGEURL2', 'IMAGEURL3', 'IMAGEURL4', 'IMAGEURL5'] as const;

export function getProductImageUrl(product: Partial<Record<(typeof IMAGE_KEYS)[number], string | undefined>>): string {
  for (const key of IMAGE_KEYS) {
    const url = resolveStorageImageUrl(product[key]);
    if (url) return url;
  }
  return '';
}

export function normalizeProductImages<T extends Record<string, any>>(product: T): T {
  const out = { ...product };
  for (const key of IMAGE_KEYS) {
    try {
      const val = out[key];
      if (val) (out as Record<string, string>)[key] = resolveStorageImageUrl(val);
    } catch {
      // Field may not exist in Appwrite schema yet — skip silently
    }
  }
  return out;
}
