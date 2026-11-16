# Adding a Car Model — Step by Step

Full flow for adding "BMW X5 2026" to the system. Nothing here modifies schema
or guards; it is all INSERT into data rows through the admin screens.

## Step 1: Ensure the brand exists

```sql
SELECT id FROM businesses WHERE type_id='vehicle_brand' AND name='BMW';
```

If new brand: add via admin > Businesses > New, `type=vehicle_brand`,
`vendor_claimable=0`. The guard `assertInstantiable` enforces this: a vendor
cannot create a brand node.

## Step 2: Create the model node

```
POST /api/admin/businesses
  type_id: 'vehicle_model'
  parent_business_id: 'biz_bmw'    ← assertNesting verifies brand→model
  name: 'X5'
  slug: 'bmw-x5-2026'
```

The node now carries the `vehicle_model` shelves (13 sections from seed). The
model's 40 spec/aspect fields already exist in `form_fields`.

## Step 3: Author the model's values

Values go into `custom_data` JSON, keyed by section:

```json
{
  "sec_auto_specs": { "engine_type": "Petrol", "power_hp": 381 },
  "sec_auto_exterior": { "paint_finish": "...", "wheels": "..." }
}
```

Adding a NEW question:
```
POST /api/admin/setup/fields
  business_type_id: 'vehicle_model'
  section_id: 'sec_auto_specs'
  name: 'hybrid_range_km'
  label: 'Electric Range (km)'
```

`assertFieldDeclarable` verifies the shelf is carried, name doesn't collide.

## Step 4: Add trims (optional)

```
POST /api/admin/businesses
  type_id: 'vehicle_trim'
  parent_business_id: '[x5 id]'   ← assertNesting: model→trim legal
```

## Step 5: Link graph edges

```
POST /api/admin/taxonomy/feed
  from: '[x5 id]', to: '[spartanburg id]', relation: 'manufactured_at'
```

`validateRelationship` checks: from=`vehicle_model`, to=`factory`, and
`manufactured_at` allows that direction.

## Step 6: Add inventory (units)

Showroom vendor adds via dashboard:

```
POST /api/vendor/units
  model_business_id: '[x5 id]'
  seller_business_id: '[showroom id]'  ← assertSellable verifies kind
  slug: 'auto-one-x5-2026-001'
  price_egp: 5200000
  year: 2026, unit_kind: 'new'
  overrides: { "sec_auto_specs": { "power_hp": 381 } }
```

`assertUnitOverrideKey` verifies each override key is defined on `vehicle_model`.

## Step 7: Manage offers

```
POST /api/vendor/offers
  model_business_id: '[x5 id]', seller: '[agency id]',
  authority: 'agency_official', price_from_egp: 5100000
```

`assertOfferAuthority` checks: a `main_agency` can publish `agency_official`.
A showroom cannot.
