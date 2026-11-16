# Vehicle Shelves

## vehicle_brand (e.g. BMW)

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | brand name, name_ar, tagline, founding, country, logo, hero |
| `sec_auto_models` | [R] | `children` where child type = `vehicle_model` → grid |
| `sec_auto_factories` | [R] | children + reverse `manufactured_at` → "built at" list |
| `sec_auto_network` | [R] | `represented_by`/`sold_by` IN → agencies & distributors |
| `sec_10_testimonials_faqs` | [A+R] | brand FAQs + press/blog |

## vehicle_model (e.g. X5) — THE minisite

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | model name, body type, segment, launch year, tagline, hero |
| 6 × Aspect shelves | [A] | Exterior/Interior/Engine/Comfort/Safety/Technology |
| `sec_auto_specs` | [A] | compact numeric overview strip |
| `sec_auto_variants` | [R] | `children` type=`vehicle_trim` → trim table |
| `sec_auto_origin` | [A+R] | `manufactured_at` → factories |
| `sec_auto_inventory` | [A+R] | `sold_by` IN → dealers + price widget |
| `sec_auto_protection` | [R] | `insured_by`/`financed_by` IN → finance & cover |
| `sec_auto_parts` | [R] | `parts_for` IN → spare-parts vendors |
| `sec_8_connector` | [A+R] | launch offers/promos |
| `sec_10_testimonials_faqs` | [A+R] | reviews, FAQs |

## vehicle_trim (e.g. xDrive40i)

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | trim name, position |
| `sec_auto_specs` | [A] | full spec sheet (refuses irrelevant parent groups via `excluded`) |
| `sec_auto_inventory` | [R] | `sold_by` IN → who sells this trim |
| `sec_auto_finance` | [R] | `financed_by`/`insured_by` IN, scoped to price band |

## factory (e.g. Spartanburg)

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | plant name, address, coordinates, capacity |
| `sec_auto_models` | [R] | reverse `manufactured_at` → models built here |
| `sec_auto_network` | [R] | `distributed_by`/`represented_by` IN |
