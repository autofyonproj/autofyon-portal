# Gallery Integrity Rule
# ======================
# This file is the authoritative contract for the vendor_gallery table.
# Every agent, script, or admin must enforce ALL rules below before writing
# to vendor_gallery. Run the check script after any bulk change.
#
# Run audit:   node scripts/gallery-integrity-check.mjs --verbose
# Run fix:     node scripts/gallery-integrity-check.mjs --fix

## Rule 1 — Business ID Isolation (HARD CONSTRAINT)
Every `vendor_gallery` row's `business_id` MUST equal the EXACT model's or trim's
own `businesses.id`. Never use the brand's ID or the agency's ID.

Correct:   business_id = 'biz_model_mg_mg_zs'  → shows on /mg-zs
Incorrect: business_id = 'biz_brand_mg'         → bleeds onto all MG pages

## Rule 2 — Section Lock (HARD CONSTRAINT)
`section_id` must match the visual content of the image:

| section_id            | Image shows                        |
|-----------------------|------------------------------------|
| sec_auto_exterior     | exterior body, grille, lights, wheels, paint |
| sec_auto_interior     | cabin, seats, dashboard, steering, sunroof   |
| sec_auto_engine       | engine bay, motor, drivetrain, EV components |
| sec_auto_safety       | airbags, ADAS cameras, 360 view, brakes      |
| sec_auto_technology   | infotainment screen, cluster, connectivity   |
| sec_auto_specs        | dimension drawings, weight labels            |

## Rule 3 — Approval Gate (REQUIRED TO RENDER)
Every gallery row that should appear on the site MUST have:
  - `show_on_minisite = 1`
  - `approval_status  = 'approved'`

The gallery query in minisite.ts filters on both conditions. A row without
these values is invisible to visitors.

## Rule 4 — Hero per Section (REQUIRED FOR CAROUSEL)
Every (business_id, section_id) pair that has ANY gallery rows MUST have
at least ONE row where `is_hero = 1`.

The carousel renders the hero first. Without a hero the section appears
empty even if images exist.

## Rule 5 — Slide Field Binding (REQUIRED FOR SPEC SLIDES)
Slides in the carousel are built by `buildSlides()` in minisite.ts.
For every field with `show_as_slide = 1` in `form_fields`:

  a. If a gallery row has `field_key = <field_name>` and
     `field_section_id = <section_id>`, that image is the slide's visual.

  b. If NO such row exists but the field has a value in `custom_data`,
     the system renders a "typographic placeholder" slide (glass-pane, no photo).

  c. Auto-fix: when a model has a hero image for a section but no bound
     field images, the check script can clone the hero row with the missing
     `field_key` to give spec slides a visual backing.

## Rule 6 — Cross-Brand Prohibition
Toyota images MUST NOT appear on MG pages and vice versa.
The check script validates this via `business_id` join against `businesses`.

## Rule 7 — Placement Tag
  - `placement = 'carousel'`  → appears in the slide carousel only
  - `placement = 'body'`      → appears in the grid gallery only
  - `placement = 'both'`      → appears in both

Hero images should use `placement = 'carousel'` or `'both'`.
Grid-only thumbnails use `placement = 'body'`.

## Slide-Eligible Fields (from form_fields where show_as_slide=1)
```
sec_auto_engine:     engine_type, displacement_cc, power_hp, torque_nm,
                     transmission_type, zero_to_100_s, top_speed_kmh,
                     fuel_type, fuel_consumption, electric_range_km,
                     charging_dc_kw, charge_10_to_80_min
sec_auto_exterior:   paint_finish, wheels, headlights, roof_type
sec_auto_interior:   seating_material, ambient_lighting, sunroof
sec_auto_safety:     braking_system
sec_auto_technology: infotainment_size_in, connectivity, audio_system, digital_cluster
```

## Running the Check (CI-ready)
Add to package.json scripts:
  "gallery:check": "node scripts/gallery-integrity-check.mjs",
  "gallery:fix":   "node scripts/gallery-integrity-check.mjs --fix"

The script exits with code 1 if HARD errors (❌ orphans, wrong business level)
exist, so it can block deployment in CI if wired to the build pipeline.
