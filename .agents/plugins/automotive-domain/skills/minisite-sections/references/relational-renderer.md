# Relational Renderer Spec

Relational shelves are data-driven, not code-per-car. The renderer reads the
query spec from `sections.options.relationship`:

```jsonc
{
  "relation": "manufactured_at",   // RELATION_TYPES key, or "children"
  "direction": "out",              // out = from this node, in = to this node, both
  "as": "cards",                   // cards | list | table | chips | tree
  "linkTo": "/{slug}"              // each item links to the related minisite
}
```

## Component Types

| componentType | Renders as | Used by |
|---|---|---|
| `vehicle_specs` | grouped field render with comparison support | `sec_auto_specs` |
| `origin_chain` | factory chain with country derived from `location_id` | `sec_auto_origin` |
| `related_minisites` | cards/list of linked minisite nodes | most `[R]` shelves |
| `product_plans` | grouped product catalog (rates, terms, premiums) | `sec_auto_products` |
| `chips` | compact tag/chip list | `sec_auto_eligibility`, `sec_auto_portfolio` |
| `network_tree` | hierarchical tree view of branches/agents | `sec_auto_network` |

## Implementation Path

1. Extend `section-registry.ts` `CANONICAL_SECTIONS` with new componentTypes
2. Extend `MinisiteBuilderRenderer` to read `sections.options.relationship`
3. Add `getRelatedEdges(businessId)` helper in `src/lib/topology.ts`
4. Wire breadcrumbs from `businesses.path`
