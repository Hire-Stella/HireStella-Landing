# Ads landing booking link

## 2026-10-20: client change
The client asked for no scroll bar on the booking popup or on Calendly's confirmation screen, and for the Calendly button to go to the Calendly website. "Choose your time" now opens https://calendly.com/hirestella-marketing-nqfz/30min in a new tab. The in-page dialog, its lazy widget loader and the Calendly CSP origins have been removed, so neither popup or scroll bar is left. /get stays open behind the new tab. This reverses the 2026-10-14 same-page decision at the client's request.

## Brief and direction (2026-10-14, still applies)
Give ad visitors a direct 30-minute booking option. Keep the callback form for visitors who prefer contact from the team. A small calendar tile introduces the meeting duration, the brand-orange action opens Calendly, and the callback action is secondary.

## Verification
Against a running local server: `node scripts/check-booking-popup.cjs` (`TEST_ORIGIN` overrides http://127.0.0.1:3200). Calendly and the callback API are mocked. It checks that there is no dialog, that the link has target _blank and rel noopener, that header CTA focus lands on it, that the new tab opens Calendly while /get stays open, that `booking_link_clicked` fires with no false `generate_lead`, the 1440/390/320 layouts in both themes, callback validation and the mocked callback submission. Screenshots go to the ignored `test-results/booking`.

Booking clicks are intent events only. A confirmed Calendly appointment is not wired to an ad conversion. No real appointment or callback was submitted during review.
