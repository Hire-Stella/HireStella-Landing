# Ads landing booking popup, 2026-10-14

## Brief and direction
Give ad visitors a direct 30-minute booking option without leaving /get. Keep the callback form for visitors who prefer contact from the team. This is a focused addition to the existing approved design.

A small calendar tile introduces the meeting duration, the brand-orange action opens a native dialog, and the callback action is secondary. The dialog uses a branded heading and backdrop around Calendly's real date/time selector. Native dialog behavior keeps background controls inert and returns focus on close. The supplied URL's transient month/back parameters are omitted.

## Critical review and refinements
Three weakest aspects of the first version:
1. Two equally prominent orange actions competed. Callback now uses a secondary outline treatment.
2. The first link left the page. Replaced with a same-page dialog, close button, backdrop dismissal, Escape handling and scroll restoration.
3. External loading introduced failure and reopening races. Added lazy loading, a 15-second script timeout, retry state and a guard against duplicate embeds.

Further checks corrected inherited SVG success colors, aligned demo anchors to the booking option, added the explicit Calendly script/style/frame CSP origins, and reduced event details so mobile visitors reach the date picker quickly.

## Section 14 quality gate
- Objective, audience, message and rationale: pass; direct scheduling for prospective business customers.
- Hierarchy, typography, layout, spacing, alignment and copy: reviewed at 1440, 390 and 320 pixels in both themes.
- Brand: existing logos, fonts and button treatment retained; no pricing introduced.
- Readability: new invitation and dialog text reviewed in both themes. Existing approved orange retained. Embedded scheduler uses Calendly's own light interface with the supplied orange accent.
- CTA, focus, close controls, mobile safe area and dimensions: pass.
- Imagery/resolution/color/bleed: no new raster or print artifacts; vector calendar icon and browser-rendered UI.
- Critical review and editable delivery: HTML, CSS and JS retained; focused regression check included.

## Verification
Run against a running local server:
- `node scripts/check-booking-popup.cjs` (mocked provider and callback).
- `LIVE_CALENDLY=1 node scripts/check-booking-popup.cjs` (real available date and time selection, no booking submitted).
- `TEST_ORIGIN` changes the default http://127.0.0.1:3200 origin.

Checks cover lazy loading, rapid close/reopen, a single iframe/tab, close/Escape/backdrop, focus restoration, body scroll restoration, 1440/390/320 layouts in both themes, click tracking without a false conversion, callback validation, mocked callback submission and script-load retry. Screenshots go to ignored `test-results/booking`.

Calendly embed reference: https://developer.calendly.com/docs/api-guides/how-to-display-the-scheduling-page-for-users-of-your-app

Booking clicks remain intent events only. A confirmed Calendly appointment is not yet wired to an ad conversion. Calendly owns calendar availability, cookie notice and the final booking flow. No real appointment or callback was submitted during review.

## PR scope
Prepared from client/main (291bb5d). Existing PR #19 background changes and the unrelated local motion-live.css edit are excluded. The local working preview at port 3200 still includes PR #19's background; the PR itself applies independently to main.

Final results: pnpm verify passed (TypeScript and production build); pnpm test passed 18/18. The focused browser check also passed against the production build on port 3212 with the real Calendly date/time selector and mocked callback delivery. Local build emitted the existing metadataBase warning because production environment settings were not copied into this isolated worktree.
