# Vendor Shelves

## auto_sales (agency, showroom, distributor, broker, used_car_dealer)

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | business name, name_ar, description, hero, hours, contact, map |
| `sec_auto_portfolio` | [A+R] | `represented_by`/`sold_by` OUT → brands represented + focus chips |
| `sec_auto_inventory` | [A+R] | authored listings + reverse `sold_by` → car minisites sold |
| `sec_3_facilities` | [A] | showroom facilities, service bays, test-drive, charging |
| `sec_5_experiences` | [A] | bookable: test drive, home delivery, trade-in, inspection |
| `sec_auto_network` | [R] | `children` (branches/agents) + `agent_of` OUT |
| `sec_8_connector` | [A+R] | dealer campaigns + linked promos |
| `sec_10_testimonials_faqs` | [A+R] | reviews, after-sales, trust badges |

## auto_finance (bank, leasing, insurance)

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | provider name, logo, coverage, licensing |
| `sec_auto_products` | [A] | product catalog, grouped by kind (see below) |
| `sec_auto_eligibility` | [A+R] | eligible criteria + reverse `financed_by`/`insured_by` → covered cars |
| `sec_8_connector` | [A] | promo APR / seasonal offers |
| `sec_10_testimonials_faqs` | [A] | claims process, docs, FAQs |

### `sec_auto_products` field_groups by kind:
- **finance_bank / leasing_company**: Rate · Term · Amount · Down payment · Salary transfer · Docs
- **insurance_company**: Cover type · Premium basis · Deductible · Benefits · Claims · Scope

## auto_aftermarket (spare_parts, service_center, accessories_detailing)

| Shelf | Kind | Content / relation |
|---|---|---|
| `sec_1_identity` | [A] | vendor name, location, hours, contact |
| `sec_9_marketplace_catalog` | [A] | `service_catalog` + `local_products` |
| Parts/SKUs | [A+R] | `local_products` rows + `parts_for` OUT → models it fits |
| Services | [A] | `vendor_services` rows: category, price, capacity, booking_mode |
| `sec_3_facilities` | [A] | workshop bays, diagnostic equipment |
| `sec_10_testimonials_faqs` | [A+R] | reviews + warranty/return |

## Vendor = Same Engine as Cars

A vendor minisite uses identical machinery: same `/[slug]` router, same
`sections`, same `form_fields` + `field_groups`, same per-section carousel
(`vendor_gallery.section_id`), same per-section blog (`business_posts`).

| Dimension | Car (auto_vehicles) | Vendor (sales/finance/aftermarket) |
|---|---|---|
| `vendor_claimable` | 0 — admin reference | 1 — self/onboarded Level 1/2/3 |
| Who fills data | admin/curation team | the vendor (curated tiers add staff edits) |
| Relational pulls | its sellers, parts, finance | its assigned cars (read OUT) |
