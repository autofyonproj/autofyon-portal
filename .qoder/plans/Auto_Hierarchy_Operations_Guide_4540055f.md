# Auto Hierarchy Operations Guide

## 1. The Two Layers (frozen vs. growable)

The system has two distinct layers. You NEVER touch the first in production; you GROW the second freely through the admin dashboard and vendor screens.

| Layer | What it is | Where it lives | Changed by |
|-------|-----------|----------------|------------|
| **Schema + Typology** | Tables, columns, guards, relation vocabulary | `migrations/*.sql` + `src/lib/typology.ts` + `src/lib/topology.ts` | Migrations only (development). Frozen in production. |
| **Business data** | Kinds, shelves, fields, instances, edges, units | `business_types`, `sections`, `form_fields`, `businesses`, `business_relationships`, `units` tables | Admin dashboard + vendor screens (additive writes through guarded APIs). |

The principle: **the system defines what CAN exist; the data fills in what DOES exist.**

---

## 2. The Auto Business Hierarchy (the tree)

The `business_types` table defines 4 parent categories and 15 leaf kinds:

```
market: automotive
  auto_vehicles (parent kind, vendor_claimable=0)
    +-- vehicle_brand   (reference data, admin creates, vendor links to)
    +-- vehicle_model   (reference data, admin creates, vendor links to)
    +-- vehicle_trim    (reference data, admin creates, vendor links to)
    +-- factory         (reference data, admin creates, never sells)
  auto_sales (parent kind, vendor_claimable=0)
    +-- main_agency     (vendor_claimable=1)
    +-- showroom        (vendor_claimable=1)
    +-- distributor     (vendor_claimable=1)
    +-- agent_broker    (vendor_claimable=1)
    +-- used_car_dealer (vendor_claimable=1)
  auto_finance (parent kind, vendor_claimable=0)
    +-- finance_bank
    +-- leasing_company
    +-- insurance_company
  auto_aftermarket (parent kind, vendor_claimable=0)
    +-- spare_parts
    +-- service_center
    +-- accessories_detailing
```

**Nesting rules** (the `allowed_child_kinds` column, enforced by `assertNesting`):
```
main_agency   -> [showroom, distributor, agent_broker]
distributor   -> [showroom, agent_broker]
vehicle_brand -> [vehicle_model, vehicle_trim]
vehicle_model -> [vehicle_trim]
showroom      -> [] (owns UNITS, not child nodes)
```

A showroom cannot contain a `vehicle_model`. A model can only live under a brand. These are enforced by the guard BEFORE any insert reaches the database.

---

## 3. The Graph (cross-kind relationships)

The tree holds instances; the `business_relationships` table holds typed edges between any two nodes. The vocabulary (`RELATION_TYPES` in `topology.ts`) defines 10 legal edges:

| Relation | From | To | Meaning |
|----------|------|----|---------|
| manufactured_at | vehicle_model, vehicle_trim | factory | where built |
| sold_by | vehicle_brand, model, trim | agency, showroom, distributor, broker, dealer | who sells it |
| distributed_by | vehicle_brand, model | distributor, main_agency | who distributes |
| represented_by | vehicle_brand | main_agency | official representation |
| serviced_by | vehicle_model, brand | service_center | authorized service |
| insured_by | vehicle_model, brand | insurance_company | protection plans |
| financed_by | vehicle_model | finance_bank, leasing_company | finance providers |
| parts_for | spare_parts, accessories | vehicle_model, brand | compatibility |
| compatible_with | model, parts, accessories | (same, bidirectional) | interchange |
| agent_of | agent_broker | agency, showroom, distributor | representation |

Each edge has `is_primary` and optional `role_data` JSON (e.g., warranty plan name).

---

## 4. How to Add a Car Model (step by step)

This is the full flow for adding "BMW X5 2026" to the system. Nothing here modifies schema or guards; it is all INSERT into data rows through the admin screens.

### 4.1 Ensure the brand exists
```sql
-- Check: does BMW already exist? (it does: biz_bmw)
SELECT id FROM businesses WHERE type_id='vehicle_brand' AND name='BMW';
```
If a new brand: add via admin > Businesses > New, type=`vehicle_brand`, `vendor_claimable=0`, so only the platform team creates it. The guard `assertInstantiable` enforces this: a vendor cannot create a brand node.

### 4.2 Create the model node
```
POST /api/admin/businesses
  type_id: 'vehicle_model'
  parent_business_id: 'biz_bmw'    <-- assertNesting verifies brand->model is legal
  name: 'X5'
  slug: 'bmw-x5-2026'
```
The node now carries the vehicle_model shelves (13 sections from 0002 seed). The model's 40 spec/aspect fields already exist in `form_fields` -- no new schema needed.

### 4.3 Author the model's values
The model's spec values go into `custom_data` JSON, keyed by section:
```json
{
  "sec_auto_specs": { "engine_type": "Petrol", "power_hp": 381, ... },
  "sec_auto_exterior": { "paint_finish": "...", "wheels": "...", ... }
}
```
These are the same keys defined in `form_fields` for `business_type_id='vehicle_model'`. Adding a NEW question? Use the guarded API:
```
POST /api/admin/setup/fields
  business_type_id: 'vehicle_model'
  section_id: 'sec_auto_specs'
  name: 'hybrid_range_km'
  label: 'Electric Range (km)'
```
`assertFieldDeclarable` verifies the shelf is carried, the name does not collide with a unit column, and the question is not already defined elsewhere.

### 4.4 Add trims (optional)
```
POST /api/admin/businesses
  type_id: 'vehicle_trim'
  parent_business_id: '[new x5 id]'   <-- assertNesting: model->trim legal
```

### 4.5 Link graph edges
```
POST /api/admin/taxonomy/feed
  from: '[x5 id]', to: '[spartanburg id]', relation: 'manufactured_at'
```
`validateRelationship` checks: from type is `vehicle_model`, to type is `factory`, and `manufactured_at` allows that direction.

### 4.6 Add inventory (units)
A showroom (vendor account) adds cars via the vendor dashboard:
```
POST /api/vendor/units
  model_business_id: '[x5 id]'
  seller_business_id: '[showroom id]'  <-- assertSellable verifies kind
  slug: 'auto-one-x5-2026-001'
  price_egp: 5200000
  year: 2026, unit_kind: 'new', ...
  overrides: { "sec_auto_specs": { "power_hp": 381 } }
```
`assertUnitOverrideKey` verifies each override key is defined on `vehicle_model`. `assertSellable` verifies the seller is an active, published, sellable kind.

### 4.7 Manage offers
```
POST /api/vendor/offers
  model_business_id: '[x5 id]', seller: '[agency id]',
  authority: 'agency_official', price_from_egp: 5100000
```
`assertOfferAuthority` checks: a `main_agency` can publish `agency_official`. A showroom cannot.

---

## 5. What "Add Without Change" Means Concretely

| You want to... | You ADD | You NEVER change |
|---|---|---|
| New brand (Toyota) | businesses node + edges | schema, guards, shelf definitions |
| New model (Camry) | businesses node under brand + custom_data values | form_fields structure (unless adding a genuinely new question) |
| New question (hybrid range) | form_field row through guarded API | units table columns |
| New seller | businesses node with vendor_claimable=1 kind + vendor account | typology rules |
| New stock | units row | car_listing kind (it is retired) |
| New finance product | sec_auto_products fields + values on a bank node | the financial calculation code (reads rates from data) |
| New relation type | topology.ts RELATION_TYPES entry | existing edges (they stay valid) |

The immutability guarantee: every write endpoint calls the guard before executing. The guard reads the schema contract from `business_types`, `sections`, `form_fields`, and rejects the write with a 409 explaining what invariant was violated. This was proven: 10 negative probes, 10 refusals, database unchanged.

---

## 6. What Is NOT Yet Built (the gaps in the current system)

1. **Empty authored shelves** — `sec_1_identity`, `sec_auto_products`, `sec_auto_showroom`, `sec_10_testimonials` have zero `form_fields`. A migration `0011_settle_vocab.sql` (todo c5) adds them.

2. **No KIND_PAGES registry** (todo c3) — the system has 12 page routes but no machine-readable "kind X renders through route Y using read function Z". Without it, adding a new kind does not automatically produce a page.

3. **No unit lifecycle API** (todo b5/b6) — `/api/admin/listing` does not exist; `inventory/new` 404s. The units machinery (offers, corrections, price snapshots) is defined in migration 0008 but has no vendor-facing screens yet.

4. **Seed buttons still carry hardcoded arrays** (todo c4) — these will become the "settled checklist" that proves a kind is complete.

5. **No CLI verifier** (todo c6) — `scratch/q-kind-contract.sql` would prove from the command line whether every kind meets all invariants.

---

## 7. The Flexible Growth Pattern

The architecture supports three axes of growth without schema changes:

**Axis A: More instances (growing the network)**
- More brands, models, trims, factories, sellers, banks
- More units per seller
- More edges connecting existing nodes
- All through INSERT + guard

**Axis B: More vocabulary (deeper specifications)**
- New form_fields on existing shelves (guarded: shelf must be carried, name must not collide)
- New field_groups to organize them
- New enum options in `form_fields.options` JSON
- All through POST + assertFieldDeclarable

**Axis C: New kinds or shelves (broadening the taxonomy)**
- A new leaf kind (e.g., `car_wrap_studio` under `auto_aftermarket`)
- A new shelf (e.g., `sec_auto_reviews`)
- Declared through `POST /api/admin/setup/business-types` or `/sections`
- `assertKindDefinition` / `assertShelfShape` verifies coherence before insert
- No code change: `resolveSections` reads from the database, so a new shelf auto-appears on the minisite

---

## 8. The Admin Dashboard: What You See Today

- **Platform admin** (`/admin/platform`): CRUD business types, sections, fields, markets. Seeded. Operational. Guarded.
- **Vendor dashboard** (planned: `/admin/business/[id]`): Units, Offers, Camera upload, Corrections inbox. NOT YET BUILT (b5/b6).
- **Setup panel** (`SetupPanelClient.tsx`): Seed buttons. Being replaced by the settled checklist (c4).

The platform admin IS the full taxonomy control panel. You can add a brand, model, shelf, field, or edge entirely through it. The typology guards ensure you cannot break the architecture.

---

## 9. Recommended Next Steps

1. Execute c5 (`0011_settle_vocab.sql`) to fill the 4 empty authored shelves.
2. Execute c3 (`KIND_PAGES` registry) so every kind has a machine-known page shape.
3. Execute b5/b6 (vendor unit lifecycle) so showrooms can add cars.
4. Execute c4 (replace seed buttons with the settled checklist).
5. Once all above are done: adding a new model = 3 clicks in the admin panel + vendor adds stock. No code, no migration.
