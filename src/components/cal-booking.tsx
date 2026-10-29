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

/* Cal.com themed with the site's palette (system.css / globals.css), so the
   calendar reads as part of the modal: navy surfaces, mist text, orange actions. */
export const CAL_THEME = {
  dark: {
    'cal-brand': '#FF6200',
    'cal-brand-emphasis': '#E65800',
    'cal-brand-text': '#FFFFFF',
    'cal-bg': '#131A3E',
    'cal-bg-muted': '#131A3E',
    'cal-bg-subtle': '#18204B',
    'cal-bg-emphasis': '#1E2761',
    'cal-border': '#2B3366',
    'cal-border-subtle': '#232B5A',
    'cal-border-booker': '#232B5A',
    'cal-text': '#F5F5F9',
    'cal-text-emphasis': '#FFFFFF',
    'cal-text-subtle': '#B2B5CC',
    'cal-text-muted': '#989DB8',
  },
  light: {
    'cal-brand': '#FF6200',
    'cal-brand-emphasis': '#E65800',
    'cal-brand-text': '#FFFFFF',
    'cal-bg': '#FFFFFF',
    'cal-bg-muted': '#F8F9FD',
    'cal-bg-subtle': '#F5F5F9',
    'cal-bg-emphasis': '#ECEEF8',
    'cal-border': '#D9DBEA',
    'cal-border-subtle': '#E8E9F2',
    'cal-border-booker': '#E2E4F0',
    'cal-text': '#141B45',
    'cal-text-emphasis': '#111827',
    'cal-text-subtle': '#5B6080',
    'cal-text-muted': '#7A7F9C',
  },
};

/* Listeners are registered once per page load, however often the modal opens;
   the open calendar subscribes through `showBooked`. */
let listening = false;
const booked = new Set<string>();
let showBooked: ((startTime?: string) => void) | null = null;

/* "Friday 30 October, 1:30 pm", in the visitor's own time zone. */
function when(startTime?: string) {
  const date = startTime ? new Date(startTime) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' });
}

export function CalBooking({ source }: { source: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed' | 'booked'>('loading');
  const [bookedAt, setBookedAt] = useState('');

  useEffect(() => {
    /* Cal.com's own confirmation screen carries its advert; ours replaces it. */
    showBooked = (startTime) => {
      setBookedAt(when(startTime));
      setState('booked');
    };
    return () => {
      showBooked = null;
    };
  }, []);

  useEffect(() => {
    if (!host.current) return;
    const Cal = loadCal();
    /* `Cal.ns` only exists after the loader's first call, so check it with `?.`. */
    if (!Cal.ns?.[NS]) Cal('init', NS, { origin: 'https://app.cal.com' });
    const cal = Cal.ns[NS];
    if (!listening) {
      listening = true;
      cal('ui', { cssVarsPerTheme: CAL_THEME, hideEventTypeDetails: true, layout: 'month_view' });
      cal('on', {
        action: 'bookingSuccessfulV2',
        callback: (e: CustomEvent<{ data?: { uid?: string; startTime?: string } }>) => {
          const uid = e.detail?.data?.uid || 'booked';
          showBooked?.(e.detail?.data?.startTime);
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
    cal('on', { action: 'linkReady', callback: () => setState((s) => (s === 'booked' ? s : 'ready')) });
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
      {state === 'booked' && (
        <div className="cal-done" role="status">
          <span className="cal-done-tick" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5l5.5 5.5L20 7" />
            </svg>
          </span>
          <h3>Your demo is booked.</h3>
          {bookedAt && <p className="cal-done-when">{bookedAt}</p>}
          <p>
            Your Google Meet link and calendar invite are on their way to your inbox. Need a different
            time? Use the reschedule link in that email.
          </p>
        </div>
      )}
      {/* Kept mounted (hidden) after booking, so Cal.com can finish its own work. */}
      <div ref={host} className="cal-frame" hidden={state === 'booked'} />
    </div>
  );
}
