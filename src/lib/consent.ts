/**
 * Analytics consent.
 *
 * `telemetry.ts` has always gated its dataLayer forwarding on
 * `document.documentElement.dataset.analyticsConsent`, and the same flag
 * decides whether GTM and the Meta Pixel load at all.
 *
 * 2026-09-28: there is no banner and no opt-out. Every new visitor is granted
 * automatically on arrival; a visitor already recorded as 'denied' from
 * before this change stays denied rather than being silently overridden.
 * This was a deliberate site-owner decision, not an oversight — it means
 * visitors in jurisdictions that require an opt-in choice before
 * non-essential tracking (GDPR/PECR, UK GDPR, CCPA-style laws) are not asked.
 */

export const CONSENT_KEY = 'hirestella-consent';

export type Consent = 'granted' | 'denied';

/**
 * Runs in <head> before first paint, so telemetry is live from the very
 * first request. Mirrors the existing theme bootstrap.
 */
export const consentBootstrap = `try{var c=localStorage.getItem('${CONSENT_KEY}');if(c!=='granted'&&c!=='denied'){c='granted';localStorage.setItem('${CONSENT_KEY}',c)}document.documentElement.dataset.analyticsConsent=c}catch(e){}`;

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const root = document.documentElement;
  let value = root.dataset.analyticsConsent;
  /* The 404 page is streamed without the head bootstrap, so fall back to
     storage directly. */
  if (value !== 'granted' && value !== 'denied') {
    try { value = localStorage.getItem(CONSENT_KEY) ?? undefined; } catch { value = undefined; }
    if (value === 'granted' || value === 'denied') root.dataset.analyticsConsent = value;
  }
  return value === 'granted' || value === 'denied' ? value : null;
}
