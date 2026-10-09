'use client';

import { useState } from 'react';
import { partnerSchema, PARTNER_TYPES, PARTNER_MARKETS } from '@/lib/lead-schema';
import { track } from '@/lib/telemetry';

export function PartnerForm({ configured }: { configured: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<'sent' | 'local' | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const fields = new FormData(event.currentTarget);
    const parsed = partnerSchema.safeParse({
      ...Object.fromEntries(fields.entries()),
      sectors: fields.getAll('sectors').join(', '),
      kind: 'partner',
      consent: fields.get('consent') === 'on',
    });
    if (!parsed.success) {
      setError(
        'Please add your name, a valid work email, your company, where you operate, your partner type, and a line about who you would introduce.',
      );
      return;
    }
    if (!configured) {
      setDone('local');
      track('partner_submitted', { delivered: false });
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
      track('partner_submitted', { delivered: true });
    } catch {
      setError(
        'Your application could not be delivered. Please try again, or email sales@hirestella.ai.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <div className="dm-done" role="status">
        <span className="dm-tick" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5l5.5 5.5L20 7" />
          </svg>
        </span>
        <h3>{done === 'sent' ? 'Your application is with the team.' : 'Your application is ready.'}</h3>
        <p className="sm">
          {done === 'sent'
            ? 'We review every application and reply with the next step. Nothing is agreed until we have spoken.'
            : 'Delivery is not connected on this preview, so nothing was sent. Email sales@hirestella.ai and we will pick it up from there.'}
        </p>
      </div>
    );

  /* Client review, 2026-10-09: the partner page should read like /contact, so
     the form asks only what a first reply needs. Website, client count and
     sectors are optional in the schema and come up in the conversation. */
  return (
    <form onSubmit={submit} className="consultation-form">
      <div className="form-grid">
        <label className="field">
          <span>
            Your name <b className="req" aria-hidden="true">*</b>
          </span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Full name" />
        </label>
        <label className="field">
          <span>
            Work email <b className="req" aria-hidden="true">*</b>
          </span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" />
        </label>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>
            Company or practice <b className="req" aria-hidden="true">*</b>
          </span>
          <input name="company" autoComplete="organization" required minLength={2} maxLength={160} placeholder="Company name" />
        </label>
        <label className="field">
          <span>
            Where you operate <b className="req" aria-hidden="true">*</b>
          </span>
          <select name="country" defaultValue="" required>
            <option value="" disabled>
              Choose a market
            </option>
            {PARTNER_MARKETS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>
          What kind of partner are you? <b className="req" aria-hidden="true">*</b>
        </span>
        <select name="partnerType" defaultValue="" required>
          <option value="" disabled>
            Select an option
          </option>
          {PARTNER_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>
          Who would you introduce us to? <b className="req" aria-hidden="true">*</b>
        </span>
        <textarea
          name="why"
          required
          minLength={10}
          maxLength={2000}
          rows={3}
          placeholder="The kind of businesses you advise, and what you want from the partnership."
        />
      </label>

      <div className="form-honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="consent-label">
        <input type="checkbox" name="consent" required />
        <span>
          {configured
            ? 'I agree that HireStella may contact me about this application.'
            : 'I understand delivery is not connected on this preview.'}
        </span>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button disabled={busy} className="btn btn-1" type="submit">
        {busy ? 'Sending your application…' : 'Apply to partner'}
        <span className="tri" aria-hidden="true" />
      </button>
    </form>
  );
}
