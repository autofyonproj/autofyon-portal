# Custom-domain client sites

The AUTOFYON slug remains the client's marketplace presence. An assigned custom
domain is a separate presentation of that same business and canonical inventory,
hosted by the AUTOFYON application.

The custom domain is for the client's public website, not its administration
entry point. Client owners and sales users sign in through Cloudflare Access at
the AUTOFYON host; the client's private dashboard is business-scoped there.
Platform administrators retain platform-wide access. See
[admin access guidance](./admin-access.md).

Platform admins assign the custom-domain template and choose which vehicle facts
appear on inventory cards at `/admin/platform/custom-sites`. Available card
settings cover year, price, availability, mileage, and an optional link to the
full vehicle page on AUTOFYON. The selected presentation applies only when a
request arrives through the business's configured custom domain; the AUTOFYON
slug continues using its own site presentation.

Vehicle listings and facts are read from AUTOFYON's inventory. These settings
control what the custom-domain site displays; they do not create a second
inventory record or override canonical vehicle data. Each custom-domain
inventory card can optionally link to the corresponding full AUTOFYON listing.

Apply migration `0028_custom_domain_site_profiles.sql` before using the admin
page. Domain DNS, TLS, and production routing must also be configured separately.
External websites that remain hosted by the client use the connected vendor-site
integration described in [connected-vendor-sites.md](./connected-vendor-sites.md).
