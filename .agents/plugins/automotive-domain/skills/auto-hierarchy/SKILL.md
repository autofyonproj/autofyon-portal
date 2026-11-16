---
name: auto-hierarchy
description: >-
  Use this skill when the user needs to add, modify, or query the automotive
  business hierarchy — brands, models, trims, factories, sellers, finance
  providers, or aftermarket vendors. Covers the step-by-step flow for creating
  nodes, authoring values, linking graph edges, adding inventory, and managing
  offers through the guarded API system.
---

# Auto Hierarchy Operations

This skill covers the full operational flow for managing the automotive business
hierarchy. The system has two layers: **Schema+Typology** (frozen) and
**Business Data** (growable through guarded APIs).

## Quick Reference

| You want to... | You ADD | You NEVER change |
|---|---|---|
| New brand (Toyota) | `businesses` node + edges | schema, guards, shelf definitions |
| New model (Camry) | `businesses` node under brand + `custom_data` values | `form_fields` structure (unless genuinely new question) |
| New question (hybrid range) | `form_field` row through guarded API | `units` table columns |
| New seller | `businesses` node with `vendor_claimable=1` kind | typology rules |
| New stock | `units` row | `car_listing` kind (retired) |
| New finance product | `sec_auto_products` fields + values on a bank node | financial calculation code |
| New relation type | `topology.ts` RELATION_TYPES entry | existing edges |

## Step-by-Step Guides

For detailed procedures, read the appropriate reference:

- **[Adding a Car Model](references/add-car-model.md)** — Full 7-step flow
  (brand → model → values → trims → edges → units → offers)
- **[Nesting Rules](references/nesting-rules.md)** — Which kinds can nest under
  which, and the guards that enforce it
- **[Relation Types](references/relation-types.md)** — The 10 legal edge types,
  their direction constraints, and `role_data` schemas

## Validation

After any hierarchy change, verify with:
```sql
-- Check nesting is valid
SELECT b.id, b.name, b.type_id, p.type_id as parent_type
FROM businesses b
LEFT JOIN businesses p ON b.parent_business_id = p.id
WHERE b.type_id LIKE 'vehicle_%' OR b.type_id LIKE 'auto_%';

-- Check edges are valid
SELECT r.*, bf.type_id as from_type, bt.type_id as to_type
FROM business_relationships r
JOIN businesses bf ON r.from_business_id = bf.id
JOIN businesses bt ON r.to_business_id = bt.id
ORDER BY r.relation_type;
```
