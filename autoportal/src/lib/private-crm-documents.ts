import { getCloudflareContext } from '@opennextjs/cloudflare';

interface R2ObjectLike {
  body: ReadableStream<Uint8Array> | null;
  contentType?: string | null;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | Uint8Array, options?: {
    httpMediaType?: string;
    contentType?: string;
  }): Promise<{ key: string } | null>;
  get(key: string): Promise<R2ObjectLike | null>;
  delete(key: string): Promise<void>;
}

async function getPrivateBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as unknown as { CRM_DOCUMENTS?: R2Bucket }).CRM_DOCUMENTS;
  if (!bucket) throw new Error('R2 binding "CRM_DOCUMENTS" is not available.');
  return bucket;
}

export async function storePrivateCrmDocument(
  key: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<void> {
  const bucket = await getPrivateBucket();
  const stored = await bucket.put(key, data, { httpMediaType: contentType, contentType });
  if (!stored) throw new Error('Private CRM document upload failed.');
}

export async function readPrivateCrmDocument(key: string): Promise<{
  body: ReadableStream<Uint8Array> | null;
  contentType: string;
} | null> {
  const bucket = await getPrivateBucket();
  const object = await bucket.get(key);
  if (!object) return null;
  return {
    body: object.body,
    contentType: object.httpMetadata?.contentType || object.contentType || 'application/octet-stream',
  };
}

export async function removePrivateCrmDocument(key: string): Promise<void> {
  const bucket = await getPrivateBucket();
  await bucket.delete(key);
}
