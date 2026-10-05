/**
 * Analytics consent.
 *
 * `telemetry.ts` has always gated its dataLayer forwarding on
 * `document.documentElement.dataset.analyticsConsent`, and the same flag
 * decides whether GTM and the Meta Pixel load at all.
 *
 * 2026-10-05: there is no banner and no opt-out. Every visitor is granted on
 * arrival, including anyone who rejected under the earlier banner. This was
 * a deliberate site-owner decision, not an oversight — it means visitors in
 * jurisdictions that require an opt-in choice before non-essential tracking
 * (GDPR/PECR, UK GDPR, CCPA-style laws) are not asked.
 */

export type Consent = 'granted' | 'denied';

/** Runs in <head> before first paint, so telemetry is live from the very first request. */
export const consentBootstrap = `document.documentElement.dataset.analyticsConsent='granted'`;

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  /* The 404 page is streamed without the head bootstrap, so set it here too. */
  document.documentElement.dataset.analyticsConsent = 'granted';
  return 'granted';
}
