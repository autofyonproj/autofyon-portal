import { NextRequest, NextResponse } from 'next/server';
import { batch, query, queryOne } from '@/lib/db';
import { requireAutofyonMaster } from '@/lib/admin-auth';
import {
  DEFAULT_STANDALONE_FEATURES,
  effectiveStandaloneFeatures,
  parseStandaloneFeatureOverrides,
  parseStandaloneFeatures,
} from '@/lib/standalone-license';


type TemplateRow = {
  id: string;
  name: string;
  description: string;
  features_json: string;
  active: number;
  created_at: string;
  updated_at: string;
};

type CopyRow = {
  serial: string;
  company_name: string;
  phone: string;
  template_id: string;
  feature_overrides_json: string;
  status: string;
  phone_verified_at: string | null;
  package_version: string | null;
  last_seen_at: string | null;
  follow_up_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  template_name: string;
};

function parseDate(value: unknown): string | null | undefined {
  if (value === null || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value
    ? undefined
    : value;
}

function createSerial(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `AFY-${new Date().getUTCFullYear()}-${suffix}`;
}

function createTrackingToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashTrackingToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function parseStoredJson<T>(
  value: string,
  validator: (input: unknown) => T | null,
  label: string,
): T {
  let decoded: unknown;
  try {
    decoded = JSON.parse(value);
  } catch {
    throw new Error(`Invalid stored ${label} JSON`);
  }
  const parsed = validator(decoded);
  if (!parsed) throw new Error(`Invalid stored ${label} data`);
  return parsed;
}

export async function GET(request: NextRequest) {
  const auth = await requireAutofyonMaster(request);
  if (auth instanceof Response) return auth;

  try {
    const [templateRows, copyRows, eventRows] = await Promise.all([
      query<TemplateRow>(
        `SELECT id, name, description, features_json, active, created_at, updated_at
           FROM standalone_license_templates
          ORDER BY active DESC, name`,
      ),
      query<CopyRow>(
        `SELECT c.serial, c.company_name, c.phone, c.template_id, c.feature_overrides_json,
                c.status, c.phone_verified_at, c.package_version, c.last_seen_at,
                c.follow_up_at, c.notes, c.created_at, c.updated_at, t.name AS template_name
           FROM standalone_client_copies c
           JOIN standalone_license_templates t ON t.id = c.template_id
          ORDER BY CASE WHEN c.follow_up_at IS NULL THEN 1 ELSE 0 END,
                   c.follow_up_at, c.updated_at DESC
          LIMIT 500`,
      ),
      query<{
        id: string;
        subject_type: string;
        subject_id: string;
        event_type: string;
        details_json: string;
        actor_email: string;
        created_at: string;
      }>(
        `SELECT id, subject_type, subject_id, event_type, details_json, actor_email, created_at
           FROM standalone_license_events
          ORDER BY created_at DESC
          LIMIT 200`,
      ),
    ]);

    const templates = templateRows.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      features: parseStoredJson(template.features_json, parseStandaloneFeatures, 'template features'),
      active: template.active === 1,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    }));
    const templatesById = new Map(templates.map((template) => [template.id, template.features]));
    const copies = copyRows.map((copy) => {
      const featureOverrides = parseStoredJson(
        copy.feature_overrides_json,
        parseStandaloneFeatureOverrides,
        'feature overrides',
      );
      const templateFeatures = templatesById.get(copy.template_id);
      if (!templateFeatures) throw new Error(`Missing feature template for ${copy.serial}`);
      return {
        serial: copy.serial,
        companyName: copy.company_name,
        phone: copy.phone,
        templateId: copy.template_id,
        templateName: copy.template_name,
        featureOverrides,
        effectiveFeatures: effectiveStandaloneFeatures(templateFeatures, featureOverrides),
        status: copy.status,
        phoneVerifiedAt: copy.phone_verified_at,
        packageVersion: copy.package_version,
        lastSeenAt: copy.last_seen_at,
        followUpAt: copy.follow_up_at,
        notes: copy.notes,
        createdAt: copy.created_at,
        updatedAt: copy.updated_at,
      };
    });

    return NextResponse.json({
      features: DEFAULT_STANDALONE_FEATURES,
      templates,
      copies,
      events: eventRows.map((event) => {
        let details: Record<string, unknown>;
        try {
          details = JSON.parse(event.details_json) as Record<string, unknown>;
        } catch {
          throw new Error(`Invalid stored event details for ${event.id}`);
        }
        return {
          id: event.id,
          subjectType: event.subject_type,
          subjectId: event.subject_id,
          eventType: event.event_type,
          details,
          actorEmail: event.actor_email,
          createdAt: event.created_at,
        };
      }),
    });
  } catch (error) {
    console.error('Unable to load standalone license management data:', error);
    return NextResponse.json({ error: 'Unable to load license management data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAutofyonMaster(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json() as Record<string, unknown>;

    if (body.action === 'create_template') {
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const description = typeof body.description === 'string' ? body.description.trim() : '';
      const id = typeof body.id === 'string'
        ? body.id.trim().toLowerCase()
        : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const features = parseStandaloneFeatures(body.features);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !name || name.length > 80) {
        return NextResponse.json({ error: 'Enter a valid template name and identifier' }, { status: 400 });
      }
      if (description.length > 500 || !features) {
        return NextResponse.json({ error: 'Invalid description or feature selection' }, { status: 400 });
      }
      if (await queryOne('SELECT id FROM standalone_license_templates WHERE id = ?', [id])) {
        return NextResponse.json({ error: 'A template with this identifier already exists' }, { status: 409 });
      }
      await batch([
        {
          sql: `INSERT INTO standalone_license_templates
                  (id, name, description, features_json, created_by)
                VALUES (?, ?, ?, ?, ?)`,
          params: [id, name, description, JSON.stringify(features), auth.user.id],
        },
        {
          sql: `INSERT INTO standalone_license_events
                  (id, subject_type, subject_id, event_type, details_json, actor_email)
                VALUES (?, 'template', ?, 'template_created', ?, ?)`,
          params: [crypto.randomUUID(), id, JSON.stringify({ name, features }), auth.user.email],
        },
      ]);
      return NextResponse.json({ ok: true, id }, { status: 201 });
    }

    if (body.action === 'create_copy') {
      const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : '';
      const phone = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '') : '';
      const templateId = typeof body.templateId === 'string' ? body.templateId.trim() : '';
      const followUpAt = body.followUpAt === undefined ? null : parseDate(body.followUpAt);
      const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
      const overrides = parseStandaloneFeatureOverrides(body.featureOverrides ?? {});
      if (!companyName || companyName.length > 120 || phone.length < 10 || phone.length > 15) {
        return NextResponse.json({ error: 'Enter a business name and a valid phone number' }, { status: 400 });
      }
      if (followUpAt === undefined || notes.length > 2000 || !overrides) {
        return NextResponse.json({ error: 'Invalid follow-up date, notes, or feature overrides' }, { status: 400 });
      }
      const template = await queryOne<{ id: string; active: number }>(
        'SELECT id, active FROM standalone_license_templates WHERE id = ?',
        [templateId],
      );
      if (!template || template.active !== 1) {
        return NextResponse.json({ error: 'Choose an active feature template' }, { status: 400 });
      }

      const serial = createSerial();
      await batch([
        {
          sql: `INSERT INTO standalone_client_copies
                  (serial, company_name, phone, template_id, feature_overrides_json,
                   follow_up_at, notes, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [
            serial, companyName, phone, templateId, JSON.stringify(overrides),
            followUpAt, notes, auth.user.id, auth.user.id,
          ],
        },
        {
          sql: `INSERT INTO standalone_license_events
                  (id, subject_type, subject_id, event_type, details_json, actor_email)
                VALUES (?, 'copy', ?, 'copy_created', ?, ?)`,
          params: [
            crypto.randomUUID(), serial,
            JSON.stringify({ companyName, phone, templateId, status: 'pending_verification' }),
            auth.user.email,
          ],
        },
      ]);
      return NextResponse.json({ ok: true, serial, status: 'pending_verification' }, { status: 201 });
    }

    if (body.action === 'issue_package_config') {
      const serial = typeof body.serial === 'string' ? body.serial.trim() : '';
      const copy = await queryOne<{ serial: string; status: string; phone_verified_at: string | null }>(
        'SELECT serial, status, phone_verified_at FROM standalone_client_copies WHERE serial = ?',
        [serial],
      );
      if (!copy) return NextResponse.json({ error: 'Client copy not found' }, { status: 404 });
      if (copy.status === 'revoked' || copy.status === 'suspended') {
        return NextResponse.json({ error: 'A suspended or revoked copy cannot receive a package configuration' }, { status: 409 });
      }

      const token = createTrackingToken();
      const tokenHash = await hashTrackingToken(token);
      await batch([
        {
          sql: `UPDATE standalone_client_copies
                   SET client_token_hash = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE serial = ?`,
          params: [tokenHash, auth.user.id, serial],
        },
        {
          sql: `INSERT INTO standalone_license_events
                  (id, subject_type, subject_id, event_type, details_json, actor_email)
                VALUES (?, 'copy', ?, 'package_config_issued', ?, ?)`,
          params: [
            crypto.randomUUID(),
            serial,
            JSON.stringify({ status: copy.status, phoneVerified: Boolean(copy.phone_verified_at) }),
            auth.user.email,
          ],
        },
      ]);
      return NextResponse.json({ ok: true, clientTrackingToken: token });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('Unable to create standalone license record:', error);
    return NextResponse.json({ error: 'Unable to create license record' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAutofyonMaster(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json() as Record<string, unknown>;

    if (body.action === 'update_template') {
      const id = typeof body.id === 'string' ? body.id.trim() : '';
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const description = typeof body.description === 'string' ? body.description.trim() : '';
      const active = body.active === true ? 1 : body.active === false ? 0 : null;
      const features = parseStandaloneFeatures(body.features);
      if (!id || !name || name.length > 80 || description.length > 500 || active === null || !features) {
        return NextResponse.json({ error: 'Invalid template update' }, { status: 400 });
      }
      if (!await queryOne('SELECT id FROM standalone_license_templates WHERE id = ?', [id])) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
      await batch([
        {
          sql: `UPDATE standalone_license_templates
                   SET name = ?, description = ?, features_json = ?, active = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
          params: [name, description, JSON.stringify(features), active, id],
        },
        {
          sql: `INSERT INTO standalone_license_events
                  (id, subject_type, subject_id, event_type, details_json, actor_email)
                VALUES (?, 'template', ?, 'template_updated', ?, ?)`,
          params: [crypto.randomUUID(), id, JSON.stringify({ name, active: active === 1, features }), auth.user.email],
        },
      ]);
      return NextResponse.json({ ok: true });
    }

    if (body.action === 'update_copy') {
      const serial = typeof body.serial === 'string' ? body.serial.trim() : '';
      const copy = await queryOne<{
        serial: string;
        company_name: string;
        phone: string;
        status: string;
        template_id: string;
        feature_overrides_json: string;
        phone_verified_at: string | null;
        follow_up_at: string | null;
        notes: string;
        package_version: string | null;
      }>(
        `SELECT serial, company_name, phone, status, template_id, feature_overrides_json, phone_verified_at,
                follow_up_at, notes, package_version
           FROM standalone_client_copies WHERE serial = ?`,
        [serial],
      );
      if (!copy) return NextResponse.json({ error: 'Client copy not found' }, { status: 404 });

      const status = body.status === undefined ? copy.status : body.status;
      if (!['pending_verification', 'active', 'suspended', 'revoked'].includes(String(status))) {
        return NextResponse.json({ error: 'Invalid copy status' }, { status: 400 });
      }
      if (status === 'active' && !copy.phone_verified_at) {
        return NextResponse.json(
          { error: 'This copy cannot be activated until its WhatsApp phone is verified.' },
          { status: 409 },
        );
      }
      if (copy.status === 'revoked' && status !== 'revoked') {
        return NextResponse.json({ error: 'Revoked copies cannot be reactivated' }, { status: 409 });
      }

      const templateId = body.templateId === undefined
        ? copy.template_id
        : typeof body.templateId === 'string' ? body.templateId.trim() : '';
      const companyName = body.companyName === undefined
        ? copy.company_name
        : typeof body.companyName === 'string' ? body.companyName.trim() : '';
      const phone = body.phone === undefined
        ? copy.phone
        : typeof body.phone === 'string' ? body.phone.replace(/\D/g, '') : '';
      if (!companyName || companyName.length > 120 || phone.length < 10 || phone.length > 15) {
        return NextResponse.json({ error: 'Enter a business name and a valid phone number' }, { status: 400 });
      }
      const template = await queryOne<{ id: string; active: number }>(
        'SELECT id, active FROM standalone_license_templates WHERE id = ?',
        [templateId],
      );
      if (!template || (template.active !== 1 && templateId !== copy.template_id)) {
        return NextResponse.json({ error: 'Choose an active feature template' }, { status: 400 });
      }

      const featureOverrides = body.featureOverrides === undefined
        ? parseStandaloneFeatureOverrides(JSON.parse(copy.feature_overrides_json))
        : parseStandaloneFeatureOverrides(body.featureOverrides);
      const requestedFollowUpAt = body.followUpAt === undefined ? copy.follow_up_at : parseDate(body.followUpAt);
      const notes = body.notes === undefined
        ? copy.notes
        : typeof body.notes === 'string' ? body.notes.trim() : null;
      const packageVersion = body.packageVersion === undefined
        ? copy.package_version
        : typeof body.packageVersion === 'string'
          ? body.packageVersion.trim() || null
          : body.packageVersion === null ? null : undefined;
      if (!featureOverrides || requestedFollowUpAt === undefined ||
          notes === null || notes.length > 2000 ||
          packageVersion === undefined || packageVersion !== null && packageVersion.length > 40) {
        return NextResponse.json({ error: 'Invalid copy update' }, { status: 400 });
      }

      const previousStatus = copy.status;
      await batch([
        {
          sql: `UPDATE standalone_client_copies
                   SET company_name = ?, phone = ?, template_id = ?, feature_overrides_json = ?, status = ?,
                       follow_up_at = ?, notes = ?, package_version = ?,
                       updated_by = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE serial = ?`,
          params: [
            companyName,
            phone,
            templateId,
            JSON.stringify(featureOverrides),
            status,
            requestedFollowUpAt,
            notes,
            packageVersion,
            auth.user.id,
            serial,
          ],
        },
        {
          sql: `INSERT INTO standalone_license_events
                  (id, subject_type, subject_id, event_type, details_json, actor_email)
                VALUES (?, 'copy', ?, ?, ?, ?)`,
          params: [
            crypto.randomUUID(),
            serial,
            previousStatus !== status ? 'copy_status_changed' : 'copy_updated',
            JSON.stringify({ companyName, phone, status, templateId, followUpAt: requestedFollowUpAt, packageVersion }),
            auth.user.email,
          ],
        },
      ]);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('Unable to update standalone license record:', error);
    return NextResponse.json({ error: 'Unable to update license record' }, { status: 500 });
  }
}
