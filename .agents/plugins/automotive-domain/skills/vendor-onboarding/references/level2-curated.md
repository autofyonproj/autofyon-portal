# Level 2 — Admin-Curated Minisites

Level 2 provides a high-touch, admin-guided onboarding path for key automotive vendors.

## Architecture

- **Admin Minisite Builder**: `/jana/minisite-builder/[businessId]`
- **`vendor_approval_packages` table**: Holds proposed layouts, inventory previews, and claims
- **Vendor Review Portal**: `/vendor/review-package/[token]` for vendor signoff
- **Parent-Child Inheritance**: Cascades configurations down through child showrooms or branches

## Activation Flow

1. Admin drafts high-fidelity pages and assigns brands/inventory.
2. An approval package is generated with a secure token.
3. Upon vendor acceptance:
   - Status switches to active.
   - `service_level` is set to `'curated'`.
   - Vendor claim status is confirmed and portal credentials are issued.
