'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';
import { Logo } from './ui';
import { demoSchema, HEARD_FROM } from '@/lib/lead-schema';
import { track } from '@/lib/telemetry';

/**
 * The demo request modal.
 *
 * Opening it never leaves the page, so the visitor does not lose the context
 * that convinced them. §30.3 permits glass on modals; the form itself follows
 * the §8.4 rules on labels, focus and 44px targets.
 *
 * Any element with a `data-demo` attribute opens it, which keeps every entry
 * point in the site down to one behaviour.
 */
export function DemoModal({ configured }: { configured: boolean }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<'sent' | 'local' | null>(null);
  const [heard, setHeard] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [carried, setCarried] = useState(false);
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
      setDone(null);
      setError('');
      track('demo_modal_opened', { carried: Boolean(brief) });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
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
      setError(
        'Please check your name, a valid work email, your business name, and a description of at least 10 characters.',
      );
      return;
    }
    if (!configured) {
      setDone('local');
      setDraft({});
      setHeard('');
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
      setDone('sent');
      setDraft({});
      setHeard('');
      setCarried(false);
      track('demo_submitted', { delivered: true });
    } catch {
      setError('Your request could not be delivered. Please try again, or email sales@hirestella.ai.');
    } finally {
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
        aria-labelledby="dm-title"
        ref={dialog}
      >
        <button className="dm-x" type="button" aria-label="Close" onClick={close}>
          <X size={18} />
        </button>

        {/* ── left: why this conversation is worth having ── */}
        <aside className="dm-aside">
          <span className="dm-mark">
            <Logo symbol />
          </span>
          <p className="eyebrow eyebrow--sig">Book a demo</p>
          <h2 id="dm-title" className="dm-h">
            A workforce built
            <br />
            exclusively for you.
          </h2>
          <p className="sm">
            Bring one workflow. We map the specialists it needs, the systems it touches and the
            point your people take over.
          </p>

          <ol className="dm-steps">
            {[
              ['A person reads it', 'Not an autoresponder. Someone who understands your operation.'],
              ['We map your workflow', 'The specialists, the channels and the handoffs, specific to you.'],
              ['You see the boundary', 'Where your team stays in control, before anything is configured.'],
            ].map(([t, d]) => (
              <li key={t}>
                <b>{t}</b>
                <span>{d}</span>
              </li>
            ))}
          </ol>

          <p className="note dm-foot">
            <ShieldCheck size={14} strokeWidth={1.7} aria-hidden="true" />
            No obligation. Nothing is configured or committed before a scoping conversation.
          </p>
        </aside>

        {/* ── right: the form ── */}
        <div className="dm-form">
          <div className="dm-mini" aria-hidden="true">
            <span className="dm-mini-mark">
              <Logo symbol />
            </span>
            <span>
              <b>Book a demo</b>
              <em>A workforce built exclusively for you.</em>
            </span>
          </div>
          {done ? (
            <div className="dm-done">
              <span className="dm-tick" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12.5l5.5 5.5L20 7" />
                </svg>
              </span>
              <h3>{done === 'sent' ? 'Your request is with the team.' : 'Your brief is ready.'}</h3>
              <p className="sm">
                {done === 'sent'
                  ? 'Someone will read it and reply with the questions that matter. A demo is not confirmed until the team arranges it with you.'
                  : 'Delivery is not connected on this preview, so nothing was sent. Email sales@hirestella.ai and we will pick it up from there.'}
              </p>
              <button className="btn btn-2" type="button" onClick={close}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="consultation-form" ref={form}>
              <div className="form-grid">
                <label className="field">
                  <span>Your name</span>
                  <input ref={first} name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Full name" defaultValue={draft.name ?? ''} />
                </label>
                <label className="field">
                  <span>Work email</span>
                  <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" defaultValue={draft.email ?? ''} />
                </label>
              </div>

              <label className="field">
                <span>Business name</span>
                <input name="company" autoComplete="organization" required minLength={2} maxLength={160} placeholder="Your company or practice" defaultValue={draft.company ?? ''} />
              </label>

              <label className="field">
                <span>What is slowing your business down?</span>
                <textarea
                  name="problem"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  placeholder="Tell us about your team, your channels, and where work stops moving."
                  defaultValue={draft.problem ?? ''}
                />
                {carried && draft.problem ? (
                  <em className="dm-carried">Carried over from your brief to Stella. Edit it freely.</em>
                ) : null}
              </label>

              <div className="form-grid">
                <label className="field">
                  <span>How did you hear about us?</span>
                  <select name="heardFrom" value={heard} onChange={(e) => setHeard(e.target.value)}>
                    <option value="">Select an option</option>
                    {HEARD_FROM.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
                {heard === 'Referral' && (
                  <label className="field">
                    <span>
                      Who referred you? <em className="opt">Optional</em>
                    </span>
                    <input name="referral" maxLength={160} placeholder="Name or company" defaultValue={draft.referral ?? ''} />
                  </label>
                )}
              </div>

              <div className="form-honeypot" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <p className="form-note">
                <Lock size={13} strokeWidth={1.8} aria-hidden="true" /> We use these details only to
                respond to this request. Please do not include confidential customer data.
              </p>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="dm-submit">
                <label className="consent-label">
                  <input type="checkbox" name="consent" required />
                  <span>
                    {configured
                      ? 'I agree that HireStella may use these details to respond to this request.'
                      : 'I understand delivery is not connected on this preview.'}
                  </span>
                </label>
                <div className="dm-submit-row">
                  <button disabled={busy} className="btn btn-1" type="submit">
                    {busy ? 'Sending your request…' : 'Request my demo'}
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
