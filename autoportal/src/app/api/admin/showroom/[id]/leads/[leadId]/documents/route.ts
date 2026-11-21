import { NextRequest, NextResponse } from 'next/server';
import { execute, query, queryOne } from '@/lib/db';
import { requireVendorLeadAccess } from '@/lib/vendor-lead-auth';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';
import { removePrivateCrmDocument, storePrivateCrmDocument } from '@/lib/private-crm-documents';

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const CATEGORIES = ['identity', 'vehicle', 'contract', 'finance', 'other'] as const;
const CONTENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const;

type RouteContext = { params: Promise<{ id: string; leadId: string }> };
type DocumentRow = {
  id: string;
  category: typeof CATEGORIES[number];
  file_name: string;
  content_type: typeof CONTENT_TYPES[number];
  size_bytes: number;
  created_at: string;
};

function isCategory(value: unknown): value is typeof CATEGORIES[number] {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

function cleanFileName(value: string): string {
  const baseName = value.split(/[\\/]/).pop() || 'document';
  return baseName.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 160) || 'document';
}

function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function hasExpectedSignature(contentType: string, bytes: Uint8Array): boolean {
  if (contentType === 'application/pdf') {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
  }
  if (contentType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === 'image/png') {
    return bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10';
  }
  if (contentType === 'image/webp') {
    return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
      && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  }
  return false;
}

async function authorizeLead(request: NextRequest, businessId: string, leadId: string) {
  const auth = await requireVendorLeadAccess(request, businessId);
  if (auth instanceof Response) return auth;
  const business = await queryOne<{ type_id: string }>(
    'SELECT type_id FROM businesses WHERE id = ? AND published = 1 AND status = \'active\'',
    [businessId],
  );
  if (!business || !isVendorLeadBusinessType(business.type_id)) {
    return NextResponse.json({ error: 'An eligible published landing page is required for this CRM.' }, { status: 403 });
  }
  const lead = await queryOne<{ id: string }>(
    'SELECT id FROM vendor_leads WHERE id = ? AND business_id = ? AND archived_at IS NULL',
    [leadId, businessId],
  );
  if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  return auth;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id: businessId, leadId } = await params;
  const auth = await authorizeLead(request, businessId, leadId);
  if (auth instanceof Response) return auth;

  try {
    const documents = await query<DocumentRow>(
      `SELECT id, category, file_name, content_type, size_bytes, created_at
         FROM vendor_lead_documents
        WHERE business_id = ? AND lead_id = ?
        ORDER BY created_at DESC, id`,
      [businessId, leadId],
    );
    return NextResponse.json({ documents }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Could not list private vendor lead documents:', error);
    return NextResponse.json({ error: 'Could not load lead documents.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id: businessId, leadId } = await params;
  const auth = await authorizeLead(request, businessId, leadId);
  if (auth instanceof Response) return auth;
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-site document uploads are not accepted.' }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart document upload.' }, { status: 415 });
  }
  const file = form.get('file');
  const category = form.get('category');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Select a document file.' }, { status: 400 });
  if (!isCategory(category)) return NextResponse.json({ error: 'Select a valid document category.' }, { status: 400 });
  if (!CONTENT_TYPES.includes(file.type as typeof CONTENT_TYPES[number])) {
    return NextResponse.json({ error: 'Use a PDF, JPEG, PNG, or WebP document.' }, { status: 415 });
  }
  if (file.size < 1 || file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'Each document must be smaller than 15 MB.' }, { status: 413 });
  }

  const data = await file.arrayBuffer();
  if (!hasExpectedSignature(file.type, new Uint8Array(data))) {
    return NextResponse.json({ error: 'The file content does not match its declared type.' }, { status: 415 });
  }

  const documentId = crypto.randomUUID();
  const objectKey = `vendor-leads/${crypto.randomUUID()}`;
  let stored = false;
  try {
    await storePrivateCrmDocument(objectKey, data, file.type);
    stored = true;
    const result = await execute(
      `INSERT INTO vendor_lead_documents
         (id, business_id, lead_id, category, file_name, content_type, size_bytes, object_key, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [documentId, businessId, leadId, category, cleanFileName(file.name), file.type, file.size, objectKey, auth.user.id],
    );
    if (result.changes !== 1) throw new Error('Private CRM document metadata was not saved.');
    const document: DocumentRow = {
      id: documentId,
      category,
      file_name: cleanFileName(file.name),
      content_type: file.type as DocumentRow['content_type'],
      size_bytes: file.size,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ document }, { status: 201, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (stored) {
      try {
        await removePrivateCrmDocument(objectKey);
      } catch (cleanupError) {
        console.error('Could not remove an orphaned private CRM document object:', cleanupError);
      }
    }
    console.error('Could not save private vendor lead document:', error);
    return NextResponse.json({ error: 'Could not save the document.' }, { status: 500 });
  }
}
