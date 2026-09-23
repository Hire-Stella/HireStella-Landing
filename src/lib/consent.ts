/**
 * Analytics consent.
 *
 * `telemetry.ts` has always gated its dataLayer forwarding on
 * `document.documentElement.dataset.analyticsConsent`, but nothing ever set
 * it. This is the layer that does, and the same flag now also decides whether
 * GTM and the Meta Pixel load at all.
 *
 * Three states: 'granted', 'denied', and undecided (the attribute absent),
 * which is what makes the banner appear.
 */

export const CONSENT_KEY = 'hirestella-consent';

export type Consent = 'granted' | 'denied';

/** Fired on the window whenever a visitor makes or changes a choice. */
export const CONSENT_EVENT = 'hirestella:consent';

/**
 * Runs in <head> before first paint, so a returning visitor never sees the
 * banner flash and telemetry is live from the first event. Mirrors the
 * existing theme bootstrap.
 */
export const consentBootstrap = `try{var c=localStorage.getItem('${CONSENT_KEY}');if(c==='granted'||c==='denied'){document.documentElement.dataset.analyticsConsent=c}}catch(e){}`;

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const value = document.documentElement.dataset.analyticsConsent;
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
