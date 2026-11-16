import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';
import {
  CUSTOM_SITE_OVERRIDE_FIELDS, parseCustomSiteProfile, SITE_TEMPLATES,
  type CustomSiteOverrideField,
} from '@/lib/site-builder';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function platformAdmin() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/custom-sites', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  return user?.role === 'platform_admin' ? user : null;
}

export async function PUT(request: Request) {
  const user = await platformAdmin();
  if (!user) return json({ error: 'platform admin required' }, 403);

  let body: {
    businessId?: unknown;
    templateId?: unknown;
    inventoryOptions?: unknown;
    overrideOptions?: unknown;
  };
  try {
    body = await request.json() as typeof body;
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }

  if (typeof body.businessId !== 'string' || !body.businessId.trim()) {
    return json({ error: 'businessId is required' }, 400);
  }
  if (typeof body.templateId !== 'string' || !SITE_TEMPLATES.some((item) => item.id === body.templateId)) {
    return json({ error: 'unknown site template' }, 400);
  }
  if (!body.inventoryOptions || typeof body.inventoryOptions !== 'object' || Array.isArray(body.inventoryOptions)) {
    return json({ error: 'inventoryOptions must be an object' }, 400);
  }
  if (
    !Array.isArray(body.overrideOptions) ||
    body.overrideOptions.some((field) =>
      typeof field !== 'string' || !CUSTOM_SITE_OVERRIDE_FIELDS.includes(field as CustomSiteOverrideField),
    )
  ) {
    return json({ error: 'overrideOptions contains an unsupported field' }, 400);
  }

  const options = body.inventoryOptions as Record<string, unknown>;
  const optionKeys = [
    'showYear',
    'showPrice',
    'showAvailability',
    'showMileage',
    'showAutofyonDetailsLink',
  ] as const;
  if (optionKeys.some((key) => typeof options[key] !== 'boolean') ||
      Object.keys(options).some((key) => !optionKeys.includes(key as typeof optionKeys[number]))) {
    return json({ error: 'inventoryOptions contains unsupported or non-boolean fields' }, 400);
  }

  const business = await queryOne<{ id: string }>(
    `SELECT id FROM businesses
      WHERE id = ? AND custom_domain IS NOT NULL AND status = 'active' AND published = 1`,
    [body.businessId],
  );
  if (!business) return json({ error: 'active custom-domain business not found' }, 404);

  const profile = parseCustomSiteProfile(
    body.templateId,
    JSON.stringify(Object.fromEntries(optionKeys.map((key) => [key, options[key]]))),
    JSON.stringify([...new Set(body.overrideOptions as CustomSiteOverrideField[])]),
  );
  const updatedAt = new Date().toISOString();
  await execute(
    `INSERT INTO custom_site_profiles (business_id, template_id, inventory_options, override_options, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(business_id) DO UPDATE SET
       template_id = excluded.template_id,
       inventory_options = excluded.inventory_options,
       override_options = excluded.override_options,
       updated_at = excluded.updated_at`,
    [
      business.id,
      profile.templateId,
      JSON.stringify(profile.inventoryOptions),
      JSON.stringify(profile.overrideOptions),
      updatedAt,
    ],
  );

  return json({ ok: true, profile });
}
