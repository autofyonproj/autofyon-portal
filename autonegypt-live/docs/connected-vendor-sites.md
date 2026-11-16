# Connected vendor sites

Connected vendor sites let an administrator allow an external website to read selected public data from AUTOFYON. The vendor website remains hosted by its chosen provider; AUTOFYON remains the source of truth. No vehicle records or media are copied to the external host.

## Admin setup

1. Apply migrations `0025_shared_unit_vendor_offers.sql` and `0026_connected_vendor_sites.sql` in order. The shared-offer migration is needed for connected inventory reads.
2. Deploy the portal.
3. Open **Admin → Platform → Connected vendor sites**.
4. Choose an active vendor, enter its exact HTTPS origin (for example `https://vendor.example`), select the allowed components, then enable and save.
5. Assign and publish the vendor's vehicle offers in the vehicle distribution dashboard separately.

Only the platform admin can configure a connection. Disabling it immediately stops the read endpoint from returning data. The browser endpoint requires the configured `Origin`; CORS is an integration boundary, not a credential, and responses contain public data only.

## Read endpoint

```http
GET https://autofyon.com/api/connected-sites/{vendorSlug}?locale=en
Origin: https://vendor.example
```

`locale` may be `en` or `ar`. The response contains only the components selected by the administrator:

- `profile`: vendor name, slug, type, and site branding.
- `contact`: the vendor's public contact fields.
- `inventory`: the vendor's own published vehicles.
- `sharedVehicleOffers`: published vehicles assigned to that vendor, with the vendor's offer price/status.

Vehicle card links in the response are absolute AUTOFYON URLs. Images and vehicle details remain centrally hosted. A vendor frontend can call the endpoint with browser `fetch`; no API secret should be embedded in client-side code.

This endpoint is read-only. Vendors continue editing their offers through the AUTOFYON vendor dashboard. Arbitrary host-specific templates and full vehicle-detail rendering are not generated automatically; each external frontend must integrate the selected JSON components.
