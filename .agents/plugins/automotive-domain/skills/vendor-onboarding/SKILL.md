---
name: vendor-onboarding
description: >-
  Use this skill when working on the 3-level vendor onboarding system:
  Level 1 (template outreach for mass acquisition), Level 2 (admin-curated
  minisites with vendor approval), and Level 3 (CRM management with engagement
  scoring and level transitions). Covers database schema, API routes, and
  implementation phases.
---

# 3-Level Vendor Onboarding System

The vendor onboarding system operates at three levels, each building on the
previous. `subscription_tiers` remain separate from `service_level`.

## Levels Overview

| Level | Name | Mode | Who Acts |
|---|---|---|---|
| **1** | Template Outreach | Automated, scalable | System batch-sends |
| **2** | Admin-Curated | Manual, polished | Admin prepares → vendor approves |
| **3** | CRM Management | Relationship engine | Account managers nurture |

## Quick Decision Guide

- Want to onboard 100 vendors fast? → Level 1
- Want a premium vendor with polished page? → Level 2
- Want to track/nurture relationships? → Level 3

## Detailed References

- **[Level 1 — Template Outreach](references/level1-template.md)** — Batch
  engine, auto-provisioning, free feature showcase
- **[Level 2 — Admin-Curated](references/level2-curated.md)** — Minisite
  builder, approval packages, review portal
- **[Level 3 — CRM Management](references/level3-crm.md)** — Unified identity,
  engagement scoring, level transitions, automation

## Database Changes Required

- 4 new tables: `outreach_templates`, `vendor_approval_packages`,
  `vendor_level_transitions`, `vendor_engagement_scores`
- 4 schema changes: `businesses.service_level`, `businesses.account_manager_id`,
  `vendor_portal_accounts.profile_id`, `profiles.portal_account_id`

## Implementation Priority

1. **Phase 1 (Foundation)**: `service_level` column + unified vendor identity + transitions
2. **Phase 2 (Level 1)**: Outreach templates + batch send engine (highest ROI)
3. **Phase 3 (Level 2)**: Approval packages + review portal
4. **Phase 4 (Level 3)**: CRM dashboard + engagement scoring + automation
