# HireStella · Ads landing page

A standalone, single-page landing page for paid ads (Google Ads, Meta), with a
thank-you page and email lead delivery. It is **separate from the website** in
`06-Website` and shares no code with it; it only uses the same brand system
(colours, Poppins/Montserrat, panels, Stella symbol, Stella Star, Signal Triangle).

Copy is taken unchanged from `hirestella-landing-page.html` (the original
draft, kept here for reference and excluded from deploys by `.vercelignore`).

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The landing page |
| `thank-you.html` | Where a delivered lead lands; fires the conversion |
| `assets/js/config.js` | **The settings you edit** (WhatsApp, privacy URL…) |
| `assets/js/tags.js` | Loads Google Tag Manager and the Meta Pixel from the IDs in config.js |
| `assets/js/landing.js` | Animations, form, validation |
| `assets/css/landing.css` | All styles, dark and light themes |
| `api/lead.js` | Server function: emails each lead to the team via Resend |
| `tests/lead.test.js` | Tests for the email function (`npm test`) |
| `robots.txt` | Lets Google Ads and Meta crawl the pages, which stay `noindex` |
| `vercel.json` | Clean URLs, security and cache headers |

## Settings (`assets/js/config.js`)

- `WHATSAPP_NUMBER`: digits only with country code, e.g. `971501234567`.
  Empty = every WhatsApp button is hidden.
- `PRIVACY_URL`: full URL of the privacy policy. Empty = privacy links hidden.
- `FORM_ENDPOINT`: leave as `/api/lead`.
- `THANK_YOU_URL`: leave as `thank-you.html`.
- `GTM_ID`: Google Tag Manager container ID, e.g. `GTM-ABC1234`. Empty = no GTM.
- `GA4_ID`: GA4 measurement ID (set to `G-DVWYC93VD9`). Loads the Google tag for page views.
- `META_PIXEL_ID`: Meta Pixel ID, digits only. Empty = no Pixel.

## Deploy (its own Vercel project)

1. Import the repository in Vercel as a new project with **Root Directory**
   `ads-landing`. Framework preset: **Other**. No build command. Output: the folder root.
2. Add the environment variables (Settings → Environment Variables), the same
   Resend setup as the website:
   - `RESEND_API_KEY`
   - `LEAD_EMAIL_TO`: who receives leads, comma-separated
   - `LEAD_EMAIL_FROM`: e.g. `HireStella <leads@hirestella.ai>`, on a domain
     verified in Resend
   - optional `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_TOKEN` for a CRM or sheet
3. Redeploy, then submit one real test lead and confirm the email arrives.
4. Add the domain `get.hirestella.ai` (Settings → Domains) and create the
   record Vercel shows at the DNS host. The share image and `og:url` already
   point there.

Until `RESEND_API_KEY`/`LEAD_EMAIL_*` (or a webhook) are set, `/api/lead`
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

- The conversion is `generate_lead`, pushed to `dataLayer` on `/thank-you`
  (plus `fbq('track','Lead')` when the Pixel is on). GA4 gets it through the
  GA4 Event tag in GTM, not from the page, so it is never counted twice.
- The Google tag (page views) is loaded by the page from `GA4_ID`. Do not add
  another Google tag for the same ID in GTM.
- It fires only for a visitor who has just submitted the form. A reload, a
  bookmark or a stray visit is not counted.
- Google Ads: either import the GA4 `generate_lead` event, or use a
  destination-URL conversion on `/thank-you`, counting **one per click**.
- Only the industry and "start with" choices are sent to analytics, never a
  name or number.
- Other events in `dataLayer`: `cta_click` (with `cta_location`),
  `form_start`, `whatsapp_click`.

## Share preview

`assets/brand/og-image.jpg` (1200x630) is the image shown when the link is shared on
WhatsApp, LinkedIn or Facebook. The `og:image` tags use the full URL on
`https://get.hirestella.ai`; if the domain changes, update them in both pages.

## Local preview

Any static server shows the page; the form needs `/api/lead`, which runs on
Vercel (`vercel dev` runs both locally). Tests: `npm test` (Node 24).

## Notes

- `noindex` on both pages, so the ad page never competes with hirestella.ai in search.
- Light mode by default; the toggle switches to dark and remembers the choice.
- All motion respects "reduce motion" and pauses off screen.
- The client-story figures keep their original label: projected six-month
  impact based on industry benchmarks, not measured results.
