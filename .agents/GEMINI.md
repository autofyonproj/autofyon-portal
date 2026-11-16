# AutoNEgypt Portal — Agent Rules

## Architecture Invariants (NEVER violate)

1. **Two-Layer Rule**: Schema+Typology is FROZEN in production. Only business
   data (kinds, shelves, fields, instances, edges, units) is growable through
   guarded APIs. Never modify `migrations/*.sql`, `src/lib/typology.ts`, or
   `src/lib/topology.ts` in production.

2. **Guard-First**: Every write endpoint MUST call its guard before executing.
   Guards: `assertNesting`, `assertInstantiable`, `assertSellable`,
   `assertFieldDeclarable`, `assertUnitOverrideKey`, `assertOfferAuthority`,
   `assertKindDefinition`, `assertShelfShape`, `validateRelationship`.

3. **Nesting Constraints** (enforced by `assertNesting`):
   - `main_agency` → `[showroom, distributor, agent_broker]`
   - `distributor` → `[showroom, agent_broker]`
   - `vehicle_brand` → `[vehicle_model, vehicle_trim]`
   - `vehicle_model` → `[vehicle_trim]`
   - `showroom` → `[]` (owns UNITS, not child nodes)

4. **Relation Vocabulary** (only these 10 edge types are legal in
   `business_relationships`):
   `manufactured_at`, `sold_by`, `distributed_by`, `represented_by`,
   `serviced_by`, `insured_by`, `financed_by`, `parts_for`,
   `compatible_with`, `agent_of`.

5. **Minisite Mode Rule**: A child is a node with its own minisite ONLY when
   it needs its own URL, SEO, and relationships (`minisite_mode='standalone'`).
   Otherwise it is embedded data inside its parent's shelf
   (`minisite_mode='embedded'`).

6. **Vendor Claimable**:
   - `auto_vehicles` kinds → `vendor_claimable=0` (admin reference data)
   - `auto_sales`, `auto_finance`, `auto_aftermarket` kinds → `vendor_claimable=1`

7. **Authored vs Relational**: A section is `[A]` authored (form_fields in
   `custom_data`), `[R]` relational (query from `business_relationships`),
   or `[A+R]` mixed. Relational shelves have NO `form_fields` — they are
   rendered by querying edges via `sections.options.relationship`.

8. **Brand Fleet Ingestion & Image Isolation Rule**:
   - Every car brand MUST be linked to its official distributor/agency via `sold_by`.
   - **Strict Image Isolation**: Every image in `vendor_gallery` MUST belong strictly to `business_id = model.id`. NEVER reuse images across different models or brands. No generic placeholders (Unsplash is forbidden).
   - **Official Brochure Rule**: Store the agent's official PDF brochure URL in `custom_data.sec_1_identity.brochure_url` (and `sec_overview.brochure_url`) to power `/api/cars/[slug]/brochure`.
   - **Deterministic AI Workflow**: All AI models (including local Ollama) generate clean JSON conforming to the schema in `.agents/skills/auto-brand-ingestion/SKILL.md`. Ingestion and validation are handled by `node scripts/ingest_brand.js --file <json>`. Quality is verified by `node scripts/audit_brand_integrity.js`.

## Data Standards

- All SQL migrations MUST be idempotent.
- Arabic labels (`name_ar`, `label_ar`) REQUIRED for every new `sections`,
  `field_groups`, and `form_fields` row.
- Use `custom_data[sectionId][field]` for authored values — NEVER add new
  columns to `businesses` or `units` for business-specific data.
- Relational shelves use `sections.options.relationship` JSON spec — NEVER
  write code-per-car rendering logic.
- New sections for the automotive market MUST set
  `options = JSON_OBJECT('markets', JSON_ARRAY('automotive'))`.

## Business Hierarchy (4 parents, 15 leaf kinds)

```
market: automotive
  auto_vehicles (parent, vendor_claimable=0)
    ├── vehicle_brand    (reference data)
    ├── vehicle_model    (reference data — THE minisite)
    ├── vehicle_trim     (reference data)
    └── factory          (reference data)
  auto_sales (parent, vendor_claimable=0)
    ├── main_agency      (vendor_claimable=1)
    ├── showroom         (vendor_claimable=1)
    ├── distributor      (vendor_claimable=1)
    ├── agent_broker     (vendor_claimable=1)
    └── used_car_dealer  (vendor_claimable=1)
  auto_finance (parent, vendor_claimable=0)
    ├── finance_bank     (vendor_claimable=1)
    ├── leasing_company  (vendor_claimable=1)
    └── insurance_company(vendor_claimable=1)
  auto_aftermarket (parent, vendor_claimable=0)
    ├── spare_parts      (vendor_claimable=1)
    ├── service_center   (vendor_claimable=1)
    └── accessories_detailing (vendor_claimable=1)
```

## Code Style

- Stack: Next.js (App Router) + Cloudflare Workers/D1/R2
- UI: shadcn/ui + Tailwind CSS + design tokens
- TypeScript strict mode — no `any` types
- All API routes: validate input with zod, return typed responses
- Component naming: PascalCase. File naming: kebab-case
