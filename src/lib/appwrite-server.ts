import { trackRead } from './appwrite-read-tracker';

/**
 * Appwrite server-side (API key) — para crear notificaciones y operaciones privilegiadas.
 */
const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';
const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const API_KEY = process.env.APPWRITE_API_KEY || '';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
});

const headers = getHeaders;

export function getServerConfig() {
  return { endpoint: APPWRITE_ENDPOINT, projectId: PROJECT_ID, databaseId: DATABASE_ID };
}

// ── Monitor de lecturas: identifica QUÉ ruta consume llamadas a Appwrite ──
// Loguea cada lectura server-side con la ruta que la originó (parseada del stack).
// En los logs de Vercel, filtra por "[AWREAD]". Silenciar con env AW_LOG_READS=0.
function logRead(op: string, collectionId: string, detail = ''): void {
  if (process.env.AW_LOG_READS === '0') return;
  let via = '';
  try {
    const lines = (new Error().stack || '').split('\n').slice(2);
    const frame =
      lines.find((l) => /[\\/](app|pages|lib|services|hooks)[\\/]/.test(l) && !/appwrite-server/.test(l)) ||
      lines[0] || '';
    via = frame.trim().replace(/^at\s+/, '').slice(0, 140);
  } catch {}
  console.log(`[AWREAD] ${op} col=${collectionId} ${detail} | via: ${via}`);
}

export async function serverListDocuments(
  collectionId: string,
  queries: string[] = []
): Promise<{ documents: Record<string, unknown>[]; total: number }> {
  const detail = `q=${queries.join('|').slice(0, 100)}`;
  logRead('list', collectionId, detail);
  trackRead('list', collectionId, detail, new Error().stack || '');
  const q = queries.length ? `?${queries.map((x, i) => `queries[${i}]=${encodeURIComponent(x)}`).join('&')}` : '';
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents${q}`,
    { headers: headers() }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `listDocuments failed: ${res.status}`);
  }
  return res.json();
}

export async function serverGetDocument(
  collectionId: string,
  documentId: string
): Promise<Record<string, unknown>> {
  const detail = `id=${documentId}`;
  logRead('get', collectionId, detail);
  trackRead('get', collectionId, detail, new Error().stack || '');
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents/${documentId}`,
    { headers: headers() }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `getDocument failed: ${res.status}`);
  }
  return res.json();
}

export async function serverCreateDocument(
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>,
  readPermissions: string[] = [],
  writePermissions: string[] = []
): Promise<Record<string, unknown>> {
  // Appwrite REST API requiere: { documentId, data: {...}, permissions: [...] }
  const body: Record<string, unknown> = { documentId, data };
  const perms = [...readPermissions, ...writePermissions];
  if (perms.length) body.permissions = perms;
  console.log('[serverCreateDoc]', collectionId, JSON.stringify(body).slice(0, 300));
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents`,
    {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `createDocument failed: ${res.status}`);
  }
  return res.json();
}

export async function serverUpdateDocument(
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents/${documentId}`,
    {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ data }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `updateDocument failed: ${res.status}`);
  }
  return res.json();
}

export async function serverDeleteDocument(
  collectionId: string,
  documentId: string
): Promise<void> {
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents/${documentId}`,
    {
      method: 'DELETE',
      headers: headers(),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `deleteDocument failed: ${res.status}`);
  }
}

export async function serverUploadFile(
  bucketId: string,
  file: File | Blob | ArrayBuffer,
  fileName: string = 'upload.jpg'
): Promise<{ $id: string }> {
  const formData = new FormData();
  const blob = file instanceof ArrayBuffer ? new Blob([file]) : file;
  formData.append('file', blob, fileName);
  formData.append('fileId', 'unique()');
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files`,
    {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
      },
      body: formData,
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `uploadFile failed: ${res.status}`);
  }
  return res.json();
}

export function getServerFileUrl(bucketId: string, fileId: string): string {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${PROJECT_ID}`;
}

export function getPublicFileUrl(bucketId: string, fileId: string): string {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${PROJECT_ID}`;
}

/** Limpia mode=admin de URLs de Appwrite Storage para usar vista pública */
export function cleanStorageUrl(url: string): string {
  if (!url) return url;
  return url.replace(/&?mode=admin/, '').replace(/\?mode=admin/, '?').replace(/\?$/, '');
}
