# Vendor prospects and free-offer targeting

The vendor directory import is stored separately from `businesses`. A directory
entry is an unclaimed prospect, not a registered AUTOFYON vendor and not an
authenticated account. Original category labels, contact fields, source names,
and source count are retained alongside a normalized category and country
classification.

Platform admins can review and filter prospects at
`/admin/platform/vendor-prospects` by category, country, city, brand, phone
availability, possible duplicate, free-offer eligibility, and campaign status.
Matching normalized names are provisionally grouped as prospective-client
accounts at `/admin/platform/vendor-prospects/groups`. Every source record stays
intact and appears as a possible branch, showroom, or service location. An admin
must confirm that the records belong to one company or separate them back into
individual leads; name matches are never treated as proof of common ownership.

The company-group page tracks account-level outreach status and next follow-up.
The account detail page keeps an admin activity history for notes, manual calls,
emails, WhatsApp contacts, meetings, outcomes, and follow-up dates. These are
CRM records only: the system does not send communications.

The initial free-offer cohort is Egypt-based automotive sales organizations
(dealers, showrooms, authorized agents, distributors, and agents) that have at
least one phone or mobile number in the source directory; fax-only records do
not qualify. Unknown or out-of-country
records remain available to filter but are not automatically added to this
cohort. This is only an admin queue; no email, SMS, WhatsApp, or other outreach
is sent by the import or status controls.

Apply migration `0030_vendor_prospects.sql` before using the admin list. Directory
imports are local to the configured D1 database and should be reviewed before
any production import or outreach.

Apply migration `0031_vendor_prospect_crm.sql` to create the provisional company
groups, preserve record-to-group links, and enable CRM activity history.
