# Dealer CRM onboarding

The onboarding workflow starts in the platform-admin CRM:

1. Filter prospects in `/admin/platform/vendor-prospects/blast` and generate WhatsApp invitation links.
2. The system stores a one-use, seven-day invitation bound to the phone selected from that prospect's CRM record. Links carry the random invite token in the URL fragment; the raw token is not stored in D1.
3. Admins send the generated `wa.me` links manually. Generating links marks records as queued, not contacted.
4. The dealer verifies the bound phone with a WhatsApp OTP, edits a private profile draft, reviews the page, and records publication/contact consent.
5. Submitted applications appear in `/admin/platform/vendor-onboarding`. Approval publishes the business and landing page; requesting changes keeps both private.

## Forwarded invitations and dealer referrals

An invitation remains bound to the CRM phone it was created for. A recipient who is not the invited dealer can use the referral option on `/join` to submit the other dealer's contact details, provided they confirm the dealer consented to contact. This creates a private CRM lead for review; it does not verify the phone or send a message.

Platform admins review referrals in the **إحالات المعارض** queue on `/admin/platform/vendor-onboarding`. Approval makes an eligible lead available for invitation and provides a link to the WhatsApp composer preselected to that lead. Admins must still generate and manually send the direct invitation. Rejected or pending referral records are excluded from invitation generation.

## Meta WhatsApp Cloud API configuration

Configure these values for the Worker before enabling invitations:

- `WHATSAPP_TOKEN`: Meta Cloud API access token (Worker secret).
- `WHATSAPP_PHONE_NUMBER_ID`: WhatsApp Business phone-number ID.
- `WHATSAPP_OTP_TEMPLATE`: approved authentication/utility template name with one body placeholder for the six-digit code.
- `WHATSAPP_OTP_TEMPLATE_LANGUAGE`: approved template language code, such as `ar`.
- `WHATSAPP_GRAPH_API_VERSION`: optional Graph API version; defaults to `v22.0`.

The provider must have permission to send approved templates. Missing configuration or a rejected send fails closed; the server does not return OTP codes to the browser.

## Database rollout

Apply the additive onboarding migration before deploying code that uses it:

```powershell
npx wrangler d1 migrations apply autoportal-d1 --remote
```

Then deploy the Worker through the normal release process. The registration API and admin review screen require migration `0036_vendor_registration_onboarding.sql`.
