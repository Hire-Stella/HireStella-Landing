'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { partnerSchema, PARTNER_TYPES, PARTNER_MARKETS, CLIENT_BANDS } from '@/lib/lead-schema';
import { industryGroups } from '@/lib/industry-content';
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
        'Please choose a partner type and check your name, a valid work email, your company, your country, and at least 10 characters on why you want to partner.',
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

  return (
    <form onSubmit={submit} className="consultation-form">
      <fieldset className="ptype">
        <legend className="field-legend">What kind of partner are you?</legend>
        <div className="ptype-grid">
          {PARTNER_TYPES.map((t, i) => (
            <label className="ptype-opt" key={t}>
              <input type="radio" name="partnerType" value={t} defaultChecked={i === 0} required />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-grid">
        <label className="field">
          <span>Your name</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Full name" />
        </label>
        <label className="field">
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" />
        </label>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Company or practice</span>
          <input name="company" autoComplete="organization" required minLength={2} maxLength={160} placeholder="Company name" />
        </label>
        <label className="field">
          <span>Where you operate</span>
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

      <div className="form-grid">
        <label className="field">
          <span>
            Website <em className="opt">Optional</em>
          </span>
          <input name="site" maxLength={200} placeholder="yourcompany.com" />
        </label>
        <label className="field">
          <span>
            How many clients you work with <em className="opt">Optional</em>
          </span>
          <select name="clients" defaultValue="">
            <option value="">Prefer not to say</option>
            {CLIENT_BANDS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="ptype">
        <legend className="field-legend">
          Which sectors do your clients sit in? <em className="opt">Optional</em>
        </legend>
        <div className="ptype-grid">
          {industryGroups.map((g) => (
            <label className="ptype-opt" key={g.id}>
              <input type="checkbox" name="sectors" value={g.name} />
              <span>{g.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>What would you bring, and who would you introduce us to?</span>
        <textarea
          name="why"
          required
          minLength={10}
          maxLength={2000}
          placeholder="The clients you already advise, and what you would want from the partnership."
        />
      </label>

      <div className="form-honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className="form-note">
        <Lock size={13} strokeWidth={1.8} aria-hidden="true" /> We use these details only to assess
        and respond to your application. Please do not include confidential client data.
      </p>

      <label className="consent-label">
        <input type="checkbox" name="consent" required />
        <span>
          {configured
            ? 'I agree that HireStella may use these details to respond to this application.'
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
