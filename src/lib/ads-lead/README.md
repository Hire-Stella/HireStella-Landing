# HireStella · Ads landing page (hirestella.ai/get)

A single-page landing page for paid ads (Google Ads, Meta), with a thank-you
page and email lead delivery. It is part of the main website deployment but
shares no code with the Next.js pages: it is static HTML in `public/get`,
served at **/get** and **/get/thank-you** by rewrites in `next.config.ts`.

## Files

| Path | What it is |
| --- | --- |
| `public/get/index.html` | The landing page, at /get |
| `public/get/thank-you.html` | Where a delivered lead lands (/get/thank-you); fires the conversion |
| `public/get/assets/js/config.js` | **The settings you edit** (WhatsApp, privacy URL, tag IDs) |
| `public/get/assets/js/tags.js` | Loads GA4, Google Tag Manager and the Meta Pixel from config.js |
| `public/get/assets/js/landing.js` | Animations, form, validation |
| `public/get/assets/css/landing.css` | All styles, dark and light themes |
| `src/lib/ads-lead/lead.js` | Lead delivery: emails each lead to the team via Resend |
| `src/app/api/get-lead/route.ts` | Serves it at POST /api/get-lead |
| `tests/ads-lead.test.js` | Tests for the lead function (part of `pnpm test`) |

## Settings (`public/get/assets/js/config.js`)

- `WHATSAPP_NUMBER`: digits only with country code, e.g. `971501234567`.
  Empty = every WhatsApp button is hidden.
- `PRIVACY_URL`: full URL of the privacy policy. Empty = privacy links hidden.
- `FORM_ENDPOINT`: leave as `/api/get-lead`.
- `THANK_YOU_URL`: leave as `/get/thank-you`.
- `GTM_ID`: Google Tag Manager container ID, e.g. `GTM-ABC1234`. Empty = no GTM.
- `GA4_ID`: GA4 measurement ID (set to `G-DVWYC93VD9`). Loads the Google tag for page views.
- `META_PIXEL_ID`: Meta Pixel ID, digits only. Empty = no Pixel.

## Deploy

Nothing separate: it ships with the website whenever `main` deploys on Vercel.
The form uses the website's Resend variables, which must be set on the
hirestella.ai Vercel project (Production):

- `RESEND_API_KEY`
- `LEAD_EMAIL_TO`: who receives leads, comma-separated
- `LEAD_EMAIL_FROM`: e.g. `HireStella <leads@hirestella.ai>`, on a domain verified in Resend
- optional `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_TOKEN` for a CRM or sheet

After a deploy, submit one real test lead on https://hirestella.ai/get and
confirm the email arrives.

Until `RESEND_API_KEY`/`LEAD_EMAIL_*` (or a webhook) are set, `/api/get-lead`
answers 503 and the form shows an error, unless `WHATSAPP_NUMBER` is set, in
which case the lead is handed over by WhatsApp instead so it is never lost.

**What the team email contains:** name, business, WhatsApp number, industry,
"start with", every ad parameter on the visit (`utm_*`, `gclid`, `gbraid`,
`wbraid`, `fbclid`) and a one-tap "Reply on WhatsApp" link. There is no
confirmation email to the visitor, because the form asks for a WhatsApp number,
not an email. The team replies on WhatsApp.

## Ads tracking

Put the IDs in `assets/js/config.js` (`GTM_ID`, `GA4_ID`, `META_PIXEL_ID`). `tags.js`
loads them in the `<head>` of both pages; there is nothing to paste.

- The conversion is `generate_lead`, pushed to `dataLayer` on `/get/thank-you`
  (plus `fbq('track','Lead')` when the Pixel is on). GA4 gets it through the
  GA4 Event tag in GTM, not from the page, so it is never counted twice.
- The Google tag (page views) is loaded by the page from `GA4_ID`. Do not add
  another Google tag for the same ID in GTM.
- It fires only for a visitor who has just submitted the form. A reload, a
  bookmark or a stray visit is not counted.
- Google Ads: either import the GA4 `generate_lead` event, or use a
  destination-URL conversion on `/get/thank-you`, counting **one per click**.
- Only the industry and "start with" choices are sent to analytics, never a
  name or number.
- Other events in `dataLayer`: `cta_click` (with `cta_location`),
  `form_start`, `whatsapp_click`.

## Share preview

`assets/brand/og-image.jpg` (1200x630) is the image shown when the link is shared on
WhatsApp, LinkedIn or Facebook. The `og:image` tags use the full URL on
`https://hirestella.ai/get`; if the address changes, update them in both pages.

## Local preview

`pnpm dev`, then open http://127.0.0.1:3000/get. Tests: `pnpm test`.

## Notes

- `noindex` on both pages (meta tag and `X-Robots-Tag` header), not in the sitemap, so the ad page never competes with hirestella.ai in search.
- Light mode by default; the toggle switches to dark and remembers the choice.
- All motion respects "reduce motion" and pauses off screen.
- The client-story figures keep their original label: projected six-month
  impact based on industry benchmarks, not measured results.
