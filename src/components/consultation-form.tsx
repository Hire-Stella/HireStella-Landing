'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, RotateCcw } from 'lucide-react';
import { Icon } from './ui';
import { demoSchema } from '@/lib/lead-schema';
import { BookingFields, BOOKING_ERROR } from './booking-fields';
import { BOOKED } from './demo-nudge';

export function ConsultationForm({
  configured,
  initialProblem = '',
  compact = false,
  id = 'consultation',
  source = 'book-demo',
}: {
  configured: boolean;
  initialProblem?: string;
  compact?: boolean;
  id?: string;
  /** Which surface this form is on. Carried to /thank-you so one conversion
      can still be segmented by where the lead started. */
  source?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [brief, setBrief] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const fields = new FormData(event.currentTarget);
    /* Every booking form on the site is a demo request (client review, 2026-10-09). */
    const parsed = demoSchema.safeParse({
      ...Object.fromEntries(fields.entries()),
      consent: fields.get('consent') === 'on',
    });
    if (!parsed.success) {
      setError(BOOKING_ERROR);
      return;
    }
    const data = parsed.data;
    const prepared = `HireStella demo request\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nBusiness: ${data.company}\n\nWhat is slowing the business down\n${data.problem || 'Not given'}\n\nThis preview did not send anything. No demo is booked.`;
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
      try {
        sessionStorage.setItem(BOOKED, '1');
      } catch {}
      /* Delivered requests leave for the confirmation page, which is where the
         lead conversion is raised. The inline panel below is now only the
         unconfigured preview path, where nothing was sent and there is nothing
         to confirm. `busy` is deliberately left set: the button stays disabled
         until the navigation replaces the page, so a slow route change cannot
         be submitted a second time. */
      router.push(`/thank-you?src=${encodeURIComponent(source)}`);
    } catch {
      setError(
        'Your request could not be delivered. Please try again, or email sales@hirestella.ai.',
      );
      setBusy(false);
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HireStella-Demo-Request.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (brief)
    return (
      <div id={id} className="form-success pan pan--solid" role="status">
        <Icon name="records" size={30} />
        <h2>Preview only.</h2>
        <p>
          Delivery is not connected here, so nothing was sent and no demo is booked. Download your
          details or email sales@hirestella.ai.
        </p>
        <pre>{brief}</pre>
        <div className="inline-actions">
          <button className="btn btn-1" onClick={download}>
            Download my brief
            <Download size={16} />
          </button>
          <button className="btn btn-2" onClick={() => setBrief('')}>
            <RotateCcw size={15} />
            Start another brief
          </button>
        </div>
      </div>
    );
  return (
    <form id={id} onSubmit={submit} className={`consultation-form ${compact ? 'form-compact' : ''}`}>
      <BookingFields draft={{ problem: initialProblem.slice(0, 2000) }} />
      <label className="consent-label">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that HireStella may contact me about this demo.
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button disabled={busy} className="btn btn-1" type="submit">
        {busy ? 'Sending your request…' : 'Book my demo'}
        <span className="tri" aria-hidden="true" />
      </button>
    </form>
  );
}
