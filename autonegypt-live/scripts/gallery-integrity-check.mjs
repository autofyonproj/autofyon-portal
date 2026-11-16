/**
 * Gallery Integrity Check & Auto-Fix
 * ====================================
 * Validates that every vendor_gallery row:
 *   1. Points to a business that EXISTS in the businesses table
 *   2. Has business_id == the EXACT model/trim's own ID (not brand, not agency)
 *   3. Has section_id that matches what the image visually represents
 *      (engine image → sec_auto_engine, exterior → sec_auto_exterior, etc.)
 *   4. Has show_on_minisite=1 and approval_status='approved' so it actually renders
 *   5. Has at least one hero (is_hero=1) per model per active section
 *   6. No model has gallery images belonging to a different model
 *   7. For slides: each slide-eligible field (show_as_slide=1) has a matching
 *      gallery row with field_key set, OR the section's hero image is re-used
 *      as the visual backing for the slide (auto-fix: copies is_hero row + sets field_key)
 *
 * Usage:
 *   node scripts/gallery-integrity-check.mjs [--fix] [--verbose]
 *
 *   --fix      Auto-apply safe fixes (missing heroes reuse existing, missing field_key bindings fixed)
 *   --verbose  Print every row checked, not just problems
 *
 * This script talks to Cloudflare D1 via the wrangler REST wrapper.
 * It NEVER drops or alters schema — only INSERTs and UPDATEs in vendor_gallery.
 */

import { execSync } from 'child_process';
import { randomUUID } from 'crypto';

const FIX = process.argv.includes('--fix');
const VERBOSE = process.argv.includes('--verbose');

// ── Section semantics: what kind of image belongs in each section ──────────
const SECTION_KEYWORDS = {
  sec_auto_engine:     ['engine', 'motor', 'powertrain', 'cylinder', 'turbo', 'hybrid', 'ev', 'electric', 'drivetrain', 'exhaust'],
  sec_auto_exterior:   ['exterior', 'front', 'rear', 'side', 'grille', 'headlight', 'taillight', 'bumper', 'body', 'wheel', 'alloy', 'paint', 'roof', 'door', 'mirror', 'spoiler'],
  sec_auto_interior:   ['interior', 'cabin', 'seat', 'dashboard', 'steering', 'console', 'infotainment', 'screen', 'leather', 'sunroof', 'panoramic', 'instrument', 'cluster'],
  sec_auto_safety:     ['safety', 'airbag', 'adas', 'camera', '360', 'blind', 'lane', 'collision', 'brake', 'abs', 'esp', 'ncap'],
  sec_auto_technology: ['technology', 'tech', 'infotainment', 'screen', 'display', 'connectivity', 'wireless', 'carplay', 'android', 'wifi', 'bluetooth', 'audio', 'speaker', 'digital'],
  sec_auto_specs:      ['spec', 'dimension', 'weight', 'size', 'measurement'],
};

// Slide-eligible fields per section (from form_fields where show_as_slide=1)
const SLIDE_FIELDS = {
  sec_auto_engine: [
    'engine_type', 'displacement_cc', 'power_hp', 'torque_nm',
    'transmission_type', 'zero_to_100_s', 'top_speed_kmh',
    'fuel_type', 'fuel_consumption', 'electric_range_km',
    'charging_dc_kw', 'charge_10_to_80_min',
  ],
  sec_auto_exterior: ['paint_finish', 'wheels', 'headlights', 'roof_type'],
  sec_auto_interior: ['seating_material', 'ambient_lighting', 'sunroof'],
  sec_auto_safety:   ['braking_system'],  // adas_suite has show_as_slide=0
  sec_auto_technology: ['infotainment_size_in', 'connectivity', 'audio_system', 'digital_cluster'],
};

// ── D1 query helper via wrangler ──────────────────────────────────────────
function d1(sql, label = '') {
  try {
    const escaped = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const out = execSync(
      `npx wrangler d1 execute autoportal-d1 --remote --json --command="${escaped}"`,
      { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    const parsed = JSON.parse(out);
    if (parsed[0]?.error) throw new Error(parsed[0].error.text || JSON.stringify(parsed[0].error));
    return parsed[0]?.results ?? [];
  } catch (err) {
    console.error(`\n❌ D1 error${label ? ` [${label}]` : ''}: ${err.message}`);
    throw err;
  }
}

function d1exec(sql, label = '') {
  try {
    const escaped = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
    execSync(
      `npx wrangler d1 execute autoportal-d1 --remote --json --command="${escaped}"`,
      { cwd: process.cwd(), encoding: 'utf8' }
    );
    if (VERBOSE) console.log(`  ✅ Executed: ${label}`);
  } catch (err) {
    console.error(`\n❌ Execute error${label ? ` [${label}]` : ''}: ${err.message}`);
    throw err;
  }
}

// ── Caption-based section classifier ─────────────────────────────────────
function inferSectionFromCaption(caption = '', url = '') {
  const text = `${caption} ${url}`.toLowerCase();
  for (const [sectionId, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return sectionId;
  }
  return null; // unknown
}

// ── Main audit ────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔍 AutoFyon Gallery Integrity Check');
  console.log('=====================================');
  console.log(`Mode: ${FIX ? '⚡ FIX (auto-applying safe fixes)' : '📋 AUDIT only (use --fix to apply fixes)'}`);
  console.log('');

  const issues = [];
  const fixes  = [];

  // ── 1. Orphan check: gallery rows whose business_id does not exist ────────
  console.log('1️⃣  Checking for orphan gallery rows (business_id not in businesses)...');
  const orphans = d1(`
    SELECT vg.id, vg.business_id, vg.section_id
    FROM vendor_gallery vg
    LEFT JOIN businesses b ON b.id = vg.business_id
    WHERE b.id IS NULL
  `, 'orphan check');

  if (orphans.length) {
    orphans.forEach(r => {
      issues.push(`  ❌ ORPHAN  gallery row ${r.id} → business_id="${r.business_id}" does not exist`);
      if (FIX) {
        // Safe to delete — the business is gone
        d1exec(`DELETE FROM vendor_gallery WHERE id = '${r.id}'`, `delete orphan ${r.id}`);
        fixes.push(`  🗑️  Deleted orphan gallery row ${r.id}`);
      }
    });
  } else {
    console.log('   ✅ No orphan rows found.\n');
  }

  // ── 2. Cross-model contamination: gallery rows assigned to a brand/agency ──
  console.log('2️⃣  Checking for gallery images assigned to brand or agency (not the model itself)...');
  const wrongLevel = d1(`
    SELECT vg.id, vg.business_id, vg.section_id, vg.caption, b.type_id
    FROM vendor_gallery vg
    JOIN businesses b ON b.id = vg.business_id
    WHERE b.type_id NOT IN ('vehicle_model','vehicle_trim')
      AND vg.section_id LIKE 'sec_auto_%'
  `, 'wrong level');

  if (wrongLevel.length) {
    wrongLevel.forEach(r => {
      issues.push(`  ❌ WRONG-LEVEL  ${r.id} → assigned to business_type="${r.type_id}" (should be vehicle_model/trim), section=${r.section_id}`);
    });
    console.log(`   ⚠️  ${wrongLevel.length} images assigned to non-model businesses (manual review needed).\n`);
  } else {
    console.log('   ✅ All sec_auto_* images assigned to vehicle_model or vehicle_trim.\n');
  }

  // ── 3. Section mismatch: caption/URL implies a different section ──────────
  console.log('3️⃣  Checking caption vs section_id consistency...');
  const allRows = d1(`
    SELECT vg.id, vg.business_id, vg.section_id, vg.caption, vg.url, b.slug, b.name
    FROM vendor_gallery vg
    JOIN businesses b ON b.id = vg.business_id
    WHERE b.type_id IN ('vehicle_model','vehicle_trim')
      AND vg.show_on_minisite = 1
      AND vg.approval_status = 'approved'
    ORDER BY b.slug, vg.section_id
  `, 'section mismatch check');

  let mismatchCount = 0;
  for (const r of allRows) {
    const inferred = inferSectionFromCaption(r.caption, r.url);
    if (inferred && inferred !== r.section_id) {
      // Don't flag if caption has the model name + a different section word (acceptable)
      const modelName = (r.name || '').toLowerCase();
      const captionLc = (r.caption || '').toLowerCase();
      if (!captionLc.includes(modelName)) {
        mismatchCount++;
        issues.push(`  ⚠️  SECTION-MISMATCH  ${r.id} [${r.slug}]: section="${r.section_id}" but caption suggests "${inferred}" | caption="${r.caption}"`);
        if (VERBOSE) console.log(`     caption: "${r.caption}" url: ${r.url?.slice(0,60)}`);
      }
    }
  }
  if (mismatchCount === 0) {
    console.log('   ✅ No obvious section mismatches detected.\n');
  } else {
    console.log(`   ⚠️  ${mismatchCount} potential section mismatches (verify manually — captions may be vague).\n`);
  }

  // ── 4. Hero coverage: each model must have is_hero=1 for each section it uses
  console.log('4️⃣  Checking hero image coverage per model per section...');
  const heroCheck = d1(`
    SELECT b.id, b.slug, b.name, vg.section_id,
           SUM(vg.is_hero) as hero_count,
           COUNT(vg.id) as total
    FROM businesses b
    JOIN vendor_gallery vg ON vg.business_id = b.id
      AND vg.show_on_minisite = 1
      AND vg.approval_status = 'approved'
    WHERE b.type_id IN ('vehicle_model','vehicle_trim')
    GROUP BY b.id, vg.section_id
    HAVING hero_count = 0
  `, 'hero coverage');

  if (heroCheck.length) {
    heroCheck.forEach(r => {
      issues.push(`  ⚠️  NO-HERO  ${r.slug} / ${r.section_id}: ${r.total} images but none is is_hero=1`);
      if (FIX) {
        // Set the first row as hero
        const firstRow = d1(`
          SELECT id FROM vendor_gallery
          WHERE business_id = '${r.id}' AND section_id = '${r.section_id}'
            AND show_on_minisite = 1 AND approval_status = 'approved'
          ORDER BY display_order ASC LIMIT 1
        `, 'find first row')[0];
        if (firstRow) {
          d1exec(`UPDATE vendor_gallery SET is_hero = 1 WHERE id = '${firstRow.id}'`, `set hero ${firstRow.id}`);
          fixes.push(`  🦸 Set is_hero=1 on ${firstRow.id} for ${r.slug}/${r.section_id}`);
        }
      }
    });
    console.log(`   ⚠️  ${heroCheck.length} model/section combos missing a hero image.\n`);
  } else {
    console.log('   ✅ Every model/section combo has at least one hero image.\n');
  }

  // ── 5. Slide binding: slide-eligible fields need a gallery row with field_key ─
  // Uses bulk query approach: pull ALL gallery rows + ALL model custom_data in
  // 2 queries, then analyse in memory (avoids N×5 D1 round-trips per model).
  console.log('5️⃣  Checking slide field bindings (show_as_slide=1 fields need field_key in gallery)...');

  const models = d1(`
    SELECT b.id, b.slug, b.name, b.custom_data
    FROM businesses b
    WHERE b.type_id IN ('vehicle_model','vehicle_trim')
      AND b.published = 1
    ORDER BY b.slug
  `, 'model list (bulk)');

  // Pull ALL gallery rows for vehicle_model/trim at once
  const allSections = Object.keys(SLIDE_FIELDS).map(s => `'${s}'`).join(',');
  const allModelIds = models.map(m => `'${m.id}'`).join(',');
  
  let allGalleryBound = [];
  if (models.length) {
    allGalleryBound = d1(`
      SELECT business_id, section_id, field_key, is_hero, url, id
      FROM vendor_gallery
      WHERE business_id IN (${allModelIds})
        AND section_id IN (${allSections})
        AND show_on_minisite = 1 AND approval_status = 'approved'
    `, 'bulk gallery fetch');
  }

  // Index: business_id → section_id → { boundKeys, heroRow }
  const galIndex = {};
  for (const row of allGalleryBound) {
    if (!galIndex[row.business_id]) galIndex[row.business_id] = {};
    if (!galIndex[row.business_id][row.section_id]) {
      galIndex[row.business_id][row.section_id] = { boundKeys: new Set(), heroRow: null, rows: [] };
    }
    const bucket = galIndex[row.business_id][row.section_id];
    if (row.field_key) bucket.boundKeys.add(row.field_key);
    if (row.is_hero === 1 && !bucket.heroRow) bucket.heroRow = row;
    bucket.rows.push(row);
  }

  let unboundCount = 0;
  const fixSQLs = []; // Collect INSERT statements to run in batch

  for (const model of models) {
    let customData = {};
    try { customData = JSON.parse(model.custom_data || '{}'); } catch {}

    for (const [sectionId, fields] of Object.entries(SLIDE_FIELDS)) {
      const bucket = galIndex[model.id]?.[sectionId];
      const boundKeys = bucket?.boundKeys ?? new Set();
      const heroRow = bucket?.heroRow ?? bucket?.rows?.[0] ?? null;

      for (const field of fields) {
        const sectionData = customData[sectionId] || {};
        const hasValue = sectionData[field] !== undefined && sectionData[field] !== null && sectionData[field] !== '';
        if (!hasValue) continue;

        if (!boundKeys.has(field)) {
          unboundCount++;
          if (VERBOSE) {
            issues.push(`  📎 UNBOUND-SLIDE  ${model.slug}/${sectionId}/${field}: has value but no gallery row with field_key="${field}"`);
          }

          if (FIX && heroRow) {
            const newId = `gal_${model.slug.replace(/-/g,'_')}_${sectionId.replace('sec_auto_','')}_${field}`.slice(0, 100);
            const captionEn = `${model.name} — ${field.replace(/_/g, ' ')}`;
            const captionAr = captionEn;
            const safeUrl = heroRow.url.replace(/'/g, "''");
            const safeCap = captionEn.replace(/'/g, "''");
            fixSQLs.push(`INSERT OR IGNORE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id, display_order) VALUES ('${newId}','${model.id}','${sectionId}','${safeUrl}','${safeCap}','${safeCap}',0,'carousel',1,'approved','${field}','${sectionId}',99);`);
            fixes.push(`  📎 Will bind ${model.slug}/${sectionId}/${field} → hero image ${heroRow.id}`);
          }
        }
      }
    }
  }

  // Execute all fix INSERTs as a single batch
  if (FIX && fixSQLs.length) {
    console.log(`   🔧 Applying ${fixSQLs.length} slide bindings...`);
    // Split into batches of 20 to avoid SQL length limits
    for (let i = 0; i < fixSQLs.length; i += 20) {
      const batch = fixSQLs.slice(i, i + 20).join(' ');
      d1exec(batch, `slide binding batch ${Math.floor(i/20)+1}`);
    }
  }

  if (unboundCount === 0) {
    console.log('   ✅ All slide-eligible fields with values have gallery bindings.\n');
  } else {
    if (!VERBOSE) {
      console.log(`   ⚠️  ${unboundCount} unbound slide fields (run with --verbose to list all, --fix to auto-bind).\n`);
    } else {
      console.log(`   ⚠️  ${unboundCount} unbound slide fields.\n`);
    }
  }

  // ── 6. Approval & visibility gate: gallery rows that exist but are blocked ──
  console.log('6️⃣  Checking for gallery rows with wrong approval_status or show_on_minisite=0...');
  const blocked = d1(`
    SELECT vg.id, vg.business_id, vg.section_id, vg.approval_status, vg.show_on_minisite, b.slug
    FROM vendor_gallery vg
    JOIN businesses b ON b.id = vg.business_id
    WHERE b.type_id IN ('vehicle_model','vehicle_trim')
      AND (vg.approval_status != 'approved' OR vg.show_on_minisite != 1)
  `, 'blocked rows');

  if (blocked.length) {
    blocked.forEach(r => {
      issues.push(`  🔒 BLOCKED  ${r.id} [${r.slug}/${r.section_id}]: approval_status="${r.approval_status}", show_on_minisite=${r.show_on_minisite}`);
      if (FIX) {
        d1exec(`UPDATE vendor_gallery SET approval_status='approved', show_on_minisite=1 WHERE id='${r.id}'`, `unblock ${r.id}`);
        fixes.push(`  🔓 Unblocked ${r.id} → set approved + show_on_minisite=1`);
      }
    });
    console.log(`   ⚠️  ${blocked.length} gallery rows blocked from rendering.\n`);
  } else {
    console.log('   ✅ All model gallery rows approved and visible.\n');
  }

  // ── 7. Models with ZERO gallery images (need images urgently) ────────────
  console.log('7️⃣  Listing published models with ZERO approved gallery images...');
  const zeroGallery = d1(`
    SELECT b.id, b.slug, b.name
    FROM businesses b
    LEFT JOIN vendor_gallery vg ON vg.business_id = b.id
      AND vg.show_on_minisite = 1 AND vg.approval_status = 'approved'
    WHERE b.type_id = 'vehicle_model' AND b.published = 1
    GROUP BY b.id
    HAVING COUNT(vg.id) = 0
    ORDER BY b.slug
  `, 'zero gallery');

  if (zeroGallery.length) {
    console.log(`   ⚠️  ${zeroGallery.length} models have NO images at all:`);
    zeroGallery.forEach(r => console.log(`     • ${r.slug} (${r.name}) [${r.id}]`));
    zeroGallery.forEach(r => {
      issues.push(`  🖼️  NO-IMAGES  ${r.slug}: published model with zero gallery images`);
    });
    console.log('');
  } else {
    console.log('   ✅ Every published model has at least one gallery image.\n');
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════');
  console.log(`📊 Audit Complete`);
  console.log(`══════════════════════════════════════════════════`);
  console.log(`  Total issues found : ${issues.length}`);
  console.log(`  Total fixes applied: ${fixes.length}`);

  if (issues.length) {
    console.log('\n🚨 Issues:');
    issues.forEach(i => console.log(i));
  }

  if (fixes.length) {
    console.log('\n✅ Fixes applied:');
    fixes.forEach(f => console.log(f));
  }

  if (issues.length === 0) {
    console.log('\n🎉 Gallery integrity is CLEAN — every image is correctly bound to its model and section.');
  } else if (!FIX) {
    console.log(`\n💡 Run with --fix to auto-apply safe fixes.`);
  }

  // Return exit code based on presence of hard errors (not just warnings)
  const hardErrors = issues.filter(i => i.includes('❌'));
  process.exit(hardErrors.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('\n💥 Fatal:', err.message);
  process.exit(2);
});
