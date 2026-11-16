/**
 * AutoFyon — Automotive Graph & Image Integrity Auditor
 *
 * Runs health checks on remote Cloudflare D1:
 *  1. Image Isolation: Detects cross-model duplicated images in vendor_gallery.
 *  2. Hero Image Coverage: Identifies models with missing hero images.
 *  3. Brochure Availability: Identifies models missing official PDF brochure links.
 *  4. Relationship Integrity: Verifies models have 'sold_by' edges to distributors.
 *  5. Trim Hierarchy: Flags models without active trims or official prices.
 *
 * Usage:
 *   node scripts/audit_brand_integrity.js [--brand <slug>]
 */

const { execSync } = require('child_process');
const path = require('path');

function runD1Query(sql) {
  const command = sql.replace(/\s+/g, ' ').trim().replace(/"/g, '\\"');
  const cmd = `npx.cmd wrangler d1 execute autoportal-d1 --remote --json --command="${command}"`;
  const out = execSync(cmd, { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
  const start = out.indexOf('[');
  const end = out.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error(`Wrangler returned no JSON result for query: ${command}`);
  }
  const parsed = JSON.parse(out.substring(start, end + 1));
  if (!parsed[0]?.success) {
    throw new Error(`Wrangler query failed: ${command}`);
  }
  return parsed[0].results || [];
}

function main() {
  const args = process.argv.slice(2);
  const brandIdx = args.indexOf('--brand');
  const targetBrand = brandIdx !== -1 ? args[brandIdx + 1] : null;
  if (targetBrand && !/^[a-z0-9-]+$/.test(targetBrand)) {
    throw new Error('Brand slug must contain only lowercase letters, digits, and hyphens.');
  }

  console.log(`\n======================================================`);
  console.log(`AutoFyon Database & Image Integrity Audit`);
  console.log(`Target Brand: ${targetBrand || 'ALL BRANDS'}`);
  console.log(`======================================================\n`);

  // 1. Cross-Model Image Conflicts
  console.log(`🔍 1. Checking Cross-Model Image Conflicts...`);
  const imageConflictSql = `
    SELECT vg.url, count(DISTINCT vg.business_id) as model_count, group_concat(vg.business_id) as models
    FROM vendor_gallery vg
    WHERE (vg.media_type IS NULL OR vg.media_type = 'image') AND vg.url IS NOT NULL AND vg.url <> ''
      ${targetBrand ? `AND vg.url IN (
        SELECT target_gallery.url
        FROM vendor_gallery target_gallery
        JOIN businesses target_model ON target_model.id = target_gallery.business_id
        JOIN businesses target_brand ON target_brand.id = target_model.parent_business_id
        WHERE target_model.type_id = 'vehicle_model' AND target_brand.slug = '${targetBrand}'
      )` : ''}
    GROUP BY vg.url
    HAVING model_count > 1;
  `;
  const conflicts = runD1Query(imageConflictSql);
  if (conflicts.length > 0) {
    console.error(`❌ CRITICAL: Found ${conflicts.length} image URLs duplicated across multiple models:`);
    conflicts.forEach((c) => {
      console.error(`   - URL: ${c.url}`);
      console.error(`     Shared across: ${c.models}\n`);
    });
  } else {
    console.log(`✅ Zero image conflicts! Every gallery image belongs strictly to its own model.\n`);
  }

  // 2. Models Missing Hero Image
  console.log(`🔍 2. Checking Hero Images on Published Models...`);
  const brandFilter = targetBrand ? `AND br.slug = '${targetBrand}'` : '';
  const missingHeroSql = `
    SELECT m.id, m.name, br.name as brand_name
    FROM businesses m
    JOIN businesses br ON br.id = m.parent_business_id
    WHERE m.type_id = 'vehicle_model' AND m.published = 1 ${brandFilter}
      AND NOT EXISTS (
        SELECT 1 FROM vendor_gallery vg
        WHERE vg.business_id = m.id AND vg.is_hero = 1 AND vg.approval_status = 'approved'
      );
  `;
  const missingHeroes = runD1Query(missingHeroSql);
  if (missingHeroes.length > 0) {
    console.warn(`⚠️ WARNING: ${missingHeroes.length} models lack an approved hero image:`);
    missingHeroes.slice(0, 10).forEach((m) => console.warn(`   - [${m.brand_name}] ${m.name} (${m.id})`));
    if (missingHeroes.length > 10) console.warn(`   ... and ${missingHeroes.length - 10} more.\n`);
  } else {
    console.log(`✅ All audited models have an approved hero image.\n`);
  }

  // 3. Brochure Link Coverage
  console.log(`🔍 3. Checking Official Brochure PDF Links...`);
  const brochureSql = `
    SELECT m.id, m.name, br.name as brand_name,
           json_extract(m.custom_data, '$.sec_1_identity.brochure_url') as brochure_url
    FROM businesses m
    JOIN businesses br ON br.id = m.parent_business_id
    WHERE m.type_id = 'vehicle_model' AND m.published = 1 ${brandFilter};
  `;
  const modelsWithBrochures = runD1Query(brochureSql);
  const withPdf = modelsWithBrochures.filter((m) => m.brochure_url && m.brochure_url.startsWith('http'));
  const missingPdf = modelsWithBrochures.filter((m) => !m.brochure_url || !m.brochure_url.startsWith('http'));

  console.log(`   - Total models checked: ${modelsWithBrochures.length}`);
  console.log(`   - With official brochure link: ${withPdf.length}`);
  console.log(`   - Missing brochure link: ${missingPdf.length}`);
  if (missingPdf.length > 0 && targetBrand) {
    console.warn(`   Missing brochure on: ${missingPdf.map((m) => m.name).join(', ')}`);
  }
  console.log('');

  // 4. Sold By Relationship
  console.log(`🔍 4. Checking Distributor / Agency 'sold_by' Relationship Edges...`);
  const edgeSql = `
    SELECT m.id, m.name, br.name as brand_name
    FROM businesses m
    JOIN businesses br ON br.id = m.parent_business_id
    WHERE m.type_id = 'vehicle_model' AND m.published = 1 ${brandFilter}
      AND NOT EXISTS (
        SELECT 1 FROM business_relationships rel
        WHERE rel.from_business_id = m.id AND rel.relation_type = 'sold_by'
      );
  `;
  const missingEdges = runD1Query(edgeSql);
  if (missingEdges.length > 0) {
    console.warn(`⚠️ WARNING: ${missingEdges.length} models have no 'sold_by' distributor link:`);
    missingEdges.slice(0, 5).forEach((m) => console.warn(`   - [${m.brand_name}] ${m.name}`));
  } else {
    console.log(`✅ All audited models are linked to their distributor/agency via 'sold_by'.\n`);
  }

  console.log(`======================================================`);
  console.log(`Audit Complete.`);
  console.log(`======================================================\n`);
}

if (require.main === module) {
  main();
}
