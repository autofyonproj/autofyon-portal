---
name: automotive-qa
description: >-
  Runs validation queries and health checks on the automotive entity graph,
  typology invariants, relation directionality, and section shelf configurations.
---

# Automotive System QA & Verifier

Use this skill to inspect data consistency across `businesses`, `business_relationships`,
`form_fields`, and `sections`.

## Invariant Checks

1. **Verify Tree Nesting Legality**: Ensure child kinds match allowed kinds of parents.
2. **Verify Edge Directionality**: Ensure relations connect allowed from/to kind types.
3. **Verify Minisite Shelf Integrity**: Confirm relational sections use valid relationship specs and authored shelves have field bindings.
