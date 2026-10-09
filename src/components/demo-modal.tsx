'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, X } from 'lucide-react';
import { demoSchema } from '@/lib/lead-schema';
import { BookingFields, BOOKING_ERROR } from './booking-fields';
import { track } from '@/lib/telemetry';
import { BOOKED } from './demo-nudge';

/**
 * The demo request modal.
 *
 * Opening it never leaves the page, so the visitor does not lose the context
 * that convinced them. §30.3 permits glass on modals; the form itself follows
 * the §8.4 rules on labels, focus and 44px targets.
 *
 * Any element with a `data-demo` attribute opens it, which keeps every entry
 * point in the site down to one behaviour.
 *
 * A *delivered* request is the one case that does leave the page: it lands on
 * /thank-you, where the lead conversion is raised. Measuring the conversion on
 * a destination URL is what Google Ads imports most reliably, and this modal is
 * the site's main booking path, so leaving it inline would have left most
 * conversions uncounted. The inline confirmation below is now only the
 * unconfigured preview, where nothing was sent.
 */
export function DemoModal({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  /* Only the unconfigured preview ends inside the modal. A delivered request
     leaves for /thank-you, so there is no longer a "sent" state to render. */
  const [done, setDone] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [, setCarried] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const first = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  /* Closing must never cost the visitor what they already typed. */
  const close = useCallback(() => {
    if (form.current) {
      const kept: Record<string, string> = {};
      for (const [k, v] of new FormData(form.current).entries())
        if (typeof v === 'string') kept[k] = v;
      setDraft(kept);
    }
    setOpen(false);
    setError('');
    opener.current?.focus();
  }, []);

  /* One delegated listener serves every [data-demo] trigger on the page. */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element)?.closest?.('[data-demo]');
      if (!el) return;
      e.preventDefault();
      const brief = (el as HTMLElement).dataset.demoProblem?.trim();
      opener.current = el as HTMLElement;
      if (brief) {
        setDraft((d) => (d.problem?.trim() ? d : { ...d, problem: brief }));
        setCarried(true);
      }
      setOpen(true);
      setDone(false);
      setError('');
      track('demo_modal_opened', { carried: Boolean(brief) });
    }
    /* The timed invitation (demo-nudge.tsx) opens the same dialog. */
    function onInvite() {
      opener.current = null;
      setOpen(true);
      setDone(false);
      setError('');
      track('demo_modal_opened', { carried: false, auto: true });
    }
    document.addEventListener('click', onClick);
    window.addEventListener('hirestella:open-demo', onInvite);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hirestella:open-demo', onInvite);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => first.current?.focus(), 120);
    function key(e: KeyboardEvent) {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab' || !dialog.current) return;
      /* Keep focus inside the dialog while it is open. */
      const items = dialog.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const list = Array.from(items);
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', key);
      clearTimeout(t);
    };
  }, [open, close]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const fields = new FormData(event.currentTarget);
    const parsed = demoSchema.safeParse({
      ...Object.fromEntries(fields.entries()),
      consent: fields.get('consent') === 'on',
    });
    if (!parsed.success) {
      setError(BOOKING_ERROR);
      return;
    }
    if (!configured) {
      setDone(true);
      setDraft({});
      setCarried(false);
      track('demo_submitted', { delivered: false });
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error('undelivered');
      try {
        sessionStorage.setItem(BOOKED, '1');
      } catch {}
      setDraft({});
      setCarried(false);
      track('demo_submitted', { delivered: true });
      /* Close before navigating: the open modal locks body scroll, and the
         confirmation page would otherwise arrive unscrollable. `busy` stays set
         so the button cannot be pressed again while the route resolves. */
      setOpen(false);
      router.push('/thank-you?src=modal');
    } catch {
      setError('Your request could not be delivered. Please try again, or email sales@hirestella.ai.');
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="dm-scrim" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        className="dm pan pan--solid"
        role="dialog"
        aria-modal="true"
        aria-label="Book a demo"
        ref={dialog}
      >
        <button className="dm-x" type="button" aria-label="Close" onClick={close}>
          <X size={18} />
        </button>

        {/* ── left: show the product, not a list of promises. The scene plays
             once each time the modal opens (it mounts on open). ── */}
        <aside className="dm-aside">
          <h2 className="dm-h">
            This is Stella
            <br />
            at 11:04 pm<span className="dm-dot">.</span>
          </h2>
          <p className="dm-lede">In your demo, she works on your business: your enquiries, your calendar, your customers.</p>

          <div className="dm-scene" aria-hidden="true">
            <div className="dm-scene-top">
              <i />
              <b>Your business</b>
              <span>WhatsApp</span>
            </div>
            <p className="dm-bub dm-bub--in">
              Hi, do you have any slots this Saturday?<time>11:04 pm</time>
            </p>
            <p className="dm-bub dm-bub--out">
              Yes, 11am or 2pm. Which suits you?<time>Stella, 11:04 pm</time>
            </p>
            <p className="dm-bub dm-bub--in">
              11am please<time>11:05 pm</time>
            </p>
            <p className="dm-booked">
              <Check size={14} strokeWidth={2.2} />
              Booked for Saturday, 11:00 am
            </p>
          </div>

          <p className="note dm-foot">
            <ShieldCheck size={14} strokeWidth={1.7} aria-hidden="true" />A person reads every request. No obligation.
          </p>
        </aside>

        {/* ── right: the form ── */}
        <div className="dm-form">
          <div className="dm-mini" aria-hidden="true">
            <span>
              <b>Book a demo</b>
              <em>See Stella work on your business.</em>
            </span>
          </div>
          {done ? (
            <div className="dm-done">
              <span className="dm-tick" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12.5l5.5 5.5L20 7" />
                </svg>
              </span>
              <h3>Your brief is ready.</h3>
              <p className="sm">
                Delivery is not connected on this preview, so nothing was sent. Email
                sales@hirestella.ai and we will pick it up from there.
              </p>
              <button className="btn btn-2" type="button" onClick={close}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="consultation-form" ref={form}>
              <BookingFields draft={draft} firstRef={first} />

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="dm-submit">
                <label className="consent-label">
                  <input type="checkbox" name="consent" required />
                  <span>
                    I agree that HireStella may contact me about this demo.
                  </span>
                </label>
                <div className="dm-submit-row">
                  <button disabled={busy} className="btn btn-1" type="submit">
                    {busy ? 'Sending your request…' : 'Book my demo'}
                    <span className="tri" aria-hidden="true" />
                  </button>
                  <span className="note">Takes under a minute.</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
