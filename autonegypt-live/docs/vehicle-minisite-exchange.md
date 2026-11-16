# Vehicle minisite exchange

The portal and each client minisite keep separate records. This integration exchanges explicit vehicle snapshots; it never creates a continuously shared mutable vehicle record. **Every inbound or outbound vehicle version waits for platform-admin approval.**

## What is exchanged

The versioned `schemaVersion: 1` JSON payload contains:

- vehicle title, type/category, condition/status, year, mileage, color, price, currency, negotiation flag, and specification overrides;
- approved vehicle gallery rows, including image/video/YouTube media, carousel placement/order/hero flags, captions, and slide metadata;
- the car-specific site design preset, logo, accent/background colors, and HTTPS social links.

Private VIN, business credentials, and unrelated vendor records are excluded. Imported cars remain drafts unless the admin explicitly checks **Publish imported vehicle on AUTOFYON** when approving.
On approval, image files and YouTube preview images are copied into AUTOFYON's R2 media storage (10 MB per image, 50 MB total per vehicle version). Video media URLs and YouTube video IDs remain external references.

## Admin setup

1. Apply all pending database migrations in order (including `0025_shared_unit_vendor_offers.sql`, `0026_connected_vendor_sites.sql`, and `0027_vehicle_exchange_and_unit_socials.sql`). Do not skip earlier pending migrations.
2. Deploy the portal.
3. Open **Admin → Vehicle Exchange** and choose the client.
4. Create an exchange key. Copy it once to the client site’s **server-side secret store**; never put it in browser JavaScript or commit it to source control. Rotating it invalidates the previous key.
5. To send a portal car outward, first assign and publish its vendor offer for the client, then stage a snapshot and approve it from the review queue. To bring a client car in, the client site submits a proposal and the admin approves that exact version.

## Client-site API

Base URL: `https://autofyon.com/api/vehicle-exchange/{vendorSlug}`. Send the exchange key in the `Authorization: Bearer <key>` header.

### Submit an inbound version

```http
POST /api/vehicle-exchange/{vendorSlug}
Content-Type: application/json
Authorization: Bearer <key>

{ "action": "submit", "payload": { "schemaVersion": 1, "vehicle": {}, "socialLinks": {}, "design": {}, "media": [] } }
```

The API validates and records the proposal as pending. It does not apply the vehicle or media before admin approval. Each changed version produces a new review item.

### Fetch approved outbound versions

```http
GET /api/vehicle-exchange/{vendorSlug}
Authorization: Bearer <key>
```

The client site applies only the returned approved snapshots, then acknowledges each after successful application:

```http
POST /api/vehicle-exchange/{vendorSlug}
Authorization: Bearer <key>
Content-Type: application/json

{ "action": "acknowledge", "proposalId": "<update id>" }
```

An acknowledgement only marks delivery; it does not change the portal source. The client frontend/server adapter is responsible for persisting an approved snapshot in its own database. Client-specific accounting, workflows, and other operational data are not exchanged.

## Current boundary

This repository implements the portal editor, approval queue, token-protected exchange API, central import, and export contract. The AutoNegypt Pages deployment’s application source is not present here, so its receiver/sender adapter must still be added to that site and configured with the server-side key before end-to-end exchange can run. DNS and production deployment are separate and are not changed by this feature.
