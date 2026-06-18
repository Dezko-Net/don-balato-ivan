/**
 * Appwrite server-side (API key) — para crear notificaciones y operaciones privilegiadas.
 */
const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';
const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const API_KEY =
  process.env.APPWRITE_API_KEY ||
  'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
});

const headers = getHeaders;

export function getServerConfig() {
  return { endpoint: APPWRITE_ENDPOINT, projectId: PROJECT_ID, databaseId: DATABASE_ID };
}

export async function serverListDocuments(
  collectionId: string,
  queries: string[] = []
): Promise<{ documents: Record<string, unknown>[]; total: number }> {
  const q = queries.length ? `?${queries.map((x) => `queries[]=${encodeURIComponent(x)}`).join('&')}` : '';
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
