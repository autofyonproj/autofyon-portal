import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { requireVendorLeadAccess } from '@/lib/vendor-lead-auth';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';
import { readPrivateCrmDocument, removePrivateCrmDocument } from '@/lib/private-crm-documents';

type RouteContext = { params: Promise<{ id: string; documentId: string }> };
type DocumentRow = {
  id: string;
  lead_id: string;
  file_name: string;
  content_type: string;
  object_key: string;
};

async function authorizeDocument(request: NextRequest, businessId: string, documentId: string) {
  const auth = await requireVendorLeadAccess(request, businessId);
  if (auth instanceof Response) return auth;
  const business = await queryOne<{ type_id: string }>(
    'SELECT type_id FROM businesses WHERE id = ? AND published = 1 AND status = \'active\'',
    [businessId],
  );
  if (!business || !isVendorLeadBusinessType(business.type_id)) {
    return NextResponse.json({ error: 'An eligible published landing page is required for this CRM.' }, { status: 403 });
  }
  const document = await queryOne<DocumentRow>(
    `SELECT d.id, d.lead_id, d.file_name, d.content_type, d.object_key
       FROM vendor_lead_documents d
       JOIN vendor_leads l ON l.id = d.lead_id AND l.business_id = d.business_id
      WHERE d.id = ? AND d.business_id = ? AND l.archived_at IS NULL`,
    [documentId, businessId],
  );
  if (!document) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  return { auth, document };
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

function encodedFileName(value: string): string {
  return encodeURIComponent(value).replace(/['()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id: businessId, documentId } = await params;
  const authorized = await authorizeDocument(request, businessId, documentId);
  if (authorized instanceof Response) return authorized;

  try {
    const object = await readPrivateCrmDocument(authorized.document.object_key);
    if (!object?.body) return NextResponse.json({ error: 'Document content is unavailable.' }, { status: 404 });
    const safeName = authorized.document.file_name.replace(/["\\\r\n]/g, '_').slice(0, 160) || 'document';
    return new Response(object.body, {
      headers: {
        'Content-Type': authorized.document.content_type,
        'Content-Disposition': `attachment; filename="${safeName}"; filename*=UTF-8''${encodedFileName(authorized.document.file_name)}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Could not read private vendor lead document:', error);
    return NextResponse.json({ error: 'Could not read the document.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id: businessId, documentId } = await params;
  const authorized = await authorizeDocument(request, businessId, documentId);
  if (authorized instanceof Response) return authorized;
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-site document deletion is not accepted.' }, { status: 403 });
  }

  try {
    const result = await execute(
      'DELETE FROM vendor_lead_documents WHERE id = ? AND business_id = ?',
      [documentId, businessId],
    );
    if (result.changes !== 1) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    try {
      await removePrivateCrmDocument(authorized.document.object_key);
    } catch (error) {
      console.error('Private CRM document metadata was deleted but its object cleanup failed:', error);
      return NextResponse.json({ error: 'The document was removed from CRM, but private storage cleanup failed.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Could not delete private vendor lead document:', error);
    return NextResponse.json({ error: 'Could not delete the document.' }, { status: 500 });
  }
}
