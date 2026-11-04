'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BOOKING } from '@/lib/booking/config';

const DUBAI = BOOKING.timeZone;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LENGTH = BOOKING.lengthMinutes * 60_000;
const FORMAT_KEY = 'hs-hour12';

/** "11:00 AM" or "11:00" for an instant, in Dubai time. */
export const dubaiTime = (iso: string | number, hour12: boolean) =>
  new Date(iso).toLocaleTimeString('en-US', { timeZone: DUBAI, hour: hour12 ? 'numeric' : '2-digit', minute: '2-digit', hour12 });

/** The visitor's 12h/24h choice, remembered in this browser when it can be. */
export function useHour12() {
  const [hour12, set] = useState(true);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FORMAT_KEY);
      if (saved) set(saved === '12');
    } catch {}
  }, []);
  const choose = (next: boolean) => {
    set(next);
    try {
      localStorage.setItem(FORMAT_KEY, next ? '12' : '24');
    } catch {}
  };
  return [hour12, choose] as const;
}

/** "2026-11-02" for the Dubai day an instant falls on. */
const dubaiDay = (iso: string | Date) => new Date(iso).toLocaleDateString('en-CA', { timeZone: DUBAI });
/** A "YYYY-MM-DD" key as a UTC-midnight date, for calendar arithmetic only. */
const keyDate = (key: string) => new Date(`${key}T00:00:00Z`);
/** "2026-11" moved by whole months. */
const addMonths = (month: string, by: number) => {
  const d = keyDate(`${month}-01`);
  d.setUTCMonth(d.getUTCMonth() + by);
  return d.toISOString().slice(0, 7);
};

/**
 * A month calendar of the open days, then the one-hour times of the chosen day,
 * all in Dubai time. Taken times show as booked so nobody picks a clash; days
 * with no free time are shown but cannot be picked. Used by the booking form
 * and the manage-booking page.
 */
export function SlotCalendar({
  slots,
  booked = [],
  value,
  onChange,
  hour12: hour12Prop,
  onHour12,
}: {
  slots: string[];
  booked?: string[];
  value: string;
  onChange: (start: string) => void;
  hour12?: boolean;
  onHour12?: (hour12: boolean) => void;
}) {
  const [ownHour12, setOwnHour12] = useHour12();
  const hour12 = hour12Prop ?? ownHour12;
  const setHour12 = onHour12 ?? setOwnHour12;
  /* Every day's times, free and booked, in order. */
  const times = useMemo(() => {
    const map = new Map<string, { start: string; free: boolean }[]>();
    const all = [...slots.map((start) => ({ start, free: true })), ...booked.map((start) => ({ start, free: false }))];
    all.sort((a, b) => a.start.localeCompare(b.start));
    for (const t of all) map.set(dubaiDay(t.start), [...(map.get(dubaiDay(t.start)) || []), t]);
    return map;
  }, [slots, booked]);
  /* The days with at least one free time. */
  const days = useMemo(() => new Set([...times].filter(([, ts]) => ts.some((t) => t.free)).map(([k]) => k)), [times]);
  const keys = [...days];
  const [picked, setPicked] = useState('');
  const day = days.has(picked) ? picked : value && days.has(dubaiDay(value)) ? dubaiDay(value) : keys[0] || '';
  const [month, setMonth] = useState('');
  const shown = month || day.slice(0, 7);
  /* Browsable from this month to at least the next, however far the free days reach. */
  const today = dubaiDay(new Date());
  const firstMonth = today.slice(0, 7);
  const lastMonth = [keys[keys.length - 1]?.slice(0, 7) || '', addMonths(firstMonth, 1)].sort().pop()!;
  const monthHasDays = keys.some((k) => k.startsWith(shown));

  /* The month's cells, Monday first; blanks before the 1st. */
  const cells = useMemo(() => {
    const start = keyDate(`${shown}-01`);
    const lead = (start.getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
    return [
      ...Array.from({ length: lead }, () => ''),
      ...Array.from({ length: count }, (_, i) => `${shown}-${String(i + 1).padStart(2, '0')}`),
    ];
  }, [shown]);

  if (!day) return null;
  const step = (by: number) => {
    const next = addMonths(shown, by);
    setMonth(next);
    /* The times follow the month: its first free day. */
    const first = keys.find((k) => k.startsWith(next));
    if (first) setPicked(first);
  };
  const label = (key: string, opts: Intl.DateTimeFormatOptions) => keyDate(key).toLocaleDateString(undefined, { timeZone: 'UTC', ...opts });

  return (
    <div className="cal">
      <div className="cal-month">
        <div className="cal-head">
          <button type="button" className="cal-nav" onClick={() => step(-1)} disabled={shown <= firstMonth} aria-label="Previous month">
            <ChevronLeft aria-hidden="true" />
          </button>
          <b aria-live="polite">{label(`${shown}-01`, { month: 'long', year: 'numeric' })}</b>
          <button type="button" className="cal-nav" onClick={() => step(1)} disabled={shown >= lastMonth} aria-label="Next month">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <div className="cal-grid">
          {WEEKDAYS.map((w) => (
            <span key={w} className="cal-wd" aria-hidden="true">
              {w}
            </span>
          ))}
          {cells.map((key, i) =>
            key ? (
              <button
                key={key}
                type="button"
                className={`cal-day${key === today ? ' is-today' : ''}`}
                disabled={!days.has(key)}
                aria-pressed={key === day}
                aria-label={label(key, { weekday: 'long', day: 'numeric', month: 'long' }) + (days.has(key) ? '' : ', no free times')}
                onClick={() => setPicked(key)}
              >
                {Number(key.slice(8))}
              </button>
            ) : (
              <span key={`b${i}`} />
            ),
          )}
        </div>
      </div>
      {!monthHasDays ? (
        <p className="slot-note cal-times">
          No times are open in {label(`${shown}-01`, { month: 'long' })} yet. Times open up to a year ahead.
        </p>
      ) : (
      <div className="cal-times">
        <div className="cal-times-top">
          <p className="cal-times-h">{label(day, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <div className="hour-toggle" role="group" aria-label="Time format">
            <button type="button" aria-pressed={hour12} onClick={() => setHour12(true)}>
              12h
            </button>
            <button type="button" aria-pressed={!hour12} onClick={() => setHour12(false)}>
              24h
            </button>
          </div>
        </div>
        <div className="slot-times" role="listbox" aria-label="Time">
          {(times.get(day) || []).map(({ start, free }) => {
            const from = dubaiTime(start, hour12);
            const to = dubaiTime(new Date(start).getTime() + LENGTH, hour12);
            const range = `${from} – ${to}`;
            return (
              <button
                key={start}
                type="button"
                role="option"
                aria-selected={start === value}
                disabled={!free}
                aria-label={free ? range : `${range}, booked`}
                className={`slot-time${free ? '' : ' is-booked'}`}
                onClick={() => onChange(start === value ? '' : start)}
              >
                <span className="slot-from">{from}</span>
                <small>{free ? `to ${to}` : 'Booked'}</small>
              </button>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
}
