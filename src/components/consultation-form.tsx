'use client';

import { useState } from 'react';
import { ArrowUpRight, Download, RotateCcw } from 'lucide-react';
import { Icon } from './ui';
import { leadSchema } from '@/lib/lead-schema';

export function ConsultationForm({
  configured,
  initialProblem = '',
  compact = false,
  id = 'consultation',
}: {
  configured: boolean;
  initialProblem?: string;
  compact?: boolean;
  id?: string;
}) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [brief, setBrief] = useState('');
  const [sent, setSent] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const fields = new FormData(event.currentTarget);
    const parsed = leadSchema.safeParse({
      ...Object.fromEntries(fields.entries()),
      consent: fields.get('consent') === 'on',
    });
    if (!parsed.success) {
      setError(
        'Please check your details, describe your business in at least 10 characters, and confirm the checkbox.',
      );
      return;
    }
    const data = parsed.data;
    const prepared = `HireStella consultation brief\n\nName: ${data.name}\nEmail: ${data.email}\nBusiness: ${data.company}\n\nBusiness challenge\n${data.problem}\n\nThis brief is a starting point for scoping. No booking or deployment is confirmed.`;
    if (!configured) {
      setBrief(prepared);
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Your request could not be delivered. Please try again.');
      setBrief(prepared);
      setSent(true);
    } catch {
      setError(
        'Your request could not be delivered. Please try again; no booking has been confirmed.',
      );
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HireStella-Consultation-Brief.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (brief)
    return (
      <div id={id} className="form-success pan pan--solid" role="status">
        <Icon name={sent ? 'check' : 'records'} size={30} />
        <h2>{sent ? 'Your request is with the team.' : 'Your brief is ready.'}</h2>
        <p>
          {sent
            ? 'Your consultation request has been delivered. A booking is not confirmed until the team arranges it with you.'
            : 'Download your brief to keep your starting point. Nothing has been sent and no consultation has been booked.'}
        </p>
        <pre>{brief}</pre>
        <div className="inline-actions">
          <button className="btn btn-1" onClick={download}>
            Download my brief
            <Download size={16} />
          </button>
          <button
            className="btn btn-2"
            onClick={() => {
              setBrief('');
              setSent(false);
            }}
          >
            <RotateCcw size={15} />
            Start another brief
          </button>
        </div>
      </div>
    );
  return (
    <form id={id} onSubmit={submit} className={`consultation-form ${compact ? 'form-compact' : ''}`}>
      <div className="form-grid">
        <label className="field">
          <span>Your name</span>
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Full name"
          />
        </label>
        <label className="field">
          <span>Work email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="field">
        <span>Business name</span>
        <input
          name="company"
          autoComplete="organization"
          required
          minLength={2}
          maxLength={160}
          placeholder="Your company or practice"
        />
      </label>
      <label className="field">
        <span>What is slowing your business down?</span>
        <textarea
          name="problem"
          required
          minLength={10}
          maxLength={2000}
          defaultValue={initialProblem.slice(0, 2000)}
          placeholder="Tell us about your team, your workflows, and where you need more capacity."
        />
      </label>
      <div className="form-honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="form-note">
        {configured
          ? 'We use these details to respond to your consultation request. Please do not include confidential customer data. Deployment-specific data handling and retention requirements are discussed during scoping.'
          : 'Consultation delivery is not connected in this preview. Your details stay on this page while you prepare a downloadable brief. Please do not include confidential customer data.'}
      </p>
      <label className="consent-label">
        <input type="checkbox" name="consent" required />
        <span>
          {configured
            ? 'I agree that HireStella may use these details to respond to this consultation request.'
            : 'I understand this prepares a local brief and does not book a consultation.'}
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button disabled={busy} className="btn btn-1" type="submit">
        {busy
          ? 'Sending your request…'
          : configured
            ? 'Request a consultation'
            : 'Prepare my consultation brief'}
        <ArrowUpRight size={17} />
      </button>
    </form>
  );
}
