'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Pick a demo time inside the booking form. Slots come live from the HireStella
 * calendar (/api/booking/slots) and show in the visitor's own time zone.
 * Picking is optional: with no time chosen the form is a callback request.
 * When booking is not set up (or the calendar is unreachable) it says nothing
 * and the form works as a callback request, as before.
 */
export function SlotPicker({ value, onChange }: { value: string; onChange: (start: string) => void }) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [day, setDay] = useState('');

  useEffect(() => {
    let live = true;
    fetch('/api/booking/slots', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => live && setSlots(data?.configured ? data.slots : []))
      .catch(() => live && setSlots([]));
    return () => {
      live = false;
    };
  }, []);

  /* Slots grouped by the visitor's local day. */
  const days = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots || []) {
      const key = new Date(s).toLocaleDateString('en-CA');
      map.set(key, [...(map.get(key) || []), s]);
    }
    return [...map.entries()];
  }, [slots]);

  useEffect(() => {
    if (!day && days.length) setDay(days[0][0]);
  }, [days, day]);

  if (slots === null)
    return (
      <p className="slot-note" role="status">
        Loading available times…
      </p>
    );
  if (!days.length) return null;

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
  const times = days.find(([d]) => d === day)?.[1] || [];

  return (
    <fieldset className="slot-picker">
      <legend>
        Pick a time for your demo <em className="opt">(Optional)</em>
      </legend>
      <div className="slot-days" role="listbox" aria-label="Day">
        {days.map(([d, list]) => {
          const date = new Date(list[0]);
          return (
            <button
              key={d}
              type="button"
              role="option"
              aria-selected={d === day}
              className="slot-day"
              onClick={() => setDay(d)}
            >
              <span>{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
              <b>{date.toLocaleDateString(undefined, { day: 'numeric' })}</b>
              <span>{date.toLocaleDateString(undefined, { month: 'short' })}</span>
            </button>
          );
        })}
      </div>
      <div className="slot-times" role="listbox" aria-label="Time">
        {times.map((s) => (
          <button
            key={s}
            type="button"
            role="option"
            aria-selected={s === value}
            className="slot-time"
            onClick={() => onChange(s === value ? '' : s)}
          >
            {new Date(s).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </button>
        ))}
      </div>
      <p className="slot-note">
        {value
          ? `One hour on Google Meet, ${new Date(value).toLocaleString(undefined, { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' })}.`
          : 'Times are in your time zone'}{' '}
        ({zone}).{' '}
        {value ? (
          <button type="button" className="slot-clear" onClick={() => onChange('')}>
            Clear
          </button>
        ) : (
          'No time that suits? Leave it empty and we will call you instead.'
        )}
      </p>
    </fieldset>
  );
}
