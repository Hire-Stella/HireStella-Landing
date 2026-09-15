type EventDetails = Record<string, string | number | boolean>;
declare global {
  interface Window { dataLayer?: Record<string, unknown>[]; }
}

/** Event adapter for an approved analytics integration. No third-party request is made here. */
export function track(name: string, details: EventDetails = {}) {
  if (typeof window === 'undefined') return;
  const event = { event: `hirestella_${name}`, page_path: window.location.pathname, ...details };
  window.dispatchEvent(new CustomEvent('hirestella:analytics', { detail: event }));
  // Forward only when a deployment's consent layer explicitly grants analytics.
  if (document.documentElement.dataset.analyticsConsent === 'granted') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
}
