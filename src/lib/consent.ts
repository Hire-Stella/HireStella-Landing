/**
 * Analytics consent.
 *
 * `telemetry.ts` has always gated its dataLayer forwarding on
 * `document.documentElement.dataset.analyticsConsent`, and the same flag
 * decides whether GTM and the Meta Pixel load at all.
 *
 * Three states: 'granted', 'denied', and undecided (the attribute absent),
 * which is what makes the banner appear.
 *
 * 2026-10-01: the banner is back, for every visitor worldwide. Between
 * 2026-09-28 and now the site granted consent automatically and wrote
 * 'granted' under the old key, so that stored value records no real choice.
 * The key is versioned to ask everyone again; an old 'denied' was a real
 * choice and is still honoured.
 */

export const CONSENT_KEY = 'hirestella-consent-v2';
const LEGACY_KEY = 'hirestella-consent';

export type Consent = 'granted' | 'denied';

/** Fired on the window whenever a visitor makes or changes a choice. */
export const CONSENT_EVENT = 'hirestella:consent';

/** Fired by the footer's "Cookie settings" link to reopen the banner. */
export const CONSENT_OPEN_EVENT = 'hirestella:consent-open';

/**
 * Runs in <head> before first paint, so a returning visitor never sees the
 * banner flash and telemetry is live from the first event. Mirrors the
 * existing theme bootstrap.
 */
export const consentBootstrap = `try{var c=localStorage.getItem('${CONSENT_KEY}');if(c!=='granted'&&c!=='denied'&&localStorage.getItem('${LEGACY_KEY}')==='denied')c='denied';if(c==='granted'||c==='denied'){document.documentElement.dataset.analyticsConsent=c}}catch(e){}`;

function stored(): string | undefined {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === 'granted' || value === 'denied') return value;
    return localStorage.getItem(LEGACY_KEY) === 'denied' ? 'denied' : undefined;
  } catch {
    return undefined;
  }
}

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const root = document.documentElement;
  let value = root.dataset.analyticsConsent;
  /* The 404 page is streamed without the head bootstrap, so fall back to
     storage; otherwise a visitor who already chose saw the banner again. */
  if (value !== 'granted' && value !== 'denied') {
    value = stored();
    if (value === 'granted' || value === 'denied') root.dataset.analyticsConsent = value;
  }
  return value === 'granted' || value === 'denied' ? value : null;
}

export function setConsent(value: Consent) {
  document.documentElement.dataset.analyticsConsent = value;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* Private browsing: the choice holds for this page view only. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function onConsentChange(callback: (value: Consent | null) => void) {
  const handler = () => callback(readConsent());
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

/** Reopens the banner so a visitor can change an earlier choice. */
export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
