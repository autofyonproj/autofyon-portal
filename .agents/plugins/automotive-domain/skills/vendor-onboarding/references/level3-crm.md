# Level 3 — CRM Management Layer

Level 3 provides enterprise vendor management across all onboarded accounts.

## Architecture

- **Unified Vendor Identity**: Links `vendor_portal_accounts` and `profiles`
- **`businesses.service_level`**: Tracks vendor maturity (`template`, `curated`, `managed`)
- **Account Manager Mapping**: `businesses.account_manager_id`
- **CRM Dashboard**: `/jana/crm/`
- **`vendor_level_transitions` table**: Full audit trail of tier/service level changes
- **`vendor_engagement_scores` table**: Tracks listing freshness, lead response time, and activity
