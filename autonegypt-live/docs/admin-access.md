# AUTOFYON administration and client access

## Authority model

- `platformadmin@autofyon.com` is the platform administrator. Its `platform_admin`
  role and `["*"]` scope allow management of every AUTOFYON-hosted client,
  dashboard, admin account, and specialized solution.
- `admin@autonegypt.com` is the Auto One Egypt client owner. Its vendor role is
  scoped to `biz_auto_one_egypt`; its active owner membership allows management
  of that client's site, inventory, and sales accounts.
- Client sales identities are added by the client owner or platform
  administrator. A client can have at most four non-revoked sales accounts.
  Their D1 authorization scopes include only the assigned client business.

AUTOFYON is the single administration authority. A client can open its scoped
dashboard from the client minisite's **Manage this business** link or by visiting
`/admin` on its own custom domain. The custom-domain entry resolves that domain
to its business and redirects to the matching dashboard on AUTOFYON; all other
administration paths also redirect to AUTOFYON. The AUTOFYON slug remains the
marketplace presence. These are entry links, not separate admin systems.

## Authentication

Cloudflare Access is the identity provider. The application maps the
Access-authenticated email to an active `admin_users` record and business
membership in D1. No application password is set or stored for these accounts;
the platform administrator's Access identity receives platform-wide authority
through its D1 role and scope, not through a shared dashboard password.
The old demo password login is disabled in every environment. Treat any
previously shared demo passwords as compromised; do not reuse them.

Signed admin sessions use the Cloudflare Worker secret `ADMIN_SESSION_SECRET`.
Configure it under the `peeppeepmasr` Worker’s **Settings → Variables and
Secrets**. Replace any previously used source-code fallback with a newly
generated secret; rotating it invalidates existing admin sessions. Never put
this value in the repository or GitHub Actions settings. For local development,
use a different value in the untracked `.dev.vars` file. Session creation fails
explicitly when the secret is not configured.

Before deploying production changes, configure Cloudflare Zero Trust Access:

1. Protect the AUTOFYON admin pages and their APIs, including `/admin/*`,
   `/api/admin/*`, and other private API routes such as the Media Manager
   account endpoints. Keep public minisite and inventory routes public.
2. Restrict the platform-admin identity to the named platform operator account.
   Restrict client owner and sales identities to accounts approved by the
   platform. Require MFA in the identity provider.
3. Ensure requests cannot reach the application origin while bypassing Access.
   The application consumes `Cf-Access-Authenticated-User-Email`; this header
   must only be supplied by the Access-protected Cloudflare path.
4. Configure Access to allow each salesperson's work email before adding that
   email to the client's team in AUTOFYON. Removing or suspending the D1
   membership revokes AUTOFYON business access; remove the identity from Access
   too if the person should no longer sign in to any protected application.

The Access application, MFA policy, DNS, and deployment settings are managed in
Cloudflare and are not changed by this repository migration.

## Local setup

Apply migrations through the latest numbered migration to the intended D1
database. Migration `0032` provisions the platform identity and the
Auto One Egypt owner/membership, and disables the old demo super-admin account.
It contains no password or secret.

The owner dashboard is
`/admin/showroom/biz_auto_one_egypt`. It includes a team manager for up to four
sales accounts, with add, suspend, reactivate, and revoke controls. Sales
members authenticate through Cloudflare Access and remain business-scoped.
The platform administrator can access the same client dashboard, appoint or
suspend client owners, and manage its sales team as well.

Do not apply migrations remotely or deploy until the Cloudflare Access policies,
approved identity emails, and production database target have been reviewed.

## Activity reporting

Migration `0033_business_analytics.sql` adds client-scoped traffic and contact
events. A client owner can view the last 30 days at
`/admin/showroom/{businessId}/activity`; platform administrators can view
cross-client totals at `/admin/platform/activity`.

The reports distinguish page views, vehicle-detail views and clicks, and phone
or WhatsApp link clicks. Link clicks are not completed calls or conversations.
Only the business contact destination is recorded for contact clicks; visitor
phone numbers, IP addresses, and persistent visitor identifiers are not
collected. The source is limited to the referring hostname, not its URL path
or query string. Staff attribution is recorded only when a valid signed
`admin_session` cookie is present and the staff member is authorized for the
business; ordinary public visitor activity remains unattributed.

The public event endpoint validates the business and vehicle relationship but
is not proof of human traffic. Before production rollout, configure Cloudflare
rate limiting for `/api/analytics/events` and review retention requirements.
