# Landing-page CRM

The Free-package CRM is a feature of an eligible, published vendor landing page. It is not a CRM-only or standalone account: unpublishing or suspending the business disables public lead capture and its inbox. The inquiry form is available on published vendor minisites and published starter pages at `/p/[slug]`.

## What it captures

Visitors may submit their name, phone, optional email, inquiry, optional vehicle/service/product, and explicit contact consent. The CRM records the page source and a coarse source category. Call and WhatsApp link clicks remain analytics events; they are not named leads and do not confirm a conversation.

The public form accepts only active, published businesses from `VENDOR_LEAD_BUSINESS_TYPES`. It has a honeypot, validates input and same-origin submissions, and limits submissions to 30 per hashed client-address/business bucket per hour. Raw client addresses are not stored; expired rate-limit rows are cleaned during later submissions.

## Vendor inbox

An eligible business owner or authorized team member opens `/admin/showroom/[businessId]/leads`. The inbox is tenant-scoped and supports stage, notes, next follow-up, and an activity history. The route and APIs require an active, published business; the lead record is always read or changed with its `business_id`.

## Optional standalone ERP connection

Free remains page-bound. Growth, Pro, and Enterprise licenses can use the CRM inside the standalone ERP, with or without a page connection. A vendor on a paid tier may optionally issue a connection token from the landing-page CRM inbox and enter it in the packaged ERP. Page-created leads then sync in both directions: stage, notes, follow-up date, archive state, and activity history. ERP-only leads remain local and are never created in the page CRM.

Updates use revision checks; concurrent edits are surfaced for review instead of silently overwriting either side. Deleting a linked lead in ERP is a soft archive. Tokens are high-entropy, business-scoped, stored only as SHA-256 hashes, shown once, and revocable. Reissuing a token invalidates its predecessor. The standalone app stores the entered token in that browser's local storage; use it only on a trusted device. Imported records remain in the ERP if the connection is revoked.

## Release

Apply migrations `0037_landing_page_crm.sql` through `0042_vendor_lead_documents.sql` in sequence before enabling these features. Existing page-to-ERP tokens remain read-only until their owners issue a replacement. Migrations `0040` through `0042` are new; none of these changes have been applied or deployed. Create the private R2 bucket `autofyon-crm-documents` and configure the `CRM_DOCUMENTS` binding before enabling online attachments.

## Current implementation boundary

- **Page CRM:** linked page leads synchronize with a paid-tier ERP connection, with revision conflicts surfaced for review and archives kept soft. ERP-only leads remain local.
- **Dealer identity:** an administrator can link a standalone license to an active AutoFyon `business_id`. This binding is required for financial draft exchange; leaving it blank keeps that ERP copy standalone.
- **Accounting continuity:** the packaged ERP can submit finalized vehicle sales and purchases as immutable, idempotent drafts. An owner/accountant reviews them in the AutoFyon dashboard. Approval makes a draft available to another linked ERP copy; importing it adds the supplied journal entries once to that copy's local ledger. Nothing posts automatically to a central ledger, and the original source ERP keeps its own local entries.
- **CRM documents:** online dealer CRM supports optional identity, vehicle, finance, contract, and other attachments. Files accept PDF/JPEG/PNG/WebP up to 15 MB, are stored in the separate private R2 bucket, and can only be listed/downloaded/deleted through authenticated, business-scoped CRM routes; the public media endpoint is not used. Camera photos and selected image pages can be combined in-browser into one PDF. Standalone ERP keeps its own attachments in that browser's IndexedDB and offers the same upload/camera/multipage-PDF flow. Standalone files are not encrypted by the app, are not included in Excel backups, and do not sync to the online CRM or another device; use only trusted devices and export important files separately. Attachments are optional and never block lead or contract progression.
- **Used-car journey:** the packaged ERP now follows seller call and callback → purchase and recorded travel costs → arrival at the showroom → available stock → buyer inquiry linked to a car → sale contract and credit/installment follow-up → linked insurance policy and renewal reminder. Seller and buyer calls are manually logged; there is no phone-system integration.
- **Purchase accounting:** the vehicle's base price plus up to 30 added costs (delivery, fuel, oil, driver, or other) are recorded separately. Each added line can be capitalized into vehicle inventory (`1040`) or expensed to `5090 - مصروفات شراء وتجهيز المركبات`, with its own cash/bank/credit payment method. Capitalized costs increase inventory basis and cost of sales when sold; expensed items do not. A car in transit is not sellable and cannot be submitted as a finalized accounting draft until arrival is recorded. Historical inventory without a purchase identity is not inferred as a purchase.
- **Sale and follow-up:** sales contracts keep the inventory car identity and post its cost from inventory to cost of sales for dealer-owned vehicles. The standalone ERP supports cash sales, dealer-owned installments collected by cash or bank, and external-finance sales. External lender schedules are marked estimated until staff enter the lender-approved dates and amounts; payment confirmations are reference-only and do not post customer installments as dealer receipts or send dealer collection reminders. The lender's agreement reference, pending/partial/received settlement, partial receipts, and cash/bank settlement journal entries are tracked separately under `1055 - مستحقات شركات التمويل`. Existing historical lender contracts without a recorded settlement amount remain flagged for manual review; their past postings are not reconstructed automatically. Insurance policies are tracked by contract/car, provider, policy number, premium, and coverage dates, with an in-app alert for expiration within 30 days and manual renewal recording. Insurance premiums are tracked but are not automatically posted to the ledger; insurer APIs and phone integration are not implemented.
- **Social manager:** tier-limited Arabic/English drafts and editorial dates are saved in the website CRM. Pro/Enterprise owners can approve drafts internally. The UI is manual-share only; no provider account is connected and no scheduled publishing occurs.
- **Still not Enterprise-complete:** CRM assignment, custom fields, automation, branch routing, and consolidated reporting are not implemented as full workflows. Social OAuth, connected-account management, and real provider publishing are also not implemented. Growth pricing remains unapproved.

These are implementation changes only. They are typechecked but still require schema rollout, staged integration tests, provider authorization where applicable, and deployment before being called live.

## Proposed four-tier, four-stage rollout

The package ladder is **Free Starter → Growth → Pro → Enterprise**. The registry now defines all four CRM/social entitlement sets; Growth pricing is still undecided, and the advanced CRM/social capabilities represented by those entitlements are not all implemented. Keep existing Pro and Enterprise prices unchanged unless pricing is separately approved.

For the detailed, editable Arabic comparison, see [vendor-tier-comparison-ar.xlsx](./vendor-tier-comparison-ar.xlsx). It includes a four-tier matrix, a four-column summary, editable decision notes, and implementation references.

For the detailed CRM capability ladder, Enterprise completeness checklist, and four-stage CRM build sequence, see [crm-tier-feature-matrix-ar.xlsx](./crm-tier-feature-matrix-ar.xlsx). The vendor inbox API currently limits a response to 500 leads and 10 activities per lead and stores only coarse source attribution. The ERP sync API pages at 250 leads and currently returns up to 5,000 activities per page; Enterprise readiness still requires complete, validated campaign attribution and explicit activity-pagination guarantees.

For customer-facing explanations of who each tier suits, how to check satisfaction, when to show the next tier, and Arabic in-product message examples, see [tier-value-and-upgrade-guide-ar.xlsx](./tier-value-and-upgrade-guide-ar.xlsx). Upgrade prompts should be triggered by an actual need, never by blocking lead capture or CRM access.

### Four-tier side-by-side comparison

This table has exactly four columns—one for each package. Current limits are labeled **Current**; additions and Growth are **Proposed**. A social profile link is not an authenticated publishing account.

| Free Starter | Growth (new) | Pro | Enterprise |
|---|---|---|---|
| **Price:** EGP 0 (Current)<br>**Inventory:** 10 active cars (Current)<br>**Landing page:** 3 image slides; Standard and Classical templates; no custom domain (Current)<br>**Search:** 1.0× boost (Current)<br>**Social:** 4 bilingual draft packs/month; manual copy/share; profile links (Proposed manager)<br>**CRM:** page-bound inbox, pipeline, notes, follow-up, activity history; no subscription lead cap<br>**Reporting:** distinguish page visits, clicks, and submitted leads (Proposed)<br>**ERP:** page-bound CRM; standalone connection unavailable | **Price:** TBD<br>**Inventory:** 25 active cars; 6 image slides (Proposed)<br>**Landing page:** Free templates; no custom domain (Proposed)<br>**Search:** TBD<br>**Social:** 2 connected accounts; calendar; up to 20 scheduled posts/month (Proposed)<br>**CRM:** basic standalone or page-connected CRM (entitlement defined; advanced features proposed)<br>**ERP:** optional two-way sync for page-created leads | **Price:** EGP 2,500/month (Current configuration)<br>**Inventory:** 50 active cars (Current)<br>**Landing page:** 10 slides with images/YouTube; Standard, Classical, and Obsidian templates; custom domain (Current)<br>**Search:** 2.5× boost (Current)<br>**Social:** up to 5 connected accounts and 100 scheduled posts/month; reusable campaigns; reviewed inventory-to-draft workflow (Proposed)<br>**CRM:** team assignment, workflow automation, richer source-to-lead reporting (Proposed)<br>**ERP:** standalone CRM or optional two-way sync for page-created leads | **Price:** EGP 7,500/month (Current configuration)<br>**Inventory:** 500 active cars (Current)<br>**Landing page:** 50 slides with images/YouTube/video; Standard, Classical, and Obsidian templates; custom domain (Current)<br>**Search:** 5.0× boost (Current)<br>**Social:** multi-branch accounts, approvals, shared brand templates, contract/fair-use publishing (Proposed)<br>**CRM:** branch routing, role controls, consolidated reporting (Proposed)<br>**ERP:** standalone CRM or optional two-way sync for page-created leads |

Growth pricing, exact quotas, and search placement require product approval. The existing configured prices are not a new price recommendation; confirm them before sale. Do not restrict or discard consented lead records to create a paid-tier upgrade.

### Stage 1 — Free Starter foundation

- Keep the CRM page-bound: lead capture and its inbox require an eligible, active, published vendor page. The standalone ERP remains optional and imports page inquiries one way.
- Keep lead intake and retention uncapped by subscription. Do not turn phone or WhatsApp clicks into named leads; report them as clicks unless the visitor submits the consented form.
- Save bilingual social drafts for manual copy/share. The current manager enforces the tier's draft allowance; it does not generate content from inventory or connect social accounts.
- Capture validated campaign attribution (platform/source, medium, campaign, and relevant content identifier) with the inquiry, so the CRM can show which shared campaign produced a submitted lead.
- Provide basic reporting that distinguishes landing-page visits, phone/WhatsApp clicks, and submitted leads.
- Do not enable automatic posting yet. The dispatcher no longer reports simulated success: it requires a successful provider response, and a webhook acceptance is not proof of final social publication.

**Exit gate:** attribution is covered by tests from tagged link through CRM lead; manual sharing works in Arabic and English; failed or unconfigured delivery is never shown as successful; the CRM migration and release are applied and verified in the target environment.

### Stage 2 — Growth (first paid tier)

- Introduce a new `growth` entitlement tier without changing existing tier IDs.
- The saved-draft/editorial-calendar foundation exists. Actual scheduled publishing remains disabled until reviewed official provider APIs and explicit account authorization are implemented.
- Candidate limits for discussion: 25 active vehicles, six image slides, two connected social accounts, and 20 scheduled posts per month for one business location.
- Include basic campaign and lead-source reports; keep manual publishing available if a provider is disconnected.

**Exit gate:** provider authorization, token storage/revocation, permissions, rate limits, retries, and published/failed status are verified; no credential passwords are collected or stored.

### Stage 3 — Pro

- Preserve the current Pro baseline: 50 active cars, 10 slides, YouTube media, custom domain, and the existing search boost.
- Add more connected accounts and publishing volume, team lead assignment, reusable campaign templates, and inventory-to-draft workflows that require vendor review before publishing.
- Add richer source-to-lead and follow-up reporting, with a longer reporting window than Growth.
- Candidate social limits for discussion: five connected accounts and 100 scheduled posts per month.

**Exit gate:** role and business scoping are tested; a vehicle update cannot silently publish without the configured approval; CRM and social activity remain auditable.

### Stage 4 — Enterprise

- Preserve the current Enterprise baseline: 500 active cars, 50 slides including video, custom domain, and the existing search boost.
- Add multi-location management, branch-specific social accounts, centralized brand templates, approval roles, consolidated reporting, and documented API/webhook integrations.
- Use contract-defined or fair-use capacity rather than promising unlimited publishing; provide operational monitoring and support expectations.

**Exit gate:** cross-branch isolation, permissions, approval history, failure handling, and reporting are validated before enabling the package for agency-scale accounts.

### Shared implementation and release rules

- Represent tier capabilities as explicit, typed entitlements; avoid scattering tier-name checks through UI and API routes. Keep limits server-enforced.
- Keep category templates data-driven so the first release can focus on car dealers while later packages can adapt content and workflow to other supported automotive vendor categories.
- Use official provider APIs only. Store revocable authorization securely; never ask vendors for social account passwords. No connected-account or publishing implementation is active yet.
- Roll out one stage at a time behind entitlements and feature flags, with migration, tests, a rollback path, and verified production health before advancing.
- The CRM change is currently local. Confirm all pending migrations are applied in sequence and resolve deployment capacity/build issues before announcing any stage as live.

All Growth limits and social-account/post quotas above are starting recommendations for product review, not final commercial commitments. Pricing, provider availability, and exact quotas should be approved before implementing those entitlements.
