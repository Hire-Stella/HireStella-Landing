'use client';

import { useEffect, useState } from 'react';
import { BOOKING } from '@/lib/booking/config';
import { SlotCalendar, dubaiTime, useHour12 } from './slot-calendar';

const DUBAI = BOOKING.timeZone;

/**
 * Pick a demo time inside the booking form. Slots come live from the HireStella
 * calendar (/api/booking/slots) and show in Dubai time, wherever the visitor is.
 * Picking is optional: with no time chosen the form is a callback request.
 * When booking is not set up (or the calendar is unreachable) it says nothing
 * and the form works as a callback request, as before.
 */
export function SlotPicker({ value, onChange }: { value: string; onChange: (start: string) => void }) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [booked, setBooked] = useState<string[]>([]);
  const [hour12, setHour12] = useHour12();

  useEffect(() => {
    let live = true;
    fetch('/api/booking/slots', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!live) return;
        setSlots(data?.configured ? data.slots : []);
        setBooked(data?.configured && Array.isArray(data.booked) ? data.booked : []);
      })
      .catch(() => live && setSlots([]));
    return () => {
      live = false;
    };
  }, []);

  if (slots === null)
    return (
      <p className="slot-note" role="status">
        Loading available times…
      </p>
    );
  if (!slots.length) return null;

  return (
    <fieldset className="slot-picker">
      <legend>
        Pick a time for your demo <em className="opt">(Optional)</em>
      </legend>
      <SlotCalendar slots={slots} booked={booked} value={value} onChange={onChange} hour12={hour12} onHour12={setHour12} />
      <p className="slot-note">
        {value
          ? `One hour on Google Meet, ${new Date(value).toLocaleDateString(undefined, { timeZone: DUBAI, weekday: 'long', day: 'numeric', month: 'long' })}, ${dubaiTime(value, hour12)} – ${dubaiTime(new Date(value).getTime() + BOOKING.lengthMinutes * 60_000, hour12)}.`
          : 'Times are'}{' '}
        UAE time (Dubai, GMT+4).{' '}
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
