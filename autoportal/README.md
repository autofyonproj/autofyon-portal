This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin site builder

Open `/admin/site-builder` to choose a customer site or inventory listing. Customer minisites share the same editorial layout and page structure, while each business can customize its own logo, accent color, and background color. Individual vehicle listings retain their reusable layout presets. Vendor/model content, carousels, and blogs are edited in Content Studio, while each vehicle listing has its own gallery/carousel editor. The global journal is available to platform admins at `/admin/platform/blog`.

For automotive make/model sites, choose **Manage pages and components** from the Site Builder target to open the page editor. Each make/model has a main page and can have additional update pages at `/{site}/pages/{page-slug}`. Arrange a required hero carousel and reusable model-details, model-lineup, inventory, offers, gallery, blog, finance, FAQ, and contact components; blocks can be dragged to reorder or managed with the arrow controls. Draft edits stay private until published, and custom pages can be unpublished without losing their draft.

Inventory supports cars, motorcycles, scooters, and commercial vehicles; new/used/demo/lease-return remains a separate condition filter. Apply local D1 migrations with `npm run db:migrate:local`; apply them to production only through the separately reviewed remote migration command.

Client custom domains can have a separately assigned AUTOFYON-hosted template and inventory-card presentation while the AUTOFYON slug remains the marketplace page. Platform admins configure these at `/admin/platform/custom-sites`; see [custom-domain site guidance](./docs/custom-domain-sites.md). This is separate from externally hosted connected vendor sites.

Vendor directory records can be staged as unclaimed prospects and filtered by category, location, brand, contactability, duplicates, and free-offer status at `/admin/platform/vendor-prospects`. The free-offer queue does not send outreach automatically; see [vendor prospect guidance](./docs/vendor-prospects.md).

## AUTOFYON Media Manager and customer plans

The Media Manager at `/media-manager/` keeps free drafts and media on the user's device. A signed-in showroom owner can link a business account to check its AUTOFYON plan; only account linking updates the server-side last-activity time used for customer follow-up. Anonymous users remain local and cannot be individually tracked.

For a vehicle ad, link the showroom account and choose **Add a car to AUTOFYON**. The listing form loads the live brand, model, and trim classifications, validates the selected hierarchy and model-specific specification choices, uploads the selected photos to R2, and publishes the vehicle listing. Vendor photos follow the existing approval workflow. After a successful listing, the user returns to the Media Manager with the classified vehicle details and AUTOFYON listing link prefilled for a locally saved social draft. The composer can export captioned 4:5 image slides as a ZIP for manual upload as a social carousel, or create a vertical slideshow video with MP4 when the browser supports it (otherwise WebM where supported). WhatsApp, website, listing, and configured profile links are included in copied/shared caption text; they are not clickable inside video. These exports are created locally and are not posted automatically.

The Media Manager also lets an active showroom owner publish an optional starter page at `/p/{slug}`. It contains basic business details and contact links, with a carousel of up to three uploaded photos and three embedded YouTube videos; it never includes vehicle inventory. To add a video, upload it to YouTube first, set it to Public or Unlisted, allow embedding, then paste its watch, `youtu.be`, Shorts, or Live URL into a video field. Video files cannot be uploaded directly into these URL fields; the carousel offers an explicit play/pause button and a link to open videos YouTube will not embed. Unpublished drafts and photos remain in the browser's local storage. Publishing requires explicit consent and uploads the selected page data and photos to AUTOFYON; owners can unpublish or delete the page afterward. Photo-to-video exports are saved to the owner's device; to feature one on the starter page, the owner uploads it to YouTube and adds its link. Direct video hosting and automatic social publishing are not enabled. Free pages display AUTOFYON attribution, which is hidden only while the business has an active paid plan.

Showroom contact and social-profile settings are stored locally in separate profiles keyed by the linked showroom account or, before linking, by showroom name. The Media Manager opens on a short-create action; its destination menu and optional profile/account fields are collapsed until needed. The setup guide proceeds one step at a time, saves progress on the device, and resumes at the last step. It links to official Google Account and YouTube channel creation pages; customers create accounts themselves, upload videos to YouTube, and add the resulting links to their page. Saving a contact profile does not create a shared account or send notifications. The current setup does not request a national ID.

The Almostashar Media Manager PWA is served from `/media-manager/index.html` on AUTOFYON.com (the `/media-manager/` path is a separate Next.js route). It uses the Almostashar Integrated Solutions logo with a Media Manager product lockup, installs as **Almostashar Media**, and provides 192px, 512px, maskable, and Apple touch icons based on the Almostashar mark. AUTOFYON.com is identified as the hosting platform. The install prompt is available in supported browsers; iPhone users can use Safari's **Share → Add to Home Screen**. HTTPS is required. The service worker caches the app shell and brand assets for offline opening; account verification and publishing still require a network connection. Update `public/media-manager/sw.js` cache version when changing shell assets.

Free accounts include an AUTOFYON.com credit in shared captions and downloaded cards, and eligible showroom minisites show a powered-by link. Platform admins can review registered business owners and manage free/paid status, paid-through date, contact phone, activity, follow-up date, and notes at `/admin/platform/media-manager/customers`. Paid plans are manually activated only after payment verification; the dashboard does not collect or process payments. A paid plan removes the sponsorship while active and before its paid-through date.

Apply the Media Manager customer-plan and starter-page migrations locally with `npm run db:migrate:local`. The equivalent remote migrations must be reviewed and applied before deployment. Other AUTOFYON products should check `requiresAutofyonSponsorship` before removing their sponsorship.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
