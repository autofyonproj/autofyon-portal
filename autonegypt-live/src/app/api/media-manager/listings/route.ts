import { NextRequest, NextResponse } from 'next/server';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { batch, query, queryOne } from '@/lib/db';
import { deleteImage, isAllowedImageType, mediaUrl, putImage } from '@/lib/media';
import { resolveSections } from '@/lib/minisite';
import { assertSellable, assertUnitOverrideKey, TypologyError } from '@/lib/typology';


type ListingPayload = {
  businessId?: unknown;
  brandId?: unknown;
  modelId?: unknown;
  trimId?: unknown;
  title?: unknown;
  titleAr?: unknown;
  unitKind?: unknown;
  vehicleCategory?: unknown;
  year?: unknown;
  mileageKm?: unknown;
  priceEgp?: unknown;
  negotiable?: unknown;
  color?: unknown;
  colorAr?: unknown;
  specs?: unknown;
};

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function integer(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'vehicle';
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) return NextResponse.json({ error: 'Sign in to your AUTOFYON business account to publish a vehicle.' }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart form data.' }, { status: 415 });
  }
  let payload: ListingPayload;
  try {
    const raw = form.get('listing');
    if (typeof raw !== 'string') throw new Error('Missing listing details.');
    payload = JSON.parse(raw) as ListingPayload;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid listing details.' }, { status: 400 });
  }

  const businessId = text(payload.businessId, 100);
  const brandId = text(payload.brandId, 100);
  const modelId = text(payload.modelId, 100);
  const trimId = text(payload.trimId, 100);
  const title = text(payload.title, 120);
  const titleAr = text(payload.titleAr, 120);
  const unitKind = payload.unitKind;
  const vehicleCategory = payload.vehicleCategory;
  const year = integer(payload.year);
  const mileageKm = integer(payload.mileageKm);
  const priceEgp = integer(payload.priceEgp);
  const color = text(payload.color, 60);
  const colorAr = text(payload.colorAr, 60);
  const specs = payload.specs && typeof payload.specs === 'object' && !Array.isArray(payload.specs)
    ? payload.specs as Record<string, unknown>
    : {};

  if (!businessId || !brandId || !modelId || !title || !titleAr) {
    return NextResponse.json({ error: 'Business, classified vehicle model, Arabic title, and English title are required.' }, { status: 400 });
  }
  if (!['new', 'used', 'demo', 'lease_return'].includes(String(unitKind))) {
    return NextResponse.json({ error: 'Choose a valid vehicle condition.' }, { status: 400 });
  }
  if (!['car', 'motorcycle', 'scooter', 'commercial'].includes(String(vehicleCategory))) {
    return NextResponse.json({ error: 'Choose a valid vehicle category.' }, { status: 400 });
  }
  if (year === null || year < 1886 || year > new Date().getUTCFullYear() + 1) {
    return NextResponse.json({ error: 'Enter a valid model year.' }, { status: 400 });
  }
  if (mileageKm === null || mileageKm < 0) {
    return NextResponse.json({ error: 'Enter a non-negative whole-number odometer reading.' }, { status: 400 });
  }
  if (priceEgp === null || priceEgp <= 0) {
    return NextResponse.json({ error: 'Enter a positive whole-number asking price in EGP.' }, { status: 400 });
  }
  if (typeof payload.negotiable !== 'boolean') {
    return NextResponse.json({ error: 'Specify whether the price is negotiable.' }, { status: 400 });
  }
  if (!canAccessBusiness(user, businessId)) return NextResponse.json({ error: 'You do not have access to this showroom.' }, { status: 403 });

  const photos = form.getAll('photos').filter((file): file is File => file instanceof File && file.size > 0);
  if (!photos.length || photos.length > 8) return NextResponse.json({ error: 'Add between 1 and 8 vehicle photos.' }, { status: 400 });
  if (photos.some((file) => !isAllowedImageType(file.type) || file.size > 10 * 1024 * 1024)
    || photos.reduce((sum, file) => sum + file.size, 0) > 40 * 1024 * 1024) {
    return NextResponse.json({ error: 'Use supported images no larger than 10 MB each and 40 MB total.' }, { status: 413 });
  }

  try {
    const [seller, model, sectionRows, definedFields] = await Promise.all([
      assertSellable(businessId),
      queryOne<{ id: string; type_id: string; status: string; parent_business_id: string | null }>(
        `SELECT id, type_id, status, parent_business_id FROM businesses WHERE id = ?`,
        [modelId],
      ),
      resolveSections('vehicle_model'),
      query<{ name: string; field_type: string; options: string | null }>(
        `SELECT name, field_type, options FROM form_fields
          WHERE business_type_id = 'vehicle_model' AND section_id = 'sec_auto_specs'
          ORDER BY sort_order`,
      ),
    ]);
    if (!model || model.type_id !== 'vehicle_model' || model.status !== 'active' || model.parent_business_id !== brandId) {
      return NextResponse.json({ error: 'Choose a model belonging to the selected AUTOFYON brand classification.' }, { status: 400 });
    }
    const brand = await queryOne<{ type_id: string; status: string }>(
      `SELECT type_id, status FROM businesses WHERE id = ?`,
      [brandId],
    );
    if (!brand || brand.type_id !== 'vehicle_brand' || brand.status !== 'active') {
      return NextResponse.json({ error: 'Choose an active brand from the AUTOFYON classifications.' }, { status: 400 });
    }
    if (trimId) {
      const trim = await queryOne<{ type_id: string; status: string; parent_business_id: string | null }>(
        `SELECT type_id, status, parent_business_id FROM businesses WHERE id = ?`,
        [trimId],
      );
      if (!trim || trim.type_id !== 'vehicle_trim' || trim.status !== 'active' || trim.parent_business_id !== modelId) {
        return NextResponse.json({ error: 'Choose a vehicle grade belonging to the selected model.' }, { status: 400 });
      }
    }
    const imageSection = sectionRows.find((section) => section.id === 'sec_auto_exterior' && section.enable_gallery === 1)
      ?? sectionRows.find((section) => section.enable_gallery === 1);
    if (!imageSection) throw new Error('The vehicle classification has no enabled photo gallery shelf.');

    const schema = new Map(definedFields.map((field) => [field.name, field]));
    const cleanSpecs: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(specs)) {
      const definition = schema.get(key);
      if (!definition || value === '' || value === null || value === undefined) continue;
      await assertUnitOverrideKey('sec_auto_specs', key);
      if (definition.field_type === 'select') {
        let options: { enum?: unknown[] } = {};
        try { options = JSON.parse(definition.options || '{}') as typeof options; } catch {}
        if (!Array.isArray(options.enum) || !options.enum.includes(value)) {
          return NextResponse.json({ error: `Choose a valid value for ${key}.` }, { status: 400 });
        }
        cleanSpecs[key] = String(value);
      } else if (definition.field_type === 'number') {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) return NextResponse.json({ error: `Enter a valid non-negative value for ${key}.` }, { status: 400 });
        cleanSpecs[key] = number;
      } else {
        cleanSpecs[key] = text(value, 120);
      }
    }

    const id = `unit_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;
    const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();
    const unitOverrides = Object.keys(cleanSpecs).length ? { sec_auto_specs: cleanSpecs } : {};
    const approvalStatus = user.role === 'platform_admin' ? 'approved' : 'pending';
    const uploaded: Array<{ key: string; url: string }> = [];
    try {
      for (const photo of photos) {
        const stored = await putImage(await photo.arrayBuffer(), photo.type, photo.name);
        uploaded.push({ key: stored.key, url: mediaUrl(stored.key) });
      }
      const statements = [
        {
          sql: `INSERT INTO units (
            id, market_id, seller_business_id, owner_business_id, stock_source,
            model_business_id, trim_business_id, slug, title, title_ar, unit_kind,
            vehicle_category, status, year, mileage_km, color, color_ar,
            price_egp, price_currency, negotiable, media, overrides,
            published, created_at, updated_at
          ) VALUES (?, 'automotive', ?, ?, 'own_stock', ?, ?, ?, ?, ?, ?, ?, 'available', ?, ?, ?, ?, ?, 'EGP', ?, '{}', ?, 1, ?, ?)`,
          params: [
            id, seller.id, seller.id, modelId, trimId || null, slug, title, titleAr,
            unitKind, vehicleCategory, year, mileageKm, color || null, colorAr || null,
            priceEgp, payload.negotiable ? 1 : 0, JSON.stringify(unitOverrides), now, now,
          ],
        },
        {
          sql: `INSERT INTO price_snapshots
            (id, subject_type, subject_id, price_egp, currency, source_type, source_url, captured_by, captured_at)
           VALUES (?, 'unit', ?, ?, 'EGP', 'dealer_listing', ?, ?, ?)`,
          params: [`ps_${id}`, id, priceEgp, `/u/${slug}`, user.id, now],
        },
        ...uploaded.map((photo, index) => ({
          sql: `INSERT INTO vendor_gallery
            (id, business_id, section_id, url, display_order, placement, is_hero,
             show_on_minisite, approval_status, media_type, unit_id)
           VALUES (?, ?, ?, ?, ?, 'both', ?, 1, ?, 'image', ?)`,
          params: [
            `gal_${crypto.randomUUID().slice(0, 12)}`, seller.id, imageSection.id,
            photo.url, index + 1, index === 0 ? 1 : 0, approvalStatus, id,
          ],
        })),
      ];
      await batch(statements);
    } catch (error) {
      const cleanup = await Promise.allSettled(uploaded.map((photo) => deleteImage(photo.key)));
      const failures = cleanup.filter((result) => result.status === 'rejected');
      if (failures.length) console.error('Could not clean up uploaded vehicle photos after listing failure:', failures);
      throw error;
    }

    return NextResponse.json({
      ok: true,
      id,
      slug,
      publicPath: `/u/${slug}`,
      photoCount: uploaded.length,
      photoApproval: approvalStatus,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof TypologyError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error('Could not publish Media Manager vehicle listing:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not publish this vehicle listing.' }, { status: 500 });
  }
}
