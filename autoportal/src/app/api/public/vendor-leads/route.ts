import { NextRequest, NextResponse } from 'next/server';
import { batch, queryOne } from '@/lib/db';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';

const LEAD_SOURCES = new Set(['website', 'social', 'referral', 'campaign', 'other']);

function text(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function validPhone(value: string): boolean {
  if (!/^[+\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function safeSourcePath(value: unknown): string {
  const raw = text(value, 500);
  if (!raw) return '';
  try {
    return new URL(raw, 'https://autofyon.invalid').pathname.slice(0, 300);
  } catch {
    return '';
  }
}

async function rateLimitKey(businessId: string, address: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${businessId}:${address}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get('host')) {
        return NextResponse.json({ error: 'Cross-site submissions are not accepted.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Invalid inquiry.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  if (text(body.website, 200)) {
    return NextResponse.json({ error: 'Inquiry was not accepted.' }, { status: 400 });
  }

  const slug = text(body.businessSlug, 100);
  const landingType = body.landingType;
  const name = text(body.name, 100);
  const phone = text(body.phone, 40);
  const email = text(body.email, 254);
  const inquiry = text(body.inquiry, 2000);
  const inquiryFor = text(body.inquiryFor, 160);
  const source = text(body.source, 20);
  const sourcePath = safeSourcePath(body.sourcePath);

  if (!slug || (landingType !== 'minisite' && landingType !== 'starter') || !name || !phone || inquiry.length < 3 || body.consent !== true) {
    return NextResponse.json({ error: 'Name, phone, message, and contact consent are required.' }, { status: 400 });
  }
  if (!validPhone(phone)) {
    return NextResponse.json({ error: 'Enter a valid phone number.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (source && !LEAD_SOURCES.has(source)) {
    return NextResponse.json({ error: 'Invalid inquiry source.' }, { status: 400 });
  }

  try {
    const business = landingType === 'starter'
      ? await queryOne<{ id: string; type_id: string }>(
          `SELECT b.id, b.type_id
             FROM autofyon_media_landings p
             JOIN businesses b ON b.id = p.business_id
            WHERE lower(p.slug) = lower(?) AND p.published = 1
              AND b.published = 1 AND b.status = 'active'`,
          [slug],
        )
      : await queryOne<{ id: string; type_id: string }>(
          `SELECT id, type_id FROM businesses
            WHERE lower(slug) = lower(?) AND published = 1 AND status = 'active'`,
          [slug],
        );
    if (!business || !isVendorLeadBusinessType(business.type_id)) {
      return NextResponse.json({ error: 'This business does not have an active landing-page CRM.' }, { status: 404 });
    }

    const address = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || 'unknown';
    const bucketKey = await rateLimitKey(business.id, address);
    const now = new Date().toISOString();
    const writes = await batch([
      {
        sql: `DELETE FROM vendor_lead_rate_limits
               WHERE window_started_at <= datetime('now', '-1 day')`,
      },
      {
        sql: `INSERT INTO vendor_lead_rate_limits (bucket_key, attempts, window_started_at)
              VALUES (?, 1, datetime('now'))
              ON CONFLICT(bucket_key) DO UPDATE SET
                attempts = CASE
                  WHEN vendor_lead_rate_limits.window_started_at <= datetime('now', '-1 hour') THEN 1
                  ELSE vendor_lead_rate_limits.attempts + 1
                END,
                window_started_at = CASE
                  WHEN vendor_lead_rate_limits.window_started_at <= datetime('now', '-1 hour') THEN datetime('now')
                  ELSE vendor_lead_rate_limits.window_started_at
                END`,
        params: [bucketKey],
      },
      {
        sql: `INSERT INTO vendor_leads
                (id, business_id, name, phone, email, inquiry, inquiry_for, source,
                 source_path, consent_at, created_at, updated_at)
              SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
               WHERE COALESCE((
                 SELECT attempts FROM vendor_lead_rate_limits WHERE bucket_key = ?
               ), 31) <= 30`,
        params: [
          crypto.randomUUID(), business.id, name, phone, email, inquiry, inquiryFor,
          source || 'website', sourcePath, now, now, now, bucketKey,
        ],
      },
    ]);
    if (writes[2]?.changes !== 1) {
      return NextResponse.json({ error: 'Please wait before sending another inquiry.' }, { status: 429 });
    }

    return NextResponse.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not save vendor landing-page inquiry:', error);
    return NextResponse.json({ error: 'Could not save this inquiry. Please try again.' }, { status: 500 });
  }
}
