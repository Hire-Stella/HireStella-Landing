'use client';

import { useEffect, useMemo, useState } from 'react';

type Details = { start: string; end: string; meetLink: string; firstName: string; past: boolean; slots: string[] };

const long = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' });

/**
 * The guest's booking, from the signed link in their email: see it, move it to
 * another free time, or cancel it. The emails and the sheet follow on the server.
 */
export function ManageBooking({ token }: { token: string }) {
  const [details, setDetails] = useState<Details | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'moving' | 'moved' | 'cancelled' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [day, setDay] = useState('');
  const [chosen, setChosen] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/booking/manage?t=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) throw new Error(data?.error || 'This link is not valid.');
        setDetails(data);
        setState('ready');
      })
      .catch((e: Error) => {
        setMessage(e.message);
        setState('error');
      });
  }, [token]);

  const days = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of details?.slots || []) {
      const key = new Date(s).toLocaleDateString('en-CA');
      map.set(key, [...(map.get(key) || []), s]);
    }
    return [...map.entries()];
  }, [details]);
  useEffect(() => {
    if (!day && days.length) setDay(days[0][0]);
  }, [days, day]);

  async function act(body: Record<string, string>) {
    setBusy(true);
    setMessage('');
    try {
      const r = await fetch('/api/booking/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...body }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) throw new Error(data?.error || 'That did not work. Please try again.');
      return data;
    } finally {
      setBusy(false);
    }
  }

  async function move() {
    try {
      const data = await act({ action: 'reschedule', start: chosen });
      setDetails((d) => (d ? { ...d, start: data.start, end: data.end } : d));
      setState('moved');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  async function cancelIt() {
    if (!window.confirm('Cancel your demo?')) return;
    try {
      await act({ action: 'cancel' });
      setState('cancelled');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }

  if (state === 'loading') return <p role="status">Loading your booking…</p>;
  if (state === 'error' || !details)
    return (
      <div className="manage-card pan pan--solid">
        <h1 className="manage-h">This link cannot open a booking.</h1>
        <p>{message}</p>
        <a className="btn btn-1" href="/book-demo">
          Book a demo <span className="tri" aria-hidden="true" />
        </a>
      </div>
    );
  if (state === 'cancelled')
    return (
      <div className="manage-card pan pan--solid" role="status">
        <h1 className="manage-h">Your demo is cancelled.</h1>
        <p>We have emailed you a confirmation. Whenever you are ready, pick a new time.</p>
        <a className="btn btn-1" href="/book-demo">
          Book a new time <span className="tri" aria-hidden="true" />
        </a>
      </div>
    );

  const times = days.find(([d]) => d === day)?.[1] || [];
  return (
    <div className="manage-card pan pan--solid">
      <p className="eyebrow eyebrow--sig">Your HireStella demo</p>
      <h1 className="manage-h">
        {state === 'moved' ? 'Moved. ' : details.firstName ? `Hi ${details.firstName}. ` : ''}
        <span className="manage-when">{long(details.start)}</span>
      </h1>
      <p>
        One hour on Google Meet.{' '}
        {details.meetLink && (
          <a href={details.meetLink} target="_blank" rel="noopener noreferrer">
            Join link
          </a>
        )}
        {state === 'moved' && ' We have emailed you the new time.'}
      </p>

      {details.past ? (
        <p>This demo has already taken place.</p>
      ) : (
        <>
          {state !== 'moving' ? (
            <div className="manage-actions">
              <button className="btn btn-1" type="button" onClick={() => setState('moving')} disabled={busy}>
                Pick another time
              </button>
              <button className="btn btn-2" type="button" onClick={cancelIt} disabled={busy}>
                Cancel the demo
              </button>
            </div>
          ) : (
            <fieldset className="slot-picker">
              <legend>Pick a new time</legend>
              {!days.length && <p className="slot-note">No other times are open right now. Reply to your confirmation email and we will find one.</p>}
              <div className="slot-days" role="listbox" aria-label="Day">
                {days.map(([d, list]) => {
                  const date = new Date(list[0]);
                  return (
                    <button key={d} type="button" role="option" aria-selected={d === day} className="slot-day" onClick={() => setDay(d)}>
                      <span>{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                      <b>{date.toLocaleDateString(undefined, { day: 'numeric' })}</b>
                      <span>{date.toLocaleDateString(undefined, { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
              <div className="slot-times" role="listbox" aria-label="Time">
                {times.map((s) => (
                  <button key={s} type="button" role="option" aria-selected={s === chosen} className="slot-time" onClick={() => setChosen(s)}>
                    {new Date(s).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </button>
                ))}
              </div>
              <div className="manage-actions">
                <button className="btn btn-1" type="button" onClick={move} disabled={!chosen || busy}>
                  {busy ? 'Moving…' : chosen ? `Move to ${long(chosen)}` : 'Choose a time'}
                </button>
                <button className="btn btn-2" type="button" onClick={() => setState('ready')} disabled={busy}>
                  Keep the current time
                </button>
              </div>
            </fieldset>
          )}
        </>
      )}
      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
