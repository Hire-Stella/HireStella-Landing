'use client';

import { useEffect, useRef, useState } from 'react';
import { leadConversion, track } from '@/lib/telemetry';
import { BOOKED } from './demo-nudge';

/**
 * The Cal.com calendar for booking a demo, inline (the demo modal uses it).
 *
 * Cal.com takes the booking, sends the confirmation emails and creates the
 * Google Meet link; its webhook then adds the booking to the bookings sheet
 * (lib/cal-webhook.js). `metadata[source]` tells that row where it was booked.
 *
 * A confirmed booking is a lead like a submitted form: the conversion fires
 * here, once per booking, because the visitor stays on the page.
 */
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK || 'it-team-vvnltu/hirestella-demo';
const EMBED = 'https://app.cal.com/embed/embed.js';
const NS = 'site';

type CalApi = ((...args: unknown[]) => void) & { ns: Record<string, (...args: unknown[]) => void>; loaded?: boolean; q?: unknown[] };
declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/* Cal.com's loader: queues commands until embed.js arrives. */
function loadCal(): CalApi {
  if (!window.Cal) {
    (function (C: Window, A: string, L: string) {
      const p = (a: { q: unknown[] }, ar: unknown) => a.q.push(ar);
      const d = C.document;
      C.Cal =
        C.Cal ||
        (function (this: unknown, ...ar: unknown[]) {
          const cal = C.Cal as CalApi;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const s = d.createElement('script');
            s.src = A;
            d.head.appendChild(s);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = Object.assign((...args: unknown[]) => p(api, args), { q: [] as unknown[] });
            const namespace = ar[1];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace] as unknown as { q: unknown[] }, ar);
              p(cal as unknown as { q: unknown[] }, ['initNamespace', namespace]);
            } else p(cal as unknown as { q: unknown[] }, ar);
            return;
          }
          p(cal as unknown as { q: unknown[] }, ar);
        } as unknown as CalApi);
    })(window, EMBED, 'init');
  }
  return window.Cal as CalApi;
}

/* Listeners are registered once per page load, however often the modal opens. */
let listening = false;
const booked = new Set<string>();

export function CalBooking({ source }: { source: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    if (!host.current) return;
    const Cal = loadCal();
    /* `Cal.ns` only exists after the loader's first call, so check it with `?.`. */
    if (!Cal.ns?.[NS]) Cal('init', NS, { origin: 'https://app.cal.com' });
    const cal = Cal.ns[NS];
    if (!listening) {
      listening = true;
      cal('ui', {
        cssVarsPerTheme: { light: { 'cal-brand': '#FF6200' }, dark: { 'cal-brand': '#FF6200' } },
        hideEventTypeDetails: true,
        layout: 'month_view',
      });
      cal('on', {
        action: 'bookingSuccessfulV2',
        callback: (e: CustomEvent<{ data?: { uid?: string } }>) => {
          const uid = e.detail?.data?.uid || 'booked';
          if (booked.has(uid)) return;
          booked.add(uid);
          try {
            sessionStorage.setItem(BOOKED, '1');
          } catch {}
          track('demo_booked', { provider: 'calcom' });
          leadConversion('calcom');
        },
      });
    }
    cal('on', { action: 'linkReady', callback: () => setState('ready') });
    cal('on', { action: 'linkFailed', callback: () => setState('failed') });
    const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    cal('inline', {
      elementOrSelector: host.current,
      calLink: CAL_LINK,
      config: { layout: 'month_view', theme, 'metadata[source]': source },
    });
    const timer = setTimeout(() => setState((s) => (s === 'loading' ? 'failed' : s)), 20000);
    return () => clearTimeout(timer);
  }, [source]);

  return (
    <div className="cal-booking">
      {state === 'loading' && (
        <p className="cal-status" role="status">
          Loading available dates and times…
        </p>
      )}
      {state === 'failed' && (
        <p className="cal-status" role="alert">
          The calendar could not load here.{' '}
          <a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noopener noreferrer">
            Open it in a new tab
          </a>
          , or request a callback instead.
        </p>
      )}
      <div ref={host} className="cal-frame" />
    </div>
  );
}
