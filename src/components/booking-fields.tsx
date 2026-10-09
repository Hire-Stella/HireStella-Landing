'use client';

import { useState, type Ref } from 'react';
import { HEARD_FROM } from '@/lib/lead-schema';

/**
 * The booking form's fields, shared by the demo modal, /book-demo and /contact
 * so the three can never drift apart.
 *
 * Client review, 2026-10-09: four required fields marked with an asterisk,
 * everything else labelled "(Optional)", and nothing else asked.
 */
export function BookingFields({
  draft = {},
  firstRef,
}: {
  draft?: Record<string, string>;
  firstRef?: Ref<HTMLInputElement>;
}) {
  const [heard, setHeard] = useState(draft.heardFrom ?? '');
  return (
    <>
      <div className="form-grid">
        <label className="field">
          <span>
            Your name <Req />
          </span>
          <input ref={firstRef} name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Full name" defaultValue={draft.name ?? ''} />
        </label>
        <label className="field">
          <span>
            Work email <Req />
          </span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" defaultValue={draft.email ?? ''} />
        </label>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>
            Phone number <Req />
          </span>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={24} placeholder="+971 50 123 4567" defaultValue={draft.phone ?? ''} />
        </label>
        <label className="field">
          <span>
            Business name <Req />
          </span>
          <input name="company" autoComplete="organization" required minLength={2} maxLength={160} placeholder="Company or practice" defaultValue={draft.company ?? ''} />
        </label>
      </div>
      <label className="field">
        <span>
          What is slowing your business down? <Opt />
        </span>
        <textarea name="problem" maxLength={2000} rows={3} placeholder="Missed calls, slow replies, follow-ups that slip…" defaultValue={draft.problem ?? ''} />
      </label>
      <div className={heard === 'Referral' ? 'form-grid' : undefined}>
        <label className="field">
          <span>
            How did you hear about us? <Opt />
          </span>
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
              Who referred you? <Opt />
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
    </>
  );
}

/** Required: an asterisk, announced as "required" by the input itself. */
function Req() {
  return (
    <b className="req" aria-hidden="true">
      *
    </b>
  );
}

function Opt() {
  return <em className="opt">(Optional)</em>;
}

export const BOOKING_ERROR =
  'Please add your name, a valid work email, a phone number with country code and your business name.';
