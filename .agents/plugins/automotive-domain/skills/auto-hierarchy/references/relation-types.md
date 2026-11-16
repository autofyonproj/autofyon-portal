# Relation Types

The 10 legal edge types in `business_relationships`, defined in
`RELATION_TYPES` in `src/lib/topology.ts`.

## Vocabulary

| Relation | From | To | Meaning |
|---|---|---|---|
| `manufactured_at` | vehicle_model, vehicle_trim | factory | where built |
| `sold_by` | vehicle_brand, model, trim | agency, showroom, distributor, broker, dealer | who sells it |
| `distributed_by` | vehicle_brand, model | distributor, main_agency | who distributes |
| `represented_by` | vehicle_brand | main_agency | official representation |
| `serviced_by` | vehicle_model, brand | service_center | authorized service |
| `insured_by` | vehicle_model, brand | insurance_company | protection plans |
| `financed_by` | vehicle_model | finance_bank, leasing_company | finance providers |
| `parts_for` | spare_parts, accessories | vehicle_model, brand | compatibility |
| `compatible_with` | model, parts, accessories | (same, bidirectional) | interchange |
| `agent_of` | agent_broker | agency, showroom, distributor | representation |

## Edge Properties

Each edge carries:
- **`is_primary`** (boolean) — marks the main/official relationship
- **`role_data`** (JSON, optional) — structured metadata, e.g.:
  - `manufactured_at`: `{ vin_wmi, model_years, supplies_market, plant_spec_code }`
  - `sold_by`: `{ warranty_provider, authorized_since }`
  - `insured_by`: `{ cover_types: ["comprehensive", "tpfi"] }`

## One Edge, Both Worlds

The same edge appears on BOTH sides:
- Car's `sec_auto_inventory` reads `sold_by` **IN** → "who sells this car"
- Dealer's `sec_auto_portfolio` reads `sold_by` **OUT** → "which cars I sell"

This is the fundamental design: **one edge, two minisite perspectives**.
