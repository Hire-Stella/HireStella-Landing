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
| `assets/js/landing.js` | Animations, form, validation |
| `assets/css/landing.css` | All styles, dark and light themes |
| `api/lead.js` | Server function: emails each lead to the team via Resend |
| `tests/lead.test.js` | Tests for the email function (`npm test`) |
| `vercel.json` | Clean URLs, security and cache headers |

## Settings (`assets/js/config.js`)

- `WHATSAPP_NUMBER`: digits only with country code, e.g. `971501234567`.
  Empty = every WhatsApp button is hidden.
- `PRIVACY_URL`: full URL of the privacy policy. Empty = privacy links hidden.
- `FORM_ENDPOINT`: leave as `/api/lead`.
- `THANK_YOU_URL`: leave as `thank-you.html`.

## Deploy (its own Vercel project)

1. Put this folder in its own Git repository and import it in Vercel as a new
   project. Framework preset: **Other**. No build command. Output: the folder root.
2. Add the environment variables (Settings → Environment Variables), the same
   Resend setup as the website:
   - `RESEND_API_KEY`
   - `LEAD_EMAIL_TO`: who receives leads, comma-separated
   - `LEAD_EMAIL_FROM`: e.g. `HireStella <leads@hirestella.ai>`, on a domain
     verified in Resend
   - optional `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_TOKEN` for a CRM or sheet
3. Redeploy, then submit one real test lead and confirm the email arrives.
4. Optional: point a subdomain at it, e.g. `get.hirestella.ai`.

Until `RESEND_API_KEY`/`LEAD_EMAIL_*` (or a webhook) are set, `/api/lead`
answers 503 and the form shows an error, unless `WHATSAPP_NUMBER` is set, in
which case the lead is handed over by WhatsApp instead so it is never lost.

**What the team email contains:** name, business, WhatsApp number, industry,
"start with", every ad parameter on the visit (`utm_*`, `gclid`, `gbraid`,
`wbraid`, `fbclid`) and a one-tap "Reply on WhatsApp" link. There is no
confirmation email to the visitor, because the form asks for a WhatsApp number,
not an email. The team replies on WhatsApp.

## Ads tracking

Paste the Google Tag Manager (or gtag) and Meta Pixel snippets where the
comment says so in the `<head>` of **both** `index.html` and `thank-you.html`.

- The conversion is `generate_lead`, pushed to `dataLayer` on `/thank-you`
  (plus `gtag('event','generate_lead')` and `fbq('track','Lead')` when present).
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
WhatsApp, LinkedIn or Facebook. Once the domain is live, change the `og:image`
meta tag in `index.html` to the full URL, e.g. `https://get.hirestella.ai/assets/brand/og-image.jpg`;
some platforms ignore relative paths.

## Local preview

Any static server shows the page; the form needs `/api/lead`, which runs on
Vercel (`vercel dev` runs both locally). Tests: `npm test` (Node 24).

## Notes

- `noindex` on both pages, so the ad page never competes with hirestella.ai in search.
- Light mode by default; the toggle switches to dark and remembers the choice.
- All motion respects "reduce motion" and pauses off screen.
- The client-story figures keep their original label: projected six-month
  impact based on industry benchmarks, not measured results.
