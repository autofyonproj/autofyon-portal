---
name: minisite-sections
description: >-
  Use this skill when working on automotive minisite sections — the shelves that
  appear on car, vendor, finance, and aftermarket minisites. Covers authored vs
  relational sections, aspect shelves (Exterior/Interior/Engine/etc), the
  relational renderer spec, and the 12 new automotive section IDs.
---

# Minisite Sections — Automotive Shelves

Every automotive minisite is composed of **sections (shelves)**, each either:
- **`[A]` Authored** — field values from `custom_data[sectionId][field]`
- **`[R]` Relational** — links from `business_relationships` graph
- **`[A+R]` Mixed** — both authored content and graph-pulled links

## Shelf Sets by Parent

For the full shelf tables per parent type, read the references:

- **[Vehicle Shelves](references/vehicle-shelves.md)** — brand, model, trim,
  factory sections (the hero world)
- **[Vendor Shelves](references/vendor-shelves.md)** — sales, finance,
  aftermarket sections (the distribution network)
- **[Relational Renderer](references/relational-renderer.md)** — the
  `sections.options.relationship` spec and componentType mapping

## New Section IDs (12 total)

| ID | Name / الاسم | Used By | Kind |
|---|---|---|---|
| `sec_auto_specs` | Specifications / المواصفات | model, trim | [A] |
| `sec_auto_origin` | Manufacturing & Origin / المنشأ | model, factory | [A+R] |
| `sec_auto_inventory` | Availability / التوفر | model, trim, dealers | [A+R] |
| `sec_auto_models` | Models / الطرازات | brand, factory | [R] |
| `sec_auto_variants` | Trims / الفئات | model | [R] |
| `sec_auto_protection` | Finance & Insurance / التمويل | model, trim | [R] |
| `sec_auto_parts` | Parts / القطع | model | [R] |
| `sec_auto_products` | Products / المنتجات | bank, leasing, insurer | [A] |
| `sec_auto_eligibility` | Eligibility / الأهلية | finance kinds | [A+R] |
| `sec_auto_portfolio` | Brands Represented / العلامات | dealers | [A+R] |
| `sec_auto_network` | Network / الشبكة | brand, factory, dealers | [R] |
| `sec_auto_fitment` | Fitment / التوافق | parts, service | [A+R] |

## Aspect Shelves (6 — on vehicle_model)

Each aspect is a first-class shelf with its own fields + gallery + blog:

| Shelf | Name / الاسم | Field Groups |
|---|---|---|
| `sec_auto_exterior` | Exterior / المظهر الخارجي | Design · Wheels · Lighting · Colors |
| `sec_auto_interior` | Interior / المقصورة | Seats · Materials · Cabin · Storage |
| `sec_auto_engine` | Engine & Performance / المحرك | Engine · Transmission · Power · Fuel/EV |
| `sec_auto_comfort` | Comfort / الراحة | Climate · Seating · Convenience |
| `sec_auto_safety` | Safety / السلامة | Airbags · ADAS · Ratings · Braking |
| `sec_auto_technology` | Technology / التقنية | Infotainment · Displays · Connectivity |
