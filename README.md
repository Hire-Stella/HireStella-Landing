# HireStella website

A complete, responsive marketing website built from the supplied HireStella Master System V2 and brand book. Original logos are used without redrawing the wordmark. Fonts are served locally.

## Run locally

From `06-Website`:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:3000`. For a production preview:

```powershell
pnpm verify
pnpm start
```

Requires Node.js 20.9 or later. Development used Node.js 24 and pnpm 10.15.

## What is implemented

- Premium, responsive homepage with an interactive Stella prompt, eight-specialist map, industry switcher, connected journey, human boundary, calculator, dashboard, and footer.
- 27 page routes: homepage, product and company pages, eight specialist pages, four industry pages, capacity calculator, dashboard demonstration, and consultation/contact flows.
- Original logo assets, brand colours, Poppins display typography, Montserrat UI, shared tokens, reduced-motion alternatives, keyboard focus states, and mobile navigation.
- Public pricing page, navigation link, and homepage pricing section are removed. The original commercial data remains in the calculator logic.
- A capacity calculator with exposed formulas, user-entered fees, adjustable assumptions, voice overage, and potential recovered gross contribution.
- Consistent dental demonstration data across the journey and dashboard. No fabricated customer proof or security certifications.
- Consultation context carryover, validated form fields, local brief download, and a server-only HTTPS webhook adapter.
- Metadata, actual 404 handling, conditional sitemap/robots, and server-rendered explanatory content.

## Live service boundaries

The Stella preview uses **local, explicitly labelled scenario rules**, not a live language model. It does not manufacture a plan recommendation without capacity and integration requirements. Replace `workforcePreview` through a validated server endpoint when a provider and production scope are chosen. Never expose provider secrets to the browser.

The dashboard is **illustrative**, not a production management application. `/login` explains this and links to the demo; it does not collect passwords. The floating conversation control links to the workforce preview or consultation flow, and does not pretend to place live calls.

Without `LEAD_WEBHOOK_URL`, the consultation form prepares a downloadable brief locally. It clearly states that nothing was sent or booked. No personal information is written to a local database or browser storage. Values carried in a consultation link are query parameters; visitors are told not to enter confidential customer data.

To enable request delivery, copy `.env.example` to `.env.local`, set an approved **HTTPS** `LEAD_WEBHOOK_URL`, optionally set `LEAD_WEBHOOK_TOKEN`, then rebuild. The server validates payloads, checks the request origin, limits body size, rejects the honeypot, and times out outbound delivery. Configure production abuse protection/rate limiting at your hosting or gateway layer before publicly enabling submissions. A successful delivery acknowledges a request, not a confirmed appointment.

Set `NEXT_PUBLIC_SITE_URL` to the production origin before launch, then rebuild. Until it is set, robots disallows indexing and the sitemap is empty. Confirm legal identity, applicable privacy wording, production workspace URL, and supported integration/security claims before publishing. Team pages currently describe the working approach rather than inventing biographies.

## Where to make changes

| File                                   | Purpose                                                    |
| -------------------------------------- | ---------------------------------------------------------- |
| `src/app/page.tsx`                     | Homepage narrative                                         |
| `src/app/globals.css`                  | Brand tokens, shared UI, homepage, responsive layouts      |
| `src/styles/interior.css`              | Supporting page layouts                                    |
| `src/lib/data.ts`                      | Specialists, industries, **canonical pricing**, navigation |
| `src/lib/logic.ts`                     | Preview scenarios and calculator formulas                  |
| `src/lib/pages.ts`                     | Product, trust, and company page copy                      |
| `src/components/experience.tsx`        | Interactive network, journey, industry tabs, dashboard     |
| `src/components/commercial.tsx`        | Pricing and capacity calculator                            |
| `src/components/consultation-form.tsx` | Brief preparation and request UI                           |
| `src/app/api/leads/route.ts`           | Secure server-side consultation adapter                    |

The source document and brand book remain in their original project folders and are not modified by the app.

## Verification

```powershell
pnpm verify
pnpm test
# With the production preview running on port 3000 and Chrome installed:
pnpm test:browser
# Theme, hero preview, and narrow-screen regression checks:
node scripts/refinement-check.mjs
```

The logic tests cover commercial facts, calculator boundaries, overage, negative outcomes, scenario matching, and consent validation. Browser tests check all routes at desktop/mobile sizes, key interactive flows, accurate prices, consultation downloads, accessibility with axe, reduced motion, and runtime errors. Reports and screenshots are saved in `test-results/` (ignored).

Browser tests are written for the default, unconfigured consultation delivery mode. They never send test requests to an external service.

The interior-page previews support manual stages, pause/replay, and reduced motion. The header theme control follows the system preference until the visitor chooses a theme, then saves that choice locally. The dismissible demo invitation remembers dismissal for the browser session. Theme and preview styles live in `src/styles/refinement.css`; the additional check writes `test-results/refinement-report.json` and preview screenshots.

Implementation follows the specified App Router architecture and the [official Next.js installation guidance](https://nextjs.org/docs/app/getting-started/installation).
