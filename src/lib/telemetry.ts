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

/**
 * The lead conversion, raised once on `/thank-you`.
 *
 * `track()` namespaces everything it sends as `hirestella_*`, which is right
 * for behavioural signals and wrong for this one: GA4 has a reserved name for a
 * submitted lead, and an Ads conversion imported from a recommended event is
 * less fragile than one bound to a custom string. So this pushes
 * `generate_lead` unprefixed, and leaves the behavioural event alongside it for
 * the funnel view.
 *
 * `source` records which surface the lead came from — the modal, the book a
 * demo page, the contact page — so one conversion can still be segmented. No
 * name, email, company or message text is ever included.
 */
export function leadConversion(source: string) {
  track('lead_converted', { source });
  if (typeof window === 'undefined') return;
  if (document.documentElement.dataset.analyticsConsent !== 'granted') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'generate_lead', lead_source: source });
  /* The Meta Pixel `Lead` lives here and nowhere else, so it counts delivered
     requests only, never a click on an empty or invalid form. On a direct load
     of /thank-you this page's effect runs before the layout's <Analytics> has
     bootstrapped `fbq` (it waits on a consent re-render), so wait for it,
     briefly. With no Pixel configured `fbq` never appears and this gives up. */
  const lead = (tries: number) => {
    if (window.fbq) window.fbq('track', 'Lead', { content_name: source });
    else if (tries > 0) setTimeout(() => lead(tries - 1), 100);
  };
  lead(50);
}
