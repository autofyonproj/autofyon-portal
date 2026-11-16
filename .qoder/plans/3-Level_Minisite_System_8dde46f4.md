# 3-Level Vendor Minisite System — Architecture Plan

## Current State Summary

Your existing system already has substantial infrastructure:
- **Business types** with parent-child hierarchy (6 parents, ~16 children: accommodation > hotel/lodge/camp, food > restaurant/kitchen, etc.)
- **Subscription tiers** (free/basic/premium/gold/vip) with feature gating JSON
- **Vendor registration** with approval workflow (`open` or `approval_required` modes)
- **Terms/rules acceptance** — bilingual, versioned, SHA256-hashed, legally timestamped
- **Template system** — `minisite_templates`, `vendor_template_assignments`, `vendor_template_trials`
- **CRM infrastructure** — contacts, groups, WhatsApp campaigns, engagement tracking
- **Sales pipeline** — prospect-to-won stages, revenue tracking
- **Vendor lifecycle** — approve/reject/suspend/archive/restore with audit logging
- **WhatsApp-based onboarding** — token-based claim links via `minisite_vendor_handoffs`

**What is missing** is a unifying "service level" concept that ties these pieces together into a coherent 3-level progression.

---

## Level 1: Template Outreach (Parent-Child Mass Onboarding)

### Concept
Automated, scalable vendor acquisition. For each `business_type` (parent-child), the system generates and sends a pre-built minisite template with general messaging and free-tier features. The goal: get vendors into the system with zero admin effort per vendor.

### What Already Exists
- `business_types` table with `parent_id` hierarchy and `default_template_id`
- `minisite_templates` with tier access control
- `subscription_tiers.free` with defined feature limits
- WhatsApp campaign infrastructure (`crm_whatsapp_campaigns`)
- Token-based onboarding (`/api/onboard/[token]`)

### What Needs to Be Built

**A. Outreach Template Registry** — new table `outreach_templates`
- Links a `business_type_id` (parent or child) to a message template
- Fields: `id`, `business_type_id` (FK), `target_scope` (enum: `parent_only | children_only | both`), `template_name`, `message_subject_en`, `message_subject_ar`, `message_body_en`, `message_body_ar`, `included_features` (JSON — list of free features highlighted), `cta_type` (enum: `claim_profile | preview_minisite | register`), `minisite_template_id` (FK — the template they get), `is_active`, `created_by`, timestamps
- Each parent type (accommodation, food, adventure, etc.) gets its own outreach template with messaging tailored to that vertical
- Child types can override the parent template or inherit it

**B. Batch Outreach Engine** — new API route `/api/jana/outreach/batch-send`
- Admin selects a `business_type` (parent or child)
- System queries all unclaimed businesses (`is_claimed=0`) of that type
- For each, generates a personalized WhatsApp/email using the outreach template
- Creates `minisite_vendor_handoffs` records with status `draft -> sent`
- Uses existing CRM campaign infrastructure for delivery tracking

**C. Auto-Provisioning on Claim**
- When a vendor clicks the outreach link and claims their profile:
  1. Existing `/api/onboard/[token]` flow handles authentication
  2. Auto-assign the `default_template_id` from their `business_type`
  3. Set `subscription_tier = 'free'`
  4. Set new column `service_level = 'template'` on businesses table
  5. Trigger terms acceptance flow (already exists)
  6. Business becomes visible with free-tier feature set

**D. Free Feature Showcase**
- Each outreach template highlights what the vendor gets for free based on `subscription_tiers.free.features`:
  - Basic minisite with up to 5 images, 3 carousel slides
  - Contact info display (phone, WhatsApp, email)
  - Location on map
  - Business description and category listing
- Recommendations for enhancement:
  - Add a "feature preview" page that renders a sample minisite for their business type before they claim
  - Include a comparison table showing free vs. paid features in the outreach message
  - Track which free features each vendor actually uses to identify upsell opportunities

### Enhancement Recommendations for Level 1
1. **Smart outreach timing**: Track when messages get best open rates per business type and schedule sends accordingly
2. **A/B test outreach templates**: Support multiple active templates per business type to optimize conversion
3. **Auto-generated content**: Pre-populate minisite sections (hero image, description) from existing business data so the vendor sees value immediately on claim
4. **Referral tracking**: Add `referred_by` field to track if vendors were brought in by other vendors (viral growth)
5. **Progressive feature unlock**: After 30 days of activity, auto-unlock one additional feature (e.g., extra carousel slide) to increase engagement

---

## Level 2: Admin-Curated Minisites (Direct Vendor Engagement)

### Concept
Admin team manually prepares a polished minisite for a specific vendor, then sends it for review and approval. Upon vendor acceptance (including terms/rules), they become a registered vendor. This is the high-touch, premium onboarding path.

### What Already Exists
- `minisite_vendor_handoffs` with revision-based workflow and WhatsApp tracking
- `businesses.draft_data` (JSON) for admin-prepared content
- `businesses.admin_overrides` (JSON) for admin customizations
- `businesses.is_master` flag for blueprint templates
- Vendor approval flow with `approval_status` lifecycle
- Full terms acceptance with legal audit trail
- `vendor_template_assignments` with `assignment_source = 'admin'`

### What Needs to Be Built

**A. Admin Minisite Builder Workflow** — enhance existing admin panel
- New admin page: `/jana/minisite-builder/[businessId]`
- Admin selects a business (existing or creates new)
- Admin picks a template appropriate for the business type (uses existing `minisite_templates`)
- Admin fills in content: hero images, descriptions, services, contact info
- Content stored in `businesses.draft_data` JSON with structured schema
- Admin can preview the minisite exactly as the vendor will see it
- Admin marks it "ready to send"

**B. Vendor Approval Package** — new table `vendor_approval_packages`
- Fields: `id`, `business_id` (FK), `prepared_by` (FK to profiles — the admin), `template_id` (FK), `package_data` (JSON — snapshot of the prepared minisite), `message_to_vendor_en`, `message_to_vendor_ar`, `status` (enum: `draft | sent | viewed | accepted | rejected | expired`), `sent_via` (enum: `whatsapp | email | sms | in_app`), `sent_at`, `viewed_at`, `responded_at`, `vendor_notes`, `terms_version`, `terms_accepted`, `expires_at`, timestamps
- This creates a formal, auditable record of what was sent and what was accepted

**C. Vendor Review Portal** — new page `/vendor/review-package/[token]`
- Vendor receives a link (via WhatsApp/email)
- Views the prepared minisite in a read-only preview
- Can leave comments/change requests (stored in `vendor_notes`)
- Must accept terms/rules (existing agreement system)
- On acceptance:
  1. `businesses.status` -> `'active'`
  2. `businesses.service_level` -> `'curated'`
  3. `businesses.is_claimed` -> `1`
  4. `businesses.approved_by_vendor` -> `1`
  5. `draft_data` merged into live configuration
  6. Profile created/linked with `approval_status = 'approved'`
  7. Vendor becomes a registered vendor with dashboard access

**D. Parent-Child Inheritance for Curated Minisites**
- When admin prepares a minisite, they can base it on the parent type's blueprint (`is_master=1` businesses)
- Child-type specifics are layered on top (e.g., "hotel" inherits from "accommodation" blueprint but adds room types section)
- `businesses.resolved_template_id` stores the final resolved template after inheritance

### Enhancement Recommendations for Level 2
1. **Revision workflow**: Allow multiple rounds of admin-vendor back-and-forth before final acceptance (the handoff table already supports revisions)
2. **Expiry and re-engagement**: If vendor doesn't respond within X days, auto-send a follow-up; after Y days, mark as expired and notify sales team
3. **Quality score**: Admin rates the minisite quality (1-5) before sending, used for marketplace ranking
4. **Vendor onboarding checklist**: After acceptance, guide vendor through completing remaining sections (gallery upload, service pricing, hours of operation)
5. **Upsell integration**: When presenting the curated minisite, show "locked premium features" that the vendor could unlock by upgrading tier

---

## Level 3: CRM Management Layer (Unified Relationship Engine)

### Concept
A management layer that tracks and nurtures vendor relationships across both Level 1 and Level 2, with pipeline stages, account ownership, communication history, and conversion tracking.

### What Already Exists
- `vendor_sales_pipeline` with stages and pricing
- `crm_contacts`, `crm_groups`, `crm_group_members`
- `crm_whatsapp_campaigns` with recipient tracking
- `vendor_notifications` with engagement metrics
- `vendor_lifecycle_events` audit log
- `vendor_portal_accounts` (separate from `profiles`)
- `revenue_tracking` with payment and commission data

### What Needs to Be Built

**A. Unified Vendor Identity** — bridge `vendor_portal_accounts` and `profiles`
- Add `profile_id` FK column to `vendor_portal_accounts` (nullable, linked when vendor registers)
- Add `portal_account_id` FK column to `profiles` (nullable, linked when CRM contact converts)
- Create a view `unified_vendor_view` that joins both tables for CRM queries
- Migration to link existing records where email/phone matches

**B. Service Level Column** — add to `businesses` table
- New column: `service_level ENUM('template', 'curated', 'managed') DEFAULT 'template'`
- `template` = Level 1 (self-service, free tier, mass onboarded)
- `curated` = Level 2 (admin-prepared, vendor-approved)
- `managed` = Level 3 (full CRM relationship, dedicated account manager)
- This is the single most important structural addition

**C. Account Manager Assignment** — add to `businesses` table
- New column: `account_manager_id VARCHAR(36)` FK to `profiles`
- Replaces scattered `assigned_to_sales_id` pattern
- Account manager sees all their assigned vendors in a unified dashboard

**D. CRM Dashboard** — new admin pages under `/jana/crm/`
- **Pipeline View**: Kanban board showing vendors by stage (prospect -> contacted -> demo -> negotiation -> won/lost)
- **Level Distribution**: Visual breakdown of vendors by service level
- **Conversion Funnel**: Level 1 -> Level 2 -> Level 3 progression rates
- **Account Manager View**: Each manager sees their assigned vendors, upcoming actions, overdue follow-ups
- **Communication History**: Unified timeline of all interactions (WhatsApp, email, in-app messages, lifecycle events)

**E. Level Transition Engine** — new table `vendor_level_transitions`
- Fields: `id`, `business_id` (FK), `from_level`, `to_level`, `triggered_by` (FK to profiles), `trigger_type` (enum: `manual | auto_upgrade | auto_downgrade | admin_promotion`), `reason`, `metadata` (JSON), `created_at`
- Auto-upgrade rules:
  - Level 1 -> Level 2: When admin prepares and sends a curated minisite for a Level 1 vendor
  - Level 2 -> Level 3: When account manager is assigned and vendor enters sales pipeline
- Auto-downgrade rules:
  - Level 3 -> Level 2: Account manager removed, no active pipeline entry
  - Level 2 -> Level 1: Vendor inactive for 90+ days, no admin engagement

**F. Engagement Scoring** — new table `vendor_engagement_scores`
- Fields: `id`, `business_id` (FK), `score` (0-100), `last_login`, `content_completeness` (0-100%), `response_rate` (0-100%), `days_since_last_activity`, `tier_upgrade_likelihood` (low/medium/high), `computed_at`
- Computed daily from: login frequency, minisite completeness, message response rate, content updates, service listing activity
- Used by CRM dashboard to prioritize outreach and identify at-risk vendors

---

## Database Migration Summary

### New Tables
1. `outreach_templates` — Level 1 message templates per business type
2. `vendor_approval_packages` — Level 2 admin-prepared minisite packages
3. `vendor_level_transitions` — Level 3 audit trail for level changes
4. `vendor_engagement_scores` — Level 3 computed engagement metrics

### Schema Changes to Existing Tables
1. `businesses` — add `service_level ENUM('template','curated','managed') DEFAULT 'template'`
2. `businesses` — add `account_manager_id VARCHAR(36)` FK to profiles
3. `vendor_portal_accounts` — add `profile_id VARCHAR(36)` FK to profiles
4. `profiles` — add `portal_account_id VARCHAR(36)` FK to vendor_portal_accounts

### New API Routes
1. `/api/jana/outreach/batch-send` — Level 1 batch outreach
2. `/api/jana/outreach/templates` — CRUD for outreach templates
3. `/api/jana/minisite-builder/[businessId]` — Level 2 minisite preparation
4. `/api/jana/approval-packages` — Level 2 package management
5. `/api/vendor/review-package/[token]` — Level 2 vendor review portal
6. `/api/jana/crm/dashboard` — Level 3 CRM data
7. `/api/jana/crm/level-transitions` — Level 3 level management
8. `/api/jana/crm/engagement-scores` — Level 3 scoring

### New Pages
1. `/jana/outreach` — Admin outreach management (Level 1)
2. `/jana/minisite-builder/[businessId]` — Admin minisite builder (Level 2)
3. `/jana/approval-packages` — Admin package tracking (Level 2)
4. `/vendor/review-package/[token]` — Vendor review portal (Level 2)
5. `/jana/crm` — CRM dashboard with pipeline, levels, engagement (Level 3)

---

## Implementation Priority

**Phase 1 (Foundation)**: Add `service_level` column to businesses, unify vendor identity, create `vendor_level_transitions` table. These are prerequisites for everything else.

**Phase 2 (Level 1)**: Build outreach templates and batch send engine. This is highest ROI — scales vendor acquisition with minimal admin effort.

**Phase 3 (Level 2)**: Build vendor approval packages and review portal. Enhances the existing handoff system with formal acceptance workflow.

**Phase 4 (Level 3)**: Build CRM dashboard, engagement scoring, and level transition automation. Ties everything together for ongoing relationship management.

---

## Assumptions
- The existing `business_types` parent-child hierarchy is stable and does not need restructuring
- WhatsApp remains the primary outreach channel (email as secondary)
- The existing terms acceptance system (versioned, bilingual, hashed) is sufficient for all levels
- `subscription_tiers` remain separate from `service_level` — a vendor can be at any service level with any subscription tier (though Level 1 typically starts at free tier)
