# Automotive Domain — Agent Rules

## Typology Contract

The typology system (`src/lib/typology.ts`) defines WHAT CAN exist.
The data layer fills in WHAT DOES exist. Never confuse the two.

### Adding data (safe, no code change)
- New brand/model/trim/factory → `INSERT` into `businesses` through guarded API
- New form field → `POST /api/admin/setup/fields` (guarded by `assertFieldDeclarable`)
- New edge → `POST /api/admin/taxonomy/feed` (guarded by `validateRelationship`)
- New unit/listing → `POST /api/vendor/units` (guarded by `assertSellable` + `assertUnitOverrideKey`)

### Adding vocabulary (migration required)
- New leaf kind → migration + `business_types` row + `assertKindDefinition`
- New relation type → `topology.ts` `RELATION_TYPES` entry (existing edges stay valid)
- New section → migration + `sections` row + `assertShelfShape`

### Forbidden operations
- NEVER drop or alter existing columns in `businesses`, `units`, or `business_types`
- NEVER bypass guards by writing raw SQL inserts in application code
- NEVER create a new `car_listing` kind — it is retired; use `units` table instead
- NEVER store spec values as new table columns — use `custom_data` JSON

## Topology Contract

The topology system (`src/lib/topology.ts`) manages the entity graph:
- Tree: `businesses.parent_business_id` + `businesses.path`
- Graph: `business_relationships` with typed edges
- Helpers: `getAncestry()`, `getRelatedEdges(businessId)`

### Rendering contract for relational shelves
```jsonc
// sections.options.relationship
{
  "relation": "manufactured_at",   // RELATION_TYPES key or "children"
  "direction": "out",              // out | in | both
  "as": "cards",                   // cards | list | table | chips | tree
  "linkTo": "/{slug}"              // each item links to the related minisite
}
```

## Shelf Architecture

Every minisite shelf can carry three things:
1. **Fields/values** — `form_fields` bundled by `field_groups`, scoped to `(business_type_id, section_id)`
2. **Gallery** — `vendor_gallery` keyed on `section_id` (FK → `sections.id`), flip `enable_gallery`
3. **Blog** — `enable_blog` / `has_miniblog`, backed by `business_posts`

This three-part binding applies equally to car shelves AND vendor shelves.
The machinery is the same: same `/[slug]` router, same `sections`, same `form_fields`,
same per-section carousel, same per-section blog.
