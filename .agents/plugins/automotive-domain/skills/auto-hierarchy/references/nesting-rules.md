# Nesting Rules

Enforced by `assertNesting` guard in `allowed_child_kinds` column. These
constraints are checked BEFORE any insert reaches the database.

## Legal Nesting

| Parent Kind | Allowed Children |
|---|---|
| `main_agency` | `showroom`, `distributor`, `agent_broker` |
| `distributor` | `showroom`, `agent_broker` |
| `vehicle_brand` | `vehicle_model`, `vehicle_trim` |
| `vehicle_model` | `vehicle_trim` |
| `showroom` | `[]` (owns UNITS, not child nodes) |

## What This Means

- A showroom CANNOT contain a `vehicle_model`
- A model can ONLY live under a brand
- A trim can live under a brand OR a model (but conventionally under model)
- `used_car_dealer`, `finance_bank`, `leasing_company`, `insurance_company`,
  `spare_parts`, `service_center`, `accessories_detailing` — all are leaf kinds
  with no children (they own products/services via `form_fields`, not child nodes)

## Entity vs Kind Nesting

| Level | Stored in | What a "child" is | Example |
|---|---|---|---|
| **Kind** (category) | `business_types.parent_id` | a *type* of business | `auto_finance` → `insurance_company` |
| **Entity** (record) | `businesses.parent_business_id` | a real *company/node* | AXA Egypt → Cairo branch |

## Minisite Mode Decision

A child is a node with its own minisite ONLY when it needs:
- Its own URL and SEO
- Its own relationships (graph edges)

If yes → `minisite_mode='standalone'`
If no → `minisite_mode='embedded'` (rendered inside parent's shelf)

Promote embedded → standalone later if it earns a page; nothing else changes.
