'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { onConsentChange, readConsent } from '@/lib/consent';

/**
 * Google Tag Manager and the Meta Pixel, both withheld until the visitor
 * grants consent.
 *
 * The tags are appended imperatively rather than rendered as JSX <script>
 * elements: React writes those through innerHTML after hydration, and the
 * browser will not execute a script inserted that way.
 *
 * No <noscript> fallbacks are rendered. They would fire a tracking request
 * for visitors who, without JavaScript, can never be shown the banner — which
 * is the one thing a consent-first setup must not do.
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/* Consent can be withdrawn and granted again in one page view; neither tag
   may be bootstrapped twice. */
let gtmLoaded = false;

function loadGtm(id: string) {
  if (gtmLoaded) return;
  gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

/* Meta's own bootstrap, inlined so it runs on consent rather than on load. */
function loadPixel(id: string) {
  if (window.fbq) return;
  const fbq: Fbq = function (...args: unknown[]) {
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue?.push(args);
  };
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = window._fbq || fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  fbq('init', id);
  fbq('track', 'PageView');
}

export function Analytics() {
  const pathname = usePathname();
  const [granted, setGranted] = useState(false);
  /* The path the Pixel has already counted, so bootstrapping and navigating
     cannot both report the same one. */
  const counted = useRef<string | null>(null);

  useEffect(() => {
    setGranted(readConsent() === 'granted');
    return onConsentChange((value) => setGranted(value === 'granted'));
  }, []);

  useEffect(() => {
    if (!granted) return;
    if (GTM_ID) loadGtm(GTM_ID);
    if (PIXEL_ID) {
      loadPixel(PIXEL_ID);
      /* loadPixel fires the first PageView itself. */
      counted.current ??= pathname;
    }
    // The current path is read, not tracked: navigation is the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granted]);

  /* The Pixel counts a PageView only on a full document load, so every
     client-side navigation after the first would otherwise go unrecorded.
     GTM needs nothing here — its History Change trigger sees pushState. */
  useEffect(() => {
    if (!granted || !PIXEL_ID) return;
    if (counted.current === pathname) return;
    counted.current = pathname;
    window.fbq?.('track', 'PageView');
  }, [pathname, granted]);

  return null;
}
