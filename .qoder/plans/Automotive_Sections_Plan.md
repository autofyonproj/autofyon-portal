# Automotive Minisite Sections — Plan (per parent)

Companion to `3_Level_Minisite_System`. This document defines **the data that
appears on every automotive minisite**, organized by the four parent typologies
seeded in `20261121_automotive_types_seed.sql`.

It builds directly on the topology foundation already implemented
(`20261120_automotive_topology_foundation.sql`: `businesses.parent_business_id`,
`businesses.path`, `businesses.minisite_mode`, `business_relationships`,
`business_types.vendor_claimable`; plus `src/lib/topology.ts`).

---

## 0. The core principle: authored vs relational data

Every block on a car/vendor minisite is one of **two kinds**, and the distinction
is the whole point of "every car has its world":

| Kind | What it is | Stored in | Example |
|---|---|---|---|
| **Authored (content)** | field values typed by the owner/admin | `custom_data[sectionId][field]` per `form_fields` + `field_groups` | an X5's engine power, a dealer's opening hours, a loan's APR |
| **Relational (world)** | links pulled from the graph/tree, never re-typed | `business_relationships` + `businesses.parent_business_id` | "models under this brand", "where to buy this car", "manufactured at", "insure this car" |

**A section is either an authored shelf, a relational shelf, or mixed.** Relational
shelves have **no `form_fields`** — they are rendered by querying edges. This plan
marks each section `[A]` authored, `[R]` relational, or `[A+R]` mixed.

### Engine mapping for authored sections
- New section IDs are inserted into `sections` with `options = JSON_OBJECT('markets', JSON_ARRAY('automotive'))` so they render **only** in the automotive market (mirrors `sec_7_investment`'s `options.markets` door and the note in `section-registry.ts`).
- A parent kind declares the shelf set in `business_types.sections`; children add to it in `own_sections`. Field definitions attach at `SECTION_TEMPLATE` / parent and flow down; a child uses `form_fields.excluded=1` to refuse an inherited field (`20261116_field_groups.sql`).
- Fields within a shelf are bundled by `field_groups.name` (e.g. "Engine", "Financial terms") so the hero/card render with headings.
- Arabic: every new `sections.name_ar`, `field_groups.label_ar` and bilingual field label is seeded, following `20261027_arabic_storage` and `20261103_form_field_label_ar`.

### Render contract for relational sections
Each `[R]` shelf declares a **query spec** (stored on the section `options` JSON so
the renderer is data-driven, not code-per-car):

```jsonc
// sections.options.relationship
{
  "relation": "manufactured_at",   // RELATION_TYPES key, or "children" for the tree
  "direction": "out",              // out = from this node, in = to this node, both
  "as": "cards",                   // cards | list | table | chips | tree
  "linkTo": "/{slug}"              // each item links to the related node's minisite
}
```

The renderer for these is the **minisite rendering** step that follows this plan;
this plan only fixes the vocabulary so UI + rendering agree.

---

## 1. Parent `auto_vehicles` — the hero world
**Child kinds:** `vehicle_brand` (BMW), `vehicle_model` (X5), `vehicle_trim` (xDrive40i), `factory`.
All four are **reference data** (`vendor_claimable = 0`), so their shelves are authored by admins, not vendors. The instance tree is: brand → model → trim (via `parent_business_id`); factory is a sibling under the brand and connects to models by edges.

### 1a. `vehicle_brand` (BMW)
| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | brand name, name_ar, tagline, founding, country of origin, logo, hero gallery |
| `sec_auto_models` | [R] | `relation: children` where child type = `vehicle_model` → grid of the brand's cars, each linking `/bmw-x5` |
| `sec_auto_factories` | [R] | brand's factory children (`children`) + reverse `manufactured_at` → "built at" list |
| `sec_auto_network` | [R] | `represented_by`/`sold_by` **in** → main agencies & distributors |
| `sec_10_testimonials_faqs` | [A+R] | brand FAQs + press/blog (`business_posts`) |

### 1b. `vehicle_model` (X5) — THE minisite
| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | model name, name_ar, body type (SUV/sedan/pickup), segment, launch year, tagline, hero carousel |
| **Aspect shelves** (Exterior / Interior / Engine / Comfort / Safety / Technology — see 1e) | [A] | each carries its own spec fields + gallery + blog |
| `sec_auto_specs` | [A] | a compact numeric overview strip (power, 0–100, economy, dimensions) grouped by field_groups |
| `sec_auto_variants` | [R] | `children` where type = `vehicle_trim` → trim table, each linking `/bmw-x5-xdrive40i` |
| **`sec_auto_origin`** | [A+R] | `manufactured_at` → factories (each shows country of fabrication **derived** from the factory `location_id` roll-up to a country node, `role_data`: vin_wmi, model_years, supplies_market, plant_spec_code; `is_primary` flagged) |
| **`sec_auto_inventory`** | [A+R] | `sold_by` **in** → dealers/showrooms/agents with the car; plus `unit_offers`-style availability (price, condition, mileage) and `price_snapshots` market-price widget |
| `sec_auto_protection` | [R] | `insured_by` in → insurers; `financed_by` in → banks/leasing → "finance & cover this car" |
| `sec_auto_parts` | [R] | `parts_for` **in** → spare-parts vendors; `compatible_with` both → related accessories |
| `sec_8_connector` | [A+R] | launch offers / promos (authored) + linked dealer offers |
| `sec_10_testimonials_faqs` | [A+R] | reviews, expert take, owner FAQs |

### 1c. `vehicle_trim` (xDrive40i)
| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | trim name, name_ar, one-line position |
| **`sec_auto_specs`** | [A] | full spec sheet (engine, gearbox, dims, performance, economy, safety, wheels, EV battery) — grouped, and **refuses** irrelevant parent groups via `excluded` (e.g. a petrol trim drops the EV-battery group) |
| `sec_auto_inventory` | [R] | `sold_by` in → who sells this exact trim |
| `sec_auto_finance` | [R] | `financed_by`/`insured_by` in, scoped to this trim's price band |

### 1d. `factory` (Spartanburg)
| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | plant name, name_ar, address, coordinates (→ `location_id` = country of fabrication), founded, capacity, OEM vs contract |
| `sec_auto_models` | [R] | reverse `manufactured_at` → "models built here" |
| `sec_auto_network` | [R] | `distributed_by`/`represented_by` in → which agency/distributor the plant's output reaches per market |

---

## 1e. Aspect sections — every angle of the car is its own shelf (recommended)

The platform already lets **any** section be a content hub, so each car aspect
becomes a first-class shelf with three things bound to it:

1. **Its own fields/values** — `form_fields` bundled by `field_groups`, scoped to
   that `(business_type_id, section_id)`; trims refuse irrelevant groups with
   `excluded` (a petrol trim drops the EV-battery group).
2. **Its own carousel** — `vendor_gallery` keys on `section_id` (FK → `sections.id`)
   with `is_hero` + approval workflow, so *any* section owns a gallery. Flip
   `enable_gallery` / `has_gallery` / `gallery_enabled = 1`. (The legacy
   `business_media.chapter` ENUM is NOT the constraint — `vendor_gallery` supersedes it.)
3. **Its own blog** — `enable_blog` / `has_miniblog` / `miniblog_enabled = 1` (+
   `027_section_blog_curation_columns`), backed by `business_posts`.

Recommended shelf set (authored at the **model** level = the car's world; trims
override numbers, not media):

| Shelf id | name / name_ar | field_groups (values) | gallery | blog |
|---|---|---|---|---|
| `sec_auto_exterior` | Exterior / المظهر الخارجي | Design lines · Wheels · Lighting · Colors | ✔ | ✔ |
| `sec_auto_interior` | Interior / المقصورة | Seats · Materials · Cabin space · Storage | ✔ | ✔ |
| `sec_auto_engine` | Engine & Performance / المحرك والأداء | Engine · Transmission · Power · Acceleration · Fuel/EV | ✔ | ✔ |
| `sec_auto_comfort` | Comfort & Features / الراحة والمزايا | Climate · Seating comfort · Convenience | ✔ | ✔ |
| `sec_auto_safety` | Safety / السلامة | Airbags · ADAS · Ratings · Braking | ✔ | ✔ |
| `sec_auto_technology` | Technology / التقنية | Infotainment · Displays · Connectivity · Drivers assist | ✔ | ✔ |

Curation defaults for an aspect shelf (mirrors `sec_4_gastronomy` policy):
detail images `auto_approve`; the main hero carousel `requires_approval = TRUE`; blogs
`requires_approval = TRUE`; `max_gallery_items` per shelf as needed.

Opinion / trade-off: keep this to ~6 shelves, not dozens — each shelf with its own
media + blog multiplies curation load and `vendor_gallery`/`business_posts` rows.
Because cars are admin-curated reference data, that load stays on the team, not on
vendors. `sec_auto_specs` remains as a one-glance overview strip; the aspect shelves
are the deep, media-rich journey.

---

## 2. Parent `auto_sales` — the distribution network
**Child kinds:** `main_agency`, `showroom`, `distributor`, `agent_broker`, `used_car_dealer`.
All vendor-claimable (`vendor_claimable = 1`) → they flow through the 3-level template/curated/managed onboarding and outreach. Org tree uses `parent_business_id` (agency → showrooms → agents).

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | business name, name_ar, description, hero, hours, branches, phone/WhatsApp/email (reuses existing contact fields), `location_id` map |
| `sec_auto_portfolio` | [A+R] | which brands the dealer represents (`represented_by`/`sold_by` **out**) + an authored "focus segments" chips |
| **`sec_auto_inventory`** | [A+R] | authored: current listings; relational: reverse `sold_by` → the car minisites this dealer sells. Used-car dealer authors stock as `unit_offers` rows |
| `sec_3_facilities` | [A] | showroom facilities, service bays, test-drive lane, parking, charging |
| `sec_5_experiences` | [A] | bookable services: test drive, home delivery, trade-in valuation, inspection |
| `sec_auto_network` | [R] | `children` (branches/agents) + `agent_of` out → the parent agency. `main_agency` sees its whole network; `agent_broker` sees only its parent |
| `sec_8_connector` | [A+R] | dealer campaigns/offers + linked inventory promos |
| `sec_10_testimonials_faqs` | [A+R] | reviews, after-sales policies, licensing/trust badges |

Relational note for the earlier requirement ("vendor minisite connects to its assigned
cars"): that is exactly `sec_auto_inventory`/`sec_auto_portfolio` read **out** via
`sold_by`, while the same edge appears on the car as `sec_auto_inventory` read **in**.
One edge, both worlds.

---

## 3. Parent `auto_finance` — banks, leasing, insurers
**Child kinds:** `finance_bank`, `leasing_company`, `insurance_company`. All vendor-claimable.

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | provider name, name_ar, logo, coverage areas, licensing/regulator |
| **`sec_auto_products`** | [A] | the product catalog, **grouped** — content differs per child kind (below) |
| `sec_auto_eligibility` | [A+R] | authored: min/max vehicle value, eligible age/segment; relational: reverse `financed_by`/`insured_by` → the cars/models this provider actually covers |
| `sec_8_connector` | [A] | promo APR / seasonal premium offers |
| `sec_10_testimonials_faqs` | [A] | claims process, documents, FAQs |

`sec_auto_products` field_groups by kind:
- **finance_bank / leasing_company**: Product type (loan/lease/Islamic finance) · Rate (APR/flat, APR type) · Term (months min/max) · Amount (min/max) · Down payment % · Salary transfer? · Eligible models/segments · Documents · Monthly-installation calculator inputs.
- **insurance_company**: Cover type (comprehensive/TPFI/TP/Gap) · Premium basis (% of value / fixed) · Deductible · Benefits list (roadside, agency repair, windshield…) · Claims process · Geographic scope · Eligible vehicle types.

Reaching these products from a car is the `sec_auto_protection`/`sec_auto_finance`
relational shelves on `vehicle_model`/`vehicle_trim` (read `in`), so the finance/
insurance provider and the car are two authored worlds joined by one typed edge.

---

## 4. Parent `auto_aftermarket` — parts, service, accessories
**Child kinds:** `spare_parts`, `service_center`, `accessories_detailing`. All vendor-claimable.

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | vendor name, name_ar, location, hours, contact |
| **`sec_9_marketplace_catalog`** | [A] | the input surface for **both** shapes below — reuse the existing `service_catalog` component (`030`) for services and `local_products` for parts |
| **Parts / SKUs** | [A+R] | `spare_parts`/`accessories_detailing` author each part as a `local_products` row (name, price, stock, images, brand, OEM number); on a shelf `sec_auto_fitment`: authored OEM no./position/genuine-vs-aftermarket, relational `parts_for` **out** → models it fits, `compatible_with` both → related/alternative parts & models |
| **Services** | [A] | (`service_center`) oil change, diagnostic, detailing, bodywork… stored as canonical **`vendor_services`** rows (`034`): `category`/`service_type`, `price`+`price_unit`, `capacity`, `availability`, `valid_from/until`, `booking_mode` (`request`/`book`/`contact`), `approval_status` — **no new booking table needed** |
| `sec_3_facilities` | [A] | workshop bays, diagnostic equipment, genuine-parts store |
| `sec_10_testimonials_faqs` | [A+R] | reviews + warranty/return policy |

**Placement:** `service_center`, `spare_parts`, `accessories_detailing` are child *kinds* of
the `auto_aftermarket` parent — **not** of `auto_vehicles`. They reach cars only through graph
edges: `serviced_by` (center ↔ model/trim) and `parts_for` (part ↔ model). So the car's
minisite shows them in its `sec_auto_protection`/`sec_auto_parts` shelf (read **in**), while
the center/shop shows the cars it serves/fits (read **out**) — one edge, both worlds.

**Authorized vs independent:** an authorized service center or genuine-parts agency is *also*
linked to its brand/agency via `represented_by`/`agent_of`, so it appears in the brand's
`sec_auto_network` and keeps `vendor_claimable = 1` (Level 1/2/3 onboarding). Independents just
omit that edge — same node, same tables; the edge is the only difference.

---

## 4b. Vendor sections — the SAME engine as cars

A vendor is also just a `businesses` row, so its minisite renders through the
identical machinery — **same `/[slug]` router, same `sections` shelves, same
`form_fields` + `field_groups` for values, same per-section carousel
(`vendor_gallery.section_id`) and same per-section blog (`business_posts`)**.
So yes: a vendor shelf can carry fields + gallery + blog exactly like a car's
Exterior/Interior/Engine. Nothing about the aspect structure is car-specific.

The only differences from cars are **who authors it** and **shelf selection**:

| Dimension | Car (`auto_vehicles`) | Vendor (sales / finance / aftermarket) |
|---|---|---|
| `vendor_claimable` | 0 — admin reference data | 1 — self/onboarded via Level 1/2/3 |
| Who fills fields/media | admin/curation team | the vendor (curated/managed tiers may add staff edits) |
| Relational pulls | its sellers, parts, finance, origin | its assigned **cars** (`sold_by`/`represented_by`/`parts_for` read **out**) |
| Authored media-rich shelves | Exterior, Interior, Engine… | Showroom gallery, Team/consultants, Workshop, Blog/news |

Concrete vendor shelves that should flip the same three-part binding on
(`enable_gallery`+`has_gallery`, `enable_blog`+`has_miniblog`):

- **`sec_auto_showroom`** — Exterior/Interior of the dealership + delivery bay
  photos (gallery) and news/launch posts (blog). Author + also pulls its cars.
- **`sec_auto_team`** — consultants/agents cards (fields) + a small gallery; feeds
  `agent_of`/`account_manager` relationships.
- **`sec_3_facilities`** (workshop/showroom) — gallery of bays/equipment, blog of
  service tips.
- **`sec_5_experiences`** (services) — gallery + blog for offers like test-drive
  events, maintenance campaigns.
- Vendor **identity** (`sec_1_identity`) and **trust** (`sec_10`) already reuse the
  shared shelves, so they inherit gallery/blog support automatically.

Trade-off note: vendors authoring their own per-shelf media/blogs means the
`curation_policy` (`requires_approval`) and the moderation workflow are the real
work here, not schema — the structure is already proven on the 10 canonical
sections used by every other vertical today.

---

## 4c. Every business is its own mini-parent (insurers, banks, and all vendors)

"Parent/child" happens at **two levels** — keep them straight:

| Level | Stored in | What a "child" is | Example |
|---|---|---|---|
| **Kind** (category) | `business_types.parent_id` | a *type* of business | `auto_finance` (parent kind) → `insurance_company`, `finance_bank`, `leasing_company` (child kinds) — **already seeded** in `20261121` |
| **Entity** (record) | `businesses.parent_business_id` | a real *company/branch/product* node with its own minisite | AXA Egypt (node) → its governorate branches (child nodes) |

So insurance companies and banks are handled by the **same two engines** as cars and dealers:

1. **They exist as kinds** under the `auto_finance` parent (done). The plan's §3 shelves are
   theirs: identity · `sec_auto_products` · `sec_auto_eligibility` · offers · trust.
2. **Each company is a vendor `businesses` node** → its own name, `/{slug}`, and minisite,
   authored by the vendor through Level 1/2/3, with per-section **gallery + blog** exactly like
   §4b (same `vendor_gallery`/`business_posts` binding).

### Their "children" — two valid shapes, chosen by `minisite_mode`
- **Branch/office tree** → child `businesses` nodes (HQ → Cairo branch → Alex branch).
  Rendered by `sec_auto_network` (reuse `parent_business_id`), just like an agency's showrooms.
- **Products / cover types** (a loan plan, "Comprehensive", "Gap") → by default **authored
  `field_groups` inside `sec_auto_products`**, NOT separate minisites.

> **Rule:** a child is a *node with its own minisite* only when it needs its own URL, SEO and
> relationships (`minisite_mode='standalone'`). Otherwise it is *embedded data* inside its
> parent's shelf (`minisite_mode='embedded'`) — a product rendered on the company page, a
> trim's specs rendered on the model page. Promote a product to a node later if it earns a page
> (e.g. a flagship policy that partners link to); nothing else changes.

This one rule covers **every** parent uniformly:
- **Insurer** → branches (nodes) + cover products (fields) + `insured_by` edges to cars.
- **Bank / leasing** → branches (nodes) + loan/lease plans (fields) + `financed_by` edges to cars.
- **Agency** (`auto_sales`) → showrooms/agents (nodes) via `agent_of`/`distributed_by`.
- **Factory/Brand** (`auto_vehicles`) → models/trims (nodes) via the tree.
- **Service/part chain** (`auto_aftermarket`) → workshops (nodes) + jobs/SKUs (fields).

Note: an "All Insurance Companies" landing is a **category/directory page** (`search_pages`,
`/categories`), not a minisite — minisites are per-node only.

---

## 5. New shelves to register (summary)

| New `sections.id` | name / name_ar | Used by | Kind | componentType (new) |
|---|---|---|---|---|
| `sec_auto_specs` | Specifications / المواصفات | model, trim | [A] | `vehicle_specs` (grouped field render) |
| `sec_auto_origin` | Manufacturing & Origin / المنشأ والتصنيع | model, factory | [A+R] | `origin_chain` |
| `sec_auto_inventory` | Availability & Sellers / التوفر والبائعون | model, trim, dealers | [A+R] | `related_minisites` + offers |
| `sec_auto_models` | Models / الطرازات | brand, factory | [R] | `related_minisites` |
| `sec_auto_variants` | Trims & Variants / الفئات | model | [R] | `related_minisites` (table) |
| `sec_auto_protection` | Finance & Insurance / التمويل والتأمين | model, trim | [R] | `related_minisites` |
| `sec_auto_parts` | Parts & Accessories / القطع والإكسسوارات | model | [R] | `related_minisites` |
| `sec_auto_products` | Products / المنتجات | bank, leasing, insurer | [A] | `product_plans` (grouped) |
| `sec_auto_eligibility` | Eligibility / الأهلية | finance kinds | [A+R] | `chips` + `related_minisites` |
| `sec_auto_portfolio` | Brands Represented / العلامات الممثلة | dealers | [A+R] | `chips` + `related_minisites` |
| `sec_auto_network` | Network / الشبكة | brand, factory, dealers | [R] | `network_tree` |
| `sec_auto_fitment` | Fitment / التوافق | parts, service, accessories | [A+R] | `related_minisites` + fields |

Existing shelves reused as-is: `sec_1_identity`, `sec_3_facilities`, `sec_5_experiences`,
`sec_8_connector`, `sec_9_marketplace_catalog`, `sec_10_testimonials_faqs` (retuned with
automotive `field_groups`, no new IDs needed).

---

## 6. Implementation plan (ordered)

**Phase S1 — register shelves (data, low risk)**
1. Migration `..._automotive_sections.sql`: insert the 12 `sections` rows above with
   `options.markets = ["automotive"]`, bilingual names, chosen `componentType`,
   `show_on_minisite=1`, sensible `section_type`.
2. Migration `..._automotive_type_sections.sql`: set `business_types.sections` (parent)
   and `own_sections` per kind from the tables above.
3. Migration `..._automotive_field_groups.sql` + `..._automotive_form_fields.sql`:
   seed `field_groups` + `form_fields` for the authored shelves (specs, products,
   eligibility, portfolio, identity retunes). Use `SECTION_TEMPLATE`/parent scope so
   children inherit; mark child `excluded` where a group does not apply (EV-battery
   group on a petrol trim).

**Phase S2 — relational renderer (the "world" engine)**
4. Extend the minisite renderer (`/[slug]/page.tsx` + `MinisiteBuilderRenderer` and
   `section-registry` `CANONICAL_SECTIONS`/component map) with the new `componentType`s,
   driven by `sections.options.relationship` and `src/lib/topology.ts`
   (`getAncestry`, and a `getRelatedEdges(businessId)` helper over
   `business_relationships`).
5. Wire breadcrumbs from `businesses.path` and the `/[vendor]/cars/[car]` nested
   context view.

**Phase S3 — admin authoring UI**
6. `/jana/topology` — tree editor (assign parent, cycle-guarded, set `minisite_mode`) +
   relationship wiring (pick `relation_type`, endpoint, `is_primary`, `role_data`), both
   calling the validated APIs already built.
7. Per-shelf field authoring already works through the existing forms/`form_fields`
   system once S1 seeds it.

---

## 7. Open decisions to confirm before coding S1

1. **`path` language** — breadcrumbs/`path` built from slugs (ASCII) or IDs? (slugs
   assumed here; Arabic slugs would need the `20261027` Arabic-storage rule.)
2. **Specs storage** — keep specs as grouped `form_fields` (authoring-friendly, the
   approach above) **or** normalize a `vehicle_trims` spec table for search/compare?
   (Compare pages exist; a queryable spec table is better for `/compare` but heavier.)
3. **`vehicle_specs` compare** — do we want trim-vs-trim compare on launch, or after S1/S2?
4. This document is English with Arabic shelf names; say so if you want the whole plan in Arabic.
